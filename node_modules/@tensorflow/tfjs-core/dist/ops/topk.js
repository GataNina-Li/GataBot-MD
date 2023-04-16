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
import { ENGINE } from '../engine';
import { TopK } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Finds the values and indices of the `k` largest entries along the last
 * dimension.
 *
 * If the input is a vector (rank=1), finds the k largest entries in the vector
 * and outputs their values and indices as vectors. Thus values[j] is the j-th
 * largest entry in input, and its index is indices[j].
 * For higher rank inputs, computes the top k entries along the last dimension.
 *
 * If two elements are equal, the lower-index element appears first.
 *
 * ```js
 * const a = tf.tensor2d([[1, 5], [4, 3]]);
 * const {values, indices} = tf.topk(a);
 * values.print();
 * indices.print();
 * ```
 * @param x 1-D or higher `tf.Tensor` with last dimension being at least `k`.
 * @param k Number of top elements to look for along the last dimension.
 * @param sorted If true, the resulting `k` elements will be sorted by the
 *     values in descending order.
 *
 * @doc {heading: 'Operations', subheading: 'Evaluation'}
 */
function topk_(x, k = 1, sorted = true) {
    const $x = convertToTensor(x, 'x', 'topk');
    if ($x.rank === 0) {
        throw new Error('topk() expects the input to be of rank 1 or higher');
    }
    const lastDim = $x.shape[$x.shape.length - 1];
    if (k < 0) {
        throw new Error(`'k' passed to topk() must be >= 0 but got ${k}`);
    }
    if (k > lastDim) {
        throw new Error(`'k' passed to topk() must be <= the last dimension (${lastDim}) ` +
            `but got ${k}`);
    }
    const inputs = { x: $x };
    const attrs = { k, sorted };
    const [values, indices] = ENGINE.runKernel(TopK, inputs, attrs);
    return { values, indices };
}
export const topk = op({ topk_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9way5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3RvcGsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsSUFBSSxFQUF3QixNQUFNLGlCQUFpQixDQUFDO0FBSTVELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUduRCxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRS9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCRztBQUNILFNBQVMsS0FBSyxDQUNWLENBQWUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxJQUFJO0lBQ3ZDLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNDLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7UUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO0tBQ3ZFO0lBQ0QsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUU5QyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDVCxNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ25FO0lBRUQsSUFBSSxDQUFDLEdBQUcsT0FBTyxFQUFFO1FBQ2YsTUFBTSxJQUFJLEtBQUssQ0FDWCx1REFBdUQsT0FBTyxJQUFJO1lBQ2xFLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNyQjtJQUVELE1BQU0sTUFBTSxHQUFlLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBQyxDQUFDO0lBQ25DLE1BQU0sS0FBSyxHQUFjLEVBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBQyxDQUFDO0lBRXJDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FDdEMsSUFBSSxFQUFFLE1BQThCLEVBQUUsS0FBMkIsQ0FBQyxDQUFDO0lBRXZFLE9BQU8sRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUE0QixDQUFDO0FBQ3RELENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLEVBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge1RvcEssIFRvcEtBdHRycywgVG9wS0lucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7TmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcblxuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuXG4vKipcbiAqIEZpbmRzIHRoZSB2YWx1ZXMgYW5kIGluZGljZXMgb2YgdGhlIGBrYCBsYXJnZXN0IGVudHJpZXMgYWxvbmcgdGhlIGxhc3RcbiAqIGRpbWVuc2lvbi5cbiAqXG4gKiBJZiB0aGUgaW5wdXQgaXMgYSB2ZWN0b3IgKHJhbms9MSksIGZpbmRzIHRoZSBrIGxhcmdlc3QgZW50cmllcyBpbiB0aGUgdmVjdG9yXG4gKiBhbmQgb3V0cHV0cyB0aGVpciB2YWx1ZXMgYW5kIGluZGljZXMgYXMgdmVjdG9ycy4gVGh1cyB2YWx1ZXNbal0gaXMgdGhlIGotdGhcbiAqIGxhcmdlc3QgZW50cnkgaW4gaW5wdXQsIGFuZCBpdHMgaW5kZXggaXMgaW5kaWNlc1tqXS5cbiAqIEZvciBoaWdoZXIgcmFuayBpbnB1dHMsIGNvbXB1dGVzIHRoZSB0b3AgayBlbnRyaWVzIGFsb25nIHRoZSBsYXN0IGRpbWVuc2lvbi5cbiAqXG4gKiBJZiB0d28gZWxlbWVudHMgYXJlIGVxdWFsLCB0aGUgbG93ZXItaW5kZXggZWxlbWVudCBhcHBlYXJzIGZpcnN0LlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBhID0gdGYudGVuc29yMmQoW1sxLCA1XSwgWzQsIDNdXSk7XG4gKiBjb25zdCB7dmFsdWVzLCBpbmRpY2VzfSA9IHRmLnRvcGsoYSk7XG4gKiB2YWx1ZXMucHJpbnQoKTtcbiAqIGluZGljZXMucHJpbnQoKTtcbiAqIGBgYFxuICogQHBhcmFtIHggMS1EIG9yIGhpZ2hlciBgdGYuVGVuc29yYCB3aXRoIGxhc3QgZGltZW5zaW9uIGJlaW5nIGF0IGxlYXN0IGBrYC5cbiAqIEBwYXJhbSBrIE51bWJlciBvZiB0b3AgZWxlbWVudHMgdG8gbG9vayBmb3IgYWxvbmcgdGhlIGxhc3QgZGltZW5zaW9uLlxuICogQHBhcmFtIHNvcnRlZCBJZiB0cnVlLCB0aGUgcmVzdWx0aW5nIGBrYCBlbGVtZW50cyB3aWxsIGJlIHNvcnRlZCBieSB0aGVcbiAqICAgICB2YWx1ZXMgaW4gZGVzY2VuZGluZyBvcmRlci5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdFdmFsdWF0aW9uJ31cbiAqL1xuZnVuY3Rpb24gdG9wa188VCBleHRlbmRzIFRlbnNvcj4oXG4gICAgeDogVHxUZW5zb3JMaWtlLCBrID0gMSwgc29ydGVkID0gdHJ1ZSk6IHt2YWx1ZXM6IFQsIGluZGljZXM6IFR9IHtcbiAgY29uc3QgJHggPSBjb252ZXJ0VG9UZW5zb3IoeCwgJ3gnLCAndG9waycpO1xuICBpZiAoJHgucmFuayA9PT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndG9waygpIGV4cGVjdHMgdGhlIGlucHV0IHRvIGJlIG9mIHJhbmsgMSBvciBoaWdoZXInKTtcbiAgfVxuICBjb25zdCBsYXN0RGltID0gJHguc2hhcGVbJHguc2hhcGUubGVuZ3RoIC0gMV07XG5cbiAgaWYgKGsgPCAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAnaycgcGFzc2VkIHRvIHRvcGsoKSBtdXN0IGJlID49IDAgYnV0IGdvdCAke2t9YCk7XG4gIH1cblxuICBpZiAoayA+IGxhc3REaW0pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGAnaycgcGFzc2VkIHRvIHRvcGsoKSBtdXN0IGJlIDw9IHRoZSBsYXN0IGRpbWVuc2lvbiAoJHtsYXN0RGltfSkgYCArXG4gICAgICAgIGBidXQgZ290ICR7a31gKTtcbiAgfVxuXG4gIGNvbnN0IGlucHV0czogVG9wS0lucHV0cyA9IHt4OiAkeH07XG4gIGNvbnN0IGF0dHJzOiBUb3BLQXR0cnMgPSB7aywgc29ydGVkfTtcblxuICBjb25zdCBbdmFsdWVzLCBpbmRpY2VzXSA9IEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICBUb3BLLCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXAsIGF0dHJzIGFzIHt9IGFzIE5hbWVkQXR0ck1hcCk7XG5cbiAgcmV0dXJuIHt2YWx1ZXMsIGluZGljZXN9IGFzIHt2YWx1ZXM6IFQsIGluZGljZXM6IFR9O1xufVxuXG5leHBvcnQgY29uc3QgdG9wayA9IG9wKHt0b3BrX30pO1xuIl19