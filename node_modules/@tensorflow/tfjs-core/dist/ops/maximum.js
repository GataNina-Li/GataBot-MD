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
import { Maximum } from '../kernel_names';
import { makeTypesMatch } from '../tensor_util';
import { convertToTensor } from '../tensor_util_env';
import { assertAndGetBroadcastShape } from './broadcast_util';
import { cast } from './cast';
import { op } from './operation';
/**
 * Returns the max of a and b (`a > b ? a : b`) element-wise.
 * Supports broadcasting.
 *
 * We also expose `tf.maximumStrict` which has the same signature as this op and
 * asserts that `a` and `b` are the same shape (does not broadcast).
 *
 * ```js
 * const a = tf.tensor1d([1, 4, 3, 16]);
 * const b = tf.tensor1d([1, 2, 9, 4]);
 *
 * a.maximum(b).print();  // or tf.maximum(a, b)
 * ```
 *
 * ```js
 * // Broadcast maximum a with b.
 * const a = tf.tensor1d([2, 4, 6, 8]);
 * const b = tf.scalar(5);
 *
 * a.maximum(b).print();  // or tf.maximum(a, b)
 * ```
 *
 * @param a The first tensor.
 * @param b The second tensor. Must have the same type as `a`.
 *
 * @doc {heading: 'Operations', subheading: 'Arithmetic'}
 */
function maximum_(a, b) {
    let $a = convertToTensor(a, 'a', 'maximum');
    let $b = convertToTensor(b, 'b', 'maximum');
    [$a, $b] = makeTypesMatch($a, $b);
    if ($a.dtype === 'bool') {
        $a = cast($a, 'int32');
        $b = cast($b, 'int32');
    }
    assertAndGetBroadcastShape($a.shape, $b.shape);
    const inputs = { a: $a, b: $b };
    return ENGINE.runKernel(Maximum, inputs);
}
export const maximum = op({ maximum_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4aW11bS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL21heGltdW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsT0FBTyxFQUFnQixNQUFNLGlCQUFpQixDQUFDO0FBR3ZELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHbkQsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDNUQsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRS9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBCRztBQUNILFNBQVMsUUFBUSxDQUNiLENBQW9CLEVBQUUsQ0FBb0I7SUFDNUMsSUFBSSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDNUMsSUFBSSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDNUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUVsQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEtBQUssTUFBTSxFQUFFO1FBQ3ZCLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZCLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3hCO0lBQ0QsMEJBQTBCLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFL0MsTUFBTSxNQUFNLEdBQWtCLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFDLENBQUM7SUFFN0MsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxNQUE4QixDQUFDLENBQUM7QUFDbkUsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsRUFBQyxRQUFRLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7TWF4aW11bSwgTWF4aW11bUlucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7bWFrZVR5cGVzTWF0Y2h9IGZyb20gJy4uL3RlbnNvcl91dGlsJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7YXNzZXJ0QW5kR2V0QnJvYWRjYXN0U2hhcGV9IGZyb20gJy4vYnJvYWRjYXN0X3V0aWwnO1xuaW1wb3J0IHtjYXN0fSBmcm9tICcuL2Nhc3QnO1xuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG1heCBvZiBhIGFuZCBiIChgYSA+IGIgPyBhIDogYmApIGVsZW1lbnQtd2lzZS5cbiAqIFN1cHBvcnRzIGJyb2FkY2FzdGluZy5cbiAqXG4gKiBXZSBhbHNvIGV4cG9zZSBgdGYubWF4aW11bVN0cmljdGAgd2hpY2ggaGFzIHRoZSBzYW1lIHNpZ25hdHVyZSBhcyB0aGlzIG9wIGFuZFxuICogYXNzZXJ0cyB0aGF0IGBhYCBhbmQgYGJgIGFyZSB0aGUgc2FtZSBzaGFwZSAoZG9lcyBub3QgYnJvYWRjYXN0KS5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLCA0LCAzLCAxNl0pO1xuICogY29uc3QgYiA9IHRmLnRlbnNvcjFkKFsxLCAyLCA5LCA0XSk7XG4gKlxuICogYS5tYXhpbXVtKGIpLnByaW50KCk7ICAvLyBvciB0Zi5tYXhpbXVtKGEsIGIpXG4gKiBgYGBcbiAqXG4gKiBgYGBqc1xuICogLy8gQnJvYWRjYXN0IG1heGltdW0gYSB3aXRoIGIuXG4gKiBjb25zdCBhID0gdGYudGVuc29yMWQoWzIsIDQsIDYsIDhdKTtcbiAqIGNvbnN0IGIgPSB0Zi5zY2FsYXIoNSk7XG4gKlxuICogYS5tYXhpbXVtKGIpLnByaW50KCk7ICAvLyBvciB0Zi5tYXhpbXVtKGEsIGIpXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gYSBUaGUgZmlyc3QgdGVuc29yLlxuICogQHBhcmFtIGIgVGhlIHNlY29uZCB0ZW5zb3IuIE11c3QgaGF2ZSB0aGUgc2FtZSB0eXBlIGFzIGBhYC5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdBcml0aG1ldGljJ31cbiAqL1xuZnVuY3Rpb24gbWF4aW11bV88VCBleHRlbmRzIFRlbnNvcj4oXG4gICAgYTogVGVuc29yfFRlbnNvckxpa2UsIGI6IFRlbnNvcnxUZW5zb3JMaWtlKTogVCB7XG4gIGxldCAkYSA9IGNvbnZlcnRUb1RlbnNvcihhLCAnYScsICdtYXhpbXVtJyk7XG4gIGxldCAkYiA9IGNvbnZlcnRUb1RlbnNvcihiLCAnYicsICdtYXhpbXVtJyk7XG4gIFskYSwgJGJdID0gbWFrZVR5cGVzTWF0Y2goJGEsICRiKTtcblxuICBpZiAoJGEuZHR5cGUgPT09ICdib29sJykge1xuICAgICRhID0gY2FzdCgkYSwgJ2ludDMyJyk7XG4gICAgJGIgPSBjYXN0KCRiLCAnaW50MzInKTtcbiAgfVxuICBhc3NlcnRBbmRHZXRCcm9hZGNhc3RTaGFwZSgkYS5zaGFwZSwgJGIuc2hhcGUpO1xuXG4gIGNvbnN0IGlucHV0czogTWF4aW11bUlucHV0cyA9IHthOiAkYSwgYjogJGJ9O1xuXG4gIHJldHVybiBFTkdJTkUucnVuS2VybmVsKE1heGltdW0sIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCk7XG59XG5cbmV4cG9ydCBjb25zdCBtYXhpbXVtID0gb3Aoe21heGltdW1ffSk7XG4iXX0=