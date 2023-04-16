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
        throw new Error('onesLike is not supported under string dtype');
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
        // TODO(cais, smilkov): Add WebGL shader for onesLike:
        //   https://github.com/tensorflow/tfjs/issues/1293
        return fill({ attrs: { shape: x.shape, dtype: x.dtype, value: 1 }, backend });
    }
}
export const onesLikeConfig = {
    kernelName: OnesLike,
    backendName: 'webgl',
    kernelFunc: onesLike
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT25lc0xpa2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2tlcm5lbHMvT25lc0xpa2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUEyQixRQUFRLEVBQTZCLE1BQU0sdUJBQXVCLENBQUM7QUFJckcsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNsQyxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRXRDLE1BQU0sVUFBVSxRQUFRLENBQ3BCLElBQXlEO0lBQzNELE1BQU0sRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFDLEdBQUcsSUFBSSxDQUFDO0lBQy9CLE1BQU0sRUFBQyxDQUFDLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFFbkIsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLFFBQVEsRUFBRTtRQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7S0FDakU7U0FBTSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssV0FBVyxFQUFFO1FBQ2xDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxFQUFDLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxFQUFDLE1BQU0sRUFBRSxFQUFDLENBQUMsRUFBRSxRQUFRLEVBQUMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxFQUFDLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxHQUFHLFNBQVMsQ0FBQyxFQUFDLE1BQU0sRUFBRSxFQUFDLENBQUMsRUFBRSxRQUFRLEVBQUMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBRXRELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxFQUFDLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBQyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7UUFFOUQsT0FBTyxDQUFDLDZCQUE2QixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxPQUFPLENBQUMsNkJBQTZCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXpDLE9BQU8sTUFBTSxDQUFDO0tBQ2Y7U0FBTTtRQUNMLHNEQUFzRDtRQUN0RCxtREFBbUQ7UUFDbkQsT0FBTyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFDLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztLQUMzRTtBQUNILENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQWlCO0lBQzFDLFVBQVUsRUFBRSxRQUFRO0lBQ3BCLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLFVBQVUsRUFBRSxRQUE0QjtDQUN6QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0tlcm5lbENvbmZpZywgS2VybmVsRnVuYywgT25lc0xpa2UsIE9uZXNMaWtlSW5wdXRzLCBUZW5zb3JJbmZvfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge01hdGhCYWNrZW5kV2ViR0x9IGZyb20gJy4uL2JhY2tlbmRfd2ViZ2wnO1xuXG5pbXBvcnQge2NvbXBsZXh9IGZyb20gJy4vQ29tcGxleCc7XG5pbXBvcnQge2ZpbGx9IGZyb20gJy4vRmlsbCc7XG5pbXBvcnQge2ltYWd9IGZyb20gJy4vSW1hZyc7XG5pbXBvcnQge3JlYWx9IGZyb20gJy4vUmVhbCc7XG5pbXBvcnQge3plcm9zTGlrZX0gZnJvbSAnLi9aZXJvc0xpa2UnO1xuXG5leHBvcnQgZnVuY3Rpb24gb25lc0xpa2UoXG4gICAgYXJnczoge2lucHV0czogT25lc0xpa2VJbnB1dHMsIGJhY2tlbmQ6IE1hdGhCYWNrZW5kV2ViR0x9KTogVGVuc29ySW5mbyB7XG4gIGNvbnN0IHtpbnB1dHMsIGJhY2tlbmR9ID0gYXJncztcbiAgY29uc3Qge3h9ID0gaW5wdXRzO1xuXG4gIGlmICh4LmR0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBFcnJvcignb25lc0xpa2UgaXMgbm90IHN1cHBvcnRlZCB1bmRlciBzdHJpbmcgZHR5cGUnKTtcbiAgfSBlbHNlIGlmICh4LmR0eXBlID09PSAnY29tcGxleDY0Jykge1xuICAgIGNvbnN0IHJlYWxQYXJ0ID0gcmVhbCh7aW5wdXRzOiB7aW5wdXQ6IHh9LCBiYWNrZW5kfSk7XG4gICAgY29uc3QgciA9IG9uZXNMaWtlKHtpbnB1dHM6IHt4OiByZWFsUGFydH0sIGJhY2tlbmR9KTtcbiAgICBjb25zdCBpbWFnUGFydCA9IGltYWcoe2lucHV0czoge2lucHV0OiB4fSwgYmFja2VuZH0pO1xuICAgIGNvbnN0IGkgPSB6ZXJvc0xpa2Uoe2lucHV0czoge3g6IGltYWdQYXJ0fSwgYmFja2VuZH0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gY29tcGxleCh7aW5wdXRzOiB7cmVhbDogciwgaW1hZzogaX0sIGJhY2tlbmR9KTtcblxuICAgIGJhY2tlbmQuZGlzcG9zZUludGVybWVkaWF0ZVRlbnNvckluZm8ocmVhbFBhcnQpO1xuICAgIGJhY2tlbmQuZGlzcG9zZUludGVybWVkaWF0ZVRlbnNvckluZm8ocik7XG4gICAgYmFja2VuZC5kaXNwb3NlSW50ZXJtZWRpYXRlVGVuc29ySW5mbyhpbWFnUGFydCk7XG4gICAgYmFja2VuZC5kaXNwb3NlSW50ZXJtZWRpYXRlVGVuc29ySW5mbyhpKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSB7XG4gICAgLy8gVE9ETyhjYWlzLCBzbWlsa292KTogQWRkIFdlYkdMIHNoYWRlciBmb3Igb25lc0xpa2U6XG4gICAgLy8gICBodHRwczovL2dpdGh1Yi5jb20vdGVuc29yZmxvdy90ZmpzL2lzc3Vlcy8xMjkzXG4gICAgcmV0dXJuIGZpbGwoe2F0dHJzOiB7c2hhcGU6IHguc2hhcGUsIGR0eXBlOiB4LmR0eXBlLCB2YWx1ZTogMX0sIGJhY2tlbmR9KTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgb25lc0xpa2VDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogT25lc0xpa2UsXG4gIGJhY2tlbmROYW1lOiAnd2ViZ2wnLFxuICBrZXJuZWxGdW5jOiBvbmVzTGlrZSBhcyB7fSBhcyBLZXJuZWxGdW5jXG59O1xuIl19