/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
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
import { backend_util, broadcastTo, reshape, tidy, util } from '@tensorflow/tfjs-core';
var RowPartitionType = backend_util.RowPartitionType;
// Based on
// https://github.com/tensorflow/tensorflow/blob/master/tensorflow/core/kernels/ragged_tensor_to_tensor_op.cc
class RaggedTensorToTensorOp {
    constructor(shape, shapeShape, values, valuesShape, valuesDType, defaultValue, defaultValueShape, rowPartitionValues, rowPartitionValuesShapes, rowPartitionTypeStrings) {
        this.shape = shape;
        this.shapeShape = shapeShape;
        this.values = values;
        this.valuesShape = valuesShape;
        this.valuesDType = valuesDType;
        this.defaultValue = defaultValue;
        this.defaultValueShape = defaultValueShape;
        this.rowPartitionValues = rowPartitionValues;
        this.rowPartitionValuesShapes = rowPartitionValuesShapes;
        this.rowPartitionTypes =
            backend_util.getRowPartitionTypesHelper(rowPartitionTypeStrings);
        this.raggedRank = backend_util.getRaggedRank(this.rowPartitionTypes);
    }
    getRowPartitionTypeByDimension(dimension) {
        if (this.rowPartitionTypes[0] === RowPartitionType.FIRST_DIM_SIZE) {
            return this.rowPartitionTypes[dimension + 1];
        }
        else {
            return this.rowPartitionTypes[dimension];
        }
    }
    // Returns the relationship between dimension and dimension + 1.
    getRowPartitionTensor(dimension) {
        if (this.rowPartitionTypes[0] === RowPartitionType.FIRST_DIM_SIZE) {
            return this.rowPartitionValues[dimension + 1];
        }
        else {
            return this.rowPartitionValues[dimension];
        }
    }
    getMaxWidth(dimension) {
        const rowPartitionTensor = this.getRowPartitionTensor(dimension - 1);
        switch (this.getRowPartitionTypeByDimension(dimension - 1)) {
            case RowPartitionType.VALUE_ROWIDS:
                return RaggedTensorToTensorOp.getMaxWidthValueRowID(rowPartitionTensor);
            case RowPartitionType.ROW_SPLITS:
                return RaggedTensorToTensorOp.getMaxWidthRowSplit(rowPartitionTensor);
            default:
                throw new Error(`Cannot handle partition type ${RowPartitionType[this.getRowPartitionTypeByDimension(dimension - 1)]}`);
        }
    }
    static getMaxWidthRowSplit(rowSplit) {
        const tensorLength = rowSplit.length;
        if (tensorLength === 0 || tensorLength === 1) {
            return 0;
        }
        let maxWidth = 0;
        for (let i = 0; i < tensorLength - 1; ++i) {
            const currentWidth = rowSplit[i + 1] - rowSplit[i];
            if (currentWidth > maxWidth) {
                maxWidth = currentWidth;
            }
        }
        return maxWidth;
    }
    static getMaxWidthValueRowID(valueRowIds) {
        const indexLength = valueRowIds.length;
        if (indexLength === 0) {
            return 0;
        }
        let firstEqualIndex = 0;
        let firstEqualIndexValue = valueRowIds[0];
        let maxWidth = 0;
        for (let i = 1; i < indexLength; ++i) {
            const value = valueRowIds[i];
            if (value !== firstEqualIndexValue) {
                firstEqualIndexValue = value;
                maxWidth = Math.max(i - firstEqualIndex, maxWidth);
                firstEqualIndex = i;
            }
        }
        return Math.max(indexLength - firstEqualIndex, maxWidth);
    }
    tensorShapeFromTensor(t, tShape, isPartial = true) {
        if (tShape.length === 0) {
            if (t[0] === -1) {
                return [];
            }
            throw new Error(`The only valid scalar shape tensor is the fully unknown shape specified as -1.`);
        }
        // MakePartialShape/MakeShapeHelper.
        return makeShape(t, isPartial);
    }
    calculateOutputSize(firstDim) {
        const valueShape = this.valuesShape;
        const defaultValueShape = this.defaultValueShape;
        backend_util.validateDefaultValueShape(defaultValueShape, valueShape);
        const shape = this.tensorShapeFromTensor(this.shape, this.shapeShape);
        const outputShape = backend_util.combineRaggedTensorToTensorShapes(this.raggedRank, shape, valueShape);
        const result = outputShape;
        if (result[0] < 0) {
            result[0] = firstDim;
        }
        for (let i = 1; i <= this.raggedRank; ++i) {
            if (result[i] < 0) {
                result[i] = this.getMaxWidth(i);
            }
        }
        return result;
    }
    /**
     * The outputIndex represents the index in the output tensor
     * where the first element of a particular dimension would be written.
     * If it is -1, it indicates that the index is out of scope.
     * Example, given firstDimension = 10, firstDimensionOutput = 6,
     * and outputIndexMultiplier = 100:
     * result = [0 100 200 300 400 500 -1 -1 -1 -1]
     * If firstDimensionOutput = 11 instead, then:
     * result = [0 100 200 300 400 500 600 700 800 900]
     */
    calculateFirstParentOutputIndex(firstDimension, outputIndexMultiplier, firstDimensionOutput) {
        const minDimension = Math.min(firstDimension, firstDimensionOutput);
        const result = [];
        let currentOutputIndex = 0;
        for (let i = 0; i < minDimension; ++i, currentOutputIndex += outputIndexMultiplier) {
            result.push(currentOutputIndex);
        }
        for (let i = minDimension; i < firstDimension; ++i) {
            result.push(-1);
        }
        util.assert(result.length === firstDimension, () => 'Final length of result must be equal to firstDimension.');
        return result;
    }
    calculateOutputIndexRowSplit(rowSplit, parentOutputIndex, outputIndexMultiplier, outputSize) {
        const rowSplitSize = rowSplit.length;
        const result = [];
        for (let i = 0; i < rowSplitSize - 1; ++i) {
            const rowLength = rowSplit[i + 1] - rowSplit[i];
            let realLength = Math.min(outputSize, rowLength);
            let parentOutputIndexCurrent = parentOutputIndex[i];
            if (parentOutputIndexCurrent === -1) {
                realLength = 0;
            }
            for (let j = 0; j < realLength; ++j) {
                result.push(parentOutputIndexCurrent);
                parentOutputIndexCurrent += outputIndexMultiplier;
            }
            for (let j = 0; j < rowLength - realLength; ++j) {
                result.push(-1);
            }
        }
        if (rowSplitSize > 0 && result.length !== rowSplit[rowSplitSize - 1]) {
            throw new Error('Invalid row split size.');
        }
        return result;
    }
    // Calculate the output index of the first element of a list.
    // The parentOutputIndex is the same computation for the previous list.
    // -1 indicates an element or list that is out of range.
    // The outputIndexMultiplier is the number of output indices one moves
    // forward for each column.
    // E.g., given:
    // valueRowIds:[0 1 2 2 2 3 5 5 6]
    // parentOutputIndex:[1000 1100 2000 2100 -1 3000 4000]
    // outputIndexMultiplier: 10
    // outputSize: 2
    // You get:
    // result = [1000 1100 2000 2010 -1 2100 -1 -1 3000]
    // result[0] = parentOutputIndex[valueRowIds[0]]
    // result[1] = parentOutputIndex[valueRowIds[1]]
    // result[2] = parentOutputIndex[valueRowIds[2]]
    // result[3] = parentOutputIndex[valueRowIds[2] + 10]
    // result[4] = -1 because it is the third element the size is 2.
    // result[5] = parentOutputIndex[valueRowIds[3]]
    // result[6] = -1 because parentOutputIndex[valueRowIds[6]] == -1
    // result[7] = -1 because parentOutputIndex[valueRowIds[6]] == -1
    // result[8] = parentOutputIndex[valueRowIds[7]]
    calculateOutputIndexValueRowID(valueRowIds, parentOutputIndex, outputIndexMultiplier, outputSize) {
        const indexSize = valueRowIds.length;
        const result = [];
        if (indexSize === 0) {
            return [];
        }
        let currentOutputColumn = 0;
        let currentValueRowId = valueRowIds[0];
        if (currentValueRowId >= parentOutputIndex.length) {
            throw new Error(`Got currentValueRowId=${currentValueRowId}, which is not less than ${parentOutputIndex.length}`);
        }
        let currentOutputIndex = parentOutputIndex[currentValueRowId];
        result.push(currentOutputIndex);
        for (let i = 1; i < indexSize; ++i) {
            const nextValueRowId = valueRowIds[i];
            if (nextValueRowId === currentValueRowId) {
                if (currentOutputIndex >= 0) {
                    ++currentOutputColumn;
                    if (currentOutputColumn < outputSize) {
                        currentOutputIndex += outputIndexMultiplier;
                    }
                    else {
                        currentOutputIndex = -1;
                    }
                }
            }
            else {
                currentOutputColumn = 0;
                currentValueRowId = nextValueRowId;
                if (nextValueRowId >= parentOutputIndex.length) {
                    throw new Error(`Got nextValueRowId=${nextValueRowId} which is not less than ${parentOutputIndex.length}`);
                }
                currentOutputIndex = parentOutputIndex[nextValueRowId];
            }
            result.push(currentOutputIndex);
        }
        if (result.length !== valueRowIds.length) {
            throw new Error('Invalid row ids.');
        }
        return result;
    }
    calculateOutputIndex(dimension, parentOutputIndex, outputIndexMultiplier, outputSize) {
        const rowPartitionTensor = this.getRowPartitionTensor(dimension);
        const partitionType = this.getRowPartitionTypeByDimension(dimension);
        switch (partitionType) {
            case RowPartitionType.VALUE_ROWIDS:
                return this.calculateOutputIndexValueRowID(rowPartitionTensor, parentOutputIndex, outputIndexMultiplier, outputSize);
            case RowPartitionType.ROW_SPLITS:
                if (rowPartitionTensor.length - 1 > parentOutputIndex.length) {
                    throw new Error(`Row partition size is greater than output size: ${rowPartitionTensor.length - 1} > ${parentOutputIndex.length}`);
                }
                return this.calculateOutputIndexRowSplit(rowPartitionTensor, parentOutputIndex, outputIndexMultiplier, outputSize);
            default:
                throw new Error(`Unsupported partition type: ${RowPartitionType[partitionType]}`);
        }
    }
    getFirstDimensionSize() {
        const firstPartitionTensor = this.rowPartitionValues[0];
        if (this.rowPartitionTypes.length === 0) {
            throw new Error('No row_partition_types given.');
        }
        const firstPartitionType = this.rowPartitionTypes[0];
        switch (firstPartitionType) {
            case RowPartitionType.FIRST_DIM_SIZE:
                return firstPartitionTensor[0];
            case RowPartitionType.VALUE_ROWIDS:
                throw new Error('Cannot handle VALUE_ROWIDS in first dimension.');
            case RowPartitionType.ROW_SPLITS:
                return this.rowPartitionValuesShapes[0][0] - 1;
            default:
                throw new Error(`Cannot handle type ${RowPartitionType[firstPartitionType]}`);
        }
    }
    compute() {
        const firstPartitionTensor = this.rowPartitionValues[0];
        if (firstPartitionTensor.length <= 0) {
            throw new Error('Invalid first partition input. ' +
                'Tensor requires at least one element.');
        }
        const firstDimension = this.getFirstDimensionSize();
        const outputSize = this.calculateOutputSize(firstDimension);
        const multiplier = new Array(this.raggedRank + 1);
        multiplier[multiplier.length - 1] = 1;
        for (let i = multiplier.length - 2; i >= 0; --i) {
            multiplier[i] = multiplier[i + 1] * outputSize[i + 1];
        }
        // Full size of the tensor.
        const outputShape = makeShape(outputSize, false);
        const outputTensor = util.getArrayFromDType(this.valuesDType, util.sizeFromShape(outputShape));
        const fullSize = multiplier[0] * outputSize[0];
        if (fullSize > 0) {
            let outputIndex = this.calculateFirstParentOutputIndex(firstDimension, multiplier[0], outputSize[0]);
            for (let i = 1; i <= this.raggedRank; ++i) {
                const newOutputIndex = this.calculateOutputIndex(i - 1, outputIndex, multiplier[i], outputSize[i]);
                outputIndex = newOutputIndex;
            }
            this.setOutput(this.raggedRank, outputIndex, outputTensor, outputShape);
        }
        return [outputShape, outputTensor];
    }
    setOutput(raggedRank, outputIndex, outputTensor, outputShape) {
        if (outputTensor.length === 0) {
            return;
        }
        const valuesBase = this.values;
        const outputBase = outputTensor;
        let elementShape = outputShape.slice();
        elementShape = elementShape.slice(raggedRank + 1);
        const valueElementSize = util.sizeFromShape(elementShape);
        const outputIndexSize = outputIndex.length;
        // Broadcast the default value to value_element_size.  (We can skip this
        // if defaultValueTensor.size == 1, since we use fill when that's true.)
        let defaultValue = this.defaultValue;
        if (defaultValue.length !== valueElementSize && defaultValue.length !== 1) {
            const srcShape = this.defaultValueShape;
            tidy(() => {
                const defaultValueTensor = reshape(defaultValue, srcShape);
                const bCastDefault = broadcastTo(defaultValueTensor, elementShape);
                defaultValue = bCastDefault.dataSync();
            });
        }
        // Loop through the outputIndex array, finding contiguous regions that
        // should be copied.  Once we find the end of a contiguous region, copy it
        // and add any necessary padding (with defaultValue).
        let srcStart = 0; // Start of contiguous region (in values)
        let dstStart = 0; // Destination for contiguous region (in output)
        let dstEnd = 0; // Destination for contiguous region (in output)
        for (let srcI = 0; srcI <= outputIndexSize; ++srcI) {
            // dstI is the destination where the value at srcI should be copied.
            let dstI = srcI < outputIndexSize ? outputIndex[srcI] : -1;
            // If we're still in a contiguous region, then update dstEnd go to the
            // next srcI.
            if (dstI === dstEnd) {
                ++dstEnd;
                continue;
            }
            // We found the end of contiguous region.  This can be because we found
            // a gap (dstI > dstEnd), or a source value that shouldn't be copied
            // because it's out-of-bounds (dstI == -1), or the end of the tensor
            // (dstI === -1).
            if (dstStart < dstEnd) {
                // Copy the contiguous region.
                const src = valuesBase.subarray(srcStart * valueElementSize);
                const dst = outputBase.subarray(dstStart * valueElementSize);
                const nVals = (dstEnd - dstStart) * valueElementSize;
                copyArray(dst, src, nVals);
            }
            // Add any necessary padding (w/ defaultValue).
            if (srcI >= outputIndexSize) {
                // We reached the end of values: pad to the end of output.
                const outputSize = outputTensor.length;
                dstI = Math.floor(outputSize / valueElementSize);
            }
            if (dstI > dstEnd) {
                if (this.defaultValue.length === 1) {
                    outputBase
                        .subarray(dstEnd * valueElementSize, dstI * valueElementSize)
                        .fill(this.defaultValue[0]);
                    dstEnd = dstI;
                }
                else {
                    while (dstI > dstEnd) {
                        const dst = outputBase.slice(dstEnd * valueElementSize);
                        copyArray(dst, defaultValue, valueElementSize);
                        ++dstEnd;
                    }
                }
            }
            // Update indices.
            if (dstI < 0) {
                // srcI should be skipped -- leave it out of the contiguous region.
                srcStart = srcI + 1;
                dstStart = dstEnd;
            }
            else {
                // srcI should be copied -- include it in the contiguous region.
                srcStart = srcI;
                dstStart = dstEnd;
                dstEnd = dstStart + 1;
            }
        }
    }
}
function copyArray(dst, src, size) {
    for (let i = 0; i < size; i++) {
        dst[i] = src[i];
    }
}
function makeShape(shape, isPartial) {
    const out = [];
    for (let dim of shape) {
        if (dim < 0) {
            if (!isPartial) {
                throw new Error(`Dimension ${dim} must be >= 0`);
            }
            if (dim < -1) {
                throw new Error(`Dimension ${dim} must be >= -1`);
            }
            dim = -1;
        }
        out.push(dim);
    }
    return out;
}
export function raggedTensorToTensorImpl(shape, shapesShape, values, valuesShape, valuesDType, defaultValue, defaultValueShape, rowPartitionValues, rowPartitionValuesShapes, rowPartitionTypes) {
    return new RaggedTensorToTensorOp(shape, shapesShape, values, valuesShape, valuesDType, defaultValue, defaultValueShape, rowPartitionValues, rowPartitionValuesShapes, rowPartitionTypes)
        .compute();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmFnZ2VkVGVuc29yVG9UZW5zb3JfaW1wbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC1jcHUvc3JjL2tlcm5lbHMvUmFnZ2VkVGVuc29yVG9UZW5zb3JfaW1wbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFFLFdBQVcsRUFBWSxPQUFPLEVBQUUsSUFBSSxFQUFjLElBQUksRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRTNHLElBQU8sZ0JBQWdCLEdBQUcsWUFBWSxDQUFDLGdCQUFnQixDQUFDO0FBQ3hELFdBQVc7QUFDWCw2R0FBNkc7QUFDN0csTUFBTSxzQkFBc0I7SUFHMUIsWUFDWSxLQUFpQixFQUFVLFVBQW9CLEVBQy9DLE1BQWtCLEVBQVUsV0FBcUIsRUFDakQsV0FBcUIsRUFBVSxZQUF3QixFQUN2RCxpQkFBMkIsRUFDbEIsa0JBQWdDLEVBQ2hDLHdCQUFvQyxFQUNyRCx1QkFBaUM7UUFOekIsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUFVLGVBQVUsR0FBVixVQUFVLENBQVU7UUFDL0MsV0FBTSxHQUFOLE1BQU0sQ0FBWTtRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFVO1FBQ2pELGdCQUFXLEdBQVgsV0FBVyxDQUFVO1FBQVUsaUJBQVksR0FBWixZQUFZLENBQVk7UUFDdkQsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFVO1FBQ2xCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBYztRQUNoQyw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQVk7UUFFdkQsSUFBSSxDQUFDLGlCQUFpQjtZQUNsQixZQUFZLENBQUMsMEJBQTBCLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNyRSxJQUFJLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDdkUsQ0FBQztJ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QUVELE1BQU0sVUFBVSx3QkFBd0IsQ0FDcEMsS0FBaUIsRUFBRSxXQUFxQixFQUFFLE1BQWtCLEVBQzVELFdBQXFCLEVBQUUsV0FBcUIsRUFBRSxZQUF3QixFQUN0RSxpQkFBMkIsRUFBRSxrQkFBZ0MsRUFDN0Qsd0JBQW9DLEVBQ3BDLGlCQUEyQjtJQUM3QixPQUFPLElBQUksc0JBQXNCLENBQ3RCLEtBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUNsRSxpQkFBaUIsRUFBRSxrQkFBa0IsRUFBRSx3QkFBd0IsRUFDL0QsaUJBQWlCLENBQUM7U0FDeEIsT0FBTyxFQUFFLENBQUM7QUFDakIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIyIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtiYWNrZW5kX3V0aWwsIGJyb2FkY2FzdFRvLCBEYXRhVHlwZSwgcmVzaGFwZSwgdGlkeSwgVHlwZWRBcnJheSwgdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IFJvd1BhcnRpdGlvblR5cGUgPSBiYWNrZW5kX3V0aWwuUm93UGFydGl0aW9uVHlwZTtcbi8vIEJhc2VkIG9uXG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGVuc29yZmxvdy90ZW5zb3JmbG93L2Jsb2IvbWFzdGVyL3RlbnNvcmZsb3cvY29yZS9rZXJuZWxzL3JhZ2dlZF90ZW5zb3JfdG9fdGVuc29yX29wLmNjXG5jbGFzcyBSYWdnZWRUZW5zb3JUb1RlbnNvck9wIHtcbiAgcHJpdmF0ZSByZWFkb25seSByb3dQYXJ0aXRpb25UeXBlczogUm93UGFydGl0aW9uVHlwZVtdO1xuICBwcml2YXRlIHJlYWRvbmx5IHJhZ2dlZFJhbms6IG51bWJlcjtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHNoYXBlOiBUeXBlZEFycmF5LCBwcml2YXRlIHNoYXBlU2hhcGU6IG51bWJlcltdLFxuICAgICAgcHJpdmF0ZSB2YWx1ZXM6IFR5cGVkQXJyYXksIHByaXZhdGUgdmFsdWVzU2hhcGU6IG51bWJlcltdLFxuICAgICAgcHJpdmF0ZSB2YWx1ZXNEVHlwZTogRGF0YVR5cGUsIHByaXZhdGUgZGVmYXVsdFZhbHVlOiBUeXBlZEFycmF5LFxuICAgICAgcHJpdmF0ZSBkZWZhdWx0VmFsdWVTaGFwZTogbnVtYmVyW10sXG4gICAgICBwcml2YXRlIHJlYWRvbmx5IHJvd1BhcnRpdGlvblZhbHVlczogVHlwZWRBcnJheVtdLFxuICAgICAgcHJpdmF0ZSByZWFkb25seSByb3dQYXJ0aXRpb25WYWx1ZXNTaGFwZXM6IG51bWJlcltdW10sXG4gICAgICByb3dQYXJ0aXRpb25UeXBlU3RyaW5nczogc3RyaW5nW10pIHtcbiAgICB0aGlzLnJvd1BhcnRpdGlvblR5cGVzID1cbiAgICAgICAgYmFja2VuZF91dGlsLmdldFJvd1BhcnRpdGlvblR5cGVzSGVscGVyKHJvd1BhcnRpdGlvblR5cGVTdHJpbmdzKTtcbiAgICB0aGlzLnJhZ2dlZFJhbmsgPSBiYWNrZW5kX3V0aWwuZ2V0UmFnZ2VkUmFuayh0aGlzLnJvd1BhcnRpdGlvblR5cGVzKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Um93UGFydGl0aW9uVHlwZUJ5RGltZW5zaW9uKGRpbWVuc2lvbjogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMucm93UGFydGl0aW9uVHlwZXNbMF0gPT09IFJvd1BhcnRpdGlvblR5cGUuRklSU1RfRElNX1NJWkUpIHtcbiAgICAgIHJldHVybiB0aGlzLnJvd1BhcnRpdGlvblR5cGVzW2RpbWVuc2lvbiArIDFdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yb3dQYXJ0aXRpb25UeXBlc1tkaW1lbnNpb25dO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIHJlbGF0aW9uc2hpcCBiZXR3ZWVuIGRpbWVuc2lvbiBhbmQgZGltZW5zaW9uICsgMS5cbiAgcHJpdmF0ZSBnZXRSb3dQYXJ0aXRpb25UZW5zb3IoZGltZW5zaW9uOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5yb3dQYXJ0aXRpb25UeXBlc1swXSA9PT0gUm93UGFydGl0aW9uVHlwZS5GSVJTVF9ESU1fU0laRSkge1xuICAgICAgcmV0dXJuIHRoaXMucm93UGFydGl0aW9uVmFsdWVzW2RpbWVuc2lvbiArIDFdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yb3dQYXJ0aXRpb25WYWx1ZXNbZGltZW5zaW9uXTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldE1heFdpZHRoKGRpbWVuc2lvbjogbnVtYmVyKSB7XG4gICAgY29uc3Qgcm93UGFydGl0aW9uVGVuc29yID0gdGhpcy5nZXRSb3dQYXJ0aXRpb25UZW5zb3IoZGltZW5zaW9uIC0gMSk7XG4gICAgc3dpdGNoICh0aGlzLmdldFJvd1BhcnRpdGlvblR5cGVCeURpbWVuc2lvbihkaW1lbnNpb24gLSAxKSkge1xuICAgICAgY2FzZSBSb3dQYXJ0aXRpb25UeXBlLlZBTFVFX1JPV0lEUzpcbiAgICAgICAgcmV0dXJuIFJhZ2dlZFRlbnNvclRvVGVuc29yT3AuZ2V0TWF4V2lkdGhWYWx1ZVJvd0lEKHJvd1BhcnRpdGlvblRlbnNvcik7XG4gICAgICBjYXNlIFJvd1BhcnRpdGlvblR5cGUuUk9XX1NQTElUUzpcbiAgICAgICAgcmV0dXJuIFJhZ2dlZFRlbnNvclRvVGVuc29yT3AuZ2V0TWF4V2lkdGhSb3dTcGxpdChyb3dQYXJ0aXRpb25UZW5zb3IpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgaGFuZGxlIHBhcnRpdGlvbiB0eXBlICR7XG4gICAgICAgICAgICBSb3dQYXJ0aXRpb25UeXBlW3RoaXMuZ2V0Um93UGFydGl0aW9uVHlwZUJ5RGltZW5zaW9uKFxuICAgICAgICAgICAgICAgIGRpbWVuc2lvbiAtIDEpXX1gKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZ2V0TWF4V2lkdGhSb3dTcGxpdChyb3dTcGxpdDogVHlwZWRBcnJheSkge1xuICAgIGNvbnN0IHRlbnNvckxlbmd0aCA9IHJvd1NwbGl0Lmxlbmd0aDtcbiAgICBpZiAodGVuc29yTGVuZ3RoID09PSAwIHx8IHRlbnNvckxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGxldCBtYXhXaWR0aCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZW5zb3JMZW5ndGggLSAxOyArK2kpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRXaWR0aCA9IHJvd1NwbGl0W2kgKyAxXSAtIHJvd1NwbGl0W2ldO1xuICAgICAgaWYgKGN1cnJlbnRXaWR0aCA+IG1heFdpZHRoKSB7XG4gICAgICAgIG1heFdpZHRoID0gY3VycmVudFdpZHRoO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWF4V2lkdGg7XG4gIH1cblxuICBzdGF0aWMgZ2V0TWF4V2lkdGhWYWx1ZVJvd0lEKHZhbHVlUm93SWRzOiBUeXBlZEFycmF5KSB7XG4gICAgY29uc3QgaW5kZXhMZW5ndGggPSB2YWx1ZVJvd0lkcy5sZW5ndGg7XG4gICAgaWYgKGluZGV4TGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgbGV0IGZpcnN0RXF1YWxJbmRleCA9IDA7XG4gICAgbGV0IGZpcnN0RXF1YWxJbmRleFZhbHVlID0gdmFsdWVSb3dJZHNbMF07XG4gICAgbGV0IG1heFdpZHRoID0gMDtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGluZGV4TGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdmFsdWVSb3dJZHNbaV07XG4gICAgICBpZiAodmFsdWUgIT09IGZpcnN0RXF1YWxJbmRleFZhbHVlKSB7XG4gICAgICAgIGZpcnN0RXF1YWxJbmRleFZhbHVlID0gdmFsdWU7XG4gICAgICAgIG1heFdpZHRoID0gTWF0aC5tYXgoaSAtIGZpcnN0RXF1YWxJbmRleCwgbWF4V2lkdGgpO1xuICAgICAgICBmaXJzdEVxdWFsSW5kZXggPSBpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gTWF0aC5tYXgoaW5kZXhMZW5ndGggLSBmaXJzdEVxdWFsSW5kZXgsIG1heFdpZHRoKTtcbiAgfVxuXG4gIHByaXZhdGUgdGVuc29yU2hhcGVGcm9tVGVuc29yKFxuICAgICAgdDogVHlwZWRBcnJheSwgdFNoYXBlOiBudW1iZXJbXSwgaXNQYXJ0aWFsID0gdHJ1ZSkge1xuICAgIGlmICh0U2hhcGUubGVuZ3RoID09PSAwKSB7XG4gICAgICBpZiAodFswXSA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBUaGUgb25seSB2YWxpZCBzY2FsYXIgc2hhcGUgdGVuc29yIGlzIHRoZSBmdWxseSB1bmtub3duIHNoYXBlIHNwZWNpZmllZCBhcyAtMS5gKTtcbiAgICB9XG4gICAgLy8gTWFrZVBhcnRpYWxTaGFwZS9NYWtlU2hhcGVIZWxwZXIuXG4gICAgcmV0dXJuIG1ha2VTaGFwZSh0LCBpc1BhcnRpYWwpO1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxjdWxhdGVPdXRwdXRTaXplKGZpcnN0RGltOiBudW1iZXIpIHtcbiAgICBjb25zdCB2YWx1ZVNoYXBlID0gdGhpcy52YWx1ZXNTaGFwZTtcbiAgICBjb25zdCBkZWZhdWx0VmFsdWVTaGFwZSA9IHRoaXMuZGVmYXVsdFZhbHVlU2hhcGU7XG5cbiAgICBiYWNrZW5kX3V0aWwudmFsaWRhdGVEZWZhdWx0VmFsdWVTaGFwZShkZWZhdWx0VmFsdWVTaGFwZSwgdmFsdWVTaGFwZSk7XG5cbiAgICBjb25zdCBzaGFwZSA9IHRoaXMudGVuc29yU2hhcGVGcm9tVGVuc29yKHRoaXMuc2hhcGUsIHRoaXMuc2hhcGVTaGFwZSk7XG4gICAgY29uc3Qgb3V0cHV0U2hhcGUgPSBiYWNrZW5kX3V0aWwuY29tYmluZVJhZ2dlZFRlbnNvclRvVGVuc29yU2hhcGVzKFxuICAgICAgICB0aGlzLnJhZ2dlZFJhbmssIHNoYXBlLCB2YWx1ZVNoYXBlKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IG91dHB1dFNoYXBlO1xuXG4gICAgaWYgKHJlc3VsdFswXSA8IDApIHtcbiAgICAgIHJlc3VsdFswXSA9IGZpcnN0RGltO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSB0aGlzLnJhZ2dlZFJhbms7ICsraSkge1xuICAgICAgaWYgKHJlc3VsdFtpXSA8IDApIHtcbiAgICAgICAgcmVzdWx0W2ldID0gdGhpcy5nZXRNYXhXaWR0aChpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBvdXRwdXRJbmRleCByZXByZXNlbnRzIHRoZSBpbmRleCBpbiB0aGUgb3V0cHV0IHRlbnNvclxuICAgKiB3aGVyZSB0aGUgZmlyc3QgZWxlbWVudCBvZiBhIHBhcnRpY3VsYXIgZGltZW5zaW9uIHdvdWxkIGJlIHdyaXR0ZW4uXG4gICAqIElmIGl0IGlzIC0xLCBpdCBpbmRpY2F0ZXMgdGhhdCB0aGUgaW5kZXggaXMgb3V0IG9mIHNjb3BlLlxuICAgKiBFeGFtcGxlLCBnaXZlbiBmaXJzdERpbWVuc2lvbiA9IDEwLCBmaXJzdERpbWVuc2lvbk91dHB1dCA9IDYsXG4gICAqIGFuZCBvdXRwdXRJbmRleE11bHRpcGxpZXIgPSAxMDA6XG4gICAqIHJlc3VsdCA9IFswIDEwMCAyMDAgMzAwIDQwMCA1MDAgLTEgLTEgLTEgLTFdXG4gICAqIElmIGZpcnN0RGltZW5zaW9uT3V0cHV0ID0gMTEgaW5zdGVhZCwgdGhlbjpcbiAgICogcmVzdWx0ID0gWzAgMTAwIDIwMCAzMDAgNDAwIDUwMCA2MDAgNzAwIDgwMCA5MDBdXG4gICAqL1xuICBwcml2YXRlIGNhbGN1bGF0ZUZpcnN0UGFyZW50T3V0cHV0SW5kZXgoXG4gICAgICBmaXJzdERpbWVuc2lvbjogbnVtYmVyLCBvdXRwdXRJbmRleE11bHRpcGxpZXI6IG51bWJlcixcbiAgICAgIGZpcnN0RGltZW5zaW9uT3V0cHV0OiBudW1iZXIpIHtcbiAgICBjb25zdCBtaW5EaW1lbnNpb24gPSBNYXRoLm1pbihmaXJzdERpbWVuc2lvbiwgZmlyc3REaW1lbnNpb25PdXRwdXQpO1xuICAgIGNvbnN0IHJlc3VsdDogbnVtYmVyW10gPSBbXTtcbiAgICBsZXQgY3VycmVudE91dHB1dEluZGV4ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1pbkRpbWVuc2lvbjtcbiAgICAgICAgICsraSwgY3VycmVudE91dHB1dEluZGV4ICs9IG91dHB1dEluZGV4TXVsdGlwbGllcikge1xuICAgICAgcmVzdWx0LnB1c2goY3VycmVudE91dHB1dEluZGV4KTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IG1pbkRpbWVuc2lvbjsgaSA8IGZpcnN0RGltZW5zaW9uOyArK2kpIHtcbiAgICAgIHJlc3VsdC5wdXNoKC0xKTtcbiAgICB9XG4gICAgdXRpbC5hc3NlcnQoXG4gICAgICAgIHJlc3VsdC5sZW5ndGggPT09IGZpcnN0RGltZW5zaW9uLFxuICAgICAgICAoKSA9PiAnRmluYWwgbGVuZ3RoIG9mIHJlc3VsdCBtdXN0IGJlIGVxdWFsIHRvIGZpcnN0RGltZW5zaW9uLicpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgY2FsY3VsYXRlT3V0cHV0SW5kZXhSb3dTcGxpdChcbiAgICAgIHJvd1NwbGl0OiBUeXBlZEFycmF5LCBwYXJlbnRPdXRwdXRJbmRleDogbnVtYmVyW10sXG4gICAgICBvdXRwdXRJbmRleE11bHRpcGxpZXI6IG51bWJlciwgb3V0cHV0U2l6ZTogbnVtYmVyKSB7XG4gICAgY29uc3Qgcm93U3BsaXRTaXplID0gcm93U3BsaXQubGVuZ3RoO1xuICAgIGNvbnN0IHJlc3VsdDogbnVtYmVyW10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd1NwbGl0U2l6ZSAtIDE7ICsraSkge1xuICAgICAgY29uc3Qgcm93TGVuZ3RoID0gcm93U3BsaXRbaSArIDFdIC0gcm93U3BsaXRbaV07XG4gICAgICBsZXQgcmVhbExlbmd0aCA9IE1hdGgubWluKG91dHB1dFNpemUsIHJvd0xlbmd0aCk7XG4gICAgICBsZXQgcGFyZW50T3V0cHV0SW5kZXhDdXJyZW50ID0gcGFyZW50T3V0cHV0SW5kZXhbaV07XG5cbiAgICAgIGlmIChwYXJlbnRPdXRwdXRJbmRleEN1cnJlbnQgPT09IC0xKSB7XG4gICAgICAgIHJlYWxMZW5ndGggPSAwO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCByZWFsTGVuZ3RoOyArK2opIHtcbiAgICAgICAgcmVzdWx0LnB1c2gocGFyZW50T3V0cHV0SW5kZXhDdXJyZW50KTtcbiAgICAgICAgcGFyZW50T3V0cHV0SW5kZXhDdXJyZW50ICs9IG91dHB1dEluZGV4TXVsdGlwbGllcjtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcm93TGVuZ3RoIC0gcmVhbExlbmd0aDsgKytqKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKC0xKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHJvd1NwbGl0U2l6ZSA+IDAgJiYgcmVzdWx0Lmxlbmd0aCAhPT0gcm93U3BsaXRbcm93U3BsaXRTaXplIC0gMV0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCByb3cgc3BsaXQgc2l6ZS4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gQ2FsY3VsYXRlIHRoZSBvdXRwdXQgaW5kZXggb2YgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYSBsaXN0LlxuICAvLyBUaGUgcGFyZW50T3V0cHV0SW5kZXggaXMgdGhlIHNhbWUgY29tcHV0YXRpb24gZm9yIHRoZSBwcmV2aW91cyBsaXN0LlxuICAvLyAtMSBpbmRpY2F0ZXMgYW4gZWxlbWVudCBvciBsaXN0IHRoYXQgaXMgb3V0IG9mIHJhbmdlLlxuICAvLyBUaGUgb3V0cHV0SW5kZXhNdWx0aXBsaWVyIGlzIHRoZSBudW1iZXIgb2Ygb3V0cHV0IGluZGljZXMgb25lIG1vdmVzXG4gIC8vIGZvcndhcmQgZm9yIGVhY2ggY29sdW1uLlxuICAvLyBFLmcuLCBnaXZlbjpcbiAgLy8gdmFsdWVSb3dJZHM6WzAgMSAyIDIgMiAzIDUgNSA2XVxuICAvLyBwYXJlbnRPdXRwdXRJbmRleDpbMTAwMCAxMTAwIDIwMDAgMjEwMCAtMSAzMDAwIDQwMDBdXG4gIC8vIG91dHB1dEluZGV4TXVsdGlwbGllcjogMTBcbiAgLy8gb3V0cHV0U2l6ZTogMlxuICAvLyBZb3UgZ2V0OlxuICAvLyByZXN1bHQgPSBbMTAwMCAxMTAwIDIwMDAgMjAxMCAtMSAyMTAwIC0xIC0xIDMwMDBdXG4gIC8vIHJlc3VsdFswXSA9IHBhcmVudE91dHB1dEluZGV4W3ZhbHVlUm93SWRzWzBdXVxuICAvLyByZXN1bHRbMV0gPSBwYXJlbnRPdXRwdXRJbmRleFt2YWx1ZVJvd0lkc1sxXV1cbiAgLy8gcmVzdWx0WzJdID0gcGFyZW50T3V0cHV0SW5kZXhbdmFsdWVSb3dJZHNbMl1dXG4gIC8vIHJlc3VsdFszXSA9IHBhcmVudE91dHB1dEluZGV4W3ZhbHVlUm93SWRzWzJdICsgMTBdXG4gIC8vIHJlc3VsdFs0XSA9IC0xIGJlY2F1c2UgaXQgaXMgdGhlIHRoaXJkIGVsZW1lbnQgdGhlIHNpemUgaXMgMi5cbiAgLy8gcmVzdWx0WzVdID0gcGFyZW50T3V0cHV0SW5kZXhbdmFsdWVSb3dJZHNbM11dXG4gIC8vIHJlc3VsdFs2XSA9IC0xIGJlY2F1c2UgcGFyZW50T3V0cHV0SW5kZXhbdmFsdWVSb3dJZHNbNl1dID09IC0xXG4gIC8vIHJlc3VsdFs3XSA9IC0xIGJlY2F1c2UgcGFyZW50T3V0cHV0SW5kZXhbdmFsdWVSb3dJZHNbNl1dID09IC0xXG4gIC8vIHJlc3VsdFs4XSA9IHBhcmVudE91dHB1dEluZGV4W3ZhbHVlUm93SWRzWzddXVxuICBwcml2YXRlIGNhbGN1bGF0ZU91dHB1dEluZGV4VmFsdWVSb3dJRChcbiAgICAgIHZhbHVlUm93SWRzOiBUeXBlZEFycmF5LCBwYXJlbnRPdXRwdXRJbmRleDogbnVtYmVyW10sXG4gICAgICBvdXRwdXRJbmRleE11bHRpcGxpZXI6IG51bWJlciwgb3V0cHV0U2l6ZTogbnVtYmVyKSB7XG4gICAgY29uc3QgaW5kZXhTaXplID0gdmFsdWVSb3dJZHMubGVuZ3RoO1xuICAgIGNvbnN0IHJlc3VsdDogbnVtYmVyW10gPSBbXTtcbiAgICBpZiAoaW5kZXhTaXplID09PSAwKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgbGV0IGN1cnJlbnRPdXRwdXRDb2x1bW4gPSAwO1xuICAgIGxldCBjdXJyZW50VmFsdWVSb3dJZCA9IHZhbHVlUm93SWRzWzBdO1xuXG4gICAgaWYgKGN1cnJlbnRWYWx1ZVJvd0lkID49IHBhcmVudE91dHB1dEluZGV4Lmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBHb3QgY3VycmVudFZhbHVlUm93SWQ9JHtjdXJyZW50VmFsdWVSb3dJZH0sIHdoaWNoIGlzIG5vdCBsZXNzIHRoYW4gJHtcbiAgICAgICAgICAgICAgcGFyZW50T3V0cHV0SW5kZXgubGVuZ3RofWApO1xuICAgIH1cblxuICAgIGxldCBjdXJyZW50T3V0cHV0SW5kZXggPSBwYXJlbnRPdXRwdXRJbmRleFtjdXJyZW50VmFsdWVSb3dJZF07XG4gICAgcmVzdWx0LnB1c2goY3VycmVudE91dHB1dEluZGV4KTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGluZGV4U2l6ZTsgKytpKSB7XG4gICAgICBjb25zdCBuZXh0VmFsdWVSb3dJZCA9IHZhbHVlUm93SWRzW2ldO1xuICAgICAgaWYgKG5leHRWYWx1ZVJvd0lkID09PSBjdXJyZW50VmFsdWVSb3dJZCkge1xuICAgICAgICBpZiAoY3VycmVudE91dHB1dEluZGV4ID49IDApIHtcbiAgICAgICAgICArK2N1cnJlbnRPdXRwdXRDb2x1bW47XG4gICAgICAgICAgaWYgKGN1cnJlbnRPdXRwdXRDb2x1bW4gPCBvdXRwdXRTaXplKSB7XG4gICAgICAgICAgICBjdXJyZW50T3V0cHV0SW5kZXggKz0gb3V0cHV0SW5kZXhNdWx0aXBsaWVyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjdXJyZW50T3V0cHV0SW5kZXggPSAtMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnRPdXRwdXRDb2x1bW4gPSAwO1xuICAgICAgICBjdXJyZW50VmFsdWVSb3dJZCA9IG5leHRWYWx1ZVJvd0lkO1xuXG4gICAgICAgIGlmIChuZXh0VmFsdWVSb3dJZCA+PSBwYXJlbnRPdXRwdXRJbmRleC5sZW5ndGgpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgIGBHb3QgbmV4dFZhbHVlUm93SWQ9JHtuZXh0VmFsdWVSb3dJZH0gd2hpY2ggaXMgbm90IGxlc3MgdGhhbiAke1xuICAgICAgICAgICAgICAgICAgcGFyZW50T3V0cHV0SW5kZXgubGVuZ3RofWApO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudE91dHB1dEluZGV4ID0gcGFyZW50T3V0cHV0SW5kZXhbbmV4dFZhbHVlUm93SWRdO1xuICAgICAgfVxuICAgICAgcmVzdWx0LnB1c2goY3VycmVudE91dHB1dEluZGV4KTtcbiAgICB9XG5cbiAgICBpZiAocmVzdWx0Lmxlbmd0aCAhPT0gdmFsdWVSb3dJZHMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcm93IGlkcy4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxjdWxhdGVPdXRwdXRJbmRleChcbiAgICAgIGRpbWVuc2lvbjogbnVtYmVyLCBwYXJlbnRPdXRwdXRJbmRleDogbnVtYmVyW10sXG4gICAgICBvdXRwdXRJbmRleE11bHRpcGxpZXI6IG51bWJlciwgb3V0cHV0U2l6ZTogbnVtYmVyKSB7XG4gICAgY29uc3Qgcm93UGFydGl0aW9uVGVuc29yID0gdGhpcy5nZXRSb3dQYXJ0aXRpb25UZW5zb3IoZGltZW5zaW9uKTtcbiAgICBjb25zdCBwYXJ0aXRpb25UeXBlID0gdGhpcy5nZXRSb3dQYXJ0aXRpb25UeXBlQnlEaW1lbnNpb24oZGltZW5zaW9uKTtcbiAgICBzd2l0Y2ggKHBhcnRpdGlvblR5cGUpIHtcbiAgICAgIGNhc2UgUm93UGFydGl0aW9uVHlwZS5WQUxVRV9ST1dJRFM6XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZU91dHB1dEluZGV4VmFsdWVSb3dJRChcbiAgICAgICAgICAgIHJvd1BhcnRpdGlvblRlbnNvciwgcGFyZW50T3V0cHV0SW5kZXgsIG91dHB1dEluZGV4TXVsdGlwbGllcixcbiAgICAgICAgICAgIG91dHB1dFNpemUpO1xuICAgICAgY2FzZSBSb3dQYXJ0aXRpb25UeXBlLlJPV19TUExJVFM6XG4gICAgICAgIGlmIChyb3dQYXJ0aXRpb25UZW5zb3IubGVuZ3RoIC0gMSA+IHBhcmVudE91dHB1dEluZGV4Lmxlbmd0aCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgUm93IHBhcnRpdGlvbiBzaXplIGlzIGdyZWF0ZXIgdGhhbiBvdXRwdXQgc2l6ZTogJHtcbiAgICAgICAgICAgICAgcm93UGFydGl0aW9uVGVuc29yLmxlbmd0aCAtIDF9ID4gJHtwYXJlbnRPdXRwdXRJbmRleC5sZW5ndGh9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlT3V0cHV0SW5kZXhSb3dTcGxpdChcbiAgICAgICAgICAgIHJvd1BhcnRpdGlvblRlbnNvciwgcGFyZW50T3V0cHV0SW5kZXgsIG91dHB1dEluZGV4TXVsdGlwbGllcixcbiAgICAgICAgICAgIG91dHB1dFNpemUpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYFVuc3VwcG9ydGVkIHBhcnRpdGlvbiB0eXBlOiAke1Jvd1BhcnRpdGlvblR5cGVbcGFydGl0aW9uVHlwZV19YCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRGaXJzdERpbWVuc2lvblNpemUoKSB7XG4gICAgY29uc3QgZmlyc3RQYXJ0aXRpb25UZW5zb3IgPSB0aGlzLnJvd1BhcnRpdGlvblZhbHVlc1swXTtcbiAgICBpZiAodGhpcy5yb3dQYXJ0aXRpb25UeXBlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gcm93X3BhcnRpdGlvbl90eXBlcyBnaXZlbi4nKTtcbiAgICB9XG4gICAgY29uc3QgZmlyc3RQYXJ0aXRpb25UeXBlID0gdGhpcy5yb3dQYXJ0aXRpb25UeXBlc1swXTtcbiAgICBzd2l0Y2ggKGZpcnN0UGFydGl0aW9uVHlwZSkge1xuICAgICAgY2FzZSBSb3dQYXJ0aXRpb25UeXBlLkZJUlNUX0RJTV9TSVpFOlxuICAgICAgICByZXR1cm4gZmlyc3RQYXJ0aXRpb25UZW5zb3JbMF07XG4gICAgICBjYXNlIFJvd1BhcnRpdGlvblR5cGUuVkFMVUVfUk9XSURTOlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBoYW5kbGUgVkFMVUVfUk9XSURTIGluIGZpcnN0IGRpbWVuc2lvbi4nKTtcbiAgICAgIGNhc2UgUm93UGFydGl0aW9uVHlwZS5ST1dfU1BMSVRTOlxuICAgICAgICByZXR1cm4gdGhpcy5yb3dQYXJ0aXRpb25WYWx1ZXNTaGFwZXNbMF1bMF0gLSAxO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYENhbm5vdCBoYW5kbGUgdHlwZSAke1Jvd1BhcnRpdGlvblR5cGVbZmlyc3RQYXJ0aXRpb25UeXBlXX1gKTtcbiAgICB9XG4gIH1cblxuICBjb21wdXRlKCk6IFtudW1iZXJbXSwgVHlwZWRBcnJheV0ge1xuICAgIGNvbnN0IGZpcnN0UGFydGl0aW9uVGVuc29yID0gdGhpcy5yb3dQYXJ0aXRpb25WYWx1ZXNbMF07XG4gICAgaWYgKGZpcnN0UGFydGl0aW9uVGVuc29yLmxlbmd0aCA8PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ0ludmFsaWQgZmlyc3QgcGFydGl0aW9uIGlucHV0LiAnICtcbiAgICAgICAgICAnVGVuc29yIHJlcXVpcmVzIGF0IGxlYXN0IG9uZSBlbGVtZW50LicpO1xuICAgIH1cbiAgICBjb25zdCBmaXJzdERpbWVuc2lvbiA9IHRoaXMuZ2V0Rmlyc3REaW1lbnNpb25TaXplKCk7XG4gICAgY29uc3Qgb3V0cHV0U2l6ZSA9IHRoaXMuY2FsY3VsYXRlT3V0cHV0U2l6ZShmaXJzdERpbWVuc2lvbik7XG4gICAgY29uc3QgbXVsdGlwbGllcjogbnVtYmVyW10gPSBuZXcgQXJyYXkodGhpcy5yYWdnZWRSYW5rICsgMSk7XG5cbiAgICBtdWx0aXBsaWVyW211bHRpcGxpZXIubGVuZ3RoIC0gMV0gPSAxO1xuICAgIGZvciAobGV0IGkgPSBtdWx0aXBsaWVyLmxlbmd0aCAtIDI7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBtdWx0aXBsaWVyW2ldID0gbXVsdGlwbGllcltpICsgMV0gKiBvdXRwdXRTaXplW2kgKyAxXTtcbiAgICB9XG4gICAgLy8gRnVsbCBzaXplIG9mIHRoZSB0ZW5zb3IuXG4gICAgY29uc3Qgb3V0cHV0U2hhcGU6IG51bWJlcltdID0gbWFrZVNoYXBlKG91dHB1dFNpemUsIGZhbHNlKTtcbiAgICBjb25zdCBvdXRwdXRUZW5zb3IgPVxuICAgICAgICB1dGlsLmdldEFycmF5RnJvbURUeXBlKFxuICAgICAgICAgICAgdGhpcy52YWx1ZXNEVHlwZSwgdXRpbC5zaXplRnJvbVNoYXBlKG91dHB1dFNoYXBlKSkgYXMgVHlwZWRBcnJheTtcblxuICAgIGNvbnN0IGZ1bGxTaXplID0gbXVsdGlwbGllclswXSAqIG91dHB1dFNpemVbMF07XG4gICAgaWYgKGZ1bGxTaXplID4gMCkge1xuICAgICAgbGV0IG91dHB1dEluZGV4ID0gdGhpcy5jYWxjdWxhdGVGaXJzdFBhcmVudE91dHB1dEluZGV4KFxuICAgICAgICAgIGZpcnN0RGltZW5zaW9uLCBtdWx0aXBsaWVyWzBdLCBvdXRwdXRTaXplWzBdKTtcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHRoaXMucmFnZ2VkUmFuazsgKytpKSB7XG4gICAgICAgIGNvbnN0IG5ld091dHB1dEluZGV4ID0gdGhpcy5jYWxjdWxhdGVPdXRwdXRJbmRleChcbiAgICAgICAgICAgIGkgLSAxLCBvdXRwdXRJbmRleCwgbXVsdGlwbGllcltpXSwgb3V0cHV0U2l6ZVtpXSk7XG4gICAgICAgIG91dHB1dEluZGV4ID0gbmV3T3V0cHV0SW5kZXg7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0T3V0cHV0KHRoaXMucmFnZ2VkUmFuaywgb3V0cHV0SW5kZXgsIG91dHB1dFRlbnNvciwgb3V0cHV0U2hhcGUpO1xuICAgIH1cblxuICAgIHJldHVybiBbb3V0cHV0U2hhcGUsIG91dHB1dFRlbnNvcl07XG4gIH1cbiAgc2V0T3V0cHV0KFxuICAgICAgcmFnZ2VkUmFuazogbnVtYmVyLCBvdXRwdXRJbmRleDogbnVtYmVyW10sIG91dHB1dFRlbnNvcjogVHlwZWRBcnJheSxcbiAgICAgIG91dHB1dFNoYXBlOiBudW1iZXJbXSkge1xuICAgIGlmIChvdXRwdXRUZW5zb3IubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWVzQmFzZSA9IHRoaXMudmFsdWVzO1xuICAgIGNvbnN0IG91dHB1dEJhc2UgPSBvdXRwdXRUZW5zb3I7XG5cbiAgICBsZXQgZWxlbWVudFNoYXBlID0gb3V0cHV0U2hhcGUuc2xpY2UoKTtcbiAgICBlbGVtZW50U2hhcGUgPSBlbGVtZW50U2hhcGUuc2xpY2UocmFnZ2VkUmFuayArIDEpO1xuICAgIGNvbnN0IHZhbHVlRWxlbWVudFNpemUgPSB1dGlsLnNpemVGcm9tU2hhcGUoZWxlbWVudFNoYXBlKTtcbiAgICBjb25zdCBvdXRwdXRJbmRleFNpemUgPSBvdXRwdXRJbmRleC5sZW5ndGg7XG5cbiAgICAvLyBCcm9hZGNhc3QgdGhlIGRlZmF1bHQgdmFsdWUgdG8gdmFsdWVfZWxlbWVudF9zaXplLiAgKFdlIGNhbiBza2lwIHRoaXNcbiAgICAvLyBpZiBkZWZhdWx0VmFsdWVUZW5zb3Iuc2l6ZSA9PSAxLCBzaW5jZSB3ZSB1c2UgZmlsbCB3aGVuIHRoYXQncyB0cnVlLilcbiAgICBsZXQgZGVmYXVsdFZhbHVlID0gdGhpcy5kZWZhdWx0VmFsdWU7XG4gICAgaWYgKGRlZmF1bHRWYWx1ZS5sZW5ndGggIT09IHZhbHVlRWxlbWVudFNpemUgJiYgZGVmYXVsdFZhbHVlLmxlbmd0aCAhPT0gMSkge1xuICAgICAgY29uc3Qgc3JjU2hhcGUgPSB0aGlzLmRlZmF1bHRWYWx1ZVNoYXBlO1xuICAgICAgdGlkeSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRWYWx1ZVRlbnNvciA9IHJlc2hhcGUoZGVmYXVsdFZhbHVlLCBzcmNTaGFwZSk7XG4gICAgICAgIGNvbnN0IGJDYXN0RGVmYXVsdCA9IGJyb2FkY2FzdFRvKGRlZmF1bHRWYWx1ZVRlbnNvciwgZWxlbWVudFNoYXBlKTtcbiAgICAgICAgZGVmYXVsdFZhbHVlID0gYkNhc3REZWZhdWx0LmRhdGFTeW5jKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBMb29wIHRocm91Z2ggdGhlIG91dHB1dEluZGV4IGFycmF5LCBmaW5kaW5nIGNvbnRpZ3VvdXMgcmVnaW9ucyB0aGF0XG4gICAgLy8gc2hvdWxkIGJlIGNvcGllZC4gIE9uY2Ugd2UgZmluZCB0aGUgZW5kIG9mIGEgY29udGlndW91cyByZWdpb24sIGNvcHkgaXRcbiAgICAvLyBhbmQgYWRkIGFueSBuZWNlc3NhcnkgcGFkZGluZyAod2l0aCBkZWZhdWx0VmFsdWUpLlxuICAgIGxldCBzcmNTdGFydCA9IDA7ICAvLyBTdGFydCBvZiBjb250aWd1b3VzIHJlZ2lvbiAoaW4gdmFsdWVzKVxuICAgIGxldCBkc3RTdGFydCA9IDA7ICAvLyBEZXN0aW5hdGlvbiBmb3IgY29udGlndW91cyByZWdpb24gKGluIG91dHB1dClcbiAgICBsZXQgZHN0RW5kID0gMDsgICAgLy8gRGVzdGluYXRpb24gZm9yIGNvbnRpZ3VvdXMgcmVnaW9uIChpbiBvdXRwdXQpXG4gICAgZm9yIChsZXQgc3JjSSA9IDA7IHNyY0kgPD0gb3V0cHV0SW5kZXhTaXplOyArK3NyY0kpIHtcbiAgICAgIC8vIGRzdEkgaXMgdGhlIGRlc3RpbmF0aW9uIHdoZXJlIHRoZSB2YWx1ZSBhdCBzcmNJIHNob3VsZCBiZSBjb3BpZWQuXG4gICAgICBsZXQgZHN0SSA9IHNyY0kgPCBvdXRwdXRJbmRleFNpemUgPyBvdXRwdXRJbmRleFtzcmNJXSA6IC0xO1xuXG4gICAgICAvLyBJZiB3ZSdyZSBzdGlsbCBpbiBhIGNvbnRpZ3VvdXMgcmVnaW9uLCB0aGVuIHVwZGF0ZSBkc3RFbmQgZ28gdG8gdGhlXG4gICAgICAvLyBuZXh0IHNyY0kuXG4gICAgICBpZiAoZHN0SSA9PT0gZHN0RW5kKSB7XG4gICAgICAgICsrZHN0RW5kO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gV2UgZm91bmQgdGhlIGVuZCBvZiBjb250aWd1b3VzIHJlZ2lvbi4gIFRoaXMgY2FuIGJlIGJlY2F1c2Ugd2UgZm91bmRcbiAgICAgIC8vIGEgZ2FwIChkc3RJID4gZHN0RW5kKSwgb3IgYSBzb3VyY2UgdmFsdWUgdGhhdCBzaG91bGRuJ3QgYmUgY29waWVkXG4gICAgICAvLyBiZWNhdXNlIGl0J3Mgb3V0LW9mLWJvdW5kcyAoZHN0SSA9PSAtMSksIG9yIHRoZSBlbmQgb2YgdGhlIHRlbnNvclxuICAgICAgLy8gKGRzdEkgPT09IC0xKS5cbiAgICAgIGlmIChkc3RTdGFydCA8IGRzdEVuZCkge1xuICAgICAgICAvLyBDb3B5IHRoZSBjb250aWd1b3VzIHJlZ2lvbi5cbiAgICAgICAgY29uc3Qgc3JjID0gdmFsdWVzQmFzZS5zdWJhcnJheShzcmNTdGFydCAqIHZhbHVlRWxlbWVudFNpemUpO1xuICAgICAgICBjb25zdCBkc3QgPSBvdXRwdXRCYXNlLnN1YmFycmF5KGRzdFN0YXJ0ICogdmFsdWVFbGVtZW50U2l6ZSk7XG4gICAgICAgIGNvbnN0IG5WYWxzID0gKGRzdEVuZCAtIGRzdFN0YXJ0KSAqIHZhbHVlRWxlbWVudFNpemU7XG4gICAgICAgIGNvcHlBcnJheShkc3QsIHNyYywgblZhbHMpO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgYW55IG5lY2Vzc2FyeSBwYWRkaW5nICh3LyBkZWZhdWx0VmFsdWUpLlxuICAgICAgaWYgKHNyY0kgPj0gb3V0cHV0SW5kZXhTaXplKSB7XG4gICAgICAgIC8vIFdlIHJlYWNoZWQgdGhlIGVuZCBvZiB2YWx1ZXM6IHBhZCB0byB0aGUgZW5kIG9mIG91dHB1dC5cbiAgICAgICAgY29uc3Qgb3V0cHV0U2l6ZSA9IG91dHB1dFRlbnNvci5sZW5ndGg7XG4gICAgICAgIGRzdEkgPSBNYXRoLmZsb29yKG91dHB1dFNpemUgLyB2YWx1ZUVsZW1lbnRTaXplKTtcbiAgICAgIH1cbiAgICAgIGlmIChkc3RJID4gZHN0RW5kKSB7XG4gICAgICAgIGlmICh0aGlzLmRlZmF1bHRWYWx1ZS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBvdXRwdXRCYXNlXG4gICAgICAgICAgICAgIC5zdWJhcnJheShkc3RFbmQgKiB2YWx1ZUVsZW1lbnRTaXplLCBkc3RJICogdmFsdWVFbGVtZW50U2l6ZSlcbiAgICAgICAgICAgICAgLmZpbGwodGhpcy5kZWZhdWx0VmFsdWVbMF0pO1xuICAgICAgICAgIGRzdEVuZCA9IGRzdEk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd2hpbGUgKGRzdEkgPiBkc3RFbmQpIHtcbiAgICAgICAgICAgIGNvbnN0IGRzdCA9IG91dHB1dEJhc2Uuc2xpY2UoZHN0RW5kICogdmFsdWVFbGVtZW50U2l6ZSk7XG4gICAgICAgICAgICBjb3B5QXJyYXkoZHN0LCBkZWZhdWx0VmFsdWUsIHZhbHVlRWxlbWVudFNpemUpO1xuICAgICAgICAgICAgKytkc3RFbmQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFVwZGF0ZSBpbmRpY2VzLlxuICAgICAgaWYgKGRzdEkgPCAwKSB7XG4gICAgICAgIC8vIHNyY0kgc2hvdWxkIGJlIHNraXBwZWQgLS0gbGVhdmUgaXQgb3V0IG9mIHRoZSBjb250aWd1b3VzIHJlZ2lvbi5cbiAgICAgICAgc3JjU3RhcnQgPSBzcmNJICsgMTtcbiAgICAgICAgZHN0U3RhcnQgPSBkc3RFbmQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBzcmNJIHNob3VsZCBiZSBjb3BpZWQgLS0gaW5jbHVkZSBpdCBpbiB0aGUgY29udGlndW91cyByZWdpb24uXG4gICAgICAgIHNyY1N0YXJ0ID0gc3JjSTtcbiAgICAgICAgZHN0U3RhcnQgPSBkc3RFbmQ7XG4gICAgICAgIGRzdEVuZCA9IGRzdFN0YXJ0ICsgMTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY29weUFycmF5KGRzdDogVHlwZWRBcnJheSwgc3JjOiBUeXBlZEFycmF5LCBzaXplOiBudW1iZXIpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICBkc3RbaV0gPSBzcmNbaV07XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFrZVNoYXBlKHNoYXBlOiBudW1iZXJbXXxUeXBlZEFycmF5LCBpc1BhcnRpYWw6IGJvb2xlYW4pIHtcbiAgY29uc3Qgb3V0OiBudW1iZXJbXSA9IFtdO1xuICBmb3IgKGxldCBkaW0gb2Ygc2hhcGUpIHtcbiAgICBpZiAoZGltIDwgMCkge1xuICAgICAgaWYgKCFpc1BhcnRpYWwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBEaW1lbnNpb24gJHtkaW19IG11c3QgYmUgPj0gMGApO1xuICAgICAgfVxuICAgICAgaWYgKGRpbSA8IC0xKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRGltZW5zaW9uICR7ZGltfSBtdXN0IGJlID49IC0xYCk7XG4gICAgICB9XG4gICAgICBkaW0gPSAtMTtcbiAgICB9XG4gICAgb3V0LnB1c2goZGltKTtcbiAgfVxuXG4gIHJldHVybiBvdXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByYWdnZWRUZW5zb3JUb1RlbnNvckltcGwoXG4gICAgc2hhcGU6IFR5cGVkQXJyYXksIHNoYXBlc1NoYXBlOiBudW1iZXJbXSwgdmFsdWVzOiBUeXBlZEFycmF5LFxuICAgIHZhbHVlc1NoYXBlOiBudW1iZXJbXSwgdmFsdWVzRFR5cGU6IERhdGFUeXBlLCBkZWZhdWx0VmFsdWU6IFR5cGVkQXJyYXksXG4gICAgZGVmYXVsdFZhbHVlU2hhcGU6IG51bWJlcltdLCByb3dQYXJ0aXRpb25WYWx1ZXM6IFR5cGVkQXJyYXlbXSxcbiAgICByb3dQYXJ0aXRpb25WYWx1ZXNTaGFwZXM6IG51bWJlcltdW10sXG4gICAgcm93UGFydGl0aW9uVHlwZXM6IHN0cmluZ1tdKTogW251bWJlcltdLCBUeXBlZEFycmF5XSB7XG4gIHJldHVybiBuZXcgUmFnZ2VkVGVuc29yVG9UZW5zb3JPcChcbiAgICAgICAgICAgICBzaGFwZSwgc2hhcGVzU2hhcGUsIHZhbHVlcywgdmFsdWVzU2hhcGUsIHZhbHVlc0RUeXBlLCBkZWZhdWx0VmFsdWUsXG4gICAgICAgICAgICAgZGVmYXVsdFZhbHVlU2hhcGUsIHJvd1BhcnRpdGlvblZhbHVlcywgcm93UGFydGl0aW9uVmFsdWVzU2hhcGVzLFxuICAgICAgICAgICAgIHJvd1BhcnRpdGlvblR5cGVzKVxuICAgICAgLmNvbXB1dGUoKTtcbn1cbiJdfQ==