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
import { Relu6 } from '../kernel_names';
import { cast } from '../ops/cast';
import { lessEqual } from '../ops/less_equal';
import { mul } from '../ops/mul';
import { step } from '../ops/step';
export const relu6GradConfig = {
    kernelName: Relu6,
    inputsToSave: ['x'],
    gradFunc: (dy, saved) => {
        const [x] = saved;
        const mask = mul(lessEqual(x, 6), step(x));
        return { x: () => mul(dy, cast(mask, 'float32')) };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVsdTZfZ3JhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvZ3JhZGllbnRzL1JlbHU2X2dyYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRXRDLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDakMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDL0IsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUdqQyxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQWU7SUFDekMsVUFBVSxFQUFFLEtBQUs7SUFDakIsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQ25CLFFBQVEsRUFBRSxDQUFDLEVBQVUsRUFBRSxLQUFlLEVBQUUsRUFBRTtRQUN4QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTNDLE9BQU8sRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUMsQ0FBQztJQUNuRCxDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbmltcG9ydCB7UmVsdTZ9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge0dyYWRDb25maWd9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge2Nhc3R9IGZyb20gJy4uL29wcy9jYXN0JztcbmltcG9ydCB7bGVzc0VxdWFsfSBmcm9tICcuLi9vcHMvbGVzc19lcXVhbCc7XG5pbXBvcnQge211bH0gZnJvbSAnLi4vb3BzL211bCc7XG5pbXBvcnQge3N0ZXB9IGZyb20gJy4uL29wcy9zdGVwJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuXG5leHBvcnQgY29uc3QgcmVsdTZHcmFkQ29uZmlnOiBHcmFkQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBSZWx1NixcbiAgaW5wdXRzVG9TYXZlOiBbJ3gnXSxcbiAgZ3JhZEZ1bmM6IChkeTogVGVuc29yLCBzYXZlZDogVGVuc29yW10pID0+IHtcbiAgICBjb25zdCBbeF0gPSBzYXZlZDtcbiAgICBjb25zdCBtYXNrID0gbXVsKGxlc3NFcXVhbCh4LCA2KSwgc3RlcCh4KSk7XG5cbiAgICByZXR1cm4ge3g6ICgpID0+IG11bChkeSwgY2FzdChtYXNrLCAnZmxvYXQzMicpKX07XG4gIH1cbn07XG4iXX0=