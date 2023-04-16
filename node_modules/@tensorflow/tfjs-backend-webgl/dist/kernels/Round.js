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
import { Round } from '@tensorflow/tfjs-core';
import { unaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
const ROUND = `
  // OpenGL ES does not support round function.
  // The algorithm is based on banker's rounding.
  float base = floor(x);
  if ((x - base) < 0.5) {
    return floor(x);
  } else if ((x - base) > 0.5) {
    return ceil(x);
  } else {
    if (mod(base, 2.0) == 0.0) {
      return base;
    } else {
      return base + 1.0;
    }
  }
`;
export const round = unaryKernelFunc({ opSnippet: ROUND });
export const roundConfig = {
    kernelName: Round,
    backendName: 'webgl',
    kernelFunc: round,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm91bmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2tlcm5lbHMvUm91bmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFlLEtBQUssRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUVuRSxNQUFNLEtBQUssR0FBRzs7Ozs7Ozs7Ozs7Ozs7O0NBZWIsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztBQUV6RCxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQWlCO0lBQ3ZDLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLFVBQVUsRUFBRSxLQUFLO0NBQ2xCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7S2VybmVsQ29uZmlnLCBSb3VuZH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbmltcG9ydCB7dW5hcnlLZXJuZWxGdW5jfSBmcm9tICcuLi9rZXJuZWxfdXRpbHMva2VybmVsX2Z1bmNzX3V0aWxzJztcblxuY29uc3QgUk9VTkQgPSBgXG4gIC8vIE9wZW5HTCBFUyBkb2VzIG5vdCBzdXBwb3J0IHJvdW5kIGZ1bmN0aW9uLlxuICAvLyBUaGUgYWxnb3JpdGhtIGlzIGJhc2VkIG9uIGJhbmtlcidzIHJvdW5kaW5nLlxuICBmbG9hdCBiYXNlID0gZmxvb3IoeCk7XG4gIGlmICgoeCAtIGJhc2UpIDwgMC41KSB7XG4gICAgcmV0dXJuIGZsb29yKHgpO1xuICB9IGVsc2UgaWYgKCh4IC0gYmFzZSkgPiAwLjUpIHtcbiAgICByZXR1cm4gY2VpbCh4KTtcbiAgfSBlbHNlIHtcbiAgICBpZiAobW9kKGJhc2UsIDIuMCkgPT0gMC4wKSB7XG4gICAgICByZXR1cm4gYmFzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJhc2UgKyAxLjA7XG4gICAgfVxuICB9XG5gO1xuXG5leHBvcnQgY29uc3Qgcm91bmQgPSB1bmFyeUtlcm5lbEZ1bmMoe29wU25pcHBldDogUk9VTkR9KTtcblxuZXhwb3J0IGNvbnN0IHJvdW5kQ29uZmlnOiBLZXJuZWxDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IFJvdW5kLFxuICBiYWNrZW5kTmFtZTogJ3dlYmdsJyxcbiAga2VybmVsRnVuYzogcm91bmQsXG59O1xuIl19