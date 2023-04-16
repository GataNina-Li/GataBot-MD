/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import { Exp } from '@tensorflow/tfjs-core';
import { createSimpleUnaryImpl } from '../utils/unary_impl';
import { unaryKernelFuncFromImpl } from '../utils/unary_utils';
export const expImpl = createSimpleUnaryImpl((xi) => Math.exp(xi));
export const exp = unaryKernelFuncFromImpl(Exp, expImpl, 'float32');
export const expConfig = {
    kernelName: Exp,
    backendName: 'cpu',
    kernelFunc: exp,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXhwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLWNwdS9zcmMva2VybmVscy9FeHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLEdBQUcsRUFBZSxNQUFNLHVCQUF1QixDQUFDO0FBRXhELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQzFELE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBRTdELE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ25FLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyx1QkFBdUIsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBRXBFLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBaUI7SUFDckMsVUFBVSxFQUFFLEdBQUc7SUFDZixXQUFXLEVBQUUsS0FBSztJQUNsQixVQUFVLEVBQUUsR0FBRztDQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBMaWNlbnNlKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIEFTIElTIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFeHAsIEtlcm5lbENvbmZpZ30gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtjcmVhdGVTaW1wbGVVbmFyeUltcGx9IGZyb20gJy4uL3V0aWxzL3VuYXJ5X2ltcGwnO1xuaW1wb3J0IHt1bmFyeUtlcm5lbEZ1bmNGcm9tSW1wbH0gZnJvbSAnLi4vdXRpbHMvdW5hcnlfdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgZXhwSW1wbCA9IGNyZWF0ZVNpbXBsZVVuYXJ5SW1wbCgoeGkpID0+IE1hdGguZXhwKHhpKSk7XG5leHBvcnQgY29uc3QgZXhwID0gdW5hcnlLZXJuZWxGdW5jRnJvbUltcGwoRXhwLCBleHBJbXBsLCAnZmxvYXQzMicpO1xuXG5leHBvcnQgY29uc3QgZXhwQ29uZmlnOiBLZXJuZWxDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IEV4cCxcbiAgYmFja2VuZE5hbWU6ICdjcHUnLFxuICBrZXJuZWxGdW5jOiBleHAsXG59O1xuIl19