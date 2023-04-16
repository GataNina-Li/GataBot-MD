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
import { getGlslDifferences } from './glsl_version';
import { useShapeUniforms } from './gpgpu_math';
import * as shader_util from './shader_compiler_util';
import { PackingScheme } from './tex_util';
export class DecodeMatrixProgram {
    constructor(outputShape) {
        this.variableNames = ['A'];
        this.packedInputs = false;
        this.packedOutput = true;
        this.outPackingScheme = PackingScheme.DENSE;
        this.customUniforms = [{ name: 'texShape', type: 'ivec2' }];
        const glsl = getGlslDifferences();
        this.outputShape = outputShape;
        this.enableShapeUniforms = useShapeUniforms(this.outputShape.length);
        this.userCode = `
      ivec3 outCoordsFromFlatIndex(int index) {
        ${this.enableShapeUniforms ?
            shader_util.getOutputLogicalCoordinatesFromFlatIndexByUniform(['r', 'c', 'd'], outputShape) :
            shader_util.getLogicalCoordinatesFromFlatIndex(['r', 'c', 'd'], outputShape)}
        return ivec3(r, c, d);
      }

      void main() {
        ivec2 resTexRC = ivec2(resultUV.yx * vec2(texShape[0], texShape[1]));
        int index = 4 * (resTexRC.x * texShape[1] + resTexRC.y);

        vec4 result = vec4(0.);

        for (int i=0; i<4; i++) {
          int flatIndex = index + i;
          ivec3 rc = outCoordsFromFlatIndex(flatIndex);
          result[i] = getA(rc.x, rc.y, rc.z);
        }

        ${glsl.output} = result;
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb2RlX21hdHJpeF9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2RlY29kZV9tYXRyaXhfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2xELE9BQU8sRUFBZSxnQkFBZ0IsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUM1RCxPQUFPLEtBQUssV0FBVyxNQUFNLHdCQUF3QixDQUFDO0FBQ3RELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFekMsTUFBTSxPQUFPLG1CQUFtQjtJQVU5QixZQUFZLFdBQXFDO1FBVGpELGtCQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUd0QixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUNyQixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixxQkFBZ0IsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDO1FBRXZDLG1CQUFjLEdBQUcsQ0FBQyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQWdCLEVBQUUsQ0FBQyxDQUFDO1FBRzdELE1BQU0sSUFBSSxHQUFHLGtCQUFrQixFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLG1CQUFtQixHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFckUsSUFBSSxDQUFDLFFBQVEsR0FBRzs7VUFHWixJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUN0QixXQUFXLENBQUMsaURBQWlELENBQ3pELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ25DLFdBQVcsQ0FBQyxrQ0FBa0MsQ0FDMUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLFdBQVcsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztVQWdCbkMsSUFBSSxDQUFDLE1BQU07O0tBRWhCLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7Z2V0R2xzbERpZmZlcmVuY2VzfSBmcm9tICcuL2dsc2xfdmVyc2lvbic7XG5pbXBvcnQge0dQR1BVUHJvZ3JhbSwgdXNlU2hhcGVVbmlmb3Jtc30gZnJvbSAnLi9ncGdwdV9tYXRoJztcbmltcG9ydCAqIGFzIHNoYWRlcl91dGlsIGZyb20gJy4vc2hhZGVyX2NvbXBpbGVyX3V0aWwnO1xuaW1wb3J0IHtQYWNraW5nU2NoZW1lfSBmcm9tICcuL3RleF91dGlsJztcblxuZXhwb3J0IGNsYXNzIERlY29kZU1hdHJpeFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWydBJ107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG4gIG91dHB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XG4gIHBhY2tlZElucHV0cyA9IGZhbHNlO1xuICBwYWNrZWRPdXRwdXQgPSB0cnVlO1xuICBvdXRQYWNraW5nU2NoZW1lID0gUGFja2luZ1NjaGVtZS5ERU5TRTtcbiAgZW5hYmxlU2hhcGVVbmlmb3JtczogYm9vbGVhbjtcbiAgY3VzdG9tVW5pZm9ybXMgPSBbe25hbWU6ICd0ZXhTaGFwZScsIHR5cGU6ICdpdmVjMicgYXMgY29uc3QgfV07XG5cbiAgY29uc3RydWN0b3Iob3V0cHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xuICAgIGNvbnN0IGdsc2wgPSBnZXRHbHNsRGlmZmVyZW5jZXMoKTtcbiAgICB0aGlzLm91dHB1dFNoYXBlID0gb3V0cHV0U2hhcGU7XG4gICAgdGhpcy5lbmFibGVTaGFwZVVuaWZvcm1zID0gdXNlU2hhcGVVbmlmb3Jtcyh0aGlzLm91dHB1dFNoYXBlLmxlbmd0aCk7XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgaXZlYzMgb3V0Q29vcmRzRnJvbUZsYXRJbmRleChpbnQgaW5kZXgpIHtcbiAgICAgICAgJHtcbiAgICAgICAgdGhpcy5lbmFibGVTaGFwZVVuaWZvcm1zID9cbiAgICAgICAgICAgIHNoYWRlcl91dGlsLmdldE91dHB1dExvZ2ljYWxDb29yZGluYXRlc0Zyb21GbGF0SW5kZXhCeVVuaWZvcm0oXG4gICAgICAgICAgICAgICAgWydyJywgJ2MnLCAnZCddLCBvdXRwdXRTaGFwZSkgOlxuICAgICAgICAgICAgc2hhZGVyX3V0aWwuZ2V0TG9naWNhbENvb3JkaW5hdGVzRnJvbUZsYXRJbmRleChcbiAgICAgICAgICAgICAgICBbJ3InLCAnYycsICdkJ10sIG91dHB1dFNoYXBlKX1cbiAgICAgICAgcmV0dXJuIGl2ZWMzKHIsIGMsIGQpO1xuICAgICAgfVxuXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIGl2ZWMyIHJlc1RleFJDID0gaXZlYzIocmVzdWx0VVYueXggKiB2ZWMyKHRleFNoYXBlWzBdLCB0ZXhTaGFwZVsxXSkpO1xuICAgICAgICBpbnQgaW5kZXggPSA0ICogKHJlc1RleFJDLnggKiB0ZXhTaGFwZVsxXSArIHJlc1RleFJDLnkpO1xuXG4gICAgICAgIHZlYzQgcmVzdWx0ID0gdmVjNCgwLik7XG5cbiAgICAgICAgZm9yIChpbnQgaT0wOyBpPDQ7IGkrKykge1xuICAgICAgICAgIGludCBmbGF0SW5kZXggPSBpbmRleCArIGk7XG4gICAgICAgICAgaXZlYzMgcmMgPSBvdXRDb29yZHNGcm9tRmxhdEluZGV4KGZsYXRJbmRleCk7XG4gICAgICAgICAgcmVzdWx0W2ldID0gZ2V0QShyYy54LCByYy55LCByYy56KTtcbiAgICAgICAgfVxuXG4gICAgICAgICR7Z2xzbC5vdXRwdXR9ID0gcmVzdWx0O1xuICAgICAgfVxuICAgIGA7XG4gIH1cbn1cbiJdfQ==