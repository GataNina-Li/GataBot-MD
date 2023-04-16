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
export class MatMulPackedProgram {
    constructor(aShape, bShape, outputShape, transposeA = false, transposeB = false, addBias = false, activation = null, hasPreluActivation = false, hasLeakyreluActivation = false) {
        this.variableNames = ['matrixA', 'matrixB'];
        this.packedInputs = true;
        this.packedOutput = true;
        this.outputShape = outputShape;
        this.enableShapeUniforms = useShapeUniforms(this.outputShape.length);
        const sharedDim = transposeA ? aShape[1] : aShape[2];
        const sharedDimensionPacked = Math.ceil(sharedDim / 2);
        const aSample = transposeA ? 'i * 2, rc.y' : 'rc.y, i * 2';
        const bSample = transposeB ? 'rc.z, i * 2' : 'i * 2, rc.z';
        const aSwizzle = transposeA ? ['a.xxyy', 'a.zzww'] : ['a.xxzz', 'a.yyww'];
        const bSwizzle = transposeB ? ['b.xzxz', 'b.ywyw'] : ['b.xyxy', 'b.zwzw'];
        let activationSnippet = '', applyActivationSnippet = '';
        if (activation) {
            if (hasPreluActivation) {
                activationSnippet = `vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          ${activation}
        }`;
            }
            else if (hasLeakyreluActivation) {
                activationSnippet = `vec4 activation(vec4 a) {
          vec4 b = getLeakyreluAlphaAtOutCoords();
          ${activation}
        }`;
            }
            else {
                activationSnippet = `vec4 activation(vec4 x) {
          ${activation}
        }`;
            }
            applyActivationSnippet = `result = activation(result);`;
        }
        const addBiasSnippet = addBias ? 'result += getBiasAtOutCoords();' : '';
        if (addBias) {
            this.variableNames.push('bias');
        }
        if (hasPreluActivation) {
            this.variableNames.push('preluActivationWeights');
        }
        if (hasLeakyreluActivation) {
            this.variableNames.push('leakyreluAlpha');
        }
        let batchASnippet = 'rc.x';
        let batchBSnippet = 'rc.x';
        if (aShape[0] < bShape[0]) {
            batchASnippet = `int(min(float(rc.x), ${aShape[0] - 1}.))`;
        }
        else if (bShape[0] < aShape[0]) {
            batchBSnippet = `int(min(float(rc.x), ${bShape[0] - 1}.))`;
        }
        this.userCode = `
      ${activationSnippet}
      // Don't use uniform for sharedDimensionPacked for performance.
      const float sharedDimension = ${sharedDimensionPacked}.0;

      vec4 dot2x2ARowBCol(ivec3 rc) {
        vec4 result = vec4(0);
        for (int i = 0; i < ${sharedDimensionPacked}; i++) {
          int batchA = ${batchASnippet};
          int batchB = ${batchBSnippet};
          vec4 a = getMatrixA(batchA, ${aSample});
          vec4 b = getMatrixB(batchB, ${bSample});

          // These swizzled products need to be separately added.
          // See: https://github.com/tensorflow/tfjs/issues/1735
          result += (${aSwizzle[0]} * ${bSwizzle[0]});
          result += (${aSwizzle[1]} * ${bSwizzle[1]});
        }
        return result;
      }

      void main() {
        ivec3 rc = getOutputCoords();
        vec4 result = dot2x2ARowBCol(rc);

        ${addBiasSnippet}

        ${applyActivationSnippet}

        setOutput(result);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsbWF0X3BhY2tlZF9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL211bG1hdF9wYWNrZWRfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBZSxnQkFBZ0IsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUU1RCxNQUFNLE9BQU8sbUJBQW1CO0lBUTlCLFlBQ0ksTUFBZ0MsRUFBRSxNQUFnQyxFQUNsRSxXQUFxQyxFQUFFLFVBQVUsR0FBRyxLQUFLLEVBQ3pELFVBQVUsR0FBRyxLQUFLLEVBQUUsT0FBTyxHQUFHLEtBQUssRUFBRSxhQUFxQixJQUFJLEVBQzlELGtCQUFrQixHQUFHLEtBQUssRUFBRSxzQkFBc0IsR0FBRyxLQUFLO1FBWDlELGtCQUFhLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDdkMsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFVbEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLG1CQUFtQixHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFckUsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxNQUFNLHFCQUFxQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRXZELE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7UUFDM0QsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQztRQUMzRCxNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMxRSxNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUUxRSxJQUFJLGlCQUFpQixHQUFHLEVBQUUsRUFBRSxzQkFBc0IsR0FBRyxFQUFFLENBQUM7UUFDeEQsSUFBSSxVQUFVLEVBQUU7WUFDZCxJQUFJLGtCQUFrQixFQUFFO2dCQUN0QixpQkFBaUIsR0FBRzs7WUFFaEIsVUFBVTtVQUNaLENBQUM7YUFDSjtpQkFBTSxJQUFJLHNCQUFzQixFQUFFO2dCQUNqQyxpQkFBaUIsR0FBRzs7WUFFaEIsVUFBVTtVQUNaLENBQUM7YUFDSjtpQkFBTTtnQkFDTCxpQkFBaUIsR0FBRztZQUNoQixVQUFVO1VBQ1osQ0FBQzthQUNKO1lBRUQsc0JBQXNCLEdBQUcsOEJBQThCLENBQUM7U0FDekQ7UUFFRCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLGlDQUFpQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDeEUsSUFBSSxPQUFPLEVBQUU7WUFDWCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNqQztRQUVELElBQUksa0JBQWtCLEVBQUU7WUFDdEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztTQUNuRDtRQUVELElBQUksc0JBQXNCLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUMzQztRQUVELElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQztRQUMzQixJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUM7UUFDM0IsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3pCLGFBQWEsR0FBRyx3QkFBd0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1NBQzVEO2FBQU0sSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2hDLGFBQWEsR0FBRyx3QkFBd0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1NBQzVEO1FBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRztRQUNaLGlCQUFpQjs7c0NBRWEscUJBQXFCOzs7OzhCQUk3QixxQkFBcUI7eUJBQzFCLGFBQWE7eUJBQ2IsYUFBYTt3Q0FDRSxPQUFPO3dDQUNQLE9BQU87Ozs7dUJBSXhCLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxRQUFRLENBQUMsQ0FBQyxDQUFDO3VCQUM1QixRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sUUFBUSxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7O1VBU3pDLGNBQWM7O1VBRWQsc0JBQXNCOzs7O0tBSTNCLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7R1BHUFVQcm9ncmFtLCB1c2VTaGFwZVVuaWZvcm1zfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuXG5leHBvcnQgY2xhc3MgTWF0TXVsUGFja2VkUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ21hdHJpeEEnLCAnbWF0cml4QiddO1xuICBwYWNrZWRJbnB1dHMgPSB0cnVlO1xuICBwYWNrZWRPdXRwdXQgPSB0cnVlO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG4gIGVuYWJsZVNoYXBlVW5pZm9ybXM6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBhU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSwgYlNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sXG4gICAgICBvdXRwdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdLCB0cmFuc3Bvc2VBID0gZmFsc2UsXG4gICAgICB0cmFuc3Bvc2VCID0gZmFsc2UsIGFkZEJpYXMgPSBmYWxzZSwgYWN0aXZhdGlvbjogc3RyaW5nID0gbnVsbCxcbiAgICAgIGhhc1ByZWx1QWN0aXZhdGlvbiA9IGZhbHNlLCBoYXNMZWFreXJlbHVBY3RpdmF0aW9uID0gZmFsc2UpIHtcbiAgICB0aGlzLm91dHB1dFNoYXBlID0gb3V0cHV0U2hhcGU7XG4gICAgdGhpcy5lbmFibGVTaGFwZVVuaWZvcm1zID0gdXNlU2hhcGVVbmlmb3Jtcyh0aGlzLm91dHB1dFNoYXBlLmxlbmd0aCk7XG5cbiAgICBjb25zdCBzaGFyZWREaW0gPSB0cmFuc3Bvc2VBID8gYVNoYXBlWzFdIDogYVNoYXBlWzJdO1xuICAgIGNvbnN0IHNoYXJlZERpbWVuc2lvblBhY2tlZCA9IE1hdGguY2VpbChzaGFyZWREaW0gLyAyKTtcblxuICAgIGNvbnN0IGFTYW1wbGUgPSB0cmFuc3Bvc2VBID8gJ2kgKiAyLCByYy55JyA6ICdyYy55LCBpICogMic7XG4gICAgY29uc3QgYlNhbXBsZSA9IHRyYW5zcG9zZUIgPyAncmMueiwgaSAqIDInIDogJ2kgKiAyLCByYy56JztcbiAgICBjb25zdCBhU3dpenpsZSA9IHRyYW5zcG9zZUEgPyBbJ2EueHh5eScsICdhLnp6d3cnXSA6IFsnYS54eHp6JywgJ2EueXl3dyddO1xuICAgIGNvbnN0IGJTd2l6emxlID0gdHJhbnNwb3NlQiA/IFsnYi54enh6JywgJ2IueXd5dyddIDogWydiLnh5eHknLCAnYi56d3p3J107XG5cbiAgICBsZXQgYWN0aXZhdGlvblNuaXBwZXQgPSAnJywgYXBwbHlBY3RpdmF0aW9uU25pcHBldCA9ICcnO1xuICAgIGlmIChhY3RpdmF0aW9uKSB7XG4gICAgICBpZiAoaGFzUHJlbHVBY3RpdmF0aW9uKSB7XG4gICAgICAgIGFjdGl2YXRpb25TbmlwcGV0ID0gYHZlYzQgYWN0aXZhdGlvbih2ZWM0IGEpIHtcbiAgICAgICAgICB2ZWM0IGIgPSBnZXRQcmVsdUFjdGl2YXRpb25XZWlnaHRzQXRPdXRDb29yZHMoKTtcbiAgICAgICAgICAke2FjdGl2YXRpb259XG4gICAgICAgIH1gO1xuICAgICAgfSBlbHNlIGlmIChoYXNMZWFreXJlbHVBY3RpdmF0aW9uKSB7XG4gICAgICAgIGFjdGl2YXRpb25TbmlwcGV0ID0gYHZlYzQgYWN0aXZhdGlvbih2ZWM0IGEpIHtcbiAgICAgICAgICB2ZWM0IGIgPSBnZXRMZWFreXJlbHVBbHBoYUF0T3V0Q29vcmRzKCk7XG4gICAgICAgICAgJHthY3RpdmF0aW9ufVxuICAgICAgICB9YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFjdGl2YXRpb25TbmlwcGV0ID0gYHZlYzQgYWN0aXZhdGlvbih2ZWM0IHgpIHtcbiAgICAgICAgICAke2FjdGl2YXRpb259XG4gICAgICAgIH1gO1xuICAgICAgfVxuXG4gICAgICBhcHBseUFjdGl2YXRpb25TbmlwcGV0ID0gYHJlc3VsdCA9IGFjdGl2YXRpb24ocmVzdWx0KTtgO1xuICAgIH1cblxuICAgIGNvbnN0IGFkZEJpYXNTbmlwcGV0ID0gYWRkQmlhcyA/ICdyZXN1bHQgKz0gZ2V0Qmlhc0F0T3V0Q29vcmRzKCk7JyA6ICcnO1xuICAgIGlmIChhZGRCaWFzKSB7XG4gICAgICB0aGlzLnZhcmlhYmxlTmFtZXMucHVzaCgnYmlhcycpO1xuICAgIH1cblxuICAgIGlmIChoYXNQcmVsdUFjdGl2YXRpb24pIHtcbiAgICAgIHRoaXMudmFyaWFibGVOYW1lcy5wdXNoKCdwcmVsdUFjdGl2YXRpb25XZWlnaHRzJyk7XG4gICAgfVxuXG4gICAgaWYgKGhhc0xlYWt5cmVsdUFjdGl2YXRpb24pIHtcbiAgICAgIHRoaXMudmFyaWFibGVOYW1lcy5wdXNoKCdsZWFreXJlbHVBbHBoYScpO1xuICAgIH1cblxuICAgIGxldCBiYXRjaEFTbmlwcGV0ID0gJ3JjLngnO1xuICAgIGxldCBiYXRjaEJTbmlwcGV0ID0gJ3JjLngnO1xuICAgIGlmIChhU2hhcGVbMF0gPCBiU2hhcGVbMF0pIHtcbiAgICAgIGJhdGNoQVNuaXBwZXQgPSBgaW50KG1pbihmbG9hdChyYy54KSwgJHthU2hhcGVbMF0gLSAxfS4pKWA7XG4gICAgfSBlbHNlIGlmIChiU2hhcGVbMF0gPCBhU2hhcGVbMF0pIHtcbiAgICAgIGJhdGNoQlNuaXBwZXQgPSBgaW50KG1pbihmbG9hdChyYy54KSwgJHtiU2hhcGVbMF0gLSAxfS4pKWA7XG4gICAgfVxuXG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgICR7YWN0aXZhdGlvblNuaXBwZXR9XG4gICAgICAvLyBEb24ndCB1c2UgdW5pZm9ybSBmb3Igc2hhcmVkRGltZW5zaW9uUGFja2VkIGZvciBwZXJmb3JtYW5jZS5cbiAgICAgIGNvbnN0IGZsb2F0IHNoYXJlZERpbWVuc2lvbiA9ICR7c2hhcmVkRGltZW5zaW9uUGFja2VkfS4wO1xuXG4gICAgICB2ZWM0IGRvdDJ4MkFSb3dCQ29sKGl2ZWMzIHJjKSB7XG4gICAgICAgIHZlYzQgcmVzdWx0ID0gdmVjNCgwKTtcbiAgICAgICAgZm9yIChpbnQgaSA9IDA7IGkgPCAke3NoYXJlZERpbWVuc2lvblBhY2tlZH07IGkrKykge1xuICAgICAgICAgIGludCBiYXRjaEEgPSAke2JhdGNoQVNuaXBwZXR9O1xuICAgICAgICAgIGludCBiYXRjaEIgPSAke2JhdGNoQlNuaXBwZXR9O1xuICAgICAgICAgIHZlYzQgYSA9IGdldE1hdHJpeEEoYmF0Y2hBLCAke2FTYW1wbGV9KTtcbiAgICAgICAgICB2ZWM0IGIgPSBnZXRNYXRyaXhCKGJhdGNoQiwgJHtiU2FtcGxlfSk7XG5cbiAgICAgICAgICAvLyBUaGVzZSBzd2l6emxlZCBwcm9kdWN0cyBuZWVkIHRvIGJlIHNlcGFyYXRlbHkgYWRkZWQuXG4gICAgICAgICAgLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vdGVuc29yZmxvdy90ZmpzL2lzc3Vlcy8xNzM1XG4gICAgICAgICAgcmVzdWx0ICs9ICgke2FTd2l6emxlWzBdfSAqICR7YlN3aXp6bGVbMF19KTtcbiAgICAgICAgICByZXN1bHQgKz0gKCR7YVN3aXp6bGVbMV19ICogJHtiU3dpenpsZVsxXX0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgaXZlYzMgcmMgPSBnZXRPdXRwdXRDb29yZHMoKTtcbiAgICAgICAgdmVjNCByZXN1bHQgPSBkb3QyeDJBUm93QkNvbChyYyk7XG5cbiAgICAgICAgJHthZGRCaWFzU25pcHBldH1cblxuICAgICAgICAke2FwcGx5QWN0aXZhdGlvblNuaXBwZXR9XG5cbiAgICAgICAgc2V0T3V0cHV0KHJlc3VsdCk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuIl19