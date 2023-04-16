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
import { SplitV } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Splits a `tf.Tensor` into sub tensors.
 *
 * If `numOrSizeSplits` is a number, splits `x` along dimension `axis`
 * into `numOrSizeSplits` smaller tensors.
 * Requires that `numOrSizeSplits` evenly divides `x.shape[axis]`.
 *
 * If `numOrSizeSplits` is a number array, splits `x` into
 * `numOrSizeSplits.length` pieces. The shape of the `i`-th piece has the
 * same size as `x` except along dimension `axis` where the size is
 * `numOrSizeSplits[i]`.
 *
 * ```js
 * const x = tf.tensor2d([1, 2, 3, 4, 5, 6, 7, 8], [2, 4]);
 * const [a, b] = tf.split(x, 2, 1);
 * a.print();
 * b.print();
 *
 * const [c, d, e] = tf.split(x, [1, 2, 1], 1);
 * c.print();
 * d.print();
 * e.print();
 * ```
 *
 * @param x The input tensor to split.
 * @param numOrSizeSplits Either an integer indicating the number of
 * splits along the axis or an array of integers containing the sizes of
 * each output tensor along the axis. If a number then it must evenly divide
 * `x.shape[axis]`; otherwise the sum of sizes must match `x.shape[axis]`.
 * Can contain one -1 indicating that dimension is to be inferred.
 * @param axis The dimension along which to split. Defaults to 0 (the first
 * dim).
 *
 * @doc {heading: 'Tensors', subheading: 'Slicing and Joining'}
 */
function split_(x, numOrSizeSplits, axis = 0) {
    const $x = convertToTensor(x, 'x', 'split');
    const inputs = { x: $x };
    const attr = { numOrSizeSplits, axis };
    return ENGINE.runKernel(SplitV, inputs, attr);
}
export const split = op({ split_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9zcGxpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxNQUFNLEVBQTRCLE1BQU0saUJBQWlCLENBQUM7QUFJbEUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBR25ELE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFL0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQ0c7QUFDSCxTQUFTLE1BQU0sQ0FDWCxDQUFvQixFQUFFLGVBQWdDLEVBQUUsSUFBSSxHQUFHLENBQUM7SUFDbEUsTUFBTSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFNUMsTUFBTSxNQUFNLEdBQWlCLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBQyxDQUFDO0lBQ3JDLE1BQU0sSUFBSSxHQUFnQixFQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUMsQ0FBQztJQUVsRCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQ1osTUFBTSxFQUFFLE1BQThCLEVBQ3RDLElBQTBCLENBQWMsQ0FBQztBQUN0RCxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7U3BsaXRWLCBTcGxpdFZBdHRycywgU3BsaXRWSW5wdXRzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7TmFtZWRUZW5zb3JNYXB9IGZyb20gJy4uL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5cbi8qKlxuICogU3BsaXRzIGEgYHRmLlRlbnNvcmAgaW50byBzdWIgdGVuc29ycy5cbiAqXG4gKiBJZiBgbnVtT3JTaXplU3BsaXRzYCBpcyBhIG51bWJlciwgc3BsaXRzIGB4YCBhbG9uZyBkaW1lbnNpb24gYGF4aXNgXG4gKiBpbnRvIGBudW1PclNpemVTcGxpdHNgIHNtYWxsZXIgdGVuc29ycy5cbiAqIFJlcXVpcmVzIHRoYXQgYG51bU9yU2l6ZVNwbGl0c2AgZXZlbmx5IGRpdmlkZXMgYHguc2hhcGVbYXhpc11gLlxuICpcbiAqIElmIGBudW1PclNpemVTcGxpdHNgIGlzIGEgbnVtYmVyIGFycmF5LCBzcGxpdHMgYHhgIGludG9cbiAqIGBudW1PclNpemVTcGxpdHMubGVuZ3RoYCBwaWVjZXMuIFRoZSBzaGFwZSBvZiB0aGUgYGlgLXRoIHBpZWNlIGhhcyB0aGVcbiAqIHNhbWUgc2l6ZSBhcyBgeGAgZXhjZXB0IGFsb25nIGRpbWVuc2lvbiBgYXhpc2Agd2hlcmUgdGhlIHNpemUgaXNcbiAqIGBudW1PclNpemVTcGxpdHNbaV1gLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCB4ID0gdGYudGVuc29yMmQoWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDhdLCBbMiwgNF0pO1xuICogY29uc3QgW2EsIGJdID0gdGYuc3BsaXQoeCwgMiwgMSk7XG4gKiBhLnByaW50KCk7XG4gKiBiLnByaW50KCk7XG4gKlxuICogY29uc3QgW2MsIGQsIGVdID0gdGYuc3BsaXQoeCwgWzEsIDIsIDFdLCAxKTtcbiAqIGMucHJpbnQoKTtcbiAqIGQucHJpbnQoKTtcbiAqIGUucHJpbnQoKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB4IFRoZSBpbnB1dCB0ZW5zb3IgdG8gc3BsaXQuXG4gKiBAcGFyYW0gbnVtT3JTaXplU3BsaXRzIEVpdGhlciBhbiBpbnRlZ2VyIGluZGljYXRpbmcgdGhlIG51bWJlciBvZlxuICogc3BsaXRzIGFsb25nIHRoZSBheGlzIG9yIGFuIGFycmF5IG9mIGludGVnZXJzIGNvbnRhaW5pbmcgdGhlIHNpemVzIG9mXG4gKiBlYWNoIG91dHB1dCB0ZW5zb3IgYWxvbmcgdGhlIGF4aXMuIElmIGEgbnVtYmVyIHRoZW4gaXQgbXVzdCBldmVubHkgZGl2aWRlXG4gKiBgeC5zaGFwZVtheGlzXWA7IG90aGVyd2lzZSB0aGUgc3VtIG9mIHNpemVzIG11c3QgbWF0Y2ggYHguc2hhcGVbYXhpc11gLlxuICogQ2FuIGNvbnRhaW4gb25lIC0xIGluZGljYXRpbmcgdGhhdCBkaW1lbnNpb24gaXMgdG8gYmUgaW5mZXJyZWQuXG4gKiBAcGFyYW0gYXhpcyBUaGUgZGltZW5zaW9uIGFsb25nIHdoaWNoIHRvIHNwbGl0LiBEZWZhdWx0cyB0byAwICh0aGUgZmlyc3RcbiAqIGRpbSkuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ1RlbnNvcnMnLCBzdWJoZWFkaW5nOiAnU2xpY2luZyBhbmQgSm9pbmluZyd9XG4gKi9cbmZ1bmN0aW9uIHNwbGl0XzxUIGV4dGVuZHMgVGVuc29yPihcbiAgICB4OiBUZW5zb3J8VGVuc29yTGlrZSwgbnVtT3JTaXplU3BsaXRzOiBudW1iZXJbXXxudW1iZXIsIGF4aXMgPSAwKTogVFtdIHtcbiAgY29uc3QgJHggPSBjb252ZXJ0VG9UZW5zb3IoeCwgJ3gnLCAnc3BsaXQnKTtcblxuICBjb25zdCBpbnB1dHM6IFNwbGl0VklucHV0cyA9IHt4OiAkeH07XG4gIGNvbnN0IGF0dHI6IFNwbGl0VkF0dHJzID0ge251bU9yU2l6ZVNwbGl0cywgYXhpc307XG5cbiAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICAgICAgICAgU3BsaXRWLCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXAsXG4gICAgICAgICAgICAgYXR0ciBhcyB7fSBhcyBOYW1lZEF0dHJNYXApIGFzIHt9IGFzIFRbXTtcbn1cblxuZXhwb3J0IGNvbnN0IHNwbGl0ID0gb3Aoe3NwbGl0X30pO1xuIl19