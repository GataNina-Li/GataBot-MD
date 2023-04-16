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
import { ENGINE } from '../engine';
import { ResizeBilinear, ResizeBilinearGrad } from '../kernel_names';
export const resizeBilinearGradConfig = {
    kernelName: ResizeBilinear,
    inputsToSave: ['images'],
    gradFunc: (dy, saved, attrs) => {
        const [images] = saved;
        const inputs = { dy, images };
        const imagesDer = () => 
        // tslint:disable-next-line: no-unnecessary-type-assertion
        ENGINE.runKernel(ResizeBilinearGrad, inputs, attrs);
        return { images: imagesDer };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzaXplQmlsaW5lYXJfZ3JhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvZ3JhZGllbnRzL1Jlc2l6ZUJpbGluZWFyX2dyYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsY0FBYyxFQUFFLGtCQUFrQixFQUEyQixNQUFNLGlCQUFpQixDQUFDO0FBTTdGLE1BQU0sQ0FBQyxNQUFNLHdCQUF3QixHQUFlO0lBQ2xELFVBQVUsRUFBRSxjQUFjO0lBQzFCLFlBQVksRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUN4QixRQUFRLEVBQUUsQ0FBQyxFQUFZLEVBQUUsS0FBZSxFQUFFLEtBQW1CLEVBQUUsRUFBRTtRQUMvRCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBRXZCLE1BQU0sTUFBTSxHQUE2QixFQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUMsQ0FBQztRQUN0RCxNQUFNLFNBQVMsR0FBRyxHQUFHLEVBQUU7UUFDbkIsMERBQTBEO1FBQzFELE1BQU0sQ0FBQyxTQUFTLENBQ1osa0JBQWtCLEVBQUUsTUFBOEIsRUFBRSxLQUFLLENBQ3JELENBQUM7UUFFYixPQUFPLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBQyxDQUFDO0lBQzdCLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge1Jlc2l6ZUJpbGluZWFyLCBSZXNpemVCaWxpbmVhckdyYWQsIFJlc2l6ZUJpbGluZWFyR3JhZElucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7R3JhZENvbmZpZ30gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7TmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtUZW5zb3IsIFRlbnNvcjREfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IHJlc2l6ZUJpbGluZWFyR3JhZENvbmZpZzogR3JhZENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogUmVzaXplQmlsaW5lYXIsXG4gIGlucHV0c1RvU2F2ZTogWydpbWFnZXMnXSxcbiAgZ3JhZEZ1bmM6IChkeTogVGVuc29yNEQsIHNhdmVkOiBUZW5zb3JbXSwgYXR0cnM6IE5hbWVkQXR0ck1hcCkgPT4ge1xuICAgIGNvbnN0IFtpbWFnZXNdID0gc2F2ZWQ7XG5cbiAgICBjb25zdCBpbnB1dHM6IFJlc2l6ZUJpbGluZWFyR3JhZElucHV0cyA9IHtkeSwgaW1hZ2VzfTtcbiAgICBjb25zdCBpbWFnZXNEZXIgPSAoKSA9PlxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVubmVjZXNzYXJ5LXR5cGUtYXNzZXJ0aW9uXG4gICAgICAgIEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICAgICAgICBSZXNpemVCaWxpbmVhckdyYWQsIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCwgYXR0cnMpIGFzXG4gICAgICAgIFRlbnNvcjREO1xuXG4gICAgcmV0dXJuIHtpbWFnZXM6IGltYWdlc0Rlcn07XG4gIH1cbn07XG4iXX0=