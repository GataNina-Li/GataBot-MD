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
import { SpaceToBatchND } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { op } from './operation';
/**
 * This operation divides "spatial" dimensions `[1, ..., M]` of the input into
 * a grid of blocks of shape `blockShape`, and interleaves these blocks with
 * the "batch" dimension (0) such that in the output, the spatial
 * dimensions `[1, ..., M]` correspond to the position within the grid,
 * and the batch dimension combines both the position within a spatial block
 * and the original batch position. Prior to division into blocks,
 * the spatial dimensions of the input are optionally zero padded
 * according to `paddings`. See below for a precise description.
 *
 * ```js
 * const x = tf.tensor4d([1, 2, 3, 4], [1, 2, 2, 1]);
 * const blockShape = [2, 2];
 * const paddings = [[0, 0], [0, 0]];
 *
 * x.spaceToBatchND(blockShape, paddings).print();
 * ```
 *
 * @param x A `tf.Tensor`. N-D with `x.shape` = `[batch] + spatialShape +
 * remainingShape`, where spatialShape has `M` dimensions.
 * @param blockShape A 1-D array. Must have shape `[M]`, all values must
 * be >= 1.
 * @param paddings A 2-D array. Must have shape `[M, 2]`, all values must be >=
 *     0. `paddings[i] = [padStart, padEnd]` specifies the amount to zero-pad
 * from input dimension `i + 1`, which corresponds to spatial dimension `i`. It
 * is required that
 * `(inputShape[i + 1] + padStart + padEnd) % blockShape[i] === 0`
 *
 * This operation is equivalent to the following steps:
 *
 * 1. Zero-pad the start and end of dimensions `[1, ..., M]` of the input
 * according to `paddings` to produce `padded` of shape paddedShape.
 *
 * 2. Reshape `padded` to `reshapedPadded` of shape:
 * `[batch] + [paddedShape[1] / blockShape[0], blockShape[0], ...,
 * paddedShape[M] / blockShape[M-1], blockShape[M-1]] + remainingShape`
 *
 * 3. Permute dimensions of `reshapedPadded` to produce `permutedReshapedPadded`
 * of shape: `blockShape + [batch] + [paddedShape[1] / blockShape[0], ...,
 * paddedShape[M] / blockShape[M-1]] + remainingShape`
 *
 * 4. Reshape `permutedReshapedPadded` to flatten `blockShape` into the
 * batch dimension, producing an output tensor of shape:
 * `[batch * prod(blockShape)] + [paddedShape[1] / blockShape[0], ...,
 * paddedShape[M] / blockShape[M-1]] + remainingShape`
 *
 * @doc {heading: 'Tensors', subheading: 'Transformations'}
 */
function spaceToBatchND_(x, blockShape, paddings) {
    const $x = convertToTensor(x, 'x', 'spaceToBatchND');
    util.assert($x.rank >= 1 + blockShape.length, () => `input rank ${$x.rank} should be > than [blockShape] ${blockShape.length}`);
    util.assert(paddings.length === blockShape.length, () => `paddings.shape[0] ${paddings.length} must be equal to [blockShape] ${blockShape.length}`);
    util.assert($x.shape.reduce((a, b, i) => {
        if (i > 0 && i <= blockShape.length) {
            return a &&
                ((b + paddings[i - 1][0] + paddings[i - 1][1]) %
                    blockShape[i - 1] ===
                    0);
        }
        return a;
    }, true), () => `input spatial dimensions ${$x.shape.slice(1)} with paddings ${paddings.toString()} must be divisible by blockShapes ${blockShape.toString()}`);
    const inputs = { x: $x };
    const attrs = { blockShape, paddings };
    return ENGINE.runKernel(SpaceToBatchND, inputs, attrs);
}
export const spaceToBatchND = op({ spaceToBatchND_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BhY2VfdG9fYmF0Y2hfbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9zcGFjZV90b19iYXRjaF9uZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxjQUFjLEVBQTRDLE1BQU0saUJBQWlCLENBQUM7QUFJMUYsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE9BQU8sS0FBSyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBRWhDLE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFL0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBK0NHO0FBQ0gsU0FBUyxlQUFlLENBQ3BCLENBQWUsRUFBRSxVQUFvQixFQUFFLFFBQW9CO0lBQzdELE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFFckQsSUFBSSxDQUFDLE1BQU0sQ0FDUCxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUNoQyxHQUFHLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxJQUFJLGtDQUN2QixVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUU3QixJQUFJLENBQUMsTUFBTSxDQUNQLFFBQVEsQ0FBQyxNQUFNLEtBQUssVUFBVSxDQUFDLE1BQU0sRUFDckMsR0FBRyxFQUFFLENBQUMscUJBQ0YsUUFBUSxDQUFDLE1BQU0sa0NBQWtDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBRTlFLElBQUksQ0FBQyxNQUFNLENBQ1AsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQ1gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ1YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFO1lBQ25DLE9BQU8sQ0FBQztnQkFDSixDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3JCLENBQUMsQ0FBQyxDQUFDO1NBQ1Q7UUFDRCxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUMsRUFDRCxJQUFJLENBQUMsRUFDVCxHQUFHLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGtCQUMvQyxRQUFRLENBQUMsUUFBUSxFQUFFLHFDQUNuQixVQUFVLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRWpDLE1BQU0sTUFBTSxHQUF5QixFQUFDLENBQUMsRUFBRSxFQUFFLEVBQUMsQ0FBQztJQUM3QyxNQUFNLEtBQUssR0FBd0IsRUFBQyxVQUFVLEVBQUUsUUFBUSxFQUFDLENBQUM7SUFFMUQsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUNuQixjQUFjLEVBQUUsTUFBOEIsRUFDOUMsS0FBMkIsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDLEVBQUMsZUFBZSxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge1NwYWNlVG9CYXRjaE5ELCBTcGFjZVRvQmF0Y2hOREF0dHJzLCBTcGFjZVRvQmF0Y2hORElucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7TmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcblxuLyoqXG4gKiBUaGlzIG9wZXJhdGlvbiBkaXZpZGVzIFwic3BhdGlhbFwiIGRpbWVuc2lvbnMgYFsxLCAuLi4sIE1dYCBvZiB0aGUgaW5wdXQgaW50b1xuICogYSBncmlkIG9mIGJsb2NrcyBvZiBzaGFwZSBgYmxvY2tTaGFwZWAsIGFuZCBpbnRlcmxlYXZlcyB0aGVzZSBibG9ja3Mgd2l0aFxuICogdGhlIFwiYmF0Y2hcIiBkaW1lbnNpb24gKDApIHN1Y2ggdGhhdCBpbiB0aGUgb3V0cHV0LCB0aGUgc3BhdGlhbFxuICogZGltZW5zaW9ucyBgWzEsIC4uLiwgTV1gIGNvcnJlc3BvbmQgdG8gdGhlIHBvc2l0aW9uIHdpdGhpbiB0aGUgZ3JpZCxcbiAqIGFuZCB0aGUgYmF0Y2ggZGltZW5zaW9uIGNvbWJpbmVzIGJvdGggdGhlIHBvc2l0aW9uIHdpdGhpbiBhIHNwYXRpYWwgYmxvY2tcbiAqIGFuZCB0aGUgb3JpZ2luYWwgYmF0Y2ggcG9zaXRpb24uIFByaW9yIHRvIGRpdmlzaW9uIGludG8gYmxvY2tzLFxuICogdGhlIHNwYXRpYWwgZGltZW5zaW9ucyBvZiB0aGUgaW5wdXQgYXJlIG9wdGlvbmFsbHkgemVybyBwYWRkZWRcbiAqIGFjY29yZGluZyB0byBgcGFkZGluZ3NgLiBTZWUgYmVsb3cgZm9yIGEgcHJlY2lzZSBkZXNjcmlwdGlvbi5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgeCA9IHRmLnRlbnNvcjRkKFsxLCAyLCAzLCA0XSwgWzEsIDIsIDIsIDFdKTtcbiAqIGNvbnN0IGJsb2NrU2hhcGUgPSBbMiwgMl07XG4gKiBjb25zdCBwYWRkaW5ncyA9IFtbMCwgMF0sIFswLCAwXV07XG4gKlxuICogeC5zcGFjZVRvQmF0Y2hORChibG9ja1NoYXBlLCBwYWRkaW5ncykucHJpbnQoKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB4IEEgYHRmLlRlbnNvcmAuIE4tRCB3aXRoIGB4LnNoYXBlYCA9IGBbYmF0Y2hdICsgc3BhdGlhbFNoYXBlICtcbiAqIHJlbWFpbmluZ1NoYXBlYCwgd2hlcmUgc3BhdGlhbFNoYXBlIGhhcyBgTWAgZGltZW5zaW9ucy5cbiAqIEBwYXJhbSBibG9ja1NoYXBlIEEgMS1EIGFycmF5LiBNdXN0IGhhdmUgc2hhcGUgYFtNXWAsIGFsbCB2YWx1ZXMgbXVzdFxuICogYmUgPj0gMS5cbiAqIEBwYXJhbSBwYWRkaW5ncyBBIDItRCBhcnJheS4gTXVzdCBoYXZlIHNoYXBlIGBbTSwgMl1gLCBhbGwgdmFsdWVzIG11c3QgYmUgPj1cbiAqICAgICAwLiBgcGFkZGluZ3NbaV0gPSBbcGFkU3RhcnQsIHBhZEVuZF1gIHNwZWNpZmllcyB0aGUgYW1vdW50IHRvIHplcm8tcGFkXG4gKiBmcm9tIGlucHV0IGRpbWVuc2lvbiBgaSArIDFgLCB3aGljaCBjb3JyZXNwb25kcyB0byBzcGF0aWFsIGRpbWVuc2lvbiBgaWAuIEl0XG4gKiBpcyByZXF1aXJlZCB0aGF0XG4gKiBgKGlucHV0U2hhcGVbaSArIDFdICsgcGFkU3RhcnQgKyBwYWRFbmQpICUgYmxvY2tTaGFwZVtpXSA9PT0gMGBcbiAqXG4gKiBUaGlzIG9wZXJhdGlvbiBpcyBlcXVpdmFsZW50IHRvIHRoZSBmb2xsb3dpbmcgc3RlcHM6XG4gKlxuICogMS4gWmVyby1wYWQgdGhlIHN0YXJ0IGFuZCBlbmQgb2YgZGltZW5zaW9ucyBgWzEsIC4uLiwgTV1gIG9mIHRoZSBpbnB1dFxuICogYWNjb3JkaW5nIHRvIGBwYWRkaW5nc2AgdG8gcHJvZHVjZSBgcGFkZGVkYCBvZiBzaGFwZSBwYWRkZWRTaGFwZS5cbiAqXG4gKiAyLiBSZXNoYXBlIGBwYWRkZWRgIHRvIGByZXNoYXBlZFBhZGRlZGAgb2Ygc2hhcGU6XG4gKiBgW2JhdGNoXSArIFtwYWRkZWRTaGFwZVsxXSAvIGJsb2NrU2hhcGVbMF0sIGJsb2NrU2hhcGVbMF0sIC4uLixcbiAqIHBhZGRlZFNoYXBlW01dIC8gYmxvY2tTaGFwZVtNLTFdLCBibG9ja1NoYXBlW00tMV1dICsgcmVtYWluaW5nU2hhcGVgXG4gKlxuICogMy4gUGVybXV0ZSBkaW1lbnNpb25zIG9mIGByZXNoYXBlZFBhZGRlZGAgdG8gcHJvZHVjZSBgcGVybXV0ZWRSZXNoYXBlZFBhZGRlZGBcbiAqIG9mIHNoYXBlOiBgYmxvY2tTaGFwZSArIFtiYXRjaF0gKyBbcGFkZGVkU2hhcGVbMV0gLyBibG9ja1NoYXBlWzBdLCAuLi4sXG4gKiBwYWRkZWRTaGFwZVtNXSAvIGJsb2NrU2hhcGVbTS0xXV0gKyByZW1haW5pbmdTaGFwZWBcbiAqXG4gKiA0LiBSZXNoYXBlIGBwZXJtdXRlZFJlc2hhcGVkUGFkZGVkYCB0byBmbGF0dGVuIGBibG9ja1NoYXBlYCBpbnRvIHRoZVxuICogYmF0Y2ggZGltZW5zaW9uLCBwcm9kdWNpbmcgYW4gb3V0cHV0IHRlbnNvciBvZiBzaGFwZTpcbiAqIGBbYmF0Y2ggKiBwcm9kKGJsb2NrU2hhcGUpXSArIFtwYWRkZWRTaGFwZVsxXSAvIGJsb2NrU2hhcGVbMF0sIC4uLixcbiAqIHBhZGRlZFNoYXBlW01dIC8gYmxvY2tTaGFwZVtNLTFdXSArIHJlbWFpbmluZ1NoYXBlYFxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdUZW5zb3JzJywgc3ViaGVhZGluZzogJ1RyYW5zZm9ybWF0aW9ucyd9XG4gKi9cbmZ1bmN0aW9uIHNwYWNlVG9CYXRjaE5EXzxUIGV4dGVuZHMgVGVuc29yPihcbiAgICB4OiBUfFRlbnNvckxpa2UsIGJsb2NrU2hhcGU6IG51bWJlcltdLCBwYWRkaW5nczogbnVtYmVyW11bXSk6IFQge1xuICBjb25zdCAkeCA9IGNvbnZlcnRUb1RlbnNvcih4LCAneCcsICdzcGFjZVRvQmF0Y2hORCcpO1xuXG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgJHgucmFuayA+PSAxICsgYmxvY2tTaGFwZS5sZW5ndGgsXG4gICAgICAoKSA9PiBgaW5wdXQgcmFuayAkeyR4LnJhbmt9IHNob3VsZCBiZSA+IHRoYW4gW2Jsb2NrU2hhcGVdICR7XG4gICAgICAgICAgYmxvY2tTaGFwZS5sZW5ndGh9YCk7XG5cbiAgdXRpbC5hc3NlcnQoXG4gICAgICBwYWRkaW5ncy5sZW5ndGggPT09IGJsb2NrU2hhcGUubGVuZ3RoLFxuICAgICAgKCkgPT4gYHBhZGRpbmdzLnNoYXBlWzBdICR7XG4gICAgICAgICAgcGFkZGluZ3MubGVuZ3RofSBtdXN0IGJlIGVxdWFsIHRvIFtibG9ja1NoYXBlXSAke2Jsb2NrU2hhcGUubGVuZ3RofWApO1xuXG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgJHguc2hhcGUucmVkdWNlKFxuICAgICAgICAgIChhLCBiLCBpKSA9PiB7XG4gICAgICAgICAgICBpZiAoaSA+IDAgJiYgaSA8PSBibG9ja1NoYXBlLmxlbmd0aCkge1xuICAgICAgICAgICAgICByZXR1cm4gYSAmJlxuICAgICAgICAgICAgICAgICAgKChiICsgcGFkZGluZ3NbaSAtIDFdWzBdICsgcGFkZGluZ3NbaSAtIDFdWzFdKSAlXG4gICAgICAgICAgICAgICAgICAgICAgIGJsb2NrU2hhcGVbaSAtIDFdID09PVxuICAgICAgICAgICAgICAgICAgIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgICAgfSxcbiAgICAgICAgICB0cnVlKSxcbiAgICAgICgpID0+IGBpbnB1dCBzcGF0aWFsIGRpbWVuc2lvbnMgJHskeC5zaGFwZS5zbGljZSgxKX0gd2l0aCBwYWRkaW5ncyAke1xuICAgICAgICAgIHBhZGRpbmdzLnRvU3RyaW5nKCl9IG11c3QgYmUgZGl2aXNpYmxlIGJ5IGJsb2NrU2hhcGVzICR7XG4gICAgICAgICAgYmxvY2tTaGFwZS50b1N0cmluZygpfWApO1xuXG4gIGNvbnN0IGlucHV0czogU3BhY2VUb0JhdGNoTkRJbnB1dHMgPSB7eDogJHh9O1xuICBjb25zdCBhdHRyczogU3BhY2VUb0JhdGNoTkRBdHRycyA9IHtibG9ja1NoYXBlLCBwYWRkaW5nc307XG5cbiAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICBTcGFjZVRvQmF0Y2hORCwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLFxuICAgICAgYXR0cnMgYXMge30gYXMgTmFtZWRBdHRyTWFwKTtcbn1cblxuZXhwb3J0IGNvbnN0IHNwYWNlVG9CYXRjaE5EID0gb3Aoe3NwYWNlVG9CYXRjaE5EX30pO1xuIl19