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
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { cast } from './cast';
import { matMul } from './mat_mul';
import { oneHot } from './one_hot';
import { op } from './operation';
import { transpose } from './transpose';
/**
 * Computes the confusion matrix from true labels and predicted labels.
 *
 * ```js
 * const labels = tf.tensor1d([0, 1, 2, 1, 0], 'int32');
 * const predictions = tf.tensor1d([0, 2, 2, 1, 0], 'int32');
 * const numClasses = 3;
 * const out = tf.math.confusionMatrix(labels, predictions, numClasses);
 * out.print();
 * // Expected output matrix:
 * // [[2, 0, 0],
 * //  [0, 1, 1],
 * //  [0, 0, 1]]
 * ```
 *
 * @param labels The target labels, assumed to be 0-based integers
 *   for the classes. The shape is `[numExamples]`, where
 *   `numExamples` is the number of examples included.
 * @param predictions The predicted classes, assumed to be
 *   0-based integers for the classes. Must have the same shape as `labels`.
 * @param numClasses Number of all classes, as an integer.
 *   Its value must be larger than the largest element in `labels` and
 *   `predictions`.
 * @returns The confusion matrix as a int32-type 2D tensor. The value at
 *   row `r` and column `c` is the number of times examples of actual class
 *   `r` were predicted as class `c`.
 *
 * @doc {heading: 'Operations', subheading: 'Evaluation'}
 */
export function confusionMatrix_(labels, predictions, numClasses) {
    const $labels = convertToTensor(labels, 'labels', 'confusionMatrix');
    const $predictions = convertToTensor(predictions, 'predictions', 'confusionMatrix');
    util.assert(numClasses == null || numClasses > 0 && Number.isInteger(numClasses), () => `If provided, numClasses must be a positive integer, ` +
        `but got ${numClasses}`);
    util.assert($labels.rank === 1, () => `Expected the rank of labels to be 1, but got ${$labels.rank}`);
    util.assert($predictions.rank === 1, () => `Expected the rank of predictions to be 1, ` +
        `but got ${$predictions.rank}`);
    util.assert($labels.shape[0] === $predictions.shape[0], () => `Mismatch in the number of examples: ` +
        `${$labels.shape[0]} vs. ${$predictions.shape[0]}. ` +
        `Labels and predictions should have the same number of elements.`);
    util.assert(numClasses > 0 && Number.isInteger(numClasses), () => `numClasses is required to be a positive integer, but got ` +
        `${numClasses}`);
    // TODO(cais): In the future, if oneHot supports tensors inputs for
    //   `numClasses`, `confusionMatrix` can make `numClasses` optional.
    const oneHotLabels = oneHot(cast($labels, 'int32'), numClasses);
    const oneHotPredictions = oneHot(cast($predictions, 'int32'), numClasses);
    const oneHotLabelsT = transpose(oneHotLabels);
    const product = matMul(oneHotLabelsT, oneHotPredictions);
    return cast(product, 'int32');
}
export const confusionMatrix = op({ confusionMatrix_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZnVzaW9uX21hdHJpeC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2NvbmZ1c2lvbl9tYXRyaXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBR0gsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE9BQU8sS0FBSyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBRWhDLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDL0IsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUV0Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRCRztBQUNILE1BQU0sVUFBVSxnQkFBZ0IsQ0FDNUIsTUFBMkIsRUFBRSxXQUFnQyxFQUM3RCxVQUFrQjtJQUNwQixNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JFLE1BQU0sWUFBWSxHQUNkLGVBQWUsQ0FBQyxXQUFXLEVBQUUsYUFBYSxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFFbkUsSUFBSSxDQUFDLE1BQU0sQ0FDUCxVQUFVLElBQUksSUFBSSxJQUFJLFVBQVUsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFDcEUsR0FBRyxFQUFFLENBQUMsc0RBQXNEO1FBQ3hELFdBQVcsVUFBVSxFQUFFLENBQUMsQ0FBQztJQUNqQyxJQUFJLENBQUMsTUFBTSxDQUNQLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUNsQixHQUFHLEVBQUUsQ0FBQyxnREFBZ0QsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDMUUsSUFBSSxDQUFDLE1BQU0sQ0FDUCxZQUFZLENBQUMsSUFBSSxLQUFLLENBQUMsRUFDdkIsR0FBRyxFQUFFLENBQUMsNENBQTRDO1FBQzlDLFdBQVcsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDeEMsSUFBSSxDQUFDLE1BQU0sQ0FDUCxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQzFDLEdBQUcsRUFBRSxDQUFDLHNDQUFzQztRQUN4QyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSTtRQUNwRCxpRUFBaUUsQ0FBQyxDQUFDO0lBQzNFLElBQUksQ0FBQyxNQUFNLENBQ1AsVUFBVSxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUM5QyxHQUFHLEVBQUUsQ0FBQywyREFBMkQ7UUFDN0QsR0FBRyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCLG1FQUFtRTtJQUNuRSxvRUFBb0U7SUFFcEUsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUUsVUFBVSxDQUFhLENBQUM7SUFDNUUsTUFBTSxpQkFBaUIsR0FDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLEVBQUUsVUFBVSxDQUFhLENBQUM7SUFDaEUsTUFBTSxhQUFhLEdBQWEsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3hELE1BQU0sT0FBTyxHQUFhLE1BQU0sQ0FBQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUNuRSxPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxFQUFFLENBQUMsRUFBQyxnQkFBZ0IsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7VGVuc29yMUQsIFRlbnNvcjJEfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7Y2FzdH0gZnJvbSAnLi9jYXN0JztcbmltcG9ydCB7bWF0TXVsfSBmcm9tICcuL21hdF9tdWwnO1xuaW1wb3J0IHtvbmVIb3R9IGZyb20gJy4vb25lX2hvdCc7XG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5pbXBvcnQge3RyYW5zcG9zZX0gZnJvbSAnLi90cmFuc3Bvc2UnO1xuXG4vKipcbiAqIENvbXB1dGVzIHRoZSBjb25mdXNpb24gbWF0cml4IGZyb20gdHJ1ZSBsYWJlbHMgYW5kIHByZWRpY3RlZCBsYWJlbHMuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGxhYmVscyA9IHRmLnRlbnNvcjFkKFswLCAxLCAyLCAxLCAwXSwgJ2ludDMyJyk7XG4gKiBjb25zdCBwcmVkaWN0aW9ucyA9IHRmLnRlbnNvcjFkKFswLCAyLCAyLCAxLCAwXSwgJ2ludDMyJyk7XG4gKiBjb25zdCBudW1DbGFzc2VzID0gMztcbiAqIGNvbnN0IG91dCA9IHRmLm1hdGguY29uZnVzaW9uTWF0cml4KGxhYmVscywgcHJlZGljdGlvbnMsIG51bUNsYXNzZXMpO1xuICogb3V0LnByaW50KCk7XG4gKiAvLyBFeHBlY3RlZCBvdXRwdXQgbWF0cml4OlxuICogLy8gW1syLCAwLCAwXSxcbiAqIC8vICBbMCwgMSwgMV0sXG4gKiAvLyAgWzAsIDAsIDFdXVxuICogYGBgXG4gKlxuICogQHBhcmFtIGxhYmVscyBUaGUgdGFyZ2V0IGxhYmVscywgYXNzdW1lZCB0byBiZSAwLWJhc2VkIGludGVnZXJzXG4gKiAgIGZvciB0aGUgY2xhc3Nlcy4gVGhlIHNoYXBlIGlzIGBbbnVtRXhhbXBsZXNdYCwgd2hlcmVcbiAqICAgYG51bUV4YW1wbGVzYCBpcyB0aGUgbnVtYmVyIG9mIGV4YW1wbGVzIGluY2x1ZGVkLlxuICogQHBhcmFtIHByZWRpY3Rpb25zIFRoZSBwcmVkaWN0ZWQgY2xhc3NlcywgYXNzdW1lZCB0byBiZVxuICogICAwLWJhc2VkIGludGVnZXJzIGZvciB0aGUgY2xhc3Nlcy4gTXVzdCBoYXZlIHRoZSBzYW1lIHNoYXBlIGFzIGBsYWJlbHNgLlxuICogQHBhcmFtIG51bUNsYXNzZXMgTnVtYmVyIG9mIGFsbCBjbGFzc2VzLCBhcyBhbiBpbnRlZ2VyLlxuICogICBJdHMgdmFsdWUgbXVzdCBiZSBsYXJnZXIgdGhhbiB0aGUgbGFyZ2VzdCBlbGVtZW50IGluIGBsYWJlbHNgIGFuZFxuICogICBgcHJlZGljdGlvbnNgLlxuICogQHJldHVybnMgVGhlIGNvbmZ1c2lvbiBtYXRyaXggYXMgYSBpbnQzMi10eXBlIDJEIHRlbnNvci4gVGhlIHZhbHVlIGF0XG4gKiAgIHJvdyBgcmAgYW5kIGNvbHVtbiBgY2AgaXMgdGhlIG51bWJlciBvZiB0aW1lcyBleGFtcGxlcyBvZiBhY3R1YWwgY2xhc3NcbiAqICAgYHJgIHdlcmUgcHJlZGljdGVkIGFzIGNsYXNzIGBjYC5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdFdmFsdWF0aW9uJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmZ1c2lvbk1hdHJpeF8oXG4gICAgbGFiZWxzOiBUZW5zb3IxRHxUZW5zb3JMaWtlLCBwcmVkaWN0aW9uczogVGVuc29yMUR8VGVuc29yTGlrZSxcbiAgICBudW1DbGFzc2VzOiBudW1iZXIpOiBUZW5zb3IyRCB7XG4gIGNvbnN0ICRsYWJlbHMgPSBjb252ZXJ0VG9UZW5zb3IobGFiZWxzLCAnbGFiZWxzJywgJ2NvbmZ1c2lvbk1hdHJpeCcpO1xuICBjb25zdCAkcHJlZGljdGlvbnMgPVxuICAgICAgY29udmVydFRvVGVuc29yKHByZWRpY3Rpb25zLCAncHJlZGljdGlvbnMnLCAnY29uZnVzaW9uTWF0cml4Jyk7XG5cbiAgdXRpbC5hc3NlcnQoXG4gICAgICBudW1DbGFzc2VzID09IG51bGwgfHwgbnVtQ2xhc3NlcyA+IDAgJiYgTnVtYmVyLmlzSW50ZWdlcihudW1DbGFzc2VzKSxcbiAgICAgICgpID0+IGBJZiBwcm92aWRlZCwgbnVtQ2xhc3NlcyBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlciwgYCArXG4gICAgICAgICAgYGJ1dCBnb3QgJHtudW1DbGFzc2VzfWApO1xuICB1dGlsLmFzc2VydChcbiAgICAgICRsYWJlbHMucmFuayA9PT0gMSxcbiAgICAgICgpID0+IGBFeHBlY3RlZCB0aGUgcmFuayBvZiBsYWJlbHMgdG8gYmUgMSwgYnV0IGdvdCAkeyRsYWJlbHMucmFua31gKTtcbiAgdXRpbC5hc3NlcnQoXG4gICAgICAkcHJlZGljdGlvbnMucmFuayA9PT0gMSxcbiAgICAgICgpID0+IGBFeHBlY3RlZCB0aGUgcmFuayBvZiBwcmVkaWN0aW9ucyB0byBiZSAxLCBgICtcbiAgICAgICAgICBgYnV0IGdvdCAkeyRwcmVkaWN0aW9ucy5yYW5rfWApO1xuICB1dGlsLmFzc2VydChcbiAgICAgICRsYWJlbHMuc2hhcGVbMF0gPT09ICRwcmVkaWN0aW9ucy5zaGFwZVswXSxcbiAgICAgICgpID0+IGBNaXNtYXRjaCBpbiB0aGUgbnVtYmVyIG9mIGV4YW1wbGVzOiBgICtcbiAgICAgICAgICBgJHskbGFiZWxzLnNoYXBlWzBdfSB2cy4gJHskcHJlZGljdGlvbnMuc2hhcGVbMF19LiBgICtcbiAgICAgICAgICBgTGFiZWxzIGFuZCBwcmVkaWN0aW9ucyBzaG91bGQgaGF2ZSB0aGUgc2FtZSBudW1iZXIgb2YgZWxlbWVudHMuYCk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgbnVtQ2xhc3NlcyA+IDAgJiYgTnVtYmVyLmlzSW50ZWdlcihudW1DbGFzc2VzKSxcbiAgICAgICgpID0+IGBudW1DbGFzc2VzIGlzIHJlcXVpcmVkIHRvIGJlIGEgcG9zaXRpdmUgaW50ZWdlciwgYnV0IGdvdCBgICtcbiAgICAgICAgICBgJHtudW1DbGFzc2VzfWApO1xuICAvLyBUT0RPKGNhaXMpOiBJbiB0aGUgZnV0dXJlLCBpZiBvbmVIb3Qgc3VwcG9ydHMgdGVuc29ycyBpbnB1dHMgZm9yXG4gIC8vICAgYG51bUNsYXNzZXNgLCBgY29uZnVzaW9uTWF0cml4YCBjYW4gbWFrZSBgbnVtQ2xhc3Nlc2Agb3B0aW9uYWwuXG5cbiAgY29uc3Qgb25lSG90TGFiZWxzID0gb25lSG90KGNhc3QoJGxhYmVscywgJ2ludDMyJyksIG51bUNsYXNzZXMpIGFzIFRlbnNvcjJEO1xuICBjb25zdCBvbmVIb3RQcmVkaWN0aW9ucyA9XG4gICAgICBvbmVIb3QoY2FzdCgkcHJlZGljdGlvbnMsICdpbnQzMicpLCBudW1DbGFzc2VzKSBhcyBUZW5zb3IyRDtcbiAgY29uc3Qgb25lSG90TGFiZWxzVDogVGVuc29yMkQgPSB0cmFuc3Bvc2Uob25lSG90TGFiZWxzKTtcbiAgY29uc3QgcHJvZHVjdDogVGVuc29yMkQgPSBtYXRNdWwob25lSG90TGFiZWxzVCwgb25lSG90UHJlZGljdGlvbnMpO1xuICByZXR1cm4gY2FzdChwcm9kdWN0LCAnaW50MzInKTtcbn1cblxuZXhwb3J0IGNvbnN0IGNvbmZ1c2lvbk1hdHJpeCA9IG9wKHtjb25mdXNpb25NYXRyaXhffSk7XG4iXX0=