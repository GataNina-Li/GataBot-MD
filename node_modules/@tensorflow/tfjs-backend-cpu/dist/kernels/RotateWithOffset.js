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
import { backend_util, RotateWithOffset, util } from '@tensorflow/tfjs-core';
export const rotateWithOffsetConfig = {
    kernelName: RotateWithOffset,
    backendName: 'cpu',
    kernelFunc: ({ inputs, attrs, backend }) => {
        const { image } = inputs;
        const { radians, fillValue, center } = attrs;
        const cpuBackend = backend;
        const output = util.getTypedArrayFromDType(image.dtype, util.sizeFromShape(image.shape));
        const [batch, imageHeight, imageWidth, numChannels] = image.shape;
        const [centerX, centerY] = backend_util.getImageCenter(center, imageHeight, imageWidth);
        const fullOpacityValue = 255;
        const sinFactor = Math.sin(radians);
        const cosFactor = Math.cos(radians);
        const imageVals = cpuBackend.data.get(image.dataId).values;
        for (let batchIdx = 0; batchIdx < batch; batchIdx++) {
            const batchOffset = batchIdx * imageWidth * imageHeight * numChannels;
            for (let row = 0; row < imageHeight; row++) {
                const rowOffset = row * (imageWidth * numChannels);
                for (let col = 0; col < imageWidth; col++) {
                    const colOffset = col * numChannels;
                    for (let channel = 0; channel < numChannels; channel++) {
                        const coords = [batch, row, col, channel];
                        const x = coords[2];
                        const y = coords[1];
                        // coordX/coordY are the result of rotating and translating x/y.
                        let coordX = (x - centerX) * cosFactor - (y - centerY) * sinFactor;
                        let coordY = (x - centerX) * sinFactor + (y - centerY) * cosFactor;
                        coordX = Math.round(coordX + centerX);
                        coordY = Math.round(coordY + centerY);
                        let outputValue = fillValue;
                        if (typeof fillValue !== 'number') {
                            if (channel === 3) {
                                outputValue = fullOpacityValue;
                            }
                            else {
                                outputValue = fillValue[channel];
                            }
                        }
                        // If the coordinate position falls within the image boundaries...
                        if (coordX >= 0 && coordX < imageWidth && coordY >= 0 &&
                            coordY < imageHeight) {
                            // set the output to the image value at the coordinate position.
                            const rotatedRowOffset = coordY * (imageWidth * numChannels);
                            const rotatedColOffset = coordX * numChannels;
                            const imageIdx = batchOffset + rotatedRowOffset + rotatedColOffset + channel;
                            outputValue = imageVals[imageIdx];
                        }
                        const outIdx = batchOffset + rowOffset + colOffset + channel;
                        output[outIdx] = outputValue;
                    }
                }
            }
        }
        const dataId = cpuBackend.write(output, image.shape, image.dtype);
        return { dataId, shape: image.shape, dtype: image.dtype };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm90YXRlV2l0aE9mZnNldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC1jcHUvc3JjL2tlcm5lbHMvUm90YXRlV2l0aE9mZnNldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFHSCxPQUFPLEVBQUMsWUFBWSxFQUFFLGdCQUFnQixFQUFpRCxJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUkxSCxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBaUI7SUFDbEQsVUFBVSxFQUFFLGdCQUFnQjtJQUM1QixXQUFXLEVBQUUsS0FBSztJQUNsQixVQUFVLEVBQUUsQ0FBQyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLEVBQUUsRUFBRTtRQUN2QyxNQUFNLEVBQUMsS0FBSyxFQUFDLEdBQUcsTUFBZ0MsQ0FBQztRQUNqRCxNQUFNLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUMsR0FBRyxLQUFvQyxDQUFDO1FBQzFFLE1BQU0sVUFBVSxHQUFHLE9BQXlCLENBQUM7UUFFN0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUN0QyxLQUFLLENBQUMsS0FBd0IsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBRWxFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQ3BCLFlBQVksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNqRSxNQUFNLGdCQUFnQixHQUFHLEdBQUcsQ0FBQztRQUU3QixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9B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QUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEUsT0FBTyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBQyxDQUFDO0lBQzFELENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0tlcm5lbENvbmZpZywgTnVtZXJpY0RhdGFUeXBlLCBUeXBlZEFycmF5fSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0IHtiYWNrZW5kX3V0aWwsIFJvdGF0ZVdpdGhPZmZzZXQsIFJvdGF0ZVdpdGhPZmZzZXRBdHRycywgUm90YXRlV2l0aE9mZnNldElucHV0cywgdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtNYXRoQmFja2VuZENQVX0gZnJvbSAnLi4vYmFja2VuZF9jcHUnO1xuXG5leHBvcnQgY29uc3Qgcm90YXRlV2l0aE9mZnNldENvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBSb3RhdGVXaXRoT2Zmc2V0LFxuICBiYWNrZW5kTmFtZTogJ2NwdScsXG4gIGtlcm5lbEZ1bmM6ICh7aW5wdXRzLCBhdHRycywgYmFja2VuZH0pID0+IHtcbiAgICBjb25zdCB7aW1hZ2V9ID0gaW5wdXRzIGFzIFJvdGF0ZVdpdGhPZmZzZXRJbnB1dHM7XG4gICAgY29uc3Qge3JhZGlhbnMsIGZpbGxWYWx1ZSwgY2VudGVyfSA9IGF0dHJzIGFzIHt9IGFzIFJvdGF0ZVdpdGhPZmZzZXRBdHRycztcbiAgICBjb25zdCBjcHVCYWNrZW5kID0gYmFja2VuZCBhcyBNYXRoQmFja2VuZENQVTtcblxuICAgIGNvbnN0IG91dHB1dCA9IHV0aWwuZ2V0VHlwZWRBcnJheUZyb21EVHlwZShcbiAgICAgICAgaW1hZ2UuZHR5cGUgYXMgTnVtZXJpY0RhdGFUeXBlLCB1dGlsLnNpemVGcm9tU2hhcGUoaW1hZ2Uuc2hhcGUpKTtcbiAgICBjb25zdCBbYmF0Y2gsIGltYWdlSGVpZ2h0LCBpbWFnZVdpZHRoLCBudW1DaGFubmVsc10gPSBpbWFnZS5zaGFwZTtcblxuICAgIGNvbnN0IFtjZW50ZXJYLCBjZW50ZXJZXSA9XG4gICAgICAgIGJhY2tlbmRfdXRpbC5nZXRJbWFnZUNlbnRlcihjZW50ZXIsIGltYWdlSGVpZ2h0LCBpbWFnZVdpZHRoKTtcbiAgICBjb25zdCBmdWxsT3BhY2l0eVZhbHVlID0gMjU1O1xuXG4gICAgY29uc3Qgc2luRmFjdG9yID0gTWF0aC5zaW4ocmFkaWFucyk7XG4gICAgY29uc3QgY29zRmFjdG9yID0gTWF0aC5jb3MocmFkaWFucyk7XG4gICAgY29uc3QgaW1hZ2VWYWxzID0gY3B1QmFja2VuZC5kYXRhLmdldChpbWFnZS5kYXRhSWQpLnZhbHVlcyBhcyBUeXBlZEFycmF5O1xuXG4gICAgZm9yIChsZXQgYmF0Y2hJZHggPSAwOyBiYXRjaElkeCA8IGJhdGNoOyBiYXRjaElkeCsrKSB7XG4gICAgICBjb25zdCBiYXRjaE9mZnNldCA9IGJhdGNoSWR4ICogaW1hZ2VXaWR0aCAqIGltYWdlSGVpZ2h0ICogbnVtQ2hhbm5lbHM7XG5cbiAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGltYWdlSGVpZ2h0OyByb3crKykge1xuICAgICAgICBjb25zdCByb3dPZmZzZXQgPSByb3cgKiAoaW1hZ2VXaWR0aCAqIG51bUNoYW5uZWxzKTtcblxuICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBpbWFnZVdpZHRoOyBjb2wrKykge1xuICAgICAgICAgIGNvbnN0IGNvbE9mZnNldCA9IGNvbCAqIG51bUNoYW5uZWxzO1xuXG4gICAgICAgICAgZm9yIChsZXQgY2hhbm5lbCA9IDA7IGNoYW5uZWwgPCBudW1DaGFubmVsczsgY2hhbm5lbCsrKSB7XG4gICAgICAgICAgICBjb25zdCBjb29yZHMgPSBbYmF0Y2gsIHJvdywgY29sLCBjaGFubmVsXTtcblxuICAgICAgICAgICAgY29uc3QgeCA9IGNvb3Jkc1syXTtcbiAgICAgICAgICAgIGNvbnN0IHkgPSBjb29yZHNbMV07XG5cbiAgICAgICAgICAgIC8vIGNvb3JkWC9jb29yZFkgYXJlIHRoZSByZXN1bHQgb2Ygcm90YXRpbmcgYW5kIHRyYW5zbGF0aW5nIHgveS5cbiAgICAgICAgICAgIGxldCBjb29yZFggPSAoeCAtIGNlbnRlclgpICogY29zRmFjdG9yIC0gKHkgLSBjZW50ZXJZKSAqIHNpbkZhY3RvcjtcbiAgICAgICAgICAgIGxldCBjb29yZFkgPSAoeCAtIGNlbnRlclgpICogc2luRmFjdG9yICsgKHkgLSBjZW50ZXJZKSAqIGNvc0ZhY3RvcjtcbiAgICAgICAgICAgIGNvb3JkWCA9IE1hdGgucm91bmQoY29vcmRYICsgY2VudGVyWCk7XG4gICAgICAgICAgICBjb29yZFkgPSBNYXRoLnJvdW5kKGNvb3JkWSArIGNlbnRlclkpO1xuXG4gICAgICAgICAgICBsZXQgb3V0cHV0VmFsdWUgPSBmaWxsVmFsdWU7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGZpbGxWYWx1ZSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgaWYgKGNoYW5uZWwgPT09IDMpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXRWYWx1ZSA9IGZ1bGxPcGFjaXR5VmFsdWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0VmFsdWUgPSBmaWxsVmFsdWVbY2hhbm5lbF07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgdGhlIGNvb3JkaW5hdGUgcG9zaXRpb24gZmFsbHMgd2l0aGluIHRoZSBpbWFnZSBib3VuZGFyaWVzLi4uXG4gICAgICAgICAgICBpZiAoY29vcmRYID49IDAgJiYgY29vcmRYIDwgaW1hZ2VXaWR0aCAmJiBjb29yZFkgPj0gMCAmJlxuICAgICAgICAgICAgICAgIGNvb3JkWSA8IGltYWdlSGVpZ2h0KSB7XG4gICAgICAgICAgICAgIC8vIHNldCB0aGUgb3V0cHV0IHRvIHRoZSBpbWFnZSB2YWx1ZSBhdCB0aGUgY29vcmRpbmF0ZSBwb3NpdGlvbi5cbiAgICAgICAgICAgICAgY29uc3Qgcm90YXRlZFJvd09mZnNldCA9IGNvb3JkWSAqIChpbWFnZVdpZHRoICogbnVtQ2hhbm5lbHMpO1xuICAgICAgICAgICAgICBjb25zdCByb3RhdGVkQ29sT2Zmc2V0ID0gY29vcmRYICogbnVtQ2hhbm5lbHM7XG4gICAgICAgICAgICAgIGNvbnN0IGltYWdlSWR4ID1cbiAgICAgICAgICAgICAgICAgIGJhdGNoT2Zmc2V0ICsgcm90YXRlZFJvd09mZnNldCArIHJvdGF0ZWRDb2xPZmZzZXQgKyBjaGFubmVsO1xuICAgICAgICAgICAgICBvdXRwdXRWYWx1ZSA9IGltYWdlVmFsc1tpbWFnZUlkeF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG91dElkeCA9IGJhdGNoT2Zmc2V0ICsgcm93T2Zmc2V0ICsgY29sT2Zmc2V0ICsgY2hhbm5lbDtcbiAgICAgICAgICAgIG91dHB1dFtvdXRJZHhdID0gb3V0cHV0VmFsdWUgYXMgbnVtYmVyO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGRhdGFJZCA9IGNwdUJhY2tlbmQud3JpdGUob3V0cHV0LCBpbWFnZS5zaGFwZSwgaW1hZ2UuZHR5cGUpO1xuICAgIHJldHVybiB7ZGF0YUlkLCBzaGFwZTogaW1hZ2Uuc2hhcGUsIGR0eXBlOiBpbWFnZS5kdHlwZX07XG4gIH1cbn07XG4iXX0=