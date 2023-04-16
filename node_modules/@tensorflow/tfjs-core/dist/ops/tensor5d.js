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
 * Creates rank-5 `tf.Tensor` with the provided values, shape and dtype.
 *
 * The same functionality can be achieved with `tf.tensor`, but in general
 * we recommend using `tf.tensor5d` as it makes the code more readable.
 *
 *  ```js
 * // Pass a nested array.
 * tf.tensor5d([[[[[1],[2]],[[3],[4]]],[[[5],[6]],[[7],[8]]]]]).print();
 * ```
 * ```js
 * // Pass a flat array and specify a shape.
 * tf.tensor5d([1, 2, 3, 4, 5, 6, 7, 8], [1, 2, 2, 2, 1]).print();
 * ```
 *
 * @param values The values of the tensor. Can be nested array of numbers,
 *     or a flat array, or a `TypedArray`.
 * @param shape The shape of the tensor. Optional. If not provided,
 *   it is inferred from `values`.
 * @param dtype The data type.
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
export function tensor5d(values, shape, dtype) {
    assertNonNull(values);
    if (shape != null && shape.length !== 5) {
        throw new Error('tensor5d() requires shape to have five numbers');
    }
    const inferredShape = inferShape(values, dtype);
    if (inferredShape.length !== 5 && inferredShape.length !== 1) {
        throw new Error('tensor5d() requires values to be ' +
            'number[][][][][] or flat/TypedArray');
    }
    if (inferredShape.length === 1 && shape == null) {
        throw new Error('tensor5d() requires shape to be provided when `values` ' +
            'are a flat array');
    }
    return makeTensor(values, shape, inferredShape, dtype);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVuc29yNWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy90ZW5zb3I1ZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFHSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHOUMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUN0QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFN0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FzQkc7QUFDSCxNQUFNLFVBQVUsUUFBUSxDQUNwQixNQUFvQixFQUFFLEtBQWdELEVBQ3RFLEtBQWdCO0lBQ2xCLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QixJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDdkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO0tBQ25FO0lBQ0QsTUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoRCxJQUFJLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQzVELE1BQU0sSUFBSSxLQUFLLENBQ1gsbUNBQW1DO1lBQ25DLHFDQUFxQyxDQUFDLENBQUM7S0FDNUM7SUFDRCxJQUFJLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7UUFDL0MsTUFBTSxJQUFJLEtBQUssQ0FDWCx5REFBeUQ7WUFDekQsa0JBQWtCLENBQUMsQ0FBQztLQUN6QjtJQUNELE9BQU8sVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBYSxDQUFDO0FBQ3JFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7VGVuc29yNUR9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge2luZmVyU2hhcGV9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2U1RH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtEYXRhVHlwZX0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHthc3NlcnROb25OdWxsfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7bWFrZVRlbnNvcn0gZnJvbSAnLi90ZW5zb3Jfb3BzX3V0aWwnO1xuXG4vKipcbiAqIENyZWF0ZXMgcmFuay01IGB0Zi5UZW5zb3JgIHdpdGggdGhlIHByb3ZpZGVkIHZhbHVlcywgc2hhcGUgYW5kIGR0eXBlLlxuICpcbiAqIFRoZSBzYW1lIGZ1bmN0aW9uYWxpdHkgY2FuIGJlIGFjaGlldmVkIHdpdGggYHRmLnRlbnNvcmAsIGJ1dCBpbiBnZW5lcmFsXG4gKiB3ZSByZWNvbW1lbmQgdXNpbmcgYHRmLnRlbnNvcjVkYCBhcyBpdCBtYWtlcyB0aGUgY29kZSBtb3JlIHJlYWRhYmxlLlxuICpcbiAqICBgYGBqc1xuICogLy8gUGFzcyBhIG5lc3RlZCBhcnJheS5cbiAqIHRmLnRlbnNvcjVkKFtbW1tbMV0sWzJdXSxbWzNdLFs0XV1dLFtbWzVdLFs2XV0sW1s3XSxbOF1dXV1dKS5wcmludCgpO1xuICogYGBgXG4gKiBgYGBqc1xuICogLy8gUGFzcyBhIGZsYXQgYXJyYXkgYW5kIHNwZWNpZnkgYSBzaGFwZS5cbiAqIHRmLnRlbnNvcjVkKFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4XSwgWzEsIDIsIDIsIDIsIDFdKS5wcmludCgpO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHZhbHVlcyBUaGUgdmFsdWVzIG9mIHRoZSB0ZW5zb3IuIENhbiBiZSBuZXN0ZWQgYXJyYXkgb2YgbnVtYmVycyxcbiAqICAgICBvciBhIGZsYXQgYXJyYXksIG9yIGEgYFR5cGVkQXJyYXlgLlxuICogQHBhcmFtIHNoYXBlIFRoZSBzaGFwZSBvZiB0aGUgdGVuc29yLiBPcHRpb25hbC4gSWYgbm90IHByb3ZpZGVkLFxuICogICBpdCBpcyBpbmZlcnJlZCBmcm9tIGB2YWx1ZXNgLlxuICogQHBhcmFtIGR0eXBlIFRoZSBkYXRhIHR5cGUuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ1RlbnNvcnMnLCBzdWJoZWFkaW5nOiAnQ3JlYXRpb24nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGVuc29yNWQoXG4gICAgdmFsdWVzOiBUZW5zb3JMaWtlNUQsIHNoYXBlPzogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcbiAgICBkdHlwZT86IERhdGFUeXBlKTogVGVuc29yNUQge1xuICBhc3NlcnROb25OdWxsKHZhbHVlcyk7XG4gIGlmIChzaGFwZSAhPSBudWxsICYmIHNoYXBlLmxlbmd0aCAhPT0gNSkge1xuICAgIHRocm93IG5ldyBFcnJvcigndGVuc29yNWQoKSByZXF1aXJlcyBzaGFwZSB0byBoYXZlIGZpdmUgbnVtYmVycycpO1xuICB9XG4gIGNvbnN0IGluZmVycmVkU2hhcGUgPSBpbmZlclNoYXBlKHZhbHVlcywgZHR5cGUpO1xuICBpZiAoaW5mZXJyZWRTaGFwZS5sZW5ndGggIT09IDUgJiYgaW5mZXJyZWRTaGFwZS5sZW5ndGggIT09IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICd0ZW5zb3I1ZCgpIHJlcXVpcmVzIHZhbHVlcyB0byBiZSAnICtcbiAgICAgICAgJ251bWJlcltdW11bXVtdW10gb3IgZmxhdC9UeXBlZEFycmF5Jyk7XG4gIH1cbiAgaWYgKGluZmVycmVkU2hhcGUubGVuZ3RoID09PSAxICYmIHNoYXBlID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICd0ZW5zb3I1ZCgpIHJlcXVpcmVzIHNoYXBlIHRvIGJlIHByb3ZpZGVkIHdoZW4gYHZhbHVlc2AgJyArXG4gICAgICAgICdhcmUgYSBmbGF0IGFycmF5Jyk7XG4gIH1cbiAgcmV0dXJuIG1ha2VUZW5zb3IodmFsdWVzLCBzaGFwZSwgaW5mZXJyZWRTaGFwZSwgZHR5cGUpIGFzIFRlbnNvcjVEO1xufVxuIl19