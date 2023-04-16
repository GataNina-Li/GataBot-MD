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
import { inferShape } from '../tensor_util_env';
import { assertNonNull } from '../util';
import { makeTensor } from './tensor_ops_util';
/**
 * Creates rank-2 `tf.Tensor` with the provided values, shape and dtype.
 *
 * The same functionality can be achieved with `tf.tensor`, but in general
 * we recommend using `tf.tensor2d` as it makes the code more readable.
 *
 *  ```js
 * // Pass a nested array.
 * tf.tensor2d([[1, 2], [3, 4]]).print();
 * ```
 * ```js
 * // Pass a flat array and specify a shape.
 * tf.tensor2d([1, 2, 3, 4], [2, 2]).print();
 * ```
 *
 * @param values The values of the tensor. Can be nested array of numbers,
 *     or a flat array, or a `TypedArray`.
 * @param shape The shape of the tensor. If not provided, it is inferred from
 *     `values`.
 * @param dtype The data type.
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
export function tensor2d(values, shape, dtype) {
    assertNonNull(values);
    if (shape != null && shape.length !== 2) {
        throw new Error('tensor2d() requires shape to have two numbers');
    }
    const inferredShape = inferShape(values, dtype);
    if (inferredShape.length !== 2 && inferredShape.length !== 1) {
        throw new Error('tensor2d() requires values to be number[][] or flat/TypedArray');
    }
    if (inferredShape.length === 1 && shape == null) {
        throw new Error('tensor2d() requires shape to be provided when `values` ' +
            'are a flat/TypedArray');
    }
    return makeTensor(values, shape, inferredShape, dtype);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVuc29yMmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy90ZW5zb3IyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFHSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHOUMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUN0QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFN0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FzQkc7QUFDSCxNQUFNLFVBQVUsUUFBUSxDQUNwQixNQUFvQixFQUFFLEtBQXdCLEVBQzlDLEtBQWdCO0lBQ2xCLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QixJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDdkMsTUFBTSxJQUFJLEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0tBQ2xFO0lBQ0QsTUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoRCxJQUFJLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQzVELE1BQU0sSUFBSSxLQUFLLENBQ1gsZ0VBQWdFLENBQUMsQ0FBQztLQUN2RTtJQUNELElBQUksYUFBYSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTtRQUMvQyxNQUFNLElBQUksS0FBSyxDQUNYLHlEQUF5RDtZQUN6RCx1QkFBdUIsQ0FBQyxDQUFDO0tBQzlCO0lBQ0QsT0FBTyxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsS0FBSyxDQUFhLENBQUM7QUFDckUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtUZW5zb3IyRH0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7aW5mZXJTaGFwZX0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZTJEfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge0RhdGFUeXBlfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge2Fzc2VydE5vbk51bGx9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHttYWtlVGVuc29yfSBmcm9tICcuL3RlbnNvcl9vcHNfdXRpbCc7XG5cbi8qKlxuICogQ3JlYXRlcyByYW5rLTIgYHRmLlRlbnNvcmAgd2l0aCB0aGUgcHJvdmlkZWQgdmFsdWVzLCBzaGFwZSBhbmQgZHR5cGUuXG4gKlxuICogVGhlIHNhbWUgZnVuY3Rpb25hbGl0eSBjYW4gYmUgYWNoaWV2ZWQgd2l0aCBgdGYudGVuc29yYCwgYnV0IGluIGdlbmVyYWxcbiAqIHdlIHJlY29tbWVuZCB1c2luZyBgdGYudGVuc29yMmRgIGFzIGl0IG1ha2VzIHRoZSBjb2RlIG1vcmUgcmVhZGFibGUuXG4gKlxuICogIGBgYGpzXG4gKiAvLyBQYXNzIGEgbmVzdGVkIGFycmF5LlxuICogdGYudGVuc29yMmQoW1sxLCAyXSwgWzMsIDRdXSkucHJpbnQoKTtcbiAqIGBgYFxuICogYGBganNcbiAqIC8vIFBhc3MgYSBmbGF0IGFycmF5IGFuZCBzcGVjaWZ5IGEgc2hhcGUuXG4gKiB0Zi50ZW5zb3IyZChbMSwgMiwgMywgNF0sIFsyLCAyXSkucHJpbnQoKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB2YWx1ZXMgVGhlIHZhbHVlcyBvZiB0aGUgdGVuc29yLiBDYW4gYmUgbmVzdGVkIGFycmF5IG9mIG51bWJlcnMsXG4gKiAgICAgb3IgYSBmbGF0IGFycmF5LCBvciBhIGBUeXBlZEFycmF5YC5cbiAqIEBwYXJhbSBzaGFwZSBUaGUgc2hhcGUgb2YgdGhlIHRlbnNvci4gSWYgbm90IHByb3ZpZGVkLCBpdCBpcyBpbmZlcnJlZCBmcm9tXG4gKiAgICAgYHZhbHVlc2AuXG4gKiBAcGFyYW0gZHR5cGUgVGhlIGRhdGEgdHlwZS5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnVGVuc29ycycsIHN1YmhlYWRpbmc6ICdDcmVhdGlvbid9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0ZW5zb3IyZChcbiAgICB2YWx1ZXM6IFRlbnNvckxpa2UyRCwgc2hhcGU/OiBbbnVtYmVyLCBudW1iZXJdLFxuICAgIGR0eXBlPzogRGF0YVR5cGUpOiBUZW5zb3IyRCB7XG4gIGFzc2VydE5vbk51bGwodmFsdWVzKTtcbiAgaWYgKHNoYXBlICE9IG51bGwgJiYgc2hhcGUubGVuZ3RoICE9PSAyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd0ZW5zb3IyZCgpIHJlcXVpcmVzIHNoYXBlIHRvIGhhdmUgdHdvIG51bWJlcnMnKTtcbiAgfVxuICBjb25zdCBpbmZlcnJlZFNoYXBlID0gaW5mZXJTaGFwZSh2YWx1ZXMsIGR0eXBlKTtcbiAgaWYgKGluZmVycmVkU2hhcGUubGVuZ3RoICE9PSAyICYmIGluZmVycmVkU2hhcGUubGVuZ3RoICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAndGVuc29yMmQoKSByZXF1aXJlcyB2YWx1ZXMgdG8gYmUgbnVtYmVyW11bXSBvciBmbGF0L1R5cGVkQXJyYXknKTtcbiAgfVxuICBpZiAoaW5mZXJyZWRTaGFwZS5sZW5ndGggPT09IDEgJiYgc2hhcGUgPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ3RlbnNvcjJkKCkgcmVxdWlyZXMgc2hhcGUgdG8gYmUgcHJvdmlkZWQgd2hlbiBgdmFsdWVzYCAnICtcbiAgICAgICAgJ2FyZSBhIGZsYXQvVHlwZWRBcnJheScpO1xuICB9XG4gIHJldHVybiBtYWtlVGVuc29yKHZhbHVlcywgc2hhcGUsIGluZmVycmVkU2hhcGUsIGR0eXBlKSBhcyBUZW5zb3IyRDtcbn1cbiJdfQ==