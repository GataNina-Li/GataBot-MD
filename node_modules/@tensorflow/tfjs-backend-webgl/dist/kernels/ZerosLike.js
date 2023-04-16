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
import { ZerosLike } from '@tensorflow/tfjs-core';
import { complex } from './Complex';
import { fill } from './Fill';
import { imag } from './Imag';
import { real } from './Real';
export function zerosLike(args) {
    const { inputs, backend } = args;
    const { x } = inputs;
    if (x.dtype === 'complex64') {
        const realPart = real({ inputs: { input: x }, backend });
        const r = zerosLike({ inputs: { x: realPart }, backend });
        const imagPart = imag({ inputs: { input: x }, backend });
        const i = zerosLike({ inputs: { x: imagPart }, backend });
        const result = complex({ inputs: { real: r, imag: i }, backend });
        backend.disposeIntermediateTensorInfo(realPart);
        backend.disposeIntermediateTensorInfo(r);
        backend.disposeIntermediateTensorInfo(imagPart);
        backend.disposeIntermediateTensorInfo(i);
        return result;
    }
    else {
        return fill({
            attrs: {
                shape: x.shape,
                dtype: x.dtype,
                value: x.dtype === 'string' ? '' : 0
            },
            backend
        });
    }
}
export const zerosLikeConfig = {
    kernelName: ZerosLike,
    backendName: 'webgl',
    kernelFunc: zerosLike
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWmVyb3NMaWtlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9rZXJuZWxzL1plcm9zTGlrZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQXVDLFNBQVMsRUFBa0IsTUFBTSx1QkFBdUIsQ0FBQztBQUl2RyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBRTVCLE1BQU0sVUFBVSxTQUFTLENBQ3JCLElBQTBEO0lBQzVELE1BQU0sRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFDLEdBQUcsSUFBSSxDQUFDO0lBQy9CLE1BQU0sRUFBQyxDQUFDLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFFbkIsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLFdBQVcsRUFBRTtRQUMzQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsRUFBQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztRQUNyRCxNQUFNLENBQUMsR0FBRyxTQUFTLENBQUMsRUFBQyxNQUFNLEVBQUUsRUFBQyxDQUFDLEVBQUUsUUFBUSxFQUFDLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztRQUN0RCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsRUFBQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztRQUNyRCxNQUFNLENBQUMsR0FBRyxTQUFTLENBQUMsRUFBQyxNQUFNLEVBQUUsRUFBQyxDQUFDLEVBQUUsUUFBUSxFQUFDLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztRQUV0RCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsRUFBQyxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBRTlELE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoRCxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsT0FBTyxDQUFDLDZCQUE2QixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV6QyxPQUFPLE1BQU0sQ0FBQztLQUNmO1NBQU07UUFDTCxPQUFPLElBQUksQ0FBQztZQUNWLEtBQUssRUFBRTtnQkFDTCxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUs7Z0JBQ2QsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLO2dCQUNkLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3JDO1lBQ0QsT0FBTztTQUNSLENBQUMsQ0FBQztLQUNKO0FBQ0gsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBaUI7SUFDM0MsVUFBVSxFQUFFLFNBQVM7SUFDckIsV0FBVyxFQUFFLE9BQU87SUFDcEIsVUFBVSxFQUFFLFNBQTZCO0NBQzFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7S2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jLCBUZW5zb3JJbmZvLCBaZXJvc0xpa2UsIFplcm9zTGlrZUlucHV0c30gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtNYXRoQmFja2VuZFdlYkdMfSBmcm9tICcuLi9iYWNrZW5kX3dlYmdsJztcblxuaW1wb3J0IHtjb21wbGV4fSBmcm9tICcuL0NvbXBsZXgnO1xuaW1wb3J0IHtmaWxsfSBmcm9tICcuL0ZpbGwnO1xuaW1wb3J0IHtpbWFnfSBmcm9tICcuL0ltYWcnO1xuaW1wb3J0IHtyZWFsfSBmcm9tICcuL1JlYWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gemVyb3NMaWtlKFxuICAgIGFyZ3M6IHtpbnB1dHM6IFplcm9zTGlrZUlucHV0cywgYmFja2VuZDogTWF0aEJhY2tlbmRXZWJHTH0pOiBUZW5zb3JJbmZvIHtcbiAgY29uc3Qge2lucHV0cywgYmFja2VuZH0gPSBhcmdzO1xuICBjb25zdCB7eH0gPSBpbnB1dHM7XG5cbiAgaWYgKHguZHR5cGUgPT09ICdjb21wbGV4NjQnKSB7XG4gICAgY29uc3QgcmVhbFBhcnQgPSByZWFsKHtpbnB1dHM6IHtpbnB1dDogeH0sIGJhY2tlbmR9KTtcbiAgICBjb25zdCByID0gemVyb3NMaWtlKHtpbnB1dHM6IHt4OiByZWFsUGFydH0sIGJhY2tlbmR9KTtcbiAgICBjb25zdCBpbWFnUGFydCA9IGltYWcoe2lucHV0czoge2lucHV0OiB4fSwgYmFja2VuZH0pO1xuICAgIGNvbnN0IGkgPSB6ZXJvc0xpa2Uoe2lucHV0czoge3g6IGltYWdQYXJ0fSwgYmFja2VuZH0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gY29tcGxleCh7aW5wdXRzOiB7cmVhbDogciwgaW1hZzogaX0sIGJhY2tlbmR9KTtcblxuICAgIGJhY2tlbmQuZGlzcG9zZUludGVybWVkaWF0ZVRlbnNvckluZm8ocmVhbFBhcnQpO1xuICAgIGJhY2tlbmQuZGlzcG9zZUludGVybWVkaWF0ZVRlbnNvckluZm8ocik7XG4gICAgYmFja2VuZC5kaXNwb3NlSW50ZXJtZWRpYXRlVGVuc29ySW5mbyhpbWFnUGFydCk7XG4gICAgYmFja2VuZC5kaXNwb3NlSW50ZXJtZWRpYXRlVGVuc29ySW5mbyhpKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZpbGwoe1xuICAgICAgYXR0cnM6IHtcbiAgICAgICAgc2hhcGU6IHguc2hhcGUsXG4gICAgICAgIGR0eXBlOiB4LmR0eXBlLFxuICAgICAgICB2YWx1ZTogeC5kdHlwZSA9PT0gJ3N0cmluZycgPyAnJyA6IDBcbiAgICAgIH0sXG4gICAgICBiYWNrZW5kXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHplcm9zTGlrZUNvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBaZXJvc0xpa2UsXG4gIGJhY2tlbmROYW1lOiAnd2ViZ2wnLFxuICBrZXJuZWxGdW5jOiB6ZXJvc0xpa2UgYXMge30gYXMgS2VybmVsRnVuY1xufTtcbiJdfQ==