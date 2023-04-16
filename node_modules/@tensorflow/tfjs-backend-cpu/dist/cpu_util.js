/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
import { util } from '@tensorflow/tfjs-core';
export function assertNotComplex(tensor, opName) {
    if (!Array.isArray(tensor)) {
        tensor = [tensor];
    }
    tensor.forEach(t => {
        if (t != null) {
            util.assert(t.dtype !== 'complex64', () => `${opName} does not support complex64 tensors in the CPU backend.`);
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3B1X3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtY3B1L3NyYy9jcHVfdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQWEsSUFBSSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFdkQsTUFBTSxVQUFVLGdCQUFnQixDQUM1QixNQUErQixFQUFFLE1BQWM7SUFDakQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDMUIsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDbkI7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2pCLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRTtZQUNiLElBQUksQ0FBQyxNQUFNLENBQ1AsQ0FBQyxDQUFDLEtBQUssS0FBSyxXQUFXLEVBQ3ZCLEdBQUcsRUFBRSxDQUFDLEdBQ0YsTUFBTSx5REFBeUQsQ0FBQyxDQUFDO1NBQzFFO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge1RlbnNvckluZm8sIHV0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnROb3RDb21wbGV4KFxuICAgIHRlbnNvcjogVGVuc29ySW5mb3xUZW5zb3JJbmZvW10sIG9wTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gIGlmICghQXJyYXkuaXNBcnJheSh0ZW5zb3IpKSB7XG4gICAgdGVuc29yID0gW3RlbnNvcl07XG4gIH1cbiAgdGVuc29yLmZvckVhY2godCA9PiB7XG4gICAgaWYgKHQgIT0gbnVsbCkge1xuICAgICAgdXRpbC5hc3NlcnQoXG4gICAgICAgICAgdC5kdHlwZSAhPT0gJ2NvbXBsZXg2NCcsXG4gICAgICAgICAgKCkgPT4gYCR7XG4gICAgICAgICAgICAgIG9wTmFtZX0gZG9lcyBub3Qgc3VwcG9ydCBjb21wbGV4NjQgdGVuc29ycyBpbiB0aGUgQ1BVIGJhY2tlbmQuYCk7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==