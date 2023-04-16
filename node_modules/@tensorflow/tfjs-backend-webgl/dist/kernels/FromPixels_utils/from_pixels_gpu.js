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
export class FromPixelsProgram {
    constructor(outputShape) {
        this.variableNames = ['A'];
        const glsl = getGlslDifferences();
        const [height, width,] = outputShape;
        this.outputShape = outputShape;
        this.userCode = `
      void main() {
        ivec3 coords = getOutputCoords();
        int texR = coords[0];
        int texC = coords[1];
        int depth = coords[2];
        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${width}.0, ${height}.0);

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

        setOutput(floor(value * 255.0 + 0.5));
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbV9waXhlbHNfZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9rZXJuZWxzL0Zyb21QaXhlbHNfdXRpbHMvZnJvbV9waXhlbHNfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBR3RELE1BQU0sT0FBTyxpQkFBaUI7SUFLNUIsWUFBWSxXQUFxQjtRQUpqQyxrQkFBYSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFLcEIsTUFBTSxJQUFJLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQztRQUNsQyxNQUFNLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRyxHQUFHLFdBQVcsQ0FBQztRQUN0QyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsUUFBUSxHQUFHOzs7Ozs7dURBTW1DLEtBQUssT0FBTyxNQUFNOzt3QkFFakQsSUFBSSxDQUFDLFNBQVM7Ozs7Ozs7Ozs7Ozs7O0tBY2pDLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7Z2V0R2xzbERpZmZlcmVuY2VzfSBmcm9tICcuLi8uLi9nbHNsX3ZlcnNpb24nO1xuaW1wb3J0IHtHUEdQVVByb2dyYW19IGZyb20gJy4uLy4uL2dwZ3B1X21hdGgnO1xuXG5leHBvcnQgY2xhc3MgRnJvbVBpeGVsc1Byb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWydBJ107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXTtcblxuICBjb25zdHJ1Y3RvcihvdXRwdXRTaGFwZTogbnVtYmVyW10pIHtcbiAgICBjb25zdCBnbHNsID0gZ2V0R2xzbERpZmZlcmVuY2VzKCk7XG4gICAgY29uc3QgW2hlaWdodCwgd2lkdGgsIF0gPSBvdXRwdXRTaGFwZTtcbiAgICB0aGlzLm91dHB1dFNoYXBlID0gb3V0cHV0U2hhcGU7XG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgaXZlYzMgY29vcmRzID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gICAgICAgIGludCB0ZXhSID0gY29vcmRzWzBdO1xuICAgICAgICBpbnQgdGV4QyA9IGNvb3Jkc1sxXTtcbiAgICAgICAgaW50IGRlcHRoID0gY29vcmRzWzJdO1xuICAgICAgICB2ZWMyIHV2ID0gKHZlYzIodGV4QywgdGV4UikgKyBoYWxmQ1IpIC8gdmVjMigke3dpZHRofS4wLCAke2hlaWdodH0uMCk7XG5cbiAgICAgICAgdmVjNCB2YWx1ZXMgPSAke2dsc2wudGV4dHVyZTJEfShBLCB1dik7XG4gICAgICAgIGZsb2F0IHZhbHVlO1xuICAgICAgICBpZiAoZGVwdGggPT0gMCkge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWVzLnI7XG4gICAgICAgIH0gZWxzZSBpZiAoZGVwdGggPT0gMSkge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWVzLmc7XG4gICAgICAgIH0gZWxzZSBpZiAoZGVwdGggPT0gMikge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWVzLmI7XG4gICAgICAgIH0gZWxzZSBpZiAoZGVwdGggPT0gMykge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWVzLmE7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRPdXRwdXQoZmxvb3IodmFsdWUgKiAyNTUuMCArIDAuNSkpO1xuICAgICAgfVxuICAgIGA7XG4gIH1cbn1cbiJdfQ==