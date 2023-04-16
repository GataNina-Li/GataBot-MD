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
import { TensorBuffer } from '../tensor';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
/**
 * Computes the difference between two lists of numbers.
 *
 * Given a Tensor `x` and a Tensor `y`, this operation returns a Tensor `out`
 * that represents all values that are in `x` but not in `y`. The returned
 * Tensor `out` is sorted in the same order that the numbers appear in `x`
 * (duplicates are preserved). This operation also returns a Tensor indices that
 * represents the position of each out element in `x`. In other words:
 *
 * `out[i] = x[idx[i]] for i in [0, 1, ..., out.length - 1]`
 *
 * ```js
 * const x = [1, 2, 3, 4, 5, 6];
 * const y = [1, 3, 5];
 *
 * const [out, indices] = await tf.setdiff1dAsync(x, y);
 * out.print(); // [2, 4, 6]
 * indices.print(); // [1, 3, 5]
 * ```
 *
 * @param x 1-D Tensor. Values to keep.
 * @param y 1-D Tensor. Must have the same type as x. Values to exclude in the
 *     output.
 * @returns Promise of Tensor tuple [out, indices].
 *  out: Tensor with the same type as x.
 *  indices: A Tensor of type int32.
 *
 * @doc {heading: 'Tensors', subheading: 'Transformations'}
 */
async function setdiff1dAsync_(x, y) {
    const $x = convertToTensor(x, 'x', 'setdiff1d');
    const $y = convertToTensor(y, 'y', 'setdiff1d');
    util.assert($x.dtype === $y.dtype, () => `x and y should have the same dtype, but got x (${$x.dtype}) and y (${$y.dtype}).`);
    util.assert($x.rank === 1, () => `x should be 1D tensor, but got x (${$x.shape}).`);
    util.assert($y.rank === 1, () => `y should be 1D tensor, but got y (${$y.shape}).`);
    const xVals = await $x.data();
    const yVals = await $y.data();
    const ySet = new Set(yVals);
    let outputSize = 0;
    for (let i = 0; i < xVals.length; i++) {
        if (!ySet.has(xVals[i])) {
            outputSize++;
        }
    }
    const buffer = new TensorBuffer([outputSize], $x.dtype);
    const indices = new TensorBuffer([outputSize], 'int32');
    for (let i = 0, p = 0; i < xVals.length; i++) {
        if (!ySet.has(xVals[i])) {
            buffer.values[p] = xVals[i];
            indices.values[p] = i;
            p++;
        }
    }
    return [buffer.toTensor(), indices.toTensor()];
}
export const setdiff1dAsync = setdiff1dAsync_;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0ZGlmZjFkX2FzeW5jLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvc2V0ZGlmZjFkX2FzeW5jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE9BQU8sRUFBUyxZQUFZLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDL0MsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE9BQU8sS0FBSyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBRWhDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNEJHO0FBQ0gsS0FBSyxVQUFVLGVBQWUsQ0FDMUIsQ0FBb0IsRUFBRSxDQUFvQjtJQUM1QyxNQUFNLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNoRCxNQUFNLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUVoRCxJQUFJLENBQUMsTUFBTSxDQUNQLEVBQUUsQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDLEtBQUssRUFDckIsR0FBRyxFQUFFLENBQUMsa0RBQ0YsRUFBRSxDQUFDLEtBQUssWUFBWSxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztJQUUxQyxJQUFJLENBQUMsTUFBTSxDQUNQLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLHFDQUFxQyxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztJQUU1RSxJQUFJLENBQUMsTUFBTSxDQUNQLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLHFDQUFxQyxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztJQUU1RSxNQUFNLEtBQUssR0FBRyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM5QixNQUFNLEtBQUssR0FBRyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM5QixNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUU1QixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFDbkIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDdkIsVUFBVSxFQUFFLENBQUM7U0FDZDtLQUNGO0lBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxZQUFZLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEQsTUFBTSxPQUFPLEdBQUcsSUFBSSxZQUFZLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN4RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3ZCLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLENBQUMsRUFBRSxDQUFDO1NBQ0w7S0FDRjtJQUNELE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDakQsQ0FBQztBQUNELE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxlQUFlLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQge1RlbnNvciwgVGVuc29yQnVmZmVyfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5cbi8qKlxuICogQ29tcHV0ZXMgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB0d28gbGlzdHMgb2YgbnVtYmVycy5cbiAqXG4gKiBHaXZlbiBhIFRlbnNvciBgeGAgYW5kIGEgVGVuc29yIGB5YCwgdGhpcyBvcGVyYXRpb24gcmV0dXJucyBhIFRlbnNvciBgb3V0YFxuICogdGhhdCByZXByZXNlbnRzIGFsbCB2YWx1ZXMgdGhhdCBhcmUgaW4gYHhgIGJ1dCBub3QgaW4gYHlgLiBUaGUgcmV0dXJuZWRcbiAqIFRlbnNvciBgb3V0YCBpcyBzb3J0ZWQgaW4gdGhlIHNhbWUgb3JkZXIgdGhhdCB0aGUgbnVtYmVycyBhcHBlYXIgaW4gYHhgXG4gKiAoZHVwbGljYXRlcyBhcmUgcHJlc2VydmVkKS4gVGhpcyBvcGVyYXRpb24gYWxzbyByZXR1cm5zIGEgVGVuc29yIGluZGljZXMgdGhhdFxuICogcmVwcmVzZW50cyB0aGUgcG9zaXRpb24gb2YgZWFjaCBvdXQgZWxlbWVudCBpbiBgeGAuIEluIG90aGVyIHdvcmRzOlxuICpcbiAqIGBvdXRbaV0gPSB4W2lkeFtpXV0gZm9yIGkgaW4gWzAsIDEsIC4uLiwgb3V0Lmxlbmd0aCAtIDFdYFxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCB4ID0gWzEsIDIsIDMsIDQsIDUsIDZdO1xuICogY29uc3QgeSA9IFsxLCAzLCA1XTtcbiAqXG4gKiBjb25zdCBbb3V0LCBpbmRpY2VzXSA9IGF3YWl0IHRmLnNldGRpZmYxZEFzeW5jKHgsIHkpO1xuICogb3V0LnByaW50KCk7IC8vIFsyLCA0LCA2XVxuICogaW5kaWNlcy5wcmludCgpOyAvLyBbMSwgMywgNV1cbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB4IDEtRCBUZW5zb3IuIFZhbHVlcyB0byBrZWVwLlxuICogQHBhcmFtIHkgMS1EIFRlbnNvci4gTXVzdCBoYXZlIHRoZSBzYW1lIHR5cGUgYXMgeC4gVmFsdWVzIHRvIGV4Y2x1ZGUgaW4gdGhlXG4gKiAgICAgb3V0cHV0LlxuICogQHJldHVybnMgUHJvbWlzZSBvZiBUZW5zb3IgdHVwbGUgW291dCwgaW5kaWNlc10uXG4gKiAgb3V0OiBUZW5zb3Igd2l0aCB0aGUgc2FtZSB0eXBlIGFzIHguXG4gKiAgaW5kaWNlczogQSBUZW5zb3Igb2YgdHlwZSBpbnQzMi5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnVGVuc29ycycsIHN1YmhlYWRpbmc6ICdUcmFuc2Zvcm1hdGlvbnMnfVxuICovXG5hc3luYyBmdW5jdGlvbiBzZXRkaWZmMWRBc3luY18oXG4gICAgeDogVGVuc29yfFRlbnNvckxpa2UsIHk6IFRlbnNvcnxUZW5zb3JMaWtlKTogUHJvbWlzZTxbVGVuc29yLCBUZW5zb3JdPiB7XG4gIGNvbnN0ICR4ID0gY29udmVydFRvVGVuc29yKHgsICd4JywgJ3NldGRpZmYxZCcpO1xuICBjb25zdCAkeSA9IGNvbnZlcnRUb1RlbnNvcih5LCAneScsICdzZXRkaWZmMWQnKTtcblxuICB1dGlsLmFzc2VydChcbiAgICAgICR4LmR0eXBlID09PSAkeS5kdHlwZSxcbiAgICAgICgpID0+IGB4IGFuZCB5IHNob3VsZCBoYXZlIHRoZSBzYW1lIGR0eXBlLCBidXQgZ290IHggKCR7XG4gICAgICAgICAgJHguZHR5cGV9KSBhbmQgeSAoJHskeS5kdHlwZX0pLmApO1xuXG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgJHgucmFuayA9PT0gMSwgKCkgPT4gYHggc2hvdWxkIGJlIDFEIHRlbnNvciwgYnV0IGdvdCB4ICgkeyR4LnNoYXBlfSkuYCk7XG5cbiAgdXRpbC5hc3NlcnQoXG4gICAgICAkeS5yYW5rID09PSAxLCAoKSA9PiBgeSBzaG91bGQgYmUgMUQgdGVuc29yLCBidXQgZ290IHkgKCR7JHkuc2hhcGV9KS5gKTtcblxuICBjb25zdCB4VmFscyA9IGF3YWl0ICR4LmRhdGEoKTtcbiAgY29uc3QgeVZhbHMgPSBhd2FpdCAkeS5kYXRhKCk7XG4gIGNvbnN0IHlTZXQgPSBuZXcgU2V0KHlWYWxzKTtcblxuICBsZXQgb3V0cHV0U2l6ZSA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgeFZhbHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIXlTZXQuaGFzKHhWYWxzW2ldKSkge1xuICAgICAgb3V0cHV0U2l6ZSsrO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGJ1ZmZlciA9IG5ldyBUZW5zb3JCdWZmZXIoW291dHB1dFNpemVdLCAkeC5kdHlwZSk7XG4gIGNvbnN0IGluZGljZXMgPSBuZXcgVGVuc29yQnVmZmVyKFtvdXRwdXRTaXplXSwgJ2ludDMyJyk7XG4gIGZvciAobGV0IGkgPSAwLCBwID0gMDsgaSA8IHhWYWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCF5U2V0Lmhhcyh4VmFsc1tpXSkpIHtcbiAgICAgIGJ1ZmZlci52YWx1ZXNbcF0gPSB4VmFsc1tpXTtcbiAgICAgIGluZGljZXMudmFsdWVzW3BdID0gaTtcbiAgICAgIHArKztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFtidWZmZXIudG9UZW5zb3IoKSwgaW5kaWNlcy50b1RlbnNvcigpXTtcbn1cbmV4cG9ydCBjb25zdCBzZXRkaWZmMWRBc3luYyA9IHNldGRpZmYxZEFzeW5jXztcbiJdfQ==