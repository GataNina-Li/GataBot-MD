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
import { Asinh } from '../kernel_names';
import { add } from '../ops/add';
import { cast } from '../ops/cast';
import { div } from '../ops/div';
import { scalar } from '../ops/scalar';
import { sqrt } from '../ops/sqrt';
import { square } from '../ops/square';
export const asinhGradConfig = {
    kernelName: Asinh,
    inputsToSave: ['x'],
    gradFunc: (dy, saved) => {
        const [x] = saved;
        return {
            x: () => {
                const a = sqrt(add(scalar(1), square(cast(x, 'float32'))));
                return div(dy, a);
            }
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXNpbmhfZ3JhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvZ3JhZGllbnRzL0FzaW5oX2dyYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRXRDLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDL0IsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUNqQyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDckMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUNqQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBR3JDLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBZTtJQUN6QyxVQUFVLEVBQUUsS0FBSztJQUNqQixZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDbkIsUUFBUSxFQUFFLENBQUMsRUFBVSxFQUFFLEtBQWUsRUFBRSxFQUFFO1FBQ3hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7UUFFbEIsT0FBTztZQUNMLENBQUMsRUFBRSxHQUFHLEVBQUU7Z0JBQ04sTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNELE9BQU8sR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwQixDQUFDO1NBQ0YsQ0FBQztJQUNKLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0FzaW5ofSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtHcmFkQ29uZmlnfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHthZGR9IGZyb20gJy4uL29wcy9hZGQnO1xuaW1wb3J0IHtjYXN0fSBmcm9tICcuLi9vcHMvY2FzdCc7XG5pbXBvcnQge2Rpdn0gZnJvbSAnLi4vb3BzL2Rpdic7XG5pbXBvcnQge3NjYWxhcn0gZnJvbSAnLi4vb3BzL3NjYWxhcic7XG5pbXBvcnQge3NxcnR9IGZyb20gJy4uL29wcy9zcXJ0JztcbmltcG9ydCB7c3F1YXJlfSBmcm9tICcuLi9vcHMvc3F1YXJlJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuXG5leHBvcnQgY29uc3QgYXNpbmhHcmFkQ29uZmlnOiBHcmFkQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBBc2luaCxcbiAgaW5wdXRzVG9TYXZlOiBbJ3gnXSxcbiAgZ3JhZEZ1bmM6IChkeTogVGVuc29yLCBzYXZlZDogVGVuc29yW10pID0+IHtcbiAgICBjb25zdCBbeF0gPSBzYXZlZDtcblxuICAgIHJldHVybiB7XG4gICAgICB4OiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGEgPSBzcXJ0KGFkZChzY2FsYXIoMSksIHNxdWFyZShjYXN0KHgsICdmbG9hdDMyJykpKSk7XG4gICAgICAgIHJldHVybiBkaXYoZHksIGEpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG4iXX0=