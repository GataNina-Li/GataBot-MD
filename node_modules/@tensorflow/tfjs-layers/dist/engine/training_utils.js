/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
import { argMax, clone, dispose, mul, reshape, tensor1d, tidy } from '@tensorflow/tfjs-core';
function standardizeSampleOrClassWeights(xWeight, outputNames, weightType) {
    const numOutputs = outputNames.length;
    if (xWeight == null || (Array.isArray(xWeight) && xWeight.length === 0)) {
        return outputNames.map(name => null);
    }
    if (numOutputs === 1) {
        if (Array.isArray(xWeight) && xWeight.length === 1) {
            return xWeight;
        }
        else if (typeof xWeight === 'object' && outputNames[0] in xWeight) {
            return [xWeight[outputNames[0]]];
        }
        else {
            return [xWeight];
        }
    }
    if (Array.isArray(xWeight)) {
        if (xWeight.length !== numOutputs) {
            throw new Error(`Provided ${weightType} is an array of ${xWeight.length} ` +
                `element(s), but the model has ${numOutputs} outputs. ` +
                `Make sure a set of weights is provided for each model output.`);
        }
        return xWeight;
    }
    else if (typeof xWeight === 'object' && Object.keys(xWeight).length > 0 &&
        typeof xWeight[Object.keys(xWeight)[0]] ===
            'object') {
        const output = [];
        outputNames.forEach(outputName => {
            if (outputName in xWeight) {
                output.push(xWeight[outputName]);
            }
            else {
                output.push(null);
            }
        });
        return output;
    }
    else {
        throw new Error(`The model has multiple (${numOutputs}) outputs, ` +
            `so ${weightType} must be either an array with ` +
            `${numOutputs} elements or an object with ${outputNames} keys. ` +
            `Provided ${weightType} not understood: ${JSON.stringify(xWeight)}`);
    }
}
/**
 * Standardize class weighting objects.
 *
 * This function takes a single class-weighting object, an array of them,
 * or a map from output name to class-weighting object. It compares it to the
 * output name(s) of the model, base on which it outputs an array of
 * class-weighting objects of which the length matches the number of outputs.
 *
 * @param classWeight Input class-weighting object(s).
 * @param outputNames All output name(s) of the model.
 * @return An array of class-weighting objects. The length of the array matches
 *   the model's number of outputs.
 */
export function standardizeClassWeights(classWeight, outputNames) {
    return standardizeSampleOrClassWeights(classWeight, outputNames, 'classWeight');
}
export function standardizeSampleWeights(classWeight, outputNames) {
    return standardizeSampleOrClassWeights(classWeight, outputNames, 'sampleWeight');
}
/**
 * Standardize by-sample and/or by-class weights for training.
 *
 * Note that this function operates on one model output at a time. For a model
 * with multiple outputs, you must call this function multiple times.
 *
 * @param y The target tensor that the by-sample and/or by-class weight is for.
 *     The values of y are assumed to encode the classes, either directly
 *     as an integer index, or as one-hot encoding.
 * @param sampleWeight By-sample weights.
 * @param classWeight By-class weights: an object mapping class indices
 *     (integers) to a weight (float) to apply to the model's loss for the
 *     samples from this class during training. This can be useful to tell the
 *     model to "pay more attention" to samples from an under-represented class.
 * @param sampleWeightMode The mode for the sample weights.
 * @return A Promise of weight tensor, of which the size of the first dimension
 *     matches that of `y`.
 */
export async function standardizeWeights(y, sampleWeight, classWeight, sampleWeightMode) {
    if (sampleWeight != null || sampleWeightMode != null) {
        // TODO(cais): Once 'temporal' mode is implemented, document it in the doc
        // string.
        throw new Error('Support sampleWeight is not implemented yet');
    }
    if (classWeight != null) {
        // Apply class weights per sample.
        const yClasses = tidy(() => {
            if (y.shape.length === 1) {
                // Assume class indices.
                return clone(y);
            }
            else if (y.shape.length === 2) {
                if (y.shape[1] > 1) {
                    // Assume one-hot encoding of classes.
                    const axis = 1;
                    return argMax(y, axis);
                }
                else if (y.shape[1] === 1) {
                    // Class index.
                    return reshape(y, [y.shape[0]]);
                }
                else {
                    throw new Error(`Encountered unexpected last-dimension size (${y.shape[1]}) ` +
                        `during handling of class weights. The size is expected to be ` +
                        `>= 1.`);
                }
            }
            else {
                throw new Error(`Unexpected rank of target (y) tensor (${y.rank}) during ` +
                    `handling of class weights. The rank is expected to be 1 or 2.`);
            }
        });
        const yClassIndices = Array.from(await yClasses.data());
        dispose(yClasses);
        const classSampleWeight = [];
        yClassIndices.forEach(classIndex => {
            if (classWeight[classIndex] == null) {
                throw new Error(`classWeight must contain all classes in the training data. ` +
                    `The class ${classIndex} exists in the data but not in ` +
                    `classWeight`);
            }
            else {
                classSampleWeight.push(classWeight[classIndex]);
            }
        });
        return tensor1d(classSampleWeight, 'float32');
    }
    else {
        return null;
    }
}
/**
 * Apply per-sample weights on the loss values from a number of samples.
 *
 * @param losses Loss tensor of shape `[batchSize]`.
 * @param sampleWeights Per-sample weight tensor of shape `[batchSize]`.
 * @returns Tensor of the same shape as`losses`.
 */
export function computeWeightedLoss(losses, sampleWeights) {
    return mul(losses, sampleWeights);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhaW5pbmdfdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWxheWVycy9zcmMvZW5naW5lL3RyYWluaW5nX3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztHQVFHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQW9CLFFBQVEsRUFBRSxJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQXVCN0csU0FBUywrQkFBK0IsQ0FDcEMsT0FBaUQsRUFBRSxXQUFxQixFQUN4RSxVQUF3QztJQUMxQyxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO0lBQ3RDLElBQUksT0FBTyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsRUFBRTtRQUN2RSxPQUFPLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN0QztJQUNELElBQUksVUFBVSxLQUFLLENBQUMsRUFBRTtRQUNwQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDbEQsT0FBTyxPQUFPLENBQUM7U0FDaEI7YUFBTSxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxFQUFFO1lBQ25FLE9BQU8sQ0FBRSxPQUEwQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdEQ7YUFBTTtZQUNMLE9BQU8sQ0FBQyxPQUFzQixDQUFDLENBQUM7U0FDakM7S0FDRjtJQUNELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENB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dXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAqIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICogaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7YXJnTWF4LCBjbG9uZSwgZGlzcG9zZSwgbXVsLCByZXNoYXBlLCBUZW5zb3IsIFRlbnNvcjFELCB0ZW5zb3IxZCwgdGlkeX0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuLyoqXG4gKiBGb3IgbXVsdGktY2xhc3MgY2xhc3NpZmljYXRpb24gcHJvYmxlbXMsIHRoaXMgb2JqZWN0IGlzIGRlc2lnbmVkIHRvIHN0b3JlIGFcbiAqIG1hcHBpbmcgZnJvbSBjbGFzcyBpbmRleCB0byB0aGUgXCJ3ZWlnaHRcIiBvZiB0aGUgY2xhc3MsIHdoZXJlIGhpZ2hlciB3ZWlnaHRlZFxuICogY2xhc3NlcyBoYXZlIGxhcmdlciBpbXBhY3Qgb24gbG9zcywgYWNjdXJhY3ksIGFuZCBvdGhlciBtZXRyaWNzLlxuICpcbiAqIFRoaXMgaXMgdXNlZnVsIGZvciBjYXNlcyBpbiB3aGljaCB5b3Ugd2FudCB0aGUgbW9kZWwgdG8gXCJwYXkgbW9yZSBhdHRlbnRpb25cIlxuICogdG8gZXhhbXBsZXMgZnJvbSBhbiB1bmRlci1yZXByZXNlbnRlZCBjbGFzcywgZS5nLiwgaW4gdW5iYWxhbmNlZCBkYXRhc2V0cy5cbiAqL1xuZXhwb3J0IHR5cGUgQ2xhc3NXZWlnaHQgPSB7XG4gIFtjbGFzc0luZGV4OiBudW1iZXJdOiBudW1iZXJcbn07XG5cbi8qKlxuICogQ2xhc3Mgd2VpZ2h0aW5nIGZvciBhIG1vZGVsIHdpdGggbXVsdGlwbGUgb3V0cHV0cy5cbiAqXG4gKiBUaGlzIG9iamVjdCBtYXBzIGVhY2ggb3V0cHV0IG5hbWUgdG8gYSBjbGFzcy13ZWlnaHRpbmcgb2JqZWN0LlxuICovXG5leHBvcnQgdHlwZSBDbGFzc1dlaWdodE1hcCA9IHtcbiAgW291dHB1dE5hbWU6IHN0cmluZ106IENsYXNzV2VpZ2h0XG59O1xuXG5mdW5jdGlvbiBzdGFuZGFyZGl6ZVNhbXBsZU9yQ2xhc3NXZWlnaHRzKFxuICAgIHhXZWlnaHQ6IENsYXNzV2VpZ2h0fENsYXNzV2VpZ2h0W118Q2xhc3NXZWlnaHRNYXAsIG91dHB1dE5hbWVzOiBzdHJpbmdbXSxcbiAgICB3ZWlnaHRUeXBlOiAnc2FtcGxlV2VpZ2h0J3wnY2xhc3NXZWlnaHQnKTogQ2xhc3NXZWlnaHRbXSB7XG4gIGNvbnN0IG51bU91dHB1dHMgPSBvdXRwdXROYW1lcy5sZW5ndGg7XG4gIGlmICh4V2VpZ2h0ID09IG51bGwgfHwgKEFycmF5LmlzQXJyYXkoeFdlaWdodCkgJiYgeFdlaWdodC5sZW5ndGggPT09IDApKSB7XG4gICAgcmV0dXJuIG91dHB1dE5hbWVzLm1hcChuYW1lID0+IG51bGwpO1xuICB9XG4gIGlmIChudW1PdXRwdXRzID09PSAxKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoeFdlaWdodCkgJiYgeFdlaWdodC5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiB4V2VpZ2h0O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHhXZWlnaHQgPT09ICdvYmplY3QnICYmIG91dHB1dE5hbWVzWzBdIGluIHhXZWlnaHQpIHtcbiAgICAgIHJldHVybiBbKHhXZWlnaHQgYXMgQ2xhc3NXZWlnaHRNYXApW291dHB1dE5hbWVzWzBdXV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbeFdlaWdodCBhcyBDbGFzc1dlaWdodF07XG4gICAgfVxuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KHhXZWlnaHQpKSB7XG4gICAgaWYgKHhXZWlnaHQubGVuZ3RoICE9PSBudW1PdXRwdXRzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYFByb3ZpZGVkICR7d2VpZ2h0VHlwZX0gaXMgYW4gYXJyYXkgb2YgJHt4V2VpZ2h0Lmxlbmd0aH0gYCArXG4gICAgICAgICAgYGVsZW1lbnQocyksIGJ1dCB0aGUgbW9kZWwgaGFzICR7bnVtT3V0cHV0c30gb3V0cHV0cy4gYCArXG4gICAgICAgICAgYE1ha2Ugc3VyZSBhIHNldCBvZiB3ZWlnaHRzIGlzIHByb3ZpZGVkIGZvciBlYWNoIG1vZGVsIG91dHB1dC5gKTtcbiAgICB9XG4gICAgcmV0dXJuIHhXZWlnaHQ7XG4gIH0gZWxzZSBpZiAoXG4gICAgICB0eXBlb2YgeFdlaWdodCA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LmtleXMoeFdlaWdodCkubGVuZ3RoID4gMCAmJlxuICAgICAgdHlwZW9mICh4V2VpZ2h0IGFzIENsYXNzV2VpZ2h0TWFwKVtPYmplY3Qua2V5cyh4V2VpZ2h0KVswXV0gPT09XG4gICAgICAgICAgJ29iamVjdCcpIHtcbiAgICBjb25zdCBvdXRwdXQ6IENsYXNzV2VpZ2h0W10gPSBbXTtcbiAgICBvdXRwdXROYW1lcy5mb3JFYWNoKG91dHB1dE5hbWUgPT4ge1xuICAgICAgaWYgKG91dHB1dE5hbWUgaW4geFdlaWdodCkge1xuICAgICAgICBvdXRwdXQucHVzaCgoeFdlaWdodCBhcyBDbGFzc1dlaWdodE1hcClbb3V0cHV0TmFtZV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0LnB1c2gobnVsbCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBUaGUgbW9kZWwgaGFzIG11bHRpcGxlICgke251bU91dHB1dHN9KSBvdXRwdXRzLCBgICtcbiAgICAgICAgYHNvICR7d2VpZ2h0VHlwZX0gbXVzdCBiZSBlaXRoZXIgYW4gYXJyYXkgd2l0aCBgICtcbiAgICAgICAgYCR7bnVtT3V0cHV0c30gZWxlbWVudHMgb3IgYW4gb2JqZWN0IHdpdGggJHtvdXRwdXROYW1lc30ga2V5cy4gYCArXG4gICAgICAgIGBQcm92aWRlZCAke3dlaWdodFR5cGV9IG5vdCB1bmRlcnN0b29kOiAke0pTT04uc3RyaW5naWZ5KHhXZWlnaHQpfWApO1xuICB9XG59XG5cbi8qKlxuICogU3RhbmRhcmRpemUgY2xhc3Mgd2VpZ2h0aW5nIG9iamVjdHMuXG4gKlxuICogVGhpcyBmdW5jdGlvbiB0YWtlcyBhIHNpbmdsZSBjbGFzcy13ZWlnaHRpbmcgb2JqZWN0LCBhbiBhcnJheSBvZiB0aGVtLFxuICogb3IgYSBtYXAgZnJvbSBvdXRwdXQgbmFtZSB0byBjbGFzcy13ZWlnaHRpbmcgb2JqZWN0LiBJdCBjb21wYXJlcyBpdCB0byB0aGVcbiAqIG91dHB1dCBuYW1lKHMpIG9mIHRoZSBtb2RlbCwgYmFzZSBvbiB3aGljaCBpdCBvdXRwdXRzIGFuIGFycmF5IG9mXG4gKiBjbGFzcy13ZWlnaHRpbmcgb2JqZWN0cyBvZiB3aGljaCB0aGUgbGVuZ3RoIG1hdGNoZXMgdGhlIG51bWJlciBvZiBvdXRwdXRzLlxuICpcbiAqIEBwYXJhbSBjbGFzc1dlaWdodCBJbnB1dCBjbGFzcy13ZWlnaHRpbmcgb2JqZWN0KHMpLlxuICogQHBhcmFtIG91dHB1dE5hbWVzIEFsbCBvdXRwdXQgbmFtZShzKSBvZiB0aGUgbW9kZWwuXG4gKiBAcmV0dXJuIEFuIGFycmF5IG9mIGNsYXNzLXdlaWdodGluZyBvYmplY3RzLiBUaGUgbGVuZ3RoIG9mIHRoZSBhcnJheSBtYXRjaGVzXG4gKiAgIHRoZSBtb2RlbCdzIG51bWJlciBvZiBvdXRwdXRzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RhbmRhcmRpemVDbGFzc1dlaWdodHMoXG4gICAgY2xhc3NXZWlnaHQ6IENsYXNzV2VpZ2h0fENsYXNzV2VpZ2h0W118Q2xhc3NXZWlnaHRNYXAsXG4gICAgb3V0cHV0TmFtZXM6IHN0cmluZ1tdKTogQ2xhc3NXZWlnaHRbXSB7XG4gIHJldHVybiBzdGFuZGFyZGl6ZVNhbXBsZU9yQ2xhc3NXZWlnaHRzKFxuICAgICAgY2xhc3NXZWlnaHQsIG91dHB1dE5hbWVzLCAnY2xhc3NXZWlnaHQnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YW5kYXJkaXplU2FtcGxlV2VpZ2h0cyhcbiAgICBjbGFzc1dlaWdodDogQ2xhc3NXZWlnaHR8Q2xhc3NXZWlnaHRbXXxDbGFzc1dlaWdodE1hcCxcbiAgICBvdXRwdXROYW1lczogc3RyaW5nW10pOiBDbGFzc1dlaWdodFtdIHtcbiAgcmV0dXJuIHN0YW5kYXJkaXplU2FtcGxlT3JDbGFzc1dlaWdodHMoXG4gICAgICBjbGFzc1dlaWdodCwgb3V0cHV0TmFtZXMsICdzYW1wbGVXZWlnaHQnKTtcbn1cblxuLyoqXG4gKiBTdGFuZGFyZGl6ZSBieS1zYW1wbGUgYW5kL29yIGJ5LWNsYXNzIHdlaWdodHMgZm9yIHRyYWluaW5nLlxuICpcbiAqIE5vdGUgdGhhdCB0aGlzIGZ1bmN0aW9uIG9wZXJhdGVzIG9uIG9uZSBtb2RlbCBvdXRwdXQgYXQgYSB0aW1lLiBGb3IgYSBtb2RlbFxuICogd2l0aCBtdWx0aXBsZSBvdXRwdXRzLCB5b3UgbXVzdCBjYWxsIHRoaXMgZnVuY3Rpb24gbXVsdGlwbGUgdGltZXMuXG4gKlxuICogQHBhcmFtIHkgVGhlIHRhcmdldCB0ZW5zb3IgdGhhdCB0aGUgYnktc2FtcGxlIGFuZC9vciBieS1jbGFzcyB3ZWlnaHQgaXMgZm9yLlxuICogICAgIFRoZSB2YWx1ZXMgb2YgeSBhcmUgYXNzdW1lZCB0byBlbmNvZGUgdGhlIGNsYXNzZXMsIGVpdGhlciBkaXJlY3RseVxuICogICAgIGFzIGFuIGludGVnZXIgaW5kZXgsIG9yIGFzIG9uZS1ob3QgZW5jb2RpbmcuXG4gKiBAcGFyYW0gc2FtcGxlV2VpZ2h0IEJ5LXNhbXBsZSB3ZWlnaHRzLlxuICogQHBhcmFtIGNsYXNzV2VpZ2h0IEJ5LWNsYXNzIHdlaWdodHM6IGFuIG9iamVjdCBtYXBwaW5nIGNsYXNzIGluZGljZXNcbiAqICAgICAoaW50ZWdlcnMpIHRvIGEgd2VpZ2h0IChmbG9hdCkgdG8gYXBwbHkgdG8gdGhlIG1vZGVsJ3MgbG9zcyBmb3IgdGhlXG4gKiAgICAgc2FtcGxlcyBmcm9tIHRoaXMgY2xhc3MgZHVyaW5nIHRyYWluaW5nLiBUaGlzIGNhbiBiZSB1c2VmdWwgdG8gdGVsbCB0aGVcbiAqICAgICBtb2RlbCB0byBcInBheSBtb3JlIGF0dGVudGlvblwiIHRvIHNhbXBsZXMgZnJvbSBhbiB1bmRlci1yZXByZXNlbnRlZCBjbGFzcy5cbiAqIEBwYXJhbSBzYW1wbGVXZWlnaHRNb2RlIFRoZSBtb2RlIGZvciB0aGUgc2FtcGxlIHdlaWdodHMuXG4gKiBAcmV0dXJuIEEgUHJvbWlzZSBvZiB3ZWlnaHQgdGVuc29yLCBvZiB3aGljaCB0aGUgc2l6ZSBvZiB0aGUgZmlyc3QgZGltZW5zaW9uXG4gKiAgICAgbWF0Y2hlcyB0aGF0IG9mIGB5YC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN0YW5kYXJkaXplV2VpZ2h0cyhcbiAgICB5OiBUZW5zb3IsIHNhbXBsZVdlaWdodD86IFRlbnNvciwgY2xhc3NXZWlnaHQ/OiBDbGFzc1dlaWdodCxcbiAgICBzYW1wbGVXZWlnaHRNb2RlPzogJ3RlbXBvcmFsJyk6IFByb21pc2U8VGVuc29yPiB7XG4gIGlmIChzYW1wbGVXZWlnaHQgIT0gbnVsbCB8fCBzYW1wbGVXZWlnaHRNb2RlICE9IG51bGwpIHtcbiAgICAvLyBUT0RPKGNhaXMpOiBPbmNlICd0ZW1wb3JhbCcgbW9kZSBpcyBpbXBsZW1lbnRlZCwgZG9jdW1lbnQgaXQgaW4gdGhlIGRvY1xuICAgIC8vIHN0cmluZy5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1N1cHBvcnQgc2FtcGxlV2VpZ2h0IGlzIG5vdCBpbXBsZW1lbnRlZCB5ZXQnKTtcbiAgfVxuXG4gIGlmIChjbGFzc1dlaWdodCAhPSBudWxsKSB7XG4gICAgLy8gQXBwbHkgY2xhc3Mgd2VpZ2h0cyBwZXIgc2FtcGxlLlxuICAgIGNvbnN0IHlDbGFzc2VzOiBUZW5zb3IxRCA9IHRpZHkoKCkgPT4ge1xuICAgICAgaWYgKHkuc2hhcGUubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIC8vIEFzc3VtZSBjbGFzcyBpbmRpY2VzLlxuICAgICAgICByZXR1cm4gY2xvbmUoeSkgYXMgVGVuc29yMUQ7XG4gICAgICB9IGVsc2UgaWYgKHkuc2hhcGUubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIGlmICh5LnNoYXBlWzFdID4gMSkge1xuICAgICAgICAgIC8vIEFzc3VtZSBvbmUtaG90IGVuY29kaW5nIG9mIGNsYXNzZXMuXG4gICAgICAgICAgY29uc3QgYXhpcyA9IDE7XG4gICAgICAgICAgcmV0dXJuIGFyZ01heCh5LCBheGlzKTtcbiAgICAgICAgfSBlbHNlIGlmICh5LnNoYXBlWzFdID09PSAxKSB7XG4gICAgICAgICAgLy8gQ2xhc3MgaW5kZXguXG4gICAgICAgICAgcmV0dXJuIHJlc2hhcGUoeSwgW3kuc2hhcGVbMF1dKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgIGBFbmNvdW50ZXJlZCB1bmV4cGVjdGVkIGxhc3QtZGltZW5zaW9uIHNpemUgKCR7eS5zaGFwZVsxXX0pIGAgK1xuICAgICAgICAgICAgICBgZHVyaW5nIGhhbmRsaW5nIG9mIGNsYXNzIHdlaWdodHMuIFRoZSBzaXplIGlzIGV4cGVjdGVkIHRvIGJlIGAgK1xuICAgICAgICAgICAgICBgPj0gMS5gKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYFVuZXhwZWN0ZWQgcmFuayBvZiB0YXJnZXQgKHkpIHRlbnNvciAoJHt5LnJhbmt9KSBkdXJpbmcgYCArXG4gICAgICAgICAgICBgaGFuZGxpbmcgb2YgY2xhc3Mgd2VpZ2h0cy4gVGhlIHJhbmsgaXMgZXhwZWN0ZWQgdG8gYmUgMSBvciAyLmApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgeUNsYXNzSW5kaWNlcyA9IEFycmF5LmZyb20oYXdhaXQgeUNsYXNzZXMuZGF0YSgpKTtcbiAgICBkaXNwb3NlKHlDbGFzc2VzKTtcbiAgICBjb25zdCBjbGFzc1NhbXBsZVdlaWdodDogbnVtYmVyW10gPSBbXTtcbiAgICB5Q2xhc3NJbmRpY2VzLmZvckVhY2goY2xhc3NJbmRleCA9PiB7XG4gICAgICBpZiAoY2xhc3NXZWlnaHRbY2xhc3NJbmRleF0gPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgY2xhc3NXZWlnaHQgbXVzdCBjb250YWluIGFsbCBjbGFzc2VzIGluIHRoZSB0cmFpbmluZyBkYXRhLiBgICtcbiAgICAgICAgICAgIGBUaGUgY2xhc3MgJHtjbGFzc0luZGV4fSBleGlzdHMgaW4gdGhlIGRhdGEgYnV0IG5vdCBpbiBgICtcbiAgICAgICAgICAgIGBjbGFzc1dlaWdodGApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2xhc3NTYW1wbGVXZWlnaHQucHVzaChjbGFzc1dlaWdodFtjbGFzc0luZGV4XSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGVuc29yMWQoY2xhc3NTYW1wbGVXZWlnaHQsICdmbG9hdDMyJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBBcHBseSBwZXItc2FtcGxlIHdlaWdodHMgb24gdGhlIGxvc3MgdmFsdWVzIGZyb20gYSBudW1iZXIgb2Ygc2FtcGxlcy5cbiAqXG4gKiBAcGFyYW0gbG9zc2VzIExvc3MgdGVuc29yIG9mIHNoYXBlIGBbYmF0Y2hTaXplXWAuXG4gKiBAcGFyYW0gc2FtcGxlV2VpZ2h0cyBQZXItc2FtcGxlIHdlaWdodCB0ZW5zb3Igb2Ygc2hhcGUgYFtiYXRjaFNpemVdYC5cbiAqIEByZXR1cm5zIFRlbnNvciBvZiB0aGUgc2FtZSBzaGFwZSBhc2Bsb3NzZXNgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZVdlaWdodGVkTG9zcyhsb3NzZXM6IFRlbnNvciwgc2FtcGxlV2VpZ2h0czogVGVuc29yKSB7XG4gIHJldHVybiBtdWwobG9zc2VzLCBzYW1wbGVXZWlnaHRzKTtcbn1cbiJdfQ==