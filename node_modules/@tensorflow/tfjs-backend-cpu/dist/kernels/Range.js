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
import { Range } from '@tensorflow/tfjs-core';
import { rangeImpl } from './Range_impl';
export function range(args) {
    const { backend, attrs } = args;
    const { start, stop, dtype, step } = attrs;
    const values = rangeImpl(start, stop, step, dtype);
    return backend.makeTensorInfo([values.length], dtype, values);
}
export const rangeConfig = {
    kernelName: Range,
    backendName: 'cpu',
    kernelFunc: range
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmFuZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtY3B1L3NyYy9rZXJuZWxzL1JhbmdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBMkIsS0FBSyxFQUF5QixNQUFNLHVCQUF1QixDQUFDO0FBRzlGLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFdkMsTUFBTSxVQUFVLEtBQUssQ0FBQyxJQUFrRDtJQUV0RSxNQUFNLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBQyxHQUFHLElBQUksQ0FBQztJQUM5QixNQUFNLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLEdBQUcsS0FBSyxDQUFDO0lBRXpDLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuRCxPQUFPLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2hFLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQWlCO0lBQ3ZDLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLFVBQVUsRUFBRSxLQUF5QjtDQUN0QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0tlcm5lbENvbmZpZywgS2VybmVsRnVuYywgUmFuZ2UsIFJhbmdlQXR0cnMsIFRlbnNvckluZm99IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7TWF0aEJhY2tlbmRDUFV9IGZyb20gJy4uL2JhY2tlbmRfY3B1JztcbmltcG9ydCB7cmFuZ2VJbXBsfSBmcm9tICcuL1JhbmdlX2ltcGwnO1xuXG5leHBvcnQgZnVuY3Rpb24gcmFuZ2UoYXJnczoge2JhY2tlbmQ6IE1hdGhCYWNrZW5kQ1BVLCBhdHRyczogUmFuZ2VBdHRyc30pOlxuICAgIFRlbnNvckluZm8ge1xuICBjb25zdCB7YmFja2VuZCwgYXR0cnN9ID0gYXJncztcbiAgY29uc3Qge3N0YXJ0LCBzdG9wLCBkdHlwZSwgc3RlcH0gPSBhdHRycztcblxuICBjb25zdCB2YWx1ZXMgPSByYW5nZUltcGwoc3RhcnQsIHN0b3AsIHN0ZXAsIGR0eXBlKTtcbiAgcmV0dXJuIGJhY2tlbmQubWFrZVRlbnNvckluZm8oW3ZhbHVlcy5sZW5ndGhdLCBkdHlwZSwgdmFsdWVzKTtcbn1cblxuZXhwb3J0IGNvbnN0IHJhbmdlQ29uZmlnOiBLZXJuZWxDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IFJhbmdlLFxuICBiYWNrZW5kTmFtZTogJ2NwdScsXG4gIGtlcm5lbEZ1bmM6IHJhbmdlIGFzIHt9IGFzIEtlcm5lbEZ1bmNcbn07XG4iXX0=