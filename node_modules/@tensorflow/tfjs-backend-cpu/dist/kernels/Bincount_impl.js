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
import { buffer, util } from '@tensorflow/tfjs-core';
export function bincountImpl(xVals, weightsVals, weightsDtype, weightsShape, size) {
    const weightsSize = util.sizeFromShape(weightsShape);
    const outVals = util.makeZerosTypedArray(size, weightsDtype);
    for (let i = 0; i < xVals.length; i++) {
        const value = xVals[i];
        if (value < 0) {
            throw new Error('Input x must be non-negative!');
        }
        if (value >= size) {
            continue;
        }
        if (weightsSize > 0) {
            outVals[value] += weightsVals[i];
        }
        else {
            outVals[value] += 1;
        }
    }
    return outVals;
}
export function bincountReduceImpl(xBuf, weightsBuf, size, binaryOutput = false) {
    const numRows = xBuf.shape[0];
    const numCols = xBuf.shape[1];
    const outBuf = buffer([numRows, size], weightsBuf.dtype);
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const value = xBuf.get(i, j);
            if (value < 0) {
                throw new Error('Input x must be non-negative!');
            }
            if (value >= size) {
                continue;
            }
            if (binaryOutput) {
                outBuf.set(1, i, value);
            }
            else {
                if (weightsBuf.size > 0) {
                    outBuf.set(outBuf.get(i, value) + weightsBuf.get(i, j), i, value);
                }
                else {
                    outBuf.set(outBuf.get(i, value) + 1, i, value);
                }
            }
        }
    }
    return outBuf;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmluY291bnRfaW1wbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC1jcHUvc3JjL2tlcm5lbHMvQmluY291bnRfaW1wbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUE0QyxJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUU3RixNQUFNLFVBQVUsWUFBWSxDQUN4QixLQUFpQixFQUFFLFdBQXVCLEVBQUUsWUFBc0IsRUFDbEUsWUFBc0IsRUFBRSxJQUFZO0lBQ3RDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDckQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxZQUFZLENBQWUsQ0FBQztJQUUzRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNyQyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1NBQ2xEO1FBRUQsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO1lBQ2pCLFNBQVM7U0FDVjtRQUVELElBQUksV0FBVyxHQUFHLENBQUMsRUFBRTtZQUNuQixPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xDO2FBQU07WUFDTCxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3JCO0tBQ0Y7SUFFRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBRUQsTUFBTSxVQUFVLGtCQUFrQixDQUM5QixJQUFxQixFQUFFLFVBQTJCLEVBQUUsSUFBWSxFQUNoRSxZQUFZLEdBQUcsS0FBSztJQUN0QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFOUIsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUV6RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDaEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO2dCQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQzthQUNsRDtZQUVELElBQUksS0FBSyxJQUFJLElBQUksRUFBRTtnQkFDakIsU0FBUzthQUNWO1lBRUQsSUFBSSxZQUFZLEVBQUU7Z0JBQ2hCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUN6QjtpQkFBTTtnQkFDTCxJQUFJLFVBQVUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFO29CQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDbkU7cUJBQU07b0JBQ0wsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUNoRDthQUNGO1NBQ0Y7S0FDRjtJQUVELE9BQU8sTUFBeUIsQ0FBQztBQUNuQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2J1ZmZlciwgRGF0YVR5cGUsIFJhbmssIFRlbnNvckJ1ZmZlciwgVHlwZWRBcnJheSwgdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmNvdW50SW1wbChcbiAgICB4VmFsczogVHlwZWRBcnJheSwgd2VpZ2h0c1ZhbHM6IFR5cGVkQXJyYXksIHdlaWdodHNEdHlwZTogRGF0YVR5cGUsXG4gICAgd2VpZ2h0c1NoYXBlOiBudW1iZXJbXSwgc2l6ZTogbnVtYmVyKTogVHlwZWRBcnJheSB7XG4gIGNvbnN0IHdlaWdodHNTaXplID0gdXRpbC5zaXplRnJvbVNoYXBlKHdlaWdodHNTaGFwZSk7XG4gIGNvbnN0IG91dFZhbHMgPSB1dGlsLm1ha2VaZXJvc1R5cGVkQXJyYXkoc2l6ZSwgd2VpZ2h0c0R0eXBlKSBhcyBUeXBlZEFycmF5O1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgeFZhbHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCB2YWx1ZSA9IHhWYWxzW2ldO1xuICAgIGlmICh2YWx1ZSA8IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW5wdXQgeCBtdXN0IGJlIG5vbi1uZWdhdGl2ZSEnKTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgPj0gc2l6ZSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHdlaWdodHNTaXplID4gMCkge1xuICAgICAgb3V0VmFsc1t2YWx1ZV0gKz0gd2VpZ2h0c1ZhbHNbaV07XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dFZhbHNbdmFsdWVdICs9IDE7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG91dFZhbHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5jb3VudFJlZHVjZUltcGw8UiBleHRlbmRzIFJhbms+KFxuICAgIHhCdWY6IFRlbnNvckJ1ZmZlcjxSPiwgd2VpZ2h0c0J1ZjogVGVuc29yQnVmZmVyPFI+LCBzaXplOiBudW1iZXIsXG4gICAgYmluYXJ5T3V0cHV0ID0gZmFsc2UpOiBUZW5zb3JCdWZmZXI8Uj4ge1xuICBjb25zdCBudW1Sb3dzID0geEJ1Zi5zaGFwZVswXTtcbiAgY29uc3QgbnVtQ29scyA9IHhCdWYuc2hhcGVbMV07XG5cbiAgY29uc3Qgb3V0QnVmID0gYnVmZmVyKFtudW1Sb3dzLCBzaXplXSwgd2VpZ2h0c0J1Zi5kdHlwZSk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1Sb3dzOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG51bUNvbHM7IGorKykge1xuICAgICAgY29uc3QgdmFsdWUgPSB4QnVmLmdldChpLCBqKTtcbiAgICAgIGlmICh2YWx1ZSA8IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnB1dCB4IG11c3QgYmUgbm9uLW5lZ2F0aXZlIScpO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWUgPj0gc2l6ZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGJpbmFyeU91dHB1dCkge1xuICAgICAgICBvdXRCdWYuc2V0KDEsIGksIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh3ZWlnaHRzQnVmLnNpemUgPiAwKSB7XG4gICAgICAgICAgb3V0QnVmLnNldChvdXRCdWYuZ2V0KGksIHZhbHVlKSArIHdlaWdodHNCdWYuZ2V0KGksIGopLCBpLCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0QnVmLnNldChvdXRCdWYuZ2V0KGksIHZhbHVlKSArIDEsIGksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvdXRCdWYgYXMgVGVuc29yQnVmZmVyPFI+O1xufVxuIl19