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
import { IFFT } from '../../kernel_names';
import { assert } from '../../util';
import { op } from '../operation';
/**
 * Inverse fast Fourier transform.
 *
 * Computes the inverse 1-dimensional discrete Fourier transform over the
 * inner-most dimension of input.
 *
 * ```js
 * const real = tf.tensor1d([1, 2, 3]);
 * const imag = tf.tensor1d([1, 2, 3]);
 * const x = tf.complex(real, imag);
 *
 * x.ifft().print();  // tf.spectral.ifft(x).print();
 * ```
 * @param input The complex input to compute an ifft over.
 *
 * @doc {heading: 'Operations', subheading: 'Spectral', namespace: 'spectral'}
 */
function ifft_(input) {
    assert(input.dtype === 'complex64', () => `The dtype for tf.spectral.ifft() must be complex64 ` +
        `but got ${input.dtype}.`);
    const inputs = { input };
    return ENGINE.runKernel(IFFT, inputs);
}
export const ifft = op({ ifft_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWZmdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3NwZWN0cmFsL2lmZnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUNwQyxPQUFPLEVBQUMsSUFBSSxFQUFhLE1BQU0sb0JBQW9CLENBQUM7QUFHcEQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNsQyxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRWhDOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsU0FBUyxLQUFLLENBQUMsS0FBYTtJQUMxQixNQUFNLENBQ0YsS0FBSyxDQUFDLEtBQUssS0FBSyxXQUFXLEVBQzNCLEdBQUcsRUFBRSxDQUFDLHFEQUFxRDtRQUN2RCxXQUFXLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBRW5DLE1BQU0sTUFBTSxHQUFlLEVBQUMsS0FBSyxFQUFDLENBQUM7SUFFbkMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUE4QixDQUFDLENBQUM7QUFDaEUsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsRUFBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vLi4vZW5naW5lJztcbmltcG9ydCB7SUZGVCwgSUZGVElucHV0c30gZnJvbSAnLi4vLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi8uLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7YXNzZXJ0fSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7b3B9IGZyb20gJy4uL29wZXJhdGlvbic7XG5cbi8qKlxuICogSW52ZXJzZSBmYXN0IEZvdXJpZXIgdHJhbnNmb3JtLlxuICpcbiAqIENvbXB1dGVzIHRoZSBpbnZlcnNlIDEtZGltZW5zaW9uYWwgZGlzY3JldGUgRm91cmllciB0cmFuc2Zvcm0gb3ZlciB0aGVcbiAqIGlubmVyLW1vc3QgZGltZW5zaW9uIG9mIGlucHV0LlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCByZWFsID0gdGYudGVuc29yMWQoWzEsIDIsIDNdKTtcbiAqIGNvbnN0IGltYWcgPSB0Zi50ZW5zb3IxZChbMSwgMiwgM10pO1xuICogY29uc3QgeCA9IHRmLmNvbXBsZXgocmVhbCwgaW1hZyk7XG4gKlxuICogeC5pZmZ0KCkucHJpbnQoKTsgIC8vIHRmLnNwZWN0cmFsLmlmZnQoeCkucHJpbnQoKTtcbiAqIGBgYFxuICogQHBhcmFtIGlucHV0IFRoZSBjb21wbGV4IGlucHV0IHRvIGNvbXB1dGUgYW4gaWZmdCBvdmVyLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdPcGVyYXRpb25zJywgc3ViaGVhZGluZzogJ1NwZWN0cmFsJywgbmFtZXNwYWNlOiAnc3BlY3RyYWwnfVxuICovXG5mdW5jdGlvbiBpZmZ0XyhpbnB1dDogVGVuc29yKTogVGVuc29yIHtcbiAgYXNzZXJ0KFxuICAgICAgaW5wdXQuZHR5cGUgPT09ICdjb21wbGV4NjQnLFxuICAgICAgKCkgPT4gYFRoZSBkdHlwZSBmb3IgdGYuc3BlY3RyYWwuaWZmdCgpIG11c3QgYmUgY29tcGxleDY0IGAgK1xuICAgICAgICAgIGBidXQgZ290ICR7aW5wdXQuZHR5cGV9LmApO1xuXG4gIGNvbnN0IGlucHV0czogSUZGVElucHV0cyA9IHtpbnB1dH07XG5cbiAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoSUZGVCwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwKTtcbn1cblxuZXhwb3J0IGNvbnN0IGlmZnQgPSBvcCh7aWZmdF99KTtcbiJdfQ==