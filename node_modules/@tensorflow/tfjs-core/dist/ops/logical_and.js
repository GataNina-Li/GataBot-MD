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
import { LogicalAnd } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { assertAndGetBroadcastShape } from './broadcast_util';
import { op } from './operation';
/**
 * Returns the truth value of `a AND b` element-wise. Supports broadcasting.
 *
 * ```js
 * const a = tf.tensor1d([false, false, true, true], 'bool');
 * const b = tf.tensor1d([false, true, false, true], 'bool');
 *
 * a.logicalAnd(b).print();
 * ```
 *
 * @param a The first input tensor. Must be of dtype bool.
 * @param b The second input tensor. Must be of dtype bool.
 *
 * @doc {heading: 'Operations', subheading: 'Logical'}
 */
function logicalAnd_(a, b) {
    const $a = convertToTensor(a, 'a', 'logicalAnd', 'bool');
    const $b = convertToTensor(b, 'b', 'logicalAnd', 'bool');
    assertAndGetBroadcastShape($a.shape, $b.shape);
    const inputs = { a: $a, b: $b };
    return ENGINE.runKernel(LogicalAnd, inputs);
}
export const logicalAnd = op({ logicalAnd_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naWNhbF9hbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9sb2dpY2FsX2FuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxVQUFVLEVBQW1CLE1BQU0saUJBQWlCLENBQUM7QUFHN0QsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBR25ELE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQzVELE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFL0I7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxTQUFTLFdBQVcsQ0FDaEIsQ0FBb0IsRUFBRSxDQUFvQjtJQUM1QyxNQUFNLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDekQsTUFBTSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3pELDBCQUEwQixDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRS9DLE1BQU0sTUFBTSxHQUFxQixFQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBQyxDQUFDO0lBRWhELE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsTUFBOEIsQ0FBQyxDQUFDO0FBQ3RFLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLEVBQUMsV0FBVyxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtMb2dpY2FsQW5kLCBMb2dpY2FsQW5kSW5wdXRzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcblxuaW1wb3J0IHthc3NlcnRBbmRHZXRCcm9hZGNhc3RTaGFwZX0gZnJvbSAnLi9icm9hZGNhc3RfdXRpbCc7XG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdHJ1dGggdmFsdWUgb2YgYGEgQU5EIGJgIGVsZW1lbnQtd2lzZS4gU3VwcG9ydHMgYnJvYWRjYXN0aW5nLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBhID0gdGYudGVuc29yMWQoW2ZhbHNlLCBmYWxzZSwgdHJ1ZSwgdHJ1ZV0sICdib29sJyk7XG4gKiBjb25zdCBiID0gdGYudGVuc29yMWQoW2ZhbHNlLCB0cnVlLCBmYWxzZSwgdHJ1ZV0sICdib29sJyk7XG4gKlxuICogYS5sb2dpY2FsQW5kKGIpLnByaW50KCk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gYSBUaGUgZmlyc3QgaW5wdXQgdGVuc29yLiBNdXN0IGJlIG9mIGR0eXBlIGJvb2wuXG4gKiBAcGFyYW0gYiBUaGUgc2Vjb25kIGlucHV0IHRlbnNvci4gTXVzdCBiZSBvZiBkdHlwZSBib29sLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdPcGVyYXRpb25zJywgc3ViaGVhZGluZzogJ0xvZ2ljYWwnfVxuICovXG5mdW5jdGlvbiBsb2dpY2FsQW5kXzxUIGV4dGVuZHMgVGVuc29yPihcbiAgICBhOiBUZW5zb3J8VGVuc29yTGlrZSwgYjogVGVuc29yfFRlbnNvckxpa2UpOiBUIHtcbiAgY29uc3QgJGEgPSBjb252ZXJ0VG9UZW5zb3IoYSwgJ2EnLCAnbG9naWNhbEFuZCcsICdib29sJyk7XG4gIGNvbnN0ICRiID0gY29udmVydFRvVGVuc29yKGIsICdiJywgJ2xvZ2ljYWxBbmQnLCAnYm9vbCcpO1xuICBhc3NlcnRBbmRHZXRCcm9hZGNhc3RTaGFwZSgkYS5zaGFwZSwgJGIuc2hhcGUpO1xuXG4gIGNvbnN0IGlucHV0czogTG9naWNhbEFuZElucHV0cyA9IHthOiAkYSwgYjogJGJ9O1xuXG4gIHJldHVybiBFTkdJTkUucnVuS2VybmVsKExvZ2ljYWxBbmQsIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCk7XG59XG5cbmV4cG9ydCBjb25zdCBsb2dpY2FsQW5kID0gb3Aoe2xvZ2ljYWxBbmRffSk7XG4iXX0=