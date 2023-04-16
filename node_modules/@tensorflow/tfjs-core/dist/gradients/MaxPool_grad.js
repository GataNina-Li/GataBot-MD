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
import { MaxPool } from '../kernel_names';
import { maxPoolGrad } from '../ops/max_pool_grad';
export const maxPoolGradConfig = {
    kernelName: MaxPool,
    inputsToSave: ['x'],
    outputsToSave: [true],
    gradFunc: (dy, saved, attrs) => {
        const [x, y] = saved;
        const { filterSize, strides, pad } = attrs;
        return {
            x: () => maxPoolGrad(dy, x, y, filterSize, strides, pad)
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWF4UG9vbF9ncmFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9ncmFkaWVudHMvTWF4UG9vbF9ncmFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxPQUFPLEVBQWUsTUFBTSxpQkFBaUIsQ0FBQztBQUV0RCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFHakQsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQWU7SUFDM0MsVUFBVSxFQUFFLE9BQU87SUFDbkIsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQ25CLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQztJQUNyQixRQUFRLEVBQUUsQ0FBQyxFQUFVLEVBQUUsS0FBZSxFQUFFLEtBQW1CLEVBQUUsRUFBRTtRQUM3RCxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQTZCLENBQUM7UUFDN0MsTUFBTSxFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFDLEdBQUcsS0FBMkIsQ0FBQztRQUUvRCxPQUFPO1lBQ0wsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFjLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQztTQUNyRSxDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7TWF4UG9vbCwgTWF4UG9vbEF0dHJzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtHcmFkQ29uZmlnLCBOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge21heFBvb2xHcmFkfSBmcm9tICcuLi9vcHMvbWF4X3Bvb2xfZ3JhZCc7XG5pbXBvcnQge1RlbnNvciwgVGVuc29yNER9IGZyb20gJy4uL3RlbnNvcic7XG5cbmV4cG9ydCBjb25zdCBtYXhQb29sR3JhZENvbmZpZzogR3JhZENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogTWF4UG9vbCxcbiAgaW5wdXRzVG9TYXZlOiBbJ3gnXSxcbiAgb3V0cHV0c1RvU2F2ZTogW3RydWVdLFxuICBncmFkRnVuYzogKGR5OiBUZW5zb3IsIHNhdmVkOiBUZW5zb3JbXSwgYXR0cnM6IE5hbWVkQXR0ck1hcCkgPT4ge1xuICAgIGNvbnN0IFt4LCB5XSA9IHNhdmVkIGFzIFtUZW5zb3I0RCwgVGVuc29yNERdO1xuICAgIGNvbnN0IHtmaWx0ZXJTaXplLCBzdHJpZGVzLCBwYWR9ID0gYXR0cnMgYXMge30gYXMgTWF4UG9vbEF0dHJzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6ICgpID0+IG1heFBvb2xHcmFkKGR5IGFzIFRlbnNvcjRELCB4LCB5LCBmaWx0ZXJTaXplLCBzdHJpZGVzLCBwYWQpXG4gICAgfTtcbiAgfVxufTtcbiJdfQ==