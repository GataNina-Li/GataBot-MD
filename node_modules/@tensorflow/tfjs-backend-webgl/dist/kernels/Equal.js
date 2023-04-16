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
import { Equal } from '@tensorflow/tfjs-core';
import { binaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
import { equalImplCPU } from '../kernel_utils/shared';
const PACKED_EQUAL = `
  return vec4(equal(a, b));
`;
const EQUAL = `return float(a == b);`;
export const equal = binaryKernelFunc({
    opSnippet: EQUAL,
    packedOpSnippet: PACKED_EQUAL,
    dtype: 'bool',
    cpuKernelImpl: equalImplCPU,
});
export const equalConfig = {
    kernelName: Equal,
    backendName: 'webgl',
    kernelFunc: equal
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXF1YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2tlcm5lbHMvRXF1YWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLEtBQUssRUFBMkIsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUNwRSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDcEQsTUFBTSxZQUFZLEdBQUc7O0NBRXBCLENBQUM7QUFFRixNQUFNLEtBQUssR0FBRyx1QkFBdUIsQ0FBQztBQUV0QyxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsZ0JBQWdCLENBQUM7SUFDcEMsU0FBUyxFQUFFLEtBQUs7SUFDaEIsZUFBZSxFQUFFLFlBQVk7SUFDN0IsS0FBSyxFQUFFLE1BQU07SUFDYixhQUFhLEVBQUUsWUFBWTtDQUM1QixDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQWlCO0lBQ3ZDLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLFVBQVUsRUFBRSxLQUF5QjtDQUN0QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VxdWFsLCBLZXJuZWxDb25maWcsIEtlcm5lbEZ1bmN9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5pbXBvcnQge2JpbmFyeUtlcm5lbEZ1bmN9IGZyb20gJy4uL2tlcm5lbF91dGlscy9rZXJuZWxfZnVuY3NfdXRpbHMnO1xuaW1wb3J0IHtlcXVhbEltcGxDUFV9IGZyb20gJy4uL2tlcm5lbF91dGlscy9zaGFyZWQnO1xuY29uc3QgUEFDS0VEX0VRVUFMID0gYFxuICByZXR1cm4gdmVjNChlcXVhbChhLCBiKSk7XG5gO1xuXG5jb25zdCBFUVVBTCA9IGByZXR1cm4gZmxvYXQoYSA9PSBiKTtgO1xuXG5leHBvcnQgY29uc3QgZXF1YWwgPSBiaW5hcnlLZXJuZWxGdW5jKHtcbiAgb3BTbmlwcGV0OiBFUVVBTCxcbiAgcGFja2VkT3BTbmlwcGV0OiBQQUNLRURfRVFVQUwsXG4gIGR0eXBlOiAnYm9vbCcsXG4gIGNwdUtlcm5lbEltcGw6IGVxdWFsSW1wbENQVSxcbn0pO1xuXG5leHBvcnQgY29uc3QgZXF1YWxDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogRXF1YWwsXG4gIGJhY2tlbmROYW1lOiAnd2ViZ2wnLFxuICBrZXJuZWxGdW5jOiBlcXVhbCBhcyB7fSBhcyBLZXJuZWxGdW5jXG59O1xuIl19