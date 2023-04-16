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
import { MaxPool3D } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { checkPadOnDimRoundingMode } from './conv_util';
import { op } from './operation';
import { reshape } from './reshape';
/**
 * Computes the 3D max pooling.
 *
 * ```js
 * const x = tf.tensor5d([1, 2, 3, 4, 5, 6, 7, 8], [1, 2, 2, 2, 1]);
 * const result = tf.maxPool3d(x, 2, 1, 'valid');
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
 * @doc {heading: 'Operations', subheading: 'Convolution'}
 */
function maxPool3d_(x, filterSize = [1, 1, 1], strides, pad, dimRoundingMode, dataFormat = 'NDHWC') {
    const $x = convertToTensor(x, 'x', 'maxPool3d');
    let x5D = $x;
    let reshapedTo5D = false;
    if ($x.rank === 4) {
        reshapedTo5D = true;
        x5D = reshape($x, [1, $x.shape[0], $x.shape[1], $x.shape[2], $x.shape[3]]);
    }
    util.assert(x5D.rank === 5, () => `Error in maxPool3d: x must be rank 5 but got rank ${x5D.rank}.`);
    util.assert(dataFormat === 'NDHWC', () => `Error in maxPool3d: Only NDHWC is currently supported, ` +
        `but got dataFormat of ${dataFormat}`);
    checkPadOnDimRoundingMode('maxPool3d', pad, dimRoundingMode);
    const inputs = { x: x5D };
    const attrs = { filterSize, strides, pad, dimRoundingMode, dataFormat };
    // tslint:disable-next-line: no-unnecessary-type-assertion
    const res = ENGINE.runKernel(MaxPool3D, inputs, attrs);
    if (reshapedTo5D) {
        return reshape(res, [res.shape[1], res.shape[2], res.shape[3], res.shape[4]]);
    }
    return res;
}
export const maxPool3d = op({ maxPool3d_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4X3Bvb2xfM2QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9tYXhfcG9vbF8zZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxTQUFTLEVBQWtDLE1BQU0saUJBQWlCLENBQUM7QUFJM0UsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE9BQU8sS0FBSyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBRWhDLE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN0RCxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFbEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQ0c7QUFDSCxTQUFTLFVBQVUsQ0FDZixDQUFlLEVBQUUsYUFBOEMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUN4RSxPQUF3QyxFQUFFLEdBQTBCLEVBQ3BFLGVBQXdDLEVBQ3hDLGFBQThCLE9BQU87SUFDdkMsTUFBTSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFaEQsSUFBSSxHQUFHLEdBQUcsRUFBYyxDQUFDO0lBQ3pCLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztJQUN6QixJQUFJLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO1FBQ2pCLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDNUU7SUFFRCxJQUFJLENBQUMsTUFBTSxDQUNQLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUNkLEdBQUcsRUFBRSxDQUFDLHFEQUFxRCxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUM1RSxJQUFJLENBQUMsTUFBTSxDQUNQLFVBQVUsS0FBSyxPQUFPLEVBQ3RCLEdBQUcsRUFBRSxDQUFDLHlEQUF5RDtRQUMzRCx5QkFBeUIsVUFBVSxFQUFFLENBQUMsQ0FBQztJQUMvQyx5QkFBeUIsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQzdELE1BQU0sTUFBTSxHQUFvQixFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUMsQ0FBQztJQUN6QyxNQUFNLEtBQUssR0FDVSxFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUMsQ0FBQztJQUU3RSwwREFBMEQ7SUFDMUQsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FDWixTQUFTLEVBQUUsTUFBOEIsRUFDekMsS0FBMkIsQ0FBTSxDQUFDO0lBRWxELElBQUksWUFBWSxFQUFFO1FBQ2hCLE9BQU8sT0FBTyxDQUNILEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDbkUsQ0FBQztLQUNQO0lBRUQsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQyxFQUFDLFVBQVUsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtNYXhQb29sM0QsIE1heFBvb2wzREF0dHJzLCBNYXhQb29sM0RJbnB1dHN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge05hbWVkQXR0ck1hcH0gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7VGVuc29yNEQsIFRlbnNvcjVEfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge2NoZWNrUGFkT25EaW1Sb3VuZGluZ01vZGV9IGZyb20gJy4vY29udl91dGlsJztcbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcbmltcG9ydCB7cmVzaGFwZX0gZnJvbSAnLi9yZXNoYXBlJztcblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgM0QgbWF4IHBvb2xpbmcuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHggPSB0Zi50ZW5zb3I1ZChbMSwgMiwgMywgNCwgNSwgNiwgNywgOF0sIFsxLCAyLCAyLCAyLCAxXSk7XG4gKiBjb25zdCByZXN1bHQgPSB0Zi5tYXhQb29sM2QoeCwgMiwgMSwgJ3ZhbGlkJyk7XG4gKiByZXN1bHQucHJpbnQoKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB4IFRoZSBpbnB1dCB0ZW5zb3IsIG9mIHJhbmsgNSBvciByYW5rIDQgb2Ygc2hhcGVcbiAqICAgICBgW2JhdGNoLCBkZXB0aCwgaGVpZ2h0LCB3aWR0aCwgaW5DaGFubmVsc11gLlxuICogQHBhcmFtIGZpbHRlclNpemUgVGhlIGZpbHRlciBzaXplOlxuICogICAgIGBbZmlsdGVyRGVwdGgsIGZpbHRlckhlaWdodCwgZmlsdGVyV2lkdGhdYC5cbiAqICAgICBJZiBgZmlsdGVyU2l6ZWAgaXMgYSBzaW5nbGUgbnVtYmVyLFxuICogICAgIHRoZW4gYGZpbHRlckRlcHRoID09IGZpbHRlckhlaWdodCA9PSBmaWx0ZXJXaWR0aGAuXG4gKiBAcGFyYW0gc3RyaWRlcyBUaGUgc3RyaWRlcyBvZiB0aGUgcG9vbGluZzpcbiAqICAgICBgW3N0cmlkZURlcHRoLCBzdHJpZGVIZWlnaHQsIHN0cmlkZVdpZHRoXWAuXG4gKiAgICAgSWYgYHN0cmlkZXNgIGlzIGEgc2luZ2xlIG51bWJlcixcbiAqICAgICB0aGVuIGBzdHJpZGVEZXB0aCA9PSBzdHJpZGVIZWlnaHQgPT0gc3RyaWRlV2lkdGhgLlxuICogQHBhcmFtIHBhZCBUaGUgdHlwZSBvZiBwYWRkaW5nIGFsZ29yaXRobS5cbiAqICAgIC0gYHNhbWVgIGFuZCBzdHJpZGUgMTogb3V0cHV0IHdpbGwgYmUgb2Ygc2FtZSBzaXplIGFzIGlucHV0LFxuICogICAgICAgcmVnYXJkbGVzcyBvZiBmaWx0ZXIgc2l6ZS5cbiAqICAgIC0gYHZhbGlkYDogb3V0cHV0IHdpbGwgYmUgc21hbGxlciB0aGFuIGlucHV0IGlmIGZpbHRlciBpcyBsYXJnZXJcbiAqICAgICAgIHRoYW4gMSoxeDEuXG4gKiAgICAtIEZvciBtb3JlIGluZm8sIHNlZSB0aGlzIGd1aWRlOlxuICogICAgIFtodHRwczovL3d3dy50ZW5zb3JmbG93Lm9yZy9hcGlfZG9jcy9weXRob24vdGYvbm4vY29udm9sdXRpb25dKFxuICogICAgICAgICAgaHR0cHM6Ly93d3cudGVuc29yZmxvdy5vcmcvYXBpX2RvY3MvcHl0aG9uL3RmL25uL2NvbnZvbHV0aW9uKVxuICogQHBhcmFtIGRpbVJvdW5kaW5nTW9kZSBBIHN0cmluZyBmcm9tOiAnY2VpbCcsICdyb3VuZCcsICdmbG9vcicuIElmIG5vbmUgaXNcbiAqICAgICBwcm92aWRlZCwgaXQgd2lsbCBkZWZhdWx0IHRvIHRydW5jYXRlLlxuICogQHBhcmFtIGRhdGFGb3JtYXQgQW4gb3B0aW9uYWwgc3RyaW5nIGZyb206IFwiTkRIV0NcIiwgXCJOQ0RIV1wiLiBEZWZhdWx0cyB0b1xuICogICAgIFwiTkRIV0NcIi4gU3BlY2lmeSB0aGUgZGF0YSBmb3JtYXQgb2YgdGhlIGlucHV0IGFuZCBvdXRwdXQgZGF0YS4gV2l0aCB0aGVcbiAqICAgICBkZWZhdWx0IGZvcm1hdCBcIk5ESFdDXCIsIHRoZSBkYXRhIGlzIHN0b3JlZCBpbiB0aGUgb3JkZXIgb2Y6IFtiYXRjaCxcbiAqICAgICBkZXB0aCwgaGVpZ2h0LCB3aWR0aCwgY2hhbm5lbHNdLiBPbmx5IFwiTkRIV0NcIiBpcyBjdXJyZW50bHkgc3VwcG9ydGVkLlxuICogQGRvYyB7aGVhZGluZzogJ09wZXJhdGlvbnMnLCBzdWJoZWFkaW5nOiAnQ29udm9sdXRpb24nfVxuICovXG5mdW5jdGlvbiBtYXhQb29sM2RfPFQgZXh0ZW5kcyBUZW5zb3I0RHxUZW5zb3I1RD4oXG4gICAgeDogVHxUZW5zb3JMaWtlLCBmaWx0ZXJTaXplOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl18bnVtYmVyID0gWzEsIDEsIDFdLFxuICAgIHN0cmlkZXM6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXXxudW1iZXIsIHBhZDogJ3ZhbGlkJ3wnc2FtZSd8bnVtYmVyLFxuICAgIGRpbVJvdW5kaW5nTW9kZT86ICdmbG9vcid8J3JvdW5kJ3wnY2VpbCcsXG4gICAgZGF0YUZvcm1hdDogJ05ESFdDJ3wnTkNESFcnID0gJ05ESFdDJyk6IFQge1xuICBjb25zdCAkeCA9IGNvbnZlcnRUb1RlbnNvcih4LCAneCcsICdtYXhQb29sM2QnKTtcblxuICBsZXQgeDVEID0gJHggYXMgVGVuc29yNUQ7XG4gIGxldCByZXNoYXBlZFRvNUQgPSBmYWxzZTtcbiAgaWYgKCR4LnJhbmsgPT09IDQpIHtcbiAgICByZXNoYXBlZFRvNUQgPSB0cnVlO1xuICAgIHg1RCA9IHJlc2hhcGUoJHgsIFsxLCAkeC5zaGFwZVswXSwgJHguc2hhcGVbMV0sICR4LnNoYXBlWzJdLCAkeC5zaGFwZVszXV0pO1xuICB9XG5cbiAgdXRpbC5hc3NlcnQoXG4gICAgICB4NUQucmFuayA9PT0gNSxcbiAgICAgICgpID0+IGBFcnJvciBpbiBtYXhQb29sM2Q6IHggbXVzdCBiZSByYW5rIDUgYnV0IGdvdCByYW5rICR7eDVELnJhbmt9LmApO1xuICB1dGlsLmFzc2VydChcbiAgICAgIGRhdGFGb3JtYXQgPT09ICdOREhXQycsXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gbWF4UG9vbDNkOiBPbmx5IE5ESFdDIGlzIGN1cnJlbnRseSBzdXBwb3J0ZWQsIGAgK1xuICAgICAgICAgIGBidXQgZ290IGRhdGFGb3JtYXQgb2YgJHtkYXRhRm9ybWF0fWApO1xuICBjaGVja1BhZE9uRGltUm91bmRpbmdNb2RlKCdtYXhQb29sM2QnLCBwYWQsIGRpbVJvdW5kaW5nTW9kZSk7XG4gIGNvbnN0IGlucHV0czogTWF4UG9vbDNESW5wdXRzID0ge3g6IHg1RH07XG4gIGNvbnN0IGF0dHJzOlxuICAgICAgTWF4UG9vbDNEQXR0cnMgPSB7ZmlsdGVyU2l6ZSwgc3RyaWRlcywgcGFkLCBkaW1Sb3VuZGluZ01vZGUsIGRhdGFGb3JtYXR9O1xuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tdW5uZWNlc3NhcnktdHlwZS1hc3NlcnRpb25cbiAgY29uc3QgcmVzID0gRU5HSU5FLnJ1bktlcm5lbChcbiAgICAgICAgICAgICAgICAgIE1heFBvb2wzRCwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLFxuICAgICAgICAgICAgICAgICAgYXR0cnMgYXMge30gYXMgTmFtZWRBdHRyTWFwKSBhcyBUO1xuXG4gIGlmIChyZXNoYXBlZFRvNUQpIHtcbiAgICByZXR1cm4gcmVzaGFwZShcbiAgICAgICAgICAgICAgIHJlcywgW3Jlcy5zaGFwZVsxXSwgcmVzLnNoYXBlWzJdLCByZXMuc2hhcGVbM10sIHJlcy5zaGFwZVs0XV0pIGFzXG4gICAgICAgIFQ7XG4gIH1cblxuICByZXR1cm4gcmVzO1xufVxuXG5leHBvcnQgY29uc3QgbWF4UG9vbDNkID0gb3Aoe21heFBvb2wzZF99KTtcbiJdfQ==