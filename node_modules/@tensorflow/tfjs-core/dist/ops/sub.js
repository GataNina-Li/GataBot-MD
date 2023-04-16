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
import { Sub } from '../kernel_names';
import { makeTypesMatch } from '../tensor_util';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Subtracts two `tf.Tensor`s element-wise, A - B. Supports broadcasting.
 *
 * ```js
 * const a = tf.tensor1d([10, 20, 30, 40]);
 * const b = tf.tensor1d([1, 2, 3, 4]);
 *
 * a.sub(b).print();  // or tf.sub(a, b)
 * ```
 *
 * ```js
 * // Broadcast subtract a with b.
 * const a = tf.tensor1d([10, 20, 30, 40]);
 * const b = tf.scalar(5);
 *
 * a.sub(b).print();  // or tf.sub(a, b)
 * ```
 * @param a The first `tf.Tensor` to subtract from.
 * @param b The second `tf.Tensor` to be subtracted. Must have the same dtype as
 * `a`.
 *
 * @doc {heading: 'Operations', subheading: 'Arithmetic'}
 */
function sub_(a, b) {
    let $a = convertToTensor(a, 'a', 'sub');
    let $b = convertToTensor(b, 'b', 'sub');
    [$a, $b] = makeTypesMatch($a, $b);
    const inputs = { a: $a, b: $b };
    return ENGINE.runKernel(Sub, inputs);
}
export const sub = op({ sub_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ViLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvc3ViLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLEdBQUcsRUFBWSxNQUFNLGlCQUFpQixDQUFDO0FBRy9DLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHbkQsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCRztBQUNILFNBQVMsSUFBSSxDQUFtQixDQUFvQixFQUFFLENBQW9CO0lBQ3hFLElBQUksRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLElBQUksRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFbEMsTUFBTSxNQUFNLEdBQWMsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUMsQ0FBQztJQUV6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLE1BQThCLENBQUMsQ0FBQztBQUMvRCxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7U3ViLCBTdWJJbnB1dHN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7TmFtZWRUZW5zb3JNYXB9IGZyb20gJy4uL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQge21ha2VUeXBlc01hdGNofSBmcm9tICcuLi90ZW5zb3JfdXRpbCc7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5cbi8qKlxuICogU3VidHJhY3RzIHR3byBgdGYuVGVuc29yYHMgZWxlbWVudC13aXNlLCBBIC0gQi4gU3VwcG9ydHMgYnJvYWRjYXN0aW5nLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBhID0gdGYudGVuc29yMWQoWzEwLCAyMCwgMzAsIDQwXSk7XG4gKiBjb25zdCBiID0gdGYudGVuc29yMWQoWzEsIDIsIDMsIDRdKTtcbiAqXG4gKiBhLnN1YihiKS5wcmludCgpOyAgLy8gb3IgdGYuc3ViKGEsIGIpXG4gKiBgYGBcbiAqXG4gKiBgYGBqc1xuICogLy8gQnJvYWRjYXN0IHN1YnRyYWN0IGEgd2l0aCBiLlxuICogY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxMCwgMjAsIDMwLCA0MF0pO1xuICogY29uc3QgYiA9IHRmLnNjYWxhcig1KTtcbiAqXG4gKiBhLnN1YihiKS5wcmludCgpOyAgLy8gb3IgdGYuc3ViKGEsIGIpXG4gKiBgYGBcbiAqIEBwYXJhbSBhIFRoZSBmaXJzdCBgdGYuVGVuc29yYCB0byBzdWJ0cmFjdCBmcm9tLlxuICogQHBhcmFtIGIgVGhlIHNlY29uZCBgdGYuVGVuc29yYCB0byBiZSBzdWJ0cmFjdGVkLiBNdXN0IGhhdmUgdGhlIHNhbWUgZHR5cGUgYXNcbiAqIGBhYC5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdBcml0aG1ldGljJ31cbiAqL1xuZnVuY3Rpb24gc3ViXzxUIGV4dGVuZHMgVGVuc29yPihhOiBUZW5zb3J8VGVuc29yTGlrZSwgYjogVGVuc29yfFRlbnNvckxpa2UpOiBUIHtcbiAgbGV0ICRhID0gY29udmVydFRvVGVuc29yKGEsICdhJywgJ3N1YicpO1xuICBsZXQgJGIgPSBjb252ZXJ0VG9UZW5zb3IoYiwgJ2InLCAnc3ViJyk7XG4gIFskYSwgJGJdID0gbWFrZVR5cGVzTWF0Y2goJGEsICRiKTtcblxuICBjb25zdCBpbnB1dHM6IFN1YklucHV0cyA9IHthOiAkYSwgYjogJGJ9O1xuXG4gIHJldHVybiBFTkdJTkUucnVuS2VybmVsKFN1YiwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwKTtcbn1cblxuZXhwb3J0IGNvbnN0IHN1YiA9IG9wKHtzdWJffSk7XG4iXX0=