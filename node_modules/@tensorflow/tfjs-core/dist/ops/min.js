/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
import { Min } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Computes the minimum value from the input.
 *
 * Reduces the input along the dimensions given in `axes`. Unless `keepDims`
 * is true, the rank of the array is reduced by 1 for each entry in `axes`.
 * If `keepDims` is true, the reduced dimensions are retained with length 1.
 * If `axes` has no entries, all dimensions are reduced, and an array with a
 * single element is returned.
 *
 * ```js
 * const x = tf.tensor1d([1, 2, 3]);
 *
 * x.min().print();  // or tf.min(x)
 * ```
 *
 * ```js
 * const x = tf.tensor2d([1, 2, 3, 4], [2, 2]);
 *
 * const axis = 1;
 * x.min(axis).print();  // or tf.min(x, axis)
 * ```
 *
 * @param x The input Tensor.
 * @param axis The dimension(s) to reduce. By default it reduces
 *     all dimensions.
 * @param keepDims If true, retains reduced dimensions with size 1.
 *
 * @doc {heading: 'Operations', subheading: 'Reduction'}
 */
function min_(x, axis = null, keepDims = false) {
    const $x = convertToTensor(x, 'x', 'min');
    const inputs = { x: $x };
    const attrs = { axis, keepDims };
    // tslint:disable-next-line: no-unnecessary-type-assertion
    return ENGINE.runKernel(Min, inputs, attrs);
}
export const min = op({ min_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvbWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLEdBQUcsRUFBc0IsTUFBTSxpQkFBaUIsQ0FBQztBQUl6RCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHbkQsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRCRztBQUNILFNBQVMsSUFBSSxDQUNULENBQW9CLEVBQUUsT0FBd0IsSUFBSSxFQUFFLFFBQVEsR0FBRyxLQUFLO0lBQ3RFLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRTFDLE1BQU0sTUFBTSxHQUFjLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBQyxDQUFDO0lBQ2xDLE1BQU0sS0FBSyxHQUFhLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBQyxDQUFDO0lBRXpDLDBEQUEwRDtJQUMxRCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQ1osR0FBRyxFQUFFLE1BQThCLEVBQ25DLEtBQTJCLENBQU0sQ0FBQztBQUMvQyxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7TWluLCBNaW5BdHRycywgTWluSW5wdXRzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7TmFtZWRUZW5zb3JNYXB9IGZyb20gJy4uL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5cbi8qKlxuICogQ29tcHV0ZXMgdGhlIG1pbmltdW0gdmFsdWUgZnJvbSB0aGUgaW5wdXQuXG4gKlxuICogUmVkdWNlcyB0aGUgaW5wdXQgYWxvbmcgdGhlIGRpbWVuc2lvbnMgZ2l2ZW4gaW4gYGF4ZXNgLiBVbmxlc3MgYGtlZXBEaW1zYFxuICogaXMgdHJ1ZSwgdGhlIHJhbmsgb2YgdGhlIGFycmF5IGlzIHJlZHVjZWQgYnkgMSBmb3IgZWFjaCBlbnRyeSBpbiBgYXhlc2AuXG4gKiBJZiBga2VlcERpbXNgIGlzIHRydWUsIHRoZSByZWR1Y2VkIGRpbWVuc2lvbnMgYXJlIHJldGFpbmVkIHdpdGggbGVuZ3RoIDEuXG4gKiBJZiBgYXhlc2AgaGFzIG5vIGVudHJpZXMsIGFsbCBkaW1lbnNpb25zIGFyZSByZWR1Y2VkLCBhbmQgYW4gYXJyYXkgd2l0aCBhXG4gKiBzaW5nbGUgZWxlbWVudCBpcyByZXR1cm5lZC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgeCA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzXSk7XG4gKlxuICogeC5taW4oKS5wcmludCgpOyAgLy8gb3IgdGYubWluKHgpXG4gKiBgYGBcbiAqXG4gKiBgYGBqc1xuICogY29uc3QgeCA9IHRmLnRlbnNvcjJkKFsxLCAyLCAzLCA0XSwgWzIsIDJdKTtcbiAqXG4gKiBjb25zdCBheGlzID0gMTtcbiAqIHgubWluKGF4aXMpLnByaW50KCk7ICAvLyBvciB0Zi5taW4oeCwgYXhpcylcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB4IFRoZSBpbnB1dCBUZW5zb3IuXG4gKiBAcGFyYW0gYXhpcyBUaGUgZGltZW5zaW9uKHMpIHRvIHJlZHVjZS4gQnkgZGVmYXVsdCBpdCByZWR1Y2VzXG4gKiAgICAgYWxsIGRpbWVuc2lvbnMuXG4gKiBAcGFyYW0ga2VlcERpbXMgSWYgdHJ1ZSwgcmV0YWlucyByZWR1Y2VkIGRpbWVuc2lvbnMgd2l0aCBzaXplIDEuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ09wZXJhdGlvbnMnLCBzdWJoZWFkaW5nOiAnUmVkdWN0aW9uJ31cbiAqL1xuZnVuY3Rpb24gbWluXzxUIGV4dGVuZHMgVGVuc29yPihcbiAgICB4OiBUZW5zb3J8VGVuc29yTGlrZSwgYXhpczogbnVtYmVyfG51bWJlcltdID0gbnVsbCwga2VlcERpbXMgPSBmYWxzZSk6IFQge1xuICBjb25zdCAkeCA9IGNvbnZlcnRUb1RlbnNvcih4LCAneCcsICdtaW4nKTtcblxuICBjb25zdCBpbnB1dHM6IE1pbklucHV0cyA9IHt4OiAkeH07XG4gIGNvbnN0IGF0dHJzOiBNaW5BdHRycyA9IHtheGlzLCBrZWVwRGltc307XG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby11bm5lY2Vzc2FyeS10eXBlLWFzc2VydGlvblxuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChcbiAgICAgICAgICAgICBNaW4sIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCxcbiAgICAgICAgICAgICBhdHRycyBhcyB7fSBhcyBOYW1lZEF0dHJNYXApIGFzIFQ7XG59XG5cbmV4cG9ydCBjb25zdCBtaW4gPSBvcCh7bWluX30pO1xuIl19