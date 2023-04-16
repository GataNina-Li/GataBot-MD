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
import { Acos } from '../kernel_names';
import { cast } from '../ops/cast';
import { div } from '../ops/div';
import { neg } from '../ops/neg';
import { scalar } from '../ops/scalar';
import { sqrt } from '../ops/sqrt';
import { square } from '../ops/square';
import { sub } from '../ops/sub';
export const acosGradConfig = {
    kernelName: Acos,
    inputsToSave: ['x'],
    gradFunc: (dy, saved) => {
        const [x] = saved;
        return {
            x: () => {
                const a = square(cast(x, 'float32'));
                const b = sqrt(sub(scalar(1), a));
                return neg(div(dy, b));
            }
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWNvc19ncmFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9ncmFkaWVudHMvQWNvc19ncmFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUVyQyxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDL0IsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUMvQixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3JDLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDakMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNyQyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRy9CLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBZTtJQUN4QyxVQUFVLEVBQUUsSUFBSTtJQUNoQixZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDbkIsUUFBUSxFQUFFLENBQUMsRUFBVSxFQUFFLEtBQWUsRUFBRSxFQUFFO1FBQ3hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7UUFFbEIsT0FBTztZQUNMLENBQUMsRUFBRSxHQUFHLEVBQUU7Z0JBQ04sTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDckMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLENBQUM7U0FFRixDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7QWNvc30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7R3JhZENvbmZpZ30gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7Y2FzdH0gZnJvbSAnLi4vb3BzL2Nhc3QnO1xuaW1wb3J0IHtkaXZ9IGZyb20gJy4uL29wcy9kaXYnO1xuaW1wb3J0IHtuZWd9IGZyb20gJy4uL29wcy9uZWcnO1xuaW1wb3J0IHtzY2FsYXJ9IGZyb20gJy4uL29wcy9zY2FsYXInO1xuaW1wb3J0IHtzcXJ0fSBmcm9tICcuLi9vcHMvc3FydCc7XG5pbXBvcnQge3NxdWFyZX0gZnJvbSAnLi4vb3BzL3NxdWFyZSc7XG5pbXBvcnQge3N1Yn0gZnJvbSAnLi4vb3BzL3N1Yic7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcblxuZXhwb3J0IGNvbnN0IGFjb3NHcmFkQ29uZmlnOiBHcmFkQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBBY29zLFxuICBpbnB1dHNUb1NhdmU6IFsneCddLFxuICBncmFkRnVuYzogKGR5OiBUZW5zb3IsIHNhdmVkOiBUZW5zb3JbXSkgPT4ge1xuICAgIGNvbnN0IFt4XSA9IHNhdmVkO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6ICgpID0+IHtcbiAgICAgICAgY29uc3QgYSA9IHNxdWFyZShjYXN0KHgsICdmbG9hdDMyJykpO1xuICAgICAgICBjb25zdCBiID0gc3FydChzdWIoc2NhbGFyKDEpLCBhKSk7XG4gICAgICAgIHJldHVybiBuZWcoZGl2KGR5LCBiKSk7XG4gICAgICB9XG5cbiAgICB9O1xuICB9XG59O1xuIl19