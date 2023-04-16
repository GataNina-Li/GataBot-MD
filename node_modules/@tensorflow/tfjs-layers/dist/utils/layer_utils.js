/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
import { countParamsInWeights } from './variable_utils';
/**
 * Print the summary of a LayersModel object.
 *
 * @param model tf.LayersModel instance.
 * @param lineLength Total length of printed lines. Set this to adapt to the
 *   display to different terminal or console sizes.
 * @param positions Relative or absolute positions of log elements in each
 *   line. Each number corresponds to right-most (i.e., ending) position of a
 *   column.
 *   If not provided, defaults to `[0.45, 0.85, 1]` for sequential-like
 *   models and `[0.33, 0.55, 0.67, 1]` for non-sequential like models.
 * @param printFn Print function to use.
 *   It will be called on each line of the summary. You can provide a custom
 *   function in order to capture the string summary. Defaults to `console.log`.
 */
export function printSummary(model, lineLength, positions, 
// tslint:disable-next-line:no-any
printFn = console.log) {
    const sequentialLike = isModelSequentialLike(model);
    // Header names for different log elements.
    const toDisplay = ['Layer (type)', 'Input Shape', 'Output shape', 'Param #'];
    if (sequentialLike) {
        lineLength = lineLength || 90;
        positions = positions || [0.32, 0.61, 0.89, 1];
    }
    else {
        lineLength = lineLength || 115;
        positions = positions || [0.24, 0.48, 0.70, 0.80, 1];
        // Header names for different log elements.
    }
    if (positions[positions.length - 1] <= 1) {
        // `positions` is relative. Convert it to absolute positioning.
        positions = positions.map(p => Math.floor(lineLength * p));
    }
    let relevantNodes;
    if (!sequentialLike) {
        toDisplay.push('Receives inputs');
        relevantNodes = [];
        for (const depth in model.nodesByDepth) {
            relevantNodes.push(...model.nodesByDepth[depth]);
        }
    }
    printFn('_'.repeat(lineLength));
    printRow(toDisplay, positions, printFn);
    printFn('='.repeat(lineLength));
    const layers = model.layers;
    for (let i = 0; i < layers.length; ++i) {
        if (sequentialLike) {
            printLayerSummary(layers[i], positions, printFn);
        }
        else {
            printLayerSummaryWithConnections(layers[i], positions, relevantNodes, printFn);
        }
        printFn((i === layers.length - 1 ? '=' : '_').repeat(lineLength));
    }
    // tslint:disable-next-line:no-any
    model.checkTrainableWeightsConsistency();
    const trainableCount = countTrainableParams(model);
    const nonTrainableCount = countParamsInWeights(model.nonTrainableWeights);
    printFn(`Total params: ${trainableCount + nonTrainableCount}`);
    printFn(`Trainable params: ${trainableCount}`);
    printFn(`Non-trainable params: ${nonTrainableCount}`);
    printFn('_'.repeat(lineLength));
}
function countTrainableParams(model) {
    let trainableCount;
    // tslint:disable:no-any
    if (model.collectedTrainableWeights != null) {
        trainableCount =
            countParamsInWeights(model.collectedTrainableWeights);
    }
    else {
        trainableCount = countParamsInWeights(model.trainableWeights);
    }
    // tslint:enable:no-any
    return trainableCount;
}
function isModelSequentialLike(model) {
    let sequentialLike = true;
    const nodesByDepth = [];
    const nodes = [];
    for (const depth in model.nodesByDepth) {
        nodesByDepth.push(model.nodesByDepth[depth]);
    }
    for (const depthNodes of nodesByDepth) {
        if (depthNodes.length > 1 ||
            depthNodes.length === 1 && depthNodes[0].inboundLayers.length > 1) {
            sequentialLike = false;
            break;
        }
        nodes.push(...depthNodes);
    }
    if (sequentialLike) {
        // Search for shared layers.
        for (const layer of model.layers) {
            let flag = false;
            for (const node of layer.inboundNodes) {
                if (nodes.indexOf(node) !== -1) {
                    if (flag) {
                        sequentialLike = false;
                        break;
                    }
                    else {
                        flag = true;
                    }
                }
            }
            if (!sequentialLike) {
                break;
            }
        }
    }
    return sequentialLike;
}
function printRow(fields, positions, 
// tslint:disable-next-line:no-any
printFn = console.log) {
    let line = '';
    for (let i = 0; i < fields.length; ++i) {
        if (i > 0) {
            line = line.slice(0, line.length - 1) + ' ';
        }
        line += fields[i];
        line = line.slice(0, positions[i]);
        line += ' '.repeat(positions[i] - line.length);
    }
    printFn(line);
}
/**
 * Prints a summary for a single Layer, without connectivity information.
 *
 * @param layer: Layer instance to print.
 */
function printLayerSummary(layer, positions, 
// tslint:disable-next-line:no-any
printFn) {
    let outputShape;
    let inputShape;
    try {
        inputShape = (layer.inboundNodes.map(x => JSON.stringify(x.inputShapes))).join(',');
    }
    catch (err) {
        inputShape = 'multiple';
    }
    try {
        outputShape = JSON.stringify(layer.outputShape);
    }
    catch (err) {
        outputShape = 'multiple';
    }
    const name = layer.name;
    const className = layer.getClassName();
    const fields = [`${name} (${className})`, inputShape,
        outputShape, layer.countParams().toString()];
    printRow(fields, positions, printFn);
}
/**
 * Prints a summary for a single Layer, with connectivity information.
 */
function printLayerSummaryWithConnections(layer, positions, relevantNodes, 
// tslint:disable-next-line:no-any
printFn) {
    let outputShape;
    let inputShape;
    try {
        inputShape = (layer.inboundNodes.map(x => JSON.stringify(x.inputShapes))).join(',');
    }
    catch (err) {
        inputShape = 'multiple';
    }
    try {
        outputShape = JSON.stringify(layer.outputShape);
    }
    catch (err) {
        outputShape = 'multiple';
    }
    const connections = [];
    for (const node of layer.inboundNodes) {
        if (relevantNodes != null && relevantNodes.length > 0 &&
            relevantNodes.indexOf(node) === -1) {
            continue;
        }
        for (let i = 0; i < node.inboundLayers.length; ++i) {
            const inboundLayer = node.inboundLayers[i].name;
            const inboundLayerIndex = node.nodeIndices[i];
            const inboundTensorIndex = node.tensorIndices[i];
            connections.push(`${inboundLayer}[${inboundLayerIndex}][${inboundTensorIndex}]`);
        }
    }
    const name = layer.name;
    const className = layer.getClassName();
    const firstConnection = connections.length === 0 ? '' : connections[0];
    const fields = [
        `${name} (${className})`, inputShape,
        outputShape, layer.countParams().toString(),
        firstConnection
    ];
    printRow(fields, positions, printFn);
    for (let i = 1; i < connections.length; ++i) {
        printRow(['', '', '', '', connections[i]], positions, printFn);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXJfdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWxheWVycy9zcmMvdXRpbHMvbGF5ZXJfdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0dBUUc7QUFJSCxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUV0RDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNILE1BQU0sVUFBVSxZQUFZLENBQ3hCLEtBQWdCLEVBQUUsVUFBbUIsRUFBRSxTQUFvQjtBQUMzRCxrQ0FBa0M7QUFDbEMsVUFDSSxPQUFPLENBQUMsR0FBRztJQUNqQixNQUFNLGNBQWMsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVwRCwyQ0FBMkM7SUFDM0MsTUFBTSxTQUFTLEdBQWEsQ0FBQyxjQUFjLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN2RixJQUFJLGNBQWMsRUFBRTtRQUNsQixVQUFVLEdBQUcsVUFBVSxJQUFJLEVBQUUsQ0FBQztRQUM5QixTQUFTLEdBQUcsU0FBUyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDaEQ7U0FBTTtRQUNMLFVBQVUsR0FBRyxVQUFVLElBQUksR0FBRyxDQUFDO1FBQy9CLFNBQVMsR0FBRyxTQUFTLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckQsMkNBQTJDO0tBQzVDO0lBRUQsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDeEMsK0RBQStEO1FBQy9ELFNBQVMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM1RDtJQUVELElBQUksYUFBcUIsQ0FBQztJQUMxQixJQUFJLENBQUMsY0FBYyxFQUFFO1FBQ25CLFNBQVMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNsQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ25CLEtBQUssTUFBTSxLQUFLLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRTtZQUN0QyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ2xEO0tBQ0Y7SUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFFaEMsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUM1QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtRQUN0QyxJQUFJLGNBQWMsRUFBRTtZQUNsQixpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ2xEO2FBQU07WUFDTCxnQ0FBZ0MsQ0FDNUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDbkQ7UUFDRCxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7S0FDbkU7SUFFRCxrQ0FBa0M7SUFDakMsS0FBYSxDQUFDLGdDQUFnQyxFQUFFLENBQUM7SUFFbEQsTUFBTSxjQUFjLEdBQUcsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkQsTUFBTSxpQkFBaUIsR0FBRyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUUxRSxPQUFPLENBQUMsaUJBQWlCLGNBQWMsR0FBRyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7SUFDL0QsT0FBTyxDQUFDLHFCQUFxQixjQUFjLEVBQUUsQ0FBQyxDQUFDO0lBQy9DLE9BQU8sQ0FBQyx5QkFBeUIsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUVELFNBQVMsb0JBQW9CLENBQUMsS0FBZ0I7SUFDNUMsSUFBSSxjQUFzQixDQUFDO0lBQzNCLHdCQUF3QjtJQUN4QixJQUFLLEtBQWEsQ0FBQyx5QkFBeUIsSUFBSSxJQUFJLEVBQUU7UUFDcEQsY0FBYztZQUNWLG9CQUFvQixDQUFFLEtBQWEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0tBQ3BFO1NBQU07UUFDTCxjQUFjLEdBQUcsb0JBQW9CLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7S0FDL0Q7SUFDRCx1QkFBdUI7SUFDdkIsT0FBTyxjQUFjLENBQUM7QUFDeEIsQ0FBQztBQUVELFNBQVMscUJBQXFCLENBQUMsS0FBZ0I7SUFDN0MsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDO0lBQzFCLE1BQU0sWUFBWSxHQUFhLEVBQUUsQ0FBQztJQUNsQyxNQUFNLEtBQUssR0FBVyxFQUFFLENBQUM7SUFDekIsS0FBSyxNQUFNLEtBQUssSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFO1FBQ3RDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBQzlDO0lBQ0QsS0FBSyxNQUFNLFVBQVUsSUFBSSxZQUFZLEVBQUU7UUFDckMsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUM7WUFDckIsVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3JFLGNBQWMsR0FBRyxLQUFLLENBQUM7WUFDdkIsTUFBTTtTQUNQO1FBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDO0tBQzNCO0lBQ0QsSUFBSSxjQUFjLEVBQUU7UUFDbEIsNEJBQTRCO1FBQzVCLEtBQUssTUFBTSxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNoQyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUM7WUFDakIsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFO2dCQUNyQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7b0JBQzlCLElBQUksSUFBSSxFQUFFO3dCQUNSLGNBQWMsR0FBRyxLQUFLLENBQUM7d0JBQ3ZCLE1BQU07cUJBQ1A7eUJBQU07d0JBQ0wsSUFBSSxHQUFHLElBQUksQ0FBQztxQkFDYjtpQkFDRjthQUNGO1lBQ0QsSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDbkIsTUFBTTthQUNQO1NBQ0Y7S0FDRjtJQUNELE9BQU8sY0FBYyxDQUFDO0FBQ3hCLENBQUM7QUFFRCxTQUFTLFFBQVEsQ0FDYixNQUFnQixFQUFFLFNBQW1CO0FBQ3JDLGtDQUFrQztBQUNsQyxVQUE2RCxPQUFPLENBQUMsR0FBRztJQUMxRSxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7SUFDZCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtRQUN0QyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDVCxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7U0FDN0M7UUFDRCxJQUFJLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxJQUFJLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2hEO0lBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hCLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBUyxpQkFBaUIsQ0FDdEIsS0FBWSxFQUFFLFNBQW1CO0FBQ2pDLGtDQUFrQztBQUNsQyxPQUEwRDtJQUM1RCxJQUFJLFdBQW1CLENBQUM7SUFDeEIsSUFBSSxVQUFrQixDQUFDO0lBRXZCLElBQUk7UUFDRixVQUFVLEdBQUcsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FDbEMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FDbkMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNkO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixVQUFVLEdBQUcsVUFBVSxDQUFDO0tBQ3pCO0lBRUQsSUFBSTtRQUNGLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUNqRDtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osV0FBVyxHQUFHLFVBQVUsQ0FBQztLQUMxQjtJQUVELE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDeEIsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3ZDLE1BQU0sTUFBTSxHQUNSLENBQUMsR0FBRyxJQUFJLEtBQUssU0FBUyxHQUFHLEVBQUUsVUFBVTtRQUNyQyxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDakQsUUFBUSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxnQ0FBZ0MsQ0FDckMsS0FBWSxFQUFFLFNBQW1CLEVBQUUsYUFBcUI7QUFDeEQsa0NBQWtDO0FBQ2xDLE9BQTBEO0lBQzVELElBQUksV0FBbUIsQ0FBQztJQUN4QixJQUFJLFVBQWtCLENBQUM7SUFFdkIsSUFBSTtRQUNGLFVBQVUsR0FBRyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUNsQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUNuQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2Q7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLFVBQVUsR0FBRyxVQUFVLENBQUM7S0FDekI7SUFFRCxJQUFJO1FBQ0YsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ2pEO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixXQUFXLEdBQUcsVUFBVSxDQUFDO0tBQzFCO0lBRUQsTUFBTSxXQUFXLEdBQWEsRUFBRSxDQUFDO0lBQ2pDLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRTtRQUNyQyxJQUFJLGFBQWEsSUFBSSxJQUFJLElBQUksYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDO1lBQ2pELGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDdEMsU0FBUztTQUNWO1FBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ2xELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ2hELE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QyxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakQsV0FBVyxDQUFDLElBQUksQ0FDWixHQUFHLFlBQVksSUFBSSxpQkFBaUIsS0FBSyxrQkFBa0IsR0FBRyxDQUFDLENBQUM7U0FDckU7S0FDRjtJQUNELE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDeEIsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3ZDLE1BQU0sZUFBZSxHQUFHLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RSxNQUFNLE1BQU0sR0FBYTtRQUN2QixHQUFHLElBQUksS0FBSyxTQUFTLEdBQUcsRUFBRSxVQUFVO1FBQ3BDLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQzNDLGVBQWU7S0FDaEIsQ0FBQztJQUVGLFFBQVEsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3JDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQzNDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDaEU7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICogbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gKiBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtDb250YWluZXJ9IGZyb20gJy4uL2VuZ2luZS9jb250YWluZXInO1xuaW1wb3J0IHtMYXllciwgTm9kZX0gZnJvbSAnLi4vZW5naW5lL3RvcG9sb2d5JztcbmltcG9ydCB7Y291bnRQYXJhbXNJbldlaWdodHN9IGZyb20gJy4vdmFyaWFibGVfdXRpbHMnO1xuXG4vKipcbiAqIFByaW50IHRoZSBzdW1tYXJ5IG9mIGEgTGF5ZXJzTW9kZWwgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSBtb2RlbCB0Zi5MYXllcnNNb2RlbCBpbnN0YW5jZS5cbiAqIEBwYXJhbSBsaW5lTGVuZ3RoIFRvdGFsIGxlbmd0aCBvZiBwcmludGVkIGxpbmVzLiBTZXQgdGhpcyB0byBhZGFwdCB0byB0aGVcbiAqICAgZGlzcGxheSB0byBkaWZmZXJlbnQgdGVybWluYWwgb3IgY29uc29sZSBzaXplcy5cbiAqIEBwYXJhbSBwb3NpdGlvbnMgUmVsYXRpdmUgb3IgYWJzb2x1dGUgcG9zaXRpb25zIG9mIGxvZyBlbGVtZW50cyBpbiBlYWNoXG4gKiAgIGxpbmUuIEVhY2ggbnVtYmVyIGNvcnJlc3BvbmRzIHRvIHJpZ2h0LW1vc3QgKGkuZS4sIGVuZGluZykgcG9zaXRpb24gb2YgYVxuICogICBjb2x1bW4uXG4gKiAgIElmIG5vdCBwcm92aWRlZCwgZGVmYXVsdHMgdG8gYFswLjQ1LCAwLjg1LCAxXWAgZm9yIHNlcXVlbnRpYWwtbGlrZVxuICogICBtb2RlbHMgYW5kIGBbMC4zMywgMC41NSwgMC42NywgMV1gIGZvciBub24tc2VxdWVudGlhbCBsaWtlIG1vZGVscy5cbiAqIEBwYXJhbSBwcmludEZuIFByaW50IGZ1bmN0aW9uIHRvIHVzZS5cbiAqICAgSXQgd2lsbCBiZSBjYWxsZWQgb24gZWFjaCBsaW5lIG9mIHRoZSBzdW1tYXJ5LiBZb3UgY2FuIHByb3ZpZGUgYSBjdXN0b21cbiAqICAgZnVuY3Rpb24gaW4gb3JkZXIgdG8gY2FwdHVyZSB0aGUgc3RyaW5nIHN1bW1hcnkuIERlZmF1bHRzIHRvIGBjb25zb2xlLmxvZ2AuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcmludFN1bW1hcnkoXG4gICAgbW9kZWw6IENvbnRhaW5lciwgbGluZUxlbmd0aD86IG51bWJlciwgcG9zaXRpb25zPzogbnVtYmVyW10sXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgIHByaW50Rm46IChtZXNzYWdlPzogYW55LCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pID0+IHZvaWQgPVxuICAgICAgICBjb25zb2xlLmxvZyk6IHZvaWQge1xuICBjb25zdCBzZXF1ZW50aWFsTGlrZSA9IGlzTW9kZWxTZXF1ZW50aWFsTGlrZShtb2RlbCk7XG5cbiAgLy8gSGVhZGVyIG5hbWVzIGZvciBkaWZmZXJlbnQgbG9nIGVsZW1lbnRzLlxuICBjb25zdCB0b0Rpc3BsYXk6IHN0cmluZ1tdID0gWydMYXllciAodHlwZSknLCAnSW5wdXQgU2hhcGUnLCAnT3V0cHV0IHNoYXBlJywgJ1BhcmFtICMnXTtcbiAgaWYgKHNlcXVlbnRpYWxMaWtlKSB7XG4gICAgbGluZUxlbmd0aCA9IGxpbmVMZW5ndGggfHwgOTA7XG4gICAgcG9zaXRpb25zID0gcG9zaXRpb25zIHx8IFswLjMyLCAwLjYxLCAwLjg5LCAxXTtcbiAgfSBlbHNlIHtcbiAgICBsaW5lTGVuZ3RoID0gbGluZUxlbmd0aCB8fCAxMTU7XG4gICAgcG9zaXRpb25zID0gcG9zaXRpb25zIHx8IFswLjI0LCAwLjQ4LCAwLjcwLCAwLjgwLCAxXTtcbiAgICAvLyBIZWFkZXIgbmFtZXMgZm9yIGRpZmZlcmVudCBsb2cgZWxlbWVudHMuXG4gIH1cblxuICBpZiAocG9zaXRpb25zW3Bvc2l0aW9ucy5sZW5ndGggLSAxXSA8PSAxKSB7XG4gICAgLy8gYHBvc2l0aW9uc2AgaXMgcmVsYXRpdmUuIENvbnZlcnQgaXQgdG8gYWJzb2x1dGUgcG9zaXRpb25pbmcuXG4gICAgcG9zaXRpb25zID0gcG9zaXRpb25zLm1hcChwID0+IE1hdGguZmxvb3IobGluZUxlbmd0aCAqIHApKTtcbiAgfVxuXG4gIGxldCByZWxldmFudE5vZGVzOiBOb2RlW107XG4gIGlmICghc2VxdWVudGlhbExpa2UpIHtcbiAgICB0b0Rpc3BsYXkucHVzaCgnUmVjZWl2ZXMgaW5wdXRzJyk7XG4gICAgcmVsZXZhbnROb2RlcyA9IFtdO1xuICAgIGZvciAoY29uc3QgZGVwdGggaW4gbW9kZWwubm9kZXNCeURlcHRoKSB7XG4gICAgICByZWxldmFudE5vZGVzLnB1c2goLi4ubW9kZWwubm9kZXNCeURlcHRoW2RlcHRoXSk7XG4gICAgfVxuICB9XG5cbiAgcHJpbnRGbignXycucmVwZWF0KGxpbmVMZW5ndGgpKTtcbiAgcHJpbnRSb3codG9EaXNwbGF5LCBwb3NpdGlvbnMsIHByaW50Rm4pO1xuICBwcmludEZuKCc9Jy5yZXBlYXQobGluZUxlbmd0aCkpO1xuXG4gIGNvbnN0IGxheWVycyA9IG1vZGVsLmxheWVycztcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsYXllcnMubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoc2VxdWVudGlhbExpa2UpIHtcbiAgICAgIHByaW50TGF5ZXJTdW1tYXJ5KGxheWVyc1tpXSwgcG9zaXRpb25zLCBwcmludEZuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJpbnRMYXllclN1bW1hcnlXaXRoQ29ubmVjdGlvbnMoXG4gICAgICAgICAgbGF5ZXJzW2ldLCBwb3NpdGlvbnMsIHJlbGV2YW50Tm9kZXMsIHByaW50Rm4pO1xuICAgIH1cbiAgICBwcmludEZuKChpID09PSBsYXllcnMubGVuZ3RoIC0gMSA/ICc9JyA6ICdfJykucmVwZWF0KGxpbmVMZW5ndGgpKTtcbiAgfVxuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgKG1vZGVsIGFzIGFueSkuY2hlY2tUcmFpbmFibGVXZWlnaHRzQ29uc2lzdGVuY3koKTtcblxuICBjb25zdCB0cmFpbmFibGVDb3VudCA9IGNvdW50VHJhaW5hYmxlUGFyYW1zKG1vZGVsKTtcbiAgY29uc3Qgbm9uVHJhaW5hYmxlQ291bnQgPSBjb3VudFBhcmFtc0luV2VpZ2h0cyhtb2RlbC5ub25UcmFpbmFibGVXZWlnaHRzKTtcblxuICBwcmludEZuKGBUb3RhbCBwYXJhbXM6ICR7dHJhaW5hYmxlQ291bnQgKyBub25UcmFpbmFibGVDb3VudH1gKTtcbiAgcHJpbnRGbihgVHJhaW5hYmxlIHBhcmFtczogJHt0cmFpbmFibGVDb3VudH1gKTtcbiAgcHJpbnRGbihgTm9uLXRyYWluYWJsZSBwYXJhbXM6ICR7bm9uVHJhaW5hYmxlQ291bnR9YCk7XG4gIHByaW50Rm4oJ18nLnJlcGVhdChsaW5lTGVuZ3RoKSk7XG59XG5cbmZ1bmN0aW9uIGNvdW50VHJhaW5hYmxlUGFyYW1zKG1vZGVsOiBDb250YWluZXIpOiBudW1iZXIge1xuICBsZXQgdHJhaW5hYmxlQ291bnQ6IG51bWJlcjtcbiAgLy8gdHNsaW50OmRpc2FibGU6bm8tYW55XG4gIGlmICgobW9kZWwgYXMgYW55KS5jb2xsZWN0ZWRUcmFpbmFibGVXZWlnaHRzICE9IG51bGwpIHtcbiAgICB0cmFpbmFibGVDb3VudCA9XG4gICAgICAgIGNvdW50UGFyYW1zSW5XZWlnaHRzKChtb2RlbCBhcyBhbnkpLmNvbGxlY3RlZFRyYWluYWJsZVdlaWdodHMpO1xuICB9IGVsc2Uge1xuICAgIHRyYWluYWJsZUNvdW50ID0gY291bnRQYXJhbXNJbldlaWdodHMobW9kZWwudHJhaW5hYmxlV2VpZ2h0cyk7XG4gIH1cbiAgLy8gdHNsaW50OmVuYWJsZTpuby1hbnlcbiAgcmV0dXJuIHRyYWluYWJsZUNvdW50O1xufVxuXG5mdW5jdGlvbiBpc01vZGVsU2VxdWVudGlhbExpa2UobW9kZWw6IENvbnRhaW5lcik6IGJvb2xlYW4ge1xuICBsZXQgc2VxdWVudGlhbExpa2UgPSB0cnVlO1xuICBjb25zdCBub2Rlc0J5RGVwdGg6IE5vZGVbXVtdID0gW107XG4gIGNvbnN0IG5vZGVzOiBOb2RlW10gPSBbXTtcbiAgZm9yIChjb25zdCBkZXB0aCBpbiBtb2RlbC5ub2Rlc0J5RGVwdGgpIHtcbiAgICBub2Rlc0J5RGVwdGgucHVzaChtb2RlbC5ub2Rlc0J5RGVwdGhbZGVwdGhdKTtcbiAgfVxuICBmb3IgKGNvbnN0IGRlcHRoTm9kZXMgb2Ygbm9kZXNCeURlcHRoKSB7XG4gICAgaWYgKGRlcHRoTm9kZXMubGVuZ3RoID4gMSB8fFxuICAgICAgICBkZXB0aE5vZGVzLmxlbmd0aCA9PT0gMSAmJiBkZXB0aE5vZGVzWzBdLmluYm91bmRMYXllcnMubGVuZ3RoID4gMSkge1xuICAgICAgc2VxdWVudGlhbExpa2UgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBub2Rlcy5wdXNoKC4uLmRlcHRoTm9kZXMpO1xuICB9XG4gIGlmIChzZXF1ZW50aWFsTGlrZSkge1xuICAgIC8vIFNlYXJjaCBmb3Igc2hhcmVkIGxheWVycy5cbiAgICBmb3IgKGNvbnN0IGxheWVyIG9mIG1vZGVsLmxheWVycykge1xuICAgICAgbGV0IGZsYWcgPSBmYWxzZTtcbiAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBsYXllci5pbmJvdW5kTm9kZXMpIHtcbiAgICAgICAgaWYgKG5vZGVzLmluZGV4T2Yobm9kZSkgIT09IC0xKSB7XG4gICAgICAgICAgaWYgKGZsYWcpIHtcbiAgICAgICAgICAgIHNlcXVlbnRpYWxMaWtlID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmxhZyA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIXNlcXVlbnRpYWxMaWtlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gc2VxdWVudGlhbExpa2U7XG59XG5cbmZ1bmN0aW9uIHByaW50Um93KFxuICAgIGZpZWxkczogc3RyaW5nW10sIHBvc2l0aW9uczogbnVtYmVyW10sXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgIHByaW50Rm46IChtZXNzYWdlPzogYW55LCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pID0+IHZvaWQgPSBjb25zb2xlLmxvZykge1xuICBsZXQgbGluZSA9ICcnO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGZpZWxkcy5sZW5ndGg7ICsraSkge1xuICAgIGlmIChpID4gMCkge1xuICAgICAgbGluZSA9IGxpbmUuc2xpY2UoMCwgbGluZS5sZW5ndGggLSAxKSArICcgJztcbiAgICB9XG4gICAgbGluZSArPSBmaWVsZHNbaV07XG4gICAgbGluZSA9IGxpbmUuc2xpY2UoMCwgcG9zaXRpb25zW2ldKTtcbiAgICBsaW5lICs9ICcgJy5yZXBlYXQocG9zaXRpb25zW2ldIC0gbGluZS5sZW5ndGgpO1xuICB9XG4gIHByaW50Rm4obGluZSk7XG59XG5cbi8qKlxuICogUHJpbnRzIGEgc3VtbWFyeSBmb3IgYSBzaW5nbGUgTGF5ZXIsIHdpdGhvdXQgY29ubmVjdGl2aXR5IGluZm9ybWF0aW9uLlxuICpcbiAqIEBwYXJhbSBsYXllcjogTGF5ZXIgaW5zdGFuY2UgdG8gcHJpbnQuXG4gKi9cbmZ1bmN0aW9uIHByaW50TGF5ZXJTdW1tYXJ5KFxuICAgIGxheWVyOiBMYXllciwgcG9zaXRpb25zOiBudW1iZXJbXSxcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgcHJpbnRGbjogKG1lc3NhZ2U/OiBhbnksIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSkgPT4gdm9pZCkge1xuICBsZXQgb3V0cHV0U2hhcGU6IHN0cmluZztcbiAgbGV0IGlucHV0U2hhcGU6IHN0cmluZztcblxuICB0cnkge1xuICAgIGlucHV0U2hhcGUgPSAobGF5ZXIuaW5ib3VuZE5vZGVzLm1hcChcbiAgICAgIHggPT4gSlNPTi5zdHJpbmdpZnkoeC5pbnB1dFNoYXBlcylcbiAgICApKS5qb2luKCcsJyk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlucHV0U2hhcGUgPSAnbXVsdGlwbGUnO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBvdXRwdXRTaGFwZSA9IEpTT04uc3RyaW5naWZ5KGxheWVyLm91dHB1dFNoYXBlKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgb3V0cHV0U2hhcGUgPSAnbXVsdGlwbGUnO1xuICB9XG5cbiAgY29uc3QgbmFtZSA9IGxheWVyLm5hbWU7XG4gIGNvbnN0IGNsYXNzTmFtZSA9IGxheWVyLmdldENsYXNzTmFtZSgpO1xuICBjb25zdCBmaWVsZHM6IHN0cmluZ1tdID1cbiAgICAgIFtgJHtuYW1lfSAoJHtjbGFzc05hbWV9KWAsIGlucHV0U2hhcGUsXG4gICAgICBvdXRwdXRTaGFwZSwgbGF5ZXIuY291bnRQYXJhbXMoKS50b1N0cmluZygpXTtcbiAgcHJpbnRSb3coZmllbGRzLCBwb3NpdGlvbnMsIHByaW50Rm4pO1xufVxuXG4vKipcbiAqIFByaW50cyBhIHN1bW1hcnkgZm9yIGEgc2luZ2xlIExheWVyLCB3aXRoIGNvbm5lY3Rpdml0eSBpbmZvcm1hdGlvbi5cbiAqL1xuZnVuY3Rpb24gcHJpbnRMYXllclN1bW1hcnlXaXRoQ29ubmVjdGlvbnMoXG4gICAgbGF5ZXI6IExheWVyLCBwb3NpdGlvbnM6IG51bWJlcltdLCByZWxldmFudE5vZGVzOiBOb2RlW10sXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgIHByaW50Rm46IChtZXNzYWdlPzogYW55LCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pID0+IHZvaWQpIHtcbiAgbGV0IG91dHB1dFNoYXBlOiBzdHJpbmc7XG4gIGxldCBpbnB1dFNoYXBlOiBzdHJpbmc7XG5cbiAgdHJ5IHtcbiAgICBpbnB1dFNoYXBlID0gKGxheWVyLmluYm91bmROb2Rlcy5tYXAoXG4gICAgICB4ID0+IEpTT04uc3RyaW5naWZ5KHguaW5wdXRTaGFwZXMpXG4gICAgKSkuam9pbignLCcpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpbnB1dFNoYXBlID0gJ211bHRpcGxlJztcbiAgfVxuXG4gIHRyeSB7XG4gICAgb3V0cHV0U2hhcGUgPSBKU09OLnN0cmluZ2lmeShsYXllci5vdXRwdXRTaGFwZSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIG91dHB1dFNoYXBlID0gJ211bHRpcGxlJztcbiAgfVxuXG4gIGNvbnN0IGNvbm5lY3Rpb25zOiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IG5vZGUgb2YgbGF5ZXIuaW5ib3VuZE5vZGVzKSB7XG4gICAgaWYgKHJlbGV2YW50Tm9kZXMgIT0gbnVsbCAmJiByZWxldmFudE5vZGVzLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgcmVsZXZhbnROb2Rlcy5pbmRleE9mKG5vZGUpID09PSAtMSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5pbmJvdW5kTGF5ZXJzLmxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCBpbmJvdW5kTGF5ZXIgPSBub2RlLmluYm91bmRMYXllcnNbaV0ubmFtZTtcbiAgICAgIGNvbnN0IGluYm91bmRMYXllckluZGV4ID0gbm9kZS5ub2RlSW5kaWNlc1tpXTtcbiAgICAgIGNvbnN0IGluYm91bmRUZW5zb3JJbmRleCA9IG5vZGUudGVuc29ySW5kaWNlc1tpXTtcbiAgICAgIGNvbm5lY3Rpb25zLnB1c2goXG4gICAgICAgICAgYCR7aW5ib3VuZExheWVyfVske2luYm91bmRMYXllckluZGV4fV1bJHtpbmJvdW5kVGVuc29ySW5kZXh9XWApO1xuICAgIH1cbiAgfVxuICBjb25zdCBuYW1lID0gbGF5ZXIubmFtZTtcbiAgY29uc3QgY2xhc3NOYW1lID0gbGF5ZXIuZ2V0Q2xhc3NOYW1lKCk7XG4gIGNvbnN0IGZpcnN0Q29ubmVjdGlvbiA9IGNvbm5lY3Rpb25zLmxlbmd0aCA9PT0gMCA/ICcnIDogY29ubmVjdGlvbnNbMF07XG4gIGNvbnN0IGZpZWxkczogc3RyaW5nW10gPSBbXG4gICAgYCR7bmFtZX0gKCR7Y2xhc3NOYW1lfSlgLCBpbnB1dFNoYXBlLFxuICAgIG91dHB1dFNoYXBlLCBsYXllci5jb3VudFBhcmFtcygpLnRvU3RyaW5nKCksXG4gICAgZmlyc3RDb25uZWN0aW9uXG4gIF07XG5cbiAgcHJpbnRSb3coZmllbGRzLCBwb3NpdGlvbnMsIHByaW50Rm4pO1xuICBmb3IgKGxldCBpID0gMTsgaSA8IGNvbm5lY3Rpb25zLmxlbmd0aDsgKytpKSB7XG4gICAgcHJpbnRSb3coWycnLCAnJywgJycsICcnLCBjb25uZWN0aW9uc1tpXV0sIHBvc2l0aW9ucywgcHJpbnRGbik7XG4gIH1cbn1cbiJdfQ==