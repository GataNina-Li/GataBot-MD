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
import { Sign } from '@tensorflow/tfjs-core';
import { unaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
// Sign does not propagate NANs.
const SIGN = `
  if (isnan(x)) { return 0.0; }
  return sign(x);
`;
export const sign = unaryKernelFunc({ opSnippet: SIGN });
export const signConfig = {
    kernelName: Sign,
    backendName: 'webgl',
    kernelFunc: sign,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2lnbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMva2VybmVscy9TaWduLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBZSxJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUV6RCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFFbkUsZ0NBQWdDO0FBQ2hDLE1BQU0sSUFBSSxHQUFHOzs7Q0FHWixDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLGVBQWUsQ0FBQyxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0FBRXZELE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBaUI7SUFDdEMsVUFBVSxFQUFFLElBQUk7SUFDaEIsV0FBVyxFQUFFLE9BQU87SUFDcEIsVUFBVSxFQUFFLElBQUk7Q0FDakIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtLZXJuZWxDb25maWcsIFNpZ259IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7dW5hcnlLZXJuZWxGdW5jfSBmcm9tICcuLi9rZXJuZWxfdXRpbHMva2VybmVsX2Z1bmNzX3V0aWxzJztcblxuLy8gU2lnbiBkb2VzIG5vdCBwcm9wYWdhdGUgTkFOcy5cbmNvbnN0IFNJR04gPSBgXG4gIGlmIChpc25hbih4KSkgeyByZXR1cm4gMC4wOyB9XG4gIHJldHVybiBzaWduKHgpO1xuYDtcblxuZXhwb3J0IGNvbnN0IHNpZ24gPSB1bmFyeUtlcm5lbEZ1bmMoe29wU25pcHBldDogU0lHTn0pO1xuXG5leHBvcnQgY29uc3Qgc2lnbkNvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBTaWduLFxuICBiYWNrZW5kTmFtZTogJ3dlYmdsJyxcbiAga2VybmVsRnVuYzogc2lnbixcbn07XG4iXX0=