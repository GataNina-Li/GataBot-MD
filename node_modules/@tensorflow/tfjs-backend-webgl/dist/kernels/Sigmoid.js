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
import { Sigmoid } from '@tensorflow/tfjs-core';
import { CHECK_NAN_SNIPPET_UNARY, unaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
import { sigmoidImplCPU } from '../kernel_utils/shared';
const SIGMOID = CHECK_NAN_SNIPPET_UNARY + `
  return 1.0 / (1.0 + exp(-1.0 * x));
`;
const SIGMOID_PACKED = `
  vec4 result = 1.0 / (1.0 + exp(-1.0 * x));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`;
export const sigmoid = unaryKernelFunc({
    opSnippet: SIGMOID,
    packedOpSnippet: SIGMOID_PACKED,
    cpuKernelImpl: sigmoidImplCPU
});
export const sigmoidConfig = {
    kernelName: Sigmoid,
    backendName: 'webgl',
    kernelFunc: sigmoid,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2lnbW9pZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMva2VybmVscy9TaWdtb2lkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBZSxPQUFPLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUU1RCxPQUFPLEVBQUMsdUJBQXVCLEVBQUUsZUFBZSxFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFDNUYsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBRXRELE1BQU0sT0FBTyxHQUFHLHVCQUF1QixHQUFHOztDQUV6QyxDQUFDO0FBRUYsTUFBTSxjQUFjLEdBQUc7Ozs7Ozs7Ozs7Q0FVdEIsQ0FBQztBQUNGLE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUM7SUFDckMsU0FBUyxFQUFFLE9BQU87SUFDbEIsZUFBZSxFQUFFLGNBQWM7SUFDL0IsYUFBYSxFQUFFLGNBQWM7Q0FDOUIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFpQjtJQUN6QyxVQUFVLEVBQUUsT0FBTztJQUNuQixXQUFXLEVBQUUsT0FBTztJQUNwQixVQUFVLEVBQUUsT0FBTztDQUNwQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0tlcm5lbENvbmZpZywgU2lnbW9pZH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtDSEVDS19OQU5fU05JUFBFVF9VTkFSWSwgdW5hcnlLZXJuZWxGdW5jfSBmcm9tICcuLi9rZXJuZWxfdXRpbHMva2VybmVsX2Z1bmNzX3V0aWxzJztcbmltcG9ydCB7c2lnbW9pZEltcGxDUFV9IGZyb20gJy4uL2tlcm5lbF91dGlscy9zaGFyZWQnO1xuXG5jb25zdCBTSUdNT0lEID0gQ0hFQ0tfTkFOX1NOSVBQRVRfVU5BUlkgKyBgXG4gIHJldHVybiAxLjAgLyAoMS4wICsgZXhwKC0xLjAgKiB4KSk7XG5gO1xuXG5jb25zdCBTSUdNT0lEX1BBQ0tFRCA9IGBcbiAgdmVjNCByZXN1bHQgPSAxLjAgLyAoMS4wICsgZXhwKC0xLjAgKiB4KSk7XG4gIGJ2ZWM0IGlzTmFOID0gaXNuYW4oeCk7XG5cbiAgcmVzdWx0LnIgPSBpc05hTi5yID8geC5yIDogcmVzdWx0LnI7XG4gIHJlc3VsdC5nID0gaXNOYU4uZyA/IHguZyA6IHJlc3VsdC5nO1xuICByZXN1bHQuYiA9IGlzTmFOLmIgPyB4LmIgOiByZXN1bHQuYjtcbiAgcmVzdWx0LmEgPSBpc05hTi5hID8geC5hIDogcmVzdWx0LmE7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbmA7XG5leHBvcnQgY29uc3Qgc2lnbW9pZCA9IHVuYXJ5S2VybmVsRnVuYyh7XG4gIG9wU25pcHBldDogU0lHTU9JRCxcbiAgcGFja2VkT3BTbmlwcGV0OiBTSUdNT0lEX1BBQ0tFRCxcbiAgY3B1S2VybmVsSW1wbDogc2lnbW9pZEltcGxDUFVcbn0pO1xuXG5leHBvcnQgY29uc3Qgc2lnbW9pZENvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBTaWdtb2lkLFxuICBiYWNrZW5kTmFtZTogJ3dlYmdsJyxcbiAga2VybmVsRnVuYzogc2lnbW9pZCxcbn07XG4iXX0=