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
import { Sub } from '@tensorflow/tfjs-core';
import { binaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
import { subImplCPU as cpuSub } from '../kernel_utils/shared';
const SUB = 'return a - b;';
export const sub = binaryKernelFunc({
    opSnippet: SUB,
    packedOpSnippet: SUB,
    supportsComplex: true,
    cpuKernelImpl: cpuSub
});
export const subConfig = {
    kernelName: Sub,
    backendName: 'webgl',
    kernelFunc: sub
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3ViLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9rZXJuZWxzL1N1Yi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQWUsR0FBRyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFeEQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFDcEUsT0FBTyxFQUFDLFVBQVUsSUFBSSxNQUFNLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUU1RCxNQUFNLEdBQUcsR0FBRyxlQUFlLENBQUM7QUFFNUIsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLGdCQUFnQixDQUFDO0lBQ2xDLFNBQVMsRUFBRSxHQUFHO0lBQ2QsZUFBZSxFQUFFLEdBQUc7SUFDcEIsZUFBZSxFQUFFLElBQUk7SUFDckIsYUFBYSxFQUFFLE1BQU07Q0FDdEIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFpQjtJQUNyQyxVQUFVLEVBQUUsR0FBRztJQUNmLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLFVBQVUsRUFBRSxHQUFHO0NBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7S2VybmVsQ29uZmlnLCBTdWJ9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7YmluYXJ5S2VybmVsRnVuY30gZnJvbSAnLi4va2VybmVsX3V0aWxzL2tlcm5lbF9mdW5jc191dGlscyc7XG5pbXBvcnQge3N1YkltcGxDUFUgYXMgY3B1U3VifSBmcm9tICcuLi9rZXJuZWxfdXRpbHMvc2hhcmVkJztcblxuY29uc3QgU1VCID0gJ3JldHVybiBhIC0gYjsnO1xuXG5leHBvcnQgY29uc3Qgc3ViID0gYmluYXJ5S2VybmVsRnVuYyh7XG4gIG9wU25pcHBldDogU1VCLFxuICBwYWNrZWRPcFNuaXBwZXQ6IFNVQixcbiAgc3VwcG9ydHNDb21wbGV4OiB0cnVlLFxuICBjcHVLZXJuZWxJbXBsOiBjcHVTdWJcbn0pO1xuXG5leHBvcnQgY29uc3Qgc3ViQ29uZmlnOiBLZXJuZWxDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IFN1YixcbiAgYmFja2VuZE5hbWU6ICd3ZWJnbCcsXG4gIGtlcm5lbEZ1bmM6IHN1YlxufTtcbiJdfQ==