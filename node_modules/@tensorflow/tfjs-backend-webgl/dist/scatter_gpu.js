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
import { getCoordsDataType } from './shader_compiler';
export class ScatterProgram {
    constructor(updateSize, sliceDim, indicesRank, updatesRank, strides, shape, summingDupeIndex = true) {
        this.variableNames = ['updates', 'indices', 'defaultValue'];
        this.outputShape = shape;
        const stridesType = getCoordsDataType(strides.length);
        const dtype = getCoordsDataType(shape.length);
        let indicesString = '';
        if (indicesRank === 1) {
            indicesString = 'i';
        }
        else if (indicesRank === 2) {
            indicesString = 'i, j';
        }
        const indicesSnippet = `getIndices(${indicesString})`;
        let updatesString = '';
        if (updatesRank === 1) {
            updatesString = 'i';
        }
        else if (updatesRank === 2) {
            updatesString = 'i, coords[1]';
        }
        const updatesSnippet = `getUpdates(${updatesString})`;
        const strideString = sliceDim > 1 ? 'strides[j]' : 'strides';
        this.userCode = `
        ${stridesType} strides = ${stridesType}(${strides});

        void main() {
          ${dtype} coords = getOutputCoords();
          float sum = 0.0;
          bool found = false;
          for (int i = 0; i < ${updateSize}; i++) {
            int flattenedIndex = 0;
            for (int j = 0; j < ${sliceDim}; j++) {
              int index = round(${indicesSnippet});
              flattenedIndex += index * ${strideString};
            }
            if (flattenedIndex == coords[0]) {
              sum += ${updatesSnippet};
              found = true;
            }
          }
          setOutput(mix(getDefaultValue(), sum, float(found)));
        }
      `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhdHRlcl9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL3NjYXR0ZXJfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUdILE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRXBELE1BQU0sT0FBTyxjQUFjO0lBS3pCLFlBQ0ksVUFBa0IsRUFBRSxRQUFnQixFQUFFLFdBQW1CLEVBQ3pELFdBQW1CLEVBQUUsT0FBaUIsRUFBRSxLQUFlLEVBQ3ZELGdCQUFnQixHQUFHLElBQUk7UUFQM0Isa0JBQWEsR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFRckQsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDekIsTUFBTSxXQUFXLEdBQUcsaUJBQWlCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RELE1BQU0sS0FBSyxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QyxJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDdkIsSUFBSSxXQUFXLEtBQUssQ0FBQyxFQUFFO1lBQ3JCLGFBQWEsR0FBRyxHQUFHLENBQUM7U0FDckI7YUFBTSxJQUFJLFdBQVcsS0FBSyxDQUFDLEVBQUU7WUFDNUIsYUFBYSxHQUFHLE1BQU0sQ0FBQztTQUN4QjtRQUNELE1BQU0sY0FBYyxHQUFHLGNBQWMsYUFBYSxHQUFHLENBQUM7UUFFdEQsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLElBQUksV0FBVyxLQUFLLENBQUMsRUFBRTtZQUNyQixhQUFhLEdBQUcsR0FBRyxDQUFDO1NBQ3JCO2FBQU0sSUFBSSxXQUFXLEtBQUssQ0FBQyxFQUFFO1lBQzVCLGFBQWEsR0FBRyxjQUFjLENBQUM7U0FDaEM7UUFDRCxNQUFNLGNBQWMsR0FBRyxjQUFjLGFBQWEsR0FBRyxDQUFDO1FBRXRELE1BQU0sWUFBWSxHQUFHLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQzdELElBQUksQ0FBQyxRQUFRLEdBQUc7VUFDVixXQUFXLGNBQWMsV0FBVyxJQUFJLE9BQU87OztZQUc3QyxLQUFLOzs7Z0NBR2UsVUFBVTs7a0NBRVIsUUFBUTtrQ0FDUixjQUFjOzBDQUNOLFlBQVk7Ozt1QkFHL0IsY0FBYzs7Ozs7O09BTTlCLENBQUM7SUFDTixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuaW1wb3J0IHtnZXRDb29yZHNEYXRhVHlwZX0gZnJvbSAnLi9zaGFkZXJfY29tcGlsZXInO1xuXG5leHBvcnQgY2xhc3MgU2NhdHRlclByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWyd1cGRhdGVzJywgJ2luZGljZXMnLCAnZGVmYXVsdFZhbHVlJ107XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXTtcbiAgdXNlckNvZGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHVwZGF0ZVNpemU6IG51bWJlciwgc2xpY2VEaW06IG51bWJlciwgaW5kaWNlc1Jhbms6IG51bWJlcixcbiAgICAgIHVwZGF0ZXNSYW5rOiBudW1iZXIsIHN0cmlkZXM6IG51bWJlcltdLCBzaGFwZTogbnVtYmVyW10sXG4gICAgICBzdW1taW5nRHVwZUluZGV4ID0gdHJ1ZSkge1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBzaGFwZTtcbiAgICBjb25zdCBzdHJpZGVzVHlwZSA9IGdldENvb3Jkc0RhdGFUeXBlKHN0cmlkZXMubGVuZ3RoKTtcbiAgICBjb25zdCBkdHlwZSA9IGdldENvb3Jkc0RhdGFUeXBlKHNoYXBlLmxlbmd0aCk7XG4gICAgbGV0IGluZGljZXNTdHJpbmcgPSAnJztcbiAgICBpZiAoaW5kaWNlc1JhbmsgPT09IDEpIHtcbiAgICAgIGluZGljZXNTdHJpbmcgPSAnaSc7XG4gICAgfSBlbHNlIGlmIChpbmRpY2VzUmFuayA9PT0gMikge1xuICAgICAgaW5kaWNlc1N0cmluZyA9ICdpLCBqJztcbiAgICB9XG4gICAgY29uc3QgaW5kaWNlc1NuaXBwZXQgPSBgZ2V0SW5kaWNlcygke2luZGljZXNTdHJpbmd9KWA7XG5cbiAgICBsZXQgdXBkYXRlc1N0cmluZyA9ICcnO1xuICAgIGlmICh1cGRhdGVzUmFuayA9PT0gMSkge1xuICAgICAgdXBkYXRlc1N0cmluZyA9ICdpJztcbiAgICB9IGVsc2UgaWYgKHVwZGF0ZXNSYW5rID09PSAyKSB7XG4gICAgICB1cGRhdGVzU3RyaW5nID0gJ2ksIGNvb3Jkc1sxXSc7XG4gICAgfVxuICAgIGNvbnN0IHVwZGF0ZXNTbmlwcGV0ID0gYGdldFVwZGF0ZXMoJHt1cGRhdGVzU3RyaW5nfSlgO1xuXG4gICAgY29uc3Qgc3RyaWRlU3RyaW5nID0gc2xpY2VEaW0gPiAxID8gJ3N0cmlkZXNbal0nIDogJ3N0cmlkZXMnO1xuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICAgICR7c3RyaWRlc1R5cGV9IHN0cmlkZXMgPSAke3N0cmlkZXNUeXBlfSgke3N0cmlkZXN9KTtcblxuICAgICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgICAgJHtkdHlwZX0gY29vcmRzID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gICAgICAgICAgZmxvYXQgc3VtID0gMC4wO1xuICAgICAgICAgIGJvb2wgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICBmb3IgKGludCBpID0gMDsgaSA8ICR7dXBkYXRlU2l6ZX07IGkrKykge1xuICAgICAgICAgICAgaW50IGZsYXR0ZW5lZEluZGV4ID0gMDtcbiAgICAgICAgICAgIGZvciAoaW50IGogPSAwOyBqIDwgJHtzbGljZURpbX07IGorKykge1xuICAgICAgICAgICAgICBpbnQgaW5kZXggPSByb3VuZCgke2luZGljZXNTbmlwcGV0fSk7XG4gICAgICAgICAgICAgIGZsYXR0ZW5lZEluZGV4ICs9IGluZGV4ICogJHtzdHJpZGVTdHJpbmd9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZsYXR0ZW5lZEluZGV4ID09IGNvb3Jkc1swXSkge1xuICAgICAgICAgICAgICBzdW0gKz0gJHt1cGRhdGVzU25pcHBldH07XG4gICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0T3V0cHV0KG1peChnZXREZWZhdWx0VmFsdWUoKSwgc3VtLCBmbG9hdChmb3VuZCkpKTtcbiAgICAgICAgfVxuICAgICAgYDtcbiAgfVxufVxuIl19