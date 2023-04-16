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
import { BROWSER_ENVS, describeWithFlags } from '../jasmine_util';
import { expectArraysClose, expectArraysEqual } from '../test_util';
describeWithFlags('loadWeights', BROWSER_ENVS, () => {
    const setupFakeWeightFiles = (fileBufferMap) => {
        spyOn(tf.env().platform, 'fetch').and.callFake(async (path) => {
            return new Response(fileBufferMap[path], { headers: { 'Content-type': 'application/octet-stream' } });
        });
    };
    it('1 group, 1 weight, 1 requested weight', async () => {
        setupFakeWeightFiles({ './weightfile0': new Float32Array([1, 2, 3]) });
        const manifest = [{
                'paths': ['weightfile0'],
                'weights': [{ 'name': 'weight0', 'dtype': 'float32', 'shape': [3] }]
            }];
        const weightsNamesToFetch = ['weight0'];
        const weights = await tf.io.loadWeights(manifest, './', weightsNamesToFetch);
        expect(tf.env().platform.fetch.calls.count()).toBe(1);
        const weightNames = Object.keys(weights);
        expect(weightNames.length).toEqual(weightsNamesToFetch.length);
        const weight0 = weights['weight0'];
        expectArraysClose(await weight0.data(), [1, 2, 3]);
        expect(weight0.shape).toEqual([3]);
        expect(weight0.dtype).toEqual('float32');
    });
    it('1 group, 2 weights, fetch 1st weight', async () => {
        setupFakeWeightFiles({ './weightfile0': new Float32Array([1, 2, 3, 4, 5]) });
        const manifest = [{
                'paths': ['weightfile0'],
                'weights': [
                    { 'name': 'weight0', 'dtype': 'float32', 'shape': [2] },
                    { 'name': 'weight1', 'dtype': 'float32', 'shape': [3] }
                ]
            }];
        // Load the first weight.
        const weights = await tf.io.loadWeights(manifest, './', ['weight0']);
        expect(tf.env().platform.fetch.calls.count()).toBe(1);
        const weightNames = Object.keys(weights);
        expect(weightNames.length).toEqual(1);
        const weight0 = weights['weight0'];
        expectArraysClose(await weight0.data(), [1, 2]);
        expect(weight0.shape).toEqual([2]);
        expect(weight0.dtype).toEqual('float32');
    });
    it('1 group, 2 weights, fetch 2nd weight', async () => {
        setupFakeWeightFiles({ './weightfile0': new Float32Array([1, 2, 3, 4, 5]) });
        const manifest = [{
                'paths': ['weightfile0'],
                'weights': [
                    { 'name': 'weight0', 'dtype': 'float32', 'shape': [2] },
                    { 'name': 'weight1', 'dtype': 'float32', 'shape': [3] }
                ]
            }];
        // Load the second weight.
        const weights = await tf.io.loadWeights(manifest, './', ['weight1']);
        expect(tf.env().platform.fetch.calls.count()).toBe(1);
        const weightNames = Object.keys(weights);
        expect(weightNames.length).toEqual(1);
        const weight1 = weights['weight1'];
        expectArraysClose(await weight1.data(), [3, 4, 5]);
        expect(weight1.shape).toEqual([3]);
        expect(weight1.dtype).toEqual('float32');
    });
    it('1 group, 2 weights, fetch all weights', async () => {
        setupFakeWeightFiles({ './weightfile0': new Float32Array([1, 2, 3, 4, 5]) });
        const manifest = [{
                'paths': ['weightfile0'],
                'weights': [
                    { 'name': 'weight0', 'dtype': 'float32', 'shape': [2] },
                    { 'name': 'weight1', 'dtype': 'float32', 'shape': [3] }
                ]
            }];
        // Load all weights.
        const weights = await tf.io.loadWeights(manifest, './', ['weight0', 'weight1']);
        expect(tf.env().platform.fetch.calls.count()).toBe(1);
        const weightNames = Object.keys(weights);
        expect(weightNames.length).toEqual(2);
        const weight0 = weights['weight0'];
        expectArraysClose(await weight0.data(), [1, 2]);
        expect(weight0.shape).toEqual([2]);
        expect(weight0.dtype).toEqual('float32');
        const weight1 = weights['weight1'];
        expectArraysClose(await weight1.data(), [3, 4, 5]);
        expect(weight1.shape).toEqual([3]);
        expect(weight1.dtype).toEqual('float32');
    });
    it('1 group, multiple weights, different dtypes', async () => {
        const buffer = new ArrayBuffer(5 * 4 + 1);
        const view = new DataView(buffer);
        view.setInt32(0, 1, true);
        view.setInt32(4, 2, true);
        view.setUint8(8, 1);
        view.setFloat32(9, 3., true);
        view.setFloat32(13, 4., true);
        view.setFloat32(17, 5., true);
        setupFakeWeightFiles({ './weightfile0': buffer });
        const manifest = [{
                'paths': ['weightfile0'],
                'weights': [
                    { 'name': 'weight0', 'dtype': 'int32', 'shape': [2] },
                    { 'name': 'weight1', 'dtype': 'bool', 'shape': [] },
                    { 'name': 'weight2', 'dtype': 'float32', 'shape': [3] },
                ]
            }];
        // Load all weights.
        const weights = await tf.io.loadWeights(manifest, './', ['weight0', 'weight1', 'weight2']);
        expect(tf.env().platform.fetch.calls.count()).toBe(1);
        const weightNames = Object.keys(weights);
        expect(weightNames.length).toEqual(3);
        const weight0 = weights['weight0'];
        expectArraysClose(await weight0.data(), [1, 2]);
        expect(weight0.shape).toEqual([2]);
        expect(weight0.dtype).toEqual('int32');
        const weight1 = weights['weight1'];
        expectArraysClose(await weight1.data(), [1]);
        expect(weight1.shape).toEqual([]);
        expect(weight1.dtype).toEqual('bool');
        const weight2 = weights['weight2'];
        expectArraysClose(await weight2.data(), [3, 4, 5]);
        expect(weight2.shape).toEqual([3]);
        expect(weight2.dtype).toEqual('float32');
    });
    it('1 group, sharded 1 weight across multiple files', async () => {
        const shard0 = new Float32Array([1, 2, 3, 4, 5]);
        const shard1 = new Float32Array([1.1, 2.2]);
        const shard2 = new Float32Array([10, 20, 30]);
        setupFakeWeightFiles({
            './weightfile0': shard0,
            './weightsfile1': shard1,
            './weightsfile2': shard2
        });
        const manifest = [{
                'paths': ['weightfile0', 'weightsfile1', 'weightsfile2'],
                'weights': [{ 'name': 'weight0', 'dtype': 'float32', 'shape': [5, 2] }]
            }];
        const weights = await tf.io.loadWeights(manifest, './', ['weight0']);
        expect(tf.env().platform.fetch.calls.count()).toBe(3);
        const weightNames = Object.keys(weights);
        expect(weightNames.length).toEqual(1);
        const weight0 = weights['weight0'];
        expectArraysClose(await weight0.data(), [1, 2, 3, 4, 5, 1.1, 2.2, 10, 20, 30]);
        expect(weight0.shape).toEqual([5, 2]);
        expect(weight0.dtype).toEqual('float32');
    });
    it('1 group, sharded 2 weights across multiple files', async () => {
        const shard0 = new Int32Array([1, 2, 3, 4, 5]);
        // shard1 contains part of the first weight and part of the second.
        const shard1 = new ArrayBuffer(5 * 4);
        const intBuffer = new Int32Array(shard1, 0, 2);
        intBuffer.set([10, 20]);
        const floatBuffer = new Float32Array(shard1, intBuffer.byteLength, 3);
        floatBuffer.set([3.0, 4.0, 5.0]);
        const shard2 = new Float32Array([10, 20, 30]);
        setupFakeWeightFiles({
            './weightfile0': shard0,
            './weightsfile1': shard1,
            './weightsfile2': shard2
        });
        const manifest = [{
                'paths': ['weightfile0', 'weightsfile1', 'weightsfile2'],
                'weights': [
                    { 'name': 'weight0', 'dtype': 'int32', 'shape': [7, 1] },
                    { 'name': 'weight1', 'dtype': 'float32', 'shape': [3, 2] }
                ]
            }];
        const weights = await tf.io.loadWeights(manifest, './', ['weight0', 'weight1']);
        expect(tf.env().platform.fetch.calls.count()).toBe(3);
        const weightNames = Object.keys(weights);
        expect(weightNames.length).toEqual(2);
        const weight0 = weights['weight0'];
        expectArraysClose(await weight0.data(), [1, 2, 3, 4, 5, 10, 20]);
        expect(weight0.shape).toEqual([7, 1]);
        expect(weight0.dtype).toEqual('int32');
        const weight1 = weights['weight1'];
        expectArraysClose(await weight1.data(), [3.0, 4.0, 5.0, 10, 20, 30]);
        expect(weight1.shape).toEqual([3, 2]);
        expect(weight1.dtype).toEqual('float32');
    });
    it('2 group, 4 weights, fetches one group', async () => {
        setupFakeWeightFiles({
            './weightfile0': new Float32Array([1, 2, 3, 4, 5]),
            './weightfile1': new Float32Array([6, 7, 8, 9])
        });
        const manifest = [
            {
                'paths': ['weightfile0'],
                'weights': [
                    { 'name': 'weight0', 'dtype': 'float32', 'shape': [2] },
                    { 'name': 'weight1', 'dtype': 'float32', 'shape': [3] }
                ]
            },
            {
                'paths': ['weightfile1'],
                'weights': [
                    { 'name': 'weight2', 'dtype': 'float32', 'shape': [3, 1] },
                    { 'name': 'weight3', 'dtype': 'float32', 'shape': [] }
                ]
            }
        ];
        const weights = await tf.io.loadWeights(manifest, './', ['weight0', 'weight1']);
        // Only the first group should be fetched.
        expect(tf.env().platform.fetch.calls.count()).toBe(1);
        const weightNames = Object.keys(weights);
        expect(weightNames.length).toEqual(2);
        const weight0 = weights['weight0'];
        expectArraysClose(await weight0.data(), [1, 2]);
        expect(weight0.shape).toEqual([2]);
        expect(weight0.dtype).toEqual('float32');
        const weight1 = weights['weight1'];
        expectArraysClose(await weight1.data(), [3, 4, 5]);
        expect(weight1.shape).toEqual([3]);
        expect(weight1.dtype).toEqual('float32');
    });
    it('2 group, 4 weights, one weight from each group', async () => {
        setupFakeWeightFiles({
            './weightfile0': new Float32Array([1, 2, 3, 4, 5]),
            './weightfile1': new Float32Array([6, 7, 8, 9])
        });
        const manifest = [
            {
                'paths': ['weightfile0'],
                'weights': [
                    { 'name': 'weight0', 'dtype': 'float32', 'shape': [2] },
                    { 'name': 'weight1', 'dtype': 'float32', 'shape': [3] }
                ]
            },
            {
                'paths': ['weightfile1'],
                'weights': [
                    { 'name': 'weight2', 'dtype': 'float32', 'shape': [3, 1] },
                    { 'name': 'weight3', 'dtype': 'float32', 'shape': [] }
                ]
            }
        ];
        const weights = await tf.io.loadWeights(manifest, './', ['weight0', 'weight2']);
        // Both groups need to be fetched.
        expect(tf.env().platform.fetch.calls.count()).toBe(2);
        const weightNames = Object.keys(weights);
        expect(weightNames.length).toEqual(2);
        const weight0 = weights['weight0'];
        expectArraysClose(await weight0.data(), [1, 2]);
        expect(weight0.shape).toEqual([2]);
        expect(weight0.dtype).toEqual('float32');
        const weight2 = weights['weight2'];
        expectArraysClose(await weight2.data(), [6, 7, 8]);
        expect(weight2.shape).toEqual([3, 1]);
        expect(weight2.dtype).toEqual('float32');
    });
    it('2 group, 4 weights, dont specify weights fetchs all', async () => {
        setupFakeWeightFiles({
            './weightfile0': new Float32Array([1, 2, 3, 4, 5]),
            './weightfile1': new Float32Array([6, 7, 8, 9])
        });
        const manifest = [
            {
                'paths': ['weightfile0'],
                'weights': [
                    { 'name': 'weight0', 'dtype': 'float32', 'shape': [2] },
                    { 'name': 'weight1', 'dtype': 'float32', 'shape': [3] }
                ]
            },
            {
                'paths': ['weightfile1'],
                'weights': [
                    { 'name': 'weight2', 'dtype': 'float32', 'shape': [3, 1] },
                    { 'name': 'weight3', 'dtype': 'float32', 'shape': [] }
                ]
            }
        ];
        // Don't pass a third argument to loadWeights to load all weights.
        const weights = await tf.io.loadWeights(manifest, './');
        // Both groups need to be fetched.
        expect(tf.env().platform.fetch.calls.count()).toBe(2);
        const weightNames = Object.keys(weights);
        expect(weightNames.length).toEqual(4);
        const weight0 = weights['weight0'];
        expectArraysClose(await weight0.data(), [1, 2]);
        expect(weight0.shape).toEqual([2]);
        expect(weight0.dtype).toEqual('float32');
        const weight1 = weights['weight1'];
        expectArraysClose(await weight1.data(), [3, 4, 5]);
        expect(weight1.shape).toEqual([3]);
        expect(weight1.dtype).toEqual('float32');
        const weight2 = weights['weight2'];
        expectArraysClose(await weight2.data(), [6, 7, 8]);
        expect(weight2.shape).toEqual([3, 1]);
        expect(weight2.dtype).toEqual('float32');
        const weight3 = weights['weight3'];
        expectArraysClose(await weight3.data(), [9]);
        expect(weight3.shape).toEqual([]);
        expect(weight3.dtype).toEqual('float32');
    });
    it('throws if requested weight not found', async () => {
        setupFakeWeightFiles({ './weightfile0': new Float32Array([1, 2, 3]) });
        const manifest = [{
                'paths': ['weightfile0'],
                'weights': [{ 'name': 'weight0', 'dtype': 'float32', 'shape': [3] }]
            }];
        const weightsNamesToFetch = ['doesntexist'];
        try {
            await tf.io.loadWeights(manifest, './', weightsNamesToFetch);
            fail();
        }
        catch (e) {
            expect(e.message).toContain('Could not find weights');
        }
    });
    it('throws if requested weight has unknown dtype', async () => {
        setupFakeWeightFiles({ './weightfile0': new Float32Array([1, 2, 3]) });
        const manifest = [{
                'paths': ['weightfile0'],
                'weights': [{
                        'name': 'weight0',
                        // tslint:disable-next-line:no-any
                        'dtype': 'null',
                        'shape': [3]
                    }]
            }];
        const weightsNamesToFetch = ['weight0'];
        try {
            await tf.io.loadWeights(manifest, './', weightsNamesToFetch);
            fail();
        }
        catch (e) {
            expect(e.message).toContain('Unsupported dtype');
        }
    });
    it('should use request option', async () => {
        setupFakeWeightFiles({ './weightfile0': new Float32Array([1, 2, 3]) });
        const manifest = [{
                'paths': ['weightfile0'],
                'weights': [{ 'name': 'weight0', 'dtype': 'float32', 'shape': [3] }]
            }];
        const weightsNamesToFetch = ['weight0'];
        await tf.io.loadWeights(manifest, './', weightsNamesToFetch, { credentials: 'include' });
        expect(tf.env().platform.fetch.calls.count()).toBe(1);
        expect(tf.env().platform.fetch)
            .toHaveBeenCalledWith('./weightfile0', { credentials: 'include' }, { isBinary: true });
    });
    const quantizationTest = async (quantizationDtype) => {
        const arrayType = quantizationDtype === 'uint8' ? Uint8Array : Uint16Array;
        setupFakeWeightFiles({ './weightfile0': new arrayType([0, 48, 255, 0, 48, 255]) });
        const manifest = [{
                'paths': ['weightfile0'],
                'weights': [
                    {
                        'name': 'weight0',
                        'dtype': 'float32',
                        'shape': [3],
                        'quantization': { 'min': -1, 'scale': 0.1, 'dtype': quantizationDtype }
                    },
                    {
                        'name': 'weight1',
                        'dtype': 'int32',
                        'shape': [3],
                        'quantization': { 'min': -1, 'scale': 0.1, 'dtype': quantizationDtype }
                    }
                ]
            }];
        const weightsNamesToFetch = ['weight0', 'weight1'];
        const weights = await tf.io.loadWeights(manifest, './', weightsNamesToFetch);
        expect(tf.env().platform.fetch.calls.count()).toBe(1);
        const weightNames = Object.keys(weights);
        expect(weightNames.length).toEqual(weightsNamesToFetch.length);
        const weight0 = weights['weight0'];
        expectArraysClose(await weight0.data(), [-1, 3.8, 24.5]);
        expect(weight0.shape).toEqual([3]);
        expect(weight0.dtype).toEqual('float32');
        const weight1 = weights['weight1'];
        expectArraysEqual(await weight1.data(), [-1, 4, 25]);
        expect(weight1.shape).toEqual([3]);
        expect(weight1.dtype).toEqual('int32');
    };
    it('quantized weights (uint8)', async () => {
        await quantizationTest('uint8');
    });
    it('quantized weights (uint16)', async () => {
        await quantizationTest('uint16');
    });
    it('2 groups, 1 quantized, 1 unquantized', async () => {
        setupFakeWeightFiles({
            './weightfile0': new Uint8Array([0, 48, 255, 0, 48, 255]),
            './weightfile1': new Float32Array([6, 7, 8, 9])
        });
        const manifest = [
            {
                'paths': ['weightfile0'],
                'weights': [
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
                ]
            },
            {
                'paths': ['weightfile1'],
                'weights': [
                    { 'name': 'weight2', 'dtype': 'float32', 'shape': [3, 1] },
                    { 'name': 'weight3', 'dtype': 'float32', 'shape': [] }
                ]
            }
        ];
        const weights = await tf.io.loadWeights(manifest, './', ['weight0', 'weight2']);
        // Both groups need to be fetched.
        expect(tf.env().platform.fetch.calls.count()).toBe(2);
        const weightNames = Object.keys(weights);
        expect(weightNames.length).toEqual(2);
        const weight0 = weights['weight0'];
        expectArraysClose(await weight0.data(), [-1, 3.8, 24.5]);
        expect(weight0.shape).toEqual([3]);
        expect(weight0.dtype).toEqual('float32');
        const weight2 = weights['weight2'];
        expectArraysClose(await weight2.data(), [6, 7, 8]);
        expect(weight2.shape).toEqual([3, 1]);
        expect(weight2.dtype).toEqual('float32');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VpZ2h0c19sb2FkZXJfdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvaW8vd2VpZ2h0c19sb2FkZXJfdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxPQUFPLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMvQixPQUFPLEVBQUMsWUFBWSxFQUFFLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDaEUsT0FBTyxFQUFDLGlCQUFpQixFQUFFLGlCQUFpQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBR2xFLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQ2xELE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxhQUc3QixFQUFFLEVBQUU7UUFDSCxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFZLEVBQUUsRUFBRTtZQUNwRSxPQUFPLElBQUksUUFBUSxDQUNmLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFDbkIsRUFBQyxPQUFPLEVBQUUsRUFBQyxjQUFjLEVBQUUsMEJBQTBCLEVBQUMsRUFBQyxDQUFDLENBQUM7UUFDL0QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUM7SUFFRixFQUFFLENBQUMsdUNBQXVDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDckQsb0JBQW9CLENBQUMsRUFBQyxlQUFlLEVBQUUsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBRXJFLE1BQU0sUUFBUSxHQUEwQixDQUFDO2dCQUN2QyxPQUFPLEVBQUUsQ0FBQyxhQUFhLENBQUM7Z0JBQ3hCLFNBQVMsRUFBRSxDQUFDLEVB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QUMsU0FBUyxDQUFDLENBQUM7UUFFekMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ25DLGlCQUFpQixDQUFDLE1BQU0sT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDM0MsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbmltcG9ydCAqIGFzIHRmIGZyb20gJy4uL2luZGV4JztcbmltcG9ydCB7QlJPV1NFUl9FTlZTLCBkZXNjcmliZVdpdGhGbGFnc30gZnJvbSAnLi4vamFzbWluZV91dGlsJztcbmltcG9ydCB7ZXhwZWN0QXJyYXlzQ2xvc2UsIGV4cGVjdEFycmF5c0VxdWFsfSBmcm9tICcuLi90ZXN0X3V0aWwnO1xuaW1wb3J0IHtXZWlnaHRzTWFuaWZlc3RDb25maWd9IGZyb20gJy4vdHlwZXMnO1xuXG5kZXNjcmliZVdpdGhGbGFncygnbG9hZFdlaWdodHMnLCBCUk9XU0VSX0VOVlMsICgpID0+IHtcbiAgY29uc3Qgc2V0dXBGYWtlV2VpZ2h0RmlsZXMgPSAoZmlsZUJ1ZmZlck1hcDoge1xuICAgIFtmaWxlbmFtZTogc3RyaW5nXTogRmxvYXQzMkFycmF5fEludDMyQXJyYXl8QXJyYXlCdWZmZXJ8VWludDhBcnJheXxcbiAgICBVaW50MTZBcnJheVxuICB9KSA9PiB7XG4gICAgc3B5T24odGYuZW52KCkucGxhdGZvcm0sICdmZXRjaCcpLmFuZC5jYWxsRmFrZShhc3luYyAocGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFJlc3BvbnNlKFxuICAgICAgICAgIGZpbGVCdWZmZXJNYXBbcGF0aF0sXG4gICAgICAgICAge2hlYWRlcnM6IHsnQ29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSd9fSk7XG4gICAgfSk7XG4gIH07XG5cbiAgaXQoJzEgZ3JvdXAsIDEgd2VpZ2h0LCAxIHJlcXVlc3RlZCB3ZWlnaHQnLCBhc3luYyAoKSA9PiB7XG4gICAgc2V0dXBGYWtlV2VpZ2h0RmlsZXMoeycuL3dlaWdodGZpbGUwJzogbmV3IEZsb2F0MzJBcnJheShbMSwgMiwgM10pfSk7XG5cbiAgICBjb25zdCBtYW5pZmVzdDogV2VpZ2h0c01hbmlmZXN0Q29uZmlnID0gW3tcbiAgICAgICdwYXRocyc6IFsnd2VpZ2h0ZmlsZTAnXSxcbiAgICAgICd3ZWlnaHRzJzogW3snbmFtZSc6ICd3ZWlnaHQwJywgJ2R0eXBlJzogJ2Zsb2F0MzInLCAnc2hhcGUnOiBbM119XVxuICAgIH1dO1xuXG4gICAgY29uc3Qgd2VpZ2h0c05hbWVzVG9GZXRjaCA9IFsnd2VpZ2h0MCddO1xuICAgIGNvbnN0IHdlaWdodHMgPVxuICAgICAgICBhd2FpdCB0Zi5pby5sb2FkV2VpZ2h0cyhtYW5pZmVzdCwgJy4vJywgd2VpZ2h0c05hbWVzVG9GZXRjaCk7XG4gICAgZXhwZWN0KCh0Zi5lbnYoKS5wbGF0Zm9ybS5mZXRjaCBhcyBqYXNtaW5lLlNweSkuY2FsbHMuY291bnQoKSkudG9CZSgxKTtcblxuICAgIGNvbnN0IHdlaWdodE5hbWVzID0gT2JqZWN0LmtleXMod2VpZ2h0cyk7XG4gICAgZXhwZWN0KHdlaWdodE5hbWVzLmxlbmd0aCkudG9FcXVhbCh3ZWlnaHRzTmFtZXNUb0ZldGNoLmxlbmd0aCk7XG5cbiAgICBjb25zdCB3ZWlnaHQwID0gd2VpZ2h0c1snd2VpZ2h0MCddO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHdlaWdodDAuZGF0YSgpLCBbMSwgMiwgM10pO1xuICAgIGV4cGVjdCh3ZWlnaHQwLnNoYXBlKS50b0VxdWFsKFszXSk7XG4gICAgZXhwZWN0KHdlaWdodDAuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcbiAgfSk7XG5cbiAgaXQoJzEgZ3JvdXAsIDIgd2VpZ2h0cywgZmV0Y2ggMXN0IHdlaWdodCcsIGFzeW5jICgpID0+IHtcbiAgICBzZXR1cEZha2VXZWlnaHRGaWxlcyh7Jy4vd2VpZ2h0ZmlsZTAnOiBuZXcgRmxvYXQzMkFycmF5KFsxLCAyLCAzLCA0LCA1XSl9KTtcblxuICAgIGNvbnN0IG1hbmlmZXN0OiBXZWlnaHRzTWFuaWZlc3RDb25maWcgPSBbe1xuICAgICAgJ3BhdGhzJzogWyd3ZWlnaHRmaWxlMCddLFxuICAgICAgJ3dlaWdodHMnOiBbXG4gICAgICAgIHsnbmFtZSc6ICd3ZWlnaHQwJywgJ2R0eXBlJzogJ2Zsb2F0MzInLCAnc2hhcGUnOiBbMl19LFxuICAgICAgICB7J25hbWUnOiAnd2VpZ2h0MScsICdkdHlwZSc6ICdmbG9hdDMyJywgJ3NoYXBlJzogWzNdfVxuICAgICAgXVxuICAgIH1dO1xuXG4gICAgLy8gTG9hZCB0aGUgZmlyc3Qgd2VpZ2h0LlxuICAgIGNvbnN0IHdlaWdodHMgPSBhd2FpdCB0Zi5pby5sb2FkV2VpZ2h0cyhtYW5pZmVzdCwgJy4vJywgWyd3ZWlnaHQwJ10pO1xuICAgIGV4cGVjdCgodGYuZW52KCkucGxhdGZvcm0uZmV0Y2ggYXMgamFzbWluZS5TcHkpLmNhbGxzLmNvdW50KCkpLnRvQmUoMSk7XG5cbiAgICBjb25zdCB3ZWlnaHROYW1lcyA9IE9iamVjdC5rZXlzKHdlaWdodHMpO1xuICAgIGV4cGVjdCh3ZWlnaHROYW1lcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG5cbiAgICBjb25zdCB3ZWlnaHQwID0gd2VpZ2h0c1snd2VpZ2h0MCddO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHdlaWdodDAuZGF0YSgpLCBbMSwgMl0pO1xuICAgIGV4cGVjdCh3ZWlnaHQwLnNoYXBlKS50b0VxdWFsKFsyXSk7XG4gICAgZXhwZWN0KHdlaWdodDAuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcbiAgfSk7XG5cbiAgaXQoJzEgZ3JvdXAsIDIgd2VpZ2h0cywgZmV0Y2ggMm5kIHdlaWdodCcsIGFzeW5jICgpID0+IHtcbiAgICBzZXR1cEZha2VXZWlnaHRGaWxlcyh7Jy4vd2VpZ2h0ZmlsZTAnOiBuZXcgRmxvYXQzMkFycmF5KFsxLCAyLCAzLCA0LCA1XSl9KTtcblxuICAgIGNvbnN0IG1hbmlmZXN0OiBXZWlnaHRzTWFuaWZlc3RDb25maWcgPSBbe1xuICAgICAgJ3BhdGhzJzogWyd3ZWlnaHRmaWxlMCddLFxuICAgICAgJ3dlaWdodHMnOiBbXG4gICAgICAgIHsnbmFtZSc6ICd3ZWlnaHQwJywgJ2R0eXBlJzogJ2Zsb2F0MzInLCAnc2hhcGUnOiBbMl19LFxuICAgICAgICB7J25hbWUnOiAnd2VpZ2h0MScsICdkdHlwZSc6ICdmbG9hdDMyJywgJ3NoYXBlJzogWzNdfVxuICAgICAgXVxuICAgIH1dO1xuXG4gICAgLy8gTG9hZCB0aGUgc2Vjb25kIHdlaWdodC5cbiAgICBjb25zdCB3ZWlnaHRzID0gYXdhaXQgdGYuaW8ubG9hZFdlaWdodHMobWFuaWZlc3QsICcuLycsIFsnd2VpZ2h0MSddKTtcbiAgICBleHBlY3QoKHRmLmVudigpLnBsYXRmb3JtLmZldGNoIGFzIGphc21pbmUuU3B5KS5jYWxscy5jb3VudCgpKS50b0JlKDEpO1xuXG4gICAgY29uc3Qgd2VpZ2h0TmFtZXMgPSBPYmplY3Qua2V5cyh3ZWlnaHRzKTtcbiAgICBleHBlY3Qod2VpZ2h0TmFtZXMubGVuZ3RoKS50b0VxdWFsKDEpO1xuXG4gICAgY29uc3Qgd2VpZ2h0MSA9IHdlaWdodHNbJ3dlaWdodDEnXTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCB3ZWlnaHQxLmRhdGEoKSwgWzMsIDQsIDVdKTtcbiAgICBleHBlY3Qod2VpZ2h0MS5zaGFwZSkudG9FcXVhbChbM10pO1xuICAgIGV4cGVjdCh3ZWlnaHQxLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gIH0pO1xuXG4gIGl0KCcxIGdyb3VwLCAyIHdlaWdodHMsIGZldGNoIGFsbCB3ZWlnaHRzJywgYXN5bmMgKCkgPT4ge1xuICAgIHNldHVwRmFrZVdlaWdodEZpbGVzKHsnLi93ZWlnaHRmaWxlMCc6IG5ldyBGbG9hdDMyQXJyYXkoWzEsIDIsIDMsIDQsIDVdKX0pO1xuXG4gICAgY29uc3QgbWFuaWZlc3Q6IFdlaWdodHNNYW5pZmVzdENvbmZpZyA9IFt7XG4gICAgICAncGF0aHMnOiBbJ3dlaWdodGZpbGUwJ10sXG4gICAgICAnd2VpZ2h0cyc6IFtcbiAgICAgICAgeyduYW1lJzogJ3dlaWdodDAnLCAnZHR5cGUnOiAnZmxvYXQzMicsICdzaGFwZSc6IFsyXX0sXG4gICAgICAgIHsnbmFtZSc6ICd3ZWlnaHQxJywgJ2R0eXBlJzogJ2Zsb2F0MzInLCAnc2hhcGUnOiBbM119XG4gICAgICBdXG4gICAgfV07XG5cbiAgICAvLyBMb2FkIGFsbCB3ZWlnaHRzLlxuICAgIGNvbnN0IHdlaWdodHMgPVxuICAgICAgICBhd2FpdCB0Zi5pby5sb2FkV2VpZ2h0cyhtYW5pZmVzdCwgJy4vJywgWyd3ZWlnaHQwJywgJ3dlaWdodDEnXSk7XG4gICAgZXhwZWN0KCh0Zi5lbnYoKS5wbGF0Zm9ybS5mZXRjaCBhcyBqYXNtaW5lLlNweSkuY2FsbHMuY291bnQoKSkudG9CZSgxKTtcblxuICAgIGNvbnN0IHdlaWdodE5hbWVzID0gT2JqZWN0LmtleXMod2VpZ2h0cyk7XG4gICAgZXhwZWN0KHdlaWdodE5hbWVzLmxlbmd0aCkudG9FcXVhbCgyKTtcblxuICAgIGNvbnN0IHdlaWdodDAgPSB3ZWlnaHRzWyd3ZWlnaHQwJ107XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgd2VpZ2h0MC5kYXRhKCksIFsxLCAyXSk7XG4gICAgZXhwZWN0KHdlaWdodDAuc2hhcGUpLnRvRXF1YWwoWzJdKTtcbiAgICBleHBlY3Qod2VpZ2h0MC5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuXG4gICAgY29uc3Qgd2VpZ2h0MSA9IHdlaWdodHNbJ3dlaWdodDEnXTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCB3ZWlnaHQxLmRhdGEoKSwgWzMsIDQsIDVdKTtcbiAgICBleHBlY3Qod2VpZ2h0MS5zaGFwZSkudG9FcXVhbChbM10pO1xuICAgIGV4cGVjdCh3ZWlnaHQxLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gIH0pO1xuXG4gIGl0KCcxIGdyb3VwLCBtdWx0aXBsZSB3ZWlnaHRzLCBkaWZmZXJlbnQgZHR5cGVzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig1ICogNCArIDEpO1xuICAgIGNvbnN0IHZpZXcgPSBuZXcgRGF0YVZpZXcoYnVmZmVyKTtcbiAgICB2aWV3LnNldEludDMyKDAsIDEsIHRydWUpO1xuICAgIHZpZXcuc2V0SW50MzIoNCwgMiwgdHJ1ZSk7XG4gICAgdmlldy5zZXRVaW50OCg4LCAxKTtcbiAgICB2aWV3LnNldEZsb2F0MzIoOSwgMy4sIHRydWUpO1xuICAgIHZpZXcuc2V0RmxvYXQzMigxMywgNC4sIHRydWUpO1xuICAgIHZpZXcuc2V0RmxvYXQzMigxNywgNS4sIHRydWUpO1xuICAgIHNldHVwRmFrZVdlaWdodEZpbGVzKHsnLi93ZWlnaHRmaWxlMCc6IGJ1ZmZlcn0pO1xuXG4gICAgY29uc3QgbWFuaWZlc3Q6IFdlaWdodHNNYW5pZmVzdENvbmZpZyA9IFt7XG4gICAgICAncGF0aHMnOiBbJ3dlaWdodGZpbGUwJ10sXG4gICAgICAnd2VpZ2h0cyc6IFtcbiAgICAgICAgeyduYW1lJzogJ3dlaWdodDAnLCAnZHR5cGUnOiAnaW50MzInLCAnc2hhcGUnOiBbMl19LFxuICAgICAgICB7J25hbWUnOiAnd2VpZ2h0MScsICdkdHlwZSc6ICdib29sJywgJ3NoYXBlJzogW119LFxuICAgICAgICB7J25hbWUnOiAnd2VpZ2h0MicsICdkdHlwZSc6ICdmbG9hdDMyJywgJ3NoYXBlJzogWzNdfSxcbiAgICAgIF1cbiAgICB9XTtcblxuICAgIC8vIExvYWQgYWxsIHdlaWdodHMuXG4gICAgY29uc3Qgd2VpZ2h0cyA9IGF3YWl0IHRmLmlvLmxvYWRXZWlnaHRzKFxuICAgICAgICBtYW5pZmVzdCwgJy4vJywgWyd3ZWlnaHQwJywgJ3dlaWdodDEnLCAnd2VpZ2h0MiddKTtcbiAgICBleHBlY3QoKHRmLmVudigpLnBsYXRmb3JtLmZldGNoIGFzIGphc21pbmUuU3B5KS5jYWxscy5jb3VudCgpKS50b0JlKDEpO1xuXG4gICAgY29uc3Qgd2VpZ2h0TmFtZXMgPSBPYmplY3Qua2V5cyh3ZWlnaHRzKTtcbiAgICBleHBlY3Qod2VpZ2h0TmFtZXMubGVuZ3RoKS50b0VxdWFsKDMpO1xuXG4gICAgY29uc3Qgd2VpZ2h0MCA9IHdlaWdodHNbJ3dlaWdodDAnXTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCB3ZWlnaHQwLmRhdGEoKSwgWzEsIDJdKTtcbiAgICBleHBlY3Qod2VpZ2h0MC5zaGFwZSkudG9FcXVhbChbMl0pO1xuICAgIGV4cGVjdCh3ZWlnaHQwLmR0eXBlKS50b0VxdWFsKCdpbnQzMicpO1xuXG4gICAgY29uc3Qgd2VpZ2h0MSA9IHdlaWdodHNbJ3dlaWdodDEnXTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCB3ZWlnaHQxLmRhdGEoKSwgWzFdKTtcbiAgICBleHBlY3Qod2VpZ2h0MS5zaGFwZSkudG9FcXVhbChbXSk7XG4gICAgZXhwZWN0KHdlaWdodDEuZHR5cGUpLnRvRXF1YWwoJ2Jvb2wnKTtcblxuICAgIGNvbnN0IHdlaWdodDIgPSB3ZWlnaHRzWyd3ZWlnaHQyJ107XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgd2VpZ2h0Mi5kYXRhKCksIFszLCA0LCA1XSk7XG4gICAgZXhwZWN0KHdlaWdodDIuc2hhcGUpLnRvRXF1YWwoWzNdKTtcbiAgICBleHBlY3Qod2VpZ2h0Mi5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICB9KTtcblxuICBpdCgnMSBncm91cCwgc2hhcmRlZCAxIHdlaWdodCBhY3Jvc3MgbXVsdGlwbGUgZmlsZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qgc2hhcmQwID0gbmV3IEZsb2F0MzJBcnJheShbMSwgMiwgMywgNCwgNV0pO1xuICAgIGNvbnN0IHNoYXJkMSA9IG5ldyBGbG9hdDMyQXJyYXkoWzEuMSwgMi4yXSk7XG4gICAgY29uc3Qgc2hhcmQyID0gbmV3IEZsb2F0MzJBcnJheShbMTAsIDIwLCAzMF0pO1xuXG4gICAgc2V0dXBGYWtlV2VpZ2h0RmlsZXMoe1xuICAgICAgJy4vd2VpZ2h0ZmlsZTAnOiBzaGFyZDAsXG4gICAgICAnLi93ZWlnaHRzZmlsZTEnOiBzaGFyZDEsXG4gICAgICAnLi93ZWlnaHRzZmlsZTInOiBzaGFyZDJcbiAgICB9KTtcblxuICAgIGNvbnN0IG1hbmlmZXN0OiBXZWlnaHRzTWFuaWZlc3RDb25maWcgPSBbe1xuICAgICAgJ3BhdGhzJzogWyd3ZWlnaHRmaWxlMCcsICd3ZWlnaHRzZmlsZTEnLCAnd2VpZ2h0c2ZpbGUyJ10sXG4gICAgICAnd2VpZ2h0cyc6IFt7J25hbWUnOiAnd2VpZ2h0MCcsICdkdHlwZSc6ICdmbG9hdDMyJywgJ3NoYXBlJzogWzUsIDJdfV1cbiAgICB9XTtcblxuICAgIGNvbnN0IHdlaWdodHMgPSBhd2FpdCB0Zi5pby5sb2FkV2VpZ2h0cyhtYW5pZmVzdCwgJy4vJywgWyd3ZWlnaHQwJ10pO1xuICAgIGV4cGVjdCgodGYuZW52KCkucGxhdGZvcm0uZmV0Y2ggYXMgamFzbWluZS5TcHkpLmNhbGxzLmNvdW50KCkpLnRvQmUoMyk7XG5cbiAgICBjb25zdCB3ZWlnaHROYW1lcyA9IE9iamVjdC5rZXlzKHdlaWdodHMpO1xuICAgIGV4cGVjdCh3ZWlnaHROYW1lcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG5cbiAgICBjb25zdCB3ZWlnaHQwID0gd2VpZ2h0c1snd2VpZ2h0MCddO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKFxuICAgICAgICBhd2FpdCB3ZWlnaHQwLmRhdGEoKSwgWzEsIDIsIDMsIDQsIDUsIDEuMSwgMi4yLCAxMCwgMjAsIDMwXSk7XG4gICAgZXhwZWN0KHdlaWdodDAuc2hhcGUpLnRvRXF1YWwoWzUsIDJdKTtcbiAgICBleHBlY3Qod2VpZ2h0MC5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICB9KTtcblxuICBpdCgnMSBncm91cCwgc2hhcmRlZCAyIHdlaWdodHMgYWNyb3NzIG11bHRpcGxlIGZpbGVzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHNoYXJkMCA9IG5ldyBJbnQzMkFycmF5KFsxLCAyLCAzLCA0LCA1XSk7XG5cbiAgICAvLyBzaGFyZDEgY29udGFpbnMgcGFydCBvZiB0aGUgZmlyc3Qgd2VpZ2h0IGFuZCBwYXJ0IG9mIHRoZSBzZWNvbmQuXG4gICAgY29uc3Qgc2hhcmQxID0gbmV3IEFycmF5QnVmZmVyKDUgKiA0KTtcbiAgICBjb25zdCBpbnRCdWZmZXIgPSBuZXcgSW50MzJBcnJheShzaGFyZDEsIDAsIDIpO1xuICAgIGludEJ1ZmZlci5zZXQoWzEwLCAyMF0pO1xuICAgIGNvbnN0IGZsb2F0QnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheShzaGFyZDEsIGludEJ1ZmZlci5ieXRlTGVuZ3RoLCAzKTtcbiAgICBmbG9hdEJ1ZmZlci5zZXQoWzMuMCwgNC4wLCA1LjBdKTtcblxuICAgIGNvbnN0IHNoYXJkMiA9IG5ldyBGbG9hdDMyQXJyYXkoWzEwLCAyMCwgMzBdKTtcblxuICAgIHNldHVwRmFrZVdlaWdodEZpbGVzKHtcbiAgICAgICcuL3dlaWdodGZpbGUwJzogc2hhcmQwLFxuICAgICAgJy4vd2VpZ2h0c2ZpbGUxJzogc2hhcmQxLFxuICAgICAgJy4vd2VpZ2h0c2ZpbGUyJzogc2hhcmQyXG4gICAgfSk7XG5cbiAgICBjb25zdCBtYW5pZmVzdDogV2VpZ2h0c01hbmlmZXN0Q29uZmlnID0gW3tcbiAgICAgICdwYXRocyc6IFsnd2VpZ2h0ZmlsZTAnLCAnd2VpZ2h0c2ZpbGUxJywgJ3dlaWdodHNmaWxlMiddLFxuICAgICAgJ3dlaWdodHMnOiBbXG4gICAgICAgIHsnbmFtZSc6ICd3ZWlnaHQwJywgJ2R0eXBlJzogJ2ludDMyJywgJ3NoYXBlJzogWzcsIDFdfSxcbiAgICAgICAgeyduYW1lJzogJ3dlaWdodDEnLCAnZHR5cGUnOiAnZmxvYXQzMicsICdzaGFwZSc6IFszLCAyXX1cbiAgICAgIF1cbiAgICB9XTtcblxuICAgIGNvbnN0IHdlaWdodHMgPVxuICAgICAgICBhd2FpdCB0Zi5pby5sb2FkV2VpZ2h0cyhtYW5pZmVzdCwgJy4vJywgWyd3ZWlnaHQwJywgJ3dlaWdodDEnXSk7XG4gICAgZXhwZWN0KCh0Zi5lbnYoKS5wbGF0Zm9ybS5mZXRjaCBhcyBqYXNtaW5lLlNweSkuY2FsbHMuY291bnQoKSkudG9CZSgzKTtcblxuICAgIGNvbnN0IHdlaWdodE5hbWVzID0gT2JqZWN0LmtleXMod2VpZ2h0cyk7XG4gICAgZXhwZWN0KHdlaWdodE5hbWVzLmxlbmd0aCkudG9FcXVhbCgyKTtcblxuICAgIGNvbnN0IHdlaWdodDAgPSB3ZWlnaHRzWyd3ZWlnaHQwJ107XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgd2VpZ2h0MC5kYXRhKCksIFsxLCAyLCAzLCA0LCA1LCAxMCwgMjBdKTtcbiAgICBleHBlY3Qod2VpZ2h0MC5zaGFwZSkudG9FcXVhbChbNywgMV0pO1xuICAgIGV4cGVjdCh3ZWlnaHQwLmR0eXBlKS50b0VxdWFsKCdpbnQzMicpO1xuXG4gICAgY29uc3Qgd2VpZ2h0MSA9IHdlaWdodHNbJ3dlaWdodDEnXTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCB3ZWlnaHQxLmRhdGEoKSwgWzMuMCwgNC4wLCA1LjAsIDEwLCAyMCwgMzBdKTtcbiAgICBleHBlY3Qod2VpZ2h0MS5zaGFwZSkudG9FcXVhbChbMywgMl0pO1xuICAgIGV4cGVjdCh3ZWlnaHQxLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gIH0pO1xuXG4gIGl0KCcyIGdyb3VwLCA0IHdlaWdodHMsIGZldGNoZXMgb25lIGdyb3VwJywgYXN5bmMgKCkgPT4ge1xuICAgIHNldHVwRmFrZVdlaWdodEZpbGVzKHtcbiAgICAgICcuL3dlaWdodGZpbGUwJzogbmV3IEZsb2F0MzJBcnJheShbMSwgMiwgMywgNCwgNV0pLFxuICAgICAgJy4vd2VpZ2h0ZmlsZTEnOiBuZXcgRmxvYXQzMkFycmF5KFs2LCA3LCA4LCA5XSlcbiAgICB9KTtcblxuICAgIGNvbnN0IG1hbmlmZXN0OiBXZWlnaHRzTWFuaWZlc3RDb25maWcgPSBbXG4gICAgICB7XG4gICAgICAgICdwYXRocyc6IFsnd2VpZ2h0ZmlsZTAnXSxcbiAgICAgICAgJ3dlaWdodHMnOiBbXG4gICAgICAgICAgeyduYW1lJzogJ3dlaWdodDAnLCAnZHR5cGUnOiAnZmxvYXQzMicsICdzaGFwZSc6IFsyXX0sXG4gICAgICAgICAgeyduYW1lJzogJ3dlaWdodDEnLCAnZHR5cGUnOiAnZmxvYXQzMicsICdzaGFwZSc6IFszXX1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3BhdGhzJzogWyd3ZWlnaHRmaWxlMSddLFxuICAgICAgICAnd2VpZ2h0cyc6IFtcbiAgICAgICAgICB7J25hbWUnOiAnd2VpZ2h0MicsICdkdHlwZSc6ICdmbG9hdDMyJywgJ3NoYXBlJzogWzMsIDFdfSxcbiAgICAgICAgICB7J25hbWUnOiAnd2VpZ2h0MycsICdkdHlwZSc6ICdmbG9hdDMyJywgJ3NoYXBlJzogW119XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdO1xuXG4gICAgY29uc3Qgd2VpZ2h0cyA9XG4gICAgICAgIGF3YWl0IHRmLmlvLmxvYWRXZWlnaHRzKG1hbmlmZXN0LCAnLi8nLCBbJ3dlaWdodDAnLCAnd2VpZ2h0MSddKTtcbiAgICAvLyBPbmx5IHRoZSBmaXJzdCBncm91cCBzaG91bGQgYmUgZmV0Y2hlZC5cbiAgICBleHBlY3QoKHRmLmVudigpLnBsYXRmb3JtLmZldGNoIGFzIGphc21pbmUuU3B5KS5jYWxscy5jb3VudCgpKS50b0JlKDEpO1xuXG4gICAgY29uc3Qgd2VpZ2h0TmFtZXMgPSBPYmplY3Qua2V5cyh3ZWlnaHRzKTtcbiAgICBleHBlY3Qod2VpZ2h0TmFtZXMubGVuZ3RoKS50b0VxdWFsKDIpO1xuXG4gICAgY29uc3Qgd2VpZ2h0MCA9IHdlaWdodHNbJ3dlaWdodDAnXTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCB3ZWlnaHQwLmRhdGEoKSwgWzEsIDJdKTtcbiAgICBleHBlY3Qod2VpZ2h0MC5zaGFwZSkudG9FcXVhbChbMl0pO1xuICAgIGV4cGVjdCh3ZWlnaHQwLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG5cbiAgICBjb25zdCB3ZWlnaHQxID0gd2VpZ2h0c1snd2VpZ2h0MSddO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHdlaWdodDEuZGF0YSgpLCBbMywgNCwgNV0pO1xuICAgIGV4cGVjdCh3ZWlnaHQxLnNoYXBlKS50b0VxdWFsKFszXSk7XG4gICAgZXhwZWN0KHdlaWdodDEuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcbiAgfSk7XG5cbiAgaXQoJzIgZ3JvdXAsIDQgd2VpZ2h0cywgb25lIHdlaWdodCBmcm9tIGVhY2ggZ3JvdXAnLCBhc3luYyAoKSA9PiB7XG4gICAgc2V0dXBGYWtlV2VpZ2h0RmlsZXMoe1xuICAgICAgJy4vd2VpZ2h0ZmlsZTAnOiBuZXcgRmxvYXQzMkFycmF5KFsxLCAyLCAzLCA0LCA1XSksXG4gICAgICAnLi93ZWlnaHRmaWxlMSc6IG5ldyBGbG9hdDMyQXJyYXkoWzYsIDcsIDgsIDldKVxuICAgIH0pO1xuXG4gICAgY29uc3QgbWFuaWZlc3Q6IFdlaWdodHNNYW5pZmVzdENvbmZpZyA9IFtcbiAgICAgIHtcbiAgICAgICAgJ3BhdGhzJzogWyd3ZWlnaHRmaWxlMCddLFxuICAgICAgICAnd2VpZ2h0cyc6IFtcbiAgICAgICAgICB7J25hbWUnOiAnd2VpZ2h0MCcsICdkdHlwZSc6ICdmbG9hdDMyJywgJ3NoYXBlJzogWzJdfSxcbiAgICAgICAgICB7J25hbWUnOiAnd2VpZ2h0MScsICdkdHlwZSc6ICdmbG9hdDMyJywgJ3NoYXBlJzogWzNdfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAncGF0aHMnOiBbJ3dlaWdodGZpbGUxJ10sXG4gICAgICAgICd3ZWlnaHRzJzogW1xuICAgICAgICAgIHsnbmFtZSc6ICd3ZWlnaHQyJywgJ2R0eXBlJzogJ2Zsb2F0MzInLCAnc2hhcGUnOiBbMywgMV19LFxuICAgICAgICAgIHsnbmFtZSc6ICd3ZWlnaHQzJywgJ2R0eXBlJzogJ2Zsb2F0MzInLCAnc2hhcGUnOiBbXX1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF07XG5cbiAgICBjb25zdCB3ZWlnaHRzID1cbiAgICAgICAgYXdhaXQgdGYuaW8ubG9hZFdlaWdodHMobWFuaWZlc3QsICcuLycsIFsnd2VpZ2h0MCcsICd3ZWlnaHQyJ10pO1xuICAgIC8vIEJvdGggZ3JvdXBzIG5lZWQgdG8gYmUgZmV0Y2hlZC5cbiAgICBleHBlY3QoKHRmLmVudigpLnBsYXRmb3JtLmZldGNoIGFzIGphc21pbmUuU3B5KS5jYWxscy5jb3VudCgpKS50b0JlKDIpO1xuXG4gICAgY29uc3Qgd2VpZ2h0TmFtZXMgPSBPYmplY3Qua2V5cyh3ZWlnaHRzKTtcbiAgICBleHBlY3Qod2VpZ2h0TmFtZXMubGVuZ3RoKS50b0VxdWFsKDIpO1xuXG4gICAgY29uc3Qgd2VpZ2h0MCA9IHdlaWdodHNbJ3dlaWdodDAnXTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCB3ZWlnaHQwLmRhdGEoKSwgWzEsIDJdKTtcbiAgICBleHBlY3Qod2VpZ2h0MC5zaGFwZSkudG9FcXVhbChbMl0pO1xuICAgIGV4cGVjdCh3ZWlnaHQwLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG5cbiAgICBjb25zdCB3ZWlnaHQyID0gd2VpZ2h0c1snd2VpZ2h0MiddO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHdlaWdodDIuZGF0YSgpLCBbNiwgNywgOF0pO1xuICAgIGV4cGVjdCh3ZWlnaHQyLnNoYXBlKS50b0VxdWFsKFszLCAxXSk7XG4gICAgZXhwZWN0KHdlaWdodDIuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcbiAgfSk7XG5cbiAgaXQoJzIgZ3JvdXAsIDQgd2VpZ2h0cywgZG9udCBzcGVjaWZ5IHdlaWdodHMgZmV0Y2hzIGFsbCcsIGFzeW5jICgpID0+IHtcbiAgICBzZXR1cEZha2VXZWlnaHRGaWxlcyh7XG4gICAgICAnLi93ZWlnaHRmaWxlMCc6IG5ldyBGbG9hdDMyQXJyYXkoWzEsIDIsIDMsIDQsIDVdKSxcbiAgICAgICcuL3dlaWdodGZpbGUxJzogbmV3IEZsb2F0MzJBcnJheShbNiwgNywgOCwgOV0pXG4gICAgfSk7XG5cbiAgICBjb25zdCBtYW5pZmVzdDogV2VpZ2h0c01hbmlmZXN0Q29uZmlnID0gW1xuICAgICAge1xuICAgICAgICAncGF0aHMnOiBbJ3dlaWdodGZpbGUwJ10sXG4gICAgICAgICd3ZWlnaHRzJzogW1xuICAgICAgICAgIHsnbmFtZSc6ICd3ZWlnaHQwJywgJ2R0eXBlJzogJ2Zsb2F0MzInLCAnc2hhcGUnOiBbMl19LFxuICAgICAgICAgIHsnbmFtZSc6ICd3ZWlnaHQxJywgJ2R0eXBlJzogJ2Zsb2F0MzInLCAnc2hhcGUnOiBbM119XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdwYXRocyc6IFsnd2VpZ2h0ZmlsZTEnXSxcbiAgICAgICAgJ3dlaWdodHMnOiBbXG4gICAgICAgICAgeyduYW1lJzogJ3dlaWdodDInLCAnZHR5cGUnOiAnZmxvYXQzMicsICdzaGFwZSc6IFszLCAxXX0sXG4gICAgICAgICAgeyduYW1lJzogJ3dlaWdodDMnLCAnZHR5cGUnOiAnZmxvYXQzMicsICdzaGFwZSc6IFtdfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXTtcblxuICAgIC8vIERvbid0IHBhc3MgYSB0aGlyZCBhcmd1bWVudCB0byBsb2FkV2VpZ2h0cyB0byBsb2FkIGFsbCB3ZWlnaHRzLlxuICAgIGNvbnN0IHdlaWdodHMgPSBhd2FpdCB0Zi5pby5sb2FkV2VpZ2h0cyhtYW5pZmVzdCwgJy4vJyk7XG4gICAgLy8gQm90aCBncm91cHMgbmVlZCB0byBiZSBmZXRjaGVkLlxuICAgIGV4cGVjdCgodGYuZW52KCkucGxhdGZvcm0uZmV0Y2ggYXMgamFzbWluZS5TcHkpLmNhbGxzLmNvdW50KCkpLnRvQmUoMik7XG5cbiAgICBjb25zdCB3ZWlnaHROYW1lcyA9IE9iamVjdC5rZXlzKHdlaWdodHMpO1xuICAgIGV4cGVjdCh3ZWlnaHROYW1lcy5sZW5ndGgpLnRvRXF1YWwoNCk7XG5cbiAgICBjb25zdCB3ZWlnaHQwID0gd2VpZ2h0c1snd2VpZ2h0MCddO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHdlaWdodDAuZGF0YSgpLCBbMSwgMl0pO1xuICAgIGV4cGVjdCh3ZWlnaHQwLnNoYXBlKS50b0VxdWFsKFsyXSk7XG4gICAgZXhwZWN0KHdlaWdodDAuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcblxuICAgIGNvbnN0IHdlaWdodDEgPSB3ZWlnaHRzWyd3ZWlnaHQxJ107XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgd2VpZ2h0MS5kYXRhKCksIFszLCA0LCA1XSk7XG4gICAgZXhwZWN0KHdlaWdodDEuc2hhcGUpLnRvRXF1YWwoWzNdKTtcbiAgICBleHBlY3Qod2VpZ2h0MS5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuXG4gICAgY29uc3Qgd2VpZ2h0MiA9IHdlaWdodHNbJ3dlaWdodDInXTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCB3ZWlnaHQyLmRhdGEoKSwgWzYsIDcsIDhdKTtcbiAgICBleHBlY3Qod2VpZ2h0Mi5zaGFwZSkudG9FcXVhbChbMywgMV0pO1xuICAgIGV4cGVjdCh3ZWlnaHQyLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG5cbiAgICBjb25zdCB3ZWlnaHQzID0gd2VpZ2h0c1snd2VpZ2h0MyddO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHdlaWdodDMuZGF0YSgpLCBbOV0pO1xuICAgIGV4cGVjdCh3ZWlnaHQzLnNoYXBlKS50b0VxdWFsKFtdKTtcbiAgICBleHBlY3Qod2VpZ2h0My5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICB9KTtcblxuICBpdCgndGhyb3dzIGlmIHJlcXVlc3RlZCB3ZWlnaHQgbm90IGZvdW5kJywgYXN5bmMgKCkgPT4ge1xuICAgIHNldHVwRmFrZVdlaWdodEZpbGVzKHsnLi93ZWlnaHRmaWxlMCc6IG5ldyBGbG9hdDMyQXJyYXkoWzEsIDIsIDNdKX0pO1xuXG4gICAgY29uc3QgbWFuaWZlc3Q6IFdlaWdodHNNYW5pZmVzdENvbmZpZyA9IFt7XG4gICAgICAncGF0aHMnOiBbJ3dlaWdodGZpbGUwJ10sXG4gICAgICAnd2VpZ2h0cyc6IFt7J25hbWUnOiAnd2VpZ2h0MCcsICdkdHlwZSc6ICdmbG9hdDMyJywgJ3NoYXBlJzogWzNdfV1cbiAgICB9XTtcblxuICAgIGNvbnN0IHdlaWdodHNOYW1lc1RvRmV0Y2ggPSBbJ2RvZXNudGV4aXN0J107XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRmLmlvLmxvYWRXZWlnaHRzKG1hbmlmZXN0LCAnLi8nLCB3ZWlnaHRzTmFtZXNUb0ZldGNoKTtcbiAgICAgIGZhaWwoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBleHBlY3QoZS5tZXNzYWdlKS50b0NvbnRhaW4oJ0NvdWxkIG5vdCBmaW5kIHdlaWdodHMnKTtcbiAgICB9XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3MgaWYgcmVxdWVzdGVkIHdlaWdodCBoYXMgdW5rbm93biBkdHlwZScsIGFzeW5jICgpID0+IHtcbiAgICBzZXR1cEZha2VXZWlnaHRGaWxlcyh7Jy4vd2VpZ2h0ZmlsZTAnOiBuZXcgRmxvYXQzMkFycmF5KFsxLCAyLCAzXSl9KTtcblxuICAgIGNvbnN0IG1hbmlmZXN0OiBXZWlnaHRzTWFuaWZlc3RDb25maWcgPSBbe1xuICAgICAgJ3BhdGhzJzogWyd3ZWlnaHRmaWxlMCddLFxuICAgICAgJ3dlaWdodHMnOiBbe1xuICAgICAgICAnbmFtZSc6ICd3ZWlnaHQwJyxcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgICAgICAnZHR5cGUnOiAnbnVsbCcgYXMgYW55LFxuICAgICAgICAnc2hhcGUnOiBbM11cbiAgICAgIH1dXG4gICAgfV07XG5cbiAgICBjb25zdCB3ZWlnaHRzTmFtZXNUb0ZldGNoID0gWyd3ZWlnaHQwJ107XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRmLmlvLmxvYWRXZWlnaHRzKG1hbmlmZXN0LCAnLi8nLCB3ZWlnaHRzTmFtZXNUb0ZldGNoKTtcbiAgICAgIGZhaWwoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBleHBlY3QoZS5tZXNzYWdlKS50b0NvbnRhaW4oJ1Vuc3VwcG9ydGVkIGR0eXBlJyk7XG4gICAgfVxuICB9KTtcblxuICBpdCgnc2hvdWxkIHVzZSByZXF1ZXN0IG9wdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICBzZXR1cEZha2VXZWlnaHRGaWxlcyh7Jy4vd2VpZ2h0ZmlsZTAnOiBuZXcgRmxvYXQzMkFycmF5KFsxLCAyLCAzXSl9KTtcblxuICAgIGNvbnN0IG1hbmlmZXN0OiBXZWlnaHRzTWFuaWZlc3RDb25maWcgPSBbe1xuICAgICAgJ3BhdGhzJzogWyd3ZWlnaHRmaWxlMCddLFxuICAgICAgJ3dlaWdodHMnOiBbeyduYW1lJzogJ3dlaWdodDAnLCAnZHR5cGUnOiAnZmxvYXQzMicsICdzaGFwZSc6IFszXX1dXG4gICAgfV07XG5cbiAgICBjb25zdCB3ZWlnaHRzTmFtZXNUb0ZldGNoID0gWyd3ZWlnaHQwJ107XG4gICAgYXdhaXQgdGYuaW8ubG9hZFdlaWdodHMoXG4gICAgICAgIG1hbmlmZXN0LCAnLi8nLCB3ZWlnaHRzTmFtZXNUb0ZldGNoLCB7Y3JlZGVudGlhbHM6ICdpbmNsdWRlJ30pO1xuICAgIGV4cGVjdCgodGYuZW52KCkucGxhdGZvcm0uZmV0Y2ggYXMgamFzbWluZS5TcHkpLmNhbGxzLmNvdW50KCkpLnRvQmUoMSk7XG4gICAgZXhwZWN0KHRmLmVudigpLnBsYXRmb3JtLmZldGNoKVxuICAgICAgICAudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgICAnLi93ZWlnaHRmaWxlMCcsIHtjcmVkZW50aWFsczogJ2luY2x1ZGUnfSwge2lzQmluYXJ5OiB0cnVlfSk7XG4gIH0pO1xuXG4gIGNvbnN0IHF1YW50aXphdGlvblRlc3QgPSBhc3luYyAocXVhbnRpemF0aW9uRHR5cGU6ICd1aW50OCd8J3VpbnQxNicpID0+IHtcbiAgICBjb25zdCBhcnJheVR5cGUgPSBxdWFudGl6YXRpb25EdHlwZSA9PT0gJ3VpbnQ4JyA/IFVpbnQ4QXJyYXkgOiBVaW50MTZBcnJheTtcbiAgICBzZXR1cEZha2VXZWlnaHRGaWxlcyhcbiAgICAgICAgeycuL3dlaWdodGZpbGUwJzogbmV3IGFycmF5VHlwZShbMCwgNDgsIDI1NSwgMCwgNDgsIDI1NV0pfSk7XG5cbiAgICBjb25zdCBtYW5pZmVzdDogV2VpZ2h0c01hbmlmZXN0Q29uZmlnID0gW3tcbiAgICAgICdwYXRocyc6IFsnd2VpZ2h0ZmlsZTAnXSxcbiAgICAgICd3ZWlnaHRzJzogW1xuICAgICAgICB7XG4gICAgICAgICAgJ25hbWUnOiAnd2VpZ2h0MCcsXG4gICAgICAgICAgJ2R0eXBlJzogJ2Zsb2F0MzInLFxuICAgICAgICAgICdzaGFwZSc6IFszXSxcbiAgICAgICAgICAncXVhbnRpemF0aW9uJzogeydtaW4nOiAtMSwgJ3NjYWxlJzogMC4xLCAnZHR5cGUnOiBxdWFudGl6YXRpb25EdHlwZX1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICduYW1lJzogJ3dlaWdodDEnLFxuICAgICAgICAgICdkdHlwZSc6ICdpbnQzMicsXG4gICAgICAgICAgJ3NoYXBlJzogWzNdLFxuICAgICAgICAgICdxdWFudGl6YXRpb24nOiB7J21pbic6IC0xLCAnc2NhbGUnOiAwLjEsICdkdHlwZSc6IHF1YW50aXphdGlvbkR0eXBlfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfV07XG5cbiAgICBjb25zdCB3ZWlnaHRzTmFtZXNUb0ZldGNoID0gWyd3ZWlnaHQwJywgJ3dlaWdodDEnXTtcbiAgICBjb25zdCB3ZWlnaHRzID1cbiAgICAgICAgYXdhaXQgdGYuaW8ubG9hZFdlaWdodHMobWFuaWZlc3QsICcuLycsIHdlaWdodHNOYW1lc1RvRmV0Y2gpO1xuICAgIGV4cGVjdCgodGYuZW52KCkucGxhdGZvcm0uZmV0Y2ggYXMgamFzbWluZS5TcHkpLmNhbGxzLmNvdW50KCkpLnRvQmUoMSk7XG5cbiAgICBjb25zdCB3ZWlnaHROYW1lcyA9IE9iamVjdC5rZXlzKHdlaWdodHMpO1xuICAgIGV4cGVjdCh3ZWlnaHROYW1lcy5sZW5ndGgpLnRvRXF1YWwod2VpZ2h0c05hbWVzVG9GZXRjaC5sZW5ndGgpO1xuXG4gICAgY29uc3Qgd2VpZ2h0MCA9IHdlaWdodHNbJ3dlaWdodDAnXTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCB3ZWlnaHQwLmRhdGEoKSwgWy0xLCAzLjgsIDI0LjVdKTtcbiAgICBleHBlY3Qod2VpZ2h0MC5zaGFwZSkudG9FcXVhbChbM10pO1xuICAgIGV4cGVjdCh3ZWlnaHQwLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG5cbiAgICBjb25zdCB3ZWlnaHQxID0gd2VpZ2h0c1snd2VpZ2h0MSddO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IHdlaWdodDEuZGF0YSgpLCBbLTEsIDQsIDI1XSk7XG4gICAgZXhwZWN0KHdlaWdodDEuc2hhcGUpLnRvRXF1YWwoWzNdKTtcbiAgICBleHBlY3Qod2VpZ2h0MS5kdHlwZSkudG9FcXVhbCgnaW50MzInKTtcbiAgfTtcblxuICBpdCgncXVhbnRpemVkIHdlaWdodHMgKHVpbnQ4KScsIGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBxdWFudGl6YXRpb25UZXN0KCd1aW50OCcpO1xuICB9KTtcblxuICBpdCgncXVhbnRpemVkIHdlaWdodHMgKHVpbnQxNiknLCBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgcXVhbnRpemF0aW9uVGVzdCgndWludDE2Jyk7XG4gIH0pO1xuXG4gIGl0KCcyIGdyb3VwcywgMSBxdWFudGl6ZWQsIDEgdW5xdWFudGl6ZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgc2V0dXBGYWtlV2VpZ2h0RmlsZXMoe1xuICAgICAgJy4vd2VpZ2h0ZmlsZTAnOiBuZXcgVWludDhBcnJheShbMCwgNDgsIDI1NSwgMCwgNDgsIDI1NV0pLFxuICAgICAgJy4vd2VpZ2h0ZmlsZTEnOiBuZXcgRmxvYXQzMkFycmF5KFs2LCA3LCA4LCA5XSlcbiAgICB9KTtcblxuICAgIGNvbnN0IG1hbmlmZXN0OiBXZWlnaHRzTWFuaWZlc3RDb25maWcgPSBbXG4gICAgICB7XG4gICAgICAgICdwYXRocyc6IFsnd2VpZ2h0ZmlsZTAnXSxcbiAgICAgICAgJ3dlaWdodHMnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ25hbWUnOiAnd2VpZ2h0MCcsXG4gICAgICAgICAgICAnZHR5cGUnOiAnZmxvYXQzMicsXG4gICAgICAgICAgICAnc2hhcGUnOiBbM10sXG4gICAgICAgICAgICAncXVhbnRpemF0aW9uJzogeydtaW4nOiAtMSwgJ3NjYWxlJzogMC4xLCAnZHR5cGUnOiAndWludDgnfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ25hbWUnOiAnd2VpZ2h0MScsXG4gICAgICAgICAgICAnZHR5cGUnOiAnaW50MzInLFxuICAgICAgICAgICAgJ3NoYXBlJzogWzNdLFxuICAgICAgICAgICAgJ3F1YW50aXphdGlvbic6IHsnbWluJzogLTEsICdzY2FsZSc6IDAuMSwgJ2R0eXBlJzogJ3VpbnQ4J31cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdwYXRocyc6IFsnd2VpZ2h0ZmlsZTEnXSxcbiAgICAgICAgJ3dlaWdodHMnOiBbXG4gICAgICAgICAgeyduYW1lJzogJ3dlaWdodDInLCAnZHR5cGUnOiAnZmxvYXQzMicsICdzaGFwZSc6IFszLCAxXX0sXG4gICAgICAgICAgeyduYW1lJzogJ3dlaWdodDMnLCAnZHR5cGUnOiAnZmxvYXQzMicsICdzaGFwZSc6IFtdfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXTtcblxuICAgIGNvbnN0IHdlaWdodHMgPVxuICAgICAgICBhd2FpdCB0Zi5pby5sb2FkV2VpZ2h0cyhtYW5pZmVzdCwgJy4vJywgWyd3ZWlnaHQwJywgJ3dlaWdodDInXSk7XG4gICAgLy8gQm90aCBncm91cHMgbmVlZCB0byBiZSBmZXRjaGVkLlxuICAgIGV4cGVjdCgodGYuZW52KCkucGxhdGZvcm0uZmV0Y2ggYXMgamFzbWluZS5TcHkpLmNhbGxzLmNvdW50KCkpLnRvQmUoMik7XG5cbiAgICBjb25zdCB3ZWlnaHROYW1lcyA9IE9iamVjdC5rZXlzKHdlaWdodHMpO1xuICAgIGV4cGVjdCh3ZWlnaHROYW1lcy5sZW5ndGgpLnRvRXF1YWwoMik7XG5cbiAgICBjb25zdCB3ZWlnaHQwID0gd2VpZ2h0c1snd2VpZ2h0MCddO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHdlaWdodDAuZGF0YSgpLCBbLTEsIDMuOCwgMjQuNV0pO1xuICAgIGV4cGVjdCh3ZWlnaHQwLnNoYXBlKS50b0VxdWFsKFszXSk7XG4gICAgZXhwZWN0KHdlaWdodDAuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcblxuICAgIGNvbnN0IHdlaWdodDIgPSB3ZWlnaHRzWyd3ZWlnaHQyJ107XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgd2VpZ2h0Mi5kYXRhKCksIFs2LCA3LCA4XSk7XG4gICAgZXhwZWN0KHdlaWdodDIuc2hhcGUpLnRvRXF1YWwoWzMsIDFdKTtcbiAgICBleHBlY3Qod2VpZ2h0Mi5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICB9KTtcbn0pO1xuIl19