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
import { Elu } from '@tensorflow/tfjs-core';
import { unaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
const ELU = `return (x >= 0.0) ? x : (exp(x) - 1.0);`;
const ELU_PACKED = `
  vec4 result;

  result.r = (x.r >= 0.0) ? x.r : (exp(x.r) - 1.0);
  result.g = (x.g >= 0.0) ? x.g : (exp(x.g) - 1.0);
  result.b = (x.b >= 0.0) ? x.b : (exp(x.b) - 1.0);
  result.a = (x.a >= 0.0) ? x.a : (exp(x.a) - 1.0);

  return result;
`;
const elu = unaryKernelFunc({ opSnippet: ELU, packedOpSnippet: ELU_PACKED });
export const eluConfig = {
    kernelName: Elu,
    backendName: 'webgl',
    kernelFunc: elu
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRWx1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9rZXJuZWxzL0VsdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsR0FBRyxFQUEyQixNQUFNLHVCQUF1QixDQUFDO0FBQ3BFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUVuRSxNQUFNLEdBQUcsR0FBRyx5Q0FBeUMsQ0FBQztBQUV0RCxNQUFNLFVBQVUsR0FBRzs7Ozs7Ozs7O0NBU2xCLENBQUM7QUFFRixNQUFNLEdBQUcsR0FBRyxlQUFlLENBQUMsRUFBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUMsQ0FBQyxDQUFDO0FBRTNFLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBaUI7SUFDckMsVUFBVSxFQUFFLEdBQUc7SUFDZixXQUFXLEVBQUUsT0FBTztJQUNwQixVQUFVLEVBQUUsR0FBdUI7Q0FDcEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFbHUsIEtlcm5lbENvbmZpZywgS2VybmVsRnVuY30gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbmltcG9ydCB7dW5hcnlLZXJuZWxGdW5jfSBmcm9tICcuLi9rZXJuZWxfdXRpbHMva2VybmVsX2Z1bmNzX3V0aWxzJztcblxuY29uc3QgRUxVID0gYHJldHVybiAoeCA+PSAwLjApID8geCA6IChleHAoeCkgLSAxLjApO2A7XG5cbmNvbnN0IEVMVV9QQUNLRUQgPSBgXG4gIHZlYzQgcmVzdWx0O1xuXG4gIHJlc3VsdC5yID0gKHguciA+PSAwLjApID8geC5yIDogKGV4cCh4LnIpIC0gMS4wKTtcbiAgcmVzdWx0LmcgPSAoeC5nID49IDAuMCkgPyB4LmcgOiAoZXhwKHguZykgLSAxLjApO1xuICByZXN1bHQuYiA9ICh4LmIgPj0gMC4wKSA/IHguYiA6IChleHAoeC5iKSAtIDEuMCk7XG4gIHJlc3VsdC5hID0gKHguYSA+PSAwLjApID8geC5hIDogKGV4cCh4LmEpIC0gMS4wKTtcblxuICByZXR1cm4gcmVzdWx0O1xuYDtcblxuY29uc3QgZWx1ID0gdW5hcnlLZXJuZWxGdW5jKHtvcFNuaXBwZXQ6IEVMVSwgcGFja2VkT3BTbmlwcGV0OiBFTFVfUEFDS0VEfSk7XG5cbmV4cG9ydCBjb25zdCBlbHVDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogRWx1LFxuICBiYWNrZW5kTmFtZTogJ3dlYmdsJyxcbiAga2VybmVsRnVuYzogZWx1IGFzIHt9IGFzIEtlcm5lbEZ1bmNcbn07XG4iXX0=