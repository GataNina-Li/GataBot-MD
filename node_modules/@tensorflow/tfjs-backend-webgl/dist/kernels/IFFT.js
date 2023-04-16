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
import { IFFT } from '@tensorflow/tfjs-core';
import { fftImpl } from './FFT_impl';
export function ifft(args) {
    const { inputs, backend } = args;
    const { input } = inputs;
    return fftImpl(input, true /* inverse */, backend);
}
export const ifftConfig = {
    kernelName: IFFT,
    backendName: 'webgl',
    kernelFunc: ifft
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSUZGVC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMva2VybmVscy9JRkZULnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxJQUFJLEVBQXVDLE1BQU0sdUJBQXVCLENBQUM7QUFJakYsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFlBQVksQ0FBQztBQUVuQyxNQUFNLFVBQVUsSUFBSSxDQUFDLElBQXFEO0lBRXhFLE1BQU0sRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFDLEdBQUcsSUFBSSxDQUFDO0lBQy9CLE1BQU0sRUFBQyxLQUFLLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFFdkIsT0FBTyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDckQsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBaUI7SUFDdEMsVUFBVSxFQUFFLElBQUk7SUFDaEIsV0FBVyxFQUFFLE9BQU87SUFDcEIsVUFBVSxFQUFFLElBQUk7Q0FDakIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtJRkZULCBJRkZUSW5wdXRzLCBLZXJuZWxDb25maWcsIFRlbnNvckluZm99IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7TWF0aEJhY2tlbmRXZWJHTH0gZnJvbSAnLi4vYmFja2VuZF93ZWJnbCc7XG5cbmltcG9ydCB7ZmZ0SW1wbH0gZnJvbSAnLi9GRlRfaW1wbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpZmZ0KGFyZ3M6IHtpbnB1dHM6IElGRlRJbnB1dHMsIGJhY2tlbmQ6IE1hdGhCYWNrZW5kV2ViR0x9KTpcbiAgICBUZW5zb3JJbmZvIHtcbiAgY29uc3Qge2lucHV0cywgYmFja2VuZH0gPSBhcmdzO1xuICBjb25zdCB7aW5wdXR9ID0gaW5wdXRzO1xuXG4gIHJldHVybiBmZnRJbXBsKGlucHV0LCB0cnVlIC8qIGludmVyc2UgKi8sIGJhY2tlbmQpO1xufVxuXG5leHBvcnQgY29uc3QgaWZmdENvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBJRkZULFxuICBiYWNrZW5kTmFtZTogJ3dlYmdsJyxcbiAga2VybmVsRnVuYzogaWZmdFxufTtcbiJdfQ==