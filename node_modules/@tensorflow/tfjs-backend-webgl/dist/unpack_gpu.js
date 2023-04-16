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
import { useShapeUniforms } from './gpgpu_math';
import { getChannels, getSourceCoords } from './packing_util';
import { getCoordsDataType } from './shader_compiler';
export class UnpackProgram {
    constructor(outputShape) {
        this.variableNames = ['A'];
        this.packedInputs = true;
        this.packedOutput = false;
        this.outputShape = outputShape;
        this.enableShapeUniforms = useShapeUniforms(this.outputShape.length);
        const rank = outputShape.length;
        const channels = getChannels('rc', rank);
        const dtype = getCoordsDataType(rank);
        const sourceCoords = getSourceCoords(rank, channels);
        const innerDims = channels.slice(-2);
        const coords = rank <= 1 ? 'rc' : `vec2(${innerDims.join(',')})`;
        this.userCode = `
      void main() {
        ${dtype} rc = getOutputCoords();
        vec4 packedInput = getA(${sourceCoords});

        setOutput(getChannel(packedInput, ${coords}));
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5wYWNrX2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvdW5wYWNrX2dwdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQWUsZ0JBQWdCLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDNUQsT0FBTyxFQUFDLFdBQVcsRUFBRSxlQUFlLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1RCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUVwRCxNQUFNLE9BQU8sYUFBYTtJQVF4QixZQUFZLFdBQXFCO1FBUGpDLGtCQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQU1uQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsbUJBQW1CLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyRSxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBRWhDLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDekMsTUFBTSxLQUFLLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEMsTUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyRCxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsTUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztRQUVqRSxJQUFJLENBQUMsUUFBUSxHQUFHOztVQUVWLEtBQUs7a0NBQ21CLFlBQVk7OzRDQUVGLE1BQU07O0tBRTdDLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7R1BHUFVQcm9ncmFtLCB1c2VTaGFwZVVuaWZvcm1zfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuaW1wb3J0IHtnZXRDaGFubmVscywgZ2V0U291cmNlQ29vcmRzfSBmcm9tICcuL3BhY2tpbmdfdXRpbCc7XG5pbXBvcnQge2dldENvb3Jkc0RhdGFUeXBlfSBmcm9tICcuL3NoYWRlcl9jb21waWxlcic7XG5cbmV4cG9ydCBjbGFzcyBVbnBhY2tQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsnQSddO1xuICBwYWNrZWRJbnB1dHMgPSB0cnVlO1xuICBwYWNrZWRPdXRwdXQgPSBmYWxzZTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuICBlbmFibGVTaGFwZVVuaWZvcm1zOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKG91dHB1dFNoYXBlOiBudW1iZXJbXSkge1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBvdXRwdXRTaGFwZTtcbiAgICB0aGlzLmVuYWJsZVNoYXBlVW5pZm9ybXMgPSB1c2VTaGFwZVVuaWZvcm1zKHRoaXMub3V0cHV0U2hhcGUubGVuZ3RoKTtcbiAgICBjb25zdCByYW5rID0gb3V0cHV0U2hhcGUubGVuZ3RoO1xuXG4gICAgY29uc3QgY2hhbm5lbHMgPSBnZXRDaGFubmVscygncmMnLCByYW5rKTtcbiAgICBjb25zdCBkdHlwZSA9IGdldENvb3Jkc0RhdGFUeXBlKHJhbmspO1xuICAgIGNvbnN0IHNvdXJjZUNvb3JkcyA9IGdldFNvdXJjZUNvb3JkcyhyYW5rLCBjaGFubmVscyk7XG4gICAgY29uc3QgaW5uZXJEaW1zID0gY2hhbm5lbHMuc2xpY2UoLTIpO1xuICAgIGNvbnN0IGNvb3JkcyA9IHJhbmsgPD0gMSA/ICdyYycgOiBgdmVjMigke2lubmVyRGltcy5qb2luKCcsJyl9KWA7XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICAke2R0eXBlfSByYyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICB2ZWM0IHBhY2tlZElucHV0ID0gZ2V0QSgke3NvdXJjZUNvb3Jkc30pO1xuXG4gICAgICAgIHNldE91dHB1dChnZXRDaGFubmVsKHBhY2tlZElucHV0LCAke2Nvb3Jkc30pKTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG4iXX0=