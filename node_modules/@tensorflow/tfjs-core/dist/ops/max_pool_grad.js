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
import { MaxPoolGrad } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import * as conv_util from './conv_util';
import { op } from './operation';
/**
 * Computes the backprop of a 2D max pool.
 *
 * @param dy The dy error, of rank 4 or rank 3 of shape
 *     [batchSize, height, width, channels]. If rank 3, batch of 1 is
 * assumed.
 * @param input The original input image, of rank 4, of shape
 *     [batchSize, height, width, channels].
 * @param output The original output image, of rank 4, of shape
 *     [batchSize, outHeight, outWidth, channels].
 * @param filterSize The filter size: `[filterHeight, filterWidth]`. If
 *     `filterSize` is a single number, then `filterHeight == filterWidth`.
 * @param strides The strides of the pooling: `[strideHeight, strideWidth]`. If
 *     `strides` is a single number, then `strideHeight == strideWidth`.
 * @param pad The type of padding algorithm used in the forward prop of the op.
 *     'same', 'valid', for more info, see this guide:
 *     [https://www.tensorflow.org/api_docs/python/tf/nn/convolution](
 *          https://www.tensorflow.org/api_docs/python/tf/nn/convolution)
 * @param dimRoundingMode A string from: 'ceil', 'round', 'floor'. If none is
 *     provided, it will default to truncate.
 */
function maxPoolGrad_(dy, input, output, filterSize, strides, pad, dimRoundingMode) {
    const $dy = convertToTensor(dy, 'dy', 'maxPoolGrad');
    const $input = convertToTensor(input, 'input', 'maxPoolGrad');
    const $output = convertToTensor(output, 'output', 'maxPoolGrad');
    util.assert($input.rank === $dy.rank, () => `Rank of input (${$input.rank}) does not match rank of dy ` +
        `(${$dy.rank})`);
    util.assert($dy.rank === 4, () => `Error in maxPoolGrad: dy must be rank 4 but got rank ` +
        `${$dy.rank}.`);
    util.assert($input.rank === 4, () => `Error in maxPoolGrad: input must be rank 4 but got rank ` +
        `${$input.rank}.`);
    conv_util.checkPadOnDimRoundingMode('maxPoolGrad', pad, dimRoundingMode);
    const inputs = { dy: $dy, input: $input, output: $output };
    const attrs = { filterSize, strides, pad, dimRoundingMode };
    // tslint:disable-next-line: no-unnecessary-type-assertion
    return ENGINE.runKernel(MaxPoolGrad, inputs, attrs);
}
export const maxPoolGrad = op({ maxPoolGrad_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4X3Bvb2xfZ3JhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL21heF9wb29sX2dyYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsV0FBVyxFQUFzQyxNQUFNLGlCQUFpQixDQUFDO0FBSWpGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUVuRCxPQUFPLEtBQUssSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUVoQyxPQUFPLEtBQUssU0FBUyxNQUFNLGFBQWEsQ0FBQztBQUN6QyxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRS9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9CRztBQUNILFNBQVMsWUFBWSxDQUNqQixFQUF1QixFQUFFLEtBQTBCLEVBQ25ELE1BQTJCLEVBQUUsVUFBbUMsRUFDaEUsT0FBZ0MsRUFDaEMsR0FBb0QsRUFDcEQsZUFBd0M7SUFDMUMsTUFBTSxHQUFHLEdBQUcsZUFBZSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDckQsTUFBTSxNQUFNLEdBQUcsZUFBZSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDOUQsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFFakUsSUFBSSxDQUFDLE1BQU0sQ0FDUCxNQUFNLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEVBQ3hCLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixNQUFNLENBQUMsSUFBSSw4QkFBOEI7UUFDN0QsSUFBSSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUV6QixJQUFJLENBQUMsTUFBTSxDQUNQLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUNkLEdBQUcsRUFBRSxDQUFDLHVEQUF1RDtRQUN6RCxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLElBQUksQ0FBQyxNQUFNLENBQ1AsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQ2pCLEdBQUcsRUFBRSxDQUFDLDBEQUEwRDtRQUM1RCxHQUFHLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ3pFLE1BQU0sTUFBTSxHQUFzQixFQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFDLENBQUM7SUFDNUUsTUFBTSxLQUFLLEdBQXFCLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsZUFBZSxFQUFDLENBQUM7SUFFNUUsMERBQTBEO0lBQzFELE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FDWixXQUFXLEVBQUUsTUFBOEIsRUFDM0MsS0FBMkIsQ0FBYSxDQUFDO0FBQ3RELENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLEVBQUMsWUFBWSxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge01heFBvb2xHcmFkLCBNYXhQb29sR3JhZEF0dHJzLCBNYXhQb29sR3JhZElucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7TmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtUZW5zb3I0RH0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7TmFtZWRUZW5zb3JNYXB9IGZyb20gJy4uL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi91dGlsJztcblxuaW1wb3J0ICogYXMgY29udl91dGlsIGZyb20gJy4vY29udl91dGlsJztcbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgYmFja3Byb3Agb2YgYSAyRCBtYXggcG9vbC5cbiAqXG4gKiBAcGFyYW0gZHkgVGhlIGR5IGVycm9yLCBvZiByYW5rIDQgb3IgcmFuayAzIG9mIHNoYXBlXG4gKiAgICAgW2JhdGNoU2l6ZSwgaGVpZ2h0LCB3aWR0aCwgY2hhbm5lbHNdLiBJZiByYW5rIDMsIGJhdGNoIG9mIDEgaXNcbiAqIGFzc3VtZWQuXG4gKiBAcGFyYW0gaW5wdXQgVGhlIG9yaWdpbmFsIGlucHV0IGltYWdlLCBvZiByYW5rIDQsIG9mIHNoYXBlXG4gKiAgICAgW2JhdGNoU2l6ZSwgaGVpZ2h0LCB3aWR0aCwgY2hhbm5lbHNdLlxuICogQHBhcmFtIG91dHB1dCBUaGUgb3JpZ2luYWwgb3V0cHV0IGltYWdlLCBvZiByYW5rIDQsIG9mIHNoYXBlXG4gKiAgICAgW2JhdGNoU2l6ZSwgb3V0SGVpZ2h0LCBvdXRXaWR0aCwgY2hhbm5lbHNdLlxuICogQHBhcmFtIGZpbHRlclNpemUgVGhlIGZpbHRlciBzaXplOiBgW2ZpbHRlckhlaWdodCwgZmlsdGVyV2lkdGhdYC4gSWZcbiAqICAgICBgZmlsdGVyU2l6ZWAgaXMgYSBzaW5nbGUgbnVtYmVyLCB0aGVuIGBmaWx0ZXJIZWlnaHQgPT0gZmlsdGVyV2lkdGhgLlxuICogQHBhcmFtIHN0cmlkZXMgVGhlIHN0cmlkZXMgb2YgdGhlIHBvb2xpbmc6IGBbc3RyaWRlSGVpZ2h0LCBzdHJpZGVXaWR0aF1gLiBJZlxuICogICAgIGBzdHJpZGVzYCBpcyBhIHNpbmdsZSBudW1iZXIsIHRoZW4gYHN0cmlkZUhlaWdodCA9PSBzdHJpZGVXaWR0aGAuXG4gKiBAcGFyYW0gcGFkIFRoZSB0eXBlIG9mIHBhZGRpbmcgYWxnb3JpdGhtIHVzZWQgaW4gdGhlIGZvcndhcmQgcHJvcCBvZiB0aGUgb3AuXG4gKiAgICAgJ3NhbWUnLCAndmFsaWQnLCBmb3IgbW9yZSBpbmZvLCBzZWUgdGhpcyBndWlkZTpcbiAqICAgICBbaHR0cHM6Ly93d3cudGVuc29yZmxvdy5vcmcvYXBpX2RvY3MvcHl0aG9uL3RmL25uL2NvbnZvbHV0aW9uXShcbiAqICAgICAgICAgIGh0dHBzOi8vd3d3LnRlbnNvcmZsb3cub3JnL2FwaV9kb2NzL3B5dGhvbi90Zi9ubi9jb252b2x1dGlvbilcbiAqIEBwYXJhbSBkaW1Sb3VuZGluZ01vZGUgQSBzdHJpbmcgZnJvbTogJ2NlaWwnLCAncm91bmQnLCAnZmxvb3InLiBJZiBub25lIGlzXG4gKiAgICAgcHJvdmlkZWQsIGl0IHdpbGwgZGVmYXVsdCB0byB0cnVuY2F0ZS5cbiAqL1xuZnVuY3Rpb24gbWF4UG9vbEdyYWRfKFxuICAgIGR5OiBUZW5zb3I0RHxUZW5zb3JMaWtlLCBpbnB1dDogVGVuc29yNER8VGVuc29yTGlrZSxcbiAgICBvdXRwdXQ6IFRlbnNvcjREfFRlbnNvckxpa2UsIGZpbHRlclNpemU6IFtudW1iZXIsIG51bWJlcl18bnVtYmVyLFxuICAgIHN0cmlkZXM6IFtudW1iZXIsIG51bWJlcl18bnVtYmVyLFxuICAgIHBhZDogJ3ZhbGlkJ3wnc2FtZSd8bnVtYmVyfGNvbnZfdXRpbC5FeHBsaWNpdFBhZGRpbmcsXG4gICAgZGltUm91bmRpbmdNb2RlPzogJ2Zsb29yJ3wncm91bmQnfCdjZWlsJyk6IFRlbnNvcjREIHtcbiAgY29uc3QgJGR5ID0gY29udmVydFRvVGVuc29yKGR5LCAnZHknLCAnbWF4UG9vbEdyYWQnKTtcbiAgY29uc3QgJGlucHV0ID0gY29udmVydFRvVGVuc29yKGlucHV0LCAnaW5wdXQnLCAnbWF4UG9vbEdyYWQnKTtcbiAgY29uc3QgJG91dHB1dCA9IGNvbnZlcnRUb1RlbnNvcihvdXRwdXQsICdvdXRwdXQnLCAnbWF4UG9vbEdyYWQnKTtcblxuICB1dGlsLmFzc2VydChcbiAgICAgICRpbnB1dC5yYW5rID09PSAkZHkucmFuayxcbiAgICAgICgpID0+IGBSYW5rIG9mIGlucHV0ICgkeyRpbnB1dC5yYW5rfSkgZG9lcyBub3QgbWF0Y2ggcmFuayBvZiBkeSBgICtcbiAgICAgICAgICBgKCR7JGR5LnJhbmt9KWApO1xuXG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgJGR5LnJhbmsgPT09IDQsXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gbWF4UG9vbEdyYWQ6IGR5IG11c3QgYmUgcmFuayA0IGJ1dCBnb3QgcmFuayBgICtcbiAgICAgICAgICBgJHskZHkucmFua30uYCk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgJGlucHV0LnJhbmsgPT09IDQsXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gbWF4UG9vbEdyYWQ6IGlucHV0IG11c3QgYmUgcmFuayA0IGJ1dCBnb3QgcmFuayBgICtcbiAgICAgICAgICBgJHskaW5wdXQucmFua30uYCk7XG4gIGNvbnZfdXRpbC5jaGVja1BhZE9uRGltUm91bmRpbmdNb2RlKCdtYXhQb29sR3JhZCcsIHBhZCwgZGltUm91bmRpbmdNb2RlKTtcbiAgY29uc3QgaW5wdXRzOiBNYXhQb29sR3JhZElucHV0cyA9IHtkeTogJGR5LCBpbnB1dDogJGlucHV0LCBvdXRwdXQ6ICRvdXRwdXR9O1xuICBjb25zdCBhdHRyczogTWF4UG9vbEdyYWRBdHRycyA9IHtmaWx0ZXJTaXplLCBzdHJpZGVzLCBwYWQsIGRpbVJvdW5kaW5nTW9kZX07XG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby11bm5lY2Vzc2FyeS10eXBlLWFzc2VydGlvblxuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChcbiAgICAgICAgICAgICBNYXhQb29sR3JhZCwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLFxuICAgICAgICAgICAgIGF0dHJzIGFzIHt9IGFzIE5hbWVkQXR0ck1hcCkgYXMgVGVuc29yNEQ7XG59XG5cbmV4cG9ydCBjb25zdCBtYXhQb29sR3JhZCA9IG9wKHttYXhQb29sR3JhZF99KTtcbiJdfQ==