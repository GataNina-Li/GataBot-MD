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
import { Complex } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { op } from './operation';
/**
 * Converts two real numbers to a complex number.
 *
 * Given a tensor `real` representing the real part of a complex number, and a
 * tensor `imag` representing the imaginary part of a complex number, this
 * operation returns complex numbers elementwise of the form [r0, i0, r1, i1],
 * where r represents the real part and i represents the imag part.
 *
 * The input tensors real and imag must have the same shape.
 *
 * ```js
 * const real = tf.tensor1d([2.25, 3.25]);
 * const imag = tf.tensor1d([4.75, 5.75]);
 * const complex = tf.complex(real, imag);
 *
 * complex.print();
 * ```
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
function complex_(real, imag) {
    const $real = convertToTensor(real, 'real', 'complex');
    const $imag = convertToTensor(imag, 'imag', 'complex');
    util.assertShapesMatch($real.shape, $imag.shape, `real and imag shapes, ${$real.shape} and ${$imag.shape}, ` +
        `must match in call to tf.complex().`);
    const inputs = { real: $real, imag: $imag };
    return ENGINE.runKernel(Complex, inputs);
}
export const complex = op({ complex_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxleC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2NvbXBsZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsT0FBTyxFQUFnQixNQUFNLGlCQUFpQixDQUFDO0FBR3ZELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUVuRCxPQUFPLEtBQUssSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUVoQyxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRS9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUJHO0FBQ0gsU0FBUyxRQUFRLENBQW1CLElBQWtCLEVBQUUsSUFBa0I7SUFDeEUsTUFBTSxLQUFLLEdBQUcsZUFBZSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDdkQsTUFBTSxLQUFLLEdBQUcsZUFBZSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDdkQsSUFBSSxDQUFDLGlCQUFpQixDQUNsQixLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQ3hCLHlCQUF5QixLQUFLLENBQUMsS0FBSyxRQUFRLEtBQUssQ0FBQyxLQUFLLElBQUk7UUFDdkQscUNBQXFDLENBQUMsQ0FBQztJQUUvQyxNQUFNLE1BQU0sR0FBa0IsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQztJQUN6RCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQThCLENBQUMsQ0FBQztBQUNuRSxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxFQUFDLFFBQVEsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7Q29tcGxleCwgQ29tcGxleElucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5cbi8qKlxuICogQ29udmVydHMgdHdvIHJlYWwgbnVtYmVycyB0byBhIGNvbXBsZXggbnVtYmVyLlxuICpcbiAqIEdpdmVuIGEgdGVuc29yIGByZWFsYCByZXByZXNlbnRpbmcgdGhlIHJlYWwgcGFydCBvZiBhIGNvbXBsZXggbnVtYmVyLCBhbmQgYVxuICogdGVuc29yIGBpbWFnYCByZXByZXNlbnRpbmcgdGhlIGltYWdpbmFyeSBwYXJ0IG9mIGEgY29tcGxleCBudW1iZXIsIHRoaXNcbiAqIG9wZXJhdGlvbiByZXR1cm5zIGNvbXBsZXggbnVtYmVycyBlbGVtZW50d2lzZSBvZiB0aGUgZm9ybSBbcjAsIGkwLCByMSwgaTFdLFxuICogd2hlcmUgciByZXByZXNlbnRzIHRoZSByZWFsIHBhcnQgYW5kIGkgcmVwcmVzZW50cyB0aGUgaW1hZyBwYXJ0LlxuICpcbiAqIFRoZSBpbnB1dCB0ZW5zb3JzIHJlYWwgYW5kIGltYWcgbXVzdCBoYXZlIHRoZSBzYW1lIHNoYXBlLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCByZWFsID0gdGYudGVuc29yMWQoWzIuMjUsIDMuMjVdKTtcbiAqIGNvbnN0IGltYWcgPSB0Zi50ZW5zb3IxZChbNC43NSwgNS43NV0pO1xuICogY29uc3QgY29tcGxleCA9IHRmLmNvbXBsZXgocmVhbCwgaW1hZyk7XG4gKlxuICogY29tcGxleC5wcmludCgpO1xuICogYGBgXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ1RlbnNvcnMnLCBzdWJoZWFkaW5nOiAnQ3JlYXRpb24nfVxuICovXG5mdW5jdGlvbiBjb21wbGV4XzxUIGV4dGVuZHMgVGVuc29yPihyZWFsOiBUfFRlbnNvckxpa2UsIGltYWc6IFR8VGVuc29yTGlrZSk6IFQge1xuICBjb25zdCAkcmVhbCA9IGNvbnZlcnRUb1RlbnNvcihyZWFsLCAncmVhbCcsICdjb21wbGV4Jyk7XG4gIGNvbnN0ICRpbWFnID0gY29udmVydFRvVGVuc29yKGltYWcsICdpbWFnJywgJ2NvbXBsZXgnKTtcbiAgdXRpbC5hc3NlcnRTaGFwZXNNYXRjaChcbiAgICAgICRyZWFsLnNoYXBlLCAkaW1hZy5zaGFwZSxcbiAgICAgIGByZWFsIGFuZCBpbWFnIHNoYXBlcywgJHskcmVhbC5zaGFwZX0gYW5kICR7JGltYWcuc2hhcGV9LCBgICtcbiAgICAgICAgICBgbXVzdCBtYXRjaCBpbiBjYWxsIHRvIHRmLmNvbXBsZXgoKS5gKTtcblxuICBjb25zdCBpbnB1dHM6IENvbXBsZXhJbnB1dHMgPSB7cmVhbDogJHJlYWwsIGltYWc6ICRpbWFnfTtcbiAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoQ29tcGxleCwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwKTtcbn1cblxuZXhwb3J0IGNvbnN0IGNvbXBsZXggPSBvcCh7Y29tcGxleF99KTtcbiJdfQ==