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
import { MirrorPad } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { op } from './operation';
/**
 * Pads a `tf.Tensor` using mirror padding.
 *
 * This operation implements the `REFLECT` and `SYMMETRIC` modes of pad.
 *
 * ```js
 * const x = tf.range(0, 9).reshape([1, 1, 3, 3]);
 * x.mirrorPad([[0, 0], [0, 0], [2, 2], [2, 2]], 'reflect').print();
 * ```
 * @param x The tensor to pad.
 * @param paddings An array of length `R` (the rank of the tensor), where
 * each element is a length-2 tuple of ints `[padBefore, padAfter]`,
 * specifying how much to pad along each dimension of the tensor.
 * In "reflect" mode, the padded regions do not include the borders,
 * while in "symmetric" mode the padded regions do include the borders.
 * For example, if the input is `[1, 2, 3]` and paddings is `[0, 2]`,
 * then the output is `[1, 2, 3, 2, 1]` in "reflect" mode, and
 * `[1, 2, 3, 3, 2]` in "symmetric" mode.
 * If `mode` is "reflect" then both `paddings[D, 0]` and `paddings[D, 1]`
 * must be no greater than `x.shape[D] - 1`. If mode is "symmetric"
 * then both `paddings[D, 0]` and `paddings[D, 1]` must be no greater than
 * `x.shape[D]`
 * @param mode String to specify padding mode. Can be `'reflect' | 'symmetric'`
 */
/** @doc {heading: 'Tensors', subheading: 'Transformations'} */
function mirrorPad_(x, paddings, mode) {
    util.assert(mode === 'reflect' || mode === 'symmetric', () => `Invalid mode. Mode must be either reflect or symmetric. ` +
        `Got ${mode}.`);
    const $x = convertToTensor(x, 'x', 'mirrorPad');
    if ($x.rank === 0) {
        throw new Error('mirrorPad(scalar) is not defined. ' +
            'Pass non-scalar to mirrorPad');
    }
    util.assert(paddings.length === $x.rank, () => `Padding doesn't match input. Must be ${$x.rank}. ` +
        `Got ${paddings.length}.`);
    const shapeOffset = mode === 'reflect' ? 1 : 0;
    for (let i = 0; i < $x.rank; i++) {
        util.assert(paddings[i].length === 2, () => `Invalid number of paddings. Must be length of 2 each.`);
        util.assert(paddings[i][0] >= 0 && paddings[i][0] <= $x.shape[i] - shapeOffset &&
            paddings[i][1] >= 0 && paddings[i][1] <= $x.shape[i] - shapeOffset, () => `Padding in dimension ${i} cannot be greater than or equal ` +
            `to ${$x.shape[i] - shapeOffset} or less than 0 for input of ` +
            `shape ${$x.shape}`);
    }
    const attrs = { paddings, mode };
    const inputs = { x: $x };
    return ENGINE.runKernel(MirrorPad, inputs, attrs);
}
export const mirrorPad = op({ mirrorPad_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlycm9yX3BhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL21pcnJvcl9wYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsU0FBUyxFQUFrQyxNQUFNLGlCQUFpQixDQUFDO0FBSTNFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUVuRCxPQUFPLEtBQUssSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUVoQyxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRS9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCRztBQUNILCtEQUErRDtBQUMvRCxTQUFTLFVBQVUsQ0FDZixDQUFlLEVBQUUsUUFBaUMsRUFDbEQsSUFBMkI7SUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FDUCxJQUFJLEtBQUssU0FBUyxJQUFJLElBQUksS0FBSyxXQUFXLEVBQzFDLEdBQUcsRUFBRSxDQUFDLDBEQUEwRDtRQUM1RCxPQUFPLElBQUksR0FBRyxDQUFDLENBQUM7SUFFeEIsTUFBTSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDaEQsSUFBSSxFQUFFLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtRQUNqQixNQUFNLElBQUksS0FBSyxDQUNYLG9DQUFvQztZQUNwQyw4QkFBOEIsQ0FBQyxDQUFDO0tBQ3JDO0lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FDUCxRQUFRLENBQUMsTUFBTSxLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQzNCLEdBQUcsRUFBRSxDQUFDLHdDQUF3QyxFQUFFLENBQUMsSUFBSSxJQUFJO1FBQ3JELE9BQU8sUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDbkMsTUFBTSxXQUFXLEdBQUcsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FDUCxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFDeEIsR0FBRyxFQUFFLENBQUMsdURBQXVELENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsTUFBTSxDQUNQLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVztZQUM5RCxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsRUFDdEUsR0FBRyxFQUFFLENBQUMsd0JBQXdCLENBQUMsbUNBQW1DO1lBQzlELE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxXQUFXLCtCQUErQjtZQUM5RCxTQUFTLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQzlCO0lBRUQsTUFBTSxLQUFLLEdBQW1CLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDO0lBQy9DLE1BQU0sTUFBTSxHQUFvQixFQUFDLENBQUMsRUFBRSxFQUFFLEVBQUMsQ0FBQztJQUN4QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQ25CLFNBQVMsRUFBRSxNQUE4QixFQUFFLEtBQTJCLENBQUMsQ0FBQztBQUM5RSxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQyxFQUFDLFVBQVUsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtNaXJyb3JQYWQsIE1pcnJvclBhZEF0dHJzLCBNaXJyb3JQYWRJbnB1dHN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge05hbWVkQXR0ck1hcH0gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5cbi8qKlxuICogUGFkcyBhIGB0Zi5UZW5zb3JgIHVzaW5nIG1pcnJvciBwYWRkaW5nLlxuICpcbiAqIFRoaXMgb3BlcmF0aW9uIGltcGxlbWVudHMgdGhlIGBSRUZMRUNUYCBhbmQgYFNZTU1FVFJJQ2AgbW9kZXMgb2YgcGFkLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCB4ID0gdGYucmFuZ2UoMCwgOSkucmVzaGFwZShbMSwgMSwgMywgM10pO1xuICogeC5taXJyb3JQYWQoW1swLCAwXSwgWzAsIDBdLCBbMiwgMl0sIFsyLCAyXV0sICdyZWZsZWN0JykucHJpbnQoKTtcbiAqIGBgYFxuICogQHBhcmFtIHggVGhlIHRlbnNvciB0byBwYWQuXG4gKiBAcGFyYW0gcGFkZGluZ3MgQW4gYXJyYXkgb2YgbGVuZ3RoIGBSYCAodGhlIHJhbmsgb2YgdGhlIHRlbnNvciksIHdoZXJlXG4gKiBlYWNoIGVsZW1lbnQgaXMgYSBsZW5ndGgtMiB0dXBsZSBvZiBpbnRzIGBbcGFkQmVmb3JlLCBwYWRBZnRlcl1gLFxuICogc3BlY2lmeWluZyBob3cgbXVjaCB0byBwYWQgYWxvbmcgZWFjaCBkaW1lbnNpb24gb2YgdGhlIHRlbnNvci5cbiAqIEluIFwicmVmbGVjdFwiIG1vZGUsIHRoZSBwYWRkZWQgcmVnaW9ucyBkbyBub3QgaW5jbHVkZSB0aGUgYm9yZGVycyxcbiAqIHdoaWxlIGluIFwic3ltbWV0cmljXCIgbW9kZSB0aGUgcGFkZGVkIHJlZ2lvbnMgZG8gaW5jbHVkZSB0aGUgYm9yZGVycy5cbiAqIEZvciBleGFtcGxlLCBpZiB0aGUgaW5wdXQgaXMgYFsxLCAyLCAzXWAgYW5kIHBhZGRpbmdzIGlzIGBbMCwgMl1gLFxuICogdGhlbiB0aGUgb3V0cHV0IGlzIGBbMSwgMiwgMywgMiwgMV1gIGluIFwicmVmbGVjdFwiIG1vZGUsIGFuZFxuICogYFsxLCAyLCAzLCAzLCAyXWAgaW4gXCJzeW1tZXRyaWNcIiBtb2RlLlxuICogSWYgYG1vZGVgIGlzIFwicmVmbGVjdFwiIHRoZW4gYm90aCBgcGFkZGluZ3NbRCwgMF1gIGFuZCBgcGFkZGluZ3NbRCwgMV1gXG4gKiBtdXN0IGJlIG5vIGdyZWF0ZXIgdGhhbiBgeC5zaGFwZVtEXSAtIDFgLiBJZiBtb2RlIGlzIFwic3ltbWV0cmljXCJcbiAqIHRoZW4gYm90aCBgcGFkZGluZ3NbRCwgMF1gIGFuZCBgcGFkZGluZ3NbRCwgMV1gIG11c3QgYmUgbm8gZ3JlYXRlciB0aGFuXG4gKiBgeC5zaGFwZVtEXWBcbiAqIEBwYXJhbSBtb2RlIFN0cmluZyB0byBzcGVjaWZ5IHBhZGRpbmcgbW9kZS4gQ2FuIGJlIGAncmVmbGVjdCcgfCAnc3ltbWV0cmljJ2BcbiAqL1xuLyoqIEBkb2Mge2hlYWRpbmc6ICdUZW5zb3JzJywgc3ViaGVhZGluZzogJ1RyYW5zZm9ybWF0aW9ucyd9ICovXG5mdW5jdGlvbiBtaXJyb3JQYWRfPFQgZXh0ZW5kcyBUZW5zb3I+KFxuICAgIHg6IFR8VGVuc29yTGlrZSwgcGFkZGluZ3M6IEFycmF5PFtudW1iZXIsIG51bWJlcl0+LFxuICAgIG1vZGU6ICdyZWZsZWN0J3wnc3ltbWV0cmljJyk6IFQge1xuICB1dGlsLmFzc2VydChcbiAgICAgIG1vZGUgPT09ICdyZWZsZWN0JyB8fCBtb2RlID09PSAnc3ltbWV0cmljJyxcbiAgICAgICgpID0+IGBJbnZhbGlkIG1vZGUuIE1vZGUgbXVzdCBiZSBlaXRoZXIgcmVmbGVjdCBvciBzeW1tZXRyaWMuIGAgK1xuICAgICAgICAgIGBHb3QgJHttb2RlfS5gKTtcblxuICBjb25zdCAkeCA9IGNvbnZlcnRUb1RlbnNvcih4LCAneCcsICdtaXJyb3JQYWQnKTtcbiAgaWYgKCR4LnJhbmsgPT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdtaXJyb3JQYWQoc2NhbGFyKSBpcyBub3QgZGVmaW5lZC4gJyArXG4gICAgICAgICdQYXNzIG5vbi1zY2FsYXIgdG8gbWlycm9yUGFkJyk7XG4gIH1cbiAgdXRpbC5hc3NlcnQoXG4gICAgICBwYWRkaW5ncy5sZW5ndGggPT09ICR4LnJhbmssXG4gICAgICAoKSA9PiBgUGFkZGluZyBkb2Vzbid0IG1hdGNoIGlucHV0LiBNdXN0IGJlICR7JHgucmFua30uIGAgK1xuICAgICAgICAgIGBHb3QgJHtwYWRkaW5ncy5sZW5ndGh9LmApO1xuICBjb25zdCBzaGFwZU9mZnNldCA9IG1vZGUgPT09ICdyZWZsZWN0JyA/IDEgOiAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8ICR4LnJhbms7IGkrKykge1xuICAgIHV0aWwuYXNzZXJ0KFxuICAgICAgICBwYWRkaW5nc1tpXS5sZW5ndGggPT09IDIsXG4gICAgICAgICgpID0+IGBJbnZhbGlkIG51bWJlciBvZiBwYWRkaW5ncy4gTXVzdCBiZSBsZW5ndGggb2YgMiBlYWNoLmApO1xuICAgIHV0aWwuYXNzZXJ0KFxuICAgICAgICBwYWRkaW5nc1tpXVswXSA+PSAwICYmIHBhZGRpbmdzW2ldWzBdIDw9ICR4LnNoYXBlW2ldIC0gc2hhcGVPZmZzZXQgJiZcbiAgICAgICAgICAgIHBhZGRpbmdzW2ldWzFdID49IDAgJiYgcGFkZGluZ3NbaV1bMV0gPD0gJHguc2hhcGVbaV0gLSBzaGFwZU9mZnNldCxcbiAgICAgICAgKCkgPT4gYFBhZGRpbmcgaW4gZGltZW5zaW9uICR7aX0gY2Fubm90IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCBgICtcbiAgICAgICAgICAgIGB0byAkeyR4LnNoYXBlW2ldIC0gc2hhcGVPZmZzZXR9IG9yIGxlc3MgdGhhbiAwIGZvciBpbnB1dCBvZiBgICtcbiAgICAgICAgICAgIGBzaGFwZSAkeyR4LnNoYXBlfWApO1xuICB9XG5cbiAgY29uc3QgYXR0cnM6IE1pcnJvclBhZEF0dHJzID0ge3BhZGRpbmdzLCBtb2RlfTtcbiAgY29uc3QgaW5wdXRzOiBNaXJyb3JQYWRJbnB1dHMgPSB7eDogJHh9O1xuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChcbiAgICAgIE1pcnJvclBhZCwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLCBhdHRycyBhcyB7fSBhcyBOYW1lZEF0dHJNYXApO1xufVxuXG5leHBvcnQgY29uc3QgbWlycm9yUGFkID0gb3Aoe21pcnJvclBhZF99KTtcbiJdfQ==