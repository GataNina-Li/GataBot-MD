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
import { Mod } from '@tensorflow/tfjs-core';
import { createSimpleBinaryKernelImpl } from '../utils/binary_impl';
import { binaryKernelFunc } from '../utils/binary_utils';
export const modImpl = createSimpleBinaryKernelImpl(((aValue, bValue) => {
    const rem = aValue % bValue;
    if ((aValue < 0 && bValue < 0) || (aValue >= 0 && bValue >= 0)) {
        return rem;
    }
    else {
        return (rem + bValue) % bValue;
    }
}));
export const mod = binaryKernelFunc(Mod, modImpl);
export const modConfig = {
    kernelName: Mod,
    backendName: 'cpu',
    kernelFunc: mod
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLWNwdS9zcmMva2VybmVscy9Nb2QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFlLEdBQUcsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRXhELE9BQU8sRUFBQyw0QkFBNEIsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ2xFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRXZELE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FDaEIsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLE1BQWMsRUFBRSxNQUFjLEVBQUUsRUFBRTtJQUMvRCxNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksTUFBTSxJQUFJLENBQUMsQ0FBQyxFQUFFO1FBQzlELE9BQU8sR0FBRyxDQUFDO0tBQ1o7U0FBTTtRQUNMLE9BQU8sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDO0tBQ2hDO0FBQ0gsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUVSLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFFbEQsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFpQjtJQUNyQyxVQUFVLEVBQUUsR0FBRztJQUNmLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLFVBQVUsRUFBRSxHQUFHO0NBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7S2VybmVsQ29uZmlnLCBNb2R9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7Y3JlYXRlU2ltcGxlQmluYXJ5S2VybmVsSW1wbH0gZnJvbSAnLi4vdXRpbHMvYmluYXJ5X2ltcGwnO1xuaW1wb3J0IHtiaW5hcnlLZXJuZWxGdW5jfSBmcm9tICcuLi91dGlscy9iaW5hcnlfdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgbW9kSW1wbCA9XG4gICAgY3JlYXRlU2ltcGxlQmluYXJ5S2VybmVsSW1wbCgoKGFWYWx1ZTogbnVtYmVyLCBiVmFsdWU6IG51bWJlcikgPT4ge1xuICAgICAgY29uc3QgcmVtID0gYVZhbHVlICUgYlZhbHVlO1xuICAgICAgaWYgKChhVmFsdWUgPCAwICYmIGJWYWx1ZSA8IDApIHx8IChhVmFsdWUgPj0gMCAmJiBiVmFsdWUgPj0gMCkpIHtcbiAgICAgICAgcmV0dXJuIHJlbTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAocmVtICsgYlZhbHVlKSAlIGJWYWx1ZTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbmV4cG9ydCBjb25zdCBtb2QgPSBiaW5hcnlLZXJuZWxGdW5jKE1vZCwgbW9kSW1wbCk7XG5cbmV4cG9ydCBjb25zdCBtb2RDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogTW9kLFxuICBiYWNrZW5kTmFtZTogJ2NwdScsXG4gIGtlcm5lbEZ1bmM6IG1vZFxufTtcbiJdfQ==