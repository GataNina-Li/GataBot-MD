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
import { Reverse } from '../kernel_names';
import { reverse } from '../ops/reverse';
import { parseAxisParam } from '../util';
export const reverseGradConfig = {
    kernelName: Reverse,
    gradFunc: (dy, saved, attrs) => {
        const { dims } = attrs;
        const axes = parseAxisParam(dims, dy.shape);
        return { x: () => reverse(dy, axes) };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmV2ZXJzZV9ncmFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9ncmFkaWVudHMvUmV2ZXJzZV9ncmFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE9BQU8sRUFBQyxPQUFPLEVBQWUsTUFBTSxpQkFBaUIsQ0FBQztBQUV0RCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFdkMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUV2QyxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBZTtJQUMzQyxVQUFVLEVBQUUsT0FBTztJQUNuQixRQUFRLEVBQUUsQ0FBQyxFQUFVLEVBQUUsS0FBZSxFQUFFLEtBQW1CLEVBQUUsRUFBRTtRQUM3RCxNQUFNLEVBQUMsSUFBSSxFQUFDLEdBQUcsS0FBMkIsQ0FBQztRQUMzQyxNQUFNLElBQUksR0FBRyxjQUFjLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QyxPQUFPLEVBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUMsQ0FBQztJQUN0QyxDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbmltcG9ydCB7UmV2ZXJzZSwgUmV2ZXJzZUF0dHJzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtHcmFkQ29uZmlnLCBOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge3JldmVyc2V9IGZyb20gJy4uL29wcy9yZXZlcnNlJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtwYXJzZUF4aXNQYXJhbX0gZnJvbSAnLi4vdXRpbCc7XG5cbmV4cG9ydCBjb25zdCByZXZlcnNlR3JhZENvbmZpZzogR3JhZENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogUmV2ZXJzZSxcbiAgZ3JhZEZ1bmM6IChkeTogVGVuc29yLCBzYXZlZDogVGVuc29yW10sIGF0dHJzOiBOYW1lZEF0dHJNYXApID0+IHtcbiAgICBjb25zdCB7ZGltc30gPSBhdHRycyBhcyB7fSBhcyBSZXZlcnNlQXR0cnM7XG4gICAgY29uc3QgYXhlcyA9IHBhcnNlQXhpc1BhcmFtKGRpbXMsIGR5LnNoYXBlKTtcbiAgICByZXR1cm4ge3g6ICgpID0+IHJldmVyc2UoZHksIGF4ZXMpfTtcbiAgfVxufTtcbiJdfQ==