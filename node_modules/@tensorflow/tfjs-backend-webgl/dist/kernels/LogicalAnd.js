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
import { LogicalAnd } from '@tensorflow/tfjs-core';
import { binaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
const LOGICAL_AND = `return float(a >= 1.0 && b >= 1.0);`;
const LOGICAL_AND_PACKED = `
  return vec4(
    vec4(greaterThanEqual(a, vec4(1.0))) *
    vec4(greaterThanEqual(b, vec4(1.0))));
`;
export const logicalAnd = binaryKernelFunc({
    opSnippet: LOGICAL_AND,
    packedOpSnippet: LOGICAL_AND_PACKED,
    dtype: 'bool'
});
export const logicalAndConfig = {
    kernelName: LogicalAnd,
    backendName: 'webgl',
    kernelFunc: logicalAnd
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naWNhbEFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMva2VybmVscy9Mb2dpY2FsQW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBMkIsVUFBVSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFM0UsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFFcEUsTUFBTSxXQUFXLEdBQUcscUNBQXFDLENBQUM7QUFDMUQsTUFBTSxrQkFBa0IsR0FBRzs7OztDQUkxQixDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHLGdCQUFnQixDQUFDO0lBQ3pDLFNBQVMsRUFBRSxXQUFXO0lBQ3RCLGVBQWUsRUFBRSxrQkFBa0I7SUFDbkMsS0FBSyxFQUFFLE1BQU07Q0FDZCxDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBaUI7SUFDNUMsVUFBVSxFQUFFLFVBQVU7SUFDdEIsV0FBVyxFQUFFLE9BQU87SUFDcEIsVUFBVSxFQUFFLFVBQThCO0NBQzNDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7S2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jLCBMb2dpY2FsQW5kfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge2JpbmFyeUtlcm5lbEZ1bmN9IGZyb20gJy4uL2tlcm5lbF91dGlscy9rZXJuZWxfZnVuY3NfdXRpbHMnO1xuXG5jb25zdCBMT0dJQ0FMX0FORCA9IGByZXR1cm4gZmxvYXQoYSA+PSAxLjAgJiYgYiA+PSAxLjApO2A7XG5jb25zdCBMT0dJQ0FMX0FORF9QQUNLRUQgPSBgXG4gIHJldHVybiB2ZWM0KFxuICAgIHZlYzQoZ3JlYXRlclRoYW5FcXVhbChhLCB2ZWM0KDEuMCkpKSAqXG4gICAgdmVjNChncmVhdGVyVGhhbkVxdWFsKGIsIHZlYzQoMS4wKSkpKTtcbmA7XG5cbmV4cG9ydCBjb25zdCBsb2dpY2FsQW5kID0gYmluYXJ5S2VybmVsRnVuYyh7XG4gIG9wU25pcHBldDogTE9HSUNBTF9BTkQsXG4gIHBhY2tlZE9wU25pcHBldDogTE9HSUNBTF9BTkRfUEFDS0VELFxuICBkdHlwZTogJ2Jvb2wnXG59KTtcblxuZXhwb3J0IGNvbnN0IGxvZ2ljYWxBbmRDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogTG9naWNhbEFuZCxcbiAgYmFja2VuZE5hbWU6ICd3ZWJnbCcsXG4gIGtlcm5lbEZ1bmM6IGxvZ2ljYWxBbmQgYXMge30gYXMgS2VybmVsRnVuY1xufTtcbiJdfQ==