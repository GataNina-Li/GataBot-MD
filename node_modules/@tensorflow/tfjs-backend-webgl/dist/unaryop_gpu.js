/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
export class UnaryOpProgram {
    constructor(aShape, opSnippet) {
        this.variableNames = ['A'];
        this.outputShape = aShape;
        this.enableShapeUniforms = useShapeUniforms(this.outputShape.length);
        this.userCode = `
      float unaryOperation(float x) {
        ${opSnippet}
      }

      void main() {
        float x = getAAtOutCoords();
        float y = unaryOperation(x);

        setOutput(y);
      }
    `;
    }
}
export const CHECK_NAN_SNIPPET = `if (isnan(x)) return x;`;
export const LINEAR = `return x;`;
export const ABS = `return abs(x);`;
export function STEP(alpha = 0.0) {
    return CHECK_NAN_SNIPPET + `
    return x > 0.0 ? 1.0 : float(${alpha});
  `;
}
export const ELU = `return (x >= 0.0) ? x : (exp(x) - 1.0);`;
export const RELU = CHECK_NAN_SNIPPET + `
  return (x < 0.0) ? 0.0 : x;
`;
export const RELU6 = CHECK_NAN_SNIPPET + `
  return (x < 0.0) ? 0.0 : min(6.0, x);
`;
export const CLONE = 'return x;';
export const SIGMOID = `return 1.0 / (1.0 + exp(-1.0 * x));`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5hcnlvcF9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL3VuYXJ5b3BfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBZSxnQkFBZ0IsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUU1RCxNQUFNLE9BQU8sY0FBYztJQU16QixZQUFZLE1BQWdCLEVBQUUsU0FBaUI7UUFML0Msa0JBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBTXBCLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1FBQzFCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxRQUFRLEdBQUc7O1VBRVYsU0FBUzs7Ozs7Ozs7O0tBU2QsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQUVELE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLHlCQUF5QixDQUFDO0FBRTNELE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUM7QUFFbEMsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLGdCQUFnQixDQUFDO0FBRXBDLE1BQU0sVUFBVSxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUc7SUFDOUIsT0FBTyxpQkFBaUIsR0FBRzttQ0FDTSxLQUFLO0dBQ3JDLENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLHlDQUF5QyxDQUFDO0FBQzdELE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxpQkFBaUIsR0FBRzs7Q0FFdkMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxpQkFBaUIsR0FBRzs7Q0FFeEMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUM7QUFFakMsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLHFDQUFxQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0dQR1BVUHJvZ3JhbSwgdXNlU2hhcGVVbmlmb3Jtc30gZnJvbSAnLi9ncGdwdV9tYXRoJztcblxuZXhwb3J0IGNsYXNzIFVuYXJ5T3BQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsnQSddO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIGVuYWJsZVNoYXBlVW5pZm9ybXM6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoYVNoYXBlOiBudW1iZXJbXSwgb3BTbmlwcGV0OiBzdHJpbmcpIHtcbiAgICB0aGlzLm91dHB1dFNoYXBlID0gYVNoYXBlO1xuICAgIHRoaXMuZW5hYmxlU2hhcGVVbmlmb3JtcyA9IHVzZVNoYXBlVW5pZm9ybXModGhpcy5vdXRwdXRTaGFwZS5sZW5ndGgpO1xuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICBmbG9hdCB1bmFyeU9wZXJhdGlvbihmbG9hdCB4KSB7XG4gICAgICAgICR7b3BTbmlwcGV0fVxuICAgICAgfVxuXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIGZsb2F0IHggPSBnZXRBQXRPdXRDb29yZHMoKTtcbiAgICAgICAgZmxvYXQgeSA9IHVuYXJ5T3BlcmF0aW9uKHgpO1xuXG4gICAgICAgIHNldE91dHB1dCh5KTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBDSEVDS19OQU5fU05JUFBFVCA9IGBpZiAoaXNuYW4oeCkpIHJldHVybiB4O2A7XG5cbmV4cG9ydCBjb25zdCBMSU5FQVIgPSBgcmV0dXJuIHg7YDtcblxuZXhwb3J0IGNvbnN0IEFCUyA9IGByZXR1cm4gYWJzKHgpO2A7XG5cbmV4cG9ydCBmdW5jdGlvbiBTVEVQKGFscGhhID0gMC4wKSB7XG4gIHJldHVybiBDSEVDS19OQU5fU05JUFBFVCArIGBcbiAgICByZXR1cm4geCA+IDAuMCA/IDEuMCA6IGZsb2F0KCR7YWxwaGF9KTtcbiAgYDtcbn1cblxuZXhwb3J0IGNvbnN0IEVMVSA9IGByZXR1cm4gKHggPj0gMC4wKSA/IHggOiAoZXhwKHgpIC0gMS4wKTtgO1xuZXhwb3J0IGNvbnN0IFJFTFUgPSBDSEVDS19OQU5fU05JUFBFVCArIGBcbiAgcmV0dXJuICh4IDwgMC4wKSA/IDAuMCA6IHg7XG5gO1xuXG5leHBvcnQgY29uc3QgUkVMVTYgPSBDSEVDS19OQU5fU05JUFBFVCArIGBcbiAgcmV0dXJuICh4IDwgMC4wKSA/IDAuMCA6IG1pbig2LjAsIHgpO1xuYDtcblxuZXhwb3J0IGNvbnN0IENMT05FID0gJ3JldHVybiB4Oyc7XG5cbmV4cG9ydCBjb25zdCBTSUdNT0lEID0gYHJldHVybiAxLjAgLyAoMS4wICsgZXhwKC0xLjAgKiB4KSk7YDtcbiJdfQ==