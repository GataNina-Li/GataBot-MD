/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
import * as util from './util';
/**
 * Computes a list of TapeNodes that connect x to y, filtering everything else
 * out and preserving the order of the original tape elements.
 *
 * @param tape The tape elements to filter.
 * @param xs The input Tensors.
 * @param y The output Tensor.
 */
export function getFilteredNodesXToY(tape, xs, y) {
    // Forward pass to compute all the nodes and Tensors that are transitively a
    // function of x.
    const tensorsFromX = {};
    const nodesFromX = {};
    for (let i = 0; i < xs.length; i++) {
        tensorsFromX[xs[i].id] = true;
    }
    for (let i = 0; i < tape.length; i++) {
        const node = tape[i];
        const nodeInputs = node.inputs;
        for (const inputName in nodeInputs) {
            const input = nodeInputs[inputName];
            let anyInputFromX = false;
            for (let j = 0; j < xs.length; j++) {
                if (tensorsFromX[input.id]) {
                    node.outputs.forEach(output => tensorsFromX[output.id] = true);
                    anyInputFromX = true;
                    nodesFromX[node.id] = true;
                    break;
                }
            }
            if (anyInputFromX) {
                break;
            }
        }
    }
    // Backward pass to find all of the nodes and Tensors that lead to y.
    const tensorsLeadToY = {};
    tensorsLeadToY[y.id] = true;
    const nodesToY = {};
    for (let i = tape.length - 1; i >= 0; i--) {
        const node = tape[i];
        const nodeInputs = node.inputs;
        // If any of the outputs lead to y, mark all of the inputs as leading to y.
        for (let j = 0; j < node.outputs.length; j++) {
            if (tensorsLeadToY[node.outputs[j].id]) {
                for (const inputName in nodeInputs) {
                    tensorsLeadToY[nodeInputs[inputName].id] = true;
                    nodesToY[node.id] = true;
                }
                break;
            }
        }
    }
    // Return the paths that come from x and lead to y.
    const filteredTape = [];
    for (let i = 0; i < tape.length; i++) {
        const node = tape[i];
        if (nodesFromX[node.id] && nodesToY[node.id]) {
            // Prune the inputs from the node that aren't a function of x.
            const prunedInputs = {};
            for (const inputName in node.inputs) {
                const nodeInput = node.inputs[inputName];
                if (tensorsFromX[nodeInput.id]) {
                    prunedInputs[inputName] = nodeInput;
                }
            }
            // Copy the node and overwrite inputsAndArgs to the pruned version.
            const prunedNode = Object.assign({}, node);
            prunedNode.inputs = prunedInputs;
            prunedNode.outputs = node.outputs;
            filteredTape.push(prunedNode);
        }
    }
    return filteredTape;
}
/**
 * Backpropagate gradients through the filtered TapeNodes.
 *
 * @param tensorAccumulatedGradientMap A map of Tensor to its gradient. This map
 * is mutated by this method.
 * @param filteredTape The filtered TapeNodes to backprop through.
 */
export function backpropagateGradients(tensorAccumulatedGradientMap, filteredTape, tidy, add) {
    // Walk the tape backward and keep a map of Tensor to its gradient.
    for (let i = filteredTape.length - 1; i >= 0; i--) {
        const node = filteredTape[i];
        const dys = [];
        node.outputs.forEach(o => {
            const gradTensor = tensorAccumulatedGradientMap[o.id];
            if (gradTensor != null) {
                dys.push(gradTensor);
            }
            else {
                // This particular output is not in the back-propagation subgraph, so it
                // does not affect the final output, thus we put null for its dy.
                dys.push(null);
            }
        });
        if (node.gradient == null) {
            throw new Error(`Cannot compute gradient: gradient function not found ` +
                `for ${node.kernelName}.`);
        }
        // Backprop dy through this node and accumulate gradients over the inputs.
        const inputGradients = node.gradient(dys);
        for (const inputName in node.inputs) {
            if (!(inputName in inputGradients)) {
                throw new Error(`Cannot backprop through input ${inputName}. ` +
                    `Available gradients found: ${Object.keys(inputGradients)}.`);
            }
            // Call the gradient function.
            const dx = tidy(() => inputGradients[inputName]());
            if (dx.dtype !== 'float32') {
                throw new Error(`Error in gradient for op ${node.kernelName}. The gradient of input ` +
                    `${inputName} must have 'float32' dtype, but has '${dx.dtype}'`);
            }
            const x = node.inputs[inputName];
            if (!util.arraysEqual(dx.shape, x.shape)) {
                throw new Error(`Error in gradient for op ${node.kernelName}. The gradient of input ` +
                    `'${inputName}' has shape '${dx.shape}', which does not match ` +
                    `the shape of the input '${x.shape}'`);
            }
            if (tensorAccumulatedGradientMap[x.id] == null) {
                tensorAccumulatedGradientMap[x.id] = dx;
            }
            else {
                const curGradient = tensorAccumulatedGradientMap[x.id];
                tensorAccumulatedGradientMap[x.id] = add(curGradient, dx);
                curGradient.dispose();
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvdGFwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFJSCxPQUFPLEtBQUssSUFBSSxNQUFNLFFBQVEsQ0FBQztBQWdCL0I7Ozs7Ozs7R0FPRztBQUNILE1BQU0sVUFBVSxvQkFBb0IsQ0FDaEMsSUFBZ0IsRUFBRSxFQUFZLEVBQUUsQ0FBUztJQUMzQyw0RUFBNEU7SUFDNUUsaUJBQWlCO0lBQ2pCLE1BQU0sWUFBWSxHQUFrQyxFQUFFLENBQUM7SUFDdkQsTUFBTSxVQUFVLEdBQWdDLEVBQUUsQ0FBQztJQUNuRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNsQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztLQUMvQjtJQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3BDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQy9CLEtBQUssTUFBTSxTQUFTLElBQUksVUFBVSxFQUFFO1lBQ2xDLE1BQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUVwQyxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7WUFDMUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2xDLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFB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QUMsQ0FBQztZQUNuRCxJQUFJLEVBQUUsQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO2dCQUMxQixNQUFNLElBQUksS0FBSyxDQUNYLDRCQUNJLElBQUksQ0FBQyxVQUFVLDBCQUEwQjtvQkFDN0MsR0FBRyxTQUFTLHdDQUF3QyxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQzthQUN0RTtZQUNELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3hDLE1BQU0sSUFBSSxLQUFLLENBQ1gsNEJBQ0ksSUFBSSxDQUFDLFVBQVUsMEJBQTBCO29CQUM3QyxJQUFJLFNBQVMsZ0JBQWdCLEVBQUUsQ0FBQyxLQUFLLDBCQUEwQjtvQkFDL0QsMkJBQTJCLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2FBQzVDO1lBRUQsSUFBSSw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxFQUFFO2dCQUM5Qyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO2FBQ3pDO2lCQUFNO2dCQUNMLE1BQU0sV0FBVyxHQUFHLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDdkQsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzFELFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUN2QjtTQUNGO0tBQ0Y7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRhcGVOb2RlIHtcbiAgaWQ6IG51bWJlcjtcbiAga2VybmVsTmFtZTogc3RyaW5nO1xuICBvdXRwdXRzOiBUZW5zb3JbXTtcbiAgaW5wdXRzOiBOYW1lZFRlbnNvck1hcDtcbiAgLy8gT3B0aW9uYWwgcGFyYW1zLCBkZWZpbmVkIG9ubHkgZm9yIG9wcyB3aXRoIGdyYWRpZW50IGltcGwuXG4gIGdyYWRpZW50PzogKGR5czogVGVuc29yW10pID0+IE5hbWVkR3JhZGllbnRNYXA7XG4gIHNhdmVkPzogVGVuc29yW107XG59XG5cbmV4cG9ydCB0eXBlIE5hbWVkR3JhZGllbnRNYXAgPSB7XG4gIFtpbnB1dE5hbWU6IHN0cmluZ106ICgpID0+IFRlbnNvcjtcbn07XG5cbi8qKlxuICogQ29tcHV0ZXMgYSBsaXN0IG9mIFRhcGVOb2RlcyB0aGF0IGNvbm5lY3QgeCB0byB5LCBmaWx0ZXJpbmcgZXZlcnl0aGluZyBlbHNlXG4gKiBvdXQgYW5kIHByZXNlcnZpbmcgdGhlIG9yZGVyIG9mIHRoZSBvcmlnaW5hbCB0YXBlIGVsZW1lbnRzLlxuICpcbiAqIEBwYXJhbSB0YXBlIFRoZSB0YXBlIGVsZW1lbnRzIHRvIGZpbHRlci5cbiAqIEBwYXJhbSB4cyBUaGUgaW5wdXQgVGVuc29ycy5cbiAqIEBwYXJhbSB5IFRoZSBvdXRwdXQgVGVuc29yLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsdGVyZWROb2Rlc1hUb1koXG4gICAgdGFwZTogVGFwZU5vZGVbXSwgeHM6IFRlbnNvcltdLCB5OiBUZW5zb3IpOiBUYXBlTm9kZVtdIHtcbiAgLy8gRm9yd2FyZCBwYXNzIHRvIGNvbXB1dGUgYWxsIHRoZSBub2RlcyBhbmQgVGVuc29ycyB0aGF0IGFyZSB0cmFuc2l0aXZlbHkgYVxuICAvLyBmdW5jdGlvbiBvZiB4LlxuICBjb25zdCB0ZW5zb3JzRnJvbVg6IHtbdGVuc29ySWQ6IG51bWJlcl06IGJvb2xlYW59ID0ge307XG4gIGNvbnN0IG5vZGVzRnJvbVg6IHtbbm9kZUlkOiBudW1iZXJdOiBib29sZWFufSA9IHt9O1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgdGVuc29yc0Zyb21YW3hzW2ldLmlkXSA9IHRydWU7XG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRhcGUubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBub2RlID0gdGFwZVtpXTtcbiAgICBjb25zdCBub2RlSW5wdXRzID0gbm9kZS5pbnB1dHM7XG4gICAgZm9yIChjb25zdCBpbnB1dE5hbWUgaW4gbm9kZUlucHV0cykge1xuICAgICAgY29uc3QgaW5wdXQgPSBub2RlSW5wdXRzW2lucHV0TmFtZV07XG5cbiAgICAgIGxldCBhbnlJbnB1dEZyb21YID0gZmFsc2U7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHhzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmICh0ZW5zb3JzRnJvbVhbaW5wdXQuaWRdKSB7XG4gICAgICAgICAgbm9kZS5vdXRwdXRzLmZvckVhY2gob3V0cHV0ID0+IHRlbnNvcnNGcm9tWFtvdXRwdXQuaWRdID0gdHJ1ZSk7XG4gICAgICAgICAgYW55SW5wdXRGcm9tWCA9IHRydWU7XG4gICAgICAgICAgbm9kZXNGcm9tWFtub2RlLmlkXSA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGFueUlucHV0RnJvbVgpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQmFja3dhcmQgcGFzcyB0byBmaW5kIGFsbCBvZiB0aGUgbm9kZXMgYW5kIFRlbnNvcnMgdGhhdCBsZWFkIHRvIHkuXG4gIGNvbnN0IHRlbnNvcnNMZWFkVG9ZOiB7W3RlbnNvcklkOiBudW1iZXJdOiBib29sZWFufSA9IHt9O1xuICB0ZW5zb3JzTGVhZFRvWVt5LmlkXSA9IHRydWU7XG4gIGNvbnN0IG5vZGVzVG9ZOiB7W25vZGVJZDogbnVtYmVyXTogYm9vbGVhbn0gPSB7fTtcblxuICBmb3IgKGxldCBpID0gdGFwZS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGNvbnN0IG5vZGUgPSB0YXBlW2ldO1xuICAgIGNvbnN0IG5vZGVJbnB1dHMgPSBub2RlLmlucHV0cztcblxuICAgIC8vIElmIGFueSBvZiB0aGUgb3V0cHV0cyBsZWFkIHRvIHksIG1hcmsgYWxsIG9mIHRoZSBpbnB1dHMgYXMgbGVhZGluZyB0byB5LlxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbm9kZS5vdXRwdXRzLmxlbmd0aDsgaisrKSB7XG4gICAgICBpZiAodGVuc29yc0xlYWRUb1lbbm9kZS5vdXRwdXRzW2pdLmlkXSkge1xuICAgICAgICBmb3IgKGNvbnN0IGlucHV0TmFtZSBpbiBub2RlSW5wdXRzKSB7XG4gICAgICAgICAgdGVuc29yc0xlYWRUb1lbbm9kZUlucHV0c1tpbnB1dE5hbWVdLmlkXSA9IHRydWU7XG4gICAgICAgICAgbm9kZXNUb1lbbm9kZS5pZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFJldHVybiB0aGUgcGF0aHMgdGhhdCBjb21lIGZyb20geCBhbmQgbGVhZCB0byB5LlxuICBjb25zdCBmaWx0ZXJlZFRhcGU6IFRhcGVOb2RlW10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXBlLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgbm9kZSA9IHRhcGVbaV07XG5cbiAgICBpZiAobm9kZXNGcm9tWFtub2RlLmlkXSAmJiBub2Rlc1RvWVtub2RlLmlkXSkge1xuICAgICAgLy8gUHJ1bmUgdGhlIGlucHV0cyBmcm9tIHRoZSBub2RlIHRoYXQgYXJlbid0IGEgZnVuY3Rpb24gb2YgeC5cbiAgICAgIGNvbnN0IHBydW5lZElucHV0czoge1tpbnB1dE5hbWU6IHN0cmluZ106IFRlbnNvcn0gPSB7fTtcbiAgICAgIGZvciAoY29uc3QgaW5wdXROYW1lIGluIG5vZGUuaW5wdXRzKSB7XG4gICAgICAgIGNvbnN0IG5vZGVJbnB1dCA9IG5vZGUuaW5wdXRzW2lucHV0TmFtZV07XG4gICAgICAgIGlmICh0ZW5zb3JzRnJvbVhbbm9kZUlucHV0LmlkXSkge1xuICAgICAgICAgIHBydW5lZElucHV0c1tpbnB1dE5hbWVdID0gbm9kZUlucHV0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIENvcHkgdGhlIG5vZGUgYW5kIG92ZXJ3cml0ZSBpbnB1dHNBbmRBcmdzIHRvIHRoZSBwcnVuZWQgdmVyc2lvbi5cbiAgICAgIGNvbnN0IHBydW5lZE5vZGUgPSBPYmplY3QuYXNzaWduKHt9LCBub2RlKTtcbiAgICAgIHBydW5lZE5vZGUuaW5wdXRzID0gcHJ1bmVkSW5wdXRzO1xuICAgICAgcHJ1bmVkTm9kZS5vdXRwdXRzID0gbm9kZS5vdXRwdXRzO1xuXG4gICAgICBmaWx0ZXJlZFRhcGUucHVzaChwcnVuZWROb2RlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmlsdGVyZWRUYXBlO1xufVxuXG4vKipcbiAqIEJhY2twcm9wYWdhdGUgZ3JhZGllbnRzIHRocm91Z2ggdGhlIGZpbHRlcmVkIFRhcGVOb2Rlcy5cbiAqXG4gKiBAcGFyYW0gdGVuc29yQWNjdW11bGF0ZWRHcmFkaWVudE1hcCBBIG1hcCBvZiBUZW5zb3IgdG8gaXRzIGdyYWRpZW50LiBUaGlzIG1hcFxuICogaXMgbXV0YXRlZCBieSB0aGlzIG1ldGhvZC5cbiAqIEBwYXJhbSBmaWx0ZXJlZFRhcGUgVGhlIGZpbHRlcmVkIFRhcGVOb2RlcyB0byBiYWNrcHJvcCB0aHJvdWdoLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYmFja3Byb3BhZ2F0ZUdyYWRpZW50cyhcbiAgICB0ZW5zb3JBY2N1bXVsYXRlZEdyYWRpZW50TWFwOiB7W3RlbnNvcklkOiBudW1iZXJdOiBUZW5zb3J9LFxuICAgIGZpbHRlcmVkVGFwZTogVGFwZU5vZGVbXSwgdGlkeTogKGY6IEZ1bmN0aW9uKSA9PiBUZW5zb3IsXG4gICAgYWRkOiAoYTogVGVuc29yLCBiOiBUZW5zb3IpID0+IFRlbnNvcikge1xuICAvLyBXYWxrIHRoZSB0YXBlIGJhY2t3YXJkIGFuZCBrZWVwIGEgbWFwIG9mIFRlbnNvciB0byBpdHMgZ3JhZGllbnQuXG4gIGZvciAobGV0IGkgPSBmaWx0ZXJlZFRhcGUubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBjb25zdCBub2RlID0gZmlsdGVyZWRUYXBlW2ldO1xuXG4gICAgY29uc3QgZHlzOiBUZW5zb3JbXSA9IFtdO1xuICAgIG5vZGUub3V0cHV0cy5mb3JFYWNoKG8gPT4ge1xuICAgICAgY29uc3QgZ3JhZFRlbnNvciA9IHRlbnNvckFjY3VtdWxhdGVkR3JhZGllbnRNYXBbby5pZF07XG4gICAgICBpZiAoZ3JhZFRlbnNvciAhPSBudWxsKSB7XG4gICAgICAgIGR5cy5wdXNoKGdyYWRUZW5zb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVGhpcyBwYXJ0aWN1bGFyIG91dHB1dCBpcyBub3QgaW4gdGhlIGJhY2stcHJvcGFnYXRpb24gc3ViZ3JhcGgsIHNvIGl0XG4gICAgICAgIC8vIGRvZXMgbm90IGFmZmVjdCB0aGUgZmluYWwgb3V0cHV0LCB0aHVzIHdlIHB1dCBudWxsIGZvciBpdHMgZHkuXG4gICAgICAgIGR5cy5wdXNoKG51bGwpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKG5vZGUuZ3JhZGllbnQgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBDYW5ub3QgY29tcHV0ZSBncmFkaWVudDogZ3JhZGllbnQgZnVuY3Rpb24gbm90IGZvdW5kIGAgK1xuICAgICAgICAgIGBmb3IgJHtub2RlLmtlcm5lbE5hbWV9LmApO1xuICAgIH1cblxuICAgIC8vIEJhY2twcm9wIGR5IHRocm91Z2ggdGhpcyBub2RlIGFuZCBhY2N1bXVsYXRlIGdyYWRpZW50cyBvdmVyIHRoZSBpbnB1dHMuXG4gICAgY29uc3QgaW5wdXRHcmFkaWVudHMgPSBub2RlLmdyYWRpZW50KGR5cyk7XG5cbiAgICBmb3IgKGNvbnN0IGlucHV0TmFtZSBpbiBub2RlLmlucHV0cykge1xuICAgICAgaWYgKCEoaW5wdXROYW1lIGluIGlucHV0R3JhZGllbnRzKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgQ2Fubm90IGJhY2twcm9wIHRocm91Z2ggaW5wdXQgJHtpbnB1dE5hbWV9LiBgICtcbiAgICAgICAgICAgIGBBdmFpbGFibGUgZ3JhZGllbnRzIGZvdW5kOiAke09iamVjdC5rZXlzKGlucHV0R3JhZGllbnRzKX0uYCk7XG4gICAgICB9XG5cbiAgICAgIC8vIENhbGwgdGhlIGdyYWRpZW50IGZ1bmN0aW9uLlxuICAgICAgY29uc3QgZHggPSB0aWR5KCgpID0+IGlucHV0R3JhZGllbnRzW2lucHV0TmFtZV0oKSk7XG4gICAgICBpZiAoZHguZHR5cGUgIT09ICdmbG9hdDMyJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgRXJyb3IgaW4gZ3JhZGllbnQgZm9yIG9wICR7XG4gICAgICAgICAgICAgICAgbm9kZS5rZXJuZWxOYW1lfS4gVGhlIGdyYWRpZW50IG9mIGlucHV0IGAgK1xuICAgICAgICAgICAgYCR7aW5wdXROYW1lfSBtdXN0IGhhdmUgJ2Zsb2F0MzInIGR0eXBlLCBidXQgaGFzICcke2R4LmR0eXBlfSdgKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHggPSBub2RlLmlucHV0c1tpbnB1dE5hbWVdO1xuICAgICAgaWYgKCF1dGlsLmFycmF5c0VxdWFsKGR4LnNoYXBlLCB4LnNoYXBlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgRXJyb3IgaW4gZ3JhZGllbnQgZm9yIG9wICR7XG4gICAgICAgICAgICAgICAgbm9kZS5rZXJuZWxOYW1lfS4gVGhlIGdyYWRpZW50IG9mIGlucHV0IGAgK1xuICAgICAgICAgICAgYCcke2lucHV0TmFtZX0nIGhhcyBzaGFwZSAnJHtkeC5zaGFwZX0nLCB3aGljaCBkb2VzIG5vdCBtYXRjaCBgICtcbiAgICAgICAgICAgIGB0aGUgc2hhcGUgb2YgdGhlIGlucHV0ICcke3guc2hhcGV9J2ApO1xuICAgICAgfVxuXG4gICAgICBpZiAodGVuc29yQWNjdW11bGF0ZWRHcmFkaWVudE1hcFt4LmlkXSA9PSBudWxsKSB7XG4gICAgICAgIHRlbnNvckFjY3VtdWxhdGVkR3JhZGllbnRNYXBbeC5pZF0gPSBkeDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGN1ckdyYWRpZW50ID0gdGVuc29yQWNjdW11bGF0ZWRHcmFkaWVudE1hcFt4LmlkXTtcbiAgICAgICAgdGVuc29yQWNjdW11bGF0ZWRHcmFkaWVudE1hcFt4LmlkXSA9IGFkZChjdXJHcmFkaWVudCwgZHgpO1xuICAgICAgICBjdXJHcmFkaWVudC5kaXNwb3NlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=