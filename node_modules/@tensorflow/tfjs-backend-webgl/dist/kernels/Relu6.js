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
import { Relu6 } from '@tensorflow/tfjs-core';
import { unaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
import { CHECK_NAN_SNIPPET } from '../unaryop_gpu';
const RELU6 = CHECK_NAN_SNIPPET + `
  return (x < 0.0) ? 0.0 : min(6.0, x);
`;
const RELU6_PACKED = `
  vec4 result = min(x, vec4(6.)) * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`;
export const relu6 = unaryKernelFunc({ opSnippet: RELU6, packedOpSnippet: RELU6_PACKED });
export const relu6Config = {
    kernelName: Relu6,
    backendName: 'webgl',
    kernelFunc: relu6
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVsdTYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2tlcm5lbHMvUmVsdTYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUEyQixLQUFLLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFDbkUsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFakQsTUFBTSxLQUFLLEdBQUcsaUJBQWlCLEdBQUc7O0NBRWpDLENBQUM7QUFFRixNQUFNLFlBQVksR0FBRzs7Ozs7Ozs7OztDQVVwQixDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUNkLGVBQWUsQ0FBQyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFBQyxDQUFDLENBQUM7QUFFdkUsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFpQjtJQUN2QyxVQUFVLEVBQUUsS0FBSztJQUNqQixXQUFXLEVBQUUsT0FBTztJQUNwQixVQUFVLEVBQUUsS0FBeUI7Q0FDdEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtLZXJuZWxDb25maWcsIEtlcm5lbEZ1bmMsIFJlbHU2fSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0IHt1bmFyeUtlcm5lbEZ1bmN9IGZyb20gJy4uL2tlcm5lbF91dGlscy9rZXJuZWxfZnVuY3NfdXRpbHMnO1xuaW1wb3J0IHtDSEVDS19OQU5fU05JUFBFVH0gZnJvbSAnLi4vdW5hcnlvcF9ncHUnO1xuXG5jb25zdCBSRUxVNiA9IENIRUNLX05BTl9TTklQUEVUICsgYFxuICByZXR1cm4gKHggPCAwLjApID8gMC4wIDogbWluKDYuMCwgeCk7XG5gO1xuXG5jb25zdCBSRUxVNl9QQUNLRUQgPSBgXG4gIHZlYzQgcmVzdWx0ID0gbWluKHgsIHZlYzQoNi4pKSAqIHZlYzQoZ3JlYXRlclRoYW5FcXVhbCh4LCB2ZWM0KDAuMCkpKTtcbiAgYnZlYzQgaXNOYU4gPSBpc25hbih4KTtcblxuICByZXN1bHQuciA9IGlzTmFOLnIgPyB4LnIgOiByZXN1bHQucjtcbiAgcmVzdWx0LmcgPSBpc05hTi5nID8geC5nIDogcmVzdWx0Lmc7XG4gIHJlc3VsdC5iID0gaXNOYU4uYiA/IHguYiA6IHJlc3VsdC5iO1xuICByZXN1bHQuYSA9IGlzTmFOLmEgPyB4LmEgOiByZXN1bHQuYTtcblxuICByZXR1cm4gcmVzdWx0O1xuYDtcblxuZXhwb3J0IGNvbnN0IHJlbHU2ID1cbiAgICB1bmFyeUtlcm5lbEZ1bmMoe29wU25pcHBldDogUkVMVTYsIHBhY2tlZE9wU25pcHBldDogUkVMVTZfUEFDS0VEfSk7XG5cbmV4cG9ydCBjb25zdCByZWx1NkNvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBSZWx1NixcbiAgYmFja2VuZE5hbWU6ICd3ZWJnbCcsXG4gIGtlcm5lbEZ1bmM6IHJlbHU2IGFzIHt9IGFzIEtlcm5lbEZ1bmNcbn07XG4iXX0=