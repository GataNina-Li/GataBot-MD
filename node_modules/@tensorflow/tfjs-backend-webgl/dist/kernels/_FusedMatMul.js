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
import { _FusedMatMul } from '@tensorflow/tfjs-core';
import { batchMatMulImpl } from './BatchMatMul_impl';
export function _fusedMatMul(args) {
    const { inputs, backend, attrs } = args;
    const { a, b, bias, preluActivationWeights } = inputs;
    const { transposeA, transposeB, activation, leakyreluAlpha } = attrs;
    return batchMatMulImpl({
        a,
        b,
        transposeA,
        transposeB,
        backend,
        bias,
        preluActivationWeights,
        leakyreluAlpha,
        activation
    });
}
export const _fusedMatMulConfig = {
    kernelName: _FusedMatMul,
    backendName: 'webgl',
    kernelFunc: _fusedMatMul,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX0Z1c2VkTWF0TXVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9rZXJuZWxzL19GdXNlZE1hdE11bC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFrRSxNQUFNLHVCQUF1QixDQUFDO0FBR3BILE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUVuRCxNQUFNLFVBQVUsWUFBWSxDQUFDLElBSTVCO0lBQ0MsTUFBTSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3RDLE1BQU0sRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxzQkFBc0IsRUFBQyxHQUFHLE1BQU0sQ0FBQztJQUNwRCxNQUFNLEVBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFDLEdBQUcsS0FBSyxDQUFDO0lBRW5FLE9BQU8sZUFBZSxDQUFDO1FBQ3JCLENBQUM7UUFDRCxDQUFDO1FBQ0QsVUFBVTtRQUNWLFVBQVU7UUFDVixPQUFPO1FBQ1AsSUFBSTtRQUNKLHNCQUFzQjtRQUN0QixjQUFjO1FBQ2QsVUFBVTtLQUNYLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBaUI7SUFDOUMsVUFBVSxFQUFFLFlBQVk7SUFDeEIsV0FBVyxFQUFFLE9BQU87SUFDcEIsVUFBVSxFQUFFLFlBQWdDO0NBQzdDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIExpY2Vuc2UpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gQVMgSVMgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge19GdXNlZE1hdE11bCwgX0Z1c2VkTWF0TXVsQXR0cnMsIF9GdXNlZE1hdE11bElucHV0cywgS2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge01hdGhCYWNrZW5kV2ViR0x9IGZyb20gJy4uL2JhY2tlbmRfd2ViZ2wnO1xuaW1wb3J0IHtiYXRjaE1hdE11bEltcGx9IGZyb20gJy4vQmF0Y2hNYXRNdWxfaW1wbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBfZnVzZWRNYXRNdWwoYXJnczoge1xuICBpbnB1dHM6IF9GdXNlZE1hdE11bElucHV0cyxcbiAgYXR0cnM6IF9GdXNlZE1hdE11bEF0dHJzLFxuICBiYWNrZW5kOiBNYXRoQmFja2VuZFdlYkdMXG59KSB7XG4gIGNvbnN0IHtpbnB1dHMsIGJhY2tlbmQsIGF0dHJzfSA9IGFyZ3M7XG4gIGNvbnN0IHthLCBiLCBiaWFzLCBwcmVsdUFjdGl2YXRpb25XZWlnaHRzfSA9IGlucHV0cztcbiAgY29uc3Qge3RyYW5zcG9zZUEsIHRyYW5zcG9zZUIsIGFjdGl2YXRpb24sIGxlYWt5cmVsdUFscGhhfSA9IGF0dHJzO1xuXG4gIHJldHVybiBiYXRjaE1hdE11bEltcGwoe1xuICAgIGEsXG4gICAgYixcbiAgICB0cmFuc3Bvc2VBLFxuICAgIHRyYW5zcG9zZUIsXG4gICAgYmFja2VuZCxcbiAgICBiaWFzLFxuICAgIHByZWx1QWN0aXZhdGlvbldlaWdodHMsXG4gICAgbGVha3lyZWx1QWxwaGEsXG4gICAgYWN0aXZhdGlvblxuICB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IF9mdXNlZE1hdE11bENvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBfRnVzZWRNYXRNdWwsXG4gIGJhY2tlbmROYW1lOiAnd2ViZ2wnLFxuICBrZXJuZWxGdW5jOiBfZnVzZWRNYXRNdWwgYXMge30gYXMgS2VybmVsRnVuYyxcbn07XG4iXX0=