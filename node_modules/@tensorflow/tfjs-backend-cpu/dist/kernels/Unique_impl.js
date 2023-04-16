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
import { TensorBuffer, util } from '@tensorflow/tfjs-core';
export function uniqueImpl(values, axis, shape, dtype) {
    // Normalize and validate axis.
    const $axis = util.parseAxisParam(axis, shape)[0];
    // Calculate the new shape that is suitable for extracting data along the
    // given axis.
    //
    // The rank is 3.
    // The size of the 1st dimension is the size of all the axes < the given axis.
    // The size of the 2nd dimension is the same as the size of the given axis.
    // The size of the 3rd dimension is the size of all the axes > the given axis.
    //
    // For example, for a 4D tensor with shape=[2, 3, 5, 4] and axis=2, the
    // newShape would be: [2*3, 5, 4].
    //
    // Note that this is not the final output shape. This will be the shape for an
    // intermediate TensorBuffer (see inputBuffer below) to allow us to extract
    // values along the given axis. To demonstrate how it works, consider the
    // following example:
    //
    // Input: a 3D tensor, with shape [1, 2, 3]
    // [
    //   [
    //      [1,2,3],
    //      [4,5,6]
    //   ]
    // ]
    // Axis: 2 (the last axis).
    // Along axis 2, we expect to extract 3 tensors: [1,4], [2,5], [3,6].
    //
    // For this example, newShape would be: [2, 3, 1], where 2 is calculated from
    // 1*2. The re-shaped data would look like:
    //
    // [
    //   [
    //     [1], [2], [3]
    //   ],
    //   [
    //     [4], [5], [6]
    //   ]
    // ]
    //
    // Then, we can construct a 3-level nested loop by the following dimension
    // order to extract the values along the axis (dimension1):
    // i: dimension1       // 0,1,2 (newShape[1])
    //   m: dimension0     // 0,1   (newShape[0])
    //     n: dimension2   // 0     (newShape[2])
    //
    //                       m, i, n
    //                      ---------
    // Iteration 0: data at [0, 0, 0] => "1"
    // Iteration 1: data at [1, 0, 0] => "4"
    // We got [1,4].
    // Iteration 2: data at [0, 1, 0] => "2"
    // Iteration 3: data at [1, 1, 0] => "5"
    // We got [2,5].
    // Iteration 4: data at [0, 2, 0] => "3"
    // Iteration 5: data at [1, 2, 0] => "6"
    // We got [3,6].
    const newShape = [1, shape[0], 1];
    for (let i = 0; i < $axis; i++) {
        newShape[0] *= shape[i];
    }
    newShape[1] = shape[$axis];
    for (let i = $axis + 1; i < shape.length; i++) {
        newShape[2] *= shape[i];
    }
    // A map from unique elements (their string representations) to their values
    // in "indices" (below).
    const uniqueElements = {};
    // The indices of each unique element in the original tensor along the given
    // axis. It is 1D and has the same size as the given axis.
    const indices = new Int32Array(shape[$axis]);
    // Create a buffer so we can easily extract value at a given location.
    const inputBuffer = new TensorBuffer(newShape, dtype, values);
    // The indices along the given axis that have unique elements. This is a
    // de-duped version of "indices" above.
    const uniqueIndices = [];
    const is1DTensor = newShape[0] === 1 && newShape[2] === 1;
    for (let i = 0; i < shape[$axis]; i++) {
        // Extract values along the axis.
        let element;
        if (is1DTensor) {
            // Fast path for 1D tensor input.
            element = values[i].toString();
        }
        else {
            const axisValues = [];
            for (let m = 0; m < newShape[0]; m++) {
                for (let n = 0; n < newShape[2]; n++) {
                    axisValues.push(inputBuffer.get(m, i, n));
                }
            }
            element = axisValues.join(',');
        }
        // Dedup and update various indices.
        if (uniqueElements[element] !== undefined) {
            indices[i] = uniqueElements[element];
        }
        else {
            const uniqueIndex = Object.keys(uniqueElements).length;
            uniqueElements[element] = uniqueIndex;
            indices[i] = uniqueIndex;
            uniqueIndices.push(i);
        }
    }
    // Now we know where each of the unique elements are located along the axis
    // (uniqueIndices). Extract them from input buffer and store them in the
    // output buffer.
    const outputTmpShape = newShape.slice();
    outputTmpShape[1] = Object.keys(uniqueElements).length;
    const outputBuffer = new TensorBuffer(outputTmpShape, dtype);
    uniqueIndices.forEach((uniqueElementIndex, i) => {
        for (let m = 0; m < newShape[0]; m++) {
            for (let n = 0; n < newShape[2]; n++) {
                outputBuffer.set(inputBuffer.get(m, uniqueElementIndex, n), m, i, n);
            }
        }
    });
    // The output shape can be calculated from the input shape with the size of
    // the given axis replaced by the number of unique elements along that axis.
    const outputShape = shape.slice();
    outputShape[$axis] = outputTmpShape[1];
    return {
        outputValues: outputBuffer.values,
        outputShape,
        indices,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVW5pcXVlX2ltcGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtY3B1L3NyYy9rZXJuZWxzL1VuaXF1ZV9pbXBsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBMEIsWUFBWSxFQUFjLElBQUksRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRTlGLE1BQU0sVUFBVSxVQUFVLENBQ3RCLE1BQXFCLEVBQUUsSUFBWSxFQUFFLEtBQWUsRUFBRSxLQUFlO0lBS3ZFLCtCQUErQjtJQUMvQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVsRCx5RUFBeUU7SUFDekUsY0FBYztJQUNkLEVBQUU7SUFDRixpQkFBaUI7SUFDakIsOEVBQThFO0lBQzlFLDJFQUEyRTtJQUMzRSw4RUFBOEU7SUFDOUUsRUFBRTtJQUNGLHVFQUF1RTtJQUN2RSxrQ0FBa0M7SUFDbEMsRUFBRTtJQUNGLDhFQUE4RTtJQUM5RSwyRUFBMkU7SUFDM0UseUVBQXlFO0lBQ3pFLHFCQUFxQjtJQUNyQixFQUFFO0lBQ0YsMkNBQTJDO0lBQzNDLElBQUk7SUFDSixNQUFNO0lBQ04sZ0JBQWdCO0lBQ2hCLGVBQWU7SUFDZixNQUFNO0lBQ04sSUFBSTtJQUNKLDJCQUEyQjtJQUMzQixxRUFBcUU7SUFDckUsRUFBRTtJQUNGLDZFQUE2RTtJQUM3RSwyQ0FBMkM7SUFDM0MsRUFBRTtJQUNGLElBQUk7SUFDSixNQUFNO0lBQ04sb0JBQW9CO0lBQ3BCLE9BQU87SUFDUCxNQUFNO0lBQ04sb0JBQW9CO0lBQ3BCLE1BQU07SUFDTixJQUFJO0lBQ0osRUFBRTtJQUNGLDBFQUEwRTtJQUMxRSwyREFBMkQ7SUFDM0QsNkNBQTZDO0lBQzdDLDZDQUE2QztJQUM3Qyw2Q0FBNkM7SUFDN0MsRUFBRTtJ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Z2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0JhY2tlbmRWYWx1ZXMsIERhdGFUeXBlLCBUZW5zb3JCdWZmZXIsIFR5cGVkQXJyYXksIHV0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmlxdWVJbXBsKFxuICAgIHZhbHVlczogQmFja2VuZFZhbHVlcywgYXhpczogbnVtYmVyLCBzaGFwZTogbnVtYmVyW10sIGR0eXBlOiBEYXRhVHlwZSk6IHtcbiAgb3V0cHV0VmFsdWVzOiBCYWNrZW5kVmFsdWVzLFxuICBvdXRwdXRTaGFwZTogbnVtYmVyW10sXG4gIGluZGljZXM6IEJhY2tlbmRWYWx1ZXNcbn0ge1xuICAvLyBOb3JtYWxpemUgYW5kIHZhbGlkYXRlIGF4aXMuXG4gIGNvbnN0ICRheGlzID0gdXRpbC5wYXJzZUF4aXNQYXJhbShheGlzLCBzaGFwZSlbMF07XG5cbiAgLy8gQ2FsY3VsYXRlIHRoZSBuZXcgc2hhcGUgdGhhdCBpcyBzdWl0YWJsZSBmb3IgZXh0cmFjdGluZyBkYXRhIGFsb25nIHRoZVxuICAvLyBnaXZlbiBheGlzLlxuICAvL1xuICAvLyBUaGUgcmFuayBpcyAzLlxuICAvLyBUaGUgc2l6ZSBvZiB0aGUgMXN0IGRpbWVuc2lvbiBpcyB0aGUgc2l6ZSBvZiBhbGwgdGhlIGF4ZXMgPCB0aGUgZ2l2ZW4gYXhpcy5cbiAgLy8gVGhlIHNpemUgb2YgdGhlIDJuZCBkaW1lbnNpb24gaXMgdGhlIHNhbWUgYXMgdGhlIHNpemUgb2YgdGhlIGdpdmVuIGF4aXMuXG4gIC8vIFRoZSBzaXplIG9mIHRoZSAzcmQgZGltZW5zaW9uIGlzIHRoZSBzaXplIG9mIGFsbCB0aGUgYXhlcyA+IHRoZSBnaXZlbiBheGlzLlxuICAvL1xuICAvLyBGb3IgZXhhbXBsZSwgZm9yIGEgNEQgdGVuc29yIHdpdGggc2hhcGU9WzIsIDMsIDUsIDRdIGFuZCBheGlzPTIsIHRoZVxuICAvLyBuZXdTaGFwZSB3b3VsZCBiZTogWzIqMywgNSwgNF0uXG4gIC8vXG4gIC8vIE5vdGUgdGhhdCB0aGlzIGlzIG5vdCB0aGUgZmluYWwgb3V0cHV0IHNoYXBlLiBUaGlzIHdpbGwgYmUgdGhlIHNoYXBlIGZvciBhblxuICAvLyBpbnRlcm1lZGlhdGUgVGVuc29yQnVmZmVyIChzZWUgaW5wdXRCdWZmZXIgYmVsb3cpIHRvIGFsbG93IHVzIHRvIGV4dHJhY3RcbiAgLy8gdmFsdWVzIGFsb25nIHRoZSBnaXZlbiBheGlzLiBUbyBkZW1vbnN0cmF0ZSBob3cgaXQgd29ya3MsIGNvbnNpZGVyIHRoZVxuICAvLyBmb2xsb3dpbmcgZXhhbXBsZTpcbiAgLy9cbiAgLy8gSW5wdXQ6IGEgM0QgdGVuc29yLCB3aXRoIHNoYXBlIFsxLCAyLCAzXVxuICAvLyBbXG4gIC8vICAgW1xuICAvLyAgICAgIFsxLDIsM10sXG4gIC8vICAgICAgWzQsNSw2XVxuICAvLyAgIF1cbiAgLy8gXVxuICAvLyBBeGlzOiAyICh0aGUgbGFzdCBheGlzKS5cbiAgLy8gQWxvbmcgYXhpcyAyLCB3ZSBleHBlY3QgdG8gZXh0cmFjdCAzIHRlbnNvcnM6IFsxLDRdLCBbMiw1XSwgWzMsNl0uXG4gIC8vXG4gIC8vIEZvciB0aGlzIGV4YW1wbGUsIG5ld1NoYXBlIHdvdWxkIGJlOiBbMiwgMywgMV0sIHdoZXJlIDIgaXMgY2FsY3VsYXRlZCBmcm9tXG4gIC8vIDEqMi4gVGhlIHJlLXNoYXBlZCBkYXRhIHdvdWxkIGxvb2sgbGlrZTpcbiAgLy9cbiAgLy8gW1xuICAvLyAgIFtcbiAgLy8gICAgIFsxXSwgWzJdLCBbM11cbiAgLy8gICBdLFxuICAvLyAgIFtcbiAgLy8gICAgIFs0XSwgWzVdLCBbNl1cbiAgLy8gICBdXG4gIC8vIF1cbiAgLy9cbiAgLy8gVGhlbiwgd2UgY2FuIGNvbnN0cnVjdCBhIDMtbGV2ZWwgbmVzdGVkIGxvb3AgYnkgdGhlIGZvbGxvd2luZyBkaW1lbnNpb25cbiAgLy8gb3JkZXIgdG8gZXh0cmFjdCB0aGUgdmFsdWVzIGFsb25nIHRoZSBheGlzIChkaW1lbnNpb24xKTpcbiAgLy8gaTogZGltZW5zaW9uMSAgICAgICAvLyAwLDEsMiAobmV3U2hhcGVbMV0pXG4gIC8vICAgbTogZGltZW5zaW9uMCAgICAgLy8gMCwxICAgKG5ld1NoYXBlWzBdKVxuICAvLyAgICAgbjogZGltZW5zaW9uMiAgIC8vIDAgICAgIChuZXdTaGFwZVsyXSlcbiAgLy9cbiAgLy8gICAgICAgICAgICAgICAgICAgICAgIG0sIGksIG5cbiAgLy8gICAgICAgICAgICAgICAgICAgICAgLS0tLS0tLS0tXG4gIC8vIEl0ZXJhdGlvbiAwOiBkYXRhIGF0IFswLCAwLCAwXSA9PiBcIjFcIlxuICAvLyBJdGVyYXRpb24gMTogZGF0YSBhdCBbMSwgMCwgMF0gPT4gXCI0XCJcbiAgLy8gV2UgZ290IFsxLDRdLlxuICAvLyBJdGVyYXRpb24gMjogZGF0YSBhdCBbMCwgMSwgMF0gPT4gXCIyXCJcbiAgLy8gSXRlcmF0aW9uIDM6IGRhdGEgYXQgWzEsIDEsIDBdID0+IFwiNVwiXG4gIC8vIFdlIGdvdCBbMiw1XS5cbiAgLy8gSXRlcmF0aW9uIDQ6IGRhdGEgYXQgWzAsIDIsIDBdID0+IFwiM1wiXG4gIC8vIEl0ZXJhdGlvbiA1OiBkYXRhIGF0IFsxLCAyLCAwXSA9PiBcIjZcIlxuICAvLyBXZSBnb3QgWzMsNl0uXG4gIGNvbnN0IG5ld1NoYXBlID0gWzEsIHNoYXBlWzBdLCAxXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAkYXhpczsgaSsrKSB7XG4gICAgbmV3U2hhcGVbMF0gKj0gc2hhcGVbaV07XG4gIH1cbiAgbmV3U2hhcGVbMV0gPSBzaGFwZVskYXhpc107XG4gIGZvciAobGV0IGkgPSAkYXhpcyArIDE7IGkgPCBzaGFwZS5sZW5ndGg7IGkrKykge1xuICAgIG5ld1NoYXBlWzJdICo9IHNoYXBlW2ldO1xuICB9XG5cbiAgLy8gQSBtYXAgZnJvbSB1bmlxdWUgZWxlbWVudHMgKHRoZWlyIHN0cmluZyByZXByZXNlbnRhdGlvbnMpIHRvIHRoZWlyIHZhbHVlc1xuICAvLyBpbiBcImluZGljZXNcIiAoYmVsb3cpLlxuICBjb25zdCB1bmlxdWVFbGVtZW50czoge1trZXk6IHN0cmluZ106IG51bWJlcn0gPSB7fTtcbiAgLy8gVGhlIGluZGljZXMgb2YgZWFjaCB1bmlxdWUgZWxlbWVudCBpbiB0aGUgb3JpZ2luYWwgdGVuc29yIGFsb25nIHRoZSBnaXZlblxuICAvLyBheGlzLiBJdCBpcyAxRCBhbmQgaGFzIHRoZSBzYW1lIHNpemUgYXMgdGhlIGdpdmVuIGF4aXMuXG4gIGNvbnN0IGluZGljZXMgPSBuZXcgSW50MzJBcnJheShzaGFwZVskYXhpc10pO1xuICAvLyBDcmVhdGUgYSBidWZmZXIgc28gd2UgY2FuIGVhc2lseSBleHRyYWN0IHZhbHVlIGF0IGEgZ2l2ZW4gbG9jYXRpb24uXG4gIGNvbnN0IGlucHV0QnVmZmVyID0gbmV3IFRlbnNvckJ1ZmZlcihuZXdTaGFwZSwgZHR5cGUsIHZhbHVlcyBhcyBUeXBlZEFycmF5KTtcbiAgLy8gVGhlIGluZGljZXMgYWxvbmcgdGhlIGdpdmVuIGF4aXMgdGhhdCBoYXZlIHVuaXF1ZSBlbGVtZW50cy4gVGhpcyBpcyBhXG4gIC8vIGRlLWR1cGVkIHZlcnNpb24gb2YgXCJpbmRpY2VzXCIgYWJvdmUuXG4gIGNvbnN0IHVuaXF1ZUluZGljZXM6IG51bWJlcltdID0gW107XG4gIGNvbnN0IGlzMURUZW5zb3IgPSBuZXdTaGFwZVswXSA9PT0gMSAmJiBuZXdTaGFwZVsyXSA9PT0gMTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGFwZVskYXhpc107IGkrKykge1xuICAgIC8vIEV4dHJhY3QgdmFsdWVzIGFsb25nIHRoZSBheGlzLlxuICAgIGxldCBlbGVtZW50OiBzdHJpbmc7XG4gICAgaWYgKGlzMURUZW5zb3IpIHtcbiAgICAgIC8vIEZhc3QgcGF0aCBmb3IgMUQgdGVuc29yIGlucHV0LlxuICAgICAgZWxlbWVudCA9IHZhbHVlc1tpXS50b1N0cmluZygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBheGlzVmFsdWVzID0gW107XG4gICAgICBmb3IgKGxldCBtID0gMDsgbSA8IG5ld1NoYXBlWzBdOyBtKyspIHtcbiAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBuZXdTaGFwZVsyXTsgbisrKSB7XG4gICAgICAgICAgYXhpc1ZhbHVlcy5wdXNoKGlucHV0QnVmZmVyLmdldChtLCBpLCBuKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsZW1lbnQgPSBheGlzVmFsdWVzLmpvaW4oJywnKTtcbiAgICB9XG5cbiAgICAvLyBEZWR1cCBhbmQgdXBkYXRlIHZhcmlvdXMgaW5kaWNlcy5cbiAgICBpZiAodW5pcXVlRWxlbWVudHNbZWxlbWVudF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgaW5kaWNlc1tpXSA9IHVuaXF1ZUVsZW1lbnRzW2VsZW1lbnRdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB1bmlxdWVJbmRleCA9IE9iamVjdC5rZXlzKHVuaXF1ZUVsZW1lbnRzKS5sZW5ndGg7XG4gICAgICB1bmlxdWVFbGVtZW50c1tlbGVtZW50XSA9IHVuaXF1ZUluZGV4O1xuICAgICAgaW5kaWNlc1tpXSA9IHVuaXF1ZUluZGV4O1xuICAgICAgdW5pcXVlSW5kaWNlcy5wdXNoKGkpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE5vdyB3ZSBrbm93IHdoZXJlIGVhY2ggb2YgdGhlIHVuaXF1ZSBlbGVtZW50cyBhcmUgbG9jYXRlZCBhbG9uZyB0aGUgYXhpc1xuICAvLyAodW5pcXVlSW5kaWNlcykuIEV4dHJhY3QgdGhlbSBmcm9tIGlucHV0IGJ1ZmZlciBhbmQgc3RvcmUgdGhlbSBpbiB0aGVcbiAgLy8gb3V0cHV0IGJ1ZmZlci5cbiAgY29uc3Qgb3V0cHV0VG1wU2hhcGUgPSBuZXdTaGFwZS5zbGljZSgpO1xuICBvdXRwdXRUbXBTaGFwZVsxXSA9IE9iamVjdC5rZXlzKHVuaXF1ZUVsZW1lbnRzKS5sZW5ndGg7XG4gIGNvbnN0IG91dHB1dEJ1ZmZlciA9IG5ldyBUZW5zb3JCdWZmZXIob3V0cHV0VG1wU2hhcGUsIGR0eXBlKTtcbiAgdW5pcXVlSW5kaWNlcy5mb3JFYWNoKCh1bmlxdWVFbGVtZW50SW5kZXgsIGkpID0+IHtcbiAgICBmb3IgKGxldCBtID0gMDsgbSA8IG5ld1NoYXBlWzBdOyBtKyspIHtcbiAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgbmV3U2hhcGVbMl07IG4rKykge1xuICAgICAgICBvdXRwdXRCdWZmZXIuc2V0KGlucHV0QnVmZmVyLmdldChtLCB1bmlxdWVFbGVtZW50SW5kZXgsIG4pLCBtLCBpLCBuKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIFRoZSBvdXRwdXQgc2hhcGUgY2FuIGJlIGNhbGN1bGF0ZWQgZnJvbSB0aGUgaW5wdXQgc2hhcGUgd2l0aCB0aGUgc2l6ZSBvZlxuICAvLyB0aGUgZ2l2ZW4gYXhpcyByZXBsYWNlZCBieSB0aGUgbnVtYmVyIG9mIHVuaXF1ZSBlbGVtZW50cyBhbG9uZyB0aGF0IGF4aXMuXG4gIGNvbnN0IG91dHB1dFNoYXBlID0gc2hhcGUuc2xpY2UoKTtcbiAgb3V0cHV0U2hhcGVbJGF4aXNdID0gb3V0cHV0VG1wU2hhcGVbMV07XG5cbiAgcmV0dXJuIHtcbiAgICBvdXRwdXRWYWx1ZXM6IG91dHB1dEJ1ZmZlci52YWx1ZXMgYXMgQmFja2VuZFZhbHVlcyxcbiAgICBvdXRwdXRTaGFwZSxcbiAgICBpbmRpY2VzLFxuICB9O1xufVxuIl19