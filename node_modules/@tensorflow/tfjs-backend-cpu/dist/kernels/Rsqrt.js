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
import { Rsqrt } from '@tensorflow/tfjs-core';
import { createSimpleUnaryImpl } from '../utils/unary_impl';
import { unaryKernelFuncFromImpl } from '../utils/unary_utils';
export const rsqrtImpl = createSimpleUnaryImpl((xi) => 1 / Math.sqrt(xi));
export const rsqrt = unaryKernelFuncFromImpl(Rsqrt, rsqrtImpl);
export const rsqrtConfig = {
    kernelName: Rsqrt,
    backendName: 'cpu',
    kernelFunc: rsqrt,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUnNxcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtY3B1L3NyYy9rZXJuZWxzL1JzcXJ0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBZSxLQUFLLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUUxRCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUMxRCxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUU3RCxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQUcscUJBQXFCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUUsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLHVCQUF1QixDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztBQUUvRCxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQWlCO0lBQ3ZDLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLFVBQVUsRUFBRSxLQUFLO0NBQ2xCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIExpY2Vuc2UpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gQVMgSVMgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0tlcm5lbENvbmZpZywgUnNxcnR9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7Y3JlYXRlU2ltcGxlVW5hcnlJbXBsfSBmcm9tICcuLi91dGlscy91bmFyeV9pbXBsJztcbmltcG9ydCB7dW5hcnlLZXJuZWxGdW5jRnJvbUltcGx9IGZyb20gJy4uL3V0aWxzL3VuYXJ5X3V0aWxzJztcblxuZXhwb3J0IGNvbnN0IHJzcXJ0SW1wbCA9IGNyZWF0ZVNpbXBsZVVuYXJ5SW1wbCgoeGkpID0+IDEgLyBNYXRoLnNxcnQoeGkpKTtcbmV4cG9ydCBjb25zdCByc3FydCA9IHVuYXJ5S2VybmVsRnVuY0Zyb21JbXBsKFJzcXJ0LCByc3FydEltcGwpO1xuXG5leHBvcnQgY29uc3QgcnNxcnRDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogUnNxcnQsXG4gIGJhY2tlbmROYW1lOiAnY3B1JyxcbiAga2VybmVsRnVuYzogcnNxcnQsXG59O1xuIl19