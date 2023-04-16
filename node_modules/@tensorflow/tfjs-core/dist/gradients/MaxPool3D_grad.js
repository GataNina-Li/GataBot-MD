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
import { MaxPool3D } from '../kernel_names';
import { maxPool3dGrad } from '../ops/max_pool_3d_grad';
export const maxPool3DGradConfig = {
    kernelName: MaxPool3D,
    inputsToSave: ['x'],
    outputsToSave: [true],
    gradFunc: (dy, saved, attrs) => {
        const [x, y] = saved;
        const { filterSize, strides, pad, dimRoundingMode } = attrs;
        return {
            x: () => maxPool3dGrad(dy, x, y, filterSize, strides, pad, dimRoundingMode)
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWF4UG9vbDNEX2dyYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2dyYWRpZW50cy9NYXhQb29sM0RfZ3JhZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFpQixNQUFNLGlCQUFpQixDQUFDO0FBRTFELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUd0RCxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBZTtJQUM3QyxVQUFVLEVBQUUsU0FBUztJQUNyQixZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDbkIsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDO0lBQ3JCLFFBQVEsRUFBRSxDQUFDLEVBQVUsRUFBRSxLQUFlLEVBQUUsS0FBbUIsRUFBRSxFQUFFO1FBQzdELE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBNkIsQ0FBQztRQUM3QyxNQUFNLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsZUFBZSxFQUFDLEdBQzdDLEtBQTZCLENBQUM7UUFFbEMsT0FBTztZQUNMLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQ2xCLEVBQWMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLGVBQWUsQ0FBQztTQUNyRSxDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7TWF4UG9vbDNELCBNYXhQb29sM0RBdHRyc30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7R3JhZENvbmZpZywgTmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHttYXhQb29sM2RHcmFkfSBmcm9tICcuLi9vcHMvbWF4X3Bvb2xfM2RfZ3JhZCc7XG5pbXBvcnQge1RlbnNvciwgVGVuc29yNUR9IGZyb20gJy4uL3RlbnNvcic7XG5cbmV4cG9ydCBjb25zdCBtYXhQb29sM0RHcmFkQ29uZmlnOiBHcmFkQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBNYXhQb29sM0QsXG4gIGlucHV0c1RvU2F2ZTogWyd4J10sXG4gIG91dHB1dHNUb1NhdmU6IFt0cnVlXSxcbiAgZ3JhZEZ1bmM6IChkeTogVGVuc29yLCBzYXZlZDogVGVuc29yW10sIGF0dHJzOiBOYW1lZEF0dHJNYXApID0+IHtcbiAgICBjb25zdCBbeCwgeV0gPSBzYXZlZCBhcyBbVGVuc29yNUQsIFRlbnNvcjVEXTtcbiAgICBjb25zdCB7ZmlsdGVyU2l6ZSwgc3RyaWRlcywgcGFkLCBkaW1Sb3VuZGluZ01vZGV9ID1cbiAgICAgICAgYXR0cnMgYXMge30gYXMgTWF4UG9vbDNEQXR0cnM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgeDogKCkgPT4gbWF4UG9vbDNkR3JhZChcbiAgICAgICAgICBkeSBhcyBUZW5zb3I1RCwgeCwgeSwgZmlsdGVyU2l6ZSwgc3RyaWRlcywgcGFkLCBkaW1Sb3VuZGluZ01vZGUpXG4gICAgfTtcbiAgfVxufTtcbiJdfQ==