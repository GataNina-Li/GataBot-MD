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
import { buffer } from '@tensorflow/tfjs-core';
export function stridedSliceImpl(outShape, xBuf, strides, begin) {
    const outBuf = buffer(outShape, xBuf.dtype);
    for (let i = 0; i < outBuf.size; i++) {
        const loc = outBuf.indexToLoc(i);
        const newLoc = new Array(loc.length);
        for (let j = 0; j < newLoc.length; j++) {
            newLoc[j] = loc[j] * strides[j] + begin[j];
        }
        outBuf.set(xBuf.get(...newLoc), ...loc);
    }
    return outBuf;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RyaWRlZFNsaWNlX2ltcGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtY3B1L3NyYy9rZXJuZWxzL1N0cmlkZWRTbGljZV9pbXBsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQXFCLE1BQU0sdUJBQXVCLENBQUM7QUFFakUsTUFBTSxVQUFVLGdCQUFnQixDQUM1QixRQUFrQixFQUFFLElBQXFCLEVBQUUsT0FBaUIsRUFDNUQsS0FBZTtJQUNqQixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUU1QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNwQyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWpDLE1BQU0sTUFBTSxHQUFhLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN0QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDNUM7UUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0tBQ3pDO0lBRUQsT0FBTyxNQUF5QixDQUFDO0FBQ25DLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7YnVmZmVyLCBSYW5rLCBUZW5zb3JCdWZmZXJ9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzdHJpZGVkU2xpY2VJbXBsPFIgZXh0ZW5kcyBSYW5rPihcbiAgICBvdXRTaGFwZTogbnVtYmVyW10sIHhCdWY6IFRlbnNvckJ1ZmZlcjxSPiwgc3RyaWRlczogbnVtYmVyW10sXG4gICAgYmVnaW46IG51bWJlcltdKTogVGVuc29yQnVmZmVyPFI+IHtcbiAgY29uc3Qgb3V0QnVmID0gYnVmZmVyKG91dFNoYXBlLCB4QnVmLmR0eXBlKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG91dEJ1Zi5zaXplOyBpKyspIHtcbiAgICBjb25zdCBsb2MgPSBvdXRCdWYuaW5kZXhUb0xvYyhpKTtcblxuICAgIGNvbnN0IG5ld0xvYzogbnVtYmVyW10gPSBuZXcgQXJyYXkobG9jLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBuZXdMb2MubGVuZ3RoOyBqKyspIHtcbiAgICAgIG5ld0xvY1tqXSA9IGxvY1tqXSAqIHN0cmlkZXNbal0gKyBiZWdpbltqXTtcbiAgICB9XG4gICAgb3V0QnVmLnNldCh4QnVmLmdldCguLi5uZXdMb2MpLCAuLi5sb2MpO1xuICB9XG5cbiAgcmV0dXJuIG91dEJ1ZiBhcyBUZW5zb3JCdWZmZXI8Uj47XG59XG4iXX0=