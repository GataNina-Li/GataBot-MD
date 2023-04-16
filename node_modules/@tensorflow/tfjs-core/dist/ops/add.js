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
import { Add } from '../kernel_names';
import { makeTypesMatch } from '../tensor_util';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Adds two `tf.Tensor`s element-wise, A + B. Supports broadcasting.
 *
 *
 * ```js
 * const a = tf.tensor1d([1, 2, 3, 4]);
 * const b = tf.tensor1d([10, 20, 30, 40]);
 *
 * a.add(b).print();  // or tf.add(a, b)
 * ```
 *
 * ```js
 * // Broadcast add a with b.
 * const a = tf.scalar(5);
 * const b = tf.tensor1d([10, 20, 30, 40]);
 *
 * a.add(b).print();  // or tf.add(a, b)
 * ```
 * @param a The first `tf.Tensor` to add.
 * @param b The second `tf.Tensor` to add. Must have the same type as `a`.
 *
 * @doc {heading: 'Operations', subheading: 'Arithmetic'}
 */
function add_(a, b) {
    let $a = convertToTensor(a, 'a', 'add');
    let $b = convertToTensor(b, 'b', 'add');
    [$a, $b] = makeTypesMatch($a, $b);
    const inputs = { a: $a, b: $b };
    return ENGINE.runKernel(Add, inputs);
}
export const add = op({ add_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvYWRkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLEdBQUcsRUFBWSxNQUFNLGlCQUFpQixDQUFDO0FBRy9DLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHbkQsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCRztBQUNILFNBQVMsSUFBSSxDQUFtQixDQUFvQixFQUFFLENBQW9CO0lBQ3hFLElBQUksRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLElBQUksRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFbEMsTUFBTSxNQUFNLEdBQWMsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUMsQ0FBQztJQUV6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLE1BQThCLENBQUMsQ0FBQztBQUMvRCxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7QWRkLCBBZGRJbnB1dHN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7TmFtZWRUZW5zb3JNYXB9IGZyb20gJy4uL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQge21ha2VUeXBlc01hdGNofSBmcm9tICcuLi90ZW5zb3JfdXRpbCc7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5cbi8qKlxuICogQWRkcyB0d28gYHRmLlRlbnNvcmBzIGVsZW1lbnQtd2lzZSwgQSArIEIuIFN1cHBvcnRzIGJyb2FkY2FzdGluZy5cbiAqXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMSwgMiwgMywgNF0pO1xuICogY29uc3QgYiA9IHRmLnRlbnNvcjFkKFsxMCwgMjAsIDMwLCA0MF0pO1xuICpcbiAqIGEuYWRkKGIpLnByaW50KCk7ICAvLyBvciB0Zi5hZGQoYSwgYilcbiAqIGBgYFxuICpcbiAqIGBgYGpzXG4gKiAvLyBCcm9hZGNhc3QgYWRkIGEgd2l0aCBiLlxuICogY29uc3QgYSA9IHRmLnNjYWxhcig1KTtcbiAqIGNvbnN0IGIgPSB0Zi50ZW5zb3IxZChbMTAsIDIwLCAzMCwgNDBdKTtcbiAqXG4gKiBhLmFkZChiKS5wcmludCgpOyAgLy8gb3IgdGYuYWRkKGEsIGIpXG4gKiBgYGBcbiAqIEBwYXJhbSBhIFRoZSBmaXJzdCBgdGYuVGVuc29yYCB0byBhZGQuXG4gKiBAcGFyYW0gYiBUaGUgc2Vjb25kIGB0Zi5UZW5zb3JgIHRvIGFkZC4gTXVzdCBoYXZlIHRoZSBzYW1lIHR5cGUgYXMgYGFgLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdPcGVyYXRpb25zJywgc3ViaGVhZGluZzogJ0FyaXRobWV0aWMnfVxuICovXG5mdW5jdGlvbiBhZGRfPFQgZXh0ZW5kcyBUZW5zb3I+KGE6IFRlbnNvcnxUZW5zb3JMaWtlLCBiOiBUZW5zb3J8VGVuc29yTGlrZSk6IFQge1xuICBsZXQgJGEgPSBjb252ZXJ0VG9UZW5zb3IoYSwgJ2EnLCAnYWRkJyk7XG4gIGxldCAkYiA9IGNvbnZlcnRUb1RlbnNvcihiLCAnYicsICdhZGQnKTtcbiAgWyRhLCAkYl0gPSBtYWtlVHlwZXNNYXRjaCgkYSwgJGIpO1xuXG4gIGNvbnN0IGlucHV0czogQWRkSW5wdXRzID0ge2E6ICRhLCBiOiAkYn07XG5cbiAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoQWRkLCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXApO1xufVxuXG5leHBvcnQgY29uc3QgYWRkID0gb3Aoe2FkZF99KTtcbiJdfQ==