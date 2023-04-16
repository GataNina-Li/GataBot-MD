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
import { Dilation2D } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { op } from './operation';
import { reshape } from './reshape';
/**
 * Computes the grayscale dilation over the input `x`.
 *
 * @param x The input tensor, rank 3 or rank 4 of shape
 *     `[batch, height, width, inChannels]`. If rank 3, batch of 1 is assumed.
 * @param filter The filter tensor, rank 3, of shape
 *     `[filterHeight, filterWidth, depth]`.
 * @param strides The strides of the sliding window for each dimension of the
 *     input tensor: `[strideHeight, strideWidth]`.
 *     If `strides` is a single number,
 *     then `strideHeight == strideWidth`.
 * @param pad The type of padding algorithm.
 *    - `same` and stride 1: output will be of same size as input,
 *       regardless of filter size.
 *    - `valid`: output will be smaller than input if filter is larger
 *       than 1*1x1.
 *    - For more info, see this guide:
 *     [https://www.tensorflow.org/api_docs/python/tf/nn/convolution](
 *          https://www.tensorflow.org/api_docs/python/tf/nn/convolution)
 * @param dataFormat Specify the data format of the input and output data.
 *      Defaults to 'NHWC'. Only 'NHWC' is currently supported. With the
 *      default format "NHWC", the data is stored in the order of: [batch,
 *      height, width, channels].
 * @param dilations The dilation rates: `[dilationHeight, dilationWidth]`
 *     in which we sample input values across the height and width dimensions
 *     for atrous morphological dilation. Defaults to `[1, 1]`. If `dilations`
 *     is a single number, then `dilationHeight == dilationWidth`. If it is
 *     greater than 1, then all values of `strides` must be 1.
 *
 * @doc {heading: 'Operations', subheading: 'Convolution'}
 */
function dilation2d_(x, filter, strides, pad, dilations = [1, 1], dataFormat = 'NHWC') {
    const $x = convertToTensor(x, 'x', 'dilation2d');
    const $filter = convertToTensor(filter, 'filter', 'dilation2d');
    util.assert($x.rank === 3 || $x.rank === 4, () => `Error in dilation2d: input must be rank 3 or 4, but got rank ` +
        `${$x.rank}.`);
    util.assert($filter.rank === 3, () => `Error in dilation2d: filter must be rank 3, but got rank ` +
        `${$filter.rank}.`);
    util.assert(dataFormat === 'NHWC', () => `Error in dilation2d: Only NHWC is currently supported, ` +
        `but got dataFormat of ${dataFormat}`);
    let x4D = $x;
    let reshapedTo4D = false;
    if ($x.rank === 3) {
        x4D = reshape($x, [1, $x.shape[0], $x.shape[1], $x.shape[2]]);
        reshapedTo4D = true;
    }
    const inputs = { x: x4D, filter: $filter };
    const attrs = { strides, pad, dilations };
    // tslint:disable-next-line: no-unnecessary-type-assertion
    const res = ENGINE.runKernel(Dilation2D, inputs, attrs);
    if (reshapedTo4D) {
        return reshape(res, [res.shape[1], res.shape[2], res.shape[3]]);
    }
    return res;
}
export const dilation2d = op({ dilation2d_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlsYXRpb24yZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2RpbGF0aW9uMmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsVUFBVSxFQUFvQyxNQUFNLGlCQUFpQixDQUFDO0FBSTlFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUVuRCxPQUFPLEtBQUssSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUVoQyxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFbEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQThCRztBQUNILFNBQVMsV0FBVyxDQUNoQixDQUFlLEVBQUUsTUFBMkIsRUFDNUMsT0FBZ0MsRUFBRSxHQUFtQixFQUNyRCxZQUFxQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFDM0MsYUFBcUIsTUFBTTtJQUM3QixNQUFNLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNqRCxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUVoRSxJQUFJLENBQUMsTUFBTSxDQUNQLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUM5QixHQUFHLEVBQUUsQ0FBQywrREFBK0Q7UUFDakUsR0FBRyxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUN2QixJQUFJLENBQUMsTUFBTSxDQUNQLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUNsQixHQUFHLEVBQUUsQ0FBQywyREFBMkQ7UUFDN0QsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUM1QixJQUFJLENBQUMsTUFBTSxDQUNQLFVBQVUsS0FBSyxNQUFNLEVBQ3JCLEdBQUcsRUFBRSxDQUFDLHlEQUF5RDtRQUMzRCx5QkFBeUIsVUFBVSxFQUFFLENBQUMsQ0FBQztJQUUvQyxJQUFJLEdBQUcsR0FBRyxFQUFjLENBQUM7SUFDekIsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO0lBRXpCLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7UUFDakIsR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlELFlBQVksR0FBRyxJQUFJLENBQUM7S0FDckI7SUFFRCxNQUFNLE1BQU0sR0FBcUIsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUMsQ0FBQztJQUMzRCxNQUFNLEtBQUssR0FBb0IsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBQyxDQUFDO0lBRXpELDBEQUEwRDtJQUMxRCxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUNaLFVBQVUsRUFBRSxNQUE4QixFQUMxQyxLQUEyQixDQUFNLENBQUM7SUFFbEQsSUFBSSxZQUFZLEVBQUU7UUFDaEIsT0FBTyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBTSxDQUFDO0tBQ3RFO0lBRUQsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxFQUFDLFdBQVcsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtEaWxhdGlvbjJELCBEaWxhdGlvbjJEQXR0cnMsIERpbGF0aW9uMkRJbnB1dHN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge05hbWVkQXR0ck1hcH0gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7VGVuc29yM0QsIFRlbnNvcjREfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5pbXBvcnQge3Jlc2hhcGV9IGZyb20gJy4vcmVzaGFwZSc7XG5cbi8qKlxuICogQ29tcHV0ZXMgdGhlIGdyYXlzY2FsZSBkaWxhdGlvbiBvdmVyIHRoZSBpbnB1dCBgeGAuXG4gKlxuICogQHBhcmFtIHggVGhlIGlucHV0IHRlbnNvciwgcmFuayAzIG9yIHJhbmsgNCBvZiBzaGFwZVxuICogICAgIGBbYmF0Y2gsIGhlaWdodCwgd2lkdGgsIGluQ2hhbm5lbHNdYC4gSWYgcmFuayAzLCBiYXRjaCBvZiAxIGlzIGFzc3VtZWQuXG4gKiBAcGFyYW0gZmlsdGVyIFRoZSBmaWx0ZXIgdGVuc29yLCByYW5rIDMsIG9mIHNoYXBlXG4gKiAgICAgYFtmaWx0ZXJIZWlnaHQsIGZpbHRlcldpZHRoLCBkZXB0aF1gLlxuICogQHBhcmFtIHN0cmlkZXMgVGhlIHN0cmlkZXMgb2YgdGhlIHNsaWRpbmcgd2luZG93IGZvciBlYWNoIGRpbWVuc2lvbiBvZiB0aGVcbiAqICAgICBpbnB1dCB0ZW5zb3I6IGBbc3RyaWRlSGVpZ2h0LCBzdHJpZGVXaWR0aF1gLlxuICogICAgIElmIGBzdHJpZGVzYCBpcyBhIHNpbmdsZSBudW1iZXIsXG4gKiAgICAgdGhlbiBgc3RyaWRlSGVpZ2h0ID09IHN0cmlkZVdpZHRoYC5cbiAqIEBwYXJhbSBwYWQgVGhlIHR5cGUgb2YgcGFkZGluZyBhbGdvcml0aG0uXG4gKiAgICAtIGBzYW1lYCBhbmQgc3RyaWRlIDE6IG91dHB1dCB3aWxsIGJlIG9mIHNhbWUgc2l6ZSBhcyBpbnB1dCxcbiAqICAgICAgIHJlZ2FyZGxlc3Mgb2YgZmlsdGVyIHNpemUuXG4gKiAgICAtIGB2YWxpZGA6IG91dHB1dCB3aWxsIGJlIHNtYWxsZXIgdGhhbiBpbnB1dCBpZiBmaWx0ZXIgaXMgbGFyZ2VyXG4gKiAgICAgICB0aGFuIDEqMXgxLlxuICogICAgLSBGb3IgbW9yZSBpbmZvLCBzZWUgdGhpcyBndWlkZTpcbiAqICAgICBbaHR0cHM6Ly93d3cudGVuc29yZmxvdy5vcmcvYXBpX2RvY3MvcHl0aG9uL3RmL25uL2NvbnZvbHV0aW9uXShcbiAqICAgICAgICAgIGh0dHBzOi8vd3d3LnRlbnNvcmZsb3cub3JnL2FwaV9kb2NzL3B5dGhvbi90Zi9ubi9jb252b2x1dGlvbilcbiAqIEBwYXJhbSBkYXRhRm9ybWF0IFNwZWNpZnkgdGhlIGRhdGEgZm9ybWF0IG9mIHRoZSBpbnB1dCBhbmQgb3V0cHV0IGRhdGEuXG4gKiAgICAgIERlZmF1bHRzIHRvICdOSFdDJy4gT25seSAnTkhXQycgaXMgY3VycmVudGx5IHN1cHBvcnRlZC4gV2l0aCB0aGVcbiAqICAgICAgZGVmYXVsdCBmb3JtYXQgXCJOSFdDXCIsIHRoZSBkYXRhIGlzIHN0b3JlZCBpbiB0aGUgb3JkZXIgb2Y6IFtiYXRjaCxcbiAqICAgICAgaGVpZ2h0LCB3aWR0aCwgY2hhbm5lbHNdLlxuICogQHBhcmFtIGRpbGF0aW9ucyBUaGUgZGlsYXRpb24gcmF0ZXM6IGBbZGlsYXRpb25IZWlnaHQsIGRpbGF0aW9uV2lkdGhdYFxuICogICAgIGluIHdoaWNoIHdlIHNhbXBsZSBpbnB1dCB2YWx1ZXMgYWNyb3NzIHRoZSBoZWlnaHQgYW5kIHdpZHRoIGRpbWVuc2lvbnNcbiAqICAgICBmb3IgYXRyb3VzIG1vcnBob2xvZ2ljYWwgZGlsYXRpb24uIERlZmF1bHRzIHRvIGBbMSwgMV1gLiBJZiBgZGlsYXRpb25zYFxuICogICAgIGlzIGEgc2luZ2xlIG51bWJlciwgdGhlbiBgZGlsYXRpb25IZWlnaHQgPT0gZGlsYXRpb25XaWR0aGAuIElmIGl0IGlzXG4gKiAgICAgZ3JlYXRlciB0aGFuIDEsIHRoZW4gYWxsIHZhbHVlcyBvZiBgc3RyaWRlc2AgbXVzdCBiZSAxLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdPcGVyYXRpb25zJywgc3ViaGVhZGluZzogJ0NvbnZvbHV0aW9uJ31cbiAqL1xuZnVuY3Rpb24gZGlsYXRpb24yZF88VCBleHRlbmRzIFRlbnNvcjNEfFRlbnNvcjREPihcbiAgICB4OiBUfFRlbnNvckxpa2UsIGZpbHRlcjogVGVuc29yM0R8VGVuc29yTGlrZSxcbiAgICBzdHJpZGVzOiBbbnVtYmVyLCBudW1iZXJdfG51bWJlciwgcGFkOiAndmFsaWQnfCdzYW1lJyxcbiAgICBkaWxhdGlvbnM6IFtudW1iZXIsIG51bWJlcl18bnVtYmVyID0gWzEsIDFdLFxuICAgIGRhdGFGb3JtYXQ6ICdOSFdDJyA9ICdOSFdDJyk6IFQge1xuICBjb25zdCAkeCA9IGNvbnZlcnRUb1RlbnNvcih4LCAneCcsICdkaWxhdGlvbjJkJyk7XG4gIGNvbnN0ICRmaWx0ZXIgPSBjb252ZXJ0VG9UZW5zb3IoZmlsdGVyLCAnZmlsdGVyJywgJ2RpbGF0aW9uMmQnKTtcblxuICB1dGlsLmFzc2VydChcbiAgICAgICR4LnJhbmsgPT09IDMgfHwgJHgucmFuayA9PT0gNCxcbiAgICAgICgpID0+IGBFcnJvciBpbiBkaWxhdGlvbjJkOiBpbnB1dCBtdXN0IGJlIHJhbmsgMyBvciA0LCBidXQgZ290IHJhbmsgYCArXG4gICAgICAgICAgYCR7JHgucmFua30uYCk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgJGZpbHRlci5yYW5rID09PSAzLFxuICAgICAgKCkgPT4gYEVycm9yIGluIGRpbGF0aW9uMmQ6IGZpbHRlciBtdXN0IGJlIHJhbmsgMywgYnV0IGdvdCByYW5rIGAgK1xuICAgICAgICAgIGAkeyRmaWx0ZXIucmFua30uYCk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgZGF0YUZvcm1hdCA9PT0gJ05IV0MnLFxuICAgICAgKCkgPT4gYEVycm9yIGluIGRpbGF0aW9uMmQ6IE9ubHkgTkhXQyBpcyBjdXJyZW50bHkgc3VwcG9ydGVkLCBgICtcbiAgICAgICAgICBgYnV0IGdvdCBkYXRhRm9ybWF0IG9mICR7ZGF0YUZvcm1hdH1gKTtcblxuICBsZXQgeDREID0gJHggYXMgVGVuc29yNEQ7XG4gIGxldCByZXNoYXBlZFRvNEQgPSBmYWxzZTtcblxuICBpZiAoJHgucmFuayA9PT0gMykge1xuICAgIHg0RCA9IHJlc2hhcGUoJHgsIFsxLCAkeC5zaGFwZVswXSwgJHguc2hhcGVbMV0sICR4LnNoYXBlWzJdXSk7XG4gICAgcmVzaGFwZWRUbzREID0gdHJ1ZTtcbiAgfVxuXG4gIGNvbnN0IGlucHV0czogRGlsYXRpb24yRElucHV0cyA9IHt4OiB4NEQsIGZpbHRlcjogJGZpbHRlcn07XG4gIGNvbnN0IGF0dHJzOiBEaWxhdGlvbjJEQXR0cnMgPSB7c3RyaWRlcywgcGFkLCBkaWxhdGlvbnN9O1xuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tdW5uZWNlc3NhcnktdHlwZS1hc3NlcnRpb25cbiAgY29uc3QgcmVzID0gRU5HSU5FLnJ1bktlcm5lbChcbiAgICAgICAgICAgICAgICAgIERpbGF0aW9uMkQsIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCxcbiAgICAgICAgICAgICAgICAgIGF0dHJzIGFzIHt9IGFzIE5hbWVkQXR0ck1hcCkgYXMgVDtcblxuICBpZiAocmVzaGFwZWRUbzREKSB7XG4gICAgcmV0dXJuIHJlc2hhcGUocmVzLCBbcmVzLnNoYXBlWzFdLCByZXMuc2hhcGVbMl0sIHJlcy5zaGFwZVszXV0pIGFzIFQ7XG4gIH1cblxuICByZXR1cm4gcmVzO1xufVxuXG5leHBvcnQgY29uc3QgZGlsYXRpb24yZCA9IG9wKHtkaWxhdGlvbjJkX30pO1xuIl19