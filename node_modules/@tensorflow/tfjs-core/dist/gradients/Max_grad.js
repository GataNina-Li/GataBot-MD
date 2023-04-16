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
import { Max } from '../kernel_names';
import * as util from '../util';
import { gradForMinAndMax } from './min_max_grad_util';
export const maxGradConfig = {
    kernelName: Max,
    inputsToSave: ['x'],
    outputsToSave: [true],
    gradFunc: (dy, saved, attrs) => {
        const maxAttrs = attrs;
        const { reductionIndices } = maxAttrs;
        const x = saved[0];
        const y = saved[1];
        const origAxes = util.parseAxisParam(reductionIndices, x.shape);
        const maxGrad = gradForMinAndMax(dy, y, x, origAxes);
        return {
            x: () => {
                return maxGrad['x']();
            }
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWF4X2dyYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2dyYWRpZW50cy9NYXhfZ3JhZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsR0FBRyxFQUFXLE1BQU0saUJBQWlCLENBQUM7QUFHOUMsT0FBTyxLQUFLLElBQUksTUFBTSxTQUFTLENBQUM7QUFFaEMsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFckQsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFlO0lBQ3ZDLFVBQVUsRUFBRSxHQUFHO0lBQ2YsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQ25CLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQztJQUNyQixRQUFRLEVBQUUsQ0FBQyxFQUFVLEVBQUUsS0FBZSxFQUFFLEtBQW1CLEVBQUUsRUFBRTtRQUM3RCxNQUFNLFFBQVEsR0FBYSxLQUF1QixDQUFDO1FBQ25ELE1BQU0sRUFBQyxnQkFBZ0IsRUFBQyxHQUFHLFFBQVEsQ0FBQztRQUNwQyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25CLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sT0FBTyxHQUFHLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JELE9BQU87WUFDTCxDQUFDLEVBQUUsR0FBRyxFQUFFO2dCQUNOLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDeEIsQ0FBQztTQUNGLENBQUM7SUFDSixDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtNYXgsIE1heEF0dHJzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtHcmFkQ29uZmlnLCBOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7Z3JhZEZvck1pbkFuZE1heH0gZnJvbSAnLi9taW5fbWF4X2dyYWRfdXRpbCc7XG5cbmV4cG9ydCBjb25zdCBtYXhHcmFkQ29uZmlnOiBHcmFkQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBNYXgsXG4gIGlucHV0c1RvU2F2ZTogWyd4J10sXG4gIG91dHB1dHNUb1NhdmU6IFt0cnVlXSxcbiAgZ3JhZEZ1bmM6IChkeTogVGVuc29yLCBzYXZlZDogVGVuc29yW10sIGF0dHJzOiBOYW1lZEF0dHJNYXApID0+IHtcbiAgICBjb25zdCBtYXhBdHRyczogTWF4QXR0cnMgPSBhdHRycyBhcyB7fSBhcyBNYXhBdHRycztcbiAgICBjb25zdCB7cmVkdWN0aW9uSW5kaWNlc30gPSBtYXhBdHRycztcbiAgICBjb25zdCB4ID0gc2F2ZWRbMF07XG4gICAgY29uc3QgeSA9IHNhdmVkWzFdO1xuICAgIGNvbnN0IG9yaWdBeGVzID0gdXRpbC5wYXJzZUF4aXNQYXJhbShyZWR1Y3Rpb25JbmRpY2VzLCB4LnNoYXBlKTtcbiAgICBjb25zdCBtYXhHcmFkID0gZ3JhZEZvck1pbkFuZE1heChkeSwgeSwgeCwgb3JpZ0F4ZXMpO1xuICAgIHJldHVybiB7XG4gICAgICB4OiAoKSA9PiB7XG4gICAgICAgIHJldHVybiBtYXhHcmFkWyd4J10oKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuIl19