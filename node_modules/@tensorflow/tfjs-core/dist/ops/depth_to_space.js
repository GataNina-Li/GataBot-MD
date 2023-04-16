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
import { DepthToSpace } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { op } from './operation';
/**
 * Rearranges data from depth into blocks of spatial data. More specifically,
 * this op outputs a copy of the input tensor where values from the `depth`
 * dimension are moved in spatial blocks to the `height` and `width` dimensions.
 * The attr `blockSize` indicates the input block size and how the data is
 * moved.
 *
 *  - Chunks of data of size `blockSize * blockSize` from depth are rearranged
 * into non-overlapping blocks of size `blockSize x blockSize`
 *
 *  - The width the output tensor is `inputWidth * blockSize`, whereas the
 * height is `inputHeight * blockSize`
 *
 *  - The Y, X coordinates within each block of the output image are determined
 * by the high order component of the input channel index
 *
 *  - The depth of the input tensor must be divisible by `blockSize *
 * blockSize`
 *
 * The `dataFormat` attr specifies the layout of the input and output tensors
 * with the following options: "NHWC": [ `batch, height, width, channels` ]
 * "NCHW": [ `batch, channels, height, width` ]
 *
 * ```js
 * const x = tf.tensor4d([1, 2, 3, 4], [1, 1, 1, 4]);
 * const blockSize = 2;
 * const dataFormat = "NHWC";
 *
 * tf.depthToSpace(x, blockSize, dataFormat).print();
 * ```
 *
 * @param x The input tensor of rank 4
 * @param blockSIze  An `int` that is `>= 2`. The size of the spatial block
 * @param dataFormat An optional string from: "NHWC", "NCHW". Defaults to "NHWC"
 *
 * @doc {heading: 'Tensors', subheading: 'Transformations'}
 */
function depthToSpace_(x, blockSize, dataFormat = 'NHWC') {
    const $x = convertToTensor(x, 'x', 'depthToSpace', 'float32');
    const inputHeight = (dataFormat === 'NHWC') ? $x.shape[1] : $x.shape[2];
    const inputWidth = (dataFormat === 'NHWC') ? $x.shape[2] : $x.shape[3];
    const inputDepth = (dataFormat === 'NHWC') ? $x.shape[3] : $x.shape[1];
    util.assert(blockSize > 1, () => `blockSize should be > 1 for depthToSpace, but was: ${blockSize}`);
    util.assert(inputHeight * blockSize >= 0, () => `Negative dimension size caused by overflow when multiplying
    ${inputHeight} and ${blockSize}  for depthToSpace with input shape
    ${$x.shape}`);
    util.assert(inputWidth * blockSize >= 0, () => `Negative dimension size caused by overflow when multiplying
    ${inputWidth} and ${blockSize} for depthToSpace with input shape
        ${$x.shape}`);
    util.assert((inputDepth % (blockSize * blockSize) === 0), () => `Dimension size must be evenly divisible by ${blockSize * blockSize} but is ${inputDepth} for depthToSpace with input shape ${$x.shape}`);
    const inputs = { x: $x };
    const attrs = { blockSize, dataFormat };
    return ENGINE.runKernel(DepthToSpace, inputs, attrs);
}
export const depthToSpace = op({ depthToSpace_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwdGhfdG9fc3BhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9kZXB0aF90b19zcGFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxZQUFZLEVBQXdDLE1BQU0saUJBQWlCLENBQUM7QUFJcEYsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE9BQU8sS0FBSyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBRWhDLE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFL0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9DRztBQUNILFNBQVMsYUFBYSxDQUNsQixDQUF3QixFQUFFLFNBQWlCLEVBQzNDLGFBQTRCLE1BQU07SUFDcEMsTUFBTSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsY0FBYyxFQUFFLFNBQVMsQ0FBYSxDQUFDO0lBRTFFLE1BQU0sV0FBVyxHQUFHLENBQUMsVUFBVSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLE1BQU0sVUFBVSxHQUFHLENBQUMsVUFBVSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZFLE1BQU0sVUFBVSxHQUFHLENBQUMsVUFBVSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXZFLElBQUksQ0FBQyxNQUFNLENBQ1AsU0FBUyxHQUFHLENBQUMsRUFDYixHQUFHLEVBQUUsQ0FBQyxzREFBc0QsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUU3RSxJQUFJLENBQUMsTUFBTSxDQUNQLFdBQVcsR0FBRyxTQUFTLElBQUksQ0FBQyxFQUM1QixHQUFHLEVBQUUsQ0FBQztNQUNOLFdBQVcsUUFBUSxTQUFTO01BQzVCLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBRWhCLElBQUksQ0FBQyxNQUFNLENBQ1AsVUFBVSxHQUFHLFNBQVMsSUFBSSxDQUFDLEVBQzNCLEdBQUcsRUFBRSxDQUFDO01BQ04sVUFBVSxRQUFRLFNBQVM7VUFDdkIsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFFcEIsSUFBSSxDQUFDLE1BQU0sQ0FDUCxDQUFDLFVBQVUsR0FBRyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFDNUMsR0FBRyxFQUFFLENBQUMsOENBQ0YsU0FBUyxHQUFHLFNBQVMsV0FDckIsVUFBVSxzQ0FBc0MsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFFcEUsTUFBTSxNQUFNLEdBQXVCLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBQyxDQUFDO0lBQzNDLE1BQU0sS0FBSyxHQUFzQixFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUMsQ0FBQztJQUV6RCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQ25CLFlBQVksRUFBRSxNQUE4QixFQUM1QyxLQUEyQixDQUFDLENBQUM7QUFDbkMsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsRUFBQyxhQUFhLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7RGVwdGhUb1NwYWNlLCBEZXB0aFRvU3BhY2VBdHRycywgRGVwdGhUb1NwYWNlSW5wdXRzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge1RlbnNvcjREfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlNER9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcblxuLyoqXG4gKiBSZWFycmFuZ2VzIGRhdGEgZnJvbSBkZXB0aCBpbnRvIGJsb2NrcyBvZiBzcGF0aWFsIGRhdGEuIE1vcmUgc3BlY2lmaWNhbGx5LFxuICogdGhpcyBvcCBvdXRwdXRzIGEgY29weSBvZiB0aGUgaW5wdXQgdGVuc29yIHdoZXJlIHZhbHVlcyBmcm9tIHRoZSBgZGVwdGhgXG4gKiBkaW1lbnNpb24gYXJlIG1vdmVkIGluIHNwYXRpYWwgYmxvY2tzIHRvIHRoZSBgaGVpZ2h0YCBhbmQgYHdpZHRoYCBkaW1lbnNpb25zLlxuICogVGhlIGF0dHIgYGJsb2NrU2l6ZWAgaW5kaWNhdGVzIHRoZSBpbnB1dCBibG9jayBzaXplIGFuZCBob3cgdGhlIGRhdGEgaXNcbiAqIG1vdmVkLlxuICpcbiAqICAtIENodW5rcyBvZiBkYXRhIG9mIHNpemUgYGJsb2NrU2l6ZSAqIGJsb2NrU2l6ZWAgZnJvbSBkZXB0aCBhcmUgcmVhcnJhbmdlZFxuICogaW50byBub24tb3ZlcmxhcHBpbmcgYmxvY2tzIG9mIHNpemUgYGJsb2NrU2l6ZSB4IGJsb2NrU2l6ZWBcbiAqXG4gKiAgLSBUaGUgd2lkdGggdGhlIG91dHB1dCB0ZW5zb3IgaXMgYGlucHV0V2lkdGggKiBibG9ja1NpemVgLCB3aGVyZWFzIHRoZVxuICogaGVpZ2h0IGlzIGBpbnB1dEhlaWdodCAqIGJsb2NrU2l6ZWBcbiAqXG4gKiAgLSBUaGUgWSwgWCBjb29yZGluYXRlcyB3aXRoaW4gZWFjaCBibG9jayBvZiB0aGUgb3V0cHV0IGltYWdlIGFyZSBkZXRlcm1pbmVkXG4gKiBieSB0aGUgaGlnaCBvcmRlciBjb21wb25lbnQgb2YgdGhlIGlucHV0IGNoYW5uZWwgaW5kZXhcbiAqXG4gKiAgLSBUaGUgZGVwdGggb2YgdGhlIGlucHV0IHRlbnNvciBtdXN0IGJlIGRpdmlzaWJsZSBieSBgYmxvY2tTaXplICpcbiAqIGJsb2NrU2l6ZWBcbiAqXG4gKiBUaGUgYGRhdGFGb3JtYXRgIGF0dHIgc3BlY2lmaWVzIHRoZSBsYXlvdXQgb2YgdGhlIGlucHV0IGFuZCBvdXRwdXQgdGVuc29yc1xuICogd2l0aCB0aGUgZm9sbG93aW5nIG9wdGlvbnM6IFwiTkhXQ1wiOiBbIGBiYXRjaCwgaGVpZ2h0LCB3aWR0aCwgY2hhbm5lbHNgIF1cbiAqIFwiTkNIV1wiOiBbIGBiYXRjaCwgY2hhbm5lbHMsIGhlaWdodCwgd2lkdGhgIF1cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgeCA9IHRmLnRlbnNvcjRkKFsxLCAyLCAzLCA0XSwgWzEsIDEsIDEsIDRdKTtcbiAqIGNvbnN0IGJsb2NrU2l6ZSA9IDI7XG4gKiBjb25zdCBkYXRhRm9ybWF0ID0gXCJOSFdDXCI7XG4gKlxuICogdGYuZGVwdGhUb1NwYWNlKHgsIGJsb2NrU2l6ZSwgZGF0YUZvcm1hdCkucHJpbnQoKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB4IFRoZSBpbnB1dCB0ZW5zb3Igb2YgcmFuayA0XG4gKiBAcGFyYW0gYmxvY2tTSXplICBBbiBgaW50YCB0aGF0IGlzIGA+PSAyYC4gVGhlIHNpemUgb2YgdGhlIHNwYXRpYWwgYmxvY2tcbiAqIEBwYXJhbSBkYXRhRm9ybWF0IEFuIG9wdGlvbmFsIHN0cmluZyBmcm9tOiBcIk5IV0NcIiwgXCJOQ0hXXCIuIERlZmF1bHRzIHRvIFwiTkhXQ1wiXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ1RlbnNvcnMnLCBzdWJoZWFkaW5nOiAnVHJhbnNmb3JtYXRpb25zJ31cbiAqL1xuZnVuY3Rpb24gZGVwdGhUb1NwYWNlXyhcbiAgICB4OiBUZW5zb3I0RHxUZW5zb3JMaWtlNEQsIGJsb2NrU2l6ZTogbnVtYmVyLFxuICAgIGRhdGFGb3JtYXQ6ICdOSFdDJ3wnTkNIVycgPSAnTkhXQycpOiBUZW5zb3I0RCB7XG4gIGNvbnN0ICR4ID0gY29udmVydFRvVGVuc29yKHgsICd4JywgJ2RlcHRoVG9TcGFjZScsICdmbG9hdDMyJykgYXMgVGVuc29yNEQ7XG5cbiAgY29uc3QgaW5wdXRIZWlnaHQgPSAoZGF0YUZvcm1hdCA9PT0gJ05IV0MnKSA/ICR4LnNoYXBlWzFdIDogJHguc2hhcGVbMl07XG4gIGNvbnN0IGlucHV0V2lkdGggPSAoZGF0YUZvcm1hdCA9PT0gJ05IV0MnKSA/ICR4LnNoYXBlWzJdIDogJHguc2hhcGVbM107XG4gIGNvbnN0IGlucHV0RGVwdGggPSAoZGF0YUZvcm1hdCA9PT0gJ05IV0MnKSA/ICR4LnNoYXBlWzNdIDogJHguc2hhcGVbMV07XG5cbiAgdXRpbC5hc3NlcnQoXG4gICAgICBibG9ja1NpemUgPiAxLFxuICAgICAgKCkgPT4gYGJsb2NrU2l6ZSBzaG91bGQgYmUgPiAxIGZvciBkZXB0aFRvU3BhY2UsIGJ1dCB3YXM6ICR7YmxvY2tTaXplfWApO1xuXG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgaW5wdXRIZWlnaHQgKiBibG9ja1NpemUgPj0gMCxcbiAgICAgICgpID0+IGBOZWdhdGl2ZSBkaW1lbnNpb24gc2l6ZSBjYXVzZWQgYnkgb3ZlcmZsb3cgd2hlbiBtdWx0aXBseWluZ1xuICAgICR7aW5wdXRIZWlnaHR9IGFuZCAke2Jsb2NrU2l6ZX0gIGZvciBkZXB0aFRvU3BhY2Ugd2l0aCBpbnB1dCBzaGFwZVxuICAgICR7JHguc2hhcGV9YCk7XG5cbiAgdXRpbC5hc3NlcnQoXG4gICAgICBpbnB1dFdpZHRoICogYmxvY2tTaXplID49IDAsXG4gICAgICAoKSA9PiBgTmVnYXRpdmUgZGltZW5zaW9uIHNpemUgY2F1c2VkIGJ5IG92ZXJmbG93IHdoZW4gbXVsdGlwbHlpbmdcbiAgICAke2lucHV0V2lkdGh9IGFuZCAke2Jsb2NrU2l6ZX0gZm9yIGRlcHRoVG9TcGFjZSB3aXRoIGlucHV0IHNoYXBlXG4gICAgICAgICR7JHguc2hhcGV9YCk7XG5cbiAgdXRpbC5hc3NlcnQoXG4gICAgICAoaW5wdXREZXB0aCAlIChibG9ja1NpemUgKiBibG9ja1NpemUpID09PSAwKSxcbiAgICAgICgpID0+IGBEaW1lbnNpb24gc2l6ZSBtdXN0IGJlIGV2ZW5seSBkaXZpc2libGUgYnkgJHtcbiAgICAgICAgICBibG9ja1NpemUgKiBibG9ja1NpemV9IGJ1dCBpcyAke1xuICAgICAgICAgIGlucHV0RGVwdGh9IGZvciBkZXB0aFRvU3BhY2Ugd2l0aCBpbnB1dCBzaGFwZSAkeyR4LnNoYXBlfWApO1xuXG4gIGNvbnN0IGlucHV0czogRGVwdGhUb1NwYWNlSW5wdXRzID0ge3g6ICR4fTtcbiAgY29uc3QgYXR0cnM6IERlcHRoVG9TcGFjZUF0dHJzID0ge2Jsb2NrU2l6ZSwgZGF0YUZvcm1hdH07XG5cbiAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICBEZXB0aFRvU3BhY2UsIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCxcbiAgICAgIGF0dHJzIGFzIHt9IGFzIE5hbWVkQXR0ck1hcCk7XG59XG5cbmV4cG9ydCBjb25zdCBkZXB0aFRvU3BhY2UgPSBvcCh7ZGVwdGhUb1NwYWNlX30pO1xuIl19