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
export class EncodeFloatPackedProgram {
    constructor(outputShape) {
        this.variableNames = ['A'];
        this.packedInputs = true;
        this.packedOutput = false;
        this.outTexUsage = TextureUsage.DOWNLOAD;
        const glsl = getGlslDifferences();
        this.outputShape = outputShape;
        this.userCode = `
      ${ENCODE_FLOAT_SNIPPET}

      void main() {
        ivec3 coords = getOutputCoords();
        float x = getChannel(getAAtOutCoords(), vec2(coords.y, coords.z));
        ${glsl.output} = encode_float(x);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlX2Zsb2F0X3BhY2tlZF9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2VuY29kZV9mbG9hdF9wYWNrZWRfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRWxELE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzVELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFeEMsTUFBTSxPQUFPLHdCQUF3QjtJQVFuQyxZQUFZLFdBQXFDO1FBUGpELGtCQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUd0QixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUNyQixnQkFBVyxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7UUFHbEMsTUFBTSxJQUFJLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsUUFBUSxHQUFHO1FBQ1osb0JBQW9COzs7OztVQUtsQixJQUFJLENBQUMsTUFBTTs7S0FFaEIsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtnZXRHbHNsRGlmZmVyZW5jZXN9IGZyb20gJy4vZ2xzbF92ZXJzaW9uJztcbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuaW1wb3J0IHtFTkNPREVfRkxPQVRfU05JUFBFVH0gZnJvbSAnLi9zaGFkZXJfY29tcGlsZXJfdXRpbCc7XG5pbXBvcnQge1RleHR1cmVVc2FnZX0gZnJvbSAnLi90ZXhfdXRpbCc7XG5cbmV4cG9ydCBjbGFzcyBFbmNvZGVGbG9hdFBhY2tlZFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWydBJ107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXTtcbiAgcGFja2VkSW5wdXRzID0gdHJ1ZTtcbiAgcGFja2VkT3V0cHV0ID0gZmFsc2U7XG4gIG91dFRleFVzYWdlID0gVGV4dHVyZVVzYWdlLkRPV05MT0FEO1xuXG4gIGNvbnN0cnVjdG9yKG91dHB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pIHtcbiAgICBjb25zdCBnbHNsID0gZ2V0R2xzbERpZmZlcmVuY2VzKCk7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IG91dHB1dFNoYXBlO1xuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICAke0VOQ09ERV9GTE9BVF9TTklQUEVUfVxuXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIGl2ZWMzIGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICBmbG9hdCB4ID0gZ2V0Q2hhbm5lbChnZXRBQXRPdXRDb29yZHMoKSwgdmVjMihjb29yZHMueSwgY29vcmRzLnopKTtcbiAgICAgICAgJHtnbHNsLm91dHB1dH0gPSBlbmNvZGVfZmxvYXQoeCk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuIl19