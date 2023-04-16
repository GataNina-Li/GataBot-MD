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
import { Imag } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Returns the imaginary part of a complex (or real) tensor.
 *
 * Given a tensor input, this operation returns a tensor of type float that is
 * the imaginary part of each element in input considered as a complex number.
 * If input is real, a tensor of all zeros is returned.
 *
 * ```js
 * const x = tf.complex([-2.25, 3.25], [4.75, 5.75]);
 * tf.imag(x).print();
 * ```
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
function imag_(input) {
    const $input = convertToTensor(input, 'input', 'imag');
    const inputs = { input: $input };
    return ENGINE.runKernel(Imag, inputs);
}
export const imag = op({ imag_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2ltYWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsSUFBSSxFQUFhLE1BQU0saUJBQWlCLENBQUM7QUFHakQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDL0I7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILFNBQVMsS0FBSyxDQUFtQixLQUFtQjtJQUNsRCxNQUFNLE1BQU0sR0FBRyxlQUFlLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUV2RCxNQUFNLE1BQU0sR0FBZSxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUMsQ0FBQztJQUMzQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQThCLENBQUMsQ0FBQztBQUNoRSxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxFQUFDLEtBQUssRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtJbWFnLCBJbWFnSW5wdXRzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcbi8qKlxuICogUmV0dXJucyB0aGUgaW1hZ2luYXJ5IHBhcnQgb2YgYSBjb21wbGV4IChvciByZWFsKSB0ZW5zb3IuXG4gKlxuICogR2l2ZW4gYSB0ZW5zb3IgaW5wdXQsIHRoaXMgb3BlcmF0aW9uIHJldHVybnMgYSB0ZW5zb3Igb2YgdHlwZSBmbG9hdCB0aGF0IGlzXG4gKiB0aGUgaW1hZ2luYXJ5IHBhcnQgb2YgZWFjaCBlbGVtZW50IGluIGlucHV0IGNvbnNpZGVyZWQgYXMgYSBjb21wbGV4IG51bWJlci5cbiAqIElmIGlucHV0IGlzIHJlYWwsIGEgdGVuc29yIG9mIGFsbCB6ZXJvcyBpcyByZXR1cm5lZC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgeCA9IHRmLmNvbXBsZXgoWy0yLjI1LCAzLjI1XSwgWzQuNzUsIDUuNzVdKTtcbiAqIHRmLmltYWcoeCkucHJpbnQoKTtcbiAqIGBgYFxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdUZW5zb3JzJywgc3ViaGVhZGluZzogJ0NyZWF0aW9uJ31cbiAqL1xuZnVuY3Rpb24gaW1hZ188VCBleHRlbmRzIFRlbnNvcj4oaW5wdXQ6IFR8VGVuc29yTGlrZSk6IFQge1xuICBjb25zdCAkaW5wdXQgPSBjb252ZXJ0VG9UZW5zb3IoaW5wdXQsICdpbnB1dCcsICdpbWFnJyk7XG5cbiAgY29uc3QgaW5wdXRzOiBJbWFnSW5wdXRzID0ge2lucHV0OiAkaW5wdXR9O1xuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChJbWFnLCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXApO1xufVxuXG5leHBvcnQgY29uc3QgaW1hZyA9IG9wKHtpbWFnX30pO1xuIl19