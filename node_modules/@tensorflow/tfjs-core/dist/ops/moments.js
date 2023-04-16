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
import { convertToTensor } from '../tensor_util_env';
import { parseAxisParam } from '../util';
import { expandShapeToKeepDim } from './axis_util';
import { cast } from './cast';
import { mean } from './mean';
import { op } from './operation';
import { reshape } from './reshape';
import { square } from './square';
import { sub } from './sub';
/**
 * Calculates the mean and variance of `x`. The mean and variance are
 * calculated by aggregating the contents of `x` across `axes`. If `x` is
 * 1-D and `axes = [0]` this is just the mean and variance of a vector.
 *
 * @param x The input tensor.
 * @param axis The dimension(s) along with to compute mean and
 *     variance. By default it reduces all dimensions.
 * @param keepDims If true, the moments have the same dimensionality as the
 *     input.
 * @return An object with two keys: `mean` and `variance`.
 *
 * @doc {heading: 'Operations', subheading: 'Normalization'}
 */
function moments_(x, axis = null, keepDims = false) {
    x = convertToTensor(x, 'x', 'moments');
    const axes = parseAxisParam(axis, x.shape);
    const xMean = mean(x, axes, keepDims);
    let keepDimsShape = xMean.shape;
    if (!keepDims) {
        keepDimsShape = expandShapeToKeepDim(xMean.shape, axes);
    }
    const devSquared = square(sub(cast(x, 'float32'), reshape(xMean, keepDimsShape)));
    const variance = mean(devSquared, axes, keepDims);
    return { mean: xMean, variance };
}
export const moments = op({ moments_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9tZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL21vbWVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBR0gsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFFdkMsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ2pELE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNoQyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sT0FBTyxDQUFDO0FBRTFCOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxTQUFTLFFBQVEsQ0FDYixDQUFvQixFQUFFLE9BQXdCLElBQUksRUFDbEQsUUFBUSxHQUFHLEtBQUs7SUFDbEIsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZDLE1BQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RDLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDaEMsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUNiLGFBQWEsR0FBRyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3pEO0lBQ0QsTUFBTSxVQUFVLEdBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25FLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2xELE9BQU8sRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBQyxDQUFDO0FBQ2pDLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLEVBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtwYXJzZUF4aXNQYXJhbX0gZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7ZXhwYW5kU2hhcGVUb0tlZXBEaW19IGZyb20gJy4vYXhpc191dGlsJztcbmltcG9ydCB7Y2FzdH0gZnJvbSAnLi9jYXN0JztcbmltcG9ydCB7bWVhbn0gZnJvbSAnLi9tZWFuJztcbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcbmltcG9ydCB7cmVzaGFwZX0gZnJvbSAnLi9yZXNoYXBlJztcbmltcG9ydCB7c3F1YXJlfSBmcm9tICcuL3NxdWFyZSc7XG5pbXBvcnQge3N1Yn0gZnJvbSAnLi9zdWInO1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIG1lYW4gYW5kIHZhcmlhbmNlIG9mIGB4YC4gVGhlIG1lYW4gYW5kIHZhcmlhbmNlIGFyZVxuICogY2FsY3VsYXRlZCBieSBhZ2dyZWdhdGluZyB0aGUgY29udGVudHMgb2YgYHhgIGFjcm9zcyBgYXhlc2AuIElmIGB4YCBpc1xuICogMS1EIGFuZCBgYXhlcyA9IFswXWAgdGhpcyBpcyBqdXN0IHRoZSBtZWFuIGFuZCB2YXJpYW5jZSBvZiBhIHZlY3Rvci5cbiAqXG4gKiBAcGFyYW0geCBUaGUgaW5wdXQgdGVuc29yLlxuICogQHBhcmFtIGF4aXMgVGhlIGRpbWVuc2lvbihzKSBhbG9uZyB3aXRoIHRvIGNvbXB1dGUgbWVhbiBhbmRcbiAqICAgICB2YXJpYW5jZS4gQnkgZGVmYXVsdCBpdCByZWR1Y2VzIGFsbCBkaW1lbnNpb25zLlxuICogQHBhcmFtIGtlZXBEaW1zIElmIHRydWUsIHRoZSBtb21lbnRzIGhhdmUgdGhlIHNhbWUgZGltZW5zaW9uYWxpdHkgYXMgdGhlXG4gKiAgICAgaW5wdXQuXG4gKiBAcmV0dXJuIEFuIG9iamVjdCB3aXRoIHR3byBrZXlzOiBgbWVhbmAgYW5kIGB2YXJpYW5jZWAuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ09wZXJhdGlvbnMnLCBzdWJoZWFkaW5nOiAnTm9ybWFsaXphdGlvbid9XG4gKi9cbmZ1bmN0aW9uIG1vbWVudHNfKFxuICAgIHg6IFRlbnNvcnxUZW5zb3JMaWtlLCBheGlzOiBudW1iZXJ8bnVtYmVyW10gPSBudWxsLFxuICAgIGtlZXBEaW1zID0gZmFsc2UpOiB7bWVhbjogVGVuc29yLCB2YXJpYW5jZTogVGVuc29yfSB7XG4gIHggPSBjb252ZXJ0VG9UZW5zb3IoeCwgJ3gnLCAnbW9tZW50cycpO1xuICBjb25zdCBheGVzID0gcGFyc2VBeGlzUGFyYW0oYXhpcywgeC5zaGFwZSk7XG4gIGNvbnN0IHhNZWFuID0gbWVhbih4LCBheGVzLCBrZWVwRGltcyk7XG4gIGxldCBrZWVwRGltc1NoYXBlID0geE1lYW4uc2hhcGU7XG4gIGlmICgha2VlcERpbXMpIHtcbiAgICBrZWVwRGltc1NoYXBlID0gZXhwYW5kU2hhcGVUb0tlZXBEaW0oeE1lYW4uc2hhcGUsIGF4ZXMpO1xuICB9XG4gIGNvbnN0IGRldlNxdWFyZWQgPVxuICAgICAgc3F1YXJlKHN1YihjYXN0KHgsICdmbG9hdDMyJyksIHJlc2hhcGUoeE1lYW4sIGtlZXBEaW1zU2hhcGUpKSk7XG4gIGNvbnN0IHZhcmlhbmNlID0gbWVhbihkZXZTcXVhcmVkLCBheGVzLCBrZWVwRGltcyk7XG4gIHJldHVybiB7bWVhbjogeE1lYW4sIHZhcmlhbmNlfTtcbn1cblxuZXhwb3J0IGNvbnN0IG1vbWVudHMgPSBvcCh7bW9tZW50c199KTtcbiJdfQ==