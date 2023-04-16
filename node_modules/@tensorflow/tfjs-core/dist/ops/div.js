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
import { RealDiv } from '../kernel_names';
import { makeTypesMatch } from '../tensor_util';
import { convertToTensor } from '../tensor_util_env';
import { floorDiv } from './floorDiv';
import { op } from './operation';
/**
 * Divides two `tf.Tensor`s element-wise, A / B. Supports broadcasting.
 *
 * ```js
 * const a = tf.tensor1d([1, 4, 9, 16]);
 * const b = tf.tensor1d([1, 2, 3, 4]);
 *
 * a.div(b).print();  // or tf.div(a, b)
 * ```
 *
 * ```js
 * // Broadcast div a with b.
 * const a = tf.tensor1d([2, 4, 6, 8]);
 * const b = tf.scalar(2);
 *
 * a.div(b).print();  // or tf.div(a, b)
 * ```
 *
 * @param a The first tensor as the numerator.
 * @param b The second tensor as the denominator. Must have the same dtype as
 * `a`.
 *
 * @doc {heading: 'Operations', subheading: 'Arithmetic'}
 */
function div_(a, b) {
    let $a = convertToTensor(a, 'a', 'div');
    let $b = convertToTensor(b, 'b', 'div');
    [$a, $b] = makeTypesMatch($a, $b);
    if ($a.dtype === 'int32' && $b.dtype === 'int32') {
        return floorDiv($a, $b);
    }
    const inputs = { a: $a, b: $b };
    const attrs = {};
    // tslint:disable-next-line: no-unnecessary-type-assertion
    return ENGINE.runKernel(RealDiv, inputs, attrs);
}
export const div = op({ div_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGl2LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvZGl2LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLE9BQU8sRUFBZ0IsTUFBTSxpQkFBaUIsQ0FBQztBQUd2RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBR25ELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDcEMsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Qkc7QUFDSCxTQUFTLElBQUksQ0FBbUIsQ0FBb0IsRUFBRSxDQUFvQjtJQUN4RSxJQUFJLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN4QyxJQUFJLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN4QyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxjQUFjLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRWxDLElBQUksRUFBRSxDQUFDLEtBQUssS0FBSyxPQUFPLElBQUksRUFBRSxDQUFDLEtBQUssS0FBSyxPQUFPLEVBQUU7UUFDaEQsT0FBTyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ3pCO0lBRUQsTUFBTSxNQUFNLEdBQWtCLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFDLENBQUM7SUFDN0MsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBRWpCLDBEQUEwRDtJQUMxRCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQThCLEVBQUUsS0FBSyxDQUFNLENBQUM7QUFDL0UsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7UmVhbERpdiwgUmVhbERpdklucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7bWFrZVR5cGVzTWF0Y2h9IGZyb20gJy4uL3RlbnNvcl91dGlsJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7Zmxvb3JEaXZ9IGZyb20gJy4vZmxvb3JEaXYnO1xuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuXG4vKipcbiAqIERpdmlkZXMgdHdvIGB0Zi5UZW5zb3JgcyBlbGVtZW50LXdpc2UsIEEgLyBCLiBTdXBwb3J0cyBicm9hZGNhc3RpbmcuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMSwgNCwgOSwgMTZdKTtcbiAqIGNvbnN0IGIgPSB0Zi50ZW5zb3IxZChbMSwgMiwgMywgNF0pO1xuICpcbiAqIGEuZGl2KGIpLnByaW50KCk7ICAvLyBvciB0Zi5kaXYoYSwgYilcbiAqIGBgYFxuICpcbiAqIGBgYGpzXG4gKiAvLyBCcm9hZGNhc3QgZGl2IGEgd2l0aCBiLlxuICogY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsyLCA0LCA2LCA4XSk7XG4gKiBjb25zdCBiID0gdGYuc2NhbGFyKDIpO1xuICpcbiAqIGEuZGl2KGIpLnByaW50KCk7ICAvLyBvciB0Zi5kaXYoYSwgYilcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBhIFRoZSBmaXJzdCB0ZW5zb3IgYXMgdGhlIG51bWVyYXRvci5cbiAqIEBwYXJhbSBiIFRoZSBzZWNvbmQgdGVuc29yIGFzIHRoZSBkZW5vbWluYXRvci4gTXVzdCBoYXZlIHRoZSBzYW1lIGR0eXBlIGFzXG4gKiBgYWAuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ09wZXJhdGlvbnMnLCBzdWJoZWFkaW5nOiAnQXJpdGhtZXRpYyd9XG4gKi9cbmZ1bmN0aW9uIGRpdl88VCBleHRlbmRzIFRlbnNvcj4oYTogVGVuc29yfFRlbnNvckxpa2UsIGI6IFRlbnNvcnxUZW5zb3JMaWtlKTogVCB7XG4gIGxldCAkYSA9IGNvbnZlcnRUb1RlbnNvcihhLCAnYScsICdkaXYnKTtcbiAgbGV0ICRiID0gY29udmVydFRvVGVuc29yKGIsICdiJywgJ2RpdicpO1xuICBbJGEsICRiXSA9IG1ha2VUeXBlc01hdGNoKCRhLCAkYik7XG5cbiAgaWYgKCRhLmR0eXBlID09PSAnaW50MzInICYmICRiLmR0eXBlID09PSAnaW50MzInKSB7XG4gICAgcmV0dXJuIGZsb29yRGl2KCRhLCAkYik7XG4gIH1cblxuICBjb25zdCBpbnB1dHM6IFJlYWxEaXZJbnB1dHMgPSB7YTogJGEsIGI6ICRifTtcbiAgY29uc3QgYXR0cnMgPSB7fTtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVubmVjZXNzYXJ5LXR5cGUtYXNzZXJ0aW9uXG4gIHJldHVybiBFTkdJTkUucnVuS2VybmVsKFJlYWxEaXYsIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCwgYXR0cnMpIGFzIFQ7XG59XG5cbmV4cG9ydCBjb25zdCBkaXYgPSBvcCh7ZGl2X30pO1xuIl19