/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 * Gets the new shape of the input Tensor after it's been reshaped
 * to:
 * [blockShape[0], ..., blockShape[M-1], batch / prod(blockShape),
 * inputShape[1], ..., inputShape[N-1]]
 *
 * See step 1: https://www.tensorflow.org/api_docs/python/tf/batch_to_space_nd
 */
export function getReshaped(inputShape, blockShape, prod, batchToSpace = true) {
    let reshaped = [];
    if (batchToSpace) {
        reshaped = reshaped.concat(blockShape.slice(0));
        reshaped.push(inputShape[0] / prod);
        reshaped = reshaped.concat(inputShape.slice(1));
    }
    else {
        reshaped = reshaped.concat(inputShape[0]);
        const spatialLength = blockShape.length;
        for (let i = 0; i < spatialLength; ++i) {
            reshaped =
                reshaped.concat([inputShape[i + 1] / blockShape[i], blockShape[i]]);
        }
        reshaped = reshaped.concat(inputShape.slice(spatialLength + 1));
    }
    return reshaped;
}
/**
 * Gets the permutation that will transpose the dimensions of the
 * reshaped tensor to shape:
 *
 * [batch / prod(block_shape),inputShape[1], blockShape[0], ...,
 * inputShape[M], blockShape[M-1],inputShape[M+1], ..., inputShape[N-1]]
 *
 * see step 2: https://www.tensorflow.org/api_docs/python/tf/batch_to_space_nd
 */
export function getPermuted(reshapedRank, blockShapeRank, batchToSpace = true) {
    const permuted = [];
    if (batchToSpace) {
        permuted.push(blockShapeRank);
        for (let i = blockShapeRank + 1; i < reshapedRank; ++i) {
            if (i <= 2 * blockShapeRank) {
                permuted.push(i);
                permuted.push(i - (blockShapeRank + 1));
            }
            else {
                permuted.push(i);
            }
        }
    }
    else {
        const permutedBeforeBatch = [];
        const permutedAfterBatch = [];
        for (let i = 1; i < reshapedRank; ++i) {
            if (i >= blockShapeRank * 2 + 1 || i % 2 === 1) {
                permutedAfterBatch.push(i);
            }
            else {
                permutedBeforeBatch.push(i);
            }
        }
        permuted.push(...permutedBeforeBatch);
        permuted.push(0);
        permuted.push(...permutedAfterBatch);
    }
    return permuted;
}
/**
 * Gets the shape of the reshaped and permuted input Tensor before any cropping
 * is applied.  The new shape will be:
 *
 * [batch / prod(blockShape),inputShape[1] * blockShape[0], ...,
 * inputShape[M] * blockShape[M-1],inputShape[M+1], ..., inputShape[N-1]]
 *
 * See step 3: https://www.tensorflow.org/api_docs/python/tf/batch_to_space_nd
 */
export function getReshapedPermuted(inputShape, blockShape, prod, batchToSpace = true) {
    const reshapedPermuted = [];
    if (batchToSpace) {
        reshapedPermuted.push(inputShape[0] / prod);
    }
    else {
        reshapedPermuted.push(inputShape[0] * prod);
    }
    for (let i = 1; i < inputShape.length; ++i) {
        if (i <= blockShape.length) {
            if (batchToSpace) {
                reshapedPermuted.push(blockShape[i - 1] * inputShape[i]);
            }
            else {
                reshapedPermuted.push(inputShape[i] / blockShape[i - 1]);
            }
        }
        else {
            reshapedPermuted.push(inputShape[i]);
        }
    }
    return reshapedPermuted;
}
/**
 * Converts the crops argument into the beginning coordinates of a slice
 * operation.
 */
export function getSliceBeginCoords(crops, blockShape) {
    const sliceBeginCoords = [0];
    for (let i = 0; i < blockShape; ++i) {
        sliceBeginCoords.push(crops[i][0]);
    }
    return sliceBeginCoords;
}
/**
 * Converts the crops argument into the size of a slice operation.  When
 * combined with getSliceBeginCoords this function allows the reshaped and
 * permuted Tensor to be cropped to its final output shape of:
 *
 * inputShape[1] * blockShape[0] - crops[0,0] - crops[0,1], ...,
 * inputShape[M] * blockShape[M-1] -crops[M-1,0] -
 * crops[M-1,1],inputShape[M+1], ..., inputShape[N-1]]
 *
 * See step 4: https://www.tensorflow.org/api_docs/python/tf/batch_to_space_nd
 */
export function getSliceSize(uncroppedShape, crops, blockShape) {
    const sliceSize = uncroppedShape.slice(0, 1);
    for (let i = 0; i < blockShape; ++i) {
        sliceSize.push(uncroppedShape[i + 1] - crops[i][0] - crops[i][1]);
    }
    return sliceSize;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyYXlfb3BzX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9hcnJheV9vcHNfdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSDs7Ozs7OztHQU9HO0FBQ0gsTUFBTSxVQUFVLFdBQVcsQ0FDdkIsVUFBb0IsRUFBRSxVQUFvQixFQUFFLElBQVksRUFDeEQsWUFBWSxHQUFHLElBQUk7SUFDckIsSUFBSSxRQUFRLEdBQWEsRUFBRSxDQUFDO0lBQzVCLElBQUksWUFBWSxFQUFFO1FBQ2hCLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUNwQyxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDakQ7U0FBTTtRQUNMLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDeEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsRUFBRSxFQUFFLENBQUMsRUFBRTtZQUN0QyxRQUFRO2dCQUNKLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3pFO1FBQ0QsUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFB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TyxnQkFBZ0IsQ0FBQztBQUMxQixDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLG1CQUFtQixDQUMvQixLQUFpQixFQUFFLFVBQWtCO0lBQ3ZDLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQ25DLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNwQztJQUNELE9BQU8sZ0JBQWdCLENBQUM7QUFDMUIsQ0FBQztBQUVEOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUN4QixjQUF3QixFQUFFLEtBQWlCLEVBQUUsVUFBa0I7SUFDakUsTUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDN0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUNuQyxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ25FO0lBRUQsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuLyoqXG4gKiBHZXRzIHRoZSBuZXcgc2hhcGUgb2YgdGhlIGlucHV0IFRlbnNvciBhZnRlciBpdCdzIGJlZW4gcmVzaGFwZWRcbiAqIHRvOlxuICogW2Jsb2NrU2hhcGVbMF0sIC4uLiwgYmxvY2tTaGFwZVtNLTFdLCBiYXRjaCAvIHByb2QoYmxvY2tTaGFwZSksXG4gKiBpbnB1dFNoYXBlWzFdLCAuLi4sIGlucHV0U2hhcGVbTi0xXV1cbiAqXG4gKiBTZWUgc3RlcCAxOiBodHRwczovL3d3dy50ZW5zb3JmbG93Lm9yZy9hcGlfZG9jcy9weXRob24vdGYvYmF0Y2hfdG9fc3BhY2VfbmRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJlc2hhcGVkKFxuICAgIGlucHV0U2hhcGU6IG51bWJlcltdLCBibG9ja1NoYXBlOiBudW1iZXJbXSwgcHJvZDogbnVtYmVyLFxuICAgIGJhdGNoVG9TcGFjZSA9IHRydWUpOiBudW1iZXJbXSB7XG4gIGxldCByZXNoYXBlZDogbnVtYmVyW10gPSBbXTtcbiAgaWYgKGJhdGNoVG9TcGFjZSkge1xuICAgIHJlc2hhcGVkID0gcmVzaGFwZWQuY29uY2F0KGJsb2NrU2hhcGUuc2xpY2UoMCkpO1xuICAgIHJlc2hhcGVkLnB1c2goaW5wdXRTaGFwZVswXSAvIHByb2QpO1xuICAgIHJlc2hhcGVkID0gcmVzaGFwZWQuY29uY2F0KGlucHV0U2hhcGUuc2xpY2UoMSkpO1xuICB9IGVsc2Uge1xuICAgIHJlc2hhcGVkID0gcmVzaGFwZWQuY29uY2F0KGlucHV0U2hhcGVbMF0pO1xuICAgIGNvbnN0IHNwYXRpYWxMZW5ndGggPSBibG9ja1NoYXBlLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNwYXRpYWxMZW5ndGg7ICsraSkge1xuICAgICAgcmVzaGFwZWQgPVxuICAgICAgICAgIHJlc2hhcGVkLmNvbmNhdChbaW5wdXRTaGFwZVtpICsgMV0gLyBibG9ja1NoYXBlW2ldLCBibG9ja1NoYXBlW2ldXSk7XG4gICAgfVxuICAgIHJlc2hhcGVkID0gcmVzaGFwZWQuY29uY2F0KGlucHV0U2hhcGUuc2xpY2Uoc3BhdGlhbExlbmd0aCArIDEpKTtcbiAgfVxuICByZXR1cm4gcmVzaGFwZWQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgcGVybXV0YXRpb24gdGhhdCB3aWxsIHRyYW5zcG9zZSB0aGUgZGltZW5zaW9ucyBvZiB0aGVcbiAqIHJlc2hhcGVkIHRlbnNvciB0byBzaGFwZTpcbiAqXG4gKiBbYmF0Y2ggLyBwcm9kKGJsb2NrX3NoYXBlKSxpbnB1dFNoYXBlWzFdLCBibG9ja1NoYXBlWzBdLCAuLi4sXG4gKiBpbnB1dFNoYXBlW01dLCBibG9ja1NoYXBlW00tMV0saW5wdXRTaGFwZVtNKzFdLCAuLi4sIGlucHV0U2hhcGVbTi0xXV1cbiAqXG4gKiBzZWUgc3RlcCAyOiBodHRwczovL3d3dy50ZW5zb3JmbG93Lm9yZy9hcGlfZG9jcy9weXRob24vdGYvYmF0Y2hfdG9fc3BhY2VfbmRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFBlcm11dGVkKFxuICAgIHJlc2hhcGVkUmFuazogbnVtYmVyLCBibG9ja1NoYXBlUmFuazogbnVtYmVyLFxuICAgIGJhdGNoVG9TcGFjZSA9IHRydWUpOiBudW1iZXJbXSB7XG4gIGNvbnN0IHBlcm11dGVkID0gW107XG4gIGlmIChiYXRjaFRvU3BhY2UpIHtcbiAgICBwZXJtdXRlZC5wdXNoKGJsb2NrU2hhcGVSYW5rKTtcbiAgICBmb3IgKGxldCBpID0gYmxvY2tTaGFwZVJhbmsgKyAxOyBpIDwgcmVzaGFwZWRSYW5rOyArK2kpIHtcbiAgICAgIGlmIChpIDw9IDIgKiBibG9ja1NoYXBlUmFuaykge1xuICAgICAgICBwZXJtdXRlZC5wdXNoKGkpO1xuICAgICAgICBwZXJtdXRlZC5wdXNoKGkgLSAoYmxvY2tTaGFwZVJhbmsgKyAxKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZXJtdXRlZC5wdXNoKGkpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zdCBwZXJtdXRlZEJlZm9yZUJhdGNoID0gW107XG4gICAgY29uc3QgcGVybXV0ZWRBZnRlckJhdGNoID0gW107XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCByZXNoYXBlZFJhbms7ICsraSkge1xuICAgICAgaWYgKGkgPj0gYmxvY2tTaGFwZVJhbmsgKiAyICsgMSB8fCBpICUgMiA9PT0gMSkge1xuICAgICAgICBwZXJtdXRlZEFmdGVyQmF0Y2gucHVzaChpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlcm11dGVkQmVmb3JlQmF0Y2gucHVzaChpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcGVybXV0ZWQucHVzaCguLi5wZXJtdXRlZEJlZm9yZUJhdGNoKTtcbiAgICBwZXJtdXRlZC5wdXNoKDApO1xuICAgIHBlcm11dGVkLnB1c2goLi4ucGVybXV0ZWRBZnRlckJhdGNoKTtcbiAgfVxuICByZXR1cm4gcGVybXV0ZWQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgc2hhcGUgb2YgdGhlIHJlc2hhcGVkIGFuZCBwZXJtdXRlZCBpbnB1dCBUZW5zb3IgYmVmb3JlIGFueSBjcm9wcGluZ1xuICogaXMgYXBwbGllZC4gIFRoZSBuZXcgc2hhcGUgd2lsbCBiZTpcbiAqXG4gKiBbYmF0Y2ggLyBwcm9kKGJsb2NrU2hhcGUpLGlucHV0U2hhcGVbMV0gKiBibG9ja1NoYXBlWzBdLCAuLi4sXG4gKiBpbnB1dFNoYXBlW01dICogYmxvY2tTaGFwZVtNLTFdLGlucHV0U2hhcGVbTSsxXSwgLi4uLCBpbnB1dFNoYXBlW04tMV1dXG4gKlxuICogU2VlIHN0ZXAgMzogaHR0cHM6Ly93d3cudGVuc29yZmxvdy5vcmcvYXBpX2RvY3MvcHl0aG9uL3RmL2JhdGNoX3RvX3NwYWNlX25kXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRSZXNoYXBlZFBlcm11dGVkKFxuICAgIGlucHV0U2hhcGU6IG51bWJlcltdLCBibG9ja1NoYXBlOiBudW1iZXJbXSwgcHJvZDogbnVtYmVyLFxuICAgIGJhdGNoVG9TcGFjZSA9IHRydWUpOiBudW1iZXJbXSB7XG4gIGNvbnN0IHJlc2hhcGVkUGVybXV0ZWQgPSBbXTtcblxuICBpZiAoYmF0Y2hUb1NwYWNlKSB7XG4gICAgcmVzaGFwZWRQZXJtdXRlZC5wdXNoKGlucHV0U2hhcGVbMF0gLyBwcm9kKTtcbiAgfSBlbHNlIHtcbiAgICByZXNoYXBlZFBlcm11dGVkLnB1c2goaW5wdXRTaGFwZVswXSAqIHByb2QpO1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBpbnB1dFNoYXBlLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKGkgPD0gYmxvY2tTaGFwZS5sZW5ndGgpIHtcbiAgICAgIGlmIChiYXRjaFRvU3BhY2UpIHtcbiAgICAgICAgcmVzaGFwZWRQZXJtdXRlZC5wdXNoKGJsb2NrU2hhcGVbaSAtIDFdICogaW5wdXRTaGFwZVtpXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNoYXBlZFBlcm11dGVkLnB1c2goaW5wdXRTaGFwZVtpXSAvIGJsb2NrU2hhcGVbaSAtIDFdKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVzaGFwZWRQZXJtdXRlZC5wdXNoKGlucHV0U2hhcGVbaV0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXNoYXBlZFBlcm11dGVkO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBjcm9wcyBhcmd1bWVudCBpbnRvIHRoZSBiZWdpbm5pbmcgY29vcmRpbmF0ZXMgb2YgYSBzbGljZVxuICogb3BlcmF0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2xpY2VCZWdpbkNvb3JkcyhcbiAgICBjcm9wczogbnVtYmVyW11bXSwgYmxvY2tTaGFwZTogbnVtYmVyKTogbnVtYmVyW10ge1xuICBjb25zdCBzbGljZUJlZ2luQ29vcmRzID0gWzBdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2NrU2hhcGU7ICsraSkge1xuICAgIHNsaWNlQmVnaW5Db29yZHMucHVzaChjcm9wc1tpXVswXSk7XG4gIH1cbiAgcmV0dXJuIHNsaWNlQmVnaW5Db29yZHM7XG59XG5cbi8qKlxuICogQ29udmVydHMgdGhlIGNyb3BzIGFyZ3VtZW50IGludG8gdGhlIHNpemUgb2YgYSBzbGljZSBvcGVyYXRpb24uICBXaGVuXG4gKiBjb21iaW5lZCB3aXRoIGdldFNsaWNlQmVnaW5Db29yZHMgdGhpcyBmdW5jdGlvbiBhbGxvd3MgdGhlIHJlc2hhcGVkIGFuZFxuICogcGVybXV0ZWQgVGVuc29yIHRvIGJlIGNyb3BwZWQgdG8gaXRzIGZpbmFsIG91dHB1dCBzaGFwZSBvZjpcbiAqXG4gKiBpbnB1dFNoYXBlWzFdICogYmxvY2tTaGFwZVswXSAtIGNyb3BzWzAsMF0gLSBjcm9wc1swLDFdLCAuLi4sXG4gKiBpbnB1dFNoYXBlW01dICogYmxvY2tTaGFwZVtNLTFdIC1jcm9wc1tNLTEsMF0gLVxuICogY3JvcHNbTS0xLDFdLGlucHV0U2hhcGVbTSsxXSwgLi4uLCBpbnB1dFNoYXBlW04tMV1dXG4gKlxuICogU2VlIHN0ZXAgNDogaHR0cHM6Ly93d3cudGVuc29yZmxvdy5vcmcvYXBpX2RvY3MvcHl0aG9uL3RmL2JhdGNoX3RvX3NwYWNlX25kXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTbGljZVNpemUoXG4gICAgdW5jcm9wcGVkU2hhcGU6IG51bWJlcltdLCBjcm9wczogbnVtYmVyW11bXSwgYmxvY2tTaGFwZTogbnVtYmVyKTogbnVtYmVyW10ge1xuICBjb25zdCBzbGljZVNpemUgPSB1bmNyb3BwZWRTaGFwZS5zbGljZSgwLCAxKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja1NoYXBlOyArK2kpIHtcbiAgICBzbGljZVNpemUucHVzaCh1bmNyb3BwZWRTaGFwZVtpICsgMV0gLSBjcm9wc1tpXVswXSAtIGNyb3BzW2ldWzFdKTtcbiAgfVxuXG4gIHJldHVybiBzbGljZVNpemU7XG59XG4iXX0=