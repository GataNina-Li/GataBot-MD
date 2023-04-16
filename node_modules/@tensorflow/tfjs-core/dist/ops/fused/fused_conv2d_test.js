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
import * as tf from '../../index';
import { ALL_ENVS, describeWithFlags } from '../../jasmine_util';
import { expectArraysClose } from '../../test_util';
function generateCaseInputs(totalSizeTensor, totalSizeFilter) {
    const inp = new Array(totalSizeTensor);
    const filt = new Array(totalSizeFilter);
    for (let i = 0; i < totalSizeTensor; i++) {
        inp[i] = i * 0.001 - totalSizeTensor * 0.001 / 2;
    }
    for (let i = 0; i < totalSizeFilter; i++) {
        const sign = i % 2 === 0 ? -1 : 1;
        filt[i] = i * 0.001 * sign;
    }
    return { input: inp, filter: filt };
}
describeWithFlags('fused conv2d', ALL_ENVS, () => {
    it('basic', async () => {
        const inputDepth = 2;
        const inShape = [2, 2, 2, inputDepth];
        const outputDepth = 2;
        const fSize = 1;
        const pad = 0;
        const stride = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], inShape);
        const w = tf.tensor4d([-1, 1, -2, 0.5], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.fused.conv2d({ x, filter: w, strides: stride, pad });
        expect(result.shape).toEqual([2, 2, 2, 2]);
        const expected = [-5, 2, -11, 5, -17, 8, -23, 11, -29, 14, -35, 17, -41, 20, -47, 23];
        expectArraysClose(await result.data(), expected);
    });
    it('basic with relu', async () => {
        const inputDepth = 2;
        const inShape = [2, 2, 2, inputDepth];
        const outputDepth = 2;
        const fSize = 1;
        const pad = 0;
        const stride = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], inShape);
        const w = tf.tensor4d([-1, 1, -2, 0.5], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            activation: 'relu'
        });
        expect(result.shape).toEqual([2, 2, 2, 2]);
        const expected = [0, 2, 0, 5, 0, 8, 0, 11, 0, 14, 0, 17, 0, 20, 0, 23];
        expectArraysClose(await result.data(), expected);
    });
    it('relu with stride 2 x=[1,8,8,16] f=[3,3,16,1] s=[2,2] d=1 p=same', async () => {
        const inputDepth = 16;
        const xSize = 8;
        const inputShape = [1, xSize, xSize, inputDepth];
        const outputDepth = 1;
        const fSize = 3;
        const pad = 'same';
        const stride = [2, 2];
        // TODO(annxingyuan): Make this test work with large inputs
        // https://github.com/tensorflow/tfjs/issues/3143
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
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            activation: 'relu'
        });
        expect(result.shape).toEqual([1, 4, 4, 1]);
        expectArraysClose(await result.data(), new Float32Array([
            854, 431, 568, 382, 580, 427, 854, 288, 431, 568,
            580, 289, 285, 570, 285, 258
        ]));
    });
    it('relu bias stride 2 x=[1,8,8,16] f=[3,3,16,1] s=[2,2] d=8 p=same', async () => {
        const inputDepth = 16;
        const xSize = 8;
        const inputShape = [1, xSize, xSize, inputDepth];
        const outputDepth = 8;
        const fSize = 3;
        const pad = 'same';
        const stride = [2, 2];
        const inputs = generateCaseInputs(1 * xSize * xSize * inputDepth, fSize * fSize * inputDepth * outputDepth);
        const x = tf.tensor4d(inputs.input, inputShape);
        const w = tf.tensor4d(inputs.filter, [fSize, fSize, inputDepth, outputDepth]);
        const bias = tf.tensor1d([1, 4, 2, 3, 9, 6, 5, 8]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            activation: 'relu',
            bias
        });
        expect(result.shape).toEqual([1, 4, 4, 8]);
        expectArraysClose(await result.data(), new Float32Array([
            25.75398063659668,
            0,
            26.857805252075195,
            0,
            33.961631774902344,
            0,
            30.065458297729492,
            0,
            23.118206024169922,
            0,
            24.212820053100586,
            0,
            31.307422637939453,
            0,
            27.402034759521484,
            0,
            20.482431411743164,
            0,
            21.567821502685547,
            0,
            28.653217315673828,
            0,
            24.73861312866211,
            0,
            11.078080177307129,
            0,
            12.130399703979492,
            0,
            19.182720184326172,
            0,
            15.235037803649902,
            0,
            4.6677775382995605,
            0.31717729568481445,
            5.697869777679443,
            0,
            12.727968215942383,
            2.2569849491119385,
            8.758066177368164,
            4.226885795593262,
            2.0319995880126953,
            2.9575586318969727,
            3.052880048751831,
            1.9366796016693115,
            10.073760032653809,
            4.915799617767334,
            6.094639778137207,
            6.89492130279541,
            0,
            5.5979437828063965,
            0.4078875780105591,
            4.586280822753906,
            7.419551849365234,
            7.5746169090271,
            3.43121600151062,
            9.562952041625977,
            0,
            6.404943943023682,
            0,
            5.401776313781738,
            6.5998077392578125,
            8.398608207702637,
            2.602976083755493,
            10.395440101623535,
            0,
            21.440250396728516,
            0,
            20.483882904052734,
            0,
            23.527509689331055,
            0,
            25.571144104003906,
            0,
            24.080629348754883,
            0,
            23.133480072021484,
            0,
            26.186328887939453,
            0,
            28.239177703857422,
            0,
            26.721012115478516,
            0,
            25.783079147338867,
            0,
            28.84514808654785,
            0,
            30.907209396362305,
            0,
            18.914127349853516,
            0,
            17.960111618041992,
            0,
            21.006093978881836,
            0,
            23.052082061767578,
            0,
            17.89089584350586,
            0,
            16.95684814453125,
            0,
            20.022798538208008,
            0,
            22.088754653930664,
            0,
            19.06132698059082,
            0,
            18.133424758911133,
            0,
            21.205520629882812,
            0,
            23.27761459350586,
            0,
            20.23175811767578,
            0,
            19.309999465942383,
            0,
            22.388240814208984,
            0,
            24.46647834777832,
            0,
            13.584352493286133,
            0,
            12.6395845413208,
            0,
            15.694815635681152,
            0,
            17.750045776367188
        ]));
    });
    it('prelu bias stride 2 x=[1,8,8,16] f=[3,3,16,1] s=[2,2] d=8 p=same', async () => {
        const inputDepth = 16;
        const xSize = 8;
        const inputShape = [1, xSize, xSize, inputDepth];
        const outputDepth = 8;
        const fSize = 3;
        const pad = 'same';
        const stride = [2, 2];
        const inputs = generateCaseInputs(1 * xSize * xSize * inputDepth, fSize * fSize * inputDepth * outputDepth);
        const x = tf.tensor4d(inputs.input, inputShape);
        const w = tf.tensor4d(inputs.filter, [fSize, fSize, inputDepth, outputDepth]);
        const bias = tf.tensor1d([1, 4, 2, 3, 9, 6, 5, 8]);
        const preluActivationWeights = tf.tensor1d([1, 2, 3, 4, 5, 6, 7, 8]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            activation: 'prelu',
            preluActivationWeights,
            bias
        });
        expect(result.shape).toEqual([1, 4, 4, 8]);
        expectArraysClose(await result.data(), new Float32Array([
            25.75398063659668, -41.61178970336914, 26.857805252075195,
            -87.63885498046875, 33.961631774902344, -114.0812759399414,
            30.065458297729492, -136.93893432617188, 23.118206024169922,
            -36.33102035522461, 24.212820053100586, -77.04048156738281,
            31.307422637939453, -98.12835693359375, 27.402034759521484,
            -115.5947265625, 20.482431411743164, -31.050262451171875,
            21.567821502685547, -66.44209289550781, 28.653217315673828,
            -82.17544555664062, 24.73861312866211, -94.25041198730469,
            11.078080177307129, -12.208478927612305, 12.130399703979492,
            -28.626232147216797, 19.182720184326172, -25.253299713134766,
            15.235037803649902, -18.08960723876953, 4.6677775382995605,
            0.31717729568481445, 5.697869777679443, -2.8516759872436523,
            12.727968215942383, 2.2569849491119385, 8.758066177368164,
            4.226885795593262, 2.0319995880126953, 2.9575586318969727,
            3.052880048751831, 1.9366796016693115, 10.073760032653809,
            4.915799617767334, 6.094639778137207, 6.89492130279541,
            -0.6037763357162476, 5.5979437828063965, 0.4078875780105591,
            4.586280822753906, 7.419551849365234, 7.5746169090271,
            3.43121600151062, 9.562952041625977, -1.4065279960632324,
            6.404943943023682, -1.2100803852081299, 5.401776313781738,
            6.5998077392578125, 8.398608207702637, 2.602976083755493,
            10.395440101623535, -16.418434143066406, 21.440250396728516,
            -46.38618850708008, 20.483882904052734, -42.52848815917969,
            23.527509689331055, -87.84530639648438, 25.571144104003906,
            -19.054208755493164, 24.080629348754883, -54.32115936279297,
            23.133480072021484, -55.79951477050781, 26.186328887939453,
            -106.48924255371094, 28.239177703857422, -21.689987182617188,
            26.721012115478516, -62.25614929199219, 25.783079147338867,
            -69.070556640625, 28.84514808654785, -125.13325500488281,
            30.907209396362305, -13.891133308410645, 18.914127349853516,
            -38.81135940551758, 17.960111618041992, -29.915504455566406,
            21.006093978881836, -70.20361328125, 23.052082061767578,
            -12.857919692993164, 17.89089584350586, -35.771610260009766,
            16.95684814453125, -24.949115753173828, 20.022798538208008,
            -63.39042282104492, 22.088754653930664, -14.02528190612793,
            19.06132698059082, -39.2921257019043, 18.133424758911133,
            -30.847349166870117, 21.205520629882812, -71.69097137451172,
            23.27761459350586, -15.192638397216797, 20.23175811767578,
            -42.8126335144043, 19.309999465942383, -36.74560546875,
            22.388240814208984, -79.99152374267578, 24.46647834777832,
            -8.556736946105957, 13.584352493286133, -22.835901260375977,
            12.6395845413208, -3.336000442504883, 15.694815635681152,
            -33.0570182800293, 17.750045776367188
        ]));
    });
    it('relu6 bias stride 2 x=[1,8,8,16] f=[3,3,16,8] s=[2,2] d=8 p=same', async () => {
        const inputDepth = 16;
        const xSize = 8;
        const inputShape = [1, xSize, xSize, inputDepth];
        const outputDepth = 8;
        const fSize = 3;
        const pad = 'same';
        const stride = [2, 2];
        const inputs = generateCaseInputs(1 * xSize * xSize * inputDepth, fSize * fSize * inputDepth * outputDepth);
        const x = tf.tensor4d(inputs.input, inputShape);
        const w = tf.tensor4d(inputs.filter, [fSize, fSize, inputDepth, outputDepth]);
        const bias = tf.tensor1d([1, 4, 2, 3, 9, 6, 5, 8]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            activation: 'relu6',
            bias
        });
        expect(result.shape).toEqual([1, 4, 4, 8]);
        const resultData = await result.data();
        expectArraysClose(resultData, new Float32Array([
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            4.6677775382995605,
            0.31717729568481445,
            5.697869777679443,
            0,
            6,
            2.2569849491119385,
            6,
            4.226885795593262,
            2.0319995880126953,
            2.9575586318969727,
            3.052880048751831,
            1.9366796016693115,
            6,
            4.915799617767334,
            6,
            6,
            0,
            5.5979437828063965,
            0.4078875780105591,
            4.586280822753906,
            6,
            6,
            3.43121600151062,
            6,
            0,
            6,
            0,
            5.401776313781738,
            6,
            6,
            2.602976083755493,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6,
            0,
            6
        ]));
    });
    it('leakyrelu bias stride 2 x=[1,8,8,16] f=[3,3,16,1] s=[2,2] d=8 p=same', async () => {
        const inputDepth = 16;
        const xSize = 8;
        const inputShape = [1, xSize, xSize, inputDepth];
        const outputDepth = 8;
        const fSize = 3;
        const pad = 'same';
        const stride = [2, 2];
        const inputs = generateCaseInputs(1 * xSize * xSize * inputDepth, fSize * fSize * inputDepth * outputDepth);
        const x = tf.tensor4d(inputs.input, inputShape);
        const w = tf.tensor4d(inputs.filter, [fSize, fSize, inputDepth, outputDepth]);
        const bias = tf.tensor1d([1, 4, 2, 3, 9, 6, 5, 8]);
        const leakyreluAlpha = 0.3;
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            activation: 'leakyrelu',
            leakyreluAlpha,
            bias
        });
        expect(result.shape).toEqual([1, 4, 4, 8]);
        expectArraysClose(await result.data(), new Float32Array([
            25.75398063659668, -6.241768836975098, 26.857805252075195,
            -6.5729146003723145, 33.961631774902344, -5.704063892364502,
            30.065458297729492, -5.135210037231445, 23.118206024169922,
            -5.449653148651123, 24.212820053100586, -5.778036117553711,
            31.307422637939453, -4.906418323516846, 27.402034759521484,
            -4.334802627563477, 20.482431411743164, -4.657539367675781,
            21.567821502685547, -4.983157157897949, 28.653217315673828,
            -4.108772277832031, 24.73861312866211, -3.534390687942505,
            11.078080177307129, -1.8312718868255615, 12.130399703979492,
            -2.1469674110412598, 19.182720184326172, -1.262665033340454,
            15.235037803649902, -0.6783602833747864, 4.6677775382995605,
            0.31717729568481445, 5.697869777679443, -0.21387571096420288,
            12.727968215942383, 2.2569849491119385, 8.758066177368164,
            4.226885795593262, 2.0319995880126953, 2.9575586318969727,
            3.052880048751831, 1.9366796016693115, 10.073760032653809,
            4.915799617767334, 6.094639778137207, 6.89492130279541,
            -0.18113291263580322, 5.5979437828063965, 0.4078875780105591,
            4.586280822753906, 7.419551849365234, 7.5746169090271,
            3.43121600151062, 9.562952041625977, -0.42195841670036316,
            6.404943943023682, -0.12100804597139359, 5.401776313781738,
            6.5998077392578125, 8.398608207702637, 2.602976083755493,
            10.395440101623535, -4.925530433654785, 21.440250396728516,
            -4.6386189460754395, 20.483882904052734, -2.5517091751098633,
            23.527509689331055, -3.764799118041992, 25.571144104003906,
            -5.7162628173828125, 24.080629348754883, -5.432116508483887,
            23.133480072021484, -3.347970962524414, 26.186328887939453,
            -4.5638251304626465, 28.239177703857422, -6.5069966316223145,
            26.721012115478516, -6.225615501403809, 25.783079147338867,
            -4.144233703613281, 28.84514808654785, -5.36285400390625,
            30.907209396362305, -4.167340278625488, 18.914127349853516,
            -3.881135940551758, 17.960111618041992, -1.794930338859558,
            21.006093978881836, -3.0087265968322754, 23.052082061767578,
            -3.8573760986328125, 17.89089584350586, -3.5771610736846924,
            16.95684814453125, -1.4969470500946045, 20.022798538208008,
            -2.7167325019836426, 22.088754653930664, -4.207584857940674,
            19.06132698059082, -3.9292125701904297, 18.133424758911133,
            -1.8508410453796387, 21.205520629882812, -3.0724704265594482,
            23.27761459350586, -4.557791709899902, 20.23175811767578,
            -4.28126335144043, 19.309999465942383, -2.2047364711761475,
            22.388240814208984, -3.428208351135254, 24.46647834777832,
            -2.567021131515503, 13.584352493286133, -2.283590316772461,
            12.6395845413208, -0.20016004145145416, 15.694815635681152,
            -1.41672945022583, 17.750045776367188
        ]));
    });
    it('throws when dimRoundingMode is set and pad is same', () => {
        const inputDepth = 16;
        const xSize = 8;
        const inputShape = [1, xSize, xSize, inputDepth];
        const outputDepth = 8;
        const fSize = 3;
        const pad = 'same';
        const stride = [2, 2];
        const inputs = generateCaseInputs(1 * xSize * xSize * inputDepth, fSize * fSize * inputDepth * outputDepth);
        const x = tf.tensor4d(inputs.input, inputShape);
        const w = tf.tensor4d(inputs.filter, [fSize, fSize, inputDepth, outputDepth]);
        const bias = tf.tensor1d([1, 4, 2, 3, 9, 6, 5, 8]);
        const leakyreluAlpha = 0.3;
        expect(() => tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            activation: 'leakyrelu',
            leakyreluAlpha,
            bias,
            dimRoundingMode: 'round'
        })).toThrowError();
    });
    it('throws when dimRoundingMode is set and pad is valid', () => {
        const inputDepth = 16;
        const xSize = 8;
        const inputShape = [1, xSize, xSize, inputDepth];
        const outputDepth = 8;
        const fSize = 3;
        const pad = 'valid';
        const stride = [2, 2];
        const inputs = generateCaseInputs(1 * xSize * xSize * inputDepth, fSize * fSize * inputDepth * outputDepth);
        const x = tf.tensor4d(inputs.input, inputShape);
        const w = tf.tensor4d(inputs.filter, [fSize, fSize, inputDepth, outputDepth]);
        const bias = tf.tensor1d([1, 4, 2, 3, 9, 6, 5, 8]);
        const leakyreluAlpha = 0.3;
        expect(() => tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            activation: 'leakyrelu',
            leakyreluAlpha,
            bias,
            dimRoundingMode: 'round'
        })).toThrowError();
    });
    it('throws when dimRoundingMode is set and pad is a non-integer number', () => {
        const inputDepth = 16;
        const xSize = 8;
        const inputShape = [1, xSize, xSize, inputDepth];
        const outputDepth = 8;
        const fSize = 3;
        const pad = 1.2;
        const stride = [2, 2];
        const inputs = generateCaseInputs(1 * xSize * xSize * inputDepth, fSize * fSize * inputDepth * outputDepth);
        const x = tf.tensor4d(inputs.input, inputShape);
        const w = tf.tensor4d(inputs.filter, [fSize, fSize, inputDepth, outputDepth]);
        const bias = tf.tensor1d([1, 4, 2, 3, 9, 6, 5, 8]);
        const leakyreluAlpha = 0.3;
        expect(() => tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            activation: 'leakyrelu',
            leakyreluAlpha,
            bias,
            dimRoundingMode: 'round'
        })).toThrowError();
    });
    it('throws when dimRoundingMode is set and pad is explicit by non-integer ' +
        'number', () => {
        const inputDepth = 16;
        const xSize = 8;
        const inputShape = [1, xSize, xSize, inputDepth];
        const outputDepth = 8;
        const fSize = 3;
        const pad = [[0, 0], [0, 2.1], [1, 1], [0, 0]];
        const stride = [2, 2];
        const inputs = generateCaseInputs(1 * xSize * xSize * inputDepth, fSize * fSize * inputDepth * outputDepth);
        const x = tf.tensor4d(inputs.input, inputShape);
        const w = tf.tensor4d(inputs.filter, [fSize, fSize, inputDepth, outputDepth]);
        const bias = tf.tensor1d([1, 4, 2, 3, 9, 6, 5, 8]);
        const leakyreluAlpha = 0.3;
        expect(() => tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            activation: 'leakyrelu',
            leakyreluAlpha,
            bias,
            dimRoundingMode: 'round'
        })).toThrowError();
    });
    it('basic with bias', async () => {
        const inputDepth = 2;
        const inShape = [2, 2, 2, inputDepth];
        const outputDepth = 2;
        const fSize = 1;
        const pad = 0;
        const stride = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], inShape);
        const w = tf.tensor4d([-1, 1, -2, 0.5], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            bias: tf.tensor1d([5, 6])
        });
        expect(result.shape).toEqual([2, 2, 2, 2]);
        const expected = [0, 8, -6, 11, -12, 14, -18, 17, -24, 20, -30, 23, -36, 26, -42, 29];
        expectArraysClose(await result.data(), expected);
    });
    it('basic with explicit padding', async () => {
        const inputDepth = 1;
        const outputDepth = 1;
        const pad = [[0, 0], [1, 2], [0, 1], [0, 0]];
        const stride = 1;
        const dataFormat = 'NHWC';
        const dilation = 1;
        const x = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8], [4, 2, inputDepth]);
        const w = tf.tensor4d([3, 1, 5, 0, 2, 7, 8, 9], [4, 2, inputDepth, outputDepth]);
        const result = tf.fused.conv2d({ x, filter: w, strides: stride, pad, dataFormat, dilations: dilation });
        const resultData = await result.data();
        expect(result.shape).toEqual([4, 2, 1]);
        expectArraysClose(resultData, [133, 66, 200, 102, 108, 58, 56, 58]);
    });
    it('basic with elu', async () => {
        const inputDepth = 2;
        const inShape = [2, 2, 2, inputDepth];
        const outputDepth = 2;
        const fSize = 1;
        const pad = 0;
        const stride = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], inShape);
        const w = tf.tensor4d([-1, 1, -2, 0.5], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            activation: 'elu'
        });
        expect(result.shape).toEqual([2, 2, 2, 2]);
        const expected = [-0.99326, 2, -1, 5, -1, 8, -1, 11, -1, 14, -1, 17, -1, 20, -1, 23];
        expectArraysClose(await result.data(), expected);
    });
    it('basic with prelu', async () => {
        const inputDepth = 2;
        const inShape = [2, 2, 2, inputDepth];
        const outputDepth = 2;
        const fSize = 1;
        const pad = 0;
        const stride = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], inShape);
        const alpha = tf.tensor3d([0.25, 0.75], [1, 1, 2]);
        const w = tf.tensor4d([-1, 1, -2, 0.5], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            activation: 'prelu',
            preluActivationWeights: alpha
        });
        expect(result.shape).toEqual([2, 2, 2, 2]);
        const expected = [
            -1.25, 2, -2.75, 5, -4.25, 8, -5.75, 11, -7.25, 14, -8.75, 17, -10.25, 20,
            -11.75, 23
        ];
        expectArraysClose(await result.data(), expected);
    });
    it('basic with leakyrelu', async () => {
        const inputDepth = 2;
        const inShape = [2, 2, 2, inputDepth];
        const outputDepth = 2;
        const fSize = 1;
        const pad = 0;
        const stride = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], inShape);
        const alpha = 0.3;
        const w = tf.tensor4d([-1, 1, -2, 0.5], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            activation: 'leakyrelu',
            leakyreluAlpha: alpha
        });
        expect(result.shape).toEqual([2, 2, 2, 2]);
        const expected = [
            -1.5, 2, -3.3000001907348633, 5, -5.100000381469727, 8,
            -6.900000095367432, 11, -8.700000762939453, 14, -10.5, 17,
            -12.300000190734863, 20, -14.100000381469727, 23
        ];
        expectArraysClose(await result.data(), expected);
    });
    it('basic with sigmoid', async () => {
        const inputDepth = 2;
        const inShape = [2, 2, 2, inputDepth];
        const outputDepth = 2;
        const fSize = 1;
        const pad = 0;
        const stride = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], inShape);
        const alpha = 0.3;
        const w = tf.tensor4d([-0.1, 0.1, -0.2, 0.05], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            activation: 'sigmoid',
            leakyreluAlpha: alpha
        });
        expect(result.shape).toEqual([2, 2, 2, 2]);
        const expected = [
            0.3775407, 0.549834, 0.24973989, 0.6224593, 0.15446526, 0.6899744,
            0.09112296, 0.7502601, 0.0521535, 0.80218387, 0.02931219, 0.84553474,
            0.0163025, 0.8807971, 0.0090133, 0.908877
        ];
        expectArraysClose(await result.data(), expected);
    });
    it('basic with broadcasted bias and relu', async () => {
        const inputDepth = 2;
        const inShape = [2, 2, 2, inputDepth];
        const outputDepth = 2;
        const fSize = 1;
        const pad = 0;
        const stride = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], inShape);
        const w = tf.tensor4d([-1, 1, -2, 0.5], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            bias: tf.scalar(5),
            activation: 'relu'
        });
        expect(result.shape).toEqual([2, 2, 2, 2]);
        const expected = [0, 7, 0, 10, 0, 13, 0, 16, 0, 19, 0, 22, 0, 25, 0, 28];
        expectArraysClose(await result.data(), expected);
    });
    it('basic in NCHW', async () => {
        const inputDepth = 2;
        const inShape = [1, inputDepth, 2, 2];
        const outputDepth = 2;
        const fSize = 1;
        const pad = 0;
        const stride = 1;
        const x = tf.tensor4d([1, 3, 5, 7, 2, 4, 6, 8], inShape);
        const w = tf.tensor4d([-1, 1, -2, 0.5], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.fused.conv2d({ x, filter: w, strides: stride, pad, dataFormat: 'NCHW' });
        expect(result.shape).toEqual([1, 2, 2, 2]);
        const expected = [-5, -11, -17, -23, 2, 5, 8, 11];
        expectArraysClose(await result.data(), expected);
    });
    it('basic in NCHW with scalar bias', async () => {
        const inputDepth = 4;
        const inputShape = [1, inputDepth, 2, 2];
        const outputDepth = 4;
        const fSize = 1;
        const pad = 'same';
        const stride = 1;
        const dataFormat = 'NCHW';
        const dilation = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4], inputShape);
        const w = tf.tensor4d([3, 3, 3, 3, 1, 1, 1, 1, 5, 5, 5, 5, 0, 0, 0, 0], [fSize, fSize, inputDepth, outputDepth]);
        const bias = tf.scalar(1);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat,
            dilations: dilation,
            bias
        });
        expect(result.shape).toEqual([1, 4, 2, 2]);
        const expected = [10, 19, 28, 37, 10, 19, 28, 37, 10, 19, 28, 37, 10, 19, 28, 37];
        expectArraysClose(await result.data(), expected);
    });
    it('basic in NCHW with 1-D bias', async () => {
        const inputDepth = 4;
        const inputShape = [1, inputDepth, 2, 2];
        const outputDepth = 4;
        const fSize = 1;
        const pad = 'same';
        const stride = 1;
        const dataFormat = 'NCHW';
        const dilation = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4], inputShape);
        const w = tf.tensor4d([3, 3, 3, 3, 1, 1, 1, 1, 5, 5, 5, 5, 0, 0, 0, 0], [fSize, fSize, inputDepth, outputDepth]);
        const bias = tf.tensor1d([1, 2, 1, 2]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat,
            dilations: dilation,
            bias
        });
        expect(result.shape).toEqual([1, 4, 2, 2]);
        const expected = [10, 19, 28, 37, 11, 20, 29, 38, 10, 19, 28, 37, 11, 20, 29, 38];
        expectArraysClose(await result.data(), expected);
    });
    it('basic in NCHW with bias and multiple batches', async () => {
        const inputDepth = 4;
        const inputShape = [2, inputDepth, 2, 2];
        const outputDepth = 4;
        const fSize = 1;
        const pad = 'same';
        const stride = 1;
        const dataFormat = 'NCHW';
        const dilation = 1;
        const x = tf.tensor4d([
            1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4,
            1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4
        ], inputShape);
        const w = tf.tensor4d([3, 3, 3, 3, 1, 1, 1, 1, 5, 5, 5, 5, 0, 0, 0, 0], [fSize, fSize, inputDepth, outputDepth]);
        const bias = tf.tensor1d([1, 2, 1, 2]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat,
            dilations: dilation,
            bias
        });
        expect(result.shape).toEqual([2, 4, 2, 2]);
        const expected = [
            10, 19, 28, 37, 11, 20, 29, 38, 10, 19, 28, 37, 11, 20, 29, 38,
            10, 19, 28, 37, 11, 20, 29, 38, 10, 19, 28, 37, 11, 20, 29, 38
        ];
        expectArraysClose(await result.data(), expected);
    });
    it('basic in NCHW with scalar PReLU actiavation', async () => {
        const inputDepth = 2;
        const inShape = [1, inputDepth, 2, 2];
        const outputDepth = 2;
        const fSize = 1;
        const dataFormat = 'NCHW';
        const dilation = 1;
        const pad = 0;
        const stride = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8], inShape);
        const w = tf.tensor4d([-1, 1, -2, 0.5], [fSize, fSize, inputDepth, outputDepth]);
        const alpha = tf.scalar(10);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat,
            dilations: dilation,
            activation: 'prelu',
            preluActivationWeights: alpha
        });
        expect(result.shape).toEqual([1, 2, 2, 2]);
        const expected = [-110, -140, -170, -200, 3.5, 5, 6.5, 8];
        expectArraysClose(await result.data(), expected);
    });
    it('basic in NCHW with 1-D PReLU actiavation', async () => {
        const inputDepth = 2;
        const inShape = [1, inputDepth, 2, 2];
        const outputDepth = 2;
        const fSize = 1;
        const dataFormat = 'NCHW';
        const dilation = 1;
        const pad = 0;
        const stride = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8], inShape);
        const w = tf.tensor4d([-1, 1, -2, 0.5], [fSize, fSize, inputDepth, outputDepth]);
        const alpha = tf.tensor1d([10, 100]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat,
            dilations: dilation,
            activation: 'prelu',
            preluActivationWeights: alpha
        });
        expect(result.shape).toEqual([1, 2, 2, 2]);
        const expected = [-110, -140, -170, -200, 3.5, 5, 6.5, 8];
        expectArraysClose(await result.data(), expected);
    });
    it('basic in NCHW with 3-D PReLU actiavation', async () => {
        const inputDepth = 2;
        const inShape = [1, inputDepth, 2, 2];
        const outputDepth = 2;
        const fSize = 1;
        const dataFormat = 'NCHW';
        const dilation = 1;
        const pad = 0;
        const stride = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8], inShape);
        const w = tf.tensor4d([-1, -1, -2, -2], [fSize, fSize, inputDepth, outputDepth]);
        const alpha = tf.tensor3d([1, 10], [2, 1, 1]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat,
            dilations: dilation,
            activation: 'prelu',
            preluActivationWeights: alpha
        });
        expect(result.shape).toEqual([1, 2, 2, 2]);
        const expected = [-11, -14, -17, -20, -110, -140, -170, -200];
        expectArraysClose(await result.data(), expected);
    });
    it('basic in NCHW with full 3-D PReLU actiavation', async () => {
        const inputDepth = 2;
        const inShape = [1, inputDepth, 2, 2];
        const outputDepth = 2;
        const fSize = 1;
        const dataFormat = 'NCHW';
        const dilation = 1;
        const pad = 0;
        const stride = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8], inShape);
        const w = tf.tensor4d([-1, -1, -2, -2], [fSize, fSize, inputDepth, outputDepth]);
        const alpha = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat,
            dilations: dilation,
            activation: 'prelu',
            preluActivationWeights: alpha
        });
        expect(result.shape).toEqual([1, 2, 2, 2]);
        const expected = [-11, -28, -51, -80, -55, -84, -119, -160];
        expectArraysClose(await result.data(), expected);
    });
    it('im2row', async () => {
        const inputDepth = 1;
        const inputShape = [4, 4, inputDepth];
        const outputDepth = 3;
        const fSize = 1;
        const pad = 'same';
        const strides = [2, 2];
        const x = tf.tensor3d([
            10, 30, 50, 70, 20, 40, 60, 80, -10, -30, -50, -70, -20, -40, -60, -80
        ], inputShape);
        const w = tf.tensor4d([1, 0.5, 1], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.fused.conv2d({ x, filter: w, strides, pad });
        expectArraysClose(await result.data(), [10, 5, 10, 50, 25, 50, -10, -5, -10, -50, -25, -50]);
    });
    it('im2row with relu', async () => {
        const inputDepth = 1;
        const inputShape = [4, 4, inputDepth];
        const outputDepth = 3;
        const fSize = 1;
        const pad = 'same';
        const strides = [2, 2];
        const x = tf.tensor3d([
            10, 30, 50, 70, 20, 40, 60, 80, -10, -30, -50, -70, -20, -40, -60, -80
        ], inputShape);
        const w = tf.tensor4d([1, 0.5, 1], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            activation: 'relu'
        });
        expectArraysClose(await result.data(), [10, 5, 10, 50, 25, 50, 0, 0, 0, 0, 0, 0]);
    });
    it('im2row with prelu', async () => {
        const inputDepth = 1;
        const inputShape = [4, 4, inputDepth];
        const outputDepth = 3;
        const fSize = 1;
        const pad = 'same';
        const strides = [2, 2];
        const x = tf.tensor3d([
            10, 30, 50, 70, 20, 40, 60, 80, -10, -30, -50, -70, -20, -40, -60, -80
        ], inputShape);
        const w = tf.tensor4d([1, 0.5, 1], [fSize, fSize, inputDepth, outputDepth]);
        const alpha = tf.tensor3d([0.5], [1, 1, inputDepth]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            activation: 'prelu',
            preluActivationWeights: alpha
        });
        expectArraysClose(await result.data(), [10, 5, 10, 50, 25, 50, -5, -2.5, -5, -25, -12.5, -25]);
    });
    it('im2row with leakyrelu', async () => {
        const inputDepth = 1;
        const inputShape = [4, 4, inputDepth];
        const outputDepth = 3;
        const fSize = 1;
        const pad = 'same';
        const strides = [2, 2];
        const x = tf.tensor3d([
            10, 30, 50, 70, 20, 40, 60, 80, -10, -30, -50, -70, -20, -40, -60, -80
        ], inputShape);
        const w = tf.tensor4d([1, 0.5, 1], [fSize, fSize, inputDepth, outputDepth]);
        const alpha = 0.3;
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            activation: 'leakyrelu',
            leakyreluAlpha: alpha
        });
        expectArraysClose(await result.data(), [
            10, 5, 10, 50, 25, 50, -3, -1.5, -3, -15.000000953674316,
            -7.500000476837158, -15.000000953674316
        ]);
    });
    it('pointwise with prelu', async () => {
        const inputDepth = 1;
        const inputShape = [4, 4, inputDepth];
        const outputDepth = 3;
        const fSize = 1;
        const pad = 'same';
        const strides = [1, 1];
        const x = tf.tensor3d([
            10, 30, 50, 70, 20, 40, 60, 80, -10, -30, -50, -70, -20, -40, -60, -80
        ], inputShape);
        const w = tf.tensor4d([1, 0.5, 1], [fSize, fSize, inputDepth, outputDepth]);
        const alpha = tf.tensor3d([0.5], [1, 1, inputDepth]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            activation: 'prelu',
            preluActivationWeights: alpha
        });
        expectArraysClose(await result.data(), [
            10, 5, 10, 30, 15, 30, 50, 25, 50, 70, 35, 70,
            20, 10, 20, 40, 20, 40, 60, 30, 60, 80, 40, 80,
            -5, -2.5, -5, -15, -7.5, -15, -25, -12.5, -25, -35, -17.5, -35,
            -10, -5, -10, -20, -10, -20, -30, -15, -30, -40, -20, -40
        ]);
    });
    it('pointwise with leakyrelu', async () => {
        const inputDepth = 1;
        const inputShape = [4, 4, inputDepth];
        const outputDepth = 3;
        const fSize = 1;
        const pad = 'same';
        const strides = [1, 1];
        const x = tf.tensor3d([
            10, 30, 50, 70, 20, 40, 60, 80, -10, -30, -50, -70, -20, -40, -60, -80
        ], inputShape);
        const w = tf.tensor4d([1, 0.5, 1], [fSize, fSize, inputDepth, outputDepth]);
        const alpha = 0.3;
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            activation: 'leakyrelu',
            leakyreluAlpha: alpha
        });
        expectArraysClose(await result.data(), [
            10,
            5,
            10,
            30,
            15,
            30,
            50,
            25,
            50,
            70,
            35,
            70,
            20,
            10,
            20,
            40,
            20,
            40,
            60,
            30,
            60,
            80,
            40,
            80,
            -3,
            -1.5,
            -3,
            -9,
            -4.5,
            -9,
            -15.000000953674316,
            -7.500000476837158,
            -15.000000953674316,
            -21,
            -10.5,
            -21,
            -6,
            -3,
            -6,
            -12,
            -6,
            -12,
            -18,
            -9,
            -18,
            -24,
            -12,
            -24
        ]);
    });
    it('im2row with broadcasted bias and relu', async () => {
        const inputDepth = 1;
        const inputShape = [4, 4, inputDepth];
        const outputDepth = 3;
        const fSize = 1;
        const pad = 'same';
        const strides = [2, 2];
        const x = tf.tensor3d([
            10, 30, 50, 70, 20, 40, 60, 80, -10, -30, -50, -70, -20, -40, -60, -80
        ], inputShape);
        const w = tf.tensor4d([1, 0.5, 1], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            bias: tf.scalar(5),
            activation: 'relu'
        });
        expectArraysClose(await result.data(), [15, 10, 15, 55, 30, 55, 0, 0, 0, 0, 0, 0]);
    });
    it('im2row in NCHW', async () => {
        const inputDepth = 2;
        const inputShape = [inputDepth, 2, 2];
        const outputDepth = 2;
        const fSize = 2;
        const pad = 'same';
        const strides = [1, 1];
        const x = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8], inputShape);
        const w = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, -1, -2, -3, -4, -5, -6, -7, -8], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.fused.conv2d({ x, filter: w, strides, pad, dataFormat: 'NCHW' });
        expectArraysClose(await result.data(), [-32, -8, 100, 28, -40, -12, 122, 40]);
    });
    it('im2row in NCHW with scalar bias', async () => {
        const inputDepth = 4;
        const inputShape = [1, inputDepth, 2, 2];
        const outputDepth = 4;
        const fSize = 2;
        const pad = 'same';
        const stride = 1;
        const dataFormat = 'NCHW';
        const dilation = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4], inputShape);
        const w = tf.tensor4d([
            3, 3, 3, 3, 1, 1, 1, 1, 5, 5, 5, 5, 0, 0, 0, 0, 3, 3, 3, 3, 1, 1,
            1, 1, 5, 5, 5, 5, 0, 0, 0, 0, 3, 3, 3, 3, 1, 1, 1, 1, 5, 5, 5, 5,
            0, 0, 0, 0, 3, 3, 3, 3, 1, 1, 1, 1, 5, 5, 5, 5, 0, 0, 0, 0,
        ], [fSize, fSize, inputDepth, outputDepth]);
        const bias = tf.scalar(1);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat,
            dilations: dilation,
            bias
        });
        expect(result.shape).toEqual([1, 4, 2, 2]);
        const expected = [91, 55, 64, 37, 91, 55, 64, 37, 91, 55, 64, 37, 91, 55, 64, 37];
        expectArraysClose(await result.data(), expected);
    });
    it('im2row in NCHW with 1-D bias', async () => {
        const inputDepth = 4;
        const inputShape = [1, inputDepth, 2, 2];
        const outputDepth = 4;
        const fSize = 2;
        const pad = 'same';
        const stride = 1;
        const dataFormat = 'NCHW';
        const dilation = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4], inputShape);
        const w = tf.tensor4d([
            3, 3, 3, 3, 1, 1, 1, 1, 5, 5, 5, 5, 0, 0, 0, 0, 3, 3, 3, 3, 1, 1,
            1, 1, 5, 5, 5, 5, 0, 0, 0, 0, 3, 3, 3, 3, 1, 1, 1, 1, 5, 5, 5, 5,
            0, 0, 0, 0, 3, 3, 3, 3, 1, 1, 1, 1, 5, 5, 5, 5, 0, 0, 0, 0,
        ], [fSize, fSize, inputDepth, outputDepth]);
        const bias = tf.tensor1d([1, 2, 1, 2]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat,
            dilations: dilation,
            bias
        });
        expect(result.shape).toEqual([1, 4, 2, 2]);
        const expected = [91, 55, 64, 37, 92, 56, 65, 38, 91, 55, 64, 37, 92, 56, 65, 38];
        expectArraysClose(await result.data(), expected);
    });
    it('im2row in NCHW with scalar PReLU actiavation weights', async () => {
        const inputDepth = 2;
        const inShape = [1, inputDepth, 2, 2];
        const outputDepth = 2;
        const fSize = 2;
        const dataFormat = 'NCHW';
        const dilation = 1;
        const pad = 'same';
        const stride = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8], inShape);
        const w = tf.tensor4d([-1, -1, -1, -1, 1, 1, 1, 1, -2, -2, -2, -2, 0.5, 0.5, 0.5, 0.5], [fSize, fSize, inputDepth, outputDepth]);
        const alpha = tf.scalar(10);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat,
            dilations: dilation,
            activation: 'prelu',
            preluActivationWeights: alpha
        });
        expect(result.shape).toEqual([1, 2, 2, 2]);
        const expected = [-120, -320, 2, -120, -120, -320, 2, -120];
        expectArraysClose(await result.data(), expected);
    });
    it('im2row in NCHW with 1-D PReLU actiavation weights', async () => {
        const inputDepth = 2;
        const inShape = [1, inputDepth, 2, 2];
        const outputDepth = 2;
        const fSize = 2;
        const dataFormat = 'NCHW';
        const dilation = 1;
        const pad = 'same';
        const stride = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8], inShape);
        const w = tf.tensor4d([-1, -1, -1, -1, 1, 1, 1, 1, -2, -2, -2, -2, 0.5, 0.5, 0.5, 0.5], [fSize, fSize, inputDepth, outputDepth]);
        const alpha = tf.tensor1d([1, 10]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat,
            dilations: dilation,
            activation: 'prelu',
            preluActivationWeights: alpha
        });
        expect(result.shape).toEqual([1, 2, 2, 2]);
        const expected = [-12, -32, 2, -12, -120, -320, 2, -120];
        expectArraysClose(await result.data(), expected);
    });
    it('im2row in NCHW with 3-D PReLU actiavation weights', async () => {
        const inputDepth = 2;
        const inShape = [1, inputDepth, 2, 2];
        const outputDepth = 2;
        const fSize = 2;
        const dataFormat = 'NCHW';
        const dilation = 1;
        const pad = 'same';
        const stride = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8], inShape);
        const w = tf.tensor4d([-1, -1, -1, -1, 1, 1, 1, 1, -2, -2, -2, -2, 0.5, 0.5, 0.5, 0.5], [fSize, fSize, inputDepth, outputDepth]);
        const alpha = tf.tensor3d([1, 10], [2, 1, 1]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat,
            dilations: dilation,
            activation: 'prelu',
            preluActivationWeights: alpha
        });
        expect(result.shape).toEqual([1, 2, 2, 2]);
        const expected = [-12, -32, 2, -12, -120, -320, 2, -120];
        expectArraysClose(await result.data(), expected);
    });
    it('im2row in NCHW with full 3-D PReLU actiavation weights', async () => {
        const inputDepth = 2;
        const inShape = [1, inputDepth, 2, 2];
        const outputDepth = 2;
        const fSize = 2;
        const dataFormat = 'NCHW';
        const dilation = 1;
        const pad = 'same';
        const stride = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8], inShape);
        const w = tf.tensor4d([-1, -1, -1, -1, 1, 1, 1, 1, -2, -2, -2, -2, 0.5, 0.5, 0.5, 0.5], [fSize, fSize, inputDepth, outputDepth]);
        const alpha = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides: stride,
            pad,
            dataFormat,
            dilations: dilation,
            activation: 'prelu',
            preluActivationWeights: alpha
        });
        expect(result.shape).toEqual([1, 2, 2, 2]);
        const expected = [-12, -64, 2, -48, -60, -192, 2, -96];
        expectArraysClose(await result.data(), expected);
    });
    it('batch in NCHW', async () => {
        const inputDepth = 2;
        const inputShape = [2, inputDepth, 2, 2];
        const outputDepth = 2;
        const fSize = 2;
        const pad = 'same';
        const strides = [1, 1];
        const dataFormat = 'NCHW';
        const dilation = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], inputShape);
        const w = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, -1, -2, -3, -4, -5, -6, -7, -8], [fSize, fSize, inputDepth, outputDepth]);
        const result = tf.fused.conv2d({ x, filter: w, strides, pad, dataFormat, dilations: dilation });
        expect(result.shape).toEqual([2, 2, 2, 2]);
        expectArraysClose(await result.data(), [
            -32, -8, 100, 28, -40, -12, 122, 40, -32, -8, 228, 60, -40, -12, 282, 88
        ]);
    });
    it('batch in NCHW with scalar bias', async () => {
        const inputDepth = 2;
        const inputShape = [2, inputDepth, 2, 2];
        const outputDepth = 2;
        const fSize = 2;
        const pad = 'same';
        const strides = [1, 1];
        const dataFormat = 'NCHW';
        const dilation = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], inputShape);
        const w = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, -1, -2, -3, -4, -5, -6, -7, -8], [fSize, fSize, inputDepth, outputDepth]);
        const bias = tf.scalar(1);
        const result = tf.fused.conv2d({ x, filter: w, strides, pad, dataFormat, dilations: dilation, bias });
        expect(result.shape).toEqual([2, 2, 2, 2]);
        expectArraysClose(await result.data(), [
            -31, -7, 101, 29, -39, -11, 123, 41, -31, -7, 229, 61, -39, -11, 283, 89
        ]);
    });
    it('batch in NCHW with 1-D bias', async () => {
        const inputDepth = 2;
        const inputShape = [2, inputDepth, 2, 2];
        const outputDepth = 2;
        const fSize = 2;
        const pad = 'same';
        const strides = [1, 1];
        const dataFormat = 'NCHW';
        const dilation = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], inputShape);
        const w = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, -1, -2, -3, -4, -5, -6, -7, -8], [fSize, fSize, inputDepth, outputDepth]);
        const bias = tf.tensor1d([1, 2]);
        const result = tf.fused.conv2d({ x, filter: w, strides, pad, dataFormat, dilations: dilation, bias });
        expect(result.shape).toEqual([2, 2, 2, 2]);
        expectArraysClose(await result.data(), [
            -31, -7, 101, 29, -38, -10, 124, 42, -31, -7, 229, 61, -38, -10, 284, 90
        ]);
    });
    it('batch in NCHW with scalar PReLU actiavation weights', async () => {
        const inputDepth = 2;
        const inputShape = [2, inputDepth, 2, 2];
        const outputDepth = 2;
        const fSize = 2;
        const pad = 'same';
        const strides = [1, 1];
        const dataFormat = 'NCHW';
        const dilation = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], inputShape);
        const w = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, -1, -2, -3, -4, -5, -6, -7, -8], [fSize, fSize, inputDepth, outputDepth]);
        const alpha = tf.scalar(10);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides,
            pad,
            dataFormat,
            dilations: dilation,
            activation: 'prelu',
            preluActivationWeights: alpha
        });
        expect(result.shape).toEqual([2, 2, 2, 2]);
        expectArraysClose(await result.data(), [
            -320, -80, 100, 28, -400, -120, 122, 40, -320, -80, 228, 60, -400, -120,
            282, 88
        ]);
    });
    it('batch in NCHW with 1-D PReLU actiavation weights', async () => {
        const inputDepth = 2;
        const inputShape = [2, inputDepth, 2, 2];
        const outputDepth = 2;
        const fSize = 2;
        const pad = 'same';
        const strides = [1, 1];
        const dataFormat = 'NCHW';
        const dilation = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], inputShape);
        const w = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, -1, -2, -3, -4, -5, -6, -7, -8], [fSize, fSize, inputDepth, outputDepth]);
        const alpha = tf.tensor1d([1, 10]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides,
            pad,
            dataFormat,
            dilations: dilation,
            activation: 'prelu',
            preluActivationWeights: alpha
        });
        expect(result.shape).toEqual([2, 2, 2, 2]);
        expectArraysClose(await result.data(), [
            -32, -8, 100, 28, -400, -120, 122, 40, -32, -8, 228, 60, -400, -120, 282,
            88
        ]);
    });
    it('batch in NCHW with 3-D PReLU actiavation weights', async () => {
        const inputDepth = 2;
        const inputShape = [2, inputDepth, 2, 2];
        const outputDepth = 2;
        const fSize = 2;
        const pad = 'same';
        const strides = [1, 1];
        const dataFormat = 'NCHW';
        const dilation = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], inputShape);
        const w = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, -1, -2, -3, -4, -5, -6, -7, -8], [fSize, fSize, inputDepth, outputDepth]);
        const alpha = tf.tensor3d([1, 10], [2, 1, 1]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides,
            pad,
            dataFormat,
            dilations: dilation,
            activation: 'prelu',
            preluActivationWeights: alpha
        });
        expect(result.shape).toEqual([2, 2, 2, 2]);
        expectArraysClose(await result.data(), [
            -32, -8, 100, 28, -400, -120, 122, 40, -32, -8, 228, 60, -400, -120, 282,
            88
        ]);
    });
    it('batch in NCHW with full 3-D PReLU actiavation weights', async () => {
        const inputDepth = 2;
        const inputShape = [2, inputDepth, 2, 2];
        const outputDepth = 2;
        const fSize = 2;
        const pad = 'same';
        const strides = [1, 1];
        const dataFormat = 'NCHW';
        const dilation = 1;
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], inputShape);
        const w = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, -1, -2, -3, -4, -5, -6, -7, -8], [fSize, fSize, inputDepth, outputDepth]);
        const alpha = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]);
        const result = tf.fused.conv2d({
            x,
            filter: w,
            strides,
            pad,
            dataFormat,
            dilations: dilation,
            activation: 'prelu',
            preluActivationWeights: alpha
        });
        expect(result.shape).toEqual([2, 2, 2, 2]);
        expectArraysClose(await result.data(), [
            -32, -16, 100, 28, -200, -72, 122, 40, -32, -16, 228, 60, -200, -72, 282,
            88
        ]);
    });
    it('backProp input x=[2,3,3,1] f=[2,2,1,1] s=1 p=0', async () => {
        const inputDepth = 1;
        const outputDepth = 1;
        const inputShape = [2, 3, 3, inputDepth];
        const filterSize = 2;
        const strides = 1;
        const pad = 0;
        const filterShape = [filterSize, filterSize, inputDepth, outputDepth];
        const filter = tf.tensor4d([-1, 1, -2, 0.5], filterShape);
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9], inputShape);
        const dy = tf.tensor4d([3, 1, 2, 0, 3, 1, 2, 0], [2, 2, 2, 1]);
        const grads = tf.grads((x) => tf.fused.conv2d({ x, filter, strides, pad }));
        const [dx] = grads([x], dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(await dx.data(), [-3, 2, 1, -8, 1.5, 0.5, -4, 1, 0, -3, 2, 1, -8, 1.5, 0.5, -4, 1, 0]);
    });
    it('gradient x=[2,3,3,1] f=[2,2,1,1] s=1 p=0', async () => {
        const inputDepth = 1;
        const outputDepth = 1;
        const inputShape = [2, 3, 3, inputDepth];
        const filterSize = 2;
        const strides = 1;
        const pad = 0;
        const filterShape = [filterSize, filterSize, inputDepth, outputDepth];
        const filter = tf.tensor4d([-1, 1, -2, 0.5], filterShape);
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9], inputShape);
        const dy = tf.tensor4d([3, 1, 2, 0, 3, 1, 2, 0], [2, 2, 2, 1]);
        const grads = tf.grads((x, filter) => tf.fused.conv2d({ x, filter, strides, pad }));
        const [dx, dfilter] = grads([x, filter], dy);
        expect(dx.shape).toEqual(x.shape);
        expectArraysClose(await dx.data(), [-3, 2, 1, -8, 1.5, 0.5, -4, 1, 0, -3, 2, 1, -8, 1.5, 0.5, -4, 1, 0]);
        expect(dfilter.shape).toEqual(filterShape);
        expectArraysClose(await dfilter.data(), [26, 38, 62, 74]);
    });
    it('gradient x=[2,3,3,1] f=[2,2,1,1] s=1 p=0 with bias', async () => {
        const inputDepth = 1;
        const outputDepth = 1;
        const inputShape = [2, 3, 3, inputDepth];
        const filterSize = 2;
        const strides = 1;
        const pad = 0;
        const filterShape = [filterSize, filterSize, inputDepth, outputDepth];
        const filter = tf.tensor4d([-1, 1, -2, 0.5], filterShape);
        const bias = tf.ones([2, 2, 2, 1]);
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9], inputShape);
        const dy = tf.tensor4d([3, 1, 2, 0, 3, 1, 2, 0], [2, 2, 2, 1]);
        const fusedGrads = tf.grads((x, w, b) => tf.fused.conv2d({
            x,
            filter: w,
            strides,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            bias: b
        }));
        const [dxFused, dfilterFused, dbiasFused] = fusedGrads([x, filter, bias], dy);
        const grads = tf.grads((x, filter, bias) => {
            const conv = tf.conv2d(x, filter, strides, pad);
            const sum = tf.add(conv, bias);
            return sum;
        });
        const [dx, dfilter, dbias] = grads([x, filter, bias], dy);
        expectArraysClose(await dxFused.array(), await dx.array());
        expectArraysClose(await dfilterFused.array(), await dfilter.array());
        expectArraysClose(await dbiasFused.array(), await dbias.array());
    });
    it('gradient x=[2,3,3,1] f=[2,2,1,1] s=1 p=0 with bias and relu', async () => {
        const inputDepth = 1;
        const outputDepth = 1;
        const inputShape = [2, 3, 3, inputDepth];
        const filterSize = 2;
        const strides = 1;
        const pad = 0;
        const filterShape = [filterSize, filterSize, inputDepth, outputDepth];
        const filter = tf.tensor4d([-1, 1, -2, 0.5], filterShape);
        const bias = tf.ones([2, 2, 2, 1]);
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9], inputShape);
        const dy = tf.tensor4d([3, 1, 2, 0, 3, 1, 2, 0], [2, 2, 2, 1]);
        const fusedGrads = tf.grads((x, w, b) => tf.fused.conv2d({
            x,
            filter: w,
            strides,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            bias: b,
            activation: 'relu'
        }));
        const [dxFused, dfilterFused, dbiasFused] = fusedGrads([x, filter, bias], dy);
        const grads = tf.grads((x, filter, bias) => {
            const conv = tf.conv2d(x, filter, strides, pad);
            const sum = tf.add(conv, bias);
            return tf.relu(sum);
        });
        const [dx, dfilter, dbias] = grads([x, filter, bias], dy);
        expectArraysClose(await dxFused.array(), await dx.array());
        expectArraysClose(await dfilterFused.array(), await dfilter.array());
        expectArraysClose(await dbiasFused.array(), await dbias.array());
    });
    it('gradient x=[2,3,3,1] f=[2,2,1,1] s=1 p=0 with bias and elu', async () => {
        const inputDepth = 1;
        const outputDepth = 1;
        const inputShape = [2, 3, 3, inputDepth];
        const filterSize = 2;
        const strides = 1;
        const pad = 0;
        const filterShape = [filterSize, filterSize, inputDepth, outputDepth];
        const filter = tf.tensor4d([-1, 1, -2, 0.5], filterShape);
        const bias = tf.ones([2, 2, 2, 1]);
        const x = tf.tensor4d([1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9], inputShape);
        const dy = tf.tensor4d([3, 1, 2, 0, 3, 1, 2, 0], [2, 2, 2, 1]);
        const fusedGrads = tf.grads((x, w, b) => tf.fused.conv2d({
            x,
            filter: w,
            strides,
            pad,
            dataFormat: 'NHWC',
            dilations: [1, 1],
            bias: b,
            activation: 'elu'
        }));
        const [dxFused, dfilterFused, dbiasFused] = fusedGrads([x, filter, bias], dy);
        const grads = tf.grads((x, filter, bias) => {
            const conv = tf.conv2d(x, filter, strides, pad);
            const sum = tf.add(conv, bias);
            return tf.elu(sum);
        });
        const [dx, dfilter, dbias] = grads([x, filter, bias], dy);
        expectArraysClose(await dxFused.array(), await dx.array());
        expectArraysClose(await dfilterFused.array(), await dfilter.array());
        expectArraysClose(await dbiasFused.array(), await dbias.array());
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
        expect(() => tf.fused.conv2d({ x, filter: w, strides: stride, pad }))
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
        expect(() => tf.fused.conv2d({ x, filter: w, strides: stride, pad }))
            .toThrowError(/Argument 'filter' passed to 'conv2d' must be float32/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVzZWRfY29udjJkX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9mdXNlZC9mdXNlZF9jb252MmRfdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEtBQUssRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNsQyxPQUFPLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDL0QsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFbEQsU0FBUyxrQkFBa0IsQ0FBQyxlQUF1QixFQUFFLGVBQXVCO0lBQzFFLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3ZDLE1BQU0sSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBRXhDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxlQUFlLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDeEMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsZUFBZSxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7S0FDbEQ7SUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZUFBZSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3hDLE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztLQUM1QjtJQUVELE9BQU8sRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQztBQUNwQyxDQUFDO0FBRUQsaUJBQWlCLENBQUMsY0FBYyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDL0MsRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLElBQUksRUFBRTtRQUNyQixNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDckIsTUFBTSxPQUFPLEdBQXFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDeEUsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFFakIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FDakIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN0RSxNQUFNLENBQUMsR0FDSCxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUUzRSxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztRQUNyRSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsTUFBTSxRQUFRLEdBQ1YsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFekUsaUJBQWlCLENBQUMsTUFBTSxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDbkQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDL0IsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLE1BQU0sT0FBTyxHQUFxQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBQztRQUN0QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDaEIsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQ2pCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdEUsTUFBTSxDQUFDLEdBQ0gsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFFM0UsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDN0IsQ0FBQztZQUNELE1BQU0sRUFBRSxDQUFDO1lBQ1QsT0FBTyxFQUFFLE1BQU07WUFDZixHQUFHO1lBQ0gsVUFBVSxFQUFFLE1BQU07WUFDbEIsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNqQixVQUFVLEVBQUUsTUFBTTtTQUNuQixDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUV2RSxpQkFBaUIsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNuRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxpRUFBaUUsRUFDakUsS0FBSyxJQUFJLEVBQUU7UUFDVCxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDdEIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sVUFBVSxHQUNaLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbEMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUM7UUFDbkIsTUFBTSxNQUFNLEdBQXFCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXhDLDJEQUEyRDtRQUMzRCxpREFBaUQ7UUFDakQsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNuRCxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUN2QjtRQUVELE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNqQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxVQUFVLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2pFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ25CO1FBRUQsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBRXRFLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQzdCLENBQUM7WUFDRCxNQUFNLEVBQUUsQ0FBQztZQUNULE9BQU8sRUFBRSxNQUFNO1lBQ2YsR0FBRztZQUNILFVBQVUsRUFBRSxNQUFNO1lBQ2xCLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDakIsVUFBVSxFQUFFLE1BQU07U0FDbkIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLGlCQUFpQixDQUFDLE1BQU0sTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksWUFBWSxDQUFDO1lBQ3BDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUc7WUFDaEQsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHO1NBQzdCLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxDQUFDO0lBRU4sRUFBRSxDQUFDLGlFQUFpRSxFQUNqRSxLQUFLLElBQUksRUFBRTtRQUNULE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUN0QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDaEIsTUFBTSxVQUFVLEdBQ1osQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNsQyxNQUFNLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDdEIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQztRQUNuQixNQUFNLE1BQU0sR0FBcUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFeEMsTUFBTSxNQUFNLEdBQUcsa0JBQWtCLENBQzdCLENBQUMsR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLFVBQVUsRUFDOUIsS0FBSyxHQUFHLEtBQUssR0FBRyxVQUFVLEdBQUcsV0FBVyxDQUFDLENBQUM7UUFDOUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxHQUNILEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDeEUsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQzdCLENBQUM7WUFDRCxNQUFNLEVBQUUsQ0FBQztZQUNULE9BQU8sRUFBRSxNQUFNO1lBQ2YsR0FBRztZQUNILFVBQVUsRUFBRSxNQUFNO1lBQ2xCLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDakIsVUFBVSxFQUFFLE1BQU07WUFDbEIsSUFBSTtTQUNMLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxpQkFBaUIsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLFlBQVksQ0FBQztZQUNwQyxpQkFBaUI7WUFDakIsQ0FBQztZQUNELGtCQUFrQjtZQUNsQixDQUFDO1lBQ0Qsa0JBQWtCO1lBQ2xCLENBQUM7WUFDRCxrQkFBa0I7WUFDbEIsQ0FBQztZQUNELGtCQUFrQjtZQUNsQixDQUFDO1lBQ0Qsa0JBQWtCO1lBQ2xCLENBQUM7WUFDRCxrQkFBa0I7WUFDbEIsQ0FBQztZQUNELGtCQUFrQjtZQUNsQixDQUFDO1lBQ0Qsa0JBQWtCO1lBQ2xCLENBQUM7WUFDRCxrQkFBa0I7WUFDbEIsQ0FBQztZQUNELGtCQUFrQjtZQUNsQixDQUFDO1lBQ0QsaUJBQWlCO1lBQ2pCLENBQUM7WUFDRCxrQkFBa0I7WUFDbEIsQ0FBQztZQUNELGtCQUFrQjtZQUNsQixDQUFDO1lBQ0Qsa0JBQWtCO1lBQ2xCLENBQUM7WUFDRCxrQkFBa0I7WUFDbEIsQ0FBQztZQUNELGtCQUFrQjtZQUNsQixtQkFBbUI7WUFDbkIsaUJBQWlCO1lBQ2pCLENBQUM7WUFDRCxrQkFBa0I7WUFDbEIsa0JBQWtCO1lBQ2xCLGlCQUFpQjtZQUNqQixpQkFBaUI7WUFDakIsa0JBQWtCO1lBQ2xCLGtCQUFrQjtZQUNsQixpQkFBaUI7WUFDakIsa0JBQWtCO1lBQ2xCLGtCQUFrQjtZQUNsQixpQkFBaUI7WUFDakIsaUJBQWlCO1lBQ2pCLGdCQUFnQjtZQUNoQixDQUFDO1lBQ0Qsa0JBQWtCO1lBQ2xCLGtCQUFrQjtZQUNsQixpQkFBaUI7WUFDakIsaUJBQWlCO1lBQ2pCLGVBQWU7WUFDZixnQkFBZ0I7WUFDaEIsaUJBQWlCO1lBQ2pCLENBQUM7WUFDRCxpQkFBaUI7WUFDakIsQ0FBQztZQUNELGlCQUFpQjtZQUNqQixrQkFBa0I7WUFDbEIsaUJBQWlCO1lBQ2pCLGlCQUFpQjtZQUNqQixrQkFBa0I7WUFDbEIsQ0FBQztZQUNELGtCQUFrQjtZQUNsQixDQUFDO1lBQ0Qsa0JBQWtCO1lBQ2xCLENBQUM7WUFDRCxrQkFBa0I7WUFDbEIsQ0FBQztZQUNELGtCQUFrQjtZQUNsQixDQUFDO1lBQ0Qsa0JBQWtCO1lBQ2xCLENBQUM7WUFDRCxrQkFBa0I7WUFDbEIsQ0FBQztZQUNELGtCQUFrQjtZQUNsQixDQUFDO1lBQ0Qsa0JBQWtCO1lBQ2xCLENBQUM7WUFDRCxrQkFBa0I7WUFDbEIsQ0FBQztZQUNELGtCQUFrQjtZQUNsQixDQUFDO1lBQ0QsaUJBQWlCO1lBQ2pCLENBQUM7WUFDRCxrQkFBa0I7WUFDbEIsQ0FBQztZQUNELGtCQUFrQjtZQUNsQixDQUFDO1lBQ0Qsa0JBQWtCO1lBQ2xCLENBQUM7WUFDRCxrQkFBa0I7WUFDbEIsQ0FBQztZQUNELGtCQUFrQjtZQUNsQixDQUFDO1lBQ0QsaUJBQWlCO1lBQ2pCLENB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QyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNsRSxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUNqQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUNoRCxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDN0MsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUxQixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUM3QixDQUFDO1lBQ0QsTUFBTSxFQUFFLENBQUM7WUFDVCxPQUFPLEVBQUUsTUFBTTtZQUNmLEdBQUc7WUFDSCxVQUFVO1lBQ1YsU0FBUyxFQUFFLFFBQVE7WUFDbkIsSUFBSTtTQUNMLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxNQUFNLFFBQVEsR0FDVixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3JF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QUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbEUsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FDakI7WUFDRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ2hFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDaEUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDM0QsRUFDRCxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDN0MsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUxQixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUM3QixDQUFDO1lBQ0QsTUFBTSxFQUFFLENBQUM7WUFDVCxPQUFPLEVBQUUsTUFBTTtZQUNmLEdBQUc7WUFDSCxVQUFVO1lBQ1YsU0FBUyxFQUFFLFFBQVE7WUFDbkIsSUFBSTtTQUNMLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxNQUFNLFFBQVEsR0FDVixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3JFLGlCQUFpQixDQUFDLE1BQU0sTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDhCQUE4QixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzVDLE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNyQixNQUFNLFVBQVUsR0FBcUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzRSxNQUFNLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDdEIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQztRQUNuQixNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDakIsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDO1FBQzFCLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQztRQUVuQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUNqQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2xFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQ2pCO1lBQ0UsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNoRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ2hFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUs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LENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN6RCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUNqQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFDaEUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFL0QsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDN0IsQ0FBQztZQUNELE1BQU0sRUFBRSxDQUFDO1lBQ1QsT0FBTyxFQUFFLE1BQU07WUFDZixHQUFHO1lBQ0gsVUFBVTtZQUNWLFNBQVMsRUFBRSxRQUFRO1lBQ25CLFVBQVUsRUFBRSxPQUFPO1lBQ25CLHNCQUFzQixFQUFFLEtBQUs7U0FDOUIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENB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QUcsR0FBRyxNQUFNLENBQUM7UUFDbkIsTUFBTSxPQUFPLEdBQXFCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQztRQUMxQixNQUFNLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFFbkIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FDakIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN6RSxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUNqQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFDeEQsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFMUIsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQzFCLEVBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBRXpFLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxpQkFBaUIsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNyQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRTtTQUN6RSxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw2QkFBNkIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUMzQyxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDckIsTUFBTSxVQUFVLEdBQXFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0UsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUM7UUFDbkIsTUFBTSxPQUFPLEdBQXFCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQztRQUMxQixNQUFNLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFFbkIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FDakIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN6RSxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUNqQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFDeEQsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVqQyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FDMUIsRUFBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFFekUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLGlCQUFpQixDQUFDLE1BQU0sTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3JDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFF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LENBQUMsQ0FBQztRQUNsQixNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFFZCxNQUFNLFdBQVcsR0FDYixDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFMUQsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FDakIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRS9ELE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQ2xCLENBQUMsQ0FBYyxFQUFFLE1BQW1CLEVBQUUsRUFBRSxDQUNwQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUNwRCxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFN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Q3RCLE1BQU0sVUFBVSxHQUNaLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDMUIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNsQixNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFFZCxNQUFNLFdBQVcsR0FDYixDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDMUQsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbkMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FDakIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRS9ELE1BQU0sVUFBVSxHQUNaLEVB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TSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FDakIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUV4RSxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7YUFDOUQsWUFBWSxDQUFDLHNEQUFzRCxDQUFDLENBQUM7SUFDNUUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0ICogYXMgdGYgZnJvbSAnLi4vLi4vaW5kZXgnO1xuaW1wb3J0IHtBTExfRU5WUywgZGVzY3JpYmVXaXRoRmxhZ3N9IGZyb20gJy4uLy4uL2phc21pbmVfdXRpbCc7XG5pbXBvcnQge2V4cGVjdEFycmF5c0Nsb3NlfSBmcm9tICcuLi8uLi90ZXN0X3V0aWwnO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUNhc2VJbnB1dHModG90YWxTaXplVGVuc29yOiBudW1iZXIsIHRvdGFsU2l6ZUZpbHRlcjogbnVtYmVyKSB7XG4gIGNvbnN0IGlucCA9IG5ldyBBcnJheSh0b3RhbFNpemVUZW5zb3IpO1xuICBjb25zdCBmaWx0ID0gbmV3IEFycmF5KHRvdGFsU2l6ZUZpbHRlcik7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3RhbFNpemVUZW5zb3I7IGkrKykge1xuICAgIGlucFtpXSA9IGkgKiAwLjAwMSAtIHRvdGFsU2l6ZVRlbnNvciAqIDAuMDAxIC8gMjtcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdGFsU2l6ZUZpbHRlcjsgaSsrKSB7XG4gICAgY29uc3Qgc2lnbiA9IGkgJSAyID09PSAwID8gLTEgOiAxO1xuICAgIGZpbHRbaV0gPSBpICogMC4wMDEgKiBzaWduO1xuICB9XG5cbiAgcmV0dXJuIHtpbnB1dDogaW5wLCBmaWx0ZXI6IGZpbHR9O1xufVxuXG5kZXNjcmliZVdpdGhGbGFncygnZnVzZWQgY29udjJkJywgQUxMX0VOVlMsICgpID0+IHtcbiAgaXQoJ2Jhc2ljJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzIsIDIsIDIsIGlucHV0RGVwdGhdO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gMjtcbiAgICBjb25zdCBmU2l6ZSA9IDE7XG4gICAgY29uc3QgcGFkID0gMDtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSwgMTZdLCBpblNoYXBlKTtcbiAgICBjb25zdCB3ID1cbiAgICAgICAgdGYudGVuc29yNGQoWy0xLCAxLCAtMiwgMC41XSwgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmZ1c2VkLmNvbnYyZCh7eCwgZmlsdGVyOiB3LCBzdHJpZGVzOiBzdHJpZGUsIHBhZH0pO1xuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzIsIDIsIDIsIDJdKTtcbiAgICBjb25zdCBleHBlY3RlZCA9XG4gICAgICAgIFstNSwgMiwgLTExLCA1LCAtMTcsIDgsIC0yMywgMTEsIC0yOSwgMTQsIC0zNSwgMTcsIC00MSwgMjAsIC00NywgMjNdO1xuXG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgZXhwZWN0ZWQpO1xuICB9KTtcblxuICBpdCgnYmFzaWMgd2l0aCByZWx1JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzIsIDIsIDIsIGlucHV0RGVwdGhdO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gMjtcbiAgICBjb25zdCBmU2l6ZSA9IDE7XG4gICAgY29uc3QgcGFkID0gMDtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSwgMTZdLCBpblNoYXBlKTtcbiAgICBjb25zdCB3ID1cbiAgICAgICAgdGYudGVuc29yNGQoWy0xLCAxLCAtMiwgMC41XSwgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmZ1c2VkLmNvbnYyZCh7XG4gICAgICB4LFxuICAgICAgZmlsdGVyOiB3LFxuICAgICAgc3RyaWRlczogc3RyaWRlLFxuICAgICAgcGFkLFxuICAgICAgZGF0YUZvcm1hdDogJ05IV0MnLFxuICAgICAgZGlsYXRpb25zOiBbMSwgMV0sXG4gICAgICBhY3RpdmF0aW9uOiAncmVsdSdcbiAgICB9KTtcbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFsyLCAyLCAyLCAyXSk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbMCwgMiwgMCwgNSwgMCwgOCwgMCwgMTEsIDAsIDE0LCAwLCAxNywgMCwgMjAsIDAsIDIzXTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ3JlbHUgd2l0aCBzdHJpZGUgMiB4PVsxLDgsOCwxNl0gZj1bMywzLDE2LDFdIHM9WzIsMl0gZD0xIHA9c2FtZScsXG4gICAgIGFzeW5jICgpID0+IHtcbiAgICAgICBjb25zdCBpbnB1dERlcHRoID0gMTY7XG4gICAgICAgY29uc3QgeFNpemUgPSA4O1xuICAgICAgIGNvbnN0IGlucHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID1cbiAgICAgICAgICAgWzEsIHhTaXplLCB4U2l6ZSwgaW5wdXREZXB0aF07XG4gICAgICAgY29uc3Qgb3V0cHV0RGVwdGggPSAxO1xuICAgICAgIGNvbnN0IGZTaXplID0gMztcbiAgICAgICBjb25zdCBwYWQgPSAnc2FtZSc7XG4gICAgICAgY29uc3Qgc3RyaWRlOiBbbnVtYmVyLCBudW1iZXJdID0gWzIsIDJdO1xuXG4gICAgICAgLy8gVE9ETyhhbm54aW5neXVhbik6IE1ha2UgdGhpcyB0ZXN0IHdvcmsgd2l0aCBsYXJnZSBpbnB1dHNcbiAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdGVuc29yZmxvdy90ZmpzL2lzc3Vlcy8zMTQzXG4gICAgICAgY29uc3QgaW5wdXREYXRhID0gW107XG4gICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB4U2l6ZSAqIHhTaXplICogaW5wdXREZXB0aDsgaSsrKSB7XG4gICAgICAgICBpbnB1dERhdGEucHVzaChpICUgNSk7XG4gICAgICAgfVxuXG4gICAgICAgY29uc3Qgd0RhdGEgPSBbXTtcbiAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZTaXplICogZlNpemUgKiBpbnB1dERlcHRoICogb3V0cHV0RGVwdGg7IGkrKykge1xuICAgICAgICAgd0RhdGEucHVzaChpICUgNSk7XG4gICAgICAgfVxuXG4gICAgICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKGlucHV0RGF0YSwgaW5wdXRTaGFwZSk7XG4gICAgICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKHdEYXRhLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuXG4gICAgICAgY29uc3QgcmVzdWx0ID0gdGYuZnVzZWQuY29udjJkKHtcbiAgICAgICAgIHgsXG4gICAgICAgICBmaWx0ZXI6IHcsXG4gICAgICAgICBzdHJpZGVzOiBzdHJpZGUsXG4gICAgICAgICBwYWQsXG4gICAgICAgICBkYXRhRm9ybWF0OiAnTkhXQycsXG4gICAgICAgICBkaWxhdGlvbnM6IFsxLCAxXSxcbiAgICAgICAgIGFjdGl2YXRpb246ICdyZWx1J1xuICAgICAgIH0pO1xuICAgICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzEsIDQsIDQsIDFdKTtcbiAgICAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDg1NCwgNDMxLCA1NjgsIDM4MiwgNTgwLCA0MjcsIDg1NCwgMjg4LCA0MzEsIDU2OCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDU4MCwgMjg5LCAyODUsIDU3MCwgMjg1LCAyNThcbiAgICAgICAgICAgICAgICAgICAgICAgICBdKSk7XG4gICAgIH0pO1xuXG4gIGl0KCdyZWx1IGJpYXMgc3RyaWRlIDIgeD1bMSw4LDgsMTZdIGY9WzMsMywxNiwxXSBzPVsyLDJdIGQ9OCBwPXNhbWUnLFxuICAgICBhc3luYyAoKSA9PiB7XG4gICAgICAgY29uc3QgaW5wdXREZXB0aCA9IDE2O1xuICAgICAgIGNvbnN0IHhTaXplID0gODtcbiAgICAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9XG4gICAgICAgICAgIFsxLCB4U2l6ZSwgeFNpemUsIGlucHV0RGVwdGhdO1xuICAgICAgIGNvbnN0IG91dHB1dERlcHRoID0gODtcbiAgICAgICBjb25zdCBmU2l6ZSA9IDM7XG4gICAgICAgY29uc3QgcGFkID0gJ3NhbWUnO1xuICAgICAgIGNvbnN0IHN0cmlkZTogW251bWJlciwgbnVtYmVyXSA9IFsyLCAyXTtcblxuICAgICAgIGNvbnN0IGlucHV0cyA9IGdlbmVyYXRlQ2FzZUlucHV0cyhcbiAgICAgICAgICAgMSAqIHhTaXplICogeFNpemUgKiBpbnB1dERlcHRoLFxuICAgICAgICAgICBmU2l6ZSAqIGZTaXplICogaW5wdXREZXB0aCAqIG91dHB1dERlcHRoKTtcbiAgICAgICBjb25zdCB4ID0gdGYudGVuc29yNGQoaW5wdXRzLmlucHV0LCBpbnB1dFNoYXBlKTtcbiAgICAgICBjb25zdCB3ID1cbiAgICAgICAgICAgdGYudGVuc29yNGQoaW5wdXRzLmZpbHRlciwgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcbiAgICAgICBjb25zdCBiaWFzID0gdGYudGVuc29yMWQoWzEsIDQsIDIsIDMsIDksIDYsIDUsIDhdKTtcbiAgICAgICBjb25zdCByZXN1bHQgPSB0Zi5mdXNlZC5jb252MmQoe1xuICAgICAgICAgeCxcbiAgICAgICAgIGZpbHRlcjogdyxcbiAgICAgICAgIHN0cmlkZXM6IHN0cmlkZSxcbiAgICAgICAgIHBhZCxcbiAgICAgICAgIGRhdGFGb3JtYXQ6ICdOSFdDJyxcbiAgICAgICAgIGRpbGF0aW9uczogWzEsIDFdLFxuICAgICAgICAgYWN0aXZhdGlvbjogJ3JlbHUnLFxuICAgICAgICAgYmlhc1xuICAgICAgIH0pO1xuICAgICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzEsIDQsIDQsIDhdKTtcbiAgICAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDI1Ljc1Mzk4MDYzNjU5NjY4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDI2Ljg1NzgwNTI1MjA3NTE5NSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAzMy45NjE2MzE3NzQ5MDIzNDQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMzAuMDY1NDU4Mjk3NzI5NDkyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDIzLjExODIwNjAyNDE2OTkyMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAyNC4yMTI4MjAwNTMxMDA1ODYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMzEuMzA3NDIyNjM3OTM5NDUzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDI3LjQwMjAzNDc1OTUyMTQ4NCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAyMC40ODI0MzE0MTE3NDMxNjQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMjEuNTY3ODIxNTAyNjg1NTQ3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDI4LjY1MzIxNzMxNTY3MzgyOCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAyNC43Mzg2MTMxMjg2NjIxMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAxMS4wNzgwODAxNzczMDcxMjksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMTIuMTMwMzk5NzAzOTc5NDkyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDE5LjE4MjcyMDE4NDMyNjE3MixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAxNS4yMzUwMzc4MDM2NDk5MDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNC42Njc3Nzc1MzgyOTk1NjA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMC4zMTcxNzcyOTU2ODQ4MTQ0NSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDUuNjk3ODY5Nzc3Njc5NDQzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDEyLjcyNzk2ODIxNTk0MjM4MyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDIuMjU2OTg0OTQ5MTExOTM4NSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDguNzU4MDY2MTc3MzY4MTY0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNC4yMjY4ODU3OTU1OTMyNjIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAyLjAzMTk5OTU4ODAxMjY5NTMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAyLjk1NzU1ODYzMTg5Njk3MjcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAzLjA1Mjg4MDA0ODc1MTgzMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDEuOTM2Njc5NjAxNjY5MzExNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDEwLjA3Mzc2MDAzMjY1MzgwOSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDQuOTE1Nzk5NjE3NzY3MzM0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNi4wOTQ2Mzk3NzgxMzcyMDcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2Ljg5NDkyMTMwMjc5NTQxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDUuNTk3OTQzNzgyODA2Mzk2NSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAuNDA3ODg3NTc4MDEwNTU5MSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDQuNTg2MjgwODIyNzUzOTA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNy40MTk1NTE4NDkzNjUyMzQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA3LjU3NDYxNjkwOTAyNzEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAzLjQzMTIxNjAwMTUxMDYyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgOS41NjI5NTIwNDE2MjU5NzcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNi40MDQ5NDM5NDMwMjM2ODIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNS40MDE3NzYzMTM3ODE3MzgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LjU5OTgwNzczOTI1NzgxMjUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA4LjM5ODYwODIwNzcwMjYzNyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDIuNjAyOTc2MDgzNzU1NDkzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMTAuMzk1NDQwMTAxNjIzNTM1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDIxLjQ0MDI1MDM5NjcyODUxNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAyMC40ODM4ODI5MDQwNTI3MzQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMjMuNTI3NTA5Njg5MzMxMDU1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDI1LjU3MTE0NDEwNDAwMzkwNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAyNC4wODA2MjkzNDg3NTQ4ODMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMjMuMTMzNDgwMDcyMDIxNDg0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDI2LjE4NjMyODg4NzkzOTQ1MyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAyOC4yMzkxNzc3MDM4NTc0MjIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMjYuNzIxMDEyMTE1NDc4NTE2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDI1Ljc4MzA3OTE0NzMzODg2NyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAyOC44NDUxNDgwODY1NDc4NSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAzMC45MDcyMDkzOTYzNjIzMDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMTguOTE0MTI3MzQ5ODUzNTE2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDE3Ljk2MDExMTYxODA0MTk5MixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAyMS4wMDYwOTM5Nzg4ODE4MzYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMjMuMDUyMDgyMDYxNzY3NTc4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDE3Ljg5MDg5NTg0MzUwNTg2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDE2Ljk1Njg0ODE0NDUzMTI1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDIwLjAyMjc5ODUzODIwODAwOCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAyMi4wODg3NTQ2NTM5MzA2NjQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMTkuMDYxMzI2OTgwNTkwODIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMTguMTMzNDI0NzU4OTExMTMzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDIxLjIwNTUyMDYyOTg4MjgxMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAyMy4yNzc2MTQ1OTM1MDU4NixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAyMC4yMzE3NTgxMTc2NzU3OCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAxOS4zMDk5OTk0NjU5NDIzODMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMjIuMzg4MjQwODE0MjA4OTg0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDI0LjQ2NjQ3ODM0Nzc3ODMyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDEzLjU4NDM1MjQ5MzI4NjEzMyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAxMi42Mzk1ODQ1NDEzMjA4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDE1LjY5NDgxNTYzNTY4MTE1MixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAxNy43NTAwNDU3NzYzNjcxODhcbiAgICAgICAgICAgICAgICAgICAgICAgICBdKSk7XG4gICAgIH0pO1xuXG4gIGl0KCdwcmVsdSBiaWFzIHN0cmlkZSAyIHg9WzEsOCw4LDE2XSBmPVszLDMsMTYsMV0gcz1bMiwyXSBkPTggcD1zYW1lJyxcbiAgICAgYXN5bmMgKCkgPT4ge1xuICAgICAgIGNvbnN0IGlucHV0RGVwdGggPSAxNjtcbiAgICAgICBjb25zdCB4U2l6ZSA9IDg7XG4gICAgICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPVxuICAgICAgICAgICBbMSwgeFNpemUsIHhTaXplLCBpbnB1dERlcHRoXTtcbiAgICAgICBjb25zdCBvdXRwdXREZXB0aCA9IDg7XG4gICAgICAgY29uc3QgZlNpemUgPSAzO1xuICAgICAgIGNvbnN0IHBhZCA9ICdzYW1lJztcbiAgICAgICBjb25zdCBzdHJpZGU6IFtudW1iZXIsIG51bWJlcl0gPSBbMiwgMl07XG5cbiAgICAgICBjb25zdCBpbnB1dHMgPSBnZW5lcmF0ZUNhc2VJbnB1dHMoXG4gICAgICAgICAgIDEgKiB4U2l6ZSAqIHhTaXplICogaW5wdXREZXB0aCxcbiAgICAgICAgICAgZlNpemUgKiBmU2l6ZSAqIGlucHV0RGVwdGggKiBvdXRwdXREZXB0aCk7XG4gICAgICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKGlucHV0cy5pbnB1dCwgaW5wdXRTaGFwZSk7XG4gICAgICAgY29uc3QgdyA9XG4gICAgICAgICAgIHRmLnRlbnNvcjRkKGlucHV0cy5maWx0ZXIsIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG4gICAgICAgY29uc3QgYmlhcyA9IHRmLnRlbnNvcjFkKFsxLCA0LCAyLCAzLCA5LCA2LCA1LCA4XSk7XG4gICAgICAgY29uc3QgcHJlbHVBY3RpdmF0aW9uV2VpZ2h0cyA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4XSk7XG5cbiAgICAgICBjb25zdCByZXN1bHQgPSB0Zi5mdXNlZC5jb252MmQoe1xuICAgICAgICAgeCxcbiAgICAgICAgIGZpbHRlcjogdyxcbiAgICAgICAgIHN0cmlkZXM6IHN0cmlkZSxcbiAgICAgICAgIHBhZCxcbiAgICAgICAgIGRhdGFGb3JtYXQ6ICdOSFdDJyxcbiAgICAgICAgIGRpbGF0aW9uczogWzEsIDFdLFxuICAgICAgICAgYWN0aXZhdGlvbjogJ3ByZWx1JyxcbiAgICAgICAgIHByZWx1QWN0aXZhdGlvbldlaWdodHMsXG4gICAgICAgICBiaWFzXG4gICAgICAgfSk7XG4gICAgICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMSwgNCwgNCwgOF0pO1xuICAgICAgIGV4cGVjdEFycmF5c0Nsb3NlKFxuICAgICAgICAgICBhd2FpdCByZXN1bHQuZGF0YSgpLCBuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAgICAgICAgICAyNS43NTM5ODA2MzY1OTY2OCwgICAtNDEuNjExNzg5NzAzMzY5MTQsICAyNi44NTc4MDUyNTIwNzUxOTUsXG4gICAgICAgICAgICAgLTg3LjYzODg1NDk4MDQ2ODc1LCAgMzMuOTYxNjMxNzc0OTAyMzQ0LCAgLTExNC4wODEyNzU5Mzk5NDE0LFxuICAgICAgICAgICAgIDMwLjA2NTQ1ODI5NzcyOTQ5MiwgIC0xMzYuOTM4OTM0MzI2MTcxODgsIDIzLjExODIwNjAyNDE2OTkyMixcbiAgICAgICAgICAgICAtMzYuMzMxMDIwMzU1MjI0NjEsICAyNC4yMTI4MjAwNTMxMDA1ODYsICAtNzcuMDQwNDgxNTY3MzgyODEsXG4gICAgICAgICAgICAgMzEuMzA3NDIyNjM3OTM5NDUzLCAgLTk4LjEyODM1NjkzMzU5Mzc1LCAgMjcuNDAyMDM0NzU5NTIxNDg0LFxuICAgICAgICAgICAgIC0xMTUuNTk0NzI2NTYyNSwgICAgIDIwLjQ4MjQzMTQxMTc0MzE2NCwgIC0zMS4wNTAyNjI0NTExNzE4NzUsXG4gICAgICAgICAgICAgMjEuNTY3ODIxNTAyNjg1NTQ3LCAgLTY2LjQ0MjA5Mjg5NTUwNzgxLCAgMjguNjUzMjE3MzE1NjczODI4LFxuICAgICAgICAgICAgIC04Mi4xNzU0NDU1NTY2NDA2MiwgIDI0LjczODYxMzEyODY2MjExLCAgIC05NC4yNTA0MTE5ODczMDQ2OSxcbiAgICAgICAgICAgICAxMS4wNzgwODAxNzczMDcxMjksICAtMTIuMjA4NDc4OTI3NjEyMzA1LCAxMi4xMzAzOTk3MDM5Nzk0OTIsXG4gICAgICAgICAgICAgLTI4LjYyNjIzMjE0NzIxNjc5NywgMTkuMTgyNzIwMTg0MzI2MTcyLCAgLTI1LjI1MzI5OTcxMzEzNDc2NixcbiAgICAgICAgICAgICAxNS4yMzUwMzc4MDM2NDk5MDIsICAtMTguMDg5NjA3MjM4NzY5NTMsICA0LjY2Nzc3NzUzODI5OTU2MDUsXG4gICAgICAgICAgICAgMC4zMTcxNzcyOTU2ODQ4MTQ0NSwgNS42OTc4Njk3Nzc2Nzk0NDMsICAgLTIuODUxNjc1OTg3MjQzNjUyMyxcbiAgICAgICAgICAgICAxMi43Mjc5NjgyMTU5NDIzODMsICAyLjI1Njk4NDk0OTExMTkzODUsICA4Ljc1ODA2NjE3NzM2ODE2NCxcbiAgICAgICAgICAgICA0LjIyNjg4NTc5NTU5MzI2MiwgICAyLjAzMTk5OTU4ODAxMjY5NTMsICAyLjk1NzU1ODYzMTg5Njk3MjcsXG4gICAgICAgICAgICAgMy4wNTI4ODAwNDg3NTE4MzEsICAgMS45MzY2Nzk2MDE2NjkzMTE1LCAgMTAuMDczNzYwMDMyNjUzODA5LFxuICAgICAgICAgICAgIDQuOTE1Nzk5NjE3NzY3MzM0LCAgIDYuMDk0NjM5Nzc4MTM3MjA3LCAgIDYuODk0OTIxMzAyNzk1NDEsXG4gICAgICAgICAgICAgLTAuNjAzNzc2MzM1NzE2MjQ3NiwgNS41OTc5NDM3ODI4MDYzOTY1LCAgMC40MDc4ODc1NzgwMTA1NTkxLFxuICAgICAgICAgICAgIDQuNTg2MjgwODIyNzUzOTA2LCAgIDcuNDE5NTUxODQ5MzY1MjM0LCAgIDcuNTc0NjE2OTA5MDI3MSxcbiAgICAgICAgICAgICAzLjQzMTIxNjAwMTUxMDYyLCAgICA5LjU2Mjk1MjA0MTYyNTk3NywgICAtMS40MDY1Mjc5OTYwNjMyMzI0LFxuICAgICAgICAgICAgIDYuNDA0OTQzOTQzMDIzNjgyLCAgIC0xLjIxMDA4MDM4NTIwODEyOTksIDUuNDAxNzc2MzEzNzgxNzM4LFxuICAgICAgICAgICAgIDYuNTk5ODA3NzM5MjU3ODEyNSwgIDguMzk4NjA4MjA3NzAyNjM3LCAgIDIuNjAyOTc2MDgzNzU1NDkzLFxuICAgICAgICAgICAgIDEwLjM5NTQ0MDEwMTYyMzUzNSwgIC0xNi40MTg0MzQxNDMwNjY0MDYsIDIxLjQ0MDI1MDM5NjcyODUxNixcbiAgICAgICAgICAgICAtNDYuMzg2MTg4NTA3MDgwMDgsICAyMC40ODM4ODI5MDQwNTI3MzQsICAtNDIuNTI4NDg4MTU5MTc5NjksXG4gICAgICAgICAgICAgMjMuNTI3NTA5Njg5MzMxMDU1LCAgLTg3Ljg0NTMwNjM5NjQ4NDM4LCAgMjUuNTcxMTQ0MTA0MDAzOTA2LFxuICAgICAgICAgICAgIC0xOS4wNTQyMDg3NTU0OTMxNjQsIDI0LjA4MDYyOTM0ODc1NDg4MywgIC01NC4zMjExNTkzNjI3OTI5NyxcbiAgICAgICAgICAgICAyMy4xMzM0ODAwNzIwMjE0ODQsICAtNTUuNzk5NTE0NzcwNTA3ODEsICAyNi4xODYzMjg4ODc5Mzk0NTMsXG4gICAgICAgICAgICAgLTEwNi40ODkyNDI1NTM3MTA5NCwgMjguMjM5MTc3NzAzODU3NDIyLCAgLTIxLjY4OTk4NzE4MjYxNzE4OCxcbiAgICAgICAgICAgICAyNi43MjEwMTIxMTU0Nzg1MTYsICAtNjIuMjU2MTQ5MjkxOTkyMTksICAyNS43ODMwNzkxNDczMzg4NjcsXG4gICAgICAgICAgICAgLTY5LjA3MDU1NjY0MDYyNSwgICAgMjguODQ1MTQ4MDg2NTQ3ODUsICAgLTEyNS4xMzMyNTUwMDQ4ODI4MSxcbiAgICAgICAgICAgICAzMC45MDcyMDkzOTYzNjIzMDUsICAtMTMuODkxMTMzMzA4NDEwNjQ1LCAxOC45MTQxMjczNDk4NTM1MTYsXG4gICAgICAgICAgICAgLTM4LjgxMTM1OTQwNTUxNzU4LCAgMTcuOTYwMTExNjE4MDQxOTkyLCAgLTI5LjkxNTUwNDQ1NTU2NjQwNixcbiAgICAgICAgICAgICAyMS4wMDYwOTM5Nzg4ODE4MzYsICAtNzAuMjAzNjEzMjgxMjUsICAgICAyMy4wNTIwODIwNjE3Njc1NzgsXG4gICAgICAgICAgICAgLTEyLjg1NzkxOTY5Mjk5MzE2NCwgMTcuODkwODk1ODQzNTA1ODYsICAgLTM1Ljc3MTYxMDI2MDAwOTc2NixcbiAgICAgICAgICAgICAxNi45NTY4NDgxNDQ1MzEyNSwgICAtMjQuOTQ5MTE1NzUzMTczODI4LCAyMC4wMjI3OTg1MzgyMDgwMDgsXG4gICAgICAgICAgICAgLTYzLjM5MDQyMjgyMTA0NDkyLCAgMjIuMDg4NzU0NjUzOTMwNjY0LCAgLTE0LjAyNTI4MTkwNjEyNzkzLFxuICAgICAgICAgICAgIDE5LjA2MTMyNjk4MDU5MDgyLCAgIC0zOS4yOTIxMjU3MDE5MDQzLCAgIDE4LjEzMzQyNDc1ODkxMTEzMyxcbiAgICAgICAgICAgICAtMzAuODQ3MzQ5MTY2ODcwMTE3LCAyMS4yMDU1MjA2Mjk4ODI4MTIsICAtNzEuNjkwOTcxMzc0NTExNzIsXG4gICAgICAgICAgICAgMjMuMjc3NjE0NTkzNTA1ODYsICAgLTE1LjE5MjYzODM5NzIxNjc5NywgMjAuMjMxNzU4MTE3Njc1NzgsXG4gICAgICAgICAgICAgLTQyLjgxMjYzMzUxNDQwNDMsICAgMTkuMzA5OTk5NDY1OTQyMzgzLCAgLTM2Ljc0NTYwNTQ2ODc1LFxuICAgICAgICAgICAgIDIyLjM4ODI0MDgxNDIwODk4NCwgIC03OS45OTE1MjM3NDI2NzU3OCwgIDI0LjQ2NjQ3ODM0Nzc3ODMyLFxuICAgICAgICAgICAgIC04LjU1NjczNjk0NjEwNTk1NywgIDEzLjU4NDM1MjQ5MzI4NjEzMywgIC0yMi44MzU5MDEyNjAzNzU5NzcsXG4gICAgICAgICAgICAgMTIuNjM5NTg0NTQxMzIwOCwgICAgLTMuMzM2MDAwNDQyNTA0ODgzLCAgMTUuNjk0ODE1NjM1NjgxMTUyLFxuICAgICAgICAgICAgIC0zMy4wNTcwMTgyODAwMjkzLCAgIDE3Ljc1MDA0NTc3NjM2NzE4OFxuICAgICAgICAgICBdKSk7XG4gICAgIH0pO1xuXG4gIGl0KCdyZWx1NiBiaWFzIHN0cmlkZSAyIHg9WzEsOCw4LDE2XSBmPVszLDMsMTYsOF0gcz1bMiwyXSBkPTggcD1zYW1lJyxcbiAgICAgYXN5bmMgKCkgPT4ge1xuICAgICAgIGNvbnN0IGlucHV0RGVwdGggPSAxNjtcbiAgICAgICBjb25zdCB4U2l6ZSA9IDg7XG4gICAgICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPVxuICAgICAgICAgICBbMSwgeFNpemUsIHhTaXplLCBpbnB1dERlcHRoXTtcbiAgICAgICBjb25zdCBvdXRwdXREZXB0aCA9IDg7XG4gICAgICAgY29uc3QgZlNpemUgPSAzO1xuICAgICAgIGNvbnN0IHBhZCA9ICdzYW1lJztcbiAgICAgICBjb25zdCBzdHJpZGU6IFtudW1iZXIsIG51bWJlcl0gPSBbMiwgMl07XG5cbiAgICAgICBjb25zdCBpbnB1dHMgPSBnZW5lcmF0ZUNhc2VJbnB1dHMoXG4gICAgICAgICAgIDEgKiB4U2l6ZSAqIHhTaXplICogaW5wdXREZXB0aCxcbiAgICAgICAgICAgZlNpemUgKiBmU2l6ZSAqIGlucHV0RGVwdGggKiBvdXRwdXREZXB0aCk7XG4gICAgICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKGlucHV0cy5pbnB1dCwgaW5wdXRTaGFwZSk7XG4gICAgICAgY29uc3QgdyA9XG4gICAgICAgICAgIHRmLnRlbnNvcjRkKGlucHV0cy5maWx0ZXIsIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG4gICAgICAgY29uc3QgYmlhcyA9IHRmLnRlbnNvcjFkKFsxLCA0LCAyLCAzLCA5LCA2LCA1LCA4XSk7XG5cbiAgICAgICBjb25zdCByZXN1bHQgPSB0Zi5mdXNlZC5jb252MmQoe1xuICAgICAgICAgeCxcbiAgICAgICAgIGZpbHRlcjogdyxcbiAgICAgICAgIHN0cmlkZXM6IHN0cmlkZSxcbiAgICAgICAgIHBhZCxcbiAgICAgICAgIGRhdGFGb3JtYXQ6ICdOSFdDJyxcbiAgICAgICAgIGRpbGF0aW9uczogWzEsIDFdLFxuICAgICAgICAgYWN0aXZhdGlvbjogJ3JlbHU2JyxcbiAgICAgICAgIGJpYXNcbiAgICAgICB9KTtcbiAgICAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFsxLCA0LCA0LCA4XSk7XG4gICAgICAgY29uc3QgcmVzdWx0RGF0YSA9IGF3YWl0IHJlc3VsdC5kYXRhKCk7XG4gICAgICAgZXhwZWN0QXJyYXlzQ2xvc2UocmVzdWx0RGF0YSwgbmV3IEZsb2F0MzJBcnJheShbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDQuNjY3Nzc3NTM4Mjk5NTYwNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAuMzE3MTc3Mjk1Njg0ODE0NDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA1LjY5Nzg2OTc3NzY3OTQ0MyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMi4yNTY5ODQ5NDkxMTE5Mzg1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDQuMjI2ODg1Nzk1NTkzMjYyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMi4wMzE5OTk1ODgwMTI2OTUzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMi45NTc1NTg2MzE4OTY5NzI3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMy4wNTI4ODAwNDg3NTE4MzEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAxLjkzNjY3OTYwMTY2OTMxMTUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNC45MTU3OTk2MTc3NjczMzQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA1LjU5Nzk0Mzc4MjgwNjM5NjUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLjQwNzg4NzU3ODAxMDU1OTEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA0LjU4NjI4MDgyMjc1MzkwNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMy40MzEyMTYwMDE1MTA2MixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA1LjQwMTc3NjMxMzc4MTczOCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMi42MDI5NzYwODM3NTU0OTMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgNlxuICAgICAgICAgICAgICAgICAgICAgICAgIF0pKTtcbiAgICAgfSk7XG5cbiAgaXQoJ2xlYWt5cmVsdSBiaWFzIHN0cmlkZSAyIHg9WzEsOCw4LDE2XSBmPVszLDMsMTYsMV0gcz1bMiwyXSBkPTggcD1zYW1lJyxcbiAgICAgYXN5bmMgKCkgPT4ge1xuICAgICAgIGNvbnN0IGlucHV0RGVwdGggPSAxNjtcbiAgICAgICBjb25zdCB4U2l6ZSA9IDg7XG4gICAgICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPVxuICAgICAgICAgICBbMSwgeFNpemUsIHhTaXplLCBpbnB1dERlcHRoXTtcbiAgICAgICBjb25zdCBvdXRwdXREZXB0aCA9IDg7XG4gICAgICAgY29uc3QgZlNpemUgPSAzO1xuICAgICAgIGNvbnN0IHBhZCA9ICdzYW1lJztcbiAgICAgICBjb25zdCBzdHJpZGU6IFtudW1iZXIsIG51bWJlcl0gPSBbMiwgMl07XG5cbiAgICAgICBjb25zdCBpbnB1dHMgPSBnZW5lcmF0ZUNhc2VJbnB1dHMoXG4gICAgICAgICAgIDEgKiB4U2l6ZSAqIHhTaXplICogaW5wdXREZXB0aCxcbiAgICAgICAgICAgZlNpemUgKiBmU2l6ZSAqIGlucHV0RGVwdGggKiBvdXRwdXREZXB0aCk7XG4gICAgICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKGlucHV0cy5pbnB1dCwgaW5wdXRTaGFwZSk7XG4gICAgICAgY29uc3QgdyA9XG4gICAgICAgICAgIHRmLnRlbnNvcjRkKGlucHV0cy5maWx0ZXIsIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG4gICAgICAgY29uc3QgYmlhcyA9IHRmLnRlbnNvcjFkKFsxLCA0LCAyLCAzLCA5LCA2LCA1LCA4XSk7XG4gICAgICAgY29uc3QgbGVha3lyZWx1QWxwaGEgPSAwLjM7XG5cbiAgICAgICBjb25zdCByZXN1bHQgPSB0Zi5mdXNlZC5jb252MmQoe1xuICAgICAgICAgeCxcbiAgICAgICAgIGZpbHRlcjogdyxcbiAgICAgICAgIHN0cmlkZXM6IHN0cmlkZSxcbiAgICAgICAgIHBhZCxcbiAgICAgICAgIGRhdGFGb3JtYXQ6ICdOSFdDJyxcbiAgICAgICAgIGRpbGF0aW9uczogWzEsIDFdLFxuICAgICAgICAgYWN0aXZhdGlvbjogJ2xlYWt5cmVsdScsXG4gICAgICAgICBsZWFreXJlbHVBbHBoYSxcbiAgICAgICAgIGJpYXNcbiAgICAgICB9KTtcbiAgICAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFsxLCA0LCA0LCA4XSk7XG4gICAgICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgICAgIGF3YWl0IHJlc3VsdC5kYXRhKCksIG5ldyBGbG9hdDMyQXJyYXkoW1xuICAgICAgICAgICAgIDI1Ljc1Mzk4MDYzNjU5NjY4LCAgICAtNi4yNDE3Njg4MzY5NzUwOTgsICAgMjYuODU3ODA1MjUyMDc1MTk1LFxuICAgICAgICAgICAgIC02LjU3MjkxNDYwMDM3MjMxNDUsICAzMy45NjE2MzE3NzQ5MDIzNDQsICAgLTUuNzA0MDYzODkyMzY0NTAyLFxuICAgICAgICAgICAgIDMwLjA2NTQ1ODI5NzcyOTQ5MiwgICAtNS4xMzUyMTAwMzcyMzE0NDUsICAgMjMuMTE4MjA2MDI0MTY5OTIyLFxuICAgICAgICAgICAgIC01LjQ0OTY1MzE0ODY1MTEyMywgICAyNC4yMTI4MjAwNTMxMDA1ODYsICAgLTUuNzc4MDM2MTE3NTUzNzExLFxuICAgICAgICAgICAgIDMxLjMwNzQyMjYzNzkzOTQ1MywgICAtNC45MDY0MTgzMjM1MTY4NDYsICAgMjcuNDAyMDM0NzU5NTIxNDg0LFxuICAgICAgICAgICAgIC00LjMzNDgwMjYyNzU2MzQ3NywgICAyMC40ODI0MzE0MTE3NDMxNjQsICAgLTQuNjU3NTM5MzY3Njc1NzgxLFxuICAgICAgICAgICAgIDIxLjU2NzgyMTUwMjY4NTU0NywgICAtNC45ODMxNTcxNTc4OTc5NDksICAgMjguNjUzMjE3MzE1NjczODI4LFxuICAgICAgICAgICAgIC00LjEwODc3MjI3NzgzMjAzMSwgICAyNC43Mzg2MTMxMjg2NjIxMSwgICAgLTMuNTM0MzkwNjg3OTQyNTA1LFxuICAgICAgICAgICAgIDExLjA3ODA4MDE3NzMwNzEyOSwgICAtMS44MzEyNzE4ODY4MjU1NjE1LCAgMTIuMTMwMzk5NzAzOTc5NDkyLFxuICAgICAgICAgICAgIC0yLjE0Njk2NzQxMTA0MTI1OTgsICAxOS4xODI3MjAxODQzMjYxNzIsICAgLTEuMjYyNjY1MDMzMzQwNDU0LFxuICAgICAgICAgICAgIDE1LjIzNTAzNzgwMzY0OTkwMiwgICAtMC42NzgzNjAyODMzNzQ3ODY0LCAgNC42Njc3Nzc1MzgyOTk1NjA1LFxuICAgICAgICAgICAgIDAuMzE3MTc3Mjk1Njg0ODE0NDUsICA1LjY5Nzg2OTc3NzY3OTQ0MywgICAgLTAuMjEzODc1NzEwOTY0MjAyODgsXG4gICAgICAgICAgICAgMTIuNzI3OTY4MjE1OTQyMzgzLCAgIDIuMjU2OTg0OTQ5MTExOTM4NSwgICA4Ljc1ODA2NjE3NzM2ODE2NCxcbiAgICAgICAgICAgICA0LjIyNjg4NTc5NTU5MzI2MiwgICAgMi4wMzE5OTk1ODgwMTI2OTUzLCAgIDIuOTU3NTU4NjMxODk2OTcyNyxcbiAgICAgICAgICAgICAzLjA1Mjg4MDA0ODc1MTgzMSwgICAgMS45MzY2Nzk2MDE2NjkzMTE1LCAgIDEwLjA3Mzc2MDAzMjY1MzgwOSxcbiAgICAgICAgICAgICA0LjkxNTc5OTYxNzc2NzMzNCwgICAgNi4wOTQ2Mzk3NzgxMzcyMDcsICAgIDYuODk0OTIxMzAyNzk1NDEsXG4gICAgICAgICAgICAgLTAuMTgxMTMyOTEyNjM1ODAzMjIsIDUuNTk3OTQzNzgyODA2Mzk2NSwgICAwLjQwNzg4NzU3ODAxMDU1OTEsXG4gICAgICAgICAgICAgNC41ODYyODA4MjI3NTM5MDYsICAgIDcuNDE5NTUxODQ5MzY1MjM0LCAgICA3LjU3NDYxNjkwOTAyNzEsXG4gICAgICAgICAgICAgMy40MzEyMTYwMDE1MTA2MiwgICAgIDkuNTYyOTUyMDQxNjI1OTc3LCAgICAtMC40MjE5NTg0MTY3MDAzNjMxNixcbiAgICAgICAgICAgICA2LjQwNDk0Mzk0MzAyMzY4MiwgICAgLTAuMTIxMDA4MDQ1OTcxMzkzNTksIDUuNDAxNzc2MzEzNzgxNzM4LFxuICAgICAgICAgICAgIDYuNTk5ODA3NzM5MjU3ODEyNSwgICA4LjM5ODYwODIwNzcwMjYzNywgICAgMi42MDI5NzYwODM3NTU0OTMsXG4gICAgICAgICAgICAgMTAuMzk1NDQwMTAxNjIzNTM1LCAgIC00LjkyNTUzMDQzMzY1NDc4NSwgICAyMS40NDAyNTAzOTY3Mjg1MTYsXG4gICAgICAgICAgICAgLTQuNjM4NjE4OTQ2MDc1NDM5NSwgIDIwLjQ4Mzg4MjkwNDA1MjczNCwgICAtMi41NTE3MDkxNzUxMDk4NjMzLFxuICAgICAgICAgICAgIDIzLjUyNzUwOTY4OTMzMTA1NSwgICAtMy43NjQ3OTkxMTgwNDE5OTIsICAgMjUuNTcxMTQ0MTA0MDAzOTA2LFxuICAgICAgICAgICAgIC01LjcxNjI2MjgxNzM4MjgxMjUsICAyNC4wODA2MjkzNDg3NTQ4ODMsICAgLTUuNDMyMTE2NTA4NDgzODg3LFxuICAgICAgICAgICAgIDIzLjEzMzQ4MDA3MjAyMTQ4NCwgICAtMy4zNDc5NzA5NjI1MjQ0MTQsICAgMjYuMTg2MzI4ODg3OTM5NDUzLFxuICAgICAgICAgICAgIC00LjU2MzgyNTEzMDQ2MjY0NjUsICAyOC4yMzkxNzc3MDM4NTc0MjIsICAgLTYuNTA2OTk2NjMxNjIyMzE0NSxcbiAgICAgICAgICAgICAyNi43MjEwMTIxMTU0Nzg1MTYsICAgLTYuMjI1NjE1NTAxNDAzODA5LCAgIDI1Ljc4MzA3OTE0NzMzODg2NyxcbiAgICAgICAgICAgICAtNC4xNDQyMzM3MDM2MTMyODEsICAgMjguODQ1MTQ4MDg2NTQ3ODUsICAgIC01LjM2Mjg1NDAwMzkwNjI1LFxuICAgICAgICAgICAgIDMwLjkwNzIwOTM5NjM2MjMwNSwgICAtNC4xNjczNDAyNzg2MjU0ODgsICAgMTguOTE0MTI3MzQ5ODUzNTE2LFxuICAgICAgICAgICAgIC0zLjg4MTEzNTk0MDU1MTc1OCwgICAxNy45NjAxMTE2MTgwNDE5OTIsICAgLTEuNzk0OTMwMzM4ODU5NTU4LFxuICAgICAgICAgICAgIDIxLjAwNjA5Mzk3ODg4MTgzNiwgICAtMy4wMDg3MjY1OTY4MzIyNzU0LCAgMjMuMDUyMDgyMDYxNzY3NTc4LFxuICAgICAgICAgICAgIC0zLjg1NzM3NjA5ODYzMjgxMjUsICAxNy44OTA4OTU4NDM1MDU4NiwgICAgLTMuNTc3MTYxMDczNjg0NjkyNCxcbiAgICAgICAgICAgICAxNi45NTY4NDgxNDQ1MzEyNSwgICAgLTEuNDk2OTQ3MDUwMDk0NjA0NSwgIDIwLjAyMjc5ODUzODIwODAwOCxcbiAgICAgICAgICAgICAtMi43MTY3MzI1MDE5ODM2NDI2LCAgMjIuMDg4NzU0NjUzOTMwNjY0LCAgIC00LjIwNzU4NDg1Nzk0MDY3NCxcbiAgICAgICAgICAgICAxOS4wNjEzMjY5ODA1OTA4MiwgICAgLTMuOTI5MjEyNTcwMTkwNDI5NywgIDE4LjEzMzQyNDc1ODkxMTEzMyxcbiAgICAgICAgICAgICAtMS44NTA4NDEwNDUzNzk2Mzg3LCAgMjEuMjA1NTIwNjI5ODgyODEyLCAgIC0zLjA3MjQ3MDQyNjU1OTQ0ODIsXG4gICAgICAgICAgICAgMjMuMjc3NjE0NTkzNTA1ODYsICAgIC00LjU1Nzc5MTcwOTg5OTkwMiwgICAyMC4yMzE3NTgxMTc2NzU3OCxcbiAgICAgICAgICAgICAtNC4yODEyNjMzNTE0NDA0MywgICAgMTkuMzA5OTk5NDY1OTQyMzgzLCAgIC0yLjIwNDczNjQ3MTE3NjE0NzUsXG4gICAgICAgICAgICAgMjIuMzg4MjQwODE0MjA4OTg0LCAgIC0zLjQyODIwODM1MTEzNTI1NCwgICAyNC40NjY0NzgzNDc3NzgzMixcbiAgICAgICAgICAgICAtMi41NjcwMjExMzE1MTU1MDMsICAgMTMuNTg0MzUyNDkzMjg2MTMzLCAgIC0yLjI4MzU5MDMxNjc3MjQ2MSxcbiAgICAgICAgICAgICAxMi42Mzk1ODQ1NDEzMjA4LCAgICAgLTAuMjAwMTYwMDQxNDUxNDU0MTYsIDE1LjY5NDgxNTYzNTY4MTE1MixcbiAgICAgICAgICAgICAtMS40MTY3Mjk0NTAyMjU4MywgICAgMTcuNzUwMDQ1Nzc2MzY3MTg4XG4gICAgICAgICAgIF0pKTtcbiAgICAgfSk7XG5cbiAgaXQoJ3Rocm93cyB3aGVuIGRpbVJvdW5kaW5nTW9kZSBpcyBzZXQgYW5kIHBhZCBpcyBzYW1lJywgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0RGVwdGggPSAxNjtcbiAgICBjb25zdCB4U2l6ZSA9IDg7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPVxuICAgICAgICBbMSwgeFNpemUsIHhTaXplLCBpbnB1dERlcHRoXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDg7XG4gICAgY29uc3QgZlNpemUgPSAzO1xuICAgIGNvbnN0IHBhZCA9ICdzYW1lJztcbiAgICBjb25zdCBzdHJpZGU6IFtudW1iZXIsIG51bWJlcl0gPSBbMiwgMl07XG5cbiAgICBjb25zdCBpbnB1dHMgPSBnZW5lcmF0ZUNhc2VJbnB1dHMoXG4gICAgICAgIDEgKiB4U2l6ZSAqIHhTaXplICogaW5wdXREZXB0aCxcbiAgICAgICAgZlNpemUgKiBmU2l6ZSAqIGlucHV0RGVwdGggKiBvdXRwdXREZXB0aCk7XG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKGlucHV0cy5pbnB1dCwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9XG4gICAgICAgIHRmLnRlbnNvcjRkKGlucHV0cy5maWx0ZXIsIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG4gICAgY29uc3QgYmlhcyA9IHRmLnRlbnNvcjFkKFsxLCA0LCAyLCAzLCA5LCA2LCA1LCA4XSk7XG4gICAgY29uc3QgbGVha3lyZWx1QWxwaGEgPSAwLjM7XG5cbiAgICBleHBlY3QoKCkgPT4gdGYuZnVzZWQuY29udjJkKHtcbiAgICAgIHgsXG4gICAgICBmaWx0ZXI6IHcsXG4gICAgICBzdHJpZGVzOiBzdHJpZGUsXG4gICAgICBwYWQsXG4gICAgICBkYXRhRm9ybWF0OiAnTkhXQycsXG4gICAgICBkaWxhdGlvbnM6IFsxLCAxXSxcbiAgICAgIGFjdGl2YXRpb246ICdsZWFreXJlbHUnLFxuICAgICAgbGVha3lyZWx1QWxwaGEsXG4gICAgICBiaWFzLFxuICAgICAgZGltUm91bmRpbmdNb2RlOiAncm91bmQnXG4gICAgfSkpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndGhyb3dzIHdoZW4gZGltUm91bmRpbmdNb2RlIGlzIHNldCBhbmQgcGFkIGlzIHZhbGlkJywgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0RGVwdGggPSAxNjtcbiAgICBjb25zdCB4U2l6ZSA9IDg7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPVxuICAgICAgICBbMSwgeFNpemUsIHhTaXplLCBpbnB1dERlcHRoXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDg7XG4gICAgY29uc3QgZlNpemUgPSAzO1xuICAgIGNvbnN0IHBhZCA9ICd2YWxpZCc7XG4gICAgY29uc3Qgc3RyaWRlOiBbbnVtYmVyLCBudW1iZXJdID0gWzIsIDJdO1xuXG4gICAgY29uc3QgaW5wdXRzID0gZ2VuZXJhdGVDYXNlSW5wdXRzKFxuICAgICAgICAxICogeFNpemUgKiB4U2l6ZSAqIGlucHV0RGVwdGgsXG4gICAgICAgIGZTaXplICogZlNpemUgKiBpbnB1dERlcHRoICogb3V0cHV0RGVwdGgpO1xuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChpbnB1dHMuaW5wdXQsIGlucHV0U2hhcGUpO1xuICAgIGNvbnN0IHcgPVxuICAgICAgICB0Zi50ZW5zb3I0ZChpbnB1dHMuZmlsdGVyLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuICAgIGNvbnN0IGJpYXMgPSB0Zi50ZW5zb3IxZChbMSwgNCwgMiwgMywgOSwgNiwgNSwgOF0pO1xuICAgIGNvbnN0IGxlYWt5cmVsdUFscGhhID0gMC4zO1xuXG4gICAgZXhwZWN0KCgpID0+IHRmLmZ1c2VkLmNvbnYyZCh7XG4gICAgICB4LFxuICAgICAgZmlsdGVyOiB3LFxuICAgICAgc3RyaWRlczogc3RyaWRlLFxuICAgICAgcGFkLFxuICAgICAgZGF0YUZvcm1hdDogJ05IV0MnLFxuICAgICAgZGlsYXRpb25zOiBbMSwgMV0sXG4gICAgICBhY3RpdmF0aW9uOiAnbGVha3lyZWx1JyxcbiAgICAgIGxlYWt5cmVsdUFscGhhLFxuICAgICAgYmlhcyxcbiAgICAgIGRpbVJvdW5kaW5nTW9kZTogJ3JvdW5kJ1xuICAgIH0pKS50b1Rocm93RXJyb3IoKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyB3aGVuIGRpbVJvdW5kaW5nTW9kZSBpcyBzZXQgYW5kIHBhZCBpcyBhIG5vbi1pbnRlZ2VyIG51bWJlcicsXG4gICAgICgpID0+IHtcbiAgICAgICBjb25zdCBpbnB1dERlcHRoID0gMTY7XG4gICAgICAgY29uc3QgeFNpemUgPSA4O1xuICAgICAgIGNvbnN0IGlucHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID1cbiAgICAgICAgICAgWzEsIHhTaXplLCB4U2l6ZSwgaW5wdXREZXB0aF07XG4gICAgICAgY29uc3Qgb3V0cHV0RGVwdGggPSA4O1xuICAgICAgIGNvbnN0IGZTaXplID0gMztcbiAgICAgICBjb25zdCBwYWQgPSAxLjI7XG4gICAgICAgY29uc3Qgc3RyaWRlOiBbbnVtYmVyLCBudW1iZXJdID0gWzIsIDJdO1xuXG4gICAgICAgY29uc3QgaW5wdXRzID0gZ2VuZXJhdGVDYXNlSW5wdXRzKFxuICAgICAgICAgICAxICogeFNpemUgKiB4U2l6ZSAqIGlucHV0RGVwdGgsXG4gICAgICAgICAgIGZTaXplICogZlNpemUgKiBpbnB1dERlcHRoICogb3V0cHV0RGVwdGgpO1xuICAgICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChpbnB1dHMuaW5wdXQsIGlucHV0U2hhcGUpO1xuICAgICAgIGNvbnN0IHcgPVxuICAgICAgICAgICB0Zi50ZW5zb3I0ZChpbnB1dHMuZmlsdGVyLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuICAgICAgIGNvbnN0IGJpYXMgPSB0Zi50ZW5zb3IxZChbMSwgNCwgMiwgMywgOSwgNiwgNSwgOF0pO1xuICAgICAgIGNvbnN0IGxlYWt5cmVsdUFscGhhID0gMC4zO1xuXG4gICAgICAgZXhwZWN0KCgpID0+IHRmLmZ1c2VkLmNvbnYyZCh7XG4gICAgICAgICB4LFxuICAgICAgICAgZmlsdGVyOiB3LFxuICAgICAgICAgc3RyaWRlczogc3RyaWRlLFxuICAgICAgICAgcGFkLFxuICAgICAgICAgZGF0YUZvcm1hdDogJ05IV0MnLFxuICAgICAgICAgZGlsYXRpb25zOiBbMSwgMV0sXG4gICAgICAgICBhY3RpdmF0aW9uOiAnbGVha3lyZWx1JyxcbiAgICAgICAgIGxlYWt5cmVsdUFscGhhLFxuICAgICAgICAgYmlhcyxcbiAgICAgICAgIGRpbVJvdW5kaW5nTW9kZTogJ3JvdW5kJ1xuICAgICAgIH0pKS50b1Rocm93RXJyb3IoKTtcbiAgICAgfSk7XG5cbiAgaXQoJ3Rocm93cyB3aGVuIGRpbVJvdW5kaW5nTW9kZSBpcyBzZXQgYW5kIHBhZCBpcyBleHBsaWNpdCBieSBub24taW50ZWdlciAnICtcbiAgICAgICAgICdudW1iZXInLFxuICAgICAoKSA9PiB7XG4gICAgICAgY29uc3QgaW5wdXREZXB0aCA9IDE2O1xuICAgICAgIGNvbnN0IHhTaXplID0gODtcbiAgICAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9XG4gICAgICAgICAgIFsxLCB4U2l6ZSwgeFNpemUsIGlucHV0RGVwdGhdO1xuICAgICAgIGNvbnN0IG91dHB1dERlcHRoID0gODtcbiAgICAgICBjb25zdCBmU2l6ZSA9IDM7XG4gICAgICAgY29uc3QgcGFkID0gW1swLCAwXSwgWzAsIDIuMV0sIFsxLCAxXSwgWzAsIDBdXSBhc1xuICAgICAgICAgICB0Zi5iYWNrZW5kX3V0aWwuRXhwbGljaXRQYWRkaW5nO1xuICAgICAgIGNvbnN0IHN0cmlkZTogW251bWJlciwgbnVtYmVyXSA9IFsyLCAyXTtcblxuICAgICAgIGNvbnN0IGlucHV0cyA9IGdlbmVyYXRlQ2FzZUlucHV0cyhcbiAgICAgICAgICAgMSAqIHhTaXplICogeFNpemUgKiBpbnB1dERlcHRoLFxuICAgICAgICAgICBmU2l6ZSAqIGZTaXplICogaW5wdXREZXB0aCAqIG91dHB1dERlcHRoKTtcbiAgICAgICBjb25zdCB4ID0gdGYudGVuc29yNGQoaW5wdXRzLmlucHV0LCBpbnB1dFNoYXBlKTtcbiAgICAgICBjb25zdCB3ID1cbiAgICAgICAgICAgdGYudGVuc29yNGQoaW5wdXRzLmZpbHRlciwgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcbiAgICAgICBjb25zdCBiaWFzID0gdGYudGVuc29yMWQoWzEsIDQsIDIsIDMsIDksIDYsIDUsIDhdKTtcbiAgICAgICBjb25zdCBsZWFreXJlbHVBbHBoYSA9IDAuMztcblxuICAgICAgIGV4cGVjdCgoKSA9PiB0Zi5mdXNlZC5jb252MmQoe1xuICAgICAgICAgeCxcbiAgICAgICAgIGZpbHRlcjogdyxcbiAgICAgICAgIHN0cmlkZXM6IHN0cmlkZSxcbiAgICAgICAgIHBhZCxcbiAgICAgICAgIGRhdGFGb3JtYXQ6ICdOSFdDJyxcbiAgICAgICAgIGRpbGF0aW9uczogWzEsIDFdLFxuICAgICAgICAgYWN0aXZhdGlvbjogJ2xlYWt5cmVsdScsXG4gICAgICAgICBsZWFreXJlbHVBbHBoYSxcbiAgICAgICAgIGJpYXMsXG4gICAgICAgICBkaW1Sb3VuZGluZ01vZGU6ICdyb3VuZCdcbiAgICAgICB9KSkudG9UaHJvd0Vycm9yKCk7XG4gICAgIH0pO1xuXG4gIGl0KCdiYXNpYyB3aXRoIGJpYXMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDI7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMiwgMiwgMiwgaW5wdXREZXB0aF07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGZTaXplID0gMTtcbiAgICBjb25zdCBwYWQgPSAwO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yNGQoXG4gICAgICAgIFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE1LCAxNl0sIGluU2hhcGUpO1xuICAgIGNvbnN0IHcgPVxuICAgICAgICB0Zi50ZW5zb3I0ZChbLTEsIDEsIC0yLCAwLjVdLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuZnVzZWQuY29udjJkKHtcbiAgICAgIHgsXG4gICAgICBmaWx0ZXI6IHcsXG4gICAgICBzdHJpZGVzOiBzdHJpZGUsXG4gICAgICBwYWQsXG4gICAgICBkYXRhRm9ybWF0OiAnTkhXQycsXG4gICAgICBkaWxhdGlvbnM6IFsxLCAxXSxcbiAgICAgIGJpYXM6IHRmLnRlbnNvcjFkKFs1LCA2XSlcbiAgICB9KTtcbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFsyLCAyLCAyLCAyXSk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPVxuICAgICAgICBbMCwgOCwgLTYsIDExLCAtMTIsIDE0LCAtMTgsIDE3LCAtMjQsIDIwLCAtMzAsIDIzLCAtMzYsIDI2LCAtNDIsIDI5XTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2Jhc2ljIHdpdGggZXhwbGljaXQgcGFkZGluZycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDE7XG4gICAgY29uc3QgcGFkID1cbiAgICAgICAgW1swLCAwXSwgWzEsIDJdLCBbMCwgMV0sIFswLCAwXV0gYXMgdGYuYmFja2VuZF91dGlsLkV4cGxpY2l0UGFkZGluZztcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRhdGFGb3JtYXQgPSAnTkhXQyc7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjNkKFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4XSwgWzQsIDIsIGlucHV0RGVwdGhdKTtcbiAgICBjb25zdCB3ID1cbiAgICAgICAgdGYudGVuc29yNGQoWzMsIDEsIDUsIDAsIDIsIDcsIDgsIDldLCBbNCwgMiwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmZ1c2VkLmNvbnYyZChcbiAgICAgICAge3gsIGZpbHRlcjogdywgc3RyaWRlczogc3RyaWRlLCBwYWQsIGRhdGFGb3JtYXQsIGRpbGF0aW9uczogZGlsYXRpb259KTtcblxuICAgIGNvbnN0IHJlc3VsdERhdGEgPSBhd2FpdCByZXN1bHQuZGF0YSgpO1xuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzQsIDIsIDFdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShyZXN1bHREYXRhLCBbMTMzLCA2NiwgMjAwLCAxMDIsIDEwOCwgNTgsIDU2LCA1OF0pO1xuICB9KTtcblxuICBpdCgnYmFzaWMgd2l0aCBlbHUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDI7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMiwgMiwgMiwgaW5wdXREZXB0aF07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGZTaXplID0gMTtcbiAgICBjb25zdCBwYWQgPSAwO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yNGQoXG4gICAgICAgIFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE1LCAxNl0sIGluU2hhcGUpO1xuICAgIGNvbnN0IHcgPVxuICAgICAgICB0Zi50ZW5zb3I0ZChbLTEsIDEsIC0yLCAwLjVdLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuZnVzZWQuY29udjJkKHtcbiAgICAgIHgsXG4gICAgICBmaWx0ZXI6IHcsXG4gICAgICBzdHJpZGVzOiBzdHJpZGUsXG4gICAgICBwYWQsXG4gICAgICBkYXRhRm9ybWF0OiAnTkhXQycsXG4gICAgICBkaWxhdGlvbnM6IFsxLCAxXSxcbiAgICAgIGFjdGl2YXRpb246ICdlbHUnXG4gICAgfSk7XG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMiwgMiwgMiwgMl0pO1xuICAgIGNvbnN0IGV4cGVjdGVkID1cbiAgICAgICAgWy0wLjk5MzI2LCAyLCAtMSwgNSwgLTEsIDgsIC0xLCAxMSwgLTEsIDE0LCAtMSwgMTcsIC0xLCAyMCwgLTEsIDIzXTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2Jhc2ljIHdpdGggcHJlbHUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDI7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMiwgMiwgMiwgaW5wdXREZXB0aF07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGZTaXplID0gMTtcbiAgICBjb25zdCBwYWQgPSAwO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yNGQoXG4gICAgICAgIFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE1LCAxNl0sIGluU2hhcGUpO1xuICAgIGNvbnN0IGFscGhhID0gdGYudGVuc29yM2QoWzAuMjUsIDAuNzVdLCBbMSwgMSwgMl0pO1xuICAgIGNvbnN0IHcgPVxuICAgICAgICB0Zi50ZW5zb3I0ZChbLTEsIDEsIC0yLCAwLjVdLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuZnVzZWQuY29udjJkKHtcbiAgICAgIHgsXG4gICAgICBmaWx0ZXI6IHcsXG4gICAgICBzdHJpZGVzOiBzdHJpZGUsXG4gICAgICBwYWQsXG4gICAgICBkYXRhRm9ybWF0OiAnTkhXQycsXG4gICAgICBkaWxhdGlvbnM6IFsxLCAxXSxcbiAgICAgIGFjdGl2YXRpb246ICdwcmVsdScsXG4gICAgICBwcmVsdUFjdGl2YXRpb25XZWlnaHRzOiBhbHBoYVxuICAgIH0pO1xuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzIsIDIsIDIsIDJdKTtcbiAgICBjb25zdCBleHBlY3RlZCA9IFtcbiAgICAgIC0xLjI1LCAyLCAtMi43NSwgNSwgLTQuMjUsIDgsIC01Ljc1LCAxMSwgLTcuMjUsIDE0LCAtOC43NSwgMTcsIC0xMC4yNSwgMjAsXG4gICAgICAtMTEuNzUsIDIzXG4gICAgXTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2Jhc2ljIHdpdGggbGVha3lyZWx1JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzIsIDIsIDIsIGlucHV0RGVwdGhdO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gMjtcbiAgICBjb25zdCBmU2l6ZSA9IDE7XG4gICAgY29uc3QgcGFkID0gMDtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSwgMTZdLCBpblNoYXBlKTtcbiAgICBjb25zdCBhbHBoYSA9IDAuMztcbiAgICBjb25zdCB3ID1cbiAgICAgICAgdGYudGVuc29yNGQoWy0xLCAxLCAtMiwgMC41XSwgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmZ1c2VkLmNvbnYyZCh7XG4gICAgICB4LFxuICAgICAgZmlsdGVyOiB3LFxuICAgICAgc3RyaWRlczogc3RyaWRlLFxuICAgICAgcGFkLFxuICAgICAgZGF0YUZvcm1hdDogJ05IV0MnLFxuICAgICAgZGlsYXRpb25zOiBbMSwgMV0sXG4gICAgICBhY3RpdmF0aW9uOiAnbGVha3lyZWx1JyxcbiAgICAgIGxlYWt5cmVsdUFscGhhOiBhbHBoYVxuICAgIH0pO1xuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzIsIDIsIDIsIDJdKTtcbiAgICBjb25zdCBleHBlY3RlZCA9IFtcbiAgICAgIC0xLjUsIDIsIC0zLjMwMDAwMDE5MDczNDg2MzMsIDUsIC01LjEwMDAwMDM4MTQ2OTcyNywgOCxcbiAgICAgIC02LjkwMDAwMDA5NTM2NzQzMiwgMTEsIC04LjcwMDAwMDc2MjkzOTQ1MywgMTQsIC0xMC41LCAxNyxcbiAgICAgIC0xMi4zMDAwMDAxOTA3MzQ4NjMsIDIwLCAtMTQuMTAwMDAwMzgxNDY5NzI3LCAyM1xuICAgIF07XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCdiYXNpYyB3aXRoIHNpZ21vaWQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDI7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMiwgMiwgMiwgaW5wdXREZXB0aF07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGZTaXplID0gMTtcbiAgICBjb25zdCBwYWQgPSAwO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yNGQoXG4gICAgICAgIFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE1LCAxNl0sIGluU2hhcGUpO1xuICAgIGNvbnN0IGFscGhhID0gMC4zO1xuICAgIGNvbnN0IHcgPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWy0wLjEsIDAuMSwgLTAuMiwgMC4wNV0sIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSB0Zi5mdXNlZC5jb252MmQoe1xuICAgICAgeCxcbiAgICAgIGZpbHRlcjogdyxcbiAgICAgIHN0cmlkZXM6IHN0cmlkZSxcbiAgICAgIHBhZCxcbiAgICAgIGRhdGFGb3JtYXQ6ICdOSFdDJyxcbiAgICAgIGRpbGF0aW9uczogWzEsIDFdLFxuICAgICAgYWN0aXZhdGlvbjogJ3NpZ21vaWQnLFxuICAgICAgbGVha3lyZWx1QWxwaGE6IGFscGhhXG4gICAgfSk7XG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMiwgMiwgMiwgMl0pO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gW1xuICAgICAgMC4zNzc1NDA3LCAwLjU0OTgzNCwgMC4yNDk3Mzk4OSwgMC42MjI0NTkzLCAwLjE1NDQ2NTI2LCAwLjY4OTk3NDQsXG4gICAgICAwLjA5MTEyMjk2LCAwLjc1MDI2MDEsIDAuMDUyMTUzNSwgMC44MDIxODM4NywgMC4wMjkzMTIxOSwgMC44NDU1MzQ3NCxcbiAgICAgIDAuMDE2MzAyNSwgMC44ODA3OTcxLCAwLjAwOTAxMzMsIDAuOTA4ODc3XG4gICAgXTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2Jhc2ljIHdpdGggYnJvYWRjYXN0ZWQgYmlhcyBhbmQgcmVsdScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMjtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsyLCAyLCAyLCBpbnB1dERlcHRoXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDI7XG4gICAgY29uc3QgZlNpemUgPSAxO1xuICAgIGNvbnN0IHBhZCA9IDA7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTUsIDE2XSwgaW5TaGFwZSk7XG4gICAgY29uc3QgdyA9XG4gICAgICAgIHRmLnRlbnNvcjRkKFstMSwgMSwgLTIsIDAuNV0sIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSB0Zi5mdXNlZC5jb252MmQoe1xuICAgICAgeCxcbiAgICAgIGZpbHRlcjogdyxcbiAgICAgIHN0cmlkZXM6IHN0cmlkZSxcbiAgICAgIHBhZCxcbiAgICAgIGRhdGFGb3JtYXQ6ICdOSFdDJyxcbiAgICAgIGRpbGF0aW9uczogWzEsIDFdLFxuICAgICAgYmlhczogdGYuc2NhbGFyKDUpLFxuICAgICAgYWN0aXZhdGlvbjogJ3JlbHUnXG4gICAgfSk7XG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMiwgMiwgMiwgMl0pO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gWzAsIDcsIDAsIDEwLCAwLCAxMywgMCwgMTYsIDAsIDE5LCAwLCAyMiwgMCwgMjUsIDAsIDI4XTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2Jhc2ljIGluIE5DSFcnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDI7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMSwgaW5wdXREZXB0aCwgMiwgMl07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGZTaXplID0gMTtcbiAgICBjb25zdCBwYWQgPSAwO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yNGQoWzEsIDMsIDUsIDcsIDIsIDQsIDYsIDhdLCBpblNoYXBlKTtcbiAgICBjb25zdCB3ID1cbiAgICAgICAgdGYudGVuc29yNGQoWy0xLCAxLCAtMiwgMC41XSwgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmZ1c2VkLmNvbnYyZChcbiAgICAgICAge3gsIGZpbHRlcjogdywgc3RyaWRlczogc3RyaWRlLCBwYWQsIGRhdGFGb3JtYXQ6ICdOQ0hXJ30pO1xuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzEsIDIsIDIsIDJdKTtcbiAgICBjb25zdCBleHBlY3RlZCA9IFstNSwgLTExLCAtMTcsIC0yMywgMiwgNSwgOCwgMTFdO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2Jhc2ljIGluIE5DSFcgd2l0aCBzY2FsYXIgYmlhcycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gNDtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCBpbnB1dERlcHRoLCAyLCAyXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDQ7XG4gICAgY29uc3QgZlNpemUgPSAxO1xuICAgIGNvbnN0IHBhZCA9ICdzYW1lJztcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRhdGFGb3JtYXQgPSAnTkNIVyc7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbMSwgMiwgMywgNCwgMSwgMiwgMywgNCwgMSwgMiwgMywgNCwgMSwgMiwgMywgNF0sIGlucHV0U2hhcGUpO1xuICAgIGNvbnN0IHcgPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWzMsIDMsIDMsIDMsIDEsIDEsIDEsIDEsIDUsIDUsIDUsIDUsIDAsIDAsIDAsIDBdLFxuICAgICAgICBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuICAgIGNvbnN0IGJpYXMgPSB0Zi5zY2FsYXIoMSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSB0Zi5mdXNlZC5jb252MmQoe1xuICAgICAgeCxcbiAgICAgIGZpbHRlcjogdyxcbiAgICAgIHN0cmlkZXM6IHN0cmlkZSxcbiAgICAgIHBhZCxcbiAgICAgIGRhdGFGb3JtYXQsXG4gICAgICBkaWxhdGlvbnM6IGRpbGF0aW9uLFxuICAgICAgYmlhc1xuICAgIH0pO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMSwgNCwgMiwgMl0pO1xuICAgIGNvbnN0IGV4cGVjdGVkID1cbiAgICAgICAgWzEwLCAxOSwgMjgsIDM3LCAxMCwgMTksIDI4LCAzNywgMTAsIDE5LCAyOCwgMzcsIDEwLCAxOSwgMjgsIDM3XTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCdiYXNpYyBpbiBOQ0hXIHdpdGggMS1EIGJpYXMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDQ7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMSwgaW5wdXREZXB0aCwgMiwgMl07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSA0O1xuICAgIGNvbnN0IGZTaXplID0gMTtcbiAgICBjb25zdCBwYWQgPSAnc2FtZSc7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcbiAgICBjb25zdCBkYXRhRm9ybWF0ID0gJ05DSFcnO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWzEsIDIsIDMsIDQsIDEsIDIsIDMsIDQsIDEsIDIsIDMsIDQsIDEsIDIsIDMsIDRdLCBpbnB1dFNoYXBlKTtcbiAgICBjb25zdCB3ID0gdGYudGVuc29yNGQoXG4gICAgICAgIFszLCAzLCAzLCAzLCAxLCAxLCAxLCAxLCA1LCA1LCA1LCA1LCAwLCAwLCAwLCAwXSxcbiAgICAgICAgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcbiAgICBjb25zdCBiaWFzID0gdGYudGVuc29yMWQoWzEsIDIsIDEsIDJdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmZ1c2VkLmNvbnYyZCh7XG4gICAgICB4LFxuICAgICAgZmlsdGVyOiB3LFxuICAgICAgc3RyaWRlczogc3RyaWRlLFxuICAgICAgcGFkLFxuICAgICAgZGF0YUZvcm1hdCxcbiAgICAgIGRpbGF0aW9uczogZGlsYXRpb24sXG4gICAgICBiaWFzXG4gICAgfSk7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFsxLCA0LCAyLCAyXSk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPVxuICAgICAgICBbMTAsIDE5LCAyOCwgMzcsIDExLCAyMCwgMjksIDM4LCAxMCwgMTksIDI4LCAzNywgMTEsIDIwLCAyOSwgMzhdO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2Jhc2ljIGluIE5DSFcgd2l0aCBiaWFzIGFuZCBtdWx0aXBsZSBiYXRjaGVzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0RGVwdGggPSA0O1xuICAgIGNvbnN0IGlucHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzIsIGlucHV0RGVwdGgsIDIsIDJdO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gNDtcbiAgICBjb25zdCBmU2l6ZSA9IDE7XG4gICAgY29uc3QgcGFkID0gJ3NhbWUnO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGF0YUZvcm1hdCA9ICdOQ0hXJztcbiAgICBjb25zdCBkaWxhdGlvbiA9IDE7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yNGQoXG4gICAgICAgIFtcbiAgICAgICAgICAxLCAyLCAzLCA0LCAxLCAyLCAzLCA0LCAxLCAyLCAzLCA0LCAxLCAyLCAzLCA0LFxuICAgICAgICAgIDEsIDIsIDMsIDQsIDEsIDIsIDMsIDQsIDEsIDIsIDMsIDQsIDEsIDIsIDMsIDRcbiAgICAgICAgXSxcbiAgICAgICAgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbMywgMywgMywgMywgMSwgMSwgMSwgMSwgNSwgNSwgNSwgNSwgMCwgMCwgMCwgMF0sXG4gICAgICAgIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG4gICAgY29uc3QgYmlhcyA9IHRmLnRlbnNvcjFkKFsxLCAyLCAxLCAyXSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSB0Zi5mdXNlZC5jb252MmQoe1xuICAgICAgeCxcbiAgICAgIGZpbHRlcjogdyxcbiAgICAgIHN0cmlkZXM6IHN0cmlkZSxcbiAgICAgIHBhZCxcbiAgICAgIGRhdGFGb3JtYXQsXG4gICAgICBkaWxhdGlvbnM6IGRpbGF0aW9uLFxuICAgICAgYmlhc1xuICAgIH0pO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMiwgNCwgMiwgMl0pO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gW1xuICAgICAgMTAsIDE5LCAyOCwgMzcsIDExLCAyMCwgMjksIDM4LCAxMCwgMTksIDI4LCAzNywgMTEsIDIwLCAyOSwgMzgsXG4gICAgICAxMCwgMTksIDI4LCAzNywgMTEsIDIwLCAyOSwgMzgsIDEwLCAxOSwgMjgsIDM3LCAxMSwgMjAsIDI5LCAzOFxuICAgIF07XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgZXhwZWN0ZWQpO1xuICB9KTtcblxuICBpdCgnYmFzaWMgaW4gTkNIVyB3aXRoIHNjYWxhciBQUmVMVSBhY3RpYXZhdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMjtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCBpbnB1dERlcHRoLCAyLCAyXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDI7XG4gICAgY29uc3QgZlNpemUgPSAxO1xuICAgIGNvbnN0IGRhdGFGb3JtYXQgPSAnTkNIVyc7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuICAgIGNvbnN0IHBhZCA9IDA7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChbMSwgMiwgMywgNCwgNSwgNiwgNywgOF0sIGluU2hhcGUpO1xuICAgIGNvbnN0IHcgPVxuICAgICAgICB0Zi50ZW5zb3I0ZChbLTEsIDEsIC0yLCAwLjVdLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuICAgIGNvbnN0IGFscGhhID0gdGYuc2NhbGFyKDEwKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmZ1c2VkLmNvbnYyZCh7XG4gICAgICB4LFxuICAgICAgZmlsdGVyOiB3LFxuICAgICAgc3RyaWRlczogc3RyaWRlLFxuICAgICAgcGFkLFxuICAgICAgZGF0YUZvcm1hdCxcbiAgICAgIGRpbGF0aW9uczogZGlsYXRpb24sXG4gICAgICBhY3RpdmF0aW9uOiAncHJlbHUnLFxuICAgICAgcHJlbHVBY3RpdmF0aW9uV2VpZ2h0czogYWxwaGFcbiAgICB9KTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzEsIDIsIDIsIDJdKTtcbiAgICBjb25zdCBleHBlY3RlZCA9IFstMTEwLCAtMTQwLCAtMTcwLCAtMjAwLCAzLjUsIDUsIDYuNSwgOF07XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgZXhwZWN0ZWQpO1xuICB9KTtcblxuICBpdCgnYmFzaWMgaW4gTkNIVyB3aXRoIDEtRCBQUmVMVSBhY3RpYXZhdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMjtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCBpbnB1dERlcHRoLCAyLCAyXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDI7XG4gICAgY29uc3QgZlNpemUgPSAxO1xuICAgIGNvbnN0IGRhdGFGb3JtYXQgPSAnTkNIVyc7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuICAgIGNvbnN0IHBhZCA9IDA7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChbMSwgMiwgMywgNCwgNSwgNiwgNywgOF0sIGluU2hhcGUpO1xuICAgIGNvbnN0IHcgPVxuICAgICAgICB0Zi50ZW5zb3I0ZChbLTEsIDEsIC0yLCAwLjVdLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuICAgIGNvbnN0IGFscGhhID0gdGYudGVuc29yMWQoWzEwLCAxMDBdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmZ1c2VkLmNvbnYyZCh7XG4gICAgICB4LFxuICAgICAgZmlsdGVyOiB3LFxuICAgICAgc3RyaWRlczogc3RyaWRlLFxuICAgICAgcGFkLFxuICAgICAgZGF0YUZvcm1hdCxcbiAgICAgIGRpbGF0aW9uczogZGlsYXRpb24sXG4gICAgICBhY3RpdmF0aW9uOiAncHJlbHUnLFxuICAgICAgcHJlbHVBY3RpdmF0aW9uV2VpZ2h0czogYWxwaGFcbiAgICB9KTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzEsIDIsIDIsIDJdKTtcbiAgICBjb25zdCBleHBlY3RlZCA9IFstMTEwLCAtMTQwLCAtMTcwLCAtMjAwLCAzLjUsIDUsIDYuNSwgOF07XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgZXhwZWN0ZWQpO1xuICB9KTtcblxuICBpdCgnYmFzaWMgaW4gTkNIVyB3aXRoIDMtRCBQUmVMVSBhY3RpYXZhdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMjtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCBpbnB1dERlcHRoLCAyLCAyXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDI7XG4gICAgY29uc3QgZlNpemUgPSAxO1xuICAgIGNvbnN0IGRhdGFGb3JtYXQgPSAnTkNIVyc7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuICAgIGNvbnN0IHBhZCA9IDA7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChbMSwgMiwgMywgNCwgNSwgNiwgNywgOF0sIGluU2hhcGUpO1xuICAgIGNvbnN0IHcgPVxuICAgICAgICB0Zi50ZW5zb3I0ZChbLTEsIC0xLCAtMiwgLTJdLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuICAgIGNvbnN0IGFscGhhID0gdGYudGVuc29yM2QoWzEsIDEwXSwgWzIsIDEsIDFdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmZ1c2VkLmNvbnYyZCh7XG4gICAgICB4LFxuICAgICAgZmlsdGVyOiB3LFxuICAgICAgc3RyaWRlczogc3RyaWRlLFxuICAgICAgcGFkLFxuICAgICAgZGF0YUZvcm1hdCxcbiAgICAgIGRpbGF0aW9uczogZGlsYXRpb24sXG4gICAgICBhY3RpdmF0aW9uOiAncHJlbHUnLFxuICAgICAgcHJlbHVBY3RpdmF0aW9uV2VpZ2h0czogYWxwaGFcbiAgICB9KTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzEsIDIsIDIsIDJdKTtcbiAgICBjb25zdCBleHBlY3RlZCA9IFstMTEsIC0xNCwgLTE3LCAtMjAsIC0xMTAsIC0xNDAsIC0xNzAsIC0yMDBdO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2Jhc2ljIGluIE5DSFcgd2l0aCBmdWxsIDMtRCBQUmVMVSBhY3RpYXZhdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMjtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCBpbnB1dERlcHRoLCAyLCAyXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDI7XG4gICAgY29uc3QgZlNpemUgPSAxO1xuICAgIGNvbnN0IGRhdGFGb3JtYXQgPSAnTkNIVyc7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuICAgIGNvbnN0IHBhZCA9IDA7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChbMSwgMiwgMywgNCwgNSwgNiwgNywgOF0sIGluU2hhcGUpO1xuICAgIGNvbnN0IHcgPVxuICAgICAgICB0Zi50ZW5zb3I0ZChbLTEsIC0xLCAtMiwgLTJdLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuICAgIGNvbnN0IGFscGhhID0gdGYudGVuc29yM2QoWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDhdLCBbMiwgMiwgMl0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuZnVzZWQuY29udjJkKHtcbiAgICAgIHgsXG4gICAgICBmaWx0ZXI6IHcsXG4gICAgICBzdHJpZGVzOiBzdHJpZGUsXG4gICAgICBwYWQsXG4gICAgICBkYXRhRm9ybWF0LFxuICAgICAgZGlsYXRpb25zOiBkaWxhdGlvbixcbiAgICAgIGFjdGl2YXRpb246ICdwcmVsdScsXG4gICAgICBwcmVsdUFjdGl2YXRpb25XZWlnaHRzOiBhbHBoYVxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMSwgMiwgMiwgMl0pO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gWy0xMSwgLTI4LCAtNTEsIC04MCwgLTU1LCAtODQsIC0xMTksIC0xNjBdO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2ltMnJvdycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbNCwgNCwgaW5wdXREZXB0aF07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAzO1xuICAgIGNvbnN0IGZTaXplID0gMTtcbiAgICBjb25zdCBwYWQgPSAnc2FtZSc7XG4gICAgY29uc3Qgc3RyaWRlczogW251bWJlciwgbnVtYmVyXSA9IFsyLCAyXTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IzZChcbiAgICAgICAgW1xuICAgICAgICAgIDEwLCAzMCwgNTAsIDcwLCAyMCwgNDAsIDYwLCA4MCwgLTEwLCAtMzAsIC01MCwgLTcwLCAtMjAsIC00MCwgLTYwLCAtODBcbiAgICAgICAgXSxcbiAgICAgICAgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFsxLCAwLjUsIDFdLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuZnVzZWQuY29udjJkKHt4LCBmaWx0ZXI6IHcsIHN0cmlkZXMsIHBhZH0pO1xuXG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgIGF3YWl0IHJlc3VsdC5kYXRhKCksXG4gICAgICAgIFsxMCwgNSwgMTAsIDUwLCAyNSwgNTAsIC0xMCwgLTUsIC0xMCwgLTUwLCAtMjUsIC01MF0pO1xuICB9KTtcblxuICBpdCgnaW0ycm93IHdpdGggcmVsdScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbNCwgNCwgaW5wdXREZXB0aF07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAzO1xuICAgIGNvbnN0IGZTaXplID0gMTtcbiAgICBjb25zdCBwYWQgPSAnc2FtZSc7XG4gICAgY29uc3Qgc3RyaWRlczogW251bWJlciwgbnVtYmVyXSA9IFsyLCAyXTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IzZChcbiAgICAgICAgW1xuICAgICAgICAgIDEwLCAzMCwgNTAsIDcwLCAyMCwgNDAsIDYwLCA4MCwgLTEwLCAtMzAsIC01MCwgLTcwLCAtMjAsIC00MCwgLTYwLCAtODBcbiAgICAgICAgXSxcbiAgICAgICAgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFsxLCAwLjUsIDFdLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuZnVzZWQuY29udjJkKHtcbiAgICAgIHgsXG4gICAgICBmaWx0ZXI6IHcsXG4gICAgICBzdHJpZGVzLFxuICAgICAgcGFkLFxuICAgICAgZGF0YUZvcm1hdDogJ05IV0MnLFxuICAgICAgZGlsYXRpb25zOiBbMSwgMV0sXG4gICAgICBhY3RpdmF0aW9uOiAncmVsdSdcbiAgICB9KTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKFxuICAgICAgICBhd2FpdCByZXN1bHQuZGF0YSgpLCBbMTAsIDUsIDEwLCA1MCwgMjUsIDUwLCAwLCAwLCAwLCAwLCAwLCAwXSk7XG4gIH0pO1xuXG4gIGl0KCdpbTJyb3cgd2l0aCBwcmVsdScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbNCwgNCwgaW5wdXREZXB0aF07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAzO1xuICAgIGNvbnN0IGZTaXplID0gMTtcbiAgICBjb25zdCBwYWQgPSAnc2FtZSc7XG4gICAgY29uc3Qgc3RyaWRlczogW251bWJlciwgbnVtYmVyXSA9IFsyLCAyXTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IzZChcbiAgICAgICAgW1xuICAgICAgICAgIDEwLCAzMCwgNTAsIDcwLCAyMCwgNDAsIDYwLCA4MCwgLTEwLCAtMzAsIC01MCwgLTcwLCAtMjAsIC00MCwgLTYwLCAtODBcbiAgICAgICAgXSxcbiAgICAgICAgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFsxLCAwLjUsIDFdLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuICAgIGNvbnN0IGFscGhhID0gdGYudGVuc29yM2QoWzAuNV0sIFsxLCAxLCBpbnB1dERlcHRoXSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSB0Zi5mdXNlZC5jb252MmQoe1xuICAgICAgeCxcbiAgICAgIGZpbHRlcjogdyxcbiAgICAgIHN0cmlkZXMsXG4gICAgICBwYWQsXG4gICAgICBkYXRhRm9ybWF0OiAnTkhXQycsXG4gICAgICBkaWxhdGlvbnM6IFsxLCAxXSxcbiAgICAgIGFjdGl2YXRpb246ICdwcmVsdScsXG4gICAgICBwcmVsdUFjdGl2YXRpb25XZWlnaHRzOiBhbHBoYVxuICAgIH0pO1xuXG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgIGF3YWl0IHJlc3VsdC5kYXRhKCksXG4gICAgICAgIFsxMCwgNSwgMTAsIDUwLCAyNSwgNTAsIC01LCAtMi41LCAtNSwgLTI1LCAtMTIuNSwgLTI1XSk7XG4gIH0pO1xuXG4gIGl0KCdpbTJyb3cgd2l0aCBsZWFreXJlbHUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDE7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzQsIDQsIGlucHV0RGVwdGhdO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gMztcbiAgICBjb25zdCBmU2l6ZSA9IDE7XG4gICAgY29uc3QgcGFkID0gJ3NhbWUnO1xuICAgIGNvbnN0IHN0cmlkZXM6IFtudW1iZXIsIG51bWJlcl0gPSBbMiwgMl07XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yM2QoXG4gICAgICAgIFtcbiAgICAgICAgICAxMCwgMzAsIDUwLCA3MCwgMjAsIDQwLCA2MCwgODAsIC0xMCwgLTMwLCAtNTAsIC03MCwgLTIwLCAtNDAsIC02MCwgLTgwXG4gICAgICAgIF0sXG4gICAgICAgIGlucHV0U2hhcGUpO1xuICAgIGNvbnN0IHcgPSB0Zi50ZW5zb3I0ZChbMSwgMC41LCAxXSwgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcbiAgICBjb25zdCBhbHBoYSA9IDAuMztcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmZ1c2VkLmNvbnYyZCh7XG4gICAgICB4LFxuICAgICAgZmlsdGVyOiB3LFxuICAgICAgc3RyaWRlcyxcbiAgICAgIHBhZCxcbiAgICAgIGRhdGFGb3JtYXQ6ICdOSFdDJyxcbiAgICAgIGRpbGF0aW9uczogWzEsIDFdLFxuICAgICAgYWN0aXZhdGlvbjogJ2xlYWt5cmVsdScsXG4gICAgICBsZWFreXJlbHVBbHBoYTogYWxwaGFcbiAgICB9KTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIFtcbiAgICAgIDEwLCA1LCAxMCwgNTAsIDI1LCA1MCwgLTMsIC0xLjUsIC0zLCAtMTUuMDAwMDAwOTUzNjc0MzE2LFxuICAgICAgLTcuNTAwMDAwNDc2ODM3MTU4LCAtMTUuMDAwMDAwOTUzNjc0MzE2XG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCdwb2ludHdpc2Ugd2l0aCBwcmVsdScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbNCwgNCwgaW5wdXREZXB0aF07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAzO1xuICAgIGNvbnN0IGZTaXplID0gMTtcbiAgICBjb25zdCBwYWQgPSAnc2FtZSc7XG4gICAgY29uc3Qgc3RyaWRlczogW251bWJlciwgbnVtYmVyXSA9IFsxLCAxXTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IzZChcbiAgICAgICAgW1xuICAgICAgICAgIDEwLCAzMCwgNTAsIDcwLCAyMCwgNDAsIDYwLCA4MCwgLTEwLCAtMzAsIC01MCwgLTcwLCAtMjAsIC00MCwgLTYwLCAtODBcbiAgICAgICAgXSxcbiAgICAgICAgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFsxLCAwLjUsIDFdLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuICAgIGNvbnN0IGFscGhhID0gdGYudGVuc29yM2QoWzAuNV0sIFsxLCAxLCBpbnB1dERlcHRoXSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSB0Zi5mdXNlZC5jb252MmQoe1xuICAgICAgeCxcbiAgICAgIGZpbHRlcjogdyxcbiAgICAgIHN0cmlkZXMsXG4gICAgICBwYWQsXG4gICAgICBkYXRhRm9ybWF0OiAnTkhXQycsXG4gICAgICBkaWxhdGlvbnM6IFsxLCAxXSxcbiAgICAgIGFjdGl2YXRpb246ICdwcmVsdScsXG4gICAgICBwcmVsdUFjdGl2YXRpb25XZWlnaHRzOiBhbHBoYVxuICAgIH0pO1xuXG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgW1xuICAgICAgMTAsICA1LCAgICAxMCwgIDMwLCAgMTUsICAgMzAsICA1MCwgIDI1LCAgICA1MCwgIDcwLCAgMzUsICAgIDcwLFxuICAgICAgMjAsICAxMCwgICAyMCwgIDQwLCAgMjAsICAgNDAsICA2MCwgIDMwLCAgICA2MCwgIDgwLCAgNDAsICAgIDgwLFxuICAgICAgLTUsICAtMi41LCAtNSwgIC0xNSwgLTcuNSwgLTE1LCAtMjUsIC0xMi41LCAtMjUsIC0zNSwgLTE3LjUsIC0zNSxcbiAgICAgIC0xMCwgLTUsICAgLTEwLCAtMjAsIC0xMCwgIC0yMCwgLTMwLCAtMTUsICAgLTMwLCAtNDAsIC0yMCwgICAtNDBcbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ3BvaW50d2lzZSB3aXRoIGxlYWt5cmVsdScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbNCwgNCwgaW5wdXREZXB0aF07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAzO1xuICAgIGNvbnN0IGZTaXplID0gMTtcbiAgICBjb25zdCBwYWQgPSAnc2FtZSc7XG4gICAgY29uc3Qgc3RyaWRlczogW251bWJlciwgbnVtYmVyXSA9IFsxLCAxXTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IzZChcbiAgICAgICAgW1xuICAgICAgICAgIDEwLCAzMCwgNTAsIDcwLCAyMCwgNDAsIDYwLCA4MCwgLTEwLCAtMzAsIC01MCwgLTcwLCAtMjAsIC00MCwgLTYwLCAtODBcbiAgICAgICAgXSxcbiAgICAgICAgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFsxLCAwLjUsIDFdLCBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuICAgIGNvbnN0IGFscGhhID0gMC4zO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuZnVzZWQuY29udjJkKHtcbiAgICAgIHgsXG4gICAgICBmaWx0ZXI6IHcsXG4gICAgICBzdHJpZGVzLFxuICAgICAgcGFkLFxuICAgICAgZGF0YUZvcm1hdDogJ05IV0MnLFxuICAgICAgZGlsYXRpb25zOiBbMSwgMV0sXG4gICAgICBhY3RpdmF0aW9uOiAnbGVha3lyZWx1JyxcbiAgICAgIGxlYWt5cmVsdUFscGhhOiBhbHBoYVxuICAgIH0pO1xuXG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgW1xuICAgICAgMTAsXG4gICAgICA1LFxuICAgICAgMTAsXG4gICAgICAzMCxcbiAgICAgIDE1LFxuICAgICAgMzAsXG4gICAgICA1MCxcbiAgICAgIDI1LFxuICAgICAgNTAsXG4gICAgICA3MCxcbiAgICAgIDM1LFxuICAgICAgNzAsXG4gICAgICAyMCxcbiAgICAgIDEwLFxuICAgICAgMjAsXG4gICAgICA0MCxcbiAgICAgIDIwLFxuICAgICAgNDAsXG4gICAgICA2MCxcbiAgICAgIDMwLFxuICAgICAgNjAsXG4gICAgICA4MCxcbiAgICAgIDQwLFxuICAgICAgODAsXG4gICAgICAtMyxcbiAgICAgIC0xLjUsXG4gICAgICAtMyxcbiAgICAgIC05LFxuICAgICAgLTQuNSxcbiAgICAgIC05LFxuICAgICAgLTE1LjAwMDAwMDk1MzY3NDMxNixcbiAgICAgIC03LjUwMDAwMDQ3NjgzNzE1OCxcbiAgICAgIC0xNS4wMDAwMDA5NTM2NzQzMTYsXG4gICAgICAtMjEsXG4gICAgICAtMTAuNSxcbiAgICAgIC0yMSxcbiAgICAgIC02LFxuICAgICAgLTMsXG4gICAgICAtNixcbiAgICAgIC0xMixcbiAgICAgIC02LFxuICAgICAgLTEyLFxuICAgICAgLTE4LFxuICAgICAgLTksXG4gICAgICAtMTgsXG4gICAgICAtMjQsXG4gICAgICAtMTIsXG4gICAgICAtMjRcbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ2ltMnJvdyB3aXRoIGJyb2FkY2FzdGVkIGJpYXMgYW5kIHJlbHUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDE7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzQsIDQsIGlucHV0RGVwdGhdO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gMztcbiAgICBjb25zdCBmU2l6ZSA9IDE7XG4gICAgY29uc3QgcGFkID0gJ3NhbWUnO1xuICAgIGNvbnN0IHN0cmlkZXM6IFtudW1iZXIsIG51bWJlcl0gPSBbMiwgMl07XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yM2QoXG4gICAgICAgIFtcbiAgICAgICAgICAxMCwgMzAsIDUwLCA3MCwgMjAsIDQwLCA2MCwgODAsIC0xMCwgLTMwLCAtNTAsIC03MCwgLTIwLCAtNDAsIC02MCwgLTgwXG4gICAgICAgIF0sXG4gICAgICAgIGlucHV0U2hhcGUpO1xuICAgIGNvbnN0IHcgPSB0Zi50ZW5zb3I0ZChbMSwgMC41LCAxXSwgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmZ1c2VkLmNvbnYyZCh7XG4gICAgICB4LFxuICAgICAgZmlsdGVyOiB3LFxuICAgICAgc3RyaWRlcyxcbiAgICAgIHBhZCxcbiAgICAgIGRhdGFGb3JtYXQ6ICdOSFdDJyxcbiAgICAgIGRpbGF0aW9uczogWzEsIDFdLFxuICAgICAgYmlhczogdGYuc2NhbGFyKDUpLFxuICAgICAgYWN0aXZhdGlvbjogJ3JlbHUnXG4gICAgfSk7XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShcbiAgICAgICAgYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzE1LCAxMCwgMTUsIDU1LCAzMCwgNTUsIDAsIDAsIDAsIDAsIDAsIDBdKTtcbiAgfSk7XG5cbiAgaXQoJ2ltMnJvdyBpbiBOQ0hXJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGlucHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFtpbnB1dERlcHRoLCAyLCAyXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDI7XG4gICAgY29uc3QgZlNpemUgPSAyO1xuICAgIGNvbnN0IHBhZCA9ICdzYW1lJztcbiAgICBjb25zdCBzdHJpZGVzOiBbbnVtYmVyLCBudW1iZXJdID0gWzEsIDFdO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjNkKFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4XSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgLTEsIC0yLCAtMywgLTQsIC01LCAtNiwgLTcsIC04XSxcbiAgICAgICAgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9XG4gICAgICAgIHRmLmZ1c2VkLmNvbnYyZCh7eCwgZmlsdGVyOiB3LCBzdHJpZGVzLCBwYWQsIGRhdGFGb3JtYXQ6ICdOQ0hXJ30pO1xuXG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgIGF3YWl0IHJlc3VsdC5kYXRhKCksIFstMzIsIC04LCAxMDAsIDI4LCAtNDAsIC0xMiwgMTIyLCA0MF0pO1xuICB9KTtcblxuICBpdCgnaW0ycm93IGluIE5DSFcgd2l0aCBzY2FsYXIgYmlhcycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gNDtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCBpbnB1dERlcHRoLCAyLCAyXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDQ7XG4gICAgY29uc3QgZlNpemUgPSAyO1xuICAgIGNvbnN0IHBhZCA9ICdzYW1lJztcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRhdGFGb3JtYXQgPSAnTkNIVyc7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbMSwgMiwgMywgNCwgMSwgMiwgMywgNCwgMSwgMiwgMywgNCwgMSwgMiwgMywgNF0sIGlucHV0U2hhcGUpO1xuICAgIGNvbnN0IHcgPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgW1xuICAgICAgICAgIDMsIDMsIDMsIDMsIDEsIDEsIDEsIDEsIDUsIDUsIDUsIDUsIDAsIDAsIDAsIDAsIDMsIDMsIDMsIDMsIDEsIDEsXG4gICAgICAgICAgMSwgMSwgNSwgNSwgNSwgNSwgMCwgMCwgMCwgMCwgMywgMywgMywgMywgMSwgMSwgMSwgMSwgNSwgNSwgNSwgNSxcbiAgICAgICAgICAwLCAwLCAwLCAwLCAzLCAzLCAzLCAzLCAxLCAxLCAxLCAxLCA1LCA1LCA1LCA1LCAwLCAwLCAwLCAwLFxuICAgICAgICBdLFxuICAgICAgICBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuICAgIGNvbnN0IGJpYXMgPSB0Zi5zY2FsYXIoMSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSB0Zi5mdXNlZC5jb252MmQoe1xuICAgICAgeCxcbiAgICAgIGZpbHRlcjogdyxcbiAgICAgIHN0cmlkZXM6IHN0cmlkZSxcbiAgICAgIHBhZCxcbiAgICAgIGRhdGFGb3JtYXQsXG4gICAgICBkaWxhdGlvbnM6IGRpbGF0aW9uLFxuICAgICAgYmlhc1xuICAgIH0pO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMSwgNCwgMiwgMl0pO1xuICAgIGNvbnN0IGV4cGVjdGVkID1cbiAgICAgICAgWzkxLCA1NSwgNjQsIDM3LCA5MSwgNTUsIDY0LCAzNywgOTEsIDU1LCA2NCwgMzcsIDkxLCA1NSwgNjQsIDM3XTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCdpbTJyb3cgaW4gTkNIVyB3aXRoIDEtRCBiaWFzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0RGVwdGggPSA0O1xuICAgIGNvbnN0IGlucHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzEsIGlucHV0RGVwdGgsIDIsIDJdO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gNDtcbiAgICBjb25zdCBmU2l6ZSA9IDI7XG4gICAgY29uc3QgcGFkID0gJ3NhbWUnO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGF0YUZvcm1hdCA9ICdOQ0hXJztcbiAgICBjb25zdCBkaWxhdGlvbiA9IDE7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yNGQoXG4gICAgICAgIFsxLCAyLCAzLCA0LCAxLCAyLCAzLCA0LCAxLCAyLCAzLCA0LCAxLCAyLCAzLCA0XSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbXG4gICAgICAgICAgMywgMywgMywgMywgMSwgMSwgMSwgMSwgNSwgNSwgNSwgNSwgMCwgMCwgMCwgMCwgMywgMywgMywgMywgMSwgMSxcbiAgICAgICAgICAxLCAxLCA1LCA1LCA1LCA1LCAwLCAwLCAwLCAwLCAzLCAzLCAzLCAzLCAxLCAxLCAxLCAxLCA1LCA1LCA1LCA1LFxuICAgICAgICAgIDAsIDAsIDAsIDAsIDMsIDMsIDMsIDMsIDEsIDEsIDEsIDEsIDUsIDUsIDUsIDUsIDAsIDAsIDAsIDAsXG4gICAgICAgIF0sXG4gICAgICAgIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG4gICAgY29uc3QgYmlhcyA9IHRmLnRlbnNvcjFkKFsxLCAyLCAxLCAyXSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSB0Zi5mdXNlZC5jb252MmQoe1xuICAgICAgeCxcbiAgICAgIGZpbHRlcjogdyxcbiAgICAgIHN0cmlkZXM6IHN0cmlkZSxcbiAgICAgIHBhZCxcbiAgICAgIGRhdGFGb3JtYXQsXG4gICAgICBkaWxhdGlvbnM6IGRpbGF0aW9uLFxuICAgICAgYmlhc1xuICAgIH0pO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMSwgNCwgMiwgMl0pO1xuICAgIGNvbnN0IGV4cGVjdGVkID1cbiAgICAgICAgWzkxLCA1NSwgNjQsIDM3LCA5MiwgNTYsIDY1LCAzOCwgOTEsIDU1LCA2NCwgMzcsIDkyLCA1NiwgNjUsIDM4XTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCdpbTJyb3cgaW4gTkNIVyB3aXRoIHNjYWxhciBQUmVMVSBhY3RpYXZhdGlvbiB3ZWlnaHRzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzEsIGlucHV0RGVwdGgsIDIsIDJdO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gMjtcbiAgICBjb25zdCBmU2l6ZSA9IDI7XG4gICAgY29uc3QgZGF0YUZvcm1hdCA9ICdOQ0hXJztcbiAgICBjb25zdCBkaWxhdGlvbiA9IDE7XG4gICAgY29uc3QgcGFkID0gJ3NhbWUnO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yNGQoWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDhdLCBpblNoYXBlKTtcbiAgICBjb25zdCB3ID0gdGYudGVuc29yNGQoXG4gICAgICAgIFstMSwgLTEsIC0xLCAtMSwgMSwgMSwgMSwgMSwgLTIsIC0yLCAtMiwgLTIsIDAuNSwgMC41LCAwLjUsIDAuNV0sXG4gICAgICAgIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG4gICAgY29uc3QgYWxwaGEgPSB0Zi5zY2FsYXIoMTApO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuZnVzZWQuY29udjJkKHtcbiAgICAgIHgsXG4gICAgICBmaWx0ZXI6IHcsXG4gICAgICBzdHJpZGVzOiBzdHJpZGUsXG4gICAgICBwYWQsXG4gICAgICBkYXRhRm9ybWF0LFxuICAgICAgZGlsYXRpb25zOiBkaWxhdGlvbixcbiAgICAgIGFjdGl2YXRpb246ICdwcmVsdScsXG4gICAgICBwcmVsdUFjdGl2YXRpb25XZWlnaHRzOiBhbHBoYVxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMSwgMiwgMiwgMl0pO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gWy0xMjAsIC0zMjAsIDIsIC0xMjAsIC0xMjAsIC0zMjAsIDIsIC0xMjBdO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2ltMnJvdyBpbiBOQ0hXIHdpdGggMS1EIFBSZUxVIGFjdGlhdmF0aW9uIHdlaWdodHMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDI7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMSwgaW5wdXREZXB0aCwgMiwgMl07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGZTaXplID0gMjtcbiAgICBjb25zdCBkYXRhRm9ybWF0ID0gJ05DSFcnO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgICBjb25zdCBwYWQgPSAnc2FtZSc7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChbMSwgMiwgMywgNCwgNSwgNiwgNywgOF0sIGluU2hhcGUpO1xuICAgIGNvbnN0IHcgPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWy0xLCAtMSwgLTEsIC0xLCAxLCAxLCAxLCAxLCAtMiwgLTIsIC0yLCAtMiwgMC41LCAwLjUsIDAuNSwgMC41XSxcbiAgICAgICAgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcbiAgICBjb25zdCBhbHBoYSA9IHRmLnRlbnNvcjFkKFsxLCAxMF0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuZnVzZWQuY29udjJkKHtcbiAgICAgIHgsXG4gICAgICBmaWx0ZXI6IHcsXG4gICAgICBzdHJpZGVzOiBzdHJpZGUsXG4gICAgICBwYWQsXG4gICAgICBkYXRhRm9ybWF0LFxuICAgICAgZGlsYXRpb25zOiBkaWxhdGlvbixcbiAgICAgIGFjdGl2YXRpb246ICdwcmVsdScsXG4gICAgICBwcmVsdUFjdGl2YXRpb25XZWlnaHRzOiBhbHBoYVxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMSwgMiwgMiwgMl0pO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gWy0xMiwgLTMyLCAyLCAtMTIsIC0xMjAsIC0zMjAsIDIsIC0xMjBdO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2ltMnJvdyBpbiBOQ0hXIHdpdGggMy1EIFBSZUxVIGFjdGlhdmF0aW9uIHdlaWdodHMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDI7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMSwgaW5wdXREZXB0aCwgMiwgMl07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGZTaXplID0gMjtcbiAgICBjb25zdCBkYXRhRm9ybWF0ID0gJ05DSFcnO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgICBjb25zdCBwYWQgPSAnc2FtZSc7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChbMSwgMiwgMywgNCwgNSwgNiwgNywgOF0sIGluU2hhcGUpO1xuICAgIGNvbnN0IHcgPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWy0xLCAtMSwgLTEsIC0xLCAxLCAxLCAxLCAxLCAtMiwgLTIsIC0yLCAtMiwgMC41LCAwLjUsIDAuNSwgMC41XSxcbiAgICAgICAgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcbiAgICBjb25zdCBhbHBoYSA9IHRmLnRlbnNvcjNkKFsxLCAxMF0sIFsyLCAxLCAxXSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSB0Zi5mdXNlZC5jb252MmQoe1xuICAgICAgeCxcbiAgICAgIGZpbHRlcjogdyxcbiAgICAgIHN0cmlkZXM6IHN0cmlkZSxcbiAgICAgIHBhZCxcbiAgICAgIGRhdGFGb3JtYXQsXG4gICAgICBkaWxhdGlvbnM6IGRpbGF0aW9uLFxuICAgICAgYWN0aXZhdGlvbjogJ3ByZWx1JyxcbiAgICAgIHByZWx1QWN0aXZhdGlvbldlaWdodHM6IGFscGhhXG4gICAgfSk7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFsxLCAyLCAyLCAyXSk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbLTEyLCAtMzIsIDIsIC0xMiwgLTEyMCwgLTMyMCwgMiwgLTEyMF07XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgZXhwZWN0ZWQpO1xuICB9KTtcblxuICBpdCgnaW0ycm93IGluIE5DSFcgd2l0aCBmdWxsIDMtRCBQUmVMVSBhY3RpYXZhdGlvbiB3ZWlnaHRzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzEsIGlucHV0RGVwdGgsIDIsIDJdO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gMjtcbiAgICBjb25zdCBmU2l6ZSA9IDI7XG4gICAgY29uc3QgZGF0YUZvcm1hdCA9ICdOQ0hXJztcbiAgICBjb25zdCBkaWxhdGlvbiA9IDE7XG4gICAgY29uc3QgcGFkID0gJ3NhbWUnO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yNGQoWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDhdLCBpblNoYXBlKTtcbiAgICBjb25zdCB3ID0gdGYudGVuc29yNGQoXG4gICAgICAgIFstMSwgLTEsIC0xLCAtMSwgMSwgMSwgMSwgMSwgLTIsIC0yLCAtMiwgLTIsIDAuNSwgMC41LCAwLjUsIDAuNV0sXG4gICAgICAgIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG4gICAgY29uc3QgYWxwaGEgPSB0Zi50ZW5zb3IzZChbMSwgMiwgMywgNCwgNSwgNiwgNywgOF0sIFsyLCAyLCAyXSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSB0Zi5mdXNlZC5jb252MmQoe1xuICAgICAgeCxcbiAgICAgIGZpbHRlcjogdyxcbiAgICAgIHN0cmlkZXM6IHN0cmlkZSxcbiAgICAgIHBhZCxcbiAgICAgIGRhdGFGb3JtYXQsXG4gICAgICBkaWxhdGlvbnM6IGRpbGF0aW9uLFxuICAgICAgYWN0aXZhdGlvbjogJ3ByZWx1JyxcbiAgICAgIHByZWx1QWN0aXZhdGlvbldlaWdodHM6IGFscGhhXG4gICAgfSk7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFsxLCAyLCAyLCAyXSk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbLTEyLCAtNjQsIDIsIC00OCwgLTYwLCAtMTkyLCAyLCAtOTZdO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2JhdGNoIGluIE5DSFcnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDI7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMiwgaW5wdXREZXB0aCwgMiwgMl07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGZTaXplID0gMjtcbiAgICBjb25zdCBwYWQgPSAnc2FtZSc7XG4gICAgY29uc3Qgc3RyaWRlczogW251bWJlciwgbnVtYmVyXSA9IFsxLCAxXTtcbiAgICBjb25zdCBkYXRhRm9ybWF0ID0gJ05DSFcnO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTUsIDE2XSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgLTEsIC0yLCAtMywgLTQsIC01LCAtNiwgLTcsIC04XSxcbiAgICAgICAgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmZ1c2VkLmNvbnYyZChcbiAgICAgICAge3gsIGZpbHRlcjogdywgc3RyaWRlcywgcGFkLCBkYXRhRm9ybWF0LCBkaWxhdGlvbnM6IGRpbGF0aW9ufSk7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFsyLCAyLCAyLCAyXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgW1xuICAgICAgLTMyLCAtOCwgMTAwLCAyOCwgLTQwLCAtMTIsIDEyMiwgNDAsIC0zMiwgLTgsIDIyOCwgNjAsIC00MCwgLTEyLCAyODIsIDg4XG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCdiYXRjaCBpbiBOQ0hXIHdpdGggc2NhbGFyIGJpYXMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDI7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMiwgaW5wdXREZXB0aCwgMiwgMl07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGZTaXplID0gMjtcbiAgICBjb25zdCBwYWQgPSAnc2FtZSc7XG4gICAgY29uc3Qgc3RyaWRlczogW251bWJlciwgbnVtYmVyXSA9IFsxLCAxXTtcbiAgICBjb25zdCBkYXRhRm9ybWF0ID0gJ05DSFcnO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTUsIDE2XSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgLTEsIC0yLCAtMywgLTQsIC01LCAtNiwgLTcsIC04XSxcbiAgICAgICAgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcbiAgICBjb25zdCBiaWFzID0gdGYuc2NhbGFyKDEpO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuZnVzZWQuY29udjJkKFxuICAgICAgICB7eCwgZmlsdGVyOiB3LCBzdHJpZGVzLCBwYWQsIGRhdGFGb3JtYXQsIGRpbGF0aW9uczogZGlsYXRpb24sIGJpYXN9KTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzIsIDIsIDIsIDJdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBbXG4gICAgICAtMzEsIC03LCAxMDEsIDI5LCAtMzksIC0xMSwgMTIzLCA0MSwgLTMxLCAtNywgMjI5LCA2MSwgLTM5LCAtMTEsIDI4MywgODlcbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ2JhdGNoIGluIE5DSFcgd2l0aCAxLUQgYmlhcycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMjtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsyLCBpbnB1dERlcHRoLCAyLCAyXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDI7XG4gICAgY29uc3QgZlNpemUgPSAyO1xuICAgIGNvbnN0IHBhZCA9ICdzYW1lJztcbiAgICBjb25zdCBzdHJpZGVzOiBbbnVtYmVyLCBudW1iZXJdID0gWzEsIDFdO1xuICAgIGNvbnN0IGRhdGFGb3JtYXQgPSAnTkNIVyc7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSwgMTZdLCBpbnB1dFNoYXBlKTtcbiAgICBjb25zdCB3ID0gdGYudGVuc29yNGQoXG4gICAgICAgIFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCAtMSwgLTIsIC0zLCAtNCwgLTUsIC02LCAtNywgLThdLFxuICAgICAgICBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuICAgIGNvbnN0IGJpYXMgPSB0Zi50ZW5zb3IxZChbMSwgMl0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuZnVzZWQuY29udjJkKFxuICAgICAgICB7eCwgZmlsdGVyOiB3LCBzdHJpZGVzLCBwYWQsIGRhdGFGb3JtYXQsIGRpbGF0aW9uczogZGlsYXRpb24sIGJpYXN9KTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzIsIDIsIDIsIDJdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBbXG4gICAgICAtMzEsIC03LCAxMDEsIDI5LCAtMzgsIC0xMCwgMTI0LCA0MiwgLTMxLCAtNywgMjI5LCA2MSwgLTM4LCAtMTAsIDI4NCwgOTBcbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ2JhdGNoIGluIE5DSFcgd2l0aCBzY2FsYXIgUFJlTFUgYWN0aWF2YXRpb24gd2VpZ2h0cycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMjtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsyLCBpbnB1dERlcHRoLCAyLCAyXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDI7XG4gICAgY29uc3QgZlNpemUgPSAyO1xuICAgIGNvbnN0IHBhZCA9ICdzYW1lJztcbiAgICBjb25zdCBzdHJpZGVzOiBbbnVtYmVyLCBudW1iZXJdID0gWzEsIDFdO1xuICAgIGNvbnN0IGRhdGFGb3JtYXQgPSAnTkNIVyc7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSwgMTZdLCBpbnB1dFNoYXBlKTtcbiAgICBjb25zdCB3ID0gdGYudGVuc29yNGQoXG4gICAgICAgIFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCAtMSwgLTIsIC0zLCAtNCwgLTUsIC02LCAtNywgLThdLFxuICAgICAgICBbZlNpemUsIGZTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF0pO1xuICAgIGNvbnN0IGFscGhhID0gdGYuc2NhbGFyKDEwKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmZ1c2VkLmNvbnYyZCh7XG4gICAgICB4LFxuICAgICAgZmlsdGVyOiB3LFxuICAgICAgc3RyaWRlcyxcbiAgICAgIHBhZCxcbiAgICAgIGRhdGFGb3JtYXQsXG4gICAgICBkaWxhdGlvbnM6IGRpbGF0aW9uLFxuICAgICAgYWN0aXZhdGlvbjogJ3ByZWx1JyxcbiAgICAgIHByZWx1QWN0aXZhdGlvbldlaWdodHM6IGFscGhhXG4gICAgfSk7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFsyLCAyLCAyLCAyXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgW1xuICAgICAgLTMyMCwgLTgwLCAxMDAsIDI4LCAtNDAwLCAtMTIwLCAxMjIsIDQwLCAtMzIwLCAtODAsIDIyOCwgNjAsIC00MDAsIC0xMjAsXG4gICAgICAyODIsIDg4XG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCdiYXRjaCBpbiBOQ0hXIHdpdGggMS1EIFBSZUxVIGFjdGlhdmF0aW9uIHdlaWdodHMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDI7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMiwgaW5wdXREZXB0aCwgMiwgMl07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGZTaXplID0gMjtcbiAgICBjb25zdCBwYWQgPSAnc2FtZSc7XG4gICAgY29uc3Qgc3RyaWRlczogW251bWJlciwgbnVtYmVyXSA9IFsxLCAxXTtcbiAgICBjb25zdCBkYXRhRm9ybWF0ID0gJ05DSFcnO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTUsIDE2XSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgLTEsIC0yLCAtMywgLTQsIC01LCAtNiwgLTcsIC04XSxcbiAgICAgICAgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcbiAgICBjb25zdCBhbHBoYSA9IHRmLnRlbnNvcjFkKFsxLCAxMF0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuZnVzZWQuY29udjJkKHtcbiAgICAgIHgsXG4gICAgICBmaWx0ZXI6IHcsXG4gICAgICBzdHJpZGVzLFxuICAgICAgcGFkLFxuICAgICAgZGF0YUZvcm1hdCxcbiAgICAgIGRpbGF0aW9uczogZGlsYXRpb24sXG4gICAgICBhY3RpdmF0aW9uOiAncHJlbHUnLFxuICAgICAgcHJlbHVBY3RpdmF0aW9uV2VpZ2h0czogYWxwaGFcbiAgICB9KTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzIsIDIsIDIsIDJdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBbXG4gICAgICAtMzIsIC04LCAxMDAsIDI4LCAtNDAwLCAtMTIwLCAxMjIsIDQwLCAtMzIsIC04LCAyMjgsIDYwLCAtNDAwLCAtMTIwLCAyODIsXG4gICAgICA4OFxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnYmF0Y2ggaW4gTkNIVyB3aXRoIDMtRCBQUmVMVSBhY3RpYXZhdGlvbiB3ZWlnaHRzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGlucHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzIsIGlucHV0RGVwdGgsIDIsIDJdO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gMjtcbiAgICBjb25zdCBmU2l6ZSA9IDI7XG4gICAgY29uc3QgcGFkID0gJ3NhbWUnO1xuICAgIGNvbnN0IHN0cmlkZXM6IFtudW1iZXIsIG51bWJlcl0gPSBbMSwgMV07XG4gICAgY29uc3QgZGF0YUZvcm1hdCA9ICdOQ0hXJztcbiAgICBjb25zdCBkaWxhdGlvbiA9IDE7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yNGQoXG4gICAgICAgIFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE1LCAxNl0sIGlucHV0U2hhcGUpO1xuICAgIGNvbnN0IHcgPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIC0xLCAtMiwgLTMsIC00LCAtNSwgLTYsIC03LCAtOF0sXG4gICAgICAgIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG4gICAgY29uc3QgYWxwaGEgPSB0Zi50ZW5zb3IzZChbMSwgMTBdLCBbMiwgMSwgMV0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuZnVzZWQuY29udjJkKHtcbiAgICAgIHgsXG4gICAgICBmaWx0ZXI6IHcsXG4gICAgICBzdHJpZGVzLFxuICAgICAgcGFkLFxuICAgICAgZGF0YUZvcm1hdCxcbiAgICAgIGRpbGF0aW9uczogZGlsYXRpb24sXG4gICAgICBhY3RpdmF0aW9uOiAncHJlbHUnLFxuICAgICAgcHJlbHVBY3RpdmF0aW9uV2VpZ2h0czogYWxwaGFcbiAgICB9KTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzIsIDIsIDIsIDJdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBbXG4gICAgICAtMzIsIC04LCAxMDAsIDI4LCAtNDAwLCAtMTIwLCAxMjIsIDQwLCAtMzIsIC04LCAyMjgsIDYwLCAtNDAwLCAtMTIwLCAyODIsXG4gICAgICA4OFxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnYmF0Y2ggaW4gTkNIVyB3aXRoIGZ1bGwgMy1EIFBSZUxVIGFjdGlhdmF0aW9uIHdlaWdodHMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDI7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMiwgaW5wdXREZXB0aCwgMiwgMl07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGZTaXplID0gMjtcbiAgICBjb25zdCBwYWQgPSAnc2FtZSc7XG4gICAgY29uc3Qgc3RyaWRlczogW251bWJlciwgbnVtYmVyXSA9IFsxLCAxXTtcbiAgICBjb25zdCBkYXRhRm9ybWF0ID0gJ05DSFcnO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTUsIDE2XSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgLTEsIC0yLCAtMywgLTQsIC01LCAtNiwgLTcsIC04XSxcbiAgICAgICAgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdKTtcbiAgICBjb25zdCBhbHBoYSA9IHRmLnRlbnNvcjNkKFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4XSwgWzIsIDIsIDJdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmZ1c2VkLmNvbnYyZCh7XG4gICAgICB4LFxuICAgICAgZmlsdGVyOiB3LFxuICAgICAgc3RyaWRlcyxcbiAgICAgIHBhZCxcbiAgICAgIGRhdGFGb3JtYXQsXG4gICAgICBkaWxhdGlvbnM6IGRpbGF0aW9uLFxuICAgICAgYWN0aXZhdGlvbjogJ3ByZWx1JyxcbiAgICAgIHByZWx1QWN0aXZhdGlvbldlaWdodHM6IGFscGhhXG4gICAgfSk7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFsyLCAyLCAyLCAyXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgW1xuICAgICAgLTMyLCAtMTYsIDEwMCwgMjgsIC0yMDAsIC03MiwgMTIyLCA0MCwgLTMyLCAtMTYsIDIyOCwgNjAsIC0yMDAsIC03MiwgMjgyLFxuICAgICAgODhcbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ2JhY2tQcm9wIGlucHV0IHg9WzIsMywzLDFdIGY9WzIsMiwxLDFdIHM9MSBwPTAnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDE7XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAxO1xuICAgIGNvbnN0IGlucHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzIsIDMsIDMsIGlucHV0RGVwdGhdO1xuICAgIGNvbnN0IGZpbHRlclNpemUgPSAyO1xuICAgIGNvbnN0IHN0cmlkZXMgPSAxO1xuICAgIGNvbnN0IHBhZCA9IDA7XG5cbiAgICBjb25zdCBmaWx0ZXJTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPVxuICAgICAgICBbZmlsdGVyU2l6ZSwgZmlsdGVyU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdO1xuICAgIGNvbnN0IGZpbHRlciA9IHRmLnRlbnNvcjRkKFstMSwgMSwgLTIsIDAuNV0sIGZpbHRlclNoYXBlKTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDldLCBpbnB1dFNoYXBlKTtcbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjRkKFszLCAxLCAyLCAwLCAzLCAxLCAyLCAwXSwgWzIsIDIsIDIsIDFdKTtcblxuICAgIGNvbnN0IGdyYWRzID0gdGYuZ3JhZHMoXG4gICAgICAgICh4OiB0Zi5UZW5zb3I0RCkgPT4gdGYuZnVzZWQuY29udjJkKHt4LCBmaWx0ZXIsIHN0cmlkZXMsIHBhZH0pKTtcbiAgICBjb25zdCBbZHhdID0gZ3JhZHMoW3hdLCBkeSk7XG5cbiAgICBleHBlY3QoZHguc2hhcGUpLnRvRXF1YWwoeC5zaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgIGF3YWl0IGR4LmRhdGEoKSxcbiAgICAgICAgWy0zLCAyLCAxLCAtOCwgMS41LCAwLjUsIC00LCAxLCAwLCAtMywgMiwgMSwgLTgsIDEuNSwgMC41LCAtNCwgMSwgMF0pO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnQgeD1bMiwzLDMsMV0gZj1bMiwyLDEsMV0gcz0xIHA9MCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDE7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMiwgMywgMywgaW5wdXREZXB0aF07XG4gICAgY29uc3QgZmlsdGVyU2l6ZSA9IDI7XG4gICAgY29uc3Qgc3RyaWRlcyA9IDE7XG4gICAgY29uc3QgcGFkID0gMDtcblxuICAgIGNvbnN0IGZpbHRlclNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9XG4gICAgICAgIFtmaWx0ZXJTaXplLCBmaWx0ZXJTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF07XG4gICAgY29uc3QgZmlsdGVyID0gdGYudGVuc29yNGQoWy0xLCAxLCAtMiwgMC41XSwgZmlsdGVyU2hhcGUpO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOV0sIGlucHV0U2hhcGUpO1xuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yNGQoWzMsIDEsIDIsIDAsIDMsIDEsIDIsIDBdLCBbMiwgMiwgMiwgMV0pO1xuXG4gICAgY29uc3QgZ3JhZHMgPSB0Zi5ncmFkcyhcbiAgICAgICAgKHg6IHRmLlRlbnNvcjRELCBmaWx0ZXI6IHRmLlRlbnNvcjREKSA9PlxuICAgICAgICAgICAgdGYuZnVzZWQuY29udjJkKHt4LCBmaWx0ZXIsIHN0cmlkZXMsIHBhZH0pKTtcbiAgICBjb25zdCBbZHgsIGRmaWx0ZXJdID0gZ3JhZHMoW3gsIGZpbHRlcl0sIGR5KTtcblxuICAgIGV4cGVjdChkeC5zaGFwZSkudG9FcXVhbCh4LnNoYXBlKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShcbiAgICAgICAgYXdhaXQgZHguZGF0YSgpLFxuICAgICAgICBbLTMsIDIsIDEsIC04LCAxLjUsIDAuNSwgLTQsIDEsIDAsIC0zLCAyLCAxLCAtOCwgMS41LCAwLjUsIC00LCAxLCAwXSk7XG5cbiAgICBleHBlY3QoZGZpbHRlci5zaGFwZSkudG9FcXVhbChmaWx0ZXJTaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZGZpbHRlci5kYXRhKCksIFsyNiwgMzgsIDYyLCA3NF0pO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnQgeD1bMiwzLDMsMV0gZj1bMiwyLDEsMV0gcz0xIHA9MCB3aXRoIGJpYXMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDE7XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAxO1xuICAgIGNvbnN0IGlucHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzIsIDMsIDMsIGlucHV0RGVwdGhdO1xuICAgIGNvbnN0IGZpbHRlclNpemUgPSAyO1xuICAgIGNvbnN0IHN0cmlkZXMgPSAxO1xuICAgIGNvbnN0IHBhZCA9IDA7XG5cbiAgICBjb25zdCBmaWx0ZXJTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPVxuICAgICAgICBbZmlsdGVyU2l6ZSwgZmlsdGVyU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdO1xuICAgIGNvbnN0IGZpbHRlciA9IHRmLnRlbnNvcjRkKFstMSwgMSwgLTIsIDAuNV0sIGZpbHRlclNoYXBlKTtcbiAgICBjb25zdCBiaWFzID0gdGYub25lcyhbMiwgMiwgMiwgMV0pO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOV0sIGlucHV0U2hhcGUpO1xuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yNGQoWzMsIDEsIDIsIDAsIDMsIDEsIDIsIDBdLCBbMiwgMiwgMiwgMV0pO1xuXG4gICAgY29uc3QgZnVzZWRHcmFkcyA9XG4gICAgICAgIHRmLmdyYWRzKCh4OiB0Zi5UZW5zb3I0RCwgdzogdGYuVGVuc29yNEQsIGIpID0+IHRmLmZ1c2VkLmNvbnYyZCh7XG4gICAgICAgICAgeCxcbiAgICAgICAgICBmaWx0ZXI6IHcsXG4gICAgICAgICAgc3RyaWRlcyxcbiAgICAgICAgICBwYWQsXG4gICAgICAgICAgZGF0YUZvcm1hdDogJ05IV0MnLFxuICAgICAgICAgIGRpbGF0aW9uczogWzEsIDFdLFxuICAgICAgICAgIGJpYXM6IGJcbiAgICAgICAgfSkpO1xuICAgIGNvbnN0IFtkeEZ1c2VkLCBkZmlsdGVyRnVzZWQsIGRiaWFzRnVzZWRdID1cbiAgICAgICAgZnVzZWRHcmFkcyhbeCwgZmlsdGVyLCBiaWFzXSwgZHkpO1xuXG4gICAgY29uc3QgZ3JhZHMgPSB0Zi5ncmFkcygoeDogdGYuVGVuc29yNEQsIGZpbHRlcjogdGYuVGVuc29yNEQsIGJpYXMpID0+IHtcbiAgICAgIGNvbnN0IGNvbnYgPSB0Zi5jb252MmQoeCwgZmlsdGVyLCBzdHJpZGVzLCBwYWQpO1xuICAgICAgY29uc3Qgc3VtID0gdGYuYWRkKGNvbnYsIGJpYXMpO1xuICAgICAgcmV0dXJuIHN1bTtcbiAgICB9KTtcbiAgICBjb25zdCBbZHgsIGRmaWx0ZXIsIGRiaWFzXSA9IGdyYWRzKFt4LCBmaWx0ZXIsIGJpYXNdLCBkeSk7XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkeEZ1c2VkLmFycmF5KCksIGF3YWl0IGR4LmFycmF5KCkpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRmaWx0ZXJGdXNlZC5hcnJheSgpLCBhd2FpdCBkZmlsdGVyLmFycmF5KCkpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRiaWFzRnVzZWQuYXJyYXkoKSwgYXdhaXQgZGJpYXMuYXJyYXkoKSk7XG4gIH0pO1xuXG4gIGl0KCdncmFkaWVudCB4PVsyLDMsMywxXSBmPVsyLDIsMSwxXSBzPTEgcD0wIHdpdGggYmlhcyBhbmQgcmVsdScsXG4gICAgIGFzeW5jICgpID0+IHtcbiAgICAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICAgICBjb25zdCBvdXRwdXREZXB0aCA9IDE7XG4gICAgICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPVxuICAgICAgICAgICBbMiwgMywgMywgaW5wdXREZXB0aF07XG4gICAgICAgY29uc3QgZmlsdGVyU2l6ZSA9IDI7XG4gICAgICAgY29uc3Qgc3RyaWRlcyA9IDE7XG4gICAgICAgY29uc3QgcGFkID0gMDtcblxuICAgICAgIGNvbnN0IGZpbHRlclNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9XG4gICAgICAgICAgIFtmaWx0ZXJTaXplLCBmaWx0ZXJTaXplLCBpbnB1dERlcHRoLCBvdXRwdXREZXB0aF07XG4gICAgICAgY29uc3QgZmlsdGVyID0gdGYudGVuc29yNGQoWy0xLCAxLCAtMiwgMC41XSwgZmlsdGVyU2hhcGUpO1xuICAgICAgIGNvbnN0IGJpYXMgPSB0Zi5vbmVzKFsyLCAyLCAyLCAxXSk7XG5cbiAgICAgICBjb25zdCB4ID0gdGYudGVuc29yNGQoXG4gICAgICAgICAgIFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5XSwgaW5wdXRTaGFwZSk7XG4gICAgICAgY29uc3QgZHkgPSB0Zi50ZW5zb3I0ZChbMywgMSwgMiwgMCwgMywgMSwgMiwgMF0sIFsyLCAyLCAyLCAxXSk7XG5cbiAgICAgICBjb25zdCBmdXNlZEdyYWRzID1cbiAgICAgICAgICAgdGYuZ3JhZHMoKHg6IHRmLlRlbnNvcjRELCB3OiB0Zi5UZW5zb3I0RCwgYikgPT4gdGYuZnVzZWQuY29udjJkKHtcbiAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgIGZpbHRlcjogdyxcbiAgICAgICAgICAgICBzdHJpZGVzLFxuICAgICAgICAgICAgIHBhZCxcbiAgICAgICAgICAgICBkYXRhRm9ybWF0OiAnTkhXQycsXG4gICAgICAgICAgICAgZGlsYXRpb25zOiBbMSwgMV0sXG4gICAgICAgICAgICAgYmlhczogYixcbiAgICAgICAgICAgICBhY3RpdmF0aW9uOiAncmVsdSdcbiAgICAgICAgICAgfSkpO1xuICAgICAgIGNvbnN0IFtkeEZ1c2VkLCBkZmlsdGVyRnVzZWQsIGRiaWFzRnVzZWRdID1cbiAgICAgICAgICAgZnVzZWRHcmFkcyhbeCwgZmlsdGVyLCBiaWFzXSwgZHkpO1xuXG4gICAgICAgY29uc3QgZ3JhZHMgPSB0Zi5ncmFkcygoeDogdGYuVGVuc29yNEQsIGZpbHRlcjogdGYuVGVuc29yNEQsIGJpYXMpID0+IHtcbiAgICAgICAgIGNvbnN0IGNvbnYgPSB0Zi5jb252MmQoeCwgZmlsdGVyLCBzdHJpZGVzLCBwYWQpO1xuICAgICAgICAgY29uc3Qgc3VtID0gdGYuYWRkKGNvbnYsIGJpYXMpO1xuICAgICAgICAgcmV0dXJuIHRmLnJlbHUoc3VtKTtcbiAgICAgICB9KTtcbiAgICAgICBjb25zdCBbZHgsIGRmaWx0ZXIsIGRiaWFzXSA9IGdyYWRzKFt4LCBmaWx0ZXIsIGJpYXNdLCBkeSk7XG5cbiAgICAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkeEZ1c2VkLmFycmF5KCksIGF3YWl0IGR4LmFycmF5KCkpO1xuICAgICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRmaWx0ZXJGdXNlZC5hcnJheSgpLCBhd2FpdCBkZmlsdGVyLmFycmF5KCkpO1xuICAgICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRiaWFzRnVzZWQuYXJyYXkoKSwgYXdhaXQgZGJpYXMuYXJyYXkoKSk7XG4gICAgIH0pO1xuXG4gIGl0KCdncmFkaWVudCB4PVsyLDMsMywxXSBmPVsyLDIsMSwxXSBzPTEgcD0wIHdpdGggYmlhcyBhbmQgZWx1JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0RGVwdGggPSAxO1xuICAgIGNvbnN0IG91dHB1dERlcHRoID0gMTtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsyLCAzLCAzLCBpbnB1dERlcHRoXTtcbiAgICBjb25zdCBmaWx0ZXJTaXplID0gMjtcbiAgICBjb25zdCBzdHJpZGVzID0gMTtcbiAgICBjb25zdCBwYWQgPSAwO1xuXG4gICAgY29uc3QgZmlsdGVyU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID1cbiAgICAgICAgW2ZpbHRlclNpemUsIGZpbHRlclNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXTtcbiAgICBjb25zdCBmaWx0ZXIgPSB0Zi50ZW5zb3I0ZChbLTEsIDEsIC0yLCAwLjVdLCBmaWx0ZXJTaGFwZSk7XG4gICAgY29uc3QgYmlhcyA9IHRmLm9uZXMoWzIsIDIsIDIsIDFdKTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDldLCBpbnB1dFNoYXBlKTtcbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjRkKFszLCAxLCAyLCAwLCAzLCAxLCAyLCAwXSwgWzIsIDIsIDIsIDFdKTtcblxuICAgIGNvbnN0IGZ1c2VkR3JhZHMgPVxuICAgICAgICB0Zi5ncmFkcygoeDogdGYuVGVuc29yNEQsIHc6IHRmLlRlbnNvcjRELCBiKSA9PiB0Zi5mdXNlZC5jb252MmQoe1xuICAgICAgICAgIHgsXG4gICAgICAgICAgZmlsdGVyOiB3LFxuICAgICAgICAgIHN0cmlkZXMsXG4gICAgICAgICAgcGFkLFxuICAgICAgICAgIGRhdGFGb3JtYXQ6ICdOSFdDJyxcbiAgICAgICAgICBkaWxhdGlvbnM6IFsxLCAxXSxcbiAgICAgICAgICBiaWFzOiBiLFxuICAgICAgICAgIGFjdGl2YXRpb246ICdlbHUnXG4gICAgICAgIH0pKTtcbiAgICBjb25zdCBbZHhGdXNlZCwgZGZpbHRlckZ1c2VkLCBkYmlhc0Z1c2VkXSA9XG4gICAgICAgIGZ1c2VkR3JhZHMoW3gsIGZpbHRlciwgYmlhc10sIGR5KTtcblxuICAgIGNvbnN0IGdyYWRzID0gdGYuZ3JhZHMoKHg6IHRmLlRlbnNvcjRELCBmaWx0ZXI6IHRmLlRlbnNvcjRELCBiaWFzKSA9PiB7XG4gICAgICBjb25zdCBjb252ID0gdGYuY29udjJkKHgsIGZpbHRlciwgc3RyaWRlcywgcGFkKTtcbiAgICAgIGNvbnN0IHN1bSA9IHRmLmFkZChjb252LCBiaWFzKTtcbiAgICAgIHJldHVybiB0Zi5lbHUoc3VtKTtcbiAgICB9KTtcbiAgICBjb25zdCBbZHgsIGRmaWx0ZXIsIGRiaWFzXSA9IGdyYWRzKFt4LCBmaWx0ZXIsIGJpYXNdLCBkeSk7XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkeEZ1c2VkLmFycmF5KCksIGF3YWl0IGR4LmFycmF5KCkpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRmaWx0ZXJGdXNlZC5hcnJheSgpLCBhd2FpdCBkZmlsdGVyLmFycmF5KCkpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRiaWFzRnVzZWQuYXJyYXkoKSwgYXdhaXQgZGJpYXMuYXJyYXkoKSk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3Mgd2hlbiBpbnB1dCBpcyBpbnQzMicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMjtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsyLCAyLCAyLCBpbnB1dERlcHRoXTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDI7XG4gICAgY29uc3QgZlNpemUgPSAxO1xuICAgIGNvbnN0IHBhZCA9IDA7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTUsIDE2XSwgaW5TaGFwZSxcbiAgICAgICAgJ2ludDMyJyk7XG4gICAgY29uc3QgdyA9XG4gICAgICAgIHRmLnRlbnNvcjRkKFstMSwgMSwgLTIsIDAuNV0sIFtmU2l6ZSwgZlNpemUsIGlucHV0RGVwdGgsIG91dHB1dERlcHRoXSk7XG5cbiAgICBleHBlY3QoKCkgPT4gdGYuZnVzZWQuY29udjJkKHt4LCBmaWx0ZXI6IHcsIHN0cmlkZXM6IHN0cmlkZSwgcGFkfSkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0FyZ3VtZW50ICd4JyBwYXNzZWQgdG8gJ2NvbnYyZCcgbXVzdCBiZSBmbG9hdDMyLyk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3Mgd2hlbiBmaWx0ZXIgaXMgaW50MzInLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDI7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMiwgMiwgMiwgaW5wdXREZXB0aF07XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGZTaXplID0gMTtcbiAgICBjb25zdCBwYWQgPSAwO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yNGQoXG4gICAgICAgIFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE1LCAxNl0sIGluU2hhcGUpO1xuICAgIGNvbnN0IHcgPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWy0xLCAxLCAtMiwgMC41XSwgW2ZTaXplLCBmU2l6ZSwgaW5wdXREZXB0aCwgb3V0cHV0RGVwdGhdLCAnaW50MzInKTtcblxuICAgIGV4cGVjdCgoKSA9PiB0Zi5mdXNlZC5jb252MmQoe3gsIGZpbHRlcjogdywgc3RyaWRlczogc3RyaWRlLCBwYWR9KSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvQXJndW1lbnQgJ2ZpbHRlcicgcGFzc2VkIHRvICdjb252MmQnIG11c3QgYmUgZmxvYXQzMi8pO1xuICB9KTtcbn0pO1xuIl19