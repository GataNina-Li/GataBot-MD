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
import { Step } from '@tensorflow/tfjs-core';
import { unaryKernelFunc } from '../utils/unary_utils';
export const step = unaryKernelFunc(Step, (xi, attrs) => {
    const stepAttrs = attrs;
    if (isNaN(xi)) {
        return NaN;
    }
    else {
        return xi > 0 ? 1 : stepAttrs.alpha;
    }
});
export const stepConfig = {
    kernelName: Step,
    backendName: 'cpu',
    kernelFunc: step,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RlcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC1jcHUvc3JjL2tlcm5lbHMvU3RlcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQWUsSUFBSSxFQUFZLE1BQU0sdUJBQXVCLENBQUM7QUFFcEUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBRXJELE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFO0lBQ3RELE1BQU0sU0FBUyxHQUFHLEtBQXdCLENBQUM7SUFDM0MsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDYixPQUFPLEdBQUcsQ0FBQztLQUNaO1NBQU07UUFDTCxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztLQUNyQztBQUNILENBQUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFpQjtJQUN0QyxVQUFVLEVBQUUsSUFBSTtJQUNoQixXQUFXLEVBQUUsS0FBSztJQUNsQixVQUFVLEVBQUUsSUFBSTtDQUNqQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBMaWNlbnNlKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIEFTIElTIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtLZXJuZWxDb25maWcsIFN0ZXAsIFN0ZXBBdHRyc30gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHt1bmFyeUtlcm5lbEZ1bmN9IGZyb20gJy4uL3V0aWxzL3VuYXJ5X3V0aWxzJztcblxuZXhwb3J0IGNvbnN0IHN0ZXAgPSB1bmFyeUtlcm5lbEZ1bmMoU3RlcCwgKHhpLCBhdHRycykgPT4ge1xuICBjb25zdCBzdGVwQXR0cnMgPSBhdHRycyBhcyB7fSBhcyBTdGVwQXR0cnM7XG4gIGlmIChpc05hTih4aSkpIHtcbiAgICByZXR1cm4gTmFOO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB4aSA+IDAgPyAxIDogc3RlcEF0dHJzLmFscGhhO1xuICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IHN0ZXBDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogU3RlcCxcbiAgYmFja2VuZE5hbWU6ICdjcHUnLFxuICBrZXJuZWxGdW5jOiBzdGVwLFxufTtcbiJdfQ==