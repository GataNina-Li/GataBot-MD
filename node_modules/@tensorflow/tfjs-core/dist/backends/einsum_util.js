/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
import { assert } from '../util_base';
const ARROW = '->';
const ARROW_REGEX = /->/g;
const COMMA = ',';
const ELLIPSIS = '...';
/**
 * Parse an equation for einsum.
 *
 * @param equation The einsum equation (e.g., "ij,jk->ik").
 * @param numTensors Number of tensors provided along with `equation`. Used to
 *   check matching number of input tensors.
 * @returns An object consisting of the following fields:
 *   - allDims: all dimension names as strings.
 *   - summedDims: a list of all dimensions being summed over, as indices to
 *     the elements of `allDims`.
 *   - idDims: indices of the dimensions in each input tensor, as indices to
 *     the elements of `allDims.
 */
export function decodeEinsumEquation(equation, numTensors) {
    equation = equation.replace(/\s/g, ''); // Remove witespace in equation.
    const numArrows = (equation.length - equation.replace(ARROW_REGEX, '').length) /
        ARROW.length;
    if (numArrows < 1) {
        throw new Error('Equations without an arrow are not supported.');
    }
    else if (numArrows > 1) {
        throw new Error(`Equation must contain exactly one arrow ("${ARROW}").`);
    }
    const [inputString, outputString] = equation.split(ARROW);
    assert(inputString.indexOf(ELLIPSIS) === -1, () => `The ellipsis notation ("${ELLIPSIS}") is not supported yet.`);
    const inputTerms = inputString.split(COMMA);
    const numInputs = inputTerms.length;
    if (numTensors !== numInputs) {
        throw new Error(`Expected ${numInputs} input tensors, received ${numTensors}`);
    }
    if (numInputs > 2) {
        throw new Error('Support for more than 2 input tensors is not implemented yet.');
    }
    const allDims = [];
    for (let i = 0; i < outputString.length; ++i) {
        const dimName = outputString[i];
        if (!inputTerms.some(inputTerm => inputTerm.indexOf(dimName) !== -1)) {
            throw new Error(`Output subscripts contain the label ${dimName} ` +
                `not present in the input subscripts.`);
        }
        if (allDims.indexOf(dimName) === -1) {
            allDims.push(dimName);
        }
    }
    for (let i = 0; i < inputString.length; ++i) {
        const dimName = inputString[i];
        if (allDims.indexOf(dimName) === -1 && dimName !== COMMA) {
            allDims.push(dimName);
        }
    }
    const idDims = new Array(inputTerms.length);
    for (let i = 0; i < numInputs; ++i) {
        if (new Set(inputTerms[i].split('')).size !== inputTerms[i].length) {
            throw new Error(`Found duplicate axes in input component ${inputTerms[i]}. ` +
                `Support for duplicate axes in input is not implemented yet.`);
        }
        idDims[i] = [];
        for (let j = 0; j < inputTerms[i].length; ++j) {
            idDims[i].push(allDims.indexOf(inputTerms[i][j]));
        }
    }
    const numDims = allDims.length; // Number of unique dimensions.
    const numOutDims = outputString.length; // Number of output dimensions.
    const summedDims = []; // Dimensions being summed over.
    for (let i = numOutDims; i < numDims; ++i) {
        summedDims.push(i);
    }
    return { allDims, summedDims, idDims };
}
/**
 * Get the permutation for a given input tensor.
 *
 * @param nDims Total number of dimension of all tensors involved in the einsum
 *   operation.
 * @param idDims Dimension indices involve in the tensor in question.
 * @returns An object consisting of the following fields:
 *   - permutationIndices: Indices to permute the axes of the tensor with.
 *   - expandDims: Indices to the dimension that need to be expanded from the
 *     tensor after permutation.
 */
export function getEinsumPermutation(nDims, idDims) {
    let permutationIndices = new Array(nDims);
    permutationIndices.fill(-1);
    for (let i = 0; i < idDims.length; ++i) {
        permutationIndices[idDims[i]] = i;
    }
    const expandDims = [];
    for (let i = 0; i < nDims; ++i) {
        if (permutationIndices[i] === -1) {
            expandDims.push(i);
        }
    }
    permutationIndices = permutationIndices.filter(d => d !== -1);
    return { permutationIndices, expandDims };
}
/**
 * Checks that the dimension sizes from different input tensors match the
 * equation.
 */
export function checkEinsumDimSizes(nDims, idDims, tensors) {
    const dimSizes = new Array(nDims);
    for (let i = 0; i < tensors.length; ++i) {
        const shape = tensors[i].shape;
        for (let j = 0; j < idDims[i].length; ++j) {
            if (dimSizes[idDims[i][j]] === undefined) {
                dimSizes[idDims[i][j]] = shape[j];
            }
            else {
                assert(dimSizes[idDims[i][j]] === shape[j], () => `Expected dimension ${dimSizes[idDims[i][j]]} at axis ${j} ` +
                    `of input shaped ${JSON.stringify(shape)}, ` +
                    `but got dimension ${shape[j]}`);
            }
        }
    }
}
/**
 * Gets path of computation for einsum.
 *
 * @param summedDims indices to the dimensions being summed over.
 * @param idDims A look up table for the dimensions present in each input
 *     tensor. Each consituent array contains indices for the dimensions in the
 *     corresponding input tensor.
 *
 * @return A map with two fields:
 *   - path: The path of computation, with each element indicating the dimension
 *     being summed over after the element-wise multiplication in that step.
 *   - steps: With the same length as `path`. Each element contains the indices
 *     to the input tensors being used for element-wise multiplication in the
 *     corresponding step.
 */
export function getEinsumComputePath(summedDims, idDims) {
    const path = summedDims;
    const steps = [];
    let nSteps = 0;
    if (summedDims.length === 0) {
        // Einsum that involes no summing: e.g., transpose and outer product.
        path.push(-1);
    }
    nSteps = summedDims.length + 1;
    for (let i = 0; i < nSteps; ++i) {
        steps.push([]);
    }
    const computedTermIndices = [];
    for (let i = 0; i < path.length; ++i) {
        const summedDim = path[i];
        const termIndices = findTermsWithDim(idDims, summedDim);
        for (const termIndex of termIndices) {
            if (computedTermIndices.indexOf(termIndex) === -1) {
                steps[i].push(termIndex);
                computedTermIndices.push(termIndex);
            }
        }
    }
    return { path, steps };
}
/** Determines if an axes permutation is the identity permutation. */
export function isIdentityPermutation(perm) {
    return perm.every((dim, index) => dim === index);
}
function findTermsWithDim(idDims, dim) {
    const termIndices = [];
    for (let i = 0; i < idDims.length; ++i) {
        if (idDims[i].length === 0 || idDims[i].indexOf(dim) !== -1 || dim === -1) {
            termIndices.push(i);
        }
    }
    return termIndices;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWluc3VtX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2JhY2tlbmRzL2VpbnN1bV91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQVFILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFcEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ25CLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQztBQUMxQixNQUFNLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDbEIsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBRXZCOzs7Ozs7Ozs7Ozs7R0FZRztBQUNILE1BQU0sVUFBVSxvQkFBb0IsQ0FBQyxRQUFnQixFQUFFLFVBQWtCO0lBS3ZFLFFBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFFLGdDQUFnQztJQUN6RSxNQUFNLFNBQVMsR0FDWCxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQzVELEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDakIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxFQUFFO1FBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQztLQUNsRTtTQUFNLElBQUksU0FBUyxHQUFHLENBQUMsRUFBRTtRQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxLQUFLLEtBQUssQ0FBQyxDQUFDO0tBQzFFO0lBQ0QsTUFBTSxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFELE1BQU0sQ0FDRixXQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMs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Q0FBQyxDQUFDO0FBQ25FLENBQUM7QUFFRCxTQUFTLGdCQUFnQixDQUFDLE1BQWtCLEVBQUUsR0FBVztJQUN2RCxNQUFNLFdBQVcsR0FBYSxFQUFFLENBQUM7SUFDakMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDdEMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUN6RSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3JCO0tBQ0Y7SUFDRCxPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG4vKipcbiAqIFV0aWxpdHkgZnVuY3Rpb25zIGZvciBjb21wdXRpbmcgZWluc3VtICh0ZW5zb3IgY29udHJhY3Rpb24gYW5kIHN1bW1hdGlvblxuICogYmFzZWQgb24gRWluc3RlaW4gc3VtbWF0aW9uLilcbiAqL1xuXG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7YXNzZXJ0fSBmcm9tICcuLi91dGlsX2Jhc2UnO1xuXG5jb25zdCBBUlJPVyA9ICctPic7XG5jb25zdCBBUlJPV19SRUdFWCA9IC8tPi9nO1xuY29uc3QgQ09NTUEgPSAnLCc7XG5jb25zdCBFTExJUFNJUyA9ICcuLi4nO1xuXG4vKipcbiAqIFBhcnNlIGFuIGVxdWF0aW9uIGZvciBlaW5zdW0uXG4gKlxuICogQHBhcmFtIGVxdWF0aW9uIFRoZSBlaW5zdW0gZXF1YXRpb24gKGUuZy4sIFwiaWosamstPmlrXCIpLlxuICogQHBhcmFtIG51bVRlbnNvcnMgTnVtYmVyIG9mIHRlbnNvcnMgcHJvdmlkZWQgYWxvbmcgd2l0aCBgZXF1YXRpb25gLiBVc2VkIHRvXG4gKiAgIGNoZWNrIG1hdGNoaW5nIG51bWJlciBvZiBpbnB1dCB0ZW5zb3JzLlxuICogQHJldHVybnMgQW4gb2JqZWN0IGNvbnNpc3Rpbmcgb2YgdGhlIGZvbGxvd2luZyBmaWVsZHM6XG4gKiAgIC0gYWxsRGltczogYWxsIGRpbWVuc2lvbiBuYW1lcyBhcyBzdHJpbmdzLlxuICogICAtIHN1bW1lZERpbXM6IGEgbGlzdCBvZiBhbGwgZGltZW5zaW9ucyBiZWluZyBzdW1tZWQgb3ZlciwgYXMgaW5kaWNlcyB0b1xuICogICAgIHRoZSBlbGVtZW50cyBvZiBgYWxsRGltc2AuXG4gKiAgIC0gaWREaW1zOiBpbmRpY2VzIG9mIHRoZSBkaW1lbnNpb25zIGluIGVhY2ggaW5wdXQgdGVuc29yLCBhcyBpbmRpY2VzIHRvXG4gKiAgICAgdGhlIGVsZW1lbnRzIG9mIGBhbGxEaW1zLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVjb2RlRWluc3VtRXF1YXRpb24oZXF1YXRpb246IHN0cmluZywgbnVtVGVuc29yczogbnVtYmVyKToge1xuICBhbGxEaW1zOiBzdHJpbmdbXSxcbiAgc3VtbWVkRGltczogbnVtYmVyW10sXG4gIGlkRGltczogbnVtYmVyW11bXSxcbn0ge1xuICBlcXVhdGlvbiA9IGVxdWF0aW9uLnJlcGxhY2UoL1xccy9nLCAnJyk7ICAvLyBSZW1vdmUgd2l0ZXNwYWNlIGluIGVxdWF0aW9uLlxuICBjb25zdCBudW1BcnJvd3MgPVxuICAgICAgKGVxdWF0aW9uLmxlbmd0aCAtIGVxdWF0aW9uLnJlcGxhY2UoQVJST1dfUkVHRVgsICcnKS5sZW5ndGgpIC9cbiAgICAgIEFSUk9XLmxlbmd0aDtcbiAgaWYgKG51bUFycm93cyA8IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0VxdWF0aW9ucyB3aXRob3V0IGFuIGFycm93IGFyZSBub3Qgc3VwcG9ydGVkLicpO1xuICB9IGVsc2UgaWYgKG51bUFycm93cyA+IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEVxdWF0aW9uIG11c3QgY29udGFpbiBleGFjdGx5IG9uZSBhcnJvdyAoXCIke0FSUk9XfVwiKS5gKTtcbiAgfVxuICBjb25zdCBbaW5wdXRTdHJpbmcsIG91dHB1dFN0cmluZ10gPSBlcXVhdGlvbi5zcGxpdChBUlJPVyk7XG4gIGFzc2VydChcbiAgICAgIGlucHV0U3RyaW5nLmluZGV4T2YoRUxMSVBTSVMpID09PSAtMSxcbiAgICAgICgpID0+IGBUaGUgZWxsaXBzaXMgbm90YXRpb24gKFwiJHtFTExJUFNJU31cIikgaXMgbm90IHN1cHBvcnRlZCB5ZXQuYCk7XG4gIGNvbnN0IGlucHV0VGVybXMgPSBpbnB1dFN0cmluZy5zcGxpdChDT01NQSk7XG4gIGNvbnN0IG51bUlucHV0cyA9IGlucHV0VGVybXMubGVuZ3RoO1xuICBpZiAobnVtVGVuc29ycyAhPT0gbnVtSW5wdXRzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgRXhwZWN0ZWQgJHtudW1JbnB1dHN9IGlucHV0IHRlbnNvcnMsIHJlY2VpdmVkICR7bnVtVGVuc29yc31gKTtcbiAgfVxuICBpZiAobnVtSW5wdXRzID4gMikge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ1N1cHBvcnQgZm9yIG1vcmUgdGhhbiAyIGlucHV0IHRlbnNvcnMgaXMgbm90IGltcGxlbWVudGVkIHlldC4nKTtcbiAgfVxuXG4gIGNvbnN0IGFsbERpbXM6IHN0cmluZ1tdID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgb3V0cHV0U3RyaW5nLmxlbmd0aDsgKytpKSB7XG4gICAgY29uc3QgZGltTmFtZSA9IG91dHB1dFN0cmluZ1tpXTtcbiAgICBpZiAoIWlucHV0VGVybXMuc29tZShpbnB1dFRlcm0gPT4gaW5wdXRUZXJtLmluZGV4T2YoZGltTmFtZSkgIT09IC0xKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBPdXRwdXQgc3Vic2NyaXB0cyBjb250YWluIHRoZSBsYWJlbCAke2RpbU5hbWV9IGAgK1xuICAgICAgICAgIGBub3QgcHJlc2VudCBpbiB0aGUgaW5wdXQgc3Vic2NyaXB0cy5gKTtcbiAgICB9XG4gICAgaWYgKGFsbERpbXMuaW5kZXhPZihkaW1OYW1lKSA9PT0gLTEpIHtcbiAgICAgIGFsbERpbXMucHVzaChkaW1OYW1lKTtcbiAgICB9XG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dFN0cmluZy5sZW5ndGg7ICsraSkge1xuICAgIGNvbnN0IGRpbU5hbWUgPSBpbnB1dFN0cmluZ1tpXTtcbiAgICBpZiAoYWxsRGltcy5pbmRleE9mKGRpbU5hbWUpID09PSAtMSAmJiBkaW1OYW1lICE9PSBDT01NQSkge1xuICAgICAgYWxsRGltcy5wdXNoKGRpbU5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGlkRGltczogbnVtYmVyW11bXSA9IG5ldyBBcnJheTxudW1iZXJbXT4oaW5wdXRUZXJtcy5sZW5ndGgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUlucHV0czsgKytpKSB7XG4gICAgaWYgKG5ldyBTZXQoaW5wdXRUZXJtc1tpXS5zcGxpdCgnJykpLnNpemUgIT09IGlucHV0VGVybXNbaV0ubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYEZvdW5kIGR1cGxpY2F0ZSBheGVzIGluIGlucHV0IGNvbXBvbmVudCAke2lucHV0VGVybXNbaV19LiBgICtcbiAgICAgICAgICBgU3VwcG9ydCBmb3IgZHVwbGljYXRlIGF4ZXMgaW4gaW5wdXQgaXMgbm90IGltcGxlbWVudGVkIHlldC5gKTtcbiAgICB9XG4gICAgaWREaW1zW2ldID0gW107XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBpbnB1dFRlcm1zW2ldLmxlbmd0aDsgKytqKSB7XG4gICAgICBpZERpbXNbaV0ucHVzaChhbGxEaW1zLmluZGV4T2YoaW5wdXRUZXJtc1tpXVtqXSkpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG51bURpbXMgPSBhbGxEaW1zLmxlbmd0aDsgICAgICAgICAgLy8gTnVtYmVyIG9mIHVuaXF1ZSBkaW1lbnNpb25zLlxuICBjb25zdCBudW1PdXREaW1zID0gb3V0cHV0U3RyaW5nLmxlbmd0aDsgIC8vIE51bWJlciBvZiBvdXRwdXQgZGltZW5zaW9ucy5cbiAgY29uc3Qgc3VtbWVkRGltczogbnVtYmVyW10gPSBbXTsgICAgICAgICAvLyBEaW1lbnNpb25zIGJlaW5nIHN1bW1lZCBvdmVyLlxuICBmb3IgKGxldCBpID0gbnVtT3V0RGltczsgaSA8IG51bURpbXM7ICsraSkge1xuICAgIHN1bW1lZERpbXMucHVzaChpKTtcbiAgfVxuICByZXR1cm4ge2FsbERpbXMsIHN1bW1lZERpbXMsIGlkRGltc307XG59XG5cbi8qKlxuICogR2V0IHRoZSBwZXJtdXRhdGlvbiBmb3IgYSBnaXZlbiBpbnB1dCB0ZW5zb3IuXG4gKlxuICogQHBhcmFtIG5EaW1zIFRvdGFsIG51bWJlciBvZiBkaW1lbnNpb24gb2YgYWxsIHRlbnNvcnMgaW52b2x2ZWQgaW4gdGhlIGVpbnN1bVxuICogICBvcGVyYXRpb24uXG4gKiBAcGFyYW0gaWREaW1zIERpbWVuc2lvbiBpbmRpY2VzIGludm9sdmUgaW4gdGhlIHRlbnNvciBpbiBxdWVzdGlvbi5cbiAqIEByZXR1cm5zIEFuIG9iamVjdCBjb25zaXN0aW5nIG9mIHRoZSBmb2xsb3dpbmcgZmllbGRzOlxuICogICAtIHBlcm11dGF0aW9uSW5kaWNlczogSW5kaWNlcyB0byBwZXJtdXRlIHRoZSBheGVzIG9mIHRoZSB0ZW5zb3Igd2l0aC5cbiAqICAgLSBleHBhbmREaW1zOiBJbmRpY2VzIHRvIHRoZSBkaW1lbnNpb24gdGhhdCBuZWVkIHRvIGJlIGV4cGFuZGVkIGZyb20gdGhlXG4gKiAgICAgdGVuc29yIGFmdGVyIHBlcm11dGF0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWluc3VtUGVybXV0YXRpb24obkRpbXM6IG51bWJlciwgaWREaW1zOiBudW1iZXJbXSk6XG4gICAge3Blcm11dGF0aW9uSW5kaWNlczogbnVtYmVyW10sIGV4cGFuZERpbXM6IG51bWJlcltdfSB7XG4gIGxldCBwZXJtdXRhdGlvbkluZGljZXM6IG51bWJlcltdID0gbmV3IEFycmF5PG51bWJlcj4obkRpbXMpO1xuICBwZXJtdXRhdGlvbkluZGljZXMuZmlsbCgtMSk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaWREaW1zLmxlbmd0aDsgKytpKSB7XG4gICAgcGVybXV0YXRpb25JbmRpY2VzW2lkRGltc1tpXV0gPSBpO1xuICB9XG4gIGNvbnN0IGV4cGFuZERpbXM6IG51bWJlcltdID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbkRpbXM7ICsraSkge1xuICAgIGlmIChwZXJtdXRhdGlvbkluZGljZXNbaV0gPT09IC0xKSB7XG4gICAgICBleHBhbmREaW1zLnB1c2goaSk7XG4gICAgfVxuICB9XG4gIHBlcm11dGF0aW9uSW5kaWNlcyA9IHBlcm11dGF0aW9uSW5kaWNlcy5maWx0ZXIoZCA9PiBkICE9PSAtMSk7XG4gIHJldHVybiB7cGVybXV0YXRpb25JbmRpY2VzLCBleHBhbmREaW1zfTtcbn1cblxuLyoqXG4gKiBDaGVja3MgdGhhdCB0aGUgZGltZW5zaW9uIHNpemVzIGZyb20gZGlmZmVyZW50IGlucHV0IHRlbnNvcnMgbWF0Y2ggdGhlXG4gKiBlcXVhdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrRWluc3VtRGltU2l6ZXMoXG4gICAgbkRpbXM6IG51bWJlciwgaWREaW1zOiBudW1iZXJbXVtdLCB0ZW5zb3JzOiBUZW5zb3JbXSkge1xuICBjb25zdCBkaW1TaXplczogbnVtYmVyW10gPSBuZXcgQXJyYXk8bnVtYmVyPihuRGltcyk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGVuc29ycy5sZW5ndGg7ICsraSkge1xuICAgIGNvbnN0IHNoYXBlOiBudW1iZXJbXSA9IHRlbnNvcnNbaV0uc2hhcGU7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBpZERpbXNbaV0ubGVuZ3RoOyArK2opIHtcbiAgICAgIGlmIChkaW1TaXplc1tpZERpbXNbaV1bal1dID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZGltU2l6ZXNbaWREaW1zW2ldW2pdXSA9IHNoYXBlW2pdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXNzZXJ0KFxuICAgICAgICAgICAgZGltU2l6ZXNbaWREaW1zW2ldW2pdXSA9PT0gc2hhcGVbal0sXG4gICAgICAgICAgICAoKSA9PiBgRXhwZWN0ZWQgZGltZW5zaW9uICR7ZGltU2l6ZXNbaWREaW1zW2ldW2pdXX0gYXQgYXhpcyAke2p9IGAgK1xuICAgICAgICAgICAgICAgIGBvZiBpbnB1dCBzaGFwZWQgJHtKU09OLnN0cmluZ2lmeShzaGFwZSl9LCBgICtcbiAgICAgICAgICAgICAgICBgYnV0IGdvdCBkaW1lbnNpb24gJHtzaGFwZVtqXX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBHZXRzIHBhdGggb2YgY29tcHV0YXRpb24gZm9yIGVpbnN1bS5cbiAqXG4gKiBAcGFyYW0gc3VtbWVkRGltcyBpbmRpY2VzIHRvIHRoZSBkaW1lbnNpb25zIGJlaW5nIHN1bW1lZCBvdmVyLlxuICogQHBhcmFtIGlkRGltcyBBIGxvb2sgdXAgdGFibGUgZm9yIHRoZSBkaW1lbnNpb25zIHByZXNlbnQgaW4gZWFjaCBpbnB1dFxuICogICAgIHRlbnNvci4gRWFjaCBjb25zaXR1ZW50IGFycmF5IGNvbnRhaW5zIGluZGljZXMgZm9yIHRoZSBkaW1lbnNpb25zIGluIHRoZVxuICogICAgIGNvcnJlc3BvbmRpbmcgaW5wdXQgdGVuc29yLlxuICpcbiAqIEByZXR1cm4gQSBtYXAgd2l0aCB0d28gZmllbGRzOlxuICogICAtIHBhdGg6IFRoZSBwYXRoIG9mIGNvbXB1dGF0aW9uLCB3aXRoIGVhY2ggZWxlbWVudCBpbmRpY2F0aW5nIHRoZSBkaW1lbnNpb25cbiAqICAgICBiZWluZyBzdW1tZWQgb3ZlciBhZnRlciB0aGUgZWxlbWVudC13aXNlIG11bHRpcGxpY2F0aW9uIGluIHRoYXQgc3RlcC5cbiAqICAgLSBzdGVwczogV2l0aCB0aGUgc2FtZSBsZW5ndGggYXMgYHBhdGhgLiBFYWNoIGVsZW1lbnQgY29udGFpbnMgdGhlIGluZGljZXNcbiAqICAgICB0byB0aGUgaW5wdXQgdGVuc29ycyBiZWluZyB1c2VkIGZvciBlbGVtZW50LXdpc2UgbXVsdGlwbGljYXRpb24gaW4gdGhlXG4gKiAgICAgY29ycmVzcG9uZGluZyBzdGVwLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWluc3VtQ29tcHV0ZVBhdGgoc3VtbWVkRGltczogbnVtYmVyW10sIGlkRGltczogbnVtYmVyW11bXSk6XG4gICAge3BhdGg6IG51bWJlcltdLCBzdGVwczogbnVtYmVyW11bXX0ge1xuICBjb25zdCBwYXRoOiBudW1iZXJbXSA9IHN1bW1lZERpbXM7XG4gIGNvbnN0IHN0ZXBzOiBudW1iZXJbXVtdID0gW107XG4gIGxldCBuU3RlcHMgPSAwO1xuICBpZiAoc3VtbWVkRGltcy5sZW5ndGggPT09IDApIHtcbiAgICAvLyBFaW5zdW0gdGhhdCBpbnZvbGVzIG5vIHN1bW1pbmc6IGUuZy4sIHRyYW5zcG9zZSBhbmQgb3V0ZXIgcHJvZHVjdC5cbiAgICBwYXRoLnB1c2goLTEpO1xuICB9XG4gIG5TdGVwcyA9IHN1bW1lZERpbXMubGVuZ3RoICsgMTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBuU3RlcHM7ICsraSkge1xuICAgIHN0ZXBzLnB1c2goW10pO1xuICB9XG4gIGNvbnN0IGNvbXB1dGVkVGVybUluZGljZXM6IG51bWJlcltdID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aC5sZW5ndGg7ICsraSkge1xuICAgIGNvbnN0IHN1bW1lZERpbSA9IHBhdGhbaV07XG4gICAgY29uc3QgdGVybUluZGljZXMgPSBmaW5kVGVybXNXaXRoRGltKGlkRGltcywgc3VtbWVkRGltKTtcbiAgICBmb3IgKGNvbnN0IHRlcm1JbmRleCBvZiB0ZXJtSW5kaWNlcykge1xuICAgICAgaWYgKGNvbXB1dGVkVGVybUluZGljZXMuaW5kZXhPZih0ZXJtSW5kZXgpID09PSAtMSkge1xuICAgICAgICBzdGVwc1tpXS5wdXNoKHRlcm1JbmRleCk7XG4gICAgICAgIGNvbXB1dGVkVGVybUluZGljZXMucHVzaCh0ZXJtSW5kZXgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4ge3BhdGgsIHN0ZXBzfTtcbn1cblxuLyoqIERldGVybWluZXMgaWYgYW4gYXhlcyBwZXJtdXRhdGlvbiBpcyB0aGUgaWRlbnRpdHkgcGVybXV0YXRpb24uICovXG5leHBvcnQgZnVuY3Rpb24gaXNJZGVudGl0eVBlcm11dGF0aW9uKHBlcm06IG51bWJlcltdKTogYm9vbGVhbiB7XG4gIHJldHVybiBwZXJtLmV2ZXJ5KChkaW06IG51bWJlciwgaW5kZXg6IG51bWJlcikgPT4gZGltID09PSBpbmRleCk7XG59XG5cbmZ1bmN0aW9uIGZpbmRUZXJtc1dpdGhEaW0oaWREaW1zOiBudW1iZXJbXVtdLCBkaW06IG51bWJlcik6IG51bWJlcltdIHtcbiAgY29uc3QgdGVybUluZGljZXM6IG51bWJlcltdID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaWREaW1zLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKGlkRGltc1tpXS5sZW5ndGggPT09IDAgfHwgaWREaW1zW2ldLmluZGV4T2YoZGltKSAhPT0gLTEgfHwgZGltID09PSAtMSkge1xuICAgICAgdGVybUluZGljZXMucHVzaChpKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRlcm1JbmRpY2VzO1xufVxuIl19