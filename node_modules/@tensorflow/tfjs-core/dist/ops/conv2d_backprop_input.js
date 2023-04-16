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
import { Conv2DBackpropInput } from '../kernel_names';
import * as util from '../util';
import * as conv_util from './conv_util';
import { op } from './operation';
import { reshape } from './reshape';
/**
 * Computes the derivative of the input of a 2D convolution.
 *
 * @param xShape The shape of the input: [batch, height, width, inDepth].
 * If length of 3, batch of 1 is assumed.
 * @param dy The derivative of the output, of rank 4 or rank 3 of shape
 *   `[batch, outHeight, outWidth, outDepth]`. If rank 3, batch of 1 is
 * assumed.
 * @param filter The filter, rank 4, of shape
 *     `[filterHeight, filterWidth, inDepth, outDepth]`.
 * @param strides The strides of the convolution: `[strideHeight,
 * strideWidth]`.
 * @param pad The type of padding algorithm used:
 *    - `same` and stride 1: output will be of same size as input,
 *       regardless of filter size.
 *    - `valid`: output will be smaller than input if filter is larger
 *       than 1x1.
 * @param dataFormat: An optional string from: "NHWC", "NCHW". Defaults to
 *     "NHWC". Specify the data format of the input and output data. With the
 *     default format "NHWC", the data is stored in the order of: [batch,
 *     height, width, channels].
 * @param dimRoundingMode A string from: 'ceil', 'round', 'floor'. If none is
 *     provided, it will default to truncate.
 */
function conv2DBackpropInput_(xShape, dy, filter, strides, pad, dataFormat = 'NHWC', dimRoundingMode) {
    util.assert(xShape.length === dy.rank, () => `Length of inShape ` +
        `(${xShape.length}) and rank of dy (${dy.rank}) must match`);
    let xShape4D = xShape;
    let dy4D = dy;
    let reshapedTo4D = false;
    if (dy.rank === 3) {
        reshapedTo4D = true;
        dy4D = reshape(dy, [1, dy.shape[0], dy.shape[1], dy.shape[2]]);
        xShape4D = [1, xShape[0], xShape[1], xShape[2]];
    }
    util.assert(xShape4D.length === 4, () => `Error in conv2dDerInput: inShape must be length 4, but got length ` +
        `${xShape4D.length}.`);
    util.assert(dy4D.rank === 4, () => `Error in conv2dDerInput: dy must be rank 4, but got ` +
        `rank ${dy4D.rank}`);
    util.assert(filter.rank === 4, () => `Error in conv2dDerInput: filter must be rank 4, but got ` +
        `rank ${filter.rank}`);
    const inDepth = dataFormat === 'NHWC' ? xShape4D[3] : xShape4D[1];
    const outDepth = dataFormat === 'NHWC' ? dy4D.shape[3] : dy4D.shape[1];
    util.assert(inDepth === filter.shape[2], () => `Error in conv2dDerInput: depth of input (${inDepth}) must ` +
        `match input depth for filter ${filter.shape[2]}.`);
    util.assert(outDepth === filter.shape[3], () => `Error in conv2dDerInput: depth of output (${outDepth}) must ` +
        `match output depth for filter ${filter.shape[3]}.`);
    conv_util.checkPadOnDimRoundingMode('conv2dDerInput', pad, dimRoundingMode);
    const inputs = { dy: dy4D, filter };
    const attrs = { strides, pad, dataFormat, dimRoundingMode, inputShape: xShape4D };
    // tslint:disable-next-line: no-unnecessary-type-assertion
    const res = ENGINE.runKernel(Conv2DBackpropInput, inputs, attrs);
    if (reshapedTo4D) {
        return reshape(res, [res.shape[1], res.shape[2], res.shape[3]]);
    }
    return res;
}
export const conv2DBackpropInput = op({ conv2DBackpropInput_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udjJkX2JhY2twcm9wX2lucHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvY29udjJkX2JhY2twcm9wX2lucHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLG1CQUFtQixFQUFzRCxNQUFNLGlCQUFpQixDQUFDO0FBSXpHLE9BQU8sS0FBSyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBRWhDLE9BQU8sS0FBSyxTQUFTLE1BQU0sYUFBYSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDL0IsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUVsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Qkc7QUFDSCxTQUFTLG9CQUFvQixDQUN6QixNQUFpRSxFQUFFLEVBQUssRUFDeEUsTUFBZ0IsRUFBRSxPQUFnQyxFQUNsRCxHQUFvRCxFQUNwRCxhQUE0QixNQUFNLEVBQ2xDLGVBQXdDO0lBQzFDLElBQUksQ0FBQyxNQUFNLENBQ1AsTUFBTSxDQUFDLE1BQU0sS0FBSyxFQUFFLENBQUMsSUFBSSxFQUN6QixHQUFHLEVBQUUsQ0FBQyxvQkFBb0I7UUFDdEIsSUFBSSxNQUFNLENBQUMsTUFBTSxxQkFBcUIsRUFBRSxDQUFDLElBQUksY0FBYyxDQUFDLENBQUM7SUFFckUsSUFBSSxRQUFRLEdBQUcsTUFBMEMsQ0FBQztJQUMxRCxJQUFJLElBQUksR0FBRyxFQUFjLENBQUM7SUFDMUIsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO0lBQ3pCLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7UUFDakIsWUFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixJQUFJLEdBQUcsT0FBTyxDQUFD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bGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge0NvbnYyREJhY2twcm9wSW5wdXQsIENvbnYyREJhY2twcm9wSW5wdXRBdHRycywgQ29udjJEQmFja3Byb3BJbnB1dElucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7TmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtUZW5zb3IzRCwgVGVuc29yNER9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi91dGlsJztcblxuaW1wb3J0ICogYXMgY29udl91dGlsIGZyb20gJy4vY29udl91dGlsJztcbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcbmltcG9ydCB7cmVzaGFwZX0gZnJvbSAnLi9yZXNoYXBlJztcblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgZGVyaXZhdGl2ZSBvZiB0aGUgaW5wdXQgb2YgYSAyRCBjb252b2x1dGlvbi5cbiAqXG4gKiBAcGFyYW0geFNoYXBlIFRoZSBzaGFwZSBvZiB0aGUgaW5wdXQ6IFtiYXRjaCwgaGVpZ2h0LCB3aWR0aCwgaW5EZXB0aF0uXG4gKiBJZiBsZW5ndGggb2YgMywgYmF0Y2ggb2YgMSBpcyBhc3N1bWVkLlxuICogQHBhcmFtIGR5IFRoZSBkZXJpdmF0aXZlIG9mIHRoZSBvdXRwdXQsIG9mIHJhbmsgNCBvciByYW5rIDMgb2Ygc2hhcGVcbiAqICAgYFtiYXRjaCwgb3V0SGVpZ2h0LCBvdXRXaWR0aCwgb3V0RGVwdGhdYC4gSWYgcmFuayAzLCBiYXRjaCBvZiAxIGlzXG4gKiBhc3N1bWVkLlxuICogQHBhcmFtIGZpbHRlciBUaGUgZmlsdGVyLCByYW5rIDQsIG9mIHNoYXBlXG4gKiAgICAgYFtmaWx0ZXJIZWlnaHQsIGZpbHRlcldpZHRoLCBpbkRlcHRoLCBvdXREZXB0aF1gLlxuICogQHBhcmFtIHN0cmlkZXMgVGhlIHN0cmlkZXMgb2YgdGhlIGNvbnZvbHV0aW9uOiBgW3N0cmlkZUhlaWdodCxcbiAqIHN0cmlkZVdpZHRoXWAuXG4gKiBAcGFyYW0gcGFkIFRoZSB0eXBlIG9mIHBhZGRpbmcgYWxnb3JpdGhtIHVzZWQ6XG4gKiAgICAtIGBzYW1lYCBhbmQgc3RyaWRlIDE6IG91dHB1dCB3aWxsIGJlIG9mIHNhbWUgc2l6ZSBhcyBpbnB1dCxcbiAqICAgICAgIHJlZ2FyZGxlc3Mgb2YgZmlsdGVyIHNpemUuXG4gKiAgICAtIGB2YWxpZGA6IG91dHB1dCB3aWxsIGJlIHNtYWxsZXIgdGhhbiBpbnB1dCBpZiBmaWx0ZXIgaXMgbGFyZ2VyXG4gKiAgICAgICB0aGFuIDF4MS5cbiAqIEBwYXJhbSBkYXRhRm9ybWF0OiBBbiBvcHRpb25hbCBzdHJpbmcgZnJvbTogXCJOSFdDXCIsIFwiTkNIV1wiLiBEZWZhdWx0cyB0b1xuICogICAgIFwiTkhXQ1wiLiBTcGVjaWZ5IHRoZSBkYXRhIGZvcm1hdCBvZiB0aGUgaW5wdXQgYW5kIG91dHB1dCBkYXRhLiBXaXRoIHRoZVxuICogICAgIGRlZmF1bHQgZm9ybWF0IFwiTkhXQ1wiLCB0aGUgZGF0YSBpcyBzdG9yZWQgaW4gdGhlIG9yZGVyIG9mOiBbYmF0Y2gsXG4gKiAgICAgaGVpZ2h0LCB3aWR0aCwgY2hhbm5lbHNdLlxuICogQHBhcmFtIGRpbVJvdW5kaW5nTW9kZSBBIHN0cmluZyBmcm9tOiAnY2VpbCcsICdyb3VuZCcsICdmbG9vcicuIElmIG5vbmUgaXNcbiAqICAgICBwcm92aWRlZCwgaXQgd2lsbCBkZWZhdWx0IHRvIHRydW5jYXRlLlxuICovXG5mdW5jdGlvbiBjb252MkRCYWNrcHJvcElucHV0XzxUIGV4dGVuZHMgVGVuc29yM0R8VGVuc29yNEQ+KFxuICAgIHhTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl18W251bWJlciwgbnVtYmVyLCBudW1iZXJdLCBkeTogVCxcbiAgICBmaWx0ZXI6IFRlbnNvcjRELCBzdHJpZGVzOiBbbnVtYmVyLCBudW1iZXJdfG51bWJlcixcbiAgICBwYWQ6ICd2YWxpZCd8J3NhbWUnfG51bWJlcnxjb252X3V0aWwuRXhwbGljaXRQYWRkaW5nLFxuICAgIGRhdGFGb3JtYXQ6ICdOSFdDJ3wnTkNIVycgPSAnTkhXQycsXG4gICAgZGltUm91bmRpbmdNb2RlPzogJ2Zsb29yJ3wncm91bmQnfCdjZWlsJyk6IFQge1xuICB1dGlsLmFzc2VydChcbiAgICAgIHhTaGFwZS5sZW5ndGggPT09IGR5LnJhbmssXG4gICAgICAoKSA9PiBgTGVuZ3RoIG9mIGluU2hhcGUgYCArXG4gICAgICAgICAgYCgke3hTaGFwZS5sZW5ndGh9KSBhbmQgcmFuayBvZiBkeSAoJHtkeS5yYW5rfSkgbXVzdCBtYXRjaGApO1xuXG4gIGxldCB4U2hhcGU0RCA9IHhTaGFwZSBhcyBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcbiAgbGV0IGR5NEQgPSBkeSBhcyBUZW5zb3I0RDtcbiAgbGV0IHJlc2hhcGVkVG80RCA9IGZhbHNlO1xuICBpZiAoZHkucmFuayA9PT0gMykge1xuICAgIHJlc2hhcGVkVG80RCA9IHRydWU7XG4gICAgZHk0RCA9IHJlc2hhcGUoZHksIFsxLCBkeS5zaGFwZVswXSwgZHkuc2hhcGVbMV0sIGR5LnNoYXBlWzJdXSk7XG4gICAgeFNoYXBlNEQgPSBbMSwgeFNoYXBlWzBdLCB4U2hhcGVbMV0sIHhTaGFwZVsyXV07XG4gIH1cblxuICB1dGlsLmFzc2VydChcbiAgICAgIHhTaGFwZTRELmxlbmd0aCA9PT0gNCxcbiAgICAgICgpID0+XG4gICAgICAgICAgYEVycm9yIGluIGNvbnYyZERlcklucHV0OiBpblNoYXBlIG11c3QgYmUgbGVuZ3RoIDQsIGJ1dCBnb3QgbGVuZ3RoIGAgK1xuICAgICAgICAgIGAke3hTaGFwZTRELmxlbmd0aH0uYCk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgZHk0RC5yYW5rID09PSA0LFxuICAgICAgKCkgPT4gYEVycm9yIGluIGNvbnYyZERlcklucHV0OiBkeSBtdXN0IGJlIHJhbmsgNCwgYnV0IGdvdCBgICtcbiAgICAgICAgICBgcmFuayAke2R5NEQucmFua31gKTtcbiAgdXRpbC5hc3NlcnQoXG4gICAgICBmaWx0ZXIucmFuayA9PT0gNCxcbiAgICAgICgpID0+IGBFcnJvciBpbiBjb252MmREZXJJbnB1dDogZmlsdGVyIG11c3QgYmUgcmFuayA0LCBidXQgZ290IGAgK1xuICAgICAgICAgIGByYW5rICR7ZmlsdGVyLnJhbmt9YCk7XG4gIGNvbnN0IGluRGVwdGggPSBkYXRhRm9ybWF0ID09PSAnTkhXQycgPyB4U2hhcGU0RFszXSA6IHhTaGFwZTREWzFdO1xuICBjb25zdCBvdXREZXB0aCA9IGRhdGFGb3JtYXQgPT09ICdOSFdDJyA/IGR5NEQuc2hhcGVbM10gOiBkeTRELnNoYXBlWzFdO1xuICB1dGlsLmFzc2VydChcbiAgICAgIGluRGVwdGggPT09IGZpbHRlci5zaGFwZVsyXSxcbiAgICAgICgpID0+IGBFcnJvciBpbiBjb252MmREZXJJbnB1dDogZGVwdGggb2YgaW5wdXQgKCR7aW5EZXB0aH0pIG11c3QgYCArXG4gICAgICAgICAgYG1hdGNoIGlucHV0IGRlcHRoIGZvciBmaWx0ZXIgJHtmaWx0ZXIuc2hhcGVbMl19LmApO1xuICB1dGlsLmFzc2VydChcbiAgICAgIG91dERlcHRoID09PSBmaWx0ZXIuc2hhcGVbM10sXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gY29udjJkRGVySW5wdXQ6IGRlcHRoIG9mIG91dHB1dCAoJHtvdXREZXB0aH0pIG11c3QgYCArXG4gICAgICAgICAgYG1hdGNoIG91dHB1dCBkZXB0aCBmb3IgZmlsdGVyICR7ZmlsdGVyLnNoYXBlWzNdfS5gKTtcbiAgY29udl91dGlsLmNoZWNrUGFkT25EaW1Sb3VuZGluZ01vZGUoJ2NvbnYyZERlcklucHV0JywgcGFkLCBkaW1Sb3VuZGluZ01vZGUpO1xuICBjb25zdCBpbnB1dHM6IENvbnYyREJhY2twcm9wSW5wdXRJbnB1dHMgPSB7ZHk6IGR5NEQsIGZpbHRlcn07XG4gIGNvbnN0IGF0dHJzOiBDb252MkRCYWNrcHJvcElucHV0QXR0cnMgPVxuICAgICAge3N0cmlkZXMsIHBhZCwgZGF0YUZvcm1hdCwgZGltUm91bmRpbmdNb2RlLCBpbnB1dFNoYXBlOiB4U2hhcGU0RH07XG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby11bm5lY2Vzc2FyeS10eXBlLWFzc2VydGlvblxuICBjb25zdCByZXMgPSBFTkdJTkUucnVuS2VybmVsKFxuICAgICAgICAgICAgICAgICAgQ29udjJEQmFja3Byb3BJbnB1dCwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLFxuICAgICAgICAgICAgICAgICAgYXR0cnMgYXMge30gYXMgTmFtZWRBdHRyTWFwKSBhcyBUO1xuXG4gIGlmIChyZXNoYXBlZFRvNEQpIHtcbiAgICByZXR1cm4gcmVzaGFwZShyZXMsIFtyZXMuc2hhcGVbMV0sIHJlcy5zaGFwZVsyXSwgcmVzLnNoYXBlWzNdXSkgYXMgVDtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuXG5leHBvcnQgY29uc3QgY29udjJEQmFja3Byb3BJbnB1dCA9IG9wKHtjb252MkRCYWNrcHJvcElucHV0X30pO1xuIl19