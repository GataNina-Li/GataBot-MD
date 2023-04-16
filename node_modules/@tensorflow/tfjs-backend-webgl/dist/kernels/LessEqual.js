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
import { LessEqual } from '@tensorflow/tfjs-core';
import { binaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
import { lessEqualImplCPU } from '../kernel_utils/shared';
export const LESS_EQUAL = `return float(a <= b);`;
export const LESS_EQUAL_PACKED = `
  return vec4(lessThanEqual(a, b));
`;
export const lessEqual = binaryKernelFunc({
    opSnippet: LESS_EQUAL,
    packedOpSnippet: LESS_EQUAL_PACKED,
    cpuKernelImpl: lessEqualImplCPU,
    dtype: 'bool'
});
export const lessEqualConfig = {
    kernelName: LessEqual,
    backendName: 'webgl',
    kernelFunc: lessEqual
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGVzc0VxdWFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9rZXJuZWxzL0xlc3NFcXVhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQTJCLFNBQVMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRTFFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBQ3BFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBRXhELE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBRyx1QkFBdUIsQ0FBQztBQUNsRCxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRzs7Q0FFaEMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQztJQUN4QyxTQUFTLEVBQUUsVUFBVTtJQUNyQixlQUFlLEVBQUUsaUJBQWlCO0lBQ2xDLGFBQWEsRUFBRSxnQkFBZ0I7SUFDL0IsS0FBSyxFQUFFLE1BQU07Q0FDZCxDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQWlCO0lBQzNDLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLFVBQVUsRUFBRSxTQUE2QjtDQUMxQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0tlcm5lbENvbmZpZywgS2VybmVsRnVuYywgTGVzc0VxdWFsfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge2JpbmFyeUtlcm5lbEZ1bmN9IGZyb20gJy4uL2tlcm5lbF91dGlscy9rZXJuZWxfZnVuY3NfdXRpbHMnO1xuaW1wb3J0IHtsZXNzRXF1YWxJbXBsQ1BVfSBmcm9tICcuLi9rZXJuZWxfdXRpbHMvc2hhcmVkJztcblxuZXhwb3J0IGNvbnN0IExFU1NfRVFVQUwgPSBgcmV0dXJuIGZsb2F0KGEgPD0gYik7YDtcbmV4cG9ydCBjb25zdCBMRVNTX0VRVUFMX1BBQ0tFRCA9IGBcbiAgcmV0dXJuIHZlYzQobGVzc1RoYW5FcXVhbChhLCBiKSk7XG5gO1xuXG5leHBvcnQgY29uc3QgbGVzc0VxdWFsID0gYmluYXJ5S2VybmVsRnVuYyh7XG4gIG9wU25pcHBldDogTEVTU19FUVVBTCxcbiAgcGFja2VkT3BTbmlwcGV0OiBMRVNTX0VRVUFMX1BBQ0tFRCxcbiAgY3B1S2VybmVsSW1wbDogbGVzc0VxdWFsSW1wbENQVSxcbiAgZHR5cGU6ICdib29sJ1xufSk7XG5cbmV4cG9ydCBjb25zdCBsZXNzRXF1YWxDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogTGVzc0VxdWFsLFxuICBiYWNrZW5kTmFtZTogJ3dlYmdsJyxcbiAga2VybmVsRnVuYzogbGVzc0VxdWFsIGFzIHt9IGFzIEtlcm5lbEZ1bmNcbn07XG4iXX0=