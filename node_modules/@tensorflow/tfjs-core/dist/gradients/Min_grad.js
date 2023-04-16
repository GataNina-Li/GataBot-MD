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
import { Min } from '../kernel_names';
import * as util from '../util';
import { gradForMinAndMax } from './min_max_grad_util';
export const minGradConfig = {
    kernelName: Min,
    inputsToSave: ['x'],
    outputsToSave: [true],
    gradFunc: (dy, saved, attrs) => {
        const minAttrs = attrs;
        const { axis } = minAttrs;
        const [x, y] = saved;
        const origAxes = util.parseAxisParam(axis, x.shape);
        const minGrad = gradForMinAndMax(dy, y, x, origAxes);
        return {
            x: () => {
                return minGrad['x']();
            }
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWluX2dyYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2dyYWRpZW50cy9NaW5fZ3JhZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsR0FBRyxFQUFXLE1BQU0saUJBQWlCLENBQUM7QUFHOUMsT0FBTyxLQUFLLElBQUksTUFBTSxTQUFTLENBQUM7QUFFaEMsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFckQsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFlO0lBQ3ZDLFVBQVUsRUFBRSxHQUFHO0lBQ2YsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQ25CLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQztJQUNyQixRQUFRLEVBQUUsQ0FBQyxFQUFVLEVBQUUsS0FBZSxFQUFFLEtBQW1CLEVBQUUsRUFBRTtRQUM3RCxNQUFNLFFBQVEsR0FBYSxLQUF1QixDQUFDO1FBQ25ELE1BQU0sRUFBQyxJQUFJLEVBQUMsR0FBRyxRQUFRLENBQUM7UUFDeEIsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDckIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BELE1BQU0sT0FBTyxHQUFHLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JELE9BQU87WUFDTCxDQUFDLEVBQUUsR0FBRyxFQUFFO2dCQUNOLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDeEIsQ0FBQztTQUNGLENBQUM7SUFDSixDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtNaW4sIE1pbkF0dHJzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtHcmFkQ29uZmlnLCBOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7Z3JhZEZvck1pbkFuZE1heH0gZnJvbSAnLi9taW5fbWF4X2dyYWRfdXRpbCc7XG5cbmV4cG9ydCBjb25zdCBtaW5HcmFkQ29uZmlnOiBHcmFkQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBNaW4sXG4gIGlucHV0c1RvU2F2ZTogWyd4J10sXG4gIG91dHB1dHNUb1NhdmU6IFt0cnVlXSxcbiAgZ3JhZEZ1bmM6IChkeTogVGVuc29yLCBzYXZlZDogVGVuc29yW10sIGF0dHJzOiBOYW1lZEF0dHJNYXApID0+IHtcbiAgICBjb25zdCBtaW5BdHRyczogTWluQXR0cnMgPSBhdHRycyBhcyB7fSBhcyBNaW5BdHRycztcbiAgICBjb25zdCB7YXhpc30gPSBtaW5BdHRycztcbiAgICBjb25zdCBbeCwgeV0gPSBzYXZlZDtcbiAgICBjb25zdCBvcmlnQXhlcyA9IHV0aWwucGFyc2VBeGlzUGFyYW0oYXhpcywgeC5zaGFwZSk7XG4gICAgY29uc3QgbWluR3JhZCA9IGdyYWRGb3JNaW5BbmRNYXgoZHksIHksIHgsIG9yaWdBeGVzKTtcbiAgICByZXR1cm4ge1xuICAgICAgeDogKCkgPT4ge1xuICAgICAgICByZXR1cm4gbWluR3JhZFsneCddKCk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcbiJdfQ==