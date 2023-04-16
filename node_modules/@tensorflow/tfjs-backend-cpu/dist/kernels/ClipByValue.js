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
import { ClipByValue } from '@tensorflow/tfjs-core';
import { unaryKernelFunc } from '../utils/unary_utils';
export const clipByValue = unaryKernelFunc(ClipByValue, (xi, attrs) => {
    const clipAttrs = attrs;
    if (xi > clipAttrs.clipValueMax) {
        return clipAttrs.clipValueMax;
    }
    return xi < clipAttrs.clipValueMin ? clipAttrs.clipValueMin : xi;
});
export const clipByValueConfig = {
    kernelName: ClipByValue,
    backendName: 'cpu',
    kernelFunc: clipByValue,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpcEJ5VmFsdWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtY3B1L3NyYy9rZXJuZWxzL0NsaXBCeVZhbHVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxXQUFXLEVBQWlDLE1BQU0sdUJBQXVCLENBQUM7QUFFbEYsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBRXJELE1BQU0sQ0FBQyxNQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFO0lBQ3BFLE1BQU0sU0FBUyxHQUFHLEtBQStCLENBQUM7SUFDbEQsSUFBSSxFQUFFLEdBQUcsU0FBUyxDQUFDLFlBQVksRUFBRTtRQUMvQixPQUFPLFNBQVMsQ0FBQyxZQUFZLENBQUM7S0FDL0I7SUFDRCxPQUFPLEVBQUUsR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDbkUsQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBaUI7SUFDN0MsVUFBVSxFQUFFLFdBQVc7SUFDdkIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsVUFBVSxFQUFFLFdBQVc7Q0FDeEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgTGljZW5zZSk7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBBUyBJUyBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7Q2xpcEJ5VmFsdWUsIENsaXBCeVZhbHVlQXR0cnMsIEtlcm5lbENvbmZpZ30gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHt1bmFyeUtlcm5lbEZ1bmN9IGZyb20gJy4uL3V0aWxzL3VuYXJ5X3V0aWxzJztcblxuZXhwb3J0IGNvbnN0IGNsaXBCeVZhbHVlID0gdW5hcnlLZXJuZWxGdW5jKENsaXBCeVZhbHVlLCAoeGksIGF0dHJzKSA9PiB7XG4gIGNvbnN0IGNsaXBBdHRycyA9IGF0dHJzIGFzIHt9IGFzIENsaXBCeVZhbHVlQXR0cnM7XG4gIGlmICh4aSA+IGNsaXBBdHRycy5jbGlwVmFsdWVNYXgpIHtcbiAgICByZXR1cm4gY2xpcEF0dHJzLmNsaXBWYWx1ZU1heDtcbiAgfVxuICByZXR1cm4geGkgPCBjbGlwQXR0cnMuY2xpcFZhbHVlTWluID8gY2xpcEF0dHJzLmNsaXBWYWx1ZU1pbiA6IHhpO1xufSk7XG5cbmV4cG9ydCBjb25zdCBjbGlwQnlWYWx1ZUNvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBDbGlwQnlWYWx1ZSxcbiAgYmFja2VuZE5hbWU6ICdjcHUnLFxuICBrZXJuZWxGdW5jOiBjbGlwQnlWYWx1ZSxcbn07XG4iXX0=