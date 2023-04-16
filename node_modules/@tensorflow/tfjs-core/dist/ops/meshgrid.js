/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
import { matMul } from './mat_mul';
import { ones } from './ones';
import { reshape } from './reshape';
import { Tensor } from '../tensor';
import { convertToTensor } from '../tensor_util_env';
import { sizeFromShape } from '../util_base';
/**
 * Broadcasts parameters for evaluation on an N-D grid.
 *
 * Given N one-dimensional coordinate arrays `*args`, returns a list `outputs`
 * of N-D coordinate arrays for evaluating expressions on an N-D grid.
 *
 * Notes:
 * `meshgrid` supports cartesian ('xy') and matrix ('ij') indexing conventions.
 * When the `indexing` argument is set to 'xy' (the default), the broadcasting
 * instructions for the first two dimensions are swapped.
 * Examples:
 * Calling `const [X, Y] = meshgrid(x, y)` with the tensors
 *
 * ```javascript
 * const x = [1, 2, 3];
 * const y = [4, 5, 6];
 * const [X, Y] = tf.meshgrid(x, y);
 * // X = [[1, 2, 3],
 * //      [1, 2, 3],
 * //      [1, 2, 3]]
 * // Y = [[4, 4, 4],
 * //      [5, 5, 5],
 * //      [6, 6, 6]]
 * ```
 *
 * @param x Tensor with rank geq 1.
 * @param y Tensor with rank geq 1.
 * @param indexing
 *
 * @doc {heading: 'Operations', subheading: 'Slicing and Joining'}
 */
export function meshgrid(x, y, { indexing = 'xy' } = {}) {
    if (indexing !== 'xy' && indexing !== 'ij') {
        throw new TypeError(`${indexing} is not a valid third argument to meshgrid`);
    }
    if (x === undefined) {
        return [];
    }
    let $x = convertToTensor(x, 'x', 'meshgrid', x instanceof Tensor ? x.dtype : 'float32');
    if (y === undefined) {
        return [$x];
    }
    let $y = convertToTensor(y, 'y', 'meshgrid', y instanceof Tensor ? y.dtype : 'float32');
    const w = sizeFromShape($x.shape);
    const h = sizeFromShape($y.shape);
    if (indexing === 'xy') {
        $x = reshape($x, [1, -1]);
        $y = reshape($y, [-1, 1]);
        return [
            matMul(ones([h, 1], $x.dtype), $x),
            matMul($y, ones([1, w], $y.dtype)),
        ];
    }
    $x = reshape($x, [-1, 1]);
    $y = reshape($y, [1, -1]);
    return [
        matMul($x, ones([1, h], $x.dtype)),
        matMul(ones([w, 1], $y.dtype), $y),
    ];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzaGdyaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9tZXNoZ3JpZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNsQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUVuRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRTNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4Qkc7QUFDSCxNQUFNLFVBQVUsUUFBUSxDQUNwQixDQUFnQixFQUFFLENBQWdCLEVBQUUsRUFBQyxRQUFRLEdBQUcsSUFBSSxFQUFDLEdBQUcsRUFBRTtJQUM1RCxJQUFJLFFBQVEsS0FBSyxJQUFJLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtRQUMxQyxNQUFNLElBQUksU0FBUyxDQUNmLEdBQUcsUUFBUSw0Q0FBNEMsQ0FBQyxDQUFDO0tBQzlEO0lBQ0QsSUFBSSxDQUFDLEtBQUssU0FBUyxFQUFFO1FBQ25CLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFDRCxJQUFJLEVBQUUsR0FBRyxlQUFlLENBQ3BCLENBQUMsRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLENBQUMsWUFBWSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRW5FLElBQUksQ0FBQyxLQUFLLFNBQVMsRUFBRTtRQUNuQixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDYjtJQUNELElBQUksRUFBRSxHQUFHLGVBQWUsQ0FDcEIsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsQ0FBQyxZQUFZLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFbkUsTUFBTSxDQUFDLEdBQUcsYUFBYSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsQyxNQUFNLENBQUMsR0FBRyxhQUFhLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRWxDLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtRQUNyQixFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFNLENBQUM7UUFDL0IsRUFBRSxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBTSxDQUFDO1FBQy9CLE9BQU87WUFDTCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDbEMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25DLENBQUM7S0FDSDtJQUVELEVBQUUsR0FBRyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQU0sQ0FBQztJQUMvQixFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFNLENBQUM7SUFDL0IsT0FBTztRQUNMLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUM7S0FDbkMsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMSBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7bWF0TXVsfSBmcm9tICcuL21hdF9tdWwnO1xuaW1wb3J0IHtvbmVzfSBmcm9tICcuL29uZXMnO1xuaW1wb3J0IHtyZXNoYXBlfSBmcm9tICcuL3Jlc2hhcGUnO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtzaXplRnJvbVNoYXBlfSBmcm9tICcuLi91dGlsX2Jhc2UnO1xuXG4vKipcbiAqIEJyb2FkY2FzdHMgcGFyYW1ldGVycyBmb3IgZXZhbHVhdGlvbiBvbiBhbiBOLUQgZ3JpZC5cbiAqXG4gKiBHaXZlbiBOIG9uZS1kaW1lbnNpb25hbCBjb29yZGluYXRlIGFycmF5cyBgKmFyZ3NgLCByZXR1cm5zIGEgbGlzdCBgb3V0cHV0c2BcbiAqIG9mIE4tRCBjb29yZGluYXRlIGFycmF5cyBmb3IgZXZhbHVhdGluZyBleHByZXNzaW9ucyBvbiBhbiBOLUQgZ3JpZC5cbiAqXG4gKiBOb3RlczpcbiAqIGBtZXNoZ3JpZGAgc3VwcG9ydHMgY2FydGVzaWFuICgneHknKSBhbmQgbWF0cml4ICgnaWonKSBpbmRleGluZyBjb252ZW50aW9ucy5cbiAqIFdoZW4gdGhlIGBpbmRleGluZ2AgYXJndW1lbnQgaXMgc2V0IHRvICd4eScgKHRoZSBkZWZhdWx0KSwgdGhlIGJyb2FkY2FzdGluZ1xuICogaW5zdHJ1Y3Rpb25zIGZvciB0aGUgZmlyc3QgdHdvIGRpbWVuc2lvbnMgYXJlIHN3YXBwZWQuXG4gKiBFeGFtcGxlczpcbiAqIENhbGxpbmcgYGNvbnN0IFtYLCBZXSA9IG1lc2hncmlkKHgsIHkpYCB3aXRoIHRoZSB0ZW5zb3JzXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgeCA9IFsxLCAyLCAzXTtcbiAqIGNvbnN0IHkgPSBbNCwgNSwgNl07XG4gKiBjb25zdCBbWCwgWV0gPSB0Zi5tZXNoZ3JpZCh4LCB5KTtcbiAqIC8vIFggPSBbWzEsIDIsIDNdLFxuICogLy8gICAgICBbMSwgMiwgM10sXG4gKiAvLyAgICAgIFsxLCAyLCAzXV1cbiAqIC8vIFkgPSBbWzQsIDQsIDRdLFxuICogLy8gICAgICBbNSwgNSwgNV0sXG4gKiAvLyAgICAgIFs2LCA2LCA2XV1cbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB4IFRlbnNvciB3aXRoIHJhbmsgZ2VxIDEuXG4gKiBAcGFyYW0geSBUZW5zb3Igd2l0aCByYW5rIGdlcSAxLlxuICogQHBhcmFtIGluZGV4aW5nXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ09wZXJhdGlvbnMnLCBzdWJoZWFkaW5nOiAnU2xpY2luZyBhbmQgSm9pbmluZyd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXNoZ3JpZDxUIGV4dGVuZHMgVGVuc29yPihcbiAgICB4PzogVHxUZW5zb3JMaWtlLCB5PzogVHxUZW5zb3JMaWtlLCB7aW5kZXhpbmcgPSAneHknfSA9IHt9KTogVFtdIHtcbiAgaWYgKGluZGV4aW5nICE9PSAneHknICYmIGluZGV4aW5nICE9PSAnaWonKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgYCR7aW5kZXhpbmd9IGlzIG5vdCBhIHZhbGlkIHRoaXJkIGFyZ3VtZW50IHRvIG1lc2hncmlkYCk7XG4gIH1cbiAgaWYgKHggPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBsZXQgJHggPSBjb252ZXJ0VG9UZW5zb3IoXG4gICAgICB4LCAneCcsICdtZXNoZ3JpZCcsIHggaW5zdGFuY2VvZiBUZW5zb3IgPyB4LmR0eXBlIDogJ2Zsb2F0MzInKTtcblxuICBpZiAoeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIFskeF07XG4gIH1cbiAgbGV0ICR5ID0gY29udmVydFRvVGVuc29yKFxuICAgICAgeSwgJ3knLCAnbWVzaGdyaWQnLCB5IGluc3RhbmNlb2YgVGVuc29yID8geS5kdHlwZSA6ICdmbG9hdDMyJyk7XG5cbiAgY29uc3QgdyA9IHNpemVGcm9tU2hhcGUoJHguc2hhcGUpO1xuICBjb25zdCBoID0gc2l6ZUZyb21TaGFwZSgkeS5zaGFwZSk7XG5cbiAgaWYgKGluZGV4aW5nID09PSAneHknKSB7XG4gICAgJHggPSByZXNoYXBlKCR4LCBbMSwgLTFdKSBhcyBUO1xuICAgICR5ID0gcmVzaGFwZSgkeSwgWy0xLCAxXSkgYXMgVDtcbiAgICByZXR1cm4gW1xuICAgICAgbWF0TXVsKG9uZXMoW2gsIDFdLCAkeC5kdHlwZSksICR4KSxcbiAgICAgIG1hdE11bCgkeSwgb25lcyhbMSwgd10sICR5LmR0eXBlKSksXG4gICAgXTtcbiAgfVxuXG4gICR4ID0gcmVzaGFwZSgkeCwgWy0xLCAxXSkgYXMgVDtcbiAgJHkgPSByZXNoYXBlKCR5LCBbMSwgLTFdKSBhcyBUO1xuICByZXR1cm4gW1xuICAgIG1hdE11bCgkeCwgb25lcyhbMSwgaF0sICR4LmR0eXBlKSksXG4gICAgbWF0TXVsKG9uZXMoW3csIDFdLCAkeS5kdHlwZSksICR5KSxcbiAgXTtcbn1cbiJdfQ==