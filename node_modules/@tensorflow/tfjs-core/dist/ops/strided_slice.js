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
import { ENGINE } from '../engine';
import { StridedSlice } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Extracts a strided slice of a tensor.
 *
 * Roughly speaking, this op extracts a slice of size (end-begin)/stride from
 * the given input tensor (x). Starting at the location specified by begin the
 * slice continues by adding stride to the index until all dimensions are not
 * less than end. Note that a stride can be negative, which causes a reverse
 * slice.
 *
 * ```js
 * const t = tf.tensor3d([1, 1, 1 ,2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6],
 *    [3, 2, 3]);
 * t.stridedSlice([1, 0, 0], [2, 1, 3], [1, 1, 1]).print()  // [[[3, 3, 3]]]
 * t.stridedSlice([1, 0, 0], [2, 2, 3], [1, 1, 1]).print()  // [[[3, 3, 3],
 *                                                     // [4, 4, 4]]]
 * t.stridedSlice([1, -1, 0], [2, -3, 3], [1, -1, 1]).print() // [[[4, 4, 4],
 *                                                     // [3, 3, 3]]]
 * ```
 *
 * @param x The tensor to stride slice.
 * @param begin The coordinates to start the slice from.
 * @param end: The coordinates to end the slice at.
 * @param strides: The size of the slice.
 * @param beginMask: If the ith bit of beginMask is set, begin[i] is ignored
 *      and the fullest possible range in that dimension is used instead.
 * @param endMask: If the ith bit of endMask is set, end[i] is ignored
 *      and the fullest possible range in that dimension is used instead.
 * @param shrinkAxisMask: a bitmask where bit i implies that
 * the ith specification should shrink the dimensionality. begin and end must
 * imply a slice of size 1 in the dimension.
 *
 * @doc {heading: 'Operations', subheading: 'Slicing and Joining'}
 */
function stridedSlice_(x, begin, end, strides, beginMask = 0, endMask = 0, ellipsisMask = 0, newAxisMask = 0, shrinkAxisMask = 0) {
    const $x = convertToTensor(x, 'x', 'stridedSlice', 'string_or_numeric');
    const inputs = { x: $x };
    const attrs = {
        begin,
        end,
        strides,
        beginMask,
        endMask,
        ellipsisMask,
        newAxisMask,
        shrinkAxisMask
    };
    return ENGINE.runKernel(StridedSlice, inputs, attrs);
}
export const stridedSlice = op({ stridedSlice_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaWRlZF9zbGljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3N0cmlkZWRfc2xpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsWUFBWSxFQUF3QyxNQUFNLGlCQUFpQixDQUFDO0FBSXBGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUduRCxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRS9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWdDRztBQUNILFNBQVMsYUFBYSxDQUNsQixDQUFvQixFQUFFLEtBQWUsRUFBRSxHQUFhLEVBQUUsT0FBa0IsRUFDeEUsU0FBUyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLFlBQVksR0FBRyxDQUFDLEVBQUUsV0FBVyxHQUFHLENBQUMsRUFDN0QsY0FBYyxHQUFHLENBQUM7SUFDcEIsTUFBTSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsY0FBYyxFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFFeEUsTUFBTSxNQUFNLEdBQXVCLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBQyxDQUFDO0lBQzNDLE1BQU0sS0FBSyxHQUFzQjtRQUMvQixLQUFLO1FBQ0wsR0FBRztRQUNILE9BQU87UUFDUCxTQUFTO1FBQ1QsT0FBTztRQUNQLFlBQVk7UUFDWixXQUFXO1FBQ1gsY0FBYztLQUNmLENBQUM7SUFFRixPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQ25CLFlBQVksRUFBRSxNQUE4QixFQUM1QyxLQUEyQixDQUFDLENBQUM7QUFDbkMsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsRUFBQyxhQUFhLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7U3RyaWRlZFNsaWNlLCBTdHJpZGVkU2xpY2VBdHRycywgU3RyaWRlZFNsaWNlSW5wdXRzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7TmFtZWRUZW5zb3JNYXB9IGZyb20gJy4uL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5cbi8qKlxuICogRXh0cmFjdHMgYSBzdHJpZGVkIHNsaWNlIG9mIGEgdGVuc29yLlxuICpcbiAqIFJvdWdobHkgc3BlYWtpbmcsIHRoaXMgb3AgZXh0cmFjdHMgYSBzbGljZSBvZiBzaXplIChlbmQtYmVnaW4pL3N0cmlkZSBmcm9tXG4gKiB0aGUgZ2l2ZW4gaW5wdXQgdGVuc29yICh4KS4gU3RhcnRpbmcgYXQgdGhlIGxvY2F0aW9uIHNwZWNpZmllZCBieSBiZWdpbiB0aGVcbiAqIHNsaWNlIGNvbnRpbnVlcyBieSBhZGRpbmcgc3RyaWRlIHRvIHRoZSBpbmRleCB1bnRpbCBhbGwgZGltZW5zaW9ucyBhcmUgbm90XG4gKiBsZXNzIHRoYW4gZW5kLiBOb3RlIHRoYXQgYSBzdHJpZGUgY2FuIGJlIG5lZ2F0aXZlLCB3aGljaCBjYXVzZXMgYSByZXZlcnNlXG4gKiBzbGljZS5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgdCA9IHRmLnRlbnNvcjNkKFsxLCAxLCAxICwyLCAyLCAyLCAzLCAzLCAzLCA0LCA0LCA0LCA1LCA1LCA1LCA2LCA2LCA2XSxcbiAqICAgIFszLCAyLCAzXSk7XG4gKiB0LnN0cmlkZWRTbGljZShbMSwgMCwgMF0sIFsyLCAxLCAzXSwgWzEsIDEsIDFdKS5wcmludCgpICAvLyBbW1szLCAzLCAzXV1dXG4gKiB0LnN0cmlkZWRTbGljZShbMSwgMCwgMF0sIFsyLCAyLCAzXSwgWzEsIDEsIDFdKS5wcmludCgpICAvLyBbW1szLCAzLCAzXSxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBbNCwgNCwgNF1dXVxuICogdC5zdHJpZGVkU2xpY2UoWzEsIC0xLCAwXSwgWzIsIC0zLCAzXSwgWzEsIC0xLCAxXSkucHJpbnQoKSAvLyBbW1s0LCA0LCA0XSxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBbMywgMywgM11dXVxuICogYGBgXG4gKlxuICogQHBhcmFtIHggVGhlIHRlbnNvciB0byBzdHJpZGUgc2xpY2UuXG4gKiBAcGFyYW0gYmVnaW4gVGhlIGNvb3JkaW5hdGVzIHRvIHN0YXJ0IHRoZSBzbGljZSBmcm9tLlxuICogQHBhcmFtIGVuZDogVGhlIGNvb3JkaW5hdGVzIHRvIGVuZCB0aGUgc2xpY2UgYXQuXG4gKiBAcGFyYW0gc3RyaWRlczogVGhlIHNpemUgb2YgdGhlIHNsaWNlLlxuICogQHBhcmFtIGJlZ2luTWFzazogSWYgdGhlIGl0aCBiaXQgb2YgYmVnaW5NYXNrIGlzIHNldCwgYmVnaW5baV0gaXMgaWdub3JlZFxuICogICAgICBhbmQgdGhlIGZ1bGxlc3QgcG9zc2libGUgcmFuZ2UgaW4gdGhhdCBkaW1lbnNpb24gaXMgdXNlZCBpbnN0ZWFkLlxuICogQHBhcmFtIGVuZE1hc2s6IElmIHRoZSBpdGggYml0IG9mIGVuZE1hc2sgaXMgc2V0LCBlbmRbaV0gaXMgaWdub3JlZFxuICogICAgICBhbmQgdGhlIGZ1bGxlc3QgcG9zc2libGUgcmFuZ2UgaW4gdGhhdCBkaW1lbnNpb24gaXMgdXNlZCBpbnN0ZWFkLlxuICogQHBhcmFtIHNocmlua0F4aXNNYXNrOiBhIGJpdG1hc2sgd2hlcmUgYml0IGkgaW1wbGllcyB0aGF0XG4gKiB0aGUgaXRoIHNwZWNpZmljYXRpb24gc2hvdWxkIHNocmluayB0aGUgZGltZW5zaW9uYWxpdHkuIGJlZ2luIGFuZCBlbmQgbXVzdFxuICogaW1wbHkgYSBzbGljZSBvZiBzaXplIDEgaW4gdGhlIGRpbWVuc2lvbi5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdTbGljaW5nIGFuZCBKb2luaW5nJ31cbiAqL1xuZnVuY3Rpb24gc3RyaWRlZFNsaWNlXyhcbiAgICB4OiBUZW5zb3J8VGVuc29yTGlrZSwgYmVnaW46IG51bWJlcltdLCBlbmQ6IG51bWJlcltdLCBzdHJpZGVzPzogbnVtYmVyW10sXG4gICAgYmVnaW5NYXNrID0gMCwgZW5kTWFzayA9IDAsIGVsbGlwc2lzTWFzayA9IDAsIG5ld0F4aXNNYXNrID0gMCxcbiAgICBzaHJpbmtBeGlzTWFzayA9IDApOiBUZW5zb3Ige1xuICBjb25zdCAkeCA9IGNvbnZlcnRUb1RlbnNvcih4LCAneCcsICdzdHJpZGVkU2xpY2UnLCAnc3RyaW5nX29yX251bWVyaWMnKTtcblxuICBjb25zdCBpbnB1dHM6IFN0cmlkZWRTbGljZUlucHV0cyA9IHt4OiAkeH07XG4gIGNvbnN0IGF0dHJzOiBTdHJpZGVkU2xpY2VBdHRycyA9IHtcbiAgICBiZWdpbixcbiAgICBlbmQsXG4gICAgc3RyaWRlcyxcbiAgICBiZWdpbk1hc2ssXG4gICAgZW5kTWFzayxcbiAgICBlbGxpcHNpc01hc2ssXG4gICAgbmV3QXhpc01hc2ssXG4gICAgc2hyaW5rQXhpc01hc2tcbiAgfTtcblxuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChcbiAgICAgIFN0cmlkZWRTbGljZSwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLFxuICAgICAgYXR0cnMgYXMge30gYXMgTmFtZWRBdHRyTWFwKTtcbn1cblxuZXhwb3J0IGNvbnN0IHN0cmlkZWRTbGljZSA9IG9wKHtzdHJpZGVkU2xpY2VffSk7XG4iXX0=