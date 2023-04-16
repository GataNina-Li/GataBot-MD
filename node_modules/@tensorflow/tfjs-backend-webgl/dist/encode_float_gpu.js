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
import { ENCODE_FLOAT_SNIPPET } from './shader_compiler_util';
import { TextureUsage } from './tex_util';
export class EncodeFloatProgram {
    constructor(outputShape) {
        this.variableNames = ['A'];
        this.outTexUsage = TextureUsage.DOWNLOAD;
        const glsl = getGlslDifferences();
        this.outputShape = outputShape;
        this.userCode = `
      ${ENCODE_FLOAT_SNIPPET}

      void main() {
        float x = getAAtOutCoords();
        ${glsl.output} = encode_float(x);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlX2Zsb2F0X2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvZW5jb2RlX2Zsb2F0X2dwdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVsRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUM1RCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRXhDLE1BQU0sT0FBTyxrQkFBa0I7SUFNN0IsWUFBWSxXQUFxQjtRQUxqQyxrQkFBYSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFHdEIsZ0JBQVcsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO1FBR2xDLE1BQU0sSUFBSSxHQUFHLGtCQUFrQixFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRztRQUNaLG9CQUFvQjs7OztVQUlsQixJQUFJLENBQUMsTUFBTTs7S0FFaEIsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtnZXRHbHNsRGlmZmVyZW5jZXN9IGZyb20gJy4vZ2xzbF92ZXJzaW9uJztcbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuaW1wb3J0IHtFTkNPREVfRkxPQVRfU05JUFBFVH0gZnJvbSAnLi9zaGFkZXJfY29tcGlsZXJfdXRpbCc7XG5pbXBvcnQge1RleHR1cmVVc2FnZX0gZnJvbSAnLi90ZXhfdXRpbCc7XG5cbmV4cG9ydCBjbGFzcyBFbmNvZGVGbG9hdFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWydBJ107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXTtcbiAgb3V0VGV4VXNhZ2UgPSBUZXh0dXJlVXNhZ2UuRE9XTkxPQUQ7XG5cbiAgY29uc3RydWN0b3Iob3V0cHV0U2hhcGU6IG51bWJlcltdKSB7XG4gICAgY29uc3QgZ2xzbCA9IGdldEdsc2xEaWZmZXJlbmNlcygpO1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBvdXRwdXRTaGFwZTtcbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgJHtFTkNPREVfRkxPQVRfU05JUFBFVH1cblxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICBmbG9hdCB4ID0gZ2V0QUF0T3V0Q29vcmRzKCk7XG4gICAgICAgICR7Z2xzbC5vdXRwdXR9ID0gZW5jb2RlX2Zsb2F0KHgpO1xuICAgICAgfVxuICAgIGA7XG4gIH1cbn1cbiJdfQ==