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
import { ExpandDims, util } from '@tensorflow/tfjs-core';
import { reshape } from './Reshape';
export function expandDims(args) {
    const { inputs, backend, attrs } = args;
    const { input } = inputs;
    const { dim } = attrs;
    const inputRank = input.shape.length;
    const newShape = input.shape.slice();
    let $dim = dim;
    if (dim < 0) {
        // Negative value is counted from the tail of rank.
        util.assert(-(inputRank + 1) <= dim, () => `Axis must be in the interval [${-(inputRank + 1)}, ${inputRank}]`);
        $dim = inputRank + dim + 1;
    }
    newShape.splice($dim, 0, 1);
    return reshape({ inputs: { x: input }, backend, attrs: { shape: newShape } });
}
export const expandDimsConfig = {
    kernelName: ExpandDims,
    backendName: 'cpu',
    kernelFunc: expandDims
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXhwYW5kRGltcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC1jcHUvc3JjL2tlcm5lbHMvRXhwYW5kRGltcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUEyRSxJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUdoSSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBRWxDLE1BQU0sVUFBVSxVQUFVLENBQUMsSUFJMUI7SUFDQyxNQUFNLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUMsR0FBRyxJQUFJLENBQUM7SUFDdEMsTUFBTSxFQUFDLEtBQUssRUFBQyxHQUFHLE1BQU0sQ0FBQztJQUN2QixNQUFNLEVBQUMsR0FBRyxFQUFDLEdBQUcsS0FBSyxDQUFDO0lBRXBCLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ3JDLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDckMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDO0lBQ2YsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFO1FBQ1gsbURBQW1EO1FBQ25ELElBQUksQ0FBQyxNQUFNLENBQ1AsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQ3ZCLEdBQUcsRUFBRSxDQUFDLGlDQUFpQyxDQUFFLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxLQUNwRCxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLElBQUksR0FBRyxTQUFTLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztLQUM1QjtJQUNELFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUU1QixPQUFPLE9BQU8sQ0FBQyxFQUFDLE1BQU0sRUFBRSxFQUFDLENBQUMsRUFBRSxLQUFLLEVBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxFQUFDLENBQUMsQ0FBQztBQUMxRSxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQWlCO0lBQzVDLFVBQVUsRUFBRSxVQUFVO0lBQ3RCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLFVBQVUsRUFBRSxVQUE4QjtDQUMzQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0V4cGFuZERpbXMsIEV4cGFuZERpbXNBdHRycywgRXhwYW5kRGltc0lucHV0cywgS2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jLCBUZW5zb3JJbmZvLCB1dGlsfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge01hdGhCYWNrZW5kQ1BVfSBmcm9tICcuLi9iYWNrZW5kX2NwdSc7XG5pbXBvcnQge3Jlc2hhcGV9IGZyb20gJy4vUmVzaGFwZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBleHBhbmREaW1zKGFyZ3M6IHtcbiAgaW5wdXRzOiBFeHBhbmREaW1zSW5wdXRzLFxuICBiYWNrZW5kOiBNYXRoQmFja2VuZENQVSxcbiAgYXR0cnM6IEV4cGFuZERpbXNBdHRyc1xufSk6IFRlbnNvckluZm8ge1xuICBjb25zdCB7aW5wdXRzLCBiYWNrZW5kLCBhdHRyc30gPSBhcmdzO1xuICBjb25zdCB7aW5wdXR9ID0gaW5wdXRzO1xuICBjb25zdCB7ZGltfSA9IGF0dHJzO1xuXG4gIGNvbnN0IGlucHV0UmFuayA9IGlucHV0LnNoYXBlLmxlbmd0aDtcbiAgY29uc3QgbmV3U2hhcGUgPSBpbnB1dC5zaGFwZS5zbGljZSgpO1xuICBsZXQgJGRpbSA9IGRpbTtcbiAgaWYgKGRpbSA8IDApIHtcbiAgICAvLyBOZWdhdGl2ZSB2YWx1ZSBpcyBjb3VudGVkIGZyb20gdGhlIHRhaWwgb2YgcmFuay5cbiAgICB1dGlsLmFzc2VydChcbiAgICAgICAgLShpbnB1dFJhbmsgKyAxKSA8PSBkaW0sXG4gICAgICAgICgpID0+IGBBeGlzIG11c3QgYmUgaW4gdGhlIGludGVydmFsIFskey0gKGlucHV0UmFuayArIDEpfSwgJHtcbiAgICAgICAgICAgIGlucHV0UmFua31dYCk7XG4gICAgJGRpbSA9IGlucHV0UmFuayArIGRpbSArIDE7XG4gIH1cbiAgbmV3U2hhcGUuc3BsaWNlKCRkaW0sIDAsIDEpO1xuXG4gIHJldHVybiByZXNoYXBlKHtpbnB1dHM6IHt4OiBpbnB1dH0sIGJhY2tlbmQsIGF0dHJzOiB7c2hhcGU6IG5ld1NoYXBlfX0pO1xufVxuXG5leHBvcnQgY29uc3QgZXhwYW5kRGltc0NvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBFeHBhbmREaW1zLFxuICBiYWNrZW5kTmFtZTogJ2NwdScsXG4gIGtlcm5lbEZ1bmM6IGV4cGFuZERpbXMgYXMge30gYXMgS2VybmVsRnVuY1xufTtcbiJdfQ==