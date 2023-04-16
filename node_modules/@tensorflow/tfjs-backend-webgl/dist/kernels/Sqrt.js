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
import { Sqrt } from '@tensorflow/tfjs-core';
import { unaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
import { sqrtImplCPU } from '../kernel_utils/shared';
const SQRT = `return sqrt(x);`;
export const sqrt = unaryKernelFunc({ opSnippet: SQRT, packedOpSnippet: SQRT, cpuKernelImpl: sqrtImplCPU });
export const sqrtConfig = {
    kernelName: Sqrt,
    backendName: 'webgl',
    kernelFunc: sqrt
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3FydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMva2VybmVscy9TcXJ0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBMkIsSUFBSSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFckUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBQ25FLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUVuRCxNQUFNLElBQUksR0FBRyxpQkFBaUIsQ0FBQztBQUUvQixNQUFNLENBQUMsTUFBTSxJQUFJLEdBQUcsZUFBZSxDQUMvQixFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQztBQUUxRSxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQWlCO0lBQ3RDLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLFVBQVUsRUFBRSxJQUF3QjtDQUNyQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0tlcm5lbENvbmZpZywgS2VybmVsRnVuYywgU3FydH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHt1bmFyeUtlcm5lbEZ1bmN9IGZyb20gJy4uL2tlcm5lbF91dGlscy9rZXJuZWxfZnVuY3NfdXRpbHMnO1xuaW1wb3J0IHtzcXJ0SW1wbENQVX0gZnJvbSAnLi4va2VybmVsX3V0aWxzL3NoYXJlZCc7XG5cbmNvbnN0IFNRUlQgPSBgcmV0dXJuIHNxcnQoeCk7YDtcblxuZXhwb3J0IGNvbnN0IHNxcnQgPSB1bmFyeUtlcm5lbEZ1bmMoXG4gICAge29wU25pcHBldDogU1FSVCwgcGFja2VkT3BTbmlwcGV0OiBTUVJULCBjcHVLZXJuZWxJbXBsOiBzcXJ0SW1wbENQVX0pO1xuXG5leHBvcnQgY29uc3Qgc3FydENvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBTcXJ0LFxuICBiYWNrZW5kTmFtZTogJ3dlYmdsJyxcbiAga2VybmVsRnVuYzogc3FydCBhcyB7fSBhcyBLZXJuZWxGdW5jXG59O1xuIl19