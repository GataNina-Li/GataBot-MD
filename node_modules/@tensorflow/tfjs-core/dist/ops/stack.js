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
import { Pack } from '../kernel_names';
import { convertToTensorArray } from '../tensor_util_env';
import * as util from '../util';
import { op } from './operation';
/**
 * Stacks a list of rank-`R` `tf.Tensor`s into one rank-`(R+1)` `tf.Tensor`.
 *
 * ```js
 * const a = tf.tensor1d([1, 2]);
 * const b = tf.tensor1d([3, 4]);
 * const c = tf.tensor1d([5, 6]);
 * tf.stack([a, b, c]).print();
 * ```
 *
 * @param tensors A list of tensor objects with the same shape and dtype.
 * @param axis The axis to stack along. Defaults to 0 (the first dim).
 *
 * @doc {heading: 'Tensors', subheading: 'Slicing and Joining'}
 */
function stack_(tensors, axis = 0) {
    const $tensors = convertToTensorArray(tensors, 'tensors', 'stack', 'string_or_numeric');
    util.assert($tensors.length >= 1, () => 'Pass at least one tensor to tf.stack');
    if ($tensors.length > 0) {
        util.assert(axis <= $tensors[0].rank, () => 'Axis must be <= rank of the tensor');
    }
    const inputs = $tensors;
    const attrs = { axis };
    return ENGINE.runKernel(Pack, inputs, attrs);
}
export const stack = op({ stack_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxJQUFJLEVBQXdCLE1BQU0saUJBQWlCLENBQUM7QUFJNUQsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFeEQsT0FBTyxLQUFLLElBQUksTUFBTSxTQUFTLENBQUM7QUFFaEMsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvQjs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNILFNBQVMsTUFBTSxDQUNYLE9BQTRCLEVBQUUsSUFBSSxHQUFHLENBQUM7SUFDeEMsTUFBTSxRQUFRLEdBQ1Ysb0JBQW9CLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUUzRSxJQUFJLENBQUMsTUFBTSxDQUNQLFFBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7SUFFeEUsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUN2QixJQUFJLENBQUMsTUFBTSxDQUNQLElBQUksSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLG9DQUFvQyxDQUFDLENBQUM7S0FDM0U7SUFFRCxNQUFNLE1BQU0sR0FBZSxRQUFRLENBQUM7SUFDcEMsTUFBTSxLQUFLLEdBQWMsRUFBQyxJQUFJLEVBQUMsQ0FBQztJQUVoQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQ25CLElBQUksRUFBRSxNQUE4QixFQUFFLEtBQTJCLENBQUMsQ0FBQztBQUN6RSxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtQYWNrLCBQYWNrQXR0cnMsIFBhY2tJbnB1dHN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge05hbWVkQXR0ck1hcH0gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yQXJyYXl9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcblxuLyoqXG4gKiBTdGFja3MgYSBsaXN0IG9mIHJhbmstYFJgIGB0Zi5UZW5zb3JgcyBpbnRvIG9uZSByYW5rLWAoUisxKWAgYHRmLlRlbnNvcmAuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMSwgMl0pO1xuICogY29uc3QgYiA9IHRmLnRlbnNvcjFkKFszLCA0XSk7XG4gKiBjb25zdCBjID0gdGYudGVuc29yMWQoWzUsIDZdKTtcbiAqIHRmLnN0YWNrKFthLCBiLCBjXSkucHJpbnQoKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB0ZW5zb3JzIEEgbGlzdCBvZiB0ZW5zb3Igb2JqZWN0cyB3aXRoIHRoZSBzYW1lIHNoYXBlIGFuZCBkdHlwZS5cbiAqIEBwYXJhbSBheGlzIFRoZSBheGlzIHRvIHN0YWNrIGFsb25nLiBEZWZhdWx0cyB0byAwICh0aGUgZmlyc3QgZGltKS5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnVGVuc29ycycsIHN1YmhlYWRpbmc6ICdTbGljaW5nIGFuZCBKb2luaW5nJ31cbiAqL1xuZnVuY3Rpb24gc3RhY2tfPFQgZXh0ZW5kcyBUZW5zb3I+KFxuICAgIHRlbnNvcnM6IEFycmF5PFR8VGVuc29yTGlrZT4sIGF4aXMgPSAwKTogVGVuc29yIHtcbiAgY29uc3QgJHRlbnNvcnMgPVxuICAgICAgY29udmVydFRvVGVuc29yQXJyYXkodGVuc29ycywgJ3RlbnNvcnMnLCAnc3RhY2snLCAnc3RyaW5nX29yX251bWVyaWMnKTtcblxuICB1dGlsLmFzc2VydChcbiAgICAgICR0ZW5zb3JzLmxlbmd0aCA+PSAxLCAoKSA9PiAnUGFzcyBhdCBsZWFzdCBvbmUgdGVuc29yIHRvIHRmLnN0YWNrJyk7XG5cbiAgaWYgKCR0ZW5zb3JzLmxlbmd0aCA+IDApIHtcbiAgICB1dGlsLmFzc2VydChcbiAgICAgICAgYXhpcyA8PSAkdGVuc29yc1swXS5yYW5rLCAoKSA9PiAnQXhpcyBtdXN0IGJlIDw9IHJhbmsgb2YgdGhlIHRlbnNvcicpO1xuICB9XG5cbiAgY29uc3QgaW5wdXRzOiBQYWNrSW5wdXRzID0gJHRlbnNvcnM7XG4gIGNvbnN0IGF0dHJzOiBQYWNrQXR0cnMgPSB7YXhpc307XG5cbiAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICBQYWNrLCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXAsIGF0dHJzIGFzIHt9IGFzIE5hbWVkQXR0ck1hcCk7XG59XG5cbmV4cG9ydCBjb25zdCBzdGFjayA9IG9wKHtzdGFja199KTtcbiJdfQ==