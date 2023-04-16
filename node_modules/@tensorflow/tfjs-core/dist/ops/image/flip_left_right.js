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
import { FlipLeftRight } from '../../kernel_names';
import { convertToTensor } from '../../tensor_util_env';
import * as util from '../../util';
import { op } from '../operation';
/**
 * Flips the image left to right. Currently available in the CPU, WebGL, and
 * WASM backends.
 *
 * @param image 4d tensor of shape `[batch, imageHeight, imageWidth, depth]`.
 */
/** @doc {heading: 'Operations', subheading: 'Images', namespace: 'image'} */
function flipLeftRight_(image) {
    const $image = convertToTensor(image, 'image', 'flipLeftRight', 'float32');
    util.assert($image.rank === 4, () => 'Error in flipLeftRight: image must be rank 4,' +
        `but got rank ${$image.rank}.`);
    const inputs = { image: $image };
    const res = ENGINE.runKernel(FlipLeftRight, inputs, {});
    return res;
}
export const flipLeftRight = op({ flipLeftRight_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxpcF9sZWZ0X3JpZ2h0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvaW1hZ2UvZmxpcF9sZWZ0X3JpZ2h0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDcEMsT0FBTyxFQUFDLGFBQWEsRUFBc0IsTUFBTSxvQkFBb0IsQ0FBQztBQUd0RSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFdEQsT0FBTyxLQUFLLElBQUksTUFBTSxZQUFZLENBQUM7QUFDbkMsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUVoQzs7Ozs7R0FLRztBQUNILDZFQUE2RTtBQUM3RSxTQUFTLGNBQWMsQ0FBQyxLQUEwQjtJQUNoRCxNQUFNLE1BQU0sR0FBRyxlQUFlLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFFM0UsSUFBSSxDQUFDLE1BQU0sQ0FDUCxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsRUFDakIsR0FBRyxFQUFFLENBQUMsK0NBQStDO1FBQ2pELGdCQUFnQixNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUV4QyxNQUFNLE1BQU0sR0FBd0IsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFDLENBQUM7SUFDcEQsTUFBTSxHQUFHLEdBQ0wsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsTUFBOEIsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN4RSxPQUFPLEdBQWUsQ0FBQztBQUN6QixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQyxFQUFDLGNBQWMsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi8uLi9lbmdpbmUnO1xuaW1wb3J0IHtGbGlwTGVmdFJpZ2h0LCBGbGlwTGVmdFJpZ2h0SW5wdXRzfSBmcm9tICcuLi8uLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtUZW5zb3I0RH0gZnJvbSAnLi4vLi4vdGVuc29yJztcbmltcG9ydCB7TmFtZWRUZW5zb3JNYXB9IGZyb20gJy4uLy4uL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7b3B9IGZyb20gJy4uL29wZXJhdGlvbic7XG5cbi8qKlxuICogRmxpcHMgdGhlIGltYWdlIGxlZnQgdG8gcmlnaHQuIEN1cnJlbnRseSBhdmFpbGFibGUgaW4gdGhlIENQVSwgV2ViR0wsIGFuZFxuICogV0FTTSBiYWNrZW5kcy5cbiAqXG4gKiBAcGFyYW0gaW1hZ2UgNGQgdGVuc29yIG9mIHNoYXBlIGBbYmF0Y2gsIGltYWdlSGVpZ2h0LCBpbWFnZVdpZHRoLCBkZXB0aF1gLlxuICovXG4vKiogQGRvYyB7aGVhZGluZzogJ09wZXJhdGlvbnMnLCBzdWJoZWFkaW5nOiAnSW1hZ2VzJywgbmFtZXNwYWNlOiAnaW1hZ2UnfSAqL1xuZnVuY3Rpb24gZmxpcExlZnRSaWdodF8oaW1hZ2U6IFRlbnNvcjREfFRlbnNvckxpa2UpOiBUZW5zb3I0RCB7XG4gIGNvbnN0ICRpbWFnZSA9IGNvbnZlcnRUb1RlbnNvcihpbWFnZSwgJ2ltYWdlJywgJ2ZsaXBMZWZ0UmlnaHQnLCAnZmxvYXQzMicpO1xuXG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgJGltYWdlLnJhbmsgPT09IDQsXG4gICAgICAoKSA9PiAnRXJyb3IgaW4gZmxpcExlZnRSaWdodDogaW1hZ2UgbXVzdCBiZSByYW5rIDQsJyArXG4gICAgICAgICAgYGJ1dCBnb3QgcmFuayAkeyRpbWFnZS5yYW5rfS5gKTtcblxuICBjb25zdCBpbnB1dHM6IEZsaXBMZWZ0UmlnaHRJbnB1dHMgPSB7aW1hZ2U6ICRpbWFnZX07XG4gIGNvbnN0IHJlcyA9XG4gICAgICBFTkdJTkUucnVuS2VybmVsKEZsaXBMZWZ0UmlnaHQsIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCwge30pO1xuICByZXR1cm4gcmVzIGFzIFRlbnNvcjREO1xufVxuXG5leHBvcnQgY29uc3QgZmxpcExlZnRSaWdodCA9IG9wKHtmbGlwTGVmdFJpZ2h0X30pO1xuIl19