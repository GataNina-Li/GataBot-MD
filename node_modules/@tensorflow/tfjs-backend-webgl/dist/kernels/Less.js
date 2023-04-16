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
import { Less } from '@tensorflow/tfjs-core';
import { binaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
import { lessImplCPU } from '../kernel_utils/shared';
const LESS = `return float(a < b);`;
const LESS_PACKED = `
  return vec4(lessThan(a, b));
`;
export const less = binaryKernelFunc({
    opSnippet: LESS,
    packedOpSnippet: LESS_PACKED,
    cpuKernelImpl: lessImplCPU,
    dtype: 'bool'
});
export const lessConfig = {
    kernelName: Less,
    backendName: 'webgl',
    kernelFunc: less
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMva2VybmVscy9MZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBMkIsSUFBSSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFckUsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFDcEUsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBRW5ELE1BQU0sSUFBSSxHQUFHLHNCQUFzQixDQUFDO0FBQ3BDLE1BQU0sV0FBVyxHQUFHOztDQUVuQixDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLGdCQUFnQixDQUFDO0lBQ25DLFNBQVMsRUFBRSxJQUFJO0lBQ2YsZUFBZSxFQUFFLFdBQVc7SUFDNUIsYUFBYSxFQUFFLFdBQVc7SUFDMUIsS0FBSyxFQUFFLE1BQU07Q0FDZCxDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQWlCO0lBQ3RDLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLFVBQVUsRUFBRSxJQUF3QjtDQUNyQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0tlcm5lbENvbmZpZywgS2VybmVsRnVuYywgTGVzc30gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtiaW5hcnlLZXJuZWxGdW5jfSBmcm9tICcuLi9rZXJuZWxfdXRpbHMva2VybmVsX2Z1bmNzX3V0aWxzJztcbmltcG9ydCB7bGVzc0ltcGxDUFV9IGZyb20gJy4uL2tlcm5lbF91dGlscy9zaGFyZWQnO1xuXG5jb25zdCBMRVNTID0gYHJldHVybiBmbG9hdChhIDwgYik7YDtcbmNvbnN0IExFU1NfUEFDS0VEID0gYFxuICByZXR1cm4gdmVjNChsZXNzVGhhbihhLCBiKSk7XG5gO1xuXG5leHBvcnQgY29uc3QgbGVzcyA9IGJpbmFyeUtlcm5lbEZ1bmMoe1xuICBvcFNuaXBwZXQ6IExFU1MsXG4gIHBhY2tlZE9wU25pcHBldDogTEVTU19QQUNLRUQsXG4gIGNwdUtlcm5lbEltcGw6IGxlc3NJbXBsQ1BVLFxuICBkdHlwZTogJ2Jvb2wnXG59KTtcblxuZXhwb3J0IGNvbnN0IGxlc3NDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogTGVzcyxcbiAgYmFja2VuZE5hbWU6ICd3ZWJnbCcsXG4gIGtlcm5lbEZ1bmM6IGxlc3MgYXMge30gYXMgS2VybmVsRnVuY1xufTtcbiJdfQ==