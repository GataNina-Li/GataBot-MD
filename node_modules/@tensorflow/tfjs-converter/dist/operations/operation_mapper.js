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
import { env } from '@tensorflow/tfjs-core';
import * as tensorflow from '../data/compiled_api';
import { getRegisteredOp } from './custom_op/register';
import { getNodeNameAndIndex } from './executors/utils';
import * as arithmetic from './op_list/arithmetic';
import * as basicMath from './op_list/basic_math';
import * as control from './op_list/control';
import * as convolution from './op_list/convolution';
import * as creation from './op_list/creation';
import * as dynamic from './op_list/dynamic';
import * as evaluation from './op_list/evaluation';
import * as graph from './op_list/graph';
import * as hashTable from './op_list/hash_table';
import * as image from './op_list/image';
import * as logical from './op_list/logical';
import * as matrices from './op_list/matrices';
import * as normalization from './op_list/normalization';
import * as reduction from './op_list/reduction';
import * as sliceJoin from './op_list/slice_join';
import * as sparse from './op_list/sparse';
import * as spectral from './op_list/spectral';
import * as string from './op_list/string';
import * as transformation from './op_list/transformation';
export class OperationMapper {
    // Singleton instance for the mapper
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    // Loads the op mapping from the JSON file.
    constructor() {
        const ops = [
            arithmetic, basicMath, control, convolution, creation, dynamic,
            evaluation, graph, hashTable, image, logical, matrices, normalization,
            reduction, sliceJoin, sparse, spectral, string, transformation
        ];
        const mappersJson = [].concat(...ops.map(op => op.json));
        this.opMappers = mappersJson.reduce((map, mapper) => {
            map[mapper.tfOpName] = mapper;
            return map;
        }, {});
    }
    // Converts the model inference graph from Tensorflow GraphDef to local
    // representation for TensorFlow.js API
    transformGraph(graph, signature = {}) {
        const tfNodes = graph.node;
        const placeholders = [];
        const weights = [];
        const initNodes = [];
        const nodes = tfNodes.reduce((map, node) => {
            map[node.name] = this.mapNode(node);
            if (node.op.startsWith('Placeholder')) {
                placeholders.push(map[node.name]);
            }
            else if (node.op === 'Const') {
                weights.push(map[node.name]);
            }
            else if (node.input == null || node.input.length === 0) {
                initNodes.push(map[node.name]);
            }
            return map;
        }, {});
        let inputs = [];
        const outputs = [];
        let inputNodeNameToKey = {};
        let outputNodeNameToKey = {};
        if (signature != null) {
            inputNodeNameToKey = this.mapSignatureEntries(signature.inputs);
            outputNodeNameToKey = this.mapSignatureEntries(signature.outputs);
        }
        const allNodes = Object.keys(nodes);
        allNodes.forEach(key => {
            const node = nodes[key];
            node.inputNames.forEach((name, index) => {
                const [nodeName, , outputName] = getNodeNameAndIndex(name);
                const inputNode = nodes[nodeName];
                if (inputNode.outputs != null) {
                    const outputIndex = inputNode.outputs.indexOf(outputName);
                    if (outputIndex !== -1) {
                        const inputName = `${nodeName}:${outputIndex}`;
                        // update the input name to use the mapped output index directly.
                        node.inputNames[index] = inputName;
                    }
                }
                node.inputs.push(inputNode);
                inputNode.children.push(node);
            });
        });
        // if signature has not outputs set, add any node that does not have
        // outputs.
        if (Object.keys(outputNodeNameToKey).length === 0) {
            allNodes.forEach(key => {
                const node = nodes[key];
                if (node.children.length === 0) {
                    outputs.push(node);
                }
            });
        }
        else {
            Object.keys(outputNodeNameToKey).forEach(name => {
                const [nodeName,] = getNodeNameAndIndex(name);
                const node = nodes[nodeName];
                if (node != null) {
                    node.signatureKey = outputNodeNameToKey[name];
                    outputs.push(node);
                }
            });
        }
        if (Object.keys(inputNodeNameToKey).length > 0) {
            Object.keys(inputNodeNameToKey).forEach(name => {
                const [nodeName,] = getNodeNameAndIndex(name);
                const node = nodes[nodeName];
                if (node) {
                    node.signatureKey = inputNodeNameToKey[name];
                    inputs.push(node);
                }
            });
        }
        else {
            inputs = placeholders;
        }
        let functions = {};
        if (graph.library != null && graph.library.function != null) {
            functions = graph.library.function.reduce((functions, func) => {
                functions[func.signature.name] = this.mapFunction(func);
                return functions;
            }, {});
        }
        const result = { nodes, inputs, outputs, weights, placeholders, signature, functions };
        if (initNodes.length > 0) {
            result.initNodes = initNodes;
        }
        return result;
    }
    mapSignatureEntries(entries) {
        return Object.keys(entries || {})
            .reduce((prev, curr) => {
            prev[entries[curr].name] = curr;
            return prev;
        }, {});
    }
    mapNode(node) {
        // Unsupported ops will cause an error at run-time (not parse time), since
        // they may not be used by the actual execution subgraph.
        const mapper = getRegisteredOp(node.op) || this.opMappers[node.op] || {};
        if (node.attr == null) {
            node.attr = {};
        }
        const newNode = {
            name: node.name,
            op: node.op,
            category: mapper.category,
            inputNames: (node.input ||
                []).map(input => input.startsWith('^') ? input.slice(1) : input),
            inputs: [],
            children: [],
            inputParams: {},
            attrParams: {},
            rawAttrs: node.attr,
            outputs: mapper.outputs
        };
        if (mapper.inputs != null) {
            newNode.inputParams =
                mapper.inputs.reduce((map, param) => {
                    map[param.name] = {
                        type: param.type,
                        inputIndexStart: param.start,
                        inputIndexEnd: param.end
                    };
                    return map;
                }, {});
        }
        if (mapper.attrs != null) {
            newNode.attrParams =
                mapper.attrs.reduce((map, param) => {
                    const type = param.type;
                    let value = undefined;
                    switch (param.type) {
                        case 'string':
                            value = getStringParam(node.attr, param.tfName, param.defaultValue);
                            if (value === undefined && !!param.tfDeprecatedName) {
                                value = getStringParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                            }
                            break;
                        case 'string[]':
                            value = getStringArrayParam(node.attr, param.tfName, param.defaultValue);
                            if (value === undefined && !!param.tfDeprecatedName) {
                                value = getStringArrayParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                            }
                            break;
                        case 'number':
                            value = getNumberParam(node.attr, param.tfName, (param.defaultValue || 0));
                            if (value === undefined && !!param.tfDeprecatedName) {
                                value = getNumberParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                            }
                            break;
                        case 'number[]':
                            value = getNumericArrayParam(node.attr, param.tfName, param.defaultValue);
                            if (value === undefined && !!param.tfDeprecatedName) {
                                value = getNumericArrayParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                            }
                            break;
                        case 'bool':
                            value = getBoolParam(node.attr, param.tfName, param.defaultValue);
                            if (value === undefined && !!param.tfDeprecatedName) {
                                value = getBoolParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                            }
                            break;
                        case 'bool[]':
                            value = getBoolArrayParam(node.attr, param.tfName, param.defaultValue);
                            if (value === undefined && !!param.tfDeprecatedName) {
                                value = getBoolArrayParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                            }
                            break;
                        case 'shape':
                            value = getTensorShapeParam(node.attr, param.tfName, param.defaultValue);
                            if (value === undefined && !!param.tfDeprecatedName) {
                                value = getTensorShapeParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                            }
                            break;
                        case 'shape[]':
                            value = getTensorShapeArrayParam(node.attr, param.tfName, param.defaultValue);
                            if (value === undefined && !!param.tfDeprecatedName) {
                                value = getTensorShapeArrayParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                            }
                            break;
                        case 'dtype':
                            value = getDtypeParam(node.attr, param.tfName, param.defaultValue);
                            if (value === undefined && !!param.tfDeprecatedName) {
                                value = getDtypeParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                            }
                            break;
                        case 'dtype[]':
                            value = getDtypeArrayParam(node.attr, param.tfName, param.defaultValue);
                            if (value === undefined && !!param.tfDeprecatedName) {
                                value = getDtypeArrayParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                            }
                            break;
                        case 'func':
                            value = getFuncParam(node.attr, param.tfName, param.defaultValue);
                            if (value === undefined && !!param.tfDeprecatedName) {
                                value = getFuncParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                            }
                            break;
                        case 'tensor':
                        case 'tensors':
                            break;
                        default:
                            throw new Error(`Unsupported param type: ${param.type} for op: ${node.op}`);
                    }
                    map[param.name] = { value, type };
                    return map;
                }, {});
        }
        return newNode;
    }
    // map the TFunctionDef to TFJS graph object
    mapFunction(functionDef) {
        const tfNodes = functionDef.nodeDef;
        const placeholders = [];
        const weights = [];
        let nodes = {};
        if (tfNodes != null) {
            nodes = tfNodes.reduce((map, node) => {
                map[node.name] = this.mapNode(node);
                if (node.op === 'Const') {
                    weights.push(map[node.name]);
                }
                return map;
            }, {});
        }
        const inputs = [];
        const outputs = [];
        functionDef.signature.inputArg.forEach(arg => {
            const [nodeName,] = getNodeNameAndIndex(arg.name);
            const node = {
                name: nodeName,
                op: 'Placeholder',
                inputs: [],
                inputNames: [],
                category: 'graph',
                inputParams: {},
                attrParams: { dtype: { value: parseDtypeParam(arg.type), type: 'dtype' } },
                children: []
            };
            node.signatureKey = arg.name;
            inputs.push(node);
            nodes[nodeName] = node;
        });
        const allNodes = Object.keys(nodes);
        allNodes.forEach(key => {
            const node = nodes[key];
            node.inputNames.forEach((name, index) => {
                const [nodeName, , outputName] = getNodeNameAndIndex(name);
                const inputNode = nodes[nodeName];
                if (inputNode.outputs != null) {
                    const outputIndex = inputNode.outputs.indexOf(outputName);
                    if (outputIndex !== -1) {
                        const inputName = `${nodeName}:${outputIndex}`;
                        // update the input name to use the mapped output index directly.
                        node.inputNames[index] = inputName;
                    }
                }
                node.inputs.push(inputNode);
                inputNode.children.push(node);
            });
        });
        const returnNodeMap = functionDef.ret;
        functionDef.signature.outputArg.forEach(output => {
            const [nodeName, index] = getNodeNameAndIndex(returnNodeMap[output.name]);
            const node = nodes[nodeName];
            if (node != null) {
                node.defaultOutput = index;
                outputs.push(node);
            }
        });
        const signature = this.mapArgsToSignature(functionDef);
        return { nodes, inputs, outputs, weights, placeholders, signature };
    }
    mapArgsToSignature(functionDef) {
        return {
            methodName: functionDef.signature.name,
            inputs: functionDef.signature.inputArg.reduce((map, arg) => {
                map[arg.name] = this.mapArgToTensorInfo(arg);
                return map;
            }, {}),
            outputs: functionDef.signature.outputArg.reduce((map, arg) => {
                map[arg.name] = this.mapArgToTensorInfo(arg, functionDef.ret);
                return map;
            }, {}),
        };
    }
    mapArgToTensorInfo(arg, nameMap) {
        let name = arg.name;
        if (nameMap != null) {
            name = nameMap[name];
        }
        return { name, dtype: arg.type };
    }
}
export function decodeBase64(text) {
    const global = env().global;
    if (typeof global.atob !== 'undefined') {
        return global.atob(text);
    }
    else if (typeof Buffer !== 'undefined') {
        return new Buffer(text, 'base64').toString();
    }
    else {
        throw new Error('Unable to decode base64 in this environment. ' +
            'Missing built-in atob() or Buffer()');
    }
}
export function parseStringParam(s, keepCase) {
    const value = Array.isArray(s) ? String.fromCharCode.apply(null, s) : decodeBase64(s);
    return keepCase ? value : value.toLowerCase();
}
export function getStringParam(attrs, name, def, keepCase = false) {
    const param = attrs[name];
    if (param != null) {
        return parseStringParam(param.s, keepCase);
    }
    return def;
}
export function getBoolParam(attrs, name, def) {
    const param = attrs[name];
    return param ? param.b : def;
}
export function getNumberParam(attrs, name, def) {
    const param = attrs[name] || {};
    const value = param['i'] != null ? param['i'] : (param['f'] != null ? param['f'] : def);
    return (typeof value === 'number') ? value : parseInt(value, 10);
}
export function parseDtypeParam(value) {
    if (typeof (value) === 'string') {
        // tslint:disable-next-line:no-any
        value = tensorflow.DataType[value];
    }
    switch (value) {
        case tensorflow.DataType.DT_FLOAT:
        case tensorflow.DataType.DT_HALF:
            return 'float32';
        case tensorflow.DataType.DT_INT32:
        case tensorflow.DataType.DT_INT64:
        case tensorflow.DataType.DT_INT8:
        case tensorflow.DataType.DT_UINT8:
            return 'int32';
        case tensorflow.DataType.DT_BOOL:
            return 'bool';
        case tensorflow.DataType.DT_DOUBLE:
            return 'float32';
        case tensorflow.DataType.DT_STRING:
            return 'string';
        default:
            // Unknown dtype error will happen at runtime (instead of parse time),
            // since these nodes might not be used by the actual subgraph execution.
            return null;
    }
}
export function getFuncParam(attrs, name, def) {
    const param = attrs[name];
    if (param && param.func) {
        return param.func.name;
    }
    return def;
}
export function getDtypeParam(attrs, name, def) {
    const param = attrs[name];
    if (param && param.type) {
        return parseDtypeParam(param.type);
    }
    return def;
}
export function getDtypeArrayParam(attrs, name, def) {
    const param = attrs[name];
    if (param && param.list && param.list.type) {
        return param.list.type.map(v => parseDtypeParam(v));
    }
    return def;
}
export function parseTensorShapeParam(shape) {
    if (shape.unknownRank) {
        return undefined;
    }
    if (shape.dim != null) {
        return shape.dim.map(dim => (typeof dim.size === 'number') ? dim.size : parseInt(dim.size, 10));
    }
    return [];
}
export function getTensorShapeParam(attrs, name, def) {
    const param = attrs[name];
    if (param && param.shape) {
        return parseTensorShapeParam(param.shape);
    }
    return def;
}
export function getNumericArrayParam(attrs, name, def) {
    const param = attrs[name];
    if (param) {
        return ((param.list.f && param.list.f.length ? param.list.f :
            param.list.i) ||
            [])
            .map(v => (typeof v === 'number') ? v : parseInt(v, 10));
    }
    return def;
}
export function getStringArrayParam(attrs, name, def, keepCase = false) {
    const param = attrs[name];
    if (param && param.list && param.list.s) {
        return param.list.s.map((v) => {
            return parseStringParam(v, keepCase);
        });
    }
    return def;
}
export function getTensorShapeArrayParam(attrs, name, def) {
    const param = attrs[name];
    if (param && param.list && param.list.shape) {
        return param.list.shape.map((v) => {
            return parseTensorShapeParam(v);
        });
    }
    return def;
}
export function getBoolArrayParam(attrs, name, def) {
    const param = attrs[name];
    if (param && param.list && param.list.b) {
        return param.list.b;
    }
    return def;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlcmF0aW9uX21hcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29udmVydGVyL3NyYy9vcGVyYXRpb25zL29wZXJhdGlvbl9tYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFXLEdBQUcsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRXBELE9BQU8sS0FBSyxVQUFVLE1BQU0sc0JBQXNCLENBQUM7QUFFbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3RELE9BQU8sS0FBSyxVQUFVLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxLQUFLLFNBQVMsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRCxPQUFPLEtBQUssT0FBTyxNQUFNLG1CQUFtQixDQUFDO0FBQzdDLE9BQU8sS0FBSyxXQUFXLE1BQU0sdUJBQXVCLENBQUM7QUFDckQsT0FBTyxLQUFLLFFBQVEsTUFBTSxvQkFBb0IsQ0FBQztBQUMvQyxPQUFPLEtBQUssT0FBTyxNQUFNLG1CQUFtQixDQUFDO0FBQzdDLE9BQU8sS0FBSyxVQUFVLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxLQUFLLEtBQUssTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEtBQUssU0FBUyxNQUFNLHNCQUFzQixDQUFDO0FBQ2xELE9BQU8sS0FBSyxLQUFLLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxLQUFLLE9BQU8sTUFBTSxtQkFBbUIsQ0FBQztBQUM3QyxPQUFPLEtBQUssUUFBUSxNQUFNLG9CQUFvQixDQUFDO0FBQy9DLE9BQU8sS0FBSyxhQUFhLE1BQU0seUJBQXlCLENBQUM7QUFDekQsT0FBTyxLQUFLLFNBQVMsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRCxPQUFPLEtB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M0MsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUNoQyxPQUFPLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO0tBQ0o7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxNQUFNLFVBQVUsaUJBQWlCLENBQzdCLEtBQTZDLEVBQUUsSUFBWSxFQUMzRCxHQUFjO0lBQ2hCLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO1FBQ3ZDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDckI7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RGF0YVR5cGUsIGVudn0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0ICogYXMgdGVuc29yZmxvdyBmcm9tICcuLi9kYXRhL2NvbXBpbGVkX2FwaSc7XG5cbmltcG9ydCB7Z2V0UmVnaXN0ZXJlZE9wfSBmcm9tICcuL2N1c3RvbV9vcC9yZWdpc3Rlcic7XG5pbXBvcnQge2dldE5vZGVOYW1lQW5kSW5kZXh9IGZyb20gJy4vZXhlY3V0b3JzL3V0aWxzJztcbmltcG9ydCAqIGFzIGFyaXRobWV0aWMgZnJvbSAnLi9vcF9saXN0L2FyaXRobWV0aWMnO1xuaW1wb3J0ICogYXMgYmFzaWNNYXRoIGZyb20gJy4vb3BfbGlzdC9iYXNpY19tYXRoJztcbmltcG9ydCAqIGFzIGNvbnRyb2wgZnJvbSAnLi9vcF9saXN0L2NvbnRyb2wnO1xuaW1wb3J0ICogYXMgY29udm9sdXRpb24gZnJvbSAnLi9vcF9saXN0L2NvbnZvbHV0aW9uJztcbmltcG9ydCAqIGFzIGNyZWF0aW9uIGZyb20gJy4vb3BfbGlzdC9jcmVhdGlvbic7XG5pbXBvcnQgKiBhcyBkeW5hbWljIGZyb20gJy4vb3BfbGlzdC9keW5hbWljJztcbmltcG9ydCAqIGFzIGV2YWx1YXRpb24gZnJvbSAnLi9vcF9saXN0L2V2YWx1YXRpb24nO1xuaW1wb3J0ICogYXMgZ3JhcGggZnJvbSAnLi9vcF9saXN0L2dyYXBoJztcbmltcG9ydCAqIGFzIGhhc2hUYWJsZSBmcm9tICcuL29wX2xpc3QvaGFzaF90YWJsZSc7XG5pbXBvcnQgKiBhcyBpbWFnZSBmcm9tICcuL29wX2xpc3QvaW1hZ2UnO1xuaW1wb3J0ICogYXMgbG9naWNhbCBmcm9tICcuL29wX2xpc3QvbG9naWNhbCc7XG5pbXBvcnQgKiBhcyBtYXRyaWNlcyBmcm9tICcuL29wX2xpc3QvbWF0cmljZXMnO1xuaW1wb3J0ICogYXMgbm9ybWFsaXphdGlvbiBmcm9tICcuL29wX2xpc3Qvbm9ybWFsaXphdGlvbic7XG5pbXBvcnQgKiBhcyByZWR1Y3Rpb24gZnJvbSAnLi9vcF9saXN0L3JlZHVjdGlvbic7XG5pbXBvcnQgKiBhcyBzbGljZUpvaW4gZnJvbSAnLi9vcF9saXN0L3NsaWNlX2pvaW4nO1xuaW1wb3J0ICogYXMgc3BhcnNlIGZyb20gJy4vb3BfbGlzdC9zcGFyc2UnO1xuaW1wb3J0ICogYXMgc3BlY3RyYWwgZnJvbSAnLi9vcF9saXN0L3NwZWN0cmFsJztcbmltcG9ydCAqIGFzIHN0cmluZyBmcm9tICcuL29wX2xpc3Qvc3RyaW5nJztcbmltcG9ydCAqIGFzIHRyYW5zZm9ybWF0aW9uIGZyb20gJy4vb3BfbGlzdC90cmFuc2Zvcm1hdGlvbic7XG5pbXBvcnQge0dyYXBoLCBJbnB1dFBhcmFtVmFsdWUsIE5vZGUsIE9wTWFwcGVyLCBQYXJhbVZhbHVlfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIE9wZXJhdGlvbk1hcHBlciB7XG4gIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogT3BlcmF0aW9uTWFwcGVyO1xuXG4gIHByaXZhdGUgb3BNYXBwZXJzOiB7W2tleTogc3RyaW5nXTogT3BNYXBwZXJ9O1xuXG4gIC8vIFNpbmdsZXRvbiBpbnN0YW5jZSBmb3IgdGhlIG1hcHBlclxuICBwdWJsaWMgc3RhdGljIGdldCBJbnN0YW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5faW5zdGFuY2UgfHwgKHRoaXMuX2luc3RhbmNlID0gbmV3IHRoaXMoKSk7XG4gIH1cblxuICAvLyBMb2FkcyB0aGUgb3AgbWFwcGluZyBmcm9tIHRoZSBKU09OIGZpbGUuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3Qgb3BzID0gW1xuICAgICAgYXJpdGhtZXRpYywgYmFzaWNNYXRoLCBjb250cm9sLCBjb252b2x1dGlvbiwgY3JlYXRpb24sIGR5bmFtaWMsXG4gICAgICBldmFsdWF0aW9uLCBncmFwaCwgaGFzaFRhYmxlLCBpbWFnZSwgbG9naWNhbCwgbWF0cmljZXMsIG5vcm1hbGl6YXRpb24sXG4gICAgICByZWR1Y3Rpb24sIHNsaWNlSm9pbiwgc3BhcnNlLCBzcGVjdHJhbCwgc3RyaW5nLCB0cmFuc2Zvcm1hdGlvblxuICAgIF07XG4gICAgY29uc3QgbWFwcGVyc0pzb246IE9wTWFwcGVyW10gPSBbXS5jb25jYXQoLi4ub3BzLm1hcChvcCA9PiBvcC5qc29uKSk7XG5cbiAgICB0aGlzLm9wTWFwcGVycyA9IG1hcHBlcnNKc29uLnJlZHVjZTx7W2tleTogc3RyaW5nXTogT3BNYXBwZXJ9PihcbiAgICAgICAgKG1hcCwgbWFwcGVyOiBPcE1hcHBlcikgPT4ge1xuICAgICAgICAgIG1hcFttYXBwZXIudGZPcE5hbWVdID0gbWFwcGVyO1xuICAgICAgICAgIHJldHVybiBtYXA7XG4gICAgICAgIH0sXG4gICAgICAgIHt9KTtcbiAgfVxuXG4gIC8vIENvbnZlcnRzIHRoZSBtb2RlbCBpbmZlcmVuY2UgZ3JhcGggZnJvbSBUZW5zb3JmbG93IEdyYXBoRGVmIHRvIGxvY2FsXG4gIC8vIHJlcHJlc2VudGF0aW9uIGZvciBUZW5zb3JGbG93LmpzIEFQSVxuICB0cmFuc2Zvcm1HcmFwaChcbiAgICAgIGdyYXBoOiB0ZW5zb3JmbG93LklHcmFwaERlZixcbiAgICAgIHNpZ25hdHVyZTogdGVuc29yZmxvdy5JU2lnbmF0dXJlRGVmID0ge30pOiBHcmFwaCB7XG4gICAgY29uc3QgdGZOb2RlcyA9IGdyYXBoLm5vZGU7XG4gICAgY29uc3QgcGxhY2Vob2xkZXJzOiBOb2RlW10gPSBbXTtcbiAgICBjb25zdCB3ZWlnaHRzOiBOb2RlW10gPSBbXTtcbiAgICBjb25zdCBpbml0Tm9kZXM6IE5vZGVbXSA9IFtdO1xuICAgIGNvbnN0IG5vZGVzID0gdGZOb2Rlcy5yZWR1Y2U8e1trZXk6IHN0cmluZ106IE5vZGV9PigobWFwLCBub2RlKSA9PiB7XG4gICAgICBtYXBbbm9kZS5uYW1lXSA9IHRoaXMubWFwTm9kZShub2RlKTtcbiAgICAgIGlmIChub2RlLm9wLnN0YXJ0c1dpdGgoJ1BsYWNlaG9sZGVyJykpIHtcbiAgICAgICAgcGxhY2Vob2xkZXJzLnB1c2gobWFwW25vZGUubmFtZV0pO1xuICAgICAgfSBlbHNlIGlmIChub2RlLm9wID09PSAnQ29uc3QnKSB7XG4gICAgICAgIHdlaWdodHMucHVzaChtYXBbbm9kZS5uYW1lXSk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUuaW5wdXQgPT0gbnVsbCB8fCBub2RlLmlucHV0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBpbml0Tm9kZXMucHVzaChtYXBbbm9kZS5uYW1lXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFwO1xuICAgIH0sIHt9KTtcblxuICAgIGxldCBpbnB1dHM6IE5vZGVbXSA9IFtdO1xuICAgIGNvbnN0IG91dHB1dHM6IE5vZGVbXSA9IFtdO1xuICAgIGxldCBpbnB1dE5vZGVOYW1lVG9LZXk6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG4gICAgbGV0IG91dHB1dE5vZGVOYW1lVG9LZXk6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG4gICAgaWYgKHNpZ25hdHVyZSAhPSBudWxsKSB7XG4gICAgICBpbnB1dE5vZGVOYW1lVG9LZXkgPSB0aGlzLm1hcFNpZ25hdHVyZUVudHJpZXMoc2lnbmF0dXJlLmlucHV0cyk7XG4gICAgICBvdXRwdXROb2RlTmFtZVRvS2V5ID0gdGhpcy5tYXBTaWduYXR1cmVFbnRyaWVzKHNpZ25hdHVyZS5vdXRwdXRzKTtcbiAgICB9XG4gICAgY29uc3QgYWxsTm9kZXMgPSBPYmplY3Qua2V5cyhub2Rlcyk7XG4gICAgYWxsTm9kZXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2tleV07XG4gICAgICBub2RlLmlucHV0TmFtZXMuZm9yRWFjaCgobmFtZSwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgW25vZGVOYW1lLCAsIG91dHB1dE5hbWVdID0gZ2V0Tm9kZU5hbWVBbmRJbmRleChuYW1lKTtcbiAgICAgICAgY29uc3QgaW5wdXROb2RlID0gbm9kZXNbbm9kZU5hbWVdO1xuICAgICAgICBpZiAoaW5wdXROb2RlLm91dHB1dHMgIT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IG91dHB1dEluZGV4ID0gaW5wdXROb2RlLm91dHB1dHMuaW5kZXhPZihvdXRwdXROYW1lKTtcbiAgICAgICAgICBpZiAob3V0cHV0SW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICBjb25zdCBpbnB1dE5hbWUgPSBgJHtub2RlTmFtZX06JHtvdXRwdXRJbmRleH1gO1xuICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBpbnB1dCBuYW1lIHRvIHVzZSB0aGUgbWFwcGVkIG91dHB1dCBpbmRleCBkaXJlY3RseS5cbiAgICAgICAgICAgIG5vZGUuaW5wdXROYW1lc1tpbmRleF0gPSBpbnB1dE5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG5vZGUuaW5wdXRzLnB1c2goaW5wdXROb2RlKTtcbiAgICAgICAgaW5wdXROb2RlLmNoaWxkcmVuLnB1c2gobm9kZSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIGlmIHNpZ25hdHVyZSBoYXMgbm90IG91dHB1dHMgc2V0LCBhZGQgYW55IG5vZGUgdGhhdCBkb2VzIG5vdCBoYXZlXG4gICAgLy8gb3V0cHV0cy5cbiAgICBpZiAoT2JqZWN0LmtleXMob3V0cHV0Tm9kZU5hbWVUb0tleSkubGVuZ3RoID09PSAwKSB7XG4gICAgICBhbGxOb2Rlcy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1trZXldO1xuICAgICAgICBpZiAobm9kZS5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBvdXRwdXRzLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBPYmplY3Qua2V5cyhvdXRwdXROb2RlTmFtZVRvS2V5KS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICBjb25zdCBbbm9kZU5hbWUsIF0gPSBnZXROb2RlTmFtZUFuZEluZGV4KG5hbWUpO1xuICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbbm9kZU5hbWVdO1xuICAgICAgICBpZiAobm9kZSAhPSBudWxsKSB7XG4gICAgICAgICAgbm9kZS5zaWduYXR1cmVLZXkgPSBvdXRwdXROb2RlTmFtZVRvS2V5W25hbWVdO1xuICAgICAgICAgIG91dHB1dHMucHVzaChub2RlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKE9iamVjdC5rZXlzKGlucHV0Tm9kZU5hbWVUb0tleSkubGVuZ3RoID4gMCkge1xuICAgICAgT2JqZWN0LmtleXMoaW5wdXROb2RlTmFtZVRvS2V5KS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICBjb25zdCBbbm9kZU5hbWUsIF0gPSBnZXROb2RlTmFtZUFuZEluZGV4KG5hbWUpO1xuICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbbm9kZU5hbWVdO1xuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgIG5vZGUuc2lnbmF0dXJlS2V5ID0gaW5wdXROb2RlTmFtZVRvS2V5W25hbWVdO1xuICAgICAgICAgIGlucHV0cy5wdXNoKG5vZGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5wdXRzID0gcGxhY2Vob2xkZXJzO1xuICAgIH1cblxuICAgIGxldCBmdW5jdGlvbnMgPSB7fTtcbiAgICBpZiAoZ3JhcGgubGlicmFyeSAhPSBudWxsICYmIGdyYXBoLmxpYnJhcnkuZnVuY3Rpb24gIT0gbnVsbCkge1xuICAgICAgZnVuY3Rpb25zID0gZ3JhcGgubGlicmFyeS5mdW5jdGlvbi5yZWR1Y2UoKGZ1bmN0aW9ucywgZnVuYykgPT4ge1xuICAgICAgICBmdW5jdGlvbnNbZnVuYy5zaWduYXR1cmUubmFtZV0gPSB0aGlzLm1hcEZ1bmN0aW9uKGZ1bmMpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb25zO1xuICAgICAgfSwge30gYXMge1trZXk6IHN0cmluZ106IEdyYXBofSk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0OiBHcmFwaCA9XG4gICAgICAgIHtub2RlcywgaW5wdXRzLCBvdXRwdXRzLCB3ZWlnaHRzLCBwbGFjZWhvbGRlcnMsIHNpZ25hdHVyZSwgZnVuY3Rpb25zfTtcblxuICAgIGlmIChpbml0Tm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgcmVzdWx0LmluaXROb2RlcyA9IGluaXROb2RlcztcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBtYXBTaWduYXR1cmVFbnRyaWVzKGVudHJpZXM6IHtbazogc3RyaW5nXTogdGVuc29yZmxvdy5JVGVuc29ySW5mb30pIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZW50cmllcyB8fCB7fSlcbiAgICAgICAgLnJlZHVjZTx7W2tleTogc3RyaW5nXTogc3RyaW5nfT4oKHByZXYsIGN1cnIpID0+IHtcbiAgICAgICAgICBwcmV2W2VudHJpZXNbY3Vycl0ubmFtZV0gPSBjdXJyO1xuICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICB9LCB7fSk7XG4gIH1cblxuICBwcml2YXRlIG1hcE5vZGUobm9kZTogdGVuc29yZmxvdy5JTm9kZURlZik6IE5vZGUge1xuICAgIC8vIFVuc3VwcG9ydGVkIG9wcyB3aWxsIGNhdXNlIGFuIGVycm9yIGF0IHJ1bi10aW1lIChub3QgcGFyc2UgdGltZSksIHNpbmNlXG4gICAgLy8gdGhleSBtYXkgbm90IGJlIHVzZWQgYnkgdGhlIGFjdHVhbCBleGVjdXRpb24gc3ViZ3JhcGguXG4gICAgY29uc3QgbWFwcGVyID1cbiAgICAgICAgZ2V0UmVnaXN0ZXJlZE9wKG5vZGUub3ApIHx8IHRoaXMub3BNYXBwZXJzW25vZGUub3BdIHx8IHt9IGFzIE9wTWFwcGVyO1xuICAgIGlmIChub2RlLmF0dHIgPT0gbnVsbCkge1xuICAgICAgbm9kZS5hdHRyID0ge307XG4gICAgfVxuXG4gICAgY29uc3QgbmV3Tm9kZTogTm9kZSA9IHtcbiAgICAgIG5hbWU6IG5vZGUubmFtZSxcbiAgICAgIG9wOiBub2RlLm9wLFxuICAgICAgY2F0ZWdvcnk6IG1hcHBlci5jYXRlZ29yeSxcbiAgICAgIGlucHV0TmFtZXM6XG4gICAgICAgICAgKG5vZGUuaW5wdXQgfHxcbiAgICAgICAgICAgW10pLm1hcChpbnB1dCA9PiBpbnB1dC5zdGFydHNXaXRoKCdeJykgPyBpbnB1dC5zbGljZSgxKSA6IGlucHV0KSxcbiAgICAgIGlucHV0czogW10sXG4gICAgICBjaGlsZHJlbjogW10sXG4gICAgICBpbnB1dFBhcmFtczoge30sXG4gICAgICBhdHRyUGFyYW1zOiB7fSxcbiAgICAgIHJhd0F0dHJzOiBub2RlLmF0dHIsXG4gICAgICBvdXRwdXRzOiBtYXBwZXIub3V0cHV0c1xuICAgIH07XG5cbiAgICBpZiAobWFwcGVyLmlucHV0cyAhPSBudWxsKSB7XG4gICAgICBuZXdOb2RlLmlucHV0UGFyYW1zID1cbiAgICAgICAgICBtYXBwZXIuaW5wdXRzLnJlZHVjZTx7W2tleTogc3RyaW5nXTogSW5wdXRQYXJhbVZhbHVlfT4oXG4gICAgICAgICAgICAgIChtYXAsIHBhcmFtKSA9PiB7XG4gICAgICAgICAgICAgICAgbWFwW3BhcmFtLm5hbWVdID0ge1xuICAgICAgICAgICAgICAgICAgdHlwZTogcGFyYW0udHlwZSxcbiAgICAgICAgICAgICAgICAgIGlucHV0SW5kZXhTdGFydDogcGFyYW0uc3RhcnQsXG4gICAgICAgICAgICAgICAgICBpbnB1dEluZGV4RW5kOiBwYXJhbS5lbmRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXA7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHt9KTtcbiAgICB9XG4gICAgaWYgKG1hcHBlci5hdHRycyAhPSBudWxsKSB7XG4gICAgICBuZXdOb2RlLmF0dHJQYXJhbXMgPVxuICAgICAgICAgIG1hcHBlci5hdHRycy5yZWR1Y2U8e1trZXk6IHN0cmluZ106IFBhcmFtVmFsdWV9PigobWFwLCBwYXJhbSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdHlwZSA9IHBhcmFtLnR5cGU7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBzd2l0Y2ggKHBhcmFtLnR5cGUpIHtcbiAgICAgICAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGdldFN0cmluZ1BhcmFtKFxuICAgICAgICAgICAgICAgICAgICBub2RlLmF0dHIsIHBhcmFtLnRmTmFtZSwgcGFyYW0uZGVmYXVsdFZhbHVlIGFzIHN0cmluZyk7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhIXBhcmFtLnRmRGVwcmVjYXRlZE5hbWUpIHtcbiAgICAgICAgICAgICAgICAgIHZhbHVlID0gZ2V0U3RyaW5nUGFyYW0oXG4gICAgICAgICAgICAgICAgICAgICAgbm9kZS5hdHRyLCBwYXJhbS50ZkRlcHJlY2F0ZWROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgIHBhcmFtLmRlZmF1bHRWYWx1ZSBhcyBzdHJpbmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnc3RyaW5nW10nOlxuICAgICAgICAgICAgICAgIHZhbHVlID0gZ2V0U3RyaW5nQXJyYXlQYXJhbShcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5hdHRyLCBwYXJhbS50Zk5hbWUsIHBhcmFtLmRlZmF1bHRWYWx1ZSBhcyBzdHJpbmdbXSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhIXBhcmFtLnRmRGVwcmVjYXRlZE5hbWUpIHtcbiAgICAgICAgICAgICAgICAgIHZhbHVlID0gZ2V0U3RyaW5nQXJyYXlQYXJhbShcbiAgICAgICAgICAgICAgICAgICAgICBub2RlLmF0dHIsIHBhcmFtLnRmRGVwcmVjYXRlZE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgcGFyYW0uZGVmYXVsdFZhbHVlIGFzIHN0cmluZ1tdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBnZXROdW1iZXJQYXJhbShcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5hdHRyLCBwYXJhbS50Zk5hbWUsXG4gICAgICAgICAgICAgICAgICAgIChwYXJhbS5kZWZhdWx0VmFsdWUgfHwgMCkgYXMgbnVtYmVyKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhIXBhcmFtLnRmRGVwcmVjYXRlZE5hbWUpIHtcbiAgICAgICAgICAgICAgICAgIHZhbHVlID0gZ2V0TnVtYmVyUGFyYW0oXG4gICAgICAgICAgICAgICAgICAgICAgbm9kZS5hdHRyLCBwYXJhbS50ZkRlcHJlY2F0ZWROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgIHBhcmFtLmRlZmF1bHRWYWx1ZSBhcyBudW1iZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnbnVtYmVyW10nOlxuICAgICAgICAgICAgICAgIHZhbHVlID0gZ2V0TnVtZXJpY0FycmF5UGFyYW0oXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuYXR0ciwgcGFyYW0udGZOYW1lLCBwYXJhbS5kZWZhdWx0VmFsdWUgYXMgbnVtYmVyW10pO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEhcGFyYW0udGZEZXByZWNhdGVkTmFtZSkge1xuICAgICAgICAgICAgICAgICAgdmFsdWUgPSBnZXROdW1lcmljQXJyYXlQYXJhbShcbiAgICAgICAgICAgICAgICAgICAgICBub2RlLmF0dHIsIHBhcmFtLnRmRGVwcmVjYXRlZE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgcGFyYW0uZGVmYXVsdFZhbHVlIGFzIG51bWJlcltdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2Jvb2wnOlxuICAgICAgICAgICAgICAgIHZhbHVlID0gZ2V0Qm9vbFBhcmFtKFxuICAgICAgICAgICAgICAgICAgICBub2RlLmF0dHIsIHBhcmFtLnRmTmFtZSwgcGFyYW0uZGVmYXVsdFZhbHVlIGFzIGJvb2xlYW4pO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEhcGFyYW0udGZEZXByZWNhdGVkTmFtZSkge1xuICAgICAgICAgICAgICAgICAgdmFsdWUgPSBnZXRCb29sUGFyYW0oXG4gICAgICAgICAgICAgICAgICAgICAgbm9kZS5hdHRyLCBwYXJhbS50ZkRlcHJlY2F0ZWROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgIHBhcmFtLmRlZmF1bHRWYWx1ZSBhcyBib29sZWFuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2Jvb2xbXSc6XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBnZXRCb29sQXJyYXlQYXJhbShcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5hdHRyLCBwYXJhbS50Zk5hbWUsIHBhcmFtLmRlZmF1bHRWYWx1ZSBhcyBib29sZWFuW10pO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEhcGFyYW0udGZEZXByZWNhdGVkTmFtZSkge1xuICAgICAgICAgICAgICAgICAgdmFsdWUgPSBnZXRCb29sQXJyYXlQYXJhbShcbiAgICAgICAgICAgICAgICAgICAgICBub2RlLmF0dHIsIHBhcmFtLnRmRGVwcmVjYXRlZE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgcGFyYW0uZGVmYXVsdFZhbHVlIGFzIGJvb2xlYW5bXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdzaGFwZSc6XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBnZXRUZW5zb3JTaGFwZVBhcmFtKFxuICAgICAgICAgICAgICAgICAgICBub2RlLmF0dHIsIHBhcmFtLnRmTmFtZSwgcGFyYW0uZGVmYXVsdFZhbHVlIGFzIG51bWJlcltdKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhIXBhcmFtLnRmRGVwcmVjYXRlZE5hbWUpIHtcbiAgICAgICAgICAgICAgICAgIHZhbHVlID0gZ2V0VGVuc29yU2hhcGVQYXJhbShcbiAgICAgICAgICAgICAgICAgICAgICBub2RlLmF0dHIsIHBhcmFtLnRmRGVwcmVjYXRlZE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgcGFyYW0uZGVmYXVsdFZhbHVlIGFzIG51bWJlcltdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ3NoYXBlW10nOlxuICAgICAgICAgICAgICAgIHZhbHVlID0gZ2V0VGVuc29yU2hhcGVBcnJheVBhcmFtKFxuICAgICAgICAgICAgICAgICAgICBub2RlLmF0dHIsIHBhcmFtLnRmTmFtZSwgcGFyYW0uZGVmYXVsdFZhbHVlIGFzIG51bWJlcltdW10pO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEhcGFyYW0udGZEZXByZWNhdGVkTmFtZSkge1xuICAgICAgICAgICAgICAgICAgdmFsdWUgPSBnZXRUZW5zb3JTaGFwZUFycmF5UGFyYW0oXG4gICAgICAgICAgICAgICAgICAgICAgbm9kZS5hdHRyLCBwYXJhbS50ZkRlcHJlY2F0ZWROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgIHBhcmFtLmRlZmF1bHRWYWx1ZSBhcyBudW1iZXJbXVtdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2R0eXBlJzpcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGdldER0eXBlUGFyYW0oXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuYXR0ciwgcGFyYW0udGZOYW1lLCBwYXJhbS5kZWZhdWx0VmFsdWUgYXMgRGF0YVR5cGUpO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEhcGFyYW0udGZEZXByZWNhdGVkTmFtZSkge1xuICAgICAgICAgICAgICAgICAgdmFsdWUgPSBnZXREdHlwZVBhcmFtKFxuICAgICAgICAgICAgICAgICAgICAgIG5vZGUuYXR0ciwgcGFyYW0udGZEZXByZWNhdGVkTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICBwYXJhbS5kZWZhdWx0VmFsdWUgYXMgRGF0YVR5cGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnZHR5cGVbXSc6XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBnZXREdHlwZUFycmF5UGFyYW0oXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuYXR0ciwgcGFyYW0udGZOYW1lLCBwYXJhbS5kZWZhdWx0VmFsdWUgYXMgRGF0YVR5cGVbXSk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgISFwYXJhbS50ZkRlcHJlY2F0ZWROYW1lKSB7XG4gICAgICAgICAgICAgICAgICB2YWx1ZSA9IGdldER0eXBlQXJyYXlQYXJhbShcbiAgICAgICAgICAgICAgICAgICAgICBub2RlLmF0dHIsIHBhcmFtLnRmRGVwcmVjYXRlZE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgcGFyYW0uZGVmYXVsdFZhbHVlIGFzIERhdGFUeXBlW10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnZnVuYyc6XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBnZXRGdW5jUGFyYW0oXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuYXR0ciwgcGFyYW0udGZOYW1lLCBwYXJhbS5kZWZhdWx0VmFsdWUgYXMgc3RyaW5nKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhIXBhcmFtLnRmRGVwcmVjYXRlZE5hbWUpIHtcbiAgICAgICAgICAgICAgICAgIHZhbHVlID0gZ2V0RnVuY1BhcmFtKFxuICAgICAgICAgICAgICAgICAgICAgIG5vZGUuYXR0ciwgcGFyYW0udGZEZXByZWNhdGVkTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICBwYXJhbS5kZWZhdWx0VmFsdWUgYXMgc3RyaW5nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ3RlbnNvcic6XG4gICAgICAgICAgICAgIGNhc2UgJ3RlbnNvcnMnOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgYFVuc3VwcG9ydGVkIHBhcmFtIHR5cGU6ICR7cGFyYW0udHlwZX0gZm9yIG9wOiAke25vZGUub3B9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXBbcGFyYW0ubmFtZV0gPSB7dmFsdWUsIHR5cGV9O1xuICAgICAgICAgICAgcmV0dXJuIG1hcDtcbiAgICAgICAgICB9LCB7fSk7XG4gICAgfVxuICAgIHJldHVybiBuZXdOb2RlO1xuICB9XG5cbiAgLy8gbWFwIHRoZSBURnVuY3Rpb25EZWYgdG8gVEZKUyBncmFwaCBvYmplY3RcbiAgcHJpdmF0ZSBtYXBGdW5jdGlvbihmdW5jdGlvbkRlZjogdGVuc29yZmxvdy5JRnVuY3Rpb25EZWYpOiBHcmFwaCB7XG4gICAgY29uc3QgdGZOb2RlcyA9IGZ1bmN0aW9uRGVmLm5vZGVEZWY7XG4gICAgY29uc3QgcGxhY2Vob2xkZXJzOiBOb2RlW10gPSBbXTtcbiAgICBjb25zdCB3ZWlnaHRzOiBOb2RlW10gPSBbXTtcbiAgICBsZXQgbm9kZXM6IHtba2V5OiBzdHJpbmddOiBOb2RlfSA9IHt9O1xuICAgIGlmICh0Zk5vZGVzICE9IG51bGwpIHtcbiAgICAgIG5vZGVzID0gdGZOb2Rlcy5yZWR1Y2U8e1trZXk6IHN0cmluZ106IE5vZGV9PigobWFwLCBub2RlKSA9PiB7XG4gICAgICAgIG1hcFtub2RlLm5hbWVdID0gdGhpcy5tYXBOb2RlKG5vZGUpO1xuICAgICAgICBpZiAobm9kZS5vcCA9PT0gJ0NvbnN0Jykge1xuICAgICAgICAgIHdlaWdodHMucHVzaChtYXBbbm9kZS5uYW1lXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICAgIH0sIHt9KTtcbiAgICB9XG4gICAgY29uc3QgaW5wdXRzOiBOb2RlW10gPSBbXTtcbiAgICBjb25zdCBvdXRwdXRzOiBOb2RlW10gPSBbXTtcblxuICAgIGZ1bmN0aW9uRGVmLnNpZ25hdHVyZS5pbnB1dEFyZy5mb3JFYWNoKGFyZyA9PiB7XG4gICAgICBjb25zdCBbbm9kZU5hbWUsIF0gPSBnZXROb2RlTmFtZUFuZEluZGV4KGFyZy5uYW1lKTtcbiAgICAgIGNvbnN0IG5vZGU6IE5vZGUgPSB7XG4gICAgICAgIG5hbWU6IG5vZGVOYW1lLFxuICAgICAgICBvcDogJ1BsYWNlaG9sZGVyJyxcbiAgICAgICAgaW5wdXRzOiBbXSxcbiAgICAgICAgaW5wdXROYW1lczogW10sXG4gICAgICAgIGNhdGVnb3J5OiAnZ3JhcGgnLFxuICAgICAgICBpbnB1dFBhcmFtczoge30sXG4gICAgICAgIGF0dHJQYXJhbXM6IHtkdHlwZToge3ZhbHVlOiBwYXJzZUR0eXBlUGFyYW0oYXJnLnR5cGUpLCB0eXBlOiAnZHR5cGUnfX0sXG4gICAgICAgIGNoaWxkcmVuOiBbXVxuICAgICAgfTtcbiAgICAgIG5vZGUuc2lnbmF0dXJlS2V5ID0gYXJnLm5hbWU7XG4gICAgICBpbnB1dHMucHVzaChub2RlKTtcbiAgICAgIG5vZGVzW25vZGVOYW1lXSA9IG5vZGU7XG4gICAgfSk7XG5cbiAgICBjb25zdCBhbGxOb2RlcyA9IE9iamVjdC5rZXlzKG5vZGVzKTtcbiAgICBhbGxOb2Rlcy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBjb25zdCBub2RlID0gbm9kZXNba2V5XTtcbiAgICAgIG5vZGUuaW5wdXROYW1lcy5mb3JFYWNoKChuYW1lLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBbbm9kZU5hbWUsICwgb3V0cHV0TmFtZV0gPSBnZXROb2RlTmFtZUFuZEluZGV4KG5hbWUpO1xuICAgICAgICBjb25zdCBpbnB1dE5vZGUgPSBub2Rlc1tub2RlTmFtZV07XG4gICAgICAgIGlmIChpbnB1dE5vZGUub3V0cHV0cyAhPSBudWxsKSB7XG4gICAgICAgICAgY29uc3Qgb3V0cHV0SW5kZXggPSBpbnB1dE5vZGUub3V0cHV0cy5pbmRleE9mKG91dHB1dE5hbWUpO1xuICAgICAgICAgIGlmIChvdXRwdXRJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGNvbnN0IGlucHV0TmFtZSA9IGAke25vZGVOYW1lfToke291dHB1dEluZGV4fWA7XG4gICAgICAgICAgICAvLyB1cGRhdGUgdGhlIGlucHV0IG5hbWUgdG8gdXNlIHRoZSBtYXBwZWQgb3V0cHV0IGluZGV4IGRpcmVjdGx5LlxuICAgICAgICAgICAgbm9kZS5pbnB1dE5hbWVzW2luZGV4XSA9IGlucHV0TmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbm9kZS5pbnB1dHMucHVzaChpbnB1dE5vZGUpO1xuICAgICAgICBpbnB1dE5vZGUuY2hpbGRyZW4ucHVzaChub2RlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgY29uc3QgcmV0dXJuTm9kZU1hcCA9IGZ1bmN0aW9uRGVmLnJldDtcblxuICAgIGZ1bmN0aW9uRGVmLnNpZ25hdHVyZS5vdXRwdXRBcmcuZm9yRWFjaChvdXRwdXQgPT4ge1xuICAgICAgY29uc3QgW25vZGVOYW1lLCBpbmRleF0gPSBnZXROb2RlTmFtZUFuZEluZGV4KHJldHVybk5vZGVNYXBbb3V0cHV0Lm5hbWVdKTtcbiAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tub2RlTmFtZV07XG4gICAgICBpZiAobm9kZSAhPSBudWxsKSB7XG4gICAgICAgIG5vZGUuZGVmYXVsdE91dHB1dCA9IGluZGV4O1xuICAgICAgICBvdXRwdXRzLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBzaWduYXR1cmUgPSB0aGlzLm1hcEFyZ3NUb1NpZ25hdHVyZShmdW5jdGlvbkRlZik7XG4gICAgcmV0dXJuIHtub2RlcywgaW5wdXRzLCBvdXRwdXRzLCB3ZWlnaHRzLCBwbGFjZWhvbGRlcnMsIHNpZ25hdHVyZX07XG4gIH1cblxuICBwcml2YXRlIG1hcEFyZ3NUb1NpZ25hdHVyZShmdW5jdGlvbkRlZjogdGVuc29yZmxvdy5JRnVuY3Rpb25EZWYpOlxuICAgICAgdGVuc29yZmxvdy5JU2lnbmF0dXJlRGVmIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWV0aG9kTmFtZTogZnVuY3Rpb25EZWYuc2lnbmF0dXJlLm5hbWUsXG4gICAgICBpbnB1dHM6IGZ1bmN0aW9uRGVmLnNpZ25hdHVyZS5pbnB1dEFyZy5yZWR1Y2UoXG4gICAgICAgICAgKG1hcCwgYXJnKSA9PiB7XG4gICAgICAgICAgICBtYXBbYXJnLm5hbWVdID0gdGhpcy5tYXBBcmdUb1RlbnNvckluZm8oYXJnKTtcbiAgICAgICAgICAgIHJldHVybiBtYXA7XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7fSBhcyB7W2tleTogc3RyaW5nXTogdGVuc29yZmxvdy5JVGVuc29ySW5mb30pLFxuICAgICAgb3V0cHV0czogZnVuY3Rpb25EZWYuc2lnbmF0dXJlLm91dHB1dEFyZy5yZWR1Y2UoXG4gICAgICAgICAgKG1hcCwgYXJnKSA9PiB7XG4gICAgICAgICAgICBtYXBbYXJnLm5hbWVdID0gdGhpcy5tYXBBcmdUb1RlbnNvckluZm8oYXJnLCBmdW5jdGlvbkRlZi5yZXQpO1xuICAgICAgICAgICAgcmV0dXJuIG1hcDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHt9IGFzIHtba2V5OiBzdHJpbmddOiB0ZW5zb3JmbG93LklUZW5zb3JJbmZvfSksXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgbWFwQXJnVG9UZW5zb3JJbmZvKFxuICAgICAgYXJnOiB0ZW5zb3JmbG93Lk9wRGVmLklBcmdEZWYsXG4gICAgICBuYW1lTWFwPzoge1trZXk6IHN0cmluZ106IHN0cmluZ30pOiB0ZW5zb3JmbG93LklUZW5zb3JJbmZvIHtcbiAgICBsZXQgbmFtZSA9IGFyZy5uYW1lO1xuICAgIGlmIChuYW1lTWFwICE9IG51bGwpIHtcbiAgICAgIG5hbWUgPSBuYW1lTWFwW25hbWVdO1xuICAgIH1cbiAgICByZXR1cm4ge25hbWUsIGR0eXBlOiBhcmcudHlwZX07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY29kZUJhc2U2NCh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBnbG9iYWwgPSBlbnYoKS5nbG9iYWw7XG4gIGlmICh0eXBlb2YgZ2xvYmFsLmF0b2IgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGdsb2JhbC5hdG9iKHRleHQpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBCdWZmZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIodGV4dCwgJ2Jhc2U2NCcpLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVW5hYmxlIHRvIGRlY29kZSBiYXNlNjQgaW4gdGhpcyBlbnZpcm9ubWVudC4gJyArXG4gICAgICAgICdNaXNzaW5nIGJ1aWx0LWluIGF0b2IoKSBvciBCdWZmZXIoKScpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVN0cmluZ1BhcmFtKHM6IFtdfHN0cmluZywga2VlcENhc2U6IGJvb2xlYW4pOiBzdHJpbmcge1xuICBjb25zdCB2YWx1ZSA9XG4gICAgICBBcnJheS5pc0FycmF5KHMpID8gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBzKSA6IGRlY29kZUJhc2U2NChzKTtcbiAgcmV0dXJuIGtlZXBDYXNlID8gdmFsdWUgOiB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RyaW5nUGFyYW0oXG4gICAgYXR0cnM6IHtba2V5OiBzdHJpbmddOiB0ZW5zb3JmbG93LklBdHRyVmFsdWV9LCBuYW1lOiBzdHJpbmcsIGRlZjogc3RyaW5nLFxuICAgIGtlZXBDYXNlID0gZmFsc2UpOiBzdHJpbmcge1xuICBjb25zdCBwYXJhbSA9IGF0dHJzW25hbWVdO1xuICBpZiAocGFyYW0gIT0gbnVsbCkge1xuICAgIHJldHVybiBwYXJzZVN0cmluZ1BhcmFtKHBhcmFtLnMsIGtlZXBDYXNlKTtcbiAgfVxuICByZXR1cm4gZGVmO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Qm9vbFBhcmFtKFxuICAgIGF0dHJzOiB7W2tleTogc3RyaW5nXTogdGVuc29yZmxvdy5JQXR0clZhbHVlfSwgbmFtZTogc3RyaW5nLFxuICAgIGRlZjogYm9vbGVhbik6IGJvb2xlYW4ge1xuICBjb25zdCBwYXJhbSA9IGF0dHJzW25hbWVdO1xuICByZXR1cm4gcGFyYW0gPyBwYXJhbS5iIDogZGVmO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TnVtYmVyUGFyYW0oXG4gICAgYXR0cnM6IHtba2V5OiBzdHJpbmddOiB0ZW5zb3JmbG93LklBdHRyVmFsdWV9LCBuYW1lOiBzdHJpbmcsXG4gICAgZGVmOiBudW1iZXIpOiBudW1iZXIge1xuICBjb25zdCBwYXJhbSA9IGF0dHJzW25hbWVdIHx8IHt9O1xuICBjb25zdCB2YWx1ZSA9XG4gICAgICBwYXJhbVsnaSddICE9IG51bGwgPyBwYXJhbVsnaSddIDogKHBhcmFtWydmJ10gIT0gbnVsbCA/IHBhcmFtWydmJ10gOiBkZWYpO1xuICByZXR1cm4gKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpID8gdmFsdWUgOiBwYXJzZUludCh2YWx1ZSwgMTApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VEdHlwZVBhcmFtKHZhbHVlOiBzdHJpbmd8dGVuc29yZmxvdy5EYXRhVHlwZSk6IERhdGFUeXBlIHtcbiAgaWYgKHR5cGVvZiAodmFsdWUpID09PSAnc3RyaW5nJykge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICB2YWx1ZSA9IHRlbnNvcmZsb3cuRGF0YVR5cGVbdmFsdWUgYXMgYW55XTtcbiAgfVxuICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgY2FzZSB0ZW5zb3JmbG93LkRhdGFUeXBlLkRUX0ZMT0FUOlxuICAgIGNhc2UgdGVuc29yZmxvdy5EYXRhVHlwZS5EVF9IQUxGOlxuICAgICAgcmV0dXJuICdmbG9hdDMyJztcbiAgICBjYXNlIHRlbnNvcmZsb3cuRGF0YVR5cGUuRFRfSU5UMzI6XG4gICAgY2FzZSB0ZW5zb3JmbG93LkRhdGFUeXBlLkRUX0lOVDY0OlxuICAgIGNhc2UgdGVuc29yZmxvdy5EYXRhVHlwZS5EVF9JTlQ4OlxuICAgIGNhc2UgdGVuc29yZmxvdy5EYXRhVHlwZS5EVF9VSU5UODpcbiAgICAgIHJldHVybiAnaW50MzInO1xuICAgIGNhc2UgdGVuc29yZmxvdy5EYXRhVHlwZS5EVF9CT09MOlxuICAgICAgcmV0dXJuICdib29sJztcbiAgICBjYXNlIHRlbnNvcmZsb3cuRGF0YVR5cGUuRFRfRE9VQkxFOlxuICAgICAgcmV0dXJuICdmbG9hdDMyJztcbiAgICBjYXNlIHRlbnNvcmZsb3cuRGF0YVR5cGUuRFRfU1RSSU5HOlxuICAgICAgcmV0dXJuICdzdHJpbmcnO1xuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBVbmtub3duIGR0eXBlIGVycm9yIHdpbGwgaGFwcGVuIGF0IHJ1bnRpbWUgKGluc3RlYWQgb2YgcGFyc2UgdGltZSksXG4gICAgICAvLyBzaW5jZSB0aGVzZSBub2RlcyBtaWdodCBub3QgYmUgdXNlZCBieSB0aGUgYWN0dWFsIHN1YmdyYXBoIGV4ZWN1dGlvbi5cbiAgICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGdW5jUGFyYW0oXG4gICAgYXR0cnM6IHtba2V5OiBzdHJpbmddOiB0ZW5zb3JmbG93LklBdHRyVmFsdWV9LCBuYW1lOiBzdHJpbmcsXG4gICAgZGVmOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBwYXJhbSA9IGF0dHJzW25hbWVdO1xuICBpZiAocGFyYW0gJiYgcGFyYW0uZnVuYykge1xuICAgIHJldHVybiBwYXJhbS5mdW5jLm5hbWU7XG4gIH1cbiAgcmV0dXJuIGRlZjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldER0eXBlUGFyYW0oXG4gICAgYXR0cnM6IHtba2V5OiBzdHJpbmddOiB0ZW5zb3JmbG93LklBdHRyVmFsdWV9LCBuYW1lOiBzdHJpbmcsXG4gICAgZGVmOiBEYXRhVHlwZSk6IERhdGFUeXBlIHtcbiAgY29uc3QgcGFyYW0gPSBhdHRyc1tuYW1lXTtcbiAgaWYgKHBhcmFtICYmIHBhcmFtLnR5cGUpIHtcbiAgICByZXR1cm4gcGFyc2VEdHlwZVBhcmFtKHBhcmFtLnR5cGUpO1xuICB9XG4gIHJldHVybiBkZWY7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREdHlwZUFycmF5UGFyYW0oXG4gICAgYXR0cnM6IHtba2V5OiBzdHJpbmddOiB0ZW5zb3JmbG93LklBdHRyVmFsdWV9LCBuYW1lOiBzdHJpbmcsXG4gICAgZGVmOiBEYXRhVHlwZVtdKTogRGF0YVR5cGVbXSB7XG4gIGNvbnN0IHBhcmFtID0gYXR0cnNbbmFtZV07XG4gIGlmIChwYXJhbSAmJiBwYXJhbS5saXN0ICYmIHBhcmFtLmxpc3QudHlwZSkge1xuICAgIHJldHVybiBwYXJhbS5saXN0LnR5cGUubWFwKHYgPT4gcGFyc2VEdHlwZVBhcmFtKHYpKTtcbiAgfVxuICByZXR1cm4gZGVmO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUZW5zb3JTaGFwZVBhcmFtKHNoYXBlOiB0ZW5zb3JmbG93LklUZW5zb3JTaGFwZSk6IG51bWJlcltdfFxuICAgIHVuZGVmaW5lZCB7XG4gIGlmIChzaGFwZS51bmtub3duUmFuaykge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKHNoYXBlLmRpbSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHNoYXBlLmRpbS5tYXAoXG4gICAgICAgIGRpbSA9PlxuICAgICAgICAgICAgKHR5cGVvZiBkaW0uc2l6ZSA9PT0gJ251bWJlcicpID8gZGltLnNpemUgOiBwYXJzZUludChkaW0uc2l6ZSwgMTApKTtcbiAgfVxuICByZXR1cm4gW107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUZW5zb3JTaGFwZVBhcmFtKFxuICAgIGF0dHJzOiB7W2tleTogc3RyaW5nXTogdGVuc29yZmxvdy5JQXR0clZhbHVlfSwgbmFtZTogc3RyaW5nLFxuICAgIGRlZj86IG51bWJlcltdKTogbnVtYmVyW118dW5kZWZpbmVkIHtcbiAgY29uc3QgcGFyYW0gPSBhdHRyc1tuYW1lXTtcbiAgaWYgKHBhcmFtICYmIHBhcmFtLnNoYXBlKSB7XG4gICAgcmV0dXJuIHBhcnNlVGVuc29yU2hhcGVQYXJhbShwYXJhbS5zaGFwZSk7XG4gIH1cbiAgcmV0dXJuIGRlZjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE51bWVyaWNBcnJheVBhcmFtKFxuICAgIGF0dHJzOiB7W2tleTogc3RyaW5nXTogdGVuc29yZmxvdy5JQXR0clZhbHVlfSwgbmFtZTogc3RyaW5nLFxuICAgIGRlZjogbnVtYmVyW10pOiBudW1iZXJbXSB7XG4gIGNvbnN0IHBhcmFtID0gYXR0cnNbbmFtZV07XG4gIGlmIChwYXJhbSkge1xuICAgIHJldHVybiAoKHBhcmFtLmxpc3QuZiAmJiBwYXJhbS5saXN0LmYubGVuZ3RoID8gcGFyYW0ubGlzdC5mIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtLmxpc3QuaSkgfHxcbiAgICAgICAgICAgIFtdKVxuICAgICAgICAubWFwKHYgPT4gKHR5cGVvZiB2ID09PSAnbnVtYmVyJykgPyB2IDogcGFyc2VJbnQodiwgMTApKTtcbiAgfVxuICByZXR1cm4gZGVmO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RyaW5nQXJyYXlQYXJhbShcbiAgICBhdHRyczoge1trZXk6IHN0cmluZ106IHRlbnNvcmZsb3cuSUF0dHJWYWx1ZX0sIG5hbWU6IHN0cmluZywgZGVmOiBzdHJpbmdbXSxcbiAgICBrZWVwQ2FzZSA9IGZhbHNlKTogc3RyaW5nW10ge1xuICBjb25zdCBwYXJhbSA9IGF0dHJzW25hbWVdO1xuICBpZiAocGFyYW0gJiYgcGFyYW0ubGlzdCAmJiBwYXJhbS5saXN0LnMpIHtcbiAgICByZXR1cm4gcGFyYW0ubGlzdC5zLm1hcCgodikgPT4ge1xuICAgICAgcmV0dXJuIHBhcnNlU3RyaW5nUGFyYW0odiwga2VlcENhc2UpO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBkZWY7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUZW5zb3JTaGFwZUFycmF5UGFyYW0oXG4gICAgYXR0cnM6IHtba2V5OiBzdHJpbmddOiB0ZW5zb3JmbG93LklBdHRyVmFsdWV9LCBuYW1lOiBzdHJpbmcsXG4gICAgZGVmOiBudW1iZXJbXVtdKTogbnVtYmVyW11bXSB7XG4gIGNvbnN0IHBhcmFtID0gYXR0cnNbbmFtZV07XG4gIGlmIChwYXJhbSAmJiBwYXJhbS5saXN0ICYmIHBhcmFtLmxpc3Quc2hhcGUpIHtcbiAgICByZXR1cm4gcGFyYW0ubGlzdC5zaGFwZS5tYXAoKHYpID0+IHtcbiAgICAgIHJldHVybiBwYXJzZVRlbnNvclNoYXBlUGFyYW0odik7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGRlZjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJvb2xBcnJheVBhcmFtKFxuICAgIGF0dHJzOiB7W2tleTogc3RyaW5nXTogdGVuc29yZmxvdy5JQXR0clZhbHVlfSwgbmFtZTogc3RyaW5nLFxuICAgIGRlZjogYm9vbGVhbltdKTogYm9vbGVhbltdIHtcbiAgY29uc3QgcGFyYW0gPSBhdHRyc1tuYW1lXTtcbiAgaWYgKHBhcmFtICYmIHBhcmFtLmxpc3QgJiYgcGFyYW0ubGlzdC5iKSB7XG4gICAgcmV0dXJuIHBhcmFtLmxpc3QuYjtcbiAgfVxuICByZXR1cm4gZGVmO1xufVxuIl19