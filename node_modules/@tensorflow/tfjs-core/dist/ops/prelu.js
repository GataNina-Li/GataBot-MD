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
import { Prelu } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Computes leaky rectified linear element-wise with parametric alphas.
 *
 * `x < 0 ? alpha * x : f(x) = x`
 *
 * ```js
 * const x = tf.tensor1d([-1, 2, -3, 4]);
 * const alpha = tf.scalar(0.1);
 *
 * x.prelu(alpha).print();  // or tf.prelu(x, alpha)
 * ```
 * @param x The input tensor.
 * @param alpha Scaling factor for negative values.
 *
 * @doc {heading: 'Operations', subheading: 'Basic math'}
 */
function prelu_(x, alpha) {
    const $x = convertToTensor(x, 'x', 'prelu');
    const $alpha = convertToTensor(alpha, 'alpha', 'prelu');
    const inputs = { x: $x, alpha: $alpha };
    return ENGINE.runKernel(Prelu, inputs);
}
export const prelu = op({ prelu_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlbHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9wcmVsdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxLQUFLLEVBQWMsTUFBTSxpQkFBaUIsQ0FBQztBQUduRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHbkQsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvQjs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxTQUFTLE1BQU0sQ0FBbUIsQ0FBZSxFQUFFLEtBQW1CO0lBQ3BFLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzVDLE1BQU0sTUFBTSxHQUFHLGVBQWUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRXhELE1BQU0sTUFBTSxHQUFnQixFQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBQyxDQUFDO0lBQ25ELE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsTUFBOEIsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge1ByZWx1LCBQcmVsdUlucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcblxuLyoqXG4gKiBDb21wdXRlcyBsZWFreSByZWN0aWZpZWQgbGluZWFyIGVsZW1lbnQtd2lzZSB3aXRoIHBhcmFtZXRyaWMgYWxwaGFzLlxuICpcbiAqIGB4IDwgMCA/IGFscGhhICogeCA6IGYoeCkgPSB4YFxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCB4ID0gdGYudGVuc29yMWQoWy0xLCAyLCAtMywgNF0pO1xuICogY29uc3QgYWxwaGEgPSB0Zi5zY2FsYXIoMC4xKTtcbiAqXG4gKiB4LnByZWx1KGFscGhhKS5wcmludCgpOyAgLy8gb3IgdGYucHJlbHUoeCwgYWxwaGEpXG4gKiBgYGBcbiAqIEBwYXJhbSB4IFRoZSBpbnB1dCB0ZW5zb3IuXG4gKiBAcGFyYW0gYWxwaGEgU2NhbGluZyBmYWN0b3IgZm9yIG5lZ2F0aXZlIHZhbHVlcy5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdCYXNpYyBtYXRoJ31cbiAqL1xuZnVuY3Rpb24gcHJlbHVfPFQgZXh0ZW5kcyBUZW5zb3I+KHg6IFR8VGVuc29yTGlrZSwgYWxwaGE6IFR8VGVuc29yTGlrZSk6IFQge1xuICBjb25zdCAkeCA9IGNvbnZlcnRUb1RlbnNvcih4LCAneCcsICdwcmVsdScpO1xuICBjb25zdCAkYWxwaGEgPSBjb252ZXJ0VG9UZW5zb3IoYWxwaGEsICdhbHBoYScsICdwcmVsdScpO1xuXG4gIGNvbnN0IGlucHV0czogUHJlbHVJbnB1dHMgPSB7eDogJHgsIGFscGhhOiAkYWxwaGF9O1xuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChQcmVsdSwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwKTtcbn1cblxuZXhwb3J0IGNvbnN0IHByZWx1ID0gb3Aoe3ByZWx1X30pO1xuIl19