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
import { getGlslDifferences } from './glsl_version';
import { useShapeUniforms } from './gpgpu_math';
import * as shader_util from './shader_compiler_util';
/*
This is how the shader encodes a tensor with shape = [2, 3, 5]
(indices are [batch, row, col]).

000|001   002|003   004|xxx   020|021   022|023   024|xxx
-------   -------   -------   -------   -------   -------
010|011   012|013   014|xxx   xxx|xxx   xxx|xxx   xxx|xxx

100|101   102|103   104|xxx   120|121   122|123   124|xxx
-------   -------   -------   -------   -------   -------
110|111   112|113   114|xxx   xxx|xxx   xxx|xxx   xxx|xxx

Single texels contain only values from the same batch, and from adjacent rows
and columns.
 */
export class EncodeMatrixPackedProgram {
    constructor(outputShape, inputIsUnsignedByte = false) {
        this.variableNames = ['A'];
        this.packedInputs = false;
        this.packedOutput = true;
        this.customUniforms = [{ name: 'texShape', type: 'ivec2' }];
        const glsl = getGlslDifferences();
        this.outputShape = outputShape;
        this.enableShapeUniforms = useShapeUniforms(this.outputShape.length);
        let mainLoop = '';
        let output = 'result';
        if (inputIsUnsignedByte) {
            output = 'floor(result * 255. + 0.5)';
        }
        for (let row = 0; row <= 1; row++) {
            for (let col = 0; col <= 1; col++) {
                const channel = row * 2 + col;
                mainLoop += `
          localCoords = coords;
          if(localCoords[2] + ${col} < ${this.enableShapeUniforms ? 'outShape[2]' : `${outputShape[2]}`}) {
          localCoords[2] += ${col};
          if (localCoords[1] + ${row} < ${this.enableShapeUniforms ? 'outShape[1]' : `${outputShape[1]}`}) {
            localCoords[1] += ${row};

            flatIndex = getFlatIndex(localCoords);
            offset = imod(flatIndex, 4);

            flatIndex = idiv(flatIndex, 4, 1.);

            int r = flatIndex / texShape[1];
            int c = imod(flatIndex, texShape[1]);
            vec2 uv = (vec2(c, r) + halfCR) / vec2(texShape[1], texShape[0]);
            values = ${glsl.texture2D}(A, uv);

            if (offset == 0) {
              result[${channel}] = values[0];
            } else if (offset == 1) {
              result[${channel}] = values[1];
            } else if (offset == 2) {
              result[${channel}] = values[2];
            } else {
              result[${channel}] = values[3];
            }
          }
        }
        `;
            }
        }
        this.userCode = `
        ${this.enableShapeUniforms ? shader_util.getFlatIndexFrom3DOutput() :
            shader_util.getFlatIndexFrom3D(outputShape)}

        void main() {
          ivec3 coords = getOutputCoords();

          vec4 result = vec4(0.);
          int flatIndex, r, c, offset;
          ivec3 localCoords;
          vec2 uv;
          vec4 values;

          ${mainLoop}

          ${glsl.output} = ${output};
        }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlX21hdHJpeF9wYWNrZWRfZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9lbmNvZGVfbWF0cml4X3BhY2tlZF9ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEQsT0FBTyxFQUFlLGdCQUFnQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzVELE9BQU8sS0FBSyxXQUFXLE1BQU0sd0JBQXdCLENBQUM7QUFFdEQ7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFFSCxNQUFNLE9BQU8seUJBQXlCO0lBU3BDLFlBQ0ksV0FBcUMsRUFBRSxtQkFBbUIsR0FBRyxLQUFLO1FBVHRFLGtCQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUd0QixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUNyQixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUVwQixtQkFBYyxHQUFHLENBQUMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFnQixFQUFFLENBQUMsQ0FBQztRQUk3RCxNQUFNLElBQUksR0FBRyxrQkFBa0IsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXJFLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNsQixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUM7UUFDdEIsSUFBSSxtQkFBbUIsRUFBRTtZQUN2QixNQUFNLEdBQUcsNEJBQTRCLENBQUM7U0FDdkM7UUFFRCxLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ2pDLEtBQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUU7Z0JBQ2pDLE1BQU0sT0FBTyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUU5QixRQUFRLElBQUk7O2dDQUVZLEdBQUcsTUFDdkIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFOzhCQUM1QyxHQUFHO2lDQUNBLEdBQUcsTUFDeEIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dDQUMxQyxHQUFHOzs7Ozs7Ozs7O3VCQVVaLElBQUksQ0FBQyxTQUFTOzs7dUJBR2QsT0FBTzs7dUJBRVAsT0FBTzs7dUJBRVAsT0FBTzs7dUJBRVAsT0FBTzs7OztTQUlyQixDQUFDO2FBQ0g7U0FDRjtRQUVELElBQUksQ0FBQyxRQUFRLEdBQUc7VUFFWixJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLENBQUM7WUFDeEMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQzs7Ozs7Ozs7Ozs7WUFXbEUsUUFBUTs7WUFFUixJQUFJLENBQUMsTUFBTSxNQUFNLE1BQU07O0tBRTlCLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7Z2V0R2xzbERpZmZlcmVuY2VzfSBmcm9tICcuL2dsc2xfdmVyc2lvbic7XG5pbXBvcnQge0dQR1BVUHJvZ3JhbSwgdXNlU2hhcGVVbmlmb3Jtc30gZnJvbSAnLi9ncGdwdV9tYXRoJztcbmltcG9ydCAqIGFzIHNoYWRlcl91dGlsIGZyb20gJy4vc2hhZGVyX2NvbXBpbGVyX3V0aWwnO1xuXG4vKlxuVGhpcyBpcyBob3cgdGhlIHNoYWRlciBlbmNvZGVzIGEgdGVuc29yIHdpdGggc2hhcGUgPSBbMiwgMywgNV1cbihpbmRpY2VzIGFyZSBbYmF0Y2gsIHJvdywgY29sXSkuXG5cbjAwMHwwMDEgICAwMDJ8MDAzICAgMDA0fHh4eCAgIDAyMHwwMjEgICAwMjJ8MDIzICAgMDI0fHh4eFxuLS0tLS0tLSAgIC0tLS0tLS0gICAtLS0tLS0tICAgLS0tLS0tLSAgIC0tLS0tLS0gICAtLS0tLS0tXG4wMTB8MDExICAgMDEyfDAxMyAgIDAxNHx4eHggICB4eHh8eHh4ICAgeHh4fHh4eCAgIHh4eHx4eHhcblxuMTAwfDEwMSAgIDEwMnwxMDMgICAxMDR8eHh4ICAgMTIwfDEyMSAgIDEyMnwxMjMgICAxMjR8eHh4XG4tLS0tLS0tICAgLS0tLS0tLSAgIC0tLS0tLS0gICAtLS0tLS0tICAgLS0tLS0tLSAgIC0tLS0tLS1cbjExMHwxMTEgICAxMTJ8MTEzICAgMTE0fHh4eCAgIHh4eHx4eHggICB4eHh8eHh4ICAgeHh4fHh4eFxuXG5TaW5nbGUgdGV4ZWxzIGNvbnRhaW4gb25seSB2YWx1ZXMgZnJvbSB0aGUgc2FtZSBiYXRjaCwgYW5kIGZyb20gYWRqYWNlbnQgcm93c1xuYW5kIGNvbHVtbnMuXG4gKi9cblxuZXhwb3J0IGNsYXNzIEVuY29kZU1hdHJpeFBhY2tlZFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWydBJ107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXTtcbiAgcGFja2VkSW5wdXRzID0gZmFsc2U7XG4gIHBhY2tlZE91dHB1dCA9IHRydWU7XG4gIGVuYWJsZVNoYXBlVW5pZm9ybXM6IGJvb2xlYW47XG4gIGN1c3RvbVVuaWZvcm1zID0gW3tuYW1lOiAndGV4U2hhcGUnLCB0eXBlOiAnaXZlYzInIGFzIGNvbnN0IH1dO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgb3V0cHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSwgaW5wdXRJc1Vuc2lnbmVkQnl0ZSA9IGZhbHNlKSB7XG4gICAgY29uc3QgZ2xzbCA9IGdldEdsc2xEaWZmZXJlbmNlcygpO1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBvdXRwdXRTaGFwZTtcbiAgICB0aGlzLmVuYWJsZVNoYXBlVW5pZm9ybXMgPSB1c2VTaGFwZVVuaWZvcm1zKHRoaXMub3V0cHV0U2hhcGUubGVuZ3RoKTtcblxuICAgIGxldCBtYWluTG9vcCA9ICcnO1xuICAgIGxldCBvdXRwdXQgPSAncmVzdWx0JztcbiAgICBpZiAoaW5wdXRJc1Vuc2lnbmVkQnl0ZSkge1xuICAgICAgb3V0cHV0ID0gJ2Zsb29yKHJlc3VsdCAqIDI1NS4gKyAwLjUpJztcbiAgICB9XG5cbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPD0gMTsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8PSAxOyBjb2wrKykge1xuICAgICAgICBjb25zdCBjaGFubmVsID0gcm93ICogMiArIGNvbDtcblxuICAgICAgICBtYWluTG9vcCArPSBgXG4gICAgICAgICAgbG9jYWxDb29yZHMgPSBjb29yZHM7XG4gICAgICAgICAgaWYobG9jYWxDb29yZHNbMl0gKyAke2NvbH0gPCAke1xuICAgICAgICAgICAgdGhpcy5lbmFibGVTaGFwZVVuaWZvcm1zID8gJ291dFNoYXBlWzJdJyA6IGAke291dHB1dFNoYXBlWzJdfWB9KSB7XG4gICAgICAgICAgbG9jYWxDb29yZHNbMl0gKz0gJHtjb2x9O1xuICAgICAgICAgIGlmIChsb2NhbENvb3Jkc1sxXSArICR7cm93fSA8ICR7XG4gICAgICAgICAgICB0aGlzLmVuYWJsZVNoYXBlVW5pZm9ybXMgPyAnb3V0U2hhcGVbMV0nIDogYCR7b3V0cHV0U2hhcGVbMV19YH0pIHtcbiAgICAgICAgICAgIGxvY2FsQ29vcmRzWzFdICs9ICR7cm93fTtcblxuICAgICAgICAgICAgZmxhdEluZGV4ID0gZ2V0RmxhdEluZGV4KGxvY2FsQ29vcmRzKTtcbiAgICAgICAgICAgIG9mZnNldCA9IGltb2QoZmxhdEluZGV4LCA0KTtcblxuICAgICAgICAgICAgZmxhdEluZGV4ID0gaWRpdihmbGF0SW5kZXgsIDQsIDEuKTtcblxuICAgICAgICAgICAgaW50IHIgPSBmbGF0SW5kZXggLyB0ZXhTaGFwZVsxXTtcbiAgICAgICAgICAgIGludCBjID0gaW1vZChmbGF0SW5kZXgsIHRleFNoYXBlWzFdKTtcbiAgICAgICAgICAgIHZlYzIgdXYgPSAodmVjMihjLCByKSArIGhhbGZDUikgLyB2ZWMyKHRleFNoYXBlWzFdLCB0ZXhTaGFwZVswXSk7XG4gICAgICAgICAgICB2YWx1ZXMgPSAke2dsc2wudGV4dHVyZTJEfShBLCB1dik7XG5cbiAgICAgICAgICAgIGlmIChvZmZzZXQgPT0gMCkge1xuICAgICAgICAgICAgICByZXN1bHRbJHtjaGFubmVsfV0gPSB2YWx1ZXNbMF07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9mZnNldCA9PSAxKSB7XG4gICAgICAgICAgICAgIHJlc3VsdFske2NoYW5uZWx9XSA9IHZhbHVlc1sxXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob2Zmc2V0ID09IDIpIHtcbiAgICAgICAgICAgICAgcmVzdWx0WyR7Y2hhbm5lbH1dID0gdmFsdWVzWzJdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzdWx0WyR7Y2hhbm5lbH1dID0gdmFsdWVzWzNdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBgO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICAgICR7XG4gICAgICAgIHRoaXMuZW5hYmxlU2hhcGVVbmlmb3JtcyA/IHNoYWRlcl91dGlsLmdldEZsYXRJbmRleEZyb20zRE91dHB1dCgpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhZGVyX3V0aWwuZ2V0RmxhdEluZGV4RnJvbTNEKG91dHB1dFNoYXBlKX1cblxuICAgICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgICAgaXZlYzMgY29vcmRzID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG5cbiAgICAgICAgICB2ZWM0IHJlc3VsdCA9IHZlYzQoMC4pO1xuICAgICAgICAgIGludCBmbGF0SW5kZXgsIHIsIGMsIG9mZnNldDtcbiAgICAgICAgICBpdmVjMyBsb2NhbENvb3JkcztcbiAgICAgICAgICB2ZWMyIHV2O1xuICAgICAgICAgIHZlYzQgdmFsdWVzO1xuXG4gICAgICAgICAgJHttYWluTG9vcH1cblxuICAgICAgICAgICR7Z2xzbC5vdXRwdXR9ID0gJHtvdXRwdXR9O1xuICAgICAgICB9XG4gICAgYDtcbiAgfVxufVxuIl19