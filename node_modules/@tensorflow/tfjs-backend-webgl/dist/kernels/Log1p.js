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
import { Log1p } from '@tensorflow/tfjs-core';
import { CHECK_NAN_SNIPPET_UNARY, unaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
const LOG1P = CHECK_NAN_SNIPPET_UNARY + `
  return log(1.0 + x);
`;
export const log1p = unaryKernelFunc({ opSnippet: LOG1P });
export const log1pConfig = {
    kernelName: Log1p,
    backendName: 'webgl',
    kernelFunc: log1p,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9nMXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2tlcm5lbHMvTG9nMXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFlLEtBQUssRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRTFELE9BQU8sRUFBQyx1QkFBdUIsRUFBRSxlQUFlLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUU1RixNQUFNLEtBQUssR0FBRyx1QkFBdUIsR0FBRzs7Q0FFdkMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztBQUV6RCxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQWlCO0lBQ3ZDLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLFVBQVUsRUFBRSxLQUFLO0NBQ2xCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7S2VybmVsQ29uZmlnLCBMb2cxcH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtDSEVDS19OQU5fU05JUFBFVF9VTkFSWSwgdW5hcnlLZXJuZWxGdW5jfSBmcm9tICcuLi9rZXJuZWxfdXRpbHMva2VybmVsX2Z1bmNzX3V0aWxzJztcblxuY29uc3QgTE9HMVAgPSBDSEVDS19OQU5fU05JUFBFVF9VTkFSWSArIGBcbiAgcmV0dXJuIGxvZygxLjAgKyB4KTtcbmA7XG5cbmV4cG9ydCBjb25zdCBsb2cxcCA9IHVuYXJ5S2VybmVsRnVuYyh7b3BTbmlwcGV0OiBMT0cxUH0pO1xuXG5leHBvcnQgY29uc3QgbG9nMXBDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogTG9nMXAsXG4gIGJhY2tlbmROYW1lOiAnd2ViZ2wnLFxuICBrZXJuZWxGdW5jOiBsb2cxcCxcbn07XG4iXX0=