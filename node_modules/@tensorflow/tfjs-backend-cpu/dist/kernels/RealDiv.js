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
import { RealDiv } from '@tensorflow/tfjs-core';
import { createSimpleBinaryKernelImpl } from '../utils/binary_impl';
import { binaryKernelFunc } from '../utils/binary_utils';
export const realDivImpl = createSimpleBinaryKernelImpl((a, b) => a / b);
export const div = binaryKernelFunc(RealDiv, realDivImpl);
export const realDivConfig = {
    kernelName: RealDiv,
    backendName: 'cpu',
    kernelFunc: div
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVhbERpdi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC1jcHUvc3JjL2tlcm5lbHMvUmVhbERpdi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQWUsT0FBTyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFNUQsT0FBTyxFQUFDLDRCQUE0QixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDbEUsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFdkQsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUNwQiw0QkFBNEIsQ0FBQyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNsRSxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBRTFELE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBaUI7SUFDekMsVUFBVSxFQUFFLE9BQU87SUFDbkIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsVUFBVSxFQUFFLEdBQUc7Q0FDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtLZXJuZWxDb25maWcsIFJlYWxEaXZ9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7Y3JlYXRlU2ltcGxlQmluYXJ5S2VybmVsSW1wbH0gZnJvbSAnLi4vdXRpbHMvYmluYXJ5X2ltcGwnO1xuaW1wb3J0IHtiaW5hcnlLZXJuZWxGdW5jfSBmcm9tICcuLi91dGlscy9iaW5hcnlfdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgcmVhbERpdkltcGwgPVxuICAgIGNyZWF0ZVNpbXBsZUJpbmFyeUtlcm5lbEltcGwoKGE6IG51bWJlciwgYjogbnVtYmVyKSA9PiBhIC8gYik7XG5leHBvcnQgY29uc3QgZGl2ID0gYmluYXJ5S2VybmVsRnVuYyhSZWFsRGl2LCByZWFsRGl2SW1wbCk7XG5cbmV4cG9ydCBjb25zdCByZWFsRGl2Q29uZmlnOiBLZXJuZWxDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IFJlYWxEaXYsXG4gIGJhY2tlbmROYW1lOiAnY3B1JyxcbiAga2VybmVsRnVuYzogZGl2XG59O1xuIl19