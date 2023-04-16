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
import { ExpandDims } from '../kernel_names';
import { reshape } from '../ops/reshape';
export const expandDimsGradConfig = {
    kernelName: ExpandDims,
    inputsToSave: ['input'],
    gradFunc: (dy, saved) => {
        const [input] = saved;
        return { input: () => reshape(dy, input.shape) };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXhwYW5kRGltc19ncmFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9ncmFkaWVudHMvRXhwYW5kRGltc19ncmFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUUzQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFHdkMsTUFBTSxDQUFDLE1BQU0sb0JBQW9CLEdBQWU7SUFDOUMsVUFBVSxFQUFFLFVBQVU7SUFDdEIsWUFBWSxFQUFFLENBQUMsT0FBTyxDQUFDO0lBQ3ZCLFFBQVEsRUFBRSxDQUFDLEVBQVUsRUFBRSxLQUFlLEVBQUUsRUFBRTtRQUN4QyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLE9BQU8sRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQztJQUNqRCxDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFeHBhbmREaW1zfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtHcmFkQ29uZmlnfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtyZXNoYXBlfSBmcm9tICcuLi9vcHMvcmVzaGFwZSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcblxuZXhwb3J0IGNvbnN0IGV4cGFuZERpbXNHcmFkQ29uZmlnOiBHcmFkQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBFeHBhbmREaW1zLFxuICBpbnB1dHNUb1NhdmU6IFsnaW5wdXQnXSxcbiAgZ3JhZEZ1bmM6IChkeTogVGVuc29yLCBzYXZlZDogVGVuc29yW10pID0+IHtcbiAgICBjb25zdCBbaW5wdXRdID0gc2F2ZWQ7XG4gICAgcmV0dXJuIHtpbnB1dDogKCkgPT4gcmVzaGFwZShkeSwgaW5wdXQuc2hhcGUpfTtcbiAgfVxufTtcbiJdfQ==