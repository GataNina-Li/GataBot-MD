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
import { AvgPoolGrad } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { op } from './operation';
import { reshape } from './reshape';
/**
 * Computes the backprop of an 2D avg pool.
 *
 * @param dy The dy error, of rank 4 or rank 3 of shape
 *     [batchSize, height, width, channels]. If rank 3, batch of 1 is
 * assumed.
 * @param input The input image, of rank 4 or rank 3 of shape
 *     [batchSize, height, width, channels]. If rank 3, batch of 1 is
 * assumed.
 * @param filterSize The filter size: `[filterHeight, filterWidth]`. If
 *     `filterSize` is a single number, then `filterHeight == filterWidth`.
 * @param strides The strides of the pooling: `[strideHeight, strideWidth]`. If
 *     `strides` is a single number, then `strideHeight == strideWidth`.
 * @param pad The type of padding algorithm used in the forward prop of the op.
 *     'same', 'valid', for more info, see this guide:
 *     [https://www.tensorflow.org/api_docs/python/tf/nn/convolution](
 *         https://www.tensorflow.org/api_docs/python/tf/nn/convolution)
 */
function avgPoolGrad_(dy, input, filterSize, strides, pad) {
    const $dy = convertToTensor(dy, 'dy', 'avgPoolGrad');
    const $input = convertToTensor(input, 'input', 'avgPoolGrad');
    util.assert($input.rank === $dy.rank, () => `Rank of input (${$input.rank}) does not match rank of dy (${$dy.rank})`);
    let input4D = $input;
    let dy4D = $dy;
    let reshapedTo4D = false;
    if ($input.rank === 3) {
        reshapedTo4D = true;
        input4D =
            reshape($input, [1, $input.shape[0], $input.shape[1], $input.shape[2]]);
        dy4D = reshape($dy, [1, $dy.shape[0], $dy.shape[1], $dy.shape[2]]);
    }
    util.assert(dy4D.rank === 4, () => `Error in avgPoolGrad: dy must be rank 4 but got rank ` +
        `${dy4D.rank}.`);
    util.assert(input4D.rank === 4, () => `Error in avgPoolGrad: input must be rank 4 but got rank ` +
        `${input4D.rank}.`);
    const inputs = { dy: dy4D, input: input4D };
    const attrs = { filterSize, strides, pad };
    // tslint:disable-next-line: no-unnecessary-type-assertion
    const res = ENGINE.runKernel(AvgPoolGrad, inputs, attrs);
    if (reshapedTo4D) {
        return reshape(res, [res.shape[1], res.shape[2], res.shape[3]]);
    }
    return res;
}
export const avgPoolGrad = op({ avgPoolGrad_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXZnX3Bvb2xfZ3JhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2F2Z19wb29sX2dyYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsV0FBVyxFQUFzQyxNQUFNLGlCQUFpQixDQUFDO0FBSWpGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUVuRCxPQUFPLEtBQUssSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUdoQyxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFbEM7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBQ0gsU0FBUyxZQUFZLENBQ2pCLEVBQWdCLEVBQUUsS0FBbUIsRUFBRSxVQUFtQyxFQUMxRSxPQUFnQyxFQUNoQyxHQUEwQztJQUM1QyxNQUFNLEdBQUcsR0FBRyxlQUFlLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNyRCxNQUFNLE1BQU0sR0FBRyxlQUFlLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztJQUU5RCxJQUFJLENBQUMsTUFBTSxDQUNQLE1BQU0sQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksRUFDeEIsR0FBRyxFQUFFLENBQUMsa0JBQWtCLE1BQU0sQ0FBQyxJQUFJLGdDQUMvQixHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUVyQixJQUFJLE9BQU8sR0FBRyxNQUFrQixDQUFDO0lBQ2pDLElBQUksSUFBSSxHQUFHLEdBQWUsQ0FBQztJQUMzQixJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7SUFFekIsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtRQUNyQixZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLE9BQU87WUFDSCxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDcEU7SUFFRCxJQUFJLENBQUMsTUFBTSxDQUNQLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUNmLEdBQUcsRUFBRSxDQUFDLHVEQUF1RDtRQUN6RCxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLElBQUksQ0FBQyxNQUFNLENBQ1AsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQ2xCLEdBQUcsRUFBRSxDQUFDLDBEQUEwRDtRQUM1RCxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBRTVCLE1BQU0sTUFBTSxHQUFzQixFQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBQyxDQUFDO0lBRTdELE1BQU0sS0FBSyxHQUFxQixFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFDLENBQUM7SUFFM0QsMERBQTBEO0lBQzFELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQ1osV0FBVyxFQUFFLE1BQThCLEVBQzNDLEtBQTJCLENBQU0sQ0FBQztJQUVsRCxJQUFJLFlBQVksRUFBRTtRQUNoQixPQUFPLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFNLENBQUM7S0FDdEU7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLEVBQUMsWUFBWSxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge0F2Z1Bvb2xHcmFkLCBBdmdQb29sR3JhZEF0dHJzLCBBdmdQb29sR3JhZElucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7TmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtUZW5zb3IzRCwgVGVuc29yNER9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7RXhwbGljaXRQYWRkaW5nfSBmcm9tICcuL2NvbnZfdXRpbCc7XG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5pbXBvcnQge3Jlc2hhcGV9IGZyb20gJy4vcmVzaGFwZSc7XG5cbi8qKlxuICogQ29tcHV0ZXMgdGhlIGJhY2twcm9wIG9mIGFuIDJEIGF2ZyBwb29sLlxuICpcbiAqIEBwYXJhbSBkeSBUaGUgZHkgZXJyb3IsIG9mIHJhbmsgNCBvciByYW5rIDMgb2Ygc2hhcGVcbiAqICAgICBbYmF0Y2hTaXplLCBoZWlnaHQsIHdpZHRoLCBjaGFubmVsc10uIElmIHJhbmsgMywgYmF0Y2ggb2YgMSBpc1xuICogYXNzdW1lZC5cbiAqIEBwYXJhbSBpbnB1dCBUaGUgaW5wdXQgaW1hZ2UsIG9mIHJhbmsgNCBvciByYW5rIDMgb2Ygc2hhcGVcbiAqICAgICBbYmF0Y2hTaXplLCBoZWlnaHQsIHdpZHRoLCBjaGFubmVsc10uIElmIHJhbmsgMywgYmF0Y2ggb2YgMSBpc1xuICogYXNzdW1lZC5cbiAqIEBwYXJhbSBmaWx0ZXJTaXplIFRoZSBmaWx0ZXIgc2l6ZTogYFtmaWx0ZXJIZWlnaHQsIGZpbHRlcldpZHRoXWAuIElmXG4gKiAgICAgYGZpbHRlclNpemVgIGlzIGEgc2luZ2xlIG51bWJlciwgdGhlbiBgZmlsdGVySGVpZ2h0ID09IGZpbHRlcldpZHRoYC5cbiAqIEBwYXJhbSBzdHJpZGVzIFRoZSBzdHJpZGVzIG9mIHRoZSBwb29saW5nOiBgW3N0cmlkZUhlaWdodCwgc3RyaWRlV2lkdGhdYC4gSWZcbiAqICAgICBgc3RyaWRlc2AgaXMgYSBzaW5nbGUgbnVtYmVyLCB0aGVuIGBzdHJpZGVIZWlnaHQgPT0gc3RyaWRlV2lkdGhgLlxuICogQHBhcmFtIHBhZCBUaGUgdHlwZSBvZiBwYWRkaW5nIGFsZ29yaXRobSB1c2VkIGluIHRoZSBmb3J3YXJkIHByb3Agb2YgdGhlIG9wLlxuICogICAgICdzYW1lJywgJ3ZhbGlkJywgZm9yIG1vcmUgaW5mbywgc2VlIHRoaXMgZ3VpZGU6XG4gKiAgICAgW2h0dHBzOi8vd3d3LnRlbnNvcmZsb3cub3JnL2FwaV9kb2NzL3B5dGhvbi90Zi9ubi9jb252b2x1dGlvbl0oXG4gKiAgICAgICAgIGh0dHBzOi8vd3d3LnRlbnNvcmZsb3cub3JnL2FwaV9kb2NzL3B5dGhvbi90Zi9ubi9jb252b2x1dGlvbilcbiAqL1xuZnVuY3Rpb24gYXZnUG9vbEdyYWRfPFQgZXh0ZW5kcyBUZW5zb3IzRHxUZW5zb3I0RD4oXG4gICAgZHk6IFR8VGVuc29yTGlrZSwgaW5wdXQ6IFR8VGVuc29yTGlrZSwgZmlsdGVyU2l6ZTogW251bWJlciwgbnVtYmVyXXxudW1iZXIsXG4gICAgc3RyaWRlczogW251bWJlciwgbnVtYmVyXXxudW1iZXIsXG4gICAgcGFkOiAndmFsaWQnfCdzYW1lJ3xudW1iZXJ8RXhwbGljaXRQYWRkaW5nKTogVCB7XG4gIGNvbnN0ICRkeSA9IGNvbnZlcnRUb1RlbnNvcihkeSwgJ2R5JywgJ2F2Z1Bvb2xHcmFkJyk7XG4gIGNvbnN0ICRpbnB1dCA9IGNvbnZlcnRUb1RlbnNvcihpbnB1dCwgJ2lucHV0JywgJ2F2Z1Bvb2xHcmFkJyk7XG5cbiAgdXRpbC5hc3NlcnQoXG4gICAgICAkaW5wdXQucmFuayA9PT0gJGR5LnJhbmssXG4gICAgICAoKSA9PiBgUmFuayBvZiBpbnB1dCAoJHskaW5wdXQucmFua30pIGRvZXMgbm90IG1hdGNoIHJhbmsgb2YgZHkgKCR7XG4gICAgICAgICAgJGR5LnJhbmt9KWApO1xuXG4gIGxldCBpbnB1dDREID0gJGlucHV0IGFzIFRlbnNvcjREO1xuICBsZXQgZHk0RCA9ICRkeSBhcyBUZW5zb3I0RDtcbiAgbGV0IHJlc2hhcGVkVG80RCA9IGZhbHNlO1xuXG4gIGlmICgkaW5wdXQucmFuayA9PT0gMykge1xuICAgIHJlc2hhcGVkVG80RCA9IHRydWU7XG4gICAgaW5wdXQ0RCA9XG4gICAgICAgIHJlc2hhcGUoJGlucHV0LCBbMSwgJGlucHV0LnNoYXBlWzBdLCAkaW5wdXQuc2hhcGVbMV0sICRpbnB1dC5zaGFwZVsyXV0pO1xuICAgIGR5NEQgPSByZXNoYXBlKCRkeSwgWzEsICRkeS5zaGFwZVswXSwgJGR5LnNoYXBlWzFdLCAkZHkuc2hhcGVbMl1dKTtcbiAgfVxuXG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgZHk0RC5yYW5rID09PSA0LFxuICAgICAgKCkgPT4gYEVycm9yIGluIGF2Z1Bvb2xHcmFkOiBkeSBtdXN0IGJlIHJhbmsgNCBidXQgZ290IHJhbmsgYCArXG4gICAgICAgICAgYCR7ZHk0RC5yYW5rfS5gKTtcbiAgdXRpbC5hc3NlcnQoXG4gICAgICBpbnB1dDRELnJhbmsgPT09IDQsXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gYXZnUG9vbEdyYWQ6IGlucHV0IG11c3QgYmUgcmFuayA0IGJ1dCBnb3QgcmFuayBgICtcbiAgICAgICAgICBgJHtpbnB1dDRELnJhbmt9LmApO1xuXG4gIGNvbnN0IGlucHV0czogQXZnUG9vbEdyYWRJbnB1dHMgPSB7ZHk6IGR5NEQsIGlucHV0OiBpbnB1dDREfTtcblxuICBjb25zdCBhdHRyczogQXZnUG9vbEdyYWRBdHRycyA9IHtmaWx0ZXJTaXplLCBzdHJpZGVzLCBwYWR9O1xuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tdW5uZWNlc3NhcnktdHlwZS1hc3NlcnRpb25cbiAgY29uc3QgcmVzID0gRU5HSU5FLnJ1bktlcm5lbChcbiAgICAgICAgICAgICAgICAgIEF2Z1Bvb2xHcmFkLCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXAsXG4gICAgICAgICAgICAgICAgICBhdHRycyBhcyB7fSBhcyBOYW1lZEF0dHJNYXApIGFzIFQ7XG5cbiAgaWYgKHJlc2hhcGVkVG80RCkge1xuICAgIHJldHVybiByZXNoYXBlKHJlcywgW3Jlcy5zaGFwZVsxXSwgcmVzLnNoYXBlWzJdLCByZXMuc2hhcGVbM11dKSBhcyBUO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBjb25zdCBhdmdQb29sR3JhZCA9IG9wKHthdmdQb29sR3JhZF99KTtcbiJdfQ==