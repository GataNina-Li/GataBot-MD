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
import { assertAndGetBroadcastShape } from './broadcast_util';
import { logicalAnd } from './logical_and';
import { logicalNot } from './logical_not';
import { logicalOr } from './logical_or';
import { op } from './operation';
/**
 * Returns the truth value of `a XOR b` element-wise. Supports broadcasting.
 *
 * ```js
 * const a = tf.tensor1d([false, false, true, true], 'bool');
 * const b = tf.tensor1d([false, true, false, true], 'bool');
 *
 * a.logicalXor(b).print();
 * ```
 *
 * @param a The first input tensor. Must be of dtype bool.
 * @param b The second input tensor. Must be of dtype bool.
 *
 * @doc {heading: 'Operations', subheading: 'Logical'}
 */
function logicalXor_(a, b) {
    const $a = convertToTensor(a, 'a', 'logicalXor', 'bool');
    const $b = convertToTensor(b, 'b', 'logicalXor', 'bool');
    assertAndGetBroadcastShape($a.shape, $b.shape);
    // x ^ y = (x | y) & ~(x & y)
    return logicalAnd(logicalOr(a, b), logicalNot(logicalAnd(a, b)));
}
export const logicalXor = op({ logicalXor_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naWNhbF94b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9sb2dpY2FsX3hvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFHSCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHbkQsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDNUQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDdkMsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvQjs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNILFNBQVMsV0FBVyxDQUNoQixDQUFvQixFQUFFLENBQW9CO0lBQzVDLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN6RCxNQUFNLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDekQsMEJBQTBCLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFL0MsNkJBQTZCO0lBQzdCLE9BQU8sVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25FLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLEVBQUMsV0FBVyxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQge2Fzc2VydEFuZEdldEJyb2FkY2FzdFNoYXBlfSBmcm9tICcuL2Jyb2FkY2FzdF91dGlsJztcbmltcG9ydCB7bG9naWNhbEFuZH0gZnJvbSAnLi9sb2dpY2FsX2FuZCc7XG5pbXBvcnQge2xvZ2ljYWxOb3R9IGZyb20gJy4vbG9naWNhbF9ub3QnO1xuaW1wb3J0IHtsb2dpY2FsT3J9IGZyb20gJy4vbG9naWNhbF9vcic7XG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdHJ1dGggdmFsdWUgb2YgYGEgWE9SIGJgIGVsZW1lbnQtd2lzZS4gU3VwcG9ydHMgYnJvYWRjYXN0aW5nLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBhID0gdGYudGVuc29yMWQoW2ZhbHNlLCBmYWxzZSwgdHJ1ZSwgdHJ1ZV0sICdib29sJyk7XG4gKiBjb25zdCBiID0gdGYudGVuc29yMWQoW2ZhbHNlLCB0cnVlLCBmYWxzZSwgdHJ1ZV0sICdib29sJyk7XG4gKlxuICogYS5sb2dpY2FsWG9yKGIpLnByaW50KCk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gYSBUaGUgZmlyc3QgaW5wdXQgdGVuc29yLiBNdXN0IGJlIG9mIGR0eXBlIGJvb2wuXG4gKiBAcGFyYW0gYiBUaGUgc2Vjb25kIGlucHV0IHRlbnNvci4gTXVzdCBiZSBvZiBkdHlwZSBib29sLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdPcGVyYXRpb25zJywgc3ViaGVhZGluZzogJ0xvZ2ljYWwnfVxuICovXG5mdW5jdGlvbiBsb2dpY2FsWG9yXzxUIGV4dGVuZHMgVGVuc29yPihcbiAgICBhOiBUZW5zb3J8VGVuc29yTGlrZSwgYjogVGVuc29yfFRlbnNvckxpa2UpOiBUIHtcbiAgY29uc3QgJGEgPSBjb252ZXJ0VG9UZW5zb3IoYSwgJ2EnLCAnbG9naWNhbFhvcicsICdib29sJyk7XG4gIGNvbnN0ICRiID0gY29udmVydFRvVGVuc29yKGIsICdiJywgJ2xvZ2ljYWxYb3InLCAnYm9vbCcpO1xuICBhc3NlcnRBbmRHZXRCcm9hZGNhc3RTaGFwZSgkYS5zaGFwZSwgJGIuc2hhcGUpO1xuXG4gIC8vIHggXiB5ID0gKHggfCB5KSAmIH4oeCAmIHkpXG4gIHJldHVybiBsb2dpY2FsQW5kKGxvZ2ljYWxPcihhLCBiKSwgbG9naWNhbE5vdChsb2dpY2FsQW5kKGEsIGIpKSk7XG59XG5cbmV4cG9ydCBjb25zdCBsb2dpY2FsWG9yID0gb3Aoe2xvZ2ljYWxYb3JffSk7XG4iXX0=