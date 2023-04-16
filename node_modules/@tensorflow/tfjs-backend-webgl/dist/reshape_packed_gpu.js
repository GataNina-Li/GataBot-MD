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
import * as shader_util from './shader_compiler_util';
export class ReshapePackedProgram {
    constructor(outputShape, inputShape) {
        this.variableNames = ['A'];
        this.packedInputs = true;
        this.packedOutput = true;
        this.customUniforms = [{ name: 'inputShape', type: 'ivec3' }];
        this.outputShape = outputShape;
        this.enableShapeUniforms = useShapeUniforms(this.outputShape.length);
        let mainLoop = ``;
        for (let i = 0; i < 4; i++) {
            let thisRC = `thisRC = rc;`;
            if (i % 2 === 1) {
                thisRC += `thisRC.z += 1;`;
            }
            if (i > 1) {
                thisRC += `thisRC.y += 1;`;
            }
            mainLoop += `
        ${thisRC}
        ${i > 0 ? `if(thisRC.y < rows && thisRC.z < cols){` : ''}
          int flatIndex = getFlatIndex(thisRC);

          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flatIndex);
          vec2 inputRCInnerDims = vec2(float(inputRC.y),float(inputRC.z));

          result[${i}] =
            getChannel(getA(inputRC.x, inputRC.y, inputRC.z), inputRCInnerDims);
        ${i > 0 ? '}' : ''}
      `;
        }
        this.userCode = `
      ${getReshapedInputCoords(inputShape, this.enableShapeUniforms)}
      ${this.enableShapeUniforms ? shader_util.getFlatIndexFrom3DOutput() :
            shader_util.getFlatIndexFrom3D(outputShape)}

      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0.);

        ivec3 thisRC;
        int rows = ${this.enableShapeUniforms ? 'outShape[1]' : outputShape[1]};
        int cols = ${this.enableShapeUniforms ? 'outShape[2]' : outputShape[2]};

        ${mainLoop}

        setOutput(result);
      }
    `;
    }
}
function getReshapedInputCoords(shape, enableShapeUniforms) {
    const coordsFromIndexSnippet = enableShapeUniforms ?
        shader_util.getLogicalCoordinatesFromFlatIndexByUniform(['r', 'c', 'd'], 'inputShape') :
        shader_util.getLogicalCoordinatesFromFlatIndex(['r', 'c', 'd'], shape);
    return `
    ivec3 inputCoordsFromReshapedOutCoords(int index) {
      ${coordsFromIndexSnippet}
      return ivec3(r, c, d);
    }
  `;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaGFwZV9wYWNrZWRfZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9yZXNoYXBlX3BhY2tlZF9ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFlLGdCQUFnQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzVELE9BQU8sS0FBSyxXQUFXLE1BQU0sd0JBQXdCLENBQUM7QUFFdEQsTUFBTSxPQUFPLG9CQUFvQjtJQVMvQixZQUFZLFdBQXFDLEVBQUUsVUFFbEQ7UUFWRCxrQkFBYSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFJcEIsbUJBQWMsR0FBRyxDQUFDLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsT0FBZ0IsRUFBRSxDQUFDLENBQUM7UUFLL0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLG1CQUFtQixHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFckUsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDMUIsSUFBSSxNQUFNLEdBQUcsY0FBYyxDQUFDO1lBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ2YsTUFBTSxJQUFJLGdCQUFnQixDQUFDO2FBQzVCO1lBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNULE1BQU0sSUFBSSxnQkFBZ0IsQ0FBQzthQUM1QjtZQUVELFFBQVEsSUFBSTtVQUNSLE1BQU07VUFDTixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDLENBQUMsRUFBRTs7Ozs7O21CQU03QyxDQUFDOztVQUVWLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtPQUNuQixDQUFDO1NBQ0g7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHO1FBQ1osc0JBQXNCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztRQUU1RCxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLENBQUM7WUFDeEMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQzs7Ozs7Ozs7cUJBUXpELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO3FCQUN6RCxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzs7VUFFcEUsUUFBUTs7OztLQUliLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFFRCxTQUFTLHNCQUFzQixDQUMzQixLQUErQixFQUFFLG1CQUE0QjtJQUMvRCxNQUFNLHNCQUFzQixHQUFHLG1CQUFtQixDQUFDLENBQUM7UUFDaEQsV0FBVyxDQUFDLDJDQUEyQyxDQUNuRCxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUNwQyxXQUFXLENBQUMsa0NBQWtDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRTNFLE9BQU87O1FBRUQsc0JBQXNCOzs7R0FHM0IsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7R1BHUFVQcm9ncmFtLCB1c2VTaGFwZVVuaWZvcm1zfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuaW1wb3J0ICogYXMgc2hhZGVyX3V0aWwgZnJvbSAnLi9zaGFkZXJfY29tcGlsZXJfdXRpbCc7XG5cbmV4cG9ydCBjbGFzcyBSZXNoYXBlUGFja2VkUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ0EnXTtcbiAgcGFja2VkSW5wdXRzID0gdHJ1ZTtcbiAgcGFja2VkT3V0cHV0ID0gdHJ1ZTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuICBlbmFibGVTaGFwZVVuaWZvcm1zOiBib29sZWFuO1xuICBjdXN0b21Vbmlmb3JtcyA9IFt7bmFtZTogJ2lucHV0U2hhcGUnLCB0eXBlOiAnaXZlYzMnIGFzIGNvbnN0IH1dO1xuXG4gIGNvbnN0cnVjdG9yKG91dHB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sIGlucHV0U2hhcGU6IFtcbiAgICBudW1iZXIsIG51bWJlciwgbnVtYmVyXG4gIF0pIHtcbiAgICB0aGlzLm91dHB1dFNoYXBlID0gb3V0cHV0U2hhcGU7XG4gICAgdGhpcy5lbmFibGVTaGFwZVVuaWZvcm1zID0gdXNlU2hhcGVVbmlmb3Jtcyh0aGlzLm91dHB1dFNoYXBlLmxlbmd0aCk7XG5cbiAgICBsZXQgbWFpbkxvb3AgPSBgYDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgbGV0IHRoaXNSQyA9IGB0aGlzUkMgPSByYztgO1xuICAgICAgaWYgKGkgJSAyID09PSAxKSB7XG4gICAgICAgIHRoaXNSQyArPSBgdGhpc1JDLnogKz0gMTtgO1xuICAgICAgfVxuICAgICAgaWYgKGkgPiAxKSB7XG4gICAgICAgIHRoaXNSQyArPSBgdGhpc1JDLnkgKz0gMTtgO1xuICAgICAgfVxuXG4gICAgICBtYWluTG9vcCArPSBgXG4gICAgICAgICR7dGhpc1JDfVxuICAgICAgICAke2kgPiAwID8gYGlmKHRoaXNSQy55IDwgcm93cyAmJiB0aGlzUkMueiA8IGNvbHMpe2AgOiAnJ31cbiAgICAgICAgICBpbnQgZmxhdEluZGV4ID0gZ2V0RmxhdEluZGV4KHRoaXNSQyk7XG5cbiAgICAgICAgICBpdmVjMyBpbnB1dFJDID0gaW5wdXRDb29yZHNGcm9tUmVzaGFwZWRPdXRDb29yZHMoZmxhdEluZGV4KTtcbiAgICAgICAgICB2ZWMyIGlucHV0UkNJbm5lckRpbXMgPSB2ZWMyKGZsb2F0KGlucHV0UkMueSksZmxvYXQoaW5wdXRSQy56KSk7XG5cbiAgICAgICAgICByZXN1bHRbJHtpfV0gPVxuICAgICAgICAgICAgZ2V0Q2hhbm5lbChnZXRBKGlucHV0UkMueCwgaW5wdXRSQy55LCBpbnB1dFJDLnopLCBpbnB1dFJDSW5uZXJEaW1zKTtcbiAgICAgICAgJHtpID4gMCA/ICd9JyA6ICcnfVxuICAgICAgYDtcbiAgICB9XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgJHtnZXRSZXNoYXBlZElucHV0Q29vcmRzKGlucHV0U2hhcGUsIHRoaXMuZW5hYmxlU2hhcGVVbmlmb3Jtcyl9XG4gICAgICAke1xuICAgICAgICB0aGlzLmVuYWJsZVNoYXBlVW5pZm9ybXMgPyBzaGFkZXJfdXRpbC5nZXRGbGF0SW5kZXhGcm9tM0RPdXRwdXQoKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRlcl91dGlsLmdldEZsYXRJbmRleEZyb20zRChvdXRwdXRTaGFwZSl9XG5cbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgaXZlYzMgcmMgPSBnZXRPdXRwdXRDb29yZHMoKTtcblxuICAgICAgICB2ZWM0IHJlc3VsdCA9IHZlYzQoMC4pO1xuXG4gICAgICAgIGl2ZWMzIHRoaXNSQztcbiAgICAgICAgaW50IHJvd3MgPSAke3RoaXMuZW5hYmxlU2hhcGVVbmlmb3JtcyA/ICdvdXRTaGFwZVsxXScgOiBvdXRwdXRTaGFwZVsxXX07XG4gICAgICAgIGludCBjb2xzID0gJHt0aGlzLmVuYWJsZVNoYXBlVW5pZm9ybXMgPyAnb3V0U2hhcGVbMl0nIDogb3V0cHV0U2hhcGVbMl19O1xuXG4gICAgICAgICR7bWFpbkxvb3B9XG5cbiAgICAgICAgc2V0T3V0cHV0KHJlc3VsdCk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRSZXNoYXBlZElucHV0Q29vcmRzKFxuICAgIHNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sIGVuYWJsZVNoYXBlVW5pZm9ybXM6IGJvb2xlYW4pOiBzdHJpbmcge1xuICBjb25zdCBjb29yZHNGcm9tSW5kZXhTbmlwcGV0ID0gZW5hYmxlU2hhcGVVbmlmb3JtcyA/XG4gICAgICBzaGFkZXJfdXRpbC5nZXRMb2dpY2FsQ29vcmRpbmF0ZXNGcm9tRmxhdEluZGV4QnlVbmlmb3JtKFxuICAgICAgICAgIFsncicsICdjJywgJ2QnXSwgJ2lucHV0U2hhcGUnKSA6XG4gICAgICBzaGFkZXJfdXRpbC5nZXRMb2dpY2FsQ29vcmRpbmF0ZXNGcm9tRmxhdEluZGV4KFsncicsICdjJywgJ2QnXSwgc2hhcGUpO1xuXG4gIHJldHVybiBgXG4gICAgaXZlYzMgaW5wdXRDb29yZHNGcm9tUmVzaGFwZWRPdXRDb29yZHMoaW50IGluZGV4KSB7XG4gICAgICAke2Nvb3Jkc0Zyb21JbmRleFNuaXBwZXR9XG4gICAgICByZXR1cm4gaXZlYzMociwgYywgZCk7XG4gICAgfVxuICBgO1xufVxuIl19