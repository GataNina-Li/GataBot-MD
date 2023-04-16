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
import { DenseBincount } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { op } from './operation';
/**
 * Outputs a vector with length `size` and the same dtype as `weights`.
 *
 * If `weights` are empty, then index `i` stores the number of times the value
 * `i` is counted in `x`. If `weights` are non-empty, then index `i` stores the
 * sum of the value in `weights` at each index where the corresponding value in
 * `x` is `i`.
 *
 * Values in `x` outside of the range [0, size) are ignored.
 *
 * @param x The input int tensor, rank 1 or rank 2.
 * @param weights The weights tensor, must have the same shape as x, or a
 *     length-0 Tensor, in which case it acts as all weights equal to 1.
 * @param size Non-negative integer.
 * @param binaryOutput Optional. Whether the kernel should count the appearance
 *     or number of occurrences. Defaults to False.
 *
 * @doc {heading: 'Operations', subheading: 'Reduction'}
 */
function denseBincount_(x, weights, size, binaryOutput = false) {
    const $x = convertToTensor(x, 'x', 'denseBincount');
    const $weights = convertToTensor(weights, 'weights', 'denseBincount');
    util.assert($x.dtype === 'int32', () => `Error in denseBincount: input ` +
        `dtype must be int32, but got ${$x.dtype}`);
    util.assert($x.rank <= 2, () => `Error in denseBincount: input must be at most rank 2, but got ` +
        `rank ${$x.rank}.`);
    util.assert(size >= 0, () => `size must be non-negative, but got ${size}.`);
    util.assert($weights.size === $x.size || $weights.size === 0, () => `Error in denseBincount: weights must have the same shape as x or ` +
        `0-length, but got x shape: ${$x.shape}, weights shape: ` +
        `${$weights.shape}.`);
    const inputs = { x: $x, weights: $weights };
    const attrs = { size, binaryOutput };
    return ENGINE.runKernel(DenseBincount, inputs, attrs);
}
export const denseBincount = op({ denseBincount_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVuc2VfYmluY291bnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9kZW5zZV9iaW5jb3VudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxhQUFhLEVBQTBDLE1BQU0saUJBQWlCLENBQUM7QUFJdkYsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE9BQU8sS0FBSyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBRWhDLE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFL0I7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCRztBQUNILFNBQVMsY0FBYyxDQUNuQixDQUFlLEVBQUUsT0FBcUIsRUFBRSxJQUFZLEVBQ3BELFlBQVksR0FBRyxLQUFLO0lBQ3RCLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ3BELE1BQU0sUUFBUSxHQUFHLGVBQWUsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBRXRFLElBQUksQ0FBQyxNQUFNLENBQ1AsRUFBRSxDQUFDLEtBQUssS0FBSyxPQUFPLEVBQ3BCLEdBQUcsRUFBRSxDQUFDLGdDQUFnQztRQUNsQyxnQ0FBZ0MsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDcEQsSUFBSSxDQUFDLE1BQU0sQ0FDUCxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsRUFDWixHQUFHLEVBQUUsQ0FBQyxnRUFBZ0U7UUFDbEUsUUFBUSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsc0NBQXNDLElBQUksR0FBRyxDQUFDLENBQUM7SUFDNUUsSUFBSSxDQUFDLE1BQU0sQ0FDUCxRQUFRLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQ2hELEdBQUcsRUFBRSxDQUNELG1FQUFtRTtRQUNuRSw4QkFBOEIsRUFBRSxDQUFDLEtBQUssbUJBQW1CO1FBQ3pELEdBQUcsUUFBUSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7SUFFOUIsTUFBTSxNQUFNLEdBQXdCLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFDLENBQUM7SUFDL0QsTUFBTSxLQUFLLEdBQXVCLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBQyxDQUFDO0lBRXZELE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FDbkIsYUFBYSxFQUFFLE1BQThCLEVBQzdDLEtBQTJCLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQyxFQUFDLGNBQWMsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtEZW5zZUJpbmNvdW50LCBEZW5zZUJpbmNvdW50QXR0cnMsIERlbnNlQmluY291bnRJbnB1dHN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge05hbWVkQXR0ck1hcH0gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7VGVuc29yMUQsIFRlbnNvcjJEfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5cbi8qKlxuICogT3V0cHV0cyBhIHZlY3RvciB3aXRoIGxlbmd0aCBgc2l6ZWAgYW5kIHRoZSBzYW1lIGR0eXBlIGFzIGB3ZWlnaHRzYC5cbiAqXG4gKiBJZiBgd2VpZ2h0c2AgYXJlIGVtcHR5LCB0aGVuIGluZGV4IGBpYCBzdG9yZXMgdGhlIG51bWJlciBvZiB0aW1lcyB0aGUgdmFsdWVcbiAqIGBpYCBpcyBjb3VudGVkIGluIGB4YC4gSWYgYHdlaWdodHNgIGFyZSBub24tZW1wdHksIHRoZW4gaW5kZXggYGlgIHN0b3JlcyB0aGVcbiAqIHN1bSBvZiB0aGUgdmFsdWUgaW4gYHdlaWdodHNgIGF0IGVhY2ggaW5kZXggd2hlcmUgdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWUgaW5cbiAqIGB4YCBpcyBgaWAuXG4gKlxuICogVmFsdWVzIGluIGB4YCBvdXRzaWRlIG9mIHRoZSByYW5nZSBbMCwgc2l6ZSkgYXJlIGlnbm9yZWQuXG4gKlxuICogQHBhcmFtIHggVGhlIGlucHV0IGludCB0ZW5zb3IsIHJhbmsgMSBvciByYW5rIDIuXG4gKiBAcGFyYW0gd2VpZ2h0cyBUaGUgd2VpZ2h0cyB0ZW5zb3IsIG11c3QgaGF2ZSB0aGUgc2FtZSBzaGFwZSBhcyB4LCBvciBhXG4gKiAgICAgbGVuZ3RoLTAgVGVuc29yLCBpbiB3aGljaCBjYXNlIGl0IGFjdHMgYXMgYWxsIHdlaWdodHMgZXF1YWwgdG8gMS5cbiAqIEBwYXJhbSBzaXplIE5vbi1uZWdhdGl2ZSBpbnRlZ2VyLlxuICogQHBhcmFtIGJpbmFyeU91dHB1dCBPcHRpb25hbC4gV2hldGhlciB0aGUga2VybmVsIHNob3VsZCBjb3VudCB0aGUgYXBwZWFyYW5jZVxuICogICAgIG9yIG51bWJlciBvZiBvY2N1cnJlbmNlcy4gRGVmYXVsdHMgdG8gRmFsc2UuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ09wZXJhdGlvbnMnLCBzdWJoZWFkaW5nOiAnUmVkdWN0aW9uJ31cbiAqL1xuZnVuY3Rpb24gZGVuc2VCaW5jb3VudF88VCBleHRlbmRzIFRlbnNvcjFEfFRlbnNvcjJEPihcbiAgICB4OiBUfFRlbnNvckxpa2UsIHdlaWdodHM6IFR8VGVuc29yTGlrZSwgc2l6ZTogbnVtYmVyLFxuICAgIGJpbmFyeU91dHB1dCA9IGZhbHNlKTogVCB7XG4gIGNvbnN0ICR4ID0gY29udmVydFRvVGVuc29yKHgsICd4JywgJ2RlbnNlQmluY291bnQnKTtcbiAgY29uc3QgJHdlaWdodHMgPSBjb252ZXJ0VG9UZW5zb3Iod2VpZ2h0cywgJ3dlaWdodHMnLCAnZGVuc2VCaW5jb3VudCcpO1xuXG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgJHguZHR5cGUgPT09ICdpbnQzMicsXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gZGVuc2VCaW5jb3VudDogaW5wdXQgYCArXG4gICAgICAgICAgYGR0eXBlIG11c3QgYmUgaW50MzIsIGJ1dCBnb3QgJHskeC5kdHlwZX1gKTtcbiAgdXRpbC5hc3NlcnQoXG4gICAgICAkeC5yYW5rIDw9IDIsXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gZGVuc2VCaW5jb3VudDogaW5wdXQgbXVzdCBiZSBhdCBtb3N0IHJhbmsgMiwgYnV0IGdvdCBgICtcbiAgICAgICAgICBgcmFuayAkeyR4LnJhbmt9LmApO1xuICB1dGlsLmFzc2VydChzaXplID49IDAsICgpID0+IGBzaXplIG11c3QgYmUgbm9uLW5lZ2F0aXZlLCBidXQgZ290ICR7c2l6ZX0uYCk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgJHdlaWdodHMuc2l6ZSA9PT0gJHguc2l6ZSB8fCAkd2VpZ2h0cy5zaXplID09PSAwLFxuICAgICAgKCkgPT5cbiAgICAgICAgICBgRXJyb3IgaW4gZGVuc2VCaW5jb3VudDogd2VpZ2h0cyBtdXN0IGhhdmUgdGhlIHNhbWUgc2hhcGUgYXMgeCBvciBgICtcbiAgICAgICAgICBgMC1sZW5ndGgsIGJ1dCBnb3QgeCBzaGFwZTogJHskeC5zaGFwZX0sIHdlaWdodHMgc2hhcGU6IGAgK1xuICAgICAgICAgIGAkeyR3ZWlnaHRzLnNoYXBlfS5gKTtcblxuICBjb25zdCBpbnB1dHM6IERlbnNlQmluY291bnRJbnB1dHMgPSB7eDogJHgsIHdlaWdodHM6ICR3ZWlnaHRzfTtcbiAgY29uc3QgYXR0cnM6IERlbnNlQmluY291bnRBdHRycyA9IHtzaXplLCBiaW5hcnlPdXRwdXR9O1xuXG4gIHJldHVybiBFTkdJTkUucnVuS2VybmVsKFxuICAgICAgRGVuc2VCaW5jb3VudCwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLFxuICAgICAgYXR0cnMgYXMge30gYXMgTmFtZWRBdHRyTWFwKTtcbn1cblxuZXhwb3J0IGNvbnN0IGRlbnNlQmluY291bnQgPSBvcCh7ZGVuc2VCaW5jb3VudF99KTtcbiJdfQ==