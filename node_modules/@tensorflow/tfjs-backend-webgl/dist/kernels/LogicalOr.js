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
import { LogicalOr } from '@tensorflow/tfjs-core';
import { binaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
const LOGICAL_OR = `return float(a >= 1.0 || b >= 1.0);`;
const LOGICAL_OR_PACKED = `
  return min(
    vec4(greaterThanEqual(a, vec4(1.0))) +
    vec4(greaterThanEqual(b, vec4(1.0))),
    vec4(1.0));
`;
export const logicalOr = binaryKernelFunc({ opSnippet: LOGICAL_OR, packedOpSnippet: LOGICAL_OR_PACKED, dtype: 'bool' });
export const logicalOrConfig = {
    kernelName: LogicalOr,
    backendName: 'webgl',
    kernelFunc: logicalOr
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naWNhbE9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9rZXJuZWxzL0xvZ2ljYWxPci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQTJCLFNBQVMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRTFFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBRXBFLE1BQU0sVUFBVSxHQUFHLHFDQUFxQyxDQUFDO0FBQ3pELE1BQU0saUJBQWlCLEdBQUc7Ozs7O0NBS3pCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxTQUFTLEdBQUcsZ0JBQWdCLENBQ3JDLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7QUFFaEYsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFpQjtJQUMzQyxVQUFVLEVBQUUsU0FBUztJQUNyQixXQUFXLEVBQUUsT0FBTztJQUNwQixVQUFVLEVBQUUsU0FBNkI7Q0FDMUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtLZXJuZWxDb25maWcsIEtlcm5lbEZ1bmMsIExvZ2ljYWxPcn0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtiaW5hcnlLZXJuZWxGdW5jfSBmcm9tICcuLi9rZXJuZWxfdXRpbHMva2VybmVsX2Z1bmNzX3V0aWxzJztcblxuY29uc3QgTE9HSUNBTF9PUiA9IGByZXR1cm4gZmxvYXQoYSA+PSAxLjAgfHwgYiA+PSAxLjApO2A7XG5jb25zdCBMT0dJQ0FMX09SX1BBQ0tFRCA9IGBcbiAgcmV0dXJuIG1pbihcbiAgICB2ZWM0KGdyZWF0ZXJUaGFuRXF1YWwoYSwgdmVjNCgxLjApKSkgK1xuICAgIHZlYzQoZ3JlYXRlclRoYW5FcXVhbChiLCB2ZWM0KDEuMCkpKSxcbiAgICB2ZWM0KDEuMCkpO1xuYDtcblxuZXhwb3J0IGNvbnN0IGxvZ2ljYWxPciA9IGJpbmFyeUtlcm5lbEZ1bmMoXG4gICAge29wU25pcHBldDogTE9HSUNBTF9PUiwgcGFja2VkT3BTbmlwcGV0OiBMT0dJQ0FMX09SX1BBQ0tFRCwgZHR5cGU6ICdib29sJ30pO1xuXG5leHBvcnQgY29uc3QgbG9naWNhbE9yQ29uZmlnOiBLZXJuZWxDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IExvZ2ljYWxPcixcbiAgYmFja2VuZE5hbWU6ICd3ZWJnbCcsXG4gIGtlcm5lbEZ1bmM6IGxvZ2ljYWxPciBhcyB7fSBhcyBLZXJuZWxGdW5jXG59O1xuIl19