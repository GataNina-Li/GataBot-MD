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
import { util } from '@tensorflow/tfjs-core';
import { complex } from '../kernels/Complex';
/**
 * Generates a tensorInfo with all zeros value.
 * @param backend cpu backend.
 * @param shape Shape for the zeros tensor.
 * @param dtype Optional. If set, the result has this dtype.
 */
export function zeros(backend, shape, dtype = 'float32') {
    if (dtype === 'complex64') {
        const real = zeros(backend, shape, 'float32');
        const imag = zeros(backend, shape, 'float32');
        return complex({ inputs: { real, imag }, backend });
    }
    const values = util.makeZerosTypedArray(util.sizeFromShape(shape), dtype);
    return backend.makeTensorInfo(shape, dtype, values);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemVyb3NfaW1wbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC1jcHUvc3JjL3V0aWxzL3plcm9zX2ltcGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUF1QixJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUVqRSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFM0M7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsS0FBSyxDQUNqQixPQUF1QixFQUFFLEtBQWUsRUFDeEMsUUFBa0IsU0FBUztJQUM3QixJQUFJLEtBQUssS0FBSyxXQUFXLEVBQUU7UUFDekIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDOUMsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFOUMsT0FBTyxPQUFPLENBQUMsRUFBQyxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztLQUNqRDtJQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRTFFLE9BQU8sT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3RELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RGF0YVR5cGUsIFRlbnNvckluZm8sIHV0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5pbXBvcnQge01hdGhCYWNrZW5kQ1BVfSBmcm9tICcuLi9iYWNrZW5kX2NwdSc7XG5pbXBvcnQge2NvbXBsZXh9IGZyb20gJy4uL2tlcm5lbHMvQ29tcGxleCc7XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgdGVuc29ySW5mbyB3aXRoIGFsbCB6ZXJvcyB2YWx1ZS5cbiAqIEBwYXJhbSBiYWNrZW5kIGNwdSBiYWNrZW5kLlxuICogQHBhcmFtIHNoYXBlIFNoYXBlIGZvciB0aGUgemVyb3MgdGVuc29yLlxuICogQHBhcmFtIGR0eXBlIE9wdGlvbmFsLiBJZiBzZXQsIHRoZSByZXN1bHQgaGFzIHRoaXMgZHR5cGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB6ZXJvcyhcbiAgICBiYWNrZW5kOiBNYXRoQmFja2VuZENQVSwgc2hhcGU6IG51bWJlcltdLFxuICAgIGR0eXBlOiBEYXRhVHlwZSA9ICdmbG9hdDMyJyk6IFRlbnNvckluZm8ge1xuICBpZiAoZHR5cGUgPT09ICdjb21wbGV4NjQnKSB7XG4gICAgY29uc3QgcmVhbCA9IHplcm9zKGJhY2tlbmQsIHNoYXBlLCAnZmxvYXQzMicpO1xuICAgIGNvbnN0IGltYWcgPSB6ZXJvcyhiYWNrZW5kLCBzaGFwZSwgJ2Zsb2F0MzInKTtcblxuICAgIHJldHVybiBjb21wbGV4KHtpbnB1dHM6IHtyZWFsLCBpbWFnfSwgYmFja2VuZH0pO1xuICB9XG5cbiAgY29uc3QgdmFsdWVzID0gdXRpbC5tYWtlWmVyb3NUeXBlZEFycmF5KHV0aWwuc2l6ZUZyb21TaGFwZShzaGFwZSksIGR0eXBlKTtcblxuICByZXR1cm4gYmFja2VuZC5tYWtlVGVuc29ySW5mbyhzaGFwZSwgZHR5cGUsIHZhbHVlcyk7XG59XG4iXX0=