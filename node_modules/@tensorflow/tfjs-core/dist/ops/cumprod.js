/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import { ENGINE } from '../engine';
import { Cumprod } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Computes the cumulative product of a `tf.Tensor` along `axis`.
 *
 * ```js
 * const x = tf.tensor([1, 2, 3, 4]);
 * x.cumprod().print();
 * ```
 * ```js
 * const x = tf.tensor([[1, 2], [3, 4]]);
 * x.cumprod().print();
 * ```
 *
 * @param x The input tensor to cumulatively multiply.
 * @param axis The axis along which to multiply. Optional. Defaults to 0.
 * @param exclusive Whether to perform exclusive cumulative product. Optional.
 *     Defaults to false. If set to true then the product of each tensor entry
 *     does not include its own value, but only the values previous to it
 *     along the specified axis.
 * @param reverse Whether to multiply in the opposite direction. Optional.
 *     Defaults to false.
 *
 * @doc {heading: 'Operations', subheading: 'Scan'}
 */
function cumprod_(x, axis = 0, exclusive = false, reverse = false) {
    const $x = convertToTensor(x, 'x', 'cumprod');
    const inputs = { x: $x };
    const attrs = { axis, exclusive, reverse };
    return ENGINE.runKernel(Cumprod, inputs, attrs);
}
export const cumprod = op({ cumprod_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VtcHJvZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2N1bXByb2QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNuQyxPQUFPLEVBQUUsT0FBTyxFQUErQixNQUFNLGlCQUFpQixDQUFDO0FBSXZFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUdyRCxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRWpDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0JHO0FBQ0gsU0FBUyxRQUFRLENBQ2YsQ0FBc0IsRUFDdEIsSUFBSSxHQUFHLENBQUMsRUFDUixTQUFTLEdBQUcsS0FBSyxFQUNqQixPQUFPLEdBQUcsS0FBSztJQUVmLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRTlDLE1BQU0sTUFBTSxHQUFrQixFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUN4QyxNQUFNLEtBQUssR0FBaUIsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxDQUFDO0lBRXpELE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FDckIsT0FBTyxFQUNQLE1BQThCLEVBQzlCLEtBQTJCLENBQzVCLENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlICdMaWNlbnNlJyk7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiAnQVMgSVMnIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHsgRU5HSU5FIH0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7IEN1bXByb2QsIEN1bXByb2RBdHRycywgQ3VtcHJvZElucHV0cyB9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQgeyBOYW1lZEF0dHJNYXAgfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHsgVGVuc29yIH0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7IE5hbWVkVGVuc29yTWFwIH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7IGNvbnZlcnRUb1RlbnNvciB9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQgeyBUZW5zb3JMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQgeyBvcCB9IGZyb20gJy4vb3BlcmF0aW9uJztcblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgY3VtdWxhdGl2ZSBwcm9kdWN0IG9mIGEgYHRmLlRlbnNvcmAgYWxvbmcgYGF4aXNgLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCB4ID0gdGYudGVuc29yKFsxLCAyLCAzLCA0XSk7XG4gKiB4LmN1bXByb2QoKS5wcmludCgpO1xuICogYGBgXG4gKiBgYGBqc1xuICogY29uc3QgeCA9IHRmLnRlbnNvcihbWzEsIDJdLCBbMywgNF1dKTtcbiAqIHguY3VtcHJvZCgpLnByaW50KCk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0geCBUaGUgaW5wdXQgdGVuc29yIHRvIGN1bXVsYXRpdmVseSBtdWx0aXBseS5cbiAqIEBwYXJhbSBheGlzIFRoZSBheGlzIGFsb25nIHdoaWNoIHRvIG11bHRpcGx5LiBPcHRpb25hbC4gRGVmYXVsdHMgdG8gMC5cbiAqIEBwYXJhbSBleGNsdXNpdmUgV2hldGhlciB0byBwZXJmb3JtIGV4Y2x1c2l2ZSBjdW11bGF0aXZlIHByb2R1Y3QuIE9wdGlvbmFsLlxuICogICAgIERlZmF1bHRzIHRvIGZhbHNlLiBJZiBzZXQgdG8gdHJ1ZSB0aGVuIHRoZSBwcm9kdWN0IG9mIGVhY2ggdGVuc29yIGVudHJ5XG4gKiAgICAgZG9lcyBub3QgaW5jbHVkZSBpdHMgb3duIHZhbHVlLCBidXQgb25seSB0aGUgdmFsdWVzIHByZXZpb3VzIHRvIGl0XG4gKiAgICAgYWxvbmcgdGhlIHNwZWNpZmllZCBheGlzLlxuICogQHBhcmFtIHJldmVyc2UgV2hldGhlciB0byBtdWx0aXBseSBpbiB0aGUgb3Bwb3NpdGUgZGlyZWN0aW9uLiBPcHRpb25hbC5cbiAqICAgICBEZWZhdWx0cyB0byBmYWxzZS5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdTY2FuJ31cbiAqL1xuZnVuY3Rpb24gY3VtcHJvZF88VCBleHRlbmRzIFRlbnNvcj4oXG4gIHg6IFRlbnNvciB8IFRlbnNvckxpa2UsXG4gIGF4aXMgPSAwLFxuICBleGNsdXNpdmUgPSBmYWxzZSxcbiAgcmV2ZXJzZSA9IGZhbHNlXG4pOiBUIHtcbiAgY29uc3QgJHggPSBjb252ZXJ0VG9UZW5zb3IoeCwgJ3gnLCAnY3VtcHJvZCcpO1xuXG4gIGNvbnN0IGlucHV0czogQ3VtcHJvZElucHV0cyA9IHsgeDogJHggfTtcbiAgY29uc3QgYXR0cnM6IEN1bXByb2RBdHRycyA9IHsgYXhpcywgZXhjbHVzaXZlLCByZXZlcnNlIH07XG5cbiAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoXG4gICAgQ3VtcHJvZCxcbiAgICBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXAsXG4gICAgYXR0cnMgYXMge30gYXMgTmFtZWRBdHRyTWFwXG4gICk7XG59XG5cbmV4cG9ydCBjb25zdCBjdW1wcm9kID0gb3AoeyBjdW1wcm9kXyB9KTtcbiJdfQ==