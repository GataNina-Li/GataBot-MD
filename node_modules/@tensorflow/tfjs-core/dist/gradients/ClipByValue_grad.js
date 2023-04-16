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
import { ClipByValue } from '../kernel_names';
import { greaterEqual } from '../ops/greater_equal';
import { lessEqual } from '../ops/less_equal';
import { logicalAnd } from '../ops/logical_and';
import { where } from '../ops/where';
import { zerosLike } from '../ops/zeros_like';
export const clipByValueGradConfig = {
    kernelName: ClipByValue,
    inputsToSave: ['x'],
    gradFunc: (dy, saved, attrs) => {
        const [x] = saved;
        const { clipValueMin, clipValueMax } = attrs;
        return {
            x: () => where(logicalAnd(greaterEqual(x, clipValueMin), lessEqual(x, clipValueMax)), dy, zerosLike(dy)),
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpcEJ5VmFsdWVfZ3JhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvZ3JhZGllbnRzL0NsaXBCeVZhbHVlX2dyYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLFdBQVcsRUFBbUIsTUFBTSxpQkFBaUIsQ0FBQztBQUU5RCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ25DLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUc1QyxNQUFNLENBQUMsTUFBTSxxQkFBcUIsR0FBZTtJQUMvQyxVQUFVLEVBQUUsV0FBVztJQUN2QixZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDbkIsUUFBUSxFQUFFLENBQUMsRUFBVSxFQUFFLEtBQWUsRUFBRSxLQUFtQixFQUFFLEVBQUU7UUFDN0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUNsQixNQUFNLEVBQUMsWUFBWSxFQUFFLFlBQVksRUFBQyxHQUFHLEtBQStCLENBQUM7UUFDckUsT0FBTztZQUNMLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQ1YsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxFQUNyRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3ZCLENBQUM7SUFDSixDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtDbGlwQnlWYWx1ZSwgQ2xpcEJ5VmFsdWVBdHRyc30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7R3JhZENvbmZpZywgTmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtncmVhdGVyRXF1YWx9IGZyb20gJy4uL29wcy9ncmVhdGVyX2VxdWFsJztcbmltcG9ydCB7bGVzc0VxdWFsfSBmcm9tICcuLi9vcHMvbGVzc19lcXVhbCc7XG5pbXBvcnQge2xvZ2ljYWxBbmR9IGZyb20gJy4uL29wcy9sb2dpY2FsX2FuZCc7XG5pbXBvcnQge3doZXJlfSBmcm9tICcuLi9vcHMvd2hlcmUnO1xuaW1wb3J0IHt6ZXJvc0xpa2V9IGZyb20gJy4uL29wcy96ZXJvc19saWtlJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuXG5leHBvcnQgY29uc3QgY2xpcEJ5VmFsdWVHcmFkQ29uZmlnOiBHcmFkQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBDbGlwQnlWYWx1ZSxcbiAgaW5wdXRzVG9TYXZlOiBbJ3gnXSxcbiAgZ3JhZEZ1bmM6IChkeTogVGVuc29yLCBzYXZlZDogVGVuc29yW10sIGF0dHJzOiBOYW1lZEF0dHJNYXApID0+IHtcbiAgICBjb25zdCBbeF0gPSBzYXZlZDtcbiAgICBjb25zdCB7Y2xpcFZhbHVlTWluLCBjbGlwVmFsdWVNYXh9ID0gYXR0cnMgYXMge30gYXMgQ2xpcEJ5VmFsdWVBdHRycztcbiAgICByZXR1cm4ge1xuICAgICAgeDogKCkgPT4gd2hlcmUoXG4gICAgICAgICAgbG9naWNhbEFuZChncmVhdGVyRXF1YWwoeCwgY2xpcFZhbHVlTWluKSwgbGVzc0VxdWFsKHgsIGNsaXBWYWx1ZU1heCkpLFxuICAgICAgICAgIGR5LCB6ZXJvc0xpa2UoZHkpKSxcbiAgICB9O1xuICB9XG59O1xuIl19