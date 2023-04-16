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
import { ExpandDims, util } from '@tensorflow/tfjs-core';
import { reshape } from './Reshape';
export function expandDims(args) {
    const { inputs, attrs, backend } = args;
    const { dim } = attrs;
    const { input } = inputs;
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
    backendName: 'webgl',
    kernelFunc: expandDims,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXhwYW5kRGltcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMva2VybmVscy9FeHBhbmREaW1zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQTJFLElBQUksRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBR2hJLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFbEMsTUFBTSxVQUFVLFVBQVUsQ0FBQyxJQUkxQjtJQUNDLE1BQU0sRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBQyxHQUFHLElBQUksQ0FBQztJQUN0QyxNQUFNLEVBQUMsR0FBRyxFQUFDLEdBQUcsS0FBSyxDQUFDO0lBQ3BCLE1BQU0sRUFBQyxLQUFLLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFFdkIsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDckMsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNyQyxJQUFJLElBQUksR0FBRyxHQUFHLENBQUM7SUFDZixJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUU7UUFDWCxtREFBbUQ7UUFDbkQsSUFBSSxDQUFDLE1BQU0sQ0FDUCxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFDdkIsR0FBRyxFQUFFLENBQUMsaUNBQWlDLENBQUUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEtBQ3BELFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDdEIsSUFBSSxHQUFHLFNBQVMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0tBQzVCO0lBQ0QsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTVCLE9BQU8sT0FBTyxDQUFDLEVBQUMsTUFBTSxFQUFFLEVBQUMsQ0FBQyxFQUFFLEtBQUssRUFBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLEVBQUMsQ0FBQyxDQUFDO0FBQzFFLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBaUI7SUFDNUMsVUFBVSxFQUFFLFVBQVU7SUFDdEIsV0FBVyxFQUFFLE9BQU87SUFDcEIsVUFBVSxFQUFFLFVBQThCO0NBQzNDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIExpY2Vuc2UpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gQVMgSVMgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0V4cGFuZERpbXMsIEV4cGFuZERpbXNBdHRycywgRXhwYW5kRGltc0lucHV0cywgS2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jLCBUZW5zb3JJbmZvLCB1dGlsfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge01hdGhCYWNrZW5kV2ViR0x9IGZyb20gJy4uL2JhY2tlbmRfd2ViZ2wnO1xuaW1wb3J0IHtyZXNoYXBlfSBmcm9tICcuL1Jlc2hhcGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gZXhwYW5kRGltcyhhcmdzOiB7XG4gIGlucHV0czogRXhwYW5kRGltc0lucHV0cyxcbiAgYXR0cnM6IEV4cGFuZERpbXNBdHRycyxcbiAgYmFja2VuZDogTWF0aEJhY2tlbmRXZWJHTFxufSk6IFRlbnNvckluZm8ge1xuICBjb25zdCB7aW5wdXRzLCBhdHRycywgYmFja2VuZH0gPSBhcmdzO1xuICBjb25zdCB7ZGltfSA9IGF0dHJzO1xuICBjb25zdCB7aW5wdXR9ID0gaW5wdXRzO1xuXG4gIGNvbnN0IGlucHV0UmFuayA9IGlucHV0LnNoYXBlLmxlbmd0aDtcbiAgY29uc3QgbmV3U2hhcGUgPSBpbnB1dC5zaGFwZS5zbGljZSgpO1xuICBsZXQgJGRpbSA9IGRpbTtcbiAgaWYgKGRpbSA8IDApIHtcbiAgICAvLyBOZWdhdGl2ZSB2YWx1ZSBpcyBjb3VudGVkIGZyb20gdGhlIHRhaWwgb2YgcmFuay5cbiAgICB1dGlsLmFzc2VydChcbiAgICAgICAgLShpbnB1dFJhbmsgKyAxKSA8PSBkaW0sXG4gICAgICAgICgpID0+IGBBeGlzIG11c3QgYmUgaW4gdGhlIGludGVydmFsIFskey0gKGlucHV0UmFuayArIDEpfSwgJHtcbiAgICAgICAgICAgIGlucHV0UmFua31dYCk7XG4gICAgJGRpbSA9IGlucHV0UmFuayArIGRpbSArIDE7XG4gIH1cbiAgbmV3U2hhcGUuc3BsaWNlKCRkaW0sIDAsIDEpO1xuXG4gIHJldHVybiByZXNoYXBlKHtpbnB1dHM6IHt4OiBpbnB1dH0sIGJhY2tlbmQsIGF0dHJzOiB7c2hhcGU6IG5ld1NoYXBlfX0pO1xufVxuXG5leHBvcnQgY29uc3QgZXhwYW5kRGltc0NvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBFeHBhbmREaW1zLFxuICBiYWNrZW5kTmFtZTogJ3dlYmdsJyxcbiAga2VybmVsRnVuYzogZXhwYW5kRGltcyBhcyB7fSBhcyBLZXJuZWxGdW5jLFxufTtcbiJdfQ==