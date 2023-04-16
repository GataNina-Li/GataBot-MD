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
import { ENGINE } from '../engine';
import { assert, assertNonNegativeIntegerDimensions, flatten, inferDtype, isTypedArray, sizeFromShape, toTypedArray } from '../util';
/** This is shared code across all tensor creation methods. */
export function makeTensor(values, shape, inferredShape, dtype) {
    if (dtype == null) {
        dtype = inferDtype(values);
    }
    if (dtype === 'complex64') {
        throw new Error(`Cannot construct a complex64 tensor directly. ` +
            `Please use tf.complex(real, imag).`);
    }
    if (!isTypedArray(values) && !Array.isArray(values) &&
        typeof values !== 'number' && typeof values !== 'boolean' &&
        typeof values !== 'string') {
        throw new Error('values passed to tensor(values) must be a number/boolean/string or ' +
            'an array of numbers/booleans/strings, or a TypedArray');
    }
    if (shape != null) {
        assertNonNegativeIntegerDimensions(shape);
        const providedSize = sizeFromShape(shape);
        const inferredSize = sizeFromShape(inferredShape);
        assert(providedSize === inferredSize, () => `Based on the provided shape, [${shape}], the tensor should have ` +
            `${providedSize} values but has ${inferredSize}`);
        for (let i = 0; i < inferredShape.length; ++i) {
            const inferred = inferredShape[i];
            const flatDimsDontMatch = i === inferredShape.length - 1 ?
                inferred !== sizeFromShape(shape.slice(i)) :
                true;
            assert(inferredShape[i] === shape[i] || !flatDimsDontMatch, () => `Error creating a new Tensor. Inferred shape ` +
                `(${inferredShape}) does not match the provided ` +
                `shape (${shape}). `);
        }
    }
    if (!isTypedArray(values) && !Array.isArray(values)) {
        values = [values];
    }
    shape = shape || inferredShape;
    values = dtype !== 'string' ?
        toTypedArray(values, dtype) :
        flatten(values, [], true);
    return ENGINE.makeTensor(values, shape, dtype);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVuc29yX29wc191dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvdGVuc29yX29wc191dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFJakMsT0FBTyxFQUFDLE1BQU0sRUFBRSxrQ0FBa0MsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBRW5JLDhEQUE4RDtBQUM5RCxNQUFNLFVBQVUsVUFBVSxDQUN0QixNQUFrQixFQUFFLEtBQWUsRUFBRSxhQUF1QixFQUM1RCxLQUFnQjtJQUNsQixJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7UUFDakIsS0FBSyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUM1QjtJQUNELElBQUksS0FBSyxLQUFLLFdBQVcsRUFBRTtRQUN6QixNQUFNLElBQUksS0FBSyxDQUNYLGdEQUFnRDtZQUNoRCxvQ0FBb0MsQ0FBQyxDQUFDO0tBQzNDO0lBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQy9DLE9BQU8sTUFBTSxLQUFLLFFBQVEsSUFBSSxPQUFPLE1BQU0sS0FBSyxTQUFTO1FBQ3pELE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtRQUM5QixNQUFNLElBQUksS0FBSyxDQUNYLHFFQUFxRTtZQUNyRSx1REFBdUQsQ0FBQyxDQUFDO0tBQzlEO0lBQ0QsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO1FBQ2pCLGtDQUFrQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTFDLE1BQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQyxNQUFNLFlBQVksR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbEQsTUFBTSxDQUNGLFlBQVksS0FBSyxZQUFZLEVBQzdCLEdBQUcsRUFBRSxDQUNELGlDQUFpQyxLQUFLLDRCQUE0QjtZQUNsRSxHQUFHLFlBQVksbUJBQW1CLFlBQVksRUFBRSxDQUFDLENBQUM7UUFFMUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDN0MsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxLQUFLLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RELFFBQVEsS0FBSyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLElBQUksQ0FBQztZQUNULE1BQU0sQ0FDRixhQUFhLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQ25ELEdBQUcsRUFBRSxDQUFDLDhDQUE4QztnQkFDaEQsSUFBSSxhQUFhLGdDQUFnQztnQkFDakQsVUFBVSxLQUFLLEtBQUssQ0FBQyxDQUFDO1NBQy9CO0tBQ0Y7SUFFRCxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNuRCxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQWEsQ0FBQztLQUMvQjtJQUVELEtBQUssR0FBRyxLQUFLLElBQUksYUFBYSxDQUFDO0lBQy9CLE1BQU0sR0FBRyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUM7UUFDekIsWUFBWSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzdCLE9BQU8sQ0FBQyxNQUFrQixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQWEsQ0FBQztJQUN0RCxPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBb0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDL0QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7VGVuc29yTGlrZSwgVHlwZWRBcnJheX0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtEYXRhVHlwZX0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHthc3NlcnQsIGFzc2VydE5vbk5lZ2F0aXZlSW50ZWdlckRpbWVuc2lvbnMsIGZsYXR0ZW4sIGluZmVyRHR5cGUsIGlzVHlwZWRBcnJheSwgc2l6ZUZyb21TaGFwZSwgdG9UeXBlZEFycmF5fSBmcm9tICcuLi91dGlsJztcblxuLyoqIFRoaXMgaXMgc2hhcmVkIGNvZGUgYWNyb3NzIGFsbCB0ZW5zb3IgY3JlYXRpb24gbWV0aG9kcy4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYWtlVGVuc29yKFxuICAgIHZhbHVlczogVGVuc29yTGlrZSwgc2hhcGU6IG51bWJlcltdLCBpbmZlcnJlZFNoYXBlOiBudW1iZXJbXSxcbiAgICBkdHlwZT86IERhdGFUeXBlKTogVGVuc29yIHtcbiAgaWYgKGR0eXBlID09IG51bGwpIHtcbiAgICBkdHlwZSA9IGluZmVyRHR5cGUodmFsdWVzKTtcbiAgfVxuICBpZiAoZHR5cGUgPT09ICdjb21wbGV4NjQnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgQ2Fubm90IGNvbnN0cnVjdCBhIGNvbXBsZXg2NCB0ZW5zb3IgZGlyZWN0bHkuIGAgK1xuICAgICAgICBgUGxlYXNlIHVzZSB0Zi5jb21wbGV4KHJlYWwsIGltYWcpLmApO1xuICB9XG4gIGlmICghaXNUeXBlZEFycmF5KHZhbHVlcykgJiYgIUFycmF5LmlzQXJyYXkodmFsdWVzKSAmJlxuICAgICAgdHlwZW9mIHZhbHVlcyAhPT0gJ251bWJlcicgJiYgdHlwZW9mIHZhbHVlcyAhPT0gJ2Jvb2xlYW4nICYmXG4gICAgICB0eXBlb2YgdmFsdWVzICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ3ZhbHVlcyBwYXNzZWQgdG8gdGVuc29yKHZhbHVlcykgbXVzdCBiZSBhIG51bWJlci9ib29sZWFuL3N0cmluZyBvciAnICtcbiAgICAgICAgJ2FuIGFycmF5IG9mIG51bWJlcnMvYm9vbGVhbnMvc3RyaW5ncywgb3IgYSBUeXBlZEFycmF5Jyk7XG4gIH1cbiAgaWYgKHNoYXBlICE9IG51bGwpIHtcbiAgICBhc3NlcnROb25OZWdhdGl2ZUludGVnZXJEaW1lbnNpb25zKHNoYXBlKTtcblxuICAgIGNvbnN0IHByb3ZpZGVkU2l6ZSA9IHNpemVGcm9tU2hhcGUoc2hhcGUpO1xuICAgIGNvbnN0IGluZmVycmVkU2l6ZSA9IHNpemVGcm9tU2hhcGUoaW5mZXJyZWRTaGFwZSk7XG4gICAgYXNzZXJ0KFxuICAgICAgICBwcm92aWRlZFNpemUgPT09IGluZmVycmVkU2l6ZSxcbiAgICAgICAgKCkgPT5cbiAgICAgICAgICAgIGBCYXNlZCBvbiB0aGUgcHJvdmlkZWQgc2hhcGUsIFske3NoYXBlfV0sIHRoZSB0ZW5zb3Igc2hvdWxkIGhhdmUgYCArXG4gICAgICAgICAgICBgJHtwcm92aWRlZFNpemV9IHZhbHVlcyBidXQgaGFzICR7aW5mZXJyZWRTaXplfWApO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmZlcnJlZFNoYXBlLmxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCBpbmZlcnJlZCA9IGluZmVycmVkU2hhcGVbaV07XG4gICAgICBjb25zdCBmbGF0RGltc0RvbnRNYXRjaCA9IGkgPT09IGluZmVycmVkU2hhcGUubGVuZ3RoIC0gMSA/XG4gICAgICAgICAgaW5mZXJyZWQgIT09IHNpemVGcm9tU2hhcGUoc2hhcGUuc2xpY2UoaSkpIDpcbiAgICAgICAgICB0cnVlO1xuICAgICAgYXNzZXJ0KFxuICAgICAgICAgIGluZmVycmVkU2hhcGVbaV0gPT09IHNoYXBlW2ldIHx8ICFmbGF0RGltc0RvbnRNYXRjaCxcbiAgICAgICAgICAoKSA9PiBgRXJyb3IgY3JlYXRpbmcgYSBuZXcgVGVuc29yLiBJbmZlcnJlZCBzaGFwZSBgICtcbiAgICAgICAgICAgICAgYCgke2luZmVycmVkU2hhcGV9KSBkb2VzIG5vdCBtYXRjaCB0aGUgcHJvdmlkZWQgYCArXG4gICAgICAgICAgICAgIGBzaGFwZSAoJHtzaGFwZX0pLiBgKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWlzVHlwZWRBcnJheSh2YWx1ZXMpICYmICFBcnJheS5pc0FycmF5KHZhbHVlcykpIHtcbiAgICB2YWx1ZXMgPSBbdmFsdWVzXSBhcyBudW1iZXJbXTtcbiAgfVxuXG4gIHNoYXBlID0gc2hhcGUgfHwgaW5mZXJyZWRTaGFwZTtcbiAgdmFsdWVzID0gZHR5cGUgIT09ICdzdHJpbmcnID9cbiAgICAgIHRvVHlwZWRBcnJheSh2YWx1ZXMsIGR0eXBlKSA6XG4gICAgICBmbGF0dGVuKHZhbHVlcyBhcyBzdHJpbmdbXSwgW10sIHRydWUpIGFzIHN0cmluZ1tdO1xuICByZXR1cm4gRU5HSU5FLm1ha2VUZW5zb3IodmFsdWVzIGFzIFR5cGVkQXJyYXksIHNoYXBlLCBkdHlwZSk7XG59XG4iXX0=