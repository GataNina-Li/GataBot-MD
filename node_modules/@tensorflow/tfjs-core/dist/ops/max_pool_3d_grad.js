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
import { MaxPool3DGrad } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { checkPadOnDimRoundingMode } from './conv_util';
import { op } from './operation';
import { reshape } from './reshape';
/**
 * Computes the backprop of a 3d max pool.
 *
 * @param dy The dy error, of rank 5 of shape
 *     [batchSize, depth, height, width, channels].
 * assumed.
 * @param input The original input image, of rank 5 or rank 4 of shape
 *     [batchSize, depth, height, width, channels].
 * @param output The original output image, of rank 5 of shape
 *     [batchSize, outDepth, outHeight, outWidth, channels].
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
function maxPool3dGrad_(dy, input, output, filterSize, strides, pad, dimRoundingMode) {
    const $dy = convertToTensor(dy, 'dy', 'maxPool3dGrad');
    const $input = convertToTensor(input, 'input', 'maxPool3dGrad');
    const $output = convertToTensor(output, 'output', 'maxPool3dGrad');
    let dy5D = $dy;
    let input5D = $input;
    let output5D = $output;
    let reshapedTo5D = false;
    if ($input.rank === 4) {
        reshapedTo5D = true;
        dy5D = reshape($dy, [1, $dy.shape[0], $dy.shape[1], $dy.shape[2], $dy.shape[3]]);
        input5D = reshape($input, [
            1, $input.shape[0], $input.shape[1], $input.shape[2], $input.shape[3]
        ]);
        output5D = reshape($output, [
            1, $output.shape[0], $output.shape[1], $output.shape[2], $output.shape[3]
        ]);
    }
    util.assert(dy5D.rank === 5, () => `Error in maxPool3dGrad: dy must be rank 5 but got rank ` +
        `${dy5D.rank}.`);
    util.assert(input5D.rank === 5, () => `Error in maxPool3dGrad: input must be rank 5 but got rank ` +
        `${input5D.rank}.`);
    util.assert(output5D.rank === 5, () => `Error in maxPool3dGrad: output must be rank 5 but got rank ` +
        `${output5D.rank}.`);
    checkPadOnDimRoundingMode('maxPool3dGrad', pad, dimRoundingMode);
    const inputs = { dy: dy5D, input: input5D, output: output5D };
    const attrs = { filterSize, strides, pad, dimRoundingMode };
    // tslint:disable-next-line: no-unnecessary-type-assertion
    const res = ENGINE.runKernel(MaxPool3DGrad, inputs, attrs);
    if (reshapedTo5D) {
        return reshape(res, [res.shape[1], res.shape[2], res.shape[3], res.shape[4]]);
    }
    return res;
}
export const maxPool3dGrad = op({ maxPool3dGrad_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4X3Bvb2xfM2RfZ3JhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL21heF9wb29sXzNkX2dyYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsYUFBYSxFQUEwQyxNQUFNLGlCQUFpQixDQUFDO0FBSXZGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUVuRCxPQUFPLEtBQUssSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUVoQyxPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDdEQsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMvQixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBRWxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxQkc7QUFDSCxTQUFTLGNBQWMsQ0FDbkIsRUFBZ0IsRUFBRSxLQUFtQixFQUFFLE1BQW9CLEVBQzNELFVBQTJDLEVBQzNDLE9BQXdDLEVBQUUsR0FBMEIsRUFDcEUsZUFBd0M7SUFDMUMsTUFBTSxHQUFHLEdBQUcsZUFBZSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDdkQsTUFBTSxNQUFNLEdBQUcsZUFBZSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDaEUsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFFbkUsSUFBSSxJQUFJLEdBQUcsR0FBZSxDQUFDO0lBQzNCLElBQUksT0FBTyxHQUFHLE1BQWtCLENBQUM7SUFDakMsSUFBSSxRQUFRLEdBQUcsT0FBbUIsQ0FBQztJQUNuQyxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7SUFFekIsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtRQUNyQixZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksR0FBRyxPQUFPLENBQ1YsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFO1lBQ3hCLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUN0RSxDQUFDLENBQUM7UUFDSCxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRTtZQUMxQixDQUFDLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDMUUsQ0FBQyxDQUFDO0tBQ0o7SUFFRCxJQUFJLENBQUMsTUFBTSxDQUNQLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUNmLEdBQUcsRUFBRSxDQUFDLHlEQUF5RDtRQUMzRCxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLElBQUksQ0FBQyxNQUFNLENBQ1AsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQ2xCLEdBQUcsRUFBRSxDQUFDLDREQUE0RDtRQUM5RCxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLElBQUksQ0FBQyxNQUFNLENBQ1AsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQ25CLEdBQUcsRUFBRSxDQUFDLDZEQUE2RDtRQUMvRCxHQUFHLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLHlCQUF5QixDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDakUsTUFBTSxNQUFNLEdBQ2MsRUFBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBQyxDQUFDO0lBQ3ZFLE1BQU0sS0FBSyxHQUF1QixFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBQyxDQUFDO0lBRTlFLDBEQUEwRDtJQUMxRCxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUNaLGFBQWEsRUFBRSxNQUE4QixFQUM3QyxLQUEyQixDQUFNLENBQUM7SUFFbEQsSUFBSSxZQUFZLEVBQUU7UUFDaEIsT0FBTyxPQUFPLENBQ0gsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNuRSxDQUFDO0tBQ1A7SUFFRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDLEVBQUMsY0FBYyxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge01heFBvb2wzREdyYWQsIE1heFBvb2wzREdyYWRBdHRycywgTWF4UG9vbDNER3JhZElucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7TmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtUZW5zb3I0RCwgVGVuc29yNUR9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7Y2hlY2tQYWRPbkRpbVJvdW5kaW5nTW9kZX0gZnJvbSAnLi9jb252X3V0aWwnO1xuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuaW1wb3J0IHtyZXNoYXBlfSBmcm9tICcuL3Jlc2hhcGUnO1xuXG4vKipcbiAqIENvbXB1dGVzIHRoZSBiYWNrcHJvcCBvZiBhIDNkIG1heCBwb29sLlxuICpcbiAqIEBwYXJhbSBkeSBUaGUgZHkgZXJyb3IsIG9mIHJhbmsgNSBvZiBzaGFwZVxuICogICAgIFtiYXRjaFNpemUsIGRlcHRoLCBoZWlnaHQsIHdpZHRoLCBjaGFubmVsc10uXG4gKiBhc3N1bWVkLlxuICogQHBhcmFtIGlucHV0IFRoZSBvcmlnaW5hbCBpbnB1dCBpbWFnZSwgb2YgcmFuayA1IG9yIHJhbmsgNCBvZiBzaGFwZVxuICogICAgIFtiYXRjaFNpemUsIGRlcHRoLCBoZWlnaHQsIHdpZHRoLCBjaGFubmVsc10uXG4gKiBAcGFyYW0gb3V0cHV0IFRoZSBvcmlnaW5hbCBvdXRwdXQgaW1hZ2UsIG9mIHJhbmsgNSBvZiBzaGFwZVxuICogICAgIFtiYXRjaFNpemUsIG91dERlcHRoLCBvdXRIZWlnaHQsIG91dFdpZHRoLCBjaGFubmVsc10uXG4gKiBAcGFyYW0gZmlsdGVyU2l6ZSBUaGUgZmlsdGVyIHNpemU6XG4gKiAgICAgYFtmaWx0ZXJEZXB0aCwgZmlsdGVySGVpZ2h0LCBmaWx0ZXJXaWR0aF1gLlxuICogICAgIGBmaWx0ZXJTaXplYCBpcyBhIHNpbmdsZSBudW1iZXIsXG4gKiAgICAgdGhlbiBgZmlsdGVyRGVwdGggPT0gZmlsdGVySGVpZ2h0ID09IGZpbHRlcldpZHRoYC5cbiAqIEBwYXJhbSBzdHJpZGVzIFRoZSBzdHJpZGVzIG9mIHRoZSBwb29saW5nOlxuICogICAgIGBbc3RyaWRlRGVwdGgsIHN0cmlkZUhlaWdodCwgc3RyaWRlV2lkdGhdYC4gSWZcbiAqICAgICBgc3RyaWRlc2AgaXMgYSBzaW5nbGUgbnVtYmVyLCB0aGVuIGBzdHJpZGVIZWlnaHQgPT0gc3RyaWRlV2lkdGhgLlxuICogQHBhcmFtIHBhZCBBIHN0cmluZyBmcm9tOiAnc2FtZScsICd2YWxpZCcuIFRoZSB0eXBlIG9mIHBhZGRpbmcgYWxnb3JpdGhtXG4gKiAgICAgdXNlZCBpbiB0aGUgZm9yd2FyZCBwcm9wIG9mIHRoZSBvcC5cbiAqIEBwYXJhbSBkaW1Sb3VuZGluZ01vZGUgQSBzdHJpbmcgZnJvbTogJ2NlaWwnLCAncm91bmQnLCAnZmxvb3InLiBJZiBub25lIGlzXG4gKiAgICAgcHJvdmlkZWQsIGl0IHdpbGwgZGVmYXVsdCB0byB0cnVuY2F0ZS5cbiAqL1xuZnVuY3Rpb24gbWF4UG9vbDNkR3JhZF88VCBleHRlbmRzIFRlbnNvcjREfFRlbnNvcjVEPihcbiAgICBkeTogVHxUZW5zb3JMaWtlLCBpbnB1dDogVHxUZW5zb3JMaWtlLCBvdXRwdXQ6IFR8VGVuc29yTGlrZSxcbiAgICBmaWx0ZXJTaXplOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl18bnVtYmVyLFxuICAgIHN0cmlkZXM6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXXxudW1iZXIsIHBhZDogJ3ZhbGlkJ3wnc2FtZSd8bnVtYmVyLFxuICAgIGRpbVJvdW5kaW5nTW9kZT86ICdmbG9vcid8J3JvdW5kJ3wnY2VpbCcpOiBUIHtcbiAgY29uc3QgJGR5ID0gY29udmVydFRvVGVuc29yKGR5LCAnZHknLCAnbWF4UG9vbDNkR3JhZCcpO1xuICBjb25zdCAkaW5wdXQgPSBjb252ZXJ0VG9UZW5zb3IoaW5wdXQsICdpbnB1dCcsICdtYXhQb29sM2RHcmFkJyk7XG4gIGNvbnN0ICRvdXRwdXQgPSBjb252ZXJ0VG9UZW5zb3Iob3V0cHV0LCAnb3V0cHV0JywgJ21heFBvb2wzZEdyYWQnKTtcblxuICBsZXQgZHk1RCA9ICRkeSBhcyBUZW5zb3I1RDtcbiAgbGV0IGlucHV0NUQgPSAkaW5wdXQgYXMgVGVuc29yNUQ7XG4gIGxldCBvdXRwdXQ1RCA9ICRvdXRwdXQgYXMgVGVuc29yNUQ7XG4gIGxldCByZXNoYXBlZFRvNUQgPSBmYWxzZTtcblxuICBpZiAoJGlucHV0LnJhbmsgPT09IDQpIHtcbiAgICByZXNoYXBlZFRvNUQgPSB0cnVlO1xuICAgIGR5NUQgPSByZXNoYXBlKFxuICAgICAgICAkZHksIFsxLCAkZHkuc2hhcGVbMF0sICRkeS5zaGFwZVsxXSwgJGR5LnNoYXBlWzJdLCAkZHkuc2hhcGVbM11dKTtcbiAgICBpbnB1dDVEID0gcmVzaGFwZSgkaW5wdXQsIFtcbiAgICAgIDEsICRpbnB1dC5zaGFwZVswXSwgJGlucHV0LnNoYXBlWzFdLCAkaW5wdXQuc2hhcGVbMl0sICRpbnB1dC5zaGFwZVszXVxuICAgIF0pO1xuICAgIG91dHB1dDVEID0gcmVzaGFwZSgkb3V0cHV0LCBbXG4gICAgICAxLCAkb3V0cHV0LnNoYXBlWzBdLCAkb3V0cHV0LnNoYXBlWzFdLCAkb3V0cHV0LnNoYXBlWzJdLCAkb3V0cHV0LnNoYXBlWzNdXG4gICAgXSk7XG4gIH1cblxuICB1dGlsLmFzc2VydChcbiAgICAgIGR5NUQucmFuayA9PT0gNSxcbiAgICAgICgpID0+IGBFcnJvciBpbiBtYXhQb29sM2RHcmFkOiBkeSBtdXN0IGJlIHJhbmsgNSBidXQgZ290IHJhbmsgYCArXG4gICAgICAgICAgYCR7ZHk1RC5yYW5rfS5gKTtcbiAgdXRpbC5hc3NlcnQoXG4gICAgICBpbnB1dDVELnJhbmsgPT09IDUsXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gbWF4UG9vbDNkR3JhZDogaW5wdXQgbXVzdCBiZSByYW5rIDUgYnV0IGdvdCByYW5rIGAgK1xuICAgICAgICAgIGAke2lucHV0NUQucmFua30uYCk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgb3V0cHV0NUQucmFuayA9PT0gNSxcbiAgICAgICgpID0+IGBFcnJvciBpbiBtYXhQb29sM2RHcmFkOiBvdXRwdXQgbXVzdCBiZSByYW5rIDUgYnV0IGdvdCByYW5rIGAgK1xuICAgICAgICAgIGAke291dHB1dDVELnJhbmt9LmApO1xuICBjaGVja1BhZE9uRGltUm91bmRpbmdNb2RlKCdtYXhQb29sM2RHcmFkJywgcGFkLCBkaW1Sb3VuZGluZ01vZGUpO1xuICBjb25zdCBpbnB1dHM6XG4gICAgICBNYXhQb29sM0RHcmFkSW5wdXRzID0ge2R5OiBkeTVELCBpbnB1dDogaW5wdXQ1RCwgb3V0cHV0OiBvdXRwdXQ1RH07XG4gIGNvbnN0IGF0dHJzOiBNYXhQb29sM0RHcmFkQXR0cnMgPSB7ZmlsdGVyU2l6ZSwgc3RyaWRlcywgcGFkLCBkaW1Sb3VuZGluZ01vZGV9O1xuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tdW5uZWNlc3NhcnktdHlwZS1hc3NlcnRpb25cbiAgY29uc3QgcmVzID0gRU5HSU5FLnJ1bktlcm5lbChcbiAgICAgICAgICAgICAgICAgIE1heFBvb2wzREdyYWQsIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCxcbiAgICAgICAgICAgICAgICAgIGF0dHJzIGFzIHt9IGFzIE5hbWVkQXR0ck1hcCkgYXMgVDtcblxuICBpZiAocmVzaGFwZWRUbzVEKSB7XG4gICAgcmV0dXJuIHJlc2hhcGUoXG4gICAgICAgICAgICAgICByZXMsIFtyZXMuc2hhcGVbMV0sIHJlcy5zaGFwZVsyXSwgcmVzLnNoYXBlWzNdLCByZXMuc2hhcGVbNF1dKSBhc1xuICAgICAgICBUO1xuICB9XG5cbiAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGNvbnN0IG1heFBvb2wzZEdyYWQgPSBvcCh7bWF4UG9vbDNkR3JhZF99KTtcbiJdfQ==