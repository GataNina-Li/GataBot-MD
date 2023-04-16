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
 * Creates rank-1 `tf.Tensor` with the provided values, shape and dtype.
 *
 * The same functionality can be achieved with `tf.tensor`, but in general
 * we recommend using `tf.tensor1d` as it makes the code more readable.
 *
 * ```js
 * tf.tensor1d([1, 2, 3]).print();
 * ```
 *
 * @param values The values of the tensor. Can be array of numbers,
 *     or a `TypedArray`.
 * @param dtype The data type.
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
export function tensor1d(values, dtype) {
    assertNonNull(values);
    const inferredShape = inferShape(values, dtype);
    if (inferredShape.length !== 1) {
        throw new Error('tensor1d() requires values to be a flat/TypedArray');
    }
    const shape = null;
    return makeTensor(values, shape, inferredShape, dtype);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVuc29yMWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy90ZW5zb3IxZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFHSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHOUMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUN0QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFN0M7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsTUFBTSxVQUFVLFFBQVEsQ0FBQyxNQUFvQixFQUFFLEtBQWdCO0lBQzdELGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QixNQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2hELElBQUksYUFBYSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO0tBQ3ZFO0lBQ0QsTUFBTSxLQUFLLEdBQWEsSUFBSSxDQUFDO0lBQzdCLE9BQU8sVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBYSxDQUFDO0FBQ3JFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7VGVuc29yMUR9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge2luZmVyU2hhcGV9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2UxRH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtEYXRhVHlwZX0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHthc3NlcnROb25OdWxsfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7bWFrZVRlbnNvcn0gZnJvbSAnLi90ZW5zb3Jfb3BzX3V0aWwnO1xuXG4vKipcbiAqIENyZWF0ZXMgcmFuay0xIGB0Zi5UZW5zb3JgIHdpdGggdGhlIHByb3ZpZGVkIHZhbHVlcywgc2hhcGUgYW5kIGR0eXBlLlxuICpcbiAqIFRoZSBzYW1lIGZ1bmN0aW9uYWxpdHkgY2FuIGJlIGFjaGlldmVkIHdpdGggYHRmLnRlbnNvcmAsIGJ1dCBpbiBnZW5lcmFsXG4gKiB3ZSByZWNvbW1lbmQgdXNpbmcgYHRmLnRlbnNvcjFkYCBhcyBpdCBtYWtlcyB0aGUgY29kZSBtb3JlIHJlYWRhYmxlLlxuICpcbiAqIGBgYGpzXG4gKiB0Zi50ZW5zb3IxZChbMSwgMiwgM10pLnByaW50KCk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gdmFsdWVzIFRoZSB2YWx1ZXMgb2YgdGhlIHRlbnNvci4gQ2FuIGJlIGFycmF5IG9mIG51bWJlcnMsXG4gKiAgICAgb3IgYSBgVHlwZWRBcnJheWAuXG4gKiBAcGFyYW0gZHR5cGUgVGhlIGRhdGEgdHlwZS5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnVGVuc29ycycsIHN1YmhlYWRpbmc6ICdDcmVhdGlvbid9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0ZW5zb3IxZCh2YWx1ZXM6IFRlbnNvckxpa2UxRCwgZHR5cGU/OiBEYXRhVHlwZSk6IFRlbnNvcjFEIHtcbiAgYXNzZXJ0Tm9uTnVsbCh2YWx1ZXMpO1xuICBjb25zdCBpbmZlcnJlZFNoYXBlID0gaW5mZXJTaGFwZSh2YWx1ZXMsIGR0eXBlKTtcbiAgaWYgKGluZmVycmVkU2hhcGUubGVuZ3RoICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd0ZW5zb3IxZCgpIHJlcXVpcmVzIHZhbHVlcyB0byBiZSBhIGZsYXQvVHlwZWRBcnJheScpO1xuICB9XG4gIGNvbnN0IHNoYXBlOiBudW1iZXJbXSA9IG51bGw7XG4gIHJldHVybiBtYWtlVGVuc29yKHZhbHVlcywgc2hhcGUsIGluZmVycmVkU2hhcGUsIGR0eXBlKSBhcyBUZW5zb3IxRDtcbn1cbiJdfQ==