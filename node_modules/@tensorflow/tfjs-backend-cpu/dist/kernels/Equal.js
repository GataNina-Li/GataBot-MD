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
import { Equal } from '@tensorflow/tfjs-core';
import { createSimpleBinaryKernelImpl } from '../utils/binary_impl';
import { binaryKernelFunc } from '../utils/binary_utils';
export const equalImpl = createSimpleBinaryKernelImpl((a, b) => (a === b) ? 1 : 0);
export const equal = binaryKernelFunc(Equal, equalImpl, null /* complexImpl */, 'bool');
export const equalConfig = {
    kernelName: Equal,
    backendName: 'cpu',
    kernelFunc: equal
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXF1YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtY3B1L3NyYy9rZXJuZWxzL0VxdWFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxLQUFLLEVBQWUsTUFBTSx1QkFBdUIsQ0FBQztBQUUxRCxPQUFPLEVBQUMsNEJBQTRCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUV2RCxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQ2xCLDRCQUE0QixDQUFDLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUUsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUNkLGdCQUFnQixDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBRXZFLE1BQU0sQ0FBQyxNQUFNLFdBQVcsR0FBaUI7SUFDdkMsVUFBVSxFQUFFLEtBQUs7SUFDakIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsVUFBVSxFQUFFLEtBQUs7Q0FDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFcXVhbCwgS2VybmVsQ29uZmlnfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge2NyZWF0ZVNpbXBsZUJpbmFyeUtlcm5lbEltcGx9IGZyb20gJy4uL3V0aWxzL2JpbmFyeV9pbXBsJztcbmltcG9ydCB7YmluYXJ5S2VybmVsRnVuY30gZnJvbSAnLi4vdXRpbHMvYmluYXJ5X3V0aWxzJztcblxuZXhwb3J0IGNvbnN0IGVxdWFsSW1wbCA9XG4gICAgY3JlYXRlU2ltcGxlQmluYXJ5S2VybmVsSW1wbCgoYTogbnVtYmVyLCBiOiBudW1iZXIpID0+IChhID09PSBiKSA/IDEgOiAwKTtcbmV4cG9ydCBjb25zdCBlcXVhbCA9XG4gICAgYmluYXJ5S2VybmVsRnVuYyhFcXVhbCwgZXF1YWxJbXBsLCBudWxsIC8qIGNvbXBsZXhJbXBsICovLCAnYm9vbCcpO1xuXG5leHBvcnQgY29uc3QgZXF1YWxDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogRXF1YWwsXG4gIGJhY2tlbmROYW1lOiAnY3B1JyxcbiAga2VybmVsRnVuYzogZXF1YWxcbn07XG4iXX0=