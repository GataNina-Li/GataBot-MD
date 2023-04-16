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
describeWithFlags('conv2dTranspose', ALL_ENVS, () => {
    it('input=2x2x1,d2=1,f=2,s=1,p=0', async () => {
        const origInputDepth = 1;
        const origOutputDepth = 1;
        const inputShape = [1, 1, origOutputDepth];
        const fSize = 2;
        const origPad = 0;
        const origStride = 1;
        const x = tf.tensor3d([2], inputShape);
        const w = tf.tensor4d([3, 1, 5, 0], [fSize, fSize, origInputDepth, origOutputDepth]);
        const result = tf.conv2dTranspose(x, w, [2, 2, 1], origStride, origPad);
        const expected = [6, 2, 10, 0];
        expect(result.shape).toEqual([2, 2, 1]);
        expectArraysClose(await result.data(), expected);
    });
    it('input=3x3x1,d2=1,f=2,s=2,p=same', async () => {
        const origInputDepth = 1;
        const origOutputDepth = 4;
        const inputShape = [1, 2, 2, origOutputDepth];
        const fSize = 2;
        const origPad = 'same';
        const origStride = 2;
        const x = tf.tensor4d([
            1.24, 1.66, 0.9, 1.39, 0.16, 0.27, 0.42, 0.61, 0.04, 0.17, 0.34, 0.28,
            0., 0.06, 0.14, 0.24
        ], inputShape);
        const w = tf.tensor4d([0., 1., 2., 3., 4., 5., 6., 7., 8., 9., 10., 11., 12., 13., 14., 15.], [fSize, fSize, origInputDepth, origOutputDepth]);
        const result = tf.conv2dTranspose(x, w, [1, 3, 3, 1], origStride, origPad);
        const expected = [7.63, 28.39, 2.94, 49.15, 69.91, 14.62, 1.69, 5.01, 1.06];
        expect(result.shape).toEqual([1, 3, 3, 1]);
        expectArraysClose(await result.data(), expected);
    });
    it('input=3x3x1,d2=1,f=2,s=2,p=explicit', async () => {
        const origInputDepth = 1;
        const origOutputDepth = 4;
        const inputShape = [1, 2, 2, origOutputDepth];
        const fSize = 2;
        const origPad = [[0, 0], [0, 1], [0, 1], [0, 0]];
        const origStride = 2;
        const x = tf.tensor4d([
            1.24, 1.66, 0.9, 1.39, 0.16, 0.27, 0.42, 0.61, 0.04, 0.17, 0.34, 0.28,
            0., 0.06, 0.14, 0.24
        ], inputShape);
        const w = tf.tensor4d([0., 1., 2., 3., 4., 5., 6., 7., 8., 9., 10., 11., 12., 13., 14., 15.], [fSize, fSize, origInputDepth, origOutputDepth]);
        const result = tf.conv2dTranspose(x, w, [1, 3, 3, 1], origStride, origPad);
        const expected = [7.63, 28.39, 2.94, 49.15, 69.91, 14.62, 1.69, 5.01, 1.06];
        expect(result.shape).toEqual([1, 3, 3, 1]);
        expectArraysClose(await result.data(), expected);
    });
    it('input=2x2x1,d2=1,f=2,s=1,p=0, batch=2', async () => {
        const origInputDepth = 1;
        const origOutputDepth = 1;
        const inputShape = [2, 1, 1, origOutputDepth];
        const fSize = 2;
        const origPad = 0;
        const origStride = 1;
        const x = tf.tensor4d([2, 3], inputShape);
        const w = tf.tensor4d([3, 1, 5, 0], [fSize, fSize, origInputDepth, origOutputDepth]);
        const result = tf.conv2dTranspose(x, w, [2, 2, 2, 1], origStride, origPad);
        const expected = [6, 2, 10, 0, 9, 3, 15, 0];
        expect(result.shape).toEqual([2, 2, 2, 1]);
        expectArraysClose(await result.data(), expected);
    });
    it('input=2x2x2,output=3x3x2,f=2,s=2,inDepth=2,p=same', async () => {
        const origInputDepth = 2;
        const origOutputDepth = 2;
        const inputShape = [1, 2, 2, origOutputDepth];
        const fSize = 2;
        const origPad = 'same';
        const origStride = 2;
        const x = tf.tensor4d([0., 1., 2., 3., 4., 5., 6., 7.], inputShape);
        const w = tf.tensor4d([0., 1., 2., 3., 4., 5., 6., 7., 8., 9., 10., 11., 12., 13., 14., 15.], [fSize, fSize, origInputDepth, origOutputDepth]);
        const result = tf.conv2dTranspose(x, w, [1, 3, 3, origInputDepth], origStride, origPad);
        const expected = [1, 3, 5, 7, 3, 13, 9, 11, 13, 15, 43, 53, 5, 23, 41, 59, 7, 33.];
        expect(result.shape).toEqual([1, 3, 3, origInputDepth]);
        expectArraysClose(await result.data(), expected);
    });
    it('throws when dimRoundingMode is set and pad is same', async () => {
        const origInputDepth = 1;
        const origOutputDepth = 4;
        const inputShape = [1, 2, 2, origOutputDepth];
        const fSize = 2;
        const origPad = 'same';
        const origStride = 2;
        const dimRoundingMode = 'round';
        const x = tf.tensor4d([
            1.24, 1.66, 0.9, 1.39, 0.16, 0.27, 0.42, 0.61, 0.04, 0.17, 0.34, 0.28,
            0., 0.06, 0.14, 0.24
        ], inputShape);
        const w = tf.tensor4d([0., 1., 2., 3., 4., 5., 6., 7., 8., 9., 10., 11., 12., 13., 14., 15.], [fSize, fSize, origInputDepth, origOutputDepth]);
        expect(() => tf.conv2dTranspose(x, w, [1, 3, 3, 1], origStride, origPad, dimRoundingMode))
            .toThrowError();
    });
    it('throws when dimRoundingMode is set and pad is valid', async () => {
        const origInputDepth = 1;
        const origOutputDepth = 4;
        const inputShape = [1, 2, 2, origOutputDepth];
        const fSize = 2;
        const origPad = 'valid';
        const origStride = 2;
        const dimRoundingMode = 'round';
        const x = tf.tensor4d([
            1.24, 1.66, 0.9, 1.39, 0.16, 0.27, 0.42, 0.61, 0.04, 0.17, 0.34, 0.28,
            0., 0.06, 0.14, 0.24
        ], inputShape);
        const w = tf.tensor4d([0., 1., 2., 3., 4., 5., 6., 7., 8., 9., 10., 11., 12., 13., 14., 15.], [fSize, fSize, origInputDepth, origOutputDepth]);
        expect(() => tf.conv2dTranspose(x, w, [1, 3, 3, 1], origStride, origPad, dimRoundingMode))
            .toThrowError();
    });
    it('throws when dimRoundingMode is set and pad is a non-integer number', async () => {
        const origInputDepth = 1;
        const origOutputDepth = 4;
        const inputShape = [1, 2, 2, origOutputDepth];
        const fSize = 2;
        const origPad = 1.2;
        const origStride = 2;
        const dimRoundingMode = 'round';
        const x = tf.tensor4d([
            1.24, 1.66, 0.9, 1.39, 0.16, 0.27, 0.42, 0.61, 0.04, 0.17, 0.34,
            0.28, 0., 0.06, 0.14, 0.24
        ], inputShape);
        const w = tf.tensor4d([
            0., 1., 2., 3., 4., 5., 6., 7., 8., 9., 10., 11., 12., 13., 14.,
            15.
        ], [fSize, fSize, origInputDepth, origOutputDepth]);
        expect(() => tf.conv2dTranspose(x, w, [1, 3, 3, 1], origStride, origPad, dimRoundingMode))
            .toThrowError();
    });
    it('throws when dimRoundingMode is set and pad is explicit by non-integer ' +
        'number', async () => {
        const origInputDepth = 1;
        const origOutputDepth = 4;
        const inputShape = [1, 2, 2, origOutputDepth];
        const fSize = 2;
        const origPad = [[0, 0], [0, 1.1], [0, 1], [0, 0]];
        const origStride = 2;
        const dimRoundingMode = 'round';
        const x = tf.tensor4d([
            1.24, 1.66, 0.9, 1.39, 0.16, 0.27, 0.42, 0.61, 0.04, 0.17, 0.34,
            0.28, 0., 0.06, 0.14, 0.24
        ], inputShape);
        const w = tf.tensor4d([
            0., 1., 2., 3., 4., 5., 6., 7., 8., 9., 10., 11., 12., 13., 14.,
            15.
        ], [fSize, fSize, origInputDepth, origOutputDepth]);
        expect(() => tf.conv2dTranspose(x, w, [1, 3, 3, 1], origStride, origPad, dimRoundingMode))
            .toThrowError();
    });
    // Reference (Python) TensorFlow code:
    //
    // ```py
    // import numpy as np
    // import tensorflow as tf
    //
    // tf.enable_eager_execution()
    //
    // x = tf.constant(np.array([[
    //     [[-0.14656299], [0.32942239], [-1.90302866]],
    //     [[-0.06487813], [-2.02637842], [-1.83669377]],
    //     [[0.82650784], [-0.89249092], [0.01207666]]
    // ]]).astype(np.float32))
    // filt = tf.constant(np.array([
    //     [[[-0.48280062], [1.26770487]], [[-0.83083738], [0.54341856]]],
    //     [[[-0.274904], [0.73111374]], [[2.01885189], [-2.68975237]]]
    // ]).astype(np.float32))
    //
    // with tf.GradientTape() as g:
    //   g.watch(x)
    //   g.watch(filt)
    //   y = tf.keras.backend.conv2d_transpose(x, filt, [1, 4, 4, 2])
    //   print(y)
    // (x_grad, filt_grad) = g.gradient(y, [x, filt])
    //
    // print("x_grad = %s" % x_grad)
    // print("filt_grad = %s" % filt_grad)
    // ```
    it('gradient with clones input=[1,3,3,1] f=[2,2,2,1] s=1 padding=valid', async () => {
        const inputDepth = 1;
        const outputDepth = 2;
        const inputShape = [1, 3, 3, inputDepth];
        const filterSize = 2;
        const stride = 1;
        const pad = 'valid';
        const filterShape = [filterSize, filterSize, outputDepth, inputDepth];
        const x = tf.tensor4d([[
                [[-0.14656299], [0.32942239], [-1.90302866]],
                [[-0.06487813], [-2.02637842], [-1.83669377]],
                [[0.82650784], [-0.89249092], [0.01207666]]
            ]], inputShape);
        const filt = tf.tensor4d([
            [[[-0.48280062], [1.26770487]], [[-0.83083738], [0.54341856]]],
            [[[-0.274904], [0.73111374]], [[2.01885189], [-2.68975237]]]
        ], filterShape);
        const grads = tf.grads((x, filter) => tf.conv2dTranspose(x.clone(), filter.clone(), [1, 4, 4, outputDepth], stride, pad)
            .clone());
        const dy = tf.ones([1, 4, 4, outputDepth]);
        const [xGrad, filtGrad] = grads([x, filt], dy);
        const expectedXGrad = tf.ones([1, 3, 3, 1]).mul(tf.scalar(0.2827947));
        expectArraysClose(await xGrad.data(), await expectedXGrad.data());
        const expectedFiltGrad = tf.ones([2, 2, 2, 1]).mul(tf.scalar(-5.70202599));
        expectArraysClose(await filtGrad.data(), await expectedFiltGrad.data());
    });
    // Reference (Python) TensorFlow code:
    //
    // ```py
    // import numpy as np
    // import tensorflow as tf
    //
    // tf.enable_eager_execution()
    //
    // x = tf.constant(np.array([
    //     [[[-0.36541713], [-0.53973116]], [[0.01731674], [0.90227772]]]
    // ]).astype(np.float32))
    // filt = tf.constant(np.array([
    //     [[[-0.01423461], [-1.00267384]], [[1.61163029], [0.66302646]]],
    //     [[[-0.46900087], [-0.78649444]], [[0.87780536], [-0.84551637]]]
    // ]).astype(np.float32))
    //
    // with tf.GradientTape() as g:
    //   g.watch(x)
    //   g.watch(filt)
    //   y = tf.keras.backend.conv2d_transpose(x, filt, [1, 4, 4, 2], strides=(2,
    //   2)) print(y)
    // (x_grad, filt_grad) = g.gradient(y, [x, filt])
    //
    // print("x_grad = %s" % -x_grad)
    // print("filt_grad = %s" % -filt_grad)
    // ```
    it('gradient input=[1,2,2,1] f=[2,2,2,1] s=[2,2] padding=valid', async () => {
        const inputDepth = 1;
        const outputDepth = 2;
        const inputShape = [1, 2, 2, inputDepth];
        const filterSize = 2;
        const stride = [2, 2];
        const pad = 'valid';
        const filterShape = [filterSize, filterSize, outputDepth, inputDepth];
        const x = tf.tensor4d([[[[-0.36541713], [-0.53973116]], [[0.01731674], [0.90227772]]]], inputShape);
        const filt = tf.tensor4d([
            [[[-0.01423461], [-1.00267384]], [[1.61163029], [0.66302646]]],
            [[[-0.46900087], [-0.78649444]], [[0.87780536], [-0.84551637]]]
        ], filterShape);
        const grads = tf.grads((x, filter) => tf.conv2dTranspose(x, filter, [1, 4, 4, outputDepth], stride, pad));
        const dy = tf.ones([1, 4, 4, outputDepth]).mul(tf.scalar(-1));
        const [xGrad, filtGrad] = grads([x, filt], dy);
        const expectedXGrad = tf.ones([1, 2, 2, 1]).mul(tf.scalar(-0.03454196));
        expectArraysClose(await xGrad.data(), await expectedXGrad.data());
        expect(xGrad.shape).toEqual([1, 2, 2, 1]);
        const expectedFiltGrad = tf.ones([2, 2, 2, 1]).mul(tf.scalar(-0.01444618));
        expectArraysClose(await filtGrad.data(), await expectedFiltGrad.data());
        expect(filtGrad.shape).toEqual([2, 2, 2, 1]);
    });
    // Reference (Python) TensorFlow code:
    //
    // ```py
    // import numpy as np
    // import tensorflow as tf
    //
    // tf.enable_eager_execution()
    //
    // x = tf.constant(np.array([[
    //     [[1.52433065], [-0.77053435], [-0.64562341]],
    //     [[0.77962889], [1.58413887], [-0.25581856]],
    //     [[-0.58966221], [0.05411662], [0.70749138]]
    // ]]).astype(np.float32))
    // filt = tf.constant(np.array([
    //     [[[0.11178388], [-0.96654977]], [[1.21021296], [0.84121729]]],
    //     [[[0.34968338], [-0.42306114]], [[1.27395733], [-1.09014535]]]
    // ]).astype(np.float32))
    //
    // with tf.GradientTape() as g:
    //   g.watch(x)
    //   g.watch(filt)
    //   y = tf.keras.backend.conv2d_transpose(
    //       x, filt, [1, 3, 3, 2], strides=(1, 1), padding='same')
    // (x_grad, filt_grad) = g.gradient(y, [x, filt])
    //
    // print("x_grad = %s" % x_grad)
    // print("filt_grad = %s" % filt_grad)
    // ```
    it('gradient input=[1,3,3,1] f=[2,2,2,1] s=[1,1] padding=same', async () => {
        const inputDepth = 1;
        const outputDepth = 2;
        const inputShape = [1, 3, 3, inputDepth];
        const filterSize = 2;
        const stride = [1, 1];
        const pad = 'same';
        const filterShape = [filterSize, filterSize, outputDepth, inputDepth];
        const x = tf.tensor4d([[
                [[1.52433065], [-0.77053435], [-0.64562341]],
                [[0.77962889], [1.58413887], [-0.25581856]],
                [[-0.58966221], [0.05411662], [0.70749138]]
            ]], inputShape);
        const filt = tf.tensor4d([
            [[[0.11178388], [-0.96654977]], [[1.21021296], [0.84121729]]],
            [[[0.34968338], [-0.42306114]], [[1.27395733], [-1.09014535]]]
        ], filterShape);
        const grads = tf.grads((x, filter) => tf.conv2dTranspose(x, filter, [1, 3, 3, outputDepth], stride, pad));
        const dy = tf.ones([1, 3, 3, outputDepth]);
        const [xGrad, filtGrad] = grads([x, filt], dy);
        expectArraysClose(await xGrad.array(), [[
                [[1.30709858], [1.30709858], [-0.92814366]],
                [[1.30709858], [1.30709858], [-0.92814366]],
                [[1.19666437], [1.19666437], [-0.85476589]]
            ]]);
        expectArraysClose(await filtGrad.array(), [
            [[[2.38806788], [2.38806788]], [[2.58201847], [2.58201847]]],
            [[[2.2161221], [2.2161221]], [[3.11756406], [3.11756406]]]
        ]);
    });
    it('gradient input=[1,3,3,1] f=[2,2,2,1] s=[1,1] p=explicit', async () => {
        const inputDepth = 1;
        const outputDepth = 2;
        const inputShape = [1, 3, 3, inputDepth];
        const filterSize = 2;
        const stride = [1, 1];
        const pad = [[0, 0], [0, 1], [0, 1], [0, 0]];
        const filterShape = [filterSize, filterSize, outputDepth, inputDepth];
        const x = tf.tensor4d([[
                [[1.52433065], [-0.77053435], [-0.64562341]],
                [[0.77962889], [1.58413887], [-0.25581856]],
                [[-0.58966221], [0.05411662], [0.70749138]]
            ]], inputShape);
        const filt = tf.tensor4d([
            [[[0.11178388], [-0.96654977]], [[1.21021296], [0.84121729]]],
            [[[0.34968338], [-0.42306114]], [[1.27395733], [-1.09014535]]]
        ], filterShape);
        const grads = tf.grads((x, filter) => tf.conv2dTranspose(x, filter, [1, 3, 3, outputDepth], stride, pad));
        const dy = tf.ones([1, 3, 3, outputDepth]);
        const [xGrad, filtGrad] = grads([x, filt], dy);
        expectArraysClose(await xGrad.array(), [[
                [[1.30709858], [1.30709858], [-0.92814366]],
                [[1.30709858], [1.30709858], [-0.92814366]],
                [[1.19666437], [1.19666437], [-0.85476589]]
            ]]);
        expectArraysClose(await filtGrad.array(), [
            [[[2.38806788], [2.38806788]], [[2.58201847], [2.58201847]]],
            [[[2.2161221], [2.2161221]], [[3.11756406], [3.11756406]]]
        ]);
    });
    // Reference (Python) TensorFlow code:
    //
    // ```py
    // import numpy as np
    // import tensorflow as tf
    //
    // tf.enable_eager_execution()
    //
    // x = tf.constant(np.array([[
    //     [[1.52433065], [-0.77053435]], [[0.77962889], [1.58413887]],
    // ]]).astype(np.float32))
    // filt = tf.constant(np.array([
    //     [[[0.11178388], [-0.96654977]], [[1.21021296], [0.84121729]]],
    //     [[[0.34968338], [-0.42306114]], [[1.27395733], [-1.09014535]]]
    // ]).astype(np.float32))
    //
    // with tf.GradientTape() as g:
    //   g.watch(x)
    //   g.watch(filt)
    //   y = tf.keras.backend.conv2d_transpose(
    //       x, filt, [1, 3, 3, 2], strides=(2, 2), padding='same')
    //   print(y.shape)
    // (x_grad, filt_grad) = g.gradient(y, [x, filt])
    //
    // print("x_grad = %s" % x_grad)
    // print("filt_grad = %s" % filt_grad)
    // ```
    it('gradient input=[1,2,2,2] f=[2,2,2,1] s=[2,2] padding=same', async () => {
        const inputDepth = 2;
        const outputDepth = 2;
        const inputShape = [1, 2, 2, inputDepth];
        const filterSize = 2;
        const stride = [2, 2];
        const pad = 'same';
        const filterShape = [filterSize, filterSize, outputDepth, inputDepth];
        const x = tf.tensor4d([[
                [[-1.81506593, 1.00900095], [-0.05199118, 0.26311377]],
                [[-1.18469792, -0.34780521], [2.04971242, -0.65154692]]
            ]], inputShape);
        const filt = tf.tensor4d([
            [
                [[0.19529686, -0.79594708], [0.70314057, -0.06081263]],
                [[0.28724744, 0.88522715], [-0.51824096, -0.97120989]]
            ],
            [
                [[0.51872197, -1.17569193], [1.28316791, -0.81225092]],
                [[-0.44221532, 0.70058174], [-0.4849217, 0.03806348]]
            ]
        ], filterShape);
        const grads = tf.grads((x, filter) => tf.conv2dTranspose(x, filter, [1, 3, 3, outputDepth], stride, pad));
        const dy = tf.ones([1, 3, 3, outputDepth]);
        const [xGrad, filtGrad] = grads([x, filt], dy);
        expectArraysClose(await xGrad.data(), [
            1.54219678, -2.19204008, 2.70032732, -2.84470257, 0.66744391, -0.94274245,
            0.89843743, -0.85675972
        ]);
        expect(xGrad.shape).toEqual([1, 2, 2, 2]);
        expectArraysClose(await filtGrad.data(), [
            -1.00204261, 0.27276259, -1.00204261, 0.27276259, -2.99976385, 0.66119574,
            -2.99976385, 0.66119574, -1.86705711, 1.27211472, -1.86705711, 1.27211472,
            -1.81506593, 1.00900095, -1.81506593, 1.00900095
        ]);
        expect(filtGrad.shape).toEqual([2, 2, 2, 2]);
    });
    it('throws when x is not rank 3', () => {
        const origInputDepth = 1;
        const origOutputDepth = 1;
        const fSize = 2;
        const origPad = 0;
        const origStride = 1;
        // tslint:disable-next-line:no-any
        const x = tf.tensor2d([2, 2], [2, 1]);
        const w = tf.tensor4d([3, 1, 5, 0], [fSize, fSize, origInputDepth, origOutputDepth]);
        expect(() => tf.conv2dTranspose(x, w, [2, 2, 1], origStride, origPad))
            .toThrowError();
    });
    it('throws when weights is not rank 4', () => {
        const origInputDepth = 1;
        const origOutputDepth = 1;
        const inputShape = [1, 1, origOutputDepth];
        const fSize = 2;
        const origPad = 0;
        const origStride = 1;
        const x = tf.tensor3d([2], inputShape);
        // tslint:disable-next-line:no-any
        const w = tf.tensor3d([3, 1, 5, 0], [fSize, fSize, origInputDepth]);
        expect(() => tf.conv2dTranspose(x, w, [2, 2, 1], origStride, origPad))
            .toThrowError();
    });
    it('throws when x depth does not match weights original output depth', () => {
        const origInputDepth = 1;
        const origOutputDepth = 2;
        const wrongOrigOutputDepth = 3;
        const inputShape = [1, 1, origOutputDepth];
        const fSize = 2;
        const origPad = 0;
        const origStride = 1;
        const x = tf.tensor3d([2, 2], inputShape);
        const w = tf.randomNormal([fSize, fSize, origInputDepth, wrongOrigOutputDepth]);
        expect(() => tf.conv2dTranspose(x, w, [2, 2, 2], origStride, origPad))
            .toThrowError();
    });
    it('throws when passed x as a non-tensor', () => {
        const origInputDepth = 1;
        const origOutputDepth = 1;
        const fSize = 2;
        const origPad = 0;
        const origStride = 1;
        const w = tf.tensor4d([3, 1, 5, 0], [fSize, fSize, origInputDepth, origOutputDepth]);
        expect(() => tf.conv2dTranspose({}, w, [2, 2, 1], origStride, origPad))
            .toThrowError(/Argument 'x' passed to 'conv2dTranspose' must be a Tensor/);
    });
    it('throws when passed filter as a non-tensor', () => {
        const origOutputDepth = 1;
        const inputShape = [1, 1, origOutputDepth];
        const origPad = 0;
        const origStride = 1;
        const x = tf.tensor3d([2], inputShape);
        expect(() => tf.conv2dTranspose(x, {}, [2, 2, 1], origStride, origPad))
            .toThrowError(/Argument 'filter' passed to 'conv2dTranspose' must be a Tensor/);
    });
    it('accepts a tensor-like object', async () => {
        const origPad = 0;
        const origStride = 1;
        const x = [[[2]]]; // 1x1x1
        const w = [[[[3]], [[1]]], [[[5]], [[0]]]]; // 2x2x1x1
        const result = tf.conv2dTranspose(x, w, [2, 2, 1], origStride, origPad);
        const expected = [6, 2, 10, 0];
        expect(result.shape).toEqual([2, 2, 1]);
        expectArraysClose(await result.data(), expected);
    });
    it('input=8x8x8,output=4x4x8,f=8,s=1,inDepth=8,p=same vec4', async () => {
        const origInputDepth = 8;
        const origOutputDepth = 8;
        const inputShape = [1, 8, 8, origOutputDepth];
        const fSize = 8;
        const origPad = 'same';
        const origStride = [1, 1];
        const wShape = [fSize, fSize, origInputDepth, origOutputDepth];
        const inputData = [];
        for (let i = 0; i < fSize * fSize * origInputDepth; i++) {
            inputData.push(i % 5);
        }
        const wData = [];
        for (let i = 0; i < fSize * fSize * origInputDepth * origOutputDepth; i++) {
            wData.push(i % 5);
        }
        const x = tf.tensor4d(inputData, inputShape);
        const w = tf.tensor4d(wData, wShape);
        const result = tf.conv2dTranspose(x, w, [1, 4, 4, origInputDepth], origStride, origPad);
        expect(result.shape).toEqual([1, 4, 4, 8]);
        const expected = [
            512, 533, 469, 550, 506, 512, 533, 469, 550, 506, 512, 533, 469, 550, 506,
            512, 533, 469, 550, 506, 512, 533, 469, 550, 506, 512, 533, 469, 550, 506,
            512, 533, 506, 512, 533, 469, 550, 506, 512, 533, 469, 550, 506, 512, 533,
            469, 550, 506, 512, 533, 469, 550, 506, 512, 533, 469, 550, 506, 512, 533,
            469, 550, 506, 512, 550, 506, 512, 533, 469, 550, 506, 512, 533, 469, 550,
            506, 512, 533, 469, 550, 506, 512, 533, 469, 550, 506, 512, 533, 469, 550,
            506, 512, 533, 469, 550, 506, 469, 550, 506, 512, 533, 469, 550, 506, 512,
            533, 469, 550, 506, 512, 533, 469, 550, 506, 512, 533, 469, 550, 506, 512,
            533, 469, 550, 506, 512, 533, 469, 550
        ];
        expectArraysClose(await result.data(), expected);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udjJkX3RyYW5zcG9zZV90ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvY29udjJkX3RyYW5zcG9zZV90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFHL0MsaUJBQWlCLENBQUMsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUNsRCxFQUFFLENBQUMsOEJBQThCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDNUMsTUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sZUFBZSxHQUFHLENBQUMsQ0FBQztRQUMxQixNQUFNLFVBQVUsR0FBNkIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDbEIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBRXJCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN2QyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUNqQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQztRQUVuRSxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsRUFB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TSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTNDLE1BQU0sUUFBUSxHQUFHO1lBQ2YsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHO1lBQ3pFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRztZQUN6RSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUc7WUFDekUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHO1lBQ3pFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRztZQUN6RSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUc7WUFDekUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHO1lBQ3pFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRztZQUN6RSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRztTQUN2QyxDQUFDO1FBQ0YsaUJBQWlCLENBQUMsTUFBTSxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDbkQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0ICogYXMgdGYgZnJvbSAnLi4vaW5kZXgnO1xuaW1wb3J0IHtBTExfRU5WUywgZGVzY3JpYmVXaXRoRmxhZ3N9IGZyb20gJy4uL2phc21pbmVfdXRpbCc7XG5pbXBvcnQge2V4cGVjdEFycmF5c0Nsb3NlfSBmcm9tICcuLi90ZXN0X3V0aWwnO1xuaW1wb3J0IHtSYW5rfSBmcm9tICcuLi90eXBlcyc7XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCdjb252MmRUcmFuc3Bvc2UnLCBBTExfRU5WUywgKCkgPT4ge1xuICBpdCgnaW5wdXQ9MngyeDEsZDI9MSxmPTIscz0xLHA9MCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBvcmlnSW5wdXREZXB0aCA9IDE7XG4gICAgY29uc3Qgb3JpZ091dHB1dERlcHRoID0gMTtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMSwgMSwgb3JpZ091dHB1dERlcHRoXTtcbiAgICBjb25zdCBmU2l6ZSA9IDI7XG4gICAgY29uc3Qgb3JpZ1BhZCA9IDA7XG4gICAgY29uc3Qgb3JpZ1N0cmlkZSA9IDE7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yM2QoWzJdLCBpbnB1dFNoYXBlKTtcbiAgICBjb25zdCB3ID0gdGYudGVuc29yNGQoXG4gICAgICAgIFszLCAxLCA1LCAwXSwgW2ZTaXplLCBmU2l6ZSwgb3JpZ0lucHV0RGVwdGgsIG9yaWdPdXRwdXREZXB0aF0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuY29udjJkVHJhbnNwb3NlKHgsIHcsIFsyLCAyLCAxXSwgb3JpZ1N0cmlkZSwgb3JpZ1BhZCk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbNiwgMiwgMTAsIDBdO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMiwgMiwgMV0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2lucHV0PTN4M3gxLGQyPTEsZj0yLHM9MixwPXNhbWUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qgb3JpZ0lucHV0RGVwdGggPSAxO1xuICAgIGNvbnN0IG9yaWdPdXRwdXREZXB0aCA9IDQ7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPVxuICAgICAgICBbMSwgMiwgMiwgb3JpZ091dHB1dERlcHRoXTtcbiAgICBjb25zdCBmU2l6ZSA9IDI7XG4gICAgY29uc3Qgb3JpZ1BhZCA9ICdzYW1lJztcbiAgICBjb25zdCBvcmlnU3RyaWRlID0gMjtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgW1xuICAgICAgICAgIDEuMjQsIDEuNjYsIDAuOSwgMS4zOSwgMC4xNiwgMC4yNywgMC40MiwgMC42MSwgMC4wNCwgMC4xNywgMC4zNCwgMC4yOCxcbiAgICAgICAgICAwLiwgMC4wNiwgMC4xNCwgMC4yNFxuICAgICAgICBdLFxuICAgICAgICBpbnB1dFNoYXBlKTtcbiAgICBjb25zdCB3ID0gdGYudGVuc29yNGQoXG4gICAgICAgIFswLiwgMS4sIDIuLCAzLiwgNC4sIDUuLCA2LiwgNy4sIDguLCA5LiwgMTAuLCAxMS4sIDEyLiwgMTMuLCAxNC4sIDE1Ll0sXG4gICAgICAgIFtmU2l6ZSwgZlNpemUsIG9yaWdJbnB1dERlcHRoLCBvcmlnT3V0cHV0RGVwdGhdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmNvbnYyZFRyYW5zcG9zZSh4LCB3LCBbMSwgMywgMywgMV0sIG9yaWdTdHJpZGUsIG9yaWdQYWQpO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gWzcuNjMsIDI4LjM5LCAyLjk0LCA0OS4xNSwgNjkuOTEsIDE0LjYyLCAxLjY5LCA1LjAxLCAxLjA2XTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzEsIDMsIDMsIDFdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCdpbnB1dD0zeDN4MSxkMj0xLGY9MixzPTIscD1leHBsaWNpdCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBvcmlnSW5wdXREZXB0aCA9IDE7XG4gICAgY29uc3Qgb3JpZ091dHB1dERlcHRoID0gNDtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9XG4gICAgICAgIFsxLCAyLCAyLCBvcmlnT3V0cHV0RGVwdGhdO1xuICAgIGNvbnN0IGZTaXplID0gMjtcbiAgICBjb25zdCBvcmlnUGFkID1cbiAgICAgICAgW1swLCAwXSwgWzAsIDFdLCBbMCwgMV0sIFswLCAwXV0gYXMgdGYuYmFja2VuZF91dGlsLkV4cGxpY2l0UGFkZGluZztcbiAgICBjb25zdCBvcmlnU3RyaWRlID0gMjtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgW1xuICAgICAgICAgIDEuMjQsIDEuNjYsIDAuOSwgMS4zOSwgMC4xNiwgMC4yNywgMC40MiwgMC42MSwgMC4wNCwgMC4xNywgMC4zNCwgMC4yOCxcbiAgICAgICAgICAwLiwgMC4wNiwgMC4xNCwgMC4yNFxuICAgICAgICBdLFxuICAgICAgICBpbnB1dFNoYXBlKTtcbiAgICBjb25zdCB3ID0gdGYudGVuc29yNGQoXG4gICAgICAgIFswLiwgMS4sIDIuLCAzLiwgNC4sIDUuLCA2LiwgNy4sIDguLCA5LiwgMTAuLCAxMS4sIDEyLiwgMTMuLCAxNC4sIDE1Ll0sXG4gICAgICAgIFtmU2l6ZSwgZlNpemUsIG9yaWdJbnB1dERlcHRoLCBvcmlnT3V0cHV0RGVwdGhdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmNvbnYyZFRyYW5zcG9zZSh4LCB3LCBbMSwgMywgMywgMV0sIG9yaWdTdHJpZGUsIG9yaWdQYWQpO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gWzcuNjMsIDI4LjM5LCAyLjk0LCA0OS4xNSwgNjkuOTEsIDE0LjYyLCAxLjY5LCA1LjAxLCAxLjA2XTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzEsIDMsIDMsIDFdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCdpbnB1dD0yeDJ4MSxkMj0xLGY9MixzPTEscD0wLCBiYXRjaD0yJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG9yaWdJbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCBvcmlnT3V0cHV0RGVwdGggPSAxO1xuICAgIGNvbnN0IGlucHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID1cbiAgICAgICAgWzIsIDEsIDEsIG9yaWdPdXRwdXREZXB0aF07XG4gICAgY29uc3QgZlNpemUgPSAyO1xuICAgIGNvbnN0IG9yaWdQYWQgPSAwO1xuICAgIGNvbnN0IG9yaWdTdHJpZGUgPSAxO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKFsyLCAzXSwgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbMywgMSwgNSwgMF0sIFtmU2l6ZSwgZlNpemUsIG9yaWdJbnB1dERlcHRoLCBvcmlnT3V0cHV0RGVwdGhdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmNvbnYyZFRyYW5zcG9zZSh4LCB3LCBbMiwgMiwgMiwgMV0sIG9yaWdTdHJpZGUsIG9yaWdQYWQpO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gWzYsIDIsIDEwLCAwLCA5LCAzLCAxNSwgMF07XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFsyLCAyLCAyLCAxXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgZXhwZWN0ZWQpO1xuICB9KTtcblxuICBpdCgnaW5wdXQ9MngyeDIsb3V0cHV0PTN4M3gyLGY9MixzPTIsaW5EZXB0aD0yLHA9c2FtZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBvcmlnSW5wdXREZXB0aCA9IDI7XG4gICAgY29uc3Qgb3JpZ091dHB1dERlcHRoID0gMjtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9XG4gICAgICAgIFsxLCAyLCAyLCBvcmlnT3V0cHV0RGVwdGhdO1xuICAgIGNvbnN0IGZTaXplID0gMjtcbiAgICBjb25zdCBvcmlnUGFkID0gJ3NhbWUnO1xuICAgIGNvbnN0IG9yaWdTdHJpZGUgPSAyO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKFswLiwgMS4sIDIuLCAzLiwgNC4sIDUuLCA2LiwgNy5dLCBpbnB1dFNoYXBlKTtcbiAgICBjb25zdCB3ID0gdGYudGVuc29yNGQoXG4gICAgICAgIFswLiwgMS4sIDIuLCAzLiwgNC4sIDUuLCA2LiwgNy4sIDguLCA5LiwgMTAuLCAxMS4sIDEyLiwgMTMuLCAxNC4sIDE1Ll0sXG4gICAgICAgIFtmU2l6ZSwgZlNpemUsIG9yaWdJbnB1dERlcHRoLCBvcmlnT3V0cHV0RGVwdGhdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmNvbnYyZFRyYW5zcG9zZShcbiAgICAgICAgeCwgdywgWzEsIDMsIDMsIG9yaWdJbnB1dERlcHRoXSwgb3JpZ1N0cmlkZSwgb3JpZ1BhZCk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPVxuICAgICAgICBbMSwgMywgNSwgNywgMywgMTMsIDksIDExLCAxMywgMTUsIDQzLCA1MywgNSwgMjMsIDQxLCA1OSwgNywgMzMuXTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzEsIDMsIDMsIG9yaWdJbnB1dERlcHRoXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgZXhwZWN0ZWQpO1xuICB9KTtcblxuICBpdCgndGhyb3dzIHdoZW4gZGltUm91bmRpbmdNb2RlIGlzIHNldCBhbmQgcGFkIGlzIHNhbWUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qgb3JpZ0lucHV0RGVwdGggPSAxO1xuICAgIGNvbnN0IG9yaWdPdXRwdXREZXB0aCA9IDQ7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPVxuICAgICAgICBbMSwgMiwgMiwgb3JpZ091dHB1dERlcHRoXTtcbiAgICBjb25zdCBmU2l6ZSA9IDI7XG4gICAgY29uc3Qgb3JpZ1BhZCA9ICdzYW1lJztcbiAgICBjb25zdCBvcmlnU3RyaWRlID0gMjtcbiAgICBjb25zdCBkaW1Sb3VuZGluZ01vZGUgPSAncm91bmQnO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbXG4gICAgICAgICAgMS4yNCwgMS42NiwgMC45LCAxLjM5LCAwLjE2LCAwLjI3LCAwLjQyLCAwLjYxLCAwLjA0LCAwLjE3LCAwLjM0LCAwLjI4LFxuICAgICAgICAgIDAuLCAwLjA2LCAwLjE0LCAwLjI0XG4gICAgICAgIF0sXG4gICAgICAgIGlucHV0U2hhcGUpO1xuICAgIGNvbnN0IHcgPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWzAuLCAxLiwgMi4sIDMuLCA0LiwgNS4sIDYuLCA3LiwgOC4sIDkuLCAxMC4sIDExLiwgMTIuLCAxMy4sIDE0LiwgMTUuXSxcbiAgICAgICAgW2ZTaXplLCBmU2l6ZSwgb3JpZ0lucHV0RGVwdGgsIG9yaWdPdXRwdXREZXB0aF0pO1xuXG4gICAgZXhwZWN0KFxuICAgICAgICAoKSA9PiB0Zi5jb252MmRUcmFuc3Bvc2UoXG4gICAgICAgICAgICB4LCB3LCBbMSwgMywgMywgMV0sIG9yaWdTdHJpZGUsIG9yaWdQYWQsIGRpbVJvdW5kaW5nTW9kZSkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyB3aGVuIGRpbVJvdW5kaW5nTW9kZSBpcyBzZXQgYW5kIHBhZCBpcyB2YWxpZCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBvcmlnSW5wdXREZXB0aCA9IDE7XG4gICAgY29uc3Qgb3JpZ091dHB1dERlcHRoID0gNDtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9XG4gICAgICAgIFsxLCAyLCAyLCBvcmlnT3V0cHV0RGVwdGhdO1xuICAgIGNvbnN0IGZTaXplID0gMjtcbiAgICBjb25zdCBvcmlnUGFkID0gJ3ZhbGlkJztcbiAgICBjb25zdCBvcmlnU3RyaWRlID0gMjtcbiAgICBjb25zdCBkaW1Sb3VuZGluZ01vZGUgPSAncm91bmQnO1xuXG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbXG4gICAgICAgICAgMS4yNCwgMS42NiwgMC45LCAxLjM5LCAwLjE2LCAwLjI3LCAwLjQyLCAwLjYxLCAwLjA0LCAwLjE3LCAwLjM0LCAwLjI4LFxuICAgICAgICAgIDAuLCAwLjA2LCAwLjE0LCAwLjI0XG4gICAgICAgIF0sXG4gICAgICAgIGlucHV0U2hhcGUpO1xuICAgIGNvbnN0IHcgPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWzAuLCAxLiwgMi4sIDMuLCA0LiwgNS4sIDYuLCA3LiwgOC4sIDkuLCAxMC4sIDExLiwgMTIuLCAxMy4sIDE0LiwgMTUuXSxcbiAgICAgICAgW2ZTaXplLCBmU2l6ZSwgb3JpZ0lucHV0RGVwdGgsIG9yaWdPdXRwdXREZXB0aF0pO1xuXG4gICAgZXhwZWN0KFxuICAgICAgICAoKSA9PiB0Zi5jb252MmRUcmFuc3Bvc2UoXG4gICAgICAgICAgICB4LCB3LCBbMSwgMywgMywgMV0sIG9yaWdTdHJpZGUsIG9yaWdQYWQsIGRpbVJvdW5kaW5nTW9kZSkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyB3aGVuIGRpbVJvdW5kaW5nTW9kZSBpcyBzZXQgYW5kIHBhZCBpcyBhIG5vbi1pbnRlZ2VyIG51bWJlcicsXG4gICAgIGFzeW5jICgpID0+IHtcbiAgICAgICBjb25zdCBvcmlnSW5wdXREZXB0aCA9IDE7XG4gICAgICAgY29uc3Qgb3JpZ091dHB1dERlcHRoID0gNDtcbiAgICAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9XG4gICAgICAgICAgIFsxLCAyLCAyLCBvcmlnT3V0cHV0RGVwdGhdO1xuICAgICAgIGNvbnN0IGZTaXplID0gMjtcbiAgICAgICBjb25zdCBvcmlnUGFkID0gMS4yO1xuICAgICAgIGNvbnN0IG9yaWdTdHJpZGUgPSAyO1xuICAgICAgIGNvbnN0IGRpbVJvdW5kaW5nTW9kZSA9ICdyb3VuZCc7XG5cbiAgICAgICBjb25zdCB4ID0gdGYudGVuc29yNGQoXG4gICAgICAgICAgIFtcbiAgICAgICAgICAgICAxLjI0LCAxLjY2LCAwLjksIDEuMzksIDAuMTYsIDAuMjcsIDAuNDIsIDAuNjEsIDAuMDQsIDAuMTcsIDAuMzQsXG4gICAgICAgICAgICAgMC4yOCwgMC4sIDAuMDYsIDAuMTQsIDAuMjRcbiAgICAgICAgICAgXSxcbiAgICAgICAgICAgaW5wdXRTaGFwZSk7XG4gICAgICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFxuICAgICAgICAgICBbXG4gICAgICAgICAgICAgMC4sIDEuLCAyLiwgMy4sIDQuLCA1LiwgNi4sIDcuLCA4LiwgOS4sIDEwLiwgMTEuLCAxMi4sIDEzLiwgMTQuLFxuICAgICAgICAgICAgIDE1LlxuICAgICAgICAgICBdLFxuICAgICAgICAgICBbZlNpemUsIGZTaXplLCBvcmlnSW5wdXREZXB0aCwgb3JpZ091dHB1dERlcHRoXSk7XG5cbiAgICAgICBleHBlY3QoXG4gICAgICAgICAgICgpID0+IHRmLmNvbnYyZFRyYW5zcG9zZShcbiAgICAgICAgICAgICAgIHgsIHcsIFsxLCAzLCAzLCAxXSwgb3JpZ1N0cmlkZSwgb3JpZ1BhZCwgZGltUm91bmRpbmdNb2RlKSlcbiAgICAgICAgICAgLnRvVGhyb3dFcnJvcigpO1xuICAgICB9KTtcblxuICBpdCgndGhyb3dzIHdoZW4gZGltUm91bmRpbmdNb2RlIGlzIHNldCBhbmQgcGFkIGlzIGV4cGxpY2l0IGJ5IG5vbi1pbnRlZ2VyICcgK1xuICAgICAgICAgJ251bWJlcicsXG4gICAgIGFzeW5jICgpID0+IHtcbiAgICAgICBjb25zdCBvcmlnSW5wdXREZXB0aCA9IDE7XG4gICAgICAgY29uc3Qgb3JpZ091dHB1dERlcHRoID0gNDtcbiAgICAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9XG4gICAgICAgICAgIFsxLCAyLCAyLCBvcmlnT3V0cHV0RGVwdGhdO1xuICAgICAgIGNvbnN0IGZTaXplID0gMjtcbiAgICAgICBjb25zdCBvcmlnUGFkID0gW1swLCAwXSwgWzAsIDEuMV0sIFswLCAxXSwgWzAsIDBdXSBhc1xuICAgICAgICAgICB0Zi5iYWNrZW5kX3V0aWwuRXhwbGljaXRQYWRkaW5nO1xuICAgICAgIGNvbnN0IG9yaWdTdHJpZGUgPSAyO1xuICAgICAgIGNvbnN0IGRpbVJvdW5kaW5nTW9kZSA9ICdyb3VuZCc7XG5cbiAgICAgICBjb25zdCB4ID0gdGYudGVuc29yNGQoXG4gICAgICAgICAgIFtcbiAgICAgICAgICAgICAxLjI0LCAxLjY2LCAwLjksIDEuMzksIDAuMTYsIDAuMjcsIDAuNDIsIDAuNjEsIDAuMDQsIDAuMTcsIDAuMzQsXG4gICAgICAgICAgICAgMC4yOCwgMC4sIDAuMDYsIDAuMTQsIDAuMjRcbiAgICAgICAgICAgXSxcbiAgICAgICAgICAgaW5wdXRTaGFwZSk7XG4gICAgICAgY29uc3QgdyA9IHRmLnRlbnNvcjRkKFxuICAgICAgICAgICBbXG4gICAgICAgICAgICAgMC4sIDEuLCAyLiwgMy4sIDQuLCA1LiwgNi4sIDcuLCA4LiwgOS4sIDEwLiwgMTEuLCAxMi4sIDEzLiwgMTQuLFxuICAgICAgICAgICAgIDE1LlxuICAgICAgICAgICBdLFxuICAgICAgICAgICBbZlNpemUsIGZTaXplLCBvcmlnSW5wdXREZXB0aCwgb3JpZ091dHB1dERlcHRoXSk7XG5cbiAgICAgICBleHBlY3QoXG4gICAgICAgICAgICgpID0+IHRmLmNvbnYyZFRyYW5zcG9zZShcbiAgICAgICAgICAgICAgIHgsIHcsIFsxLCAzLCAzLCAxXSwgb3JpZ1N0cmlkZSwgb3JpZ1BhZCwgZGltUm91bmRpbmdNb2RlKSlcbiAgICAgICAgICAgLnRvVGhyb3dFcnJvcigpO1xuICAgICB9KTtcblxuICAvLyBSZWZlcmVuY2UgKFB5dGhvbikgVGVuc29yRmxvdyBjb2RlOlxuICAvL1xuICAvLyBgYGBweVxuICAvLyBpbXBvcnQgbnVtcHkgYXMgbnBcbiAgLy8gaW1wb3J0IHRlbnNvcmZsb3cgYXMgdGZcbiAgLy9cbiAgLy8gdGYuZW5hYmxlX2VhZ2VyX2V4ZWN1dGlvbigpXG4gIC8vXG4gIC8vIHggPSB0Zi5jb25zdGFudChucC5hcnJheShbW1xuICAvLyAgICAgW1stMC4xNDY1NjI5OV0sIFswLjMyOTQyMjM5XSwgWy0xLjkwMzAyODY2XV0sXG4gIC8vICAgICBbWy0wLjA2NDg3ODEzXSwgWy0yLjAyNjM3ODQyXSwgWy0xLjgzNjY5Mzc3XV0sXG4gIC8vICAgICBbWzAuODI2NTA3ODRdLCBbLTAuODkyNDkwOTJdLCBbMC4wMTIwNzY2Nl1dXG4gIC8vIF1dKS5hc3R5cGUobnAuZmxvYXQzMikpXG4gIC8vIGZpbHQgPSB0Zi5jb25zdGFudChucC5hcnJheShbXG4gIC8vICAgICBbW1stMC40ODI4MDA2Ml0sIFsxLjI2NzcwNDg3XV0sIFtbLTAuODMwODM3MzhdLCBbMC41NDM0MTg1Nl1dXSxcbiAgLy8gICAgIFtbWy0wLjI3NDkwNF0sIFswLjczMTExMzc0XV0sIFtbMi4wMTg4NTE4OV0sIFstMi42ODk3NTIzN11dXVxuICAvLyBdKS5hc3R5cGUobnAuZmxvYXQzMikpXG4gIC8vXG4gIC8vIHdpdGggdGYuR3JhZGllbnRUYXBlKCkgYXMgZzpcbiAgLy8gICBnLndhdGNoKHgpXG4gIC8vICAgZy53YXRjaChmaWx0KVxuICAvLyAgIHkgPSB0Zi5rZXJhcy5iYWNrZW5kLmNvbnYyZF90cmFuc3Bvc2UoeCwgZmlsdCwgWzEsIDQsIDQsIDJdKVxuICAvLyAgIHByaW50KHkpXG4gIC8vICh4X2dyYWQsIGZpbHRfZ3JhZCkgPSBnLmdyYWRpZW50KHksIFt4LCBmaWx0XSlcbiAgLy9cbiAgLy8gcHJpbnQoXCJ4X2dyYWQgPSAlc1wiICUgeF9ncmFkKVxuICAvLyBwcmludChcImZpbHRfZ3JhZCA9ICVzXCIgJSBmaWx0X2dyYWQpXG4gIC8vIGBgYFxuICBpdCgnZ3JhZGllbnQgd2l0aCBjbG9uZXMgaW5wdXQ9WzEsMywzLDFdIGY9WzIsMiwyLDFdIHM9MSBwYWRkaW5nPXZhbGlkJyxcbiAgICAgYXN5bmMgKCkgPT4ge1xuICAgICAgIGNvbnN0IGlucHV0RGVwdGggPSAxO1xuICAgICAgIGNvbnN0IG91dHB1dERlcHRoID0gMjtcbiAgICAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9XG4gICAgICAgICAgIFsxLCAzLCAzLCBpbnB1dERlcHRoXTtcbiAgICAgICBjb25zdCBmaWx0ZXJTaXplID0gMjtcbiAgICAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgICAgIGNvbnN0IHBhZCA9ICd2YWxpZCc7XG5cbiAgICAgICBjb25zdCBmaWx0ZXJTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPVxuICAgICAgICAgICBbZmlsdGVyU2l6ZSwgZmlsdGVyU2l6ZSwgb3V0cHV0RGVwdGgsIGlucHV0RGVwdGhdO1xuXG4gICAgICAgY29uc3QgeCA9IHRmLnRlbnNvcjRkKFxuICAgICAgICAgICBbW1xuICAgICAgICAgICAgIFtbLTAuMTQ2NTYyOTldLCBbMC4zMjk0MjIzOV0sIFstMS45MDMwMjg2Nl1dLFxuICAgICAgICAgICAgIFtbLTAuMDY0ODc4MTNdLCBbLTIuMDI2Mzc4NDJdLCBbLTEuODM2NjkzNzddXSxcbiAgICAgICAgICAgICBbWzAuODI2NTA3ODRdLCBbLTAuODkyNDkwOTJdLCBbMC4wMTIwNzY2Nl1dXG4gICAgICAgICAgIF1dLFxuICAgICAgICAgICBpbnB1dFNoYXBlKTtcbiAgICAgICBjb25zdCBmaWx0ID0gdGYudGVuc29yNGQoXG4gICAgICAgICAgIFtcbiAgICAgICAgICAgICBbW1stMC40ODI4MDA2Ml0sIFsxLjI2NzcwNDg3XV0sIFtbLTAuODMwODM3MzhdLCBbMC41NDM0MTg1Nl1dXSxcbiAgICAgICAgICAgICBbW1stMC4yNzQ5MDRdLCBbMC43MzExMTM3NF1dLCBbWzIuMDE4ODUxODldLCBbLTIuNjg5NzUyMzddXV1cbiAgICAgICAgICAgXSxcbiAgICAgICAgICAgZmlsdGVyU2hhcGUpO1xuXG4gICAgICAgY29uc3QgZ3JhZHMgPSB0Zi5ncmFkcyhcbiAgICAgICAgICAgKHg6IHRmLlRlbnNvcjRELCBmaWx0ZXI6IHRmLlRlbnNvcjREKSA9PlxuICAgICAgICAgICAgICAgdGYuY29udjJkVHJhbnNwb3NlKFxuICAgICAgICAgICAgICAgICAgICAgeC5jbG9uZSgpLCBmaWx0ZXIuY2xvbmUoKSwgWzEsIDQsIDQsIG91dHB1dERlcHRoXSwgc3RyaWRlLFxuICAgICAgICAgICAgICAgICAgICAgcGFkKVxuICAgICAgICAgICAgICAgICAgIC5jbG9uZSgpKTtcbiAgICAgICBjb25zdCBkeSA9IHRmLm9uZXMoWzEsIDQsIDQsIG91dHB1dERlcHRoXSk7XG4gICAgICAgY29uc3QgW3hHcmFkLCBmaWx0R3JhZF0gPSBncmFkcyhbeCwgZmlsdF0sIGR5KTtcblxuICAgICAgIGNvbnN0IGV4cGVjdGVkWEdyYWQgPSB0Zi5vbmVzKFsxLCAzLCAzLCAxXSkubXVsKHRmLnNjYWxhcigwLjI4Mjc5NDcpKTtcbiAgICAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCB4R3JhZC5kYXRhKCksIGF3YWl0IGV4cGVjdGVkWEdyYWQuZGF0YSgpKTtcbiAgICAgICBjb25zdCBleHBlY3RlZEZpbHRHcmFkID1cbiAgICAgICAgICAgdGYub25lcyhbMiwgMiwgMiwgMV0pLm11bCh0Zi5zY2FsYXIoLTUuNzAyMDI1OTkpKTtcbiAgICAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBmaWx0R3JhZC5kYXRhKCksIGF3YWl0IGV4cGVjdGVkRmlsdEdyYWQuZGF0YSgpKTtcbiAgICAgfSk7XG5cbiAgLy8gUmVmZXJlbmNlIChQeXRob24pIFRlbnNvckZsb3cgY29kZTpcbiAgLy9cbiAgLy8gYGBgcHlcbiAgLy8gaW1wb3J0IG51bXB5IGFzIG5wXG4gIC8vIGltcG9ydCB0ZW5zb3JmbG93IGFzIHRmXG4gIC8vXG4gIC8vIHRmLmVuYWJsZV9lYWdlcl9leGVjdXRpb24oKVxuICAvL1xuICAvLyB4ID0gdGYuY29uc3RhbnQobnAuYXJyYXkoW1xuICAvLyAgICAgW1tbLTAuMzY1NDE3MTNdLCBbLTAuNTM5NzMxMTZdXSwgW1swLjAxNzMxNjc0XSwgWzAuOTAyMjc3NzJdXV1cbiAgLy8gXSkuYXN0eXBlKG5wLmZsb2F0MzIpKVxuICAvLyBmaWx0ID0gdGYuY29uc3RhbnQobnAuYXJyYXkoW1xuICAvLyAgICAgW1tbLTAuMDE0MjM0NjFdLCBbLTEuMDAyNjczODRdXSwgW1sxLjYxMTYzMDI5XSwgWzAuNjYzMDI2NDZdXV0sXG4gIC8vICAgICBbW1stMC40NjkwMDA4N10sIFstMC43ODY0OTQ0NF1dLCBbWzAuODc3ODA1MzZdLCBbLTAuODQ1NTE2MzddXV1cbiAgLy8gXSkuYXN0eXBlKG5wLmZsb2F0MzIpKVxuICAvL1xuICAvLyB3aXRoIHRmLkdyYWRpZW50VGFwZSgpIGFzIGc6XG4gIC8vICAgZy53YXRjaCh4KVxuICAvLyAgIGcud2F0Y2goZmlsdClcbiAgLy8gICB5ID0gdGYua2VyYXMuYmFja2VuZC5jb252MmRfdHJhbnNwb3NlKHgsIGZpbHQsIFsxLCA0LCA0LCAyXSwgc3RyaWRlcz0oMixcbiAgLy8gICAyKSkgcHJpbnQoeSlcbiAgLy8gKHhfZ3JhZCwgZmlsdF9ncmFkKSA9IGcuZ3JhZGllbnQoeSwgW3gsIGZpbHRdKVxuICAvL1xuICAvLyBwcmludChcInhfZ3JhZCA9ICVzXCIgJSAteF9ncmFkKVxuICAvLyBwcmludChcImZpbHRfZ3JhZCA9ICVzXCIgJSAtZmlsdF9ncmFkKVxuICAvLyBgYGBcbiAgaXQoJ2dyYWRpZW50IGlucHV0PVsxLDIsMiwxXSBmPVsyLDIsMiwxXSBzPVsyLDJdIHBhZGRpbmc9dmFsaWQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDE7XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGlucHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzEsIDIsIDIsIGlucHV0RGVwdGhdO1xuICAgIGNvbnN0IGZpbHRlclNpemUgPSAyO1xuICAgIGNvbnN0IHN0cmlkZTogW251bWJlciwgbnVtYmVyXSA9IFsyLCAyXTtcbiAgICBjb25zdCBwYWQgPSAndmFsaWQnO1xuXG4gICAgY29uc3QgZmlsdGVyU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID1cbiAgICAgICAgW2ZpbHRlclNpemUsIGZpbHRlclNpemUsIG91dHB1dERlcHRoLCBpbnB1dERlcHRoXTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgW1tbWy0wLjM2NTQxNzEzXSwgWy0wLjUzOTczMTE2XV0sIFtbMC4wMTczMTY3NF0sIFswLjkwMjI3NzcyXV1dXSxcbiAgICAgICAgaW5wdXRTaGFwZSk7XG4gICAgY29uc3QgZmlsdCA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbXG4gICAgICAgICAgW1tbLTAuMDE0MjM0NjFdLCBbLTEuMDAyNjczODRdXSwgW1sxLjYxMTYzMDI5XSwgWzAuNjYzMDI2NDZdXV0sXG4gICAgICAgICAgW1tbLTAuNDY5MDAwODddLCBbLTAuNzg2NDk0NDRdXSwgW1swLjg3NzgwNTM2XSwgWy0wLjg0NTUxNjM3XV1dXG4gICAgICAgIF0sXG4gICAgICAgIGZpbHRlclNoYXBlKTtcblxuICAgIGNvbnN0IGdyYWRzID0gdGYuZ3JhZHMoXG4gICAgICAgICh4OiB0Zi5UZW5zb3I0RCwgZmlsdGVyOiB0Zi5UZW5zb3I0RCkgPT5cbiAgICAgICAgICAgIHRmLmNvbnYyZFRyYW5zcG9zZSh4LCBmaWx0ZXIsIFsxLCA0LCA0LCBvdXRwdXREZXB0aF0sIHN0cmlkZSwgcGFkKSk7XG4gICAgY29uc3QgZHkgPSB0Zi5vbmVzKFsxLCA0LCA0LCBvdXRwdXREZXB0aF0pLm11bCh0Zi5zY2FsYXIoLTEpKTtcbiAgICBjb25zdCBbeEdyYWQsIGZpbHRHcmFkXSA9IGdyYWRzKFt4LCBmaWx0XSwgZHkpO1xuXG4gICAgY29uc3QgZXhwZWN0ZWRYR3JhZCA9IHRmLm9uZXMoWzEsIDIsIDIsIDFdKS5tdWwodGYuc2NhbGFyKC0wLjAzNDU0MTk2KSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgeEdyYWQuZGF0YSgpLCBhd2FpdCBleHBlY3RlZFhHcmFkLmRhdGEoKSk7XG4gICAgZXhwZWN0KHhHcmFkLnNoYXBlKS50b0VxdWFsKFsxLCAyLCAyLCAxXSk7XG5cbiAgICBjb25zdCBleHBlY3RlZEZpbHRHcmFkID0gdGYub25lcyhbMiwgMiwgMiwgMV0pLm11bCh0Zi5zY2FsYXIoLTAuMDE0NDQ2MTgpKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBmaWx0R3JhZC5kYXRhKCksIGF3YWl0IGV4cGVjdGVkRmlsdEdyYWQuZGF0YSgpKTtcbiAgICBleHBlY3QoZmlsdEdyYWQuc2hhcGUpLnRvRXF1YWwoWzIsIDIsIDIsIDFdKTtcbiAgfSk7XG5cbiAgLy8gUmVmZXJlbmNlIChQeXRob24pIFRlbnNvckZsb3cgY29kZTpcbiAgLy9cbiAgLy8gYGBgcHlcbiAgLy8gaW1wb3J0IG51bXB5IGFzIG5wXG4gIC8vIGltcG9ydCB0ZW5zb3JmbG93IGFzIHRmXG4gIC8vXG4gIC8vIHRmLmVuYWJsZV9lYWdlcl9leGVjdXRpb24oKVxuICAvL1xuICAvLyB4ID0gdGYuY29uc3RhbnQobnAuYXJyYXkoW1tcbiAgLy8gICAgIFtbMS41MjQzMzA2NV0sIFstMC43NzA1MzQzNV0sIFstMC42NDU2MjM0MV1dLFxuICAvLyAgICAgW1swLjc3OTYyODg5XSwgWzEuNTg0MTM4ODddLCBbLTAuMjU1ODE4NTZdXSxcbiAgLy8gICAgIFtbLTAuNTg5NjYyMjFdLCBbMC4wNTQxMTY2Ml0sIFswLjcwNzQ5MTM4XV1cbiAgLy8gXV0pLmFzdHlwZShucC5mbG9hdDMyKSlcbiAgLy8gZmlsdCA9IHRmLmNvbnN0YW50KG5wLmFycmF5KFtcbiAgLy8gICAgIFtbWzAuMTExNzgzODhdLCBbLTAuOTY2NTQ5NzddXSwgW1sxLjIxMDIxMjk2XSwgWzAuODQxMjE3MjldXV0sXG4gIC8vICAgICBbW1swLjM0OTY4MzM4XSwgWy0wLjQyMzA2MTE0XV0sIFtbMS4yNzM5NTczM10sIFstMS4wOTAxNDUzNV1dXVxuICAvLyBdKS5hc3R5cGUobnAuZmxvYXQzMikpXG4gIC8vXG4gIC8vIHdpdGggdGYuR3JhZGllbnRUYXBlKCkgYXMgZzpcbiAgLy8gICBnLndhdGNoKHgpXG4gIC8vICAgZy53YXRjaChmaWx0KVxuICAvLyAgIHkgPSB0Zi5rZXJhcy5iYWNrZW5kLmNvbnYyZF90cmFuc3Bvc2UoXG4gIC8vICAgICAgIHgsIGZpbHQsIFsxLCAzLCAzLCAyXSwgc3RyaWRlcz0oMSwgMSksIHBhZGRpbmc9J3NhbWUnKVxuICAvLyAoeF9ncmFkLCBmaWx0X2dyYWQpID0gZy5ncmFkaWVudCh5LCBbeCwgZmlsdF0pXG4gIC8vXG4gIC8vIHByaW50KFwieF9ncmFkID0gJXNcIiAlIHhfZ3JhZClcbiAgLy8gcHJpbnQoXCJmaWx0X2dyYWQgPSAlc1wiICUgZmlsdF9ncmFkKVxuICAvLyBgYGBcbiAgaXQoJ2dyYWRpZW50IGlucHV0PVsxLDMsMywxXSBmPVsyLDIsMiwxXSBzPVsxLDFdIHBhZGRpbmc9c2FtZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDI7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMSwgMywgMywgaW5wdXREZXB0aF07XG4gICAgY29uc3QgZmlsdGVyU2l6ZSA9IDI7XG4gICAgY29uc3Qgc3RyaWRlOiBbbnVtYmVyLCBudW1iZXJdID0gWzEsIDFdO1xuICAgIGNvbnN0IHBhZCA9ICdzYW1lJztcblxuICAgIGNvbnN0IGZpbHRlclNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9XG4gICAgICAgIFtmaWx0ZXJTaXplLCBmaWx0ZXJTaXplLCBvdXRwdXREZXB0aCwgaW5wdXREZXB0aF07XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yNGQoXG4gICAgICAgIFtbXG4gICAgICAgICAgW1sxLjUyNDMzMDY1XSwgWy0wLjc3MDUzNDM1XSwgWy0wLjY0NTYyMzQxXV0sXG4gICAgICAgICAgW1swLjc3OTYyODg5XSwgWzEuNTg0MTM4ODddLCBbLTAuMjU1ODE4NTZdXSxcbiAgICAgICAgICBbWy0wLjU4OTY2MjIxXSwgWzAuMDU0MTE2NjJdLCBbMC43MDc0OTEzOF1dXG4gICAgICAgIF1dLFxuICAgICAgICBpbnB1dFNoYXBlKTtcbiAgICBjb25zdCBmaWx0ID0gdGYudGVuc29yNGQoXG4gICAgICAgIFtcbiAgICAgICAgICBbW1swLjExMTc4Mzg4XSwgWy0wLjk2NjU0OTc3XV0sIFtbMS4yMTAyMTI5Nl0sIFswLjg0MTIxNzI5XV1dLFxuICAgICAgICAgIFtbWzAuMzQ5NjgzMzhdLCBbLTAuNDIzMDYxMTRdXSwgW1sxLjI3Mzk1NzMzXSwgWy0xLjA5MDE0NTM1XV1dXG4gICAgICAgIF0sXG4gICAgICAgIGZpbHRlclNoYXBlKTtcblxuICAgIGNvbnN0IGdyYWRzID0gdGYuZ3JhZHMoXG4gICAgICAgICh4OiB0Zi5UZW5zb3I0RCwgZmlsdGVyOiB0Zi5UZW5zb3I0RCkgPT5cbiAgICAgICAgICAgIHRmLmNvbnYyZFRyYW5zcG9zZSh4LCBmaWx0ZXIsIFsxLCAzLCAzLCBvdXRwdXREZXB0aF0sIHN0cmlkZSwgcGFkKSk7XG4gICAgY29uc3QgZHkgPSB0Zi5vbmVzKFsxLCAzLCAzLCBvdXRwdXREZXB0aF0pO1xuICAgIGNvbnN0IFt4R3JhZCwgZmlsdEdyYWRdID0gZ3JhZHMoW3gsIGZpbHRdLCBkeSk7XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCB4R3JhZC5hcnJheSgpLCBbW1xuICAgICAgICAgICAgICAgICAgICAgICAgW1sxLjMwNzA5ODU4XSwgWzEuMzA3MDk4NThdLCBbLTAuOTI4MTQzNjZdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtbMS4zMDcwOTg1OF0sIFsxLjMwNzA5ODU4XSwgWy0wLjkyODE0MzY2XV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbWzEuMTk2NjY0MzddLCBbMS4xOTY2NjQzN10sIFstMC44NTQ3NjU4OV1dXG4gICAgICAgICAgICAgICAgICAgICAgXV0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGZpbHRHcmFkLmFycmF5KCksIFtcbiAgICAgIFtbWzIuMzg4MDY3ODhdLCBbMi4zODgwNjc4OF1dLCBbWzIuNTgyMDE4NDddLCBbMi41ODIwMTg0N11dXSxcbiAgICAgIFtbWzIuMjE2MTIyMV0sIFsyLjIxNjEyMjFdXSwgW1szLjExNzU2NDA2XSwgWzMuMTE3NTY0MDZdXV1cbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ2dyYWRpZW50IGlucHV0PVsxLDMsMywxXSBmPVsyLDIsMiwxXSBzPVsxLDFdIHA9ZXhwbGljaXQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXREZXB0aCA9IDE7XG4gICAgY29uc3Qgb3V0cHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IGlucHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzEsIDMsIDMsIGlucHV0RGVwdGhdO1xuICAgIGNvbnN0IGZpbHRlclNpemUgPSAyO1xuICAgIGNvbnN0IHN0cmlkZTogW251bWJlciwgbnVtYmVyXSA9IFsxLCAxXTtcbiAgICBjb25zdCBwYWQgPVxuICAgICAgICBbWzAsIDBdLCBbMCwgMV0sIFswLCAxXSwgWzAsIDBdXSBhcyB0Zi5iYWNrZW5kX3V0aWwuRXhwbGljaXRQYWRkaW5nO1xuXG4gICAgY29uc3QgZmlsdGVyU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID1cbiAgICAgICAgW2ZpbHRlclNpemUsIGZpbHRlclNpemUsIG91dHB1dERlcHRoLCBpbnB1dERlcHRoXTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgW1tcbiAgICAgICAgICBbWzEuNTI0MzMwNjVdLCBbLTAuNzcwNTM0MzVdLCBbLTAuNjQ1NjIzNDFdXSxcbiAgICAgICAgICBbWzAuNzc5NjI4ODldLCBbMS41ODQxMzg4N10sIFstMC4yNTU4MTg1Nl1dLFxuICAgICAgICAgIFtbLTAuNTg5NjYyMjFdLCBbMC4wNTQxMTY2Ml0sIFswLjcwNzQ5MTM4XV1cbiAgICAgICAgXV0sXG4gICAgICAgIGlucHV0U2hhcGUpO1xuICAgIGNvbnN0IGZpbHQgPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgW1xuICAgICAgICAgIFtbWzAuMTExNzgzODhdLCBbLTAuOTY2NTQ5NzddXSwgW1sxLjIxMDIxMjk2XSwgWzAuODQxMjE3MjldXV0sXG4gICAgICAgICAgW1tbMC4zNDk2ODMzOF0sIFstMC40MjMwNjExNF1dLCBbWzEuMjczOTU3MzNdLCBbLTEuMDkwMTQ1MzVdXV1cbiAgICAgICAgXSxcbiAgICAgICAgZmlsdGVyU2hhcGUpO1xuXG4gICAgY29uc3QgZ3JhZHMgPSB0Zi5ncmFkcyhcbiAgICAgICAgKHg6IHRmLlRlbnNvcjRELCBmaWx0ZXI6IHRmLlRlbnNvcjREKSA9PlxuICAgICAgICAgICAgdGYuY29udjJkVHJhbnNwb3NlKHgsIGZpbHRlciwgWzEsIDMsIDMsIG91dHB1dERlcHRoXSwgc3RyaWRlLCBwYWQpKTtcbiAgICBjb25zdCBkeSA9IHRmLm9uZXMoWzEsIDMsIDMsIG91dHB1dERlcHRoXSk7XG4gICAgY29uc3QgW3hHcmFkLCBmaWx0R3JhZF0gPSBncmFkcyhbeCwgZmlsdF0sIGR5KTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHhHcmFkLmFycmF5KCksIFtbXG4gICAgICAgICAgICAgICAgICAgICAgICBbWzEuMzA3MDk4NThdLCBbMS4zMDcwOTg1OF0sIFstMC45MjgxNDM2Nl1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1sxLjMwNzA5ODU4XSwgWzEuMzA3MDk4NThdLCBbLTAuOTI4MTQzNjZdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtbMS4xOTY2NjQzN10sIFsxLjE5NjY2NDM3XSwgWy0wLjg1NDc2NTg5XV1cbiAgICAgICAgICAgICAgICAgICAgICBdXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZmlsdEdyYWQuYXJyYXkoKSwgW1xuICAgICAgW1tbMi4zODgwNjc4OF0sIFsyLjM4ODA2Nzg4XV0sIFtbMi41ODIwMTg0N10sIFsyLjU4MjAxODQ3XV1dLFxuICAgICAgW1tbMi4yMTYxMjIxXSwgWzIuMjE2MTIyMV1dLCBbWzMuMTE3NTY0MDZdLCBbMy4xMTc1NjQwNl1dXVxuICAgIF0pO1xuICB9KTtcblxuICAvLyBSZWZlcmVuY2UgKFB5dGhvbikgVGVuc29yRmxvdyBjb2RlOlxuICAvL1xuICAvLyBgYGBweVxuICAvLyBpbXBvcnQgbnVtcHkgYXMgbnBcbiAgLy8gaW1wb3J0IHRlbnNvcmZsb3cgYXMgdGZcbiAgLy9cbiAgLy8gdGYuZW5hYmxlX2VhZ2VyX2V4ZWN1dGlvbigpXG4gIC8vXG4gIC8vIHggPSB0Zi5jb25zdGFudChucC5hcnJheShbW1xuICAvLyAgICAgW1sxLjUyNDMzMDY1XSwgWy0wLjc3MDUzNDM1XV0sIFtbMC43Nzk2Mjg4OV0sIFsxLjU4NDEzODg3XV0sXG4gIC8vIF1dKS5hc3R5cGUobnAuZmxvYXQzMikpXG4gIC8vIGZpbHQgPSB0Zi5jb25zdGFudChucC5hcnJheShbXG4gIC8vICAgICBbW1swLjExMTc4Mzg4XSwgWy0wLjk2NjU0OTc3XV0sIFtbMS4yMTAyMTI5Nl0sIFswLjg0MTIxNzI5XV1dLFxuICAvLyAgICAgW1tbMC4zNDk2ODMzOF0sIFstMC40MjMwNjExNF1dLCBbWzEuMjczOTU3MzNdLCBbLTEuMDkwMTQ1MzVdXV1cbiAgLy8gXSkuYXN0eXBlKG5wLmZsb2F0MzIpKVxuICAvL1xuICAvLyB3aXRoIHRmLkdyYWRpZW50VGFwZSgpIGFzIGc6XG4gIC8vICAgZy53YXRjaCh4KVxuICAvLyAgIGcud2F0Y2goZmlsdClcbiAgLy8gICB5ID0gdGYua2VyYXMuYmFja2VuZC5jb252MmRfdHJhbnNwb3NlKFxuICAvLyAgICAgICB4LCBmaWx0LCBbMSwgMywgMywgMl0sIHN0cmlkZXM9KDIsIDIpLCBwYWRkaW5nPSdzYW1lJylcbiAgLy8gICBwcmludCh5LnNoYXBlKVxuICAvLyAoeF9ncmFkLCBmaWx0X2dyYWQpID0gZy5ncmFkaWVudCh5LCBbeCwgZmlsdF0pXG4gIC8vXG4gIC8vIHByaW50KFwieF9ncmFkID0gJXNcIiAlIHhfZ3JhZClcbiAgLy8gcHJpbnQoXCJmaWx0X2dyYWQgPSAlc1wiICUgZmlsdF9ncmFkKVxuICAvLyBgYGBcbiAgaXQoJ2dyYWRpZW50IGlucHV0PVsxLDIsMiwyXSBmPVsyLDIsMiwxXSBzPVsyLDJdIHBhZGRpbmc9c2FtZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbnB1dERlcHRoID0gMjtcbiAgICBjb25zdCBvdXRwdXREZXB0aCA9IDI7XG4gICAgY29uc3QgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMSwgMiwgMiwgaW5wdXREZXB0aF07XG4gICAgY29uc3QgZmlsdGVyU2l6ZSA9IDI7XG4gICAgY29uc3Qgc3RyaWRlOiBbbnVtYmVyLCBudW1iZXJdID0gWzIsIDJdO1xuICAgIGNvbnN0IHBhZCA9ICdzYW1lJztcblxuICAgIGNvbnN0IGZpbHRlclNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9XG4gICAgICAgIFtmaWx0ZXJTaXplLCBmaWx0ZXJTaXplLCBvdXRwdXREZXB0aCwgaW5wdXREZXB0aF07XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yNGQoXG4gICAgICAgIFtbXG4gICAgICAgICAgW1stMS44MTUwNjU5MywgMS4wMDkwMDA5NV0sIFstMC4wNTE5OTExOCwgMC4yNjMxMTM3N11dLFxuICAgICAgICAgIFtbLTEuMTg0Njk3OTIsIC0wLjM0NzgwNTIxXSwgWzIuMDQ5NzEyNDIsIC0wLjY1MTU0NjkyXV1cbiAgICAgICAgXV0sXG4gICAgICAgIGlucHV0U2hhcGUpO1xuICAgIGNvbnN0IGZpbHQgPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFtbMC4xOTUyOTY4NiwgLTAuNzk1OTQ3MDhdLCBbMC43MDMxNDA1NywgLTAuMDYwODEyNjNdXSxcbiAgICAgICAgICAgIFtbMC4yODcyNDc0NCwgMC44ODUyMjcxNV0sIFstMC41MTgyNDA5NiwgLTAuOTcxMjA5ODldXVxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgW1swLjUxODcyMTk3LCAtMS4xNzU2OTE5M10sIFsxLjI4MzE2NzkxLCAtMC44MTIyNTA5Ml1dLFxuICAgICAgICAgICAgW1stMC40NDIyMTUzMiwgMC43MDA1ODE3NF0sIFstMC40ODQ5MjE3LCAwLjAzODA2MzQ4XV1cbiAgICAgICAgICBdXG4gICAgICAgIF0sXG4gICAgICAgIGZpbHRlclNoYXBlKTtcblxuICAgIGNvbnN0IGdyYWRzID0gdGYuZ3JhZHMoXG4gICAgICAgICh4OiB0Zi5UZW5zb3I0RCwgZmlsdGVyOiB0Zi5UZW5zb3I0RCkgPT5cbiAgICAgICAgICAgIHRmLmNvbnYyZFRyYW5zcG9zZSh4LCBmaWx0ZXIsIFsxLCAzLCAzLCBvdXRwdXREZXB0aF0sIHN0cmlkZSwgcGFkKSk7XG4gICAgY29uc3QgZHkgPSB0Zi5vbmVzKFsxLCAzLCAzLCBvdXRwdXREZXB0aF0pO1xuICAgIGNvbnN0IFt4R3JhZCwgZmlsdEdyYWRdID0gZ3JhZHMoW3gsIGZpbHRdLCBkeSk7XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCB4R3JhZC5kYXRhKCksIFtcbiAgICAgIDEuNTQyMTk2NzgsIC0yLjE5MjA0MDA4LCAyLjcwMDMyNzMyLCAtMi44NDQ3MDI1NywgMC42Njc0NDM5MSwgLTAuOTQyNzQyNDUsXG4gICAgICAwLjg5ODQzNzQzLCAtMC44NTY3NTk3MlxuICAgIF0pO1xuICAgIGV4cGVjdCh4R3JhZC5zaGFwZSkudG9FcXVhbChbMSwgMiwgMiwgMl0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGZpbHRHcmFkLmRhdGEoKSwgW1xuICAgICAgLTEuMDAyMDQyNjEsIDAuMjcyNzYyNTksIC0xLjAwMjA0MjYxLCAwLjI3Mjc2MjU5LCAtMi45OTk3NjM4NSwgMC42NjExOTU3NCxcbiAgICAgIC0yLjk5OTc2Mzg1LCAwLjY2MTE5NTc0LCAtMS44NjcwNTcxMSwgMS4yNzIxMTQ3MiwgLTEuODY3MDU3MTEsIDEuMjcyMTE0NzIsXG4gICAgICAtMS44MTUwNjU5MywgMS4wMDkwMDA5NSwgLTEuODE1MDY1OTMsIDEuMDA5MDAwOTVcbiAgICBdKTtcbiAgICBleHBlY3QoZmlsdEdyYWQuc2hhcGUpLnRvRXF1YWwoWzIsIDIsIDIsIDJdKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyB3aGVuIHggaXMgbm90IHJhbmsgMycsICgpID0+IHtcbiAgICBjb25zdCBvcmlnSW5wdXREZXB0aCA9IDE7XG4gICAgY29uc3Qgb3JpZ091dHB1dERlcHRoID0gMTtcbiAgICBjb25zdCBmU2l6ZSA9IDI7XG4gICAgY29uc3Qgb3JpZ1BhZCA9IDA7XG4gICAgY29uc3Qgb3JpZ1N0cmlkZSA9IDE7XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgY29uc3QgeDogYW55ID0gdGYudGVuc29yMmQoWzIsIDJdLCBbMiwgMV0pO1xuICAgIGNvbnN0IHcgPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWzMsIDEsIDUsIDBdLCBbZlNpemUsIGZTaXplLCBvcmlnSW5wdXREZXB0aCwgb3JpZ091dHB1dERlcHRoXSk7XG5cbiAgICBleHBlY3QoKCkgPT4gdGYuY29udjJkVHJhbnNwb3NlKHgsIHcsIFsyLCAyLCAxXSwgb3JpZ1N0cmlkZSwgb3JpZ1BhZCkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyB3aGVuIHdlaWdodHMgaXMgbm90IHJhbmsgNCcsICgpID0+IHtcbiAgICBjb25zdCBvcmlnSW5wdXREZXB0aCA9IDE7XG4gICAgY29uc3Qgb3JpZ091dHB1dERlcHRoID0gMTtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMSwgMSwgb3JpZ091dHB1dERlcHRoXTtcbiAgICBjb25zdCBmU2l6ZSA9IDI7XG4gICAgY29uc3Qgb3JpZ1BhZCA9IDA7XG4gICAgY29uc3Qgb3JpZ1N0cmlkZSA9IDE7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yM2QoWzJdLCBpbnB1dFNoYXBlKTtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgY29uc3QgdzogYW55ID0gdGYudGVuc29yM2QoWzMsIDEsIDUsIDBdLCBbZlNpemUsIGZTaXplLCBvcmlnSW5wdXREZXB0aF0pO1xuXG4gICAgZXhwZWN0KCgpID0+IHRmLmNvbnYyZFRyYW5zcG9zZSh4LCB3LCBbMiwgMiwgMV0sIG9yaWdTdHJpZGUsIG9yaWdQYWQpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKCk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3Mgd2hlbiB4IGRlcHRoIGRvZXMgbm90IG1hdGNoIHdlaWdodHMgb3JpZ2luYWwgb3V0cHV0IGRlcHRoJywgKCkgPT4ge1xuICAgIGNvbnN0IG9yaWdJbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCBvcmlnT3V0cHV0RGVwdGggPSAyO1xuICAgIGNvbnN0IHdyb25nT3JpZ091dHB1dERlcHRoID0gMztcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMSwgMSwgb3JpZ091dHB1dERlcHRoXTtcbiAgICBjb25zdCBmU2l6ZSA9IDI7XG4gICAgY29uc3Qgb3JpZ1BhZCA9IDA7XG4gICAgY29uc3Qgb3JpZ1N0cmlkZSA9IDE7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yM2QoWzIsIDJdLCBpbnB1dFNoYXBlKTtcbiAgICBjb25zdCB3ID0gdGYucmFuZG9tTm9ybWFsPFJhbmsuUjQ+KFxuICAgICAgICBbZlNpemUsIGZTaXplLCBvcmlnSW5wdXREZXB0aCwgd3JvbmdPcmlnT3V0cHV0RGVwdGhdKTtcblxuICAgIGV4cGVjdCgoKSA9PiB0Zi5jb252MmRUcmFuc3Bvc2UoeCwgdywgWzIsIDIsIDJdLCBvcmlnU3RyaWRlLCBvcmlnUGFkKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndGhyb3dzIHdoZW4gcGFzc2VkIHggYXMgYSBub24tdGVuc29yJywgKCkgPT4ge1xuICAgIGNvbnN0IG9yaWdJbnB1dERlcHRoID0gMTtcbiAgICBjb25zdCBvcmlnT3V0cHV0RGVwdGggPSAxO1xuICAgIGNvbnN0IGZTaXplID0gMjtcbiAgICBjb25zdCBvcmlnUGFkID0gMDtcbiAgICBjb25zdCBvcmlnU3RyaWRlID0gMTtcblxuICAgIGNvbnN0IHcgPSB0Zi50ZW5zb3I0ZChcbiAgICAgICAgWzMsIDEsIDUsIDBdLCBbZlNpemUsIGZTaXplLCBvcmlnSW5wdXREZXB0aCwgb3JpZ091dHB1dERlcHRoXSk7XG5cbiAgICBleHBlY3QoXG4gICAgICAgICgpID0+IHRmLmNvbnYyZFRyYW5zcG9zZShcbiAgICAgICAgICAgIHt9IGFzIHRmLlRlbnNvcjNELCB3LCBbMiwgMiwgMV0sIG9yaWdTdHJpZGUsIG9yaWdQYWQpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKFxuICAgICAgICAgICAgL0FyZ3VtZW50ICd4JyBwYXNzZWQgdG8gJ2NvbnYyZFRyYW5zcG9zZScgbXVzdCBiZSBhIFRlbnNvci8pO1xuICB9KTtcblxuICBpdCgndGhyb3dzIHdoZW4gcGFzc2VkIGZpbHRlciBhcyBhIG5vbi10ZW5zb3InLCAoKSA9PiB7XG4gICAgY29uc3Qgb3JpZ091dHB1dERlcHRoID0gMTtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMSwgMSwgb3JpZ091dHB1dERlcHRoXTtcbiAgICBjb25zdCBvcmlnUGFkID0gMDtcbiAgICBjb25zdCBvcmlnU3RyaWRlID0gMTtcblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IzZChbMl0sIGlucHV0U2hhcGUpO1xuXG4gICAgZXhwZWN0KFxuICAgICAgICAoKSA9PiB0Zi5jb252MmRUcmFuc3Bvc2UoXG4gICAgICAgICAgICB4LCB7fSBhcyB0Zi5UZW5zb3I0RCwgWzIsIDIsIDFdLCBvcmlnU3RyaWRlLCBvcmlnUGFkKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcihcbiAgICAgICAgICAgIC9Bcmd1bWVudCAnZmlsdGVyJyBwYXNzZWQgdG8gJ2NvbnYyZFRyYW5zcG9zZScgbXVzdCBiZSBhIFRlbnNvci8pO1xuICB9KTtcblxuICBpdCgnYWNjZXB0cyBhIHRlbnNvci1saWtlIG9iamVjdCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBvcmlnUGFkID0gMDtcbiAgICBjb25zdCBvcmlnU3RyaWRlID0gMTtcblxuICAgIGNvbnN0IHggPSBbW1syXV1dOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDF4MXgxXG4gICAgY29uc3QgdyA9IFtbW1szXV0sIFtbMV1dXSwgW1tbNV1dLCBbWzBdXV1dOyAgLy8gMngyeDF4MVxuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuY29udjJkVHJhbnNwb3NlKHgsIHcsIFsyLCAyLCAxXSwgb3JpZ1N0cmlkZSwgb3JpZ1BhZCk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbNiwgMiwgMTAsIDBdO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMiwgMiwgMV0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2lucHV0PTh4OHg4LG91dHB1dD00eDR4OCxmPTgscz0xLGluRGVwdGg9OCxwPXNhbWUgdmVjNCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBvcmlnSW5wdXREZXB0aCA9IDg7XG4gICAgY29uc3Qgb3JpZ091dHB1dERlcHRoID0gODtcbiAgICBjb25zdCBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9XG4gICAgICAgIFsxLCA4LCA4LCBvcmlnT3V0cHV0RGVwdGhdO1xuICAgIGNvbnN0IGZTaXplID0gODtcbiAgICBjb25zdCBvcmlnUGFkID0gJ3NhbWUnO1xuICAgIGNvbnN0IG9yaWdTdHJpZGU6IFtudW1iZXIsIG51bWJlcl0gPSBbMSwgMV07XG4gICAgY29uc3Qgd1NoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9XG4gICAgICAgIFtmU2l6ZSwgZlNpemUsIG9yaWdJbnB1dERlcHRoLCBvcmlnT3V0cHV0RGVwdGhdO1xuXG4gICAgY29uc3QgaW5wdXREYXRhID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmU2l6ZSAqIGZTaXplICogb3JpZ0lucHV0RGVwdGg7IGkrKykge1xuICAgICAgaW5wdXREYXRhLnB1c2goaSAlIDUpO1xuICAgIH1cbiAgICBjb25zdCB3RGF0YSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZlNpemUgKiBmU2l6ZSAqIG9yaWdJbnB1dERlcHRoICogb3JpZ091dHB1dERlcHRoOyBpKyspIHtcbiAgICAgIHdEYXRhLnB1c2goaSAlIDUpO1xuICAgIH1cblxuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3I0ZChpbnB1dERhdGEsIGlucHV0U2hhcGUpO1xuICAgIGNvbnN0IHcgPSB0Zi50ZW5zb3I0ZCh3RGF0YSwgd1NoYXBlKTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5jb252MmRUcmFuc3Bvc2UoXG4gICAgICAgIHgsIHcsIFsxLCA0LCA0LCBvcmlnSW5wdXREZXB0aF0sIG9yaWdTdHJpZGUsIG9yaWdQYWQpO1xuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzEsIDQsIDQsIDhdKTtcblxuICAgIGNvbnN0IGV4cGVjdGVkID0gW1xuICAgICAgNTEyLCA1MzMsIDQ2OSwgNTUwLCA1MDYsIDUxMiwgNTMzLCA0NjksIDU1MCwgNTA2LCA1MTIsIDUzMywgNDY5LCA1NTAsIDUwNixcbiAgICAgIDUxMiwgNTMzLCA0NjksIDU1MCwgNTA2LCA1MTIsIDUzMywgNDY5LCA1NTAsIDUwNiwgNTEyLCA1MzMsIDQ2OSwgNTUwLCA1MDYsXG4gICAgICA1MTIsIDUzMywgNTA2LCA1MTIsIDUzMywgNDY5LCA1NTAsIDUwNiwgNTEyLCA1MzMsIDQ2OSwgNTUwLCA1MDYsIDUxMiwgNTMzLFxuICAgICAgNDY5LCA1NTAsIDUwNiwgNTEyLCA1MzMsIDQ2OSwgNTUwLCA1MDYsIDUxMiwgNTMzLCA0NjksIDU1MCwgNTA2LCA1MTIsIDUzMyxcbiAgICAgIDQ2OSwgNTUwLCA1MDYsIDUxMiwgNTUwLCA1MDYsIDUxMiwgNTMzLCA0NjksIDU1MCwgNTA2LCA1MTIsIDUzMywgNDY5LCA1NTAsXG4gICAgICA1MDYsIDUxMiwgNTMzLCA0NjksIDU1MCwgNTA2LCA1MTIsIDUzMywgNDY5LCA1NTAsIDUwNiwgNTEyLCA1MzMsIDQ2OSwgNTUwLFxuICAgICAgNTA2LCA1MTIsIDUzMywgNDY5LCA1NTAsIDUwNiwgNDY5LCA1NTAsIDUwNiwgNTEyLCA1MzMsIDQ2OSwgNTUwLCA1MDYsIDUxMixcbiAgICAgIDUzMywgNDY5LCA1NTAsIDUwNiwgNTEyLCA1MzMsIDQ2OSwgNTUwLCA1MDYsIDUxMiwgNTMzLCA0NjksIDU1MCwgNTA2LCA1MTIsXG4gICAgICA1MzMsIDQ2OSwgNTUwLCA1MDYsIDUxMiwgNTMzLCA0NjksIDU1MFxuICAgIF07XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgZXhwZWN0ZWQpO1xuICB9KTtcbn0pO1xuIl19