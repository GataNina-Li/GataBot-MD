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
import { Sum } from '@tensorflow/tfjs-core';
import { sumImpl } from './Sum_impl';
export function sum(args) {
    const { inputs, backend, attrs } = args;
    const { x } = inputs;
    const { axis, keepDims } = attrs;
    return sumImpl(x, axis, keepDims, backend);
}
export const sumConfig = {
    kernelName: Sum,
    backendName: 'webgl',
    kernelFunc: sum
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3VtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9rZXJuZWxzL1N1bS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQTJCLEdBQUcsRUFBc0IsTUFBTSx1QkFBdUIsQ0FBQztBQUl6RixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRW5DLE1BQU0sVUFBVSxHQUFHLENBQ2YsSUFBcUU7SUFDdkUsTUFBTSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDLEdBQUcsSUFBSSxDQUFDO0lBRXRDLE1BQU0sRUFBQyxDQUFDLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFDbkIsTUFBTSxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUMsR0FBRyxLQUFLLENBQUM7SUFFL0IsT0FBTyxPQUFPLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBaUI7SUFDckMsVUFBVSxFQUFFLEdBQUc7SUFDZixXQUFXLEVBQUUsT0FBTztJQUNwQixVQUFVLEVBQUUsR0FBdUI7Q0FDcEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtLZXJuZWxDb25maWcsIEtlcm5lbEZ1bmMsIFN1bSwgU3VtQXR0cnMsIFN1bUlucHV0c30gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtNYXRoQmFja2VuZFdlYkdMfSBmcm9tICcuLi9iYWNrZW5kX3dlYmdsJztcblxuaW1wb3J0IHtzdW1JbXBsfSBmcm9tICcuL1N1bV9pbXBsJztcblxuZXhwb3J0IGZ1bmN0aW9uIHN1bShcbiAgICBhcmdzOiB7aW5wdXRzOiBTdW1JbnB1dHMsIGF0dHJzOiBTdW1BdHRycywgYmFja2VuZDogTWF0aEJhY2tlbmRXZWJHTH0pIHtcbiAgY29uc3Qge2lucHV0cywgYmFja2VuZCwgYXR0cnN9ID0gYXJncztcblxuICBjb25zdCB7eH0gPSBpbnB1dHM7XG4gIGNvbnN0IHtheGlzLCBrZWVwRGltc30gPSBhdHRycztcblxuICByZXR1cm4gc3VtSW1wbCh4LCBheGlzLCBrZWVwRGltcywgYmFja2VuZCk7XG59XG5cbmV4cG9ydCBjb25zdCBzdW1Db25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogU3VtLFxuICBiYWNrZW5kTmFtZTogJ3dlYmdsJyxcbiAga2VybmVsRnVuYzogc3VtIGFzIHt9IGFzIEtlcm5lbEZ1bmNcbn07XG4iXX0=