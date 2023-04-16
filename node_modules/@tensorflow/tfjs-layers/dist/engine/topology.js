/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
/* Original source: keras/engine/topology.py */
import { serialization, tidy, util } from '@tensorflow/tfjs-core';
import { getNextUniqueTensorId, getUid } from '../backend/state';
import { getScopedTensorName, getUniqueTensorName, nameScope } from '../common';
import { AttributeError, NotImplementedError, RuntimeError, ValueError } from '../errors';
import { getInitializer } from '../initializers';
import * as generic_utils from '../utils/generic_utils';
import * as types_utils from '../utils/types_utils';
import * as variable_utils from '../utils/variable_utils';
import { batchGetValue, batchSetValue, LayerVariable } from '../variables';
/**
 * Specifies the ndim, dtype and shape of every input to a layer.
 *
 * Every layer should expose (if appropriate) an `inputSpec` attribute:
 * a list of instances of InputSpec (one per input tensor).
 *
 * A null entry in a shape is compatible with any dimension,
 * a null shape is compatible with any shape.
 */
export class InputSpec {
    constructor(args) {
        this.dtype = args.dtype;
        this.shape = args.shape;
        /*
          TODO(michaelterry): Could throw error if ndim and shape are both defined
            (then backport).
        */
        if (args.shape != null) {
            this.ndim = args.shape.length;
        }
        else {
            this.ndim = args.ndim;
        }
        this.maxNDim = args.maxNDim;
        this.minNDim = args.minNDim;
        this.axes = args.axes || {};
    }
}
/**
 * `tf.SymbolicTensor` is a placeholder for a Tensor without any concrete value.
 *
 * They are most often encountered when building a graph of `Layer`s for a
 * `tf.LayersModel` and the input data's shape, but not values are known.
 *
 * @doc {heading: 'Models', 'subheading': 'Classes'}
 */
export class SymbolicTensor {
    /**
     *
     * @param dtype
     * @param shape
     * @param sourceLayer The Layer that produced this symbolic tensor.
     * @param inputs The inputs passed to sourceLayer's __call__() method.
     * @param nodeIndex
     * @param tensorIndex
     * @param callArgs The keyword arguments passed to the __call__() method.
     * @param name
     * @param outputTensorIndex The index of this tensor in the list of outputs
     *   returned by apply().
     */
    constructor(dtype, shape, sourceLayer, inputs, callArgs, name, outputTensorIndex) {
        this.dtype = dtype;
        this.shape = shape;
        this.sourceLayer = sourceLayer;
        this.inputs = inputs;
        this.callArgs = callArgs;
        this.outputTensorIndex = outputTensorIndex;
        this.id = getNextUniqueTensorId();
        if (name != null) {
            this.originalName = getScopedTensorName(name);
            this.name = getUniqueTensorName(this.originalName);
        }
        this.rank = shape.length;
    }
}
let _nextNodeID = 0;
/**
 * A `Node` describes the connectivity between two layers.
 *
 * Each time a layer is connected to some new input,
 * a node is added to `layer.inboundNodes`.
 *
 * Each time the output of a layer is used by another layer,
 * a node is added to `layer.outboundNodes`.
 *
 * `nodeIndices` and `tensorIndices` are basically fine-grained coordinates
 * describing the origin of the `inputTensors`, verifying the following:
 *
 * `inputTensors[i] ==
 * inboundLayers[i].inboundNodes[nodeIndices[i]].outputTensors[
 *   tensorIndices[i]]`
 *
 * A node from layer A to layer B is added to:
 *     A.outboundNodes
 *     B.inboundNodes
 */
export class Node {
    constructor(args, 
    // TODO(michaelterry): Define actual type for this.
    callArgs) {
        this.callArgs = callArgs;
        this.id = _nextNodeID++;
        /*
          Layer instance (NOT a list).
          this is the layer that takes a list of input tensors
          and turns them into a list of output tensors.
          the current node will be added to
          the inboundNodes of outboundLayer.
        */
        this.outboundLayer = args.outboundLayer;
        /*
            The following 3 properties describe where
            the input tensors come from: which layers,
            and for each layer, which node and which
            tensor output of each node.
        */
        // List of layer instances.
        this.inboundLayers = args.inboundLayers;
        // List of integers, 1:1 mapping with inboundLayers.
        this.nodeIndices = args.nodeIndices;
        // List of integers, 1:1 mapping with inboundLayers.
        this.tensorIndices = args.tensorIndices;
        /*
            Following 2 properties:
            tensor inputs and outputs of outboundLayer.
        */
        // List of tensors. 1:1 mapping with inboundLayers.
        this.inputTensors = args.inputTensors;
        // List of tensors, created by outboundLayer.call().
        this.outputTensors = args.outputTensors;
        /*
            Following 2 properties: input and output masks.
            List of tensors, 1:1 mapping with inputTensor.
        */
        this.inputMasks = args.inputMasks;
        // List of tensors, created by outboundLayer.computeMask().
        this.outputMasks = args.outputMasks;
        // Following 2 properties: input and output shapes.
        // List of shape tuples, shapes of inputTensors.
        this.inputShapes = args.inputShapes;
        // List of shape tuples, shapes of outputTensors.
        this.outputShapes = args.outputShapes;
        // Add nodes to all layers involved.
        for (const layer of args.inboundLayers) {
            if (layer != null) {
                layer.outboundNodes.push(this);
            }
        }
        args.outboundLayer.inboundNodes.push(this);
    }
    getConfig() {
        const inboundNames = [];
        for (const layer of this.inboundLayers) {
            if (layer != null) {
                inboundNames.push(layer.name);
            }
            else {
                inboundNames.push(null);
            }
        }
        return {
            outboundLayer: this.outboundLayer ? this.outboundLayer.name : null,
            inboundLayers: inboundNames,
            nodeIndices: this.nodeIndices,
            tensorIndices: this.tensorIndices
        };
    }
}
let _nextLayerID = 0;
/**
 * A layer is a grouping of operations and weights that can be composed to
 * create a `tf.LayersModel`.
 *
 * Layers are constructed by using the functions under the
 * [tf.layers](#Layers-Basic) namespace.
 *
 * @doc {heading: 'Layers', subheading: 'Classes', namespace: 'layers'}
 */
export class Layer extends serialization.Serializable {
    constructor(args = {}) {
        super();
        this._callHook = null;
        this._addedWeightNames = [];
        // Porting Notes: PyKeras does not have this property in this base Layer
        //   class. Instead lets Layer subclass set it dynamically and checks the
        //   value with `hasattr`. In tfjs-layers, we let this be a member of this
        //   base class.
        this._stateful = false;
        this.id = _nextLayerID++;
        this.activityRegularizer = null;
        this.inputSpec = null;
        this.supportsMasking = false;
        // These properties will be set upon call of this.build()
        this._trainableWeights = [];
        this._nonTrainableWeights = [];
        this._losses = [];
        this._updates = [];
        this._built = false;
        /*
          These lists will be filled via successive calls
          to this.addInboundNode().
         */
        this.inboundNodes = [];
        this.outboundNodes = [];
        let name = args.name;
        if (!name) {
            const prefix = this.getClassName();
            name = generic_utils.toSnakeCase(prefix) + '_' + getUid(prefix);
        }
        this.name = name;
        this.trainable_ = args.trainable == null ? true : args.trainable;
        if (args.inputShape != null || args.batchInputShape != null) {
            /*
              In this case we will later create an input layer
              to insert before the current layer
             */
            let batchInputShape;
            if (args.batchInputShape != null) {
                batchInputShape = args.batchInputShape;
            }
            else if (args.inputShape != null) {
                let batchSize = null;
                if (args.batchSize != null) {
                    batchSize = args.batchSize;
                }
                batchInputShape = [batchSize].concat(args.inputShape);
            }
            this.batchInputShape = batchInputShape;
            // Set dtype.
            let dtype = args.dtype;
            if (dtype == null) {
                dtype = args.inputDType;
            }
            if (dtype == null) {
                dtype = 'float32';
            }
            this.dtype = dtype;
        }
        if (args.weights != null) {
            this.initialWeights = args.weights;
        }
        else {
            this.initialWeights = null;
        }
        // The value of `_refCount` is initialized to null. When the layer is used
        // in a symbolic way for the first time, it will be set to 1.
        this._refCount = null;
        this.fastWeightInitDuringBuild = false;
    }
    /**
     * Converts a layer and its index to a unique (immutable type) name.
     * This function is used internally with `this.containerNodes`.
     * @param layer The layer.
     * @param nodeIndex The layer's position (e.g. via enumerate) in a list of
     *   nodes.
     *
     * @returns The unique name.
     */
    static nodeKey(layer, nodeIndex) {
        return layer.name + '_ib-' + nodeIndex.toString();
    }
    /**
     * Returns this.inboundNode at index nodeIndex.
     *
     * Porting note: This is a replacement for _get_node_attribute_at_index()
     * @param nodeIndex
     * @param attrName The name of the attribute related to request for this node.
     */
    getNodeAtIndex(nodeIndex, attrName) {
        if (this.inboundNodes.length === 0) {
            throw new RuntimeError('The layer has never been called ' +
                `and thus has no defined ${attrName}.`);
        }
        if (this.inboundNodes.length <= nodeIndex) {
            throw new ValueError(`Asked to get ${attrName} at node ${nodeIndex}, ` +
                `but the layer has only ${this.inboundNodes.length} inbound nodes.`);
        }
        return this.inboundNodes[nodeIndex];
    }
    /**
     * Retrieves the input tensor(s) of a layer at a given node.
     *
     * @param nodeIndex Integer, index of the node from which to retrieve the
     *   attribute. E.g. `nodeIndex=0` will correspond to the first time the layer
     *   was called.
     *
     * @return A tensor (or list of tensors if the layer has multiple inputs).
     */
    getInputAt(nodeIndex) {
        return generic_utils.singletonOrArray(this.getNodeAtIndex(nodeIndex, 'input').inputTensors);
    }
    /**
     * Retrieves the output tensor(s) of a layer at a given node.
     *
     * @param nodeIndex Integer, index of the node from which to retrieve the
     *   attribute. E.g. `nodeIndex=0` will correspond to the first time the layer
     *   was called.
     *
     * @return A tensor (or list of tensors if the layer has multiple outputs).
     */
    getOutputAt(nodeIndex) {
        return generic_utils.singletonOrArray(this.getNodeAtIndex(nodeIndex, 'output').outputTensors);
    }
    // Properties
    /**
     * Retrieves the input tensor(s) of a layer.
     *
     * Only applicable if the layer has exactly one inbound node,
     * i.e. if it is connected to one incoming layer.
     *
     * @return Input tensor or list of input tensors.
     *
     * @exception AttributeError if the layer is connected to more than one
     *   incoming layers.
     */
    get input() {
        if (this.inboundNodes.length > 1) {
            throw new AttributeError(`Layer ${this.name}` +
                ' has multiple inbound nodes, ' +
                'hence the notion of "layer input" ' +
                'is ill-defined. ' +
                'Use `getInputAt(nodeIndex)` instead.');
        }
        else if (this.inboundNodes.length === 0) {
            throw new AttributeError(`Layer ${this.name}` +
                ' is not connected, no input to return.');
        }
        return generic_utils.singletonOrArray(this.getNodeAtIndex(0, 'input').inputTensors);
    }
    /**
     * Retrieves the output tensor(s) of a layer.
     *
     * Only applicable if the layer has exactly one inbound node,
     * i.e. if it is connected to one incoming layer.
     *
     * @return Output tensor or list of output tensors.
     *
     * @exception AttributeError if the layer is connected to more than one
     *   incoming layers.
     */
    get output() {
        if (this.inboundNodes.length === 0) {
            throw new AttributeError(`Layer ${this.name}` +
                ' has no inbound nodes.');
        }
        if (this.inboundNodes.length > 1) {
            throw new AttributeError(`Layer ${this.name}` +
                ' has multiple inbound nodes, ' +
                'hence the notion of "layer output" ' +
                'is ill-defined. ' +
                'Use `getOutputAt(nodeIndex)` instead.');
        }
        return generic_utils.singletonOrArray(this.getNodeAtIndex(0, 'output').outputTensors);
    }
    get losses() {
        return this._losses;
    }
    /**
     * Retrieves the Layer's current loss values.
     *
     * Used for regularizers during training.
     */
    calculateLosses() {
        // Porting Node: This is an augmentation to Layer.loss in PyKeras.
        //   In PyKeras, Layer.loss returns symbolic tensors. Here a concrete
        //   Tensor (specifically Scalar) values are returned. This is due to the
        //   imperative backend.
        return this.losses.map(lossFn => lossFn());
    }
    get updates() {
        return this._updates;
    }
    get built() {
        return this._built;
    }
    set built(built) {
        this._built = built;
    }
    get trainable() {
        return this.trainable_;
    }
    set trainable(trainable) {
        this._trainableWeights.forEach(w => w.trainable = trainable);
        this.trainable_ = trainable;
    }
    get trainableWeights() {
        if (this.trainable_) {
            return this._trainableWeights.filter(w => w.trainable);
        }
        else {
            return [];
        }
    }
    set trainableWeights(weights) {
        this._trainableWeights = weights;
    }
    get nonTrainableWeights() {
        if (this.trainable) {
            return this._trainableWeights.filter(w => !w.trainable)
                .concat(this._nonTrainableWeights);
        }
        else {
            return this._trainableWeights.concat(this._nonTrainableWeights);
        }
    }
    set nonTrainableWeights(weights) {
        this._nonTrainableWeights = weights;
    }
    /**
     * The concatenation of the lists trainableWeights and nonTrainableWeights
     * (in this order).
     */
    get weights() {
        return this.trainableWeights.concat(this.nonTrainableWeights);
    }
    get stateful() {
        return this._stateful;
    }
    /**
     * Reset the states of the layer.
     *
     * This method of the base Layer class is essentially a no-op.
     * Subclasses that are stateful (e.g., stateful RNNs) should override this
     * method.
     */
    resetStates() {
        if (!this.stateful) {
            throw new Error('Cannot call the resetStates() method of a non-stateful Layer ' +
                'object.');
        }
    }
    /**
     * Checks compatibility between the layer and provided inputs.
     *
     * This checks that the tensor(s) `input`
     * verify the input assumptions of the layer
     * (if any). If not, exceptions are raised.
     *
     * @param inputs Input tensor or list of input tensors.
     *
     * @exception ValueError in case of mismatch between
     *   the provided inputs and the expectations of the layer.
     */
    assertInputCompatibility(inputs) {
        inputs = generic_utils.toList(inputs);
        if (this.inputSpec == null || this.inputSpec.length === 0) {
            return;
        }
        const inputSpec = generic_utils.toList(this.inputSpec);
        if (inputs.length !== inputSpec.length) {
            throw new ValueError(`Layer ${this.name} expects ${inputSpec.length} inputs, ` +
                `but it received ${inputs.length} input tensors. ` +
                `Input received: ${inputs}`);
        }
        for (let inputIndex = 0; inputIndex < inputs.length; inputIndex++) {
            const x = inputs[inputIndex];
            const spec = inputSpec[inputIndex];
            if (spec == null) {
                continue;
            }
            // Check ndim.
            const ndim = x.rank;
            if (spec.ndim != null) {
                if (ndim !== spec.ndim) {
                    throw new ValueError(`Input ${inputIndex} is incompatible with layer ${this.name}: ` +
                        `expected ndim=${spec.ndim}, found ndim=${ndim}`);
                }
            }
            if (spec.maxNDim != null) {
                if (ndim > spec.maxNDim) {
                    throw new ValueError(`Input ${inputIndex} is incompatible with layer ${this.name}` +
                        `: expected max_ndim=${spec.maxNDim}, found ndim=${ndim}`);
                }
            }
            if (spec.minNDim != null) {
                if (ndim < spec.minNDim) {
                    throw new ValueError(`Input ${inputIndex} is incompatible with layer ${this.name}` +
                        `: expected min_ndim=${spec.minNDim}, found ndim=${ndim}.`);
                }
            }
            // Check dtype.
            if (spec.dtype != null) {
                if (x.dtype !== spec.dtype) {
                    throw new ValueError(`Input ${inputIndex} is incompatible with layer ${this.name} ` +
                        `: expected dtype=${spec.dtype}, found dtype=${x.dtype}.`);
                }
            }
            // Check specific shape axes.
            if (spec.axes) {
                const xShape = x.shape;
                for (const key in spec.axes) {
                    const axis = Number(key);
                    const value = spec.axes[key];
                    // Perform Python-style slicing in case axis < 0;
                    // TODO(cais): Use https://github.com/alvivi/typescript-underscore to
                    // ensure type safety through Underscore calls.
                    const xShapeAtAxis = axis >= 0 ? xShape[axis] : xShape[xShape.length + axis];
                    if (value != null && [value, null].indexOf(xShapeAtAxis) === -1) {
                        throw new ValueError(`Input ${inputIndex} is incompatible with layer ` +
                            `${this.name}: expected axis ${axis} of input shape to ` +
                            `have value ${value} but got shape ${xShape}.`);
                    }
                }
            }
            // Check shape.
            if (spec.shape != null) {
                for (let i = 0; i < spec.shape.length; ++i) {
                    const specDim = spec.shape[i];
                    const dim = x.shape[i];
                    if (specDim != null && dim != null) {
                        if (specDim !== dim) {
                            throw new ValueError(`Input ${inputIndex} is incompatible with layer ` +
                                `${this.name}: expected shape=${spec.shape}, ` +
                                `found shape=${x.shape}.`);
                        }
                    }
                }
            }
        }
    }
    /**
     * This is where the layer's logic lives.
     *
     * @param inputs Input tensor, or list/tuple of input tensors.
     * @param kwargs Additional keyword arguments.
     *
     * @return A tensor or list/tuple of tensors.
     */
    call(inputs, kwargs) {
        return inputs;
    }
    invokeCallHook(inputs, kwargs) {
        if (this._callHook != null) {
            this._callHook(inputs, kwargs);
        }
    }
    /**
     * Set call hook.
     * This is currently used for testing only.
     * @param callHook
     */
    setCallHook(callHook) {
        this._callHook = callHook;
    }
    /**
     * Clear call hook.
     * This is currently used for testing only.
     */
    clearCallHook() {
        this._callHook = null;
    }
    /**
     * Builds or executes a `Layer`'s logic.
     *
     * When called with `tf.Tensor`(s), execute the `Layer`'s computation and
     * return Tensor(s). For example:
     *
     * ```js
     * const denseLayer = tf.layers.dense({
     *   units: 1,
     *   kernelInitializer: 'zeros',
     *   useBias: false
     * });
     *
     * // Invoke the layer's apply() method with a `tf.Tensor` (with concrete
     * // numeric values).
     * const input = tf.ones([2, 2]);
     * const output = denseLayer.apply(input);
     *
     * // The output's value is expected to be [[0], [0]], due to the fact that
     * // the dense layer has a kernel initialized to all-zeros and does not have
     * // a bias.
     * output.print();
     * ```
     *
     * When called with `tf.SymbolicTensor`(s), this will prepare the layer for
     * future execution.  This entails internal book-keeping on shapes of
     * expected Tensors, wiring layers together, and initializing weights.
     *
     * Calling `apply` with `tf.SymbolicTensor`s are typically used during the
     * building of non-`tf.Sequential` models. For example:
     *
     * ```js
     * const flattenLayer = tf.layers.flatten();
     * const denseLayer = tf.layers.dense({units: 1});
     *
     * // Use tf.layers.input() to obtain a SymbolicTensor as input to apply().
     * const input = tf.input({shape: [2, 2]});
     * const output1 = flattenLayer.apply(input);
     *
     * // output1.shape is [null, 4]. The first dimension is the undetermined
     * // batch size. The second dimension comes from flattening the [2, 2]
     * // shape.
     * console.log(JSON.stringify(output1.shape));
     *
     * // The output SymbolicTensor of the flatten layer can be used to call
     * // the apply() of the dense layer:
     * const output2 = denseLayer.apply(output1);
     *
     * // output2.shape is [null, 1]. The first dimension is the undetermined
     * // batch size. The second dimension matches the number of units of the
     * // dense layer.
     * console.log(JSON.stringify(output2.shape));
     *
     * // The input and output can be used to construct a model that consists
     * // of the flatten and dense layers.
     * const model = tf.model({inputs: input, outputs: output2});
     * ```
     *
     * @param inputs a `tf.Tensor` or `tf.SymbolicTensor` or an Array of them.
     * @param kwargs Additional keyword arguments to be passed to `call()`.
     *
     * @return Output of the layer's `call` method.
     *
     * @exception ValueError error in case the layer is missing shape information
     *   for its `build` call.
     *
     * @doc {heading: 'Models', 'subheading': 'Classes'}
     */
    // Porting Note: This is a replacement for __call__() in Python.
    apply(inputs, kwargs) {
        kwargs = kwargs || {};
        this.assertNotDisposed();
        // Ensure inputs are all the same type.
        const inputsList = generic_utils.toList(inputs);
        let allAreSymbolic = true;
        for (const input of inputsList) {
            if (!(input instanceof SymbolicTensor)) {
                allAreSymbolic = false;
                break;
            }
        }
        let noneAreSymbolic = true;
        for (const input of inputsList) {
            if (input instanceof SymbolicTensor) {
                noneAreSymbolic = false;
                break;
            }
        }
        if (allAreSymbolic === noneAreSymbolic) {
            throw new ValueError('Arguments to apply() must be all ' +
                'SymbolicTensors or all Tensors');
        }
        // TODO(michaelterry): nameScope() may not be necessary.
        return nameScope(this.name, () => {
            // Handle laying building (weight creating, input spec locking).
            if (!this.built) {
                /*
                  Throw exceptions in case the input is not compatible
                  with the inputSpec specified in the layer constructor.
                 */
                this.assertInputCompatibility(inputs);
                // Collect input shapes to build layer.
                const inputShapes = [];
                for (const xElem of generic_utils.toList(inputs)) {
                    inputShapes.push(xElem.shape);
                }
                this.build(generic_utils.singletonOrArray(inputShapes));
                this.built = true;
                // Load weights that were specified at layer instantiation.
                if (this.initialWeights) {
                    this.setWeights(this.initialWeights);
                }
                if (this._refCount === null && noneAreSymbolic) {
                    // The first use of this layer is a non-symbolic call, set ref count
                    // to 1 so the Layer can be properly disposed if its dispose() method
                    // is called.
                    this._refCount = 1;
                }
            }
            /*
              Throw exceptions in case the input is not compatible
              with the inputSpec set at build time.
            */
            this.assertInputCompatibility(inputs);
            // Handle mask propagation.
            // TODO(michaelterry): Mask propagation not currently implemented.
            // Actually call the layer, collecting output(s), mask(s), and shape(s).
            if (noneAreSymbolic) {
                let output = this.call(inputs, kwargs);
                // TODO(michaelterry): Compute the outputMask
                // If the layer returns tensors from its inputs, unmodified,
                // we copy them to avoid loss of tensor metadata.
                const outputList = generic_utils.toList(output);
                const outputListCopy = [];
                // TODO(michaelterry): This copying may not be necessary given our eager
                // backend.
                for (let x of outputList) {
                    if (inputsList.indexOf(x) !== -1) {
                        x = x.clone();
                    }
                    outputListCopy.push(x);
                }
                output = generic_utils.singletonOrArray(outputListCopy);
                if (this.activityRegularizer != null) {
                    throw new NotImplementedError('Layer invocation in the presence of activity ' +
                        'regularizer(s) is not supported yet.');
                }
                // TODO(michaelterry): Call addInboundNode()?
                return output;
            }
            else {
                const inputShape = collectInputShape(inputs);
                const outputShape = this.computeOutputShape(inputShape);
                let output;
                const outputDType = guessOutputDType(inputs);
                this.warnOnIncompatibleInputShape(Array.isArray(inputs) ? inputShape[0] :
                    inputShape);
                if (outputShape != null && outputShape.length > 0 &&
                    Array.isArray(outputShape[0])) {
                    // We have multiple output shapes. Create multiple output tensors.
                    output = outputShape
                        .map((shape, index) => new SymbolicTensor(outputDType, shape, this, generic_utils.toList(inputs), kwargs, this.name, index));
                }
                else {
                    output = new SymbolicTensor(outputDType, outputShape, this, generic_utils.toList(inputs), kwargs, this.name);
                }
                /*
                  Add an inbound node to the layer, so that it keeps track
                  of the call and of all new variables created during the call.
                  This also updates the layer history of the output tensor(s).
                  If the input tensor(s) had no previous history,
                  this does nothing.
                */
                this.addInboundNode(inputs, output, null, null, inputShape, outputShape, kwargs);
                this._refCount++;
                if (this.activityRegularizer != null) {
                    throw new NotImplementedError('Layer invocation in the presence of activity ' +
                        'regularizer(s) is not supported yet.');
                }
                return output;
            }
        });
    }
    /**
     * Check compatibility between input shape and this layer's batchInputShape.
     *
     * Print warning if any incompatibility is found.
     *
     * @param inputShape Input shape to be checked.
     */
    warnOnIncompatibleInputShape(inputShape) {
        if (this.batchInputShape == null) {
            return;
        }
        else if (inputShape.length !== this.batchInputShape.length) {
            console.warn(`The rank of the input tensor provided (shape: ` +
                `${JSON.stringify(inputShape)}) does not match that of the ` +
                `batchInputShape (${JSON.stringify(this.batchInputShape)}) ` +
                `of the layer ${this.name}`);
        }
        else {
            let dimMismatch = false;
            this.batchInputShape.forEach((dimension, i) => {
                if (dimension != null && inputShape[i] != null &&
                    inputShape[i] !== dimension) {
                    dimMismatch = true;
                }
            });
            if (dimMismatch) {
                console.warn(`The shape of the input tensor ` +
                    `(${JSON.stringify(inputShape)}) does not ` +
                    `match the expectation of layer ${this.name}: ` +
                    `${JSON.stringify(this.batchInputShape)}`);
            }
        }
    }
    /**
     * Retrieves the output shape(s) of a layer.
     *
     * Only applicable if the layer has only one inbound node, or if all inbound
     * nodes have the same output shape.
     *
     * @returns Output shape or shapes.
     * @throws AttributeError: if the layer is connected to more than one incoming
     *   nodes.
     *
     * @doc {heading: 'Models', 'subheading': 'Classes'}
     */
    get outputShape() {
        if (this.inboundNodes == null || this.inboundNodes.length === 0) {
            throw new AttributeError(`The layer ${this.name} has never been called and thus has no ` +
                `defined output shape.`);
        }
        const allOutputShapes = [];
        for (const node of this.inboundNodes) {
            const shapeString = JSON.stringify(node.outputShapes);
            if (allOutputShapes.indexOf(shapeString) === -1) {
                allOutputShapes.push(shapeString);
            }
        }
        if (allOutputShapes.length === 1) {
            const outputShapes = this.inboundNodes[0].outputShapes;
            if (Array.isArray(outputShapes) && Array.isArray(outputShapes[0]) &&
                outputShapes.length === 1) {
                return outputShapes[0];
            }
            else {
                return outputShapes;
            }
        }
        else {
            throw new AttributeError(`The layer ${this.name} has multiple inbound nodes with different ` +
                `output shapes. Hence the notion of "output shape" is ill-defined ` +
                `for the layer.`);
            // TODO(cais): Implement getOutputShapeAt().
        }
    }
    /**
     * Counts the total number of numbers (e.g., float32, int32) in the
     * weights.
     *
     * @returns An integer count.
     * @throws RuntimeError: If the layer is not built yet (in which case its
     *   weights are not defined yet.)
     *
     * @doc {heading: 'Models', 'subheading': 'Classes'}
     */
    countParams() {
        if (!this.built) {
            throw new RuntimeError(`You tried to call countParams() on ${this.name}, ` +
                `but the layer is not built yet. Build it first by calling ` +
                `build(batchInputShape).`);
        }
        return variable_utils.countParamsInWeights(this.weights);
    }
    /**
     * Creates the layer weights.
     *
     * Must be implemented on all layers that have weights.
     *
     * Called when apply() is called to construct the weights.
     *
     * @param inputShape A `Shape` or array of `Shape` (unused).
     *
     * @doc {heading: 'Models', 'subheading': 'Classes'}
     */
    build(inputShape) {
        this.built = true;
    }
    /**
     * Returns the current values of the weights of the layer.
     *
     * @param trainableOnly Whether to get the values of only trainable weights.
     * @returns Weight values as an `Array` of `tf.Tensor`s.
     *
     * @doc {heading: 'Models', 'subheading': 'Classes'}
     */
    getWeights(trainableOnly = false) {
        return batchGetValue(trainableOnly ? this.trainableWeights : this.weights);
    }
    /**
     * Sets the weights of the layer, from Tensors.
     *
     * @param weights a list of Tensors. The number of arrays and their shape
     *   must match number of the dimensions of the weights of the layer (i.e.
     *   it should match the output of `getWeights`).
     *
     * @exception ValueError If the provided weights list does not match the
     *   layer's specifications.
     *
     * @doc {heading: 'Models', 'subheading': 'Classes'}
     */
    setWeights(weights) {
        tidy(() => {
            const params = this.weights;
            if (params.length !== weights.length) {
                // TODO(cais): Restore the following and use `providedWeights`, instead
                // of `weights` in the error message, once the deeplearn.js bug is
                // fixed: https://github.com/PAIR-code/deeplearnjs/issues/498 const
                // providedWeights = JSON.stringify(weights).slice(0, 50);
                throw new ValueError(`You called setWeights(weights) on layer "${this.name}" ` +
                    `with a weight list of length ${weights.length}, ` +
                    `but the layer was expecting ${params.length} weights. ` +
                    `Provided weights: ${weights}...`);
            }
            if (params.length === 0) {
                return;
            }
            const weightValueTuples = [];
            const paramValues = batchGetValue(params);
            for (let i = 0; i < paramValues.length; ++i) {
                const pv = paramValues[i];
                const p = params[i];
                const w = weights[i];
                if (!util.arraysEqual(pv.shape, w.shape)) {
                    throw new ValueError(`Layer weight shape ${pv.shape} ` +
                        `not compatible with provided weight shape ${w.shape}`);
                }
                weightValueTuples.push([p, w]);
            }
            batchSetValue(weightValueTuples);
        });
    }
    /**
     * Adds a weight variable to the layer.
     *
     * @param name Name of the new weight variable.
     * @param shape The shape of the weight.
     * @param dtype The dtype of the weight.
     * @param initializer An initializer instance.
     * @param regularizer A regularizer instance.
     * @param trainable Whether the weight should be trained via backprop or not
     *   (assuming that the layer itself is also trainable).
     * @param constraint An optional trainable.
     * @return The created weight variable.
     *
     * @doc {heading: 'Models', 'subheading': 'Classes'}
     */
    addWeight(name, shape, dtype, initializer, regularizer, trainable, constraint, getInitializerFunc) {
        // Reject duplicate weight names.
        if (this._addedWeightNames.indexOf(name) !== -1) {
            throw new ValueError(`Duplicate weight name ${name} for layer ${this.name}`);
        }
        this._addedWeightNames.push(name);
        if (dtype == null) {
            dtype = 'float32';
        }
        if (this.fastWeightInitDuringBuild) {
            initializer = getInitializerFunc != null ? getInitializerFunc() :
                getInitializer('zeros');
        }
        const initValue = initializer.apply(shape, dtype);
        const weight = new LayerVariable(initValue, dtype, name, trainable, constraint);
        initValue.dispose();
        // Request backend not to dispose the weights of the model on scope() exit.
        if (regularizer != null) {
            this.addLoss(() => regularizer.apply(weight.read()));
        }
        if (trainable == null) {
            trainable = true;
        }
        if (trainable) {
            this._trainableWeights.push(weight);
        }
        else {
            this._nonTrainableWeights.push(weight);
        }
        return weight;
    }
    /**
     * Set the fast-weight-initialization flag.
     *
     * In cases where the initialized weight values will be immediately
     * overwritten by loaded weight values during model loading, setting
     * the flag to `true` saves unnecessary calls to potentially expensive
     * initializers and speeds up the loading process.
     *
     * @param value Target value of the flag.
     */
    setFastWeightInitDuringBuild(value) {
        this.fastWeightInitDuringBuild = value;
    }
    /**
     * Add losses to the layer.
     *
     * The loss may potentially be conditional on some inputs tensors,
     * for instance activity losses are conditional on the layer's inputs.
     *
     * @doc {heading: 'Models', 'subheading': 'Classes'}
     */
    addLoss(losses) {
        if (losses == null || Array.isArray(losses) && losses.length === 0) {
            return;
        }
        // Update this.losses
        losses = generic_utils.toList(losses);
        if (this._losses !== undefined && this._losses !== null) {
            this.losses.push(...losses);
        }
    }
    /**
     * Computes the output shape of the layer.
     *
     * Assumes that the layer will be built to match that input shape provided.
     *
     * @param inputShape A shape (tuple of integers) or a list of shape tuples
     *   (one per output tensor of the layer). Shape tuples can include null for
     *   free dimensions, instead of an integer.
     *
     * @doc {heading: 'Models', 'subheading': 'Classes'}
     */
    computeOutputShape(inputShape) {
        return inputShape;
    }
    /**
     * Computes an output mask tensor.
     *
     * @param inputs Tensor or list of tensors.
     * @param mask Tensor or list of tensors.
     *
     * @return null or a tensor (or list of tensors, one per output tensor of the
     * layer).
     */
    computeMask(inputs, mask) {
        if (!this.supportsMasking) {
            if (mask != null) {
                if (Array.isArray(mask)) {
                    mask.forEach(maskElement => {
                        if (maskElement != null) {
                            throw new TypeError(`Layer ${this.name} does not support masking, ` +
                                'but was passed an inputMask.');
                        }
                    });
                }
                else {
                    throw new TypeError(`Layer ${this.name} does not support masking, ` +
                        'but was passed an inputMask.');
                }
            }
            // masking not explicitly supported: return null as mask
            return null;
        }
        // if masking is explictly supported, by default
        // carry over the input mask
        return mask;
    }
    /**
     * Internal method to create an inbound node for the layer.
     *
     * @param inputTensors List of input tensors.
     * @param outputTensors List of output tensors.
     * @param inputMasks List of input masks (a mask can be a tensor, or null).
     * @param outputMasks List of output masks (a mask can be a tensor, or null).
     * @param inputShapes List of input shape tuples.
     * @param outputShapes List of output shape tuples.
     * @param kwargs Dictionary of keyword arguments that were passed to the
     *   `call` method of the layer at the call that created the node.
     */
    addInboundNode(inputTensors, outputTensors, inputMasks, outputMasks, inputShapes, outputShapes, kwargs = null) {
        const inputTensorList = generic_utils.toList(inputTensors);
        outputTensors = generic_utils.toList(outputTensors);
        inputMasks = generic_utils.toList(inputMasks);
        outputMasks = generic_utils.toList(outputMasks);
        inputShapes = types_utils.normalizeShapeList(inputShapes);
        outputShapes = types_utils.normalizeShapeList(outputShapes);
        // Collect input tensor(s) coordinates.
        const inboundLayers = [];
        const nodeIndices = [];
        const tensorIndices = [];
        for (const x of inputTensorList) {
            /*
             * TODO(michaelterry): Keras adds this value to tensors; it's not
             * clear whether we'll use this or not.
             */
            inboundLayers.push(x.sourceLayer);
            nodeIndices.push(x.nodeIndex);
            tensorIndices.push(x.tensorIndex);
        }
        // Create node, add it to inbound nodes.
        // (This call has side effects.)
        // tslint:disable-next-line:no-unused-expression
        new Node({
            outboundLayer: this,
            inboundLayers,
            nodeIndices,
            tensorIndices,
            inputTensors: inputTensorList,
            outputTensors,
            inputMasks,
            outputMasks,
            inputShapes,
            outputShapes
        }, kwargs);
        // Update tensor history
        for (let i = 0; i < outputTensors.length; i++) {
            // TODO(michaelterry: _uses_learning_phase not tracked.
            outputTensors[i].sourceLayer = this;
            outputTensors[i].nodeIndex = this.inboundNodes.length - 1;
            outputTensors[i].tensorIndex = i;
        }
    }
    /**
     * Returns the config of the layer.
     *
     * A layer config is a TS dictionary (serializable)
     * containing the configuration of a layer.
     * The same layer can be reinstantiated later
     * (without its trained weights) from this configuration.
     *
     * The config of a layer does not include connectivity
     * information, nor the layer class name.  These are handled
     * by 'Container' (one layer of abstraction above).
     *
     * Porting Note: The TS dictionary follows TS naming standards for
     * keys, and uses tfjs-layers type-safe Enums.  Serialization methods
     * should use a helper function to convert to the pythonic storage
     * standard. (see serialization_utils.convertTsToPythonic)
     *
     * @returns TS dictionary of configuration.
     *
     * @doc {heading: 'Models', 'subheading': 'Classes'}
     */
    getConfig() {
        const config = { name: this.name, trainable: this.trainable };
        if (this.batchInputShape != null) {
            config['batchInputShape'] = this.batchInputShape;
        }
        if (this.dtype != null) {
            config['dtype'] = this.dtype;
        }
        return config;
    }
    /**
     * Dispose the weight variables that this Layer instance holds.
     *
     * @returns {number} Number of disposed variables.
     */
    disposeWeights() {
        this.weights.forEach(weight => weight.dispose());
        return this.weights.length;
    }
    assertNotDisposed() {
        if (this._refCount === 0) {
            throw new Error(`Layer '${this.name}' is already disposed.`);
        }
    }
    /**
     * Attempt to dispose layer's weights.
     *
     * This method decreases the reference count of the Layer object by 1.
     *
     * A Layer is reference-counted. Its reference count is incremented by 1
     * the first item its `apply()` method is called and when it becomes a part
     * of a new `Node` (through calling the `apply()` method on a
     * `tf.SymbolicTensor`).
     *
     * If the reference count of a Layer becomes 0, all the weights will be
     * disposed and the underlying memory (e.g., the textures allocated in WebGL)
     * will be freed.
     *
     * Note: If the reference count is greater than 0 after the decrement, the
     * weights of the Layer will *not* be disposed.
     *
     * After a Layer is disposed, it cannot be used in calls such as `apply()`,
     * `getWeights()` or `setWeights()` anymore.
     *
     * @returns A DisposeResult Object with the following fields:
     *   - refCountAfterDispose: The reference count of the Container after this
     *     `dispose()` call.
     *   - numDisposedVariables: Number of `tf.Variable`s (i.e., weights) disposed
     *     during this `dispose()` call.
     * @throws {Error} If the layer is not built yet, or if the layer has already
     *   been disposed.
     *
     * @doc {heading: 'Models', 'subheading': 'Classes'}
     */
    dispose() {
        if (!this.built) {
            throw new Error(`Cannot dispose Layer ${this.name} because it has not been ` +
                `built yet.`);
        }
        if (this._refCount === null) {
            throw new Error(`Cannot dispose Layer ${this.name} because it has not been used ` +
                `yet.`);
        }
        this.assertNotDisposed();
        let numDisposedVariables = 0;
        if (--this._refCount === 0) {
            numDisposedVariables = this.disposeWeights();
        }
        return { refCountAfterDispose: this._refCount, numDisposedVariables };
    }
}
/**
 * Collects the input shape(s) of a list of `tf.Tensor`s or
 * `tf.SymbolicTensor`s.
 *
 * TODO(michaelterry): Update PyKeras docs (backport).
 *
 * @param inputTensors List of input tensors (or single input tensor).
 *
 * @return List of shape tuples (or single tuple), one tuple per input.
 */
function collectInputShape(inputTensors) {
    inputTensors =
        generic_utils.toList(inputTensors);
    const shapes = [];
    for (const x of inputTensors) {
        shapes.push(x.shape);
    }
    return generic_utils.singletonOrArray(shapes);
}
/**
 * Guesses output dtype based on inputs.
 *
 * At present, just returns 'float32' for any input.
 *
 * @param inputTensors List of input tensors (or single input tensor).
 *
 * @return The guessed DType. At present, always returns 'float32'.
 */
function guessOutputDType(inputTensors) {
    return 'float32';
}
/**
 * Returns the list of input tensors necessary to compute `tensor`.
 *
 * Output will always be a list of tensors (potentially with 1 element).
 *
 * @param tensor The tensor to start from.
 * @param layer Origin layer of the tensor.
 * @param nodeIndex Origin node index of the tensor.
 *
 * @return Array of input tensors.
 */
export function getSourceInputs(tensor, layer, nodeIndex) {
    if (layer == null || (nodeIndex != null && nodeIndex > 0)) {
        layer = tensor.sourceLayer;
        nodeIndex = tensor.nodeIndex;
    }
    if (layer.inboundNodes.length === 0) {
        return [tensor];
    }
    else {
        const node = layer.inboundNodes[nodeIndex];
        if (node.inboundLayers.length === 0) {
            return node.inputTensors;
        }
        else {
            const sourceTensors = [];
            for (let i = 0; i < node.inboundLayers.length; i++) {
                const x = node.inputTensors[i];
                const layer = node.inboundLayers[i];
                const nodeIndex = node.nodeIndices[i];
                const previousSources = getSourceInputs(x, layer, nodeIndex);
                // Avoid input redundancy.
                for (const x of previousSources) {
                    if (sourceTensors.indexOf(x) === -1) {
                        sourceTensors.push(x);
                    }
                }
            }
            return sourceTensors;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9wb2xvZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWxheWVycy9zcmMvZW5naW5lL3RvcG9sb2d5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztHQVFHO0FBRUgsK0NBQStDO0FBRS9DLE9BQU8sRUFBbUIsYUFBYSxFQUFVLElBQUksRUFBRSxJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUUxRixPQUFPLEVBQUMscUJBQXFCLEVBQUUsTUFBTSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDL0QsT0FBTyxFQUFDLG1CQUFtQixFQUFFLG1CQUFtQixFQUFFLFNBQVMsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUU5RSxPQUFPLEVBQUMsY0FBYyxFQUFFLG1CQUFtQixFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDeEYsT0FBTyxFQUFDLGNBQWMsRUFBYyxNQUFNLGlCQUFpQixDQUFDO0FBSTVELE9BQU8sS0FBSyxhQUFhLE1BQU0sd0JBQXdCLENBQUM7QUFDeEQsT0FBTyxLQUFLLFdBQVcsTUFBTSxzQkFBc0IsQ0FBQztBQUNwRCxPQUFPLEtBQUssY0FBYyxNQUFNLHlCQUF5QixDQUFDO0FBQzFELE9BQU8sRUFBQyxhQUFhLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQXVCekU7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLE9BQU8sU0FBUztJQWNwQixZQUFZLElBQW1CO1FBQzdCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDeEI7OztVQUdFO1FBQ0YsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRTtZQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFD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LEVBQUU7WUFDbkMsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO1NBQzFCO2FBQU07WUFDTCxNQUFNLGFBQWEsR0FBcUIsRUFBRSxDQUFDO1lBQzNDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDbEQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsTUFBTSxlQUFlLEdBQUcsZUFBZSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQzdELDBCQUEwQjtnQkFDMUIsS0FBSyxNQUFNLENBQUMsSUFBSSxlQUFlLEVBQUU7b0JBQy9CLElBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTt3QkFDbkMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDdkI7aUJBQ0Y7YUFDRjtZQUNELE9BQU8sYUFBYSxDQUFDO1NBQ3RCO0tBQ0Y7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICogbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gKiBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuLyogT3JpZ2luYWwgc291cmNlOiBrZXJhcy9lbmdpbmUvdG9wb2xvZ3kucHkgKi9cblxuaW1wb3J0IHtEYXRhVHlwZSwgU2NhbGFyLCBzZXJpYWxpemF0aW9uLCBUZW5zb3IsIHRpZHksIHV0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7Z2V0TmV4dFVuaXF1ZVRlbnNvcklkLCBnZXRVaWR9IGZyb20gJy4uL2JhY2tlbmQvc3RhdGUnO1xuaW1wb3J0IHtnZXRTY29wZWRUZW5zb3JOYW1lLCBnZXRVbmlxdWVUZW5zb3JOYW1lLCBuYW1lU2NvcGV9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge0NvbnN0cmFpbnR9IGZyb20gJy4uL2NvbnN0cmFpbnRzJztcbmltcG9ydCB7QXR0cmlidXRlRXJyb3IsIE5vdEltcGxlbWVudGVkRXJyb3IsIFJ1bnRpbWVFcnJvciwgVmFsdWVFcnJvcn0gZnJvbSAnLi4vZXJyb3JzJztcbmltcG9ydCB7Z2V0SW5pdGlhbGl6ZXIsIEluaXRpYWxpemVyfSBmcm9tICcuLi9pbml0aWFsaXplcnMnO1xuaW1wb3J0IHtTaGFwZX0gZnJvbSAnLi4va2VyYXNfZm9ybWF0L2NvbW1vbic7XG5pbXBvcnQge1JlZ3VsYXJpemVyfSBmcm9tICcuLi9yZWd1bGFyaXplcnMnO1xuaW1wb3J0IHtLd2FyZ3MsIFJlZ3VsYXJpemVyRm59IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCAqIGFzIGdlbmVyaWNfdXRpbHMgZnJvbSAnLi4vdXRpbHMvZ2VuZXJpY191dGlscyc7XG5pbXBvcnQgKiBhcyB0eXBlc191dGlscyBmcm9tICcuLi91dGlscy90eXBlc191dGlscyc7XG5pbXBvcnQgKiBhcyB2YXJpYWJsZV91dGlscyBmcm9tICcuLi91dGlscy92YXJpYWJsZV91dGlscyc7XG5pbXBvcnQge2JhdGNoR2V0VmFsdWUsIGJhdGNoU2V0VmFsdWUsIExheWVyVmFyaWFibGV9IGZyb20gJy4uL3ZhcmlhYmxlcyc7XG5cbi8vIFRPRE8obWljaGFlbHRlcnJ5KTogVGhpcyBpcyBhIHN0dWIgdW50aWwgaXQncyBkZWZpbmVkLlxuZXhwb3J0IHR5cGUgT3AgPSAoeDogTGF5ZXJWYXJpYWJsZSkgPT4gTGF5ZXJWYXJpYWJsZTtcblxuLyoqXG4gKiBDb25zdHJ1Y3RvciBhcmd1bWVudHMgZm9yIElucHV0U3BlYy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbnB1dFNwZWNBcmdzIHtcbiAgLyoqIEV4cGVjdGVkIGRhdGF0eXBlIG9mIHRoZSBpbnB1dC4gKi9cbiAgZHR5cGU/OiBEYXRhVHlwZTtcbiAgLyoqIEV4cGVjdGVkIHNoYXBlIG9mIHRoZSBpbnB1dCAobWF5IGluY2x1ZGUgbnVsbCBmb3IgdW5jaGVja2VkIGF4ZXMpLiAqL1xuICBzaGFwZT86IFNoYXBlO1xuICAvKiogRXhwZWN0ZWQgcmFuayBvZiB0aGUgaW5wdXQuICovXG4gIG5kaW0/OiBudW1iZXI7XG4gIC8qKiBNYXhpbXVtIHJhbmsgb2YgdGhlIGlucHV0LiAqL1xuICBtYXhORGltPzogbnVtYmVyO1xuICAvKiogTWluaW11bSByYW5rIG9mIHRoZSBpbnB1dC4gKi9cbiAgbWluTkRpbT86IG51bWJlcjtcbiAgLyoqIERpY3Rpb25hcnkgbWFwcGluZyBpbnRlZ2VyIGF4ZXMgdG8gYSBzcGVjaWZpYyBkaW1lbnNpb24gdmFsdWUuICovXG4gIGF4ZXM/OiB7W2F4aXM6IG51bWJlcl06IG51bWJlcn07XG59XG5cbi8qKlxuICogU3BlY2lmaWVzIHRoZSBuZGltLCBkdHlwZSBhbmQgc2hhcGUgb2YgZXZlcnkgaW5wdXQgdG8gYSBsYXllci5cbiAqXG4gKiBFdmVyeSBsYXllciBzaG91bGQgZXhwb3NlIChpZiBhcHByb3ByaWF0ZSkgYW4gYGlucHV0U3BlY2AgYXR0cmlidXRlOlxuICogYSBsaXN0IG9mIGluc3RhbmNlcyBvZiBJbnB1dFNwZWMgKG9uZSBwZXIgaW5wdXQgdGVuc29yKS5cbiAqXG4gKiBBIG51bGwgZW50cnkgaW4gYSBzaGFwZSBpcyBjb21wYXRpYmxlIHdpdGggYW55IGRpbWVuc2lvbixcbiAqIGEgbnVsbCBzaGFwZSBpcyBjb21wYXRpYmxlIHdpdGggYW55IHNoYXBlLlxuICovXG5leHBvcnQgY2xhc3MgSW5wdXRTcGVjIHtcbiAgLyoqIEV4cGVjdGVkIGRhdGF0eXBlIG9mIHRoZSBpbnB1dC4gKi9cbiAgZHR5cGU/OiBEYXRhVHlwZTtcbiAgLyoqIEV4cGVjdGVkIHNoYXBlIG9mIHRoZSBpbnB1dCAobWF5IGluY2x1ZGUgbnVsbCBmb3IgdW5jaGVja2VkIGF4ZXMpLiAqL1xuICBzaGFwZT86IFNoYXBlO1xuICAvKiogRXhwZWN0ZWQgcmFuayBvZiB0aGUgaW5wdXQuICovXG4gIG5kaW0/OiBudW1iZXI7XG4gIC8qKiBNYXhpbXVtIHJhbmsgb2YgdGhlIGlucHV0LiAqL1xuICBtYXhORGltPzogbnVtYmVyO1xuICAvKiogTWluaW11bSByYW5rIG9mIHRoZSBpbnB1dC4gKi9cbiAgbWluTkRpbT86IG51bWJlcjtcbiAgLyoqIERpY3Rpb25hcnkgbWFwcGluZyBpbnRlZ2VyIGF4ZXMgdG8gYSBzcGVjaWZpYyBkaW1lbnNpb24gdmFsdWUuICovXG4gIGF4ZXM/OiB7W2F4aXM6IG51bWJlcl06IG51bWJlcn07XG5cbiAgY29uc3RydWN0b3IoYXJnczogSW5wdXRTcGVjQXJncykge1xuICAgIHRoaXMuZHR5cGUgPSBhcmdzLmR0eXBlO1xuICAgIHRoaXMuc2hhcGUgPSBhcmdzLnNoYXBlO1xuICAgIC8qXG4gICAgICBUT0RPKG1pY2hhZWx0ZXJyeSk6IENvdWxkIHRocm93IGVycm9yIGlmIG5kaW0gYW5kIHNoYXBlIGFyZSBib3RoIGRlZmluZWRcbiAgICAgICAgKHRoZW4gYmFja3BvcnQpLlxuICAgICovXG4gICAgaWYgKGFyZ3Muc2hhcGUgIT0gbnVsbCkge1xuICAgICAgdGhpcy5uZGltID0gYXJncy5zaGFwZS5sZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubmRpbSA9IGFyZ3MubmRpbTtcbiAgICB9XG4gICAgdGhpcy5tYXhORGltID0gYXJncy5tYXhORGltO1xuICAgIHRoaXMubWluTkRpbSA9IGFyZ3MubWluTkRpbTtcbiAgICB0aGlzLmF4ZXMgPSBhcmdzLmF4ZXMgfHwge307XG4gIH1cbn1cblxuLyoqXG4gKiBgdGYuU3ltYm9saWNUZW5zb3JgIGlzIGEgcGxhY2Vob2xkZXIgZm9yIGEgVGVuc29yIHdpdGhvdXQgYW55IGNvbmNyZXRlIHZhbHVlLlxuICpcbiAqIFRoZXkgYXJlIG1vc3Qgb2Z0ZW4gZW5jb3VudGVyZWQgd2hlbiBidWlsZGluZyBhIGdyYXBoIG9mIGBMYXllcmBzIGZvciBhXG4gKiBgdGYuTGF5ZXJzTW9kZWxgIGFuZCB0aGUgaW5wdXQgZGF0YSdzIHNoYXBlLCBidXQgbm90IHZhbHVlcyBhcmUga25vd24uXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ01vZGVscycsICdzdWJoZWFkaW5nJzogJ0NsYXNzZXMnfVxuICovXG5leHBvcnQgY2xhc3MgU3ltYm9saWNUZW5zb3Ige1xuICAvKiBBIHVuaXF1ZSBJRCBmb3IgdGhlIHRlbnNvciB0byBiZSBhYmxlIHRvIGRpZmZlcmVudGlhdGUgdGVuc29ycy4gKi9cbiAgcmVhZG9ubHkgaWQ6IG51bWJlcjtcbiAgLy8gVGhlIGZ1bGx5IHNjb3BlZCBuYW1lIG9mIHRoaXMgVmFyaWFibGUsIGluY2x1ZGluZyBhIHVuaXF1ZSBzdWZmaXggaWYgbmVlZGVkXG4gIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcbiAgLy8gVGhlIG9yaWdpbmFsbHkgcmVxdWVzdGVkIGZ1bGx5IHNjb3BlZCBuYW1lIG9mIHRoaXMgVmFyaWFibGUsIG5vdCBpbmNsdWRpbmdcbiAgLy8gYW55IHVuaXF1ZSBzdWZmaXguICBUaGlzIG1heSBiZSBuZWVkZWQgd2hlbiByZXN0b3Jpbmcgd2VpZ2h0cyBiZWNhdXNlIHRoaXNcbiAgLy8gb3JpZ2luYWwgbmFtZSBpcyB1c2VkIGFzIGEga2V5LlxuICByZWFkb25seSBvcmlnaW5hbE5hbWU/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBSYW5rL2RpbWVuc2lvbmFsaXR5IG9mIHRoZSB0ZW5zb3IuXG4gICAqL1xuICByZWFkb25seSByYW5rOiBudW1iZXI7XG4gIC8qKlxuICAgKiBSZXBsYWNlbWVudCBmb3IgX2tlcmFzX2hpc3RvcnkuXG4gICAqL1xuICBub2RlSW5kZXg6IG51bWJlcjtcbiAgLyoqXG4gICAqIFJlcGxhY2VtZW50IGZvciBfa2VyYXNfaGlzdG9yeS5cbiAgICovXG4gIHRlbnNvckluZGV4OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBkdHlwZVxuICAgKiBAcGFyYW0gc2hhcGVcbiAgICogQHBhcmFtIHNvdXJjZUxheWVyIFRoZSBMYXllciB0aGF0IHByb2R1Y2VkIHRoaXMgc3ltYm9saWMgdGVuc29yLlxuICAgKiBAcGFyYW0gaW5wdXRzIFRoZSBpbnB1dHMgcGFzc2VkIHRvIHNvdXJjZUxheWVyJ3MgX19jYWxsX18oKSBtZXRob2QuXG4gICAqIEBwYXJhbSBub2RlSW5kZXhcbiAgICogQHBhcmFtIHRlbnNvckluZGV4XG4gICAqIEBwYXJhbSBjYWxsQXJncyBUaGUga2V5d29yZCBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBfX2NhbGxfXygpIG1ldGhvZC5cbiAgICogQHBhcmFtIG5hbWVcbiAgICogQHBhcmFtIG91dHB1dFRlbnNvckluZGV4IFRoZSBpbmRleCBvZiB0aGlzIHRlbnNvciBpbiB0aGUgbGlzdCBvZiBvdXRwdXRzXG4gICAqICAgcmV0dXJuZWQgYnkgYXBwbHkoKS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcmVhZG9ubHkgZHR5cGU6IERhdGFUeXBlLCByZWFkb25seSBzaGFwZTogU2hhcGUsXG4gICAgICBwdWJsaWMgc291cmNlTGF5ZXI6IExheWVyLCByZWFkb25seSBpbnB1dHM6IFN5bWJvbGljVGVuc29yW10sXG4gICAgICByZWFkb25seSBjYWxsQXJnczogS3dhcmdzLCBuYW1lPzogc3RyaW5nLFxuICAgICAgcmVhZG9ubHkgb3V0cHV0VGVuc29ySW5kZXg/OiBudW1iZXIpIHtcbiAgICB0aGlzLmlkID0gZ2V0TmV4dFVuaXF1ZVRlbnNvcklkKCk7XG4gICAgaWYgKG5hbWUgIT0gbnVsbCkge1xuICAgICAgdGhpcy5vcmlnaW5hbE5hbWUgPSBnZXRTY29wZWRUZW5zb3JOYW1lKG5hbWUpO1xuICAgICAgdGhpcy5uYW1lID0gZ2V0VW5pcXVlVGVuc29yTmFtZSh0aGlzLm9yaWdpbmFsTmFtZSk7XG4gICAgfVxuICAgIHRoaXMucmFuayA9IHNoYXBlLmxlbmd0aDtcbiAgfVxufVxuXG4vKipcbiAqIENvbnN0cnVjdG9yIGFyZ3VtZW50cyBmb3IgTm9kZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOb2RlQXJncyB7XG4gIC8qKlxuICAgKiBUaGUgbGF5ZXIgdGhhdCB0YWtlcyBgaW5wdXRUZW5zb3JzYCBhbmQgdHVybnMgdGhlbSBpbnRvIGBvdXRwdXRUZW5zb3JzYC5cbiAgICogKHRoZSBub2RlIGdldHMgY3JlYXRlZCB3aGVuIHRoZSBgY2FsbGAgbWV0aG9kIG9mIHRoZSBsYXllciBpcyBjYWxsZWQpLlxuICAgKi9cbiAgb3V0Ym91bmRMYXllcjogTGF5ZXI7XG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgbGF5ZXJzLCB0aGUgc2FtZSBsZW5ndGggYXMgYGlucHV0VGVuc29yc2AsIHRoZSBsYXllcnMgZnJvbSB3aGVyZVxuICAgKiBgaW5wdXRUZW5zb3JzYCBvcmlnaW5hdGUuXG4gICAqL1xuICBpbmJvdW5kTGF5ZXJzOiBMYXllcltdO1xuICAvKipcbiAgICogQSBsaXN0IG9mIGludGVnZXJzLCB0aGUgc2FtZSBsZW5ndGggYXMgYGluYm91bmRMYXllcnNgLiBgbm9kZUluZGljZXNbaV1gIGlzXG4gICAqIHRoZSBvcmlnaW4gbm9kZSBvZiBgaW5wdXRUZW5zb3JzW2ldYCAobmVjZXNzYXJ5IHNpbmNlIGVhY2ggaW5ib3VuZCBsYXllclxuICAgKiBtaWdodCBoYXZlIHNldmVyYWwgbm9kZXMsIGUuZy4gaWYgdGhlIGxheWVyIGlzIGJlaW5nIHNoYXJlZCB3aXRoIGFcbiAgICogZGlmZmVyZW50IGRhdGEgc3RyZWFtKS5cbiAgICovXG4gIG5vZGVJbmRpY2VzOiBudW1iZXJbXTtcbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBpbnRlZ2VycywgdGhlIHNhbWUgbGVuZ3RoIGFzIGBpbmJvdW5kTGF5ZXJzYC4gYHRlbnNvckluZGljZXNbaV1gXG4gICAqIGlzIHRoZSBpbmRleCBvZiBgaW5wdXRUZW5zb3JzW2ldYCB3aXRoaW4gdGhlIG91dHB1dCBvZiB0aGUgaW5ib3VuZCBsYXllclxuICAgKiAobmVjZXNzYXJ5IHNpbmNlIGVhY2ggaW5ib3VuZCBsYXllciBtaWdodCBoYXZlIG11bHRpcGxlIHRlbnNvciBvdXRwdXRzLFxuICAgKiB3aXRoIGVhY2ggb25lIGJlaW5nIGluZGVwZW5kZW50bHkgbWFuaXB1bGFibGUpLlxuICAgKi9cbiAgdGVuc29ySW5kaWNlczogbnVtYmVyW107XG4gIC8qKiBMaXN0IG9mIGlucHV0IHRlbnNvcnMuICovXG4gIGlucHV0VGVuc29yczogU3ltYm9saWNUZW5zb3JbXTtcbiAgLyoqIExpc3Qgb2Ygb3V0cHV0IHRlbnNvcnMuICovXG4gIG91dHB1dFRlbnNvcnM6IFN5bWJvbGljVGVuc29yW107XG4gIC8qKiBMaXN0IG9mIGlucHV0IG1hc2tzIChhIG1hc2sgY2FuIGJlIGEgdGVuc29yLCBvciBudWxsKS4gKi9cbiAgaW5wdXRNYXNrczogVGVuc29yW107XG4gIC8qKiBMaXN0IG9mIG91dHB1dCBtYXNrcyAoYSBtYXNrIGNhbiBiZSBhIHRlbnNvciwgb3IgbnVsbCkuICovXG4gIG91dHB1dE1hc2tzOiBUZW5zb3JbXTtcbiAgLyoqIExpc3Qgb2YgaW5wdXQgc2hhcGUgdHVwbGVzLiAqL1xuICBpbnB1dFNoYXBlczogU2hhcGV8U2hhcGVbXTtcbiAgLyoqIExpc3Qgb2Ygb3V0cHV0IHNoYXBlIHR1cGxlcy4gKi9cbiAgb3V0cHV0U2hhcGVzOiBTaGFwZXxTaGFwZVtdO1xufVxuXG4vKipcbiAqIFRoZSB0eXBlIG9mIHRoZSByZXR1cm4gdmFsdWUgb2YgTGF5ZXIuZGlzcG9zZSgpIGFuZCBDb250YWluZXIuZGlzcG9zZSgpLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIERpc3Bvc2VSZXN1bHQge1xuICAvKipcbiAgICogUmVmZXJlbmNlIGNvdW50IGFmdGVyIHRoZSBkaXNwb3NlIGNhbGwuXG4gICAqL1xuICByZWZDb3VudEFmdGVyRGlzcG9zZTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBOdW1iZXIgb2YgdmFyaWFibGVzIGRpc3Bvc2UgaW4gdGhpcyBkaXNwb3NlIGNhbGwuXG4gICAqL1xuICBudW1EaXNwb3NlZFZhcmlhYmxlczogbnVtYmVyO1xufVxuXG5sZXQgX25leHROb2RlSUQgPSAwO1xuXG4vKipcbiAqIEEgYE5vZGVgIGRlc2NyaWJlcyB0aGUgY29ubmVjdGl2aXR5IGJldHdlZW4gdHdvIGxheWVycy5cbiAqXG4gKiBFYWNoIHRpbWUgYSBsYXllciBpcyBjb25uZWN0ZWQgdG8gc29tZSBuZXcgaW5wdXQsXG4gKiBhIG5vZGUgaXMgYWRkZWQgdG8gYGxheWVyLmluYm91bmROb2Rlc2AuXG4gKlxuICogRWFjaCB0aW1lIHRoZSBvdXRwdXQgb2YgYSBsYXllciBpcyB1c2VkIGJ5IGFub3RoZXIgbGF5ZXIsXG4gKiBhIG5vZGUgaXMgYWRkZWQgdG8gYGxheWVyLm91dGJvdW5kTm9kZXNgLlxuICpcbiAqIGBub2RlSW5kaWNlc2AgYW5kIGB0ZW5zb3JJbmRpY2VzYCBhcmUgYmFzaWNhbGx5IGZpbmUtZ3JhaW5lZCBjb29yZGluYXRlc1xuICogZGVzY3JpYmluZyB0aGUgb3JpZ2luIG9mIHRoZSBgaW5wdXRUZW5zb3JzYCwgdmVyaWZ5aW5nIHRoZSBmb2xsb3dpbmc6XG4gKlxuICogYGlucHV0VGVuc29yc1tpXSA9PVxuICogaW5ib3VuZExheWVyc1tpXS5pbmJvdW5kTm9kZXNbbm9kZUluZGljZXNbaV1dLm91dHB1dFRlbnNvcnNbXG4gKiAgIHRlbnNvckluZGljZXNbaV1dYFxuICpcbiAqIEEgbm9kZSBmcm9tIGxheWVyIEEgdG8gbGF5ZXIgQiBpcyBhZGRlZCB0bzpcbiAqICAgICBBLm91dGJvdW5kTm9kZXNcbiAqICAgICBCLmluYm91bmROb2Rlc1xuICovXG5leHBvcnQgY2xhc3MgTm9kZSB7XG4gIC8qKlxuICAgKiBUaGUgbGF5ZXIgdGhhdCB0YWtlcyBgaW5wdXRUZW5zb3JzYCBhbmQgdHVybnMgdGhlbSBpbnRvIGBvdXRwdXRUZW5zb3JzYFxuICAgKiAodGhlIG5vZGUgZ2V0cyBjcmVhdGVkIHdoZW4gdGhlIGBjYWxsYCBtZXRob2Qgb2YgdGhlIGxheWVyIGlzIGNhbGxlZCkuXG4gICAqL1xuICBvdXRib3VuZExheWVyOiBMYXllcjtcbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBsYXllcnMsIHRoZSBzYW1lIGxlbmd0aCBhcyBgaW5wdXRUZW5zb3JzYCwgdGhlIGxheWVycyBmcm9tIHdoZXJlXG4gICAqIGBpbnB1dFRlbnNvcnNgIG9yaWdpbmF0ZS5cbiAgICovXG4gIGluYm91bmRMYXllcnM6IExheWVyW107XG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgaW50ZWdlcnMsIHRoZSBzYW1lIGxlbmd0aCBhcyBgaW5ib3VuZExheWVyc2AuIGBub2RlSW5kaWNlc1tpXWAgaXNcbiAgICogdGhlIG9yaWdpbiBub2RlIG9mIGBpbnB1dFRlbnNvcnNbaV1gIChuZWNlc3Nhcnkgc2luY2UgZWFjaCBpbmJvdW5kIGxheWVyXG4gICAqIG1pZ2h0IGhhdmUgc2V2ZXJhbCBub2RlcywgZS5nLiBpZiB0aGUgbGF5ZXIgaXMgYmVpbmcgc2hhcmVkIHdpdGggYVxuICAgKiBkaWZmZXJlbnQgZGF0YSBzdHJlYW0pLlxuICAgKi9cbiAgbm9kZUluZGljZXM6IG51bWJlcltdO1xuICAvKipcbiAgICogQSBsaXN0IG9mIGludGVnZXJzLCB0aGUgc2FtZSBsZW5ndGggYXMgYGluYm91bmRMYXllcnNgLiBgdGVuc29ySW5kaWNlc1tpXWBcbiAgICogaXMgdGhlIGluZGV4IG9mIGBpbnB1dFRlbnNvcnNbaV1gIHdpdGhpbiB0aGUgb3V0cHV0IG9mIHRoZSBpbmJvdW5kIGxheWVyXG4gICAqIChuZWNlc3Nhcnkgc2luY2UgZWFjaCBpbmJvdW5kIGxheWVyIG1pZ2h0IGhhdmUgbXVsdGlwbGUgdGVuc29yIG91dHB1dHMsXG4gICAqIHdpdGggZWFjaCBvbmUgYmVpbmcgaW5kZXBlbmRlbnRseSBtYW5pcHVsYWJsZSkuXG4gICAqL1xuICB0ZW5zb3JJbmRpY2VzOiBudW1iZXJbXTtcbiAgLyoqIExpc3Qgb2YgaW5wdXQgdGVuc29ycy4gKi9cbiAgaW5wdXRUZW5zb3JzOiBTeW1ib2xpY1RlbnNvcltdO1xuICAvKiogTGlzdCBvZiBvdXRwdXQgdGVuc29ycy4gKi9cbiAgb3V0cHV0VGVuc29yczogU3ltYm9saWNUZW5zb3JbXTtcbiAgLyoqIExpc3Qgb2YgaW5wdXQgbWFza3MgKGEgbWFzayBjYW4gYmUgYSB0ZW5zb3IsIG9yIG51bGwpLiAqL1xuICBpbnB1dE1hc2tzOiBUZW5zb3JbXTtcbiAgLyoqIExpc3Qgb2Ygb3V0cHV0IG1hc2tzIChhIG1hc2sgY2FuIGJlIGEgdGVuc29yLCBvciBudWxsKS4gKi9cbiAgb3V0cHV0TWFza3M6IFRlbnNvcltdO1xuICAvKiogTGlzdCBvZiBpbnB1dCBzaGFwZSB0dXBsZXMuICovXG4gIGlucHV0U2hhcGVzOiBTaGFwZXxTaGFwZVtdO1xuICAvKiogTGlzdCBvZiBvdXRwdXQgc2hhcGUgdHVwbGVzLiAqL1xuICBvdXRwdXRTaGFwZXM6IFNoYXBlfFNoYXBlW107XG5cbiAgcmVhZG9ubHkgaWQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIGFyZ3M6IE5vZGVBcmdzLFxuICAgICAgLy8gVE9ETyhtaWNoYWVsdGVycnkpOiBEZWZpbmUgYWN0dWFsIHR5cGUgZm9yIHRoaXMuXG4gICAgICBwdWJsaWMgY2FsbEFyZ3M/OiBLd2FyZ3MpIHtcbiAgICB0aGlzLmlkID0gX25leHROb2RlSUQrKztcbiAgICAvKlxuICAgICAgTGF5ZXIgaW5zdGFuY2UgKE5PVCBhIGxpc3QpLlxuICAgICAgdGhpcyBpcyB0aGUgbGF5ZXIgdGhhdCB0YWtlcyBhIGxpc3Qgb2YgaW5wdXQgdGVuc29yc1xuICAgICAgYW5kIHR1cm5zIHRoZW0gaW50byBhIGxpc3Qgb2Ygb3V0cHV0IHRlbnNvcnMuXG4gICAgICB0aGUgY3VycmVudCBub2RlIHdpbGwgYmUgYWRkZWQgdG9cbiAgICAgIHRoZSBpbmJvdW5kTm9kZXMgb2Ygb3V0Ym91bmRMYXllci5cbiAgICAqL1xuICAgIHRoaXMub3V0Ym91bmRMYXllciA9IGFyZ3Mub3V0Ym91bmRMYXllcjtcblxuICAgIC8qXG4gICAgICAgIFRoZSBmb2xsb3dpbmcgMyBwcm9wZXJ0aWVzIGRlc2NyaWJlIHdoZXJlXG4gICAgICAgIHRoZSBpbnB1dCB0ZW5zb3JzIGNvbWUgZnJvbTogd2hpY2ggbGF5ZXJzLFxuICAgICAgICBhbmQgZm9yIGVhY2ggbGF5ZXIsIHdoaWNoIG5vZGUgYW5kIHdoaWNoXG4gICAgICAgIHRlbnNvciBvdXRwdXQgb2YgZWFjaCBub2RlLlxuICAgICovXG5cbiAgICAvLyBMaXN0IG9mIGxheWVyIGluc3RhbmNlcy5cbiAgICB0aGlzLmluYm91bmRMYXllcnMgPSBhcmdzLmluYm91bmRMYXllcnM7XG4gICAgLy8gTGlzdCBvZiBpbnRlZ2VycywgMToxIG1hcHBpbmcgd2l0aCBpbmJvdW5kTGF5ZXJzLlxuICAgIHRoaXMubm9kZUluZGljZXMgPSBhcmdzLm5vZGVJbmRpY2VzO1xuICAgIC8vIExpc3Qgb2YgaW50ZWdlcnMsIDE6MSBtYXBwaW5nIHdpdGggaW5ib3VuZExheWVycy5cbiAgICB0aGlzLnRlbnNvckluZGljZXMgPSBhcmdzLnRlbnNvckluZGljZXM7XG5cbiAgICAvKlxuICAgICAgICBGb2xsb3dpbmcgMiBwcm9wZXJ0aWVzOlxuICAgICAgICB0ZW5zb3IgaW5wdXRzIGFuZCBvdXRwdXRzIG9mIG91dGJvdW5kTGF5ZXIuXG4gICAgKi9cblxuICAgIC8vIExpc3Qgb2YgdGVuc29ycy4gMToxIG1hcHBpbmcgd2l0aCBpbmJvdW5kTGF5ZXJzLlxuICAgIHRoaXMuaW5wdXRUZW5zb3JzID0gYXJncy5pbnB1dFRlbnNvcnM7XG4gICAgLy8gTGlzdCBvZiB0ZW5zb3JzLCBjcmVhdGVkIGJ5IG91dGJvdW5kTGF5ZXIuY2FsbCgpLlxuICAgIHRoaXMub3V0cHV0VGVuc29ycyA9IGFyZ3Mub3V0cHV0VGVuc29ycztcblxuICAgIC8qXG4gICAgICAgIEZvbGxvd2luZyAyIHByb3BlcnRpZXM6IGlucHV0IGFuZCBvdXRwdXQgbWFza3MuXG4gICAgICAgIExpc3Qgb2YgdGVuc29ycywgMToxIG1hcHBpbmcgd2l0aCBpbnB1dFRlbnNvci5cbiAgICAqL1xuICAgIHRoaXMuaW5wdXRNYXNrcyA9IGFyZ3MuaW5wdXRNYXNrcztcbiAgICAvLyBMaXN0IG9mIHRlbnNvcnMsIGNyZWF0ZWQgYnkgb3V0Ym91bmRMYXllci5jb21wdXRlTWFzaygpLlxuICAgIHRoaXMub3V0cHV0TWFza3MgPSBhcmdzLm91dHB1dE1hc2tzO1xuXG4gICAgLy8gRm9sbG93aW5nIDIgcHJvcGVydGllczogaW5wdXQgYW5kIG91dHB1dCBzaGFwZXMuXG5cbiAgICAvLyBMaXN0IG9mIHNoYXBlIHR1cGxlcywgc2hhcGVzIG9mIGlucHV0VGVuc29ycy5cbiAgICB0aGlzLmlucHV0U2hhcGVzID0gYXJncy5pbnB1dFNoYXBlcztcbiAgICAvLyBMaXN0IG9mIHNoYXBlIHR1cGxlcywgc2hhcGVzIG9mIG91dHB1dFRlbnNvcnMuXG4gICAgdGhpcy5vdXRwdXRTaGFwZXMgPSBhcmdzLm91dHB1dFNoYXBlcztcblxuICAgIC8vIEFkZCBub2RlcyB0byBhbGwgbGF5ZXJzIGludm9sdmVkLlxuICAgIGZvciAoY29uc3QgbGF5ZXIgb2YgYXJncy5pbmJvdW5kTGF5ZXJzKSB7XG4gICAgICBpZiAobGF5ZXIgIT0gbnVsbCkge1xuICAgICAgICBsYXllci5vdXRib3VuZE5vZGVzLnB1c2godGhpcyk7XG4gICAgICB9XG4gICAgfVxuICAgIGFyZ3Mub3V0Ym91bmRMYXllci5pbmJvdW5kTm9kZXMucHVzaCh0aGlzKTtcbiAgfVxuXG4gIGdldENvbmZpZygpOiBzZXJpYWxpemF0aW9uLkNvbmZpZ0RpY3Qge1xuICAgIGNvbnN0IGluYm91bmROYW1lczogc3RyaW5nW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGxheWVyIG9mIHRoaXMuaW5ib3VuZExheWVycykge1xuICAgICAgaWYgKGxheWVyICE9IG51bGwpIHtcbiAgICAgICAgaW5ib3VuZE5hbWVzLnB1c2gobGF5ZXIubmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmJvdW5kTmFtZXMucHVzaChudWxsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIG91dGJvdW5kTGF5ZXI6IHRoaXMub3V0Ym91bmRMYXllciA/IHRoaXMub3V0Ym91bmRMYXllci5uYW1lIDogbnVsbCxcbiAgICAgIGluYm91bmRMYXllcnM6IGluYm91bmROYW1lcyxcbiAgICAgIG5vZGVJbmRpY2VzOiB0aGlzLm5vZGVJbmRpY2VzLFxuICAgICAgdGVuc29ySW5kaWNlczogdGhpcy50ZW5zb3JJbmRpY2VzXG4gICAgfTtcbiAgfVxufVxuXG4vKiogQ29uc3RydWN0b3IgYXJndW1lbnRzIGZvciBMYXllci4gKi9cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBMYXllckFyZ3Mge1xuICAvKipcbiAgICogSWYgZGVmaW5lZCwgd2lsbCBiZSB1c2VkIHRvIGNyZWF0ZSBhbiBpbnB1dCBsYXllciB0byBpbnNlcnQgYmVmb3JlIHRoaXNcbiAgICogbGF5ZXIuIElmIGJvdGggYGlucHV0U2hhcGVgIGFuZCBgYmF0Y2hJbnB1dFNoYXBlYCBhcmUgZGVmaW5lZCxcbiAgICogYGJhdGNoSW5wdXRTaGFwZWAgd2lsbCBiZSB1c2VkLiBUaGlzIGFyZ3VtZW50IGlzIG9ubHkgYXBwbGljYWJsZSB0byBpbnB1dFxuICAgKiBsYXllcnMgKHRoZSBmaXJzdCBsYXllciBvZiBhIG1vZGVsKS5cbiAgICovXG4gIGlucHV0U2hhcGU/OiBTaGFwZTtcbiAgLyoqXG4gICAqIElmIGRlZmluZWQsIHdpbGwgYmUgdXNlZCB0byBjcmVhdGUgYW4gaW5wdXQgbGF5ZXIgdG8gaW5zZXJ0IGJlZm9yZSB0aGlzXG4gICAqIGxheWVyLiBJZiBib3RoIGBpbnB1dFNoYXBlYCBhbmQgYGJhdGNoSW5wdXRTaGFwZWAgYXJlIGRlZmluZWQsXG4gICAqIGBiYXRjaElucHV0U2hhcGVgIHdpbGwgYmUgdXNlZC4gVGhpcyBhcmd1bWVudCBpcyBvbmx5IGFwcGxpY2FibGUgdG8gaW5wdXRcbiAgICogbGF5ZXJzICh0aGUgZmlyc3QgbGF5ZXIgb2YgYSBtb2RlbCkuXG4gICAqL1xuICBiYXRjaElucHV0U2hhcGU/OiBTaGFwZTtcbiAgLyoqXG4gICAqIElmIGBpbnB1dFNoYXBlYCBpcyBzcGVjaWZpZWQgYW5kIGBiYXRjaElucHV0U2hhcGVgIGlzICpub3QqIHNwZWNpZmllZCxcbiAgICogYGJhdGNoU2l6ZWAgaXMgdXNlZCB0byBjb25zdHJ1Y3QgdGhlIGBiYXRjaElucHV0U2hhcGVgOiBgW2JhdGNoU2l6ZSxcbiAgICogLi4uaW5wdXRTaGFwZV1gXG4gICAqL1xuICBiYXRjaFNpemU/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBUaGUgZGF0YS10eXBlIGZvciB0aGlzIGxheWVyLiBEZWZhdWx0cyB0byAnZmxvYXQzMicuXG4gICAqIFRoaXMgYXJndW1lbnQgaXMgb25seSBhcHBsaWNhYmxlIHRvIGlucHV0IGxheWVycyAodGhlIGZpcnN0IGxheWVyIG9mIGFcbiAgICogbW9kZWwpLlxuICAgKi9cbiAgZHR5cGU/OiBEYXRhVHlwZTtcbiAgLyoqIE5hbWUgZm9yIHRoaXMgbGF5ZXIuICovXG4gIG5hbWU/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSB3ZWlnaHRzIG9mIHRoaXMgbGF5ZXIgYXJlIHVwZGF0YWJsZSBieSBgZml0YC5cbiAgICogRGVmYXVsdHMgdG8gdHJ1ZS5cbiAgICovXG4gIHRyYWluYWJsZT86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBJbml0aWFsIHdlaWdodCB2YWx1ZXMgb2YgdGhlIGxheWVyLlxuICAgKi9cbiAgd2VpZ2h0cz86IFRlbnNvcltdO1xuICAvKiogTGVnYWN5IHN1cHBvcnQuIERvIG5vdCB1c2UgZm9yIG5ldyBjb2RlLiAqL1xuICBpbnB1dERUeXBlPzogRGF0YVR5cGU7XG59XG5cbi8vIElmIG5lY2Vzc2FyeSwgYWRkIGBvdXRwdXRgIGFyZ3VtZW50cyB0byB0aGUgQ2FsbEhvb2sgZnVuY3Rpb24uXG4vLyBUaGlzIGlzIGN1cnJlbnRseSB1c2VkIGZvciB0ZXN0aW5nIG9ubHksIGJ1dCBtYXkgYmUgdXNlZCBmb3IgZGVidWdnZXItcmVsYXRlZFxuLy8gcHVycG9zZXMgaW4gdGhlIGZ1dHVyZS5cbmV4cG9ydCB0eXBlIENhbGxIb29rID0gKGlucHV0czogVGVuc29yfFRlbnNvcltdLCBrd2FyZ3M6IEt3YXJncykgPT4gdm9pZDtcblxubGV0IF9uZXh0TGF5ZXJJRCA9IDA7XG5cbi8qKlxuICogQSBsYXllciBpcyBhIGdyb3VwaW5nIG9mIG9wZXJhdGlvbnMgYW5kIHdlaWdodHMgdGhhdCBjYW4gYmUgY29tcG9zZWQgdG9cbiAqIGNyZWF0ZSBhIGB0Zi5MYXllcnNNb2RlbGAuXG4gKlxuICogTGF5ZXJzIGFyZSBjb25zdHJ1Y3RlZCBieSB1c2luZyB0aGUgZnVuY3Rpb25zIHVuZGVyIHRoZVxuICogW3RmLmxheWVyc10oI0xheWVycy1CYXNpYykgbmFtZXNwYWNlLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdMYXllcnMnLCBzdWJoZWFkaW5nOiAnQ2xhc3NlcycsIG5hbWVzcGFjZTogJ2xheWVycyd9XG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBMYXllciBleHRlbmRzIHNlcmlhbGl6YXRpb24uU2VyaWFsaXphYmxlIHtcbiAgLyoqIE5hbWUgZm9yIHRoaXMgbGF5ZXIuIE11c3QgYmUgdW5pcXVlIHdpdGhpbiBhIG1vZGVsLiAqL1xuICBuYW1lOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBMaXN0IG9mIElucHV0U3BlYyBjbGFzcyBpbnN0YW5jZXMuXG4gICAqXG4gICAqIEVhY2ggZW50cnkgZGVzY3JpYmVzIG9uZSByZXF1aXJlZCBpbnB1dDpcbiAgICogLSBuZGltXG4gICAqIC0gZHR5cGVcbiAgICogQSBsYXllciB3aXRoIGBuYCBpbnB1dCB0ZW5zb3JzIG11c3QgaGF2ZSBhbiBgaW5wdXRTcGVjYCBvZiBsZW5ndGggYG5gLlxuICAgKi9cbiAgaW5wdXRTcGVjOiBJbnB1dFNwZWNbXTtcbiAgc3VwcG9ydHNNYXNraW5nOiBib29sZWFuO1xuICAvKiogV2hldGhlciB0aGUgbGF5ZXIgd2VpZ2h0cyB3aWxsIGJlIHVwZGF0ZWQgZHVyaW5nIHRyYWluaW5nLiAqL1xuICBwcm90ZWN0ZWQgdHJhaW5hYmxlXzogYm9vbGVhbjtcbiAgYmF0Y2hJbnB1dFNoYXBlOiBTaGFwZTtcbiAgZHR5cGU6IERhdGFUeXBlO1xuICBpbml0aWFsV2VpZ2h0czogVGVuc29yW107XG5cbiAgaW5ib3VuZE5vZGVzOiBOb2RlW107XG4gIG91dGJvdW5kTm9kZXM6IE5vZGVbXTtcblxuICBhY3Rpdml0eVJlZ3VsYXJpemVyOiBSZWd1bGFyaXplcjtcblxuICBwcm90ZWN0ZWQgX3RyYWluYWJsZVdlaWdodHM6IExheWVyVmFyaWFibGVbXTtcbiAgcHJpdmF0ZSBfbm9uVHJhaW5hYmxlV2VpZ2h0czogTGF5ZXJWYXJpYWJsZVtdO1xuICBwcml2YXRlIF9sb3NzZXM6IFJlZ3VsYXJpemVyRm5bXTtcbiAgLy8gVE9ETyhjYWlzKTogX3VwZGF0ZXMgaXMgY3VycmVudGx5IHVudXNlZC5cbiAgcHJpdmF0ZSBfdXBkYXRlczogVGVuc29yW107XG4gIHByaXZhdGUgX2J1aWx0OiBib29sZWFuO1xuICBwcml2YXRlIF9jYWxsSG9vazogQ2FsbEhvb2sgPSBudWxsO1xuXG4gIHByaXZhdGUgX2FkZGVkV2VpZ2h0TmFtZXM6IHN0cmluZ1tdID0gW107XG5cbiAgcmVhZG9ubHkgaWQ6IG51bWJlcjtcblxuICAvLyBQb3J0aW5nIE5vdGVzOiBQeUtlcmFzIGRvZXMgbm90IGhhdmUgdGhpcyBwcm9wZXJ0eSBpbiB0aGlzIGJhc2UgTGF5ZXJcbiAgLy8gICBjbGFzcy4gSW5zdGVhZCBsZXRzIExheWVyIHN1YmNsYXNzIHNldCBpdCBkeW5hbWljYWxseSBhbmQgY2hlY2tzIHRoZVxuICAvLyAgIHZhbHVlIHdpdGggYGhhc2F0dHJgLiBJbiB0ZmpzLWxheWVycywgd2UgbGV0IHRoaXMgYmUgYSBtZW1iZXIgb2YgdGhpc1xuICAvLyAgIGJhc2UgY2xhc3MuXG4gIHByb3RlY3RlZCBfc3RhdGVmdWwgPSBmYWxzZTtcblxuICBwcm90ZWN0ZWQgX3JlZkNvdW50OiBudW1iZXJ8bnVsbDtcblxuICAvLyBBIGZsYWcgZm9yIHdoZXRoZXIgZmFzdCAoaS5lLiwgYWxsLXplcm8pIHdlaWdodCBpbml0aWFsaXphdGlvbiBpcyB0b1xuICAvLyBiZSB1c2VkIGR1cmluZyBgYnVpbGQoKWAgY2FsbC4gVGhpcyBzcGVlZHMgdXAgd2VpZ2h0IGluaXRpYWxpemF0aW9uXG4gIC8vIGJ5IHNhdmluZyB1bm5lY2Vzc2FyeSBjYWxscyB0byBleHBlbnNpdmUgaW5pdGlhbGl6ZXJzIGluIGNhc2VzIHdoZXJlXG4gIC8vIHRoZSBpbml0aWFsaXplZCB2YWx1ZXMgd2lsbCBiZSBvdmVyd3JpdHRlbiBieSBsb2FkZWQgd2VpZ2h0IHZhbHVlc1xuICAvLyBkdXJpbmcgbW9kZWwgbG9hZGluZy5cbiAgcHJpdmF0ZSBmYXN0V2VpZ2h0SW5pdER1cmluZ0J1aWxkOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKGFyZ3M6IExheWVyQXJncyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmlkID0gX25leHRMYXllcklEKys7XG5cbiAgICB0aGlzLmFjdGl2aXR5UmVndWxhcml6ZXIgPSBudWxsO1xuXG4gICAgdGhpcy5pbnB1dFNwZWMgPSBudWxsO1xuICAgIHRoaXMuc3VwcG9ydHNNYXNraW5nID0gZmFsc2U7XG5cbiAgICAvLyBUaGVzZSBwcm9wZXJ0aWVzIHdpbGwgYmUgc2V0IHVwb24gY2FsbCBvZiB0aGlzLmJ1aWxkKClcbiAgICB0aGlzLl90cmFpbmFibGVXZWlnaHRzID0gW107XG4gICAgdGhpcy5fbm9uVHJhaW5hYmxlV2VpZ2h0cyA9IFtdO1xuICAgIHRoaXMuX2xvc3NlcyA9IFtdO1xuICAgIHRoaXMuX3VwZGF0ZXMgPSBbXTtcbiAgICB0aGlzLl9idWlsdCA9IGZhbHNlO1xuXG4gICAgLypcbiAgICAgIFRoZXNlIGxpc3RzIHdpbGwgYmUgZmlsbGVkIHZpYSBzdWNjZXNzaXZlIGNhbGxzXG4gICAgICB0byB0aGlzLmFkZEluYm91bmROb2RlKCkuXG4gICAgICovXG4gICAgdGhpcy5pbmJvdW5kTm9kZXMgPSBbXTtcbiAgICB0aGlzLm91dGJvdW5kTm9kZXMgPSBbXTtcblxuICAgIGxldCBuYW1lID0gYXJncy5uYW1lO1xuICAgIGlmICghbmFtZSkge1xuICAgICAgY29uc3QgcHJlZml4ID0gdGhpcy5nZXRDbGFzc05hbWUoKTtcbiAgICAgIG5hbWUgPSBnZW5lcmljX3V0aWxzLnRvU25ha2VDYXNlKHByZWZpeCkgKyAnXycgKyBnZXRVaWQocHJlZml4KTtcbiAgICB9XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcblxuICAgIHRoaXMudHJhaW5hYmxlXyA9IGFyZ3MudHJhaW5hYmxlID09IG51bGwgPyB0cnVlIDogYXJncy50cmFpbmFibGU7XG5cbiAgICBpZiAoYXJncy5pbnB1dFNoYXBlICE9IG51bGwgfHwgYXJncy5iYXRjaElucHV0U2hhcGUgIT0gbnVsbCkge1xuICAgICAgLypcbiAgICAgICAgSW4gdGhpcyBjYXNlIHdlIHdpbGwgbGF0ZXIgY3JlYXRlIGFuIGlucHV0IGxheWVyXG4gICAgICAgIHRvIGluc2VydCBiZWZvcmUgdGhlIGN1cnJlbnQgbGF5ZXJcbiAgICAgICAqL1xuICAgICAgbGV0IGJhdGNoSW5wdXRTaGFwZTogU2hhcGU7XG4gICAgICBpZiAoYXJncy5iYXRjaElucHV0U2hhcGUgIT0gbnVsbCkge1xuICAgICAgICBiYXRjaElucHV0U2hhcGUgPSBhcmdzLmJhdGNoSW5wdXRTaGFwZTtcbiAgICAgIH0gZWxzZSBpZiAoYXJncy5pbnB1dFNoYXBlICE9IG51bGwpIHtcbiAgICAgICAgbGV0IGJhdGNoU2l6ZTogbnVtYmVyID0gbnVsbDtcbiAgICAgICAgaWYgKGFyZ3MuYmF0Y2hTaXplICE9IG51bGwpIHtcbiAgICAgICAgICBiYXRjaFNpemUgPSBhcmdzLmJhdGNoU2l6ZTtcbiAgICAgICAgfVxuICAgICAgICBiYXRjaElucHV0U2hhcGUgPSBbYmF0Y2hTaXplXS5jb25jYXQoYXJncy5pbnB1dFNoYXBlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYmF0Y2hJbnB1dFNoYXBlID0gYmF0Y2hJbnB1dFNoYXBlO1xuXG4gICAgICAvLyBTZXQgZHR5cGUuXG4gICAgICBsZXQgZHR5cGUgPSBhcmdzLmR0eXBlO1xuICAgICAgaWYgKGR0eXBlID09IG51bGwpIHtcbiAgICAgICAgZHR5cGUgPSBhcmdzLmlucHV0RFR5cGU7XG4gICAgICB9XG4gICAgICBpZiAoZHR5cGUgPT0gbnVsbCkge1xuICAgICAgICBkdHlwZSA9ICdmbG9hdDMyJztcbiAgICAgIH1cbiAgICAgIHRoaXMuZHR5cGUgPSBkdHlwZTtcbiAgICB9XG5cbiAgICBpZiAoYXJncy53ZWlnaHRzICE9IG51bGwpIHtcbiAgICAgIHRoaXMuaW5pdGlhbFdlaWdodHMgPSBhcmdzLndlaWdodHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW5pdGlhbFdlaWdodHMgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIFRoZSB2YWx1ZSBvZiBgX3JlZkNvdW50YCBpcyBpbml0aWFsaXplZCB0byBudWxsLiBXaGVuIHRoZSBsYXllciBpcyB1c2VkXG4gICAgLy8gaW4gYSBzeW1ib2xpYyB3YXkgZm9yIHRoZSBmaXJzdCB0aW1lLCBpdCB3aWxsIGJlIHNldCB0byAxLlxuICAgIHRoaXMuX3JlZkNvdW50ID0gbnVsbDtcblxuICAgIHRoaXMuZmFzdFdlaWdodEluaXREdXJpbmdCdWlsZCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGEgbGF5ZXIgYW5kIGl0cyBpbmRleCB0byBhIHVuaXF1ZSAoaW1tdXRhYmxlIHR5cGUpIG5hbWUuXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCBpbnRlcm5hbGx5IHdpdGggYHRoaXMuY29udGFpbmVyTm9kZXNgLlxuICAgKiBAcGFyYW0gbGF5ZXIgVGhlIGxheWVyLlxuICAgKiBAcGFyYW0gbm9kZUluZGV4IFRoZSBsYXllcidzIHBvc2l0aW9uIChlLmcuIHZpYSBlbnVtZXJhdGUpIGluIGEgbGlzdCBvZlxuICAgKiAgIG5vZGVzLlxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgdW5pcXVlIG5hbWUuXG4gICAqL1xuICBwcm90ZWN0ZWQgc3RhdGljIG5vZGVLZXkobGF5ZXI6IExheWVyLCBub2RlSW5kZXg6IG51bWJlcikge1xuICAgIHJldHVybiBsYXllci5uYW1lICsgJ19pYi0nICsgbm9kZUluZGV4LnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGlzLmluYm91bmROb2RlIGF0IGluZGV4IG5vZGVJbmRleC5cbiAgICpcbiAgICogUG9ydGluZyBub3RlOiBUaGlzIGlzIGEgcmVwbGFjZW1lbnQgZm9yIF9nZXRfbm9kZV9hdHRyaWJ1dGVfYXRfaW5kZXgoKVxuICAgKiBAcGFyYW0gbm9kZUluZGV4XG4gICAqIEBwYXJhbSBhdHRyTmFtZSBUaGUgbmFtZSBvZiB0aGUgYXR0cmlidXRlIHJlbGF0ZWQgdG8gcmVxdWVzdCBmb3IgdGhpcyBub2RlLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXROb2RlQXRJbmRleChub2RlSW5kZXg6IG51bWJlciwgYXR0ck5hbWU6IHN0cmluZyk6IE5vZGUge1xuICAgIGlmICh0aGlzLmluYm91bmROb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXG4gICAgICAgICAgJ1RoZSBsYXllciBoYXMgbmV2ZXIgYmVlbiBjYWxsZWQgJyArXG4gICAgICAgICAgYGFuZCB0aHVzIGhhcyBubyBkZWZpbmVkICR7YXR0ck5hbWV9LmApO1xuICAgIH1cbiAgICBpZiAodGhpcy5pbmJvdW5kTm9kZXMubGVuZ3RoIDw9IG5vZGVJbmRleCkge1xuICAgICAgdGhyb3cgbmV3IFZhbHVlRXJyb3IoXG4gICAgICAgICAgYEFza2VkIHRvIGdldCAke2F0dHJOYW1lfSBhdCBub2RlICR7bm9kZUluZGV4fSwgYCArXG4gICAgICAgICAgYGJ1dCB0aGUgbGF5ZXIgaGFzIG9ubHkgJHt0aGlzLmluYm91bmROb2Rlcy5sZW5ndGh9IGluYm91bmQgbm9kZXMuYCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmluYm91bmROb2Rlc1tub2RlSW5kZXhdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgaW5wdXQgdGVuc29yKHMpIG9mIGEgbGF5ZXIgYXQgYSBnaXZlbiBub2RlLlxuICAgKlxuICAgKiBAcGFyYW0gbm9kZUluZGV4IEludGVnZXIsIGluZGV4IG9mIHRoZSBub2RlIGZyb20gd2hpY2ggdG8gcmV0cmlldmUgdGhlXG4gICAqICAgYXR0cmlidXRlLiBFLmcuIGBub2RlSW5kZXg9MGAgd2lsbCBjb3JyZXNwb25kIHRvIHRoZSBmaXJzdCB0aW1lIHRoZSBsYXllclxuICAgKiAgIHdhcyBjYWxsZWQuXG4gICAqXG4gICAqIEByZXR1cm4gQSB0ZW5zb3IgKG9yIGxpc3Qgb2YgdGVuc29ycyBpZiB0aGUgbGF5ZXIgaGFzIG11bHRpcGxlIGlucHV0cykuXG4gICAqL1xuICBnZXRJbnB1dEF0KG5vZGVJbmRleDogbnVtYmVyKTogU3ltYm9saWNUZW5zb3J8U3ltYm9saWNUZW5zb3JbXSB7XG4gICAgcmV0dXJuIGdlbmVyaWNfdXRpbHMuc2luZ2xldG9uT3JBcnJheShcbiAgICAgICAgdGhpcy5nZXROb2RlQXRJbmRleChub2RlSW5kZXgsICdpbnB1dCcpLmlucHV0VGVuc29ycyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSBvdXRwdXQgdGVuc29yKHMpIG9mIGEgbGF5ZXIgYXQgYSBnaXZlbiBub2RlLlxuICAgKlxuICAgKiBAcGFyYW0gbm9kZUluZGV4IEludGVnZXIsIGluZGV4IG9mIHRoZSBub2RlIGZyb20gd2hpY2ggdG8gcmV0cmlldmUgdGhlXG4gICAqICAgYXR0cmlidXRlLiBFLmcuIGBub2RlSW5kZXg9MGAgd2lsbCBjb3JyZXNwb25kIHRvIHRoZSBmaXJzdCB0aW1lIHRoZSBsYXllclxuICAgKiAgIHdhcyBjYWxsZWQuXG4gICAqXG4gICAqIEByZXR1cm4gQSB0ZW5zb3IgKG9yIGxpc3Qgb2YgdGVuc29ycyBpZiB0aGUgbGF5ZXIgaGFzIG11bHRpcGxlIG91dHB1dHMpLlxuICAgKi9cbiAgZ2V0T3V0cHV0QXQobm9kZUluZGV4OiBudW1iZXIpOiBTeW1ib2xpY1RlbnNvcnxTeW1ib2xpY1RlbnNvcltdIHtcbiAgICByZXR1cm4gZ2VuZXJpY191dGlscy5zaW5nbGV0b25PckFycmF5KFxuICAgICAgICB0aGlzLmdldE5vZGVBdEluZGV4KG5vZGVJbmRleCwgJ291dHB1dCcpLm91dHB1dFRlbnNvcnMpO1xuICB9XG5cbiAgLy8gUHJvcGVydGllc1xuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgdGhlIGlucHV0IHRlbnNvcihzKSBvZiBhIGxheWVyLlxuICAgKlxuICAgKiBPbmx5IGFwcGxpY2FibGUgaWYgdGhlIGxheWVyIGhhcyBleGFjdGx5IG9uZSBpbmJvdW5kIG5vZGUsXG4gICAqIGkuZS4gaWYgaXQgaXMgY29ubmVjdGVkIHRvIG9uZSBpbmNvbWluZyBsYXllci5cbiAgICpcbiAgICogQHJldHVybiBJbnB1dCB0ZW5zb3Igb3IgbGlzdCBvZiBpbnB1dCB0ZW5zb3JzLlxuICAgKlxuICAgKiBAZXhjZXB0aW9uIEF0dHJpYnV0ZUVycm9yIGlmIHRoZSBsYXllciBpcyBjb25uZWN0ZWQgdG8gbW9yZSB0aGFuIG9uZVxuICAgKiAgIGluY29taW5nIGxheWVycy5cbiAgICovXG4gIGdldCBpbnB1dCgpOiBTeW1ib2xpY1RlbnNvcnxTeW1ib2xpY1RlbnNvcltdIHtcbiAgICBpZiAodGhpcy5pbmJvdW5kTm9kZXMubGVuZ3RoID4gMSkge1xuICAgICAgdGhyb3cgbmV3IEF0dHJpYnV0ZUVycm9yKFxuICAgICAgICAgIGBMYXllciAke3RoaXMubmFtZX1gICtcbiAgICAgICAgICAnIGhhcyBtdWx0aXBsZSBpbmJvdW5kIG5vZGVzLCAnICtcbiAgICAgICAgICAnaGVuY2UgdGhlIG5vdGlvbiBvZiBcImxheWVyIGlucHV0XCIgJyArXG4gICAgICAgICAgJ2lzIGlsbC1kZWZpbmVkLiAnICtcbiAgICAgICAgICAnVXNlIGBnZXRJbnB1dEF0KG5vZGVJbmRleClgIGluc3RlYWQuJyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmluYm91bmROb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBBdHRyaWJ1dGVFcnJvcihcbiAgICAgICAgICBgTGF5ZXIgJHt0aGlzLm5hbWV9YCArXG4gICAgICAgICAgJyBpcyBub3QgY29ubmVjdGVkLCBubyBpbnB1dCB0byByZXR1cm4uJyk7XG4gICAgfVxuICAgIHJldHVybiBnZW5lcmljX3V0aWxzLnNpbmdsZXRvbk9yQXJyYXkoXG4gICAgICAgIHRoaXMuZ2V0Tm9kZUF0SW5kZXgoMCwgJ2lucHV0JykuaW5wdXRUZW5zb3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgdGhlIG91dHB1dCB0ZW5zb3Iocykgb2YgYSBsYXllci5cbiAgICpcbiAgICogT25seSBhcHBsaWNhYmxlIGlmIHRoZSBsYXllciBoYXMgZXhhY3RseSBvbmUgaW5ib3VuZCBub2RlLFxuICAgKiBpLmUuIGlmIGl0IGlzIGNvbm5lY3RlZCB0byBvbmUgaW5jb21pbmcgbGF5ZXIuXG4gICAqXG4gICAqIEByZXR1cm4gT3V0cHV0IHRlbnNvciBvciBsaXN0IG9mIG91dHB1dCB0ZW5zb3JzLlxuICAgKlxuICAgKiBAZXhjZXB0aW9uIEF0dHJpYnV0ZUVycm9yIGlmIHRoZSBsYXllciBpcyBjb25uZWN0ZWQgdG8gbW9yZSB0aGFuIG9uZVxuICAgKiAgIGluY29taW5nIGxheWVycy5cbiAgICovXG4gIGdldCBvdXRwdXQoKTogU3ltYm9saWNUZW5zb3J8U3ltYm9saWNUZW5zb3JbXSB7XG4gICAgaWYgKHRoaXMuaW5ib3VuZE5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEF0dHJpYnV0ZUVycm9yKFxuICAgICAgICAgIGBMYXllciAke3RoaXMubmFtZX1gICtcbiAgICAgICAgICAnIGhhcyBubyBpbmJvdW5kIG5vZGVzLicpO1xuICAgIH1cbiAgICBpZiAodGhpcy5pbmJvdW5kTm9kZXMubGVuZ3RoID4gMSkge1xuICAgICAgdGhyb3cgbmV3IEF0dHJpYnV0ZUVycm9yKFxuICAgICAgICAgIGBMYXllciAke3RoaXMubmFtZX1gICtcbiAgICAgICAgICAnIGhhcyBtdWx0aXBsZSBpbmJvdW5kIG5vZGVzLCAnICtcbiAgICAgICAgICAnaGVuY2UgdGhlIG5vdGlvbiBvZiBcImxheWVyIG91dHB1dFwiICcgK1xuICAgICAgICAgICdpcyBpbGwtZGVmaW5lZC4gJyArXG4gICAgICAgICAgJ1VzZSBgZ2V0T3V0cHV0QXQobm9kZUluZGV4KWAgaW5zdGVhZC4nKTtcbiAgICB9XG4gICAgcmV0dXJuIGdlbmVyaWNfdXRpbHMuc2luZ2xldG9uT3JBcnJheShcbiAgICAgICAgdGhpcy5nZXROb2RlQXRJbmRleCgwLCAnb3V0cHV0Jykub3V0cHV0VGVuc29ycyk7XG4gIH1cblxuICBnZXQgbG9zc2VzKCk6IFJlZ3VsYXJpemVyRm5bXSB7XG4gICAgcmV0dXJuIHRoaXMuX2xvc3NlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgdGhlIExheWVyJ3MgY3VycmVudCBsb3NzIHZhbHVlcy5cbiAgICpcbiAgICogVXNlZCBmb3IgcmVndWxhcml6ZXJzIGR1cmluZyB0cmFpbmluZy5cbiAgICovXG4gIGNhbGN1bGF0ZUxvc3NlcygpOiBTY2FsYXJbXSB7XG4gICAgLy8gUG9ydGluZyBOb2RlOiBUaGlzIGlzIGFuIGF1Z21lbnRhdGlvbiB0byBMYXllci5sb3NzIGluIFB5S2VyYXMuXG4gICAgLy8gICBJbiBQeUtlcmFzLCBMYXllci5sb3NzIHJldHVybnMgc3ltYm9saWMgdGVuc29ycy4gSGVyZSBhIGNvbmNyZXRlXG4gICAgLy8gICBUZW5zb3IgKHNwZWNpZmljYWxseSBTY2FsYXIpIHZhbHVlcyBhcmUgcmV0dXJuZWQuIFRoaXMgaXMgZHVlIHRvIHRoZVxuICAgIC8vICAgaW1wZXJhdGl2ZSBiYWNrZW5kLlxuICAgIHJldHVybiB0aGlzLmxvc3Nlcy5tYXAobG9zc0ZuID0+IGxvc3NGbigpKTtcbiAgfVxuXG4gIGdldCB1cGRhdGVzKCk6IFRlbnNvcltdIHtcbiAgICByZXR1cm4gdGhpcy5fdXBkYXRlcztcbiAgfVxuXG4gIGdldCBidWlsdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYnVpbHQ7XG4gIH1cblxuICBzZXQgYnVpbHQoYnVpbHQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9idWlsdCA9IGJ1aWx0O1xuICB9XG5cbiAgZ2V0IHRyYWluYWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy50cmFpbmFibGVfO1xuICB9XG5cbiAgc2V0IHRyYWluYWJsZSh0cmFpbmFibGU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl90cmFpbmFibGVXZWlnaHRzLmZvckVhY2godyA9PiB3LnRyYWluYWJsZSA9IHRyYWluYWJsZSk7XG4gICAgdGhpcy50cmFpbmFibGVfID0gdHJhaW5hYmxlO1xuICB9XG5cbiAgZ2V0IHRyYWluYWJsZVdlaWdodHMoKTogTGF5ZXJWYXJpYWJsZVtdIHtcbiAgICBpZiAodGhpcy50cmFpbmFibGVfKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdHJhaW5hYmxlV2VpZ2h0cy5maWx0ZXIodyA9PiB3LnRyYWluYWJsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gIH1cblxuICBzZXQgdHJhaW5hYmxlV2VpZ2h0cyh3ZWlnaHRzOiBMYXllclZhcmlhYmxlW10pIHtcbiAgICB0aGlzLl90cmFpbmFibGVXZWlnaHRzID0gd2VpZ2h0cztcbiAgfVxuXG4gIGdldCBub25UcmFpbmFibGVXZWlnaHRzKCk6IExheWVyVmFyaWFibGVbXSB7XG4gICAgaWYgKHRoaXMudHJhaW5hYmxlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdHJhaW5hYmxlV2VpZ2h0cy5maWx0ZXIodyA9PiAhdy50cmFpbmFibGUpXG4gICAgICAgICAgLmNvbmNhdCh0aGlzLl9ub25UcmFpbmFibGVXZWlnaHRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX3RyYWluYWJsZVdlaWdodHMuY29uY2F0KHRoaXMuX25vblRyYWluYWJsZVdlaWdodHMpO1xuICAgIH1cbiAgfVxuXG4gIHNldCBub25UcmFpbmFibGVXZWlnaHRzKHdlaWdodHM6IExheWVyVmFyaWFibGVbXSkge1xuICAgIHRoaXMuX25vblRyYWluYWJsZVdlaWdodHMgPSB3ZWlnaHRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjb25jYXRlbmF0aW9uIG9mIHRoZSBsaXN0cyB0cmFpbmFibGVXZWlnaHRzIGFuZCBub25UcmFpbmFibGVXZWlnaHRzXG4gICAqIChpbiB0aGlzIG9yZGVyKS5cbiAgICovXG4gIGdldCB3ZWlnaHRzKCk6IExheWVyVmFyaWFibGVbXSB7XG4gICAgcmV0dXJuIHRoaXMudHJhaW5hYmxlV2VpZ2h0cy5jb25jYXQodGhpcy5ub25UcmFpbmFibGVXZWlnaHRzKTtcbiAgfVxuXG4gIGdldCBzdGF0ZWZ1bCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGVmdWw7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgdGhlIHN0YXRlcyBvZiB0aGUgbGF5ZXIuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIG9mIHRoZSBiYXNlIExheWVyIGNsYXNzIGlzIGVzc2VudGlhbGx5IGEgbm8tb3AuXG4gICAqIFN1YmNsYXNzZXMgdGhhdCBhcmUgc3RhdGVmdWwgKGUuZy4sIHN0YXRlZnVsIFJOTnMpIHNob3VsZCBvdmVycmlkZSB0aGlzXG4gICAqIG1ldGhvZC5cbiAgICovXG4gIHJlc2V0U3RhdGVzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zdGF0ZWZ1bCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgY2FsbCB0aGUgcmVzZXRTdGF0ZXMoKSBtZXRob2Qgb2YgYSBub24tc3RhdGVmdWwgTGF5ZXIgJyArXG4gICAgICAgICAgJ29iamVjdC4nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGNvbXBhdGliaWxpdHkgYmV0d2VlbiB0aGUgbGF5ZXIgYW5kIHByb3ZpZGVkIGlucHV0cy5cbiAgICpcbiAgICogVGhpcyBjaGVja3MgdGhhdCB0aGUgdGVuc29yKHMpIGBpbnB1dGBcbiAgICogdmVyaWZ5IHRoZSBpbnB1dCBhc3N1bXB0aW9ucyBvZiB0aGUgbGF5ZXJcbiAgICogKGlmIGFueSkuIElmIG5vdCwgZXhjZXB0aW9ucyBhcmUgcmFpc2VkLlxuICAgKlxuICAgKiBAcGFyYW0gaW5wdXRzIElucHV0IHRlbnNvciBvciBsaXN0IG9mIGlucHV0IHRlbnNvcnMuXG4gICAqXG4gICAqIEBleGNlcHRpb24gVmFsdWVFcnJvciBpbiBjYXNlIG9mIG1pc21hdGNoIGJldHdlZW5cbiAgICogICB0aGUgcHJvdmlkZWQgaW5wdXRzIGFuZCB0aGUgZXhwZWN0YXRpb25zIG9mIHRoZSBsYXllci5cbiAgICovXG4gIHByb3RlY3RlZCBhc3NlcnRJbnB1dENvbXBhdGliaWxpdHkoaW5wdXRzOiBUZW5zb3J8VGVuc29yW118U3ltYm9saWNUZW5zb3J8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3ltYm9saWNUZW5zb3JbXSk6IHZvaWQge1xuICAgIGlucHV0cyA9IGdlbmVyaWNfdXRpbHMudG9MaXN0KGlucHV0cyk7XG4gICAgaWYgKHRoaXMuaW5wdXRTcGVjID09IG51bGwgfHwgdGhpcy5pbnB1dFNwZWMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlucHV0U3BlYyA9IGdlbmVyaWNfdXRpbHMudG9MaXN0KHRoaXMuaW5wdXRTcGVjKTtcbiAgICBpZiAoaW5wdXRzLmxlbmd0aCAhPT0gaW5wdXRTcGVjLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IFZhbHVlRXJyb3IoXG4gICAgICAgICAgYExheWVyICR7dGhpcy5uYW1lfSBleHBlY3RzICR7aW5wdXRTcGVjLmxlbmd0aH0gaW5wdXRzLCBgICtcbiAgICAgICAgICBgYnV0IGl0IHJlY2VpdmVkICR7aW5wdXRzLmxlbmd0aH0gaW5wdXQgdGVuc29ycy4gYCArXG4gICAgICAgICAgYElucHV0IHJlY2VpdmVkOiAke2lucHV0c31gKTtcbiAgICB9XG4gICAgZm9yIChsZXQgaW5wdXRJbmRleCA9IDA7IGlucHV0SW5kZXggPCBpbnB1dHMubGVuZ3RoOyBpbnB1dEluZGV4KyspIHtcbiAgICAgIGNvbnN0IHggPSBpbnB1dHNbaW5wdXRJbmRleF07XG4gICAgICBjb25zdCBzcGVjOiBJbnB1dFNwZWMgPSBpbnB1dFNwZWNbaW5wdXRJbmRleF07XG4gICAgICBpZiAoc3BlYyA9PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBuZGltLlxuICAgICAgY29uc3QgbmRpbSA9IHgucmFuaztcbiAgICAgIGlmIChzcGVjLm5kaW0gIT0gbnVsbCkge1xuICAgICAgICBpZiAobmRpbSAhPT0gc3BlYy5uZGltKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFZhbHVlRXJyb3IoXG4gICAgICAgICAgICAgIGBJbnB1dCAke2lucHV0SW5kZXh9IGlzIGluY29tcGF0aWJsZSB3aXRoIGxheWVyICR7dGhpcy5uYW1lfTogYCArXG4gICAgICAgICAgICAgIGBleHBlY3RlZCBuZGltPSR7c3BlYy5uZGltfSwgZm91bmQgbmRpbT0ke25kaW19YCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzcGVjLm1heE5EaW0gIT0gbnVsbCkge1xuICAgICAgICBpZiAobmRpbSA+IHNwZWMubWF4TkRpbSkge1xuICAgICAgICAgIHRocm93IG5ldyBWYWx1ZUVycm9yKFxuICAgICAgICAgICAgICBgSW5wdXQgJHtpbnB1dEluZGV4fSBpcyBpbmNvbXBhdGlibGUgd2l0aCBsYXllciAke3RoaXMubmFtZX1gICtcbiAgICAgICAgICAgICAgYDogZXhwZWN0ZWQgbWF4X25kaW09JHtzcGVjLm1heE5EaW19LCBmb3VuZCBuZGltPSR7bmRpbX1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHNwZWMubWluTkRpbSAhPSBudWxsKSB7XG4gICAgICAgIGlmIChuZGltIDwgc3BlYy5taW5ORGltKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFZhbHVlRXJyb3IoXG4gICAgICAgICAgICAgIGBJbnB1dCAke2lucHV0SW5kZXh9IGlzIGluY29tcGF0aWJsZSB3aXRoIGxheWVyICR7dGhpcy5uYW1lfWAgK1xuICAgICAgICAgICAgICBgOiBleHBlY3RlZCBtaW5fbmRpbT0ke3NwZWMubWluTkRpbX0sIGZvdW5kIG5kaW09JHtuZGltfS5gKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBkdHlwZS5cbiAgICAgIGlmIChzcGVjLmR0eXBlICE9IG51bGwpIHtcbiAgICAgICAgaWYgKHguZHR5cGUgIT09IHNwZWMuZHR5cGUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVmFsdWVFcnJvcihcbiAgICAgICAgICAgICAgYElucHV0ICR7aW5wdXRJbmRleH0gaXMgaW5jb21wYXRpYmxlIHdpdGggbGF5ZXIgJHt0aGlzLm5hbWV9IGAgK1xuICAgICAgICAgICAgICBgOiBleHBlY3RlZCBkdHlwZT0ke3NwZWMuZHR5cGV9LCBmb3VuZCBkdHlwZT0ke3guZHR5cGV9LmApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIHNwZWNpZmljIHNoYXBlIGF4ZXMuXG4gICAgICBpZiAoc3BlYy5heGVzKSB7XG4gICAgICAgIGNvbnN0IHhTaGFwZSA9IHguc2hhcGU7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHNwZWMuYXhlcykge1xuICAgICAgICAgIGNvbnN0IGF4aXMgPSBOdW1iZXIoa2V5KTtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHNwZWMuYXhlc1trZXldO1xuICAgICAgICAgIC8vIFBlcmZvcm0gUHl0aG9uLXN0eWxlIHNsaWNpbmcgaW4gY2FzZSBheGlzIDwgMDtcbiAgICAgICAgICAvLyBUT0RPKGNhaXMpOiBVc2UgaHR0cHM6Ly9naXRodWIuY29tL2Fsdml2aS90eXBlc2NyaXB0LXVuZGVyc2NvcmUgdG9cbiAgICAgICAgICAvLyBlbnN1cmUgdHlwZSBzYWZldHkgdGhyb3VnaCBVbmRlcnNjb3JlIGNhbGxzLlxuICAgICAgICAgIGNvbnN0IHhTaGFwZUF0QXhpcyA9XG4gICAgICAgICAgICAgIGF4aXMgPj0gMCA/IHhTaGFwZVtheGlzXSA6IHhTaGFwZVt4U2hhcGUubGVuZ3RoICsgYXhpc107XG4gICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwgJiYgW3ZhbHVlLCBudWxsXS5pbmRleE9mKHhTaGFwZUF0QXhpcykgPT09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVmFsdWVFcnJvcihcbiAgICAgICAgICAgICAgICBgSW5wdXQgJHtpbnB1dEluZGV4fSBpcyBpbmNvbXBhdGlibGUgd2l0aCBsYXllciBgICtcbiAgICAgICAgICAgICAgICBgJHt0aGlzLm5hbWV9OiBleHBlY3RlZCBheGlzICR7YXhpc30gb2YgaW5wdXQgc2hhcGUgdG8gYCArXG4gICAgICAgICAgICAgICAgYGhhdmUgdmFsdWUgJHt2YWx1ZX0gYnV0IGdvdCBzaGFwZSAke3hTaGFwZX0uYCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIHNoYXBlLlxuICAgICAgaWYgKHNwZWMuc2hhcGUgIT0gbnVsbCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNwZWMuc2hhcGUubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBjb25zdCBzcGVjRGltID0gc3BlYy5zaGFwZVtpXTtcbiAgICAgICAgICBjb25zdCBkaW0gPSB4LnNoYXBlW2ldO1xuICAgICAgICAgIGlmIChzcGVjRGltICE9IG51bGwgJiYgZGltICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChzcGVjRGltICE9PSBkaW0pIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IFZhbHVlRXJyb3IoXG4gICAgICAgICAgICAgICAgICBgSW5wdXQgJHtpbnB1dEluZGV4fSBpcyBpbmNvbXBhdGlibGUgd2l0aCBsYXllciBgICtcbiAgICAgICAgICAgICAgICAgIGAke3RoaXMubmFtZX06IGV4cGVjdGVkIHNoYXBlPSR7c3BlYy5zaGFwZX0sIGAgK1xuICAgICAgICAgICAgICAgICAgYGZvdW5kIHNoYXBlPSR7eC5zaGFwZX0uYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgd2hlcmUgdGhlIGxheWVyJ3MgbG9naWMgbGl2ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBpbnB1dHMgSW5wdXQgdGVuc29yLCBvciBsaXN0L3R1cGxlIG9mIGlucHV0IHRlbnNvcnMuXG4gICAqIEBwYXJhbSBrd2FyZ3MgQWRkaXRpb25hbCBrZXl3b3JkIGFyZ3VtZW50cy5cbiAgICpcbiAgICogQHJldHVybiBBIHRlbnNvciBvciBsaXN0L3R1cGxlIG9mIHRlbnNvcnMuXG4gICAqL1xuICBjYWxsKGlucHV0czogVGVuc29yfFRlbnNvcltdLCBrd2FyZ3M6IEt3YXJncyk6IFRlbnNvcnxUZW5zb3JbXSB7XG4gICAgcmV0dXJuIGlucHV0cztcbiAgfVxuXG4gIHByb3RlY3RlZCBpbnZva2VDYWxsSG9vayhpbnB1dHM6IFRlbnNvcnxUZW5zb3JbXSwga3dhcmdzOiBLd2FyZ3MpIHtcbiAgICBpZiAodGhpcy5fY2FsbEhvb2sgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fY2FsbEhvb2soaW5wdXRzLCBrd2FyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgY2FsbCBob29rLlxuICAgKiBUaGlzIGlzIGN1cnJlbnRseSB1c2VkIGZvciB0ZXN0aW5nIG9ubHkuXG4gICAqIEBwYXJhbSBjYWxsSG9va1xuICAgKi9cbiAgc2V0Q2FsbEhvb2soY2FsbEhvb2s6IENhbGxIb29rKSB7XG4gICAgdGhpcy5fY2FsbEhvb2sgPSBjYWxsSG9vaztcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhciBjYWxsIGhvb2suXG4gICAqIFRoaXMgaXMgY3VycmVudGx5IHVzZWQgZm9yIHRlc3Rpbmcgb25seS5cbiAgICovXG4gIGNsZWFyQ2FsbEhvb2soKSB7XG4gICAgdGhpcy5fY2FsbEhvb2sgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkcyBvciBleGVjdXRlcyBhIGBMYXllcmAncyBsb2dpYy5cbiAgICpcbiAgICogV2hlbiBjYWxsZWQgd2l0aCBgdGYuVGVuc29yYChzKSwgZXhlY3V0ZSB0aGUgYExheWVyYCdzIGNvbXB1dGF0aW9uIGFuZFxuICAgKiByZXR1cm4gVGVuc29yKHMpLiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogYGBganNcbiAgICogY29uc3QgZGVuc2VMYXllciA9IHRmLmxheWVycy5kZW5zZSh7XG4gICAqICAgdW5pdHM6IDEsXG4gICAqICAga2VybmVsSW5pdGlhbGl6ZXI6ICd6ZXJvcycsXG4gICAqICAgdXNlQmlhczogZmFsc2VcbiAgICogfSk7XG4gICAqXG4gICAqIC8vIEludm9rZSB0aGUgbGF5ZXIncyBhcHBseSgpIG1ldGhvZCB3aXRoIGEgYHRmLlRlbnNvcmAgKHdpdGggY29uY3JldGVcbiAgICogLy8gbnVtZXJpYyB2YWx1ZXMpLlxuICAgKiBjb25zdCBpbnB1dCA9IHRmLm9uZXMoWzIsIDJdKTtcbiAgICogY29uc3Qgb3V0cHV0ID0gZGVuc2VMYXllci5hcHBseShpbnB1dCk7XG4gICAqXG4gICAqIC8vIFRoZSBvdXRwdXQncyB2YWx1ZSBpcyBleHBlY3RlZCB0byBiZSBbWzBdLCBbMF1dLCBkdWUgdG8gdGhlIGZhY3QgdGhhdFxuICAgKiAvLyB0aGUgZGVuc2UgbGF5ZXIgaGFzIGEga2VybmVsIGluaXRpYWxpemVkIHRvIGFsbC16ZXJvcyBhbmQgZG9lcyBub3QgaGF2ZVxuICAgKiAvLyBhIGJpYXMuXG4gICAqIG91dHB1dC5wcmludCgpO1xuICAgKiBgYGBcbiAgICpcbiAgICogV2hlbiBjYWxsZWQgd2l0aCBgdGYuU3ltYm9saWNUZW5zb3JgKHMpLCB0aGlzIHdpbGwgcHJlcGFyZSB0aGUgbGF5ZXIgZm9yXG4gICAqIGZ1dHVyZSBleGVjdXRpb24uICBUaGlzIGVudGFpbHMgaW50ZXJuYWwgYm9vay1rZWVwaW5nIG9uIHNoYXBlcyBvZlxuICAgKiBleHBlY3RlZCBUZW5zb3JzLCB3aXJpbmcgbGF5ZXJzIHRvZ2V0aGVyLCBhbmQgaW5pdGlhbGl6aW5nIHdlaWdodHMuXG4gICAqXG4gICAqIENhbGxpbmcgYGFwcGx5YCB3aXRoIGB0Zi5TeW1ib2xpY1RlbnNvcmBzIGFyZSB0eXBpY2FsbHkgdXNlZCBkdXJpbmcgdGhlXG4gICAqIGJ1aWxkaW5nIG9mIG5vbi1gdGYuU2VxdWVudGlhbGAgbW9kZWxzLiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogYGBganNcbiAgICogY29uc3QgZmxhdHRlbkxheWVyID0gdGYubGF5ZXJzLmZsYXR0ZW4oKTtcbiAgICogY29uc3QgZGVuc2VMYXllciA9IHRmLmxheWVycy5kZW5zZSh7dW5pdHM6IDF9KTtcbiAgICpcbiAgICogLy8gVXNlIHRmLmxheWVycy5pbnB1dCgpIHRvIG9idGFpbiBhIFN5bWJvbGljVGVuc29yIGFzIGlucHV0IHRvIGFwcGx5KCkuXG4gICAqIGNvbnN0IGlucHV0ID0gdGYuaW5wdXQoe3NoYXBlOiBbMiwgMl19KTtcbiAgICogY29uc3Qgb3V0cHV0MSA9IGZsYXR0ZW5MYXllci5hcHBseShpbnB1dCk7XG4gICAqXG4gICAqIC8vIG91dHB1dDEuc2hhcGUgaXMgW251bGwsIDRdLiBUaGUgZmlyc3QgZGltZW5zaW9uIGlzIHRoZSB1bmRldGVybWluZWRcbiAgICogLy8gYmF0Y2ggc2l6ZS4gVGhlIHNlY29uZCBkaW1lbnNpb24gY29tZXMgZnJvbSBmbGF0dGVuaW5nIHRoZSBbMiwgMl1cbiAgICogLy8gc2hhcGUuXG4gICAqIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KG91dHB1dDEuc2hhcGUpKTtcbiAgICpcbiAgICogLy8gVGhlIG91dHB1dCBTeW1ib2xpY1RlbnNvciBvZiB0aGUgZmxhdHRlbiBsYXllciBjYW4gYmUgdXNlZCB0byBjYWxsXG4gICAqIC8vIHRoZSBhcHBseSgpIG9mIHRoZSBkZW5zZSBsYXllcjpcbiAgICogY29uc3Qgb3V0cHV0MiA9IGRlbnNlTGF5ZXIuYXBwbHkob3V0cHV0MSk7XG4gICAqXG4gICAqIC8vIG91dHB1dDIuc2hhcGUgaXMgW251bGwsIDFdLiBUaGUgZmlyc3QgZGltZW5zaW9uIGlzIHRoZSB1bmRldGVybWluZWRcbiAgICogLy8gYmF0Y2ggc2l6ZS4gVGhlIHNlY29uZCBkaW1lbnNpb24gbWF0Y2hlcyB0aGUgbnVtYmVyIG9mIHVuaXRzIG9mIHRoZVxuICAgKiAvLyBkZW5zZSBsYXllci5cbiAgICogY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkob3V0cHV0Mi5zaGFwZSkpO1xuICAgKlxuICAgKiAvLyBUaGUgaW5wdXQgYW5kIG91dHB1dCBjYW4gYmUgdXNlZCB0byBjb25zdHJ1Y3QgYSBtb2RlbCB0aGF0IGNvbnNpc3RzXG4gICAqIC8vIG9mIHRoZSBmbGF0dGVuIGFuZCBkZW5zZSBsYXllcnMuXG4gICAqIGNvbnN0IG1vZGVsID0gdGYubW9kZWwoe2lucHV0czogaW5wdXQsIG91dHB1dHM6IG91dHB1dDJ9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSBpbnB1dHMgYSBgdGYuVGVuc29yYCBvciBgdGYuU3ltYm9saWNUZW5zb3JgIG9yIGFuIEFycmF5IG9mIHRoZW0uXG4gICAqIEBwYXJhbSBrd2FyZ3MgQWRkaXRpb25hbCBrZXl3b3JkIGFyZ3VtZW50cyB0byBiZSBwYXNzZWQgdG8gYGNhbGwoKWAuXG4gICAqXG4gICAqIEByZXR1cm4gT3V0cHV0IG9mIHRoZSBsYXllcidzIGBjYWxsYCBtZXRob2QuXG4gICAqXG4gICAqIEBleGNlcHRpb24gVmFsdWVFcnJvciBlcnJvciBpbiBjYXNlIHRoZSBsYXllciBpcyBtaXNzaW5nIHNoYXBlIGluZm9ybWF0aW9uXG4gICAqICAgZm9yIGl0cyBgYnVpbGRgIGNhbGwuXG4gICAqXG4gICAqIEBkb2Mge2hlYWRpbmc6ICdNb2RlbHMnLCAnc3ViaGVhZGluZyc6ICdDbGFzc2VzJ31cbiAgICovXG4gIC8vIFBvcnRpbmcgTm90ZTogVGhpcyBpcyBhIHJlcGxhY2VtZW50IGZvciBfX2NhbGxfXygpIGluIFB5dGhvbi5cbiAgYXBwbHkoXG4gICAgICBpbnB1dHM6IFRlbnNvcnxUZW5zb3JbXXxTeW1ib2xpY1RlbnNvcnxTeW1ib2xpY1RlbnNvcltdLFxuICAgICAga3dhcmdzPzogS3dhcmdzKTogVGVuc29yfFRlbnNvcltdfFN5bWJvbGljVGVuc29yfFN5bWJvbGljVGVuc29yW10ge1xuICAgIGt3YXJncyA9IGt3YXJncyB8fCB7fTtcblxuICAgIHRoaXMuYXNzZXJ0Tm90RGlzcG9zZWQoKTtcblxuICAgIC8vIEVuc3VyZSBpbnB1dHMgYXJlIGFsbCB0aGUgc2FtZSB0eXBlLlxuICAgIGNvbnN0IGlucHV0c0xpc3QgPSBnZW5lcmljX3V0aWxzLnRvTGlzdChpbnB1dHMpO1xuXG4gICAgbGV0IGFsbEFyZVN5bWJvbGljID0gdHJ1ZTtcbiAgICBmb3IgKGNvbnN0IGlucHV0IG9mIGlucHV0c0xpc3QpIHtcbiAgICAgIGlmICghKGlucHV0IGluc3RhbmNlb2YgU3ltYm9saWNUZW5zb3IpKSB7XG4gICAgICAgIGFsbEFyZVN5bWJvbGljID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgbm9uZUFyZVN5bWJvbGljID0gdHJ1ZTtcbiAgICBmb3IgKGNvbnN0IGlucHV0IG9mIGlucHV0c0xpc3QpIHtcbiAgICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIFN5bWJvbGljVGVuc29yKSB7XG4gICAgICAgIG5vbmVBcmVTeW1ib2xpYyA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYWxsQXJlU3ltYm9saWMgPT09IG5vbmVBcmVTeW1ib2xpYykge1xuICAgICAgdGhyb3cgbmV3IFZhbHVlRXJyb3IoXG4gICAgICAgICAgJ0FyZ3VtZW50cyB0byBhcHBseSgpIG11c3QgYmUgYWxsICcgK1xuICAgICAgICAgICdTeW1ib2xpY1RlbnNvcnMgb3IgYWxsIFRlbnNvcnMnKTtcbiAgICB9XG5cbiAgICAvLyBUT0RPKG1pY2hhZWx0ZXJyeSk6IG5hbWVTY29wZSgpIG1heSBub3QgYmUgbmVjZXNzYXJ5LlxuICAgIHJldHVybiBuYW1lU2NvcGUodGhpcy5uYW1lLCAoKSA9PiB7XG4gICAgICAvLyBIYW5kbGUgbGF5aW5nIGJ1aWxkaW5nICh3ZWlnaHQgY3JlYXRpbmcsIGlucHV0IHNwZWMgbG9ja2luZykuXG4gICAgICBpZiAoIXRoaXMuYnVpbHQpIHtcbiAgICAgICAgLypcbiAgICAgICAgICBUaHJvdyBleGNlcHRpb25zIGluIGNhc2UgdGhlIGlucHV0IGlzIG5vdCBjb21wYXRpYmxlXG4gICAgICAgICAgd2l0aCB0aGUgaW5wdXRTcGVjIHNwZWNpZmllZCBpbiB0aGUgbGF5ZXIgY29uc3RydWN0b3IuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmFzc2VydElucHV0Q29tcGF0aWJpbGl0eShpbnB1dHMpO1xuXG4gICAgICAgIC8vIENvbGxlY3QgaW5wdXQgc2hhcGVzIHRvIGJ1aWxkIGxheWVyLlxuICAgICAgICBjb25zdCBpbnB1dFNoYXBlczogU2hhcGVbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHhFbGVtIG9mIGdlbmVyaWNfdXRpbHMudG9MaXN0KGlucHV0cykpIHtcbiAgICAgICAgICBpbnB1dFNoYXBlcy5wdXNoKHhFbGVtLnNoYXBlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJ1aWxkKGdlbmVyaWNfdXRpbHMuc2luZ2xldG9uT3JBcnJheShpbnB1dFNoYXBlcykpO1xuICAgICAgICB0aGlzLmJ1aWx0ID0gdHJ1ZTtcblxuICAgICAgICAvLyBMb2FkIHdlaWdodHMgdGhhdCB3ZXJlIHNwZWNpZmllZCBhdCBsYXllciBpbnN0YW50aWF0aW9uLlxuICAgICAgICBpZiAodGhpcy5pbml0aWFsV2VpZ2h0cykge1xuICAgICAgICAgIHRoaXMuc2V0V2VpZ2h0cyh0aGlzLmluaXRpYWxXZWlnaHRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9yZWZDb3VudCA9PT0gbnVsbCAmJiBub25lQXJlU3ltYm9saWMpIHtcbiAgICAgICAgICAvLyBUaGUgZmlyc3QgdXNlIG9mIHRoaXMgbGF5ZXIgaXMgYSBub24tc3ltYm9saWMgY2FsbCwgc2V0IHJlZiBjb3VudFxuICAgICAgICAgIC8vIHRvIDEgc28gdGhlIExheWVyIGNhbiBiZSBwcm9wZXJseSBkaXNwb3NlZCBpZiBpdHMgZGlzcG9zZSgpIG1ldGhvZFxuICAgICAgICAgIC8vIGlzIGNhbGxlZC5cbiAgICAgICAgICB0aGlzLl9yZWZDb3VudCA9IDE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICAgVGhyb3cgZXhjZXB0aW9ucyBpbiBjYXNlIHRoZSBpbnB1dCBpcyBub3QgY29tcGF0aWJsZVxuICAgICAgICB3aXRoIHRoZSBpbnB1dFNwZWMgc2V0IGF0IGJ1aWxkIHRpbWUuXG4gICAgICAqL1xuICAgICAgdGhpcy5hc3NlcnRJbnB1dENvbXBhdGliaWxpdHkoaW5wdXRzKTtcblxuICAgICAgLy8gSGFuZGxlIG1hc2sgcHJvcGFnYXRpb24uXG4gICAgICAvLyBUT0RPKG1pY2hhZWx0ZXJyeSk6IE1hc2sgcHJvcGFnYXRpb24gbm90IGN1cnJlbnRseSBpbXBsZW1lbnRlZC5cblxuICAgICAgLy8gQWN0dWFsbHkgY2FsbCB0aGUgbGF5ZXIsIGNvbGxlY3Rpbmcgb3V0cHV0KHMpLCBtYXNrKHMpLCBhbmQgc2hhcGUocykuXG4gICAgICBpZiAobm9uZUFyZVN5bWJvbGljKSB7XG4gICAgICAgIGxldCBvdXRwdXQgPSB0aGlzLmNhbGwoaW5wdXRzIGFzIFRlbnNvciB8IFRlbnNvcltdLCBrd2FyZ3MpO1xuICAgICAgICAvLyBUT0RPKG1pY2hhZWx0ZXJyeSk6IENvbXB1dGUgdGhlIG91dHB1dE1hc2tcblxuICAgICAgICAvLyBJZiB0aGUgbGF5ZXIgcmV0dXJucyB0ZW5zb3JzIGZyb20gaXRzIGlucHV0cywgdW5tb2RpZmllZCxcbiAgICAgICAgLy8gd2UgY29weSB0aGVtIHRvIGF2b2lkIGxvc3Mgb2YgdGVuc29yIG1ldGFkYXRhLlxuICAgICAgICBjb25zdCBvdXRwdXRMaXN0OiBUZW5zb3JbXSA9IGdlbmVyaWNfdXRpbHMudG9MaXN0KG91dHB1dCk7XG4gICAgICAgIGNvbnN0IG91dHB1dExpc3RDb3B5OiBUZW5zb3JbXSA9IFtdO1xuICAgICAgICAvLyBUT0RPKG1pY2hhZWx0ZXJyeSk6IFRoaXMgY29weWluZyBtYXkgbm90IGJlIG5lY2Vzc2FyeSBnaXZlbiBvdXIgZWFnZXJcbiAgICAgICAgLy8gYmFja2VuZC5cbiAgICAgICAgZm9yIChsZXQgeCBvZiBvdXRwdXRMaXN0KSB7XG4gICAgICAgICAgaWYgKGlucHV0c0xpc3QuaW5kZXhPZih4KSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHggPSB4LmNsb25lKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG91dHB1dExpc3RDb3B5LnB1c2goeCk7XG4gICAgICAgIH1cbiAgICAgICAgb3V0cHV0ID0gZ2VuZXJpY191dGlscy5zaW5nbGV0b25PckFycmF5KG91dHB1dExpc3RDb3B5KTtcblxuICAgICAgICBpZiAodGhpcy5hY3Rpdml0eVJlZ3VsYXJpemVyICE9IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFcnJvcihcbiAgICAgICAgICAgICAgJ0xheWVyIGludm9jYXRpb24gaW4gdGhlIHByZXNlbmNlIG9mIGFjdGl2aXR5ICcgK1xuICAgICAgICAgICAgICAncmVndWxhcml6ZXIocykgaXMgbm90IHN1cHBvcnRlZCB5ZXQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT0RPKG1pY2hhZWx0ZXJyeSk6IENhbGwgYWRkSW5ib3VuZE5vZGUoKT9cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGlucHV0U2hhcGUgPSBjb2xsZWN0SW5wdXRTaGFwZShpbnB1dHMpO1xuICAgICAgICBjb25zdCBvdXRwdXRTaGFwZSA9IHRoaXMuY29tcHV0ZU91dHB1dFNoYXBlKGlucHV0U2hhcGUpO1xuICAgICAgICBsZXQgb3V0cHV0OiBTeW1ib2xpY1RlbnNvcnxTeW1ib2xpY1RlbnNvcltdO1xuICAgICAgICBjb25zdCBvdXRwdXREVHlwZSA9IGd1ZXNzT3V0cHV0RFR5cGUoaW5wdXRzKTtcbiAgICAgICAgdGhpcy53YXJuT25JbmNvbXBhdGlibGVJbnB1dFNoYXBlKFxuICAgICAgICAgICAgQXJyYXkuaXNBcnJheShpbnB1dHMpID8gaW5wdXRTaGFwZVswXSBhcyBTaGFwZSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dFNoYXBlIGFzIFNoYXBlKTtcblxuICAgICAgICBpZiAob3V0cHV0U2hhcGUgIT0gbnVsbCAmJiBvdXRwdXRTaGFwZS5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICBBcnJheS5pc0FycmF5KG91dHB1dFNoYXBlWzBdKSkge1xuICAgICAgICAgIC8vIFdlIGhhdmUgbXVsdGlwbGUgb3V0cHV0IHNoYXBlcy4gQ3JlYXRlIG11bHRpcGxlIG91dHB1dCB0ZW5zb3JzLlxuICAgICAgICAgIG91dHB1dCA9IChvdXRwdXRTaGFwZSBhcyBTaGFwZVtdKVxuICAgICAgICAgICAgICAgICAgICAgICAubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNoYXBlLCBpbmRleCkgPT4gbmV3IFN5bWJvbGljVGVuc29yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dERUeXBlLCBzaGFwZSwgdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmljX3V0aWxzLnRvTGlzdChpbnB1dHMpLCBrd2FyZ3MsIHRoaXMubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG91dHB1dCA9IG5ldyBTeW1ib2xpY1RlbnNvcihcbiAgICAgICAgICAgICAgb3V0cHV0RFR5cGUsIG91dHB1dFNoYXBlIGFzIFNoYXBlLCB0aGlzLFxuICAgICAgICAgICAgICBnZW5lcmljX3V0aWxzLnRvTGlzdChpbnB1dHMpLCBrd2FyZ3MsIHRoaXMubmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgIEFkZCBhbiBpbmJvdW5kIG5vZGUgdG8gdGhlIGxheWVyLCBzbyB0aGF0IGl0IGtlZXBzIHRyYWNrXG4gICAgICAgICAgb2YgdGhlIGNhbGwgYW5kIG9mIGFsbCBuZXcgdmFyaWFibGVzIGNyZWF0ZWQgZHVyaW5nIHRoZSBjYWxsLlxuICAgICAgICAgIFRoaXMgYWxzbyB1cGRhdGVzIHRoZSBsYXllciBoaXN0b3J5IG9mIHRoZSBvdXRwdXQgdGVuc29yKHMpLlxuICAgICAgICAgIElmIHRoZSBpbnB1dCB0ZW5zb3IocykgaGFkIG5vIHByZXZpb3VzIGhpc3RvcnksXG4gICAgICAgICAgdGhpcyBkb2VzIG5vdGhpbmcuXG4gICAgICAgICovXG4gICAgICAgIHRoaXMuYWRkSW5ib3VuZE5vZGUoXG4gICAgICAgICAgICBpbnB1dHMgYXMgU3ltYm9saWNUZW5zb3IgfCBTeW1ib2xpY1RlbnNvcltdLCBvdXRwdXQsIG51bGwsIG51bGwsXG4gICAgICAgICAgICBpbnB1dFNoYXBlLCBvdXRwdXRTaGFwZSwga3dhcmdzKTtcbiAgICAgICAgdGhpcy5fcmVmQ291bnQrKztcblxuICAgICAgICBpZiAodGhpcy5hY3Rpdml0eVJlZ3VsYXJpemVyICE9IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFcnJvcihcbiAgICAgICAgICAgICAgJ0xheWVyIGludm9jYXRpb24gaW4gdGhlIHByZXNlbmNlIG9mIGFjdGl2aXR5ICcgK1xuICAgICAgICAgICAgICAncmVndWxhcml6ZXIocykgaXMgbm90IHN1cHBvcnRlZCB5ZXQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGNvbXBhdGliaWxpdHkgYmV0d2VlbiBpbnB1dCBzaGFwZSBhbmQgdGhpcyBsYXllcidzIGJhdGNoSW5wdXRTaGFwZS5cbiAgICpcbiAgICogUHJpbnQgd2FybmluZyBpZiBhbnkgaW5jb21wYXRpYmlsaXR5IGlzIGZvdW5kLlxuICAgKlxuICAgKiBAcGFyYW0gaW5wdXRTaGFwZSBJbnB1dCBzaGFwZSB0byBiZSBjaGVja2VkLlxuICAgKi9cbiAgcHJvdGVjdGVkIHdhcm5PbkluY29tcGF0aWJsZUlucHV0U2hhcGUoaW5wdXRTaGFwZTogU2hhcGUpIHtcbiAgICBpZiAodGhpcy5iYXRjaElucHV0U2hhcGUgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRTaGFwZS5sZW5ndGggIT09IHRoaXMuYmF0Y2hJbnB1dFNoYXBlLmxlbmd0aCkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgIGBUaGUgcmFuayBvZiB0aGUgaW5wdXQgdGVuc29yIHByb3ZpZGVkIChzaGFwZTogYCArXG4gICAgICAgICAgYCR7SlNPTi5zdHJpbmdpZnkoaW5wdXRTaGFwZSl9KSBkb2VzIG5vdCBtYXRjaCB0aGF0IG9mIHRoZSBgICtcbiAgICAgICAgICBgYmF0Y2hJbnB1dFNoYXBlICgke0pTT04uc3RyaW5naWZ5KHRoaXMuYmF0Y2hJbnB1dFNoYXBlKX0pIGAgK1xuICAgICAgICAgIGBvZiB0aGUgbGF5ZXIgJHt0aGlzLm5hbWV9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBkaW1NaXNtYXRjaCA9IGZhbHNlO1xuICAgICAgdGhpcy5iYXRjaElucHV0U2hhcGUuZm9yRWFjaCgoZGltZW5zaW9uLCBpKSA9PiB7XG4gICAgICAgIGlmIChkaW1lbnNpb24gIT0gbnVsbCAmJiBpbnB1dFNoYXBlW2ldICE9IG51bGwgJiZcbiAgICAgICAgICAgIGlucHV0U2hhcGVbaV0gIT09IGRpbWVuc2lvbikge1xuICAgICAgICAgIGRpbU1pc21hdGNoID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoZGltTWlzbWF0Y2gpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgYFRoZSBzaGFwZSBvZiB0aGUgaW5wdXQgdGVuc29yIGAgK1xuICAgICAgICAgICAgYCgke0pTT04uc3RyaW5naWZ5KGlucHV0U2hhcGUpfSkgZG9lcyBub3QgYCArXG4gICAgICAgICAgICBgbWF0Y2ggdGhlIGV4cGVjdGF0aW9uIG9mIGxheWVyICR7dGhpcy5uYW1lfTogYCArXG4gICAgICAgICAgICBgJHtKU09OLnN0cmluZ2lmeSh0aGlzLmJhdGNoSW5wdXRTaGFwZSl9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgb3V0cHV0IHNoYXBlKHMpIG9mIGEgbGF5ZXIuXG4gICAqXG4gICAqIE9ubHkgYXBwbGljYWJsZSBpZiB0aGUgbGF5ZXIgaGFzIG9ubHkgb25lIGluYm91bmQgbm9kZSwgb3IgaWYgYWxsIGluYm91bmRcbiAgICogbm9kZXMgaGF2ZSB0aGUgc2FtZSBvdXRwdXQgc2hhcGUuXG4gICAqXG4gICAqIEByZXR1cm5zIE91dHB1dCBzaGFwZSBvciBzaGFwZXMuXG4gICAqIEB0aHJvd3MgQXR0cmlidXRlRXJyb3I6IGlmIHRoZSBsYXllciBpcyBjb25uZWN0ZWQgdG8gbW9yZSB0aGFuIG9uZSBpbmNvbWluZ1xuICAgKiAgIG5vZGVzLlxuICAgKlxuICAgKiBAZG9jIHtoZWFkaW5nOiAnTW9kZWxzJywgJ3N1YmhlYWRpbmcnOiAnQ2xhc3Nlcyd9XG4gICAqL1xuICBnZXQgb3V0cHV0U2hhcGUoKTogU2hhcGV8U2hhcGVbXSB7XG4gICAgaWYgKHRoaXMuaW5ib3VuZE5vZGVzID09IG51bGwgfHwgdGhpcy5pbmJvdW5kTm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgQXR0cmlidXRlRXJyb3IoXG4gICAgICAgICAgYFRoZSBsYXllciAke3RoaXMubmFtZX0gaGFzIG5ldmVyIGJlZW4gY2FsbGVkIGFuZCB0aHVzIGhhcyBubyBgICtcbiAgICAgICAgICBgZGVmaW5lZCBvdXRwdXQgc2hhcGUuYCk7XG4gICAgfVxuICAgIGNvbnN0IGFsbE91dHB1dFNoYXBlczogc3RyaW5nW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcy5pbmJvdW5kTm9kZXMpIHtcbiAgICAgIGNvbnN0IHNoYXBlU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkobm9kZS5vdXRwdXRTaGFwZXMpO1xuICAgICAgaWYgKGFsbE91dHB1dFNoYXBlcy5pbmRleE9mKHNoYXBlU3RyaW5nKSA9PT0gLTEpIHtcbiAgICAgICAgYWxsT3V0cHV0U2hhcGVzLnB1c2goc2hhcGVTdHJpbmcpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYWxsT3V0cHV0U2hhcGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgY29uc3Qgb3V0cHV0U2hhcGVzID0gdGhpcy5pbmJvdW5kTm9kZXNbMF0ub3V0cHV0U2hhcGVzO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkob3V0cHV0U2hhcGVzKSAmJiBBcnJheS5pc0FycmF5KG91dHB1dFNoYXBlc1swXSkgJiZcbiAgICAgICAgICBvdXRwdXRTaGFwZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiAob3V0cHV0U2hhcGVzIGFzIFNoYXBlW10pWzBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG91dHB1dFNoYXBlcztcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgQXR0cmlidXRlRXJyb3IoXG4gICAgICAgICAgYFRoZSBsYXllciAke3RoaXMubmFtZX0gaGFzIG11bHRpcGxlIGluYm91bmQgbm9kZXMgd2l0aCBkaWZmZXJlbnQgYCArXG4gICAgICAgICAgYG91dHB1dCBzaGFwZXMuIEhlbmNlIHRoZSBub3Rpb24gb2YgXCJvdXRwdXQgc2hhcGVcIiBpcyBpbGwtZGVmaW5lZCBgICtcbiAgICAgICAgICBgZm9yIHRoZSBsYXllci5gKTtcbiAgICAgIC8vIFRPRE8oY2Fpcyk6IEltcGxlbWVudCBnZXRPdXRwdXRTaGFwZUF0KCkuXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvdW50cyB0aGUgdG90YWwgbnVtYmVyIG9mIG51bWJlcnMgKGUuZy4sIGZsb2F0MzIsIGludDMyKSBpbiB0aGVcbiAgICogd2VpZ2h0cy5cbiAgICpcbiAgICogQHJldHVybnMgQW4gaW50ZWdlciBjb3VudC5cbiAgICogQHRocm93cyBSdW50aW1lRXJyb3I6IElmIHRoZSBsYXllciBpcyBub3QgYnVpbHQgeWV0IChpbiB3aGljaCBjYXNlIGl0c1xuICAgKiAgIHdlaWdodHMgYXJlIG5vdCBkZWZpbmVkIHlldC4pXG4gICAqXG4gICAqIEBkb2Mge2hlYWRpbmc6ICdNb2RlbHMnLCAnc3ViaGVhZGluZyc6ICdDbGFzc2VzJ31cbiAgICovXG4gIGNvdW50UGFyYW1zKCk6IG51bWJlciB7XG4gICAgaWYgKCF0aGlzLmJ1aWx0KSB7XG4gICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFxuICAgICAgICAgIGBZb3UgdHJpZWQgdG8gY2FsbCBjb3VudFBhcmFtcygpIG9uICR7dGhpcy5uYW1lfSwgYCArXG4gICAgICAgICAgYGJ1dCB0aGUgbGF5ZXIgaXMgbm90IGJ1aWx0IHlldC4gQnVpbGQgaXQgZmlyc3QgYnkgY2FsbGluZyBgICtcbiAgICAgICAgICBgYnVpbGQoYmF0Y2hJbnB1dFNoYXBlKS5gKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhcmlhYmxlX3V0aWxzLmNvdW50UGFyYW1zSW5XZWlnaHRzKHRoaXMud2VpZ2h0cyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgbGF5ZXIgd2VpZ2h0cy5cbiAgICpcbiAgICogTXVzdCBiZSBpbXBsZW1lbnRlZCBvbiBhbGwgbGF5ZXJzIHRoYXQgaGF2ZSB3ZWlnaHRzLlxuICAgKlxuICAgKiBDYWxsZWQgd2hlbiBhcHBseSgpIGlzIGNhbGxlZCB0byBjb25zdHJ1Y3QgdGhlIHdlaWdodHMuXG4gICAqXG4gICAqIEBwYXJhbSBpbnB1dFNoYXBlIEEgYFNoYXBlYCBvciBhcnJheSBvZiBgU2hhcGVgICh1bnVzZWQpLlxuICAgKlxuICAgKiBAZG9jIHtoZWFkaW5nOiAnTW9kZWxzJywgJ3N1YmhlYWRpbmcnOiAnQ2xhc3Nlcyd9XG4gICAqL1xuICBidWlsZChpbnB1dFNoYXBlOiBTaGFwZXxTaGFwZVtdKSB7XG4gICAgdGhpcy5idWlsdCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCB2YWx1ZXMgb2YgdGhlIHdlaWdodHMgb2YgdGhlIGxheWVyLlxuICAgKlxuICAgKiBAcGFyYW0gdHJhaW5hYmxlT25seSBXaGV0aGVyIHRvIGdldCB0aGUgdmFsdWVzIG9mIG9ubHkgdHJhaW5hYmxlIHdlaWdodHMuXG4gICAqIEByZXR1cm5zIFdlaWdodCB2YWx1ZXMgYXMgYW4gYEFycmF5YCBvZiBgdGYuVGVuc29yYHMuXG4gICAqXG4gICAqIEBkb2Mge2hlYWRpbmc6ICdNb2RlbHMnLCAnc3ViaGVhZGluZyc6ICdDbGFzc2VzJ31cbiAgICovXG4gIGdldFdlaWdodHModHJhaW5hYmxlT25seSA9IGZhbHNlKTogVGVuc29yW10ge1xuICAgIHJldHVybiBiYXRjaEdldFZhbHVlKHRyYWluYWJsZU9ubHkgPyB0aGlzLnRyYWluYWJsZVdlaWdodHMgOiB0aGlzLndlaWdodHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHdlaWdodHMgb2YgdGhlIGxheWVyLCBmcm9tIFRlbnNvcnMuXG4gICAqXG4gICAqIEBwYXJhbSB3ZWlnaHRzIGEgbGlzdCBvZiBUZW5zb3JzLiBUaGUgbnVtYmVyIG9mIGFycmF5cyBhbmQgdGhlaXIgc2hhcGVcbiAgICogICBtdXN0IG1hdGNoIG51bWJlciBvZiB0aGUgZGltZW5zaW9ucyBvZiB0aGUgd2VpZ2h0cyBvZiB0aGUgbGF5ZXIgKGkuZS5cbiAgICogICBpdCBzaG91bGQgbWF0Y2ggdGhlIG91dHB1dCBvZiBgZ2V0V2VpZ2h0c2ApLlxuICAgKlxuICAgKiBAZXhjZXB0aW9uIFZhbHVlRXJyb3IgSWYgdGhlIHByb3ZpZGVkIHdlaWdodHMgbGlzdCBkb2VzIG5vdCBtYXRjaCB0aGVcbiAgICogICBsYXllcidzIHNwZWNpZmljYXRpb25zLlxuICAgKlxuICAgKiBAZG9jIHtoZWFkaW5nOiAnTW9kZWxzJywgJ3N1YmhlYWRpbmcnOiAnQ2xhc3Nlcyd9XG4gICAqL1xuICBzZXRXZWlnaHRzKHdlaWdodHM6IFRlbnNvcltdKTogdm9pZCB7XG4gICAgdGlkeSgoKSA9PiB7XG4gICAgICBjb25zdCBwYXJhbXMgPSB0aGlzLndlaWdodHM7XG4gICAgICBpZiAocGFyYW1zLmxlbmd0aCAhPT0gd2VpZ2h0cy5sZW5ndGgpIHtcbiAgICAgICAgLy8gVE9ETyhjYWlzKTogUmVzdG9yZSB0aGUgZm9sbG93aW5nIGFuZCB1c2UgYHByb3ZpZGVkV2VpZ2h0c2AsIGluc3RlYWRcbiAgICAgICAgLy8gb2YgYHdlaWdodHNgIGluIHRoZSBlcnJvciBtZXNzYWdlLCBvbmNlIHRoZSBkZWVwbGVhcm4uanMgYnVnIGlzXG4gICAgICAgIC8vIGZpeGVkOiBodHRwczovL2dpdGh1Yi5jb20vUEFJUi1jb2RlL2RlZXBsZWFybmpzL2lzc3Vlcy80OTggY29uc3RcbiAgICAgICAgLy8gcHJvdmlkZWRXZWlnaHRzID0gSlNPTi5zdHJpbmdpZnkod2VpZ2h0cykuc2xpY2UoMCwgNTApO1xuICAgICAgICB0aHJvdyBuZXcgVmFsdWVFcnJvcihcbiAgICAgICAgICAgIGBZb3UgY2FsbGVkIHNldFdlaWdodHMod2VpZ2h0cykgb24gbGF5ZXIgXCIke3RoaXMubmFtZX1cIiBgICtcbiAgICAgICAgICAgIGB3aXRoIGEgd2VpZ2h0IGxpc3Qgb2YgbGVuZ3RoICR7d2VpZ2h0cy5sZW5ndGh9LCBgICtcbiAgICAgICAgICAgIGBidXQgdGhlIGxheWVyIHdhcyBleHBlY3RpbmcgJHtwYXJhbXMubGVuZ3RofSB3ZWlnaHRzLiBgICtcbiAgICAgICAgICAgIGBQcm92aWRlZCB3ZWlnaHRzOiAke3dlaWdodHN9Li4uYCk7XG4gICAgICB9XG4gICAgICBpZiAocGFyYW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCB3ZWlnaHRWYWx1ZVR1cGxlczogQXJyYXk8W0xheWVyVmFyaWFibGUsIFRlbnNvcl0+ID0gW107XG4gICAgICBjb25zdCBwYXJhbVZhbHVlcyA9IGJhdGNoR2V0VmFsdWUocGFyYW1zKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyYW1WYWx1ZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgcHYgPSBwYXJhbVZhbHVlc1tpXTtcbiAgICAgICAgY29uc3QgcCA9IHBhcmFtc1tpXTtcbiAgICAgICAgY29uc3QgdyA9IHdlaWdodHNbaV07XG4gICAgICAgIGlmICghdXRpbC5hcnJheXNFcXVhbChwdi5zaGFwZSwgdy5zaGFwZSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVmFsdWVFcnJvcihcbiAgICAgICAgICAgICAgYExheWVyIHdlaWdodCBzaGFwZSAke3B2LnNoYXBlfSBgICtcbiAgICAgICAgICAgICAgYG5vdCBjb21wYXRpYmxlIHdpdGggcHJvdmlkZWQgd2VpZ2h0IHNoYXBlICR7dy5zaGFwZX1gKTtcbiAgICAgICAgfVxuICAgICAgICB3ZWlnaHRWYWx1ZVR1cGxlcy5wdXNoKFtwLCB3XSk7XG4gICAgICB9XG4gICAgICBiYXRjaFNldFZhbHVlKHdlaWdodFZhbHVlVHVwbGVzKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgd2VpZ2h0IHZhcmlhYmxlIHRvIHRoZSBsYXllci5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgbmV3IHdlaWdodCB2YXJpYWJsZS5cbiAgICogQHBhcmFtIHNoYXBlIFRoZSBzaGFwZSBvZiB0aGUgd2VpZ2h0LlxuICAgKiBAcGFyYW0gZHR5cGUgVGhlIGR0eXBlIG9mIHRoZSB3ZWlnaHQuXG4gICAqIEBwYXJhbSBpbml0aWFsaXplciBBbiBpbml0aWFsaXplciBpbnN0YW5jZS5cbiAgICogQHBhcmFtIHJlZ3VsYXJpemVyIEEgcmVndWxhcml6ZXIgaW5zdGFuY2UuXG4gICAqIEBwYXJhbSB0cmFpbmFibGUgV2hldGhlciB0aGUgd2VpZ2h0IHNob3VsZCBiZSB0cmFpbmVkIHZpYSBiYWNrcHJvcCBvciBub3RcbiAgICogICAoYXNzdW1pbmcgdGhhdCB0aGUgbGF5ZXIgaXRzZWxmIGlzIGFsc28gdHJhaW5hYmxlKS5cbiAgICogQHBhcmFtIGNvbnN0cmFpbnQgQW4gb3B0aW9uYWwgdHJhaW5hYmxlLlxuICAgKiBAcmV0dXJuIFRoZSBjcmVhdGVkIHdlaWdodCB2YXJpYWJsZS5cbiAgICpcbiAgICogQGRvYyB7aGVhZGluZzogJ01vZGVscycsICdzdWJoZWFkaW5nJzogJ0NsYXNzZXMnfVxuICAgKi9cbiAgcHJvdGVjdGVkIGFkZFdlaWdodChcbiAgICAgIG5hbWU6IHN0cmluZywgc2hhcGU6IFNoYXBlLCBkdHlwZT86IERhdGFUeXBlLCBpbml0aWFsaXplcj86IEluaXRpYWxpemVyLFxuICAgICAgcmVndWxhcml6ZXI/OiBSZWd1bGFyaXplciwgdHJhaW5hYmxlPzogYm9vbGVhbiwgY29uc3RyYWludD86IENvbnN0cmFpbnQsXG4gICAgICBnZXRJbml0aWFsaXplckZ1bmM/OiBGdW5jdGlvbik6IExheWVyVmFyaWFibGUge1xuICAgIC8vIFJlamVjdCBkdXBsaWNhdGUgd2VpZ2h0IG5hbWVzLlxuICAgIGlmICh0aGlzLl9hZGRlZFdlaWdodE5hbWVzLmluZGV4T2YobmFtZSkgIT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgVmFsdWVFcnJvcihcbiAgICAgICAgICBgRHVwbGljYXRlIHdlaWdodCBuYW1lICR7bmFtZX0gZm9yIGxheWVyICR7dGhpcy5uYW1lfWApO1xuICAgIH1cbiAgICB0aGlzLl9hZGRlZFdlaWdodE5hbWVzLnB1c2gobmFtZSk7XG5cbiAgICBpZiAoZHR5cGUgPT0gbnVsbCkge1xuICAgICAgZHR5cGUgPSAnZmxvYXQzMic7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZmFzdFdlaWdodEluaXREdXJpbmdCdWlsZCkge1xuICAgICAgaW5pdGlhbGl6ZXIgPSBnZXRJbml0aWFsaXplckZ1bmMgIT0gbnVsbCA/IGdldEluaXRpYWxpemVyRnVuYygpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRJbml0aWFsaXplcignemVyb3MnKTtcbiAgICB9XG4gICAgY29uc3QgaW5pdFZhbHVlID0gaW5pdGlhbGl6ZXIuYXBwbHkoc2hhcGUsIGR0eXBlKTtcbiAgICBjb25zdCB3ZWlnaHQgPVxuICAgICAgICBuZXcgTGF5ZXJWYXJpYWJsZShpbml0VmFsdWUsIGR0eXBlLCBuYW1lLCB0cmFpbmFibGUsIGNvbnN0cmFpbnQpO1xuICAgIGluaXRWYWx1ZS5kaXNwb3NlKCk7XG4gICAgLy8gUmVxdWVzdCBiYWNrZW5kIG5vdCB0byBkaXNwb3NlIHRoZSB3ZWlnaHRzIG9mIHRoZSBtb2RlbCBvbiBzY29wZSgpIGV4aXQuXG4gICAgaWYgKHJlZ3VsYXJpemVyICE9IG51bGwpIHtcbiAgICAgIHRoaXMuYWRkTG9zcygoKSA9PiByZWd1bGFyaXplci5hcHBseSh3ZWlnaHQucmVhZCgpKSk7XG4gICAgfVxuICAgIGlmICh0cmFpbmFibGUgPT0gbnVsbCkge1xuICAgICAgdHJhaW5hYmxlID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHRyYWluYWJsZSkge1xuICAgICAgdGhpcy5fdHJhaW5hYmxlV2VpZ2h0cy5wdXNoKHdlaWdodCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX25vblRyYWluYWJsZVdlaWdodHMucHVzaCh3ZWlnaHQpO1xuICAgIH1cbiAgICByZXR1cm4gd2VpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgZmFzdC13ZWlnaHQtaW5pdGlhbGl6YXRpb24gZmxhZy5cbiAgICpcbiAgICogSW4gY2FzZXMgd2hlcmUgdGhlIGluaXRpYWxpemVkIHdlaWdodCB2YWx1ZXMgd2lsbCBiZSBpbW1lZGlhdGVseVxuICAgKiBvdmVyd3JpdHRlbiBieSBsb2FkZWQgd2VpZ2h0IHZhbHVlcyBkdXJpbmcgbW9kZWwgbG9hZGluZywgc2V0dGluZ1xuICAgKiB0aGUgZmxhZyB0byBgdHJ1ZWAgc2F2ZXMgdW5uZWNlc3NhcnkgY2FsbHMgdG8gcG90ZW50aWFsbHkgZXhwZW5zaXZlXG4gICAqIGluaXRpYWxpemVycyBhbmQgc3BlZWRzIHVwIHRoZSBsb2FkaW5nIHByb2Nlc3MuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBUYXJnZXQgdmFsdWUgb2YgdGhlIGZsYWcuXG4gICAqL1xuICBzZXRGYXN0V2VpZ2h0SW5pdER1cmluZ0J1aWxkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5mYXN0V2VpZ2h0SW5pdER1cmluZ0J1aWxkID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGxvc3NlcyB0byB0aGUgbGF5ZXIuXG4gICAqXG4gICAqIFRoZSBsb3NzIG1heSBwb3RlbnRpYWxseSBiZSBjb25kaXRpb25hbCBvbiBzb21lIGlucHV0cyB0ZW5zb3JzLFxuICAgKiBmb3IgaW5zdGFuY2UgYWN0aXZpdHkgbG9zc2VzIGFyZSBjb25kaXRpb25hbCBvbiB0aGUgbGF5ZXIncyBpbnB1dHMuXG4gICAqXG4gICAqIEBkb2Mge2hlYWRpbmc6ICdNb2RlbHMnLCAnc3ViaGVhZGluZyc6ICdDbGFzc2VzJ31cbiAgICovXG4gIGFkZExvc3MobG9zc2VzOiBSZWd1bGFyaXplckZufFJlZ3VsYXJpemVyRm5bXSk6IHZvaWQge1xuICAgIGlmIChsb3NzZXMgPT0gbnVsbCB8fCBBcnJheS5pc0FycmF5KGxvc3NlcykgJiYgbG9zc2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBVcGRhdGUgdGhpcy5sb3NzZXNcbiAgICBsb3NzZXMgPSBnZW5lcmljX3V0aWxzLnRvTGlzdChsb3NzZXMpO1xuICAgIGlmICh0aGlzLl9sb3NzZXMgIT09IHVuZGVmaW5lZCAmJiB0aGlzLl9sb3NzZXMgIT09IG51bGwpIHtcbiAgICAgIHRoaXMubG9zc2VzLnB1c2goLi4ubG9zc2VzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29tcHV0ZXMgdGhlIG91dHB1dCBzaGFwZSBvZiB0aGUgbGF5ZXIuXG4gICAqXG4gICAqIEFzc3VtZXMgdGhhdCB0aGUgbGF5ZXIgd2lsbCBiZSBidWlsdCB0byBtYXRjaCB0aGF0IGlucHV0IHNoYXBlIHByb3ZpZGVkLlxuICAgKlxuICAgKiBAcGFyYW0gaW5wdXRTaGFwZSBBIHNoYXBlICh0dXBsZSBvZiBpbnRlZ2Vycykgb3IgYSBsaXN0IG9mIHNoYXBlIHR1cGxlc1xuICAgKiAgIChvbmUgcGVyIG91dHB1dCB0ZW5zb3Igb2YgdGhlIGxheWVyKS4gU2hhcGUgdHVwbGVzIGNhbiBpbmNsdWRlIG51bGwgZm9yXG4gICAqICAgZnJlZSBkaW1lbnNpb25zLCBpbnN0ZWFkIG9mIGFuIGludGVnZXIuXG4gICAqXG4gICAqIEBkb2Mge2hlYWRpbmc6ICdNb2RlbHMnLCAnc3ViaGVhZGluZyc6ICdDbGFzc2VzJ31cbiAgICovXG4gIGNvbXB1dGVPdXRwdXRTaGFwZShpbnB1dFNoYXBlOiBTaGFwZXxTaGFwZVtdKTogU2hhcGV8U2hhcGVbXSB7XG4gICAgcmV0dXJuIGlucHV0U2hhcGU7XG4gIH1cblxuICAvKipcbiAgICogQ29tcHV0ZXMgYW4gb3V0cHV0IG1hc2sgdGVuc29yLlxuICAgKlxuICAgKiBAcGFyYW0gaW5wdXRzIFRlbnNvciBvciBsaXN0IG9mIHRlbnNvcnMuXG4gICAqIEBwYXJhbSBtYXNrIFRlbnNvciBvciBsaXN0IG9mIHRlbnNvcnMuXG4gICAqXG4gICAqIEByZXR1cm4gbnVsbCBvciBhIHRlbnNvciAob3IgbGlzdCBvZiB0ZW5zb3JzLCBvbmUgcGVyIG91dHB1dCB0ZW5zb3Igb2YgdGhlXG4gICAqIGxheWVyKS5cbiAgICovXG4gIGNvbXB1dGVNYXNrKGlucHV0czogVGVuc29yfFRlbnNvcltdLCBtYXNrPzogVGVuc29yfFRlbnNvcltdKTogVGVuc29yXG4gICAgICB8VGVuc29yW10ge1xuICAgIGlmICghdGhpcy5zdXBwb3J0c01hc2tpbmcpIHtcbiAgICAgIGlmIChtYXNrICE9IG51bGwpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkobWFzaykpIHtcbiAgICAgICAgICBtYXNrLmZvckVhY2gobWFza0VsZW1lbnQgPT4ge1xuICAgICAgICAgICAgaWYgKG1hc2tFbGVtZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAgICAgICAgIGBMYXllciAke3RoaXMubmFtZX0gZG9lcyBub3Qgc3VwcG9ydCBtYXNraW5nLCBgICtcbiAgICAgICAgICAgICAgICAgICdidXQgd2FzIHBhc3NlZCBhbiBpbnB1dE1hc2suJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAgICAgYExheWVyICR7dGhpcy5uYW1lfSBkb2VzIG5vdCBzdXBwb3J0IG1hc2tpbmcsIGAgK1xuICAgICAgICAgICAgICAnYnV0IHdhcyBwYXNzZWQgYW4gaW5wdXRNYXNrLicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBtYXNraW5nIG5vdCBleHBsaWNpdGx5IHN1cHBvcnRlZDogcmV0dXJuIG51bGwgYXMgbWFza1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8vIGlmIG1hc2tpbmcgaXMgZXhwbGljdGx5IHN1cHBvcnRlZCwgYnkgZGVmYXVsdFxuICAgIC8vIGNhcnJ5IG92ZXIgdGhlIGlucHV0IG1hc2tcbiAgICByZXR1cm4gbWFzaztcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcm5hbCBtZXRob2QgdG8gY3JlYXRlIGFuIGluYm91bmQgbm9kZSBmb3IgdGhlIGxheWVyLlxuICAgKlxuICAgKiBAcGFyYW0gaW5wdXRUZW5zb3JzIExpc3Qgb2YgaW5wdXQgdGVuc29ycy5cbiAgICogQHBhcmFtIG91dHB1dFRlbnNvcnMgTGlzdCBvZiBvdXRwdXQgdGVuc29ycy5cbiAgICogQHBhcmFtIGlucHV0TWFza3MgTGlzdCBvZiBpbnB1dCBtYXNrcyAoYSBtYXNrIGNhbiBiZSBhIHRlbnNvciwgb3IgbnVsbCkuXG4gICAqIEBwYXJhbSBvdXRwdXRNYXNrcyBMaXN0IG9mIG91dHB1dCBtYXNrcyAoYSBtYXNrIGNhbiBiZSBhIHRlbnNvciwgb3IgbnVsbCkuXG4gICAqIEBwYXJhbSBpbnB1dFNoYXBlcyBMaXN0IG9mIGlucHV0IHNoYXBlIHR1cGxlcy5cbiAgICogQHBhcmFtIG91dHB1dFNoYXBlcyBMaXN0IG9mIG91dHB1dCBzaGFwZSB0dXBsZXMuXG4gICAqIEBwYXJhbSBrd2FyZ3MgRGljdGlvbmFyeSBvZiBrZXl3b3JkIGFyZ3VtZW50cyB0aGF0IHdlcmUgcGFzc2VkIHRvIHRoZVxuICAgKiAgIGBjYWxsYCBtZXRob2Qgb2YgdGhlIGxheWVyIGF0IHRoZSBjYWxsIHRoYXQgY3JlYXRlZCB0aGUgbm9kZS5cbiAgICovXG4gIHByaXZhdGUgYWRkSW5ib3VuZE5vZGUoXG4gICAgICBpbnB1dFRlbnNvcnM6IFN5bWJvbGljVGVuc29yfFN5bWJvbGljVGVuc29yW10sXG4gICAgICBvdXRwdXRUZW5zb3JzOiBTeW1ib2xpY1RlbnNvcnxTeW1ib2xpY1RlbnNvcltdLFxuICAgICAgaW5wdXRNYXNrczogVGVuc29yfFRlbnNvcltdLCBvdXRwdXRNYXNrczogVGVuc29yfFRlbnNvcltdLFxuICAgICAgaW5wdXRTaGFwZXM6IFNoYXBlfFNoYXBlW10sIG91dHB1dFNoYXBlczogU2hhcGV8U2hhcGVbXSxcbiAgICAgIGt3YXJnczoge30gPSBudWxsKTogdm9pZCB7XG4gICAgY29uc3QgaW5wdXRUZW5zb3JMaXN0OiBTeW1ib2xpY1RlbnNvcltdID1cbiAgICAgICAgZ2VuZXJpY191dGlscy50b0xpc3QoaW5wdXRUZW5zb3JzKTtcbiAgICBvdXRwdXRUZW5zb3JzID0gZ2VuZXJpY191dGlscy50b0xpc3Qob3V0cHV0VGVuc29ycyk7XG4gICAgaW5wdXRNYXNrcyA9IGdlbmVyaWNfdXRpbHMudG9MaXN0KGlucHV0TWFza3MpO1xuICAgIG91dHB1dE1hc2tzID0gZ2VuZXJpY191dGlscy50b0xpc3Qob3V0cHV0TWFza3MpO1xuICAgIGlucHV0U2hhcGVzID0gdHlwZXNfdXRpbHMubm9ybWFsaXplU2hhcGVMaXN0KGlucHV0U2hhcGVzKTtcbiAgICBvdXRwdXRTaGFwZXMgPSB0eXBlc191dGlscy5ub3JtYWxpemVTaGFwZUxpc3Qob3V0cHV0U2hhcGVzKTtcblxuICAgIC8vIENvbGxlY3QgaW5wdXQgdGVuc29yKHMpIGNvb3JkaW5hdGVzLlxuICAgIGNvbnN0IGluYm91bmRMYXllcnM6IExheWVyW10gPSBbXTtcbiAgICBjb25zdCBub2RlSW5kaWNlczogbnVtYmVyW10gPSBbXTtcbiAgICBjb25zdCB0ZW5zb3JJbmRpY2VzOiBudW1iZXJbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgeCBvZiBpbnB1dFRlbnNvckxpc3QpIHtcbiAgICAgIC8qXG4gICAgICAgKiBUT0RPKG1pY2hhZWx0ZXJyeSk6IEtlcmFzIGFkZHMgdGhpcyB2YWx1ZSB0byB0ZW5zb3JzOyBpdCdzIG5vdFxuICAgICAgICogY2xlYXIgd2hldGhlciB3ZSdsbCB1c2UgdGhpcyBvciBub3QuXG4gICAgICAgKi9cbiAgICAgIGluYm91bmRMYXllcnMucHVzaCh4LnNvdXJjZUxheWVyKTtcbiAgICAgIG5vZGVJbmRpY2VzLnB1c2goeC5ub2RlSW5kZXgpO1xuICAgICAgdGVuc29ySW5kaWNlcy5wdXNoKHgudGVuc29ySW5kZXgpO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSBub2RlLCBhZGQgaXQgdG8gaW5ib3VuZCBub2Rlcy5cbiAgICAvLyAoVGhpcyBjYWxsIGhhcyBzaWRlIGVmZmVjdHMuKVxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnVzZWQtZXhwcmVzc2lvblxuICAgIG5ldyBOb2RlKFxuICAgICAgICB7XG4gICAgICAgICAgb3V0Ym91bmRMYXllcjogdGhpcyxcbiAgICAgICAgICBpbmJvdW5kTGF5ZXJzLFxuICAgICAgICAgIG5vZGVJbmRpY2VzLFxuICAgICAgICAgIHRlbnNvckluZGljZXMsXG4gICAgICAgICAgaW5wdXRUZW5zb3JzOiBpbnB1dFRlbnNvckxpc3QsXG4gICAgICAgICAgb3V0cHV0VGVuc29ycyxcbiAgICAgICAgICBpbnB1dE1hc2tzLFxuICAgICAgICAgIG91dHB1dE1hc2tzLFxuICAgICAgICAgIGlucHV0U2hhcGVzLFxuICAgICAgICAgIG91dHB1dFNoYXBlc1xuICAgICAgICB9LFxuICAgICAgICBrd2FyZ3MpO1xuXG4gICAgLy8gVXBkYXRlIHRlbnNvciBoaXN0b3J5XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdXRwdXRUZW5zb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBUT0RPKG1pY2hhZWx0ZXJyeTogX3VzZXNfbGVhcm5pbmdfcGhhc2Ugbm90IHRyYWNrZWQuXG4gICAgICBvdXRwdXRUZW5zb3JzW2ldLnNvdXJjZUxheWVyID0gdGhpcztcbiAgICAgIG91dHB1dFRlbnNvcnNbaV0ubm9kZUluZGV4ID0gdGhpcy5pbmJvdW5kTm9kZXMubGVuZ3RoIC0gMTtcbiAgICAgIG91dHB1dFRlbnNvcnNbaV0udGVuc29ySW5kZXggPSBpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjb25maWcgb2YgdGhlIGxheWVyLlxuICAgKlxuICAgKiBBIGxheWVyIGNvbmZpZyBpcyBhIFRTIGRpY3Rpb25hcnkgKHNlcmlhbGl6YWJsZSlcbiAgICogY29udGFpbmluZyB0aGUgY29uZmlndXJhdGlvbiBvZiBhIGxheWVyLlxuICAgKiBUaGUgc2FtZSBsYXllciBjYW4gYmUgcmVpbnN0YW50aWF0ZWQgbGF0ZXJcbiAgICogKHdpdGhvdXQgaXRzIHRyYWluZWQgd2VpZ2h0cykgZnJvbSB0aGlzIGNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqIFRoZSBjb25maWcgb2YgYSBsYXllciBkb2VzIG5vdCBpbmNsdWRlIGNvbm5lY3Rpdml0eVxuICAgKiBpbmZvcm1hdGlvbiwgbm9yIHRoZSBsYXllciBjbGFzcyBuYW1lLiAgVGhlc2UgYXJlIGhhbmRsZWRcbiAgICogYnkgJ0NvbnRhaW5lcicgKG9uZSBsYXllciBvZiBhYnN0cmFjdGlvbiBhYm92ZSkuXG4gICAqXG4gICAqIFBvcnRpbmcgTm90ZTogVGhlIFRTIGRpY3Rpb25hcnkgZm9sbG93cyBUUyBuYW1pbmcgc3RhbmRhcmRzIGZvclxuICAgKiBrZXlzLCBhbmQgdXNlcyB0ZmpzLWxheWVycyB0eXBlLXNhZmUgRW51bXMuICBTZXJpYWxpemF0aW9uIG1ldGhvZHNcbiAgICogc2hvdWxkIHVzZSBhIGhlbHBlciBmdW5jdGlvbiB0byBjb252ZXJ0IHRvIHRoZSBweXRob25pYyBzdG9yYWdlXG4gICAqIHN0YW5kYXJkLiAoc2VlIHNlcmlhbGl6YXRpb25fdXRpbHMuY29udmVydFRzVG9QeXRob25pYylcbiAgICpcbiAgICogQHJldHVybnMgVFMgZGljdGlvbmFyeSBvZiBjb25maWd1cmF0aW9uLlxuICAgKlxuICAgKiBAZG9jIHtoZWFkaW5nOiAnTW9kZWxzJywgJ3N1YmhlYWRpbmcnOiAnQ2xhc3Nlcyd9XG4gICAqL1xuICBnZXRDb25maWcoKTogc2VyaWFsaXphdGlvbi5Db25maWdEaWN0IHtcbiAgICBjb25zdCBjb25maWc6XG4gICAgICAgIHNlcmlhbGl6YXRpb24uQ29uZmlnRGljdCA9IHtuYW1lOiB0aGlzLm5hbWUsIHRyYWluYWJsZTogdGhpcy50cmFpbmFibGV9O1xuICAgIGlmICh0aGlzLmJhdGNoSW5wdXRTaGFwZSAhPSBudWxsKSB7XG4gICAgICBjb25maWdbJ2JhdGNoSW5wdXRTaGFwZSddID0gdGhpcy5iYXRjaElucHV0U2hhcGU7XG4gICAgfVxuICAgIGlmICh0aGlzLmR0eXBlICE9IG51bGwpIHtcbiAgICAgIGNvbmZpZ1snZHR5cGUnXSA9IHRoaXMuZHR5cGU7XG4gICAgfVxuICAgIHJldHVybiBjb25maWc7XG4gIH1cblxuICAvKipcbiAgICogRGlzcG9zZSB0aGUgd2VpZ2h0IHZhcmlhYmxlcyB0aGF0IHRoaXMgTGF5ZXIgaW5zdGFuY2UgaG9sZHMuXG4gICAqXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IE51bWJlciBvZiBkaXNwb3NlZCB2YXJpYWJsZXMuXG4gICAqL1xuICBwcm90ZWN0ZWQgZGlzcG9zZVdlaWdodHMoKTogbnVtYmVyIHtcbiAgICB0aGlzLndlaWdodHMuZm9yRWFjaCh3ZWlnaHQgPT4gd2VpZ2h0LmRpc3Bvc2UoKSk7XG4gICAgcmV0dXJuIHRoaXMud2VpZ2h0cy5sZW5ndGg7XG4gIH1cblxuICBwcm90ZWN0ZWQgYXNzZXJ0Tm90RGlzcG9zZWQoKSB7XG4gICAgaWYgKHRoaXMuX3JlZkNvdW50ID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYExheWVyICcke3RoaXMubmFtZX0nIGlzIGFscmVhZHkgZGlzcG9zZWQuYCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHQgdG8gZGlzcG9zZSBsYXllcidzIHdlaWdodHMuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGRlY3JlYXNlcyB0aGUgcmVmZXJlbmNlIGNvdW50IG9mIHRoZSBMYXllciBvYmplY3QgYnkgMS5cbiAgICpcbiAgICogQSBMYXllciBpcyByZWZlcmVuY2UtY291bnRlZC4gSXRzIHJlZmVyZW5jZSBjb3VudCBpcyBpbmNyZW1lbnRlZCBieSAxXG4gICAqIHRoZSBmaXJzdCBpdGVtIGl0cyBgYXBwbHkoKWAgbWV0aG9kIGlzIGNhbGxlZCBhbmQgd2hlbiBpdCBiZWNvbWVzIGEgcGFydFxuICAgKiBvZiBhIG5ldyBgTm9kZWAgKHRocm91Z2ggY2FsbGluZyB0aGUgYGFwcGx5KClgIG1ldGhvZCBvbiBhXG4gICAqIGB0Zi5TeW1ib2xpY1RlbnNvcmApLlxuICAgKlxuICAgKiBJZiB0aGUgcmVmZXJlbmNlIGNvdW50IG9mIGEgTGF5ZXIgYmVjb21lcyAwLCBhbGwgdGhlIHdlaWdodHMgd2lsbCBiZVxuICAgKiBkaXNwb3NlZCBhbmQgdGhlIHVuZGVybHlpbmcgbWVtb3J5IChlLmcuLCB0aGUgdGV4dHVyZXMgYWxsb2NhdGVkIGluIFdlYkdMKVxuICAgKiB3aWxsIGJlIGZyZWVkLlxuICAgKlxuICAgKiBOb3RlOiBJZiB0aGUgcmVmZXJlbmNlIGNvdW50IGlzIGdyZWF0ZXIgdGhhbiAwIGFmdGVyIHRoZSBkZWNyZW1lbnQsIHRoZVxuICAgKiB3ZWlnaHRzIG9mIHRoZSBMYXllciB3aWxsICpub3QqIGJlIGRpc3Bvc2VkLlxuICAgKlxuICAgKiBBZnRlciBhIExheWVyIGlzIGRpc3Bvc2VkLCBpdCBjYW5ub3QgYmUgdXNlZCBpbiBjYWxscyBzdWNoIGFzIGBhcHBseSgpYCxcbiAgICogYGdldFdlaWdodHMoKWAgb3IgYHNldFdlaWdodHMoKWAgYW55bW9yZS5cbiAgICpcbiAgICogQHJldHVybnMgQSBEaXNwb3NlUmVzdWx0IE9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgZmllbGRzOlxuICAgKiAgIC0gcmVmQ291bnRBZnRlckRpc3Bvc2U6IFRoZSByZWZlcmVuY2UgY291bnQgb2YgdGhlIENvbnRhaW5lciBhZnRlciB0aGlzXG4gICAqICAgICBgZGlzcG9zZSgpYCBjYWxsLlxuICAgKiAgIC0gbnVtRGlzcG9zZWRWYXJpYWJsZXM6IE51bWJlciBvZiBgdGYuVmFyaWFibGVgcyAoaS5lLiwgd2VpZ2h0cykgZGlzcG9zZWRcbiAgICogICAgIGR1cmluZyB0aGlzIGBkaXNwb3NlKClgIGNhbGwuXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgbGF5ZXIgaXMgbm90IGJ1aWx0IHlldCwgb3IgaWYgdGhlIGxheWVyIGhhcyBhbHJlYWR5XG4gICAqICAgYmVlbiBkaXNwb3NlZC5cbiAgICpcbiAgICogQGRvYyB7aGVhZGluZzogJ01vZGVscycsICdzdWJoZWFkaW5nJzogJ0NsYXNzZXMnfVxuICAgKi9cbiAgZGlzcG9zZSgpOiBEaXNwb3NlUmVzdWx0IHtcbiAgICBpZiAoIXRoaXMuYnVpbHQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgQ2Fubm90IGRpc3Bvc2UgTGF5ZXIgJHt0aGlzLm5hbWV9IGJlY2F1c2UgaXQgaGFzIG5vdCBiZWVuIGAgK1xuICAgICAgICAgIGBidWlsdCB5ZXQuYCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3JlZkNvdW50ID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYENhbm5vdCBkaXNwb3NlIExheWVyICR7dGhpcy5uYW1lfSBiZWNhdXNlIGl0IGhhcyBub3QgYmVlbiB1c2VkIGAgK1xuICAgICAgICAgIGB5ZXQuYCk7XG4gICAgfVxuXG4gICAgdGhpcy5hc3NlcnROb3REaXNwb3NlZCgpO1xuXG4gICAgbGV0IG51bURpc3Bvc2VkVmFyaWFibGVzID0gMDtcbiAgICBpZiAoLS10aGlzLl9yZWZDb3VudCA9PT0gMCkge1xuICAgICAgbnVtRGlzcG9zZWRWYXJpYWJsZXMgPSB0aGlzLmRpc3Bvc2VXZWlnaHRzKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtyZWZDb3VudEFmdGVyRGlzcG9zZTogdGhpcy5fcmVmQ291bnQsIG51bURpc3Bvc2VkVmFyaWFibGVzfTtcbiAgfVxufVxuXG4vKipcbiAqIENvbGxlY3RzIHRoZSBpbnB1dCBzaGFwZShzKSBvZiBhIGxpc3Qgb2YgYHRmLlRlbnNvcmBzIG9yXG4gKiBgdGYuU3ltYm9saWNUZW5zb3Jgcy5cbiAqXG4gKiBUT0RPKG1pY2hhZWx0ZXJyeSk6IFVwZGF0ZSBQeUtlcmFzIGRvY3MgKGJhY2twb3J0KS5cbiAqXG4gKiBAcGFyYW0gaW5wdXRUZW5zb3JzIExpc3Qgb2YgaW5wdXQgdGVuc29ycyAob3Igc2luZ2xlIGlucHV0IHRlbnNvcikuXG4gKlxuICogQHJldHVybiBMaXN0IG9mIHNoYXBlIHR1cGxlcyAob3Igc2luZ2xlIHR1cGxlKSwgb25lIHR1cGxlIHBlciBpbnB1dC5cbiAqL1xuZnVuY3Rpb24gY29sbGVjdElucHV0U2hhcGUoaW5wdXRUZW5zb3JzOiBTeW1ib2xpY1RlbnNvcnxTeW1ib2xpY1RlbnNvcltdfFRlbnNvcnxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFRlbnNvcltdKTogU2hhcGV8U2hhcGVbXSB7XG4gIGlucHV0VGVuc29ycyA9XG4gICAgICBnZW5lcmljX3V0aWxzLnRvTGlzdChpbnB1dFRlbnNvcnMpIGFzIFN5bWJvbGljVGVuc29yW10gfCBUZW5zb3JbXTtcbiAgY29uc3Qgc2hhcGVzOiBTaGFwZVtdID0gW107XG4gIGZvciAoY29uc3QgeCBvZiBpbnB1dFRlbnNvcnMpIHtcbiAgICBzaGFwZXMucHVzaCh4LnNoYXBlKTtcbiAgfVxuICByZXR1cm4gZ2VuZXJpY191dGlscy5zaW5nbGV0b25PckFycmF5KHNoYXBlcyk7XG59XG5cbi8qKlxuICogR3Vlc3NlcyBvdXRwdXQgZHR5cGUgYmFzZWQgb24gaW5wdXRzLlxuICpcbiAqIEF0IHByZXNlbnQsIGp1c3QgcmV0dXJucyAnZmxvYXQzMicgZm9yIGFueSBpbnB1dC5cbiAqXG4gKiBAcGFyYW0gaW5wdXRUZW5zb3JzIExpc3Qgb2YgaW5wdXQgdGVuc29ycyAob3Igc2luZ2xlIGlucHV0IHRlbnNvcikuXG4gKlxuICogQHJldHVybiBUaGUgZ3Vlc3NlZCBEVHlwZS4gQXQgcHJlc2VudCwgYWx3YXlzIHJldHVybnMgJ2Zsb2F0MzInLlxuICovXG5mdW5jdGlvbiBndWVzc091dHB1dERUeXBlKGlucHV0VGVuc29yczogU3ltYm9saWNUZW5zb3J8U3ltYm9saWNUZW5zb3JbXXxUZW5zb3J8XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFRlbnNvcltdKTogRGF0YVR5cGUge1xuICByZXR1cm4gJ2Zsb2F0MzInO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGxpc3Qgb2YgaW5wdXQgdGVuc29ycyBuZWNlc3NhcnkgdG8gY29tcHV0ZSBgdGVuc29yYC5cbiAqXG4gKiBPdXRwdXQgd2lsbCBhbHdheXMgYmUgYSBsaXN0IG9mIHRlbnNvcnMgKHBvdGVudGlhbGx5IHdpdGggMSBlbGVtZW50KS5cbiAqXG4gKiBAcGFyYW0gdGVuc29yIFRoZSB0ZW5zb3IgdG8gc3RhcnQgZnJvbS5cbiAqIEBwYXJhbSBsYXllciBPcmlnaW4gbGF5ZXIgb2YgdGhlIHRlbnNvci5cbiAqIEBwYXJhbSBub2RlSW5kZXggT3JpZ2luIG5vZGUgaW5kZXggb2YgdGhlIHRlbnNvci5cbiAqXG4gKiBAcmV0dXJuIEFycmF5IG9mIGlucHV0IHRlbnNvcnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTb3VyY2VJbnB1dHMoXG4gICAgdGVuc29yOiBTeW1ib2xpY1RlbnNvciwgbGF5ZXI/OiBMYXllcixcbiAgICBub2RlSW5kZXg/OiBudW1iZXIpOiBTeW1ib2xpY1RlbnNvcltdIHtcbiAgaWYgKGxheWVyID09IG51bGwgfHwgKG5vZGVJbmRleCAhPSBudWxsICYmIG5vZGVJbmRleCA+IDApKSB7XG4gICAgbGF5ZXIgPSB0ZW5zb3Iuc291cmNlTGF5ZXI7XG4gICAgbm9kZUluZGV4ID0gdGVuc29yLm5vZGVJbmRleDtcbiAgfVxuICBpZiAobGF5ZXIuaW5ib3VuZE5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBbdGVuc29yXTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBub2RlID0gbGF5ZXIuaW5ib3VuZE5vZGVzW25vZGVJbmRleF07XG4gICAgaWYgKG5vZGUuaW5ib3VuZExheWVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBub2RlLmlucHV0VGVuc29ycztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc291cmNlVGVuc29yczogU3ltYm9saWNUZW5zb3JbXSA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmluYm91bmRMYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgeCA9IG5vZGUuaW5wdXRUZW5zb3JzW2ldO1xuICAgICAgICBjb25zdCBsYXllciA9IG5vZGUuaW5ib3VuZExheWVyc1tpXTtcbiAgICAgICAgY29uc3Qgbm9kZUluZGV4ID0gbm9kZS5ub2RlSW5kaWNlc1tpXTtcbiAgICAgICAgY29uc3QgcHJldmlvdXNTb3VyY2VzID0gZ2V0U291cmNlSW5wdXRzKHgsIGxheWVyLCBub2RlSW5kZXgpO1xuICAgICAgICAvLyBBdm9pZCBpbnB1dCByZWR1bmRhbmN5LlxuICAgICAgICBmb3IgKGNvbnN0IHggb2YgcHJldmlvdXNTb3VyY2VzKSB7XG4gICAgICAgICAgaWYgKHNvdXJjZVRlbnNvcnMuaW5kZXhPZih4KSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHNvdXJjZVRlbnNvcnMucHVzaCh4KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzb3VyY2VUZW5zb3JzO1xuICAgIH1cbiAgfVxufVxuIl19