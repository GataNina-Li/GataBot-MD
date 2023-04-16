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
import { convertToTensor } from '../../tensor_util_env';
import { assertShapesMatch } from '../../util';
import { add } from '../add';
import { log } from '../log';
import { Reduction } from '../loss_ops_utils';
import { mul } from '../mul';
import { neg } from '../neg';
import { op } from '../operation';
import { scalar } from '../scalar';
import { sub } from '../sub';
import { computeWeightedLoss } from './compute_weighted_loss';
/**
 * Computes the log loss between two tensors.
 *
 * @param labels The ground truth output tensor, same dimensions as
 *    'predictions'.
 * @param predictions The predicted outputs.
 * @param weights Tensor whose rank is either 0, or the same rank as
 *    `labels`, and must be broadcastable to `labels` (i.e., all dimensions
 *    must be either `1`, or the same as the corresponding `losses`
 *    dimension).
 * @param epsilon A small increment to avoid taking log of zero
 * @param reduction Type of reduction to apply to loss. Should be of type
 *    `Reduction`
 *
 * @doc {heading: 'Training', subheading: 'Losses', namespace: 'losses'}
 */
function logLoss_(labels, predictions, weights, epsilon = 1e-7, reduction = Reduction.SUM_BY_NONZERO_WEIGHTS) {
    const $labels = convertToTensor(labels, 'labels', 'logLoss');
    const $predictions = convertToTensor(predictions, 'predictions', 'logLoss');
    let $weights = null;
    if (weights != null) {
        $weights = convertToTensor(weights, 'weights', 'logLoss');
    }
    assertShapesMatch($labels.shape, $predictions.shape, 'Error in logLoss: ');
    const one = scalar(1);
    const epsilonScalar = scalar(epsilon);
    const l1 = neg(mul($labels, log(add($predictions, epsilonScalar))));
    const l2 = mul(sub(one, $labels), log(add(sub(one, $predictions), epsilonScalar)));
    const losses = sub(l1, l2);
    return computeWeightedLoss(losses, $weights, reduction);
}
export const logLoss = op({ logLoss_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nX2xvc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9sb3NzZXMvbG9nX2xvc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBR0gsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRXRELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUM3QyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzNCLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDM0IsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDM0IsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUMzQixPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ2hDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUUzQixPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUU1RDs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxTQUFTLFFBQVEsQ0FDYixNQUFvQixFQUFFLFdBQXlCLEVBQy9DLE9BQTJCLEVBQUUsT0FBTyxHQUFHLElBQUksRUFDM0MsU0FBUyxHQUFHLFNBQVMsQ0FBQyxzQkFBc0I7SUFDOUMsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDN0QsTUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLFdBQVcsRUFBRSxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDNUUsSUFBSSxRQUFRLEdBQVcsSUFBSSxDQUFDO0lBQzVCLElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtRQUNuQixRQUFRLEdBQUcsZUFBZSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDM0Q7SUFDRCxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxLQUFLLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztJQUUzRSxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEIsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXRDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLE1BQU0sRUFBRSxHQUNKLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUUsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMzQixPQUFPLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDMUQsQ0FBQztBQUNELE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsRUFBQyxRQUFRLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vLi4vdGVuc29yJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi8uLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQge2Fzc2VydFNoYXBlc01hdGNofSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7YWRkfSBmcm9tICcuLi9hZGQnO1xuaW1wb3J0IHtsb2d9IGZyb20gJy4uL2xvZyc7XG5pbXBvcnQge1JlZHVjdGlvbn0gZnJvbSAnLi4vbG9zc19vcHNfdXRpbHMnO1xuaW1wb3J0IHttdWx9IGZyb20gJy4uL211bCc7XG5pbXBvcnQge25lZ30gZnJvbSAnLi4vbmVnJztcbmltcG9ydCB7b3B9IGZyb20gJy4uL29wZXJhdGlvbic7XG5pbXBvcnQge3NjYWxhcn0gZnJvbSAnLi4vc2NhbGFyJztcbmltcG9ydCB7c3VifSBmcm9tICcuLi9zdWInO1xuXG5pbXBvcnQge2NvbXB1dGVXZWlnaHRlZExvc3N9IGZyb20gJy4vY29tcHV0ZV93ZWlnaHRlZF9sb3NzJztcblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgbG9nIGxvc3MgYmV0d2VlbiB0d28gdGVuc29ycy5cbiAqXG4gKiBAcGFyYW0gbGFiZWxzIFRoZSBncm91bmQgdHJ1dGggb3V0cHV0IHRlbnNvciwgc2FtZSBkaW1lbnNpb25zIGFzXG4gKiAgICAncHJlZGljdGlvbnMnLlxuICogQHBhcmFtIHByZWRpY3Rpb25zIFRoZSBwcmVkaWN0ZWQgb3V0cHV0cy5cbiAqIEBwYXJhbSB3ZWlnaHRzIFRlbnNvciB3aG9zZSByYW5rIGlzIGVpdGhlciAwLCBvciB0aGUgc2FtZSByYW5rIGFzXG4gKiAgICBgbGFiZWxzYCwgYW5kIG11c3QgYmUgYnJvYWRjYXN0YWJsZSB0byBgbGFiZWxzYCAoaS5lLiwgYWxsIGRpbWVuc2lvbnNcbiAqICAgIG11c3QgYmUgZWl0aGVyIGAxYCwgb3IgdGhlIHNhbWUgYXMgdGhlIGNvcnJlc3BvbmRpbmcgYGxvc3Nlc2BcbiAqICAgIGRpbWVuc2lvbikuXG4gKiBAcGFyYW0gZXBzaWxvbiBBIHNtYWxsIGluY3JlbWVudCB0byBhdm9pZCB0YWtpbmcgbG9nIG9mIHplcm9cbiAqIEBwYXJhbSByZWR1Y3Rpb24gVHlwZSBvZiByZWR1Y3Rpb24gdG8gYXBwbHkgdG8gbG9zcy4gU2hvdWxkIGJlIG9mIHR5cGVcbiAqICAgIGBSZWR1Y3Rpb25gXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ1RyYWluaW5nJywgc3ViaGVhZGluZzogJ0xvc3NlcycsIG5hbWVzcGFjZTogJ2xvc3Nlcyd9XG4gKi9cbmZ1bmN0aW9uIGxvZ0xvc3NfPFQgZXh0ZW5kcyBUZW5zb3IsIE8gZXh0ZW5kcyBUZW5zb3I+KFxuICAgIGxhYmVsczogVHxUZW5zb3JMaWtlLCBwcmVkaWN0aW9uczogVHxUZW5zb3JMaWtlLFxuICAgIHdlaWdodHM/OiBUZW5zb3J8VGVuc29yTGlrZSwgZXBzaWxvbiA9IDFlLTcsXG4gICAgcmVkdWN0aW9uID0gUmVkdWN0aW9uLlNVTV9CWV9OT05aRVJPX1dFSUdIVFMpOiBPIHtcbiAgY29uc3QgJGxhYmVscyA9IGNvbnZlcnRUb1RlbnNvcihsYWJlbHMsICdsYWJlbHMnLCAnbG9nTG9zcycpO1xuICBjb25zdCAkcHJlZGljdGlvbnMgPSBjb252ZXJ0VG9UZW5zb3IocHJlZGljdGlvbnMsICdwcmVkaWN0aW9ucycsICdsb2dMb3NzJyk7XG4gIGxldCAkd2VpZ2h0czogVGVuc29yID0gbnVsbDtcbiAgaWYgKHdlaWdodHMgIT0gbnVsbCkge1xuICAgICR3ZWlnaHRzID0gY29udmVydFRvVGVuc29yKHdlaWdodHMsICd3ZWlnaHRzJywgJ2xvZ0xvc3MnKTtcbiAgfVxuICBhc3NlcnRTaGFwZXNNYXRjaCgkbGFiZWxzLnNoYXBlLCAkcHJlZGljdGlvbnMuc2hhcGUsICdFcnJvciBpbiBsb2dMb3NzOiAnKTtcblxuICBjb25zdCBvbmUgPSBzY2FsYXIoMSk7XG4gIGNvbnN0IGVwc2lsb25TY2FsYXIgPSBzY2FsYXIoZXBzaWxvbik7XG5cbiAgY29uc3QgbDEgPSBuZWcobXVsKCRsYWJlbHMsIGxvZyhhZGQoJHByZWRpY3Rpb25zLCBlcHNpbG9uU2NhbGFyKSkpKTtcbiAgY29uc3QgbDIgPVxuICAgICAgbXVsKHN1YihvbmUsICRsYWJlbHMpLCBsb2coYWRkKHN1YihvbmUsICRwcmVkaWN0aW9ucyksIGVwc2lsb25TY2FsYXIpKSk7XG4gIGNvbnN0IGxvc3NlcyA9IHN1YihsMSwgbDIpO1xuICByZXR1cm4gY29tcHV0ZVdlaWdodGVkTG9zcyhsb3NzZXMsICR3ZWlnaHRzLCByZWR1Y3Rpb24pO1xufVxuZXhwb3J0IGNvbnN0IGxvZ0xvc3MgPSBvcCh7bG9nTG9zc199KTtcbiJdfQ==