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
import { BatchToSpaceND } from '../kernel_names';
import { spaceToBatchND } from '../ops/space_to_batch_nd';
export const batchToSpaceNDGradConfig = {
    kernelName: BatchToSpaceND,
    gradFunc: (dy, saved, attrs) => {
        const { blockShape, crops } = attrs;
        return { x: () => spaceToBatchND(dy, blockShape, crops) };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmF0Y2hUb1NwYWNlTkRfZ3JhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvZ3JhZGllbnRzL0JhdGNoVG9TcGFjZU5EX2dyYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBc0IsTUFBTSxpQkFBaUIsQ0FBQztBQUVwRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFHeEQsTUFBTSxDQUFDLE1BQU0sd0JBQXdCLEdBQWU7SUFDbEQsVUFBVSxFQUFFLGNBQWM7SUFDMUIsUUFBUSxFQUFFLENBQUMsRUFBVSxFQUFFLEtBQWUsRUFBRSxLQUFtQixFQUFFLEVBQUU7UUFDN0QsTUFBTSxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUMsR0FBRyxLQUFrQyxDQUFDO1FBQy9ELE9BQU8sRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLEVBQUMsQ0FBQztJQUMxRCxDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtCYXRjaFRvU3BhY2VORCwgQmF0Y2hUb1NwYWNlTkRBdHRyc30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7R3JhZENvbmZpZywgTmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtzcGFjZVRvQmF0Y2hORH0gZnJvbSAnLi4vb3BzL3NwYWNlX3RvX2JhdGNoX25kJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuXG5leHBvcnQgY29uc3QgYmF0Y2hUb1NwYWNlTkRHcmFkQ29uZmlnOiBHcmFkQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBCYXRjaFRvU3BhY2VORCxcbiAgZ3JhZEZ1bmM6IChkeTogVGVuc29yLCBzYXZlZDogVGVuc29yW10sIGF0dHJzOiBOYW1lZEF0dHJNYXApID0+IHtcbiAgICBjb25zdCB7YmxvY2tTaGFwZSwgY3JvcHN9ID0gYXR0cnMgYXMge30gYXMgQmF0Y2hUb1NwYWNlTkRBdHRycztcbiAgICByZXR1cm4ge3g6ICgpID0+IHNwYWNlVG9CYXRjaE5EKGR5LCBibG9ja1NoYXBlLCBjcm9wcyl9O1xuICB9XG59O1xuIl19