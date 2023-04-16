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
import { Floor } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Computes floor of input `tf.Tensor` element-wise: `floor(x)`.
 *
 * ```js
 * const x = tf.tensor1d([.6, 1.1, -3.3]);
 *
 * x.floor().print();  // or tf.floor(x)
 * ```
 * @param x The input tensor.
 *
 * @doc {heading: 'Operations', subheading: 'Basic math'}
 */
function floor_(x) {
    const $x = convertToTensor(x, 'x', 'floor', 'float32');
    const inputs = { x: $x };
    return ENGINE.runKernel(Floor, inputs);
}
export const floor = op({ floor_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9mbG9vci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxLQUFLLEVBQWMsTUFBTSxpQkFBaUIsQ0FBQztBQUduRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHbkQsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvQjs7Ozs7Ozs7Ozs7R0FXRztBQUNILFNBQVMsTUFBTSxDQUFtQixDQUFlO0lBQy9DLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUV2RCxNQUFNLE1BQU0sR0FBZ0IsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFDLENBQUM7SUFDcEMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxNQUE4QixDQUFDLENBQUM7QUFDakUsQ0FBQztBQUNELE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge0Zsb29yLCBGbG9vcklucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcblxuLyoqXG4gKiBDb21wdXRlcyBmbG9vciBvZiBpbnB1dCBgdGYuVGVuc29yYCBlbGVtZW50LXdpc2U6IGBmbG9vcih4KWAuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHggPSB0Zi50ZW5zb3IxZChbLjYsIDEuMSwgLTMuM10pO1xuICpcbiAqIHguZmxvb3IoKS5wcmludCgpOyAgLy8gb3IgdGYuZmxvb3IoeClcbiAqIGBgYFxuICogQHBhcmFtIHggVGhlIGlucHV0IHRlbnNvci5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdCYXNpYyBtYXRoJ31cbiAqL1xuZnVuY3Rpb24gZmxvb3JfPFQgZXh0ZW5kcyBUZW5zb3I+KHg6IFR8VGVuc29yTGlrZSk6IFQge1xuICBjb25zdCAkeCA9IGNvbnZlcnRUb1RlbnNvcih4LCAneCcsICdmbG9vcicsICdmbG9hdDMyJyk7XG5cbiAgY29uc3QgaW5wdXRzOiBGbG9vcklucHV0cyA9IHt4OiAkeH07XG4gIHJldHVybiBFTkdJTkUucnVuS2VybmVsKEZsb29yLCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXApO1xufVxuZXhwb3J0IGNvbnN0IGZsb29yID0gb3Aoe2Zsb29yX30pO1xuIl19