/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
export class AddNPackedProgram {
    constructor(outputShape, shapes) {
        this.outputShape = [];
        this.packedInputs = true;
        this.packedOutput = true;
        this.outputShape = outputShape;
        this.variableNames = shapes.map((_, i) => `T${i}`);
        const snippets = [];
        // Get target elements from every input tensor.
        this.variableNames.forEach(variable => {
            snippets.push(`vec4 v${variable} = get${variable}AtOutCoords();`);
        });
        // Calculate the sum of all elements.
        const operation = this.variableNames
            .map(variable => {
            return `v${variable}`;
        })
            .join(' + ');
        this.userCode = `
      void main() {
        ${snippets.join('\n        ')}

        vec4 result = ${operation};
        setOutput(result);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkbl9wYWNrZWRfZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9hZGRuX3BhY2tlZF9ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBSUgsTUFBTSxPQUFPLGlCQUFpQjtJQU81QixZQUFZLFdBQXFCLEVBQUUsTUFBa0I7UUFMckQsZ0JBQVcsR0FBYSxFQUFFLENBQUM7UUFFM0IsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFHbEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRW5ELE1BQU0sUUFBUSxHQUFhLEVBQUUsQ0FBQztRQUM5QiwrQ0FBK0M7UUFDL0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDcEMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLFFBQVEsU0FBUyxRQUFRLGdCQUFnQixDQUFDLENBQUM7UUFDcEUsQ0FBQyxDQUFDLENBQUM7UUFFSCxxQ0FBcUM7UUFDckMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWE7YUFDYixHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDZCxPQUFPLElBQUksUUFBUSxFQUFFLENBQUM7UUFDeEIsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRW5DLElBQUksQ0FBQyxRQUFRLEdBQUc7O1VBRVYsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7O3dCQUViLFNBQVM7OztLQUc1QixDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0dQR1BVUHJvZ3JhbX0gZnJvbSAnLi9ncGdwdV9tYXRoJztcblxuZXhwb3J0IGNsYXNzIEFkZE5QYWNrZWRQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lczogc3RyaW5nW107XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXSA9IFtdO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuICBwYWNrZWRJbnB1dHMgPSB0cnVlO1xuICBwYWNrZWRPdXRwdXQgPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKG91dHB1dFNoYXBlOiBudW1iZXJbXSwgc2hhcGVzOiBudW1iZXJbXVtdKSB7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IG91dHB1dFNoYXBlO1xuICAgIHRoaXMudmFyaWFibGVOYW1lcyA9IHNoYXBlcy5tYXAoKF8sIGkpID0+IGBUJHtpfWApO1xuXG4gICAgY29uc3Qgc25pcHBldHM6IHN0cmluZ1tdID0gW107XG4gICAgLy8gR2V0IHRhcmdldCBlbGVtZW50cyBmcm9tIGV2ZXJ5IGlucHV0IHRlbnNvci5cbiAgICB0aGlzLnZhcmlhYmxlTmFtZXMuZm9yRWFjaCh2YXJpYWJsZSA9PiB7XG4gICAgICBzbmlwcGV0cy5wdXNoKGB2ZWM0IHYke3ZhcmlhYmxlfSA9IGdldCR7dmFyaWFibGV9QXRPdXRDb29yZHMoKTtgKTtcbiAgICB9KTtcblxuICAgIC8vIENhbGN1bGF0ZSB0aGUgc3VtIG9mIGFsbCBlbGVtZW50cy5cbiAgICBjb25zdCBvcGVyYXRpb24gPSB0aGlzLnZhcmlhYmxlTmFtZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCh2YXJpYWJsZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGB2JHt2YXJpYWJsZX1gO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAuam9pbignICsgJyk7XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICAke3NuaXBwZXRzLmpvaW4oJ1xcbiAgICAgICAgJyl9XG5cbiAgICAgICAgdmVjNCByZXN1bHQgPSAke29wZXJhdGlvbn07XG4gICAgICAgIHNldE91dHB1dChyZXN1bHQpO1xuICAgICAgfVxuICAgIGA7XG4gIH1cbn1cbiJdfQ==