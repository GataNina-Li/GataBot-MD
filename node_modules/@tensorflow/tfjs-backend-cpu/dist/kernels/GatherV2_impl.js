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
export function gatherV2Impl(xBuf, indicesBuf, flattenOutputShape) {
    const outBuf = buffer(flattenOutputShape, xBuf.dtype);
    for (let i = 0; i < outBuf.size; ++i) {
        const newLoc = outBuf.indexToLoc(i);
        const originalLoc = newLoc.slice();
        const batchIdx = originalLoc[0];
        const indicesIdx = originalLoc[2];
        const indicesIndex = indicesBuf.locToIndex([batchIdx, indicesIdx]);
        originalLoc[2] = indicesBuf.values[indicesIndex];
        const originalIndex = xBuf.locToIndex(originalLoc);
        if (0 <= originalIndex && originalIndex < xBuf.values.length) {
            outBuf.values[i] = xBuf.values[originalIndex];
        } // Else, index is out of bounds, so leave the default zero val in outBuf.
    }
    return outBuf;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2F0aGVyVjJfaW1wbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC1jcHUvc3JjL2tlcm5lbHMvR2F0aGVyVjJfaW1wbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUErQixNQUFNLHVCQUF1QixDQUFDO0FBRTNFLE1BQU0sVUFBVSxZQUFZLENBQ3hCLElBQXdCLEVBQUUsVUFBOEIsRUFDeEQsa0JBQTRCO0lBQzlCLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDcEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVwQyxNQUFNLFdBQVcsR0FBYSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0MsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDbkUsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFXLENBQUM7UUFFM0QsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVuRCxJQUFJLENBQUMsSUFBSSxhQUFhLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQzVELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUMvQyxDQUFDLHlFQUF5RTtLQUM1RTtJQUVELE9BQU8sTUFBNEIsQ0FBQztBQUN0QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2J1ZmZlciwgRGF0YVR5cGUsIFJhbmssIFRlbnNvckJ1ZmZlcn0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdhdGhlclYySW1wbDxSIGV4dGVuZHMgUmFuaywgRCBleHRlbmRzIERhdGFUeXBlPihcbiAgICB4QnVmOiBUZW5zb3JCdWZmZXI8UiwgRD4sIGluZGljZXNCdWY6IFRlbnNvckJ1ZmZlcjxSLCBEPixcbiAgICBmbGF0dGVuT3V0cHV0U2hhcGU6IG51bWJlcltdKTogVGVuc29yQnVmZmVyPFIsIEQ+IHtcbiAgY29uc3Qgb3V0QnVmID0gYnVmZmVyKGZsYXR0ZW5PdXRwdXRTaGFwZSwgeEJ1Zi5kdHlwZSk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgb3V0QnVmLnNpemU7ICsraSkge1xuICAgIGNvbnN0IG5ld0xvYyA9IG91dEJ1Zi5pbmRleFRvTG9jKGkpO1xuXG4gICAgY29uc3Qgb3JpZ2luYWxMb2M6IG51bWJlcltdID0gbmV3TG9jLnNsaWNlKCk7XG4gICAgY29uc3QgYmF0Y2hJZHggPSBvcmlnaW5hbExvY1swXTtcbiAgICBjb25zdCBpbmRpY2VzSWR4ID0gb3JpZ2luYWxMb2NbMl07XG4gICAgY29uc3QgaW5kaWNlc0luZGV4ID0gaW5kaWNlc0J1Zi5sb2NUb0luZGV4KFtiYXRjaElkeCwgaW5kaWNlc0lkeF0pO1xuICAgIG9yaWdpbmFsTG9jWzJdID0gaW5kaWNlc0J1Zi52YWx1ZXNbaW5kaWNlc0luZGV4XSBhcyBudW1iZXI7XG5cbiAgICBjb25zdCBvcmlnaW5hbEluZGV4ID0geEJ1Zi5sb2NUb0luZGV4KG9yaWdpbmFsTG9jKTtcblxuICAgIGlmICgwIDw9IG9yaWdpbmFsSW5kZXggJiYgb3JpZ2luYWxJbmRleCA8IHhCdWYudmFsdWVzLmxlbmd0aCkge1xuICAgICAgb3V0QnVmLnZhbHVlc1tpXSA9IHhCdWYudmFsdWVzW29yaWdpbmFsSW5kZXhdO1xuICAgIH0gLy8gRWxzZSwgaW5kZXggaXMgb3V0IG9mIGJvdW5kcywgc28gbGVhdmUgdGhlIGRlZmF1bHQgemVybyB2YWwgaW4gb3V0QnVmLlxuICB9XG5cbiAgcmV0dXJuIG91dEJ1ZiBhcyBUZW5zb3JCdWZmZXI8UiwgRD47XG59XG4iXX0=