/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
import { inferShape } from '../tensor_util_env';
import { makeTensor } from './tensor_ops_util';
/**
 * Creates a `tf.Tensor` with the provided values, shape and dtype.
 *
 * ```js
 * // Pass an array of values to create a vector.
 * tf.tensor([1, 2, 3, 4]).print();
 * ```
 *
 * ```js
 * // Pass a nested array of values to make a matrix or a higher
 * // dimensional tensor.
 * tf.tensor([[1, 2], [3, 4]]).print();
 * ```
 *
 * ```js
 * // Pass a flat array and specify a shape yourself.
 * tf.tensor([1, 2, 3, 4], [2, 2]).print();
 * ```
 *
 * @param values The values of the tensor. Can be nested array of numbers,
 *     or a flat array, or a `TypedArray`. If the values are strings,
 *     they will be encoded as utf-8 and kept as `Uint8Array[]`.
 * @param shape The shape of the tensor. Optional. If not provided,
 *   it is inferred from `values`.
 * @param dtype The data type.
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
export function tensor(values, shape, dtype) {
    const inferredShape = inferShape(values, dtype);
    return makeTensor(values, shape, inferredShape, dtype);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVuc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvdGVuc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUdILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUk5QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFN0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJCRztBQUNILE1BQU0sVUFBVSxNQUFNLENBQ2xCLE1BQWtCLEVBQUUsS0FBbUIsRUFBRSxLQUFnQjtJQUMzRCxNQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2hELE9BQU8sVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBYyxDQUFDO0FBQ3RFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtpbmZlclNoYXBlfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge0RhdGFUeXBlLCBSYW5rLCBTaGFwZU1hcH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQge21ha2VUZW5zb3J9IGZyb20gJy4vdGVuc29yX29wc191dGlsJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgYHRmLlRlbnNvcmAgd2l0aCB0aGUgcHJvdmlkZWQgdmFsdWVzLCBzaGFwZSBhbmQgZHR5cGUuXG4gKlxuICogYGBganNcbiAqIC8vIFBhc3MgYW4gYXJyYXkgb2YgdmFsdWVzIHRvIGNyZWF0ZSBhIHZlY3Rvci5cbiAqIHRmLnRlbnNvcihbMSwgMiwgMywgNF0pLnByaW50KCk7XG4gKiBgYGBcbiAqXG4gKiBgYGBqc1xuICogLy8gUGFzcyBhIG5lc3RlZCBhcnJheSBvZiB2YWx1ZXMgdG8gbWFrZSBhIG1hdHJpeCBvciBhIGhpZ2hlclxuICogLy8gZGltZW5zaW9uYWwgdGVuc29yLlxuICogdGYudGVuc29yKFtbMSwgMl0sIFszLCA0XV0pLnByaW50KCk7XG4gKiBgYGBcbiAqXG4gKiBgYGBqc1xuICogLy8gUGFzcyBhIGZsYXQgYXJyYXkgYW5kIHNwZWNpZnkgYSBzaGFwZSB5b3Vyc2VsZi5cbiAqIHRmLnRlbnNvcihbMSwgMiwgMywgNF0sIFsyLCAyXSkucHJpbnQoKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB2YWx1ZXMgVGhlIHZhbHVlcyBvZiB0aGUgdGVuc29yLiBDYW4gYmUgbmVzdGVkIGFycmF5IG9mIG51bWJlcnMsXG4gKiAgICAgb3IgYSBmbGF0IGFycmF5LCBvciBhIGBUeXBlZEFycmF5YC4gSWYgdGhlIHZhbHVlcyBhcmUgc3RyaW5ncyxcbiAqICAgICB0aGV5IHdpbGwgYmUgZW5jb2RlZCBhcyB1dGYtOCBhbmQga2VwdCBhcyBgVWludDhBcnJheVtdYC5cbiAqIEBwYXJhbSBzaGFwZSBUaGUgc2hhcGUgb2YgdGhlIHRlbnNvci4gT3B0aW9uYWwuIElmIG5vdCBwcm92aWRlZCxcbiAqICAgaXQgaXMgaW5mZXJyZWQgZnJvbSBgdmFsdWVzYC5cbiAqIEBwYXJhbSBkdHlwZSBUaGUgZGF0YSB0eXBlLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdUZW5zb3JzJywgc3ViaGVhZGluZzogJ0NyZWF0aW9uJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRlbnNvcjxSIGV4dGVuZHMgUmFuaz4oXG4gICAgdmFsdWVzOiBUZW5zb3JMaWtlLCBzaGFwZT86IFNoYXBlTWFwW1JdLCBkdHlwZT86IERhdGFUeXBlKTogVGVuc29yPFI+IHtcbiAgY29uc3QgaW5mZXJyZWRTaGFwZSA9IGluZmVyU2hhcGUodmFsdWVzLCBkdHlwZSk7XG4gIHJldHVybiBtYWtlVGVuc29yKHZhbHVlcywgc2hhcGUsIGluZmVycmVkU2hhcGUsIGR0eXBlKSBhcyBUZW5zb3I8Uj47XG59XG4iXX0=