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
import * as util from '../util';
/**
 *
 * @param inputShape Input tensor shape is of the following dimensions:
 *     `[batch, height, width, inChannels]`.
 * @param filterShape The filter shape is of the following dimensions:
 *     `[filterHeight, filterWidth, depth]`.
 * @param strides The strides of the sliding window for each dimension of the
 *     input tensor: `[strideHeight, strideWidth]`.
 *     If `strides` is a single number,
 *     then `strideHeight == strideWidth`.
 * @param pad The type of padding algorithm.
 *    - `same` and stride 1: output will be of same size as input,
 *       regardless of filter size.
 *    - `valid`: output will be smaller than input if filter is larger
 *       than 1*1x1.
 *    - For more info, see this guide:
 *     [https://www.tensorflow.org/api_docs/python/tf/nn/convolution](
 *          https://www.tensorflow.org/api_docs/python/tf/nn/convolution)
 * @param dataFormat The data format of the input and output data.
 *     Defaults to 'NHWC'.
 * @param dilations The dilation rates: `[dilationHeight, dilationWidth]`.
 *     Defaults to `[1, 1]`. If `dilations` is a single number, then
 *     `dilationHeight == dilationWidth`.
 */
export function computeDilation2DInfo(inputShape, filterShape, strides, pad, dataFormat = 'NHWC', dilations) {
    // `computerConv2DInfo` require filterShape to be in the dimension of:
    // `[filterHeight, filterWidth, depth, outDepth]`, dilation2d doesn't have
    // outDepth, it should have the same depth as the input.
    // Input shape: [batch, height, width, inChannels]
    const inputChannels = inputShape[3];
    const $filterShape = [...filterShape, inputChannels];
    const $dataFormat = convertConv2DDataFormat(dataFormat);
    return computeConv2DInfo(inputShape, $filterShape, strides, dilations, pad, null /* roundingMode */, null /* depthWise */, $dataFormat);
}
export function computePool2DInfo(inShape, filterSize, strides, dilations, pad, roundingMode, dataFormat = 'channelsLast') {
    const [filterHeight, filterWidth] = parseTupleParam(filterSize);
    let filterShape;
    if (dataFormat === 'channelsLast') {
        filterShape = [filterHeight, filterWidth, inShape[3], inShape[3]];
    }
    else if (dataFormat === 'channelsFirst') {
        filterShape = [filterHeight, filterWidth, inShape[1], inShape[1]];
    }
    else {
        throw new Error(`Unknown dataFormat ${dataFormat}`);
    }
    return computeConv2DInfo(inShape, filterShape, strides, dilations, pad, roundingMode, false, dataFormat);
}
/**
 * Computes the information for a forward pass of a pooling3D operation.
 */
export function computePool3DInfo(inShape, filterSize, strides, dilations, pad, roundingMode, dataFormat = 'NDHWC') {
    const [filterDepth, filterHeight, filterWidth] = parse3TupleParam(filterSize);
    let filterShape;
    let $dataFormat;
    if (dataFormat === 'NDHWC') {
        $dataFormat = 'channelsLast';
        filterShape =
            [filterDepth, filterHeight, filterWidth, inShape[4], inShape[4]];
    }
    else if (dataFormat === 'NCDHW') {
        $dataFormat = 'channelsFirst';
        filterShape =
            [filterDepth, filterHeight, filterWidth, inShape[1], inShape[1]];
    }
    else {
        throw new Error(`Unknown dataFormat ${dataFormat}`);
    }
    return computeConv3DInfo(inShape, filterShape, strides, dilations, pad, false, $dataFormat, roundingMode);
}
/**
 * Computes the information for a forward pass of a convolution/pooling
 * operation.
 */
export function computeConv2DInfo(inShape, filterShape, strides, dilations, pad, roundingMode, depthwise = false, dataFormat = 'channelsLast') {
    let [batchSize, inHeight, inWidth, inChannels] = [-1, -1, -1, -1];
    if (dataFormat === 'channelsLast') {
        [batchSize, inHeight, inWidth, inChannels] = inShape;
    }
    else if (dataFormat === 'channelsFirst') {
        [batchSize, inChannels, inHeight, inWidth] = inShape;
    }
    else {
        throw new Error(`Unknown dataFormat ${dataFormat}`);
    }
    const [filterHeight, filterWidth, , filterChannels] = filterShape;
    const [strideHeight, strideWidth] = parseTupleParam(strides);
    const [dilationHeight, dilationWidth] = parseTupleParam(dilations);
    const effectiveFilterHeight = getEffectiveFilterSize(filterHeight, dilationHeight);
    const effectiveFilterWidth = getEffectiveFilterSize(filterWidth, dilationWidth);
    const { padInfo, outHeight, outWidth } = getPadAndOutInfo(pad, inHeight, inWidth, strideHeight, strideWidth, effectiveFilterHeight, effectiveFilterWidth, roundingMode, dataFormat);
    const outChannels = depthwise ? filterChannels * inChannels : filterChannels;
    let outShape;
    if (dataFormat === 'channelsFirst') {
        outShape = [batchSize, outChannels, outHeight, outWidth];
    }
    else if (dataFormat === 'channelsLast') {
        outShape = [batchSize, outHeight, outWidth, outChannels];
    }
    return {
        batchSize,
        dataFormat,
        inHeight,
        inWidth,
        inChannels,
        outHeight,
        outWidth,
        outChannels,
        padInfo,
        strideHeight,
        strideWidth,
        filterHeight,
        filterWidth,
        effectiveFilterHeight,
        effectiveFilterWidth,
        dilationHeight,
        dilationWidth,
        inShape,
        outShape,
        filterShape
    };
}
/**
 * Computes the information for a forward pass of a 3D convolution/pooling
 * operation.
 */
export function computeConv3DInfo(inShape, filterShape, strides, dilations, pad, depthwise = false, dataFormat = 'channelsLast', roundingMode) {
    let [batchSize, inDepth, inHeight, inWidth, inChannels] = [-1, -1, -1, -1, -1];
    if (dataFormat === 'channelsLast') {
        [batchSize, inDepth, inHeight, inWidth, inChannels] = inShape;
    }
    else if (dataFormat === 'channelsFirst') {
        [batchSize, inChannels, inDepth, inHeight, inWidth] = inShape;
    }
    else {
        throw new Error(`Unknown dataFormat ${dataFormat}`);
    }
    const [filterDepth, filterHeight, filterWidth, , filterChannels] = filterShape;
    const [strideDepth, strideHeight, strideWidth] = parse3TupleParam(strides);
    const [dilationDepth, dilationHeight, dilationWidth] = parse3TupleParam(dilations);
    const effectiveFilterDepth = getEffectiveFilterSize(filterDepth, dilationDepth);
    const effectiveFilterHeight = getEffectiveFilterSize(filterHeight, dilationHeight);
    const effectiveFilterWidth = getEffectiveFilterSize(filterWidth, dilationWidth);
    const { padInfo, outDepth, outHeight, outWidth } = get3DPadAndOutInfo(pad, inDepth, inHeight, inWidth, strideDepth, strideHeight, strideWidth, effectiveFilterDepth, effectiveFilterHeight, effectiveFilterWidth, roundingMode);
    const outChannels = depthwise ? filterChannels * inChannels : filterChannels;
    let outShape;
    if (dataFormat === 'channelsFirst') {
        outShape = [batchSize, outChannels, outDepth, outHeight, outWidth];
    }
    else if (dataFormat === 'channelsLast') {
        outShape = [batchSize, outDepth, outHeight, outWidth, outChannels];
    }
    return {
        batchSize,
        dataFormat,
        inDepth,
        inHeight,
        inWidth,
        inChannels,
        outDepth,
        outHeight,
        outWidth,
        outChannels,
        padInfo,
        strideDepth,
        strideHeight,
        strideWidth,
        filterDepth,
        filterHeight,
        filterWidth,
        effectiveFilterDepth,
        effectiveFilterHeight,
        effectiveFilterWidth,
        dilationDepth,
        dilationHeight,
        dilationWidth,
        inShape,
        outShape,
        filterShape
    };
}
function computeOutputShape2D(inShape, fieldSize, stride, zeroPad, roundingMode) {
    if (zeroPad == null) {
        zeroPad = computeDefaultPad(inShape, fieldSize, stride);
    }
    const inputRows = inShape[0];
    const inputCols = inShape[1];
    const outputRows = round((inputRows - fieldSize + 2 * zeroPad) / stride + 1, roundingMode);
    const outputCols = round((inputCols - fieldSize + 2 * zeroPad) / stride + 1, roundingMode);
    return [outputRows, outputCols];
}
function computeOutputShape4D(inShape, fieldSize, outChannels, stride, zeroPad, roundingMode) {
    if (zeroPad == null) {
        zeroPad = computeDefaultPad(inShape, fieldSize, stride);
    }
    const inputDepth = inShape[0];
    const inputRows = inShape[1];
    const inputCols = inShape[2];
    const outputDepths = round((inputDepth - fieldSize + 2 * zeroPad) / stride + 1, roundingMode);
    const outputRows = round((inputRows - fieldSize + 2 * zeroPad) / stride + 1, roundingMode);
    const outputCols = round((inputCols - fieldSize + 2 * zeroPad) / stride + 1, roundingMode);
    return [outputDepths, outputRows, outputCols, outChannels];
}
export function computeDefaultPad(inputShape, fieldSize, stride, dilation = 1) {
    const effectiveFieldSize = getEffectiveFilterSize(fieldSize, dilation);
    return Math.floor((inputShape[0] * (stride - 1) - stride + effectiveFieldSize) / 2);
}
function parseTupleParam(param) {
    if (typeof param === 'number') {
        return [param, param, param];
    }
    if (param.length === 2) {
        return [param[0], param[1], 1];
    }
    return param;
}
function parse3TupleParam(param) {
    return typeof param === 'number' ? [param, param, param] : param;
}
/* See https://www.tensorflow.org/api_docs/python/tf/nn/atrous_conv2d
 * Atrous convolution is equivalent to standard convolution with upsampled
 * filters with effective_filter_height =
 * filter_height + (filter_height - 1) * (dilation - 1)
 * and effective_filter_width =
 * filter_width + (filter_width - 1) * (dilation - 1),
 * produced by inserting dilation - 1 zeros along consecutive elements across
 * the filters' spatial dimensions.
 * When there is a dilation, this converts a filter dimension to the
 * effective filter dimension, so it can be used in a standard convolution.
 */
function getEffectiveFilterSize(filterSize, dilation) {
    if (dilation <= 1) {
        return filterSize;
    }
    return filterSize + (filterSize - 1) * (dilation - 1);
}
function getPadAndOutInfo(pad, inHeight, inWidth, strideHeight, strideWidth, filterHeight, filterWidth, roundingMode, dataFormat) {
    let padInfo;
    let outHeight;
    let outWidth;
    if (typeof pad === 'number') {
        const padType = (pad === 0) ? 'VALID' : 'NUMBER';
        padInfo = { top: pad, bottom: pad, left: pad, right: pad, type: padType };
        const outShape = computeOutputShape2D([inHeight, inWidth], filterHeight, strideHeight, pad, roundingMode);
        outHeight = outShape[0];
        outWidth = outShape[1];
    }
    else if (pad === 'same') {
        outHeight = Math.ceil(inHeight / strideHeight);
        outWidth = Math.ceil(inWidth / strideWidth);
        const padAlongHeight = Math.max(0, (outHeight - 1) * strideHeight + filterHeight - inHeight);
        const padAlongWidth = Math.max(0, (outWidth - 1) * strideWidth + filterWidth - inWidth);
        const top = Math.floor(padAlongHeight / 2);
        const bottom = padAlongHeight - top;
        const left = Math.floor(padAlongWidth / 2);
        const right = padAlongWidth - left;
        padInfo = { top, bottom, left, right, type: 'SAME' };
    }
    else if (pad === 'valid') {
        padInfo = { top: 0, bottom: 0, left: 0, right: 0, type: 'VALID' };
        outHeight = Math.ceil((inHeight - filterHeight + 1) / strideHeight);
        outWidth = Math.ceil((inWidth - filterWidth + 1) / strideWidth);
    }
    else if (typeof pad === 'object') {
        const top = dataFormat === 'channelsLast' ? pad[1][0] : pad[2][0];
        const bottom = dataFormat === 'channelsLast' ? pad[1][1] : pad[2][1];
        const left = dataFormat === 'channelsLast' ? pad[2][0] : pad[3][0];
        const right = dataFormat === 'channelsLast' ? pad[2][1] : pad[3][1];
        const padType = (top === 0 && bottom === 0 && left === 0 && right === 0) ?
            'VALID' :
            'EXPLICIT';
        padInfo = { top, bottom, left, right, type: padType };
        outHeight = round((inHeight - filterHeight + top + bottom) / strideHeight + 1, roundingMode);
        outWidth = round((inWidth - filterWidth + left + right) / strideWidth + 1, roundingMode);
    }
    else {
        throw Error(`Unknown padding parameter: ${pad}`);
    }
    return { padInfo, outHeight, outWidth };
}
function get3DPadAndOutInfo(pad, inDepth, inHeight, inWidth, strideDepth, strideHeight, strideWidth, filterDepth, filterHeight, filterWidth, roundingMode) {
    let padInfo;
    let outDepth;
    let outHeight;
    let outWidth;
    if (typeof pad === 'number') {
        const padType = (pad === 0) ? 'VALID' : 'NUMBER';
        padInfo = {
            top: pad,
            bottom: pad,
            left: pad,
            right: pad,
            front: pad,
            back: pad,
            type: padType
        };
        const outShape = computeOutputShape4D([inDepth, inHeight, inWidth, 1], filterDepth, 1, strideDepth, pad, roundingMode);
        outDepth = outShape[0];
        outHeight = outShape[1];
        outWidth = outShape[2];
    }
    else if (pad === 'same') {
        outDepth = Math.ceil(inDepth / strideDepth);
        outHeight = Math.ceil(inHeight / strideHeight);
        outWidth = Math.ceil(inWidth / strideWidth);
        const padAlongDepth = (outDepth - 1) * strideDepth + filterDepth - inDepth;
        const padAlongHeight = (outHeight - 1) * strideHeight + filterHeight - inHeight;
        const padAlongWidth = (outWidth - 1) * strideWidth + filterWidth - inWidth;
        const front = Math.floor(padAlongDepth / 2);
        const back = padAlongDepth - front;
        const top = Math.floor(padAlongHeight / 2);
        const bottom = padAlongHeight - top;
        const left = Math.floor(padAlongWidth / 2);
        const right = padAlongWidth - left;
        padInfo = { top, bottom, left, right, front, back, type: 'SAME' };
    }
    else if (pad === 'valid') {
        padInfo = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            front: 0,
            back: 0,
            type: 'VALID'
        };
        outDepth = Math.ceil((inDepth - filterDepth + 1) / strideDepth);
        outHeight = Math.ceil((inHeight - filterHeight + 1) / strideHeight);
        outWidth = Math.ceil((inWidth - filterWidth + 1) / strideWidth);
    }
    else {
        throw Error(`Unknown padding parameter: ${pad}`);
    }
    return { padInfo, outDepth, outHeight, outWidth };
}
/**
 * Rounds a value depending on the rounding mode
 * @param value
 * @param roundingMode A string from: 'ceil', 'round', 'floor'. If none is
 *     provided, it will default to truncate.
 */
function round(value, roundingMode) {
    if (!roundingMode) {
        return Math.trunc(value);
    }
    switch (roundingMode) {
        case 'round':
            // used for Caffe Conv
            return Math.round(value);
        case 'ceil':
            // used for Caffe Pool
            return Math.ceil(value);
        case 'floor':
            return Math.floor(value);
        default:
            throw new Error(`Unknown roundingMode ${roundingMode}`);
    }
}
export function tupleValuesAreOne(param) {
    const [dimA, dimB, dimC] = parseTupleParam(param);
    return dimA === 1 && dimB === 1 && dimC === 1;
}
export function eitherStridesOrDilationsAreOne(strides, dilations) {
    return tupleValuesAreOne(strides) || tupleValuesAreOne(dilations);
}
/**
 * Convert Conv2D dataFormat from 'NHWC'|'NCHW' to
 *    'channelsLast'|'channelsFirst'
 * @param dataFormat in 'NHWC'|'NCHW' mode
 * @return dataFormat in 'channelsLast'|'channelsFirst' mode
 * @throws unknown dataFormat
 */
export function convertConv2DDataFormat(dataFormat) {
    if (dataFormat === 'NHWC') {
        return 'channelsLast';
    }
    else if (dataFormat === 'NCHW') {
        return 'channelsFirst';
    }
    else {
        throw new Error(`Unknown dataFormat ${dataFormat}`);
    }
}
/**
 * Check validity of pad when using dimRoundingMode.
 * @param opDesc A string of op description
 * @param pad The type of padding algorithm.
 *   - `same` and stride 1: output will be of same size as input,
 *       regardless of filter size.
 *   - `valid` output will be smaller than input if filter is larger
 *       than 1x1.
 *   - For more info, see this guide:
 *     [https://www.tensorflow.org/api_docs/python/tf/nn/convolution](
 *          https://www.tensorflow.org/api_docs/python/tf/nn/convolution)
 * @param dimRoundingMode A string from: 'ceil', 'round', 'floor'. If none is
 *     provided, it will default to truncate.
 * @throws unknown padding parameter
 */
export function checkPadOnDimRoundingMode(opDesc, pad, dimRoundingMode) {
    if (dimRoundingMode != null) {
        if (typeof pad === 'string') {
            throw Error(`Error in ${opDesc}: pad must be an integer when using ` +
                `dimRoundingMode ${dimRoundingMode} but got pad ${pad}.`);
        }
        else if (typeof pad === 'number') {
            util.assert(util.isInt(pad), () => `Error in ${opDesc}: pad must be an integer when using ` +
                `dimRoundingMode ${dimRoundingMode} but got pad ${pad}.`);
        }
        else if (typeof pad === 'object') {
            pad.forEach(p => {
                p.forEach(v => {
                    util.assert(util.isInt(v), () => `Error in ${opDesc}: pad must be an integer when using ` +
                        `dimRoundingMode ${dimRoundingMode} but got pad ${v}.`);
                });
            });
        }
        else {
            throw Error(`Error in ${opDesc}: Unknown padding parameter: ${pad}`);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udl91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvY29udl91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sS0FBSyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBMERoQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Qkc7QUFDSCxNQUFNLFVBQVUscUJBQXFCLENBQ2pDLFVBQTRDLEVBQzVDLFdBQXFDLEVBQUUsT0FBZ0MsRUFDdkUsR0FBMEIsRUFBRSxhQUFxQixNQUFNLEVBQ3ZELFNBQWtDO0lBQ3BDLHNFQUFzRTtJQUN0RSwwRUFBMEU7SUFDMUUsd0RBQXdEO0lBQ3hELGtEQUFrRDtJQUNsRCxNQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEMsTUFBTSxZQUFZLEdBQ2QsQ0FBQyxHQUFHLFdBQVcsRUFBRSxhQUFhLENBQXFDLENBQUM7SUFDeEUsTUFBTSxXQUFXLEdBQUcsdUJBQXVCLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFeEQsT0FBTyxpQkFBaUIsQ0FDcEIsVUFBVSxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFDakQsSUFBSSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDbEUsQ0FBQztBQUVELE1BQU0sVUFBVSxpQkFBaUIsQ0FDN0IsT0FBeUMsRUFDekMsVUFBbUMsRUFBRSxPQUFnQyxFQUNyRSxTQUFrQyxFQUNsQyxHQUEwQyxFQUMxQyxZQUFxQyxFQUNyQyxhQUE2QyxjQUFjO0lBQzdELE1BQU0sQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLEdBQUcsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRWhFLElBQUksV0FBNkMsQ0FBQztJQUNsRCxJQUFJLFVBQVUsS0FBSyxjQUFjLEVB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LEdBQUcsRUFBRSxDQUFDLFlBQVksTUFBTSxzQ0FBc0M7d0JBQzFELG1CQUFtQixlQUFlLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNoRSxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1NBQ0o7YUFBTTtZQUNMLE1BQU0sS0FBSyxDQUFDLFlBQVksTUFBTSxnQ0FBZ0MsR0FBRyxFQUFFLENBQUMsQ0FBQztTQUN0RTtLQUNGO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi91dGlsJztcblxudHlwZSBQYWRUeXBlID0gJ1NBTUUnfCdWQUxJRCd8J05VTUJFUid8J0VYUExJQ0lUJztcblxuLy8gRm9yIE5IV0Mgc2hvdWxkIGJlIGluIHRoZSBmb2xsb3dpbmcgZm9ybTpcbi8vICBbWzAsIDBdLCBbcGFkX3RvcCxwYWRfYm90dG9tXSwgW3BhZF9sZWZ0LCBwYWRfcmlnaHRdLCBbMCwgMF1dXG4vLyBGb3IgTkNIVyBzaG91bGQgYmUgaW4gdGhlIGZvbGxvd2luZyBmb3JtOlxuLy8gIFtbMCwgMF0sIFswLCAwXSwgW3BhZF90b3AscGFkX2JvdHRvbV0sIFtwYWRfbGVmdCwgcGFkX3JpZ2h0XV1cbi8vIFJlZmVyZW5jZTogaHR0cHM6Ly93d3cudGVuc29yZmxvdy5vcmcvYXBpX2RvY3MvcHl0aG9uL3RmL25uL2NvbnYyZFxuZXhwb3J0IHR5cGUgRXhwbGljaXRQYWRkaW5nID1cbiAgICBbW251bWJlciwgbnVtYmVyXSwgW251bWJlciwgbnVtYmVyXSwgW251bWJlciwgbnVtYmVyXSwgW251bWJlciwgbnVtYmVyXV07XG5cbmV4cG9ydCB0eXBlIFBhZEluZm8gPSB7XG4gIHRvcDogbnVtYmVyLFxuICBsZWZ0OiBudW1iZXIsXG4gIHJpZ2h0OiBudW1iZXIsXG4gIGJvdHRvbTogbnVtYmVyLFxuICB0eXBlOiBQYWRUeXBlXG59O1xuXG5leHBvcnQgdHlwZSBQYWRJbmZvM0QgPSB7XG4gIHRvcDogbnVtYmVyLFxuICBsZWZ0OiBudW1iZXIsXG4gIHJpZ2h0OiBudW1iZXIsXG4gIGJvdHRvbTogbnVtYmVyLFxuICBmcm9udDogbnVtYmVyLFxuICBiYWNrOiBudW1iZXIsXG4gIHR5cGU6IFBhZFR5cGVcbn07XG5cbi8qKlxuICogSW5mb3JtYXRpb24gYWJvdXQgdGhlIGZvcndhcmQgcGFzcyBvZiBhIGNvbnZvbHV0aW9uL3Bvb2xpbmcgb3BlcmF0aW9uLlxuICogSXQgaW5jbHVkZXMgaW5wdXQgYW5kIG91dHB1dCBzaGFwZSwgc3RyaWRlcywgZmlsdGVyIHNpemUgYW5kIHBhZGRpbmdcbiAqIGluZm9ybWF0aW9uLlxuICovXG5leHBvcnQgdHlwZSBDb252MkRJbmZvID0ge1xuICBiYXRjaFNpemU6IG51bWJlcixcbiAgaW5IZWlnaHQ6IG51bWJlcixcbiAgaW5XaWR0aDogbnVtYmVyLFxuICBpbkNoYW5uZWxzOiBudW1iZXIsXG4gIG91dEhlaWdodDogbnVtYmVyLFxuICBvdXRXaWR0aDogbnVtYmVyLFxuICBvdXRDaGFubmVsczogbnVtYmVyLFxuICBkYXRhRm9ybWF0OiAnY2hhbm5lbHNGaXJzdCd8J2NoYW5uZWxzTGFzdCcsXG4gIHN0cmlkZUhlaWdodDogbnVtYmVyLFxuICBzdHJpZGVXaWR0aDogbnVtYmVyLFxuICBkaWxhdGlvbkhlaWdodDogbnVtYmVyLFxuICBkaWxhdGlvbldpZHRoOiBudW1iZXIsXG4gIGZpbHRlckhlaWdodDogbnVtYmVyLFxuICBmaWx0ZXJXaWR0aDogbnVtYmVyLFxuICBlZmZlY3RpdmVGaWx0ZXJIZWlnaHQ6IG51bWJlcixcbiAgZWZmZWN0aXZlRmlsdGVyV2lkdGg6IG51bWJlcixcbiAgcGFkSW5mbzogUGFkSW5mbyxcbiAgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sXG4gIG91dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcbiAgZmlsdGVyU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdXG59O1xuXG4vKipcbiAqXG4gKiBAcGFyYW0gaW5wdXRTaGFwZSBJbnB1dCB0ZW5zb3Igc2hhcGUgaXMgb2YgdGhlIGZvbGxvd2luZyBkaW1lbnNpb25zOlxuICogICAgIGBbYmF0Y2gsIGhlaWdodCwgd2lkdGgsIGluQ2hhbm5lbHNdYC5cbiAqIEBwYXJhbSBmaWx0ZXJTaGFwZSBUaGUgZmlsdGVyIHNoYXBlIGlzIG9mIHRoZSBmb2xsb3dpbmcgZGltZW5zaW9uczpcbiAqICAgICBgW2ZpbHRlckhlaWdodCwgZmlsdGVyV2lkdGgsIGRlcHRoXWAuXG4gKiBAcGFyYW0gc3RyaWRlcyBUaGUgc3RyaWRlcyBvZiB0aGUgc2xpZGluZyB3aW5kb3cgZm9yIGVhY2ggZGltZW5zaW9uIG9mIHRoZVxuICogICAgIGlucHV0IHRlbnNvcjogYFtzdHJpZGVIZWlnaHQsIHN0cmlkZVdpZHRoXWAuXG4gKiAgICAgSWYgYHN0cmlkZXNgIGlzIGEgc2luZ2xlIG51bWJlcixcbiAqICAgICB0aGVuIGBzdHJpZGVIZWlnaHQgPT0gc3RyaWRlV2lkdGhgLlxuICogQHBhcmFtIHBhZCBUaGUgdHlwZSBvZiBwYWRkaW5nIGFsZ29yaXRobS5cbiAqICAgIC0gYHNhbWVgIGFuZCBzdHJpZGUgMTogb3V0cHV0IHdpbGwgYmUgb2Ygc2FtZSBzaXplIGFzIGlucHV0LFxuICogICAgICAgcmVnYXJkbGVzcyBvZiBmaWx0ZXIgc2l6ZS5cbiAqICAgIC0gYHZhbGlkYDogb3V0cHV0IHdpbGwgYmUgc21hbGxlciB0aGFuIGlucHV0IGlmIGZpbHRlciBpcyBsYXJnZXJcbiAqICAgICAgIHRoYW4gMSoxeDEuXG4gKiAgICAtIEZvciBtb3JlIGluZm8sIHNlZSB0aGlzIGd1aWRlOlxuICogICAgIFtodHRwczovL3d3dy50ZW5zb3JmbG93Lm9yZy9hcGlfZG9jcy9weXRob24vdGYvbm4vY29udm9sdXRpb25dKFxuICogICAgICAgICAgaHR0cHM6Ly93d3cudGVuc29yZmxvdy5vcmcvYXBpX2RvY3MvcHl0aG9uL3RmL25uL2NvbnZvbHV0aW9uKVxuICogQHBhcmFtIGRhdGFGb3JtYXQgVGhlIGRhdGEgZm9ybWF0IG9mIHRoZSBpbnB1dCBhbmQgb3V0cHV0IGRhdGEuXG4gKiAgICAgRGVmYXVsdHMgdG8gJ05IV0MnLlxuICogQHBhcmFtIGRpbGF0aW9ucyBUaGUgZGlsYXRpb24gcmF0ZXM6IGBbZGlsYXRpb25IZWlnaHQsIGRpbGF0aW9uV2lkdGhdYC5cbiAqICAgICBEZWZhdWx0cyB0byBgWzEsIDFdYC4gSWYgYGRpbGF0aW9uc2AgaXMgYSBzaW5nbGUgbnVtYmVyLCB0aGVuXG4gKiAgICAgYGRpbGF0aW9uSGVpZ2h0ID09IGRpbGF0aW9uV2lkdGhgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZURpbGF0aW9uMkRJbmZvKFxuICAgIGlucHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdLFxuICAgIGZpbHRlclNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sIHN0cmlkZXM6IG51bWJlcnxbbnVtYmVyLCBudW1iZXJdLFxuICAgIHBhZDogJ3NhbWUnfCd2YWxpZCd8bnVtYmVyLCBkYXRhRm9ybWF0OiAnTkhXQycgPSAnTkhXQycsXG4gICAgZGlsYXRpb25zOiBudW1iZXJ8W251bWJlciwgbnVtYmVyXSkge1xuICAvLyBgY29tcHV0ZXJDb252MkRJbmZvYCByZXF1aXJlIGZpbHRlclNoYXBlIHRvIGJlIGluIHRoZSBkaW1lbnNpb24gb2Y6XG4gIC8vIGBbZmlsdGVySGVpZ2h0LCBmaWx0ZXJXaWR0aCwgZGVwdGgsIG91dERlcHRoXWAsIGRpbGF0aW9uMmQgZG9lc24ndCBoYXZlXG4gIC8vIG91dERlcHRoLCBpdCBzaG91bGQgaGF2ZSB0aGUgc2FtZSBkZXB0aCBhcyB0aGUgaW5wdXQuXG4gIC8vIElucHV0IHNoYXBlOiBbYmF0Y2gsIGhlaWdodCwgd2lkdGgsIGluQ2hhbm5lbHNdXG4gIGNvbnN0IGlucHV0Q2hhbm5lbHMgPSBpbnB1dFNoYXBlWzNdO1xuICBjb25zdCAkZmlsdGVyU2hhcGUgPVxuICAgICAgWy4uLmZpbHRlclNoYXBlLCBpbnB1dENoYW5uZWxzXSBhcyBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcbiAgY29uc3QgJGRhdGFGb3JtYXQgPSBjb252ZXJ0Q29udjJERGF0YUZvcm1hdChkYXRhRm9ybWF0KTtcblxuICByZXR1cm4gY29tcHV0ZUNvbnYyREluZm8oXG4gICAgICBpbnB1dFNoYXBlLCAkZmlsdGVyU2hhcGUsIHN0cmlkZXMsIGRpbGF0aW9ucywgcGFkLFxuICAgICAgbnVsbCAvKiByb3VuZGluZ01vZGUgKi8sIG51bGwgLyogZGVwdGhXaXNlICovLCAkZGF0YUZvcm1hdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlUG9vbDJESW5mbyhcbiAgICBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcbiAgICBmaWx0ZXJTaXplOiBbbnVtYmVyLCBudW1iZXJdfG51bWJlciwgc3RyaWRlczogbnVtYmVyfFtudW1iZXIsIG51bWJlcl0sXG4gICAgZGlsYXRpb25zOiBudW1iZXJ8W251bWJlciwgbnVtYmVyXSxcbiAgICBwYWQ6ICdzYW1lJ3wndmFsaWQnfG51bWJlcnxFeHBsaWNpdFBhZGRpbmcsXG4gICAgcm91bmRpbmdNb2RlPzogJ2Zsb29yJ3wncm91bmQnfCdjZWlsJyxcbiAgICBkYXRhRm9ybWF0OiAnY2hhbm5lbHNGaXJzdCd8J2NoYW5uZWxzTGFzdCcgPSAnY2hhbm5lbHNMYXN0Jyk6IENvbnYyREluZm8ge1xuICBjb25zdCBbZmlsdGVySGVpZ2h0LCBmaWx0ZXJXaWR0aF0gPSBwYXJzZVR1cGxlUGFyYW0oZmlsdGVyU2l6ZSk7XG5cbiAgbGV0IGZpbHRlclNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcbiAgaWYgKGRhdGFGb3JtYXQgPT09ICdjaGFubmVsc0xhc3QnKSB7XG4gICAgZmlsdGVyU2hhcGUgPSBbZmlsdGVySGVpZ2h0LCBmaWx0ZXJXaWR0aCwgaW5TaGFwZVszXSwgaW5TaGFwZVszXV07XG4gIH0gZWxzZSBpZiAoZGF0YUZvcm1hdCA9PT0gJ2NoYW5uZWxzRmlyc3QnKSB7XG4gICAgZmlsdGVyU2hhcGUgPSBbZmlsdGVySGVpZ2h0LCBmaWx0ZXJXaWR0aCwgaW5TaGFwZVsxXSwgaW5TaGFwZVsxXV07XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGRhdGFGb3JtYXQgJHtkYXRhRm9ybWF0fWApO1xuICB9XG5cbiAgcmV0dXJuIGNvbXB1dGVDb252MkRJbmZvKFxuICAgICAgaW5TaGFwZSwgZmlsdGVyU2hhcGUsIHN0cmlkZXMsIGRpbGF0aW9ucywgcGFkLCByb3VuZGluZ01vZGUsIGZhbHNlLFxuICAgICAgZGF0YUZvcm1hdCk7XG59XG5cbi8qKlxuICogQ29tcHV0ZXMgdGhlIGluZm9ybWF0aW9uIGZvciBhIGZvcndhcmQgcGFzcyBvZiBhIHBvb2xpbmczRCBvcGVyYXRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlUG9vbDNESW5mbyhcbiAgICBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdLFxuICAgIGZpbHRlclNpemU6IG51bWJlcnxbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sXG4gICAgc3RyaWRlczogbnVtYmVyfFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcbiAgICBkaWxhdGlvbnM6IG51bWJlcnxbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sIHBhZDogJ3NhbWUnfCd2YWxpZCd8bnVtYmVyLFxuICAgIHJvdW5kaW5nTW9kZT86ICdmbG9vcid8J3JvdW5kJ3wnY2VpbCcsXG4gICAgZGF0YUZvcm1hdDogJ05ESFdDJ3wnTkNESFcnID0gJ05ESFdDJyk6IENvbnYzREluZm8ge1xuICBjb25zdCBbZmlsdGVyRGVwdGgsIGZpbHRlckhlaWdodCwgZmlsdGVyV2lkdGhdID0gcGFyc2UzVHVwbGVQYXJhbShmaWx0ZXJTaXplKTtcblxuICBsZXQgZmlsdGVyU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XG4gIGxldCAkZGF0YUZvcm1hdDogJ2NoYW5uZWxzRmlyc3QnfCdjaGFubmVsc0xhc3QnO1xuICBpZiAoZGF0YUZvcm1hdCA9PT0gJ05ESFdDJykge1xuICAgICRkYXRhRm9ybWF0ID0gJ2NoYW5uZWxzTGFzdCc7XG4gICAgZmlsdGVyU2hhcGUgPVxuICAgICAgICBbZmlsdGVyRGVwdGgsIGZpbHRlckhlaWdodCwgZmlsdGVyV2lkdGgsIGluU2hhcGVbNF0sIGluU2hhcGVbNF1dO1xuICB9IGVsc2UgaWYgKGRhdGFGb3JtYXQgPT09ICdOQ0RIVycpIHtcbiAgICAkZGF0YUZvcm1hdCA9ICdjaGFubmVsc0ZpcnN0JztcbiAgICBmaWx0ZXJTaGFwZSA9XG4gICAgICAgIFtmaWx0ZXJEZXB0aCwgZmlsdGVySGVpZ2h0LCBmaWx0ZXJXaWR0aCwgaW5TaGFwZVsxXSwgaW5TaGFwZVsxXV07XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGRhdGFGb3JtYXQgJHtkYXRhRm9ybWF0fWApO1xuICB9XG5cbiAgcmV0dXJuIGNvbXB1dGVDb252M0RJbmZvKFxuICAgICAgaW5TaGFwZSwgZmlsdGVyU2hhcGUsIHN0cmlkZXMsIGRpbGF0aW9ucywgcGFkLCBmYWxzZSwgJGRhdGFGb3JtYXQsXG4gICAgICByb3VuZGluZ01vZGUpO1xufVxuXG4vKipcbiAqIENvbXB1dGVzIHRoZSBpbmZvcm1hdGlvbiBmb3IgYSBmb3J3YXJkIHBhc3Mgb2YgYSBjb252b2x1dGlvbi9wb29saW5nXG4gKiBvcGVyYXRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlQ29udjJESW5mbyhcbiAgICBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcbiAgICBmaWx0ZXJTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sXG4gICAgc3RyaWRlczogbnVtYmVyfFtudW1iZXIsIG51bWJlcl0sIGRpbGF0aW9uczogbnVtYmVyfFtudW1iZXIsIG51bWJlcl0sXG4gICAgcGFkOiAnc2FtZSd8J3ZhbGlkJ3xudW1iZXJ8RXhwbGljaXRQYWRkaW5nLFxuICAgIHJvdW5kaW5nTW9kZT86ICdmbG9vcid8J3JvdW5kJ3wnY2VpbCcsIGRlcHRod2lzZSA9IGZhbHNlLFxuICAgIGRhdGFGb3JtYXQ6ICdjaGFubmVsc0ZpcnN0J3wnY2hhbm5lbHNMYXN0JyA9ICdjaGFubmVsc0xhc3QnKTogQ29udjJESW5mbyB7XG4gIGxldCBbYmF0Y2hTaXplLCBpbkhlaWdodCwgaW5XaWR0aCwgaW5DaGFubmVsc10gPSBbLTEsIC0xLCAtMSwgLTFdO1xuICBpZiAoZGF0YUZvcm1hdCA9PT0gJ2NoYW5uZWxzTGFzdCcpIHtcbiAgICBbYmF0Y2hTaXplLCBpbkhlaWdodCwgaW5XaWR0aCwgaW5DaGFubmVsc10gPSBpblNoYXBlO1xuICB9IGVsc2UgaWYgKGRhdGFGb3JtYXQgPT09ICdjaGFubmVsc0ZpcnN0Jykge1xuICAgIFtiYXRjaFNpemUsIGluQ2hhbm5lbHMsIGluSGVpZ2h0LCBpbldpZHRoXSA9IGluU2hhcGU7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGRhdGFGb3JtYXQgJHtkYXRhRm9ybWF0fWApO1xuICB9XG5cbiAgY29uc3QgW2ZpbHRlckhlaWdodCwgZmlsdGVyV2lkdGgsICwgZmlsdGVyQ2hhbm5lbHNdID0gZmlsdGVyU2hhcGU7XG4gIGNvbnN0IFtzdHJpZGVIZWlnaHQsIHN0cmlkZVdpZHRoXSA9IHBhcnNlVHVwbGVQYXJhbShzdHJpZGVzKTtcbiAgY29uc3QgW2RpbGF0aW9uSGVpZ2h0LCBkaWxhdGlvbldpZHRoXSA9IHBhcnNlVHVwbGVQYXJhbShkaWxhdGlvbnMpO1xuXG4gIGNvbnN0IGVmZmVjdGl2ZUZpbHRlckhlaWdodCA9XG4gICAgICBnZXRFZmZlY3RpdmVGaWx0ZXJTaXplKGZpbHRlckhlaWdodCwgZGlsYXRpb25IZWlnaHQpO1xuICBjb25zdCBlZmZlY3RpdmVGaWx0ZXJXaWR0aCA9XG4gICAgICBnZXRFZmZlY3RpdmVGaWx0ZXJTaXplKGZpbHRlcldpZHRoLCBkaWxhdGlvbldpZHRoKTtcbiAgY29uc3Qge3BhZEluZm8sIG91dEhlaWdodCwgb3V0V2lkdGh9ID0gZ2V0UGFkQW5kT3V0SW5mbyhcbiAgICAgIHBhZCwgaW5IZWlnaHQsIGluV2lkdGgsIHN0cmlkZUhlaWdodCwgc3RyaWRlV2lkdGgsIGVmZmVjdGl2ZUZpbHRlckhlaWdodCxcbiAgICAgIGVmZmVjdGl2ZUZpbHRlcldpZHRoLCByb3VuZGluZ01vZGUsIGRhdGFGb3JtYXQpO1xuXG4gIGNvbnN0IG91dENoYW5uZWxzID0gZGVwdGh3aXNlID8gZmlsdGVyQ2hhbm5lbHMgKiBpbkNoYW5uZWxzIDogZmlsdGVyQ2hhbm5lbHM7XG5cbiAgbGV0IG91dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcbiAgaWYgKGRhdGFGb3JtYXQgPT09ICdjaGFubmVsc0ZpcnN0Jykge1xuICAgIG91dFNoYXBlID0gW2JhdGNoU2l6ZSwgb3V0Q2hhbm5lbHMsIG91dEhlaWdodCwgb3V0V2lkdGhdO1xuICB9IGVsc2UgaWYgKGRhdGFGb3JtYXQgPT09ICdjaGFubmVsc0xhc3QnKSB7XG4gICAgb3V0U2hhcGUgPSBbYmF0Y2hTaXplLCBvdXRIZWlnaHQsIG91dFdpZHRoLCBvdXRDaGFubmVsc107XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGJhdGNoU2l6ZSxcbiAgICBkYXRhRm9ybWF0LFxuICAgIGluSGVpZ2h0LFxuICAgIGluV2lkdGgsXG4gICAgaW5DaGFubmVscyxcbiAgICBvdXRIZWlnaHQsXG4gICAgb3V0V2lkdGgsXG4gICAgb3V0Q2hhbm5lbHMsXG4gICAgcGFkSW5mbyxcbiAgICBzdHJpZGVIZWlnaHQsXG4gICAgc3RyaWRlV2lkdGgsXG4gICAgZmlsdGVySGVpZ2h0LFxuICAgIGZpbHRlcldpZHRoLFxuICAgIGVmZmVjdGl2ZUZpbHRlckhlaWdodCxcbiAgICBlZmZlY3RpdmVGaWx0ZXJXaWR0aCxcbiAgICBkaWxhdGlvbkhlaWdodCxcbiAgICBkaWxhdGlvbldpZHRoLFxuICAgIGluU2hhcGUsXG4gICAgb3V0U2hhcGUsXG4gICAgZmlsdGVyU2hhcGVcbiAgfTtcbn1cblxuLyoqXG4gKiBJbmZvcm1hdGlvbiBhYm91dCB0aGUgZm9yd2FyZCBwYXNzIG9mIGEgM0QgY29udm9sdXRpb24vcG9vbGluZyBvcGVyYXRpb24uXG4gKiBJdCBpbmNsdWRlcyBpbnB1dCBhbmQgb3V0cHV0IHNoYXBlLCBzdHJpZGVzLCBmaWx0ZXIgc2l6ZSBhbmQgcGFkZGluZ1xuICogaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCB0eXBlIENvbnYzREluZm8gPSB7XG4gIGJhdGNoU2l6ZTogbnVtYmVyLFxuICBpbkRlcHRoOiBudW1iZXIsXG4gIGluSGVpZ2h0OiBudW1iZXIsXG4gIGluV2lkdGg6IG51bWJlcixcbiAgaW5DaGFubmVsczogbnVtYmVyLFxuICBvdXREZXB0aDogbnVtYmVyLFxuICBvdXRIZWlnaHQ6IG51bWJlcixcbiAgb3V0V2lkdGg6IG51bWJlcixcbiAgb3V0Q2hhbm5lbHM6IG51bWJlcixcbiAgZGF0YUZvcm1hdDogJ2NoYW5uZWxzRmlyc3QnfCdjaGFubmVsc0xhc3QnLFxuICBzdHJpZGVEZXB0aDogbnVtYmVyLFxuICBzdHJpZGVIZWlnaHQ6IG51bWJlcixcbiAgc3RyaWRlV2lkdGg6IG51bWJlcixcbiAgZGlsYXRpb25EZXB0aDogbnVtYmVyLFxuICBkaWxhdGlvbkhlaWdodDogbnVtYmVyLFxuICBkaWxhdGlvbldpZHRoOiBudW1iZXIsXG4gIGZpbHRlckRlcHRoOiBudW1iZXIsXG4gIGZpbHRlckhlaWdodDogbnVtYmVyLFxuICBmaWx0ZXJXaWR0aDogbnVtYmVyLFxuICBlZmZlY3RpdmVGaWx0ZXJEZXB0aDogbnVtYmVyLFxuICBlZmZlY3RpdmVGaWx0ZXJIZWlnaHQ6IG51bWJlcixcbiAgZWZmZWN0aXZlRmlsdGVyV2lkdGg6IG51bWJlcixcbiAgcGFkSW5mbzogUGFkSW5mbzNELFxuICBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdLFxuICBvdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcbiAgZmlsdGVyU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl1cbn07XG5cbi8qKlxuICogQ29tcHV0ZXMgdGhlIGluZm9ybWF0aW9uIGZvciBhIGZvcndhcmQgcGFzcyBvZiBhIDNEIGNvbnZvbHV0aW9uL3Bvb2xpbmdcbiAqIG9wZXJhdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVDb252M0RJbmZvKFxuICAgIGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sXG4gICAgZmlsdGVyU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sXG4gICAgc3RyaWRlczogbnVtYmVyfFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcbiAgICBkaWxhdGlvbnM6IG51bWJlcnxbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sIHBhZDogJ3NhbWUnfCd2YWxpZCd8bnVtYmVyLFxuICAgIGRlcHRod2lzZSA9IGZhbHNlLFxuICAgIGRhdGFGb3JtYXQ6ICdjaGFubmVsc0ZpcnN0J3wnY2hhbm5lbHNMYXN0JyA9ICdjaGFubmVsc0xhc3QnLFxuICAgIHJvdW5kaW5nTW9kZT86ICdmbG9vcid8J3JvdW5kJ3wnY2VpbCcpOiBDb252M0RJbmZvIHtcbiAgbGV0IFtiYXRjaFNpemUsIGluRGVwdGgsIGluSGVpZ2h0LCBpbldpZHRoLCBpbkNoYW5uZWxzXSA9XG4gICAgICBbLTEsIC0xLCAtMSwgLTEsIC0xXTtcbiAgaWYgKGRhdGFGb3JtYXQgPT09ICdjaGFubmVsc0xhc3QnKSB7XG4gICAgW2JhdGNoU2l6ZSwgaW5EZXB0aCwgaW5IZWlnaHQsIGluV2lkdGgsIGluQ2hhbm5lbHNdID0gaW5TaGFwZTtcbiAgfSBlbHNlIGlmIChkYXRhRm9ybWF0ID09PSAnY2hhbm5lbHNGaXJzdCcpIHtcbiAgICBbYmF0Y2hTaXplLCBpbkNoYW5uZWxzLCBpbkRlcHRoLCBpbkhlaWdodCwgaW5XaWR0aF0gPSBpblNoYXBlO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBkYXRhRm9ybWF0ICR7ZGF0YUZvcm1hdH1gKTtcbiAgfVxuXG4gIGNvbnN0IFtmaWx0ZXJEZXB0aCwgZmlsdGVySGVpZ2h0LCBmaWx0ZXJXaWR0aCwgLCBmaWx0ZXJDaGFubmVsc10gPVxuICAgICAgZmlsdGVyU2hhcGU7XG4gIGNvbnN0IFtzdHJpZGVEZXB0aCwgc3RyaWRlSGVpZ2h0LCBzdHJpZGVXaWR0aF0gPSBwYXJzZTNUdXBsZVBhcmFtKHN0cmlkZXMpO1xuICBjb25zdCBbZGlsYXRpb25EZXB0aCwgZGlsYXRpb25IZWlnaHQsIGRpbGF0aW9uV2lkdGhdID1cbiAgICAgIHBhcnNlM1R1cGxlUGFyYW0oZGlsYXRpb25zKTtcblxuICBjb25zdCBlZmZlY3RpdmVGaWx0ZXJEZXB0aCA9XG4gICAgICBnZXRFZmZlY3RpdmVGaWx0ZXJTaXplKGZpbHRlckRlcHRoLCBkaWxhdGlvbkRlcHRoKTtcbiAgY29uc3QgZWZmZWN0aXZlRmlsdGVySGVpZ2h0ID1cbiAgICAgIGdldEVmZmVjdGl2ZUZpbHRlclNpemUoZmlsdGVySGVpZ2h0LCBkaWxhdGlvbkhlaWdodCk7XG4gIGNvbnN0IGVmZmVjdGl2ZUZpbHRlcldpZHRoID1cbiAgICAgIGdldEVmZmVjdGl2ZUZpbHRlclNpemUoZmlsdGVyV2lkdGgsIGRpbGF0aW9uV2lkdGgpO1xuICBjb25zdCB7cGFkSW5mbywgb3V0RGVwdGgsIG91dEhlaWdodCwgb3V0V2lkdGh9ID0gZ2V0M0RQYWRBbmRPdXRJbmZvKFxuICAgICAgcGFkLCBpbkRlcHRoLCBpbkhlaWdodCwgaW5XaWR0aCwgc3RyaWRlRGVwdGgsIHN0cmlkZUhlaWdodCwgc3RyaWRlV2lkdGgsXG4gICAgICBlZmZlY3RpdmVGaWx0ZXJEZXB0aCwgZWZmZWN0aXZlRmlsdGVySGVpZ2h0LCBlZmZlY3RpdmVGaWx0ZXJXaWR0aCxcbiAgICAgIHJvdW5kaW5nTW9kZSk7XG5cbiAgY29uc3Qgb3V0Q2hhbm5lbHMgPSBkZXB0aHdpc2UgPyBmaWx0ZXJDaGFubmVscyAqIGluQ2hhbm5lbHMgOiBmaWx0ZXJDaGFubmVscztcblxuICBsZXQgb3V0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XG4gIGlmIChkYXRhRm9ybWF0ID09PSAnY2hhbm5lbHNGaXJzdCcpIHtcbiAgICBvdXRTaGFwZSA9IFtiYXRjaFNpemUsIG91dENoYW5uZWxzLCBvdXREZXB0aCwgb3V0SGVpZ2h0LCBvdXRXaWR0aF07XG4gIH0gZWxzZSBpZiAoZGF0YUZvcm1hdCA9PT0gJ2NoYW5uZWxzTGFzdCcpIHtcbiAgICBvdXRTaGFwZSA9IFtiYXRjaFNpemUsIG91dERlcHRoLCBvdXRIZWlnaHQsIG91dFdpZHRoLCBvdXRDaGFubmVsc107XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGJhdGNoU2l6ZSxcbiAgICBkYXRhRm9ybWF0LFxuICAgIGluRGVwdGgsXG4gICAgaW5IZWlnaHQsXG4gICAgaW5XaWR0aCxcbiAgICBpbkNoYW5uZWxzLFxuICAgIG91dERlcHRoLFxuICAgIG91dEhlaWdodCxcbiAgICBvdXRXaWR0aCxcbiAgICBvdXRDaGFubmVscyxcbiAgICBwYWRJbmZvLFxuICAgIHN0cmlkZURlcHRoLFxuICAgIHN0cmlkZUhlaWdodCxcbiAgICBzdHJpZGVXaWR0aCxcbiAgICBmaWx0ZXJEZXB0aCxcbiAgICBmaWx0ZXJIZWlnaHQsXG4gICAgZmlsdGVyV2lkdGgsXG4gICAgZWZmZWN0aXZlRmlsdGVyRGVwdGgsXG4gICAgZWZmZWN0aXZlRmlsdGVySGVpZ2h0LFxuICAgIGVmZmVjdGl2ZUZpbHRlcldpZHRoLFxuICAgIGRpbGF0aW9uRGVwdGgsXG4gICAgZGlsYXRpb25IZWlnaHQsXG4gICAgZGlsYXRpb25XaWR0aCxcbiAgICBpblNoYXBlLFxuICAgIG91dFNoYXBlLFxuICAgIGZpbHRlclNoYXBlXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVPdXRwdXRTaGFwZTJEKFxuICAgIGluU2hhcGU6IFtudW1iZXIsIG51bWJlcl0sIGZpZWxkU2l6ZTogbnVtYmVyLCBzdHJpZGU6IG51bWJlcixcbiAgICB6ZXJvUGFkPzogbnVtYmVyLCByb3VuZGluZ01vZGU/OiAnZmxvb3InfCdyb3VuZCd8J2NlaWwnKTogW251bWJlciwgbnVtYmVyXSB7XG4gIGlmICh6ZXJvUGFkID09IG51bGwpIHtcbiAgICB6ZXJvUGFkID0gY29tcHV0ZURlZmF1bHRQYWQoaW5TaGFwZSwgZmllbGRTaXplLCBzdHJpZGUpO1xuICB9XG4gIGNvbnN0IGlucHV0Um93cyA9IGluU2hhcGVbMF07XG4gIGNvbnN0IGlucHV0Q29scyA9IGluU2hhcGVbMV07XG5cbiAgY29uc3Qgb3V0cHV0Um93cyA9XG4gICAgICByb3VuZCgoaW5wdXRSb3dzIC0gZmllbGRTaXplICsgMiAqIHplcm9QYWQpIC8gc3RyaWRlICsgMSwgcm91bmRpbmdNb2RlKTtcbiAgY29uc3Qgb3V0cHV0Q29scyA9XG4gICAgICByb3VuZCgoaW5wdXRDb2xzIC0gZmllbGRTaXplICsgMiAqIHplcm9QYWQpIC8gc3RyaWRlICsgMSwgcm91bmRpbmdNb2RlKTtcblxuICByZXR1cm4gW291dHB1dFJvd3MsIG91dHB1dENvbHNdO1xufVxuXG5mdW5jdGlvbiBjb21wdXRlT3V0cHV0U2hhcGU0RChcbiAgICBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSwgZmllbGRTaXplOiBudW1iZXIsXG4gICAgb3V0Q2hhbm5lbHM6IG51bWJlciwgc3RyaWRlOiBudW1iZXIsIHplcm9QYWQ/OiBudW1iZXIsXG4gICAgcm91bmRpbmdNb2RlPzogJ2Zsb29yJ3wncm91bmQnfCdjZWlsJyk6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdIHtcbiAgaWYgKHplcm9QYWQgPT0gbnVsbCkge1xuICAgIHplcm9QYWQgPSBjb21wdXRlRGVmYXVsdFBhZChpblNoYXBlLCBmaWVsZFNpemUsIHN0cmlkZSk7XG4gIH1cbiAgY29uc3QgaW5wdXREZXB0aCA9IGluU2hhcGVbMF07XG4gIGNvbnN0IGlucHV0Um93cyA9IGluU2hhcGVbMV07XG4gIGNvbnN0IGlucHV0Q29scyA9IGluU2hhcGVbMl07XG5cbiAgY29uc3Qgb3V0cHV0RGVwdGhzID1cbiAgICAgIHJvdW5kKChpbnB1dERlcHRoIC0gZmllbGRTaXplICsgMiAqIHplcm9QYWQpIC8gc3RyaWRlICsgMSwgcm91bmRpbmdNb2RlKTtcbiAgY29uc3Qgb3V0cHV0Um93cyA9XG4gICAgICByb3VuZCgoaW5wdXRSb3dzIC0gZmllbGRTaXplICsgMiAqIHplcm9QYWQpIC8gc3RyaWRlICsgMSwgcm91bmRpbmdNb2RlKTtcbiAgY29uc3Qgb3V0cHV0Q29scyA9XG4gICAgICByb3VuZCgoaW5wdXRDb2xzIC0gZmllbGRTaXplICsgMiAqIHplcm9QYWQpIC8gc3RyaWRlICsgMSwgcm91bmRpbmdNb2RlKTtcblxuICByZXR1cm4gW291dHB1dERlcHRocywgb3V0cHV0Um93cywgb3V0cHV0Q29scywgb3V0Q2hhbm5lbHNdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZURlZmF1bHRQYWQoXG4gICAgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyXXxbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcbiAgICBmaWVsZFNpemU6IG51bWJlciwgc3RyaWRlOiBudW1iZXIsIGRpbGF0aW9uID0gMSk6IG51bWJlciB7XG4gIGNvbnN0IGVmZmVjdGl2ZUZpZWxkU2l6ZSA9IGdldEVmZmVjdGl2ZUZpbHRlclNpemUoZmllbGRTaXplLCBkaWxhdGlvbik7XG4gIHJldHVybiBNYXRoLmZsb29yKFxuICAgICAgKGlucHV0U2hhcGVbMF0gKiAoc3RyaWRlIC0gMSkgLSBzdHJpZGUgKyBlZmZlY3RpdmVGaWVsZFNpemUpIC8gMik7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVHVwbGVQYXJhbShwYXJhbTogbnVtYmVyfG51bWJlcltdKTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdIHtcbiAgaWYgKHR5cGVvZiBwYXJhbSA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gW3BhcmFtLCBwYXJhbSwgcGFyYW1dO1xuICB9XG4gIGlmIChwYXJhbS5sZW5ndGggPT09IDIpIHtcbiAgICByZXR1cm4gW3BhcmFtWzBdLCBwYXJhbVsxXSwgMV07XG4gIH1cbiAgcmV0dXJuIHBhcmFtIGFzIFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcbn1cblxuZnVuY3Rpb24gcGFyc2UzVHVwbGVQYXJhbShwYXJhbTogbnVtYmVyfFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSk6XG4gICAgW251bWJlciwgbnVtYmVyLCBudW1iZXJdIHtcbiAgcmV0dXJuIHR5cGVvZiBwYXJhbSA9PT0gJ251bWJlcicgPyBbcGFyYW0sIHBhcmFtLCBwYXJhbV0gOiBwYXJhbTtcbn1cblxuLyogU2VlIGh0dHBzOi8vd3d3LnRlbnNvcmZsb3cub3JnL2FwaV9kb2NzL3B5dGhvbi90Zi9ubi9hdHJvdXNfY29udjJkXG4gKiBBdHJvdXMgY29udm9sdXRpb24gaXMgZXF1aXZhbGVudCB0byBzdGFuZGFyZCBjb252b2x1dGlvbiB3aXRoIHVwc2FtcGxlZFxuICogZmlsdGVycyB3aXRoIGVmZmVjdGl2ZV9maWx0ZXJfaGVpZ2h0ID1cbiAqIGZpbHRlcl9oZWlnaHQgKyAoZmlsdGVyX2hlaWdodCAtIDEpICogKGRpbGF0aW9uIC0gMSlcbiAqIGFuZCBlZmZlY3RpdmVfZmlsdGVyX3dpZHRoID1cbiAqIGZpbHRlcl93aWR0aCArIChmaWx0ZXJfd2lkdGggLSAxKSAqIChkaWxhdGlvbiAtIDEpLFxuICogcHJvZHVjZWQgYnkgaW5zZXJ0aW5nIGRpbGF0aW9uIC0gMSB6ZXJvcyBhbG9uZyBjb25zZWN1dGl2ZSBlbGVtZW50cyBhY3Jvc3NcbiAqIHRoZSBmaWx0ZXJzJyBzcGF0aWFsIGRpbWVuc2lvbnMuXG4gKiBXaGVuIHRoZXJlIGlzIGEgZGlsYXRpb24sIHRoaXMgY29udmVydHMgYSBmaWx0ZXIgZGltZW5zaW9uIHRvIHRoZVxuICogZWZmZWN0aXZlIGZpbHRlciBkaW1lbnNpb24sIHNvIGl0IGNhbiBiZSB1c2VkIGluIGEgc3RhbmRhcmQgY29udm9sdXRpb24uXG4gKi9cbmZ1bmN0aW9uIGdldEVmZmVjdGl2ZUZpbHRlclNpemUoZmlsdGVyU2l6ZTogbnVtYmVyLCBkaWxhdGlvbjogbnVtYmVyKSB7XG4gIGlmIChkaWxhdGlvbiA8PSAxKSB7XG4gICAgcmV0dXJuIGZpbHRlclNpemU7XG4gIH1cblxuICByZXR1cm4gZmlsdGVyU2l6ZSArIChmaWx0ZXJTaXplIC0gMSkgKiAoZGlsYXRpb24gLSAxKTtcbn1cblxuZnVuY3Rpb24gZ2V0UGFkQW5kT3V0SW5mbyhcbiAgICBwYWQ6ICdzYW1lJ3wndmFsaWQnfG51bWJlcnxFeHBsaWNpdFBhZGRpbmcsIGluSGVpZ2h0OiBudW1iZXIsXG4gICAgaW5XaWR0aDogbnVtYmVyLCBzdHJpZGVIZWlnaHQ6IG51bWJlciwgc3RyaWRlV2lkdGg6IG51bWJlcixcbiAgICBmaWx0ZXJIZWlnaHQ6IG51bWJlciwgZmlsdGVyV2lkdGg6IG51bWJlcixcbiAgICByb3VuZGluZ01vZGU6ICdmbG9vcid8J3JvdW5kJ3wnY2VpbCcsXG4gICAgZGF0YUZvcm1hdDogJ2NoYW5uZWxzRmlyc3QnfFxuICAgICdjaGFubmVsc0xhc3QnKToge3BhZEluZm86IFBhZEluZm8sIG91dEhlaWdodDogbnVtYmVyLCBvdXRXaWR0aDogbnVtYmVyfSB7XG4gIGxldCBwYWRJbmZvOiBQYWRJbmZvO1xuICBsZXQgb3V0SGVpZ2h0OiBudW1iZXI7XG4gIGxldCBvdXRXaWR0aDogbnVtYmVyO1xuXG4gIGlmICh0eXBlb2YgcGFkID09PSAnbnVtYmVyJykge1xuICAgIGNvbnN0IHBhZFR5cGUgPSAocGFkID09PSAwKSA/ICdWQUxJRCcgOiAnTlVNQkVSJztcbiAgICBwYWRJbmZvID0ge3RvcDogcGFkLCBib3R0b206IHBhZCwgbGVmdDogcGFkLCByaWdodDogcGFkLCB0eXBlOiBwYWRUeXBlfTtcbiAgICBjb25zdCBvdXRTaGFwZSA9IGNvbXB1dGVPdXRwdXRTaGFwZTJEKFxuICAgICAgICBbaW5IZWlnaHQsIGluV2lkdGhdLCBmaWx0ZXJIZWlnaHQsIHN0cmlkZUhlaWdodCwgcGFkLCByb3VuZGluZ01vZGUpO1xuICAgIG91dEhlaWdodCA9IG91dFNoYXBlWzBdO1xuICAgIG91dFdpZHRoID0gb3V0U2hhcGVbMV07XG4gIH0gZWxzZSBpZiAocGFkID09PSAnc2FtZScpIHtcbiAgICBvdXRIZWlnaHQgPSBNYXRoLmNlaWwoaW5IZWlnaHQgLyBzdHJpZGVIZWlnaHQpO1xuICAgIG91dFdpZHRoID0gTWF0aC5jZWlsKGluV2lkdGggLyBzdHJpZGVXaWR0aCk7XG4gICAgY29uc3QgcGFkQWxvbmdIZWlnaHQgPVxuICAgICAgICBNYXRoLm1heCgwLCAob3V0SGVpZ2h0IC0gMSkgKiBzdHJpZGVIZWlnaHQgKyBmaWx0ZXJIZWlnaHQgLSBpbkhlaWdodCk7XG4gICAgY29uc3QgcGFkQWxvbmdXaWR0aCA9XG4gICAgICAgIE1hdGgubWF4KDAsIChvdXRXaWR0aCAtIDEpICogc3RyaWRlV2lkdGggKyBmaWx0ZXJXaWR0aCAtIGluV2lkdGgpO1xuICAgIGNvbnN0IHRvcCA9IE1hdGguZmxvb3IocGFkQWxvbmdIZWlnaHQgLyAyKTtcbiAgICBjb25zdCBib3R0b20gPSBwYWRBbG9uZ0hlaWdodCAtIHRvcDtcbiAgICBjb25zdCBsZWZ0ID0gTWF0aC5mbG9vcihwYWRBbG9uZ1dpZHRoIC8gMik7XG4gICAgY29uc3QgcmlnaHQgPSBwYWRBbG9uZ1dpZHRoIC0gbGVmdDtcbiAgICBwYWRJbmZvID0ge3RvcCwgYm90dG9tLCBsZWZ0LCByaWdodCwgdHlwZTogJ1NBTUUnfTtcbiAgfSBlbHNlIGlmIChwYWQgPT09ICd2YWxpZCcpIHtcbiAgICBwYWRJbmZvID0ge3RvcDogMCwgYm90dG9tOiAwLCBsZWZ0OiAwLCByaWdodDogMCwgdHlwZTogJ1ZBTElEJ307XG4gICAgb3V0SGVpZ2h0ID0gTWF0aC5jZWlsKChpbkhlaWdodCAtIGZpbHRlckhlaWdodCArIDEpIC8gc3RyaWRlSGVpZ2h0KTtcbiAgICBvdXRXaWR0aCA9IE1hdGguY2VpbCgoaW5XaWR0aCAtIGZpbHRlcldpZHRoICsgMSkgLyBzdHJpZGVXaWR0aCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHBhZCA9PT0gJ29iamVjdCcpIHtcbiAgICBjb25zdCB0b3AgPSBkYXRhRm9ybWF0ID09PSAnY2hhbm5lbHNMYXN0JyA/IHBhZFsxXVswXSA6IHBhZFsyXVswXTtcbiAgICBjb25zdCBib3R0b20gPSBkYXRhRm9ybWF0ID09PSAnY2hhbm5lbHNMYXN0JyA/IHBhZFsxXVsxXSA6IHBhZFsyXVsxXTtcbiAgICBjb25zdCBsZWZ0ID0gZGF0YUZvcm1hdCA9PT0gJ2NoYW5uZWxzTGFzdCcgPyBwYWRbMl1bMF0gOiBwYWRbM11bMF07XG4gICAgY29uc3QgcmlnaHQgPSBkYXRhRm9ybWF0ID09PSAnY2hhbm5lbHNMYXN0JyA/IHBhZFsyXVsxXSA6IHBhZFszXVsxXTtcbiAgICBjb25zdCBwYWRUeXBlID0gKHRvcCA9PT0gMCAmJiBib3R0b20gPT09IDAgJiYgbGVmdCA9PT0gMCAmJiByaWdodCA9PT0gMCkgP1xuICAgICAgICAnVkFMSUQnIDpcbiAgICAgICAgJ0VYUExJQ0lUJztcbiAgICBwYWRJbmZvID0ge3RvcCwgYm90dG9tLCBsZWZ0LCByaWdodCwgdHlwZTogcGFkVHlwZX07XG4gICAgb3V0SGVpZ2h0ID0gcm91bmQoXG4gICAgICAgIChpbkhlaWdodCAtIGZpbHRlckhlaWdodCArIHRvcCArIGJvdHRvbSkgLyBzdHJpZGVIZWlnaHQgKyAxLFxuICAgICAgICByb3VuZGluZ01vZGUpO1xuICAgIG91dFdpZHRoID0gcm91bmQoXG4gICAgICAgIChpbldpZHRoIC0gZmlsdGVyV2lkdGggKyBsZWZ0ICsgcmlnaHQpIC8gc3RyaWRlV2lkdGggKyAxLCByb3VuZGluZ01vZGUpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IEVycm9yKGBVbmtub3duIHBhZGRpbmcgcGFyYW1ldGVyOiAke3BhZH1gKTtcbiAgfVxuICByZXR1cm4ge3BhZEluZm8sIG91dEhlaWdodCwgb3V0V2lkdGh9O1xufVxuXG5mdW5jdGlvbiBnZXQzRFBhZEFuZE91dEluZm8oXG4gICAgcGFkOiAnc2FtZSd8J3ZhbGlkJ3xudW1iZXIsIGluRGVwdGg6IG51bWJlciwgaW5IZWlnaHQ6IG51bWJlcixcbiAgICBpbldpZHRoOiBudW1iZXIsIHN0cmlkZURlcHRoOiBudW1iZXIsIHN0cmlkZUhlaWdodDogbnVtYmVyLFxuICAgIHN0cmlkZVdpZHRoOiBudW1iZXIsIGZpbHRlckRlcHRoOiBudW1iZXIsIGZpbHRlckhlaWdodDogbnVtYmVyLFxuICAgIGZpbHRlcldpZHRoOiBudW1iZXIsIHJvdW5kaW5nTW9kZT86ICdmbG9vcid8J3JvdW5kJ3wnY2VpbCcpOiB7XG4gIHBhZEluZm86IFBhZEluZm8zRCxcbiAgb3V0RGVwdGg6IG51bWJlcixcbiAgb3V0SGVpZ2h0OiBudW1iZXIsXG4gIG91dFdpZHRoOiBudW1iZXJcbn0ge1xuICBsZXQgcGFkSW5mbzogUGFkSW5mbzNEO1xuICBsZXQgb3V0RGVwdGg6IG51bWJlcjtcbiAgbGV0IG91dEhlaWdodDogbnVtYmVyO1xuICBsZXQgb3V0V2lkdGg6IG51bWJlcjtcblxuICBpZiAodHlwZW9mIHBhZCA9PT0gJ251bWJlcicpIHtcbiAgICBjb25zdCBwYWRUeXBlID0gKHBhZCA9PT0gMCkgPyAnVkFMSUQnIDogJ05VTUJFUic7XG4gICAgcGFkSW5mbyA9IHtcbiAgICAgIHRvcDogcGFkLFxuICAgICAgYm90dG9tOiBwYWQsXG4gICAgICBsZWZ0OiBwYWQsXG4gICAgICByaWdodDogcGFkLFxuICAgICAgZnJvbnQ6IHBhZCxcbiAgICAgIGJhY2s6IHBhZCxcbiAgICAgIHR5cGU6IHBhZFR5cGVcbiAgICB9O1xuICAgIGNvbnN0IG91dFNoYXBlID0gY29tcHV0ZU91dHB1dFNoYXBlNEQoXG4gICAgICAgIFtpbkRlcHRoLCBpbkhlaWdodCwgaW5XaWR0aCwgMV0sIGZpbHRlckRlcHRoLCAxLCBzdHJpZGVEZXB0aCwgcGFkLFxuICAgICAgICByb3VuZGluZ01vZGUpO1xuICAgIG91dERlcHRoID0gb3V0U2hhcGVbMF07XG4gICAgb3V0SGVpZ2h0ID0gb3V0U2hhcGVbMV07XG4gICAgb3V0V2lkdGggPSBvdXRTaGFwZVsyXTtcbiAgfSBlbHNlIGlmIChwYWQgPT09ICdzYW1lJykge1xuICAgIG91dERlcHRoID0gTWF0aC5jZWlsKGluRGVwdGggLyBzdHJpZGVEZXB0aCk7XG4gICAgb3V0SGVpZ2h0ID0gTWF0aC5jZWlsKGluSGVpZ2h0IC8gc3RyaWRlSGVpZ2h0KTtcbiAgICBvdXRXaWR0aCA9IE1hdGguY2VpbChpbldpZHRoIC8gc3RyaWRlV2lkdGgpO1xuICAgIGNvbnN0IHBhZEFsb25nRGVwdGggPSAob3V0RGVwdGggLSAxKSAqIHN0cmlkZURlcHRoICsgZmlsdGVyRGVwdGggLSBpbkRlcHRoO1xuICAgIGNvbnN0IHBhZEFsb25nSGVpZ2h0ID1cbiAgICAgICAgKG91dEhlaWdodCAtIDEpICogc3RyaWRlSGVpZ2h0ICsgZmlsdGVySGVpZ2h0IC0gaW5IZWlnaHQ7XG4gICAgY29uc3QgcGFkQWxvbmdXaWR0aCA9IChvdXRXaWR0aCAtIDEpICogc3RyaWRlV2lkdGggKyBmaWx0ZXJXaWR0aCAtIGluV2lkdGg7XG4gICAgY29uc3QgZnJvbnQgPSBNYXRoLmZsb29yKHBhZEFsb25nRGVwdGggLyAyKTtcbiAgICBjb25zdCBiYWNrID0gcGFkQWxvbmdEZXB0aCAtIGZyb250O1xuICAgIGNvbnN0IHRvcCA9IE1hdGguZmxvb3IocGFkQWxvbmdIZWlnaHQgLyAyKTtcbiAgICBjb25zdCBib3R0b20gPSBwYWRBbG9uZ0hlaWdodCAtIHRvcDtcbiAgICBjb25zdCBsZWZ0ID0gTWF0aC5mbG9vcihwYWRBbG9uZ1dpZHRoIC8gMik7XG4gICAgY29uc3QgcmlnaHQgPSBwYWRBbG9uZ1dpZHRoIC0gbGVmdDtcblxuICAgIHBhZEluZm8gPSB7dG9wLCBib3R0b20sIGxlZnQsIHJpZ2h0LCBmcm9udCwgYmFjaywgdHlwZTogJ1NBTUUnfTtcbiAgfSBlbHNlIGlmIChwYWQgPT09ICd2YWxpZCcpIHtcbiAgICBwYWRJbmZvID0ge1xuICAgICAgdG9wOiAwLFxuICAgICAgYm90dG9tOiAwLFxuICAgICAgbGVmdDogMCxcbiAgICAgIHJpZ2h0OiAwLFxuICAgICAgZnJvbnQ6IDAsXG4gICAgICBiYWNrOiAwLFxuICAgICAgdHlwZTogJ1ZBTElEJ1xuICAgIH07XG4gICAgb3V0RGVwdGggPSBNYXRoLmNlaWwoKGluRGVwdGggLSBmaWx0ZXJEZXB0aCArIDEpIC8gc3RyaWRlRGVwdGgpO1xuICAgIG91dEhlaWdodCA9IE1hdGguY2VpbCgoaW5IZWlnaHQgLSBmaWx0ZXJIZWlnaHQgKyAxKSAvIHN0cmlkZUhlaWdodCk7XG4gICAgb3V0V2lkdGggPSBNYXRoLmNlaWwoKGluV2lkdGggLSBmaWx0ZXJXaWR0aCArIDEpIC8gc3RyaWRlV2lkdGgpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IEVycm9yKGBVbmtub3duIHBhZGRpbmcgcGFyYW1ldGVyOiAke3BhZH1gKTtcbiAgfVxuICByZXR1cm4ge3BhZEluZm8sIG91dERlcHRoLCBvdXRIZWlnaHQsIG91dFdpZHRofTtcbn1cblxuLyoqXG4gKiBSb3VuZHMgYSB2YWx1ZSBkZXBlbmRpbmcgb24gdGhlIHJvdW5kaW5nIG1vZGVcbiAqIEBwYXJhbSB2YWx1ZVxuICogQHBhcmFtIHJvdW5kaW5nTW9kZSBBIHN0cmluZyBmcm9tOiAnY2VpbCcsICdyb3VuZCcsICdmbG9vcicuIElmIG5vbmUgaXNcbiAqICAgICBwcm92aWRlZCwgaXQgd2lsbCBkZWZhdWx0IHRvIHRydW5jYXRlLlxuICovXG5mdW5jdGlvbiByb3VuZCh2YWx1ZTogbnVtYmVyLCByb3VuZGluZ01vZGU/OiAnZmxvb3InfCdyb3VuZCd8J2NlaWwnKSB7XG4gIGlmICghcm91bmRpbmdNb2RlKSB7XG4gICAgcmV0dXJuIE1hdGgudHJ1bmModmFsdWUpO1xuICB9XG4gIHN3aXRjaCAocm91bmRpbmdNb2RlKSB7XG4gICAgY2FzZSAncm91bmQnOlxuICAgICAgLy8gdXNlZCBmb3IgQ2FmZmUgQ29udlxuICAgICAgcmV0dXJuIE1hdGgucm91bmQodmFsdWUpO1xuICAgIGNhc2UgJ2NlaWwnOlxuICAgICAgLy8gdXNlZCBmb3IgQ2FmZmUgUG9vbFxuICAgICAgcmV0dXJuIE1hdGguY2VpbCh2YWx1ZSk7XG4gICAgY2FzZSAnZmxvb3InOlxuICAgICAgcmV0dXJuIE1hdGguZmxvb3IodmFsdWUpO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gcm91bmRpbmdNb2RlICR7cm91bmRpbmdNb2RlfWApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0dXBsZVZhbHVlc0FyZU9uZShwYXJhbTogbnVtYmVyfG51bWJlcltdKTogYm9vbGVhbiB7XG4gIGNvbnN0IFtkaW1BLCBkaW1CLCBkaW1DXSA9IHBhcnNlVHVwbGVQYXJhbShwYXJhbSk7XG4gIHJldHVybiBkaW1BID09PSAxICYmIGRpbUIgPT09IDEgJiYgZGltQyA9PT0gMTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVpdGhlclN0cmlkZXNPckRpbGF0aW9uc0FyZU9uZShcbiAgICBzdHJpZGVzOiBudW1iZXJ8bnVtYmVyW10sIGRpbGF0aW9uczogbnVtYmVyfG51bWJlcltdKTogYm9vbGVhbiB7XG4gIHJldHVybiB0dXBsZVZhbHVlc0FyZU9uZShzdHJpZGVzKSB8fCB0dXBsZVZhbHVlc0FyZU9uZShkaWxhdGlvbnMpO1xufVxuXG4vKipcbiAqIENvbnZlcnQgQ29udjJEIGRhdGFGb3JtYXQgZnJvbSAnTkhXQyd8J05DSFcnIHRvXG4gKiAgICAnY2hhbm5lbHNMYXN0J3wnY2hhbm5lbHNGaXJzdCdcbiAqIEBwYXJhbSBkYXRhRm9ybWF0IGluICdOSFdDJ3wnTkNIVycgbW9kZVxuICogQHJldHVybiBkYXRhRm9ybWF0IGluICdjaGFubmVsc0xhc3QnfCdjaGFubmVsc0ZpcnN0JyBtb2RlXG4gKiBAdGhyb3dzIHVua25vd24gZGF0YUZvcm1hdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udmVydENvbnYyRERhdGFGb3JtYXQoZGF0YUZvcm1hdDogJ05IV0MnfCdOQ0hXJyk6XG4gICAgJ2NoYW5uZWxzTGFzdCd8J2NoYW5uZWxzRmlyc3QnIHtcbiAgaWYgKGRhdGFGb3JtYXQgPT09ICdOSFdDJykge1xuICAgIHJldHVybiAnY2hhbm5lbHNMYXN0JztcbiAgfSBlbHNlIGlmIChkYXRhRm9ybWF0ID09PSAnTkNIVycpIHtcbiAgICByZXR1cm4gJ2NoYW5uZWxzRmlyc3QnO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBkYXRhRm9ybWF0ICR7ZGF0YUZvcm1hdH1gKTtcbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIHZhbGlkaXR5IG9mIHBhZCB3aGVuIHVzaW5nIGRpbVJvdW5kaW5nTW9kZS5cbiAqIEBwYXJhbSBvcERlc2MgQSBzdHJpbmcgb2Ygb3AgZGVzY3JpcHRpb25cbiAqIEBwYXJhbSBwYWQgVGhlIHR5cGUgb2YgcGFkZGluZyBhbGdvcml0aG0uXG4gKiAgIC0gYHNhbWVgIGFuZCBzdHJpZGUgMTogb3V0cHV0IHdpbGwgYmUgb2Ygc2FtZSBzaXplIGFzIGlucHV0LFxuICogICAgICAgcmVnYXJkbGVzcyBvZiBmaWx0ZXIgc2l6ZS5cbiAqICAgLSBgdmFsaWRgIG91dHB1dCB3aWxsIGJlIHNtYWxsZXIgdGhhbiBpbnB1dCBpZiBmaWx0ZXIgaXMgbGFyZ2VyXG4gKiAgICAgICB0aGFuIDF4MS5cbiAqICAgLSBGb3IgbW9yZSBpbmZvLCBzZWUgdGhpcyBndWlkZTpcbiAqICAgICBbaHR0cHM6Ly93d3cudGVuc29yZmxvdy5vcmcvYXBpX2RvY3MvcHl0aG9uL3RmL25uL2NvbnZvbHV0aW9uXShcbiAqICAgICAgICAgIGh0dHBzOi8vd3d3LnRlbnNvcmZsb3cub3JnL2FwaV9kb2NzL3B5dGhvbi90Zi9ubi9jb252b2x1dGlvbilcbiAqIEBwYXJhbSBkaW1Sb3VuZGluZ01vZGUgQSBzdHJpbmcgZnJvbTogJ2NlaWwnLCAncm91bmQnLCAnZmxvb3InLiBJZiBub25lIGlzXG4gKiAgICAgcHJvdmlkZWQsIGl0IHdpbGwgZGVmYXVsdCB0byB0cnVuY2F0ZS5cbiAqIEB0aHJvd3MgdW5rbm93biBwYWRkaW5nIHBhcmFtZXRlclxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tQYWRPbkRpbVJvdW5kaW5nTW9kZShcbiAgICBvcERlc2M6IHN0cmluZywgcGFkOiAndmFsaWQnfCdzYW1lJ3xudW1iZXJ8RXhwbGljaXRQYWRkaW5nLFxuICAgIGRpbVJvdW5kaW5nTW9kZT86ICdmbG9vcid8J3JvdW5kJ3wnY2VpbCcpIHtcbiAgaWYgKGRpbVJvdW5kaW5nTW9kZSAhPSBudWxsKSB7XG4gICAgaWYgKHR5cGVvZiBwYWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICBgRXJyb3IgaW4gJHtvcERlc2N9OiBwYWQgbXVzdCBiZSBhbiBpbnRlZ2VyIHdoZW4gdXNpbmcgYCAgK1xuICAgICAgICAgIGBkaW1Sb3VuZGluZ01vZGUgJHtkaW1Sb3VuZGluZ01vZGV9IGJ1dCBnb3QgcGFkICR7cGFkfS5gKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYWQgPT09ICdudW1iZXInKSB7XG4gICAgICB1dGlsLmFzc2VydChcbiAgICAgICAgdXRpbC5pc0ludChwYWQpLFxuICAgICAgICAgICgpID0+IGBFcnJvciBpbiAke29wRGVzY306IHBhZCBtdXN0IGJlIGFuIGludGVnZXIgd2hlbiB1c2luZyBgICtcbiAgICAgICAgICAgICAgYGRpbVJvdW5kaW5nTW9kZSAke2RpbVJvdW5kaW5nTW9kZX0gYnV0IGdvdCBwYWQgJHtwYWR9LmApO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHBhZCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIChwYWQgYXMgRXhwbGljaXRQYWRkaW5nKS5mb3JFYWNoKHAgPT4ge3AuZm9yRWFjaCh2ID0+e1xuICAgICAgICB1dGlsLmFzc2VydChcbiAgICAgICAgICB1dGlsLmlzSW50KHYpLFxuICAgICAgICAgICAgKCkgPT4gYEVycm9yIGluICR7b3BEZXNjfTogcGFkIG11c3QgYmUgYW4gaW50ZWdlciB3aGVuIHVzaW5nIGAgK1xuICAgICAgICAgICAgICAgIGBkaW1Sb3VuZGluZ01vZGUgJHtkaW1Sb3VuZGluZ01vZGV9IGJ1dCBnb3QgcGFkICR7dn0uYCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IEVycm9yKGBFcnJvciBpbiAke29wRGVzY306IFVua25vd24gcGFkZGluZyBwYXJhbWV0ZXI6ICR7cGFkfWApO1xuICAgIH1cbiAgfVxufVxuIl19