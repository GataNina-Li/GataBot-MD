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
export function maxImpl(aVals, reduceSize, outShape, dtype) {
    const vals = util.getTypedArrayFromDType(dtype, util.sizeFromShape(outShape));
    for (let i = 0; i < vals.length; ++i) {
        const offset = i * reduceSize;
        let max = aVals[offset];
        for (let j = 0; j < reduceSize; ++j) {
            const value = aVals[offset + j];
            if (Number.isNaN(value) ||
                value > max) { // comparison with NaN always return false
                max = value;
            }
        }
        vals[i] = max;
    }
    return vals;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWF4X2ltcGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtY3B1L3NyYy9rZXJuZWxzL01heF9pbXBsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBd0MsSUFBSSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFbEYsTUFBTSxVQUFVLE9BQU8sQ0FDbkIsS0FBaUIsRUFBRSxVQUFrQixFQUFFLFFBQWtCLEVBQ3pELEtBQWU7SUFDakIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUNwQyxLQUF3QixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUU1RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtRQUNwQyxNQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ25DLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDaEMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDbkIsS0FBSyxHQUFHLEdBQUcsRUFBRSxFQUFHLDBDQUEwQztnQkFDNUQsR0FBRyxHQUFHLEtBQUssQ0FBQzthQUNiO1NBQ0Y7UUFDRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0tBQ2Y7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RGF0YVR5cGUsIE51bWVyaWNEYXRhVHlwZSwgVHlwZWRBcnJheSwgdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuZXhwb3J0IGZ1bmN0aW9uIG1heEltcGwoXG4gICAgYVZhbHM6IFR5cGVkQXJyYXksIHJlZHVjZVNpemU6IG51bWJlciwgb3V0U2hhcGU6IG51bWJlcltdLFxuICAgIGR0eXBlOiBEYXRhVHlwZSk6IFR5cGVkQXJyYXkge1xuICBjb25zdCB2YWxzID0gdXRpbC5nZXRUeXBlZEFycmF5RnJvbURUeXBlKFxuICAgICAgZHR5cGUgYXMgTnVtZXJpY0RhdGFUeXBlLCB1dGlsLnNpemVGcm9tU2hhcGUob3V0U2hhcGUpKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHMubGVuZ3RoOyArK2kpIHtcbiAgICBjb25zdCBvZmZzZXQgPSBpICogcmVkdWNlU2l6ZTtcbiAgICBsZXQgbWF4ID0gYVZhbHNbb2Zmc2V0XTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHJlZHVjZVNpemU7ICsraikge1xuICAgICAgY29uc3QgdmFsdWUgPSBhVmFsc1tvZmZzZXQgKyBqXTtcbiAgICAgIGlmIChOdW1iZXIuaXNOYU4odmFsdWUpIHx8XG4gICAgICAgICAgdmFsdWUgPiBtYXgpIHsgIC8vIGNvbXBhcmlzb24gd2l0aCBOYU4gYWx3YXlzIHJldHVybiBmYWxzZVxuICAgICAgICBtYXggPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFsc1tpXSA9IG1heDtcbiAgfVxuICByZXR1cm4gdmFscztcbn1cbiJdfQ==