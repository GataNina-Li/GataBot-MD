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
import { scalar } from '@tensorflow/tfjs-core';
import { TensorArray } from '../../executor/tensor_array';
import { fromTensor, reserve, scatter, split } from '../../executor/tensor_list';
import { cloneTensor, getParamValue, getTensor } from './utils';
export const executeOp = async (node, tensorMap, context) => {
    switch (node.op) {
        case 'If':
        case 'StatelessIf': {
            const thenFunc = getParamValue('thenBranch', node, tensorMap, context);
            const elseFunc = getParamValue('elseBranch', node, tensorMap, context);
            const cond = getParamValue('cond', node, tensorMap, context);
            const args = getParamValue('args', node, tensorMap, context);
            const condValue = await cond.data();
            if (condValue[0]) {
                return context.functionMap[thenFunc].executeFunctionAsync(args, context.tensorArrayMap, context.tensorListMap);
            }
            else {
                return context.functionMap[elseFunc].executeFunctionAsync(args, context.tensorArrayMap, context.tensorListMap);
            }
        }
        case 'While':
        case 'StatelessWhile': {
            const bodyFunc = getParamValue('body', node, tensorMap, context);
            const condFunc = getParamValue('cond', node, tensorMap, context);
            const args = getParamValue('args', node, tensorMap, context);
            // Calculate the condition of the loop
            const condResult = (await context.functionMap[condFunc].executeFunctionAsync(args, context.tensorArrayMap, context.tensorListMap));
            const argIds = args.map(tensor => tensor.id);
            let condValue = await condResult[0].data();
            // Dispose the intermediate tensors for condition function
            condResult.forEach(tensor => {
                if (!tensor.kept && argIds.indexOf(tensor.id) === -1) {
                    tensor.dispose();
                }
            });
            let result = args;
            while (condValue[0]) {
                // Record the previous result for intermediate tensor tracking
                const origResult = result;
                // Execution the body of the loop
                result = await context.functionMap[bodyFunc].executeFunctionAsync(result, context.tensorArrayMap, context.tensorListMap);
                const resultIds = result.map(tensor => tensor.id);
                // Dispose the intermediate tensor for body function that is not global
                // kept, not input/output of the body function
                origResult.forEach(tensor => {
                    if (!tensor.kept && argIds.indexOf(tensor.id) === -1 &&
                        resultIds.indexOf(tensor.id) === -1) {
                        tensor.dispose();
                    }
                });
                // Recalcuate the condition of the loop using the latest results.
                const condResult = (await context.functionMap[condFunc].executeFunctionAsync(result, context.tensorArrayMap, context.tensorListMap));
                condValue = await condResult[0].data();
                // Dispose the intermediate tensors for condition function
                condResult.forEach(tensor => {
                    if (!tensor.kept && argIds.indexOf(tensor.id) === -1 &&
                        resultIds.indexOf(tensor.id) === -1) {
                        tensor.dispose();
                    }
                });
            }
            return result;
        }
        case 'LoopCond': {
            const pred = getParamValue('pred', node, tensorMap, context);
            return [cloneTensor(pred)];
        }
        case 'Switch': {
            const pred = getParamValue('pred', node, tensorMap, context);
            let data = getParamValue('data', node, tensorMap, context);
            if (!data.kept) {
                data = cloneTensor(data);
            }
            // Outputs nodes :0 => false, :1 => true
            return (await pred.data())[0] ? [undefined, data] : [data, undefined];
        }
        case 'Merge': {
            const inputName = node.inputNames.find(name => getTensor(name, tensorMap, context) !== undefined);
            if (inputName) {
                const data = getTensor(inputName, tensorMap, context);
                return [cloneTensor(data)];
            }
            return undefined;
        }
        case 'Enter': {
            const frameId = getParamValue('frameName', node, tensorMap, context);
            const data = getParamValue('tensor', node, tensorMap, context);
            context.enterFrame(frameId);
            return [cloneTensor(data)];
        }
        case 'Exit': {
            const data = getParamValue('tensor', node, tensorMap, context);
            context.exitFrame();
            return [cloneTensor(data)];
        }
        case 'NextIteration': {
            const data = getParamValue('tensor', node, tensorMap, context);
            context.nextIteration();
            return [cloneTensor(data)];
        }
        case 'TensorArrayV3': {
            const size = getParamValue('size', node, tensorMap, context);
            const dtype = getParamValue('dtype', node, tensorMap, context);
            const elementShape = getParamValue('elementShape', node, tensorMap, context);
            const dynamicSize = getParamValue('dynamicSize', node, tensorMap, context);
            const clearAfterRead = getParamValue('clearAfterRead', node, tensorMap, context);
            const identicalElementShapes = getParamValue('identicalElementShapes', node, tensorMap, context);
            const name = getParamValue('name', node, tensorMap, context);
            const tensorArray = new TensorArray(name, dtype, size, elementShape, identicalElementShapes, dynamicSize, clearAfterRead);
            context.addTensorArray(tensorArray);
            return [tensorArray.idTensor, scalar(1.0)];
        }
        case 'TensorArrayWriteV3': {
            const id = getParamValue('tensorArrayId', node, tensorMap, context);
            const index = getParamValue('index', node, tensorMap, context);
            const writeTensor = getParamValue('tensor', node, tensorMap, context);
            const writeTensorArray = context.getTensorArray(id.id);
            writeTensorArray.write(index, writeTensor);
            return [writeTensorArray.idTensor];
        }
        case 'TensorArrayReadV3': {
            const readId = getParamValue('tensorArrayId', node, tensorMap, context);
            const readIndex = getParamValue('index', node, tensorMap, context);
            const readTensorArray = context.getTensorArray(readId.id);
            return [readTensorArray.read(readIndex)];
        }
        case 'TensorArrayGatherV3': {
            const gatherId = getParamValue('tensorArrayId', node, tensorMap, context);
            const gatherIndices = getParamValue('indices', node, tensorMap, context);
            const gatherDtype = getParamValue('dtype', node, tensorMap, context);
            const gatherTensorArray = context.getTensorArray(gatherId.id);
            return [gatherTensorArray.gather(gatherIndices, gatherDtype)];
        }
        case 'TensorArrayScatterV3': {
            const scatterId = getParamValue('tensorArrayId', node, tensorMap, context);
            const scatterIndices = getParamValue('indices', node, tensorMap, context);
            const scatterTensor = getParamValue('tensor', node, tensorMap, context);
            const scatterTensorArray = context.getTensorArray(scatterId.id);
            scatterTensorArray.scatter(scatterIndices, scatterTensor);
            return [scatterTensorArray.idTensor];
        }
        case 'TensorArrayConcatV3': {
            const concatId = getParamValue('tensorArrayId', node, tensorMap, context);
            const concatTensorArray = context.getTensorArray(concatId.id);
            const concatDtype = getParamValue('dtype', node, tensorMap, context);
            return [concatTensorArray.concat(concatDtype)];
        }
        case 'TensorArraySplitV3': {
            const splitId = getParamValue('tensorArrayId', node, tensorMap, context);
            const splitTensor = getParamValue('tensor', node, tensorMap, context);
            const lengths = getParamValue('lengths', node, tensorMap, context);
            const splitTensorArray = context.getTensorArray(splitId.id);
            splitTensorArray.split(lengths, splitTensor);
            return [splitTensorArray.idTensor];
        }
        case 'TensorArraySizeV3': {
            const sizeId = getParamValue('tensorArrayId', node, tensorMap, context);
            const sizeTensorArray = context.getTensorArray(sizeId.id);
            return [scalar(sizeTensorArray.size(), 'int32')];
        }
        case 'TensorArrayCloseV3': {
            const closeId = getParamValue('tensorArrayId', node, tensorMap, context);
            const closeTensorArray = context.getTensorArray(closeId.id);
            closeTensorArray.clearAndClose();
            return [closeTensorArray.idTensor];
        }
        case 'TensorListSetItem': {
            const idTensor = getParamValue('tensorListId', node, tensorMap, context);
            const index = getParamValue('index', node, tensorMap, context);
            const writeTensor = getParamValue('tensor', node, tensorMap, context);
            const tensorList = context.getTensorList(idTensor.id);
            tensorList.setItem(index, writeTensor);
            return [tensorList.idTensor];
        }
        case 'TensorListGetItem': {
            const idTensor = getParamValue('tensorListId', node, tensorMap, context);
            const readIndex = getParamValue('index', node, tensorMap, context);
            const elementShape = getParamValue('elementShape', node, tensorMap, context);
            const elementDType = getParamValue('elementDType', node, tensorMap, context);
            const tensorList = context.getTensorList(idTensor.id);
            return [tensorList.getItem(readIndex, elementShape, elementDType)];
        }
        case 'TensorListScatterV2':
        case 'TensorListScatter': {
            const scatterIndices = getParamValue('indices', node, tensorMap, context);
            const scatterTensor = getParamValue('tensor', node, tensorMap, context);
            const elementShape = getParamValue('elementShape', node, tensorMap, context);
            const numElements = getParamValue('numElements', node, tensorMap, context);
            const tensorList = scatter(scatterTensor, scatterIndices, elementShape, numElements);
            context.addTensorList(tensorList);
            return [tensorList.idTensor];
        }
        case 'TensorListReserve':
        case 'EmptyTensorList': {
            const elementShape = getParamValue('elementShape', node, tensorMap, context);
            const elementDtype = getParamValue('elementDType', node, tensorMap, context);
            let numElementsParam;
            if (node.op === 'TensorListReserve') {
                numElementsParam = 'numElements';
            }
            else {
                numElementsParam = 'maxNumElements';
            }
            const numElements = getParamValue(numElementsParam, node, tensorMap, context);
            const maxNumElements = node.op === 'TensorListReserve' ? -1 : numElements;
            const tensorList = reserve(elementShape, elementDtype, numElements, maxNumElements);
            context.addTensorList(tensorList);
            return [tensorList.idTensor];
        }
        case 'TensorListGather': {
            const gatherId = getParamValue('tensorListId', node, tensorMap, context);
            const gatherIndices = getParamValue('indices', node, tensorMap, context);
            const elementShape = getParamValue('elementShape', node, tensorMap, context);
            const elementDtype = getParamValue('elementDType', node, tensorMap, context);
            const tensorList = context.getTensorList(gatherId.id);
            return [tensorList.gather(gatherIndices, elementDtype, elementShape)];
        }
        case 'TensorListStack': {
            const idTensor = getParamValue('tensorListId', node, tensorMap, context);
            const elementShape = getParamValue('elementShape', node, tensorMap, context);
            const elementDtype = getParamValue('elementDType', node, tensorMap, context);
            const numElements = getParamValue('numElements', node, tensorMap, context);
            const tensorList = context.getTensorList(idTensor.id);
            return [tensorList.stack(elementShape, elementDtype, numElements)];
        }
        case 'TensorListFromTensor': {
            const tensor = getParamValue('tensor', node, tensorMap, context);
            const elementShape = getParamValue('elementShape', node, tensorMap, context);
            const elementDtype = getParamValue('elementDType', node, tensorMap, context);
            const tensorList = fromTensor(tensor, elementShape, elementDtype);
            context.addTensorList(tensorList);
            return [tensorList.idTensor];
        }
        case 'TensorListConcat':
        case 'TensorListConcatV2': {
            const concatId = getParamValue('tensorListId', node, tensorMap, context);
            const tensorList = context.getTensorList(concatId.id);
            const concatDtype = getParamValue('dtype', node, tensorMap, context);
            const elementShape = getParamValue('elementShape', node, tensorMap, context);
            return [tensorList.concat(concatDtype, elementShape)];
        }
        case 'TensorListPushBack': {
            const idTensor = getParamValue('tensorListId', node, tensorMap, context);
            const writeTensor = getParamValue('tensor', node, tensorMap, context);
            const tensorList = context.getTensorList(idTensor.id);
            tensorList.pushBack(writeTensor);
            return [tensorList.idTensor];
        }
        case 'TensorListPopBack': {
            const idTensor = getParamValue('tensorListId', node, tensorMap, context);
            const elementShape = getParamValue('elementShape', node, tensorMap, context);
            const elementDType = getParamValue('elementDType', node, tensorMap, context);
            const tensorList = context.getTensorList(idTensor.id);
            return [tensorList.popBack(elementShape, elementDType)];
        }
        case 'TensorListSplit': {
            const splitTensor = getParamValue('tensor', node, tensorMap, context);
            const elementShape = getParamValue('elementShape', node, tensorMap, context);
            const lengths = getParamValue('lengths', node, tensorMap, context);
            const tensorList = split(splitTensor, lengths, elementShape);
            context.addTensorList(tensorList);
            return [tensorList.idTensor];
        }
        case 'TensorListLength': {
            const idTensor = getParamValue('tensorListId', node, tensorMap, context);
            const tensorList = context.getTensorList(idTensor.id);
            return [scalar(tensorList.size(), 'int32')];
        }
        case 'TensorListResize': {
            const idTensor = getParamValue('tensorListId', node, tensorMap, context);
            const size = getParamValue('size', node, tensorMap, context);
            const srcTensorList = context.getTensorList(idTensor.id);
            const destTensorList = srcTensorList.resize(size);
            context.addTensorList(destTensorList);
            return [destTensorList.idTensor];
        }
        default:
            throw TypeError(`Node type ${node.op} is not implemented`);
    }
};
export const CATEGORY = 'control';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbF9leGVjdXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29udmVydGVyL3NyYy9vcGVyYXRpb25zL2V4ZWN1dG9ycy9jb250cm9sX2V4ZWN1dG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBVyxNQUFNLEVBQVMsTUFBTSx1QkFBdUIsQ0FBQztBQUkvRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sNkJBQTZCLENBQUM7QUFDeEQsT0FBTyxFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBRy9FLE9BQU8sRUFBQyxXQUFXLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUU5RCxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQTRCLEtBQUssRUFDbkQsSUFBVSxFQUFFLFNBQTBCLEVBQ3RDLE9BQXlCLEVBQXFCLEVBQUU7SUFDbEQsUUFBUSxJQUFJLENBQUMsRUFBRSxFQUFFO1FBQ2YsS0FBSyxJQUFJLENBQUM7UUFDVixLQUFLLGFBQWEsQ0FBQyxDQUFDO1lBQ2xCLE1BQU0sUUFBUSxHQUNWLGFBQWEsQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQVcsQ0FBQztZQUNwRSxNQUFNLFFBQVEsR0FDVixhQUFhLENBQUMsWUFBWSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFXLENBQUM7WUFDcEUsTUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBVyxDQUFDO1lBQ3ZFLE1BQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQWEsQ0FBQztZQUN6RSxNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNwQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDaEIsT0FBTyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLG9CQUFvQixDQUNyRCxJQUFJLEVBQUUsT0FBTyxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDMUQ7aUJBQU07Z0JBQ0wsT0FBTyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLG9CQUFvQixDQUNyRCxJQUFJLEVBQUUsT0FBTyxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDMUQ7U0FDRjtRQUNELEtBQUssT0FBTyxDQUFDO1FBQ2IsS0FBSyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sUUFBUSxHQUNWLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQVcsQ0FBQztZQUM5RCxNQUFNLFFBQVEsR0FDVixhQUFhLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFXLENBQUM7WUFDOUQsTUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBYSxDQUFDO1lBRXpFLHNDQUFzQztZQUN0QyxNQUFNLFVBQVUsR0FDWixDQUFDLE1BQU0sT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxvQkFBb0IsQ0FDckQsSUFBSSxFQUFFLE9BQU8sQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDOUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM3QyxJQUFJLFNBQVMsR0FBRyxNQUFNLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMzQywwREFBMEQ7WUFDMUQsVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7b0JBQ3BELE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztpQkFDbEI7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksTUFBTSxHQUFhLElBQUksQ0FBQztZQUU1QixPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDbkIsOERBQThEO2dCQUM5RCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUM7Z0JBQzFCLGlDQUFpQztnQkFDakMsTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxvQkFBb0IsQ0FDN0QsTUFBTSxFQUFFLE9BQU8sQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUVsRCx1RUFBdUU7Z0JBQ3ZFLDhDQUE4QztnQkFDOUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUNoRCxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTt3QkFDdkMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO3FCQUNsQjtnQkFDSCxDQUFDLENBQUMsQ0FBQztnQkFFSCxpRUFBaUU7Z0JBQ2pFLE1BQU0sVUFBVSxHQUNaLENBQUMsTUFBTSxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLG9CQUFvQixDQUNyRCxNQUFNLEVBQUUsT0FBTyxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDaEUsU0FBUyxHQUFHLE1BQU0sVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUN2QywwREFBMEQ7Z0JBQzFELFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDaEQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7d0JBQ3ZDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztxQkFDbEI7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7YUFDSjtZQUNELE9BQU8sTUFBTSxDQUFDO1NBQ2Y7UUFDRCxLQUFLLFVBQVUsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBVyxDQUFDO1lBQ3ZFLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUM1QjtRQUNELEtBQUssUUFBUSxDQUFDLENBQUM7WUFDYixNQUFNLElBQUksR0FBRyxhQUFhLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFXLENBQUM7WUFDdkUsSUFBSSxJQUFJLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBVyxDQUFDO1lBQ3JFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNkLElBQUksR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDMUI7WUFDRCx3Q0FBd0M7WUFDeEMsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztTQUN2RTtRQUNELEtBQUssT0FBTyxDQUFDLENBQUM7WUFDWixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FDbEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQztZQUMvRCxJQUFJLFNBQVMsRUFBRTtnQkFDYixNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDdEQsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQzVCO1lBQ0QsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFDRCxLQUFLLE9BQU8sQ0FBQyxDQUFDO1lBQ1osTUFBTSxPQUFPLEdBQ1QsYUFBYSxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBVyxDQUFDO1lBQ25FLE1BQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQVcsQ0FBQztZQUN6RSxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzVCLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUM1QjtRQUNELEtBQUssTUFBTSxDQUFDLENBQUM7WUFDWCxNQUFNLElBQUksR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFXLENBQUM7WUFDekUsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3BCLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUM1QjtRQUNELEtBQUssZUFBZSxDQUFDLENBQUM7WUFDcEIsTUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBVyxDQUFDO1lBQ3pFLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN4QixPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDNUI7UUFDRCxLQUFLLGVBQWUsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQVcsQ0FBQztZQUN2RSxNQUFNLEtBQUssR0FDUCxhQUFhLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFhLENBQUM7WUFDakUsTUFBTSxZQUFZLEdBQ2QsYUFBYSxDQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBYSxDQUFDO1lBQ3hFLE1BQU0sV0FBVyxHQUNiLGFBQWEsQ0FBQyxhQUFhLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQVksQ0FBQztZQUN0RSxNQUFNLGNBQWMsR0FDaEIsYUFBYSxDQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFZLENBQUM7WUFDekUsTUFBTSxzQkFBc0IsR0FDeEIsYUFBYSxDQUFDLHdCQUF3QixFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUN6RCxDQUFDO1lBQ1osTUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBVyxDQUFDO1lBQ3ZFLE1BQU0sV0FBVyxHQUFHLElBQUksV0FBVyxDQUMvQixJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsc0JBQXNCLEVBQUUsV0FBVyxFQUNwRSxjQUFjLENBQUMsQ0FBQztZQUNwQixPQUFPLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3BDLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQzVDO1FBQ0QsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ3pCLE1BQU0sRUFBRSxHQUNKLGFBQWEsQ0FBQyxlQUFlLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQVcsQ0FBQztZQUN2RSxNQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFXLENBQUM7WUFDekUsTUFBTSxXQUFXLEdBQ2IsYUFBYSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBVyxDQUFDO1lBQ2hFLE1BQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdkQsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztZQUMzQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDcEM7UUFDRCxLQUFLLG1CQUFtQixDQUFDLENBQUM7WUFDeEIsTUFBTSxNQUFNLEdBQ1IsYUFBYSxDQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBVyxDQUFDO1lBQ3ZFLE1BQU0sU0FBUyxHQUNYLGFBQWEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQVcsQ0FBQztZQUMvRCxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMxRCxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1NBQzFDO1FBQ0QsS0FBSyxxQkFBcUIsQ0FBQyxDQUFDO1lBQzFCLE1BQU0sUUFBUSxHQUNWLGFBQWEsQ0FBQyxlQUFlLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQVcsQ0FBQztZQUN2RSxNQUFNLGFBQWEsR0FDZixhQUFhLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFhLENBQUM7WUFDbkUsTUFBTSxXQUFXLEdBQ2IsYUFBYSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBYSxDQUFDO1lBQ2pFLE1BQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDOUQsT0FBTyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztTQUMvRDtRQUNELEtBQUssc0JBQXNCLENBQUMsQ0FBQztZQUMzQixNQUFNLFNBQVMsR0FDWCxhQUFhLENBQUMsZUFBZSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFXLENBQUM7WUFDdkUsTUFBTSxjQUFjLEdBQ2hCLGFBQWEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQWEsQ0FBQztZQUNuRSxNQUFNLGFBQWEsR0FDZixhQUFhLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFXLENBQUM7WUFDaEUsTUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRSxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQzFELE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN0QztRQUNELEtBQUsscUJBQXFCLENBQUMsQ0FBQztZQUMxQixNQUFNLFFBQVEsR0FDVixhQUFhLENBQUMsZUFBZSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFXLENBQUM7WUFDdkUsTUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM5RCxNQUFNLFdBQVcsR0FDYixhQUFhLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFhLENBQUM7WUFDakUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1NBQ2hEO1FBQ0QsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ3pCLE1BQU0sT0FBTyxHQUNULGFBQWEsQ0FBQyxlQUFlLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQVcsQ0FBQztZQUN2RSxNQUFNLFdBQVcsR0FDYixhQUFhLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFXLENBQUM7WUFDaEUsTUFBTSxPQUFPLEdBQ1QsYUFBYSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBYSxDQUFDO1lBQ25FLE1BQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDNUQsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztZQUM3QyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDcEM7UUFDRCxLQUFLLG1CQUFtQixDQUFDLENBQUM7WUFDeEIsTUFBTSxNQUFNLEdBQ1IsYUFBYSxDQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBVyxDQUFDO1lBQ3ZFLE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzFELE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDbEQ7UUFDRCxLQUFLLG9CQUFvQixDQUFDLENBQUM7WUFDekIsTUFBTSxPQUFPLEdBQ1QsYUFBYSxDQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBVyxDQUFDO1lBQ3ZFLE1BQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDNUQsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDakMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3BDO1FBQ0QsS0FBSyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sUUFBUSxHQUNWLGFBQWEsQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQVcsQ0FBQztZQUN0RSxNQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFXLENBQUM7WUFDekUsTUFBTSxXQUFXLEdBQ2IsYUFBYSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBVyxDQUFDO1lBQ2hFLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RELFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3ZDLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDOUI7UUFDRCxLQUFLLG1CQUFtQixDQUFDLENBQUM7WUFDeEIsTUFBTSxRQUFRLEdBQ1YsYUFBYSxDQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBVyxDQUFDO1lBQ3RFLE1BQU0sU0FBUyxHQUNYLGFBQWEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQVcsQ0FBQztZQUMvRCxNQUFNLFlBQVksR0FDZCxhQUFhLENBQUMsY0FBYyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFhLENBQUM7WUFFeEUsTUFBTSxZQUFZLEdBQ2QsYUFBYSxDQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBYSxDQUFDO1lBQ3hFLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RELE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztTQUNwRTtRQUNELEtBQUsscUJBQXFCLENBQUM7UUFDM0IsS0FBSyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sY0FBYyxHQUNoQixhQUFhLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFhLENBQUM7WUFDbkUsTUFBTSxhQUFhLEdBQ2YsYUFBYSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBVyxDQUFDO1lBQ2hFLE1BQU0sWUFBWSxHQUNkLGFBQWEsQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQWEsQ0FBQztZQUN4RSxNQUFNLFdBQVcsR0FDYixhQUFhLENBQUMsYUFBYSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFXLENBQUM7WUFDckUsTUFBTSxVQUFVLEdBQ1osT0FBTyxDQUFDLGFBQWEsRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3RFLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbEMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUM5QjtRQUNELEtBQUssbUJBQW1CLENBQUM7UUFDekIsS0FBSyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sWUFBWSxHQUNkLGFBQWEsQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQWEsQ0FBQztZQUN4RSxNQUFNLFlBQVksR0FDZCxhQUFhLENBQUMsY0FBYyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFhLENBQUM7WUFDeEUsSUFBSSxnQkFBZ0IsQ0FBQztZQUVyQixJQUFJLElBQUksQ0FBQyxFQUFFLEtBQUssbUJBQW1CLEVBQUU7Z0JBQ25DLGdCQUFnQixHQUFHLGFBQWEsQ0FBQzthQUNsQztpQkFBTTtnQkFDTCxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQzthQUNyQztZQUVELE1BQU0sV0FBVyxHQUNiLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBVyxDQUFDO1lBQ3hFLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxFQUFFLEtBQUssbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7WUFDMUUsTUFBTSxVQUFVLEdBQ1osT0FBTyxDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ3JFLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbEMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUM5QjtRQUNELEtBQUssa0JBQWtCLENBQUMsQ0FBQztZQUN2QixNQUFNLFFBQVEsR0FDVixhQUFhLENBQUMsY0FBYyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFXLENBQUM7WUFDdEUsTUFBTSxhQUFhLEdBQ2YsYUFBYSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBYSxDQUFDO1lBQ25FLE1BQU0sWUFBWSxHQUNkLGFBQWEsQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQWEsQ0FBQztZQUN4RSxNQUFNLFlBQVksR0FDZCxhQUFhLENBQUMsY0FBYyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFhLENBQUM7WUFDeEUsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEQsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO1NBQ3ZFO1FBQ0QsS0FBSyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sUUFBUSxHQUNWLGFBQWEsQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQVcsQ0FBQztZQUN0RSxNQUFNLFlBQVksR0FDZCxhQUFhLENBQUMsY0FBYyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFhLENBQUM7WUFDeEUsTUFBTSxZQUFZLEdBQ2QsYUFBYSxDQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBYSxDQUFDO1lBQ3hFLE1BQU0sV0FBVyxHQUNiLGFBQWEsQ0FBQyxhQUFhLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQVcsQ0FBQztZQUNyRSxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0RCxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7U0FDcEU7UUFDRCxLQUFLLHNCQUFzQixDQUFDLENBQUM7WUFDM0IsTUFBTSxNQUFNLEdBQ1IsYUFBYSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBVyxDQUFDO1lBQ2hFLE1BQU0sWUFBWSxHQUNkLGFBQWEsQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQWEsQ0FBQztZQUN4RSxNQUFNLFlBQVksR0FDZCxhQUFhLENBQUMsY0FBYyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFhLENBQUM7WUFDeEUsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDbEUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNsQyxPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsS0FBSyxrQkFBa0IsQ0FBQztRQUN4QixLQUFLLG9CQUFvQixDQUFDLENBQUM7WUFDekIsTUFBTSxRQUFRLEdBQ1YsYUFBYSxDQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBVyxDQUFDO1lBQ3RFLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RELE1BQU0sV0FBVyxHQUNiLGFBQWEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQWEsQ0FBQztZQUNqRSxNQUFNLFlBQVksR0FDZCxhQUFhLENBQUMsY0FBYyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFhLENBQUM7WUFDeEUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7U0FDdkQ7UUFDRCxLQUFLLG9CQUFvQixDQUFDLENBQUM7WUFDekIsTUFBTSxRQUFRLEdBQ1YsYUFBYSxDQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBVyxDQUFDO1lBQ3RFLE1BQU0sV0FBVyxHQUNiLGFBQWEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQVcsQ0FBQztZQUNoRSxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0RCxVQUFVLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2pDLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDOUI7UUFDRCxLQUFLLG1CQUFtQixDQUFDLENBQUM7WUFDeEIsTUFBTSxRQUFRLEdBQ1YsYUFBYSxDQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBVyxDQUFDO1lBQ3RFLE1BQU0sWUFBWSxHQUNkLGFBQWEsQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQWEsQ0FBQztZQUN4RSxNQUFNLFlBQVksR0FDZCxhQUFhLENBQUMsY0FBYyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFhLENBQUM7WUFDeEUsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEQsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7U0FDekQ7UUFDRCxLQUFLLGlCQUFpQixDQUFDLENBQUM7WUFDdEIsTUFBTSxXQUFXLEdBQ2IsYUFBYSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBVyxDQUFDO1lBQ2hFLE1BQU0sWUFBWSxHQUNkLGFBQWEsQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQWEsQ0FBQztZQUN4RSxNQUFNLE9BQU8sR0FDVCxhQUFhLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFhLENBQUM7WUFFbkUsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDN0QsT0FBTyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNsQyxPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsS0FBSyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sUUFBUSxHQUNWLGFBQWEsQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQVcsQ0FBQztZQUN0RSxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0RCxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQzdDO1FBQ0QsS0FBSyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sUUFBUSxHQUNWLGFBQWEsQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQVcsQ0FBQztZQUN0RSxNQUFNLElBQUksR0FBRyxhQUFhLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFXLENBQUM7WUFFdkUsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDekQsTUFBTSxjQUFjLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRCxPQUFPLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3RDLE9BQU8sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDbEM7UUFDRDtZQUNFLE1BQU0sU0FBUyxDQUFDLGFBQWEsSUFBSSxDQUFDLEVBQUUscUJBQXFCLENBQUMsQ0FBQztLQUM5RDtBQUNILENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RGF0YVR5cGUsIHNjYWxhciwgVGVuc29yfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge05hbWVkVGVuc29yc01hcH0gZnJvbSAnLi4vLi4vZGF0YS90eXBlcyc7XG5pbXBvcnQge0V4ZWN1dGlvbkNvbnRleHR9IGZyb20gJy4uLy4uL2V4ZWN1dG9yL2V4ZWN1dGlvbl9jb250ZXh0JztcbmltcG9ydCB7VGVuc29yQXJyYXl9IGZyb20gJy4uLy4uL2V4ZWN1dG9yL3RlbnNvcl9hcnJheSc7XG5pbXBvcnQge2Zyb21UZW5zb3IsIHJlc2VydmUsIHNjYXR0ZXIsIHNwbGl0fSBmcm9tICcuLi8uLi9leGVjdXRvci90ZW5zb3JfbGlzdCc7XG5pbXBvcnQge0ludGVybmFsT3BBc3luY0V4ZWN1dG9yLCBOb2RlfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7Y2xvbmVUZW5zb3IsIGdldFBhcmFtVmFsdWUsIGdldFRlbnNvcn0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBjb25zdCBleGVjdXRlT3A6IEludGVybmFsT3BBc3luY0V4ZWN1dG9yID0gYXN5bmMoXG4gICAgbm9kZTogTm9kZSwgdGVuc29yTWFwOiBOYW1lZFRlbnNvcnNNYXAsXG4gICAgY29udGV4dDogRXhlY3V0aW9uQ29udGV4dCk6IFByb21pc2U8VGVuc29yW10+ID0+IHtcbiAgc3dpdGNoIChub2RlLm9wKSB7XG4gICAgY2FzZSAnSWYnOlxuICAgIGNhc2UgJ1N0YXRlbGVzc0lmJzoge1xuICAgICAgY29uc3QgdGhlbkZ1bmMgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3RoZW5CcmFuY2gnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIHN0cmluZztcbiAgICAgIGNvbnN0IGVsc2VGdW5jID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdlbHNlQnJhbmNoJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBzdHJpbmc7XG4gICAgICBjb25zdCBjb25kID0gZ2V0UGFyYW1WYWx1ZSgnY29uZCcsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yO1xuICAgICAgY29uc3QgYXJncyA9IGdldFBhcmFtVmFsdWUoJ2FyZ3MnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIFRlbnNvcltdO1xuICAgICAgY29uc3QgY29uZFZhbHVlID0gYXdhaXQgY29uZC5kYXRhKCk7XG4gICAgICBpZiAoY29uZFZhbHVlWzBdKSB7XG4gICAgICAgIHJldHVybiBjb250ZXh0LmZ1bmN0aW9uTWFwW3RoZW5GdW5jXS5leGVjdXRlRnVuY3Rpb25Bc3luYyhcbiAgICAgICAgICAgIGFyZ3MsIGNvbnRleHQudGVuc29yQXJyYXlNYXAsIGNvbnRleHQudGVuc29yTGlzdE1hcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY29udGV4dC5mdW5jdGlvbk1hcFtlbHNlRnVuY10uZXhlY3V0ZUZ1bmN0aW9uQXN5bmMoXG4gICAgICAgICAgICBhcmdzLCBjb250ZXh0LnRlbnNvckFycmF5TWFwLCBjb250ZXh0LnRlbnNvckxpc3RNYXApO1xuICAgICAgfVxuICAgIH1cbiAgICBjYXNlICdXaGlsZSc6XG4gICAgY2FzZSAnU3RhdGVsZXNzV2hpbGUnOiB7XG4gICAgICBjb25zdCBib2R5RnVuYyA9XG4gICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgnYm9keScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgc3RyaW5nO1xuICAgICAgY29uc3QgY29uZEZ1bmMgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ2NvbmQnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIHN0cmluZztcbiAgICAgIGNvbnN0IGFyZ3MgPSBnZXRQYXJhbVZhbHVlKCdhcmdzJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3JbXTtcblxuICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBjb25kaXRpb24gb2YgdGhlIGxvb3BcbiAgICAgIGNvbnN0IGNvbmRSZXN1bHQgPVxuICAgICAgICAgIChhd2FpdCBjb250ZXh0LmZ1bmN0aW9uTWFwW2NvbmRGdW5jXS5leGVjdXRlRnVuY3Rpb25Bc3luYyhcbiAgICAgICAgICAgICAgYXJncywgY29udGV4dC50ZW5zb3JBcnJheU1hcCwgY29udGV4dC50ZW5zb3JMaXN0TWFwKSk7XG4gICAgICBjb25zdCBhcmdJZHMgPSBhcmdzLm1hcCh0ZW5zb3IgPT4gdGVuc29yLmlkKTtcbiAgICAgIGxldCBjb25kVmFsdWUgPSBhd2FpdCBjb25kUmVzdWx0WzBdLmRhdGEoKTtcbiAgICAgIC8vIERpc3Bvc2UgdGhlIGludGVybWVkaWF0ZSB0ZW5zb3JzIGZvciBjb25kaXRpb24gZnVuY3Rpb25cbiAgICAgIGNvbmRSZXN1bHQuZm9yRWFjaCh0ZW5zb3IgPT4ge1xuICAgICAgICBpZiAoIXRlbnNvci5rZXB0ICYmIGFyZ0lkcy5pbmRleE9mKHRlbnNvci5pZCkgPT09IC0xKSB7XG4gICAgICAgICAgdGVuc29yLmRpc3Bvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGxldCByZXN1bHQ6IFRlbnNvcltdID0gYXJncztcblxuICAgICAgd2hpbGUgKGNvbmRWYWx1ZVswXSkge1xuICAgICAgICAvLyBSZWNvcmQgdGhlIHByZXZpb3VzIHJlc3VsdCBmb3IgaW50ZXJtZWRpYXRlIHRlbnNvciB0cmFja2luZ1xuICAgICAgICBjb25zdCBvcmlnUmVzdWx0ID0gcmVzdWx0O1xuICAgICAgICAvLyBFeGVjdXRpb24gdGhlIGJvZHkgb2YgdGhlIGxvb3BcbiAgICAgICAgcmVzdWx0ID0gYXdhaXQgY29udGV4dC5mdW5jdGlvbk1hcFtib2R5RnVuY10uZXhlY3V0ZUZ1bmN0aW9uQXN5bmMoXG4gICAgICAgICAgICByZXN1bHQsIGNvbnRleHQudGVuc29yQXJyYXlNYXAsIGNvbnRleHQudGVuc29yTGlzdE1hcCk7XG4gICAgICAgIGNvbnN0IHJlc3VsdElkcyA9IHJlc3VsdC5tYXAodGVuc29yID0+IHRlbnNvci5pZCk7XG5cbiAgICAgICAgLy8gRGlzcG9zZSB0aGUgaW50ZXJtZWRpYXRlIHRlbnNvciBmb3IgYm9keSBmdW5jdGlvbiB0aGF0IGlzIG5vdCBnbG9iYWxcbiAgICAgICAgLy8ga2VwdCwgbm90IGlucHV0L291dHB1dCBvZiB0aGUgYm9keSBmdW5jdGlvblxuICAgICAgICBvcmlnUmVzdWx0LmZvckVhY2godGVuc29yID0+IHtcbiAgICAgICAgICBpZiAoIXRlbnNvci5rZXB0ICYmIGFyZ0lkcy5pbmRleE9mKHRlbnNvci5pZCkgPT09IC0xICYmXG4gICAgICAgICAgICAgIHJlc3VsdElkcy5pbmRleE9mKHRlbnNvci5pZCkgPT09IC0xKSB7XG4gICAgICAgICAgICB0ZW5zb3IuZGlzcG9zZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUmVjYWxjdWF0ZSB0aGUgY29uZGl0aW9uIG9mIHRoZSBsb29wIHVzaW5nIHRoZSBsYXRlc3QgcmVzdWx0cy5cbiAgICAgICAgY29uc3QgY29uZFJlc3VsdCA9XG4gICAgICAgICAgICAoYXdhaXQgY29udGV4dC5mdW5jdGlvbk1hcFtjb25kRnVuY10uZXhlY3V0ZUZ1bmN0aW9uQXN5bmMoXG4gICAgICAgICAgICAgICAgcmVzdWx0LCBjb250ZXh0LnRlbnNvckFycmF5TWFwLCBjb250ZXh0LnRlbnNvckxpc3RNYXApKTtcbiAgICAgICAgY29uZFZhbHVlID0gYXdhaXQgY29uZFJlc3VsdFswXS5kYXRhKCk7XG4gICAgICAgIC8vIERpc3Bvc2UgdGhlIGludGVybWVkaWF0ZSB0ZW5zb3JzIGZvciBjb25kaXRpb24gZnVuY3Rpb25cbiAgICAgICAgY29uZFJlc3VsdC5mb3JFYWNoKHRlbnNvciA9PiB7XG4gICAgICAgICAgaWYgKCF0ZW5zb3Iua2VwdCAmJiBhcmdJZHMuaW5kZXhPZih0ZW5zb3IuaWQpID09PSAtMSAmJlxuICAgICAgICAgICAgICByZXN1bHRJZHMuaW5kZXhPZih0ZW5zb3IuaWQpID09PSAtMSkge1xuICAgICAgICAgICAgdGVuc29yLmRpc3Bvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgY2FzZSAnTG9vcENvbmQnOiB7XG4gICAgICBjb25zdCBwcmVkID0gZ2V0UGFyYW1WYWx1ZSgncHJlZCcsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yO1xuICAgICAgcmV0dXJuIFtjbG9uZVRlbnNvcihwcmVkKV07XG4gICAgfVxuICAgIGNhc2UgJ1N3aXRjaCc6IHtcbiAgICAgIGNvbnN0IHByZWQgPSBnZXRQYXJhbVZhbHVlKCdwcmVkJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3I7XG4gICAgICBsZXQgZGF0YSA9IGdldFBhcmFtVmFsdWUoJ2RhdGEnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIFRlbnNvcjtcbiAgICAgIGlmICghZGF0YS5rZXB0KSB7XG4gICAgICAgIGRhdGEgPSBjbG9uZVRlbnNvcihkYXRhKTtcbiAgICAgIH1cbiAgICAgIC8vIE91dHB1dHMgbm9kZXMgOjAgPT4gZmFsc2UsIDoxID0+IHRydWVcbiAgICAgIHJldHVybiAoYXdhaXQgcHJlZC5kYXRhKCkpWzBdID8gW3VuZGVmaW5lZCwgZGF0YV0gOiBbZGF0YSwgdW5kZWZpbmVkXTtcbiAgICB9XG4gICAgY2FzZSAnTWVyZ2UnOiB7XG4gICAgICBjb25zdCBpbnB1dE5hbWUgPSBub2RlLmlucHV0TmFtZXMuZmluZChcbiAgICAgICAgICBuYW1lID0+IGdldFRlbnNvcihuYW1lLCB0ZW5zb3JNYXAsIGNvbnRleHQpICE9PSB1bmRlZmluZWQpO1xuICAgICAgaWYgKGlucHV0TmFtZSkge1xuICAgICAgICBjb25zdCBkYXRhID0gZ2V0VGVuc29yKGlucHV0TmFtZSwgdGVuc29yTWFwLCBjb250ZXh0KTtcbiAgICAgICAgcmV0dXJuIFtjbG9uZVRlbnNvcihkYXRhKV07XG4gICAgICB9XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBjYXNlICdFbnRlcic6IHtcbiAgICAgIGNvbnN0IGZyYW1lSWQgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ2ZyYW1lTmFtZScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgc3RyaW5nO1xuICAgICAgY29uc3QgZGF0YSA9IGdldFBhcmFtVmFsdWUoJ3RlbnNvcicsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yO1xuICAgICAgY29udGV4dC5lbnRlckZyYW1lKGZyYW1lSWQpO1xuICAgICAgcmV0dXJuIFtjbG9uZVRlbnNvcihkYXRhKV07XG4gICAgfVxuICAgIGNhc2UgJ0V4aXQnOiB7XG4gICAgICBjb25zdCBkYXRhID0gZ2V0UGFyYW1WYWx1ZSgndGVuc29yJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3I7XG4gICAgICBjb250ZXh0LmV4aXRGcmFtZSgpO1xuICAgICAgcmV0dXJuIFtjbG9uZVRlbnNvcihkYXRhKV07XG4gICAgfVxuICAgIGNhc2UgJ05leHRJdGVyYXRpb24nOiB7XG4gICAgICBjb25zdCBkYXRhID0gZ2V0UGFyYW1WYWx1ZSgndGVuc29yJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3I7XG4gICAgICBjb250ZXh0Lm5leHRJdGVyYXRpb24oKTtcbiAgICAgIHJldHVybiBbY2xvbmVUZW5zb3IoZGF0YSldO1xuICAgIH1cbiAgICBjYXNlICdUZW5zb3JBcnJheVYzJzoge1xuICAgICAgY29uc3Qgc2l6ZSA9IGdldFBhcmFtVmFsdWUoJ3NpemUnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIG51bWJlcjtcbiAgICAgIGNvbnN0IGR0eXBlID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdkdHlwZScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgRGF0YVR5cGU7XG4gICAgICBjb25zdCBlbGVtZW50U2hhcGUgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ2VsZW1lbnRTaGFwZScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgbnVtYmVyW107XG4gICAgICBjb25zdCBkeW5hbWljU2l6ZSA9XG4gICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgnZHluYW1pY1NpemUnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIGJvb2xlYW47XG4gICAgICBjb25zdCBjbGVhckFmdGVyUmVhZCA9XG4gICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgnY2xlYXJBZnRlclJlYWQnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIGJvb2xlYW47XG4gICAgICBjb25zdCBpZGVudGljYWxFbGVtZW50U2hhcGVzID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdpZGVudGljYWxFbGVtZW50U2hhcGVzJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhc1xuICAgICAgICAgIGJvb2xlYW47XG4gICAgICBjb25zdCBuYW1lID0gZ2V0UGFyYW1WYWx1ZSgnbmFtZScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgc3RyaW5nO1xuICAgICAgY29uc3QgdGVuc29yQXJyYXkgPSBuZXcgVGVuc29yQXJyYXkoXG4gICAgICAgICAgbmFtZSwgZHR5cGUsIHNpemUsIGVsZW1lbnRTaGFwZSwgaWRlbnRpY2FsRWxlbWVudFNoYXBlcywgZHluYW1pY1NpemUsXG4gICAgICAgICAgY2xlYXJBZnRlclJlYWQpO1xuICAgICAgY29udGV4dC5hZGRUZW5zb3JBcnJheSh0ZW5zb3JBcnJheSk7XG4gICAgICByZXR1cm4gW3RlbnNvckFycmF5LmlkVGVuc29yLCBzY2FsYXIoMS4wKV07XG4gICAgfVxuICAgIGNhc2UgJ1RlbnNvckFycmF5V3JpdGVWMyc6IHtcbiAgICAgIGNvbnN0IGlkID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCd0ZW5zb3JBcnJheUlkJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3I7XG4gICAgICBjb25zdCBpbmRleCA9IGdldFBhcmFtVmFsdWUoJ2luZGV4Jywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBudW1iZXI7XG4gICAgICBjb25zdCB3cml0ZVRlbnNvciA9XG4gICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgndGVuc29yJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3I7XG4gICAgICBjb25zdCB3cml0ZVRlbnNvckFycmF5ID0gY29udGV4dC5nZXRUZW5zb3JBcnJheShpZC5pZCk7XG4gICAgICB3cml0ZVRlbnNvckFycmF5LndyaXRlKGluZGV4LCB3cml0ZVRlbnNvcik7XG4gICAgICByZXR1cm4gW3dyaXRlVGVuc29yQXJyYXkuaWRUZW5zb3JdO1xuICAgIH1cbiAgICBjYXNlICdUZW5zb3JBcnJheVJlYWRWMyc6IHtcbiAgICAgIGNvbnN0IHJlYWRJZCA9XG4gICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgndGVuc29yQXJyYXlJZCcsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yO1xuICAgICAgY29uc3QgcmVhZEluZGV4ID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdpbmRleCcsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgbnVtYmVyO1xuICAgICAgY29uc3QgcmVhZFRlbnNvckFycmF5ID0gY29udGV4dC5nZXRUZW5zb3JBcnJheShyZWFkSWQuaWQpO1xuICAgICAgcmV0dXJuIFtyZWFkVGVuc29yQXJyYXkucmVhZChyZWFkSW5kZXgpXTtcbiAgICB9XG4gICAgY2FzZSAnVGVuc29yQXJyYXlHYXRoZXJWMyc6IHtcbiAgICAgIGNvbnN0IGdhdGhlcklkID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCd0ZW5zb3JBcnJheUlkJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3I7XG4gICAgICBjb25zdCBnYXRoZXJJbmRpY2VzID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdpbmRpY2VzJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBudW1iZXJbXTtcbiAgICAgIGNvbnN0IGdhdGhlckR0eXBlID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdkdHlwZScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgRGF0YVR5cGU7XG4gICAgICBjb25zdCBnYXRoZXJUZW5zb3JBcnJheSA9IGNvbnRleHQuZ2V0VGVuc29yQXJyYXkoZ2F0aGVySWQuaWQpO1xuICAgICAgcmV0dXJuIFtnYXRoZXJUZW5zb3JBcnJheS5nYXRoZXIoZ2F0aGVySW5kaWNlcywgZ2F0aGVyRHR5cGUpXTtcbiAgICB9XG4gICAgY2FzZSAnVGVuc29yQXJyYXlTY2F0dGVyVjMnOiB7XG4gICAgICBjb25zdCBzY2F0dGVySWQgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3RlbnNvckFycmF5SWQnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIFRlbnNvcjtcbiAgICAgIGNvbnN0IHNjYXR0ZXJJbmRpY2VzID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdpbmRpY2VzJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBudW1iZXJbXTtcbiAgICAgIGNvbnN0IHNjYXR0ZXJUZW5zb3IgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3RlbnNvcicsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yO1xuICAgICAgY29uc3Qgc2NhdHRlclRlbnNvckFycmF5ID0gY29udGV4dC5nZXRUZW5zb3JBcnJheShzY2F0dGVySWQuaWQpO1xuICAgICAgc2NhdHRlclRlbnNvckFycmF5LnNjYXR0ZXIoc2NhdHRlckluZGljZXMsIHNjYXR0ZXJUZW5zb3IpO1xuICAgICAgcmV0dXJuIFtzY2F0dGVyVGVuc29yQXJyYXkuaWRUZW5zb3JdO1xuICAgIH1cbiAgICBjYXNlICdUZW5zb3JBcnJheUNvbmNhdFYzJzoge1xuICAgICAgY29uc3QgY29uY2F0SWQgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3RlbnNvckFycmF5SWQnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIFRlbnNvcjtcbiAgICAgIGNvbnN0IGNvbmNhdFRlbnNvckFycmF5ID0gY29udGV4dC5nZXRUZW5zb3JBcnJheShjb25jYXRJZC5pZCk7XG4gICAgICBjb25zdCBjb25jYXREdHlwZSA9XG4gICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgnZHR5cGUnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIERhdGFUeXBlO1xuICAgICAgcmV0dXJuIFtjb25jYXRUZW5zb3JBcnJheS5jb25jYXQoY29uY2F0RHR5cGUpXTtcbiAgICB9XG4gICAgY2FzZSAnVGVuc29yQXJyYXlTcGxpdFYzJzoge1xuICAgICAgY29uc3Qgc3BsaXRJZCA9XG4gICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgndGVuc29yQXJyYXlJZCcsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yO1xuICAgICAgY29uc3Qgc3BsaXRUZW5zb3IgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3RlbnNvcicsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yO1xuICAgICAgY29uc3QgbGVuZ3RocyA9XG4gICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgnbGVuZ3RocycsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgbnVtYmVyW107XG4gICAgICBjb25zdCBzcGxpdFRlbnNvckFycmF5ID0gY29udGV4dC5nZXRUZW5zb3JBcnJheShzcGxpdElkLmlkKTtcbiAgICAgIHNwbGl0VGVuc29yQXJyYXkuc3BsaXQobGVuZ3Rocywgc3BsaXRUZW5zb3IpO1xuICAgICAgcmV0dXJuIFtzcGxpdFRlbnNvckFycmF5LmlkVGVuc29yXTtcbiAgICB9XG4gICAgY2FzZSAnVGVuc29yQXJyYXlTaXplVjMnOiB7XG4gICAgICBjb25zdCBzaXplSWQgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3RlbnNvckFycmF5SWQnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIFRlbnNvcjtcbiAgICAgIGNvbnN0IHNpemVUZW5zb3JBcnJheSA9IGNvbnRleHQuZ2V0VGVuc29yQXJyYXkoc2l6ZUlkLmlkKTtcbiAgICAgIHJldHVybiBbc2NhbGFyKHNpemVUZW5zb3JBcnJheS5zaXplKCksICdpbnQzMicpXTtcbiAgICB9XG4gICAgY2FzZSAnVGVuc29yQXJyYXlDbG9zZVYzJzoge1xuICAgICAgY29uc3QgY2xvc2VJZCA9XG4gICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgndGVuc29yQXJyYXlJZCcsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yO1xuICAgICAgY29uc3QgY2xvc2VUZW5zb3JBcnJheSA9IGNvbnRleHQuZ2V0VGVuc29yQXJyYXkoY2xvc2VJZC5pZCk7XG4gICAgICBjbG9zZVRlbnNvckFycmF5LmNsZWFyQW5kQ2xvc2UoKTtcbiAgICAgIHJldHVybiBbY2xvc2VUZW5zb3JBcnJheS5pZFRlbnNvcl07XG4gICAgfVxuICAgIGNhc2UgJ1RlbnNvckxpc3RTZXRJdGVtJzoge1xuICAgICAgY29uc3QgaWRUZW5zb3IgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3RlbnNvckxpc3RJZCcsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yO1xuICAgICAgY29uc3QgaW5kZXggPSBnZXRQYXJhbVZhbHVlKCdpbmRleCcsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgbnVtYmVyO1xuICAgICAgY29uc3Qgd3JpdGVUZW5zb3IgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3RlbnNvcicsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yO1xuICAgICAgY29uc3QgdGVuc29yTGlzdCA9IGNvbnRleHQuZ2V0VGVuc29yTGlzdChpZFRlbnNvci5pZCk7XG4gICAgICB0ZW5zb3JMaXN0LnNldEl0ZW0oaW5kZXgsIHdyaXRlVGVuc29yKTtcbiAgICAgIHJldHVybiBbdGVuc29yTGlzdC5pZFRlbnNvcl07XG4gICAgfVxuICAgIGNhc2UgJ1RlbnNvckxpc3RHZXRJdGVtJzoge1xuICAgICAgY29uc3QgaWRUZW5zb3IgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3RlbnNvckxpc3RJZCcsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yO1xuICAgICAgY29uc3QgcmVhZEluZGV4ID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdpbmRleCcsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgbnVtYmVyO1xuICAgICAgY29uc3QgZWxlbWVudFNoYXBlID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdlbGVtZW50U2hhcGUnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIG51bWJlcltdO1xuXG4gICAgICBjb25zdCBlbGVtZW50RFR5cGUgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ2VsZW1lbnREVHlwZScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgRGF0YVR5cGU7XG4gICAgICBjb25zdCB0ZW5zb3JMaXN0ID0gY29udGV4dC5nZXRUZW5zb3JMaXN0KGlkVGVuc29yLmlkKTtcbiAgICAgIHJldHVybiBbdGVuc29yTGlzdC5nZXRJdGVtKHJlYWRJbmRleCwgZWxlbWVudFNoYXBlLCBlbGVtZW50RFR5cGUpXTtcbiAgICB9XG4gICAgY2FzZSAnVGVuc29yTGlzdFNjYXR0ZXJWMic6XG4gICAgY2FzZSAnVGVuc29yTGlzdFNjYXR0ZXInOiB7XG4gICAgICBjb25zdCBzY2F0dGVySW5kaWNlcyA9XG4gICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgnaW5kaWNlcycsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgbnVtYmVyW107XG4gICAgICBjb25zdCBzY2F0dGVyVGVuc29yID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCd0ZW5zb3InLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIFRlbnNvcjtcbiAgICAgIGNvbnN0IGVsZW1lbnRTaGFwZSA9XG4gICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgnZWxlbWVudFNoYXBlJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBudW1iZXJbXTtcbiAgICAgIGNvbnN0IG51bUVsZW1lbnRzID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdudW1FbGVtZW50cycsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgbnVtYmVyO1xuICAgICAgY29uc3QgdGVuc29yTGlzdCA9XG4gICAgICAgICAgc2NhdHRlcihzY2F0dGVyVGVuc29yLCBzY2F0dGVySW5kaWNlcywgZWxlbWVudFNoYXBlLCBudW1FbGVtZW50cyk7XG4gICAgICBjb250ZXh0LmFkZFRlbnNvckxpc3QodGVuc29yTGlzdCk7XG4gICAgICByZXR1cm4gW3RlbnNvckxpc3QuaWRUZW5zb3JdO1xuICAgIH1cbiAgICBjYXNlICdUZW5zb3JMaXN0UmVzZXJ2ZSc6XG4gICAgY2FzZSAnRW1wdHlUZW5zb3JMaXN0Jzoge1xuICAgICAgY29uc3QgZWxlbWVudFNoYXBlID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdlbGVtZW50U2hhcGUnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIG51bWJlcltdO1xuICAgICAgY29uc3QgZWxlbWVudER0eXBlID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdlbGVtZW50RFR5cGUnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIERhdGFUeXBlO1xuICAgICAgbGV0IG51bUVsZW1lbnRzUGFyYW07XG5cbiAgICAgIGlmIChub2RlLm9wID09PSAnVGVuc29yTGlzdFJlc2VydmUnKSB7XG4gICAgICAgIG51bUVsZW1lbnRzUGFyYW0gPSAnbnVtRWxlbWVudHMnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbnVtRWxlbWVudHNQYXJhbSA9ICdtYXhOdW1FbGVtZW50cyc7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG51bUVsZW1lbnRzID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKG51bUVsZW1lbnRzUGFyYW0sIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgbnVtYmVyO1xuICAgICAgY29uc3QgbWF4TnVtRWxlbWVudHMgPSBub2RlLm9wID09PSAnVGVuc29yTGlzdFJlc2VydmUnID8gLTEgOiBudW1FbGVtZW50cztcbiAgICAgIGNvbnN0IHRlbnNvckxpc3QgPVxuICAgICAgICAgIHJlc2VydmUoZWxlbWVudFNoYXBlLCBlbGVtZW50RHR5cGUsIG51bUVsZW1lbnRzLCBtYXhOdW1FbGVtZW50cyk7XG4gICAgICBjb250ZXh0LmFkZFRlbnNvckxpc3QodGVuc29yTGlzdCk7XG4gICAgICByZXR1cm4gW3RlbnNvckxpc3QuaWRUZW5zb3JdO1xuICAgIH1cbiAgICBjYXNlICdUZW5zb3JMaXN0R2F0aGVyJzoge1xuICAgICAgY29uc3QgZ2F0aGVySWQgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3RlbnNvckxpc3RJZCcsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yO1xuICAgICAgY29uc3QgZ2F0aGVySW5kaWNlcyA9XG4gICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgnaW5kaWNlcycsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgbnVtYmVyW107XG4gICAgICBjb25zdCBlbGVtZW50U2hhcGUgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ2VsZW1lbnRTaGFwZScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgbnVtYmVyW107XG4gICAgICBjb25zdCBlbGVtZW50RHR5cGUgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ2VsZW1lbnREVHlwZScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgRGF0YVR5cGU7XG4gICAgICBjb25zdCB0ZW5zb3JMaXN0ID0gY29udGV4dC5nZXRUZW5zb3JMaXN0KGdhdGhlcklkLmlkKTtcbiAgICAgIHJldHVybiBbdGVuc29yTGlzdC5nYXRoZXIoZ2F0aGVySW5kaWNlcywgZWxlbWVudER0eXBlLCBlbGVtZW50U2hhcGUpXTtcbiAgICB9XG4gICAgY2FzZSAnVGVuc29yTGlzdFN0YWNrJzoge1xuICAgICAgY29uc3QgaWRUZW5zb3IgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3RlbnNvckxpc3RJZCcsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yO1xuICAgICAgY29uc3QgZWxlbWVudFNoYXBlID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdlbGVtZW50U2hhcGUnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIG51bWJlcltdO1xuICAgICAgY29uc3QgZWxlbWVudER0eXBlID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdlbGVtZW50RFR5cGUnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIERhdGFUeXBlO1xuICAgICAgY29uc3QgbnVtRWxlbWVudHMgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ251bUVsZW1lbnRzJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBudW1iZXI7XG4gICAgICBjb25zdCB0ZW5zb3JMaXN0ID0gY29udGV4dC5nZXRUZW5zb3JMaXN0KGlkVGVuc29yLmlkKTtcbiAgICAgIHJldHVybiBbdGVuc29yTGlzdC5zdGFjayhlbGVtZW50U2hhcGUsIGVsZW1lbnREdHlwZSwgbnVtRWxlbWVudHMpXTtcbiAgICB9XG4gICAgY2FzZSAnVGVuc29yTGlzdEZyb21UZW5zb3InOiB7XG4gICAgICBjb25zdCB0ZW5zb3IgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3RlbnNvcicsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yO1xuICAgICAgY29uc3QgZWxlbWVudFNoYXBlID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdlbGVtZW50U2hhcGUnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIG51bWJlcltdO1xuICAgICAgY29uc3QgZWxlbWVudER0eXBlID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdlbGVtZW50RFR5cGUnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIERhdGFUeXBlO1xuICAgICAgY29uc3QgdGVuc29yTGlzdCA9IGZyb21UZW5zb3IodGVuc29yLCBlbGVtZW50U2hhcGUsIGVsZW1lbnREdHlwZSk7XG4gICAgICBjb250ZXh0LmFkZFRlbnNvckxpc3QodGVuc29yTGlzdCk7XG4gICAgICByZXR1cm4gW3RlbnNvckxpc3QuaWRUZW5zb3JdO1xuICAgIH1cbiAgICBjYXNlICdUZW5zb3JMaXN0Q29uY2F0JzpcbiAgICBjYXNlICdUZW5zb3JMaXN0Q29uY2F0VjInOiB7XG4gICAgICBjb25zdCBjb25jYXRJZCA9XG4gICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgndGVuc29yTGlzdElkJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3I7XG4gICAgICBjb25zdCB0ZW5zb3JMaXN0ID0gY29udGV4dC5nZXRUZW5zb3JMaXN0KGNvbmNhdElkLmlkKTtcbiAgICAgIGNvbnN0IGNvbmNhdER0eXBlID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdkdHlwZScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgRGF0YVR5cGU7XG4gICAgICBjb25zdCBlbGVtZW50U2hhcGUgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ2VsZW1lbnRTaGFwZScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgbnVtYmVyW107XG4gICAgICByZXR1cm4gW3RlbnNvckxpc3QuY29uY2F0KGNvbmNhdER0eXBlLCBlbGVtZW50U2hhcGUpXTtcbiAgICB9XG4gICAgY2FzZSAnVGVuc29yTGlzdFB1c2hCYWNrJzoge1xuICAgICAgY29uc3QgaWRUZW5zb3IgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3RlbnNvckxpc3RJZCcsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yO1xuICAgICAgY29uc3Qgd3JpdGVUZW5zb3IgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3RlbnNvcicsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yO1xuICAgICAgY29uc3QgdGVuc29yTGlzdCA9IGNvbnRleHQuZ2V0VGVuc29yTGlzdChpZFRlbnNvci5pZCk7XG4gICAgICB0ZW5zb3JMaXN0LnB1c2hCYWNrKHdyaXRlVGVuc29yKTtcbiAgICAgIHJldHVybiBbdGVuc29yTGlzdC5pZFRlbnNvcl07XG4gICAgfVxuICAgIGNhc2UgJ1RlbnNvckxpc3RQb3BCYWNrJzoge1xuICAgICAgY29uc3QgaWRUZW5zb3IgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ3RlbnNvckxpc3RJZCcsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgVGVuc29yO1xuICAgICAgY29uc3QgZWxlbWVudFNoYXBlID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdlbGVtZW50U2hhcGUnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIG51bWJlcltdO1xuICAgICAgY29uc3QgZWxlbWVudERUeXBlID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdlbGVtZW50RFR5cGUnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIERhdGFUeXBlO1xuICAgICAgY29uc3QgdGVuc29yTGlzdCA9IGNvbnRleHQuZ2V0VGVuc29yTGlzdChpZFRlbnNvci5pZCk7XG4gICAgICByZXR1cm4gW3RlbnNvckxpc3QucG9wQmFjayhlbGVtZW50U2hhcGUsIGVsZW1lbnREVHlwZSldO1xuICAgIH1cbiAgICBjYXNlICdUZW5zb3JMaXN0U3BsaXQnOiB7XG4gICAgICBjb25zdCBzcGxpdFRlbnNvciA9XG4gICAgICAgICAgZ2V0UGFyYW1WYWx1ZSgndGVuc29yJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBUZW5zb3I7XG4gICAgICBjb25zdCBlbGVtZW50U2hhcGUgPVxuICAgICAgICAgIGdldFBhcmFtVmFsdWUoJ2VsZW1lbnRTaGFwZScsIG5vZGUsIHRlbnNvck1hcCwgY29udGV4dCkgYXMgbnVtYmVyW107XG4gICAgICBjb25zdCBsZW5ndGhzID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCdsZW5ndGhzJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBudW1iZXJbXTtcblxuICAgICAgY29uc3QgdGVuc29yTGlzdCA9IHNwbGl0KHNwbGl0VGVuc29yLCBsZW5ndGhzLCBlbGVtZW50U2hhcGUpO1xuICAgICAgY29udGV4dC5hZGRUZW5zb3JMaXN0KHRlbnNvckxpc3QpO1xuICAgICAgcmV0dXJuIFt0ZW5zb3JMaXN0LmlkVGVuc29yXTtcbiAgICB9XG4gICAgY2FzZSAnVGVuc29yTGlzdExlbmd0aCc6IHtcbiAgICAgIGNvbnN0IGlkVGVuc29yID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCd0ZW5zb3JMaXN0SWQnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIFRlbnNvcjtcbiAgICAgIGNvbnN0IHRlbnNvckxpc3QgPSBjb250ZXh0LmdldFRlbnNvckxpc3QoaWRUZW5zb3IuaWQpO1xuICAgICAgcmV0dXJuIFtzY2FsYXIodGVuc29yTGlzdC5zaXplKCksICdpbnQzMicpXTtcbiAgICB9XG4gICAgY2FzZSAnVGVuc29yTGlzdFJlc2l6ZSc6IHtcbiAgICAgIGNvbnN0IGlkVGVuc29yID1cbiAgICAgICAgICBnZXRQYXJhbVZhbHVlKCd0ZW5zb3JMaXN0SWQnLCBub2RlLCB0ZW5zb3JNYXAsIGNvbnRleHQpIGFzIFRlbnNvcjtcbiAgICAgIGNvbnN0IHNpemUgPSBnZXRQYXJhbVZhbHVlKCdzaXplJywgbm9kZSwgdGVuc29yTWFwLCBjb250ZXh0KSBhcyBudW1iZXI7XG5cbiAgICAgIGNvbnN0IHNyY1RlbnNvckxpc3QgPSBjb250ZXh0LmdldFRlbnNvckxpc3QoaWRUZW5zb3IuaWQpO1xuICAgICAgY29uc3QgZGVzdFRlbnNvckxpc3QgPSBzcmNUZW5zb3JMaXN0LnJlc2l6ZShzaXplKTtcbiAgICAgIGNvbnRleHQuYWRkVGVuc29yTGlzdChkZXN0VGVuc29yTGlzdCk7XG4gICAgICByZXR1cm4gW2Rlc3RUZW5zb3JMaXN0LmlkVGVuc29yXTtcbiAgICB9XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IFR5cGVFcnJvcihgTm9kZSB0eXBlICR7bm9kZS5vcH0gaXMgbm90IGltcGxlbWVudGVkYCk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBDQVRFR09SWSA9ICdjb250cm9sJztcbiJdfQ==