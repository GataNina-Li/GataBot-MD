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
import { customGrad } from '../../gradients';
import { convertToTensor } from '../../tensor_util_env';
import { assertShapesMatch } from '../../util';
import { add } from '../add';
import { expandShapeToKeepDim } from '../axis_util';
import { cast } from '../cast';
import { div } from '../div';
import { exp } from '../exp';
import { logSumExp } from '../log_sum_exp';
import { Reduction } from '../loss_ops_utils';
import { mul } from '../mul';
import { neg } from '../neg';
import { op } from '../operation';
import { reshape } from '../reshape';
import { scalar } from '../scalar';
import { sub } from '../sub';
import { sum } from '../sum';
import { computeWeightedLoss } from './compute_weighted_loss';
/**
 * Computes softmax cross entropy between logits and labels.
 *
 * Measures the probability error in discrete classification tasks in which
 * the classes are mutually exclusive (each entry is in exactly one class).
 * For example, each CIFAR-10 image is labeled with one and only one label: an
 * image can be a dog or a truck, but not both.
 *
 * `NOTE`: While the classes are mutually exclusive, their probabilities need
 * not be. All that is required is that each row of labels is a valid
 * probability distribution. If they are not, the computation of the gradient
 * will be incorrect.
 *
 * `WARNING`: This op expects unscaled logits, since it performs a softmax on
 * logits internally for efficiency. Do not call this op with the output of
 * softmax, as it will produce incorrect results.
 *
 * logits and labels must have the same shape, e.g. [batch_size, num_classes]
 * and the same dtype.
 * @param labels The labels array.
 * @param logits The logits array.
 * @param dim The dimension softmax would be performed on. Defaults to `-1`
 *     which indicates the last dimension.
 */
function softmaxCrossEntropyWithLogits_(labels, logits, dim = -1) {
    if (dim === -1) {
        dim = logits.rank - 1;
    }
    if (dim !== logits.rank - 1) {
        throw Error(`Softmax cross entropy along a non-last dimension is not yet ` +
            `supported. Labels / logits was rank ${logits.rank} ` +
            `and dim was ${dim}`);
    }
    // Use a custom gradient for numerical stability.
    const customOp = customGrad((labels, logits, save) => {
        // Reference:
        //   1. http://cs231n.github.io/linear-classify/#softmax
        //   2. https://blog.feedly.com/tricks-of-the-trade-logsumexp/
        const keepDims = true;
        const lse = logSumExp(logits, [dim], keepDims);
        const logResult = sub(cast(logits, 'float32'), lse);
        save([labels, logResult]);
        const costVector = neg(mul(logResult, labels));
        const value = sum(costVector, [dim]);
        const gradFunc = (dy, saved) => {
            const [labels, logResult] = saved;
            const dyShape = expandShapeToKeepDim(dy.shape, [dim]);
            return [
                mul(reshape(dy, dyShape), sub(cast(labels, 'float32'), exp(logResult))),
                mul(reshape(dy, dyShape), sub(exp(logResult), cast(labels, 'float32'))),
            ];
        };
        return { value, gradFunc };
    });
    return customOp(labels, logits);
}
/**
 * Computes the softmax cross entropy loss between two tensors.
 *
 * If labelSmoothing is nonzero, smooth the labels towards 1/2:
 *
 *   newOnehotLabels = onehotLabels * (1 - labelSmoothing)
 *                         + labelSmoothing / numClasses
 *
 * @param onehotLabels One hot encoded labels
 *    [batch_size, num_classes], same dimensions as 'predictions'.
 * @param logits The predicted outputs.
 * @param weights Tensor whose rank is either 0, or 1, and must be
 *    broadcastable to `loss`  of shape [batch_size]
 * @param labelSmoothing If greater than 0, then smooth the labels.
 * @param reduction Type of reduction to apply to loss. Should be of type
 *    `Reduction`
 *
 * @doc { heading: 'Training', subheading: 'Losses', namespace: 'losses' }
 */
function softmaxCrossEntropy_(onehotLabels, logits, weights, labelSmoothing = 0, reduction = Reduction.SUM_BY_NONZERO_WEIGHTS) {
    let $onehotLabels = convertToTensor(onehotLabels, 'onehotLabels', 'softmaxCrossEntropy');
    const $logits = convertToTensor(logits, 'logits', 'softmaxCrossEntropy');
    let $weights = null;
    if (weights != null) {
        $weights = convertToTensor(weights, 'weights', 'softmaxCrossEntropy');
    }
    assertShapesMatch($onehotLabels.shape, $logits.shape, 'Error in softmaxCrossEntropy: ');
    if (labelSmoothing > 0) {
        const labelSmoothingScalar = scalar(labelSmoothing);
        const one = scalar(1);
        const numClasses = scalar($onehotLabels.shape[1]);
        $onehotLabels =
            add(mul($onehotLabels, sub(one, labelSmoothingScalar)), div(labelSmoothingScalar, numClasses));
    }
    const losses = softmaxCrossEntropyWithLogits_($onehotLabels, $logits);
    return computeWeightedLoss(losses, $weights, reduction);
}
export const softmaxCrossEntropy = op({ softmaxCrossEntropy_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29mdG1heF9jcm9zc19lbnRyb3B5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvbG9zc2VzL3NvZnRtYXhfY3Jvc3NfZW50cm9weS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFHM0MsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRXRELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUM3QyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzNCLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUNsRCxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQzdCLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDM0IsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUMzQixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDekMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDM0IsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUMzQixPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ2hDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDbkMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzNCLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxRQUFRLENB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QixRQUFRLEdBQUcsZUFBZSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUscUJBQXFCLENBQUMsQ0FBQztLQUN2RTtJQUVELGlCQUFpQixDQUNiLGFBQWEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO0lBRTFFLElBQUksY0FBYyxHQUFHLENBQUMsRUFBRTtRQUN0QixNQUFNLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNwRCxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVsRCxhQUFhO1lBQ1QsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDLEVBQ2xELEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO0tBQ2hEO0lBRUQsTUFBTSxNQUFNLEdBQUcsOEJBQThCLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRXRFLE9BQU8sbUJBQW1CLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDLEVBQUMsb0JBQW9CLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuaW1wb3J0IHtjdXN0b21HcmFkfSBmcm9tICcuLi8uLi9ncmFkaWVudHMnO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uLy4uL3RlbnNvcic7XG5pbXBvcnQge0dyYWRTYXZlRnVuY30gZnJvbSAnLi4vLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi8uLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQge2Fzc2VydFNoYXBlc01hdGNofSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7YWRkfSBmcm9tICcuLi9hZGQnO1xuaW1wb3J0IHtleHBhbmRTaGFwZVRvS2VlcERpbX0gZnJvbSAnLi4vYXhpc191dGlsJztcbmltcG9ydCB7Y2FzdH0gZnJvbSAnLi4vY2FzdCc7XG5pbXBvcnQge2Rpdn0gZnJvbSAnLi4vZGl2JztcbmltcG9ydCB7ZXhwfSBmcm9tICcuLi9leHAnO1xuaW1wb3J0IHtsb2dTdW1FeHB9IGZyb20gJy4uL2xvZ19zdW1fZXhwJztcbmltcG9ydCB7UmVkdWN0aW9ufSBmcm9tICcuLi9sb3NzX29wc191dGlscyc7XG5pbXBvcnQge211bH0gZnJvbSAnLi4vbXVsJztcbmltcG9ydCB7bmVnfSBmcm9tICcuLi9uZWcnO1xuaW1wb3J0IHtvcH0gZnJvbSAnLi4vb3BlcmF0aW9uJztcbmltcG9ydCB7cmVzaGFwZX0gZnJvbSAnLi4vcmVzaGFwZSc7XG5pbXBvcnQge3NjYWxhcn0gZnJvbSAnLi4vc2NhbGFyJztcbmltcG9ydCB7c3VifSBmcm9tICcuLi9zdWInO1xuaW1wb3J0IHtzdW19IGZyb20gJy4uL3N1bSc7XG5cbmltcG9ydCB7Y29tcHV0ZVdlaWdodGVkTG9zc30gZnJvbSAnLi9jb21wdXRlX3dlaWdodGVkX2xvc3MnO1xuXG4vKipcbiAqIENvbXB1dGVzIHNvZnRtYXggY3Jvc3MgZW50cm9weSBiZXR3ZWVuIGxvZ2l0cyBhbmQgbGFiZWxzLlxuICpcbiAqIE1lYXN1cmVzIHRoZSBwcm9iYWJpbGl0eSBlcnJvciBpbiBkaXNjcmV0ZSBjbGFzc2lmaWNhdGlvbiB0YXNrcyBpbiB3aGljaFxuICogdGhlIGNsYXNzZXMgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZSAoZWFjaCBlbnRyeSBpcyBpbiBleGFjdGx5IG9uZSBjbGFzcykuXG4gKiBGb3IgZXhhbXBsZSwgZWFjaCBDSUZBUi0xMCBpbWFnZSBpcyBsYWJlbGVkIHdpdGggb25lIGFuZCBvbmx5IG9uZSBsYWJlbDogYW5cbiAqIGltYWdlIGNhbiBiZSBhIGRvZyBvciBhIHRydWNrLCBidXQgbm90IGJvdGguXG4gKlxuICogYE5PVEVgOiBXaGlsZSB0aGUgY2xhc3NlcyBhcmUgbXV0dWFsbHkgZXhjbHVzaXZlLCB0aGVpciBwcm9iYWJpbGl0aWVzIG5lZWRcbiAqIG5vdCBiZS4gQWxsIHRoYXQgaXMgcmVxdWlyZWQgaXMgdGhhdCBlYWNoIHJvdyBvZiBsYWJlbHMgaXMgYSB2YWxpZFxuICogcHJvYmFiaWxpdHkgZGlzdHJpYnV0aW9uLiBJZiB0aGV5IGFyZSBub3QsIHRoZSBjb21wdXRhdGlvbiBvZiB0aGUgZ3JhZGllbnRcbiAqIHdpbGwgYmUgaW5jb3JyZWN0LlxuICpcbiAqIGBXQVJOSU5HYDogVGhpcyBvcCBleHBlY3RzIHVuc2NhbGVkIGxvZ2l0cywgc2luY2UgaXQgcGVyZm9ybXMgYSBzb2Z0bWF4IG9uXG4gKiBsb2dpdHMgaW50ZXJuYWxseSBmb3IgZWZmaWNpZW5jeS4gRG8gbm90IGNhbGwgdGhpcyBvcCB3aXRoIHRoZSBvdXRwdXQgb2ZcbiAqIHNvZnRtYXgsIGFzIGl0IHdpbGwgcHJvZHVjZSBpbmNvcnJlY3QgcmVzdWx0cy5cbiAqXG4gKiBsb2dpdHMgYW5kIGxhYmVscyBtdXN0IGhhdmUgdGhlIHNhbWUgc2hhcGUsIGUuZy4gW2JhdGNoX3NpemUsIG51bV9jbGFzc2VzXVxuICogYW5kIHRoZSBzYW1lIGR0eXBlLlxuICogQHBhcmFtIGxhYmVscyBUaGUgbGFiZWxzIGFycmF5LlxuICogQHBhcmFtIGxvZ2l0cyBUaGUgbG9naXRzIGFycmF5LlxuICogQHBhcmFtIGRpbSBUaGUgZGltZW5zaW9uIHNvZnRtYXggd291bGQgYmUgcGVyZm9ybWVkIG9uLiBEZWZhdWx0cyB0byBgLTFgXG4gKiAgICAgd2hpY2ggaW5kaWNhdGVzIHRoZSBsYXN0IGRpbWVuc2lvbi5cbiAqL1xuZnVuY3Rpb24gc29mdG1heENyb3NzRW50cm9weVdpdGhMb2dpdHNfPFQgZXh0ZW5kcyBUZW5zb3IsIE8gZXh0ZW5kcyBUZW5zb3I+KFxuICAgIGxhYmVsczogVCwgbG9naXRzOiBULCBkaW0gPSAtMSk6IE8ge1xuICBpZiAoZGltID09PSAtMSkge1xuICAgIGRpbSA9IGxvZ2l0cy5yYW5rIC0gMTtcbiAgfVxuXG4gIGlmIChkaW0gIT09IGxvZ2l0cy5yYW5rIC0gMSkge1xuICAgIHRocm93IEVycm9yKFxuICAgICAgICBgU29mdG1heCBjcm9zcyBlbnRyb3B5IGFsb25nIGEgbm9uLWxhc3QgZGltZW5zaW9uIGlzIG5vdCB5ZXQgYCArXG4gICAgICAgIGBzdXBwb3J0ZWQuIExhYmVscyAvIGxvZ2l0cyB3YXMgcmFuayAke2xvZ2l0cy5yYW5rfSBgICtcbiAgICAgICAgYGFuZCBkaW0gd2FzICR7ZGltfWApO1xuICB9XG4gIC8vIFVzZSBhIGN1c3RvbSBncmFkaWVudCBmb3IgbnVtZXJpY2FsIHN0YWJpbGl0eS5cbiAgY29uc3QgY3VzdG9tT3AgPVxuICAgICAgY3VzdG9tR3JhZCgobGFiZWxzOiBUZW5zb3IsIGxvZ2l0czogVGVuc29yLCBzYXZlOiBHcmFkU2F2ZUZ1bmMpID0+IHtcbiAgICAgICAgLy8gUmVmZXJlbmNlOlxuICAgICAgICAvLyAgIDEuIGh0dHA6Ly9jczIzMW4uZ2l0aHViLmlvL2xpbmVhci1jbGFzc2lmeS8jc29mdG1heFxuICAgICAgICAvLyAgIDIuIGh0dHBzOi8vYmxvZy5mZWVkbHkuY29tL3RyaWNrcy1vZi10aGUtdHJhZGUtbG9nc3VtZXhwL1xuICAgICAgICBjb25zdCBrZWVwRGltcyA9IHRydWU7XG4gICAgICAgIGNvbnN0IGxzZSA9IGxvZ1N1bUV4cChsb2dpdHMsIFtkaW1dLCBrZWVwRGltcyk7XG4gICAgICAgIGNvbnN0IGxvZ1Jlc3VsdCA9IHN1YihjYXN0KGxvZ2l0cywgJ2Zsb2F0MzInKSwgbHNlKTtcbiAgICAgICAgc2F2ZShbbGFiZWxzLCBsb2dSZXN1bHRdKTtcblxuICAgICAgICBjb25zdCBjb3N0VmVjdG9yID0gbmVnKG11bChsb2dSZXN1bHQsIGxhYmVscykpO1xuICAgICAgICBjb25zdCB2YWx1ZTogTyA9IHN1bShjb3N0VmVjdG9yLCBbZGltXSk7XG5cbiAgICAgICAgY29uc3QgZ3JhZEZ1bmMgPSAoZHk6IE8sIHNhdmVkOiBUZW5zb3JbXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IFtsYWJlbHMsIGxvZ1Jlc3VsdF0gPSBzYXZlZDtcbiAgICAgICAgICBjb25zdCBkeVNoYXBlID0gZXhwYW5kU2hhcGVUb0tlZXBEaW0oZHkuc2hhcGUsIFtkaW1dKTtcbiAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbXVsKHJlc2hhcGUoZHksIGR5U2hhcGUpLFxuICAgICAgICAgICAgICAgIHN1YihjYXN0KGxhYmVscywgJ2Zsb2F0MzInKSwgZXhwKGxvZ1Jlc3VsdCkpKSxcbiAgICAgICAgICAgIG11bChyZXNoYXBlKGR5LCBkeVNoYXBlKSxcbiAgICAgICAgICAgICAgICBzdWIoZXhwKGxvZ1Jlc3VsdCksIGNhc3QobGFiZWxzLCAnZmxvYXQzMicpKSksXG4gICAgICAgICAgXTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHt2YWx1ZSwgZ3JhZEZ1bmN9O1xuICAgICAgfSk7XG5cbiAgcmV0dXJuIGN1c3RvbU9wKGxhYmVscywgbG9naXRzKTtcbn1cblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgc29mdG1heCBjcm9zcyBlbnRyb3B5IGxvc3MgYmV0d2VlbiB0d28gdGVuc29ycy5cbiAqXG4gKiBJZiBsYWJlbFNtb290aGluZyBpcyBub256ZXJvLCBzbW9vdGggdGhlIGxhYmVscyB0b3dhcmRzIDEvMjpcbiAqXG4gKiAgIG5ld09uZWhvdExhYmVscyA9IG9uZWhvdExhYmVscyAqICgxIC0gbGFiZWxTbW9vdGhpbmcpXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICArIGxhYmVsU21vb3RoaW5nIC8gbnVtQ2xhc3Nlc1xuICpcbiAqIEBwYXJhbSBvbmVob3RMYWJlbHMgT25lIGhvdCBlbmNvZGVkIGxhYmVsc1xuICogICAgW2JhdGNoX3NpemUsIG51bV9jbGFzc2VzXSwgc2FtZSBkaW1lbnNpb25zIGFzICdwcmVkaWN0aW9ucycuXG4gKiBAcGFyYW0gbG9naXRzIFRoZSBwcmVkaWN0ZWQgb3V0cHV0cy5cbiAqIEBwYXJhbSB3ZWlnaHRzIFRlbnNvciB3aG9zZSByYW5rIGlzIGVpdGhlciAwLCBvciAxLCBhbmQgbXVzdCBiZVxuICogICAgYnJvYWRjYXN0YWJsZSB0byBgbG9zc2AgIG9mIHNoYXBlIFtiYXRjaF9zaXplXVxuICogQHBhcmFtIGxhYmVsU21vb3RoaW5nIElmIGdyZWF0ZXIgdGhhbiAwLCB0aGVuIHNtb290aCB0aGUgbGFiZWxzLlxuICogQHBhcmFtIHJlZHVjdGlvbiBUeXBlIG9mIHJlZHVjdGlvbiB0byBhcHBseSB0byBsb3NzLiBTaG91bGQgYmUgb2YgdHlwZVxuICogICAgYFJlZHVjdGlvbmBcbiAqXG4gKiBAZG9jIHsgaGVhZGluZzogJ1RyYWluaW5nJywgc3ViaGVhZGluZzogJ0xvc3NlcycsIG5hbWVzcGFjZTogJ2xvc3NlcycgfVxuICovXG5mdW5jdGlvbiBzb2Z0bWF4Q3Jvc3NFbnRyb3B5XzxUIGV4dGVuZHMgVGVuc29yLCBPIGV4dGVuZHMgVGVuc29yPihcbiAgICBvbmVob3RMYWJlbHM6IFR8VGVuc29yTGlrZSwgbG9naXRzOiBUfFRlbnNvckxpa2UsXG4gICAgd2VpZ2h0cz86IFRlbnNvcnxUZW5zb3JMaWtlLCBsYWJlbFNtb290aGluZyA9IDAsXG4gICAgcmVkdWN0aW9uID0gUmVkdWN0aW9uLlNVTV9CWV9OT05aRVJPX1dFSUdIVFMpOiBPIHtcbiAgbGV0ICRvbmVob3RMYWJlbHMgPVxuICAgICAgY29udmVydFRvVGVuc29yKG9uZWhvdExhYmVscywgJ29uZWhvdExhYmVscycsICdzb2Z0bWF4Q3Jvc3NFbnRyb3B5Jyk7XG4gIGNvbnN0ICRsb2dpdHMgPSBjb252ZXJ0VG9UZW5zb3IobG9naXRzLCAnbG9naXRzJywgJ3NvZnRtYXhDcm9zc0VudHJvcHknKTtcbiAgbGV0ICR3ZWlnaHRzOiBUZW5zb3IgPSBudWxsO1xuXG4gIGlmICh3ZWlnaHRzICE9IG51bGwpIHtcbiAgICAkd2VpZ2h0cyA9IGNvbnZlcnRUb1RlbnNvcih3ZWlnaHRzLCAnd2VpZ2h0cycsICdzb2Z0bWF4Q3Jvc3NFbnRyb3B5Jyk7XG4gIH1cblxuICBhc3NlcnRTaGFwZXNNYXRjaChcbiAgICAgICRvbmVob3RMYWJlbHMuc2hhcGUsICRsb2dpdHMuc2hhcGUsICdFcnJvciBpbiBzb2Z0bWF4Q3Jvc3NFbnRyb3B5OiAnKTtcblxuICBpZiAobGFiZWxTbW9vdGhpbmcgPiAwKSB7XG4gICAgY29uc3QgbGFiZWxTbW9vdGhpbmdTY2FsYXIgPSBzY2FsYXIobGFiZWxTbW9vdGhpbmcpO1xuICAgIGNvbnN0IG9uZSA9IHNjYWxhcigxKTtcbiAgICBjb25zdCBudW1DbGFzc2VzID0gc2NhbGFyKCRvbmVob3RMYWJlbHMuc2hhcGVbMV0pO1xuXG4gICAgJG9uZWhvdExhYmVscyA9XG4gICAgICAgIGFkZChtdWwoJG9uZWhvdExhYmVscywgc3ViKG9uZSwgbGFiZWxTbW9vdGhpbmdTY2FsYXIpKSxcbiAgICAgICAgICAgIGRpdihsYWJlbFNtb290aGluZ1NjYWxhciwgbnVtQ2xhc3NlcykpO1xuICB9XG5cbiAgY29uc3QgbG9zc2VzID0gc29mdG1heENyb3NzRW50cm9weVdpdGhMb2dpdHNfKCRvbmVob3RMYWJlbHMsICRsb2dpdHMpO1xuXG4gIHJldHVybiBjb21wdXRlV2VpZ2h0ZWRMb3NzKGxvc3NlcywgJHdlaWdodHMsIHJlZHVjdGlvbik7XG59XG5cbmV4cG9ydCBjb25zdCBzb2Z0bWF4Q3Jvc3NFbnRyb3B5ID0gb3Aoe3NvZnRtYXhDcm9zc0VudHJvcHlffSk7XG4iXX0=