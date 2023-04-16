/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
import { ENGINE } from '../../engine';
import { SparseReshape } from '../../kernel_names';
import { convertToTensor } from '../../tensor_util_env';
import { op } from '../operation';
/**
 * This operation has the same semantics as reshape on the represented dense
 * tensor. The `inputIndices` are recomputed based on the requested `newShape`.
 * If one component of `newShape` is the special value -1, the size of that
 * dimension is computed so that the total dense size remains constant. At most
 * one component of `newShape` can be -1. The number of dense elements implied
 * by `newShape` must be the same as the number of dense elements originally
 * implied by `inputShape`. Reshaping does not affect the order of values in the
 * SparseTensor. If the input tensor has rank R_in and N non-empty values, and
 * `newShape` has length R_out, then `inputIndices` has shape [N, R_in],
 * `inputShape` has length R_in, `outputIndices` has shape [N, R_out], and
 * `outputShape` has length R_out.
 *
 * ```js
 * const result = tf.sparse.sparseReshape(
 *   [[0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0], [1, 2, 3]],
 *   [2, 3, 6], [9, -1]);
 * console.log(result);
 * result['outputIndices'].print(); //[[0, 0], [0, 1], [1, 2], [4, 2], [8, 1]]
 * result['outputShape'].print(); // [9, 4]
 * ```
 * @param inputIndices: 2-D. N x R_in matrix with the indices of non-empty
 * values in a SparseTensor.
 * @param inputShape: 1-D. R_in Tensor1D with the input SparseTensor's dense
 * shape.
 * @param newShape: 1-D. R_out Tensor1D with the requested new dense shape.
 * @return A map with the following properties:
 *     - outputIndices: 2-D. N x R_out matrix with the updated indices of
 *       non-empty values in the output SparseTensor.
 *     - outputShape: 1-D. R_out vector with the full dense shape of the output
 *       SparseTensor. This is the same as newShape but with any -1 dimensions
 *        filled in.
 * @doc {heading: 'Operations', subheading: 'Sparse'}
 */
function sparseReshape_(inputIndices, inputShape, newShape) {
    const $inputIndices = convertToTensor(inputIndices, 'inputIndices', 'sparseReshape', 'int32');
    const $inputShape = convertToTensor(inputShape, 'inputShape', 'sparseReshape', 'int32');
    const $newShape = convertToTensor(newShape, 'newShape', 'sparseReshape', 'int32');
    if ($inputIndices.rank !== 2) {
        throw new Error(`Input indices should be Tensor2D but received shape
        ${$inputIndices.shape}`);
    }
    if ($inputShape.rank !== 1) {
        throw new Error(`Input shape should be Tensor1D but received shape ${$inputShape.shape}`);
    }
    if ($newShape.rank !== 1) {
        throw new Error(`New shape should be Tensor1D but received shape ${$newShape.shape}`);
    }
    const inputs = {
        inputIndices: $inputIndices,
        inputShape: $inputShape,
        newShape: $newShape
    };
    const result = ENGINE.runKernel(SparseReshape, inputs);
    return { outputIndices: result[0], outputShape: result[1] };
}
export const sparseReshape = op({ sparseReshape_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BhcnNlX3Jlc2hhcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9zcGFyc2Uvc3BhcnNlX3Jlc2hhcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUNwQyxPQUFPLEVBQUMsYUFBYSxFQUFzQixNQUFNLG9CQUFvQixDQUFDO0FBR3RFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUV0RCxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRWhDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQ0c7QUFDSCxTQUFTLGNBQWMsQ0FDbkIsWUFBaUMsRUFBRSxVQUErQixFQUNsRSxRQUE2QjtJQUMvQixNQUFNLGFBQWEsR0FDZixlQUFlLENBQUMsWUFBWSxFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDNUUsTUFBTSxXQUFXLEdBQ2IsZUFBZSxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3hFLE1BQU0sU0FBUyxHQUNYLGVBQWUsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUVwRSxJQUFJLGFBQWEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO1FBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUM7VUFDVixhQUFhLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUM5QjtJQUNELElBQUksV0FBVyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7UUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxREFDWixXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUMxQjtJQUNELElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7UUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FDWCxtREFBbUQsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7S0FDM0U7SUFFRCxNQUFNLE1BQU0sR0FBd0I7UUFDbEMsWUFBWSxFQUFFLGFBQWE7UUFDM0IsVUFBVSxFQUFFLFdBQVc7UUFDdkIsUUFBUSxFQUFFLFNBQVM7S0FDcEIsQ0FBQztJQUNGLE1BQU0sTUFBTSxHQUFhLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLE1BQVksQ0FBQyxDQUFDO0lBQ3ZFLE9BQU8sRUFBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQztBQUM1RCxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQyxFQUFDLGNBQWMsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMSBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi8uLi9lbmdpbmUnO1xuaW1wb3J0IHtTcGFyc2VSZXNoYXBlLCBTcGFyc2VSZXNoYXBlSW5wdXRzfSBmcm9tICcuLi8uLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtUZW5zb3IsIFRlbnNvcjFELCBUZW5zb3IyRH0gZnJvbSAnLi4vLi4vdGVuc29yJztcbmltcG9ydCB7TmFtZWRUZW5zb3JNYXB9IGZyb20gJy4uLy4uL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0IHtvcH0gZnJvbSAnLi4vb3BlcmF0aW9uJztcblxuLyoqXG4gKiBUaGlzIG9wZXJhdGlvbiBoYXMgdGhlIHNhbWUgc2VtYW50aWNzIGFzIHJlc2hhcGUgb24gdGhlIHJlcHJlc2VudGVkIGRlbnNlXG4gKiB0ZW5zb3IuIFRoZSBgaW5wdXRJbmRpY2VzYCBhcmUgcmVjb21wdXRlZCBiYXNlZCBvbiB0aGUgcmVxdWVzdGVkIGBuZXdTaGFwZWAuXG4gKiBJZiBvbmUgY29tcG9uZW50IG9mIGBuZXdTaGFwZWAgaXMgdGhlIHNwZWNpYWwgdmFsdWUgLTEsIHRoZSBzaXplIG9mIHRoYXRcbiAqIGRpbWVuc2lvbiBpcyBjb21wdXRlZCBzbyB0aGF0IHRoZSB0b3RhbCBkZW5zZSBzaXplIHJlbWFpbnMgY29uc3RhbnQuIEF0IG1vc3RcbiAqIG9uZSBjb21wb25lbnQgb2YgYG5ld1NoYXBlYCBjYW4gYmUgLTEuIFRoZSBudW1iZXIgb2YgZGVuc2UgZWxlbWVudHMgaW1wbGllZFxuICogYnkgYG5ld1NoYXBlYCBtdXN0IGJlIHRoZSBzYW1lIGFzIHRoZSBudW1iZXIgb2YgZGVuc2UgZWxlbWVudHMgb3JpZ2luYWxseVxuICogaW1wbGllZCBieSBgaW5wdXRTaGFwZWAuIFJlc2hhcGluZyBkb2VzIG5vdCBhZmZlY3QgdGhlIG9yZGVyIG9mIHZhbHVlcyBpbiB0aGVcbiAqIFNwYXJzZVRlbnNvci4gSWYgdGhlIGlucHV0IHRlbnNvciBoYXMgcmFuayBSX2luIGFuZCBOIG5vbi1lbXB0eSB2YWx1ZXMsIGFuZFxuICogYG5ld1NoYXBlYCBoYXMgbGVuZ3RoIFJfb3V0LCB0aGVuIGBpbnB1dEluZGljZXNgIGhhcyBzaGFwZSBbTiwgUl9pbl0sXG4gKiBgaW5wdXRTaGFwZWAgaGFzIGxlbmd0aCBSX2luLCBgb3V0cHV0SW5kaWNlc2AgaGFzIHNoYXBlIFtOLCBSX291dF0sIGFuZFxuICogYG91dHB1dFNoYXBlYCBoYXMgbGVuZ3RoIFJfb3V0LlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCByZXN1bHQgPSB0Zi5zcGFyc2Uuc3BhcnNlUmVzaGFwZShcbiAqICAgW1swLCAwLCAwXSwgWzAsIDAsIDFdLCBbMCwgMSwgMF0sIFsxLCAwLCAwXSwgWzEsIDIsIDNdXSxcbiAqICAgWzIsIDMsIDZdLCBbOSwgLTFdKTtcbiAqIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gKiByZXN1bHRbJ291dHB1dEluZGljZXMnXS5wcmludCgpOyAvL1tbMCwgMF0sIFswLCAxXSwgWzEsIDJdLCBbNCwgMl0sIFs4LCAxXV1cbiAqIHJlc3VsdFsnb3V0cHV0U2hhcGUnXS5wcmludCgpOyAvLyBbOSwgNF1cbiAqIGBgYFxuICogQHBhcmFtIGlucHV0SW5kaWNlczogMi1ELiBOIHggUl9pbiBtYXRyaXggd2l0aCB0aGUgaW5kaWNlcyBvZiBub24tZW1wdHlcbiAqIHZhbHVlcyBpbiBhIFNwYXJzZVRlbnNvci5cbiAqIEBwYXJhbSBpbnB1dFNoYXBlOiAxLUQuIFJfaW4gVGVuc29yMUQgd2l0aCB0aGUgaW5wdXQgU3BhcnNlVGVuc29yJ3MgZGVuc2VcbiAqIHNoYXBlLlxuICogQHBhcmFtIG5ld1NoYXBlOiAxLUQuIFJfb3V0IFRlbnNvcjFEIHdpdGggdGhlIHJlcXVlc3RlZCBuZXcgZGVuc2Ugc2hhcGUuXG4gKiBAcmV0dXJuIEEgbWFwIHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICogICAgIC0gb3V0cHV0SW5kaWNlczogMi1ELiBOIHggUl9vdXQgbWF0cml4IHdpdGggdGhlIHVwZGF0ZWQgaW5kaWNlcyBvZlxuICogICAgICAgbm9uLWVtcHR5IHZhbHVlcyBpbiB0aGUgb3V0cHV0IFNwYXJzZVRlbnNvci5cbiAqICAgICAtIG91dHB1dFNoYXBlOiAxLUQuIFJfb3V0IHZlY3RvciB3aXRoIHRoZSBmdWxsIGRlbnNlIHNoYXBlIG9mIHRoZSBvdXRwdXRcbiAqICAgICAgIFNwYXJzZVRlbnNvci4gVGhpcyBpcyB0aGUgc2FtZSBhcyBuZXdTaGFwZSBidXQgd2l0aCBhbnkgLTEgZGltZW5zaW9uc1xuICogICAgICAgIGZpbGxlZCBpbi5cbiAqIEBkb2Mge2hlYWRpbmc6ICdPcGVyYXRpb25zJywgc3ViaGVhZGluZzogJ1NwYXJzZSd9XG4gKi9cbmZ1bmN0aW9uIHNwYXJzZVJlc2hhcGVfKFxuICAgIGlucHV0SW5kaWNlczogVGVuc29yMkR8VGVuc29yTGlrZSwgaW5wdXRTaGFwZTogVGVuc29yMUR8VGVuc29yTGlrZSxcbiAgICBuZXdTaGFwZTogVGVuc29yMUR8VGVuc29yTGlrZSk6IE5hbWVkVGVuc29yTWFwIHtcbiAgY29uc3QgJGlucHV0SW5kaWNlcyA9XG4gICAgICBjb252ZXJ0VG9UZW5zb3IoaW5wdXRJbmRpY2VzLCAnaW5wdXRJbmRpY2VzJywgJ3NwYXJzZVJlc2hhcGUnLCAnaW50MzInKTtcbiAgY29uc3QgJGlucHV0U2hhcGUgPVxuICAgICAgY29udmVydFRvVGVuc29yKGlucHV0U2hhcGUsICdpbnB1dFNoYXBlJywgJ3NwYXJzZVJlc2hhcGUnLCAnaW50MzInKTtcbiAgY29uc3QgJG5ld1NoYXBlID1cbiAgICAgIGNvbnZlcnRUb1RlbnNvcihuZXdTaGFwZSwgJ25ld1NoYXBlJywgJ3NwYXJzZVJlc2hhcGUnLCAnaW50MzInKTtcblxuICBpZiAoJGlucHV0SW5kaWNlcy5yYW5rICE9PSAyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnB1dCBpbmRpY2VzIHNob3VsZCBiZSBUZW5zb3IyRCBidXQgcmVjZWl2ZWQgc2hhcGVcbiAgICAgICAgJHskaW5wdXRJbmRpY2VzLnNoYXBlfWApO1xuICB9XG4gIGlmICgkaW5wdXRTaGFwZS5yYW5rICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnB1dCBzaGFwZSBzaG91bGQgYmUgVGVuc29yMUQgYnV0IHJlY2VpdmVkIHNoYXBlICR7XG4gICAgICAgICRpbnB1dFNoYXBlLnNoYXBlfWApO1xuICB9XG4gIGlmICgkbmV3U2hhcGUucmFuayAhPT0gMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYE5ldyBzaGFwZSBzaG91bGQgYmUgVGVuc29yMUQgYnV0IHJlY2VpdmVkIHNoYXBlICR7JG5ld1NoYXBlLnNoYXBlfWApO1xuICB9XG5cbiAgY29uc3QgaW5wdXRzOiBTcGFyc2VSZXNoYXBlSW5wdXRzID0ge1xuICAgIGlucHV0SW5kaWNlczogJGlucHV0SW5kaWNlcyxcbiAgICBpbnB1dFNoYXBlOiAkaW5wdXRTaGFwZSxcbiAgICBuZXdTaGFwZTogJG5ld1NoYXBlXG4gIH07XG4gIGNvbnN0IHJlc3VsdDogVGVuc29yW10gPSBFTkdJTkUucnVuS2VybmVsKFNwYXJzZVJlc2hhcGUsIGlucHV0cyBhcyB7fSk7XG4gIHJldHVybiB7b3V0cHV0SW5kaWNlczogcmVzdWx0WzBdLCBvdXRwdXRTaGFwZTogcmVzdWx0WzFdfTtcbn1cblxuZXhwb3J0IGNvbnN0IHNwYXJzZVJlc2hhcGUgPSBvcCh7c3BhcnNlUmVzaGFwZV99KTtcbiJdfQ==