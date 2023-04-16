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
import { env, tidy, util } from '@tensorflow/tfjs-core';
import { getNodeNameAndIndex, getParamValue, getTensor, getTensorsForCurrentContenxt, parseNodeName } from '../operations/executors/utils';
import { executeOp } from '../operations/operation_executor';
import { ExecutionContext } from './execution_context';
import { getExecutionSubgraph, getNodesInTopologicalOrder, isControlFlow } from './model_analysis';
export class GraphExecutor {
    /**
     *
     * @param graph Graph the model or function graph to be executed.
     * @param parent When building function exector you need to set the parent
     * executor. Since the weights and function executor maps are set at parant
     * level, that function executor can access the function maps and weight maps
     * through the parent.
     */
    constructor(graph, parent) {
        this.graph = graph;
        this.parent = parent;
        this.compiledMap = new Map();
        this._weightMap = {};
        this.SEPERATOR = ',';
        this._functions = {};
        this._functionExecutorMap = {};
        this.intermediateTensors = {};
        this.keepTensorForDebug = false;
        this._outputs = graph.outputs;
        this._inputs = graph.inputs;
        this._initNodes = graph.initNodes;
        this._signature = graph.signature;
        this._functions = graph.functions;
        // create sub-graph executors
        if (graph.functions != null) {
            Object.keys(graph.functions).forEach(name => {
                this._functionExecutorMap[name] =
                    new GraphExecutor(graph.functions[name], this);
            });
        }
    }
    get weightIds() {
        return this.parent ? this.parent.weightIds : this._weightIds;
    }
    get functionExecutorMap() {
        return this.parent ? this.parent.functionExecutorMap :
            this._functionExecutorMap;
    }
    get weightMap() {
        return this.parent ? this.parent.weightMap : this._weightMap;
    }
    set weightMap(weightMap) {
        const weightIds = Object.keys(weightMap).map(key => weightMap[key].map(tensor => tensor.id));
        this._weightIds = [].concat(...weightIds);
        this._weightMap = weightMap;
    }
    /**
     * Set `ResourceManager` shared by executors of a model.
     * @param resourceManager: `ResourceManager` of the `GraphModel`.
     */
    set resourceManager(resourceManager) {
        this._resourceManager = resourceManager;
    }
    get inputs() {
        return this._inputs.map(node => {
            return {
                name: node.name,
                shape: node.attrParams['shape'] ?
                    node.attrParams['shape'].value :
                    undefined,
                dtype: node.attrParams['dtype'] ?
                    node.attrParams['dtype'].value :
                    undefined
            };
        });
    }
    get outputs() {
        return this._outputs.map(node => {
            return {
                name: node.name,
                shape: node.attrParams['shape'] ?
                    node.attrParams['shape'].value :
                    undefined,
                dtype: node.attrParams['dtype'] ?
                    node.attrParams['dtype'].value :
                    undefined
            };
        });
    }
    get inputNodes() {
        return this._inputs.map(node => node.signatureKey || node.name);
    }
    get outputNodes() {
        return this._outputs.map((node) => {
            const name = node.signatureKey || node.name;
            return node.defaultOutput ? (`${name}:${node.defaultOutput}`) : name;
        });
    }
    get functions() {
        return Object.keys(this._functions).reduce((map, key) => {
            map[key] = this._functions[key].signature;
            return map;
        }, {});
    }
    getCompilationKey(inputs, outputs) {
        const sortedInputs = inputs.map(node => node.name).sort();
        const sortedOutputs = outputs.map(node => node.name).sort();
        return sortedInputs.join(this.SEPERATOR) + '--' +
            sortedOutputs.join(this.SEPERATOR);
    }
    /**
     * Compiles the inference graph and returns the minimal set of nodes that are
     * required for execution, in the correct execution order.
     */
    compile(inputs, outputs) {
        const executionInfo = getExecutionSubgraph(inputs, outputs, this.weightMap, this._initNodes);
        const { missingInputs, dynamicNode, syncInputs } = executionInfo;
        if (dynamicNode != null) {
            throw new Error(`This execution contains the node '${dynamicNode.name}', which has ` +
                `the dynamic op '${dynamicNode.op}'. Please use ` +
                `model.executeAsync() instead. Alternatively, to avoid the ` +
                `dynamic ops, specify the inputs [${syncInputs}]`);
        }
        if (missingInputs.length > 0) {
            const outNames = outputs.map(n => n.name);
            const inNames = Object.keys(inputs);
            throw new Error(`Cannot compute the outputs [${outNames}] from the provided inputs ` +
                `[${inNames}]. Missing the following inputs: [${missingInputs}]`);
        }
        return getNodesInTopologicalOrder(this.graph, this.weightMap, executionInfo);
    }
    /**
     * Executes the inference for given input tensors.
     * @param inputs Tensor map for the model inputs, keyed by the input node
     * names.
     * @param outputs Optional. output node name from the Tensorflow model, if
     * no outputs are specified, the default outputs of the model would be used.
     * You can inspect intermediate nodes of the model by adding them to the
     * outputs array.
     */
    execute(inputs, outputs) {
        inputs = this.mapInputs(inputs);
        const names = Object.keys(inputs).sort();
        this.checkInputs(inputs);
        this.checkInputShapeAndType(inputs);
        outputs = this.mapOutputs(outputs);
        this.checkOutputs(outputs);
        const inputNodes = names.map(name => this.graph.nodes[parseNodeName(name)[0]]);
        const outputNodeNames = outputs.map(name => parseNodeName(name)[0]);
        let outputNodes = outputNodeNames.map(name => this.graph.nodes[name]);
        this.resetIntermediateTensors();
        // If no outputs are specified, then use the default outputs of the model.
        if (outputNodes.length === 0) {
            outputNodes = this._outputs;
        }
        const compilationKey = this.getCompilationKey(inputNodes, outputNodes);
        // Do nothing if the compiled graph cache contains the input.
        let orderedNodes = this.compiledMap.get(compilationKey);
        if (orderedNodes == null) {
            orderedNodes = this.compile(inputs, outputNodes);
            this.compiledMap.set(compilationKey, orderedNodes);
        }
        const tensorArrayMap = {};
        const tensorListMap = {};
        return tidy(() => {
            const context = new ExecutionContext(this.weightMap, tensorArrayMap, tensorListMap, this.functionExecutorMap);
            const tensorsMap = Object.assign({}, this.weightMap);
            Object.keys(inputs).forEach(name => {
                const [nodeName, index] = parseNodeName(name);
                const tensors = [];
                tensors[index] = inputs[name];
                tensorsMap[nodeName] = tensors;
            });
            const tensorsToKeep = this.getFrozenTensorIds(tensorsMap);
            const intermediateTensorConsumerCount = {};
            for (let i = 0; i < orderedNodes.length; i++) {
                const node = orderedNodes[i];
                if (!tensorsMap[node.name]) {
                    const tensors = executeOp(node, tensorsMap, context, this._resourceManager);
                    if (util.isPromise(tensors)) {
                        throw new Error(`The execution of the op '${node.op}' returned a promise. ` +
                            `Please use model.executeAsync() instead.`);
                    }
                    tensorsMap[node.name] = tensors;
                    this.checkTensorForDisposal(node.name, node, tensorsMap, context, tensorsToKeep, outputNodeNames, intermediateTensorConsumerCount);
                }
            }
            // dispose the context for the root executor
            if (this.parent == null) {
                context.dispose(tensorsToKeep);
            }
            return outputs.map(name => getTensor(name, tensorsMap, context));
        });
    }
    getFrozenTensorIds(tensorMap) {
        const ids = [].concat.apply([], Object.keys(tensorMap)
            .map(key => tensorMap[key])
            .map(tensors => tensors.map(tensor => tensor.id)));
        return new Set(ids);
    }
    checkTensorForDisposal(nodeName, node, tensorMap, context, tensorsToKeep, outputNames, intermediateTensorConsumerCount) {
        // Skip output nodes and any control flow nodes, since its dependency is
        // tricky to track correctly.
        if (node.category === 'control' || outputNames.indexOf(nodeName) !== -1) {
            return;
        }
        tensorMap[nodeName].forEach(tensor => {
            if (tensor != null) {
                intermediateTensorConsumerCount[tensor.id] =
                    (intermediateTensorConsumerCount[tensor.id] || 0) +
                        node.children.length;
            }
        });
        node.inputs.forEach(input => {
            // Skip any control flow nodes, since its dependency is tricky to track
            // correctly.
            if (input.category !== 'control') {
                const tensors = getTensorsForCurrentContenxt(input.name, tensorMap, context);
                if (tensors != null) {
                    tensors.forEach(tensor => {
                        if (tensor && !tensor.kept && !tensorsToKeep.has(tensor.id)) {
                            const count = intermediateTensorConsumerCount[tensor.id];
                            if (count === 1) {
                                if (!this.keepTensorForDebug) {
                                    tensor.dispose();
                                }
                                else {
                                    const [nodeName, index] = getNodeNameAndIndex(node.name, context);
                                    if (this.intermediateTensors[nodeName]) {
                                        this.intermediateTensors[nodeName][index] = tensor;
                                    }
                                    else {
                                        this.intermediateTensors[nodeName] = [];
                                        this.intermediateTensors[nodeName][index] = tensor;
                                    }
                                }
                                delete intermediateTensorConsumerCount[tensor.id];
                            }
                            else if (count != null) {
                                // only intermediate nodes has count set, inputs and weights are
                                // not.
                                intermediateTensorConsumerCount[tensor.id]--;
                            }
                        }
                    });
                }
            }
        });
    }
    /**
     * Executes the inference for given input tensors in Async fashion.
     * @param inputs Tensor map for the model inputs, keyed by the input node
     * names.
     * @param outputs output node name from the Tensorflow model, if no outputs
     * are specified, the default outputs of the model would be used. You can
     * inspect intermediate nodes of the model by adding them to the outputs
     * array.
     */
    async executeAsync(inputs, outputs) {
        return this._executeAsync(inputs, outputs);
    }
    disposeIntermediateTensors() {
        if (!this.intermediateTensors) {
            return;
        }
        Object.keys(this.intermediateTensors)
            .forEach(key => this.intermediateTensors[key].forEach(tensor => tensor.dispose()));
        this.disposeTensorsMap();
    }
    disposeTensorsMap() {
        if (!this.tensorsMap) {
            return;
        }
        Object.keys(this.tensorsMap).forEach(key => {
            const tensorArray = this.tensorsMap[key];
            tensorArray.forEach(tensor => {
                if (tensor && !tensor.kept && !tensor.isDisposed &&
                    !this.keepIds.has(tensor.id)) {
                    tensor.dispose();
                }
            });
        });
    }
    getIntermediateTensors() {
        return this.tensorsMap;
    }
    resetIntermediateTensors() {
        for (const key in this.intermediateTensors) {
            this.intermediateTensors[key].forEach(tensor => tensor.dispose());
            delete this.intermediateTensors[key];
        }
    }
    /**
     * Executes the inference for given input tensors in Async fashion.
     * @param inputs Tensor map for the model inputs, keyed by the input node
     * names.
     * @param outputs Optional. output node name from the Tensorflow model,
     * if no outputs are specified, the default outputs of the model would be
     * used. You can inspect intermediate nodes of the model by adding them to the
     * outputs array.
     * @param isFunctionExecution Optional. Flag for executing a function.
     * @param tensorArrayMap Optional, global TensorArray map by id. Used for
     * function execution.
     * @param tensorArrayMap Optinal global TensorList map by id. Used for
     * function execution.
     */
    async _executeAsync(inputs, outputs, isFunctionExecution = false, tensorArrayMap = {}, tensorListMap = {}) {
        if (!isFunctionExecution) {
            inputs = this.mapInputs(inputs);
            this.checkInputs(inputs);
            this.checkInputShapeAndType(inputs);
            outputs = this.mapOutputs(outputs);
            this.checkOutputs(outputs);
        }
        // For model debug.
        try {
            this.keepTensorForDebug = env().getBool('KEEP_INTERMEDIATE_TENSORS');
        }
        catch (e) {
            console.warn(e.message);
        }
        this.resetIntermediateTensors();
        const context = new ExecutionContext(this.weightMap, tensorArrayMap, tensorListMap, this.functionExecutorMap);
        // Graph with control flow op requires runtime evaluation of the execution
        // order, while without control flow the execution order is pre-determined
        // in the compile method.
        this.tensorsMap = await this.executeWithControlFlow(inputs, context, outputs, isFunctionExecution);
        const results = outputs.map(name => getTensor(name, this.tensorsMap, context));
        // dispose all the intermediate tensors
        const outputIds = results.map(t => t.id);
        const inputIds = Object.keys(inputs).map(name => inputs[name].id);
        this.keepIds =
            new Set([...outputIds, ...inputIds, ...this.weightIds]);
        if (!this.keepTensorForDebug) {
            this.disposeTensorsMap();
        }
        // dispose the context for the root executor
        if (this.parent == null) {
            context.dispose(this.keepIds);
        }
        return results;
    }
    async executeFunctionAsync(inputs, tensorArrayMap, tensorListMap) {
        const mappedInputs = inputs.reduce((map, tensor, index) => {
            map[this.inputs[index].name] = tensor;
            return map;
        }, {});
        return this._executeAsync(mappedInputs, this.outputNodes, true, tensorArrayMap, tensorListMap);
    }
    /**
     * When there are control flow nodes in the graph, the graph execution use
     * ExecutionContext to keep track of the frames and loop iterators.
     * @param inputs placeholder tensors for the graph.
     * @param context the execution context object for current execution.
     * @param outputNames Optional. output node name from the Tensorflow model,
     * if no outputs are specified, the default outputs of the model would be
     * used. You can inspect intermediate nodes of the model by adding them to the
     * outputs array.
     * @param isFunctionExecution Flag for executing a function.
     */
    async executeWithControlFlow(inputs, context, outputNames, isFunctionExecution) {
        const names = Object.keys(inputs);
        const inputNodes = names.map(name => this.graph.nodes[parseNodeName(name)[0]]);
        const outputNodeNames = outputNames.map(name => parseNodeName(name)[0]);
        let outputNodes = outputNodeNames.map(name => this.graph.nodes[name]);
        // If no outputs are specified, then use the default outputs of the model.
        if (outputNodes.length === 0) {
            outputNodes = this._outputs;
        }
        const { usedNodes, missingInputs, dynamicNode, syncInputs } = getExecutionSubgraph(inputs, outputNodes, this.weightMap, this._initNodes);
        // First nodes to execute include inputNodes, weights, and initNodes.
        const stack = [
            ...inputNodes, ...this.graph.weights, ...(this._initNodes || [])
        ].map(node => {
            return { node, contexts: context.currentContext };
        });
        const tensorsMap = Object.assign({}, this.weightMap);
        Object.keys(inputs).forEach(name => {
            const [nodeName, index] = parseNodeName(name);
            const tensors = [];
            tensors[index] = inputs[name];
            tensorsMap[nodeName] = tensors;
        });
        const intermediateTensorConsumerCount = {};
        const tensorsToKeep = this.getFrozenTensorIds(tensorsMap);
        const added = {};
        while (stack.length > 0) {
            const promises = this.processStack(inputNodes, stack, context, tensorsMap, added, tensorsToKeep, outputNodeNames, intermediateTensorConsumerCount, usedNodes);
            await Promise.all(promises);
        }
        if (dynamicNode == null && !isFunctionExecution) {
            console.warn(`This model execution did not contain any nodes with control flow ` +
                `or dynamic output shapes. You can use model.execute() instead.`);
        }
        const missingOutputs = outputNodes
            .filter(node => !isControlFlow(node) &&
            !getTensor(node.name, tensorsMap, context))
            .map(node => node.name);
        if (missingOutputs.length > 0) {
            let alternativeMsg = '';
            if (dynamicNode != null) {
                alternativeMsg =
                    `Alternatively, to avoid the dynamic ops, use model.execute() ` +
                        `and specify the inputs [${syncInputs}]`;
            }
            throw new Error(`Cannot compute the outputs [${missingOutputs}] from the provided ` +
                `inputs [${names}]. Consider providing the following inputs: ` +
                `[${missingInputs}]. ${alternativeMsg}`);
        }
        return tensorsMap;
    }
    processStack(inputNodes, stack, context, tensorMap, added, tensorsToKeep, outputNames, intermediateTensorConsumerCount, usedNodes) {
        const promises = [];
        while (stack.length > 0) {
            const item = stack.pop();
            context.currentContext = item.contexts;
            let nodeName = '';
            // The tensor of the Enter op with isConstant set should be set
            // in the parent scope, so it will be available as constant for the
            // whole loop.
            if (item.node.op === 'Enter' &&
                getParamValue('isConstant', item.node, tensorMap, context)) {
                [nodeName] = getNodeNameAndIndex(item.node.name, context);
            }
            // only process nodes that are not in the tensorMap yet, this include
            // inputNodes and internal initNodes.
            if (tensorMap[item.node.name] == null) {
                const tensors = executeOp(item.node, tensorMap, context, this._resourceManager);
                if (!nodeName) {
                    [nodeName] = getNodeNameAndIndex(item.node.name, context);
                }
                const currentContext = context.currentContext;
                if (util.isPromise(tensors)) {
                    promises.push(tensors.then(t => {
                        tensorMap[nodeName] = t;
                        context.currentContext = currentContext;
                        this.checkTensorForDisposal(nodeName, item.node, tensorMap, context, tensorsToKeep, outputNames, intermediateTensorConsumerCount);
                        this.processChildNodes(item.node, stack, context, tensorMap, added, usedNodes);
                        return t;
                    }));
                }
                else {
                    tensorMap[nodeName] = tensors;
                    this.checkTensorForDisposal(nodeName, item.node, tensorMap, context, tensorsToKeep, outputNames, intermediateTensorConsumerCount);
                    this.processChildNodes(item.node, stack, context, tensorMap, added, usedNodes);
                }
            }
            else {
                this.processChildNodes(item.node, stack, context, tensorMap, added, usedNodes);
            }
        }
        return promises;
    }
    processChildNodes(node, stack, context, tensorMap, added, usedNodes) {
        node.children.forEach((childNode) => {
            const [nodeName,] = getNodeNameAndIndex(childNode.name, context);
            if (added[nodeName] || !usedNodes.has(childNode.name)) {
                return;
            }
            // Merge op can be pushed if any of its inputs has value.
            if (childNode.op === 'Merge') {
                if (childNode.inputNames.some(name => {
                    return !!getTensor(name, tensorMap, context);
                })) {
                    added[nodeName] = true;
                    stack.push({ contexts: context.currentContext, node: childNode });
                }
            }
            else // Otherwise all inputs must to have value.
             if (childNode.inputNames.every(name => {
                return !!getTensor(name, tensorMap, context);
            })) {
                added[nodeName] = true;
                stack.push({ contexts: context.currentContext, node: childNode });
            }
        });
    }
    /**
     * Releases the memory used by the weight tensors.
     */
    dispose() {
        Object.keys(this.weightMap)
            .forEach(key => this.weightMap[key].forEach(tensor => tensor.dispose()));
    }
    checkInputShapeAndType(inputs) {
        Object.keys(inputs).forEach(name => {
            const input = inputs[name];
            const [nodeName,] = parseNodeName(name);
            const node = this.graph.nodes[nodeName];
            if (node.attrParams['shape'] && node.attrParams['shape'].value) {
                const shape = node.attrParams['shape'].value;
                const match = shape.length === input.shape.length &&
                    input.shape.every((dim, index) => shape[index] === -1 || shape[index] === dim);
                util.assert(match, () => `The shape of dict['${node.name}'] provided in ` +
                    `model.execute(dict) must be [${shape}], but was ` +
                    `[${input.shape}]`);
            }
            if (node.attrParams['dtype'] && node.attrParams['dtype'].value) {
                util.assert(input.dtype === node.attrParams['dtype'].value, () => `The dtype of dict['${node.name}'] provided in ` +
                    `model.execute(dict) must be ` +
                    `${node.attrParams['dtype'].value}, but was ${input.dtype}`);
            }
        });
    }
    mapInputs(inputs) {
        const result = {};
        for (const inputName in inputs) {
            if (this._signature != null && this._signature.inputs != null &&
                this._signature.inputs[inputName] != null) {
                const tensor = this._signature.inputs[inputName];
                result[tensor.name] = inputs[inputName];
            }
            else {
                result[inputName] = inputs[inputName];
            }
        }
        return result;
    }
    checkInputs(inputs) {
        const notInGraph = Object.keys(inputs).filter(name => {
            const [nodeName] = parseNodeName(name);
            return this.graph.nodes[nodeName] == null;
        });
        if (notInGraph.length > 0) {
            throw new Error(`The dict provided in model.execute(dict) has ` +
                `keys: [${notInGraph}] that are not part of graph`);
        }
    }
    mapOutputs(outputs) {
        return outputs.map(name => {
            if (this._signature != null && this._signature.outputs != null &&
                this._signature.outputs[name] != null) {
                const tensor = this._signature.outputs[name];
                return tensor.name;
            }
            return name;
        }, {});
    }
    checkOutputs(outputs) {
        outputs.forEach(name => {
            const [normalizedName] = parseNodeName(name);
            if (!this.graph.nodes[normalizedName]) {
                throw new Error(`The output '${name}' is not found in the graph`);
            }
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGhfZXhlY3V0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvbnZlcnRlci9zcmMvZXhlY3V0b3IvZ3JhcGhfZXhlY3V0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFXLEdBQUcsRUFBMEIsSUFBSSxFQUFFLElBQUksRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBSXhGLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLDRCQUE0QixFQUFFLGFBQWEsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQ3pJLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUczRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQXVCLE1BQU0scUJBQXFCLENBQUM7QUFDM0UsT0FBTyxFQUFDLG9CQUFvQixFQUFFLDBCQUEwQixFQUFFLGFBQWEsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBU2pHLE1BQU0sT0FBTyxhQUFhO0lBMkZ4Qjs7Ozs7OztPQU9HO0lBQ0gsWUFBb0IsS0FBWSxFQUFVLE1BQXNCO1FBQTVDLFVBQUssR0FBTCxLQUFLLENBQU87UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFnQjtRQWxHeEQsZ0JBQVcsR0FBd0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUM3QyxlQUFVLEdBQW9CLEVBQUUsQ0FBQztRQU1qQyxjQUFTLEdBQUcsR0FBRyxDQUFDO1FBQ2hCLGVBQVUsR0FBMkIsRUFBRSxDQUFDO1FBQ3hDLHlCQUFvQixHQUFzQyxFQUFFLENBQUM7UUFFN0Qsd0JBQW1CLEdBQW9CLEVBQUUsQ0FBQztRQUcxQyx1QkFBa0IsR0FBRyxLQUFLLENBQUM7UUFxRmpDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM5QixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxNQUFNLENB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QUM7Z0JBQzdDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQzthQUNwQjtZQUNELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztJQUVPLFlBQVksQ0FBQyxPQUFpQjtRQUNwQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3JCLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0MsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFO2dCQUNyQyxNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsSUFBSSw2QkFBNkIsQ0FBQyxDQUFDO2FBQ25FO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RGF0YVR5cGUsIGVudiwgTmFtZWRUZW5zb3JNYXAsIFRlbnNvciwgdGlkeSwgdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtJU2lnbmF0dXJlRGVmfSBmcm9tICcuLi9kYXRhL2NvbXBpbGVkX2FwaSc7XG5pbXBvcnQge05hbWVkVGVuc29yc01hcCwgVGVuc29yQXJyYXlNYXAsIFRlbnNvckluZm8sIFRlbnNvckxpc3RNYXB9IGZyb20gJy4uL2RhdGEvdHlwZXMnO1xuaW1wb3J0IHtnZXROb2RlTmFtZUFuZEluZGV4LCBnZXRQYXJhbVZhbHVlLCBnZXRUZW5zb3IsIGdldFRlbnNvcnNGb3JDdXJyZW50Q29udGVueHQsIHBhcnNlTm9kZU5hbWV9IGZyb20gJy4uL29wZXJhdGlvbnMvZXhlY3V0b3JzL3V0aWxzJztcbmltcG9ydCB7ZXhlY3V0ZU9wfSBmcm9tICcuLi9vcGVyYXRpb25zL29wZXJhdGlvbl9leGVjdXRvcic7XG5pbXBvcnQge0dyYXBoLCBOb2RlfSBmcm9tICcuLi9vcGVyYXRpb25zL3R5cGVzJztcblxuaW1wb3J0IHtFeGVjdXRpb25Db250ZXh0LCBFeGVjdXRpb25Db250ZXh0SW5mb30gZnJvbSAnLi9leGVjdXRpb25fY29udGV4dCc7XG5pbXBvcnQge2dldEV4ZWN1dGlvblN1YmdyYXBoLCBnZXROb2Rlc0luVG9wb2xvZ2ljYWxPcmRlciwgaXNDb250cm9sRmxvd30gZnJvbSAnLi9tb2RlbF9hbmFseXNpcyc7XG5pbXBvcnQge1Jlc291cmNlTWFuYWdlcn0gZnJvbSAnLi9yZXNvdXJjZV9tYW5hZ2VyJztcbmltcG9ydCB7RnVuY3Rpb25FeGVjdXRvcn0gZnJvbSAnLi90eXBlcyc7XG5cbmludGVyZmFjZSBOb2RlV2l0aENvbnRleHRzIHtcbiAgY29udGV4dHM6IEV4ZWN1dGlvbkNvbnRleHRJbmZvW107XG4gIG5vZGU6IE5vZGU7XG59XG5cbmV4cG9ydCBjbGFzcyBHcmFwaEV4ZWN1dG9yIGltcGxlbWVudHMgRnVuY3Rpb25FeGVjdXRvciB7XG4gIHByaXZhdGUgY29tcGlsZWRNYXA6IE1hcDxzdHJpbmcsIE5vZGVbXT4gPSBuZXcgTWFwKCk7XG4gIHByaXZhdGUgX3dlaWdodE1hcDogTmFtZWRUZW5zb3JzTWFwID0ge307XG4gIHByaXZhdGUgX3dlaWdodElkczogbnVtYmVyW107XG4gIHByaXZhdGUgX3NpZ25hdHVyZTogSVNpZ25hdHVyZURlZjtcbiAgcHJpdmF0ZSBfaW5wdXRzOiBOb2RlW107XG4gIHByaXZhdGUgX291dHB1dHM6IE5vZGVbXTtcbiAgcHJpdmF0ZSBfaW5pdE5vZGVzOiBOb2RlW107ICAvLyBJbnRlcm5hbCBpbml0IG5vZGVzIHRvIHN0YXJ0IGluaXRpYWxpemF0aW9uLlxuICBwcml2YXRlIFNFUEVSQVRPUiA9ICcsJztcbiAgcHJpdmF0ZSBfZnVuY3Rpb25zOiB7W2tleTogc3RyaW5nXTogR3JhcGh9ID0ge307XG4gIHByaXZhdGUgX2Z1bmN0aW9uRXhlY3V0b3JNYXA6IHtba2V5OiBzdHJpbmddOiBGdW5jdGlvbkV4ZWN1dG9yfSA9IHt9O1xuICBwcml2YXRlIF9yZXNvdXJjZU1hbmFnZXI6IFJlc291cmNlTWFuYWdlcjtcbiAgcHJpdmF0ZSBpbnRlcm1lZGlhdGVUZW5zb3JzOiBOYW1lZFRlbnNvcnNNYXAgPSB7fTtcbiAgcHJpdmF0ZSBrZWVwSWRzOiBTZXQ8bnVtYmVyPjtcbiAgcHJpdmF0ZSB0ZW5zb3JzTWFwOiBOYW1lZFRlbnNvcnNNYXA7XG4gIHByaXZhdGUga2VlcFRlbnNvckZvckRlYnVnID0gZmFsc2U7XG5cbiAgZ2V0IHdlaWdodElkcygpOiBudW1iZXJbXSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQud2VpZ2h0SWRzIDogdGhpcy5fd2VpZ2h0SWRzO1xuICB9XG5cbiAgZ2V0IGZ1bmN0aW9uRXhlY3V0b3JNYXAoKToge1trZXk6IHN0cmluZ106IEZ1bmN0aW9uRXhlY3V0b3J9IHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC5mdW5jdGlvbkV4ZWN1dG9yTWFwIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9mdW5jdGlvbkV4ZWN1dG9yTWFwO1xuICB9XG5cbiAgZ2V0IHdlaWdodE1hcCgpOiBOYW1lZFRlbnNvcnNNYXAge1xuICAgIHJldHVybiB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LndlaWdodE1hcCA6IHRoaXMuX3dlaWdodE1hcDtcbiAgfVxuXG4gIHNldCB3ZWlnaHRNYXAod2VpZ2h0TWFwOiBOYW1lZFRlbnNvcnNNYXApIHtcbiAgICBjb25zdCB3ZWlnaHRJZHMgPSBPYmplY3Qua2V5cyh3ZWlnaHRNYXApLm1hcChcbiAgICAgICAga2V5ID0+IHdlaWdodE1hcFtrZXldLm1hcCh0ZW5zb3IgPT4gdGVuc29yLmlkKSk7XG4gICAgdGhpcy5fd2VpZ2h0SWRzID0gW10uY29uY2F0KC4uLndlaWdodElkcyk7XG4gICAgdGhpcy5fd2VpZ2h0TWFwID0gd2VpZ2h0TWFwO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBgUmVzb3VyY2VNYW5hZ2VyYCBzaGFyZWQgYnkgZXhlY3V0b3JzIG9mIGEgbW9kZWwuXG4gICAqIEBwYXJhbSByZXNvdXJjZU1hbmFnZXI6IGBSZXNvdXJjZU1hbmFnZXJgIG9mIHRoZSBgR3JhcGhNb2RlbGAuXG4gICAqL1xuICBzZXQgcmVzb3VyY2VNYW5hZ2VyKHJlc291cmNlTWFuYWdlcjogUmVzb3VyY2VNYW5hZ2VyKSB7XG4gICAgdGhpcy5fcmVzb3VyY2VNYW5hZ2VyID0gcmVzb3VyY2VNYW5hZ2VyO1xuICB9XG5cbiAgZ2V0IGlucHV0cygpOiBUZW5zb3JJbmZvW10ge1xuICAgIHJldHVybiB0aGlzLl9pbnB1dHMubWFwKG5vZGUgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogbm9kZS5uYW1lLFxuICAgICAgICBzaGFwZTogbm9kZS5hdHRyUGFyYW1zWydzaGFwZSddID9cbiAgICAgICAgICAgIG5vZGUuYXR0clBhcmFtc1snc2hhcGUnXS52YWx1ZSBhcyBudW1iZXJbXSA6XG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIGR0eXBlOiBub2RlLmF0dHJQYXJhbXNbJ2R0eXBlJ10gP1xuICAgICAgICAgICAgbm9kZS5hdHRyUGFyYW1zWydkdHlwZSddLnZhbHVlIGFzIERhdGFUeXBlIDpcbiAgICAgICAgICAgIHVuZGVmaW5lZFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBvdXRwdXRzKCk6IFRlbnNvckluZm9bXSB7XG4gICAgcmV0dXJuIHRoaXMuX291dHB1dHMubWFwKG5vZGUgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogbm9kZS5uYW1lLFxuICAgICAgICBzaGFwZTogbm9kZS5hdHRyUGFyYW1zWydzaGFwZSddID9cbiAgICAgICAgICAgIG5vZGUuYXR0clBhcmFtc1snc2hhcGUnXS52YWx1ZSBhcyBudW1iZXJbXSA6XG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIGR0eXBlOiBub2RlLmF0dHJQYXJhbXNbJ2R0eXBlJ10gP1xuICAgICAgICAgICAgbm9kZS5hdHRyUGFyYW1zWydkdHlwZSddLnZhbHVlIGFzIERhdGFUeXBlIDpcbiAgICAgICAgICAgIHVuZGVmaW5lZFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBpbnB1dE5vZGVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5faW5wdXRzLm1hcChub2RlID0+IG5vZGUuc2lnbmF0dXJlS2V5IHx8IG5vZGUubmFtZSk7XG4gIH1cblxuICBnZXQgb3V0cHV0Tm9kZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl9vdXRwdXRzLm1hcCgobm9kZSkgPT4ge1xuICAgICAgY29uc3QgbmFtZSA9IG5vZGUuc2lnbmF0dXJlS2V5IHx8IG5vZGUubmFtZTtcbiAgICAgIHJldHVybiBub2RlLmRlZmF1bHRPdXRwdXQgPyAoYCR7bmFtZX06JHtub2RlLmRlZmF1bHRPdXRwdXR9YCkgOiBuYW1lO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IGZ1bmN0aW9ucygpOiB7W2tleTogc3RyaW5nXTogSVNpZ25hdHVyZURlZn0ge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLl9mdW5jdGlvbnMpLnJlZHVjZSgobWFwLCBrZXkpID0+IHtcbiAgICAgIG1hcFtrZXldID0gdGhpcy5fZnVuY3Rpb25zW2tleV0uc2lnbmF0dXJlO1xuICAgICAgcmV0dXJuIG1hcDtcbiAgICB9LCB7fSBhcyB7W2tleTogc3RyaW5nXTogSVNpZ25hdHVyZURlZn0pO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBncmFwaCBHcmFwaCB0aGUgbW9kZWwgb3IgZnVuY3Rpb24gZ3JhcGggdG8gYmUgZXhlY3V0ZWQuXG4gICAqIEBwYXJhbSBwYXJlbnQgV2hlbiBidWlsZGluZyBmdW5jdGlvbiBleGVjdG9yIHlvdSBuZWVkIHRvIHNldCB0aGUgcGFyZW50XG4gICAqIGV4ZWN1dG9yLiBTaW5jZSB0aGUgd2VpZ2h0cyBhbmQgZnVuY3Rpb24gZXhlY3V0b3IgbWFwcyBhcmUgc2V0IGF0IHBhcmFudFxuICAgKiBsZXZlbCwgdGhhdCBmdW5jdGlvbiBleGVjdXRvciBjYW4gYWNjZXNzIHRoZSBmdW5jdGlvbiBtYXBzIGFuZCB3ZWlnaHQgbWFwc1xuICAgKiB0aHJvdWdoIHRoZSBwYXJlbnQuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdyYXBoOiBHcmFwaCwgcHJpdmF0ZSBwYXJlbnQ/OiBHcmFwaEV4ZWN1dG9yKSB7XG4gICAgdGhpcy5fb3V0cHV0cyA9IGdyYXBoLm91dHB1dHM7XG4gICAgdGhpcy5faW5wdXRzID0gZ3JhcGguaW5wdXRzO1xuICAgIHRoaXMuX2luaXROb2RlcyA9IGdyYXBoLmluaXROb2RlcztcbiAgICB0aGlzLl9zaWduYXR1cmUgPSBncmFwaC5zaWduYXR1cmU7XG4gICAgdGhpcy5fZnVuY3Rpb25zID0gZ3JhcGguZnVuY3Rpb25zO1xuICAgIC8vIGNyZWF0ZSBzdWItZ3JhcGggZXhlY3V0b3JzXG4gICAgaWYgKGdyYXBoLmZ1bmN0aW9ucyAhPSBudWxsKSB7XG4gICAgICBPYmplY3Qua2V5cyhncmFwaC5mdW5jdGlvbnMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgIHRoaXMuX2Z1bmN0aW9uRXhlY3V0b3JNYXBbbmFtZV0gPVxuICAgICAgICAgICAgbmV3IEdyYXBoRXhlY3V0b3IoZ3JhcGguZnVuY3Rpb25zW25hbWVdLCB0aGlzKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q29tcGlsYXRpb25LZXkoaW5wdXRzOiBOb2RlW10sIG91dHB1dHM6IE5vZGVbXSk6IHN0cmluZyB7XG4gICAgY29uc3Qgc29ydGVkSW5wdXRzID0gaW5wdXRzLm1hcChub2RlID0+IG5vZGUubmFtZSkuc29ydCgpO1xuICAgIGNvbnN0IHNvcnRlZE91dHB1dHMgPSBvdXRwdXRzLm1hcChub2RlID0+IG5vZGUubmFtZSkuc29ydCgpO1xuICAgIHJldHVybiBzb3J0ZWRJbnB1dHMuam9pbih0aGlzLlNFUEVSQVRPUikgKyAnLS0nICtcbiAgICAgICAgc29ydGVkT3V0cHV0cy5qb2luKHRoaXMuU0VQRVJBVE9SKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21waWxlcyB0aGUgaW5mZXJlbmNlIGdyYXBoIGFuZCByZXR1cm5zIHRoZSBtaW5pbWFsIHNldCBvZiBub2RlcyB0aGF0IGFyZVxuICAgKiByZXF1aXJlZCBmb3IgZXhlY3V0aW9uLCBpbiB0aGUgY29ycmVjdCBleGVjdXRpb24gb3JkZXIuXG4gICAqL1xuICBwcml2YXRlIGNvbXBpbGUoaW5wdXRzOiBOYW1lZFRlbnNvck1hcCwgb3V0cHV0czogTm9kZVtdKTogTm9kZVtdIHtcbiAgICBjb25zdCBleGVjdXRpb25JbmZvID1cbiAgICAgICAgZ2V0RXhlY3V0aW9uU3ViZ3JhcGgoaW5wdXRzLCBvdXRwdXRzLCB0aGlzLndlaWdodE1hcCwgdGhpcy5faW5pdE5vZGVzKTtcbiAgICBjb25zdCB7bWlzc2luZ0lucHV0cywgZHluYW1pY05vZGUsIHN5bmNJbnB1dHN9ID0gZXhlY3V0aW9uSW5mbztcbiAgICBpZiAoZHluYW1pY05vZGUgIT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBUaGlzIGV4ZWN1dGlvbiBjb250YWlucyB0aGUgbm9kZSAnJHtkeW5hbWljTm9kZS5uYW1lfScsIHdoaWNoIGhhcyBgICtcbiAgICAgICAgICBgdGhlIGR5bmFtaWMgb3AgJyR7ZHluYW1pY05vZGUub3B9Jy4gUGxlYXNlIHVzZSBgICtcbiAgICAgICAgICBgbW9kZWwuZXhlY3V0ZUFzeW5jKCkgaW5zdGVhZC4gQWx0ZXJuYXRpdmVseSwgdG8gYXZvaWQgdGhlIGAgK1xuICAgICAgICAgIGBkeW5hbWljIG9wcywgc3BlY2lmeSB0aGUgaW5wdXRzIFske3N5bmNJbnB1dHN9XWApO1xuICAgIH1cblxuICAgIGlmIChtaXNzaW5nSW5wdXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IG91dE5hbWVzID0gb3V0cHV0cy5tYXAobiA9PiBuLm5hbWUpO1xuICAgICAgY29uc3QgaW5OYW1lcyA9IE9iamVjdC5rZXlzKGlucHV0cyk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYENhbm5vdCBjb21wdXRlIHRoZSBvdXRwdXRzIFske291dE5hbWVzfV0gZnJvbSB0aGUgcHJvdmlkZWQgaW5wdXRzIGAgK1xuICAgICAgICAgIGBbJHtpbk5hbWVzfV0uIE1pc3NpbmcgdGhlIGZvbGxvd2luZyBpbnB1dHM6IFske21pc3NpbmdJbnB1dHN9XWApO1xuICAgIH1cblxuICAgIHJldHVybiBnZXROb2Rlc0luVG9wb2xvZ2ljYWxPcmRlcihcbiAgICAgICAgdGhpcy5ncmFwaCwgdGhpcy53ZWlnaHRNYXAsIGV4ZWN1dGlvbkluZm8pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVzIHRoZSBpbmZlcmVuY2UgZm9yIGdpdmVuIGlucHV0IHRlbnNvcnMuXG4gICAqIEBwYXJhbSBpbnB1dHMgVGVuc29yIG1hcCBmb3IgdGhlIG1vZGVsIGlucHV0cywga2V5ZWQgYnkgdGhlIGlucHV0IG5vZGVcbiAgICogbmFtZXMuXG4gICAqIEBwYXJhbSBvdXRwdXRzIE9wdGlvbmFsLiBvdXRwdXQgbm9kZSBuYW1lIGZyb20gdGhlIFRlbnNvcmZsb3cgbW9kZWwsIGlmXG4gICAqIG5vIG91dHB1dHMgYXJlIHNwZWNpZmllZCwgdGhlIGRlZmF1bHQgb3V0cHV0cyBvZiB0aGUgbW9kZWwgd291bGQgYmUgdXNlZC5cbiAgICogWW91IGNhbiBpbnNwZWN0IGludGVybWVkaWF0ZSBub2RlcyBvZiB0aGUgbW9kZWwgYnkgYWRkaW5nIHRoZW0gdG8gdGhlXG4gICAqIG91dHB1dHMgYXJyYXkuXG4gICAqL1xuICBleGVjdXRlKGlucHV0czogTmFtZWRUZW5zb3JNYXAsIG91dHB1dHM/OiBzdHJpbmdbXSk6IFRlbnNvcltdIHtcbiAgICBpbnB1dHMgPSB0aGlzLm1hcElucHV0cyhpbnB1dHMpO1xuICAgIGNvbnN0IG5hbWVzID0gT2JqZWN0LmtleXMoaW5wdXRzKS5zb3J0KCk7XG4gICAgdGhpcy5jaGVja0lucHV0cyhpbnB1dHMpO1xuICAgIHRoaXMuY2hlY2tJbnB1dFNoYXBlQW5kVHlwZShpbnB1dHMpO1xuICAgIG91dHB1dHMgPSB0aGlzLm1hcE91dHB1dHMob3V0cHV0cyk7XG4gICAgdGhpcy5jaGVja091dHB1dHMob3V0cHV0cyk7XG4gICAgY29uc3QgaW5wdXROb2RlcyA9XG4gICAgICAgIG5hbWVzLm1hcChuYW1lID0+IHRoaXMuZ3JhcGgubm9kZXNbcGFyc2VOb2RlTmFtZShuYW1lKVswXV0pO1xuICAgIGNvbnN0IG91dHB1dE5vZGVOYW1lcyA9IG91dHB1dHMubWFwKG5hbWUgPT4gcGFyc2VOb2RlTmFtZShuYW1lKVswXSk7XG4gICAgbGV0IG91dHB1dE5vZGVzID0gb3V0cHV0Tm9kZU5hbWVzLm1hcChuYW1lID0+IHRoaXMuZ3JhcGgubm9kZXNbbmFtZV0pO1xuICAgIHRoaXMucmVzZXRJbnRlcm1lZGlhdGVUZW5zb3JzKCk7XG4gICAgLy8gSWYgbm8gb3V0cHV0cyBhcmUgc3BlY2lmaWVkLCB0aGVuIHVzZSB0aGUgZGVmYXVsdCBvdXRwdXRzIG9mIHRoZSBtb2RlbC5cbiAgICBpZiAob3V0cHV0Tm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBvdXRwdXROb2RlcyA9IHRoaXMuX291dHB1dHM7XG4gICAgfVxuXG4gICAgY29uc3QgY29tcGlsYXRpb25LZXkgPSB0aGlzLmdldENvbXBpbGF0aW9uS2V5KGlucHV0Tm9kZXMsIG91dHB1dE5vZGVzKTtcblxuICAgIC8vIERvIG5vdGhpbmcgaWYgdGhlIGNvbXBpbGVkIGdyYXBoIGNhY2hlIGNvbnRhaW5zIHRoZSBpbnB1dC5cbiAgICBsZXQgb3JkZXJlZE5vZGVzID0gdGhpcy5jb21waWxlZE1hcC5nZXQoY29tcGlsYXRpb25LZXkpO1xuICAgIGlmIChvcmRlcmVkTm9kZXMgPT0gbnVsbCkge1xuICAgICAgb3JkZXJlZE5vZGVzID0gdGhpcy5jb21waWxlKGlucHV0cywgb3V0cHV0Tm9kZXMpO1xuICAgICAgdGhpcy5jb21waWxlZE1hcC5zZXQoY29tcGlsYXRpb25LZXksIG9yZGVyZWROb2Rlcyk7XG4gICAgfVxuXG4gICAgY29uc3QgdGVuc29yQXJyYXlNYXA6IFRlbnNvckFycmF5TWFwID0ge307XG4gICAgY29uc3QgdGVuc29yTGlzdE1hcDogVGVuc29yTGlzdE1hcCA9IHt9O1xuXG4gICAgcmV0dXJuIHRpZHkoKCkgPT4ge1xuICAgICAgY29uc3QgY29udGV4dCA9IG5ldyBFeGVjdXRpb25Db250ZXh0KFxuICAgICAgICAgIHRoaXMud2VpZ2h0TWFwLCB0ZW5zb3JBcnJheU1hcCwgdGVuc29yTGlzdE1hcCxcbiAgICAgICAgICB0aGlzLmZ1bmN0aW9uRXhlY3V0b3JNYXApO1xuICAgICAgY29uc3QgdGVuc29yc01hcDogTmFtZWRUZW5zb3JzTWFwID0gey4uLnRoaXMud2VpZ2h0TWFwfTtcblxuICAgICAgT2JqZWN0LmtleXMoaW5wdXRzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICBjb25zdCBbbm9kZU5hbWUsIGluZGV4XSA9IHBhcnNlTm9kZU5hbWUobmFtZSk7XG4gICAgICAgIGNvbnN0IHRlbnNvcnM6IFRlbnNvcltdID0gW107XG4gICAgICAgIHRlbnNvcnNbaW5kZXhdID0gaW5wdXRzW25hbWVdO1xuICAgICAgICB0ZW5zb3JzTWFwW25vZGVOYW1lXSA9IHRlbnNvcnM7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgdGVuc29yc1RvS2VlcCA9IHRoaXMuZ2V0RnJvemVuVGVuc29ySWRzKHRlbnNvcnNNYXApO1xuICAgICAgY29uc3QgaW50ZXJtZWRpYXRlVGVuc29yQ29uc3VtZXJDb3VudDoge1trZXk6IG51bWJlcl06IG51bWJlcn0gPSB7fTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3JkZXJlZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBvcmRlcmVkTm9kZXNbaV07XG4gICAgICAgIGlmICghdGVuc29yc01hcFtub2RlLm5hbWVdKSB7XG4gICAgICAgICAgY29uc3QgdGVuc29ycyA9XG4gICAgICAgICAgICAgIGV4ZWN1dGVPcChub2RlLCB0ZW5zb3JzTWFwLCBjb250ZXh0LCB0aGlzLl9yZXNvdXJjZU1hbmFnZXIpIGFzXG4gICAgICAgICAgICAgIFRlbnNvcltdO1xuICAgICAgICAgIGlmICh1dGlsLmlzUHJvbWlzZSh0ZW5zb3JzKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgIGBUaGUgZXhlY3V0aW9uIG9mIHRoZSBvcCAnJHtub2RlLm9wfScgcmV0dXJuZWQgYSBwcm9taXNlLiBgICtcbiAgICAgICAgICAgICAgICBgUGxlYXNlIHVzZSBtb2RlbC5leGVjdXRlQXN5bmMoKSBpbnN0ZWFkLmApO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0ZW5zb3JzTWFwW25vZGUubmFtZV0gPSB0ZW5zb3JzO1xuICAgICAgICAgIHRoaXMuY2hlY2tUZW5zb3JGb3JEaXNwb3NhbChcbiAgICAgICAgICAgICAgbm9kZS5uYW1lLCBub2RlLCB0ZW5zb3JzTWFwLCBjb250ZXh0LCB0ZW5zb3JzVG9LZWVwLFxuICAgICAgICAgICAgICBvdXRwdXROb2RlTmFtZXMsIGludGVybWVkaWF0ZVRlbnNvckNvbnN1bWVyQ291bnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBkaXNwb3NlIHRoZSBjb250ZXh0IGZvciB0aGUgcm9vdCBleGVjdXRvclxuICAgICAgaWYgKHRoaXMucGFyZW50ID09IG51bGwpIHtcbiAgICAgICAgY29udGV4dC5kaXNwb3NlKHRlbnNvcnNUb0tlZXApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dHMubWFwKG5hbWUgPT4gZ2V0VGVuc29yKG5hbWUsIHRlbnNvcnNNYXAsIGNvbnRleHQpKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RnJvemVuVGVuc29ySWRzKHRlbnNvck1hcDogTmFtZWRUZW5zb3JzTWFwKTogU2V0PG51bWJlcj4ge1xuICAgIGNvbnN0IGlkcyA9IFtdLmNvbmNhdC5hcHBseShcbiAgICAgICAgW10sXG4gICAgICAgIE9iamVjdC5rZXlzKHRlbnNvck1hcClcbiAgICAgICAgICAgIC5tYXAoa2V5ID0+IHRlbnNvck1hcFtrZXldKVxuICAgICAgICAgICAgLm1hcCh0ZW5zb3JzID0+IHRlbnNvcnMubWFwKHRlbnNvciA9PiB0ZW5zb3IuaWQpKSk7XG4gICAgcmV0dXJuIG5ldyBTZXQoaWRzKTtcbiAgfVxuICBwcml2YXRlIGNoZWNrVGVuc29yRm9yRGlzcG9zYWwoXG4gICAgICBub2RlTmFtZTogc3RyaW5nLCBub2RlOiBOb2RlLCB0ZW5zb3JNYXA6IE5hbWVkVGVuc29yc01hcCxcbiAgICAgIGNvbnRleHQ6IEV4ZWN1dGlvbkNvbnRleHQsIHRlbnNvcnNUb0tlZXA6IFNldDxudW1iZXI+LFxuICAgICAgb3V0cHV0TmFtZXM6IHN0cmluZ1tdLFxuICAgICAgaW50ZXJtZWRpYXRlVGVuc29yQ29uc3VtZXJDb3VudDoge1trZXk6IHN0cmluZ106IG51bWJlcn0pIHtcbiAgICAvLyBTa2lwIG91dHB1dCBub2RlcyBhbmQgYW55IGNvbnRyb2wgZmxvdyBub2Rlcywgc2luY2UgaXRzIGRlcGVuZGVuY3kgaXNcbiAgICAvLyB0cmlja3kgdG8gdHJhY2sgY29ycmVjdGx5LlxuICAgIGlmIChub2RlLmNhdGVnb3J5ID09PSAnY29udHJvbCcgfHwgb3V0cHV0TmFtZXMuaW5kZXhPZihub2RlTmFtZSkgIT09IC0xKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGVuc29yTWFwW25vZGVOYW1lXS5mb3JFYWNoKHRlbnNvciA9PiB7XG4gICAgICBpZiAodGVuc29yICE9IG51bGwpIHtcbiAgICAgICAgaW50ZXJtZWRpYXRlVGVuc29yQ29uc3VtZXJDb3VudFt0ZW5zb3IuaWRdID1cbiAgICAgICAgICAgIChpbnRlcm1lZGlhdGVUZW5zb3JDb25zdW1lckNvdW50W3RlbnNvci5pZF0gfHwgMCkgK1xuICAgICAgICAgICAgbm9kZS5jaGlsZHJlbi5sZW5ndGg7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbm9kZS5pbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XG4gICAgICAvLyBTa2lwIGFueSBjb250cm9sIGZsb3cgbm9kZXMsIHNpbmNlIGl0cyBkZXBlbmRlbmN5IGlzIHRyaWNreSB0byB0cmFja1xuICAgICAgLy8gY29ycmVjdGx5LlxuICAgICAgaWYgKGlucHV0LmNhdGVnb3J5ICE9PSAnY29udHJvbCcpIHtcbiAgICAgICAgY29uc3QgdGVuc29ycyA9XG4gICAgICAgICAgICBnZXRUZW5zb3JzRm9yQ3VycmVudENvbnRlbnh0KGlucHV0Lm5hbWUsIHRlbnNvck1hcCwgY29udGV4dCk7XG4gICAgICAgIGlmICh0ZW5zb3JzICE9IG51bGwpIHtcbiAgICAgICAgICB0ZW5zb3JzLmZvckVhY2godGVuc29yID0+IHtcbiAgICAgICAgICAgIGlmICh0ZW5zb3IgJiYgIXRlbnNvci5rZXB0ICYmICF0ZW5zb3JzVG9LZWVwLmhhcyh0ZW5zb3IuaWQpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gaW50ZXJtZWRpYXRlVGVuc29yQ29uc3VtZXJDb3VudFt0ZW5zb3IuaWRdO1xuICAgICAgICAgICAgICBpZiAoY291bnQgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMua2VlcFRlbnNvckZvckRlYnVnKSB7XG4gICAgICAgICAgICAgICAgICB0ZW5zb3IuZGlzcG9zZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBjb25zdCBbbm9kZU5hbWUsIGluZGV4XSA9XG4gICAgICAgICAgICAgICAgICAgICAgZ2V0Tm9kZU5hbWVBbmRJbmRleChub2RlLm5hbWUsIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaW50ZXJtZWRpYXRlVGVuc29yc1tub2RlTmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnRlcm1lZGlhdGVUZW5zb3JzW25vZGVOYW1lXVtpbmRleF0gPSB0ZW5zb3I7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmludGVybWVkaWF0ZVRlbnNvcnNbbm9kZU5hbWVdID0gW107XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJtZWRpYXRlVGVuc29yc1tub2RlTmFtZV1baW5kZXhdID0gdGVuc29yO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWxldGUgaW50ZXJtZWRpYXRlVGVuc29yQ29uc3VtZXJDb3VudFt0ZW5zb3IuaWRdO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvdW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBvbmx5IGludGVybWVkaWF0ZSBub2RlcyBoYXMgY291bnQgc2V0LCBpbnB1dHMgYW5kIHdlaWdodHMgYXJlXG4gICAgICAgICAgICAgICAgLy8gbm90LlxuICAgICAgICAgICAgICAgIGludGVybWVkaWF0ZVRlbnNvckNvbnN1bWVyQ291bnRbdGVuc29yLmlkXS0tO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlcyB0aGUgaW5mZXJlbmNlIGZvciBnaXZlbiBpbnB1dCB0ZW5zb3JzIGluIEFzeW5jIGZhc2hpb24uXG4gICAqIEBwYXJhbSBpbnB1dHMgVGVuc29yIG1hcCBmb3IgdGhlIG1vZGVsIGlucHV0cywga2V5ZWQgYnkgdGhlIGlucHV0IG5vZGVcbiAgICogbmFtZXMuXG4gICAqIEBwYXJhbSBvdXRwdXRzIG91dHB1dCBub2RlIG5hbWUgZnJvbSB0aGUgVGVuc29yZmxvdyBtb2RlbCwgaWYgbm8gb3V0cHV0c1xuICAgKiBhcmUgc3BlY2lmaWVkLCB0aGUgZGVmYXVsdCBvdXRwdXRzIG9mIHRoZSBtb2RlbCB3b3VsZCBiZSB1c2VkLiBZb3UgY2FuXG4gICAqIGluc3BlY3QgaW50ZXJtZWRpYXRlIG5vZGVzIG9mIHRoZSBtb2RlbCBieSBhZGRpbmcgdGhlbSB0byB0aGUgb3V0cHV0c1xuICAgKiBhcnJheS5cbiAgICovXG4gIGFzeW5jIGV4ZWN1dGVBc3luYyhpbnB1dHM6IE5hbWVkVGVuc29yTWFwLCBvdXRwdXRzPzogc3RyaW5nW10pOlxuICAgICAgUHJvbWlzZTxUZW5zb3JbXT4ge1xuICAgIHJldHVybiB0aGlzLl9leGVjdXRlQXN5bmMoaW5wdXRzLCBvdXRwdXRzKTtcbiAgfVxuXG4gIGRpc3Bvc2VJbnRlcm1lZGlhdGVUZW5zb3JzKCkge1xuICAgIGlmICghdGhpcy5pbnRlcm1lZGlhdGVUZW5zb3JzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIE9iamVjdC5rZXlzKHRoaXMuaW50ZXJtZWRpYXRlVGVuc29ycylcbiAgICAgICAgLmZvckVhY2goXG4gICAgICAgICAgICBrZXkgPT4gdGhpcy5pbnRlcm1lZGlhdGVUZW5zb3JzW2tleV0uZm9yRWFjaChcbiAgICAgICAgICAgICAgICB0ZW5zb3IgPT4gdGVuc29yLmRpc3Bvc2UoKSkpO1xuICAgIHRoaXMuZGlzcG9zZVRlbnNvcnNNYXAoKTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcG9zZVRlbnNvcnNNYXAoKSB7XG4gICAgaWYgKCF0aGlzLnRlbnNvcnNNYXApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgT2JqZWN0LmtleXModGhpcy50ZW5zb3JzTWFwKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBjb25zdCB0ZW5zb3JBcnJheSA9IHRoaXMudGVuc29yc01hcFtrZXldO1xuICAgICAgdGVuc29yQXJyYXkuZm9yRWFjaCh0ZW5zb3IgPT4ge1xuICAgICAgICBpZiAodGVuc29yICYmICF0ZW5zb3Iua2VwdCAmJiAhdGVuc29yLmlzRGlzcG9zZWQgJiZcbiAgICAgICAgICAgICF0aGlzLmtlZXBJZHMuaGFzKHRlbnNvci5pZCkpIHtcbiAgICAgICAgICB0ZW5zb3IuZGlzcG9zZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEludGVybWVkaWF0ZVRlbnNvcnMoKTogTmFtZWRUZW5zb3JzTWFwIHtcbiAgICByZXR1cm4gdGhpcy50ZW5zb3JzTWFwO1xuICB9XG5cbiAgcHJpdmF0ZSByZXNldEludGVybWVkaWF0ZVRlbnNvcnMoKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5pbnRlcm1lZGlhdGVUZW5zb3JzKSB7XG4gICAgICB0aGlzLmludGVybWVkaWF0ZVRlbnNvcnNba2V5XS5mb3JFYWNoKHRlbnNvciA9PiB0ZW5zb3IuZGlzcG9zZSgpKTtcbiAgICAgIGRlbGV0ZSB0aGlzLmludGVybWVkaWF0ZVRlbnNvcnNba2V5XTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZXMgdGhlIGluZmVyZW5jZSBmb3IgZ2l2ZW4gaW5wdXQgdGVuc29ycyBpbiBBc3luYyBmYXNoaW9uLlxuICAgKiBAcGFyYW0gaW5wdXRzIFRlbnNvciBtYXAgZm9yIHRoZSBtb2RlbCBpbnB1dHMsIGtleWVkIGJ5IHRoZSBpbnB1dCBub2RlXG4gICAqIG5hbWVzLlxuICAgKiBAcGFyYW0gb3V0cHV0cyBPcHRpb25hbC4gb3V0cHV0IG5vZGUgbmFtZSBmcm9tIHRoZSBUZW5zb3JmbG93IG1vZGVsLFxuICAgKiBpZiBubyBvdXRwdXRzIGFyZSBzcGVjaWZpZWQsIHRoZSBkZWZhdWx0IG91dHB1dHMgb2YgdGhlIG1vZGVsIHdvdWxkIGJlXG4gICAqIHVzZWQuIFlvdSBjYW4gaW5zcGVjdCBpbnRlcm1lZGlhdGUgbm9kZXMgb2YgdGhlIG1vZGVsIGJ5IGFkZGluZyB0aGVtIHRvIHRoZVxuICAgKiBvdXRwdXRzIGFycmF5LlxuICAgKiBAcGFyYW0gaXNGdW5jdGlvbkV4ZWN1dGlvbiBPcHRpb25hbC4gRmxhZyBmb3IgZXhlY3V0aW5nIGEgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSB0ZW5zb3JBcnJheU1hcCBPcHRpb25hbCwgZ2xvYmFsIFRlbnNvckFycmF5IG1hcCBieSBpZC4gVXNlZCBmb3JcbiAgICogZnVuY3Rpb24gZXhlY3V0aW9uLlxuICAgKiBAcGFyYW0gdGVuc29yQXJyYXlNYXAgT3B0aW5hbCBnbG9iYWwgVGVuc29yTGlzdCBtYXAgYnkgaWQuIFVzZWQgZm9yXG4gICAqIGZ1bmN0aW9uIGV4ZWN1dGlvbi5cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgX2V4ZWN1dGVBc3luYyhcbiAgICAgIGlucHV0czogTmFtZWRUZW5zb3JNYXAsIG91dHB1dHM/OiBzdHJpbmdbXSwgaXNGdW5jdGlvbkV4ZWN1dGlvbiA9IGZhbHNlLFxuICAgICAgdGVuc29yQXJyYXlNYXA6IFRlbnNvckFycmF5TWFwID0ge30sXG4gICAgICB0ZW5zb3JMaXN0TWFwOiBUZW5zb3JMaXN0TWFwID0ge30pOiBQcm9taXNlPFRlbnNvcltdPiB7XG4gICAgaWYgKCFpc0Z1bmN0aW9uRXhlY3V0aW9uKSB7XG4gICAgICBpbnB1dHMgPSB0aGlzLm1hcElucHV0cyhpbnB1dHMpO1xuICAgICAgdGhpcy5jaGVja0lucHV0cyhpbnB1dHMpO1xuICAgICAgdGhpcy5jaGVja0lucHV0U2hhcGVBbmRUeXBlKGlucHV0cyk7XG4gICAgICBvdXRwdXRzID0gdGhpcy5tYXBPdXRwdXRzKG91dHB1dHMpO1xuICAgICAgdGhpcy5jaGVja091dHB1dHMob3V0cHV0cyk7XG4gICAgfVxuXG4gICAgLy8gRm9yIG1vZGVsIGRlYnVnLlxuICAgIHRyeSB7XG4gICAgICB0aGlzLmtlZXBUZW5zb3JGb3JEZWJ1ZyA9IGVudigpLmdldEJvb2woJ0tFRVBfSU5URVJNRURJQVRFX1RFTlNPUlMnKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oZS5tZXNzYWdlKTtcbiAgICB9XG4gICAgdGhpcy5yZXNldEludGVybWVkaWF0ZVRlbnNvcnMoKTtcblxuICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgRXhlY3V0aW9uQ29udGV4dChcbiAgICAgICAgdGhpcy53ZWlnaHRNYXAsIHRlbnNvckFycmF5TWFwLCB0ZW5zb3JMaXN0TWFwLFxuICAgICAgICB0aGlzLmZ1bmN0aW9uRXhlY3V0b3JNYXApO1xuXG4gICAgLy8gR3JhcGggd2l0aCBjb250cm9sIGZsb3cgb3AgcmVxdWlyZXMgcnVudGltZSBldmFsdWF0aW9uIG9mIHRoZSBleGVjdXRpb25cbiAgICAvLyBvcmRlciwgd2hpbGUgd2l0aG91dCBjb250cm9sIGZsb3cgdGhlIGV4ZWN1dGlvbiBvcmRlciBpcyBwcmUtZGV0ZXJtaW5lZFxuICAgIC8vIGluIHRoZSBjb21waWxlIG1ldGhvZC5cbiAgICB0aGlzLnRlbnNvcnNNYXAgPSBhd2FpdCB0aGlzLmV4ZWN1dGVXaXRoQ29udHJvbEZsb3coXG4gICAgICAgIGlucHV0cywgY29udGV4dCwgb3V0cHV0cywgaXNGdW5jdGlvbkV4ZWN1dGlvbik7XG4gICAgY29uc3QgcmVzdWx0cyA9XG4gICAgICAgIG91dHB1dHMubWFwKG5hbWUgPT4gZ2V0VGVuc29yKG5hbWUsIHRoaXMudGVuc29yc01hcCwgY29udGV4dCkpO1xuXG4gICAgLy8gZGlzcG9zZSBhbGwgdGhlIGludGVybWVkaWF0ZSB0ZW5zb3JzXG4gICAgY29uc3Qgb3V0cHV0SWRzID0gcmVzdWx0cy5tYXAodCA9PiB0LmlkKTtcbiAgICBjb25zdCBpbnB1dElkcyA9IE9iamVjdC5rZXlzKGlucHV0cykubWFwKG5hbWUgPT4gaW5wdXRzW25hbWVdLmlkKTtcbiAgICB0aGlzLmtlZXBJZHMgPVxuICAgICAgICBuZXcgU2V0PG51bWJlcj4oWy4uLm91dHB1dElkcywgLi4uaW5wdXRJZHMsIC4uLnRoaXMud2VpZ2h0SWRzXSk7XG4gICAgaWYgKCF0aGlzLmtlZXBUZW5zb3JGb3JEZWJ1Zykge1xuICAgICAgdGhpcy5kaXNwb3NlVGVuc29yc01hcCgpO1xuICAgIH1cblxuICAgIC8vIGRpc3Bvc2UgdGhlIGNvbnRleHQgZm9yIHRoZSByb290IGV4ZWN1dG9yXG4gICAgaWYgKHRoaXMucGFyZW50ID09IG51bGwpIHtcbiAgICAgIGNvbnRleHQuZGlzcG9zZSh0aGlzLmtlZXBJZHMpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgYXN5bmMgZXhlY3V0ZUZ1bmN0aW9uQXN5bmMoXG4gICAgICBpbnB1dHM6IFRlbnNvcltdLCB0ZW5zb3JBcnJheU1hcDogVGVuc29yQXJyYXlNYXAsXG4gICAgICB0ZW5zb3JMaXN0TWFwOiBUZW5zb3JMaXN0TWFwKTogUHJvbWlzZTxUZW5zb3JbXT4ge1xuICAgIGNvbnN0IG1hcHBlZElucHV0cyA9IGlucHV0cy5yZWR1Y2UoKG1hcCwgdGVuc29yLCBpbmRleCkgPT4ge1xuICAgICAgbWFwW3RoaXMuaW5wdXRzW2luZGV4XS5uYW1lXSA9IHRlbnNvcjtcbiAgICAgIHJldHVybiBtYXA7XG4gICAgfSwge30gYXMgTmFtZWRUZW5zb3JNYXApO1xuXG4gICAgcmV0dXJuIHRoaXMuX2V4ZWN1dGVBc3luYyhcbiAgICAgICAgbWFwcGVkSW5wdXRzLCB0aGlzLm91dHB1dE5vZGVzLCB0cnVlLCB0ZW5zb3JBcnJheU1hcCwgdGVuc29yTGlzdE1hcCk7XG4gIH1cblxuICAvKipcbiAgICogV2hlbiB0aGVyZSBhcmUgY29udHJvbCBmbG93IG5vZGVzIGluIHRoZSBncmFwaCwgdGhlIGdyYXBoIGV4ZWN1dGlvbiB1c2VcbiAgICogRXhlY3V0aW9uQ29udGV4dCB0byBrZWVwIHRyYWNrIG9mIHRoZSBmcmFtZXMgYW5kIGxvb3AgaXRlcmF0b3JzLlxuICAgKiBAcGFyYW0gaW5wdXRzIHBsYWNlaG9sZGVyIHRlbnNvcnMgZm9yIHRoZSBncmFwaC5cbiAgICogQHBhcmFtIGNvbnRleHQgdGhlIGV4ZWN1dGlvbiBjb250ZXh0IG9iamVjdCBmb3IgY3VycmVudCBleGVjdXRpb24uXG4gICAqIEBwYXJhbSBvdXRwdXROYW1lcyBPcHRpb25hbC4gb3V0cHV0IG5vZGUgbmFtZSBmcm9tIHRoZSBUZW5zb3JmbG93IG1vZGVsLFxuICAgKiBpZiBubyBvdXRwdXRzIGFyZSBzcGVjaWZpZWQsIHRoZSBkZWZhdWx0IG91dHB1dHMgb2YgdGhlIG1vZGVsIHdvdWxkIGJlXG4gICAqIHVzZWQuIFlvdSBjYW4gaW5zcGVjdCBpbnRlcm1lZGlhdGUgbm9kZXMgb2YgdGhlIG1vZGVsIGJ5IGFkZGluZyB0aGVtIHRvIHRoZVxuICAgKiBvdXRwdXRzIGFycmF5LlxuICAgKiBAcGFyYW0gaXNGdW5jdGlvbkV4ZWN1dGlvbiBGbGFnIGZvciBleGVjdXRpbmcgYSBmdW5jdGlvbi5cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgZXhlY3V0ZVdpdGhDb250cm9sRmxvdyhcbiAgICAgIGlucHV0czogTmFtZWRUZW5zb3JNYXAsIGNvbnRleHQ6IEV4ZWN1dGlvbkNvbnRleHQsIG91dHB1dE5hbWVzPzogc3RyaW5nW10sXG4gICAgICBpc0Z1bmN0aW9uRXhlY3V0aW9uPzogYm9vbGVhbik6IFByb21pc2U8TmFtZWRUZW5zb3JzTWFwPiB7XG4gICAgY29uc3QgbmFtZXMgPSBPYmplY3Qua2V5cyhpbnB1dHMpO1xuICAgIGNvbnN0IGlucHV0Tm9kZXMgPVxuICAgICAgICBuYW1lcy5tYXAobmFtZSA9PiB0aGlzLmdyYXBoLm5vZGVzW3BhcnNlTm9kZU5hbWUobmFtZSlbMF1dKTtcbiAgICBjb25zdCBvdXRwdXROb2RlTmFtZXMgPSBvdXRwdXROYW1lcy5tYXAobmFtZSA9PiBwYXJzZU5vZGVOYW1lKG5hbWUpWzBdKTtcbiAgICBsZXQgb3V0cHV0Tm9kZXMgPSBvdXRwdXROb2RlTmFtZXMubWFwKG5hbWUgPT4gdGhpcy5ncmFwaC5ub2Rlc1tuYW1lXSk7XG5cbiAgICAvLyBJZiBubyBvdXRwdXRzIGFyZSBzcGVjaWZpZWQsIHRoZW4gdXNlIHRoZSBkZWZhdWx0IG91dHB1dHMgb2YgdGhlIG1vZGVsLlxuICAgIGlmIChvdXRwdXROb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIG91dHB1dE5vZGVzID0gdGhpcy5fb3V0cHV0cztcbiAgICB9XG5cbiAgICBjb25zdCB7dXNlZE5vZGVzLCBtaXNzaW5nSW5wdXRzLCBkeW5hbWljTm9kZSwgc3luY0lucHV0c30gPVxuICAgICAgICBnZXRFeGVjdXRpb25TdWJncmFwaChcbiAgICAgICAgICAgIGlucHV0cywgb3V0cHV0Tm9kZXMsIHRoaXMud2VpZ2h0TWFwLCB0aGlzLl9pbml0Tm9kZXMpO1xuXG4gICAgLy8gRmlyc3Qgbm9kZXMgdG8gZXhlY3V0ZSBpbmNsdWRlIGlucHV0Tm9kZXMsIHdlaWdodHMsIGFuZCBpbml0Tm9kZXMuXG4gICAgY29uc3Qgc3RhY2s6IE5vZGVXaXRoQ29udGV4dHNbXSA9IFtcbiAgICAgIC4uLmlucHV0Tm9kZXMsIC4uLnRoaXMuZ3JhcGgud2VpZ2h0cywgLi4uKHRoaXMuX2luaXROb2RlcyB8fCBbXSlcbiAgICBdLm1hcChub2RlID0+IHtcbiAgICAgIHJldHVybiB7bm9kZSwgY29udGV4dHM6IGNvbnRleHQuY3VycmVudENvbnRleHR9O1xuICAgIH0pO1xuICAgIGNvbnN0IHRlbnNvcnNNYXA6IE5hbWVkVGVuc29yc01hcCA9IHsuLi50aGlzLndlaWdodE1hcH07XG4gICAgT2JqZWN0LmtleXMoaW5wdXRzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgY29uc3QgW25vZGVOYW1lLCBpbmRleF0gPSBwYXJzZU5vZGVOYW1lKG5hbWUpO1xuICAgICAgY29uc3QgdGVuc29yczogVGVuc29yW10gPSBbXTtcbiAgICAgIHRlbnNvcnNbaW5kZXhdID0gaW5wdXRzW25hbWVdO1xuICAgICAgdGVuc29yc01hcFtub2RlTmFtZV0gPSB0ZW5zb3JzO1xuICAgIH0pO1xuICAgIGNvbnN0IGludGVybWVkaWF0ZVRlbnNvckNvbnN1bWVyQ291bnQ6IHtba2V5OiBudW1iZXJdOiBudW1iZXJ9ID0ge307XG4gICAgY29uc3QgdGVuc29yc1RvS2VlcCA9IHRoaXMuZ2V0RnJvemVuVGVuc29ySWRzKHRlbnNvcnNNYXApO1xuICAgIGNvbnN0IGFkZGVkOiB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0gPSB7fTtcbiAgICB3aGlsZSAoc3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcHJvbWlzZXMgPSB0aGlzLnByb2Nlc3NTdGFjayhcbiAgICAgICAgICBpbnB1dE5vZGVzLCBzdGFjaywgY29udGV4dCwgdGVuc29yc01hcCwgYWRkZWQsIHRlbnNvcnNUb0tlZXAsXG4gICAgICAgICAgb3V0cHV0Tm9kZU5hbWVzLCBpbnRlcm1lZGlhdGVUZW5zb3JDb25zdW1lckNvdW50LCB1c2VkTm9kZXMpO1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIH1cbiAgICBpZiAoZHluYW1pY05vZGUgPT0gbnVsbCAmJiAhaXNGdW5jdGlvbkV4ZWN1dGlvbikge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgIGBUaGlzIG1vZGVsIGV4ZWN1dGlvbiBkaWQgbm90IGNvbnRhaW4gYW55IG5vZGVzIHdpdGggY29udHJvbCBmbG93IGAgK1xuICAgICAgICAgIGBvciBkeW5hbWljIG91dHB1dCBzaGFwZXMuIFlvdSBjYW4gdXNlIG1vZGVsLmV4ZWN1dGUoKSBpbnN0ZWFkLmApO1xuICAgIH1cbiAgICBjb25zdCBtaXNzaW5nT3V0cHV0cyA9XG4gICAgICAgIG91dHB1dE5vZGVzXG4gICAgICAgICAgICAuZmlsdGVyKFxuICAgICAgICAgICAgICAgIG5vZGUgPT4gIWlzQ29udHJvbEZsb3cobm9kZSkgJiZcbiAgICAgICAgICAgICAgICAgICAgIWdldFRlbnNvcihub2RlLm5hbWUsIHRlbnNvcnNNYXAsIGNvbnRleHQpKVxuICAgICAgICAgICAgLm1hcChub2RlID0+IG5vZGUubmFtZSk7XG4gICAgaWYgKG1pc3NpbmdPdXRwdXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBhbHRlcm5hdGl2ZU1zZyA9ICcnO1xuICAgICAgaWYgKGR5bmFtaWNOb2RlICE9IG51bGwpIHtcbiAgICAgICAgYWx0ZXJuYXRpdmVNc2cgPVxuICAgICAgICAgICAgYEFsdGVybmF0aXZlbHksIHRvIGF2b2lkIHRoZSBkeW5hbWljIG9wcywgdXNlIG1vZGVsLmV4ZWN1dGUoKSBgICtcbiAgICAgICAgICAgIGBhbmQgc3BlY2lmeSB0aGUgaW5wdXRzIFske3N5bmNJbnB1dHN9XWA7XG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYENhbm5vdCBjb21wdXRlIHRoZSBvdXRwdXRzIFske21pc3NpbmdPdXRwdXRzfV0gZnJvbSB0aGUgcHJvdmlkZWQgYCArXG4gICAgICAgICAgYGlucHV0cyBbJHtuYW1lc31dLiBDb25zaWRlciBwcm92aWRpbmcgdGhlIGZvbGxvd2luZyBpbnB1dHM6IGAgK1xuICAgICAgICAgIGBbJHttaXNzaW5nSW5wdXRzfV0uICR7YWx0ZXJuYXRpdmVNc2d9YCk7XG4gICAgfVxuICAgIHJldHVybiB0ZW5zb3JzTWFwO1xuICB9XG5cbiAgcHJpdmF0ZSBwcm9jZXNzU3RhY2soXG4gICAgICBpbnB1dE5vZGVzOiBOb2RlW10sIHN0YWNrOiBOb2RlV2l0aENvbnRleHRzW10sIGNvbnRleHQ6IEV4ZWN1dGlvbkNvbnRleHQsXG4gICAgICB0ZW5zb3JNYXA6IE5hbWVkVGVuc29yc01hcCwgYWRkZWQ6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSxcbiAgICAgIHRlbnNvcnNUb0tlZXA6IFNldDxudW1iZXI+LCBvdXRwdXROYW1lczogc3RyaW5nW10sXG4gICAgICBpbnRlcm1lZGlhdGVUZW5zb3JDb25zdW1lckNvdW50OiB7W2tleTogbnVtYmVyXTogbnVtYmVyfSxcbiAgICAgIHVzZWROb2RlczogU2V0PHN0cmluZz4pIHtcbiAgICBjb25zdCBwcm9taXNlczogQXJyYXk8UHJvbWlzZTxUZW5zb3JbXT4+ID0gW107XG4gICAgd2hpbGUgKHN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBzdGFjay5wb3AoKTtcbiAgICAgIGNvbnRleHQuY3VycmVudENvbnRleHQgPSBpdGVtLmNvbnRleHRzO1xuICAgICAgbGV0IG5vZGVOYW1lID0gJyc7XG4gICAgICAvLyBUaGUgdGVuc29yIG9mIHRoZSBFbnRlciBvcCB3aXRoIGlzQ29uc3RhbnQgc2V0IHNob3VsZCBiZSBzZXRcbiAgICAgIC8vIGluIHRoZSBwYXJlbnQgc2NvcGUsIHNvIGl0IHdpbGwgYmUgYXZhaWxhYmxlIGFzIGNvbnN0YW50IGZvciB0aGVcbiAgICAgIC8vIHdob2xlIGxvb3AuXG4gICAgICBpZiAoaXRlbS5ub2RlLm9wID09PSAnRW50ZXInICYmXG4gICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgnaXNDb25zdGFudCcsIGl0ZW0ubm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSkge1xuICAgICAgICBbbm9kZU5hbWVdID0gZ2V0Tm9kZU5hbWVBbmRJbmRleChpdGVtLm5vZGUubmFtZSwgY29udGV4dCk7XG4gICAgICB9XG5cbiAgICAgIC8vIG9ubHkgcHJvY2VzcyBub2RlcyB0aGF0IGFyZSBub3QgaW4gdGhlIHRlbnNvck1hcCB5ZXQsIHRoaXMgaW5jbHVkZVxuICAgICAgLy8gaW5wdXROb2RlcyBhbmQgaW50ZXJuYWwgaW5pdE5vZGVzLlxuICAgICAgaWYgKHRlbnNvck1hcFtpdGVtLm5vZGUubmFtZV0gPT0gbnVsbCkge1xuICAgICAgICBjb25zdCB0ZW5zb3JzID1cbiAgICAgICAgICAgIGV4ZWN1dGVPcChpdGVtLm5vZGUsIHRlbnNvck1hcCwgY29udGV4dCwgdGhpcy5fcmVzb3VyY2VNYW5hZ2VyKTtcbiAgICAgICAgaWYgKCFub2RlTmFtZSkge1xuICAgICAgICAgIFtub2RlTmFtZV0gPSBnZXROb2RlTmFtZUFuZEluZGV4KGl0ZW0ubm9kZS5uYW1lLCBjb250ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjdXJyZW50Q29udGV4dCA9IGNvbnRleHQuY3VycmVudENvbnRleHQ7XG4gICAgICAgIGlmICh1dGlsLmlzUHJvbWlzZSh0ZW5zb3JzKSkge1xuICAgICAgICAgIHByb21pc2VzLnB1c2godGVuc29ycy50aGVuKHQgPT4ge1xuICAgICAgICAgICAgdGVuc29yTWFwW25vZGVOYW1lXSA9IHQ7XG4gICAgICAgICAgICBjb250ZXh0LmN1cnJlbnRDb250ZXh0ID0gY3VycmVudENvbnRleHQ7XG4gICAgICAgICAgICB0aGlzLmNoZWNrVGVuc29yRm9yRGlzcG9zYWwoXG4gICAgICAgICAgICAgICAgbm9kZU5hbWUsIGl0ZW0ubm9kZSwgdGVuc29yTWFwLCBjb250ZXh0LCB0ZW5zb3JzVG9LZWVwLFxuICAgICAgICAgICAgICAgIG91dHB1dE5hbWVzLCBpbnRlcm1lZGlhdGVUZW5zb3JDb25zdW1lckNvdW50KTtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0NoaWxkTm9kZXMoXG4gICAgICAgICAgICAgICAgaXRlbS5ub2RlLCBzdGFjaywgY29udGV4dCwgdGVuc29yTWFwLCBhZGRlZCwgdXNlZE5vZGVzKTtcbiAgICAgICAgICAgIHJldHVybiB0O1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ZW5zb3JNYXBbbm9kZU5hbWVdID0gdGVuc29ycztcbiAgICAgICAgICB0aGlzLmNoZWNrVGVuc29yRm9yRGlzcG9zYWwoXG4gICAgICAgICAgICAgIG5vZGVOYW1lLCBpdGVtLm5vZGUsIHRlbnNvck1hcCwgY29udGV4dCwgdGVuc29yc1RvS2VlcCxcbiAgICAgICAgICAgICAgb3V0cHV0TmFtZXMsIGludGVybWVkaWF0ZVRlbnNvckNvbnN1bWVyQ291bnQpO1xuICAgICAgICAgIHRoaXMucHJvY2Vzc0NoaWxkTm9kZXMoXG4gICAgICAgICAgICAgIGl0ZW0ubm9kZSwgc3RhY2ssIGNvbnRleHQsIHRlbnNvck1hcCwgYWRkZWQsIHVzZWROb2Rlcyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0NoaWxkTm9kZXMoXG4gICAgICAgICAgICBpdGVtLm5vZGUsIHN0YWNrLCBjb250ZXh0LCB0ZW5zb3JNYXAsIGFkZGVkLCB1c2VkTm9kZXMpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZXM7XG4gIH1cblxuICBwcml2YXRlIHByb2Nlc3NDaGlsZE5vZGVzKFxuICAgICAgbm9kZTogTm9kZSwgc3RhY2s6IE5vZGVXaXRoQ29udGV4dHNbXSwgY29udGV4dDogRXhlY3V0aW9uQ29udGV4dCxcbiAgICAgIHRlbnNvck1hcDogTmFtZWRUZW5zb3JzTWFwLCBhZGRlZDoge1trZXk6IHN0cmluZ106IGJvb2xlYW59LFxuICAgICAgdXNlZE5vZGVzOiBTZXQ8c3RyaW5nPikge1xuICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGROb2RlKSA9PiB7XG4gICAgICBjb25zdCBbbm9kZU5hbWUsIF0gPSBnZXROb2RlTmFtZUFuZEluZGV4KGNoaWxkTm9kZS5uYW1lLCBjb250ZXh0KTtcbiAgICAgIGlmIChhZGRlZFtub2RlTmFtZV0gfHwgIXVzZWROb2Rlcy5oYXMoY2hpbGROb2RlLm5hbWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIE1lcmdlIG9wIGNhbiBiZSBwdXNoZWQgaWYgYW55IG9mIGl0cyBpbnB1dHMgaGFzIHZhbHVlLlxuICAgICAgaWYgKGNoaWxkTm9kZS5vcCA9PT0gJ01lcmdlJykge1xuICAgICAgICBpZiAoY2hpbGROb2RlLmlucHV0TmFtZXMuc29tZShuYW1lID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuICEhZ2V0VGVuc29yKG5hbWUsIHRlbnNvck1hcCwgY29udGV4dCk7XG4gICAgICAgICAgICB9KSkge1xuICAgICAgICAgIGFkZGVkW25vZGVOYW1lXSA9IHRydWU7XG4gICAgICAgICAgc3RhY2sucHVzaCh7Y29udGV4dHM6IGNvbnRleHQuY3VycmVudENvbnRleHQsIG5vZGU6IGNoaWxkTm9kZX0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgIC8vIE90aGVyd2lzZSBhbGwgaW5wdXRzIG11c3QgdG8gaGF2ZSB2YWx1ZS5cbiAgICAgICAgICBpZiAoY2hpbGROb2RlLmlucHV0TmFtZXMuZXZlcnkobmFtZSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhZ2V0VGVuc29yKG5hbWUsIHRlbnNvck1hcCwgY29udGV4dCk7XG4gICAgICAgICAgICAgIH0pKSB7XG4gICAgICAgIGFkZGVkW25vZGVOYW1lXSA9IHRydWU7XG4gICAgICAgIHN0YWNrLnB1c2goe2NvbnRleHRzOiBjb250ZXh0LmN1cnJlbnRDb250ZXh0LCBub2RlOiBjaGlsZE5vZGV9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxlYXNlcyB0aGUgbWVtb3J5IHVzZWQgYnkgdGhlIHdlaWdodCB0ZW5zb3JzLlxuICAgKi9cbiAgZGlzcG9zZSgpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLndlaWdodE1hcClcbiAgICAgICAgLmZvckVhY2goXG4gICAgICAgICAgICBrZXkgPT4gdGhpcy53ZWlnaHRNYXBba2V5XS5mb3JFYWNoKHRlbnNvciA9PiB0ZW5zb3IuZGlzcG9zZSgpKSk7XG4gIH1cblxuICBwcml2YXRlIGNoZWNrSW5wdXRTaGFwZUFuZFR5cGUoaW5wdXRzOiBOYW1lZFRlbnNvck1hcCkge1xuICAgIE9iamVjdC5rZXlzKGlucHV0cykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0gaW5wdXRzW25hbWVdO1xuICAgICAgY29uc3QgW25vZGVOYW1lLCBdID0gcGFyc2VOb2RlTmFtZShuYW1lKTtcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmdyYXBoLm5vZGVzW25vZGVOYW1lXTtcbiAgICAgIGlmIChub2RlLmF0dHJQYXJhbXNbJ3NoYXBlJ10gJiYgbm9kZS5hdHRyUGFyYW1zWydzaGFwZSddLnZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHNoYXBlID0gbm9kZS5hdHRyUGFyYW1zWydzaGFwZSddLnZhbHVlIGFzIG51bWJlcltdO1xuICAgICAgICBjb25zdCBtYXRjaCA9IHNoYXBlLmxlbmd0aCA9PT0gaW5wdXQuc2hhcGUubGVuZ3RoICYmXG4gICAgICAgICAgICBpbnB1dC5zaGFwZS5ldmVyeShcbiAgICAgICAgICAgICAgICAoZGltLCBpbmRleCkgPT4gc2hhcGVbaW5kZXhdID09PSAtMSB8fCBzaGFwZVtpbmRleF0gPT09IGRpbSk7XG4gICAgICAgIHV0aWwuYXNzZXJ0KFxuICAgICAgICAgICAgbWF0Y2gsXG4gICAgICAgICAgICAoKSA9PiBgVGhlIHNoYXBlIG9mIGRpY3RbJyR7bm9kZS5uYW1lfSddIHByb3ZpZGVkIGluIGAgK1xuICAgICAgICAgICAgICAgIGBtb2RlbC5leGVjdXRlKGRpY3QpIG11c3QgYmUgWyR7c2hhcGV9XSwgYnV0IHdhcyBgICtcbiAgICAgICAgICAgICAgICBgWyR7aW5wdXQuc2hhcGV9XWApO1xuICAgICAgfVxuICAgICAgaWYgKG5vZGUuYXR0clBhcmFtc1snZHR5cGUnXSAmJiBub2RlLmF0dHJQYXJhbXNbJ2R0eXBlJ10udmFsdWUpIHtcbiAgICAgICAgdXRpbC5hc3NlcnQoXG4gICAgICAgICAgICBpbnB1dC5kdHlwZSA9PT0gbm9kZS5hdHRyUGFyYW1zWydkdHlwZSddLnZhbHVlIGFzIHN0cmluZyxcbiAgICAgICAgICAgICgpID0+IGBUaGUgZHR5cGUgb2YgZGljdFsnJHtub2RlLm5hbWV9J10gcHJvdmlkZWQgaW4gYCArXG4gICAgICAgICAgICAgICAgYG1vZGVsLmV4ZWN1dGUoZGljdCkgbXVzdCBiZSBgICtcbiAgICAgICAgICAgICAgICBgJHtub2RlLmF0dHJQYXJhbXNbJ2R0eXBlJ10udmFsdWV9LCBidXQgd2FzICR7aW5wdXQuZHR5cGV9YCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG1hcElucHV0cyhpbnB1dHM6IE5hbWVkVGVuc29yTWFwKSB7XG4gICAgY29uc3QgcmVzdWx0OiBOYW1lZFRlbnNvck1hcCA9IHt9O1xuICAgIGZvciAoY29uc3QgaW5wdXROYW1lIGluIGlucHV0cykge1xuICAgICAgaWYgKHRoaXMuX3NpZ25hdHVyZSAhPSBudWxsICYmIHRoaXMuX3NpZ25hdHVyZS5pbnB1dHMgIT0gbnVsbCAmJlxuICAgICAgICAgIHRoaXMuX3NpZ25hdHVyZS5pbnB1dHNbaW5wdXROYW1lXSAhPSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHRlbnNvciA9IHRoaXMuX3NpZ25hdHVyZS5pbnB1dHNbaW5wdXROYW1lXTtcbiAgICAgICAgcmVzdWx0W3RlbnNvci5uYW1lXSA9IGlucHV0c1tpbnB1dE5hbWVdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2lucHV0TmFtZV0gPSBpbnB1dHNbaW5wdXROYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tJbnB1dHMoaW5wdXRzOiBOYW1lZFRlbnNvck1hcCkge1xuICAgIGNvbnN0IG5vdEluR3JhcGggPSBPYmplY3Qua2V5cyhpbnB1dHMpLmZpbHRlcihuYW1lID0+IHtcbiAgICAgIGNvbnN0IFtub2RlTmFtZV0gPSBwYXJzZU5vZGVOYW1lKG5hbWUpO1xuICAgICAgcmV0dXJuIHRoaXMuZ3JhcGgubm9kZXNbbm9kZU5hbWVdID09IG51bGw7XG4gICAgfSk7XG4gICAgaWYgKG5vdEluR3JhcGgubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBUaGUgZGljdCBwcm92aWRlZCBpbiBtb2RlbC5leGVjdXRlKGRpY3QpIGhhcyBgICtcbiAgICAgICAgICBga2V5czogWyR7bm90SW5HcmFwaH1dIHRoYXQgYXJlIG5vdCBwYXJ0IG9mIGdyYXBoYCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtYXBPdXRwdXRzKG91dHB1dHM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIG91dHB1dHMubWFwKG5hbWUgPT4ge1xuICAgICAgaWYgKHRoaXMuX3NpZ25hdHVyZSAhPSBudWxsICYmIHRoaXMuX3NpZ25hdHVyZS5vdXRwdXRzICE9IG51bGwgJiZcbiAgICAgICAgICB0aGlzLl9zaWduYXR1cmUub3V0cHV0c1tuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHRlbnNvciA9IHRoaXMuX3NpZ25hdHVyZS5vdXRwdXRzW25hbWVdO1xuICAgICAgICByZXR1cm4gdGVuc29yLm5hbWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmFtZTtcbiAgICB9LCB7fSk7XG4gIH1cblxuICBwcml2YXRlIGNoZWNrT3V0cHV0cyhvdXRwdXRzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIG91dHB1dHMuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGNvbnN0IFtub3JtYWxpemVkTmFtZV0gPSBwYXJzZU5vZGVOYW1lKG5hbWUpO1xuICAgICAgaWYgKCF0aGlzLmdyYXBoLm5vZGVzW25vcm1hbGl6ZWROYW1lXSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBvdXRwdXQgJyR7bmFtZX0nIGlzIG5vdCBmb3VuZCBpbiB0aGUgZ3JhcGhgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19