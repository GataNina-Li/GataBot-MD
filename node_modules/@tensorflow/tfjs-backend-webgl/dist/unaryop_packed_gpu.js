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
export const LINEAR = `return x;`;
export const ELU = `
  vec4 result;

  result.r = (x.r >= 0.0) ? x.r : (exp(x.r) - 1.0);
  result.g = (x.g >= 0.0) ? x.g : (exp(x.g) - 1.0);
  result.b = (x.b >= 0.0) ? x.b : (exp(x.b) - 1.0);
  result.a = (x.a >= 0.0) ? x.a : (exp(x.a) - 1.0);

  return result;
`;
export const RELU = `
  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`;
export const RELU6 = `
  vec4 result = min(x, vec4(6.)) * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`;
export const SIGMOID = `return 1.0 / (1.0 + exp(-1.0 * x));`;
export class UnaryOpPackedProgram {
    constructor(aShape, opSnippet) {
        this.variableNames = ['A'];
        this.packedInputs = true;
        this.packedOutput = true;
        this.outputShape = aShape;
        this.enableShapeUniforms = useShapeUniforms(this.outputShape.length);
        this.userCode = `
      vec4 unaryOperation(vec4 x) {
        ${opSnippet}
      }

      void main() {
        vec4 x = getAAtOutCoords();
        vec4 y = unaryOperation(x);

        setOutput(y);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5hcnlvcF9wYWNrZWRfZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy91bmFyeW9wX3BhY2tlZF9ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFlLGdCQUFnQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRTVELE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUM7QUFFbEMsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHOzs7Ozs7Ozs7Q0FTbEIsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRzs7Ozs7Ozs7OztDQVVuQixDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHOzs7Ozs7Ozs7O0NBVXBCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUcscUNBQXFDLENBQUM7QUFFN0QsTUFBTSxPQUFPLG9CQUFvQjtJQVEvQixZQUFZLE1BQWdCLEVBQUUsU0FBaUI7UUFQL0Msa0JBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBSXRCLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBR2xCLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1FBQzFCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxRQUFRLEdBQUc7O1VBRVYsU0FBUzs7Ozs7Ozs7O0tBU2QsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtHUEdQVVByb2dyYW0sIHVzZVNoYXBlVW5pZm9ybXN9IGZyb20gJy4vZ3BncHVfbWF0aCc7XG5cbmV4cG9ydCBjb25zdCBMSU5FQVIgPSBgcmV0dXJuIHg7YDtcblxuZXhwb3J0IGNvbnN0IEVMVSA9IGBcbiAgdmVjNCByZXN1bHQ7XG5cbiAgcmVzdWx0LnIgPSAoeC5yID49IDAuMCkgPyB4LnIgOiAoZXhwKHgucikgLSAxLjApO1xuICByZXN1bHQuZyA9ICh4LmcgPj0gMC4wKSA/IHguZyA6IChleHAoeC5nKSAtIDEuMCk7XG4gIHJlc3VsdC5iID0gKHguYiA+PSAwLjApID8geC5iIDogKGV4cCh4LmIpIC0gMS4wKTtcbiAgcmVzdWx0LmEgPSAoeC5hID49IDAuMCkgPyB4LmEgOiAoZXhwKHguYSkgLSAxLjApO1xuXG4gIHJldHVybiByZXN1bHQ7XG5gO1xuXG5leHBvcnQgY29uc3QgUkVMVSA9IGBcbiAgdmVjNCByZXN1bHQgPSB4ICogdmVjNChncmVhdGVyVGhhbkVxdWFsKHgsIHZlYzQoMC4wKSkpO1xuICBidmVjNCBpc05hTiA9IGlzbmFuKHgpO1xuXG4gIHJlc3VsdC5yID0gaXNOYU4uciA/IHguciA6IHJlc3VsdC5yO1xuICByZXN1bHQuZyA9IGlzTmFOLmcgPyB4LmcgOiByZXN1bHQuZztcbiAgcmVzdWx0LmIgPSBpc05hTi5iID8geC5iIDogcmVzdWx0LmI7XG4gIHJlc3VsdC5hID0gaXNOYU4uYSA/IHguYSA6IHJlc3VsdC5hO1xuXG4gIHJldHVybiByZXN1bHQ7XG5gO1xuXG5leHBvcnQgY29uc3QgUkVMVTYgPSBgXG4gIHZlYzQgcmVzdWx0ID0gbWluKHgsIHZlYzQoNi4pKSAqIHZlYzQoZ3JlYXRlclRoYW5FcXVhbCh4LCB2ZWM0KDAuMCkpKTtcbiAgYnZlYzQgaXNOYU4gPSBpc25hbih4KTtcblxuICByZXN1bHQuciA9IGlzTmFOLnIgPyB4LnIgOiByZXN1bHQucjtcbiAgcmVzdWx0LmcgPSBpc05hTi5nID8geC5nIDogcmVzdWx0Lmc7XG4gIHJlc3VsdC5iID0gaXNOYU4uYiA/IHguYiA6IHJlc3VsdC5iO1xuICByZXN1bHQuYSA9IGlzTmFOLmEgPyB4LmEgOiByZXN1bHQuYTtcblxuICByZXR1cm4gcmVzdWx0O1xuYDtcblxuZXhwb3J0IGNvbnN0IFNJR01PSUQgPSBgcmV0dXJuIDEuMCAvICgxLjAgKyBleHAoLTEuMCAqIHgpKTtgO1xuXG5leHBvcnQgY2xhc3MgVW5hcnlPcFBhY2tlZFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWydBJ107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG4gIGVuYWJsZVNoYXBlVW5pZm9ybXM6IGJvb2xlYW47XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXTtcbiAgcGFja2VkSW5wdXRzID0gdHJ1ZTtcbiAgcGFja2VkT3V0cHV0ID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3RvcihhU2hhcGU6IG51bWJlcltdLCBvcFNuaXBwZXQ6IHN0cmluZykge1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBhU2hhcGU7XG4gICAgdGhpcy5lbmFibGVTaGFwZVVuaWZvcm1zID0gdXNlU2hhcGVVbmlmb3Jtcyh0aGlzLm91dHB1dFNoYXBlLmxlbmd0aCk7XG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgIHZlYzQgdW5hcnlPcGVyYXRpb24odmVjNCB4KSB7XG4gICAgICAgICR7b3BTbmlwcGV0fVxuICAgICAgfVxuXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIHZlYzQgeCA9IGdldEFBdE91dENvb3JkcygpO1xuICAgICAgICB2ZWM0IHkgPSB1bmFyeU9wZXJhdGlvbih4KTtcblxuICAgICAgICBzZXRPdXRwdXQoeSk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuIl19