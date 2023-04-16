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
import { AvgPool3D } from '../kernel_names';
import { avgPool3dGrad } from '../ops/avg_pool_3d_grad';
export const avgPool3DGradConfig = {
    kernelName: AvgPool3D,
    inputsToSave: ['x'],
    gradFunc: (dy, saved, attrs) => {
        const [x] = saved;
        const { filterSize, strides, pad, dimRoundingMode } = attrs;
        return {
            x: () => avgPool3dGrad(dy, x, filterSize, strides, pad, dimRoundingMode)
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXZnUG9vbDNEX2dyYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2dyYWRpZW50cy9BdmdQb29sM0RfZ3JhZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFpQixNQUFNLGlCQUFpQixDQUFDO0FBRTFELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUd0RCxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBZTtJQUM3QyxVQUFVLEVBQUUsU0FBUztJQUNyQixZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDbkIsUUFBUSxFQUFFLENBQUMsRUFBVSxFQUFFLEtBQWUsRUFBRSxLQUFtQixFQUFFLEVBQUU7UUFDN0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQW1CLENBQUM7UUFDaEMsTUFBTSxFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBQyxHQUM3QyxLQUE2QixDQUFDO1FBRWxDLE9BQU87WUFDTCxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUNsQixFQUFjLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLGVBQWUsQ0FBQztTQUNsRSxDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7QXZnUG9vbDNELCBBdmdQb29sM0RBdHRyc30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7R3JhZENvbmZpZywgTmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHthdmdQb29sM2RHcmFkfSBmcm9tICcuLi9vcHMvYXZnX3Bvb2xfM2RfZ3JhZCc7XG5pbXBvcnQge1RlbnNvciwgVGVuc29yNUR9IGZyb20gJy4uL3RlbnNvcic7XG5cbmV4cG9ydCBjb25zdCBhdmdQb29sM0RHcmFkQ29uZmlnOiBHcmFkQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBBdmdQb29sM0QsXG4gIGlucHV0c1RvU2F2ZTogWyd4J10sXG4gIGdyYWRGdW5jOiAoZHk6IFRlbnNvciwgc2F2ZWQ6IFRlbnNvcltdLCBhdHRyczogTmFtZWRBdHRyTWFwKSA9PiB7XG4gICAgY29uc3QgW3hdID0gc2F2ZWQgYXMgW1RlbnNvcjVEXTtcbiAgICBjb25zdCB7ZmlsdGVyU2l6ZSwgc3RyaWRlcywgcGFkLCBkaW1Sb3VuZGluZ01vZGV9ID1cbiAgICAgICAgYXR0cnMgYXMge30gYXMgQXZnUG9vbDNEQXR0cnM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgeDogKCkgPT4gYXZnUG9vbDNkR3JhZChcbiAgICAgICAgICBkeSBhcyBUZW5zb3I1RCwgeCwgZmlsdGVyU2l6ZSwgc3RyaWRlcywgcGFkLCBkaW1Sb3VuZGluZ01vZGUpXG4gICAgfTtcbiAgfVxufTtcbiJdfQ==