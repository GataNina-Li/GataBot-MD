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
export class ClipPackedProgram {
    constructor(aShape) {
        this.variableNames = ['A'];
        this.packedInputs = true;
        this.packedOutput = true;
        this.customUniforms = [
            { name: 'minVal', type: 'float' },
            { name: 'maxVal', type: 'float' }
        ];
        this.outputShape = aShape;
        this.userCode = `
      void main() {
        vec4 value = getAAtOutCoords();

        if (any(isnan(value))) {
          setOutput(value);
          return;
        }

        setOutput(clamp(value, vec4(minVal), vec4(maxVal)));
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpcF9wYWNrZWRfZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9jbGlwX3BhY2tlZF9ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBS0gsTUFBTSxPQUFPLGlCQUFpQjtJQVc1QixZQUFZLE1BQWdCO1FBVjVCLGtCQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUdwQixtQkFBYyxHQUFHO1lBQ2YsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFzQixFQUFDO1lBQzlDLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBc0IsRUFBQztTQUMvQyxDQUFDO1FBR0EsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7UUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRzs7Ozs7Ozs7Ozs7S0FXZixDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0dQR1BVUHJvZ3JhbX0gZnJvbSAnLi9ncGdwdV9tYXRoJztcbmltcG9ydCB7VW5pZm9ybVR5cGV9IGZyb20gJy4vc2hhZGVyX2NvbXBpbGVyJztcblxuZXhwb3J0IGNsYXNzIENsaXBQYWNrZWRQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsnQSddO1xuICBwYWNrZWRJbnB1dHMgPSB0cnVlO1xuICBwYWNrZWRPdXRwdXQgPSB0cnVlO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIGN1c3RvbVVuaWZvcm1zID0gW1xuICAgIHtuYW1lOiAnbWluVmFsJywgdHlwZTogJ2Zsb2F0JyBhcyBVbmlmb3JtVHlwZX0sXG4gICAge25hbWU6ICdtYXhWYWwnLCB0eXBlOiAnZmxvYXQnIGFzIFVuaWZvcm1UeXBlfVxuICBdO1xuXG4gIGNvbnN0cnVjdG9yKGFTaGFwZTogbnVtYmVyW10pIHtcbiAgICB0aGlzLm91dHB1dFNoYXBlID0gYVNoYXBlO1xuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIHZlYzQgdmFsdWUgPSBnZXRBQXRPdXRDb29yZHMoKTtcblxuICAgICAgICBpZiAoYW55KGlzbmFuKHZhbHVlKSkpIHtcbiAgICAgICAgICBzZXRPdXRwdXQodmFsdWUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldE91dHB1dChjbGFtcCh2YWx1ZSwgdmVjNChtaW5WYWwpLCB2ZWM0KG1heFZhbCkpKTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG4iXX0=