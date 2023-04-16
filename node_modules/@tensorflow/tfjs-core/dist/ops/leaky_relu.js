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
import { LeakyRelu } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Computes leaky rectified linear element-wise.
 *
 * See
 * [http://web.stanford.edu/~awni/papers/relu_hybrid_icml2013_final.pdf](
 *     http://web.stanford.edu/~awni/papers/relu_hybrid_icml2013_final.pdf)
 *
 * ```js
 * const x = tf.tensor1d([-1, 2, -3, 4]);
 *
 * x.leakyRelu(0.1).print();  // or tf.leakyRelu(x, 0.1)
 * ```
 * @param x The input tensor.
 * @param alpha The scaling factor for negative values, defaults to 0.2.
 *
 * @doc {heading: 'Operations', subheading: 'Basic math'}
 */
function leakyRelu_(x, alpha = 0.2) {
    const $x = convertToTensor(x, 'x', 'leakyRelu');
    const inputs = { x: $x };
    const attrs = { alpha };
    return ENGINE.runKernel(LeakyRelu, inputs, attrs);
}
export const leakyRelu = op({ leakyRelu_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVha3lfcmVsdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2xlYWt5X3JlbHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsU0FBUyxFQUFrQyxNQUFNLGlCQUFpQixDQUFDO0FBSTNFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUduRCxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRS9COzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsU0FBUyxVQUFVLENBQW1CLENBQWUsRUFBRSxLQUFLLEdBQUcsR0FBRztJQUNoRSxNQUFNLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUVoRCxNQUFNLE1BQU0sR0FBb0IsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFDLENBQUM7SUFDeEMsTUFBTSxLQUFLLEdBQW1CLEVBQUMsS0FBSyxFQUFDLENBQUM7SUFFdEMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUNuQixTQUFTLEVBQUUsTUFBOEIsRUFBRSxLQUEyQixDQUFDLENBQUM7QUFDOUUsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsRUFBQyxVQUFVLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7TGVha3lSZWx1LCBMZWFreVJlbHVBdHRycywgTGVha3lSZWx1SW5wdXRzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7TmFtZWRUZW5zb3JNYXB9IGZyb20gJy4uL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5cbi8qKlxuICogQ29tcHV0ZXMgbGVha3kgcmVjdGlmaWVkIGxpbmVhciBlbGVtZW50LXdpc2UuXG4gKlxuICogU2VlXG4gKiBbaHR0cDovL3dlYi5zdGFuZm9yZC5lZHUvfmF3bmkvcGFwZXJzL3JlbHVfaHlicmlkX2ljbWwyMDEzX2ZpbmFsLnBkZl0oXG4gKiAgICAgaHR0cDovL3dlYi5zdGFuZm9yZC5lZHUvfmF3bmkvcGFwZXJzL3JlbHVfaHlicmlkX2ljbWwyMDEzX2ZpbmFsLnBkZilcbiAqXG4gKiBgYGBqc1xuICogY29uc3QgeCA9IHRmLnRlbnNvcjFkKFstMSwgMiwgLTMsIDRdKTtcbiAqXG4gKiB4LmxlYWt5UmVsdSgwLjEpLnByaW50KCk7ICAvLyBvciB0Zi5sZWFreVJlbHUoeCwgMC4xKVxuICogYGBgXG4gKiBAcGFyYW0geCBUaGUgaW5wdXQgdGVuc29yLlxuICogQHBhcmFtIGFscGhhIFRoZSBzY2FsaW5nIGZhY3RvciBmb3IgbmVnYXRpdmUgdmFsdWVzLCBkZWZhdWx0cyB0byAwLjIuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ09wZXJhdGlvbnMnLCBzdWJoZWFkaW5nOiAnQmFzaWMgbWF0aCd9XG4gKi9cbmZ1bmN0aW9uIGxlYWt5UmVsdV88VCBleHRlbmRzIFRlbnNvcj4oeDogVHxUZW5zb3JMaWtlLCBhbHBoYSA9IDAuMik6IFQge1xuICBjb25zdCAkeCA9IGNvbnZlcnRUb1RlbnNvcih4LCAneCcsICdsZWFreVJlbHUnKTtcblxuICBjb25zdCBpbnB1dHM6IExlYWt5UmVsdUlucHV0cyA9IHt4OiAkeH07XG4gIGNvbnN0IGF0dHJzOiBMZWFreVJlbHVBdHRycyA9IHthbHBoYX07XG5cbiAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICBMZWFreVJlbHUsIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCwgYXR0cnMgYXMge30gYXMgTmFtZWRBdHRyTWFwKTtcbn1cblxuZXhwb3J0IGNvbnN0IGxlYWt5UmVsdSA9IG9wKHtsZWFreVJlbHVffSk7XG4iXX0=