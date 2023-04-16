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
export class EncodeMatrixProgram {
    constructor(outputShape, inputIsUnsignedByte = false) {
        this.variableNames = ['A'];
        this.customUniforms = [{ name: 'texShape', type: 'ivec2' }];
        const glsl = getGlslDifferences();
        this.outputShape = outputShape;
        this.enableShapeUniforms = useShapeUniforms(this.outputShape.length);
        let output = `result`;
        if (inputIsUnsignedByte) {
            output = `floor(result * 255. + 0.5)`;
        }
        this.userCode = `
      ${this.enableShapeUniforms ? shader_util.getFlatIndexFrom3DOutput() :
            shader_util.getFlatIndexFrom3D(outputShape)}

      void main() {
        ivec3 coords = getOutputCoords();

        int flatIndex = getFlatIndex(coords);
        int offset = imod(flatIndex, 4);

        flatIndex = idiv(flatIndex, 4, 1.);

        int r = flatIndex / texShape[1];
        int c = imod(flatIndex, texShape[1]);
        vec2 uv = (vec2(c, r) + halfCR) / vec2(texShape[1], texShape[0]);
        vec4 values = ${glsl.texture2D}(A, uv);

        float result;

        if(offset == 0) {
          result = values[0];
        } else if(offset == 1) {
          result = values[1];
        } else if(offset == 2) {
          result = values[2];
        } else {
          result = values[3];
        }

        ${glsl.output} = vec4(${output}, 0., 0., 0.);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlX21hdHJpeF9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2VuY29kZV9tYXRyaXhfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2xELE9BQU8sRUFBZSxnQkFBZ0IsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUM1RCxPQUFPLEtBQUssV0FBVyxNQUFNLHdCQUF3QixDQUFDO0FBRXRELE1BQU0sT0FBTyxtQkFBbUI7SUFPOUIsWUFDSSxXQUFxQyxFQUFFLG1CQUFtQixHQUFHLEtBQUs7UUFQdEUsa0JBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBSXRCLG1CQUFjLEdBQUcsQ0FBQyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQWdCLEVBQUUsQ0FBQyxDQUFDO1FBSTdELE1BQU0sSUFBSSxHQUFHLGtCQUFrQixFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLG1CQUFtQixHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFckUsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDO1FBQ3RCLElBQUksbUJBQW1CLEVBQUU7WUFDdkIsTUFBTSxHQUFHLDRCQUE0QixDQUFDO1NBQ3ZDO1FBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRztRQUVaLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixFQUFFLENBQUMsQ0FBQztZQUN4QyxXQUFXLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDOzs7Ozs7Ozs7Ozs7O3dCQWF0RCxJQUFJLENBQUMsU0FBUzs7Ozs7Ozs7Ozs7Ozs7VUFjNUIsSUFBSSxDQUFDLE1BQU0sV0FBVyxNQUFNOztLQUVqQyxDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2dldEdsc2xEaWZmZXJlbmNlc30gZnJvbSAnLi9nbHNsX3ZlcnNpb24nO1xuaW1wb3J0IHtHUEdQVVByb2dyYW0sIHVzZVNoYXBlVW5pZm9ybXN9IGZyb20gJy4vZ3BncHVfbWF0aCc7XG5pbXBvcnQgKiBhcyBzaGFkZXJfdXRpbCBmcm9tICcuL3NoYWRlcl9jb21waWxlcl91dGlsJztcblxuZXhwb3J0IGNsYXNzIEVuY29kZU1hdHJpeFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWydBJ107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXTtcbiAgZW5hYmxlU2hhcGVVbmlmb3JtczogYm9vbGVhbjtcbiAgY3VzdG9tVW5pZm9ybXMgPSBbe25hbWU6ICd0ZXhTaGFwZScsIHR5cGU6ICdpdmVjMicgYXMgY29uc3QgfV07XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBvdXRwdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdLCBpbnB1dElzVW5zaWduZWRCeXRlID0gZmFsc2UpIHtcbiAgICBjb25zdCBnbHNsID0gZ2V0R2xzbERpZmZlcmVuY2VzKCk7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IG91dHB1dFNoYXBlO1xuICAgIHRoaXMuZW5hYmxlU2hhcGVVbmlmb3JtcyA9IHVzZVNoYXBlVW5pZm9ybXModGhpcy5vdXRwdXRTaGFwZS5sZW5ndGgpO1xuXG4gICAgbGV0IG91dHB1dCA9IGByZXN1bHRgO1xuICAgIGlmIChpbnB1dElzVW5zaWduZWRCeXRlKSB7XG4gICAgICBvdXRwdXQgPSBgZmxvb3IocmVzdWx0ICogMjU1LiArIDAuNSlgO1xuICAgIH1cblxuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICAke1xuICAgICAgICB0aGlzLmVuYWJsZVNoYXBlVW5pZm9ybXMgPyBzaGFkZXJfdXRpbC5nZXRGbGF0SW5kZXhGcm9tM0RPdXRwdXQoKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRlcl91dGlsLmdldEZsYXRJbmRleEZyb20zRChvdXRwdXRTaGFwZSl9XG5cbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgaXZlYzMgY29vcmRzID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG5cbiAgICAgICAgaW50IGZsYXRJbmRleCA9IGdldEZsYXRJbmRleChjb29yZHMpO1xuICAgICAgICBpbnQgb2Zmc2V0ID0gaW1vZChmbGF0SW5kZXgsIDQpO1xuXG4gICAgICAgIGZsYXRJbmRleCA9IGlkaXYoZmxhdEluZGV4LCA0LCAxLik7XG5cbiAgICAgICAgaW50IHIgPSBmbGF0SW5kZXggLyB0ZXhTaGFwZVsxXTtcbiAgICAgICAgaW50IGMgPSBpbW9kKGZsYXRJbmRleCwgdGV4U2hhcGVbMV0pO1xuICAgICAgICB2ZWMyIHV2ID0gKHZlYzIoYywgcikgKyBoYWxmQ1IpIC8gdmVjMih0ZXhTaGFwZVsxXSwgdGV4U2hhcGVbMF0pO1xuICAgICAgICB2ZWM0IHZhbHVlcyA9ICR7Z2xzbC50ZXh0dXJlMkR9KEEsIHV2KTtcblxuICAgICAgICBmbG9hdCByZXN1bHQ7XG5cbiAgICAgICAgaWYob2Zmc2V0ID09IDApIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZXNbMF07XG4gICAgICAgIH0gZWxzZSBpZihvZmZzZXQgPT0gMSkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlc1sxXTtcbiAgICAgICAgfSBlbHNlIGlmKG9mZnNldCA9PSAyKSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWVzWzJdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlc1szXTtcbiAgICAgICAgfVxuXG4gICAgICAgICR7Z2xzbC5vdXRwdXR9ID0gdmVjNCgke291dHB1dH0sIDAuLCAwLiwgMC4pO1xuICAgICAgfVxuICAgIGA7XG4gIH1cbn1cbiJdfQ==