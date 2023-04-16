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
import { Multiply } from '../kernel_names';
import { makeTypesMatch } from '../tensor_util';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Multiplies two `tf.Tensor`s element-wise, A * B. Supports broadcasting.
 *
 * We also expose `tf.mulStrict` which has the same signature as this op and
 * asserts that `a` and `b` are the same shape (does not broadcast).
 *
 * ```js
 * const a = tf.tensor1d([1, 2, 3, 4]);
 * const b = tf.tensor1d([2, 3, 4, 5]);
 *
 * a.mul(b).print();  // or tf.mul(a, b)
 * ```
 *
 * ```js
 * // Broadcast mul a with b.
 * const a = tf.tensor1d([1, 2, 3, 4]);
 * const b = tf.scalar(5);
 *
 * a.mul(b).print();  // or tf.mul(a, b)
 * ```
 * @param a The first tensor to multiply.
 * @param b The second tensor to multiply. Must have the same dtype as `a`.
 *
 * @doc {heading: 'Operations', subheading: 'Arithmetic'}
 */
function mul_(a, b) {
    let $a = convertToTensor(a, 'a', 'mul');
    let $b = convertToTensor(b, 'b', 'mul');
    [$a, $b] = makeTypesMatch($a, $b);
    const inputs = { a: $a, b: $b };
    return ENGINE.runKernel(Multiply, inputs);
}
export const mul = op({ mul_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvbXVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLFFBQVEsRUFBaUIsTUFBTSxpQkFBaUIsQ0FBQztBQUd6RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBR25ELE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFL0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUNILFNBQVMsSUFBSSxDQUFtQixDQUFvQixFQUFFLENBQW9CO0lBQ3hFLElBQUksRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLElBQUksRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFbEMsTUFBTSxNQUFNLEdBQW1CLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFDLENBQUM7SUFFOUMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxNQUE4QixDQUFDLENBQUM7QUFDcEUsQ0FBQztBQUNELE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7TXVsdGlwbHksIE11bHRpcGx5SW5wdXRzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHttYWtlVHlwZXNNYXRjaH0gZnJvbSAnLi4vdGVuc29yX3V0aWwnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcblxuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuXG4vKipcbiAqIE11bHRpcGxpZXMgdHdvIGB0Zi5UZW5zb3JgcyBlbGVtZW50LXdpc2UsIEEgKiBCLiBTdXBwb3J0cyBicm9hZGNhc3RpbmcuXG4gKlxuICogV2UgYWxzbyBleHBvc2UgYHRmLm11bFN0cmljdGAgd2hpY2ggaGFzIHRoZSBzYW1lIHNpZ25hdHVyZSBhcyB0aGlzIG9wIGFuZFxuICogYXNzZXJ0cyB0aGF0IGBhYCBhbmQgYGJgIGFyZSB0aGUgc2FtZSBzaGFwZSAoZG9lcyBub3QgYnJvYWRjYXN0KS5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzLCA0XSk7XG4gKiBjb25zdCBiID0gdGYudGVuc29yMWQoWzIsIDMsIDQsIDVdKTtcbiAqXG4gKiBhLm11bChiKS5wcmludCgpOyAgLy8gb3IgdGYubXVsKGEsIGIpXG4gKiBgYGBcbiAqXG4gKiBgYGBqc1xuICogLy8gQnJvYWRjYXN0IG11bCBhIHdpdGggYi5cbiAqIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMSwgMiwgMywgNF0pO1xuICogY29uc3QgYiA9IHRmLnNjYWxhcig1KTtcbiAqXG4gKiBhLm11bChiKS5wcmludCgpOyAgLy8gb3IgdGYubXVsKGEsIGIpXG4gKiBgYGBcbiAqIEBwYXJhbSBhIFRoZSBmaXJzdCB0ZW5zb3IgdG8gbXVsdGlwbHkuXG4gKiBAcGFyYW0gYiBUaGUgc2Vjb25kIHRlbnNvciB0byBtdWx0aXBseS4gTXVzdCBoYXZlIHRoZSBzYW1lIGR0eXBlIGFzIGBhYC5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdBcml0aG1ldGljJ31cbiAqL1xuZnVuY3Rpb24gbXVsXzxUIGV4dGVuZHMgVGVuc29yPihhOiBUZW5zb3J8VGVuc29yTGlrZSwgYjogVGVuc29yfFRlbnNvckxpa2UpOiBUIHtcbiAgbGV0ICRhID0gY29udmVydFRvVGVuc29yKGEsICdhJywgJ211bCcpO1xuICBsZXQgJGIgPSBjb252ZXJ0VG9UZW5zb3IoYiwgJ2InLCAnbXVsJyk7XG4gIFskYSwgJGJdID0gbWFrZVR5cGVzTWF0Y2goJGEsICRiKTtcblxuICBjb25zdCBpbnB1dHM6IE11bHRpcGx5SW5wdXRzID0ge2E6ICRhLCBiOiAkYn07XG5cbiAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoTXVsdGlwbHksIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCk7XG59XG5leHBvcnQgY29uc3QgbXVsID0gb3Aoe211bF99KTtcbiJdfQ==