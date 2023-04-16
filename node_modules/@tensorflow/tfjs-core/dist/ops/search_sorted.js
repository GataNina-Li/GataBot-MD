/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
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
import { ENGINE } from '../engine';
import { SearchSorted } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { sizeFromShape } from '../util_base';
import { op } from './operation';
import { reshape } from './reshape';
const INT32_MAX = 2147483648;
/**
 * Searches for where a value would go in a sorted sequence.
 *
 * This is not a method for checking containment (like javascript in).
 *
 * The typical use case for this operation is "binning", "bucketing", or
 * "discretizing". The values are assigned to bucket-indices based on the edges
 * listed in 'sortedSequence'. This operation returns the bucket-index for each
 * value.
 *
 * The side argument controls which index is returned if a value lands exactly
 * on an edge.
 *
 * The axis is not settable for this operation. It always operates on the
 * innermost dimension (axis=-1). The operation will accept any number of outer
 * dimensions.
 *
 * Note: This operation assumes that 'sortedSequence' is sorted along the
 * innermost axis, maybe using 'sort(..., axis=-1)'. If the sequence is not
 * sorted no error is raised and the content of the returned tensor is not well
 * defined.
 *
 * ```js
 * const edges = tf.tensor1d([-1, 3.3, 9.1, 10.0]);
 * let values = tf.tensor1d([0.0, 4.1, 12.0]);
 * const result1 = tf.searchSorted(edges, values, 'left');
 * result1.print(); // [1, 2, 4]
 *
 * const seq = tf.tensor1d([0, 3, 9, 10, 10]);
 * values = tf.tensor1d([0, 4, 10]);
 * const result2 = tf.searchSorted(seq, values, 'left');
 * result2.print(); // [0, 2, 3]
 * const result3 = tf.searchSorted(seq, values, 'right');
 * result3.print(); // [1, 2, 5]
 *
 * const sortedSequence = tf.tensor2d([[0., 3., 8., 9., 10.],
 *                                     [1., 2., 3., 4., 5.]]);
 * values = tf.tensor2d([[9.8, 2.1, 4.3],
 *                       [0.1, 6.6, 4.5, ]]);
 * const result4 = tf.searchSorted(sortedSequence, values, 'left');
 * result4.print(); // [[4, 1, 2], [0, 5, 4]]
 * ```
 * @param sortedSequence: N-D. Sorted sequence.
 * @param values: N-D. Search values.
 * @param side: 'left'|'right'. Defaults to 'left'. 'left' corresponds to lower
 *     bound and 'right' to upper bound.
 * @return An N-D int32 tensor the size of values containing the result of
 *     applying either lower bound or upper bound (depending on side) to each
 *     value. The result is not a global index to the entire Tensor, but the
 *     index in the last dimension.
 * @doc {heading: 'Operations', subheading: 'Evaluation'}
 */
function searchSorted_(sortedSequence, values, side = 'left') {
    const $sortedSequence = convertToTensor(sortedSequence, 'sortedSequence', 'searchSorted');
    const $values = convertToTensor(values, 'values', 'searchSorted');
    const sequenceSize = $sortedSequence.shape[$sortedSequence.shape.length - 1];
    const valuesSize = $values.shape[$values.shape.length - 1];
    const $sortedSequence2D = reshape($sortedSequence, [-1, sequenceSize]);
    const $values2D = reshape($values, [-1, valuesSize]);
    if ($sortedSequence2D.rank < 2) {
        throw new Error(`Sorted input argument must be at least 2-dimensional`);
    }
    if ($sortedSequence2D.shape[0] !== $values2D.shape[0]) {
        throw new Error(`Leading dimension of 'sortedSequence' and 'values' must match.`);
    }
    if (sizeFromShape($values2D.shape) >= INT32_MAX) {
        throw new Error(`values tensor size must less than ${INT32_MAX}`);
    }
    if ($sortedSequence2D.shape[1] >= INT32_MAX) {
        throw new Error(`trailing dim_size must less than ${INT32_MAX} for int32 output type, was ${$sortedSequence2D.shape[1]}`);
    }
    const inputs = {
        sortedSequence: $sortedSequence2D,
        values: $values2D,
    };
    const attrs = { side };
    return ENGINE.runKernel(SearchSorted, inputs, attrs);
}
export const searchSorted = op({ searchSorted_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoX3NvcnRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3NlYXJjaF9zb3J0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsWUFBWSxFQUF3QyxNQUFNLGlCQUFpQixDQUFDO0FBRXBGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUVuRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzNDLE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDL0IsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUVsQyxNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUM7QUFDN0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1ERztBQUNILFNBQVMsYUFBYSxDQUNsQixjQUFpQyxFQUFFLE1BQXlCLEVBQzVELE9BQXVCLE1BQU07SUFDL0IsTUFBTSxlQUFlLEdBQ2pCLGVBQWUsQ0FBQyxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDdEUsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFFbEUsTUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM3RSxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzNELE1BQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDdkUsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFFckQsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFO1FBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztLQUN6RTtJQUNELElBQUksaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDckQsTUFBTSxJQUFJLEtBQUssQ0FDWCxnRUFBZ0UsQ0FBQyxDQUFDO0tBQ3ZFO0lBQ0QsSUFBSSxhQUFhLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLFNBQVMsRUFBRTtRQUMvQyxNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0tBQ25FO0lBQ0QsSUFBSSxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxFQUFFO1FBQzNDLE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQ1osU0FBUywrQkFBK0IsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUMzRTtJQUVELE1BQU0sTUFBTSxHQUF1QjtRQUNqQyxjQUFjLEVBQUUsaUJBQWlCO1FBQ2pDLE1BQU0sRUFBRSxTQUFTO0tBQ2xCLENBQUM7SUFDRixNQUFNLEtBQUssR0FBc0IsRUFBQyxJQUFJLEVBQUMsQ0FBQztJQUV4QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLE1BQVksRUFBRSxLQUFXLENBQUMsQ0FBQztBQUNuRSxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxFQUFDLGFBQWEsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtTZWFyY2hTb3J0ZWQsIFNlYXJjaFNvcnRlZEF0dHJzLCBTZWFyY2hTb3J0ZWRJbnB1dHN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge3NpemVGcm9tU2hhcGV9IGZyb20gJy4uL3V0aWxfYmFzZSc7XG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5pbXBvcnQge3Jlc2hhcGV9IGZyb20gJy4vcmVzaGFwZSc7XG5cbmNvbnN0IElOVDMyX01BWCA9IDIxNDc0ODM2NDg7XG4vKipcbiAqIFNlYXJjaGVzIGZvciB3aGVyZSBhIHZhbHVlIHdvdWxkIGdvIGluIGEgc29ydGVkIHNlcXVlbmNlLlxuICpcbiAqIFRoaXMgaXMgbm90IGEgbWV0aG9kIGZvciBjaGVja2luZyBjb250YWlubWVudCAobGlrZSBqYXZhc2NyaXB0IGluKS5cbiAqXG4gKiBUaGUgdHlwaWNhbCB1c2UgY2FzZSBmb3IgdGhpcyBvcGVyYXRpb24gaXMgXCJiaW5uaW5nXCIsIFwiYnVja2V0aW5nXCIsIG9yXG4gKiBcImRpc2NyZXRpemluZ1wiLiBUaGUgdmFsdWVzIGFyZSBhc3NpZ25lZCB0byBidWNrZXQtaW5kaWNlcyBiYXNlZCBvbiB0aGUgZWRnZXNcbiAqIGxpc3RlZCBpbiAnc29ydGVkU2VxdWVuY2UnLiBUaGlzIG9wZXJhdGlvbiByZXR1cm5zIHRoZSBidWNrZXQtaW5kZXggZm9yIGVhY2hcbiAqIHZhbHVlLlxuICpcbiAqIFRoZSBzaWRlIGFyZ3VtZW50IGNvbnRyb2xzIHdoaWNoIGluZGV4IGlzIHJldHVybmVkIGlmIGEgdmFsdWUgbGFuZHMgZXhhY3RseVxuICogb24gYW4gZWRnZS5cbiAqXG4gKiBUaGUgYXhpcyBpcyBub3Qgc2V0dGFibGUgZm9yIHRoaXMgb3BlcmF0aW9uLiBJdCBhbHdheXMgb3BlcmF0ZXMgb24gdGhlXG4gKiBpbm5lcm1vc3QgZGltZW5zaW9uIChheGlzPS0xKS4gVGhlIG9wZXJhdGlvbiB3aWxsIGFjY2VwdCBhbnkgbnVtYmVyIG9mIG91dGVyXG4gKiBkaW1lbnNpb25zLlxuICpcbiAqIE5vdGU6IFRoaXMgb3BlcmF0aW9uIGFzc3VtZXMgdGhhdCAnc29ydGVkU2VxdWVuY2UnIGlzIHNvcnRlZCBhbG9uZyB0aGVcbiAqIGlubmVybW9zdCBheGlzLCBtYXliZSB1c2luZyAnc29ydCguLi4sIGF4aXM9LTEpJy4gSWYgdGhlIHNlcXVlbmNlIGlzIG5vdFxuICogc29ydGVkIG5vIGVycm9yIGlzIHJhaXNlZCBhbmQgdGhlIGNvbnRlbnQgb2YgdGhlIHJldHVybmVkIHRlbnNvciBpcyBub3Qgd2VsbFxuICogZGVmaW5lZC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgZWRnZXMgPSB0Zi50ZW5zb3IxZChbLTEsIDMuMywgOS4xLCAxMC4wXSk7XG4gKiBsZXQgdmFsdWVzID0gdGYudGVuc29yMWQoWzAuMCwgNC4xLCAxMi4wXSk7XG4gKiBjb25zdCByZXN1bHQxID0gdGYuc2VhcmNoU29ydGVkKGVkZ2VzLCB2YWx1ZXMsICdsZWZ0Jyk7XG4gKiByZXN1bHQxLnByaW50KCk7IC8vIFsxLCAyLCA0XVxuICpcbiAqIGNvbnN0IHNlcSA9IHRmLnRlbnNvcjFkKFswLCAzLCA5LCAxMCwgMTBdKTtcbiAqIHZhbHVlcyA9IHRmLnRlbnNvcjFkKFswLCA0LCAxMF0pO1xuICogY29uc3QgcmVzdWx0MiA9IHRmLnNlYXJjaFNvcnRlZChzZXEsIHZhbHVlcywgJ2xlZnQnKTtcbiAqIHJlc3VsdDIucHJpbnQoKTsgLy8gWzAsIDIsIDNdXG4gKiBjb25zdCByZXN1bHQzID0gdGYuc2VhcmNoU29ydGVkKHNlcSwgdmFsdWVzLCAncmlnaHQnKTtcbiAqIHJlc3VsdDMucHJpbnQoKTsgLy8gWzEsIDIsIDVdXG4gKlxuICogY29uc3Qgc29ydGVkU2VxdWVuY2UgPSB0Zi50ZW5zb3IyZChbWzAuLCAzLiwgOC4sIDkuLCAxMC5dLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWzEuLCAyLiwgMy4sIDQuLCA1Ll1dKTtcbiAqIHZhbHVlcyA9IHRmLnRlbnNvcjJkKFtbOS44LCAyLjEsIDQuM10sXG4gKiAgICAgICAgICAgICAgICAgICAgICAgWzAuMSwgNi42LCA0LjUsIF1dKTtcbiAqIGNvbnN0IHJlc3VsdDQgPSB0Zi5zZWFyY2hTb3J0ZWQoc29ydGVkU2VxdWVuY2UsIHZhbHVlcywgJ2xlZnQnKTtcbiAqIHJlc3VsdDQucHJpbnQoKTsgLy8gW1s0LCAxLCAyXSwgWzAsIDUsIDRdXVxuICogYGBgXG4gKiBAcGFyYW0gc29ydGVkU2VxdWVuY2U6IE4tRC4gU29ydGVkIHNlcXVlbmNlLlxuICogQHBhcmFtIHZhbHVlczogTi1ELiBTZWFyY2ggdmFsdWVzLlxuICogQHBhcmFtIHNpZGU6ICdsZWZ0J3wncmlnaHQnLiBEZWZhdWx0cyB0byAnbGVmdCcuICdsZWZ0JyBjb3JyZXNwb25kcyB0byBsb3dlclxuICogICAgIGJvdW5kIGFuZCAncmlnaHQnIHRvIHVwcGVyIGJvdW5kLlxuICogQHJldHVybiBBbiBOLUQgaW50MzIgdGVuc29yIHRoZSBzaXplIG9mIHZhbHVlcyBjb250YWluaW5nIHRoZSByZXN1bHQgb2ZcbiAqICAgICBhcHBseWluZyBlaXRoZXIgbG93ZXIgYm91bmQgb3IgdXBwZXIgYm91bmQgKGRlcGVuZGluZyBvbiBzaWRlKSB0byBlYWNoXG4gKiAgICAgdmFsdWUuIFRoZSByZXN1bHQgaXMgbm90IGEgZ2xvYmFsIGluZGV4IHRvIHRoZSBlbnRpcmUgVGVuc29yLCBidXQgdGhlXG4gKiAgICAgaW5kZXggaW4gdGhlIGxhc3QgZGltZW5zaW9uLlxuICogQGRvYyB7aGVhZGluZzogJ09wZXJhdGlvbnMnLCBzdWJoZWFkaW5nOiAnRXZhbHVhdGlvbid9XG4gKi9cbmZ1bmN0aW9uIHNlYXJjaFNvcnRlZF8oXG4gICAgc29ydGVkU2VxdWVuY2U6IFRlbnNvcnxUZW5zb3JMaWtlLCB2YWx1ZXM6IFRlbnNvcnxUZW5zb3JMaWtlLFxuICAgIHNpZGU6ICdsZWZ0J3wncmlnaHQnID0gJ2xlZnQnKTogVGVuc29yIHtcbiAgY29uc3QgJHNvcnRlZFNlcXVlbmNlID1cbiAgICAgIGNvbnZlcnRUb1RlbnNvcihzb3J0ZWRTZXF1ZW5jZSwgJ3NvcnRlZFNlcXVlbmNlJywgJ3NlYXJjaFNvcnRlZCcpO1xuICBjb25zdCAkdmFsdWVzID0gY29udmVydFRvVGVuc29yKHZhbHVlcywgJ3ZhbHVlcycsICdzZWFyY2hTb3J0ZWQnKTtcblxuICBjb25zdCBzZXF1ZW5jZVNpemUgPSAkc29ydGVkU2VxdWVuY2Uuc2hhcGVbJHNvcnRlZFNlcXVlbmNlLnNoYXBlLmxlbmd0aCAtIDFdO1xuICBjb25zdCB2YWx1ZXNTaXplID0gJHZhbHVlcy5zaGFwZVskdmFsdWVzLnNoYXBlLmxlbmd0aCAtIDFdO1xuICBjb25zdCAkc29ydGVkU2VxdWVuY2UyRCA9IHJlc2hhcGUoJHNvcnRlZFNlcXVlbmNlLCBbLTEsIHNlcXVlbmNlU2l6ZV0pO1xuICBjb25zdCAkdmFsdWVzMkQgPSByZXNoYXBlKCR2YWx1ZXMsIFstMSwgdmFsdWVzU2l6ZV0pO1xuXG4gIGlmICgkc29ydGVkU2VxdWVuY2UyRC5yYW5rIDwgMikge1xuICAgIHRocm93IG5ldyBFcnJvcihgU29ydGVkIGlucHV0IGFyZ3VtZW50IG11c3QgYmUgYXQgbGVhc3QgMi1kaW1lbnNpb25hbGApO1xuICB9XG4gIGlmICgkc29ydGVkU2VxdWVuY2UyRC5zaGFwZVswXSAhPT0gJHZhbHVlczJELnNoYXBlWzBdKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgTGVhZGluZyBkaW1lbnNpb24gb2YgJ3NvcnRlZFNlcXVlbmNlJyBhbmQgJ3ZhbHVlcycgbXVzdCBtYXRjaC5gKTtcbiAgfVxuICBpZiAoc2l6ZUZyb21TaGFwZSgkdmFsdWVzMkQuc2hhcGUpID49IElOVDMyX01BWCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgdmFsdWVzIHRlbnNvciBzaXplIG11c3QgbGVzcyB0aGFuICR7SU5UMzJfTUFYfWApO1xuICB9XG4gIGlmICgkc29ydGVkU2VxdWVuY2UyRC5zaGFwZVsxXSA+PSBJTlQzMl9NQVgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYHRyYWlsaW5nIGRpbV9zaXplIG11c3QgbGVzcyB0aGFuICR7XG4gICAgICAgIElOVDMyX01BWH0gZm9yIGludDMyIG91dHB1dCB0eXBlLCB3YXMgJHskc29ydGVkU2VxdWVuY2UyRC5zaGFwZVsxXX1gKTtcbiAgfVxuXG4gIGNvbnN0IGlucHV0czogU2VhcmNoU29ydGVkSW5wdXRzID0ge1xuICAgIHNvcnRlZFNlcXVlbmNlOiAkc29ydGVkU2VxdWVuY2UyRCxcbiAgICB2YWx1ZXM6ICR2YWx1ZXMyRCxcbiAgfTtcbiAgY29uc3QgYXR0cnM6IFNlYXJjaFNvcnRlZEF0dHJzID0ge3NpZGV9O1xuXG4gIHJldHVybiBFTkdJTkUucnVuS2VybmVsKFNlYXJjaFNvcnRlZCwgaW5wdXRzIGFzIHt9LCBhdHRycyBhcyB7fSk7XG59XG5cbmV4cG9ydCBjb25zdCBzZWFyY2hTb3J0ZWQgPSBvcCh7c2VhcmNoU29ydGVkX30pO1xuIl19