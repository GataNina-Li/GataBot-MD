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
import { getGlslDifferences } from '../../glsl_version';
export class FromPixelsPackedProgram {
    constructor(outputShape) {
        this.variableNames = ['A'];
        this.packedInputs = false;
        this.packedOutput = true;
        const glsl = getGlslDifferences();
        const [height, width,] = outputShape;
        this.outputShape = outputShape;
        this.userCode = `
      void main() {
        ivec3 coords = getOutputCoords();
        int texR = coords[0];
        int texC = coords[1];
        int depth = coords[2];

        vec4 result = vec4(0.);

        for(int row=0; row<=1; row++) {
          for(int col=0; col<=1; col++) {
            texC = coords[1] + row;
            depth = coords[2] + col;

            vec2 uv = (vec2(texC, texR) + halfCR) /
                       vec2(${width}.0, ${height}.0);
            vec4 values = ${glsl.texture2D}(A, uv);
            float value;
            if (depth == 0) {
              value = values.r;
            } else if (depth == 1) {
              value = values.g;
            } else if (depth == 2) {
              value = values.b;
            } else if (depth == 3) {
              value = values.a;
            }

            result[row * 2 + col] = floor(value * 255.0 + 0.5);
          }
        }

        ${glsl.output} = result;
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbV9waXhlbHNfcGFja2VkX2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMva2VybmVscy9Gcm9tUGl4ZWxzX3V0aWxzL2Zyb21fcGl4ZWxzX3BhY2tlZF9ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHdEQsTUFBTSxPQUFPLHVCQUF1QjtJQU9sQyxZQUFZLFdBQXFCO1FBTmpDLGtCQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUd0QixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUNyQixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUdsQixNQUFNLElBQUksR0FBRyxrQkFBa0IsRUFBRSxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFHLEdBQUcsV0FBVyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxRQUFRLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs4QkFlVSxLQUFLLE9BQU8sTUFBTTs0QkFDcEIsSUFBSSxDQUFDLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7VUFnQmhDLElBQUksQ0FBQyxNQUFNOztLQUVoQixDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2dldEdsc2xEaWZmZXJlbmNlc30gZnJvbSAnLi4vLi4vZ2xzbF92ZXJzaW9uJztcbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuLi8uLi9ncGdwdV9tYXRoJztcblxuZXhwb3J0IGNsYXNzIEZyb21QaXhlbHNQYWNrZWRQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsnQSddO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHBhY2tlZElucHV0cyA9IGZhbHNlO1xuICBwYWNrZWRPdXRwdXQgPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKG91dHB1dFNoYXBlOiBudW1iZXJbXSkge1xuICAgIGNvbnN0IGdsc2wgPSBnZXRHbHNsRGlmZmVyZW5jZXMoKTtcbiAgICBjb25zdCBbaGVpZ2h0LCB3aWR0aCwgXSA9IG91dHB1dFNoYXBlO1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBvdXRwdXRTaGFwZTtcbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICBpdmVjMyBjb29yZHMgPSBnZXRPdXRwdXRDb29yZHMoKTtcbiAgICAgICAgaW50IHRleFIgPSBjb29yZHNbMF07XG4gICAgICAgIGludCB0ZXhDID0gY29vcmRzWzFdO1xuICAgICAgICBpbnQgZGVwdGggPSBjb29yZHNbMl07XG5cbiAgICAgICAgdmVjNCByZXN1bHQgPSB2ZWM0KDAuKTtcblxuICAgICAgICBmb3IoaW50IHJvdz0wOyByb3c8PTE7IHJvdysrKSB7XG4gICAgICAgICAgZm9yKGludCBjb2w9MDsgY29sPD0xOyBjb2wrKykge1xuICAgICAgICAgICAgdGV4QyA9IGNvb3Jkc1sxXSArIHJvdztcbiAgICAgICAgICAgIGRlcHRoID0gY29vcmRzWzJdICsgY29sO1xuXG4gICAgICAgICAgICB2ZWMyIHV2ID0gKHZlYzIodGV4QywgdGV4UikgKyBoYWxmQ1IpIC9cbiAgICAgICAgICAgICAgICAgICAgICAgdmVjMigke3dpZHRofS4wLCAke2hlaWdodH0uMCk7XG4gICAgICAgICAgICB2ZWM0IHZhbHVlcyA9ICR7Z2xzbC50ZXh0dXJlMkR9KEEsIHV2KTtcbiAgICAgICAgICAgIGZsb2F0IHZhbHVlO1xuICAgICAgICAgICAgaWYgKGRlcHRoID09IDApIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZXMucjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVwdGggPT0gMSkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlcy5nO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkZXB0aCA9PSAyKSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gdmFsdWVzLmI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlcHRoID09IDMpIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZXMuYTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzdWx0W3JvdyAqIDIgKyBjb2xdID0gZmxvb3IodmFsdWUgKiAyNTUuMCArIDAuNSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJHtnbHNsLm91dHB1dH0gPSByZXN1bHQ7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuIl19