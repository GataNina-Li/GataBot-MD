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
export class AddNProgram {
    constructor(outputShape, shapes) {
        this.outputShape = [];
        this.outputShape = outputShape;
        this.variableNames = shapes.map((_, i) => `T${i}`);
        const snippets = [];
        // Get target elements from every input tensor.
        this.variableNames.forEach(variable => {
            snippets.push(`float v${variable} = get${variable}AtOutCoords();`);
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

        float result = ${operation};
        setOutput(result);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkbl9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2FkZG5fZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUlILE1BQU0sT0FBTyxXQUFXO0lBS3RCLFlBQVksV0FBcUIsRUFBRSxNQUFrQjtRQUhyRCxnQkFBVyxHQUFhLEVBQUUsQ0FBQztRQUl6QixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFbkQsTUFBTSxRQUFRLEdBQWEsRUFBRSxDQUFDO1FBQzlCLCtDQUErQztRQUMvQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNwQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsUUFBUSxTQUFTLFFBQVEsZ0JBQWdCLENBQUMsQ0FBQztRQUNyRSxDQUFDLENBQUMsQ0FBQztRQUVILHFDQUFxQztRQUNyQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYTthQUNiLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNkLE9BQU8sSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUN4QixDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFbkMsSUFBSSxDQUFDLFFBQVEsR0FBRzs7VUFFVixRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQzs7eUJBRVosU0FBUzs7O0tBRzdCLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuXG5leHBvcnQgY2xhc3MgQWRkTlByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzOiBzdHJpbmdbXTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdID0gW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Iob3V0cHV0U2hhcGU6IG51bWJlcltdLCBzaGFwZXM6IG51bWJlcltdW10pIHtcbiAgICB0aGlzLm91dHB1dFNoYXBlID0gb3V0cHV0U2hhcGU7XG4gICAgdGhpcy52YXJpYWJsZU5hbWVzID0gc2hhcGVzLm1hcCgoXywgaSkgPT4gYFQke2l9YCk7XG5cbiAgICBjb25zdCBzbmlwcGV0czogc3RyaW5nW10gPSBbXTtcbiAgICAvLyBHZXQgdGFyZ2V0IGVsZW1lbnRzIGZyb20gZXZlcnkgaW5wdXQgdGVuc29yLlxuICAgIHRoaXMudmFyaWFibGVOYW1lcy5mb3JFYWNoKHZhcmlhYmxlID0+IHtcbiAgICAgIHNuaXBwZXRzLnB1c2goYGZsb2F0IHYke3ZhcmlhYmxlfSA9IGdldCR7dmFyaWFibGV9QXRPdXRDb29yZHMoKTtgKTtcbiAgICB9KTtcblxuICAgIC8vIENhbGN1bGF0ZSB0aGUgc3VtIG9mIGFsbCBlbGVtZW50cy5cbiAgICBjb25zdCBvcGVyYXRpb24gPSB0aGlzLnZhcmlhYmxlTmFtZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCh2YXJpYWJsZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGB2JHt2YXJpYWJsZX1gO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAuam9pbignICsgJyk7XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICAke3NuaXBwZXRzLmpvaW4oJ1xcbiAgICAgICAgJyl9XG5cbiAgICAgICAgZmxvYXQgcmVzdWx0ID0gJHtvcGVyYXRpb259O1xuICAgICAgICBzZXRPdXRwdXQocmVzdWx0KTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG4iXX0=