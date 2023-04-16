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
import { Cumsum } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Computes the cumulative sum of a `tf.Tensor` along `axis`.
 *
 * ```js
 * const x = tf.tensor([1, 2, 3, 4]);
 * x.cumsum().print();
 * ```
 * ```js
 * const x = tf.tensor([[1, 2], [3, 4]]);
 * x.cumsum().print();
 * ```
 *
 * @param x The input tensor to be summed.
 * @param axis The axis along which to sum. Optional. Defaults to 0.
 * @param exclusive Whether to perform exclusive cumulative sum. Optional.
 *     Defaults to false. If set to true then the sum of each tensor entry
 *     does not include its own value, but only the values previous to it
 *     along the specified axis.
 * @param reverse Whether to sum in the opposite direction. Optional.
 *     Defaults to false.
 *
 * @doc {heading: 'Operations', subheading: 'Scan'}
 */
function cumsum_(x, axis = 0, exclusive = false, reverse = false) {
    const $x = convertToTensor(x, 'x', 'cumsum');
    const inputs = { x: $x };
    const attrs = { axis, exclusive, reverse };
    return ENGINE.runKernel(Cumsum, inputs, attrs);
}
export const cumsum = op({ cumsum_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3Vtc3VtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvY3Vtc3VtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLE1BQU0sRUFBNEIsTUFBTSxpQkFBaUIsQ0FBQztBQUlsRSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHbkQsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCRztBQUNILFNBQVMsT0FBTyxDQUNaLENBQW9CLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsS0FBSyxFQUFFLE9BQU8sR0FBRyxLQUFLO0lBQ3BFLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRTdDLE1BQU0sTUFBTSxHQUFpQixFQUFDLENBQUMsRUFBRSxFQUFFLEVBQUMsQ0FBQztJQUNyQyxNQUFNLEtBQUssR0FBZ0IsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBQyxDQUFDO0lBRXRELE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FDbkIsTUFBTSxFQUFFLE1BQThCLEVBQUUsS0FBMkIsQ0FBQyxDQUFDO0FBQzNFLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge0N1bXN1bSwgQ3Vtc3VtQXR0cnMsIEN1bXN1bUlucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7TmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcblxuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuXG4vKipcbiAqIENvbXB1dGVzIHRoZSBjdW11bGF0aXZlIHN1bSBvZiBhIGB0Zi5UZW5zb3JgIGFsb25nIGBheGlzYC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgeCA9IHRmLnRlbnNvcihbMSwgMiwgMywgNF0pO1xuICogeC5jdW1zdW0oKS5wcmludCgpO1xuICogYGBgXG4gKiBgYGBqc1xuICogY29uc3QgeCA9IHRmLnRlbnNvcihbWzEsIDJdLCBbMywgNF1dKTtcbiAqIHguY3Vtc3VtKCkucHJpbnQoKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB4IFRoZSBpbnB1dCB0ZW5zb3IgdG8gYmUgc3VtbWVkLlxuICogQHBhcmFtIGF4aXMgVGhlIGF4aXMgYWxvbmcgd2hpY2ggdG8gc3VtLiBPcHRpb25hbC4gRGVmYXVsdHMgdG8gMC5cbiAqIEBwYXJhbSBleGNsdXNpdmUgV2hldGhlciB0byBwZXJmb3JtIGV4Y2x1c2l2ZSBjdW11bGF0aXZlIHN1bS4gT3B0aW9uYWwuXG4gKiAgICAgRGVmYXVsdHMgdG8gZmFsc2UuIElmIHNldCB0byB0cnVlIHRoZW4gdGhlIHN1bSBvZiBlYWNoIHRlbnNvciBlbnRyeVxuICogICAgIGRvZXMgbm90IGluY2x1ZGUgaXRzIG93biB2YWx1ZSwgYnV0IG9ubHkgdGhlIHZhbHVlcyBwcmV2aW91cyB0byBpdFxuICogICAgIGFsb25nIHRoZSBzcGVjaWZpZWQgYXhpcy5cbiAqIEBwYXJhbSByZXZlcnNlIFdoZXRoZXIgdG8gc3VtIGluIHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb24uIE9wdGlvbmFsLlxuICogICAgIERlZmF1bHRzIHRvIGZhbHNlLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdPcGVyYXRpb25zJywgc3ViaGVhZGluZzogJ1NjYW4nfVxuICovXG5mdW5jdGlvbiBjdW1zdW1fPFQgZXh0ZW5kcyBUZW5zb3I+KFxuICAgIHg6IFRlbnNvcnxUZW5zb3JMaWtlLCBheGlzID0gMCwgZXhjbHVzaXZlID0gZmFsc2UsIHJldmVyc2UgPSBmYWxzZSk6IFQge1xuICBjb25zdCAkeCA9IGNvbnZlcnRUb1RlbnNvcih4LCAneCcsICdjdW1zdW0nKTtcblxuICBjb25zdCBpbnB1dHM6IEN1bXN1bUlucHV0cyA9IHt4OiAkeH07XG4gIGNvbnN0IGF0dHJzOiBDdW1zdW1BdHRycyA9IHtheGlzLCBleGNsdXNpdmUsIHJldmVyc2V9O1xuXG4gIHJldHVybiBFTkdJTkUucnVuS2VybmVsKFxuICAgICAgQ3Vtc3VtLCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXAsIGF0dHJzIGFzIHt9IGFzIE5hbWVkQXR0ck1hcCk7XG59XG5cbmV4cG9ydCBjb25zdCBjdW1zdW0gPSBvcCh7Y3Vtc3VtX30pO1xuIl19