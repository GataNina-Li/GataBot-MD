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
import * as tf from '../index';
import { ALL_ENVS, BROWSER_ENVS, describeWithFlags } from '../jasmine_util';
import { scalar, tensor1d, tensor2d } from '../ops/ops';
import { expectArraysEqual } from '../test_util';
import { expectArraysClose } from '../test_util';
import { encodeString } from '../util';
import { arrayBufferToBase64String, base64StringToArrayBuffer, basename, concatenateArrayBuffers, concatenateTypedArrays, stringByteLength, getFloat16Decoder } from './io_utils';
describe('concatenateTypedArrays', () => {
    it('Single float arrays', () => {
        const x = new Float32Array([1.1, 2.2, 3.3]);
        const buffer = concatenateTypedArrays([x]);
        expect(buffer.byteLength).toEqual(12);
        expect(new Float32Array(buffer, 0, 3)).toEqual(x);
    });
    it('Float arrays', () => {
        const x = new Float32Array([1.1, 2.2, 3.3]);
        const y = new Float32Array([-1.1, -2.2, -3.3]);
        const buffer = concatenateTypedArrays([x, y]);
        expect(buffer.byteLength).toEqual(24);
        expect(new Float32Array(buffer, 0, 3)).toEqual(x);
        expect(new Float32Array(buffer, 12, 3)).toEqual(y);
    });
    it('Single int32 arrays', () => {
        const x = new Int32Array([11, 22, 33]);
        const buffer = concatenateTypedArrays([x]);
        expect(buffer.byteLength).toEqual(12);
        expect(new Int32Array(buffer, 0, 3)).toEqual(x);
    });
    it('Int32 arrays', () => {
        const x = new Int32Array([11, 22, 33]);
        const y = new Int32Array([-11, -22, -33]);
        const buffer = concatenateTypedArrays([x, y]);
        expect(buffer.byteLength).toEqual(24);
        expect(new Int32Array(buffer, 0, 3)).toEqual(x);
        expect(new Int32Array(buffer, 12, 3)).toEqual(y);
    });
    it('Single uint8 arrays', () => {
        const x = new Uint8Array([11, 22, 33]);
        const buffer = concatenateTypedArrays([x]);
        expect(buffer.byteLength).toEqual(3);
        expect(new Uint8Array(buffer, 0, 3)).toEqual(x);
    });
    it('Uint8 arrays', () => {
        const x = new Uint8Array([11, 22, 33]);
        const y = new Uint8Array([111, 122, 133]);
        const buffer = concatenateTypedArrays([x, y]);
        expect(buffer.byteLength).toEqual(6);
        expect(new Uint8Array(buffer, 0, 3)).toEqual(x);
        expect(new Uint8Array(buffer, 3, 3)).toEqual(y);
    });
    it('Mixed Uint8, Int32 and Float32 arrays', () => {
        const x = new Uint8Array([0, 1, 1, 0]);
        const y = new Int32Array([10, 20, 30, 40]);
        const z = new Float32Array([-1.1, -2.2, -3.3, -4.4]);
        const buffer = concatenateTypedArrays([x, y, z]);
        expect(buffer.byteLength).toEqual(1 * 4 + 4 * 4 + 4 * 4);
        expect(new Uint8Array(buffer, 0, 4)).toEqual(x);
        expect(new Int32Array(buffer, 4, 4)).toEqual(y);
        expect(new Float32Array(buffer, 20, 4)).toEqual(z);
    });
    it('Concatenate Float32Arrays from SubArrays', () => {
        const x1 = new Float32Array([1.1, 2.2, 3.3]);
        const x2 = new Float32Array([-1.1, -2.2, -3.3]);
        const xConcatenated = concatenateTypedArrays([x1, x2]);
        const y1 = new Float32Array(xConcatenated, 0, 3);
        const y2 = new Float32Array(xConcatenated, 3 * 4, 3);
        // At this point, the buffer of y1 is longer than than the actual byte
        // length of y1, because of the way y1 is constructed. The same is true for
        // y2.
        expect(y1.buffer.byteLength).toEqual(6 * 4);
        expect(y2.buffer.byteLength).toEqual(6 * 4);
        const yConcatenated = concatenateTypedArrays([y1, y2]);
        expect(yConcatenated.byteLength).toEqual(6 * 4);
        expect(new Float32Array(yConcatenated, 0, 3)).toEqual(x1);
        expect(new Float32Array(yConcatenated, 3 * 4, 3)).toEqual(x2);
    });
    it('Concatenate Int32Array from SubArrays', () => {
        const x1 = new Int32Array([11, 22, 33]);
        const x2 = new Int32Array([-11, -22, -33]);
        const xConcatenated = concatenateTypedArrays([x1, x2]);
        const y1 = new Int32Array(xConcatenated, 0, 3);
        const y2 = new Int32Array(xConcatenated, 3 * 4, 3);
        // At this point, the buffer of y1 is longer than than the actual byte
        // length of y1, because of the way y1 is constructed. The same is true for
        // y2.
        expect(y1.buffer.byteLength).toEqual(6 * 4);
        expect(y2.buffer.byteLength).toEqual(6 * 4);
        const yConcatenated = concatenateTypedArrays([y1, y2]);
        expect(yConcatenated.byteLength).toEqual(6 * 4);
        expect(new Int32Array(yConcatenated, 0, 3)).toEqual(x1);
        expect(new Int32Array(yConcatenated, 3 * 4, 3)).toEqual(x2);
    });
    it('Concatenate Uint8Array from SubArrays', () => {
        const x1 = new Uint8Array([11, 22, 33]);
        const x2 = new Uint8Array([44, 55, 66]);
        const xConcatenated = concatenateTypedArrays([x1, x2]);
        const y1 = new Uint8Array(xConcatenated, 0, 3);
        const y2 = new Uint8Array(xConcatenated, 3, 3);
        // At this point, the buffer of y1 is longer than than the actual byte
        // length of y1, because of the way y1 is constructed. The same is true for
        // y2.
        expect(y1.buffer.byteLength).toEqual(6);
        expect(y2.buffer.byteLength).toEqual(6);
        const yConcatenated = concatenateTypedArrays([y1, y2]);
        expect(yConcatenated.byteLength).toEqual(6);
        expect(new Uint8Array(yConcatenated, 0, 3)).toEqual(x1);
        expect(new Uint8Array(yConcatenated, 3, 3)).toEqual(x2);
    });
    it('Concatenate mixed TypedArrays from SubArrays', () => {
        const x1 = new Uint8Array([11, 22, 33, 44]);
        const x2 = new Int32Array([-44, -55, -66]);
        const x3 = new Float32Array([1.1, 2.2, 3.3]);
        const xConcatenated = concatenateTypedArrays([x1, x2, x3]);
        const y1 = new Uint8Array(xConcatenated, 0, 4);
        const y2 = new Int32Array(xConcatenated, 4, 3);
        const y3 = new Float32Array(xConcatenated, 4 + 3 * 4, 3);
        // At this point, the buffer of y1 is longer than than the actual byte
        // length of y1, because of the way y1 is constructed. The same is true for
        // y2 and y3.
        expect(y1.buffer.byteLength).toEqual(4 + 3 * 4 + 3 * 4);
        expect(y2.buffer.byteLength).toEqual(4 + 3 * 4 + 3 * 4);
        expect(y3.buffer.byteLength).toEqual(4 + 3 * 4 + 3 * 4);
        const yConcatenated = concatenateTypedArrays([y1, y2, y3]);
        expect(yConcatenated.byteLength).toEqual(4 + 3 * 4 + 3 * 4);
        expect(new Uint8Array(yConcatenated, 0, 4)).toEqual(x1);
        expect(new Int32Array(yConcatenated, 4, 3)).toEqual(x2);
        expect(new Float32Array(yConcatenated, 4 + 3 * 4, 3)).toEqual(x3);
    });
    it('null and undefined inputs', () => {
        expect(() => concatenateTypedArrays(null)).toThrow();
        expect(() => concatenateTypedArrays(undefined)).toThrow();
    });
    it('empty input array', () => {
        expect(concatenateTypedArrays([]).byteLength).toEqual(0);
    });
    it('Unsupported dtype', () => {
        const x = new Int16Array([0, 1, 1, 0]);
        // tslint:disable-next-line:no-any
        expect(() => concatenateTypedArrays([x]))
            .toThrowError(/Unsupported TypedArray subtype: Int16Array/);
    });
});
describeWithFlags('encodeWeights', ALL_ENVS, () => {
    it('Float32 tensors as NamedTensorMap', async () => {
        const tensors = {
            x1: tensor2d([[10, 20], [30, 40]]),
            x2: scalar(42),
            x3: tensor1d([-1.3, -3.7, 1.3, 3.7]),
        };
        const dataAndSpecs = await tf.io.encodeWeights(tensors);
        const data = dataAndSpecs.data;
        const specs = dataAndSpecs.specs;
        expect(data.byteLength).toEqual(4 * (4 + 1 + 4));
        expect(new Float32Array(data, 0, 4)).toEqual(new Float32Array([
            10, 20, 30, 40
        ]));
        expect(new Float32Array(data, 16, 1)).toEqual(new Float32Array([42]));
        expect(new Float32Array(data, 20, 4)).toEqual(new Float32Array([
            -1.3, -3.7, 1.3, 3.7
        ]));
        expect(specs).toEqual([
            {
                name: 'x1',
                dtype: 'float32',
                shape: [2, 2],
            },
            {
                name: 'x2',
                dtype: 'float32',
                shape: [],
            },
            {
                name: 'x3',
                dtype: 'float32',
                shape: [4],
            }
        ]);
    });
    it('Float32 tensors as NamedTensor array', async () => {
        const tensors = [
            { name: 'x1234', tensor: tensor2d([[10, 20], [30, 40]]) }, {
                name: 'a42',
                tensor: scalar(42),
            },
            { name: 'b41', tensor: tensor1d([-1.3, -3.7, 1.3, 3.7]) }
        ];
        const dataAndSpecs = await tf.io.encodeWeights(tensors);
        const data = dataAndSpecs.data;
        const specs = dataAndSpecs.specs;
        expect(data.byteLength).toEqual(4 * (4 + 1 + 4));
        expect(new Float32Array(data, 0, 4)).toEqual(new Float32Array([
            10, 20, 30, 40
        ]));
        expect(new Float32Array(data, 16, 1)).toEqual(new Float32Array([42]));
        expect(new Float32Array(data, 20, 4)).toEqual(new Float32Array([
            -1.3, -3.7, 1.3, 3.7
        ]));
        expect(specs).toEqual([
            {
                name: 'x1234',
                dtype: 'float32',
                shape: [2, 2],
            },
            {
                name: 'a42',
                dtype: 'float32',
                shape: [],
            },
            {
                name: 'b41',
                dtype: 'float32',
                shape: [4],
            }
        ]);
    });
    it('Empty NamedTensor array', async () => {
        const tensors = [];
        const dataAndSpecs = await tf.io.encodeWeights(tensors);
        const data = dataAndSpecs.data;
        const specs = dataAndSpecs.specs;
        expect(data.byteLength).toEqual(0);
        expect(specs).toEqual([]);
    });
    it('Int32 tensors', async () => {
        const tensors = {
            x1: tensor2d([[10, 20], [30, 40]], [2, 2], 'int32'),
            x2: scalar(42, 'int32'),
            x3: tensor1d([-1, -3, -3, -7], 'int32'),
        };
        const dataAndSpecs = await tf.io.encodeWeights(tensors);
        const data = dataAndSpecs.data;
        const specs = dataAndSpecs.specs;
        expect(data.byteLength).toEqual(4 * (4 + 1 + 4));
        expect(new Int32Array(data, 0, 4)).toEqual(new Int32Array([
            10, 20, 30, 40
        ]));
        expect(new Int32Array(data, 16, 1)).toEqual(new Int32Array([42]));
        expect(new Int32Array(data, 20, 4)).toEqual(new Int32Array([
            -1, -3, -3, -7
        ]));
        expect(specs).toEqual([
            {
                name: 'x1',
                dtype: 'int32',
                shape: [2, 2],
            },
            {
                name: 'x2',
                dtype: 'int32',
                shape: [],
            },
            {
                name: 'x3',
                dtype: 'int32',
                shape: [4],
            }
        ]);
    });
    it('Bool tensors', async () => {
        const tensors = {
            x1: tensor2d([[true, false], [false, true]], [2, 2], 'bool'),
            x2: scalar(false, 'bool'),
            x3: tensor1d([false, true, true, false], 'bool'),
        };
        const dataAndSpecs = await tf.io.encodeWeights(tensors);
        const data = dataAndSpecs.data;
        const specs = dataAndSpecs.specs;
        expect(data.byteLength).toEqual(4 + 1 + 4);
        expect(new Uint8Array(data, 0, 4)).toEqual(new Uint8Array([1, 0, 0, 1]));
        expect(new Uint8Array(data, 4, 1)).toEqual(new Uint8Array([0]));
        expect(new Uint8Array(data, 5, 4)).toEqual(new Uint8Array([0, 1, 1, 0]));
        expect(specs).toEqual([
            {
                name: 'x1',
                dtype: 'bool',
                shape: [2, 2],
            },
            {
                name: 'x2',
                dtype: 'bool',
                shape: [],
            },
            {
                name: 'x3',
                dtype: 'bool',
                shape: [4],
            }
        ]);
    });
    it('Complex64 tensors', async () => {
        const tensors = {
            x1: tf.complex([1, 2], [1, 2]),
            x2: tf.complex(1, 2),
            x3: tf.complex([[1]], [[2]]),
        };
        const dataAndSpecs = await tf.io.encodeWeights(tensors);
        const data = dataAndSpecs.data;
        const specs = dataAndSpecs.specs;
        expect(data.byteLength).toEqual(8 * 4);
        expect(new Float32Array(data, 0, 4)).toEqual(new Float32Array([
            1, 1, 2, 2
        ]));
        expect(new Float32Array(data, 16, 2)).toEqual(new Float32Array([1, 2]));
        expect(new Float32Array(data, 24, 2)).toEqual(new Float32Array([1, 2]));
        expect(specs).toEqual([
            {
                name: 'x1',
                dtype: 'complex64',
                shape: [2],
            },
            {
                name: 'x2',
                dtype: 'complex64',
                shape: [],
            },
            {
                name: 'x3',
                dtype: 'complex64',
                shape: [1, 1],
            }
        ]);
    });
    it('String tensors', async () => {
        const tensors = {
            x1: tensor2d([['a', 'bc'], ['def', 'g']], [2, 2]),
            x2: scalar(''),
            x3: tensor1d(['здраво', 'поздрав']),
            x4: scalar('正常'),
            x5: scalar('hello') // Single string.
        };
        const dataAndSpecs = await tf.io.encodeWeights(tensors);
        const data = dataAndSpecs.data;
        const specs = dataAndSpecs.specs;
        const x1ByteLength = 7 + 4 * 4; // 7 ascii chars + 4 ints.
        const x2ByteLength = 4; // No chars + 1 int.
        const x3ByteLength = 13 * 2 + 2 * 4; // 13 cyrillic letters + 2 ints.
        const x4ByteLength = 6 + 1 * 4; // 2 east asian letters + 1 int.
        const x5ByteLength = 5 + 1 * 4; // 5 ascii chars + 1 int.
        expect(data.byteLength)
            .toEqual(x1ByteLength + x2ByteLength + x3ByteLength + x4ByteLength +
            x5ByteLength);
        // x1 'a'.
        expect(new Uint32Array(data, 0, 1)[0]).toBe(1);
        expect(new Uint8Array(data, 4, 1)).toEqual(encodeString('a'));
        // x1 'bc'.
        expect(new Uint32Array(data.slice(5, 9))[0]).toBe(2);
        expect(new Uint8Array(data, 9, 2)).toEqual(encodeString('bc'));
        // x1 'def'.
        expect(new Uint32Array(data.slice(11, 15))[0]).toBe(3);
        expect(new Uint8Array(data, 15, 3)).toEqual(encodeString('def'));
        // x1 'g'.
        expect(new Uint32Array(data.slice(18, 22))[0]).toBe(1);
        expect(new Uint8Array(data, 22, 1)).toEqual(encodeString('g'));
        // x2 is empty string.
        expect(new Uint32Array(data.slice(23, 27))[0]).toBe(0);
        // x3 'здраво'.
        expect(new Uint32Array(data.slice(27, 31))[0]).toBe(12);
        expect(new Uint8Array(data, 31, 12)).toEqual(encodeString('здраво'));
        // x3 'поздрав'.
        expect(new Uint32Array(data.slice(43, 47))[0]).toBe(14);
        expect(new Uint8Array(data, 47, 14)).toEqual(encodeString('поздрав'));
        // x4 '正常'.
        expect(new Uint32Array(data.slice(61, 65))[0]).toBe(6);
        expect(new Uint8Array(data, 65, 6)).toEqual(encodeString('正常'));
        // x5 'hello'.
        expect(new Uint32Array(data.slice(71, 75))[0]).toBe(5);
        expect(new Uint8Array(data, 75, 5)).toEqual(encodeString('hello'));
        expect(specs).toEqual([
            { name: 'x1', dtype: 'string', shape: [2, 2] },
            { name: 'x2', dtype: 'string', shape: [] },
            { name: 'x3', dtype: 'string', shape: [2] },
            { name: 'x4', dtype: 'string', shape: [] },
            { name: 'x5', dtype: 'string', shape: [] }
        ]);
    });
    it('Mixed dtype tensors', async () => {
        const tensors = {
            x1: tensor2d([[10, 20], [30, 40]], [2, 2], 'int32'),
            x2: scalar(13.37, 'float32'),
            x3: tensor1d([true, false, false, true], 'bool'),
            x4: tf.complex([1, 1], [2, 2])
        };
        const dataAndSpecs = await tf.io.encodeWeights(tensors);
        const data = dataAndSpecs.data;
        const specs = dataAndSpecs.specs;
        expect(data.byteLength).toEqual(4 * 4 + 4 * 1 + 1 * 4 + 4 * 4);
        expect(new Int32Array(data, 0, 4)).toEqual(new Int32Array([
            10, 20, 30, 40
        ]));
        expect(new Float32Array(data, 16, 1)).toEqual(new Float32Array([13.37]));
        expect(new Uint8Array(data, 20, 4)).toEqual(new Uint8Array([1, 0, 0, 1]));
        expect(new Float32Array(data, 24, 4)).toEqual(new Float32Array([
            1, 2, 1, 2
        ]));
        expect(specs).toEqual([
            {
                name: 'x1',
                dtype: 'int32',
                shape: [2, 2],
            },
            {
                name: 'x2',
                dtype: 'float32',
                shape: [],
            },
            {
                name: 'x3',
                dtype: 'bool',
                shape: [4],
            },
            {
                name: 'x4',
                dtype: 'complex64',
                shape: [2],
            }
        ]);
    });
});
describeWithFlags('decodeWeights', {}, () => {
    it('Mixed dtype tensors', async () => {
        const tensors = {
            x1: tensor2d([[10, 20], [30, 40]], [2, 2], 'int32'),
            x2: scalar(13.37, 'float32'),
            x3: tensor1d([true, false, false], 'bool'),
            x4: tensor2d([['здраво', 'a'], ['b', 'c']], [2, 2], 'string'),
            x5: tensor1d([''], 'string'),
            x6: scalar('hello'),
            y1: tensor2d([-10, -20, -30], [3, 1], 'float32'),
            y2: tf.complex([1, 1], [2, 2])
        };
        const dataAndSpecs = await tf.io.encodeWeights(tensors);
        const data = dataAndSpecs.data;
        const specs = dataAndSpecs.specs;
        const decoded = tf.io.decodeWeights(data, specs);
        expect(Object.keys(decoded).length).toEqual(8);
        expectArraysEqual(await decoded['x1'].data(), await tensors['x1'].data());
        expectArraysEqual(await decoded['x2'].data(), await tensors['x2'].data());
        expectArraysEqual(await decoded['x3'].data(), await tensors['x3'].data());
        expectArraysEqual(await decoded['x4'].data(), await tensors['x4'].data());
        expectArraysEqual(await decoded['x5'].data(), await tensors['x5'].data());
        expectArraysEqual(await decoded['x6'].data(), await tensors['x6'].data());
        expectArraysEqual(await decoded['y1'].data(), await tensors['y1'].data());
        expectArraysEqual(await decoded['y2'].data(), await tensors['y2'].data());
    });
    it('Unsupported dtype raises Error', () => {
        const buffer = new ArrayBuffer(4);
        // tslint:disable-next-line:no-any
        const specs = [
            {
                name: 'x',
                dtype: 'int16',
                shape: [],
            },
            { name: 'y', dtype: 'int16', shape: [] }
        ];
        expect(() => tf.io.decodeWeights(buffer, specs))
            .toThrowError(/Unsupported dtype in weight \'x\': int16/);
    });
    it('support quantization uint8 weights', async () => {
        const manifestSpecs = [
            {
                'name': 'weight0',
                'dtype': 'float32',
                'shape': [3],
                'quantization': { 'min': -1, 'scale': 0.1, 'dtype': 'uint8' }
            },
            {
                'name': 'weight1',
                'dtype': 'int32',
                'shape': [3],
                'quantization': { 'min': -1, 'scale': 0.1, 'dtype': 'uint8' }
            }
        ];
        const data = new Uint8Array([0, 48, 255, 0, 48, 255]);
        const decoded = tf.io.decodeWeights(data.buffer, manifestSpecs);
        const weight0 = decoded['weight0'];
        expectArraysClose(await weight0.data(), [-1, 3.8, 24.5]);
        expect(weight0.shape).toEqual([3]);
        expect(weight0.dtype).toEqual('float32');
        const weight1 = decoded['weight1'];
        expectArraysEqual(await weight1.data(), [-1, 4, 25]);
        expect(weight1.shape).toEqual([3]);
        expect(weight1.dtype).toEqual('int32');
    });
    it('support quantization uint16 weights', async () => {
        const manifestSpecs = [
            {
                'name': 'weight0',
                'dtype': 'float32',
                'shape': [3],
                'quantization': { 'min': -1, 'scale': 0.1, 'dtype': 'uint16' }
            },
            {
                'name': 'weight1',
                'dtype': 'int32',
                'shape': [3],
                'quantization': { 'min': -1, 'scale': 0.1, 'dtype': 'uint16' }
            }
        ];
        const data = new Uint16Array([0, 48, 255, 0, 48, 255]);
        const decoded = tf.io.decodeWeights(data.buffer, manifestSpecs);
        const weight0 = decoded['weight0'];
        expectArraysClose(await weight0.data(), [-1, 3.8, 24.5]);
        expect(weight0.shape).toEqual([3]);
        expect(weight0.dtype).toEqual('float32');
        const weight1 = decoded['weight1'];
        expectArraysEqual(await weight1.data(), [-1, 4, 25]);
        expect(weight1.shape).toEqual([3]);
        expect(weight1.dtype).toEqual('int32');
    });
    it('support quantization float16 weights', async () => {
        const manifestSpecs = [
            {
                name: 'weight0',
                dtype: 'float32',
                shape: [3],
                quantization: { dtype: 'float16' },
            },
        ];
        const data = new Uint16Array([13312, 14336, 14848]);
        const decoded = tf.io.decodeWeights(data.buffer, manifestSpecs);
        const weight0 = decoded['weight0'];
        expectArraysClose(await weight0.data(), [0.25, 0.5, 0.75]);
        expect(weight0.shape).toEqual([3]);
        expect(weight0.dtype).toEqual('float32');
    });
});
describe('stringByteLength', () => {
    it('ASCII only', () => {
        const str = '_Lorem ipsum 1337!';
        expect(stringByteLength(str)).toEqual(str.length);
    });
    it('Mixed narrow and wide chars', () => {
        const str = 'aЖ文1';
        expect(stringByteLength(str.slice(0, 1))).toEqual(1);
        expect(stringByteLength(str.slice(0, 2))).toEqual(3);
        expect(stringByteLength(str.slice(0, 3))).toEqual(6);
        expect(stringByteLength(str.slice(0, 4))).toEqual(7);
    });
});
describeWithFlags('arrayBufferToBase64String-base64StringToArrayBuffer', BROWSER_ENVS, () => {
    it('Round trip', () => {
        // Generate some semi-random binary data.
        const x = [];
        for (let k = 0; k < 2; ++k) {
            for (let i = 0; i < 254; ++i) {
                x.push(i + k);
            }
            for (let i = 254; i >= 0; --i) {
                x.push(i + k);
            }
        }
        const buffer = Uint8Array.from(x).buffer;
        const base64Str = arrayBufferToBase64String(buffer);
        const decoded = Array.from(new Uint8Array(base64StringToArrayBuffer(base64Str)));
        expect(decoded).toEqual(x);
    });
});
describe('concatenateArrayBuffers', () => {
    it('Concatenate 3 non-empty ArrayBuffers', () => {
        const buffer1 = new Uint8Array([1, 2, 3]);
        const buffer2 = new Uint8Array([11, 22, 33, 44]);
        const buffer3 = new Uint8Array([111, 222, 100]);
        const out = concatenateArrayBuffers([buffer1.buffer, buffer2.buffer, buffer3.buffer]);
        expect(new Uint8Array(out)).toEqual(new Uint8Array([
            1, 2, 3, 11, 22, 33, 44, 111, 222, 100
        ]));
    });
    it('Concatenate non-empty and empty ArrayBuffers', () => {
        const buffer1 = new Uint8Array([1, 2, 3]);
        const buffer2 = new Uint8Array([11, 22, 33, 44]);
        const buffer3 = new Uint8Array([]);
        const buffer4 = new Uint8Array([150, 100, 50]);
        const out = concatenateArrayBuffers([buffer1.buffer, buffer2.buffer, buffer3.buffer, buffer4.buffer]);
        expect(new Uint8Array(out)).toEqual(new Uint8Array([
            1, 2, 3, 11, 22, 33, 44, 150, 100, 50
        ]));
    });
    it('A single ArrayBuffer', () => {
        const buffer1 = new Uint8Array([1, 3, 3, 7]);
        const out = concatenateArrayBuffers([buffer1.buffer]);
        expect(new Uint8Array(out)).toEqual(buffer1);
    });
    it('Zero ArrayBuffers', () => {
        expect(new Uint8Array(concatenateArrayBuffers([])))
            .toEqual(new Uint8Array([]));
    });
});
describe('basename', () => {
    it('Paths without slashes', () => {
        expect(basename('foo.txt')).toEqual('foo.txt');
        expect(basename('bar')).toEqual('bar');
    });
    it('Paths with slashes', () => {
        expect(basename('qux/foo.txt')).toEqual('foo.txt');
        expect(basename('qux/My Model.json')).toEqual('My Model.json');
        expect(basename('foo/bar/baz')).toEqual('baz');
        expect(basename('/foo/bar/baz')).toEqual('baz');
        expect(basename('foo/bar/baz/')).toEqual('baz');
        expect(basename('foo/bar/baz//')).toEqual('baz');
    });
});
describe('float16', () => {
    it('decodes NaN to float32 NaN', () => {
        const decoder = getFloat16Decoder();
        const float16NaN = 0x00007e00;
        const buffer = new Uint16Array([float16NaN]);
        const f32 = decoder(buffer);
        expect(f32).toEqual(new Float32Array([NaN]));
    });
    it('decodes ±Infinity to float32 ±Infinity', () => {
        const decoder = getFloat16Decoder();
        const positiveInfinity = 0x00007c00;
        const negativeInfinity = 0xfffffc00;
        const buffer = new Uint16Array([positiveInfinity, negativeInfinity]);
        const f32 = decoder(buffer);
        expect(f32).toEqual(new Float32Array([Infinity, -Infinity]));
    });
    it('decodes ±0 to float32 ±0', () => {
        const decoder = getFloat16Decoder();
        const positiveZero = 0x00000000;
        const negativeZero = 0xffff8000;
        const buffer = new Uint16Array([positiveZero, negativeZero]);
        const f32 = decoder(buffer);
        expect(f32).toEqual(new Float32Array([0.0, -0.0]));
    });
    it('decodes -Infinity on underflow', () => {
        const decoder = getFloat16Decoder();
        const minVal = 0xfffffbff;
        const buffer = new Uint16Array([minVal + 1]);
        const f32 = decoder(buffer);
        expect(f32).toEqual(new Float32Array([-Infinity]));
    });
    it('decodes +Infinity on overflow', () => {
        const decoder = getFloat16Decoder();
        const maxVal = 0x00007bff;
        const buffer = new Uint16Array([maxVal + 1]);
        const f32 = decoder(buffer);
        expect(f32).toEqual(new Float32Array([Infinity]));
    });
    it('decodes interpretable float16 to float32', () => {
        const decoder = getFloat16Decoder();
        const buffer = new Uint16Array([
            0x00003400,
            0x00003800,
            0x00003A00,
            0x00003555
        ]);
        const f32 = decoder(buffer);
        expect(f32[0]).toBeCloseTo(0.25);
        expect(f32[1]).toBeCloseTo(0.5);
        expect(f32[2]).toBeCloseTo(0.75);
        expect(f32[3]).toBeCloseTo(0.333);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9fdXRpbHNfdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvaW8vaW9fdXRpbHNfdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMvQixPQUFPLEVBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzFFLE9BQU8sRUFBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUV0RCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDL0MsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQy9DLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFFckMsT0FBTyxFQUFDLHlCQUF5QixFQUFFLHlCQUF5QixFQUFFLFFBQVEsRUFBRSx1QkFBdUIsRUFBRSxzQkFBc0IsRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUdoTCxRQUFRLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7UUFDN0IsTUFBTSxDQUFDLEdBQUcsSUFBSSxZQUFZLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDNUMsTUFBTSxNQUFNLEdBQUcsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7UUFDdEIsTUFBTSxDQUFDLEdBQUcsSUFBSSxZQUFZLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDNUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDL0MsTUFBTSxNQUFNLEdBQUcsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsSUFBSSxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsSUFBSSxZQUFZLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDLENBQUMsQ0FBQztJQUNILEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7UUFDN0IsTUFBTSxDQUFDLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkMsTUFBTSxNQUFNLEdBQUcsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxJQUFJLFVBQVUsQ0FBQyxN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QUM7UUFDcEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFXLENBQUM7WUFDN0IsVUFBVTtZQUNWLFVBQVU7WUFDVixVQUFVO1lBQ1YsVUFBVTtTQUNYLENBQUMsQ0FBQztRQUNILE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAqIGFzIHRmIGZyb20gJy4uL2luZGV4JztcbmltcG9ydCB7QUxMX0VOVlMsIEJST1dTRVJfRU5WUywgZGVzY3JpYmVXaXRoRmxhZ3N9IGZyb20gJy4uL2phc21pbmVfdXRpbCc7XG5pbXBvcnQge3NjYWxhciwgdGVuc29yMWQsIHRlbnNvcjJkfSBmcm9tICcuLi9vcHMvb3BzJztcbmltcG9ydCB7TmFtZWRUZW5zb3IsIE5hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHtleHBlY3RBcnJheXNFcXVhbH0gZnJvbSAnLi4vdGVzdF91dGlsJztcbmltcG9ydCB7ZXhwZWN0QXJyYXlzQ2xvc2V9IGZyb20gJy4uL3Rlc3RfdXRpbCc7XG5pbXBvcnQge2VuY29kZVN0cmluZ30gZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7YXJyYXlCdWZmZXJUb0Jhc2U2NFN0cmluZywgYmFzZTY0U3RyaW5nVG9BcnJheUJ1ZmZlciwgYmFzZW5hbWUsIGNvbmNhdGVuYXRlQXJyYXlCdWZmZXJzLCBjb25jYXRlbmF0ZVR5cGVkQXJyYXlzLCBzdHJpbmdCeXRlTGVuZ3RoLCBnZXRGbG9hdDE2RGVjb2Rlcn0gZnJvbSAnLi9pb191dGlscyc7XG5pbXBvcnQge1dlaWdodHNNYW5pZmVzdEVudHJ5fSBmcm9tICcuL3R5cGVzJztcblxuZGVzY3JpYmUoJ2NvbmNhdGVuYXRlVHlwZWRBcnJheXMnLCAoKSA9PiB7XG4gIGl0KCdTaW5nbGUgZmxvYXQgYXJyYXlzJywgKCkgPT4ge1xuICAgIGNvbnN0IHggPSBuZXcgRmxvYXQzMkFycmF5KFsxLjEsIDIuMiwgMy4zXSk7XG4gICAgY29uc3QgYnVmZmVyID0gY29uY2F0ZW5hdGVUeXBlZEFycmF5cyhbeF0pO1xuICAgIGV4cGVjdChidWZmZXIuYnl0ZUxlbmd0aCkudG9FcXVhbCgxMik7XG4gICAgZXhwZWN0KG5ldyBGbG9hdDMyQXJyYXkoYnVmZmVyLCAwLCAzKSkudG9FcXVhbCh4KTtcbiAgfSk7XG5cbiAgaXQoJ0Zsb2F0IGFycmF5cycsICgpID0+IHtcbiAgICBjb25zdCB4ID0gbmV3IEZsb2F0MzJBcnJheShbMS4xLCAyLjIsIDMuM10pO1xuICAgIGNvbnN0IHkgPSBuZXcgRmxvYXQzMkFycmF5KFstMS4xLCAtMi4yLCAtMy4zXSk7XG4gICAgY29uc3QgYnVmZmVyID0gY29uY2F0ZW5hdGVUeXBlZEFycmF5cyhbeCwgeV0pO1xuICAgIGV4cGVjdChidWZmZXIuYnl0ZUxlbmd0aCkudG9FcXVhbCgyNCk7XG4gICAgZXhwZWN0KG5ldyBGbG9hdDMyQXJyYXkoYnVmZmVyLCAwLCAzKSkudG9FcXVhbCh4KTtcbiAgICBleHBlY3QobmV3IEZsb2F0MzJBcnJheShidWZmZXIsIDEyLCAzKSkudG9FcXVhbCh5KTtcbiAgfSk7XG4gIGl0KCdTaW5nbGUgaW50MzIgYXJyYXlzJywgKCkgPT4ge1xuICAgIGNvbnN0IHggPSBuZXcgSW50MzJBcnJheShbMTEsIDIyLCAzM10pO1xuICAgIGNvbnN0IGJ1ZmZlciA9IGNvbmNhdGVuYXRlVHlwZWRBcnJheXMoW3hdKTtcbiAgICBleHBlY3QoYnVmZmVyLmJ5dGVMZW5ndGgpLnRvRXF1YWwoMTIpO1xuICAgIGV4cGVjdChuZXcgSW50MzJBcnJheShidWZmZXIsIDAsIDMpKS50b0VxdWFsKHgpO1xuICB9KTtcblxuICBpdCgnSW50MzIgYXJyYXlzJywgKCkgPT4ge1xuICAgIGNvbnN0IHggPSBuZXcgSW50MzJBcnJheShbMTEsIDIyLCAzM10pO1xuICAgIGNvbnN0IHkgPSBuZXcgSW50MzJBcnJheShbLTExLCAtMjIsIC0zM10pO1xuICAgIGNvbnN0IGJ1ZmZlciA9IGNvbmNhdGVuYXRlVHlwZWRBcnJheXMoW3gsIHldKTtcbiAgICBleHBlY3QoYnVmZmVyLmJ5dGVMZW5ndGgpLnRvRXF1YWwoMjQpO1xuICAgIGV4cGVjdChuZXcgSW50MzJBcnJheShidWZmZXIsIDAsIDMpKS50b0VxdWFsKHgpO1xuICAgIGV4cGVjdChuZXcgSW50MzJBcnJheShidWZmZXIsIDEyLCAzKSkudG9FcXVhbCh5KTtcbiAgfSk7XG5cbiAgaXQoJ1NpbmdsZSB1aW50OCBhcnJheXMnLCAoKSA9PiB7XG4gICAgY29uc3QgeCA9IG5ldyBVaW50OEFycmF5KFsxMSwgMjIsIDMzXSk7XG4gICAgY29uc3QgYnVmZmVyID0gY29uY2F0ZW5hdGVUeXBlZEFycmF5cyhbeF0pO1xuICAgIGV4cGVjdChidWZmZXIuYnl0ZUxlbmd0aCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QobmV3IFVpbnQ4QXJyYXkoYnVmZmVyLCAwLCAzKSkudG9FcXVhbCh4KTtcbiAgfSk7XG5cbiAgaXQoJ1VpbnQ4IGFycmF5cycsICgpID0+IHtcbiAgICBjb25zdCB4ID0gbmV3IFVpbnQ4QXJyYXkoWzExLCAyMiwgMzNdKTtcbiAgICBjb25zdCB5ID0gbmV3IFVpbnQ4QXJyYXkoWzExMSwgMTIyLCAxMzNdKTtcbiAgICBjb25zdCBidWZmZXIgPSBjb25jYXRlbmF0ZVR5cGVkQXJyYXlzKFt4LCB5XSk7XG4gICAgZXhwZWN0KGJ1ZmZlci5ieXRlTGVuZ3RoKS50b0VxdWFsKDYpO1xuICAgIGV4cGVjdChuZXcgVWludDhBcnJheShidWZmZXIsIDAsIDMpKS50b0VxdWFsKHgpO1xuICAgIGV4cGVjdChuZXcgVWludDhBcnJheShidWZmZXIsIDMsIDMpKS50b0VxdWFsKHkpO1xuICB9KTtcblxuICBpdCgnTWl4ZWQgVWludDgsIEludDMyIGFuZCBGbG9hdDMyIGFycmF5cycsICgpID0+IHtcbiAgICBjb25zdCB4ID0gbmV3IFVpbnQ4QXJyYXkoWzAsIDEsIDEsIDBdKTtcbiAgICBjb25zdCB5ID0gbmV3IEludDMyQXJyYXkoWzEwLCAyMCwgMzAsIDQwXSk7XG4gICAgY29uc3QgeiA9IG5ldyBGbG9hdDMyQXJyYXkoWy0xLjEsIC0yLjIsIC0zLjMsIC00LjRdKTtcbiAgICBjb25zdCBidWZmZXIgPSBjb25jYXRlbmF0ZVR5cGVkQXJyYXlzKFt4LCB5LCB6XSk7XG4gICAgZXhwZWN0KGJ1ZmZlci5ieXRlTGVuZ3RoKS50b0VxdWFsKDEgKiA0ICsgNCAqIDQgKyA0ICogNCk7XG4gICAgZXhwZWN0KG5ldyBVaW50OEFycmF5KGJ1ZmZlciwgMCwgNCkpLnRvRXF1YWwoeCk7XG4gICAgZXhwZWN0KG5ldyBJbnQzMkFycmF5KGJ1ZmZlciwgNCwgNCkpLnRvRXF1YWwoeSk7XG4gICAgZXhwZWN0KG5ldyBGbG9hdDMyQXJyYXkoYnVmZmVyLCAyMCwgNCkpLnRvRXF1YWwoeik7XG4gIH0pO1xuXG4gIGl0KCdDb25jYXRlbmF0ZSBGbG9hdDMyQXJyYXlzIGZyb20gU3ViQXJyYXlzJywgKCkgPT4ge1xuICAgIGNvbnN0IHgxID0gbmV3IEZsb2F0MzJBcnJheShbMS4xLCAyLjIsIDMuM10pO1xuICAgIGNvbnN0IHgyID0gbmV3IEZsb2F0MzJBcnJheShbLTEuMSwgLTIuMiwgLTMuM10pO1xuICAgIGNvbnN0IHhDb25jYXRlbmF0ZWQgPSBjb25jYXRlbmF0ZVR5cGVkQXJyYXlzKFt4MSwgeDJdKTtcbiAgICBjb25zdCB5MSA9IG5ldyBGbG9hdDMyQXJyYXkoeENvbmNhdGVuYXRlZCwgMCwgMyk7XG4gICAgY29uc3QgeTIgPSBuZXcgRmxvYXQzMkFycmF5KHhDb25jYXRlbmF0ZWQsIDMgKiA0LCAzKTtcbiAgICAvLyBBdCB0aGlzIHBvaW50LCB0aGUgYnVmZmVyIG9mIHkxIGlzIGxvbmdlciB0aGFuIHRoYW4gdGhlIGFjdHVhbCBieXRlXG4gICAgLy8gbGVuZ3RoIG9mIHkxLCBiZWNhdXNlIG9mIHRoZSB3YXkgeTEgaXMgY29uc3RydWN0ZWQuIFRoZSBzYW1lIGlzIHRydWUgZm9yXG4gICAgLy8geTIuXG4gICAgZXhwZWN0KHkxLmJ1ZmZlci5ieXRlTGVuZ3RoKS50b0VxdWFsKDYgKiA0KTtcbiAgICBleHBlY3QoeTIuYnVmZmVyLmJ5dGVMZW5ndGgpLnRvRXF1YWwoNiAqIDQpO1xuXG4gICAgY29uc3QgeUNvbmNhdGVuYXRlZCA9IGNvbmNhdGVuYXRlVHlwZWRBcnJheXMoW3kxLCB5Ml0pO1xuICAgIGV4cGVjdCh5Q29uY2F0ZW5hdGVkLmJ5dGVMZW5ndGgpLnRvRXF1YWwoNiAqIDQpO1xuICAgIGV4cGVjdChuZXcgRmxvYXQzMkFycmF5KHlDb25jYXRlbmF0ZWQsIDAsIDMpKS50b0VxdWFsKHgxKTtcbiAgICBleHBlY3QobmV3IEZsb2F0MzJBcnJheSh5Q29uY2F0ZW5hdGVkLCAzICogNCwgMykpLnRvRXF1YWwoeDIpO1xuICB9KTtcblxuICBpdCgnQ29uY2F0ZW5hdGUgSW50MzJBcnJheSBmcm9tIFN1YkFycmF5cycsICgpID0+IHtcbiAgICBjb25zdCB4MSA9IG5ldyBJbnQzMkFycmF5KFsxMSwgMjIsIDMzXSk7XG4gICAgY29uc3QgeDIgPSBuZXcgSW50MzJBcnJheShbLTExLCAtMjIsIC0zM10pO1xuICAgIGNvbnN0IHhDb25jYXRlbmF0ZWQgPSBjb25jYXRlbmF0ZVR5cGVkQXJyYXlzKFt4MSwgeDJdKTtcbiAgICBjb25zdCB5MSA9IG5ldyBJbnQzMkFycmF5KHhDb25jYXRlbmF0ZWQsIDAsIDMpO1xuICAgIGNvbnN0IHkyID0gbmV3IEludDMyQXJyYXkoeENvbmNhdGVuYXRlZCwgMyAqIDQsIDMpO1xuICAgIC8vIEF0IHRoaXMgcG9pbnQsIHRoZSBidWZmZXIgb2YgeTEgaXMgbG9uZ2VyIHRoYW4gdGhhbiB0aGUgYWN0dWFsIGJ5dGVcbiAgICAvLyBsZW5ndGggb2YgeTEsIGJlY2F1c2Ugb2YgdGhlIHdheSB5MSBpcyBjb25zdHJ1Y3RlZC4gVGhlIHNhbWUgaXMgdHJ1ZSBmb3JcbiAgICAvLyB5Mi5cbiAgICBleHBlY3QoeTEuYnVmZmVyLmJ5dGVMZW5ndGgpLnRvRXF1YWwoNiAqIDQpO1xuICAgIGV4cGVjdCh5Mi5idWZmZXIuYnl0ZUxlbmd0aCkudG9FcXVhbCg2ICogNCk7XG5cbiAgICBjb25zdCB5Q29uY2F0ZW5hdGVkID0gY29uY2F0ZW5hdGVUeXBlZEFycmF5cyhbeTEsIHkyXSk7XG4gICAgZXhwZWN0KHlDb25jYXRlbmF0ZWQuYnl0ZUxlbmd0aCkudG9FcXVhbCg2ICogNCk7XG4gICAgZXhwZWN0KG5ldyBJbnQzMkFycmF5KHlDb25jYXRlbmF0ZWQsIDAsIDMpKS50b0VxdWFsKHgxKTtcbiAgICBleHBlY3QobmV3IEludDMyQXJyYXkoeUNvbmNhdGVuYXRlZCwgMyAqIDQsIDMpKS50b0VxdWFsKHgyKTtcbiAgfSk7XG5cbiAgaXQoJ0NvbmNhdGVuYXRlIFVpbnQ4QXJyYXkgZnJvbSBTdWJBcnJheXMnLCAoKSA9PiB7XG4gICAgY29uc3QgeDEgPSBuZXcgVWludDhBcnJheShbMTEsIDIyLCAzM10pO1xuICAgIGNvbnN0IHgyID0gbmV3IFVpbnQ4QXJyYXkoWzQ0LCA1NSwgNjZdKTtcbiAgICBjb25zdCB4Q29uY2F0ZW5hdGVkID0gY29uY2F0ZW5hdGVUeXBlZEFycmF5cyhbeDEsIHgyXSk7XG4gICAgY29uc3QgeTEgPSBuZXcgVWludDhBcnJheSh4Q29uY2F0ZW5hdGVkLCAwLCAzKTtcbiAgICBjb25zdCB5MiA9IG5ldyBVaW50OEFycmF5KHhDb25jYXRlbmF0ZWQsIDMsIDMpO1xuICAgIC8vIEF0IHRoaXMgcG9pbnQsIHRoZSBidWZmZXIgb2YgeTEgaXMgbG9uZ2VyIHRoYW4gdGhhbiB0aGUgYWN0dWFsIGJ5dGVcbiAgICAvLyBsZW5ndGggb2YgeTEsIGJlY2F1c2Ugb2YgdGhlIHdheSB5MSBpcyBjb25zdHJ1Y3RlZC4gVGhlIHNhbWUgaXMgdHJ1ZSBmb3JcbiAgICAvLyB5Mi5cbiAgICBleHBlY3QoeTEuYnVmZmVyLmJ5dGVMZW5ndGgpLnRvRXF1YWwoNik7XG4gICAgZXhwZWN0KHkyLmJ1ZmZlci5ieXRlTGVuZ3RoKS50b0VxdWFsKDYpO1xuXG4gICAgY29uc3QgeUNvbmNhdGVuYXRlZCA9IGNvbmNhdGVuYXRlVHlwZWRBcnJheXMoW3kxLCB5Ml0pO1xuICAgIGV4cGVjdCh5Q29uY2F0ZW5hdGVkLmJ5dGVMZW5ndGgpLnRvRXF1YWwoNik7XG4gICAgZXhwZWN0KG5ldyBVaW50OEFycmF5KHlDb25jYXRlbmF0ZWQsIDAsIDMpKS50b0VxdWFsKHgxKTtcbiAgICBleHBlY3QobmV3IFVpbnQ4QXJyYXkoeUNvbmNhdGVuYXRlZCwgMywgMykpLnRvRXF1YWwoeDIpO1xuICB9KTtcblxuICBpdCgnQ29uY2F0ZW5hdGUgbWl4ZWQgVHlwZWRBcnJheXMgZnJvbSBTdWJBcnJheXMnLCAoKSA9PiB7XG4gICAgY29uc3QgeDEgPSBuZXcgVWludDhBcnJheShbMTEsIDIyLCAzMywgNDRdKTtcbiAgICBjb25zdCB4MiA9IG5ldyBJbnQzMkFycmF5KFstNDQsIC01NSwgLTY2XSk7XG4gICAgY29uc3QgeDMgPSBuZXcgRmxvYXQzMkFycmF5KFsxLjEsIDIuMiwgMy4zXSk7XG4gICAgY29uc3QgeENvbmNhdGVuYXRlZCA9IGNvbmNhdGVuYXRlVHlwZWRBcnJheXMoW3gxLCB4MiwgeDNdKTtcbiAgICBjb25zdCB5MSA9IG5ldyBVaW50OEFycmF5KHhDb25jYXRlbmF0ZWQsIDAsIDQpO1xuICAgIGNvbnN0IHkyID0gbmV3IEludDMyQXJyYXkoeENvbmNhdGVuYXRlZCwgNCwgMyk7XG4gICAgY29uc3QgeTMgPSBuZXcgRmxvYXQzMkFycmF5KHhDb25jYXRlbmF0ZWQsIDQgKyAzICogNCwgMyk7XG4gICAgLy8gQXQgdGhpcyBwb2ludCwgdGhlIGJ1ZmZlciBvZiB5MSBpcyBsb25nZXIgdGhhbiB0aGFuIHRoZSBhY3R1YWwgYnl0ZVxuICAgIC8vIGxlbmd0aCBvZiB5MSwgYmVjYXVzZSBvZiB0aGUgd2F5IHkxIGlzIGNvbnN0cnVjdGVkLiBUaGUgc2FtZSBpcyB0cnVlIGZvclxuICAgIC8vIHkyIGFuZCB5My5cbiAgICBleHBlY3QoeTEuYnVmZmVyLmJ5dGVMZW5ndGgpLnRvRXF1YWwoNCArIDMgKiA0ICsgMyAqIDQpO1xuICAgIGV4cGVjdCh5Mi5idWZmZXIuYnl0ZUxlbmd0aCkudG9FcXVhbCg0ICsgMyAqIDQgKyAzICogNCk7XG4gICAgZXhwZWN0KHkzLmJ1ZmZlci5ieXRlTGVuZ3RoKS50b0VxdWFsKDQgKyAzICogNCArIDMgKiA0KTtcblxuICAgIGNvbnN0IHlDb25jYXRlbmF0ZWQgPSBjb25jYXRlbmF0ZVR5cGVkQXJyYXlzKFt5MSwgeTIsIHkzXSk7XG4gICAgZXhwZWN0KHlDb25jYXRlbmF0ZWQuYnl0ZUxlbmd0aCkudG9FcXVhbCg0ICsgMyAqIDQgKyAzICogNCk7XG4gICAgZXhwZWN0KG5ldyBVaW50OEFycmF5KHlDb25jYXRlbmF0ZWQsIDAsIDQpKS50b0VxdWFsKHgxKTtcbiAgICBleHBlY3QobmV3IEludDMyQXJyYXkoeUNvbmNhdGVuYXRlZCwgNCwgMykpLnRvRXF1YWwoeDIpO1xuICAgIGV4cGVjdChuZXcgRmxvYXQzMkFycmF5KHlDb25jYXRlbmF0ZWQsIDQgKyAzICogNCwgMykpLnRvRXF1YWwoeDMpO1xuICB9KTtcblxuICBpdCgnbnVsbCBhbmQgdW5kZWZpbmVkIGlucHV0cycsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gY29uY2F0ZW5hdGVUeXBlZEFycmF5cyhudWxsKSkudG9UaHJvdygpO1xuICAgIGV4cGVjdCgoKSA9PiBjb25jYXRlbmF0ZVR5cGVkQXJyYXlzKHVuZGVmaW5lZCkpLnRvVGhyb3coKTtcbiAgfSk7XG5cbiAgaXQoJ2VtcHR5IGlucHV0IGFycmF5JywgKCkgPT4ge1xuICAgIGV4cGVjdChjb25jYXRlbmF0ZVR5cGVkQXJyYXlzKFtdKS5ieXRlTGVuZ3RoKS50b0VxdWFsKDApO1xuICB9KTtcblxuICBpdCgnVW5zdXBwb3J0ZWQgZHR5cGUnLCAoKSA9PiB7XG4gICAgY29uc3QgeCA9IG5ldyBJbnQxNkFycmF5KFswLCAxLCAxLCAwXSk7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgIGV4cGVjdCgoKSA9PiBjb25jYXRlbmF0ZVR5cGVkQXJyYXlzKFt4IGFzIGFueV0pKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9VbnN1cHBvcnRlZCBUeXBlZEFycmF5IHN1YnR5cGU6IEludDE2QXJyYXkvKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ2VuY29kZVdlaWdodHMnLCBBTExfRU5WUywgKCkgPT4ge1xuICBpdCgnRmxvYXQzMiB0ZW5zb3JzIGFzIE5hbWVkVGVuc29yTWFwJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHRlbnNvcnM6IE5hbWVkVGVuc29yTWFwID0ge1xuICAgICAgeDE6IHRlbnNvcjJkKFtbMTAsIDIwXSwgWzMwLCA0MF1dKSxcbiAgICAgIHgyOiBzY2FsYXIoNDIpLFxuICAgICAgeDM6IHRlbnNvcjFkKFstMS4zLCAtMy43LCAxLjMsIDMuN10pLFxuICAgIH07XG4gICAgY29uc3QgZGF0YUFuZFNwZWNzID0gYXdhaXQgdGYuaW8uZW5jb2RlV2VpZ2h0cyh0ZW5zb3JzKTtcbiAgICBjb25zdCBkYXRhID0gZGF0YUFuZFNwZWNzLmRhdGE7XG4gICAgY29uc3Qgc3BlY3MgPSBkYXRhQW5kU3BlY3Muc3BlY3M7XG4gICAgZXhwZWN0KGRhdGEuYnl0ZUxlbmd0aCkudG9FcXVhbCg0ICogKDQgKyAxICsgNCkpO1xuICAgIGV4cGVjdChuZXcgRmxvYXQzMkFycmF5KGRhdGEsIDAsIDQpKS50b0VxdWFsKG5ldyBGbG9hdDMyQXJyYXkoW1xuICAgICAgMTAsIDIwLCAzMCwgNDBcbiAgICBdKSk7XG4gICAgZXhwZWN0KG5ldyBGbG9hdDMyQXJyYXkoZGF0YSwgMTYsIDEpKS50b0VxdWFsKG5ldyBGbG9hdDMyQXJyYXkoWzQyXSkpO1xuICAgIGV4cGVjdChuZXcgRmxvYXQzMkFycmF5KGRhdGEsIDIwLCA0KSkudG9FcXVhbChuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAgIC0xLjMsIC0zLjcsIDEuMywgMy43XG4gICAgXSkpO1xuICAgIGV4cGVjdChzcGVjcykudG9FcXVhbChbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICd4MScsXG4gICAgICAgIGR0eXBlOiAnZmxvYXQzMicsXG4gICAgICAgIHNoYXBlOiBbMiwgMl0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAneDInLFxuICAgICAgICBkdHlwZTogJ2Zsb2F0MzInLFxuICAgICAgICBzaGFwZTogW10sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAneDMnLFxuICAgICAgICBkdHlwZTogJ2Zsb2F0MzInLFxuICAgICAgICBzaGFwZTogWzRdLFxuICAgICAgfVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnRmxvYXQzMiB0ZW5zb3JzIGFzIE5hbWVkVGVuc29yIGFycmF5JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHRlbnNvcnM6IE5hbWVkVGVuc29yW10gPSBbXG4gICAgICB7bmFtZTogJ3gxMjM0JywgdGVuc29yOiB0ZW5zb3IyZChbWzEwLCAyMF0sIFszMCwgNDBdXSl9LCB7XG4gICAgICAgIG5hbWU6ICdhNDInLFxuICAgICAgICB0ZW5zb3I6IHNjYWxhcig0MiksXG4gICAgICB9LFxuICAgICAge25hbWU6ICdiNDEnLCB0ZW5zb3I6IHRlbnNvcjFkKFstMS4zLCAtMy43LCAxLjMsIDMuN10pfVxuICAgIF07XG4gICAgY29uc3QgZGF0YUFuZFNwZWNzID0gYXdhaXQgdGYuaW8uZW5jb2RlV2VpZ2h0cyh0ZW5zb3JzKTtcbiAgICBjb25zdCBkYXRhID0gZGF0YUFuZFNwZWNzLmRhdGE7XG4gICAgY29uc3Qgc3BlY3MgPSBkYXRhQW5kU3BlY3Muc3BlY3M7XG4gICAgZXhwZWN0KGRhdGEuYnl0ZUxlbmd0aCkudG9FcXVhbCg0ICogKDQgKyAxICsgNCkpO1xuICAgIGV4cGVjdChuZXcgRmxvYXQzMkFycmF5KGRhdGEsIDAsIDQpKS50b0VxdWFsKG5ldyBGbG9hdDMyQXJyYXkoW1xuICAgICAgMTAsIDIwLCAzMCwgNDBcbiAgICBdKSk7XG4gICAgZXhwZWN0KG5ldyBGbG9hdDMyQXJyYXkoZGF0YSwgMTYsIDEpKS50b0VxdWFsKG5ldyBGbG9hdDMyQXJyYXkoWzQyXSkpO1xuICAgIGV4cGVjdChuZXcgRmxvYXQzMkFycmF5KGRhdGEsIDIwLCA0KSkudG9FcXVhbChuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAgIC0xLjMsIC0zLjcsIDEuMywgMy43XG4gICAgXSkpO1xuICAgIGV4cGVjdChzcGVjcykudG9FcXVhbChbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICd4MTIzNCcsXG4gICAgICAgIGR0eXBlOiAnZmxvYXQzMicsXG4gICAgICAgIHNoYXBlOiBbMiwgMl0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnYTQyJyxcbiAgICAgICAgZHR5cGU6ICdmbG9hdDMyJyxcbiAgICAgICAgc2hhcGU6IFtdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2I0MScsXG4gICAgICAgIGR0eXBlOiAnZmxvYXQzMicsXG4gICAgICAgIHNoYXBlOiBbNF0sXG4gICAgICB9XG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCdFbXB0eSBOYW1lZFRlbnNvciBhcnJheScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB0ZW5zb3JzOiBOYW1lZFRlbnNvcltdID0gW107XG4gICAgY29uc3QgZGF0YUFuZFNwZWNzID0gYXdhaXQgdGYuaW8uZW5jb2RlV2VpZ2h0cyh0ZW5zb3JzKTtcbiAgICBjb25zdCBkYXRhID0gZGF0YUFuZFNwZWNzLmRhdGE7XG4gICAgY29uc3Qgc3BlY3MgPSBkYXRhQW5kU3BlY3Muc3BlY3M7XG4gICAgZXhwZWN0KGRhdGEuYnl0ZUxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICBleHBlY3Qoc3BlY3MpLnRvRXF1YWwoW10pO1xuICB9KTtcblxuICBpdCgnSW50MzIgdGVuc29ycycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB0ZW5zb3JzOiBOYW1lZFRlbnNvck1hcCA9IHtcbiAgICAgIHgxOiB0ZW5zb3IyZChbWzEwLCAyMF0sIFszMCwgNDBdXSwgWzIsIDJdLCAnaW50MzInKSxcbiAgICAgIHgyOiBzY2FsYXIoNDIsICdpbnQzMicpLFxuICAgICAgeDM6IHRlbnNvcjFkKFstMSwgLTMsIC0zLCAtN10sICdpbnQzMicpLFxuICAgIH07XG4gICAgY29uc3QgZGF0YUFuZFNwZWNzID0gYXdhaXQgdGYuaW8uZW5jb2RlV2VpZ2h0cyh0ZW5zb3JzKTtcbiAgICBjb25zdCBkYXRhID0gZGF0YUFuZFNwZWNzLmRhdGE7XG4gICAgY29uc3Qgc3BlY3MgPSBkYXRhQW5kU3BlY3Muc3BlY3M7XG4gICAgZXhwZWN0KGRhdGEuYnl0ZUxlbmd0aCkudG9FcXVhbCg0ICogKDQgKyAxICsgNCkpO1xuICAgIGV4cGVjdChuZXcgSW50MzJBcnJheShkYXRhLCAwLCA0KSkudG9FcXVhbChuZXcgSW50MzJBcnJheShbXG4gICAgICAxMCwgMjAsIDMwLCA0MFxuICAgIF0pKTtcbiAgICBleHBlY3QobmV3IEludDMyQXJyYXkoZGF0YSwgMTYsIDEpKS50b0VxdWFsKG5ldyBJbnQzMkFycmF5KFs0Ml0pKTtcbiAgICBleHBlY3QobmV3IEludDMyQXJyYXkoZGF0YSwgMjAsIDQpKS50b0VxdWFsKG5ldyBJbnQzMkFycmF5KFtcbiAgICAgIC0xLCAtMywgLTMsIC03XG4gICAgXSkpO1xuICAgIGV4cGVjdChzcGVjcykudG9FcXVhbChbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICd4MScsXG4gICAgICAgIGR0eXBlOiAnaW50MzInLFxuICAgICAgICBzaGFwZTogWzIsIDJdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3gyJyxcbiAgICAgICAgZHR5cGU6ICdpbnQzMicsXG4gICAgICAgIHNoYXBlOiBbXSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICd4MycsXG4gICAgICAgIGR0eXBlOiAnaW50MzInLFxuICAgICAgICBzaGFwZTogWzRdLFxuICAgICAgfVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnQm9vbCB0ZW5zb3JzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHRlbnNvcnM6IE5hbWVkVGVuc29yTWFwID0ge1xuICAgICAgeDE6IHRlbnNvcjJkKFtbdHJ1ZSwgZmFsc2VdLCBbZmFsc2UsIHRydWVdXSwgWzIsIDJdLCAnYm9vbCcpLFxuICAgICAgeDI6IHNjYWxhcihmYWxzZSwgJ2Jvb2wnKSxcbiAgICAgIHgzOiB0ZW5zb3IxZChbZmFsc2UsIHRydWUsIHRydWUsIGZhbHNlXSwgJ2Jvb2wnKSxcbiAgICB9O1xuICAgIGNvbnN0IGRhdGFBbmRTcGVjcyA9IGF3YWl0IHRmLmlvLmVuY29kZVdlaWdodHModGVuc29ycyk7XG4gICAgY29uc3QgZGF0YSA9IGRhdGFBbmRTcGVjcy5kYXRhO1xuICAgIGNvbnN0IHNwZWNzID0gZGF0YUFuZFNwZWNzLnNwZWNzO1xuICAgIGV4cGVjdChkYXRhLmJ5dGVMZW5ndGgpLnRvRXF1YWwoNCArIDEgKyA0KTtcbiAgICBleHBlY3QobmV3IFVpbnQ4QXJyYXkoZGF0YSwgMCwgNCkpLnRvRXF1YWwobmV3IFVpbnQ4QXJyYXkoWzEsIDAsIDAsIDFdKSk7XG4gICAgZXhwZWN0KG5ldyBVaW50OEFycmF5KGRhdGEsIDQsIDEpKS50b0VxdWFsKG5ldyBVaW50OEFycmF5KFswXSkpO1xuICAgIGV4cGVjdChuZXcgVWludDhBcnJheShkYXRhLCA1LCA0KSkudG9FcXVhbChuZXcgVWludDhBcnJheShbMCwgMSwgMSwgMF0pKTtcbiAgICBleHBlY3Qoc3BlY3MpLnRvRXF1YWwoW1xuICAgICAge1xuICAgICAgICBuYW1lOiAneDEnLFxuICAgICAgICBkdHlwZTogJ2Jvb2wnLFxuICAgICAgICBzaGFwZTogWzIsIDJdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3gyJyxcbiAgICAgICAgZHR5cGU6ICdib29sJyxcbiAgICAgICAgc2hhcGU6IFtdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3gzJyxcbiAgICAgICAgZHR5cGU6ICdib29sJyxcbiAgICAgICAgc2hhcGU6IFs0XSxcbiAgICAgIH1cbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ0NvbXBsZXg2NCB0ZW5zb3JzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHRlbnNvcnM6IE5hbWVkVGVuc29yTWFwID0ge1xuICAgICAgeDE6IHRmLmNvbXBsZXgoWzEsIDJdLCBbMSwgMl0pLFxuICAgICAgeDI6IHRmLmNvbXBsZXgoMSwgMiksXG4gICAgICB4MzogdGYuY29tcGxleChbWzFdXSwgW1syXV0pLFxuICAgIH07XG4gICAgY29uc3QgZGF0YUFuZFNwZWNzID0gYXdhaXQgdGYuaW8uZW5jb2RlV2VpZ2h0cyh0ZW5zb3JzKTtcbiAgICBjb25zdCBkYXRhID0gZGF0YUFuZFNwZWNzLmRhdGE7XG4gICAgY29uc3Qgc3BlY3MgPSBkYXRhQW5kU3BlY3Muc3BlY3M7XG4gICAgZXhwZWN0KGRhdGEuYnl0ZUxlbmd0aCkudG9FcXVhbCg4ICogNCk7XG4gICAgZXhwZWN0KG5ldyBGbG9hdDMyQXJyYXkoZGF0YSwgMCwgNCkpLnRvRXF1YWwobmV3IEZsb2F0MzJBcnJheShbXG4gICAgICAxLCAxLCAyLCAyXG4gICAgXSkpO1xuICAgIGV4cGVjdChuZXcgRmxvYXQzMkFycmF5KGRhdGEsIDE2LCAyKSkudG9FcXVhbChuZXcgRmxvYXQzMkFycmF5KFsxLCAyXSkpO1xuICAgIGV4cGVjdChuZXcgRmxvYXQzMkFycmF5KGRhdGEsIDI0LCAyKSkudG9FcXVhbChuZXcgRmxvYXQzMkFycmF5KFsxLCAyXSkpO1xuICAgIGV4cGVjdChzcGVjcykudG9FcXVhbChbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICd4MScsXG4gICAgICAgIGR0eXBlOiAnY29tcGxleDY0JyxcbiAgICAgICAgc2hhcGU6IFsyXSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICd4MicsXG4gICAgICAgIGR0eXBlOiAnY29tcGxleDY0JyxcbiAgICAgICAgc2hhcGU6IFtdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3gzJyxcbiAgICAgICAgZHR5cGU6ICdjb21wbGV4NjQnLFxuICAgICAgICBzaGFwZTogWzEsIDFdLFxuICAgICAgfVxuICAgIF0pO1xuICB9KTtcbiAgaXQoJ1N0cmluZyB0ZW5zb3JzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHRlbnNvcnM6IE5hbWVkVGVuc29yTWFwID0ge1xuICAgICAgeDE6IHRlbnNvcjJkKFtbJ2EnLCAnYmMnXSwgWydkZWYnLCAnZyddXSwgWzIsIDJdKSxcbiAgICAgIHgyOiBzY2FsYXIoJycpLCAgICAgICAgICAgICAgICAgICAgICAgLy8gRW1wdHkgc3RyaW5nLlxuICAgICAgeDM6IHRlbnNvcjFkKFsn0LfQtNGA0LDQstC+JywgJ9C/0L7Qt9C00YDQsNCyJ10pLCAgLy8gQ3lyaWxsaWMuXG4gICAgICB4NDogc2NhbGFyKCfmraPluLgnKSwgICAgICAgICAgICAgICAgICAgLy8gRWFzdCBBc2lhbi5cbiAgICAgIHg1OiBzY2FsYXIoJ2hlbGxvJykgICAgICAgICAgICAgICAgICAgLy8gU2luZ2xlIHN0cmluZy5cbiAgICB9O1xuICAgIGNvbnN0IGRhdGFBbmRTcGVjcyA9IGF3YWl0IHRmLmlvLmVuY29kZVdlaWdodHModGVuc29ycyk7XG4gICAgY29uc3QgZGF0YSA9IGRhdGFBbmRTcGVjcy5kYXRhO1xuICAgIGNvbnN0IHNwZWNzID0gZGF0YUFuZFNwZWNzLnNwZWNzO1xuICAgIGNvbnN0IHgxQnl0ZUxlbmd0aCA9IDcgKyA0ICogNDsgICAgICAgLy8gNyBhc2NpaSBjaGFycyArIDQgaW50cy5cbiAgICBjb25zdCB4MkJ5dGVMZW5ndGggPSA0OyAgICAgICAgICAgICAgIC8vIE5vIGNoYXJzICsgMSBpbnQuXG4gICAgY29uc3QgeDNCeXRlTGVuZ3RoID0gMTMgKiAyICsgMiAqIDQ7ICAvLyAxMyBjeXJpbGxpYyBsZXR0ZXJzICsgMiBpbnRzLlxuICAgIGNvbnN0IHg0Qnl0ZUxlbmd0aCA9IDYgKyAxICogNDsgICAgICAgLy8gMiBlYXN0IGFzaWFuIGxldHRlcnMgKyAxIGludC5cbiAgICBjb25zdCB4NUJ5dGVMZW5ndGggPSA1ICsgMSAqIDQ7ICAgICAgIC8vIDUgYXNjaWkgY2hhcnMgKyAxIGludC5cbiAgICBleHBlY3QoZGF0YS5ieXRlTGVuZ3RoKVxuICAgICAgICAudG9FcXVhbChcbiAgICAgICAgICAgIHgxQnl0ZUxlbmd0aCArIHgyQnl0ZUxlbmd0aCArIHgzQnl0ZUxlbmd0aCArIHg0Qnl0ZUxlbmd0aCArXG4gICAgICAgICAgICB4NUJ5dGVMZW5ndGgpO1xuICAgIC8vIHgxICdhJy5cbiAgICBleHBlY3QobmV3IFVpbnQzMkFycmF5KGRhdGEsIDAsIDEpWzBdKS50b0JlKDEpO1xuICAgIGV4cGVjdChuZXcgVWludDhBcnJheShkYXRhLCA0LCAxKSkudG9FcXVhbChlbmNvZGVTdHJpbmcoJ2EnKSk7XG4gICAgLy8geDEgJ2JjJy5cbiAgICBleHBlY3QobmV3IFVpbnQzMkFycmF5KGRhdGEuc2xpY2UoNSwgOSkpWzBdKS50b0JlKDIpO1xuICAgIGV4cGVjdChuZXcgVWludDhBcnJheShkYXRhLCA5LCAyKSkudG9FcXVhbChlbmNvZGVTdHJpbmcoJ2JjJykpO1xuICAgIC8vIHgxICdkZWYnLlxuICAgIGV4cGVjdChuZXcgVWludDMyQXJyYXkoZGF0YS5zbGljZSgxMSwgMTUpKVswXSkudG9CZSgzKTtcbiAgICBleHBlY3QobmV3IFVpbnQ4QXJyYXkoZGF0YSwgMTUsIDMpKS50b0VxdWFsKGVuY29kZVN0cmluZygnZGVmJykpO1xuICAgIC8vIHgxICdnJy5cbiAgICBleHBlY3QobmV3IFVpbnQzMkFycmF5KGRhdGEuc2xpY2UoMTgsIDIyKSlbMF0pLnRvQmUoMSk7XG4gICAgZXhwZWN0KG5ldyBVaW50OEFycmF5KGRhdGEsIDIyLCAxKSkudG9FcXVhbChlbmNvZGVTdHJpbmcoJ2cnKSk7XG5cbiAgICAvLyB4MiBpcyBlbXB0eSBzdHJpbmcuXG4gICAgZXhwZWN0KG5ldyBVaW50MzJBcnJheShkYXRhLnNsaWNlKDIzLCAyNykpWzBdKS50b0JlKDApO1xuXG4gICAgLy8geDMgJ9C30LTRgNCw0LLQvicuXG4gICAgZXhwZWN0KG5ldyBVaW50MzJBcnJheShkYXRhLnNsaWNlKDI3LCAzMSkpWzBdKS50b0JlKDEyKTtcbiAgICBleHBlY3QobmV3IFVpbnQ4QXJyYXkoZGF0YSwgMzEsIDEyKSkudG9FcXVhbChlbmNvZGVTdHJpbmcoJ9C30LTRgNCw0LLQvicpKTtcblxuICAgIC8vIHgzICfQv9C+0LfQtNGA0LDQsicuXG4gICAgZXhwZWN0KG5ldyBVaW50MzJBcnJheShkYXRhLnNsaWNlKDQzLCA0NykpWzBdKS50b0JlKDE0KTtcbiAgICBleHBlY3QobmV3IFVpbnQ4QXJyYXkoZGF0YSwgNDcsIDE0KSkudG9FcXVhbChlbmNvZGVTdHJpbmcoJ9C/0L7Qt9C00YDQsNCyJykpO1xuXG4gICAgLy8geDQgJ+ato+W4uCcuXG4gICAgZXhwZWN0KG5ldyBVaW50MzJBcnJheShkYXRhLnNsaWNlKDYxLCA2NSkpWzBdKS50b0JlKDYpO1xuICAgIGV4cGVjdChuZXcgVWludDhBcnJheShkYXRhLCA2NSwgNikpLnRvRXF1YWwoZW5jb2RlU3RyaW5nKCfmraPluLgnKSk7XG5cbiAgICAvLyB4NSAnaGVsbG8nLlxuICAgIGV4cGVjdChuZXcgVWludDMyQXJyYXkoZGF0YS5zbGljZSg3MSwgNzUpKVswXSkudG9CZSg1KTtcbiAgICBleHBlY3QobmV3IFVpbnQ4QXJyYXkoZGF0YSwgNzUsIDUpKS50b0VxdWFsKGVuY29kZVN0cmluZygnaGVsbG8nKSk7XG5cbiAgICBleHBlY3Qoc3BlY3MpLnRvRXF1YWwoW1xuICAgICAge25hbWU6ICd4MScsIGR0eXBlOiAnc3RyaW5nJywgc2hhcGU6IFsyLCAyXX0sXG4gICAgICB7bmFtZTogJ3gyJywgZHR5cGU6ICdzdHJpbmcnLCBzaGFwZTogW119LFxuICAgICAge25hbWU6ICd4MycsIGR0eXBlOiAnc3RyaW5nJywgc2hhcGU6IFsyXX0sXG4gICAgICB7bmFtZTogJ3g0JywgZHR5cGU6ICdzdHJpbmcnLCBzaGFwZTogW119LFxuICAgICAge25hbWU6ICd4NScsIGR0eXBlOiAnc3RyaW5nJywgc2hhcGU6IFtdfVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnTWl4ZWQgZHR5cGUgdGVuc29ycycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB0ZW5zb3JzOiBOYW1lZFRlbnNvck1hcCA9IHtcbiAgICAgIHgxOiB0ZW5zb3IyZChbWzEwLCAyMF0sIFszMCwgNDBdXSwgWzIsIDJdLCAnaW50MzInKSxcbiAgICAgIHgyOiBzY2FsYXIoMTMuMzcsICdmbG9hdDMyJyksXG4gICAgICB4MzogdGVuc29yMWQoW3RydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZV0sICdib29sJyksXG4gICAgICB4NDogdGYuY29tcGxleChbMSwgMV0sIFsyLCAyXSlcbiAgICB9O1xuICAgIGNvbnN0IGRhdGFBbmRTcGVjcyA9IGF3YWl0IHRmLmlvLmVuY29kZVdlaWdodHModGVuc29ycyk7XG4gICAgY29uc3QgZGF0YSA9IGRhdGFBbmRTcGVjcy5kYXRhO1xuICAgIGNvbnN0IHNwZWNzID0gZGF0YUFuZFNwZWNzLnNwZWNzO1xuICAgIGV4cGVjdChkYXRhLmJ5dGVMZW5ndGgpLnRvRXF1YWwoNCAqIDQgKyA0ICogMSArIDEgKiA0ICsgNCAqIDQpO1xuICAgIGV4cGVjdChuZXcgSW50MzJBcnJheShkYXRhLCAwLCA0KSkudG9FcXVhbChuZXcgSW50MzJBcnJheShbXG4gICAgICAxMCwgMjAsIDMwLCA0MFxuICAgIF0pKTtcbiAgICBleHBlY3QobmV3IEZsb2F0MzJBcnJheShkYXRhLCAxNiwgMSkpLnRvRXF1YWwobmV3IEZsb2F0MzJBcnJheShbMTMuMzddKSk7XG4gICAgZXhwZWN0KG5ldyBVaW50OEFycmF5KGRhdGEsIDIwLCA0KSkudG9FcXVhbChuZXcgVWludDhBcnJheShbMSwgMCwgMCwgMV0pKTtcbiAgICBleHBlY3QobmV3IEZsb2F0MzJBcnJheShkYXRhLCAyNCwgNCkpLnRvRXF1YWwobmV3IEZsb2F0MzJBcnJheShbXG4gICAgICAxLCAyLCAxLCAyXG4gICAgXSkpO1xuICAgIGV4cGVjdChzcGVjcykudG9FcXVhbChbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICd4MScsXG4gICAgICAgIGR0eXBlOiAnaW50MzInLFxuICAgICAgICBzaGFwZTogWzIsIDJdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3gyJyxcbiAgICAgICAgZHR5cGU6ICdmbG9hdDMyJyxcbiAgICAgICAgc2hhcGU6IFtdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3gzJyxcbiAgICAgICAgZHR5cGU6ICdib29sJyxcbiAgICAgICAgc2hhcGU6IFs0XSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICd4NCcsXG4gICAgICAgIGR0eXBlOiAnY29tcGxleDY0JyxcbiAgICAgICAgc2hhcGU6IFsyXSxcbiAgICAgIH1cbiAgICBdKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ2RlY29kZVdlaWdodHMnLCB7fSwgKCkgPT4ge1xuICBpdCgnTWl4ZWQgZHR5cGUgdGVuc29ycycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB0ZW5zb3JzOiBOYW1lZFRlbnNvck1hcCA9IHtcbiAgICAgIHgxOiB0ZW5zb3IyZChbWzEwLCAyMF0sIFszMCwgNDBdXSwgWzIsIDJdLCAnaW50MzInKSxcbiAgICAgIHgyOiBzY2FsYXIoMTMuMzcsICdmbG9hdDMyJyksXG4gICAgICB4MzogdGVuc29yMWQoW3RydWUsIGZhbHNlLCBmYWxzZV0sICdib29sJyksXG4gICAgICB4NDogdGVuc29yMmQoW1sn0LfQtNGA0LDQstC+JywgJ2EnXSwgWydiJywgJ2MnXV0sIFsyLCAyXSwgJ3N0cmluZycpLFxuICAgICAgeDU6IHRlbnNvcjFkKFsnJ10sICdzdHJpbmcnKSwgIC8vIEVtcHR5IHN0cmluZy5cbiAgICAgIHg2OiBzY2FsYXIoJ2hlbGxvJyksICAgICAgICAgICAvLyBTaW5nbGUgc3RyaW5nLlxuICAgICAgeTE6IHRlbnNvcjJkKFstMTAsIC0yMCwgLTMwXSwgWzMsIDFdLCAnZmxvYXQzMicpLFxuICAgICAgeTI6IHRmLmNvbXBsZXgoWzEsIDFdLCBbMiwgMl0pXG4gICAgfTtcbiAgICBjb25zdCBkYXRhQW5kU3BlY3MgPSBhd2FpdCB0Zi5pby5lbmNvZGVXZWlnaHRzKHRlbnNvcnMpO1xuICAgIGNvbnN0IGRhdGEgPSBkYXRhQW5kU3BlY3MuZGF0YTtcbiAgICBjb25zdCBzcGVjcyA9IGRhdGFBbmRTcGVjcy5zcGVjcztcbiAgICBjb25zdCBkZWNvZGVkID0gdGYuaW8uZGVjb2RlV2VpZ2h0cyhkYXRhLCBzcGVjcyk7XG4gICAgZXhwZWN0KE9iamVjdC5rZXlzKGRlY29kZWQpLmxlbmd0aCkudG9FcXVhbCg4KTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBkZWNvZGVkWyd4MSddLmRhdGEoKSwgYXdhaXQgdGVuc29yc1sneDEnXS5kYXRhKCkpO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGRlY29kZWRbJ3gyJ10uZGF0YSgpLCBhd2FpdCB0ZW5zb3JzWyd4MiddLmRhdGEoKSk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgZGVjb2RlZFsneDMnXS5kYXRhKCksIGF3YWl0IHRlbnNvcnNbJ3gzJ10uZGF0YSgpKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBkZWNvZGVkWyd4NCddLmRhdGEoKSwgYXdhaXQgdGVuc29yc1sneDQnXS5kYXRhKCkpO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGRlY29kZWRbJ3g1J10uZGF0YSgpLCBhd2FpdCB0ZW5zb3JzWyd4NSddLmRhdGEoKSk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgZGVjb2RlZFsneDYnXS5kYXRhKCksIGF3YWl0IHRlbnNvcnNbJ3g2J10uZGF0YSgpKTtcbiAgICBleHBlY3RBcnJheXNFcXVhbChhd2FpdCBkZWNvZGVkWyd5MSddLmRhdGEoKSwgYXdhaXQgdGVuc29yc1sneTEnXS5kYXRhKCkpO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IGRlY29kZWRbJ3kyJ10uZGF0YSgpLCBhd2FpdCB0ZW5zb3JzWyd5MiddLmRhdGEoKSk7XG4gIH0pO1xuXG4gIGl0KCdVbnN1cHBvcnRlZCBkdHlwZSByYWlzZXMgRXJyb3InLCAoKSA9PiB7XG4gICAgY29uc3QgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICBjb25zdCBzcGVjczogYW55ID0gW1xuICAgICAge1xuICAgICAgICBuYW1lOiAneCcsXG4gICAgICAgIGR0eXBlOiAnaW50MTYnLFxuICAgICAgICBzaGFwZTogW10sXG4gICAgICB9LFxuICAgICAge25hbWU6ICd5JywgZHR5cGU6ICdpbnQxNicsIHNoYXBlOiBbXX1cbiAgICBdO1xuICAgIGV4cGVjdCgoKSA9PiB0Zi5pby5kZWNvZGVXZWlnaHRzKGJ1ZmZlciwgc3BlY3MpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9VbnN1cHBvcnRlZCBkdHlwZSBpbiB3ZWlnaHQgXFwneFxcJzogaW50MTYvKTtcbiAgfSk7XG5cbiAgaXQoJ3N1cHBvcnQgcXVhbnRpemF0aW9uIHVpbnQ4IHdlaWdodHMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgbWFuaWZlc3RTcGVjczogV2VpZ2h0c01hbmlmZXN0RW50cnlbXSA9IFtcbiAgICAgIHtcbiAgICAgICAgJ25hbWUnOiAnd2VpZ2h0MCcsXG4gICAgICAgICdkdHlwZSc6ICdmbG9hdDMyJyxcbiAgICAgICAgJ3NoYXBlJzogWzNdLFxuICAgICAgICAncXVhbnRpemF0aW9uJzogeydtaW4nOiAtMSwgJ3NjYWxlJzogMC4xLCAnZHR5cGUnOiAndWludDgnfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ25hbWUnOiAnd2VpZ2h0MScsXG4gICAgICAgICdkdHlwZSc6ICdpbnQzMicsXG4gICAgICAgICdzaGFwZSc6IFszXSxcbiAgICAgICAgJ3F1YW50aXphdGlvbic6IHsnbWluJzogLTEsICdzY2FsZSc6IDAuMSwgJ2R0eXBlJzogJ3VpbnQ4J31cbiAgICAgIH1cbiAgICBdO1xuICAgIGNvbnN0IGRhdGEgPSBuZXcgVWludDhBcnJheShbMCwgNDgsIDI1NSwgMCwgNDgsIDI1NV0pO1xuICAgIGNvbnN0IGRlY29kZWQgPSB0Zi5pby5kZWNvZGVXZWlnaHRzKGRhdGEuYnVmZmVyLCBtYW5pZmVzdFNwZWNzKTtcbiAgICBjb25zdCB3ZWlnaHQwID0gZGVjb2RlZFsnd2VpZ2h0MCddO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHdlaWdodDAuZGF0YSgpLCBbLTEsIDMuOCwgMjQuNV0pO1xuICAgIGV4cGVjdCh3ZWlnaHQwLnNoYXBlKS50b0VxdWFsKFszXSk7XG4gICAgZXhwZWN0KHdlaWdodDAuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcblxuICAgIGNvbnN0IHdlaWdodDEgPSBkZWNvZGVkWyd3ZWlnaHQxJ107XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgd2VpZ2h0MS5kYXRhKCksIFstMSwgNCwgMjVdKTtcbiAgICBleHBlY3Qod2VpZ2h0MS5zaGFwZSkudG9FcXVhbChbM10pO1xuICAgIGV4cGVjdCh3ZWlnaHQxLmR0eXBlKS50b0VxdWFsKCdpbnQzMicpO1xuICB9KTtcblxuICBpdCgnc3VwcG9ydCBxdWFudGl6YXRpb24gdWludDE2IHdlaWdodHMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgbWFuaWZlc3RTcGVjczogV2VpZ2h0c01hbmlmZXN0RW50cnlbXSA9IFtcbiAgICAgIHtcbiAgICAgICAgJ25hbWUnOiAnd2VpZ2h0MCcsXG4gICAgICAgICdkdHlwZSc6ICdmbG9hdDMyJyxcbiAgICAgICAgJ3NoYXBlJzogWzNdLFxuICAgICAgICAncXVhbnRpemF0aW9uJzogeydtaW4nOiAtMSwgJ3NjYWxlJzogMC4xLCAnZHR5cGUnOiAndWludDE2J31cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICduYW1lJzogJ3dlaWdodDEnLFxuICAgICAgICAnZHR5cGUnOiAnaW50MzInLFxuICAgICAgICAnc2hhcGUnOiBbM10sXG4gICAgICAgICdxdWFudGl6YXRpb24nOiB7J21pbic6IC0xLCAnc2NhbGUnOiAwLjEsICdkdHlwZSc6ICd1aW50MTYnfVxuICAgICAgfVxuICAgIF07XG4gICAgY29uc3QgZGF0YSA9IG5ldyBVaW50MTZBcnJheShbMCwgNDgsIDI1NSwgMCwgNDgsIDI1NV0pO1xuICAgIGNvbnN0IGRlY29kZWQgPSB0Zi5pby5kZWNvZGVXZWlnaHRzKGRhdGEuYnVmZmVyLCBtYW5pZmVzdFNwZWNzKTtcbiAgICBjb25zdCB3ZWlnaHQwID0gZGVjb2RlZFsnd2VpZ2h0MCddO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHdlaWdodDAuZGF0YSgpLCBbLTEsIDMuOCwgMjQuNV0pO1xuICAgIGV4cGVjdCh3ZWlnaHQwLnNoYXBlKS50b0VxdWFsKFszXSk7XG4gICAgZXhwZWN0KHdlaWdodDAuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcblxuICAgIGNvbnN0IHdlaWdodDEgPSBkZWNvZGVkWyd3ZWlnaHQxJ107XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgd2VpZ2h0MS5kYXRhKCksIFstMSwgNCwgMjVdKTtcbiAgICBleHBlY3Qod2VpZ2h0MS5zaGFwZSkudG9FcXVhbChbM10pO1xuICAgIGV4cGVjdCh3ZWlnaHQxLmR0eXBlKS50b0VxdWFsKCdpbnQzMicpO1xuICB9KTtcbiAgaXQoJ3N1cHBvcnQgcXVhbnRpemF0aW9uIGZsb2F0MTYgd2VpZ2h0cycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBtYW5pZmVzdFNwZWNzOiBXZWlnaHRzTWFuaWZlc3RFbnRyeVtdID0gW1xuICAgICAge1xuICAgICAgICBuYW1lOiAnd2VpZ2h0MCcsXG4gICAgICAgIGR0eXBlOiAnZmxvYXQzMicsXG4gICAgICAgIHNoYXBlOiBbM10sXG4gICAgICAgIHF1YW50aXphdGlvbjogeyBkdHlwZTogJ2Zsb2F0MTYnIH0sXG4gICAgICB9LFxuICAgIF07XG4gICAgY29uc3QgZGF0YSA9IG5ldyBVaW50MTZBcnJheShbMTMzMTIsIDE0MzM2LCAxNDg0OF0pO1xuICAgIGNvbnN0IGRlY29kZWQgPSB0Zi5pby5kZWNvZGVXZWlnaHRzKGRhdGEuYnVmZmVyLCBtYW5pZmVzdFNwZWNzKTtcbiAgICBjb25zdCB3ZWlnaHQwID0gZGVjb2RlZFsnd2VpZ2h0MCddO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHdlaWdodDAuZGF0YSgpLCBbMC4yNSwgMC41LCAwLjc1XSk7XG4gICAgZXhwZWN0KHdlaWdodDAuc2hhcGUpLnRvRXF1YWwoWzNdKTtcbiAgICBleHBlY3Qod2VpZ2h0MC5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnc3RyaW5nQnl0ZUxlbmd0aCcsICgpID0+IHtcbiAgaXQoJ0FTQ0lJIG9ubHknLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RyID0gJ19Mb3JlbSBpcHN1bSAxMzM3ISc7XG4gICAgZXhwZWN0KHN0cmluZ0J5dGVMZW5ndGgoc3RyKSkudG9FcXVhbChzdHIubGVuZ3RoKTtcbiAgfSk7XG5cbiAgaXQoJ01peGVkIG5hcnJvdyBhbmQgd2lkZSBjaGFycycsICgpID0+IHtcbiAgICBjb25zdCBzdHIgPSAnYdCW5paHMSc7XG4gICAgZXhwZWN0KHN0cmluZ0J5dGVMZW5ndGgoc3RyLnNsaWNlKDAsIDEpKSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3Qoc3RyaW5nQnl0ZUxlbmd0aChzdHIuc2xpY2UoMCwgMikpKS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChzdHJpbmdCeXRlTGVuZ3RoKHN0ci5zbGljZSgwLCAzKSkpLnRvRXF1YWwoNik7XG4gICAgZXhwZWN0KHN0cmluZ0J5dGVMZW5ndGgoc3RyLnNsaWNlKDAsIDQpKSkudG9FcXVhbCg3KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmVXaXRoRmxhZ3MoXG4gICAgJ2FycmF5QnVmZmVyVG9CYXNlNjRTdHJpbmctYmFzZTY0U3RyaW5nVG9BcnJheUJ1ZmZlcicsIEJST1dTRVJfRU5WUywgKCkgPT4ge1xuICAgICAgaXQoJ1JvdW5kIHRyaXAnLCAoKSA9PiB7XG4gICAgICAgIC8vIEdlbmVyYXRlIHNvbWUgc2VtaS1yYW5kb20gYmluYXJ5IGRhdGEuXG4gICAgICAgIGNvbnN0IHggPSBbXTtcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCAyOyArK2spIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI1NDsgKytpKSB7XG4gICAgICAgICAgICB4LnB1c2goaSArIGspO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmb3IgKGxldCBpID0gMjU0OyBpID49IDA7IC0taSkge1xuICAgICAgICAgICAgeC5wdXNoKGkgKyBrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYnVmZmVyID0gVWludDhBcnJheS5mcm9tKHgpLmJ1ZmZlcjtcbiAgICAgICAgY29uc3QgYmFzZTY0U3RyID0gYXJyYXlCdWZmZXJUb0Jhc2U2NFN0cmluZyhidWZmZXIpO1xuICAgICAgICBjb25zdCBkZWNvZGVkID1cbiAgICAgICAgICAgIEFycmF5LmZyb20obmV3IFVpbnQ4QXJyYXkoYmFzZTY0U3RyaW5nVG9BcnJheUJ1ZmZlcihiYXNlNjRTdHIpKSk7XG4gICAgICAgIGV4cGVjdChkZWNvZGVkKS50b0VxdWFsKHgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbmRlc2NyaWJlKCdjb25jYXRlbmF0ZUFycmF5QnVmZmVycycsICgpID0+IHtcbiAgaXQoJ0NvbmNhdGVuYXRlIDMgbm9uLWVtcHR5IEFycmF5QnVmZmVycycsICgpID0+IHtcbiAgICBjb25zdCBidWZmZXIxID0gbmV3IFVpbnQ4QXJyYXkoWzEsIDIsIDNdKTtcbiAgICBjb25zdCBidWZmZXIyID0gbmV3IFVpbnQ4QXJyYXkoWzExLCAyMiwgMzMsIDQ0XSk7XG4gICAgY29uc3QgYnVmZmVyMyA9IG5ldyBVaW50OEFycmF5KFsxMTEsIDIyMiwgMTAwXSk7XG4gICAgY29uc3Qgb3V0ID0gY29uY2F0ZW5hdGVBcnJheUJ1ZmZlcnMoXG4gICAgICAgIFtidWZmZXIxLmJ1ZmZlciwgYnVmZmVyMi5idWZmZXIsIGJ1ZmZlcjMuYnVmZmVyXSk7XG4gICAgZXhwZWN0KG5ldyBVaW50OEFycmF5KG91dCkpLnRvRXF1YWwobmV3IFVpbnQ4QXJyYXkoW1xuICAgICAgMSwgMiwgMywgMTEsIDIyLCAzMywgNDQsIDExMSwgMjIyLCAxMDBcbiAgICBdKSk7XG4gIH0pO1xuXG4gIGl0KCdDb25jYXRlbmF0ZSBub24tZW1wdHkgYW5kIGVtcHR5IEFycmF5QnVmZmVycycsICgpID0+IHtcbiAgICBjb25zdCBidWZmZXIxID0gbmV3IFVpbnQ4QXJyYXkoWzEsIDIsIDNdKTtcbiAgICBjb25zdCBidWZmZXIyID0gbmV3IFVpbnQ4QXJyYXkoWzExLCAyMiwgMzMsIDQ0XSk7XG4gICAgY29uc3QgYnVmZmVyMyA9IG5ldyBVaW50OEFycmF5KFtdKTtcbiAgICBjb25zdCBidWZmZXI0ID0gbmV3IFVpbnQ4QXJyYXkoWzE1MCwgMTAwLCA1MF0pO1xuICAgIGNvbnN0IG91dCA9IGNvbmNhdGVuYXRlQXJyYXlCdWZmZXJzKFxuICAgICAgICBbYnVmZmVyMS5idWZmZXIsIGJ1ZmZlcjIuYnVmZmVyLCBidWZmZXIzLmJ1ZmZlciwgYnVmZmVyNC5idWZmZXJdKTtcbiAgICBleHBlY3QobmV3IFVpbnQ4QXJyYXkob3V0KSkudG9FcXVhbChuZXcgVWludDhBcnJheShbXG4gICAgICAxLCAyLCAzLCAxMSwgMjIsIDMzLCA0NCwgMTUwLCAxMDAsIDUwXG4gICAgXSkpO1xuICB9KTtcblxuICBpdCgnQSBzaW5nbGUgQXJyYXlCdWZmZXInLCAoKSA9PiB7XG4gICAgY29uc3QgYnVmZmVyMSA9IG5ldyBVaW50OEFycmF5KFsxLCAzLCAzLCA3XSk7XG4gICAgY29uc3Qgb3V0ID0gY29uY2F0ZW5hdGVBcnJheUJ1ZmZlcnMoW2J1ZmZlcjEuYnVmZmVyXSk7XG4gICAgZXhwZWN0KG5ldyBVaW50OEFycmF5KG91dCkpLnRvRXF1YWwoYnVmZmVyMSk7XG4gIH0pO1xuXG4gIGl0KCdaZXJvIEFycmF5QnVmZmVycycsICgpID0+IHtcbiAgICBleHBlY3QobmV3IFVpbnQ4QXJyYXkoY29uY2F0ZW5hdGVBcnJheUJ1ZmZlcnMoW10pKSlcbiAgICAgICAgLnRvRXF1YWwobmV3IFVpbnQ4QXJyYXkoW10pKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2Jhc2VuYW1lJywgKCkgPT4ge1xuICBpdCgnUGF0aHMgd2l0aG91dCBzbGFzaGVzJywgKCkgPT4ge1xuICAgIGV4cGVjdChiYXNlbmFtZSgnZm9vLnR4dCcpKS50b0VxdWFsKCdmb28udHh0Jyk7XG4gICAgZXhwZWN0KGJhc2VuYW1lKCdiYXInKSkudG9FcXVhbCgnYmFyJyk7XG4gIH0pO1xuXG4gIGl0KCdQYXRocyB3aXRoIHNsYXNoZXMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KGJhc2VuYW1lKCdxdXgvZm9vLnR4dCcpKS50b0VxdWFsKCdmb28udHh0Jyk7XG4gICAgZXhwZWN0KGJhc2VuYW1lKCdxdXgvTXkgTW9kZWwuanNvbicpKS50b0VxdWFsKCdNeSBNb2RlbC5qc29uJyk7XG4gICAgZXhwZWN0KGJhc2VuYW1lKCdmb28vYmFyL2JheicpKS50b0VxdWFsKCdiYXonKTtcbiAgICBleHBlY3QoYmFzZW5hbWUoJy9mb28vYmFyL2JheicpKS50b0VxdWFsKCdiYXonKTtcbiAgICBleHBlY3QoYmFzZW5hbWUoJ2Zvby9iYXIvYmF6LycpKS50b0VxdWFsKCdiYXonKTtcbiAgICBleHBlY3QoYmFzZW5hbWUoJ2Zvby9iYXIvYmF6Ly8nKSkudG9FcXVhbCgnYmF6Jyk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdmbG9hdDE2JywgKCkgPT4ge1xuICBpdCgnZGVjb2RlcyBOYU4gdG8gZmxvYXQzMiBOYU4nLCAoKSA9PiB7XG4gICAgY29uc3QgZGVjb2RlciA9IGdldEZsb2F0MTZEZWNvZGVyKCk7XG4gICAgY29uc3QgZmxvYXQxNk5hTiA9IDB4MDAwMDdlMDA7XG4gICAgY29uc3QgYnVmZmVyID0gbmV3IFVpbnQxNkFycmF5KFtmbG9hdDE2TmFOXSk7XG4gICAgY29uc3QgZjMyID0gZGVjb2RlcihidWZmZXIpO1xuICAgIGV4cGVjdChmMzIpLnRvRXF1YWwobmV3IEZsb2F0MzJBcnJheShbTmFOXSkpO1xuICB9KTtcblxuICBpdCgnZGVjb2RlcyDCsUluZmluaXR5IHRvIGZsb2F0MzIgwrFJbmZpbml0eScsICgpID0+IHtcbiAgICBjb25zdCBkZWNvZGVyID0gZ2V0RmxvYXQxNkRlY29kZXIoKTtcbiAgICBjb25zdCBwb3NpdGl2ZUluZmluaXR5ID0gMHgwMDAwN2MwMDtcbiAgICBjb25zdCBuZWdhdGl2ZUluZmluaXR5ID0gMHhmZmZmZmMwMDtcbiAgICBjb25zdCBidWZmZXIgPSBuZXcgVWludDE2QXJyYXkoW3Bvc2l0aXZlSW5maW5pdHksIG5lZ2F0aXZlSW5maW5pdHldKTtcbiAgICBjb25zdCBmMzIgPSBkZWNvZGVyKGJ1ZmZlcik7XG4gICAgZXhwZWN0KGYzMikudG9FcXVhbChuZXcgRmxvYXQzMkFycmF5KFtJbmZpbml0eSwgLUluZmluaXR5XSkpO1xuICB9KTtcblxuICBpdCgnZGVjb2RlcyDCsTAgdG8gZmxvYXQzMiDCsTAnLCAoKSA9PiB7XG4gICAgY29uc3QgZGVjb2RlciA9IGdldEZsb2F0MTZEZWNvZGVyKCk7XG4gICAgY29uc3QgcG9zaXRpdmVaZXJvID0gMHgwMDAwMDAwMDtcbiAgICBjb25zdCBuZWdhdGl2ZVplcm8gPSAweGZmZmY4MDAwO1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBVaW50MTZBcnJheShbcG9zaXRpdmVaZXJvLCBuZWdhdGl2ZVplcm9dKTtcbiAgICBjb25zdCBmMzIgPSBkZWNvZGVyKGJ1ZmZlcik7XG4gICAgZXhwZWN0KGYzMikudG9FcXVhbChuZXcgRmxvYXQzMkFycmF5KFswLjAsIC0wLjBdKSk7XG4gIH0pO1xuXG4gIGl0KCdkZWNvZGVzIC1JbmZpbml0eSBvbiB1bmRlcmZsb3cnLCAoKSA9PiB7XG4gICAgY29uc3QgZGVjb2RlciA9IGdldEZsb2F0MTZEZWNvZGVyKCk7XG4gICAgY29uc3QgbWluVmFsID0gMHhmZmZmZmJmZjtcbiAgICBjb25zdCBidWZmZXIgPSBuZXcgVWludDE2QXJyYXkoW21pblZhbCArIDFdKTtcbiAgICBjb25zdCBmMzIgPSBkZWNvZGVyKGJ1ZmZlcik7XG4gICAgZXhwZWN0KGYzMikudG9FcXVhbChuZXcgRmxvYXQzMkFycmF5KFstSW5maW5pdHldKSk7XG4gIH0pO1xuXG4gIGl0KCdkZWNvZGVzICtJbmZpbml0eSBvbiBvdmVyZmxvdycsICgpID0+IHtcbiAgICBjb25zdCBkZWNvZGVyID0gZ2V0RmxvYXQxNkRlY29kZXIoKTtcbiAgICBjb25zdCBtYXhWYWwgPSAweDAwMDA3YmZmO1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBVaW50MTZBcnJheShbbWF4VmFsICsgMV0pO1xuICAgIGNvbnN0IGYzMiA9IGRlY29kZXIoYnVmZmVyKTtcbiAgICBleHBlY3QoZjMyKS50b0VxdWFsKG5ldyBGbG9hdDMyQXJyYXkoW0luZmluaXR5XSkpO1xuICB9KTtcblxuICBpdCgnZGVjb2RlcyBpbnRlcnByZXRhYmxlIGZsb2F0MTYgdG8gZmxvYXQzMicsICgpID0+IHtcbiAgICBjb25zdCBkZWNvZGVyID0gZ2V0RmxvYXQxNkRlY29kZXIoKTtcbiAgICBjb25zdCBidWZmZXIgPSBuZXcgVWludDE2QXJyYXkoW1xuICAgICAgMHgwMDAwMzQwMCxcbiAgICAgIDB4MDAwMDM4MDAsXG4gICAgICAweDAwMDAzQTAwLFxuICAgICAgMHgwMDAwMzU1NVxuICAgIF0pO1xuICAgIGNvbnN0IGYzMiA9IGRlY29kZXIoYnVmZmVyKTtcbiAgICBleHBlY3QoZjMyWzBdKS50b0JlQ2xvc2VUbygwLjI1KTtcbiAgICBleHBlY3QoZjMyWzFdKS50b0JlQ2xvc2VUbygwLjUpO1xuICAgIGV4cGVjdChmMzJbMl0pLnRvQmVDbG9zZVRvKDAuNzUpO1xuICAgIGV4cGVjdChmMzJbM10pLnRvQmVDbG9zZVRvKDAuMzMzKTtcbiAgfSk7XG59KTtcbiJdfQ==