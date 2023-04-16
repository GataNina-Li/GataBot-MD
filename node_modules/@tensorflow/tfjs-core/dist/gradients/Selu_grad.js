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
import { Selu } from '../kernel_names';
import { cast } from '../ops/cast';
import { exp } from '../ops/exp';
import { greater } from '../ops/greater';
import { mul } from '../ops/mul';
import { scalar } from '../ops/scalar';
import { SELU_SCALE, SELU_SCALEALPHA } from '../ops/selu_util';
import { where } from '../ops/where';
export const seluGradConfig = {
    kernelName: Selu,
    inputsToSave: ['x'],
    gradFunc: (dy, saved) => {
        const [x] = saved;
        return {
            x: () => {
                const mask = greater(x, scalar(0));
                const scaleAlpha = scalar(SELU_SCALEALPHA);
                const scale = scalar(SELU_SCALE);
                const greaterThanZeroDer = mul(dy, scale);
                const lessEqualZeroDer = mul(mul(dy, scaleAlpha), exp(cast(x, 'float32')));
                return where(mask, greaterThanZeroDer, lessEqualZeroDer);
            }
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsdV9ncmFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9ncmFkaWVudHMvU2VsdV9ncmFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUVyQyxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDL0IsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDL0IsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNyQyxPQUFPLEVBQUMsVUFBVSxFQUFFLGVBQWUsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQzdELE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFHbkMsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFlO0lBQ3hDLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFlBQVksRUFBRSxDQUFDLEdBQUcsQ0FBQztJQUNuQixRQUFRLEVBQUUsQ0FBQyxFQUFVLEVBQUUsS0FBZSxFQUFFLEVBQUU7UUFDeEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUNsQixPQUFPO1lBQ0wsQ0FBQyxFQUFFLEdBQUcsRUFBRTtnQkFDTixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVuQyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQzNDLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFFakMsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMxQyxNQUFNLGdCQUFnQixHQUNsQixHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRXRELE9BQU8sS0FBSyxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzNELENBQUM7U0FDRixDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQge1NlbHV9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge0dyYWRDb25maWd9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge2Nhc3R9IGZyb20gJy4uL29wcy9jYXN0JztcbmltcG9ydCB7ZXhwfSBmcm9tICcuLi9vcHMvZXhwJztcbmltcG9ydCB7Z3JlYXRlcn0gZnJvbSAnLi4vb3BzL2dyZWF0ZXInO1xuaW1wb3J0IHttdWx9IGZyb20gJy4uL29wcy9tdWwnO1xuaW1wb3J0IHtzY2FsYXJ9IGZyb20gJy4uL29wcy9zY2FsYXInO1xuaW1wb3J0IHtTRUxVX1NDQUxFLCBTRUxVX1NDQUxFQUxQSEF9IGZyb20gJy4uL29wcy9zZWx1X3V0aWwnO1xuaW1wb3J0IHt3aGVyZX0gZnJvbSAnLi4vb3BzL3doZXJlJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuXG5leHBvcnQgY29uc3Qgc2VsdUdyYWRDb25maWc6IEdyYWRDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IFNlbHUsXG4gIGlucHV0c1RvU2F2ZTogWyd4J10sXG4gIGdyYWRGdW5jOiAoZHk6IFRlbnNvciwgc2F2ZWQ6IFRlbnNvcltdKSA9PiB7XG4gICAgY29uc3QgW3hdID0gc2F2ZWQ7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6ICgpID0+IHtcbiAgICAgICAgY29uc3QgbWFzayA9IGdyZWF0ZXIoeCwgc2NhbGFyKDApKTtcblxuICAgICAgICBjb25zdCBzY2FsZUFscGhhID0gc2NhbGFyKFNFTFVfU0NBTEVBTFBIQSk7XG4gICAgICAgIGNvbnN0IHNjYWxlID0gc2NhbGFyKFNFTFVfU0NBTEUpO1xuXG4gICAgICAgIGNvbnN0IGdyZWF0ZXJUaGFuWmVyb0RlciA9IG11bChkeSwgc2NhbGUpO1xuICAgICAgICBjb25zdCBsZXNzRXF1YWxaZXJvRGVyID1cbiAgICAgICAgICAgIG11bChtdWwoZHksIHNjYWxlQWxwaGEpLCBleHAoY2FzdCh4LCAnZmxvYXQzMicpKSk7XG5cbiAgICAgICAgcmV0dXJuIHdoZXJlKG1hc2ssIGdyZWF0ZXJUaGFuWmVyb0RlciwgbGVzc0VxdWFsWmVyb0Rlcik7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcbiJdfQ==