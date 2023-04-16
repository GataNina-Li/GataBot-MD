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
import { createSimpleBinaryKernelImpl } from '../utils/binary_impl';
import { binaryKernelFunc } from '../utils/binary_utils';
export const logicalOrImpl = createSimpleBinaryKernelImpl((a, b) => a || b);
export const logicalOr = binaryKernelFunc(LogicalOr, logicalOrImpl, null /* complexImpl */, 'bool');
export const logicalOrConfig = {
    kernelName: LogicalOr,
    backendName: 'cpu',
    kernelFunc: logicalOr
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naWNhbE9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLWNwdS9zcmMva2VybmVscy9Mb2dpY2FsT3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFlLFNBQVMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRTlELE9BQU8sRUFBQyw0QkFBNEIsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ2xFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRXZELE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FDdEIsNEJBQTRCLENBQUMsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbkUsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUNsQixnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUUvRSxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQWlCO0lBQzNDLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLFVBQVUsRUFBRSxTQUFTO0NBQ3RCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7S2VybmVsQ29uZmlnLCBMb2dpY2FsT3J9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7Y3JlYXRlU2ltcGxlQmluYXJ5S2VybmVsSW1wbH0gZnJvbSAnLi4vdXRpbHMvYmluYXJ5X2ltcGwnO1xuaW1wb3J0IHtiaW5hcnlLZXJuZWxGdW5jfSBmcm9tICcuLi91dGlscy9iaW5hcnlfdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgbG9naWNhbE9ySW1wbCA9XG4gICAgY3JlYXRlU2ltcGxlQmluYXJ5S2VybmVsSW1wbCgoYTogbnVtYmVyLCBiOiBudW1iZXIpID0+IGEgfHwgYik7XG5leHBvcnQgY29uc3QgbG9naWNhbE9yID1cbiAgICBiaW5hcnlLZXJuZWxGdW5jKExvZ2ljYWxPciwgbG9naWNhbE9ySW1wbCwgbnVsbCAvKiBjb21wbGV4SW1wbCAqLywgJ2Jvb2wnKTtcblxuZXhwb3J0IGNvbnN0IGxvZ2ljYWxPckNvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBMb2dpY2FsT3IsXG4gIGJhY2tlbmROYW1lOiAnY3B1JyxcbiAga2VybmVsRnVuYzogbG9naWNhbE9yXG59O1xuIl19