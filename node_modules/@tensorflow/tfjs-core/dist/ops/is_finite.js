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
import { IsFinite } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Returns which elements of x are finite.
 *
 * ```js
 * const x = tf.tensor1d([NaN, Infinity, -Infinity, 0, 1]);
 *
 * x.isFinite().print();  // or tf.isNaN(x)
 * ```
 * @param x The input Tensor.
 *
 * @doc {heading: 'Operations', subheading: 'Basic math'}
 */
function isFinite_(x) {
    const $x = convertToTensor(x, 'x', 'isFinite');
    const inputs = { x: $x };
    return ENGINE.runKernel(IsFinite, inputs);
}
export const isFinite = op({ isFinite_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNfZmluaXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvaXNfZmluaXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLFFBQVEsRUFBaUIsTUFBTSxpQkFBaUIsQ0FBQztBQUd6RCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHbkQsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvQjs7Ozs7Ozs7Ozs7R0FXRztBQUNILFNBQVMsU0FBUyxDQUFtQixDQUFlO0lBQ2xELE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBRS9DLE1BQU0sTUFBTSxHQUFtQixFQUFDLENBQUMsRUFBRSxFQUFFLEVBQUMsQ0FBQztJQUV2QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLE1BQThCLENBQUMsQ0FBQztBQUNwRSxDQUFDO0FBQ0QsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxFQUFDLFNBQVMsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtJc0Zpbml0ZSwgSXNGaW5pdGVJbnB1dHN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7TmFtZWRUZW5zb3JNYXB9IGZyb20gJy4uL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5cbi8qKlxuICogUmV0dXJucyB3aGljaCBlbGVtZW50cyBvZiB4IGFyZSBmaW5pdGUuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHggPSB0Zi50ZW5zb3IxZChbTmFOLCBJbmZpbml0eSwgLUluZmluaXR5LCAwLCAxXSk7XG4gKlxuICogeC5pc0Zpbml0ZSgpLnByaW50KCk7ICAvLyBvciB0Zi5pc05hTih4KVxuICogYGBgXG4gKiBAcGFyYW0geCBUaGUgaW5wdXQgVGVuc29yLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdPcGVyYXRpb25zJywgc3ViaGVhZGluZzogJ0Jhc2ljIG1hdGgnfVxuICovXG5mdW5jdGlvbiBpc0Zpbml0ZV88VCBleHRlbmRzIFRlbnNvcj4oeDogVHxUZW5zb3JMaWtlKTogVCB7XG4gIGNvbnN0ICR4ID0gY29udmVydFRvVGVuc29yKHgsICd4JywgJ2lzRmluaXRlJyk7XG5cbiAgY29uc3QgaW5wdXRzOiBJc0Zpbml0ZUlucHV0cyA9IHt4OiAkeH07XG5cbiAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoSXNGaW5pdGUsIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCk7XG59XG5leHBvcnQgY29uc3QgaXNGaW5pdGUgPSBvcCh7aXNGaW5pdGVffSk7XG4iXX0=