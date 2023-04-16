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
import { LRN } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { op } from './operation';
import { reshape } from './reshape';
/**
 * Normalizes the activation of a local neighborhood across or within
 * channels.
 *
 * @param x The input tensor. The 4-D input tensor is treated as a 3-D array
 *     of 1D vectors (along the last dimension), and each vector is
 *     normalized independently.
 * @param depthRadius The number of adjacent channels in the 1D normalization
 *     window.
 * @param bias A constant bias term for the basis.
 * @param alpha A scale factor, usually positive.
 * @param beta An exponent.
 *
 * @doc {heading: 'Operations', subheading: 'Normalization'}
 */
function localResponseNormalization_(x, depthRadius = 5, bias = 1, alpha = 1, beta = 0.5) {
    const $x = convertToTensor(x, 'x', 'localResponseNormalization');
    util.assert($x.rank === 4 || $x.rank === 3, () => `Error in localResponseNormalization: x must be rank 3 or 4 but got
               rank ${$x.rank}.`);
    util.assert(util.isInt(depthRadius), () => `Error in localResponseNormalization: depthRadius must be an ` +
        `integer but got depthRadius ${depthRadius}.`);
    let x4D = $x;
    let reshapedTo4D = false;
    if ($x.rank === 3) {
        reshapedTo4D = true;
        x4D = reshape($x, [1, $x.shape[0], $x.shape[1], $x.shape[2]]);
    }
    const inputs = { x: x4D };
    const attrs = { depthRadius, bias, alpha, beta };
    // tslint:disable-next-line: no-unnecessary-type-assertion
    const res = ENGINE.runKernel(LRN, inputs, attrs);
    if (reshapedTo4D) {
        return reshape(res, [res.shape[1], res.shape[2], res.shape[3]]);
    }
    else {
        return res;
    }
}
export const localResponseNormalization = op({ localResponseNormalization_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxfcmVzcG9uc2Vfbm9ybWFsaXphdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2xvY2FsX3Jlc3BvbnNlX25vcm1hbGl6YXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsR0FBRyxFQUFzQixNQUFNLGlCQUFpQixDQUFDO0FBSXpELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUVuRCxPQUFPLEtBQUssSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUVoQyxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFbEM7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxTQUFTLDJCQUEyQixDQUNoQyxDQUFlLEVBQUUsV0FBVyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLEdBQUc7SUFDbkUsTUFBTSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztJQUNqRSxJQUFJLENBQUMsTUFBTSxDQUNQLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUM5QixHQUFHLEVBQUUsQ0FBQztzQkFDVSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNoQyxJQUFJLENBQUMsTUFBTSxDQUNQLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQ3ZCLEdBQUcsRUFBRSxDQUFDLDhEQUE4RDtRQUNoRSwrQkFBK0IsV0FBVyxHQUFHLENBQUMsQ0FBQztJQUV2RCxJQUFJLEdBQUcsR0FBRyxFQUFjLENBQUM7SUFDekIsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO0lBQ3pCLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7UUFDakIsWUFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDL0Q7SUFFRCxNQUFNLE1BQU0sR0FBYyxFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUMsQ0FBQztJQUVuQyxNQUFNLEtBQUssR0FBYSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDO0lBRXpELDBEQUEwRDtJQUMxRCxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUNaLEdBQUcsRUFBRSxNQUE4QixFQUNuQyxLQUEyQixDQUFNLENBQUM7SUFFbEQsSUFBSSxZQUFZLEVBQUU7UUFDaEIsT0FBTyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBTSxDQUFDO0tBQ3RFO1NBQU07UUFDTCxPQUFPLEdBQUcsQ0FBQztLQUNaO0FBQ0gsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLDBCQUEwQixHQUFHLEVBQUUsQ0FBQyxFQUFDLDJCQUEyQixFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge0xSTiwgTFJOQXR0cnMsIExSTklucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7TmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtUZW5zb3IzRCwgVGVuc29yNER9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcbmltcG9ydCB7cmVzaGFwZX0gZnJvbSAnLi9yZXNoYXBlJztcblxuLyoqXG4gKiBOb3JtYWxpemVzIHRoZSBhY3RpdmF0aW9uIG9mIGEgbG9jYWwgbmVpZ2hib3Job29kIGFjcm9zcyBvciB3aXRoaW5cbiAqIGNoYW5uZWxzLlxuICpcbiAqIEBwYXJhbSB4IFRoZSBpbnB1dCB0ZW5zb3IuIFRoZSA0LUQgaW5wdXQgdGVuc29yIGlzIHRyZWF0ZWQgYXMgYSAzLUQgYXJyYXlcbiAqICAgICBvZiAxRCB2ZWN0b3JzIChhbG9uZyB0aGUgbGFzdCBkaW1lbnNpb24pLCBhbmQgZWFjaCB2ZWN0b3IgaXNcbiAqICAgICBub3JtYWxpemVkIGluZGVwZW5kZW50bHkuXG4gKiBAcGFyYW0gZGVwdGhSYWRpdXMgVGhlIG51bWJlciBvZiBhZGphY2VudCBjaGFubmVscyBpbiB0aGUgMUQgbm9ybWFsaXphdGlvblxuICogICAgIHdpbmRvdy5cbiAqIEBwYXJhbSBiaWFzIEEgY29uc3RhbnQgYmlhcyB0ZXJtIGZvciB0aGUgYmFzaXMuXG4gKiBAcGFyYW0gYWxwaGEgQSBzY2FsZSBmYWN0b3IsIHVzdWFsbHkgcG9zaXRpdmUuXG4gKiBAcGFyYW0gYmV0YSBBbiBleHBvbmVudC5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdOb3JtYWxpemF0aW9uJ31cbiAqL1xuZnVuY3Rpb24gbG9jYWxSZXNwb25zZU5vcm1hbGl6YXRpb25fPFQgZXh0ZW5kcyBUZW5zb3IzRHxUZW5zb3I0RD4oXG4gICAgeDogVHxUZW5zb3JMaWtlLCBkZXB0aFJhZGl1cyA9IDUsIGJpYXMgPSAxLCBhbHBoYSA9IDEsIGJldGEgPSAwLjUpOiBUIHtcbiAgY29uc3QgJHggPSBjb252ZXJ0VG9UZW5zb3IoeCwgJ3gnLCAnbG9jYWxSZXNwb25zZU5vcm1hbGl6YXRpb24nKTtcbiAgdXRpbC5hc3NlcnQoXG4gICAgICAkeC5yYW5rID09PSA0IHx8ICR4LnJhbmsgPT09IDMsXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gbG9jYWxSZXNwb25zZU5vcm1hbGl6YXRpb246IHggbXVzdCBiZSByYW5rIDMgb3IgNCBidXQgZ290XG4gICAgICAgICAgICAgICByYW5rICR7JHgucmFua30uYCk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgdXRpbC5pc0ludChkZXB0aFJhZGl1cyksXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gbG9jYWxSZXNwb25zZU5vcm1hbGl6YXRpb246IGRlcHRoUmFkaXVzIG11c3QgYmUgYW4gYCArXG4gICAgICAgICAgYGludGVnZXIgYnV0IGdvdCBkZXB0aFJhZGl1cyAke2RlcHRoUmFkaXVzfS5gKTtcblxuICBsZXQgeDREID0gJHggYXMgVGVuc29yNEQ7XG4gIGxldCByZXNoYXBlZFRvNEQgPSBmYWxzZTtcbiAgaWYgKCR4LnJhbmsgPT09IDMpIHtcbiAgICByZXNoYXBlZFRvNEQgPSB0cnVlO1xuICAgIHg0RCA9IHJlc2hhcGUoJHgsIFsxLCAkeC5zaGFwZVswXSwgJHguc2hhcGVbMV0sICR4LnNoYXBlWzJdXSk7XG4gIH1cblxuICBjb25zdCBpbnB1dHM6IExSTklucHV0cyA9IHt4OiB4NER9O1xuXG4gIGNvbnN0IGF0dHJzOiBMUk5BdHRycyA9IHtkZXB0aFJhZGl1cywgYmlhcywgYWxwaGEsIGJldGF9O1xuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tdW5uZWNlc3NhcnktdHlwZS1hc3NlcnRpb25cbiAgY29uc3QgcmVzID0gRU5HSU5FLnJ1bktlcm5lbChcbiAgICAgICAgICAgICAgICAgIExSTiwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLFxuICAgICAgICAgICAgICAgICAgYXR0cnMgYXMge30gYXMgTmFtZWRBdHRyTWFwKSBhcyBUO1xuXG4gIGlmIChyZXNoYXBlZFRvNEQpIHtcbiAgICByZXR1cm4gcmVzaGFwZShyZXMsIFtyZXMuc2hhcGVbMV0sIHJlcy5zaGFwZVsyXSwgcmVzLnNoYXBlWzNdXSkgYXMgVDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcmVzO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBsb2NhbFJlc3BvbnNlTm9ybWFsaXphdGlvbiA9IG9wKHtsb2NhbFJlc3BvbnNlTm9ybWFsaXphdGlvbl99KTtcbiJdfQ==