/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
/**
 * Returns the dimensions in the input shape that are broadcasted to
 * produce the provided output shape.
 *
 * The returned dimensions are 0-indexed and sorted. An example:
 * inShape = [4, 1, 3]
 * outShape = [5, 4, 3, 3]
 * result = [1]. Dimension 1 (2nd dimension of input) gets broadcasted 1 => 3.
 */
export function getBroadcastDims(inShape, outShape) {
    const inRank = inShape.length;
    const dims = [];
    for (let i = 0; i < inRank; i++) {
        const dim = inRank - 1 - i;
        const a = inShape[dim] || 1;
        const b = outShape[outShape.length - 1 - i] || 1;
        if (b > 1 && a === 1) {
            dims.unshift(dim);
        }
    }
    return dims;
}
/**
 * Returns the axes in the output space that should be reduced to produce
 * the input space.
 */
export function getReductionAxes(inShape, outShape) {
    const result = [];
    for (let i = 0; i < outShape.length; i++) {
        const inDim = inShape[inShape.length - i - 1];
        const outAxis = outShape.length - i - 1;
        const outDim = outShape[outAxis];
        if (inDim == null || (inDim === 1 && outDim > 1)) {
            result.unshift(outAxis);
        }
    }
    return result;
}
export function assertAndGetBroadcastShape(shapeA, shapeB) {
    const result = [];
    const l = Math.max(shapeA.length, shapeB.length);
    for (let i = 0; i < l; i++) {
        let a = shapeA[shapeA.length - i - 1];
        if (a == null) {
            a = 1;
        }
        let b = shapeB[shapeB.length - i - 1];
        if (b == null) {
            b = 1;
        }
        if (a === 1) {
            result.unshift(b);
        }
        else if (b === 1) {
            result.unshift(a);
        }
        else if (a !== b) {
            const errMsg = `Operands could not be broadcast together with shapes ` +
                `${shapeA} and ${shapeB}.`;
            throw Error(errMsg);
        }
        else {
            result.unshift(a);
        }
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvYWRjYXN0X3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9icm9hZGNhc3RfdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSDs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sVUFBVSxnQkFBZ0IsQ0FDNUIsT0FBaUIsRUFBRSxRQUFrQjtJQUN2QyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQzlCLE1BQU0sSUFBSSxHQUFhLEVBQUUsQ0FBQztJQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQy9CLE1BQU0sR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ25CO0tBQ0Y7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCLENBQzVCLE9BQWlCLEVBQUUsUUFBa0I7SUFDdkMsTUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBQzVCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3hDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM5QyxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pDLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ2hELE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDekI7S0FDRjtJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxNQUFNLFVBQVUsMEJBQTBCLENBQ3RDLE1BQWdCLEVBQUUsTUFBZ0I7SUFDcEMsTUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBQzVCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFakQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMxQixJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO1lBQ2IsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNQO1FBQ0QsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRTtZQUNiLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDUDtRQUNELElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNYLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbkI7YUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDbEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNuQjthQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNsQixNQUFNLE1BQU0sR0FBRyx1REFBdUQ7Z0JBQ2xFLEdBQUcsTUFBTSxRQUFRLE1BQU0sR0FBRyxDQUFDO1lBQy9CLE1BQU0sS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3JCO2FBQU07WUFDTCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ25CO0tBQ0Y7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGRpbWVuc2lvbnMgaW4gdGhlIGlucHV0IHNoYXBlIHRoYXQgYXJlIGJyb2FkY2FzdGVkIHRvXG4gKiBwcm9kdWNlIHRoZSBwcm92aWRlZCBvdXRwdXQgc2hhcGUuXG4gKlxuICogVGhlIHJldHVybmVkIGRpbWVuc2lvbnMgYXJlIDAtaW5kZXhlZCBhbmQgc29ydGVkLiBBbiBleGFtcGxlOlxuICogaW5TaGFwZSA9IFs0LCAxLCAzXVxuICogb3V0U2hhcGUgPSBbNSwgNCwgMywgM11cbiAqIHJlc3VsdCA9IFsxXS4gRGltZW5zaW9uIDEgKDJuZCBkaW1lbnNpb24gb2YgaW5wdXQpIGdldHMgYnJvYWRjYXN0ZWQgMSA9PiAzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0QnJvYWRjYXN0RGltcyhcbiAgICBpblNoYXBlOiBudW1iZXJbXSwgb3V0U2hhcGU6IG51bWJlcltdKTogbnVtYmVyW10ge1xuICBjb25zdCBpblJhbmsgPSBpblNoYXBlLmxlbmd0aDtcbiAgY29uc3QgZGltczogbnVtYmVyW10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpblJhbms7IGkrKykge1xuICAgIGNvbnN0IGRpbSA9IGluUmFuayAtIDEgLSBpO1xuICAgIGNvbnN0IGEgPSBpblNoYXBlW2RpbV0gfHwgMTtcbiAgICBjb25zdCBiID0gb3V0U2hhcGVbb3V0U2hhcGUubGVuZ3RoIC0gMSAtIGldIHx8IDE7XG4gICAgaWYgKGIgPiAxICYmIGEgPT09IDEpIHtcbiAgICAgIGRpbXMudW5zaGlmdChkaW0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGltcztcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBheGVzIGluIHRoZSBvdXRwdXQgc3BhY2UgdGhhdCBzaG91bGQgYmUgcmVkdWNlZCB0byBwcm9kdWNlXG4gKiB0aGUgaW5wdXQgc3BhY2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRSZWR1Y3Rpb25BeGVzKFxuICAgIGluU2hhcGU6IG51bWJlcltdLCBvdXRTaGFwZTogbnVtYmVyW10pOiBudW1iZXJbXSB7XG4gIGNvbnN0IHJlc3VsdDogbnVtYmVyW10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdXRTaGFwZS5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGluRGltID0gaW5TaGFwZVtpblNoYXBlLmxlbmd0aCAtIGkgLSAxXTtcbiAgICBjb25zdCBvdXRBeGlzID0gb3V0U2hhcGUubGVuZ3RoIC0gaSAtIDE7XG4gICAgY29uc3Qgb3V0RGltID0gb3V0U2hhcGVbb3V0QXhpc107XG4gICAgaWYgKGluRGltID09IG51bGwgfHwgKGluRGltID09PSAxICYmIG91dERpbSA+IDEpKSB7XG4gICAgICByZXN1bHQudW5zaGlmdChvdXRBeGlzKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydEFuZEdldEJyb2FkY2FzdFNoYXBlKFxuICAgIHNoYXBlQTogbnVtYmVyW10sIHNoYXBlQjogbnVtYmVyW10pOiBudW1iZXJbXSB7XG4gIGNvbnN0IHJlc3VsdDogbnVtYmVyW10gPSBbXTtcbiAgY29uc3QgbCA9IE1hdGgubWF4KHNoYXBlQS5sZW5ndGgsIHNoYXBlQi5sZW5ndGgpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgbGV0IGEgPSBzaGFwZUFbc2hhcGVBLmxlbmd0aCAtIGkgLSAxXTtcbiAgICBpZiAoYSA9PSBudWxsKSB7XG4gICAgICBhID0gMTtcbiAgICB9XG4gICAgbGV0IGIgPSBzaGFwZUJbc2hhcGVCLmxlbmd0aCAtIGkgLSAxXTtcbiAgICBpZiAoYiA9PSBudWxsKSB7XG4gICAgICBiID0gMTtcbiAgICB9XG4gICAgaWYgKGEgPT09IDEpIHtcbiAgICAgIHJlc3VsdC51bnNoaWZ0KGIpO1xuICAgIH0gZWxzZSBpZiAoYiA9PT0gMSkge1xuICAgICAgcmVzdWx0LnVuc2hpZnQoYSk7XG4gICAgfSBlbHNlIGlmIChhICE9PSBiKSB7XG4gICAgICBjb25zdCBlcnJNc2cgPSBgT3BlcmFuZHMgY291bGQgbm90IGJlIGJyb2FkY2FzdCB0b2dldGhlciB3aXRoIHNoYXBlcyBgICtcbiAgICAgICAgICBgJHtzaGFwZUF9IGFuZCAke3NoYXBlQn0uYDtcbiAgICAgIHRocm93IEVycm9yKGVyck1zZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC51bnNoaWZ0KGEpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuIl19