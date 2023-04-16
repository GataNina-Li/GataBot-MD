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
import { AvgPool3D } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { checkPadOnDimRoundingMode } from './conv_util';
import { cast } from './cast';
import { op } from './operation';
import { reshape } from './reshape';
/**
 * Computes the 3D average pooling.
 *
 * ```js
 * const x = tf.tensor5d([1, 2, 3, 4, 5, 6, 7, 8], [1, 2, 2, 2, 1]);
 * const result = tf.avgPool3d(x, 2, 1, 'valid');
 * result.print();
 * ```
 *
 * @param x The input tensor, of rank 5 or rank 4 of shape
 *     `[batch, depth, height, width, inChannels]`.
 * @param filterSize The filter size:
 *     `[filterDepth, filterHeight, filterWidth]`.
 *     If `filterSize` is a single number,
 *     then `filterDepth == filterHeight == filterWidth`.
 * @param strides The strides of the pooling:
 *     `[strideDepth, strideHeight, strideWidth]`.
 *     If `strides` is a single number,
 *     then `strideDepth == strideHeight == strideWidth`.
 * @param pad The type of padding algorithm.
 *    - `same` and stride 1: output will be of same size as input,
 *       regardless of filter size.
 *    - `valid`: output will be smaller than input if filter is larger
 *       than 1*1x1.
 *    - For more info, see this guide:
 *     [https://www.tensorflow.org/api_docs/python/tf/nn/convolution](
 *          https://www.tensorflow.org/api_docs/python/tf/nn/convolution)
 * @param dimRoundingMode A string from: 'ceil', 'round', 'floor'. If none is
 *     provided, it will default to truncate.
 * @param dataFormat An optional string from: "NDHWC", "NCDHW". Defaults to
 *     "NDHWC". Specify the data format of the input and output data. With the
 *     default format "NDHWC", the data is stored in the order of: [batch,
 *     depth, height, width, channels]. Only "NDHWC" is currently supported.
 *
 * @doc {heading: 'Operations', subheading: 'Convolution'}
 */
function avgPool3d_(x, filterSize, strides, pad, dimRoundingMode, dataFormat = 'NDHWC') {
    const $x = convertToTensor(x, 'x', 'avgPool3d', 'float32');
    let x5D = $x;
    let reshapedTo5D = false;
    if ($x.rank === 4) {
        reshapedTo5D = true;
        x5D = reshape($x, [1, $x.shape[0], $x.shape[1], $x.shape[2], $x.shape[3]]);
    }
    util.assert(x5D.rank === 5, () => `Error in avgPool3d: x must be rank 5 but got rank ${x5D.rank}.`);
    util.assert(dataFormat === 'NDHWC', () => `Error in avgPool3d: Only NDHWC is currently supported, ` +
        `but got dataFormat of ${dataFormat}`);
    checkPadOnDimRoundingMode('avgPool3d', pad, dimRoundingMode);
    const inputs = { x: x5D };
    const attrs = { filterSize, strides, pad, dimRoundingMode, dataFormat };
    // tslint:disable-next-line: no-unnecessary-type-assertion
    let res = ENGINE.runKernel(AvgPool3D, inputs, attrs);
    res = cast(res, x5D.dtype);
    if (reshapedTo5D) {
        return reshape(res, [res.shape[1], res.shape[2], res.shape[3], res.shape[4]]);
    }
    return res;
}
export const avgPool3d = op({ avgPool3d_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXZnX3Bvb2xfM2QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9hdmdfcG9vbF8zZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxTQUFTLEVBQWtDLE1BQU0saUJBQWlCLENBQUM7QUFJM0UsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE9BQU8sS0FBSyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBRWhDLE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN0RCxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDL0IsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUVsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQ0c7QUFDSCxTQUFTLFVBQVUsQ0FDZixDQUFlLEVBQUUsVUFBMkMsRUFDNUQsT0FBd0MsRUFBRSxHQUEwQixFQUNwRSxlQUF3QyxFQUN4QyxhQUE4QixPQUFPO0lBQ3ZDLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUUzRCxJQUFJLEdBQUcsR0FBRyxFQUFjLENBQUM7SUFDekIsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO0lBQ3pCLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7UUFDakIsWUFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM1RTtJQUVELElBQUksQ0FBQyxNQUFNLENBQ1AsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQ2QsR0FBRyxFQUFFLENBQUMscURBQXFELEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQzVFLElBQUksQ0FBQyxNQUFNLENBQ1AsVUFBVSxLQUFLLE9BQU8sRUFDdEIsR0FBRyxFQUFFLENBQUMseURBQXlEO1FBQzNELHlCQUF5QixVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQy9DLHlCQUF5QixDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDN0QsTUFBTSxNQUFNLEdBQW9CLEVBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBQyxDQUFDO0lBQ3pDLE1BQU0sS0FBSyxHQUNVLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsZUFBZSxFQUFFLFVBQVUsRUFBQyxDQUFDO0lBRTdFLDBEQUEwRDtJQUMxRCxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUNaLFNBQVMsRUFBRSxNQUE4QixFQUN6QyxLQUEyQixDQUFNLENBQUM7SUFFaEQsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTNCLElBQUksWUFBWSxFQUFFO1FBQ2hCLE9BQU8sT0FBTyxDQUNILEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDbkUsQ0FBQztLQUNQO0lBRUQsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQyxFQUFDLFVBQVUsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtBdmdQb29sM0QsIEF2Z1Bvb2wzREF0dHJzLCBBdmdQb29sM0RJbnB1dHN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge05hbWVkQXR0ck1hcH0gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7VGVuc29yNEQsIFRlbnNvcjVEfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge2NoZWNrUGFkT25EaW1Sb3VuZGluZ01vZGV9IGZyb20gJy4vY29udl91dGlsJztcbmltcG9ydCB7Y2FzdH0gZnJvbSAnLi9jYXN0JztcbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcbmltcG9ydCB7cmVzaGFwZX0gZnJvbSAnLi9yZXNoYXBlJztcblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgM0QgYXZlcmFnZSBwb29saW5nLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCB4ID0gdGYudGVuc29yNWQoWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDhdLCBbMSwgMiwgMiwgMiwgMV0pO1xuICogY29uc3QgcmVzdWx0ID0gdGYuYXZnUG9vbDNkKHgsIDIsIDEsICd2YWxpZCcpO1xuICogcmVzdWx0LnByaW50KCk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0geCBUaGUgaW5wdXQgdGVuc29yLCBvZiByYW5rIDUgb3IgcmFuayA0IG9mIHNoYXBlXG4gKiAgICAgYFtiYXRjaCwgZGVwdGgsIGhlaWdodCwgd2lkdGgsIGluQ2hhbm5lbHNdYC5cbiAqIEBwYXJhbSBmaWx0ZXJTaXplIFRoZSBmaWx0ZXIgc2l6ZTpcbiAqICAgICBgW2ZpbHRlckRlcHRoLCBmaWx0ZXJIZWlnaHQsIGZpbHRlcldpZHRoXWAuXG4gKiAgICAgSWYgYGZpbHRlclNpemVgIGlzIGEgc2luZ2xlIG51bWJlcixcbiAqICAgICB0aGVuIGBmaWx0ZXJEZXB0aCA9PSBmaWx0ZXJIZWlnaHQgPT0gZmlsdGVyV2lkdGhgLlxuICogQHBhcmFtIHN0cmlkZXMgVGhlIHN0cmlkZXMgb2YgdGhlIHBvb2xpbmc6XG4gKiAgICAgYFtzdHJpZGVEZXB0aCwgc3RyaWRlSGVpZ2h0LCBzdHJpZGVXaWR0aF1gLlxuICogICAgIElmIGBzdHJpZGVzYCBpcyBhIHNpbmdsZSBudW1iZXIsXG4gKiAgICAgdGhlbiBgc3RyaWRlRGVwdGggPT0gc3RyaWRlSGVpZ2h0ID09IHN0cmlkZVdpZHRoYC5cbiAqIEBwYXJhbSBwYWQgVGhlIHR5cGUgb2YgcGFkZGluZyBhbGdvcml0aG0uXG4gKiAgICAtIGBzYW1lYCBhbmQgc3RyaWRlIDE6IG91dHB1dCB3aWxsIGJlIG9mIHNhbWUgc2l6ZSBhcyBpbnB1dCxcbiAqICAgICAgIHJlZ2FyZGxlc3Mgb2YgZmlsdGVyIHNpemUuXG4gKiAgICAtIGB2YWxpZGA6IG91dHB1dCB3aWxsIGJlIHNtYWxsZXIgdGhhbiBpbnB1dCBpZiBmaWx0ZXIgaXMgbGFyZ2VyXG4gKiAgICAgICB0aGFuIDEqMXgxLlxuICogICAgLSBGb3IgbW9yZSBpbmZvLCBzZWUgdGhpcyBndWlkZTpcbiAqICAgICBbaHR0cHM6Ly93d3cudGVuc29yZmxvdy5vcmcvYXBpX2RvY3MvcHl0aG9uL3RmL25uL2NvbnZvbHV0aW9uXShcbiAqICAgICAgICAgIGh0dHBzOi8vd3d3LnRlbnNvcmZsb3cub3JnL2FwaV9kb2NzL3B5dGhvbi90Zi9ubi9jb252b2x1dGlvbilcbiAqIEBwYXJhbSBkaW1Sb3VuZGluZ01vZGUgQSBzdHJpbmcgZnJvbTogJ2NlaWwnLCAncm91bmQnLCAnZmxvb3InLiBJZiBub25lIGlzXG4gKiAgICAgcHJvdmlkZWQsIGl0IHdpbGwgZGVmYXVsdCB0byB0cnVuY2F0ZS5cbiAqIEBwYXJhbSBkYXRhRm9ybWF0IEFuIG9wdGlvbmFsIHN0cmluZyBmcm9tOiBcIk5ESFdDXCIsIFwiTkNESFdcIi4gRGVmYXVsdHMgdG9cbiAqICAgICBcIk5ESFdDXCIuIFNwZWNpZnkgdGhlIGRhdGEgZm9ybWF0IG9mIHRoZSBpbnB1dCBhbmQgb3V0cHV0IGRhdGEuIFdpdGggdGhlXG4gKiAgICAgZGVmYXVsdCBmb3JtYXQgXCJOREhXQ1wiLCB0aGUgZGF0YSBpcyBzdG9yZWQgaW4gdGhlIG9yZGVyIG9mOiBbYmF0Y2gsXG4gKiAgICAgZGVwdGgsIGhlaWdodCwgd2lkdGgsIGNoYW5uZWxzXS4gT25seSBcIk5ESFdDXCIgaXMgY3VycmVudGx5IHN1cHBvcnRlZC5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdDb252b2x1dGlvbid9XG4gKi9cbmZ1bmN0aW9uIGF2Z1Bvb2wzZF88VCBleHRlbmRzIFRlbnNvcjREfFRlbnNvcjVEPihcbiAgICB4OiBUfFRlbnNvckxpa2UsIGZpbHRlclNpemU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXXxudW1iZXIsXG4gICAgc3RyaWRlczogW251bWJlciwgbnVtYmVyLCBudW1iZXJdfG51bWJlciwgcGFkOiAndmFsaWQnfCdzYW1lJ3xudW1iZXIsXG4gICAgZGltUm91bmRpbmdNb2RlPzogJ2Zsb29yJ3wncm91bmQnfCdjZWlsJyxcbiAgICBkYXRhRm9ybWF0OiAnTkRIV0MnfCdOQ0RIVycgPSAnTkRIV0MnKTogVCB7XG4gIGNvbnN0ICR4ID0gY29udmVydFRvVGVuc29yKHgsICd4JywgJ2F2Z1Bvb2wzZCcsICdmbG9hdDMyJyk7XG5cbiAgbGV0IHg1RCA9ICR4IGFzIFRlbnNvcjVEO1xuICBsZXQgcmVzaGFwZWRUbzVEID0gZmFsc2U7XG4gIGlmICgkeC5yYW5rID09PSA0KSB7XG4gICAgcmVzaGFwZWRUbzVEID0gdHJ1ZTtcbiAgICB4NUQgPSByZXNoYXBlKCR4LCBbMSwgJHguc2hhcGVbMF0sICR4LnNoYXBlWzFdLCAkeC5zaGFwZVsyXSwgJHguc2hhcGVbM11dKTtcbiAgfVxuXG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgeDVELnJhbmsgPT09IDUsXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gYXZnUG9vbDNkOiB4IG11c3QgYmUgcmFuayA1IGJ1dCBnb3QgcmFuayAke3g1RC5yYW5rfS5gKTtcbiAgdXRpbC5hc3NlcnQoXG4gICAgICBkYXRhRm9ybWF0ID09PSAnTkRIV0MnLFxuICAgICAgKCkgPT4gYEVycm9yIGluIGF2Z1Bvb2wzZDogT25seSBOREhXQyBpcyBjdXJyZW50bHkgc3VwcG9ydGVkLCBgICtcbiAgICAgICAgICBgYnV0IGdvdCBkYXRhRm9ybWF0IG9mICR7ZGF0YUZvcm1hdH1gKTtcbiAgY2hlY2tQYWRPbkRpbVJvdW5kaW5nTW9kZSgnYXZnUG9vbDNkJywgcGFkLCBkaW1Sb3VuZGluZ01vZGUpO1xuICBjb25zdCBpbnB1dHM6IEF2Z1Bvb2wzRElucHV0cyA9IHt4OiB4NUR9O1xuICBjb25zdCBhdHRyczpcbiAgICAgIEF2Z1Bvb2wzREF0dHJzID0ge2ZpbHRlclNpemUsIHN0cmlkZXMsIHBhZCwgZGltUm91bmRpbmdNb2RlLCBkYXRhRm9ybWF0fTtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVubmVjZXNzYXJ5LXR5cGUtYXNzZXJ0aW9uXG4gIGxldCByZXMgPSBFTkdJTkUucnVuS2VybmVsKFxuICAgICAgICAgICAgICAgIEF2Z1Bvb2wzRCwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLFxuICAgICAgICAgICAgICAgIGF0dHJzIGFzIHt9IGFzIE5hbWVkQXR0ck1hcCkgYXMgVDtcblxuICByZXMgPSBjYXN0KHJlcywgeDVELmR0eXBlKTtcblxuICBpZiAocmVzaGFwZWRUbzVEKSB7XG4gICAgcmV0dXJuIHJlc2hhcGUoXG4gICAgICAgICAgICAgICByZXMsIFtyZXMuc2hhcGVbMV0sIHJlcy5zaGFwZVsyXSwgcmVzLnNoYXBlWzNdLCByZXMuc2hhcGVbNF1dKSBhc1xuICAgICAgICBUO1xuICB9XG5cbiAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGNvbnN0IGF2Z1Bvb2wzZCA9IG9wKHthdmdQb29sM2RffSk7XG4iXX0=