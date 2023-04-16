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
import { backend_util } from '@tensorflow/tfjs-core';
// (Ar + Ai)(Br + Bi) =
// ArBr + ArBi + AiBr + AiBi = ArBr - AB + ArBi + AiBr
// Yr = ArBr - AB
// Yi = ArBi + AiBr
export const COMPLEX_MULTIPLY = {
    REAL: 'return areal * breal - aimag * bimag;',
    IMAG: 'return areal * bimag + aimag * breal;'
};
export class BinaryOpComplexProgram {
    constructor(op, aShape, bShape) {
        this.variableNames = ['AReal', 'AImag', 'BReal', 'BImag'];
        this.outputShape = backend_util.assertAndGetBroadcastShape(aShape, bShape);
        this.userCode = `
      float binaryOpComplex(
          float areal, float aimag, float breal, float bimag) {
        ${op}
      }

      void main() {
        float areal = getARealAtOutCoords();
        float aimag = getAImagAtOutCoords();
        float breal = getBRealAtOutCoords();
        float bimag = getBImagAtOutCoords();
        setOutput(binaryOpComplex(areal, aimag, breal, bimag));
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluYXJ5b3BfY29tcGxleF9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2JpbmFyeW9wX2NvbXBsZXhfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUduRCx1QkFBdUI7QUFDdkIsc0RBQXNEO0FBQ3RELGlCQUFpQjtBQUNqQixtQkFBbUI7QUFDbkIsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUc7SUFDOUIsSUFBSSxFQUFFLHVDQUF1QztJQUM3QyxJQUFJLEVBQUUsdUNBQXVDO0NBQzlDLENBQUM7QUFFRixNQUFNLE9BQU8sc0JBQXNCO0lBS2pDLFlBQVksRUFBVSxFQUFFLE1BQWdCLEVBQUUsTUFBZ0I7UUFKMUQsa0JBQWEsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBS25ELElBQUksQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDLDBCQUEwQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUUzRSxJQUFJLENBQUMsUUFBUSxHQUFHOzs7VUFHVixFQUFFOzs7Ozs7Ozs7O0tBVVAsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtiYWNrZW5kX3V0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5pbXBvcnQge0dQR1BVUHJvZ3JhbX0gZnJvbSAnLi9ncGdwdV9tYXRoJztcblxuLy8gKEFyICsgQWkpKEJyICsgQmkpID1cbi8vIEFyQnIgKyBBckJpICsgQWlCciArIEFpQmkgPSBBckJyIC0gQUIgKyBBckJpICsgQWlCclxuLy8gWXIgPSBBckJyIC0gQUJcbi8vIFlpID0gQXJCaSArIEFpQnJcbmV4cG9ydCBjb25zdCBDT01QTEVYX01VTFRJUExZID0ge1xuICBSRUFMOiAncmV0dXJuIGFyZWFsICogYnJlYWwgLSBhaW1hZyAqIGJpbWFnOycsXG4gIElNQUc6ICdyZXR1cm4gYXJlYWwgKiBiaW1hZyArIGFpbWFnICogYnJlYWw7J1xufTtcblxuZXhwb3J0IGNsYXNzIEJpbmFyeU9wQ29tcGxleFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWydBUmVhbCcsICdBSW1hZycsICdCUmVhbCcsICdCSW1hZyddO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG5cbiAgY29uc3RydWN0b3Iob3A6IHN0cmluZywgYVNoYXBlOiBudW1iZXJbXSwgYlNoYXBlOiBudW1iZXJbXSkge1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBiYWNrZW5kX3V0aWwuYXNzZXJ0QW5kR2V0QnJvYWRjYXN0U2hhcGUoYVNoYXBlLCBiU2hhcGUpO1xuXG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgIGZsb2F0IGJpbmFyeU9wQ29tcGxleChcbiAgICAgICAgICBmbG9hdCBhcmVhbCwgZmxvYXQgYWltYWcsIGZsb2F0IGJyZWFsLCBmbG9hdCBiaW1hZykge1xuICAgICAgICAke29wfVxuICAgICAgfVxuXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIGZsb2F0IGFyZWFsID0gZ2V0QVJlYWxBdE91dENvb3JkcygpO1xuICAgICAgICBmbG9hdCBhaW1hZyA9IGdldEFJbWFnQXRPdXRDb29yZHMoKTtcbiAgICAgICAgZmxvYXQgYnJlYWwgPSBnZXRCUmVhbEF0T3V0Q29vcmRzKCk7XG4gICAgICAgIGZsb2F0IGJpbWFnID0gZ2V0QkltYWdBdE91dENvb3JkcygpO1xuICAgICAgICBzZXRPdXRwdXQoYmluYXJ5T3BDb21wbGV4KGFyZWFsLCBhaW1hZywgYnJlYWwsIGJpbWFnKSk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuIl19