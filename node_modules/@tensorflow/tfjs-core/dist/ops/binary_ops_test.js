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
import { expectArraysClose, expectArraysEqual } from '../test_util';
describeWithFlags('prelu', ALL_ENVS, () => {
    it('basic', async () => {
        const x = tf.tensor1d([0, 1, -2, -4]);
        const a = tf.tensor1d([0.15, 0.2, 0.25, 0.15]);
        const result = tf.prelu(x, a);
        expect(result.shape).toEqual(x.shape);
        expectArraysClose(await result.data(), [0, 1, -0.5, -0.6]);
    });
    it('basic TensorLike', async () => {
        const x = [0, 1, -2, -4];
        const a = [0.15, 0.2, 0.25, 0.15];
        const result = tf.prelu(x, a);
        expect(result.shape).toEqual([4]);
        expectArraysClose(await result.data(), [0, 1, -0.5, -0.6]);
    });
    it('basic TensorLike chained', async () => {
        const x = tf.tensor1d([0, 1, -2, -4]);
        const a = [0.15, 0.2, 0.25, 0.15];
        const result = x.prelu(a);
        expect(result.shape).toEqual(x.shape);
        expectArraysClose(await result.data(), [0, 1, -0.5, -0.6]);
    });
    it('basic int32', async () => {
        const x = tf.tensor1d([0, 1, -2, -4], 'int32');
        const a = [0.15, 0.2, 0.25, 0.15];
        const result = tf.prelu(x, a);
        expect(result.shape).toEqual([4]);
        expect(result.dtype).toEqual('float32');
        expectArraysClose(await result.data(), [0, 1, -0.5, -0.6]);
    });
    it('derivative', async () => {
        const x = tf.tensor1d([0.5, 3, -0.1, -4]);
        const a = tf.tensor1d([0.2, 0.4, 0.25, 0.15]);
        const dy = tf.tensor1d([1, 1, 1, 1]);
        const dx = tf.grad(x => tf.prelu(x, a))(x, dy);
        expect(dx.shape).toEqual(x.shape);
        expect(dx.dtype).toEqual('float32');
        expectArraysClose(await dx.data(), [1, 1, 0.25, 0.15]);
    });
    it('gradient with clones', async () => {
        const x = tf.tensor1d([0.5, 3, -0.1, -4]);
        const a = tf.tensor1d([0.2, 0.4, 0.25, 0.15]);
        const dx = tf.grad(x => tf.prelu(x.clone(), a).clone())(x);
        expect(dx.shape).toEqual(x.shape);
        expect(dx.dtype).toEqual('float32');
        expectArraysClose(await dx.data(), [1, 1, 0.25, 0.15]);
    });
    it('derivative where alpha got broadcasted', async () => {
        const x = tf.tensor2d([[0.5, 3, -0.1, -4]]);
        const a = tf.tensor2d([[0.2]]);
        const dy = tf.tensor2d([[1, 1, 1, 1]]);
        const da = tf.grad(a => tf.prelu(x, a))(a, dy);
        expect(da.shape).toEqual(a.shape);
        expectArraysClose(await da.data(), [-4.1]);
    });
    it('throws when passed x as a non-tensor', () => {
        expect(() => tf.prelu({}, tf.scalar(1)))
            .toThrowError(/Argument 'x' passed to 'prelu' must be a Tensor/);
    });
    it('throws when passed alpha as a non-tensor', () => {
        expect(() => tf.prelu(tf.scalar(1), {}))
            .toThrowError(/Argument 'alpha' passed to 'prelu' must be a Tensor/);
    });
    it('throws for string tensor', () => {
        expect(() => tf.prelu(['a'], 0.1))
            .toThrowError(/Argument 'x' passed to 'prelu' must be numeric tensor/);
    });
});
describeWithFlags('maximum', ALL_ENVS, () => {
    it('float32 and float32', async () => {
        const a = tf.tensor1d([0.5, 3, -0.1, -4]);
        const b = tf.tensor1d([0.2, 0.4, 0.25, 0.15]);
        const result = tf.maximum(a, b);
        expect(result.shape).toEqual(a.shape);
        expectArraysClose(await result.data(), [0.5, 3, 0.25, 0.15]);
    });
    it('TensorLike', async () => {
        const a = [0.5, 3, -0.1, -4];
        const b = [0.2, 0.4, 0.25, 0.15];
        const result = tf.maximum(a, b);
        expect(result.shape).toEqual([4]);
        expectArraysClose(await result.data(), [0.5, 3, 0.25, 0.15]);
    });
    it('TensorLike chained', async () => {
        const a = tf.tensor1d([0.5, 3, -0.1, -4]);
        const b = [0.2, 0.4, 0.25, 0.15];
        const result = a.maximum(b);
        expect(result.shape).toEqual([4]);
        expectArraysClose(await result.data(), [0.5, 3, 0.25, 0.15]);
    });
    it('int32 and int32', async () => {
        const a = tf.tensor1d([1, 5, 2, 3], 'int32');
        const b = tf.tensor1d([2, 3, 1, 4], 'int32');
        const result = tf.maximum(a, b);
        expect(result.shape).toEqual(a.shape);
        expect(result.dtype).toBe('int32');
        expectArraysEqual(await result.data(), [2, 5, 2, 4]);
    });
    it('bool and bool', async () => {
        const a = tf.tensor1d([true, false, false, true], 'bool');
        const b = tf.tensor1d([false, false, true, true], 'bool');
        const result = tf.maximum(a, b);
        expect(result.shape).toEqual(a.shape);
        expect(result.dtype).toBe('int32');
        expectArraysEqual(await result.data(), [1, 0, 1, 1]);
    });
    it('upcasts when dtypes dont match', async () => {
        const a = tf.tensor1d([1, 0, 0, 1], 'float32');
        const b = tf.tensor1d([0, 0, 1, 1], 'int32');
        const res = tf.maximum(a, b);
        expect(res.shape).toEqual(a.shape);
        expect(res.dtype).toBe('float32');
        expectArraysEqual(await res.data(), [1, 0, 1, 1]);
    });
    it('propagates NaN', async () => {
        const a = tf.tensor1d([0.5, -0.1, NaN]);
        const b = tf.tensor1d([0.2, 0.3, 0.25]);
        const result = tf.maximum(a, b);
        expect(result.shape).toEqual(a.shape);
        expectArraysClose(await result.data(), [0.5, 0.3, NaN]);
    });
    it('broadcasts Tensor1D and scalar', async () => {
        const a = tf.tensor1d([0.5, 3, -0.1, -4]);
        const b = tf.scalar(0.6);
        const result = tf.maximum(a, b);
        expect(result.shape).toEqual(a.shape);
        expectArraysClose(await result.data(), [0.6, 3, 0.6, 0.6]);
    });
    it('broadcasts scalar and Tensor1D', async () => {
        const a = tf.scalar(0.6);
        const b = tf.tensor1d([0.5, 3, -0.1, -4]);
        const result = tf.maximum(a, b);
        expect(result.shape).toEqual(b.shape);
        expectArraysClose(await result.data(), [0.6, 3, 0.6, 0.6]);
    });
    it('broadcasts Tensor1D and Tensor2D', async () => {
        const a = tf.tensor1d([0.5, 0.3]);
        const b = tf.tensor2d([0.2, 0.4, 0.6, 0.15], [2, 2]);
        const result = tf.maximum(a, b);
        expect(result.shape).toEqual(b.shape);
        expectArraysClose(await result.data(), [0.5, 0.4, 0.6, 0.3]);
    });
    it('broadcasts 2x1 Tensor2D and 2x2 Tensor2D', async () => {
        const a = tf.tensor2d([0.5, 0.3], [2, 1]);
        const b = tf.tensor2d([0.2, 0.4, 0.6, 0.15], [2, 2]);
        const result = tf.maximum(a, b);
        expect(result.shape).toEqual(b.shape);
        expectArraysClose(await result.data(), [0.5, 0.5, 0.6, 0.3]);
    });
    it('gradients: Scalar', async () => {
        const a = tf.scalar(5.2);
        const b = tf.scalar(0.6);
        const dy = tf.scalar(3);
        const grads = tf.grads((a, b) => tf.maximum(a, b));
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(db.shape).toEqual(b.shape);
        expect(da.dtype).toEqual('float32');
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [3 * 1]);
        expectArraysClose(await db.data(), [3 * 0]);
    });
    it('gradient with clones', async () => {
        const a = tf.scalar(5.2);
        const b = tf.scalar(0.6);
        const dy = tf.scalar(3);
        const grads = tf.grads((a, b) => tf.maximum(a.clone(), b.clone()).clone());
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(db.shape).toEqual(b.shape);
        expect(da.dtype).toEqual('float32');
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [3 * 1]);
        expectArraysClose(await db.data(), [3 * 0]);
    });
    it('gradients: Tensor1D', async () => {
        const a = tf.tensor1d([1.1, 2.6, 3, 5.9]);
        const b = tf.tensor1d([1.0, 2.7, 3, 5.8]);
        const dy = tf.tensor1d([1, 2, 3, 4]);
        const grads = tf.grads((a, b) => tf.maximum(a, b));
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(db.shape).toEqual(b.shape);
        expect(da.dtype).toEqual('float32');
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [1 * 1, 2 * 0, 3 * 1, 4 * 1]);
        expectArraysClose(await db.data(), [1 * 0, 2 * 1, 3 * 0, 4 * 0]);
    });
    it('gradients: Tensor2D', async () => {
        const a = tf.tensor2d([0.5, 0.3, 0.7, 0.9], [2, 2]);
        const b = tf.tensor2d([0.2, 0.4, 0.7, 0.15], [2, 2]);
        const dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        const grads = tf.grads((a, b) => tf.maximum(a, b));
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(db.shape).toEqual(b.shape);
        expect(da.dtype).toEqual('float32');
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [1 * 1, 2 * 0, 3 * 1, 4 * 1]);
        expectArraysClose(await db.data(), [1 * 0, 2 * 1, 3 * 0, 4 * 0]);
    });
    it('throws when passed a as a non-tensor', () => {
        expect(() => tf.maximum({}, tf.scalar(1)))
            .toThrowError(/Argument 'a' passed to 'maximum' must be a Tensor/);
    });
    it('throws when passed b as a non-tensor', () => {
        expect(() => tf.maximum(tf.scalar(1), {}))
            .toThrowError(/Argument 'b' passed to 'maximum' must be a Tensor/);
    });
    it('accepts a tensor-like object', async () => {
        const a = [[0.5, 3], [-0.1, -4]];
        const b = [[0.2, 0.4], [0.25, 0.15]];
        const result = tf.maximum(a, b);
        expect(result.shape).toEqual([2, 2]);
        expectArraysClose(await result.data(), [0.5, 3, 0.25, 0.15]);
    });
    it('throws for string tensor', () => {
        expect(() => tf.maximum('q', 3))
            .toThrowError(/Argument 'a' passed to 'maximum' must be numeric tensor/);
        expect(() => tf.maximum(3, 'q'))
            .toThrowError(/Argument 'b' passed to 'maximum' must be numeric tensor/);
    });
});
describeWithFlags('squaredDifference', ALL_ENVS, () => {
    it('float32 and float32', async () => {
        const a = tf.tensor1d([0.5, 3, -0.1, -4]);
        const b = tf.tensor1d([0.2, 0.4, 0.25, 0.15]);
        const result = tf.squaredDifference(a, b);
        expect(result.shape).toEqual(a.shape);
        expectArraysClose(await result.data(), [
            Math.pow(0.5 - 0.2, 2), Math.pow(3 - 0.4, 2), Math.pow(-0.1 - 0.25, 2),
            Math.pow(-4 - 0.15, 2)
        ]);
    });
    it('TensorLike', async () => {
        const a = [0.5, 3, -0.1, -4];
        const b = [0.2, 0.4, 0.25, 0.15];
        const result = tf.squaredDifference(a, b);
        expect(result.shape).toEqual([4]);
        expectArraysClose(await result.data(), [
            Math.pow(0.5 - 0.2, 2), Math.pow(3 - 0.4, 2), Math.pow(-0.1 - 0.25, 2),
            Math.pow(-4 - 0.15, 2)
        ]);
    });
    it('TensorLike chained', async () => {
        const a = tf.tensor1d([0.5, 3, -0.1, -4]);
        const b = [0.2, 0.4, 0.25, 0.15];
        const result = a.squaredDifference(b);
        expect(result.shape).toEqual(a.shape);
        expectArraysClose(await result.data(), [
            Math.pow(0.5 - 0.2, 2), Math.pow(3 - 0.4, 2), Math.pow(-0.1 - 0.25, 2),
            Math.pow(-4 - 0.15, 2)
        ]);
    });
    it('int32 and int32', async () => {
        const a = tf.tensor1d([1, 5, 2, 3], 'int32');
        const b = tf.tensor1d([2, 3, 1, 4], 'int32');
        const result = tf.squaredDifference(a, b);
        expect(result.shape).toEqual(a.shape);
        expect(result.dtype).toBe('int32');
        expectArraysEqual(await result.data(), [
            Math.pow(1 - 2, 2), Math.pow(5 - 3, 2), Math.pow(2 - 1, 2),
            Math.pow(3 - 4, 2)
        ]);
    });
    it('upcasts when dtypes dont match', async () => {
        let res = tf.squaredDifference(tf.scalar(5, 'int32'), tf.scalar(2, 'float32'));
        expect(res.dtype).toBe('float32');
        expectArraysClose(await res.data(), [9]);
        res = tf.squaredDifference(tf.scalar(5, 'int32'), tf.scalar(true, 'bool'));
        expect(res.dtype).toBe('int32');
        expectArraysClose(await res.data(), [16]);
        res = tf.squaredDifference(tf.scalar(5, 'int32'), tf.scalar(false, 'bool'));
        expect(res.dtype).toBe('int32');
        expectArraysClose(await res.data(), [25]);
    });
    it('propagates NaN', async () => {
        const a = tf.tensor1d([0.5, -0.1, NaN]);
        const b = tf.tensor1d([0.2, 0.3, 0.25]);
        const result = tf.squaredDifference(a, b);
        expect(result.shape).toEqual(a.shape);
        expectArraysClose(await result.data(), [Math.pow(0.5 - 0.2, 2), Math.pow(-0.1 - 0.3, 2), NaN]);
    });
    it('broadcasts Tensor1D and scalar', async () => {
        const a = tf.tensor1d([0.5, 3, -0.1, -4]);
        const b = tf.scalar(0.6);
        const result = tf.squaredDifference(a, b);
        expect(result.shape).toEqual(a.shape);
        expectArraysClose(await result.data(), [
            Math.pow(0.5 - 0.6, 2), Math.pow(3 - 0.6, 2), Math.pow(-0.1 - 0.6, 2),
            Math.pow(-4 - 0.6, 2)
        ]);
    });
    it('broadcasts scalar and Tensor1D', async () => {
        const a = tf.scalar(0.6);
        const b = tf.tensor1d([0.5, 3, -0.1, -4]);
        const result = tf.squaredDifference(a, b);
        expect(result.shape).toEqual(b.shape);
        expectArraysClose(await result.data(), [
            Math.pow(0.6 - 0.5, 2), Math.pow(0.6 - 3, 2), Math.pow(0.6 - (-0.1), 2),
            Math.pow(0.6 - (-4), 2)
        ]);
    });
    it('broadcasts Tensor1D and Tensor2D', async () => {
        const a = tf.tensor1d([0.5, 0.3]);
        const b = tf.tensor2d([0.2, 0.4, 0.6, 0.15], [2, 2]);
        const result = tf.squaredDifference(a, b);
        expect(result.shape).toEqual(b.shape);
        expectArraysClose(await result.data(), [
            Math.pow(0.5 - 0.2, 2), Math.pow(0.3 - 0.4, 2), Math.pow(0.5 - 0.6, 2),
            Math.pow(0.3 - 0.15, 2)
        ]);
    });
    it('broadcasts 2x1 Tensor2D and 2x2 Tensor2D', async () => {
        const a = tf.tensor2d([0.5, 0.3], [2, 1]);
        const b = tf.tensor2d([0.2, 0.4, 0.6, 0.15], [2, 2]);
        const result = tf.squaredDifference(a, b);
        expect(result.shape).toEqual(b.shape);
        expectArraysClose(await result.data(), [
            Math.pow(0.5 - 0.2, 2), Math.pow(0.5 - 0.4, 2), Math.pow(0.3 - 0.6, 2),
            Math.pow(0.3 - 0.15, 2)
        ]);
    });
    it('gradients: Scalar', async () => {
        const a = tf.scalar(5.2);
        const b = tf.scalar(0.6);
        const dy = tf.scalar(3);
        const grads = tf.grads((a, b) => tf.squaredDifference(a, b));
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(db.shape).toEqual(b.shape);
        expect(da.dtype).toEqual('float32');
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [3 * 2 * (5.2 - 0.6)]);
        expectArraysClose(await db.data(), [3 * 2 * (0.6 - 5.2)]);
    });
    it('gradient with clones', async () => {
        const a = tf.scalar(5.2);
        const b = tf.scalar(0.6);
        const dy = tf.scalar(3);
        const grads = tf.grads((a, b) => tf.squaredDifference(a.clone(), b.clone()).clone());
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(db.shape).toEqual(b.shape);
        expect(da.dtype).toEqual('float32');
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [3 * 2 * (5.2 - 0.6)]);
        expectArraysClose(await db.data(), [3 * 2 * (0.6 - 5.2)]);
    });
    it('gradients: Tensor1D', async () => {
        const a = tf.tensor1d([1.1, 2.6, 3, 5.9]);
        const b = tf.tensor1d([1.0, 2.7, 3, 5.8]);
        const dy = tf.tensor1d([1, 2, 3, 1]);
        const grads = tf.grads((a, b) => tf.squaredDifference(a, b));
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(db.shape).toEqual(b.shape);
        expect(da.dtype).toEqual('float32');
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [
            1 * 2 * (1.1 - 1.0), 2 * 2 * (2.6 - 2.7), 3 * 2 * (3 - 3),
            1 * 2 * (5.9 - 5.8)
        ]);
        expectArraysClose(await db.data(), [
            1 * 2 * (1.0 - 1.1), 2 * 2 * (2.7 - 2.6), 3 * 2 * (3 - 3),
            1 * 2 * (5.8 - 5.9)
        ]);
    });
    it('gradients: Tensor2D', async () => {
        const a = tf.tensor2d([0.5, 0.3, 0.7, 0.9], [2, 2]);
        const b = tf.tensor2d([0.2, 0.4, 0.7, 0.15], [2, 2]);
        const dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        const grads = tf.grads((a, b) => tf.squaredDifference(a, b));
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(db.shape).toEqual(b.shape);
        expect(da.dtype).toEqual('float32');
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [
            1 * 2 * (0.5 - 0.2), 2 * 2 * (0.3 - 0.4), 3 * 2 * (0.7 - 0.7),
            4 * 2 * (0.9 - 0.15)
        ]);
        expectArraysClose(await db.data(), [
            1 * 2 * (0.2 - 0.5), 2 * 2 * (0.4 - 0.3), 3 * 2 * (0.7 - 0.7),
            4 * 2 * (0.15 - 0.9)
        ]);
    });
    it('throws when passed a as a non-tensor', () => {
        expect(() => tf.squaredDifference({}, tf.scalar(1)))
            .toThrowError(/Argument 'a' passed to 'squaredDifference' must be a Tensor/);
    });
    it('throws when passed b as a non-tensor', () => {
        expect(() => tf.squaredDifference(tf.scalar(1), {}))
            .toThrowError(/Argument 'b' passed to 'squaredDifference' must be a Tensor/);
    });
    it('accepts a tensor-like object', async () => {
        const a = [[0.5, 3], [-0.1, -4]];
        const b = 0.6;
        const result = tf.squaredDifference(a, b);
        expect(result.shape).toEqual([2, 2]);
        expectArraysClose(await result.data(), [
            Math.pow(0.5 - 0.6, 2), Math.pow(3 - 0.6, 2), Math.pow(-0.1 - 0.6, 2),
            Math.pow(-4 - 0.6, 2)
        ]);
    });
    it('throws for string tensor', () => {
        expect(() => tf.squaredDifference('q', 3))
            .toThrowError(/Argument 'a' passed to 'squaredDifference' must be numeric/);
        expect(() => tf.squaredDifference(3, 'q'))
            .toThrowError(/Argument 'b' passed to 'squaredDifference' must be numeric/);
    });
});
describeWithFlags('minimum', ALL_ENVS, () => {
    it('float32 and float32', async () => {
        const a = tf.tensor1d([0.5, 3, -0.1, -4]);
        const b = tf.tensor1d([0.2, 0.4, 0.25, 0.15]);
        const result = tf.minimum(a, b);
        expect(result.shape).toEqual(a.shape);
        expectArraysClose(await result.data(), [0.2, 0.4, -0.1, -4]);
    });
    it('TensorLike', async () => {
        const a = [0.5, 3, -0.1, -4];
        const b = [0.2, 0.4, 0.25, 0.15];
        const result = tf.minimum(a, b);
        expect(result.shape).toEqual([4]);
        expectArraysClose(await result.data(), [0.2, 0.4, -0.1, -4]);
    });
    it('TensorLike chained', async () => {
        const a = tf.tensor1d([0.5, 3, -0.1, -4]);
        const b = [0.2, 0.4, 0.25, 0.15];
        const result = a.minimum(b);
        expect(result.shape).toEqual(a.shape);
        expectArraysClose(await result.data(), [0.2, 0.4, -0.1, -4]);
    });
    it('int32 and int32', async () => {
        const a = tf.tensor1d([1, 5, 2, 3], 'int32');
        const b = tf.tensor1d([2, 3, 1, 4], 'int32');
        const result = tf.minimum(a, b);
        expect(result.shape).toEqual(a.shape);
        expect(result.dtype).toBe('int32');
        expectArraysEqual(await result.data(), [1, 3, 1, 3]);
    });
    it('bool and bool', async () => {
        const a = tf.tensor1d([true, false, false, true], 'bool');
        const b = tf.tensor1d([false, false, true, true], 'bool');
        const result = tf.minimum(a, b);
        expect(result.shape).toEqual(a.shape);
        expect(result.dtype).toBe('int32');
        expectArraysEqual(await result.data(), [0, 0, 0, 1]);
    });
    it('upcasts when dtypes dont match', async () => {
        const a = tf.tensor1d([1, 0, 0, 1], 'float32');
        const b = tf.tensor1d([0, 0, 1, 1], 'int32');
        const res = tf.minimum(a, b);
        expect(res.shape).toEqual(a.shape);
        expect(res.dtype).toBe('float32');
        expectArraysEqual(await res.data(), [0, 0, 0, 1]);
    });
    it('propagates NaN', async () => {
        const a = tf.tensor1d([0.5, -0.1, NaN]);
        const b = tf.tensor1d([0.2, 0.3, 0.25]);
        const result = tf.minimum(a, b);
        expect(result.shape).toEqual(a.shape);
        expectArraysClose(await result.data(), [0.2, -0.1, NaN]);
    });
    it('broadcasts Tensor1D and scalar', async () => {
        const a = tf.tensor1d([0.5, 3, -0.1, -4]);
        const b = tf.scalar(0.6);
        const result = tf.minimum(a, b);
        expect(result.shape).toEqual(a.shape);
        expectArraysClose(await result.data(), [0.5, 0.6, -0.1, -4]);
    });
    it('broadcasts scalar and Tensor1D', async () => {
        const a = tf.scalar(0.6);
        const b = tf.tensor1d([0.5, 3, -0.1, -4]);
        const result = tf.minimum(a, b);
        expect(result.shape).toEqual(b.shape);
        expectArraysClose(await result.data(), [0.5, 0.6, -0.1, -4]);
    });
    it('broadcasts Tensor1D and Tensor2D', async () => {
        const a = tf.tensor1d([0.5, 0.3]);
        const b = tf.tensor2d([0.2, 0.4, 0.6, 0.15], [2, 2]);
        const result = tf.minimum(a, b);
        expect(result.shape).toEqual(b.shape);
        expectArraysClose(await result.data(), [0.2, 0.3, 0.5, 0.15]);
    });
    it('broadcasts 2x1 Tensor2D and 2x2 Tensor2D', async () => {
        const a = tf.tensor2d([0.5, 0.3], [2, 1]);
        const b = tf.tensor2d([0.2, 0.4, 0.6, 0.15], [2, 2]);
        const result = tf.minimum(a, b);
        expect(result.shape).toEqual(b.shape);
        expectArraysClose(await result.data(), [0.2, 0.4, 0.3, 0.15]);
    });
    it('gradients: Scalar', async () => {
        const a = tf.scalar(5.2);
        const b = tf.scalar(0.6);
        const dy = tf.scalar(3);
        const grads = tf.grads((a, b) => tf.minimum(a, b));
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(db.shape).toEqual(b.shape);
        expect(da.dtype).toEqual('float32');
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [3 * 0]);
        expectArraysClose(await db.data(), [3 * 1]);
    });
    it('gradient with clones', async () => {
        const a = tf.scalar(5.2);
        const b = tf.scalar(0.6);
        const dy = tf.scalar(3);
        const grads = tf.grads((a, b) => tf.minimum(a.clone(), b.clone()).clone());
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(db.shape).toEqual(b.shape);
        expect(da.dtype).toEqual('float32');
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [3 * 0]);
        expectArraysClose(await db.data(), [3 * 1]);
    });
    it('gradients: Tensor1D', async () => {
        const a = tf.tensor1d([1.1, 2.6, 3, 5.9]);
        const b = tf.tensor1d([1.0, 2.7, 3, 5.8]);
        const dy = tf.tensor1d([1, 2, 3, 4]);
        const grads = tf.grads((a, b) => tf.minimum(a, b));
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(db.shape).toEqual(b.shape);
        expect(da.dtype).toEqual('float32');
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [1 * 0, 2 * 1, 3 * 1, 4 * 0]);
        expectArraysClose(await db.data(), [1 * 1, 2 * 0, 3 * 0, 4 * 1]);
    });
    it('gradients: Tensor2D', async () => {
        const a = tf.tensor2d([0.5, 0.3, 0.7, 0.9], [2, 2]);
        const b = tf.tensor2d([0.2, 0.4, 0.7, 0.15], [2, 2]);
        const dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        const grads = tf.grads((a, b) => tf.minimum(a, b));
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(db.shape).toEqual(b.shape);
        expect(da.dtype).toEqual('float32');
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [1 * 0, 2 * 1, 3 * 1, 4 * 0]);
        expectArraysClose(await db.data(), [1 * 1, 2 * 0, 3 * 0, 4 * 1]);
    });
    it('throws when passed a as a non-tensor', () => {
        expect(() => tf.minimum({}, tf.scalar(1)))
            .toThrowError(/Argument 'a' passed to 'minimum' must be a Tensor/);
    });
    it('throws when passed b as a non-tensor', () => {
        expect(() => tf.minimum(tf.scalar(1), {}))
            .toThrowError(/Argument 'b' passed to 'minimum' must be a Tensor/);
    });
    it('accepts a tensor-like object', async () => {
        const a = [[0.5, 3], [-0.1, -4]];
        const b = [[0.2, 0.4], [0.25, 0.15]];
        const result = tf.minimum(a, b);
        expect(result.shape).toEqual([2, 2]);
        expectArraysClose(await result.data(), [0.2, 0.4, -0.1, -4]);
    });
    it('throws for string tensor', () => {
        expect(() => tf.minimum('q', 3))
            .toThrowError(/Argument 'a' passed to 'minimum' must be numeric/);
        expect(() => tf.minimum(3, 'q'))
            .toThrowError(/Argument 'b' passed to 'minimum' must be numeric/);
    });
});
describeWithFlags('mod', ALL_ENVS, () => {
    it('float32 and float32', async () => {
        const a = tf.tensor1d([0.5, 3, -0.1, -4]);
        const b = tf.tensor1d([0.2, 0.4, 0.25, 0.15]);
        const result = tf.mod(a, b);
        expect(result.shape).toEqual(a.shape);
        expectArraysClose(await result.data(), [0.1, 0.2, 0.15, 0.05]);
    });
    it('TensorLike', async () => {
        const a = [0.5, 3, -0.1, -4];
        const b = [0.2, 0.4, 0.25, 0.15];
        const result = tf.mod(a, b);
        expect(result.shape).toEqual([4]);
        expectArraysClose(await result.data(), [0.1, 0.2, 0.15, 0.05]);
    });
    it('TensorLike chained', async () => {
        const a = tf.tensor1d([0.5, 3, -0.1, -4]);
        const b = [0.2, 0.4, 0.25, 0.15];
        const result = a.mod(b);
        expect(result.shape).toEqual(a.shape);
        expectArraysClose(await result.data(), [0.1, 0.2, 0.15, 0.05]);
    });
    it('int32 and int32', async () => {
        const a = tf.tensor1d([1, 5, 2, 3], 'int32');
        const b = tf.tensor1d([2, 3, 1, 4], 'int32');
        const result = tf.mod(a, b);
        expect(result.shape).toEqual(a.shape);
        expect(result.dtype).toBe('int32');
        expectArraysEqual(await result.data(), [1, 2, 0, 3]);
    });
    it('upcasts when dtypes dont match', async () => {
        let res = tf.mod(tf.scalar(5, 'int32'), tf.scalar(2, 'float32'));
        expect(res.dtype).toBe('float32');
        expectArraysClose(await res.data(), [1]);
        res = tf.mod(tf.scalar(5, 'int32'), tf.scalar(true, 'bool'));
        expect(res.dtype).toBe('int32');
        expectArraysClose(await res.data(), [0]);
    });
    it('propagates NaN', async () => {
        const a = tf.tensor1d([5, -1, NaN]);
        const b = tf.tensor1d([2, 3, 0.25]);
        const result = tf.mod(a, b);
        expect(result.shape).toEqual(a.shape);
        expectArraysClose(await result.data(), [1, 2, NaN]);
    });
    it('broadcasts Tensor1D and scalar', async () => {
        const a = tf.tensor1d([0.5, 2.5, -0.1, -4], 'float32');
        const b = tf.scalar(0.6);
        const result = tf.mod(a, b);
        expect(result.shape).toEqual(a.shape);
        expectArraysClose(await result.data(), [0.5, 0.1, 0.5, 0.2]);
    });
    it('broadcasts scalar and Tensor1D', async () => {
        // TODO(manraj): Fix for case fmod(0.6, -0.1)
        const a = tf.scalar(2);
        const b = tf.tensor1d([3, 3, -1, -4]);
        const result = tf.mod(a, b);
        expect(result.shape).toEqual(b.shape);
        expectArraysClose(await result.data(), [2, 2, 0, -2]);
    });
    it('broadcasts Tensor1D and Tensor2D', async () => {
        const a = tf.tensor1d([0.5, 0.3]);
        const b = tf.tensor2d([0.2, 0.4, 0.6, 0.15], [2, 2]);
        const result = tf.mod(a, b);
        expect(result.shape).toEqual(b.shape);
        expectArraysClose(await result.data(), [0.1, 0.3, 0.5, 0.0]);
    });
    it('broadcasts 2x1 Tensor2D and 2x2 Tensor2D', async () => {
        const a = tf.tensor2d([0.5, 0.3], [2, 1]);
        const b = tf.tensor2d([0.2, 0.4, 0.6, 0.15], [2, 2]);
        const result = tf.mod(a, b);
        expect(result.shape).toEqual(b.shape);
        expectArraysClose(await result.data(), [0.1, 0.1, 0.3, 0.0]);
    });
    it('gradients: Scalar', async () => {
        const a = tf.scalar(5.2);
        const b = tf.scalar(0.6);
        const dy = tf.scalar(3);
        const grads = tf.grads((a, b) => tf.mod(a, b));
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(db.shape).toEqual(b.shape);
        expect(da.dtype).toEqual('float32');
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [3]);
        expectArraysClose(await db.data(), [3 * -1 * Math.floor(5.2 / 0.6)]);
    });
    it('gradient with clones', async () => {
        const a = tf.scalar(5.2);
        const b = tf.scalar(0.6);
        const dy = tf.scalar(3);
        const grads = tf.grads((a, b) => tf.mod(a.clone(), b.clone()).clone());
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(db.shape).toEqual(b.shape);
        expect(da.dtype).toEqual('float32');
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [3]);
        expectArraysClose(await db.data(), [3 * -1 * Math.floor(5.2 / 0.6)]);
    });
    it('gradients: Tensor1D', async () => {
        const a = tf.tensor1d([1.1, 2.6, 3, 5.9]);
        const b = tf.tensor1d([1.0, 2.7, 3, 5.8]);
        const dy = tf.tensor1d([1, 2, 3, 4]);
        const grads = tf.grads((a, b) => tf.mod(a, b));
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(db.shape).toEqual(b.shape);
        expect(da.dtype).toEqual('float32');
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [1 * 1, 2 * 1, 3 * 1, 4 * 1]);
        expectArraysClose(await db.data(), [
            1 * -1 * Math.floor(1.1 / 1.0), 2 * -1 * Math.floor(2.6 / 2.7),
            3 * -1 * Math.floor(3 / 3), 4 * -1 * Math.floor(5.9 / 5.8)
        ]);
    });
    it('gradients: Tensor2D', async () => {
        const a = tf.tensor2d([0.5, 0.3, 0.7, 0.91], [2, 2]);
        const b = tf.tensor2d([0.2, 0.4, 0.7, 0.15], [2, 2]);
        const dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        const grads = tf.grads((a, b) => tf.mod(a, b));
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(db.shape).toEqual(b.shape);
        expect(da.dtype).toEqual('float32');
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [1 * 1, 2 * 1, 3 * 1, 4 * 1]);
        expectArraysClose(await db.data(), [
            1 * -1 * Math.floor(0.5 / 0.2), 2 * -1 * Math.floor(0.3 / 0.4),
            3 * -1 * Math.floor(0.7 / 0.7), 4 * -1 * Math.floor(0.91 / 0.15)
        ]);
    });
    it('gradients: broadcasts scalar and Tensor1D', async () => {
        const a = tf.scalar(0.7);
        const b = tf.tensor1d([0.2, 0.3, 0.4, 0.5]);
        const dy = tf.tensor1d([1, 2, 3, 4]);
        const grads = tf.grads((a, b) => tf.mod(a, b));
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(db.shape).toEqual(b.shape);
        expect(da.dtype).toEqual('float32');
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [1 + 2 + 3 + 4]);
        expectArraysClose(await db.data(), [
            1 * -1 * Math.floor(0.7 / 0.2), 2 * -1 * Math.floor(0.7 / 0.3),
            3 * -1 * Math.floor(0.7 / 0.4), 4 * -1 * Math.floor(0.7 / 0.5)
        ]);
    });
    it('broadcasts Tensor1D and Tensor2D', async () => {
        const a = tf.tensor1d([0.5, 0.3]);
        const b = tf.tensor2d([0.2, 0.4, 0.7, 0.15], [2, 2]);
        const dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        const grads = tf.grads((a, b) => tf.mod(a, b));
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(db.shape).toEqual(b.shape);
        expect(da.dtype).toEqual('float32');
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [1 * 1 + 3 * 1, 2 * 1 + 4 * 1]);
        expectArraysClose(await db.data(), [
            1 * -1 * Math.floor(0.5 / 0.2), 2 * -1 * Math.floor(0.3 / 0.4),
            3 * -1 * Math.floor(0.5 / 0.7), 4 * -1 * Math.floor(0.3 / 0.15)
        ]);
    });
    it('throws when passed a as a non-tensor', () => {
        expect(() => tf.mod({}, tf.scalar(1)))
            .toThrowError(/Argument 'a' passed to 'mod' must be a Tensor/);
    });
    it('throws when passed b as a non-tensor', () => {
        expect(() => tf.mod(tf.scalar(1), {}))
            .toThrowError(/Argument 'b' passed to 'mod' must be a Tensor/);
    });
    it('accepts a tensor-like object', async () => {
        const a = [[0.5, 3], [-0.1, -4]];
        const b = [[0.2, 0.4], [0.25, 0.15]];
        const result = tf.mod(a, b);
        expect(result.shape).toEqual([2, 2]);
        expectArraysClose(await result.data(), [0.1, 0.2, 0.15, 0.05]);
    });
    it('throws for string tensor', () => {
        expect(() => tf.mod('q', 3))
            .toThrowError(/Argument 'a' passed to 'mod' must be numeric/);
        expect(() => tf.mod(3, 'q'))
            .toThrowError(/Argument 'b' passed to 'mod' must be numeric/);
    });
});
describeWithFlags('atan2', ALL_ENVS, () => {
    it('same shape', async () => {
        const aValues = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0];
        const bValues = [1.0, 2.5, 3.5, 4.5, 2.0, 5.0];
        const a = tf.tensor2d(aValues, [2, 3]);
        const c = tf.tensor2d(bValues, [2, 3]);
        const r = tf.atan2(a, c);
        const expected = [];
        for (let i = 0; i < a.size; i++) {
            expected[i] = Math.atan2(aValues[i], bValues[i]);
        }
        expectArraysClose(await r.data(), expected);
    });
    it('uses chaining', async () => {
        const aValues = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0];
        const bValues = [1.0, 2.5, 3.5, 4.5, 2.0, 5.0];
        const a = tf.tensor2d(aValues, [2, 3]);
        const b = tf.tensor2d(bValues, [2, 3]);
        const r = a.atan2(b);
        const expected = [];
        for (let i = 0; i < a.size; i++) {
            expected[i] = Math.atan2(aValues[i], bValues[i]);
        }
        expectArraysClose(await r.data(), expected);
    });
    it('propagates NaNs', async () => {
        const a = tf.tensor2d([1.0, 2.0], [2, 1]);
        const c = tf.tensor2d([3.0, NaN], [2, 1]);
        const r = tf.atan2(a, c);
        expectArraysClose(await r.data(), [Math.atan2(1.0, 3.0), NaN]);
    });
    it('broadcasting same rank Tensors different shape', async () => {
        const aValues = [1.0, 2.0, -3.0, -4.0];
        const bValues = [2.0, 3.0];
        const a = tf.tensor2d(aValues, [2, 2]);
        const b = tf.tensor2d(bValues, [2, 1]);
        const result = tf.atan2(a, b);
        expect(result.shape).toEqual([2, 2]);
        const expected = [
            Math.atan2(1.0, 2.0), Math.atan2(2.0, 2.0), Math.atan2(-3.0, 3.0),
            Math.atan2(-4.0, 3.0)
        ];
        expectArraysClose(await result.data(), expected);
    });
    it('throws when passed tensors of different shapes', () => {
        const a = tf.tensor2d([1, 2, -3, -4, 5, 6], [2, 3]);
        const b = tf.tensor2d([5, 3, 4, -7], [2, 2]);
        expect(() => tf.atan2(a, b)).toThrowError();
        expect(() => tf.atan2(b, a)).toThrowError();
    });
    it('upcasts when dtypes dont match', async () => {
        const aValues = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0];
        const bValues = [1, 2, 3, 4, 2, 5];
        const a = tf.tensor2d(aValues, [2, 3], 'float32');
        const c = tf.tensor2d(bValues, [2, 3], 'int32');
        const r = tf.atan2(a, c);
        const expected = [];
        for (let i = 0; i < a.size; i++) {
            expected[i] = Math.atan2(aValues[i], bValues[i]);
        }
        expect(r.shape).toEqual([2, 3]);
        expect(r.dtype).toBe('float32');
        expectArraysClose(await r.data(), expected);
    });
    it('atan2 of scalar and array propagates NaNs', async () => {
        const c = tf.scalar(NaN);
        const a = tf.tensor2d([1, 2, 3], [1, 3]);
        const r = tf.atan2(c, a);
        expectArraysEqual(await r.data(), [NaN, NaN, NaN]);
    });
    it('atan2 of scalar and array', async () => {
        const aValues = [1, 2, 3, 4, 5, 6];
        const a = tf.tensor2d(aValues, [2, 3]);
        const c = tf.scalar(2);
        const r = tf.atan2(a, c);
        const expected = [];
        for (let i = 0; i < a.size; i++) {
            expected[i] = Math.atan2(aValues[i], 2);
        }
        expectArraysClose(await r.data(), expected);
    });
    it('atan2 vec4 NaNs', async () => {
        const aValues = [1.0, 2.0, 3.0, 4.0];
        const cValues = [3.0, NaN, 3.0, 4.0];
        const a = tf.tensor2d(aValues, [4, 1]);
        const c = tf.tensor2d(cValues, [4, 1]);
        const r = tf.atan2(a, c);
        const expected = [];
        for (let i = 0; i < a.size; i++) {
            expected[i] = Math.atan2(aValues[i], cValues[i]);
        }
        expectArraysClose(await r.data(), expected);
    });
    it('atan2 vec4 all NaNs', async () => {
        const aValues = [NaN, 2.0, NaN, NaN];
        const cValues = [3.0, NaN, 3.0, 4.0];
        const a = tf.tensor2d(aValues, [4, 1]);
        const c = tf.tensor2d(cValues, [4, 1]);
        const r = tf.atan2(a, c);
        const expected = [];
        for (let i = 0; i < a.size; i++) {
            expected[i] = Math.atan2(aValues[i], cValues[i]);
        }
        expectArraysClose(await r.data(), expected);
    });
    it('gradient: Scalar', async () => {
        const a = tf.scalar(5);
        const b = tf.scalar(2);
        const dy = tf.scalar(4);
        const grads = tf.grads((a, b) => tf.atan2(a, b));
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [4 * 2 / 29]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await db.data(), [4 * -5 / 29]);
    });
    it('gradient with clones', async () => {
        const a = tf.scalar(5);
        const b = tf.scalar(2);
        const dy = tf.scalar(4);
        const grads = tf.grads((a, b) => tf.atan2(a.clone(), b.clone()).clone());
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [4 * 2 / 29]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await db.data(), [4 * -5 / 29]);
    });
    it('gradient: Tensor1D', async () => {
        const a = tf.tensor1d([1, 2, 3]);
        const b = tf.tensor1d([3, 4, 5]);
        const dy = tf.tensor1d([1, 10, 20]);
        const grads = tf.grads((a, b) => tf.atan2(a, b));
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [1 * 3 / 10, 10 * 4 / 20, 20 * 5 / 34]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await db.data(), [-1 * 1 / 10, -10 * 2 / 20, -20 * 3 / 34]);
    });
    it('gradient: Tensor2D', async () => {
        const a = tf.tensor2d([3, 1, 2, 3], [2, 2]);
        const b = tf.tensor2d([1, 3, 4, 5], [2, 2]);
        const dy = tf.tensor2d([1, 10, 15, 20], [2, 2]);
        const grads = tf.grads((a, b) => tf.atan2(a, b));
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [1 * 1 / 10, 10 * 3 / 10, 15 * 4 / 20, 20 * 5 / 34]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await db.data(), [-1 * 3 / 10, -10 * 1 / 10, -15 * 2 / 20, -20 * 3 / 34]);
    });
    it('gradient: scalar / Tensor1D', async () => {
        const a = tf.scalar(2);
        const b = tf.tensor1d([3, 4, 5]);
        const dy = tf.tensor1d([6, 7, 8]);
        const grads = tf.grads((a, b) => tf.atan2(a, b));
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [6 * 3 / 13 + 7 * 4 / 20 + 8 * 5 / 29]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await db.data(), [-6 * 2 / 13, -7 * 2 / 20, -8 * 2 / 29]);
    });
    it('gradient: Tensor2D / scalar', async () => {
        const a = tf.tensor2d([[2, 3], [4, 5]], [2, 2]);
        const b = tf.scalar(2);
        const dy = tf.tensor2d([[6, 7], [8, 9]], [2, 2]);
        const grads = tf.grads((a, b) => tf.atan2(a, b));
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [6 * 2 / 8, 7 * 2 / 13, 8 * 2 / 20, 9 * 2 / 29]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await db.data(), [-6 * 2 / 8 + -7 * 3 / 13 + -8 * 4 / 20 + -9 * 5 / 29]);
    });
    it('gradient: Tensor2D / Tensor2D w/ broadcast', async () => {
        const a = tf.tensor2d([3, 4], [2, 1]);
        const b = tf.tensor2d([[2, 3], [4, 5]], [2, 2]);
        const dy = tf.tensor2d([[6, 7], [8, 9]], [2, 2]);
        const grads = tf.grads((a, b) => tf.atan2(a, b));
        const [da, db] = grads([a, b], dy);
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [6 * 2 / 13 + 7 * 3 / 18, 8 * 4 / 32 + 9 * 5 / 41]);
        expect(db.shape).toEqual(b.shape);
        expect(db.dtype).toEqual('float32');
        expectArraysClose(await db.data(), [-6 * 3 / 13, -7 * 3 / 18, -8 * 4 / 32, -9 * 4 / 41]);
    });
    it('throws when passed a as a non-tensor', () => {
        expect(() => tf.atan2({}, tf.scalar(1)))
            .toThrowError(/Argument 'a' passed to 'atan2' must be a Tensor/);
    });
    it('throws when passed b as a non-tensor', () => {
        expect(() => tf.atan2(tf.scalar(1), {}))
            .toThrowError(/Argument 'b' passed to 'atan2' must be a Tensor/);
    });
    it('accepts a tensor-like object', async () => {
        const a = [[1, 2, 3], [4, 5, 6]];
        const c = 2;
        const r = tf.atan2(a, c);
        const expected = [];
        for (let i = 0; i < 6; i++) {
            expected[i] = Math.atan2(i + 1, 2);
        }
        expectArraysClose(await r.data(), expected);
    });
    it('throws for string tensor', () => {
        expect(() => tf.atan2('q', 3))
            .toThrowError(/Argument 'a' passed to 'atan2' must be numeric/);
        expect(() => tf.atan2(3, 'q'))
            .toThrowError(/Argument 'b' passed to 'atan2' must be numeric/);
    });
});
describeWithFlags('div', ALL_ENVS, () => {
    it('divNoNan divide 0', async () => {
        // Broadcast div a with b.
        const a = tf.tensor1d([2, 4, 6, 8]);
        const b = tf.tensor1d([0, 0, 0, 0]);
        const c = a.divNoNan(b);
        expect(c.shape).toEqual(a.shape);
        expectArraysClose(await c.data(), [0, 0, 0, 0]);
    });
    it('divNoNan divide 0 and non-0', async () => {
        // Broadcast div a with b.
        const a = tf.tensor1d([2, 4, 6, 8]);
        const b = tf.tensor1d([2, 2, 0, 4]);
        const c = a.divNoNan(b);
        expect(c.shape).toEqual(a.shape);
        expectArraysClose(await c.data(), [1, 2, 0, 2]);
    });
    it('divNoNan divide 0 broadcast', async () => {
        // Broadcast div a with b.
        const a = tf.tensor1d([2, 4, 6, 8]);
        const b = tf.scalar(0);
        const c = a.divNoNan(b);
        expect(c.shape).toEqual(a.shape);
        expectArraysClose(await c.data(), [0, 0, 0, 0]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluYXJ5X29wc190ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvYmluYXJ5X29wc190ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsaUJBQWlCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFbEUsaUJBQWlCLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDeEMsRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLElBQUksRUFBRTtRQUNyQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDL0MsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFOUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RDLGlCQUFpQixDQUFDLE1BQU0sTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMs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QyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVyQyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFL0MsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3BDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNwQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDOUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFM0QsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3BDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN0RCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM3QyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVB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QUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVoQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsaUJBQWlCLENBQUMsTUFBTSxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDBDQUEwQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3hELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVoQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsaUJBQWlCLENBQUMsTUFBTSxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG1CQUFtQixFQUFFLEtBQUssSUFBSSxFQUFF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Q0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHFCQUFxQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ25DLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXJDLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRW5DLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDcEMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFcEMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRSxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25FLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHFCQUFxQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ25DLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTdDLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRW5D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QUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVoQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsaUJBQWlCLENBQUMsTUFBTSxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDBDQUEwQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3hELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVoQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsaUJBQWlCLENBQUMsTUFBTSxNQUFNLENBQUMsSUFBSSxF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SUFDdkUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMscUJBQXFCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDbkMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDMUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFckMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFbkMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNwQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVwQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ2pDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1lBQzlELENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1NBQzNELENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHFCQUFxQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ25DLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTdDLE1BQU0sS0FB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cEMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BELGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ2pDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1lBQzlELENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1NBQy9ELENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ2hELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3QyxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFB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QU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDcEMsaUJBQWlCLENBQ2IsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbEUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDbEMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFaEQsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakQsTUFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUs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QUUsQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNkJBQTZCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDM0MsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFakQsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakQsTUFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFbkMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3BDLGlCQUFpQixDQUNiLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFF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bEQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0ICogYXMgdGYgZnJvbSAnLi4vaW5kZXgnO1xuaW1wb3J0IHtBTExfRU5WUywgZGVzY3JpYmVXaXRoRmxhZ3N9IGZyb20gJy4uL2phc21pbmVfdXRpbCc7XG5pbXBvcnQge2V4cGVjdEFycmF5c0Nsb3NlLCBleHBlY3RBcnJheXNFcXVhbH0gZnJvbSAnLi4vdGVzdF91dGlsJztcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ3ByZWx1JywgQUxMX0VOVlMsICgpID0+IHtcbiAgaXQoJ2Jhc2ljJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IxZChbMCwgMSwgLTIsIC00XSk7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFswLjE1LCAwLjIsIDAuMjUsIDAuMTVdKTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5wcmVsdSh4LCBhKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoeC5zaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzAsIDEsIC0wLjUsIC0wLjZdKTtcbiAgfSk7XG5cbiAgaXQoJ2Jhc2ljIFRlbnNvckxpa2UnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeCA9IFswLCAxLCAtMiwgLTRdO1xuICAgIGNvbnN0IGEgPSBbMC4xNSwgMC4yLCAwLjI1LCAwLjE1XTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5wcmVsdSh4LCBhKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzRdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBbMCwgMSwgLTAuNSwgLTAuNl0pO1xuICB9KTtcblxuICBpdCgnYmFzaWMgVGVuc29yTGlrZSBjaGFpbmVkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IxZChbMCwgMSwgLTIsIC00XSk7XG4gICAgY29uc3QgYSA9IFswLjE1LCAwLjIsIDAuMjUsIDAuMTVdO1xuICAgIGNvbnN0IHJlc3VsdCA9IHgucHJlbHUoYSk7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKHguc2hhcGUpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIFswLCAxLCAtMC41LCAtMC42XSk7XG4gIH0pO1xuXG4gIGl0KCdiYXNpYyBpbnQzMicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB4ID0gdGYudGVuc29yMWQoWzAsIDEsIC0yLCAtNF0sICdpbnQzMicpO1xuICAgIGNvbnN0IGEgPSBbMC4xNSwgMC4yLCAwLjI1LCAwLjE1XTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5wcmVsdSh4LCBhKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzRdKTtcbiAgICBleHBlY3QocmVzdWx0LmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzAsIDEsIC0wLjUsIC0wLjZdKTtcbiAgfSk7XG5cbiAgaXQoJ2Rlcml2YXRpdmUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjFkKFswLjUsIDMsIC0wLjEsIC00XSk7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFswLjIsIDAuNCwgMC4yNSwgMC4xNV0pO1xuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yMWQoWzEsIDEsIDEsIDFdKTtcblxuICAgIGNvbnN0IGR4ID0gdGYuZ3JhZCh4ID0+IHRmLnByZWx1KHgsIGEpKSh4LCBkeSk7XG5cbiAgICBleHBlY3QoZHguc2hhcGUpLnRvRXF1YWwoeC5zaGFwZSk7XG4gICAgZXhwZWN0KGR4LmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZHguZGF0YSgpLCBbMSwgMSwgMC4yNSwgMC4xNV0pO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnQgd2l0aCBjbG9uZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjFkKFswLjUsIDMsIC0wLjEsIC00XSk7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFswLjIsIDAuNCwgMC4yNSwgMC4xNV0pO1xuICAgIGNvbnN0IGR4ID0gdGYuZ3JhZCh4ID0+IHRmLnByZWx1KHguY2xvbmUoKSwgYSkuY2xvbmUoKSkoeCk7XG5cbiAgICBleHBlY3QoZHguc2hhcGUpLnRvRXF1YWwoeC5zaGFwZSk7XG4gICAgZXhwZWN0KGR4LmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZHguZGF0YSgpLCBbMSwgMSwgMC4yNSwgMC4xNV0pO1xuICB9KTtcblxuICBpdCgnZGVyaXZhdGl2ZSB3aGVyZSBhbHBoYSBnb3QgYnJvYWRjYXN0ZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjJkKFtbMC41LCAzLCAtMC4xLCAtNF1dKTtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoW1swLjJdXSk7XG4gICAgY29uc3QgZHkgPSB0Zi50ZW5zb3IyZChbWzEsIDEsIDEsIDFdXSk7XG5cbiAgICBjb25zdCBkYSA9IHRmLmdyYWQoYSA9PiB0Zi5wcmVsdSh4LCBhKSkoYSwgZHkpO1xuICAgIGV4cGVjdChkYS5zaGFwZSkudG9FcXVhbChhLnNoYXBlKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkYS5kYXRhKCksIFstNC4xXSk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3Mgd2hlbiBwYXNzZWQgeCBhcyBhIG5vbi10ZW5zb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLnByZWx1KHt9IGFzIHRmLlRlbnNvciwgdGYuc2NhbGFyKDEpKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvQXJndW1lbnQgJ3gnIHBhc3NlZCB0byAncHJlbHUnIG11c3QgYmUgYSBUZW5zb3IvKTtcbiAgfSk7XG4gIGl0KCd0aHJvd3Mgd2hlbiBwYXNzZWQgYWxwaGEgYXMgYSBub24tdGVuc29yJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB0Zi5wcmVsdSh0Zi5zY2FsYXIoMSksIHt9IGFzIHRmLlRlbnNvcikpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0FyZ3VtZW50ICdhbHBoYScgcGFzc2VkIHRvICdwcmVsdScgbXVzdCBiZSBhIFRlbnNvci8pO1xuICB9KTtcblxuICBpdCgndGhyb3dzIGZvciBzdHJpbmcgdGVuc29yJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB0Zi5wcmVsdShbJ2EnXSwgMC4xKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvQXJndW1lbnQgJ3gnIHBhc3NlZCB0byAncHJlbHUnIG11c3QgYmUgbnVtZXJpYyB0ZW5zb3IvKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ21heGltdW0nLCBBTExfRU5WUywgKCkgPT4ge1xuICBpdCgnZmxvYXQzMiBhbmQgZmxvYXQzMicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzAuNSwgMywgLTAuMSwgLTRdKTtcbiAgICBjb25zdCBiID0gdGYudGVuc29yMWQoWzAuMiwgMC40LCAwLjI1LCAwLjE1XSk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGYubWF4aW11bShhLCBiKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzAuNSwgMywgMC4yNSwgMC4xNV0pO1xuICB9KTtcblxuICBpdCgnVGVuc29yTGlrZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gWzAuNSwgMywgLTAuMSwgLTRdO1xuICAgIGNvbnN0IGIgPSBbMC4yLCAwLjQsIDAuMjUsIDAuMTVdO1xuICAgIGNvbnN0IHJlc3VsdCA9IHRmLm1heGltdW0oYSwgYik7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFs0XSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzAuNSwgMywgMC4yNSwgMC4xNV0pO1xuICB9KTtcblxuICBpdCgnVGVuc29yTGlrZSBjaGFpbmVkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMC41LCAzLCAtMC4xLCAtNF0pO1xuICAgIGNvbnN0IGIgPSBbMC4yLCAwLjQsIDAuMjUsIDAuMTVdO1xuICAgIGNvbnN0IHJlc3VsdCA9IGEubWF4aW11bShiKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzRdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBbMC41LCAzLCAwLjI1LCAwLjE1XSk7XG4gIH0pO1xuXG4gIGl0KCdpbnQzMiBhbmQgaW50MzInLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLCA1LCAyLCAzXSwgJ2ludDMyJyk7XG4gICAgY29uc3QgYiA9IHRmLnRlbnNvcjFkKFsyLCAzLCAxLCA0XSwgJ2ludDMyJyk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGYubWF4aW11bShhLCBiKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0KHJlc3VsdC5kdHlwZSkudG9CZSgnaW50MzInKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCByZXN1bHQuZGF0YSgpLCBbMiwgNSwgMiwgNF0pO1xuICB9KTtcblxuICBpdCgnYm9vbCBhbmQgYm9vbCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoW3RydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZV0sICdib29sJyk7XG4gICAgY29uc3QgYiA9IHRmLnRlbnNvcjFkKFtmYWxzZSwgZmFsc2UsIHRydWUsIHRydWVdLCAnYm9vbCcpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHRmLm1heGltdW0oYSwgYik7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdChyZXN1bHQuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzEsIDAsIDEsIDFdKTtcbiAgfSk7XG5cbiAgaXQoJ3VwY2FzdHMgd2hlbiBkdHlwZXMgZG9udCBtYXRjaCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzEsIDAsIDAsIDFdLCAnZmxvYXQzMicpO1xuICAgIGNvbnN0IGIgPSB0Zi50ZW5zb3IxZChbMCwgMCwgMSwgMV0sICdpbnQzMicpO1xuICAgIGNvbnN0IHJlcyA9IHRmLm1heGltdW0oYSwgYik7XG4gICAgZXhwZWN0KHJlcy5zaGFwZSkudG9FcXVhbChhLnNoYXBlKTtcbiAgICBleHBlY3QocmVzLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgcmVzLmRhdGEoKSwgWzEsIDAsIDEsIDFdKTtcbiAgfSk7XG5cbiAgaXQoJ3Byb3BhZ2F0ZXMgTmFOJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMC41LCAtMC4xLCBOYU5dKTtcbiAgICBjb25zdCBiID0gdGYudGVuc29yMWQoWzAuMiwgMC4zLCAwLjI1XSk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGYubWF4aW11bShhLCBiKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzAuNSwgMC4zLCBOYU5dKTtcbiAgfSk7XG5cbiAgaXQoJ2Jyb2FkY2FzdHMgVGVuc29yMUQgYW5kIHNjYWxhcicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzAuNSwgMywgLTAuMSwgLTRdKTtcbiAgICBjb25zdCBiID0gdGYuc2NhbGFyKDAuNik7XG4gICAgY29uc3QgcmVzdWx0ID0gdGYubWF4aW11bShhLCBiKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzAuNiwgMywgMC42LCAwLjZdKTtcbiAgfSk7XG5cbiAgaXQoJ2Jyb2FkY2FzdHMgc2NhbGFyIGFuZCBUZW5zb3IxRCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYuc2NhbGFyKDAuNik7XG4gICAgY29uc3QgYiA9IHRmLnRlbnNvcjFkKFswLjUsIDMsIC0wLjEsIC00XSk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGYubWF4aW11bShhLCBiKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoYi5zaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzAuNiwgMywgMC42LCAwLjZdKTtcbiAgfSk7XG5cbiAgaXQoJ2Jyb2FkY2FzdHMgVGVuc29yMUQgYW5kIFRlbnNvcjJEJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMC41LCAwLjNdKTtcbiAgICBjb25zdCBiID0gdGYudGVuc29yMmQoWzAuMiwgMC40LCAwLjYsIDAuMTVdLCBbMiwgMl0pO1xuICAgIGNvbnN0IHJlc3VsdCA9IHRmLm1heGltdW0oYSwgYik7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKGIuc2hhcGUpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIFswLjUsIDAuNCwgMC42LCAwLjNdKTtcbiAgfSk7XG5cbiAgaXQoJ2Jyb2FkY2FzdHMgMngxIFRlbnNvcjJEIGFuZCAyeDIgVGVuc29yMkQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKFswLjUsIDAuM10sIFsyLCAxXSk7XG4gICAgY29uc3QgYiA9IHRmLnRlbnNvcjJkKFswLjIsIDAuNCwgMC42LCAwLjE1XSwgWzIsIDJdKTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5tYXhpbXVtKGEsIGIpO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChiLnNoYXBlKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBbMC41LCAwLjUsIDAuNiwgMC4zXSk7XG4gIH0pO1xuXG4gIGl0KCdncmFkaWVudHM6IFNjYWxhcicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYuc2NhbGFyKDUuMik7XG4gICAgY29uc3QgYiA9IHRmLnNjYWxhcigwLjYpO1xuICAgIGNvbnN0IGR5ID0gdGYuc2NhbGFyKDMpO1xuXG4gICAgY29uc3QgZ3JhZHMgPSB0Zi5ncmFkcygoYSwgYikgPT4gdGYubWF4aW11bShhLCBiKSk7XG4gICAgY29uc3QgW2RhLCBkYl0gPSBncmFkcyhbYSwgYl0sIGR5KTtcblxuICAgIGV4cGVjdChkYS5zaGFwZSkudG9FcXVhbChhLnNoYXBlKTtcbiAgICBleHBlY3QoZGIuc2hhcGUpLnRvRXF1YWwoYi5zaGFwZSk7XG4gICAgZXhwZWN0KGRhLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGRiLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkYS5kYXRhKCksIFszICogMV0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRiLmRhdGEoKSwgWzMgKiAwXSk7XG4gIH0pO1xuXG4gIGl0KCdncmFkaWVudCB3aXRoIGNsb25lcycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYuc2NhbGFyKDUuMik7XG4gICAgY29uc3QgYiA9IHRmLnNjYWxhcigwLjYpO1xuICAgIGNvbnN0IGR5ID0gdGYuc2NhbGFyKDMpO1xuXG4gICAgY29uc3QgZ3JhZHMgPSB0Zi5ncmFkcygoYSwgYikgPT4gdGYubWF4aW11bShhLmNsb25lKCksIGIuY2xvbmUoKSkuY2xvbmUoKSk7XG4gICAgY29uc3QgW2RhLCBkYl0gPSBncmFkcyhbYSwgYl0sIGR5KTtcblxuICAgIGV4cGVjdChkYS5zaGFwZSkudG9FcXVhbChhLnNoYXBlKTtcbiAgICBleHBlY3QoZGIuc2hhcGUpLnRvRXF1YWwoYi5zaGFwZSk7XG4gICAgZXhwZWN0KGRhLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGRiLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkYS5kYXRhKCksIFszICogMV0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRiLmRhdGEoKSwgWzMgKiAwXSk7XG4gIH0pO1xuXG4gIGl0KCdncmFkaWVudHM6IFRlbnNvcjFEJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMS4xLCAyLjYsIDMsIDUuOV0pO1xuICAgIGNvbnN0IGIgPSB0Zi50ZW5zb3IxZChbMS4wLCAyLjcsIDMsIDUuOF0pO1xuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yMWQoWzEsIDIsIDMsIDRdKTtcblxuICAgIGNvbnN0IGdyYWRzID0gdGYuZ3JhZHMoKGEsIGIpID0+IHRmLm1heGltdW0oYSwgYikpO1xuICAgIGNvbnN0IFtkYSwgZGJdID0gZ3JhZHMoW2EsIGJdLCBkeSk7XG5cbiAgICBleHBlY3QoZGEuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0KGRiLnNoYXBlKS50b0VxdWFsKGIuc2hhcGUpO1xuICAgIGV4cGVjdChkYS5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICAgIGV4cGVjdChkYi5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuXG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZGEuZGF0YSgpLCBbMSAqIDEsIDIgKiAwLCAzICogMSwgNCAqIDFdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkYi5kYXRhKCksIFsxICogMCwgMiAqIDEsIDMgKiAwLCA0ICogMF0pO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnRzOiBUZW5zb3IyRCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoWzAuNSwgMC4zLCAwLjcsIDAuOV0sIFsyLCAyXSk7XG4gICAgY29uc3QgYiA9IHRmLnRlbnNvcjJkKFswLjIsIDAuNCwgMC43LCAwLjE1XSwgWzIsIDJdKTtcbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjJkKFsxLCAyLCAzLCA0XSwgWzIsIDJdKTtcblxuICAgIGNvbnN0IGdyYWRzID0gdGYuZ3JhZHMoKGEsIGIpID0+IHRmLm1heGltdW0oYSwgYikpO1xuICAgIGNvbnN0IFtkYSwgZGJdID0gZ3JhZHMoW2EsIGJdLCBkeSk7XG5cbiAgICBleHBlY3QoZGEuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0KGRiLnNoYXBlKS50b0VxdWFsKGIuc2hhcGUpO1xuICAgIGV4cGVjdChkYS5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICAgIGV4cGVjdChkYi5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuXG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZGEuZGF0YSgpLCBbMSAqIDEsIDIgKiAwLCAzICogMSwgNCAqIDFdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkYi5kYXRhKCksIFsxICogMCwgMiAqIDEsIDMgKiAwLCA0ICogMF0pO1xuICB9KTtcblxuICBpdCgndGhyb3dzIHdoZW4gcGFzc2VkIGEgYXMgYSBub24tdGVuc29yJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB0Zi5tYXhpbXVtKHt9IGFzIHRmLlRlbnNvciwgdGYuc2NhbGFyKDEpKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvQXJndW1lbnQgJ2EnIHBhc3NlZCB0byAnbWF4aW11bScgbXVzdCBiZSBhIFRlbnNvci8pO1xuICB9KTtcbiAgaXQoJ3Rocm93cyB3aGVuIHBhc3NlZCBiIGFzIGEgbm9uLXRlbnNvcicsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gdGYubWF4aW11bSh0Zi5zY2FsYXIoMSksIHt9IGFzIHRmLlRlbnNvcikpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0FyZ3VtZW50ICdiJyBwYXNzZWQgdG8gJ21heGltdW0nIG11c3QgYmUgYSBUZW5zb3IvKTtcbiAgfSk7XG5cbiAgaXQoJ2FjY2VwdHMgYSB0ZW5zb3ItbGlrZSBvYmplY3QnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IFtbMC41LCAzXSwgWy0wLjEsIC00XV07XG4gICAgY29uc3QgYiA9IFtbMC4yLCAwLjRdLCBbMC4yNSwgMC4xNV1dO1xuICAgIGNvbnN0IHJlc3VsdCA9IHRmLm1heGltdW0oYSwgYik7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFsyLCAyXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzAuNSwgMywgMC4yNSwgMC4xNV0pO1xuICB9KTtcblxuICBpdCgndGhyb3dzIGZvciBzdHJpbmcgdGVuc29yJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB0Zi5tYXhpbXVtKCdxJywgMykpXG4gICAgICAgIC50b1Rocm93RXJyb3IoXG4gICAgICAgICAgICAvQXJndW1lbnQgJ2EnIHBhc3NlZCB0byAnbWF4aW11bScgbXVzdCBiZSBudW1lcmljIHRlbnNvci8pO1xuXG4gICAgZXhwZWN0KCgpID0+IHRmLm1heGltdW0oMywgJ3EnKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcihcbiAgICAgICAgICAgIC9Bcmd1bWVudCAnYicgcGFzc2VkIHRvICdtYXhpbXVtJyBtdXN0IGJlIG51bWVyaWMgdGVuc29yLyk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCdzcXVhcmVkRGlmZmVyZW5jZScsIEFMTF9FTlZTLCAoKSA9PiB7XG4gIGl0KCdmbG9hdDMyIGFuZCBmbG9hdDMyJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMC41LCAzLCAtMC4xLCAtNF0pO1xuICAgIGNvbnN0IGIgPSB0Zi50ZW5zb3IxZChbMC4yLCAwLjQsIDAuMjUsIDAuMTVdKTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5zcXVhcmVkRGlmZmVyZW5jZShhLCBiKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgW1xuICAgICAgTWF0aC5wb3coMC41IC0gMC4yLCAyKSwgTWF0aC5wb3coMyAtIDAuNCwgMiksIE1hdGgucG93KC0wLjEgLSAwLjI1LCAyKSxcbiAgICAgIE1hdGgucG93KC00IC0gMC4xNSwgMilcbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ1RlbnNvckxpa2UnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IFswLjUsIDMsIC0wLjEsIC00XTtcbiAgICBjb25zdCBiID0gWzAuMiwgMC40LCAwLjI1LCAwLjE1XTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5zcXVhcmVkRGlmZmVyZW5jZShhLCBiKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzRdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBbXG4gICAgICBNYXRoLnBvdygwLjUgLSAwLjIsIDIpLCBNYXRoLnBvdygzIC0gMC40LCAyKSwgTWF0aC5wb3coLTAuMSAtIDAuMjUsIDIpLFxuICAgICAgTWF0aC5wb3coLTQgLSAwLjE1LCAyKVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnVGVuc29yTGlrZSBjaGFpbmVkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMC41LCAzLCAtMC4xLCAtNF0pO1xuICAgIGNvbnN0IGIgPSBbMC4yLCAwLjQsIDAuMjUsIDAuMTVdO1xuICAgIGNvbnN0IHJlc3VsdCA9IGEuc3F1YXJlZERpZmZlcmVuY2UoYik7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIFtcbiAgICAgIE1hdGgucG93KDAuNSAtIDAuMiwgMiksIE1hdGgucG93KDMgLSAwLjQsIDIpLCBNYXRoLnBvdygtMC4xIC0gMC4yNSwgMiksXG4gICAgICBNYXRoLnBvdygtNCAtIDAuMTUsIDIpXG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCdpbnQzMiBhbmQgaW50MzInLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLCA1LCAyLCAzXSwgJ2ludDMyJyk7XG4gICAgY29uc3QgYiA9IHRmLnRlbnNvcjFkKFsyLCAzLCAxLCA0XSwgJ2ludDMyJyk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGYuc3F1YXJlZERpZmZlcmVuY2UoYSwgYik7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdChyZXN1bHQuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgcmVzdWx0LmRhdGEoKSwgW1xuICAgICAgTWF0aC5wb3coMSAtIDIsIDIpLCBNYXRoLnBvdyg1IC0gMywgMiksIE1hdGgucG93KDIgLSAxLCAyKSxcbiAgICAgIE1hdGgucG93KDMgLSA0LCAyKVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgndXBjYXN0cyB3aGVuIGR0eXBlcyBkb250IG1hdGNoJywgYXN5bmMgKCkgPT4ge1xuICAgIGxldCByZXMgPVxuICAgICAgICB0Zi5zcXVhcmVkRGlmZmVyZW5jZSh0Zi5zY2FsYXIoNSwgJ2ludDMyJyksIHRmLnNjYWxhcigyLCAnZmxvYXQzMicpKTtcbiAgICBleHBlY3QocmVzLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzLmRhdGEoKSwgWzldKTtcblxuICAgIHJlcyA9IHRmLnNxdWFyZWREaWZmZXJlbmNlKHRmLnNjYWxhcig1LCAnaW50MzInKSwgdGYuc2NhbGFyKHRydWUsICdib29sJykpO1xuICAgIGV4cGVjdChyZXMuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzLmRhdGEoKSwgWzE2XSk7XG5cbiAgICByZXMgPSB0Zi5zcXVhcmVkRGlmZmVyZW5jZSh0Zi5zY2FsYXIoNSwgJ2ludDMyJyksIHRmLnNjYWxhcihmYWxzZSwgJ2Jvb2wnKSk7XG4gICAgZXhwZWN0KHJlcy5kdHlwZSkudG9CZSgnaW50MzInKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXMuZGF0YSgpLCBbMjVdKTtcbiAgfSk7XG5cbiAgaXQoJ3Byb3BhZ2F0ZXMgTmFOJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMC41LCAtMC4xLCBOYU5dKTtcbiAgICBjb25zdCBiID0gdGYudGVuc29yMWQoWzAuMiwgMC4zLCAwLjI1XSk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGYuc3F1YXJlZERpZmZlcmVuY2UoYSwgYik7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKFxuICAgICAgICBhd2FpdCByZXN1bHQuZGF0YSgpLFxuICAgICAgICBbTWF0aC5wb3coMC41IC0gMC4yLCAyKSwgTWF0aC5wb3coLTAuMSAtIDAuMywgMiksIE5hTl0pO1xuICB9KTtcblxuICBpdCgnYnJvYWRjYXN0cyBUZW5zb3IxRCBhbmQgc2NhbGFyJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMC41LCAzLCAtMC4xLCAtNF0pO1xuICAgIGNvbnN0IGIgPSB0Zi5zY2FsYXIoMC42KTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5zcXVhcmVkRGlmZmVyZW5jZShhLCBiKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgW1xuICAgICAgTWF0aC5wb3coMC41IC0gMC42LCAyKSwgTWF0aC5wb3coMyAtIDAuNiwgMiksIE1hdGgucG93KC0wLjEgLSAwLjYsIDIpLFxuICAgICAgTWF0aC5wb3coLTQgLSAwLjYsIDIpXG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCdicm9hZGNhc3RzIHNjYWxhciBhbmQgVGVuc29yMUQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnNjYWxhcigwLjYpO1xuICAgIGNvbnN0IGIgPSB0Zi50ZW5zb3IxZChbMC41LCAzLCAtMC4xLCAtNF0pO1xuICAgIGNvbnN0IHJlc3VsdCA9IHRmLnNxdWFyZWREaWZmZXJlbmNlKGEsIGIpO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChiLnNoYXBlKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBbXG4gICAgICBNYXRoLnBvdygwLjYgLSAwLjUsIDIpLCBNYXRoLnBvdygwLjYgLSAzLCAyKSwgTWF0aC5wb3coMC42IC0gKC0wLjEpLCAyKSxcbiAgICAgIE1hdGgucG93KDAuNiAtICgtNCksIDIpXG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCdicm9hZGNhc3RzIFRlbnNvcjFEIGFuZCBUZW5zb3IyRCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzAuNSwgMC4zXSk7XG4gICAgY29uc3QgYiA9IHRmLnRlbnNvcjJkKFswLjIsIDAuNCwgMC42LCAwLjE1XSwgWzIsIDJdKTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5zcXVhcmVkRGlmZmVyZW5jZShhLCBiKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoYi5zaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgW1xuICAgICAgTWF0aC5wb3coMC41IC0gMC4yLCAyKSwgTWF0aC5wb3coMC4zIC0gMC40LCAyKSwgTWF0aC5wb3coMC41IC0gMC42LCAyKSxcbiAgICAgIE1hdGgucG93KDAuMyAtIDAuMTUsIDIpXG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCdicm9hZGNhc3RzIDJ4MSBUZW5zb3IyRCBhbmQgMngyIFRlbnNvcjJEJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChbMC41LCAwLjNdLCBbMiwgMV0pO1xuICAgIGNvbnN0IGIgPSB0Zi50ZW5zb3IyZChbMC4yLCAwLjQsIDAuNiwgMC4xNV0sIFsyLCAyXSk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGYuc3F1YXJlZERpZmZlcmVuY2UoYSwgYik7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKGIuc2hhcGUpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIFtcbiAgICAgIE1hdGgucG93KDAuNSAtIDAuMiwgMiksIE1hdGgucG93KDAuNSAtIDAuNCwgMiksIE1hdGgucG93KDAuMyAtIDAuNiwgMiksXG4gICAgICBNYXRoLnBvdygwLjMgLSAwLjE1LCAyKVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnRzOiBTY2FsYXInLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnNjYWxhcig1LjIpO1xuICAgIGNvbnN0IGIgPSB0Zi5zY2FsYXIoMC42KTtcbiAgICBjb25zdCBkeSA9IHRmLnNjYWxhcigzKTtcblxuICAgIGNvbnN0IGdyYWRzID0gdGYuZ3JhZHMoKGEsIGIpID0+IHRmLnNxdWFyZWREaWZmZXJlbmNlKGEsIGIpKTtcbiAgICBjb25zdCBbZGEsIGRiXSA9IGdyYWRzKFthLCBiXSwgZHkpO1xuXG4gICAgZXhwZWN0KGRhLnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdChkYi5zaGFwZSkudG9FcXVhbChiLnNoYXBlKTtcbiAgICBleHBlY3QoZGEuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3QoZGIuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRhLmRhdGEoKSwgWzMgKiAyICogKDUuMiAtIDAuNildKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkYi5kYXRhKCksIFszICogMiAqICgwLjYgLSA1LjIpXSk7XG4gIH0pO1xuXG4gIGl0KCdncmFkaWVudCB3aXRoIGNsb25lcycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYuc2NhbGFyKDUuMik7XG4gICAgY29uc3QgYiA9IHRmLnNjYWxhcigwLjYpO1xuICAgIGNvbnN0IGR5ID0gdGYuc2NhbGFyKDMpO1xuXG4gICAgY29uc3QgZ3JhZHMgPVxuICAgICAgICB0Zi5ncmFkcygoYSwgYikgPT4gdGYuc3F1YXJlZERpZmZlcmVuY2UoYS5jbG9uZSgpLCBiLmNsb25lKCkpLmNsb25lKCkpO1xuICAgIGNvbnN0IFtkYSwgZGJdID0gZ3JhZHMoW2EsIGJdLCBkeSk7XG5cbiAgICBleHBlY3QoZGEuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0KGRiLnNoYXBlKS50b0VxdWFsKGIuc2hhcGUpO1xuICAgIGV4cGVjdChkYS5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICAgIGV4cGVjdChkYi5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuXG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZGEuZGF0YSgpLCBbMyAqIDIgKiAoNS4yIC0gMC42KV0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRiLmRhdGEoKSwgWzMgKiAyICogKDAuNiAtIDUuMildKTtcbiAgfSk7XG5cbiAgaXQoJ2dyYWRpZW50czogVGVuc29yMUQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLjEsIDIuNiwgMywgNS45XSk7XG4gICAgY29uc3QgYiA9IHRmLnRlbnNvcjFkKFsxLjAsIDIuNywgMywgNS44XSk7XG4gICAgY29uc3QgZHkgPSB0Zi50ZW5zb3IxZChbMSwgMiwgMywgMV0pO1xuXG4gICAgY29uc3QgZ3JhZHMgPSB0Zi5ncmFkcygoYSwgYikgPT4gdGYuc3F1YXJlZERpZmZlcmVuY2UoYSwgYikpO1xuICAgIGNvbnN0IFtkYSwgZGJdID0gZ3JhZHMoW2EsIGJdLCBkeSk7XG5cbiAgICBleHBlY3QoZGEuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0KGRiLnNoYXBlKS50b0VxdWFsKGIuc2hhcGUpO1xuICAgIGV4cGVjdChkYS5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICAgIGV4cGVjdChkYi5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuXG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZGEuZGF0YSgpLCBbXG4gICAgICAxICogMiAqICgxLjEgLSAxLjApLCAyICogMiAqICgyLjYgLSAyLjcpLCAzICogMiAqICgzIC0gMyksXG4gICAgICAxICogMiAqICg1LjkgLSA1LjgpXG4gICAgXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZGIuZGF0YSgpLCBbXG4gICAgICAxICogMiAqICgxLjAgLSAxLjEpLCAyICogMiAqICgyLjcgLSAyLjYpLCAzICogMiAqICgzIC0gMyksXG4gICAgICAxICogMiAqICg1LjggLSA1LjkpXG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCdncmFkaWVudHM6IFRlbnNvcjJEJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChbMC41LCAwLjMsIDAuNywgMC45XSwgWzIsIDJdKTtcbiAgICBjb25zdCBiID0gdGYudGVuc29yMmQoWzAuMiwgMC40LCAwLjcsIDAuMTVdLCBbMiwgMl0pO1xuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yMmQoWzEsIDIsIDMsIDRdLCBbMiwgMl0pO1xuXG4gICAgY29uc3QgZ3JhZHMgPSB0Zi5ncmFkcygoYSwgYikgPT4gdGYuc3F1YXJlZERpZmZlcmVuY2UoYSwgYikpO1xuICAgIGNvbnN0IFtkYSwgZGJdID0gZ3JhZHMoW2EsIGJdLCBkeSk7XG5cbiAgICBleHBlY3QoZGEuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0KGRiLnNoYXBlKS50b0VxdWFsKGIuc2hhcGUpO1xuICAgIGV4cGVjdChkYS5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICAgIGV4cGVjdChkYi5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuXG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZGEuZGF0YSgpLCBbXG4gICAgICAxICogMiAqICgwLjUgLSAwLjIpLCAyICogMiAqICgwLjMgLSAwLjQpLCAzICogMiAqICgwLjcgLSAwLjcpLFxuICAgICAgNCAqIDIgKiAoMC45IC0gMC4xNSlcbiAgICBdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkYi5kYXRhKCksIFtcbiAgICAgIDEgKiAyICogKDAuMiAtIDAuNSksIDIgKiAyICogKDAuNCAtIDAuMyksIDMgKiAyICogKDAuNyAtIDAuNyksXG4gICAgICA0ICogMiAqICgwLjE1IC0gMC45KVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgndGhyb3dzIHdoZW4gcGFzc2VkIGEgYXMgYSBub24tdGVuc29yJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB0Zi5zcXVhcmVkRGlmZmVyZW5jZSh7fSBhcyB0Zi5UZW5zb3IsIHRmLnNjYWxhcigxKSkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoXG4gICAgICAgICAgICAvQXJndW1lbnQgJ2EnIHBhc3NlZCB0byAnc3F1YXJlZERpZmZlcmVuY2UnIG11c3QgYmUgYSBUZW5zb3IvKTtcbiAgfSk7XG4gIGl0KCd0aHJvd3Mgd2hlbiBwYXNzZWQgYiBhcyBhIG5vbi10ZW5zb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLnNxdWFyZWREaWZmZXJlbmNlKHRmLnNjYWxhcigxKSwge30gYXMgdGYuVGVuc29yKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcihcbiAgICAgICAgICAgIC9Bcmd1bWVudCAnYicgcGFzc2VkIHRvICdzcXVhcmVkRGlmZmVyZW5jZScgbXVzdCBiZSBhIFRlbnNvci8pO1xuICB9KTtcblxuICBpdCgnYWNjZXB0cyBhIHRlbnNvci1saWtlIG9iamVjdCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gW1swLjUsIDNdLCBbLTAuMSwgLTRdXTtcbiAgICBjb25zdCBiID0gMC42O1xuICAgIGNvbnN0IHJlc3VsdCA9IHRmLnNxdWFyZWREaWZmZXJlbmNlKGEsIGIpO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMiwgMl0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIFtcbiAgICAgIE1hdGgucG93KDAuNSAtIDAuNiwgMiksIE1hdGgucG93KDMgLSAwLjYsIDIpLCBNYXRoLnBvdygtMC4xIC0gMC42LCAyKSxcbiAgICAgIE1hdGgucG93KC00IC0gMC42LCAyKVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgndGhyb3dzIGZvciBzdHJpbmcgdGVuc29yJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB0Zi5zcXVhcmVkRGlmZmVyZW5jZSgncScsIDMpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKFxuICAgICAgICAgICAgL0FyZ3VtZW50ICdhJyBwYXNzZWQgdG8gJ3NxdWFyZWREaWZmZXJlbmNlJyBtdXN0IGJlIG51bWVyaWMvKTtcblxuICAgIGV4cGVjdCgoKSA9PiB0Zi5zcXVhcmVkRGlmZmVyZW5jZSgzLCAncScpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKFxuICAgICAgICAgICAgL0FyZ3VtZW50ICdiJyBwYXNzZWQgdG8gJ3NxdWFyZWREaWZmZXJlbmNlJyBtdXN0IGJlIG51bWVyaWMvKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ21pbmltdW0nLCBBTExfRU5WUywgKCkgPT4ge1xuICBpdCgnZmxvYXQzMiBhbmQgZmxvYXQzMicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzAuNSwgMywgLTAuMSwgLTRdKTtcbiAgICBjb25zdCBiID0gdGYudGVuc29yMWQoWzAuMiwgMC40LCAwLjI1LCAwLjE1XSk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGYubWluaW11bShhLCBiKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzAuMiwgMC40LCAtMC4xLCAtNF0pO1xuICB9KTtcblxuICBpdCgnVGVuc29yTGlrZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gWzAuNSwgMywgLTAuMSwgLTRdO1xuICAgIGNvbnN0IGIgPSBbMC4yLCAwLjQsIDAuMjUsIDAuMTVdO1xuICAgIGNvbnN0IHJlc3VsdCA9IHRmLm1pbmltdW0oYSwgYik7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFs0XSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzAuMiwgMC40LCAtMC4xLCAtNF0pO1xuICB9KTtcblxuICBpdCgnVGVuc29yTGlrZSBjaGFpbmVkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMC41LCAzLCAtMC4xLCAtNF0pO1xuICAgIGNvbnN0IGIgPSBbMC4yLCAwLjQsIDAuMjUsIDAuMTVdO1xuICAgIGNvbnN0IHJlc3VsdCA9IGEubWluaW11bShiKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzAuMiwgMC40LCAtMC4xLCAtNF0pO1xuICB9KTtcblxuICBpdCgnaW50MzIgYW5kIGludDMyJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMSwgNSwgMiwgM10sICdpbnQzMicpO1xuICAgIGNvbnN0IGIgPSB0Zi50ZW5zb3IxZChbMiwgMywgMSwgNF0sICdpbnQzMicpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHRmLm1pbmltdW0oYSwgYik7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdChyZXN1bHQuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzEsIDMsIDEsIDNdKTtcbiAgfSk7XG5cbiAgaXQoJ2Jvb2wgYW5kIGJvb2wnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFt0cnVlLCBmYWxzZSwgZmFsc2UsIHRydWVdLCAnYm9vbCcpO1xuICAgIGNvbnN0IGIgPSB0Zi50ZW5zb3IxZChbZmFsc2UsIGZhbHNlLCB0cnVlLCB0cnVlXSwgJ2Jvb2wnKTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5taW5pbXVtKGEsIGIpO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChhLnNoYXBlKTtcbiAgICBleHBlY3QocmVzdWx0LmR0eXBlKS50b0JlKCdpbnQzMicpO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IHJlc3VsdC5kYXRhKCksIFswLCAwLCAwLCAxXSk7XG4gIH0pO1xuXG4gIGl0KCd1cGNhc3RzIHdoZW4gZHR5cGVzIGRvbnQgbWF0Y2gnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLCAwLCAwLCAxXSwgJ2Zsb2F0MzInKTtcbiAgICBjb25zdCBiID0gdGYudGVuc29yMWQoWzAsIDAsIDEsIDFdLCAnaW50MzInKTtcbiAgICBjb25zdCByZXMgPSB0Zi5taW5pbXVtKGEsIGIpO1xuICAgIGV4cGVjdChyZXMuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0KHJlcy5kdHlwZSkudG9CZSgnZmxvYXQzMicpO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IHJlcy5kYXRhKCksIFswLCAwLCAwLCAxXSk7XG4gIH0pO1xuXG4gIGl0KCdwcm9wYWdhdGVzIE5hTicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzAuNSwgLTAuMSwgTmFOXSk7XG4gICAgY29uc3QgYiA9IHRmLnRlbnNvcjFkKFswLjIsIDAuMywgMC4yNV0pO1xuICAgIGNvbnN0IHJlc3VsdCA9IHRmLm1pbmltdW0oYSwgYik7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIFswLjIsIC0wLjEsIE5hTl0pO1xuICB9KTtcblxuICBpdCgnYnJvYWRjYXN0cyBUZW5zb3IxRCBhbmQgc2NhbGFyJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMC41LCAzLCAtMC4xLCAtNF0pO1xuICAgIGNvbnN0IGIgPSB0Zi5zY2FsYXIoMC42KTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5taW5pbXVtKGEsIGIpO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChhLnNoYXBlKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBbMC41LCAwLjYsIC0wLjEsIC00XSk7XG4gIH0pO1xuXG4gIGl0KCdicm9hZGNhc3RzIHNjYWxhciBhbmQgVGVuc29yMUQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnNjYWxhcigwLjYpO1xuICAgIGNvbnN0IGIgPSB0Zi50ZW5zb3IxZChbMC41LCAzLCAtMC4xLCAtNF0pO1xuICAgIGNvbnN0IHJlc3VsdCA9IHRmLm1pbmltdW0oYSwgYik7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKGIuc2hhcGUpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIFswLjUsIDAuNiwgLTAuMSwgLTRdKTtcbiAgfSk7XG5cbiAgaXQoJ2Jyb2FkY2FzdHMgVGVuc29yMUQgYW5kIFRlbnNvcjJEJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMC41LCAwLjNdKTtcbiAgICBjb25zdCBiID0gdGYudGVuc29yMmQoWzAuMiwgMC40LCAwLjYsIDAuMTVdLCBbMiwgMl0pO1xuICAgIGNvbnN0IHJlc3VsdCA9IHRmLm1pbmltdW0oYSwgYik7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKGIuc2hhcGUpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIFswLjIsIDAuMywgMC41LCAwLjE1XSk7XG4gIH0pO1xuXG4gIGl0KCdicm9hZGNhc3RzIDJ4MSBUZW5zb3IyRCBhbmQgMngyIFRlbnNvcjJEJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChbMC41LCAwLjNdLCBbMiwgMV0pO1xuICAgIGNvbnN0IGIgPSB0Zi50ZW5zb3IyZChbMC4yLCAwLjQsIDAuNiwgMC4xNV0sIFsyLCAyXSk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGYubWluaW11bShhLCBiKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoYi5zaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzAuMiwgMC40LCAwLjMsIDAuMTVdKTtcbiAgfSk7XG5cbiAgaXQoJ2dyYWRpZW50czogU2NhbGFyJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi5zY2FsYXIoNS4yKTtcbiAgICBjb25zdCBiID0gdGYuc2NhbGFyKDAuNik7XG4gICAgY29uc3QgZHkgPSB0Zi5zY2FsYXIoMyk7XG5cbiAgICBjb25zdCBncmFkcyA9IHRmLmdyYWRzKChhLCBiKSA9PiB0Zi5taW5pbXVtKGEsIGIpKTtcbiAgICBjb25zdCBbZGEsIGRiXSA9IGdyYWRzKFthLCBiXSwgZHkpO1xuXG4gICAgZXhwZWN0KGRhLnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdChkYi5zaGFwZSkudG9FcXVhbChiLnNoYXBlKTtcbiAgICBleHBlY3QoZGEuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3QoZGIuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRhLmRhdGEoKSwgWzMgKiAwXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZGIuZGF0YSgpLCBbMyAqIDFdKTtcbiAgfSk7XG5cbiAgaXQoJ2dyYWRpZW50IHdpdGggY2xvbmVzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi5zY2FsYXIoNS4yKTtcbiAgICBjb25zdCBiID0gdGYuc2NhbGFyKDAuNik7XG4gICAgY29uc3QgZHkgPSB0Zi5zY2FsYXIoMyk7XG5cbiAgICBjb25zdCBncmFkcyA9IHRmLmdyYWRzKChhLCBiKSA9PiB0Zi5taW5pbXVtKGEuY2xvbmUoKSwgYi5jbG9uZSgpKS5jbG9uZSgpKTtcbiAgICBjb25zdCBbZGEsIGRiXSA9IGdyYWRzKFthLCBiXSwgZHkpO1xuXG4gICAgZXhwZWN0KGRhLnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdChkYi5zaGFwZSkudG9FcXVhbChiLnNoYXBlKTtcbiAgICBleHBlY3QoZGEuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3QoZGIuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRhLmRhdGEoKSwgWzMgKiAwXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZGIuZGF0YSgpLCBbMyAqIDFdKTtcbiAgfSk7XG5cbiAgaXQoJ2dyYWRpZW50czogVGVuc29yMUQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLjEsIDIuNiwgMywgNS45XSk7XG4gICAgY29uc3QgYiA9IHRmLnRlbnNvcjFkKFsxLjAsIDIuNywgMywgNS44XSk7XG4gICAgY29uc3QgZHkgPSB0Zi50ZW5zb3IxZChbMSwgMiwgMywgNF0pO1xuXG4gICAgY29uc3QgZ3JhZHMgPSB0Zi5ncmFkcygoYSwgYikgPT4gdGYubWluaW11bShhLCBiKSk7XG4gICAgY29uc3QgW2RhLCBkYl0gPSBncmFkcyhbYSwgYl0sIGR5KTtcblxuICAgIGV4cGVjdChkYS5zaGFwZSkudG9FcXVhbChhLnNoYXBlKTtcbiAgICBleHBlY3QoZGIuc2hhcGUpLnRvRXF1YWwoYi5zaGFwZSk7XG4gICAgZXhwZWN0KGRhLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGRiLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkYS5kYXRhKCksIFsxICogMCwgMiAqIDEsIDMgKiAxLCA0ICogMF0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRiLmRhdGEoKSwgWzEgKiAxLCAyICogMCwgMyAqIDAsIDQgKiAxXSk7XG4gIH0pO1xuXG4gIGl0KCdncmFkaWVudHM6IFRlbnNvcjJEJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChbMC41LCAwLjMsIDAuNywgMC45XSwgWzIsIDJdKTtcbiAgICBjb25zdCBiID0gdGYudGVuc29yMmQoWzAuMiwgMC40LCAwLjcsIDAuMTVdLCBbMiwgMl0pO1xuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yMmQoWzEsIDIsIDMsIDRdLCBbMiwgMl0pO1xuXG4gICAgY29uc3QgZ3JhZHMgPSB0Zi5ncmFkcygoYSwgYikgPT4gdGYubWluaW11bShhLCBiKSk7XG4gICAgY29uc3QgW2RhLCBkYl0gPSBncmFkcyhbYSwgYl0sIGR5KTtcblxuICAgIGV4cGVjdChkYS5zaGFwZSkudG9FcXVhbChhLnNoYXBlKTtcbiAgICBleHBlY3QoZGIuc2hhcGUpLnRvRXF1YWwoYi5zaGFwZSk7XG4gICAgZXhwZWN0KGRhLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGRiLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkYS5kYXRhKCksIFsxICogMCwgMiAqIDEsIDMgKiAxLCA0ICogMF0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRiLmRhdGEoKSwgWzEgKiAxLCAyICogMCwgMyAqIDAsIDQgKiAxXSk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3Mgd2hlbiBwYXNzZWQgYSBhcyBhIG5vbi10ZW5zb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLm1pbmltdW0oe30gYXMgdGYuVGVuc29yLCB0Zi5zY2FsYXIoMSkpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9Bcmd1bWVudCAnYScgcGFzc2VkIHRvICdtaW5pbXVtJyBtdXN0IGJlIGEgVGVuc29yLyk7XG4gIH0pO1xuICBpdCgndGhyb3dzIHdoZW4gcGFzc2VkIGIgYXMgYSBub24tdGVuc29yJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB0Zi5taW5pbXVtKHRmLnNjYWxhcigxKSwge30gYXMgdGYuVGVuc29yKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvQXJndW1lbnQgJ2InIHBhc3NlZCB0byAnbWluaW11bScgbXVzdCBiZSBhIFRlbnNvci8pO1xuICB9KTtcblxuICBpdCgnYWNjZXB0cyBhIHRlbnNvci1saWtlIG9iamVjdCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gW1swLjUsIDNdLCBbLTAuMSwgLTRdXTtcbiAgICBjb25zdCBiID0gW1swLjIsIDAuNF0sIFswLjI1LCAwLjE1XV07XG4gICAgY29uc3QgcmVzdWx0ID0gdGYubWluaW11bShhLCBiKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzIsIDJdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBbMC4yLCAwLjQsIC0wLjEsIC00XSk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3MgZm9yIHN0cmluZyB0ZW5zb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLm1pbmltdW0oJ3EnLCAzKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvQXJndW1lbnQgJ2EnIHBhc3NlZCB0byAnbWluaW11bScgbXVzdCBiZSBudW1lcmljLyk7XG5cbiAgICBleHBlY3QoKCkgPT4gdGYubWluaW11bSgzLCAncScpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9Bcmd1bWVudCAnYicgcGFzc2VkIHRvICdtaW5pbXVtJyBtdXN0IGJlIG51bWVyaWMvKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ21vZCcsIEFMTF9FTlZTLCAoKSA9PiB7XG4gIGl0KCdmbG9hdDMyIGFuZCBmbG9hdDMyJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMC41LCAzLCAtMC4xLCAtNF0pO1xuICAgIGNvbnN0IGIgPSB0Zi50ZW5zb3IxZChbMC4yLCAwLjQsIDAuMjUsIDAuMTVdKTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5tb2QoYSwgYik7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIFswLjEsIDAuMiwgMC4xNSwgMC4wNV0pO1xuICB9KTtcblxuICBpdCgnVGVuc29yTGlrZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gWzAuNSwgMywgLTAuMSwgLTRdO1xuICAgIGNvbnN0IGIgPSBbMC4yLCAwLjQsIDAuMjUsIDAuMTVdO1xuICAgIGNvbnN0IHJlc3VsdCA9IHRmLm1vZChhLCBiKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzRdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBbMC4xLCAwLjIsIDAuMTUsIDAuMDVdKTtcbiAgfSk7XG5cbiAgaXQoJ1RlbnNvckxpa2UgY2hhaW5lZCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzAuNSwgMywgLTAuMSwgLTRdKTtcbiAgICBjb25zdCBiID0gWzAuMiwgMC40LCAwLjI1LCAwLjE1XTtcbiAgICBjb25zdCByZXN1bHQgPSBhLm1vZChiKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzAuMSwgMC4yLCAwLjE1LCAwLjA1XSk7XG4gIH0pO1xuXG4gIGl0KCdpbnQzMiBhbmQgaW50MzInLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLCA1LCAyLCAzXSwgJ2ludDMyJyk7XG4gICAgY29uc3QgYiA9IHRmLnRlbnNvcjFkKFsyLCAzLCAxLCA0XSwgJ2ludDMyJyk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGYubW9kKGEsIGIpO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChhLnNoYXBlKTtcbiAgICBleHBlY3QocmVzdWx0LmR0eXBlKS50b0JlKCdpbnQzMicpO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IHJlc3VsdC5kYXRhKCksIFsxLCAyLCAwLCAzXSk7XG4gIH0pO1xuXG4gIGl0KCd1cGNhc3RzIHdoZW4gZHR5cGVzIGRvbnQgbWF0Y2gnLCBhc3luYyAoKSA9PiB7XG4gICAgbGV0IHJlcyA9IHRmLm1vZCh0Zi5zY2FsYXIoNSwgJ2ludDMyJyksIHRmLnNjYWxhcigyLCAnZmxvYXQzMicpKTtcbiAgICBleHBlY3QocmVzLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzLmRhdGEoKSwgWzFdKTtcblxuICAgIHJlcyA9IHRmLm1vZCh0Zi5zY2FsYXIoNSwgJ2ludDMyJyksIHRmLnNjYWxhcih0cnVlLCAnYm9vbCcpKTtcbiAgICBleHBlY3QocmVzLmR0eXBlKS50b0JlKCdpbnQzMicpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlcy5kYXRhKCksIFswXSk7XG4gIH0pO1xuXG4gIGl0KCdwcm9wYWdhdGVzIE5hTicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzUsIC0xLCBOYU5dKTtcbiAgICBjb25zdCBiID0gdGYudGVuc29yMWQoWzIsIDMsIDAuMjVdKTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5tb2QoYSwgYik7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIFsxLCAyLCBOYU5dKTtcbiAgfSk7XG5cbiAgaXQoJ2Jyb2FkY2FzdHMgVGVuc29yMUQgYW5kIHNjYWxhcicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzAuNSwgMi41LCAtMC4xLCAtNF0sICdmbG9hdDMyJyk7XG4gICAgY29uc3QgYiA9IHRmLnNjYWxhcigwLjYpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHRmLm1vZChhLCBiKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzAuNSwgMC4xLCAwLjUsIDAuMl0pO1xuICB9KTtcblxuICBpdCgnYnJvYWRjYXN0cyBzY2FsYXIgYW5kIFRlbnNvcjFEJywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIFRPRE8obWFucmFqKTogRml4IGZvciBjYXNlIGZtb2QoMC42LCAtMC4xKVxuICAgIGNvbnN0IGEgPSB0Zi5zY2FsYXIoMik7XG4gICAgY29uc3QgYiA9IHRmLnRlbnNvcjFkKFszLCAzLCAtMSwgLTRdKTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5tb2QoYSwgYik7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKGIuc2hhcGUpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIFsyLCAyLCAwLCAtMl0pO1xuICB9KTtcblxuICBpdCgnYnJvYWRjYXN0cyBUZW5zb3IxRCBhbmQgVGVuc29yMkQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFswLjUsIDAuM10pO1xuICAgIGNvbnN0IGIgPSB0Zi50ZW5zb3IyZChbMC4yLCAwLjQsIDAuNiwgMC4xNV0sIFsyLCAyXSk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGYubW9kKGEsIGIpO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChiLnNoYXBlKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBbMC4xLCAwLjMsIDAuNSwgMC4wXSk7XG4gIH0pO1xuXG4gIGl0KCdicm9hZGNhc3RzIDJ4MSBUZW5zb3IyRCBhbmQgMngyIFRlbnNvcjJEJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChbMC41LCAwLjNdLCBbMiwgMV0pO1xuICAgIGNvbnN0IGIgPSB0Zi50ZW5zb3IyZChbMC4yLCAwLjQsIDAuNiwgMC4xNV0sIFsyLCAyXSk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGYubW9kKGEsIGIpO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChiLnNoYXBlKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBbMC4xLCAwLjEsIDAuMywgMC4wXSk7XG4gIH0pO1xuXG4gIGl0KCdncmFkaWVudHM6IFNjYWxhcicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYuc2NhbGFyKDUuMik7XG4gICAgY29uc3QgYiA9IHRmLnNjYWxhcigwLjYpO1xuICAgIGNvbnN0IGR5ID0gdGYuc2NhbGFyKDMpO1xuXG4gICAgY29uc3QgZ3JhZHMgPSB0Zi5ncmFkcygoYSwgYikgPT4gdGYubW9kKGEsIGIpKTtcbiAgICBjb25zdCBbZGEsIGRiXSA9IGdyYWRzKFthLCBiXSwgZHkpO1xuXG4gICAgZXhwZWN0KGRhLnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdChkYi5zaGFwZSkudG9FcXVhbChiLnNoYXBlKTtcbiAgICBleHBlY3QoZGEuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3QoZGIuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRhLmRhdGEoKSwgWzNdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkYi5kYXRhKCksIFszICogLTEgKiBNYXRoLmZsb29yKDUuMiAvIDAuNildKTtcbiAgfSk7XG5cbiAgaXQoJ2dyYWRpZW50IHdpdGggY2xvbmVzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi5zY2FsYXIoNS4yKTtcbiAgICBjb25zdCBiID0gdGYuc2NhbGFyKDAuNik7XG4gICAgY29uc3QgZHkgPSB0Zi5zY2FsYXIoMyk7XG5cbiAgICBjb25zdCBncmFkcyA9IHRmLmdyYWRzKChhLCBiKSA9PiB0Zi5tb2QoYS5jbG9uZSgpLCBiLmNsb25lKCkpLmNsb25lKCkpO1xuICAgIGNvbnN0IFtkYSwgZGJdID0gZ3JhZHMoW2EsIGJdLCBkeSk7XG5cbiAgICBleHBlY3QoZGEuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0KGRiLnNoYXBlKS50b0VxdWFsKGIuc2hhcGUpO1xuICAgIGV4cGVjdChkYS5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICAgIGV4cGVjdChkYi5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuXG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZGEuZGF0YSgpLCBbM10pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRiLmRhdGEoKSwgWzMgKiAtMSAqIE1hdGguZmxvb3IoNS4yIC8gMC42KV0pO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnRzOiBUZW5zb3IxRCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzEuMSwgMi42LCAzLCA1LjldKTtcbiAgICBjb25zdCBiID0gdGYudGVuc29yMWQoWzEuMCwgMi43LCAzLCA1LjhdKTtcbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzLCA0XSk7XG5cbiAgICBjb25zdCBncmFkcyA9IHRmLmdyYWRzKChhLCBiKSA9PiB0Zi5tb2QoYSwgYikpO1xuICAgIGNvbnN0IFtkYSwgZGJdID0gZ3JhZHMoW2EsIGJdLCBkeSk7XG5cbiAgICBleHBlY3QoZGEuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0KGRiLnNoYXBlKS50b0VxdWFsKGIuc2hhcGUpO1xuICAgIGV4cGVjdChkYS5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICAgIGV4cGVjdChkYi5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuXG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZGEuZGF0YSgpLCBbMSAqIDEsIDIgKiAxLCAzICogMSwgNCAqIDFdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkYi5kYXRhKCksIFtcbiAgICAgIDEgKiAtMSAqIE1hdGguZmxvb3IoMS4xIC8gMS4wKSwgMiAqIC0xICogTWF0aC5mbG9vcigyLjYgLyAyLjcpLFxuICAgICAgMyAqIC0xICogTWF0aC5mbG9vcigzIC8gMyksIDQgKiAtMSAqIE1hdGguZmxvb3IoNS45IC8gNS44KVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnRzOiBUZW5zb3IyRCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoWzAuNSwgMC4zLCAwLjcsIDAuOTFdLCBbMiwgMl0pO1xuICAgIGNvbnN0IGIgPSB0Zi50ZW5zb3IyZChbMC4yLCAwLjQsIDAuNywgMC4xNV0sIFsyLCAyXSk7XG4gICAgY29uc3QgZHkgPSB0Zi50ZW5zb3IyZChbMSwgMiwgMywgNF0sIFsyLCAyXSk7XG5cbiAgICBjb25zdCBncmFkcyA9IHRmLmdyYWRzKChhLCBiKSA9PiB0Zi5tb2QoYSwgYikpO1xuICAgIGNvbnN0IFtkYSwgZGJdID0gZ3JhZHMoW2EsIGJdLCBkeSk7XG5cbiAgICBleHBlY3QoZGEuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0KGRiLnNoYXBlKS50b0VxdWFsKGIuc2hhcGUpO1xuICAgIGV4cGVjdChkYS5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICAgIGV4cGVjdChkYi5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuXG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZGEuZGF0YSgpLCBbMSAqIDEsIDIgKiAxLCAzICogMSwgNCAqIDFdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkYi5kYXRhKCksIFtcbiAgICAgIDEgKiAtMSAqIE1hdGguZmxvb3IoMC41IC8gMC4yKSwgMiAqIC0xICogTWF0aC5mbG9vcigwLjMgLyAwLjQpLFxuICAgICAgMyAqIC0xICogTWF0aC5mbG9vcigwLjcgLyAwLjcpLCA0ICogLTEgKiBNYXRoLmZsb29yKDAuOTEgLyAwLjE1KVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnRzOiBicm9hZGNhc3RzIHNjYWxhciBhbmQgVGVuc29yMUQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnNjYWxhcigwLjcpO1xuICAgIGNvbnN0IGIgPSB0Zi50ZW5zb3IxZChbMC4yLCAwLjMsIDAuNCwgMC41XSk7XG4gICAgY29uc3QgZHkgPSB0Zi50ZW5zb3IxZChbMSwgMiwgMywgNF0pO1xuXG4gICAgY29uc3QgZ3JhZHMgPSB0Zi5ncmFkcygoYSwgYikgPT4gdGYubW9kKGEsIGIpKTtcbiAgICBjb25zdCBbZGEsIGRiXSA9IGdyYWRzKFthLCBiXSwgZHkpO1xuXG4gICAgZXhwZWN0KGRhLnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdChkYi5zaGFwZSkudG9FcXVhbChiLnNoYXBlKTtcbiAgICBleHBlY3QoZGEuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3QoZGIuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRhLmRhdGEoKSwgWzEgKyAyICsgMyArIDRdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkYi5kYXRhKCksIFtcbiAgICAgIDEgKiAtMSAqIE1hdGguZmxvb3IoMC43IC8gMC4yKSwgMiAqIC0xICogTWF0aC5mbG9vcigwLjcgLyAwLjMpLFxuICAgICAgMyAqIC0xICogTWF0aC5mbG9vcigwLjcgLyAwLjQpLCA0ICogLTEgKiBNYXRoLmZsb29yKDAuNyAvIDAuNSlcbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ2Jyb2FkY2FzdHMgVGVuc29yMUQgYW5kIFRlbnNvcjJEJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMC41LCAwLjNdKTtcbiAgICBjb25zdCBiID0gdGYudGVuc29yMmQoWzAuMiwgMC40LCAwLjcsIDAuMTVdLCBbMiwgMl0pO1xuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yMmQoWzEsIDIsIDMsIDRdLCBbMiwgMl0pO1xuXG4gICAgY29uc3QgZ3JhZHMgPSB0Zi5ncmFkcygoYSwgYikgPT4gdGYubW9kKGEsIGIpKTtcbiAgICBjb25zdCBbZGEsIGRiXSA9IGdyYWRzKFthLCBiXSwgZHkpO1xuXG4gICAgZXhwZWN0KGRhLnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdChkYi5zaGFwZSkudG9FcXVhbChiLnNoYXBlKTtcbiAgICBleHBlY3QoZGEuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3QoZGIuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcblxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRhLmRhdGEoKSwgWzEgKiAxICsgMyAqIDEsIDIgKiAxICsgNCAqIDFdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkYi5kYXRhKCksIFtcbiAgICAgIDEgKiAtMSAqIE1hdGguZmxvb3IoMC41IC8gMC4yKSwgMiAqIC0xICogTWF0aC5mbG9vcigwLjMgLyAwLjQpLFxuICAgICAgMyAqIC0xICogTWF0aC5mbG9vcigwLjUgLyAwLjcpLCA0ICogLTEgKiBNYXRoLmZsb29yKDAuMyAvIDAuMTUpXG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3Mgd2hlbiBwYXNzZWQgYSBhcyBhIG5vbi10ZW5zb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLm1vZCh7fSBhcyB0Zi5UZW5zb3IsIHRmLnNjYWxhcigxKSkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0FyZ3VtZW50ICdhJyBwYXNzZWQgdG8gJ21vZCcgbXVzdCBiZSBhIFRlbnNvci8pO1xuICB9KTtcbiAgaXQoJ3Rocm93cyB3aGVuIHBhc3NlZCBiIGFzIGEgbm9uLXRlbnNvcicsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gdGYubW9kKHRmLnNjYWxhcigxKSwge30gYXMgdGYuVGVuc29yKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvQXJndW1lbnQgJ2InIHBhc3NlZCB0byAnbW9kJyBtdXN0IGJlIGEgVGVuc29yLyk7XG4gIH0pO1xuXG4gIGl0KCdhY2NlcHRzIGEgdGVuc29yLWxpa2Ugb2JqZWN0JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSBbWzAuNSwgM10sIFstMC4xLCAtNF1dO1xuICAgIGNvbnN0IGIgPSBbWzAuMiwgMC40XSwgWzAuMjUsIDAuMTVdXTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5tb2QoYSwgYik7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFsyLCAyXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzAuMSwgMC4yLCAwLjE1LCAwLjA1XSk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3MgZm9yIHN0cmluZyB0ZW5zb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLm1vZCgncScsIDMpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9Bcmd1bWVudCAnYScgcGFzc2VkIHRvICdtb2QnIG11c3QgYmUgbnVtZXJpYy8pO1xuXG4gICAgZXhwZWN0KCgpID0+IHRmLm1vZCgzLCAncScpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9Bcmd1bWVudCAnYicgcGFzc2VkIHRvICdtb2QnIG11c3QgYmUgbnVtZXJpYy8pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZVdpdGhGbGFncygnYXRhbjInLCBBTExfRU5WUywgKCkgPT4ge1xuICBpdCgnc2FtZSBzaGFwZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhVmFsdWVzID0gWzEuMCwgMi4wLCAzLjAsIDQuMCwgNS4wLCA2LjBdO1xuICAgIGNvbnN0IGJWYWx1ZXMgPSBbMS4wLCAyLjUsIDMuNSwgNC41LCAyLjAsIDUuMF07XG5cbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoYVZhbHVlcywgWzIsIDNdKTtcbiAgICBjb25zdCBjID0gdGYudGVuc29yMmQoYlZhbHVlcywgWzIsIDNdKTtcblxuICAgIGNvbnN0IHIgPSB0Zi5hdGFuMihhLCBjKTtcbiAgICBjb25zdCBleHBlY3RlZCA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhLnNpemU7IGkrKykge1xuICAgICAgZXhwZWN0ZWRbaV0gPSBNYXRoLmF0YW4yKGFWYWx1ZXNbaV0sIGJWYWx1ZXNbaV0pO1xuICAgIH1cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByLmRhdGEoKSwgZXhwZWN0ZWQpO1xuICB9KTtcblxuICBpdCgndXNlcyBjaGFpbmluZycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhVmFsdWVzID0gWzEuMCwgMi4wLCAzLjAsIDQuMCwgNS4wLCA2LjBdO1xuICAgIGNvbnN0IGJWYWx1ZXMgPSBbMS4wLCAyLjUsIDMuNSwgNC41LCAyLjAsIDUuMF07XG5cbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoYVZhbHVlcywgWzIsIDNdKTtcbiAgICBjb25zdCBiID0gdGYudGVuc29yMmQoYlZhbHVlcywgWzIsIDNdKTtcblxuICAgIGNvbnN0IHIgPSBhLmF0YW4yKGIpO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGEuc2l6ZTsgaSsrKSB7XG4gICAgICBleHBlY3RlZFtpXSA9IE1hdGguYXRhbjIoYVZhbHVlc1tpXSwgYlZhbHVlc1tpXSk7XG4gICAgfVxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHIuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCdwcm9wYWdhdGVzIE5hTnMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKFsxLjAsIDIuMF0sIFsyLCAxXSk7XG4gICAgY29uc3QgYyA9IHRmLnRlbnNvcjJkKFszLjAsIE5hTl0sIFsyLCAxXSk7XG5cbiAgICBjb25zdCByID0gdGYuYXRhbjIoYSwgYyk7XG5cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByLmRhdGEoKSwgW01hdGguYXRhbjIoMS4wLCAzLjApLCBOYU5dKTtcbiAgfSk7XG5cbiAgaXQoJ2Jyb2FkY2FzdGluZyBzYW1lIHJhbmsgVGVuc29ycyBkaWZmZXJlbnQgc2hhcGUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYVZhbHVlcyA9IFsxLjAsIDIuMCwgLTMuMCwgLTQuMF07XG4gICAgY29uc3QgYlZhbHVlcyA9IFsyLjAsIDMuMF07XG5cbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoYVZhbHVlcywgWzIsIDJdKTtcbiAgICBjb25zdCBiID0gdGYudGVuc29yMmQoYlZhbHVlcywgWzIsIDFdKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmF0YW4yKGEsIGIpO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbMiwgMl0pO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gW1xuICAgICAgTWF0aC5hdGFuMigxLjAsIDIuMCksIE1hdGguYXRhbjIoMi4wLCAyLjApLCBNYXRoLmF0YW4yKC0zLjAsIDMuMCksXG4gICAgICBNYXRoLmF0YW4yKC00LjAsIDMuMClcbiAgICBdO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyB3aGVuIHBhc3NlZCB0ZW5zb3JzIG9mIGRpZmZlcmVudCBzaGFwZXMnLCAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKFsxLCAyLCAtMywgLTQsIDUsIDZdLCBbMiwgM10pO1xuICAgIGNvbnN0IGIgPSB0Zi50ZW5zb3IyZChbNSwgMywgNCwgLTddLCBbMiwgMl0pO1xuXG4gICAgZXhwZWN0KCgpID0+IHRmLmF0YW4yKGEsIGIpKS50b1Rocm93RXJyb3IoKTtcbiAgICBleHBlY3QoKCkgPT4gdGYuYXRhbjIoYiwgYSkpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndXBjYXN0cyB3aGVuIGR0eXBlcyBkb250IG1hdGNoJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGFWYWx1ZXMgPSBbMS4wLCAyLjAsIDMuMCwgNC4wLCA1LjAsIDYuMF07XG4gICAgY29uc3QgYlZhbHVlcyA9IFsxLCAyLCAzLCA0LCAyLCA1XTtcblxuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChhVmFsdWVzLCBbMiwgM10sICdmbG9hdDMyJyk7XG4gICAgY29uc3QgYyA9IHRmLnRlbnNvcjJkKGJWYWx1ZXMsIFsyLCAzXSwgJ2ludDMyJyk7XG5cbiAgICBjb25zdCByID0gdGYuYXRhbjIoYSwgYyk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYS5zaXplOyBpKyspIHtcbiAgICAgIGV4cGVjdGVkW2ldID0gTWF0aC5hdGFuMihhVmFsdWVzW2ldLCBiVmFsdWVzW2ldKTtcbiAgICB9XG4gICAgZXhwZWN0KHIuc2hhcGUpLnRvRXF1YWwoWzIsIDNdKTtcbiAgICBleHBlY3Qoci5kdHlwZSkudG9CZSgnZmxvYXQzMicpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHIuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCdhdGFuMiBvZiBzY2FsYXIgYW5kIGFycmF5IHByb3BhZ2F0ZXMgTmFOcycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBjID0gdGYuc2NhbGFyKE5hTik7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKFsxLCAyLCAzXSwgWzEsIDNdKTtcblxuICAgIGNvbnN0IHIgPSB0Zi5hdGFuMihjLCBhKTtcblxuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IHIuZGF0YSgpLCBbTmFOLCBOYU4sIE5hTl0pO1xuICB9KTtcblxuICBpdCgnYXRhbjIgb2Ygc2NhbGFyIGFuZCBhcnJheScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhVmFsdWVzID0gWzEsIDIsIDMsIDQsIDUsIDZdO1xuXG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKGFWYWx1ZXMsIFsyLCAzXSk7XG4gICAgY29uc3QgYyA9IHRmLnNjYWxhcigyKTtcblxuICAgIGNvbnN0IHIgPSB0Zi5hdGFuMihhLCBjKTtcbiAgICBjb25zdCBleHBlY3RlZCA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhLnNpemU7IGkrKykge1xuICAgICAgZXhwZWN0ZWRbaV0gPSBNYXRoLmF0YW4yKGFWYWx1ZXNbaV0sIDIpO1xuICAgIH1cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByLmRhdGEoKSwgZXhwZWN0ZWQpO1xuICB9KTtcblxuICBpdCgnYXRhbjIgdmVjNCBOYU5zJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGFWYWx1ZXMgPSBbMS4wLCAyLjAsIDMuMCwgNC4wXTtcbiAgICBjb25zdCBjVmFsdWVzID0gWzMuMCwgTmFOLCAzLjAsIDQuMF07XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKGFWYWx1ZXMsIFs0LCAxXSk7XG4gICAgY29uc3QgYyA9IHRmLnRlbnNvcjJkKGNWYWx1ZXMsIFs0LCAxXSk7XG5cbiAgICBjb25zdCByID0gdGYuYXRhbjIoYSwgYyk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYS5zaXplOyBpKyspIHtcbiAgICAgIGV4cGVjdGVkW2ldID0gTWF0aC5hdGFuMihhVmFsdWVzW2ldLCBjVmFsdWVzW2ldKTtcbiAgICB9XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgci5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ2F0YW4yIHZlYzQgYWxsIE5hTnMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYVZhbHVlcyA9IFtOYU4sIDIuMCwgTmFOLCBOYU5dO1xuICAgIGNvbnN0IGNWYWx1ZXMgPSBbMy4wLCBOYU4sIDMuMCwgNC4wXTtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoYVZhbHVlcywgWzQsIDFdKTtcbiAgICBjb25zdCBjID0gdGYudGVuc29yMmQoY1ZhbHVlcywgWzQsIDFdKTtcblxuICAgIGNvbnN0IHIgPSB0Zi5hdGFuMihhLCBjKTtcbiAgICBjb25zdCBleHBlY3RlZCA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhLnNpemU7IGkrKykge1xuICAgICAgZXhwZWN0ZWRbaV0gPSBNYXRoLmF0YW4yKGFWYWx1ZXNbaV0sIGNWYWx1ZXNbaV0pO1xuICAgIH1cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByLmRhdGEoKSwgZXhwZWN0ZWQpO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnQ6IFNjYWxhcicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYuc2NhbGFyKDUpO1xuICAgIGNvbnN0IGIgPSB0Zi5zY2FsYXIoMik7XG4gICAgY29uc3QgZHkgPSB0Zi5zY2FsYXIoNCk7XG5cbiAgICBjb25zdCBncmFkcyA9IHRmLmdyYWRzKChhLCBiKSA9PiB0Zi5hdGFuMihhLCBiKSk7XG4gICAgY29uc3QgW2RhLCBkYl0gPSBncmFkcyhbYSwgYl0sIGR5KTtcblxuICAgIGV4cGVjdChkYS5zaGFwZSkudG9FcXVhbChhLnNoYXBlKTtcbiAgICBleHBlY3QoZGEuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkYS5kYXRhKCksIFs0ICogMiAvIDI5XSk7XG5cbiAgICBleHBlY3QoZGIuc2hhcGUpLnRvRXF1YWwoYi5zaGFwZSk7XG4gICAgZXhwZWN0KGRiLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZGIuZGF0YSgpLCBbNCAqIC01IC8gMjldKTtcbiAgfSk7XG5cbiAgaXQoJ2dyYWRpZW50IHdpdGggY2xvbmVzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi5zY2FsYXIoNSk7XG4gICAgY29uc3QgYiA9IHRmLnNjYWxhcigyKTtcbiAgICBjb25zdCBkeSA9IHRmLnNjYWxhcig0KTtcblxuICAgIGNvbnN0IGdyYWRzID0gdGYuZ3JhZHMoKGEsIGIpID0+IHRmLmF0YW4yKGEuY2xvbmUoKSwgYi5jbG9uZSgpKS5jbG9uZSgpKTtcbiAgICBjb25zdCBbZGEsIGRiXSA9IGdyYWRzKFthLCBiXSwgZHkpO1xuXG4gICAgZXhwZWN0KGRhLnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdChkYS5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRhLmRhdGEoKSwgWzQgKiAyIC8gMjldKTtcblxuICAgIGV4cGVjdChkYi5zaGFwZSkudG9FcXVhbChiLnNoYXBlKTtcbiAgICBleHBlY3QoZGIuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkYi5kYXRhKCksIFs0ICogLTUgLyAyOV0pO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnQ6IFRlbnNvcjFEJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMSwgMiwgM10pO1xuICAgIGNvbnN0IGIgPSB0Zi50ZW5zb3IxZChbMywgNCwgNV0pO1xuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yMWQoWzEsIDEwLCAyMF0pO1xuXG4gICAgY29uc3QgZ3JhZHMgPSB0Zi5ncmFkcygoYSwgYikgPT4gdGYuYXRhbjIoYSwgYikpO1xuICAgIGNvbnN0IFtkYSwgZGJdID0gZ3JhZHMoW2EsIGJdLCBkeSk7XG5cbiAgICBleHBlY3QoZGEuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0KGRiLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZGEuZGF0YSgpLCBbMSAqIDMgLyAxMCwgMTAgKiA0IC8gMjAsIDIwICogNSAvIDM0XSk7XG5cbiAgICBleHBlY3QoZGIuc2hhcGUpLnRvRXF1YWwoYi5zaGFwZSk7XG4gICAgZXhwZWN0KGRiLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgIGF3YWl0IGRiLmRhdGEoKSwgWy0xICogMSAvIDEwLCAtMTAgKiAyIC8gMjAsIC0yMCAqIDMgLyAzNF0pO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnQ6IFRlbnNvcjJEJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChbMywgMSwgMiwgM10sIFsyLCAyXSk7XG4gICAgY29uc3QgYiA9IHRmLnRlbnNvcjJkKFsxLCAzLCA0LCA1XSwgWzIsIDJdKTtcbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjJkKFsxLCAxMCwgMTUsIDIwXSwgWzIsIDJdKTtcblxuICAgIGNvbnN0IGdyYWRzID0gdGYuZ3JhZHMoKGEsIGIpID0+IHRmLmF0YW4yKGEsIGIpKTtcbiAgICBjb25zdCBbZGEsIGRiXSA9IGdyYWRzKFthLCBiXSwgZHkpO1xuXG4gICAgZXhwZWN0KGRhLnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdChkYS5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKFxuICAgICAgICBhd2FpdCBkYS5kYXRhKCksIFsxICogMSAvIDEwLCAxMCAqIDMgLyAxMCwgMTUgKiA0IC8gMjAsIDIwICogNSAvIDM0XSk7XG5cbiAgICBleHBlY3QoZGIuc2hhcGUpLnRvRXF1YWwoYi5zaGFwZSk7XG4gICAgZXhwZWN0KGRiLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgIGF3YWl0IGRiLmRhdGEoKSxcbiAgICAgICAgWy0xICogMyAvIDEwLCAtMTAgKiAxIC8gMTAsIC0xNSAqIDIgLyAyMCwgLTIwICogMyAvIDM0XSk7XG4gIH0pO1xuXG4gIGl0KCdncmFkaWVudDogc2NhbGFyIC8gVGVuc29yMUQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnNjYWxhcigyKTtcbiAgICBjb25zdCBiID0gdGYudGVuc29yMWQoWzMsIDQsIDVdKTtcbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjFkKFs2LCA3LCA4XSk7XG5cbiAgICBjb25zdCBncmFkcyA9IHRmLmdyYWRzKChhLCBiKSA9PiB0Zi5hdGFuMihhLCBiKSk7XG4gICAgY29uc3QgW2RhLCBkYl0gPSBncmFkcyhbYSwgYl0sIGR5KTtcblxuICAgIGV4cGVjdChkYS5zaGFwZSkudG9FcXVhbChhLnNoYXBlKTtcbiAgICBleHBlY3QoZGEuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkYS5kYXRhKCksIFs2ICogMyAvIDEzICsgNyAqIDQgLyAyMCArIDggKiA1IC8gMjldKTtcblxuICAgIGV4cGVjdChkYi5zaGFwZSkudG9FcXVhbChiLnNoYXBlKTtcbiAgICBleHBlY3QoZGIuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBkYi5kYXRhKCksIFstNiAqIDIgLyAxMywgLTcgKiAyIC8gMjAsIC04ICogMiAvIDI5XSk7XG4gIH0pO1xuXG4gIGl0KCdncmFkaWVudDogVGVuc29yMkQgLyBzY2FsYXInLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKFtbMiwgM10sIFs0LCA1XV0sIFsyLCAyXSk7XG4gICAgY29uc3QgYiA9IHRmLnNjYWxhcigyKTtcbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjJkKFtbNiwgN10sIFs4LCA5XV0sIFsyLCAyXSk7XG5cbiAgICBjb25zdCBncmFkcyA9IHRmLmdyYWRzKChhLCBiKSA9PiB0Zi5hdGFuMihhLCBiKSk7XG4gICAgY29uc3QgW2RhLCBkYl0gPSBncmFkcyhbYSwgYl0sIGR5KTtcblxuICAgIGV4cGVjdChkYS5zaGFwZSkudG9FcXVhbChhLnNoYXBlKTtcbiAgICBleHBlY3QoZGEuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShcbiAgICAgICAgYXdhaXQgZGEuZGF0YSgpLCBbNiAqIDIgLyA4LCA3ICogMiAvIDEzLCA4ICogMiAvIDIwLCA5ICogMiAvIDI5XSk7XG5cbiAgICBleHBlY3QoZGIuc2hhcGUpLnRvRXF1YWwoYi5zaGFwZSk7XG4gICAgZXhwZWN0KGRiLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgIGF3YWl0IGRiLmRhdGEoKSxcbiAgICAgICAgWy02ICogMiAvIDggKyAtNyAqIDMgLyAxMyArIC04ICogNCAvIDIwICsgLTkgKiA1IC8gMjldKTtcbiAgfSk7XG5cbiAgaXQoJ2dyYWRpZW50OiBUZW5zb3IyRCAvIFRlbnNvcjJEIHcvIGJyb2FkY2FzdCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoWzMsIDRdLCBbMiwgMV0pO1xuICAgIGNvbnN0IGIgPSB0Zi50ZW5zb3IyZChbWzIsIDNdLCBbNCwgNV1dLCBbMiwgMl0pO1xuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yMmQoW1s2LCA3XSwgWzgsIDldXSwgWzIsIDJdKTtcblxuICAgIGNvbnN0IGdyYWRzID0gdGYuZ3JhZHMoKGEsIGIpID0+IHRmLmF0YW4yKGEsIGIpKTtcbiAgICBjb25zdCBbZGEsIGRiXSA9IGdyYWRzKFthLCBiXSwgZHkpO1xuXG4gICAgZXhwZWN0KGRhLnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdChkYS5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKFxuICAgICAgICBhd2FpdCBkYS5kYXRhKCksIFs2ICogMiAvIDEzICsgNyAqIDMgLyAxOCwgOCAqIDQgLyAzMiArIDkgKiA1IC8gNDFdKTtcblxuICAgIGV4cGVjdChkYi5zaGFwZSkudG9FcXVhbChiLnNoYXBlKTtcbiAgICBleHBlY3QoZGIuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShcbiAgICAgICAgYXdhaXQgZGIuZGF0YSgpLCBbLTYgKiAzIC8gMTMsIC03ICogMyAvIDE4LCAtOCAqIDQgLyAzMiwgLTkgKiA0IC8gNDFdKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyB3aGVuIHBhc3NlZCBhIGFzIGEgbm9uLXRlbnNvcicsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gdGYuYXRhbjIoe30gYXMgdGYuVGVuc29yLCB0Zi5zY2FsYXIoMSkpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9Bcmd1bWVudCAnYScgcGFzc2VkIHRvICdhdGFuMicgbXVzdCBiZSBhIFRlbnNvci8pO1xuICB9KTtcbiAgaXQoJ3Rocm93cyB3aGVuIHBhc3NlZCBiIGFzIGEgbm9uLXRlbnNvcicsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gdGYuYXRhbjIodGYuc2NhbGFyKDEpLCB7fSBhcyB0Zi5UZW5zb3IpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9Bcmd1bWVudCAnYicgcGFzc2VkIHRvICdhdGFuMicgbXVzdCBiZSBhIFRlbnNvci8pO1xuICB9KTtcblxuICBpdCgnYWNjZXB0cyBhIHRlbnNvci1saWtlIG9iamVjdCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gW1sxLCAyLCAzXSwgWzQsIDUsIDZdXTtcbiAgICBjb25zdCBjID0gMjtcblxuICAgIGNvbnN0IHIgPSB0Zi5hdGFuMihhLCBjKTtcbiAgICBjb25zdCBleHBlY3RlZCA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2OyBpKyspIHtcbiAgICAgIGV4cGVjdGVkW2ldID0gTWF0aC5hdGFuMihpICsgMSwgMik7XG4gICAgfVxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHIuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3MgZm9yIHN0cmluZyB0ZW5zb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLmF0YW4yKCdxJywgMykpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0FyZ3VtZW50ICdhJyBwYXNzZWQgdG8gJ2F0YW4yJyBtdXN0IGJlIG51bWVyaWMvKTtcblxuICAgIGV4cGVjdCgoKSA9PiB0Zi5hdGFuMigzLCAncScpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9Bcmd1bWVudCAnYicgcGFzc2VkIHRvICdhdGFuMicgbXVzdCBiZSBudW1lcmljLyk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCdkaXYnLCBBTExfRU5WUywgKCkgPT4ge1xuICBpdCgnZGl2Tm9OYW4gZGl2aWRlIDAnLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gQnJvYWRjYXN0IGRpdiBhIHdpdGggYi5cbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzIsIDQsIDYsIDhdKTtcbiAgICBjb25zdCBiID0gdGYudGVuc29yMWQoWzAsIDAsIDAsIDBdKTtcblxuICAgIGNvbnN0IGMgPSBhLmRpdk5vTmFuKGIpO1xuICAgIGV4cGVjdChjLnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGMuZGF0YSgpLCBbMCwgMCwgMCwgMF0pO1xuICB9KTtcblxuICBpdCgnZGl2Tm9OYW4gZGl2aWRlIDAgYW5kIG5vbi0wJywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIEJyb2FkY2FzdCBkaXYgYSB3aXRoIGIuXG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsyLCA0LCA2LCA4XSk7XG4gICAgY29uc3QgYiA9IHRmLnRlbnNvcjFkKFsyLCAyLCAwLCA0XSk7XG5cbiAgICBjb25zdCBjID0gYS5kaXZOb05hbihiKTtcbiAgICBleHBlY3QoYy5zaGFwZSkudG9FcXVhbChhLnNoYXBlKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBjLmRhdGEoKSwgWzEsIDIsIDAsIDJdKTtcbiAgfSk7XG5cbiAgaXQoJ2Rpdk5vTmFuIGRpdmlkZSAwIGJyb2FkY2FzdCcsIGFzeW5jICgpID0+IHtcbiAgICAvLyBCcm9hZGNhc3QgZGl2IGEgd2l0aCBiLlxuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMiwgNCwgNiwgOF0pO1xuICAgIGNvbnN0IGIgPSB0Zi5zY2FsYXIoMCk7XG5cbiAgICBjb25zdCBjID0gYS5kaXZOb05hbihiKTtcbiAgICBleHBlY3QoYy5zaGFwZSkudG9FcXVhbChhLnNoYXBlKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBjLmRhdGEoKSwgWzAsIDAsIDAsIDBdKTtcbiAgfSk7XG59KTtcbiJdfQ==