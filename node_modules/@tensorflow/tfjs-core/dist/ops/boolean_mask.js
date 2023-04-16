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
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { gather } from './gather';
import { reshape } from './reshape';
import { squeeze } from './squeeze';
import { whereAsync } from './where_async';
/**
 * Apply boolean mask to tensor.
 *
 * ```js
 * const tensor = tf.tensor2d([1, 2, 3, 4, 5, 6], [3, 2]);
 * const mask = tf.tensor1d([1, 0, 1], 'bool');
 * const result = await tf.booleanMaskAsync(tensor, mask);
 * result.print();
 * ```
 *
 * @param tensor N-D tensor.
 * @param mask K-D boolean tensor, K <= N and K must be known statically.
 * @param axis A 0-D int Tensor representing the axis in tensor to mask from.
 *     By default, axis is 0 which will mask from the first dimension.
 *     Otherwise K + axis <= N.
 *
 * @doc {heading: 'Tensors', subheading: 'Slicing and Joining'}
 */
async function booleanMaskAsync_(tensor, mask, axis) {
    const $tensor = convertToTensor(tensor, 'tensor', 'boolMask');
    const $mask = convertToTensor(mask, 'mask', 'boolMask', 'bool');
    const axisFrom = axis == null ? 0 : axis;
    const maskDim = $mask.rank;
    const tensorShape = $tensor.shape;
    util.assert(maskDim > 0, () => 'mask cannot be scalar');
    util.assertShapesMatch(tensorShape.slice(axisFrom, axisFrom + maskDim), $mask.shape, `mask's shape must match the first K dimensions of tensor's shape,`);
    let leadingSize = 1;
    for (let i = axisFrom; i < axisFrom + maskDim; i++) {
        leadingSize *= tensorShape[i];
    }
    const targetTensorShape = tensorShape.slice(0, axisFrom)
        .concat([leadingSize], tensorShape.slice(axisFrom + maskDim));
    const reshapedTensor = reshape($tensor, targetTensorShape);
    const reshapedMask = reshape($mask, [-1]);
    const positivePositions = await whereAsync(reshapedMask);
    const indices = squeeze(positivePositions, [1]);
    const res = gather(reshapedTensor, indices, axisFrom);
    // Ensure no memory leak.
    if (tensor !== $tensor) {
        $tensor.dispose();
    }
    if (mask !== $mask) {
        $mask.dispose();
    }
    indices.dispose();
    reshapedTensor.dispose();
    reshapedMask.dispose();
    positivePositions.dispose();
    return res;
}
export const booleanMaskAsync = booleanMaskAsync_;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vbGVhbl9tYXNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvYm9vbGVhbl9tYXNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUdILE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUVuRCxPQUFPLEtBQUssSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUVoQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ2hDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNsQyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXpDOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQUNILEtBQUssVUFBVSxpQkFBaUIsQ0FDNUIsTUFBeUIsRUFBRSxJQUF1QixFQUNsRCxJQUFhO0lBQ2YsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDOUQsTUFBTSxLQUFLLEdBQUcsZUFBZSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRWhFLE1BQU0sUUFBUSxHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3pDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDM0IsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUVsQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUN4RCxJQUFJLENBQUMsaUJBQWlCLENBQ2xCLFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsR0FBRyxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUMsS0FBSyxFQUM1RCxtRUFBbUUsQ0FBQyxDQUFDO0lBRXpFLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztJQUNwQixLQUFLLElBQUksQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLEdBQUcsUUFBUSxHQUFHLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNsRCxXQUFXLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9CO0lBQ0QsTUFBTSxpQkFBaUIsR0FDbkIsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDO1NBQ3pCLE1BQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDdEUsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQzNELE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN6RCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWhELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxjQUFjLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRXRELHlCQUF5QjtJQUN6QixJQUFJLE1BQU0sS0FBSyxPQUFPLEVBQUU7UUFDdEIsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ25CO0lBQ0QsSUFBSSxJQUFJLEtBQUssS0FBSyxFQUFFO1FBQ2xCLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNqQjtJQUNELE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNsQixjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDekIsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3ZCLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxDQUFDO0lBRTVCLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHLGlCQUFpQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge2dhdGhlcn0gZnJvbSAnLi9nYXRoZXInO1xuaW1wb3J0IHtyZXNoYXBlfSBmcm9tICcuL3Jlc2hhcGUnO1xuaW1wb3J0IHtzcXVlZXplfSBmcm9tICcuL3NxdWVlemUnO1xuaW1wb3J0IHt3aGVyZUFzeW5jfSBmcm9tICcuL3doZXJlX2FzeW5jJztcblxuLyoqXG4gKiBBcHBseSBib29sZWFuIG1hc2sgdG8gdGVuc29yLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCB0ZW5zb3IgPSB0Zi50ZW5zb3IyZChbMSwgMiwgMywgNCwgNSwgNl0sIFszLCAyXSk7XG4gKiBjb25zdCBtYXNrID0gdGYudGVuc29yMWQoWzEsIDAsIDFdLCAnYm9vbCcpO1xuICogY29uc3QgcmVzdWx0ID0gYXdhaXQgdGYuYm9vbGVhbk1hc2tBc3luYyh0ZW5zb3IsIG1hc2spO1xuICogcmVzdWx0LnByaW50KCk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gdGVuc29yIE4tRCB0ZW5zb3IuXG4gKiBAcGFyYW0gbWFzayBLLUQgYm9vbGVhbiB0ZW5zb3IsIEsgPD0gTiBhbmQgSyBtdXN0IGJlIGtub3duIHN0YXRpY2FsbHkuXG4gKiBAcGFyYW0gYXhpcyBBIDAtRCBpbnQgVGVuc29yIHJlcHJlc2VudGluZyB0aGUgYXhpcyBpbiB0ZW5zb3IgdG8gbWFzayBmcm9tLlxuICogICAgIEJ5IGRlZmF1bHQsIGF4aXMgaXMgMCB3aGljaCB3aWxsIG1hc2sgZnJvbSB0aGUgZmlyc3QgZGltZW5zaW9uLlxuICogICAgIE90aGVyd2lzZSBLICsgYXhpcyA8PSBOLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdUZW5zb3JzJywgc3ViaGVhZGluZzogJ1NsaWNpbmcgYW5kIEpvaW5pbmcnfVxuICovXG5hc3luYyBmdW5jdGlvbiBib29sZWFuTWFza0FzeW5jXyhcbiAgICB0ZW5zb3I6IFRlbnNvcnxUZW5zb3JMaWtlLCBtYXNrOiBUZW5zb3J8VGVuc29yTGlrZSxcbiAgICBheGlzPzogbnVtYmVyKTogUHJvbWlzZTxUZW5zb3I+IHtcbiAgY29uc3QgJHRlbnNvciA9IGNvbnZlcnRUb1RlbnNvcih0ZW5zb3IsICd0ZW5zb3InLCAnYm9vbE1hc2snKTtcbiAgY29uc3QgJG1hc2sgPSBjb252ZXJ0VG9UZW5zb3IobWFzaywgJ21hc2snLCAnYm9vbE1hc2snLCAnYm9vbCcpO1xuXG4gIGNvbnN0IGF4aXNGcm9tID0gYXhpcyA9PSBudWxsID8gMCA6IGF4aXM7XG4gIGNvbnN0IG1hc2tEaW0gPSAkbWFzay5yYW5rO1xuICBjb25zdCB0ZW5zb3JTaGFwZSA9ICR0ZW5zb3Iuc2hhcGU7XG5cbiAgdXRpbC5hc3NlcnQobWFza0RpbSA+IDAsICgpID0+ICdtYXNrIGNhbm5vdCBiZSBzY2FsYXInKTtcbiAgdXRpbC5hc3NlcnRTaGFwZXNNYXRjaChcbiAgICAgIHRlbnNvclNoYXBlLnNsaWNlKGF4aXNGcm9tLCBheGlzRnJvbSArIG1hc2tEaW0pLCAkbWFzay5zaGFwZSxcbiAgICAgIGBtYXNrJ3Mgc2hhcGUgbXVzdCBtYXRjaCB0aGUgZmlyc3QgSyBkaW1lbnNpb25zIG9mIHRlbnNvcidzIHNoYXBlLGApO1xuXG4gIGxldCBsZWFkaW5nU2l6ZSA9IDE7XG4gIGZvciAobGV0IGkgPSBheGlzRnJvbTsgaSA8IGF4aXNGcm9tICsgbWFza0RpbTsgaSsrKSB7XG4gICAgbGVhZGluZ1NpemUgKj0gdGVuc29yU2hhcGVbaV07XG4gIH1cbiAgY29uc3QgdGFyZ2V0VGVuc29yU2hhcGUgPVxuICAgICAgdGVuc29yU2hhcGUuc2xpY2UoMCwgYXhpc0Zyb20pXG4gICAgICAgICAgLmNvbmNhdChbbGVhZGluZ1NpemVdLCB0ZW5zb3JTaGFwZS5zbGljZShheGlzRnJvbSArIG1hc2tEaW0pKTtcbiAgY29uc3QgcmVzaGFwZWRUZW5zb3IgPSByZXNoYXBlKCR0ZW5zb3IsIHRhcmdldFRlbnNvclNoYXBlKTtcbiAgY29uc3QgcmVzaGFwZWRNYXNrID0gcmVzaGFwZSgkbWFzaywgWy0xXSk7XG4gIGNvbnN0IHBvc2l0aXZlUG9zaXRpb25zID0gYXdhaXQgd2hlcmVBc3luYyhyZXNoYXBlZE1hc2spO1xuICBjb25zdCBpbmRpY2VzID0gc3F1ZWV6ZShwb3NpdGl2ZVBvc2l0aW9ucywgWzFdKTtcblxuICBjb25zdCByZXMgPSBnYXRoZXIocmVzaGFwZWRUZW5zb3IsIGluZGljZXMsIGF4aXNGcm9tKTtcblxuICAvLyBFbnN1cmUgbm8gbWVtb3J5IGxlYWsuXG4gIGlmICh0ZW5zb3IgIT09ICR0ZW5zb3IpIHtcbiAgICAkdGVuc29yLmRpc3Bvc2UoKTtcbiAgfVxuICBpZiAobWFzayAhPT0gJG1hc2spIHtcbiAgICAkbWFzay5kaXNwb3NlKCk7XG4gIH1cbiAgaW5kaWNlcy5kaXNwb3NlKCk7XG4gIHJlc2hhcGVkVGVuc29yLmRpc3Bvc2UoKTtcbiAgcmVzaGFwZWRNYXNrLmRpc3Bvc2UoKTtcbiAgcG9zaXRpdmVQb3NpdGlvbnMuZGlzcG9zZSgpO1xuXG4gIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBjb25zdCBib29sZWFuTWFza0FzeW5jID0gYm9vbGVhbk1hc2tBc3luY187XG4iXX0=