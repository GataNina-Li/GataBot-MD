/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
import { backend_util, util } from '@tensorflow/tfjs-core';
export function sparseSegmentReductionImpl(input, inputShape, inputDType, indices, segmentIds, isMean = false, defaultValue = 0) {
    const numIndices = indices.length;
    // Flatten the array to two dimensions
    const inputFlat = [inputShape[0], input.length / inputShape[0]];
    const numCol = inputFlat[1];
    // Note that the current implementation assumes that segmentIds values are
    // sorted.
    const lastSegmentIdPlusOne = numIndices > 0 ? segmentIds[numIndices - 1] + 1 : 0;
    const outputRows = lastSegmentIdPlusOne;
    if (outputRows < 0) {
        throw new Error(backend_util.getSparseSegmentReductionNegativeSegmentIdsErrorMessage());
    }
    const outputShape = inputShape.slice();
    outputShape[0] = outputRows;
    const outputLength = outputShape.reduce((product, value) => product * value, 1);
    // Output array is initialized with the value 0 by default.
    const output = util.getArrayFromDType(inputDType, outputLength);
    // Note that we do not initialize the output buffer with a default value, so
    // we need to explicitly set missing indices to the default value.
    if (numIndices === 0) {
        if (outputRows > 0) {
            output.fill(defaultValue);
        }
        return [output, outputShape];
    }
    if (outputRows <= 0) {
        throw new Error(backend_util.getSparseSegmentReductionNegativeSegmentIdsErrorMessage());
    }
    let start = 0, end = 1;
    // Index from which the output is not initialized.
    let uninitializedIndex = 0;
    let outIndex = segmentIds[start];
    while (true) {
        // We initialize nextIndex to 0 to avoid may be uninitialized warning
        let nextIndex = 0;
        if (end < numIndices) {
            nextIndex = segmentIds[end];
            if (outIndex === nextIndex) {
                ++end;
                continue;
            }
            // We have a new segment here.  Verify that the segment ids are growing.
            if (outIndex >= nextIndex) {
                throw new Error(backend_util
                    .getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage());
            }
        }
        if (outIndex < 0 || outIndex >= outputRows) {
            throw new Error(backend_util.getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage(outIndex, outputRows));
        }
        // If there is a gap between two indices, we need to set that gap to the
        // default value.
        if (outIndex > uninitializedIndex) {
            output.fill(defaultValue, uninitializedIndex * numCol, outIndex * numCol);
        }
        for (let i = start; i < end; ++i) {
            const index = indices[i];
            if (index < 0 || index >= inputFlat[0]) {
                throw new Error(backend_util.getSparseSegmentReductionIndicesOutOfRangeErrorMessage(i, indices[i], inputFlat[0]));
            }
            for (let j = 0; j < numCol; j++) {
                output[outIndex * numCol + j] += input[index * numCol + j];
            }
        }
        if (isMean) {
            for (let j = 0; j < numCol; j++) {
                output[outIndex * numCol + j] /= end - start;
            }
        }
        start = end;
        ++end;
        uninitializedIndex = outIndex + 1;
        outIndex = nextIndex;
        if (end > numIndices) {
            break;
        }
    }
    // Fill the gap at the end with the default value.
    if (uninitializedIndex < outputRows) {
        output.fill(defaultValue, uninitializedIndex * numCol, outputRows * numCol);
    }
    return [output, outputShape];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3BhcnNlU2VnbWVudFJlZHVjdGlvbl9pbXBsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLWNwdS9zcmMva2VybmVscy9TcGFyc2VTZWdtZW50UmVkdWN0aW9uX2ltcGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBd0IsSUFBSSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFL0UsTUFBTSxVQUFVLDBCQUEwQixDQUN0QyxLQUFpQixFQUFFLFVBQW9CLEVBQUUsVUFBb0IsRUFDN0QsT0FBbUIsRUFBRSxVQUFzQixFQUFFLE1BQU0sR0FBRyxLQUFLLEVBQzNELFlBQVksR0FBRyxDQUFDO0lBQ2xCLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFFbEMsc0NBQXNDO0lBQ3RDLE1BQU0sU0FBUyxHQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLDBFQUEwRTtJQUMxRSxVQUFVO0lBQ1YsTUFBTSxvQkFBb0IsR0FDdEIsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RCxNQUFNLFVBQVUsR0FBRyxvQkFBb0IsQ0FBQztJQUV4QyxJQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUU7UUFDbEIsTUFBTSxJQUFJLEtBQUssQ0FDWCxZQUFZLENBQUMsdURBQXVELEVBQUUsQ0FBQyxDQUFDO0tBQzdFO0lBRUQsTUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO0lB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LE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDL0IsTUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQzthQUM5QztTQUNGO1FBRUQsS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUNaLEVBQUUsR0FBRyxDQUFDO1FBQ04sa0JBQWtCLEdBQUcsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNsQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1FBQ3JCLElBQUksR0FBRyxHQUFHLFVBQVUsRUFBRTtZQUNwQixNQUFNO1NBQ1A7S0FDRjtJQUVELGtEQUFrRDtJQUNsRCxJQUFJLGtCQUFrQixHQUFHLFVBQVUsRUFBRTtRQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxrQkFBa0IsR0FBRyxNQUFNLEVBQUUsVUFBVSxHQUFHLE1BQU0sQ0FBQyxDQUFDO0tBQzdFO0lBRUQsT0FBTyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztBQUMvQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2JhY2tlbmRfdXRpbCwgRGF0YVR5cGUsIFR5cGVkQXJyYXksIHV0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGFyc2VTZWdtZW50UmVkdWN0aW9uSW1wbChcbiAgICBpbnB1dDogVHlwZWRBcnJheSwgaW5wdXRTaGFwZTogbnVtYmVyW10sIGlucHV0RFR5cGU6IERhdGFUeXBlLFxuICAgIGluZGljZXM6IFR5cGVkQXJyYXksIHNlZ21lbnRJZHM6IFR5cGVkQXJyYXksIGlzTWVhbiA9IGZhbHNlLFxuICAgIGRlZmF1bHRWYWx1ZSA9IDApOiBbVHlwZWRBcnJheSwgbnVtYmVyW11dIHtcbiAgY29uc3QgbnVtSW5kaWNlcyA9IGluZGljZXMubGVuZ3RoO1xuXG4gIC8vIEZsYXR0ZW4gdGhlIGFycmF5IHRvIHR3byBkaW1lbnNpb25zXG4gIGNvbnN0IGlucHV0RmxhdDogbnVtYmVyW10gPSBbaW5wdXRTaGFwZVswXSwgaW5wdXQubGVuZ3RoIC8gaW5wdXRTaGFwZVswXV07XG4gIGNvbnN0IG51bUNvbCA9IGlucHV0RmxhdFsxXTtcbiAgLy8gTm90ZSB0aGF0IHRoZSBjdXJyZW50IGltcGxlbWVudGF0aW9uIGFzc3VtZXMgdGhhdCBzZWdtZW50SWRzIHZhbHVlcyBhcmVcbiAgLy8gc29ydGVkLlxuICBjb25zdCBsYXN0U2VnbWVudElkUGx1c09uZSA9XG4gICAgICBudW1JbmRpY2VzID4gMCA/IHNlZ21lbnRJZHNbbnVtSW5kaWNlcyAtIDFdICsgMSA6IDA7XG4gIGNvbnN0IG91dHB1dFJvd3MgPSBsYXN0U2VnbWVudElkUGx1c09uZTtcblxuICBpZiAob3V0cHV0Um93cyA8IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGJhY2tlbmRfdXRpbC5nZXRTcGFyc2VTZWdtZW50UmVkdWN0aW9uTmVnYXRpdmVTZWdtZW50SWRzRXJyb3JNZXNzYWdlKCkpO1xuICB9XG5cbiAgY29uc3Qgb3V0cHV0U2hhcGUgPSBpbnB1dFNoYXBlLnNsaWNlKCk7XG4gIG91dHB1dFNoYXBlWzBdID0gb3V0cHV0Um93cztcblxuICBjb25zdCBvdXRwdXRMZW5ndGggPVxuICAgICAgb3V0cHV0U2hhcGUucmVkdWNlKChwcm9kdWN0LCB2YWx1ZSkgPT4gcHJvZHVjdCAqIHZhbHVlLCAxKTtcbiAgLy8gT3V0cHV0IGFycmF5IGlzIGluaXRpYWxpemVkIHdpdGggdGhlIHZhbHVlIDAgYnkgZGVmYXVsdC5cbiAgY29uc3Qgb3V0cHV0ID0gdXRpbC5nZXRBcnJheUZyb21EVHlwZShpbnB1dERUeXBlLCBvdXRwdXRMZW5ndGgpIGFzIFR5cGVkQXJyYXk7XG5cbiAgLy8gTm90ZSB0aGF0IHdlIGRvIG5vdCBpbml0aWFsaXplIHRoZSBvdXRwdXQgYnVmZmVyIHdpdGggYSBkZWZhdWx0IHZhbHVlLCBzb1xuICAvLyB3ZSBuZWVkIHRvIGV4cGxpY2l0bHkgc2V0IG1pc3NpbmcgaW5kaWNlcyB0byB0aGUgZGVmYXVsdCB2YWx1ZS5cbiAgaWYgKG51bUluZGljZXMgPT09IDApIHtcbiAgICBpZiAob3V0cHV0Um93cyA+IDApIHtcbiAgICAgIG91dHB1dC5maWxsKGRlZmF1bHRWYWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBbb3V0cHV0LCBvdXRwdXRTaGFwZV07XG4gIH1cblxuICBpZiAob3V0cHV0Um93cyA8PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBiYWNrZW5kX3V0aWwuZ2V0U3BhcnNlU2VnbWVudFJlZHVjdGlvbk5lZ2F0aXZlU2VnbWVudElkc0Vycm9yTWVzc2FnZSgpKTtcbiAgfVxuXG4gIGxldCBzdGFydCA9IDAsIGVuZCA9IDE7XG4gIC8vIEluZGV4IGZyb20gd2hpY2ggdGhlIG91dHB1dCBpcyBub3QgaW5pdGlhbGl6ZWQuXG4gIGxldCB1bmluaXRpYWxpemVkSW5kZXggPSAwO1xuICBsZXQgb3V0SW5kZXggPSBzZWdtZW50SWRzW3N0YXJ0XTtcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIC8vIFdlIGluaXRpYWxpemUgbmV4dEluZGV4IHRvIDAgdG8gYXZvaWQgbWF5IGJlIHVuaW5pdGlhbGl6ZWQgd2FybmluZ1xuICAgIGxldCBuZXh0SW5kZXggPSAwO1xuICAgIGlmIChlbmQgPCBudW1JbmRpY2VzKSB7XG4gICAgICBuZXh0SW5kZXggPSBzZWdtZW50SWRzW2VuZF07XG4gICAgICBpZiAob3V0SW5kZXggPT09IG5leHRJbmRleCkge1xuICAgICAgICArK2VuZDtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyBXZSBoYXZlIGEgbmV3IHNlZ21lbnQgaGVyZS4gIFZlcmlmeSB0aGF0IHRoZSBzZWdtZW50IGlkcyBhcmUgZ3Jvd2luZy5cbiAgICAgIGlmIChvdXRJbmRleCA+PSBuZXh0SW5kZXgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGJhY2tlbmRfdXRpbFxuICAgICAgICAgICAgLmdldFNwYXJzZVNlZ21lbnRSZWR1Y3Rpb25Ob25JbmNyZWFzaW5nU2VnbWVudElkc0Vycm9yTWVzc2FnZSgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3V0SW5kZXggPCAwIHx8IG91dEluZGV4ID49IG91dHB1dFJvd3MpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBiYWNrZW5kX3V0aWwuZ2V0U3BhcnNlU2VnbWVudFJlZHVjdGlvblNlZ21lbnRJZE91dE9mUmFuZ2VFcnJvck1lc3NhZ2UoXG4gICAgICAgICAgICAgIG91dEluZGV4LCBvdXRwdXRSb3dzKSk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUgaXMgYSBnYXAgYmV0d2VlbiB0d28gaW5kaWNlcywgd2UgbmVlZCB0byBzZXQgdGhhdCBnYXAgdG8gdGhlXG4gICAgLy8gZGVmYXVsdCB2YWx1ZS5cbiAgICBpZiAob3V0SW5kZXggPiB1bmluaXRpYWxpemVkSW5kZXgpIHtcbiAgICAgIG91dHB1dC5maWxsKGRlZmF1bHRWYWx1ZSwgdW5pbml0aWFsaXplZEluZGV4ICogbnVtQ29sLCBvdXRJbmRleCAqIG51bUNvbCk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gaW5kaWNlc1tpXTtcbiAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gaW5wdXRGbGF0WzBdKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGJhY2tlbmRfdXRpbC5nZXRTcGFyc2VTZWdtZW50UmVkdWN0aW9uSW5kaWNlc091dE9mUmFuZ2VFcnJvck1lc3NhZ2UoXG4gICAgICAgICAgICAgICAgaSwgaW5kaWNlc1tpXSwgaW5wdXRGbGF0WzBdKSk7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG51bUNvbDsgaisrKSB7XG4gICAgICAgIG91dHB1dFtvdXRJbmRleCAqIG51bUNvbCArIGpdICs9IGlucHV0W2luZGV4ICogbnVtQ29sICsgal07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzTWVhbikge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBudW1Db2w7IGorKykge1xuICAgICAgICBvdXRwdXRbb3V0SW5kZXggKiBudW1Db2wgKyBqXSAvPSBlbmQgLSBzdGFydDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGFydCA9IGVuZDtcbiAgICArK2VuZDtcbiAgICB1bmluaXRpYWxpemVkSW5kZXggPSBvdXRJbmRleCArIDE7XG4gICAgb3V0SW5kZXggPSBuZXh0SW5kZXg7XG4gICAgaWYgKGVuZCA+IG51bUluZGljZXMpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbGwgdGhlIGdhcCBhdCB0aGUgZW5kIHdpdGggdGhlIGRlZmF1bHQgdmFsdWUuXG4gIGlmICh1bmluaXRpYWxpemVkSW5kZXggPCBvdXRwdXRSb3dzKSB7XG4gICAgb3V0cHV0LmZpbGwoZGVmYXVsdFZhbHVlLCB1bmluaXRpYWxpemVkSW5kZXggKiBudW1Db2wsIG91dHB1dFJvd3MgKiBudW1Db2wpO1xuICB9XG5cbiAgcmV0dXJuIFtvdXRwdXQsIG91dHB1dFNoYXBlXTtcbn1cbiJdfQ==