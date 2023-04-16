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
import { Ceil } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Computes ceiling of input `tf.Tensor` element-wise: `ceil(x)`
 *
 * ```js
 * const x = tf.tensor1d([.6, 1.1, -3.3]);
 *
 * x.ceil().print();  // or tf.ceil(x)
 * ```
 * @param x The input Tensor.
 *
 * @doc {heading: 'Operations', subheading: 'Basic math'}
 */
function ceil_(x) {
    const $x = convertToTensor(x, 'x', 'ceil', 'float32');
    const inputs = { x: $x };
    return ENGINE.runKernel(Ceil, inputs);
}
export const ceil = op({ ceil_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2NlaWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsSUFBSSxFQUFhLE1BQU0saUJBQWlCLENBQUM7QUFHakQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBR25ELE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFL0I7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxTQUFTLEtBQUssQ0FBbUIsQ0FBZTtJQUM5QyxNQUFNLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFFdEQsTUFBTSxNQUFNLEdBQWUsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFDLENBQUM7SUFDbkMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUE4QixDQUFDLENBQUM7QUFDaEUsQ0FBQztBQUNELE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsRUFBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7Q2VpbCwgQ2VpbElucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcblxuLyoqXG4gKiBDb21wdXRlcyBjZWlsaW5nIG9mIGlucHV0IGB0Zi5UZW5zb3JgIGVsZW1lbnQtd2lzZTogYGNlaWwoeClgXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHggPSB0Zi50ZW5zb3IxZChbLjYsIDEuMSwgLTMuM10pO1xuICpcbiAqIHguY2VpbCgpLnByaW50KCk7ICAvLyBvciB0Zi5jZWlsKHgpXG4gKiBgYGBcbiAqIEBwYXJhbSB4IFRoZSBpbnB1dCBUZW5zb3IuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ09wZXJhdGlvbnMnLCBzdWJoZWFkaW5nOiAnQmFzaWMgbWF0aCd9XG4gKi9cbmZ1bmN0aW9uIGNlaWxfPFQgZXh0ZW5kcyBUZW5zb3I+KHg6IFR8VGVuc29yTGlrZSk6IFQge1xuICBjb25zdCAkeCA9IGNvbnZlcnRUb1RlbnNvcih4LCAneCcsICdjZWlsJywgJ2Zsb2F0MzInKTtcblxuICBjb25zdCBpbnB1dHM6IENlaWxJbnB1dHMgPSB7eDogJHh9O1xuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChDZWlsLCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXApO1xufVxuZXhwb3J0IGNvbnN0IGNlaWwgPSBvcCh7Y2VpbF99KTtcbiJdfQ==