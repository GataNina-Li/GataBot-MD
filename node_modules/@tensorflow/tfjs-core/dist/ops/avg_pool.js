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
import { AvgPool } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { cast } from './cast';
import * as conv_util from './conv_util';
import { op } from './operation';
import { reshape } from './reshape';
/**
 * Computes the 2D average pooling of an image.
 *
 * @param x The input tensor, of rank 4 or rank 3 of shape
 *     `[batch, height, width, inChannels]`. If rank 3, batch of 1 is assumed.
 * @param filterSize The filter size: `[filterHeight, filterWidth]`. If
 *     `filterSize` is a single number, then `filterHeight == filterWidth`.
 * @param strides The strides of the pooling: `[strideHeight, strideWidth]`. If
 *     `strides` is a single number, then `strideHeight == strideWidth`.
 * @param pad The type of padding algorithm:
 *    - `same` and stride 1: output will be of same size as input,
 *       regardless of filter size.
 *    - `valid`: output will be smaller than input if filter is larger
 *       than 1x1.
 *    - For more info, see this guide:
 *     [https://www.tensorflow.org/api_docs/python/tf/nn/convolution](
 *         https://www.tensorflow.org/api_docs/python/tf/nn/convolution)
 * @param dimRoundingMode A string from: 'ceil', 'round', 'floor'. If none is
 *     provided, it will default to truncate.
 */
function avgPool_(x, filterSize, strides, pad, dimRoundingMode) {
    const $x = convertToTensor(x, 'x', 'avgPool', 'float32');
    const dilations = 1;
    util.assert(conv_util.eitherStridesOrDilationsAreOne(strides, dilations), () => 'Error in avgPool: Either strides or dilations must be 1. ' +
        `Got strides ${strides} and dilations '${dilations}'`);
    let x4D = $x;
    let reshapedTo4D = false;
    if ($x.rank === 3) {
        reshapedTo4D = true;
        x4D = reshape($x, [1, $x.shape[0], $x.shape[1], $x.shape[2]]);
    }
    util.assert(x4D.rank === 4, () => `Error in avgPool: x must be rank 4 but got rank ${x4D.rank}.`);
    conv_util.checkPadOnDimRoundingMode('avgPool', pad, dimRoundingMode);
    const inputs = { x: x4D };
    const attrs = { filterSize, strides, pad, dimRoundingMode };
    // tslint:disable-next-line: no-unnecessary-type-assertion
    let res = ENGINE.runKernel(AvgPool, inputs, attrs);
    res = cast(res, $x.dtype);
    if (reshapedTo4D) {
        return reshape(res, [res.shape[1], res.shape[2], res.shape[3]]);
    }
    return res;
}
export const avgPool = op({ avgPool_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXZnX3Bvb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9hdmdfcG9vbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxPQUFPLEVBQThCLE1BQU0saUJBQWlCLENBQUM7QUFJckUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE9BQU8sS0FBSyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBRWhDLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxLQUFLLFNBQVMsTUFBTSxhQUFhLENBQUM7QUFDekMsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMvQixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBRWxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUJHO0FBQ0gsU0FBUyxRQUFRLENBQ2IsQ0FBZSxFQUFFLFVBQW1DLEVBQ3BELE9BQWdDLEVBQ2hDLEdBQW9ELEVBQ3BELGVBQXdDO0lBQzFDLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN6RCxNQUFNLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFFcEIsSUFBSSxDQUFDLE1BQU0sQ0FDUCxTQUFTLENBQUMsOEJBQThCLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxFQUM1RCxHQUFHLEVBQUUsQ0FBQywyREFBMkQ7UUFDN0QsZUFBZSxPQUFPLG1CQUFtQixTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBRS9ELElBQUksR0FBRyxHQUFHLEVBQWMsQ0FBQztJQUN6QixJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7SUFDekIsSUFBSSxFQUFFLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtRQUNqQixZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLEdBQUcsR0FBRyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvRDtJQUVELElBQUksQ0FBQyxNQUFNLENBQ1AsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQ2QsR0FBRyxFQUFFLENBQUMsbURBQW1ELEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQzFFLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ3JFLE1BQU0sTUFBTSxHQUFrQixFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUMsQ0FBQztJQUN2QyxNQUFNLEtBQUssR0FBaUIsRUFBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxlQUFlLEVBQUMsQ0FBQztJQUV4RSwwREFBMEQ7SUFDMUQsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FDWixPQUFPLEVBQUUsTUFBOEIsRUFDdkMsS0FBMkIsQ0FBTSxDQUFDO0lBRWhELEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUUxQixJQUFJLFlBQVksRUFBRTtRQUNoQixPQUFPLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFNLENBQUM7S0FDdEU7SUFFRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLEVBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge0F2Z1Bvb2wsIEF2Z1Bvb2xBdHRycywgQXZnUG9vbElucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7TmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtUZW5zb3IzRCwgVGVuc29yNER9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7Y2FzdH0gZnJvbSAnLi9jYXN0JztcbmltcG9ydCAqIGFzIGNvbnZfdXRpbCBmcm9tICcuL2NvbnZfdXRpbCc7XG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5pbXBvcnQge3Jlc2hhcGV9IGZyb20gJy4vcmVzaGFwZSc7XG5cbi8qKlxuICogQ29tcHV0ZXMgdGhlIDJEIGF2ZXJhZ2UgcG9vbGluZyBvZiBhbiBpbWFnZS5cbiAqXG4gKiBAcGFyYW0geCBUaGUgaW5wdXQgdGVuc29yLCBvZiByYW5rIDQgb3IgcmFuayAzIG9mIHNoYXBlXG4gKiAgICAgYFtiYXRjaCwgaGVpZ2h0LCB3aWR0aCwgaW5DaGFubmVsc11gLiBJZiByYW5rIDMsIGJhdGNoIG9mIDEgaXMgYXNzdW1lZC5cbiAqIEBwYXJhbSBmaWx0ZXJTaXplIFRoZSBmaWx0ZXIgc2l6ZTogYFtmaWx0ZXJIZWlnaHQsIGZpbHRlcldpZHRoXWAuIElmXG4gKiAgICAgYGZpbHRlclNpemVgIGlzIGEgc2luZ2xlIG51bWJlciwgdGhlbiBgZmlsdGVySGVpZ2h0ID09IGZpbHRlcldpZHRoYC5cbiAqIEBwYXJhbSBzdHJpZGVzIFRoZSBzdHJpZGVzIG9mIHRoZSBwb29saW5nOiBgW3N0cmlkZUhlaWdodCwgc3RyaWRlV2lkdGhdYC4gSWZcbiAqICAgICBgc3RyaWRlc2AgaXMgYSBzaW5nbGUgbnVtYmVyLCB0aGVuIGBzdHJpZGVIZWlnaHQgPT0gc3RyaWRlV2lkdGhgLlxuICogQHBhcmFtIHBhZCBUaGUgdHlwZSBvZiBwYWRkaW5nIGFsZ29yaXRobTpcbiAqICAgIC0gYHNhbWVgIGFuZCBzdHJpZGUgMTogb3V0cHV0IHdpbGwgYmUgb2Ygc2FtZSBzaXplIGFzIGlucHV0LFxuICogICAgICAgcmVnYXJkbGVzcyBvZiBmaWx0ZXIgc2l6ZS5cbiAqICAgIC0gYHZhbGlkYDogb3V0cHV0IHdpbGwgYmUgc21hbGxlciB0aGFuIGlucHV0IGlmIGZpbHRlciBpcyBsYXJnZXJcbiAqICAgICAgIHRoYW4gMXgxLlxuICogICAgLSBGb3IgbW9yZSBpbmZvLCBzZWUgdGhpcyBndWlkZTpcbiAqICAgICBbaHR0cHM6Ly93d3cudGVuc29yZmxvdy5vcmcvYXBpX2RvY3MvcHl0aG9uL3RmL25uL2NvbnZvbHV0aW9uXShcbiAqICAgICAgICAgaHR0cHM6Ly93d3cudGVuc29yZmxvdy5vcmcvYXBpX2RvY3MvcHl0aG9uL3RmL25uL2NvbnZvbHV0aW9uKVxuICogQHBhcmFtIGRpbVJvdW5kaW5nTW9kZSBBIHN0cmluZyBmcm9tOiAnY2VpbCcsICdyb3VuZCcsICdmbG9vcicuIElmIG5vbmUgaXNcbiAqICAgICBwcm92aWRlZCwgaXQgd2lsbCBkZWZhdWx0IHRvIHRydW5jYXRlLlxuICovXG5mdW5jdGlvbiBhdmdQb29sXzxUIGV4dGVuZHMgVGVuc29yM0R8VGVuc29yNEQ+KFxuICAgIHg6IFR8VGVuc29yTGlrZSwgZmlsdGVyU2l6ZTogW251bWJlciwgbnVtYmVyXXxudW1iZXIsXG4gICAgc3RyaWRlczogW251bWJlciwgbnVtYmVyXXxudW1iZXIsXG4gICAgcGFkOiAndmFsaWQnfCdzYW1lJ3xudW1iZXJ8Y29udl91dGlsLkV4cGxpY2l0UGFkZGluZyxcbiAgICBkaW1Sb3VuZGluZ01vZGU/OiAnZmxvb3InfCdyb3VuZCd8J2NlaWwnKTogVCB7XG4gIGNvbnN0ICR4ID0gY29udmVydFRvVGVuc29yKHgsICd4JywgJ2F2Z1Bvb2wnLCAnZmxvYXQzMicpO1xuICBjb25zdCBkaWxhdGlvbnMgPSAxO1xuXG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgY29udl91dGlsLmVpdGhlclN0cmlkZXNPckRpbGF0aW9uc0FyZU9uZShzdHJpZGVzLCBkaWxhdGlvbnMpLFxuICAgICAgKCkgPT4gJ0Vycm9yIGluIGF2Z1Bvb2w6IEVpdGhlciBzdHJpZGVzIG9yIGRpbGF0aW9ucyBtdXN0IGJlIDEuICcgK1xuICAgICAgICAgIGBHb3Qgc3RyaWRlcyAke3N0cmlkZXN9IGFuZCBkaWxhdGlvbnMgJyR7ZGlsYXRpb25zfSdgKTtcblxuICBsZXQgeDREID0gJHggYXMgVGVuc29yNEQ7XG4gIGxldCByZXNoYXBlZFRvNEQgPSBmYWxzZTtcbiAgaWYgKCR4LnJhbmsgPT09IDMpIHtcbiAgICByZXNoYXBlZFRvNEQgPSB0cnVlO1xuICAgIHg0RCA9IHJlc2hhcGUoJHgsIFsxLCAkeC5zaGFwZVswXSwgJHguc2hhcGVbMV0sICR4LnNoYXBlWzJdXSk7XG4gIH1cblxuICB1dGlsLmFzc2VydChcbiAgICAgIHg0RC5yYW5rID09PSA0LFxuICAgICAgKCkgPT4gYEVycm9yIGluIGF2Z1Bvb2w6IHggbXVzdCBiZSByYW5rIDQgYnV0IGdvdCByYW5rICR7eDRELnJhbmt9LmApO1xuICBjb252X3V0aWwuY2hlY2tQYWRPbkRpbVJvdW5kaW5nTW9kZSgnYXZnUG9vbCcsIHBhZCwgZGltUm91bmRpbmdNb2RlKTtcbiAgY29uc3QgaW5wdXRzOiBBdmdQb29sSW5wdXRzID0ge3g6IHg0RH07XG4gIGNvbnN0IGF0dHJzOiBBdmdQb29sQXR0cnMgPSB7ZmlsdGVyU2l6ZSwgc3RyaWRlcywgcGFkLCBkaW1Sb3VuZGluZ01vZGV9O1xuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tdW5uZWNlc3NhcnktdHlwZS1hc3NlcnRpb25cbiAgbGV0IHJlcyA9IEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICAgICAgICAgICAgQXZnUG9vbCwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLFxuICAgICAgICAgICAgICAgIGF0dHJzIGFzIHt9IGFzIE5hbWVkQXR0ck1hcCkgYXMgVDtcblxuICByZXMgPSBjYXN0KHJlcywgJHguZHR5cGUpO1xuXG4gIGlmIChyZXNoYXBlZFRvNEQpIHtcbiAgICByZXR1cm4gcmVzaGFwZShyZXMsIFtyZXMuc2hhcGVbMV0sIHJlcy5zaGFwZVsyXSwgcmVzLnNoYXBlWzNdXSkgYXMgVDtcbiAgfVxuXG4gIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBjb25zdCBhdmdQb29sID0gb3Aoe2F2Z1Bvb2xffSk7XG4iXX0=