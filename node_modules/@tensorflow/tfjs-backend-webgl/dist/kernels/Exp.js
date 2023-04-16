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
import { Exp } from '@tensorflow/tfjs-core';
import { CHECK_NAN_SNIPPET_UNARY, unaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
import { expImplCPU } from '../kernel_utils/shared';
export const EXP = CHECK_NAN_SNIPPET_UNARY + `
  return exp(x);
`;
const EXP_PACKED = `
  vec4 result = exp(x);
  bvec4 isNaN = isnan(x);
  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`;
export const exp = unaryKernelFunc({
    opSnippet: EXP,
    packedOpSnippet: EXP_PACKED,
    cpuKernelImpl: expImplCPU,
    dtype: 'float32',
});
export const expConfig = {
    kernelName: Exp,
    backendName: 'webgl',
    kernelFunc: exp
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXhwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9rZXJuZWxzL0V4cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsR0FBRyxFQUEyQixNQUFNLHVCQUF1QixDQUFDO0FBRXBFLE9BQU8sRUFBQyx1QkFBdUIsRUFBRSxlQUFlLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUM1RixPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFFbEQsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLHVCQUF1QixHQUFHOztDQUU1QyxDQUFDO0FBRUYsTUFBTSxVQUFVLEdBQUc7Ozs7Ozs7OztDQVNsQixDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLGVBQWUsQ0FBQztJQUNqQyxTQUFTLEVBQUUsR0FBRztJQUNkLGVBQWUsRUFBRSxVQUFVO0lBQzNCLGFBQWEsRUFBRSxVQUFVO0lBQ3pCLEtBQUssRUFBRSxTQUFTO0NBQ2pCLENBQUMsQ0FBQztBQUVILE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBaUI7SUFDckMsVUFBVSxFQUFFLEdBQUc7SUFDZixXQUFXLEVBQUUsT0FBTztJQUNwQixVQUFVLEVBQUUsR0FBdUI7Q0FDcEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFeHAsIEtlcm5lbENvbmZpZywgS2VybmVsRnVuY30gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtDSEVDS19OQU5fU05JUFBFVF9VTkFSWSwgdW5hcnlLZXJuZWxGdW5jfSBmcm9tICcuLi9rZXJuZWxfdXRpbHMva2VybmVsX2Z1bmNzX3V0aWxzJztcbmltcG9ydCB7ZXhwSW1wbENQVX0gZnJvbSAnLi4va2VybmVsX3V0aWxzL3NoYXJlZCc7XG5cbmV4cG9ydCBjb25zdCBFWFAgPSBDSEVDS19OQU5fU05JUFBFVF9VTkFSWSArIGBcbiAgcmV0dXJuIGV4cCh4KTtcbmA7XG5cbmNvbnN0IEVYUF9QQUNLRUQgPSBgXG4gIHZlYzQgcmVzdWx0ID0gZXhwKHgpO1xuICBidmVjNCBpc05hTiA9IGlzbmFuKHgpO1xuICByZXN1bHQuciA9IGlzTmFOLnIgPyB4LnIgOiByZXN1bHQucjtcbiAgcmVzdWx0LmcgPSBpc05hTi5nID8geC5nIDogcmVzdWx0Lmc7XG4gIHJlc3VsdC5iID0gaXNOYU4uYiA/IHguYiA6IHJlc3VsdC5iO1xuICByZXN1bHQuYSA9IGlzTmFOLmEgPyB4LmEgOiByZXN1bHQuYTtcblxuICByZXR1cm4gcmVzdWx0O1xuYDtcblxuZXhwb3J0IGNvbnN0IGV4cCA9IHVuYXJ5S2VybmVsRnVuYyh7XG4gIG9wU25pcHBldDogRVhQLFxuICBwYWNrZWRPcFNuaXBwZXQ6IEVYUF9QQUNLRUQsXG4gIGNwdUtlcm5lbEltcGw6IGV4cEltcGxDUFUsXG4gIGR0eXBlOiAnZmxvYXQzMicsXG59KTtcblxuZXhwb3J0IGNvbnN0IGV4cENvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBFeHAsXG4gIGJhY2tlbmROYW1lOiAnd2ViZ2wnLFxuICBrZXJuZWxGdW5jOiBleHAgYXMge30gYXMgS2VybmVsRnVuY1xufTtcbiJdfQ==