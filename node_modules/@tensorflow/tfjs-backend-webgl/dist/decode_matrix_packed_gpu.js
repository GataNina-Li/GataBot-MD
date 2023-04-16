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
export class DecodeMatrixPackedProgram {
    constructor(outputShape) {
        this.variableNames = ['A'];
        this.packedInputs = true;
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
          result[i] = getChannel(getA(rc.x, rc.y, rc.z), vec2(rc.y, rc.z));
        }

        ${glsl.output} = result;
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb2RlX21hdHJpeF9wYWNrZWRfZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9kZWNvZGVfbWF0cml4X3BhY2tlZF9ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEQsT0FBTyxFQUFlLGdCQUFnQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzVELE9BQU8sS0FBSyxXQUFXLE1BQU0sd0JBQXdCLENBQUM7QUFDdEQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUV6QyxNQUFNLE9BQU8seUJBQXlCO0lBVXBDLFlBQVksV0FBcUM7UUFUakQsa0JBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXRCLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBRXBCLHFCQUFnQixHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUM7UUFFdkMsbUJBQWMsR0FBRyxDQUFDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBZ0IsRUFBRSxDQUFDLENBQUM7UUFHN0QsTUFBTSxJQUFJLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsbUJBQW1CLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVyRSxJQUFJLENBQUMsUUFBUSxHQUFHOztVQUdaLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3RCLFdBQVcsQ0FBQyxpREFBaUQsQ0FDekQsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDbkMsV0FBVyxDQUFDLGtDQUFrQyxDQUMxQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsV0FBVyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O1VBZ0JuQyxJQUFJLENBQUMsTUFBTTs7S0FFaEIsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtnZXRHbHNsRGlmZmVyZW5jZXN9IGZyb20gJy4vZ2xzbF92ZXJzaW9uJztcbmltcG9ydCB7R1BHUFVQcm9ncmFtLCB1c2VTaGFwZVVuaWZvcm1zfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuaW1wb3J0ICogYXMgc2hhZGVyX3V0aWwgZnJvbSAnLi9zaGFkZXJfY29tcGlsZXJfdXRpbCc7XG5pbXBvcnQge1BhY2tpbmdTY2hlbWV9IGZyb20gJy4vdGV4X3V0aWwnO1xuXG5leHBvcnQgY2xhc3MgRGVjb2RlTWF0cml4UGFja2VkUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ0EnXTtcbiAgdXNlckNvZGU6IHN0cmluZztcbiAgcGFja2VkSW5wdXRzID0gdHJ1ZTtcbiAgcGFja2VkT3V0cHV0ID0gdHJ1ZTtcbiAgb3V0cHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcbiAgb3V0UGFja2luZ1NjaGVtZSA9IFBhY2tpbmdTY2hlbWUuREVOU0U7XG4gIGVuYWJsZVNoYXBlVW5pZm9ybXM6IGJvb2xlYW47XG4gIGN1c3RvbVVuaWZvcm1zID0gW3tuYW1lOiAndGV4U2hhcGUnLCB0eXBlOiAnaXZlYzInIGFzIGNvbnN0IH1dO1xuXG4gIGNvbnN0cnVjdG9yKG91dHB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pIHtcbiAgICBjb25zdCBnbHNsID0gZ2V0R2xzbERpZmZlcmVuY2VzKCk7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IG91dHB1dFNoYXBlO1xuICAgIHRoaXMuZW5hYmxlU2hhcGVVbmlmb3JtcyA9IHVzZVNoYXBlVW5pZm9ybXModGhpcy5vdXRwdXRTaGFwZS5sZW5ndGgpO1xuXG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgIGl2ZWMzIG91dENvb3Jkc0Zyb21GbGF0SW5kZXgoaW50IGluZGV4KSB7XG4gICAgICAgICR7XG4gICAgICAgIHRoaXMuZW5hYmxlU2hhcGVVbmlmb3JtcyA/XG4gICAgICAgICAgICBzaGFkZXJfdXRpbC5nZXRPdXRwdXRMb2dpY2FsQ29vcmRpbmF0ZXNGcm9tRmxhdEluZGV4QnlVbmlmb3JtKFxuICAgICAgICAgICAgICAgIFsncicsICdjJywgJ2QnXSwgb3V0cHV0U2hhcGUpIDpcbiAgICAgICAgICAgIHNoYWRlcl91dGlsLmdldExvZ2ljYWxDb29yZGluYXRlc0Zyb21GbGF0SW5kZXgoXG4gICAgICAgICAgICAgICAgWydyJywgJ2MnLCAnZCddLCBvdXRwdXRTaGFwZSl9XG4gICAgICAgIHJldHVybiBpdmVjMyhyLCBjLCBkKTtcbiAgICAgIH1cblxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICBpdmVjMiByZXNUZXhSQyA9IGl2ZWMyKHJlc3VsdFVWLnl4ICogdmVjMih0ZXhTaGFwZVswXSwgdGV4U2hhcGVbMV0pKTtcbiAgICAgICAgaW50IGluZGV4ID0gNCAqIChyZXNUZXhSQy54ICogdGV4U2hhcGVbMV0gKyByZXNUZXhSQy55KTtcblxuICAgICAgICB2ZWM0IHJlc3VsdCA9IHZlYzQoMC4pO1xuXG4gICAgICAgIGZvciAoaW50IGk9MDsgaTw0OyBpKyspIHtcbiAgICAgICAgICBpbnQgZmxhdEluZGV4ID0gaW5kZXggKyBpO1xuICAgICAgICAgIGl2ZWMzIHJjID0gb3V0Q29vcmRzRnJvbUZsYXRJbmRleChmbGF0SW5kZXgpO1xuICAgICAgICAgIHJlc3VsdFtpXSA9IGdldENoYW5uZWwoZ2V0QShyYy54LCByYy55LCByYy56KSwgdmVjMihyYy55LCByYy56KSk7XG4gICAgICAgIH1cblxuICAgICAgICAke2dsc2wub3V0cHV0fSA9IHJlc3VsdDtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG4iXX0=