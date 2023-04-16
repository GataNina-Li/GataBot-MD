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
import { backend_util } from '@tensorflow/tfjs-core';
import { SplitV, util } from '@tensorflow/tfjs-core';
import { slice } from './Slice';
export function splitV(args) {
    const { inputs, backend, attrs } = args;
    const { x } = inputs;
    const { numOrSizeSplits, axis } = attrs;
    const $axis = util.parseAxisParam(axis, x.shape)[0];
    const splitSizes = backend_util.prepareSplitSize(x, numOrSizeSplits, $axis);
    const begin = new Array(x.shape.length).fill(0);
    const size = x.shape.slice();
    return splitSizes.map(s => {
        const sliceSize = [...size];
        sliceSize[$axis] = s;
        const sliceT = slice({ inputs: { x }, backend, attrs: { begin, size: sliceSize } });
        begin[$axis] += s;
        return sliceT;
    });
}
export const splitVConfig = {
    kernelName: SplitV,
    backendName: 'cpu',
    kernelFunc: splitV
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3BsaXRWLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLWNwdS9zcmMva2VybmVscy9TcGxpdFYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBNEIsTUFBTSx1QkFBdUIsQ0FBQztBQUM5RSxPQUFPLEVBQTJCLE1BQU0sRUFBYyxJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUd6RixPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBRTlCLE1BQU0sVUFBVSxNQUFNLENBQ2xCLElBQXlFO0lBRTNFLE1BQU0sRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQyxHQUFHLElBQUksQ0FBQztJQUN0QyxNQUFNLEVBQUMsQ0FBQyxFQUFDLEdBQUcsTUFBTSxDQUFDO0lBQ25CLE1BQU0sRUFBQyxlQUFlLEVBQUUsSUFBSSxFQUFDLEdBQUcsS0FBSyxDQUFDO0lBRXRDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRCxNQUFNLFVBQVUsR0FBRyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUU1RSxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRCxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzdCLE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUN4QixNQUFNLFNBQVMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDNUIsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQixNQUFNLE1BQU0sR0FDUixLQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsRUFBQyxDQUFDLEVBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsRUFBQyxDQUFDLENBQUM7UUFDbkUsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQWlCO0lBQ3hDLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLFVBQVUsRUFBRSxNQUEwQjtDQUN2QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2JhY2tlbmRfdXRpbCwgU3BsaXRWQXR0cnMsIFNwbGl0VklucHV0c30gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbmltcG9ydCB7S2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jLCBTcGxpdFYsIFRlbnNvckluZm8sIHV0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7TWF0aEJhY2tlbmRDUFV9IGZyb20gJy4uL2JhY2tlbmRfY3B1JztcbmltcG9ydCB7c2xpY2V9IGZyb20gJy4vU2xpY2UnO1xuXG5leHBvcnQgZnVuY3Rpb24gc3BsaXRWKFxuICAgIGFyZ3M6IHtpbnB1dHM6IFNwbGl0VklucHV0cywgYmFja2VuZDogTWF0aEJhY2tlbmRDUFUsIGF0dHJzOiBTcGxpdFZBdHRyc30pOlxuICAgIFRlbnNvckluZm9bXSB7XG4gIGNvbnN0IHtpbnB1dHMsIGJhY2tlbmQsIGF0dHJzfSA9IGFyZ3M7XG4gIGNvbnN0IHt4fSA9IGlucHV0cztcbiAgY29uc3Qge251bU9yU2l6ZVNwbGl0cywgYXhpc30gPSBhdHRycztcblxuICBjb25zdCAkYXhpcyA9IHV0aWwucGFyc2VBeGlzUGFyYW0oYXhpcywgeC5zaGFwZSlbMF07XG4gIGNvbnN0IHNwbGl0U2l6ZXMgPSBiYWNrZW5kX3V0aWwucHJlcGFyZVNwbGl0U2l6ZSh4LCBudW1PclNpemVTcGxpdHMsICRheGlzKTtcblxuICBjb25zdCBiZWdpbiA9IG5ldyBBcnJheSh4LnNoYXBlLmxlbmd0aCkuZmlsbCgwKTtcbiAgY29uc3Qgc2l6ZSA9IHguc2hhcGUuc2xpY2UoKTtcbiAgcmV0dXJuIHNwbGl0U2l6ZXMubWFwKHMgPT4ge1xuICAgIGNvbnN0IHNsaWNlU2l6ZSA9IFsuLi5zaXplXTtcbiAgICBzbGljZVNpemVbJGF4aXNdID0gcztcbiAgICBjb25zdCBzbGljZVQgPVxuICAgICAgICBzbGljZSh7aW5wdXRzOiB7eH0sIGJhY2tlbmQsIGF0dHJzOiB7YmVnaW4sIHNpemU6IHNsaWNlU2l6ZX19KTtcbiAgICBiZWdpblskYXhpc10gKz0gcztcbiAgICByZXR1cm4gc2xpY2VUO1xuICB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IHNwbGl0VkNvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBTcGxpdFYsXG4gIGJhY2tlbmROYW1lOiAnY3B1JyxcbiAga2VybmVsRnVuYzogc3BsaXRWIGFzIHt9IGFzIEtlcm5lbEZ1bmNcbn07XG4iXX0=