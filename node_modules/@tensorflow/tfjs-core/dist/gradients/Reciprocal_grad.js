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
import { Reciprocal } from '../kernel_names';
import { div } from '../ops/div';
import { neg } from '../ops/neg';
import { square } from '../ops/square';
export const reciprocalGradConfig = {
    kernelName: Reciprocal,
    inputsToSave: ['x'],
    gradFunc: (dy, saved) => {
        const [x] = saved;
        return { x: () => div(dy, neg(square(x))) };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVjaXByb2NhbF9ncmFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9ncmFkaWVudHMvUmVjaXByb2NhbF9ncmFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUUzQyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDL0IsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUdyQyxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBZTtJQUM5QyxVQUFVLEVBQUUsVUFBVTtJQUN0QixZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDbkIsUUFBUSxFQUFFLENBQUMsRUFBVSxFQUFFLEtBQWUsRUFBRSxFQUFFO1FBQ3hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDbEIsT0FBTyxFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUM7SUFDNUMsQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7UmVjaXByb2NhbH0gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7R3JhZENvbmZpZ30gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7ZGl2fSBmcm9tICcuLi9vcHMvZGl2JztcbmltcG9ydCB7bmVnfSBmcm9tICcuLi9vcHMvbmVnJztcbmltcG9ydCB7c3F1YXJlfSBmcm9tICcuLi9vcHMvc3F1YXJlJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuXG5leHBvcnQgY29uc3QgcmVjaXByb2NhbEdyYWRDb25maWc6IEdyYWRDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IFJlY2lwcm9jYWwsXG4gIGlucHV0c1RvU2F2ZTogWyd4J10sXG4gIGdyYWRGdW5jOiAoZHk6IFRlbnNvciwgc2F2ZWQ6IFRlbnNvcltdKSA9PiB7XG4gICAgY29uc3QgW3hdID0gc2F2ZWQ7XG4gICAgcmV0dXJuIHt4OiAoKSA9PiBkaXYoZHksIG5lZyhzcXVhcmUoeCkpKX07XG4gIH1cbn07XG4iXX0=