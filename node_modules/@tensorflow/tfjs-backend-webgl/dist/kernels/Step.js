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
import { Step } from '@tensorflow/tfjs-core';
import { CHECK_NAN_SNIPPET, UnaryOpProgram } from '../unaryop_gpu';
export function step({ inputs, attrs, backend }) {
    const { x } = inputs;
    const opSnippet = CHECK_NAN_SNIPPET + `
    return x > 0.0 ? 1.0 : float(${attrs.alpha});
  `;
    const program = new UnaryOpProgram(x.shape, opSnippet);
    return backend.runWebGLProgram(program, [x], x.dtype);
}
export const stepConfig = {
    kernelName: Step,
    backendName: 'webgl',
    kernelFunc: step,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RlcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMva2VybmVscy9TdGVwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBMkIsSUFBSSxFQUFxQyxNQUFNLHVCQUF1QixDQUFDO0FBR3pHLE9BQU8sRUFBQyxpQkFBaUIsRUFBRSxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVqRSxNQUFNLFVBQVUsSUFBSSxDQUNoQixFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUMrQztJQUV4RSxNQUFNLEVBQUMsQ0FBQyxFQUFDLEdBQUcsTUFBTSxDQUFDO0lBQ25CLE1BQU0sU0FBUyxHQUFHLGlCQUFpQixHQUFHO21DQUNMLEtBQUssQ0FBQyxLQUFLO0dBQzNDLENBQUM7SUFFRixNQUFNLE9BQU8sR0FBRyxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRXZELE9BQU8sT0FBTyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEQsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBaUI7SUFDdEMsVUFBVSxFQUFFLElBQUk7SUFDaEIsV0FBVyxFQUFFLE9BQU87SUFDcEIsVUFBVSxFQUFFLElBQXdCO0NBQ3JDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7S2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jLCBTdGVwLCBTdGVwQXR0cnMsIFRlbnNvckluZm8sIFVuYXJ5SW5wdXRzfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge01hdGhCYWNrZW5kV2ViR0x9IGZyb20gJy4uL2JhY2tlbmRfd2ViZ2wnO1xuaW1wb3J0IHtDSEVDS19OQU5fU05JUFBFVCwgVW5hcnlPcFByb2dyYW19IGZyb20gJy4uL3VuYXJ5b3BfZ3B1JztcblxuZXhwb3J0IGZ1bmN0aW9uIHN0ZXAoXG4gICAge2lucHV0cywgYXR0cnMsIGJhY2tlbmR9OlxuICAgICAgICB7aW5wdXRzOiBVbmFyeUlucHV0cywgYXR0cnM6IFN0ZXBBdHRycywgYmFja2VuZDogTWF0aEJhY2tlbmRXZWJHTH0pOlxuICAgIFRlbnNvckluZm8ge1xuICBjb25zdCB7eH0gPSBpbnB1dHM7XG4gIGNvbnN0IG9wU25pcHBldCA9IENIRUNLX05BTl9TTklQUEVUICsgYFxuICAgIHJldHVybiB4ID4gMC4wID8gMS4wIDogZmxvYXQoJHthdHRycy5hbHBoYX0pO1xuICBgO1xuXG4gIGNvbnN0IHByb2dyYW0gPSBuZXcgVW5hcnlPcFByb2dyYW0oeC5zaGFwZSwgb3BTbmlwcGV0KTtcblxuICByZXR1cm4gYmFja2VuZC5ydW5XZWJHTFByb2dyYW0ocHJvZ3JhbSwgW3hdLCB4LmR0eXBlKTtcbn1cblxuZXhwb3J0IGNvbnN0IHN0ZXBDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogU3RlcCxcbiAgYmFja2VuZE5hbWU6ICd3ZWJnbCcsXG4gIGtlcm5lbEZ1bmM6IHN0ZXAgYXMge30gYXMgS2VybmVsRnVuYyxcbn07XG4iXX0=