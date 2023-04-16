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
import { FlipLeftRight, util } from '@tensorflow/tfjs-core';
export const flipLeftRightConfig = {
    kernelName: FlipLeftRight,
    backendName: 'cpu',
    kernelFunc: ({ inputs, attrs, backend }) => {
        const { image } = inputs;
        const cpuBackend = backend;
        const output = util.getTypedArrayFromDType(image.dtype, util.sizeFromShape(image.shape));
        const [batch, imageHeight, imageWidth, numChannels] = image.shape;
        const imageVals = cpuBackend.data.get(image.dataId).values;
        for (let batchIdx = 0; batchIdx < batch; batchIdx++) {
            const batchOffset = batchIdx * imageWidth * imageHeight * numChannels;
            for (let row = 0; row < imageHeight; row++) {
                const rowOffset = row * (imageWidth * numChannels);
                for (let col = 0; col < imageWidth; col++) {
                    const colOffset = col * numChannels;
                    for (let channel = 0; channel < numChannels; channel++) {
                        const coordX = Math.round(imageWidth - col - 1);
                        const outIdx = batchOffset + rowOffset + colOffset + channel;
                        let outputValue = imageVals[outIdx];
                        // If the coordinate position falls within the image boundaries...
                        if (coordX >= 0 && coordX < imageWidth) {
                            // set the output to the image value at the coordinate position.
                            const rotatedColOffset = coordX * numChannels;
                            const imageIdx = batchOffset + rowOffset + rotatedColOffset + channel;
                            outputValue = imageVals[imageIdx];
                        }
                        output[outIdx] = outputValue;
                    }
                }
            }
        }
        const dataId = cpuBackend.write(output, image.shape, image.dtype);
        return { dataId, shape: image.shape, dtype: image.dtype };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmxpcExlZnRSaWdodC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC1jcHUvc3JjL2tlcm5lbHMvRmxpcExlZnRSaWdodC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFHSCxPQUFPLEVBQUMsYUFBYSxFQUF1QixJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUkvRSxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBaUI7SUFDL0MsVUFBVSxFQUFFLGFBQWE7SUFDekIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsVUFBVSxFQUFFLENBQUMsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBQyxFQUFFLEVBQUU7UUFDdkMsTUFBTSxFQUFDLEtBQUssRUFBQyxHQUFHLE1BQTZCLENBQUM7UUFDOUMsTUFBTSxVQUFVLEdBQUcsT0FBeUIsQ0FBQztRQUU3QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQ3RDLEtBQUssQ0FBQyxLQUF3QixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckUsTUFBTSxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFFbEUsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQW9CLENBQUM7UUFFekUsS0FBSyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRTtZQUNuRCxNQUFNLFdBQVcsR0FBRyxRQUFRLEdBQUcsVUFBVSxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUM7WUFFdEUsS0FBSyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLFdBQVcsRUFBRSxHQUFHLEVBQUUsRUFBRTtnQkFDMUMsTUFBTSxTQUFTLEdBQUcsR0FBRyxHQUFHLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQyxDQUFDO2dCQUVuRCxLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsVUFBVSxFQUFFLEdBQUcsRUFBRSxFQUFFO29CQUN6QyxNQUFNLFNBQVMsR0FBRyxHQUFHLEdBQUcsV0FBVyxDQUFDO29CQUVwQyxLQUFLLElBQUksT0FBTyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsV0FBVyxFQUFFLE9BQU8sRUFBRSxFQUFFO3dCQUN0RCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ2hELE1BQU0sTUFBTSxHQUFHLFdBQVcsR0FBRyxTQUFTLEdBQUcsU0FBUyxHQUFHLE9BQU8sQ0FBQzt3QkFFN0QsSUFBSSxXQUFXLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUNwQyxrRUFBa0U7d0JBQ2xFLElBQUksTUFBTSxJQUFJLENBQUMsSUFBSSxNQUFNLEdBQUcsVUFBVSxFQUFFOzRCQUN0QyxnRUFBZ0U7NEJBQ2hFLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxHQUFHLFdBQVcsQ0FBQzs0QkFDOUMsTUFBTSxRQUFRLEdBQ1YsV0FBVyxHQUFHLFNBQVMsR0FBRyxnQkFBZ0IsR0FBRyxPQUFPLENBQUM7NEJBQ3pELFdBQVcsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7eUJBQ25DO3dCQUNELE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxXQUFXLENBQUM7cUJBQzlCO2lCQUNGO2FBQ0Y7U0FDRjtRQUVELE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xFLE9BQU8sRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUMsQ0FBQztJQUMxRCxDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtLZXJuZWxDb25maWcsIE51bWVyaWNEYXRhVHlwZSwgVHlwZWRBcnJheX0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbmltcG9ydCB7RmxpcExlZnRSaWdodCwgRmxpcExlZnRSaWdodElucHV0cywgdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtNYXRoQmFja2VuZENQVX0gZnJvbSAnLi4vYmFja2VuZF9jcHUnO1xuXG5leHBvcnQgY29uc3QgZmxpcExlZnRSaWdodENvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBGbGlwTGVmdFJpZ2h0LFxuICBiYWNrZW5kTmFtZTogJ2NwdScsXG4gIGtlcm5lbEZ1bmM6ICh7aW5wdXRzLCBhdHRycywgYmFja2VuZH0pID0+IHtcbiAgICBjb25zdCB7aW1hZ2V9ID0gaW5wdXRzIGFzIEZsaXBMZWZ0UmlnaHRJbnB1dHM7XG4gICAgY29uc3QgY3B1QmFja2VuZCA9IGJhY2tlbmQgYXMgTWF0aEJhY2tlbmRDUFU7XG5cbiAgICBjb25zdCBvdXRwdXQgPSB1dGlsLmdldFR5cGVkQXJyYXlGcm9tRFR5cGUoXG4gICAgICAgIGltYWdlLmR0eXBlIGFzIE51bWVyaWNEYXRhVHlwZSwgdXRpbC5zaXplRnJvbVNoYXBlKGltYWdlLnNoYXBlKSk7XG4gICAgY29uc3QgW2JhdGNoLCBpbWFnZUhlaWdodCwgaW1hZ2VXaWR0aCwgbnVtQ2hhbm5lbHNdID0gaW1hZ2Uuc2hhcGU7XG5cbiAgICBjb25zdCBpbWFnZVZhbHMgPSBjcHVCYWNrZW5kLmRhdGEuZ2V0KGltYWdlLmRhdGFJZCkudmFsdWVzIGFzIFR5cGVkQXJyYXk7XG5cbiAgICBmb3IgKGxldCBiYXRjaElkeCA9IDA7IGJhdGNoSWR4IDwgYmF0Y2g7IGJhdGNoSWR4KyspIHtcbiAgICAgIGNvbnN0IGJhdGNoT2Zmc2V0ID0gYmF0Y2hJZHggKiBpbWFnZVdpZHRoICogaW1hZ2VIZWlnaHQgKiBudW1DaGFubmVscztcblxuICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgaW1hZ2VIZWlnaHQ7IHJvdysrKSB7XG4gICAgICAgIGNvbnN0IHJvd09mZnNldCA9IHJvdyAqIChpbWFnZVdpZHRoICogbnVtQ2hhbm5lbHMpO1xuXG4gICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGltYWdlV2lkdGg7IGNvbCsrKSB7XG4gICAgICAgICAgY29uc3QgY29sT2Zmc2V0ID0gY29sICogbnVtQ2hhbm5lbHM7XG5cbiAgICAgICAgICBmb3IgKGxldCBjaGFubmVsID0gMDsgY2hhbm5lbCA8IG51bUNoYW5uZWxzOyBjaGFubmVsKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkWCA9IE1hdGgucm91bmQoaW1hZ2VXaWR0aCAtIGNvbCAtIDEpO1xuICAgICAgICAgICAgY29uc3Qgb3V0SWR4ID0gYmF0Y2hPZmZzZXQgKyByb3dPZmZzZXQgKyBjb2xPZmZzZXQgKyBjaGFubmVsO1xuXG4gICAgICAgICAgICBsZXQgb3V0cHV0VmFsdWUgPSBpbWFnZVZhbHNbb3V0SWR4XTtcbiAgICAgICAgICAgIC8vIElmIHRoZSBjb29yZGluYXRlIHBvc2l0aW9uIGZhbGxzIHdpdGhpbiB0aGUgaW1hZ2UgYm91bmRhcmllcy4uLlxuICAgICAgICAgICAgaWYgKGNvb3JkWCA+PSAwICYmIGNvb3JkWCA8IGltYWdlV2lkdGgpIHtcbiAgICAgICAgICAgICAgLy8gc2V0IHRoZSBvdXRwdXQgdG8gdGhlIGltYWdlIHZhbHVlIGF0IHRoZSBjb29yZGluYXRlIHBvc2l0aW9uLlxuICAgICAgICAgICAgICBjb25zdCByb3RhdGVkQ29sT2Zmc2V0ID0gY29vcmRYICogbnVtQ2hhbm5lbHM7XG4gICAgICAgICAgICAgIGNvbnN0IGltYWdlSWR4ID1cbiAgICAgICAgICAgICAgICAgIGJhdGNoT2Zmc2V0ICsgcm93T2Zmc2V0ICsgcm90YXRlZENvbE9mZnNldCArIGNoYW5uZWw7XG4gICAgICAgICAgICAgIG91dHB1dFZhbHVlID0gaW1hZ2VWYWxzW2ltYWdlSWR4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG91dHB1dFtvdXRJZHhdID0gb3V0cHV0VmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YUlkID0gY3B1QmFja2VuZC53cml0ZShvdXRwdXQsIGltYWdlLnNoYXBlLCBpbWFnZS5kdHlwZSk7XG4gICAgcmV0dXJuIHtkYXRhSWQsIHNoYXBlOiBpbWFnZS5zaGFwZSwgZHR5cGU6IGltYWdlLmR0eXBlfTtcbiAgfVxufTtcbiJdfQ==