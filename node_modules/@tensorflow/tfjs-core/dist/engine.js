/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import { KernelBackend } from './backends/backend';
import { Environment, setEnvironmentGlobal } from './environment';
import { getGlobalNamespace } from './global_util';
import { Add, Cast, Identity } from './kernel_names';
import { getGradient, getKernel, getKernelsForBackend } from './kernel_registry';
import * as log from './log';
import { Profiler } from './profiler';
import { backpropagateGradients, getFilteredNodesXToY } from './tape';
import { setTensorTracker, Tensor, Variable } from './tensor';
import { getTensorsInContainer } from './tensor_util';
import * as util from './util';
import { bytesFromStringArray, makeOnesTypedArray, now, sizeFromShape } from './util';
function isRegisteredKernelInvocation(kernelInvocation) {
    return kernelInvocation.kernelName != null;
}
class EngineState {
    constructor() {
        // Public since optimizers will use it.
        this.registeredVariables = {};
        this.nextTapeNodeId = 0;
        this.numBytes = 0;
        this.numTensors = 0;
        this.numStringTensors = 0;
        this.numDataBuffers = 0;
        // Number of nested tf.grad() statements when computing higher-order
        // gradients. E.g. `1` for first-order gradients and `2` for second-order
        // gradients. Used to track if the tape should be removed after a backprop.
        this.gradientDepth = 0;
        // Number of nested kernel calls. When kernel depth is greater than 1, we turn
        // off the tape.
        this.kernelDepth = 0;
        this.scopeStack = [];
        /**
         * Keeps track of the number of data moves during a kernel execution. We
         * maintain a stack since kernels can call other kernels, recursively.
         */
        this.numDataMovesStack = [];
        this.nextScopeId = 0;
        this.tensorInfo = new WeakMap();
        this.profiling = false;
        this.activeProfile = {
            newBytes: 0,
            newTensors: 0,
            peakBytes: 0,
            kernels: [],
            result: null,
            get kernelNames() {
                return Array.from(new Set(this.kernels.map(k => k.name)));
            }
        };
    }
    dispose() {
        for (const variableName in this.registeredVariables) {
            this.registeredVariables[variableName].dispose();
        }
    }
}
export class Engine {
    constructor(ENV) {
        this.ENV = ENV;
        this.registry = {};
        this.registryFactory = {};
        this.pendingBackendInitId = 0;
        this.state = new EngineState();
    }
    async ready() {
        if (this.pendingBackendInit != null) {
            return this.pendingBackendInit.then(() => { });
        }
        if (this.backendInstance != null) {
            return;
        }
        const sortedBackends = this.getSortedBackends();
        for (let i = 0; i < sortedBackends.length; i++) {
            const backendName = sortedBackends[i];
            const success = await this.initializeBackend(backendName).success;
            if (success) {
                await this.setBackend(backendName);
                return;
            }
        }
        throw new Error(`Could not initialize any backends, all backend initializations ` +
            `failed.`);
    }
    get backend() {
        if (this.pendingBackendInit != null) {
            throw new Error(`Backend '${this.backendName}' has not yet been initialized. Make ` +
                `sure to await tf.ready() or await tf.setBackend() before calling ` +
                `other methods`);
        }
        if (this.backendInstance == null) {
            const { name, asyncInit } = this.initializeBackendsAndReturnBest();
            if (asyncInit) {
                throw new Error(`The highest priority backend '${name}' has not yet been ` +
                    `initialized. Make sure to await tf.ready() or ` +
                    `await tf.setBackend() before calling other methods`);
            }
            this.setBackend(name);
        }
        return this.backendInstance;
    }
    backendNames() {
        return Object.keys(this.registryFactory);
    }
    findBackend(backendName) {
        if (!(backendName in this.registry)) {
            // If the backend hasn't been initialized but we have a registry entry for
            // it, initialize it and return it.
            if (backendName in this.registryFactory) {
                const { asyncInit } = this.initializeBackend(backendName);
                if (asyncInit) {
                    // Backend is not ready yet.
                    return null;
                }
            }
            else {
                return null;
            }
        }
        return this.registry[backendName];
    }
    findBackendFactory(backendName) {
        if (!(backendName in this.registryFactory)) {
            return null;
        }
        return this.registryFactory[backendName].factory;
    }
    registerBackend(backendName, factory, priority = 1) {
        if (backendName in this.registryFactory) {
            log.warn(`${backendName} backend was already registered. ` +
                `Reusing existing backend factory.`);
            return false;
        }
        this.registryFactory[backendName] = { factory, priority };
        return true;
    }
    async setBackend(backendName) {
        if (this.registryFactory[backendName] == null) {
            throw new Error(`Backend name '${backendName}' not found in registry`);
        }
        this.backendName = backendName;
        if (this.registry[backendName] == null) {
            this.backendInstance = null;
            const { success, asyncInit } = this.initializeBackend(backendName);
            const result = asyncInit ? await success : success;
            if (!result) {
                return false;
            }
        }
        this.backendInstance = this.registry[backendName];
        this.setupRegisteredKernels();
        // Reset the profiler.
        this.profiler = new Profiler(this.backendInstance);
        return true;
    }
    setupRegisteredKernels() {
        const kernels = getKernelsForBackend(this.backendName);
        kernels.forEach(kernel => {
            if (kernel.setupFunc != null) {
                kernel.setupFunc(this.backendInstance);
            }
        });
    }
    disposeRegisteredKernels(backendName) {
        const kernels = getKernelsForBackend(backendName);
        kernels.forEach(kernel => {
            if (kernel.disposeFunc != null) {
                kernel.disposeFunc(this.registry[backendName]);
            }
        });
    }
    /**
     * Initializes a backend by looking up the backend name in the factory
     * registry and calling the factory method. Returns a boolean representing
     * whether the initialization of the backend suceeded. Throws an error if
     * there is no backend in the factory registry.
     */
    initializeBackend(backendName) {
        const registryFactoryEntry = this.registryFactory[backendName];
        if (registryFactoryEntry == null) {
            throw new Error(`Cannot initialize backend ${backendName}, no registration found.`);
        }
        try {
            const backend = registryFactoryEntry.factory();
            /* Test if the factory returns a promise.
            Done in a more liberal way than
            previous 'Promise.resolve(backend)===backend'
            as we needed to account for custom Promise
            implementations (e.g. Angular) */
            if (backend && !(backend instanceof KernelBackend) &&
                typeof backend.then === 'function') {
                const promiseId = ++this.pendingBackendInitId;
                const success = backend
                    .then(backendInstance => {
                    // Outdated promise. Another backend was set in the meantime.
                    if (promiseId < this.pendingBackendInitId) {
                        return false;
                    }
                    this.registry[backendName] = backendInstance;
                    this.pendingBackendInit = null;
                    return true;
                })
                    .catch(err => {
                    // Outdated promise. Another backend was set in the meantime.
                    if (promiseId < this.pendingBackendInitId) {
                        return false;
                    }
                    this.pendingBackendInit = null;
                    log.warn(`Initialization of backend ${backendName} failed`);
                    log.warn(err.stack || err.message);
                    return false;
                });
                this.pendingBackendInit = success;
                return { success, asyncInit: true };
            }
            else {
                this.registry[backendName] = backend;
                return { success: true, asyncInit: false };
            }
        }
        catch (err) {
            log.warn(`Initialization of backend ${backendName} failed`);
            log.warn(err.stack || err.message);
            return { success: false, asyncInit: false };
        }
    }
    removeBackend(backendName) {
        if (!(backendName in this.registryFactory)) {
            throw new Error(`${backendName} backend not found in registry`);
        }
        if (this.backendName === backendName && this.pendingBackendInit != null) {
            // There is a pending promise of the backend we want to remove. Make it
            // obsolete.
            this.pendingBackendInitId++;
        }
        if (backendName in this.registry) {
            this.disposeRegisteredKernels(backendName);
            this.registry[backendName].dispose();
            delete this.registry[backendName];
        }
        delete this.registryFactory[backendName];
        // Unset the backend if it is active.
        if (this.backendName === backendName) {
            this.pendingBackendInit = null;
            this.backendName = null;
            this.backendInstance = null;
        }
    }
    getSortedBackends() {
        if (Object.keys(this.registryFactory).length === 0) {
            throw new Error('No backend found in registry.');
        }
        return Object.keys(this.registryFactory).sort((a, b) => {
            // Highest priority comes first.
            return this.registryFactory[b].priority -
                this.registryFactory[a].priority;
        });
    }
    initializeBackendsAndReturnBest() {
        const sortedBackends = this.getSortedBackends();
        for (let i = 0; i < sortedBackends.length; i++) {
            const backendName = sortedBackends[i];
            const { success, asyncInit } = this.initializeBackend(backendName);
            if (asyncInit || success) {
                return { name: backendName, asyncInit };
            }
        }
        throw new Error(`Could not initialize any backends, all backend initializations ` +
            `failed.`);
    }
    moveData(backend, dataId) {
        const info = this.state.tensorInfo.get(dataId);
        const srcBackend = info.backend;
        const values = this.readSync(dataId);
        const refCount = srcBackend.refCount(dataId);
        // Delete the tensor from the old backend and move it to the new
        // backend.
        srcBackend.disposeData(dataId, true);
        info.backend = backend;
        backend.move(dataId, values, info.shape, info.dtype, refCount);
        if (this.shouldCheckForMemLeaks()) {
            // Track the number of moves during a kernel execution to correctly
            // detect memory leaks.
            this.state.numDataMovesStack[this.state.numDataMovesStack.length - 1]++;
        }
    }
    tidy(nameOrFn, fn) {
        let name = null;
        if (fn == null) {
            // Called with only 1 argument.
            if (typeof nameOrFn !== 'function') {
                throw new Error('Please provide a function to tidy()');
            }
            fn = nameOrFn;
        }
        else {
            // Called with 2 arguments.
            if (typeof nameOrFn !== 'string' && !(nameOrFn instanceof String)) {
                throw new Error('When calling with two arguments, the first argument ' +
                    'to tidy() must be a string');
            }
            if (typeof fn !== 'function') {
                throw new Error('When calling with two arguments, the 2nd argument ' +
                    'to tidy() must be a function');
            }
            name = nameOrFn;
            // TODO(nsthorat,smilkov): Do operation logging and performance
            // profiling.
        }
        let result;
        return this.scopedRun(() => this.startScope(name), () => this.endScope(result), () => {
            result = fn();
            if (result instanceof Promise) {
                console.error('Cannot return a Promise inside of tidy.');
            }
            return result;
        });
    }
    scopedRun(start, end, f) {
        start();
        try {
            const res = f();
            end();
            return res;
        }
        catch (ex) {
            end();
            throw ex;
        }
    }
    nextTensorId() {
        return Engine.nextTensorId++;
    }
    nextVariableId() {
        return Engine.nextVariableId++;
    }
    /**
     * This method is called instead of the public-facing tensor.clone() when
     * saving a tensor for backwards pass. It makes sure to add the clone
     * operation to the tape regardless of being called inside a kernel
     * execution.
     */
    clone(x) {
        const y = ENGINE.runKernel(Identity, { x });
        const inputs = { x };
        const grad = (dy) => ({
            x: () => {
                const dtype = 'float32';
                const gradInputs = { x: dy };
                const attrs = { dtype };
                return ENGINE.runKernel(Cast, gradInputs, 
                // tslint:disable-next-line: no-unnecessary-type-assertion
                attrs);
            }
        });
        const saved = [];
        this.addTapeNode(this.state.activeScope.name, inputs, [y], grad, saved, {});
        return y;
    }
    /**
     * Execute a kernel with the given name and return the output tensor.
     *
     * @param kernelName The name of the kernel to execute.
     * @param inputs A map of input names to tensors.
     * @param attrs A map of attribute names to their values. An attribute is a
     *     primitive (non-tensor) input to the kernel.
     * @param inputsToSave A list of tensors, inputs to save for the backprop
     *     computation.
     * @param outputsToSave A list of booleans, specifying which output to save
     *     for the backprop computation. These are booleans since the output
     * tensors are not visible to the user.
     */
    runKernel(kernelName, inputs, attrs) {
        if (this.backendName == null) {
            // backend has not been initialized yet (backend initialization is lazy
            // can be deferred until an op/ kernel is run).
            // The below getter has side effects that will try to initialize the
            // backend and set properties like this.backendName
            // tslint:disable-next-line: no-unused-expression
            this.backend;
        }
        const hasKernel = getKernel(kernelName, this.backendName) != null;
        if (!hasKernel) {
            throw new Error(`Kernel '${kernelName}' not registered for backend '${this.backendName}'`);
        }
        return this.runKernelFunc({ kernelName, inputs, attrs });
    }
    shouldCheckForMemLeaks() {
        return this.ENV.getBool('IS_TEST');
    }
    checkKernelForMemLeak(kernelName, numDataIdsBefore, outInfos) {
        const numDataIdsAfter = this.backend.numDataIds();
        // Count the number of data ids associated with the result of the kernel.
        let numOutputDataIds = 0;
        outInfos.forEach(info => {
            // Complex numbers allocate 3 data ids, one for 'real', one for
            // 'imaginary', and one for the container that holds the former two.
            numOutputDataIds += (info.dtype === 'complex64' ? 3 : 1);
        });
        // Account for the number of moves during kernel execution. A "data move"
        // can happen in the middle of a kernel execution, placing a new (key,value)
        // pair in the data storage. Since data moves have net zero effect (we
        // always remove the data from the old backend), we have to cancel them out
        // when detecting memory leaks.
        const numMoves = this.state.numDataMovesStack[this.state.numDataMovesStack.length - 1];
        const dataIdsLeaked = numDataIdsAfter - numDataIdsBefore - numOutputDataIds - numMoves;
        if (dataIdsLeaked > 0) {
            throw new Error(`Backend '${this.backendName}' has an internal memory leak ` +
                `(${dataIdsLeaked} data ids) after running '${kernelName}'`);
        }
    }
    /**
     * Internal helper method to execute a kernel Func
     *
     * Use `runKernel` to execute kernels from outside of engine.
     */
    runKernelFunc(kernelParams) {
        let outputs;
        let saved = [];
        const isTapeOn = this.isTapeOn();
        const startingBytecount = this.state.numBytes;
        const startingNumTensors = this.state.numTensors;
        if (this.shouldCheckForMemLeaks()) {
            this.state.numDataMovesStack.push(0);
        }
        let kernelFunc;
        if (this.backendName == null) {
            // backend has not been initialized yet (backend initialization is lazy
            // can be deferred until an op/ kernel is run).
            // The below getter has side effects that will try to initialize the
            // backend and set properties like this.backendName
            // tslint:disable-next-line: no-unused-expression
            this.backend;
        }
        let out;
        const kernelOrScopeName = isRegisteredKernelInvocation(kernelParams) ?
            kernelParams.kernelName :
            this.state.activeScope != null ? this.state.activeScope.name : '';
        // Create the kernelFunc from either a registered kernel OR passed in
        // forward/backward functions (used by custom grad). In this context a
        // kernelFunc wraps a kernel implementation with some bookkeeping.
        if (isRegisteredKernelInvocation(kernelParams)) {
            const { kernelName, inputs, attrs } = kernelParams;
            if (this.backendName == null) {
                // backend has not been initialized yet (backend initialization is lazy
                // can be deferred until an op/ kernel is run).
                // The below getter has side effects that will try to initialize the
                // backend and set properties like this.backendName
                // tslint:disable-next-line: no-unused-expression
                this.backend;
            }
            const kernel = getKernel(kernelName, this.backendName);
            util.assert(kernel != null, () => `Cannot find registered kernel '${kernelName}' for backend '${this.backendName}'`);
            kernelFunc = () => {
                const numDataIdsBefore = this.backend.numDataIds();
                out = kernel.kernelFunc({ inputs, attrs, backend: this.backend });
                const outInfos = Array.isArray(out) ? out : [out];
                if (this.shouldCheckForMemLeaks()) {
                    this.checkKernelForMemLeak(kernelName, numDataIdsBefore, outInfos);
                }
                const outTensors = outInfos.map((outInfo) => {
                    // todo (yassogba) remove this option (Tensor) when node backend
                    // methods have been modularized and they all return tensorInfo.
                    // TensorInfos do not have a rank attribute.
                    if (outInfo.rank != null) {
                        return outInfo;
                    }
                    return this.makeTensorFromTensorInfo(outInfo);
                });
                // Save any required inputs and outputs.
                // Do not save unless we are recording to the tape. Otherwise it would
                // cause a mem leak since there would be no backprop for these tensors
                // (which would otherwise dispose them).
                if (isTapeOn) {
                    const tensorsToSave = this.getTensorsForGradient(kernelName, inputs, outTensors);
                    saved = this.saveTensorsForBackwardMode(tensorsToSave);
                }
                return outTensors;
            };
        }
        else {
            const { forwardFunc } = kernelParams;
            // Running a customGrad op.
            const saveFunc = (tensors) => {
                // Do not save unless we are recording to the tape. Otherwise it would
                // cause a mem leak since we would never run backprop, which disposes
                // the kept tensors.
                if (!isTapeOn) {
                    return;
                }
                saved = tensors.map(tensor => this.keep(this.clone(tensor)));
            };
            kernelFunc = () => {
                const numDataIdsBefore = this.backend.numDataIds();
                out = this.tidy(() => forwardFunc(this.backend, saveFunc));
                const outs = (Array.isArray(out) ? out : [out]);
                if (this.shouldCheckForMemLeaks()) {
                    // Scope name is used to print a more helpful error message if needed.
                    this.checkKernelForMemLeak(kernelOrScopeName, numDataIdsBefore, outs);
                }
                return outs;
            };
        }
        //
        // Run the kernelFunc. Optionally profiling it.
        //
        const { inputs, attrs } = kernelParams;
        const backwardsFunc = isRegisteredKernelInvocation(kernelParams) ?
            null :
            kernelParams.backwardsFunc;
        let kernelProfile;
        this.scopedRun(
        // Stop recording to a tape when running a kernel.
        () => this.state.kernelDepth++, () => this.state.kernelDepth--, () => {
            if (!this.ENV.getBool('DEBUG') && !this.state.profiling) {
                outputs = kernelFunc();
            }
            else {
                kernelProfile = this.profiler.profileKernel(kernelOrScopeName, inputs, () => kernelFunc());
                if (this.ENV.getBool('DEBUG')) {
                    this.profiler.logKernelProfile(kernelProfile);
                }
                outputs = kernelProfile.outputs;
            }
        });
        if (isTapeOn) {
            this.addTapeNode(kernelOrScopeName, inputs, outputs, backwardsFunc, saved, attrs);
        }
        if (this.state.profiling) {
            this.state.activeProfile.kernels.push({
                name: kernelOrScopeName,
                bytesAdded: this.state.numBytes - startingBytecount,
                totalBytesSnapshot: this.state.numBytes,
                tensorsAdded: this.state.numTensors - startingNumTensors,
                totalTensorsSnapshot: this.state.numTensors,
                inputShapes: Object.keys(inputs).map(key => inputs[key] != null ? inputs[key].shape : null),
                outputShapes: outputs.map(item => item.shape),
                kernelTimeMs: kernelProfile.timeMs,
                extraInfo: kernelProfile.extraInfo
            });
        }
        return (Array.isArray(out) ? outputs : outputs[0]);
    }
    /**
     * Saves tensors used in forward mode for use in backward mode.
     *
     * @param tensors the list of tensors to save.
     */
    saveTensorsForBackwardMode(tensors) {
        const saved = tensors.map(tensor => this.keep(this.clone(tensor)));
        return saved;
    }
    /**
     * Returns a list of tensors to save for a given gradient calculation.
     *
     * @param kernelName name of kernel to look up gradient for.
     * @param inputs a map of input tensors.
     * @param outputs an array of output tensors from forward mode of kernel.
     */
    getTensorsForGradient(kernelName, inputs, outputs) {
        const gradConfig = getGradient(kernelName);
        if (gradConfig != null) {
            const inputsToSave = gradConfig.inputsToSave || [];
            const outputsToSave = gradConfig.outputsToSave || [];
            // If saveAllInputs is true, all inputs will be saved. Otherwise, inputs
            // specified in inputsToSave will be saved.
            let inputTensorsToSave;
            if (gradConfig.saveAllInputs) {
                util.assert(Array.isArray(inputs), () => 'saveAllInputs is true, expected inputs to be an array.');
                inputTensorsToSave = Object.keys(inputs).map((key) => inputs[key]);
            }
            else {
                inputTensorsToSave = inputsToSave.map((inputName) => inputs[inputName]);
            }
            const outputTensorsToSave = outputs.filter((_, i) => outputsToSave[i]);
            return inputTensorsToSave.concat(outputTensorsToSave);
        }
        // We return an empty list rather than throw an error because the kernel we
        // are looking up may not actually be relevant to backproping through the
        // overall function
        //
        // See 'does not error if irrelevant (pruned) ops are missing grads' test
        // in gradients_test.ts for an example.
        return [];
    }
    /**
     * Internal method used by public APIs for tensor creation. Makes a new
     * tensor with the provided shape, dtype and values. It always
     * creates a new data id and writes the values to the underlying backend.
     */
    makeTensor(values, shape, dtype, backend) {
        if (values == null) {
            throw new Error('Values passed to engine.makeTensor() are null');
        }
        dtype = dtype || 'float32';
        backend = backend || this.backend;
        let backendVals = values;
        if (dtype === 'string' && util.isString(values[0])) {
            backendVals = values.map(d => util.encodeString(d));
        }
        const dataId = backend.write(backendVals, shape, dtype);
        const t = new Tensor(shape, dtype, dataId, this.nextTensorId());
        this.trackTensor(t, backend);
        // Count bytes for string tensors.
        if (dtype === 'string') {
            const info = this.state.tensorInfo.get(dataId);
            const newBytes = bytesFromStringArray(backendVals);
            this.state.numBytes += newBytes - info.bytes;
            info.bytes = newBytes;
        }
        return t;
    }
    /**
     * Internal method used by backends. Makes a new tensor
     * that is a wrapper around an existing data id. It doesn't create
     * a new data id, only increments the ref count used in memory tracking.
     * @deprecated
     */
    makeTensorFromDataId(dataId, shape, dtype, backend) {
        dtype = dtype || 'float32';
        const tensorInfo = { dataId, shape, dtype };
        return this.makeTensorFromTensorInfo(tensorInfo, backend);
    }
    /**
     * Internal method used by backends. Makes a new tensor that is a wrapper
     * around an existing data id in TensorInfo. It doesn't create a new data id,
     * only increments the ref count used in memory tracking.
     */
    makeTensorFromTensorInfo(tensorInfo, backend) {
        const { dataId, shape, dtype } = tensorInfo;
        const t = new Tensor(shape, dtype, dataId, this.nextTensorId());
        this.trackTensor(t, backend);
        return t;
    }
    makeVariable(initialValue, trainable = true, name, dtype) {
        name = name || this.nextVariableId().toString();
        if (dtype != null && dtype !== initialValue.dtype) {
            initialValue = initialValue.cast(dtype);
        }
        const v = new Variable(initialValue, trainable, name, this.nextTensorId());
        if (this.state.registeredVariables[v.name] != null) {
            throw new Error(`Variable with name ${v.name} was already registered`);
        }
        this.state.registeredVariables[v.name] = v;
        this.incRef(v, this.backend);
        return v;
    }
    trackTensor(a, backend) {
        this.state.numTensors++;
        if (a.dtype === 'string') {
            this.state.numStringTensors++;
        }
        // Bytes for complex numbers are counted by their components. Bytes for
        // string tensors are counted when writing values.
        let bytes = 0;
        if (a.dtype !== 'complex64' && a.dtype !== 'string') {
            bytes = a.size * util.bytesPerElement(a.dtype);
        }
        this.state.numBytes += bytes;
        if (!this.state.tensorInfo.has(a.dataId)) {
            this.state.numDataBuffers++;
            this.state.tensorInfo.set(a.dataId, {
                backend: backend || this.backend,
                dtype: a.dtype,
                shape: a.shape,
                bytes
            });
        }
        if (!(a instanceof Variable)) {
            this.track(a);
        }
    }
    // Track the tensor by dataId and increase the refCount for the dataId in the
    // backend.
    // TODO(pyu10055): This is currently used by makeVariable method, to increase
    // refCount on the backend for the dataId. It can potentially be replaced with
    // Identity op indead of calling backend directly.
    incRef(a, backend) {
        this.trackTensor(a, backend);
        this.backend.incRef(a.dataId);
    }
    removeDataId(dataId, backend) {
        if (this.state.tensorInfo.has(dataId) &&
            this.state.tensorInfo.get(dataId).backend === backend) {
            this.state.tensorInfo.delete(dataId);
            this.state.numDataBuffers--;
        }
    }
    disposeTensor(a) {
        if (!this.state.tensorInfo.has(a.dataId)) {
            return;
        }
        const info = this.state.tensorInfo.get(a.dataId);
        this.state.numTensors--;
        if (a.dtype === 'string') {
            this.state.numStringTensors--;
            this.state.numBytes -= info.bytes;
        }
        // Don't count bytes for complex numbers as they are counted by their
        // components.
        if (a.dtype !== 'complex64' && a.dtype !== 'string') {
            const bytes = a.size * util.bytesPerElement(a.dtype);
            this.state.numBytes -= bytes;
        }
        // Remove the reference to dataId if backend dispose the data successfully
        if (info.backend.disposeData(a.dataId)) {
            this.removeDataId(a.dataId, info.backend);
        }
        // TODO(nsthorat): Construct an error and save the stack trace for
        // debugging when in debug mode. Creating a stack trace is too expensive
        // to do unconditionally.
    }
    disposeVariables() {
        for (const varName in this.state.registeredVariables) {
            const v = this.state.registeredVariables[varName];
            this.disposeVariable(v);
        }
    }
    disposeVariable(v) {
        this.disposeTensor(v);
        if (this.state.registeredVariables[v.name] != null) {
            delete this.state.registeredVariables[v.name];
        }
    }
    memory() {
        const info = this.backend.memory();
        info.numTensors = this.state.numTensors;
        info.numDataBuffers = this.state.numDataBuffers;
        info.numBytes = this.state.numBytes;
        if (this.state.numStringTensors > 0) {
            info.unreliable = true;
            if (info.reasons == null) {
                info.reasons = [];
            }
            info.reasons.push('Memory usage by string tensors is approximate ' +
                '(2 bytes per character)');
        }
        return info;
    }
    async profile(query) {
        this.state.profiling = true;
        const startBytes = this.state.numBytes;
        const startNumTensors = this.state.numTensors;
        this.state.activeProfile.kernels = [];
        this.state.activeProfile.result = await query();
        this.state.profiling = false;
        this.state.activeProfile.peakBytes = Math.max(...this.state.activeProfile.kernels.map(d => d.totalBytesSnapshot));
        this.state.activeProfile.newBytes = this.state.numBytes - startBytes;
        this.state.activeProfile.newTensors =
            this.state.numTensors - startNumTensors;
        for (const kernel of this.state.activeProfile.kernels) {
            kernel.kernelTimeMs = await kernel.kernelTimeMs;
            kernel.extraInfo = await kernel.extraInfo;
        }
        return this.state.activeProfile;
    }
    isTapeOn() {
        return this.state.gradientDepth > 0 && this.state.kernelDepth === 0;
    }
    addTapeNode(kernelName, inputs, outputs, gradientsFunc, saved, attrs) {
        const tapeNode = { id: this.state.nextTapeNodeId++, kernelName, inputs, outputs, saved };
        const gradConfig = getGradient(kernelName);
        if (gradConfig != null) {
            gradientsFunc = gradConfig.gradFunc;
        }
        if (gradientsFunc != null) {
            tapeNode.gradient = (dys) => {
                // TODO(smilkov): To optimize back-prop, pass dys that are not used in
                // the backprop graph to the user as null instead of zeros
                dys = dys.map((dy, i) => {
                    if (dy == null) {
                        const output = outputs[i];
                        const vals = util.makeZerosTypedArray(output.size, output.dtype);
                        return this.makeTensor(vals, output.shape, output.dtype);
                    }
                    return dy;
                });
                // Grad functions of ops with single outputs expect a dy, while ops
                // with multiple outputs expect dys (array of dy).
                return gradientsFunc(dys.length > 1 ? dys : dys[0], saved, attrs);
            };
        }
        this.state.activeTape.push(tapeNode);
    }
    keep(result) {
        result.kept = true;
        return result;
    }
    startTape() {
        if (this.state.gradientDepth === 0) {
            this.state.activeTape = [];
        }
        this.state.gradientDepth++;
    }
    endTape() {
        this.state.gradientDepth--;
    }
    /**
     * Start a scope. Use this with endScope() to achieve the same functionality
     * as scope() without the need for a function closure.
     */
    startScope(name) {
        const scopeInfo = {
            track: [],
            name: 'unnamed scope',
            id: this.state.nextScopeId++
        };
        if (name) {
            scopeInfo.name = name;
        }
        this.state.scopeStack.push(scopeInfo);
        this.state.activeScope = scopeInfo;
    }
    /**
     * End a scope. Use this with startScope() to achieve the same functionality
     * as scope() without the need for a function closure.
     */
    endScope(result) {
        const tensorsToTrackInParent = getTensorsInContainer(result);
        const tensorsToTrackInParentSet = new Set(tensorsToTrackInParent.map(t => t.id));
        // Dispose the arrays tracked in this scope.
        for (let i = 0; i < this.state.activeScope.track.length; i++) {
            const tensor = this.state.activeScope.track[i];
            if (!tensor.kept && !tensorsToTrackInParentSet.has(tensor.id)) {
                tensor.dispose();
            }
        }
        const oldScope = this.state.scopeStack.pop();
        this.state.activeScope = this.state.scopeStack.length === 0 ?
            null :
            this.state.scopeStack[this.state.scopeStack.length - 1];
        // Track the current result in the parent scope.
        tensorsToTrackInParent.forEach(tensor => {
            // Only track the tensor if was allocated in the inner scope and is not
            // globally kept.
            if (!tensor.kept && tensor.scopeId === oldScope.id) {
                this.track(tensor);
            }
        });
    }
    /**
     * Returns gradients of `f` with respect to each of the `xs`. The gradients
     * returned are of the same length as `xs`, but some might be null if `f`
     * was not a function of that `x`. It also takes optional dy to multiply the
     * gradient, which defaults to `1`.
     */
    gradients(f, xs, dy, allowNoGradients = false) {
        util.assert(xs.length > 0, () => 'gradients() received an empty list of xs.');
        if (dy != null && dy.dtype !== 'float32') {
            throw new Error(`dy must have 'float32' dtype, but has '${dy.dtype}'`);
        }
        const y = this.scopedRun(() => this.startTape(), () => this.endTape(), () => this.tidy('forward', f));
        util.assert(y instanceof Tensor, () => 'The result y returned by f() must be a tensor.');
        // Filter out the nodes that don't connect x => y.
        const filteredTape = getFilteredNodesXToY(this.state.activeTape, xs, y);
        if (!allowNoGradients && filteredTape.length === 0 && xs.length > 0) {
            throw new Error('Cannot compute gradient of y=f(x) with respect to x. Make sure ' +
                'that the f you passed encloses all operations that lead from x ' +
                'to y.');
        }
        return this.tidy('backward', () => {
            const accumulatedGradientMap = {};
            accumulatedGradientMap[y.id] = (dy == null) ? ones(y.shape) : dy;
            // Backprop gradients through the filtered nodes.
            backpropagateGradients(accumulatedGradientMap, filteredTape, 
            // Pass the tidy function to avoid circular dep with `tape.ts`.
            f => this.tidy(f), 
            // Pass an add function to avoide a circular dep with `tape.ts`.
            add);
            const grads = xs.map(x => accumulatedGradientMap[x.id]);
            if (this.state.gradientDepth === 0) {
                // This means that we are not computing higher-order gradients
                // and can clean up the tape.
                this.state.activeTape.forEach(node => {
                    for (const tensor of node.saved) {
                        tensor.dispose();
                    }
                });
                this.state.activeTape = null;
            }
            return { value: y, grads };
        });
    }
    customGrad(f) {
        util.assert(util.isFunction(f), () => 'The f passed in customGrad(f) must be a function.');
        return (...inputs) => {
            util.assert(inputs.every(t => t instanceof Tensor), () => 'The args passed in customGrad(f)(x1, x2,...) must all be ' +
                'tensors');
            let res;
            const inputMap = {};
            inputs.forEach((input, i) => {
                inputMap[i] = input;
            });
            const forwardFunc = (_, save) => {
                res = f(...[...inputs, save]);
                util.assert(res.value instanceof Tensor, () => 'The function f passed in customGrad(f) must return an ' +
                    'object where `obj.value` is a tensor');
                util.assert(util.isFunction(res.gradFunc), () => 'The function f passed in customGrad(f) must return an ' +
                    'object where `obj.gradFunc` is a function.');
                return res.value;
            };
            const backwardsFunc = (dy, saved) => {
                const gradRes = res.gradFunc(dy, saved);
                const grads = Array.isArray(gradRes) ? gradRes : [gradRes];
                util.assert(grads.length === inputs.length, () => 'The function f passed in customGrad(f) must return an ' +
                    'object where `obj.gradFunc` is a function that returns ' +
                    'the same number of tensors as inputs passed to f(...).');
                util.assert(grads.every(t => t instanceof Tensor), () => 'The function f passed in customGrad(f) must return an ' +
                    'object where `obj.gradFunc` is a function that returns ' +
                    'a list of only tensors.');
                const gradMap = {};
                grads.forEach((grad, i) => {
                    gradMap[i] = () => grad;
                });
                return gradMap;
            };
            return this.runKernelFunc({
                forwardFunc,
                backwardsFunc,
                inputs: inputMap,
            });
        };
    }
    readSync(dataId) {
        // Route the read to the correct backend.
        const info = this.state.tensorInfo.get(dataId);
        return info.backend.readSync(dataId);
    }
    read(dataId) {
        // Route the read to the correct backend.
        const info = this.state.tensorInfo.get(dataId);
        return info.backend.read(dataId);
    }
    readToGPU(dataId, options) {
        // Route the read to the correct backend.
        const info = this.state.tensorInfo.get(dataId);
        return info.backend.readToGPU(dataId, options);
    }
    async time(query) {
        const start = now();
        const timingInfo = await this.backend.time(query);
        timingInfo.wallMs = now() - start;
        return timingInfo;
    }
    /**
     * Tracks a Tensor in the current scope to be automatically cleaned up
     * when the current scope ends, and returns the value.
     *
     * @param result The Tensor to track in the current scope.
     */
    track(result) {
        if (this.state.activeScope != null) {
            result.scopeId = this.state.activeScope.id;
            this.state.activeScope.track.push(result);
        }
        return result;
    }
    get registeredVariables() {
        return this.state.registeredVariables;
    }
    /**
     * Resets the engine state. Removes all backends but does not remove
     * registered backend factories.
     */
    reset() {
        // Make any pending promise obsolete.
        this.pendingBackendInitId++;
        this.state.dispose();
        this.ENV.reset();
        this.state = new EngineState();
        for (const backendName in this.registry) {
            this.disposeRegisteredKernels(backendName);
            this.registry[backendName].dispose();
            delete this.registry[backendName];
        }
        this.backendName = null;
        this.backendInstance = null;
        this.pendingBackendInit = null;
    }
}
Engine.nextTensorId = 0;
Engine.nextVariableId = 0;
function ones(shape) {
    const values = makeOnesTypedArray(sizeFromShape(shape), 'float32');
    return ENGINE.makeTensor(values, shape, 'float32');
}
export function getOrMakeEngine() {
    const ns = getGlobalNamespace();
    if (ns._tfengine == null) {
        const environment = new Environment(ns);
        ns._tfengine = new Engine(environment);
    }
    setEnvironmentGlobal(ns._tfengine.ENV);
    // Tell the current tensor interface that the global engine is responsible
    // for tracking.
    setTensorTracker(() => ns._tfengine);
    return ns._tfengine;
}
export const ENGINE = getOrMakeEngine();
/**
 * A implementation of the add op for use within engine and tape.
 *
 * This allows us to avoid a circular dependency between add.ts and engine.
 * It is exported to be available in tape tests.
 */
export function add(a, b) {
    // We duplicate Add here to avoid a circular dependency with add.ts.
    const inputs = { a, b };
    return ENGINE.runKernel(Add, inputs);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5naW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9lbmdpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUErQixhQUFhLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUMvRSxPQUFPLEVBQUMsV0FBVyxFQUFFLG9CQUFvQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2hFLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNqRCxPQUFPLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRCxPQUFPLEVBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxvQkFBb0IsRUFBcUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNuSCxPQUFPLEtBQUssR0FBRyxNQUFNLE9BQU8sQ0FBQztBQUM3QixPQUFPLEVBQWdCLFFBQVEsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNuRCxPQUFPLEVBQUMsc0JBQXNCLEVBQUUsb0JBQW9CLEVBQVcsTUFBTSxRQUFRLENBQUM7QUFDOUUsT0FBTyxFQUFvQyxnQkFBZ0IsRUFBRSxNQUFNLEVBQWlCLFFBQVEsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUU5RyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFcEQsT0FBTyxLQUFLLElBQUksTUFBTSxRQUFRLENBQUM7QUFDL0IsT0FBTyxFQUFDLG9CQUFvQixFQUFFLGtCQUFrQixFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUMsTUFBTSxRQUFRLENBQUM7QUF1RXBGLFNBQVMsNEJBQTRCLENBRWpDLGdCQUNnQztJQUVsQyxPQUFRLGdCQUFrRCxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUM7QUFDaEYsQ0FBQztBQUVELE1BQU0sV0FBVztJQUFqQjtRQUNFLHVDQUF1QztRQUN2Qyx3QkFBbUIs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eEJwQyxTQUFTLElBQUksQ0FBQyxLQUFlO0lBQzNCLE1BQU0sTUFBTSxHQUFHLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNuRSxPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyRCxDQUFDO0FBRUQsTUFBTSxVQUFVLGVBQWU7SUFDN0IsTUFBTSxFQUFFLEdBQUcsa0JBQWtCLEVBQStCLENBQUM7SUFDN0QsSUFBSSxFQUFFLENBQUMsU0FBUyxJQUFJLElBQUksRUFBRTtRQUN4QixNQUFNLFdBQVcsR0FBRyxJQUFJLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4QyxFQUFFLENBQUMsU0FBUyxHQUFHLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ3hDO0lBQ0Qsb0JBQW9CLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUV2QywwRUFBMEU7SUFDMUUsZ0JBQWdCO0lBQ2hCLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUM7QUFDdEIsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBRyxlQUFlLEVBQUUsQ0FBQztBQUV4Qzs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBUyxFQUFFLENBQVM7SUFDdEMsb0VBQW9FO0lBQ3BFLE1BQU0sTUFBTSxHQUFHLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDO0lBQ3RCLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsTUFBOEIsQ0FBQyxDQUFDO0FBQy9ELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7QmFja2VuZFRpbWluZ0luZm8sIERhdGFNb3ZlciwgS2VybmVsQmFja2VuZH0gZnJvbSAnLi9iYWNrZW5kcy9iYWNrZW5kJztcbmltcG9ydCB7RW52aXJvbm1lbnQsIHNldEVudmlyb25tZW50R2xvYmFsfSBmcm9tICcuL2Vudmlyb25tZW50JztcbmltcG9ydCB7Z2V0R2xvYmFsTmFtZXNwYWNlfSBmcm9tICcuL2dsb2JhbF91dGlsJztcbmltcG9ydCB7QWRkLCBDYXN0LCBJZGVudGl0eX0gZnJvbSAnLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtnZXRHcmFkaWVudCwgZ2V0S2VybmVsLCBnZXRLZXJuZWxzRm9yQmFja2VuZCwgR3JhZEZ1bmMsIE5hbWVkQXR0ck1hcCwgVGVuc29ySW5mb30gZnJvbSAnLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4vbG9nJztcbmltcG9ydCB7S2VybmVsUHJvZmlsZSwgUHJvZmlsZXJ9IGZyb20gJy4vcHJvZmlsZXInO1xuaW1wb3J0IHtiYWNrcHJvcGFnYXRlR3JhZGllbnRzLCBnZXRGaWx0ZXJlZE5vZGVzWFRvWSwgVGFwZU5vZGV9IGZyb20gJy4vdGFwZSc7XG5pbXBvcnQge0RhdGFJZCwgRGF0YVRvR1BVT3B0aW9ucywgR1BVRGF0YSwgc2V0VGVuc29yVHJhY2tlciwgVGVuc29yLCBUZW5zb3JUcmFja2VyLCBWYXJpYWJsZX0gZnJvbSAnLi90ZW5zb3InO1xuaW1wb3J0IHtHcmFkU2F2ZUZ1bmMsIE5hbWVkVGVuc29yTWFwLCBOYW1lZFZhcmlhYmxlTWFwLCBUZW5zb3JDb250YWluZXJ9IGZyb20gJy4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Z2V0VGVuc29yc0luQ29udGFpbmVyfSBmcm9tICcuL3RlbnNvcl91dGlsJztcbmltcG9ydCB7QmFja2VuZFZhbHVlcywgRGF0YVR5cGUsIERhdGFWYWx1ZXN9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHtieXRlc0Zyb21TdHJpbmdBcnJheSwgbWFrZU9uZXNUeXBlZEFycmF5LCBub3csIHNpemVGcm9tU2hhcGV9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IGNvbXB1dGVzIGFuIG91dHB1dC4gVGhlIHNhdmUgZnVuY3Rpb24gaXMgZm9yIHNhdmluZyB0ZW5zb3JzXG4gKiBjb21wdXRlZCBpbiB0aGUgZm9yd2FyZCBwYXNzLCB0aGF0IHdlIG5lZWQgaW4gdGhlIGJhY2t3YXJkIHBhc3MuXG4gKi9cbmV4cG9ydCB0eXBlIEZvcndhcmRGdW5jPFQ+ID0gKGJhY2tlbmQ6IEtlcm5lbEJhY2tlbmQsIHNhdmU/OiBHcmFkU2F2ZUZ1bmMpID0+IFQ7XG5cbi8qKlxuICogQGRvY2FsaWFzIChhOiBUZW5zb3IsIGI6IFRlbnNvciwuLi4sIHNhdmU/OiBGdW5jdGlvbikgPT4ge1xuICogICB2YWx1ZTogVGVuc29yLFxuICogICBncmFkRnVuYzogKGR5OiBUZW5zb3IsIHNhdmVkPzogTmFtZWRUZW5zb3JNYXApID0+IFRlbnNvciB8IFRlbnNvcltdXG4gKiB9XG4gKi9cbmV4cG9ydCB0eXBlIEN1c3RvbUdyYWRpZW50RnVuYzxUIGV4dGVuZHMgVGVuc29yPiA9XG4gICAgKC4uLmlucHV0czogQXJyYXk8VGVuc29yfEdyYWRTYXZlRnVuYz4pID0+IHtcbiAgICAgIHZhbHVlOiBUO1xuICAgICAgZ3JhZEZ1bmM6IChkeTogVCwgc2F2ZWQ6IFRlbnNvcltdKSA9PiBUZW5zb3IgfCBUZW5zb3JbXTtcbiAgICB9O1xuXG5leHBvcnQgdHlwZSBNZW1vcnlJbmZvID0ge1xuICBudW1UZW5zb3JzOiBudW1iZXI7IG51bURhdGFCdWZmZXJzOiBudW1iZXI7IG51bUJ5dGVzOiBudW1iZXI7XG4gIHVucmVsaWFibGU/OiBib29sZWFuOyByZWFzb25zOiBzdHJpbmdbXTtcbn07XG5cbnR5cGUgS2VybmVsSW5mbyA9IHtcbiAgbmFtZTogc3RyaW5nOyBieXRlc0FkZGVkOiBudW1iZXI7IHRvdGFsQnl0ZXNTbmFwc2hvdDogbnVtYmVyO1xuICB0ZW5zb3JzQWRkZWQ6IG51bWJlcjtcbiAgdG90YWxUZW5zb3JzU25hcHNob3Q6IG51bWJlcjtcbiAgaW5wdXRTaGFwZXM6IG51bWJlcltdW107XG4gIG91dHB1dFNoYXBlczogbnVtYmVyW11bXTtcbiAga2VybmVsVGltZU1zOiBudW1iZXIgfCB7ZXJyb3I6IHN0cmluZ30gfCBQcm9taXNlPG51bWJlcnx7ZXJyb3I6IHN0cmluZ30+O1xuICBleHRyYUluZm86IHN0cmluZyB8IFByb21pc2U8c3RyaW5nPjtcbn07XG5cbmV4cG9ydCB0eXBlIFByb2ZpbGVJbmZvID0ge1xuICBuZXdCeXRlczogbnVtYmVyOyBuZXdUZW5zb3JzOiBudW1iZXI7IHBlYWtCeXRlczogbnVtYmVyO1xuICBrZXJuZWxzOiBLZXJuZWxJbmZvW107XG4gIHJlc3VsdDogVGVuc29yQ29udGFpbmVyO1xuICBrZXJuZWxOYW1lczogc3RyaW5nW107XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFRpbWluZ0luZm8gZXh0ZW5kcyBCYWNrZW5kVGltaW5nSW5mbyB7XG4gIHdhbGxNczogbnVtYmVyO1xufVxuXG4vKiogQGRvY2FsaWFzIEZ1bmN0aW9uICovXG5leHBvcnQgdHlwZSBTY29wZUZuPFQgZXh0ZW5kcyBUZW5zb3JDb250YWluZXI+ID0gKCkgPT4gVDtcblxuaW50ZXJmYWNlIFNjb3BlU3RhdGUge1xuICB0cmFjazogVGVuc29yW107XG4gIG5hbWU6IHN0cmluZztcbiAgaWQ6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIFJlZ2lzdGVyZWRLZXJuZWxJbnZvY2F0aW9uPEkgZXh0ZW5kcyBOYW1lZFRlbnNvck1hcD4ge1xuICBrZXJuZWxOYW1lOiBzdHJpbmc7XG4gIGlucHV0czogSTtcbiAgYXR0cnM/OiBOYW1lZEF0dHJNYXA7XG59XG5cbmludGVyZmFjZSBDdXN0b21HcmFkS2VybmVsSW52b2NhdGlvbjxUIGV4dGVuZHMgVGVuc29yfFRlbnNvcltdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBJIGV4dGVuZHMgTmFtZWRUZW5zb3JNYXA+IHtcbiAgZm9yd2FyZEZ1bmM6IEZvcndhcmRGdW5jPFQ+O1xuICBiYWNrd2FyZHNGdW5jOiAoZHk6IFQsIHNhdmVkOiBUZW5zb3JbXSkgPT4ge1xuICAgIFtQIGluIGtleW9mIEldOiAoKSA9PiBJW1BdXG4gIH07XG4gIGlucHV0czogSTtcbiAgYXR0cnM/OiBOYW1lZEF0dHJNYXA7XG59XG5cbmZ1bmN0aW9uIGlzUmVnaXN0ZXJlZEtlcm5lbEludm9jYXRpb248VCBleHRlbmRzIFRlbnNvcnxUZW5zb3JbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEkgZXh0ZW5kcyBOYW1lZFRlbnNvck1hcD4oXG4gICAga2VybmVsSW52b2NhdGlvbjogUmVnaXN0ZXJlZEtlcm5lbEludm9jYXRpb248ST58XG4gICAgQ3VzdG9tR3JhZEtlcm5lbEludm9jYXRpb248VCwgST4pOlxuICAgIGtlcm5lbEludm9jYXRpb24gaXMgUmVnaXN0ZXJlZEtlcm5lbEludm9jYXRpb248ST4ge1xuICByZXR1cm4gKGtlcm5lbEludm9jYXRpb24gYXMgUmVnaXN0ZXJlZEtlcm5lbEludm9jYXRpb248ST4pLmtlcm5lbE5hbWUgIT0gbnVsbDtcbn1cblxuY2xhc3MgRW5naW5lU3RhdGUge1xuICAvLyBQdWJsaWMgc2luY2Ugb3B0aW1pemVycyB3aWxsIHVzZSBpdC5cbiAgcmVnaXN0ZXJlZFZhcmlhYmxlczogTmFtZWRWYXJpYWJsZU1hcCA9IHt9O1xuXG4gIG5leHRUYXBlTm9kZUlkID0gMDtcbiAgbnVtQnl0ZXMgPSAwO1xuICBudW1UZW5zb3JzID0gMDtcbiAgbnVtU3RyaW5nVGVuc29ycyA9IDA7XG4gIG51bURhdGFCdWZmZXJzID0gMDtcblxuICBhY3RpdmVUYXBlOiBUYXBlTm9kZVtdO1xuICAvLyBOdW1iZXIgb2YgbmVzdGVkIHRmLmdyYWQoKSBzdGF0ZW1lbnRzIHdoZW4gY29tcHV0aW5nIGhpZ2hlci1vcmRlclxuICAvLyBncmFkaWVudHMuIEUuZy4gYDFgIGZvciBmaXJzdC1vcmRlciBncmFkaWVudHMgYW5kIGAyYCBmb3Igc2Vjb25kLW9yZGVyXG4gIC8vIGdyYWRpZW50cy4gVXNlZCB0byB0cmFjayBpZiB0aGUgdGFwZSBzaG91bGQgYmUgcmVtb3ZlZCBhZnRlciBhIGJhY2twcm9wLlxuICBncmFkaWVudERlcHRoID0gMDtcbiAgLy8gTnVtYmVyIG9mIG5lc3RlZCBrZXJuZWwgY2FsbHMuIFdoZW4ga2VybmVsIGRlcHRoIGlzIGdyZWF0ZXIgdGhhbiAxLCB3ZSB0dXJuXG4gIC8vIG9mZiB0aGUgdGFwZS5cbiAga2VybmVsRGVwdGggPSAwO1xuXG4gIC8vIEtlZXAgVGVuc29ycyB0aGF0IHBhcmFsbGVsIHRoZSB0YXBlcy5cbiAgYWN0aXZlU2NvcGU6IFNjb3BlU3RhdGU7XG4gIHNjb3BlU3RhY2s6IFNjb3BlU3RhdGVbXSA9IFtdO1xuICAvKipcbiAgICogS2VlcHMgdHJhY2sgb2YgdGhlIG51bWJlciBvZiBkYXRhIG1vdmVzIGR1cmluZyBhIGtlcm5lbCBleGVjdXRpb24uIFdlXG4gICAqIG1haW50YWluIGEgc3RhY2sgc2luY2Uga2VybmVscyBjYW4gY2FsbCBvdGhlciBrZXJuZWxzLCByZWN1cnNpdmVseS5cbiAgICovXG4gIG51bURhdGFNb3Zlc1N0YWNrOiBudW1iZXJbXSA9IFtdO1xuICBuZXh0U2NvcGVJZCA9IDA7XG5cbiAgdGVuc29ySW5mbyA9IG5ldyBXZWFrTWFwPERhdGFJZCwge1xuICAgIGJhY2tlbmQ6IEtlcm5lbEJhY2tlbmQsXG4gICAgYnl0ZXM6IG51bWJlcixcbiAgICBkdHlwZTogRGF0YVR5cGUsXG4gICAgc2hhcGU6IG51bWJlcltdXG4gIH0+KCk7XG5cbiAgcHJvZmlsaW5nID0gZmFsc2U7XG4gIGFjdGl2ZVByb2ZpbGU6IFByb2ZpbGVJbmZvID0ge1xuICAgIG5ld0J5dGVzOiAwLFxuICAgIG5ld1RlbnNvcnM6IDAsXG4gICAgcGVha0J5dGVzOiAwLFxuICAgIGtlcm5lbHM6IFtdLFxuICAgIHJlc3VsdDogbnVsbCxcbiAgICBnZXQga2VybmVsTmFtZXMoKTpcbiAgICAgICAgc3RyaW5nW10ge1xuICAgICAgICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQodGhpcy5rZXJuZWxzLm1hcChrID0+IGsubmFtZSkpKTtcbiAgICAgICAgfVxuICB9O1xuXG4gIGRpc3Bvc2UoKSB7XG4gICAgZm9yIChjb25zdCB2YXJpYWJsZU5hbWUgaW4gdGhpcy5yZWdpc3RlcmVkVmFyaWFibGVzKSB7XG4gICAgICB0aGlzLnJlZ2lzdGVyZWRWYXJpYWJsZXNbdmFyaWFibGVOYW1lXS5kaXNwb3NlKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFbmdpbmUgaW1wbGVtZW50cyBUZW5zb3JUcmFja2VyLCBEYXRhTW92ZXIge1xuICBzdGF0ZTogRW5naW5lU3RhdGU7XG4gIGJhY2tlbmROYW1lOiBzdHJpbmc7XG4gIHJlZ2lzdHJ5OiB7W2lkOiBzdHJpbmddOiBLZXJuZWxCYWNrZW5kfSA9IHt9O1xuICByZWdpc3RyeUZhY3Rvcnk6IHtcbiAgICBbaWQ6IHN0cmluZ106IHtcbiAgICAgIGZhY3Rvcnk6ICgpID0+IEtlcm5lbEJhY2tlbmQgfCBQcm9taXNlPEtlcm5lbEJhY2tlbmQ+LFxuICAgICAgcHJpb3JpdHk6IG51bWJlclxuICAgIH1cbiAgfSA9IHt9O1xuXG4gIHByaXZhdGUgcHJvZmlsZXI6IFByb2ZpbGVyO1xuICBwcml2YXRlIGJhY2tlbmRJbnN0YW5jZTogS2VybmVsQmFja2VuZDtcbiAgcHJpdmF0ZSBwZW5kaW5nQmFja2VuZEluaXQ6IFByb21pc2U8Ym9vbGVhbj47XG4gIHByaXZhdGUgcGVuZGluZ0JhY2tlbmRJbml0SWQgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBFTlY6IEVudmlyb25tZW50KSB7XG4gICAgdGhpcy5zdGF0ZSA9IG5ldyBFbmdpbmVTdGF0ZSgpO1xuICB9XG5cbiAgYXN5bmMgcmVhZHkoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMucGVuZGluZ0JhY2tlbmRJbml0ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLnBlbmRpbmdCYWNrZW5kSW5pdC50aGVuKCgpID0+IHt9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMuYmFja2VuZEluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc29ydGVkQmFja2VuZHMgPSB0aGlzLmdldFNvcnRlZEJhY2tlbmRzKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNvcnRlZEJhY2tlbmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBiYWNrZW5kTmFtZSA9IHNvcnRlZEJhY2tlbmRzW2ldO1xuICAgICAgY29uc3Qgc3VjY2VzcyA9IGF3YWl0IHRoaXMuaW5pdGlhbGl6ZUJhY2tlbmQoYmFja2VuZE5hbWUpLnN1Y2Nlc3M7XG4gICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICBhd2FpdCB0aGlzLnNldEJhY2tlbmQoYmFja2VuZE5hbWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgQ291bGQgbm90IGluaXRpYWxpemUgYW55IGJhY2tlbmRzLCBhbGwgYmFja2VuZCBpbml0aWFsaXphdGlvbnMgYCArXG4gICAgICAgIGBmYWlsZWQuYCk7XG4gIH1cblxuICBnZXQgYmFja2VuZCgpOiBLZXJuZWxCYWNrZW5kIHtcbiAgICBpZiAodGhpcy5wZW5kaW5nQmFja2VuZEluaXQgIT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBCYWNrZW5kICcke3RoaXMuYmFja2VuZE5hbWV9JyBoYXMgbm90IHlldCBiZWVuIGluaXRpYWxpemVkLiBNYWtlIGAgK1xuICAgICAgICAgIGBzdXJlIHRvIGF3YWl0IHRmLnJlYWR5KCkgb3IgYXdhaXQgdGYuc2V0QmFja2VuZCgpIGJlZm9yZSBjYWxsaW5nIGAgK1xuICAgICAgICAgIGBvdGhlciBtZXRob2RzYCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmJhY2tlbmRJbnN0YW5jZSA9PSBudWxsKSB7XG4gICAgICBjb25zdCB7bmFtZSwgYXN5bmNJbml0fSA9IHRoaXMuaW5pdGlhbGl6ZUJhY2tlbmRzQW5kUmV0dXJuQmVzdCgpO1xuICAgICAgaWYgKGFzeW5jSW5pdCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgVGhlIGhpZ2hlc3QgcHJpb3JpdHkgYmFja2VuZCAnJHtuYW1lfScgaGFzIG5vdCB5ZXQgYmVlbiBgICtcbiAgICAgICAgICAgIGBpbml0aWFsaXplZC4gTWFrZSBzdXJlIHRvIGF3YWl0IHRmLnJlYWR5KCkgb3IgYCArXG4gICAgICAgICAgICBgYXdhaXQgdGYuc2V0QmFja2VuZCgpIGJlZm9yZSBjYWxsaW5nIG90aGVyIG1ldGhvZHNgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0QmFja2VuZChuYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYmFja2VuZEluc3RhbmNlO1xuICB9XG5cbiAgYmFja2VuZE5hbWVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5yZWdpc3RyeUZhY3RvcnkpO1xuICB9XG5cbiAgZmluZEJhY2tlbmQoYmFja2VuZE5hbWU6IHN0cmluZyk6IEtlcm5lbEJhY2tlbmQge1xuICAgIGlmICghKGJhY2tlbmROYW1lIGluIHRoaXMucmVnaXN0cnkpKSB7XG4gICAgICAvLyBJZiB0aGUgYmFja2VuZCBoYXNuJ3QgYmVlbiBpbml0aWFsaXplZCBidXQgd2UgaGF2ZSBhIHJlZ2lzdHJ5IGVudHJ5IGZvclxuICAgICAgLy8gaXQsIGluaXRpYWxpemUgaXQgYW5kIHJldHVybiBpdC5cbiAgICAgIGlmIChiYWNrZW5kTmFtZSBpbiB0aGlzLnJlZ2lzdHJ5RmFjdG9yeSkge1xuICAgICAgICBjb25zdCB7YXN5bmNJbml0fSA9IHRoaXMuaW5pdGlhbGl6ZUJhY2tlbmQoYmFja2VuZE5hbWUpO1xuICAgICAgICBpZiAoYXN5bmNJbml0KSB7XG4gICAgICAgICAgLy8gQmFja2VuZCBpcyBub3QgcmVhZHkgeWV0LlxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cnlbYmFja2VuZE5hbWVdO1xuICB9XG5cbiAgZmluZEJhY2tlbmRGYWN0b3J5KGJhY2tlbmROYW1lOiBzdHJpbmcpOlxuICAgICAgKCkgPT4gS2VybmVsQmFja2VuZCB8IFByb21pc2U8S2VybmVsQmFja2VuZD4ge1xuICAgIGlmICghKGJhY2tlbmROYW1lIGluIHRoaXMucmVnaXN0cnlGYWN0b3J5KSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJ5RmFjdG9yeVtiYWNrZW5kTmFtZV0uZmFjdG9yeTtcbiAgfVxuXG4gIHJlZ2lzdGVyQmFja2VuZChcbiAgICAgIGJhY2tlbmROYW1lOiBzdHJpbmcsXG4gICAgICBmYWN0b3J5OiAoKSA9PiBLZXJuZWxCYWNrZW5kIHwgUHJvbWlzZTxLZXJuZWxCYWNrZW5kPixcbiAgICAgIHByaW9yaXR5ID0gMSk6IGJvb2xlYW4ge1xuICAgIGlmIChiYWNrZW5kTmFtZSBpbiB0aGlzLnJlZ2lzdHJ5RmFjdG9yeSkge1xuICAgICAgbG9nLndhcm4oXG4gICAgICAgICAgYCR7YmFja2VuZE5hbWV9IGJhY2tlbmQgd2FzIGFscmVhZHkgcmVnaXN0ZXJlZC4gYCArXG4gICAgICAgICAgYFJldXNpbmcgZXhpc3RpbmcgYmFja2VuZCBmYWN0b3J5LmApO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLnJlZ2lzdHJ5RmFjdG9yeVtiYWNrZW5kTmFtZV0gPSB7ZmFjdG9yeSwgcHJpb3JpdHl9O1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYXN5bmMgc2V0QmFja2VuZChiYWNrZW5kTmFtZTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgaWYgKHRoaXMucmVnaXN0cnlGYWN0b3J5W2JhY2tlbmROYW1lXSA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEJhY2tlbmQgbmFtZSAnJHtiYWNrZW5kTmFtZX0nIG5vdCBmb3VuZCBpbiByZWdpc3RyeWApO1xuICAgIH1cbiAgICB0aGlzLmJhY2tlbmROYW1lID0gYmFja2VuZE5hbWU7XG4gICAgaWYgKHRoaXMucmVnaXN0cnlbYmFja2VuZE5hbWVdID09IG51bGwpIHtcbiAgICAgIHRoaXMuYmFja2VuZEluc3RhbmNlID0gbnVsbDtcbiAgICAgIGNvbnN0IHtzdWNjZXNzLCBhc3luY0luaXR9ID0gdGhpcy5pbml0aWFsaXplQmFja2VuZChiYWNrZW5kTmFtZSk7XG4gICAgICBjb25zdCByZXN1bHQgPSBhc3luY0luaXQgPyBhd2FpdCBzdWNjZXNzIDogc3VjY2VzcztcbiAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5iYWNrZW5kSW5zdGFuY2UgPSB0aGlzLnJlZ2lzdHJ5W2JhY2tlbmROYW1lXTtcbiAgICB0aGlzLnNldHVwUmVnaXN0ZXJlZEtlcm5lbHMoKTtcbiAgICAvLyBSZXNldCB0aGUgcHJvZmlsZXIuXG4gICAgdGhpcy5wcm9maWxlciA9IG5ldyBQcm9maWxlcih0aGlzLmJhY2tlbmRJbnN0YW5jZSk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0dXBSZWdpc3RlcmVkS2VybmVscygpOiB2b2lkIHtcbiAgICBjb25zdCBrZXJuZWxzID0gZ2V0S2VybmVsc0ZvckJhY2tlbmQodGhpcy5iYWNrZW5kTmFtZSk7XG4gICAga2VybmVscy5mb3JFYWNoKGtlcm5lbCA9PiB7XG4gICAgICBpZiAoa2VybmVsLnNldHVwRnVuYyAhPSBudWxsKSB7XG4gICAgICAgIGtlcm5lbC5zZXR1cEZ1bmModGhpcy5iYWNrZW5kSW5zdGFuY2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwb3NlUmVnaXN0ZXJlZEtlcm5lbHMoYmFja2VuZE5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGtlcm5lbHMgPSBnZXRLZXJuZWxzRm9yQmFja2VuZChiYWNrZW5kTmFtZSk7XG4gICAga2VybmVscy5mb3JFYWNoKGtlcm5lbCA9PiB7XG4gICAgICBpZiAoa2VybmVsLmRpc3Bvc2VGdW5jICE9IG51bGwpIHtcbiAgICAgICAga2VybmVsLmRpc3Bvc2VGdW5jKHRoaXMucmVnaXN0cnlbYmFja2VuZE5hbWVdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBhIGJhY2tlbmQgYnkgbG9va2luZyB1cCB0aGUgYmFja2VuZCBuYW1lIGluIHRoZSBmYWN0b3J5XG4gICAqIHJlZ2lzdHJ5IGFuZCBjYWxsaW5nIHRoZSBmYWN0b3J5IG1ldGhvZC4gUmV0dXJucyBhIGJvb2xlYW4gcmVwcmVzZW50aW5nXG4gICAqIHdoZXRoZXIgdGhlIGluaXRpYWxpemF0aW9uIG9mIHRoZSBiYWNrZW5kIHN1Y2VlZGVkLiBUaHJvd3MgYW4gZXJyb3IgaWZcbiAgICogdGhlcmUgaXMgbm8gYmFja2VuZCBpbiB0aGUgZmFjdG9yeSByZWdpc3RyeS5cbiAgICovXG4gIHByaXZhdGUgaW5pdGlhbGl6ZUJhY2tlbmQoYmFja2VuZE5hbWU6IHN0cmluZyk6XG4gICAgICB7c3VjY2VzczogYm9vbGVhbnxQcm9taXNlPGJvb2xlYW4+LCBhc3luY0luaXQ6IGJvb2xlYW59IHtcbiAgICBjb25zdCByZWdpc3RyeUZhY3RvcnlFbnRyeSA9IHRoaXMucmVnaXN0cnlGYWN0b3J5W2JhY2tlbmROYW1lXTtcbiAgICBpZiAocmVnaXN0cnlGYWN0b3J5RW50cnkgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBDYW5ub3QgaW5pdGlhbGl6ZSBiYWNrZW5kICR7YmFja2VuZE5hbWV9LCBubyByZWdpc3RyYXRpb24gZm91bmQuYCk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGJhY2tlbmQgPSByZWdpc3RyeUZhY3RvcnlFbnRyeS5mYWN0b3J5KCk7XG4gICAgICAvKiBUZXN0IGlmIHRoZSBmYWN0b3J5IHJldHVybnMgYSBwcm9taXNlLlxuICAgICAgRG9uZSBpbiBhIG1vcmUgbGliZXJhbCB3YXkgdGhhblxuICAgICAgcHJldmlvdXMgJ1Byb21pc2UucmVzb2x2ZShiYWNrZW5kKT09PWJhY2tlbmQnXG4gICAgICBhcyB3ZSBuZWVkZWQgdG8gYWNjb3VudCBmb3IgY3VzdG9tIFByb21pc2VcbiAgICAgIGltcGxlbWVudGF0aW9ucyAoZS5nLiBBbmd1bGFyKSAqL1xuICAgICAgaWYgKGJhY2tlbmQgJiYgIShiYWNrZW5kIGluc3RhbmNlb2YgS2VybmVsQmFja2VuZCkgJiZcbiAgICAgICAgICB0eXBlb2YgYmFja2VuZC50aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbnN0IHByb21pc2VJZCA9ICsrdGhpcy5wZW5kaW5nQmFja2VuZEluaXRJZDtcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9XG4gICAgICAgICAgICBiYWNrZW5kXG4gICAgICAgICAgICAgICAgLnRoZW4oYmFja2VuZEluc3RhbmNlID0+IHtcbiAgICAgICAgICAgICAgICAgIC8vIE91dGRhdGVkIHByb21pc2UuIEFub3RoZXIgYmFja2VuZCB3YXMgc2V0IGluIHRoZSBtZWFudGltZS5cbiAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlSWQgPCB0aGlzLnBlbmRpbmdCYWNrZW5kSW5pdElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHRoaXMucmVnaXN0cnlbYmFja2VuZE5hbWVdID0gYmFja2VuZEluc3RhbmNlO1xuICAgICAgICAgICAgICAgICAgdGhpcy5wZW5kaW5nQmFja2VuZEluaXQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgIC8vIE91dGRhdGVkIHByb21pc2UuIEFub3RoZXIgYmFja2VuZCB3YXMgc2V0IGluIHRoZSBtZWFudGltZS5cbiAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlSWQgPCB0aGlzLnBlbmRpbmdCYWNrZW5kSW5pdElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHRoaXMucGVuZGluZ0JhY2tlbmRJbml0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgIGxvZy53YXJuKGBJbml0aWFsaXphdGlvbiBvZiBiYWNrZW5kICR7YmFja2VuZE5hbWV9IGZhaWxlZGApO1xuICAgICAgICAgICAgICAgICAgbG9nLndhcm4oZXJyLnN0YWNrIHx8IGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5wZW5kaW5nQmFja2VuZEluaXQgPSBzdWNjZXNzO1xuICAgICAgICByZXR1cm4ge3N1Y2Nlc3MsIGFzeW5jSW5pdDogdHJ1ZX07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlZ2lzdHJ5W2JhY2tlbmROYW1lXSA9IGJhY2tlbmQgYXMgS2VybmVsQmFja2VuZDtcbiAgICAgICAgcmV0dXJuIHtzdWNjZXNzOiB0cnVlLCBhc3luY0luaXQ6IGZhbHNlfTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGxvZy53YXJuKGBJbml0aWFsaXphdGlvbiBvZiBiYWNrZW5kICR7YmFja2VuZE5hbWV9IGZhaWxlZGApO1xuICAgICAgbG9nLndhcm4oZXJyLnN0YWNrIHx8IGVyci5tZXNzYWdlKTtcbiAgICAgIHJldHVybiB7c3VjY2VzczogZmFsc2UsIGFzeW5jSW5pdDogZmFsc2V9O1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUJhY2tlbmQoYmFja2VuZE5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICghKGJhY2tlbmROYW1lIGluIHRoaXMucmVnaXN0cnlGYWN0b3J5KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2JhY2tlbmROYW1lfSBiYWNrZW5kIG5vdCBmb3VuZCBpbiByZWdpc3RyeWApO1xuICAgIH1cbiAgICBpZiAodGhpcy5iYWNrZW5kTmFtZSA9PT0gYmFja2VuZE5hbWUgJiYgdGhpcy5wZW5kaW5nQmFja2VuZEluaXQgIT0gbnVsbCkge1xuICAgICAgLy8gVGhlcmUgaXMgYSBwZW5kaW5nIHByb21pc2Ugb2YgdGhlIGJhY2tlbmQgd2Ugd2FudCB0byByZW1vdmUuIE1ha2UgaXRcbiAgICAgIC8vIG9ic29sZXRlLlxuICAgICAgdGhpcy5wZW5kaW5nQmFja2VuZEluaXRJZCsrO1xuICAgIH1cblxuICAgIGlmIChiYWNrZW5kTmFtZSBpbiB0aGlzLnJlZ2lzdHJ5KSB7XG4gICAgICB0aGlzLmRpc3Bvc2VSZWdpc3RlcmVkS2VybmVscyhiYWNrZW5kTmFtZSk7XG4gICAgICB0aGlzLnJlZ2lzdHJ5W2JhY2tlbmROYW1lXS5kaXNwb3NlKCk7XG4gICAgICBkZWxldGUgdGhpcy5yZWdpc3RyeVtiYWNrZW5kTmFtZV07XG4gICAgfVxuXG4gICAgZGVsZXRlIHRoaXMucmVnaXN0cnlGYWN0b3J5W2JhY2tlbmROYW1lXTtcblxuICAgIC8vIFVuc2V0IHRoZSBiYWNrZW5kIGlmIGl0IGlzIGFjdGl2ZS5cbiAgICBpZiAodGhpcy5iYWNrZW5kTmFtZSA9PT0gYmFja2VuZE5hbWUpIHtcbiAgICAgIHRoaXMucGVuZGluZ0JhY2tlbmRJbml0ID0gbnVsbDtcbiAgICAgIHRoaXMuYmFja2VuZE5hbWUgPSBudWxsO1xuICAgICAgdGhpcy5iYWNrZW5kSW5zdGFuY2UgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0U29ydGVkQmFja2VuZHMoKTogc3RyaW5nW10ge1xuICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLnJlZ2lzdHJ5RmFjdG9yeSkubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGJhY2tlbmQgZm91bmQgaW4gcmVnaXN0cnkuJyk7XG4gICAgfVxuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLnJlZ2lzdHJ5RmFjdG9yeSkuc29ydCgoYTogc3RyaW5nLCBiOiBzdHJpbmcpID0+IHtcbiAgICAgIC8vIEhpZ2hlc3QgcHJpb3JpdHkgY29tZXMgZmlyc3QuXG4gICAgICByZXR1cm4gdGhpcy5yZWdpc3RyeUZhY3RvcnlbYl0ucHJpb3JpdHkgLVxuICAgICAgICAgIHRoaXMucmVnaXN0cnlGYWN0b3J5W2FdLnByaW9yaXR5O1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0aWFsaXplQmFja2VuZHNBbmRSZXR1cm5CZXN0KCk6XG4gICAgICB7bmFtZTogc3RyaW5nLCBhc3luY0luaXQ6IGJvb2xlYW59IHtcbiAgICBjb25zdCBzb3J0ZWRCYWNrZW5kcyA9IHRoaXMuZ2V0U29ydGVkQmFja2VuZHMoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc29ydGVkQmFja2VuZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGJhY2tlbmROYW1lID0gc29ydGVkQmFja2VuZHNbaV07XG4gICAgICBjb25zdCB7c3VjY2VzcywgYXN5bmNJbml0fSA9IHRoaXMuaW5pdGlhbGl6ZUJhY2tlbmQoYmFja2VuZE5hbWUpO1xuICAgICAgaWYgKGFzeW5jSW5pdCB8fCBzdWNjZXNzKSB7XG4gICAgICAgIHJldHVybiB7bmFtZTogYmFja2VuZE5hbWUsIGFzeW5jSW5pdH07XG4gICAgICB9XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYENvdWxkIG5vdCBpbml0aWFsaXplIGFueSBiYWNrZW5kcywgYWxsIGJhY2tlbmQgaW5pdGlhbGl6YXRpb25zIGAgK1xuICAgICAgICBgZmFpbGVkLmApO1xuICB9XG5cbiAgbW92ZURhdGEoYmFja2VuZDogS2VybmVsQmFja2VuZCwgZGF0YUlkOiBEYXRhSWQpIHtcbiAgICBjb25zdCBpbmZvID0gdGhpcy5zdGF0ZS50ZW5zb3JJbmZvLmdldChkYXRhSWQpO1xuICAgIGNvbnN0IHNyY0JhY2tlbmQgPSBpbmZvLmJhY2tlbmQ7XG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5yZWFkU3luYyhkYXRhSWQpO1xuICAgIGNvbnN0IHJlZkNvdW50ID0gc3JjQmFja2VuZC5yZWZDb3VudChkYXRhSWQpO1xuICAgIC8vIERlbGV0ZSB0aGUgdGVuc29yIGZyb20gdGhlIG9sZCBiYWNrZW5kIGFuZCBtb3ZlIGl0IHRvIHRoZSBuZXdcbiAgICAvLyBiYWNrZW5kLlxuICAgIHNyY0JhY2tlbmQuZGlzcG9zZURhdGEoZGF0YUlkLCB0cnVlKTtcbiAgICBpbmZvLmJhY2tlbmQgPSBiYWNrZW5kO1xuICAgIGJhY2tlbmQubW92ZShkYXRhSWQsIHZhbHVlcywgaW5mby5zaGFwZSwgaW5mby5kdHlwZSwgcmVmQ291bnQpO1xuICAgIGlmICh0aGlzLnNob3VsZENoZWNrRm9yTWVtTGVha3MoKSkge1xuICAgICAgLy8gVHJhY2sgdGhlIG51bWJlciBvZiBtb3ZlcyBkdXJpbmcgYSBrZXJuZWwgZXhlY3V0aW9uIHRvIGNvcnJlY3RseVxuICAgICAgLy8gZGV0ZWN0IG1lbW9yeSBsZWFrcy5cbiAgICAgIHRoaXMuc3RhdGUubnVtRGF0YU1vdmVzU3RhY2tbdGhpcy5zdGF0ZS5udW1EYXRhTW92ZXNTdGFjay5sZW5ndGggLSAxXSsrO1xuICAgIH1cbiAgfVxuXG4gIHRpZHk8VCBleHRlbmRzIFRlbnNvckNvbnRhaW5lcj4obmFtZU9yRm46IHN0cmluZ3xTY29wZUZuPFQ+LCBmbj86IFNjb3BlRm48VD4pOlxuICAgICAgVCB7XG4gICAgbGV0IG5hbWU6IHN0cmluZyA9IG51bGw7XG4gICAgaWYgKGZuID09IG51bGwpIHtcbiAgICAgIC8vIENhbGxlZCB3aXRoIG9ubHkgMSBhcmd1bWVudC5cbiAgICAgIGlmICh0eXBlb2YgbmFtZU9yRm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgcHJvdmlkZSBhIGZ1bmN0aW9uIHRvIHRpZHkoKScpO1xuICAgICAgfVxuICAgICAgZm4gPSBuYW1lT3JGbjtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQ2FsbGVkIHdpdGggMiBhcmd1bWVudHMuXG4gICAgICBpZiAodHlwZW9mIG5hbWVPckZuICE9PSAnc3RyaW5nJyAmJiAhKG5hbWVPckZuIGluc3RhbmNlb2YgU3RyaW5nKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAnV2hlbiBjYWxsaW5nIHdpdGggdHdvIGFyZ3VtZW50cywgdGhlIGZpcnN0IGFyZ3VtZW50ICcgK1xuICAgICAgICAgICAgJ3RvIHRpZHkoKSBtdXN0IGJlIGEgc3RyaW5nJyk7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICdXaGVuIGNhbGxpbmcgd2l0aCB0d28gYXJndW1lbnRzLCB0aGUgMm5kIGFyZ3VtZW50ICcgK1xuICAgICAgICAgICAgJ3RvIHRpZHkoKSBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgIH1cbiAgICAgIG5hbWUgPSBuYW1lT3JGbiBhcyBzdHJpbmc7XG4gICAgICAvLyBUT0RPKG5zdGhvcmF0LHNtaWxrb3YpOiBEbyBvcGVyYXRpb24gbG9nZ2luZyBhbmQgcGVyZm9ybWFuY2VcbiAgICAgIC8vIHByb2ZpbGluZy5cbiAgICB9XG4gICAgbGV0IHJlc3VsdDogVDtcbiAgICByZXR1cm4gdGhpcy5zY29wZWRSdW4oXG4gICAgICAgICgpID0+IHRoaXMuc3RhcnRTY29wZShuYW1lKSwgKCkgPT4gdGhpcy5lbmRTY29wZShyZXN1bHQpLCAoKSA9PiB7XG4gICAgICAgICAgcmVzdWx0ID0gZm4oKTtcbiAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ2Fubm90IHJldHVybiBhIFByb21pc2UgaW5zaWRlIG9mIHRpZHkuJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzY29wZWRSdW48VD4oc3RhcnQ6ICgpID0+IHZvaWQsIGVuZDogKCkgPT4gdm9pZCwgZjogKCkgPT4gVCk6IFQge1xuICAgIHN0YXJ0KCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcyA9IGYoKTtcbiAgICAgIGVuZCgpO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgZW5kKCk7XG4gICAgICB0aHJvdyBleDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBuZXh0VGVuc29ySWQgPSAwO1xuICBwcml2YXRlIG5leHRUZW5zb3JJZCgpOiBudW1iZXIge1xuICAgIHJldHVybiBFbmdpbmUubmV4dFRlbnNvcklkKys7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBuZXh0VmFyaWFibGVJZCA9IDA7XG4gIHByaXZhdGUgbmV4dFZhcmlhYmxlSWQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gRW5naW5lLm5leHRWYXJpYWJsZUlkKys7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIGluc3RlYWQgb2YgdGhlIHB1YmxpYy1mYWNpbmcgdGVuc29yLmNsb25lKCkgd2hlblxuICAgKiBzYXZpbmcgYSB0ZW5zb3IgZm9yIGJhY2t3YXJkcyBwYXNzLiBJdCBtYWtlcyBzdXJlIHRvIGFkZCB0aGUgY2xvbmVcbiAgICogb3BlcmF0aW9uIHRvIHRoZSB0YXBlIHJlZ2FyZGxlc3Mgb2YgYmVpbmcgY2FsbGVkIGluc2lkZSBhIGtlcm5lbFxuICAgKiBleGVjdXRpb24uXG4gICAqL1xuICBwcml2YXRlIGNsb25lKHg6IFRlbnNvcik6IFRlbnNvciB7XG4gICAgY29uc3QgeTogVGVuc29yID0gRU5HSU5FLnJ1bktlcm5lbChJZGVudGl0eSwge3h9IGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwKTtcbiAgICBjb25zdCBpbnB1dHMgPSB7eH07XG4gICAgY29uc3QgZ3JhZCA9IChkeTogVGVuc29yKSA9PiAoe1xuICAgICAgeDogKCkgPT4ge1xuICAgICAgICBjb25zdCBkdHlwZSA9ICdmbG9hdDMyJztcbiAgICAgICAgY29uc3QgZ3JhZElucHV0cyA9IHt4OiBkeX07XG4gICAgICAgIGNvbnN0IGF0dHJzID0ge2R0eXBlfTtcblxuICAgICAgICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChcbiAgICAgICAgICAgICAgICAgICBDYXN0LCBncmFkSW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLFxuICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tdW5uZWNlc3NhcnktdHlwZS1hc3NlcnRpb25cbiAgICAgICAgICAgICAgICAgICBhdHRycyBhcyB7fSBhcyBOYW1lZEF0dHJNYXApIGFzIFRlbnNvcjtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBzYXZlZDogVGVuc29yW10gPSBbXTtcbiAgICB0aGlzLmFkZFRhcGVOb2RlKHRoaXMuc3RhdGUuYWN0aXZlU2NvcGUubmFtZSwgaW5wdXRzLCBbeV0sIGdyYWQsIHNhdmVkLCB7fSk7XG4gICAgcmV0dXJuIHk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhIGtlcm5lbCB3aXRoIHRoZSBnaXZlbiBuYW1lIGFuZCByZXR1cm4gdGhlIG91dHB1dCB0ZW5zb3IuXG4gICAqXG4gICAqIEBwYXJhbSBrZXJuZWxOYW1lIFRoZSBuYW1lIG9mIHRoZSBrZXJuZWwgdG8gZXhlY3V0ZS5cbiAgICogQHBhcmFtIGlucHV0cyBBIG1hcCBvZiBpbnB1dCBuYW1lcyB0byB0ZW5zb3JzLlxuICAgKiBAcGFyYW0gYXR0cnMgQSBtYXAgb2YgYXR0cmlidXRlIG5hbWVzIHRvIHRoZWlyIHZhbHVlcy4gQW4gYXR0cmlidXRlIGlzIGFcbiAgICogICAgIHByaW1pdGl2ZSAobm9uLXRlbnNvcikgaW5wdXQgdG8gdGhlIGtlcm5lbC5cbiAgICogQHBhcmFtIGlucHV0c1RvU2F2ZSBBIGxpc3Qgb2YgdGVuc29ycywgaW5wdXRzIHRvIHNhdmUgZm9yIHRoZSBiYWNrcHJvcFxuICAgKiAgICAgY29tcHV0YXRpb24uXG4gICAqIEBwYXJhbSBvdXRwdXRzVG9TYXZlIEEgbGlzdCBvZiBib29sZWFucywgc3BlY2lmeWluZyB3aGljaCBvdXRwdXQgdG8gc2F2ZVxuICAgKiAgICAgZm9yIHRoZSBiYWNrcHJvcCBjb21wdXRhdGlvbi4gVGhlc2UgYXJlIGJvb2xlYW5zIHNpbmNlIHRoZSBvdXRwdXRcbiAgICogdGVuc29ycyBhcmUgbm90IHZpc2libGUgdG8gdGhlIHVzZXIuXG4gICAqL1xuICBydW5LZXJuZWw8VCBleHRlbmRzIFRlbnNvcnxUZW5zb3JbXT4oXG4gICAgICBrZXJuZWxOYW1lOiBzdHJpbmcsIGlucHV0czogTmFtZWRUZW5zb3JNYXAsIGF0dHJzPzogTmFtZWRBdHRyTWFwKTogVCB7XG4gICAgaWYgKHRoaXMuYmFja2VuZE5hbWUgPT0gbnVsbCkge1xuICAgICAgLy8gYmFja2VuZCBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQgeWV0IChiYWNrZW5kIGluaXRpYWxpemF0aW9uIGlzIGxhenlcbiAgICAgIC8vIGNhbiBiZSBkZWZlcnJlZCB1bnRpbCBhbiBvcC8ga2VybmVsIGlzIHJ1bikuXG4gICAgICAvLyBUaGUgYmVsb3cgZ2V0dGVyIGhhcyBzaWRlIGVmZmVjdHMgdGhhdCB3aWxsIHRyeSB0byBpbml0aWFsaXplIHRoZVxuICAgICAgLy8gYmFja2VuZCBhbmQgc2V0IHByb3BlcnRpZXMgbGlrZSB0aGlzLmJhY2tlbmROYW1lXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVudXNlZC1leHByZXNzaW9uXG4gICAgICB0aGlzLmJhY2tlbmQ7XG4gICAgfVxuICAgIGNvbnN0IGhhc0tlcm5lbCA9IGdldEtlcm5lbChrZXJuZWxOYW1lLCB0aGlzLmJhY2tlbmROYW1lKSAhPSBudWxsO1xuICAgIGlmICghaGFzS2VybmVsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEtlcm5lbCAnJHtrZXJuZWxOYW1lfScgbm90IHJlZ2lzdGVyZWQgZm9yIGJhY2tlbmQgJyR7XG4gICAgICAgICAgdGhpcy5iYWNrZW5kTmFtZX0nYCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnJ1bktlcm5lbEZ1bmMoe2tlcm5lbE5hbWUsIGlucHV0cywgYXR0cnN9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2hvdWxkQ2hlY2tGb3JNZW1MZWFrcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5FTlYuZ2V0Qm9vbCgnSVNfVEVTVCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVja0tlcm5lbEZvck1lbUxlYWsoXG4gICAgICBrZXJuZWxOYW1lOiBzdHJpbmcsIG51bURhdGFJZHNCZWZvcmU6IG51bWJlcixcbiAgICAgIG91dEluZm9zOiBUZW5zb3JJbmZvW10pOiB2b2lkIHtcbiAgICBjb25zdCBudW1EYXRhSWRzQWZ0ZXIgPSB0aGlzLmJhY2tlbmQubnVtRGF0YUlkcygpO1xuXG4gICAgLy8gQ291bnQgdGhlIG51bWJlciBvZiBkYXRhIGlkcyBhc3NvY2lhdGVkIHdpdGggdGhlIHJlc3VsdCBvZiB0aGUga2VybmVsLlxuICAgIGxldCBudW1PdXRwdXREYXRhSWRzID0gMDtcbiAgICBvdXRJbmZvcy5mb3JFYWNoKGluZm8gPT4ge1xuICAgICAgLy8gQ29tcGxleCBudW1iZXJzIGFsbG9jYXRlIDMgZGF0YSBpZHMsIG9uZSBmb3IgJ3JlYWwnLCBvbmUgZm9yXG4gICAgICAvLyAnaW1hZ2luYXJ5JywgYW5kIG9uZSBmb3IgdGhlIGNvbnRhaW5lciB0aGF0IGhvbGRzIHRoZSBmb3JtZXIgdHdvLlxuICAgICAgbnVtT3V0cHV0RGF0YUlkcyArPSAoaW5mby5kdHlwZSA9PT0gJ2NvbXBsZXg2NCcgPyAzIDogMSk7XG4gICAgfSk7XG5cbiAgICAvLyBBY2NvdW50IGZvciB0aGUgbnVtYmVyIG9mIG1vdmVzIGR1cmluZyBrZXJuZWwgZXhlY3V0aW9uLiBBIFwiZGF0YSBtb3ZlXCJcbiAgICAvLyBjYW4gaGFwcGVuIGluIHRoZSBtaWRkbGUgb2YgYSBrZXJuZWwgZXhlY3V0aW9uLCBwbGFjaW5nIGEgbmV3IChrZXksdmFsdWUpXG4gICAgLy8gcGFpciBpbiB0aGUgZGF0YSBzdG9yYWdlLiBTaW5jZSBkYXRhIG1vdmVzIGhhdmUgbmV0IHplcm8gZWZmZWN0ICh3ZVxuICAgIC8vIGFsd2F5cyByZW1vdmUgdGhlIGRhdGEgZnJvbSB0aGUgb2xkIGJhY2tlbmQpLCB3ZSBoYXZlIHRvIGNhbmNlbCB0aGVtIG91dFxuICAgIC8vIHdoZW4gZGV0ZWN0aW5nIG1lbW9yeSBsZWFrcy5cbiAgICBjb25zdCBudW1Nb3ZlcyA9XG4gICAgICAgIHRoaXMuc3RhdGUubnVtRGF0YU1vdmVzU3RhY2tbdGhpcy5zdGF0ZS5udW1EYXRhTW92ZXNTdGFjay5sZW5ndGggLSAxXTtcbiAgICBjb25zdCBkYXRhSWRzTGVha2VkID1cbiAgICAgICAgbnVtRGF0YUlkc0FmdGVyIC0gbnVtRGF0YUlkc0JlZm9yZSAtIG51bU91dHB1dERhdGFJZHMgLSBudW1Nb3ZlcztcbiAgICBpZiAoZGF0YUlkc0xlYWtlZCA+IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgQmFja2VuZCAnJHt0aGlzLmJhY2tlbmROYW1lfScgaGFzIGFuIGludGVybmFsIG1lbW9yeSBsZWFrIGAgK1xuICAgICAgICAgIGAoJHtkYXRhSWRzTGVha2VkfSBkYXRhIGlkcykgYWZ0ZXIgcnVubmluZyAnJHtrZXJuZWxOYW1lfSdgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJuYWwgaGVscGVyIG1ldGhvZCB0byBleGVjdXRlIGEga2VybmVsIEZ1bmNcbiAgICpcbiAgICogVXNlIGBydW5LZXJuZWxgIHRvIGV4ZWN1dGUga2VybmVscyBmcm9tIG91dHNpZGUgb2YgZW5naW5lLlxuICAgKi9cbiAgcHJpdmF0ZSBydW5LZXJuZWxGdW5jPFQgZXh0ZW5kcyBUZW5zb3J8VGVuc29yW10sIEkgZXh0ZW5kcyBOYW1lZFRlbnNvck1hcD4oXG4gICAgICBrZXJuZWxQYXJhbXM6IFJlZ2lzdGVyZWRLZXJuZWxJbnZvY2F0aW9uPEk+fFxuICAgICAgQ3VzdG9tR3JhZEtlcm5lbEludm9jYXRpb248VCwgST4pOiBUIHtcbiAgICBsZXQgb3V0cHV0czogVGVuc29yW107XG4gICAgbGV0IHNhdmVkOiBUZW5zb3JbXSA9IFtdO1xuICAgIGNvbnN0IGlzVGFwZU9uID0gdGhpcy5pc1RhcGVPbigpO1xuXG4gICAgY29uc3Qgc3RhcnRpbmdCeXRlY291bnQgPSB0aGlzLnN0YXRlLm51bUJ5dGVzO1xuICAgIGNvbnN0IHN0YXJ0aW5nTnVtVGVuc29ycyA9IHRoaXMuc3RhdGUubnVtVGVuc29ycztcblxuICAgIGlmICh0aGlzLnNob3VsZENoZWNrRm9yTWVtTGVha3MoKSkge1xuICAgICAgdGhpcy5zdGF0ZS5udW1EYXRhTW92ZXNTdGFjay5wdXNoKDApO1xuICAgIH1cblxuICAgIGxldCBrZXJuZWxGdW5jOiAoKSA9PiBUZW5zb3JbXTtcbiAgICBpZiAodGhpcy5iYWNrZW5kTmFtZSA9PSBudWxsKSB7XG4gICAgICAvLyBiYWNrZW5kIGhhcyBub3QgYmVlbiBpbml0aWFsaXplZCB5ZXQgKGJhY2tlbmQgaW5pdGlhbGl6YXRpb24gaXMgbGF6eVxuICAgICAgLy8gY2FuIGJlIGRlZmVycmVkIHVudGlsIGFuIG9wLyBrZXJuZWwgaXMgcnVuKS5cbiAgICAgIC8vIFRoZSBiZWxvdyBnZXR0ZXIgaGFzIHNpZGUgZWZmZWN0cyB0aGF0IHdpbGwgdHJ5IHRvIGluaXRpYWxpemUgdGhlXG4gICAgICAvLyBiYWNrZW5kIGFuZCBzZXQgcHJvcGVydGllcyBsaWtlIHRoaXMuYmFja2VuZE5hbWVcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tdW51c2VkLWV4cHJlc3Npb25cbiAgICAgIHRoaXMuYmFja2VuZDtcbiAgICB9XG5cbiAgICBsZXQgb3V0OiBUZW5zb3JJbmZvfFRlbnNvckluZm9bXTtcblxuICAgIGNvbnN0IGtlcm5lbE9yU2NvcGVOYW1lID0gaXNSZWdpc3RlcmVkS2VybmVsSW52b2NhdGlvbihrZXJuZWxQYXJhbXMpID9cbiAgICAgICAga2VybmVsUGFyYW1zLmtlcm5lbE5hbWUgOlxuICAgICAgICB0aGlzLnN0YXRlLmFjdGl2ZVNjb3BlICE9IG51bGwgPyB0aGlzLnN0YXRlLmFjdGl2ZVNjb3BlLm5hbWUgOiAnJztcblxuICAgIC8vIENyZWF0ZSB0aGUga2VybmVsRnVuYyBmcm9tIGVpdGhlciBhIHJlZ2lzdGVyZWQga2VybmVsIE9SIHBhc3NlZCBpblxuICAgIC8vIGZvcndhcmQvYmFja3dhcmQgZnVuY3Rpb25zICh1c2VkIGJ5IGN1c3RvbSBncmFkKS4gSW4gdGhpcyBjb250ZXh0IGFcbiAgICAvLyBrZXJuZWxGdW5jIHdyYXBzIGEga2VybmVsIGltcGxlbWVudGF0aW9uIHdpdGggc29tZSBib29ra2VlcGluZy5cblxuICAgIGlmIChpc1JlZ2lzdGVyZWRLZXJuZWxJbnZvY2F0aW9uKGtlcm5lbFBhcmFtcykpIHtcbiAgICAgIGNvbnN0IHtrZXJuZWxOYW1lLCBpbnB1dHMsIGF0dHJzfSA9IGtlcm5lbFBhcmFtcztcbiAgICAgIGlmICh0aGlzLmJhY2tlbmROYW1lID09IG51bGwpIHtcbiAgICAgICAgLy8gYmFja2VuZCBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQgeWV0IChiYWNrZW5kIGluaXRpYWxpemF0aW9uIGlzIGxhenlcbiAgICAgICAgLy8gY2FuIGJlIGRlZmVycmVkIHVudGlsIGFuIG9wLyBrZXJuZWwgaXMgcnVuKS5cbiAgICAgICAgLy8gVGhlIGJlbG93IGdldHRlciBoYXMgc2lkZSBlZmZlY3RzIHRoYXQgd2lsbCB0cnkgdG8gaW5pdGlhbGl6ZSB0aGVcbiAgICAgICAgLy8gYmFja2VuZCBhbmQgc2V0IHByb3BlcnRpZXMgbGlrZSB0aGlzLmJhY2tlbmROYW1lXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tdW51c2VkLWV4cHJlc3Npb25cbiAgICAgICAgdGhpcy5iYWNrZW5kO1xuICAgICAgfVxuICAgICAgY29uc3Qga2VybmVsID0gZ2V0S2VybmVsKGtlcm5lbE5hbWUsIHRoaXMuYmFja2VuZE5hbWUpO1xuICAgICAgdXRpbC5hc3NlcnQoXG4gICAgICAgICAga2VybmVsICE9IG51bGwsXG4gICAgICAgICAgKCkgPT4gYENhbm5vdCBmaW5kIHJlZ2lzdGVyZWQga2VybmVsICcke2tlcm5lbE5hbWV9JyBmb3IgYmFja2VuZCAnJHtcbiAgICAgICAgICAgICAgdGhpcy5iYWNrZW5kTmFtZX0nYCk7XG5cbiAgICAgIGtlcm5lbEZ1bmMgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG51bURhdGFJZHNCZWZvcmUgPSB0aGlzLmJhY2tlbmQubnVtRGF0YUlkcygpO1xuICAgICAgICBvdXQgPSBrZXJuZWwua2VybmVsRnVuYyh7aW5wdXRzLCBhdHRycywgYmFja2VuZDogdGhpcy5iYWNrZW5kfSk7XG4gICAgICAgIGNvbnN0IG91dEluZm9zID0gQXJyYXkuaXNBcnJheShvdXQpID8gb3V0IDogW291dF07XG4gICAgICAgIGlmICh0aGlzLnNob3VsZENoZWNrRm9yTWVtTGVha3MoKSkge1xuICAgICAgICAgIHRoaXMuY2hlY2tLZXJuZWxGb3JNZW1MZWFrKGtlcm5lbE5hbWUsIG51bURhdGFJZHNCZWZvcmUsIG91dEluZm9zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG91dFRlbnNvcnMgPSBvdXRJbmZvcy5tYXAoKG91dEluZm86IFRlbnNvckluZm98VGVuc29yKSA9PiB7XG4gICAgICAgICAgLy8gdG9kbyAoeWFzc29nYmEpIHJlbW92ZSB0aGlzIG9wdGlvbiAoVGVuc29yKSB3aGVuIG5vZGUgYmFja2VuZFxuICAgICAgICAgIC8vIG1ldGhvZHMgaGF2ZSBiZWVuIG1vZHVsYXJpemVkIGFuZCB0aGV5IGFsbCByZXR1cm4gdGVuc29ySW5mby5cbiAgICAgICAgICAvLyBUZW5zb3JJbmZvcyBkbyBub3QgaGF2ZSBhIHJhbmsgYXR0cmlidXRlLlxuICAgICAgICAgIGlmICgob3V0SW5mbyBhcyBUZW5zb3IpLnJhbmsgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG91dEluZm8gYXMgVGVuc29yO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhpcy5tYWtlVGVuc29yRnJvbVRlbnNvckluZm8ob3V0SW5mbyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFNhdmUgYW55IHJlcXVpcmVkIGlucHV0cyBhbmQgb3V0cHV0cy5cblxuICAgICAgICAvLyBEbyBub3Qgc2F2ZSB1bmxlc3Mgd2UgYXJlIHJlY29yZGluZyB0byB0aGUgdGFwZS4gT3RoZXJ3aXNlIGl0IHdvdWxkXG4gICAgICAgIC8vIGNhdXNlIGEgbWVtIGxlYWsgc2luY2UgdGhlcmUgd291bGQgYmUgbm8gYmFja3Byb3AgZm9yIHRoZXNlIHRlbnNvcnNcbiAgICAgICAgLy8gKHdoaWNoIHdvdWxkIG90aGVyd2lzZSBkaXNwb3NlIHRoZW0pLlxuICAgICAgICBpZiAoaXNUYXBlT24pIHtcbiAgICAgICAgICBjb25zdCB0ZW5zb3JzVG9TYXZlID1cbiAgICAgICAgICAgICAgdGhpcy5nZXRUZW5zb3JzRm9yR3JhZGllbnQoa2VybmVsTmFtZSwgaW5wdXRzLCBvdXRUZW5zb3JzKTtcbiAgICAgICAgICBzYXZlZCA9IHRoaXMuc2F2ZVRlbnNvcnNGb3JCYWNrd2FyZE1vZGUodGVuc29yc1RvU2F2ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dFRlbnNvcnM7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB7Zm9yd2FyZEZ1bmN9ID0ga2VybmVsUGFyYW1zO1xuICAgICAgLy8gUnVubmluZyBhIGN1c3RvbUdyYWQgb3AuXG4gICAgICBjb25zdCBzYXZlRnVuYzogR3JhZFNhdmVGdW5jID0gKHRlbnNvcnMpID0+IHtcbiAgICAgICAgLy8gRG8gbm90IHNhdmUgdW5sZXNzIHdlIGFyZSByZWNvcmRpbmcgdG8gdGhlIHRhcGUuIE90aGVyd2lzZSBpdCB3b3VsZFxuICAgICAgICAvLyBjYXVzZSBhIG1lbSBsZWFrIHNpbmNlIHdlIHdvdWxkIG5ldmVyIHJ1biBiYWNrcHJvcCwgd2hpY2ggZGlzcG9zZXNcbiAgICAgICAgLy8gdGhlIGtlcHQgdGVuc29ycy5cbiAgICAgICAgaWYgKCFpc1RhcGVPbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzYXZlZCA9IHRlbnNvcnMubWFwKHRlbnNvciA9PiB0aGlzLmtlZXAodGhpcy5jbG9uZSh0ZW5zb3IpKSk7XG4gICAgICB9O1xuXG4gICAgICBrZXJuZWxGdW5jID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBudW1EYXRhSWRzQmVmb3JlID0gdGhpcy5iYWNrZW5kLm51bURhdGFJZHMoKTtcbiAgICAgICAgb3V0ID0gdGhpcy50aWR5KCgpID0+IGZvcndhcmRGdW5jKHRoaXMuYmFja2VuZCwgc2F2ZUZ1bmMpKTtcbiAgICAgICAgY29uc3Qgb3V0cyA9IChBcnJheS5pc0FycmF5KG91dCkgPyBvdXQgOiBbb3V0XSkgYXMgVGVuc29yW107XG4gICAgICAgIGlmICh0aGlzLnNob3VsZENoZWNrRm9yTWVtTGVha3MoKSkge1xuICAgICAgICAgIC8vIFNjb3BlIG5hbWUgaXMgdXNlZCB0byBwcmludCBhIG1vcmUgaGVscGZ1bCBlcnJvciBtZXNzYWdlIGlmIG5lZWRlZC5cbiAgICAgICAgICB0aGlzLmNoZWNrS2VybmVsRm9yTWVtTGVhayhrZXJuZWxPclNjb3BlTmFtZSwgbnVtRGF0YUlkc0JlZm9yZSwgb3V0cyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHM7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vXG4gICAgLy8gUnVuIHRoZSBrZXJuZWxGdW5jLiBPcHRpb25hbGx5IHByb2ZpbGluZyBpdC5cbiAgICAvL1xuICAgIGNvbnN0IHtpbnB1dHMsIGF0dHJzfSA9IGtlcm5lbFBhcmFtcztcbiAgICBjb25zdCBiYWNrd2FyZHNGdW5jID0gaXNSZWdpc3RlcmVkS2VybmVsSW52b2NhdGlvbihrZXJuZWxQYXJhbXMpID9cbiAgICAgICAgbnVsbCA6XG4gICAgICAgIGtlcm5lbFBhcmFtcy5iYWNrd2FyZHNGdW5jO1xuXG4gICAgbGV0IGtlcm5lbFByb2ZpbGU6IEtlcm5lbFByb2ZpbGU7XG4gICAgdGhpcy5zY29wZWRSdW4oXG4gICAgICAgIC8vIFN0b3AgcmVjb3JkaW5nIHRvIGEgdGFwZSB3aGVuIHJ1bm5pbmcgYSBrZXJuZWwuXG4gICAgICAgICgpID0+IHRoaXMuc3RhdGUua2VybmVsRGVwdGgrKywgKCkgPT4gdGhpcy5zdGF0ZS5rZXJuZWxEZXB0aC0tLCAoKSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLkVOVi5nZXRCb29sKCdERUJVRycpICYmICF0aGlzLnN0YXRlLnByb2ZpbGluZykge1xuICAgICAgICAgICAgb3V0cHV0cyA9IGtlcm5lbEZ1bmMoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAga2VybmVsUHJvZmlsZSA9IHRoaXMucHJvZmlsZXIucHJvZmlsZUtlcm5lbChcbiAgICAgICAgICAgICAgICBrZXJuZWxPclNjb3BlTmFtZSwgaW5wdXRzLCAoKSA9PiBrZXJuZWxGdW5jKCkpO1xuICAgICAgICAgICAgaWYgKHRoaXMuRU5WLmdldEJvb2woJ0RFQlVHJykpIHtcbiAgICAgICAgICAgICAgdGhpcy5wcm9maWxlci5sb2dLZXJuZWxQcm9maWxlKGtlcm5lbFByb2ZpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3V0cHV0cyA9IGtlcm5lbFByb2ZpbGUub3V0cHV0cztcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgaWYgKGlzVGFwZU9uKSB7XG4gICAgICB0aGlzLmFkZFRhcGVOb2RlKFxuICAgICAgICAgIGtlcm5lbE9yU2NvcGVOYW1lLCBpbnB1dHMsIG91dHB1dHMsIGJhY2t3YXJkc0Z1bmMsIHNhdmVkLCBhdHRycyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdGUucHJvZmlsaW5nKSB7XG4gICAgICB0aGlzLnN0YXRlLmFjdGl2ZVByb2ZpbGUua2VybmVscy5wdXNoKHtcbiAgICAgICAgbmFtZToga2VybmVsT3JTY29wZU5hbWUsXG4gICAgICAgIGJ5dGVzQWRkZWQ6IHRoaXMuc3RhdGUubnVtQnl0ZXMgLSBzdGFydGluZ0J5dGVjb3VudCxcbiAgICAgICAgdG90YWxCeXRlc1NuYXBzaG90OiB0aGlzLnN0YXRlLm51bUJ5dGVzLFxuICAgICAgICB0ZW5zb3JzQWRkZWQ6IHRoaXMuc3RhdGUubnVtVGVuc29ycyAtIHN0YXJ0aW5nTnVtVGVuc29ycyxcbiAgICAgICAgdG90YWxUZW5zb3JzU25hcHNob3Q6IHRoaXMuc3RhdGUubnVtVGVuc29ycyxcbiAgICAgICAgaW5wdXRTaGFwZXM6IE9iamVjdC5rZXlzKGlucHV0cykubWFwKFxuICAgICAgICAgICAga2V5ID0+IGlucHV0c1trZXldICE9IG51bGwgPyBpbnB1dHNba2V5XS5zaGFwZSA6IG51bGwpLFxuICAgICAgICBvdXRwdXRTaGFwZXM6IG91dHB1dHMubWFwKGl0ZW0gPT4gaXRlbS5zaGFwZSksXG4gICAgICAgIGtlcm5lbFRpbWVNczoga2VybmVsUHJvZmlsZS50aW1lTXMsXG4gICAgICAgIGV4dHJhSW5mbzoga2VybmVsUHJvZmlsZS5leHRyYUluZm9cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gKEFycmF5LmlzQXJyYXkob3V0KSA/IG91dHB1dHMgOiBvdXRwdXRzWzBdKSBhcyBUO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmVzIHRlbnNvcnMgdXNlZCBpbiBmb3J3YXJkIG1vZGUgZm9yIHVzZSBpbiBiYWNrd2FyZCBtb2RlLlxuICAgKlxuICAgKiBAcGFyYW0gdGVuc29ycyB0aGUgbGlzdCBvZiB0ZW5zb3JzIHRvIHNhdmUuXG4gICAqL1xuICBwcml2YXRlIHNhdmVUZW5zb3JzRm9yQmFja3dhcmRNb2RlKHRlbnNvcnM6IFRlbnNvcltdKTogVGVuc29yW10ge1xuICAgIGNvbnN0IHNhdmVkID0gdGVuc29ycy5tYXAodGVuc29yID0+IHRoaXMua2VlcCh0aGlzLmNsb25lKHRlbnNvcikpKTtcbiAgICByZXR1cm4gc2F2ZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGxpc3Qgb2YgdGVuc29ycyB0byBzYXZlIGZvciBhIGdpdmVuIGdyYWRpZW50IGNhbGN1bGF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ga2VybmVsTmFtZSBuYW1lIG9mIGtlcm5lbCB0byBsb29rIHVwIGdyYWRpZW50IGZvci5cbiAgICogQHBhcmFtIGlucHV0cyBhIG1hcCBvZiBpbnB1dCB0ZW5zb3JzLlxuICAgKiBAcGFyYW0gb3V0cHV0cyBhbiBhcnJheSBvZiBvdXRwdXQgdGVuc29ycyBmcm9tIGZvcndhcmQgbW9kZSBvZiBrZXJuZWwuXG4gICAqL1xuICBwcml2YXRlIGdldFRlbnNvcnNGb3JHcmFkaWVudChcbiAgICAgIGtlcm5lbE5hbWU6IHN0cmluZywgaW5wdXRzOiBOYW1lZFRlbnNvck1hcCxcbiAgICAgIG91dHB1dHM6IFRlbnNvcltdKTogVGVuc29yW118bnVsbCB7XG4gICAgY29uc3QgZ3JhZENvbmZpZyA9IGdldEdyYWRpZW50KGtlcm5lbE5hbWUpO1xuICAgIGlmIChncmFkQ29uZmlnICE9IG51bGwpIHtcbiAgICAgIGNvbnN0IGlucHV0c1RvU2F2ZTogc3RyaW5nW10gPSBncmFkQ29uZmlnLmlucHV0c1RvU2F2ZSB8fCBbXTtcbiAgICAgIGNvbnN0IG91dHB1dHNUb1NhdmU6IGJvb2xlYW5bXSA9IGdyYWRDb25maWcub3V0cHV0c1RvU2F2ZSB8fCBbXTtcblxuICAgICAgLy8gSWYgc2F2ZUFsbElucHV0cyBpcyB0cnVlLCBhbGwgaW5wdXRzIHdpbGwgYmUgc2F2ZWQuIE90aGVyd2lzZSwgaW5wdXRzXG4gICAgICAvLyBzcGVjaWZpZWQgaW4gaW5wdXRzVG9TYXZlIHdpbGwgYmUgc2F2ZWQuXG4gICAgICBsZXQgaW5wdXRUZW5zb3JzVG9TYXZlOiBUZW5zb3JbXTtcbiAgICAgIGlmIChncmFkQ29uZmlnLnNhdmVBbGxJbnB1dHMpIHtcbiAgICAgICAgdXRpbC5hc3NlcnQoXG4gICAgICAgICAgICBBcnJheS5pc0FycmF5KGlucHV0cyksXG4gICAgICAgICAgICAoKSA9PiAnc2F2ZUFsbElucHV0cyBpcyB0cnVlLCBleHBlY3RlZCBpbnB1dHMgdG8gYmUgYW4gYXJyYXkuJyk7XG5cbiAgICAgICAgaW5wdXRUZW5zb3JzVG9TYXZlID0gT2JqZWN0LmtleXMoaW5wdXRzKS5tYXAoKGtleSkgPT4gaW5wdXRzW2tleV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXRUZW5zb3JzVG9TYXZlID0gaW5wdXRzVG9TYXZlLm1hcCgoaW5wdXROYW1lKSA9PiBpbnB1dHNbaW5wdXROYW1lXSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG91dHB1dFRlbnNvcnNUb1NhdmU6IFRlbnNvcltdID1cbiAgICAgICAgICBvdXRwdXRzLmZpbHRlcigoXywgaSkgPT4gb3V0cHV0c1RvU2F2ZVtpXSk7XG5cbiAgICAgIHJldHVybiBpbnB1dFRlbnNvcnNUb1NhdmUuY29uY2F0KG91dHB1dFRlbnNvcnNUb1NhdmUpO1xuICAgIH1cbiAgICAvLyBXZSByZXR1cm4gYW4gZW1wdHkgbGlzdCByYXRoZXIgdGhhbiB0aHJvdyBhbiBlcnJvciBiZWNhdXNlIHRoZSBrZXJuZWwgd2VcbiAgICAvLyBhcmUgbG9va2luZyB1cCBtYXkgbm90IGFjdHVhbGx5IGJlIHJlbGV2YW50IHRvIGJhY2twcm9waW5nIHRocm91Z2ggdGhlXG4gICAgLy8gb3ZlcmFsbCBmdW5jdGlvblxuICAgIC8vXG4gICAgLy8gU2VlICdkb2VzIG5vdCBlcnJvciBpZiBpcnJlbGV2YW50IChwcnVuZWQpIG9wcyBhcmUgbWlzc2luZyBncmFkcycgdGVzdFxuICAgIC8vIGluIGdyYWRpZW50c190ZXN0LnRzIGZvciBhbiBleGFtcGxlLlxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcm5hbCBtZXRob2QgdXNlZCBieSBwdWJsaWMgQVBJcyBmb3IgdGVuc29yIGNyZWF0aW9uLiBNYWtlcyBhIG5ld1xuICAgKiB0ZW5zb3Igd2l0aCB0aGUgcHJvdmlkZWQgc2hhcGUsIGR0eXBlIGFuZCB2YWx1ZXMuIEl0IGFsd2F5c1xuICAgKiBjcmVhdGVzIGEgbmV3IGRhdGEgaWQgYW5kIHdyaXRlcyB0aGUgdmFsdWVzIHRvIHRoZSB1bmRlcmx5aW5nIGJhY2tlbmQuXG4gICAqL1xuICBtYWtlVGVuc29yKFxuICAgICAgdmFsdWVzOiBEYXRhVmFsdWVzLCBzaGFwZTogbnVtYmVyW10sIGR0eXBlOiBEYXRhVHlwZSxcbiAgICAgIGJhY2tlbmQ/OiBLZXJuZWxCYWNrZW5kKTogVGVuc29yIHtcbiAgICBpZiAodmFsdWVzID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVmFsdWVzIHBhc3NlZCB0byBlbmdpbmUubWFrZVRlbnNvcigpIGFyZSBudWxsJyk7XG4gICAgfVxuICAgIGR0eXBlID0gZHR5cGUgfHwgJ2Zsb2F0MzInO1xuICAgIGJhY2tlbmQgPSBiYWNrZW5kIHx8IHRoaXMuYmFja2VuZDtcbiAgICBsZXQgYmFja2VuZFZhbHMgPSB2YWx1ZXMgYXMgQmFja2VuZFZhbHVlcztcbiAgICBpZiAoZHR5cGUgPT09ICdzdHJpbmcnICYmIHV0aWwuaXNTdHJpbmcodmFsdWVzWzBdKSkge1xuICAgICAgYmFja2VuZFZhbHMgPSAodmFsdWVzIGFzIHN0cmluZ1tdKS5tYXAoZCA9PiB1dGlsLmVuY29kZVN0cmluZyhkKSk7XG4gICAgfVxuICAgIGNvbnN0IGRhdGFJZCA9IGJhY2tlbmQud3JpdGUoYmFja2VuZFZhbHMsIHNoYXBlLCBkdHlwZSk7XG4gICAgY29uc3QgdCA9IG5ldyBUZW5zb3Ioc2hhcGUsIGR0eXBlLCBkYXRhSWQsIHRoaXMubmV4dFRlbnNvcklkKCkpO1xuICAgIHRoaXMudHJhY2tUZW5zb3IodCwgYmFja2VuZCk7XG5cbiAgICAvLyBDb3VudCBieXRlcyBmb3Igc3RyaW5nIHRlbnNvcnMuXG4gICAgaWYgKGR0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgaW5mbyA9IHRoaXMuc3RhdGUudGVuc29ySW5mby5nZXQoZGF0YUlkKTtcbiAgICAgIGNvbnN0IG5ld0J5dGVzID0gYnl0ZXNGcm9tU3RyaW5nQXJyYXkoYmFja2VuZFZhbHMgYXMgVWludDhBcnJheVtdKTtcbiAgICAgIHRoaXMuc3RhdGUubnVtQnl0ZXMgKz0gbmV3Qnl0ZXMgLSBpbmZvLmJ5dGVzO1xuICAgICAgaW5mby5ieXRlcyA9IG5ld0J5dGVzO1xuICAgIH1cbiAgICByZXR1cm4gdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcm5hbCBtZXRob2QgdXNlZCBieSBiYWNrZW5kcy4gTWFrZXMgYSBuZXcgdGVuc29yXG4gICAqIHRoYXQgaXMgYSB3cmFwcGVyIGFyb3VuZCBhbiBleGlzdGluZyBkYXRhIGlkLiBJdCBkb2Vzbid0IGNyZWF0ZVxuICAgKiBhIG5ldyBkYXRhIGlkLCBvbmx5IGluY3JlbWVudHMgdGhlIHJlZiBjb3VudCB1c2VkIGluIG1lbW9yeSB0cmFja2luZy5cbiAgICogQGRlcHJlY2F0ZWRcbiAgICovXG4gIG1ha2VUZW5zb3JGcm9tRGF0YUlkKFxuICAgIGRhdGFJZDogRGF0YUlkLCBzaGFwZTogbnVtYmVyW10sIGR0eXBlOiBEYXRhVHlwZSxcbiAgICBiYWNrZW5kPzogS2VybmVsQmFja2VuZCk6IFRlbnNvciB7XG4gICAgZHR5cGUgPSBkdHlwZSB8fCAnZmxvYXQzMic7XG4gICAgY29uc3QgdGVuc29ySW5mbzogVGVuc29ySW5mbyA9IHtkYXRhSWQsIHNoYXBlLCBkdHlwZX07XG4gICAgcmV0dXJuIHRoaXMubWFrZVRlbnNvckZyb21UZW5zb3JJbmZvKHRlbnNvckluZm8sIGJhY2tlbmQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVybmFsIG1ldGhvZCB1c2VkIGJ5IGJhY2tlbmRzLiBNYWtlcyBhIG5ldyB0ZW5zb3IgdGhhdCBpcyBhIHdyYXBwZXJcbiAgICogYXJvdW5kIGFuIGV4aXN0aW5nIGRhdGEgaWQgaW4gVGVuc29ySW5mby4gSXQgZG9lc24ndCBjcmVhdGUgYSBuZXcgZGF0YSBpZCxcbiAgICogb25seSBpbmNyZW1lbnRzIHRoZSByZWYgY291bnQgdXNlZCBpbiBtZW1vcnkgdHJhY2tpbmcuXG4gICAqL1xuICBtYWtlVGVuc29yRnJvbVRlbnNvckluZm8odGVuc29ySW5mbzogVGVuc29ySW5mbywgYmFja2VuZD86IEtlcm5lbEJhY2tlbmQpOlxuICAgICAgVGVuc29yIHtcbiAgICBjb25zdCB7ZGF0YUlkLCBzaGFwZSwgZHR5cGV9ID0gdGVuc29ySW5mbztcbiAgICBjb25zdCB0ID0gbmV3IFRlbnNvcihzaGFwZSwgZHR5cGUsIGRhdGFJZCwgdGhpcy5uZXh0VGVuc29ySWQoKSk7XG4gICAgdGhpcy50cmFja1RlbnNvcih0LCBiYWNrZW5kKTtcbiAgICByZXR1cm4gdDtcbiAgfVxuXG4gIG1ha2VWYXJpYWJsZShcbiAgICAgIGluaXRpYWxWYWx1ZTogVGVuc29yLCB0cmFpbmFibGUgPSB0cnVlLCBuYW1lPzogc3RyaW5nLFxuICAgICAgZHR5cGU/OiBEYXRhVHlwZSk6IFZhcmlhYmxlIHtcbiAgICBuYW1lID0gbmFtZSB8fCB0aGlzLm5leHRWYXJpYWJsZUlkKCkudG9TdHJpbmcoKTtcbiAgICBpZiAoZHR5cGUgIT0gbnVsbCAmJiBkdHlwZSAhPT0gaW5pdGlhbFZhbHVlLmR0eXBlKSB7XG4gICAgICBpbml0aWFsVmFsdWUgPSBpbml0aWFsVmFsdWUuY2FzdChkdHlwZSk7XG4gICAgfVxuICAgIGNvbnN0IHYgPSBuZXcgVmFyaWFibGUoaW5pdGlhbFZhbHVlLCB0cmFpbmFibGUsIG5hbWUsIHRoaXMubmV4dFRlbnNvcklkKCkpO1xuICAgIGlmICh0aGlzLnN0YXRlLnJlZ2lzdGVyZWRWYXJpYWJsZXNbdi5uYW1lXSAhPSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFZhcmlhYmxlIHdpdGggbmFtZSAke3YubmFtZX0gd2FzIGFscmVhZHkgcmVnaXN0ZXJlZGApO1xuICAgIH1cbiAgICB0aGlzLnN0YXRlLnJlZ2lzdGVyZWRWYXJpYWJsZXNbdi5uYW1lXSA9IHY7XG4gICAgdGhpcy5pbmNSZWYodiwgdGhpcy5iYWNrZW5kKTtcbiAgICByZXR1cm4gdjtcbiAgfVxuXG4gIHRyYWNrVGVuc29yKGE6IFRlbnNvciwgYmFja2VuZDogS2VybmVsQmFja2VuZCk6IHZvaWQge1xuICAgIHRoaXMuc3RhdGUubnVtVGVuc29ycysrO1xuICAgIGlmIChhLmR0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5zdGF0ZS5udW1TdHJpbmdUZW5zb3JzKys7XG4gICAgfVxuICAgIC8vIEJ5dGVzIGZvciBjb21wbGV4IG51bWJlcnMgYXJlIGNvdW50ZWQgYnkgdGhlaXIgY29tcG9uZW50cy4gQnl0ZXMgZm9yXG4gICAgLy8gc3RyaW5nIHRlbnNvcnMgYXJlIGNvdW50ZWQgd2hlbiB3cml0aW5nIHZhbHVlcy5cbiAgICBsZXQgYnl0ZXMgPSAwO1xuICAgIGlmIChhLmR0eXBlICE9PSAnY29tcGxleDY0JyAmJiBhLmR0eXBlICE9PSAnc3RyaW5nJykge1xuICAgICAgYnl0ZXMgPSBhLnNpemUgKiB1dGlsLmJ5dGVzUGVyRWxlbWVudChhLmR0eXBlKTtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZS5udW1CeXRlcyArPSBieXRlcztcblxuICAgIGlmICghdGhpcy5zdGF0ZS50ZW5zb3JJbmZvLmhhcyhhLmRhdGFJZCkpIHtcbiAgICAgIHRoaXMuc3RhdGUubnVtRGF0YUJ1ZmZlcnMrKztcbiAgICAgIHRoaXMuc3RhdGUudGVuc29ySW5mby5zZXQoYS5kYXRhSWQsIHtcbiAgICAgICAgYmFja2VuZDogYmFja2VuZCB8fCB0aGlzLmJhY2tlbmQsXG4gICAgICAgIGR0eXBlOiBhLmR0eXBlLFxuICAgICAgICBzaGFwZTogYS5zaGFwZSxcbiAgICAgICAgYnl0ZXNcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghKGEgaW5zdGFuY2VvZiBWYXJpYWJsZSkpIHtcbiAgICAgIHRoaXMudHJhY2soYSk7XG4gICAgfVxuICB9XG5cbiAgLy8gVHJhY2sgdGhlIHRlbnNvciBieSBkYXRhSWQgYW5kIGluY3JlYXNlIHRoZSByZWZDb3VudCBmb3IgdGhlIGRhdGFJZCBpbiB0aGVcbiAgLy8gYmFja2VuZC5cbiAgLy8gVE9ETyhweXUxMDA1NSk6IFRoaXMgaXMgY3VycmVudGx5IHVzZWQgYnkgbWFrZVZhcmlhYmxlIG1ldGhvZCwgdG8gaW5jcmVhc2VcbiAgLy8gcmVmQ291bnQgb24gdGhlIGJhY2tlbmQgZm9yIHRoZSBkYXRhSWQuIEl0IGNhbiBwb3RlbnRpYWxseSBiZSByZXBsYWNlZCB3aXRoXG4gIC8vIElkZW50aXR5IG9wIGluZGVhZCBvZiBjYWxsaW5nIGJhY2tlbmQgZGlyZWN0bHkuXG4gIGluY1JlZihhOiBUZW5zb3IsIGJhY2tlbmQ6IEtlcm5lbEJhY2tlbmQpOiB2b2lkIHtcbiAgICB0aGlzLnRyYWNrVGVuc29yKGEsIGJhY2tlbmQpO1xuICAgIHRoaXMuYmFja2VuZC5pbmNSZWYoYS5kYXRhSWQpO1xuICB9XG5cbiAgcmVtb3ZlRGF0YUlkKGRhdGFJZDogRGF0YUlkLCBiYWNrZW5kOiBLZXJuZWxCYWNrZW5kKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudGVuc29ySW5mby5oYXMoZGF0YUlkKSAmJlxuICAgICAgICB0aGlzLnN0YXRlLnRlbnNvckluZm8uZ2V0KGRhdGFJZCkuYmFja2VuZCA9PT0gYmFja2VuZCkge1xuICAgICAgdGhpcy5zdGF0ZS50ZW5zb3JJbmZvLmRlbGV0ZShkYXRhSWQpO1xuICAgICAgdGhpcy5zdGF0ZS5udW1EYXRhQnVmZmVycy0tO1xuICAgIH1cbiAgfVxuICBkaXNwb3NlVGVuc29yKGE6IFRlbnNvcik6IHZvaWQge1xuICAgIGlmICghdGhpcy5zdGF0ZS50ZW5zb3JJbmZvLmhhcyhhLmRhdGFJZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaW5mbyA9IHRoaXMuc3RhdGUudGVuc29ySW5mby5nZXQoYS5kYXRhSWQpO1xuXG4gICAgdGhpcy5zdGF0ZS5udW1UZW5zb3JzLS07XG4gICAgaWYgKGEuZHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnN0YXRlLm51bVN0cmluZ1RlbnNvcnMtLTtcbiAgICAgIHRoaXMuc3RhdGUubnVtQnl0ZXMgLT0gaW5mby5ieXRlcztcbiAgICB9XG4gICAgLy8gRG9uJ3QgY291bnQgYnl0ZXMgZm9yIGNvbXBsZXggbnVtYmVycyBhcyB0aGV5IGFyZSBjb3VudGVkIGJ5IHRoZWlyXG4gICAgLy8gY29tcG9uZW50cy5cbiAgICBpZiAoYS5kdHlwZSAhPT0gJ2NvbXBsZXg2NCcgJiYgYS5kdHlwZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IGJ5dGVzID0gYS5zaXplICogdXRpbC5ieXRlc1BlckVsZW1lbnQoYS5kdHlwZSk7XG4gICAgICB0aGlzLnN0YXRlLm51bUJ5dGVzIC09IGJ5dGVzO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSB0aGUgcmVmZXJlbmNlIHRvIGRhdGFJZCBpZiBiYWNrZW5kIGRpc3Bvc2UgdGhlIGRhdGEgc3VjY2Vzc2Z1bGx5XG4gICAgaWYgKGluZm8uYmFja2VuZC5kaXNwb3NlRGF0YShhLmRhdGFJZCkpIHtcbiAgICAgIHRoaXMucmVtb3ZlRGF0YUlkKGEuZGF0YUlkLCBpbmZvLmJhY2tlbmQpO1xuICAgIH1cblxuICAgIC8vIFRPRE8obnN0aG9yYXQpOiBDb25zdHJ1Y3QgYW4gZXJyb3IgYW5kIHNhdmUgdGhlIHN0YWNrIHRyYWNlIGZvclxuICAgIC8vIGRlYnVnZ2luZyB3aGVuIGluIGRlYnVnIG1vZGUuIENyZWF0aW5nIGEgc3RhY2sgdHJhY2UgaXMgdG9vIGV4cGVuc2l2ZVxuICAgIC8vIHRvIGRvIHVuY29uZGl0aW9uYWxseS5cbiAgfVxuXG4gIGRpc3Bvc2VWYXJpYWJsZXMoKTogdm9pZCB7XG4gICAgZm9yIChjb25zdCB2YXJOYW1lIGluIHRoaXMuc3RhdGUucmVnaXN0ZXJlZFZhcmlhYmxlcykge1xuICAgICAgY29uc3QgdiA9IHRoaXMuc3RhdGUucmVnaXN0ZXJlZFZhcmlhYmxlc1t2YXJOYW1lXTtcbiAgICAgIHRoaXMuZGlzcG9zZVZhcmlhYmxlKHYpO1xuICAgIH1cbiAgfVxuXG4gIGRpc3Bvc2VWYXJpYWJsZSh2OiBWYXJpYWJsZSk6IHZvaWQge1xuICAgIHRoaXMuZGlzcG9zZVRlbnNvcih2KTtcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWdpc3RlcmVkVmFyaWFibGVzW3YubmFtZV0gIT0gbnVsbCkge1xuICAgICAgZGVsZXRlIHRoaXMuc3RhdGUucmVnaXN0ZXJlZFZhcmlhYmxlc1t2Lm5hbWVdO1xuICAgIH1cbiAgfVxuXG4gIG1lbW9yeSgpOiBNZW1vcnlJbmZvIHtcbiAgICBjb25zdCBpbmZvID0gdGhpcy5iYWNrZW5kLm1lbW9yeSgpIGFzIE1lbW9yeUluZm87XG4gICAgaW5mby5udW1UZW5zb3JzID0gdGhpcy5zdGF0ZS5udW1UZW5zb3JzO1xuICAgIGluZm8ubnVtRGF0YUJ1ZmZlcnMgPSB0aGlzLnN0YXRlLm51bURhdGFCdWZmZXJzO1xuICAgIGluZm8ubnVtQnl0ZXMgPSB0aGlzLnN0YXRlLm51bUJ5dGVzO1xuICAgIGlmICh0aGlzLnN0YXRlLm51bVN0cmluZ1RlbnNvcnMgPiAwKSB7XG4gICAgICBpbmZvLnVucmVsaWFibGUgPSB0cnVlO1xuICAgICAgaWYgKGluZm8ucmVhc29ucyA9PSBudWxsKSB7XG4gICAgICAgIGluZm8ucmVhc29ucyA9IFtdO1xuICAgICAgfVxuICAgICAgaW5mby5yZWFzb25zLnB1c2goXG4gICAgICAgICAgJ01lbW9yeSB1c2FnZSBieSBzdHJpbmcgdGVuc29ycyBpcyBhcHByb3hpbWF0ZSAnICtcbiAgICAgICAgICAnKDIgYnl0ZXMgcGVyIGNoYXJhY3RlciknKTtcbiAgICB9XG4gICAgcmV0dXJuIGluZm87XG4gIH1cblxuICBhc3luYyBwcm9maWxlKHF1ZXJ5OiAoKSA9PiAoVGVuc29yQ29udGFpbmVyIHwgUHJvbWlzZTxUZW5zb3JDb250YWluZXI+KSk6XG4gICAgICBQcm9taXNlPFByb2ZpbGVJbmZvPiB7XG4gICAgdGhpcy5zdGF0ZS5wcm9maWxpbmcgPSB0cnVlO1xuXG4gICAgY29uc3Qgc3RhcnRCeXRlcyA9IHRoaXMuc3RhdGUubnVtQnl0ZXM7XG4gICAgY29uc3Qgc3RhcnROdW1UZW5zb3JzID0gdGhpcy5zdGF0ZS5udW1UZW5zb3JzO1xuXG4gICAgdGhpcy5zdGF0ZS5hY3RpdmVQcm9maWxlLmtlcm5lbHMgPSBbXTtcbiAgICB0aGlzLnN0YXRlLmFjdGl2ZVByb2ZpbGUucmVzdWx0ID0gYXdhaXQgcXVlcnkoKTtcblxuICAgIHRoaXMuc3RhdGUucHJvZmlsaW5nID0gZmFsc2U7XG5cbiAgICB0aGlzLnN0YXRlLmFjdGl2ZVByb2ZpbGUucGVha0J5dGVzID0gTWF0aC5tYXgoXG4gICAgICAgIC4uLnRoaXMuc3RhdGUuYWN0aXZlUHJvZmlsZS5rZXJuZWxzLm1hcChkID0+IGQudG90YWxCeXRlc1NuYXBzaG90KSk7XG4gICAgdGhpcy5zdGF0ZS5hY3RpdmVQcm9maWxlLm5ld0J5dGVzID0gdGhpcy5zdGF0ZS5udW1CeXRlcyAtIHN0YXJ0Qnl0ZXM7XG4gICAgdGhpcy5zdGF0ZS5hY3RpdmVQcm9maWxlLm5ld1RlbnNvcnMgPVxuICAgICAgICB0aGlzLnN0YXRlLm51bVRlbnNvcnMgLSBzdGFydE51bVRlbnNvcnM7XG4gICAgZm9yIChjb25zdCBrZXJuZWwgb2YgdGhpcy5zdGF0ZS5hY3RpdmVQcm9maWxlLmtlcm5lbHMpIHtcbiAgICAgIGtlcm5lbC5rZXJuZWxUaW1lTXMgPSBhd2FpdCBrZXJuZWwua2VybmVsVGltZU1zO1xuICAgICAga2VybmVsLmV4dHJhSW5mbyA9IGF3YWl0IGtlcm5lbC5leHRyYUluZm87XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN0YXRlLmFjdGl2ZVByb2ZpbGU7XG4gIH1cblxuICBpc1RhcGVPbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5ncmFkaWVudERlcHRoID4gMCAmJiB0aGlzLnN0YXRlLmtlcm5lbERlcHRoID09PSAwO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRUYXBlTm9kZShcbiAgICAgIGtlcm5lbE5hbWU6IHN0cmluZywgaW5wdXRzOiBOYW1lZFRlbnNvck1hcCwgb3V0cHV0czogVGVuc29yW10sXG4gICAgICBncmFkaWVudHNGdW5jOiBHcmFkRnVuYywgc2F2ZWQ6IFRlbnNvcltdLCBhdHRyczogTmFtZWRBdHRyTWFwKTogdm9pZCB7XG4gICAgY29uc3QgdGFwZU5vZGU6IFRhcGVOb2RlID1cbiAgICAgICAge2lkOiB0aGlzLnN0YXRlLm5leHRUYXBlTm9kZUlkKyssIGtlcm5lbE5hbWUsIGlucHV0cywgb3V0cHV0cywgc2F2ZWR9O1xuXG4gICAgY29uc3QgZ3JhZENvbmZpZyA9IGdldEdyYWRpZW50KGtlcm5lbE5hbWUpO1xuICAgIGlmIChncmFkQ29uZmlnICE9IG51bGwpIHtcbiAgICAgIGdyYWRpZW50c0Z1bmMgPSBncmFkQ29uZmlnLmdyYWRGdW5jO1xuICAgIH1cbiAgICBpZiAoZ3JhZGllbnRzRnVuYyAhPSBudWxsKSB7XG4gICAgICB0YXBlTm9kZS5ncmFkaWVudCA9IChkeXM6IFRlbnNvcltdKSA9PiB7XG4gICAgICAgIC8vIFRPRE8oc21pbGtvdik6IFRvIG9wdGltaXplIGJhY2stcHJvcCwgcGFzcyBkeXMgdGhhdCBhcmUgbm90IHVzZWQgaW5cbiAgICAgICAgLy8gdGhlIGJhY2twcm9wIGdyYXBoIHRvIHRoZSB1c2VyIGFzIG51bGwgaW5zdGVhZCBvZiB6ZXJvc1xuICAgICAgICBkeXMgPSBkeXMubWFwKChkeSwgaSkgPT4ge1xuICAgICAgICAgIGlmIChkeSA9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBvdXRwdXQgPSBvdXRwdXRzW2ldO1xuICAgICAgICAgICAgY29uc3QgdmFscyA9IHV0aWwubWFrZVplcm9zVHlwZWRBcnJheShvdXRwdXQuc2l6ZSwgb3V0cHV0LmR0eXBlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1ha2VUZW5zb3IodmFscywgb3V0cHV0LnNoYXBlLCBvdXRwdXQuZHR5cGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZHk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBHcmFkIGZ1bmN0aW9ucyBvZiBvcHMgd2l0aCBzaW5nbGUgb3V0cHV0cyBleHBlY3QgYSBkeSwgd2hpbGUgb3BzXG4gICAgICAgIC8vIHdpdGggbXVsdGlwbGUgb3V0cHV0cyBleHBlY3QgZHlzIChhcnJheSBvZiBkeSkuXG4gICAgICAgIHJldHVybiBncmFkaWVudHNGdW5jKGR5cy5sZW5ndGggPiAxID8gZHlzIDogZHlzWzBdLCBzYXZlZCwgYXR0cnMpO1xuICAgICAgfTtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZS5hY3RpdmVUYXBlLnB1c2godGFwZU5vZGUpO1xuICB9XG5cbiAga2VlcDxUIGV4dGVuZHMgVGVuc29yPihyZXN1bHQ6IFQpOiBUIHtcbiAgICByZXN1bHQua2VwdCA9IHRydWU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRUYXBlKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmdyYWRpZW50RGVwdGggPT09IDApIHtcbiAgICAgIHRoaXMuc3RhdGUuYWN0aXZlVGFwZSA9IFtdO1xuICAgIH1cbiAgICB0aGlzLnN0YXRlLmdyYWRpZW50RGVwdGgrKztcbiAgfVxuXG4gIHByaXZhdGUgZW5kVGFwZSgpIHtcbiAgICB0aGlzLnN0YXRlLmdyYWRpZW50RGVwdGgtLTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCBhIHNjb3BlLiBVc2UgdGhpcyB3aXRoIGVuZFNjb3BlKCkgdG8gYWNoaWV2ZSB0aGUgc2FtZSBmdW5jdGlvbmFsaXR5XG4gICAqIGFzIHNjb3BlKCkgd2l0aG91dCB0aGUgbmVlZCBmb3IgYSBmdW5jdGlvbiBjbG9zdXJlLlxuICAgKi9cbiAgc3RhcnRTY29wZShuYW1lPzogc3RyaW5nKSB7XG4gICAgY29uc3Qgc2NvcGVJbmZvOiBTY29wZVN0YXRlID0ge1xuICAgICAgdHJhY2s6IFtdLFxuICAgICAgbmFtZTogJ3VubmFtZWQgc2NvcGUnLFxuICAgICAgaWQ6IHRoaXMuc3RhdGUubmV4dFNjb3BlSWQrK1xuICAgIH07XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIHNjb3BlSW5mby5uYW1lID0gbmFtZTtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZS5zY29wZVN0YWNrLnB1c2goc2NvcGVJbmZvKTtcbiAgICB0aGlzLnN0YXRlLmFjdGl2ZVNjb3BlID0gc2NvcGVJbmZvO1xuICB9XG5cbiAgLyoqXG4gICAqIEVuZCBhIHNjb3BlLiBVc2UgdGhpcyB3aXRoIHN0YXJ0U2NvcGUoKSB0byBhY2hpZXZlIHRoZSBzYW1lIGZ1bmN0aW9uYWxpdHlcbiAgICogYXMgc2NvcGUoKSB3aXRob3V0IHRoZSBuZWVkIGZvciBhIGZ1bmN0aW9uIGNsb3N1cmUuXG4gICAqL1xuICBlbmRTY29wZShyZXN1bHQ/OiBUZW5zb3JDb250YWluZXIpIHtcbiAgICBjb25zdCB0ZW5zb3JzVG9UcmFja0luUGFyZW50ID0gZ2V0VGVuc29yc0luQ29udGFpbmVyKHJlc3VsdCk7XG4gICAgY29uc3QgdGVuc29yc1RvVHJhY2tJblBhcmVudFNldCA9XG4gICAgICAgIG5ldyBTZXQodGVuc29yc1RvVHJhY2tJblBhcmVudC5tYXAodCA9PiB0LmlkKSk7XG5cbiAgICAvLyBEaXNwb3NlIHRoZSBhcnJheXMgdHJhY2tlZCBpbiB0aGlzIHNjb3BlLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGF0ZS5hY3RpdmVTY29wZS50cmFjay5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgdGVuc29yID0gdGhpcy5zdGF0ZS5hY3RpdmVTY29wZS50cmFja1tpXTtcbiAgICAgIGlmICghdGVuc29yLmtlcHQgJiYgIXRlbnNvcnNUb1RyYWNrSW5QYXJlbnRTZXQuaGFzKHRlbnNvci5pZCkpIHtcbiAgICAgICAgdGVuc29yLmRpc3Bvc2UoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBvbGRTY29wZSA9IHRoaXMuc3RhdGUuc2NvcGVTdGFjay5wb3AoKTtcbiAgICB0aGlzLnN0YXRlLmFjdGl2ZVNjb3BlID0gdGhpcy5zdGF0ZS5zY29wZVN0YWNrLmxlbmd0aCA9PT0gMCA/XG4gICAgICAgIG51bGwgOlxuICAgICAgICB0aGlzLnN0YXRlLnNjb3BlU3RhY2tbdGhpcy5zdGF0ZS5zY29wZVN0YWNrLmxlbmd0aCAtIDFdO1xuXG4gICAgLy8gVHJhY2sgdGhlIGN1cnJlbnQgcmVzdWx0IGluIHRoZSBwYXJlbnQgc2NvcGUuXG4gICAgdGVuc29yc1RvVHJhY2tJblBhcmVudC5mb3JFYWNoKHRlbnNvciA9PiB7XG4gICAgICAvLyBPbmx5IHRyYWNrIHRoZSB0ZW5zb3IgaWYgd2FzIGFsbG9jYXRlZCBpbiB0aGUgaW5uZXIgc2NvcGUgYW5kIGlzIG5vdFxuICAgICAgLy8gZ2xvYmFsbHkga2VwdC5cbiAgICAgIGlmICghdGVuc29yLmtlcHQgJiYgdGVuc29yLnNjb3BlSWQgPT09IG9sZFNjb3BlLmlkKSB7XG4gICAgICAgIHRoaXMudHJhY2sodGVuc29yKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGdyYWRpZW50cyBvZiBgZmAgd2l0aCByZXNwZWN0IHRvIGVhY2ggb2YgdGhlIGB4c2AuIFRoZSBncmFkaWVudHNcbiAgICogcmV0dXJuZWQgYXJlIG9mIHRoZSBzYW1lIGxlbmd0aCBhcyBgeHNgLCBidXQgc29tZSBtaWdodCBiZSBudWxsIGlmIGBmYFxuICAgKiB3YXMgbm90IGEgZnVuY3Rpb24gb2YgdGhhdCBgeGAuIEl0IGFsc28gdGFrZXMgb3B0aW9uYWwgZHkgdG8gbXVsdGlwbHkgdGhlXG4gICAqIGdyYWRpZW50LCB3aGljaCBkZWZhdWx0cyB0byBgMWAuXG4gICAqL1xuICBncmFkaWVudHM8VCBleHRlbmRzIFRlbnNvcj4oXG4gICAgICBmOiAoKSA9PiBULCB4czogVGVuc29yW10sIGR5PzogVCxcbiAgICAgIGFsbG93Tm9HcmFkaWVudHMgPSBmYWxzZSk6IHt2YWx1ZTogVCwgZ3JhZHM6IFRlbnNvcltdfSB7XG4gICAgdXRpbC5hc3NlcnQoXG4gICAgICAgIHhzLmxlbmd0aCA+IDAsICgpID0+ICdncmFkaWVudHMoKSByZWNlaXZlZCBhbiBlbXB0eSBsaXN0IG9mIHhzLicpO1xuICAgIGlmIChkeSAhPSBudWxsICYmIGR5LmR0eXBlICE9PSAnZmxvYXQzMicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgZHkgbXVzdCBoYXZlICdmbG9hdDMyJyBkdHlwZSwgYnV0IGhhcyAnJHtkeS5kdHlwZX0nYCk7XG4gICAgfVxuXG4gICAgY29uc3QgeSA9IHRoaXMuc2NvcGVkUnVuKFxuICAgICAgICAoKSA9PiB0aGlzLnN0YXJ0VGFwZSgpLCAoKSA9PiB0aGlzLmVuZFRhcGUoKSxcbiAgICAgICAgKCkgPT4gdGhpcy50aWR5KCdmb3J3YXJkJywgZikpO1xuXG4gICAgdXRpbC5hc3NlcnQoXG4gICAgICAgIHkgaW5zdGFuY2VvZiBUZW5zb3IsXG4gICAgICAgICgpID0+ICdUaGUgcmVzdWx0IHkgcmV0dXJuZWQgYnkgZigpIG11c3QgYmUgYSB0ZW5zb3IuJyk7XG4gICAgLy8gRmlsdGVyIG91dCB0aGUgbm9kZXMgdGhhdCBkb24ndCBjb25uZWN0IHggPT4geS5cbiAgICBjb25zdCBmaWx0ZXJlZFRhcGUgPSBnZXRGaWx0ZXJlZE5vZGVzWFRvWSh0aGlzLnN0YXRlLmFjdGl2ZVRhcGUsIHhzLCB5KTtcbiAgICBpZiAoIWFsbG93Tm9HcmFkaWVudHMgJiYgZmlsdGVyZWRUYXBlLmxlbmd0aCA9PT0gMCAmJiB4cy5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBjb21wdXRlIGdyYWRpZW50IG9mIHk9Zih4KSB3aXRoIHJlc3BlY3QgdG8geC4gTWFrZSBzdXJlICcgK1xuICAgICAgICAgICd0aGF0IHRoZSBmIHlvdSBwYXNzZWQgZW5jbG9zZXMgYWxsIG9wZXJhdGlvbnMgdGhhdCBsZWFkIGZyb20geCAnICtcbiAgICAgICAgICAndG8geS4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy50aWR5KCdiYWNrd2FyZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjY3VtdWxhdGVkR3JhZGllbnRNYXA6IHtbdGVuc29ySWQ6IG51bWJlcl06IFRlbnNvcn0gPSB7fTtcbiAgICAgIGFjY3VtdWxhdGVkR3JhZGllbnRNYXBbeS5pZF0gPSAoZHkgPT0gbnVsbCkgPyBvbmVzKHkuc2hhcGUpIDogZHk7XG5cbiAgICAgIC8vIEJhY2twcm9wIGdyYWRpZW50cyB0aHJvdWdoIHRoZSBmaWx0ZXJlZCBub2Rlcy5cbiAgICAgIGJhY2twcm9wYWdhdGVHcmFkaWVudHMoXG4gICAgICAgICAgYWNjdW11bGF0ZWRHcmFkaWVudE1hcCwgZmlsdGVyZWRUYXBlLFxuICAgICAgICAgIC8vIFBhc3MgdGhlIHRpZHkgZnVuY3Rpb24gdG8gYXZvaWQgY2lyY3VsYXIgZGVwIHdpdGggYHRhcGUudHNgLlxuICAgICAgICAgIGYgPT4gdGhpcy50aWR5KGYgYXMgU2NvcGVGbjxUZW5zb3I+KSxcbiAgICAgICAgICAvLyBQYXNzIGFuIGFkZCBmdW5jdGlvbiB0byBhdm9pZGUgYSBjaXJjdWxhciBkZXAgd2l0aCBgdGFwZS50c2AuXG4gICAgICAgICAgYWRkKTtcbiAgICAgIGNvbnN0IGdyYWRzID0geHMubWFwKHggPT4gYWNjdW11bGF0ZWRHcmFkaWVudE1hcFt4LmlkXSk7XG5cbiAgICAgIGlmICh0aGlzLnN0YXRlLmdyYWRpZW50RGVwdGggPT09IDApIHtcbiAgICAgICAgLy8gVGhpcyBtZWFucyB0aGF0IHdlIGFyZSBub3QgY29tcHV0aW5nIGhpZ2hlci1vcmRlciBncmFkaWVudHNcbiAgICAgICAgLy8gYW5kIGNhbiBjbGVhbiB1cCB0aGUgdGFwZS5cbiAgICAgICAgdGhpcy5zdGF0ZS5hY3RpdmVUYXBlLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgZm9yIChjb25zdCB0ZW5zb3Igb2Ygbm9kZS5zYXZlZCkge1xuICAgICAgICAgICAgdGVuc29yLmRpc3Bvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnN0YXRlLmFjdGl2ZVRhcGUgPSBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHt2YWx1ZTogeSwgZ3JhZHN9O1xuICAgIH0pO1xuICB9XG5cbiAgY3VzdG9tR3JhZDxUIGV4dGVuZHMgVGVuc29yPihmOiBDdXN0b21HcmFkaWVudEZ1bmM8VD4pOlxuICAgICAgKC4uLmFyZ3M6IEFycmF5PFRlbnNvcnxHcmFkU2F2ZUZ1bmM+KSA9PiBUIHtcbiAgICB1dGlsLmFzc2VydChcbiAgICAgICAgdXRpbC5pc0Z1bmN0aW9uKGYpLFxuICAgICAgICAoKSA9PiAnVGhlIGYgcGFzc2VkIGluIGN1c3RvbUdyYWQoZikgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICAgIHJldHVybiAoLi4uaW5wdXRzOiBUZW5zb3JbXSk6IFQgPT4ge1xuICAgICAgdXRpbC5hc3NlcnQoXG4gICAgICAgICAgaW5wdXRzLmV2ZXJ5KHQgPT4gdCBpbnN0YW5jZW9mIFRlbnNvciksXG4gICAgICAgICAgKCkgPT4gJ1RoZSBhcmdzIHBhc3NlZCBpbiBjdXN0b21HcmFkKGYpKHgxLCB4MiwuLi4pIG11c3QgYWxsIGJlICcgK1xuICAgICAgICAgICAgICAndGVuc29ycycpO1xuXG4gICAgICBsZXQgcmVzOiB7XG4gICAgICAgIHZhbHVlOiBULFxuICAgICAgICBncmFkRnVuYzogKGR5OiBULCBzYXZlZDogVGVuc29yW10pID0+IFRlbnNvciB8IFRlbnNvcltdLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGlucHV0TWFwOiBOYW1lZFRlbnNvck1hcCA9IHt9O1xuICAgICAgaW5wdXRzLmZvckVhY2goKGlucHV0LCBpKSA9PiB7XG4gICAgICAgIGlucHV0TWFwW2ldID0gaW5wdXQ7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZm9yd2FyZEZ1bmM6IEZvcndhcmRGdW5jPFQ+ID0gKF8sIHNhdmUpID0+IHtcbiAgICAgICAgcmVzID0gZiguLi5bLi4uaW5wdXRzLCBzYXZlXSk7XG4gICAgICAgIHV0aWwuYXNzZXJ0KFxuICAgICAgICAgICAgcmVzLnZhbHVlIGluc3RhbmNlb2YgVGVuc29yLFxuICAgICAgICAgICAgKCkgPT4gJ1RoZSBmdW5jdGlvbiBmIHBhc3NlZCBpbiBjdXN0b21HcmFkKGYpIG11c3QgcmV0dXJuIGFuICcgK1xuICAgICAgICAgICAgICAgICdvYmplY3Qgd2hlcmUgYG9iai52YWx1ZWAgaXMgYSB0ZW5zb3InKTtcbiAgICAgICAgdXRpbC5hc3NlcnQoXG4gICAgICAgICAgICB1dGlsLmlzRnVuY3Rpb24ocmVzLmdyYWRGdW5jKSxcbiAgICAgICAgICAgICgpID0+ICdUaGUgZnVuY3Rpb24gZiBwYXNzZWQgaW4gY3VzdG9tR3JhZChmKSBtdXN0IHJldHVybiBhbiAnICtcbiAgICAgICAgICAgICAgICAnb2JqZWN0IHdoZXJlIGBvYmouZ3JhZEZ1bmNgIGlzIGEgZnVuY3Rpb24uJyk7XG4gICAgICAgIHJldHVybiByZXMudmFsdWU7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBiYWNrd2FyZHNGdW5jID0gKGR5OiBULCBzYXZlZDogVGVuc29yW10pID0+IHtcbiAgICAgICAgY29uc3QgZ3JhZFJlcyA9IHJlcy5ncmFkRnVuYyhkeSwgc2F2ZWQpO1xuICAgICAgICBjb25zdCBncmFkczogVGVuc29yW10gPSBBcnJheS5pc0FycmF5KGdyYWRSZXMpID8gZ3JhZFJlcyA6IFtncmFkUmVzXTtcbiAgICAgICAgdXRpbC5hc3NlcnQoXG4gICAgICAgICAgICBncmFkcy5sZW5ndGggPT09IGlucHV0cy5sZW5ndGgsXG4gICAgICAgICAgICAoKSA9PiAnVGhlIGZ1bmN0aW9uIGYgcGFzc2VkIGluIGN1c3RvbUdyYWQoZikgbXVzdCByZXR1cm4gYW4gJyArXG4gICAgICAgICAgICAgICAgJ29iamVjdCB3aGVyZSBgb2JqLmdyYWRGdW5jYCBpcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyAnICtcbiAgICAgICAgICAgICAgICAndGhlIHNhbWUgbnVtYmVyIG9mIHRlbnNvcnMgYXMgaW5wdXRzIHBhc3NlZCB0byBmKC4uLikuJyk7XG4gICAgICAgIHV0aWwuYXNzZXJ0KFxuICAgICAgICAgICAgZ3JhZHMuZXZlcnkodCA9PiB0IGluc3RhbmNlb2YgVGVuc29yKSxcbiAgICAgICAgICAgICgpID0+ICdUaGUgZnVuY3Rpb24gZiBwYXNzZWQgaW4gY3VzdG9tR3JhZChmKSBtdXN0IHJldHVybiBhbiAnICtcbiAgICAgICAgICAgICAgICAnb2JqZWN0IHdoZXJlIGBvYmouZ3JhZEZ1bmNgIGlzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zICcgK1xuICAgICAgICAgICAgICAgICdhIGxpc3Qgb2Ygb25seSB0ZW5zb3JzLicpO1xuICAgICAgICBjb25zdCBncmFkTWFwOiB7W2tleTogc3RyaW5nXTogKCkgPT4gVGVuc29yfSA9IHt9O1xuICAgICAgICBncmFkcy5mb3JFYWNoKChncmFkLCBpKSA9PiB7XG4gICAgICAgICAgZ3JhZE1hcFtpXSA9ICgpID0+IGdyYWQ7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZ3JhZE1hcDtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiB0aGlzLnJ1bktlcm5lbEZ1bmMoe1xuICAgICAgICBmb3J3YXJkRnVuYyxcbiAgICAgICAgYmFja3dhcmRzRnVuYyxcbiAgICAgICAgaW5wdXRzOiBpbnB1dE1hcCxcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cblxuICByZWFkU3luYyhkYXRhSWQ6IERhdGFJZCk6IEJhY2tlbmRWYWx1ZXMge1xuICAgIC8vIFJvdXRlIHRoZSByZWFkIHRvIHRoZSBjb3JyZWN0IGJhY2tlbmQuXG4gICAgY29uc3QgaW5mbyA9IHRoaXMuc3RhdGUudGVuc29ySW5mby5nZXQoZGF0YUlkKTtcbiAgICByZXR1cm4gaW5mby5iYWNrZW5kLnJlYWRTeW5jKGRhdGFJZCk7XG4gIH1cbiAgcmVhZChkYXRhSWQ6IERhdGFJZCk6IFByb21pc2U8QmFja2VuZFZhbHVlcz4ge1xuICAgIC8vIFJvdXRlIHRoZSByZWFkIHRvIHRoZSBjb3JyZWN0IGJhY2tlbmQuXG4gICAgY29uc3QgaW5mbyA9IHRoaXMuc3RhdGUudGVuc29ySW5mby5nZXQoZGF0YUlkKTtcbiAgICByZXR1cm4gaW5mby5iYWNrZW5kLnJlYWQoZGF0YUlkKTtcbiAgfVxuXG4gIHJlYWRUb0dQVShkYXRhSWQ6IERhdGFJZCwgb3B0aW9ucz86IERhdGFUb0dQVU9wdGlvbnMpOiBHUFVEYXRhIHtcbiAgICAvLyBSb3V0ZSB0aGUgcmVhZCB0byB0aGUgY29ycmVjdCBiYWNrZW5kLlxuICAgIGNvbnN0IGluZm8gPSB0aGlzLnN0YXRlLnRlbnNvckluZm8uZ2V0KGRhdGFJZCk7XG4gICAgcmV0dXJuIGluZm8uYmFja2VuZC5yZWFkVG9HUFUoZGF0YUlkLCBvcHRpb25zKTtcbiAgfVxuXG4gIGFzeW5jIHRpbWUocXVlcnk6ICgpID0+IHZvaWQpOiBQcm9taXNlPFRpbWluZ0luZm8+IHtcbiAgICBjb25zdCBzdGFydCA9IG5vdygpO1xuICAgIGNvbnN0IHRpbWluZ0luZm8gPSBhd2FpdCB0aGlzLmJhY2tlbmQudGltZShxdWVyeSkgYXMgVGltaW5nSW5mbztcbiAgICB0aW1pbmdJbmZvLndhbGxNcyA9IG5vdygpIC0gc3RhcnQ7XG4gICAgcmV0dXJuIHRpbWluZ0luZm87XG4gIH1cblxuICAvKipcbiAgICogVHJhY2tzIGEgVGVuc29yIGluIHRoZSBjdXJyZW50IHNjb3BlIHRvIGJlIGF1dG9tYXRpY2FsbHkgY2xlYW5lZCB1cFxuICAgKiB3aGVuIHRoZSBjdXJyZW50IHNjb3BlIGVuZHMsIGFuZCByZXR1cm5zIHRoZSB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIHJlc3VsdCBUaGUgVGVuc29yIHRvIHRyYWNrIGluIHRoZSBjdXJyZW50IHNjb3BlLlxuICAgKi9cbiAgcHJpdmF0ZSB0cmFjazxUIGV4dGVuZHMgVGVuc29yPihyZXN1bHQ6IFQpOiBUIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmVTY29wZSAhPSBudWxsKSB7XG4gICAgICByZXN1bHQuc2NvcGVJZCA9IHRoaXMuc3RhdGUuYWN0aXZlU2NvcGUuaWQ7XG4gICAgICB0aGlzLnN0YXRlLmFjdGl2ZVNjb3BlLnRyYWNrLnB1c2gocmVzdWx0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZ2V0IHJlZ2lzdGVyZWRWYXJpYWJsZXMoKTogTmFtZWRWYXJpYWJsZU1hcCB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUucmVnaXN0ZXJlZFZhcmlhYmxlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGVuZ2luZSBzdGF0ZS4gUmVtb3ZlcyBhbGwgYmFja2VuZHMgYnV0IGRvZXMgbm90IHJlbW92ZVxuICAgKiByZWdpc3RlcmVkIGJhY2tlbmQgZmFjdG9yaWVzLlxuICAgKi9cbiAgcmVzZXQoKTogdm9pZCB7XG4gICAgLy8gTWFrZSBhbnkgcGVuZGluZyBwcm9taXNlIG9ic29sZXRlLlxuICAgIHRoaXMucGVuZGluZ0JhY2tlbmRJbml0SWQrKztcblxuICAgIHRoaXMuc3RhdGUuZGlzcG9zZSgpO1xuICAgIHRoaXMuRU5WLnJlc2V0KCk7XG4gICAgdGhpcy5zdGF0ZSA9IG5ldyBFbmdpbmVTdGF0ZSgpO1xuXG4gICAgZm9yIChjb25zdCBiYWNrZW5kTmFtZSBpbiB0aGlzLnJlZ2lzdHJ5KSB7XG4gICAgICB0aGlzLmRpc3Bvc2VSZWdpc3RlcmVkS2VybmVscyhiYWNrZW5kTmFtZSk7XG4gICAgICB0aGlzLnJlZ2lzdHJ5W2JhY2tlbmROYW1lXS5kaXNwb3NlKCk7XG4gICAgICBkZWxldGUgdGhpcy5yZWdpc3RyeVtiYWNrZW5kTmFtZV07XG4gICAgfVxuICAgIHRoaXMuYmFja2VuZE5hbWUgPSBudWxsO1xuICAgIHRoaXMuYmFja2VuZEluc3RhbmNlID0gbnVsbDtcbiAgICB0aGlzLnBlbmRpbmdCYWNrZW5kSW5pdCA9IG51bGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gb25lcyhzaGFwZTogbnVtYmVyW10pOiBUZW5zb3Ige1xuICBjb25zdCB2YWx1ZXMgPSBtYWtlT25lc1R5cGVkQXJyYXkoc2l6ZUZyb21TaGFwZShzaGFwZSksICdmbG9hdDMyJyk7XG4gIHJldHVybiBFTkdJTkUubWFrZVRlbnNvcih2YWx1ZXMsIHNoYXBlLCAnZmxvYXQzMicpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3JNYWtlRW5naW5lKCk6IEVuZ2luZSB7XG4gIGNvbnN0IG5zID0gZ2V0R2xvYmFsTmFtZXNwYWNlKCkgYXMge30gYXMge190ZmVuZ2luZTogRW5naW5lfTtcbiAgaWYgKG5zLl90ZmVuZ2luZSA9PSBudWxsKSB7XG4gICAgY29uc3QgZW52aXJvbm1lbnQgPSBuZXcgRW52aXJvbm1lbnQobnMpO1xuICAgIG5zLl90ZmVuZ2luZSA9IG5ldyBFbmdpbmUoZW52aXJvbm1lbnQpO1xuICB9XG4gIHNldEVudmlyb25tZW50R2xvYmFsKG5zLl90ZmVuZ2luZS5FTlYpO1xuXG4gIC8vIFRlbGwgdGhlIGN1cnJlbnQgdGVuc29yIGludGVyZmFjZSB0aGF0IHRoZSBnbG9iYWwgZW5naW5lIGlzIHJlc3BvbnNpYmxlXG4gIC8vIGZvciB0cmFja2luZy5cbiAgc2V0VGVuc29yVHJhY2tlcigoKSA9PiBucy5fdGZlbmdpbmUpO1xuICByZXR1cm4gbnMuX3RmZW5naW5lO1xufVxuXG5leHBvcnQgY29uc3QgRU5HSU5FID0gZ2V0T3JNYWtlRW5naW5lKCk7XG5cbi8qKlxuICogQSBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgYWRkIG9wIGZvciB1c2Ugd2l0aGluIGVuZ2luZSBhbmQgdGFwZS5cbiAqXG4gKiBUaGlzIGFsbG93cyB1cyB0byBhdm9pZCBhIGNpcmN1bGFyIGRlcGVuZGVuY3kgYmV0d2VlbiBhZGQudHMgYW5kIGVuZ2luZS5cbiAqIEl0IGlzIGV4cG9ydGVkIHRvIGJlIGF2YWlsYWJsZSBpbiB0YXBlIHRlc3RzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkKGE6IFRlbnNvciwgYjogVGVuc29yKTogVGVuc29yIHtcbiAgLy8gV2UgZHVwbGljYXRlIEFkZCBoZXJlIHRvIGF2b2lkIGEgY2lyY3VsYXIgZGVwZW5kZW5jeSB3aXRoIGFkZC50cy5cbiAgY29uc3QgaW5wdXRzID0ge2EsIGJ9O1xuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChBZGQsIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCk7XG59XG4iXX0=