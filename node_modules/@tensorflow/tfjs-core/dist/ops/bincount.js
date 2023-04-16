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
import { Bincount } from '../kernel_names';
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
 * @param x The input int tensor, rank 1.
 * @param weights The weights tensor, must have the same shape as x, or a
 *     length-0 Tensor, in which case it acts as all weights equal to 1.
 * @param size Non-negative integer.
 *
 * @doc {heading: 'Operations', subheading: 'Reduction'}
 */
function bincount_(x, weights, size) {
    const $x = convertToTensor(x, 'x', 'bincount');
    const $weights = convertToTensor(weights, 'weights', 'bincount');
    util.assert($x.dtype === 'int32', () => `Error in bincount: input ` +
        `dtype must be int32, but got ${$x.dtype}`);
    util.assert(size >= 0, () => `size must be non-negative, but got ${size}.`);
    util.assert($weights.size === $x.size || $weights.size === 0, () => `Error in bincount: weights must have the same size as input or` +
        `0-length, but got input shape: ${$x.shape}, weights shape: ` +
        `${$weights.shape}.`);
    const inputs = { x: $x, weights: $weights };
    const attrs = { size };
    return ENGINE.runKernel(Bincount, inputs, attrs);
}
export const bincount = op({ bincount_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluY291bnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9iaW5jb3VudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxRQUFRLEVBQWdDLE1BQU0saUJBQWlCLENBQUM7QUFJeEUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE9BQU8sS0FBSyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBRWhDLE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFL0I7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxTQUFTLFNBQVMsQ0FDZCxDQUFlLEVBQUUsT0FBcUIsRUFBRSxJQUFZO0lBQ3RELE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQy9DLE1BQU0sUUFBUSxHQUFHLGVBQWUsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBRWpFLElBQUksQ0FBQyxNQUFNLENBQ1AsRUFBRSxDQUFDLEtBQUssS0FBSyxPQUFPLEVBQ3BCLEdBQUcsRUFBRSxDQUFDLDJCQUEyQjtRQUM3QixnQ0FBZ0MsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDcEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLHNDQUFzQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQzVFLElBQUksQ0FBQyxNQUFNLENBQ1AsUUFBUSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUNoRCxHQUFHLEVBQUUsQ0FBQyxnRUFBZ0U7UUFDbEUsa0NBQWtDLEVBQUUsQ0FBQyxLQUFLLG1CQUFtQjtRQUM3RCxHQUFHLFFBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBRTlCLE1BQU0sTUFBTSxHQUFtQixFQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBQyxDQUFDO0lBQzFELE1BQU0sS0FBSyxHQUFrQixFQUFDLElBQUksRUFBQyxDQUFDO0lBRXBDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FDbkIsUUFBUSxFQUFFLE1BQThCLEVBQUUsS0FBMkIsQ0FBQyxDQUFDO0FBQzdFLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLEVBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge0JpbmNvdW50LCBCaW5jb3VudEF0dHJzLCBCaW5jb3VudElucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7TmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtUZW5zb3IxRH0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7TmFtZWRUZW5zb3JNYXB9IGZyb20gJy4uL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi91dGlsJztcblxuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuXG4vKipcbiAqIE91dHB1dHMgYSB2ZWN0b3Igd2l0aCBsZW5ndGggYHNpemVgIGFuZCB0aGUgc2FtZSBkdHlwZSBhcyBgd2VpZ2h0c2AuXG4gKlxuICogSWYgYHdlaWdodHNgIGFyZSBlbXB0eSwgdGhlbiBpbmRleCBgaWAgc3RvcmVzIHRoZSBudW1iZXIgb2YgdGltZXMgdGhlIHZhbHVlXG4gKiBgaWAgaXMgY291bnRlZCBpbiBgeGAuIElmIGB3ZWlnaHRzYCBhcmUgbm9uLWVtcHR5LCB0aGVuIGluZGV4IGBpYCBzdG9yZXMgdGhlXG4gKiBzdW0gb2YgdGhlIHZhbHVlIGluIGB3ZWlnaHRzYCBhdCBlYWNoIGluZGV4IHdoZXJlIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlIGluXG4gKiBgeGAgaXMgYGlgLlxuICpcbiAqIFZhbHVlcyBpbiBgeGAgb3V0c2lkZSBvZiB0aGUgcmFuZ2UgWzAsIHNpemUpIGFyZSBpZ25vcmVkLlxuICpcbiAqIEBwYXJhbSB4IFRoZSBpbnB1dCBpbnQgdGVuc29yLCByYW5rIDEuXG4gKiBAcGFyYW0gd2VpZ2h0cyBUaGUgd2VpZ2h0cyB0ZW5zb3IsIG11c3QgaGF2ZSB0aGUgc2FtZSBzaGFwZSBhcyB4LCBvciBhXG4gKiAgICAgbGVuZ3RoLTAgVGVuc29yLCBpbiB3aGljaCBjYXNlIGl0IGFjdHMgYXMgYWxsIHdlaWdodHMgZXF1YWwgdG8gMS5cbiAqIEBwYXJhbSBzaXplIE5vbi1uZWdhdGl2ZSBpbnRlZ2VyLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdPcGVyYXRpb25zJywgc3ViaGVhZGluZzogJ1JlZHVjdGlvbid9XG4gKi9cbmZ1bmN0aW9uIGJpbmNvdW50XzxUIGV4dGVuZHMgVGVuc29yMUQ+KFxuICAgIHg6IFR8VGVuc29yTGlrZSwgd2VpZ2h0czogVHxUZW5zb3JMaWtlLCBzaXplOiBudW1iZXIpOiBUIHtcbiAgY29uc3QgJHggPSBjb252ZXJ0VG9UZW5zb3IoeCwgJ3gnLCAnYmluY291bnQnKTtcbiAgY29uc3QgJHdlaWdodHMgPSBjb252ZXJ0VG9UZW5zb3Iod2VpZ2h0cywgJ3dlaWdodHMnLCAnYmluY291bnQnKTtcblxuICB1dGlsLmFzc2VydChcbiAgICAgICR4LmR0eXBlID09PSAnaW50MzInLFxuICAgICAgKCkgPT4gYEVycm9yIGluIGJpbmNvdW50OiBpbnB1dCBgICtcbiAgICAgICAgICBgZHR5cGUgbXVzdCBiZSBpbnQzMiwgYnV0IGdvdCAkeyR4LmR0eXBlfWApO1xuICB1dGlsLmFzc2VydChzaXplID49IDAsICgpID0+IGBzaXplIG11c3QgYmUgbm9uLW5lZ2F0aXZlLCBidXQgZ290ICR7c2l6ZX0uYCk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgJHdlaWdodHMuc2l6ZSA9PT0gJHguc2l6ZSB8fCAkd2VpZ2h0cy5zaXplID09PSAwLFxuICAgICAgKCkgPT4gYEVycm9yIGluIGJpbmNvdW50OiB3ZWlnaHRzIG11c3QgaGF2ZSB0aGUgc2FtZSBzaXplIGFzIGlucHV0IG9yYCArXG4gICAgICAgICAgYDAtbGVuZ3RoLCBidXQgZ290IGlucHV0IHNoYXBlOiAkeyR4LnNoYXBlfSwgd2VpZ2h0cyBzaGFwZTogYCArXG4gICAgICAgICAgYCR7JHdlaWdodHMuc2hhcGV9LmApO1xuXG4gIGNvbnN0IGlucHV0czogQmluY291bnRJbnB1dHMgPSB7eDogJHgsIHdlaWdodHM6ICR3ZWlnaHRzfTtcbiAgY29uc3QgYXR0cnM6IEJpbmNvdW50QXR0cnMgPSB7c2l6ZX07XG5cbiAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICBCaW5jb3VudCwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLCBhdHRycyBhcyB7fSBhcyBOYW1lZEF0dHJNYXApO1xufVxuXG5leHBvcnQgY29uc3QgYmluY291bnQgPSBvcCh7YmluY291bnRffSk7XG4iXX0=