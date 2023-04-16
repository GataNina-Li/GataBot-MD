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
import { tidy } from '../globals';
import { Transpose } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { complex } from './complex';
import { imag } from './imag';
import { neg } from './neg';
import { op } from './operation';
import { real } from './real';
/**
 * Transposes the `tf.Tensor`. Permutes the dimensions according to `perm`.
 *
 * The returned `tf.Tensor`'s dimension `i` will correspond to the input
 * dimension `perm[i]`. If `perm` is not given, it is set to `[n-1...0]`,
 * where `n` is the rank of the input `tf.Tensor`. Hence by default, this
 * operation performs a regular matrix transpose on 2-D input `tf.Tensor`s.
 *
 * ```js
 * const a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
 *
 * a.transpose().print();  // or tf.transpose(a)
 * ```
 *
 * @param x The tensor to transpose.
 * @param perm The permutation of the dimensions of a.
 * @param conjugate Will conjugate complex input if true.
 *
 * @doc {heading: 'Operations', subheading: 'Matrices'}
 */
function transpose_(x, perm, conjugate) {
    const $x = convertToTensor(x, 'x', 'transpose');
    if (perm == null) {
        perm = $x.shape.map((s, i) => i).reverse();
    }
    util.assert($x.rank === perm.length, () => `Error in transpose: rank of input ${$x.rank} ` +
        `must match length of perm ${perm}.`);
    perm.forEach(axis => {
        util.assert(axis >= 0 && axis < $x.rank, () => `All entries in 'perm' must be between 0 and ${$x.rank - 1}` +
            ` but got ${perm}`);
    });
    if ($x.rank <= 1) {
        return $x.clone();
    }
    const inputs = { x: $x };
    const attrs = { perm };
    if ($x.dtype === 'complex64') {
        return tidy(() => {
            let $real = real($x);
            let $imag = imag($x);
            $real = ENGINE.runKernel(Transpose, { x: $real }, attrs);
            $imag = ENGINE.runKernel(Transpose, { x: $imag }, attrs);
            if (conjugate) {
                $imag = neg($imag);
            }
            return complex($real, $imag);
        });
    }
    return ENGINE.runKernel(Transpose, inputs, attrs);
}
export const transpose = op({ transpose_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNwb3NlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvdHJhbnNwb3NlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNoQyxPQUFPLEVBQUMsU0FBUyxFQUFrQyxNQUFNLGlCQUFpQixDQUFDO0FBSTNFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUVuRCxPQUFPLEtBQUssSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUNoQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFFNUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQkc7QUFDSCxTQUFTLFVBQVUsQ0FDZixDQUFlLEVBQUUsSUFBZSxFQUFFLFNBQW1CO0lBQ3ZELE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBRWhELElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtRQUNoQixJQUFJLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUM1QztJQUNELElBQUksQ0FBQyxNQUFNLENBQ1AsRUFBRSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsTUFBTSxFQUN2QixHQUFHLEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRSxDQUFDLElBQUksR0FBRztRQUNqRCw2QkFBNkIsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUM5QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2xCLElBQUksQ0FBQyxNQUFNLENBQ1AsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksRUFDM0IsR0FBRyxFQUFFLENBQUMsK0NBQStDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFO1lBQzlELFlBQVksSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM5QixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUU7UUFDaEIsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDbkI7SUFFRCxNQUFNLE1BQU0sR0FBb0IsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFDLENBQUM7SUFDeEMsTUFBTSxLQUFLLEdBQW1CLEVBQUMsSUFBSSxFQUFDLENBQUM7SUFFckMsSUFBSSxFQUFFLENBQUMsS0FBSyxLQUFLLFdBQVcsRUFBRTtRQUM1QixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDZixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDckIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3JCLEtBQUssR0FBRyxNQUFNLENBQUMsU0FBUyxDQUNwQixTQUFTLEVBQUUsRUFBQyxDQUFDLEVBQUUsS0FBSyxFQUF5QixFQUM3QyxLQUEyQixDQUFDLENBQUM7WUFDakMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQ3BCLFNBQVMsRUFBRSxFQUFDLENBQUMsRUFBRSxLQUFLLEVBQXlCLEVBQzdDLEtBQTJCLENBQUMsQ0FBQztZQUNqQyxJQUFJLFNBQVMsRUFBRTtnQkFDYixLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3BCO1lBQ0QsT0FBTyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO0tBQ0o7SUFFRCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQ25CLFNBQVMsRUFBRSxNQUE4QixFQUFFLEtBQTJCLENBQUMsQ0FBQztBQUM5RSxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQyxFQUFDLFVBQVUsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHt0aWR5fSBmcm9tICcuLi9nbG9iYWxzJztcbmltcG9ydCB7VHJhbnNwb3NlLCBUcmFuc3Bvc2VBdHRycywgVHJhbnNwb3NlSW5wdXRzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7TmFtZWRUZW5zb3JNYXB9IGZyb20gJy4uL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7Y29tcGxleH0gZnJvbSAnLi9jb21wbGV4JztcbmltcG9ydCB7aW1hZ30gZnJvbSAnLi9pbWFnJztcbmltcG9ydCB7bmVnfSBmcm9tICcuL25lZyc7XG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5pbXBvcnQge3JlYWx9IGZyb20gJy4vcmVhbCc7XG5cbi8qKlxuICogVHJhbnNwb3NlcyB0aGUgYHRmLlRlbnNvcmAuIFBlcm11dGVzIHRoZSBkaW1lbnNpb25zIGFjY29yZGluZyB0byBgcGVybWAuXG4gKlxuICogVGhlIHJldHVybmVkIGB0Zi5UZW5zb3JgJ3MgZGltZW5zaW9uIGBpYCB3aWxsIGNvcnJlc3BvbmQgdG8gdGhlIGlucHV0XG4gKiBkaW1lbnNpb24gYHBlcm1baV1gLiBJZiBgcGVybWAgaXMgbm90IGdpdmVuLCBpdCBpcyBzZXQgdG8gYFtuLTEuLi4wXWAsXG4gKiB3aGVyZSBgbmAgaXMgdGhlIHJhbmsgb2YgdGhlIGlucHV0IGB0Zi5UZW5zb3JgLiBIZW5jZSBieSBkZWZhdWx0LCB0aGlzXG4gKiBvcGVyYXRpb24gcGVyZm9ybXMgYSByZWd1bGFyIG1hdHJpeCB0cmFuc3Bvc2Ugb24gMi1EIGlucHV0IGB0Zi5UZW5zb3Jgcy5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgYSA9IHRmLnRlbnNvcjJkKFsxLCAyLCAzLCA0LCA1LCA2XSwgWzIsIDNdKTtcbiAqXG4gKiBhLnRyYW5zcG9zZSgpLnByaW50KCk7ICAvLyBvciB0Zi50cmFuc3Bvc2UoYSlcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB4IFRoZSB0ZW5zb3IgdG8gdHJhbnNwb3NlLlxuICogQHBhcmFtIHBlcm0gVGhlIHBlcm11dGF0aW9uIG9mIHRoZSBkaW1lbnNpb25zIG9mIGEuXG4gKiBAcGFyYW0gY29uanVnYXRlIFdpbGwgY29uanVnYXRlIGNvbXBsZXggaW5wdXQgaWYgdHJ1ZS5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdNYXRyaWNlcyd9XG4gKi9cbmZ1bmN0aW9uIHRyYW5zcG9zZV88VCBleHRlbmRzIFRlbnNvcj4oXG4gICAgeDogVHxUZW5zb3JMaWtlLCBwZXJtPzogbnVtYmVyW10sIGNvbmp1Z2F0ZT86IGJvb2xlYW4pOiBUIHtcbiAgY29uc3QgJHggPSBjb252ZXJ0VG9UZW5zb3IoeCwgJ3gnLCAndHJhbnNwb3NlJyk7XG5cbiAgaWYgKHBlcm0gPT0gbnVsbCkge1xuICAgIHBlcm0gPSAkeC5zaGFwZS5tYXAoKHMsIGkpID0+IGkpLnJldmVyc2UoKTtcbiAgfVxuICB1dGlsLmFzc2VydChcbiAgICAgICR4LnJhbmsgPT09IHBlcm0ubGVuZ3RoLFxuICAgICAgKCkgPT4gYEVycm9yIGluIHRyYW5zcG9zZTogcmFuayBvZiBpbnB1dCAkeyR4LnJhbmt9IGAgK1xuICAgICAgICAgIGBtdXN0IG1hdGNoIGxlbmd0aCBvZiBwZXJtICR7cGVybX0uYCk7XG4gIHBlcm0uZm9yRWFjaChheGlzID0+IHtcbiAgICB1dGlsLmFzc2VydChcbiAgICAgICAgYXhpcyA+PSAwICYmIGF4aXMgPCAkeC5yYW5rLFxuICAgICAgICAoKSA9PiBgQWxsIGVudHJpZXMgaW4gJ3Blcm0nIG11c3QgYmUgYmV0d2VlbiAwIGFuZCAkeyR4LnJhbmsgLSAxfWAgK1xuICAgICAgICAgICAgYCBidXQgZ290ICR7cGVybX1gKTtcbiAgfSk7XG5cbiAgaWYgKCR4LnJhbmsgPD0gMSkge1xuICAgIHJldHVybiAkeC5jbG9uZSgpO1xuICB9XG5cbiAgY29uc3QgaW5wdXRzOiBUcmFuc3Bvc2VJbnB1dHMgPSB7eDogJHh9O1xuICBjb25zdCBhdHRyczogVHJhbnNwb3NlQXR0cnMgPSB7cGVybX07XG5cbiAgaWYgKCR4LmR0eXBlID09PSAnY29tcGxleDY0Jykge1xuICAgIHJldHVybiB0aWR5KCgpID0+IHtcbiAgICAgIGxldCAkcmVhbCA9IHJlYWwoJHgpO1xuICAgICAgbGV0ICRpbWFnID0gaW1hZygkeCk7XG4gICAgICAkcmVhbCA9IEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICAgICAgVHJhbnNwb3NlLCB7eDogJHJlYWx9IGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLFxuICAgICAgICAgIGF0dHJzIGFzIHt9IGFzIE5hbWVkQXR0ck1hcCk7XG4gICAgICAkaW1hZyA9IEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICAgICAgVHJhbnNwb3NlLCB7eDogJGltYWd9IGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLFxuICAgICAgICAgIGF0dHJzIGFzIHt9IGFzIE5hbWVkQXR0ck1hcCk7XG4gICAgICBpZiAoY29uanVnYXRlKSB7XG4gICAgICAgICRpbWFnID0gbmVnKCRpbWFnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb21wbGV4KCRyZWFsLCAkaW1hZyk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChcbiAgICAgIFRyYW5zcG9zZSwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLCBhdHRycyBhcyB7fSBhcyBOYW1lZEF0dHJNYXApO1xufVxuXG5leHBvcnQgY29uc3QgdHJhbnNwb3NlID0gb3Aoe3RyYW5zcG9zZV99KTtcbiJdfQ==