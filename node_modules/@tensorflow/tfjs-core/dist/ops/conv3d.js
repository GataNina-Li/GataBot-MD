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
import { Conv3D } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { eitherStridesOrDilationsAreOne } from './conv_util';
import { op } from './operation';
import { reshape } from './reshape';
/**
 * Computes a 3D convolution over the input x.
 *
 * @param x The input tensor, of rank 5 or rank 4, of shape
 *     `[batch, depth, height, width, channels]`. If rank 4,
 * batch of 1 is assumed.
 * @param filter The filter, rank 5, of shape
 *     `[filterDepth, filterHeight, filterWidth, inChannels, outChannels]`.
 *      inChannels must match between input and filter.
 * @param strides The strides of the convolution: `[strideDepth, strideHeight,
 * strideWidth]`.
 * @param pad The type of padding algorithm.
 *    - `same` and stride 1: output will be of same size as input,
 *       regardless of filter size.
 *    - `valid`: output will be smaller than input if filter is larger
 *       than 1x1.
 *   - For more info, see this guide:
 *     [https://www.tensorflow.org/api_docs/python/tf/nn/convolution](
 *          https://www.tensorflow.org/api_docs/python/tf/nn/convolution)
 * @param dataFormat: An optional string from: "NDHWC", "NCDHW". Defaults to
 *     "NDHWC". Specify the data format of the input and output data. With the
 *     default format "NDHWC", the data is stored in the order of: [batch,
 *     depth, height, width, channels]. Only "NDHWC" is currently supported.
 * @param dilations The dilation rates: `[dilationDepth, dilationHeight,
 *     dilationWidth]` in which we sample input values across the height
 *     and width dimensions in atrous convolution. Defaults to `[1, 1, 1]`.
 *     If `dilations` is a single number, then
 *     `dilationDepth == dilationHeight == dilationWidth`. If it is greater
 *     than 1, then all values of `strides` must be 1.
 *
 * @doc {heading: 'Operations', subheading: 'Convolution'}
 */
function conv3d_(x, filter, strides, pad, dataFormat = 'NDHWC', dilations = [1, 1, 1]) {
    const $x = convertToTensor(x, 'x', 'conv3d');
    const $filter = convertToTensor(filter, 'filter', 'conv3d');
    let x5D = $x;
    let reshapedTo5D = false;
    if ($x.rank === 4) {
        reshapedTo5D = true;
        x5D = reshape($x, [1, $x.shape[0], $x.shape[1], $x.shape[2], $x.shape[3]]);
    }
    util.assert(x5D.rank === 5, () => `Error in conv3d: input must be rank 5, but got rank ${x5D.rank}.`);
    util.assert($filter.rank === 5, () => `Error in conv3d: filter must be rank 5, but got rank ` +
        `${$filter.rank}.`);
    util.assert(x5D.shape[4] === $filter.shape[3], () => `Error in conv3d: depth of input (${x5D.shape[4]}) must match ` +
        `input depth for filter ${$filter.shape[3]}.`);
    util.assert(eitherStridesOrDilationsAreOne(strides, dilations), () => 'Error in conv3D: Either strides or dilations must be 1. ' +
        `Got strides ${strides} and dilations '${dilations}'`);
    util.assert(dataFormat === 'NDHWC', () => `Error in conv3d: got dataFormat of ${dataFormat} but only NDHWC is currently supported.`);
    const inputs = { x: x5D, filter: $filter };
    const attrs = { strides, pad, dataFormat, dilations };
    // tslint:disable-next-line: no-unnecessary-type-assertion
    const res = ENGINE.runKernel(Conv3D, inputs, attrs);
    if (reshapedTo5D) {
        return reshape(res, [res.shape[1], res.shape[2], res.shape[3], res.shape[4]]);
    }
    return res;
}
export const conv3d = op({ conv3d_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udjNkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvY29udjNkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLE1BQU0sRUFBNEIsTUFBTSxpQkFBaUIsQ0FBQztBQUlsRSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFbkQsT0FBTyxLQUFLLElBQUksTUFBTSxTQUFTLENBQUM7QUFFaEMsT0FBTyxFQUFDLDhCQUE4QixFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzNELE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDL0IsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUVsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQStCRztBQUNILFNBQVMsT0FBTyxDQUNaLENBQWUsRUFBRSxNQUEyQixFQUM1QyxPQUF3QyxFQUFFLEdBQW1CLEVBQzdELGFBQThCLE9BQU8sRUFDckMsWUFBNkMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN4RCxNQUFNLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3QyxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUU1RCxJQUFJLEdBQUcsR0FBRyxFQUFjLENBQUM7SUFDekIsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO0lBRXpCLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7UUFDakIsWUFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM1RTtJQUNELElBQUksQ0FBQyxNQUFNLENBQ1AsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQ2QsR0FBRyxFQUFFLENBQUMsdURBQXVELEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQzlFLElBQUksQ0FBQyxNQUFNLENBQ1AsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQ2xCLEdBQUcsRUFBRSxDQUFDLHVEQUF1RDtRQUN6RCxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLElBQUksQ0FBQyxNQUFNLENBQ1AsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUNqQyxHQUFHLEVBQUUsQ0FBQyxvQ0FBb0MsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsZUFBZTtRQUNqRSwwQkFBMEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkQsSUFBSSxDQUFDLE1BQU0sQ0FDUCw4QkFBOEIsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLEVBQ2xELEdBQUcsRUFBRSxDQUFDLDBEQUEwRDtRQUM1RCxlQUFlLE9BQU8sbUJBQW1CLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDL0QsSUFBSSxDQUFDLE1BQU0sQ0FDUCxVQUFVLEtBQUssT0FBTyxFQUN0QixHQUFHLEVBQUUsQ0FBQyxzQ0FDRixVQUFVLHlDQUF5QyxDQUFDLENBQUM7SUFFN0QsTUFBTSxNQUFNLEdBQWlCLEVBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFDLENBQUM7SUFFdkQsTUFBTSxLQUFLLEdBQWdCLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFDLENBQUM7SUFFakUsMERBQTBEO0lBQzFELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQ1osTUFBTSxFQUFFLE1BQThCLEVBQ3RDLEtBQTJCLENBQU0sQ0FBQztJQUVsRCxJQUFJLFlBQVksRUFBRTtRQUNoQixPQUFPLE9BQU8sQ0FDSCxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ25FLENBQUM7S0FDUDtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge0NvbnYzRCwgQ29udjNEQXR0cnMsIENvbnYzRElucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7TmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtUZW5zb3I0RCwgVGVuc29yNUR9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7ZWl0aGVyU3RyaWRlc09yRGlsYXRpb25zQXJlT25lfSBmcm9tICcuL2NvbnZfdXRpbCc7XG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5pbXBvcnQge3Jlc2hhcGV9IGZyb20gJy4vcmVzaGFwZSc7XG5cbi8qKlxuICogQ29tcHV0ZXMgYSAzRCBjb252b2x1dGlvbiBvdmVyIHRoZSBpbnB1dCB4LlxuICpcbiAqIEBwYXJhbSB4IFRoZSBpbnB1dCB0ZW5zb3IsIG9mIHJhbmsgNSBvciByYW5rIDQsIG9mIHNoYXBlXG4gKiAgICAgYFtiYXRjaCwgZGVwdGgsIGhlaWdodCwgd2lkdGgsIGNoYW5uZWxzXWAuIElmIHJhbmsgNCxcbiAqIGJhdGNoIG9mIDEgaXMgYXNzdW1lZC5cbiAqIEBwYXJhbSBmaWx0ZXIgVGhlIGZpbHRlciwgcmFuayA1LCBvZiBzaGFwZVxuICogICAgIGBbZmlsdGVyRGVwdGgsIGZpbHRlckhlaWdodCwgZmlsdGVyV2lkdGgsIGluQ2hhbm5lbHMsIG91dENoYW5uZWxzXWAuXG4gKiAgICAgIGluQ2hhbm5lbHMgbXVzdCBtYXRjaCBiZXR3ZWVuIGlucHV0IGFuZCBmaWx0ZXIuXG4gKiBAcGFyYW0gc3RyaWRlcyBUaGUgc3RyaWRlcyBvZiB0aGUgY29udm9sdXRpb246IGBbc3RyaWRlRGVwdGgsIHN0cmlkZUhlaWdodCxcbiAqIHN0cmlkZVdpZHRoXWAuXG4gKiBAcGFyYW0gcGFkIFRoZSB0eXBlIG9mIHBhZGRpbmcgYWxnb3JpdGhtLlxuICogICAgLSBgc2FtZWAgYW5kIHN0cmlkZSAxOiBvdXRwdXQgd2lsbCBiZSBvZiBzYW1lIHNpemUgYXMgaW5wdXQsXG4gKiAgICAgICByZWdhcmRsZXNzIG9mIGZpbHRlciBzaXplLlxuICogICAgLSBgdmFsaWRgOiBvdXRwdXQgd2lsbCBiZSBzbWFsbGVyIHRoYW4gaW5wdXQgaWYgZmlsdGVyIGlzIGxhcmdlclxuICogICAgICAgdGhhbiAxeDEuXG4gKiAgIC0gRm9yIG1vcmUgaW5mbywgc2VlIHRoaXMgZ3VpZGU6XG4gKiAgICAgW2h0dHBzOi8vd3d3LnRlbnNvcmZsb3cub3JnL2FwaV9kb2NzL3B5dGhvbi90Zi9ubi9jb252b2x1dGlvbl0oXG4gKiAgICAgICAgICBodHRwczovL3d3dy50ZW5zb3JmbG93Lm9yZy9hcGlfZG9jcy9weXRob24vdGYvbm4vY29udm9sdXRpb24pXG4gKiBAcGFyYW0gZGF0YUZvcm1hdDogQW4gb3B0aW9uYWwgc3RyaW5nIGZyb206IFwiTkRIV0NcIiwgXCJOQ0RIV1wiLiBEZWZhdWx0cyB0b1xuICogICAgIFwiTkRIV0NcIi4gU3BlY2lmeSB0aGUgZGF0YSBmb3JtYXQgb2YgdGhlIGlucHV0IGFuZCBvdXRwdXQgZGF0YS4gV2l0aCB0aGVcbiAqICAgICBkZWZhdWx0IGZvcm1hdCBcIk5ESFdDXCIsIHRoZSBkYXRhIGlzIHN0b3JlZCBpbiB0aGUgb3JkZXIgb2Y6IFtiYXRjaCxcbiAqICAgICBkZXB0aCwgaGVpZ2h0LCB3aWR0aCwgY2hhbm5lbHNdLiBPbmx5IFwiTkRIV0NcIiBpcyBjdXJyZW50bHkgc3VwcG9ydGVkLlxuICogQHBhcmFtIGRpbGF0aW9ucyBUaGUgZGlsYXRpb24gcmF0ZXM6IGBbZGlsYXRpb25EZXB0aCwgZGlsYXRpb25IZWlnaHQsXG4gKiAgICAgZGlsYXRpb25XaWR0aF1gIGluIHdoaWNoIHdlIHNhbXBsZSBpbnB1dCB2YWx1ZXMgYWNyb3NzIHRoZSBoZWlnaHRcbiAqICAgICBhbmQgd2lkdGggZGltZW5zaW9ucyBpbiBhdHJvdXMgY29udm9sdXRpb24uIERlZmF1bHRzIHRvIGBbMSwgMSwgMV1gLlxuICogICAgIElmIGBkaWxhdGlvbnNgIGlzIGEgc2luZ2xlIG51bWJlciwgdGhlblxuICogICAgIGBkaWxhdGlvbkRlcHRoID09IGRpbGF0aW9uSGVpZ2h0ID09IGRpbGF0aW9uV2lkdGhgLiBJZiBpdCBpcyBncmVhdGVyXG4gKiAgICAgdGhhbiAxLCB0aGVuIGFsbCB2YWx1ZXMgb2YgYHN0cmlkZXNgIG11c3QgYmUgMS5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdDb252b2x1dGlvbid9XG4gKi9cbmZ1bmN0aW9uIGNvbnYzZF88VCBleHRlbmRzIFRlbnNvcjREfFRlbnNvcjVEPihcbiAgICB4OiBUfFRlbnNvckxpa2UsIGZpbHRlcjogVGVuc29yNUR8VGVuc29yTGlrZSxcbiAgICBzdHJpZGVzOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl18bnVtYmVyLCBwYWQ6ICd2YWxpZCd8J3NhbWUnLFxuICAgIGRhdGFGb3JtYXQ6ICdOREhXQyd8J05DREhXJyA9ICdOREhXQycsXG4gICAgZGlsYXRpb25zOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl18bnVtYmVyID0gWzEsIDEsIDFdKTogVCB7XG4gIGNvbnN0ICR4ID0gY29udmVydFRvVGVuc29yKHgsICd4JywgJ2NvbnYzZCcpO1xuICBjb25zdCAkZmlsdGVyID0gY29udmVydFRvVGVuc29yKGZpbHRlciwgJ2ZpbHRlcicsICdjb252M2QnKTtcblxuICBsZXQgeDVEID0gJHggYXMgVGVuc29yNUQ7XG4gIGxldCByZXNoYXBlZFRvNUQgPSBmYWxzZTtcblxuICBpZiAoJHgucmFuayA9PT0gNCkge1xuICAgIHJlc2hhcGVkVG81RCA9IHRydWU7XG4gICAgeDVEID0gcmVzaGFwZSgkeCwgWzEsICR4LnNoYXBlWzBdLCAkeC5zaGFwZVsxXSwgJHguc2hhcGVbMl0sICR4LnNoYXBlWzNdXSk7XG4gIH1cbiAgdXRpbC5hc3NlcnQoXG4gICAgICB4NUQucmFuayA9PT0gNSxcbiAgICAgICgpID0+IGBFcnJvciBpbiBjb252M2Q6IGlucHV0IG11c3QgYmUgcmFuayA1LCBidXQgZ290IHJhbmsgJHt4NUQucmFua30uYCk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgJGZpbHRlci5yYW5rID09PSA1LFxuICAgICAgKCkgPT4gYEVycm9yIGluIGNvbnYzZDogZmlsdGVyIG11c3QgYmUgcmFuayA1LCBidXQgZ290IHJhbmsgYCArXG4gICAgICAgICAgYCR7JGZpbHRlci5yYW5rfS5gKTtcbiAgdXRpbC5hc3NlcnQoXG4gICAgICB4NUQuc2hhcGVbNF0gPT09ICRmaWx0ZXIuc2hhcGVbM10sXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gY29udjNkOiBkZXB0aCBvZiBpbnB1dCAoJHt4NUQuc2hhcGVbNF19KSBtdXN0IG1hdGNoIGAgK1xuICAgICAgICAgIGBpbnB1dCBkZXB0aCBmb3IgZmlsdGVyICR7JGZpbHRlci5zaGFwZVszXX0uYCk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgZWl0aGVyU3RyaWRlc09yRGlsYXRpb25zQXJlT25lKHN0cmlkZXMsIGRpbGF0aW9ucyksXG4gICAgICAoKSA9PiAnRXJyb3IgaW4gY29udjNEOiBFaXRoZXIgc3RyaWRlcyBvciBkaWxhdGlvbnMgbXVzdCBiZSAxLiAnICtcbiAgICAgICAgICBgR290IHN0cmlkZXMgJHtzdHJpZGVzfSBhbmQgZGlsYXRpb25zICcke2RpbGF0aW9uc30nYCk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgZGF0YUZvcm1hdCA9PT0gJ05ESFdDJyxcbiAgICAgICgpID0+IGBFcnJvciBpbiBjb252M2Q6IGdvdCBkYXRhRm9ybWF0IG9mICR7XG4gICAgICAgICAgZGF0YUZvcm1hdH0gYnV0IG9ubHkgTkRIV0MgaXMgY3VycmVudGx5IHN1cHBvcnRlZC5gKTtcblxuICBjb25zdCBpbnB1dHM6IENvbnYzRElucHV0cyA9IHt4OiB4NUQsIGZpbHRlcjogJGZpbHRlcn07XG5cbiAgY29uc3QgYXR0cnM6IENvbnYzREF0dHJzID0ge3N0cmlkZXMsIHBhZCwgZGF0YUZvcm1hdCwgZGlsYXRpb25zfTtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVubmVjZXNzYXJ5LXR5cGUtYXNzZXJ0aW9uXG4gIGNvbnN0IHJlcyA9IEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICAgICAgICAgICAgICBDb252M0QsIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCxcbiAgICAgICAgICAgICAgICAgIGF0dHJzIGFzIHt9IGFzIE5hbWVkQXR0ck1hcCkgYXMgVDtcblxuICBpZiAocmVzaGFwZWRUbzVEKSB7XG4gICAgcmV0dXJuIHJlc2hhcGUoXG4gICAgICAgICAgICAgICByZXMsIFtyZXMuc2hhcGVbMV0sIHJlcy5zaGFwZVsyXSwgcmVzLnNoYXBlWzNdLCByZXMuc2hhcGVbNF1dKSBhc1xuICAgICAgICBUO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBjb25zdCBjb252M2QgPSBvcCh7Y29udjNkX30pO1xuIl19