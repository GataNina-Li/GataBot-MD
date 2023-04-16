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
import { backend_util, Selu } from '@tensorflow/tfjs-core';
import { unaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
const SELU = `
  // Stable and Attracting Fixed Point (0, 1) for Normalized Weights.
  // see: https://arxiv.org/abs/1706.02515
  float scaleAlpha = ${backend_util.SELU_SCALEALPHA};
  float scale = ${backend_util.SELU_SCALE};
  return (x >= 0.0) ? scale * x : scaleAlpha * (exp(x) - 1.0);
`;
export const selu = unaryKernelFunc({ opSnippet: SELU });
export const seluConfig = {
    kernelName: Selu,
    backendName: 'webgl',
    kernelFunc: selu,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMva2VybmVscy9TZWx1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQWdCLElBQUksRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRXZFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUVuRSxNQUFNLElBQUksR0FBRzs7O3VCQUdVLFlBQVksQ0FBQyxlQUFlO2tCQUNqQyxZQUFZLENBQUMsVUFBVTs7Q0FFeEMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxlQUFlLENBQUMsRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztBQUV2RCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQWlCO0lBQ3RDLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLFVBQVUsRUFBRSxJQUFJO0NBQ2pCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7YmFja2VuZF91dGlsLCBLZXJuZWxDb25maWcsIFNlbHV9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7dW5hcnlLZXJuZWxGdW5jfSBmcm9tICcuLi9rZXJuZWxfdXRpbHMva2VybmVsX2Z1bmNzX3V0aWxzJztcblxuY29uc3QgU0VMVSA9IGBcbiAgLy8gU3RhYmxlIGFuZCBBdHRyYWN0aW5nIEZpeGVkIFBvaW50ICgwLCAxKSBmb3IgTm9ybWFsaXplZCBXZWlnaHRzLlxuICAvLyBzZWU6IGh0dHBzOi8vYXJ4aXYub3JnL2Ficy8xNzA2LjAyNTE1XG4gIGZsb2F0IHNjYWxlQWxwaGEgPSAke2JhY2tlbmRfdXRpbC5TRUxVX1NDQUxFQUxQSEF9O1xuICBmbG9hdCBzY2FsZSA9ICR7YmFja2VuZF91dGlsLlNFTFVfU0NBTEV9O1xuICByZXR1cm4gKHggPj0gMC4wKSA/IHNjYWxlICogeCA6IHNjYWxlQWxwaGEgKiAoZXhwKHgpIC0gMS4wKTtcbmA7XG5cbmV4cG9ydCBjb25zdCBzZWx1ID0gdW5hcnlLZXJuZWxGdW5jKHtvcFNuaXBwZXQ6IFNFTFV9KTtcblxuZXhwb3J0IGNvbnN0IHNlbHVDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogU2VsdSxcbiAgYmFja2VuZE5hbWU6ICd3ZWJnbCcsXG4gIGtlcm5lbEZ1bmM6IHNlbHUsXG59O1xuIl19