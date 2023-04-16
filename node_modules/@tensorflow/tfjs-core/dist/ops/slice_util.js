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
import * as util from '../util';
const NEW_AXIS = -2;
const SHRINK_AXIS = -1;
export function assertParamsValid(input, begin, size) {
    const inputRank = input.shape.length;
    util.assert(inputRank === begin.length, () => `Error in slice${inputRank}D: Length of begin ${begin} must ` +
        `match the rank of the array (${inputRank}).`);
    util.assert(inputRank === size.length, () => `Error in slice${inputRank}D: Length of size ${size} must ` +
        `match the rank of the array (${inputRank}).`);
    for (let i = 0; i < inputRank; ++i) {
        util.assert(begin[i] + size[i] <= input.shape[i], () => `Error in slice${inputRank}D: begin[${i}] + size[${i}] ` +
            `(${begin[i] + size[i]}) would overflow input.shape[${i}] (${input.shape[i]})`);
    }
}
/** Converts a binary mask to an array of axes. Used in stridedSlice(). */
export function maskToAxes(mask) {
    const axes = [];
    let axis = 0;
    while (mask > 0) {
        if (mask & 1) {
            axes.push(axis);
        }
        mask /= 2;
        axis++;
    }
    return axes;
}
/** Computes the output shape given the strided slice params. */
export function computeOutShape(begin, end, strides) {
    const size = [];
    for (let axis = 0; axis < begin.length; axis++) {
        size[axis] = Math.ceil((end[axis] - begin[axis]) / strides[axis]);
    }
    return size;
}
// Creates full selection at the elided dimensions. If the dimension matches
// the ellipsis mask, override the current stride value. Otherwise, insert.
export function stridesWithElidedDims(strides, ellipsisInsertionIndex, numElidedAxes, inputShape) {
    const newStrides = [...strides];
    for (let i = newStrides.length; i < inputShape.length; i++) {
        newStrides.push(1);
    }
    for (let i = 0; i < numElidedAxes; i++) {
        if (i === 0) {
            newStrides[ellipsisInsertionIndex] = 1;
        }
        else {
            newStrides.splice(ellipsisInsertionIndex, 0 /* num elements to delete */, 1 /* element to add */);
            newStrides.pop();
        }
    }
    return newStrides;
}
function unnormalizeAxis(ellipsisInsertionIndex, numElidedAxes, normalizedAxis) {
    if (normalizedAxis <= ellipsisInsertionIndex) {
        return normalizedAxis;
    }
    return normalizedAxis - (numElidedAxes - 1);
}
function getElidedAxes(numElidedAxes, ellipsisInsertionIndex) {
    const elidedAxes = [];
    for (let i = 0; i < numElidedAxes; i++) {
        elidedAxes.push(ellipsisInsertionIndex + i);
    }
    return elidedAxes;
}
// Normalize the start, end and strides.
export function getNormalizedAxes(inputShape, ellipsisAxes, numInterpolatedAxes, begin, end, strides, beginMask, endMask, ellipsisMask) {
    const inputRank = inputShape.length;
    let normalizedBegin = new Array(inputRank), normalizedEnd = new Array(inputRank), normalizedStrides = new Array(inputRank);
    if (ellipsisAxes.length && numInterpolatedAxes > 0) {
        const fullIndex = ellipsisAxes[0];
        // The ellipsis applies to the masked index as well as any dimensions
        // that are interpolated.
        const numElidedAxes = numInterpolatedAxes + 1;
        normalizedBegin = startIndicesWithElidedDims(beginMask, fullIndex, numElidedAxes, begin, inputShape);
        normalizedEnd = stopIndicesWithElidedDims(endMask, fullIndex, numElidedAxes, end, inputShape);
        normalizedStrides =
            stridesWithElidedDims(strides, fullIndex, numElidedAxes, inputShape);
    }
    else {
        for (let axis = 0; axis < inputRank; axis++) {
            normalizedBegin[axis] = startForAxis(beginMask, begin, strides, inputShape, axis, ellipsisMask);
            normalizedEnd[axis] =
                stopForAxis(endMask, end, strides, inputShape, axis, ellipsisMask);
            normalizedStrides[axis] = stridesForAxis(strides, axis, ellipsisMask);
        }
    }
    return {
        begin: normalizedBegin,
        end: normalizedEnd,
        strides: normalizedStrides
    };
}
// Creates full selection at the elided dimensions. If the dimension matches
// the ellipsis mask, override the current start value. Otherwise, insert.
export function startIndicesWithElidedDims(beginMask, ellipsisInsertionIndex, numElidedAxes, originalBegin, inputShape) {
    const newIndices = [...inputShape];
    const elidedAxes = getElidedAxes(numElidedAxes, ellipsisInsertionIndex);
    for (let axis = 0; axis < newIndices.length; axis++) {
        if (elidedAxes.indexOf(axis) > -1) {
            newIndices[axis] = 0;
        }
        else {
            const originalAxis = unnormalizeAxis(ellipsisInsertionIndex, numElidedAxes, axis);
            let originalValue = originalBegin[originalAxis];
            if (beginMask & 1 << originalAxis) {
                originalValue = 0;
            }
            newIndices[axis] = originalValue;
        }
    }
    return newIndices;
}
// Creates full selection at the elided dimensions. If the dimension matches
// the ellipsis mask, override the current stop value. Otherwise, insert.
export function stopIndicesWithElidedDims(endMask, ellipsisInsertionIndex, numElidedAxes, originalEnd, inputShape) {
    const newIndices = [...inputShape];
    const elidedAxes = getElidedAxes(numElidedAxes, ellipsisInsertionIndex);
    for (let axis = 0; axis < newIndices.length; axis++) {
        if (elidedAxes.indexOf(axis) > -1) {
            newIndices[axis] = Number.MAX_SAFE_INTEGER;
        }
        else {
            const originalAxis = unnormalizeAxis(ellipsisInsertionIndex, numElidedAxes, axis);
            let originalValue = originalEnd[originalAxis];
            if (endMask & 1 << originalAxis) {
                originalValue = Number.MAX_SAFE_INTEGER;
            }
            newIndices[axis] = originalValue;
        }
    }
    for (let i = 0; i < newIndices.length; i++) {
        // Handle negative indices
        const axisSize = inputShape[i];
        if (newIndices[i] < 0) {
            newIndices[i] += axisSize;
        }
        newIndices[i] = util.clamp(0, newIndices[i], inputShape[i]);
    }
    return newIndices;
}
export function stridesForAxis(strides, axis, ellipsisMask) {
    let stride = strides[axis];
    if (ellipsisMask & (1 << axis) || stride == null) {
        stride = 1;
    }
    return stride;
}
export function startForAxis(beginMask, startIndices, strides, inputShape, axis, ellipsisMask) {
    // Begin with the specified index
    let start = startIndices[axis];
    const stride = strides[axis] || 1;
    // Check the axis bit from right of masked axes, or the begin index is not set
    // for the axis.
    if (beginMask & 1 << axis || ellipsisMask & 1 << axis || start == null) {
        if (stride > 0) {
            // Forward iteration - use the first element. These values will get
            // clamped below (Note: We could have set them to 0 and axis_size-1, but
            // use lowest() and max() to maintain symmetry with StopForAxis())
            start = Number.MIN_SAFE_INTEGER;
        }
        else {
            // Backward iteration - use the last element.
            start = Number.MAX_SAFE_INTEGER;
        }
    }
    // Handle negative indices
    const axisSize = inputShape[axis];
    if (start < 0) {
        start += axisSize;
    }
    // Clamping
    start = util.clamp(0, start, axisSize - 1);
    return start;
}
export function stopForAxis(endMask, stopIndices, strides, inputShape, axis, ellipsisMask) {
    // Begin with the specified index
    let stop = stopIndices[axis];
    const stride = strides[axis] || 1;
    // Check the axis bit from right of masked axes, or if the stop index is not
    // set for this axis.
    if (endMask & (1 << axis) || ellipsisMask & (1 << axis) || stop == null) {
        if (stride > 0) {
            // Forward iteration - use the last element. These values will get
            // clamped below
            stop = Number.MAX_SAFE_INTEGER;
        }
        else {
            // Backward iteration - use the first element.
            stop = Number.MIN_SAFE_INTEGER;
        }
    }
    // Handle negative indices
    const axisSize = inputShape[axis];
    if (stop < 0) {
        stop += axisSize;
    }
    // Clamping
    // Because the end index points one past the last element, we need slightly
    // different clamping ranges depending on the direction.
    if (stride > 0) {
        // Forward iteration
        stop = util.clamp(0, stop, axisSize);
    }
    else {
        // Backward iteration
        stop = util.clamp(-1, stop, axisSize - 1);
    }
    return stop;
}
/**
 * Returns true if the slice occupies a continous set of elements in the
 * 'flat' space.
 */
export function isSliceContinous(shape, begin, size) {
    // Index of the first axis that has size > 1.
    let firstNonOneAxis = size.length;
    for (let i = 0; i < size.length; i++) {
        if (size[i] > 1) {
            firstNonOneAxis = i;
            break;
        }
    }
    for (let i = firstNonOneAxis + 1; i < size.length; i++) {
        if (begin[i] > 0 || size[i] !== shape[i]) {
            return false;
        }
    }
    return true;
}
export function computeFlatOffset(begin, strides) {
    let flatOffset = begin.length > 0 ? begin[begin.length - 1] : 1;
    for (let i = 0; i < begin.length - 1; i++) {
        flatOffset += begin[i] * strides[i];
    }
    return flatOffset;
}
export function parseSliceParams(x, begin, size) {
    // The following logic allows for more ergonomic calls.
    let begin_;
    const xRank = x.shape.length;
    if (typeof begin === 'number') {
        begin_ = [begin, ...new Array(xRank - 1).fill(0)];
    }
    else if (begin.length < xRank) {
        begin_ = begin.concat(new Array(xRank - begin.length).fill(0));
    }
    else {
        begin_ = begin.slice();
    }
    begin_.forEach(d => {
        util.assert(d !== -1, () => 'slice() does not support negative begin indexing.');
    });
    let size_;
    if (size == null) {
        size_ = new Array(xRank).fill(-1);
    }
    else if (typeof size === 'number') {
        size_ = [size, ...new Array(xRank - 1).fill(-1)];
    }
    else if (size.length < xRank) {
        size_ = size.concat(new Array(xRank - size.length).fill(-1));
    }
    else {
        size_ = size;
    }
    size_ = size_.map((d, i) => {
        if (d >= 0) {
            return d;
        }
        else {
            util.assert(d === -1, () => `Negative size values should be exactly -1 but got ` +
                `${d} for the slice() size at index ${i}.`);
            return x.shape[i] - begin_[i];
        }
    });
    return [begin_, size_];
}
// Convert the slicing specification from a sparse representation to a dense
// representation. This means that all ellipses and newaxis are expanded out.
export function sliceInfo(xShape, begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask) {
    let stridesNonNull;
    if (strides == null) {
        stridesNonNull = new Array(begin.length);
        stridesNonNull.fill(1);
    }
    else {
        stridesNonNull = strides;
    }
    // Only one non-zero bit is allowed in ellipsisMask, which means ellipsisMask
    // is a power of 2. Use bit compares to ensure ellipsisMask is 0 or a power
    // of 2. When i is a power of 2, i & (i - 1) is always 0.
    // Also ref:
    // https://stackoverflow.com/questions/600293/how-to-check-if-a-number-is-a-power-of-2
    if (ellipsisMask != null && (ellipsisMask & (ellipsisMask - 1)) !== 0) {
        throw new Error('Multiple ellipses in slice is not allowed.');
    }
    // Step 1: Account for ellipsis and new axis.
    // Check for ellipsis and count how many non-newaxis there are after.
    let ellipsisSeen = false;
    const sparseSpec = {
        dims: stridesNonNull.length,
        numAddAxisAfterEllipsis: 0,
        begin: begin.slice(),
        end: end.slice(),
        strides: stridesNonNull.slice(),
        beginMask,
        endMask,
        ellipsisMask,
        newAxisMask,
        shrinkAxisMask
    };
    for (let i = 0; i < sparseSpec.dims; i++) {
        if (ellipsisSeen && ((1 << i) & newAxisMask) !== 0) {
            sparseSpec.numAddAxisAfterEllipsis++;
        }
        if ((1 << i) & ellipsisMask) {
            ellipsisSeen = true;
        }
    }
    // If no ellipsis insert one at the end.
    if (!ellipsisSeen) {
        sparseSpec.ellipsisMask |= (1 << sparseSpec.dims);
        sparseSpec.dims++; // this effects loop iteration below
    }
    // Step 2: Make a sparse spec into a full index spec.
    //
    // The sparse spec deos not correspond to the number of dimensions.
    // Make a dense spec that cooresponds to the number of dimensions.
    //
    // For example suppose foo[...,3:] on foo.shape = [2, 2, 3] then we need to
    // produce the missing beginMask for the first two dimensions i.e. from
    // beginMaskSpec = 0, endMaskSpec = 2, we achieve beginMask = 6 (110),
    // endMask = 7 (111).
    const denseSpec = {
        dims: xShape.length,
        beginMask: 0,
        endMask: 0,
        beginValid: false,
        endValid: false
    };
    buildDenseSpec(sparseSpec, denseSpec);
    // Step 3: Make implicit ranges (non-zero beginMasks and endMasks) explicit
    // and bounds check.
    let isIdentity = true;
    let sliceDim0 = true;
    let isSimpleSlice = true;
    const processingShape = [];
    const finalShape = [];
    for (let i = 0; i < xShape.length; ++i) {
        if (denseSpec.strides[i] === 0) {
            throw Error(`strides[${i}] must be non-zero`);
        }
        const shrinkI = !!(denseSpec.shrinkAxisMask & (1 << i));
        const dimI = xShape[i];
        if (dimI === -1) {
            processingShape.push(shrinkI ? 1 : -1);
            continue;
        }
        const masks = [denseSpec.beginMask & (1 << i), denseSpec.endMask & (1 << i)];
        const validRange = [
            denseSpec.strides[i] > 0 ? 0 : -1,
            denseSpec.strides[i] > 0 ? dimI : dimI - 1
        ];
        if (shrinkI && denseSpec.strides[i] <= 0) {
            throw Error('only stride 1 allowed on non-range indexing.');
        }
        isSimpleSlice = isSimpleSlice && (denseSpec.strides[i] === 1);
        const beginAndEndMasked = !!((denseSpec.beginMask & (1 << i)) && (denseSpec.endMask & (1 << i)));
        if (denseSpec.beginValid && denseSpec.endValid) {
            if (shrinkI) {
                // If we are shrinking, the end index is now possibly incorrect. In
                // particular foo[-1] produces sparseBegin = -1, sparseEnd = 0.
                // and canonical puts these to n-1 and 0, which implies a degenerate
                // interval. Fortunately, it is now safe to re-create end as begin + 1.
                const xFwd = denseSpec.begin[i] < 0 ? dimI + denseSpec.begin[i] :
                    denseSpec.begin[i];
                denseSpec.begin[i] = xFwd;
                denseSpec.end[i] = denseSpec.begin[i] + 1;
                if (xFwd < 0 || xFwd >= dimI) {
                    throw Error(`slice index ${denseSpec.begin[i]} of dimension ${i} out of bounds.`);
                }
            }
            else {
                denseSpec.begin[i] = canonical(denseSpec.begin[i], 0, denseSpec.strides[i], dimI, masks, validRange);
                denseSpec.end[i] = canonical(denseSpec.end[i], 1, denseSpec.strides[i], dimI, masks, validRange);
            }
            // Update optimization values
            const takeAllInDimension = denseSpec.strides[i] === 1 &&
                denseSpec.begin[i] === 0 && denseSpec.end[i] === dimI;
            isIdentity = isIdentity && takeAllInDimension;
            sliceDim0 = sliceDim0 &&
                ((i === 0 && denseSpec.strides[i] === 1) || takeAllInDimension);
        }
        else {
            isIdentity =
                isIdentity && ((denseSpec.strides[i] === 1) && beginAndEndMasked);
            sliceDim0 = sliceDim0 &&
                ((i === 0 && denseSpec.strides[i] === 1) || beginAndEndMasked);
        }
        // Compute the processing shape (the intermediate Eigen will produce)
        let intervalLength;
        let knownInterval = false;
        if (denseSpec.beginValid && denseSpec.endValid) {
            intervalLength = denseSpec.end[i] - denseSpec.begin[i];
            knownInterval = true;
        }
        else if (shrinkI) {
            // The dimension is still known as 1 for the processingShape, but will be
            // discarded for the final shape.
            intervalLength = 1;
            knownInterval = true;
        }
        else if (beginAndEndMasked) {
            // Even if we don't have values for begin or end, we do know that this
            // dimension covers the whole interval. If we have shape information for
            // this dimension, that tells us the interval length.
            if (dimI >= 0) {
                if (denseSpec.strides[i] < 0) {
                    intervalLength = -dimI;
                }
                else {
                    intervalLength = dimI;
                }
                knownInterval = true;
            }
        }
        if (knownInterval) {
            let sizeI;
            // Hold zero if the interval is degenerate, otherwise account for
            // remainder
            if (intervalLength === 0 ||
                ((intervalLength < 0) !== (denseSpec.strides[i] < 0))) {
                sizeI = 0;
            }
            else {
                sizeI = Math.trunc(intervalLength / denseSpec.strides[i]) +
                    (intervalLength % denseSpec.strides[i] !== 0 ? 1 : 0);
            }
            processingShape.push(sizeI);
        }
        else {
            processingShape.push(-1);
        }
    }
    // Step 4: Compute the final shape
    //
    // newAxis will increase dimension by 1 (with a one-size dimension)
    // slices like foo[3, ...] will reduce dimension by 1.
    // This cannot be done earlier, because it depends on Step 3.
    for (let denseDim = 0; denseDim < denseSpec.finalShapeGatherIndices.length; ++denseDim) {
        const gatherIndex = denseSpec.finalShapeGatherIndices[denseDim];
        if (gatherIndex >= 0) {
            finalShape.push(processingShape[gatherIndex]);
        }
        else if (gatherIndex === NEW_AXIS) {
            finalShape.push(1);
        }
    }
    const finalShapeSparse = finalShape.filter((dim, i) => denseSpec.finalShapeGatherIndices[i] !== NEW_AXIS);
    return {
        finalShapeSparse,
        finalShape,
        isIdentity,
        sliceDim0,
        isSimpleSlice,
        begin: denseSpec.begin,
        end: denseSpec.end,
        strides: denseSpec.strides
    };
}
function buildDenseSpec(sparse, dense) {
    dense.beginMask = 0;
    dense.endMask = 0;
    dense.shrinkAxisMask = 0;
    let fullIndex = 0;
    dense.beginValid = sparse.begin != null;
    dense.endValid = sparse.end != null;
    dense.begin = new Array(dense.dims);
    dense.end = new Array(dense.dims);
    dense.strides = new Array(dense.dims);
    dense.finalShapeGatherIndices = [];
    dense.finalShapeGatherIndicesSparse = [];
    dense.inputShapeGatherIndicesSparse = new Array(dense.dims);
    for (let i = 0; i < sparse.dims; i++) {
        if ((1 << i) & sparse.ellipsisMask) {
            // Only the bit that has ellipsis will fall in this condition.
            // Expand the ellipsis into the appropriate indices
            // Note: this only works because we guaranteed one ellipsis.
            const nextIndex = Math.min(dense.dims - (sparse.dims - i) + 1 + sparse.numAddAxisAfterEllipsis, dense.dims);
            for (; fullIndex < nextIndex; fullIndex++) {
                // newAxis aren't real axis so you have to skip.
                dense.begin[fullIndex] = 0;
                dense.end[fullIndex] = 0;
                dense.strides[fullIndex] = 1;
                dense.beginMask |= (1 << fullIndex);
                dense.endMask |= (1 << fullIndex);
                dense.finalShapeGatherIndices.push(fullIndex);
                dense.finalShapeGatherIndicesSparse.push(-1);
                dense.inputShapeGatherIndicesSparse[fullIndex] = i;
            }
        }
        else if ((1 << i) & sparse.newAxisMask) {
            // Only the bit that has newAxis will fall in this condition.
            dense.finalShapeGatherIndices.push(NEW_AXIS);
            dense.finalShapeGatherIndicesSparse.push(-1);
        }
        else {
            if (fullIndex === dense.begin.length) {
                throw Error(`Index out of range using input dim ${fullIndex}; input ` +
                    `has only ${dense.dims} dims, ${dense.begin.length}.`);
            }
            // Gather slicing spec into appropriate index.
            if (sparse.begin != null) {
                dense.begin[fullIndex] = sparse.begin[i];
            }
            if (sparse.end != null) {
                dense.end[fullIndex] = sparse.end[i];
            }
            dense.strides[fullIndex] = sparse.strides[i];
            if (sparse.beginMask & (1 << i)) {
                dense.beginMask |= (1 << fullIndex);
            }
            if (sparse.endMask & (1 << i)) {
                dense.endMask |= (1 << fullIndex);
            }
            // If shrink, record where to get the dimensionality from (i.e. newAxis)
            // creates a fake 1 size dimension. Also remember shrink axis (now in
            // dense form) so we can ignore dense.end below.
            if (sparse.shrinkAxisMask & (1 << i)) {
                dense.finalShapeGatherIndices.push(SHRINK_AXIS);
                dense.finalShapeGatherIndicesSparse.push(-1);
                dense.shrinkAxisMask |= (1 << fullIndex);
            }
            else {
                dense.finalShapeGatherIndices.push(fullIndex);
                // Remember that where in the sparse shape the dense dim comes from.
                dense.finalShapeGatherIndicesSparse.push(i);
            }
            dense.inputShapeGatherIndicesSparse[fullIndex] = i;
            fullIndex++;
        }
    }
}
function canonical(x, c, strideI, dimI, masks, validRange) {
    if (masks[c]) {
        return strideI > 0 ? validRange[c] : validRange[(c + 1) & 1];
    }
    else {
        const xFwd = x < 0 ? dimI + x : x; // make negative indices positive
        return xFwd < validRange[0] ? validRange[0] :
            xFwd > validRange[1] ? validRange[1] : xFwd;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2VfdXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3NsaWNlX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBR0gsT0FBTyxLQUFLLElBQUksTUFBTSxTQUFTLENBQUM7QUFFaEMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDcEIsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUE2RHZCLE1BQU0sVUFBVSxpQkFBaUIsQ0FDN0IsS0FBaUIsRUFBRSxLQUFlLEVBQUUsSUFBYztJQUNwRCxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUNyQyxJQUFJLENBQUMsTUFBTSxDQUNQLFNBQVMsS0FBSyxLQUFLLENBQUMsTUFBTSxFQUMxQixHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsU0FBUyxzQkFBc0IsS0FBSyxRQUFRO1FBQy9ELGdDQUFnQyxTQUFTLElBQUksQ0FBQyxDQUFDO0lBQ3ZELElBQUksQ0FBQyxNQUFNLENBQ1AsU0FBUyxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQ3pCLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixTQUFTLHFCQUFxQixJQUFJLFFBQVE7UUFDN0QsZ0NBQWdDLFNBQVMsSUFBSSxDQUFDLENBQUM7SUFFdkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUNsQyxJQUFJLENBQUMsTUFBTSxDQUNQLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFDcEMsR0FBRyxFQUFFLENBQUMsaUJBQWlCLFNBQVMsWUFBWSxDQUFDLFlBQVksQ0FBQyxJQUFJO1lBQzFELElBQUksS0FBSyxDQUFD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UyxDQUFDLENBQUM7Z0JBQzlDLG9FQUFvRTtnQkFDcEUsS0FBSyxDQUFDLDZCQUE2QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM3QztZQUNELEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkQsU0FBUyxFQUFFLENBQUM7U0FDYjtLQUNGO0FBQ0gsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUNkLENBQVMsRUFBRSxDQUFTLEVBQUUsT0FBZSxFQUFFLElBQVksRUFBRSxLQUFlLEVBQ3BFLFVBQW9CO0lBQ3RCLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ1osT0FBTyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztLQUM5RDtTQUFNO1FBQ0wsTUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUUsaUNBQWlDO1FBQ3JFLE9BQU8sSUFBSSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztLQUMzRTtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMSBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7VGVuc29ySW5mb30gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5cbmNvbnN0IE5FV19BWElTID0gLTI7XG5jb25zdCBTSFJJTktfQVhJUyA9IC0xO1xuXG4vLyBTcGFyc2Ugc2xpY2luZyBzcGVjaWZpY2F0aW9uXG4vLyBpZiBvbmUgZG9lcyBmb29bMzo1LCAuLi4sIC0zXSwgdGhlIGJlZ2luLCBlbmQgYW5kIHN0cmlkZXMgd2lsbCBoYXZlIGxlbmd0aFxuLy8gb2YgMy5cbmludGVyZmFjZSBTdHJpZGVkU2xpY2VTcGFyc2VTcGVjIHtcbiAgZGltczogbnVtYmVyO1xuICBudW1BZGRBeGlzQWZ0ZXJFbGxpcHNpczogbnVtYmVyO1xuICBiZWdpbjogbnVtYmVyW107XG4gIGVuZDogbnVtYmVyW107XG4gIHN0cmlkZXM6IG51bWJlcltdO1xuICBiZWdpbk1hc2s6IG51bWJlcjtcbiAgZW5kTWFzazogbnVtYmVyO1xuICBlbGxpcHNpc01hc2s6IG51bWJlcjtcbiAgbmV3QXhpc01hc2s6IG51bWJlcjtcbiAgc2hyaW5rQXhpc01hc2s6IG51bWJlcjtcbn1cblxuLy8gRGVuc2Ugc2xpY2luZyBzcGVjaWZpY2F0aW9uXG4vLyBhbGwgZWxsaXBzZXMgYW5kIG5ld2F4aXMgYXJlIGV4cGFuZGVkIG91dC4gU28gaWYgZm9vWzM6NSwgLi4uLCAtM10gd2hlcmUgZm9vXG4vLyBpcyAxMCBkaW1lbnNpb25hbCwgZWFjaCBhcnJheSBvZiBiZWdpbiwgZW5kLCBzdHJpZGVzIHdpbGwgaGF2ZSAxMCBlbnRyaWVzXG4vLyB3aGVyZSBhcyB0aGUgc3BhcnNlIGNhbiBoYXZlIGxlbmd0aCBsZXNzIHRoYW4gdGhlIHJhbmsgb2YgZm9vLlxuaW50ZXJmYWNlIFN0cmlkZWRTbGljZURlbnNlU3BlYyB7XG4gIGRpbXM6IG51bWJlcjtcbiAgYmVnaW5NYXNrPzogbnVtYmVyO1xuICBlbmRNYXNrPzogbnVtYmVyO1xuICBiZWdpblZhbGlkOiBib29sZWFuO1xuICBlbmRWYWxpZDogYm9vbGVhbjtcbiAgYmVnaW4/OiBudW1iZXJbXTtcbiAgZW5kPzogbnVtYmVyW107XG4gIHN0cmlkZXM/OiBudW1iZXJbXTtcbiAgLy8gVGhpcyBhcnJheSBoZWxwcyBjb25zdHJ1Y3QgdGhlIGZpbmFsIHNoYXBlIG9mIHRoZSBzbGljZS5cbiAgLy8gVGhlIGZpbmFsIHRlbnNvciBpcyByZWR1Y2VkIGluIHJhbmsgd2hlbmV2ZXIgYSBzaW5nbGUgaW5kZXggZS5nLiBmb29bM11cbiAgLy8gaXMgY2FsbGVkIGZvci4gVGhlIGZpbmFsIHRlbnNvciBpbmNyZWFzZXMgaW4gcmFuayB3aXRoIG5ld0F4aXMgZW50cmllcy5cbiAgLy8gSWYgYW4gaW5kZXggaW4gdGhpcyBhcnJheSBpcyBwb3NpdGl2ZSwgdGhlIHNpemUgb2YgdGhlIGRpbWVuc2lvbiBpc1xuICAvLyBvYnRhaW5lZCBmcm9tIGNhbm9uaWNhbCBlbmQtYmVnaW4uICBPdGhlcndpc2UsIGlmIGl0IGlzIGEgTkVXX0FYSVMsIGl0IHdpbGxcbiAgLy8gYmUgMS4gQSBzaHJ1bmsgZGltZW5zaW9uIGlzIHNraXBwZWQuXG4gIGZpbmFsU2hhcGVHYXRoZXJJbmRpY2VzPzogbnVtYmVyW107XG4gIC8vIFRoaXMgYXJyYXkgaGFzIHRoZSBzYW1lIHNpemUgYXMgZmluYWxTaGFwZUdhdGhlckluZGljZXMsIGJ1dCBpdCByZW1lbWJlcnNcbiAgLy8gdGhlIHNwYXJzZSBpbmRleCB0aGF0IGEgZGltZW5zaW9uIGNvbWVzIGZyb20sIGluc3RlYWQgb2YgZGVuc2UgaW5kZXguXG4gIC8vIEEgLTEgaW4gdGhpcyB2ZWN0b3IgbWVhbnMgdGhlIGluZGV4IGlzIG5vdCBmcm9tIHRoZSBzcGFyc2UgaW5wdXQuXG4gIGZpbmFsU2hhcGVHYXRoZXJJbmRpY2VzU3BhcnNlPzogbnVtYmVyW107XG4gIGlucHV0U2hhcGVHYXRoZXJJbmRpY2VzU3BhcnNlPzogbnVtYmVyW107XG4gIC8vIFRoZSBkZW5zZSBpbmRleGVkIHNocmluayBtYXNrIGlzIHdoaWNoIHByb2Nlc3NpbmcgZGltZW5zaW9ucyBzaG91bGQgYmVcbiAgLy8gc2hydW5rLiBGb3IgZXhhbXBsZSwgaWYgZm9vLnNoYXBlID0gWzEwLCAxMCwgMTAsIDEwXSwgZm9vWzMsIC4uLiwgNV0gaGFzXG4gIC8vIHNwYXJzZVNocmlua0F4aXNNYXNrIG9mIDUgKDAxMDEpIGFuZCBkZW5zZVNocmlua0F4aXNNYXNrIG9mIDkgKDEwMDEpLFxuICAvLyB5aWVsZGluZyBhIGZpbmFsIHNoYXBlIFsxMCwgMTBdLlxuICBzaHJpbmtBeGlzTWFzaz86IG51bWJlcjtcbn1cblxuZXhwb3J0IHR5cGUgU2xpY2VJbmZvID0ge1xuICBmaW5hbFNoYXBlU3BhcnNlOiBudW1iZXJbXSxcbiAgZmluYWxTaGFwZTogbnVtYmVyW10sXG4gIGlzSWRlbnRpdHk6IGJvb2xlYW4sXG4gIHNsaWNlRGltMDogYm9vbGVhbixcbiAgaXNTaW1wbGVTbGljZTogYm9vbGVhbixcbiAgYmVnaW46IG51bWJlcltdLFxuICBlbmQ6IG51bWJlcltdLFxuICBzdHJpZGVzOiBudW1iZXJbXVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydFBhcmFtc1ZhbGlkKFxuICAgIGlucHV0OiBUZW5zb3JJbmZvLCBiZWdpbjogbnVtYmVyW10sIHNpemU6IG51bWJlcltdKTogdm9pZCB7XG4gIGNvbnN0IGlucHV0UmFuayA9IGlucHV0LnNoYXBlLmxlbmd0aDtcbiAgdXRpbC5hc3NlcnQoXG4gICAgICBpbnB1dFJhbmsgPT09IGJlZ2luLmxlbmd0aCxcbiAgICAgICgpID0+IGBFcnJvciBpbiBzbGljZSR7aW5wdXRSYW5rfUQ6IExlbmd0aCBvZiBiZWdpbiAke2JlZ2lufSBtdXN0IGAgK1xuICAgICAgICAgIGBtYXRjaCB0aGUgcmFuayBvZiB0aGUgYXJyYXkgKCR7aW5wdXRSYW5rfSkuYCk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgaW5wdXRSYW5rID09PSBzaXplLmxlbmd0aCxcbiAgICAgICgpID0+IGBFcnJvciBpbiBzbGljZSR7aW5wdXRSYW5rfUQ6IExlbmd0aCBvZiBzaXplICR7c2l6ZX0gbXVzdCBgICtcbiAgICAgICAgICBgbWF0Y2ggdGhlIHJhbmsgb2YgdGhlIGFycmF5ICgke2lucHV0UmFua30pLmApO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRSYW5rOyArK2kpIHtcbiAgICB1dGlsLmFzc2VydChcbiAgICAgICAgYmVnaW5baV0gKyBzaXplW2ldIDw9IGlucHV0LnNoYXBlW2ldLFxuICAgICAgICAoKSA9PiBgRXJyb3IgaW4gc2xpY2Uke2lucHV0UmFua31EOiBiZWdpblske2l9XSArIHNpemVbJHtpfV0gYCArXG4gICAgICAgICAgICBgKCR7YmVnaW5baV0gKyBzaXplW2ldfSkgd291bGQgb3ZlcmZsb3cgaW5wdXQuc2hhcGVbJHtpfV0gKCR7XG4gICAgICAgICAgICAgICAgICBpbnB1dC5zaGFwZVtpXX0pYCk7XG4gIH1cbn1cblxuLyoqIENvbnZlcnRzIGEgYmluYXJ5IG1hc2sgdG8gYW4gYXJyYXkgb2YgYXhlcy4gVXNlZCBpbiBzdHJpZGVkU2xpY2UoKS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXNrVG9BeGVzKG1hc2s6IG51bWJlcik6IG51bWJlcltdIHtcbiAgY29uc3QgYXhlcyA9IFtdO1xuICBsZXQgYXhpcyA9IDA7XG4gIHdoaWxlIChtYXNrID4gMCkge1xuICAgIGlmIChtYXNrICYgMSkge1xuICAgICAgYXhlcy5wdXNoKGF4aXMpO1xuICAgIH1cbiAgICBtYXNrIC89IDI7XG4gICAgYXhpcysrO1xuICB9XG4gIHJldHVybiBheGVzO1xufVxuXG4vKiogQ29tcHV0ZXMgdGhlIG91dHB1dCBzaGFwZSBnaXZlbiB0aGUgc3RyaWRlZCBzbGljZSBwYXJhbXMuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZU91dFNoYXBlKFxuICAgIGJlZ2luOiBudW1iZXJbXSwgZW5kOiBudW1iZXJbXSwgc3RyaWRlczogbnVtYmVyW10pOiBudW1iZXJbXSB7XG4gIGNvbnN0IHNpemUgPSBbXTtcbiAgZm9yIChsZXQgYXhpcyA9IDA7IGF4aXMgPCBiZWdpbi5sZW5ndGg7IGF4aXMrKykge1xuICAgIHNpemVbYXhpc10gPSBNYXRoLmNlaWwoKGVuZFtheGlzXSAtIGJlZ2luW2F4aXNdKSAvIHN0cmlkZXNbYXhpc10pO1xuICB9XG4gIHJldHVybiBzaXplO1xufVxuXG4vLyBDcmVhdGVzIGZ1bGwgc2VsZWN0aW9uIGF0IHRoZSBlbGlkZWQgZGltZW5zaW9ucy4gSWYgdGhlIGRpbWVuc2lvbiBtYXRjaGVzXG4vLyB0aGUgZWxsaXBzaXMgbWFzaywgb3ZlcnJpZGUgdGhlIGN1cnJlbnQgc3RyaWRlIHZhbHVlLiBPdGhlcndpc2UsIGluc2VydC5cbmV4cG9ydCBmdW5jdGlvbiBzdHJpZGVzV2l0aEVsaWRlZERpbXMoXG4gICAgc3RyaWRlczogbnVtYmVyW10sIGVsbGlwc2lzSW5zZXJ0aW9uSW5kZXg6IG51bWJlciwgbnVtRWxpZGVkQXhlczogbnVtYmVyLFxuICAgIGlucHV0U2hhcGU6IG51bWJlcltdKTogbnVtYmVyW10ge1xuICBjb25zdCBuZXdTdHJpZGVzID0gWy4uLnN0cmlkZXNdO1xuICBmb3IgKGxldCBpID0gbmV3U3RyaWRlcy5sZW5ndGg7IGkgPCBpbnB1dFNoYXBlLmxlbmd0aDsgaSsrKSB7XG4gICAgbmV3U3RyaWRlcy5wdXNoKDEpO1xuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtRWxpZGVkQXhlczsgaSsrKSB7XG4gICAgaWYgKGkgPT09IDApIHtcbiAgICAgIG5ld1N0cmlkZXNbZWxsaXBzaXNJbnNlcnRpb25JbmRleF0gPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdTdHJpZGVzLnNwbGljZShcbiAgICAgICAgICBlbGxpcHNpc0luc2VydGlvbkluZGV4LCAwIC8qIG51bSBlbGVtZW50cyB0byBkZWxldGUgKi8sXG4gICAgICAgICAgMSAvKiBlbGVtZW50IHRvIGFkZCAqLyk7XG4gICAgICBuZXdTdHJpZGVzLnBvcCgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3U3RyaWRlcztcbn1cblxuZnVuY3Rpb24gdW5ub3JtYWxpemVBeGlzKFxuICAgIGVsbGlwc2lzSW5zZXJ0aW9uSW5kZXg6IG51bWJlciwgbnVtRWxpZGVkQXhlczogbnVtYmVyLFxuICAgIG5vcm1hbGl6ZWRBeGlzOiBudW1iZXIpOiBudW1iZXIge1xuICBpZiAobm9ybWFsaXplZEF4aXMgPD0gZWxsaXBzaXNJbnNlcnRpb25JbmRleCkge1xuICAgIHJldHVybiBub3JtYWxpemVkQXhpcztcbiAgfVxuXG4gIHJldHVybiBub3JtYWxpemVkQXhpcyAtIChudW1FbGlkZWRBeGVzIC0gMSk7XG59XG5cbmZ1bmN0aW9uIGdldEVsaWRlZEF4ZXMobnVtRWxpZGVkQXhlczogbnVtYmVyLCBlbGxpcHNpc0luc2VydGlvbkluZGV4OiBudW1iZXIpIHtcbiAgY29uc3QgZWxpZGVkQXhlcyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUVsaWRlZEF4ZXM7IGkrKykge1xuICAgIGVsaWRlZEF4ZXMucHVzaChlbGxpcHNpc0luc2VydGlvbkluZGV4ICsgaSk7XG4gIH1cbiAgcmV0dXJuIGVsaWRlZEF4ZXM7XG59XG5cbi8vIE5vcm1hbGl6ZSB0aGUgc3RhcnQsIGVuZCBhbmQgc3RyaWRlcy5cbmV4cG9ydCBmdW5jdGlvbiBnZXROb3JtYWxpemVkQXhlcyhcbiAgICBpbnB1dFNoYXBlOiBudW1iZXJbXSwgZWxsaXBzaXNBeGVzOiBudW1iZXJbXSwgbnVtSW50ZXJwb2xhdGVkQXhlczogbnVtYmVyLFxuICAgIGJlZ2luOiBudW1iZXJbXSwgZW5kOiBudW1iZXJbXSwgc3RyaWRlczogbnVtYmVyW10sIGJlZ2luTWFzazogbnVtYmVyLFxuICAgIGVuZE1hc2s6IG51bWJlcixcbiAgICBlbGxpcHNpc01hc2s6IG51bWJlcik6IHtiZWdpbjogbnVtYmVyW10sIGVuZDogbnVtYmVyW10sIHN0cmlkZXM6IG51bWJlcltdfSB7XG4gIGNvbnN0IGlucHV0UmFuayA9IGlucHV0U2hhcGUubGVuZ3RoO1xuICBsZXQgbm9ybWFsaXplZEJlZ2luID0gbmV3IEFycmF5KGlucHV0UmFuayksXG4gICAgICBub3JtYWxpemVkRW5kID0gbmV3IEFycmF5KGlucHV0UmFuayksXG4gICAgICBub3JtYWxpemVkU3RyaWRlcyA9IG5ldyBBcnJheShpbnB1dFJhbmspO1xuICBpZiAoZWxsaXBzaXNBeGVzLmxlbmd0aCAmJiBudW1JbnRlcnBvbGF0ZWRBeGVzID4gMCkge1xuICAgIGNvbnN0IGZ1bGxJbmRleCA9IGVsbGlwc2lzQXhlc1swXTtcblxuICAgIC8vIFRoZSBlbGxpcHNpcyBhcHBsaWVzIHRvIHRoZSBtYXNrZWQgaW5kZXggYXMgd2VsbCBhcyBhbnkgZGltZW5zaW9uc1xuICAgIC8vIHRoYXQgYXJlIGludGVycG9sYXRlZC5cbiAgICBjb25zdCBudW1FbGlkZWRBeGVzID0gbnVtSW50ZXJwb2xhdGVkQXhlcyArIDE7XG4gICAgbm9ybWFsaXplZEJlZ2luID0gc3RhcnRJbmRpY2VzV2l0aEVsaWRlZERpbXMoXG4gICAgICAgIGJlZ2luTWFzaywgZnVsbEluZGV4LCBudW1FbGlkZWRBeGVzLCBiZWdpbiwgaW5wdXRTaGFwZSk7XG4gICAgbm9ybWFsaXplZEVuZCA9IHN0b3BJbmRpY2VzV2l0aEVsaWRlZERpbXMoXG4gICAgICAgIGVuZE1hc2ssIGZ1bGxJbmRleCwgbnVtRWxpZGVkQXhlcywgZW5kLCBpbnB1dFNoYXBlKTtcbiAgICBub3JtYWxpemVkU3RyaWRlcyA9XG4gICAgICAgIHN0cmlkZXNXaXRoRWxpZGVkRGltcyhzdHJpZGVzLCBmdWxsSW5kZXgsIG51bUVsaWRlZEF4ZXMsIGlucHV0U2hhcGUpO1xuICB9IGVsc2Uge1xuICAgIGZvciAobGV0IGF4aXMgPSAwOyBheGlzIDwgaW5wdXRSYW5rOyBheGlzKyspIHtcbiAgICAgIG5vcm1hbGl6ZWRCZWdpbltheGlzXSA9IHN0YXJ0Rm9yQXhpcyhcbiAgICAgICAgICBiZWdpbk1hc2ssIGJlZ2luLCBzdHJpZGVzLCBpbnB1dFNoYXBlLCBheGlzLCBlbGxpcHNpc01hc2spO1xuICAgICAgbm9ybWFsaXplZEVuZFtheGlzXSA9XG4gICAgICAgICAgc3RvcEZvckF4aXMoZW5kTWFzaywgZW5kLCBzdHJpZGVzLCBpbnB1dFNoYXBlLCBheGlzLCBlbGxpcHNpc01hc2spO1xuICAgICAgbm9ybWFsaXplZFN0cmlkZXNbYXhpc10gPSBzdHJpZGVzRm9yQXhpcyhzdHJpZGVzLCBheGlzLCBlbGxpcHNpc01hc2spO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgYmVnaW46IG5vcm1hbGl6ZWRCZWdpbixcbiAgICBlbmQ6IG5vcm1hbGl6ZWRFbmQsXG4gICAgc3RyaWRlczogbm9ybWFsaXplZFN0cmlkZXNcbiAgfTtcbn1cblxuLy8gQ3JlYXRlcyBmdWxsIHNlbGVjdGlvbiBhdCB0aGUgZWxpZGVkIGRpbWVuc2lvbnMuIElmIHRoZSBkaW1lbnNpb24gbWF0Y2hlc1xuLy8gdGhlIGVsbGlwc2lzIG1hc2ssIG92ZXJyaWRlIHRoZSBjdXJyZW50IHN0YXJ0IHZhbHVlLiBPdGhlcndpc2UsIGluc2VydC5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydEluZGljZXNXaXRoRWxpZGVkRGltcyhcbiAgICBiZWdpbk1hc2s6IG51bWJlciwgZWxsaXBzaXNJbnNlcnRpb25JbmRleDogbnVtYmVyLCBudW1FbGlkZWRBeGVzOiBudW1iZXIsXG4gICAgb3JpZ2luYWxCZWdpbjogbnVtYmVyW10sIGlucHV0U2hhcGU6IG51bWJlcltdKTogbnVtYmVyW10ge1xuICBjb25zdCBuZXdJbmRpY2VzID0gWy4uLmlucHV0U2hhcGVdO1xuICBjb25zdCBlbGlkZWRBeGVzID0gZ2V0RWxpZGVkQXhlcyhudW1FbGlkZWRBeGVzLCBlbGxpcHNpc0luc2VydGlvbkluZGV4KTtcblxuICBmb3IgKGxldCBheGlzID0gMDsgYXhpcyA8IG5ld0luZGljZXMubGVuZ3RoOyBheGlzKyspIHtcbiAgICBpZiAoZWxpZGVkQXhlcy5pbmRleE9mKGF4aXMpID4gLTEpIHtcbiAgICAgIG5ld0luZGljZXNbYXhpc10gPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBvcmlnaW5hbEF4aXMgPVxuICAgICAgICAgIHVubm9ybWFsaXplQXhpcyhlbGxpcHNpc0luc2VydGlvbkluZGV4LCBudW1FbGlkZWRBeGVzLCBheGlzKTtcbiAgICAgIGxldCBvcmlnaW5hbFZhbHVlID0gb3JpZ2luYWxCZWdpbltvcmlnaW5hbEF4aXNdO1xuICAgICAgaWYgKGJlZ2luTWFzayAmIDEgPDwgb3JpZ2luYWxBeGlzKSB7XG4gICAgICAgIG9yaWdpbmFsVmFsdWUgPSAwO1xuICAgICAgfVxuXG4gICAgICBuZXdJbmRpY2VzW2F4aXNdID0gb3JpZ2luYWxWYWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5ld0luZGljZXM7XG59XG5cbi8vIENyZWF0ZXMgZnVsbCBzZWxlY3Rpb24gYXQgdGhlIGVsaWRlZCBkaW1lbnNpb25zLiBJZiB0aGUgZGltZW5zaW9uIG1hdGNoZXNcbi8vIHRoZSBlbGxpcHNpcyBtYXNrLCBvdmVycmlkZSB0aGUgY3VycmVudCBzdG9wIHZhbHVlLiBPdGhlcndpc2UsIGluc2VydC5cbmV4cG9ydCBmdW5jdGlvbiBzdG9wSW5kaWNlc1dpdGhFbGlkZWREaW1zKFxuICAgIGVuZE1hc2s6IG51bWJlciwgZWxsaXBzaXNJbnNlcnRpb25JbmRleDogbnVtYmVyLCBudW1FbGlkZWRBeGVzOiBudW1iZXIsXG4gICAgb3JpZ2luYWxFbmQ6IG51bWJlcltdLCBpbnB1dFNoYXBlOiBudW1iZXJbXSk6IG51bWJlcltdIHtcbiAgY29uc3QgbmV3SW5kaWNlcyA9IFsuLi5pbnB1dFNoYXBlXTtcbiAgY29uc3QgZWxpZGVkQXhlcyA9IGdldEVsaWRlZEF4ZXMobnVtRWxpZGVkQXhlcywgZWxsaXBzaXNJbnNlcnRpb25JbmRleCk7XG5cbiAgZm9yIChsZXQgYXhpcyA9IDA7IGF4aXMgPCBuZXdJbmRpY2VzLmxlbmd0aDsgYXhpcysrKSB7XG4gICAgaWYgKGVsaWRlZEF4ZXMuaW5kZXhPZihheGlzKSA+IC0xKSB7XG4gICAgICBuZXdJbmRpY2VzW2F4aXNdID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG9yaWdpbmFsQXhpcyA9XG4gICAgICAgICAgdW5ub3JtYWxpemVBeGlzKGVsbGlwc2lzSW5zZXJ0aW9uSW5kZXgsIG51bUVsaWRlZEF4ZXMsIGF4aXMpO1xuICAgICAgbGV0IG9yaWdpbmFsVmFsdWUgPSBvcmlnaW5hbEVuZFtvcmlnaW5hbEF4aXNdO1xuICAgICAgaWYgKGVuZE1hc2sgJiAxIDw8IG9yaWdpbmFsQXhpcykge1xuICAgICAgICBvcmlnaW5hbFZhbHVlID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICB9XG4gICAgICBuZXdJbmRpY2VzW2F4aXNdID0gb3JpZ2luYWxWYWx1ZTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld0luZGljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBIYW5kbGUgbmVnYXRpdmUgaW5kaWNlc1xuICAgIGNvbnN0IGF4aXNTaXplID0gaW5wdXRTaGFwZVtpXTtcbiAgICBpZiAobmV3SW5kaWNlc1tpXSA8IDApIHtcbiAgICAgIG5ld0luZGljZXNbaV0gKz0gYXhpc1NpemU7XG4gICAgfVxuICAgIG5ld0luZGljZXNbaV0gPSB1dGlsLmNsYW1wKDAsIG5ld0luZGljZXNbaV0sIGlucHV0U2hhcGVbaV0pO1xuICB9XG4gIHJldHVybiBuZXdJbmRpY2VzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RyaWRlc0ZvckF4aXMoXG4gICAgc3RyaWRlczogbnVtYmVyW10sIGF4aXM6IG51bWJlciwgZWxsaXBzaXNNYXNrOiBudW1iZXIpOiBudW1iZXIge1xuICBsZXQgc3RyaWRlID0gc3RyaWRlc1theGlzXTtcbiAgaWYgKGVsbGlwc2lzTWFzayAmICgxIDw8IGF4aXMpIHx8IHN0cmlkZSA9PSBudWxsKSB7XG4gICAgc3RyaWRlID0gMTtcbiAgfVxuXG4gIHJldHVybiBzdHJpZGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydEZvckF4aXMoXG4gICAgYmVnaW5NYXNrOiBudW1iZXIsIHN0YXJ0SW5kaWNlczogbnVtYmVyW10sIHN0cmlkZXM6IG51bWJlcltdLFxuICAgIGlucHV0U2hhcGU6IG51bWJlcltdLCBheGlzOiBudW1iZXIsIGVsbGlwc2lzTWFzazogbnVtYmVyKTogbnVtYmVyIHtcbiAgLy8gQmVnaW4gd2l0aCB0aGUgc3BlY2lmaWVkIGluZGV4XG4gIGxldCBzdGFydCA9IHN0YXJ0SW5kaWNlc1theGlzXTtcbiAgY29uc3Qgc3RyaWRlID0gc3RyaWRlc1theGlzXSB8fCAxO1xuXG4gIC8vIENoZWNrIHRoZSBheGlzIGJpdCBmcm9tIHJpZ2h0IG9mIG1hc2tlZCBheGVzLCBvciB0aGUgYmVnaW4gaW5kZXggaXMgbm90IHNldFxuICAvLyBmb3IgdGhlIGF4aXMuXG4gIGlmIChiZWdpbk1hc2sgJiAxIDw8IGF4aXMgfHwgZWxsaXBzaXNNYXNrICYgMSA8PCBheGlzIHx8IHN0YXJ0ID09IG51bGwpIHtcbiAgICBpZiAoc3RyaWRlID4gMCkge1xuICAgICAgLy8gRm9yd2FyZCBpdGVyYXRpb24gLSB1c2UgdGhlIGZpcnN0IGVsZW1lbnQuIFRoZXNlIHZhbHVlcyB3aWxsIGdldFxuICAgICAgLy8gY2xhbXBlZCBiZWxvdyAoTm90ZTogV2UgY291bGQgaGF2ZSBzZXQgdGhlbSB0byAwIGFuZCBheGlzX3NpemUtMSwgYnV0XG4gICAgICAvLyB1c2UgbG93ZXN0KCkgYW5kIG1heCgpIHRvIG1haW50YWluIHN5bW1ldHJ5IHdpdGggU3RvcEZvckF4aXMoKSlcbiAgICAgIHN0YXJ0ID0gTnVtYmVyLk1JTl9TQUZFX0lOVEVHRVI7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEJhY2t3YXJkIGl0ZXJhdGlvbiAtIHVzZSB0aGUgbGFzdCBlbGVtZW50LlxuICAgICAgc3RhcnQgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICB9XG4gIH1cblxuICAvLyBIYW5kbGUgbmVnYXRpdmUgaW5kaWNlc1xuICBjb25zdCBheGlzU2l6ZSA9IGlucHV0U2hhcGVbYXhpc107XG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCArPSBheGlzU2l6ZTtcbiAgfVxuXG4gIC8vIENsYW1waW5nXG4gIHN0YXJ0ID0gdXRpbC5jbGFtcCgwLCBzdGFydCwgYXhpc1NpemUgLSAxKTtcblxuICByZXR1cm4gc3RhcnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdG9wRm9yQXhpcyhcbiAgICBlbmRNYXNrOiBudW1iZXIsIHN0b3BJbmRpY2VzOiBudW1iZXJbXSwgc3RyaWRlczogbnVtYmVyW10sXG4gICAgaW5wdXRTaGFwZTogbnVtYmVyW10sIGF4aXM6IG51bWJlciwgZWxsaXBzaXNNYXNrOiBudW1iZXIpOiBudW1iZXIge1xuICAvLyBCZWdpbiB3aXRoIHRoZSBzcGVjaWZpZWQgaW5kZXhcbiAgbGV0IHN0b3AgPSBzdG9wSW5kaWNlc1theGlzXTtcbiAgY29uc3Qgc3RyaWRlID0gc3RyaWRlc1theGlzXSB8fCAxO1xuXG4gIC8vIENoZWNrIHRoZSBheGlzIGJpdCBmcm9tIHJpZ2h0IG9mIG1hc2tlZCBheGVzLCBvciBpZiB0aGUgc3RvcCBpbmRleCBpcyBub3RcbiAgLy8gc2V0IGZvciB0aGlzIGF4aXMuXG4gIGlmIChlbmRNYXNrICYgKDEgPDwgYXhpcykgfHwgZWxsaXBzaXNNYXNrICYgKDEgPDwgYXhpcykgfHwgc3RvcCA9PSBudWxsKSB7XG4gICAgaWYgKHN0cmlkZSA+IDApIHtcbiAgICAgIC8vIEZvcndhcmQgaXRlcmF0aW9uIC0gdXNlIHRoZSBsYXN0IGVsZW1lbnQuIFRoZXNlIHZhbHVlcyB3aWxsIGdldFxuICAgICAgLy8gY2xhbXBlZCBiZWxvd1xuICAgICAgc3RvcCA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBCYWNrd2FyZCBpdGVyYXRpb24gLSB1c2UgdGhlIGZpcnN0IGVsZW1lbnQuXG4gICAgICBzdG9wID0gTnVtYmVyLk1JTl9TQUZFX0lOVEVHRVI7XG4gICAgfVxuICB9XG5cbiAgLy8gSGFuZGxlIG5lZ2F0aXZlIGluZGljZXNcbiAgY29uc3QgYXhpc1NpemUgPSBpbnB1dFNoYXBlW2F4aXNdO1xuICBpZiAoc3RvcCA8IDApIHtcbiAgICBzdG9wICs9IGF4aXNTaXplO1xuICB9XG5cbiAgLy8gQ2xhbXBpbmdcbiAgLy8gQmVjYXVzZSB0aGUgZW5kIGluZGV4IHBvaW50cyBvbmUgcGFzdCB0aGUgbGFzdCBlbGVtZW50LCB3ZSBuZWVkIHNsaWdodGx5XG4gIC8vIGRpZmZlcmVudCBjbGFtcGluZyByYW5nZXMgZGVwZW5kaW5nIG9uIHRoZSBkaXJlY3Rpb24uXG4gIGlmIChzdHJpZGUgPiAwKSB7XG4gICAgLy8gRm9yd2FyZCBpdGVyYXRpb25cbiAgICBzdG9wID0gdXRpbC5jbGFtcCgwLCBzdG9wLCBheGlzU2l6ZSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQmFja3dhcmQgaXRlcmF0aW9uXG4gICAgc3RvcCA9IHV0aWwuY2xhbXAoLTEsIHN0b3AsIGF4aXNTaXplIC0gMSk7XG4gIH1cblxuICByZXR1cm4gc3RvcDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHNsaWNlIG9jY3VwaWVzIGEgY29udGlub3VzIHNldCBvZiBlbGVtZW50cyBpbiB0aGVcbiAqICdmbGF0JyBzcGFjZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2xpY2VDb250aW5vdXMoXG4gICAgc2hhcGU6IG51bWJlcltdLCBiZWdpbjogbnVtYmVyW10sIHNpemU6IG51bWJlcltdKSB7XG4gIC8vIEluZGV4IG9mIHRoZSBmaXJzdCBheGlzIHRoYXQgaGFzIHNpemUgPiAxLlxuICBsZXQgZmlyc3ROb25PbmVBeGlzID0gc2l6ZS5sZW5ndGg7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzaXplW2ldID4gMSkge1xuICAgICAgZmlyc3ROb25PbmVBeGlzID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IGkgPSBmaXJzdE5vbk9uZUF4aXMgKyAxOyBpIDwgc2l6ZS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChiZWdpbltpXSA+IDAgfHwgc2l6ZVtpXSAhPT0gc2hhcGVbaV0pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlRmxhdE9mZnNldChiZWdpbjogbnVtYmVyW10sIHN0cmlkZXM6IG51bWJlcltdKTogbnVtYmVyIHtcbiAgbGV0IGZsYXRPZmZzZXQgPSBiZWdpbi5sZW5ndGggPiAwID8gYmVnaW5bYmVnaW4ubGVuZ3RoIC0gMV0gOiAxO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJlZ2luLmxlbmd0aCAtIDE7IGkrKykge1xuICAgIGZsYXRPZmZzZXQgKz0gYmVnaW5baV0gKiBzdHJpZGVzW2ldO1xuICB9XG4gIHJldHVybiBmbGF0T2Zmc2V0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTbGljZVBhcmFtcyhcbiAgICB4OiBUZW5zb3JJbmZvLCBiZWdpbjogbnVtYmVyfG51bWJlcltdLCBzaXplPzogbnVtYmVyfG51bWJlcltdKSB7XG4gIC8vIFRoZSBmb2xsb3dpbmcgbG9naWMgYWxsb3dzIGZvciBtb3JlIGVyZ29ub21pYyBjYWxscy5cbiAgbGV0IGJlZ2luXzogbnVtYmVyW107XG4gIGNvbnN0IHhSYW5rID0geC5zaGFwZS5sZW5ndGg7XG4gIGlmICh0eXBlb2YgYmVnaW4gPT09ICdudW1iZXInKSB7XG4gICAgYmVnaW5fID0gW2JlZ2luLCAuLi5uZXcgQXJyYXkoeFJhbmsgLSAxKS5maWxsKDApXTtcbiAgfSBlbHNlIGlmIChiZWdpbi5sZW5ndGggPCB4UmFuaykge1xuICAgIGJlZ2luXyA9IGJlZ2luLmNvbmNhdChuZXcgQXJyYXkoeFJhbmsgLSBiZWdpbi5sZW5ndGgpLmZpbGwoMCkpO1xuICB9IGVsc2Uge1xuICAgIGJlZ2luXyA9IGJlZ2luLnNsaWNlKCk7XG4gIH1cbiAgYmVnaW5fLmZvckVhY2goZCA9PiB7XG4gICAgdXRpbC5hc3NlcnQoXG4gICAgICAgIGQgIT09IC0xLCAoKSA9PiAnc2xpY2UoKSBkb2VzIG5vdCBzdXBwb3J0IG5lZ2F0aXZlIGJlZ2luIGluZGV4aW5nLicpO1xuICB9KTtcbiAgbGV0IHNpemVfOiBudW1iZXJbXTtcbiAgaWYgKHNpemUgPT0gbnVsbCkge1xuICAgIHNpemVfID0gbmV3IEFycmF5KHhSYW5rKS5maWxsKC0xKTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygc2l6ZSA9PT0gJ251bWJlcicpIHtcbiAgICBzaXplXyA9IFtzaXplLCAuLi5uZXcgQXJyYXkoeFJhbmsgLSAxKS5maWxsKC0xKV07XG4gIH0gZWxzZSBpZiAoc2l6ZS5sZW5ndGggPCB4UmFuaykge1xuICAgIHNpemVfID0gc2l6ZS5jb25jYXQobmV3IEFycmF5KHhSYW5rIC0gc2l6ZS5sZW5ndGgpLmZpbGwoLTEpKTtcbiAgfSBlbHNlIHtcbiAgICBzaXplXyA9IHNpemU7XG4gIH1cbiAgc2l6ZV8gPSBzaXplXy5tYXAoKGQsIGkpID0+IHtcbiAgICBpZiAoZCA+PSAwKSB7XG4gICAgICByZXR1cm4gZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdXRpbC5hc3NlcnQoXG4gICAgICAgICAgZCA9PT0gLTEsXG4gICAgICAgICAgKCkgPT4gYE5lZ2F0aXZlIHNpemUgdmFsdWVzIHNob3VsZCBiZSBleGFjdGx5IC0xIGJ1dCBnb3QgYCArXG4gICAgICAgICAgICAgIGAke2R9IGZvciB0aGUgc2xpY2UoKSBzaXplIGF0IGluZGV4ICR7aX0uYCk7XG4gICAgICByZXR1cm4geC5zaGFwZVtpXSAtIGJlZ2luX1tpXTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gW2JlZ2luXywgc2l6ZV9dO1xufVxuXG4vLyBDb252ZXJ0IHRoZSBzbGljaW5nIHNwZWNpZmljYXRpb24gZnJvbSBhIHNwYXJzZSByZXByZXNlbnRhdGlvbiB0byBhIGRlbnNlXG4vLyByZXByZXNlbnRhdGlvbi4gVGhpcyBtZWFucyB0aGF0IGFsbCBlbGxpcHNlcyBhbmQgbmV3YXhpcyBhcmUgZXhwYW5kZWQgb3V0LlxuZXhwb3J0IGZ1bmN0aW9uIHNsaWNlSW5mbyhcbiAgICB4U2hhcGU6IG51bWJlcltdLCBiZWdpbjogbnVtYmVyW10sIGVuZDogbnVtYmVyW10sIHN0cmlkZXM6IG51bWJlcltdLFxuICAgIGJlZ2luTWFzazogbnVtYmVyLCBlbmRNYXNrOiBudW1iZXIsIGVsbGlwc2lzTWFzazogbnVtYmVyLFxuICAgIG5ld0F4aXNNYXNrOiBudW1iZXIsIHNocmlua0F4aXNNYXNrOiBudW1iZXIpOiBTbGljZUluZm8ge1xuICBsZXQgc3RyaWRlc05vbk51bGw7XG4gIGlmIChzdHJpZGVzID09IG51bGwpIHtcbiAgICBzdHJpZGVzTm9uTnVsbCA9IG5ldyBBcnJheShiZWdpbi5sZW5ndGgpO1xuICAgIHN0cmlkZXNOb25OdWxsLmZpbGwoMSk7XG4gIH0gZWxzZSB7XG4gICAgc3RyaWRlc05vbk51bGwgPSBzdHJpZGVzO1xuICB9XG5cbiAgLy8gT25seSBvbmUgbm9uLXplcm8gYml0IGlzIGFsbG93ZWQgaW4gZWxsaXBzaXNNYXNrLCB3aGljaCBtZWFucyBlbGxpcHNpc01hc2tcbiAgLy8gaXMgYSBwb3dlciBvZiAyLiBVc2UgYml0IGNvbXBhcmVzIHRvIGVuc3VyZSBlbGxpcHNpc01hc2sgaXMgMCBvciBhIHBvd2VyXG4gIC8vIG9mIDIuIFdoZW4gaSBpcyBhIHBvd2VyIG9mIDIsIGkgJiAoaSAtIDEpIGlzIGFsd2F5cyAwLlxuICAvLyBBbHNvIHJlZjpcbiAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjAwMjkzL2hvdy10by1jaGVjay1pZi1hLW51bWJlci1pcy1hLXBvd2VyLW9mLTJcbiAgaWYgKGVsbGlwc2lzTWFzayAhPSBudWxsICYmIChlbGxpcHNpc01hc2sgJiAoZWxsaXBzaXNNYXNrIC0gMSkpICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNdWx0aXBsZSBlbGxpcHNlcyBpbiBzbGljZSBpcyBub3QgYWxsb3dlZC4nKTtcbiAgfVxuXG4gIC8vIFN0ZXAgMTogQWNjb3VudCBmb3IgZWxsaXBzaXMgYW5kIG5ldyBheGlzLlxuICAvLyBDaGVjayBmb3IgZWxsaXBzaXMgYW5kIGNvdW50IGhvdyBtYW55IG5vbi1uZXdheGlzIHRoZXJlIGFyZSBhZnRlci5cbiAgbGV0IGVsbGlwc2lzU2VlbiA9IGZhbHNlO1xuXG4gIGNvbnN0IHNwYXJzZVNwZWM6IFN0cmlkZWRTbGljZVNwYXJzZVNwZWMgPSB7XG4gICAgZGltczogc3RyaWRlc05vbk51bGwubGVuZ3RoLFxuICAgIG51bUFkZEF4aXNBZnRlckVsbGlwc2lzOiAwLFxuICAgIGJlZ2luOiBiZWdpbi5zbGljZSgpLFxuICAgIGVuZDogZW5kLnNsaWNlKCksXG4gICAgc3RyaWRlczogc3RyaWRlc05vbk51bGwuc2xpY2UoKSxcbiAgICBiZWdpbk1hc2ssXG4gICAgZW5kTWFzayxcbiAgICBlbGxpcHNpc01hc2ssXG4gICAgbmV3QXhpc01hc2ssXG4gICAgc2hyaW5rQXhpc01hc2tcbiAgfTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNwYXJzZVNwZWMuZGltczsgaSsrKSB7XG4gICAgaWYgKGVsbGlwc2lzU2VlbiAmJiAoKDEgPDwgaSkgJiBuZXdBeGlzTWFzaykgIT09IDApIHtcbiAgICAgIHNwYXJzZVNwZWMubnVtQWRkQXhpc0FmdGVyRWxsaXBzaXMrKztcbiAgICB9XG4gICAgaWYgKCgxIDw8IGkpICYgZWxsaXBzaXNNYXNrKSB7XG4gICAgICBlbGxpcHNpc1NlZW4gPSB0cnVlO1xuICAgIH1cbiAgfVxuICAvLyBJZiBubyBlbGxpcHNpcyBpbnNlcnQgb25lIGF0IHRoZSBlbmQuXG4gIGlmICghZWxsaXBzaXNTZWVuKSB7XG4gICAgc3BhcnNlU3BlYy5lbGxpcHNpc01hc2sgfD0gKDEgPDwgc3BhcnNlU3BlYy5kaW1zKTtcbiAgICBzcGFyc2VTcGVjLmRpbXMrKzsgIC8vIHRoaXMgZWZmZWN0cyBsb29wIGl0ZXJhdGlvbiBiZWxvd1xuICB9XG5cbiAgLy8gU3RlcCAyOiBNYWtlIGEgc3BhcnNlIHNwZWMgaW50byBhIGZ1bGwgaW5kZXggc3BlYy5cbiAgLy9cbiAgLy8gVGhlIHNwYXJzZSBzcGVjIGRlb3Mgbm90IGNvcnJlc3BvbmQgdG8gdGhlIG51bWJlciBvZiBkaW1lbnNpb25zLlxuICAvLyBNYWtlIGEgZGVuc2Ugc3BlYyB0aGF0IGNvb3Jlc3BvbmRzIHRvIHRoZSBudW1iZXIgb2YgZGltZW5zaW9ucy5cbiAgLy9cbiAgLy8gRm9yIGV4YW1wbGUgc3VwcG9zZSBmb29bLi4uLDM6XSBvbiBmb28uc2hhcGUgPSBbMiwgMiwgM10gdGhlbiB3ZSBuZWVkIHRvXG4gIC8vIHByb2R1Y2UgdGhlIG1pc3NpbmcgYmVnaW5NYXNrIGZvciB0aGUgZmlyc3QgdHdvIGRpbWVuc2lvbnMgaS5lLiBmcm9tXG4gIC8vIGJlZ2luTWFza1NwZWMgPSAwLCBlbmRNYXNrU3BlYyA9IDIsIHdlIGFjaGlldmUgYmVnaW5NYXNrID0gNiAoMTEwKSxcbiAgLy8gZW5kTWFzayA9IDcgKDExMSkuXG4gIGNvbnN0IGRlbnNlU3BlYzogU3RyaWRlZFNsaWNlRGVuc2VTcGVjID0ge1xuICAgIGRpbXM6IHhTaGFwZS5sZW5ndGgsXG4gICAgYmVnaW5NYXNrOiAwLFxuICAgIGVuZE1hc2s6IDAsXG4gICAgYmVnaW5WYWxpZDogZmFsc2UsXG4gICAgZW5kVmFsaWQ6IGZhbHNlXG4gIH07XG5cbiAgYnVpbGREZW5zZVNwZWMoc3BhcnNlU3BlYywgZGVuc2VTcGVjKTtcblxuICAvLyBTdGVwIDM6IE1ha2UgaW1wbGljaXQgcmFuZ2VzIChub24temVybyBiZWdpbk1hc2tzIGFuZCBlbmRNYXNrcykgZXhwbGljaXRcbiAgLy8gYW5kIGJvdW5kcyBjaGVjay5cbiAgbGV0IGlzSWRlbnRpdHkgPSB0cnVlO1xuICBsZXQgc2xpY2VEaW0wID0gdHJ1ZTtcbiAgbGV0IGlzU2ltcGxlU2xpY2UgPSB0cnVlO1xuICBjb25zdCBwcm9jZXNzaW5nU2hhcGUgPSBbXTtcbiAgY29uc3QgZmluYWxTaGFwZSA9IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgeFNoYXBlLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKGRlbnNlU3BlYy5zdHJpZGVzW2ldID09PSAwKSB7XG4gICAgICB0aHJvdyBFcnJvcihgc3RyaWRlc1ske2l9XSBtdXN0IGJlIG5vbi16ZXJvYCk7XG4gICAgfVxuICAgIGNvbnN0IHNocmlua0kgPSAhIShkZW5zZVNwZWMuc2hyaW5rQXhpc01hc2sgJiAoMSA8PCBpKSk7XG4gICAgY29uc3QgZGltSSA9IHhTaGFwZVtpXTtcbiAgICBpZiAoZGltSSA9PT0gLTEpIHtcbiAgICAgIHByb2Nlc3NpbmdTaGFwZS5wdXNoKHNocmlua0kgPyAxIDogLTEpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgbWFza3MgPVxuICAgICAgICBbZGVuc2VTcGVjLmJlZ2luTWFzayAmICgxIDw8IGkpLCBkZW5zZVNwZWMuZW5kTWFzayAmICgxIDw8IGkpXTtcbiAgICBjb25zdCB2YWxpZFJhbmdlID0gW1xuICAgICAgZGVuc2VTcGVjLnN0cmlkZXNbaV0gPiAwID8gMCA6IC0xLFxuICAgICAgZGVuc2VTcGVjLnN0cmlkZXNbaV0gPiAwID8gZGltSSA6IGRpbUkgLSAxXG4gICAgXTtcblxuICAgIGlmIChzaHJpbmtJICYmIGRlbnNlU3BlYy5zdHJpZGVzW2ldIDw9IDApIHtcbiAgICAgIHRocm93IEVycm9yKCdvbmx5IHN0cmlkZSAxIGFsbG93ZWQgb24gbm9uLXJhbmdlIGluZGV4aW5nLicpO1xuICAgIH1cblxuICAgIGlzU2ltcGxlU2xpY2UgPSBpc1NpbXBsZVNsaWNlICYmIChkZW5zZVNwZWMuc3RyaWRlc1tpXSA9PT0gMSk7XG5cbiAgICBjb25zdCBiZWdpbkFuZEVuZE1hc2tlZCA9XG4gICAgICAgICEhKChkZW5zZVNwZWMuYmVnaW5NYXNrICYgKDEgPDwgaSkpICYmIChkZW5zZVNwZWMuZW5kTWFzayAmICgxIDw8IGkpKSk7XG5cbiAgICBpZiAoZGVuc2VTcGVjLmJlZ2luVmFsaWQgJiYgZGVuc2VTcGVjLmVuZFZhbGlkKSB7XG4gICAgICBpZiAoc2hyaW5rSSkge1xuICAgICAgICAvLyBJZiB3ZSBhcmUgc2hyaW5raW5nLCB0aGUgZW5kIGluZGV4IGlzIG5vdyBwb3NzaWJseSBpbmNvcnJlY3QuIEluXG4gICAgICAgIC8vIHBhcnRpY3VsYXIgZm9vWy0xXSBwcm9kdWNlcyBzcGFyc2VCZWdpbiA9IC0xLCBzcGFyc2VFbmQgPSAwLlxuICAgICAgICAvLyBhbmQgY2Fub25pY2FsIHB1dHMgdGhlc2UgdG8gbi0xIGFuZCAwLCB3aGljaCBpbXBsaWVzIGEgZGVnZW5lcmF0ZVxuICAgICAgICAvLyBpbnRlcnZhbC4gRm9ydHVuYXRlbHksIGl0IGlzIG5vdyBzYWZlIHRvIHJlLWNyZWF0ZSBlbmQgYXMgYmVnaW4gKyAxLlxuICAgICAgICBjb25zdCB4RndkID0gZGVuc2VTcGVjLmJlZ2luW2ldIDwgMCA/IGRpbUkgKyBkZW5zZVNwZWMuYmVnaW5baV0gOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbnNlU3BlYy5iZWdpbltpXTtcbiAgICAgICAgZGVuc2VTcGVjLmJlZ2luW2ldID0geEZ3ZDtcbiAgICAgICAgZGVuc2VTcGVjLmVuZFtpXSA9IGRlbnNlU3BlYy5iZWdpbltpXSArIDE7XG4gICAgICAgIGlmICh4RndkIDwgMCB8fCB4RndkID49IGRpbUkpIHtcbiAgICAgICAgICB0aHJvdyBFcnJvcihgc2xpY2UgaW5kZXggJHtkZW5zZVNwZWMuYmVnaW5baV19IG9mIGRpbWVuc2lvbiAke1xuICAgICAgICAgICAgICBpfSBvdXQgb2YgYm91bmRzLmApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZW5zZVNwZWMuYmVnaW5baV0gPSBjYW5vbmljYWwoXG4gICAgICAgICAgICBkZW5zZVNwZWMuYmVnaW5baV0sIDAsIGRlbnNlU3BlYy5zdHJpZGVzW2ldLCBkaW1JLCBtYXNrcyxcbiAgICAgICAgICAgIHZhbGlkUmFuZ2UpO1xuICAgICAgICBkZW5zZVNwZWMuZW5kW2ldID0gY2Fub25pY2FsKFxuICAgICAgICAgICAgZGVuc2VTcGVjLmVuZFtpXSwgMSwgZGVuc2VTcGVjLnN0cmlkZXNbaV0sIGRpbUksIG1hc2tzLCB2YWxpZFJhbmdlKTtcbiAgICAgIH1cbiAgICAgIC8vIFVwZGF0ZSBvcHRpbWl6YXRpb24gdmFsdWVzXG4gICAgICBjb25zdCB0YWtlQWxsSW5EaW1lbnNpb24gPSBkZW5zZVNwZWMuc3RyaWRlc1tpXSA9PT0gMSAmJlxuICAgICAgICAgIGRlbnNlU3BlYy5iZWdpbltpXSA9PT0gMCAmJiBkZW5zZVNwZWMuZW5kW2ldID09PSBkaW1JO1xuICAgICAgaXNJZGVudGl0eSA9IGlzSWRlbnRpdHkgJiYgdGFrZUFsbEluRGltZW5zaW9uO1xuICAgICAgc2xpY2VEaW0wID0gc2xpY2VEaW0wICYmXG4gICAgICAgICAgKChpID09PSAwICYmIGRlbnNlU3BlYy5zdHJpZGVzW2ldID09PSAxKSB8fCB0YWtlQWxsSW5EaW1lbnNpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICBpc0lkZW50aXR5ID1cbiAgICAgICAgICBpc0lkZW50aXR5ICYmICgoZGVuc2VTcGVjLnN0cmlkZXNbaV0gPT09IDEpICYmIGJlZ2luQW5kRW5kTWFza2VkKTtcbiAgICAgIHNsaWNlRGltMCA9IHNsaWNlRGltMCAmJlxuICAgICAgICAgICgoaSA9PT0gMCAmJiBkZW5zZVNwZWMuc3RyaWRlc1tpXSA9PT0gMSkgfHwgYmVnaW5BbmRFbmRNYXNrZWQpO1xuICAgIH1cbiAgICAvLyBDb21wdXRlIHRoZSBwcm9jZXNzaW5nIHNoYXBlICh0aGUgaW50ZXJtZWRpYXRlIEVpZ2VuIHdpbGwgcHJvZHVjZSlcbiAgICBsZXQgaW50ZXJ2YWxMZW5ndGg7XG4gICAgbGV0IGtub3duSW50ZXJ2YWwgPSBmYWxzZTtcbiAgICBpZiAoZGVuc2VTcGVjLmJlZ2luVmFsaWQgJiYgZGVuc2VTcGVjLmVuZFZhbGlkKSB7XG4gICAgICBpbnRlcnZhbExlbmd0aCA9IGRlbnNlU3BlYy5lbmRbaV0gLSBkZW5zZVNwZWMuYmVnaW5baV07XG4gICAgICBrbm93bkludGVydmFsID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHNocmlua0kpIHtcbiAgICAgIC8vIFRoZSBkaW1lbnNpb24gaXMgc3RpbGwga25vd24gYXMgMSBmb3IgdGhlIHByb2Nlc3NpbmdTaGFwZSwgYnV0IHdpbGwgYmVcbiAgICAgIC8vIGRpc2NhcmRlZCBmb3IgdGhlIGZpbmFsIHNoYXBlLlxuICAgICAgaW50ZXJ2YWxMZW5ndGggPSAxO1xuICAgICAga25vd25JbnRlcnZhbCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChiZWdpbkFuZEVuZE1hc2tlZCkge1xuICAgICAgLy8gRXZlbiBpZiB3ZSBkb24ndCBoYXZlIHZhbHVlcyBmb3IgYmVnaW4gb3IgZW5kLCB3ZSBkbyBrbm93IHRoYXQgdGhpc1xuICAgICAgLy8gZGltZW5zaW9uIGNvdmVycyB0aGUgd2hvbGUgaW50ZXJ2YWwuIElmIHdlIGhhdmUgc2hhcGUgaW5mb3JtYXRpb24gZm9yXG4gICAgICAvLyB0aGlzIGRpbWVuc2lvbiwgdGhhdCB0ZWxscyB1cyB0aGUgaW50ZXJ2YWwgbGVuZ3RoLlxuICAgICAgaWYgKGRpbUkgPj0gMCkge1xuICAgICAgICBpZiAoZGVuc2VTcGVjLnN0cmlkZXNbaV0gPCAwKSB7XG4gICAgICAgICAgaW50ZXJ2YWxMZW5ndGggPSAtZGltSTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbnRlcnZhbExlbmd0aCA9IGRpbUk7XG4gICAgICAgIH1cbiAgICAgICAga25vd25JbnRlcnZhbCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChrbm93bkludGVydmFsKSB7XG4gICAgICBsZXQgc2l6ZUk7XG4gICAgICAvLyBIb2xkIHplcm8gaWYgdGhlIGludGVydmFsIGlzIGRlZ2VuZXJhdGUsIG90aGVyd2lzZSBhY2NvdW50IGZvclxuICAgICAgLy8gcmVtYWluZGVyXG4gICAgICBpZiAoaW50ZXJ2YWxMZW5ndGggPT09IDAgfHxcbiAgICAgICAgICAoKGludGVydmFsTGVuZ3RoIDwgMCkgIT09IChkZW5zZVNwZWMuc3RyaWRlc1tpXSA8IDApKSkge1xuICAgICAgICBzaXplSSA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaXplSSA9IE1hdGgudHJ1bmMoaW50ZXJ2YWxMZW5ndGggLyBkZW5zZVNwZWMuc3RyaWRlc1tpXSkgK1xuICAgICAgICAgICAgKGludGVydmFsTGVuZ3RoICUgZGVuc2VTcGVjLnN0cmlkZXNbaV0gIT09IDAgPyAxIDogMCk7XG4gICAgICB9XG4gICAgICBwcm9jZXNzaW5nU2hhcGUucHVzaChzaXplSSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb2Nlc3NpbmdTaGFwZS5wdXNoKC0xKTtcbiAgICB9XG4gIH1cblxuICAvLyBTdGVwIDQ6IENvbXB1dGUgdGhlIGZpbmFsIHNoYXBlXG4gIC8vXG4gIC8vIG5ld0F4aXMgd2lsbCBpbmNyZWFzZSBkaW1lbnNpb24gYnkgMSAod2l0aCBhIG9uZS1zaXplIGRpbWVuc2lvbilcbiAgLy8gc2xpY2VzIGxpa2UgZm9vWzMsIC4uLl0gd2lsbCByZWR1Y2UgZGltZW5zaW9uIGJ5IDEuXG4gIC8vIFRoaXMgY2Fubm90IGJlIGRvbmUgZWFybGllciwgYmVjYXVzZSBpdCBkZXBlbmRzIG9uIFN0ZXAgMy5cbiAgZm9yIChsZXQgZGVuc2VEaW0gPSAwOyBkZW5zZURpbSA8IGRlbnNlU3BlYy5maW5hbFNoYXBlR2F0aGVySW5kaWNlcy5sZW5ndGg7XG4gICAgICAgKytkZW5zZURpbSkge1xuICAgIGNvbnN0IGdhdGhlckluZGV4ID0gZGVuc2VTcGVjLmZpbmFsU2hhcGVHYXRoZXJJbmRpY2VzW2RlbnNlRGltXTtcbiAgICBpZiAoZ2F0aGVySW5kZXggPj0gMCkge1xuICAgICAgZmluYWxTaGFwZS5wdXNoKHByb2Nlc3NpbmdTaGFwZVtnYXRoZXJJbmRleF0pO1xuICAgIH0gZWxzZSBpZiAoZ2F0aGVySW5kZXggPT09IE5FV19BWElTKSB7XG4gICAgICBmaW5hbFNoYXBlLnB1c2goMSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZmluYWxTaGFwZVNwYXJzZSA9IGZpbmFsU2hhcGUuZmlsdGVyKFxuICAgICAgKGRpbSwgaSkgPT4gZGVuc2VTcGVjLmZpbmFsU2hhcGVHYXRoZXJJbmRpY2VzW2ldICE9PSBORVdfQVhJUyk7XG5cbiAgcmV0dXJuIHtcbiAgICBmaW5hbFNoYXBlU3BhcnNlLFxuICAgIGZpbmFsU2hhcGUsXG4gICAgaXNJZGVudGl0eSxcbiAgICBzbGljZURpbTAsXG4gICAgaXNTaW1wbGVTbGljZSxcbiAgICBiZWdpbjogZGVuc2VTcGVjLmJlZ2luLFxuICAgIGVuZDogZGVuc2VTcGVjLmVuZCxcbiAgICBzdHJpZGVzOiBkZW5zZVNwZWMuc3RyaWRlc1xuICB9O1xufVxuXG5mdW5jdGlvbiBidWlsZERlbnNlU3BlYyhcbiAgICBzcGFyc2U6IFN0cmlkZWRTbGljZVNwYXJzZVNwZWMsIGRlbnNlOiBTdHJpZGVkU2xpY2VEZW5zZVNwZWMpIHtcbiAgZGVuc2UuYmVnaW5NYXNrID0gMDtcbiAgZGVuc2UuZW5kTWFzayA9IDA7XG4gIGRlbnNlLnNocmlua0F4aXNNYXNrID0gMDtcblxuICBsZXQgZnVsbEluZGV4ID0gMDtcbiAgZGVuc2UuYmVnaW5WYWxpZCA9IHNwYXJzZS5iZWdpbiAhPSBudWxsO1xuICBkZW5zZS5lbmRWYWxpZCA9IHNwYXJzZS5lbmQgIT0gbnVsbDtcblxuICBkZW5zZS5iZWdpbiA9IG5ldyBBcnJheShkZW5zZS5kaW1zKTtcbiAgZGVuc2UuZW5kID0gbmV3IEFycmF5KGRlbnNlLmRpbXMpO1xuICBkZW5zZS5zdHJpZGVzID0gbmV3IEFycmF5KGRlbnNlLmRpbXMpO1xuICBkZW5zZS5maW5hbFNoYXBlR2F0aGVySW5kaWNlcyA9IFtdO1xuICBkZW5zZS5maW5hbFNoYXBlR2F0aGVySW5kaWNlc1NwYXJzZSA9IFtdO1xuICBkZW5zZS5pbnB1dFNoYXBlR2F0aGVySW5kaWNlc1NwYXJzZSA9IG5ldyBBcnJheShkZW5zZS5kaW1zKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNwYXJzZS5kaW1zOyBpKyspIHtcbiAgICBpZiAoKDEgPDwgaSkgJiBzcGFyc2UuZWxsaXBzaXNNYXNrKSB7XG4gICAgICAvLyBPbmx5IHRoZSBiaXQgdGhhdCBoYXMgZWxsaXBzaXMgd2lsbCBmYWxsIGluIHRoaXMgY29uZGl0aW9uLlxuICAgICAgLy8gRXhwYW5kIHRoZSBlbGxpcHNpcyBpbnRvIHRoZSBhcHByb3ByaWF0ZSBpbmRpY2VzXG4gICAgICAvLyBOb3RlOiB0aGlzIG9ubHkgd29ya3MgYmVjYXVzZSB3ZSBndWFyYW50ZWVkIG9uZSBlbGxpcHNpcy5cbiAgICAgIGNvbnN0IG5leHRJbmRleCA9IE1hdGgubWluKFxuICAgICAgICAgIGRlbnNlLmRpbXMgLSAoc3BhcnNlLmRpbXMgLSBpKSArIDEgKyBzcGFyc2UubnVtQWRkQXhpc0FmdGVyRWxsaXBzaXMsXG4gICAgICAgICAgZGVuc2UuZGltcyk7XG4gICAgICBmb3IgKDsgZnVsbEluZGV4IDwgbmV4dEluZGV4OyBmdWxsSW5kZXgrKykge1xuICAgICAgICAvLyBuZXdBeGlzIGFyZW4ndCByZWFsIGF4aXMgc28geW91IGhhdmUgdG8gc2tpcC5cbiAgICAgICAgZGVuc2UuYmVnaW5bZnVsbEluZGV4XSA9IDA7XG4gICAgICAgIGRlbnNlLmVuZFtmdWxsSW5kZXhdID0gMDtcbiAgICAgICAgZGVuc2Uuc3RyaWRlc1tmdWxsSW5kZXhdID0gMTtcbiAgICAgICAgZGVuc2UuYmVnaW5NYXNrIHw9ICgxIDw8IGZ1bGxJbmRleCk7XG4gICAgICAgIGRlbnNlLmVuZE1hc2sgfD0gKDEgPDwgZnVsbEluZGV4KTtcbiAgICAgICAgZGVuc2UuZmluYWxTaGFwZUdhdGhlckluZGljZXMucHVzaChmdWxsSW5kZXgpO1xuICAgICAgICBkZW5zZS5maW5hbFNoYXBlR2F0aGVySW5kaWNlc1NwYXJzZS5wdXNoKC0xKTtcbiAgICAgICAgZGVuc2UuaW5wdXRTaGFwZUdhdGhlckluZGljZXNTcGFyc2VbZnVsbEluZGV4XSA9IGk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICgoMSA8PCBpKSAmIHNwYXJzZS5uZXdBeGlzTWFzaykge1xuICAgICAgLy8gT25seSB0aGUgYml0IHRoYXQgaGFzIG5ld0F4aXMgd2lsbCBmYWxsIGluIHRoaXMgY29uZGl0aW9uLlxuICAgICAgZGVuc2UuZmluYWxTaGFwZUdhdGhlckluZGljZXMucHVzaChORVdfQVhJUyk7XG4gICAgICBkZW5zZS5maW5hbFNoYXBlR2F0aGVySW5kaWNlc1NwYXJzZS5wdXNoKC0xKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGZ1bGxJbmRleCA9PT0gZGVuc2UuYmVnaW4ubGVuZ3RoKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICAgYEluZGV4IG91dCBvZiByYW5nZSB1c2luZyBpbnB1dCBkaW0gJHtmdWxsSW5kZXh9OyBpbnB1dCBgICtcbiAgICAgICAgICAgIGBoYXMgb25seSAke2RlbnNlLmRpbXN9IGRpbXMsICR7ZGVuc2UuYmVnaW4ubGVuZ3RofS5gKTtcbiAgICAgIH1cblxuICAgICAgLy8gR2F0aGVyIHNsaWNpbmcgc3BlYyBpbnRvIGFwcHJvcHJpYXRlIGluZGV4LlxuICAgICAgaWYgKHNwYXJzZS5iZWdpbiAhPSBudWxsKSB7XG4gICAgICAgIGRlbnNlLmJlZ2luW2Z1bGxJbmRleF0gPSBzcGFyc2UuYmVnaW5baV07XG4gICAgICB9XG4gICAgICBpZiAoc3BhcnNlLmVuZCAhPSBudWxsKSB7XG4gICAgICAgIGRlbnNlLmVuZFtmdWxsSW5kZXhdID0gc3BhcnNlLmVuZFtpXTtcbiAgICAgIH1cbiAgICAgIGRlbnNlLnN0cmlkZXNbZnVsbEluZGV4XSA9IHNwYXJzZS5zdHJpZGVzW2ldO1xuICAgICAgaWYgKHNwYXJzZS5iZWdpbk1hc2sgJiAoMSA8PCBpKSkge1xuICAgICAgICBkZW5zZS5iZWdpbk1hc2sgfD0gKDEgPDwgZnVsbEluZGV4KTtcbiAgICAgIH1cbiAgICAgIGlmIChzcGFyc2UuZW5kTWFzayAmICgxIDw8IGkpKSB7XG4gICAgICAgIGRlbnNlLmVuZE1hc2sgfD0gKDEgPDwgZnVsbEluZGV4KTtcbiAgICAgIH1cbiAgICAgIC8vIElmIHNocmluaywgcmVjb3JkIHdoZXJlIHRvIGdldCB0aGUgZGltZW5zaW9uYWxpdHkgZnJvbSAoaS5lLiBuZXdBeGlzKVxuICAgICAgLy8gY3JlYXRlcyBhIGZha2UgMSBzaXplIGRpbWVuc2lvbi4gQWxzbyByZW1lbWJlciBzaHJpbmsgYXhpcyAobm93IGluXG4gICAgICAvLyBkZW5zZSBmb3JtKSBzbyB3ZSBjYW4gaWdub3JlIGRlbnNlLmVuZCBiZWxvdy5cbiAgICAgIGlmIChzcGFyc2Uuc2hyaW5rQXhpc01hc2sgJiAoMSA8PCBpKSkge1xuICAgICAgICBkZW5zZS5maW5hbFNoYXBlR2F0aGVySW5kaWNlcy5wdXNoKFNIUklOS19BWElTKTtcbiAgICAgICAgZGVuc2UuZmluYWxTaGFwZUdhdGhlckluZGljZXNTcGFyc2UucHVzaCgtMSk7XG4gICAgICAgIGRlbnNlLnNocmlua0F4aXNNYXNrIHw9ICgxIDw8IGZ1bGxJbmRleCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZW5zZS5maW5hbFNoYXBlR2F0aGVySW5kaWNlcy5wdXNoKGZ1bGxJbmRleCk7XG4gICAgICAgIC8vIFJlbWVtYmVyIHRoYXQgd2hlcmUgaW4gdGhlIHNwYXJzZSBzaGFwZSB0aGUgZGVuc2UgZGltIGNvbWVzIGZyb20uXG4gICAgICAgIGRlbnNlLmZpbmFsU2hhcGVHYXRoZXJJbmRpY2VzU3BhcnNlLnB1c2goaSk7XG4gICAgICB9XG4gICAgICBkZW5zZS5pbnB1dFNoYXBlR2F0aGVySW5kaWNlc1NwYXJzZVtmdWxsSW5kZXhdID0gaTtcbiAgICAgIGZ1bGxJbmRleCsrO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjYW5vbmljYWwoXG4gICAgeDogbnVtYmVyLCBjOiBudW1iZXIsIHN0cmlkZUk6IG51bWJlciwgZGltSTogbnVtYmVyLCBtYXNrczogbnVtYmVyW10sXG4gICAgdmFsaWRSYW5nZTogbnVtYmVyW10pIHtcbiAgaWYgKG1hc2tzW2NdKSB7XG4gICAgcmV0dXJuIHN0cmlkZUkgPiAwID8gdmFsaWRSYW5nZVtjXSA6IHZhbGlkUmFuZ2VbKGMgKyAxKSAmIDFdO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHhGd2QgPSB4IDwgMCA/IGRpbUkgKyB4IDogeDsgIC8vIG1ha2UgbmVnYXRpdmUgaW5kaWNlcyBwb3NpdGl2ZVxuICAgIHJldHVybiB4RndkIDwgdmFsaWRSYW5nZVswXSA/IHZhbGlkUmFuZ2VbMF0gOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhGd2QgPiB2YWxpZFJhbmdlWzFdID8gdmFsaWRSYW5nZVsxXSA6IHhGd2Q7XG4gIH1cbn1cbiJdfQ==