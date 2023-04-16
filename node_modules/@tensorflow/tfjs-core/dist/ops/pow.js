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
import { Pow } from '../kernel_names';
import { makeTypesMatch } from '../tensor_util';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Computes the power of one `tf.Tensor` to another. Supports broadcasting.
 *
 * Given a `tf.Tensor` x and a `tf.Tensor` y, this operation computes x^y for
 * corresponding elements in x and y. The result's dtype will be the upcasted
 * type of the `base` and `exp` dtypes.
 *
 * ```js
 * const a = tf.tensor([[2, 3], [4, 5]])
 * const b = tf.tensor([[1, 2], [3, 0]]).toInt();
 *
 * a.pow(b).print();  // or tf.pow(a, b)
 * ```
 *
 * ```js
 * const a = tf.tensor([[1, 2], [3, 4]])
 * const b = tf.tensor(2).toInt();
 *
 * a.pow(b).print();  // or tf.pow(a, b)
 * ```
 * We also expose `powStrict` which has the same signature as this op and
 * asserts that `base` and `exp` are the same shape (does not broadcast).
 *
 * @param base The base `tf.Tensor` to pow element-wise.
 * @param exp The exponent `tf.Tensor` to pow element-wise.
 *
 * @doc {heading: 'Operations', subheading: 'Arithmetic'}
 */
function pow_(base, exp) {
    let $base = convertToTensor(base, 'base', 'pow');
    let $exp = convertToTensor(exp, 'exp', 'pow');
    [$base, $exp] = makeTypesMatch($base, $exp);
    const inputs = { a: $base, b: $exp };
    return ENGINE.runKernel(Pow, inputs);
}
export const pow = op({ pow_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvcG93LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLEdBQUcsRUFBWSxNQUFNLGlCQUFpQixDQUFDO0FBRy9DLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHbkQsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkJHO0FBQ0gsU0FBUyxJQUFJLENBQ1QsSUFBdUIsRUFBRSxHQUFzQjtJQUNqRCxJQUFJLEtBQUssR0FBRyxlQUFlLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNqRCxJQUFJLElBQUksR0FBRyxlQUFlLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM5QyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxjQUFjLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBRTVDLE1BQU0sTUFBTSxHQUFjLEVBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFDLENBQUM7SUFFOUMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxNQUE4QixDQUFDLENBQUM7QUFDL0QsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge1BvdywgUG93SW5wdXRzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHttYWtlVHlwZXNNYXRjaH0gZnJvbSAnLi4vdGVuc29yX3V0aWwnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcblxuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuXG4vKipcbiAqIENvbXB1dGVzIHRoZSBwb3dlciBvZiBvbmUgYHRmLlRlbnNvcmAgdG8gYW5vdGhlci4gU3VwcG9ydHMgYnJvYWRjYXN0aW5nLlxuICpcbiAqIEdpdmVuIGEgYHRmLlRlbnNvcmAgeCBhbmQgYSBgdGYuVGVuc29yYCB5LCB0aGlzIG9wZXJhdGlvbiBjb21wdXRlcyB4XnkgZm9yXG4gKiBjb3JyZXNwb25kaW5nIGVsZW1lbnRzIGluIHggYW5kIHkuIFRoZSByZXN1bHQncyBkdHlwZSB3aWxsIGJlIHRoZSB1cGNhc3RlZFxuICogdHlwZSBvZiB0aGUgYGJhc2VgIGFuZCBgZXhwYCBkdHlwZXMuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGEgPSB0Zi50ZW5zb3IoW1syLCAzXSwgWzQsIDVdXSlcbiAqIGNvbnN0IGIgPSB0Zi50ZW5zb3IoW1sxLCAyXSwgWzMsIDBdXSkudG9JbnQoKTtcbiAqXG4gKiBhLnBvdyhiKS5wcmludCgpOyAgLy8gb3IgdGYucG93KGEsIGIpXG4gKiBgYGBcbiAqXG4gKiBgYGBqc1xuICogY29uc3QgYSA9IHRmLnRlbnNvcihbWzEsIDJdLCBbMywgNF1dKVxuICogY29uc3QgYiA9IHRmLnRlbnNvcigyKS50b0ludCgpO1xuICpcbiAqIGEucG93KGIpLnByaW50KCk7ICAvLyBvciB0Zi5wb3coYSwgYilcbiAqIGBgYFxuICogV2UgYWxzbyBleHBvc2UgYHBvd1N0cmljdGAgd2hpY2ggaGFzIHRoZSBzYW1lIHNpZ25hdHVyZSBhcyB0aGlzIG9wIGFuZFxuICogYXNzZXJ0cyB0aGF0IGBiYXNlYCBhbmQgYGV4cGAgYXJlIHRoZSBzYW1lIHNoYXBlIChkb2VzIG5vdCBicm9hZGNhc3QpLlxuICpcbiAqIEBwYXJhbSBiYXNlIFRoZSBiYXNlIGB0Zi5UZW5zb3JgIHRvIHBvdyBlbGVtZW50LXdpc2UuXG4gKiBAcGFyYW0gZXhwIFRoZSBleHBvbmVudCBgdGYuVGVuc29yYCB0byBwb3cgZWxlbWVudC13aXNlLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdPcGVyYXRpb25zJywgc3ViaGVhZGluZzogJ0FyaXRobWV0aWMnfVxuICovXG5mdW5jdGlvbiBwb3dfPFQgZXh0ZW5kcyBUZW5zb3I+KFxuICAgIGJhc2U6IFRlbnNvcnxUZW5zb3JMaWtlLCBleHA6IFRlbnNvcnxUZW5zb3JMaWtlKTogVCB7XG4gIGxldCAkYmFzZSA9IGNvbnZlcnRUb1RlbnNvcihiYXNlLCAnYmFzZScsICdwb3cnKTtcbiAgbGV0ICRleHAgPSBjb252ZXJ0VG9UZW5zb3IoZXhwLCAnZXhwJywgJ3BvdycpO1xuICBbJGJhc2UsICRleHBdID0gbWFrZVR5cGVzTWF0Y2goJGJhc2UsICRleHApO1xuXG4gIGNvbnN0IGlucHV0czogUG93SW5wdXRzID0ge2E6ICRiYXNlLCBiOiAkZXhwfTtcblxuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChQb3csIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCk7XG59XG5cbmV4cG9ydCBjb25zdCBwb3cgPSBvcCh7cG93X30pO1xuIl19