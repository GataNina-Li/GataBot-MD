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
import { Conv2D } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import * as conv_util from './conv_util';
import { op } from './operation';
import { reshape } from './reshape';
/**
 * Computes a 2D convolution over the input x.
 *
 * @param x The input tensor, of rank 4 or rank 3, of shape
 *     `[batch, height, width, inChannels]`. If rank 3, batch of 1 is
 * assumed.
 * @param filter The filter, rank 4, of shape
 *     `[filterHeight, filterWidth, inDepth, outDepth]`.
 * @param strides The strides of the convolution: `[strideHeight,
 * strideWidth]`.
 * @param pad The type of padding algorithm.
 *    - `same` and stride 1: output will be of same size as input,
 *       regardless of filter size.
 *    - `valid`: output will be smaller than input if filter is larger
 *       than 1x1.
 *   - For more info, see this guide:
 *     [https://www.tensorflow.org/api_docs/python/tf/nn/convolution](
 *          https://www.tensorflow.org/api_docs/python/tf/nn/convolution)
 * @param dataFormat: An optional string from: "NHWC", "NCHW". Defaults to
 *     "NHWC". Specify the data format of the input and output data. With the
 *     default format "NHWC", the data is stored in the order of: [batch,
 *     height, width, channels].
 * @param dilations The dilation rates: `[dilationHeight, dilationWidth]`
 *     in which we sample input values across the height and width dimensions
 *     in atrous convolution. Defaults to `[1, 1]`. If `dilations` is a single
 *     number, then `dilationHeight == dilationWidth`. If it is greater than
 *     1, then all values of `strides` must be 1.
 * @param dimRoundingMode A string from: 'ceil', 'round', 'floor'. If none is
 *     provided, it will default to truncate.
 *
 * @doc {heading: 'Operations', subheading: 'Convolution'}
 */
function conv2d_(x, filter, strides, pad, dataFormat = 'NHWC', dilations = [1, 1], dimRoundingMode) {
    const $x = convertToTensor(x, 'x', 'conv2d', 'float32');
    const $filter = convertToTensor(filter, 'filter', 'conv2d', 'float32');
    let x4D = $x;
    let reshapedTo4D = false;
    if ($x.rank === 3) {
        reshapedTo4D = true;
        x4D = reshape($x, [1, $x.shape[0], $x.shape[1], $x.shape[2]]);
    }
    util.assert(x4D.rank === 4, () => `Error in conv2d: input must be rank 4, but got rank ${x4D.rank}.`);
    util.assert($filter.rank === 4, () => `Error in conv2d: filter must be rank 4, but got rank ` +
        `${$filter.rank}.`);
    conv_util.checkPadOnDimRoundingMode('conv2d', pad, dimRoundingMode);
    const inDepth = dataFormat === 'NHWC' ? x4D.shape[3] : x4D.shape[1];
    util.assert(inDepth === $filter.shape[2], () => `Error in conv2d: depth of input (${inDepth}) must match ` +
        `input depth for filter ${$filter.shape[2]}.`);
    util.assert(conv_util.eitherStridesOrDilationsAreOne(strides, dilations), () => 'Error in conv2D: Either strides or dilations must be 1. ' +
        `Got strides ${strides} and dilations '${dilations}'`);
    const inputs = { x: x4D, filter: $filter };
    const attrs = { strides, pad, dataFormat, dilations, dimRoundingMode };
    // tslint:disable-next-line: no-unnecessary-type-assertion
    const res = ENGINE.runKernel(Conv2D, inputs, attrs);
    if (reshapedTo4D) {
        return reshape(res, [res.shape[1], res.shape[2], res.shape[3]]);
    }
    return res;
}
export const conv2d = op({ conv2d_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udjJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvY29udjJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLE1BQU0sRUFBNEIsTUFBTSxpQkFBaUIsQ0FBQztBQUlsRSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFbkQsT0FBTyxLQUFLLElBQUksTUFBTSxTQUFTLENBQUM7QUFFaEMsT0FBTyxLQUFLLFNBQVMsTUFBTSxhQUFhLENBQUM7QUFDekMsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMvQixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBRWxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBK0JHO0FBQ0gsU0FBUyxPQUFPLENBQ1osQ0FBZSxFQUFFLE1BQTJCLEVBQzVDLE9BQWdDLEVBQ2hDLEdBQW9ELEVBQ3BELGFBQTRCLE1BQU0sRUFDbEMsWUFBcUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQzNDLGVBQXdDO0lBQzFDLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN4RCxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFFdkUsSUFBSSxHQUFHLEdBQUcsRUFBYyxDQUFDO0lBQ3pCLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztJQUV6QixJQUFJLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO1FBQ2pCLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9EO0lBRUQsSUFBSSxDQUFDLE1BQU0sQ0FDUCxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsRUFDZCxHQUFHLEVBQUUsQ0FBQyx1REFBdUQsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7SUFDOUUsSUFBSSxDQUFDLE1BQU0sQ0FDUCxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsRUFDbEIsR0FBRyxFQUFFLENBQUMsdURBQXVEO1FBQ3pELEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7SUFDNUIsU0FBUyxDQUFDLHlCQUF5QixDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDcEUsTUFBTSxPQUFPLEdBQUcsVUFBVSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRSxJQUFJLENBQUMsTUFBTSxDQUNQLE9BQU8sS0FBSyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUM1QixHQUFHLEVBQUUsQ0FBQyxvQ0FBb0MsT0FBTyxlQUFlO1FBQzVELDBCQUEwQixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2RCxJQUFJLENBQUMsTUFBTSxDQUNQLFNBQVMsQ0FBQyw4QkFBOEIsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLEVBQzVELEdBQUcsRUFBRSxDQUFDLDBEQUEwRDtRQUM1RCxlQUFlLE9BQU8sbUJBQW1CLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFFL0QsTUFBTSxNQUFNLEdBQWlCLEVBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFDLENBQUM7SUFDdkQsTUFBTSxLQUFLLEdBQ08sRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFDLENBQUM7SUFFekUsMERBQTBEO0lBQzFELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQ1osTUFBTSxFQUFFLE1BQThCLEVBQ3RDLEtBQTJCLENBQU0sQ0FBQztJQUVsRCxJQUFJLFlBQVksRUFBRTtRQUNoQixPQUFPLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFNLENBQUM7S0FDdEU7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtDb252MkQsIENvbnYyREF0dHJzLCBDb252MkRJbnB1dHN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge05hbWVkQXR0ck1hcH0gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7VGVuc29yM0QsIFRlbnNvcjREfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQgKiBhcyBjb252X3V0aWwgZnJvbSAnLi9jb252X3V0aWwnO1xuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuaW1wb3J0IHtyZXNoYXBlfSBmcm9tICcuL3Jlc2hhcGUnO1xuXG4vKipcbiAqIENvbXB1dGVzIGEgMkQgY29udm9sdXRpb24gb3ZlciB0aGUgaW5wdXQgeC5cbiAqXG4gKiBAcGFyYW0geCBUaGUgaW5wdXQgdGVuc29yLCBvZiByYW5rIDQgb3IgcmFuayAzLCBvZiBzaGFwZVxuICogICAgIGBbYmF0Y2gsIGhlaWdodCwgd2lkdGgsIGluQ2hhbm5lbHNdYC4gSWYgcmFuayAzLCBiYXRjaCBvZiAxIGlzXG4gKiBhc3N1bWVkLlxuICogQHBhcmFtIGZpbHRlciBUaGUgZmlsdGVyLCByYW5rIDQsIG9mIHNoYXBlXG4gKiAgICAgYFtmaWx0ZXJIZWlnaHQsIGZpbHRlcldpZHRoLCBpbkRlcHRoLCBvdXREZXB0aF1gLlxuICogQHBhcmFtIHN0cmlkZXMgVGhlIHN0cmlkZXMgb2YgdGhlIGNvbnZvbHV0aW9uOiBgW3N0cmlkZUhlaWdodCxcbiAqIHN0cmlkZVdpZHRoXWAuXG4gKiBAcGFyYW0gcGFkIFRoZSB0eXBlIG9mIHBhZGRpbmcgYWxnb3JpdGhtLlxuICogICAgLSBgc2FtZWAgYW5kIHN0cmlkZSAxOiBvdXRwdXQgd2lsbCBiZSBvZiBzYW1lIHNpemUgYXMgaW5wdXQsXG4gKiAgICAgICByZWdhcmRsZXNzIG9mIGZpbHRlciBzaXplLlxuICogICAgLSBgdmFsaWRgOiBvdXRwdXQgd2lsbCBiZSBzbWFsbGVyIHRoYW4gaW5wdXQgaWYgZmlsdGVyIGlzIGxhcmdlclxuICogICAgICAgdGhhbiAxeDEuXG4gKiAgIC0gRm9yIG1vcmUgaW5mbywgc2VlIHRoaXMgZ3VpZGU6XG4gKiAgICAgW2h0dHBzOi8vd3d3LnRlbnNvcmZsb3cub3JnL2FwaV9kb2NzL3B5dGhvbi90Zi9ubi9jb252b2x1dGlvbl0oXG4gKiAgICAgICAgICBodHRwczovL3d3dy50ZW5zb3JmbG93Lm9yZy9hcGlfZG9jcy9weXRob24vdGYvbm4vY29udm9sdXRpb24pXG4gKiBAcGFyYW0gZGF0YUZvcm1hdDogQW4gb3B0aW9uYWwgc3RyaW5nIGZyb206IFwiTkhXQ1wiLCBcIk5DSFdcIi4gRGVmYXVsdHMgdG9cbiAqICAgICBcIk5IV0NcIi4gU3BlY2lmeSB0aGUgZGF0YSBmb3JtYXQgb2YgdGhlIGlucHV0IGFuZCBvdXRwdXQgZGF0YS4gV2l0aCB0aGVcbiAqICAgICBkZWZhdWx0IGZvcm1hdCBcIk5IV0NcIiwgdGhlIGRhdGEgaXMgc3RvcmVkIGluIHRoZSBvcmRlciBvZjogW2JhdGNoLFxuICogICAgIGhlaWdodCwgd2lkdGgsIGNoYW5uZWxzXS5cbiAqIEBwYXJhbSBkaWxhdGlvbnMgVGhlIGRpbGF0aW9uIHJhdGVzOiBgW2RpbGF0aW9uSGVpZ2h0LCBkaWxhdGlvbldpZHRoXWBcbiAqICAgICBpbiB3aGljaCB3ZSBzYW1wbGUgaW5wdXQgdmFsdWVzIGFjcm9zcyB0aGUgaGVpZ2h0IGFuZCB3aWR0aCBkaW1lbnNpb25zXG4gKiAgICAgaW4gYXRyb3VzIGNvbnZvbHV0aW9uLiBEZWZhdWx0cyB0byBgWzEsIDFdYC4gSWYgYGRpbGF0aW9uc2AgaXMgYSBzaW5nbGVcbiAqICAgICBudW1iZXIsIHRoZW4gYGRpbGF0aW9uSGVpZ2h0ID09IGRpbGF0aW9uV2lkdGhgLiBJZiBpdCBpcyBncmVhdGVyIHRoYW5cbiAqICAgICAxLCB0aGVuIGFsbCB2YWx1ZXMgb2YgYHN0cmlkZXNgIG11c3QgYmUgMS5cbiAqIEBwYXJhbSBkaW1Sb3VuZGluZ01vZGUgQSBzdHJpbmcgZnJvbTogJ2NlaWwnLCAncm91bmQnLCAnZmxvb3InLiBJZiBub25lIGlzXG4gKiAgICAgcHJvdmlkZWQsIGl0IHdpbGwgZGVmYXVsdCB0byB0cnVuY2F0ZS5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdDb252b2x1dGlvbid9XG4gKi9cbmZ1bmN0aW9uIGNvbnYyZF88VCBleHRlbmRzIFRlbnNvcjNEfFRlbnNvcjREPihcbiAgICB4OiBUfFRlbnNvckxpa2UsIGZpbHRlcjogVGVuc29yNER8VGVuc29yTGlrZSxcbiAgICBzdHJpZGVzOiBbbnVtYmVyLCBudW1iZXJdfG51bWJlcixcbiAgICBwYWQ6ICd2YWxpZCd8J3NhbWUnfG51bWJlcnxjb252X3V0aWwuRXhwbGljaXRQYWRkaW5nLFxuICAgIGRhdGFGb3JtYXQ6ICdOSFdDJ3wnTkNIVycgPSAnTkhXQycsXG4gICAgZGlsYXRpb25zOiBbbnVtYmVyLCBudW1iZXJdfG51bWJlciA9IFsxLCAxXSxcbiAgICBkaW1Sb3VuZGluZ01vZGU/OiAnZmxvb3InfCdyb3VuZCd8J2NlaWwnKTogVCB7XG4gIGNvbnN0ICR4ID0gY29udmVydFRvVGVuc29yKHgsICd4JywgJ2NvbnYyZCcsICdmbG9hdDMyJyk7XG4gIGNvbnN0ICRmaWx0ZXIgPSBjb252ZXJ0VG9UZW5zb3IoZmlsdGVyLCAnZmlsdGVyJywgJ2NvbnYyZCcsICdmbG9hdDMyJyk7XG5cbiAgbGV0IHg0RCA9ICR4IGFzIFRlbnNvcjREO1xuICBsZXQgcmVzaGFwZWRUbzREID0gZmFsc2U7XG5cbiAgaWYgKCR4LnJhbmsgPT09IDMpIHtcbiAgICByZXNoYXBlZFRvNEQgPSB0cnVlO1xuICAgIHg0RCA9IHJlc2hhcGUoJHgsIFsxLCAkeC5zaGFwZVswXSwgJHguc2hhcGVbMV0sICR4LnNoYXBlWzJdXSk7XG4gIH1cblxuICB1dGlsLmFzc2VydChcbiAgICAgIHg0RC5yYW5rID09PSA0LFxuICAgICAgKCkgPT4gYEVycm9yIGluIGNvbnYyZDogaW5wdXQgbXVzdCBiZSByYW5rIDQsIGJ1dCBnb3QgcmFuayAke3g0RC5yYW5rfS5gKTtcbiAgdXRpbC5hc3NlcnQoXG4gICAgICAkZmlsdGVyLnJhbmsgPT09IDQsXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gY29udjJkOiBmaWx0ZXIgbXVzdCBiZSByYW5rIDQsIGJ1dCBnb3QgcmFuayBgICtcbiAgICAgICAgICBgJHskZmlsdGVyLnJhbmt9LmApO1xuICBjb252X3V0aWwuY2hlY2tQYWRPbkRpbVJvdW5kaW5nTW9kZSgnY29udjJkJywgcGFkLCBkaW1Sb3VuZGluZ01vZGUpO1xuICBjb25zdCBpbkRlcHRoID0gZGF0YUZvcm1hdCA9PT0gJ05IV0MnID8geDRELnNoYXBlWzNdIDogeDRELnNoYXBlWzFdO1xuICB1dGlsLmFzc2VydChcbiAgICAgIGluRGVwdGggPT09ICRmaWx0ZXIuc2hhcGVbMl0sXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gY29udjJkOiBkZXB0aCBvZiBpbnB1dCAoJHtpbkRlcHRofSkgbXVzdCBtYXRjaCBgICtcbiAgICAgICAgICBgaW5wdXQgZGVwdGggZm9yIGZpbHRlciAkeyRmaWx0ZXIuc2hhcGVbMl19LmApO1xuICB1dGlsLmFzc2VydChcbiAgICAgIGNvbnZfdXRpbC5laXRoZXJTdHJpZGVzT3JEaWxhdGlvbnNBcmVPbmUoc3RyaWRlcywgZGlsYXRpb25zKSxcbiAgICAgICgpID0+ICdFcnJvciBpbiBjb252MkQ6IEVpdGhlciBzdHJpZGVzIG9yIGRpbGF0aW9ucyBtdXN0IGJlIDEuICcgK1xuICAgICAgICAgIGBHb3Qgc3RyaWRlcyAke3N0cmlkZXN9IGFuZCBkaWxhdGlvbnMgJyR7ZGlsYXRpb25zfSdgKTtcblxuICBjb25zdCBpbnB1dHM6IENvbnYyRElucHV0cyA9IHt4OiB4NEQsIGZpbHRlcjogJGZpbHRlcn07XG4gIGNvbnN0IGF0dHJzOlxuICAgICAgQ29udjJEQXR0cnMgPSB7c3RyaWRlcywgcGFkLCBkYXRhRm9ybWF0LCBkaWxhdGlvbnMsIGRpbVJvdW5kaW5nTW9kZX07XG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby11bm5lY2Vzc2FyeS10eXBlLWFzc2VydGlvblxuICBjb25zdCByZXMgPSBFTkdJTkUucnVuS2VybmVsKFxuICAgICAgICAgICAgICAgICAgQ29udjJELCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXAsXG4gICAgICAgICAgICAgICAgICBhdHRycyBhcyB7fSBhcyBOYW1lZEF0dHJNYXApIGFzIFQ7XG5cbiAgaWYgKHJlc2hhcGVkVG80RCkge1xuICAgIHJldHVybiByZXNoYXBlKHJlcywgW3Jlcy5zaGFwZVsxXSwgcmVzLnNoYXBlWzJdLCByZXMuc2hhcGVbM11dKSBhcyBUO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBjb25zdCBjb252MmQgPSBvcCh7Y29udjJkX30pO1xuIl19