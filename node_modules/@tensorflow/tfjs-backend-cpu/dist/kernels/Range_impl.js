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
export function rangeImpl(start, stop, step, dtype) {
    const sameStartStop = start === stop;
    const increasingRangeNegativeStep = start < stop && step < 0;
    const decreasingRangePositiveStep = stop < start && step > 1;
    if (sameStartStop || increasingRangeNegativeStep ||
        decreasingRangePositiveStep) {
        return util.makeZerosTypedArray(0, dtype);
    }
    const numElements = Math.abs(Math.ceil((stop - start) / step));
    const values = util.makeZerosTypedArray(numElements, dtype);
    if (stop < start && step === 1) {
        // Auto adjust the step's sign if it hasn't been set
        // (or was set to 1)
        step = -1;
    }
    values[0] = start;
    for (let i = 1; i < values.length; i++) {
        values[i] = values[i - 1] + step;
    }
    return values;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmFuZ2VfaW1wbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC1jcHUvc3JjL2tlcm5lbHMvUmFuZ2VfaW1wbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQWMsSUFBSSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFeEQsTUFBTSxVQUFVLFNBQVMsQ0FDckIsS0FBYSxFQUFFLElBQVksRUFBRSxJQUFZLEVBQ3pDLEtBQXdCO0lBQzFCLE1BQU0sYUFBYSxHQUFHLEtBQUssS0FBSyxJQUFJLENBQUM7SUFDckMsTUFBTSwyQkFBMkIsR0FBRyxLQUFLLEdBQUcsSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7SUFDN0QsTUFBTSwyQkFBMkIsR0FBRyxJQUFJLEdBQUcsS0FBSyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7SUFFN0QsSUFBSSxhQUFhLElBQUksMkJBQTJCO1FBQzVDLDJCQUEyQixFQUFFO1FBQy9CLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUMzQztJQUVELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQy9ELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFNUQsSUFBSSxJQUFJLEdBQUcsS0FBSyxJQUFJLElBQUksS0FBSyxDQUFDLEVBQUU7UUFDOUIsb0RBQW9EO1FBQ3BELG9CQUFvQjtRQUNwQixJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDWDtJQUVELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDbEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0tBQ2xDO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtEYXRhVHlwZU1hcCwgdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJhbmdlSW1wbChcbiAgICBzdGFydDogbnVtYmVyLCBzdG9wOiBudW1iZXIsIHN0ZXA6IG51bWJlcixcbiAgICBkdHlwZTogJ2Zsb2F0MzInfCdpbnQzMicpOiBEYXRhVHlwZU1hcFsnZmxvYXQzMicgfCAnaW50MzInXSB7XG4gIGNvbnN0IHNhbWVTdGFydFN0b3AgPSBzdGFydCA9PT0gc3RvcDtcbiAgY29uc3QgaW5jcmVhc2luZ1JhbmdlTmVnYXRpdmVTdGVwID0gc3RhcnQgPCBzdG9wICYmIHN0ZXAgPCAwO1xuICBjb25zdCBkZWNyZWFzaW5nUmFuZ2VQb3NpdGl2ZVN0ZXAgPSBzdG9wIDwgc3RhcnQgJiYgc3RlcCA+IDE7XG5cbiAgaWYgKHNhbWVTdGFydFN0b3AgfHwgaW5jcmVhc2luZ1JhbmdlTmVnYXRpdmVTdGVwIHx8XG4gICAgICBkZWNyZWFzaW5nUmFuZ2VQb3NpdGl2ZVN0ZXApIHtcbiAgICByZXR1cm4gdXRpbC5tYWtlWmVyb3NUeXBlZEFycmF5KDAsIGR0eXBlKTtcbiAgfVxuXG4gIGNvbnN0IG51bUVsZW1lbnRzID0gTWF0aC5hYnMoTWF0aC5jZWlsKChzdG9wIC0gc3RhcnQpIC8gc3RlcCkpO1xuICBjb25zdCB2YWx1ZXMgPSB1dGlsLm1ha2VaZXJvc1R5cGVkQXJyYXkobnVtRWxlbWVudHMsIGR0eXBlKTtcblxuICBpZiAoc3RvcCA8IHN0YXJ0ICYmIHN0ZXAgPT09IDEpIHtcbiAgICAvLyBBdXRvIGFkanVzdCB0aGUgc3RlcCdzIHNpZ24gaWYgaXQgaGFzbid0IGJlZW4gc2V0XG4gICAgLy8gKG9yIHdhcyBzZXQgdG8gMSlcbiAgICBzdGVwID0gLTE7XG4gIH1cblxuICB2YWx1ZXNbMF0gPSBzdGFydDtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YWx1ZXNbaV0gPSB2YWx1ZXNbaSAtIDFdICsgc3RlcDtcbiAgfVxuICByZXR1cm4gdmFsdWVzO1xufVxuIl19