/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
import { Unique } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { assert } from '../util';
import { op } from './operation';
/**
 * Finds unique elements along an axis of a tensor.
 *
 * It returns a tensor `values` containing all of the unique elements along the
 * `axis` of the given tensor `x` in the same order that they occur along the
 * `axis` in `x`; `x` does not need to be sorted. It also returns a tensor
 * `indices` the same size as the number of the elements in `x` along the `axis`
 * dimension. It contains the index in the unique output `values`.
 *
 * ```js
 * // A 1-D tensor
 * const a = tf.tensor1d([1, 1, 2, 4, 4, 4, 7, 8, 8]);
 * const {values, indices} = tf.unique(a);
 * values.print();   // [1, 2, 4, 7, 8,]
 * indices.print();  // [0, 0, 1, 2, 2, 2, 3, 4, 4]
 * ```
 *
 * ```js
 * // A 2-D tensor with axis=0
 * //
 * // 'a' is: [[1, 0, 0],
 * //          [1, 0, 0],
 * //          [2, 0, 0]]
 * const a = tf.tensor2d([[1, 0, 0], [1, 0, 0], [2, 0, 0]]);
 * const {values, indices} = tf.unique(a, 0)
 * values.print();   // [[1, 0, 0],
 *                   //  [2, 0, 0]]
 * indices.print();  // [0, 0, 1]
 * ```
 *
 * ```js
 * // A 2-D tensor with axis=1
 * //
 * // 'a' is: [[1, 0, 0],
 * //          [1, 0, 0],
 * //          [2, 0, 0]]
 * const a = tf.tensor2d([[1, 0, 0], [1, 0, 0], [2, 0, 0]]);
 * const {values, indices} = tf.unique(a, 1)
 * values.print();   // [[1, 0],
 *                   //  [1, 0],
 *                   //  [2, 0]]
 * indices.print();  // [0, 1, 1]
 * ```
 * @param x A tensor (int32, string, bool).
 * @param axis The axis of the tensor to find the unique elements.
 * @returns [uniqueElements, indices] (see above for details)
 *
 * @doc {heading: 'Operations', subheading: 'Evaluation'}
 */
function unique_(x, axis = 0) {
    const $x = convertToTensor(x, 'x', 'unique', 'string_or_numeric');
    assert($x.rank > 0, () => 'The input tensor must be at least 1D');
    const inputs = { x: $x };
    const attrs = { axis };
    const [values, indices] = ENGINE.runKernel(Unique, inputs, attrs);
    return { values, indices };
}
export const unique = op({ unique_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pcXVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvdW5pcXVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLE1BQU0sRUFBNEIsTUFBTSxpQkFBaUIsQ0FBQztBQUlsRSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFbkQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUUvQixPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRS9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnREc7QUFDSCxTQUFTLE9BQU8sQ0FDWixDQUFlLEVBQUUsSUFBSSxHQUFHLENBQUM7SUFDM0IsTUFBTSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFDbEUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7SUFFbEUsTUFBTSxNQUFNLEdBQWlCLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBQyxDQUFDO0lBQ3JDLE1BQU0sS0FBSyxHQUFnQixFQUFDLElBQUksRUFBQyxDQUFDO0lBQ2xDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FDWixNQUFNLEVBQUUsTUFBOEIsRUFDdEMsS0FBMkIsQ0FBa0IsQ0FBQztJQUM1RSxPQUFPLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBQyxDQUFDO0FBQzNCLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge1VuaXF1ZSwgVW5pcXVlQXR0cnMsIFVuaXF1ZUlucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7TmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtUZW5zb3IsIFRlbnNvcjFEfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcblxuLyoqXG4gKiBGaW5kcyB1bmlxdWUgZWxlbWVudHMgYWxvbmcgYW4gYXhpcyBvZiBhIHRlbnNvci5cbiAqXG4gKiBJdCByZXR1cm5zIGEgdGVuc29yIGB2YWx1ZXNgIGNvbnRhaW5pbmcgYWxsIG9mIHRoZSB1bmlxdWUgZWxlbWVudHMgYWxvbmcgdGhlXG4gKiBgYXhpc2Agb2YgdGhlIGdpdmVuIHRlbnNvciBgeGAgaW4gdGhlIHNhbWUgb3JkZXIgdGhhdCB0aGV5IG9jY3VyIGFsb25nIHRoZVxuICogYGF4aXNgIGluIGB4YDsgYHhgIGRvZXMgbm90IG5lZWQgdG8gYmUgc29ydGVkLiBJdCBhbHNvIHJldHVybnMgYSB0ZW5zb3JcbiAqIGBpbmRpY2VzYCB0aGUgc2FtZSBzaXplIGFzIHRoZSBudW1iZXIgb2YgdGhlIGVsZW1lbnRzIGluIGB4YCBhbG9uZyB0aGUgYGF4aXNgXG4gKiBkaW1lbnNpb24uIEl0IGNvbnRhaW5zIHRoZSBpbmRleCBpbiB0aGUgdW5pcXVlIG91dHB1dCBgdmFsdWVzYC5cbiAqXG4gKiBgYGBqc1xuICogLy8gQSAxLUQgdGVuc29yXG4gKiBjb25zdCBhID0gdGYudGVuc29yMWQoWzEsIDEsIDIsIDQsIDQsIDQsIDcsIDgsIDhdKTtcbiAqIGNvbnN0IHt2YWx1ZXMsIGluZGljZXN9ID0gdGYudW5pcXVlKGEpO1xuICogdmFsdWVzLnByaW50KCk7ICAgLy8gWzEsIDIsIDQsIDcsIDgsXVxuICogaW5kaWNlcy5wcmludCgpOyAgLy8gWzAsIDAsIDEsIDIsIDIsIDIsIDMsIDQsIDRdXG4gKiBgYGBcbiAqXG4gKiBgYGBqc1xuICogLy8gQSAyLUQgdGVuc29yIHdpdGggYXhpcz0wXG4gKiAvL1xuICogLy8gJ2EnIGlzOiBbWzEsIDAsIDBdLFxuICogLy8gICAgICAgICAgWzEsIDAsIDBdLFxuICogLy8gICAgICAgICAgWzIsIDAsIDBdXVxuICogY29uc3QgYSA9IHRmLnRlbnNvcjJkKFtbMSwgMCwgMF0sIFsxLCAwLCAwXSwgWzIsIDAsIDBdXSk7XG4gKiBjb25zdCB7dmFsdWVzLCBpbmRpY2VzfSA9IHRmLnVuaXF1ZShhLCAwKVxuICogdmFsdWVzLnByaW50KCk7ICAgLy8gW1sxLCAwLCAwXSxcbiAqICAgICAgICAgICAgICAgICAgIC8vICBbMiwgMCwgMF1dXG4gKiBpbmRpY2VzLnByaW50KCk7ICAvLyBbMCwgMCwgMV1cbiAqIGBgYFxuICpcbiAqIGBgYGpzXG4gKiAvLyBBIDItRCB0ZW5zb3Igd2l0aCBheGlzPTFcbiAqIC8vXG4gKiAvLyAnYScgaXM6IFtbMSwgMCwgMF0sXG4gKiAvLyAgICAgICAgICBbMSwgMCwgMF0sXG4gKiAvLyAgICAgICAgICBbMiwgMCwgMF1dXG4gKiBjb25zdCBhID0gdGYudGVuc29yMmQoW1sxLCAwLCAwXSwgWzEsIDAsIDBdLCBbMiwgMCwgMF1dKTtcbiAqIGNvbnN0IHt2YWx1ZXMsIGluZGljZXN9ID0gdGYudW5pcXVlKGEsIDEpXG4gKiB2YWx1ZXMucHJpbnQoKTsgICAvLyBbWzEsIDBdLFxuICogICAgICAgICAgICAgICAgICAgLy8gIFsxLCAwXSxcbiAqICAgICAgICAgICAgICAgICAgIC8vICBbMiwgMF1dXG4gKiBpbmRpY2VzLnByaW50KCk7ICAvLyBbMCwgMSwgMV1cbiAqIGBgYFxuICogQHBhcmFtIHggQSB0ZW5zb3IgKGludDMyLCBzdHJpbmcsIGJvb2wpLlxuICogQHBhcmFtIGF4aXMgVGhlIGF4aXMgb2YgdGhlIHRlbnNvciB0byBmaW5kIHRoZSB1bmlxdWUgZWxlbWVudHMuXG4gKiBAcmV0dXJucyBbdW5pcXVlRWxlbWVudHMsIGluZGljZXNdIChzZWUgYWJvdmUgZm9yIGRldGFpbHMpXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ09wZXJhdGlvbnMnLCBzdWJoZWFkaW5nOiAnRXZhbHVhdGlvbid9XG4gKi9cbmZ1bmN0aW9uIHVuaXF1ZV88VCBleHRlbmRzIFRlbnNvcj4oXG4gICAgeDogVHxUZW5zb3JMaWtlLCBheGlzID0gMCk6IHt2YWx1ZXM6IFQsIGluZGljZXM6IFRlbnNvcjFEfSB7XG4gIGNvbnN0ICR4ID0gY29udmVydFRvVGVuc29yKHgsICd4JywgJ3VuaXF1ZScsICdzdHJpbmdfb3JfbnVtZXJpYycpO1xuICBhc3NlcnQoJHgucmFuayA+IDAsICgpID0+ICdUaGUgaW5wdXQgdGVuc29yIG11c3QgYmUgYXQgbGVhc3QgMUQnKTtcblxuICBjb25zdCBpbnB1dHM6IFVuaXF1ZUlucHV0cyA9IHt4OiAkeH07XG4gIGNvbnN0IGF0dHJzOiBVbmlxdWVBdHRycyA9IHtheGlzfTtcbiAgY29uc3QgW3ZhbHVlcywgaW5kaWNlc10gPSBFTkdJTkUucnVuS2VybmVsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBVbmlxdWUsIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMgYXMge30gYXMgTmFtZWRBdHRyTWFwKSBhcyBbVCwgVGVuc29yMURdO1xuICByZXR1cm4ge3ZhbHVlcywgaW5kaWNlc307XG59XG5cbmV4cG9ydCBjb25zdCB1bmlxdWUgPSBvcCh7dW5pcXVlX30pO1xuIl19