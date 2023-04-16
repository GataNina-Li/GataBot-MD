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
export class TransposeProgram {
    constructor(aShape, newDim) {
        this.variableNames = ['A'];
        const outputShape = new Array(aShape.length);
        for (let i = 0; i < outputShape.length; i++) {
            outputShape[i] = aShape[newDim[i]];
        }
        this.outputShape = outputShape;
        this.rank = outputShape.length;
        const dtype = getCoordsDataType(this.rank);
        const switched = getSwitchedCoords(newDim);
        this.userCode = `
    void main() {
      ${dtype} resRC = getOutputCoords();
      setOutput(getA(${switched}));
    }
    `;
    }
}
function getSwitchedCoords(newDim) {
    const rank = newDim.length;
    if (rank > 6) {
        throw Error(`Transpose for rank ${rank} is not yet supported`);
    }
    const originalOrder = ['resRC.x', 'resRC.y', 'resRC.z', 'resRC.w', 'resRC.u', 'resRC.v'];
    const switchedCoords = new Array(rank);
    for (let i = 0; i < newDim.length; i++) {
        switchedCoords[newDim[i]] = originalOrder[i];
    }
    return switchedCoords.join();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNwb3NlX2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvdHJhbnNwb3NlX2dwdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFHSCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUVwRCxNQUFNLE9BQU8sZ0JBQWdCO0lBTTNCLFlBQVksTUFBZ0IsRUFBRSxNQUFnQjtRQUw5QyxrQkFBYSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFNcEIsTUFBTSxXQUFXLEdBQWEsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDcEM7UUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFDL0IsTUFBTSxLQUFLLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLE1BQU0sUUFBUSxHQUFHLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTNDLElBQUksQ0FBQyxRQUFRLEdBQUc7O1FBRVosS0FBSzt1QkFDVSxRQUFROztLQUUxQixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxNQUFnQjtJQUN6QyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQzNCLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtRQUNaLE1BQU0sS0FBSyxDQUFDLHNCQUFzQixJQUFJLHVCQUF1QixDQUFDLENBQUM7S0FDaEU7SUFDRCxNQUFNLGFBQWEsR0FDZixDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDdkUsTUFBTSxjQUFjLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdEMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM5QztJQUNELE9BQU8sY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQy9CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuaW1wb3J0IHtnZXRDb29yZHNEYXRhVHlwZX0gZnJvbSAnLi9zaGFkZXJfY29tcGlsZXInO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNwb3NlUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ0EnXTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuICByYW5rOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoYVNoYXBlOiBudW1iZXJbXSwgbmV3RGltOiBudW1iZXJbXSkge1xuICAgIGNvbnN0IG91dHB1dFNoYXBlOiBudW1iZXJbXSA9IG5ldyBBcnJheShhU2hhcGUubGVuZ3RoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dHB1dFNoYXBlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvdXRwdXRTaGFwZVtpXSA9IGFTaGFwZVtuZXdEaW1baV1dO1xuICAgIH1cbiAgICB0aGlzLm91dHB1dFNoYXBlID0gb3V0cHV0U2hhcGU7XG4gICAgdGhpcy5yYW5rID0gb3V0cHV0U2hhcGUubGVuZ3RoO1xuICAgIGNvbnN0IGR0eXBlID0gZ2V0Q29vcmRzRGF0YVR5cGUodGhpcy5yYW5rKTtcbiAgICBjb25zdCBzd2l0Y2hlZCA9IGdldFN3aXRjaGVkQ29vcmRzKG5ld0RpbSk7XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICR7ZHR5cGV9IHJlc1JDID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gICAgICBzZXRPdXRwdXQoZ2V0QSgke3N3aXRjaGVkfSkpO1xuICAgIH1cbiAgICBgO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFN3aXRjaGVkQ29vcmRzKG5ld0RpbTogbnVtYmVyW10pOiBzdHJpbmcge1xuICBjb25zdCByYW5rID0gbmV3RGltLmxlbmd0aDtcbiAgaWYgKHJhbmsgPiA2KSB7XG4gICAgdGhyb3cgRXJyb3IoYFRyYW5zcG9zZSBmb3IgcmFuayAke3Jhbmt9IGlzIG5vdCB5ZXQgc3VwcG9ydGVkYCk7XG4gIH1cbiAgY29uc3Qgb3JpZ2luYWxPcmRlciA9XG4gICAgICBbJ3Jlc1JDLngnLCAncmVzUkMueScsICdyZXNSQy56JywgJ3Jlc1JDLncnLCAncmVzUkMudScsICdyZXNSQy52J107XG4gIGNvbnN0IHN3aXRjaGVkQ29vcmRzID0gbmV3IEFycmF5KHJhbmspO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld0RpbS5sZW5ndGg7IGkrKykge1xuICAgIHN3aXRjaGVkQ29vcmRzW25ld0RpbVtpXV0gPSBvcmlnaW5hbE9yZGVyW2ldO1xuICB9XG4gIHJldHVybiBzd2l0Y2hlZENvb3Jkcy5qb2luKCk7XG59XG4iXX0=