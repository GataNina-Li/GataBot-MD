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
import { FloorDiv } from '../kernel_names';
import { makeTypesMatch } from '../tensor_util';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Divides two `tf.Tensor`s element-wise, A / B. Supports broadcasting.
 * The result is rounded with floor function.
 *
 *
 * ```js
 * const a = tf.tensor1d([1, 4, 9, 16]);
 * const b = tf.tensor1d([1, 2, 3, 4]);
 *
 * a.floorDiv(b).print();  // or tf.div(a, b)
 * ```
 *
 * ```js
 * // Broadcast div a with b.
 * const a = tf.tensor1d([2, 4, 6, 8]);
 * const b = tf.scalar(2);
 *
 * a.floorDiv(b).print();  // or tf.floorDiv(a, b)
 * ```
 *
 * @param a The first tensor as the numerator.
 * @param b The second tensor as the denominator. Must have the same dtype as
 * `a`.
 *
 * @doc {heading: 'Operations', subheading: 'Arithmetic'}
 */
function floorDiv_(a, b) {
    let $a = convertToTensor(a, 'a', 'floorDiv');
    let $b = convertToTensor(b, 'b', 'floorDiv');
    [$a, $b] = makeTypesMatch($a, $b);
    const inputs = { a: $a, b: $b };
    return ENGINE.runKernel(FloorDiv, inputs);
}
export const floorDiv = op({ floorDiv_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvb3JEaXYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9mbG9vckRpdi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxRQUFRLEVBQWlCLE1BQU0saUJBQWlCLENBQUM7QUFHekQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUduRCxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRS9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUJHO0FBQ0gsU0FBUyxTQUFTLENBQ2QsQ0FBb0IsRUFBRSxDQUFvQjtJQUM1QyxJQUFJLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUM3QyxJQUFJLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUM3QyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxjQUFjLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRWxDLE1BQU0sTUFBTSxHQUFtQixFQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBQyxDQUFDO0lBRTlDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsTUFBOEIsQ0FBQyxDQUFDO0FBQ3BFLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLEVBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge0Zsb29yRGl2LCBGbG9vckRpdklucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7bWFrZVR5cGVzTWF0Y2h9IGZyb20gJy4uL3RlbnNvcl91dGlsJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcblxuLyoqXG4gKiBEaXZpZGVzIHR3byBgdGYuVGVuc29yYHMgZWxlbWVudC13aXNlLCBBIC8gQi4gU3VwcG9ydHMgYnJvYWRjYXN0aW5nLlxuICogVGhlIHJlc3VsdCBpcyByb3VuZGVkIHdpdGggZmxvb3IgZnVuY3Rpb24uXG4gKlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBhID0gdGYudGVuc29yMWQoWzEsIDQsIDksIDE2XSk7XG4gKiBjb25zdCBiID0gdGYudGVuc29yMWQoWzEsIDIsIDMsIDRdKTtcbiAqXG4gKiBhLmZsb29yRGl2KGIpLnByaW50KCk7ICAvLyBvciB0Zi5kaXYoYSwgYilcbiAqIGBgYFxuICpcbiAqIGBgYGpzXG4gKiAvLyBCcm9hZGNhc3QgZGl2IGEgd2l0aCBiLlxuICogY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsyLCA0LCA2LCA4XSk7XG4gKiBjb25zdCBiID0gdGYuc2NhbGFyKDIpO1xuICpcbiAqIGEuZmxvb3JEaXYoYikucHJpbnQoKTsgIC8vIG9yIHRmLmZsb29yRGl2KGEsIGIpXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gYSBUaGUgZmlyc3QgdGVuc29yIGFzIHRoZSBudW1lcmF0b3IuXG4gKiBAcGFyYW0gYiBUaGUgc2Vjb25kIHRlbnNvciBhcyB0aGUgZGVub21pbmF0b3IuIE11c3QgaGF2ZSB0aGUgc2FtZSBkdHlwZSBhc1xuICogYGFgLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdPcGVyYXRpb25zJywgc3ViaGVhZGluZzogJ0FyaXRobWV0aWMnfVxuICovXG5mdW5jdGlvbiBmbG9vckRpdl88VCBleHRlbmRzIFRlbnNvcj4oXG4gICAgYTogVGVuc29yfFRlbnNvckxpa2UsIGI6IFRlbnNvcnxUZW5zb3JMaWtlKTogVCB7XG4gIGxldCAkYSA9IGNvbnZlcnRUb1RlbnNvcihhLCAnYScsICdmbG9vckRpdicpO1xuICBsZXQgJGIgPSBjb252ZXJ0VG9UZW5zb3IoYiwgJ2InLCAnZmxvb3JEaXYnKTtcbiAgWyRhLCAkYl0gPSBtYWtlVHlwZXNNYXRjaCgkYSwgJGIpO1xuXG4gIGNvbnN0IGlucHV0czogRmxvb3JEaXZJbnB1dHMgPSB7YTogJGEsIGI6ICRifTtcblxuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChGbG9vckRpdiwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwKTtcbn1cblxuZXhwb3J0IGNvbnN0IGZsb29yRGl2ID0gb3Aoe2Zsb29yRGl2X30pO1xuIl19