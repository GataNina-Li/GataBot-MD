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
import { RealDiv } from '@tensorflow/tfjs-core';
import { binaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
// Without the equality check div produces 0.9999 for a = b, which when
// floored can cause errors.
const DIV = `
if (a == b) {
  return 1.0;
};
return a / b;`;
// We do the same as in ./binaryop_gpu, with vec4 and ivec4.
// On Linux, the vectorized implementation produces NaNs when a and b are 0.
const DIV_PACKED = `
  // vec4 one = vec4(equal(a, b));
  // return one + (vec4(1.0) - one) * a / b;
  vec4 result = a / b;
  if(a.x == b.x) {
    result.x = 1.;
  }
  if(a.y == b.y) {
    result.y = 1.;
  }
  if(a.z == b.z) {
    result.z = 1.;
  }
  if(a.w == b.w) {
    result.w = 1.;
  }

  return result;
`;
export const realDiv = binaryKernelFunc({ opSnippet: DIV, packedOpSnippet: DIV_PACKED, checkOutOfBounds: true });
export const realDivConfig = {
    kernelName: RealDiv,
    backendName: 'webgl',
    kernelFunc: realDiv,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVhbERpdi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMva2VybmVscy9SZWFsRGl2LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUU5QyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUVwRSx1RUFBdUU7QUFDdkUsNEJBQTRCO0FBQzVCLE1BQU0sR0FBRyxHQUFHOzs7O2NBSUUsQ0FBQztBQUVmLDREQUE0RDtBQUM1RCw0RUFBNEU7QUFDNUUsTUFBTSxVQUFVLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQWtCbEIsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FDbkMsRUFBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztBQUUzRSxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQWlCO0lBQ3pDLFVBQVUsRUFBRSxPQUFPO0lBQ25CLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLFVBQVUsRUFBRSxPQUFPO0NBQ3BCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7UmVhbERpdn0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbmltcG9ydCB7S2VybmVsQ29uZmlnfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0IHtiaW5hcnlLZXJuZWxGdW5jfSBmcm9tICcuLi9rZXJuZWxfdXRpbHMva2VybmVsX2Z1bmNzX3V0aWxzJztcblxuLy8gV2l0aG91dCB0aGUgZXF1YWxpdHkgY2hlY2sgZGl2IHByb2R1Y2VzIDAuOTk5OSBmb3IgYSA9IGIsIHdoaWNoIHdoZW5cbi8vIGZsb29yZWQgY2FuIGNhdXNlIGVycm9ycy5cbmNvbnN0IERJViA9IGBcbmlmIChhID09IGIpIHtcbiAgcmV0dXJuIDEuMDtcbn07XG5yZXR1cm4gYSAvIGI7YDtcblxuLy8gV2UgZG8gdGhlIHNhbWUgYXMgaW4gLi9iaW5hcnlvcF9ncHUsIHdpdGggdmVjNCBhbmQgaXZlYzQuXG4vLyBPbiBMaW51eCwgdGhlIHZlY3Rvcml6ZWQgaW1wbGVtZW50YXRpb24gcHJvZHVjZXMgTmFOcyB3aGVuIGEgYW5kIGIgYXJlIDAuXG5jb25zdCBESVZfUEFDS0VEID0gYFxuICAvLyB2ZWM0IG9uZSA9IHZlYzQoZXF1YWwoYSwgYikpO1xuICAvLyByZXR1cm4gb25lICsgKHZlYzQoMS4wKSAtIG9uZSkgKiBhIC8gYjtcbiAgdmVjNCByZXN1bHQgPSBhIC8gYjtcbiAgaWYoYS54ID09IGIueCkge1xuICAgIHJlc3VsdC54ID0gMS47XG4gIH1cbiAgaWYoYS55ID09IGIueSkge1xuICAgIHJlc3VsdC55ID0gMS47XG4gIH1cbiAgaWYoYS56ID09IGIueikge1xuICAgIHJlc3VsdC56ID0gMS47XG4gIH1cbiAgaWYoYS53ID09IGIudykge1xuICAgIHJlc3VsdC53ID0gMS47XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xuYDtcblxuZXhwb3J0IGNvbnN0IHJlYWxEaXYgPSBiaW5hcnlLZXJuZWxGdW5jKFxuICAgIHtvcFNuaXBwZXQ6IERJViwgcGFja2VkT3BTbmlwcGV0OiBESVZfUEFDS0VELCBjaGVja091dE9mQm91bmRzOiB0cnVlfSk7XG5cbmV4cG9ydCBjb25zdCByZWFsRGl2Q29uZmlnOiBLZXJuZWxDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IFJlYWxEaXYsXG4gIGJhY2tlbmROYW1lOiAnd2ViZ2wnLFxuICBrZXJuZWxGdW5jOiByZWFsRGl2LFxufTtcbiJdfQ==