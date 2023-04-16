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
import { makeZerosTypedArray, sizeFromShape } from '../util';
import { complex } from './complex';
/**
 * Creates a `tf.Tensor` with all elements set to 0.
 *
 * ```js
 * tf.zeros([2, 2]).print();
 * ```
 *
 * @param shape An array of integers defining the output tensor shape.
 * @param dtype The type of an element in the resulting tensor. Can
 *     be 'float32', 'int32' or 'bool'. Defaults to 'float'.
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
export function zeros(shape, dtype = 'float32') {
    if (dtype === 'complex64') {
        const real = zeros(shape, 'float32');
        const imag = zeros(shape, 'float32');
        return complex(real, imag);
    }
    const values = makeZerosTypedArray(sizeFromShape(shape), dtype);
    return ENGINE.makeTensor(values, shape, dtype);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemVyb3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy96ZXJvcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBR2pDLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxhQUFhLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFFM0QsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUVsQzs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFNLFVBQVUsS0FBSyxDQUNqQixLQUFrQixFQUFFLFFBQWtCLFNBQVM7SUFDakQsSUFBSSxLQUFLLEtBQUssV0FBVyxFQUFFO1FBQ3pCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDckMsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNyQyxPQUFPLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDNUI7SUFDRCxNQUFNLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDaEUsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFjLENBQUM7QUFDOUQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7RGF0YVR5cGUsIFJhbmssIFNoYXBlTWFwfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge21ha2VaZXJvc1R5cGVkQXJyYXksIHNpemVGcm9tU2hhcGV9IGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge2NvbXBsZXh9IGZyb20gJy4vY29tcGxleCc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGB0Zi5UZW5zb3JgIHdpdGggYWxsIGVsZW1lbnRzIHNldCB0byAwLlxuICpcbiAqIGBgYGpzXG4gKiB0Zi56ZXJvcyhbMiwgMl0pLnByaW50KCk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gc2hhcGUgQW4gYXJyYXkgb2YgaW50ZWdlcnMgZGVmaW5pbmcgdGhlIG91dHB1dCB0ZW5zb3Igc2hhcGUuXG4gKiBAcGFyYW0gZHR5cGUgVGhlIHR5cGUgb2YgYW4gZWxlbWVudCBpbiB0aGUgcmVzdWx0aW5nIHRlbnNvci4gQ2FuXG4gKiAgICAgYmUgJ2Zsb2F0MzInLCAnaW50MzInIG9yICdib29sJy4gRGVmYXVsdHMgdG8gJ2Zsb2F0Jy5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnVGVuc29ycycsIHN1YmhlYWRpbmc6ICdDcmVhdGlvbid9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB6ZXJvczxSIGV4dGVuZHMgUmFuaz4oXG4gICAgc2hhcGU6IFNoYXBlTWFwW1JdLCBkdHlwZTogRGF0YVR5cGUgPSAnZmxvYXQzMicpOiBUZW5zb3I8Uj4ge1xuICBpZiAoZHR5cGUgPT09ICdjb21wbGV4NjQnKSB7XG4gICAgY29uc3QgcmVhbCA9IHplcm9zKHNoYXBlLCAnZmxvYXQzMicpO1xuICAgIGNvbnN0IGltYWcgPSB6ZXJvcyhzaGFwZSwgJ2Zsb2F0MzInKTtcbiAgICByZXR1cm4gY29tcGxleChyZWFsLCBpbWFnKTtcbiAgfVxuICBjb25zdCB2YWx1ZXMgPSBtYWtlWmVyb3NUeXBlZEFycmF5KHNpemVGcm9tU2hhcGUoc2hhcGUpLCBkdHlwZSk7XG4gIHJldHVybiBFTkdJTkUubWFrZVRlbnNvcih2YWx1ZXMsIHNoYXBlLCBkdHlwZSkgYXMgVGVuc29yPFI+O1xufVxuIl19