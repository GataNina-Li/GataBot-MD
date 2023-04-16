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
import { Sum } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { cast } from './cast';
import { op } from './operation';
/**
 * Computes the sum of elements across dimensions of a `tf.Tensor`.
 *
 * Reduces the input along the dimensions given in `axes`. Unless `keepDims`
 * is true, the rank of the `tf.Tensor` is reduced by 1 for each entry in
 * `axes`. If `keepDims` is true, the reduced dimensions are retained with
 * length 1. If axes has no entries, all dimensions are reduced, and a
 * `tf.Tensor` with a single element is returned.
 *
 * ```js
 * const x = tf.tensor1d([1, 2, 3]);
 *
 * x.sum().print();  // or tf.sum(x)
 * ```
 *
 * ```js
 * const x = tf.tensor2d([1, 2, 3, 4], [2, 2]);
 *
 * const axis = 1;
 * x.sum(axis).print();  // or tf.sum(x, axis)
 * ```
 *
 * @param x The input tensor to compute the sum over. If the dtype is `bool`
 *   it will be converted to `int32` and the output dtype will be `int32`.
 * @param axis The dimension(s) to reduce. By default it reduces
 *     all dimensions.
 * @param keepDims If true, retains reduced dimensions with size 1.
 *
 * @doc {heading: 'Operations', subheading: 'Reduction'}
 */
function sum_(x, axis = null, keepDims = false) {
    let $x = convertToTensor(x, 'x', 'sum');
    if ($x.dtype === 'bool') {
        $x = cast($x, 'int32');
    }
    const inputs = { x: $x };
    const attrs = { axis, keepDims };
    return ENGINE.runKernel(Sum, inputs, attrs);
}
export const sum = op({ sum_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvc3VtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLEdBQUcsRUFBc0IsTUFBTSxpQkFBaUIsQ0FBQztBQUl6RCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHbkQsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRS9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTZCRztBQUNILFNBQVMsSUFBSSxDQUNULENBQW9CLEVBQUUsT0FBd0IsSUFBSSxFQUFFLFFBQVEsR0FBRyxLQUFLO0lBQ3RFLElBQUksRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLElBQUksRUFBRSxDQUFDLEtBQUssS0FBSyxNQUFNLEVBQUU7UUFDdkIsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDeEI7SUFFRCxNQUFNLE1BQU0sR0FBYyxFQUFDLENBQUMsRUFBRSxFQUFFLEVBQUMsQ0FBQztJQUNsQyxNQUFNLEtBQUssR0FBYSxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUMsQ0FBQztJQUV6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQ25CLEdBQUcsRUFBRSxNQUE4QixFQUFFLEtBQTJCLENBQUMsQ0FBQztBQUN4RSxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7U3VtLCBTdW1BdHRycywgU3VtSW5wdXRzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7TmFtZWRUZW5zb3JNYXB9IGZyb20gJy4uL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQge2Nhc3R9IGZyb20gJy4vY2FzdCc7XG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5cbi8qKlxuICogQ29tcHV0ZXMgdGhlIHN1bSBvZiBlbGVtZW50cyBhY3Jvc3MgZGltZW5zaW9ucyBvZiBhIGB0Zi5UZW5zb3JgLlxuICpcbiAqIFJlZHVjZXMgdGhlIGlucHV0IGFsb25nIHRoZSBkaW1lbnNpb25zIGdpdmVuIGluIGBheGVzYC4gVW5sZXNzIGBrZWVwRGltc2BcbiAqIGlzIHRydWUsIHRoZSByYW5rIG9mIHRoZSBgdGYuVGVuc29yYCBpcyByZWR1Y2VkIGJ5IDEgZm9yIGVhY2ggZW50cnkgaW5cbiAqIGBheGVzYC4gSWYgYGtlZXBEaW1zYCBpcyB0cnVlLCB0aGUgcmVkdWNlZCBkaW1lbnNpb25zIGFyZSByZXRhaW5lZCB3aXRoXG4gKiBsZW5ndGggMS4gSWYgYXhlcyBoYXMgbm8gZW50cmllcywgYWxsIGRpbWVuc2lvbnMgYXJlIHJlZHVjZWQsIGFuZCBhXG4gKiBgdGYuVGVuc29yYCB3aXRoIGEgc2luZ2xlIGVsZW1lbnQgaXMgcmV0dXJuZWQuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHggPSB0Zi50ZW5zb3IxZChbMSwgMiwgM10pO1xuICpcbiAqIHguc3VtKCkucHJpbnQoKTsgIC8vIG9yIHRmLnN1bSh4KVxuICogYGBgXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHggPSB0Zi50ZW5zb3IyZChbMSwgMiwgMywgNF0sIFsyLCAyXSk7XG4gKlxuICogY29uc3QgYXhpcyA9IDE7XG4gKiB4LnN1bShheGlzKS5wcmludCgpOyAgLy8gb3IgdGYuc3VtKHgsIGF4aXMpXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0geCBUaGUgaW5wdXQgdGVuc29yIHRvIGNvbXB1dGUgdGhlIHN1bSBvdmVyLiBJZiB0aGUgZHR5cGUgaXMgYGJvb2xgXG4gKiAgIGl0IHdpbGwgYmUgY29udmVydGVkIHRvIGBpbnQzMmAgYW5kIHRoZSBvdXRwdXQgZHR5cGUgd2lsbCBiZSBgaW50MzJgLlxuICogQHBhcmFtIGF4aXMgVGhlIGRpbWVuc2lvbihzKSB0byByZWR1Y2UuIEJ5IGRlZmF1bHQgaXQgcmVkdWNlc1xuICogICAgIGFsbCBkaW1lbnNpb25zLlxuICogQHBhcmFtIGtlZXBEaW1zIElmIHRydWUsIHJldGFpbnMgcmVkdWNlZCBkaW1lbnNpb25zIHdpdGggc2l6ZSAxLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdPcGVyYXRpb25zJywgc3ViaGVhZGluZzogJ1JlZHVjdGlvbid9XG4gKi9cbmZ1bmN0aW9uIHN1bV88VCBleHRlbmRzIFRlbnNvcj4oXG4gICAgeDogVGVuc29yfFRlbnNvckxpa2UsIGF4aXM6IG51bWJlcnxudW1iZXJbXSA9IG51bGwsIGtlZXBEaW1zID0gZmFsc2UpOiBUIHtcbiAgbGV0ICR4ID0gY29udmVydFRvVGVuc29yKHgsICd4JywgJ3N1bScpO1xuICBpZiAoJHguZHR5cGUgPT09ICdib29sJykge1xuICAgICR4ID0gY2FzdCgkeCwgJ2ludDMyJyk7XG4gIH1cblxuICBjb25zdCBpbnB1dHM6IFN1bUlucHV0cyA9IHt4OiAkeH07XG4gIGNvbnN0IGF0dHJzOiBTdW1BdHRycyA9IHtheGlzLCBrZWVwRGltc307XG5cbiAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICBTdW0sIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCwgYXR0cnMgYXMge30gYXMgTmFtZWRBdHRyTWFwKTtcbn1cblxuZXhwb3J0IGNvbnN0IHN1bSA9IG9wKHtzdW1ffSk7XG4iXX0=