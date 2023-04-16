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
import { OnesLike } from '@tensorflow/tfjs-core';
import { complex } from './Complex';
import { fill } from './Fill';
import { imag } from './Imag';
import { real } from './Real';
import { zerosLike } from './ZerosLike';
export function onesLike(args) {
    const { inputs, backend } = args;
    const { x } = inputs;
    if (x.dtype === 'string') {
        throw new Error('onesLike is not supported for string tensors');
    }
    else if (x.dtype === 'complex64') {
        const realPart = real({ inputs: { input: x }, backend });
        const r = onesLike({ inputs: { x: realPart }, backend });
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
        return fill({ backend, attrs: { shape: x.shape, value: 1, dtype: x.dtype } });
    }
}
export const onesLikeConfig = {
    kernelName: OnesLike,
    backendName: 'cpu',
    kernelFunc: onesLike
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT25lc0xpa2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtY3B1L3NyYy9rZXJuZWxzL09uZXNMaWtlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBMkIsUUFBUSxFQUE2QixNQUFNLHVCQUF1QixDQUFDO0FBR3JHLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUV0QyxNQUFNLFVBQVUsUUFBUSxDQUNwQixJQUF1RDtJQUN6RCxNQUFNLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBQyxHQUFHLElBQUksQ0FBQztJQUMvQixNQUFNLEVBQUMsQ0FBQyxFQUFDLEdBQUcsTUFBTSxDQUFDO0lBRW5CLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQUU7UUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0tBQ2pFO1NBQU0sSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLFdBQVcsRUFBRTtRQUNsQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsRUFBQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztRQUNyRCxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsRUFBQyxNQUFNLEVBQUUsRUFBQyxDQUFDLEVBQUUsUUFBUSxFQUFDLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztRQUNyRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsRUFBQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztRQUNyRCxNQUFNLENBQUMsR0FBRyxTQUFTLENBQUMsRUFBQyxNQUFNLEVBQUUsRUFBQyxDQUFDLEVBQUUsUUFBUSxFQUFDLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztRQUV0RCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsRUFBQyxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBRTlELE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoRCxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsT0FBTyxDQUFDLDZCQUE2QixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV6QyxPQUFPLE1BQU0sQ0FBQztLQUNmO1NBQU07UUFDTCxPQUFPLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFDLEVBQUMsQ0FBQyxDQUFDO0tBQzNFO0FBQ0gsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBaUI7SUFDMUMsVUFBVSxFQUFFLFFBQVE7SUFDcEIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsVUFBVSxFQUFFLFFBQTRCO0NBQ3pDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7S2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jLCBPbmVzTGlrZSwgT25lc0xpa2VJbnB1dHMsIFRlbnNvckluZm99IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7TWF0aEJhY2tlbmRDUFV9IGZyb20gJy4uL2JhY2tlbmRfY3B1JztcbmltcG9ydCB7Y29tcGxleH0gZnJvbSAnLi9Db21wbGV4JztcbmltcG9ydCB7ZmlsbH0gZnJvbSAnLi9GaWxsJztcbmltcG9ydCB7aW1hZ30gZnJvbSAnLi9JbWFnJztcbmltcG9ydCB7cmVhbH0gZnJvbSAnLi9SZWFsJztcbmltcG9ydCB7emVyb3NMaWtlfSBmcm9tICcuL1plcm9zTGlrZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBvbmVzTGlrZShcbiAgICBhcmdzOiB7aW5wdXRzOiBPbmVzTGlrZUlucHV0cywgYmFja2VuZDogTWF0aEJhY2tlbmRDUFV9KTogVGVuc29ySW5mbyB7XG4gIGNvbnN0IHtpbnB1dHMsIGJhY2tlbmR9ID0gYXJncztcbiAgY29uc3Qge3h9ID0gaW5wdXRzO1xuXG4gIGlmICh4LmR0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBFcnJvcignb25lc0xpa2UgaXMgbm90IHN1cHBvcnRlZCBmb3Igc3RyaW5nIHRlbnNvcnMnKTtcbiAgfSBlbHNlIGlmICh4LmR0eXBlID09PSAnY29tcGxleDY0Jykge1xuICAgIGNvbnN0IHJlYWxQYXJ0ID0gcmVhbCh7aW5wdXRzOiB7aW5wdXQ6IHh9LCBiYWNrZW5kfSk7XG4gICAgY29uc3QgciA9IG9uZXNMaWtlKHtpbnB1dHM6IHt4OiByZWFsUGFydH0sIGJhY2tlbmR9KTtcbiAgICBjb25zdCBpbWFnUGFydCA9IGltYWcoe2lucHV0czoge2lucHV0OiB4fSwgYmFja2VuZH0pO1xuICAgIGNvbnN0IGkgPSB6ZXJvc0xpa2Uoe2lucHV0czoge3g6IGltYWdQYXJ0fSwgYmFja2VuZH0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gY29tcGxleCh7aW5wdXRzOiB7cmVhbDogciwgaW1hZzogaX0sIGJhY2tlbmR9KTtcblxuICAgIGJhY2tlbmQuZGlzcG9zZUludGVybWVkaWF0ZVRlbnNvckluZm8ocmVhbFBhcnQpO1xuICAgIGJhY2tlbmQuZGlzcG9zZUludGVybWVkaWF0ZVRlbnNvckluZm8ocik7XG4gICAgYmFja2VuZC5kaXNwb3NlSW50ZXJtZWRpYXRlVGVuc29ySW5mbyhpbWFnUGFydCk7XG4gICAgYmFja2VuZC5kaXNwb3NlSW50ZXJtZWRpYXRlVGVuc29ySW5mbyhpKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZpbGwoe2JhY2tlbmQsIGF0dHJzOiB7c2hhcGU6IHguc2hhcGUsIHZhbHVlOiAxLCBkdHlwZTogeC5kdHlwZX19KTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgb25lc0xpa2VDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogT25lc0xpa2UsXG4gIGJhY2tlbmROYW1lOiAnY3B1JyxcbiAga2VybmVsRnVuYzogb25lc0xpa2UgYXMge30gYXMgS2VybmVsRnVuY1xufTtcbiJdfQ==