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
import * as tf from './index';
import { ALL_ENVS, describeWithFlags, SYNC_BACKEND_ENVS } from './jasmine_util';
import { tensor5d } from './ops/ops';
import { Tensor } from './tensor';
import { encodeStrings, expectArraysClose, expectArraysEqual, expectNumbersClose } from './test_util';
import { encodeString } from './util';
describeWithFlags('tensor', ALL_ENVS, () => {
    it('Tensors of arbitrary size', async () => {
        // [1, 2, 3]
        let t = tf.tensor1d([1, 2, 3]);
        expect(t.rank).toBe(1);
        expect(t.size).toBe(3);
        expectArraysClose(await t.data(), [1, 2, 3]);
        // [[1, 2, 3]]
        t = tf.tensor2d([1, 2, 3], [1, 3]);
        expect(t.rank).toBe(2);
        expect(t.size).toBe(3);
        expectArraysClose(await t.data(), [1, 2, 3]);
        // [[1, 2, 3],
        //  [4, 5, 6]]
        t = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        expect(t.rank).toBe(2);
        expect(t.size).toBe(6);
        expectArraysClose(await t.data(), [1, 2, 3, 4, 5, 6]);
        // Shape mismatch with the values.
        expect(() => tf.tensor2d([1], [1, 2])).toThrowError();
    });
    it('Tensors of explicit size', async () => {
        const t = tf.tensor1d([5, 3, 2]);
        expect(t.rank).toBe(1);
        expect(t.shape).toEqual([3]);
        // tslint:disable-next-line:no-any
        expect(() => tf.tensor3d([1, 2], [1, 2, 3, 5])).toThrowError();
        const t4 = tf.tensor4d([1, 2, 3, 4], [1, 2, 1, 2]);
        expectArraysClose(await t4.data(), [1, 2, 3, 4]);
        // Tensor of ones.
        const x = tf.ones([3, 4, 2]);
        expect(x.rank).toBe(3);
        expect(x.size).toBe(24);
        expectArraysClose(await x.data(), [
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
        ]);
        // Tensor of zeros.
        const z = tf.zeros([3, 4, 2]);
        expect(z.rank).toBe(3);
        expect(z.size).toBe(24);
        expectArraysClose(await z.data(), [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ]);
    });
    it('Tensor dataSync CPU --> GPU', async () => {
        const a = tf.tensor2d([1, 2, 3, 4, 5, 6], [3, 2]);
        expectArraysClose(await a.data(), new Float32Array([1, 2, 3, 4, 5, 6]));
    });
    it('Tensor.data() CPU --> GPU', async () => {
        const a = tf.tensor2d([1, 2, 3, 4, 5, 6], [3, 2]);
        expectArraysClose(await a.data(), new Float32Array([1, 2, 3, 4, 5, 6]));
    });
    it('Tensor.data() packed CPU --> GPU', async () => {
        const a = tf.tensor2d([1, 2, 3, 4, 5, 6], [3, 2]);
        tf.matMul(a, tf.tensor2d([1, 2], [2, 1]));
        expectArraysClose(await a.data(), new Float32Array([1, 2, 3, 4, 5, 6]));
    });
    it('Scalar basic methods', async () => {
        const a = tf.scalar(5);
        expectArraysClose(await a.data(), [5]);
        expect(a.rank).toBe(0);
        expect(a.size).toBe(1);
        expect(a.shape).toEqual([]);
    });
    it('indexToLoc Scalar', async () => {
        const a = await tf.scalar(0).buffer();
        expect(a.indexToLoc(0)).toEqual([]);
        const b = await tf.zeros([]).buffer();
        expect(b.indexToLoc(0)).toEqual([]);
    });
    it('indexToLoc Tensor1D', async () => {
        const a = await tf.zeros([3]).buffer();
        expect(a.indexToLoc(0)).toEqual([0]);
        expect(a.indexToLoc(1)).toEqual([1]);
        expect(a.indexToLoc(2)).toEqual([2]);
        const b = await tf.zeros([3]).buffer();
        expect(b.indexToLoc(0)).toEqual([0]);
        expect(b.indexToLoc(1)).toEqual([1]);
        expect(b.indexToLoc(2)).toEqual([2]);
    });
    it('indexToLoc Tensor2D', async () => {
        const a = await tf.zeros([3, 2]).buffer();
        expect(a.indexToLoc(0)).toEqual([0, 0]);
        expect(a.indexToLoc(1)).toEqual([0, 1]);
        expect(a.indexToLoc(2)).toEqual([1, 0]);
        expect(a.indexToLoc(3)).toEqual([1, 1]);
        expect(a.indexToLoc(4)).toEqual([2, 0]);
        expect(a.indexToLoc(5)).toEqual([2, 1]);
        const b = await tf.zeros([3, 2]).buffer();
        expect(b.indexToLoc(0)).toEqual([0, 0]);
        expect(b.indexToLoc(1)).toEqual([0, 1]);
        expect(b.indexToLoc(2)).toEqual([1, 0]);
        expect(b.indexToLoc(3)).toEqual([1, 1]);
        expect(b.indexToLoc(4)).toEqual([2, 0]);
        expect(b.indexToLoc(5)).toEqual([2, 1]);
    });
    it('indexToLoc Tensor3D', async () => {
        const a = await tf.zeros([3, 2, 2]).buffer();
        expect(a.indexToLoc(0)).toEqual([0, 0, 0]);
        expect(a.indexToLoc(1)).toEqual([0, 0, 1]);
        expect(a.indexToLoc(2)).toEqual([0, 1, 0]);
        expect(a.indexToLoc(3)).toEqual([0, 1, 1]);
        expect(a.indexToLoc(4)).toEqual([1, 0, 0]);
        expect(a.indexToLoc(5)).toEqual([1, 0, 1]);
        expect(a.indexToLoc(11)).toEqual([2, 1, 1]);
        const b = await tf.zeros([3, 2, 2]).buffer();
        expect(b.indexToLoc(0)).toEqual([0, 0, 0]);
        expect(b.indexToLoc(1)).toEqual([0, 0, 1]);
        expect(b.indexToLoc(2)).toEqual([0, 1, 0]);
        expect(b.indexToLoc(3)).toEqual([0, 1, 1]);
        expect(b.indexToLoc(4)).toEqual([1, 0, 0]);
        expect(b.indexToLoc(5)).toEqual([1, 0, 1]);
        expect(b.indexToLoc(11)).toEqual([2, 1, 1]);
    });
    it('indexToLoc Tensor 5D', async () => {
        const values = new Float32Array([1, 2, 3, 4]);
        const a = await tensor5d(values, [2, 1, 1, 1, 2]).buffer();
        expect(a.indexToLoc(0)).toEqual([0, 0, 0, 0, 0]);
        expect(a.indexToLoc(1)).toEqual([0, 0, 0, 0, 1]);
        expect(a.indexToLoc(2)).toEqual([1, 0, 0, 0, 0]);
        expect(a.indexToLoc(3)).toEqual([1, 0, 0, 0, 1]);
    });
    it('locToIndex Scalar', async () => {
        const a = await tf.scalar(0).buffer();
        expect(a.locToIndex([])).toEqual(0);
        const b = await tf.zeros([]).buffer();
        expect(b.locToIndex([])).toEqual(0);
    });
    it('locToIndex Tensor1D', async () => {
        const a = await tf.zeros([3]).buffer();
        expect(a.locToIndex([0])).toEqual(0);
        expect(a.locToIndex([1])).toEqual(1);
        expect(a.locToIndex([2])).toEqual(2);
        const b = await tf.zeros([3]).buffer();
        expect(b.locToIndex([0])).toEqual(0);
        expect(b.locToIndex([1])).toEqual(1);
        expect(b.locToIndex([2])).toEqual(2);
    });
    it('locToIndex Tensor2D', async () => {
        const a = await tf.zeros([3, 2]).buffer();
        expect(a.locToIndex([0, 0])).toEqual(0);
        expect(a.locToIndex([0, 1])).toEqual(1);
        expect(a.locToIndex([1, 0])).toEqual(2);
        expect(a.locToIndex([1, 1])).toEqual(3);
        expect(a.locToIndex([2, 0])).toEqual(4);
        expect(a.locToIndex([2, 1])).toEqual(5);
        const b = await tf.zeros([3, 2]).buffer();
        expect(b.locToIndex([0, 0])).toEqual(0);
        expect(b.locToIndex([0, 1])).toEqual(1);
        expect(b.locToIndex([1, 0])).toEqual(2);
        expect(b.locToIndex([1, 1])).toEqual(3);
        expect(b.locToIndex([2, 0])).toEqual(4);
        expect(b.locToIndex([2, 1])).toEqual(5);
    });
    it('locToIndex Tensor3D', async () => {
        const a = await tf.zeros([3, 2, 2]).buffer();
        expect(a.locToIndex([0, 0, 0])).toEqual(0);
        expect(a.locToIndex([0, 0, 1])).toEqual(1);
        expect(a.locToIndex([0, 1, 0])).toEqual(2);
        expect(a.locToIndex([0, 1, 1])).toEqual(3);
        expect(a.locToIndex([1, 0, 0])).toEqual(4);
        expect(a.locToIndex([1, 0, 1])).toEqual(5);
        expect(a.locToIndex([2, 1, 1])).toEqual(11);
        const b = await tf.zeros([3, 2, 2]).buffer();
        expect(b.locToIndex([0, 0, 0])).toEqual(0);
        expect(b.locToIndex([0, 0, 1])).toEqual(1);
        expect(b.locToIndex([0, 1, 0])).toEqual(2);
        expect(b.locToIndex([0, 1, 1])).toEqual(3);
        expect(b.locToIndex([1, 0, 0])).toEqual(4);
        expect(b.locToIndex([1, 0, 1])).toEqual(5);
        expect(b.locToIndex([2, 1, 1])).toEqual(11);
    });
    it('Tensor assignability (asserts compiler)', () => {
        // This test asserts compilation, not doing any run-time assertion.
        const a = null;
        const b = a;
        expect(b).toBeNull();
        const a1 = null;
        const b1 = a1;
        expect(b1).toBeNull();
        const a2 = null;
        const b2 = a2;
        expect(b2).toBeNull();
        const a3 = null;
        const b3 = a3;
        expect(b3).toBeNull();
        const a4 = null;
        const b4 = a4;
        expect(b4).toBeNull();
    });
    it('tf.tensor1d() from number[]', async () => {
        const a = tf.tensor1d([1, 2, 3]);
        expectArraysClose(await a.data(), [1, 2, 3]);
    });
    it('tf.tensor1d() throw error with null input value', () => {
        expect(() => tf.tensor1d(null))
            .toThrowError('The input to the tensor constructor ' +
            'must be a non-null value.');
    });
    it('tf.tensor1d() from string[]', async () => {
        const a = tf.tensor1d(['aa', 'bb', 'cc']);
        expect(a.dtype).toBe('string');
        expect(a.shape).toEqual([3]);
        expectArraysEqual(await a.data(), ['aa', 'bb', 'cc']);
    });
    it('tf.tensor1d() from encoded strings', async () => {
        const bytes = encodeStrings(['aa', 'bb', 'cc']);
        const a = tf.tensor1d(bytes, 'string');
        expect(a.dtype).toBe('string');
        expect(a.shape).toEqual([3]);
        expectArraysEqual(await a.data(), ['aa', 'bb', 'cc']);
    });
    it('tf.tensor1d() from encoded strings without dtype errors', async () => {
        // We do not want to infer 'string' when the user passes Uint8Array in order
        // to be forward compatible in the future when we add uint8 dtype.
        const bytes = encodeStrings(['aa', 'bb', 'cc']);
        expect(() => tf.tensor1d(bytes)).toThrowError();
    });
    it('tf.tensor1d() from encoded strings, shape mismatch', () => {
        const bytes = encodeStrings([['aa'], ['bb'], ['cc']]);
        expect(() => tf.tensor1d(bytes)).toThrowError();
    });
    it('tf.tensor1d() from number[][], shape mismatch', () => {
        // tslint:disable-next-line:no-any
        expect(() => tf.tensor1d([[1], [2], [3]])).toThrowError();
    });
    it('tf.tensor1d() from string[][], shape mismatch', () => {
        // tslint:disable-next-line:no-any
        expect(() => tf.tensor1d([['a'], ['b'], ['c']])).toThrowError();
    });
    it('tf.tensor2d() from number[][]', async () => {
        const a = tf.tensor2d([[1, 2, 3], [4, 5, 6]], [2, 3]);
        expectArraysClose(await a.data(), [1, 2, 3, 4, 5, 6]);
    });
    it('tf.tensor2d() from string[][]', async () => {
        const a = tf.tensor2d([['aa', 'bb'], ['cc', 'dd']]);
        expect(a.dtype).toBe('string');
        expect(a.shape).toEqual([2, 2]);
        expectArraysEqual(await a.data(), ['aa', 'bb', 'cc', 'dd']);
    });
    it('tf.tensor2d() from encoded strings', async () => {
        const bytes = encodeStrings([['aa', 'bb'], ['cc', 'dd']]);
        const a = tf.tensor2d(bytes, [2, 2], 'string');
        expect(a.dtype).toBe('string');
        expect(a.shape).toEqual([2, 2]);
        expectArraysEqual(await a.data(), ['aa', 'bb', 'cc', 'dd']);
    });
    it('tf.tensor2d() from encoded strings without dtype errors', async () => {
        // We do not want to infer 'string' when the user passes Uint8Array in order
        // to be forward compatible in the future when we add uint8 dtype.
        const bytes = encodeStrings([['aa', 'bb'], ['cc', 'dd']]);
        expect(() => tf.tensor2d(bytes)).toThrowError();
    });
    it('tf.tensor2d() from encoded strings, shape mismatch', () => {
        const bytes = encodeStrings([['aa', 'bb'], ['cc', 'dd']]);
        expect(() => tf.tensor2d(bytes, [3, 2], 'string')).toThrowError();
    });
    it('tf.tensor2d() requires shape to be of length 2', () => {
        // tslint:disable-next-line:no-any
        const shape = [4];
        expect(() => tf.tensor2d([1, 2, 3, 4], shape)).toThrowError();
    });
    it('tf.tensor2d() from number[][], but shape does not match', () => {
        // Actual shape is [2, 3].
        expect(() => tf.tensor2d([[1, 2, 3], [4, 5, 6]], [3, 2])).toThrowError();
    });
    it('tf.tensor2d() from string[][], but shape does not match', () => {
        // Actual shape is [2, 3].
        const vals = [['a', 'b', 'c'], ['d', 'e', 'f']];
        expect(() => tf.tensor2d(vals, [3, 2])).toThrowError();
    });
    it('tf.tensor2d() from number[], but no shape throws error', () => {
        expect(() => tf.tensor2d([1, 2, 3, 4])).toThrowError();
    });
    it('tf.tensor2d() from string[], but no shape throws error', () => {
        expect(() => tf.tensor2d(['a', 'b', 'c', 'd'])).toThrowError();
    });
    it('tf.tensor2d() throw error with null input value', () => {
        expect(() => tf.tensor2d(null))
            .toThrowError('The input to the tensor constructor ' +
            'must be a non-null value.');
    });
    it('tensor3d() from number[][][]', async () => {
        const a = tf.tensor3d([[[1], [2], [3]], [[4], [5], [6]]], [2, 3, 1]);
        expectArraysClose(await a.data(), [1, 2, 3, 4, 5, 6]);
    });
    it('tensor3d() from string[][][]', async () => {
        const vals = [[['a'], ['b'], ['c']], [['d'], ['e'], ['f']]];
        const a = tf.tensor3d(vals, [2, 3, 1]);
        expect(a.dtype).toBe('string');
        expect(a.shape).toEqual([2, 3, 1]);
        expectArraysEqual(await a.data(), ['a', 'b', 'c', 'd', 'e', 'f']);
    });
    it('tf.tensor3d() from encoded strings', async () => {
        const bytes = encodeStrings([[['a'], ['b'], ['c']], [['d'], ['e'], ['f']]]);
        const a = tf.tensor3d(bytes, [2, 3, 1], 'string');
        expect(a.dtype).toBe('string');
        expect(a.shape).toEqual([2, 3, 1]);
        expectArraysEqual(await a.data(), ['a', 'b', 'c', 'd', 'e', 'f']);
    });
    it('tf.tensor3d() from encoded strings without dtype errors', async () => {
        // We do not want to infer 'string' when the user passes Uint8Array in order
        // to be forward compatible in the future when we add uint8 dtype.
        const bytes = encodeStrings([[['a'], ['b'], ['c']], [['d'], ['e'], ['f']]]);
        expect(() => tf.tensor3d(bytes)).toThrowError();
    });
    it('tf.tensor3d() from encoded strings, shape mismatch', () => {
        const bytes = encodeStrings([[['a'], ['b'], ['c']], [['d'], ['e'], ['f']]]);
        // Actual shape is [2, 3, 1].
        expect(() => tf.tensor3d(bytes, [3, 2, 1], 'string'))
            .toThrowError();
    });
    it('tensor3d() from number[][][], but shape does not match', () => {
        const values = [[[1], [2], [3]], [[4], [5], [6]]];
        // Actual shape is [2, 3, 1].
        expect(() => tf.tensor3d(values, [3, 2, 1])).toThrowError();
    });
    it('tf.tensor3d() from number[], but no shape throws error', () => {
        expect(() => tf.tensor3d([1, 2, 3, 4])).toThrowError();
    });
    it('tf.tensor3d() requires shape to be of length 3', () => {
        // tslint:disable-next-line:no-any
        const shape = [4, 1];
        expect(() => tf.tensor3d([1, 2, 3, 4], shape)).toThrowError();
    });
    it('tf.tensor3d() throw error with null input value', () => {
        expect(() => tf.tensor3d(null))
            .toThrowError('The input to the tensor constructor ' +
            'must be a non-null value.');
    });
    it('tensor4d() from number[][][][]', async () => {
        const a = tf.tensor4d([[[[1]], [[2]]], [[[4]], [[5]]]], [2, 2, 1, 1]);
        expectArraysClose(await a.data(), [1, 2, 4, 5]);
    });
    it('tensor4d() from string[][][][]', async () => {
        const vals = [[[['a']], [['b']]], [[['c']], [['d']]]];
        const a = tf.tensor4d(vals, [2, 2, 1, 1]);
        expect(a.dtype).toBe('string');
        expect(a.shape).toEqual([2, 2, 1, 1]);
        expectArraysEqual(await a.data(), ['a', 'b', 'c', 'd']);
    });
    it('tf.tensor4d() from encoded strings', async () => {
        const bytes = encodeStrings([[[['a']], [['b']]], [[['c']], [['d']]]]);
        const a = tf.tensor4d(bytes, [2, 2, 1, 1], 'string');
        expect(a.dtype).toBe('string');
        expect(a.shape).toEqual([2, 2, 1, 1]);
        expectArraysEqual(await a.data(), ['a', 'b', 'c', 'd']);
    });
    it('tf.tensor4d() from encoded strings without dtype errors', async () => {
        // We do not want to infer 'string' when the user passes Uint8Array in order
        // to be forward compatible in the future when we add uint8 dtype.
        const bytes = encodeStrings([[[['a']], [['b']]], [[['c']], [['d']]]]);
        expect(() => tf.tensor4d(bytes)).toThrowError();
    });
    it('tf.tensor4d() from encoded strings, shape mismatch', () => {
        const bytes = encodeStrings([[[['a']], [['b']]], [[['c']], [['d']]]]);
        // Actual shape is [2, 2, 1. 1].
        expect(() => tf.tensor4d(bytes, [2, 1, 2, 1], 'string'))
            .toThrowError();
    });
    it('tensor4d() from string[][][][] infer shape', async () => {
        const vals = [[[['a']], [['b']]], [[['c']], [['d']]]];
        const a = tf.tensor4d(vals);
        expect(a.dtype).toBe('string');
        expect(a.shape).toEqual([2, 2, 1, 1]);
        expectArraysEqual(await a.data(), ['a', 'b', 'c', 'd']);
    });
    it('tensor4d() from number[][][][], but shape does not match', () => {
        const f = () => {
            // Actual shape is [2, 2, 1, 1].
            tf.tensor4d([[[[1]], [[2]]], [[[4]], [[5]]]], [2, 1, 2, 1]);
        };
        expect(f).toThrowError();
    });
    it('tf.tensor4d() from number[], but no shape throws error', () => {
        expect(() => tf.tensor4d([1, 2, 3, 4])).toThrowError();
    });
    it('tf.tensor4d() requires shape to be of length 4', () => {
        // tslint:disable-next-line:no-any
        const shape = [4, 1];
        expect(() => tf.tensor4d([1, 2, 3, 4], shape)).toThrowError();
    });
    it('tf.tensor4d() throw error with null input value', () => {
        expect(() => tf.tensor4d(null))
            .toThrowError('The input to the tensor constructor ' +
            'must be a non-null value.');
    });
    it('tf.tensor5d() throw error with null input value', () => {
        expect(() => tf.tensor5d(null))
            .toThrowError('The input to the tensor constructor ' +
            'must be a non-null value.');
    });
    it('tf.tensor6d() throw error with null input value', () => {
        expect(() => tf.tensor6d(null))
            .toThrowError('The input to the tensor constructor ' +
            'must be a non-null value.');
    });
    it('default dtype', async () => {
        const a = tf.scalar(3);
        expect(a.dtype).toBe('float32');
        expectArraysClose(await a.data(), 3);
    });
    it('float32 dtype', async () => {
        const a = tf.scalar(3, 'float32');
        expect(a.dtype).toBe('float32');
        expectArraysClose(await a.data(), 3);
    });
    it('int32 dtype', async () => {
        const a = tf.scalar(3, 'int32');
        expect(a.dtype).toBe('int32');
        expectArraysEqual(await a.data(), 3);
    });
    it('int32 dtype, 3.9 => 3, like numpy', async () => {
        const a = tf.scalar(3.9, 'int32');
        expect(a.dtype).toBe('int32');
        expectArraysEqual(await a.data(), 3);
    });
    it('int32 dtype, -3.9 => -3, like numpy', async () => {
        const a = tf.scalar(-3.9, 'int32');
        expect(a.dtype).toBe('int32');
        expectArraysEqual(await a.data(), -3);
    });
    it('bool dtype, 3 => true, like numpy', async () => {
        const a = tf.scalar(3, 'bool');
        expect(a.dtype).toBe('bool');
        expectArraysEqual(await a.data(), 1);
    });
    it('bool dtype, -2 => true, like numpy', async () => {
        const a = tf.scalar(-2, 'bool');
        expect(a.dtype).toBe('bool');
        expectArraysEqual(await a.data(), 1);
    });
    it('bool dtype, 0 => false, like numpy', async () => {
        const a = tf.scalar(0, 'bool');
        expect(a.dtype).toBe('bool');
        expectArraysEqual(await a.data(), 0);
    });
    it('bool dtype from boolean', async () => {
        const a = tf.scalar(false, 'bool');
        expectArraysEqual(await a.data(), 0);
        expect(a.dtype).toBe('bool');
        const b = tf.scalar(true, 'bool');
        expectArraysEqual(await a.data(), 0);
        expect(b.dtype).toBe('bool');
    });
    it('int32 dtype from boolean', async () => {
        const a = tf.scalar(true, 'int32');
        expectArraysEqual(await a.data(), 1);
        expect(a.dtype).toBe('int32');
    });
    it('default dtype from boolean', async () => {
        const a = tf.scalar(false);
        expectArraysEqual(await a.data(), 0);
        expect(a.dtype).toBe('bool');
    });
    it('default dtype', async () => {
        const a = tf.tensor1d([1, 2, 3]);
        expect(a.dtype).toBe('float32');
        expect(a.shape).toEqual([3]);
        expectArraysClose(await a.data(), [1, 2, 3]);
    });
    it('float32 dtype', async () => {
        const a = tf.tensor1d([1, 2, 3], 'float32');
        expect(a.dtype).toBe('float32');
        expect(a.shape).toEqual([3]);
        expectArraysClose(await a.data(), [1, 2, 3]);
    });
    it('int32 dtype', async () => {
        const a = tf.tensor1d([1, 2, 3], 'int32');
        expect(a.dtype).toBe('int32');
        expect(a.shape).toEqual([3]);
        expectArraysEqual(await a.data(), [1, 2, 3]);
    });
    it('int32 dtype, non-ints get floored, like numpy', async () => {
        const a = tf.tensor1d([1.1, 2.5, 3.9], 'int32');
        expect(a.dtype).toBe('int32');
        expect(a.shape).toEqual([3]);
        expectArraysEqual(await a.data(), [1, 2, 3]);
    });
    it('int32 dtype, negative non-ints get ceiled, like numpy', async () => {
        const a = tf.tensor1d([-1.1, -2.5, -3.9], 'int32');
        expect(a.dtype).toBe('int32');
        expect(a.shape).toEqual([3]);
        expectArraysEqual(await a.data(), [-1, -2, -3]);
    });
    it('bool dtype, !=0 is truthy, 0 is falsy, like numpy', async () => {
        const a = tf.tensor1d([1, -2, 0, 3], 'bool');
        expect(a.dtype).toBe('bool');
        expect(a.shape).toEqual([4]);
        expectArraysEqual(await a.data(), [1, 1, 0, 1]);
    });
    it('default dtype from boolean[]', async () => {
        const a = tf.tensor1d([false, false, true]);
        expect(a.dtype).toBe('bool');
        expectArraysClose(await a.data(), [0, 0, 1]);
    });
    it('default dtype from UInt8Array', async () => {
        const a = tf.tensor1d(new Uint8Array([1, 5, 2]));
        expect(a.dtype).toBe('int32');
        expect(a.shape).toEqual([3]);
        expectArraysClose(await a.data(), [1, 5, 2]);
    });
    it('default dtype from Int32Array', async () => {
        const a = tf.tensor1d(new Int32Array([1, 5, 2]));
        expect(a.dtype).toBe('int32');
        expect(a.shape).toEqual([3]);
        expectArraysClose(await a.data(), [1, 5, 2]);
    });
    it('tf.tensor() from Float32Array and number[]', async () => {
        const a = tf.tensor([
            new Float32Array([1, 2]), new Float32Array([3, 4]),
            new Float32Array([5, 6]), [7, 8]
        ]);
        expect(a.dtype).toBe('float32');
        expect(a.shape).toEqual([4, 2]);
        expectArraysClose(await a.data(), [1, 2, 3, 4, 5, 6, 7, 8]);
    });
    it('tf.tensor() from Int32Array and number[]', async () => {
        const a = tf.tensor([
            new Int32Array([1, 2]), new Int32Array([3, 4]), new Int32Array([5, 6]),
            [7, 8]
        ]);
        expect(a.dtype).toBe('int32');
        expect(a.shape).toEqual([4, 2]);
        expectArraysClose(await a.data(), [1, 2, 3, 4, 5, 6, 7, 8]);
    });
    it('tf.tensor() from mixed TypedArray', async () => {
        const a = tf.tensor([
            new Float32Array([1, 2]), new Int32Array([3, 4]), new Uint8Array([5, 6]),
            [7, 8]
        ]);
        expect(a.dtype).toBe('float32');
        expect(a.shape).toEqual([4, 2]);
        expectArraysClose(await a.data(), [1, 2, 3, 4, 5, 6, 7, 8]);
    });
    it('tf.tensor() from TypedArrays which are themselves 3D', () => {
        // 2 tensors, each with shape 20x20x3, as flat Float32Arrays.
        const img1 = new Float32Array(20 * 20 * 3);
        const img2 = new Float32Array(20 * 20 * 3);
        const t = tf.tensor([img1, img2], [2, 20, 20, 3]);
        expect(t.dtype).toBe('float32');
        expect(t.shape).toEqual([2, 20, 20, 3]);
    });
    it('tf.tensor() from TypedArrays which are themselves 3D, wrong shape', () => {
        const img1 = new Float32Array(20 * 20 * 3);
        const img2 = new Float32Array(20 * 20 * 3);
        expect(() => tf.tensor([img1, img2], [3, 20, 20, 3])).toThrowError();
    });
    it('default dtype from ascii string', async () => {
        const a = tf.tensor('hello');
        expect(a.dtype).toBe('string');
        expect(a.shape).toEqual([]);
        expectArraysEqual(await a.data(), ['hello']);
    });
    it('default dtype from utf-8 string', async () => {
        const a = tf.tensor('даниел');
        expect(a.dtype).toBe('string');
        expect(a.shape).toEqual([]);
        expectArraysEqual(await a.data(), ['даниел']);
    });
    it('default dtype from empty string', async () => {
        const a = tf.tensor('');
        expect(a.dtype).toBe('string');
        expect(a.shape).toEqual([]);
        expectArraysEqual(await a.data(), ['']);
    });
    it('default dtype from unicode escaped string', async () => {
        const a = tf.tensor('\u0434\u0430\u043d\u0438\u0435\u043b');
        expect(a.dtype).toBe('string');
        expect(a.shape).toEqual([]);
        expectArraysEqual(await a.data(), ['даниел']);
    });
    it('default dtype from string[]', async () => {
        const a = tf.tensor(['a', 'b']);
        expect(a.dtype).toBe('string');
        expect(a.shape).toEqual([2]);
        expectArraysEqual(await a.data(), ['a', 'b']);
    });
    it('float32 dtype from boolean[]', async () => {
        const a = tf.tensor1d([false, false, true], 'float32');
        expect(a.dtype).toBe('float32');
        expectArraysClose(await a.data(), [0, 0, 1]);
    });
    it('int32 dtype from boolean[]', async () => {
        const a = tf.tensor1d([false, false, true], 'int32');
        expect(a.dtype).toBe('int32');
        expectArraysEqual(await a.data(), [0, 0, 1]);
    });
    it('bool dtype from boolean[]', async () => {
        const a = tf.tensor1d([false, false, true], 'bool');
        expect(a.dtype).toBe('bool');
        expectArraysEqual(await a.data(), [0, 0, 1]);
    });
    it('default dtype', async () => {
        const a = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        expect(a.dtype).toBe('float32');
        expect(a.shape).toEqual([2, 2]);
        expectArraysClose(await a.data(), [1, 2, 3, 4]);
    });
    it('float32 dtype', async () => {
        const a = tf.tensor2d([1, 2, 3, 4], [2, 2], 'float32');
        expect(a.dtype).toBe('float32');
        expect(a.shape).toEqual([2, 2]);
        expectArraysClose(await a.data(), [1, 2, 3, 4]);
    });
    it('int32 dtype', async () => {
        const a = tf.tensor2d([[1, 2], [3, 4]], [2, 2], 'int32');
        expect(a.dtype).toBe('int32');
        expect(a.shape).toEqual([2, 2]);
        expectArraysEqual(await a.data(), [1, 2, 3, 4]);
    });
    it('int32 dtype, non-ints get floored, like numpy', async () => {
        const a = tf.tensor2d([1.1, 2.5, 3.9, 4.0], [2, 2], 'int32');
        expect(a.dtype).toBe('int32');
        expect(a.shape).toEqual([2, 2]);
        expectArraysEqual(await a.data(), [1, 2, 3, 4]);
    });
    it('int32 dtype, negative non-ints get ceiled, like numpy', async () => {
        const a = tf.tensor2d([-1.1, -2.5, -3.9, -4.0], [2, 2], 'int32');
        expect(a.dtype).toBe('int32');
        expect(a.shape).toEqual([2, 2]);
        expectArraysEqual(await a.data(), [-1, -2, -3, -4]);
    });
    it('bool dtype, !=0 is truthy, 0 is falsy, like numpy', async () => {
        const a = tf.tensor2d([1, -2, 0, 3], [2, 2], 'bool');
        expect(a.dtype).toBe('bool');
        expect(a.shape).toEqual([2, 2]);
        expectArraysEqual(await a.data(), [1, 1, 0, 1]);
    });
    it('default dtype from boolean[]', async () => {
        const a = tf.tensor2d([[false, false], [true, false]], [2, 2]);
        expect(a.dtype).toBe('bool');
        expectArraysClose(await a.data(), [0, 0, 1, 0]);
    });
    it('float32 dtype from boolean[]', async () => {
        const a = tf.tensor2d([[false, false], [true, false]], [2, 2], 'float32');
        expect(a.dtype).toBe('float32');
        expectArraysEqual(await a.data(), [0, 0, 1, 0]);
    });
    it('int32 dtype from boolean[]', async () => {
        const a = tf.tensor2d([[false, false], [true, false]], [2, 2], 'int32');
        expect(a.dtype).toBe('int32');
        expectArraysEqual(await a.data(), [0, 0, 1, 0]);
    });
    it('bool dtype from boolean[]', async () => {
        const a = tf.tensor2d([[false, false], [true, false]], [2, 2], 'bool');
        expect(a.dtype).toBe('bool');
        expectArraysEqual(await a.data(), [0, 0, 1, 0]);
    });
    it('default dtype', async () => {
        const a = tf.tensor3d([1, 2, 3, 4], [2, 2, 1]);
        expect(a.dtype).toBe('float32');
        expect(a.shape).toEqual([2, 2, 1]);
        expectArraysClose(await a.data(), [1, 2, 3, 4]);
    });
    it('float32 dtype', async () => {
        const a = tf.tensor3d([1, 2, 3, 4], [2, 2, 1], 'float32');
        expect(a.dtype).toBe('float32');
        expect(a.shape).toEqual([2, 2, 1]);
        expectArraysClose(await a.data(), [1, 2, 3, 4]);
    });
    it('int32 dtype', async () => {
        const a = tf.tensor3d([[[1], [2]], [[3], [4]]], [2, 2, 1], 'int32');
        expect(a.dtype).toBe('int32');
        expect(a.shape).toEqual([2, 2, 1]);
        expectArraysEqual(await a.data(), [1, 2, 3, 4]);
    });
    it('int32 dtype, non-ints get floored, like numpy', async () => {
        const a = tf.tensor3d([1.1, 2.5, 3.9, 4.0], [2, 2, 1], 'int32');
        expect(a.dtype).toBe('int32');
        expect(a.shape).toEqual([2, 2, 1]);
        expectArraysEqual(await a.data(), [1, 2, 3, 4]);
    });
    it('int32 dtype, negative non-ints get ceiled, like numpy', async () => {
        const a = tf.tensor3d([-1.1, -2.5, -3.9, -4.0], [2, 2, 1], 'int32');
        expect(a.dtype).toBe('int32');
        expect(a.shape).toEqual([2, 2, 1]);
        expectArraysEqual(await a.data(), [-1, -2, -3, -4]);
    });
    it('bool dtype, !=0 is truthy, 0 is falsy, like numpy', async () => {
        const a = tf.tensor3d([1, -2, 0, 3], [2, 2, 1], 'bool');
        expect(a.dtype).toBe('bool');
        expect(a.shape).toEqual([2, 2, 1]);
        expectArraysEqual(await a.data(), [1, 1, 0, 1]);
    });
    it('default dtype from boolean[]', async () => {
        const a = tf.tensor3d([[[false], [false]], [[true], [false]]], [2, 2, 1]);
        expect(a.dtype).toBe('bool');
        expectArraysClose(await a.data(), [0, 0, 1, 0]);
    });
    it('float32 dtype from boolean[]', async () => {
        const a = tf.tensor3d([[[false], [false]], [[true], [false]]], [2, 2, 1], 'float32');
        expect(a.dtype).toBe('float32');
        expectArraysClose(await a.data(), [0, 0, 1, 0]);
    });
    it('int32 dtype from boolean[]', async () => {
        const a = tf.tensor3d([[[false], [false]], [[true], [false]]], [2, 2, 1], 'int32');
        expect(a.dtype).toBe('int32');
        expectArraysEqual(await a.data(), [0, 0, 1, 0]);
    });
    it('bool dtype from boolean[]', async () => {
        const a = tf.tensor3d([[[false], [false]], [[true], [false]]], [2, 2, 1], 'bool');
        expect(a.dtype).toBe('bool');
        expectArraysEqual(await a.data(), [0, 0, 1, 0]);
    });
    it('default dtype', async () => {
        const a = tf.tensor4d([1, 2, 3, 4], [2, 2, 1, 1]);
        expect(a.dtype).toBe('float32');
        expect(a.shape).toEqual([2, 2, 1, 1]);
        expectArraysClose(await a.data(), [1, 2, 3, 4]);
    });
    it('float32 dtype', async () => {
        const a = tf.tensor4d([1, 2, 3, 4], [2, 2, 1, 1], 'float32');
        expect(a.dtype).toBe('float32');
        expect(a.shape).toEqual([2, 2, 1, 1]);
        expectArraysClose(await a.data(), [1, 2, 3, 4]);
    });
    it('int32 dtype', async () => {
        const a = tf.tensor4d([[[[1]], [[2]]], [[[3]], [[4]]]], [2, 2, 1, 1], 'int32');
        expect(a.dtype).toBe('int32');
        expect(a.shape).toEqual([2, 2, 1, 1]);
        expectArraysEqual(await a.data(), [1, 2, 3, 4]);
    });
    it('int32 dtype, non-ints get floored, like numpy', async () => {
        const a = tf.tensor4d([1.1, 2.5, 3.9, 4.0], [2, 2, 1, 1], 'int32');
        expect(a.dtype).toBe('int32');
        expect(a.shape).toEqual([2, 2, 1, 1]);
        expectArraysEqual(await a.data(), [1, 2, 3, 4]);
    });
    it('int32 dtype, negative non-ints get ceiled, like numpy', async () => {
        const a = tf.tensor4d([-1.1, -2.5, -3.9, -4.0], [2, 2, 1, 1], 'int32');
        expect(a.dtype).toBe('int32');
        expect(a.shape).toEqual([2, 2, 1, 1]);
        expectArraysEqual(await a.data(), [-1, -2, -3, -4]);
    });
    it('bool dtype, !=0 is truthy, 0 is falsy, like numpy', async () => {
        const a = tf.tensor4d([1, -2, 0, 3], [2, 2, 1, 1], 'bool');
        expect(a.dtype).toBe('bool');
        expect(a.shape).toEqual([2, 2, 1, 1]);
        expectArraysEqual(await a.data(), [1, 1, 0, 1]);
    });
    it('default dtype from boolean[]', async () => {
        const a = tf.tensor4d([[[[false], [false]], [[true], [false]]]], [1, 2, 2, 1]);
        expect(a.dtype).toBe('bool');
        expectArraysClose(await a.data(), [0, 0, 1, 0]);
    });
    it('float32 dtype from boolean[]', async () => {
        const a = tf.tensor4d([[[[false], [false]], [[true], [false]]]], [1, 2, 2, 1], 'float32');
        expect(a.dtype).toBe('float32');
        expectArraysClose(await a.data(), [0, 0, 1, 0]);
    });
    it('int32 dtype from boolean[]', async () => {
        const a = tf.tensor4d([[[[false], [false]], [[true], [false]]]], [1, 2, 2, 1], 'int32');
        expect(a.dtype).toBe('int32');
        expectArraysEqual(await a.data(), [0, 0, 1, 0]);
    });
    it('bool dtype from boolean[]', async () => {
        const a = tf.tensor4d([[[[false], [false]], [[true], [false]]]], [1, 2, 2, 1], 'bool');
        expect(a.dtype).toBe('bool');
        expectArraysEqual(await a.data(), [0, 0, 1, 0]);
    });
    it('Scalar default dtype', async () => {
        const a = tf.scalar(4);
        const b = a.reshape([1, 1]);
        expect(b.dtype).toBe('float32');
        expect(b.shape).toEqual([1, 1]);
        expectArraysClose(await a.data(), await b.data());
    });
    it('Scalar float32 dtype', () => {
        const a = tf.scalar(4, 'float32');
        const b = a.reshape([1, 1]);
        expect(b.dtype).toBe('float32');
        expect(b.shape).toEqual([1, 1]);
    });
    it('Scalar string dtype', () => {
        const a = tf.scalar('test', 'string');
        const b = a.reshape([1, 1]);
        expect(b.dtype).toBe('string');
        expect(b.shape).toEqual([1, 1]);
    });
    it('scalar from encoded string', async () => {
        const a = tf.scalar(encodeString('hello'), 'string');
        expect(a.dtype).toBe('string');
        expect(a.shape).toEqual([]);
        expectArraysEqual(await a.data(), ['hello']);
    });
    it('scalar from encoded string, but missing dtype', async () => {
        // We do not want to infer 'string' when the user passes Uint8Array in order
        // to be forward compatible in the future when we add uint8 dtype.
        expect(() => tf.scalar(encodeString('hello'))).toThrowError();
    });
    it('scalar from encoded string, but value is not uint8array', async () => {
        // tslint:disable-next-line:no-any
        expect(() => tf.scalar(new Float32Array([1, 2, 3]))).toThrowError();
    });
    it('Scalar inferred dtype from bool', async () => {
        const a = tf.scalar(true);
        expect(a.dtype).toBe('bool');
        expect(a.shape).toEqual([]);
        expectArraysClose(await a.data(), [1]);
    });
    it('Scalar inferred dtype from string', async () => {
        const a = tf.scalar('hello');
        expect(a.dtype).toBe('string');
        expect(a.shape).toEqual([]);
        expectArraysEqual(await a.data(), ['hello']);
    });
    it('Scalar int32 dtype', () => {
        const a = tf.scalar(4, 'int32');
        const b = a.reshape([1, 1]);
        expect(b.dtype).toBe('int32');
        expect(b.shape).toEqual([1, 1]);
    });
    it('Scalar bool dtype', async () => {
        const a = tf.scalar(4, 'bool');
        const b = a.reshape([1, 1, 1]);
        expect(b.dtype).toBe('bool');
        expect(b.shape).toEqual([1, 1, 1]);
        expectArraysClose(await a.data(), await b.data());
    });
    it('Scalar complex64 dtype', async () => {
        const a = tf.complex(4, 5);
        const b = a.reshape([1, 1]);
        expectArraysClose(await a.data(), [4, 5]);
        expect(b.dtype).toBe('complex64');
        expect(b.shape).toEqual([1, 1]);
        expectArraysClose(await a.data(), await b.data());
    });
    it('Tensor1D default dtype', async () => {
        const a = tf.tensor1d([1, 2, 3, 4]);
        const b = a.reshape([2, 2]);
        expect(b.dtype).toBe('float32');
        expect(b.shape).toEqual([2, 2]);
        expectArraysClose(await a.data(), await b.data());
    });
    it('Tensor1D inferred dtype from bools', async () => {
        const a = tf.tensor1d([true, false, false, true]);
        expect(a.dtype).toBe('bool');
        expect(a.shape).toEqual([4]);
        expectArraysClose(await a.data(), [1, 0, 0, 1]);
    });
    it('Tensor1D inferred dtype from strings', async () => {
        const a = tf.tensor1d(['a', 'b', 'c']);
        expect(a.dtype).toBe('string');
        expect(a.shape).toEqual([3]);
        expectArraysEqual(await a.data(), ['a', 'b', 'c']);
    });
    it('Tensor1D float32 dtype', () => {
        const a = tf.tensor1d([1, 2, 3, 4], 'float32');
        const b = a.reshape([2, 2]);
        expect(b.dtype).toBe('float32');
        expect(b.shape).toEqual([2, 2]);
    });
    it('Tensor1D int32 dtype', async () => {
        const a = tf.tensor1d([1, 2, 3, 4], 'int32');
        const b = a.reshape([2, 2]);
        expect(b.dtype).toBe('int32');
        expect(b.shape).toEqual([2, 2]);
        expectArraysClose(await a.data(), await b.data());
    });
    it('Tensor1D complex64 dtype', async () => {
        const a = tf.complex([1, 3, 5, 7], [2, 4, 6, 8]);
        const b = a.reshape([2, 2]);
        expect(b.dtype).toBe('complex64');
        expect(b.shape).toEqual([2, 2]);
        expectArraysClose(await a.data(), await b.data());
    });
    it('Tensor2D default dtype', async () => {
        const a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        const b = a.reshape([6]);
        expect(b.dtype).toBe('float32');
        expect(b.shape).toEqual([6]);
        expectArraysClose(await a.data(), await b.data());
    });
    it('Tensor2D float32 dtype', () => {
        const a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3], 'float32');
        const b = a.reshape([6]);
        expect(b.dtype).toBe('float32');
        expect(b.shape).toEqual([6]);
    });
    it('Tensor2D int32 dtype', () => {
        const a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3], 'int32');
        const b = a.reshape([6]);
        expect(b.dtype).toBe('int32');
        expect(b.shape).toEqual([6]);
    });
    it('Tensor2D bool dtype', async () => {
        const a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3], 'bool');
        const b = a.reshape([6]);
        expect(b.dtype).toBe('bool');
        expect(b.shape).toEqual([6]);
        expectArraysClose(await a.data(), await b.data());
    });
    it('Tensor2D complex64 dtype', async () => {
        const a = tf.complex([[1, 3, 5], [7, 9, 11]], [[2, 4, 6], [8, 10, 12]]);
        const b = a.reshape([6]);
        expect(b.dtype).toBe('complex64');
        expect(b.shape).toEqual([6]);
        expectArraysClose(await a.data(), await b.data());
    });
    it('Tensor3D default dtype', async () => {
        const a = tf.tensor3d([1, 2, 3, 4, 5, 6], [2, 3, 1]);
        const b = a.reshape([6]);
        expect(b.dtype).toBe('float32');
        expect(b.shape).toEqual([6]);
        expectArraysClose(await a.data(), await b.data());
    });
    it('Tensor3D float32 dtype', () => {
        const a = tf.tensor3d([1, 2, 3, 4, 5, 6], [2, 3, 1], 'float32');
        const b = a.reshape([6]);
        expect(b.dtype).toBe('float32');
        expect(b.shape).toEqual([6]);
    });
    it('Tensor3D int32 dtype', () => {
        const a = tf.tensor3d([1, 2, 3, 4, 5, 6], [2, 3, 1], 'int32');
        const b = a.reshape([6]);
        expect(b.dtype).toBe('int32');
        expect(b.shape).toEqual([6]);
    });
    it('Tensor3D bool dtype', async () => {
        const a = tf.tensor3d([1, 2, 3, 4, 5, 6], [2, 3, 1], 'bool');
        const b = a.reshape([6]);
        expect(b.dtype).toBe('bool');
        expect(b.shape).toEqual([6]);
        expectArraysClose(await a.data(), await b.data());
    });
    it('Tensor3D complex64 dtype', async () => {
        const a = tf.complex([[[1], [3], [5]], [[7], [9], [11]]], [[[2], [4], [6]], [[8], [10], [12]]]);
        const b = a.reshape([6]);
        expect(b.dtype).toBe('complex64');
        expect(b.shape).toEqual([6]);
        expectArraysClose(await a.data(), await b.data());
    });
    it('Tensor4D default dtype', async () => {
        const a = tf.tensor4d([1, 2, 3, 4, 5, 6], [2, 3, 1, 1]);
        const b = a.reshape([2, 3]);
        expect(b.dtype).toBe('float32');
        expect(b.shape).toEqual([2, 3]);
        expectArraysClose(await a.data(), await b.data());
    });
    it('Tensor4D float32 dtype', () => {
        const a = tf.tensor4d([1, 2, 3, 4, 5, 6], [2, 3, 1, 1], 'float32');
        const b = a.reshape([2, 3]);
        expect(b.dtype).toBe('float32');
        expect(b.shape).toEqual([2, 3]);
    });
    it('Tensor4D int32 dtype', async () => {
        const a = tf.tensor4d([1, 2, 3, 4, 5, 6], [2, 3, 1, 1], 'int32');
        const b = a.reshape([3, 2]);
        expect(b.dtype).toBe('int32');
        expect(b.shape).toEqual([3, 2]);
        expectArraysClose(await a.data(), await b.data());
    });
    it('Tensor4D complex64 dtype', async () => {
        const a = tf.complex([[[[1]], [[3]], [[5]]], [[[7]], [[9]], [[11]]]], [[[[2]], [[4]], [[6]]], [[[8]], [[10]], [[12]]]]);
        const b = a.reshape([3, 2]);
        expect(b.dtype).toBe('complex64');
        expect(b.shape).toEqual([3, 2]);
        expectArraysClose(await a.data(), await b.data());
    });
    it('Tensor4D bool dtype', () => {
        const a = tf.tensor4d([1, 2, 3, 4, 5, 6], [2, 3, 1, 1], 'bool');
        const b = a.reshape([3, 2]);
        expect(b.dtype).toBe('bool');
        expect(b.shape).toEqual([3, 2]);
    });
    it('.data() with casting, string tensor', async () => {
        const a = tf.tensor(['a', 'b']);
        const data = await a.data();
        expect(data).toEqual(['a', 'b']);
    });
    it('reshape is functional', async () => {
        const a = tf.scalar(2.4);
        const b = a.reshape([]);
        expect(a.id).not.toBe(b.id);
        b.dispose();
        expectArraysClose(await a.data(), [2.4]);
    });
    it('reshape a string tensor', async () => {
        const a = tf.tensor(['a', 'b']);
        const b = a.reshape([2, 1, 1]);
        expect(b.dtype).toBe('string');
        expect(b.shape).toEqual([2, 1, 1]);
        expectArraysEqual(await b.data(), ['a', 'b']);
    });
    it('reshape throws when passed a non-tensor', () => {
        // tslint:disable-next-line:no-any
        expect(() => tf.reshape({}, []))
            .toThrowError(/Argument 'x' passed to 'reshape' must be a Tensor/);
    });
    it('reshape accepts a tensor-like object', async () => {
        const res = tf.reshape([[1, 2, 3], [4, 5, 6]], [3, 2]);
        expect(res.dtype).toBe('float32');
        expect(res.shape).toEqual([3, 2]);
        expectArraysClose(await res.data(), [1, 2, 3, 4, 5, 6]);
    });
    it('cast bool -> bool', () => {
        const a = tf.tensor1d([1, 0], 'bool');
        expect(a.cast('bool').dtype).toEqual('bool');
    });
    it('cast bool -> int32', () => {
        const a = tf.tensor1d([1, 0], 'bool');
        expect(a.cast('int32').dtype).toEqual('int32');
    });
    it('cast bool -> float32', () => {
        const a = tf.tensor1d([1, 0], 'bool');
        expect(a.cast('float32').dtype).toEqual('float32');
    });
    it('cast int32 -> bool', () => {
        const a = tf.tensor1d([1, 0], 'int32');
        expect(a.cast('bool').dtype).toEqual('bool');
    });
    it('cast int32 -> int32', () => {
        const a = tf.tensor1d([1, 2], 'int32');
        expect(a.cast('int32').dtype).toEqual('int32');
    });
    it('cast int32 -> float32', () => {
        const a = tf.tensor1d([1, 2], 'int32');
        expect(a.cast('float32').dtype).toEqual('float32');
    });
    it('cast float32 -> bool', () => {
        const a = tf.tensor1d([1.0, 0.0]);
        expect(a.cast('bool').dtype).toEqual('bool');
    });
    it('cast float32 -> int32', () => {
        const a = tf.tensor1d([1.0, 2.0]);
        expect(a.cast('int32').dtype).toEqual('int32');
    });
    it('cast float32 -> int32. async download', async () => {
        const a = tf.tensor1d([1, 2]);
        const aInt = a.cast('int32');
        expect(aInt.dtype).toEqual('int32');
        const asyncData = await aInt.data();
        expect(asyncData instanceof Int32Array).toEqual(true);
    });
    it('cast float32 -> int32. queued async download', async () => {
        const a = tf.tensor1d([1, 2]);
        const aInt = a.cast('int32');
        expect(aInt.dtype).toEqual('int32');
        const [first, second] = await Promise.all([aInt.data(), aInt.data()]);
        expect(first instanceof Int32Array).toEqual(true);
        expect(second instanceof Int32Array).toEqual(true);
    });
    it('cast float32 -> int32. sync download', async () => {
        const a = tf.tensor1d([1, 2]).cast('int32');
        expect(a.dtype).toEqual('int32');
        const data = await a.data();
        expect(data instanceof Int32Array).toEqual(true);
    });
    it('cast float32 -> float32', () => {
        const a = tf.tensor1d([1.0, 2.0]);
        expect(a.cast('float32').dtype).toEqual('float32');
    });
    it('cast complex64 -> float32', async () => {
        const a = tf.complex([1.0, 2.0], [3.0, 4.0]);
        const result = a.cast('float32');
        expect(result.dtype).toEqual('float32');
        expectArraysClose(await result.data(), [1.0, 2.0]);
    });
    it('cast complex64 -> int32', async () => {
        const a = tf.complex([1.0, 2.0], [3.0, 4.0]);
        const result = a.cast('int32');
        expect(result.dtype).toEqual('int32');
        expectArraysEqual(await result.data(), [1, 2]);
    });
    it('cast complex64 -> bool', async () => {
        const a = tf.complex([1.0, 0.0], [1.0, 1.0]);
        const result = a.cast('bool');
        expect(result.dtype).toEqual('bool');
        expectArraysEqual(await result.data(), [true, false]);
    });
    it('cast throws when passed a non-tensor', () => {
        expect(() => tf.cast({}, 'float32'))
            .toThrowError(/Argument 'x' passed to 'cast' must be a Tensor/);
    });
    it('cast accepts a tensor-like object', async () => {
        const a = [1.0, 2.0];
        const res = tf.cast(a, 'int32');
        expect(res.dtype).toEqual('int32');
        expectArraysClose(await res.data(), [1, 2]);
    });
    it('cast string -> !string throws error', () => {
        const a = ['a', 'b'];
        expect(() => tf.cast(a, 'int32')).toThrowError();
        expect(() => tf.cast(a, 'float32')).toThrowError();
        expect(() => tf.cast(a, 'bool')).toThrowError();
        expect(() => tf.cast(a, 'complex64')).toThrowError();
    });
    it('cast !string -> string throws error', () => {
        expect(() => tf.cast(tf.tensor(1, [], 'float32'), 'string')).toThrowError();
        expect(() => tf.cast(tf.tensor(1, [], 'int32'), 'string')).toThrowError();
        expect(() => tf.cast(tf.tensor(1, [], 'bool'), 'string')).toThrowError();
        expect(() => tf.cast(tf.tensor(1, [], 'complex64'), 'string'))
            .toThrowError();
    });
    it('scalar bool -> int32', async () => {
        const a = tf.scalar(true, 'bool').toInt();
        expect(a.dtype).toBe('int32');
        expectArraysEqual(await a.data(), 1);
    });
    it('Tensor1D float32 -> int32', async () => {
        const a = tf.tensor1d([1.1, 3.9, -2.9, 0]).toInt();
        expect(a.dtype).toBe('int32');
        expectArraysEqual(await a.data(), [1, 3, -2, 0]);
    });
    it('Tensor2D float32 -> bool', async () => {
        const a = tf.tensor2d([1.1, 3.9, -2.9, 0], [2, 2]).asType('bool');
        expect(a.dtype).toBe('bool');
        expectArraysEqual(await a.data(), [1, 1, 1, 0]);
    });
    it('Tensor2D int32 -> bool', async () => {
        const a = tf.tensor2d([1, 3, 0, -1], [2, 2], 'int32').toBool();
        expect(a.dtype).toBe('bool');
        expectArraysEqual(await a.data(), [1, 1, 0, 1]);
    });
    it('Tensor3D bool -> float32', async () => {
        const a = tf.tensor3d([true, false, false, true], [2, 2, 1], 'bool').toFloat();
        expect(a.dtype).toBe('float32');
        expectArraysClose(await a.data(), [1, 0, 0, 1]);
    });
    it('bool CPU -> GPU -> CPU', async () => {
        const a = tf.tensor1d([1, 2, 0, 0, 5], 'bool');
        expectArraysEqual(await a.data(), [1, 1, 0, 0, 1]);
    });
    it('int32 CPU -> GPU -> CPU', async () => {
        const a = tf.tensor1d([1, 2, 0, 0, 5], 'int32');
        expectArraysEqual(await a.data(), [1, 2, 0, 0, 5]);
    });
    it('asType is functional', async () => {
        const a = tf.scalar(2.4, 'float32');
        const b = a.toFloat();
        expect(a.id).not.toBe(b.id);
        b.dispose();
        expectArraysClose(await a.data(), [2.4]);
    });
    it('squeeze no axis', () => {
        const a = tf.tensor2d([4, 2, 1], [3, 1], 'bool');
        const b = a.squeeze();
        expect(b.shape).toEqual([3]);
    });
    it('squeeze with axis', () => {
        const a = tf.tensor3d([4, 2, 1], [3, 1, 1], 'bool');
        const b = a.squeeze([1]);
        expect(b.shape).toEqual([3, 1]);
    });
    it('squeeze with negative axis', () => {
        const a = tf.tensor3d([4, 2, 1], [3, 1, 1], 'bool');
        const b = a.squeeze([-1]);
        expect(b.shape).toEqual([3, 1]);
    });
    it('squeeze with multiple negative axis', () => {
        const a = tf.tensor3d([4, 2, 1], [3, 1, 1], 'bool');
        const b = a.squeeze([-1, -2]);
        expect(b.shape).toEqual([3]);
    });
    it('squeeze wrong axis', () => {
        const a = tf.tensor3d([4, 2, 1], [3, 1, 1], 'bool');
        expect(() => a.squeeze([0, 1])).toThrowError();
    });
    it('squeeze wrong negative axis', () => {
        const a = tf.tensor3d([4, 2, 1], [3, 1, 1], 'bool');
        expect(() => a.squeeze([-3, -2])).toThrowError();
    });
    it('squeeze axis out of range', () => {
        const a = tf.tensor3d([4, 2, 1], [3, 1, 1], 'bool');
        expect(() => a.squeeze([10, 11])).toThrowError();
    });
    it('squeeze negative axis out of range', () => {
        const a = tf.tensor3d([4, 2, 1], [3, 1, 1], 'bool');
        expect(() => a.squeeze([-13, -12])).toThrowError();
    });
    it('squeeze throws when passed a non-tensor', () => {
        expect(() => tf.squeeze({}))
            .toThrowError(/Argument 'x' passed to 'squeeze' must be a Tensor/);
    });
    it('squeeze accepts a tensor-like object', async () => {
        const res = tf.squeeze([[[4]], [[2]], [[1]]] /* shape is [3, 1, 1] */);
        expect(res.shape).toEqual([3]);
        expectArraysClose(await res.data(), [4, 2, 1]);
    });
    it('squeeze a zero-sized tensor', () => {
        const a = tf.tensor3d([], [0, 1, 0]);
        const res = tf.squeeze(a);
        expect(res.shape).toEqual([0, 0]);
    });
    it('squeeze can take an empty list of axis', () => {
        const a = tf.zeros([2, 1, 3, 1, 4]);
        const axes = [];
        // Empty axes list means all possible axes.
        const res = tf.squeeze(a, axes);
        expect(res.shape).toEqual([2, 3, 4]);
    });
    it('squeeze a complex64 tensor', async () => {
        const a = tf.complex([[4], [1], [5]], [[2], [3], [6]]);
        const b = a.squeeze();
        expect(b.shape).toEqual([3]);
        expectArraysClose(await b.data(), [4, 2, 1, 3, 5, 6]);
    });
    it('scalar -> 2d', () => {
        const a = tf.scalar(4, 'int32');
        const b = a.as2D(1, 1);
        expect(b.dtype).toBe('int32');
        expect(b.shape).toEqual([1, 1]);
    });
    it('1d -> 2d', () => {
        const a = tf.tensor1d([4, 2, 1], 'bool');
        const b = a.as2D(3, 1);
        expect(b.dtype).toBe('bool');
        expect(b.shape).toEqual([3, 1]);
    });
    it('2d -> 4d', () => {
        const a = tf.tensor2d([4, 2, 1, 3], [2, 2]);
        const b = a.as4D(1, 1, 2, 2);
        expect(b.dtype).toBe('float32');
        expect(b.shape).toEqual([1, 1, 2, 2]);
    });
    it('3d -> 2d', () => {
        const a = tf.tensor3d([4, 2, 1, 3], [2, 2, 1], 'float32');
        const b = a.as2D(2, 2);
        expect(b.dtype).toBe('float32');
        expect(b.shape).toEqual([2, 2]);
    });
    it('4d -> 1d', () => {
        const a = tf.tensor4d([4, 2, 1, 3], [2, 2, 1, 1], 'bool');
        const b = a.as1D();
        expect(b.dtype).toBe('bool');
        expect(b.shape).toEqual([4]);
    });
    it('throws when passed non-integer shape', () => {
        const msg = 'Tensor must have a shape comprised of positive ' +
            'integers but got shape [2,2.2].';
        expect(() => tf.tensor([1, 2, 3, 4], [2, 2.2])).toThrowError(msg);
    });
    it('throws when passed negative shape', () => {
        const msg = 'Tensor must have a shape comprised of positive ' +
            'integers but got shape [2,-2].';
        expect(() => tf.tensor([1, 2, 3, 4], [2, -2])).toThrowError(msg);
    });
    it('ones with complex type', async () => {
        // Imaginary part should be zero.
        const a = tf.ones([2, 2], 'complex64');
        expectArraysClose(await a.data(), [1, 0, 1, 0, 1, 0, 1, 0]);
    });
    it('can create a tensor where values.size != buffer.size', async () => {
        const a = new Float32Array([1, 2, 3, 4, 5]);
        const b = a.subarray(0, 2);
        const t = tf.tensor1d(b);
        expect(t.shape).toEqual([2]);
        expectArraysClose(await t.data(), [1, 2]);
    });
});
describeWithFlags('tensor debug mode', ALL_ENVS, () => {
    beforeAll(() => {
        // Silence debug warnings.
        spyOn(console, 'warn');
        tf.enableDebugMode();
    });
    it('tf.tensor() from TypedArray + number[] fails due to wrong shape', () => {
        expect(() => tf.tensor([
            new Float32Array([1, 2]),
            new Float32Array([3, 4]),
            new Float32Array([5, 6]),
            // Should be of length 4
            [7, 8, 9, 10],
        ]))
            .toThrowError(/Element arr\[3\] should have 2 elements, but has 4 elements/);
    });
});
describeWithFlags('tensor dataSync', SYNC_BACKEND_ENVS, () => {
    it('.dataSync() with casting, string tensor', () => {
        const a = tf.tensor(['a', 'b']);
        const data = a.dataSync();
        expect(data).toEqual(['a', 'b']);
    });
});
describeWithFlags('tensor arraySync', SYNC_BACKEND_ENVS, () => {
    it('.arraySync() with a non-complex tensor', () => {
        const a = tf.tensor([1, 2, 3, 4, 5, 6], [2, 3]);
        expect(a.arraySync()).toEqual([[1, 2, 3], [4, 5, 6]]);
    });
    it('.arraySync() with a complex tensor', () => {
        const a = tf.complex([[1, 2], [3, 4]], [[11, 12], [13, 14]]);
        expect(a.arraySync()).toEqual([[1, 11, 2, 12], [3, 13, 4, 14]]);
    });
    // The other cases should be covered by toNestedArray tests in util_test.ts.
});
describeWithFlags('tensor.toString', SYNC_BACKEND_ENVS, () => {
    it('scalar verbose', () => {
        const verbose = true;
        const str = tf.scalar(5).toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: float32\n' +
            '  rank: 0\n' +
            '  shape: []\n' +
            '  values:\n' +
            '    5');
    });
    it('string scalar verbose', () => {
        const verbose = true;
        const str = tf.scalar('test').toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: string\n' +
            '  rank: 0\n' +
            '  shape: []\n' +
            '  values:\n' +
            '    test');
    });
    it('bool scalar verbose', () => {
        const verbose = true;
        const str = tf.scalar(true).toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: bool\n' +
            '  rank: 0\n' +
            '  shape: []\n' +
            '  values:\n' +
            '    true');
    });
    it('1d tensor verbose', () => {
        const verbose = true;
        const str = tf.zeros([4]).toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: float32\n' +
            '  rank: 1\n' +
            '  shape: [4]\n' +
            '  values:\n' +
            '    [0, 0, 0, 0]');
    });
    it('1d string tensor verbose', () => {
        const verbose = true;
        const str = tf.tensor(['a', 'bb', 'ccc']).toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: string\n' +
            '  rank: 1\n' +
            '  shape: [3]\n' +
            '  values:\n' +
            '    [\'a\', \'bb\', \'ccc\']');
    });
    it('1d bool tensor verbose', () => {
        const verbose = true;
        const str = tf.tensor([true, false, true]).toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: bool\n' +
            '  rank: 1\n' +
            '  shape: [3]\n' +
            '  values:\n' +
            '    [true, false, true]');
    });
    it('2d tensor verbose', () => {
        const verbose = true;
        const str = tf.zeros([3, 3]).toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: float32\n' +
            '  rank: 2\n' +
            '  shape: [3,3]\n' +
            '  values:\n' +
            '    [[0, 0, 0],\n' +
            '     [0, 0, 0],\n' +
            '     [0, 0, 0]]');
    });
    it('2d string tensor verbose', () => {
        const verbose = true;
        const vals = [
            ['a', 'bb', 'ccc'],
            ['d', 'e', 'f'],
            ['g', 'h', 'i'],
        ];
        const str = tf.tensor(vals).toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: string\n' +
            '  rank: 2\n' +
            '  shape: [3,3]\n' +
            '  values:\n' +
            '    [[\'a\', \'bb\', \'ccc\'],\n' +
            '     [\'d\', \'e\' , \'f\'  ],\n' +
            '     [\'g\', \'h\' , \'i\'  ]]');
    });
    it('2d bool tensor verbose', () => {
        const verbose = true;
        const str = tf.zeros([3, 3], 'bool').toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: bool\n' +
            '  rank: 2\n' +
            '  shape: [3,3]\n' +
            '  values:\n' +
            '    [[false, false, false],\n' +
            '     [false, false, false],\n' +
            '     [false, false, false]]');
    });
    it('3d tensor verbose', () => {
        const verbose = true;
        const str = tf.zeros([3, 3, 2]).toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: float32\n' +
            '  rank: 3\n' +
            '  shape: [3,3,2]\n' +
            '  values:\n' +
            '    [[[0, 0],\n' +
            '      [0, 0],\n' +
            '      [0, 0]],\n\n' +
            '     [[0, 0],\n' +
            '      [0, 0],\n' +
            '      [0, 0]],\n\n' +
            '     [[0, 0],\n' +
            '      [0, 0],\n' +
            '      [0, 0]]]');
    });
    it('3d string tensor verbose', () => {
        const verbose = true;
        const vals = [
            [['a', 'bb'], ['ccc', 'dddd']],
            [['e', 'ff'], ['ggg', 'hhhh']],
            [['i', 'jj'], ['kkk', 'llll']],
        ];
        const str = tf.tensor(vals).toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: string\n' +
            '  rank: 3\n' +
            '  shape: [3,2,2]\n' +
            '  values:\n' +
            '    [[[\'a\'  , \'bb\'  ],\n' +
            '      [\'ccc\', \'dddd\']],\n\n' +
            '     [[\'e\'  , \'ff\'  ],\n' +
            '      [\'ggg\', \'hhhh\']],\n\n' +
            '     [[\'i\'  , \'jj\'  ],\n' +
            '      [\'kkk\', \'llll\']]]');
    });
    it('3d bool tensor verbose', () => {
        const verbose = true;
        const str = tf.ones([3, 3, 2], 'bool').toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: bool\n' +
            '  rank: 3\n' +
            '  shape: [3,3,2]\n' +
            '  values:\n' +
            '    [[[true, true],\n' +
            '      [true, true],\n' +
            '      [true, true]],\n\n' +
            '     [[true, true],\n' +
            '      [true, true],\n' +
            '      [true, true]],\n\n' +
            '     [[true, true],\n' +
            '      [true, true],\n' +
            '      [true, true]]]');
    });
    it('1d long tensor verbose', () => {
        const verbose = true;
        const str = tf.zeros([100]).toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: float32\n' +
            '  rank: 1\n' +
            '  shape: [100]\n' +
            '  values:\n' +
            '    [0, 0, 0, ..., 0, 0, 0]');
    });
    it('1d long string tensor verbose', () => {
        const verbose = true;
        const str = tf.fill([100], 'hi').toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: string\n' +
            '  rank: 1\n' +
            '  shape: [100]\n' +
            '  values:\n' +
            '    [\'hi\', \'hi\', \'hi\', ..., \'hi\', \'hi\', \'hi\']');
    });
    it('2d long tensor verbose', () => {
        const verbose = true;
        const str = tf.zeros([100, 100]).toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: float32\n' +
            '  rank: 2\n' +
            '  shape: [100,100]\n' +
            '  values:\n' +
            '    [[0, 0, 0, ..., 0, 0, 0],\n' +
            '     [0, 0, 0, ..., 0, 0, 0],\n' +
            '     [0, 0, 0, ..., 0, 0, 0],\n' +
            '     ...,\n' +
            '     [0, 0, 0, ..., 0, 0, 0],\n' +
            '     [0, 0, 0, ..., 0, 0, 0],\n' +
            '     [0, 0, 0, ..., 0, 0, 0]]');
    });
    it('2d long string tensor verbose', () => {
        const verbose = true;
        const str = tf.fill([100, 100], 'a').toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: string\n' +
            '  rank: 2\n' +
            '  shape: [100,100]\n' +
            '  values:\n' +
            '    [[\'a\', \'a\', \'a\', ..., \'a\', \'a\', \'a\'],\n' +
            '     [\'a\', \'a\', \'a\', ..., \'a\', \'a\', \'a\'],\n' +
            '     [\'a\', \'a\', \'a\', ..., \'a\', \'a\', \'a\'],\n' +
            '     ...,\n' +
            '     [\'a\', \'a\', \'a\', ..., \'a\', \'a\', \'a\'],\n' +
            '     [\'a\', \'a\', \'a\', ..., \'a\', \'a\', \'a\'],\n' +
            '     [\'a\', \'a\', \'a\', ..., \'a\', \'a\', \'a\']]');
    });
    it('2d with padding to align columns verbose', () => {
        const verbose = true;
        const str = tf.tensor([
            [0.8597712, 3, 0.2740789], [0.6696132, 0.4825962, 2.75],
            [1.991, 0.0640865, 0.2983858]
        ]).toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: float32\n' +
            '  rank: 2\n' +
            '  shape: [3,3]\n' +
            '  values:\n' +
            '    [[0.8597712, 3        , 0.2740789],\n' +
            '     [0.6696132, 0.4825962, 2.75     ],\n' +
            '     [1.9910001, 0.0640865, 0.2983858]]');
    });
    it('2d string tensor with padding verbose', () => {
        const verbose = true;
        const str = tf.tensor([
            ['abcdef', 'a', 'abcdef'],
            ['abcdef', 'abcdef', 'abc'],
            ['abcd', 'abcdef', 'abcdef'],
        ]).toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: string\n' +
            '  rank: 2\n' +
            '  shape: [3,3]\n' +
            '  values:\n' +
            '    [[\'abcdef\', \'a\'     , \'abcdef\'],\n' +
            '     [\'abcdef\', \'abcdef\', \'abc\'   ],\n' +
            '     [\'abcd\'  , \'abcdef\', \'abcdef\']]');
    });
    it('scalar', () => {
        const str = tf.scalar(5).toString();
        expect(str).toEqual('Tensor\n' +
            '    5');
    });
    it('scalar string', () => {
        const str = tf.scalar('hello').toString();
        expect(str).toEqual('Tensor\n' +
            '    hello');
    });
    it('1d tensor', () => {
        const str = tf.zeros([4]).toString();
        expect(str).toEqual('Tensor\n' +
            '    [0, 0, 0, 0]');
    });
    it('2d tensor', () => {
        const str = tf.zeros([3, 3]).toString();
        expect(str).toEqual('Tensor\n' +
            '    [[0, 0, 0],\n' +
            '     [0, 0, 0],\n' +
            '     [0, 0, 0]]');
    });
    it('3d tensor', () => {
        const str = tf.zeros([3, 3, 2]).toString();
        expect(str).toEqual('Tensor\n' +
            '    [[[0, 0],\n' +
            '      [0, 0],\n' +
            '      [0, 0]],\n\n' +
            '     [[0, 0],\n' +
            '      [0, 0],\n' +
            '      [0, 0]],\n\n' +
            '     [[0, 0],\n' +
            '      [0, 0],\n' +
            '      [0, 0]]]');
    });
    it('1d long tensor', () => {
        const str = tf.zeros([100]).toString();
        expect(str).toEqual('Tensor\n' +
            '    [0, 0, 0, ..., 0, 0, 0]');
    });
    it('2d long tensor', () => {
        const str = tf.zeros([100, 100]).toString();
        expect(str).toEqual('Tensor\n' +
            '    [[0, 0, 0, ..., 0, 0, 0],\n' +
            '     [0, 0, 0, ..., 0, 0, 0],\n' +
            '     [0, 0, 0, ..., 0, 0, 0],\n' +
            '     ...,\n' +
            '     [0, 0, 0, ..., 0, 0, 0],\n' +
            '     [0, 0, 0, ..., 0, 0, 0],\n' +
            '     [0, 0, 0, ..., 0, 0, 0]]');
    });
    it('2d with padding to align columns', () => {
        const str = tf.tensor([
            [0.8597712, 3, 0.2740789], [0.6696132, 0.4825962, 2.75],
            [1.991, 0.0640865, 0.2983858]
        ]).toString();
        expect(str).toEqual('Tensor\n' +
            '    [[0.8597712, 3        , 0.2740789],\n' +
            '     [0.6696132, 0.4825962, 2.75     ],\n' +
            '     [1.9910001, 0.0640865, 0.2983858]]');
    });
    it('scalar complex64 verbose', () => {
        const verbose = true;
        const str = tf.complex(5, 6).toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: complex64\n' +
            '  rank: 0\n' +
            '  shape: []\n' +
            '  values:\n' +
            '    5 + 6j');
    });
    it('1d complex64 tensor verbose', () => {
        const verbose = true;
        const str = tf.complex([3, 5], [4, 6]).toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: complex64\n' +
            '  rank: 1\n' +
            '  shape: [2]\n' +
            '  values:\n' +
            '    [3 + 4j, 5 + 6j]');
    });
    it('2d complex64 tensor verbose', () => {
        const verbose = true;
        const str = tf.complex(tf.linspace(0, 8, 9), tf.linspace(8, 0, 9))
            .reshape([3, 3])
            .toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: complex64\n' +
            '  rank: 2\n' +
            '  shape: [3,3]\n' +
            '  values:\n' +
            '    [[0 + 8j, 1 + 7j, 2 + 6j],\n' +
            '     [3 + 5j, 4 + 4j, 5 + 3j],\n' +
            '     [6 + 2j, 7 + 1j, 8 + 0j]]');
    });
    it('3d complex64 tensor verbose', () => {
        const verbose = true;
        const str = tf.complex(tf.linspace(0, 17, 18), tf.linspace(17, 0, 18))
            .reshape([3, 3, 2])
            .toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: complex64\n' +
            '  rank: 3\n' +
            '  shape: [3,3,2]\n' +
            '  values:\n' +
            '    [[[0 + 17j, 1 + 16j],\n' +
            '      [2 + 15j, 3 + 14j],\n' +
            '      [4 + 13j, 5 + 12j]],\n\n' +
            '     [[6 + 11j, 7 + 10j],\n' +
            '      [8 + 9j , 9 + 8j ],\n' +
            '      [10 + 7j, 11 + 6j]],\n\n' +
            '     [[12 + 5j, 13 + 4j],\n' +
            '      [14 + 3j, 15 + 2j],\n' +
            '      [16 + 1j, 17 + 0j]]]');
    });
    it('1d long complex64 tensor verbose', () => {
        const verbose = true;
        const str = tf.complex(tf.linspace(0, 99, 100), tf.linspace(99, 0, 100))
            .toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: complex64\n' +
            '  rank: 1\n' +
            '  shape: [100]\n' +
            '  values:\n' +
            '    [0 + 99j, 1 + 98j, 2 + 97j, ..., 97 + 2j, 98 + 1j, 99 + 0j]');
    });
    it('2d long complex64 tensor verbose', () => {
        const verbose = true;
        const dim = 100;
        const str = tf.complex(tf.linspace(0, dim * dim - 1, dim * dim), tf.linspace(dim * dim - 1, 0, dim * dim))
            .reshape([dim, dim])
            .toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: complex64\n' +
            '  rank: 2\n' +
            '  shape: [100,100]\n' +
            '  values:\n' +
            // tslint:disable:max-line-length
            '    [[0 + 9999j   , 1 + 9998j   , 2 + 9997j   , ..., 97 + 9902j  , 98 + 9901j  , 99 + 9900j  ],\n' +
            '     [100 + 9899j , 101 + 9898j , 102 + 9897j , ..., 197 + 9802j , 198 + 9801j , 199 + 9800j ],\n' +
            '     [200 + 9799j , 201 + 9798j , 202 + 9797j , ..., 297 + 9702j , 298 + 9701j , 299 + 9700j ],\n' +
            '     ...,\n' +
            '     [9700 + 299j , 9701 + 298j , 9702 + 297j , ..., 9797 + 202j , 9798 + 201j , 9799 + 200j ],\n' +
            '     [9800 + 199j , 9801 + 198j , 9802 + 197j , ..., 9897 + 102j , 9898 + 101j , 9899 + 100j ],\n' +
            '     [9900 + 99j  , 9901 + 98j  , 9902 + 97j  , ..., 9997 + 2j   , 9998 + 1j   , 9999 + 0j   ]]');
        // tslint:enable:max-line-length
    });
    it('2d complex64 with padding to align columns verbose', () => {
        const verbose = true;
        const str = tf.complex([
            [0.8597712, 3, 0.2740789], [0.6696132, 0.4825962, 2.75],
            [1.991, 0.0640865, 0.2983858]
        ], [[1, 1.0102332, 3], [2, 5, 2.34424], [1.23, 2, 0.123]])
            .toString(verbose);
        expect(str).toEqual('Tensor\n' +
            '  dtype: complex64\n' +
            '  rank: 2\n' +
            '  shape: [3,3]\n' +
            '  values:\n' +
            '    [[0.8597712 + 1j   , 3 + 1.0102332j, 0.2740789 + 3j    ],\n' +
            '     [0.6696132 + 2j   , 0.4825962 + 5j, 2.75 + 2.34424j   ],\n' +
            '     [1.9910001 + 1.23j, 0.0640865 + 2j, 0.2983858 + 0.123j]]');
    });
    it('scalar complex64', () => {
        const str = tf.complex(5, 4).toString();
        expect(str).toEqual('Tensor\n' +
            '    5 + 4j');
    });
    it('1d complex64 tensor', () => {
        const str = tf.complex(tf.linspace(0, 3, 4), tf.linspace(3, 0, 4)).toString();
        expect(str).toEqual('Tensor\n' +
            '    [0 + 3j, 1 + 2j, 2 + 1j, 3 + 0j]');
    });
    it('2d complex64 tensor', () => {
        const str = tf.complex(tf.linspace(0, 8, 9), tf.linspace(8, 0, 9))
            .reshape([3, 3])
            .toString();
        expect(str).toEqual('Tensor\n' +
            '    [[0 + 8j, 1 + 7j, 2 + 6j],\n' +
            '     [3 + 5j, 4 + 4j, 5 + 3j],\n' +
            '     [6 + 2j, 7 + 1j, 8 + 0j]]');
    });
    it('3d complex64 tensor', () => {
        const str = tf.complex(tf.linspace(0, 17, 18), tf.linspace(17, 0, 18))
            .reshape([3, 3, 2])
            .toString();
        expect(str).toEqual('Tensor\n' +
            '    [[[0 + 17j, 1 + 16j],\n' +
            '      [2 + 15j, 3 + 14j],\n' +
            '      [4 + 13j, 5 + 12j]],\n\n' +
            '     [[6 + 11j, 7 + 10j],\n' +
            '      [8 + 9j , 9 + 8j ],\n' +
            '      [10 + 7j, 11 + 6j]],\n\n' +
            '     [[12 + 5j, 13 + 4j],\n' +
            '      [14 + 3j, 15 + 2j],\n' +
            '      [16 + 1j, 17 + 0j]]]');
    });
    it('1d long complex64 tensor', () => {
        const str = tf.complex(tf.linspace(0, 99, 100), tf.linspace(99, 0, 100)).toString();
        expect(str).toEqual('Tensor\n' +
            '    [0 + 99j, 1 + 98j, 2 + 97j, ..., 97 + 2j, 98 + 1j, 99 + 0j]');
    });
    it('2d long complex64 tensor', () => {
        const dim = 100;
        const str = tf.complex(tf.linspace(0, dim * dim - 1, dim * dim), tf.linspace(dim * dim - 1, 0, dim * dim))
            .reshape([dim, dim])
            .toString();
        expect(str).toEqual('Tensor\n' +
            // tslint:disable:max-line-length
            '    [[0 + 9999j   , 1 + 9998j   , 2 + 9997j   , ..., 97 + 9902j  , 98 + 9901j  , 99 + 9900j  ],\n' +
            '     [100 + 9899j , 101 + 9898j , 102 + 9897j , ..., 197 + 9802j , 198 + 9801j , 199 + 9800j ],\n' +
            '     [200 + 9799j , 201 + 9798j , 202 + 9797j , ..., 297 + 9702j , 298 + 9701j , 299 + 9700j ],\n' +
            '     ...,\n' +
            '     [9700 + 299j , 9701 + 298j , 9702 + 297j , ..., 9797 + 202j , 9798 + 201j , 9799 + 200j ],\n' +
            '     [9800 + 199j , 9801 + 198j , 9802 + 197j , ..., 9897 + 102j , 9898 + 101j , 9899 + 100j ],\n' +
            '     [9900 + 99j  , 9901 + 98j  , 9902 + 97j  , ..., 9997 + 2j   , 9998 + 1j   , 9999 + 0j   ]]');
        // tslint:enable:max-line-length
    });
    it('2d complex64 with padding to align columns', () => {
        const str = tf.complex([
            [0.8597712, 3, 0.2740789], [0.6696132, 0.4825962, 2.75],
            [1.991, 0.0640865, 0.2983858]
        ], [[1, 1.0102332, 3], [2, 5, 2.34424], [1.23, 2, 0.123]])
            .toString();
        expect(str).toEqual('Tensor\n' +
            '    [[0.8597712 + 1j   , 3 + 1.0102332j, 0.2740789 + 3j    ],\n' +
            '     [0.6696132 + 2j   , 0.4825962 + 5j, 2.75 + 2.34424j   ],\n' +
            '     [1.9910001 + 1.23j, 0.0640865 + 2j, 0.2983858 + 0.123j]]');
    });
});
describeWithFlags('tensor grad', ALL_ENVS, () => {
    it('grad with second derivative', async () => {
        // f(x) = x ^ 3
        const f = (x) => x.pow(tf.scalar(3, 'int32'));
        // f'(x) = 3x ^ 2
        const g = tf.grad(f);
        // f''(x) = 6x
        const gg = tf.grad(g);
        const x = tf.tensor1d([2, 3]);
        const data = gg(x);
        expectArraysClose(await data.data(), [12, 18]);
    });
});
describeWithFlags('tensor.data', ALL_ENVS, () => {
    it('interleaving .data() and .dataSync()', async () => {
        const a = tf.tensor1d([1, 2, 3]);
        const b = tf.tensor1d([4, 5, 6]);
        const ra = a.square();
        const rb = b.square();
        expectArraysClose(await a.data(), [1, 2, 3]);
        expectArraysClose(await b.data(), [4, 5, 6]);
        expectArraysClose(await rb.data(), [16, 25, 36]);
        expectArraysClose(await ra.data(), [1, 4, 9]);
    });
    it('.data() postpones disposal of tensor', done => {
        expect(tf.memory().numTensors).toBe(0);
        tf.tidy(() => {
            const a = tf.scalar(5);
            expect(tf.memory().numTensors).toBe(1);
            a.square(); // Uploads it on GPU.
            a.data().then(vals => {
                // The tidy above should not dispose the scalar since there is
                // a pending data read.
                expectNumbersClose(vals[0], 5);
            });
        });
        // tidy ends immediately, but should not dispose the scalar.
        setTimeout(() => {
            // tidy should dispose the tensor.
            expect(tf.memory().numTensors).toBe(0);
            done();
        });
    });
    it('calling .data() twice works (2 subscribers to a single read)', done => {
        tf.tidy(() => {
            const a = tf.scalar(5);
            a.square(); // Uploads it on GPU.
            a.data().then(vals => {
                expectNumbersClose(vals[0], 5);
            });
            a.data()
                .then(vals => {
                expectNumbersClose(vals[0], 5);
            })
                .then(done);
        });
        // tidy ends immediately, but should not dispose the scalar since there is
        // a pending data read.
    });
});
describeWithFlags('x instanceof Tensor', ALL_ENVS, () => {
    it('x: Tensor', () => {
        const t = tf.scalar(1);
        expect(t instanceof Tensor).toBe(true);
    });
    it('x: other object, fails', () => {
        const t = { something: 'else' };
        expect(t instanceof Tensor).toBe(false);
    });
    it('x: undefined or null, fails', () => {
        // tslint:disable-next-line:no-any
        expect(undefined instanceof Tensor).toBe(false);
        // tslint:disable-next-line:no-any
        expect(null instanceof Tensor).toBe(false);
    });
});
describeWithFlags('tensor with 0 in shape', ALL_ENVS, () => {
    it('1d of shape [0]', async () => {
        const a = tf.tensor1d([]);
        expect(a.dtype).toBe('float32');
        expect(a.rank).toBe(1);
        expect(a.shape).toEqual([0]);
        expectArraysEqual(await a.data(), []);
    });
    it('1d string tensor of shape [0]', async () => {
        const a = tf.tensor1d([], 'string');
        expect(a.dtype).toBe('string');
        expect(a.rank).toBe(1);
        expect(a.shape).toEqual([0]);
        expectArraysEqual(await a.data(), []);
    });
    it('2d of shape [0, 5]', async () => {
        const a = tf.tensor2d([], [0, 5]);
        expect(a.dtype).toBe('float32');
        expect(a.rank).toBe(2);
        expect(a.shape).toEqual([0, 5]);
        expectArraysEqual(await a.data(), []);
    });
    it('2d string tensor of shape [0, 5]', async () => {
        const a = tf.tensor2d([], [0, 5], 'string');
        expect(a.dtype).toBe('string');
        expect(a.rank).toBe(2);
        expect(a.shape).toEqual([0, 5]);
        expectArraysEqual(await a.data(), []);
    });
    it('2d throws when values are not empty', () => {
        const values = [1, 2, 3, 4];
        expect(() => tf.tensor2d(values, [0, 5], 'float32'))
            .toThrowError('Based on the provided shape, [0,5], the ' +
            'tensor should have 0 values but has 4');
    });
    it('3d of shape [0, 3, 0]', async () => {
        const a = tf.tensor3d([], [0, 3, 0]);
        expect(a.dtype).toBe('float32');
        expect(a.rank).toBe(3);
        expect(a.shape).toEqual([0, 3, 0]);
        expectArraysEqual(await a.data(), []);
    });
    it('3d throws when values are not empty', () => {
        const values = [1, 2, 3];
        expect(() => tf.tensor3d(values, [0, 3, 0], 'float32'))
            .toThrowError('Based on the provided shape, [0,3,0], the ' +
            'tensor should have 0 values but has 3');
    });
    it('4d of shape [1, 3, 0, 5]', async () => {
        const a = tf.tensor4d([], [1, 3, 0, 5]);
        expect(a.dtype).toBe('float32');
        expect(a.rank).toBe(4);
        expect(a.shape).toEqual([1, 3, 0, 5]);
        expectArraysEqual(await a.data(), []);
    });
    it('4d throws when values are not empty', () => {
        const values = [1, 2, 3];
        expect(() => tf.tensor4d(values, [1, 3, 0, 5], 'float32'))
            .toThrowError('Based on the provided shape, [1,3,0,5], the ' +
            'tensor should have 0 values but has 3');
    });
    it('complex64 with 0 in shape', async () => {
        const areal = tf.tensor2d([], [0, 5]);
        const breal = tf.tensor2d([], [0, 5]);
        const a = tf.complex(areal, breal);
        expect(a.dtype).toBe('complex64');
        expect(a.rank).toBe(2);
        expect(a.shape).toEqual([0, 5]);
        expectArraysEqual(await a.data(), []);
    });
});
describeWithFlags('tensor.bytes()', ALL_ENVS, () => {
    /** Helper method to get the bytes from a typed array. */
    function getBytes(a) {
        return new Uint8Array(a.buffer);
    }
    it('float32 tensor', async () => {
        const a = tf.tensor([1.1, 3.2, 7], [3], 'float32');
        expect(await a.bytes()).toEqual(getBytes(new Float32Array([1.1, 3.2, 7])));
    });
    it('int32 tensor', async () => {
        const a = tf.tensor([1.1, 3.2, 7], [3], 'int32');
        expect(await a.bytes()).toEqual(getBytes(new Int32Array([1, 3, 7])));
    });
    it('bool tensor', async () => {
        const a = tf.tensor([true, true, false], [3], 'bool');
        expect(await a.bytes()).toEqual(new Uint8Array([1, 1, 0]));
    });
    it('string tensor from native strings', async () => {
        const a = tf.tensor(['hello', 'world'], [2], 'string');
        expect(await a.bytes()).toEqual([
            encodeString('hello'), encodeString('world')
        ]);
    });
    it('string tensor from encoded bytes', async () => {
        const a = tf.tensor([encodeString('hello'), encodeString('world')], [2], 'string');
        expect(await a.bytes()).toEqual([
            encodeString('hello'), encodeString('world')
        ]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVuc29yX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL3RlbnNvcl90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sS0FBSyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQzlCLE9BQU8sRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5RSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ25DLE9BQU8sRUFBUyxNQUFNLEVBQXlDLE1BQU0sVUFBVSxDQUFDO0FBQ2hGLE9BQU8sRUFBQyxhQUFhLEVBQUUsaUJBQWlCLEVBQUUsaUJBQWlCLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFcEcsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUVwQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUN6QyxFQUFFLENBQUMsMkJBQTJCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDekMsWUFBWTtRQUNaLElBQUksQ0FBQyxHQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFN0MsY0FBYztRQUNkLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTdDLGNBQWM7UUFDZCxjQUFjO1FBQ2QsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkIsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdEQsa0NBQWtDO1FBQ2xDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3hELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3hDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTdCLGtDQUFrQztRQUNsQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBUSxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUV0RSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVqRCxrQkFBa0I7UUFDbEIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBVSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4QixpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNoQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDdkUsQ0FBQyxDQUFDO1FBRUgsbUJBQW1CO1FBQ25CLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEIsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDaEMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1NBQ3ZFLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDZCQUE2QixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzNDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEQsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxRSxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywyQkFBMkIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN6QyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xELGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsa0NBQWtDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDaEQsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFFLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHNCQUFzQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3BDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzlCLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG1CQUFtQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ2pDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN0QyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVwQyxNQUFNLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQVUsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDL0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMscUJBQXFCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDbkMsTUFBTSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN2QyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVyQyxNQUFNLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHFCQUFxQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ25DLE1BQU0sQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXhDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHFCQUFxQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ25DLE1BQU0sQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUM3QyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU1QyxNQUFNLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdEQsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDcEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzNELE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakQsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRCxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDakMsTUFBTSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXBDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBVSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUMvQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0QyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNuQyxNQUFNLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXJDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDaEQsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMscUJBQXFCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDbkMsTUFBTSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbkQsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFeEMsTUFBTSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbkQsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMscUJBQXFCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDbkMsTUFBTSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTVDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBVSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN0RCxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxN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QUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMseUJBQXlCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDdkMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbkMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFN0IsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbEMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0IsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMEJBQTBCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDeEMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbkMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNEJBQTRCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDMUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQixpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxlQUFlLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDN0IsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZUFBZSxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzdCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDM0IsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9DLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLCtDQUErQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzdELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx1REFBdUQsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNyRSxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNuRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsbURBQW1ELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDakUsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUM1QyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9DLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLCtCQUErQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzdDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsK0JBQStCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDN0MsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRSxLQUFLLElBQUksRUFBRTtRQUMxRCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO1lBQ2xCLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEQsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDakMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDBDQUEwQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3hELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7WUFDbEIsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNQLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNqRCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO1lBQ2xCLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN4RSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDUCxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0RBQXNELEVBQUUsR0FBRyxFQUFFO1FBQzlELDZEQUE2RDtRQUM3RCxNQUFNLElBQUksR0FBRyxJQUFJLFlBQVksQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sSUFBSSxHQUFHLElBQUksWUFBWSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEQsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG1FQUFtRSxFQUNuRSxHQUFHLEVBQUU7UUFDSCxNQUFNLElBQUksR0FBRyxJQUFJLFlBQVksQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sSUFBSSxHQUFHLElBQUksWUFBWSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDdkUsQ0FBQyxDQUFDLENBQUM7SUFFTixFQUFFLENBQUMsaUNBQWlDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDL0MsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM1QixpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsaUNBQWlDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDL0MsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM1QixpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsaUNBQWlDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDL0MsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM1QixpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMkNBQTJDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDekQsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1FBQzVELE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzVCLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNoRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw2QkFBNkIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUMzQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDaEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsOEJBQThCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDNUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDdkQsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNEJBQTRCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDMUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDckQsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMkJBQTJCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDekMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEQsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZUFBZSxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzdCLE1BQU0s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O0lBQ2xELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDhCQUE4QixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzVDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDhCQUE4QixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzVDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUMxQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFD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LEVBQUU7UUFDMUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FDakIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDakUsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDJCQUEyQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3pDLE1BQU0sQ0FBQyxHQUNILEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDNUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGVBQWUsRUFBRSxLQUFLLElBQUksRUFBRTtRQUM3QixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZUFBZSxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzdCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzdELE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsYUFBYSxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzNCLE1BQU0sQ0FBQyxHQUNILEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN6RSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLCtDQUErQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzdELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ25FLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsdURBQXVELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDckUsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN2RSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsbURBQW1ELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDakUsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDhCQUE4QixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzVDLE1BQU0sQ0FBQyxHQUNILEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUM1QyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUNqQixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUMxQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUNqQixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywyQkFBMkIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN6QyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUNqQixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNwQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO1FBQzlCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtRQUM3QixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUMxQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM1QixpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsK0NBQStDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDN0QsNEVBQTRFO1FBQzVFLGtFQUFrRTtRQUNsRSxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ2hFLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHlEQUF5RCxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3ZFLGtDQUFrQztRQUNsQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQVEsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDN0UsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsaUNBQWlDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDL0MsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM1QixpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsbUNBQW1DLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDakQsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM1QixpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO1FBQzVCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG1CQUFtQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ2pDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNwRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN0QyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUIsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsd0JBQXdCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDdEMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNwRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNsRCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHNDQUFzQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3BELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdkMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRTtRQUNoQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDcEMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMEJBQTBCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDeEMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3BELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHdCQUF3QixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3RDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekIsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzdELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7UUFDOUIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDM0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekIsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHFCQUFxQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ25DLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzFELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3BELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3hDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4RSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNwRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN0QyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNwRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUU7UUFDaEMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7UUFDOUIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzlELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNuQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDN0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekIsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMEJBQTBCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDeEMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FDaEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQ25DLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekIsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsd0JBQXdCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDdEMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDbkUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDcEMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNqRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3BELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3hDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQ2hCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUMvQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO1FBQzdCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxF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QUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNqRCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNuRCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNoRCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN2RCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRSxHQUFHLEVBQUU7UUFDN0MsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDNUUsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDMUUsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDekUsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENB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QUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwRCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1FBQzdDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwRCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7UUFDNUIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3BELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNqRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUU7UUFDckMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3BELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDbkQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO1FBQ25DLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwRCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDbkQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO1FBQzVDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwRCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFD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RUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDaEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO1FBQ2xCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtRQUNsQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4QyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO1FBQ2xCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO1FBQ2xCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzFELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuQixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FB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LENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdFLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGNBQWMsRUFBRSxLQUFLLElBQUksRUFBRTtRQUM1QixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2pELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZFLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFLLElBQUksRUFBRTtRQUMzQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG1DQUFtQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ2pELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN2RCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDOUIsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUM7U0FDN0MsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsa0NBQWtDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDaEQsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FDZixDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ25FLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUM5QixZQUFZLENBQUMsT0FBTyxDQUFDLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQztTQUM3QyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQgKiBhcyB0ZiBmcm9tICcuL2luZGV4JztcbmltcG9ydCB7QUxMX0VOVlMsIGRlc2NyaWJlV2l0aEZsYWdzLCBTWU5DX0JBQ0tFTkRfRU5WU30gZnJvbSAnLi9qYXNtaW5lX3V0aWwnO1xuaW1wb3J0IHt0ZW5zb3I1ZH0gZnJvbSAnLi9vcHMvb3BzJztcbmltcG9ydCB7U2NhbGFyLCBUZW5zb3IsIFRlbnNvcjFELCBUZW5zb3IyRCwgVGVuc29yM0QsIFRlbnNvcjREfSBmcm9tICcuL3RlbnNvcic7XG5pbXBvcnQge2VuY29kZVN0cmluZ3MsIGV4cGVjdEFycmF5c0Nsb3NlLCBleHBlY3RBcnJheXNFcXVhbCwgZXhwZWN0TnVtYmVyc0Nsb3NlfSBmcm9tICcuL3Rlc3RfdXRpbCc7XG5pbXBvcnQge1JhbmssIFRlbnNvckxpa2UxRCwgVGVuc29yTGlrZTJELCBUZW5zb3JMaWtlM0QsIFRlbnNvckxpa2U0RCwgVHlwZWRBcnJheX0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQge2VuY29kZVN0cmluZ30gZnJvbSAnLi91dGlsJztcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ3RlbnNvcicsIEFMTF9FTlZTLCAoKSA9PiB7XG4gIGl0KCdUZW5zb3JzIG9mIGFyYml0cmFyeSBzaXplJywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIFsxLCAyLCAzXVxuICAgIGxldCB0OiBUZW5zb3IgPSB0Zi50ZW5zb3IxZChbMSwgMiwgM10pO1xuICAgIGV4cGVjdCh0LnJhbmspLnRvQmUoMSk7XG4gICAgZXhwZWN0KHQuc2l6ZSkudG9CZSgzKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCB0LmRhdGEoKSwgWzEsIDIsIDNdKTtcblxuICAgIC8vIFtbMSwgMiwgM11dXG4gICAgdCA9IHRmLnRlbnNvcjJkKFsxLCAyLCAzXSwgWzEsIDNdKTtcbiAgICBleHBlY3QodC5yYW5rKS50b0JlKDIpO1xuICAgIGV4cGVjdCh0LnNpemUpLnRvQmUoMyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgdC5kYXRhKCksIFsxLCAyLCAzXSk7XG5cbiAgICAvLyBbWzEsIDIsIDNdLFxuICAgIC8vICBbNCwgNSwgNl1dXG4gICAgdCA9IHRmLnRlbnNvcjJkKFsxLCAyLCAzLCA0LCA1LCA2XSwgWzIsIDNdKTtcbiAgICBleHBlY3QodC5yYW5rKS50b0JlKDIpO1xuICAgIGV4cGVjdCh0LnNpemUpLnRvQmUoNik7XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCB0LmRhdGEoKSwgWzEsIDIsIDMsIDQsIDUsIDZdKTtcblxuICAgIC8vIFNoYXBlIG1pc21hdGNoIHdpdGggdGhlIHZhbHVlcy5cbiAgICBleHBlY3QoKCkgPT4gdGYudGVuc29yMmQoWzFdLCBbMSwgMl0pKS50b1Rocm93RXJyb3IoKTtcbiAgfSk7XG5cbiAgaXQoJ1RlbnNvcnMgb2YgZXhwbGljaXQgc2l6ZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB0ID0gdGYudGVuc29yMWQoWzUsIDMsIDJdKTtcbiAgICBleHBlY3QodC5yYW5rKS50b0JlKDEpO1xuICAgIGV4cGVjdCh0LnNoYXBlKS50b0VxdWFsKFszXSk7XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgZXhwZWN0KCgpID0+IHRmLnRlbnNvcjNkKFsxLCAyXSwgWzEsIDIsIDMsIDVdIGFzIGFueSkpLnRvVGhyb3dFcnJvcigpO1xuXG4gICAgY29uc3QgdDQgPSB0Zi50ZW5zb3I0ZChbMSwgMiwgMywgNF0sIFsxLCAyLCAxLCAyXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgdDQuZGF0YSgpLCBbMSwgMiwgMywgNF0pO1xuXG4gICAgLy8gVGVuc29yIG9mIG9uZXMuXG4gICAgY29uc3QgeCA9IHRmLm9uZXM8UmFuay5SMz4oWzMsIDQsIDJdKTtcbiAgICBleHBlY3QoeC5yYW5rKS50b0JlKDMpO1xuICAgIGV4cGVjdCh4LnNpemUpLnRvQmUoMjQpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHguZGF0YSgpLCBbXG4gICAgICAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXG4gICAgXSk7XG5cbiAgICAvLyBUZW5zb3Igb2YgemVyb3MuXG4gICAgY29uc3QgeiA9IHRmLnplcm9zPFJhbmsuUjM+KFszLCA0LCAyXSk7XG4gICAgZXhwZWN0KHoucmFuaykudG9CZSgzKTtcbiAgICBleHBlY3Qoei5zaXplKS50b0JlKDI0KTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCB6LmRhdGEoKSwgW1xuICAgICAgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCxcbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ1RlbnNvciBkYXRhU3luYyBDUFUgLS0+IEdQVScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoWzEsIDIsIDMsIDQsIDUsIDZdLCBbMywgMl0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGEuZGF0YSgpLCBuZXcgRmxvYXQzMkFycmF5KFsxLCAyLCAzLCA0LCA1LCA2XSkpO1xuICB9KTtcblxuICBpdCgnVGVuc29yLmRhdGEoKSBDUFUgLS0+IEdQVScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoWzEsIDIsIDMsIDQsIDUsIDZdLCBbMywgMl0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGEuZGF0YSgpLCBuZXcgRmxvYXQzMkFycmF5KFsxLCAyLCAzLCA0LCA1LCA2XSkpO1xuICB9KTtcblxuICBpdCgnVGVuc29yLmRhdGEoKSBwYWNrZWQgQ1BVIC0tPiBHUFUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKFsxLCAyLCAzLCA0LCA1LCA2XSwgWzMsIDJdKTtcbiAgICB0Zi5tYXRNdWwoYSwgdGYudGVuc29yMmQoWzEsIDJdLCBbMiwgMV0pKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgbmV3IEZsb2F0MzJBcnJheShbMSwgMiwgMywgNCwgNSwgNl0pKTtcbiAgfSk7XG5cbiAgaXQoJ1NjYWxhciBiYXNpYyBtZXRob2RzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi5zY2FsYXIoNSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYS5kYXRhKCksIFs1XSk7XG4gICAgZXhwZWN0KGEucmFuaykudG9CZSgwKTtcbiAgICBleHBlY3QoYS5zaXplKS50b0JlKDEpO1xuICAgIGV4cGVjdChhLnNoYXBlKS50b0VxdWFsKFtdKTtcbiAgfSk7XG5cbiAgaXQoJ2luZGV4VG9Mb2MgU2NhbGFyJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSBhd2FpdCB0Zi5zY2FsYXIoMCkuYnVmZmVyKCk7XG4gICAgZXhwZWN0KGEuaW5kZXhUb0xvYygwKSkudG9FcXVhbChbXSk7XG5cbiAgICBjb25zdCBiID0gYXdhaXQgdGYuemVyb3M8UmFuay5SMD4oW10pLmJ1ZmZlcigpO1xuICAgIGV4cGVjdChiLmluZGV4VG9Mb2MoMCkpLnRvRXF1YWwoW10pO1xuICB9KTtcblxuICBpdCgnaW5kZXhUb0xvYyBUZW5zb3IxRCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gYXdhaXQgdGYuemVyb3MoWzNdKS5idWZmZXIoKTtcbiAgICBleHBlY3QoYS5pbmRleFRvTG9jKDApKS50b0VxdWFsKFswXSk7XG4gICAgZXhwZWN0KGEuaW5kZXhUb0xvYygxKSkudG9FcXVhbChbMV0pO1xuICAgIGV4cGVjdChhLmluZGV4VG9Mb2MoMikpLnRvRXF1YWwoWzJdKTtcblxuICAgIGNvbnN0IGIgPSBhd2FpdCB0Zi56ZXJvczxSYW5rLlIxPihbM10pLmJ1ZmZlcigpO1xuICAgIGV4cGVjdChiLmluZGV4VG9Mb2MoMCkpLnRvRXF1YWwoWzBdKTtcbiAgICBleHBlY3QoYi5pbmRleFRvTG9jKDEpKS50b0VxdWFsKFsxXSk7XG4gICAgZXhwZWN0KGIuaW5kZXhUb0xvYygyKSkudG9FcXVhbChbMl0pO1xuICB9KTtcblxuICBpdCgnaW5kZXhUb0xvYyBUZW5zb3IyRCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gYXdhaXQgdGYuemVyb3MoWzMsIDJdKS5idWZmZXIoKTtcbiAgICBleHBlY3QoYS5pbmRleFRvTG9jKDApKS50b0VxdWFsKFswLCAwXSk7XG4gICAgZXhwZWN0KGEuaW5kZXhUb0xvYygxKSkudG9FcXVhbChbMCwgMV0pO1xuICAgIGV4cGVjdChhLmluZGV4VG9Mb2MoMikpLnRvRXF1YWwoWzEsIDBdKTtcbiAgICBleHBlY3QoYS5pbmRleFRvTG9jKDMpKS50b0VxdWFsKFsxLCAxXSk7XG4gICAgZXhwZWN0KGEuaW5kZXhUb0xvYyg0KSkudG9FcXVhbChbMiwgMF0pO1xuICAgIGV4cGVjdChhLmluZGV4VG9Mb2MoNSkpLnRvRXF1YWwoWzIsIDFdKTtcblxuICAgIGNvbnN0IGIgPSBhd2FpdCB0Zi56ZXJvczxSYW5rLlIyPihbMywgMl0pLmJ1ZmZlcigpO1xuICAgIGV4cGVjdChiLmluZGV4VG9Mb2MoMCkpLnRvRXF1YWwoWzAsIDBdKTtcbiAgICBleHBlY3QoYi5pbmRleFRvTG9jKDEpKS50b0VxdWFsKFswLCAxXSk7XG4gICAgZXhwZWN0KGIuaW5kZXhUb0xvYygyKSkudG9FcXVhbChbMSwgMF0pO1xuICAgIGV4cGVjdChiLmluZGV4VG9Mb2MoMykpLnRvRXF1YWwoWzEsIDFdKTtcbiAgICBleHBlY3QoYi5pbmRleFRvTG9jKDQpKS50b0VxdWFsKFsyLCAwXSk7XG4gICAgZXhwZWN0KGIuaW5kZXhUb0xvYyg1KSkudG9FcXVhbChbMiwgMV0pO1xuICB9KTtcblxuICBpdCgnaW5kZXhUb0xvYyBUZW5zb3IzRCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gYXdhaXQgdGYuemVyb3MoWzMsIDIsIDJdKS5idWZmZXIoKTtcbiAgICBleHBlY3QoYS5pbmRleFRvTG9jKDApKS50b0VxdWFsKFswLCAwLCAwXSk7XG4gICAgZXhwZWN0KGEuaW5kZXhUb0xvYygxKSkudG9FcXVhbChbMCwgMCwgMV0pO1xuICAgIGV4cGVjdChhLmluZGV4VG9Mb2MoMikpLnRvRXF1YWwoWzAsIDEsIDBdKTtcbiAgICBleHBlY3QoYS5pbmRleFRvTG9jKDMpKS50b0VxdWFsKFswLCAxLCAxXSk7XG4gICAgZXhwZWN0KGEuaW5kZXhUb0xvYyg0KSkudG9FcXVhbChbMSwgMCwgMF0pO1xuICAgIGV4cGVjdChhLmluZGV4VG9Mb2MoNSkpLnRvRXF1YWwoWzEsIDAsIDFdKTtcbiAgICBleHBlY3QoYS5pbmRleFRvTG9jKDExKSkudG9FcXVhbChbMiwgMSwgMV0pO1xuXG4gICAgY29uc3QgYiA9IGF3YWl0IHRmLnplcm9zPFJhbmsuUjM+KFszLCAyLCAyXSkuYnVmZmVyKCk7XG4gICAgZXhwZWN0KGIuaW5kZXhUb0xvYygwKSkudG9FcXVhbChbMCwgMCwgMF0pO1xuICAgIGV4cGVjdChiLmluZGV4VG9Mb2MoMSkpLnRvRXF1YWwoWzAsIDAsIDFdKTtcbiAgICBleHBlY3QoYi5pbmRleFRvTG9jKDIpKS50b0VxdWFsKFswLCAxLCAwXSk7XG4gICAgZXhwZWN0KGIuaW5kZXhUb0xvYygzKSkudG9FcXVhbChbMCwgMSwgMV0pO1xuICAgIGV4cGVjdChiLmluZGV4VG9Mb2MoNCkpLnRvRXF1YWwoWzEsIDAsIDBdKTtcbiAgICBleHBlY3QoYi5pbmRleFRvTG9jKDUpKS50b0VxdWFsKFsxLCAwLCAxXSk7XG4gICAgZXhwZWN0KGIuaW5kZXhUb0xvYygxMSkpLnRvRXF1YWwoWzIsIDEsIDFdKTtcbiAgfSk7XG5cbiAgaXQoJ2luZGV4VG9Mb2MgVGVuc29yIDVEJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHZhbHVlcyA9IG5ldyBGbG9hdDMyQXJyYXkoWzEsIDIsIDMsIDRdKTtcbiAgICBjb25zdCBhID0gYXdhaXQgdGVuc29yNWQodmFsdWVzLCBbMiwgMSwgMSwgMSwgMl0pLmJ1ZmZlcigpO1xuICAgIGV4cGVjdChhLmluZGV4VG9Mb2MoMCkpLnRvRXF1YWwoWzAsIDAsIDAsIDAsIDBdKTtcbiAgICBleHBlY3QoYS5pbmRleFRvTG9jKDEpKS50b0VxdWFsKFswLCAwLCAwLCAwLCAxXSk7XG4gICAgZXhwZWN0KGEuaW5kZXhUb0xvYygyKSkudG9FcXVhbChbMSwgMCwgMCwgMCwgMF0pO1xuICAgIGV4cGVjdChhLmluZGV4VG9Mb2MoMykpLnRvRXF1YWwoWzEsIDAsIDAsIDAsIDFdKTtcbiAgfSk7XG5cbiAgaXQoJ2xvY1RvSW5kZXggU2NhbGFyJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSBhd2FpdCB0Zi5zY2FsYXIoMCkuYnVmZmVyKCk7XG4gICAgZXhwZWN0KGEubG9jVG9JbmRleChbXSkpLnRvRXF1YWwoMCk7XG5cbiAgICBjb25zdCBiID0gYXdhaXQgdGYuemVyb3M8UmFuay5SMD4oW10pLmJ1ZmZlcigpO1xuICAgIGV4cGVjdChiLmxvY1RvSW5kZXgoW10pKS50b0VxdWFsKDApO1xuICB9KTtcblxuICBpdCgnbG9jVG9JbmRleCBUZW5zb3IxRCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gYXdhaXQgdGYuemVyb3M8UmFuay5SMT4oWzNdKS5idWZmZXIoKTtcbiAgICBleHBlY3QoYS5sb2NUb0luZGV4KFswXSkpLnRvRXF1YWwoMCk7XG4gICAgZXhwZWN0KGEubG9jVG9JbmRleChbMV0pKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChhLmxvY1RvSW5kZXgoWzJdKSkudG9FcXVhbCgyKTtcblxuICAgIGNvbnN0IGIgPSBhd2FpdCB0Zi56ZXJvczxSYW5rLlIxPihbM10pLmJ1ZmZlcigpO1xuICAgIGV4cGVjdChiLmxvY1RvSW5kZXgoWzBdKSkudG9FcXVhbCgwKTtcbiAgICBleHBlY3QoYi5sb2NUb0luZGV4KFsxXSkpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGIubG9jVG9JbmRleChbMl0pKS50b0VxdWFsKDIpO1xuICB9KTtcblxuICBpdCgnbG9jVG9JbmRleCBUZW5zb3IyRCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gYXdhaXQgdGYuemVyb3M8UmFuay5SMj4oWzMsIDJdKS5idWZmZXIoKTtcbiAgICBleHBlY3QoYS5sb2NUb0luZGV4KFswLCAwXSkpLnRvRXF1YWwoMCk7XG4gICAgZXhwZWN0KGEubG9jVG9JbmRleChbMCwgMV0pKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChhLmxvY1RvSW5kZXgoWzEsIDBdKSkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoYS5sb2NUb0luZGV4KFsxLCAxXSkpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGEubG9jVG9JbmRleChbMiwgMF0pKS50b0VxdWFsKDQpO1xuICAgIGV4cGVjdChhLmxvY1RvSW5kZXgoWzIsIDFdKSkudG9FcXVhbCg1KTtcblxuICAgIGNvbnN0IGIgPSBhd2FpdCB0Zi56ZXJvczxSYW5rLlIyPihbMywgMl0pLmJ1ZmZlcigpO1xuICAgIGV4cGVjdChiLmxvY1RvSW5kZXgoWzAsIDBdKSkudG9FcXVhbCgwKTtcbiAgICBleHBlY3QoYi5sb2NUb0luZGV4KFswLCAxXSkpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGIubG9jVG9JbmRleChbMSwgMF0pKS50b0VxdWFsKDIpO1xuICAgIGV4cGVjdChiLmxvY1RvSW5kZXgoWzEsIDFdKSkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoYi5sb2NUb0luZGV4KFsyLCAwXSkpLnRvRXF1YWwoNCk7XG4gICAgZXhwZWN0KGIubG9jVG9JbmRleChbMiwgMV0pKS50b0VxdWFsKDUpO1xuICB9KTtcblxuICBpdCgnbG9jVG9JbmRleCBUZW5zb3IzRCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gYXdhaXQgdGYuemVyb3M8UmFuay5SMz4oWzMsIDIsIDJdKS5idWZmZXIoKTtcbiAgICBleHBlY3QoYS5sb2NUb0luZGV4KFswLCAwLCAwXSkpLnRvRXF1YWwoMCk7XG4gICAgZXhwZWN0KGEubG9jVG9JbmRleChbMCwgMCwgMV0pKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChhLmxvY1RvSW5kZXgoWzAsIDEsIDBdKSkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoYS5sb2NUb0luZGV4KFswLCAxLCAxXSkpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGEubG9jVG9JbmRleChbMSwgMCwgMF0pKS50b0VxdWFsKDQpO1xuICAgIGV4cGVjdChhLmxvY1RvSW5kZXgoWzEsIDAsIDFdKSkudG9FcXVhbCg1KTtcbiAgICBleHBlY3QoYS5sb2NUb0luZGV4KFsyLCAxLCAxXSkpLnRvRXF1YWwoMTEpO1xuXG4gICAgY29uc3QgYiA9IGF3YWl0IHRmLnplcm9zPFJhbmsuUjM+KFszLCAyLCAyXSkuYnVmZmVyKCk7XG4gICAgZXhwZWN0KGIubG9jVG9JbmRleChbMCwgMCwgMF0pKS50b0VxdWFsKDApO1xuICAgIGV4cGVjdChiLmxvY1RvSW5kZXgoWzAsIDAsIDFdKSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoYi5sb2NUb0luZGV4KFswLCAxLCAwXSkpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGIubG9jVG9JbmRleChbMCwgMSwgMV0pKS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChiLmxvY1RvSW5kZXgoWzEsIDAsIDBdKSkudG9FcXVhbCg0KTtcbiAgICBleHBlY3QoYi5sb2NUb0luZGV4KFsxLCAwLCAxXSkpLnRvRXF1YWwoNSk7XG4gICAgZXhwZWN0KGIubG9jVG9JbmRleChbMiwgMSwgMV0pKS50b0VxdWFsKDExKTtcbiAgfSk7XG5cbiAgaXQoJ1RlbnNvciBhc3NpZ25hYmlsaXR5IChhc3NlcnRzIGNvbXBpbGVyKScsICgpID0+IHtcbiAgICAvLyBUaGlzIHRlc3QgYXNzZXJ0cyBjb21waWxhdGlvbiwgbm90IGRvaW5nIGFueSBydW4tdGltZSBhc3NlcnRpb24uXG4gICAgY29uc3QgYTogVGVuc29yPFJhbmsuUjA+ID0gbnVsbDtcbiAgICBjb25zdCBiOiBTY2FsYXIgPSBhO1xuICAgIGV4cGVjdChiKS50b0JlTnVsbCgpO1xuXG4gICAgY29uc3QgYTE6IFRlbnNvcjxSYW5rLlIxPiA9IG51bGw7XG4gICAgY29uc3QgYjE6IFRlbnNvcjFEID0gYTE7XG4gICAgZXhwZWN0KGIxKS50b0JlTnVsbCgpO1xuXG4gICAgY29uc3QgYTI6IFRlbnNvcjxSYW5rLlIyPiA9IG51bGw7XG4gICAgY29uc3QgYjI6IFRlbnNvcjJEID0gYTI7XG4gICAgZXhwZWN0KGIyKS50b0JlTnVsbCgpO1xuXG4gICAgY29uc3QgYTM6IFRlbnNvcjxSYW5rLlIzPiA9IG51bGw7XG4gICAgY29uc3QgYjM6IFRlbnNvcjNEID0gYTM7XG4gICAgZXhwZWN0KGIzKS50b0JlTnVsbCgpO1xuXG4gICAgY29uc3QgYTQ6IFRlbnNvcjxSYW5rLlI0PiA9IG51bGw7XG4gICAgY29uc3QgYjQ6IFRlbnNvcjREID0gYTQ7XG4gICAgZXhwZWN0KGI0KS50b0JlTnVsbCgpO1xuICB9KTtcblxuICBpdCgndGYudGVuc29yMWQoKSBmcm9tIG51bWJlcltdJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMSwgMiwgM10pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGEuZGF0YSgpLCBbMSwgMiwgM10pO1xuICB9KTtcblxuICBpdCgndGYudGVuc29yMWQoKSB0aHJvdyBlcnJvciB3aXRoIG51bGwgaW5wdXQgdmFsdWUnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLnRlbnNvcjFkKG51bGwpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKFxuICAgICAgICAgICAgJ1RoZSBpbnB1dCB0byB0aGUgdGVuc29yIGNvbnN0cnVjdG9yICcgK1xuICAgICAgICAgICAgJ211c3QgYmUgYSBub24tbnVsbCB2YWx1ZS4nKTtcbiAgfSk7XG5cbiAgaXQoJ3RmLnRlbnNvcjFkKCkgZnJvbSBzdHJpbmdbXScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWydhYScsICdiYicsICdjYyddKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnc3RyaW5nJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzNdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWydhYScsICdiYicsICdjYyddKTtcbiAgfSk7XG5cbiAgaXQoJ3RmLnRlbnNvcjFkKCkgZnJvbSBlbmNvZGVkIHN0cmluZ3MnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYnl0ZXMgPSBlbmNvZGVTdHJpbmdzKFsnYWEnLCAnYmInLCAnY2MnXSkgYXMgVGVuc29yTGlrZTFEO1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChieXRlcywgJ3N0cmluZycpO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdzdHJpbmcnKTtcbiAgICBleHBlY3QoYS5zaGFwZSkudG9FcXVhbChbM10pO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCBbJ2FhJywgJ2JiJywgJ2NjJ10pO1xuICB9KTtcblxuICBpdCgndGYudGVuc29yMWQoKSBmcm9tIGVuY29kZWQgc3RyaW5ncyB3aXRob3V0IGR0eXBlIGVycm9ycycsIGFzeW5jICgpID0+IHtcbiAgICAvLyBXZSBkbyBub3Qgd2FudCB0byBpbmZlciAnc3RyaW5nJyB3aGVuIHRoZSB1c2VyIHBhc3NlcyBVaW50OEFycmF5IGluIG9yZGVyXG4gICAgLy8gdG8gYmUgZm9yd2FyZCBjb21wYXRpYmxlIGluIHRoZSBmdXR1cmUgd2hlbiB3ZSBhZGQgdWludDggZHR5cGUuXG4gICAgY29uc3QgYnl0ZXMgPSBlbmNvZGVTdHJpbmdzKFsnYWEnLCAnYmInLCAnY2MnXSkgYXMgVGVuc29yTGlrZTFEO1xuICAgIGV4cGVjdCgoKSA9PiB0Zi50ZW5zb3IxZChieXRlcykpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndGYudGVuc29yMWQoKSBmcm9tIGVuY29kZWQgc3RyaW5ncywgc2hhcGUgbWlzbWF0Y2gnLCAoKSA9PiB7XG4gICAgY29uc3QgYnl0ZXMgPSBlbmNvZGVTdHJpbmdzKFtbJ2FhJ10sIFsnYmInXSwgWydjYyddXSkgYXMgVGVuc29yTGlrZTFEO1xuICAgIGV4cGVjdCgoKSA9PiB0Zi50ZW5zb3IxZChieXRlcykpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndGYudGVuc29yMWQoKSBmcm9tIG51bWJlcltdW10sIHNoYXBlIG1pc21hdGNoJywgKCkgPT4ge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICBleHBlY3QoKCkgPT4gdGYudGVuc29yMWQoW1sxXSwgWzJdLCBbM11dIGFzIGFueSkpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndGYudGVuc29yMWQoKSBmcm9tIHN0cmluZ1tdW10sIHNoYXBlIG1pc21hdGNoJywgKCkgPT4ge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICBleHBlY3QoKCkgPT4gdGYudGVuc29yMWQoW1snYSddLCBbJ2InXSwgWydjJ11dIGFzIGFueSkpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndGYudGVuc29yMmQoKSBmcm9tIG51bWJlcltdW10nLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKFtbMSwgMiwgM10sIFs0LCA1LCA2XV0sIFsyLCAzXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYS5kYXRhKCksIFsxLCAyLCAzLCA0LCA1LCA2XSk7XG4gIH0pO1xuXG4gIGl0KCd0Zi50ZW5zb3IyZCgpIGZyb20gc3RyaW5nW11bXScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoW1snYWEnLCAnYmInXSwgWydjYycsICdkZCddXSk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ3N0cmluZycpO1xuICAgIGV4cGVjdChhLnNoYXBlKS50b0VxdWFsKFsyLCAyXSk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgYS5kYXRhKCksIFsnYWEnLCAnYmInLCAnY2MnLCAnZGQnXSk7XG4gIH0pO1xuXG4gIGl0KCd0Zi50ZW5zb3IyZCgpIGZyb20gZW5jb2RlZCBzdHJpbmdzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGJ5dGVzID0gZW5jb2RlU3RyaW5ncyhbWydhYScsICdiYiddLCBbJ2NjJywgJ2RkJ11dKSBhcyBUZW5zb3JMaWtlMkQ7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKGJ5dGVzLCBbMiwgMl0sICdzdHJpbmcnKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnc3RyaW5nJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzIsIDJdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWydhYScsICdiYicsICdjYycsICdkZCddKTtcbiAgfSk7XG5cbiAgaXQoJ3RmLnRlbnNvcjJkKCkgZnJvbSBlbmNvZGVkIHN0cmluZ3Mgd2l0aG91dCBkdHlwZSBlcnJvcnMnLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gV2UgZG8gbm90IHdhbnQgdG8gaW5mZXIgJ3N0cmluZycgd2hlbiB0aGUgdXNlciBwYXNzZXMgVWludDhBcnJheSBpbiBvcmRlclxuICAgIC8vIHRvIGJlIGZvcndhcmQgY29tcGF0aWJsZSBpbiB0aGUgZnV0dXJlIHdoZW4gd2UgYWRkIHVpbnQ4IGR0eXBlLlxuICAgIGNvbnN0IGJ5dGVzID0gZW5jb2RlU3RyaW5ncyhbWydhYScsICdiYiddLCBbJ2NjJywgJ2RkJ11dKSBhcyBUZW5zb3JMaWtlMkQ7XG4gICAgZXhwZWN0KCgpID0+IHRmLnRlbnNvcjJkKGJ5dGVzKSkudG9UaHJvd0Vycm9yKCk7XG4gIH0pO1xuXG4gIGl0KCd0Zi50ZW5zb3IyZCgpIGZyb20gZW5jb2RlZCBzdHJpbmdzLCBzaGFwZSBtaXNtYXRjaCcsICgpID0+IHtcbiAgICBjb25zdCBieXRlcyA9IGVuY29kZVN0cmluZ3MoW1snYWEnLCAnYmInXSwgWydjYycsICdkZCddXSkgYXMgVGVuc29yTGlrZTJEO1xuICAgIGV4cGVjdCgoKSA9PiB0Zi50ZW5zb3IyZChieXRlcywgWzMsIDJdLCAnc3RyaW5nJykpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndGYudGVuc29yMmQoKSByZXF1aXJlcyBzaGFwZSB0byBiZSBvZiBsZW5ndGggMicsICgpID0+IHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgY29uc3Qgc2hhcGU6IGFueSA9IFs0XTtcbiAgICBleHBlY3QoKCkgPT4gdGYudGVuc29yMmQoWzEsIDIsIDMsIDRdLCBzaGFwZSkpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndGYudGVuc29yMmQoKSBmcm9tIG51bWJlcltdW10sIGJ1dCBzaGFwZSBkb2VzIG5vdCBtYXRjaCcsICgpID0+IHtcbiAgICAvLyBBY3R1YWwgc2hhcGUgaXMgWzIsIDNdLlxuICAgIGV4cGVjdCgoKSA9PiB0Zi50ZW5zb3IyZChbWzEsIDIsIDNdLCBbNCwgNSwgNl1dLCBbMywgMl0pKS50b1Rocm93RXJyb3IoKTtcbiAgfSk7XG5cbiAgaXQoJ3RmLnRlbnNvcjJkKCkgZnJvbSBzdHJpbmdbXVtdLCBidXQgc2hhcGUgZG9lcyBub3QgbWF0Y2gnLCAoKSA9PiB7XG4gICAgLy8gQWN0dWFsIHNoYXBlIGlzIFsyLCAzXS5cbiAgICBjb25zdCB2YWxzID0gW1snYScsICdiJywgJ2MnXSwgWydkJywgJ2UnLCAnZiddXTtcbiAgICBleHBlY3QoKCkgPT4gdGYudGVuc29yMmQodmFscywgWzMsIDJdKSkudG9UaHJvd0Vycm9yKCk7XG4gIH0pO1xuXG4gIGl0KCd0Zi50ZW5zb3IyZCgpIGZyb20gbnVtYmVyW10sIGJ1dCBubyBzaGFwZSB0aHJvd3MgZXJyb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLnRlbnNvcjJkKFsxLCAyLCAzLCA0XSkpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndGYudGVuc29yMmQoKSBmcm9tIHN0cmluZ1tdLCBidXQgbm8gc2hhcGUgdGhyb3dzIGVycm9yJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB0Zi50ZW5zb3IyZChbJ2EnLCAnYicsICdjJywgJ2QnXSkpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndGYudGVuc29yMmQoKSB0aHJvdyBlcnJvciB3aXRoIG51bGwgaW5wdXQgdmFsdWUnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLnRlbnNvcjJkKG51bGwpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKFxuICAgICAgICAgICAgJ1RoZSBpbnB1dCB0byB0aGUgdGVuc29yIGNvbnN0cnVjdG9yICcgK1xuICAgICAgICAgICAgJ211c3QgYmUgYSBub24tbnVsbCB2YWx1ZS4nKTtcbiAgfSk7XG5cbiAgaXQoJ3RlbnNvcjNkKCkgZnJvbSBudW1iZXJbXVtdW10nLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjNkKFtbWzFdLCBbMl0sIFszXV0sIFtbNF0sIFs1XSwgWzZdXV0sIFsyLCAzLCAxXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYS5kYXRhKCksIFsxLCAyLCAzLCA0LCA1LCA2XSk7XG4gIH0pO1xuXG4gIGl0KCd0ZW5zb3IzZCgpIGZyb20gc3RyaW5nW11bXVtdJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHZhbHMgPSBbW1snYSddLCBbJ2InXSwgWydjJ11dLCBbWydkJ10sIFsnZSddLCBbJ2YnXV1dO1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IzZCh2YWxzLCBbMiwgMywgMV0pO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdzdHJpbmcnKTtcbiAgICBleHBlY3QoYS5zaGFwZSkudG9FcXVhbChbMiwgMywgMV0pO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCBbJ2EnLCAnYicsICdjJywgJ2QnLCAnZScsICdmJ10pO1xuICB9KTtcblxuICBpdCgndGYudGVuc29yM2QoKSBmcm9tIGVuY29kZWQgc3RyaW5ncycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBieXRlcyA9IGVuY29kZVN0cmluZ3MoW1tbJ2EnXSwgWydiJ10sIFsnYyddXSwgW1snZCddLCBbJ2UnXSwgWydmJ11dXSk7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjNkKGJ5dGVzIGFzIFRlbnNvckxpa2UzRCwgWzIsIDMsIDFdLCAnc3RyaW5nJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ3N0cmluZycpO1xuICAgIGV4cGVjdChhLnNoYXBlKS50b0VxdWFsKFsyLCAzLCAxXSk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgYS5kYXRhKCksIFsnYScsICdiJywgJ2MnLCAnZCcsICdlJywgJ2YnXSk7XG4gIH0pO1xuXG4gIGl0KCd0Zi50ZW5zb3IzZCgpIGZyb20gZW5jb2RlZCBzdHJpbmdzIHdpdGhvdXQgZHR5cGUgZXJyb3JzJywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIFdlIGRvIG5vdCB3YW50IHRvIGluZmVyICdzdHJpbmcnIHdoZW4gdGhlIHVzZXIgcGFzc2VzIFVpbnQ4QXJyYXkgaW4gb3JkZXJcbiAgICAvLyB0byBiZSBmb3J3YXJkIGNvbXBhdGlibGUgaW4gdGhlIGZ1dHVyZSB3aGVuIHdlIGFkZCB1aW50OCBkdHlwZS5cbiAgICBjb25zdCBieXRlcyA9IGVuY29kZVN0cmluZ3MoW1tbJ2EnXSwgWydiJ10sIFsnYyddXSwgW1snZCddLCBbJ2UnXSwgWydmJ11dXSk7XG4gICAgZXhwZWN0KCgpID0+IHRmLnRlbnNvcjNkKGJ5dGVzIGFzIFRlbnNvckxpa2UzRCkpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndGYudGVuc29yM2QoKSBmcm9tIGVuY29kZWQgc3RyaW5ncywgc2hhcGUgbWlzbWF0Y2gnLCAoKSA9PiB7XG4gICAgY29uc3QgYnl0ZXMgPSBlbmNvZGVTdHJpbmdzKFtbWydhJ10sIFsnYiddLCBbJ2MnXV0sIFtbJ2QnXSwgWydlJ10sIFsnZiddXV0pO1xuICAgIC8vIEFjdHVhbCBzaGFwZSBpcyBbMiwgMywgMV0uXG4gICAgZXhwZWN0KCgpID0+IHRmLnRlbnNvcjNkKGJ5dGVzIGFzIFRlbnNvckxpa2UzRCwgWzMsIDIsIDFdLCAnc3RyaW5nJykpXG4gICAgICAgIC50b1Rocm93RXJyb3IoKTtcbiAgfSk7XG5cbiAgaXQoJ3RlbnNvcjNkKCkgZnJvbSBudW1iZXJbXVtdW10sIGJ1dCBzaGFwZSBkb2VzIG5vdCBtYXRjaCcsICgpID0+IHtcbiAgICBjb25zdCB2YWx1ZXMgPSBbW1sxXSwgWzJdLCBbM11dLCBbWzRdLCBbNV0sIFs2XV1dO1xuICAgIC8vIEFjdHVhbCBzaGFwZSBpcyBbMiwgMywgMV0uXG4gICAgZXhwZWN0KCgpID0+IHRmLnRlbnNvcjNkKHZhbHVlcywgWzMsIDIsIDFdKSkudG9UaHJvd0Vycm9yKCk7XG4gIH0pO1xuXG4gIGl0KCd0Zi50ZW5zb3IzZCgpIGZyb20gbnVtYmVyW10sIGJ1dCBubyBzaGFwZSB0aHJvd3MgZXJyb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLnRlbnNvcjNkKFsxLCAyLCAzLCA0XSkpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndGYudGVuc29yM2QoKSByZXF1aXJlcyBzaGFwZSB0byBiZSBvZiBsZW5ndGggMycsICgpID0+IHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgY29uc3Qgc2hhcGU6IGFueSA9IFs0LCAxXTtcbiAgICBleHBlY3QoKCkgPT4gdGYudGVuc29yM2QoWzEsIDIsIDMsIDRdLCBzaGFwZSkpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndGYudGVuc29yM2QoKSB0aHJvdyBlcnJvciB3aXRoIG51bGwgaW5wdXQgdmFsdWUnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLnRlbnNvcjNkKG51bGwpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKFxuICAgICAgICAgICAgJ1RoZSBpbnB1dCB0byB0aGUgdGVuc29yIGNvbnN0cnVjdG9yICcgK1xuICAgICAgICAgICAgJ211c3QgYmUgYSBub24tbnVsbCB2YWx1ZS4nKTtcbiAgfSk7XG5cbiAgaXQoJ3RlbnNvcjRkKCkgZnJvbSBudW1iZXJbXVtdW11bXScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yNGQoW1tbWzFdXSwgW1syXV1dLCBbW1s0XV0sIFtbNV1dXV0sIFsyLCAyLCAxLCAxXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYS5kYXRhKCksIFsxLCAyLCA0LCA1XSk7XG4gIH0pO1xuXG4gIGl0KCd0ZW5zb3I0ZCgpIGZyb20gc3RyaW5nW11bXVtdW10nLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdmFscyA9IFtbW1snYSddXSwgW1snYiddXV0sIFtbWydjJ11dLCBbWydkJ11dXV07XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjRkKHZhbHMsIFsyLCAyLCAxLCAxXSk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ3N0cmluZycpO1xuICAgIGV4cGVjdChhLnNoYXBlKS50b0VxdWFsKFsyLCAyLCAxLCAxXSk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgYS5kYXRhKCksIFsnYScsICdiJywgJ2MnLCAnZCddKTtcbiAgfSk7XG5cbiAgaXQoJ3RmLnRlbnNvcjRkKCkgZnJvbSBlbmNvZGVkIHN0cmluZ3MnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYnl0ZXMgPSBlbmNvZGVTdHJpbmdzKFtbW1snYSddXSwgW1snYiddXV0sIFtbWydjJ11dLCBbWydkJ11dXV0pO1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3I0ZChieXRlcyBhcyBUZW5zb3JMaWtlNEQsIFsyLCAyLCAxLCAxXSwgJ3N0cmluZycpO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdzdHJpbmcnKTtcbiAgICBleHBlY3QoYS5zaGFwZSkudG9FcXVhbChbMiwgMiwgMSwgMV0pO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCBbJ2EnLCAnYicsICdjJywgJ2QnXSk7XG4gIH0pO1xuXG4gIGl0KCd0Zi50ZW5zb3I0ZCgpIGZyb20gZW5jb2RlZCBzdHJpbmdzIHdpdGhvdXQgZHR5cGUgZXJyb3JzJywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIFdlIGRvIG5vdCB3YW50IHRvIGluZmVyICdzdHJpbmcnIHdoZW4gdGhlIHVzZXIgcGFzc2VzIFVpbnQ4QXJyYXkgaW4gb3JkZXJcbiAgICAvLyB0byBiZSBmb3J3YXJkIGNvbXBhdGlibGUgaW4gdGhlIGZ1dHVyZSB3aGVuIHdlIGFkZCB1aW50OCBkdHlwZS5cbiAgICBjb25zdCBieXRlcyA9IGVuY29kZVN0cmluZ3MoW1tbWydhJ11dLCBbWydiJ11dXSwgW1tbJ2MnXV0sIFtbJ2QnXV1dXSk7XG4gICAgZXhwZWN0KCgpID0+IHRmLnRlbnNvcjRkKGJ5dGVzIGFzIFRlbnNvckxpa2U0RCkpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndGYudGVuc29yNGQoKSBmcm9tIGVuY29kZWQgc3RyaW5ncywgc2hhcGUgbWlzbWF0Y2gnLCAoKSA9PiB7XG4gICAgY29uc3QgYnl0ZXMgPSBlbmNvZGVTdHJpbmdzKFtbW1snYSddXSwgW1snYiddXV0sIFtbWydjJ11dLCBbWydkJ11dXV0pO1xuICAgIC8vIEFjdHVhbCBzaGFwZSBpcyBbMiwgMiwgMS4gMV0uXG4gICAgZXhwZWN0KCgpID0+IHRmLnRlbnNvcjRkKGJ5dGVzIGFzIFRlbnNvckxpa2U0RCwgWzIsIDEsIDIsIDFdLCAnc3RyaW5nJykpXG4gICAgICAgIC50b1Rocm93RXJyb3IoKTtcbiAgfSk7XG5cbiAgaXQoJ3RlbnNvcjRkKCkgZnJvbSBzdHJpbmdbXVtdW11bXSBpbmZlciBzaGFwZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB2YWxzID0gW1tbWydhJ11dLCBbWydiJ11dXSwgW1tbJ2MnXV0sIFtbJ2QnXV1dXTtcbiAgICBjb25zdCBhID0gdGYudGVuc29yNGQodmFscyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ3N0cmluZycpO1xuICAgIGV4cGVjdChhLnNoYXBlKS50b0VxdWFsKFsyLCAyLCAxLCAxXSk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgYS5kYXRhKCksIFsnYScsICdiJywgJ2MnLCAnZCddKTtcbiAgfSk7XG5cbiAgaXQoJ3RlbnNvcjRkKCkgZnJvbSBudW1iZXJbXVtdW11bXSwgYnV0IHNoYXBlIGRvZXMgbm90IG1hdGNoJywgKCkgPT4ge1xuICAgIGNvbnN0IGYgPSAoKSA9PiB7XG4gICAgICAvLyBBY3R1YWwgc2hhcGUgaXMgWzIsIDIsIDEsIDFdLlxuICAgICAgdGYudGVuc29yNGQoW1tbWzFdXSwgW1syXV1dLCBbW1s0XV0sIFtbNV1dXV0sIFsyLCAxLCAyLCAxXSk7XG4gICAgfTtcbiAgICBleHBlY3QoZikudG9UaHJvd0Vycm9yKCk7XG4gIH0pO1xuXG4gIGl0KCd0Zi50ZW5zb3I0ZCgpIGZyb20gbnVtYmVyW10sIGJ1dCBubyBzaGFwZSB0aHJvd3MgZXJyb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLnRlbnNvcjRkKFsxLCAyLCAzLCA0XSkpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndGYudGVuc29yNGQoKSByZXF1aXJlcyBzaGFwZSB0byBiZSBvZiBsZW5ndGggNCcsICgpID0+IHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgY29uc3Qgc2hhcGU6IGFueSA9IFs0LCAxXTtcbiAgICBleHBlY3QoKCkgPT4gdGYudGVuc29yNGQoWzEsIDIsIDMsIDRdLCBzaGFwZSkpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndGYudGVuc29yNGQoKSB0aHJvdyBlcnJvciB3aXRoIG51bGwgaW5wdXQgdmFsdWUnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLnRlbnNvcjRkKG51bGwpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKFxuICAgICAgICAgICAgJ1RoZSBpbnB1dCB0byB0aGUgdGVuc29yIGNvbnN0cnVjdG9yICcgK1xuICAgICAgICAgICAgJ211c3QgYmUgYSBub24tbnVsbCB2YWx1ZS4nKTtcbiAgfSk7XG5cbiAgaXQoJ3RmLnRlbnNvcjVkKCkgdGhyb3cgZXJyb3Igd2l0aCBudWxsIGlucHV0IHZhbHVlJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB0Zi50ZW5zb3I1ZChudWxsKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcihcbiAgICAgICAgICAgICdUaGUgaW5wdXQgdG8gdGhlIHRlbnNvciBjb25zdHJ1Y3RvciAnICtcbiAgICAgICAgICAgICdtdXN0IGJlIGEgbm9uLW51bGwgdmFsdWUuJyk7XG4gIH0pO1xuXG4gIGl0KCd0Zi50ZW5zb3I2ZCgpIHRocm93IGVycm9yIHdpdGggbnVsbCBpbnB1dCB2YWx1ZScsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gdGYudGVuc29yNmQobnVsbCkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoXG4gICAgICAgICAgICAnVGhlIGlucHV0IHRvIHRoZSB0ZW5zb3IgY29uc3RydWN0b3IgJyArXG4gICAgICAgICAgICAnbXVzdCBiZSBhIG5vbi1udWxsIHZhbHVlLicpO1xuICB9KTtcblxuICBpdCgnZGVmYXVsdCBkdHlwZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYuc2NhbGFyKDMpO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYS5kYXRhKCksIDMpO1xuICB9KTtcblxuICBpdCgnZmxvYXQzMiBkdHlwZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYuc2NhbGFyKDMsICdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgMyk7XG4gIH0pO1xuXG4gIGl0KCdpbnQzMiBkdHlwZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYuc2NhbGFyKDMsICdpbnQzMicpO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdpbnQzMicpO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCAzKTtcbiAgfSk7XG5cbiAgaXQoJ2ludDMyIGR0eXBlLCAzLjkgPT4gMywgbGlrZSBudW1weScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYuc2NhbGFyKDMuOSwgJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgYS5kYXRhKCksIDMpO1xuICB9KTtcblxuICBpdCgnaW50MzIgZHR5cGUsIC0zLjkgPT4gLTMsIGxpa2UgbnVtcHknLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnNjYWxhcigtMy45LCAnaW50MzInKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnaW50MzInKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgLTMpO1xuICB9KTtcblxuICBpdCgnYm9vbCBkdHlwZSwgMyA9PiB0cnVlLCBsaWtlIG51bXB5JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi5zY2FsYXIoMywgJ2Jvb2wnKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnYm9vbCcpO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCAxKTtcbiAgfSk7XG5cbiAgaXQoJ2Jvb2wgZHR5cGUsIC0yID0+IHRydWUsIGxpa2UgbnVtcHknLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnNjYWxhcigtMiwgJ2Jvb2wnKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnYm9vbCcpO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCAxKTtcbiAgfSk7XG5cbiAgaXQoJ2Jvb2wgZHR5cGUsIDAgPT4gZmFsc2UsIGxpa2UgbnVtcHknLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnNjYWxhcigwLCAnYm9vbCcpO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdib29sJyk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgYS5kYXRhKCksIDApO1xuICB9KTtcblxuICBpdCgnYm9vbCBkdHlwZSBmcm9tIGJvb2xlYW4nLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnNjYWxhcihmYWxzZSwgJ2Jvb2wnKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgMCk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2Jvb2wnKTtcblxuICAgIGNvbnN0IGIgPSB0Zi5zY2FsYXIodHJ1ZSwgJ2Jvb2wnKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgMCk7XG4gICAgZXhwZWN0KGIuZHR5cGUpLnRvQmUoJ2Jvb2wnKTtcbiAgfSk7XG5cbiAgaXQoJ2ludDMyIGR0eXBlIGZyb20gYm9vbGVhbicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYuc2NhbGFyKHRydWUsICdpbnQzMicpO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCAxKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnaW50MzInKTtcbiAgfSk7XG5cbiAgaXQoJ2RlZmF1bHQgZHR5cGUgZnJvbSBib29sZWFuJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi5zY2FsYXIoZmFsc2UpO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCAwKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnYm9vbCcpO1xuICB9KTtcblxuICBpdCgnZGVmYXVsdCBkdHlwZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzEsIDIsIDNdKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnZmxvYXQzMicpO1xuICAgIGV4cGVjdChhLnNoYXBlKS50b0VxdWFsKFszXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYS5kYXRhKCksIFsxLCAyLCAzXSk7XG4gIH0pO1xuXG4gIGl0KCdmbG9hdDMyIGR0eXBlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMSwgMiwgM10sICdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3QoYS5zaGFwZSkudG9FcXVhbChbM10pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGEuZGF0YSgpLCBbMSwgMiwgM10pO1xuICB9KTtcblxuICBpdCgnaW50MzIgZHR5cGUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzXSwgJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzNdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWzEsIDIsIDNdKTtcbiAgfSk7XG5cbiAgaXQoJ2ludDMyIGR0eXBlLCBub24taW50cyBnZXQgZmxvb3JlZCwgbGlrZSBudW1weScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzEuMSwgMi41LCAzLjldLCAnaW50MzInKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnaW50MzInKTtcbiAgICBleHBlY3QoYS5zaGFwZSkudG9FcXVhbChbM10pO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCBbMSwgMiwgM10pO1xuICB9KTtcblxuICBpdCgnaW50MzIgZHR5cGUsIG5lZ2F0aXZlIG5vbi1pbnRzIGdldCBjZWlsZWQsIGxpa2UgbnVtcHknLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFstMS4xLCAtMi41LCAtMy45XSwgJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzNdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWy0xLCAtMiwgLTNdKTtcbiAgfSk7XG5cbiAgaXQoJ2Jvb2wgZHR5cGUsICE9MCBpcyB0cnV0aHksIDAgaXMgZmFsc3ksIGxpa2UgbnVtcHknLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLCAtMiwgMCwgM10sICdib29sJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2Jvb2wnKTtcbiAgICBleHBlY3QoYS5zaGFwZSkudG9FcXVhbChbNF0pO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCBbMSwgMSwgMCwgMV0pO1xuICB9KTtcblxuICBpdCgnZGVmYXVsdCBkdHlwZSBmcm9tIGJvb2xlYW5bXScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoW2ZhbHNlLCBmYWxzZSwgdHJ1ZV0pO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdib29sJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYS5kYXRhKCksIFswLCAwLCAxXSk7XG4gIH0pO1xuXG4gIGl0KCdkZWZhdWx0IGR0eXBlIGZyb20gVUludDhBcnJheScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQobmV3IFVpbnQ4QXJyYXkoWzEsIDUsIDJdKSk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzNdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgWzEsIDUsIDJdKTtcbiAgfSk7XG5cbiAgaXQoJ2RlZmF1bHQgZHR5cGUgZnJvbSBJbnQzMkFycmF5JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChuZXcgSW50MzJBcnJheShbMSwgNSwgMl0pKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnaW50MzInKTtcbiAgICBleHBlY3QoYS5zaGFwZSkudG9FcXVhbChbM10pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGEuZGF0YSgpLCBbMSwgNSwgMl0pO1xuICB9KTtcblxuICBpdCgndGYudGVuc29yKCkgZnJvbSBGbG9hdDMyQXJyYXkgYW5kIG51bWJlcltdJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IoW1xuICAgICAgbmV3IEZsb2F0MzJBcnJheShbMSwgMl0pLCBuZXcgRmxvYXQzMkFycmF5KFszLCA0XSksXG4gICAgICBuZXcgRmxvYXQzMkFycmF5KFs1LCA2XSksIFs3LCA4XVxuICAgIF0pO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzQsIDJdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDhdKTtcbiAgfSk7XG5cbiAgaXQoJ3RmLnRlbnNvcigpIGZyb20gSW50MzJBcnJheSBhbmQgbnVtYmVyW10nLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcihbXG4gICAgICBuZXcgSW50MzJBcnJheShbMSwgMl0pLCBuZXcgSW50MzJBcnJheShbMywgNF0pLCBuZXcgSW50MzJBcnJheShbNSwgNl0pLFxuICAgICAgWzcsIDhdXG4gICAgXSk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzQsIDJdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDhdKTtcbiAgfSk7XG5cbiAgaXQoJ3RmLnRlbnNvcigpIGZyb20gbWl4ZWQgVHlwZWRBcnJheScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yKFtcbiAgICAgIG5ldyBGbG9hdDMyQXJyYXkoWzEsIDJdKSwgbmV3IEludDMyQXJyYXkoWzMsIDRdKSwgbmV3IFVpbnQ4QXJyYXkoWzUsIDZdKSxcbiAgICAgIFs3LCA4XVxuICAgIF0pO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzQsIDJdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDhdKTtcbiAgfSk7XG5cbiAgaXQoJ3RmLnRlbnNvcigpIGZyb20gVHlwZWRBcnJheXMgd2hpY2ggYXJlIHRoZW1zZWx2ZXMgM0QnLCAoKSA9PiB7XG4gICAgLy8gMiB0ZW5zb3JzLCBlYWNoIHdpdGggc2hhcGUgMjB4MjB4MywgYXMgZmxhdCBGbG9hdDMyQXJyYXlzLlxuICAgIGNvbnN0IGltZzEgPSBuZXcgRmxvYXQzMkFycmF5KDIwICogMjAgKiAzKTtcbiAgICBjb25zdCBpbWcyID0gbmV3IEZsb2F0MzJBcnJheSgyMCAqIDIwICogMyk7XG4gICAgY29uc3QgdCA9IHRmLnRlbnNvcihbaW1nMSwgaW1nMl0sIFsyLCAyMCwgMjAsIDNdKTtcbiAgICBleHBlY3QodC5kdHlwZSkudG9CZSgnZmxvYXQzMicpO1xuICAgIGV4cGVjdCh0LnNoYXBlKS50b0VxdWFsKFsyLCAyMCwgMjAsIDNdKTtcbiAgfSk7XG5cbiAgaXQoJ3RmLnRlbnNvcigpIGZyb20gVHlwZWRBcnJheXMgd2hpY2ggYXJlIHRoZW1zZWx2ZXMgM0QsIHdyb25nIHNoYXBlJyxcbiAgICAgKCkgPT4ge1xuICAgICAgIGNvbnN0IGltZzEgPSBuZXcgRmxvYXQzMkFycmF5KDIwICogMjAgKiAzKTtcbiAgICAgICBjb25zdCBpbWcyID0gbmV3IEZsb2F0MzJBcnJheSgyMCAqIDIwICogMyk7XG4gICAgICAgZXhwZWN0KCgpID0+IHRmLnRlbnNvcihbaW1nMSwgaW1nMl0sIFszLCAyMCwgMjAsIDNdKSkudG9UaHJvd0Vycm9yKCk7XG4gICAgIH0pO1xuXG4gIGl0KCdkZWZhdWx0IGR0eXBlIGZyb20gYXNjaWkgc3RyaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IoJ2hlbGxvJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ3N0cmluZycpO1xuICAgIGV4cGVjdChhLnNoYXBlKS50b0VxdWFsKFtdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWydoZWxsbyddKTtcbiAgfSk7XG5cbiAgaXQoJ2RlZmF1bHQgZHR5cGUgZnJvbSB1dGYtOCBzdHJpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcign0LTQsNC90LjQtdC7Jyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ3N0cmluZycpO1xuICAgIGV4cGVjdChhLnNoYXBlKS50b0VxdWFsKFtdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWyfQtNCw0L3QuNC10LsnXSk7XG4gIH0pO1xuXG4gIGl0KCdkZWZhdWx0IGR0eXBlIGZyb20gZW1wdHkgc3RyaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IoJycpO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdzdHJpbmcnKTtcbiAgICBleHBlY3QoYS5zaGFwZSkudG9FcXVhbChbXSk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgYS5kYXRhKCksIFsnJ10pO1xuICB9KTtcblxuICBpdCgnZGVmYXVsdCBkdHlwZSBmcm9tIHVuaWNvZGUgZXNjYXBlZCBzdHJpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcignXFx1MDQzNFxcdTA0MzBcXHUwNDNkXFx1MDQzOFxcdTA0MzVcXHUwNDNiJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ3N0cmluZycpO1xuICAgIGV4cGVjdChhLnNoYXBlKS50b0VxdWFsKFtdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWyfQtNCw0L3QuNC10LsnXSk7XG4gIH0pO1xuXG4gIGl0KCdkZWZhdWx0IGR0eXBlIGZyb20gc3RyaW5nW10nLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcihbJ2EnLCAnYiddKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnc3RyaW5nJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzJdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWydhJywgJ2InXSk7XG4gIH0pO1xuXG4gIGl0KCdmbG9hdDMyIGR0eXBlIGZyb20gYm9vbGVhbltdJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbZmFsc2UsIGZhbHNlLCB0cnVlXSwgJ2Zsb2F0MzInKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnZmxvYXQzMicpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGEuZGF0YSgpLCBbMCwgMCwgMV0pO1xuICB9KTtcblxuICBpdCgnaW50MzIgZHR5cGUgZnJvbSBib29sZWFuW10nLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFtmYWxzZSwgZmFsc2UsIHRydWVdLCAnaW50MzInKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnaW50MzInKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWzAsIDAsIDFdKTtcbiAgfSk7XG5cbiAgaXQoJ2Jvb2wgZHR5cGUgZnJvbSBib29sZWFuW10nLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFtmYWxzZSwgZmFsc2UsIHRydWVdLCAnYm9vbCcpO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdib29sJyk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgYS5kYXRhKCksIFswLCAwLCAxXSk7XG4gIH0pO1xuXG4gIGl0KCdkZWZhdWx0IGR0eXBlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChbMSwgMiwgMywgNF0sIFsyLCAyXSk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3QoYS5zaGFwZSkudG9FcXVhbChbMiwgMl0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGEuZGF0YSgpLCBbMSwgMiwgMywgNF0pO1xuICB9KTtcblxuICBpdCgnZmxvYXQzMiBkdHlwZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoWzEsIDIsIDMsIDRdLCBbMiwgMl0sICdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3QoYS5zaGFwZSkudG9FcXVhbChbMiwgMl0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGEuZGF0YSgpLCBbMSwgMiwgMywgNF0pO1xuICB9KTtcblxuICBpdCgnaW50MzIgZHR5cGUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKFtbMSwgMl0sIFszLCA0XV0sIFsyLCAyXSwgJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzIsIDJdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWzEsIDIsIDMsIDRdKTtcbiAgfSk7XG5cbiAgaXQoJ2ludDMyIGR0eXBlLCBub24taW50cyBnZXQgZmxvb3JlZCwgbGlrZSBudW1weScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoWzEuMSwgMi41LCAzLjksIDQuMF0sIFsyLCAyXSwgJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzIsIDJdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWzEsIDIsIDMsIDRdKTtcbiAgfSk7XG5cbiAgaXQoJ2ludDMyIGR0eXBlLCBuZWdhdGl2ZSBub24taW50cyBnZXQgY2VpbGVkLCBsaWtlIG51bXB5JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChbLTEuMSwgLTIuNSwgLTMuOSwgLTQuMF0sIFsyLCAyXSwgJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzIsIDJdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWy0xLCAtMiwgLTMsIC00XSk7XG4gIH0pO1xuXG4gIGl0KCdib29sIGR0eXBlLCAhPTAgaXMgdHJ1dGh5LCAwIGlzIGZhbHN5LCBsaWtlIG51bXB5JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChbMSwgLTIsIDAsIDNdLCBbMiwgMl0sICdib29sJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2Jvb2wnKTtcbiAgICBleHBlY3QoYS5zaGFwZSkudG9FcXVhbChbMiwgMl0pO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCBbMSwgMSwgMCwgMV0pO1xuICB9KTtcblxuICBpdCgnZGVmYXVsdCBkdHlwZSBmcm9tIGJvb2xlYW5bXScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoW1tmYWxzZSwgZmFsc2VdLCBbdHJ1ZSwgZmFsc2VdXSwgWzIsIDJdKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnYm9vbCcpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGEuZGF0YSgpLCBbMCwgMCwgMSwgMF0pO1xuICB9KTtcblxuICBpdCgnZmxvYXQzMiBkdHlwZSBmcm9tIGJvb2xlYW5bXScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoW1tmYWxzZSwgZmFsc2VdLCBbdHJ1ZSwgZmFsc2VdXSwgWzIsIDJdLCAnZmxvYXQzMicpO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgYS5kYXRhKCksIFswLCAwLCAxLCAwXSk7XG4gIH0pO1xuXG4gIGl0KCdpbnQzMiBkdHlwZSBmcm9tIGJvb2xlYW5bXScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoW1tmYWxzZSwgZmFsc2VdLCBbdHJ1ZSwgZmFsc2VdXSwgWzIsIDJdLCAnaW50MzInKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnaW50MzInKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWzAsIDAsIDEsIDBdKTtcbiAgfSk7XG5cbiAgaXQoJ2Jvb2wgZHR5cGUgZnJvbSBib29sZWFuW10nLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKFtbZmFsc2UsIGZhbHNlXSwgW3RydWUsIGZhbHNlXV0sIFsyLCAyXSwgJ2Jvb2wnKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnYm9vbCcpO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCBbMCwgMCwgMSwgMF0pO1xuICB9KTtcblxuICBpdCgnZGVmYXVsdCBkdHlwZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yM2QoWzEsIDIsIDMsIDRdLCBbMiwgMiwgMV0pO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzIsIDIsIDFdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgWzEsIDIsIDMsIDRdKTtcbiAgfSk7XG5cbiAgaXQoJ2Zsb2F0MzIgZHR5cGUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjNkKFsxLCAyLCAzLCA0XSwgWzIsIDIsIDFdLCAnZmxvYXQzMicpO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzIsIDIsIDFdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgWzEsIDIsIDMsIDRdKTtcbiAgfSk7XG5cbiAgaXQoJ2ludDMyIGR0eXBlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IzZChbW1sxXSwgWzJdXSwgW1szXSwgWzRdXV0sIFsyLCAyLCAxXSwgJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzIsIDIsIDFdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWzEsIDIsIDMsIDRdKTtcbiAgfSk7XG5cbiAgaXQoJ2ludDMyIGR0eXBlLCBub24taW50cyBnZXQgZmxvb3JlZCwgbGlrZSBudW1weScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yM2QoWzEuMSwgMi41LCAzLjksIDQuMF0sIFsyLCAyLCAxXSwgJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzIsIDIsIDFdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWzEsIDIsIDMsIDRdKTtcbiAgfSk7XG5cbiAgaXQoJ2ludDMyIGR0eXBlLCBuZWdhdGl2ZSBub24taW50cyBnZXQgY2VpbGVkLCBsaWtlIG51bXB5JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IzZChbLTEuMSwgLTIuNSwgLTMuOSwgLTQuMF0sIFsyLCAyLCAxXSwgJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzIsIDIsIDFdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWy0xLCAtMiwgLTMsIC00XSk7XG4gIH0pO1xuXG4gIGl0KCdib29sIGR0eXBlLCAhPTAgaXMgdHJ1dGh5LCAwIGlzIGZhbHN5LCBsaWtlIG51bXB5JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IzZChbMSwgLTIsIDAsIDNdLCBbMiwgMiwgMV0sICdib29sJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2Jvb2wnKTtcbiAgICBleHBlY3QoYS5zaGFwZSkudG9FcXVhbChbMiwgMiwgMV0pO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCBbMSwgMSwgMCwgMV0pO1xuICB9KTtcblxuICBpdCgnZGVmYXVsdCBkdHlwZSBmcm9tIGJvb2xlYW5bXScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yM2QoW1tbZmFsc2VdLCBbZmFsc2VdXSwgW1t0cnVlXSwgW2ZhbHNlXV1dLCBbMiwgMiwgMV0pO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdib29sJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYS5kYXRhKCksIFswLCAwLCAxLCAwXSk7XG4gIH0pO1xuXG4gIGl0KCdmbG9hdDMyIGR0eXBlIGZyb20gYm9vbGVhbltdJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IzZChcbiAgICAgICAgW1tbZmFsc2VdLCBbZmFsc2VdXSwgW1t0cnVlXSwgW2ZhbHNlXV1dLCBbMiwgMiwgMV0sICdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgWzAsIDAsIDEsIDBdKTtcbiAgfSk7XG5cbiAgaXQoJ2ludDMyIGR0eXBlIGZyb20gYm9vbGVhbltdJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IzZChcbiAgICAgICAgW1tbZmFsc2VdLCBbZmFsc2VdXSwgW1t0cnVlXSwgW2ZhbHNlXV1dLCBbMiwgMiwgMV0sICdpbnQzMicpO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdpbnQzMicpO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCBbMCwgMCwgMSwgMF0pO1xuICB9KTtcblxuICBpdCgnYm9vbCBkdHlwZSBmcm9tIGJvb2xlYW5bXScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID1cbiAgICAgICAgdGYudGVuc29yM2QoW1tbZmFsc2VdLCBbZmFsc2VdXSwgW1t0cnVlXSwgW2ZhbHNlXV1dLCBbMiwgMiwgMV0sICdib29sJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2Jvb2wnKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWzAsIDAsIDEsIDBdKTtcbiAgfSk7XG5cbiAgaXQoJ2RlZmF1bHQgZHR5cGUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjRkKFsxLCAyLCAzLCA0XSwgWzIsIDIsIDEsIDFdKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnZmxvYXQzMicpO1xuICAgIGV4cGVjdChhLnNoYXBlKS50b0VxdWFsKFsyLCAyLCAxLCAxXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYS5kYXRhKCksIFsxLCAyLCAzLCA0XSk7XG4gIH0pO1xuXG4gIGl0KCdmbG9hdDMyIGR0eXBlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3I0ZChbMSwgMiwgMywgNF0sIFsyLCAyLCAxLCAxXSwgJ2Zsb2F0MzInKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnZmxvYXQzMicpO1xuICAgIGV4cGVjdChhLnNoYXBlKS50b0VxdWFsKFsyLCAyLCAxLCAxXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYS5kYXRhKCksIFsxLCAyLCAzLCA0XSk7XG4gIH0pO1xuXG4gIGl0KCdpbnQzMiBkdHlwZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID1cbiAgICAgICAgdGYudGVuc29yNGQoW1tbWzFdXSwgW1syXV1dLCBbW1szXV0sIFtbNF1dXV0sIFsyLCAyLCAxLCAxXSwgJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzIsIDIsIDEsIDFdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWzEsIDIsIDMsIDRdKTtcbiAgfSk7XG5cbiAgaXQoJ2ludDMyIGR0eXBlLCBub24taW50cyBnZXQgZmxvb3JlZCwgbGlrZSBudW1weScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yNGQoWzEuMSwgMi41LCAzLjksIDQuMF0sIFsyLCAyLCAxLCAxXSwgJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzIsIDIsIDEsIDFdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWzEsIDIsIDMsIDRdKTtcbiAgfSk7XG5cbiAgaXQoJ2ludDMyIGR0eXBlLCBuZWdhdGl2ZSBub24taW50cyBnZXQgY2VpbGVkLCBsaWtlIG51bXB5JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3I0ZChbLTEuMSwgLTIuNSwgLTMuOSwgLTQuMF0sIFsyLCAyLCAxLCAxXSwgJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzIsIDIsIDEsIDFdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWy0xLCAtMiwgLTMsIC00XSk7XG4gIH0pO1xuXG4gIGl0KCdib29sIGR0eXBlLCAhPTAgaXMgdHJ1dGh5LCAwIGlzIGZhbHN5LCBsaWtlIG51bXB5JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3I0ZChbMSwgLTIsIDAsIDNdLCBbMiwgMiwgMSwgMV0sICdib29sJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2Jvb2wnKTtcbiAgICBleHBlY3QoYS5zaGFwZSkudG9FcXVhbChbMiwgMiwgMSwgMV0pO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCBbMSwgMSwgMCwgMV0pO1xuICB9KTtcblxuICBpdCgnZGVmYXVsdCBkdHlwZSBmcm9tIGJvb2xlYW5bXScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID1cbiAgICAgICAgdGYudGVuc29yNGQoW1tbW2ZhbHNlXSwgW2ZhbHNlXV0sIFtbdHJ1ZV0sIFtmYWxzZV1dXV0sIFsxLCAyLCAyLCAxXSk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2Jvb2wnKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgWzAsIDAsIDEsIDBdKTtcbiAgfSk7XG5cbiAgaXQoJ2Zsb2F0MzIgZHR5cGUgZnJvbSBib29sZWFuW10nLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjRkKFxuICAgICAgICBbW1tbZmFsc2VdLCBbZmFsc2VdXSwgW1t0cnVlXSwgW2ZhbHNlXV1dXSwgWzEsIDIsIDIsIDFdLCAnZmxvYXQzMicpO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYS5kYXRhKCksIFswLCAwLCAxLCAwXSk7XG4gIH0pO1xuXG4gIGl0KCdpbnQzMiBkdHlwZSBmcm9tIGJvb2xlYW5bXScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yNGQoXG4gICAgICAgIFtbW1tmYWxzZV0sIFtmYWxzZV1dLCBbW3RydWVdLCBbZmFsc2VdXV1dLCBbMSwgMiwgMiwgMV0sICdpbnQzMicpO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdpbnQzMicpO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCBbMCwgMCwgMSwgMF0pO1xuICB9KTtcblxuICBpdCgnYm9vbCBkdHlwZSBmcm9tIGJvb2xlYW5bXScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yNGQoXG4gICAgICAgIFtbW1tmYWxzZV0sIFtmYWxzZV1dLCBbW3RydWVdLCBbZmFsc2VdXV1dLCBbMSwgMiwgMiwgMV0sICdib29sJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2Jvb2wnKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWzAsIDAsIDEsIDBdKTtcbiAgfSk7XG5cbiAgaXQoJ1NjYWxhciBkZWZhdWx0IGR0eXBlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi5zY2FsYXIoNCk7XG4gICAgY29uc3QgYiA9IGEucmVzaGFwZShbMSwgMV0pO1xuICAgIGV4cGVjdChiLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGIuc2hhcGUpLnRvRXF1YWwoWzEsIDFdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgYXdhaXQgYi5kYXRhKCkpO1xuICB9KTtcblxuICBpdCgnU2NhbGFyIGZsb2F0MzIgZHR5cGUnLCAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnNjYWxhcig0LCAnZmxvYXQzMicpO1xuICAgIGNvbnN0IGIgPSBhLnJlc2hhcGUoWzEsIDFdKTtcbiAgICBleHBlY3QoYi5kdHlwZSkudG9CZSgnZmxvYXQzMicpO1xuICAgIGV4cGVjdChiLnNoYXBlKS50b0VxdWFsKFsxLCAxXSk7XG4gIH0pO1xuXG4gIGl0KCdTY2FsYXIgc3RyaW5nIGR0eXBlJywgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi5zY2FsYXIoJ3Rlc3QnLCAnc3RyaW5nJyk7XG4gICAgY29uc3QgYiA9IGEucmVzaGFwZShbMSwgMV0pO1xuICAgIGV4cGVjdChiLmR0eXBlKS50b0JlKCdzdHJpbmcnKTtcbiAgICBleHBlY3QoYi5zaGFwZSkudG9FcXVhbChbMSwgMV0pO1xuICB9KTtcblxuICBpdCgnc2NhbGFyIGZyb20gZW5jb2RlZCBzdHJpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnNjYWxhcihlbmNvZGVTdHJpbmcoJ2hlbGxvJyksICdzdHJpbmcnKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnc3RyaW5nJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoW10pO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCBbJ2hlbGxvJ10pO1xuICB9KTtcblxuICBpdCgnc2NhbGFyIGZyb20gZW5jb2RlZCBzdHJpbmcsIGJ1dCBtaXNzaW5nIGR0eXBlJywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIFdlIGRvIG5vdCB3YW50IHRvIGluZmVyICdzdHJpbmcnIHdoZW4gdGhlIHVzZXIgcGFzc2VzIFVpbnQ4QXJyYXkgaW4gb3JkZXJcbiAgICAvLyB0byBiZSBmb3J3YXJkIGNvbXBhdGlibGUgaW4gdGhlIGZ1dHVyZSB3aGVuIHdlIGFkZCB1aW50OCBkdHlwZS5cbiAgICBleHBlY3QoKCkgPT4gdGYuc2NhbGFyKGVuY29kZVN0cmluZygnaGVsbG8nKSkpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgnc2NhbGFyIGZyb20gZW5jb2RlZCBzdHJpbmcsIGJ1dCB2YWx1ZSBpcyBub3QgdWludDhhcnJheScsIGFzeW5jICgpID0+IHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgZXhwZWN0KCgpID0+IHRmLnNjYWxhcihuZXcgRmxvYXQzMkFycmF5KFsxLCAyLCAzXSkgYXMgYW55KSkudG9UaHJvd0Vycm9yKCk7XG4gIH0pO1xuXG4gIGl0KCdTY2FsYXIgaW5mZXJyZWQgZHR5cGUgZnJvbSBib29sJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi5zY2FsYXIodHJ1ZSk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2Jvb2wnKTtcbiAgICBleHBlY3QoYS5zaGFwZSkudG9FcXVhbChbXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYS5kYXRhKCksIFsxXSk7XG4gIH0pO1xuXG4gIGl0KCdTY2FsYXIgaW5mZXJyZWQgZHR5cGUgZnJvbSBzdHJpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnNjYWxhcignaGVsbG8nKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnc3RyaW5nJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoW10pO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCBbJ2hlbGxvJ10pO1xuICB9KTtcblxuICBpdCgnU2NhbGFyIGludDMyIGR0eXBlJywgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi5zY2FsYXIoNCwgJ2ludDMyJyk7XG4gICAgY29uc3QgYiA9IGEucmVzaGFwZShbMSwgMV0pO1xuICAgIGV4cGVjdChiLmR0eXBlKS50b0JlKCdpbnQzMicpO1xuICAgIGV4cGVjdChiLnNoYXBlKS50b0VxdWFsKFsxLCAxXSk7XG4gIH0pO1xuXG4gIGl0KCdTY2FsYXIgYm9vbCBkdHlwZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYuc2NhbGFyKDQsICdib29sJyk7XG4gICAgY29uc3QgYiA9IGEucmVzaGFwZShbMSwgMSwgMV0pO1xuICAgIGV4cGVjdChiLmR0eXBlKS50b0JlKCdib29sJyk7XG4gICAgZXhwZWN0KGIuc2hhcGUpLnRvRXF1YWwoWzEsIDEsIDFdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgYXdhaXQgYi5kYXRhKCkpO1xuICB9KTtcblxuICBpdCgnU2NhbGFyIGNvbXBsZXg2NCBkdHlwZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYuY29tcGxleCg0LCA1KTtcbiAgICBjb25zdCBiID0gYS5yZXNoYXBlKFsxLCAxXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYS5kYXRhKCksIFs0LCA1XSk7XG4gICAgZXhwZWN0KGIuZHR5cGUpLnRvQmUoJ2NvbXBsZXg2NCcpO1xuICAgIGV4cGVjdChiLnNoYXBlKS50b0VxdWFsKFsxLCAxXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYS5kYXRhKCksIGF3YWl0IGIuZGF0YSgpKTtcbiAgfSk7XG5cbiAgaXQoJ1RlbnNvcjFEIGRlZmF1bHQgZHR5cGUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzLCA0XSk7XG4gICAgY29uc3QgYiA9IGEucmVzaGFwZShbMiwgMl0pO1xuICAgIGV4cGVjdChiLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGIuc2hhcGUpLnRvRXF1YWwoWzIsIDJdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgYXdhaXQgYi5kYXRhKCkpO1xuICB9KTtcblxuICBpdCgnVGVuc29yMUQgaW5mZXJyZWQgZHR5cGUgZnJvbSBib29scycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoW3RydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZV0pO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdib29sJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzRdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgWzEsIDAsIDAsIDFdKTtcbiAgfSk7XG5cbiAgaXQoJ1RlbnNvcjFEIGluZmVycmVkIGR0eXBlIGZyb20gc3RyaW5ncycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWydhJywgJ2InLCAnYyddKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnc3RyaW5nJyk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzNdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWydhJywgJ2InLCAnYyddKTtcbiAgfSk7XG5cbiAgaXQoJ1RlbnNvcjFEIGZsb2F0MzIgZHR5cGUnLCAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzLCA0XSwgJ2Zsb2F0MzInKTtcbiAgICBjb25zdCBiID0gYS5yZXNoYXBlKFsyLCAyXSk7XG4gICAgZXhwZWN0KGIuZHR5cGUpLnRvQmUoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3QoYi5zaGFwZSkudG9FcXVhbChbMiwgMl0pO1xuICB9KTtcblxuICBpdCgnVGVuc29yMUQgaW50MzIgZHR5cGUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzLCA0XSwgJ2ludDMyJyk7XG4gICAgY29uc3QgYiA9IGEucmVzaGFwZShbMiwgMl0pO1xuICAgIGV4cGVjdChiLmR0eXBlKS50b0JlKCdpbnQzMicpO1xuICAgIGV4cGVjdChiLnNoYXBlKS50b0VxdWFsKFsyLCAyXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYS5kYXRhKCksIGF3YWl0IGIuZGF0YSgpKTtcbiAgfSk7XG5cbiAgaXQoJ1RlbnNvcjFEIGNvbXBsZXg2NCBkdHlwZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYuY29tcGxleChbMSwgMywgNSwgN10sIFsyLCA0LCA2LCA4XSk7XG4gICAgY29uc3QgYiA9IGEucmVzaGFwZShbMiwgMl0pO1xuICAgIGV4cGVjdChiLmR0eXBlKS50b0JlKCdjb21wbGV4NjQnKTtcbiAgICBleHBlY3QoYi5zaGFwZSkudG9FcXVhbChbMiwgMl0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGEuZGF0YSgpLCBhd2FpdCBiLmRhdGEoKSk7XG4gIH0pO1xuXG4gIGl0KCdUZW5zb3IyRCBkZWZhdWx0IGR0eXBlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChbMSwgMiwgMywgNCwgNSwgNl0sIFsyLCAzXSk7XG4gICAgY29uc3QgYiA9IGEucmVzaGFwZShbNl0pO1xuICAgIGV4cGVjdChiLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGIuc2hhcGUpLnRvRXF1YWwoWzZdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgYXdhaXQgYi5kYXRhKCkpO1xuICB9KTtcblxuICBpdCgnVGVuc29yMkQgZmxvYXQzMiBkdHlwZScsICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoWzEsIDIsIDMsIDQsIDUsIDZdLCBbMiwgM10sICdmbG9hdDMyJyk7XG4gICAgY29uc3QgYiA9IGEucmVzaGFwZShbNl0pO1xuICAgIGV4cGVjdChiLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGIuc2hhcGUpLnRvRXF1YWwoWzZdKTtcbiAgfSk7XG5cbiAgaXQoJ1RlbnNvcjJEIGludDMyIGR0eXBlJywgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChbMSwgMiwgMywgNCwgNSwgNl0sIFsyLCAzXSwgJ2ludDMyJyk7XG4gICAgY29uc3QgYiA9IGEucmVzaGFwZShbNl0pO1xuICAgIGV4cGVjdChiLmR0eXBlKS50b0JlKCdpbnQzMicpO1xuICAgIGV4cGVjdChiLnNoYXBlKS50b0VxdWFsKFs2XSk7XG4gIH0pO1xuXG4gIGl0KCdUZW5zb3IyRCBib29sIGR0eXBlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChbMSwgMiwgMywgNCwgNSwgNl0sIFsyLCAzXSwgJ2Jvb2wnKTtcbiAgICBjb25zdCBiID0gYS5yZXNoYXBlKFs2XSk7XG4gICAgZXhwZWN0KGIuZHR5cGUpLnRvQmUoJ2Jvb2wnKTtcbiAgICBleHBlY3QoYi5zaGFwZSkudG9FcXVhbChbNl0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGEuZGF0YSgpLCBhd2FpdCBiLmRhdGEoKSk7XG4gIH0pO1xuXG4gIGl0KCdUZW5zb3IyRCBjb21wbGV4NjQgZHR5cGUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLmNvbXBsZXgoW1sxLCAzLCA1XSwgWzcsIDksIDExXV0sIFtbMiwgNCwgNl0sIFs4LCAxMCwgMTJdXSk7XG4gICAgY29uc3QgYiA9IGEucmVzaGFwZShbNl0pO1xuICAgIGV4cGVjdChiLmR0eXBlKS50b0JlKCdjb21wbGV4NjQnKTtcbiAgICBleHBlY3QoYi5zaGFwZSkudG9FcXVhbChbNl0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGEuZGF0YSgpLCBhd2FpdCBiLmRhdGEoKSk7XG4gIH0pO1xuXG4gIGl0KCdUZW5zb3IzRCBkZWZhdWx0IGR0eXBlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IzZChbMSwgMiwgMywgNCwgNSwgNl0sIFsyLCAzLCAxXSk7XG4gICAgY29uc3QgYiA9IGEucmVzaGFwZShbNl0pO1xuICAgIGV4cGVjdChiLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGIuc2hhcGUpLnRvRXF1YWwoWzZdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgYXdhaXQgYi5kYXRhKCkpO1xuICB9KTtcblxuICBpdCgnVGVuc29yM0QgZmxvYXQzMiBkdHlwZScsICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yM2QoWzEsIDIsIDMsIDQsIDUsIDZdLCBbMiwgMywgMV0sICdmbG9hdDMyJyk7XG4gICAgY29uc3QgYiA9IGEucmVzaGFwZShbNl0pO1xuICAgIGV4cGVjdChiLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGIuc2hhcGUpLnRvRXF1YWwoWzZdKTtcbiAgfSk7XG5cbiAgaXQoJ1RlbnNvcjNEIGludDMyIGR0eXBlJywgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IzZChbMSwgMiwgMywgNCwgNSwgNl0sIFsyLCAzLCAxXSwgJ2ludDMyJyk7XG4gICAgY29uc3QgYiA9IGEucmVzaGFwZShbNl0pO1xuICAgIGV4cGVjdChiLmR0eXBlKS50b0JlKCdpbnQzMicpO1xuICAgIGV4cGVjdChiLnNoYXBlKS50b0VxdWFsKFs2XSk7XG4gIH0pO1xuXG4gIGl0KCdUZW5zb3IzRCBib29sIGR0eXBlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IzZChbMSwgMiwgMywgNCwgNSwgNl0sIFsyLCAzLCAxXSwgJ2Jvb2wnKTtcbiAgICBjb25zdCBiID0gYS5yZXNoYXBlKFs2XSk7XG4gICAgZXhwZWN0KGIuZHR5cGUpLnRvQmUoJ2Jvb2wnKTtcbiAgICBleHBlY3QoYi5zaGFwZSkudG9FcXVhbChbNl0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGEuZGF0YSgpLCBhd2FpdCBiLmRhdGEoKSk7XG4gIH0pO1xuXG4gIGl0KCdUZW5zb3IzRCBjb21wbGV4NjQgZHR5cGUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLmNvbXBsZXgoXG4gICAgICAgIFtbWzFdLCBbM10sIFs1XV0sIFtbN10sIFs5XSwgWzExXV1dLFxuICAgICAgICBbW1syXSwgWzRdLCBbNl1dLCBbWzhdLCBbMTBdLCBbMTJdXV0pO1xuICAgIGNvbnN0IGIgPSBhLnJlc2hhcGUoWzZdKTtcbiAgICBleHBlY3QoYi5kdHlwZSkudG9CZSgnY29tcGxleDY0Jyk7XG4gICAgZXhwZWN0KGIuc2hhcGUpLnRvRXF1YWwoWzZdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgYXdhaXQgYi5kYXRhKCkpO1xuICB9KTtcblxuICBpdCgnVGVuc29yNEQgZGVmYXVsdCBkdHlwZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yNGQoWzEsIDIsIDMsIDQsIDUsIDZdLCBbMiwgMywgMSwgMV0pO1xuICAgIGNvbnN0IGIgPSBhLnJlc2hhcGUoWzIsIDNdKTtcbiAgICBleHBlY3QoYi5kdHlwZSkudG9CZSgnZmxvYXQzMicpO1xuICAgIGV4cGVjdChiLnNoYXBlKS50b0VxdWFsKFsyLCAzXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYS5kYXRhKCksIGF3YWl0IGIuZGF0YSgpKTtcbiAgfSk7XG5cbiAgaXQoJ1RlbnNvcjREIGZsb2F0MzIgZHR5cGUnLCAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjRkKFsxLCAyLCAzLCA0LCA1LCA2XSwgWzIsIDMsIDEsIDFdLCAnZmxvYXQzMicpO1xuICAgIGNvbnN0IGIgPSBhLnJlc2hhcGUoWzIsIDNdKTtcbiAgICBleHBlY3QoYi5kdHlwZSkudG9CZSgnZmxvYXQzMicpO1xuICAgIGV4cGVjdChiLnNoYXBlKS50b0VxdWFsKFsyLCAzXSk7XG4gIH0pO1xuXG4gIGl0KCdUZW5zb3I0RCBpbnQzMiBkdHlwZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yNGQoWzEsIDIsIDMsIDQsIDUsIDZdLCBbMiwgMywgMSwgMV0sICdpbnQzMicpO1xuICAgIGNvbnN0IGIgPSBhLnJlc2hhcGUoWzMsIDJdKTtcbiAgICBleHBlY3QoYi5kdHlwZSkudG9CZSgnaW50MzInKTtcbiAgICBleHBlY3QoYi5zaGFwZSkudG9FcXVhbChbMywgMl0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGEuZGF0YSgpLCBhd2FpdCBiLmRhdGEoKSk7XG4gIH0pO1xuXG4gIGl0KCdUZW5zb3I0RCBjb21wbGV4NjQgZHR5cGUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLmNvbXBsZXgoXG4gICAgICAgIFtbW1sxXV0sIFtbM11dLCBbWzVdXV0sIFtbWzddXSwgW1s5XV0sIFtbMTFdXV1dLFxuICAgICAgICBbW1tbMl1dLCBbWzRdXSwgW1s2XV1dLCBbW1s4XV0sIFtbMTBdXSwgW1sxMl1dXV0pO1xuICAgIGNvbnN0IGIgPSBhLnJlc2hhcGUoWzMsIDJdKTtcbiAgICBleHBlY3QoYi5kdHlwZSkudG9CZSgnY29tcGxleDY0Jyk7XG4gICAgZXhwZWN0KGIuc2hhcGUpLnRvRXF1YWwoWzMsIDJdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgYXdhaXQgYi5kYXRhKCkpO1xuICB9KTtcblxuICBpdCgnVGVuc29yNEQgYm9vbCBkdHlwZScsICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yNGQoWzEsIDIsIDMsIDQsIDUsIDZdLCBbMiwgMywgMSwgMV0sICdib29sJyk7XG4gICAgY29uc3QgYiA9IGEucmVzaGFwZShbMywgMl0pO1xuICAgIGV4cGVjdChiLmR0eXBlKS50b0JlKCdib29sJyk7XG4gICAgZXhwZWN0KGIuc2hhcGUpLnRvRXF1YWwoWzMsIDJdKTtcbiAgfSk7XG5cbiAgaXQoJy5kYXRhKCkgd2l0aCBjYXN0aW5nLCBzdHJpbmcgdGVuc29yJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IoWydhJywgJ2InXSk7XG4gICAgY29uc3QgZGF0YTogc3RyaW5nW10gPSBhd2FpdCBhLmRhdGE8J3N0cmluZyc+KCk7XG4gICAgZXhwZWN0KGRhdGEpLnRvRXF1YWwoWydhJywgJ2InXSk7XG4gIH0pO1xuXG4gIGl0KCdyZXNoYXBlIGlzIGZ1bmN0aW9uYWwnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnNjYWxhcigyLjQpO1xuICAgIGNvbnN0IGIgPSBhLnJlc2hhcGUoW10pO1xuICAgIGV4cGVjdChhLmlkKS5ub3QudG9CZShiLmlkKTtcbiAgICBiLmRpc3Bvc2UoKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgWzIuNF0pO1xuICB9KTtcblxuICBpdCgncmVzaGFwZSBhIHN0cmluZyB0ZW5zb3InLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcihbJ2EnLCAnYiddKTtcbiAgICBjb25zdCBiID0gYS5yZXNoYXBlKFsyLCAxLCAxXSk7XG4gICAgZXhwZWN0KGIuZHR5cGUpLnRvQmUoJ3N0cmluZycpO1xuICAgIGV4cGVjdChiLnNoYXBlKS50b0VxdWFsKFsyLCAxLCAxXSk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgYi5kYXRhKCksIFsnYScsICdiJ10pO1xuICB9KTtcblxuICBpdCgncmVzaGFwZSB0aHJvd3Mgd2hlbiBwYXNzZWQgYSBub24tdGVuc29yJywgKCkgPT4ge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICBleHBlY3QoKCkgPT4gdGYucmVzaGFwZSh7fSBhcyBhbnksIFtdKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvQXJndW1lbnQgJ3gnIHBhc3NlZCB0byAncmVzaGFwZScgbXVzdCBiZSBhIFRlbnNvci8pO1xuICB9KTtcblxuICBpdCgncmVzaGFwZSBhY2NlcHRzIGEgdGVuc29yLWxpa2Ugb2JqZWN0JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHJlcyA9IHRmLnJlc2hhcGUoW1sxLCAyLCAzXSwgWzQsIDUsIDZdXSwgWzMsIDJdKTtcbiAgICBleHBlY3QocmVzLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KHJlcy5zaGFwZSkudG9FcXVhbChbMywgMl0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlcy5kYXRhKCksIFsxLCAyLCAzLCA0LCA1LCA2XSk7XG4gIH0pO1xuXG4gIGl0KCdjYXN0IGJvb2wgLT4gYm9vbCcsICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzEsIDBdLCAnYm9vbCcpO1xuICAgIGV4cGVjdChhLmNhc3QoJ2Jvb2wnKS5kdHlwZSkudG9FcXVhbCgnYm9vbCcpO1xuICB9KTtcblxuICBpdCgnY2FzdCBib29sIC0+IGludDMyJywgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMSwgMF0sICdib29sJyk7XG4gICAgZXhwZWN0KGEuY2FzdCgnaW50MzInKS5kdHlwZSkudG9FcXVhbCgnaW50MzInKTtcbiAgfSk7XG5cbiAgaXQoJ2Nhc3QgYm9vbCAtPiBmbG9hdDMyJywgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMSwgMF0sICdib29sJyk7XG4gICAgZXhwZWN0KGEuY2FzdCgnZmxvYXQzMicpLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gIH0pO1xuXG4gIGl0KCdjYXN0IGludDMyIC0+IGJvb2wnLCAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLCAwXSwgJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuY2FzdCgnYm9vbCcpLmR0eXBlKS50b0VxdWFsKCdib29sJyk7XG4gIH0pO1xuXG4gIGl0KCdjYXN0IGludDMyIC0+IGludDMyJywgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMSwgMl0sICdpbnQzMicpO1xuICAgIGV4cGVjdChhLmNhc3QoJ2ludDMyJykuZHR5cGUpLnRvRXF1YWwoJ2ludDMyJyk7XG4gIH0pO1xuXG4gIGl0KCdjYXN0IGludDMyIC0+IGZsb2F0MzInLCAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLCAyXSwgJ2ludDMyJyk7XG4gICAgZXhwZWN0KGEuY2FzdCgnZmxvYXQzMicpLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gIH0pO1xuXG4gIGl0KCdjYXN0IGZsb2F0MzIgLT4gYm9vbCcsICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzEuMCwgMC4wXSk7XG4gICAgZXhwZWN0KGEuY2FzdCgnYm9vbCcpLmR0eXBlKS50b0VxdWFsKCdib29sJyk7XG4gIH0pO1xuXG4gIGl0KCdjYXN0IGZsb2F0MzIgLT4gaW50MzInLCAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLjAsIDIuMF0pO1xuICAgIGV4cGVjdChhLmNhc3QoJ2ludDMyJykuZHR5cGUpLnRvRXF1YWwoJ2ludDMyJyk7XG4gIH0pO1xuXG4gIGl0KCdjYXN0IGZsb2F0MzIgLT4gaW50MzIuIGFzeW5jIGRvd25sb2FkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMSwgMl0pO1xuICAgIGNvbnN0IGFJbnQgPSBhLmNhc3QoJ2ludDMyJyk7XG4gICAgZXhwZWN0KGFJbnQuZHR5cGUpLnRvRXF1YWwoJ2ludDMyJyk7XG5cbiAgICBjb25zdCBhc3luY0RhdGEgPSBhd2FpdCBhSW50LmRhdGEoKTtcbiAgICBleHBlY3QoYXN5bmNEYXRhIGluc3RhbmNlb2YgSW50MzJBcnJheSkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgaXQoJ2Nhc3QgZmxvYXQzMiAtPiBpbnQzMi4gcXVldWVkIGFzeW5jIGRvd25sb2FkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMSwgMl0pO1xuICAgIGNvbnN0IGFJbnQgPSBhLmNhc3QoJ2ludDMyJyk7XG4gICAgZXhwZWN0KGFJbnQuZHR5cGUpLnRvRXF1YWwoJ2ludDMyJyk7XG5cbiAgICBjb25zdCBbZmlyc3QsIHNlY29uZF0gPSBhd2FpdCBQcm9taXNlLmFsbChbYUludC5kYXRhKCksIGFJbnQuZGF0YSgpXSk7XG4gICAgZXhwZWN0KGZpcnN0IGluc3RhbmNlb2YgSW50MzJBcnJheSkudG9FcXVhbCh0cnVlKTtcbiAgICBleHBlY3Qoc2Vjb25kIGluc3RhbmNlb2YgSW50MzJBcnJheSkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgaXQoJ2Nhc3QgZmxvYXQzMiAtPiBpbnQzMi4gc3luYyBkb3dubG9hZCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzEsIDJdKS5jYXN0KCdpbnQzMicpO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0VxdWFsKCdpbnQzMicpO1xuXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IGEuZGF0YSgpO1xuICAgIGV4cGVjdChkYXRhIGluc3RhbmNlb2YgSW50MzJBcnJheSkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgaXQoJ2Nhc3QgZmxvYXQzMiAtPiBmbG9hdDMyJywgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMS4wLCAyLjBdKTtcbiAgICBleHBlY3QoYS5jYXN0KCdmbG9hdDMyJykuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcbiAgfSk7XG5cbiAgaXQoJ2Nhc3QgY29tcGxleDY0IC0+IGZsb2F0MzInLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLmNvbXBsZXgoWzEuMCwgMi4wXSwgWzMuMCwgNC4wXSk7XG4gICAgY29uc3QgcmVzdWx0ID0gYS5jYXN0KCdmbG9hdDMyJyk7XG5cbiAgICBleHBlY3QocmVzdWx0LmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzEuMCwgMi4wXSk7XG4gIH0pO1xuXG4gIGl0KCdjYXN0IGNvbXBsZXg2NCAtPiBpbnQzMicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYuY29tcGxleChbMS4wLCAyLjBdLCBbMy4wLCA0LjBdKTtcbiAgICBjb25zdCByZXN1bHQgPSBhLmNhc3QoJ2ludDMyJyk7XG5cbiAgICBleHBlY3QocmVzdWx0LmR0eXBlKS50b0VxdWFsKCdpbnQzMicpO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IHJlc3VsdC5kYXRhKCksIFsxLCAyXSk7XG4gIH0pO1xuXG4gIGl0KCdjYXN0IGNvbXBsZXg2NCAtPiBib29sJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi5jb21wbGV4KFsxLjAsIDAuMF0sIFsxLjAsIDEuMF0pO1xuICAgIGNvbnN0IHJlc3VsdCA9IGEuY2FzdCgnYm9vbCcpO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5kdHlwZSkudG9FcXVhbCgnYm9vbCcpO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IHJlc3VsdC5kYXRhKCksIFt0cnVlLCBmYWxzZV0pO1xuICB9KTtcblxuICBpdCgnY2FzdCB0aHJvd3Mgd2hlbiBwYXNzZWQgYSBub24tdGVuc29yJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB0Zi5jYXN0KHt9IGFzIHRmLlRlbnNvciwgJ2Zsb2F0MzInKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvQXJndW1lbnQgJ3gnIHBhc3NlZCB0byAnY2FzdCcgbXVzdCBiZSBhIFRlbnNvci8pO1xuICB9KTtcblxuICBpdCgnY2FzdCBhY2NlcHRzIGEgdGVuc29yLWxpa2Ugb2JqZWN0JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSBbMS4wLCAyLjBdO1xuICAgIGNvbnN0IHJlcyA9IHRmLmNhc3QoYSwgJ2ludDMyJyk7XG4gICAgZXhwZWN0KHJlcy5kdHlwZSkudG9FcXVhbCgnaW50MzInKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXMuZGF0YSgpLCBbMSwgMl0pO1xuICB9KTtcblxuICBpdCgnY2FzdCBzdHJpbmcgLT4gIXN0cmluZyB0aHJvd3MgZXJyb3InLCAoKSA9PiB7XG4gICAgY29uc3QgYSA9IFsnYScsICdiJ107XG4gICAgZXhwZWN0KCgpID0+IHRmLmNhc3QoYSwgJ2ludDMyJykpLnRvVGhyb3dFcnJvcigpO1xuICAgIGV4cGVjdCgoKSA9PiB0Zi5jYXN0KGEsICdmbG9hdDMyJykpLnRvVGhyb3dFcnJvcigpO1xuICAgIGV4cGVjdCgoKSA9PiB0Zi5jYXN0KGEsICdib29sJykpLnRvVGhyb3dFcnJvcigpO1xuICAgIGV4cGVjdCgoKSA9PiB0Zi5jYXN0KGEsICdjb21wbGV4NjQnKSkudG9UaHJvd0Vycm9yKCk7XG4gIH0pO1xuXG4gIGl0KCdjYXN0ICFzdHJpbmcgLT4gc3RyaW5nIHRocm93cyBlcnJvcicsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gdGYuY2FzdCh0Zi50ZW5zb3IoMSwgW10sICdmbG9hdDMyJyksICdzdHJpbmcnKSkudG9UaHJvd0Vycm9yKCk7XG4gICAgZXhwZWN0KCgpID0+IHRmLmNhc3QodGYudGVuc29yKDEsIFtdLCAnaW50MzInKSwgJ3N0cmluZycpKS50b1Rocm93RXJyb3IoKTtcbiAgICBleHBlY3QoKCkgPT4gdGYuY2FzdCh0Zi50ZW5zb3IoMSwgW10sICdib29sJyksICdzdHJpbmcnKSkudG9UaHJvd0Vycm9yKCk7XG4gICAgZXhwZWN0KCgpID0+IHRmLmNhc3QodGYudGVuc29yKDEsIFtdLCAnY29tcGxleDY0JyksICdzdHJpbmcnKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgnc2NhbGFyIGJvb2wgLT4gaW50MzInLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnNjYWxhcih0cnVlLCAnYm9vbCcpLnRvSW50KCk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgYS5kYXRhKCksIDEpO1xuICB9KTtcblxuICBpdCgnVGVuc29yMUQgZmxvYXQzMiAtPiBpbnQzMicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzEuMSwgMy45LCAtMi45LCAwXSkudG9JbnQoKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnaW50MzInKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWzEsIDMsIC0yLCAwXSk7XG4gIH0pO1xuXG4gIGl0KCdUZW5zb3IyRCBmbG9hdDMyIC0+IGJvb2wnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKFsxLjEsIDMuOSwgLTIuOSwgMF0sIFsyLCAyXSkuYXNUeXBlKCdib29sJyk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2Jvb2wnKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWzEsIDEsIDEsIDBdKTtcbiAgfSk7XG5cbiAgaXQoJ1RlbnNvcjJEIGludDMyIC0+IGJvb2wnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKFsxLCAzLCAwLCAtMV0sIFsyLCAyXSwgJ2ludDMyJykudG9Cb29sKCk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2Jvb2wnKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWzEsIDEsIDAsIDFdKTtcbiAgfSk7XG5cbiAgaXQoJ1RlbnNvcjNEIGJvb2wgLT4gZmxvYXQzMicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID1cbiAgICAgICAgdGYudGVuc29yM2QoW3RydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZV0sIFsyLCAyLCAxXSwgJ2Jvb2wnKS50b0Zsb2F0KCk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgWzEsIDAsIDAsIDFdKTtcbiAgfSk7XG5cbiAgaXQoJ2Jvb2wgQ1BVIC0+IEdQVSAtPiBDUFUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLCAyLCAwLCAwLCA1XSwgJ2Jvb2wnKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgWzEsIDEsIDAsIDAsIDFdKTtcbiAgfSk7XG5cbiAgaXQoJ2ludDMyIENQVSAtPiBHUFUgLT4gQ1BVJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMSwgMiwgMCwgMCwgNV0sICdpbnQzMicpO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCBbMSwgMiwgMCwgMCwgNV0pO1xuICB9KTtcblxuICBpdCgnYXNUeXBlIGlzIGZ1bmN0aW9uYWwnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnNjYWxhcigyLjQsICdmbG9hdDMyJyk7XG4gICAgY29uc3QgYiA9IGEudG9GbG9hdCgpO1xuICAgIGV4cGVjdChhLmlkKS5ub3QudG9CZShiLmlkKTtcbiAgICBiLmRpc3Bvc2UoKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgWzIuNF0pO1xuICB9KTtcblxuICBpdCgnc3F1ZWV6ZSBubyBheGlzJywgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChbNCwgMiwgMV0sIFszLCAxXSwgJ2Jvb2wnKTtcbiAgICBjb25zdCBiID0gYS5zcXVlZXplKCk7XG4gICAgZXhwZWN0KGIuc2hhcGUpLnRvRXF1YWwoWzNdKTtcbiAgfSk7XG5cbiAgaXQoJ3NxdWVlemUgd2l0aCBheGlzJywgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IzZChbNCwgMiwgMV0sIFszLCAxLCAxXSwgJ2Jvb2wnKTtcbiAgICBjb25zdCBiID0gYS5zcXVlZXplKFsxXSk7XG4gICAgZXhwZWN0KGIuc2hhcGUpLnRvRXF1YWwoWzMsIDFdKTtcbiAgfSk7XG5cbiAgaXQoJ3NxdWVlemUgd2l0aCBuZWdhdGl2ZSBheGlzJywgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IzZChbNCwgMiwgMV0sIFszLCAxLCAxXSwgJ2Jvb2wnKTtcbiAgICBjb25zdCBiID0gYS5zcXVlZXplKFstMV0pO1xuICAgIGV4cGVjdChiLnNoYXBlKS50b0VxdWFsKFszLCAxXSk7XG4gIH0pO1xuXG4gIGl0KCdzcXVlZXplIHdpdGggbXVsdGlwbGUgbmVnYXRpdmUgYXhpcycsICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yM2QoWzQsIDIsIDFdLCBbMywgMSwgMV0sICdib29sJyk7XG4gICAgY29uc3QgYiA9IGEuc3F1ZWV6ZShbLTEsIC0yXSk7XG4gICAgZXhwZWN0KGIuc2hhcGUpLnRvRXF1YWwoWzNdKTtcbiAgfSk7XG5cbiAgaXQoJ3NxdWVlemUgd3JvbmcgYXhpcycsICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yM2QoWzQsIDIsIDFdLCBbMywgMSwgMV0sICdib29sJyk7XG4gICAgZXhwZWN0KCgpID0+IGEuc3F1ZWV6ZShbMCwgMV0pKS50b1Rocm93RXJyb3IoKTtcbiAgfSk7XG5cbiAgaXQoJ3NxdWVlemUgd3JvbmcgbmVnYXRpdmUgYXhpcycsICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yM2QoWzQsIDIsIDFdLCBbMywgMSwgMV0sICdib29sJyk7XG4gICAgZXhwZWN0KCgpID0+IGEuc3F1ZWV6ZShbLTMsIC0yXSkpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgnc3F1ZWV6ZSBheGlzIG91dCBvZiByYW5nZScsICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yM2QoWzQsIDIsIDFdLCBbMywgMSwgMV0sICdib29sJyk7XG4gICAgZXhwZWN0KCgpID0+IGEuc3F1ZWV6ZShbMTAsIDExXSkpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgnc3F1ZWV6ZSBuZWdhdGl2ZSBheGlzIG91dCBvZiByYW5nZScsICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yM2QoWzQsIDIsIDFdLCBbMywgMSwgMV0sICdib29sJyk7XG4gICAgZXhwZWN0KCgpID0+IGEuc3F1ZWV6ZShbLTEzLCAtMTJdKSkudG9UaHJvd0Vycm9yKCk7XG4gIH0pO1xuXG4gIGl0KCdzcXVlZXplIHRocm93cyB3aGVuIHBhc3NlZCBhIG5vbi10ZW5zb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLnNxdWVlemUoe30gYXMgdGYuVGVuc29yKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvQXJndW1lbnQgJ3gnIHBhc3NlZCB0byAnc3F1ZWV6ZScgbXVzdCBiZSBhIFRlbnNvci8pO1xuICB9KTtcblxuICBpdCgnc3F1ZWV6ZSBhY2NlcHRzIGEgdGVuc29yLWxpa2Ugb2JqZWN0JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHJlcyA9IHRmLnNxdWVlemUoW1tbNF1dLCBbWzJdXSwgW1sxXV1dIC8qIHNoYXBlIGlzIFszLCAxLCAxXSAqLyk7XG4gICAgZXhwZWN0KHJlcy5zaGFwZSkudG9FcXVhbChbM10pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlcy5kYXRhKCksIFs0LCAyLCAxXSk7XG4gIH0pO1xuXG4gIGl0KCdzcXVlZXplIGEgemVyby1zaXplZCB0ZW5zb3InLCAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjNkKFtdLCBbMCwgMSwgMF0pO1xuICAgIGNvbnN0IHJlcyA9IHRmLnNxdWVlemUoYSk7XG4gICAgZXhwZWN0KHJlcy5zaGFwZSkudG9FcXVhbChbMCwgMF0pO1xuICB9KTtcblxuICBpdCgnc3F1ZWV6ZSBjYW4gdGFrZSBhbiBlbXB0eSBsaXN0IG9mIGF4aXMnLCAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnplcm9zKFsyLCAxLCAzLCAxLCA0XSk7XG4gICAgY29uc3QgYXhlczogbnVtYmVyW10gPSBbXTtcbiAgICAvLyBFbXB0eSBheGVzIGxpc3QgbWVhbnMgYWxsIHBvc3NpYmxlIGF4ZXMuXG4gICAgY29uc3QgcmVzID0gdGYuc3F1ZWV6ZShhLCBheGVzKTtcbiAgICBleHBlY3QocmVzLnNoYXBlKS50b0VxdWFsKFsyLCAzLCA0XSk7XG4gIH0pO1xuXG4gIGl0KCdzcXVlZXplIGEgY29tcGxleDY0IHRlbnNvcicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYuY29tcGxleChbWzRdLCBbMV0sIFs1XV0sIFtbMl0sIFszXSwgWzZdXSk7XG4gICAgY29uc3QgYiA9IGEuc3F1ZWV6ZSgpO1xuICAgIGV4cGVjdChiLnNoYXBlKS50b0VxdWFsKFszXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYi5kYXRhKCksIFs0LCAyLCAxLCAzLCA1LCA2XSk7XG4gIH0pO1xuXG4gIGl0KCdzY2FsYXIgLT4gMmQnLCAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnNjYWxhcig0LCAnaW50MzInKTtcbiAgICBjb25zdCBiID0gYS5hczJEKDEsIDEpO1xuICAgIGV4cGVjdChiLmR0eXBlKS50b0JlKCdpbnQzMicpO1xuICAgIGV4cGVjdChiLnNoYXBlKS50b0VxdWFsKFsxLCAxXSk7XG4gIH0pO1xuXG4gIGl0KCcxZCAtPiAyZCcsICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzQsIDIsIDFdLCAnYm9vbCcpO1xuICAgIGNvbnN0IGIgPSBhLmFzMkQoMywgMSk7XG4gICAgZXhwZWN0KGIuZHR5cGUpLnRvQmUoJ2Jvb2wnKTtcbiAgICBleHBlY3QoYi5zaGFwZSkudG9FcXVhbChbMywgMV0pO1xuICB9KTtcblxuICBpdCgnMmQgLT4gNGQnLCAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKFs0LCAyLCAxLCAzXSwgWzIsIDJdKTtcbiAgICBjb25zdCBiID0gYS5hczREKDEsIDEsIDIsIDIpO1xuICAgIGV4cGVjdChiLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGIuc2hhcGUpLnRvRXF1YWwoWzEsIDEsIDIsIDJdKTtcbiAgfSk7XG5cbiAgaXQoJzNkIC0+IDJkJywgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IzZChbNCwgMiwgMSwgM10sIFsyLCAyLCAxXSwgJ2Zsb2F0MzInKTtcbiAgICBjb25zdCBiID0gYS5hczJEKDIsIDIpO1xuICAgIGV4cGVjdChiLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGIuc2hhcGUpLnRvRXF1YWwoWzIsIDJdKTtcbiAgfSk7XG5cbiAgaXQoJzRkIC0+IDFkJywgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3I0ZChbNCwgMiwgMSwgM10sIFsyLCAyLCAxLCAxXSwgJ2Jvb2wnKTtcbiAgICBjb25zdCBiID0gYS5hczFEKCk7XG4gICAgZXhwZWN0KGIuZHR5cGUpLnRvQmUoJ2Jvb2wnKTtcbiAgICBleHBlY3QoYi5zaGFwZSkudG9FcXVhbChbNF0pO1xuICB9KTtcblxuICBpdCgndGhyb3dzIHdoZW4gcGFzc2VkIG5vbi1pbnRlZ2VyIHNoYXBlJywgKCkgPT4ge1xuICAgIGNvbnN0IG1zZyA9ICdUZW5zb3IgbXVzdCBoYXZlIGEgc2hhcGUgY29tcHJpc2VkIG9mIHBvc2l0aXZlICcgK1xuICAgICAgICAnaW50ZWdlcnMgYnV0IGdvdCBzaGFwZSBbMiwyLjJdLic7XG4gICAgZXhwZWN0KCgpID0+IHRmLnRlbnNvcihbMSwgMiwgMywgNF0sIFsyLCAyLjJdKSkudG9UaHJvd0Vycm9yKG1zZyk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3Mgd2hlbiBwYXNzZWQgbmVnYXRpdmUgc2hhcGUnLCAoKSA9PiB7XG4gICAgY29uc3QgbXNnID0gJ1RlbnNvciBtdXN0IGhhdmUgYSBzaGFwZSBjb21wcmlzZWQgb2YgcG9zaXRpdmUgJyArXG4gICAgICAgICdpbnRlZ2VycyBidXQgZ290IHNoYXBlIFsyLC0yXS4nO1xuICAgIGV4cGVjdCgoKSA9PiB0Zi50ZW5zb3IoWzEsIDIsIDMsIDRdLCBbMiwgLTJdKSkudG9UaHJvd0Vycm9yKG1zZyk7XG4gIH0pO1xuXG4gIGl0KCdvbmVzIHdpdGggY29tcGxleCB0eXBlJywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIEltYWdpbmFyeSBwYXJ0IHNob3VsZCBiZSB6ZXJvLlxuICAgIGNvbnN0IGEgPSB0Zi5vbmVzKFsyLCAyXSwgJ2NvbXBsZXg2NCcpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGEuZGF0YSgpLCBbMSwgMCwgMSwgMCwgMSwgMCwgMSwgMF0pO1xuICB9KTtcblxuICBpdCgnY2FuIGNyZWF0ZSBhIHRlbnNvciB3aGVyZSB2YWx1ZXMuc2l6ZSAhPSBidWZmZXIuc2l6ZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gbmV3IEZsb2F0MzJBcnJheShbMSwgMiwgMywgNCwgNV0pO1xuICAgIGNvbnN0IGIgPSBhLnN1YmFycmF5KDAsIDIpO1xuICAgIGNvbnN0IHQgPSB0Zi50ZW5zb3IxZChiKTtcbiAgICBleHBlY3QodC5zaGFwZSkudG9FcXVhbChbMl0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHQuZGF0YSgpLCBbMSwgMl0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZVdpdGhGbGFncygndGVuc29yIGRlYnVnIG1vZGUnLCBBTExfRU5WUywgKCkgPT4ge1xuICBiZWZvcmVBbGwoKCkgPT4ge1xuICAgIC8vIFNpbGVuY2UgZGVidWcgd2FybmluZ3MuXG4gICAgc3B5T24oY29uc29sZSwgJ3dhcm4nKTtcbiAgICB0Zi5lbmFibGVEZWJ1Z01vZGUoKTtcbiAgfSk7XG5cbiAgaXQoJ3RmLnRlbnNvcigpIGZyb20gVHlwZWRBcnJheSArIG51bWJlcltdIGZhaWxzIGR1ZSB0byB3cm9uZyBzaGFwZScsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gdGYudGVuc29yKFtcbiAgICAgIG5ldyBGbG9hdDMyQXJyYXkoWzEsIDJdKSxcbiAgICAgIG5ldyBGbG9hdDMyQXJyYXkoWzMsIDRdKSxcbiAgICAgIG5ldyBGbG9hdDMyQXJyYXkoWzUsIDZdKSxcbiAgICAgIC8vIFNob3VsZCBiZSBvZiBsZW5ndGggNFxuICAgICAgWzcsIDgsIDksIDEwXSxcbiAgICBdKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcihcbiAgICAgICAgICAgIC9FbGVtZW50IGFyclxcWzNcXF0gc2hvdWxkIGhhdmUgMiBlbGVtZW50cywgYnV0IGhhcyA0IGVsZW1lbnRzLyk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCd0ZW5zb3IgZGF0YVN5bmMnLCBTWU5DX0JBQ0tFTkRfRU5WUywgKCkgPT4ge1xuICBpdCgnLmRhdGFTeW5jKCkgd2l0aCBjYXN0aW5nLCBzdHJpbmcgdGVuc29yJywgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IoWydhJywgJ2InXSk7XG4gICAgY29uc3QgZGF0YTogc3RyaW5nW10gPSBhLmRhdGFTeW5jPCdzdHJpbmcnPigpO1xuICAgIGV4cGVjdChkYXRhKS50b0VxdWFsKFsnYScsICdiJ10pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZVdpdGhGbGFncygndGVuc29yIGFycmF5U3luYycsIFNZTkNfQkFDS0VORF9FTlZTLCAoKSA9PiB7XG4gIGl0KCcuYXJyYXlTeW5jKCkgd2l0aCBhIG5vbi1jb21wbGV4IHRlbnNvcicsICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yKFsxLCAyLCAzLCA0LCA1LCA2XSwgWzIsIDNdKTtcbiAgICBleHBlY3QoYS5hcnJheVN5bmMoKSkudG9FcXVhbChbWzEsIDIsIDNdLCBbNCwgNSwgNl1dKTtcbiAgfSk7XG5cbiAgaXQoJy5hcnJheVN5bmMoKSB3aXRoIGEgY29tcGxleCB0ZW5zb3InLCAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLmNvbXBsZXgoW1sxLCAyXSwgWzMsIDRdXSwgW1sxMSwgMTJdLCBbMTMsIDE0XV0pO1xuICAgIGV4cGVjdChhLmFycmF5U3luYygpKS50b0VxdWFsKFtbMSwgMTEsIDIsIDEyXSwgWzMsIDEzLCA0LCAxNF1dKTtcbiAgfSk7XG5cbiAgLy8gVGhlIG90aGVyIGNhc2VzIHNob3VsZCBiZSBjb3ZlcmVkIGJ5IHRvTmVzdGVkQXJyYXkgdGVzdHMgaW4gdXRpbF90ZXN0LnRzLlxufSk7XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCd0ZW5zb3IudG9TdHJpbmcnLCBTWU5DX0JBQ0tFTkRfRU5WUywgKCkgPT4ge1xuICBpdCgnc2NhbGFyIHZlcmJvc2UnLCAoKSA9PiB7XG4gICAgY29uc3QgdmVyYm9zZSA9IHRydWU7XG4gICAgY29uc3Qgc3RyID0gdGYuc2NhbGFyKDUpLnRvU3RyaW5nKHZlcmJvc2UpO1xuICAgIGV4cGVjdChzdHIpLnRvRXF1YWwoXG4gICAgICAgICdUZW5zb3JcXG4nICtcbiAgICAgICAgJyAgZHR5cGU6IGZsb2F0MzJcXG4nICtcbiAgICAgICAgJyAgcmFuazogMFxcbicgK1xuICAgICAgICAnICBzaGFwZTogW11cXG4nICtcbiAgICAgICAgJyAgdmFsdWVzOlxcbicgK1xuICAgICAgICAnICAgIDUnKTtcbiAgfSk7XG5cbiAgaXQoJ3N0cmluZyBzY2FsYXIgdmVyYm9zZScsICgpID0+IHtcbiAgICBjb25zdCB2ZXJib3NlID0gdHJ1ZTtcbiAgICBjb25zdCBzdHIgPSB0Zi5zY2FsYXIoJ3Rlc3QnKS50b1N0cmluZyh2ZXJib3NlKTtcbiAgICBleHBlY3Qoc3RyKS50b0VxdWFsKFxuICAgICAgICAnVGVuc29yXFxuJyArXG4gICAgICAgICcgIGR0eXBlOiBzdHJpbmdcXG4nICtcbiAgICAgICAgJyAgcmFuazogMFxcbicgK1xuICAgICAgICAnICBzaGFwZTogW11cXG4nICtcbiAgICAgICAgJyAgdmFsdWVzOlxcbicgK1xuICAgICAgICAnICAgIHRlc3QnKTtcbiAgfSk7XG5cbiAgaXQoJ2Jvb2wgc2NhbGFyIHZlcmJvc2UnLCAoKSA9PiB7XG4gICAgY29uc3QgdmVyYm9zZSA9IHRydWU7XG4gICAgY29uc3Qgc3RyID0gdGYuc2NhbGFyKHRydWUpLnRvU3RyaW5nKHZlcmJvc2UpO1xuICAgIGV4cGVjdChzdHIpLnRvRXF1YWwoXG4gICAgICAgICdUZW5zb3JcXG4nICtcbiAgICAgICAgJyAgZHR5cGU6IGJvb2xcXG4nICtcbiAgICAgICAgJyAgcmFuazogMFxcbicgK1xuICAgICAgICAnICBzaGFwZTogW11cXG4nICtcbiAgICAgICAgJyAgdmFsdWVzOlxcbicgK1xuICAgICAgICAnICAgIHRydWUnKTtcbiAgfSk7XG5cbiAgaXQoJzFkIHRlbnNvciB2ZXJib3NlJywgKCkgPT4ge1xuICAgIGNvbnN0IHZlcmJvc2UgPSB0cnVlO1xuICAgIGNvbnN0IHN0ciA9IHRmLnplcm9zKFs0XSkudG9TdHJpbmcodmVyYm9zZSk7XG4gICAgZXhwZWN0KHN0cikudG9FcXVhbChcbiAgICAgICAgJ1RlbnNvclxcbicgK1xuICAgICAgICAnICBkdHlwZTogZmxvYXQzMlxcbicgK1xuICAgICAgICAnICByYW5rOiAxXFxuJyArXG4gICAgICAgICcgIHNoYXBlOiBbNF1cXG4nICtcbiAgICAgICAgJyAgdmFsdWVzOlxcbicgK1xuICAgICAgICAnICAgIFswLCAwLCAwLCAwXScpO1xuICB9KTtcblxuICBpdCgnMWQgc3RyaW5nIHRlbnNvciB2ZXJib3NlJywgKCkgPT4ge1xuICAgIGNvbnN0IHZlcmJvc2UgPSB0cnVlO1xuICAgIGNvbnN0IHN0ciA9IHRmLnRlbnNvcihbJ2EnLCAnYmInLCAnY2NjJ10pLnRvU3RyaW5nKHZlcmJvc2UpO1xuICAgIGV4cGVjdChzdHIpLnRvRXF1YWwoXG4gICAgICAgICdUZW5zb3JcXG4nICtcbiAgICAgICAgJyAgZHR5cGU6IHN0cmluZ1xcbicgK1xuICAgICAgICAnICByYW5rOiAxXFxuJyArXG4gICAgICAgICcgIHNoYXBlOiBbM11cXG4nICtcbiAgICAgICAgJyAgdmFsdWVzOlxcbicgK1xuICAgICAgICAnICAgIFtcXCdhXFwnLCBcXCdiYlxcJywgXFwnY2NjXFwnXScpO1xuICB9KTtcblxuICBpdCgnMWQgYm9vbCB0ZW5zb3IgdmVyYm9zZScsICgpID0+IHtcbiAgICBjb25zdCB2ZXJib3NlID0gdHJ1ZTtcbiAgICBjb25zdCBzdHIgPSB0Zi50ZW5zb3IoW3RydWUsIGZhbHNlLCB0cnVlXSkudG9TdHJpbmcodmVyYm9zZSk7XG4gICAgZXhwZWN0KHN0cikudG9FcXVhbChcbiAgICAgICAgJ1RlbnNvclxcbicgK1xuICAgICAgICAnICBkdHlwZTogYm9vbFxcbicgK1xuICAgICAgICAnICByYW5rOiAxXFxuJyArXG4gICAgICAgICcgIHNoYXBlOiBbM11cXG4nICtcbiAgICAgICAgJyAgdmFsdWVzOlxcbicgK1xuICAgICAgICAnICAgIFt0cnVlLCBmYWxzZSwgdHJ1ZV0nKTtcbiAgfSk7XG5cbiAgaXQoJzJkIHRlbnNvciB2ZXJib3NlJywgKCkgPT4ge1xuICAgIGNvbnN0IHZlcmJvc2UgPSB0cnVlO1xuICAgIGNvbnN0IHN0ciA9IHRmLnplcm9zKFszLCAzXSkudG9TdHJpbmcodmVyYm9zZSk7XG4gICAgZXhwZWN0KHN0cikudG9FcXVhbChcbiAgICAgICAgJ1RlbnNvclxcbicgK1xuICAgICAgICAnICBkdHlwZTogZmxvYXQzMlxcbicgK1xuICAgICAgICAnICByYW5rOiAyXFxuJyArXG4gICAgICAgICcgIHNoYXBlOiBbMywzXVxcbicgK1xuICAgICAgICAnICB2YWx1ZXM6XFxuJyArXG4gICAgICAgICcgICAgW1swLCAwLCAwXSxcXG4nICtcbiAgICAgICAgJyAgICAgWzAsIDAsIDBdLFxcbicgK1xuICAgICAgICAnICAgICBbMCwgMCwgMF1dJyk7XG4gIH0pO1xuXG4gIGl0KCcyZCBzdHJpbmcgdGVuc29yIHZlcmJvc2UnLCAoKSA9PiB7XG4gICAgY29uc3QgdmVyYm9zZSA9IHRydWU7XG4gICAgY29uc3QgdmFscyA9IFtcbiAgICAgIFsnYScsICdiYicsICdjY2MnXSxcbiAgICAgIFsnZCcsICdlJywgJ2YnXSxcbiAgICAgIFsnZycsICdoJywgJ2knXSxcbiAgICBdO1xuICAgIGNvbnN0IHN0ciA9IHRmLnRlbnNvcih2YWxzKS50b1N0cmluZyh2ZXJib3NlKTtcbiAgICBleHBlY3Qoc3RyKS50b0VxdWFsKFxuICAgICAgICAnVGVuc29yXFxuJyArXG4gICAgICAgICcgIGR0eXBlOiBzdHJpbmdcXG4nICtcbiAgICAgICAgJyAgcmFuazogMlxcbicgK1xuICAgICAgICAnICBzaGFwZTogWzMsM11cXG4nICtcbiAgICAgICAgJyAgdmFsdWVzOlxcbicgK1xuICAgICAgICAnICAgIFtbXFwnYVxcJywgXFwnYmJcXCcsIFxcJ2NjY1xcJ10sXFxuJyArXG4gICAgICAgICcgICAgIFtcXCdkXFwnLCBcXCdlXFwnICwgXFwnZlxcJyAgXSxcXG4nICtcbiAgICAgICAgJyAgICAgW1xcJ2dcXCcsIFxcJ2hcXCcgLCBcXCdpXFwnICBdXScpO1xuICB9KTtcblxuICBpdCgnMmQgYm9vbCB0ZW5zb3IgdmVyYm9zZScsICgpID0+IHtcbiAgICBjb25zdCB2ZXJib3NlID0gdHJ1ZTtcbiAgICBjb25zdCBzdHIgPSB0Zi56ZXJvcyhbMywgM10sICdib29sJykudG9TdHJpbmcodmVyYm9zZSk7XG4gICAgZXhwZWN0KHN0cikudG9FcXVhbChcbiAgICAgICAgJ1RlbnNvclxcbicgK1xuICAgICAgICAnICBkdHlwZTogYm9vbFxcbicgK1xuICAgICAgICAnICByYW5rOiAyXFxuJyArXG4gICAgICAgICcgIHNoYXBlOiBbMywzXVxcbicgK1xuICAgICAgICAnICB2YWx1ZXM6XFxuJyArXG4gICAgICAgICcgICAgW1tmYWxzZSwgZmFsc2UsIGZhbHNlXSxcXG4nICtcbiAgICAgICAgJyAgICAgW2ZhbHNlLCBmYWxzZSwgZmFsc2VdLFxcbicgK1xuICAgICAgICAnICAgICBbZmFsc2UsIGZhbHNlLCBmYWxzZV1dJyk7XG4gIH0pO1xuXG4gIGl0KCczZCB0ZW5zb3IgdmVyYm9zZScsICgpID0+IHtcbiAgICBjb25zdCB2ZXJib3NlID0gdHJ1ZTtcbiAgICBjb25zdCBzdHIgPSB0Zi56ZXJvcyhbMywgMywgMl0pLnRvU3RyaW5nKHZlcmJvc2UpO1xuICAgIGV4cGVjdChzdHIpLnRvRXF1YWwoXG4gICAgICAgICdUZW5zb3JcXG4nICtcbiAgICAgICAgJyAgZHR5cGU6IGZsb2F0MzJcXG4nICtcbiAgICAgICAgJyAgcmFuazogM1xcbicgK1xuICAgICAgICAnICBzaGFwZTogWzMsMywyXVxcbicgK1xuICAgICAgICAnICB2YWx1ZXM6XFxuJyArXG4gICAgICAgICcgICAgW1tbMCwgMF0sXFxuJyArXG4gICAgICAgICcgICAgICBbMCwgMF0sXFxuJyArXG4gICAgICAgICcgICAgICBbMCwgMF1dLFxcblxcbicgK1xuICAgICAgICAnICAgICBbWzAsIDBdLFxcbicgK1xuICAgICAgICAnICAgICAgWzAsIDBdLFxcbicgK1xuICAgICAgICAnICAgICAgWzAsIDBdXSxcXG5cXG4nICtcbiAgICAgICAgJyAgICAgW1swLCAwXSxcXG4nICtcbiAgICAgICAgJyAgICAgIFswLCAwXSxcXG4nICtcbiAgICAgICAgJyAgICAgIFswLCAwXV1dJyk7XG4gIH0pO1xuXG4gIGl0KCczZCBzdHJpbmcgdGVuc29yIHZlcmJvc2UnLCAoKSA9PiB7XG4gICAgY29uc3QgdmVyYm9zZSA9IHRydWU7XG4gICAgY29uc3QgdmFscyA9IFtcbiAgICAgIFtbJ2EnLCAnYmInXSwgWydjY2MnLCAnZGRkZCddXSxcbiAgICAgIFtbJ2UnLCAnZmYnXSwgWydnZ2cnLCAnaGhoaCddXSxcbiAgICAgIFtbJ2knLCAnamonXSwgWydra2snLCAnbGxsbCddXSxcbiAgICBdO1xuICAgIGNvbnN0IHN0ciA9IHRmLnRlbnNvcih2YWxzKS50b1N0cmluZyh2ZXJib3NlKTtcbiAgICBleHBlY3Qoc3RyKS50b0VxdWFsKFxuICAgICAgICAnVGVuc29yXFxuJyArXG4gICAgICAgICcgIGR0eXBlOiBzdHJpbmdcXG4nICtcbiAgICAgICAgJyAgcmFuazogM1xcbicgK1xuICAgICAgICAnICBzaGFwZTogWzMsMiwyXVxcbicgK1xuICAgICAgICAnICB2YWx1ZXM6XFxuJyArXG4gICAgICAgICcgICAgW1tbXFwnYVxcJyAgLCBcXCdiYlxcJyAgXSxcXG4nICtcbiAgICAgICAgJyAgICAgIFtcXCdjY2NcXCcsIFxcJ2RkZGRcXCddXSxcXG5cXG4nICtcbiAgICAgICAgJyAgICAgW1tcXCdlXFwnICAsIFxcJ2ZmXFwnICBdLFxcbicgK1xuICAgICAgICAnICAgICAgW1xcJ2dnZ1xcJywgXFwnaGhoaFxcJ11dLFxcblxcbicgK1xuICAgICAgICAnICAgICBbW1xcJ2lcXCcgICwgXFwnampcXCcgIF0sXFxuJyArXG4gICAgICAgICcgICAgICBbXFwna2trXFwnLCBcXCdsbGxsXFwnXV1dJyk7XG4gIH0pO1xuXG4gIGl0KCczZCBib29sIHRlbnNvciB2ZXJib3NlJywgKCkgPT4ge1xuICAgIGNvbnN0IHZlcmJvc2UgPSB0cnVlO1xuICAgIGNvbnN0IHN0ciA9IHRmLm9uZXMoWzMsIDMsIDJdLCAnYm9vbCcpLnRvU3RyaW5nKHZlcmJvc2UpO1xuICAgIGV4cGVjdChzdHIpLnRvRXF1YWwoXG4gICAgICAgICdUZW5zb3JcXG4nICtcbiAgICAgICAgJyAgZHR5cGU6IGJvb2xcXG4nICtcbiAgICAgICAgJyAgcmFuazogM1xcbicgK1xuICAgICAgICAnICBzaGFwZTogWzMsMywyXVxcbicgK1xuICAgICAgICAnICB2YWx1ZXM6XFxuJyArXG4gICAgICAgICcgICAgW1tbdHJ1ZSwgdHJ1ZV0sXFxuJyArXG4gICAgICAgICcgICAgICBbdHJ1ZSwgdHJ1ZV0sXFxuJyArXG4gICAgICAgICcgICAgICBbdHJ1ZSwgdHJ1ZV1dLFxcblxcbicgK1xuICAgICAgICAnICAgICBbW3RydWUsIHRydWVdLFxcbicgK1xuICAgICAgICAnICAgICAgW3RydWUsIHRydWVdLFxcbicgK1xuICAgICAgICAnICAgICAgW3RydWUsIHRydWVdXSxcXG5cXG4nICtcbiAgICAgICAgJyAgICAgW1t0cnVlLCB0cnVlXSxcXG4nICtcbiAgICAgICAgJyAgICAgIFt0cnVlLCB0cnVlXSxcXG4nICtcbiAgICAgICAgJyAgICAgIFt0cnVlLCB0cnVlXV1dJyk7XG4gIH0pO1xuXG4gIGl0KCcxZCBsb25nIHRlbnNvciB2ZXJib3NlJywgKCkgPT4ge1xuICAgIGNvbnN0IHZlcmJvc2UgPSB0cnVlO1xuICAgIGNvbnN0IHN0ciA9IHRmLnplcm9zKFsxMDBdKS50b1N0cmluZyh2ZXJib3NlKTtcbiAgICBleHBlY3Qoc3RyKS50b0VxdWFsKFxuICAgICAgICAnVGVuc29yXFxuJyArXG4gICAgICAgICcgIGR0eXBlOiBmbG9hdDMyXFxuJyArXG4gICAgICAgICcgIHJhbms6IDFcXG4nICtcbiAgICAgICAgJyAgc2hhcGU6IFsxMDBdXFxuJyArXG4gICAgICAgICcgIHZhbHVlczpcXG4nICtcbiAgICAgICAgJyAgICBbMCwgMCwgMCwgLi4uLCAwLCAwLCAwXScpO1xuICB9KTtcblxuICBpdCgnMWQgbG9uZyBzdHJpbmcgdGVuc29yIHZlcmJvc2UnLCAoKSA9PiB7XG4gICAgY29uc3QgdmVyYm9zZSA9IHRydWU7XG4gICAgY29uc3Qgc3RyID0gdGYuZmlsbChbMTAwXSwgJ2hpJykudG9TdHJpbmcodmVyYm9zZSk7XG4gICAgZXhwZWN0KHN0cikudG9FcXVhbChcbiAgICAgICAgJ1RlbnNvclxcbicgK1xuICAgICAgICAnICBkdHlwZTogc3RyaW5nXFxuJyArXG4gICAgICAgICcgIHJhbms6IDFcXG4nICtcbiAgICAgICAgJyAgc2hhcGU6IFsxMDBdXFxuJyArXG4gICAgICAgICcgIHZhbHVlczpcXG4nICtcbiAgICAgICAgJyAgICBbXFwnaGlcXCcsIFxcJ2hpXFwnLCBcXCdoaVxcJywgLi4uLCBcXCdoaVxcJywgXFwnaGlcXCcsIFxcJ2hpXFwnXScpO1xuICB9KTtcblxuICBpdCgnMmQgbG9uZyB0ZW5zb3IgdmVyYm9zZScsICgpID0+IHtcbiAgICBjb25zdCB2ZXJib3NlID0gdHJ1ZTtcbiAgICBjb25zdCBzdHIgPSB0Zi56ZXJvcyhbMTAwLCAxMDBdKS50b1N0cmluZyh2ZXJib3NlKTtcbiAgICBleHBlY3Qoc3RyKS50b0VxdWFsKFxuICAgICAgICAnVGVuc29yXFxuJyArXG4gICAgICAgICcgIGR0eXBlOiBmbG9hdDMyXFxuJyArXG4gICAgICAgICcgIHJhbms6IDJcXG4nICtcbiAgICAgICAgJyAgc2hhcGU6IFsxMDAsMTAwXVxcbicgK1xuICAgICAgICAnICB2YWx1ZXM6XFxuJyArXG4gICAgICAgICcgICAgW1swLCAwLCAwLCAuLi4sIDAsIDAsIDBdLFxcbicgK1xuICAgICAgICAnICAgICBbMCwgMCwgMCwgLi4uLCAwLCAwLCAwXSxcXG4nICtcbiAgICAgICAgJyAgICAgWzAsIDAsIDAsIC4uLiwgMCwgMCwgMF0sXFxuJyArXG4gICAgICAgICcgICAgIC4uLixcXG4nICtcbiAgICAgICAgJyAgICAgWzAsIDAsIDAsIC4uLiwgMCwgMCwgMF0sXFxuJyArXG4gICAgICAgICcgICAgIFswLCAwLCAwLCAuLi4sIDAsIDAsIDBdLFxcbicgK1xuICAgICAgICAnICAgICBbMCwgMCwgMCwgLi4uLCAwLCAwLCAwXV0nKTtcbiAgfSk7XG5cbiAgaXQoJzJkIGxvbmcgc3RyaW5nIHRlbnNvciB2ZXJib3NlJywgKCkgPT4ge1xuICAgIGNvbnN0IHZlcmJvc2UgPSB0cnVlO1xuICAgIGNvbnN0IHN0ciA9IHRmLmZpbGwoWzEwMCwgMTAwXSwgJ2EnKS50b1N0cmluZyh2ZXJib3NlKTtcbiAgICBleHBlY3Qoc3RyKS50b0VxdWFsKFxuICAgICAgICAnVGVuc29yXFxuJyArXG4gICAgICAgICcgIGR0eXBlOiBzdHJpbmdcXG4nICtcbiAgICAgICAgJyAgcmFuazogMlxcbicgK1xuICAgICAgICAnICBzaGFwZTogWzEwMCwxMDBdXFxuJyArXG4gICAgICAgICcgIHZhbHVlczpcXG4nICtcbiAgICAgICAgJyAgICBbW1xcJ2FcXCcsIFxcJ2FcXCcsIFxcJ2FcXCcsIC4uLiwgXFwnYVxcJywgXFwnYVxcJywgXFwnYVxcJ10sXFxuJyArXG4gICAgICAgICcgICAgIFtcXCdhXFwnLCBcXCdhXFwnLCBcXCdhXFwnLCAuLi4sIFxcJ2FcXCcsIFxcJ2FcXCcsIFxcJ2FcXCddLFxcbicgK1xuICAgICAgICAnICAgICBbXFwnYVxcJywgXFwnYVxcJywgXFwnYVxcJywgLi4uLCBcXCdhXFwnLCBcXCdhXFwnLCBcXCdhXFwnXSxcXG4nICtcbiAgICAgICAgJyAgICAgLi4uLFxcbicgK1xuICAgICAgICAnICAgICBbXFwnYVxcJywgXFwnYVxcJywgXFwnYVxcJywgLi4uLCBcXCdhXFwnLCBcXCdhXFwnLCBcXCdhXFwnXSxcXG4nICtcbiAgICAgICAgJyAgICAgW1xcJ2FcXCcsIFxcJ2FcXCcsIFxcJ2FcXCcsIC4uLiwgXFwnYVxcJywgXFwnYVxcJywgXFwnYVxcJ10sXFxuJyArXG4gICAgICAgICcgICAgIFtcXCdhXFwnLCBcXCdhXFwnLCBcXCdhXFwnLCAuLi4sIFxcJ2FcXCcsIFxcJ2FcXCcsIFxcJ2FcXCddXScpO1xuICB9KTtcblxuICBpdCgnMmQgd2l0aCBwYWRkaW5nIHRvIGFsaWduIGNvbHVtbnMgdmVyYm9zZScsICgpID0+IHtcbiAgICBjb25zdCB2ZXJib3NlID0gdHJ1ZTtcbiAgICBjb25zdCBzdHIgPSB0Zi50ZW5zb3IoW1xuICAgICAgICAgICAgICAgICAgICBbMC44NTk3NzEyLCAzLCAwLjI3NDA3ODldLCBbMC42Njk2MTMyLCAwLjQ4MjU5NjIsIDIuNzVdLFxuICAgICAgICAgICAgICAgICAgICBbMS45OTEsIDAuMDY0MDg2NSwgMC4yOTgzODU4XVxuICAgICAgICAgICAgICAgICAgXSkudG9TdHJpbmcodmVyYm9zZSk7XG4gICAgZXhwZWN0KHN0cikudG9FcXVhbChcbiAgICAgICAgJ1RlbnNvclxcbicgK1xuICAgICAgICAnICBkdHlwZTogZmxvYXQzMlxcbicgK1xuICAgICAgICAnICByYW5rOiAyXFxuJyArXG4gICAgICAgICcgIHNoYXBlOiBbMywzXVxcbicgK1xuICAgICAgICAnICB2YWx1ZXM6XFxuJyArXG4gICAgICAgICcgICAgW1swLjg1OTc3MTIsIDMgICAgICAgICwgMC4yNzQwNzg5XSxcXG4nICtcbiAgICAgICAgJyAgICAgWzAuNjY5NjEzMiwgMC40ODI1OTYyLCAyLjc1ICAgICBdLFxcbicgK1xuICAgICAgICAnICAgICBbMS45OTEwMDAxLCAwLjA2NDA4NjUsIDAuMjk4Mzg1OF1dJyk7XG4gIH0pO1xuXG4gIGl0KCcyZCBzdHJpbmcgdGVuc29yIHdpdGggcGFkZGluZyB2ZXJib3NlJywgKCkgPT4ge1xuICAgIGNvbnN0IHZlcmJvc2UgPSB0cnVlO1xuICAgIGNvbnN0IHN0ciA9IHRmLnRlbnNvcihbXG4gICAgICAgICAgICAgICAgICAgIFsnYWJjZGVmJywgJ2EnLCAnYWJjZGVmJ10sXG4gICAgICAgICAgICAgICAgICAgIFsnYWJjZGVmJywgJ2FiY2RlZicsICdhYmMnXSxcbiAgICAgICAgICAgICAgICAgICAgWydhYmNkJywgJ2FiY2RlZicsICdhYmNkZWYnXSxcbiAgICAgICAgICAgICAgICAgIF0pLnRvU3RyaW5nKHZlcmJvc2UpO1xuICAgIGV4cGVjdChzdHIpLnRvRXF1YWwoXG4gICAgICAgICdUZW5zb3JcXG4nICtcbiAgICAgICAgJyAgZHR5cGU6IHN0cmluZ1xcbicgK1xuICAgICAgICAnICByYW5rOiAyXFxuJyArXG4gICAgICAgICcgIHNoYXBlOiBbMywzXVxcbicgK1xuICAgICAgICAnICB2YWx1ZXM6XFxuJyArXG4gICAgICAgICcgICAgW1tcXCdhYmNkZWZcXCcsIFxcJ2FcXCcgICAgICwgXFwnYWJjZGVmXFwnXSxcXG4nICtcbiAgICAgICAgJyAgICAgW1xcJ2FiY2RlZlxcJywgXFwnYWJjZGVmXFwnLCBcXCdhYmNcXCcgICBdLFxcbicgK1xuICAgICAgICAnICAgICBbXFwnYWJjZFxcJyAgLCBcXCdhYmNkZWZcXCcsIFxcJ2FiY2RlZlxcJ11dJyk7XG4gIH0pO1xuXG4gIGl0KCdzY2FsYXInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RyID0gdGYuc2NhbGFyKDUpLnRvU3RyaW5nKCk7XG4gICAgZXhwZWN0KHN0cikudG9FcXVhbChcbiAgICAgICAgJ1RlbnNvclxcbicgK1xuICAgICAgICAnICAgIDUnKTtcbiAgfSk7XG5cbiAgaXQoJ3NjYWxhciBzdHJpbmcnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RyID0gdGYuc2NhbGFyKCdoZWxsbycpLnRvU3RyaW5nKCk7XG4gICAgZXhwZWN0KHN0cikudG9FcXVhbChcbiAgICAgICAgJ1RlbnNvclxcbicgK1xuICAgICAgICAnICAgIGhlbGxvJyk7XG4gIH0pO1xuXG4gIGl0KCcxZCB0ZW5zb3InLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RyID0gdGYuemVyb3MoWzRdKS50b1N0cmluZygpO1xuICAgIGV4cGVjdChzdHIpLnRvRXF1YWwoXG4gICAgICAgICdUZW5zb3JcXG4nICtcbiAgICAgICAgJyAgICBbMCwgMCwgMCwgMF0nKTtcbiAgfSk7XG5cbiAgaXQoJzJkIHRlbnNvcicsICgpID0+IHtcbiAgICBjb25zdCBzdHIgPSB0Zi56ZXJvcyhbMywgM10pLnRvU3RyaW5nKCk7XG4gICAgZXhwZWN0KHN0cikudG9FcXVhbChcbiAgICAgICAgJ1RlbnNvclxcbicgK1xuICAgICAgICAnICAgIFtbMCwgMCwgMF0sXFxuJyArXG4gICAgICAgICcgICAgIFswLCAwLCAwXSxcXG4nICtcbiAgICAgICAgJyAgICAgWzAsIDAsIDBdXScpO1xuICB9KTtcblxuICBpdCgnM2QgdGVuc29yJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0ciA9IHRmLnplcm9zKFszLCAzLCAyXSkudG9TdHJpbmcoKTtcbiAgICBleHBlY3Qoc3RyKS50b0VxdWFsKFxuICAgICAgICAnVGVuc29yXFxuJyArXG4gICAgICAgICcgICAgW1tbMCwgMF0sXFxuJyArXG4gICAgICAgICcgICAgICBbMCwgMF0sXFxuJyArXG4gICAgICAgICcgICAgICBbMCwgMF1dLFxcblxcbicgK1xuICAgICAgICAnICAgICBbWzAsIDBdLFxcbicgK1xuICAgICAgICAnICAgICAgWzAsIDBdLFxcbicgK1xuICAgICAgICAnICAgICAgWzAsIDBdXSxcXG5cXG4nICtcbiAgICAgICAgJyAgICAgW1swLCAwXSxcXG4nICtcbiAgICAgICAgJyAgICAgIFswLCAwXSxcXG4nICtcbiAgICAgICAgJyAgICAgIFswLCAwXV1dJyk7XG4gIH0pO1xuXG4gIGl0KCcxZCBsb25nIHRlbnNvcicsICgpID0+IHtcbiAgICBjb25zdCBzdHIgPSB0Zi56ZXJvcyhbMTAwXSkudG9TdHJpbmcoKTtcbiAgICBleHBlY3Qoc3RyKS50b0VxdWFsKFxuICAgICAgICAnVGVuc29yXFxuJyArXG4gICAgICAgICcgICAgWzAsIDAsIDAsIC4uLiwgMCwgMCwgMF0nKTtcbiAgfSk7XG5cbiAgaXQoJzJkIGxvbmcgdGVuc29yJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0ciA9IHRmLnplcm9zKFsxMDAsIDEwMF0pLnRvU3RyaW5nKCk7XG4gICAgZXhwZWN0KHN0cikudG9FcXVhbChcbiAgICAgICAgJ1RlbnNvclxcbicgK1xuICAgICAgICAnICAgIFtbMCwgMCwgMCwgLi4uLCAwLCAwLCAwXSxcXG4nICtcbiAgICAgICAgJyAgICAgWzAsIDAsIDAsIC4uLiwgMCwgMCwgMF0sXFxuJyArXG4gICAgICAgICcgICAgIFswLCAwLCAwLCAuLi4sIDAsIDAsIDBdLFxcbicgK1xuICAgICAgICAnICAgICAuLi4sXFxuJyArXG4gICAgICAgICcgICAgIFswLCAwLCAwLCAuLi4sIDAsIDAsIDBdLFxcbicgK1xuICAgICAgICAnICAgICBbMCwgMCwgMCwgLi4uLCAwLCAwLCAwXSxcXG4nICtcbiAgICAgICAgJyAgICAgWzAsIDAsIDAsIC4uLiwgMCwgMCwgMF1dJyk7XG4gIH0pO1xuXG4gIGl0KCcyZCB3aXRoIHBhZGRpbmcgdG8gYWxpZ24gY29sdW1ucycsICgpID0+IHtcbiAgICBjb25zdCBzdHIgPSB0Zi50ZW5zb3IoW1xuICAgICAgICAgICAgICAgICAgICBbMC44NTk3NzEyLCAzLCAwLjI3NDA3ODldLCBbMC42Njk2MTMyLCAwLjQ4MjU5NjIsIDIuNzVdLFxuICAgICAgICAgICAgICAgICAgICBbMS45OTEsIDAuMDY0MDg2NSwgMC4yOTgzODU4XVxuICAgICAgICAgICAgICAgICAgXSkudG9TdHJpbmcoKTtcbiAgICBleHBlY3Qoc3RyKS50b0VxdWFsKFxuICAgICAgICAnVGVuc29yXFxuJyArXG4gICAgICAgICcgICAgW1swLjg1OTc3MTIsIDMgICAgICAgICwgMC4yNzQwNzg5XSxcXG4nICtcbiAgICAgICAgJyAgICAgWzAuNjY5NjEzMiwgMC40ODI1OTYyLCAyLjc1ICAgICBdLFxcbicgK1xuICAgICAgICAnICAgICBbMS45OTEwMDAxLCAwLjA2NDA4NjUsIDAuMjk4Mzg1OF1dJyk7XG4gIH0pO1xuXG4gIGl0KCdzY2FsYXIgY29tcGxleDY0IHZlcmJvc2UnLCAoKSA9PiB7XG4gICAgY29uc3QgdmVyYm9zZSA9IHRydWU7XG4gICAgY29uc3Qgc3RyID0gdGYuY29tcGxleCg1LCA2KS50b1N0cmluZyh2ZXJib3NlKTtcbiAgICBleHBlY3Qoc3RyKS50b0VxdWFsKFxuICAgICAgICAnVGVuc29yXFxuJyArXG4gICAgICAgICcgIGR0eXBlOiBjb21wbGV4NjRcXG4nICtcbiAgICAgICAgJyAgcmFuazogMFxcbicgK1xuICAgICAgICAnICBzaGFwZTogW11cXG4nICtcbiAgICAgICAgJyAgdmFsdWVzOlxcbicgK1xuICAgICAgICAnICAgIDUgKyA2aicpO1xuICB9KTtcblxuICBpdCgnMWQgY29tcGxleDY0IHRlbnNvciB2ZXJib3NlJywgKCkgPT4ge1xuICAgIGNvbnN0IHZlcmJvc2UgPSB0cnVlO1xuICAgIGNvbnN0IHN0ciA9IHRmLmNvbXBsZXgoWzMsIDVdLCBbNCwgNl0pLnRvU3RyaW5nKHZlcmJvc2UpO1xuICAgIGV4cGVjdChzdHIpLnRvRXF1YWwoXG4gICAgICAgICdUZW5zb3JcXG4nICtcbiAgICAgICAgJyAgZHR5cGU6IGNvbXBsZXg2NFxcbicgK1xuICAgICAgICAnICByYW5rOiAxXFxuJyArXG4gICAgICAgICcgIHNoYXBlOiBbMl1cXG4nICtcbiAgICAgICAgJyAgdmFsdWVzOlxcbicgK1xuICAgICAgICAnICAgIFszICsgNGosIDUgKyA2al0nKTtcbiAgfSk7XG5cbiAgaXQoJzJkIGNvbXBsZXg2NCB0ZW5zb3IgdmVyYm9zZScsICgpID0+IHtcbiAgICBjb25zdCB2ZXJib3NlID0gdHJ1ZTtcbiAgICBjb25zdCBzdHIgPSB0Zi5jb21wbGV4KHRmLmxpbnNwYWNlKDAsIDgsIDkpLCB0Zi5saW5zcGFjZSg4LCAwLCA5KSlcbiAgICAgICAgICAgICAgICAgICAgLnJlc2hhcGUoWzMsIDNdKVxuICAgICAgICAgICAgICAgICAgICAudG9TdHJpbmcodmVyYm9zZSk7XG4gICAgZXhwZWN0KHN0cikudG9FcXVhbChcbiAgICAgICAgJ1RlbnNvclxcbicgK1xuICAgICAgICAnICBkdHlwZTogY29tcGxleDY0XFxuJyArXG4gICAgICAgICcgIHJhbms6IDJcXG4nICtcbiAgICAgICAgJyAgc2hhcGU6IFszLDNdXFxuJyArXG4gICAgICAgICcgIHZhbHVlczpcXG4nICtcbiAgICAgICAgJyAgICBbWzAgKyA4aiwgMSArIDdqLCAyICsgNmpdLFxcbicgK1xuICAgICAgICAnICAgICBbMyArIDVqLCA0ICsgNGosIDUgKyAzal0sXFxuJyArXG4gICAgICAgICcgICAgIFs2ICsgMmosIDcgKyAxaiwgOCArIDBqXV0nKTtcbiAgfSk7XG5cbiAgaXQoJzNkIGNvbXBsZXg2NCB0ZW5zb3IgdmVyYm9zZScsICgpID0+IHtcbiAgICBjb25zdCB2ZXJib3NlID0gdHJ1ZTtcbiAgICBjb25zdCBzdHIgPSB0Zi5jb21wbGV4KHRmLmxpbnNwYWNlKDAsIDE3LCAxOCksIHRmLmxpbnNwYWNlKDE3LCAwLCAxOCkpXG4gICAgICAgICAgICAgICAgICAgIC5yZXNoYXBlKFszLCAzLCAyXSlcbiAgICAgICAgICAgICAgICAgICAgLnRvU3RyaW5nKHZlcmJvc2UpO1xuICAgIGV4cGVjdChzdHIpLnRvRXF1YWwoXG4gICAgICAgICdUZW5zb3JcXG4nICtcbiAgICAgICAgJyAgZHR5cGU6IGNvbXBsZXg2NFxcbicgK1xuICAgICAgICAnICByYW5rOiAzXFxuJyArXG4gICAgICAgICcgIHNoYXBlOiBbMywzLDJdXFxuJyArXG4gICAgICAgICcgIHZhbHVlczpcXG4nICtcbiAgICAgICAgJyAgICBbW1swICsgMTdqLCAxICsgMTZqXSxcXG4nICtcbiAgICAgICAgJyAgICAgIFsyICsgMTVqLCAzICsgMTRqXSxcXG4nICtcbiAgICAgICAgJyAgICAgIFs0ICsgMTNqLCA1ICsgMTJqXV0sXFxuXFxuJyArXG4gICAgICAgICcgICAgIFtbNiArIDExaiwgNyArIDEwal0sXFxuJyArXG4gICAgICAgICcgICAgICBbOCArIDlqICwgOSArIDhqIF0sXFxuJyArXG4gICAgICAgICcgICAgICBbMTAgKyA3aiwgMTEgKyA2al1dLFxcblxcbicgK1xuICAgICAgICAnICAgICBbWzEyICsgNWosIDEzICsgNGpdLFxcbicgK1xuICAgICAgICAnICAgICAgWzE0ICsgM2osIDE1ICsgMmpdLFxcbicgK1xuICAgICAgICAnICAgICAgWzE2ICsgMWosIDE3ICsgMGpdXV0nKTtcbiAgfSk7XG5cbiAgaXQoJzFkIGxvbmcgY29tcGxleDY0IHRlbnNvciB2ZXJib3NlJywgKCkgPT4ge1xuICAgIGNvbnN0IHZlcmJvc2UgPSB0cnVlO1xuICAgIGNvbnN0IHN0ciA9IHRmLmNvbXBsZXgodGYubGluc3BhY2UoMCwgOTksIDEwMCksIHRmLmxpbnNwYWNlKDk5LCAwLCAxMDApKVxuICAgICAgICAgICAgICAgICAgICAudG9TdHJpbmcodmVyYm9zZSk7XG4gICAgZXhwZWN0KHN0cikudG9FcXVhbChcbiAgICAgICAgJ1RlbnNvclxcbicgK1xuICAgICAgICAnICBkdHlwZTogY29tcGxleDY0XFxuJyArXG4gICAgICAgICcgIHJhbms6IDFcXG4nICtcbiAgICAgICAgJyAgc2hhcGU6IFsxMDBdXFxuJyArXG4gICAgICAgICcgIHZhbHVlczpcXG4nICtcbiAgICAgICAgJyAgICBbMCArIDk5aiwgMSArIDk4aiwgMiArIDk3aiwgLi4uLCA5NyArIDJqLCA5OCArIDFqLCA5OSArIDBqXScpO1xuICB9KTtcblxuICBpdCgnMmQgbG9uZyBjb21wbGV4NjQgdGVuc29yIHZlcmJvc2UnLCAoKSA9PiB7XG4gICAgY29uc3QgdmVyYm9zZSA9IHRydWU7XG5cbiAgICBjb25zdCBkaW0gPSAxMDA7XG4gICAgY29uc3Qgc3RyID0gdGYuY29tcGxleChcbiAgICAgICAgICAgICAgICAgICAgICB0Zi5saW5zcGFjZSgwLCBkaW0gKiBkaW0gLSAxLCBkaW0gKiBkaW0pLFxuICAgICAgICAgICAgICAgICAgICAgIHRmLmxpbnNwYWNlKGRpbSAqIGRpbSAtIDEsIDAsIGRpbSAqIGRpbSkpXG4gICAgICAgICAgICAgICAgICAgIC5yZXNoYXBlKFtkaW0sIGRpbV0pXG4gICAgICAgICAgICAgICAgICAgIC50b1N0cmluZyh2ZXJib3NlKTtcblxuICAgIGV4cGVjdChzdHIpLnRvRXF1YWwoXG4gICAgICAgICdUZW5zb3JcXG4nICtcbiAgICAgICAgJyAgZHR5cGU6IGNvbXBsZXg2NFxcbicgK1xuICAgICAgICAnICByYW5rOiAyXFxuJyArXG4gICAgICAgICcgIHNoYXBlOiBbMTAwLDEwMF1cXG4nICtcbiAgICAgICAgJyAgdmFsdWVzOlxcbicgK1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgJyAgICBbWzAgKyA5OTk5aiAgICwgMSArIDk5OThqICAgLCAyICsgOTk5N2ogICAsIC4uLiwgOTcgKyA5OTAyaiAgLCA5OCArIDk5MDFqICAsIDk5ICsgOTkwMGogIF0sXFxuJyArXG4gICAgICAgICcgICAgIFsxMDAgKyA5ODk5aiAsIDEwMSArIDk4OThqICwgMTAyICsgOTg5N2ogLCAuLi4sIDE5NyArIDk4MDJqICwgMTk4ICsgOTgwMWogLCAxOTkgKyA5ODAwaiBdLFxcbicgK1xuICAgICAgICAnICAgICBbMjAwICsgOTc5OWogLCAyMDEgKyA5Nzk4aiAsIDIwMiArIDk3OTdqICwgLi4uLCAyOTcgKyA5NzAyaiAsIDI5OCArIDk3MDFqICwgMjk5ICsgOTcwMGogXSxcXG4nICtcbiAgICAgICAgJyAgICAgLi4uLFxcbicgK1xuICAgICAgICAnICAgICBbOTcwMCArIDI5OWogLCA5NzAxICsgMjk4aiAsIDk3MDIgKyAyOTdqICwgLi4uLCA5Nzk3ICsgMjAyaiAsIDk3OTggKyAyMDFqICwgOTc5OSArIDIwMGogXSxcXG4nICtcbiAgICAgICAgJyAgICAgWzk4MDAgKyAxOTlqICwgOTgwMSArIDE5OGogLCA5ODAyICsgMTk3aiAsIC4uLiwgOTg5NyArIDEwMmogLCA5ODk4ICsgMTAxaiAsIDk4OTkgKyAxMDBqIF0sXFxuJyArXG4gICAgICAgICcgICAgIFs5OTAwICsgOTlqICAsIDk5MDEgKyA5OGogICwgOTkwMiArIDk3aiAgLCAuLi4sIDk5OTcgKyAyaiAgICwgOTk5OCArIDFqICAgLCA5OTk5ICsgMGogICBdXScpO1xuICAgIC8vIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoXG4gIH0pO1xuXG4gIGl0KCcyZCBjb21wbGV4NjQgd2l0aCBwYWRkaW5nIHRvIGFsaWduIGNvbHVtbnMgdmVyYm9zZScsICgpID0+IHtcbiAgICBjb25zdCB2ZXJib3NlID0gdHJ1ZTtcblxuICAgIGNvbnN0IHN0ciA9IHRmLmNvbXBsZXgoXG4gICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgWzAuODU5NzcxMiwgMywgMC4yNzQwNzg5XSwgWzAuNjY5NjEzMiwgMC40ODI1OTYyLCAyLjc1XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFsxLjk5MSwgMC4wNjQwODY1LCAwLjI5ODM4NThdXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICBbWzEsIDEuMDEwMjMzMiwgM10sIFsyLCA1LCAyLjM0NDI0XSwgWzEuMjMsIDIsIDAuMTIzXV0pXG4gICAgICAgICAgICAgICAgICAgIC50b1N0cmluZyh2ZXJib3NlKTtcbiAgICBleHBlY3Qoc3RyKS50b0VxdWFsKFxuICAgICAgICAnVGVuc29yXFxuJyArXG4gICAgICAgICcgIGR0eXBlOiBjb21wbGV4NjRcXG4nICtcbiAgICAgICAgJyAgcmFuazogMlxcbicgK1xuICAgICAgICAnICBzaGFwZTogWzMsM11cXG4nICtcbiAgICAgICAgJyAgdmFsdWVzOlxcbicgK1xuICAgICAgICAnICAgIFtbMC44NTk3NzEyICsgMWogICAsIDMgKyAxLjAxMDIzMzJqLCAwLjI3NDA3ODkgKyAzaiAgICBdLFxcbicgK1xuICAgICAgICAnICAgICBbMC42Njk2MTMyICsgMmogICAsIDAuNDgyNTk2MiArIDVqLCAyLjc1ICsgMi4zNDQyNGogICBdLFxcbicgK1xuICAgICAgICAnICAgICBbMS45OTEwMDAxICsgMS4yM2osIDAuMDY0MDg2NSArIDJqLCAwLjI5ODM4NTggKyAwLjEyM2pdXScpO1xuICB9KTtcblxuICBpdCgnc2NhbGFyIGNvbXBsZXg2NCcsICgpID0+IHtcbiAgICBjb25zdCBzdHIgPSB0Zi5jb21wbGV4KDUsIDQpLnRvU3RyaW5nKCk7XG4gICAgZXhwZWN0KHN0cikudG9FcXVhbChcbiAgICAgICAgJ1RlbnNvclxcbicgK1xuICAgICAgICAnICAgIDUgKyA0aicpO1xuICB9KTtcblxuICBpdCgnMWQgY29tcGxleDY0IHRlbnNvcicsICgpID0+IHtcbiAgICBjb25zdCBzdHIgPVxuICAgICAgICB0Zi5jb21wbGV4KHRmLmxpbnNwYWNlKDAsIDMsIDQpLCB0Zi5saW5zcGFjZSgzLCAwLCA0KSkudG9TdHJpbmcoKTtcbiAgICBleHBlY3Qoc3RyKS50b0VxdWFsKFxuICAgICAgICAnVGVuc29yXFxuJyArXG4gICAgICAgICcgICAgWzAgKyAzaiwgMSArIDJqLCAyICsgMWosIDMgKyAwal0nKTtcbiAgfSk7XG5cbiAgaXQoJzJkIGNvbXBsZXg2NCB0ZW5zb3InLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RyID0gdGYuY29tcGxleCh0Zi5saW5zcGFjZSgwLCA4LCA5KSwgdGYubGluc3BhY2UoOCwgMCwgOSkpXG4gICAgICAgICAgICAgICAgICAgIC5yZXNoYXBlKFszLCAzXSlcbiAgICAgICAgICAgICAgICAgICAgLnRvU3RyaW5nKCk7XG4gICAgZXhwZWN0KHN0cikudG9FcXVhbChcbiAgICAgICAgJ1RlbnNvclxcbicgK1xuICAgICAgICAnICAgIFtbMCArIDhqLCAxICsgN2osIDIgKyA2al0sXFxuJyArXG4gICAgICAgICcgICAgIFszICsgNWosIDQgKyA0aiwgNSArIDNqXSxcXG4nICtcbiAgICAgICAgJyAgICAgWzYgKyAyaiwgNyArIDFqLCA4ICsgMGpdXScpO1xuICB9KTtcblxuICBpdCgnM2QgY29tcGxleDY0IHRlbnNvcicsICgpID0+IHtcbiAgICBjb25zdCBzdHIgPSB0Zi5jb21wbGV4KHRmLmxpbnNwYWNlKDAsIDE3LCAxOCksIHRmLmxpbnNwYWNlKDE3LCAwLCAxOCkpXG4gICAgICAgICAgICAgICAgICAgIC5yZXNoYXBlKFszLCAzLCAyXSlcbiAgICAgICAgICAgICAgICAgICAgLnRvU3RyaW5nKCk7XG5cbiAgICBleHBlY3Qoc3RyKS50b0VxdWFsKFxuICAgICAgICAnVGVuc29yXFxuJyArXG4gICAgICAgICcgICAgW1tbMCArIDE3aiwgMSArIDE2al0sXFxuJyArXG4gICAgICAgICcgICAgICBbMiArIDE1aiwgMyArIDE0al0sXFxuJyArXG4gICAgICAgICcgICAgICBbNCArIDEzaiwgNSArIDEyal1dLFxcblxcbicgK1xuICAgICAgICAnICAgICBbWzYgKyAxMWosIDcgKyAxMGpdLFxcbicgK1xuICAgICAgICAnICAgICAgWzggKyA5aiAsIDkgKyA4aiBdLFxcbicgK1xuICAgICAgICAnICAgICAgWzEwICsgN2osIDExICsgNmpdXSxcXG5cXG4nICtcbiAgICAgICAgJyAgICAgW1sxMiArIDVqLCAxMyArIDRqXSxcXG4nICtcbiAgICAgICAgJyAgICAgIFsxNCArIDNqLCAxNSArIDJqXSxcXG4nICtcbiAgICAgICAgJyAgICAgIFsxNiArIDFqLCAxNyArIDBqXV1dJyk7XG4gIH0pO1xuXG4gIGl0KCcxZCBsb25nIGNvbXBsZXg2NCB0ZW5zb3InLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RyID1cbiAgICAgICAgdGYuY29tcGxleCh0Zi5saW5zcGFjZSgwLCA5OSwgMTAwKSwgdGYubGluc3BhY2UoOTksIDAsIDEwMCkpLnRvU3RyaW5nKCk7XG5cbiAgICBleHBlY3Qoc3RyKS50b0VxdWFsKFxuICAgICAgICAnVGVuc29yXFxuJyArXG4gICAgICAgICcgICAgWzAgKyA5OWosIDEgKyA5OGosIDIgKyA5N2osIC4uLiwgOTcgKyAyaiwgOTggKyAxaiwgOTkgKyAwal0nKTtcbiAgfSk7XG5cbiAgaXQoJzJkIGxvbmcgY29tcGxleDY0IHRlbnNvcicsICgpID0+IHtcbiAgICBjb25zdCBkaW0gPSAxMDA7XG4gICAgY29uc3Qgc3RyID0gdGYuY29tcGxleChcbiAgICAgICAgICAgICAgICAgICAgICB0Zi5saW5zcGFjZSgwLCBkaW0gKiBkaW0gLSAxLCBkaW0gKiBkaW0pLFxuICAgICAgICAgICAgICAgICAgICAgIHRmLmxpbnNwYWNlKGRpbSAqIGRpbSAtIDEsIDAsIGRpbSAqIGRpbSkpXG4gICAgICAgICAgICAgICAgICAgIC5yZXNoYXBlKFtkaW0sIGRpbV0pXG4gICAgICAgICAgICAgICAgICAgIC50b1N0cmluZygpO1xuXG4gICAgZXhwZWN0KHN0cikudG9FcXVhbChcbiAgICAgICAgJ1RlbnNvclxcbicgK1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgJyAgICBbWzAgKyA5OTk5aiAgICwgMSArIDk5OThqICAgLCAyICsgOTk5N2ogICAsIC4uLiwgOTcgKyA5OTAyaiAgLCA5OCArIDk5MDFqICAsIDk5ICsgOTkwMGogIF0sXFxuJyArXG4gICAgICAgICcgICAgIFsxMDAgKyA5ODk5aiAsIDEwMSArIDk4OThqICwgMTAyICsgOTg5N2ogLCAuLi4sIDE5NyArIDk4MDJqICwgMTk4ICsgOTgwMWogLCAxOTkgKyA5ODAwaiBdLFxcbicgK1xuICAgICAgICAnICAgICBbMjAwICsgOTc5OWogLCAyMDEgKyA5Nzk4aiAsIDIwMiArIDk3OTdqICwgLi4uLCAyOTcgKyA5NzAyaiAsIDI5OCArIDk3MDFqICwgMjk5ICsgOTcwMGogXSxcXG4nICtcbiAgICAgICAgJyAgICAgLi4uLFxcbicgK1xuICAgICAgICAnICAgICBbOTcwMCArIDI5OWogLCA5NzAxICsgMjk4aiAsIDk3MDIgKyAyOTdqICwgLi4uLCA5Nzk3ICsgMjAyaiAsIDk3OTggKyAyMDFqICwgOTc5OSArIDIwMGogXSxcXG4nICtcbiAgICAgICAgJyAgICAgWzk4MDAgKyAxOTlqICwgOTgwMSArIDE5OGogLCA5ODAyICsgMTk3aiAsIC4uLiwgOTg5NyArIDEwMmogLCA5ODk4ICsgMTAxaiAsIDk4OTkgKyAxMDBqIF0sXFxuJyArXG4gICAgICAgICcgICAgIFs5OTAwICsgOTlqICAsIDk5MDEgKyA5OGogICwgOTkwMiArIDk3aiAgLCAuLi4sIDk5OTcgKyAyaiAgICwgOTk5OCArIDFqICAgLCA5OTk5ICsgMGogICBdXScpO1xuICAgIC8vIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoXG4gIH0pO1xuXG4gIGl0KCcyZCBjb21wbGV4NjQgd2l0aCBwYWRkaW5nIHRvIGFsaWduIGNvbHVtbnMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RyID0gdGYuY29tcGxleChcbiAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICBbMC44NTk3NzEyLCAzLCAwLjI3NDA3ODldLCBbMC42Njk2MTMyLCAwLjQ4MjU5NjIsIDIuNzVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgWzEuOTkxLCAwLjA2NDA4NjUsIDAuMjk4Mzg1OF1cbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIFtbMSwgMS4wMTAyMzMyLCAzXSwgWzIsIDUsIDIuMzQ0MjRdLCBbMS4yMywgMiwgMC4xMjNdXSlcbiAgICAgICAgICAgICAgICAgICAgLnRvU3RyaW5nKCk7XG4gICAgZXhwZWN0KHN0cikudG9FcXVhbChcbiAgICAgICAgJ1RlbnNvclxcbicgK1xuICAgICAgICAnICAgIFtbMC44NTk3NzEyICsgMWogICAsIDMgKyAxLjAxMDIzMzJqLCAwLjI3NDA3ODkgKyAzaiAgICBdLFxcbicgK1xuICAgICAgICAnICAgICBbMC42Njk2MTMyICsgMmogICAsIDAuNDgyNTk2MiArIDVqLCAyLjc1ICsgMi4zNDQyNGogICBdLFxcbicgK1xuICAgICAgICAnICAgICBbMS45OTEwMDAxICsgMS4yM2osIDAuMDY0MDg2NSArIDJqLCAwLjI5ODM4NTggKyAwLjEyM2pdXScpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZVdpdGhGbGFncygndGVuc29yIGdyYWQnLCBBTExfRU5WUywgKCkgPT4ge1xuICBpdCgnZ3JhZCB3aXRoIHNlY29uZCBkZXJpdmF0aXZlJywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIGYoeCkgPSB4IF4gM1xuICAgIGNvbnN0IGYgPSAoeDogVGVuc29yKSA9PiB4LnBvdyh0Zi5zY2FsYXIoMywgJ2ludDMyJykpO1xuICAgIC8vIGYnKHgpID0gM3ggXiAyXG4gICAgY29uc3QgZyA9IHRmLmdyYWQoZik7XG4gICAgLy8gZicnKHgpID0gNnhcbiAgICBjb25zdCBnZyA9IHRmLmdyYWQoZyk7XG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjFkKFsyLCAzXSk7XG4gICAgY29uc3QgZGF0YSA9IGdnKHgpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRhdGEuZGF0YSgpLCBbMTIsIDE4XSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCd0ZW5zb3IuZGF0YScsIEFMTF9FTlZTLCAoKSA9PiB7XG4gIGl0KCdpbnRlcmxlYXZpbmcgLmRhdGEoKSBhbmQgLmRhdGFTeW5jKCknLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzXSk7XG4gICAgY29uc3QgYiA9IHRmLnRlbnNvcjFkKFs0LCA1LCA2XSk7XG5cbiAgICBjb25zdCByYSA9IGEuc3F1YXJlKCk7XG4gICAgY29uc3QgcmIgPSBiLnNxdWFyZSgpO1xuXG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYS5kYXRhKCksIFsxLCAyLCAzXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYi5kYXRhKCksIFs0LCA1LCA2XSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmIuZGF0YSgpLCBbMTYsIDI1LCAzNl0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJhLmRhdGEoKSwgWzEsIDQsIDldKTtcbiAgfSk7XG5cbiAgaXQoJy5kYXRhKCkgcG9zdHBvbmVzIGRpc3Bvc2FsIG9mIHRlbnNvcicsIGRvbmUgPT4ge1xuICAgIGV4cGVjdCh0Zi5tZW1vcnkoKS5udW1UZW5zb3JzKS50b0JlKDApO1xuICAgIHRmLnRpZHkoKCkgPT4ge1xuICAgICAgY29uc3QgYSA9IHRmLnNjYWxhcig1KTtcbiAgICAgIGV4cGVjdCh0Zi5tZW1vcnkoKS5udW1UZW5zb3JzKS50b0JlKDEpO1xuICAgICAgYS5zcXVhcmUoKTsgIC8vIFVwbG9hZHMgaXQgb24gR1BVLlxuICAgICAgYS5kYXRhKCkudGhlbih2YWxzID0+IHtcbiAgICAgICAgLy8gVGhlIHRpZHkgYWJvdmUgc2hvdWxkIG5vdCBkaXNwb3NlIHRoZSBzY2FsYXIgc2luY2UgdGhlcmUgaXNcbiAgICAgICAgLy8gYSBwZW5kaW5nIGRhdGEgcmVhZC5cbiAgICAgICAgZXhwZWN0TnVtYmVyc0Nsb3NlKHZhbHNbMF0sIDUpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyB0aWR5IGVuZHMgaW1tZWRpYXRlbHksIGJ1dCBzaG91bGQgbm90IGRpc3Bvc2UgdGhlIHNjYWxhci5cblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gdGlkeSBzaG91bGQgZGlzcG9zZSB0aGUgdGVuc29yLlxuICAgICAgZXhwZWN0KHRmLm1lbW9yeSgpLm51bVRlbnNvcnMpLnRvQmUoMCk7XG4gICAgICBkb25lKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdjYWxsaW5nIC5kYXRhKCkgdHdpY2Ugd29ya3MgKDIgc3Vic2NyaWJlcnMgdG8gYSBzaW5nbGUgcmVhZCknLCBkb25lID0+IHtcbiAgICB0Zi50aWR5KCgpID0+IHtcbiAgICAgIGNvbnN0IGEgPSB0Zi5zY2FsYXIoNSk7XG4gICAgICBhLnNxdWFyZSgpOyAgLy8gVXBsb2FkcyBpdCBvbiBHUFUuXG4gICAgICBhLmRhdGEoKS50aGVuKHZhbHMgPT4ge1xuICAgICAgICBleHBlY3ROdW1iZXJzQ2xvc2UodmFsc1swXSwgNSk7XG4gICAgICB9KTtcbiAgICAgIGEuZGF0YSgpXG4gICAgICAgICAgLnRoZW4odmFscyA9PiB7XG4gICAgICAgICAgICBleHBlY3ROdW1iZXJzQ2xvc2UodmFsc1swXSwgNSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAudGhlbihkb25lKTtcbiAgICB9KTtcbiAgICAvLyB0aWR5IGVuZHMgaW1tZWRpYXRlbHksIGJ1dCBzaG91bGQgbm90IGRpc3Bvc2UgdGhlIHNjYWxhciBzaW5jZSB0aGVyZSBpc1xuICAgIC8vIGEgcGVuZGluZyBkYXRhIHJlYWQuXG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCd4IGluc3RhbmNlb2YgVGVuc29yJywgQUxMX0VOVlMsICgpID0+IHtcbiAgaXQoJ3g6IFRlbnNvcicsICgpID0+IHtcbiAgICBjb25zdCB0ID0gdGYuc2NhbGFyKDEpO1xuICAgIGV4cGVjdCh0IGluc3RhbmNlb2YgVGVuc29yKS50b0JlKHRydWUpO1xuICB9KTtcblxuICBpdCgneDogb3RoZXIgb2JqZWN0LCBmYWlscycsICgpID0+IHtcbiAgICBjb25zdCB0ID0ge3NvbWV0aGluZzogJ2Vsc2UnfTtcbiAgICBleHBlY3QodCBpbnN0YW5jZW9mIFRlbnNvcikudG9CZShmYWxzZSk7XG4gIH0pO1xuXG4gIGl0KCd4OiB1bmRlZmluZWQgb3IgbnVsbCwgZmFpbHMnLCAoKSA9PiB7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgIGV4cGVjdCgodW5kZWZpbmVkIGFzIGFueSkgaW5zdGFuY2VvZiBUZW5zb3IpLnRvQmUoZmFsc2UpO1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICBleHBlY3QoKG51bGwgYXMgYW55KSBpbnN0YW5jZW9mIFRlbnNvcikudG9CZShmYWxzZSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCd0ZW5zb3Igd2l0aCAwIGluIHNoYXBlJywgQUxMX0VOVlMsICgpID0+IHtcbiAgaXQoJzFkIG9mIHNoYXBlIFswXScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoW10pO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGEucmFuaykudG9CZSgxKTtcbiAgICBleHBlY3QoYS5zaGFwZSkudG9FcXVhbChbMF0pO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCBbXSk7XG4gIH0pO1xuXG4gIGl0KCcxZCBzdHJpbmcgdGVuc29yIG9mIHNoYXBlIFswXScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoW10sICdzdHJpbmcnKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnc3RyaW5nJyk7XG4gICAgZXhwZWN0KGEucmFuaykudG9CZSgxKTtcbiAgICBleHBlY3QoYS5zaGFwZSkudG9FcXVhbChbMF0pO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCBbXSk7XG4gIH0pO1xuXG4gIGl0KCcyZCBvZiBzaGFwZSBbMCwgNV0nLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKFtdLCBbMCwgNV0pO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGEucmFuaykudG9CZSgyKTtcbiAgICBleHBlY3QoYS5zaGFwZSkudG9FcXVhbChbMCwgNV0pO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGEuZGF0YSgpLCBbXSk7XG4gIH0pO1xuXG4gIGl0KCcyZCBzdHJpbmcgdGVuc29yIG9mIHNoYXBlIFswLCA1XScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoW10sIFswLCA1XSwgJ3N0cmluZycpO1xuICAgIGV4cGVjdChhLmR0eXBlKS50b0JlKCdzdHJpbmcnKTtcbiAgICBleHBlY3QoYS5yYW5rKS50b0JlKDIpO1xuICAgIGV4cGVjdChhLnNoYXBlKS50b0VxdWFsKFswLCA1XSk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgYS5kYXRhKCksIFtdKTtcbiAgfSk7XG5cbiAgaXQoJzJkIHRocm93cyB3aGVuIHZhbHVlcyBhcmUgbm90IGVtcHR5JywgKCkgPT4ge1xuICAgIGNvbnN0IHZhbHVlcyA9IFsxLCAyLCAzLCA0XTtcbiAgICBleHBlY3QoKCkgPT4gdGYudGVuc29yMmQodmFsdWVzLCBbMCwgNV0sICdmbG9hdDMyJykpXG4gICAgICAgIC50b1Rocm93RXJyb3IoXG4gICAgICAgICAgICAnQmFzZWQgb24gdGhlIHByb3ZpZGVkIHNoYXBlLCBbMCw1XSwgdGhlICcgK1xuICAgICAgICAgICAgJ3RlbnNvciBzaG91bGQgaGF2ZSAwIHZhbHVlcyBidXQgaGFzIDQnKTtcbiAgfSk7XG5cbiAgaXQoJzNkIG9mIHNoYXBlIFswLCAzLCAwXScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yM2QoW10sIFswLCAzLCAwXSk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3QoYS5yYW5rKS50b0JlKDMpO1xuICAgIGV4cGVjdChhLnNoYXBlKS50b0VxdWFsKFswLCAzLCAwXSk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgYS5kYXRhKCksIFtdKTtcbiAgfSk7XG5cbiAgaXQoJzNkIHRocm93cyB3aGVuIHZhbHVlcyBhcmUgbm90IGVtcHR5JywgKCkgPT4ge1xuICAgIGNvbnN0IHZhbHVlcyA9IFsxLCAyLCAzXTtcbiAgICBleHBlY3QoKCkgPT4gdGYudGVuc29yM2QodmFsdWVzLCBbMCwgMywgMF0sICdmbG9hdDMyJykpXG4gICAgICAgIC50b1Rocm93RXJyb3IoXG4gICAgICAgICAgICAnQmFzZWQgb24gdGhlIHByb3ZpZGVkIHNoYXBlLCBbMCwzLDBdLCB0aGUgJyArXG4gICAgICAgICAgICAndGVuc29yIHNob3VsZCBoYXZlIDAgdmFsdWVzIGJ1dCBoYXMgMycpO1xuICB9KTtcblxuICBpdCgnNGQgb2Ygc2hhcGUgWzEsIDMsIDAsIDVdJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3I0ZChbXSwgWzEsIDMsIDAsIDVdKTtcbiAgICBleHBlY3QoYS5kdHlwZSkudG9CZSgnZmxvYXQzMicpO1xuICAgIGV4cGVjdChhLnJhbmspLnRvQmUoNCk7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzEsIDMsIDAsIDVdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgW10pO1xuICB9KTtcblxuICBpdCgnNGQgdGhyb3dzIHdoZW4gdmFsdWVzIGFyZSBub3QgZW1wdHknLCAoKSA9PiB7XG4gICAgY29uc3QgdmFsdWVzID0gWzEsIDIsIDNdO1xuICAgIGV4cGVjdCgoKSA9PiB0Zi50ZW5zb3I0ZCh2YWx1ZXMsIFsxLCAzLCAwLCA1XSwgJ2Zsb2F0MzInKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcihcbiAgICAgICAgICAgICdCYXNlZCBvbiB0aGUgcHJvdmlkZWQgc2hhcGUsIFsxLDMsMCw1XSwgdGhlICcgK1xuICAgICAgICAgICAgJ3RlbnNvciBzaG91bGQgaGF2ZSAwIHZhbHVlcyBidXQgaGFzIDMnKTtcbiAgfSk7XG5cbiAgaXQoJ2NvbXBsZXg2NCB3aXRoIDAgaW4gc2hhcGUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYXJlYWwgPSB0Zi50ZW5zb3IyZChbXSwgWzAsIDVdKTtcbiAgICBjb25zdCBicmVhbCA9IHRmLnRlbnNvcjJkKFtdLCBbMCwgNV0pO1xuICAgIGNvbnN0IGEgPSB0Zi5jb21wbGV4KGFyZWFsLCBicmVhbCk7XG4gICAgZXhwZWN0KGEuZHR5cGUpLnRvQmUoJ2NvbXBsZXg2NCcpO1xuICAgIGV4cGVjdChhLnJhbmspLnRvQmUoMik7XG4gICAgZXhwZWN0KGEuc2hhcGUpLnRvRXF1YWwoWzAsIDVdKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBhLmRhdGEoKSwgW10pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZVdpdGhGbGFncygndGVuc29yLmJ5dGVzKCknLCBBTExfRU5WUywgKCkgPT4ge1xuICAvKiogSGVscGVyIG1ldGhvZCB0byBnZXQgdGhlIGJ5dGVzIGZyb20gYSB0eXBlZCBhcnJheS4gKi9cbiAgZnVuY3Rpb24gZ2V0Qnl0ZXMoYTogVHlwZWRBcnJheSk6IFVpbnQ4QXJyYXkge1xuICAgIHJldHVybiBuZXcgVWludDhBcnJheShhLmJ1ZmZlcik7XG4gIH1cblxuICBpdCgnZmxvYXQzMiB0ZW5zb3InLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcihbMS4xLCAzLjIsIDddLCBbM10sICdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGF3YWl0IGEuYnl0ZXMoKSkudG9FcXVhbChnZXRCeXRlcyhuZXcgRmxvYXQzMkFycmF5KFsxLjEsIDMuMiwgN10pKSk7XG4gIH0pO1xuXG4gIGl0KCdpbnQzMiB0ZW5zb3InLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcihbMS4xLCAzLjIsIDddLCBbM10sICdpbnQzMicpO1xuICAgIGV4cGVjdChhd2FpdCBhLmJ5dGVzKCkpLnRvRXF1YWwoZ2V0Qnl0ZXMobmV3IEludDMyQXJyYXkoWzEsIDMsIDddKSkpO1xuICB9KTtcblxuICBpdCgnYm9vbCB0ZW5zb3InLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcihbdHJ1ZSwgdHJ1ZSwgZmFsc2VdLCBbM10sICdib29sJyk7XG4gICAgZXhwZWN0KGF3YWl0IGEuYnl0ZXMoKSkudG9FcXVhbChuZXcgVWludDhBcnJheShbMSwgMSwgMF0pKTtcbiAgfSk7XG5cbiAgaXQoJ3N0cmluZyB0ZW5zb3IgZnJvbSBuYXRpdmUgc3RyaW5ncycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yKFsnaGVsbG8nLCAnd29ybGQnXSwgWzJdLCAnc3RyaW5nJyk7XG4gICAgZXhwZWN0KGF3YWl0IGEuYnl0ZXMoKSkudG9FcXVhbChbXG4gICAgICBlbmNvZGVTdHJpbmcoJ2hlbGxvJyksIGVuY29kZVN0cmluZygnd29ybGQnKVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnc3RyaW5nIHRlbnNvciBmcm9tIGVuY29kZWQgYnl0ZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcihcbiAgICAgICAgW2VuY29kZVN0cmluZygnaGVsbG8nKSwgZW5jb2RlU3RyaW5nKCd3b3JsZCcpXSwgWzJdLCAnc3RyaW5nJyk7XG4gICAgZXhwZWN0KGF3YWl0IGEuYnl0ZXMoKSkudG9FcXVhbChbXG4gICAgICBlbmNvZGVTdHJpbmcoJ2hlbGxvJyksIGVuY29kZVN0cmluZygnd29ybGQnKVxuICAgIF0pO1xuICB9KTtcbn0pO1xuIl19