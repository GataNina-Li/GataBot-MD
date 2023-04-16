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
import { buffer } from './buffer';
import { op } from './operation';
import { RandGamma } from './rand_util';
/**
 * Creates a `tf.Tensor` with values sampled from a gamma distribution.
 *
 * ```js
 * tf.randomGamma([2, 2], 1).print();
 * ```
 *
 * @param shape An array of integers defining the output tensor shape.
 * @param alpha The shape parameter of the gamma distribution.
 * @param beta The inverse scale parameter of the gamma distribution. Defaults
 *     to 1.
 * @param dtype The data type of the output. Defaults to float32.
 * @param seed The seed for the random number generator.
 *
 * @doc {heading: 'Tensors', subheading: 'Random'}
 */
function randomGamma_(shape, alpha, beta = 1, dtype = 'float32', seed) {
    if (beta == null) {
        beta = 1;
    }
    if (dtype == null) {
        dtype = 'float32';
    }
    if (dtype !== 'float32' && dtype !== 'int32') {
        throw new Error(`Unsupported data type ${dtype}`);
    }
    const rgamma = new RandGamma(alpha, beta, dtype, seed);
    const res = buffer(shape, dtype);
    for (let i = 0; i < res.values.length; i++) {
        res.values[i] = rgamma.nextValue();
    }
    return res.toTensor();
}
export const randomGamma = op({ randomGamma_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZG9tX2dhbW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvcmFuZG9tX2dhbW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUtILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDaEMsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMvQixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRXRDOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILFNBQVMsWUFBWSxDQUNqQixLQUFrQixFQUFFLEtBQWEsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUMzQyxRQUEyQixTQUFTLEVBQUUsSUFBYTtJQUNyRCxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7UUFDaEIsSUFBSSxHQUFHLENBQUMsQ0FBQztLQUNWO0lBQ0QsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO1FBQ2pCLEtBQUssR0FBRyxTQUFTLENBQUM7S0FDbkI7SUFDRCxJQUFJLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLE9BQU8sRUFBRTtRQUM1QyxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQ25EO0lBQ0QsTUFBTSxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdkQsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNqQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDMUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDcEM7SUFDRCxPQUFPLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUN4QixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyxFQUFDLFlBQVksRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtSYW5rLCBTaGFwZU1hcH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQge2J1ZmZlcn0gZnJvbSAnLi9idWZmZXInO1xuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuaW1wb3J0IHtSYW5kR2FtbWF9IGZyb20gJy4vcmFuZF91dGlsJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgYHRmLlRlbnNvcmAgd2l0aCB2YWx1ZXMgc2FtcGxlZCBmcm9tIGEgZ2FtbWEgZGlzdHJpYnV0aW9uLlxuICpcbiAqIGBgYGpzXG4gKiB0Zi5yYW5kb21HYW1tYShbMiwgMl0sIDEpLnByaW50KCk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gc2hhcGUgQW4gYXJyYXkgb2YgaW50ZWdlcnMgZGVmaW5pbmcgdGhlIG91dHB1dCB0ZW5zb3Igc2hhcGUuXG4gKiBAcGFyYW0gYWxwaGEgVGhlIHNoYXBlIHBhcmFtZXRlciBvZiB0aGUgZ2FtbWEgZGlzdHJpYnV0aW9uLlxuICogQHBhcmFtIGJldGEgVGhlIGludmVyc2Ugc2NhbGUgcGFyYW1ldGVyIG9mIHRoZSBnYW1tYSBkaXN0cmlidXRpb24uIERlZmF1bHRzXG4gKiAgICAgdG8gMS5cbiAqIEBwYXJhbSBkdHlwZSBUaGUgZGF0YSB0eXBlIG9mIHRoZSBvdXRwdXQuIERlZmF1bHRzIHRvIGZsb2F0MzIuXG4gKiBAcGFyYW0gc2VlZCBUaGUgc2VlZCBmb3IgdGhlIHJhbmRvbSBudW1iZXIgZ2VuZXJhdG9yLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdUZW5zb3JzJywgc3ViaGVhZGluZzogJ1JhbmRvbSd9XG4gKi9cbmZ1bmN0aW9uIHJhbmRvbUdhbW1hXzxSIGV4dGVuZHMgUmFuaz4oXG4gICAgc2hhcGU6IFNoYXBlTWFwW1JdLCBhbHBoYTogbnVtYmVyLCBiZXRhID0gMSxcbiAgICBkdHlwZTogJ2Zsb2F0MzInfCdpbnQzMicgPSAnZmxvYXQzMicsIHNlZWQ/OiBudW1iZXIpOiBUZW5zb3I8Uj4ge1xuICBpZiAoYmV0YSA9PSBudWxsKSB7XG4gICAgYmV0YSA9IDE7XG4gIH1cbiAgaWYgKGR0eXBlID09IG51bGwpIHtcbiAgICBkdHlwZSA9ICdmbG9hdDMyJztcbiAgfVxuICBpZiAoZHR5cGUgIT09ICdmbG9hdDMyJyAmJiBkdHlwZSAhPT0gJ2ludDMyJykge1xuICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZGF0YSB0eXBlICR7ZHR5cGV9YCk7XG4gIH1cbiAgY29uc3QgcmdhbW1hID0gbmV3IFJhbmRHYW1tYShhbHBoYSwgYmV0YSwgZHR5cGUsIHNlZWQpO1xuICBjb25zdCByZXMgPSBidWZmZXIoc2hhcGUsIGR0eXBlKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXMudmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgcmVzLnZhbHVlc1tpXSA9IHJnYW1tYS5uZXh0VmFsdWUoKTtcbiAgfVxuICByZXR1cm4gcmVzLnRvVGVuc29yKCk7XG59XG5cbmV4cG9ydCBjb25zdCByYW5kb21HYW1tYSA9IG9wKHtyYW5kb21HYW1tYV99KTtcbiJdfQ==