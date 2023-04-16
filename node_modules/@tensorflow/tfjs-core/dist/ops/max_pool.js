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
import { MaxPool } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import * as conv_util from './conv_util';
import { op } from './operation';
import { reshape } from './reshape';
/**
 * Computes the 2D max pooling of an image.
 *
 * @param x The input tensor, of rank 4 or rank 3 of shape
 *     `[batch, height, width, inChannels]`. If rank 3, batch of 1 is assumed.
 * @param filterSize The filter size: `[filterHeight, filterWidth]`. If
 *     `filterSize` is a single number, then `filterHeight == filterWidth`.
 * @param strides The strides of the pooling: `[strideHeight, strideWidth]`. If
 *     `strides` is a single number, then `strideHeight == strideWidth`.
 * @param dilations The dilation rates: `[dilationHeight, dilationWidth]`
 *     in which we sample input values across the height and width dimensions
 *     in dilated pooling. Defaults to `[1, 1]`. If `dilations` is a single
 *     number, then `dilationHeight == dilationWidth`. If it is greater than
 *     1, then all values of `strides` must be 1.
 * @param pad The type of padding algorithm.
 *    - `same` and stride 1: output will be of same size as input,
 *       regardless of filter size.
 *    - `valid`: output will be smaller than input if filter is larger
 *       than 1x1.
 *    - For more info, see this guide:
 *     [https://www.tensorflow.org/api_docs/python/tf/nn/convolution](
 *          https://www.tensorflow.org/api_docs/python/tf/nn/convolution)
 * @param dimRoundingMode A string from: 'ceil', 'round', 'floor'. If none is
 *     provided, it will default to truncate.
 */
function maxPool_(x, filterSize, strides, pad, dimRoundingMode) {
    const $x = convertToTensor(x, 'x', 'maxPool');
    const dilations = 1;
    let x4D = $x;
    let reshapedTo4D = false;
    if ($x.rank === 3) {
        reshapedTo4D = true;
        x4D = reshape($x, [1, $x.shape[0], $x.shape[1], $x.shape[2]]);
    }
    util.assert(x4D.rank === 4, () => `Error in maxPool: input must be rank 4 but got rank ${x4D.rank}.`);
    util.assert(conv_util.eitherStridesOrDilationsAreOne(strides, dilations), () => 'Error in maxPool: Either strides or dilations must be 1. ' +
        `Got strides ${strides} and dilations '${dilations}'`);
    conv_util.checkPadOnDimRoundingMode('maxPool', pad, dimRoundingMode);
    const inputs = { x: x4D };
    const attrs = { filterSize, strides, pad, dimRoundingMode };
    // tslint:disable-next-line: no-unnecessary-type-assertion
    const res = ENGINE.runKernel(MaxPool, inputs, attrs);
    if (reshapedTo4D) {
        return reshape(res, [res.shape[1], res.shape[2], res.shape[3]]);
    }
    return res;
}
export const maxPool = op({ maxPool_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4X3Bvb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9tYXhfcG9vbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxPQUFPLEVBQThCLE1BQU0saUJBQWlCLENBQUM7QUFJckUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE9BQU8sS0FBSyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBRWhDLE9BQU8sS0FBSyxTQUFTLE1BQU0sYUFBYSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDL0IsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUVsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBQ0gsU0FBUyxRQUFRLENBQ2IsQ0FBZSxFQUFFLFVBQW1DLEVBQ3BELE9BQWdDLEVBQ2hDLEdBQW9ELEVBQ3BELGVBQXdDO0lBQzFDLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzlDLE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBQztJQUVwQixJQUFJLEdBQUcsR0FBRyxFQUFjLENBQUM7SUFDekIsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO0lBQ3pCLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7UUFDakIsWUFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDL0Q7SUFFRCxJQUFJLENBQUMsTUFBTSxDQUNQLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUNkLEdBQUcsRUFBRSxDQUFDLHVEQUF1RCxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUM5RSxJQUFJLENBQUMsTUFBTSxDQUNQLFNBQVMsQ0FBQyw4QkFBOEIsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLEVBQzVELEdBQUcsRUFBRSxDQUFDLDJEQUEyRDtRQUM3RCxlQUFlLE9BQU8sbUJBQW1CLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDL0QsU0FBUyxDQUFDLHlCQUF5QixDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDckUsTUFBTSxNQUFNLEdBQWtCLEVBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBQyxDQUFDO0lBQ3ZDLE1BQU0sS0FBSyxHQUFpQixFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBQyxDQUFDO0lBRXhFLDBEQUEwRDtJQUMxRCxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUNaLE9BQU8sRUFBRSxNQUE4QixFQUN2QyxLQUEyQixDQUFNLENBQUM7SUFFbEQsSUFBSSxZQUFZLEVBQUU7UUFDaEIsT0FBTyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBTSxDQUFDO0tBQ3RFO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxFQUFDLFFBQVEsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtNYXhQb29sLCBNYXhQb29sQXR0cnMsIE1heFBvb2xJbnB1dHN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge05hbWVkQXR0ck1hcH0gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7VGVuc29yM0QsIFRlbnNvcjREfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQgKiBhcyBjb252X3V0aWwgZnJvbSAnLi9jb252X3V0aWwnO1xuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuaW1wb3J0IHtyZXNoYXBlfSBmcm9tICcuL3Jlc2hhcGUnO1xuXG4vKipcbiAqIENvbXB1dGVzIHRoZSAyRCBtYXggcG9vbGluZyBvZiBhbiBpbWFnZS5cbiAqXG4gKiBAcGFyYW0geCBUaGUgaW5wdXQgdGVuc29yLCBvZiByYW5rIDQgb3IgcmFuayAzIG9mIHNoYXBlXG4gKiAgICAgYFtiYXRjaCwgaGVpZ2h0LCB3aWR0aCwgaW5DaGFubmVsc11gLiBJZiByYW5rIDMsIGJhdGNoIG9mIDEgaXMgYXNzdW1lZC5cbiAqIEBwYXJhbSBmaWx0ZXJTaXplIFRoZSBmaWx0ZXIgc2l6ZTogYFtmaWx0ZXJIZWlnaHQsIGZpbHRlcldpZHRoXWAuIElmXG4gKiAgICAgYGZpbHRlclNpemVgIGlzIGEgc2luZ2xlIG51bWJlciwgdGhlbiBgZmlsdGVySGVpZ2h0ID09IGZpbHRlcldpZHRoYC5cbiAqIEBwYXJhbSBzdHJpZGVzIFRoZSBzdHJpZGVzIG9mIHRoZSBwb29saW5nOiBgW3N0cmlkZUhlaWdodCwgc3RyaWRlV2lkdGhdYC4gSWZcbiAqICAgICBgc3RyaWRlc2AgaXMgYSBzaW5nbGUgbnVtYmVyLCB0aGVuIGBzdHJpZGVIZWlnaHQgPT0gc3RyaWRlV2lkdGhgLlxuICogQHBhcmFtIGRpbGF0aW9ucyBUaGUgZGlsYXRpb24gcmF0ZXM6IGBbZGlsYXRpb25IZWlnaHQsIGRpbGF0aW9uV2lkdGhdYFxuICogICAgIGluIHdoaWNoIHdlIHNhbXBsZSBpbnB1dCB2YWx1ZXMgYWNyb3NzIHRoZSBoZWlnaHQgYW5kIHdpZHRoIGRpbWVuc2lvbnNcbiAqICAgICBpbiBkaWxhdGVkIHBvb2xpbmcuIERlZmF1bHRzIHRvIGBbMSwgMV1gLiBJZiBgZGlsYXRpb25zYCBpcyBhIHNpbmdsZVxuICogICAgIG51bWJlciwgdGhlbiBgZGlsYXRpb25IZWlnaHQgPT0gZGlsYXRpb25XaWR0aGAuIElmIGl0IGlzIGdyZWF0ZXIgdGhhblxuICogICAgIDEsIHRoZW4gYWxsIHZhbHVlcyBvZiBgc3RyaWRlc2AgbXVzdCBiZSAxLlxuICogQHBhcmFtIHBhZCBUaGUgdHlwZSBvZiBwYWRkaW5nIGFsZ29yaXRobS5cbiAqICAgIC0gYHNhbWVgIGFuZCBzdHJpZGUgMTogb3V0cHV0IHdpbGwgYmUgb2Ygc2FtZSBzaXplIGFzIGlucHV0LFxuICogICAgICAgcmVnYXJkbGVzcyBvZiBmaWx0ZXIgc2l6ZS5cbiAqICAgIC0gYHZhbGlkYDogb3V0cHV0IHdpbGwgYmUgc21hbGxlciB0aGFuIGlucHV0IGlmIGZpbHRlciBpcyBsYXJnZXJcbiAqICAgICAgIHRoYW4gMXgxLlxuICogICAgLSBGb3IgbW9yZSBpbmZvLCBzZWUgdGhpcyBndWlkZTpcbiAqICAgICBbaHR0cHM6Ly93d3cudGVuc29yZmxvdy5vcmcvYXBpX2RvY3MvcHl0aG9uL3RmL25uL2NvbnZvbHV0aW9uXShcbiAqICAgICAgICAgIGh0dHBzOi8vd3d3LnRlbnNvcmZsb3cub3JnL2FwaV9kb2NzL3B5dGhvbi90Zi9ubi9jb252b2x1dGlvbilcbiAqIEBwYXJhbSBkaW1Sb3VuZGluZ01vZGUgQSBzdHJpbmcgZnJvbTogJ2NlaWwnLCAncm91bmQnLCAnZmxvb3InLiBJZiBub25lIGlzXG4gKiAgICAgcHJvdmlkZWQsIGl0IHdpbGwgZGVmYXVsdCB0byB0cnVuY2F0ZS5cbiAqL1xuZnVuY3Rpb24gbWF4UG9vbF88VCBleHRlbmRzIFRlbnNvcjNEfFRlbnNvcjREPihcbiAgICB4OiBUfFRlbnNvckxpa2UsIGZpbHRlclNpemU6IFtudW1iZXIsIG51bWJlcl18bnVtYmVyLFxuICAgIHN0cmlkZXM6IFtudW1iZXIsIG51bWJlcl18bnVtYmVyLFxuICAgIHBhZDogJ3ZhbGlkJ3wnc2FtZSd8bnVtYmVyfGNvbnZfdXRpbC5FeHBsaWNpdFBhZGRpbmcsXG4gICAgZGltUm91bmRpbmdNb2RlPzogJ2Zsb29yJ3wncm91bmQnfCdjZWlsJyk6IFQge1xuICBjb25zdCAkeCA9IGNvbnZlcnRUb1RlbnNvcih4LCAneCcsICdtYXhQb29sJyk7XG4gIGNvbnN0IGRpbGF0aW9ucyA9IDE7XG5cbiAgbGV0IHg0RCA9ICR4IGFzIFRlbnNvcjREO1xuICBsZXQgcmVzaGFwZWRUbzREID0gZmFsc2U7XG4gIGlmICgkeC5yYW5rID09PSAzKSB7XG4gICAgcmVzaGFwZWRUbzREID0gdHJ1ZTtcbiAgICB4NEQgPSByZXNoYXBlKCR4LCBbMSwgJHguc2hhcGVbMF0sICR4LnNoYXBlWzFdLCAkeC5zaGFwZVsyXV0pO1xuICB9XG5cbiAgdXRpbC5hc3NlcnQoXG4gICAgICB4NEQucmFuayA9PT0gNCxcbiAgICAgICgpID0+IGBFcnJvciBpbiBtYXhQb29sOiBpbnB1dCBtdXN0IGJlIHJhbmsgNCBidXQgZ290IHJhbmsgJHt4NEQucmFua30uYCk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgY29udl91dGlsLmVpdGhlclN0cmlkZXNPckRpbGF0aW9uc0FyZU9uZShzdHJpZGVzLCBkaWxhdGlvbnMpLFxuICAgICAgKCkgPT4gJ0Vycm9yIGluIG1heFBvb2w6IEVpdGhlciBzdHJpZGVzIG9yIGRpbGF0aW9ucyBtdXN0IGJlIDEuICcgK1xuICAgICAgICAgIGBHb3Qgc3RyaWRlcyAke3N0cmlkZXN9IGFuZCBkaWxhdGlvbnMgJyR7ZGlsYXRpb25zfSdgKTtcbiAgY29udl91dGlsLmNoZWNrUGFkT25EaW1Sb3VuZGluZ01vZGUoJ21heFBvb2wnLCBwYWQsIGRpbVJvdW5kaW5nTW9kZSk7XG4gIGNvbnN0IGlucHV0czogTWF4UG9vbElucHV0cyA9IHt4OiB4NER9O1xuICBjb25zdCBhdHRyczogTWF4UG9vbEF0dHJzID0ge2ZpbHRlclNpemUsIHN0cmlkZXMsIHBhZCwgZGltUm91bmRpbmdNb2RlfTtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVubmVjZXNzYXJ5LXR5cGUtYXNzZXJ0aW9uXG4gIGNvbnN0IHJlcyA9IEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICAgICAgICAgICAgICBNYXhQb29sLCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXAsXG4gICAgICAgICAgICAgICAgICBhdHRycyBhcyB7fSBhcyBOYW1lZEF0dHJNYXApIGFzIFQ7XG5cbiAgaWYgKHJlc2hhcGVkVG80RCkge1xuICAgIHJldHVybiByZXNoYXBlKHJlcywgW3Jlcy5zaGFwZVsxXSwgcmVzLnNoYXBlWzJdLCByZXMuc2hhcGVbM11dKSBhcyBUO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBjb25zdCBtYXhQb29sID0gb3Aoe21heFBvb2xffSk7XG4iXX0=