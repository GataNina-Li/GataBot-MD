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
import { customGrad } from '../gradients';
import { convertToTensor } from '../tensor_util_env';
import { mul } from './mul';
import { neg } from './neg';
import { op } from './operation';
import { sigmoid } from './sigmoid';
import { softplus } from './softplus';
/**
 * Computes log sigmoid of the input `tf.Tensor` element-wise:
 * `logSigmoid(x)`. For numerical stability, we use `-tf.softplus(-x)`.
 *
 * ```js
 * const x = tf.tensor1d([0, 1, -1, .7]);
 *
 * x.logSigmoid().print();  // or tf.logSigmoid(x)
 * ```
 * @param x The input tensor.
 *
 * @doc {heading: 'Operations', subheading: 'Basic math'}
 */
function logSigmoid_(x) {
    const $x = convertToTensor(x, 'x', 'logSigmoid');
    // Use a custom gradient to maintain previous implementation.
    // There is no LogSigmoid kernel in TF so we can't use engine.runKernel
    // directly
    const customOp = customGrad((x) => {
        // TODO(yassogba) we can remove the chained softplus call here only
        // after backends have modualrized softplus at which point we can call
        // engine runKernel(..., Sotfplus, ...) directly.
        const value = neg(softplus(neg(x)));
        const gradFunc = (dy) => {
            const derX = mul(dy, sigmoid(neg(x)));
            return derX;
        };
        return { value, gradFunc };
    });
    return customOp($x);
}
export const logSigmoid = op({ logSigmoid_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nX3NpZ21vaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9sb2dfc2lnbW9pZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRXhDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUduRCxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMvQixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFcEM7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsU0FBUyxXQUFXLENBQW1CLENBQWU7SUFDcEQsTUFBTSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFFakQsNkRBQTZEO0lBQzdELHVFQUF1RTtJQUN2RSxXQUFXO0lBQ1gsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBUyxFQUFFLEVBQUU7UUFDeEMsbUVBQW1FO1FBQ25FLHNFQUFzRTtRQUN0RSxpREFBaUQ7UUFDakQsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXBDLE1BQU0sUUFBUSxHQUFHLENBQUMsRUFBSyxFQUFFLEVBQUU7WUFDekIsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxPQUFPLElBQUksQ0FBQztRQUNkLENBQUMsQ0FBQztRQUNGLE9BQU8sRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLENBQUM7SUFDM0IsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLFFBQVEsQ0FBQyxFQUFFLENBQU0sQ0FBQztBQUMzQixDQUFDO0FBQ0QsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxFQUFDLFdBQVcsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7Y3VzdG9tR3JhZH0gZnJvbSAnLi4vZ3JhZGllbnRzJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcblxuaW1wb3J0IHttdWx9IGZyb20gJy4vbXVsJztcbmltcG9ydCB7bmVnfSBmcm9tICcuL25lZyc7XG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5pbXBvcnQge3NpZ21vaWR9IGZyb20gJy4vc2lnbW9pZCc7XG5pbXBvcnQge3NvZnRwbHVzfSBmcm9tICcuL3NvZnRwbHVzJztcblxuLyoqXG4gKiBDb21wdXRlcyBsb2cgc2lnbW9pZCBvZiB0aGUgaW5wdXQgYHRmLlRlbnNvcmAgZWxlbWVudC13aXNlOlxuICogYGxvZ1NpZ21vaWQoeClgLiBGb3IgbnVtZXJpY2FsIHN0YWJpbGl0eSwgd2UgdXNlIGAtdGYuc29mdHBsdXMoLXgpYC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgeCA9IHRmLnRlbnNvcjFkKFswLCAxLCAtMSwgLjddKTtcbiAqXG4gKiB4LmxvZ1NpZ21vaWQoKS5wcmludCgpOyAgLy8gb3IgdGYubG9nU2lnbW9pZCh4KVxuICogYGBgXG4gKiBAcGFyYW0geCBUaGUgaW5wdXQgdGVuc29yLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdPcGVyYXRpb25zJywgc3ViaGVhZGluZzogJ0Jhc2ljIG1hdGgnfVxuICovXG5mdW5jdGlvbiBsb2dTaWdtb2lkXzxUIGV4dGVuZHMgVGVuc29yPih4OiBUfFRlbnNvckxpa2UpOiBUIHtcbiAgY29uc3QgJHggPSBjb252ZXJ0VG9UZW5zb3IoeCwgJ3gnLCAnbG9nU2lnbW9pZCcpO1xuXG4gIC8vIFVzZSBhIGN1c3RvbSBncmFkaWVudCB0byBtYWludGFpbiBwcmV2aW91cyBpbXBsZW1lbnRhdGlvbi5cbiAgLy8gVGhlcmUgaXMgbm8gTG9nU2lnbW9pZCBrZXJuZWwgaW4gVEYgc28gd2UgY2FuJ3QgdXNlIGVuZ2luZS5ydW5LZXJuZWxcbiAgLy8gZGlyZWN0bHlcbiAgY29uc3QgY3VzdG9tT3AgPSBjdXN0b21HcmFkKCh4OiBUZW5zb3IpID0+IHtcbiAgICAvLyBUT0RPKHlhc3NvZ2JhKSB3ZSBjYW4gcmVtb3ZlIHRoZSBjaGFpbmVkIHNvZnRwbHVzIGNhbGwgaGVyZSBvbmx5XG4gICAgLy8gYWZ0ZXIgYmFja2VuZHMgaGF2ZSBtb2R1YWxyaXplZCBzb2Z0cGx1cyBhdCB3aGljaCBwb2ludCB3ZSBjYW4gY2FsbFxuICAgIC8vIGVuZ2luZSBydW5LZXJuZWwoLi4uLCBTb3RmcGx1cywgLi4uKSBkaXJlY3RseS5cbiAgICBjb25zdCB2YWx1ZSA9IG5lZyhzb2Z0cGx1cyhuZWcoeCkpKTtcblxuICAgIGNvbnN0IGdyYWRGdW5jID0gKGR5OiBUKSA9PiB7XG4gICAgICBjb25zdCBkZXJYID0gbXVsKGR5LCBzaWdtb2lkKG5lZyh4KSkpO1xuICAgICAgcmV0dXJuIGRlclg7XG4gICAgfTtcbiAgICByZXR1cm4ge3ZhbHVlLCBncmFkRnVuY307XG4gIH0pO1xuXG4gIHJldHVybiBjdXN0b21PcCgkeCkgYXMgVDtcbn1cbmV4cG9ydCBjb25zdCBsb2dTaWdtb2lkID0gb3Aoe2xvZ1NpZ21vaWRffSk7XG4iXX0=