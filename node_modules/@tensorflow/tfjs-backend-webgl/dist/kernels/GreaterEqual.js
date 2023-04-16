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
import { GreaterEqual } from '@tensorflow/tfjs-core';
import { binaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
import { greaterEqualImplCPU } from '../kernel_utils/shared';
const GREATER_EQUAL = `return float(a >= b);`;
const GREATER_EQUAL_PACKED = `
  return vec4(greaterThanEqual(a, b));
`;
export const greaterEqual = binaryKernelFunc({
    opSnippet: GREATER_EQUAL,
    packedOpSnippet: GREATER_EQUAL_PACKED,
    dtype: 'bool',
    cpuKernelImpl: greaterEqualImplCPU
});
export const greaterEqualConfig = {
    kernelName: GreaterEqual,
    backendName: 'webgl',
    kernelFunc: greaterEqual
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JlYXRlckVxdWFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9rZXJuZWxzL0dyZWF0ZXJFcXVhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUEyQixNQUFNLHVCQUF1QixDQUFDO0FBQzdFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBQ3BFLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBRTNELE1BQU0sYUFBYSxHQUFHLHVCQUF1QixDQUFDO0FBQzlDLE1BQU0sb0JBQW9CLEdBQUc7O0NBRTVCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsZ0JBQWdCLENBQUM7SUFDM0MsU0FBUyxFQUFFLGFBQWE7SUFDeEIsZUFBZSxFQUFFLG9CQUFvQjtJQUNyQyxLQUFLLEVBQUUsTUFBTTtJQUNiLGFBQWEsRUFBRSxtQkFBbUI7Q0FDbkMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQWlCO0lBQzlDLFVBQVUsRUFBRSxZQUFZO0lBQ3hCLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLFVBQVUsRUFBRSxZQUFnQztDQUM3QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0dyZWF0ZXJFcXVhbCwgS2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0IHtiaW5hcnlLZXJuZWxGdW5jfSBmcm9tICcuLi9rZXJuZWxfdXRpbHMva2VybmVsX2Z1bmNzX3V0aWxzJztcbmltcG9ydCB7Z3JlYXRlckVxdWFsSW1wbENQVX0gZnJvbSAnLi4va2VybmVsX3V0aWxzL3NoYXJlZCc7XG5cbmNvbnN0IEdSRUFURVJfRVFVQUwgPSBgcmV0dXJuIGZsb2F0KGEgPj0gYik7YDtcbmNvbnN0IEdSRUFURVJfRVFVQUxfUEFDS0VEID0gYFxuICByZXR1cm4gdmVjNChncmVhdGVyVGhhbkVxdWFsKGEsIGIpKTtcbmA7XG5cbmV4cG9ydCBjb25zdCBncmVhdGVyRXF1YWwgPSBiaW5hcnlLZXJuZWxGdW5jKHtcbiAgb3BTbmlwcGV0OiBHUkVBVEVSX0VRVUFMLFxuICBwYWNrZWRPcFNuaXBwZXQ6IEdSRUFURVJfRVFVQUxfUEFDS0VELFxuICBkdHlwZTogJ2Jvb2wnLFxuICBjcHVLZXJuZWxJbXBsOiBncmVhdGVyRXF1YWxJbXBsQ1BVXG59KTtcblxuZXhwb3J0IGNvbnN0IGdyZWF0ZXJFcXVhbENvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBHcmVhdGVyRXF1YWwsXG4gIGJhY2tlbmROYW1lOiAnd2ViZ2wnLFxuICBrZXJuZWxGdW5jOiBncmVhdGVyRXF1YWwgYXMge30gYXMgS2VybmVsRnVuY1xufTtcbiJdfQ==