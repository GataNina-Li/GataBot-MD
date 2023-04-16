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
import { abs } from '../abs';
import { add } from '../add';
import { exp } from '../exp';
import { log1p } from '../log1p';
import { Reduction } from '../loss_ops_utils';
import { mul } from '../mul';
import { neg } from '../neg';
import { op } from '../operation';
import { relu } from '../relu';
import { scalar } from '../scalar';
import { sub } from '../sub';
import { computeWeightedLoss } from './compute_weighted_loss';
function sigmoidCrossEntropyWithLogits_(labels, logits) {
    const $labels = convertToTensor(labels, 'labels', 'sigmoidCrossEntropyWithLogits');
    const $logits = convertToTensor(logits, 'logits', 'sigmoidCrossEntropyWithLogits');
    assertShapesMatch($labels.shape, $logits.shape, 'Error in sigmoidCrossEntropyWithLogits: ');
    /**
     * Implementation Details:
     *
     * For brevity, let `x = logits`, `z = labels`.  The logistic loss is
     *     z * -log(sigmoid(x)) + (1 - z) * -log(1 - sigmoid(x))
     *   = z * -log(1 / (1 + exp(-x))) + (1 - z) * -log(exp(-x) / (1 + exp(-x)))
     *   = z * log(1 + exp(-x)) + (1 - z) * (-log(exp(-x)) + log(1 + exp(-x)))
     *   = z * log(1 + exp(-x)) + (1 - z) * (x + log(1 + exp(-x))
     *   = (1 - z) * x + log(1 + exp(-x))
     *   = x - x * z + log(1 + exp(-x))
     *
     *   For x < 0, to avoid overflow in exp(-x), we reformulate the above
     *     x - x * z + log(1 + exp(-x))
     *   = log(exp(x)) - x * z + log(1 + exp(-x))
     *   = - x * z + log(1 + exp(x))
     *
     * Hence, to ensure stability and avoid overflow, the implementation uses
     * this equivalent formulation:
     *     max(x, 0) - x * z + log(1 + exp(-abs(x)))
     */
    const maxOutput = relu($logits);
    const outputXTarget = mul($logits, $labels);
    const sigmoidOutput = log1p(exp(neg(abs($logits))));
    return add(sub(maxOutput, outputXTarget), sigmoidOutput);
}
/**
 * Computes the sigmoid cross entropy loss between two tensors.
 *
 * If labelSmoothing is nonzero, smooth the labels towards 1/2:
 *
 *   newMulticlassLabels = multiclassLabels * (1 - labelSmoothing)
 *                         + 0.5 * labelSmoothing
 *
 * @param multiClassLabels The ground truth output tensor of shape
 * [batch_size, num_classes], same dimensions as 'predictions'.
 * @param logits The predicted outputs.
 * @param weights Tensor whose rank is either 0, or the same rank as
 *    `labels`, and must be broadcastable to `labels` (i.e., all dimensions
 *    must be either `1`, or the same as the corresponding `losses`
 *    dimension).
 * @param labelSmoothing If greater than 0, then smooth the labels.
 * @param reduction Type of reduction to apply to loss. Should be of type
 *    `Reduction`
 *
 * @doc { heading: 'Training', subheading: 'Losses', namespace: 'losses' }
 */
function sigmoidCrossEntropy_(multiClassLabels, logits, weights, labelSmoothing = 0, reduction = Reduction.SUM_BY_NONZERO_WEIGHTS) {
    let $multiClassLabels = convertToTensor(multiClassLabels, 'multiClassLabels', 'sigmoidCrossEntropy');
    const $logits = convertToTensor(logits, 'logits', 'sigmoidCrossEntropy');
    let $weights = null;
    if (weights != null) {
        $weights = convertToTensor(weights, 'weights', 'sigmoidCrossEntropy');
    }
    assertShapesMatch($multiClassLabels.shape, $logits.shape, 'Error in sigmoidCrossEntropy: ');
    if (labelSmoothing > 0) {
        const labelSmoothingScalar = scalar(labelSmoothing);
        const one = scalar(1);
        const half = scalar(0.5);
        $multiClassLabels =
            add(mul($multiClassLabels, sub(one, labelSmoothingScalar)), mul(half, labelSmoothingScalar));
    }
    const losses = sigmoidCrossEntropyWithLogits_($multiClassLabels, $logits);
    return computeWeightedLoss(losses, $weights, reduction);
}
export const sigmoidCrossEntropy = op({ sigmoidCrossEntropy_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbW9pZF9jcm9zc19lbnRyb3B5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvbG9zc2VzL3NpZ21vaWRfY3Jvc3NfZW50cm9weS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFHSCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFdEQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQzdDLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDM0IsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUMzQixPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzNCLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDL0IsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDM0IsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUMzQixPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ2hDLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDN0IsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBRTNCLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBRTVELFNBQVMsOEJBQThCLENBQ25DLE1BQW9CLEVBQUUsTUFBb0I7SUFDNUMsTUFBTSxPQUFPLEdBQ1QsZUFBZSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsK0JBQStCLENBQUMsQ0FBQztJQUN2RSxNQUFNLE9BQU8sR0FDVCxlQUFlLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSwrQkFBK0IsQ0FBQyxDQUFDO0lBQ3ZFLGlCQUFpQixDQUNiLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSwwQ0FBMEMsQ0FBQyxDQUFDO0lBRTlFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BbUJHO0lBQ0gsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2hDLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDNUMsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXBELE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9CRztBQUNILFNBQVMsb0JBQW9CLENBQ3pCLGdCQUE4QixFQUFFLE1BQW9CLEVBQ3BELE9BQTJCLEVBQUUsY0FBYyxHQUFHLENBQUMsRUFDL0MsU0FBUyxHQUFHLFNBQVMsQ0FBQyxzQkFBc0I7SUFDOUMsSUFBSSxpQkFBaUIsR0FBRyxlQUFlLENBQ25DLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLHFCQUFxQixDQUFDLENBQUM7SUFDakUsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUscUJBQXFCLENBQUMsQ0FBQztJQUN6RSxJQUFJLFFBQVEsR0FBVyxJQUFJLENBQUM7SUFDNUIsSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFO1FBQ25CLFFBQVEsR0FBRyxlQUFlLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0tBQ3ZFO0lBQ0QsaUJBQWlCLENBQ2IsaUJBQWlCLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztJQUU5RSxJQUFJLGNBQWMsR0FBRyxDQUFDLEVBQUU7UUFDdEIsTUFBTSxvQkFBb0IsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDcEQsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV6QixpQkFBaUI7WUFDYixHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyxFQUN0RCxHQUFHLENBQUMsSUFBSSxFQUFFLG9CQUFvQixDQUFDLENBQUMsQ0FBQztLQUMxQztJQUNELE1BQU0sTUFBTSxHQUFHLDhCQUE4QixDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRTFFLE9BQU8sbUJBQW1CLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDLEVBQUMsb0JBQW9CLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vLi4vdGVuc29yJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi8uLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQge2Fzc2VydFNoYXBlc01hdGNofSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7YWJzfSBmcm9tICcuLi9hYnMnO1xuaW1wb3J0IHthZGR9IGZyb20gJy4uL2FkZCc7XG5pbXBvcnQge2V4cH0gZnJvbSAnLi4vZXhwJztcbmltcG9ydCB7bG9nMXB9IGZyb20gJy4uL2xvZzFwJztcbmltcG9ydCB7UmVkdWN0aW9ufSBmcm9tICcuLi9sb3NzX29wc191dGlscyc7XG5pbXBvcnQge211bH0gZnJvbSAnLi4vbXVsJztcbmltcG9ydCB7bmVnfSBmcm9tICcuLi9uZWcnO1xuaW1wb3J0IHtvcH0gZnJvbSAnLi4vb3BlcmF0aW9uJztcbmltcG9ydCB7cmVsdX0gZnJvbSAnLi4vcmVsdSc7XG5pbXBvcnQge3NjYWxhcn0gZnJvbSAnLi4vc2NhbGFyJztcbmltcG9ydCB7c3VifSBmcm9tICcuLi9zdWInO1xuXG5pbXBvcnQge2NvbXB1dGVXZWlnaHRlZExvc3N9IGZyb20gJy4vY29tcHV0ZV93ZWlnaHRlZF9sb3NzJztcblxuZnVuY3Rpb24gc2lnbW9pZENyb3NzRW50cm9weVdpdGhMb2dpdHNfPFQgZXh0ZW5kcyBUZW5zb3IsIE8gZXh0ZW5kcyBUZW5zb3I+KFxuICAgIGxhYmVsczogVHxUZW5zb3JMaWtlLCBsb2dpdHM6IFR8VGVuc29yTGlrZSk6IE8ge1xuICBjb25zdCAkbGFiZWxzID1cbiAgICAgIGNvbnZlcnRUb1RlbnNvcihsYWJlbHMsICdsYWJlbHMnLCAnc2lnbW9pZENyb3NzRW50cm9weVdpdGhMb2dpdHMnKTtcbiAgY29uc3QgJGxvZ2l0cyA9XG4gICAgICBjb252ZXJ0VG9UZW5zb3IobG9naXRzLCAnbG9naXRzJywgJ3NpZ21vaWRDcm9zc0VudHJvcHlXaXRoTG9naXRzJyk7XG4gIGFzc2VydFNoYXBlc01hdGNoKFxuICAgICAgJGxhYmVscy5zaGFwZSwgJGxvZ2l0cy5zaGFwZSwgJ0Vycm9yIGluIHNpZ21vaWRDcm9zc0VudHJvcHlXaXRoTG9naXRzOiAnKTtcblxuICAvKipcbiAgICogSW1wbGVtZW50YXRpb24gRGV0YWlsczpcbiAgICpcbiAgICogRm9yIGJyZXZpdHksIGxldCBgeCA9IGxvZ2l0c2AsIGB6ID0gbGFiZWxzYC4gIFRoZSBsb2dpc3RpYyBsb3NzIGlzXG4gICAqICAgICB6ICogLWxvZyhzaWdtb2lkKHgpKSArICgxIC0geikgKiAtbG9nKDEgLSBzaWdtb2lkKHgpKVxuICAgKiAgID0geiAqIC1sb2coMSAvICgxICsgZXhwKC14KSkpICsgKDEgLSB6KSAqIC1sb2coZXhwKC14KSAvICgxICsgZXhwKC14KSkpXG4gICAqICAgPSB6ICogbG9nKDEgKyBleHAoLXgpKSArICgxIC0geikgKiAoLWxvZyhleHAoLXgpKSArIGxvZygxICsgZXhwKC14KSkpXG4gICAqICAgPSB6ICogbG9nKDEgKyBleHAoLXgpKSArICgxIC0geikgKiAoeCArIGxvZygxICsgZXhwKC14KSlcbiAgICogICA9ICgxIC0geikgKiB4ICsgbG9nKDEgKyBleHAoLXgpKVxuICAgKiAgID0geCAtIHggKiB6ICsgbG9nKDEgKyBleHAoLXgpKVxuICAgKlxuICAgKiAgIEZvciB4IDwgMCwgdG8gYXZvaWQgb3ZlcmZsb3cgaW4gZXhwKC14KSwgd2UgcmVmb3JtdWxhdGUgdGhlIGFib3ZlXG4gICAqICAgICB4IC0geCAqIHogKyBsb2coMSArIGV4cCgteCkpXG4gICAqICAgPSBsb2coZXhwKHgpKSAtIHggKiB6ICsgbG9nKDEgKyBleHAoLXgpKVxuICAgKiAgID0gLSB4ICogeiArIGxvZygxICsgZXhwKHgpKVxuICAgKlxuICAgKiBIZW5jZSwgdG8gZW5zdXJlIHN0YWJpbGl0eSBhbmQgYXZvaWQgb3ZlcmZsb3csIHRoZSBpbXBsZW1lbnRhdGlvbiB1c2VzXG4gICAqIHRoaXMgZXF1aXZhbGVudCBmb3JtdWxhdGlvbjpcbiAgICogICAgIG1heCh4LCAwKSAtIHggKiB6ICsgbG9nKDEgKyBleHAoLWFicyh4KSkpXG4gICAqL1xuICBjb25zdCBtYXhPdXRwdXQgPSByZWx1KCRsb2dpdHMpO1xuICBjb25zdCBvdXRwdXRYVGFyZ2V0ID0gbXVsKCRsb2dpdHMsICRsYWJlbHMpO1xuICBjb25zdCBzaWdtb2lkT3V0cHV0ID0gbG9nMXAoZXhwKG5lZyhhYnMoJGxvZ2l0cykpKSk7XG5cbiAgcmV0dXJuIGFkZChzdWIobWF4T3V0cHV0LCBvdXRwdXRYVGFyZ2V0KSwgc2lnbW9pZE91dHB1dCk7XG59XG5cbi8qKlxuICogQ29tcHV0ZXMgdGhlIHNpZ21vaWQgY3Jvc3MgZW50cm9weSBsb3NzIGJldHdlZW4gdHdvIHRlbnNvcnMuXG4gKlxuICogSWYgbGFiZWxTbW9vdGhpbmcgaXMgbm9uemVybywgc21vb3RoIHRoZSBsYWJlbHMgdG93YXJkcyAxLzI6XG4gKlxuICogICBuZXdNdWx0aWNsYXNzTGFiZWxzID0gbXVsdGljbGFzc0xhYmVscyAqICgxIC0gbGFiZWxTbW9vdGhpbmcpXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICArIDAuNSAqIGxhYmVsU21vb3RoaW5nXG4gKlxuICogQHBhcmFtIG11bHRpQ2xhc3NMYWJlbHMgVGhlIGdyb3VuZCB0cnV0aCBvdXRwdXQgdGVuc29yIG9mIHNoYXBlXG4gKiBbYmF0Y2hfc2l6ZSwgbnVtX2NsYXNzZXNdLCBzYW1lIGRpbWVuc2lvbnMgYXMgJ3ByZWRpY3Rpb25zJy5cbiAqIEBwYXJhbSBsb2dpdHMgVGhlIHByZWRpY3RlZCBvdXRwdXRzLlxuICogQHBhcmFtIHdlaWdodHMgVGVuc29yIHdob3NlIHJhbmsgaXMgZWl0aGVyIDAsIG9yIHRoZSBzYW1lIHJhbmsgYXNcbiAqICAgIGBsYWJlbHNgLCBhbmQgbXVzdCBiZSBicm9hZGNhc3RhYmxlIHRvIGBsYWJlbHNgIChpLmUuLCBhbGwgZGltZW5zaW9uc1xuICogICAgbXVzdCBiZSBlaXRoZXIgYDFgLCBvciB0aGUgc2FtZSBhcyB0aGUgY29ycmVzcG9uZGluZyBgbG9zc2VzYFxuICogICAgZGltZW5zaW9uKS5cbiAqIEBwYXJhbSBsYWJlbFNtb290aGluZyBJZiBncmVhdGVyIHRoYW4gMCwgdGhlbiBzbW9vdGggdGhlIGxhYmVscy5cbiAqIEBwYXJhbSByZWR1Y3Rpb24gVHlwZSBvZiByZWR1Y3Rpb24gdG8gYXBwbHkgdG8gbG9zcy4gU2hvdWxkIGJlIG9mIHR5cGVcbiAqICAgIGBSZWR1Y3Rpb25gXG4gKlxuICogQGRvYyB7IGhlYWRpbmc6ICdUcmFpbmluZycsIHN1YmhlYWRpbmc6ICdMb3NzZXMnLCBuYW1lc3BhY2U6ICdsb3NzZXMnIH1cbiAqL1xuZnVuY3Rpb24gc2lnbW9pZENyb3NzRW50cm9weV88VCBleHRlbmRzIFRlbnNvciwgTyBleHRlbmRzIFRlbnNvcj4oXG4gICAgbXVsdGlDbGFzc0xhYmVsczogVHxUZW5zb3JMaWtlLCBsb2dpdHM6IFR8VGVuc29yTGlrZSxcbiAgICB3ZWlnaHRzPzogVGVuc29yfFRlbnNvckxpa2UsIGxhYmVsU21vb3RoaW5nID0gMCxcbiAgICByZWR1Y3Rpb24gPSBSZWR1Y3Rpb24uU1VNX0JZX05PTlpFUk9fV0VJR0hUUyk6IE8ge1xuICBsZXQgJG11bHRpQ2xhc3NMYWJlbHMgPSBjb252ZXJ0VG9UZW5zb3IoXG4gICAgICBtdWx0aUNsYXNzTGFiZWxzLCAnbXVsdGlDbGFzc0xhYmVscycsICdzaWdtb2lkQ3Jvc3NFbnRyb3B5Jyk7XG4gIGNvbnN0ICRsb2dpdHMgPSBjb252ZXJ0VG9UZW5zb3IobG9naXRzLCAnbG9naXRzJywgJ3NpZ21vaWRDcm9zc0VudHJvcHknKTtcbiAgbGV0ICR3ZWlnaHRzOiBUZW5zb3IgPSBudWxsO1xuICBpZiAod2VpZ2h0cyAhPSBudWxsKSB7XG4gICAgJHdlaWdodHMgPSBjb252ZXJ0VG9UZW5zb3Iod2VpZ2h0cywgJ3dlaWdodHMnLCAnc2lnbW9pZENyb3NzRW50cm9weScpO1xuICB9XG4gIGFzc2VydFNoYXBlc01hdGNoKFxuICAgICAgJG11bHRpQ2xhc3NMYWJlbHMuc2hhcGUsICRsb2dpdHMuc2hhcGUsICdFcnJvciBpbiBzaWdtb2lkQ3Jvc3NFbnRyb3B5OiAnKTtcblxuICBpZiAobGFiZWxTbW9vdGhpbmcgPiAwKSB7XG4gICAgY29uc3QgbGFiZWxTbW9vdGhpbmdTY2FsYXIgPSBzY2FsYXIobGFiZWxTbW9vdGhpbmcpO1xuICAgIGNvbnN0IG9uZSA9IHNjYWxhcigxKTtcbiAgICBjb25zdCBoYWxmID0gc2NhbGFyKDAuNSk7XG5cbiAgICAkbXVsdGlDbGFzc0xhYmVscyA9XG4gICAgICAgIGFkZChtdWwoJG11bHRpQ2xhc3NMYWJlbHMsIHN1YihvbmUsIGxhYmVsU21vb3RoaW5nU2NhbGFyKSksXG4gICAgICAgICAgICBtdWwoaGFsZiwgbGFiZWxTbW9vdGhpbmdTY2FsYXIpKTtcbiAgfVxuICBjb25zdCBsb3NzZXMgPSBzaWdtb2lkQ3Jvc3NFbnRyb3B5V2l0aExvZ2l0c18oJG11bHRpQ2xhc3NMYWJlbHMsICRsb2dpdHMpO1xuXG4gIHJldHVybiBjb21wdXRlV2VpZ2h0ZWRMb3NzKGxvc3NlcywgJHdlaWdodHMsIHJlZHVjdGlvbik7XG59XG5cbmV4cG9ydCBjb25zdCBzaWdtb2lkQ3Jvc3NFbnRyb3B5ID0gb3Aoe3NpZ21vaWRDcm9zc0VudHJvcHlffSk7XG4iXX0=