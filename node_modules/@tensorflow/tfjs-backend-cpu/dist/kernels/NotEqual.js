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
import { NotEqual } from '@tensorflow/tfjs-core';
import { createSimpleBinaryKernelImpl } from '../utils/binary_impl';
import { binaryKernelFunc } from '../utils/binary_utils';
export const notEqualImpl = createSimpleBinaryKernelImpl(((a, b) => (a !== b) ? 1 : 0));
export const notEqual = binaryKernelFunc(NotEqual, notEqualImpl, null /* complexOp */, 'bool');
export const notEqualConfig = {
    kernelName: NotEqual,
    backendName: 'cpu',
    kernelFunc: notEqual
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm90RXF1YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtY3B1L3NyYy9rZXJuZWxzL05vdEVxdWFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBZSxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUU3RCxPQUFPLEVBQUMsNEJBQTRCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUV2RCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQ3JCLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hFLE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FDakIsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBRTNFLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBaUI7SUFDMUMsVUFBVSxFQUFFLFFBQVE7SUFDcEIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsVUFBVSxFQUFFLFFBQVE7Q0FDckIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtLZXJuZWxDb25maWcsIE5vdEVxdWFsfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge2NyZWF0ZVNpbXBsZUJpbmFyeUtlcm5lbEltcGx9IGZyb20gJy4uL3V0aWxzL2JpbmFyeV9pbXBsJztcbmltcG9ydCB7YmluYXJ5S2VybmVsRnVuY30gZnJvbSAnLi4vdXRpbHMvYmluYXJ5X3V0aWxzJztcblxuZXhwb3J0IGNvbnN0IG5vdEVxdWFsSW1wbCA9XG4gICAgY3JlYXRlU2ltcGxlQmluYXJ5S2VybmVsSW1wbCgoKGEsIGIpID0+IChhICE9PSBiKSA/IDEgOiAwKSk7XG5leHBvcnQgY29uc3Qgbm90RXF1YWwgPVxuICAgIGJpbmFyeUtlcm5lbEZ1bmMoTm90RXF1YWwsIG5vdEVxdWFsSW1wbCwgbnVsbCAvKiBjb21wbGV4T3AgKi8sICdib29sJyk7XG5cbmV4cG9ydCBjb25zdCBub3RFcXVhbENvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBOb3RFcXVhbCxcbiAgYmFja2VuZE5hbWU6ICdjcHUnLFxuICBrZXJuZWxGdW5jOiBub3RFcXVhbFxufTtcbiJdfQ==