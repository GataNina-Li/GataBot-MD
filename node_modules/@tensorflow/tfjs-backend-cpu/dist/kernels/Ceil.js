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
import { Ceil } from '@tensorflow/tfjs-core';
import { createSimpleUnaryImpl } from '../utils/unary_impl';
import { unaryKernelFuncFromImpl } from '../utils/unary_utils';
export const ceilImpl = createSimpleUnaryImpl((xi) => Math.ceil(xi));
export const ceil = unaryKernelFuncFromImpl(Ceil, ceilImpl);
export const ceilConfig = {
    kernelName: Ceil,
    backendName: 'cpu',
    kernelFunc: ceil,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2VpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC1jcHUvc3JjL2tlcm5lbHMvQ2VpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsSUFBSSxFQUFlLE1BQU0sdUJBQXVCLENBQUM7QUFFekQsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDMUQsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFN0QsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFHLHFCQUFxQixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDckUsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLHVCQUF1QixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztBQUU1RCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQWlCO0lBQ3RDLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLFVBQVUsRUFBRSxJQUFJO0NBQ2pCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIExpY2Vuc2UpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gQVMgSVMgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0NlaWwsIEtlcm5lbENvbmZpZ30gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtjcmVhdGVTaW1wbGVVbmFyeUltcGx9IGZyb20gJy4uL3V0aWxzL3VuYXJ5X2ltcGwnO1xuaW1wb3J0IHt1bmFyeUtlcm5lbEZ1bmNGcm9tSW1wbH0gZnJvbSAnLi4vdXRpbHMvdW5hcnlfdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgY2VpbEltcGwgPSBjcmVhdGVTaW1wbGVVbmFyeUltcGwoKHhpKSA9PiBNYXRoLmNlaWwoeGkpKTtcbmV4cG9ydCBjb25zdCBjZWlsID0gdW5hcnlLZXJuZWxGdW5jRnJvbUltcGwoQ2VpbCwgY2VpbEltcGwpO1xuXG5leHBvcnQgY29uc3QgY2VpbENvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBDZWlsLFxuICBiYWNrZW5kTmFtZTogJ2NwdScsXG4gIGtlcm5lbEZ1bmM6IGNlaWwsXG59O1xuIl19