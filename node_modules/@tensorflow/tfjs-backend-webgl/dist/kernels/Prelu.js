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
import { env, Prelu } from '@tensorflow/tfjs-core';
import { BinaryOpProgram } from '../binaryop_gpu';
import { BinaryOpPackedProgram } from '../binaryop_packed_gpu';
export const PRELU = `return (a < 0.) ? b * a : a;`;
export const PRELU_PACKED = `
  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));
  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);
`;
export function prelu(args) {
    const { inputs, backend } = args;
    const { x, alpha } = inputs;
    const program = env().getBool('WEBGL_PACK_BINARY_OPERATIONS') ?
        new BinaryOpPackedProgram(PRELU_PACKED, x.shape, alpha.shape) :
        new BinaryOpProgram(PRELU, x.shape, alpha.shape);
    return backend.runWebGLProgram(program, [x, alpha], 'float32');
}
export const preluConfig = {
    kernelName: Prelu,
    backendName: 'webgl',
    kernelFunc: prelu
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJlbHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2tlcm5lbHMvUHJlbHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLEdBQUcsRUFBNEIsS0FBSyxFQUEwQixNQUFNLHVCQUF1QixDQUFDO0FBR3BHLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUU3RCxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsOEJBQThCLENBQUM7QUFDcEQsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHOzs7Q0FHM0IsQ0FBQztBQUVGLE1BQU0sVUFBVSxLQUFLLENBQUMsSUFBc0Q7SUFFMUUsTUFBTSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsR0FBRyxJQUFJLENBQUM7SUFDL0IsTUFBTSxFQUFDLENBQUMsRUFBRSxLQUFLLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFFMUIsTUFBTSxPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQztRQUMzRCxJQUFJLHFCQUFxQixDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQy9ELElBQUksZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyRCxPQUFPLE9BQU8sQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQWlCO0lBQ3ZDLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLFVBQVUsRUFBRSxLQUF5QjtDQUN0QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2VudiwgS2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jLCBQcmVsdSwgUHJlbHVJbnB1dHMsIFRlbnNvckluZm99IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7TWF0aEJhY2tlbmRXZWJHTH0gZnJvbSAnLi4vYmFja2VuZF93ZWJnbCc7XG5pbXBvcnQge0JpbmFyeU9wUHJvZ3JhbX0gZnJvbSAnLi4vYmluYXJ5b3BfZ3B1JztcbmltcG9ydCB7QmluYXJ5T3BQYWNrZWRQcm9ncmFtfSBmcm9tICcuLi9iaW5hcnlvcF9wYWNrZWRfZ3B1JztcblxuZXhwb3J0IGNvbnN0IFBSRUxVID0gYHJldHVybiAoYSA8IDAuKSA/IGIgKiBhIDogYTtgO1xuZXhwb3J0IGNvbnN0IFBSRUxVX1BBQ0tFRCA9IGBcbiAgdmVjNCBhTGVzc1RoYW5aZXJvID0gdmVjNChsZXNzVGhhbihhLCB2ZWM0KDAuKSkpO1xuICByZXR1cm4gKGFMZXNzVGhhblplcm8gKiAoYiAqIGEpKSArICgodmVjNCgxLjApIC0gYUxlc3NUaGFuWmVybykgKiBhKTtcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmVsdShhcmdzOiB7aW5wdXRzOiBQcmVsdUlucHV0cywgYmFja2VuZDogTWF0aEJhY2tlbmRXZWJHTH0pOlxuICAgIFRlbnNvckluZm8ge1xuICBjb25zdCB7aW5wdXRzLCBiYWNrZW5kfSA9IGFyZ3M7XG4gIGNvbnN0IHt4LCBhbHBoYX0gPSBpbnB1dHM7XG5cbiAgY29uc3QgcHJvZ3JhbSA9IGVudigpLmdldEJvb2woJ1dFQkdMX1BBQ0tfQklOQVJZX09QRVJBVElPTlMnKSA/XG4gICAgICBuZXcgQmluYXJ5T3BQYWNrZWRQcm9ncmFtKFBSRUxVX1BBQ0tFRCwgeC5zaGFwZSwgYWxwaGEuc2hhcGUpIDpcbiAgICAgIG5ldyBCaW5hcnlPcFByb2dyYW0oUFJFTFUsIHguc2hhcGUsIGFscGhhLnNoYXBlKTtcbiAgcmV0dXJuIGJhY2tlbmQucnVuV2ViR0xQcm9ncmFtKHByb2dyYW0sIFt4LCBhbHBoYV0sICdmbG9hdDMyJyk7XG59XG5cbmV4cG9ydCBjb25zdCBwcmVsdUNvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBQcmVsdSxcbiAgYmFja2VuZE5hbWU6ICd3ZWJnbCcsXG4gIGtlcm5lbEZ1bmM6IHByZWx1IGFzIHt9IGFzIEtlcm5lbEZ1bmNcbn07XG4iXX0=