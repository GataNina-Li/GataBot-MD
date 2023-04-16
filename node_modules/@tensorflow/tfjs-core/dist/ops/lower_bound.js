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
import { searchSorted } from './search_sorted';
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
 * The index returned corresponds to the first edge greater than or equal to the
 * value.
 *
 * The axis is not settable for this operation. It always operates on the
 * innermost dimension (axis=-1). The operation will accept any number of outer
 * dimensions.
 *
 * Note: This operation assumes that 'lowerBound' is sorted along the
 * innermost axis, maybe using 'sort(..., axis=-1)'. If the sequence is not
 * sorted no error is raised and the content of the returned tensor is not well
 * defined.
 *
 * ```js
 * const edges = tf.tensor1d([-1, 3.3, 9.1, 10.0]);
 * let values = tf.tensor1d([0.0, 4.1, 12.0]);
 * const result1 = tf.lowerBound(edges, values);
 * result1.print(); // [1, 2, 4]
 *
 * const seq = tf.tensor1d([0, 3, 9, 10, 10]);
 * values = tf.tensor1d([0, 4, 10]);
 * const result2 = tf.lowerBound(seq, values);
 * result2.print(); // [0, 2, 3]
 *
 * const sortedSequence = tf.tensor2d([[0., 3., 8., 9., 10.],
 *                                     [1., 2., 3., 4., 5.]]);
 * values = tf.tensor2d([[9.8, 2.1, 4.3],
 *                       [0.1, 6.6, 4.5, ]]);
 * const result3 = tf.lowerBound(sortedSequence, values);
 * result3.print(); // [[4, 1, 2], [0, 5, 4]]
 * ```
 * @param sortedSequence: N-D. Sorted sequence.
 * @param values: N-D. Search values.
 * @return An N-D int32 tensor the size of values containing the result of
 *     applying lower bound to each value. The result is not a global index to
 *     the entire Tensor, but the index in the last dimension.
 * @doc {heading: 'Operations', subheading: 'Evaluation'}
 */
export function lowerBound(sortedSequence, values) {
    return searchSorted(sortedSequence, values, 'left');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG93ZXJfYm91bmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9sb3dlcl9ib3VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFJSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFN0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4Q0c7QUFDSCxNQUFNLFVBQVUsVUFBVSxDQUN0QixjQUFpQyxFQUFFLE1BQXlCO0lBQzlELE9BQU8sWUFBWSxDQUFDLGNBQWMsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIyIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7c2VhcmNoU29ydGVkfSBmcm9tICcuL3NlYXJjaF9zb3J0ZWQnO1xuXG4vKipcbiAqIFNlYXJjaGVzIGZvciB3aGVyZSBhIHZhbHVlIHdvdWxkIGdvIGluIGEgc29ydGVkIHNlcXVlbmNlLlxuICpcbiAqIFRoaXMgaXMgbm90IGEgbWV0aG9kIGZvciBjaGVja2luZyBjb250YWlubWVudCAobGlrZSBqYXZhc2NyaXB0IGluKS5cbiAqXG4gKiBUaGUgdHlwaWNhbCB1c2UgY2FzZSBmb3IgdGhpcyBvcGVyYXRpb24gaXMgXCJiaW5uaW5nXCIsIFwiYnVja2V0aW5nXCIsIG9yXG4gKiBcImRpc2NyZXRpemluZ1wiLiBUaGUgdmFsdWVzIGFyZSBhc3NpZ25lZCB0byBidWNrZXQtaW5kaWNlcyBiYXNlZCBvbiB0aGUgZWRnZXNcbiAqIGxpc3RlZCBpbiAnc29ydGVkU2VxdWVuY2UnLiBUaGlzIG9wZXJhdGlvbiByZXR1cm5zIHRoZSBidWNrZXQtaW5kZXggZm9yIGVhY2hcbiAqIHZhbHVlLlxuICpcbiAqIFRoZSBpbmRleCByZXR1cm5lZCBjb3JyZXNwb25kcyB0byB0aGUgZmlyc3QgZWRnZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlXG4gKiB2YWx1ZS5cbiAqXG4gKiBUaGUgYXhpcyBpcyBub3Qgc2V0dGFibGUgZm9yIHRoaXMgb3BlcmF0aW9uLiBJdCBhbHdheXMgb3BlcmF0ZXMgb24gdGhlXG4gKiBpbm5lcm1vc3QgZGltZW5zaW9uIChheGlzPS0xKS4gVGhlIG9wZXJhdGlvbiB3aWxsIGFjY2VwdCBhbnkgbnVtYmVyIG9mIG91dGVyXG4gKiBkaW1lbnNpb25zLlxuICpcbiAqIE5vdGU6IFRoaXMgb3BlcmF0aW9uIGFzc3VtZXMgdGhhdCAnbG93ZXJCb3VuZCcgaXMgc29ydGVkIGFsb25nIHRoZVxuICogaW5uZXJtb3N0IGF4aXMsIG1heWJlIHVzaW5nICdzb3J0KC4uLiwgYXhpcz0tMSknLiBJZiB0aGUgc2VxdWVuY2UgaXMgbm90XG4gKiBzb3J0ZWQgbm8gZXJyb3IgaXMgcmFpc2VkIGFuZCB0aGUgY29udGVudCBvZiB0aGUgcmV0dXJuZWQgdGVuc29yIGlzIG5vdCB3ZWxsXG4gKiBkZWZpbmVkLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBlZGdlcyA9IHRmLnRlbnNvcjFkKFstMSwgMy4zLCA5LjEsIDEwLjBdKTtcbiAqIGxldCB2YWx1ZXMgPSB0Zi50ZW5zb3IxZChbMC4wLCA0LjEsIDEyLjBdKTtcbiAqIGNvbnN0IHJlc3VsdDEgPSB0Zi5sb3dlckJvdW5kKGVkZ2VzLCB2YWx1ZXMpO1xuICogcmVzdWx0MS5wcmludCgpOyAvLyBbMSwgMiwgNF1cbiAqXG4gKiBjb25zdCBzZXEgPSB0Zi50ZW5zb3IxZChbMCwgMywgOSwgMTAsIDEwXSk7XG4gKiB2YWx1ZXMgPSB0Zi50ZW5zb3IxZChbMCwgNCwgMTBdKTtcbiAqIGNvbnN0IHJlc3VsdDIgPSB0Zi5sb3dlckJvdW5kKHNlcSwgdmFsdWVzKTtcbiAqIHJlc3VsdDIucHJpbnQoKTsgLy8gWzAsIDIsIDNdXG4gKlxuICogY29uc3Qgc29ydGVkU2VxdWVuY2UgPSB0Zi50ZW5zb3IyZChbWzAuLCAzLiwgOC4sIDkuLCAxMC5dLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWzEuLCAyLiwgMy4sIDQuLCA1Ll1dKTtcbiAqIHZhbHVlcyA9IHRmLnRlbnNvcjJkKFtbOS44LCAyLjEsIDQuM10sXG4gKiAgICAgICAgICAgICAgICAgICAgICAgWzAuMSwgNi42LCA0LjUsIF1dKTtcbiAqIGNvbnN0IHJlc3VsdDMgPSB0Zi5sb3dlckJvdW5kKHNvcnRlZFNlcXVlbmNlLCB2YWx1ZXMpO1xuICogcmVzdWx0My5wcmludCgpOyAvLyBbWzQsIDEsIDJdLCBbMCwgNSwgNF1dXG4gKiBgYGBcbiAqIEBwYXJhbSBzb3J0ZWRTZXF1ZW5jZTogTi1ELiBTb3J0ZWQgc2VxdWVuY2UuXG4gKiBAcGFyYW0gdmFsdWVzOiBOLUQuIFNlYXJjaCB2YWx1ZXMuXG4gKiBAcmV0dXJuIEFuIE4tRCBpbnQzMiB0ZW5zb3IgdGhlIHNpemUgb2YgdmFsdWVzIGNvbnRhaW5pbmcgdGhlIHJlc3VsdCBvZlxuICogICAgIGFwcGx5aW5nIGxvd2VyIGJvdW5kIHRvIGVhY2ggdmFsdWUuIFRoZSByZXN1bHQgaXMgbm90IGEgZ2xvYmFsIGluZGV4IHRvXG4gKiAgICAgdGhlIGVudGlyZSBUZW5zb3IsIGJ1dCB0aGUgaW5kZXggaW4gdGhlIGxhc3QgZGltZW5zaW9uLlxuICogQGRvYyB7aGVhZGluZzogJ09wZXJhdGlvbnMnLCBzdWJoZWFkaW5nOiAnRXZhbHVhdGlvbid9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb3dlckJvdW5kKFxuICAgIHNvcnRlZFNlcXVlbmNlOiBUZW5zb3J8VGVuc29yTGlrZSwgdmFsdWVzOiBUZW5zb3J8VGVuc29yTGlrZSk6IFRlbnNvciB7XG4gIHJldHVybiBzZWFyY2hTb3J0ZWQoc29ydGVkU2VxdWVuY2UsIHZhbHVlcywgJ2xlZnQnKTtcbn1cbiJdfQ==