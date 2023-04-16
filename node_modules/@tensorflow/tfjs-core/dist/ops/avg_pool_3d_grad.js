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
import { AvgPool3DGrad } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { checkPadOnDimRoundingMode } from './conv_util';
import { op } from './operation';
import { reshape } from './reshape';
/**
 * Computes the backprop of a 3d avg pool.
 *
 * @param dy The dy error, of rank 5 of shape
 *     [batchSize, depth, height, width, channels].
 * assumed.
 * @param input The original input image, of rank 5 or rank4 of shape
 *     [batchSize, depth, height, width, channels].
 * @param filterSize The filter size:
 *     `[filterDepth, filterHeight, filterWidth]`.
 *     `filterSize` is a single number,
 *     then `filterDepth == filterHeight == filterWidth`.
 * @param strides The strides of the pooling:
 *     `[strideDepth, strideHeight, strideWidth]`. If
 *     `strides` is a single number, then `strideHeight == strideWidth`.
 * @param pad A string from: 'same', 'valid'. The type of padding algorithm
 *     used in the forward prop of the op.
 * @param dimRoundingMode A string from: 'ceil', 'round', 'floor'. If none is
 *     provided, it will default to truncate.
 */
function avgPool3dGrad_(dy, input, filterSize, strides, pad, dimRoundingMode) {
    const $dy = convertToTensor(dy, 'dy', 'avgPool3dGrad');
    const $input = convertToTensor(input, 'input', 'avgPool3dGrad');
    let dy5D = $dy;
    let input5D = $input;
    let reshapedTo5D = false;
    if ($input.rank === 4) {
        reshapedTo5D = true;
        dy5D = reshape($dy, [1, $dy.shape[0], $dy.shape[1], $dy.shape[2], $dy.shape[3]]);
        input5D = reshape($input, [
            1, $input.shape[0], $input.shape[1], $input.shape[2], $input.shape[3]
        ]);
    }
    util.assert(dy5D.rank === 5, () => `Error in avgPool3dGrad: dy must be rank 5 but got rank ` +
        `${dy5D.rank}.`);
    util.assert(input5D.rank === 5, () => `Error in avgPool3dGrad: input must be rank 5 but got rank ` +
        `${input5D.rank}.`);
    checkPadOnDimRoundingMode('avgPool3dGrad', pad, dimRoundingMode);
    const inputs = { dy: dy5D, input: input5D };
    const attrs = { filterSize, strides, pad, dimRoundingMode };
    // tslint:disable-next-line: no-unnecessary-type-assertion
    const res = ENGINE.runKernel(AvgPool3DGrad, inputs, attrs);
    if (reshapedTo5D) {
        return reshape(res, [res.shape[1], res.shape[2], res.shape[3], res.shape[4]]);
    }
    return res;
}
export const avgPool3dGrad = op({ avgPool3dGrad_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXZnX3Bvb2xfM2RfZ3JhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2F2Z19wb29sXzNkX2dyYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsYUFBYSxFQUEwQyxNQUFNLGlCQUFpQixDQUFDO0FBSXZGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUVuRCxPQUFPLEtBQUssSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUVoQyxPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDdEQsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMvQixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBRWxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUJHO0FBQ0gsU0FBUyxjQUFjLENBQ25CLEVBQWdCLEVBQUUsS0FBbUIsRUFDckMsVUFBMkMsRUFDM0MsT0FBd0MsRUFBRSxHQUEwQixFQUNwRSxlQUF3QztJQUMxQyxNQUFNLEdBQUcsR0FBRyxlQUFlLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztJQUN2RCxNQUFNLE1BQU0sR0FBRyxlQUFlLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQztJQUVoRSxJQUFJLElBQUksR0FBRyxHQUFlLENBQUM7SUFDM0IsSUFBSSxPQUFPLEdBQUcsTUFBa0IsQ0FBQztJQUNqQyxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7SUFFekIsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtRQUNyQixZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksR0FBRyxPQUFPLENBQ1YsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFO1lBQ3hCLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUN0RSxDQUFDLENBQUM7S0FDSjtJQUVELElBQUksQ0FBQyxNQUFNLENBQ1AsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQ2YsR0FBRyxFQUFFLENBQUMseURBQXlEO1FBQzNELEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7SUFDekIsSUFBSSxDQUFDLE1BQU0sQ0FDUCxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsRUFDbEIsR0FBRyxFQUFFLENBQUMsNERBQTREO1FBQzlELEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7SUFDNUIseUJBQXlCLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNqRSxNQUFNLE1BQU0sR0FBd0IsRUFBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUMsQ0FBQztJQUMvRCxNQUFNLEtBQUssR0FBdUIsRUFBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxlQUFlLEVBQUMsQ0FBQztJQUU5RSwwREFBMEQ7SUFDMUQsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FDWixhQUFhLEVBQUUsTUFBOEIsRUFDN0MsS0FBMkIsQ0FBTSxDQUFDO0lBRWxELElBQUksWUFBWSxFQUFFO1FBQ2hCLE9BQU8sT0FBTyxDQUNILEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDbkUsQ0FBQztLQUNQO0lBRUQsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQyxFQUFDLGNBQWMsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge0F2Z1Bvb2wzREdyYWQsIEF2Z1Bvb2wzREdyYWRBdHRycywgQXZnUG9vbDNER3JhZElucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7TmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtUZW5zb3I0RCwgVGVuc29yNUR9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7Y2hlY2tQYWRPbkRpbVJvdW5kaW5nTW9kZX0gZnJvbSAnLi9jb252X3V0aWwnO1xuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuaW1wb3J0IHtyZXNoYXBlfSBmcm9tICcuL3Jlc2hhcGUnO1xuXG4vKipcbiAqIENvbXB1dGVzIHRoZSBiYWNrcHJvcCBvZiBhIDNkIGF2ZyBwb29sLlxuICpcbiAqIEBwYXJhbSBkeSBUaGUgZHkgZXJyb3IsIG9mIHJhbmsgNSBvZiBzaGFwZVxuICogICAgIFtiYXRjaFNpemUsIGRlcHRoLCBoZWlnaHQsIHdpZHRoLCBjaGFubmVsc10uXG4gKiBhc3N1bWVkLlxuICogQHBhcmFtIGlucHV0IFRoZSBvcmlnaW5hbCBpbnB1dCBpbWFnZSwgb2YgcmFuayA1IG9yIHJhbms0IG9mIHNoYXBlXG4gKiAgICAgW2JhdGNoU2l6ZSwgZGVwdGgsIGhlaWdodCwgd2lkdGgsIGNoYW5uZWxzXS5cbiAqIEBwYXJhbSBmaWx0ZXJTaXplIFRoZSBmaWx0ZXIgc2l6ZTpcbiAqICAgICBgW2ZpbHRlckRlcHRoLCBmaWx0ZXJIZWlnaHQsIGZpbHRlcldpZHRoXWAuXG4gKiAgICAgYGZpbHRlclNpemVgIGlzIGEgc2luZ2xlIG51bWJlcixcbiAqICAgICB0aGVuIGBmaWx0ZXJEZXB0aCA9PSBmaWx0ZXJIZWlnaHQgPT0gZmlsdGVyV2lkdGhgLlxuICogQHBhcmFtIHN0cmlkZXMgVGhlIHN0cmlkZXMgb2YgdGhlIHBvb2xpbmc6XG4gKiAgICAgYFtzdHJpZGVEZXB0aCwgc3RyaWRlSGVpZ2h0LCBzdHJpZGVXaWR0aF1gLiBJZlxuICogICAgIGBzdHJpZGVzYCBpcyBhIHNpbmdsZSBudW1iZXIsIHRoZW4gYHN0cmlkZUhlaWdodCA9PSBzdHJpZGVXaWR0aGAuXG4gKiBAcGFyYW0gcGFkIEEgc3RyaW5nIGZyb206ICdzYW1lJywgJ3ZhbGlkJy4gVGhlIHR5cGUgb2YgcGFkZGluZyBhbGdvcml0aG1cbiAqICAgICB1c2VkIGluIHRoZSBmb3J3YXJkIHByb3Agb2YgdGhlIG9wLlxuICogQHBhcmFtIGRpbVJvdW5kaW5nTW9kZSBBIHN0cmluZyBmcm9tOiAnY2VpbCcsICdyb3VuZCcsICdmbG9vcicuIElmIG5vbmUgaXNcbiAqICAgICBwcm92aWRlZCwgaXQgd2lsbCBkZWZhdWx0IHRvIHRydW5jYXRlLlxuICovXG5mdW5jdGlvbiBhdmdQb29sM2RHcmFkXzxUIGV4dGVuZHMgVGVuc29yNER8VGVuc29yNUQ+KFxuICAgIGR5OiBUfFRlbnNvckxpa2UsIGlucHV0OiBUfFRlbnNvckxpa2UsXG4gICAgZmlsdGVyU2l6ZTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdfG51bWJlcixcbiAgICBzdHJpZGVzOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl18bnVtYmVyLCBwYWQ6ICd2YWxpZCd8J3NhbWUnfG51bWJlcixcbiAgICBkaW1Sb3VuZGluZ01vZGU/OiAnZmxvb3InfCdyb3VuZCd8J2NlaWwnKTogVCB7XG4gIGNvbnN0ICRkeSA9IGNvbnZlcnRUb1RlbnNvcihkeSwgJ2R5JywgJ2F2Z1Bvb2wzZEdyYWQnKTtcbiAgY29uc3QgJGlucHV0ID0gY29udmVydFRvVGVuc29yKGlucHV0LCAnaW5wdXQnLCAnYXZnUG9vbDNkR3JhZCcpO1xuXG4gIGxldCBkeTVEID0gJGR5IGFzIFRlbnNvcjVEO1xuICBsZXQgaW5wdXQ1RCA9ICRpbnB1dCBhcyBUZW5zb3I1RDtcbiAgbGV0IHJlc2hhcGVkVG81RCA9IGZhbHNlO1xuXG4gIGlmICgkaW5wdXQucmFuayA9PT0gNCkge1xuICAgIHJlc2hhcGVkVG81RCA9IHRydWU7XG4gICAgZHk1RCA9IHJlc2hhcGUoXG4gICAgICAgICRkeSwgWzEsICRkeS5zaGFwZVswXSwgJGR5LnNoYXBlWzFdLCAkZHkuc2hhcGVbMl0sICRkeS5zaGFwZVszXV0pO1xuICAgIGlucHV0NUQgPSByZXNoYXBlKCRpbnB1dCwgW1xuICAgICAgMSwgJGlucHV0LnNoYXBlWzBdLCAkaW5wdXQuc2hhcGVbMV0sICRpbnB1dC5zaGFwZVsyXSwgJGlucHV0LnNoYXBlWzNdXG4gICAgXSk7XG4gIH1cblxuICB1dGlsLmFzc2VydChcbiAgICAgIGR5NUQucmFuayA9PT0gNSxcbiAgICAgICgpID0+IGBFcnJvciBpbiBhdmdQb29sM2RHcmFkOiBkeSBtdXN0IGJlIHJhbmsgNSBidXQgZ290IHJhbmsgYCArXG4gICAgICAgICAgYCR7ZHk1RC5yYW5rfS5gKTtcbiAgdXRpbC5hc3NlcnQoXG4gICAgICBpbnB1dDVELnJhbmsgPT09IDUsXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gYXZnUG9vbDNkR3JhZDogaW5wdXQgbXVzdCBiZSByYW5rIDUgYnV0IGdvdCByYW5rIGAgK1xuICAgICAgICAgIGAke2lucHV0NUQucmFua30uYCk7XG4gIGNoZWNrUGFkT25EaW1Sb3VuZGluZ01vZGUoJ2F2Z1Bvb2wzZEdyYWQnLCBwYWQsIGRpbVJvdW5kaW5nTW9kZSk7XG4gIGNvbnN0IGlucHV0czogQXZnUG9vbDNER3JhZElucHV0cyA9IHtkeTogZHk1RCwgaW5wdXQ6IGlucHV0NUR9O1xuICBjb25zdCBhdHRyczogQXZnUG9vbDNER3JhZEF0dHJzID0ge2ZpbHRlclNpemUsIHN0cmlkZXMsIHBhZCwgZGltUm91bmRpbmdNb2RlfTtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVubmVjZXNzYXJ5LXR5cGUtYXNzZXJ0aW9uXG4gIGNvbnN0IHJlcyA9IEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICAgICAgICAgICAgICBBdmdQb29sM0RHcmFkLCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXAsXG4gICAgICAgICAgICAgICAgICBhdHRycyBhcyB7fSBhcyBOYW1lZEF0dHJNYXApIGFzIFQ7XG5cbiAgaWYgKHJlc2hhcGVkVG81RCkge1xuICAgIHJldHVybiByZXNoYXBlKFxuICAgICAgICAgICAgICAgcmVzLCBbcmVzLnNoYXBlWzFdLCByZXMuc2hhcGVbMl0sIHJlcy5zaGFwZVszXSwgcmVzLnNoYXBlWzRdXSkgYXNcbiAgICAgICAgVDtcbiAgfVxuXG4gIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBjb25zdCBhdmdQb29sM2RHcmFkID0gb3Aoe2F2Z1Bvb2wzZEdyYWRffSk7XG4iXX0=