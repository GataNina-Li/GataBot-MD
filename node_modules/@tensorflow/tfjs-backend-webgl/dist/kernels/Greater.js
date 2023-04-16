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
import { Greater } from '@tensorflow/tfjs-core';
import { binaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
import { greaterImplCPU } from '../kernel_utils/shared';
const GREATER = `return float(a > b);`;
const GREATER_PACKED = `
  return vec4(greaterThan(a, b));
`;
export const greater = binaryKernelFunc({
    opSnippet: GREATER,
    packedOpSnippet: GREATER_PACKED,
    cpuKernelImpl: greaterImplCPU,
    dtype: 'bool'
});
export const greaterConfig = {
    kernelName: Greater,
    backendName: 'webgl',
    kernelFunc: greater
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JlYXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMva2VybmVscy9HcmVhdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxPQUFPLEVBQTJCLE1BQU0sdUJBQXVCLENBQUM7QUFFeEUsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFDcEUsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBRXRELE1BQU0sT0FBTyxHQUFHLHNCQUFzQixDQUFDO0FBQ3ZDLE1BQU0sY0FBYyxHQUFHOztDQUV0QixDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLGdCQUFnQixDQUFDO0lBQ3RDLFNBQVMsRUFBRSxPQUFPO0lBQ2xCLGVBQWUsRUFBRSxjQUFjO0lBQy9CLGFBQWEsRUFBRSxjQUFjO0lBQzdCLEtBQUssRUFBRSxNQUFNO0NBQ2QsQ0FBQyxDQUFDO0FBRUgsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFpQjtJQUN6QyxVQUFVLEVBQUUsT0FBTztJQUNuQixXQUFXLEVBQUUsT0FBTztJQUNwQixVQUFVLEVBQUUsT0FBMkI7Q0FDeEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtHcmVhdGVyLCBLZXJuZWxDb25maWcsIEtlcm5lbEZ1bmN9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7YmluYXJ5S2VybmVsRnVuY30gZnJvbSAnLi4va2VybmVsX3V0aWxzL2tlcm5lbF9mdW5jc191dGlscyc7XG5pbXBvcnQge2dyZWF0ZXJJbXBsQ1BVfSBmcm9tICcuLi9rZXJuZWxfdXRpbHMvc2hhcmVkJztcblxuY29uc3QgR1JFQVRFUiA9IGByZXR1cm4gZmxvYXQoYSA+IGIpO2A7XG5jb25zdCBHUkVBVEVSX1BBQ0tFRCA9IGBcbiAgcmV0dXJuIHZlYzQoZ3JlYXRlclRoYW4oYSwgYikpO1xuYDtcblxuZXhwb3J0IGNvbnN0IGdyZWF0ZXIgPSBiaW5hcnlLZXJuZWxGdW5jKHtcbiAgb3BTbmlwcGV0OiBHUkVBVEVSLFxuICBwYWNrZWRPcFNuaXBwZXQ6IEdSRUFURVJfUEFDS0VELFxuICBjcHVLZXJuZWxJbXBsOiBncmVhdGVySW1wbENQVSxcbiAgZHR5cGU6ICdib29sJ1xufSk7XG5cbmV4cG9ydCBjb25zdCBncmVhdGVyQ29uZmlnOiBLZXJuZWxDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IEdyZWF0ZXIsXG4gIGJhY2tlbmROYW1lOiAnd2ViZ2wnLFxuICBrZXJuZWxGdW5jOiBncmVhdGVyIGFzIHt9IGFzIEtlcm5lbEZ1bmNcbn07XG4iXX0=