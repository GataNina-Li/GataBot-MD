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
import { SquaredDifference } from '../kernel_names';
import { makeTypesMatch } from '../tensor_util';
import { convertToTensor } from '../tensor_util_env';
import { assertAndGetBroadcastShape } from './broadcast_util';
import { op } from './operation';
/**
 * Returns (a - b) * (a - b) element-wise.
 * Supports broadcasting.
 *
 * ```js
 * const a = tf.tensor1d([1, 4, 3, 16]);
 * const b = tf.tensor1d([1, 2, 9, 4]);
 *
 * a.squaredDifference(b).print();  // or tf.squaredDifference(a, b)
 * ```
 *
 * ```js
 * // Broadcast squared difference  a with b.
 * const a = tf.tensor1d([2, 4, 6, 8]);
 * const b = tf.scalar(5);
 *
 * a.squaredDifference(b).print();  // or tf.squaredDifference(a, b)
 * ```
 *
 * @param a The first tensor.
 * @param b The second tensor. Must have the same type as `a`.
 *
 * @doc {heading: 'Operations', subheading: 'Arithmetic'}
 */
function squaredDifference_(a, b) {
    let $a = convertToTensor(a, 'a', 'squaredDifference');
    let $b = convertToTensor(b, 'b', 'squaredDifference');
    [$a, $b] = makeTypesMatch($a, $b);
    assertAndGetBroadcastShape($a.shape, $b.shape);
    const inputs = { a: $a, b: $b };
    const attrs = {};
    return ENGINE.runKernel(SquaredDifference, inputs, attrs);
}
export const squaredDifference = op({ squaredDifference_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3F1YXJlZF9kaWZmZXJlbmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvc3F1YXJlZF9kaWZmZXJlbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLGlCQUFpQixFQUEwQixNQUFNLGlCQUFpQixDQUFDO0FBRzNFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHbkQsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDNUQsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Qkc7QUFDSCxTQUFTLGtCQUFrQixDQUN2QixDQUFvQixFQUFFLENBQW9CO0lBQzVDLElBQUksRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFDdEQsSUFBSSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUN0RCxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxjQUFjLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRWxDLDBCQUEwQixDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRS9DLE1BQU0sTUFBTSxHQUE0QixFQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBQyxDQUFDO0lBQ3ZELE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUVqQixPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQ25CLGlCQUFpQixFQUFFLE1BQW1DLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDckUsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQyxFQUFDLGtCQUFrQixFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge1NxdWFyZWREaWZmZXJlbmNlLCBTcXVhcmVkRGlmZmVyZW5jZUlucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7bWFrZVR5cGVzTWF0Y2h9IGZyb20gJy4uL3RlbnNvcl91dGlsJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7YXNzZXJ0QW5kR2V0QnJvYWRjYXN0U2hhcGV9IGZyb20gJy4vYnJvYWRjYXN0X3V0aWwnO1xuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuXG4vKipcbiAqIFJldHVybnMgKGEgLSBiKSAqIChhIC0gYikgZWxlbWVudC13aXNlLlxuICogU3VwcG9ydHMgYnJvYWRjYXN0aW5nLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBhID0gdGYudGVuc29yMWQoWzEsIDQsIDMsIDE2XSk7XG4gKiBjb25zdCBiID0gdGYudGVuc29yMWQoWzEsIDIsIDksIDRdKTtcbiAqXG4gKiBhLnNxdWFyZWREaWZmZXJlbmNlKGIpLnByaW50KCk7ICAvLyBvciB0Zi5zcXVhcmVkRGlmZmVyZW5jZShhLCBiKVxuICogYGBgXG4gKlxuICogYGBganNcbiAqIC8vIEJyb2FkY2FzdCBzcXVhcmVkIGRpZmZlcmVuY2UgIGEgd2l0aCBiLlxuICogY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsyLCA0LCA2LCA4XSk7XG4gKiBjb25zdCBiID0gdGYuc2NhbGFyKDUpO1xuICpcbiAqIGEuc3F1YXJlZERpZmZlcmVuY2UoYikucHJpbnQoKTsgIC8vIG9yIHRmLnNxdWFyZWREaWZmZXJlbmNlKGEsIGIpXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gYSBUaGUgZmlyc3QgdGVuc29yLlxuICogQHBhcmFtIGIgVGhlIHNlY29uZCB0ZW5zb3IuIE11c3QgaGF2ZSB0aGUgc2FtZSB0eXBlIGFzIGBhYC5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdBcml0aG1ldGljJ31cbiAqL1xuZnVuY3Rpb24gc3F1YXJlZERpZmZlcmVuY2VfPFQgZXh0ZW5kcyBUZW5zb3I+KFxuICAgIGE6IFRlbnNvcnxUZW5zb3JMaWtlLCBiOiBUZW5zb3J8VGVuc29yTGlrZSk6IFQge1xuICBsZXQgJGEgPSBjb252ZXJ0VG9UZW5zb3IoYSwgJ2EnLCAnc3F1YXJlZERpZmZlcmVuY2UnKTtcbiAgbGV0ICRiID0gY29udmVydFRvVGVuc29yKGIsICdiJywgJ3NxdWFyZWREaWZmZXJlbmNlJyk7XG4gIFskYSwgJGJdID0gbWFrZVR5cGVzTWF0Y2goJGEsICRiKTtcblxuICBhc3NlcnRBbmRHZXRCcm9hZGNhc3RTaGFwZSgkYS5zaGFwZSwgJGIuc2hhcGUpO1xuXG4gIGNvbnN0IGlucHV0czogU3F1YXJlZERpZmZlcmVuY2VJbnB1dHMgPSB7YTogJGEsIGI6ICRifTtcbiAgY29uc3QgYXR0cnMgPSB7fTtcblxuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChcbiAgICAgIFNxdWFyZWREaWZmZXJlbmNlLCBpbnB1dHMgYXMgdW5rbm93biBhcyBOYW1lZFRlbnNvck1hcCwgYXR0cnMpO1xufVxuXG5leHBvcnQgY29uc3Qgc3F1YXJlZERpZmZlcmVuY2UgPSBvcCh7c3F1YXJlZERpZmZlcmVuY2VffSk7XG4iXX0=