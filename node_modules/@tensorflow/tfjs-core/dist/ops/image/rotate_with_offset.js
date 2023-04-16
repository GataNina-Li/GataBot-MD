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
import { ENGINE } from '../../engine';
import { RotateWithOffset } from '../../kernel_names';
import { convertToTensor } from '../../tensor_util_env';
import * as util from '../../util';
import { op } from '../operation';
/**
 * Rotates the input image tensor counter-clockwise with an optional offset
 * center of rotation. Currently available in the CPU, WebGL, and WASM backends.
 *
 * @param image 4d tensor of shape `[batch, imageHeight, imageWidth, depth]`.
 * @param radians The amount of rotation.
 * @param fillValue The value to fill in the empty space leftover
 *     after rotation. Can be either a single grayscale value (0-255), or an
 *     array of three numbers `[red, green, blue]` specifying the red, green,
 *     and blue channels. Defaults to `0` (black).
 * @param center The center of rotation. Can be either a single value (0-1), or
 *     an array of two numbers `[centerX, centerY]`. Defaults to `0.5` (rotates
 *     the image around its center).
 *
 * @doc {heading: 'Operations', subheading: 'Images', namespace: 'image'}
 */
function rotateWithOffset_(image, radians, fillValue = 0, center = 0.5) {
    const $image = convertToTensor(image, 'image', 'rotateWithOffset', 'float32');
    util.assert($image.rank === 4, () => 'Error in rotateWithOffset: image must be rank 4,' +
        `but got rank ${$image.rank}.`);
    const inputs = { image: $image };
    const attrs = { radians, fillValue, center };
    const res = ENGINE.runKernel(RotateWithOffset, inputs, attrs);
    return res;
}
export const rotateWithOffset = op({ rotateWithOffset_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm90YXRlX3dpdGhfb2Zmc2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvaW1hZ2Uvcm90YXRlX3dpdGhfb2Zmc2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDcEMsT0FBTyxFQUFDLGdCQUFnQixFQUFnRCxNQUFNLG9CQUFvQixDQUFDO0FBSW5HLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUV0RCxPQUFPLEtBQUssSUFBSSxNQUFNLFlBQVksQ0FBQztBQUVuQyxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRWhDOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILFNBQVMsaUJBQWlCLENBQ3RCLEtBQTBCLEVBQUUsT0FBZSxFQUMzQyxZQUE2QyxDQUFDLEVBQzlDLFNBQWtDLEdBQUc7SUFDdkMsTUFBTSxNQUFNLEdBQUcsZUFBZSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFFOUUsSUFBSSxDQUFDLE1BQU0sQ0FDUCxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsRUFDakIsR0FBRyxFQUFFLENBQUMsa0RBQWtEO1FBQ3BELGdCQUFnQixNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUV4QyxNQUFNLE1BQU0sR0FBMkIsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFDLENBQUM7SUFDdkQsTUFBTSxLQUFLLEdBQTBCLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUMsQ0FBQztJQUNsRSxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUN4QixnQkFBZ0IsRUFBRSxNQUE4QixFQUNoRCxLQUEyQixDQUFDLENBQUM7SUFDakMsT0FBTyxHQUFlLENBQUM7QUFDekIsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxFQUFDLGlCQUFpQixFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uLy4uL2VuZ2luZSc7XG5pbXBvcnQge1JvdGF0ZVdpdGhPZmZzZXQsIFJvdGF0ZVdpdGhPZmZzZXRBdHRycywgUm90YXRlV2l0aE9mZnNldElucHV0c30gZnJvbSAnLi4vLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7TmFtZWRBdHRyTWFwfSBmcm9tICcuLi8uLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtUZW5zb3I0RH0gZnJvbSAnLi4vLi4vdGVuc29yJztcbmltcG9ydCB7TmFtZWRUZW5zb3JNYXB9IGZyb20gJy4uLy4uL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi8uLi91dGlsJztcblxuaW1wb3J0IHtvcH0gZnJvbSAnLi4vb3BlcmF0aW9uJztcblxuLyoqXG4gKiBSb3RhdGVzIHRoZSBpbnB1dCBpbWFnZSB0ZW5zb3IgY291bnRlci1jbG9ja3dpc2Ugd2l0aCBhbiBvcHRpb25hbCBvZmZzZXRcbiAqIGNlbnRlciBvZiByb3RhdGlvbi4gQ3VycmVudGx5IGF2YWlsYWJsZSBpbiB0aGUgQ1BVLCBXZWJHTCwgYW5kIFdBU00gYmFja2VuZHMuXG4gKlxuICogQHBhcmFtIGltYWdlIDRkIHRlbnNvciBvZiBzaGFwZSBgW2JhdGNoLCBpbWFnZUhlaWdodCwgaW1hZ2VXaWR0aCwgZGVwdGhdYC5cbiAqIEBwYXJhbSByYWRpYW5zIFRoZSBhbW91bnQgb2Ygcm90YXRpb24uXG4gKiBAcGFyYW0gZmlsbFZhbHVlIFRoZSB2YWx1ZSB0byBmaWxsIGluIHRoZSBlbXB0eSBzcGFjZSBsZWZ0b3ZlclxuICogICAgIGFmdGVyIHJvdGF0aW9uLiBDYW4gYmUgZWl0aGVyIGEgc2luZ2xlIGdyYXlzY2FsZSB2YWx1ZSAoMC0yNTUpLCBvciBhblxuICogICAgIGFycmF5IG9mIHRocmVlIG51bWJlcnMgYFtyZWQsIGdyZWVuLCBibHVlXWAgc3BlY2lmeWluZyB0aGUgcmVkLCBncmVlbixcbiAqICAgICBhbmQgYmx1ZSBjaGFubmVscy4gRGVmYXVsdHMgdG8gYDBgIChibGFjaykuXG4gKiBAcGFyYW0gY2VudGVyIFRoZSBjZW50ZXIgb2Ygcm90YXRpb24uIENhbiBiZSBlaXRoZXIgYSBzaW5nbGUgdmFsdWUgKDAtMSksIG9yXG4gKiAgICAgYW4gYXJyYXkgb2YgdHdvIG51bWJlcnMgYFtjZW50ZXJYLCBjZW50ZXJZXWAuIERlZmF1bHRzIHRvIGAwLjVgIChyb3RhdGVzXG4gKiAgICAgdGhlIGltYWdlIGFyb3VuZCBpdHMgY2VudGVyKS5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdJbWFnZXMnLCBuYW1lc3BhY2U6ICdpbWFnZSd9XG4gKi9cbmZ1bmN0aW9uIHJvdGF0ZVdpdGhPZmZzZXRfKFxuICAgIGltYWdlOiBUZW5zb3I0RHxUZW5zb3JMaWtlLCByYWRpYW5zOiBudW1iZXIsXG4gICAgZmlsbFZhbHVlOiBudW1iZXJ8W251bWJlciwgbnVtYmVyLCBudW1iZXJdID0gMCxcbiAgICBjZW50ZXI6IG51bWJlcnxbbnVtYmVyLCBudW1iZXJdID0gMC41KTogVGVuc29yNEQge1xuICBjb25zdCAkaW1hZ2UgPSBjb252ZXJ0VG9UZW5zb3IoaW1hZ2UsICdpbWFnZScsICdyb3RhdGVXaXRoT2Zmc2V0JywgJ2Zsb2F0MzInKTtcblxuICB1dGlsLmFzc2VydChcbiAgICAgICRpbWFnZS5yYW5rID09PSA0LFxuICAgICAgKCkgPT4gJ0Vycm9yIGluIHJvdGF0ZVdpdGhPZmZzZXQ6IGltYWdlIG11c3QgYmUgcmFuayA0LCcgK1xuICAgICAgICAgIGBidXQgZ290IHJhbmsgJHskaW1hZ2UucmFua30uYCk7XG5cbiAgY29uc3QgaW5wdXRzOiBSb3RhdGVXaXRoT2Zmc2V0SW5wdXRzID0ge2ltYWdlOiAkaW1hZ2V9O1xuICBjb25zdCBhdHRyczogUm90YXRlV2l0aE9mZnNldEF0dHJzID0ge3JhZGlhbnMsIGZpbGxWYWx1ZSwgY2VudGVyfTtcbiAgY29uc3QgcmVzID0gRU5HSU5FLnJ1bktlcm5lbChcbiAgICAgIFJvdGF0ZVdpdGhPZmZzZXQsIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCxcbiAgICAgIGF0dHJzIGFzIHt9IGFzIE5hbWVkQXR0ck1hcCk7XG4gIHJldHVybiByZXMgYXMgVGVuc29yNEQ7XG59XG5cbmV4cG9ydCBjb25zdCByb3RhdGVXaXRoT2Zmc2V0ID0gb3Aoe3JvdGF0ZVdpdGhPZmZzZXRffSk7XG4iXX0=