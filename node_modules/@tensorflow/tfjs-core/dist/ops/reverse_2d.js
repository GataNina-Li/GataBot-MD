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
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { op } from './operation';
import { reverse } from './reverse';
/**
 * Reverses a `tf.Tensor2D` along a specified axis.
 *
 * @param x The input tensor.
 * @param axis The set of dimensions to reverse. Must be in the
 *     range [-rank(x), rank(x)). Defaults to all axes.
 */
function reverse2d_(x, axis) {
    const $x = convertToTensor(x, 'x', 'reverse');
    util.assert($x.rank === 2, () => `Error in reverse2D: x must be rank 2 but got rank ${$x.rank}.`);
    return reverse($x, axis);
}
export const reverse2d = op({ reverse2d_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV2ZXJzZV8yZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3JldmVyc2VfMmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBR0gsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE9BQU8sS0FBSyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBQ2hDLE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDL0IsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUVsQzs7Ozs7O0dBTUc7QUFDSCxTQUFTLFVBQVUsQ0FBQyxDQUFzQixFQUFFLElBQXNCO0lBQ2hFLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzlDLElBQUksQ0FBQyxNQUFNLENBQ1AsRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQ2IsR0FBRyxFQUFFLENBQUMscURBQXFELEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQzNFLE9BQU8sT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzQixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQyxFQUFDLFVBQVUsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7VGVuc29yMkR9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcbmltcG9ydCB7cmV2ZXJzZX0gZnJvbSAnLi9yZXZlcnNlJztcblxuLyoqXG4gKiBSZXZlcnNlcyBhIGB0Zi5UZW5zb3IyRGAgYWxvbmcgYSBzcGVjaWZpZWQgYXhpcy5cbiAqXG4gKiBAcGFyYW0geCBUaGUgaW5wdXQgdGVuc29yLlxuICogQHBhcmFtIGF4aXMgVGhlIHNldCBvZiBkaW1lbnNpb25zIHRvIHJldmVyc2UuIE11c3QgYmUgaW4gdGhlXG4gKiAgICAgcmFuZ2UgWy1yYW5rKHgpLCByYW5rKHgpKS4gRGVmYXVsdHMgdG8gYWxsIGF4ZXMuXG4gKi9cbmZ1bmN0aW9uIHJldmVyc2UyZF8oeDogVGVuc29yMkR8VGVuc29yTGlrZSwgYXhpcz86IG51bWJlcnxudW1iZXJbXSk6IFRlbnNvcjJEIHtcbiAgY29uc3QgJHggPSBjb252ZXJ0VG9UZW5zb3IoeCwgJ3gnLCAncmV2ZXJzZScpO1xuICB1dGlsLmFzc2VydChcbiAgICAgICR4LnJhbmsgPT09IDIsXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gcmV2ZXJzZTJEOiB4IG11c3QgYmUgcmFuayAyIGJ1dCBnb3QgcmFuayAkeyR4LnJhbmt9LmApO1xuICByZXR1cm4gcmV2ZXJzZSgkeCwgYXhpcyk7XG59XG5cbmV4cG9ydCBjb25zdCByZXZlcnNlMmQgPSBvcCh7cmV2ZXJzZTJkX30pO1xuIl19