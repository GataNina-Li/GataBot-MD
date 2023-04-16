/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
import { ENGINE } from '../../engine';
import { SparseSegmentMean } from '../../kernel_names';
import { convertToTensor } from '../../tensor_util_env';
import { op } from '../operation';
/**
 * Computes the mean along sparse segments of a tensor.
 *
 * ```js
 * const c = tf.tensor2d([[1,2,3,4], [-1,-2,-3,-4], [6,7,8,9]]);
 * // Select two rows, one segment.
 * const result1 = tf.sparse.sparseSegmentMean(c,
 *                                           tf.tensor1d([0, 1], 'int32'),
 *                                           tf.tensor1d([0, 0], 'int32'));
 * result1.print(); // [[0, 0, 0, 0]]
 *
 * // Select two rows, two segments.
 * const result2 = tf.sparse.sparseSegmentMean(c,
 *                                             tf.tensor1d([0, 1], 'int32'),
 *                                             tf.tensor1d([0, 1], 'int32'));
 * result2.print(); // [[1, 2, 3, 4], [-1, -2, -3, -4]]
 *
 * // Select all rows, two segments.
 * const result3 = tf.sparse.sparseSegmentMean(c,
 *                                             tf.tensor1d([0, 1, 2], 'int32'),
 *                                             tf.tensor1d([0, 1, 1], 'int32'));
 * result3.print(); // [[1.0, 2.0, 3.0, 4.0], [2.5, 2.5, 2.5, 2.5]]
 * ```
 * @param data: A Tensor of at least one dimension with data that will be
 *     assembled in the output.
 * @param indices: A 1-D Tensor with indices into data. Has same rank as
 *     segmentIds.
 * @param segmentIds: A 1-D Tensor with indices into the output Tensor. Values
 *     should be sorted and can be repeated.
 * @return Has same shape as data, except for dimension 0 which has equal to
 *         the number of segments.
 *
 * @doc {heading: 'Operations', subheading: 'Sparse'}
 */
function sparseSegmentMean_(data, indices, segmentIds) {
    const $data = convertToTensor(data, 'data', 'sparseSegmentMean');
    const $indices = convertToTensor(indices, 'indices', 'sparseSegmentMean', 'int32');
    const $segmentIds = convertToTensor(segmentIds, 'segmentIds', 'sparseSegmentMean', 'int32');
    if ($data.rank < 1) {
        throw new Error(`Data should be at least 1 dimensional but received scalar`);
    }
    if ($indices.rank !== 1) {
        throw new Error(`Indices should be Tensor1D but received shape
          ${$indices.shape}`);
    }
    if ($segmentIds.rank !== 1) {
        throw new Error(`Segment ids should be Tensor1D but received shape
          ${$segmentIds.shape}`);
    }
    const inputs = {
        data: $data,
        indices: $indices,
        segmentIds: $segmentIds
    };
    return ENGINE.runKernel(SparseSegmentMean, inputs);
}
export const sparseSegmentMean = op({ sparseSegmentMean_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BhcnNlX3NlZ21lbnRfbWVhbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3NwYXJzZS9zcGFyc2Vfc2VnbWVudF9tZWFuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDcEMsT0FBTyxFQUFDLGlCQUFpQixFQUEwQixNQUFNLG9CQUFvQixDQUFDO0FBRTlFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUV0RCxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRWhDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQ0c7QUFDSCxTQUFTLGtCQUFrQixDQUN2QixJQUF1QixFQUFFLE9BQTRCLEVBQ3JELFVBQStCO0lBQ2pDLE1BQU0sS0FBSyxHQUFHLGVBQWUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFDakUsTUFBTSxRQUFRLEdBQ1YsZUFBZSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdEUsTUFBTSxXQUFXLEdBQ2IsZUFBZSxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsbUJBQW1CLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFNUUsSUFBSSxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRTtRQUNsQixNQUFNLElBQUksS0FBSyxDQUNYLDJEQUEyRCxDQUFDLENBQUM7S0FDbEU7SUFDRCxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO1FBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUM7WUFDUixRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUMzQjtJQUNELElBQUksV0FBVyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7UUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQztZQUNSLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQzlCO0lBRUQsTUFBTSxNQUFNLEdBQTRCO1FBQ3RDLElBQUksRUFBRSxLQUFLO1FBQ1gsT0FBTyxFQUFFLFFBQVE7UUFDakIsVUFBVSxFQUFFLFdBQVc7S0FDeEIsQ0FBQztJQUVGLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxNQUFZLENBQUMsQ0FBQztBQUMzRCxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsRUFBRSxDQUFDLEVBQUMsa0JBQWtCLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vLi4vZW5naW5lJztcbmltcG9ydCB7U3BhcnNlU2VnbWVudE1lYW4sIFNwYXJzZVNlZ21lbnRNZWFuSW5wdXRzfSBmcm9tICcuLi8uLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtUZW5zb3IsIFRlbnNvcjFEfSBmcm9tICcuLi8uLi90ZW5zb3InO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uLy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uLy4uL3R5cGVzJztcbmltcG9ydCB7b3B9IGZyb20gJy4uL29wZXJhdGlvbic7XG5cbi8qKlxuICogQ29tcHV0ZXMgdGhlIG1lYW4gYWxvbmcgc3BhcnNlIHNlZ21lbnRzIG9mIGEgdGVuc29yLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBjID0gdGYudGVuc29yMmQoW1sxLDIsMyw0XSwgWy0xLC0yLC0zLC00XSwgWzYsNyw4LDldXSk7XG4gKiAvLyBTZWxlY3QgdHdvIHJvd3MsIG9uZSBzZWdtZW50LlxuICogY29uc3QgcmVzdWx0MSA9IHRmLnNwYXJzZS5zcGFyc2VTZWdtZW50TWVhbihjLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGYudGVuc29yMWQoWzAsIDFdLCAnaW50MzInKSxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRmLnRlbnNvcjFkKFswLCAwXSwgJ2ludDMyJykpO1xuICogcmVzdWx0MS5wcmludCgpOyAvLyBbWzAsIDAsIDAsIDBdXVxuICpcbiAqIC8vIFNlbGVjdCB0d28gcm93cywgdHdvIHNlZ21lbnRzLlxuICogY29uc3QgcmVzdWx0MiA9IHRmLnNwYXJzZS5zcGFyc2VTZWdtZW50TWVhbihjLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0Zi50ZW5zb3IxZChbMCwgMV0sICdpbnQzMicpLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0Zi50ZW5zb3IxZChbMCwgMV0sICdpbnQzMicpKTtcbiAqIHJlc3VsdDIucHJpbnQoKTsgLy8gW1sxLCAyLCAzLCA0XSwgWy0xLCAtMiwgLTMsIC00XV1cbiAqXG4gKiAvLyBTZWxlY3QgYWxsIHJvd3MsIHR3byBzZWdtZW50cy5cbiAqIGNvbnN0IHJlc3VsdDMgPSB0Zi5zcGFyc2Uuc3BhcnNlU2VnbWVudE1lYW4oYyxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGYudGVuc29yMWQoWzAsIDEsIDJdLCAnaW50MzInKSxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGYudGVuc29yMWQoWzAsIDEsIDFdLCAnaW50MzInKSk7XG4gKiByZXN1bHQzLnByaW50KCk7IC8vIFtbMS4wLCAyLjAsIDMuMCwgNC4wXSwgWzIuNSwgMi41LCAyLjUsIDIuNV1dXG4gKiBgYGBcbiAqIEBwYXJhbSBkYXRhOiBBIFRlbnNvciBvZiBhdCBsZWFzdCBvbmUgZGltZW5zaW9uIHdpdGggZGF0YSB0aGF0IHdpbGwgYmVcbiAqICAgICBhc3NlbWJsZWQgaW4gdGhlIG91dHB1dC5cbiAqIEBwYXJhbSBpbmRpY2VzOiBBIDEtRCBUZW5zb3Igd2l0aCBpbmRpY2VzIGludG8gZGF0YS4gSGFzIHNhbWUgcmFuayBhc1xuICogICAgIHNlZ21lbnRJZHMuXG4gKiBAcGFyYW0gc2VnbWVudElkczogQSAxLUQgVGVuc29yIHdpdGggaW5kaWNlcyBpbnRvIHRoZSBvdXRwdXQgVGVuc29yLiBWYWx1ZXNcbiAqICAgICBzaG91bGQgYmUgc29ydGVkIGFuZCBjYW4gYmUgcmVwZWF0ZWQuXG4gKiBAcmV0dXJuIEhhcyBzYW1lIHNoYXBlIGFzIGRhdGEsIGV4Y2VwdCBmb3IgZGltZW5zaW9uIDAgd2hpY2ggaGFzIGVxdWFsIHRvXG4gKiAgICAgICAgIHRoZSBudW1iZXIgb2Ygc2VnbWVudHMuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ09wZXJhdGlvbnMnLCBzdWJoZWFkaW5nOiAnU3BhcnNlJ31cbiAqL1xuZnVuY3Rpb24gc3BhcnNlU2VnbWVudE1lYW5fKFxuICAgIGRhdGE6IFRlbnNvcnxUZW5zb3JMaWtlLCBpbmRpY2VzOiBUZW5zb3IxRHxUZW5zb3JMaWtlLFxuICAgIHNlZ21lbnRJZHM6IFRlbnNvcjFEfFRlbnNvckxpa2UpOiBUZW5zb3Ige1xuICBjb25zdCAkZGF0YSA9IGNvbnZlcnRUb1RlbnNvcihkYXRhLCAnZGF0YScsICdzcGFyc2VTZWdtZW50TWVhbicpO1xuICBjb25zdCAkaW5kaWNlcyA9XG4gICAgICBjb252ZXJ0VG9UZW5zb3IoaW5kaWNlcywgJ2luZGljZXMnLCAnc3BhcnNlU2VnbWVudE1lYW4nLCAnaW50MzInKTtcbiAgY29uc3QgJHNlZ21lbnRJZHMgPVxuICAgICAgY29udmVydFRvVGVuc29yKHNlZ21lbnRJZHMsICdzZWdtZW50SWRzJywgJ3NwYXJzZVNlZ21lbnRNZWFuJywgJ2ludDMyJyk7XG5cbiAgaWYgKCRkYXRhLnJhbmsgPCAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgRGF0YSBzaG91bGQgYmUgYXQgbGVhc3QgMSBkaW1lbnNpb25hbCBidXQgcmVjZWl2ZWQgc2NhbGFyYCk7XG4gIH1cbiAgaWYgKCRpbmRpY2VzLnJhbmsgIT09IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEluZGljZXMgc2hvdWxkIGJlIFRlbnNvcjFEIGJ1dCByZWNlaXZlZCBzaGFwZVxuICAgICAgICAgICR7JGluZGljZXMuc2hhcGV9YCk7XG4gIH1cbiAgaWYgKCRzZWdtZW50SWRzLnJhbmsgIT09IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFNlZ21lbnQgaWRzIHNob3VsZCBiZSBUZW5zb3IxRCBidXQgcmVjZWl2ZWQgc2hhcGVcbiAgICAgICAgICAkeyRzZWdtZW50SWRzLnNoYXBlfWApO1xuICB9XG5cbiAgY29uc3QgaW5wdXRzOiBTcGFyc2VTZWdtZW50TWVhbklucHV0cyA9IHtcbiAgICBkYXRhOiAkZGF0YSxcbiAgICBpbmRpY2VzOiAkaW5kaWNlcyxcbiAgICBzZWdtZW50SWRzOiAkc2VnbWVudElkc1xuICB9O1xuXG4gIHJldHVybiBFTkdJTkUucnVuS2VybmVsKFNwYXJzZVNlZ21lbnRNZWFuLCBpbnB1dHMgYXMge30pO1xufVxuXG5leHBvcnQgY29uc3Qgc3BhcnNlU2VnbWVudE1lYW4gPSBvcCh7c3BhcnNlU2VnbWVudE1lYW5ffSk7XG4iXX0=