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
import { backend_util, Selu } from '@tensorflow/tfjs-core';
import { unaryKernelFunc } from '../utils/unary_utils';
const scaleAlpha = backend_util.SELU_SCALEALPHA;
const scale = backend_util.SELU_SCALE;
export const selu = unaryKernelFunc(Selu, (xi) => {
    if (xi >= 0) {
        return scale * xi;
    }
    else {
        return scaleAlpha * (Math.exp(xi) - 1);
    }
});
export const seluConfig = {
    kernelName: Selu,
    backendName: 'cpu',
    kernelFunc: selu,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC1jcHUvc3JjL2tlcm5lbHMvU2VsdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFnQixJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUV2RSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFckQsTUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDLGVBQWUsQ0FBQztBQUNoRCxNQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDO0FBRXRDLE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDL0MsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFO1FBQ1gsT0FBTyxLQUFLLEdBQUcsRUFBRSxDQUFDO0tBQ25CO1NBQU07UUFDTCxPQUFPLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDeEM7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBaUI7SUFDdEMsVUFBVSxFQUFFLElBQUk7SUFDaEIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsVUFBVSxFQUFFLElBQUk7Q0FDakIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgTGljZW5zZSk7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBBUyBJUyBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7YmFja2VuZF91dGlsLCBLZXJuZWxDb25maWcsIFNlbHV9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7dW5hcnlLZXJuZWxGdW5jfSBmcm9tICcuLi91dGlscy91bmFyeV91dGlscyc7XG5cbmNvbnN0IHNjYWxlQWxwaGEgPSBiYWNrZW5kX3V0aWwuU0VMVV9TQ0FMRUFMUEhBO1xuY29uc3Qgc2NhbGUgPSBiYWNrZW5kX3V0aWwuU0VMVV9TQ0FMRTtcblxuZXhwb3J0IGNvbnN0IHNlbHUgPSB1bmFyeUtlcm5lbEZ1bmMoU2VsdSwgKHhpKSA9PiB7XG4gIGlmICh4aSA+PSAwKSB7XG4gICAgcmV0dXJuIHNjYWxlICogeGk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHNjYWxlQWxwaGEgKiAoTWF0aC5leHAoeGkpIC0gMSk7XG4gIH1cbn0pO1xuXG5leHBvcnQgY29uc3Qgc2VsdUNvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBTZWx1LFxuICBiYWNrZW5kTmFtZTogJ2NwdScsXG4gIGtlcm5lbEZ1bmM6IHNlbHUsXG59O1xuIl19