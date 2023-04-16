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
import { Log1p } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Computes natural logarithm of the input `tf.Tensor` plus one
 * element-wise: `ln(1 + x)`
 *
 * ```js
 * const x = tf.tensor1d([1, 2, Math.E - 1]);
 *
 * x.log1p().print();  // or tf.log1p(x)
 * ```
 * @param x The input tensor.
 *
 * @doc {heading: 'Operations', subheading: 'Basic math'}
 */
function log1p_(x) {
    const $x = convertToTensor(x, 'x', 'log1p');
    const inputs = { x: $x };
    return ENGINE.runKernel(Log1p, inputs);
}
export const log1p = op({ log1p_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nMXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9sb2cxcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxLQUFLLEVBQWMsTUFBTSxpQkFBaUIsQ0FBQztBQUduRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHbkQsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvQjs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxTQUFTLE1BQU0sQ0FBbUIsQ0FBZTtJQUMvQyxNQUFNLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUU1QyxNQUFNLE1BQU0sR0FBZ0IsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFDLENBQUM7SUFDcEMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxNQUE4QixDQUFDLENBQUM7QUFDakUsQ0FBQztBQUNELE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7TG9nMXAsIExvZzFwSW5wdXRzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcblxuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuXG4vKipcbiAqIENvbXB1dGVzIG5hdHVyYWwgbG9nYXJpdGhtIG9mIHRoZSBpbnB1dCBgdGYuVGVuc29yYCBwbHVzIG9uZVxuICogZWxlbWVudC13aXNlOiBgbG4oMSArIHgpYFxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCB4ID0gdGYudGVuc29yMWQoWzEsIDIsIE1hdGguRSAtIDFdKTtcbiAqXG4gKiB4LmxvZzFwKCkucHJpbnQoKTsgIC8vIG9yIHRmLmxvZzFwKHgpXG4gKiBgYGBcbiAqIEBwYXJhbSB4IFRoZSBpbnB1dCB0ZW5zb3IuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ09wZXJhdGlvbnMnLCBzdWJoZWFkaW5nOiAnQmFzaWMgbWF0aCd9XG4gKi9cbmZ1bmN0aW9uIGxvZzFwXzxUIGV4dGVuZHMgVGVuc29yPih4OiBUfFRlbnNvckxpa2UpOiBUIHtcbiAgY29uc3QgJHggPSBjb252ZXJ0VG9UZW5zb3IoeCwgJ3gnLCAnbG9nMXAnKTtcblxuICBjb25zdCBpbnB1dHM6IExvZzFwSW5wdXRzID0ge3g6ICR4fTtcbiAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoTG9nMXAsIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCk7XG59XG5leHBvcnQgY29uc3QgbG9nMXAgPSBvcCh7bG9nMXBffSk7XG4iXX0=