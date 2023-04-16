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
import { Rsqrt } from '@tensorflow/tfjs-core';
import { unaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
import { rsqrtImplCPU } from '../kernel_utils/shared';
const RSQRT = `return inversesqrt(x);`;
export const rsqrt = unaryKernelFunc({ opSnippet: RSQRT, cpuKernelImpl: rsqrtImplCPU });
export const rsqrtConfig = {
    kernelName: Rsqrt,
    backendName: 'webgl',
    kernelFunc: rsqrt
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUnNxcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2tlcm5lbHMvUnNxcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUEyQixLQUFLLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFDbkUsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBRXBELE1BQU0sS0FBSyxHQUFHLHdCQUF3QixDQUFDO0FBRXZDLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FDZCxlQUFlLENBQUMsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDO0FBRXJFLE1BQU0sQ0FBQyxNQUFNLFdBQVcsR0FBaUI7SUFDdkMsVUFBVSxFQUFFLEtBQUs7SUFDakIsV0FBVyxFQUFFLE9BQU87SUFDcEIsVUFBVSxFQUFFLEtBQXlCO0NBQ3RDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7S2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jLCBSc3FydH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbmltcG9ydCB7dW5hcnlLZXJuZWxGdW5jfSBmcm9tICcuLi9rZXJuZWxfdXRpbHMva2VybmVsX2Z1bmNzX3V0aWxzJztcbmltcG9ydCB7cnNxcnRJbXBsQ1BVfSBmcm9tICcuLi9rZXJuZWxfdXRpbHMvc2hhcmVkJztcblxuY29uc3QgUlNRUlQgPSBgcmV0dXJuIGludmVyc2VzcXJ0KHgpO2A7XG5cbmV4cG9ydCBjb25zdCByc3FydCA9XG4gICAgdW5hcnlLZXJuZWxGdW5jKHtvcFNuaXBwZXQ6IFJTUVJULCBjcHVLZXJuZWxJbXBsOiByc3FydEltcGxDUFV9KTtcblxuZXhwb3J0IGNvbnN0IHJzcXJ0Q29uZmlnOiBLZXJuZWxDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IFJzcXJ0LFxuICBiYWNrZW5kTmFtZTogJ3dlYmdsJyxcbiAga2VybmVsRnVuYzogcnNxcnQgYXMge30gYXMgS2VybmVsRnVuY1xufTtcbiJdfQ==