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
import { buffer } from '@tensorflow/tfjs-core';
export function gatherNdImpl(indicesData, paramsBuf, dtype, numSlices, sliceRank, sliceSize, strides, paramsShape, paramsSize) {
    const outBuf = buffer([numSlices, sliceSize], dtype);
    for (let i = 0; i < numSlices; i++) {
        const index = [];
        let flattenIndex = 0;
        for (let j = 0; j < sliceRank; j++) {
            const dim = indicesData[i * sliceRank + j];
            flattenIndex += dim * strides[j];
            index.push(dim);
        }
        if (flattenIndex < 0 || flattenIndex >= paramsSize / sliceSize) {
            throw new Error(`Invalid indices: ${index} does not index into ${paramsShape}`);
        }
        for (let k = 0; k < sliceSize; k++) {
            outBuf.values[i * sliceSize + k] =
                paramsBuf.get(...paramsBuf.indexToLoc(flattenIndex * sliceSize + k));
        }
    }
    return outBuf;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2F0aGVyTmRfSW1wbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC1jcHUvc3JjL2tlcm5lbHMvR2F0aGVyTmRfSW1wbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUEyQyxNQUFNLHVCQUF1QixDQUFDO0FBRXZGLE1BQU0sVUFBVSxZQUFZLENBQ3hCLFdBQXVCLEVBQUUsU0FBMEIsRUFBRSxLQUFlLEVBQ3BFLFNBQWlCLEVBQUUsU0FBaUIsRUFBRSxTQUFpQixFQUFFLE9BQWlCLEVBQzFFLFdBQXFCLEVBQUUsVUFBa0I7SUFDM0MsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRXJELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDbEMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztRQUNyQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2xDLE1BQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzNDLFlBQVksSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDakI7UUFDRCxJQUFJLFlBQVksR0FBRyxDQUFDLElBQUksWUFBWSxJQUFJLFVBQVUsR0FBRyxTQUFTLEVBQUU7WUFDOUQsTUFBTSxJQUFJLEtBQUssQ0FDWCxvQkFBb0IsS0FBSyx3QkFBd0IsV0FBVyxFQUFFLENBQUMsQ0FBQztTQUNyRTtRQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztnQkFDNUIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsWUFBWSxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzFFO0tBQ0Y7SUFFRCxPQUFPLE1BQXlCLENBQUM7QUFDbkMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIxIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtidWZmZXIsIERhdGFUeXBlLCBSYW5rLCBUZW5zb3JCdWZmZXIsIFR5cGVkQXJyYXl9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnYXRoZXJOZEltcGw8UiBleHRlbmRzIFJhbms+KFxuICAgIGluZGljZXNEYXRhOiBUeXBlZEFycmF5LCBwYXJhbXNCdWY6IFRlbnNvckJ1ZmZlcjxSPiwgZHR5cGU6IERhdGFUeXBlLFxuICAgIG51bVNsaWNlczogbnVtYmVyLCBzbGljZVJhbms6IG51bWJlciwgc2xpY2VTaXplOiBudW1iZXIsIHN0cmlkZXM6IG51bWJlcltdLFxuICAgIHBhcmFtc1NoYXBlOiBudW1iZXJbXSwgcGFyYW1zU2l6ZTogbnVtYmVyKTogVGVuc29yQnVmZmVyPFI+IHtcbiAgY29uc3Qgb3V0QnVmID0gYnVmZmVyKFtudW1TbGljZXMsIHNsaWNlU2l6ZV0sIGR0eXBlKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVNsaWNlczsgaSsrKSB7XG4gICAgY29uc3QgaW5kZXggPSBbXTtcbiAgICBsZXQgZmxhdHRlbkluZGV4ID0gMDtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNsaWNlUmFuazsgaisrKSB7XG4gICAgICBjb25zdCBkaW0gPSBpbmRpY2VzRGF0YVtpICogc2xpY2VSYW5rICsgal07XG4gICAgICBmbGF0dGVuSW5kZXggKz0gZGltICogc3RyaWRlc1tqXTtcbiAgICAgIGluZGV4LnB1c2goZGltKTtcbiAgICB9XG4gICAgaWYgKGZsYXR0ZW5JbmRleCA8IDAgfHwgZmxhdHRlbkluZGV4ID49IHBhcmFtc1NpemUgLyBzbGljZVNpemUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgSW52YWxpZCBpbmRpY2VzOiAke2luZGV4fSBkb2VzIG5vdCBpbmRleCBpbnRvICR7cGFyYW1zU2hhcGV9YCk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgayA9IDA7IGsgPCBzbGljZVNpemU7IGsrKykge1xuICAgICAgb3V0QnVmLnZhbHVlc1tpICogc2xpY2VTaXplICsga10gPVxuICAgICAgICAgIHBhcmFtc0J1Zi5nZXQoLi4ucGFyYW1zQnVmLmluZGV4VG9Mb2MoZmxhdHRlbkluZGV4ICogc2xpY2VTaXplICsgaykpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvdXRCdWYgYXMgVGVuc29yQnVmZmVyPFI+O1xufVxuIl19