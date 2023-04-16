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
import { SquaredDifference } from '@tensorflow/tfjs-core';
import { binaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
const SQUARED_DIFFERENCE = 'return (a - b) * (a - b);';
export const squaredDifference = binaryKernelFunc({ opSnippet: SQUARED_DIFFERENCE, packedOpSnippet: SQUARED_DIFFERENCE });
export const squaredDifferenceConfig = {
    kernelName: SquaredDifference,
    backendName: 'webgl',
    kernelFunc: squaredDifference,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3F1YXJlZERpZmZlcmVuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2tlcm5lbHMvU3F1YXJlZERpZmZlcmVuY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFlLGlCQUFpQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFdEUsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFFcEUsTUFBTSxrQkFBa0IsR0FBRywyQkFBMkIsQ0FBQztBQUV2RCxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FDN0MsRUFBQyxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixFQUFDLENBQUMsQ0FBQztBQUUxRSxNQUFNLENBQUMsTUFBTSx1QkFBdUIsR0FBaUI7SUFDbkQsVUFBVSxFQUFFLGlCQUFpQjtJQUM3QixXQUFXLEVBQUUsT0FBTztJQUNwQixVQUFVLEVBQUUsaUJBQWlCO0NBQzlCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7S2VybmVsQ29uZmlnLCBTcXVhcmVkRGlmZmVyZW5jZX0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtiaW5hcnlLZXJuZWxGdW5jfSBmcm9tICcuLi9rZXJuZWxfdXRpbHMva2VybmVsX2Z1bmNzX3V0aWxzJztcblxuY29uc3QgU1FVQVJFRF9ESUZGRVJFTkNFID0gJ3JldHVybiAoYSAtIGIpICogKGEgLSBiKTsnO1xuXG5leHBvcnQgY29uc3Qgc3F1YXJlZERpZmZlcmVuY2UgPSBiaW5hcnlLZXJuZWxGdW5jKFxuICAgIHtvcFNuaXBwZXQ6IFNRVUFSRURfRElGRkVSRU5DRSwgcGFja2VkT3BTbmlwcGV0OiBTUVVBUkVEX0RJRkZFUkVOQ0V9KTtcblxuZXhwb3J0IGNvbnN0IHNxdWFyZWREaWZmZXJlbmNlQ29uZmlnOiBLZXJuZWxDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IFNxdWFyZWREaWZmZXJlbmNlLFxuICBiYWNrZW5kTmFtZTogJ3dlYmdsJyxcbiAga2VybmVsRnVuYzogc3F1YXJlZERpZmZlcmVuY2UsXG59O1xuIl19