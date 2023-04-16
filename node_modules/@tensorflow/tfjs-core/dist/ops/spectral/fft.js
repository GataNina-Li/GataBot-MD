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
import { ENGINE } from '../../engine';
import { FFT } from '../../kernel_names';
import { assert } from '../../util';
import { op } from '../operation';
/**
 * Fast Fourier transform.
 *
 * Computes the 1-dimensional discrete Fourier transform over the inner-most
 * dimension of input.
 *
 * ```js
 * const real = tf.tensor1d([1, 2, 3]);
 * const imag = tf.tensor1d([1, 2, 3]);
 * const x = tf.complex(real, imag);
 *
 * x.fft().print();  // tf.spectral.fft(x).print();
 * ```
 * @param input The complex input to compute an fft over.
 *
 * @doc {heading: 'Operations', subheading: 'Spectral', namespace: 'spectral'}
 */
function fft_(input) {
    assert(input.dtype === 'complex64', () => `The dtype for tf.spectral.fft() must be complex64 ` +
        `but got ${input.dtype}.`);
    const inputs = { input };
    return ENGINE.runKernel(FFT, inputs);
}
export const fft = op({ fft_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmZ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvc3BlY3RyYWwvZmZ0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDcEMsT0FBTyxFQUFDLEdBQUcsRUFBWSxNQUFNLG9CQUFvQixDQUFDO0FBR2xELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDbEMsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUVoQzs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUNILFNBQVMsSUFBSSxDQUFDLEtBQWE7SUFDekIsTUFBTSxDQUNGLEtBQUssQ0FBQyxLQUFLLEtBQUssV0FBVyxFQUMzQixHQUFHLEVBQUUsQ0FBQyxvREFBb0Q7UUFDdEQsV0FBVyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztJQUVuQyxNQUFNLE1BQU0sR0FBYyxFQUFDLEtBQUssRUFBQyxDQUFDO0lBRWxDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsTUFBOEIsQ0FBQyxDQUFDO0FBQy9ELENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uLy4uL2VuZ2luZSc7XG5pbXBvcnQge0ZGVCwgRkZUSW5wdXRzfSBmcm9tICcuLi8uLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uLy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi8uLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHthc3NlcnR9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtvcH0gZnJvbSAnLi4vb3BlcmF0aW9uJztcblxuLyoqXG4gKiBGYXN0IEZvdXJpZXIgdHJhbnNmb3JtLlxuICpcbiAqIENvbXB1dGVzIHRoZSAxLWRpbWVuc2lvbmFsIGRpc2NyZXRlIEZvdXJpZXIgdHJhbnNmb3JtIG92ZXIgdGhlIGlubmVyLW1vc3RcbiAqIGRpbWVuc2lvbiBvZiBpbnB1dC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgcmVhbCA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzXSk7XG4gKiBjb25zdCBpbWFnID0gdGYudGVuc29yMWQoWzEsIDIsIDNdKTtcbiAqIGNvbnN0IHggPSB0Zi5jb21wbGV4KHJlYWwsIGltYWcpO1xuICpcbiAqIHguZmZ0KCkucHJpbnQoKTsgIC8vIHRmLnNwZWN0cmFsLmZmdCh4KS5wcmludCgpO1xuICogYGBgXG4gKiBAcGFyYW0gaW5wdXQgVGhlIGNvbXBsZXggaW5wdXQgdG8gY29tcHV0ZSBhbiBmZnQgb3Zlci5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdTcGVjdHJhbCcsIG5hbWVzcGFjZTogJ3NwZWN0cmFsJ31cbiAqL1xuZnVuY3Rpb24gZmZ0XyhpbnB1dDogVGVuc29yKTogVGVuc29yIHtcbiAgYXNzZXJ0KFxuICAgICAgaW5wdXQuZHR5cGUgPT09ICdjb21wbGV4NjQnLFxuICAgICAgKCkgPT4gYFRoZSBkdHlwZSBmb3IgdGYuc3BlY3RyYWwuZmZ0KCkgbXVzdCBiZSBjb21wbGV4NjQgYCArXG4gICAgICAgICAgYGJ1dCBnb3QgJHtpbnB1dC5kdHlwZX0uYCk7XG5cbiAgY29uc3QgaW5wdXRzOiBGRlRJbnB1dHMgPSB7aW5wdXR9O1xuXG4gIHJldHVybiBFTkdJTkUucnVuS2VybmVsKEZGVCwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwKTtcbn1cblxuZXhwb3J0IGNvbnN0IGZmdCA9IG9wKHtmZnRffSk7XG4iXX0=