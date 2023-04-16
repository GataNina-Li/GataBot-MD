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
import { Real } from '@tensorflow/tfjs-core';
import { identity } from './Identity';
export function real(args) {
    const { inputs, backend } = args;
    const { input } = inputs;
    const inputData = backend.texData.get(input.dataId);
    return identity({ inputs: { x: inputData.complexTensorInfos.real }, backend });
}
export const realConfig = {
    kernelName: Real,
    backendName: 'webgl',
    kernelFunc: real
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMva2VybmVscy9SZWFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBMkIsSUFBSSxFQUF5QixNQUFNLHVCQUF1QixDQUFDO0FBRzdGLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFcEMsTUFBTSxVQUFVLElBQUksQ0FBQyxJQUFxRDtJQUV4RSxNQUFNLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBQyxHQUFHLElBQUksQ0FBQztJQUMvQixNQUFNLEVBQUMsS0FBSyxFQUFDLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVwRCxPQUFPLFFBQVEsQ0FBQyxFQUFDLE1BQU0sRUFBRSxFQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFDLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztBQUM3RSxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFpQjtJQUN0QyxVQUFVLEVBQUUsSUFBSTtJQUNoQixXQUFXLEVBQUUsT0FBTztJQUNwQixVQUFVLEVBQUUsSUFBd0I7Q0FDckMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtLZXJuZWxDb25maWcsIEtlcm5lbEZ1bmMsIFJlYWwsIFJlYWxJbnB1dHMsIFRlbnNvckluZm99IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7TWF0aEJhY2tlbmRXZWJHTH0gZnJvbSAnLi4vYmFja2VuZF93ZWJnbCc7XG5pbXBvcnQge2lkZW50aXR5fSBmcm9tICcuL0lkZW50aXR5JztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlYWwoYXJnczoge2lucHV0czogUmVhbElucHV0cywgYmFja2VuZDogTWF0aEJhY2tlbmRXZWJHTH0pOlxuICAgIFRlbnNvckluZm8ge1xuICBjb25zdCB7aW5wdXRzLCBiYWNrZW5kfSA9IGFyZ3M7XG4gIGNvbnN0IHtpbnB1dH0gPSBpbnB1dHM7XG4gIGNvbnN0IGlucHV0RGF0YSA9IGJhY2tlbmQudGV4RGF0YS5nZXQoaW5wdXQuZGF0YUlkKTtcblxuICByZXR1cm4gaWRlbnRpdHkoe2lucHV0czoge3g6IGlucHV0RGF0YS5jb21wbGV4VGVuc29ySW5mb3MucmVhbH0sIGJhY2tlbmR9KTtcbn1cblxuZXhwb3J0IGNvbnN0IHJlYWxDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogUmVhbCxcbiAgYmFja2VuZE5hbWU6ICd3ZWJnbCcsXG4gIGtlcm5lbEZ1bmM6IHJlYWwgYXMge30gYXMgS2VybmVsRnVuY1xufTtcbiJdfQ==