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
import { Unpack } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { op } from './operation';
/**
 * Unstacks a `tf.Tensor` of rank-`R` into a list of rank-`(R-1)` `tf.Tensor`s.
 *
 * ```js
 * const a = tf.tensor2d([1, 2, 3, 4], [2, 2]);
 *
 * tf.unstack(a).forEach(tensor => tensor.print());
 * ```
 *
 * @param x A tensor object.
 * @param axis The axis to unstack along. Defaults to 0 (the first dim).
 *
 * @doc {heading: 'Tensors', subheading: 'Slicing and Joining'}
 */
function unstack_(x, axis = 0) {
    const $x = convertToTensor(x, 'x', 'unstack', 'string_or_numeric');
    util.assert(axis >= -$x.shape.length && axis < $x.shape.length, () => `Axis = ${axis} is not in [-${$x.shape.length}, ${$x.shape.length})`);
    const inputs = { value: $x };
    const attrs = { axis };
    return ENGINE.runKernel(Unpack, inputs, attrs);
}
export const unstack = op({ unstack_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3Vuc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsTUFBTSxFQUE0QixNQUFNLGlCQUFpQixDQUFDO0FBSWxFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUVuRCxPQUFPLEtBQUssSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUVoQyxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRS9COzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxTQUFTLFFBQVEsQ0FBQyxDQUFvQixFQUFFLElBQUksR0FBRyxDQUFDO0lBQzlDLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQ25FLElBQUksQ0FBQyxNQUFNLENBQ1AsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUNsRCxHQUFHLEVBQUUsQ0FDRCxVQUFVLElBQUksZ0JBQWdCLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUU5RSxNQUFNLE1BQU0sR0FBaUIsRUFBQyxLQUFLLEVBQUUsRUFBRSxFQUFDLENBQUM7SUFDekMsTUFBTSxLQUFLLEdBQWdCLEVBQUMsSUFBSSxFQUFDLENBQUM7SUFFbEMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUNuQixNQUFNLEVBQUUsTUFBOEIsRUFBRSxLQUEyQixDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsRUFBQyxRQUFRLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7VW5wYWNrLCBVbnBhY2tBdHRycywgVW5wYWNrSW5wdXRzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7TmFtZWRUZW5zb3JNYXB9IGZyb20gJy4uL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi91dGlsJztcblxuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuXG4vKipcbiAqIFVuc3RhY2tzIGEgYHRmLlRlbnNvcmAgb2YgcmFuay1gUmAgaW50byBhIGxpc3Qgb2YgcmFuay1gKFItMSlgIGB0Zi5UZW5zb3Jgcy5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgYSA9IHRmLnRlbnNvcjJkKFsxLCAyLCAzLCA0XSwgWzIsIDJdKTtcbiAqXG4gKiB0Zi51bnN0YWNrKGEpLmZvckVhY2godGVuc29yID0+IHRlbnNvci5wcmludCgpKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB4IEEgdGVuc29yIG9iamVjdC5cbiAqIEBwYXJhbSBheGlzIFRoZSBheGlzIHRvIHVuc3RhY2sgYWxvbmcuIERlZmF1bHRzIHRvIDAgKHRoZSBmaXJzdCBkaW0pLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdUZW5zb3JzJywgc3ViaGVhZGluZzogJ1NsaWNpbmcgYW5kIEpvaW5pbmcnfVxuICovXG5mdW5jdGlvbiB1bnN0YWNrXyh4OiBUZW5zb3J8VGVuc29yTGlrZSwgYXhpcyA9IDApOiBUZW5zb3JbXSB7XG4gIGNvbnN0ICR4ID0gY29udmVydFRvVGVuc29yKHgsICd4JywgJ3Vuc3RhY2snLCAnc3RyaW5nX29yX251bWVyaWMnKTtcbiAgdXRpbC5hc3NlcnQoXG4gICAgICBheGlzID49IC0keC5zaGFwZS5sZW5ndGggJiYgYXhpcyA8ICR4LnNoYXBlLmxlbmd0aCxcbiAgICAgICgpID0+XG4gICAgICAgICAgYEF4aXMgPSAke2F4aXN9IGlzIG5vdCBpbiBbLSR7JHguc2hhcGUubGVuZ3RofSwgJHskeC5zaGFwZS5sZW5ndGh9KWApO1xuXG4gIGNvbnN0IGlucHV0czogVW5wYWNrSW5wdXRzID0ge3ZhbHVlOiAkeH07XG4gIGNvbnN0IGF0dHJzOiBVbnBhY2tBdHRycyA9IHtheGlzfTtcblxuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChcbiAgICAgIFVucGFjaywgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLCBhdHRycyBhcyB7fSBhcyBOYW1lZEF0dHJNYXApO1xufVxuXG5leHBvcnQgY29uc3QgdW5zdGFjayA9IG9wKHt1bnN0YWNrX30pO1xuIl19