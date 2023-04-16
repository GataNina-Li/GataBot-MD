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
import { Conv2DBackpropFilter } from '../kernel_names';
import * as util from '../util';
import * as conv_util from './conv_util';
import { op } from './operation';
import { reshape } from './reshape';
/**
 * Computes the derivative of the filter of a 2D convolution.
 *
 * @param x The input tensor, of rank 4 or rank 3 of shape
 *     [batch, height, width, inChannels]. If rank 3, batch of 1 is assumed.
 * @param dy The dy image, of rank 4 or rank 3, of shape
 *     [batch, height, width, outDepth]. If rank 3, batch of 1 is assumed.
 * @param filterShape The shape of the filter, length 4,
 *     [filterHeight, filterWidth, inDepth, outDepth].
 * @param strides The strides of the convolution: [strideHeight,
 * strideWidth].
 * @param pad A string from: 'same', 'valid'. The type of padding algorithm
 *     used in the forward prop of the op.
 * @param dataFormat: An optional string from: "NHWC", "NCHW". Defaults to
 *     "NHWC". Specify the data format of the input and output data. With the
 *     default format "NHWC", the data is stored in the order of: [batch,
 *     height, width, channels].
 * @param dimRoundingMode A string from: 'ceil', 'round', 'floor'. If none is
 *     provided, it will default to truncate.
 */
function conv2DBackpropFilter_(x, dy, filterShape, strides, pad, dataFormat = 'NHWC', dimRoundingMode) {
    let x4D = x;
    if (x.rank === 3) {
        x4D = reshape(x, [1, x.shape[0], x.shape[1], x.shape[2]]);
    }
    let dy4D = dy;
    if (dy4D.rank === 3) {
        dy4D = reshape(dy, [1, dy.shape[0], dy.shape[1], dy.shape[2]]);
    }
    util.assert(x4D.rank === 4, () => `Error in conv2dDerFilter: input must be rank 4, but got shape ` +
        `${x4D.shape}.`);
    util.assert(dy4D.rank === 4, () => `Error in conv2dDerFilter: dy must be rank 4, but got shape ` +
        `${dy4D.shape}.`);
    util.assert(filterShape.length === 4, () => `Error in conv2dDerFilter: filterShape must be length 4, but got ` +
        `${filterShape}.`);
    const inDepth = dataFormat === 'NHWC' ? x4D.shape[3] : x4D.shape[1];
    const outDepth = dataFormat === 'NHWC' ? dy4D.shape[3] : dy4D.shape[1];
    util.assert(inDepth === filterShape[2], () => `Error in conv2dDerFilter: depth of input ${inDepth}) must ` +
        `match input depth in filter (${filterShape[2]}.`);
    util.assert(outDepth === filterShape[3], () => `Error in conv2dDerFilter: depth of dy (${outDepth}) must ` +
        `match output depth for filter (${filterShape[3]}).`);
    conv_util.checkPadOnDimRoundingMode('conv2dDerFilter', pad, dimRoundingMode);
    const inputs = { x: x4D, dy: dy4D };
    const attrs = { strides, pad, dataFormat, dimRoundingMode, filterShape };
    // tslint:disable-next-line: no-unnecessary-type-assertion
    return ENGINE.runKernel(Conv2DBackpropFilter, inputs, attrs);
}
export const conv2DBackpropFilter = op({ conv2DBackpropFilter_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udjJkX2JhY2twcm9wX2ZpbHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2NvbnYyZF9iYWNrcHJvcF9maWx0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsb0JBQW9CLEVBQXdELE1BQU0saUJBQWlCLENBQUM7QUFJNUcsT0FBTyxLQUFLLElBQUksTUFBTSxTQUFTLENBQUM7QUFFaEMsT0FBTyxLQUFLLFNBQVMsTUFBTSxhQUFhLENBQUM7QUFDekMsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMvQixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBRWxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUJHO0FBQ0gsU0FBUyxxQkFBcUIsQ0FDMUIsQ0FBSSxFQUFFLEVBQUssRUFBRSxXQUE2QyxFQUMxRCxPQUFnQyxFQUNoQyxHQUFvRCxFQUNwRCxhQUE0QixNQUFNLEVBQ2xDLGVBQXdDO0lBQzFDLElBQUksR0FBRyxHQUFHLENBQWEsQ0FBQztJQUN4QixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO1FBQ2hCLEdBQUcsR0FBRyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMzRDtJQUNELElBQUksSUFBSSxHQUFHLEVBQWMsQ0FBQztJQUMxQixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO1FBQ25CLElBQUksR0FBRyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoRTtJQUNELElBQUksQ0FBQyxNQUFNLENBQ1AsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQ2QsR0FBRyxFQUFFLENBQUMsZ0VBQWdFO1FBQ2xFLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDekIsSUFBSSxDQUFDLE1BQU0sQ0FDUCxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsRUFDZixHQUFHLEVBQUUsQ0FBQyw2REFBNkQ7UUFDL0QsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztJQUMxQixJQUFJLENBQUMsTUFBTSxDQUNQLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUN4QixHQUFHLEVBQUUsQ0FBQyxrRUFBa0U7UUFDcEUsR0FBRyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLE1BQU0sT0FBTyxHQUFHLFVBQVUsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEUsTUFBTSxRQUFRLEdBQUcsVUFBVSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RSxJQUFJLENBQUMsTUFBTSxDQUNQLE9BQU8sS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQzFCLEdBQUcsRUFBRSxDQUFDLDRDQUE0QyxPQUFPLFNBQVM7UUFDOUQsZ0NBQWdDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDM0QsSUFBSSxDQUFDLE1BQU0sQ0FDUCxRQUFRLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUMzQixHQUFHLEVBQUUsQ0FBQywwQ0FBMEMsUUFBUSxTQUFTO1FBQzdELGtDQUFrQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlELFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDN0UsTUFBTSxNQUFNLEdBQStCLEVBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFDLENBQUM7SUFDOUQsTUFBTSxLQUFLLEdBQ1AsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsV0FBVyxFQUFDLENBQUM7SUFFN0QsMERBQTBEO0lBQzFELE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FDWixvQkFBb0IsRUFBRSxNQUE4QixFQUNwRCxLQUEyQixDQUFhLENBQUM7QUFDdEQsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLG9CQUFvQixHQUFHLEVBQUUsQ0FBQyxFQUFDLHFCQUFxQixFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtDb252MkRCYWNrcHJvcEZpbHRlciwgQ29udjJEQmFja3Byb3BGaWx0ZXJBdHRycywgQ29udjJEQmFja3Byb3BGaWx0ZXJJbnB1dHN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge05hbWVkQXR0ck1hcH0gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7VGVuc29yM0QsIFRlbnNvcjREfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCAqIGFzIGNvbnZfdXRpbCBmcm9tICcuL2NvbnZfdXRpbCc7XG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5pbXBvcnQge3Jlc2hhcGV9IGZyb20gJy4vcmVzaGFwZSc7XG5cbi8qKlxuICogQ29tcHV0ZXMgdGhlIGRlcml2YXRpdmUgb2YgdGhlIGZpbHRlciBvZiBhIDJEIGNvbnZvbHV0aW9uLlxuICpcbiAqIEBwYXJhbSB4IFRoZSBpbnB1dCB0ZW5zb3IsIG9mIHJhbmsgNCBvciByYW5rIDMgb2Ygc2hhcGVcbiAqICAgICBbYmF0Y2gsIGhlaWdodCwgd2lkdGgsIGluQ2hhbm5lbHNdLiBJZiByYW5rIDMsIGJhdGNoIG9mIDEgaXMgYXNzdW1lZC5cbiAqIEBwYXJhbSBkeSBUaGUgZHkgaW1hZ2UsIG9mIHJhbmsgNCBvciByYW5rIDMsIG9mIHNoYXBlXG4gKiAgICAgW2JhdGNoLCBoZWlnaHQsIHdpZHRoLCBvdXREZXB0aF0uIElmIHJhbmsgMywgYmF0Y2ggb2YgMSBpcyBhc3N1bWVkLlxuICogQHBhcmFtIGZpbHRlclNoYXBlIFRoZSBzaGFwZSBvZiB0aGUgZmlsdGVyLCBsZW5ndGggNCxcbiAqICAgICBbZmlsdGVySGVpZ2h0LCBmaWx0ZXJXaWR0aCwgaW5EZXB0aCwgb3V0RGVwdGhdLlxuICogQHBhcmFtIHN0cmlkZXMgVGhlIHN0cmlkZXMgb2YgdGhlIGNvbnZvbHV0aW9uOiBbc3RyaWRlSGVpZ2h0LFxuICogc3RyaWRlV2lkdGhdLlxuICogQHBhcmFtIHBhZCBBIHN0cmluZyBmcm9tOiAnc2FtZScsICd2YWxpZCcuIFRoZSB0eXBlIG9mIHBhZGRpbmcgYWxnb3JpdGhtXG4gKiAgICAgdXNlZCBpbiB0aGUgZm9yd2FyZCBwcm9wIG9mIHRoZSBvcC5cbiAqIEBwYXJhbSBkYXRhRm9ybWF0OiBBbiBvcHRpb25hbCBzdHJpbmcgZnJvbTogXCJOSFdDXCIsIFwiTkNIV1wiLiBEZWZhdWx0cyB0b1xuICogICAgIFwiTkhXQ1wiLiBTcGVjaWZ5IHRoZSBkYXRhIGZvcm1hdCBvZiB0aGUgaW5wdXQgYW5kIG91dHB1dCBkYXRhLiBXaXRoIHRoZVxuICogICAgIGRlZmF1bHQgZm9ybWF0IFwiTkhXQ1wiLCB0aGUgZGF0YSBpcyBzdG9yZWQgaW4gdGhlIG9yZGVyIG9mOiBbYmF0Y2gsXG4gKiAgICAgaGVpZ2h0LCB3aWR0aCwgY2hhbm5lbHNdLlxuICogQHBhcmFtIGRpbVJvdW5kaW5nTW9kZSBBIHN0cmluZyBmcm9tOiAnY2VpbCcsICdyb3VuZCcsICdmbG9vcicuIElmIG5vbmUgaXNcbiAqICAgICBwcm92aWRlZCwgaXQgd2lsbCBkZWZhdWx0IHRvIHRydW5jYXRlLlxuICovXG5mdW5jdGlvbiBjb252MkRCYWNrcHJvcEZpbHRlcl88VCBleHRlbmRzIFRlbnNvcjNEfFRlbnNvcjREPihcbiAgICB4OiBULCBkeTogVCwgZmlsdGVyU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdLFxuICAgIHN0cmlkZXM6IFtudW1iZXIsIG51bWJlcl18bnVtYmVyLFxuICAgIHBhZDogJ3ZhbGlkJ3wnc2FtZSd8bnVtYmVyfGNvbnZfdXRpbC5FeHBsaWNpdFBhZGRpbmcsXG4gICAgZGF0YUZvcm1hdDogJ05IV0MnfCdOQ0hXJyA9ICdOSFdDJyxcbiAgICBkaW1Sb3VuZGluZ01vZGU/OiAnZmxvb3InfCdyb3VuZCd8J2NlaWwnKTogVGVuc29yNEQge1xuICBsZXQgeDREID0geCBhcyBUZW5zb3I0RDtcbiAgaWYgKHgucmFuayA9PT0gMykge1xuICAgIHg0RCA9IHJlc2hhcGUoeCwgWzEsIHguc2hhcGVbMF0sIHguc2hhcGVbMV0sIHguc2hhcGVbMl1dKTtcbiAgfVxuICBsZXQgZHk0RCA9IGR5IGFzIFRlbnNvcjREO1xuICBpZiAoZHk0RC5yYW5rID09PSAzKSB7XG4gICAgZHk0RCA9IHJlc2hhcGUoZHksIFsxLCBkeS5zaGFwZVswXSwgZHkuc2hhcGVbMV0sIGR5LnNoYXBlWzJdXSk7XG4gIH1cbiAgdXRpbC5hc3NlcnQoXG4gICAgICB4NEQucmFuayA9PT0gNCxcbiAgICAgICgpID0+IGBFcnJvciBpbiBjb252MmREZXJGaWx0ZXI6IGlucHV0IG11c3QgYmUgcmFuayA0LCBidXQgZ290IHNoYXBlIGAgK1xuICAgICAgICAgIGAke3g0RC5zaGFwZX0uYCk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgZHk0RC5yYW5rID09PSA0LFxuICAgICAgKCkgPT4gYEVycm9yIGluIGNvbnYyZERlckZpbHRlcjogZHkgbXVzdCBiZSByYW5rIDQsIGJ1dCBnb3Qgc2hhcGUgYCArXG4gICAgICAgICAgYCR7ZHk0RC5zaGFwZX0uYCk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgZmlsdGVyU2hhcGUubGVuZ3RoID09PSA0LFxuICAgICAgKCkgPT4gYEVycm9yIGluIGNvbnYyZERlckZpbHRlcjogZmlsdGVyU2hhcGUgbXVzdCBiZSBsZW5ndGggNCwgYnV0IGdvdCBgICtcbiAgICAgICAgICBgJHtmaWx0ZXJTaGFwZX0uYCk7XG4gIGNvbnN0IGluRGVwdGggPSBkYXRhRm9ybWF0ID09PSAnTkhXQycgPyB4NEQuc2hhcGVbM10gOiB4NEQuc2hhcGVbMV07XG4gIGNvbnN0IG91dERlcHRoID0gZGF0YUZvcm1hdCA9PT0gJ05IV0MnID8gZHk0RC5zaGFwZVszXSA6IGR5NEQuc2hhcGVbMV07XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgaW5EZXB0aCA9PT0gZmlsdGVyU2hhcGVbMl0sXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gY29udjJkRGVyRmlsdGVyOiBkZXB0aCBvZiBpbnB1dCAke2luRGVwdGh9KSBtdXN0IGAgK1xuICAgICAgICAgIGBtYXRjaCBpbnB1dCBkZXB0aCBpbiBmaWx0ZXIgKCR7ZmlsdGVyU2hhcGVbMl19LmApO1xuICB1dGlsLmFzc2VydChcbiAgICAgIG91dERlcHRoID09PSBmaWx0ZXJTaGFwZVszXSxcbiAgICAgICgpID0+IGBFcnJvciBpbiBjb252MmREZXJGaWx0ZXI6IGRlcHRoIG9mIGR5ICgke291dERlcHRofSkgbXVzdCBgICtcbiAgICAgICAgICBgbWF0Y2ggb3V0cHV0IGRlcHRoIGZvciBmaWx0ZXIgKCR7ZmlsdGVyU2hhcGVbM119KS5gKTtcbiAgY29udl91dGlsLmNoZWNrUGFkT25EaW1Sb3VuZGluZ01vZGUoJ2NvbnYyZERlckZpbHRlcicsIHBhZCwgZGltUm91bmRpbmdNb2RlKTtcbiAgY29uc3QgaW5wdXRzOiBDb252MkRCYWNrcHJvcEZpbHRlcklucHV0cyA9IHt4OiB4NEQsIGR5OiBkeTREfTtcbiAgY29uc3QgYXR0cnM6IENvbnYyREJhY2twcm9wRmlsdGVyQXR0cnMgPVxuICAgICAge3N0cmlkZXMsIHBhZCwgZGF0YUZvcm1hdCwgZGltUm91bmRpbmdNb2RlLCBmaWx0ZXJTaGFwZX07XG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby11bm5lY2Vzc2FyeS10eXBlLWFzc2VydGlvblxuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChcbiAgICAgICAgICAgICBDb252MkRCYWNrcHJvcEZpbHRlciwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLFxuICAgICAgICAgICAgIGF0dHJzIGFzIHt9IGFzIE5hbWVkQXR0ck1hcCkgYXMgVGVuc29yNEQ7XG59XG5cbmV4cG9ydCBjb25zdCBjb252MkRCYWNrcHJvcEZpbHRlciA9IG9wKHtjb252MkRCYWNrcHJvcEZpbHRlcl99KTtcbiJdfQ==