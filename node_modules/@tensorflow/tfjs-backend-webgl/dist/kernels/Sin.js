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
import { Sin } from '@tensorflow/tfjs-core';
import { CHECK_NAN_SNIPPET_UNARY, unaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
const SIN = CHECK_NAN_SNIPPET_UNARY + `
  return sin(x);
`;
export const sin = unaryKernelFunc({ opSnippet: SIN });
export const sinConfig = {
    kernelName: Sin,
    backendName: 'webgl',
    kernelFunc: sin,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9rZXJuZWxzL1Npbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQWUsR0FBRyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFeEQsT0FBTyxFQUFDLHVCQUF1QixFQUFFLGVBQWUsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBRTVGLE1BQU0sR0FBRyxHQUFHLHVCQUF1QixHQUFHOztDQUVyQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLGVBQWUsQ0FBQyxFQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDO0FBRXJELE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBaUI7SUFDckMsVUFBVSxFQUFFLEdBQUc7SUFDZixXQUFXLEVBQUUsT0FBTztJQUNwQixVQUFVLEVBQUUsR0FBRztDQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0tlcm5lbENvbmZpZywgU2lufSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge0NIRUNLX05BTl9TTklQUEVUX1VOQVJZLCB1bmFyeUtlcm5lbEZ1bmN9IGZyb20gJy4uL2tlcm5lbF91dGlscy9rZXJuZWxfZnVuY3NfdXRpbHMnO1xuXG5jb25zdCBTSU4gPSBDSEVDS19OQU5fU05JUFBFVF9VTkFSWSArIGBcbiAgcmV0dXJuIHNpbih4KTtcbmA7XG5cbmV4cG9ydCBjb25zdCBzaW4gPSB1bmFyeUtlcm5lbEZ1bmMoe29wU25pcHBldDogU0lOfSk7XG5cbmV4cG9ydCBjb25zdCBzaW5Db25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogU2luLFxuICBiYWNrZW5kTmFtZTogJ3dlYmdsJyxcbiAga2VybmVsRnVuYzogc2luLFxufTtcbiJdfQ==