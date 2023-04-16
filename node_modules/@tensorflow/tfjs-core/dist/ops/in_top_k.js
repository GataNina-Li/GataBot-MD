/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
import { assert, assertShapesMatch, getTypedArrayFromDType } from '../util';
import { tensor } from './tensor';
/**
 * Returns whether the targets are in the top K predictions.
 *
 * ```js
 * const predictions = tf.tensor2d([[20, 10, 40, 30], [30, 50, -20, 10]]);
 * const targets = tf.tensor1d([2, 0]);
 * const precision = await tf.inTopKAsync(predictions, targets);
 * precision.print();
 * ```
 * @param predictions 2-D or higher `tf.Tensor` with last dimension being
 *     at least `k`.
 * @param targets 1-D or higher `tf.Tensor`.
 * @param k Optional Number of top elements to look at for computing precision,
 *     default to 1.
 *
 * @doc {heading: 'Operations', subheading: 'Evaluation'}
 */
async function inTopKAsync_(predictions, targets, k = 1) {
    const $predictions = convertToTensor(predictions, 'predictions', 'inTopK');
    const $targets = convertToTensor(targets, 'targets', 'inTopK');
    assert($predictions.rank > 1, () => 'inTopK() expects the predictions to be of rank 2 or higher, ' +
        `but got ${$predictions.rank}`);
    assert($predictions.rank - 1 === $targets.rank, () => `predictions rank should be 1 larger than ` +
        `targets rank, but got predictions rank ` +
        `${$predictions.rank} and targets rank ${$targets.rank}`);
    assertShapesMatch($predictions.shape.slice(0, $predictions.shape.length - 1), $targets.shape, `predictions's shape should be align with the targets' shape, ` +
        'except the last dimension.');
    const lastDim = $predictions.shape[$predictions.shape.length - 1];
    assert(k > 0 && k <= lastDim, () => `'k' passed to inTopK() must be > 0 && <= the predictions last ` +
        `dimension (${lastDim}), but got ${k}`);
    const predictionsVals = await $predictions.data();
    const targetsVals = await $targets.data();
    // Reshape predictionsVals into a 2d tensor [batch, lastDim]
    // and look up topK along lastDim.
    const [batch, size] = [predictionsVals.length / lastDim, lastDim];
    const precision = getTypedArrayFromDType('bool', batch);
    for (let b = 0; b < batch; b++) {
        const offset = b * size;
        const vals = predictionsVals.subarray(offset, offset + size);
        const valAndInd = [];
        for (let i = 0; i < vals.length; i++) {
            valAndInd.push({ value: vals[i], index: i });
        }
        valAndInd.sort((a, b) => b.value - a.value);
        precision[b] = 0;
        for (let i = 0; i < k; i++) {
            if (valAndInd[i].index === targetsVals[b]) {
                precision[b] = 1;
                break;
            }
        }
    }
    if (predictions !== $predictions) {
        $predictions.dispose();
    }
    if (targets !== $targets) {
        $targets.dispose();
    }
    // Output precision has the same shape as targets.
    return tensor(precision, $targets.shape, 'bool');
}
export const inTopKAsync = inTopKAsync_;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5fdG9wX2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9pbl90b3Bfay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFHSCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFbkQsT0FBTyxFQUFDLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxzQkFBc0IsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUMxRSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBRWhDOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsS0FBSyxVQUFVLFlBQVksQ0FDdkIsV0FBeUIsRUFBRSxPQUFxQixFQUFFLENBQUMsR0FBRyxDQUFDO0lBQ3pELE1BQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQyxXQUFXLEVBQUUsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzNFLE1BQU0sUUFBUSxHQUFHLGVBQWUsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRS9ELE1BQU0sQ0FDRixZQUFZLENBQUMsSUFBSSxHQUFHLENBQUMsRUFDckIsR0FBRyxFQUFFLENBQUMsOERBQThEO1FBQ2hFLFdBQVcsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDeEMsTUFBTSxDQUNGLFlBQVksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQ3ZDLEdBQUcsRUFBRSxDQUFDLDJDQUEyQztRQUM3Qyx5Q0FBeUM7UUFDekMsR0FBRyxZQUFZLENBQUMsSUFBSSxxQkFBcUIsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDbEUsaUJBQWlCLENBQ2IsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUMxRCxRQUFRLENBQUMsS0FBSyxFQUNkLCtEQUErRDtRQUMzRCw0QkFBNEIsQ0FBQyxDQUFDO0lBQ3RDLE1BQU0sT0FBTyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDbEUsTUFBTSxDQUNGLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU8sRUFDckIsR0FBRyxFQUFFLENBQUMsZ0VBQWdFO1FBQ2xFLGNBQWMsT0FBTyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFaEQsTUFBTSxlQUFlLEdBQUcsTUFBTSxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbEQsTUFBTSxXQUFXLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFMUMsNERBQTREO0lBQzVELGtDQUFrQztJQUNsQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEUsTUFBTSxTQUFTLEdBQUcsc0JBQXNCLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRXhELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDOUIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN4QixNQUFNLElBQUksR0FBRyxlQUFlLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDN0QsTUFBTSxTQUFTLEdBQTBDLEVBQUUsQ0FBQztRQUM1RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNwQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztTQUM1QztRQUNELFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU1QyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDMUIsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDekMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDakIsTUFBTTthQUNQO1NBQ0Y7S0FDRjtJQUVELElBQUksV0FBVyxLQUFLLFlBQVksRUFBRTtRQUNoQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDeEI7SUFDRCxJQUFJLE9BQU8sS0FBSyxRQUFRLEVBQUU7UUFDeEIsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3BCO0lBRUQsa0RBQWtEO0lBQ2xELE9BQU8sTUFBTSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBTSxDQUFDO0FBQ3hELENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge2Fzc2VydCwgYXNzZXJ0U2hhcGVzTWF0Y2gsIGdldFR5cGVkQXJyYXlGcm9tRFR5cGV9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHt0ZW5zb3J9IGZyb20gJy4vdGVuc29yJztcblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgdGhlIHRhcmdldHMgYXJlIGluIHRoZSB0b3AgSyBwcmVkaWN0aW9ucy5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgcHJlZGljdGlvbnMgPSB0Zi50ZW5zb3IyZChbWzIwLCAxMCwgNDAsIDMwXSwgWzMwLCA1MCwgLTIwLCAxMF1dKTtcbiAqIGNvbnN0IHRhcmdldHMgPSB0Zi50ZW5zb3IxZChbMiwgMF0pO1xuICogY29uc3QgcHJlY2lzaW9uID0gYXdhaXQgdGYuaW5Ub3BLQXN5bmMocHJlZGljdGlvbnMsIHRhcmdldHMpO1xuICogcHJlY2lzaW9uLnByaW50KCk7XG4gKiBgYGBcbiAqIEBwYXJhbSBwcmVkaWN0aW9ucyAyLUQgb3IgaGlnaGVyIGB0Zi5UZW5zb3JgIHdpdGggbGFzdCBkaW1lbnNpb24gYmVpbmdcbiAqICAgICBhdCBsZWFzdCBga2AuXG4gKiBAcGFyYW0gdGFyZ2V0cyAxLUQgb3IgaGlnaGVyIGB0Zi5UZW5zb3JgLlxuICogQHBhcmFtIGsgT3B0aW9uYWwgTnVtYmVyIG9mIHRvcCBlbGVtZW50cyB0byBsb29rIGF0IGZvciBjb21wdXRpbmcgcHJlY2lzaW9uLFxuICogICAgIGRlZmF1bHQgdG8gMS5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdFdmFsdWF0aW9uJ31cbiAqL1xuYXN5bmMgZnVuY3Rpb24gaW5Ub3BLQXN5bmNfPFQgZXh0ZW5kcyBUZW5zb3IsIFUgZXh0ZW5kcyBUZW5zb3I+KFxuICAgIHByZWRpY3Rpb25zOiBUfFRlbnNvckxpa2UsIHRhcmdldHM6IFV8VGVuc29yTGlrZSwgayA9IDEpOiBQcm9taXNlPFU+IHtcbiAgY29uc3QgJHByZWRpY3Rpb25zID0gY29udmVydFRvVGVuc29yKHByZWRpY3Rpb25zLCAncHJlZGljdGlvbnMnLCAnaW5Ub3BLJyk7XG4gIGNvbnN0ICR0YXJnZXRzID0gY29udmVydFRvVGVuc29yKHRhcmdldHMsICd0YXJnZXRzJywgJ2luVG9wSycpO1xuXG4gIGFzc2VydChcbiAgICAgICRwcmVkaWN0aW9ucy5yYW5rID4gMSxcbiAgICAgICgpID0+ICdpblRvcEsoKSBleHBlY3RzIHRoZSBwcmVkaWN0aW9ucyB0byBiZSBvZiByYW5rIDIgb3IgaGlnaGVyLCAnICtcbiAgICAgICAgICBgYnV0IGdvdCAkeyRwcmVkaWN0aW9ucy5yYW5rfWApO1xuICBhc3NlcnQoXG4gICAgICAkcHJlZGljdGlvbnMucmFuayAtIDEgPT09ICR0YXJnZXRzLnJhbmssXG4gICAgICAoKSA9PiBgcHJlZGljdGlvbnMgcmFuayBzaG91bGQgYmUgMSBsYXJnZXIgdGhhbiBgICtcbiAgICAgICAgICBgdGFyZ2V0cyByYW5rLCBidXQgZ290IHByZWRpY3Rpb25zIHJhbmsgYCArXG4gICAgICAgICAgYCR7JHByZWRpY3Rpb25zLnJhbmt9IGFuZCB0YXJnZXRzIHJhbmsgJHskdGFyZ2V0cy5yYW5rfWApO1xuICBhc3NlcnRTaGFwZXNNYXRjaChcbiAgICAgICRwcmVkaWN0aW9ucy5zaGFwZS5zbGljZSgwLCAkcHJlZGljdGlvbnMuc2hhcGUubGVuZ3RoIC0gMSksXG4gICAgICAkdGFyZ2V0cy5zaGFwZSxcbiAgICAgIGBwcmVkaWN0aW9ucydzIHNoYXBlIHNob3VsZCBiZSBhbGlnbiB3aXRoIHRoZSB0YXJnZXRzJyBzaGFwZSwgYCArXG4gICAgICAgICAgJ2V4Y2VwdCB0aGUgbGFzdCBkaW1lbnNpb24uJyk7XG4gIGNvbnN0IGxhc3REaW0gPSAkcHJlZGljdGlvbnMuc2hhcGVbJHByZWRpY3Rpb25zLnNoYXBlLmxlbmd0aCAtIDFdO1xuICBhc3NlcnQoXG4gICAgICBrID4gMCAmJiBrIDw9IGxhc3REaW0sXG4gICAgICAoKSA9PiBgJ2snIHBhc3NlZCB0byBpblRvcEsoKSBtdXN0IGJlID4gMCAmJiA8PSB0aGUgcHJlZGljdGlvbnMgbGFzdCBgICtcbiAgICAgICAgICBgZGltZW5zaW9uICgke2xhc3REaW19KSwgYnV0IGdvdCAke2t9YCk7XG5cbiAgY29uc3QgcHJlZGljdGlvbnNWYWxzID0gYXdhaXQgJHByZWRpY3Rpb25zLmRhdGEoKTtcbiAgY29uc3QgdGFyZ2V0c1ZhbHMgPSBhd2FpdCAkdGFyZ2V0cy5kYXRhKCk7XG5cbiAgLy8gUmVzaGFwZSBwcmVkaWN0aW9uc1ZhbHMgaW50byBhIDJkIHRlbnNvciBbYmF0Y2gsIGxhc3REaW1dXG4gIC8vIGFuZCBsb29rIHVwIHRvcEsgYWxvbmcgbGFzdERpbS5cbiAgY29uc3QgW2JhdGNoLCBzaXplXSA9IFtwcmVkaWN0aW9uc1ZhbHMubGVuZ3RoIC8gbGFzdERpbSwgbGFzdERpbV07XG4gIGNvbnN0IHByZWNpc2lvbiA9IGdldFR5cGVkQXJyYXlGcm9tRFR5cGUoJ2Jvb2wnLCBiYXRjaCk7XG5cbiAgZm9yIChsZXQgYiA9IDA7IGIgPCBiYXRjaDsgYisrKSB7XG4gICAgY29uc3Qgb2Zmc2V0ID0gYiAqIHNpemU7XG4gICAgY29uc3QgdmFscyA9IHByZWRpY3Rpb25zVmFscy5zdWJhcnJheShvZmZzZXQsIG9mZnNldCArIHNpemUpO1xuICAgIGNvbnN0IHZhbEFuZEluZDogQXJyYXk8e3ZhbHVlOiBudW1iZXIsIGluZGV4OiBudW1iZXJ9PiA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFscy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFsQW5kSW5kLnB1c2goe3ZhbHVlOiB2YWxzW2ldLCBpbmRleDogaX0pO1xuICAgIH1cbiAgICB2YWxBbmRJbmQuc29ydCgoYSwgYikgPT4gYi52YWx1ZSAtIGEudmFsdWUpO1xuXG4gICAgcHJlY2lzaW9uW2JdID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGs7IGkrKykge1xuICAgICAgaWYgKHZhbEFuZEluZFtpXS5pbmRleCA9PT0gdGFyZ2V0c1ZhbHNbYl0pIHtcbiAgICAgICAgcHJlY2lzaW9uW2JdID0gMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKHByZWRpY3Rpb25zICE9PSAkcHJlZGljdGlvbnMpIHtcbiAgICAkcHJlZGljdGlvbnMuZGlzcG9zZSgpO1xuICB9XG4gIGlmICh0YXJnZXRzICE9PSAkdGFyZ2V0cykge1xuICAgICR0YXJnZXRzLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIC8vIE91dHB1dCBwcmVjaXNpb24gaGFzIHRoZSBzYW1lIHNoYXBlIGFzIHRhcmdldHMuXG4gIHJldHVybiB0ZW5zb3IocHJlY2lzaW9uLCAkdGFyZ2V0cy5zaGFwZSwgJ2Jvb2wnKSBhcyBVO1xufVxuXG5leHBvcnQgY29uc3QgaW5Ub3BLQXN5bmMgPSBpblRvcEtBc3luY187XG4iXX0=