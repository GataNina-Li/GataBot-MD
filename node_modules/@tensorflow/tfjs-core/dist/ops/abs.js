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
import { Abs, ComplexAbs } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Computes absolute value element-wise: `abs(x)`
 *
 * ```js
 * const x = tf.tensor1d([-1, 2, -3, 4]);
 *
 * x.abs().print();  // or tf.abs(x)
 * ```
 * @param x The input `tf.Tensor`.
 *
 * @doc {heading: 'Operations', subheading: 'Basic math'}
 */
function abs_(x) {
    const $x = convertToTensor(x, 'x', 'abs');
    if ($x.dtype === 'complex64') {
        const inputs = { x: $x };
        return ENGINE.runKernel(ComplexAbs, inputs);
    }
    else {
        const inputs = { x: $x };
        return ENGINE.runKernel(Abs, inputs);
    }
}
export const abs = op({ abs_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvYWJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLEdBQUcsRUFBYSxVQUFVLEVBQW1CLE1BQU0saUJBQWlCLENBQUM7QUFHN0UsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBR25ELE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFL0I7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxTQUFTLElBQUksQ0FBbUIsQ0FBZTtJQUM3QyxNQUFNLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUUxQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEtBQUssV0FBVyxFQUFFO1FBQzVCLE1BQU0sTUFBTSxHQUFxQixFQUFDLENBQUMsRUFBRSxFQUFFLEVBQUMsQ0FBQztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLE1BQThCLENBQUMsQ0FBQztLQUNyRTtTQUFNO1FBQ0wsTUFBTSxNQUFNLEdBQWMsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFDLENBQUM7UUFDbEMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxNQUE4QixDQUFDLENBQUM7S0FDOUQ7QUFDSCxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtBYnMsIEFic0lucHV0cywgQ29tcGxleEFicywgQ29tcGxleEFic0lucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcblxuLyoqXG4gKiBDb21wdXRlcyBhYnNvbHV0ZSB2YWx1ZSBlbGVtZW50LXdpc2U6IGBhYnMoeClgXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHggPSB0Zi50ZW5zb3IxZChbLTEsIDIsIC0zLCA0XSk7XG4gKlxuICogeC5hYnMoKS5wcmludCgpOyAgLy8gb3IgdGYuYWJzKHgpXG4gKiBgYGBcbiAqIEBwYXJhbSB4IFRoZSBpbnB1dCBgdGYuVGVuc29yYC5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdCYXNpYyBtYXRoJ31cbiAqL1xuZnVuY3Rpb24gYWJzXzxUIGV4dGVuZHMgVGVuc29yPih4OiBUfFRlbnNvckxpa2UpOiBUIHtcbiAgY29uc3QgJHggPSBjb252ZXJ0VG9UZW5zb3IoeCwgJ3gnLCAnYWJzJyk7XG5cbiAgaWYgKCR4LmR0eXBlID09PSAnY29tcGxleDY0Jykge1xuICAgIGNvbnN0IGlucHV0czogQ29tcGxleEFic0lucHV0cyA9IHt4OiAkeH07XG4gICAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoQ29tcGxleEFicywgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBpbnB1dHM6IEFic0lucHV0cyA9IHt4OiAkeH07XG4gICAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoQWJzLCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXApO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBhYnMgPSBvcCh7YWJzX30pO1xuIl19