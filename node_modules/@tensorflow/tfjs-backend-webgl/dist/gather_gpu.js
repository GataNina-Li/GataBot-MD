/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
export class GatherProgram {
    constructor(aShape, outputShape) {
        this.variableNames = ['A', 'indices'];
        this.outputShape = outputShape;
        this.rank = outputShape.length;
        const dtype = getCoordsDataType(this.rank);
        const sourceCoords = getSourceCoords(aShape, 2);
        this.userCode = `
      void main() {
        ${dtype} resRC = getOutputCoords();
        int index = int(getIndices(resRC.x, resRC.z));
        float inBounds = (index >= 0) && (index < ${aShape[2]}) ? 1.0 : 0.0;
        setOutput(inBounds * getA(${sourceCoords}));
      }
    `;
    }
}
// The input and output are always flattened into rank 4 tensors.
function getSourceCoords(aShape, axis) {
    const currentCoords = ['resRC.x', 'resRC.y', 'resRC.z', 'resRC.w'];
    const sourceCoords = [];
    for (let i = 0; i < aShape.length; i++) {
        if (i === 2) {
            sourceCoords.push('index');
        }
        else {
            sourceCoords.push(`${currentCoords[i]}`);
        }
    }
    return sourceCoords.join();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2F0aGVyX2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvZ2F0aGVyX2dwdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFHSCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUlwRCxNQUFNLE9BQU8sYUFBYTtJQU14QixZQUFZLE1BQW1CLEVBQUUsV0FBd0I7UUFMekQsa0JBQWEsR0FBRyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztRQU0vQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFDL0IsTUFBTSxLQUFLLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLE1BQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFaEQsSUFBSSxDQUFDLFFBQVEsR0FBRzs7VUFFVixLQUFLOztvREFFcUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQ0FDekIsWUFBWTs7S0FFM0MsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQUVELGlFQUFpRTtBQUNqRSxTQUFTLGVBQWUsQ0FBQyxNQUFtQixFQUFFLElBQVk7SUFDeEQsTUFBTSxhQUFhLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUVuRSxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7SUFDeEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ1gsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM1QjthQUFNO1lBQ0wsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDMUM7S0FDRjtJQUNELE9BQU8sWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuaW1wb3J0IHtnZXRDb29yZHNEYXRhVHlwZX0gZnJvbSAnLi9zaGFkZXJfY29tcGlsZXInO1xuXG5leHBvcnQgdHlwZSBHYXRoZXJTaGFwZSA9IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdO1xuXG5leHBvcnQgY2xhc3MgR2F0aGVyUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ0EnLCAnaW5kaWNlcyddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG4gIHJhbms6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihhU2hhcGU6IEdhdGhlclNoYXBlLCBvdXRwdXRTaGFwZTogR2F0aGVyU2hhcGUpIHtcbiAgICB0aGlzLm91dHB1dFNoYXBlID0gb3V0cHV0U2hhcGU7XG4gICAgdGhpcy5yYW5rID0gb3V0cHV0U2hhcGUubGVuZ3RoO1xuICAgIGNvbnN0IGR0eXBlID0gZ2V0Q29vcmRzRGF0YVR5cGUodGhpcy5yYW5rKTtcbiAgICBjb25zdCBzb3VyY2VDb29yZHMgPSBnZXRTb3VyY2VDb29yZHMoYVNoYXBlLCAyKTtcblxuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgICR7ZHR5cGV9IHJlc1JDID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gICAgICAgIGludCBpbmRleCA9IGludChnZXRJbmRpY2VzKHJlc1JDLngsIHJlc1JDLnopKTtcbiAgICAgICAgZmxvYXQgaW5Cb3VuZHMgPSAoaW5kZXggPj0gMCkgJiYgKGluZGV4IDwgJHthU2hhcGVbMl19KSA/IDEuMCA6IDAuMDtcbiAgICAgICAgc2V0T3V0cHV0KGluQm91bmRzICogZ2V0QSgke3NvdXJjZUNvb3Jkc30pKTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG5cbi8vIFRoZSBpbnB1dCBhbmQgb3V0cHV0IGFyZSBhbHdheXMgZmxhdHRlbmVkIGludG8gcmFuayA0IHRlbnNvcnMuXG5mdW5jdGlvbiBnZXRTb3VyY2VDb29yZHMoYVNoYXBlOiBHYXRoZXJTaGFwZSwgYXhpczogbnVtYmVyKTogc3RyaW5nIHtcbiAgY29uc3QgY3VycmVudENvb3JkcyA9IFsncmVzUkMueCcsICdyZXNSQy55JywgJ3Jlc1JDLnonLCAncmVzUkMudyddO1xuXG4gIGNvbnN0IHNvdXJjZUNvb3JkcyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGFTaGFwZS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChpID09PSAyKSB7XG4gICAgICBzb3VyY2VDb29yZHMucHVzaCgnaW5kZXgnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc291cmNlQ29vcmRzLnB1c2goYCR7Y3VycmVudENvb3Jkc1tpXX1gKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNvdXJjZUNvb3Jkcy5qb2luKCk7XG59XG4iXX0=