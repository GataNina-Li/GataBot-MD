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
import * as tf from '../index';
import { ALL_ENVS, describeWithFlags } from '../jasmine_util';
import { expectArraysClose } from '../test_util';
function generateCaseInputs(totalSizeTensor, totalSizeFilter) {
    const inp = new Array(totalSizeTensor);
    const filt = new Array(totalSizeFilter);
    for (let i = 0; i < totalSizeTensor; i++) {
        inp[i] = i + 1;
    }
    for (let i = 0; i < totalSizeFilter; i++) {
        filt[i] = i + 1;
    }
    return { input: inp, filter: filt };
}
describeWithFlags('conv2d', ALL_ENVS, () => {
    it('x=[1,4,4,1] f=[1,1,1,3] s=2 d=1 p=same', async () => {
        const inputDepth = 1;
        const inputShape = [4, 4, inputDepth];
        const outputDepth = 3;
        const fSize = 1;
        const pad = 'same';
        const stride = [2, 2];
        const x = tf.tensor3d([
            10, 30, 50, 70, 20, 40, 60, 80, -10, -30, -50, -70, -20, -40, -60, -80
        ], inputShape);
        const w = tf.tensor4d([1, 0.5, 1], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad);
        expectArraysClose(await result.data(), [10, 5, 10, 50, 25, 50, -10, -5, -10, -50, -25, -50]);
    });
    it('x=[2,2,2,2] f=[1,1,2,2] s=1 d=1 p=0', async () => {
        const inputDepth = 2;
        const inShape = [2, 2, 2, inputDepth];
        const outputDepth = 2;
        const fSize = 1;
        const pad = 0;
        const stride = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], inShape);
        const w = tf.tensor4d([-1, 1, -2, 0.5], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad);
        expect(result.shape).toEqual([2, 2, 2, 2]);
        const expected = [-5, 2, -11, 5, -17, 8, -23, 11, -29, 14, -35, 17, -41, 20, -47, 23];
        expectArraysClose(await result.data(), expected);
    });
    it('x=[2,2,1] f=[1,1,1,2] s=1 d=1 p=0', async () => {
        const inputDepth = 1;
        const inputShape = [2, 2, inputDepth];
        const outputDepth = 1;
        const fSize = 1;
        const pad = 0;
        const stride = 1;
        const x = tf.tensor3d([1, 2, 3, 4], inputShape);
        const w = tf.tensor4d([2], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad);
        expectArraysClose(await result.data(), [2, 4, 6, 8]);
    });
    it('x=[3,3,2] f=[2,2,2,1] s=1 d=1 p=valid', async () => {
        const pad = 'valid';
        const stride = 1;
        const x = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90], [3, 3, 2]);
        const w = tf.tensor4d([.1, .2, .3, .4, .5, .6, .7, .8], [2, 2, 2, 1]);
        const result = tf.conv2d(x, w, stride, pad);
        const resultData = await result.data();
        expect(result.shape).toEqual([2, 2, 1]);
        expectArraysClose(resultData, new Float32Array([25.6, 53.5, 157.0, 220.9]));
    });
    it('x=[2,2,2,1] f=[1,1,1,1] s=1 d=1 p=0', async () => {
        const inputDepth = 1;
        const inShape = [2, 2, 2, inputDepth];
        const outputDepth = 1;
        const fSize = 1;
        const pad = 0;
        const stride = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8], inShape);
        const w = tf.tensor4d([2], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad);
        expect(result.shape).toEqual([2, 2, 2, 1]);
        const expected = [2, 4, 6, 8, 10, 12, 14, 16];
        expectArraysClose(await result.data(), expected);
    });
    it('x=[2,1,2,2] f=[1,1,1,1] s=1 d=1 p=0 NCHW', async () => {
        const inputDepth = 1;
        const inShape = [2, inputDepth, 2, 2];
        const outputDepth = 1;
        const fSize = 1;
        const pad = 0;
        const stride = 1;
        const dataFormat = 'NCHW';
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8], inShape);
        const w = tf.tensor4d([2], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad, dataFormat);
        expect(result.shape).toEqual([2, 1, 2, 2]);
        const expected = [2, 4, 6, 8, 10, 12, 14, 16];
        expectArraysClose(await result.data(), expected);
    });
    it('x=[4,2,1] f=[4,2,1,1] s=1 d=1 p=same', async () => {
        const inputDepth = 1;
        const outputDepth = 1;
        const pad = 'same';
        const stride = 1;
        const dataFormat = 'NHWC';
        const dilation = 1;
        const x = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8], [4, 2, inputDepth]);
        const w = tf.tensor4d([3, 1, 5, 0, 2, 7, 8, 9], [4, 2, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad, dataFormat, dilation);
        const resultData = await result.data();
        expect(result.shape).toEqual([4, 2, 1]);
        expectArraysClose(resultData, [133, 66, 200, 102, 108, 58, 56, 58]);
    });
    it('x=[4,2,1] f=[4,2,1,1] s=1 d=1 p=explicit', async () => {
        const inputDepth = 1;
        const outputDepth = 1;
        const pad = [[0, 0], [1, 2], [0, 1], [0, 0]];
        const stride = 1;
        const dataFormat = 'NHWC';
        const dilation = 1;
        const x = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8], [4, 2, inputDepth]);
        const w = tf.tensor4d([3, 1, 5, 0, 2, 7, 8, 9], [4, 2, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad, dataFormat, dilation);
        const resultData = await result.data();
        expect(result.shape).toEqual([4, 2, 1]);
        expectArraysClose(resultData, [133, 66, 200, 102, 108, 58, 56, 58]);
    });
    it('x=[2,2,1] f=[2,2,1,1] s=1 d=1 p=same', async () => {
        const inputDepth = 1;
        const inputShape = [2, 2, inputDepth];
        const outputDepth = 1;
        const fSize = 2;
        const pad = 'same';
        const stride = 1;
        const dataFormat = 'NHWC';
        const dilation = 1;
        const x = tf.tensor3d([1, 2, 3, 4], inputShape);
        const w = tf.tensor4d([3, 1, 5, 0], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad, dataFormat, dilation);
        const resultData = await result.data();
        expect(result.shape).toEqual([2, 2, 1]);
        expectArraysClose(resultData, new Float32Array([20, 26, 13, 12]));
    });
    it('x=[1,2,2] f=[2,2,1,1] s=1 d=1 p=same NCHW', async () => {
        const inputDepth = 1;
        const inputShape = [inputDepth, 2, 2];
        const outputDepth = 1;
        const fSize = 2;
        const pad = 'same';
        const stride = 1;
        const dataFormat = 'NCHW';
        const dilation = 1;
        const x = tf.tensor3d([1, 2, 3, 4], inputShape);
        const w = tf.tensor4d([3, 1, 5, 0], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad, dataFormat, dilation);
        const resultData = await result.data();
        expect(result.shape).toEqual([1, 2, 2]);
        expectArraysClose(resultData, [20, 26, 13, 12]);
    });
    it('x=[4,2,2] f=[1,1,4,4] s=1 d=1 p=same NCHW', async () => {
        // Skip tensorflow backend due to NCHW not supported.
        if (tf.getBackend() === 'tensorflow') {
            return;
        }
        const inputDepth = 4;
        const inputShape = [inputDepth, 2, 2];
        const outputDepth = 4;
        const fSize = 1;
        const pad = 'same';
        const stride = 1;
        const dataFormat = 'NCHW';
        const dilation = 1;
        const x = tf.tensor3d([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4], inputShape);
        const w = tf.tensor4d([3, 3, 3, 3, 1, 1, 1, 1, 5, 5, 5, 5, 0, 0, 0, 0], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad, dataFormat, dilation);
        const resultData = await result.data();
        expect(result.shape).toEqual([4, 2, 2]);
        expectArraysClose(resultData, [9, 18, 27, 36, 9, 18, 27, 36, 9, 18, 27, 36, 9, 18, 27, 36]);
    });
    it('x=[3,2,2] f=[1,1,3,4] s=1 d=1 p=same NCHW', async () => {
        // Skip tensorflow backend due to NCHW not supported.
        if (tf.getBackend() === 'tensorflow') {
            return;
        }
        const inputDepth = 3;
        const inputShape = [inputDepth, 2, 2];
        const outputDepth = 4;
        const fSize = 1;
        const pad = 'same';
        const stride = 1;
        const dataFormat = 'NCHW';
        const dilation = 1;
        const x = tf.tensor3d([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4], inputShape);
        const w = tf.tensor4d([3, 3, 3, 3, 1, 1, 1, 1, 5, 5, 5, 5], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad, dataFormat, dilation);
        const resultData = await result.data();
        expect(result.shape).toEqual([4, 2, 2]);
        expectArraysClose(resultData, [9, 18, 27, 36, 9, 18, 27, 36, 9, 18, 27, 36, 9, 18, 27, 36]);
    });
    it('x=[2,2,2,2] f=[1,1,4,4] s=1 d=1 p=same NCHW', async () => {
        // Skip tensorflow backend due to NCHW not supported.
        if (tf.getBackend() === 'tensorflow') {
            return;
        }
        const inputDepth = 2;
        const inputShape = [2, inputDepth, 2, 2];
        const outputDepth = 2;
        const fSize = 1;
        const pad = 'same';
        const stride = 1;
        const dataFormat = 'NCHW';
        const dilation = 1;
        const x = tf.tensor4d([1, 3, 5, 7, 2, 4, 6, 8, 9, 11, 13, 15, 10, 12, 14, 16], inputShape);
        const w = tf.tensor4d([-1, 1, -2, 0.5], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad, dataFormat, dilation);
        const resultData = await result.data();
        expect(result.shape).toEqual([2, 2, 2, 2]);
        expectArraysClose(resultData, [-5, -11, -17, -23, 2, 5, 8, 11, -29, -35, -41, -47, 14, 17, 20, 23]);
    });
    it('x=[4,2,2] f=[2,2,4,4] s=1 d=1 p=same NCHW', async () => {
        // Skip tensorflow backend due to NCHW not supported.
        if (tf.getBackend() === 'tensorflow') {
            return;
        }
        const inputDepth = 4;
        const inputShape = [inputDepth, 2, 2];
        const outputDepth = 4;
        const fSize = 2;
        const pad = 'same';
        const stride = 1;
        const dataFormat = 'NCHW';
        const dilation = 1;
        const x = tf.tensor3d([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4], inputShape);
        const w = tf.tensor4d([
            3, 3, 3, 3, 1, 1, 1, 1, 5, 5, 5, 5, 0, 0, 0, 0, 3, 3, 3, 3, 1, 1,
            1, 1, 5, 5, 5, 5, 0, 0, 0, 0, 3, 3, 3, 3, 1, 1, 1, 1, 5, 5, 5, 5,
            0, 0, 0, 0, 3, 3, 3, 3, 1, 1, 1, 1, 5, 5, 5, 5, 0, 0, 0, 0,
        ], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad, dataFormat, dilation);
        const resultData = await result.data();
        expect(result.shape).toEqual([4, 2, 2]);
        expectArraysClose(resultData, [90, 54, 63, 36, 90, 54, 63, 36, 90, 54, 63, 36, 90, 54, 63, 36]);
    });
    it('x=[1,2,2] f=[2,2,1,1] s=1 d=1 p=explicit NCHW', async () => {
        const inputDepth = 1;
        const inputShape = [inputDepth, 2, 2];
        const outputDepth = 1;
        const fSize = 2;
        const pad = [[0, 0], [0, 0], [0, 1], [0, 1]];
        const stride = 1;
        const dataFormat = 'NCHW';
        const dilation = 1;
        const x = tf.tensor3d([1, 2, 3, 4], inputShape);
        const w = tf.tensor4d([3, 1, 5, 0], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad, dataFormat, dilation);
        const resultData = await result.data();
        expect(result.shape).toEqual([1, 2, 2]);
        expectArraysClose(resultData, [20, 26, 13, 12]);
    });
    it('x=[2,2,2] f=[2,2,2,1] s=1 d=1 p=same NCHW', async () => {
        const inputDepth = 2;
        const inputShape = [inputDepth, 2, 2];
        const outputDepth = 1;
        const fSize = 2;
        const pad = 'same';
        const stride = 1;
        const dataFormat = 'NCHW';
        const dilation = 1;
        const x = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8], inputShape);
        const w = tf.tensor4d([3, 1, 5, 0, 0, 5, 1, 3], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad, dataFormat, dilation);
        const resultData = await result.data();
        expect(result.shape).toEqual([1, 2, 2]);
        expectArraysClose(resultData, [81, 52, 36, 20]);
    });
    it('x=[2,1,2,2] f=[2,2,1,1] s=1 d=1 p=same NCHW', async () => {
        const inputDepth = 1;
        const inputShape = [2, inputDepth, 2, 2];
        const outputDepth = 1;
        const fSize = 2;
        const pad = 'same';
        const stride = 1;
        const dataFormat = 'NCHW';
        const dilation = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8], inputShape);
        const w = tf.tensor4d([3, 1, 5, 0], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad, dataFormat, dilation);
        const resultData = await result.data();
        expect(result.shape).toEqual([2, 1, 2, 2]);
        expectArraysClose(resultData, [20, 26, 13, 12, 56, 58, 29, 24]);
    });
    it('x=[2,2,1] f=[2,2,1,1] s=1 d=1 p=0', async () => {
        const inputDepth = 1;
        const inputShape = [2, 2, inputDepth];
        const outputDepth = 1;
        const fSize = 2;
        const pad = 0;
        const stride = 1;
        const dataFormat = 'NHWC';
        const dilation = 1;
        const x = tf.tensor3d([1, 2, 3, 4], inputShape);
        const w = tf.tensor4d([3, 1, 5, 0], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad, dataFormat, dilation);
        expectArraysClose(await result.data(), [20]);
    });
    it('x=[4,4,1] f=[2,2,1,1] s=1 d=2 p=0', async () => {
        const inputDepth = 1;
        const inputShape = [4, 4, inputDepth];
        const outputDepth = 1;
        const fSize = 2;
        const fSizeDilated = 3;
        const pad = 0;
        const stride = 1;
        const dataFormat = 'NHWC';
        const dilation = 2;
        const noDilation = 1;
        const x = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], inputShape);
        const w = tf.tensor4d([3, 1, 5, 2], [fSize, fSize, inputDepth, outputDepth]);
        // adding a dilation rate is equivalent to using a filter
        // with 0s for the dilation rate
        const wDilated = tf.tensor4d([3, 0, 1, 0, 0, 0, 5, 0, 2], [fSizeDilated, fSizeDilated, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad, dataFormat, dilation);
        const expectedResult = tf.conv2d(x, wDilated, stride, pad, dataFormat, noDilation);
        expect(result.shape).toEqual(expectedResult.shape);
        expectArraysClose(await result.data(), await expectedResult.data());
        expect(result.shape).toEqual(expectedResult.shape);
        expect(result.dtype).toBe(expectedResult.dtype);
    });
    it('x=[1,3,6,1] f=[2,2,1,1] s=[1,2] d=1 p=valid', async () => {
        const inputDepth = 1;
        const inputShape = [1, 3, 6, inputDepth];
        const outputDepth = 1;
        const fSize = 2;
        const pad = 'valid';
        const stride = [1, 2];
        const inputs = generateCaseInputs(1 * 3 * 6 * inputDepth, fSize * fSize);
        const x = tf.tensor4d(inputs.input, inputShape);
        const w = tf.tensor4d(inputs.filter, [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad);
        expectArraysClose(await result.data(), [58.0, 78.0, 98.0, 118.0, 138.0, 158.0]);
    });
    it('x=[1,8,8,16] f=[3,3,16,1] s=[2,2] d=1 p=same', async () => {
        const inputDepth = 16;
        const xSize = 8;
        const inputShape = [1, xSize, xSize, inputDepth];
        const outputDepth = 1;
        const fSize = 3;
        const pad = 'same';
        const stride = [2, 2];
        // TODO(annxingyuan): Make this test work with large inputs using
        // generateCaseInputs https://github.com/tensorflow/tfjs/issues/3143
        const inputData = [];
        for (let i = 0; i < xSize * xSize * inputDepth; i++) {
            inputData.push(i % 5);
        }
        const wData = [];
        for (let i = 0; i < fSize * fSize * inputDepth * outputDepth; i++) {
            wData.push(i % 5);
        }
        const x = tf.tensor4d(inputData, inputShape);
        const w = tf.tensor4d(wData, [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad);
        expect(result.shape).toEqual([1, 4, 4, 1]);
        expectArraysClose(await result.data(), new Float32Array([
            854, 431, 568, 382, 580, 427, 854, 288, 431, 568, 580,
            289, 285, 570, 285, 258
        ]));
    });
    it('x=[1,8,8,3] f=[3,3,3,4] s=[2,2] d=1 p=same', async () => {
        const inputDepth = 3;
        const xSize = 8;
        const inputShape = [1, xSize, xSize, inputDepth];
        const outputDepth = 4;
        const fSize = 3;
        const pad = 'same';
        const stride = [2, 2];
        // TODO(annxingyuan): Make this test work with large inputs using
        // generateCaseInputs https://github.com/tensorflow/tfjs/issues/3143
        const inputData = [];
        for (let i = 0; i < xSize * xSize * inputDepth; i++) {
            inputData.push(i % 5);
        }
        const wData = [];
        for (let i = 0; i < fSize * fSize * inputDepth * outputDepth; i++) {
            wData.push(i % 5);
        }
        const x = tf.tensor4d(inputData, inputShape);
        const w = tf.tensor4d(wData, [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad);
        expect(result.shape).toEqual([1, 4, 4, 4]);
        expectArraysClose(await result.data(), new Float32Array([
            104, 125, 126, 102, 133, 126, 104, 57, 137, 102, 57, 112, 64,
            40, 76, 92, 116, 53, 110, 142, 50, 104, 133, 137, 104, 125,
            126, 102, 83, 88, 78, 33, 133, 126, 104, 57, 137, 102, 57,
            112, 116, 53, 110, 142, 37, 76, 100, 99, 33, 68, 83, 88,
            70, 83, 76, 64, 92, 88, 64, 40, 51, 44, 27, 50
        ]));
    });
    it('x=[1,8,8,3] f=[3,3,3,4] s=[2,2] d=1 p=valid', async () => {
        const inputDepth = 3;
        const xSize = 8;
        const inputShape = [1, xSize, xSize, inputDepth];
        const outputDepth = 4;
        const fSize = 3;
        const pad = 'valid';
        const stride = [2, 2];
        const inputData = [];
        for (let i = 0; i < xSize * xSize * inputDepth; i++) {
            inputData.push(i % 5);
        }
        const wData = [];
        for (let i = 0; i < fSize * fSize * inputDepth * outputDepth; i++) {
            wData.push(i % 5);
        }
        const x = tf.tensor4d(inputData, inputShape);
        const w = tf.tensor4d(wData, [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.conv2d(x, w, stride, pad);
        expect(result.shape).toEqual([1, 3, 3, 4]);
        expectArraysClose(await result.data(), new Float32Array([
            104, 125, 126, 102, 133, 126, 104, 57, 137, 102, 57, 112,
            116, 53, 110, 142, 50, 104, 133, 137, 104, 125, 126, 102,
            133, 126, 104, 57, 137, 102, 57, 112, 116, 53, 110, 142
        ]));
    });
    it('x=[1,2,2,3] f=[1,1] s=2 p=1 fractional outputs default rounding', async () => {
        const inputDepth = 3;
        const inShape = [1, 2, 2, inputDepth];
        const outputDepth = 1;
        const fSize = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], inShape);
        const w = tf.tensor4d([2, 2, 1], [fSize, fSize, inputDepth, outputDepth]);
        const pad = [[0, 0], [1, 1], [1, 1], [0, 0]];
        const strides = 2;
        const result = tf.conv2d(x, w, strides, pad);
        expect(result.shape).toEqual([1, 2, 2, 1]);
        expectArraysClose(await result.data(), [0, 0, 0, 54]);
    });
    it('throws when x is not rank 3', () => {
        const inputDepth = 1;
        const outputDepth = 1;
        const fSize = 2;
        const pad = 0;
        const stride = 1;
        // tslint:disable-next-line:no-any
        const x = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        const w = tf.tensor4d([3, 1, 5, 0], [fSize, fSize, inputDepth, outputDepth]);
        expect(() => tf.conv2d(x, w, stride, pad)).toThrowError();
    });
    it('throws when weights is not rank 4', () => {
        const inputDepth = 1;
        const inputShape = [2, 2, inputDepth];
        const pad = 0;
        const stride = 1;
        const x = tf.tensor3d([1, 2, 3, 4], inputShape);
        // tslint:disable-next-line:no-any
        const w = tf.tensor3d([3, 1, 5, 0], [2, 2, 1]);
        expect(() => tf.conv2d(x, w, stride, pad)).toThrowError();
    });
    it('throws when x depth does not match weight depth', () => {
        const inputDepth = 1;
        const wrongInputDepth = 5;
        const inputShape = [2, 2, inputDepth];
        const outputDepth = 1;
        const fSize = 2;
        const pad = 0;
        const stride = 1;
        const x = tf.tensor3d([1, 2, 3, 4], inputShape);
        const w = tf.randomNormal([fSize, fSize, wrongInputDepth, outputDepth]);
        expect(() => tf.conv2d(x, w, stride, pad)).toThrowError();
    });
    it('throws when x depth does not match weight depth NCHW', () => {
        const inputDepth = 1;
        const wrongInputDepth = 5;
        const inputShape = [inputDepth, 2, 2];
        const outputDepth = 1;
        const fSize = 2;
        const pad = 0;
        const stride = 1;
        const dataFormat = 'NCHW';
        const x = tf.tensor3d([1, 2, 3, 4], inputShape);
        const w = tf.randomNormal([fSize, fSize, wrongInputDepth, outputDepth]);
        expect(() => tf.conv2d(x, w, stride, pad, dataFormat)).toThrowError();
    });
    it('throws when dimRoundingMode is set and pad is same', () => {
        const inputDepth = 1;
        const inputShape = [2, 2, inputDepth];
        const outputDepth = 1;
        const fSize = 2;
        const pad = 'same';
        const stride = 1;
        const dataFormat = 'NHWC';
        const dilation = 1;
        const dimRoundingMode = 'round';
        const x = tf.tensor3d([1, 2, 3, 4], inputShape);
        const w = tf.randomNormal([fSize, fSize, inputDepth, outputDepth]);
        expect(() => tf.conv2d(x, w, stride, pad, dataFormat, dilation, dimRoundingMode))
            .toThrowError();
    });
    it('throws when dimRoundingMode is set and pad is valid', () => {
        const inputDepth = 1;
        const inputShape = [2, 2, inputDepth];
        const outputDepth = 1;
        const fSize = 2;
        const pad = 'valid';
        const stride = 1;
        const dataFormat = 'NHWC';
        const dilation = 1;
        const dimRoundingMode = 'round';
        const x = tf.tensor3d([1, 2, 3, 4], inputShape);
        const w = tf.randomNormal([fSize, fSize, inputDepth, outputDepth]);
        expect(() => tf.conv2d(x, w, stride, pad, dataFormat, dilation, dimRoundingMode))
            .toThrowError();
    });
    it('throws when dimRoundingMode is set and pad is a non-integer number', () => {
        const inputDepth = 1;
        const inputShape = [2, 2, inputDepth];
        const outputDepth = 1;
        const fSize = 2;
        const pad = 1.2;
        const stride = 1;
        const dataFormat = 'NHWC';
        const dilation = 1;
        const dimRoundingMode = 'round';
        const x = tf.tensor3d([1, 2, 3, 4], inputShape);
        const w = tf.randomNormal([fSize, fSize, inputDepth, outputDepth]);
        expect(() => tf.conv2d(x, w, stride, pad, dataFormat, dilation, dimRoundingMode))
            .toThrowError();
    });
    it('throws when dimRoundingMode is set and pad is explicit by non-integer ' +
        'number', () => {
        const inputDepth = 1;
        const inputShape = [2, 2, inputDepth];
        const outputDepth = 1;
        const fSize = 2;
        const pad = [[0, 0], [0, 2.1], [1, 1], [0, 0]];
        const stride = 1;
        const dataFormat = 'NHWC';
        const dilation = 1;
        const dimRoundingMode = 'round';
        const x = tf.tensor3d([1, 2, 3, 4], inputShape);
        const w = tf.randomNormal([fSize, fSize, inputDepth, outputDepth]);
        expect(() => tf.conv2d(x, w, stride, pad, dataFormat, dilation, dimRoundingMode))
            .toThrowError();
    });
    it('throws when both stride and dilation are greater than 1', () => {
        const inputDepth = 1;
        const inputShape = [2, 2, inputDepth];
        const outputDepth = 1;
        const fSize = 2;
        const pad = 0;
        const stride = [2, 1];
        const dataFormat = 'NHWC';
        const dilation = [1, 2];
        const x = tf.tensor3d([1, 2, 3, 4], inputShape);
        const w = tf.tensor4d([3, 1, 5, 0], [fSize, fSize, inputDepth, outputDepth]);
        expect(() => tf.conv2d(x, w, stride, pad, dataFormat, dilation))
            .toThrowError();
    });
    it('gradient with clones input=[3,3,1] f=[2,2,1,1] s=1 p=0', async () => {
        const inputDepth = 1;
        const outputDepth = 1;
        const inputShape = [3, 3, inputDepth];
        const filterSize = 2;
        const stride = 1;
        const pad = 0;
        const filterShape = [filterSize, filterSize, inputDepth, outputDepth];
        const filter = tf.ones(filterShape);
        const x = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8, 9], inputShape);
        const dy = tf.tensor3d([3, 1, 2, 0], [2, 2, 1]);
        const grads = tf.grads((x, filter) => x.clone().conv2d(filter.clone(), stride, pad).clone());
        const [dx, dfilter] = grads([x, filter], dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(await dx.data(), [3, 4, 1, 5, 6, 1, 2, 2, 0]);
        expect(dfilter.shape).toEqual(filterShape);
        expectArraysClose(await dfilter.data(), [13, 19, 31, 37]);
    });
    it('gradient x=[2,3,3,1] f=[2,2,1,1] s=1 p=0', async () => {
        const inputDepth = 1;
        const outputDepth = 1;
        const inputShape = [2, 3, 3, inputDepth];
        const filterSize = 2;
        const stride = 1;
        const pad = 0;
        const filterShape = [filterSize, filterSize, inputDepth, outputDepth];
        const filter = tf.ones(filterShape);
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9], inputShape);
        const dy = tf.tensor4d([3, 1, 2, 0, 3, 1, 2, 0], [2, 2, 2, 1]);
        const grads = tf.grads((x, filter) => x.conv2d(filter, stride, pad));
        const [dx, dfilter] = grads([x, filter], dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(await dx.data(), [3, 4, 1, 5, 6, 1, 2, 2, 0, 3, 4, 1, 5, 6, 1, 2, 2, 0]);
        expect(dfilter.shape).toEqual(filterShape);
        expectArraysClose(await dfilter.data(), [13 * 2, 19 * 2, 31 * 2, 37 * 2]);
    });
    it('gradient x=[1,1,3,3] f=[2,2,1,1] s=1 p=0 NCHW', async () => {
        const inputDepth = 1;
        const outputDepth = 1;
        const inputShape = [1, inputDepth, 3, 3];
        const filterSize = 2;
        const stride = 1;
        const pad = 0;
        const dataFormat = 'NCHW';
        const filterShape = [filterSize, filterSize, inputDepth, outputDepth];
        const filter = tf.ones(filterShape);
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9], inputShape);
        const dy = tf.tensor4d([3, 1, 2, 0], [1, 1, 2, 2]);
        const grads = tf.grads((x, filter) => x.conv2d(filter, stride, pad, dataFormat));
        const [dx, dfilter] = grads([x, filter], dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(await dx.data(), [3, 4, 1, 5, 6, 1, 2, 2, 0]);
        expect(dfilter.shape).toEqual(filterShape);
        expectArraysClose(await dfilter.data(), [13, 19, 31, 37]);
    });
    it('gradient x=[2,1,3,3] f=[2,2,1,1] s=1 p=0 NCHW', async () => {
        const inputDepth = 1;
        const outputDepth = 1;
        const inputShape = [2, inputDepth, 3, 3];
        const filterSize = 2;
        const stride = 1;
        const pad = 0;
        const dataFormat = 'NCHW';
        const filterShape = [filterSize, filterSize, inputDepth, outputDepth];
        const filter = tf.ones(filterShape);
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9], inputShape);
        const dy = tf.tensor4d([3, 1, 2, 0, 3, 1, 2, 0], [2, 1, 2, 2]);
        const grads = tf.grads((x, filter) => x.conv2d(filter, stride, pad, dataFormat));
        const [dx, dfilter] = grads([x, filter], dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(await dx.data(), [3, 4, 1, 5, 6, 1, 2, 2, 0, 3, 4, 1, 5, 6, 1, 2, 2, 0]);
        expect(dfilter.shape).toEqual(filterShape);
        expectArraysClose(await dfilter.data(), [26, 38, 62, 74]);
    });
    it('throws when passed x as a non-tensor', () => {
        const inputDepth = 1;
        const outputDepth = 1;
        const fSize = 1;
        const pad = 0;
        const stride = 1;
        const w = tf.tensor4d([2], [fSize, fSize, inputDepth, outputDepth]);
        expect(() => tf.conv2d({}, w, stride, pad))
            .toThrowError(/Argument 'x' passed to 'conv2d' must be a Tensor/);
    });
    it('throws when passed filter as a non-tensor', () => {
        const inputDepth = 1;
        const inputShape = [2, 2, inputDepth];
        const pad = 0;
        const stride = 1;
        const x = tf.tensor3d([1, 2, 3, 4], inputShape);
        expect(() => tf.conv2d(x, {}, stride, pad))
            .toThrowError(/Argument 'filter' passed to 'conv2d' must be a Tensor/);
    });
    it('throws when input is int32', async () => {
        const inputDepth = 2;
        const inShape = [2, 2, 2, inputDepth];
        const outputDepth = 2;
        const fSize = 1;
        const pad = 0;
        const stride = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], inShape, 'int32');
        const w = tf.tensor4d([-1, 1, -2, 0.5], [fSize, fSize, inputDepth, outputDepth]);
        expect(() => tf.conv2d(x, w, stride, pad))
            .toThrowError(/Argument 'x' passed to 'conv2d' must be float32/);
    });
    it('throws when filter is int32', async () => {
        const inputDepth = 2;
        const inShape = [2, 2, 2, inputDepth];
        const outputDepth = 2;
        const fSize = 1;
        const pad = 0;
        const stride = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], inShape);
        const w = tf.tensor4d([-1, 1, -2, 0.5], [fSize, fSize, inputDepth, outputDepth], 'int32');
        expect(() => tf.conv2d(x, w, stride, pad))
            .toThrowError(/Argument 'filter' passed to 'conv2d' must be float32/);
    });
    it('accepts a tensor-like object', async () => {
        const pad = 0;
        const stride = 1;
        const x = [[[1], [2]], [[3], [4]]]; // 2x2x1
        const w = [[[[2]]]]; // 1x1x1x1
        const result = tf.conv2d(x, w, stride, pad);
        expectArraysClose(await result.data(), [2, 4, 6, 8]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udjJkX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9jb252MmRfdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMvQixPQUFPLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDNUQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRy9DLFNBQVMsa0JBQWtCLENBQUMsZUFBdUIsRUFBRSxlQUF1QjtJQUMxRSxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUN2QyxNQUFNLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUV4QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZUFBZSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3hDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2hCO0lBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGVBQWUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN4QyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNqQjtJQUVELE9BQU8sRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQztBQUNwQyxDQUFDO0FBRUQsaUJBQWlCLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDekMsRUFBRSxDQUFDLHdDQUF3QyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3RELE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNyQixNQUFNLFVB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QyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRTlDLGlCQUFpQixDQUFDLE1BQU0sTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHNDQUFzQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3BELE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNyQixNQUFNLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDdEIsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDO1FBQ25CLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNqQixNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUM7UUFDMUIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBRW5CLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDcEUsTUFBTSxDQUFDLEdBQ0gsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFFM0UsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRWxFLE1BQU0sVUFBVSxHQUFHLE1BQU0sTUFBTSxDQUFDLElB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QUVuQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUNqQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3pFLE1BQU0sQ0FBQyxHQUNILEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBRTNFLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVsRSxNQUFNLFVBQVUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN2QyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsaUJBQWlCLENBQ2IsVUFBVSxFQUNWLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMkNBQTJDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDekQscURBQXFEO1FBQ3JELElBQUksRUFBRSxDQUFDLFVBQVUsRUFBRSxLQUFLLFlBQVksRUFBRTtZQUNwQyxPQUFPO1NBQ1I7UUFDRCxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDckIsTUFBTSxVQUFVLEdBQTZCLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoRSxNQUFNLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDdEIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQztRQUNuQixNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDakIsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDO1FBQzFCLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQztRQUVuQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUNqQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2xFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQ2pCO1lBQ0UsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNoRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ2hFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1NBQzNELEVBQ0QsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBRTdDLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVsRSxNQUFNLFVBQVUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN2QyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxpQkFBaUIsQ0FDYixVQUFVLEVBQ1YsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFB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QUcsQ0FBQyxDQUFDLENBQUM7U0FDdkI7UUFFRCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDakIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssR0FBRyxLQUFLLEdBQUcsVUFBVSxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNqRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNuQjtRQUVELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUV0RSxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxpQkFBaUIsQ0FDYixNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLFlBQVksQ0FBQztZQUNwQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFHLEdBQUcsRUFBRSxFQUFFO1lBQzlELEVBQUUsRUFBRyxFQUFFLEVBQUcsRUFBRSxFQUFHLEdBQUcsRUFBRSxFQUFFLEVBQUcsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUcsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUc7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RUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxHQUNILEVBQUUsQ0FBQyxZQUFZLENBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBRTNFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0RBQXNELEVBQUUsR0FBRyxFQUFFO1FBQzlELE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNyQixNQUFNLGVBQWUsR0FBRyxDQUFDLENBQUM7UUFDMUIsTUFBTSxVQUFVLEdBQTZCLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoRSxNQUFNLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDdEIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNqQixNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUM7UUFFMUIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxHQUNILEVBQUUsQ0FBQyxZQUFZLENBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBRTNFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxVQUFV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QUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUV2RSxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQzNELFlBQVksRUFBRSxDQUFDO0lBQ3RCLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHdEQUF3RCxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3RFLE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNyQixNQUFNLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDdEIsTUFBTSxVQUFVLEdBQTZCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNoRSxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDckIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztRQUVkLE1BQU0sV0FBVyxHQUNiLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDdEQsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBVSxXQUFXLENBQUMsQ0FBQztRQUU3QyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMvRCxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFaEQsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FDbEIsQ0FBQyxDQUFjLEVBQUUsTUFBbUIsRUFBRSxFQUFFLENBQ3BDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRTdDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVoRSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMzQyxpQkFBaUIsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMENBQTBDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDeEQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBQztRQUN0QixNQUFNLFVBQVUsR0FBcUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMzRSxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDckIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztRQUVkLE1BQU0sV0FBVyxHQUNiLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDdEQsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBVSxXQUFXLENBQUMsQ0FBQztRQUU3QyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUNqQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDeEUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFL0QsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FDbEIsQ0FBQyxDQUFjLEVBQUUsTUFBbUIsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDNUUsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFN0MsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLGlCQUFpQixDQUNiLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxFQUNmLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTVELE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzNDLGlCQUFpQixDQUFDLE1BQU0sT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsK0NBQStDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDN0QsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBQztRQUN0QixNQUFNLFVBQVUsR0FBcUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzRSxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDckIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNkLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQztRQUUxQixNQUFNLFdBQVcsR0FDYixDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQVUsV0FBVyxDQUFDLENBQUM7UUFFN0MsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDL0QsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVuRCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSyxDQUNsQixDQUFDLENBQWMsRUFBRSxNQUFtQixFQUFFLEVBQUUsQ0FDcEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRTdDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVoRSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMzQyxpQkFBaUIsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsK0NBQStDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDN0QsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBQztRQUN0QixNQUFNLFVBQVUsR0FBcUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzRSxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDckIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNkLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQztRQUUxQixNQUFNLFdBQVcsR0FDYixDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQVUsV0FBVyxDQUFDLENBQUM7UUFFN0MsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FDakIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUs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QUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFpQixVQUFVO1FBRS9DLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDNUMsaUJBQWlCLENBQUMsTUFBTSxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAqIGFzIHRmIGZyb20gJy4uL2luZGV4JztcbmltcG9ydCB7QUxMX0VOVlMsIGRlc2NyaWJlV2l0aEZsYWdzfSBmcm9tICcuLi9qYXNtaW5lX3V0aWwnO1xuaW1wb3J0IHtleHBlY3RBcnJheXNDbG9zZX0gZnJvbSAnLi4vdGVzdF91dGlsJztcbmltcG9ydCB7UmFua30gZnJvbSAnLi4vdHlwZXMnO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUNhc2VJbnB1dHModG90YWxTaXplVGVuc29yOiBudW1iZXIsIHRvdGFsU2l6ZUZpbHRlcjogbnVtYmVyKSB7XG4gIGNvbnN0IGlucCA9IG5ldyBBcnJheSh0b3RhbFNpemVUZW5zb3IpO1xuICBjb25zdCBmaWx0ID0gbmV3IEFycmF5KHRvdGFsU2l6ZUZpbHRlcik7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3RhbFNpemVUZW5zb3I7IGkrKykge1xuICAgIGlucFtpXSA9IGkgKyAxO1xuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdG90YWxTaXplRmlsdGVyOyBpKyspIHtcbiAgICBmaWx0W2ldID0gaSArIDE7XG4gIH1cblxuICByZXR1cm4ge2lucHV0OiBpbnAsIGZpbHRlcjogZmlsdH07XG59XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCdjb252MmQnLCBBTExfRU5WUywgKCkgPT4ge1xuICBpdCgneD1bMSw0LDQsMV0gZj1bMSwxLDEsM10gcz0yIGQ9MSBwPXNhbWUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDE7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzQsIDQsIGlucHV0RGVwdGhdO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gMztcbiAgICBjb25zdCBmU2l6ZSA9IDE7XG4gICAgY29uc3QgcGFkID0gJ3NhbWUnO1xuICAgIGNvbnN0IHN0cmlkZTogW251bWJlciwgbnVtYmVyXSA9IFsyLCAyXTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IzZChcbiAgICAgICAgW1xuICAgICAgICAgIDEwLCAzMCwgNTAsIDcwLCAyMCwgNDAsIDYwLCA4MCwgLTEwLCAtMzAsIC01MCwgLTcwLCAtMjAsIC00MCwgLTYwLCAtODBcbiAgICAgICAgXSxcbiAgICAgICAgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFsxLCAwLjUsIDFdLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuY29udjJkKHgsIHcsIHN0cmlkZSwgcGFkKTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKFxuICAgICAgICBhd2FpdCByZXN1bHQuZGF0YSgpLFxuICAgICAgICBbMTAsIDUsIDEwLCA1MCwgMjUsIDUwLCAtMTAsIC01LCAtMTAsIC01MCwgLTI1LCAtNTBdKTtcbiAgfSk7XG5cbiAgaXQoJ3g9WzIsMiwyLDJdIGY9WzEsMSwyLDJdIHM9MSBkPTEgcD0wJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzIsIDIsIDIsIGlucHV0RGVwdGhdO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gMjtcbiAgICBjb25zdCBmU2l6ZSA9IDE7XG4gICAgY29uc3QgcGFkID0gMDtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSwgMTZdLCBpblNoYXBlKTtcbiAgICBjb25zdCB3ID1cbiAgICAgICAgdGYudGVuc29yNGQoWy0xLCAxLCAtMiwgMC41XSwgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmNvbnYyZCh4LCB3LCBzdHJpZGUsIHBhZCk7XG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMiwgMiwgMiwgMl0pO1xuICAgIGNvbnN0IGV4cGVjdGVkID1cbiAgICAgICAgWy01LCAyLCAtMTEsIDUsIC0xNywgOCwgLTIzLCAxMSwgLTI5LCAxNCwgLTM1LCAxNywgLTQxLCAyMCwgLTQ3LCAyM107XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCd4PVsyLDIsMV0gZj1bMSwxLDEsMl0gcz0xIGQ9MSBwPTAnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDE7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzIsIDIsIGlucHV0RGVwdGhdO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gMTtcbiAgICBjb25zdCBmU2l6ZSA9IDE7XG4gICAgY29uc3QgcGFkID0gMDtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjNkKFsxLCAyLCAzLCA0XSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFsyXSwgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmNvbnYyZCh4LCB3LCBzdHJpZGUsIHBhZCk7XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBbMiwgNCwgNiwgOF0pO1xuICB9KTtcblxuICBpdCgneD1bMywzLDJdIGY9WzIsMiwyLDFdIHM9MSBkPTEgcD12YWxpZCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBwYWQgPSAndmFsaWQnO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yM2QoXG4gICAgICAgIFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMjAsIDMwLCA0MCwgNTAsIDYwLCA3MCwgODAsIDkwXSxcbiAgICAgICAgWzMsIDMsIDJdKTtcbiAgICBjb25zdCB3ID0gdGYudGVuc29yNGQoWy4xLCAuMiwgLjMsIC40LCAuNSwgLjYsIC43LCAuOF0sIFsyLCAyLCAyLCAxXSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSB0Zi5jb252MmQoeCwgdywgc3RyaWRlLCBwYWQpO1xuXG4gICAgY29uc3QgcmVzdWx0RGF0YSA9IGF3YWl0IHJlc3VsdC5kYXRhKCk7XG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMiwgMiwgMV0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKHJlc3VsdERhdGEsIG5ldyBGbG9hdDMyQXJyYXkoWzI1LjYsIDUzLjUsIDE1Ny4wLCAyMjAuOV0pKTtcbiAgfSk7XG5cbiAgaXQoJ3g9WzIsMiwyLDFdIGY9WzEsMSwxLDFdIHM9MSBkPTEgcD0wJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0RGVwdGggPSAxO1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzIsIDIsIDIsIGlucHV0RGVwdGhdO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gMTtcbiAgICBjb25zdCBmU2l6ZSA9IDE7XG4gICAgY29uc3QgcGFkID0gMDtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4XSwgaW5TaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFsyXSwgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmNvbnYyZCh4LCB3LCBzdHJpZGUsIHBhZCk7XG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMiwgMiwgMiwgMV0pO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gWzIsIDQsIDYsIDgsIDEwLCAxMiwgMTQsIDE2XTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ3g9WzIsMSwyLDJdIGY9WzEsMSwxLDFdIHM9MSBkPTEgcD0wIE5DSFcnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDE7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMiwgaW5wdXREZXB0aCwgMiwgMl07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAxO1xuICAgIGNvbnN0IGZTaXplID0gMTtcbiAgICBjb25zdCBwYWQgPSAwO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGF0YUZvcm1hdCA9ICdOQ0hXJztcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChbMSwgMiwgMywgNCwgNSwgNiwgNywgOF0sIGluU2hhcGUpO1xuICAgIGNvbnN0IHcgPSB0Zi50ZW5zb3I0ZChbMl0sIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSB0Zi5jb252MmQoeCwgdywgc3RyaWRlLCBwYWQsIGRhdGFGb3JtYXQpO1xuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzIsIDEsIDIsIDJdKTtcbiAgICBjb25zdCBleHBlY3RlZCA9IFsyLCA0LCA2LCA4LCAxMCwgMTIsIDE0LCAxNl07XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCd4PVs0LDIsMV0gZj1bNCwyLDEsMV0gcz0xIGQ9MSBwPXNhbWUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDE7XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAxO1xuICAgIGNvbnN0IHBhZCA9ICdzYW1lJztcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRhdGFGb3JtYXQgPSAnTkhXQyc7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjNkKFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4XSwgWzQsIDIsIGlucHV0RGVwdGhdKTtcbiAgICBjb25zdCB3ID1cbiAgICAgICAgdGYudGVuc29yNGQoWzMsIDEsIDUsIDAsIDIsIDcsIDgsIDldLCBbNCwgMiwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmNvbnYyZCh4LCB3LCBzdHJpZGUsIHBhZCwgZGF0YUZvcm1hdCwgZGlsYXRpb24pO1xuXG4gICAgY29uc3QgcmVzdWx0RGF0YSA9IGF3YWl0IHJlc3VsdC5kYXRhKCk7XG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbNCwgMiwgMV0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKHJlc3VsdERhdGEsIFsxMzMsIDY2LCAyMDAsIDEwMiwgMTA4LCA1OCwgNTYsIDU4XSk7XG4gIH0pO1xuXG4gIGl0KCd4PVs0LDIsMV0gZj1bNCwyLDEsMV0gcz0xIGQ9MSBwPWV4cGxpY2l0JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0RGVwdGggPSAxO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gMTtcbiAgICBjb25zdCBwYWQgPVxuICAgICAgICBbWzAsIDBdLCBbMSwgMl0sIFswLCAxXSwgWzAsIDBdXSBhcyB0Zi5iYWNrZW5kX3V0aWwuRXhwbGljaXRQYWRkaW5nO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGF0YUZvcm1hdCA9ICdOSFdDJztcbiAgICBjb25zdCBkaWxhdGlvbiA9IDE7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yM2QoWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDhdLCBbNCwgMiwgaW5wdXREZXB0aF0pO1xuICAgIGNvbnN0IHcgPVxuICAgICAgICB0Zi50ZW5zb3I0ZChbMywgMSwgNSwgMCwgMiwgNywgOCwgOV0sIFs0LCAyLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuY29udjJkKHgsIHcsIHN0cmlkZSwgcGFkLCBkYXRhRm9ybWF0LCBkaWxhdGlvbik7XG5cbiAgICBjb25zdCByZXN1bHREYXRhID0gYXdhaXQgcmVzdWx0LmRhdGEoKTtcbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFs0LCAyLCAxXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UocmVzdWx0RGF0YSwgWzEzMywgNjYsIDIwMCwgMTAyLCAxMDgsIDU4LCA1NiwgNThdKTtcbiAgfSk7XG5cbiAgaXQoJ3g9WzIsMiwxXSBmPVsyLDIsMSwxXSBzPTEgZD0xIHA9c2FtZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMiwgMiwgaW5wdXREZXB0aF07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAxO1xuICAgIGNvbnN0IGZTaXplID0gMjtcbiAgICBjb25zdCBwYWQgPSAnc2FtZSc7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcbiAgICBjb25zdCBkYXRhRm9ybWF0ID0gJ05IV0MnO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IzZChbMSwgMiwgMywgNF0sIGlucHV0U2hhcGUpO1xuICAgIGNvbnN0IHcgPVxuICAgICAgICB0Zi50ZW5zb3I0ZChbMywgMSwgNSwgMF0sIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSB0Zi5jb252MmQoeCwgdywgc3RyaWRlLCBwYWQsIGRhdGFGb3JtYXQsIGRpbGF0aW9uKTtcblxuICAgIGNvbnN0IHJlc3VsdERhdGEgPSBhd2FpdCByZXN1bHQuZGF0YSgpO1xuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzIsIDIsIDFdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShyZXN1bHREYXRhLCBuZXcgRmxvYXQzMkFycmF5KFsyMCwgMjYsIDEzLCAxMl0pKTtcbiAgfSk7XG5cbiAgaXQoJ3g9WzEsMiwyXSBmPVsyLDIsMSwxXSBzPTEgZD0xIHA9c2FtZSBOQ0hXJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0RGVwdGggPSAxO1xuICAgIGNvbnN0IGlucHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFtpbnB1dERlcHRoLCAyLCAyXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDE7XG4gICAgY29uc3QgZlNpemUgPSAyO1xuICAgIGNvbnN0IHBhZCA9ICdzYW1lJztcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRhdGFGb3JtYXQgPSAnTkNIVyc7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjNkKFsxLCAyLCAzLCA0XSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9XG4gICAgICAgIHRmLnRlbnNvcjRkKFszLCAxLCA1LCAwXSwgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmNvbnYyZCh4LCB3LCBzdHJpZGUsIHBhZCwgZGF0YUZvcm1hdCwgZGlsYXRpb24pO1xuXG4gICAgY29uc3QgcmVzdWx0RGF0YSA9IGF3YWl0IHJlc3VsdC5kYXRhKCk7XG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMSwgMiwgMl0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKHJlc3VsdERhdGEsIFsyMCwgMjYsIDEzLCAxMl0pO1xuICB9KTtcblxuICBpdCgneD1bNCwyLDJdIGY9WzEsMSw0LDRdIHM9MSBkPTEgcD1zYW1lIE5DSFcnLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gU2tpcCB0ZW5zb3JmbG93IGJhY2tlbmQgZHVlIHRvIE5DSFcgbm90IHN1cHBvcnRlZC5cbiAgICBpZiAodGYuZ2V0QmFja2VuZCgpID09PSAndGVuc29yZmxvdycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDQ7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdID0gW2lucHV0RGVwdGgsIDIsIDJdO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gNDtcbiAgICBjb25zdCBmU2l6ZSA9IDE7XG4gICAgY29uc3QgcGFkID0gJ3NhbWUnO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGF0YUZvcm1hdCA9ICdOQ0hXJztcbiAgICBjb25zdCBkaWxhdGlvbiA9IDE7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yM2QoXG4gICAgICAgIFsxLCAyLCAzLCA0LCAxLCAyLCAzLCA0LCAxLCAyLCAzLCA0LCAxLCAyLCAzLCA0XSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbMywgMywgMywgMywgMSwgMSwgMSwgMSwgNSwgNSwgNSwgNSwgMCwgMCwgMCwgMF0sXG4gICAgICAgIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSB0Zi5jb252MmQoeCwgdywgc3RyaWRlLCBwYWQsIGRhdGFGb3JtYXQsIGRpbGF0aW9uKTtcblxuICAgIGNvbnN0IHJlc3VsdERhdGEgPSBhd2FpdCByZXN1bHQuZGF0YSgpO1xuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzQsIDIsIDJdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShcbiAgICAgICAgcmVzdWx0RGF0YSxcbiAgICAgICAgWzksIDE4LCAyNywgMzYsIDksIDE4LCAyNywgMzYsIDksIDE4LCAyNywgMzYsIDksIDE4LCAyNywgMzZdKTtcbiAgfSk7XG5cbiAgaXQoJ3g9WzMsMiwyXSBmPVsxLDEsMyw0XSBzPTEgZD0xIHA9c2FtZSBOQ0hXJywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIFNraXAgdGVuc29yZmxvdyBiYWNrZW5kIGR1ZSB0byBOQ0hXIG5vdCBzdXBwb3J0ZWQuXG4gICAgaWYgKHRmLmdldEJhY2tlbmQoKSA9PT0gJ3RlbnNvcmZsb3cnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlucHV0RGVwdGggPSAzO1xuICAgIGNvbnN0IGlucHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFtpbnB1dERlcHRoLCAyLCAyXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDQ7XG4gICAgY29uc3QgZlNpemUgPSAxO1xuICAgIGNvbnN0IHBhZCA9ICdzYW1lJztcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRhdGFGb3JtYXQgPSAnTkNIVyc7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjNkKFsxLCAyLCAzLCA0LCAxLCAyLCAzLCA0LCAxLCAyLCAzLCA0XSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbMywgMywgMywgMywgMSwgMSwgMSwgMSwgNSwgNSwgNSwgNV0sXG4gICAgICAgIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSB0Zi5jb252MmQoeCwgdywgc3RyaWRlLCBwYWQsIGRhdGFGb3JtYXQsIGRpbGF0aW9uKTtcblxuICAgIGNvbnN0IHJlc3VsdERhdGEgPSBhd2FpdCByZXN1bHQuZGF0YSgpO1xuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzQsIDIsIDJdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShcbiAgICAgICAgcmVzdWx0RGF0YSxcbiAgICAgICAgWzksIDE4LCAyNywgMzYsIDksIDE4LCAyNywgMzYsIDksIDE4LCAyNywgMzYsIDksIDE4LCAyNywgMzZdKTtcbiAgfSk7XG5cbiAgaXQoJ3g9WzIsMiwyLDJdIGY9WzEsMSw0LDRdIHM9MSBkPTEgcD1zYW1lIE5DSFcnLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gU2tpcCB0ZW5zb3JmbG93IGJhY2tlbmQgZHVlIHRvIE5DSFcgbm90IHN1cHBvcnRlZC5cbiAgICBpZiAodGYuZ2V0QmFja2VuZCgpID09PSAndGVuc29yZmxvdycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDI7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMiwgaW5wdXREZXB0aCwgMiwgMl07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGZTaXplID0gMTtcbiAgICBjb25zdCBwYWQgPSAnc2FtZSc7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcbiAgICBjb25zdCBkYXRhRm9ybWF0ID0gJ05DSFcnO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWzEsIDMsIDUsIDcsIDIsIDQsIDYsIDgsIDksIDExLCAxMywgMTUsIDEwLCAxMiwgMTQsIDE2XSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9XG4gICAgICAgIHRmLnRlbnNvcjRkKFstMSwgMSwgLTIsIDAuNV0sIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSB0Zi5jb252MmQoeCwgdywgc3RyaWRlLCBwYWQsIGRhdGFGb3JtYXQsIGRpbGF0aW9uKTtcblxuICAgIGNvbnN0IHJlc3VsdERhdGEgPSBhd2FpdCByZXN1bHQuZGF0YSgpO1xuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzIsIDIsIDIsIDJdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShcbiAgICAgICAgcmVzdWx0RGF0YSxcbiAgICAgICAgWy01LCAtMTEsIC0xNywgLTIzLCAyLCA1LCA4LCAxMSwgLTI5LCAtMzUsIC00MSwgLTQ3LCAxNCwgMTcsIDIwLCAyM10pO1xuICB9KTtcblxuICBpdCgneD1bNCwyLDJdIGY9WzIsMiw0LDRdIHM9MSBkPTEgcD1zYW1lIE5DSFcnLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gU2tpcCB0ZW5zb3JmbG93IGJhY2tlbmQgZHVlIHRvIE5DSFcgbm90IHN1cHBvcnRlZC5cbiAgICBpZiAodGYuZ2V0QmFja2VuZCgpID09PSAndGVuc29yZmxvdycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDQ7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdID0gW2lucHV0RGVwdGgsIDIsIDJdO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gNDtcbiAgICBjb25zdCBmU2l6ZSA9IDI7XG4gICAgY29uc3QgcGFkID0gJ3NhbWUnO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGF0YUZvcm1hdCA9ICdOQ0hXJztcbiAgICBjb25zdCBkaWxhdGlvbiA9IDE7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yM2QoXG4gICAgICAgIFsxLCAyLCAzLCA0LCAxLCAyLCAzLCA0LCAxLCAyLCAzLCA0LCAxLCAyLCAzLCA0XSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbXG4gICAgICAgICAgMywgMywgMywgMywgMSwgMSwgMSwgMSwgNSwgNSwgNSwgNSwgMCwgMCwgMCwgMCwgMywgMywgMywgMywgMSwgMSxcbiAgICAgICAgICAxLCAxLCA1LCA1LCA1LCA1LCAwLCAwLCAwLCAwLCAzLCAzLCAzLCAzLCAxLCAxLCAxLCAxLCA1LCA1LCA1LCA1LFxuICAgICAgICAgIDAsIDAsIDAsIDAsIDMsIDMsIDMsIDMsIDEsIDEsIDEsIDEsIDUsIDUsIDUsIDUsIDAsIDAsIDAsIDAsXG4gICAgICAgIF0sXG4gICAgICAgIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSB0Zi5jb252MmQoeCwgdywgc3RyaWRlLCBwYWQsIGRhdGFGb3JtYXQsIGRpbGF0aW9uKTtcblxuICAgIGNvbnN0IHJlc3VsdERhdGEgPSBhd2FpdCByZXN1bHQuZGF0YSgpO1xuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzQsIDIsIDJdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShcbiAgICAgICAgcmVzdWx0RGF0YSxcbiAgICAgICAgWzkwLCA1NCwgNjMsIDM2LCA5MCwgNTQsIDYzLCAzNiwgOTAsIDU0LCA2MywgMzYsIDkwLCA1NCwgNjMsIDM2XSk7XG4gIH0pO1xuXG4gIGl0KCd4PVsxLDIsMl0gZj1bMiwyLDEsMV0gcz0xIGQ9MSBwPWV4cGxpY2l0IE5DSFcnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDE7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdID0gW2lucHV0RGVwdGgsIDIsIDJdO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gMTtcbiAgICBjb25zdCBmU2l6ZSA9IDI7XG4gICAgY29uc3QgcGFkID1cbiAgICAgICAgW1swLCAwXSwgWzAsIDBdLCBbMCwgMV0sIFswLCAxXV0gYXMgdGYuYmFja2VuZF91dGlsLkV4cGxpY2l0UGFkZGluZztcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRhdGFGb3JtYXQgPSAnTkNIVyc7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjNkKFsxLCAyLCAzLCA0XSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9XG4gICAgICAgIHRmLnRlbnNvcjRkKFszLCAxLCA1LCAwXSwgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmNvbnYyZCh4LCB3LCBzdHJpZGUsIHBhZCwgZGF0YUZvcm1hdCwgZGlsYXRpb24pO1xuXG4gICAgY29uc3QgcmVzdWx0RGF0YSA9IGF3YWl0IHJlc3VsdC5kYXRhKCk7XG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMSwgMiwgMl0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKHJlc3VsdERhdGEsIFsyMCwgMjYsIDEzLCAxMl0pO1xuICB9KTtcblxuICBpdCgneD1bMiwyLDJdIGY9WzIsMiwyLDFdIHM9MSBkPTEgcD1zYW1lIE5DSFcnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDI7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdID0gW2lucHV0RGVwdGgsIDIsIDJdO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gMTtcbiAgICBjb25zdCBmU2l6ZSA9IDI7XG4gICAgY29uc3QgcGFkID0gJ3NhbWUnO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGF0YUZvcm1hdCA9ICdOQ0hXJztcbiAgICBjb25zdCBkaWxhdGlvbiA9IDE7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yM2QoWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDhdLCBpbnB1dFNoYXBlKTtcbiAgICBjb25zdCB3ID0gdGYudGVuc29yNGQoXG4gICAgICAgIFszLCAxLCA1LCAwLCAwLCA1LCAxLCAzXSwgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmNvbnYyZCh4LCB3LCBzdHJpZGUsIHBhZCwgZGF0YUZvcm1hdCwgZGlsYXRpb24pO1xuXG4gICAgY29uc3QgcmVzdWx0RGF0YSA9IGF3YWl0IHJlc3VsdC5kYXRhKCk7XG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMSwgMiwgMl0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKHJlc3VsdERhdGEsIFs4MSwgNTIsIDM2LCAyMF0pO1xuICB9KTtcblxuICBpdCgneD1bMiwxLDIsMl0gZj1bMiwyLDEsMV0gcz0xIGQ9MSBwPXNhbWUgTkNIVycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsyLCBpbnB1dERlcHRoLCAyLCAyXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDE7XG4gICAgY29uc3QgZlNpemUgPSAyO1xuICAgIGNvbnN0IHBhZCA9ICdzYW1lJztcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRhdGFGb3JtYXQgPSAnTkNIVyc7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4XSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9XG4gICAgICAgIHRmLnRlbnNvcjRkKFszLCAxLCA1LCAwXSwgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmNvbnYyZCh4LCB3LCBzdHJpZGUsIHBhZCwgZGF0YUZvcm1hdCwgZGlsYXRpb24pO1xuXG4gICAgY29uc3QgcmVzdWx0RGF0YSA9IGF3YWl0IHJlc3VsdC5kYXRhKCk7XG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMiwgMSwgMiwgMl0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKHJlc3VsdERhdGEsIFsyMCwgMjYsIDEzLCAxMiwgNTYsIDU4LCAyOSwgMjRdKTtcbiAgfSk7XG5cbiAgaXQoJ3g9WzIsMiwxXSBmPVsyLDIsMSwxXSBzPTEgZD0xIHA9MCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMiwgMiwgaW5wdXREZXB0aF07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAxO1xuICAgIGNvbnN0IGZTaXplID0gMjtcbiAgICBjb25zdCBwYWQgPSAwO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGF0YUZvcm1hdCA9ICdOSFdDJztcbiAgICBjb25zdCBkaWxhdGlvbiA9IDE7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yM2QoWzEsIDIsIDMsIDRdLCBpbnB1dFNoYXBlKTtcbiAgICBjb25zdCB3ID1cbiAgICAgICAgdGYudGVuc29yNGQoWzMsIDEsIDUsIDBdLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuY29udjJkKHgsIHcsIHN0cmlkZSwgcGFkLCBkYXRhRm9ybWF0LCBkaWxhdGlvbik7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzIwXSk7XG4gIH0pO1xuXG4gIGl0KCd4PVs0LDQsMV0gZj1bMiwyLDEsMV0gcz0xIGQ9MiBwPTAnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDE7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzQsIDQsIGlucHV0RGVwdGhdO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gMTtcbiAgICBjb25zdCBmU2l6ZSA9IDI7XG4gICAgY29uc3QgZlNpemVEaWxhdGVkID0gMztcbiAgICBjb25zdCBwYWQgPSAwO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGF0YUZvcm1hdCA9ICdOSFdDJztcbiAgICBjb25zdCBkaWxhdGlvbiA9IDI7XG4gICAgY29uc3Qgbm9EaWxhdGlvbiA9IDE7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yM2QoXG4gICAgICAgIFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE1LCAxNl0sIGlucHV0U2hhcGUpO1xuICAgIGNvbnN0IHcgPVxuICAgICAgICB0Zi50ZW5zb3I0ZChbMywgMSwgNSwgMl0sIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG4gICAgLy8gYWRkaW5nIGEgZGlsYXRpb24gcmF0ZSBpcyBlcXVpdmFsZW50IHRvIHVzaW5nIGEgZmlsdGVyXG4gICAgLy8gd2l0aCAwcyBmb3IgdGhlIGRpbGF0aW9uIHJhdGVcbiAgICBjb25zdCB3RGlsYXRlZCA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbMywgMCwgMSwgMCwgMCwgMCwgNSwgMCwgMl0sXG4gICAgICAgIFtmU2l6ZURpbGF0ZWQsIGZTaXplRGlsYXRlZCwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmNvbnYyZCh4LCB3LCBzdHJpZGUsIHBhZCwgZGF0YUZvcm1hdCwgZGlsYXRpb24pO1xuICAgIGNvbnN0IGV4cGVjdGVkUmVzdWx0ID1cbiAgICAgICAgdGYuY29udjJkKHgsIHdEaWxhdGVkLCBzdHJpZGUsIHBhZCwgZGF0YUZvcm1hdCwgbm9EaWxhdGlvbik7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKGV4cGVjdGVkUmVzdWx0LnNoYXBlKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBhd2FpdCBleHBlY3RlZFJlc3VsdC5kYXRhKCkpO1xuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoZXhwZWN0ZWRSZXN1bHQuc2hhcGUpO1xuICAgIGV4cGVjdChyZXN1bHQuZHR5cGUpLnRvQmUoZXhwZWN0ZWRSZXN1bHQuZHR5cGUpO1xuICB9KTtcblxuICBpdCgneD1bMSwzLDYsMV0gZj1bMiwyLDEsMV0gcz1bMSwyXSBkPTEgcD12YWxpZCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCAzLCA2LCBpbnB1dERlcHRoXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDE7XG4gICAgY29uc3QgZlNpemUgPSAyO1xuICAgIGNvbnN0IHBhZCA9ICd2YWxpZCc7XG4gICAgY29uc3Qgc3RyaWRlOiBbbnVtYmVyLCBudW1iZXJdID0gWzEsIDJdO1xuXG4gICAgY29uc3QgaW5wdXRzID0gZ2VuZXJhdGVDYXNlSW5wdXRzKDEgKiAzICogNiAqIGlucHV0RGVwdGgsIGZTaXplICogZlNpemUpO1xuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChpbnB1dHMuaW5wdXQsIGlucHV0U2hhcGUpO1xuICAgIGNvbnN0IHcgPVxuICAgICAgICB0Zi50ZW5zb3I0ZChpbnB1dHMuZmlsdGVyLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuY29udjJkKHgsIHcsIHN0cmlkZSwgcGFkKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShcbiAgICAgICAgYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzU4LjAsIDc4LjAsIDk4LjAsIDExOC4wLCAxMzguMCwgMTU4LjBdKTtcbiAgfSk7XG5cbiAgaXQoJ3g9WzEsOCw4LDE2XSBmPVszLDMsMTYsMV0gcz1bMiwyXSBkPTEgcD1zYW1lJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0RGVwdGggPSAxNjtcbiAgICBjb25zdCB4U2l6ZSA9IDg7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPVxuICAgICAgICBbMSwgeFNpemUsIHhTaXplLCBpbnB1dERlcHRoXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDE7XG4gICAgY29uc3QgZlNpemUgPSAzO1xuICAgIGNvbnN0IHBhZCA9ICdzYW1lJztcbiAgICBjb25zdCBzdHJpZGU6IFtudW1iZXIsIG51bWJlcl0gPSBbMiwgMl07XG5cbiAgICAvLyBUT0RPKGFubnhpbmd5dWFuKTogTWFrZSB0aGlzIHRlc3Qgd29yayB3aXRoIGxhcmdlIGlucHV0cyB1c2luZ1xuICAgIC8vIGdlbmVyYXRlQ2FzZUlucHV0cyBodHRwczovL2dpdGh1Yi5jb20vdGVuc29yZmxvdy90ZmpzL2lzc3Vlcy8zMTQzXG4gICAgY29uc3QgaW5wdXREYXRhID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB4U2l6ZSAqIHhTaXplICogaW5wdXREZXB0aDsgaSsrKSB7XG4gICAgICBpbnB1dERhdGEucHVzaChpICUgNSk7XG4gICAgfVxuXG4gICAgY29uc3Qgd0RhdGEgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZTaXplICogZlNpemUgKiBpbnB1dERlcHRoICogb3V0cHV0RGVwdGg7IGkrKykge1xuICAgICAgd0RhdGEucHVzaChpICUgNSk7XG4gICAgfVxuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKGlucHV0RGF0YSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKHdEYXRhLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmNvbnYyZCh4LCB3LCBzdHJpZGUsIHBhZCk7XG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMSwgNCwgNCwgMV0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIG5ldyBGbG9hdDMyQXJyYXkoW1xuICAgICAgICAgICAgICAgICAgICAgICAgODU0LCA0MzEsIDU2OCwgMzgyLCA1ODAsIDQyNywgODU0LCAyODgsIDQzMSwgNTY4LCA1ODAsXG4gICAgICAgICAgICAgICAgICAgICAgICAyODksIDI4NSwgNTcwLCAyODUsIDI1OFxuICAgICAgICAgICAgICAgICAgICAgIF0pKTtcbiAgfSk7XG5cbiAgaXQoJ3g9WzEsOCw4LDNdIGY9WzMsMywzLDRdIHM9WzIsMl0gZD0xIHA9c2FtZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMztcbiAgICBjb25zdCB4U2l6ZSA9IDg7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPVxuICAgICAgICBbMSwgeFNpemUsIHhTaXplLCBpbnB1dERlcHRoXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDQ7XG4gICAgY29uc3QgZlNpemUgPSAzO1xuICAgIGNvbnN0IHBhZCA9ICdzYW1lJztcbiAgICBjb25zdCBzdHJpZGU6IFtudW1iZXIsIG51bWJlcl0gPSBbMiwgMl07XG5cbiAgICAvLyBUT0RPKGFubnhpbmd5dWFuKTogTWFrZSB0aGlzIHRlc3Qgd29yayB3aXRoIGxhcmdlIGlucHV0cyB1c2luZ1xuICAgIC8vIGdlbmVyYXRlQ2FzZUlucHV0cyBodHRwczovL2dpdGh1Yi5jb20vdGVuc29yZmxvdy90ZmpzL2lzc3Vlcy8zMTQzXG4gICAgY29uc3QgaW5wdXREYXRhID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB4U2l6ZSAqIHhTaXplICogaW5wdXREZXB0aDsgaSsrKSB7XG4gICAgICBpbnB1dERhdGEucHVzaChpICUgNSk7XG4gICAgfVxuXG4gICAgY29uc3Qgd0RhdGEgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZTaXplICogZlNpemUgKiBpbnB1dERlcHRoICogb3V0cHV0RGVwdGg7IGkrKykge1xuICAgICAgd0RhdGEucHVzaChpICUgNSk7XG4gICAgfVxuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKGlucHV0RGF0YSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKHdEYXRhLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuY29udjJkKHgsIHcsIHN0cmlkZSwgcGFkKTtcbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFsxLCA0LCA0LCA0XSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgIGF3YWl0IHJlc3VsdC5kYXRhKCksIG5ldyBGbG9hdDMyQXJyYXkoW1xuICAgICAgICAgIDEwNCwgMTI1LCAxMjYsIDEwMiwgMTMzLCAxMjYsIDEwNCwgNTcsICAxMzcsIDEwMiwgNTcsICAxMTIsIDY0LFxuICAgICAgICAgIDQwLCAgNzYsICA5MiwgIDExNiwgNTMsICAxMTAsIDE0MiwgNTAsICAxMDQsIDEzMywgMTM3LCAxMDQsIDEyNSxcbiAgICAgICAgICAxMjYsIDEwMiwgODMsICA4OCwgIDc4LCAgMzMsICAxMzMsIDEyNiwgMTA0LCA1NywgIDEzNywgMTAyLCA1NyxcbiAgICAgICAgICAxMTIsIDExNiwgNTMsICAxMTAsIDE0MiwgMzcsICA3NiwgIDEwMCwgOTksICAzMywgIDY4LCAgODMsICA4OCxcbiAgICAgICAgICA3MCwgIDgzLCAgNzYsICA2NCwgIDkyLCAgODgsICA2NCwgIDQwLCAgNTEsICA0NCwgIDI3LCAgNTBcbiAgICAgICAgXSkpO1xuICB9KTtcblxuICBpdCgneD1bMSw4LDgsM10gZj1bMywzLDMsNF0gcz1bMiwyXSBkPTEgcD12YWxpZCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMztcbiAgICBjb25zdCB4U2l6ZSA9IDg7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPVxuICAgICAgICBbMSwgeFNpemUsIHhTaXplLCBpbnB1dERlcHRoXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDQ7XG4gICAgY29uc3QgZlNpemUgPSAzO1xuICAgIGNvbnN0IHBhZCA9ICd2YWxpZCc7XG4gICAgY29uc3Qgc3RyaWRlOiBbbnVtYmVyLCBudW1iZXJdID0gWzIsIDJdO1xuXG4gICAgY29uc3QgaW5wdXREYXRhID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB4U2l6ZSAqIHhTaXplICogaW5wdXREZXB0aDsgaSsrKSB7XG4gICAgICBpbnB1dERhdGEucHVzaChpICUgNSk7XG4gICAgfVxuXG4gICAgY29uc3Qgd0RhdGEgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZTaXplICogZlNpemUgKiBpbnB1dERlcHRoICogb3V0cHV0RGVwdGg7IGkrKykge1xuICAgICAgd0RhdGEucHVzaChpICUgNSk7XG4gICAgfVxuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKGlucHV0RGF0YSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKHdEYXRhLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuY29udjJkKHgsIHcsIHN0cmlkZSwgcGFkKTtcbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFsxLCAzLCAzLCA0XSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgIGF3YWl0IHJlc3VsdC5kYXRhKCksIG5ldyBGbG9hdDMyQXJyYXkoW1xuICAgICAgICAgIDEwNCwgMTI1LCAxMjYsIDEwMiwgMTMzLCAxMjYsIDEwNCwgNTcsICAxMzcsIDEwMiwgNTcsICAxMTIsXG4gICAgICAgICAgMTE2LCA1MywgIDExMCwgMTQyLCA1MCwgIDEwNCwgMTMzLCAxMzcsIDEwNCwgMTI1LCAxMjYsIDEwMixcbiAgICAgICAgICAxMzMsIDEyNiwgMTA0LCA1NywgIDEzNywgMTAyLCA1NywgIDExMiwgMTE2LCA1MywgIDExMCwgMTQyXG4gICAgICAgIF0pKTtcbiAgfSk7XG5cbiAgaXQoJ3g9WzEsMiwyLDNdIGY9WzEsMV0gcz0yIHA9MSBmcmFjdGlvbmFsIG91dHB1dHMgZGVmYXVsdCByb3VuZGluZycsXG4gICAgIGFzeW5jICgpID0+IHtcbiAgICAgICBjb25zdCBpbnB1dERlcHRoID0gMztcbiAgICAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCAyLCAyLCBpbnB1dERlcHRoXTtcbiAgICAgICBjb25zdCBvdXRwdXREZXB0aCA9IDE7XG4gICAgICAgY29uc3QgZlNpemUgPSAxO1xuXG4gICAgICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyXSwgaW5TaGFwZSk7XG4gICAgICAgY29uc3QgdyA9XG4gICAgICAgICAgIHRmLnRlbnNvcjRkKFsyLCAyLCAxXSwgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcbiAgICAgICBjb25zdCBwYWQgPVxuICAgICAgICAgICBbWzAsIDBdLCBbMSwgMV0sIFsxLCAxXSwgWzAsIDBdXSBhcyB0Zi5iYWNrZW5kX3V0aWwuRXhwbGljaXRQYWRkaW5nO1xuICAgICAgIGNvbnN0IHN0cmlkZXMgPSAyO1xuXG4gICAgICAgY29uc3QgcmVzdWx0ID0gdGYuY29udjJkKHgsIHcsIHN0cmlkZXMsIHBhZCk7XG5cbiAgICAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFsxLCAyLCAyLCAxXSk7XG4gICAgICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzAsIDAsIDAsIDU0XSk7XG4gICAgIH0pO1xuXG4gIGl0KCd0aHJvd3Mgd2hlbiB4IGlzIG5vdCByYW5rIDMnLCAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDE7XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAxO1xuICAgIGNvbnN0IGZTaXplID0gMjtcbiAgICBjb25zdCBwYWQgPSAwO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgY29uc3QgeDogYW55ID0gdGYudGVuc29yMmQoWzEsIDIsIDMsIDRdLCBbMiwgMl0pO1xuICAgIGNvbnN0IHcgPVxuICAgICAgICB0Zi50ZW5zb3I0ZChbMywgMSwgNSwgMF0sIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG5cbiAgICBleHBlY3QoKCkgPT4gdGYuY29udjJkKHgsIHcsIHN0cmlkZSwgcGFkKSkudG9UaHJvd0Vycm9yKCk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3Mgd2hlbiB3ZWlnaHRzIGlzIG5vdCByYW5rIDQnLCAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDE7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzIsIDIsIGlucHV0RGVwdGhdO1xuICAgIGNvbnN0IHBhZCA9IDA7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IzZChbMSwgMiwgMywgNF0sIGlucHV0U2hhcGUpO1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICBjb25zdCB3OiBhbnkgPSB0Zi50ZW5zb3IzZChbMywgMSwgNSwgMF0sIFsyLCAyLCAxXSk7XG5cbiAgICBleHBlY3QoKCkgPT4gdGYuY29udjJkKHgsIHcsIHN0cmlkZSwgcGFkKSkudG9UaHJvd0Vycm9yKCk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3Mgd2hlbiB4IGRlcHRoIGRvZXMgbm90IG1hdGNoIHdlaWdodCBkZXB0aCcsICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCB3cm9uZ0lucHV0RGVwdGggPSA1O1xuICAgIGNvbnN0IGlucHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsyLCAyLCBpbnB1dERlcHRoXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDE7XG4gICAgY29uc3QgZlNpemUgPSAyO1xuICAgIGNvbnN0IHBhZCA9IDA7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IzZChbMSwgMiwgMywgNF0sIGlucHV0U2hhcGUpO1xuICAgIGNvbnN0IHcgPVxuICAgICAgICB0Zi5yYW5kb21Ob3JtYWw8UmFuay5SND4oW2ZTaXplLCBmU2l6ZSwgd3JvbmdJbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuXG4gICAgZXhwZWN0KCgpID0+IHRmLmNvbnYyZCh4LCB3LCBzdHJpZGUsIHBhZCkpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndGhyb3dzIHdoZW4geCBkZXB0aCBkb2VzIG5vdCBtYXRjaCB3ZWlnaHQgZGVwdGggTkNIVycsICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCB3cm9uZ0lucHV0RGVwdGggPSA1O1xuICAgIGNvbnN0IGlucHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFtpbnB1dERlcHRoLCAyLCAyXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDE7XG4gICAgY29uc3QgZlNpemUgPSAyO1xuICAgIGNvbnN0IHBhZCA9IDA7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcbiAgICBjb25zdCBkYXRhRm9ybWF0ID0gJ05DSFcnO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjNkKFsxLCAyLCAzLCA0XSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9XG4gICAgICAgIHRmLnJhbmRvbU5vcm1hbDxSYW5rLlI0PihbZlNpemUsIGZTaXplLCB3cm9uZ0lucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG5cbiAgICBleHBlY3QoKCkgPT4gdGYuY29udjJkKHgsIHcsIHN0cmlkZSwgcGFkLCBkYXRhRm9ybWF0KSkudG9UaHJvd0Vycm9yKCk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3Mgd2hlbiBkaW1Sb3VuZGluZ01vZGUgaXMgc2V0IGFuZCBwYWQgaXMgc2FtZScsICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMiwgMiwgaW5wdXREZXB0aF07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAxO1xuICAgIGNvbnN0IGZTaXplID0gMjtcbiAgICBjb25zdCBwYWQgPSAnc2FtZSc7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcbiAgICBjb25zdCBkYXRhRm9ybWF0ID0gJ05IV0MnO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgICBjb25zdCBkaW1Sb3VuZGluZ01vZGUgPSAncm91bmQnO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjNkKFsxLCAyLCAzLCA0XSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnJhbmRvbU5vcm1hbDxSYW5rLlI0PihbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuXG4gICAgZXhwZWN0KFxuICAgICAgICAoKSA9PlxuICAgICAgICAgICAgdGYuY29udjJkKHgsIHcsIHN0cmlkZSwgcGFkLCBkYXRhRm9ybWF0LCBkaWxhdGlvbiwgZGltUm91bmRpbmdNb2RlKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndGhyb3dzIHdoZW4gZGltUm91bmRpbmdNb2RlIGlzIHNldCBhbmQgcGFkIGlzIHZhbGlkJywgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0RGVwdGggPSAxO1xuICAgIGNvbnN0IGlucHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsyLCAyLCBpbnB1dERlcHRoXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDE7XG4gICAgY29uc3QgZlNpemUgPSAyO1xuICAgIGNvbnN0IHBhZCA9ICd2YWxpZCc7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcbiAgICBjb25zdCBkYXRhRm9ybWF0ID0gJ05IV0MnO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgICBjb25zdCBkaW1Sb3VuZGluZ01vZGUgPSAncm91bmQnO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjNkKFsxLCAyLCAzLCA0XSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnJhbmRvbU5vcm1hbDxSYW5rLlI0PihbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuXG4gICAgZXhwZWN0KFxuICAgICAgICAoKSA9PlxuICAgICAgICAgICAgdGYuY29udjJkKHgsIHcsIHN0cmlkZSwgcGFkLCBkYXRhRm9ybWF0LCBkaWxhdGlvbiwgZGltUm91bmRpbmdNb2RlKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndGhyb3dzIHdoZW4gZGltUm91bmRpbmdNb2RlIGlzIHNldCBhbmQgcGFkIGlzIGEgbm9uLWludGVnZXIgbnVtYmVyJyxcbiAgICAgKCkgPT4ge1xuICAgICAgIGNvbnN0IGlucHV0RGVwdGggPSAxO1xuICAgICAgIGNvbnN0IGlucHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsyLCAyLCBpbnB1dERlcHRoXTtcbiAgICAgICBjb25zdCBvdXRwdXREZXB0aCA9IDE7XG4gICAgICAgY29uc3QgZlNpemUgPSAyO1xuICAgICAgIGNvbnN0IHBhZCA9IDEuMjtcbiAgICAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgICAgIGNvbnN0IGRhdGFGb3JtYXQgPSAnTkhXQyc7XG4gICAgICAgY29uc3QgZGlsYXRpb24gPSAxO1xuICAgICAgIGNvbnN0IGRpbVJvdW5kaW5nTW9kZSA9ICdyb3VuZCc7XG5cbiAgICAgICBjb25zdCB4ID0gdGYudGVuc29yM2QoWzEsIDIsIDMsIDRdLCBpbnB1dFNoYXBlKTtcbiAgICAgICBjb25zdCB3ID1cbiAgICAgICAgICAgdGYucmFuZG9tTm9ybWFsPFJhbmsuUjQ+KFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG5cbiAgICAgICBleHBlY3QoXG4gICAgICAgICAgICgpID0+IHRmLmNvbnYyZChcbiAgICAgICAgICAgICAgIHgsIHcsIHN0cmlkZSwgcGFkLCBkYXRhRm9ybWF0LCBkaWxhdGlvbiwgZGltUm91bmRpbmdNb2RlKSlcbiAgICAgICAgICAgLnRvVGhyb3dFcnJvcigpO1xuICAgICB9KTtcblxuICBpdCgndGhyb3dzIHdoZW4gZGltUm91bmRpbmdNb2RlIGlzIHNldCBhbmQgcGFkIGlzIGV4cGxpY2l0IGJ5IG5vbi1pbnRlZ2VyICcgK1xuICAgICAgICAgJ251bWJlcicsXG4gICAgICgpID0+IHtcbiAgICAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMiwgMiwgaW5wdXREZXB0aF07XG4gICAgICAgY29uc3Qgb3V0cHV0RGVwdGggPSAxO1xuICAgICAgIGNvbnN0IGZTaXplID0gMjtcbiAgICAgICBjb25zdCBwYWQgPSBbWzAsIDBdLCBbMCwgMi4xXSwgWzEsIDFdLCBbMCwgMF1dIGFzXG4gICAgICAgICAgIHRmLmJhY2tlbmRfdXRpbC5FeHBsaWNpdFBhZGRpbmc7XG4gICAgICAgY29uc3Qgc3RyaWRlID0gMTtcbiAgICAgICBjb25zdCBkYXRhRm9ybWF0ID0gJ05IV0MnO1xuICAgICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgICAgICBjb25zdCBkaW1Sb3VuZGluZ01vZGUgPSAncm91bmQnO1xuXG4gICAgICAgY29uc3QgeCA9IHRmLnRlbnNvcjNkKFsxLCAyLCAzLCA0XSwgaW5wdXRTaGFwZSk7XG4gICAgICAgY29uc3QgdyA9XG4gICAgICAgICAgIHRmLnJhbmRvbU5vcm1hbDxSYW5rLlI0PihbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuXG4gICAgICAgZXhwZWN0KFxuICAgICAgICAgICAoKSA9PiB0Zi5jb252MmQoXG4gICAgICAgICAgICAgICB4LCB3LCBzdHJpZGUsIHBhZCwgZGF0YUZvcm1hdCwgZGlsYXRpb24sIGRpbVJvdW5kaW5nTW9kZSkpXG4gICAgICAgICAgIC50b1Rocm93RXJyb3IoKTtcbiAgICAgfSk7XG5cbiAgaXQoJ3Rocm93cyB3aGVuIGJvdGggc3RyaWRlIGFuZCBkaWxhdGlvbiBhcmUgZ3JlYXRlciB0aGFuIDEnLCAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDE7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzIsIDIsIGlucHV0RGVwdGhdO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gMTtcbiAgICBjb25zdCBmU2l6ZSA9IDI7XG4gICAgY29uc3QgcGFkID0gMDtcbiAgICBjb25zdCBzdHJpZGU6IFtudW1iZXIsIG51bWJlcl0gPSBbMiwgMV07XG4gICAgY29uc3QgZGF0YUZvcm1hdCA9ICdOSFdDJztcbiAgICBjb25zdCBkaWxhdGlvbjogW251bWJlciwgbnVtYmVyXSA9IFsxLCAyXTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IzZChbMSwgMiwgMywgNF0sIGlucHV0U2hhcGUpO1xuICAgIGNvbnN0IHcgPVxuICAgICAgICB0Zi50ZW5zb3I0ZChbMywgMSwgNSwgMF0sIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG5cbiAgICBleHBlY3QoKCkgPT4gdGYuY29udjJkKHgsIHcsIHN0cmlkZSwgcGFkLCBkYXRhRm9ybWF0LCBkaWxhdGlvbikpXG4gICAgICAgIC50b1Rocm93RXJyb3IoKTtcbiAgfSk7XG5cbiAgaXQoJ2dyYWRpZW50IHdpdGggY2xvbmVzIGlucHV0PVszLDMsMV0gZj1bMiwyLDEsMV0gcz0xIHA9MCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDE7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzMsIDMsIGlucHV0RGVwdGhdO1xuICAgIGNvbnN0IGZpbHRlclNpemUgPSAyO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgcGFkID0gMDtcblxuICAgIGNvbnN0IGZpbHRlclNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9XG4gICAgICAgIFtmaWx0ZXJTaXplLCBmaWx0ZXJTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF07XG4gICAgY29uc3QgZmlsdGVyID0gdGYub25lczxSYW5rLlI0PihmaWx0ZXJTaGFwZSk7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yM2QoWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDldLCBpbnB1dFNoYXBlKTtcbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjNkKFszLCAxLCAyLCAwXSwgWzIsIDIsIDFdKTtcblxuICAgIGNvbnN0IGdyYWRzID0gdGYuZ3JhZHMoXG4gICAgICAgICh4OiB0Zi5UZW5zb3IzRCwgZmlsdGVyOiB0Zi5UZW5zb3I0RCkgPT5cbiAgICAgICAgICAgIHguY2xvbmUoKS5jb252MmQoZmlsdGVyLmNsb25lKCksIHN0cmlkZSwgcGFkKS5jbG9uZSgpKTtcbiAgICBjb25zdCBbZHgsIGRmaWx0ZXJdID0gZ3JhZHMoW3gsIGZpbHRlcl0sIGR5KTtcblxuICAgIGV4cGVjdChkeC5zaGFwZSkudG9FcXVhbCh4LnNoYXBlKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkeC5kYXRhKCksIFszLCA0LCAxLCA1LCA2LCAxLCAyLCAyLCAwXSk7XG5cbiAgICBleHBlY3QoZGZpbHRlci5zaGFwZSkudG9FcXVhbChmaWx0ZXJTaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZGZpbHRlci5kYXRhKCksIFsxMywgMTksIDMxLCAzN10pO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnQgeD1bMiwzLDMsMV0gZj1bMiwyLDEsMV0gcz0xIHA9MCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDE7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMiwgMywgMywgaW5wdXREZXB0aF07XG4gICAgY29uc3QgZmlsdGVyU2l6ZSA9IDI7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcbiAgICBjb25zdCBwYWQgPSAwO1xuXG4gICAgY29uc3QgZmlsdGVyU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID1cbiAgICAgICAgW2ZpbHRlclNpemUsIGZpbHRlclNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXTtcbiAgICBjb25zdCBmaWx0ZXIgPSB0Zi5vbmVzPFJhbmsuUjQ+KGZpbHRlclNoYXBlKTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDldLCBpbnB1dFNoYXBlKTtcbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjRkKFszLCAxLCAyLCAwLCAzLCAxLCAyLCAwXSwgWzIsIDIsIDIsIDFdKTtcblxuICAgIGNvbnN0IGdyYWRzID0gdGYuZ3JhZHMoXG4gICAgICAgICh4OiB0Zi5UZW5zb3I0RCwgZmlsdGVyOiB0Zi5UZW5zb3I0RCkgPT4geC5jb252MmQoZmlsdGVyLCBzdHJpZGUsIHBhZCkpO1xuICAgIGNvbnN0IFtkeCwgZGZpbHRlcl0gPSBncmFkcyhbeCwgZmlsdGVyXSwgZHkpO1xuXG4gICAgZXhwZWN0KGR4LnNoYXBlKS50b0VxdWFsKHguc2hhcGUpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKFxuICAgICAgICBhd2FpdCBkeC5kYXRhKCksXG4gICAgICAgIFszLCA0LCAxLCA1LCA2LCAxLCAyLCAyLCAwLCAzLCA0LCAxLCA1LCA2LCAxLCAyLCAyLCAwXSk7XG5cbiAgICBleHBlY3QoZGZpbHRlci5zaGFwZSkudG9FcXVhbChmaWx0ZXJTaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZGZpbHRlci5kYXRhKCksIFsxMyAqIDIsIDE5ICogMiwgMzEgKiAyLCAzNyAqIDJdKTtcbiAgfSk7XG5cbiAgaXQoJ2dyYWRpZW50IHg9WzEsMSwzLDNdIGY9WzIsMiwxLDFdIHM9MSBwPTAgTkNIVycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDE7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMSwgaW5wdXREZXB0aCwgMywgM107XG4gICAgY29uc3QgZmlsdGVyU2l6ZSA9IDI7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcbiAgICBjb25zdCBwYWQgPSAwO1xuICAgIGNvbnN0IGRhdGFGb3JtYXQgPSAnTkNIVyc7XG5cbiAgICBjb25zdCBmaWx0ZXJTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPVxuICAgICAgICBbZmlsdGVyU2l6ZSwgZmlsdGVyU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdO1xuICAgIGNvbnN0IGZpbHRlciA9IHRmLm9uZXM8UmFuay5SND4oZmlsdGVyU2hhcGUpO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5XSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgZHkgPSB0Zi50ZW5zb3I0ZChbMywgMSwgMiwgMF0sIFsxLCAxLCAyLCAyXSk7XG5cbiAgICBjb25zdCBncmFkcyA9IHRmLmdyYWRzKFxuICAgICAgICAoeDogdGYuVGVuc29yNEQsIGZpbHRlcjogdGYuVGVuc29yNEQpID0+XG4gICAgICAgICAgICB4LmNvbnYyZChmaWx0ZXIsIHN0cmlkZSwgcGFkLCBkYXRhRm9ybWF0KSk7XG4gICAgY29uc3QgW2R4LCBkZmlsdGVyXSA9IGdyYWRzKFt4LCBmaWx0ZXJdLCBkeSk7XG5cbiAgICBleHBlY3QoZHguc2hhcGUpLnRvRXF1YWwoeC5zaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZHguZGF0YSgpLCBbMywgNCwgMSwgNSwgNiwgMSwgMiwgMiwgMF0pO1xuXG4gICAgZXhwZWN0KGRmaWx0ZXIuc2hhcGUpLnRvRXF1YWwoZmlsdGVyU2hhcGUpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRmaWx0ZXIuZGF0YSgpLCBbMTMsIDE5LCAzMSwgMzddKTtcbiAgfSk7XG5cbiAgaXQoJ2dyYWRpZW50IHg9WzIsMSwzLDNdIGY9WzIsMiwxLDFdIHM9MSBwPTAgTkNIVycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDE7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMiwgaW5wdXREZXB0aCwgMywgM107XG4gICAgY29uc3QgZmlsdGVyU2l6ZSA9IDI7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcbiAgICBjb25zdCBwYWQgPSAwO1xuICAgIGNvbnN0IGRhdGFGb3JtYXQgPSAnTkNIVyc7XG5cbiAgICBjb25zdCBmaWx0ZXJTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPVxuICAgICAgICBbZmlsdGVyU2l6ZSwgZmlsdGVyU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdO1xuICAgIGNvbnN0IGZpbHRlciA9IHRmLm9uZXM8UmFuay5SND4oZmlsdGVyU2hhcGUpO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOV0sIGlucHV0U2hhcGUpO1xuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yNGQoWzMsIDEsIDIsIDAsIDMsIDEsIDIsIDBdLCBbMiwgMSwgMiwgMl0pO1xuXG4gICAgY29uc3QgZ3JhZHMgPSB0Zi5ncmFkcyhcbiAgICAgICAgKHg6IHRmLlRlbnNvcjRELCBmaWx0ZXI6IHRmLlRlbnNvcjREKSA9PlxuICAgICAgICAgICAgeC5jb252MmQoZmlsdGVyLCBzdHJpZGUsIHBhZCwgZGF0YUZvcm1hdCkpO1xuICAgIGNvbnN0IFtkeCwgZGZpbHRlcl0gPSBncmFkcyhbeCwgZmlsdGVyXSwgZHkpO1xuXG4gICAgZXhwZWN0KGR4LnNoYXBlKS50b0VxdWFsKHguc2hhcGUpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKFxuICAgICAgICBhd2FpdCBkeC5kYXRhKCksXG4gICAgICAgIFszLCA0LCAxLCA1LCA2LCAxLCAyLCAyLCAwLCAzLCA0LCAxLCA1LCA2LCAxLCAyLCAyLCAwXSk7XG5cbiAgICBleHBlY3QoZGZpbHRlci5zaGFwZSkudG9FcXVhbChmaWx0ZXJTaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZGZpbHRlci5kYXRhKCksIFsyNiwgMzgsIDYyLCA3NF0pO1xuICB9KTtcblxuICBpdCgndGhyb3dzIHdoZW4gcGFzc2VkIHggYXMgYSBub24tdGVuc29yJywgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0RGVwdGggPSAxO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gMTtcbiAgICBjb25zdCBmU2l6ZSA9IDE7XG4gICAgY29uc3QgcGFkID0gMDtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuXG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFsyXSwgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcblxuICAgIGV4cGVjdCgoKSA9PiB0Zi5jb252MmQoe30gYXMgdGYuVGVuc29yM0QsIHcsIHN0cmlkZSwgcGFkKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvQXJndW1lbnQgJ3gnIHBhc3NlZCB0byAnY29udjJkJyBtdXN0IGJlIGEgVGVuc29yLyk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3Mgd2hlbiBwYXNzZWQgZmlsdGVyIGFzIGEgbm9uLXRlbnNvcicsICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMiwgMiwgaW5wdXREZXB0aF07XG4gICAgY29uc3QgcGFkID0gMDtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjNkKFsxLCAyLCAzLCA0XSwgaW5wdXRTaGFwZSk7XG5cbiAgICBleHBlY3QoKCkgPT4gdGYuY29udjJkKHgsIHt9IGFzIHRmLlRlbnNvcjRELCBzdHJpZGUsIHBhZCkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0FyZ3VtZW50ICdmaWx0ZXInIHBhc3NlZCB0byAnY29udjJkJyBtdXN0IGJlIGEgVGVuc29yLyk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3Mgd2hlbiBpbnB1dCBpcyBpbnQzMicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMjtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsyLCAyLCAyLCBpbnB1dERlcHRoXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDI7XG4gICAgY29uc3QgZlNpemUgPSAxO1xuICAgIGNvbnN0IHBhZCA9IDA7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTUsIDE2XSwgaW5TaGFwZSxcbiAgICAgICAgJ2ludDMyJyk7XG4gICAgY29uc3QgdyA9XG4gICAgICAgIHRmLnRlbnNvcjRkKFstMSwgMSwgLTIsIDAuNV0sIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG5cbiAgICBleHBlY3QoKCkgPT4gdGYuY29udjJkKHgsIHcsIHN0cmlkZSwgcGFkKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvQXJndW1lbnQgJ3gnIHBhc3NlZCB0byAnY29udjJkJyBtdXN0IGJlIGZsb2F0MzIvKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyB3aGVuIGZpbHRlciBpcyBpbnQzMicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMjtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsyLCAyLCAyLCBpbnB1dERlcHRoXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDI7XG4gICAgY29uc3QgZlNpemUgPSAxO1xuICAgIGNvbnN0IHBhZCA9IDA7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTUsIDE2XSwgaW5TaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbLTEsIDEsIC0yLCAwLjVdLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0sICdpbnQzMicpO1xuXG4gICAgZXhwZWN0KCgpID0+IHRmLmNvbnYyZCh4LCB3LCBzdHJpZGUsIHBhZCkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0FyZ3VtZW50ICdmaWx0ZXInIHBhc3NlZCB0byAnY29udjJkJyBtdXN0IGJlIGZsb2F0MzIvKTtcbiAgfSk7XG5cbiAgaXQoJ2FjY2VwdHMgYSB0ZW5zb3ItbGlrZSBvYmplY3QnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcGFkID0gMDtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IHggPSBbW1sxXSwgWzJdXSwgW1szXSwgWzRdXV07ICAvLyAyeDJ4MVxuICAgIGNvbnN0IHcgPSBbW1tbMl1dXV07ICAgICAgICAgICAgICAgICAvLyAxeDF4MXgxXG5cbiAgICBjb25zdCByZXN1bHQgPSB0Zi5jb252MmQoeCwgdywgc3RyaWRlLCBwYWQpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIFsyLCA0LCA2LCA4XSk7XG4gIH0pO1xufSk7XG4iXX0=