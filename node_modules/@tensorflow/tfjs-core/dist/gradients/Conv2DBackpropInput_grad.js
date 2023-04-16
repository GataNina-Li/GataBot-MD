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
import { Conv2DBackpropInput } from '../kernel_names';
import { conv2d } from '../ops/conv2d';
import { conv2DBackpropFilter } from '../ops/conv2d_backprop_filter';
export const conv2DBackpropInputGradConfig = {
    kernelName: Conv2DBackpropInput,
    inputsToSave: ['dy', 'filter'],
    gradFunc: (ddx, saved, attrs) => {
        const [dy, filter] = saved;
        const { strides, pad, dataFormat, dimRoundingMode } = attrs;
        return {
            dy: () => conv2d(ddx, filter, strides, pad, dataFormat, 1 /* dilations */, dimRoundingMode),
            filter: () => conv2DBackpropFilter(ddx, dy, filter.shape, strides, pad, dataFormat, dimRoundingMode)
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udjJEQmFja3Byb3BJbnB1dF9ncmFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9ncmFkaWVudHMvQ29udjJEQmFja3Byb3BJbnB1dF9ncmFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE9BQU8sRUFBQyxtQkFBbUIsRUFBMkIsTUFBTSxpQkFBaUIsQ0FBQztBQUU5RSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3JDLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBR25FLE1BQU0sQ0FBQyxNQUFNLDZCQUE2QixHQUFlO0lBQ3ZELFVBQVUsRUFBRSxtQkFBbUI7SUFDL0IsWUFBWSxFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQztJQUM5QixRQUFRLEVBQUUsQ0FBQyxHQUFhLEVBQUUsS0FBZSxFQUFFLEtBQW1CLEVBQUUsRUFBRTtRQUNoRSxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxHQUFHLEtBQTZCLENBQUM7UUFFbkQsTUFBTSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBQyxHQUM3QyxLQUF1QyxDQUFDO1FBRTVDLE9BQU87WUFDTCxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUNaLEdBQUcsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLGVBQWUsRUFDeEQsZUFBZSxDQUFDO1lBQ3BCLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxvQkFBb0IsQ0FDOUIsR0FBRyxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQztTQUN0RSxDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQge0NvbnYyREJhY2twcm9wSW5wdXQsIENvbnYyREJhY2twcm9wSW5wdXRBdHRyc30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7R3JhZENvbmZpZywgTmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtjb252MmR9IGZyb20gJy4uL29wcy9jb252MmQnO1xuaW1wb3J0IHtjb252MkRCYWNrcHJvcEZpbHRlcn0gZnJvbSAnLi4vb3BzL2NvbnYyZF9iYWNrcHJvcF9maWx0ZXInO1xuaW1wb3J0IHtUZW5zb3IsIFRlbnNvcjREfSBmcm9tICcuLi90ZW5zb3InO1xuXG5leHBvcnQgY29uc3QgY29udjJEQmFja3Byb3BJbnB1dEdyYWRDb25maWc6IEdyYWRDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IENvbnYyREJhY2twcm9wSW5wdXQsXG4gIGlucHV0c1RvU2F2ZTogWydkeScsICdmaWx0ZXInXSxcbiAgZ3JhZEZ1bmM6IChkZHg6IFRlbnNvcjRELCBzYXZlZDogVGVuc29yW10sIGF0dHJzOiBOYW1lZEF0dHJNYXApID0+IHtcbiAgICBjb25zdCBbZHksIGZpbHRlcl0gPSBzYXZlZCBhcyBbVGVuc29yNEQsIFRlbnNvcjREXTtcblxuICAgIGNvbnN0IHtzdHJpZGVzLCBwYWQsIGRhdGFGb3JtYXQsIGRpbVJvdW5kaW5nTW9kZX0gPVxuICAgICAgICBhdHRycyBhcyB7fSBhcyBDb252MkRCYWNrcHJvcElucHV0QXR0cnM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZHk6ICgpID0+IGNvbnYyZChcbiAgICAgICAgICBkZHgsIGZpbHRlciwgc3RyaWRlcywgcGFkLCBkYXRhRm9ybWF0LCAxIC8qIGRpbGF0aW9ucyAqLyxcbiAgICAgICAgICBkaW1Sb3VuZGluZ01vZGUpLFxuICAgICAgZmlsdGVyOiAoKSA9PiBjb252MkRCYWNrcHJvcEZpbHRlcihcbiAgICAgICAgICBkZHgsIGR5LCBmaWx0ZXIuc2hhcGUsIHN0cmlkZXMsIHBhZCwgZGF0YUZvcm1hdCwgZGltUm91bmRpbmdNb2RlKVxuICAgIH07XG4gIH1cbn07XG4iXX0=