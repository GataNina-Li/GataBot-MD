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
/**
 * Template that creates implementation for unary op.
 */
export function createSimpleUnaryImpl(op) {
    return (values, dtype, attrs) => {
        const newValues = util.getTypedArrayFromDType(dtype, values.length);
        for (let i = 0; i < values.length; ++i) {
            newValues[i] = op(values[i], attrs);
        }
        return newValues;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5hcnlfaW1wbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC1jcHUvc3JjL3V0aWxzL3VuYXJ5X2ltcGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFrQixJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUk1RDs7R0FFRztBQUNILE1BQU0sVUFBVSxxQkFBcUIsQ0FBQyxFQUF3QjtJQUU1RCxPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUM5QixNQUFNLFNBQVMsR0FDWCxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBd0IsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDdEMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDckM7UUFDRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge051bWVyaWNEYXRhVHlwZSwgdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtTaW1wbGVVbmFyeUltcGwsIFNpbXBsZVVuYXJ5T3BlcmF0aW9ufSBmcm9tICcuL3VuYXJ5X3R5cGVzJztcblxuLyoqXG4gKiBUZW1wbGF0ZSB0aGF0IGNyZWF0ZXMgaW1wbGVtZW50YXRpb24gZm9yIHVuYXJ5IG9wLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2ltcGxlVW5hcnlJbXBsKG9wOiBTaW1wbGVVbmFyeU9wZXJhdGlvbik6XG4gICAgU2ltcGxlVW5hcnlJbXBsIHtcbiAgcmV0dXJuICh2YWx1ZXMsIGR0eXBlLCBhdHRycykgPT4ge1xuICAgIGNvbnN0IG5ld1ZhbHVlcyA9XG4gICAgICAgIHV0aWwuZ2V0VHlwZWRBcnJheUZyb21EVHlwZShkdHlwZSBhcyBOdW1lcmljRGF0YVR5cGUsIHZhbHVlcy5sZW5ndGgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICBuZXdWYWx1ZXNbaV0gPSBvcCh2YWx1ZXNbaV0sIGF0dHJzKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld1ZhbHVlcztcbiAgfTtcbn1cbiJdfQ==