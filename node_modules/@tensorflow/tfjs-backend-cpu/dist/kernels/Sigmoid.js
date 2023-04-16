/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import { Sigmoid } from '@tensorflow/tfjs-core';
import { createSimpleUnaryImpl } from '../utils/unary_impl';
import { unaryKernelFunc } from '../utils/unary_utils';
export const sigmoidImpl = createSimpleUnaryImpl((xi) => 1 / (1 + Math.exp(-xi)));
export const sigmoid = unaryKernelFunc(Sigmoid, (xi) => 1 / (1 + Math.exp(-xi)));
export const sigmoidConfig = {
    kernelName: Sigmoid,
    backendName: 'cpu',
    kernelFunc: sigmoid,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2lnbW9pZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC1jcHUvc3JjL2tlcm5lbHMvU2lnbW9pZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQWUsT0FBTyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFNUQsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDMUQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBRXJELE1BQU0sQ0FBQyxNQUFNLFdBQVcsR0FDcEIscUJBQXFCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNELE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FDaEIsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFOUQsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFpQjtJQUN6QyxVQUFVLEVBQUUsT0FBTztJQUNuQixXQUFXLEVBQUUsS0FBSztJQUNsQixVQUFVLEVBQUUsT0FBTztDQUNwQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBMaWNlbnNlKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIEFTIElTIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtLZXJuZWxDb25maWcsIFNpZ21vaWR9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7Y3JlYXRlU2ltcGxlVW5hcnlJbXBsfSBmcm9tICcuLi91dGlscy91bmFyeV9pbXBsJztcbmltcG9ydCB7dW5hcnlLZXJuZWxGdW5jfSBmcm9tICcuLi91dGlscy91bmFyeV91dGlscyc7XG5cbmV4cG9ydCBjb25zdCBzaWdtb2lkSW1wbCA9XG4gICAgY3JlYXRlU2ltcGxlVW5hcnlJbXBsKCh4aSkgPT4gMSAvICgxICsgTWF0aC5leHAoLXhpKSkpO1xuZXhwb3J0IGNvbnN0IHNpZ21vaWQgPVxuICAgIHVuYXJ5S2VybmVsRnVuYyhTaWdtb2lkLCAoeGkpID0+IDEgLyAoMSArIE1hdGguZXhwKC14aSkpKTtcblxuZXhwb3J0IGNvbnN0IHNpZ21vaWRDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogU2lnbW9pZCxcbiAgYmFja2VuZE5hbWU6ICdjcHUnLFxuICBrZXJuZWxGdW5jOiBzaWdtb2lkLFxufTtcbiJdfQ==