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
import { FlipLeftRight } from '@tensorflow/tfjs-core';
import { FlipLeftRightProgram } from '../flip_left_right_gpu';
export const flipLeftRightConfig = {
    kernelName: FlipLeftRight,
    backendName: 'webgl',
    kernelFunc: ({ inputs, backend }) => {
        const { image } = inputs;
        const webglBackend = backend;
        const program = new FlipLeftRightProgram(image.shape);
        const output = webglBackend.runWebGLProgram(program, [image], image.dtype);
        return output;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmxpcExlZnRSaWdodC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMva2VybmVscy9GbGlwTGVmdFJpZ2h0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUdILE9BQU8sRUFBQyxhQUFhLEVBQXNCLE1BQU0sdUJBQXVCLENBQUM7QUFHekUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFFNUQsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQWlCO0lBQy9DLFVBQVUsRUFBRSxhQUFhO0lBQ3pCLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLFVBQVUsRUFBRSxDQUFDLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBQyxFQUFFLEVBQUU7UUFDaEMsTUFBTSxFQUFDLEtBQUssRUFBQyxHQUFHLE1BQTZCLENBQUM7UUFDOUMsTUFBTSxZQUFZLEdBQUcsT0FBMkIsQ0FBQztRQUVqRCxNQUFNLE9BQU8sR0FBRyxJQUFJLG9CQUFvQixDQUFFLEtBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEUsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0UsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7S2VybmVsQ29uZmlnLCBUZW5zb3I0RH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbmltcG9ydCB7RmxpcExlZnRSaWdodCwgRmxpcExlZnRSaWdodElucHV0c30gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtNYXRoQmFja2VuZFdlYkdMfSBmcm9tICcuLi9iYWNrZW5kX3dlYmdsJztcbmltcG9ydCB7RmxpcExlZnRSaWdodFByb2dyYW19IGZyb20gJy4uL2ZsaXBfbGVmdF9yaWdodF9ncHUnO1xuXG5leHBvcnQgY29uc3QgZmxpcExlZnRSaWdodENvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBGbGlwTGVmdFJpZ2h0LFxuICBiYWNrZW5kTmFtZTogJ3dlYmdsJyxcbiAga2VybmVsRnVuYzogKHtpbnB1dHMsIGJhY2tlbmR9KSA9PiB7XG4gICAgY29uc3Qge2ltYWdlfSA9IGlucHV0cyBhcyBGbGlwTGVmdFJpZ2h0SW5wdXRzO1xuICAgIGNvbnN0IHdlYmdsQmFja2VuZCA9IGJhY2tlbmQgYXMgTWF0aEJhY2tlbmRXZWJHTDtcblxuICAgIGNvbnN0IHByb2dyYW0gPSBuZXcgRmxpcExlZnRSaWdodFByb2dyYW0oKGltYWdlIGFzIFRlbnNvcjREKS5zaGFwZSk7XG4gICAgY29uc3Qgb3V0cHV0ID0gd2ViZ2xCYWNrZW5kLnJ1bldlYkdMUHJvZ3JhbShwcm9ncmFtLCBbaW1hZ2VdLCBpbWFnZS5kdHlwZSk7XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxufTtcbiJdfQ==