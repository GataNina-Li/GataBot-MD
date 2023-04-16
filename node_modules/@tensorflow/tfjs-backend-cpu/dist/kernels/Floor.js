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
import { Floor } from '@tensorflow/tfjs-core';
import { createSimpleUnaryImpl } from '../utils/unary_impl';
import { unaryKernelFuncFromImpl } from '../utils/unary_utils';
export const floorImpl = createSimpleUnaryImpl((xi) => Math.floor(xi));
export const floor = unaryKernelFuncFromImpl(Floor, floorImpl);
export const floorConfig = {
    kernelName: Floor,
    backendName: 'cpu',
    kernelFunc: floor,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmxvb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtY3B1L3NyYy9rZXJuZWxzL0Zsb29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxLQUFLLEVBQWUsTUFBTSx1QkFBdUIsQ0FBQztBQUUxRCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUMxRCxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUU3RCxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQUcscUJBQXFCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2RSxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsdUJBQXVCLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBRS9ELE1BQU0sQ0FBQyxNQUFNLFdBQVcsR0FBaUI7SUFDdkMsVUFBVSxFQUFFLEtBQUs7SUFDakIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsVUFBVSxFQUFFLEtBQUs7Q0FDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgTGljZW5zZSk7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBBUyBJUyBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7Rmxvb3IsIEtlcm5lbENvbmZpZ30gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtjcmVhdGVTaW1wbGVVbmFyeUltcGx9IGZyb20gJy4uL3V0aWxzL3VuYXJ5X2ltcGwnO1xuaW1wb3J0IHt1bmFyeUtlcm5lbEZ1bmNGcm9tSW1wbH0gZnJvbSAnLi4vdXRpbHMvdW5hcnlfdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgZmxvb3JJbXBsID0gY3JlYXRlU2ltcGxlVW5hcnlJbXBsKCh4aSkgPT4gTWF0aC5mbG9vcih4aSkpO1xuZXhwb3J0IGNvbnN0IGZsb29yID0gdW5hcnlLZXJuZWxGdW5jRnJvbUltcGwoRmxvb3IsIGZsb29ySW1wbCk7XG5cbmV4cG9ydCBjb25zdCBmbG9vckNvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBGbG9vcixcbiAgYmFja2VuZE5hbWU6ICdjcHUnLFxuICBrZXJuZWxGdW5jOiBmbG9vcixcbn07XG4iXX0=