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
import { Reverse } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Reverses a `tf.Tensor` along a specified axis.
 *
 * Also available are stricter rank-specific methods that assert that `x` is
 * of the given rank:
 *   - `tf.reverse1d`
 *   - `tf.reverse2d`
 *   - `tf.reverse3d`
 *   - `tf.reverse4d`
 *
 * Except `tf.reverse1d` (which does not have axis param), all methods have
 * same signature as this method.
 *
 * ```js
 * const x = tf.tensor1d([1, 2, 3, 4]);
 *
 * x.reverse().print();
 * ```
 *
 * ```js
 * const x = tf.tensor2d([1, 2, 3, 4], [2, 2]);
 *
 * const axis = 1;
 * x.reverse(axis).print();
 * ```
 * @param x The input tensor to be reversed.
 * @param axis The set of dimensions to reverse. Must be in the
 *     range [-rank(x), rank(x)). Defaults to all axes.
 *
 * @doc {heading: 'Tensors', subheading: 'Slicing and Joining'}
 */
function reverse_(x, axis) {
    const $x = convertToTensor(x, 'x', 'reverse');
    const inputs = { x: $x };
    const attrs = { dims: axis };
    return ENGINE.runKernel(Reverse, inputs, attrs);
}
export const reverse = op({ reverse_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV2ZXJzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3JldmVyc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsT0FBTyxFQUE4QixNQUFNLGlCQUFpQixDQUFDO0FBSXJFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUduRCxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRS9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4Qkc7QUFDSCxTQUFTLFFBQVEsQ0FDYixDQUFlLEVBQUUsSUFBc0I7SUFDekMsTUFBTSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFFOUMsTUFBTSxNQUFNLEdBQWtCLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBQyxDQUFDO0lBQ3RDLE1BQU0sS0FBSyxHQUFpQixFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQztJQUV6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQ25CLE9BQU8sRUFBRSxNQUE4QixFQUFFLEtBQTJCLENBQUMsQ0FBQztBQUM1RSxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxFQUFDLFFBQVEsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtSZXZlcnNlLCBSZXZlcnNlQXR0cnMsIFJldmVyc2VJbnB1dHN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge05hbWVkQXR0ck1hcH0gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcblxuLyoqXG4gKiBSZXZlcnNlcyBhIGB0Zi5UZW5zb3JgIGFsb25nIGEgc3BlY2lmaWVkIGF4aXMuXG4gKlxuICogQWxzbyBhdmFpbGFibGUgYXJlIHN0cmljdGVyIHJhbmstc3BlY2lmaWMgbWV0aG9kcyB0aGF0IGFzc2VydCB0aGF0IGB4YCBpc1xuICogb2YgdGhlIGdpdmVuIHJhbms6XG4gKiAgIC0gYHRmLnJldmVyc2UxZGBcbiAqICAgLSBgdGYucmV2ZXJzZTJkYFxuICogICAtIGB0Zi5yZXZlcnNlM2RgXG4gKiAgIC0gYHRmLnJldmVyc2U0ZGBcbiAqXG4gKiBFeGNlcHQgYHRmLnJldmVyc2UxZGAgKHdoaWNoIGRvZXMgbm90IGhhdmUgYXhpcyBwYXJhbSksIGFsbCBtZXRob2RzIGhhdmVcbiAqIHNhbWUgc2lnbmF0dXJlIGFzIHRoaXMgbWV0aG9kLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCB4ID0gdGYudGVuc29yMWQoWzEsIDIsIDMsIDRdKTtcbiAqXG4gKiB4LnJldmVyc2UoKS5wcmludCgpO1xuICogYGBgXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHggPSB0Zi50ZW5zb3IyZChbMSwgMiwgMywgNF0sIFsyLCAyXSk7XG4gKlxuICogY29uc3QgYXhpcyA9IDE7XG4gKiB4LnJldmVyc2UoYXhpcykucHJpbnQoKTtcbiAqIGBgYFxuICogQHBhcmFtIHggVGhlIGlucHV0IHRlbnNvciB0byBiZSByZXZlcnNlZC5cbiAqIEBwYXJhbSBheGlzIFRoZSBzZXQgb2YgZGltZW5zaW9ucyB0byByZXZlcnNlLiBNdXN0IGJlIGluIHRoZVxuICogICAgIHJhbmdlIFstcmFuayh4KSwgcmFuayh4KSkuIERlZmF1bHRzIHRvIGFsbCBheGVzLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdUZW5zb3JzJywgc3ViaGVhZGluZzogJ1NsaWNpbmcgYW5kIEpvaW5pbmcnfVxuICovXG5mdW5jdGlvbiByZXZlcnNlXzxUIGV4dGVuZHMgVGVuc29yPihcbiAgICB4OiBUfFRlbnNvckxpa2UsIGF4aXM/OiBudW1iZXJ8bnVtYmVyW10pOiBUIHtcbiAgY29uc3QgJHggPSBjb252ZXJ0VG9UZW5zb3IoeCwgJ3gnLCAncmV2ZXJzZScpO1xuXG4gIGNvbnN0IGlucHV0czogUmV2ZXJzZUlucHV0cyA9IHt4OiAkeH07XG4gIGNvbnN0IGF0dHJzOiBSZXZlcnNlQXR0cnMgPSB7ZGltczogYXhpc307XG5cbiAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICBSZXZlcnNlLCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXAsIGF0dHJzIGFzIHt9IGFzIE5hbWVkQXR0ck1hcCk7XG59XG5cbmV4cG9ydCBjb25zdCByZXZlcnNlID0gb3Aoe3JldmVyc2VffSk7XG4iXX0=