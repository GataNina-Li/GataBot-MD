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
import { assertTypesMatch } from '../tensor_util';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { add } from './add';
import { div } from './div';
import { mul } from './mul';
import { op } from './operation';
import { pow } from './pow';
import { scalar } from './scalar';
import { sub } from './sub';
/**
 * Compute the moving average of a variable.
 *
 * Without zeroDebias, the moving average operation is defined by:
 *   `v += delta`
 * where
 *   `delta = (1 - decay) * (x - v)`
 *
 * With zeroDebias (default), the `delta` term is scaled to debias the
 * effect of the (assumed) zero-initialization of `v`.
 *   `delta /= (1 - decay ^ step)`
 *
 * For more details on the zero-debiasing algorithm, see:
 *   https://arxiv.org/abs/1412.6980
 *
 * Note that this function is completely stateless and does not keep track of
 * step count. The step count needs to be maintained by the caller and passed
 * in as `step`.
 *
 * @param v The current moving average value.
 * @param x New input value, must have the same shape and dtype as `v`.
 * @param decay The decay factor. Typical values are 0.95 and 0.99.
 * @param step Step count.
 * @param zeroDebias: Whether zeroDebias is to be performed (default: `true`).
 * @returns The new moving average value.
 *
 * @doc {heading: 'Operations', subheading: 'Moving Average'}
 */
function movingAverage_(v, x, decay, step, zeroDebias = true) {
    const $v = convertToTensor(v, 'v', 'movingAverage');
    const $x = convertToTensor(x, 'x', 'movingAverage');
    const $decay = convertToTensor(decay, 'decay', 'movingAverage');
    assertTypesMatch($v, $x);
    util.assert(util.arraysEqual($v.shape, $x.shape), () => 'Shape mismatch in v and x');
    const one = scalar(1);
    const oneMinusDecay = sub(one, $decay);
    let update = mul(sub($x, $v), oneMinusDecay);
    if (zeroDebias) {
        util.assert(step != null, () => 'When using zeroDebias: true, step is required.');
        const $step = convertToTensor(step, 'step', 'movingAverage');
        update = div(update, sub(one, pow($decay, $step)));
    }
    return add($v, update);
}
export const movingAverage = op({ movingAverage_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW92aW5nX2F2ZXJhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9tb3ZpbmdfYXZlcmFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFHSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFbkQsT0FBTyxLQUFLLElBQUksTUFBTSxTQUFTLENBQUM7QUFFaEMsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMvQixPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDaEMsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUUxQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkJHO0FBQ0gsU0FBUyxjQUFjLENBQ25CLENBQWUsRUFBRSxDQUFlLEVBQUUsS0FBb0IsRUFDdEQsSUFBb0IsRUFBRSxVQUFVLEdBQUcsSUFBSTtJQUN6QyxNQUFNLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNwRCxNQUFNLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNwRCxNQUFNLE1BQU0sR0FBRyxlQUFlLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQztJQUVoRSxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDekIsSUFBSSxDQUFDLE1BQU0sQ0FDUCxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFFN0UsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFFdkMsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDN0MsSUFBSSxVQUFVLEVBQUU7UUFDZCxJQUFJLENBQUMsTUFBTSxDQUNQLElBQUksSUFBSSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsZ0RBQWdELENBQUMsQ0FBQztRQUMxRSxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQztRQUM3RCxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3BEO0lBQ0QsT0FBTyxHQUFHLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3pCLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDLEVBQUMsY0FBYyxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtTY2FsYXIsIFRlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7YXNzZXJ0VHlwZXNNYXRjaH0gZnJvbSAnLi4vdGVuc29yX3V0aWwnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7YWRkfSBmcm9tICcuL2FkZCc7XG5pbXBvcnQge2Rpdn0gZnJvbSAnLi9kaXYnO1xuaW1wb3J0IHttdWx9IGZyb20gJy4vbXVsJztcbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcbmltcG9ydCB7cG93fSBmcm9tICcuL3Bvdyc7XG5pbXBvcnQge3NjYWxhcn0gZnJvbSAnLi9zY2FsYXInO1xuaW1wb3J0IHtzdWJ9IGZyb20gJy4vc3ViJztcblxuLyoqXG4gKiBDb21wdXRlIHRoZSBtb3ZpbmcgYXZlcmFnZSBvZiBhIHZhcmlhYmxlLlxuICpcbiAqIFdpdGhvdXQgemVyb0RlYmlhcywgdGhlIG1vdmluZyBhdmVyYWdlIG9wZXJhdGlvbiBpcyBkZWZpbmVkIGJ5OlxuICogICBgdiArPSBkZWx0YWBcbiAqIHdoZXJlXG4gKiAgIGBkZWx0YSA9ICgxIC0gZGVjYXkpICogKHggLSB2KWBcbiAqXG4gKiBXaXRoIHplcm9EZWJpYXMgKGRlZmF1bHQpLCB0aGUgYGRlbHRhYCB0ZXJtIGlzIHNjYWxlZCB0byBkZWJpYXMgdGhlXG4gKiBlZmZlY3Qgb2YgdGhlIChhc3N1bWVkKSB6ZXJvLWluaXRpYWxpemF0aW9uIG9mIGB2YC5cbiAqICAgYGRlbHRhIC89ICgxIC0gZGVjYXkgXiBzdGVwKWBcbiAqXG4gKiBGb3IgbW9yZSBkZXRhaWxzIG9uIHRoZSB6ZXJvLWRlYmlhc2luZyBhbGdvcml0aG0sIHNlZTpcbiAqICAgaHR0cHM6Ly9hcnhpdi5vcmcvYWJzLzE0MTIuNjk4MFxuICpcbiAqIE5vdGUgdGhhdCB0aGlzIGZ1bmN0aW9uIGlzIGNvbXBsZXRlbHkgc3RhdGVsZXNzIGFuZCBkb2VzIG5vdCBrZWVwIHRyYWNrIG9mXG4gKiBzdGVwIGNvdW50LiBUaGUgc3RlcCBjb3VudCBuZWVkcyB0byBiZSBtYWludGFpbmVkIGJ5IHRoZSBjYWxsZXIgYW5kIHBhc3NlZFxuICogaW4gYXMgYHN0ZXBgLlxuICpcbiAqIEBwYXJhbSB2IFRoZSBjdXJyZW50IG1vdmluZyBhdmVyYWdlIHZhbHVlLlxuICogQHBhcmFtIHggTmV3IGlucHV0IHZhbHVlLCBtdXN0IGhhdmUgdGhlIHNhbWUgc2hhcGUgYW5kIGR0eXBlIGFzIGB2YC5cbiAqIEBwYXJhbSBkZWNheSBUaGUgZGVjYXkgZmFjdG9yLiBUeXBpY2FsIHZhbHVlcyBhcmUgMC45NSBhbmQgMC45OS5cbiAqIEBwYXJhbSBzdGVwIFN0ZXAgY291bnQuXG4gKiBAcGFyYW0gemVyb0RlYmlhczogV2hldGhlciB6ZXJvRGViaWFzIGlzIHRvIGJlIHBlcmZvcm1lZCAoZGVmYXVsdDogYHRydWVgKS5cbiAqIEByZXR1cm5zIFRoZSBuZXcgbW92aW5nIGF2ZXJhZ2UgdmFsdWUuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ09wZXJhdGlvbnMnLCBzdWJoZWFkaW5nOiAnTW92aW5nIEF2ZXJhZ2UnfVxuICovXG5mdW5jdGlvbiBtb3ZpbmdBdmVyYWdlXzxUIGV4dGVuZHMgVGVuc29yPihcbiAgICB2OiBUfFRlbnNvckxpa2UsIHg6IFR8VGVuc29yTGlrZSwgZGVjYXk6IG51bWJlcnxTY2FsYXIsXG4gICAgc3RlcD86IG51bWJlcnxTY2FsYXIsIHplcm9EZWJpYXMgPSB0cnVlKTogVCB7XG4gIGNvbnN0ICR2ID0gY29udmVydFRvVGVuc29yKHYsICd2JywgJ21vdmluZ0F2ZXJhZ2UnKTtcbiAgY29uc3QgJHggPSBjb252ZXJ0VG9UZW5zb3IoeCwgJ3gnLCAnbW92aW5nQXZlcmFnZScpO1xuICBjb25zdCAkZGVjYXkgPSBjb252ZXJ0VG9UZW5zb3IoZGVjYXksICdkZWNheScsICdtb3ZpbmdBdmVyYWdlJyk7XG5cbiAgYXNzZXJ0VHlwZXNNYXRjaCgkdiwgJHgpO1xuICB1dGlsLmFzc2VydChcbiAgICAgIHV0aWwuYXJyYXlzRXF1YWwoJHYuc2hhcGUsICR4LnNoYXBlKSwgKCkgPT4gJ1NoYXBlIG1pc21hdGNoIGluIHYgYW5kIHgnKTtcblxuICBjb25zdCBvbmUgPSBzY2FsYXIoMSk7XG4gIGNvbnN0IG9uZU1pbnVzRGVjYXkgPSBzdWIob25lLCAkZGVjYXkpO1xuXG4gIGxldCB1cGRhdGUgPSBtdWwoc3ViKCR4LCAkdiksIG9uZU1pbnVzRGVjYXkpO1xuICBpZiAoemVyb0RlYmlhcykge1xuICAgIHV0aWwuYXNzZXJ0KFxuICAgICAgICBzdGVwICE9IG51bGwsICgpID0+ICdXaGVuIHVzaW5nIHplcm9EZWJpYXM6IHRydWUsIHN0ZXAgaXMgcmVxdWlyZWQuJyk7XG4gICAgY29uc3QgJHN0ZXAgPSBjb252ZXJ0VG9UZW5zb3Ioc3RlcCwgJ3N0ZXAnLCAnbW92aW5nQXZlcmFnZScpO1xuICAgIHVwZGF0ZSA9IGRpdih1cGRhdGUsIHN1YihvbmUsIHBvdygkZGVjYXksICRzdGVwKSkpO1xuICB9XG4gIHJldHVybiBhZGQoJHYsIHVwZGF0ZSk7XG59XG5cbmV4cG9ydCBjb25zdCBtb3ZpbmdBdmVyYWdlID0gb3Aoe21vdmluZ0F2ZXJhZ2VffSk7XG4iXX0=