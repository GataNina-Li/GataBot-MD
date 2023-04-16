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
import * as tf from '../../index';
import { ALL_ENVS, describeWithFlags } from '../../jasmine_util';
import { expectArraysClose } from '../../test_util';
describeWithFlags('resizeBilinear', ALL_ENVS, () => {
    it('simple alignCorners=false', async () => {
        const input = tf.tensor3d([2, 2, 4, 4], [2, 2, 1]);
        const output = input.resizeBilinear([3, 3], false);
        expectArraysClose(await output.data(), [2, 2, 2, 10 / 3, 10 / 3, 10 / 3, 4, 4, 4]);
    });
    it('5x5-bilinear, no change in shape', async () => {
        const image = tf.ones([1, 5, 5, 3]);
        const alignCorners = false;
        const output = tf.image.resizeBilinear(image, [5, 5], alignCorners);
        expect(output.shape).toEqual([1, 5, 5, 3]);
        expect(output.dtype).toBe('float32');
        expectArraysClose(await output.data(), await image.data());
    });
    it('simple alignCorners=true', async () => {
        const input = tf.tensor3d([2, 2, 4, 4], [2, 2, 1]);
        const output = input.resizeBilinear([3, 3], true);
        expectArraysClose(await output.data(), [2, 2, 2, 3, 3, 3, 4, 4, 4]);
    });
    it('works when rows are copied', async () => {
        const input = tf.tensor3d([
            1.56324531, 2.13817752, 1.44398421, 1.07632684, 0.59306785,
            -0.36970865, 1.62451879, 1.8367334, 1.13944798, 2.01993218,
            2.01919952, 2.67524054
        ], [2, 3, 2]);
        const output = input.resizeBilinear([4, 3], false);
        expectArraysClose(await output.data(), [
            1.5632453, 2.13817763, 1.44398415, 1.07632685, 0.59306782, -0.36970866,
            1.59388208, 1.98745549, 1.2917161, 1.54812956, 1.30613375, 1.15276587,
            1.62451875, 1.83673334, 1.13944793, 2.01993227, 2.01919961, 2.67524052,
            1.62451875, 1.83673334, 1.13944793, 2.01993227, 2.01919961, 2.67524052
        ]);
    });
    it('works for ints', async () => {
        const input = tf.tensor3d([1, 2, 3, 4, 5], [1, 5, 1], 'int32');
        const output = input.resizeBilinear([1, 10], false);
        expect(output.shape).toEqual([1, 10, 1]);
        expect(output.dtype).toBe('float32');
        expectArraysClose(await output.data(), [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5]);
    });
    it('matches tensorflow w/ random numbers alignCorners=false, ' +
        'halfPixelCenters=true', async () => {
        const input = tf.tensor3d([
            1.19074044, 0.91373104, 2.01611669, -0.52270832, 0.38725395,
            1.30809779, 0.61835143, 3.49600659, 2.09230986, 0.56473997,
            0.03823943, 1.19864896
        ], [2, 3, 2]);
        const output = input.resizeBilinear([4, 5], false, true);
        expectArraysClose(await output.data(), [
            1.1907405, 0.913731, 1.520891, 0.3391553, 2.0161166, -0.5227083,
            1.0387988, 0.5757756, 0.3872539, 1.3080978, 1.0476432, 1.5592999,
            1.442652, 0.8352414, 2.0351648, -0.2508462, 0.9940659, 0.6681031,
            0.3000003, 1.2807356, 0.7614487, 2.8504376, 1.2861738, 1.8274136,
            2.0732617, 0.2928779, 0.9046002, 0.8527579, 0.125493, 1.2260112,
            0.6183515, 3.4960065, 1.2079349, 2.3234997, 2.09231, 0.5647399,
            0.8598673, 0.9450854, 0.0382394, 1.1986489
        ]);
    });
    it('batch of 2, simple, alignCorners=false, ' +
        'halfPixelCenters=true', async () => {
        const input = tf.tensor4d([2, 2, 4, 4, 3, 3, 5, 5], [2, 2, 2, 1]);
        const output = input.resizeBilinear([3, 3], false /* alignCorners */, true);
        expectArraysClose(await output.data(), [2, 2, 2, 3, 3, 3, 4, 4, 4, 3, 3, 3, 4, 4, 4, 5, 5, 5]);
    });
    it('target width = 1, alignCorners=false, ' +
        'halfPixelCenters=true', async () => {
        const input = tf.tensor3d([
            [
                [120.68856811523438, 134.51638793945312, 83.03671264648438],
                [121.58008575439453, 113.28836059570312, 136.3172149658203],
                [79.38370513916016, 101.87127685546875, 104.54979705810547],
                [96.31678771972656, 111.77168273925781, 83.73509979248047]
            ],
            [
                [119.45088195800781, 88.98846435546875, 97.47553253173828],
                [117.5562973022461, 108.26356506347656, 99.62212371826172],
                [136.62701416015625, 94.10433197021484, 80.97366333007812],
                [83.61205291748047, 90.60148620605469, 81.82512664794922]
            ],
            [
                [103.0362777709961, 123.1098403930664, 125.62944030761719],
                [92.2915267944336, 103.15729522705078, 119.18060302734375],
                [102.93293762207031, 117.821044921875, 99.40152740478516],
                [96.32952117919922, 105.80963134765625, 104.8491439819336]
            ],
            [
                [104.87507629394531, 134.0189208984375, 111.02627563476562],
                [85.4534683227539, 107.68426513671875, 103.03722381591797],
                [89.70533752441406, 98.25298309326172, 78.42916870117188],
                [113.6744613647461, 95.8189697265625, 122.75005340576172]
            ]
        ]);
        const output = input.resizeBilinear([3, 1], false, true);
        const expected = [
            104.917, 106.514, 115.411, 112.352, 105.837, 99.7945, 89.2515, 104.222,
            93.8262
        ];
        expectArraysClose(await output.data(), expected);
        expect(output.shape).toEqual([3, 1, 3]);
    });
    it('matches tensorflow w/ random numbers alignCorners=false', async () => {
        const input = tf.tensor3d([
            1.19074044, 0.91373104, 2.01611669, -0.52270832, 0.38725395,
            1.30809779, 0.61835143, 3.49600659, 2.09230986, 0.56473997,
            0.03823943, 1.19864896
        ], [2, 3, 2]);
        const output = input.resizeBilinear([4, 5], false);
        expectArraysClose(await output.data(), [
            1.19074047, 0.91373104, 1.68596613, 0.05186744, 1.69034398, -0.15654698,
            0.7130264, 0.94193673, 0.38725394, 1.30809784, 0.9045459, 2.20486879,
            1.59434628, 0.89455694, 1.68591988, 0.26748738, 0.58103991, 1.00690198,
            0.21274668, 1.25337338, 0.6183514, 3.49600649, 1.50272655, 1.73724651,
            1.68149579, 0.69152176, 0.44905344, 1.07186723, 0.03823943, 1.19864893,
            0.6183514, 3.49600649, 1.50272655, 1.73724651, 1.68149579, 0.69152176,
            0.44905344, 1.07186723, 0.03823943, 1.19864893
        ]);
    });
    it('matches tensorflow w/ random numbers alignCorners=true', async () => {
        const input = tf.tensor3d([
            1.56324531, 2.13817752, 1.44398421, 1.07632684, 0.59306785,
            -0.36970865, 1.62451879, 1.8367334, 1.13944798, 2.01993218,
            2.01919952, 2.67524054
        ], [2, 3, 2]);
        const output = input.resizeBilinear([4, 5], true);
        expectArraysClose(await output.data(), [
            1.5632453, 2.13817763, 1.50361478, 1.60725224, 1.44398427, 1.07632685,
            1.01852608, 0.35330909, 0.59306782, -0.36970866, 1.58366978, 2.03769612,
            1.46307099, 1.71427906, 1.3424722, 1.39086199, 1.20545864, 1.01806819,
            1.06844509, 0.6452744, 1.60409427, 1.93721485, 1.42252707, 1.82130599,
            1.24096, 1.70539713, 1.3923912, 1.68282723, 1.54382229, 1.66025746,
            1.62451875, 1.83673346, 1.38198328, 1.92833281, 1.13944793, 2.01993227,
            1.57932377, 2.34758639, 2.01919961, 2.67524052
        ]);
    });
    it('batch of 2, simple, alignCorners=true', async () => {
        const input = tf.tensor4d([2, 2, 4, 4, 3, 3, 5, 5], [2, 2, 2, 1]);
        const output = input.resizeBilinear([3, 3], true /* alignCorners */);
        expectArraysClose(await output.data(), [2, 2, 2, 3, 3, 3, 4, 4, 4, 3, 3, 3, 4, 4, 4, 5, 5, 5]);
    });
    it('target width = 1, alignCorners=true', async () => {
        const input = tf.tensor3d([
            [
                [120.68856811523438, 134.51638793945312, 83.03671264648438],
                [121.58008575439453, 113.28836059570312, 136.3172149658203],
                [79.38370513916016, 101.87127685546875, 104.54979705810547],
                [96.31678771972656, 111.77168273925781, 83.73509979248047]
            ],
            [
                [119.45088195800781, 88.98846435546875, 97.47553253173828],
                [117.5562973022461, 108.26356506347656, 99.62212371826172],
                [136.62701416015625, 94.10433197021484, 80.97366333007812],
                [83.61205291748047, 90.60148620605469, 81.82512664794922]
            ],
            [
                [103.0362777709961, 123.1098403930664, 125.62944030761719],
                [92.2915267944336, 103.15729522705078, 119.18060302734375],
                [102.93293762207031, 117.821044921875, 99.40152740478516],
                [96.32952117919922, 105.80963134765625, 104.8491439819336]
            ],
            [
                [104.87507629394531, 134.0189208984375, 111.02627563476562],
                [85.4534683227539, 107.68426513671875, 103.03722381591797],
                [89.70533752441406, 98.25298309326172, 78.42916870117188],
                [113.6744613647461, 95.8189697265625, 122.75005340576172]
            ]
        ]);
        const output = input.resizeBilinear([3, 1], true);
        const expected = [
            120.68857, 134.51639, 83.03671, 111.243576, 106.04915, 111.55249,
            104.87508, 134.01892, 111.026276
        ];
        expectArraysClose(await output.data(), expected);
        expect(output.shape).toEqual([3, 1, 3]);
    });
    it('target height = 1, alignCorners=true', async () => {
        const input = tf.tensor3d([
            [
                [120.68856811523438, 134.51638793945312, 83.03671264648438],
                [121.58008575439453, 113.28836059570312, 136.3172149658203],
                [79.38370513916016, 101.87127685546875, 104.54979705810547],
                [96.31678771972656, 111.77168273925781, 83.73509979248047]
            ],
            [
                [119.45088195800781, 88.98846435546875, 97.47553253173828],
                [117.5562973022461, 108.26356506347656, 99.62212371826172],
                [136.62701416015625, 94.10433197021484, 80.97366333007812],
                [83.61205291748047, 90.60148620605469, 81.82512664794922]
            ],
            [
                [103.0362777709961, 123.1098403930664, 125.62944030761719],
                [92.2915267944336, 103.15729522705078, 119.18060302734375],
                [102.93293762207031, 117.821044921875, 99.40152740478516],
                [96.32952117919922, 105.80963134765625, 104.8491439819336]
            ],
            [
                [104.87507629394531, 134.0189208984375, 111.02627563476562],
                [85.4534683227539, 107.68426513671875, 103.03722381591797],
                [89.70533752441406, 98.25298309326172, 78.42916870117188],
                [113.6744613647461, 95.8189697265625, 122.75005340576172]
            ]
        ]);
        const output = input.resizeBilinear([1, 3], true);
        const expected = [
            120.68857, 134.51639, 83.03671, 100.481895, 107.57982, 120.4335, 96.31679,
            111.77168, 83.7351
        ];
        expectArraysClose(await output.data(), expected);
        expect(output.shape).toEqual([1, 3, 3]);
    });
    it('throws when passed a non-tensor', () => {
        const e = /Argument 'images' passed to 'resizeBilinear' must be a Tensor/;
        expect(() => tf.image.resizeBilinear({}, [
            1, 1
        ])).toThrowError(e);
    });
    it('accepts a tensor-like object', async () => {
        const input = [[[2], [2]], [[4], [4]]]; // 2x2x1
        const output = tf.image.resizeBilinear(input, [3, 3], false);
        expectArraysClose(await output.data(), [2, 2, 2, 10 / 3, 10 / 3, 10 / 3, 4, 4, 4]);
    });
});
describeWithFlags('resizeBilinear gradients', ALL_ENVS, () => {
    it('greyscale: upscale, same aspect ratio', async () => {
        const input = tf.tensor3d([[[100.0], [50.0]], [[60.0], [20.0]]]);
        const dy = tf.tensor3d([
            [[1.0], [2.0], [3.0], [4.0]], [[5.0], [6.0], [7.0], [8.0]],
            [[9.0], [10.0], [11.0], [12.0]], [[13.0], [14.0], [15.0], [16.0]]
        ]);
        const size = [4, 4];
        const alignCorners = false;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [6.0, 17.0, 38.0, 75.0];
        expectArraysClose(await output.data(), expected);
    });
    it('with clones, greyscale: upscale, same aspect ratio', async () => {
        const input = tf.tensor3d([[[100.0], [50.0]], [[60.0], [20.0]]]);
        const dy = tf.tensor3d([
            [[1.0], [2.0], [3.0], [4.0]], [[5.0], [6.0], [7.0], [8.0]],
            [[9.0], [10.0], [11.0], [12.0]], [[13.0], [14.0], [15.0], [16.0]]
        ]);
        const size = [4, 4];
        const alignCorners = false;
        const g = tf.grad((i) => tf.image.resizeBilinear(i.clone(), size, alignCorners).clone());
        const output = g(input, dy);
        const expected = [6.0, 17.0, 38.0, 75.0];
        expectArraysClose(await output.data(), expected);
    });
    it('greyscale: upscale, same aspect ratio, align corners', async () => {
        const input = tf.tensor3d([[[100.0], [50.0]], [[60.0], [20.0]]]);
        const dy = tf.tensor3d([
            [[1.0], [2.0], [3.0], [4.0]], [[5.0], [6.0], [7.0], [8.0]],
            [[9.0], [10.0], [11.0], [12.0]], [[13.0], [14.0], [15.0], [16.0]]
        ]);
        const size = [4, 4];
        const alignCorners = true;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [17.333330154418945, 23.999998092651367, 44.0, 50.66666793823242];
        expectArraysClose(await output.data(), expected);
    });
    it('greyscale: upscale, taller than wider', async () => {
        const input = tf.tensor3d([[[100.0], [50.0]], [[60.0], [20.0]]]);
        const dy = tf.tensor3d([
            [[1.0], [2.0], [3.0], [4.0]], [[5.0], [6.0], [7.0], [8.0]],
            [[9.0], [10.0], [11.0], [12.0]], [[13.0], [14.0], [15.0], [16.0]],
            [[17.0], [18.0], [19.0], [20.0]], [[21.0], [22.0], [23.0], [24.0]],
            [[25.0], [26.0], [27.0], [28.0]], [[29.0], [30.0], [31.0], [32.0]],
            [[33.0], [34.0], [35.0], [36.0]]
        ]);
        const size = [9, 4];
        const alignCorners = false;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [
            25.55555534362793, 55.5555534362793, 208.44444274902344, 376.4444274902344
        ];
        expectArraysClose(await output.data(), expected);
    });
    it('greyscale: upscale, taller than wider, align corners', async () => {
        const input = tf.tensor3d([[[100.0], [50.0]], [[60.0], [20.0]]]);
        const dy = tf.tensor3d([
            [[1.0], [2.0], [3.0], [4.0]], [[5.0], [6.0], [7.0], [8.0]],
            [[9.0], [10.0], [11.0], [12.0]], [[13.0], [14.0], [15.0], [16.0]],
            [[17.0], [18.0], [19.0], [20.0]], [[21.0], [22.0], [23.0], [24.0]],
            [[25.0], [26.0], [27.0], [28.0]], [[29.0], [30.0], [31.0], [32.0]],
            [[33.0], [34.0], [35.0], [36.0]]
        ]);
        const size = [9, 4];
        const alignCorners = true;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [99.0, 114.0, 219.00001525878906, 233.99998474121094];
        expectArraysClose(await output.data(), expected);
    });
    it('greyscale: upscale, wider than taller', async () => {
        const input = tf.tensor3d([[[100.0], [50.0]], [[60.0], [20.0]]]);
        const dy = tf.tensor3d([
            [[1.0], [2.0], [3.0], [4.0], [5.0], [6.0], [7.0]],
            [[8.0], [9.0], [10.0], [11.0], [12.0], [13.0], [14.0]],
            [[15.0], [16.0], [17.0], [18.0], [19.0], [20.0], [21.0]],
            [[22.0], [23.0], [24.0], [25.0], [26.0], [27.0], [28.0]]
        ]);
        const size = [4, 7];
        const alignCorners = false;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [
            14.428570747375488, 52.07142639160156, 98.71427917480469,
            240.78573608398438
        ];
        expectArraysClose(await output.data(), expected);
    });
    it('greyscale: upscale, wider than taller, align corners', async () => {
        const input = tf.tensor3d([[[100.0], [50.0]], [[60.0], [20.0]]]);
        const dy = tf.tensor3d([
            [[1.0], [2.0], [3.0], [4.0], [5.0], [6.0], [7.0]],
            [[8.0], [9.0], [10.0], [11.0], [12.0], [13.0], [14.0]],
            [[15.0], [16.0], [17.0], [18.0], [19.0], [20.0], [21.0]],
            [[22.0], [23.0], [24.0], [25.0], [26.0], [27.0], [28.0]]
        ]);
        const size = [4, 7];
        const alignCorners = true;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [51.33332824707031, 70.0, 133.0, 151.66668701171875];
        expectArraysClose(await output.data(), expected);
    });
    // Downscale
    it('greyscale: downscale, same aspect ratio', async () => {
        const input = tf.tensor3d([
            [[100.0], [50.0], [25.0], [10.0]], [[60.0], [20.0], [80.0], [20.0]],
            [[40.0], [15.0], [200.0], [203.0]], [[40.0], [10.0], [230.0], [200.0]]
        ]);
        const dy = tf.tensor3d([[[1.0], [2.0]], [[3.0], [4.0]]]);
        const size = [2, 2];
        const alignCorners = false;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [
            1.0, 0.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.0, 0.0, 4.0, 0.0, 0.0, 0.0, 0.0,
            0.0
        ];
        expectArraysClose(await output.data(), expected);
    });
    it('greyscale: downscale, same aspect ratio, align corners', async () => {
        const input = tf.tensor3d([
            [[100.0], [50.0], [25.0], [10.0]], [[60.0], [20.0], [80.0], [20.0]],
            [[40.0], [15.0], [200.0], [203.0]], [[40.0], [10.0], [230.0], [200.0]]
        ]);
        const dy = tf.tensor3d([[[1.0], [2.0]], [[3.0], [4.0]]]);
        const size = [2, 2];
        const alignCorners = true;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [
            1.0, 0.0, 0.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.0, 0.0, 0.0,
            4.0
        ];
        expectArraysClose(await output.data(), expected);
    });
    it('greyscale: downscale, taller than wider', async () => {
        const input = tf.tensor3d([
            [[100.0], [50.0], [25.0], [10.0]], [[60.0], [20.0], [80.0], [20.0]],
            [[40.0], [15.0], [200.0], [203.0]], [[40.0], [10.0], [230.0], [200.0]]
        ]);
        const dy = tf.tensor3d([[[1.0], [2.0]], [[3.0], [4.0]], [[5.0], [6.0]]]);
        const size = [3, 2];
        const alignCorners = false;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [
            1.0, 0.0, 2.0, 0.0, 1.9999998807907104, 0.0, 2.6666665077209473, 0.0,
            2.6666665077209473, 0.0, 3.3333330154418945, 0.0, 3.333333730697632, 0.0,
            4.000000476837158, 0.0
        ];
        expectArraysClose(await output.data(), expected);
    });
    it('greyscale: downscale, taller than wider, align corners', async () => {
        const input = tf.tensor3d([
            [[100.0], [50.0], [25.0], [10.0]], [[60.0], [20.0], [80.0], [20.0]],
            [[40.0], [15.0], [200.0], [203.0]], [[40.0], [10.0], [230.0], [200.0]]
        ]);
        const dy = tf.tensor3d([[[1.0], [2.0]], [[3.0], [4.0]], [[5.0], [6.0]]]);
        const size = [3, 2];
        const alignCorners = true;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [
            1.0, 0.0, 0.0, 2.0, 1.5, 0.0, 0.0, 2.0, 1.5, 0.0, 0.0, 2.0, 5.0, 0.0, 0.0,
            6.0
        ];
        expectArraysClose(await output.data(), expected);
    });
    it('greyscale: downscale, wider than taller', async () => {
        const input = tf.tensor3d([
            [[100.0], [50.0], [25.0], [10.0]], [[60.0], [20.0], [80.0], [20.0]],
            [[40.0], [15.0], [200.0], [203.0]], [[40.0], [10.0], [230.0], [200.0]]
        ]);
        const dy = tf.tensor3d([[[1.0], [2.0], [3.0]], [[4.0], [5.0], [6.0]]]);
        const size = [2, 3];
        const alignCorners = false;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [
            1.0, 1.3333332538604736, 1.6666665077209473, 2.000000238418579, 0.0, 0.0,
            0.0, 0.0, 4.0, 3.3333330154418945, 3.6666665077209473, 4.000000476837158,
            0.0, 0.0, 0.0, 0.0
        ];
        expectArraysClose(await output.data(), expected);
    });
    it('greyscale: downscale, wider than taller, align corners', async () => {
        const input = tf.tensor3d([
            [[100.0], [50.0], [25.0], [10.0]], [[60.0], [20.0], [80.0], [20.0]],
            [[40.0], [15.0], [200.0], [203.0]], [[40.0], [10.0], [230.0], [200.0]]
        ]);
        const dy = tf.tensor3d([[[1.0], [2.0], [3.0]], [[4.0], [5.0], [6.0]]]);
        const size = [2, 3];
        const alignCorners = true;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [
            1.0, 1.0, 1.0, 3.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 4.0, 2.5, 2.5,
            6.0
        ];
        expectArraysClose(await output.data(), expected);
    });
    // No Op
    it('greyscale: same size', async () => {
        const input = tf.tensor3d([[[100.0], [50.0]], [[60.0], [20.0]]]);
        const dy = tf.tensor3d([[[1.0], [2.0]], [[3.0], [4.0]]]);
        const size = [2, 2];
        const alignCorners = false;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [1.0, 2.0, 3.0, 4.0];
        expectArraysClose(await output.data(), expected);
    });
    it('greyscale: same size, align corners', async () => {
        const input = tf.tensor3d([[[100.0], [50.0]], [[60.0], [20.0]]]);
        const dy = tf.tensor3d([[[1.0], [2.0]], [[3.0], [4.0]]]);
        const size = [2, 2];
        const alignCorners = true;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [1.0, 2.0, 3.0, 4.0];
        expectArraysClose(await output.data(), expected);
    });
    // 3 channel upscale
    it('color: upscale, wider than taller', async () => {
        const input = tf.tensor3d([
            [
                [115.11029815673828, 111.90936279296875, 66.87433624267578],
                [72.03849029541016, 81.86637878417969, 119.53585815429688]
            ],
            [
                [68.555419921875, 97.49642181396484, 116.90741729736328],
                [128.69467163085938, 86.78314208984375, 104.3116683959961]
            ]
        ]);
        const dy = tf.tensor3d([
            [
                [1.0, 2.0, 3.0], [4.0, 5.0, 6.0], [7.0, 8.0, 9.0], [10.0, 11.0, 12.0],
                [13.0, 14.0, 15.0]
            ],
            [
                [16.0, 17.0, 18.0], [19.0, 20.0, 21.0], [22.0, 23.0, 24.0],
                [25.0, 26.0, 27.0], [28.0, 29.0, 30.0]
            ],
            [
                [31.0, 32.0, 33.0], [34.0, 35.0, 36.0], [37.0, 38.0, 39.0],
                [40.0, 41.0, 42.0], [43.0, 44.0, 45.0]
            ]
        ]);
        const size = [3, 5];
        const alignCorners = false;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [
            15.399999618530273, 17.799999237060547, 20.19999885559082,
            56.26666259765625, 60.533329010009766, 64.79999542236328,
            80.00000762939453, 83.0, 86.0, 178.33334350585938, 183.66668701171875,
            189.00001525878906
        ];
        expectArraysClose(await output.data(), expected);
    });
    it('color: upscale, wider than taller, align corners', async () => {
        const input = tf.tensor3d([
            [
                [115.11029815673828, 111.90936279296875, 66.87433624267578],
                [72.03849029541016, 81.86637878417969, 119.53585815429688]
            ],
            [
                [68.555419921875, 97.49642181396484, 116.90741729736328],
                [128.69467163085938, 86.78314208984375, 104.3116683959961]
            ]
        ]);
        const dy = tf.tensor3d([
            [
                [1.0, 2.0, 3.0], [4.0, 5.0, 6.0], [7.0, 8.0, 9.0], [10.0, 11.0, 12.0],
                [13.0, 14.0, 15.0]
            ],
            [
                [16.0, 17.0, 18.0], [19.0, 20.0, 21.0], [22.0, 23.0, 24.0],
                [25.0, 26.0, 27.0], [28.0, 29.0, 30.0]
            ],
            [
                [31.0, 32.0, 33.0], [34.0, 35.0, 36.0], [37.0, 38.0, 39.0],
                [40.0, 41.0, 42.0], [43.0, 44.0, 45.0]
            ]
        ]);
        const size = [3, 5];
        const alignCorners = true;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [
            33.75, 37.5, 41.25, 56.25, 60.0, 63.75, 108.75, 112.5, 116.25, 131.25,
            135.0, 138.75
        ];
        expectArraysClose(await output.data(), expected);
    });
    // 3 channel downscale
    it('color: downscale, taller than wider', async () => {
        const input = tf.tensor3d([
            [
                [120.68856811523438, 134.51638793945312, 83.03671264648438],
                [121.58008575439453, 113.28836059570312, 136.3172149658203],
                [79.38370513916016, 101.87127685546875, 104.54979705810547],
                [96.31678771972656, 111.77168273925781, 83.73509979248047]
            ],
            [
                [119.45088195800781, 88.98846435546875, 97.47553253173828],
                [117.5562973022461, 108.26356506347656, 99.62212371826172],
                [136.62701416015625, 94.10433197021484, 80.97366333007812],
                [83.61205291748047, 90.60148620605469, 81.82512664794922]
            ],
            [
                [103.0362777709961, 123.1098403930664, 125.62944030761719],
                [92.2915267944336, 103.15729522705078, 119.18060302734375],
                [102.93293762207031, 117.821044921875, 99.40152740478516],
                [96.32952117919922, 105.80963134765625, 104.8491439819336]
            ],
            [
                [104.87507629394531, 134.0189208984375, 111.02627563476562],
                [85.4534683227539, 107.68426513671875, 103.03722381591797],
                [89.70533752441406, 98.25298309326172, 78.42916870117188],
                [113.6744613647461, 95.8189697265625, 122.75005340576172]
            ]
        ]);
        const dy = tf.tensor3d([[[1.0, 2.0, 3.0]], [[4.0, 5.0, 6.0]], [[7.0, 8.0, 9.0]]]);
        const size = [3, 1];
        const alignCorners = false;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [
            1.0,
            2.0,
            3.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            2.6666665077209473,
            3.3333330154418945,
            3.999999761581421,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            3.666666269302368,
            4.3333330154418945,
            4.999999523162842,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            4.6666669845581055,
            5.333333969116211,
            6.000000953674316,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0
        ];
        expectArraysClose(await output.data(), expected);
    });
    it('color: downscale, width = 1, align corners', async () => {
        const input = tf.tensor3d([
            [
                [120.68856811523438, 134.51638793945312, 83.03671264648438],
                [121.58008575439453, 113.28836059570312, 136.3172149658203],
                [79.38370513916016, 101.87127685546875, 104.54979705810547],
                [96.31678771972656, 111.77168273925781, 83.73509979248047]
            ],
            [
                [119.45088195800781, 88.98846435546875, 97.47553253173828],
                [117.5562973022461, 108.26356506347656, 99.62212371826172],
                [136.62701416015625, 94.10433197021484, 80.97366333007812],
                [83.61205291748047, 90.60148620605469, 81.82512664794922]
            ],
            [
                [103.0362777709961, 123.1098403930664, 125.62944030761719],
                [92.2915267944336, 103.15729522705078, 119.18060302734375],
                [102.93293762207031, 117.821044921875, 99.40152740478516],
                [96.32952117919922, 105.80963134765625, 104.8491439819336]
            ],
            [
                [104.87507629394531, 134.0189208984375, 111.02627563476562],
                [85.4534683227539, 107.68426513671875, 103.03722381591797],
                [89.70533752441406, 98.25298309326172, 78.42916870117188],
                [113.6744613647461, 95.8189697265625, 122.75005340576172]
            ]
        ]);
        const dy = tf.tensor3d([[[1.0, 2.0, 3.0]], [[4.0, 5.0, 6.0]], [[7.0, 8.0, 9.0]]]);
        const size = [3, 1];
        const alignCorners = true;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [
            1.0, 2.0, 3.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            2.0, 2.5, 3.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            2.0, 2.5, 3.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            7.0, 8.0, 9.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
        ];
        expectArraysClose(await output.data(), expected);
    });
    it('color: downscale, height = 1, align corners', async () => {
        const input = tf.tensor3d([
            [
                [120.68856811523438, 134.51638793945312, 83.03671264648438],
                [121.58008575439453, 113.28836059570312, 136.3172149658203],
                [79.38370513916016, 101.87127685546875, 104.54979705810547],
                [96.31678771972656, 111.77168273925781, 83.73509979248047]
            ],
            [
                [119.45088195800781, 88.98846435546875, 97.47553253173828],
                [117.5562973022461, 108.26356506347656, 99.62212371826172],
                [136.62701416015625, 94.10433197021484, 80.97366333007812],
                [83.61205291748047, 90.60148620605469, 81.82512664794922]
            ],
            [
                [103.0362777709961, 123.1098403930664, 125.62944030761719],
                [92.2915267944336, 103.15729522705078, 119.18060302734375],
                [102.93293762207031, 117.821044921875, 99.40152740478516],
                [96.32952117919922, 105.80963134765625, 104.8491439819336]
            ],
            [
                [104.87507629394531, 134.0189208984375, 111.02627563476562],
                [85.4534683227539, 107.68426513671875, 103.03722381591797],
                [89.70533752441406, 98.25298309326172, 78.42916870117188],
                [113.6744613647461, 95.8189697265625, 122.75005340576172]
            ]
        ]);
        const dy = tf.tensor3d([[[1., 2., 3.], [4., 5., 6.], [7., 8., 9.]]]);
        const size = [1, 3];
        const alignCorners = true;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [
            1., 2., 3., 2., 2.5, 3., 2., 2.5, 3., 7., 8., 9., 0., 0., 0., 0.,
            0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0.,
            0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0.
        ];
        expectArraysClose(await output.data(), expected);
    });
    it('color: downscale, taller than wider, align corners', async () => {
        const input = tf.tensor3d([
            [
                [120.68856811523438, 134.51638793945312, 83.03671264648438],
                [121.58008575439453, 113.28836059570312, 136.3172149658203],
                [79.38370513916016, 101.87127685546875, 104.54979705810547],
                [96.31678771972656, 111.77168273925781, 83.73509979248047]
            ],
            [
                [119.45088195800781, 88.98846435546875, 97.47553253173828],
                [117.5562973022461, 108.26356506347656, 99.62212371826172],
                [136.62701416015625, 94.10433197021484, 80.97366333007812],
                [83.61205291748047, 90.60148620605469, 81.82512664794922]
            ],
            [
                [103.0362777709961, 123.1098403930664, 125.62944030761719],
                [92.2915267944336, 103.15729522705078, 119.18060302734375],
                [102.93293762207031, 117.821044921875, 99.40152740478516],
                [96.32952117919922, 105.80963134765625, 104.8491439819336]
            ],
            [
                [104.87507629394531, 134.0189208984375, 111.02627563476562],
                [85.4534683227539, 107.68426513671875, 103.03722381591797],
                [89.70533752441406, 98.25298309326172, 78.42916870117188],
                [113.6744613647461, 95.8189697265625, 122.75005340576172]
            ]
        ]);
        const dy = tf.tensor3d([
            [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]], [[7.0, 8.0, 9.0], [10.0, 11.0, 12.0]],
            [[13.0, 14.0, 15.0], [16.0, 17.0, 18.0]]
        ]);
        const size = [3, 2];
        const alignCorners = true;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [
            1.0, 2.0, 3.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 4.0, 5.0, 6.0,
            3.5, 4.0, 4.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 5.0, 5.5, 6.0,
            3.5, 4.0, 4.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 5.0, 5.5, 6.0,
            13.0, 14.0, 15.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 16.0, 17.0, 18.0
        ];
        expectArraysClose(await output.data(), expected);
    });
    // 3 channel no-op
    it('color: same size', async () => {
        const input = tf.tensor3d([
            [
                [115.11029815673828, 111.90936279296875, 66.87433624267578],
                [72.03849029541016, 81.86637878417969, 119.53585815429688]
            ],
            [
                [68.555419921875, 97.49642181396484, 116.90741729736328],
                [128.69467163085938, 86.78314208984375, 104.3116683959961]
            ]
        ]);
        const dy = tf.tensor3d([
            [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]], [[7.0, 8.0, 9.0], [10.0, 11.0, 12.0]]
        ]);
        const size = [2, 2];
        const alignCorners = false;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0];
        expectArraysClose(await output.data(), expected);
    });
    it('color: same size, align corners', async () => {
        const input = tf.tensor3d([
            [
                [115.11029815673828, 111.90936279296875, 66.87433624267578],
                [72.03849029541016, 81.86637878417969, 119.53585815429688]
            ],
            [
                [68.555419921875, 97.49642181396484, 116.90741729736328],
                [128.69467163085938, 86.78314208984375, 104.3116683959961]
            ]
        ]);
        const dy = tf.tensor3d([
            [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]], [[7.0, 8.0, 9.0], [10.0, 11.0, 12.0]]
        ]);
        const size = [2, 2];
        const alignCorners = true;
        const g = tf.grad((i) => tf.image.resizeBilinear(i, size, alignCorners));
        const output = g(input, dy);
        const expected = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0];
        expectArraysClose(await output.data(), expected);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplX2JpbGluZWFyX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9pbWFnZS9yZXNpemVfYmlsaW5lYXJfdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEtBQUssRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNsQyxPQUFPLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDL0QsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFbEQsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUNqRCxFQUFFLENBQUMsMkJBQTJCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDekMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFbkQsaUJBQWlCLENBQ2IsTUFBTSxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsa0NBQWtDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDaEQsTUFBTSxL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WUFBWSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUV4RSxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sUUFBUSxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFekMsaUJBQWlCLENBQUMsTUFBTSxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDbkQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0RBQXNELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDcEUsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQztZQUNyQixDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUQsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2xFLENBQUMsQ0FBQztRQUVILE1BQU0sSUFBSSxHQUFxQixDQUFDLENBQUMsRUFBRSxD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QUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3BFLGlCQUFpQixDQUFDLE1BQU0sTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAqIGFzIHRmIGZyb20gJy4uLy4uL2luZGV4JztcbmltcG9ydCB7QUxMX0VOVlMsIGRlc2NyaWJlV2l0aEZsYWdzfSBmcm9tICcuLi8uLi9qYXNtaW5lX3V0aWwnO1xuaW1wb3J0IHtleHBlY3RBcnJheXNDbG9zZX0gZnJvbSAnLi4vLi4vdGVzdF91dGlsJztcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ3Jlc2l6ZUJpbGluZWFyJywgQUxMX0VOVlMsICgpID0+IHtcbiAgaXQoJ3NpbXBsZSBhbGlnbkNvcm5lcnM9ZmFsc2UnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSB0Zi50ZW5zb3IzZChbMiwgMiwgNCwgNF0sIFsyLCAyLCAxXSk7XG4gICAgY29uc3Qgb3V0cHV0ID0gaW5wdXQucmVzaXplQmlsaW5lYXIoWzMsIDNdLCBmYWxzZSk7XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShcbiAgICAgICAgYXdhaXQgb3V0cHV0LmRhdGEoKSwgWzIsIDIsIDIsIDEwIC8gMywgMTAgLyAzLCAxMCAvIDMsIDQsIDQsIDRdKTtcbiAgfSk7XG5cbiAgaXQoJzV4NS1iaWxpbmVhciwgbm8gY2hhbmdlIGluIHNoYXBlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGltYWdlOiB0Zi5UZW5zb3I0RCA9IHRmLm9uZXMoWzEsIDUsIDUsIDNdKTtcblxuICAgIGNvbnN0IGFsaWduQ29ybmVycyA9IGZhbHNlO1xuICAgIGNvbnN0IG91dHB1dCA9IHRmLmltYWdlLnJlc2l6ZUJpbGluZWFyKGltYWdlLCBbNSwgNV0sIGFsaWduQ29ybmVycyk7XG5cbiAgICBleHBlY3Qob3V0cHV0LnNoYXBlKS50b0VxdWFsKFsxLCA1LCA1LCAzXSk7XG4gICAgZXhwZWN0KG91dHB1dC5kdHlwZSkudG9CZSgnZmxvYXQzMicpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IG91dHB1dC5kYXRhKCksIGF3YWl0IGltYWdlLmRhdGEoKSk7XG4gIH0pO1xuXG4gIGl0KCdzaW1wbGUgYWxpZ25Db3JuZXJzPXRydWUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSB0Zi50ZW5zb3IzZChbMiwgMiwgNCwgNF0sIFsyLCAyLCAxXSk7XG4gICAgY29uc3Qgb3V0cHV0ID0gaW5wdXQucmVzaXplQmlsaW5lYXIoWzMsIDNdLCB0cnVlKTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IG91dHB1dC5kYXRhKCksIFsyLCAyLCAyLCAzLCAzLCAzLCA0LCA0LCA0XSk7XG4gIH0pO1xuXG4gIGl0KCd3b3JrcyB3aGVuIHJvd3MgYXJlIGNvcGllZCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRmLnRlbnNvcjNkKFxuICAgICAgICBbXG4gICAgICAgICAgMS41NjMyNDUzMSwgMi4xMzgxNzc1MiwgMS40NDM5ODQyMSwgMS4wNzYzMjY4NCwgMC41OTMwNjc4NSxcbiAgICAgICAgICAtMC4zNjk3MDg2NSwgMS42MjQ1MTg3OSwgMS44MzY3MzM0LCAxLjEzOTQ0Nzk4LCAyLjAxOTkzMjE4LFxuICAgICAgICAgIDIuMDE5MTk5NTIsIDIuNjc1MjQwNTRcbiAgICAgICAgXSxcbiAgICAgICAgWzIsIDMsIDJdKTtcbiAgICBjb25zdCBvdXRwdXQgPSBpbnB1dC5yZXNpemVCaWxpbmVhcihbNCwgM10sIGZhbHNlKTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IG91dHB1dC5kYXRhKCksIFtcbiAgICAgIDEuNTYzMjQ1MywgIDIuMTM4MTc3NjMsIDEuNDQzOTg0MTUsIDEuMDc2MzI2ODUsIDAuNTkzMDY3ODIsIC0wLjM2OTcwODY2LFxuICAgICAgMS41OTM4ODIwOCwgMS45ODc0NTU0OSwgMS4yOTE3MTYxLCAgMS41NDgxMjk1NiwgMS4zMDYxMzM3NSwgMS4xNTI3NjU4NyxcbiAgICAgIDEuNjI0NTE4NzUsIDEuODM2NzMzMzQsIDEuMTM5NDQ3OTMsIDIuMDE5OTMyMjcsIDIuMDE5MTk5NjEsIDIuNjc1MjQwNTIsXG4gICAgICAxLjYyNDUxODc1LCAxLjgzNjczMzM0LCAxLjEzOTQ0NzkzLCAyLjAxOTkzMjI3LCAyLjAxOTE5OTYxLCAyLjY3NTI0MDUyXG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCd3b3JrcyBmb3IgaW50cycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRmLnRlbnNvcjNkKFsxLCAyLCAzLCA0LCA1XSwgWzEsIDUsIDFdLCAnaW50MzInKTtcbiAgICBjb25zdCBvdXRwdXQgPSBpbnB1dC5yZXNpemVCaWxpbmVhcihbMSwgMTBdLCBmYWxzZSk7XG5cbiAgICBleHBlY3Qob3V0cHV0LnNoYXBlKS50b0VxdWFsKFsxLCAxMCwgMV0pO1xuICAgIGV4cGVjdChvdXRwdXQuZHR5cGUpLnRvQmUoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShcbiAgICAgICAgYXdhaXQgb3V0cHV0LmRhdGEoKSwgWzEsIDEuNSwgMiwgMi41LCAzLCAzLjUsIDQsIDQuNSwgNSwgNV0pO1xuICB9KTtcblxuICBpdCgnbWF0Y2hlcyB0ZW5zb3JmbG93IHcvIHJhbmRvbSBudW1iZXJzIGFsaWduQ29ybmVycz1mYWxzZSwgJyArXG4gICAgICAgICAnaGFsZlBpeGVsQ2VudGVycz10cnVlJyxcbiAgICAgYXN5bmMgKCkgPT4ge1xuICAgICAgIGNvbnN0IGlucHV0ID0gdGYudGVuc29yM2QoXG4gICAgICAgICAgIFtcbiAgICAgICAgICAgICAxLjE5MDc0MDQ0LCAwLjkxMzczMTA0LCAyLjAxNjExNjY5LCAtMC41MjI3MDgzMiwgMC4zODcyNTM5NSxcbiAgICAgICAgICAgICAxLjMwODA5Nzc5LCAwLjYxODM1MTQzLCAzLjQ5NjAwNjU5LCAyLjA5MjMwOTg2LCAwLjU2NDczOTk3LFxuICAgICAgICAgICAgIDAuMDM4MjM5NDMsIDEuMTk4NjQ4OTZcbiAgICAgICAgICAgXSxcbiAgICAgICAgICAgWzIsIDMsIDJdKTtcbiAgICAgICBjb25zdCBvdXRwdXQgPSBpbnB1dC5yZXNpemVCaWxpbmVhcihbNCwgNV0sIGZhbHNlLCB0cnVlKTtcblxuICAgICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IG91dHB1dC5kYXRhKCksIFtcbiAgICAgICAgIDEuMTkwNzQwNSwgMC45MTM3MzEsICAxLjUyMDg5MSwgIDAuMzM5MTU1MywgIDIuMDE2MTE2NiwgLTAuNTIyNzA4MyxcbiAgICAgICAgIDEuMDM4Nzk4OCwgMC41NzU3NzU2LCAwLjM4NzI1MzksIDEuMzA4MDk3OCwgIDEuMDQ3NjQzMiwgMS41NTkyOTk5LFxuICAgICAgICAgMS40NDI2NTIsICAwLjgzNTI0MTQsIDIuMDM1MTY0OCwgLTAuMjUwODQ2MiwgMC45OTQwNjU5LCAwLjY2ODEwMzEsXG4gICAgICAgICAwLjMwMDAwMDMsIDEuMjgwNzM1NiwgMC43NjE0NDg3LCAyLjg1MDQzNzYsICAxLjI4NjE3MzgsIDEuODI3NDEzNixcbiAgICAgICAgIDIuMDczMjYxNywgMC4yOTI4Nzc5LCAwLjkwNDYwMDIsIDAuODUyNzU3OSwgIDAuMTI1NDkzLCAgMS4yMjYwMTEyLFxuICAgICAgICAgMC42MTgzNTE1LCAzLjQ5NjAwNjUsIDEuMjA3OTM0OSwgMi4zMjM0OTk3LCAgMi4wOTIzMSwgICAwLjU2NDczOTksXG4gICAgICAgICAwLjg1OTg2NzMsIDAuOTQ1MDg1NCwgMC4wMzgyMzk0LCAxLjE5ODY0ODlcbiAgICAgICBdKTtcbiAgICAgfSk7XG5cbiAgaXQoJ2JhdGNoIG9mIDIsIHNpbXBsZSwgYWxpZ25Db3JuZXJzPWZhbHNlLCAnICtcbiAgICAgICAgICdoYWxmUGl4ZWxDZW50ZXJzPXRydWUnLFxuICAgICBhc3luYyAoKSA9PiB7XG4gICAgICAgY29uc3QgaW5wdXQgPSB0Zi50ZW5zb3I0ZChbMiwgMiwgNCwgNCwgMywgMywgNSwgNV0sIFsyLCAyLCAyLCAxXSk7XG4gICAgICAgY29uc3Qgb3V0cHV0ID1cbiAgICAgICAgICAgaW5wdXQucmVzaXplQmlsaW5lYXIoWzMsIDNdLCBmYWxzZSAvKiBhbGlnbkNvcm5lcnMgKi8sIHRydWUpO1xuXG4gICAgICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgICAgIGF3YWl0IG91dHB1dC5kYXRhKCksXG4gICAgICAgICAgIFsyLCAyLCAyLCAzLCAzLCAzLCA0LCA0LCA0LCAzLCAzLCAzLCA0LCA0LCA0LCA1LCA1LCA1XSk7XG4gICAgIH0pO1xuXG4gIGl0KCd0YXJnZXQgd2lkdGggPSAxLCBhbGlnbkNvcm5lcnM9ZmFsc2UsICcgK1xuICAgICAgICAgJ2hhbGZQaXhlbENlbnRlcnM9dHJ1ZScsXG4gICAgIGFzeW5jICgpID0+IHtcbiAgICAgICBjb25zdCBpbnB1dCA9IHRmLnRlbnNvcjNkKFtcbiAgICAgICAgIFtcbiAgICAgICAgICAgWzEyMC42ODg1NjgxMTUyMzQzOCwgMTM0LjUxNjM4NzkzOTQ1MzEyLCA4My4wMzY3MTI2NDY0ODQzOF0sXG4gICAgICAgICAgIFsxMjEuNTgwMDg1NzU0Mzk0NTMsIDExMy4yODgzNjA1OTU3MDMxMiwgMTM2LjMxNzIxNDk2NTgyMDNdLFxuICAgICAgICAgICBbNzkuMzgzNzA1MTM5MTYwMTYsIDEwMS44NzEyNzY4NTU0Njg3NSwgMTA0LjU0OTc5NzA1ODEwNTQ3XSxcbiAgICAgICAgICAgWzk2LjMxNjc4NzcxOTcyNjU2LCAxMTEuNzcxNjgyNzM5MjU3ODEsIDgzLjczNTA5OTc5MjQ4MDQ3XVxuICAgICAgICAgXSxcbiAgICAgICAgIFtcbiAgICAgICAgICAgWzExOS40NTA4ODE5NTgwMDc4MSwgODguOTg4NDY0MzU1NDY4NzUsIDk3LjQ3NTUzMjUzMTczODI4XSxcbiAgICAgICAgICAgWzExNy41NTYyOTczMDIyNDYxLCAxMDguMjYzNTY1MDYzNDc2NTYsIDk5LjYyMjEyMzcxODI2MTcyXSxcbiAgICAgICAgICAgWzEzNi42MjcwMTQxNjAxNTYyNSwgOTQuMTA0MzMxOTcwMjE0ODQsIDgwLjk3MzY2MzMzMDA3ODEyXSxcbiAgICAgICAgICAgWzgzLjYxMjA1MjkxNzQ4MDQ3LCA5MC42MDE0ODYyMDYwNTQ2OSwgODEuODI1MTI2NjQ3OTQ5MjJdXG4gICAgICAgICBdLFxuICAgICAgICAgW1xuICAgICAgICAgICBbMTAzLjAzNjI3Nzc3MDk5NjEsIDEyMy4xMDk4NDAzOTMwNjY0LCAxMjUuNjI5NDQwMzA3NjE3MTldLFxuICAgICAgICAgICBbOTIuMjkxNTI2Nzk0NDMzNiwgMTAzLjE1NzI5NTIyNzA1MDc4LCAxMTkuMTgwNjAzMDI3MzQzNzVdLFxuICAgICAgICAgICBbMTAyLjkzMjkzNzYyMjA3MDMxLCAxMTcuODIxMDQ0OTIxODc1LCA5OS40MDE1Mjc0MDQ3ODUxNl0sXG4gICAgICAgICAgIFs5Ni4zMjk1MjExNzkxOTkyMiwgMTA1LjgwOTYzMTM0NzY1NjI1LCAxMDQuODQ5MTQzOTgxOTMzNl1cbiAgICAgICAgIF0sXG4gICAgICAgICBbXG4gICAgICAgICAgIFsxMDQuODc1MDc2MjkzOTQ1MzEsIDEzNC4wMTg5MjA4OTg0Mzc1LCAxMTEuMDI2Mjc1NjM0NzY1NjJdLFxuICAgICAgICAgICBbODUuNDUzNDY4MzIyNzUzOSwgMTA3LjY4NDI2NTEzNjcxODc1LCAxMDMuMDM3MjIzODE1OTE3OTddLFxuICAgICAgICAgICBbODkuNzA1MzM3NTI0NDE0MDYsIDk4LjI1Mjk4MzA5MzI2MTcyLCA3OC40MjkxNjg3MDExNzE4OF0sXG4gICAgICAgICAgIFsxMTMuNjc0NDYxMzY0NzQ2MSwgOTUuODE4OTY5NzI2NTYyNSwgMTIyLjc1MDA1MzQwNTc2MTcyXVxuICAgICAgICAgXVxuICAgICAgIF0pO1xuXG4gICAgICAgY29uc3Qgb3V0cHV0ID0gaW5wdXQucmVzaXplQmlsaW5lYXIoWzMsIDFdLCBmYWxzZSwgdHJ1ZSk7XG5cbiAgICAgICBjb25zdCBleHBlY3RlZCA9IFtcbiAgICAgICAgIDEwNC45MTcsIDEwNi41MTQsIDExNS40MTEsIDExMi4zNTIsIDEwNS44MzcsIDk5Ljc5NDUsIDg5LjI1MTUsIDEwNC4yMjIsXG4gICAgICAgICA5My44MjYyXG4gICAgICAgXTtcbiAgICAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBvdXRwdXQuZGF0YSgpLCBleHBlY3RlZCk7XG4gICAgICAgZXhwZWN0KG91dHB1dC5zaGFwZSkudG9FcXVhbChbMywgMSwgM10pO1xuICAgICB9KTtcblxuICBpdCgnbWF0Y2hlcyB0ZW5zb3JmbG93IHcvIHJhbmRvbSBudW1iZXJzIGFsaWduQ29ybmVycz1mYWxzZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRmLnRlbnNvcjNkKFxuICAgICAgICBbXG4gICAgICAgICAgMS4xOTA3NDA0NCwgMC45MTM3MzEwNCwgMi4wMTYxMTY2OSwgLTAuNTIyNzA4MzIsIDAuMzg3MjUzOTUsXG4gICAgICAgICAgMS4zMDgwOTc3OSwgMC42MTgzNTE0MywgMy40OTYwMDY1OSwgMi4wOTIzMDk4NiwgMC41NjQ3Mzk5NyxcbiAgICAgICAgICAwLjAzODIzOTQzLCAxLjE5ODY0ODk2XG4gICAgICAgIF0sXG4gICAgICAgIFsyLCAzLCAyXSk7XG4gICAgY29uc3Qgb3V0cHV0ID0gaW5wdXQucmVzaXplQmlsaW5lYXIoWzQsIDVdLCBmYWxzZSk7XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBvdXRwdXQuZGF0YSgpLCBbXG4gICAgICAxLjE5MDc0MDQ3LCAwLjkxMzczMTA0LCAxLjY4NTk2NjEzLCAwLjA1MTg2NzQ0LCAxLjY5MDM0Mzk4LCAtMC4xNTY1NDY5OCxcbiAgICAgIDAuNzEzMDI2NCwgIDAuOTQxOTM2NzMsIDAuMzg3MjUzOTQsIDEuMzA4MDk3ODQsIDAuOTA0NTQ1OSwgIDIuMjA0ODY4NzksXG4gICAgICAxLjU5NDM0NjI4LCAwLjg5NDU1Njk0LCAxLjY4NTkxOTg4LCAwLjI2NzQ4NzM4LCAwLjU4MTAzOTkxLCAxLjAwNjkwMTk4LFxuICAgICAgMC4yMTI3NDY2OCwgMS4yNTMzNzMzOCwgMC42MTgzNTE0LCAgMy40OTYwMDY0OSwgMS41MDI3MjY1NSwgMS43MzcyNDY1MSxcbiAgICAgIDEuNjgxNDk1NzksIDAuNjkxNTIxNzYsIDAuNDQ5MDUzNDQsIDEuMDcxODY3MjMsIDAuMDM4MjM5NDMsIDEuMTk4NjQ4OTMsXG4gICAgICAwLjYxODM1MTQsICAzLjQ5NjAwNjQ5LCAxLjUwMjcyNjU1LCAxLjczNzI0NjUxLCAxLjY4MTQ5NTc5LCAwLjY5MTUyMTc2LFxuICAgICAgMC40NDkwNTM0NCwgMS4wNzE4NjcyMywgMC4wMzgyMzk0MywgMS4xOTg2NDg5M1xuICAgIF0pO1xuICB9KTtcblxuICBpdCgnbWF0Y2hlcyB0ZW5zb3JmbG93IHcvIHJhbmRvbSBudW1iZXJzIGFsaWduQ29ybmVycz10cnVlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gdGYudGVuc29yM2QoXG4gICAgICAgIFtcbiAgICAgICAgICAxLjU2MzI0NTMxLCAyLjEzODE3NzUyLCAxLjQ0Mzk4NDIxLCAxLjA3NjMyNjg0LCAwLjU5MzA2Nzg1LFxuICAgICAgICAgIC0wLjM2OTcwODY1LCAxLjYyNDUxODc5LCAxLjgzNjczMzQsIDEuMTM5NDQ3OTgsIDIuMDE5OTMyMTgsXG4gICAgICAgICAgMi4wMTkxOTk1MiwgMi42NzUyNDA1NFxuICAgICAgICBdLFxuICAgICAgICBbMiwgMywgMl0pO1xuICAgIGNvbnN0IG91dHB1dCA9IGlucHV0LnJlc2l6ZUJpbGluZWFyKFs0LCA1XSwgdHJ1ZSk7XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBvdXRwdXQuZGF0YSgpLCBbXG4gICAgICAxLjU2MzI0NTMsICAyLjEzODE3NzYzLCAxLjUwMzYxNDc4LCAxLjYwNzI1MjI0LCAgMS40NDM5ODQyNywgMS4wNzYzMjY4NSxcbiAgICAgIDEuMDE4NTI2MDgsIDAuMzUzMzA5MDksIDAuNTkzMDY3ODIsIC0wLjM2OTcwODY2LCAxLjU4MzY2OTc4LCAyLjAzNzY5NjEyLFxuICAgICAgMS40NjMwNzA5OSwgMS43MTQyNzkwNiwgMS4zNDI0NzIyLCAgMS4zOTA4NjE5OSwgIDEuMjA1NDU4NjQsIDEuMDE4MDY4MTksXG4gICAgICAxLjA2ODQ0NTA5LCAwLjY0NTI3NDQsICAxLjYwNDA5NDI3LCAxLjkzNzIxNDg1LCAgMS40MjI1MjcwNywgMS44MjEzMDU5OSxcbiAgICAgIDEuMjQwOTYsICAgIDEuNzA1Mzk3MTMsIDEuMzkyMzkxMiwgIDEuNjgyODI3MjMsICAxLjU0MzgyMjI5LCAxLjY2MDI1NzQ2LFxuICAgICAgMS42MjQ1MTg3NSwgMS44MzY3MzM0NiwgMS4zODE5ODMyOCwgMS45MjgzMzI4MSwgIDEuMTM5NDQ3OTMsIDIuMDE5OTMyMjcsXG4gICAgICAxLjU3OTMyMzc3LCAyLjM0NzU4NjM5LCAyLjAxOTE5OTYxLCAyLjY3NTI0MDUyXG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCdiYXRjaCBvZiAyLCBzaW1wbGUsIGFsaWduQ29ybmVycz10cnVlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gdGYudGVuc29yNGQoWzIsIDIsIDQsIDQsIDMsIDMsIDUsIDVdLCBbMiwgMiwgMiwgMV0pO1xuICAgIGNvbnN0IG91dHB1dCA9IGlucHV0LnJlc2l6ZUJpbGluZWFyKFszLCAzXSwgdHJ1ZSAvKiBhbGlnbkNvcm5lcnMgKi8pO1xuXG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgIGF3YWl0IG91dHB1dC5kYXRhKCksXG4gICAgICAgIFsyLCAyLCAyLCAzLCAzLCAzLCA0LCA0LCA0LCAzLCAzLCAzLCA0LCA0LCA0LCA1LCA1LCA1XSk7XG4gIH0pO1xuXG4gIGl0KCd0YXJnZXQgd2lkdGggPSAxLCBhbGlnbkNvcm5lcnM9dHJ1ZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRmLnRlbnNvcjNkKFtcbiAgICAgIFtcbiAgICAgICAgWzEyMC42ODg1NjgxMTUyMzQzOCwgMTM0LjUxNjM4NzkzOTQ1MzEyLCA4My4wMzY3MTI2NDY0ODQzOF0sXG4gICAgICAgIFsxMjEuNTgwMDg1NzU0Mzk0NTMsIDExMy4yODgzNjA1OTU3MDMxMiwgMTM2LjMxNzIxNDk2NTgyMDNdLFxuICAgICAgICBbNzkuMzgzNzA1MTM5MTYwMTYsIDEwMS44NzEyNzY4NTU0Njg3NSwgMTA0LjU0OTc5NzA1ODEwNTQ3XSxcbiAgICAgICAgWzk2LjMxNjc4NzcxOTcyNjU2LCAxMTEuNzcxNjgyNzM5MjU3ODEsIDgzLjczNTA5OTc5MjQ4MDQ3XVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgWzExOS40NTA4ODE5NTgwMDc4MSwgODguOTg4NDY0MzU1NDY4NzUsIDk3LjQ3NTUzMjUzMTczODI4XSxcbiAgICAgICAgWzExNy41NTYyOTczMDIyNDYxLCAxMDguMjYzNTY1MDYzNDc2NTYsIDk5LjYyMjEyMzcxODI2MTcyXSxcbiAgICAgICAgWzEzNi42MjcwMTQxNjAxNTYyNSwgOTQuMTA0MzMxOTcwMjE0ODQsIDgwLjk3MzY2MzMzMDA3ODEyXSxcbiAgICAgICAgWzgzLjYxMjA1MjkxNzQ4MDQ3LCA5MC42MDE0ODYyMDYwNTQ2OSwgODEuODI1MTI2NjQ3OTQ5MjJdXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICBbMTAzLjAzNjI3Nzc3MDk5NjEsIDEyMy4xMDk4NDAzOTMwNjY0LCAxMjUuNjI5NDQwMzA3NjE3MTldLFxuICAgICAgICBbOTIuMjkxNTI2Nzk0NDMzNiwgMTAzLjE1NzI5NTIyNzA1MDc4LCAxMTkuMTgwNjAzMDI3MzQzNzVdLFxuICAgICAgICBbMTAyLjkzMjkzNzYyMjA3MDMxLCAxMTcuODIxMDQ0OTIxODc1LCA5OS40MDE1Mjc0MDQ3ODUxNl0sXG4gICAgICAgIFs5Ni4zMjk1MjExNzkxOTkyMiwgMTA1LjgwOTYzMTM0NzY1NjI1LCAxMDQuODQ5MTQzOTgxOTMzNl1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIFsxMDQuODc1MDc2MjkzOTQ1MzEsIDEzNC4wMTg5MjA4OTg0Mzc1LCAxMTEuMDI2Mjc1NjM0NzY1NjJdLFxuICAgICAgICBbODUuNDUzNDY4MzIyNzUzOSwgMTA3LjY4NDI2NTEzNjcxODc1LCAxMDMuMDM3MjIzODE1OTE3OTddLFxuICAgICAgICBbODkuNzA1MzM3NTI0NDE0MDYsIDk4LjI1Mjk4MzA5MzI2MTcyLCA3OC40MjkxNjg3MDExNzE4OF0sXG4gICAgICAgIFsxMTMuNjc0NDYxMzY0NzQ2MSwgOTUuODE4OTY5NzI2NTYyNSwgMTIyLjc1MDA1MzQwNTc2MTcyXVxuICAgICAgXVxuICAgIF0pO1xuXG4gICAgY29uc3Qgb3V0cHV0ID0gaW5wdXQucmVzaXplQmlsaW5lYXIoWzMsIDFdLCB0cnVlKTtcblxuICAgIGNvbnN0IGV4cGVjdGVkID0gW1xuICAgICAgMTIwLjY4ODU3LCAxMzQuNTE2MzksIDgzLjAzNjcxLCAxMTEuMjQzNTc2LCAxMDYuMDQ5MTUsIDExMS41NTI0OSxcbiAgICAgIDEwNC44NzUwOCwgMTM0LjAxODkyLCAxMTEuMDI2Mjc2XG4gICAgXTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBvdXRwdXQuZGF0YSgpLCBleHBlY3RlZCk7XG4gICAgZXhwZWN0KG91dHB1dC5zaGFwZSkudG9FcXVhbChbMywgMSwgM10pO1xuICB9KTtcblxuICBpdCgndGFyZ2V0IGhlaWdodCA9IDEsIGFsaWduQ29ybmVycz10cnVlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gdGYudGVuc29yM2QoW1xuICAgICAgW1xuICAgICAgICBbMTIwLjY4ODU2ODExNTIzNDM4LCAxMzQuNTE2Mzg3OTM5NDUzMTIsIDgzLjAzNjcxMjY0NjQ4NDM4XSxcbiAgICAgICAgWzEyMS41ODAwODU3NTQzOTQ1MywgMTEzLjI4ODM2MDU5NTcwMzEyLCAxMzYuMzE3MjE0OTY1ODIwM10sXG4gICAgICAgIFs3OS4zODM3MDUxMzkxNjAxNiwgMTAxLjg3MTI3Njg1NTQ2ODc1LCAxMDQuNTQ5Nzk3MDU4MTA1NDddLFxuICAgICAgICBbOTYuMzE2Nzg3NzE5NzI2NTYsIDExMS43NzE2ODI3MzkyNTc4MSwgODMuNzM1MDk5NzkyNDgwNDddXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICBbMTE5LjQ1MDg4MTk1ODAwNzgxLCA4OC45ODg0NjQzNTU0Njg3NSwgOTcuNDc1NTMyNTMxNzM4MjhdLFxuICAgICAgICBbMTE3LjU1NjI5NzMwMjI0NjEsIDEwOC4yNjM1NjUwNjM0NzY1NiwgOTkuNjIyMTIzNzE4MjYxNzJdLFxuICAgICAgICBbMTM2LjYyNzAxNDE2MDE1NjI1LCA5NC4xMDQzMzE5NzAyMTQ4NCwgODAuOTczNjYzMzMwMDc4MTJdLFxuICAgICAgICBbODMuNjEyMDUyOTE3NDgwNDcsIDkwLjYwMTQ4NjIwNjA1NDY5LCA4MS44MjUxMjY2NDc5NDkyMl1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIFsxMDMuMDM2Mjc3NzcwOTk2MSwgMTIzLjEwOTg0MDM5MzA2NjQsIDEyNS42Mjk0NDAzMDc2MTcxOV0sXG4gICAgICAgIFs5Mi4yOTE1MjY3OTQ0MzM2LCAxMDMuMTU3Mjk1MjI3MDUwNzgsIDExOS4xODA2MDMwMjczNDM3NV0sXG4gICAgICAgIFsxMDIuOTMyOTM3NjIyMDcwMzEsIDExNy44MjEwNDQ5MjE4NzUsIDk5LjQwMTUyNzQwNDc4NTE2XSxcbiAgICAgICAgWzk2LjMyOTUyMTE3OTE5OTIyLCAxMDUuODA5NjMxMzQ3NjU2MjUsIDEwNC44NDkxNDM5ODE5MzM2XVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgWzEwNC44NzUwNzYyOTM5NDUzMSwgMTM0LjAxODkyMDg5ODQzNzUsIDExMS4wMjYyNzU2MzQ3NjU2Ml0sXG4gICAgICAgIFs4NS40NTM0NjgzMjI3NTM5LCAxMDcuNjg0MjY1MTM2NzE4NzUsIDEwMy4wMzcyMjM4MTU5MTc5N10sXG4gICAgICAgIFs4OS43MDUzMzc1MjQ0MTQwNiwgOTguMjUyOTgzMDkzMjYxNzIsIDc4LjQyOTE2ODcwMTE3MTg4XSxcbiAgICAgICAgWzExMy42NzQ0NjEzNjQ3NDYxLCA5NS44MTg5Njk3MjY1NjI1LCAxMjIuNzUwMDUzNDA1NzYxNzJdXG4gICAgICBdXG4gICAgXSk7XG5cbiAgICBjb25zdCBvdXRwdXQgPSBpbnB1dC5yZXNpemVCaWxpbmVhcihbMSwgM10sIHRydWUpO1xuXG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbXG4gICAgICAxMjAuNjg4NTcsIDEzNC41MTYzOSwgODMuMDM2NzEsIDEwMC40ODE4OTUsIDEwNy41Nzk4MiwgMTIwLjQzMzUsIDk2LjMxNjc5LFxuICAgICAgMTExLjc3MTY4LCA4My43MzUxXG4gICAgXTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBvdXRwdXQuZGF0YSgpLCBleHBlY3RlZCk7XG4gICAgZXhwZWN0KG91dHB1dC5zaGFwZSkudG9FcXVhbChbMSwgMywgM10pO1xuICB9KTtcblxuICBpdCgndGhyb3dzIHdoZW4gcGFzc2VkIGEgbm9uLXRlbnNvcicsICgpID0+IHtcbiAgICBjb25zdCBlID0gL0FyZ3VtZW50ICdpbWFnZXMnIHBhc3NlZCB0byAncmVzaXplQmlsaW5lYXInIG11c3QgYmUgYSBUZW5zb3IvO1xuICAgIGV4cGVjdCgoKSA9PiB0Zi5pbWFnZS5yZXNpemVCaWxpbmVhcih7fSBhcyB0Zi5UZW5zb3IzRCwgW1xuICAgICAgMSwgMVxuICAgIF0pKS50b1Rocm93RXJyb3IoZSk7XG4gIH0pO1xuXG4gIGl0KCdhY2NlcHRzIGEgdGVuc29yLWxpa2Ugb2JqZWN0JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gW1tbMl0sIFsyXV0sIFtbNF0sIFs0XV1dOyAgLy8gMngyeDFcbiAgICBjb25zdCBvdXRwdXQgPSB0Zi5pbWFnZS5yZXNpemVCaWxpbmVhcihpbnB1dCwgWzMsIDNdLCBmYWxzZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgIGF3YWl0IG91dHB1dC5kYXRhKCksIFsyLCAyLCAyLCAxMCAvIDMsIDEwIC8gMywgMTAgLyAzLCA0LCA0LCA0XSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCdyZXNpemVCaWxpbmVhciBncmFkaWVudHMnLCBBTExfRU5WUywgKCkgPT4ge1xuICBpdCgnZ3JleXNjYWxlOiB1cHNjYWxlLCBzYW1lIGFzcGVjdCByYXRpbycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRmLnRlbnNvcjNkKFtbWzEwMC4wXSwgWzUwLjBdXSwgW1s2MC4wXSwgWzIwLjBdXV0pO1xuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yM2QoW1xuICAgICAgW1sxLjBdLCBbMi4wXSwgWzMuMF0sIFs0LjBdXSwgW1s1LjBdLCBbNi4wXSwgWzcuMF0sIFs4LjBdXSxcbiAgICAgIFtbOS4wXSwgWzEwLjBdLCBbMTEuMF0sIFsxMi4wXV0sIFtbMTMuMF0sIFsxNC4wXSwgWzE1LjBdLCBbMTYuMF1dXG4gICAgXSk7XG5cbiAgICBjb25zdCBzaXplOiBbbnVtYmVyLCBudW1iZXJdID0gWzQsIDRdO1xuICAgIGNvbnN0IGFsaWduQ29ybmVycyA9IGZhbHNlO1xuICAgIGNvbnN0IGcgPSB0Zi5ncmFkKFxuICAgICAgICAoaTogdGYuVGVuc29yM0QpID0+IHRmLmltYWdlLnJlc2l6ZUJpbGluZWFyKGksIHNpemUsIGFsaWduQ29ybmVycykpO1xuXG4gICAgY29uc3Qgb3V0cHV0ID0gZyhpbnB1dCwgZHkpO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gWzYuMCwgMTcuMCwgMzguMCwgNzUuMF07XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBvdXRwdXQuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCd3aXRoIGNsb25lcywgZ3JleXNjYWxlOiB1cHNjYWxlLCBzYW1lIGFzcGVjdCByYXRpbycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRmLnRlbnNvcjNkKFtbWzEwMC4wXSwgWzUwLjBdXSwgW1s2MC4wXSwgWzIwLjBdXV0pO1xuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yM2QoW1xuICAgICAgW1sxLjBdLCBbMi4wXSwgWzMuMF0sIFs0LjBdXSwgW1s1LjBdLCBbNi4wXSwgWzcuMF0sIFs4LjBdXSxcbiAgICAgIFtbOS4wXSwgWzEwLjBdLCBbMTEuMF0sIFsxMi4wXV0sIFtbMTMuMF0sIFsxNC4wXSwgWzE1LjBdLCBbMTYuMF1dXG4gICAgXSk7XG5cbiAgICBjb25zdCBzaXplOiBbbnVtYmVyLCBudW1iZXJdID0gWzQsIDRdO1xuICAgIGNvbnN0IGFsaWduQ29ybmVycyA9IGZhbHNlO1xuICAgIGNvbnN0IGcgPSB0Zi5ncmFkKFxuICAgICAgICAoaTogdGYuVGVuc29yM0QpID0+XG4gICAgICAgICAgICB0Zi5pbWFnZS5yZXNpemVCaWxpbmVhcihpLmNsb25lKCksIHNpemUsIGFsaWduQ29ybmVycykuY2xvbmUoKSk7XG5cbiAgICBjb25zdCBvdXRwdXQgPSBnKGlucHV0LCBkeSk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbNi4wLCAxNy4wLCAzOC4wLCA3NS4wXTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IG91dHB1dC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2dyZXlzY2FsZTogdXBzY2FsZSwgc2FtZSBhc3BlY3QgcmF0aW8sIGFsaWduIGNvcm5lcnMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSB0Zi50ZW5zb3IzZChbW1sxMDAuMF0sIFs1MC4wXV0sIFtbNjAuMF0sIFsyMC4wXV1dKTtcbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjNkKFtcbiAgICAgIFtbMS4wXSwgWzIuMF0sIFszLjBdLCBbNC4wXV0sIFtbNS4wXSwgWzYuMF0sIFs3LjBdLCBbOC4wXV0sXG4gICAgICBbWzkuMF0sIFsxMC4wXSwgWzExLjBdLCBbMTIuMF1dLCBbWzEzLjBdLCBbMTQuMF0sIFsxNS4wXSwgWzE2LjBdXVxuICAgIF0pO1xuXG4gICAgY29uc3Qgc2l6ZTogW251bWJlciwgbnVtYmVyXSA9IFs0LCA0XTtcbiAgICBjb25zdCBhbGlnbkNvcm5lcnMgPSB0cnVlO1xuICAgIGNvbnN0IGcgPSB0Zi5ncmFkKFxuICAgICAgICAoaTogdGYuVGVuc29yM0QpID0+IHRmLmltYWdlLnJlc2l6ZUJpbGluZWFyKGksIHNpemUsIGFsaWduQ29ybmVycykpO1xuXG4gICAgY29uc3Qgb3V0cHV0ID0gZyhpbnB1dCwgZHkpO1xuICAgIGNvbnN0IGV4cGVjdGVkID1cbiAgICAgICAgWzE3LjMzMzMzMDE1NDQxODk0NSwgMjMuOTk5OTk4MDkyNjUxMzY3LCA0NC4wLCA1MC42NjY2Njc5MzgyMzI0Ml07XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBvdXRwdXQuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCdncmV5c2NhbGU6IHVwc2NhbGUsIHRhbGxlciB0aGFuIHdpZGVyJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gdGYudGVuc29yM2QoW1tbMTAwLjBdLCBbNTAuMF1dLCBbWzYwLjBdLCBbMjAuMF1dXSk7XG4gICAgY29uc3QgZHkgPSB0Zi50ZW5zb3IzZChbXG4gICAgICBbWzEuMF0sIFsyLjBdLCBbMy4wXSwgWzQuMF1dLCBbWzUuMF0sIFs2LjBdLCBbNy4wXSwgWzguMF1dLFxuICAgICAgW1s5LjBdLCBbMTAuMF0sIFsxMS4wXSwgWzEyLjBdXSwgW1sxMy4wXSwgWzE0LjBdLCBbMTUuMF0sIFsxNi4wXV0sXG4gICAgICBbWzE3LjBdLCBbMTguMF0sIFsxOS4wXSwgWzIwLjBdXSwgW1syMS4wXSwgWzIyLjBdLCBbMjMuMF0sIFsyNC4wXV0sXG4gICAgICBbWzI1LjBdLCBbMjYuMF0sIFsyNy4wXSwgWzI4LjBdXSwgW1syOS4wXSwgWzMwLjBdLCBbMzEuMF0sIFszMi4wXV0sXG4gICAgICBbWzMzLjBdLCBbMzQuMF0sIFszNS4wXSwgWzM2LjBdXVxuICAgIF0pO1xuXG4gICAgY29uc3Qgc2l6ZTogW251bWJlciwgbnVtYmVyXSA9IFs5LCA0XTtcbiAgICBjb25zdCBhbGlnbkNvcm5lcnMgPSBmYWxzZTtcbiAgICBjb25zdCBnID0gdGYuZ3JhZChcbiAgICAgICAgKGk6IHRmLlRlbnNvcjNEKSA9PiB0Zi5pbWFnZS5yZXNpemVCaWxpbmVhcihpLCBzaXplLCBhbGlnbkNvcm5lcnMpKTtcblxuICAgIGNvbnN0IG91dHB1dCA9IGcoaW5wdXQsIGR5KTtcbiAgICBjb25zdCBleHBlY3RlZCA9IFtcbiAgICAgIDI1LjU1NTU1NTM0MzYyNzkzLCA1NS41NTU1NTM0MzYyNzkzLCAyMDguNDQ0NDQyNzQ5MDIzNDQsIDM3Ni40NDQ0Mjc0OTAyMzQ0XG4gICAgXTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IG91dHB1dC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2dyZXlzY2FsZTogdXBzY2FsZSwgdGFsbGVyIHRoYW4gd2lkZXIsIGFsaWduIGNvcm5lcnMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSB0Zi50ZW5zb3IzZChbW1sxMDAuMF0sIFs1MC4wXV0sIFtbNjAuMF0sIFsyMC4wXV1dKTtcbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjNkKFtcbiAgICAgIFtbMS4wXSwgWzIuMF0sIFszLjBdLCBbNC4wXV0sIFtbNS4wXSwgWzYuMF0sIFs3LjBdLCBbOC4wXV0sXG4gICAgICBbWzkuMF0sIFsxMC4wXSwgWzExLjBdLCBbMTIuMF1dLCBbWzEzLjBdLCBbMTQuMF0sIFsxNS4wXSwgWzE2LjBdXSxcbiAgICAgIFtbMTcuMF0sIFsxOC4wXSwgWzE5LjBdLCBbMjAuMF1dLCBbWzIxLjBdLCBbMjIuMF0sIFsyMy4wXSwgWzI0LjBdXSxcbiAgICAgIFtbMjUuMF0sIFsyNi4wXSwgWzI3LjBdLCBbMjguMF1dLCBbWzI5LjBdLCBbMzAuMF0sIFszMS4wXSwgWzMyLjBdXSxcbiAgICAgIFtbMzMuMF0sIFszNC4wXSwgWzM1LjBdLCBbMzYuMF1dXG4gICAgXSk7XG5cbiAgICBjb25zdCBzaXplOiBbbnVtYmVyLCBudW1iZXJdID0gWzksIDRdO1xuICAgIGNvbnN0IGFsaWduQ29ybmVycyA9IHRydWU7XG4gICAgY29uc3QgZyA9IHRmLmdyYWQoXG4gICAgICAgIChpOiB0Zi5UZW5zb3IzRCkgPT4gdGYuaW1hZ2UucmVzaXplQmlsaW5lYXIoaSwgc2l6ZSwgYWxpZ25Db3JuZXJzKSk7XG5cbiAgICBjb25zdCBvdXRwdXQgPSBnKGlucHV0LCBkeSk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbOTkuMCwgMTE0LjAsIDIxOS4wMDAwMTUyNTg3ODkwNiwgMjMzLjk5OTk4NDc0MTIxMDk0XTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IG91dHB1dC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2dyZXlzY2FsZTogdXBzY2FsZSwgd2lkZXIgdGhhbiB0YWxsZXInLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSB0Zi50ZW5zb3IzZChbW1sxMDAuMF0sIFs1MC4wXV0sIFtbNjAuMF0sIFsyMC4wXV1dKTtcbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjNkKFtcbiAgICAgIFtbMS4wXSwgWzIuMF0sIFszLjBdLCBbNC4wXSwgWzUuMF0sIFs2LjBdLCBbNy4wXV0sXG4gICAgICBbWzguMF0sIFs5LjBdLCBbMTAuMF0sIFsxMS4wXSwgWzEyLjBdLCBbMTMuMF0sIFsxNC4wXV0sXG4gICAgICBbWzE1LjBdLCBbMTYuMF0sIFsxNy4wXSwgWzE4LjBdLCBbMTkuMF0sIFsyMC4wXSwgWzIxLjBdXSxcbiAgICAgIFtbMjIuMF0sIFsyMy4wXSwgWzI0LjBdLCBbMjUuMF0sIFsyNi4wXSwgWzI3LjBdLCBbMjguMF1dXG4gICAgXSk7XG5cbiAgICBjb25zdCBzaXplOiBbbnVtYmVyLCBudW1iZXJdID0gWzQsIDddO1xuICAgIGNvbnN0IGFsaWduQ29ybmVycyA9IGZhbHNlO1xuICAgIGNvbnN0IGcgPSB0Zi5ncmFkKFxuICAgICAgICAoaTogdGYuVGVuc29yM0QpID0+IHRmLmltYWdlLnJlc2l6ZUJpbGluZWFyKGksIHNpemUsIGFsaWduQ29ybmVycykpO1xuXG4gICAgY29uc3Qgb3V0cHV0ID0gZyhpbnB1dCwgZHkpO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gW1xuICAgICAgMTQuNDI4NTcwNzQ3Mzc1NDg4LCA1Mi4wNzE0MjYzOTE2MDE1NiwgOTguNzE0Mjc5MTc0ODA0NjksXG4gICAgICAyNDAuNzg1NzM2MDgzOTg0MzhcbiAgICBdO1xuXG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgb3V0cHV0LmRhdGEoKSwgZXhwZWN0ZWQpO1xuICB9KTtcblxuICBpdCgnZ3JleXNjYWxlOiB1cHNjYWxlLCB3aWRlciB0aGFuIHRhbGxlciwgYWxpZ24gY29ybmVycycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRmLnRlbnNvcjNkKFtbWzEwMC4wXSwgWzUwLjBdXSwgW1s2MC4wXSwgWzIwLjBdXV0pO1xuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yM2QoW1xuICAgICAgW1sxLjBdLCBbMi4wXSwgWzMuMF0sIFs0LjBdLCBbNS4wXSwgWzYuMF0sIFs3LjBdXSxcbiAgICAgIFtbOC4wXSwgWzkuMF0sIFsxMC4wXSwgWzExLjBdLCBbMTIuMF0sIFsxMy4wXSwgWzE0LjBdXSxcbiAgICAgIFtbMTUuMF0sIFsxNi4wXSwgWzE3LjBdLCBbMTguMF0sIFsxOS4wXSwgWzIwLjBdLCBbMjEuMF1dLFxuICAgICAgW1syMi4wXSwgWzIzLjBdLCBbMjQuMF0sIFsyNS4wXSwgWzI2LjBdLCBbMjcuMF0sIFsyOC4wXV1cbiAgICBdKTtcblxuICAgIGNvbnN0IHNpemU6IFtudW1iZXIsIG51bWJlcl0gPSBbNCwgN107XG4gICAgY29uc3QgYWxpZ25Db3JuZXJzID0gdHJ1ZTtcbiAgICBjb25zdCBnID0gdGYuZ3JhZChcbiAgICAgICAgKGk6IHRmLlRlbnNvcjNEKSA9PiB0Zi5pbWFnZS5yZXNpemVCaWxpbmVhcihpLCBzaXplLCBhbGlnbkNvcm5lcnMpKTtcblxuICAgIGNvbnN0IG91dHB1dCA9IGcoaW5wdXQsIGR5KTtcbiAgICBjb25zdCBleHBlY3RlZCA9IFs1MS4zMzMzMjgyNDcwNzAzMSwgNzAuMCwgMTMzLjAsIDE1MS42NjY2ODcwMTE3MTg3NV07XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBvdXRwdXQuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIC8vIERvd25zY2FsZVxuXG4gIGl0KCdncmV5c2NhbGU6IGRvd25zY2FsZSwgc2FtZSBhc3BlY3QgcmF0aW8nLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSB0Zi50ZW5zb3IzZChbXG4gICAgICBbWzEwMC4wXSwgWzUwLjBdLCBbMjUuMF0sIFsxMC4wXV0sIFtbNjAuMF0sIFsyMC4wXSwgWzgwLjBdLCBbMjAuMF1dLFxuICAgICAgW1s0MC4wXSwgWzE1LjBdLCBbMjAwLjBdLCBbMjAzLjBdXSwgW1s0MC4wXSwgWzEwLjBdLCBbMjMwLjBdLCBbMjAwLjBdXVxuICAgIF0pO1xuXG4gICAgY29uc3QgZHkgPSB0Zi50ZW5zb3IzZChbW1sxLjBdLCBbMi4wXV0sIFtbMy4wXSwgWzQuMF1dXSk7XG5cbiAgICBjb25zdCBzaXplOiBbbnVtYmVyLCBudW1iZXJdID0gWzIsIDJdO1xuICAgIGNvbnN0IGFsaWduQ29ybmVycyA9IGZhbHNlO1xuICAgIGNvbnN0IGcgPSB0Zi5ncmFkKFxuICAgICAgICAoaTogdGYuVGVuc29yM0QpID0+IHRmLmltYWdlLnJlc2l6ZUJpbGluZWFyKGksIHNpemUsIGFsaWduQ29ybmVycykpO1xuXG4gICAgY29uc3Qgb3V0cHV0ID0gZyhpbnB1dCwgZHkpO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gW1xuICAgICAgMS4wLCAwLjAsIDIuMCwgMC4wLCAwLjAsIDAuMCwgMC4wLCAwLjAsIDMuMCwgMC4wLCA0LjAsIDAuMCwgMC4wLCAwLjAsIDAuMCxcbiAgICAgIDAuMFxuICAgIF07XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBvdXRwdXQuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCdncmV5c2NhbGU6IGRvd25zY2FsZSwgc2FtZSBhc3BlY3QgcmF0aW8sIGFsaWduIGNvcm5lcnMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSB0Zi50ZW5zb3IzZChbXG4gICAgICBbWzEwMC4wXSwgWzUwLjBdLCBbMjUuMF0sIFsxMC4wXV0sIFtbNjAuMF0sIFsyMC4wXSwgWzgwLjBdLCBbMjAuMF1dLFxuICAgICAgW1s0MC4wXSwgWzE1LjBdLCBbMjAwLjBdLCBbMjAzLjBdXSwgW1s0MC4wXSwgWzEwLjBdLCBbMjMwLjBdLCBbMjAwLjBdXVxuICAgIF0pO1xuXG4gICAgY29uc3QgZHkgPSB0Zi50ZW5zb3IzZChbW1sxLjBdLCBbMi4wXV0sIFtbMy4wXSwgWzQuMF1dXSk7XG5cbiAgICBjb25zdCBzaXplOiBbbnVtYmVyLCBudW1iZXJdID0gWzIsIDJdO1xuICAgIGNvbnN0IGFsaWduQ29ybmVycyA9IHRydWU7XG4gICAgY29uc3QgZyA9IHRmLmdyYWQoXG4gICAgICAgIChpOiB0Zi5UZW5zb3IzRCkgPT4gdGYuaW1hZ2UucmVzaXplQmlsaW5lYXIoaSwgc2l6ZSwgYWxpZ25Db3JuZXJzKSk7XG5cbiAgICBjb25zdCBvdXRwdXQgPSBnKGlucHV0LCBkeSk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbXG4gICAgICAxLjAsIDAuMCwgMC4wLCAyLjAsIDAuMCwgMC4wLCAwLjAsIDAuMCwgMC4wLCAwLjAsIDAuMCwgMC4wLCAzLjAsIDAuMCwgMC4wLFxuICAgICAgNC4wXG4gICAgXTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IG91dHB1dC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2dyZXlzY2FsZTogZG93bnNjYWxlLCB0YWxsZXIgdGhhbiB3aWRlcicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRmLnRlbnNvcjNkKFtcbiAgICAgIFtbMTAwLjBdLCBbNTAuMF0sIFsyNS4wXSwgWzEwLjBdXSwgW1s2MC4wXSwgWzIwLjBdLCBbODAuMF0sIFsyMC4wXV0sXG4gICAgICBbWzQwLjBdLCBbMTUuMF0sIFsyMDAuMF0sIFsyMDMuMF1dLCBbWzQwLjBdLCBbMTAuMF0sIFsyMzAuMF0sIFsyMDAuMF1dXG4gICAgXSk7XG5cbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjNkKFtbWzEuMF0sIFsyLjBdXSwgW1szLjBdLCBbNC4wXV0sIFtbNS4wXSwgWzYuMF1dXSk7XG5cbiAgICBjb25zdCBzaXplOiBbbnVtYmVyLCBudW1iZXJdID0gWzMsIDJdO1xuICAgIGNvbnN0IGFsaWduQ29ybmVycyA9IGZhbHNlO1xuICAgIGNvbnN0IGcgPSB0Zi5ncmFkKFxuICAgICAgICAoaTogdGYuVGVuc29yM0QpID0+IHRmLmltYWdlLnJlc2l6ZUJpbGluZWFyKGksIHNpemUsIGFsaWduQ29ybmVycykpO1xuXG4gICAgY29uc3Qgb3V0cHV0ID0gZyhpbnB1dCwgZHkpO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gW1xuICAgICAgMS4wLCAwLjAsIDIuMCwgMC4wLCAxLjk5OTk5OTg4MDc5MDcxMDQsIDAuMCwgMi42NjY2NjY1MDc3MjA5NDczLCAwLjAsXG4gICAgICAyLjY2NjY2NjUwNzcyMDk0NzMsIDAuMCwgMy4zMzMzMzMwMTU0NDE4OTQ1LCAwLjAsIDMuMzMzMzMzNzMwNjk3NjMyLCAwLjAsXG4gICAgICA0LjAwMDAwMDQ3NjgzNzE1OCwgMC4wXG4gICAgXTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IG91dHB1dC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2dyZXlzY2FsZTogZG93bnNjYWxlLCB0YWxsZXIgdGhhbiB3aWRlciwgYWxpZ24gY29ybmVycycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRmLnRlbnNvcjNkKFtcbiAgICAgIFtbMTAwLjBdLCBbNTAuMF0sIFsyNS4wXSwgWzEwLjBdXSwgW1s2MC4wXSwgWzIwLjBdLCBbODAuMF0sIFsyMC4wXV0sXG4gICAgICBbWzQwLjBdLCBbMTUuMF0sIFsyMDAuMF0sIFsyMDMuMF1dLCBbWzQwLjBdLCBbMTAuMF0sIFsyMzAuMF0sIFsyMDAuMF1dXG4gICAgXSk7XG5cbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjNkKFtbWzEuMF0sIFsyLjBdXSwgW1szLjBdLCBbNC4wXV0sIFtbNS4wXSwgWzYuMF1dXSk7XG5cbiAgICBjb25zdCBzaXplOiBbbnVtYmVyLCBudW1iZXJdID0gWzMsIDJdO1xuICAgIGNvbnN0IGFsaWduQ29ybmVycyA9IHRydWU7XG4gICAgY29uc3QgZyA9IHRmLmdyYWQoXG4gICAgICAgIChpOiB0Zi5UZW5zb3IzRCkgPT4gdGYuaW1hZ2UucmVzaXplQmlsaW5lYXIoaSwgc2l6ZSwgYWxpZ25Db3JuZXJzKSk7XG5cbiAgICBjb25zdCBvdXRwdXQgPSBnKGlucHV0LCBkeSk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbXG4gICAgICAxLjAsIDAuMCwgMC4wLCAyLjAsIDEuNSwgMC4wLCAwLjAsIDIuMCwgMS41LCAwLjAsIDAuMCwgMi4wLCA1LjAsIDAuMCwgMC4wLFxuICAgICAgNi4wXG4gICAgXTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IG91dHB1dC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2dyZXlzY2FsZTogZG93bnNjYWxlLCB3aWRlciB0aGFuIHRhbGxlcicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRmLnRlbnNvcjNkKFtcbiAgICAgIFtbMTAwLjBdLCBbNTAuMF0sIFsyNS4wXSwgWzEwLjBdXSwgW1s2MC4wXSwgWzIwLjBdLCBbODAuMF0sIFsyMC4wXV0sXG4gICAgICBbWzQwLjBdLCBbMTUuMF0sIFsyMDAuMF0sIFsyMDMuMF1dLCBbWzQwLjBdLCBbMTAuMF0sIFsyMzAuMF0sIFsyMDAuMF1dXG4gICAgXSk7XG5cbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjNkKFtbWzEuMF0sIFsyLjBdLCBbMy4wXV0sIFtbNC4wXSwgWzUuMF0sIFs2LjBdXV0pO1xuXG4gICAgY29uc3Qgc2l6ZTogW251bWJlciwgbnVtYmVyXSA9IFsyLCAzXTtcbiAgICBjb25zdCBhbGlnbkNvcm5lcnMgPSBmYWxzZTtcbiAgICBjb25zdCBnID0gdGYuZ3JhZChcbiAgICAgICAgKGk6IHRmLlRlbnNvcjNEKSA9PiB0Zi5pbWFnZS5yZXNpemVCaWxpbmVhcihpLCBzaXplLCBhbGlnbkNvcm5lcnMpKTtcblxuICAgIGNvbnN0IG91dHB1dCA9IGcoaW5wdXQsIGR5KTtcbiAgICBjb25zdCBleHBlY3RlZCA9IFtcbiAgICAgIDEuMCwgMS4zMzMzMzMyNTM4NjA0NzM2LCAxLjY2NjY2NjUwNzcyMDk0NzMsIDIuMDAwMDAwMjM4NDE4NTc5LCAwLjAsIDAuMCxcbiAgICAgIDAuMCwgMC4wLCA0LjAsIDMuMzMzMzMzMDE1NDQxODk0NSwgMy42NjY2NjY1MDc3MjA5NDczLCA0LjAwMDAwMDQ3NjgzNzE1OCxcbiAgICAgIDAuMCwgMC4wLCAwLjAsIDAuMFxuICAgIF07XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBvdXRwdXQuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCdncmV5c2NhbGU6IGRvd25zY2FsZSwgd2lkZXIgdGhhbiB0YWxsZXIsIGFsaWduIGNvcm5lcnMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSB0Zi50ZW5zb3IzZChbXG4gICAgICBbWzEwMC4wXSwgWzUwLjBdLCBbMjUuMF0sIFsxMC4wXV0sIFtbNjAuMF0sIFsyMC4wXSwgWzgwLjBdLCBbMjAuMF1dLFxuICAgICAgW1s0MC4wXSwgWzE1LjBdLCBbMjAwLjBdLCBbMjAzLjBdXSwgW1s0MC4wXSwgWzEwLjBdLCBbMjMwLjBdLCBbMjAwLjBdXVxuICAgIF0pO1xuXG4gICAgY29uc3QgZHkgPSB0Zi50ZW5zb3IzZChbW1sxLjBdLCBbMi4wXSwgWzMuMF1dLCBbWzQuMF0sIFs1LjBdLCBbNi4wXV1dKTtcblxuICAgIGNvbnN0IHNpemU6IFtudW1iZXIsIG51bWJlcl0gPSBbMiwgM107XG4gICAgY29uc3QgYWxpZ25Db3JuZXJzID0gdHJ1ZTtcbiAgICBjb25zdCBnID0gdGYuZ3JhZChcbiAgICAgICAgKGk6IHRmLlRlbnNvcjNEKSA9PiB0Zi5pbWFnZS5yZXNpemVCaWxpbmVhcihpLCBzaXplLCBhbGlnbkNvcm5lcnMpKTtcblxuICAgIGNvbnN0IG91dHB1dCA9IGcoaW5wdXQsIGR5KTtcbiAgICBjb25zdCBleHBlY3RlZCA9IFtcbiAgICAgIDEuMCwgMS4wLCAxLjAsIDMuMCwgMC4wLCAwLjAsIDAuMCwgMC4wLCAwLjAsIDAuMCwgMC4wLCAwLjAsIDQuMCwgMi41LCAyLjUsXG4gICAgICA2LjBcbiAgICBdO1xuXG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgb3V0cHV0LmRhdGEoKSwgZXhwZWN0ZWQpO1xuICB9KTtcblxuICAvLyBObyBPcFxuXG4gIGl0KCdncmV5c2NhbGU6IHNhbWUgc2l6ZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRmLnRlbnNvcjNkKFtbWzEwMC4wXSwgWzUwLjBdXSwgW1s2MC4wXSwgWzIwLjBdXV0pO1xuXG4gICAgY29uc3QgZHkgPSB0Zi50ZW5zb3IzZChbW1sxLjBdLCBbMi4wXV0sIFtbMy4wXSwgWzQuMF1dXSk7XG5cbiAgICBjb25zdCBzaXplOiBbbnVtYmVyLCBudW1iZXJdID0gWzIsIDJdO1xuICAgIGNvbnN0IGFsaWduQ29ybmVycyA9IGZhbHNlO1xuICAgIGNvbnN0IGcgPSB0Zi5ncmFkKFxuICAgICAgICAoaTogdGYuVGVuc29yM0QpID0+IHRmLmltYWdlLnJlc2l6ZUJpbGluZWFyKGksIHNpemUsIGFsaWduQ29ybmVycykpO1xuXG4gICAgY29uc3Qgb3V0cHV0ID0gZyhpbnB1dCwgZHkpO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gWzEuMCwgMi4wLCAzLjAsIDQuMF07XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBvdXRwdXQuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCdncmV5c2NhbGU6IHNhbWUgc2l6ZSwgYWxpZ24gY29ybmVycycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRmLnRlbnNvcjNkKFtbWzEwMC4wXSwgWzUwLjBdXSwgW1s2MC4wXSwgWzIwLjBdXV0pO1xuXG4gICAgY29uc3QgZHkgPSB0Zi50ZW5zb3IzZChbW1sxLjBdLCBbMi4wXV0sIFtbMy4wXSwgWzQuMF1dXSk7XG5cbiAgICBjb25zdCBzaXplOiBbbnVtYmVyLCBudW1iZXJdID0gWzIsIDJdO1xuICAgIGNvbnN0IGFsaWduQ29ybmVycyA9IHRydWU7XG4gICAgY29uc3QgZyA9IHRmLmdyYWQoXG4gICAgICAgIChpOiB0Zi5UZW5zb3IzRCkgPT4gdGYuaW1hZ2UucmVzaXplQmlsaW5lYXIoaSwgc2l6ZSwgYWxpZ25Db3JuZXJzKSk7XG5cbiAgICBjb25zdCBvdXRwdXQgPSBnKGlucHV0LCBkeSk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbMS4wLCAyLjAsIDMuMCwgNC4wXTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IG91dHB1dC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgLy8gMyBjaGFubmVsIHVwc2NhbGVcbiAgaXQoJ2NvbG9yOiB1cHNjYWxlLCB3aWRlciB0aGFuIHRhbGxlcicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRmLnRlbnNvcjNkKFtcbiAgICAgIFtcbiAgICAgICAgWzExNS4xMTAyOTgxNTY3MzgyOCwgMTExLjkwOTM2Mjc5Mjk2ODc1LCA2Ni44NzQzMzYyNDI2NzU3OF0sXG4gICAgICAgIFs3Mi4wMzg0OTAyOTU0MTAxNiwgODEuODY2Mzc4Nzg0MTc5NjksIDExOS41MzU4NTgxNTQyOTY4OF1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIFs2OC41NTU0MTk5MjE4NzUsIDk3LjQ5NjQyMTgxMzk2NDg0LCAxMTYuOTA3NDE3Mjk3MzYzMjhdLFxuICAgICAgICBbMTI4LjY5NDY3MTYzMDg1OTM4LCA4Ni43ODMxNDIwODk4NDM3NSwgMTA0LjMxMTY2ODM5NTk5NjFdXG4gICAgICBdXG4gICAgXSk7XG5cbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjNkKFtcbiAgICAgIFtcbiAgICAgICAgWzEuMCwgMi4wLCAzLjBdLCBbNC4wLCA1LjAsIDYuMF0sIFs3LjAsIDguMCwgOS4wXSwgWzEwLjAsIDExLjAsIDEyLjBdLFxuICAgICAgICBbMTMuMCwgMTQuMCwgMTUuMF1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIFsxNi4wLCAxNy4wLCAxOC4wXSwgWzE5LjAsIDIwLjAsIDIxLjBdLCBbMjIuMCwgMjMuMCwgMjQuMF0sXG4gICAgICAgIFsyNS4wLCAyNi4wLCAyNy4wXSwgWzI4LjAsIDI5LjAsIDMwLjBdXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICBbMzEuMCwgMzIuMCwgMzMuMF0sIFszNC4wLCAzNS4wLCAzNi4wXSwgWzM3LjAsIDM4LjAsIDM5LjBdLFxuICAgICAgICBbNDAuMCwgNDEuMCwgNDIuMF0sIFs0My4wLCA0NC4wLCA0NS4wXVxuICAgICAgXVxuICAgIF0pO1xuXG4gICAgY29uc3Qgc2l6ZTogW251bWJlciwgbnVtYmVyXSA9IFszLCA1XTtcbiAgICBjb25zdCBhbGlnbkNvcm5lcnMgPSBmYWxzZTtcbiAgICBjb25zdCBnID0gdGYuZ3JhZChcbiAgICAgICAgKGk6IHRmLlRlbnNvcjNEKSA9PiB0Zi5pbWFnZS5yZXNpemVCaWxpbmVhcihpLCBzaXplLCBhbGlnbkNvcm5lcnMpKTtcblxuICAgIGNvbnN0IG91dHB1dCA9IGcoaW5wdXQsIGR5KTtcbiAgICBjb25zdCBleHBlY3RlZCA9IFtcbiAgICAgIDE1LjM5OTk5OTYxODUzMDI3MywgMTcuNzk5OTk5MjM3MDYwNTQ3LCAyMC4xOTk5OTg4NTU1OTA4MixcbiAgICAgIDU2LjI2NjY2MjU5NzY1NjI1LCA2MC41MzMzMjkwMTAwMDk3NjYsIDY0Ljc5OTk5NTQyMjM2MzI4LFxuICAgICAgODAuMDAwMDA3NjI5Mzk0NTMsIDgzLjAsIDg2LjAsIDE3OC4zMzMzNDM1MDU4NTkzOCwgMTgzLjY2NjY4NzAxMTcxODc1LFxuICAgICAgMTg5LjAwMDAxNTI1ODc4OTA2XG4gICAgXTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IG91dHB1dC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2NvbG9yOiB1cHNjYWxlLCB3aWRlciB0aGFuIHRhbGxlciwgYWxpZ24gY29ybmVycycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRmLnRlbnNvcjNkKFtcbiAgICAgIFtcbiAgICAgICAgWzExNS4xMTAyOTgxNTY3MzgyOCwgMTExLjkwOTM2Mjc5Mjk2ODc1LCA2Ni44NzQzMzYyNDI2NzU3OF0sXG4gICAgICAgIFs3Mi4wMzg0OTAyOTU0MTAxNiwgODEuODY2Mzc4Nzg0MTc5NjksIDExOS41MzU4NTgxNTQyOTY4OF1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIFs2OC41NTU0MTk5MjE4NzUsIDk3LjQ5NjQyMTgxMzk2NDg0LCAxMTYuOTA3NDE3Mjk3MzYzMjhdLFxuICAgICAgICBbMTI4LjY5NDY3MTYzMDg1OTM4LCA4Ni43ODMxNDIwODk4NDM3NSwgMTA0LjMxMTY2ODM5NTk5NjFdXG4gICAgICBdXG4gICAgXSk7XG5cbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjNkKFtcbiAgICAgIFtcbiAgICAgICAgWzEuMCwgMi4wLCAzLjBdLCBbNC4wLCA1LjAsIDYuMF0sIFs3LjAsIDguMCwgOS4wXSwgWzEwLjAsIDExLjAsIDEyLjBdLFxuICAgICAgICBbMTMuMCwgMTQuMCwgMTUuMF1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIFsxNi4wLCAxNy4wLCAxOC4wXSwgWzE5LjAsIDIwLjAsIDIxLjBdLCBbMjIuMCwgMjMuMCwgMjQuMF0sXG4gICAgICAgIFsyNS4wLCAyNi4wLCAyNy4wXSwgWzI4LjAsIDI5LjAsIDMwLjBdXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICBbMzEuMCwgMzIuMCwgMzMuMF0sIFszNC4wLCAzNS4wLCAzNi4wXSwgWzM3LjAsIDM4LjAsIDM5LjBdLFxuICAgICAgICBbNDAuMCwgNDEuMCwgNDIuMF0sIFs0My4wLCA0NC4wLCA0NS4wXVxuICAgICAgXVxuICAgIF0pO1xuXG4gICAgY29uc3Qgc2l6ZTogW251bWJlciwgbnVtYmVyXSA9IFszLCA1XTtcbiAgICBjb25zdCBhbGlnbkNvcm5lcnMgPSB0cnVlO1xuICAgIGNvbnN0IGcgPSB0Zi5ncmFkKFxuICAgICAgICAoaTogdGYuVGVuc29yM0QpID0+IHRmLmltYWdlLnJlc2l6ZUJpbGluZWFyKGksIHNpemUsIGFsaWduQ29ybmVycykpO1xuXG4gICAgY29uc3Qgb3V0cHV0ID0gZyhpbnB1dCwgZHkpO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gW1xuICAgICAgMzMuNzUsIDM3LjUsIDQxLjI1LCA1Ni4yNSwgNjAuMCwgNjMuNzUsIDEwOC43NSwgMTEyLjUsIDExNi4yNSwgMTMxLjI1LFxuICAgICAgMTM1LjAsIDEzOC43NVxuICAgIF07XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBvdXRwdXQuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIC8vIDMgY2hhbm5lbCBkb3duc2NhbGVcblxuICBpdCgnY29sb3I6IGRvd25zY2FsZSwgdGFsbGVyIHRoYW4gd2lkZXInLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSB0Zi50ZW5zb3IzZChbXG4gICAgICBbXG4gICAgICAgIFsxMjAuNjg4NTY4MTE1MjM0MzgsIDEzNC41MTYzODc5Mzk0NTMxMiwgODMuMDM2NzEyNjQ2NDg0MzhdLFxuICAgICAgICBbMTIxLjU4MDA4NTc1NDM5NDUzLCAxMTMuMjg4MzYwNTk1NzAzMTIsIDEzNi4zMTcyMTQ5NjU4MjAzXSxcbiAgICAgICAgWzc5LjM4MzcwNTEzOTE2MDE2LCAxMDEuODcxMjc2ODU1NDY4NzUsIDEwNC41NDk3OTcwNTgxMDU0N10sXG4gICAgICAgIFs5Ni4zMTY3ODc3MTk3MjY1NiwgMTExLjc3MTY4MjczOTI1NzgxLCA4My43MzUwOTk3OTI0ODA0N11cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIFsxMTkuNDUwODgxOTU4MDA3ODEsIDg4Ljk4ODQ2NDM1NTQ2ODc1LCA5Ny40NzU1MzI1MzE3MzgyOF0sXG4gICAgICAgIFsxMTcuNTU2Mjk3MzAyMjQ2MSwgMTA4LjI2MzU2NTA2MzQ3NjU2LCA5OS42MjIxMjM3MTgyNjE3Ml0sXG4gICAgICAgIFsxMzYuNjI3MDE0MTYwMTU2MjUsIDk0LjEwNDMzMTk3MDIxNDg0LCA4MC45NzM2NjMzMzAwNzgxMl0sXG4gICAgICAgIFs4My42MTIwNTI5MTc0ODA0NywgOTAuNjAxNDg2MjA2MDU0NjksIDgxLjgyNTEyNjY0Nzk0OTIyXVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgWzEwMy4wMzYyNzc3NzA5OTYxLCAxMjMuMTA5ODQwMzkzMDY2NCwgMTI1LjYyOTQ0MDMwNzYxNzE5XSxcbiAgICAgICAgWzkyLjI5MTUyNjc5NDQzMzYsIDEwMy4xNTcyOTUyMjcwNTA3OCwgMTE5LjE4MDYwMzAyNzM0Mzc1XSxcbiAgICAgICAgWzEwMi45MzI5Mzc2MjIwNzAzMSwgMTE3LjgyMTA0NDkyMTg3NSwgOTkuNDAxNTI3NDA0Nzg1MTZdLFxuICAgICAgICBbOTYuMzI5NTIxMTc5MTk5MjIsIDEwNS44MDk2MzEzNDc2NTYyNSwgMTA0Ljg0OTE0Mzk4MTkzMzZdXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICBbMTA0Ljg3NTA3NjI5Mzk0NTMxLCAxMzQuMDE4OTIwODk4NDM3NSwgMTExLjAyNjI3NTYzNDc2NTYyXSxcbiAgICAgICAgWzg1LjQ1MzQ2ODMyMjc1MzksIDEwNy42ODQyNjUxMzY3MTg3NSwgMTAzLjAzNzIyMzgxNTkxNzk3XSxcbiAgICAgICAgWzg5LjcwNTMzNzUyNDQxNDA2LCA5OC4yNTI5ODMwOTMyNjE3MiwgNzguNDI5MTY4NzAxMTcxODhdLFxuICAgICAgICBbMTEzLjY3NDQ2MTM2NDc0NjEsIDk1LjgxODk2OTcyNjU2MjUsIDEyMi43NTAwNTM0MDU3NjE3Ml1cbiAgICAgIF1cbiAgICBdKTtcblxuICAgIGNvbnN0IGR5ID1cbiAgICAgICAgdGYudGVuc29yM2QoW1tbMS4wLCAyLjAsIDMuMF1dLCBbWzQuMCwgNS4wLCA2LjBdXSwgW1s3LjAsIDguMCwgOS4wXV1dKTtcblxuICAgIGNvbnN0IHNpemU6IFtudW1iZXIsIG51bWJlcl0gPSBbMywgMV07XG4gICAgY29uc3QgYWxpZ25Db3JuZXJzID0gZmFsc2U7XG4gICAgY29uc3QgZyA9IHRmLmdyYWQoXG4gICAgICAgIChpOiB0Zi5UZW5zb3IzRCkgPT4gdGYuaW1hZ2UucmVzaXplQmlsaW5lYXIoaSwgc2l6ZSwgYWxpZ25Db3JuZXJzKSk7XG5cbiAgICBjb25zdCBvdXRwdXQgPSBnKGlucHV0LCBkeSk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbXG4gICAgICAxLjAsXG4gICAgICAyLjAsXG4gICAgICAzLjAsXG4gICAgICAwLjAsXG4gICAgICAwLjAsXG4gICAgICAwLjAsXG4gICAgICAwLjAsXG4gICAgICAwLjAsXG4gICAgICAwLjAsXG4gICAgICAwLjAsXG4gICAgICAwLjAsXG4gICAgICAwLjAsXG4gICAgICAyLjY2NjY2NjUwNzcyMDk0NzMsXG4gICAgICAzLjMzMzMzMzAxNTQ0MTg5NDUsXG4gICAgICAzLjk5OTk5OTc2MTU4MTQyMSxcbiAgICAgIDAuMCxcbiAgICAgIDAuMCxcbiAgICAgIDAuMCxcbiAgICAgIDAuMCxcbiAgICAgIDAuMCxcbiAgICAgIDAuMCxcbiAgICAgIDAuMCxcbiAgICAgIDAuMCxcbiAgICAgIDAuMCxcbiAgICAgIDMuNjY2NjY2MjY5MzAyMzY4LFxuICAgICAgNC4zMzMzMzMwMTU0NDE4OTQ1LFxuICAgICAgNC45OTk5OTk1MjMxNjI4NDIsXG4gICAgICAwLjAsXG4gICAgICAwLjAsXG4gICAgICAwLjAsXG4gICAgICAwLjAsXG4gICAgICAwLjAsXG4gICAgICAwLjAsXG4gICAgICAwLjAsXG4gICAgICAwLjAsXG4gICAgICAwLjAsXG4gICAgICA0LjY2NjY2Njk4NDU1ODEwNTUsXG4gICAgICA1LjMzMzMzMzk2OTExNjIxMSxcbiAgICAgIDYuMDAwMDAwOTUzNjc0MzE2LFxuICAgICAgMC4wLFxuICAgICAgMC4wLFxuICAgICAgMC4wLFxuICAgICAgMC4wLFxuICAgICAgMC4wLFxuICAgICAgMC4wLFxuICAgICAgMC4wLFxuICAgICAgMC4wLFxuICAgICAgMC4wXG4gICAgXTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IG91dHB1dC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2NvbG9yOiBkb3duc2NhbGUsIHdpZHRoID0gMSwgYWxpZ24gY29ybmVycycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRmLnRlbnNvcjNkKFtcbiAgICAgIFtcbiAgICAgICAgWzEyMC42ODg1NjgxMTUyMzQzOCwgMTM0LjUxNjM4NzkzOTQ1MzEyLCA4My4wMzY3MTI2NDY0ODQzOF0sXG4gICAgICAgIFsxMjEuNTgwMDg1NzU0Mzk0NTMsIDExMy4yODgzNjA1OTU3MDMxMiwgMTM2LjMxNzIxNDk2NTgyMDNdLFxuICAgICAgICBbNzkuMzgzNzA1MTM5MTYwMTYsIDEwMS44NzEyNzY4NTU0Njg3NSwgMTA0LjU0OTc5NzA1ODEwNTQ3XSxcbiAgICAgICAgWzk2LjMxNjc4NzcxOTcyNjU2LCAxMTEuNzcxNjgyNzM5MjU3ODEsIDgzLjczNTA5OTc5MjQ4MDQ3XVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgWzExOS40NTA4ODE5NTgwMDc4MSwgODguOTg4NDY0MzU1NDY4NzUsIDk3LjQ3NTUzMjUzMTczODI4XSxcbiAgICAgICAgWzExNy41NTYyOTczMDIyNDYxLCAxMDguMjYzNTY1MDYzNDc2NTYsIDk5LjYyMjEyMzcxODI2MTcyXSxcbiAgICAgICAgWzEzNi42MjcwMTQxNjAxNTYyNSwgOTQuMTA0MzMxOTcwMjE0ODQsIDgwLjk3MzY2MzMzMDA3ODEyXSxcbiAgICAgICAgWzgzLjYxMjA1MjkxNzQ4MDQ3LCA5MC42MDE0ODYyMDYwNTQ2OSwgODEuODI1MTI2NjQ3OTQ5MjJdXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICBbMTAzLjAzNjI3Nzc3MDk5NjEsIDEyMy4xMDk4NDAzOTMwNjY0LCAxMjUuNjI5NDQwMzA3NjE3MTldLFxuICAgICAgICBbOTIuMjkxNTI2Nzk0NDMzNiwgMTAzLjE1NzI5NTIyNzA1MDc4LCAxMTkuMTgwNjAzMDI3MzQzNzVdLFxuICAgICAgICBbMTAyLjkzMjkzNzYyMjA3MDMxLCAxMTcuODIxMDQ0OTIxODc1LCA5OS40MDE1Mjc0MDQ3ODUxNl0sXG4gICAgICAgIFs5Ni4zMjk1MjExNzkxOTkyMiwgMTA1LjgwOTYzMTM0NzY1NjI1LCAxMDQuODQ5MTQzOTgxOTMzNl1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIFsxMDQuODc1MDc2MjkzOTQ1MzEsIDEzNC4wMTg5MjA4OTg0Mzc1LCAxMTEuMDI2Mjc1NjM0NzY1NjJdLFxuICAgICAgICBbODUuNDUzNDY4MzIyNzUzOSwgMTA3LjY4NDI2NTEzNjcxODc1LCAxMDMuMDM3MjIzODE1OTE3OTddLFxuICAgICAgICBbODkuNzA1MzM3NTI0NDE0MDYsIDk4LjI1Mjk4MzA5MzI2MTcyLCA3OC40MjkxNjg3MDExNzE4OF0sXG4gICAgICAgIFsxMTMuNjc0NDYxMzY0NzQ2MSwgOTUuODE4OTY5NzI2NTYyNSwgMTIyLjc1MDA1MzQwNTc2MTcyXVxuICAgICAgXVxuICAgIF0pO1xuXG4gICAgY29uc3QgZHkgPVxuICAgICAgICB0Zi50ZW5zb3IzZChbW1sxLjAsIDIuMCwgMy4wXV0sIFtbNC4wLCA1LjAsIDYuMF1dLCBbWzcuMCwgOC4wLCA5LjBdXV0pO1xuXG4gICAgY29uc3Qgc2l6ZTogW251bWJlciwgbnVtYmVyXSA9IFszLCAxXTtcbiAgICBjb25zdCBhbGlnbkNvcm5lcnMgPSB0cnVlO1xuICAgIGNvbnN0IGcgPSB0Zi5ncmFkKFxuICAgICAgICAoaTogdGYuVGVuc29yM0QpID0+IHRmLmltYWdlLnJlc2l6ZUJpbGluZWFyKGksIHNpemUsIGFsaWduQ29ybmVycykpO1xuXG4gICAgY29uc3Qgb3V0cHV0ID0gZyhpbnB1dCwgZHkpO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gW1xuICAgICAgMS4wLCAyLjAsIDMuMCwgMC4wLCAwLjAsIDAuMCwgMC4wLCAwLjAsIDAuMCwgMC4wLCAwLjAsIDAuMCxcbiAgICAgIDIuMCwgMi41LCAzLjAsIDAuMCwgMC4wLCAwLjAsIDAuMCwgMC4wLCAwLjAsIDAuMCwgMC4wLCAwLjAsXG4gICAgICAyLjAsIDIuNSwgMy4wLCAwLjAsIDAuMCwgMC4wLCAwLjAsIDAuMCwgMC4wLCAwLjAsIDAuMCwgMC4wLFxuICAgICAgNy4wLCA4LjAsIDkuMCwgMC4wLCAwLjAsIDAuMCwgMC4wLCAwLjAsIDAuMCwgMC4wLCAwLjAsIDAuMFxuICAgIF07XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgb3V0cHV0LmRhdGEoKSwgZXhwZWN0ZWQpO1xuICB9KTtcblxuICBpdCgnY29sb3I6IGRvd25zY2FsZSwgaGVpZ2h0ID0gMSwgYWxpZ24gY29ybmVycycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IHRmLnRlbnNvcjNkKFtcbiAgICAgIFtcbiAgICAgICAgWzEyMC42ODg1NjgxMTUyMzQzOCwgMTM0LjUxNjM4NzkzOTQ1MzEyLCA4My4wMzY3MTI2NDY0ODQzOF0sXG4gICAgICAgIFsxMjEuNTgwMDg1NzU0Mzk0NTMsIDExMy4yODgzNjA1OTU3MDMxMiwgMTM2LjMxNzIxNDk2NTgyMDNdLFxuICAgICAgICBbNzkuMzgzNzA1MTM5MTYwMTYsIDEwMS44NzEyNzY4NTU0Njg3NSwgMTA0LjU0OTc5NzA1ODEwNTQ3XSxcbiAgICAgICAgWzk2LjMxNjc4NzcxOTcyNjU2LCAxMTEuNzcxNjgyNzM5MjU3ODEsIDgzLjczNTA5OTc5MjQ4MDQ3XVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgWzExOS40NTA4ODE5NTgwMDc4MSwgODguOTg4NDY0MzU1NDY4NzUsIDk3LjQ3NTUzMjUzMTczODI4XSxcbiAgICAgICAgWzExNy41NTYyOTczMDIyNDYxLCAxMDguMjYzNTY1MDYzNDc2NTYsIDk5LjYyMjEyMzcxODI2MTcyXSxcbiAgICAgICAgWzEzNi42MjcwMTQxNjAxNTYyNSwgOTQuMTA0MzMxOTcwMjE0ODQsIDgwLjk3MzY2MzMzMDA3ODEyXSxcbiAgICAgICAgWzgzLjYxMjA1MjkxNzQ4MDQ3LCA5MC42MDE0ODYyMDYwNTQ2OSwgODEuODI1MTI2NjQ3OTQ5MjJdXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICBbMTAzLjAzNjI3Nzc3MDk5NjEsIDEyMy4xMDk4NDAzOTMwNjY0LCAxMjUuNjI5NDQwMzA3NjE3MTldLFxuICAgICAgICBbOTIuMjkxNTI2Nzk0NDMzNiwgMTAzLjE1NzI5NTIyNzA1MDc4LCAxMTkuMTgwNjAzMDI3MzQzNzVdLFxuICAgICAgICBbMTAyLjkzMjkzNzYyMjA3MDMxLCAxMTcuODIxMDQ0OTIxODc1LCA5OS40MDE1Mjc0MDQ3ODUxNl0sXG4gICAgICAgIFs5Ni4zMjk1MjExNzkxOTkyMiwgMTA1LjgwOTYzMTM0NzY1NjI1LCAxMDQuODQ5MTQzOTgxOTMzNl1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIFsxMDQuODc1MDc2MjkzOTQ1MzEsIDEzNC4wMTg5MjA4OTg0Mzc1LCAxMTEuMDI2Mjc1NjM0NzY1NjJdLFxuICAgICAgICBbODUuNDUzNDY4MzIyNzUzOSwgMTA3LjY4NDI2NTEzNjcxODc1LCAxMDMuMDM3MjIzODE1OTE3OTddLFxuICAgICAgICBbODkuNzA1MzM3NTI0NDE0MDYsIDk4LjI1Mjk4MzA5MzI2MTcyLCA3OC40MjkxNjg3MDExNzE4OF0sXG4gICAgICAgIFsxMTMuNjc0NDYxMzY0NzQ2MSwgOTUuODE4OTY5NzI2NTYyNSwgMTIyLjc1MDA1MzQwNTc2MTcyXVxuICAgICAgXVxuICAgIF0pO1xuXG4gICAgY29uc3QgZHkgPSB0Zi50ZW5zb3IzZChbW1sxLiwgMi4sIDMuXSwgWzQuLCA1LiwgNi5dLCBbNy4sIDguLCA5Ll1dXSk7XG5cbiAgICBjb25zdCBzaXplOiBbbnVtYmVyLCBudW1iZXJdID0gWzEsIDNdO1xuICAgIGNvbnN0IGFsaWduQ29ybmVycyA9IHRydWU7XG4gICAgY29uc3QgZyA9IHRmLmdyYWQoXG4gICAgICAgIChpOiB0Zi5UZW5zb3IzRCkgPT4gdGYuaW1hZ2UucmVzaXplQmlsaW5lYXIoaSwgc2l6ZSwgYWxpZ25Db3JuZXJzKSk7XG5cbiAgICBjb25zdCBvdXRwdXQgPSBnKGlucHV0LCBkeSk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbXG4gICAgICAxLiwgMi4sIDMuLCAyLiwgMi41LCAzLiwgMi4sIDIuNSwgMy4sIDcuLCA4LiwgOS4sIDAuLCAwLiwgMC4sIDAuLFxuICAgICAgMC4sIDAuLCAwLiwgMC4sIDAuLCAgMC4sIDAuLCAwLiwgIDAuLCAwLiwgMC4sIDAuLCAwLiwgMC4sIDAuLCAwLixcbiAgICAgIDAuLCAwLiwgMC4sIDAuLCAwLiwgIDAuLCAwLiwgMC4sICAwLiwgMC4sIDAuLCAwLiwgMC4sIDAuLCAwLiwgMC5cbiAgICBdO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IG91dHB1dC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2NvbG9yOiBkb3duc2NhbGUsIHRhbGxlciB0aGFuIHdpZGVyLCBhbGlnbiBjb3JuZXJzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gdGYudGVuc29yM2QoW1xuICAgICAgW1xuICAgICAgICBbMTIwLjY4ODU2ODExNTIzNDM4LCAxMzQuNTE2Mzg3OTM5NDUzMTIsIDgzLjAzNjcxMjY0NjQ4NDM4XSxcbiAgICAgICAgWzEyMS41ODAwODU3NTQzOTQ1MywgMTEzLjI4ODM2MDU5NTcwMzEyLCAxMzYuMzE3MjE0OTY1ODIwM10sXG4gICAgICAgIFs3OS4zODM3MDUxMzkxNjAxNiwgMTAxLjg3MTI3Njg1NTQ2ODc1LCAxMDQuNTQ5Nzk3MDU4MTA1NDddLFxuICAgICAgICBbOTYuMzE2Nzg3NzE5NzI2NTYsIDExMS43NzE2ODI3MzkyNTc4MSwgODMuNzM1MDk5NzkyNDgwNDddXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICBbMTE5LjQ1MDg4MTk1ODAwNzgxLCA4OC45ODg0NjQzNTU0Njg3NSwgOTcuNDc1NTMyNTMxNzM4MjhdLFxuICAgICAgICBbMTE3LjU1NjI5NzMwMjI0NjEsIDEwOC4yNjM1NjUwNjM0NzY1NiwgOTkuNjIyMTIzNzE4MjYxNzJdLFxuICAgICAgICBbMTM2LjYyNzAxNDE2MDE1NjI1LCA5NC4xMDQzMzE5NzAyMTQ4NCwgODAuOTczNjYzMzMwMDc4MTJdLFxuICAgICAgICBbODMuNjEyMDUyOTE3NDgwNDcsIDkwLjYwMTQ4NjIwNjA1NDY5LCA4MS44MjUxMjY2NDc5NDkyMl1cbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIFsxMDMuMDM2Mjc3NzcwOTk2MSwgMTIzLjEwOTg0MDM5MzA2NjQsIDEyNS42Mjk0NDAzMDc2MTcxOV0sXG4gICAgICAgIFs5Mi4yOTE1MjY3OTQ0MzM2LCAxMDMuMTU3Mjk1MjI3MDUwNzgsIDExOS4xODA2MDMwMjczNDM3NV0sXG4gICAgICAgIFsxMDIuOTMyOTM3NjIyMDcwMzEsIDExNy44MjEwNDQ5MjE4NzUsIDk5LjQwMTUyNzQwNDc4NTE2XSxcbiAgICAgICAgWzk2LjMyOTUyMTE3OTE5OTIyLCAxMDUuODA5NjMxMzQ3NjU2MjUsIDEwNC44NDkxNDM5ODE5MzM2XVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgWzEwNC44NzUwNzYyOTM5NDUzMSwgMTM0LjAxODkyMDg5ODQzNzUsIDExMS4wMjYyNzU2MzQ3NjU2Ml0sXG4gICAgICAgIFs4NS40NTM0NjgzMjI3NTM5LCAxMDcuNjg0MjY1MTM2NzE4NzUsIDEwMy4wMzcyMjM4MTU5MTc5N10sXG4gICAgICAgIFs4OS43MDUzMzc1MjQ0MTQwNiwgOTguMjUyOTgzMDkzMjYxNzIsIDc4LjQyOTE2ODcwMTE3MTg4XSxcbiAgICAgICAgWzExMy42NzQ0NjEzNjQ3NDYxLCA5NS44MTg5Njk3MjY1NjI1LCAxMjIuNzUwMDUzNDA1NzYxNzJdXG4gICAgICBdXG4gICAgXSk7XG5cbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjNkKFtcbiAgICAgIFtbMS4wLCAyLjAsIDMuMF0sIFs0LjAsIDUuMCwgNi4wXV0sIFtbNy4wLCA4LjAsIDkuMF0sIFsxMC4wLCAxMS4wLCAxMi4wXV0sXG4gICAgICBbWzEzLjAsIDE0LjAsIDE1LjBdLCBbMTYuMCwgMTcuMCwgMTguMF1dXG4gICAgXSk7XG5cbiAgICBjb25zdCBzaXplOiBbbnVtYmVyLCBudW1iZXJdID0gWzMsIDJdO1xuICAgIGNvbnN0IGFsaWduQ29ybmVycyA9IHRydWU7XG4gICAgY29uc3QgZyA9IHRmLmdyYWQoXG4gICAgICAgIChpOiB0Zi5UZW5zb3IzRCkgPT4gdGYuaW1hZ2UucmVzaXplQmlsaW5lYXIoaSwgc2l6ZSwgYWxpZ25Db3JuZXJzKSk7XG5cbiAgICBjb25zdCBvdXRwdXQgPSBnKGlucHV0LCBkeSk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbXG4gICAgICAxLjAsICAyLjAsICAzLjAsICAwLjAsIDAuMCwgMC4wLCAwLjAsIDAuMCwgMC4wLCA0LjAsICA1LjAsICA2LjAsXG4gICAgICAzLjUsICA0LjAsICA0LjUsICAwLjAsIDAuMCwgMC4wLCAwLjAsIDAuMCwgMC4wLCA1LjAsICA1LjUsICA2LjAsXG4gICAgICAzLjUsICA0LjAsICA0LjUsICAwLjAsIDAuMCwgMC4wLCAwLjAsIDAuMCwgMC4wLCA1LjAsICA1LjUsICA2LjAsXG4gICAgICAxMy4wLCAxNC4wLCAxNS4wLCAwLjAsIDAuMCwgMC4wLCAwLjAsIDAuMCwgMC4wLCAxNi4wLCAxNy4wLCAxOC4wXG4gICAgXTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBvdXRwdXQuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIC8vIDMgY2hhbm5lbCBuby1vcFxuXG4gIGl0KCdjb2xvcjogc2FtZSBzaXplJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gdGYudGVuc29yM2QoW1xuICAgICAgW1xuICAgICAgICBbMTE1LjExMDI5ODE1NjczODI4LCAxMTEuOTA5MzYyNzkyOTY4NzUsIDY2Ljg3NDMzNjI0MjY3NTc4XSxcbiAgICAgICAgWzcyLjAzODQ5MDI5NTQxMDE2LCA4MS44NjYzNzg3ODQxNzk2OSwgMTE5LjUzNTg1ODE1NDI5Njg4XVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgWzY4LjU1NTQxOTkyMTg3NSwgOTcuNDk2NDIxODEzOTY0ODQsIDExNi45MDc0MTcyOTczNjMyOF0sXG4gICAgICAgIFsxMjguNjk0NjcxNjMwODU5MzgsIDg2Ljc4MzE0MjA4OTg0Mzc1LCAxMDQuMzExNjY4Mzk1OTk2MV1cbiAgICAgIF1cbiAgICBdKTtcblxuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yM2QoW1xuICAgICAgW1sxLjAsIDIuMCwgMy4wXSwgWzQuMCwgNS4wLCA2LjBdXSwgW1s3LjAsIDguMCwgOS4wXSwgWzEwLjAsIDExLjAsIDEyLjBdXVxuICAgIF0pO1xuXG4gICAgY29uc3Qgc2l6ZTogW251bWJlciwgbnVtYmVyXSA9IFsyLCAyXTtcbiAgICBjb25zdCBhbGlnbkNvcm5lcnMgPSBmYWxzZTtcbiAgICBjb25zdCBnID0gdGYuZ3JhZChcbiAgICAgICAgKGk6IHRmLlRlbnNvcjNEKSA9PiB0Zi5pbWFnZS5yZXNpemVCaWxpbmVhcihpLCBzaXplLCBhbGlnbkNvcm5lcnMpKTtcblxuICAgIGNvbnN0IG91dHB1dCA9IGcoaW5wdXQsIGR5KTtcbiAgICBjb25zdCBleHBlY3RlZCA9XG4gICAgICAgIFsxLjAsIDIuMCwgMy4wLCA0LjAsIDUuMCwgNi4wLCA3LjAsIDguMCwgOS4wLCAxMC4wLCAxMS4wLCAxMi4wXTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBvdXRwdXQuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCdjb2xvcjogc2FtZSBzaXplLCBhbGlnbiBjb3JuZXJzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gdGYudGVuc29yM2QoW1xuICAgICAgW1xuICAgICAgICBbMTE1LjExMDI5ODE1NjczODI4LCAxMTEuOTA5MzYyNzkyOTY4NzUsIDY2Ljg3NDMzNjI0MjY3NTc4XSxcbiAgICAgICAgWzcyLjAzODQ5MDI5NTQxMDE2LCA4MS44NjYzNzg3ODQxNzk2OSwgMTE5LjUzNTg1ODE1NDI5Njg4XVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgWzY4LjU1NTQxOTkyMTg3NSwgOTcuNDk2NDIxODEzOTY0ODQsIDExNi45MDc0MTcyOTczNjMyOF0sXG4gICAgICAgIFsxMjguNjk0NjcxNjMwODU5MzgsIDg2Ljc4MzE0MjA4OTg0Mzc1LCAxMDQuMzExNjY4Mzk1OTk2MV1cbiAgICAgIF1cbiAgICBdKTtcblxuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yM2QoW1xuICAgICAgW1sxLjAsIDIuMCwgMy4wXSwgWzQuMCwgNS4wLCA2LjBdXSwgW1s3LjAsIDguMCwgOS4wXSwgWzEwLjAsIDExLjAsIDEyLjBdXVxuICAgIF0pO1xuXG4gICAgY29uc3Qgc2l6ZTogW251bWJlciwgbnVtYmVyXSA9IFsyLCAyXTtcbiAgICBjb25zdCBhbGlnbkNvcm5lcnMgPSB0cnVlO1xuICAgIGNvbnN0IGcgPSB0Zi5ncmFkKFxuICAgICAgICAoaTogdGYuVGVuc29yM0QpID0+IHRmLmltYWdlLnJlc2l6ZUJpbGluZWFyKGksIHNpemUsIGFsaWduQ29ybmVycykpO1xuXG4gICAgY29uc3Qgb3V0cHV0ID0gZyhpbnB1dCwgZHkpO1xuICAgIGNvbnN0IGV4cGVjdGVkID1cbiAgICAgICAgWzEuMCwgMi4wLCAzLjAsIDQuMCwgNS4wLCA2LjAsIDcuMCwgOC4wLCA5LjAsIDEwLjAsIDExLjAsIDEyLjBdO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IG91dHB1dC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG59KTtcbiJdfQ==