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
import { UnsortedSegmentSum } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { assert, isInt } from '../util';
import { op } from './operation';
/**
 * Computes the sum along segments of a `tf.Tensor`.
 *
 * ```js
 * const x = tf.tensor1d([1, 2, 3, 4]);
 * const segmentIds = tf.tensor1d([1, 2, 0, 1], 'int32');
 * const numSegments = 3;
 *
 * x.unsortedSegmentSum(segmentIds, numSegments).print()
 * //or tf.unsortedSegmentSum(x, segmentIds, numSegments)
 * ```
 * @param x The `tf.Tensor` that will be summed along its segments.
 * @param segmentIds A `tf.Tensor1D` whose rank is equal to the rank of `x`'s
 * dimension along the `axis`.  Maps each element of `x` to a segment.
 * @param numSegments The number of distinct `segmentIds`.
 *
 * @doc {heading: 'Operations', subheading: 'Segment'}
 */
function unsortedSegmentSum_(x, segmentIds, numSegments) {
    const $x = convertToTensor(x, 'x', 'unsortedSegmentSum');
    const $segmentIds = convertToTensor(segmentIds, 'segmentIds', 'unsortedSegmentSum', 'int32');
    assert(isInt(numSegments), () => 'numSegments must be of dtype int');
    const inputs = { x: $x, segmentIds: $segmentIds };
    const attrs = { numSegments };
    return ENGINE.runKernel(UnsortedSegmentSum, inputs, attrs);
}
export const unsortedSegmentSum = op({ unsortedSegmentSum_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5zb3J0ZWRfc2VnbWVudF9zdW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy91bnNvcnRlZF9zZWdtZW50X3N1bS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxrQkFBa0IsRUFBb0QsTUFBTSxpQkFBaUIsQ0FBQztBQUl0RyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFbkQsT0FBTyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFFdEMsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvQjs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFDSCxTQUFTLG1CQUFtQixDQUN4QixDQUFlLEVBQUUsVUFBK0IsRUFBRSxXQUFtQjtJQUN2RSxNQUFNLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQ3pELE1BQU0sV0FBVyxHQUNiLGVBQWUsQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzdFLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUVyRSxNQUFNLE1BQU0sR0FBNkIsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUMsQ0FBQztJQUMxRSxNQUFNLEtBQUssR0FBNEIsRUFBQyxXQUFXLEVBQUMsQ0FBQztJQUVyRCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQ25CLGtCQUFrQixFQUFFLE1BQThCLEVBQ2xELEtBQTJCLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQUcsRUFBRSxDQUFDLEVBQUMsbUJBQW1CLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7VW5zb3J0ZWRTZWdtZW50U3VtLCBVbnNvcnRlZFNlZ21lbnRTdW1BdHRycywgVW5zb3J0ZWRTZWdtZW50U3VtSW5wdXRzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge1RlbnNvciwgVGVuc29yMUR9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7YXNzZXJ0LCBpc0ludH0gZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgc3VtIGFsb25nIHNlZ21lbnRzIG9mIGEgYHRmLlRlbnNvcmAuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHggPSB0Zi50ZW5zb3IxZChbMSwgMiwgMywgNF0pO1xuICogY29uc3Qgc2VnbWVudElkcyA9IHRmLnRlbnNvcjFkKFsxLCAyLCAwLCAxXSwgJ2ludDMyJyk7XG4gKiBjb25zdCBudW1TZWdtZW50cyA9IDM7XG4gKlxuICogeC51bnNvcnRlZFNlZ21lbnRTdW0oc2VnbWVudElkcywgbnVtU2VnbWVudHMpLnByaW50KClcbiAqIC8vb3IgdGYudW5zb3J0ZWRTZWdtZW50U3VtKHgsIHNlZ21lbnRJZHMsIG51bVNlZ21lbnRzKVxuICogYGBgXG4gKiBAcGFyYW0geCBUaGUgYHRmLlRlbnNvcmAgdGhhdCB3aWxsIGJlIHN1bW1lZCBhbG9uZyBpdHMgc2VnbWVudHMuXG4gKiBAcGFyYW0gc2VnbWVudElkcyBBIGB0Zi5UZW5zb3IxRGAgd2hvc2UgcmFuayBpcyBlcXVhbCB0byB0aGUgcmFuayBvZiBgeGAnc1xuICogZGltZW5zaW9uIGFsb25nIHRoZSBgYXhpc2AuICBNYXBzIGVhY2ggZWxlbWVudCBvZiBgeGAgdG8gYSBzZWdtZW50LlxuICogQHBhcmFtIG51bVNlZ21lbnRzIFRoZSBudW1iZXIgb2YgZGlzdGluY3QgYHNlZ21lbnRJZHNgLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdPcGVyYXRpb25zJywgc3ViaGVhZGluZzogJ1NlZ21lbnQnfVxuICovXG5mdW5jdGlvbiB1bnNvcnRlZFNlZ21lbnRTdW1fPFQgZXh0ZW5kcyBUZW5zb3I+KFxuICAgIHg6IFR8VGVuc29yTGlrZSwgc2VnbWVudElkczogVGVuc29yMUR8VGVuc29yTGlrZSwgbnVtU2VnbWVudHM6IG51bWJlcik6IFQge1xuICBjb25zdCAkeCA9IGNvbnZlcnRUb1RlbnNvcih4LCAneCcsICd1bnNvcnRlZFNlZ21lbnRTdW0nKTtcbiAgY29uc3QgJHNlZ21lbnRJZHMgPVxuICAgICAgY29udmVydFRvVGVuc29yKHNlZ21lbnRJZHMsICdzZWdtZW50SWRzJywgJ3Vuc29ydGVkU2VnbWVudFN1bScsICdpbnQzMicpO1xuICBhc3NlcnQoaXNJbnQobnVtU2VnbWVudHMpLCAoKSA9PiAnbnVtU2VnbWVudHMgbXVzdCBiZSBvZiBkdHlwZSBpbnQnKTtcblxuICBjb25zdCBpbnB1dHM6IFVuc29ydGVkU2VnbWVudFN1bUlucHV0cyA9IHt4OiAkeCwgc2VnbWVudElkczogJHNlZ21lbnRJZHN9O1xuICBjb25zdCBhdHRyczogVW5zb3J0ZWRTZWdtZW50U3VtQXR0cnMgPSB7bnVtU2VnbWVudHN9O1xuXG4gIHJldHVybiBFTkdJTkUucnVuS2VybmVsKFxuICAgICAgVW5zb3J0ZWRTZWdtZW50U3VtLCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXAsXG4gICAgICBhdHRycyBhcyB7fSBhcyBOYW1lZEF0dHJNYXApO1xufVxuXG5leHBvcnQgY29uc3QgdW5zb3J0ZWRTZWdtZW50U3VtID0gb3Aoe3Vuc29ydGVkU2VnbWVudFN1bV99KTtcbiJdfQ==