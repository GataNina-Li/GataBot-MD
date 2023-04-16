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
import { LeakyRelu } from '../kernel_names';
import { greater } from '../ops/greater';
import { mul } from '../ops/mul';
import { where } from '../ops/where';
export const leakyReluGradConfig = {
    kernelName: LeakyRelu,
    inputsToSave: ['x'],
    gradFunc: (dy, saved, attrs) => {
        const [x] = saved;
        const { alpha } = attrs;
        const mask = greater(x, 0);
        // Returns `gradients * (features > 0) + alpha * gradients * (features <=
        // 0)`.
        return { x: () => where(mask, dy, mul(dy, alpha)) };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGVha3lSZWx1X2dyYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2dyYWRpZW50cy9MZWFreVJlbHVfZ3JhZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxPQUFPLEVBQUMsU0FBUyxFQUFpQixNQUFNLGlCQUFpQixDQUFDO0FBRTFELE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2QyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFHbkMsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQWU7SUFDN0MsVUFBVSxFQUFFLFNBQVM7SUFDckIsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQ25CLFFBQVEsRUFBRSxDQUFDLEVBQVUsRUFBRSxLQUFlLEVBQUUsS0FBbUIsRUFBRSxFQUFFO1FBQzdELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDbEIsTUFBTSxFQUFDLEtBQUssRUFBQyxHQUFHLEtBQTZCLENBQUM7UUFDOUMsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUzQix5RUFBeUU7UUFDekUsT0FBTztRQUNQLE9BQU8sRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUM7SUFDcEQsQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQge0xlYWt5UmVsdSwgTGVha3lSZWx1QXR0cnN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge0dyYWRDb25maWcsIE5hbWVkQXR0ck1hcH0gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7Z3JlYXRlcn0gZnJvbSAnLi4vb3BzL2dyZWF0ZXInO1xuaW1wb3J0IHttdWx9IGZyb20gJy4uL29wcy9tdWwnO1xuaW1wb3J0IHt3aGVyZX0gZnJvbSAnLi4vb3BzL3doZXJlJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuXG5leHBvcnQgY29uc3QgbGVha3lSZWx1R3JhZENvbmZpZzogR3JhZENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogTGVha3lSZWx1LFxuICBpbnB1dHNUb1NhdmU6IFsneCddLFxuICBncmFkRnVuYzogKGR5OiBUZW5zb3IsIHNhdmVkOiBUZW5zb3JbXSwgYXR0cnM6IE5hbWVkQXR0ck1hcCkgPT4ge1xuICAgIGNvbnN0IFt4XSA9IHNhdmVkO1xuICAgIGNvbnN0IHthbHBoYX0gPSBhdHRycyBhcyB7fSBhcyBMZWFreVJlbHVBdHRycztcbiAgICBjb25zdCBtYXNrID0gZ3JlYXRlcih4LCAwKTtcblxuICAgIC8vIFJldHVybnMgYGdyYWRpZW50cyAqIChmZWF0dXJlcyA+IDApICsgYWxwaGEgKiBncmFkaWVudHMgKiAoZmVhdHVyZXMgPD1cbiAgICAvLyAwKWAuXG4gICAgcmV0dXJuIHt4OiAoKSA9PiB3aGVyZShtYXNrLCBkeSwgbXVsKGR5LCBhbHBoYSkpfTtcbiAgfVxufTtcbiJdfQ==