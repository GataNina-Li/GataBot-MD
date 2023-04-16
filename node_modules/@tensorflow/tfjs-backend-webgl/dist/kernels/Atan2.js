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
import { Atan2 } from '@tensorflow/tfjs-core';
import { CHECK_NAN_SNIPPET } from '../binaryop_gpu';
import { CHECK_NAN_SNIPPET_PACKED } from '../binaryop_packed_gpu';
import { binaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
const ATAN2 = CHECK_NAN_SNIPPET + `
  return atan(a, b);
`;
const ATAN2_PACKED = `
  vec4 result = atan(a, b);
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  ` +
    CHECK_NAN_SNIPPET_PACKED + `
  return result;
`;
export const atan2 = binaryKernelFunc({ opSnippet: ATAN2, packedOpSnippet: ATAN2_PACKED });
export const atan2Config = {
    kernelName: Atan2,
    backendName: 'webgl',
    kernelFunc: atan2,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXRhbjIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2tlcm5lbHMvQXRhbjIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRTVDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2xELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ2hFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBRXBFLE1BQU0sS0FBSyxHQUFHLGlCQUFpQixHQUFHOztDQUVqQyxDQUFDO0FBRUYsTUFBTSxZQUFZLEdBQUc7Ozs7O0dBS2xCO0lBQ0Msd0JBQXdCLEdBQUc7O0NBRTlCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxLQUFLLEdBQ2QsZ0JBQWdCLENBQUMsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDO0FBRXhFLE1BQU0sQ0FBQyxNQUFNLFdBQVcsR0FBaUI7SUFDdkMsVUFBVSxFQUFFLEtBQUs7SUFDakIsV0FBVyxFQUFFLE9BQU87SUFDcEIsVUFBVSxFQUFFLEtBQUs7Q0FDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtBdGFuMn0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbmltcG9ydCB7S2VybmVsQ29uZmlnfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0IHtDSEVDS19OQU5fU05JUFBFVH0gZnJvbSAnLi4vYmluYXJ5b3BfZ3B1JztcbmltcG9ydCB7Q0hFQ0tfTkFOX1NOSVBQRVRfUEFDS0VEfSBmcm9tICcuLi9iaW5hcnlvcF9wYWNrZWRfZ3B1JztcbmltcG9ydCB7YmluYXJ5S2VybmVsRnVuY30gZnJvbSAnLi4va2VybmVsX3V0aWxzL2tlcm5lbF9mdW5jc191dGlscyc7XG5cbmNvbnN0IEFUQU4yID0gQ0hFQ0tfTkFOX1NOSVBQRVQgKyBgXG4gIHJldHVybiBhdGFuKGEsIGIpO1xuYDtcblxuY29uc3QgQVRBTjJfUEFDS0VEID0gYFxuICB2ZWM0IHJlc3VsdCA9IGF0YW4oYSwgYik7XG4gIGJ2ZWM0IGlzTmFOQSA9IGlzbmFuKGEpO1xuICBidmVjNCBpc05hTkIgPSBpc25hbihiKTtcbiAgYnZlYzQgaXNOYU4gPSBidmVjNChpc05hTkEueCB8fCBpc05hTkIueCwgaXNOYU5BLnkgfHwgaXNOYU5CLnksIGlzTmFOQS56IHx8IGlzTmFOQi56LCBpc05hTkEudyB8fCBpc05hTkIudyk7XG4gIGAgK1xuICAgIENIRUNLX05BTl9TTklQUEVUX1BBQ0tFRCArIGBcbiAgcmV0dXJuIHJlc3VsdDtcbmA7XG5cbmV4cG9ydCBjb25zdCBhdGFuMiA9XG4gICAgYmluYXJ5S2VybmVsRnVuYyh7b3BTbmlwcGV0OiBBVEFOMiwgcGFja2VkT3BTbmlwcGV0OiBBVEFOMl9QQUNLRUR9KTtcblxuZXhwb3J0IGNvbnN0IGF0YW4yQ29uZmlnOiBLZXJuZWxDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IEF0YW4yLFxuICBiYWNrZW5kTmFtZTogJ3dlYmdsJyxcbiAga2VybmVsRnVuYzogYXRhbjIsXG59O1xuIl19