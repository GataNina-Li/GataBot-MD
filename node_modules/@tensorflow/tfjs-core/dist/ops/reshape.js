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
import { Reshape } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Reshapes a `tf.Tensor` to a given shape.
 *
 * Given an input tensor, returns a new tensor with the same values as the
 * input tensor with shape `shape`.
 *
 * If one component of shape is the special value -1, the size of that
 * dimension is computed so that the total size remains constant. In
 * particular, a shape of [-1] flattens into 1-D. At most one component of
 * shape can be -1.
 *
 * If shape is 1-D or higher, then the operation returns a tensor with shape
 * shape filled with the values of tensor. In this case, the number of
 * elements implied by shape must be the same as the number of elements in
 * tensor.
 *
 * ```js
 * const x = tf.tensor1d([1, 2, 3, 4]);
 * x.reshape([2, 2]).print();
 * ```
 *
 * @param x The input tensor to be reshaped.
 * @param shape An array of integers defining the output tensor shape.
 *
 * @doc {heading: 'Tensors', subheading: 'Transformations'}
 */
function reshape_(x, shape) {
    const $x = convertToTensor(x, 'x', 'reshape', 'string_or_numeric');
    const inputs = { x: $x };
    const attrs = { shape };
    return ENGINE.runKernel(Reshape, inputs, attrs);
}
export const reshape = op({ reshape_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaGFwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3Jlc2hhcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsT0FBTyxFQUE4QixNQUFNLGlCQUFpQixDQUFDO0FBSXJFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUduRCxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRS9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUJHO0FBQ0gsU0FBUyxRQUFRLENBQ2IsQ0FBb0IsRUFBRSxLQUFrQjtJQUMxQyxNQUFNLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUVuRSxNQUFNLE1BQU0sR0FBa0IsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFDLENBQUM7SUFDdEMsTUFBTSxLQUFLLEdBQWlCLEVBQUMsS0FBSyxFQUFDLENBQUM7SUFDcEMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUNuQixPQUFPLEVBQUUsTUFBOEIsRUFBRSxLQUEyQixDQUFDLENBQUM7QUFDNUUsQ0FBQztBQUNELE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsRUFBQyxRQUFRLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7UmVzaGFwZSwgUmVzaGFwZUF0dHJzLCBSZXNoYXBlSW5wdXRzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7TmFtZWRUZW5zb3JNYXB9IGZyb20gJy4uL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7UmFuaywgU2hhcGVNYXAsIFRlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcblxuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuXG4vKipcbiAqIFJlc2hhcGVzIGEgYHRmLlRlbnNvcmAgdG8gYSBnaXZlbiBzaGFwZS5cbiAqXG4gKiBHaXZlbiBhbiBpbnB1dCB0ZW5zb3IsIHJldHVybnMgYSBuZXcgdGVuc29yIHdpdGggdGhlIHNhbWUgdmFsdWVzIGFzIHRoZVxuICogaW5wdXQgdGVuc29yIHdpdGggc2hhcGUgYHNoYXBlYC5cbiAqXG4gKiBJZiBvbmUgY29tcG9uZW50IG9mIHNoYXBlIGlzIHRoZSBzcGVjaWFsIHZhbHVlIC0xLCB0aGUgc2l6ZSBvZiB0aGF0XG4gKiBkaW1lbnNpb24gaXMgY29tcHV0ZWQgc28gdGhhdCB0aGUgdG90YWwgc2l6ZSByZW1haW5zIGNvbnN0YW50LiBJblxuICogcGFydGljdWxhciwgYSBzaGFwZSBvZiBbLTFdIGZsYXR0ZW5zIGludG8gMS1ELiBBdCBtb3N0IG9uZSBjb21wb25lbnQgb2ZcbiAqIHNoYXBlIGNhbiBiZSAtMS5cbiAqXG4gKiBJZiBzaGFwZSBpcyAxLUQgb3IgaGlnaGVyLCB0aGVuIHRoZSBvcGVyYXRpb24gcmV0dXJucyBhIHRlbnNvciB3aXRoIHNoYXBlXG4gKiBzaGFwZSBmaWxsZWQgd2l0aCB0aGUgdmFsdWVzIG9mIHRlbnNvci4gSW4gdGhpcyBjYXNlLCB0aGUgbnVtYmVyIG9mXG4gKiBlbGVtZW50cyBpbXBsaWVkIGJ5IHNoYXBlIG11c3QgYmUgdGhlIHNhbWUgYXMgdGhlIG51bWJlciBvZiBlbGVtZW50cyBpblxuICogdGVuc29yLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCB4ID0gdGYudGVuc29yMWQoWzEsIDIsIDMsIDRdKTtcbiAqIHgucmVzaGFwZShbMiwgMl0pLnByaW50KCk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0geCBUaGUgaW5wdXQgdGVuc29yIHRvIGJlIHJlc2hhcGVkLlxuICogQHBhcmFtIHNoYXBlIEFuIGFycmF5IG9mIGludGVnZXJzIGRlZmluaW5nIHRoZSBvdXRwdXQgdGVuc29yIHNoYXBlLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdUZW5zb3JzJywgc3ViaGVhZGluZzogJ1RyYW5zZm9ybWF0aW9ucyd9XG4gKi9cbmZ1bmN0aW9uIHJlc2hhcGVfPFIgZXh0ZW5kcyBSYW5rPihcbiAgICB4OiBUZW5zb3J8VGVuc29yTGlrZSwgc2hhcGU6IFNoYXBlTWFwW1JdKTogVGVuc29yPFI+IHtcbiAgY29uc3QgJHggPSBjb252ZXJ0VG9UZW5zb3IoeCwgJ3gnLCAncmVzaGFwZScsICdzdHJpbmdfb3JfbnVtZXJpYycpO1xuXG4gIGNvbnN0IGlucHV0czogUmVzaGFwZUlucHV0cyA9IHt4OiAkeH07XG4gIGNvbnN0IGF0dHJzOiBSZXNoYXBlQXR0cnMgPSB7c2hhcGV9O1xuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChcbiAgICAgIFJlc2hhcGUsIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCwgYXR0cnMgYXMge30gYXMgTmFtZWRBdHRyTWFwKTtcbn1cbmV4cG9ydCBjb25zdCByZXNoYXBlID0gb3Aoe3Jlc2hhcGVffSk7XG4iXX0=