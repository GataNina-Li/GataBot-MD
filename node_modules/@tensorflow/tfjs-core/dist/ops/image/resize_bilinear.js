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
import { ResizeBilinear } from '../../kernel_names';
import { convertToTensor } from '../../tensor_util_env';
import * as util from '../../util';
import { op } from '../operation';
import { reshape } from '../reshape';
/**
 * Bilinear resize a single 3D image or a batch of 3D images to a new shape.
 *
 * @param images The images, of rank 4 or rank 3, of shape
 *     `[batch, height, width, inChannels]`. If rank 3, batch of 1 is assumed.
 * @param size The new shape `[newHeight, newWidth]` to resize the
 *     images to. Each channel is resized individually.
 * @param alignCorners Defaults to `false`. If true, rescale
 *     input by `(new_height - 1) / (height - 1)`, which exactly aligns the 4
 *     corners of images and resized images. If false, rescale by
 *     `new_height / height`. Treat similarly the width dimension.
 * @param halfPixelCenters Defaults to `false`. Whether to assume pixel centers
 *     are at 0.5, which would make the floating point coordinates of the top
 *     left pixel 0.5, 0.5.
 *
 * @doc {heading: 'Operations', subheading: 'Images', namespace: 'image'}
 */
function resizeBilinear_(images, size, alignCorners = false, halfPixelCenters = false) {
    const $images = convertToTensor(images, 'images', 'resizeBilinear');
    util.assert($images.rank === 3 || $images.rank === 4, () => `Error in resizeBilinear: x must be rank 3 or 4, but got ` +
        `rank ${$images.rank}.`);
    util.assert(size.length === 2, () => `Error in resizeBilinear: new shape must 2D, but got shape ` +
        `${size}.`);
    util.assert(halfPixelCenters === false || alignCorners === false, () => `Error in resizeBilinear: If halfPixelCenters is true, ` +
        `alignCorners must be false.`);
    let batchImages = $images;
    let reshapedTo4D = false;
    if ($images.rank === 3) {
        reshapedTo4D = true;
        batchImages = reshape($images, [1, $images.shape[0], $images.shape[1], $images.shape[2]]);
    }
    const [] = size;
    const inputs = { images: batchImages };
    const attrs = { alignCorners, halfPixelCenters, size };
    // tslint:disable-next-line: no-unnecessary-type-assertion
    const res = ENGINE.runKernel(ResizeBilinear, inputs, attrs);
    if (reshapedTo4D) {
        return reshape(res, [res.shape[1], res.shape[2], res.shape[3]]);
    }
    return res;
}
export const resizeBilinear = op({ resizeBilinear_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplX2JpbGluZWFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvaW1hZ2UvcmVzaXplX2JpbGluZWFyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDcEMsT0FBTyxFQUFDLGNBQWMsRUFBNEMsTUFBTSxvQkFBb0IsQ0FBQztBQUk3RixPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFdEQsT0FBTyxLQUFLLElBQUksTUFBTSxZQUFZLENBQUM7QUFFbkMsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUNoQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsU0FBUyxlQUFlLENBQ3BCLE1BQW9CLEVBQUUsSUFBc0IsRUFBRSxZQUFZLEdBQUcsS0FBSyxFQUNsRSxnQkFBZ0IsR0FBRyxLQUFLO0lBQzFCLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFFcEUsSUFBSSxDQUFDLE1BQU0sQ0FDUCxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsRUFDeEMsR0FBRyxFQUFFLENBQUMsMERBQTBEO1FBQzVELFFBQVEsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7SUFDakMsSUFBSSxDQUFDLE1BQU0sQ0FDUCxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFDakIsR0FBRyxFQUFFLENBQUMsNERBQTREO1FBQzlELEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNwQixJQUFJLENBQUMsTUFBTSxDQUNQLGdCQUFnQixLQUFLLEtBQUssSUFBSSxZQUFZLEtBQUssS0FBSyxFQUNwRCxHQUFHLEVBQUUsQ0FBQyx3REFBd0Q7UUFDMUQsNkJBQTZCLENBQUMsQ0FBQztJQUV2QyxJQUFJLFdBQVcsR0FBRyxPQUFtQixDQUFDO0lBQ3RDLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztJQUN6QixJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO1FBQ3RCLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsV0FBVyxHQUFHLE9BQU8sQ0FDakIsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN6RTtJQUVELE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztJQUVoQixNQUFNLE1BQU0sR0FBeUIsRUFBQyxNQUFNLEVBQUUsV0FBVyxFQUFDLENBQUM7SUFDM0QsTUFBTSxLQUFLLEdBQXdCLEVBQUMsWUFBWSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBQyxDQUFDO0lBRTFFLDBEQUEwRDtJQUMxRCxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUNaLGNBQWMsRUFBRSxNQUE4QixFQUM5QyxLQUEyQixDQUFNLENBQUM7SUFFbEQsSUFBSSxZQUFZLEVBQUU7UUFDaEIsT0FBTyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBTSxDQUFDO0tBQ3RFO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQyxFQUFDLGVBQWUsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi8uLi9lbmdpbmUnO1xuaW1wb3J0IHtSZXNpemVCaWxpbmVhciwgUmVzaXplQmlsaW5lYXJBdHRycywgUmVzaXplQmlsaW5lYXJJbnB1dHN9IGZyb20gJy4uLy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge05hbWVkQXR0ck1hcH0gZnJvbSAnLi4vLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7VGVuc29yM0QsIFRlbnNvcjREfSBmcm9tICcuLi8uLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi8uLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uLy4uL3V0aWwnO1xuXG5pbXBvcnQge29wfSBmcm9tICcuLi9vcGVyYXRpb24nO1xuaW1wb3J0IHtyZXNoYXBlfSBmcm9tICcuLi9yZXNoYXBlJztcblxuLyoqXG4gKiBCaWxpbmVhciByZXNpemUgYSBzaW5nbGUgM0QgaW1hZ2Ugb3IgYSBiYXRjaCBvZiAzRCBpbWFnZXMgdG8gYSBuZXcgc2hhcGUuXG4gKlxuICogQHBhcmFtIGltYWdlcyBUaGUgaW1hZ2VzLCBvZiByYW5rIDQgb3IgcmFuayAzLCBvZiBzaGFwZVxuICogICAgIGBbYmF0Y2gsIGhlaWdodCwgd2lkdGgsIGluQ2hhbm5lbHNdYC4gSWYgcmFuayAzLCBiYXRjaCBvZiAxIGlzIGFzc3VtZWQuXG4gKiBAcGFyYW0gc2l6ZSBUaGUgbmV3IHNoYXBlIGBbbmV3SGVpZ2h0LCBuZXdXaWR0aF1gIHRvIHJlc2l6ZSB0aGVcbiAqICAgICBpbWFnZXMgdG8uIEVhY2ggY2hhbm5lbCBpcyByZXNpemVkIGluZGl2aWR1YWxseS5cbiAqIEBwYXJhbSBhbGlnbkNvcm5lcnMgRGVmYXVsdHMgdG8gYGZhbHNlYC4gSWYgdHJ1ZSwgcmVzY2FsZVxuICogICAgIGlucHV0IGJ5IGAobmV3X2hlaWdodCAtIDEpIC8gKGhlaWdodCAtIDEpYCwgd2hpY2ggZXhhY3RseSBhbGlnbnMgdGhlIDRcbiAqICAgICBjb3JuZXJzIG9mIGltYWdlcyBhbmQgcmVzaXplZCBpbWFnZXMuIElmIGZhbHNlLCByZXNjYWxlIGJ5XG4gKiAgICAgYG5ld19oZWlnaHQgLyBoZWlnaHRgLiBUcmVhdCBzaW1pbGFybHkgdGhlIHdpZHRoIGRpbWVuc2lvbi5cbiAqIEBwYXJhbSBoYWxmUGl4ZWxDZW50ZXJzIERlZmF1bHRzIHRvIGBmYWxzZWAuIFdoZXRoZXIgdG8gYXNzdW1lIHBpeGVsIGNlbnRlcnNcbiAqICAgICBhcmUgYXQgMC41LCB3aGljaCB3b3VsZCBtYWtlIHRoZSBmbG9hdGluZyBwb2ludCBjb29yZGluYXRlcyBvZiB0aGUgdG9wXG4gKiAgICAgbGVmdCBwaXhlbCAwLjUsIDAuNS5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdJbWFnZXMnLCBuYW1lc3BhY2U6ICdpbWFnZSd9XG4gKi9cbmZ1bmN0aW9uIHJlc2l6ZUJpbGluZWFyXzxUIGV4dGVuZHMgVGVuc29yM0R8VGVuc29yNEQ+KFxuICAgIGltYWdlczogVHxUZW5zb3JMaWtlLCBzaXplOiBbbnVtYmVyLCBudW1iZXJdLCBhbGlnbkNvcm5lcnMgPSBmYWxzZSxcbiAgICBoYWxmUGl4ZWxDZW50ZXJzID0gZmFsc2UpOiBUIHtcbiAgY29uc3QgJGltYWdlcyA9IGNvbnZlcnRUb1RlbnNvcihpbWFnZXMsICdpbWFnZXMnLCAncmVzaXplQmlsaW5lYXInKTtcblxuICB1dGlsLmFzc2VydChcbiAgICAgICRpbWFnZXMucmFuayA9PT0gMyB8fCAkaW1hZ2VzLnJhbmsgPT09IDQsXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gcmVzaXplQmlsaW5lYXI6IHggbXVzdCBiZSByYW5rIDMgb3IgNCwgYnV0IGdvdCBgICtcbiAgICAgICAgICBgcmFuayAkeyRpbWFnZXMucmFua30uYCk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgc2l6ZS5sZW5ndGggPT09IDIsXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gcmVzaXplQmlsaW5lYXI6IG5ldyBzaGFwZSBtdXN0IDJELCBidXQgZ290IHNoYXBlIGAgK1xuICAgICAgICAgIGAke3NpemV9LmApO1xuICB1dGlsLmFzc2VydChcbiAgICAgIGhhbGZQaXhlbENlbnRlcnMgPT09IGZhbHNlIHx8IGFsaWduQ29ybmVycyA9PT0gZmFsc2UsXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gcmVzaXplQmlsaW5lYXI6IElmIGhhbGZQaXhlbENlbnRlcnMgaXMgdHJ1ZSwgYCArXG4gICAgICAgICAgYGFsaWduQ29ybmVycyBtdXN0IGJlIGZhbHNlLmApO1xuXG4gIGxldCBiYXRjaEltYWdlcyA9ICRpbWFnZXMgYXMgVGVuc29yNEQ7XG4gIGxldCByZXNoYXBlZFRvNEQgPSBmYWxzZTtcbiAgaWYgKCRpbWFnZXMucmFuayA9PT0gMykge1xuICAgIHJlc2hhcGVkVG80RCA9IHRydWU7XG4gICAgYmF0Y2hJbWFnZXMgPSByZXNoYXBlKFxuICAgICAgICAkaW1hZ2VzLCBbMSwgJGltYWdlcy5zaGFwZVswXSwgJGltYWdlcy5zaGFwZVsxXSwgJGltYWdlcy5zaGFwZVsyXV0pO1xuICB9XG5cbiAgY29uc3QgW10gPSBzaXplO1xuXG4gIGNvbnN0IGlucHV0czogUmVzaXplQmlsaW5lYXJJbnB1dHMgPSB7aW1hZ2VzOiBiYXRjaEltYWdlc307XG4gIGNvbnN0IGF0dHJzOiBSZXNpemVCaWxpbmVhckF0dHJzID0ge2FsaWduQ29ybmVycywgaGFsZlBpeGVsQ2VudGVycywgc2l6ZX07XG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby11bm5lY2Vzc2FyeS10eXBlLWFzc2VydGlvblxuICBjb25zdCByZXMgPSBFTkdJTkUucnVuS2VybmVsKFxuICAgICAgICAgICAgICAgICAgUmVzaXplQmlsaW5lYXIsIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCxcbiAgICAgICAgICAgICAgICAgIGF0dHJzIGFzIHt9IGFzIE5hbWVkQXR0ck1hcCkgYXMgVDtcblxuICBpZiAocmVzaGFwZWRUbzREKSB7XG4gICAgcmV0dXJuIHJlc2hhcGUocmVzLCBbcmVzLnNoYXBlWzFdLCByZXMuc2hhcGVbMl0sIHJlcy5zaGFwZVszXV0pIGFzIFQ7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGNvbnN0IHJlc2l6ZUJpbGluZWFyID0gb3Aoe3Jlc2l6ZUJpbGluZWFyX30pO1xuIl19