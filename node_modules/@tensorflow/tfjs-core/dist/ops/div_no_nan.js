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
import { makeTypesMatch } from '../tensor_util';
import { convertToTensor } from '../tensor_util_env';
import { div } from './div';
import { equal } from './equal';
import { op } from './operation';
import { where } from './where';
import { zerosLike } from './zeros_like';
/**
 * Divides two `tf.Tensor`s element-wise, A / B. Supports broadcasting. Return 0
 * if denominator is 0.
 *
 *
 * ```js
 * const a = tf.tensor1d([1, 4, 9, 16]);
 * const b = tf.tensor1d([1, 2, 3, 4]);
 * const c = tf.tensor1d([0, 0, 0, 0]);
 *
 * a.divNoNan(b).print();  // or tf.divNoNan(a, b)
 * a.divNoNan(c).print();  // or tf.divNoNan(a, c)
 * ```
 *
 * ```js
 * // Broadcast div a with b.
 * const a = tf.tensor1d([2, 4, 6, 8]);
 * const b = tf.scalar(2);
 * const c = tf.scalar(0);
 *
 * a.divNoNan(b).print();  // or tf.divNoNan(a, b)
 * a.divNoNan(c).print();  // or tf.divNoNan(a, c)
 * ```
 *
 * @param a The first tensor as the numerator.
 * @param b The second tensor as the denominator. Must have the same dtype as
 * `a`.
 *
 * @doc {heading: 'Operations', subheading: 'Arithmetic'}
 */
function divNoNan_(a, b) {
    // TODO: Make this into its own kernel.
    let $a = convertToTensor(a, 'a', 'div');
    let $b = convertToTensor(b, 'b', 'div');
    [$a, $b] = makeTypesMatch($a, $b);
    const divResult = div($a, $b);
    const zeros = zerosLike(divResult);
    const bEqualsZero = equal($b, zeros);
    return where(bEqualsZero, zeros, divResult);
}
export const divNoNan = op({ divNoNan_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGl2X25vX25hbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2Rpdl9ub19uYW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBR0gsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUduRCxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDOUIsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMvQixPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQzlCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFdkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNkJHO0FBQ0gsU0FBUyxTQUFTLENBQ2QsQ0FBb0IsRUFBRSxDQUFvQjtJQUM1Qyx1Q0FBdUM7SUFDdkMsSUFBSSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDeEMsSUFBSSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDeEMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUVsQyxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzlCLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNuQyxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3JDLE9BQU8sS0FBSyxDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFNLENBQUM7QUFDbkQsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsRUFBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7bWFrZVR5cGVzTWF0Y2h9IGZyb20gJy4uL3RlbnNvcl91dGlsJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7ZGl2fSBmcm9tICcuL2Rpdic7XG5pbXBvcnQge2VxdWFsfSBmcm9tICcuL2VxdWFsJztcbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcbmltcG9ydCB7d2hlcmV9IGZyb20gJy4vd2hlcmUnO1xuaW1wb3J0IHt6ZXJvc0xpa2V9IGZyb20gJy4vemVyb3NfbGlrZSc7XG5cbi8qKlxuICogRGl2aWRlcyB0d28gYHRmLlRlbnNvcmBzIGVsZW1lbnQtd2lzZSwgQSAvIEIuIFN1cHBvcnRzIGJyb2FkY2FzdGluZy4gUmV0dXJuIDBcbiAqIGlmIGRlbm9taW5hdG9yIGlzIDAuXG4gKlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBhID0gdGYudGVuc29yMWQoWzEsIDQsIDksIDE2XSk7XG4gKiBjb25zdCBiID0gdGYudGVuc29yMWQoWzEsIDIsIDMsIDRdKTtcbiAqIGNvbnN0IGMgPSB0Zi50ZW5zb3IxZChbMCwgMCwgMCwgMF0pO1xuICpcbiAqIGEuZGl2Tm9OYW4oYikucHJpbnQoKTsgIC8vIG9yIHRmLmRpdk5vTmFuKGEsIGIpXG4gKiBhLmRpdk5vTmFuKGMpLnByaW50KCk7ICAvLyBvciB0Zi5kaXZOb05hbihhLCBjKVxuICogYGBgXG4gKlxuICogYGBganNcbiAqIC8vIEJyb2FkY2FzdCBkaXYgYSB3aXRoIGIuXG4gKiBjb25zdCBhID0gdGYudGVuc29yMWQoWzIsIDQsIDYsIDhdKTtcbiAqIGNvbnN0IGIgPSB0Zi5zY2FsYXIoMik7XG4gKiBjb25zdCBjID0gdGYuc2NhbGFyKDApO1xuICpcbiAqIGEuZGl2Tm9OYW4oYikucHJpbnQoKTsgIC8vIG9yIHRmLmRpdk5vTmFuKGEsIGIpXG4gKiBhLmRpdk5vTmFuKGMpLnByaW50KCk7ICAvLyBvciB0Zi5kaXZOb05hbihhLCBjKVxuICogYGBgXG4gKlxuICogQHBhcmFtIGEgVGhlIGZpcnN0IHRlbnNvciBhcyB0aGUgbnVtZXJhdG9yLlxuICogQHBhcmFtIGIgVGhlIHNlY29uZCB0ZW5zb3IgYXMgdGhlIGRlbm9taW5hdG9yLiBNdXN0IGhhdmUgdGhlIHNhbWUgZHR5cGUgYXNcbiAqIGBhYC5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdBcml0aG1ldGljJ31cbiAqL1xuZnVuY3Rpb24gZGl2Tm9OYW5fPFQgZXh0ZW5kcyBUZW5zb3I+KFxuICAgIGE6IFRlbnNvcnxUZW5zb3JMaWtlLCBiOiBUZW5zb3J8VGVuc29yTGlrZSk6IFQge1xuICAvLyBUT0RPOiBNYWtlIHRoaXMgaW50byBpdHMgb3duIGtlcm5lbC5cbiAgbGV0ICRhID0gY29udmVydFRvVGVuc29yKGEsICdhJywgJ2RpdicpO1xuICBsZXQgJGIgPSBjb252ZXJ0VG9UZW5zb3IoYiwgJ2InLCAnZGl2Jyk7XG4gIFskYSwgJGJdID0gbWFrZVR5cGVzTWF0Y2goJGEsICRiKTtcblxuICBjb25zdCBkaXZSZXN1bHQgPSBkaXYoJGEsICRiKTtcbiAgY29uc3QgemVyb3MgPSB6ZXJvc0xpa2UoZGl2UmVzdWx0KTtcbiAgY29uc3QgYkVxdWFsc1plcm8gPSBlcXVhbCgkYiwgemVyb3MpO1xuICByZXR1cm4gd2hlcmUoYkVxdWFsc1plcm8sIHplcm9zLCBkaXZSZXN1bHQpIGFzIFQ7XG59XG5cbmV4cG9ydCBjb25zdCBkaXZOb05hbiA9IG9wKHtkaXZOb05hbl99KTtcbiJdfQ==