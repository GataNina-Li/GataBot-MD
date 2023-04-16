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
import { PadV2 } from '../kernel_names';
import { slice } from '../ops/slice';
export const padV2GradConfig = {
    kernelName: PadV2,
    inputsToSave: ['x'],
    gradFunc: (dy, saved, attrs) => {
        // Pad introduces values around the original tensor, so the gradient
        // slices the original shape out of the gradient.
        const x = saved[0];
        const { paddings } = attrs;
        const begin = paddings.map(p => p[0]);
        return { x: () => slice(dy, begin, x.shape) };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFkVjJfZ3JhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvZ3JhZGllbnRzL1BhZFYyX2dyYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLEtBQUssRUFBYSxNQUFNLGlCQUFpQixDQUFDO0FBRWxELE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFHbkMsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFlO0lBQ3pDLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFlBQVksRUFBRSxDQUFDLEdBQUcsQ0FBQztJQUNuQixRQUFRLEVBQUUsQ0FBQyxFQUFVLEVBQUUsS0FBZSxFQUFFLEtBQW1CLEVBQUUsRUFBRTtRQUM3RCxvRUFBb0U7UUFDcEUsaURBQWlEO1FBQ2pELE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQixNQUFNLEVBQUMsUUFBUSxFQUFDLEdBQUcsS0FBOEIsQ0FBQztRQUNsRCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsT0FBTyxFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQztJQUM5QyxDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtQYWRWMiwgUGFkVjJBdHRyc30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7R3JhZENvbmZpZywgTmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtzbGljZX0gZnJvbSAnLi4vb3BzL3NsaWNlJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuXG5leHBvcnQgY29uc3QgcGFkVjJHcmFkQ29uZmlnOiBHcmFkQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBQYWRWMixcbiAgaW5wdXRzVG9TYXZlOiBbJ3gnXSxcbiAgZ3JhZEZ1bmM6IChkeTogVGVuc29yLCBzYXZlZDogVGVuc29yW10sIGF0dHJzOiBOYW1lZEF0dHJNYXApID0+IHtcbiAgICAvLyBQYWQgaW50cm9kdWNlcyB2YWx1ZXMgYXJvdW5kIHRoZSBvcmlnaW5hbCB0ZW5zb3IsIHNvIHRoZSBncmFkaWVudFxuICAgIC8vIHNsaWNlcyB0aGUgb3JpZ2luYWwgc2hhcGUgb3V0IG9mIHRoZSBncmFkaWVudC5cbiAgICBjb25zdCB4ID0gc2F2ZWRbMF07XG4gICAgY29uc3Qge3BhZGRpbmdzfSA9IGF0dHJzIGFzIHVua25vd24gYXMgUGFkVjJBdHRycztcbiAgICBjb25zdCBiZWdpbiA9IHBhZGRpbmdzLm1hcChwID0+IHBbMF0pO1xuICAgIHJldHVybiB7eDogKCkgPT4gc2xpY2UoZHksIGJlZ2luLCB4LnNoYXBlKX07XG4gIH1cbn07XG4iXX0=