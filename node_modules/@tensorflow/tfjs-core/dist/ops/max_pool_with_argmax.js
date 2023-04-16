/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
import { MaxPoolWithArgmax } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Computes the 2D max pooling of an image with Argmax index.
 * The indices in argmax are flattened, so that a maximum value at position `[b,
 * y, x, c]` becomes flattened index: `(y * width + x) * channels + c` if
 * include_batch_in_index is False; `((b * height + y) * width + x) * channels
 * +c` if include_batch_in_index is True.
 *
 * The indices returned are always in `[0, height) x [0, width)` before
 * flattening.
 *
 * @param x The input tensor, of rank 4 or rank 3 of shape
 *     `[batch, height, width, inChannels]`. If rank 3, batch of 1 is assumed.
 * @param filterSize The filter size: `[filterHeight, filterWidth]`. If
 *     `filterSize` is a single number, then `filterHeight == filterWidth`.
 * @param strides The strides of the pooling: `[strideHeight, strideWidth]`. If
 *     `strides` is a single number, then `strideHeight == strideWidth`.
 * @param dataFormat An optional string from: "NDHWC", "NCDHW". Defaults to
 *     "NDHWC". Specify the data format of the input and output data. With the
 *     default format "NDHWC", the data is stored in the order of: [batch,
 *     depth, height, width, channels]. Only "NDHWC" is currently supported.
 * @param pad The type of padding algorithm.
 *    - `same` and stride 1: output will be of same size as input,
 *       regardless of filter size.
 *    - `valid`: output will be smaller than input if filter is larger
 *       than 1x1.
 *    - For more info, see this guide:
 *     [https://www.tensorflow.org/api_docs/python/tf/nn/convolution](
 *          https://www.tensorflow.org/api_docs/python/tf/nn/convolution)
 * @param includeBatchIndex Defaults to False. Whether to include batch
 *    dimension in flattened index of argmax.
 *
 * @doc {heading: 'Operations', subheading: 'Convolution'}
 */
function maxPoolWithArgmax_(x, filterSize, strides, pad, includeBatchInIndex = false) {
    const $x = convertToTensor(x, 'x', 'maxPoolWithArgmax');
    const inputs = { x: $x };
    const attrs = { filterSize, strides, pad, includeBatchInIndex };
    // tslint:disable-next-line: no-unnecessary-type-assertion
    const result = ENGINE.runKernel(MaxPoolWithArgmax, inputs, attrs);
    return { result: result[0], indexes: result[1] };
}
export const maxPoolWithArgmax = op({ maxPoolWithArgmax_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4X3Bvb2xfd2l0aF9hcmdtYXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9tYXhfcG9vbF93aXRoX2FyZ21heC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxpQkFBaUIsRUFBa0QsTUFBTSxpQkFBaUIsQ0FBQztBQUluRyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHbkQsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQ0c7QUFDSCxTQUFTLGtCQUFrQixDQUN2QixDQUFlLEVBQUUsVUFBbUMsRUFDcEQsT0FBZ0MsRUFBRSxHQUEwQixFQUM1RCxtQkFBbUIsR0FBRyxLQUFLO0lBQzdCLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFFeEQsTUFBTSxNQUFNLEdBQTRCLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBQyxDQUFDO0lBQ2hELE1BQU0sS0FBSyxHQUNrQixFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLG1CQUFtQixFQUFDLENBQUM7SUFFN0UsMERBQTBEO0lBQzFELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQ1osaUJBQWlCLEVBQUUsTUFBOEIsRUFDakQsS0FBMkIsQ0FBYSxDQUFDO0lBRTVELE9BQU8sRUFBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQztBQUNqRCxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsRUFBRSxDQUFDLEVBQUMsa0JBQWtCLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7TWF4UG9vbFdpdGhBcmdtYXgsIE1heFBvb2xXaXRoQXJnbWF4QXR0cnMsIE1heFBvb2xXaXRoQXJnbWF4SW5wdXRzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge1RlbnNvciwgVGVuc29yNER9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcblxuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuXG4vKipcbiAqIENvbXB1dGVzIHRoZSAyRCBtYXggcG9vbGluZyBvZiBhbiBpbWFnZSB3aXRoIEFyZ21heCBpbmRleC5cbiAqIFRoZSBpbmRpY2VzIGluIGFyZ21heCBhcmUgZmxhdHRlbmVkLCBzbyB0aGF0IGEgbWF4aW11bSB2YWx1ZSBhdCBwb3NpdGlvbiBgW2IsXG4gKiB5LCB4LCBjXWAgYmVjb21lcyBmbGF0dGVuZWQgaW5kZXg6IGAoeSAqIHdpZHRoICsgeCkgKiBjaGFubmVscyArIGNgIGlmXG4gKiBpbmNsdWRlX2JhdGNoX2luX2luZGV4IGlzIEZhbHNlOyBgKChiICogaGVpZ2h0ICsgeSkgKiB3aWR0aCArIHgpICogY2hhbm5lbHNcbiAqICtjYCBpZiBpbmNsdWRlX2JhdGNoX2luX2luZGV4IGlzIFRydWUuXG4gKlxuICogVGhlIGluZGljZXMgcmV0dXJuZWQgYXJlIGFsd2F5cyBpbiBgWzAsIGhlaWdodCkgeCBbMCwgd2lkdGgpYCBiZWZvcmVcbiAqIGZsYXR0ZW5pbmcuXG4gKlxuICogQHBhcmFtIHggVGhlIGlucHV0IHRlbnNvciwgb2YgcmFuayA0IG9yIHJhbmsgMyBvZiBzaGFwZVxuICogICAgIGBbYmF0Y2gsIGhlaWdodCwgd2lkdGgsIGluQ2hhbm5lbHNdYC4gSWYgcmFuayAzLCBiYXRjaCBvZiAxIGlzIGFzc3VtZWQuXG4gKiBAcGFyYW0gZmlsdGVyU2l6ZSBUaGUgZmlsdGVyIHNpemU6IGBbZmlsdGVySGVpZ2h0LCBmaWx0ZXJXaWR0aF1gLiBJZlxuICogICAgIGBmaWx0ZXJTaXplYCBpcyBhIHNpbmdsZSBudW1iZXIsIHRoZW4gYGZpbHRlckhlaWdodCA9PSBmaWx0ZXJXaWR0aGAuXG4gKiBAcGFyYW0gc3RyaWRlcyBUaGUgc3RyaWRlcyBvZiB0aGUgcG9vbGluZzogYFtzdHJpZGVIZWlnaHQsIHN0cmlkZVdpZHRoXWAuIElmXG4gKiAgICAgYHN0cmlkZXNgIGlzIGEgc2luZ2xlIG51bWJlciwgdGhlbiBgc3RyaWRlSGVpZ2h0ID09IHN0cmlkZVdpZHRoYC5cbiAqIEBwYXJhbSBkYXRhRm9ybWF0IEFuIG9wdGlvbmFsIHN0cmluZyBmcm9tOiBcIk5ESFdDXCIsIFwiTkNESFdcIi4gRGVmYXVsdHMgdG9cbiAqICAgICBcIk5ESFdDXCIuIFNwZWNpZnkgdGhlIGRhdGEgZm9ybWF0IG9mIHRoZSBpbnB1dCBhbmQgb3V0cHV0IGRhdGEuIFdpdGggdGhlXG4gKiAgICAgZGVmYXVsdCBmb3JtYXQgXCJOREhXQ1wiLCB0aGUgZGF0YSBpcyBzdG9yZWQgaW4gdGhlIG9yZGVyIG9mOiBbYmF0Y2gsXG4gKiAgICAgZGVwdGgsIGhlaWdodCwgd2lkdGgsIGNoYW5uZWxzXS4gT25seSBcIk5ESFdDXCIgaXMgY3VycmVudGx5IHN1cHBvcnRlZC5cbiAqIEBwYXJhbSBwYWQgVGhlIHR5cGUgb2YgcGFkZGluZyBhbGdvcml0aG0uXG4gKiAgICAtIGBzYW1lYCBhbmQgc3RyaWRlIDE6IG91dHB1dCB3aWxsIGJlIG9mIHNhbWUgc2l6ZSBhcyBpbnB1dCxcbiAqICAgICAgIHJlZ2FyZGxlc3Mgb2YgZmlsdGVyIHNpemUuXG4gKiAgICAtIGB2YWxpZGA6IG91dHB1dCB3aWxsIGJlIHNtYWxsZXIgdGhhbiBpbnB1dCBpZiBmaWx0ZXIgaXMgbGFyZ2VyXG4gKiAgICAgICB0aGFuIDF4MS5cbiAqICAgIC0gRm9yIG1vcmUgaW5mbywgc2VlIHRoaXMgZ3VpZGU6XG4gKiAgICAgW2h0dHBzOi8vd3d3LnRlbnNvcmZsb3cub3JnL2FwaV9kb2NzL3B5dGhvbi90Zi9ubi9jb252b2x1dGlvbl0oXG4gKiAgICAgICAgICBodHRwczovL3d3dy50ZW5zb3JmbG93Lm9yZy9hcGlfZG9jcy9weXRob24vdGYvbm4vY29udm9sdXRpb24pXG4gKiBAcGFyYW0gaW5jbHVkZUJhdGNoSW5kZXggRGVmYXVsdHMgdG8gRmFsc2UuIFdoZXRoZXIgdG8gaW5jbHVkZSBiYXRjaFxuICogICAgZGltZW5zaW9uIGluIGZsYXR0ZW5lZCBpbmRleCBvZiBhcmdtYXguXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ09wZXJhdGlvbnMnLCBzdWJoZWFkaW5nOiAnQ29udm9sdXRpb24nfVxuICovXG5mdW5jdGlvbiBtYXhQb29sV2l0aEFyZ21heF88VCBleHRlbmRzIFRlbnNvcjREPihcbiAgICB4OiBUfFRlbnNvckxpa2UsIGZpbHRlclNpemU6IFtudW1iZXIsIG51bWJlcl18bnVtYmVyLFxuICAgIHN0cmlkZXM6IFtudW1iZXIsIG51bWJlcl18bnVtYmVyLCBwYWQ6ICd2YWxpZCd8J3NhbWUnfG51bWJlcixcbiAgICBpbmNsdWRlQmF0Y2hJbkluZGV4ID0gZmFsc2UpOiBOYW1lZFRlbnNvck1hcCB7XG4gIGNvbnN0ICR4ID0gY29udmVydFRvVGVuc29yKHgsICd4JywgJ21heFBvb2xXaXRoQXJnbWF4Jyk7XG5cbiAgY29uc3QgaW5wdXRzOiBNYXhQb29sV2l0aEFyZ21heElucHV0cyA9IHt4OiAkeH07XG4gIGNvbnN0IGF0dHJzOlxuICAgICAgTWF4UG9vbFdpdGhBcmdtYXhBdHRycyA9IHtmaWx0ZXJTaXplLCBzdHJpZGVzLCBwYWQsIGluY2x1ZGVCYXRjaEluSW5kZXh9O1xuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tdW5uZWNlc3NhcnktdHlwZS1hc3NlcnRpb25cbiAgY29uc3QgcmVzdWx0ID0gRU5HSU5FLnJ1bktlcm5lbChcbiAgICAgICAgICAgICAgICAgICAgIE1heFBvb2xXaXRoQXJnbWF4LCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXAsXG4gICAgICAgICAgICAgICAgICAgICBhdHRycyBhcyB7fSBhcyBOYW1lZEF0dHJNYXApIGFzIFRlbnNvcltdO1xuXG4gIHJldHVybiB7cmVzdWx0OiByZXN1bHRbMF0sIGluZGV4ZXM6IHJlc3VsdFsxXX07XG59XG5cbmV4cG9ydCBjb25zdCBtYXhQb29sV2l0aEFyZ21heCA9IG9wKHttYXhQb29sV2l0aEFyZ21heF99KTtcbiJdfQ==