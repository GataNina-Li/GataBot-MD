/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
import { ArgMax } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Returns the indices of the maximum values along an `axis`.
 *
 * The result has the same shape as `input` with the dimension along `axis`
 * removed.
 *
 * ```js
 * const x = tf.tensor1d([1, 2, 3]);
 *
 * x.argMax().print();  // or tf.argMax(x)
 * ```
 *
 * ```js
 * const x = tf.tensor2d([1, 2, 4, 3], [2, 2]);
 *
 * const axis = 1;
 * x.argMax(axis).print();  // or tf.argMax(x, axis)
 * ```
 *
 * @param x The input tensor.
 * @param axis The dimension to reduce. Defaults to 0 (outer-most dimension).
 *
 * @doc {heading: 'Operations', subheading: 'Reduction'}
 */
function argMax_(x, axis = 0) {
    const $x = convertToTensor(x, 'x', 'argMax');
    const inputs = { x: $x };
    const attrs = { axis };
    return ENGINE.runKernel(ArgMax, inputs, attrs);
}
export const argMax = op({ argMax_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJnX21heC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2FyZ19tYXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsTUFBTSxFQUE0QixNQUFNLGlCQUFpQixDQUFDO0FBSWxFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUduRCxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRS9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCRztBQUNILFNBQVMsT0FBTyxDQUFtQixDQUFvQixFQUFFLElBQUksR0FBRyxDQUFDO0lBQy9ELE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRTdDLE1BQU0sTUFBTSxHQUFpQixFQUFDLENBQUMsRUFBRSxFQUFFLEVBQUMsQ0FBQztJQUNyQyxNQUFNLEtBQUssR0FBZ0IsRUFBQyxJQUFJLEVBQUMsQ0FBQztJQUVsQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQ25CLE1BQU0sRUFBRSxNQUE4QixFQUFFLEtBQTJCLENBQUMsQ0FBQztBQUMzRSxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtBcmdNYXgsIEFyZ01heEF0dHJzLCBBcmdNYXhJbnB1dHN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge05hbWVkQXR0ck1hcH0gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBpbmRpY2VzIG9mIHRoZSBtYXhpbXVtIHZhbHVlcyBhbG9uZyBhbiBgYXhpc2AuXG4gKlxuICogVGhlIHJlc3VsdCBoYXMgdGhlIHNhbWUgc2hhcGUgYXMgYGlucHV0YCB3aXRoIHRoZSBkaW1lbnNpb24gYWxvbmcgYGF4aXNgXG4gKiByZW1vdmVkLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCB4ID0gdGYudGVuc29yMWQoWzEsIDIsIDNdKTtcbiAqXG4gKiB4LmFyZ01heCgpLnByaW50KCk7ICAvLyBvciB0Zi5hcmdNYXgoeClcbiAqIGBgYFxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCB4ID0gdGYudGVuc29yMmQoWzEsIDIsIDQsIDNdLCBbMiwgMl0pO1xuICpcbiAqIGNvbnN0IGF4aXMgPSAxO1xuICogeC5hcmdNYXgoYXhpcykucHJpbnQoKTsgIC8vIG9yIHRmLmFyZ01heCh4LCBheGlzKVxuICogYGBgXG4gKlxuICogQHBhcmFtIHggVGhlIGlucHV0IHRlbnNvci5cbiAqIEBwYXJhbSBheGlzIFRoZSBkaW1lbnNpb24gdG8gcmVkdWNlLiBEZWZhdWx0cyB0byAwIChvdXRlci1tb3N0IGRpbWVuc2lvbikuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ09wZXJhdGlvbnMnLCBzdWJoZWFkaW5nOiAnUmVkdWN0aW9uJ31cbiAqL1xuZnVuY3Rpb24gYXJnTWF4XzxUIGV4dGVuZHMgVGVuc29yPih4OiBUZW5zb3J8VGVuc29yTGlrZSwgYXhpcyA9IDApOiBUIHtcbiAgY29uc3QgJHggPSBjb252ZXJ0VG9UZW5zb3IoeCwgJ3gnLCAnYXJnTWF4Jyk7XG5cbiAgY29uc3QgaW5wdXRzOiBBcmdNYXhJbnB1dHMgPSB7eDogJHh9O1xuICBjb25zdCBhdHRyczogQXJnTWF4QXR0cnMgPSB7YXhpc307XG5cbiAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICBBcmdNYXgsIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCwgYXR0cnMgYXMge30gYXMgTmFtZWRBdHRyTWFwKTtcbn1cblxuZXhwb3J0IGNvbnN0IGFyZ01heCA9IG9wKHthcmdNYXhffSk7XG4iXX0=