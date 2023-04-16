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
import { AvgPool } from '../kernel_names';
import { avgPoolGrad } from '../ops/avg_pool_grad';
export const avgPoolGradConfig = {
    kernelName: AvgPool,
    inputsToSave: ['x'],
    gradFunc: (dy, saved, attrs) => {
        const [x] = saved;
        const { filterSize, strides, pad } = attrs;
        return { x: () => avgPoolGrad(dy, x, filterSize, strides, pad) };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXZnUG9vbF9ncmFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9ncmFkaWVudHMvQXZnUG9vbF9ncmFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxPQUFPLEVBQWUsTUFBTSxpQkFBaUIsQ0FBQztBQUV0RCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFHakQsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQWU7SUFDM0MsVUFBVSxFQUFFLE9BQU87SUFDbkIsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQ25CLFFBQVEsRUFBRSxDQUFDLEVBQVUsRUFBRSxLQUFlLEVBQUUsS0FBbUIsRUFBRSxFQUFFO1FBQzdELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFtQixDQUFDO1FBQ2hDLE1BQU0sRUFBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBQyxHQUFHLEtBQTJCLENBQUM7UUFDL0QsT0FBTyxFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBYyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFDLENBQUM7SUFDN0UsQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7QXZnUG9vbCwgQXZnUG9vbEF0dHJzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtHcmFkQ29uZmlnLCBOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge2F2Z1Bvb2xHcmFkfSBmcm9tICcuLi9vcHMvYXZnX3Bvb2xfZ3JhZCc7XG5pbXBvcnQge1RlbnNvciwgVGVuc29yNER9IGZyb20gJy4uL3RlbnNvcic7XG5cbmV4cG9ydCBjb25zdCBhdmdQb29sR3JhZENvbmZpZzogR3JhZENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogQXZnUG9vbCxcbiAgaW5wdXRzVG9TYXZlOiBbJ3gnXSxcbiAgZ3JhZEZ1bmM6IChkeTogVGVuc29yLCBzYXZlZDogVGVuc29yW10sIGF0dHJzOiBOYW1lZEF0dHJNYXApID0+IHtcbiAgICBjb25zdCBbeF0gPSBzYXZlZCBhcyBbVGVuc29yNERdO1xuICAgIGNvbnN0IHtmaWx0ZXJTaXplLCBzdHJpZGVzLCBwYWR9ID0gYXR0cnMgYXMge30gYXMgQXZnUG9vbEF0dHJzO1xuICAgIHJldHVybiB7eDogKCkgPT4gYXZnUG9vbEdyYWQoZHkgYXMgVGVuc29yNEQsIHgsIGZpbHRlclNpemUsIHN0cmlkZXMsIHBhZCl9O1xuICB9XG59O1xuIl19