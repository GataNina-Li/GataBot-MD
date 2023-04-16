/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
export class RotateProgram {
    constructor(imageShape, fillValue) {
        this.variableNames = ['Image'];
        this.outputShape = [];
        this.customUniforms = [{ name: 'params', type: 'vec4' }];
        const imageHeight = imageShape[1];
        const imageWidth = imageShape[2];
        this.outputShape = imageShape;
        let fillSnippet = '';
        if (typeof fillValue === 'number') {
            fillSnippet = `float outputValue = ${fillValue.toFixed(2)};`;
        }
        else {
            fillSnippet = `
        vec3 fill = vec3(${fillValue.join(',')});
        float outputValue = fill[coords[3]];`;
        }
        this.userCode = `
        void main() {
          ivec4 coords = getOutputCoords();
          int x = coords[2];
          int y = coords[1];
          float coordXFloat = (float(x) - params[0]) * params[3] -
            (float(y) - params[1]) * params[2];
          float coordYFloat = (float(x) - params[0]) * params[2] +
            (float(y) - params[1]) * params[3];
          int coordX = int(round(coordXFloat + params[0]));
          int coordY = int(round(coordYFloat + params[1]));
          ${fillSnippet}
          if(coordX >= 0 && coordX < ${imageWidth} && coordY >= 0 && coordY < ${imageHeight}) {
            outputValue = getImage(coords[0], coordY, coordX, coords[3]);
          }
          setOutput(outputValue);
        }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm90YXRlX2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvcm90YXRlX2dwdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFLSCxNQUFNLE9BQU8sYUFBYTtJQUt4QixZQUNJLFVBQTRDLEVBQzVDLFNBQTBDO1FBTjlDLGtCQUFhLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxQixnQkFBVyxHQUFhLEVBQUUsQ0FBQztRQUUzQixtQkFBYyxHQUFHLENBQUMsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFxQixFQUFDLENBQUMsQ0FBQztRQUkvRCxNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBRTlCLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUNyQixJQUFJLE9BQU8sU0FBUyxLQUFLLFFBQVEsRUFBRTtZQUNqQyxXQUFXLEdBQUcsdUJBQXVCLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztTQUM5RDthQUFNO1lBQ0wsV0FBVyxHQUFHOzJCQUNPLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDOzZDQUNELENBQUM7U0FDekM7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHOzs7Ozs7Ozs7OztZQVdSLFdBQVc7dUNBQ2dCLFVBQVUsK0JBQ3pDLFdBQVc7Ozs7O0tBS2QsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtHUEdQVVByb2dyYW19IGZyb20gJy4vZ3BncHVfbWF0aCc7XG5pbXBvcnQge1VuaWZvcm1UeXBlfSBmcm9tICcuL3NoYWRlcl9jb21waWxlcic7XG5cbmV4cG9ydCBjbGFzcyBSb3RhdGVQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsnSW1hZ2UnXTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdID0gW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG4gIGN1c3RvbVVuaWZvcm1zID0gW3tuYW1lOiAncGFyYW1zJywgdHlwZTogJ3ZlYzQnIGFzIFVuaWZvcm1UeXBlfV07XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgaW1hZ2VTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sXG4gICAgICBmaWxsVmFsdWU6IG51bWJlcnxbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pIHtcbiAgICBjb25zdCBpbWFnZUhlaWdodCA9IGltYWdlU2hhcGVbMV07XG4gICAgY29uc3QgaW1hZ2VXaWR0aCA9IGltYWdlU2hhcGVbMl07XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IGltYWdlU2hhcGU7XG5cbiAgICBsZXQgZmlsbFNuaXBwZXQgPSAnJztcbiAgICBpZiAodHlwZW9mIGZpbGxWYWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGZpbGxTbmlwcGV0ID0gYGZsb2F0IG91dHB1dFZhbHVlID0gJHtmaWxsVmFsdWUudG9GaXhlZCgyKX07YDtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsbFNuaXBwZXQgPSBgXG4gICAgICAgIHZlYzMgZmlsbCA9IHZlYzMoJHtmaWxsVmFsdWUuam9pbignLCcpfSk7XG4gICAgICAgIGZsb2F0IG91dHB1dFZhbHVlID0gZmlsbFtjb29yZHNbM11dO2A7XG4gICAgfVxuXG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICAgIGl2ZWM0IGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICAgIGludCB4ID0gY29vcmRzWzJdO1xuICAgICAgICAgIGludCB5ID0gY29vcmRzWzFdO1xuICAgICAgICAgIGZsb2F0IGNvb3JkWEZsb2F0ID0gKGZsb2F0KHgpIC0gcGFyYW1zWzBdKSAqIHBhcmFtc1szXSAtXG4gICAgICAgICAgICAoZmxvYXQoeSkgLSBwYXJhbXNbMV0pICogcGFyYW1zWzJdO1xuICAgICAgICAgIGZsb2F0IGNvb3JkWUZsb2F0ID0gKGZsb2F0KHgpIC0gcGFyYW1zWzBdKSAqIHBhcmFtc1syXSArXG4gICAgICAgICAgICAoZmxvYXQoeSkgLSBwYXJhbXNbMV0pICogcGFyYW1zWzNdO1xuICAgICAgICAgIGludCBjb29yZFggPSBpbnQocm91bmQoY29vcmRYRmxvYXQgKyBwYXJhbXNbMF0pKTtcbiAgICAgICAgICBpbnQgY29vcmRZID0gaW50KHJvdW5kKGNvb3JkWUZsb2F0ICsgcGFyYW1zWzFdKSk7XG4gICAgICAgICAgJHtmaWxsU25pcHBldH1cbiAgICAgICAgICBpZihjb29yZFggPj0gMCAmJiBjb29yZFggPCAke2ltYWdlV2lkdGh9ICYmIGNvb3JkWSA+PSAwICYmIGNvb3JkWSA8ICR7XG4gICAgICAgIGltYWdlSGVpZ2h0fSkge1xuICAgICAgICAgICAgb3V0cHV0VmFsdWUgPSBnZXRJbWFnZShjb29yZHNbMF0sIGNvb3JkWSwgY29vcmRYLCBjb29yZHNbM10pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZXRPdXRwdXQob3V0cHV0VmFsdWUpO1xuICAgICAgICB9XG4gICAgYDtcbiAgfVxufVxuIl19