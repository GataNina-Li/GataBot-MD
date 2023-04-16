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
import { Softplus } from '@tensorflow/tfjs-core';
import { unaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
const SOFTPLUS = `
  float epsilon = 1.1920928955078125e-7;
  float threshold = log(epsilon) + 2.0;

  bool too_large = x > -threshold;
  bool too_small = x < threshold;

  float result;
  float exp_x = exp(x);

  if (too_large){
    result = x;
  }
  else if (too_small){
    result = exp_x;
  }
  else{
    result = log(exp_x + 1.0);
  }
  return result;
`;
export const softplus = unaryKernelFunc({ opSnippet: SOFTPLUS });
export const softplusConfig = {
    kernelName: Softplus,
    backendName: 'webgl',
    kernelFunc: softplus,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU29mdHBsdXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2tlcm5lbHMvU29mdHBsdXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFlLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzdELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUVuRSxNQUFNLFFBQVEsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FvQmhCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsZUFBZSxDQUFDLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7QUFFL0QsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFpQjtJQUMxQyxVQUFVLEVBQUUsUUFBUTtJQUNwQixXQUFXLEVBQUUsT0FBTztJQUNwQixVQUFVLEVBQUUsUUFBUTtDQUNyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0tlcm5lbENvbmZpZywgU29mdHBsdXN9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5pbXBvcnQge3VuYXJ5S2VybmVsRnVuY30gZnJvbSAnLi4va2VybmVsX3V0aWxzL2tlcm5lbF9mdW5jc191dGlscyc7XG5cbmNvbnN0IFNPRlRQTFVTID0gYFxuICBmbG9hdCBlcHNpbG9uID0gMS4xOTIwOTI4OTU1MDc4MTI1ZS03O1xuICBmbG9hdCB0aHJlc2hvbGQgPSBsb2coZXBzaWxvbikgKyAyLjA7XG5cbiAgYm9vbCB0b29fbGFyZ2UgPSB4ID4gLXRocmVzaG9sZDtcbiAgYm9vbCB0b29fc21hbGwgPSB4IDwgdGhyZXNob2xkO1xuXG4gIGZsb2F0IHJlc3VsdDtcbiAgZmxvYXQgZXhwX3ggPSBleHAoeCk7XG5cbiAgaWYgKHRvb19sYXJnZSl7XG4gICAgcmVzdWx0ID0geDtcbiAgfVxuICBlbHNlIGlmICh0b29fc21hbGwpe1xuICAgIHJlc3VsdCA9IGV4cF94O1xuICB9XG4gIGVsc2V7XG4gICAgcmVzdWx0ID0gbG9nKGV4cF94ICsgMS4wKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xuYDtcblxuZXhwb3J0IGNvbnN0IHNvZnRwbHVzID0gdW5hcnlLZXJuZWxGdW5jKHtvcFNuaXBwZXQ6IFNPRlRQTFVTfSk7XG5cbmV4cG9ydCBjb25zdCBzb2Z0cGx1c0NvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBTb2Z0cGx1cyxcbiAgYmFja2VuZE5hbWU6ICd3ZWJnbCcsXG4gIGtlcm5lbEZ1bmM6IHNvZnRwbHVzLFxufTtcbiJdfQ==