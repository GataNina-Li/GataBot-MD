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
import { makeOnesTypedArray, sizeFromShape } from '../util';
import { complex } from './complex';
import { zeros } from './zeros';
/**
 * Creates a `tf.Tensor` with all elements set to 1.
 *
 * ```js
 * tf.ones([2, 2]).print();
 * ```
 *
 * @param shape An array of integers defining the output tensor shape.
 * @param dtype The type of an element in the resulting tensor. Defaults to
 *     'float'.
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
export function ones(shape, dtype = 'float32') {
    if (dtype === 'complex64') {
        const real = ones(shape, 'float32');
        const imag = zeros(shape, 'float32');
        return complex(real, imag);
    }
    const values = makeOnesTypedArray(sizeFromShape(shape), dtype);
    return ENGINE.makeTensor(values, shape, dtype);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25lcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL29uZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUdqQyxPQUFPLEVBQUMsa0JBQWtCLEVBQUUsYUFBYSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBRTFELE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUU5Qjs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFNLFVBQVUsSUFBSSxDQUNoQixLQUFrQixFQUFFLFFBQWtCLFNBQVM7SUFDakQsSUFBSSxLQUFLLEtBQUssV0FBVyxFQUFFO1FBQ3pCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDcEMsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNyQyxPQUFPLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDNUI7SUFDRCxNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDL0QsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFjLENBQUM7QUFDOUQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7RGF0YVR5cGUsIFJhbmssIFNoYXBlTWFwfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge21ha2VPbmVzVHlwZWRBcnJheSwgc2l6ZUZyb21TaGFwZX0gZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7Y29tcGxleH0gZnJvbSAnLi9jb21wbGV4JztcbmltcG9ydCB7emVyb3N9IGZyb20gJy4vemVyb3MnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgdGYuVGVuc29yYCB3aXRoIGFsbCBlbGVtZW50cyBzZXQgdG8gMS5cbiAqXG4gKiBgYGBqc1xuICogdGYub25lcyhbMiwgMl0pLnByaW50KCk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gc2hhcGUgQW4gYXJyYXkgb2YgaW50ZWdlcnMgZGVmaW5pbmcgdGhlIG91dHB1dCB0ZW5zb3Igc2hhcGUuXG4gKiBAcGFyYW0gZHR5cGUgVGhlIHR5cGUgb2YgYW4gZWxlbWVudCBpbiB0aGUgcmVzdWx0aW5nIHRlbnNvci4gRGVmYXVsdHMgdG9cbiAqICAgICAnZmxvYXQnLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdUZW5zb3JzJywgc3ViaGVhZGluZzogJ0NyZWF0aW9uJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9uZXM8UiBleHRlbmRzIFJhbms+KFxuICAgIHNoYXBlOiBTaGFwZU1hcFtSXSwgZHR5cGU6IERhdGFUeXBlID0gJ2Zsb2F0MzInKTogVGVuc29yPFI+IHtcbiAgaWYgKGR0eXBlID09PSAnY29tcGxleDY0Jykge1xuICAgIGNvbnN0IHJlYWwgPSBvbmVzKHNoYXBlLCAnZmxvYXQzMicpO1xuICAgIGNvbnN0IGltYWcgPSB6ZXJvcyhzaGFwZSwgJ2Zsb2F0MzInKTtcbiAgICByZXR1cm4gY29tcGxleChyZWFsLCBpbWFnKTtcbiAgfVxuICBjb25zdCB2YWx1ZXMgPSBtYWtlT25lc1R5cGVkQXJyYXkoc2l6ZUZyb21TaGFwZShzaGFwZSksIGR0eXBlKTtcbiAgcmV0dXJuIEVOR0lORS5tYWtlVGVuc29yKHZhbHVlcywgc2hhcGUsIGR0eXBlKSBhcyBUZW5zb3I8Uj47XG59XG4iXX0=