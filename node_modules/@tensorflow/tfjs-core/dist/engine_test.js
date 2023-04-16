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
import { ENGINE } from './engine';
import * as tf from './index';
import { ALL_ENVS, describeWithFlags, TestKernelBackend } from './jasmine_util';
import { expectArraysClose } from './test_util';
describe('Backend registration', () => {
    beforeAll(() => {
        // Silences backend registration warnings.
        spyOn(console, 'warn');
    });
    let registeredBackends = [];
    let registerBackend;
    beforeEach(() => {
        // Registering a backend changes global state (engine), so we wrap
        // registration to automatically remove registered backend at the end
        // of each test.
        registerBackend = (name, factory, priority) => {
            registeredBackends.push(name);
            return tf.registerBackend(name, factory, priority);
        };
        ENGINE.reset();
    });
    afterEach(() => {
        // Remove all registered backends at the end of each test.
        registeredBackends.forEach(name => {
            if (tf.findBackendFactory(name) != null) {
                tf.removeBackend(name);
            }
        });
        registeredBackends = [];
    });
    it('removeBackend disposes the backend and removes the factory', () => {
        let backend;
        const factory = () => {
            const newBackend = new TestKernelBackend();
            if (backend == null) {
                backend = newBackend;
                spyOn(backend, 'dispose').and.callThrough();
            }
            return newBackend;
        };
        registerBackend('test-backend', factory);
        expect(tf.findBackend('test-backend') != null).toBe(true);
        expect(tf.findBackend('test-backend')).toBe(backend);
        expect(tf.findBackendFactory('test-backend')).toBe(factory);
        tf.removeBackend('test-backend');
        expect(tf.findBackend('test-backend') == null).toBe(true);
        expect(tf.findBackend('test-backend')).toBe(null);
        expect(backend.dispose.calls.count()).toBe(1);
        expect(tf.findBackendFactory('test-backend')).toBe(null);
    });
    it('findBackend initializes the backend', () => {
        let backend;
        const factory = () => {
            const newBackend = new TestKernelBackend();
            if (backend == null) {
                backend = newBackend;
            }
            return newBackend;
        };
        registerBackend('custom-cpu', factory);
        expect(tf.findBackend('custom-cpu') != null).toBe(true);
        expect(tf.findBackend('custom-cpu')).toBe(backend);
        expect(tf.findBackendFactory('custom-cpu')).toBe(factory);
    });
    it('custom backend registration', () => {
        let backend;
        const priority = 103;
        registerBackend('custom-cpu', () => {
            const newBackend = new TestKernelBackend();
            if (backend == null) {
                backend = newBackend;
            }
            return newBackend;
        }, priority);
        expect(tf.backend() != null).toBe(true);
        expect(tf.backend()).toBe(backend);
    });
    it('high priority backend registration fails, falls back', () => {
        let lowPriorityBackend;
        const lowPriority = 103;
        const highPriority = 104;
        registerBackend('custom-low-priority', () => {
            lowPriorityBackend = new TestKernelBackend();
            return lowPriorityBackend;
        }, lowPriority);
        registerBackend('custom-high-priority', () => {
            throw new Error(`High priority backend fails`);
        }, highPriority);
        expect(tf.backend() != null).toBe(true);
        expect(tf.backend()).toBe(lowPriorityBackend);
        expect(tf.getBackend()).toBe('custom-low-priority');
    });
    it('low priority and high priority backends, setBackend low priority', () => {
        let lowPriorityBackend;
        let highPriorityBackend;
        const lowPriority = 103;
        const highPriority = 104;
        registerBackend('custom-low-priority', () => {
            lowPriorityBackend = new TestKernelBackend();
            return lowPriorityBackend;
        }, lowPriority);
        registerBackend('custom-high-priority', () => {
            highPriorityBackend = new TestKernelBackend();
            return highPriorityBackend;
        }, highPriority);
        expect(tf.backend() != null).toBe(true);
        expect(tf.backend()).toBe(highPriorityBackend);
        expect(tf.getBackend()).toBe('custom-high-priority');
        tf.setBackend('custom-low-priority');
        expect(tf.backend() != null).toBe(true);
        expect(tf.backend()).toBe(lowPriorityBackend);
        expect(tf.getBackend()).toBe('custom-low-priority');
    });
    it('default custom background null', () => {
        expect(tf.findBackend('custom')).toBeNull();
    });
    it('allow custom backend', () => {
        const backend = new TestKernelBackend();
        const success = registerBackend('custom', () => backend);
        expect(success).toBeTruthy();
        expect(tf.findBackend('custom')).toEqual(backend);
    });
    it('sync backend with await ready works', async () => {
        const testBackend = new TestKernelBackend();
        registerBackend('sync', () => testBackend);
        tf.setBackend('sync');
        expect(tf.getBackend()).toEqual('sync');
        await tf.ready();
        expect(tf.backend()).toEqual(testBackend);
    });
    it('sync backend without await ready works', async () => {
        const testBackend = new TestKernelBackend();
        registerBackend('sync', () => testBackend);
        tf.setBackend('sync');
        expect(tf.getBackend()).toEqual('sync');
        expect(tf.backend()).toEqual(testBackend);
    });
    it('async backend with await ready works', async () => {
        const testBackend = new TestKernelBackend();
        registerBackend('async', async () => {
            await tf.nextFrame();
            return testBackend;
        });
        tf.setBackend('async');
        expect(tf.getBackend()).toEqual('async');
        await tf.ready();
        expect(tf.backend()).toEqual(testBackend);
    });
    it('async backend without await ready does not work', async () => {
        const testBackend = new TestKernelBackend();
        registerBackend('async', async () => {
            await tf.nextFrame();
            return testBackend;
        });
        tf.setBackend('async');
        expect(tf.getBackend()).toEqual('async');
        expect(() => tf.backend())
            .toThrowError(/Backend 'async' has not yet been initialized./);
    });
    it('tf.square() fails if user does not await ready on async backend', async () => {
        registerBackend('async', async () => {
            await tf.nextFrame();
            return new TestKernelBackend();
        });
        tf.setBackend('async');
        expect(() => tf.square(2))
            .toThrowError(/Backend 'async' has not yet been initialized/);
    });
    it('tf.square() works when user awaits ready on async backend', async () => {
        registerBackend('async', async () => {
            await tf.nextFrame();
            return new TestKernelBackend();
        });
        tf.setBackend('async');
        await tf.ready();
        expect(() => tf.square(2)).toThrowError(/'write' not yet implemented/);
    });
    it('Registering async2 (higher priority) fails, async1 becomes active', async () => {
        const testBackend = new TestKernelBackend();
        registerBackend('async1', async () => {
            await tf.nextFrame();
            return testBackend;
        }, 100 /* priority */);
        registerBackend('async2', async () => {
            await tf.nextFrame();
            throw new Error('failed to create async2');
        }, 101 /* priority */);
        // Await for the library to find the best backend that succesfully
        // initializes.
        await tf.ready();
        expect(tf.backend()).toEqual(testBackend);
        expect(tf.getBackend()).toBe('async1');
    });
    it('Registering sync as higher priority and async as lower priority', async () => {
        const testBackend = new TestKernelBackend();
        registerBackend('sync', () => testBackend, 101 /* priority */);
        registerBackend('async', async () => {
            await tf.nextFrame();
            return new TestKernelBackend();
        }, 100 /* priority */);
        // No need to await for ready() since the highest priority one is sync.
        expect(tf.backend()).toEqual(testBackend);
        expect(tf.getBackend()).toBe('sync');
    });
    it('async as higher priority and sync as lower priority with await ready', async () => {
        const testBackend = new TestKernelBackend();
        registerBackend('async', async () => {
            await tf.nextFrame();
            return testBackend;
        }, 101 /* priority */);
        registerBackend('sync', () => new TestKernelBackend(), 100 /* priority */);
        await tf.ready();
        expect(tf.backend()).toEqual(testBackend);
        expect(tf.getBackend()).toBe('async');
    });
    it('async as higher priority and sync as lower priority w/o await ready', async () => {
        const testBackend = new TestKernelBackend();
        registerBackend('async', async () => {
            await tf.nextFrame();
            return testBackend;
        }, 101 /* priority */);
        registerBackend('sync', () => new TestKernelBackend(), 100 /* priority */);
        expect(() => tf.backend())
            .toThrowError(/The highest priority backend 'async' has not yet been/);
    });
    it('Registering and setting a backend that fails to register', async () => {
        registerBackend('async', async () => {
            await tf.nextFrame();
            throw new Error('failed to create async');
        });
        const success = tf.setBackend('async');
        expect(tf.getBackend()).toBe('async');
        expect(() => tf.backend())
            .toThrowError(/Backend 'async' has not yet been initialized/);
        expect(await success).toBe(false);
    });
});
describeWithFlags('memory', ALL_ENVS, () => {
    it('Sum(float)', async () => {
        expect(tf.memory().numTensors).toBe(0);
        expect(tf.memory().numBytes).toBe(0);
        const sum = tf.tidy(() => {
            const a = tf.tensor1d([1, 2, 3, 4]);
            expect(tf.memory().numTensors).toBe(1);
            expect(tf.memory().numBytes).toBe(4 * 4);
            return a.sum();
        });
        expect(tf.memory().numTensors).toBe(1);
        expect(tf.memory().numBytes).toBe(4);
        expectArraysClose(await sum.data(), [1 + 2 + 3 + 4]);
    });
    it('Sum(bool)', async () => {
        const sum = tf.tidy(() => {
            const a = tf.tensor1d([true, true, false, true], 'bool');
            expect(tf.memory().numTensors).toBe(1);
            expect(tf.memory().numBytes).toBe(4);
            return a.sum();
        });
        expect(tf.memory().numTensors).toBe(1);
        expect(tf.memory().numBytes).toBe(4);
        expect(sum.dtype).toBe('int32');
        expectArraysClose(await sum.data(), [1 + 1 + 0 + 1]);
    });
    it('Sum(int32)', async () => {
        const sum = tf.tidy(() => {
            const a = tf.tensor1d([1, 1, 0, 1], 'int32');
            expect(tf.memory().numTensors).toBe(1);
            expect(tf.memory().numBytes).toBe(4 * 4);
            return a.sum();
        });
        expect(tf.memory().numTensors).toBe(1);
        expect(tf.memory().numBytes).toBe(4);
        expect(sum.dtype).toBe('int32');
        expectArraysClose(await sum.data(), [1 + 1 + 0 + 1]);
    });
    it('string tensor', () => {
        const a = tf.tensor([['a', 'bb'], ['c', 'd']]);
        expect(tf.memory().numTensors).toBe(1);
        expect(tf.memory().numBytes).toBe(5); // 5 letters, each 1 byte in utf8.
        a.dispose();
        expect(tf.memory().numTensors).toBe(0);
        expect(tf.memory().numBytes).toBe(0);
    });
    it('unreliable is true for string tensors', () => {
        tf.tensor('a');
        const mem = tf.memory();
        expect(mem.unreliable).toBe(true);
        const expectedReason = 'Memory usage by string tensors is approximate ' +
            '(2 bytes per character)';
        expect(mem.reasons.indexOf(expectedReason) >= 0).toBe(true);
    });
    it('makeTensorFromDataId creates a tensor', () => {
        const tensor = ENGINE.makeTensorFromDataId({}, [3], 'float32');
        expect(tensor).toBeDefined();
        expect(tensor.shape).toEqual([3]);
    });
});
describeWithFlags('profile', ALL_ENVS, () => {
    it('squaring', async () => {
        const profile = await tf.profile(() => {
            const x = tf.tensor1d([1, 2, 3]);
            let x2 = x.square();
            x2.dispose();
            x2 = x.square();
            x2.dispose();
            return x;
        });
        const result = profile.result;
        expect(profile.newBytes).toBe(12);
        expect(profile.peakBytes).toBe(24);
        expect(profile.newTensors).toBe(1);
        expectArraysClose(await result.data(), [1, 2, 3]);
        expect(profile.kernels.length).toBe(2);
        // Test the types for `kernelTimeMs` and `extraInfo` to confirm the promises
        // are resolved.
        expect(profile.kernels[0].kernelTimeMs instanceof Promise).toBe(false);
        expect(profile.kernels[0].extraInfo instanceof Promise).toBe(false);
        expect(profile.kernels[1].kernelTimeMs instanceof Promise).toBe(false);
        expect(profile.kernels[1].extraInfo instanceof Promise).toBe(false);
        // The specific values of `kernelTimeMs` and `extraInfo` are tested in the
        // tests of Profiler.profileKernel, so their values are not tested here.
        expect(profile.kernels[0]).toEqual({
            'name': 'Square',
            'bytesAdded': 12,
            'totalBytesSnapshot': 24,
            'tensorsAdded': 1,
            'totalTensorsSnapshot': 2,
            'inputShapes': [[3]],
            'outputShapes': [[3]],
            'kernelTimeMs': profile.kernels[0].kernelTimeMs,
            'extraInfo': profile.kernels[0].extraInfo
        });
        expect(profile.kernels[1]).toEqual({
            'name': 'Square',
            'bytesAdded': 12,
            'totalBytesSnapshot': 24,
            'tensorsAdded': 1,
            'totalTensorsSnapshot': 2,
            'inputShapes': [[3]],
            'outputShapes': [[3]],
            'kernelTimeMs': profile.kernels[1].kernelTimeMs,
            'extraInfo': profile.kernels[1].extraInfo
        });
    });
    it('squaring without disposing', async () => {
        const profile = await tf.profile(() => {
            const x = tf.tensor1d([1, 2, 3]);
            const x2 = x.square();
            return x2;
        });
        const result = profile.result;
        expect(profile.newBytes).toBe(24);
        expect(profile.peakBytes).toBe(24);
        expect(profile.newTensors).toBe(2);
        expectArraysClose(await result.data(), [1, 4, 9]);
        expect(profile.kernels.length).toBe(1);
        expect(profile.kernels[0].kernelTimeMs instanceof Promise).toBe(false);
        expect(profile.kernels[0].extraInfo instanceof Promise).toBe(false);
        expect(profile.kernels[0]).toEqual({
            'name': 'Square',
            'bytesAdded': 12,
            'totalBytesSnapshot': 24,
            'tensorsAdded': 1,
            'totalTensorsSnapshot': 2,
            'inputShapes': [[3]],
            'outputShapes': [[3]],
            'kernelTimeMs': profile.kernels[0].kernelTimeMs,
            'extraInfo': profile.kernels[0].extraInfo
        });
    });
    it('squaring in async query', async () => {
        const profile = await tf.profile(async () => {
            await new Promise(resolve => setTimeout(resolve, 1));
            const x = tf.tensor1d([1, 2, 3]);
            const x2 = x.square();
            x2.dispose();
            return x;
        });
        const result = profile.result;
        expect(profile.newBytes).toBe(12);
        expect(profile.peakBytes).toBe(24);
        expect(profile.newTensors).toBe(1);
        expectArraysClose(await result.data(), [1, 2, 3]);
        expect(profile.kernels.length).toBe(1);
        expect(profile.kernels[0].kernelTimeMs instanceof Promise).toBe(false);
        expect(profile.kernels[0].extraInfo instanceof Promise).toBe(false);
        expect(profile.kernels[0]).toEqual({
            'name': 'Square',
            'bytesAdded': 12,
            'totalBytesSnapshot': 24,
            'tensorsAdded': 1,
            'totalTensorsSnapshot': 2,
            'inputShapes': [[3]],
            'outputShapes': [[3]],
            'kernelTimeMs': profile.kernels[0].kernelTimeMs,
            'extraInfo': profile.kernels[0].extraInfo
        });
    });
    it('reports correct kernelNames', async () => {
        const profile = await tf.profile(() => {
            const x = tf.tensor1d([1, 2, 3]);
            const x2 = x.square();
            const x3 = x2.abs();
            return x3;
        });
        expect(profile.kernelNames).toEqual(jasmine.arrayWithExactContents([
            'Square', 'Abs'
        ]));
    });
});
describeWithFlags('disposeVariables', ALL_ENVS, () => {
    it('reuse same name variable', () => {
        tf.tensor1d([1, 2, 3]).variable(true, 'v1');
        tf.tensor1d([1, 2, 3]).variable(true, 'v2');
        expect(() => {
            tf.tensor1d([1, 2, 3]).variable(true, 'v1');
        }).toThrowError();
        tf.disposeVariables();
        tf.tensor1d([1, 2, 3]).variable(true, 'v1');
        tf.tensor1d([1, 2, 3]).variable(true, 'v2');
    });
});
/**
 * The following test constraints to the CPU environment because it needs a
 * concrete backend to exist. This test will work for any backend, but currently
 * this is the simplest backend to test against.
 */
describeWithFlags('Switching cpu backends', { predicate: testEnv => testEnv.backendName === 'cpu' }, () => {
    beforeEach(() => {
        tf.registerBackend('cpu1', tf.findBackendFactory('cpu'));
        tf.registerBackend('cpu2', tf.findBackendFactory('cpu'));
    });
    afterEach(() => {
        tf.removeBackend('cpu1');
        tf.removeBackend('cpu2');
    });
    it('Move data from cpu1 to cpu2 backend', async () => {
        tf.setBackend('cpu1');
        // This scalar lives in cpu1.
        const a = tf.scalar(5);
        tf.setBackend('cpu2');
        // This scalar lives in cpu2.
        const b = tf.scalar(3);
        expect(tf.memory().numDataBuffers).toBe(2);
        expect(tf.memory().numTensors).toBe(2);
        expect(tf.memory().numBytes).toBe(8);
        // Make sure you can read both tensors.
        expectArraysClose(await a.data(), [5]);
        expectArraysClose(await b.data(), [3]);
        // Switch back to cpu1.
        tf.setBackend('cpu1');
        // Again make sure you can read both tensors.
        expectArraysClose(await a.data(), [5]);
        expectArraysClose(await b.data(), [3]);
        tf.dispose([a, b]);
        expect(tf.memory().numDataBuffers).toBe(0);
        expect(tf.memory().numTensors).toBe(0);
        expect(tf.memory().numBytes).toBe(0);
    });
    it('can execute op with data from mixed backends', async () => {
        const kernelFunc = tf.getKernel('Add', 'cpu').kernelFunc;
        tf.registerKernel({ kernelName: 'Add', backendName: 'cpu1', kernelFunc });
        tf.registerKernel({ kernelName: 'Add', backendName: 'cpu2', kernelFunc });
        tf.setBackend('cpu1');
        // This scalar lives in cpu1.
        const a = tf.scalar(5);
        tf.setBackend('cpu2');
        // This scalar lives in cpu2.
        const b = tf.scalar(3);
        // Verify that ops can execute with mixed backend data.
        ENGINE.startScope();
        tf.setBackend('cpu1');
        expectArraysClose(await tf.add(a, b).data(), [8]);
        tf.setBackend('cpu2');
        expectArraysClose(await tf.add(a, b).data(), [8]);
        ENGINE.endScope();
        tf.dispose([a, b]);
    });
});
describeWithFlags('Detects memory leaks in kernels', ALL_ENVS, () => {
    const backendName = 'test-mem';
    const kernelName = 'MyKernel';
    const kernelNameComplex = 'Kernel-complex';
    it('Detects memory leak in a kernel', () => {
        let dataIdsCount = 0;
        tf.registerBackend(backendName, () => {
            return {
                id: 1,
                dispose: () => null,
                disposeData: (dataId) => null,
                numDataIds: () => dataIdsCount
            };
        });
        const kernelWithMemLeak = () => {
            dataIdsCount += 2;
            return { dataId: {}, shape: [], dtype: 'float32' };
        };
        tf.registerKernel({ kernelName, backendName, kernelFunc: kernelWithMemLeak });
        tf.setBackend(backendName);
        expect(() => tf.engine().runKernel(kernelName, {}, {}))
            .toThrowError(/Backend 'test-mem' has an internal memory leak \(1 data ids\)/);
        tf.removeBackend(backendName);
        tf.unregisterKernel(kernelName, backendName);
    });
    it('No mem leak in a kernel with multiple outputs', () => {
        let dataIdsCount = 0;
        tf.registerBackend(backendName, () => {
            return {
                id: 1,
                dispose: () => null,
                disposeData: (dataId) => null,
                numDataIds: () => dataIdsCount
            };
        });
        tf.setBackend(backendName);
        const kernelWith3Outputs = () => {
            dataIdsCount += 3;
            const t = { dataId: {}, shape: [], dtype: 'float32' };
            return [t, t, t];
        };
        tf.registerKernel({ kernelName, backendName, kernelFunc: kernelWith3Outputs });
        const res = tf.engine().runKernel(kernelName, {}, {});
        expect(Array.isArray(res)).toBe(true);
        expect(res.length).toBe(3);
        const kernelWithComplexOutputs = () => {
            dataIdsCount += 3;
            return { dataId: {}, shape: [], dtype: 'complex64' };
        };
        tf.registerKernel({
            kernelName: kernelNameComplex,
            backendName,
            kernelFunc: kernelWithComplexOutputs
        });
        const res2 = tf.engine().runKernel(kernelNameComplex, {}, {});
        expect(res2.shape).toEqual([]);
        expect(res2.dtype).toEqual('complex64');
        tf.removeBackend(backendName);
        tf.unregisterKernel(kernelName, backendName);
        tf.unregisterKernel(kernelNameComplex, backendName);
    });
});
// NOTE: This describe is purposefully not a describeWithFlags so that we
// test tensor allocation where no scopes have been created.
describe('Memory allocation outside a test scope', () => {
    it('constructing a tensor works', async () => {
        const backendName = 'test-backend';
        tf.registerBackend(backendName, () => {
            let storedValues = null;
            return {
                id: 1,
                floatPrecision: () => 32,
                write: (values, shape, dtype) => {
                    const dataId = {};
                    storedValues = values;
                    return dataId;
                },
                read: async (dataId) => storedValues,
                dispose: () => null,
                disposeData: (dataId) => null
            };
        });
        tf.setBackend(backendName);
        const a = tf.tensor1d([1, 2, 3]);
        expectArraysClose(await a.data(), [1, 2, 3]);
        a.dispose();
        tf.removeBackend(backendName);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5naW5lX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2VuZ2luZV90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUdILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDaEMsT0FBTyxLQUFLLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFOUIsT0FBTyxFQUFDLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRzlFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUc5QyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO0lBQ3BDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7UUFDYiwwQ0FBMEM7UUFDMUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN6QixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksa0JBQWtCLEdBQWEsRUFBRSxDQUFDO0lBQ3RDLElBQUksZUFBMEMsQ0FBQztJQUUvQyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2Qsa0VBQWtFO1FBQ2xFLHFFQUFxRTtRQUNyRSxnQkFBZ0I7UUFDaEIsZUFBZSxHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRTtZQUM1QyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUIsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDO1FBRUYsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2pCLENBQUMsQ0FBQyxDQUFDO0lBRUgsU0FBUyxDQUFDLEdBQUcsRUFBRTtRQUNiLDBEQUEwRDtRQUMxRCxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsSUFB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QUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDMUIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDdkIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUMsQ0FBQyxDQUFDO0lB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QkFDbkIsV0FBVyxFQUFFLENBQUMsTUFBVSxFQUFFLEVBQUUsQ0FBQyxJQUFJO2FBQ25CLENBQUM7UUFDbkIsQ0FBQyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTNCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRVosRUFBRSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNoQyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0tlcm5lbEJhY2tlbmR9IGZyb20gJy4vYmFja2VuZHMvYmFja2VuZCc7XG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi9lbmdpbmUnO1xuaW1wb3J0ICogYXMgdGYgZnJvbSAnLi9pbmRleCc7XG5pbXBvcnQge0tlcm5lbEZ1bmN9IGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IHtBTExfRU5WUywgZGVzY3JpYmVXaXRoRmxhZ3MsIFRlc3RLZXJuZWxCYWNrZW5kfSBmcm9tICcuL2phc21pbmVfdXRpbCc7XG5pbXBvcnQge1RlbnNvckluZm99IGZyb20gJy4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuL3RlbnNvcic7XG5pbXBvcnQge2V4cGVjdEFycmF5c0Nsb3NlfSBmcm9tICcuL3Rlc3RfdXRpbCc7XG5pbXBvcnQge0JhY2tlbmRWYWx1ZXMsIERhdGFUeXBlfSBmcm9tICcuL3R5cGVzJztcblxuZGVzY3JpYmUoJ0JhY2tlbmQgcmVnaXN0cmF0aW9uJywgKCkgPT4ge1xuICBiZWZvcmVBbGwoKCkgPT4ge1xuICAgIC8vIFNpbGVuY2VzIGJhY2tlbmQgcmVnaXN0cmF0aW9uIHdhcm5pbmdzLlxuICAgIHNweU9uKGNvbnNvbGUsICd3YXJuJyk7XG4gIH0pO1xuXG4gIGxldCByZWdpc3RlcmVkQmFja2VuZHM6IHN0cmluZ1tdID0gW107XG4gIGxldCByZWdpc3RlckJhY2tlbmQ6IHR5cGVvZiB0Zi5yZWdpc3RlckJhY2tlbmQ7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgLy8gUmVnaXN0ZXJpbmcgYSBiYWNrZW5kIGNoYW5nZXMgZ2xvYmFsIHN0YXRlIChlbmdpbmUpLCBzbyB3ZSB3cmFwXG4gICAgLy8gcmVnaXN0cmF0aW9uIHRvIGF1dG9tYXRpY2FsbHkgcmVtb3ZlIHJlZ2lzdGVyZWQgYmFja2VuZCBhdCB0aGUgZW5kXG4gICAgLy8gb2YgZWFjaCB0ZXN0LlxuICAgIHJlZ2lzdGVyQmFja2VuZCA9IChuYW1lLCBmYWN0b3J5LCBwcmlvcml0eSkgPT4ge1xuICAgICAgcmVnaXN0ZXJlZEJhY2tlbmRzLnB1c2gobmFtZSk7XG4gICAgICByZXR1cm4gdGYucmVnaXN0ZXJCYWNrZW5kKG5hbWUsIGZhY3RvcnksIHByaW9yaXR5KTtcbiAgICB9O1xuXG4gICAgRU5HSU5FLnJlc2V0KCk7XG4gIH0pO1xuXG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgLy8gUmVtb3ZlIGFsbCByZWdpc3RlcmVkIGJhY2tlbmRzIGF0IHRoZSBlbmQgb2YgZWFjaCB0ZXN0LlxuICAgIHJlZ2lzdGVyZWRCYWNrZW5kcy5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgaWYgKHRmLmZpbmRCYWNrZW5kRmFjdG9yeShuYW1lKSAhPSBudWxsKSB7XG4gICAgICAgIHRmLnJlbW92ZUJhY2tlbmQobmFtZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmVnaXN0ZXJlZEJhY2tlbmRzID0gW107XG4gIH0pO1xuXG4gIGl0KCdyZW1vdmVCYWNrZW5kIGRpc3Bvc2VzIHRoZSBiYWNrZW5kIGFuZCByZW1vdmVzIHRoZSBmYWN0b3J5JywgKCkgPT4ge1xuICAgIGxldCBiYWNrZW5kOiBLZXJuZWxCYWNrZW5kO1xuICAgIGNvbnN0IGZhY3RvcnkgPSAoKSA9PiB7XG4gICAgICBjb25zdCBuZXdCYWNrZW5kID0gbmV3IFRlc3RLZXJuZWxCYWNrZW5kKCk7XG4gICAgICBpZiAoYmFja2VuZCA9PSBudWxsKSB7XG4gICAgICAgIGJhY2tlbmQgPSBuZXdCYWNrZW5kO1xuICAgICAgICBzcHlPbihiYWNrZW5kLCAnZGlzcG9zZScpLmFuZC5jYWxsVGhyb3VnaCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ld0JhY2tlbmQ7XG4gICAgfTtcblxuICAgIHJlZ2lzdGVyQmFja2VuZCgndGVzdC1iYWNrZW5kJywgZmFjdG9yeSk7XG5cbiAgICBleHBlY3QodGYuZmluZEJhY2tlbmQoJ3Rlc3QtYmFja2VuZCcpICE9IG51bGwpLnRvQmUodHJ1ZSk7XG4gICAgZXhwZWN0KHRmLmZpbmRCYWNrZW5kKCd0ZXN0LWJhY2tlbmQnKSkudG9CZShiYWNrZW5kKTtcbiAgICBleHBlY3QodGYuZmluZEJhY2tlbmRGYWN0b3J5KCd0ZXN0LWJhY2tlbmQnKSkudG9CZShmYWN0b3J5KTtcblxuICAgIHRmLnJlbW92ZUJhY2tlbmQoJ3Rlc3QtYmFja2VuZCcpO1xuXG4gICAgZXhwZWN0KHRmLmZpbmRCYWNrZW5kKCd0ZXN0LWJhY2tlbmQnKSA9PSBudWxsKS50b0JlKHRydWUpO1xuICAgIGV4cGVjdCh0Zi5maW5kQmFja2VuZCgndGVzdC1iYWNrZW5kJykpLnRvQmUobnVsbCk7XG4gICAgZXhwZWN0KChiYWNrZW5kLmRpc3Bvc2UgYXMgamFzbWluZS5TcHkpLmNhbGxzLmNvdW50KCkpLnRvQmUoMSk7XG4gICAgZXhwZWN0KHRmLmZpbmRCYWNrZW5kRmFjdG9yeSgndGVzdC1iYWNrZW5kJykpLnRvQmUobnVsbCk7XG4gIH0pO1xuXG4gIGl0KCdmaW5kQmFja2VuZCBpbml0aWFsaXplcyB0aGUgYmFja2VuZCcsICgpID0+IHtcbiAgICBsZXQgYmFja2VuZDogS2VybmVsQmFja2VuZDtcbiAgICBjb25zdCBmYWN0b3J5ID0gKCkgPT4ge1xuICAgICAgY29uc3QgbmV3QmFja2VuZCA9IG5ldyBUZXN0S2VybmVsQmFja2VuZCgpO1xuICAgICAgaWYgKGJhY2tlbmQgPT0gbnVsbCkge1xuICAgICAgICBiYWNrZW5kID0gbmV3QmFja2VuZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXdCYWNrZW5kO1xuICAgIH07XG4gICAgcmVnaXN0ZXJCYWNrZW5kKCdjdXN0b20tY3B1JywgZmFjdG9yeSk7XG5cbiAgICBleHBlY3QodGYuZmluZEJhY2tlbmQoJ2N1c3RvbS1jcHUnKSAhPSBudWxsKS50b0JlKHRydWUpO1xuICAgIGV4cGVjdCh0Zi5maW5kQmFja2VuZCgnY3VzdG9tLWNwdScpKS50b0JlKGJhY2tlbmQpO1xuICAgIGV4cGVjdCh0Zi5maW5kQmFja2VuZEZhY3RvcnkoJ2N1c3RvbS1jcHUnKSkudG9CZShmYWN0b3J5KTtcbiAgfSk7XG5cbiAgaXQoJ2N1c3RvbSBiYWNrZW5kIHJlZ2lzdHJhdGlvbicsICgpID0+IHtcbiAgICBsZXQgYmFja2VuZDogS2VybmVsQmFja2VuZDtcbiAgICBjb25zdCBwcmlvcml0eSA9IDEwMztcbiAgICByZWdpc3RlckJhY2tlbmQoJ2N1c3RvbS1jcHUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBuZXdCYWNrZW5kID0gbmV3IFRlc3RLZXJuZWxCYWNrZW5kKCk7XG4gICAgICBpZiAoYmFja2VuZCA9PSBudWxsKSB7XG4gICAgICAgIGJhY2tlbmQgPSBuZXdCYWNrZW5kO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ld0JhY2tlbmQ7XG4gICAgfSwgcHJpb3JpdHkpO1xuXG4gICAgZXhwZWN0KHRmLmJhY2tlbmQoKSAhPSBudWxsKS50b0JlKHRydWUpO1xuICAgIGV4cGVjdCh0Zi5iYWNrZW5kKCkpLnRvQmUoYmFja2VuZCk7XG4gIH0pO1xuXG4gIGl0KCdoaWdoIHByaW9yaXR5IGJhY2tlbmQgcmVnaXN0cmF0aW9uIGZhaWxzLCBmYWxscyBiYWNrJywgKCkgPT4ge1xuICAgIGxldCBsb3dQcmlvcml0eUJhY2tlbmQ6IEtlcm5lbEJhY2tlbmQ7XG4gICAgY29uc3QgbG93UHJpb3JpdHkgPSAxMDM7XG4gICAgY29uc3QgaGlnaFByaW9yaXR5ID0gMTA0O1xuICAgIHJlZ2lzdGVyQmFja2VuZCgnY3VzdG9tLWxvdy1wcmlvcml0eScsICgpID0+IHtcbiAgICAgIGxvd1ByaW9yaXR5QmFja2VuZCA9IG5ldyBUZXN0S2VybmVsQmFja2VuZCgpO1xuICAgICAgcmV0dXJuIGxvd1ByaW9yaXR5QmFja2VuZDtcbiAgICB9LCBsb3dQcmlvcml0eSk7XG4gICAgcmVnaXN0ZXJCYWNrZW5kKCdjdXN0b20taGlnaC1wcmlvcml0eScsICgpID0+IHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSGlnaCBwcmlvcml0eSBiYWNrZW5kIGZhaWxzYCk7XG4gICAgfSwgaGlnaFByaW9yaXR5KTtcblxuICAgIGV4cGVjdCh0Zi5iYWNrZW5kKCkgIT0gbnVsbCkudG9CZSh0cnVlKTtcbiAgICBleHBlY3QodGYuYmFja2VuZCgpKS50b0JlKGxvd1ByaW9yaXR5QmFja2VuZCk7XG4gICAgZXhwZWN0KHRmLmdldEJhY2tlbmQoKSkudG9CZSgnY3VzdG9tLWxvdy1wcmlvcml0eScpO1xuICB9KTtcblxuICBpdCgnbG93IHByaW9yaXR5IGFuZCBoaWdoIHByaW9yaXR5IGJhY2tlbmRzLCBzZXRCYWNrZW5kIGxvdyBwcmlvcml0eScsICgpID0+IHtcbiAgICBsZXQgbG93UHJpb3JpdHlCYWNrZW5kOiBLZXJuZWxCYWNrZW5kO1xuICAgIGxldCBoaWdoUHJpb3JpdHlCYWNrZW5kOiBLZXJuZWxCYWNrZW5kO1xuICAgIGNvbnN0IGxvd1ByaW9yaXR5ID0gMTAzO1xuICAgIGNvbnN0IGhpZ2hQcmlvcml0eSA9IDEwNDtcbiAgICByZWdpc3RlckJhY2tlbmQoJ2N1c3RvbS1sb3ctcHJpb3JpdHknLCAoKSA9PiB7XG4gICAgICBsb3dQcmlvcml0eUJhY2tlbmQgPSBuZXcgVGVzdEtlcm5lbEJhY2tlbmQoKTtcbiAgICAgIHJldHVybiBsb3dQcmlvcml0eUJhY2tlbmQ7XG4gICAgfSwgbG93UHJpb3JpdHkpO1xuICAgIHJlZ2lzdGVyQmFja2VuZCgnY3VzdG9tLWhpZ2gtcHJpb3JpdHknLCAoKSA9PiB7XG4gICAgICBoaWdoUHJpb3JpdHlCYWNrZW5kID0gbmV3IFRlc3RLZXJuZWxCYWNrZW5kKCk7XG4gICAgICByZXR1cm4gaGlnaFByaW9yaXR5QmFja2VuZDtcbiAgICB9LCBoaWdoUHJpb3JpdHkpO1xuXG4gICAgZXhwZWN0KHRmLmJhY2tlbmQoKSAhPSBudWxsKS50b0JlKHRydWUpO1xuICAgIGV4cGVjdCh0Zi5iYWNrZW5kKCkpLnRvQmUoaGlnaFByaW9yaXR5QmFja2VuZCk7XG4gICAgZXhwZWN0KHRmLmdldEJhY2tlbmQoKSkudG9CZSgnY3VzdG9tLWhpZ2gtcHJpb3JpdHknKTtcblxuICAgIHRmLnNldEJhY2tlbmQoJ2N1c3RvbS1sb3ctcHJpb3JpdHknKTtcblxuICAgIGV4cGVjdCh0Zi5iYWNrZW5kKCkgIT0gbnVsbCkudG9CZSh0cnVlKTtcbiAgICBleHBlY3QodGYuYmFja2VuZCgpKS50b0JlKGxvd1ByaW9yaXR5QmFja2VuZCk7XG4gICAgZXhwZWN0KHRmLmdldEJhY2tlbmQoKSkudG9CZSgnY3VzdG9tLWxvdy1wcmlvcml0eScpO1xuICB9KTtcblxuICBpdCgnZGVmYXVsdCBjdXN0b20gYmFja2dyb3VuZCBudWxsJywgKCkgPT4ge1xuICAgIGV4cGVjdCh0Zi5maW5kQmFja2VuZCgnY3VzdG9tJykpLnRvQmVOdWxsKCk7XG4gIH0pO1xuXG4gIGl0KCdhbGxvdyBjdXN0b20gYmFja2VuZCcsICgpID0+IHtcbiAgICBjb25zdCBiYWNrZW5kID0gbmV3IFRlc3RLZXJuZWxCYWNrZW5kKCk7XG4gICAgY29uc3Qgc3VjY2VzcyA9IHJlZ2lzdGVyQmFja2VuZCgnY3VzdG9tJywgKCkgPT4gYmFja2VuZCk7XG4gICAgZXhwZWN0KHN1Y2Nlc3MpLnRvQmVUcnV0aHkoKTtcbiAgICBleHBlY3QodGYuZmluZEJhY2tlbmQoJ2N1c3RvbScpKS50b0VxdWFsKGJhY2tlbmQpO1xuICB9KTtcblxuICBpdCgnc3luYyBiYWNrZW5kIHdpdGggYXdhaXQgcmVhZHkgd29ya3MnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdGVzdEJhY2tlbmQgPSBuZXcgVGVzdEtlcm5lbEJhY2tlbmQoKTtcbiAgICByZWdpc3RlckJhY2tlbmQoJ3N5bmMnLCAoKSA9PiB0ZXN0QmFja2VuZCk7XG4gICAgdGYuc2V0QmFja2VuZCgnc3luYycpO1xuXG4gICAgZXhwZWN0KHRmLmdldEJhY2tlbmQoKSkudG9FcXVhbCgnc3luYycpO1xuICAgIGF3YWl0IHRmLnJlYWR5KCk7XG4gICAgZXhwZWN0KHRmLmJhY2tlbmQoKSkudG9FcXVhbCh0ZXN0QmFja2VuZCk7XG4gIH0pO1xuXG4gIGl0KCdzeW5jIGJhY2tlbmQgd2l0aG91dCBhd2FpdCByZWFkeSB3b3JrcycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB0ZXN0QmFja2VuZCA9IG5ldyBUZXN0S2VybmVsQmFja2VuZCgpO1xuICAgIHJlZ2lzdGVyQmFja2VuZCgnc3luYycsICgpID0+IHRlc3RCYWNrZW5kKTtcbiAgICB0Zi5zZXRCYWNrZW5kKCdzeW5jJyk7XG5cbiAgICBleHBlY3QodGYuZ2V0QmFja2VuZCgpKS50b0VxdWFsKCdzeW5jJyk7XG4gICAgZXhwZWN0KHRmLmJhY2tlbmQoKSkudG9FcXVhbCh0ZXN0QmFja2VuZCk7XG4gIH0pO1xuXG4gIGl0KCdhc3luYyBiYWNrZW5kIHdpdGggYXdhaXQgcmVhZHkgd29ya3MnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdGVzdEJhY2tlbmQgPSBuZXcgVGVzdEtlcm5lbEJhY2tlbmQoKTtcbiAgICByZWdpc3RlckJhY2tlbmQoJ2FzeW5jJywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGYubmV4dEZyYW1lKCk7XG4gICAgICByZXR1cm4gdGVzdEJhY2tlbmQ7XG4gICAgfSk7XG4gICAgdGYuc2V0QmFja2VuZCgnYXN5bmMnKTtcblxuICAgIGV4cGVjdCh0Zi5nZXRCYWNrZW5kKCkpLnRvRXF1YWwoJ2FzeW5jJyk7XG4gICAgYXdhaXQgdGYucmVhZHkoKTtcbiAgICBleHBlY3QodGYuYmFja2VuZCgpKS50b0VxdWFsKHRlc3RCYWNrZW5kKTtcbiAgfSk7XG5cbiAgaXQoJ2FzeW5jIGJhY2tlbmQgd2l0aG91dCBhd2FpdCByZWFkeSBkb2VzIG5vdCB3b3JrJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHRlc3RCYWNrZW5kID0gbmV3IFRlc3RLZXJuZWxCYWNrZW5kKCk7XG4gICAgcmVnaXN0ZXJCYWNrZW5kKCdhc3luYycsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHRmLm5leHRGcmFtZSgpO1xuICAgICAgcmV0dXJuIHRlc3RCYWNrZW5kO1xuICAgIH0pO1xuICAgIHRmLnNldEJhY2tlbmQoJ2FzeW5jJyk7XG5cbiAgICBleHBlY3QodGYuZ2V0QmFja2VuZCgpKS50b0VxdWFsKCdhc3luYycpO1xuICAgIGV4cGVjdCgoKSA9PiB0Zi5iYWNrZW5kKCkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0JhY2tlbmQgJ2FzeW5jJyBoYXMgbm90IHlldCBiZWVuIGluaXRpYWxpemVkLi8pO1xuICB9KTtcblxuICBpdCgndGYuc3F1YXJlKCkgZmFpbHMgaWYgdXNlciBkb2VzIG5vdCBhd2FpdCByZWFkeSBvbiBhc3luYyBiYWNrZW5kJyxcbiAgICAgYXN5bmMgKCkgPT4ge1xuICAgICAgIHJlZ2lzdGVyQmFja2VuZCgnYXN5bmMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICBhd2FpdCB0Zi5uZXh0RnJhbWUoKTtcbiAgICAgICAgIHJldHVybiBuZXcgVGVzdEtlcm5lbEJhY2tlbmQoKTtcbiAgICAgICB9KTtcbiAgICAgICB0Zi5zZXRCYWNrZW5kKCdhc3luYycpO1xuICAgICAgIGV4cGVjdCgoKSA9PiB0Zi5zcXVhcmUoMikpXG4gICAgICAgICAgIC50b1Rocm93RXJyb3IoL0JhY2tlbmQgJ2FzeW5jJyBoYXMgbm90IHlldCBiZWVuIGluaXRpYWxpemVkLyk7XG4gICAgIH0pO1xuXG4gIGl0KCd0Zi5zcXVhcmUoKSB3b3JrcyB3aGVuIHVzZXIgYXdhaXRzIHJlYWR5IG9uIGFzeW5jIGJhY2tlbmQnLCBhc3luYyAoKSA9PiB7XG4gICAgcmVnaXN0ZXJCYWNrZW5kKCdhc3luYycsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHRmLm5leHRGcmFtZSgpO1xuICAgICAgcmV0dXJuIG5ldyBUZXN0S2VybmVsQmFja2VuZCgpO1xuICAgIH0pO1xuICAgIHRmLnNldEJhY2tlbmQoJ2FzeW5jJyk7XG4gICAgYXdhaXQgdGYucmVhZHkoKTtcbiAgICBleHBlY3QoKCkgPT4gdGYuc3F1YXJlKDIpKS50b1Rocm93RXJyb3IoLyd3cml0ZScgbm90IHlldCBpbXBsZW1lbnRlZC8pO1xuICB9KTtcblxuICBpdCgnUmVnaXN0ZXJpbmcgYXN5bmMyIChoaWdoZXIgcHJpb3JpdHkpIGZhaWxzLCBhc3luYzEgYmVjb21lcyBhY3RpdmUnLFxuICAgICBhc3luYyAoKSA9PiB7XG4gICAgICAgY29uc3QgdGVzdEJhY2tlbmQgPSBuZXcgVGVzdEtlcm5lbEJhY2tlbmQoKTtcbiAgICAgICByZWdpc3RlckJhY2tlbmQoJ2FzeW5jMScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgIGF3YWl0IHRmLm5leHRGcmFtZSgpO1xuICAgICAgICAgcmV0dXJuIHRlc3RCYWNrZW5kO1xuICAgICAgIH0sIDEwMCAvKiBwcmlvcml0eSAqLyk7XG4gICAgICAgcmVnaXN0ZXJCYWNrZW5kKCdhc3luYzInLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICBhd2FpdCB0Zi5uZXh0RnJhbWUoKTtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcignZmFpbGVkIHRvIGNyZWF0ZSBhc3luYzInKTtcbiAgICAgICB9LCAxMDEgLyogcHJpb3JpdHkgKi8pO1xuXG4gICAgICAgLy8gQXdhaXQgZm9yIHRoZSBsaWJyYXJ5IHRvIGZpbmQgdGhlIGJlc3QgYmFja2VuZCB0aGF0IHN1Y2Nlc2Z1bGx5XG4gICAgICAgLy8gaW5pdGlhbGl6ZXMuXG4gICAgICAgYXdhaXQgdGYucmVhZHkoKTtcbiAgICAgICBleHBlY3QodGYuYmFja2VuZCgpKS50b0VxdWFsKHRlc3RCYWNrZW5kKTtcbiAgICAgICBleHBlY3QodGYuZ2V0QmFja2VuZCgpKS50b0JlKCdhc3luYzEnKTtcbiAgICAgfSk7XG5cbiAgaXQoJ1JlZ2lzdGVyaW5nIHN5bmMgYXMgaGlnaGVyIHByaW9yaXR5IGFuZCBhc3luYyBhcyBsb3dlciBwcmlvcml0eScsXG4gICAgIGFzeW5jICgpID0+IHtcbiAgICAgICBjb25zdCB0ZXN0QmFja2VuZCA9IG5ldyBUZXN0S2VybmVsQmFja2VuZCgpO1xuICAgICAgIHJlZ2lzdGVyQmFja2VuZCgnc3luYycsICgpID0+IHRlc3RCYWNrZW5kLCAxMDEgLyogcHJpb3JpdHkgKi8pO1xuICAgICAgIHJlZ2lzdGVyQmFja2VuZCgnYXN5bmMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICBhd2FpdCB0Zi5uZXh0RnJhbWUoKTtcbiAgICAgICAgIHJldHVybiBuZXcgVGVzdEtlcm5lbEJhY2tlbmQoKTtcbiAgICAgICB9LCAxMDAgLyogcHJpb3JpdHkgKi8pO1xuXG4gICAgICAgLy8gTm8gbmVlZCB0byBhd2FpdCBmb3IgcmVhZHkoKSBzaW5jZSB0aGUgaGlnaGVzdCBwcmlvcml0eSBvbmUgaXMgc3luYy5cbiAgICAgICBleHBlY3QodGYuYmFja2VuZCgpKS50b0VxdWFsKHRlc3RCYWNrZW5kKTtcbiAgICAgICBleHBlY3QodGYuZ2V0QmFja2VuZCgpKS50b0JlKCdzeW5jJyk7XG4gICAgIH0pO1xuXG4gIGl0KCdhc3luYyBhcyBoaWdoZXIgcHJpb3JpdHkgYW5kIHN5bmMgYXMgbG93ZXIgcHJpb3JpdHkgd2l0aCBhd2FpdCByZWFkeScsXG4gICAgIGFzeW5jICgpID0+IHtcbiAgICAgICBjb25zdCB0ZXN0QmFja2VuZCA9IG5ldyBUZXN0S2VybmVsQmFja2VuZCgpO1xuICAgICAgIHJlZ2lzdGVyQmFja2VuZCgnYXN5bmMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICBhd2FpdCB0Zi5uZXh0RnJhbWUoKTtcbiAgICAgICAgIHJldHVybiB0ZXN0QmFja2VuZDtcbiAgICAgICB9LCAxMDEgLyogcHJpb3JpdHkgKi8pO1xuICAgICAgIHJlZ2lzdGVyQmFja2VuZChcbiAgICAgICAgICAgJ3N5bmMnLCAoKSA9PiBuZXcgVGVzdEtlcm5lbEJhY2tlbmQoKSwgMTAwIC8qIHByaW9yaXR5ICovKTtcblxuICAgICAgIGF3YWl0IHRmLnJlYWR5KCk7XG4gICAgICAgZXhwZWN0KHRmLmJhY2tlbmQoKSkudG9FcXVhbCh0ZXN0QmFja2VuZCk7XG4gICAgICAgZXhwZWN0KHRmLmdldEJhY2tlbmQoKSkudG9CZSgnYXN5bmMnKTtcbiAgICAgfSk7XG5cbiAgaXQoJ2FzeW5jIGFzIGhpZ2hlciBwcmlvcml0eSBhbmQgc3luYyBhcyBsb3dlciBwcmlvcml0eSB3L28gYXdhaXQgcmVhZHknLFxuICAgICBhc3luYyAoKSA9PiB7XG4gICAgICAgY29uc3QgdGVzdEJhY2tlbmQgPSBuZXcgVGVzdEtlcm5lbEJhY2tlbmQoKTtcbiAgICAgICByZWdpc3RlckJhY2tlbmQoJ2FzeW5jJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgYXdhaXQgdGYubmV4dEZyYW1lKCk7XG4gICAgICAgICByZXR1cm4gdGVzdEJhY2tlbmQ7XG4gICAgICAgfSwgMTAxIC8qIHByaW9yaXR5ICovKTtcbiAgICAgICByZWdpc3RlckJhY2tlbmQoXG4gICAgICAgICAgICdzeW5jJywgKCkgPT4gbmV3IFRlc3RLZXJuZWxCYWNrZW5kKCksIDEwMCAvKiBwcmlvcml0eSAqLyk7XG5cbiAgICAgICBleHBlY3QoKCkgPT4gdGYuYmFja2VuZCgpKVxuICAgICAgICAgICAudG9UaHJvd0Vycm9yKFxuICAgICAgICAgICAgICAgL1RoZSBoaWdoZXN0IHByaW9yaXR5IGJhY2tlbmQgJ2FzeW5jJyBoYXMgbm90IHlldCBiZWVuLyk7XG4gICAgIH0pO1xuXG4gIGl0KCdSZWdpc3RlcmluZyBhbmQgc2V0dGluZyBhIGJhY2tlbmQgdGhhdCBmYWlscyB0byByZWdpc3RlcicsIGFzeW5jICgpID0+IHtcbiAgICByZWdpc3RlckJhY2tlbmQoJ2FzeW5jJywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGYubmV4dEZyYW1lKCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZhaWxlZCB0byBjcmVhdGUgYXN5bmMnKTtcbiAgICB9KTtcbiAgICBjb25zdCBzdWNjZXNzID0gdGYuc2V0QmFja2VuZCgnYXN5bmMnKTtcbiAgICBleHBlY3QodGYuZ2V0QmFja2VuZCgpKS50b0JlKCdhc3luYycpO1xuICAgIGV4cGVjdCgoKSA9PiB0Zi5iYWNrZW5kKCkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0JhY2tlbmQgJ2FzeW5jJyBoYXMgbm90IHlldCBiZWVuIGluaXRpYWxpemVkLyk7XG4gICAgZXhwZWN0KGF3YWl0IHN1Y2Nlc3MpLnRvQmUoZmFsc2UpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZVdpdGhGbGFncygnbWVtb3J5JywgQUxMX0VOVlMsICgpID0+IHtcbiAgaXQoJ1N1bShmbG9hdCknLCBhc3luYyAoKSA9PiB7XG4gICAgZXhwZWN0KHRmLm1lbW9yeSgpLm51bVRlbnNvcnMpLnRvQmUoMCk7XG4gICAgZXhwZWN0KHRmLm1lbW9yeSgpLm51bUJ5dGVzKS50b0JlKDApO1xuICAgIGNvbnN0IHN1bSA9IHRmLnRpZHkoKCkgPT4ge1xuICAgICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzLCA0XSk7XG4gICAgICBleHBlY3QodGYubWVtb3J5KCkubnVtVGVuc29ycykudG9CZSgxKTtcbiAgICAgIGV4cGVjdCh0Zi5tZW1vcnkoKS5udW1CeXRlcykudG9CZSg0ICogNCk7XG4gICAgICByZXR1cm4gYS5zdW0oKTtcbiAgICB9KTtcbiAgICBleHBlY3QodGYubWVtb3J5KCkubnVtVGVuc29ycykudG9CZSgxKTtcbiAgICBleHBlY3QodGYubWVtb3J5KCkubnVtQnl0ZXMpLnRvQmUoNCk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgc3VtLmRhdGEoKSwgWzEgKyAyICsgMyArIDRdKTtcbiAgfSk7XG5cbiAgaXQoJ1N1bShib29sKScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBzdW0gPSB0Zi50aWR5KCgpID0+IHtcbiAgICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbdHJ1ZSwgdHJ1ZSwgZmFsc2UsIHRydWVdLCAnYm9vbCcpO1xuICAgICAgZXhwZWN0KHRmLm1lbW9yeSgpLm51bVRlbnNvcnMpLnRvQmUoMSk7XG4gICAgICBleHBlY3QodGYubWVtb3J5KCkubnVtQnl0ZXMpLnRvQmUoNCk7XG4gICAgICByZXR1cm4gYS5zdW0oKTtcbiAgICB9KTtcbiAgICBleHBlY3QodGYubWVtb3J5KCkubnVtVGVuc29ycykudG9CZSgxKTtcbiAgICBleHBlY3QodGYubWVtb3J5KCkubnVtQnl0ZXMpLnRvQmUoNCk7XG4gICAgZXhwZWN0KHN1bS5kdHlwZSkudG9CZSgnaW50MzInKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBzdW0uZGF0YSgpLCBbMSArIDEgKyAwICsgMV0pO1xuICB9KTtcblxuICBpdCgnU3VtKGludDMyKScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBzdW0gPSB0Zi50aWR5KCgpID0+IHtcbiAgICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMSwgMSwgMCwgMV0sICdpbnQzMicpO1xuICAgICAgZXhwZWN0KHRmLm1lbW9yeSgpLm51bVRlbnNvcnMpLnRvQmUoMSk7XG4gICAgICBleHBlY3QodGYubWVtb3J5KCkubnVtQnl0ZXMpLnRvQmUoNCAqIDQpO1xuICAgICAgcmV0dXJuIGEuc3VtKCk7XG4gICAgfSk7XG4gICAgZXhwZWN0KHRmLm1lbW9yeSgpLm51bVRlbnNvcnMpLnRvQmUoMSk7XG4gICAgZXhwZWN0KHRmLm1lbW9yeSgpLm51bUJ5dGVzKS50b0JlKDQpO1xuICAgIGV4cGVjdChzdW0uZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgc3VtLmRhdGEoKSwgWzEgKyAxICsgMCArIDFdKTtcbiAgfSk7XG5cbiAgaXQoJ3N0cmluZyB0ZW5zb3InLCAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcihbWydhJywgJ2JiJ10sIFsnYycsICdkJ11dKTtcblxuICAgIGV4cGVjdCh0Zi5tZW1vcnkoKS5udW1UZW5zb3JzKS50b0JlKDEpO1xuICAgIGV4cGVjdCh0Zi5tZW1vcnkoKS5udW1CeXRlcykudG9CZSg1KTsgIC8vIDUgbGV0dGVycywgZWFjaCAxIGJ5dGUgaW4gdXRmOC5cblxuICAgIGEuZGlzcG9zZSgpO1xuXG4gICAgZXhwZWN0KHRmLm1lbW9yeSgpLm51bVRlbnNvcnMpLnRvQmUoMCk7XG4gICAgZXhwZWN0KHRmLm1lbW9yeSgpLm51bUJ5dGVzKS50b0JlKDApO1xuICB9KTtcblxuICBpdCgndW5yZWxpYWJsZSBpcyB0cnVlIGZvciBzdHJpbmcgdGVuc29ycycsICgpID0+IHtcbiAgICB0Zi50ZW5zb3IoJ2EnKTtcbiAgICBjb25zdCBtZW0gPSB0Zi5tZW1vcnkoKTtcbiAgICBleHBlY3QobWVtLnVucmVsaWFibGUpLnRvQmUodHJ1ZSk7XG4gICAgY29uc3QgZXhwZWN0ZWRSZWFzb24gPSAnTWVtb3J5IHVzYWdlIGJ5IHN0cmluZyB0ZW5zb3JzIGlzIGFwcHJveGltYXRlICcgK1xuICAgICAgICAnKDIgYnl0ZXMgcGVyIGNoYXJhY3RlciknO1xuICAgIGV4cGVjdChtZW0ucmVhc29ucy5pbmRleE9mKGV4cGVjdGVkUmVhc29uKSA+PSAwKS50b0JlKHRydWUpO1xuICB9KTtcblxuICBpdCgnbWFrZVRlbnNvckZyb21EYXRhSWQgY3JlYXRlcyBhIHRlbnNvcicsICgpID0+IHtcbiAgICBjb25zdCB0ZW5zb3IgPSBFTkdJTkUubWFrZVRlbnNvckZyb21EYXRhSWQoe30sIFszXSwgJ2Zsb2F0MzInKTtcbiAgICBleHBlY3QodGVuc29yKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdCh0ZW5zb3Iuc2hhcGUpLnRvRXF1YWwoWzNdKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ3Byb2ZpbGUnLCBBTExfRU5WUywgKCkgPT4ge1xuICBpdCgnc3F1YXJpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcHJvZmlsZSA9IGF3YWl0IHRmLnByb2ZpbGUoKCkgPT4ge1xuICAgICAgY29uc3QgeCA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzXSk7XG4gICAgICBsZXQgeDIgPSB4LnNxdWFyZSgpO1xuICAgICAgeDIuZGlzcG9zZSgpO1xuICAgICAgeDIgPSB4LnNxdWFyZSgpO1xuICAgICAgeDIuZGlzcG9zZSgpO1xuICAgICAgcmV0dXJuIHg7XG4gICAgfSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBwcm9maWxlLnJlc3VsdCBhcyBUZW5zb3I7XG5cbiAgICBleHBlY3QocHJvZmlsZS5uZXdCeXRlcykudG9CZSgxMik7XG4gICAgZXhwZWN0KHByb2ZpbGUucGVha0J5dGVzKS50b0JlKDI0KTtcbiAgICBleHBlY3QocHJvZmlsZS5uZXdUZW5zb3JzKS50b0JlKDEpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIFsxLCAyLCAzXSk7XG4gICAgZXhwZWN0KHByb2ZpbGUua2VybmVscy5sZW5ndGgpLnRvQmUoMik7XG5cbiAgICAvLyBUZXN0IHRoZSB0eXBlcyBmb3IgYGtlcm5lbFRpbWVNc2AgYW5kIGBleHRyYUluZm9gIHRvIGNvbmZpcm0gdGhlIHByb21pc2VzXG4gICAgLy8gYXJlIHJlc29sdmVkLlxuICAgIGV4cGVjdChwcm9maWxlLmtlcm5lbHNbMF0ua2VybmVsVGltZU1zIGluc3RhbmNlb2YgUHJvbWlzZSkudG9CZShmYWxzZSk7XG4gICAgZXhwZWN0KHByb2ZpbGUua2VybmVsc1swXS5leHRyYUluZm8gaW5zdGFuY2VvZiBQcm9taXNlKS50b0JlKGZhbHNlKTtcbiAgICBleHBlY3QocHJvZmlsZS5rZXJuZWxzWzFdLmtlcm5lbFRpbWVNcyBpbnN0YW5jZW9mIFByb21pc2UpLnRvQmUoZmFsc2UpO1xuICAgIGV4cGVjdChwcm9maWxlLmtlcm5lbHNbMV0uZXh0cmFJbmZvIGluc3RhbmNlb2YgUHJvbWlzZSkudG9CZShmYWxzZSk7XG5cbiAgICAvLyBUaGUgc3BlY2lmaWMgdmFsdWVzIG9mIGBrZXJuZWxUaW1lTXNgIGFuZCBgZXh0cmFJbmZvYCBhcmUgdGVzdGVkIGluIHRoZVxuICAgIC8vIHRlc3RzIG9mIFByb2ZpbGVyLnByb2ZpbGVLZXJuZWwsIHNvIHRoZWlyIHZhbHVlcyBhcmUgbm90IHRlc3RlZCBoZXJlLlxuICAgIGV4cGVjdChwcm9maWxlLmtlcm5lbHNbMF0pLnRvRXF1YWwoe1xuICAgICAgJ25hbWUnOiAnU3F1YXJlJyxcbiAgICAgICdieXRlc0FkZGVkJzogMTIsXG4gICAgICAndG90YWxCeXRlc1NuYXBzaG90JzogMjQsXG4gICAgICAndGVuc29yc0FkZGVkJzogMSxcbiAgICAgICd0b3RhbFRlbnNvcnNTbmFwc2hvdCc6IDIsXG4gICAgICAnaW5wdXRTaGFwZXMnOiBbWzNdXSxcbiAgICAgICdvdXRwdXRTaGFwZXMnOiBbWzNdXSxcbiAgICAgICdrZXJuZWxUaW1lTXMnOiBwcm9maWxlLmtlcm5lbHNbMF0ua2VybmVsVGltZU1zLFxuICAgICAgJ2V4dHJhSW5mbyc6IHByb2ZpbGUua2VybmVsc1swXS5leHRyYUluZm9cbiAgICB9KTtcblxuICAgIGV4cGVjdChwcm9maWxlLmtlcm5lbHNbMV0pLnRvRXF1YWwoe1xuICAgICAgJ25hbWUnOiAnU3F1YXJlJyxcbiAgICAgICdieXRlc0FkZGVkJzogMTIsXG4gICAgICAndG90YWxCeXRlc1NuYXBzaG90JzogMjQsXG4gICAgICAndGVuc29yc0FkZGVkJzogMSxcbiAgICAgICd0b3RhbFRlbnNvcnNTbmFwc2hvdCc6IDIsXG4gICAgICAnaW5wdXRTaGFwZXMnOiBbWzNdXSxcbiAgICAgICdvdXRwdXRTaGFwZXMnOiBbWzNdXSxcbiAgICAgICdrZXJuZWxUaW1lTXMnOiBwcm9maWxlLmtlcm5lbHNbMV0ua2VybmVsVGltZU1zLFxuICAgICAgJ2V4dHJhSW5mbyc6IHByb2ZpbGUua2VybmVsc1sxXS5leHRyYUluZm9cbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3NxdWFyaW5nIHdpdGhvdXQgZGlzcG9zaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHByb2ZpbGUgPSBhd2FpdCB0Zi5wcm9maWxlKCgpID0+IHtcbiAgICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IxZChbMSwgMiwgM10pO1xuICAgICAgY29uc3QgeDIgPSB4LnNxdWFyZSgpO1xuICAgICAgcmV0dXJuIHgyO1xuICAgIH0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gcHJvZmlsZS5yZXN1bHQgYXMgVGVuc29yO1xuXG4gICAgZXhwZWN0KHByb2ZpbGUubmV3Qnl0ZXMpLnRvQmUoMjQpO1xuICAgIGV4cGVjdChwcm9maWxlLnBlYWtCeXRlcykudG9CZSgyNCk7XG4gICAgZXhwZWN0KHByb2ZpbGUubmV3VGVuc29ycykudG9CZSgyKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBbMSwgNCwgOV0pO1xuICAgIGV4cGVjdChwcm9maWxlLmtlcm5lbHMubGVuZ3RoKS50b0JlKDEpO1xuICAgIGV4cGVjdChwcm9maWxlLmtlcm5lbHNbMF0ua2VybmVsVGltZU1zIGluc3RhbmNlb2YgUHJvbWlzZSkudG9CZShmYWxzZSk7XG4gICAgZXhwZWN0KHByb2ZpbGUua2VybmVsc1swXS5leHRyYUluZm8gaW5zdGFuY2VvZiBQcm9taXNlKS50b0JlKGZhbHNlKTtcbiAgICBleHBlY3QocHJvZmlsZS5rZXJuZWxzWzBdKS50b0VxdWFsKHtcbiAgICAgICduYW1lJzogJ1NxdWFyZScsXG4gICAgICAnYnl0ZXNBZGRlZCc6IDEyLFxuICAgICAgJ3RvdGFsQnl0ZXNTbmFwc2hvdCc6IDI0LFxuICAgICAgJ3RlbnNvcnNBZGRlZCc6IDEsXG4gICAgICAndG90YWxUZW5zb3JzU25hcHNob3QnOiAyLFxuICAgICAgJ2lucHV0U2hhcGVzJzogW1szXV0sXG4gICAgICAnb3V0cHV0U2hhcGVzJzogW1szXV0sXG4gICAgICAna2VybmVsVGltZU1zJzogcHJvZmlsZS5rZXJuZWxzWzBdLmtlcm5lbFRpbWVNcyxcbiAgICAgICdleHRyYUluZm8nOiBwcm9maWxlLmtlcm5lbHNbMF0uZXh0cmFJbmZvXG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzcXVhcmluZyBpbiBhc3luYyBxdWVyeScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBwcm9maWxlID0gYXdhaXQgdGYucHJvZmlsZShhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMSkpO1xuICAgICAgY29uc3QgeCA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzXSk7XG4gICAgICBjb25zdCB4MiA9IHguc3F1YXJlKCk7XG4gICAgICB4Mi5kaXNwb3NlKCk7XG4gICAgICByZXR1cm4geDtcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHByb2ZpbGUucmVzdWx0IGFzIFRlbnNvcjtcblxuICAgIGV4cGVjdChwcm9maWxlLm5ld0J5dGVzKS50b0JlKDEyKTtcbiAgICBleHBlY3QocHJvZmlsZS5wZWFrQnl0ZXMpLnRvQmUoMjQpO1xuICAgIGV4cGVjdChwcm9maWxlLm5ld1RlbnNvcnMpLnRvQmUoMSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzEsIDIsIDNdKTtcbiAgICBleHBlY3QocHJvZmlsZS5rZXJuZWxzLmxlbmd0aCkudG9CZSgxKTtcbiAgICBleHBlY3QocHJvZmlsZS5rZXJuZWxzWzBdLmtlcm5lbFRpbWVNcyBpbnN0YW5jZW9mIFByb21pc2UpLnRvQmUoZmFsc2UpO1xuICAgIGV4cGVjdChwcm9maWxlLmtlcm5lbHNbMF0uZXh0cmFJbmZvIGluc3RhbmNlb2YgUHJvbWlzZSkudG9CZShmYWxzZSk7XG4gICAgZXhwZWN0KHByb2ZpbGUua2VybmVsc1swXSkudG9FcXVhbCh7XG4gICAgICAnbmFtZSc6ICdTcXVhcmUnLFxuICAgICAgJ2J5dGVzQWRkZWQnOiAxMixcbiAgICAgICd0b3RhbEJ5dGVzU25hcHNob3QnOiAyNCxcbiAgICAgICd0ZW5zb3JzQWRkZWQnOiAxLFxuICAgICAgJ3RvdGFsVGVuc29yc1NuYXBzaG90JzogMixcbiAgICAgICdpbnB1dFNoYXBlcyc6IFtbM11dLFxuICAgICAgJ291dHB1dFNoYXBlcyc6IFtbM11dLFxuICAgICAgJ2tlcm5lbFRpbWVNcyc6IHByb2ZpbGUua2VybmVsc1swXS5rZXJuZWxUaW1lTXMsXG4gICAgICAnZXh0cmFJbmZvJzogcHJvZmlsZS5rZXJuZWxzWzBdLmV4dHJhSW5mb1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgncmVwb3J0cyBjb3JyZWN0IGtlcm5lbE5hbWVzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHByb2ZpbGUgPSBhd2FpdCB0Zi5wcm9maWxlKCgpID0+IHtcbiAgICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IxZChbMSwgMiwgM10pO1xuICAgICAgY29uc3QgeDIgPSB4LnNxdWFyZSgpO1xuICAgICAgY29uc3QgeDMgPSB4Mi5hYnMoKTtcbiAgICAgIHJldHVybiB4MztcbiAgICB9KTtcblxuICAgIGV4cGVjdChwcm9maWxlLmtlcm5lbE5hbWVzKS50b0VxdWFsKGphc21pbmUuYXJyYXlXaXRoRXhhY3RDb250ZW50cyhbXG4gICAgICAnU3F1YXJlJywgJ0FicydcbiAgICBdKSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCdkaXNwb3NlVmFyaWFibGVzJywgQUxMX0VOVlMsICgpID0+IHtcbiAgaXQoJ3JldXNlIHNhbWUgbmFtZSB2YXJpYWJsZScsICgpID0+IHtcbiAgICB0Zi50ZW5zb3IxZChbMSwgMiwgM10pLnZhcmlhYmxlKHRydWUsICd2MScpO1xuICAgIHRmLnRlbnNvcjFkKFsxLCAyLCAzXSkudmFyaWFibGUodHJ1ZSwgJ3YyJyk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHRmLnRlbnNvcjFkKFsxLCAyLCAzXSkudmFyaWFibGUodHJ1ZSwgJ3YxJyk7XG4gICAgfSkudG9UaHJvd0Vycm9yKCk7XG4gICAgdGYuZGlzcG9zZVZhcmlhYmxlcygpO1xuICAgIHRmLnRlbnNvcjFkKFsxLCAyLCAzXSkudmFyaWFibGUodHJ1ZSwgJ3YxJyk7XG4gICAgdGYudGVuc29yMWQoWzEsIDIsIDNdKS52YXJpYWJsZSh0cnVlLCAndjInKTtcbiAgfSk7XG59KTtcblxuLyoqXG4gKiBUaGUgZm9sbG93aW5nIHRlc3QgY29uc3RyYWludHMgdG8gdGhlIENQVSBlbnZpcm9ubWVudCBiZWNhdXNlIGl0IG5lZWRzIGFcbiAqIGNvbmNyZXRlIGJhY2tlbmQgdG8gZXhpc3QuIFRoaXMgdGVzdCB3aWxsIHdvcmsgZm9yIGFueSBiYWNrZW5kLCBidXQgY3VycmVudGx5XG4gKiB0aGlzIGlzIHRoZSBzaW1wbGVzdCBiYWNrZW5kIHRvIHRlc3QgYWdhaW5zdC5cbiAqL1xuZGVzY3JpYmVXaXRoRmxhZ3MoXG4gICAgJ1N3aXRjaGluZyBjcHUgYmFja2VuZHMnLFxuICAgIHtwcmVkaWNhdGU6IHRlc3RFbnYgPT4gdGVzdEVudi5iYWNrZW5kTmFtZSA9PT0gJ2NwdSd9LCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgdGYucmVnaXN0ZXJCYWNrZW5kKCdjcHUxJywgdGYuZmluZEJhY2tlbmRGYWN0b3J5KCdjcHUnKSk7XG4gICAgICAgIHRmLnJlZ2lzdGVyQmFja2VuZCgnY3B1MicsIHRmLmZpbmRCYWNrZW5kRmFjdG9yeSgnY3B1JykpO1xuICAgICAgfSk7XG5cbiAgICAgIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgICAgIHRmLnJlbW92ZUJhY2tlbmQoJ2NwdTEnKTtcbiAgICAgICAgdGYucmVtb3ZlQmFja2VuZCgnY3B1MicpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdNb3ZlIGRhdGEgZnJvbSBjcHUxIHRvIGNwdTIgYmFja2VuZCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgdGYuc2V0QmFja2VuZCgnY3B1MScpO1xuICAgICAgICAvLyBUaGlzIHNjYWxhciBsaXZlcyBpbiBjcHUxLlxuICAgICAgICBjb25zdCBhID0gdGYuc2NhbGFyKDUpO1xuXG4gICAgICAgIHRmLnNldEJhY2tlbmQoJ2NwdTInKTtcbiAgICAgICAgLy8gVGhpcyBzY2FsYXIgbGl2ZXMgaW4gY3B1Mi5cbiAgICAgICAgY29uc3QgYiA9IHRmLnNjYWxhcigzKTtcblxuICAgICAgICBleHBlY3QodGYubWVtb3J5KCkubnVtRGF0YUJ1ZmZlcnMpLnRvQmUoMik7XG4gICAgICAgIGV4cGVjdCh0Zi5tZW1vcnkoKS5udW1UZW5zb3JzKS50b0JlKDIpO1xuICAgICAgICBleHBlY3QodGYubWVtb3J5KCkubnVtQnl0ZXMpLnRvQmUoOCk7XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIHlvdSBjYW4gcmVhZCBib3RoIHRlbnNvcnMuXG4gICAgICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGEuZGF0YSgpLCBbNV0pO1xuICAgICAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBiLmRhdGEoKSwgWzNdKTtcblxuICAgICAgICAvLyBTd2l0Y2ggYmFjayB0byBjcHUxLlxuICAgICAgICB0Zi5zZXRCYWNrZW5kKCdjcHUxJyk7XG4gICAgICAgIC8vIEFnYWluIG1ha2Ugc3VyZSB5b3UgY2FuIHJlYWQgYm90aCB0ZW5zb3JzLlxuICAgICAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBhLmRhdGEoKSwgWzVdKTtcbiAgICAgICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYi5kYXRhKCksIFszXSk7XG5cbiAgICAgICAgdGYuZGlzcG9zZShbYSwgYl0pO1xuXG4gICAgICAgIGV4cGVjdCh0Zi5tZW1vcnkoKS5udW1EYXRhQnVmZmVycykudG9CZSgwKTtcbiAgICAgICAgZXhwZWN0KHRmLm1lbW9yeSgpLm51bVRlbnNvcnMpLnRvQmUoMCk7XG4gICAgICAgIGV4cGVjdCh0Zi5tZW1vcnkoKS5udW1CeXRlcykudG9CZSgwKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnY2FuIGV4ZWN1dGUgb3Agd2l0aCBkYXRhIGZyb20gbWl4ZWQgYmFja2VuZHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGtlcm5lbEZ1bmMgPSB0Zi5nZXRLZXJuZWwoJ0FkZCcsICdjcHUnKS5rZXJuZWxGdW5jO1xuICAgICAgICB0Zi5yZWdpc3Rlcktlcm5lbCh7a2VybmVsTmFtZTogJ0FkZCcsIGJhY2tlbmROYW1lOiAnY3B1MScsIGtlcm5lbEZ1bmN9KTtcbiAgICAgICAgdGYucmVnaXN0ZXJLZXJuZWwoe2tlcm5lbE5hbWU6ICdBZGQnLCBiYWNrZW5kTmFtZTogJ2NwdTInLCBrZXJuZWxGdW5jfSk7XG5cbiAgICAgICAgdGYuc2V0QmFja2VuZCgnY3B1MScpO1xuICAgICAgICAvLyBUaGlzIHNjYWxhciBsaXZlcyBpbiBjcHUxLlxuICAgICAgICBjb25zdCBhID0gdGYuc2NhbGFyKDUpO1xuXG4gICAgICAgIHRmLnNldEJhY2tlbmQoJ2NwdTInKTtcbiAgICAgICAgLy8gVGhpcyBzY2FsYXIgbGl2ZXMgaW4gY3B1Mi5cbiAgICAgICAgY29uc3QgYiA9IHRmLnNjYWxhcigzKTtcblxuICAgICAgICAvLyBWZXJpZnkgdGhhdCBvcHMgY2FuIGV4ZWN1dGUgd2l0aCBtaXhlZCBiYWNrZW5kIGRhdGEuXG4gICAgICAgIEVOR0lORS5zdGFydFNjb3BlKCk7XG4gICAgICAgIHRmLnNldEJhY2tlbmQoJ2NwdTEnKTtcbiAgICAgICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgdGYuYWRkKGEsIGIpLmRhdGEoKSwgWzhdKTtcblxuICAgICAgICB0Zi5zZXRCYWNrZW5kKCdjcHUyJyk7XG4gICAgICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHRmLmFkZChhLCBiKS5kYXRhKCksIFs4XSk7XG4gICAgICAgIEVOR0lORS5lbmRTY29wZSgpO1xuXG4gICAgICAgIHRmLmRpc3Bvc2UoW2EsIGJdKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4vKipcbiAqIFRoZSBmb2xsb3dpbmcgdW5pdCB0ZXN0IGlzIGEgc3BlY2lhbCBpbnRlZ3JhdGlvbi1zdHlsZSB0ZXN0IHRoYXQgYXNzdW1lc1xuICogdGhpbmdzIGFib3V0IENQVSAmIFdlYkdMIGJhY2tlbmRzIGJlaW5nIHJlZ2lzdGVyZWQuIFRoaXMgdGVzdHMgZG9lc24ndCBsaXZlXG4gKiBpbiB0aGUgYmFja2VuZCBkaXJlY3RvcnkgYmVjYXVzZSBpdCBpcyB0ZXN0aW5nIGVuZ2luZSByYXRoZXIgdGhhblxuICogYmFja2VuZC1zcGVjaWZpYyBkZXRhaWxzIGJ1dCBuZWVkcyBhIHJlYWwgYmFja2VuZCB0byBleGlzdC4gVGhpcyB0ZXN0IHdpbGxcbiAqIGZhaWwgaWYgdGhlIENQVSBiYWNrZW5kcyBpcyBub3QgcmVnaXN0ZXJlZC4gVGhpcyBpcyBpbnRlbnRpb25hbCwgd2Ugc2hvdWxkXG4gKiBoYXZlIGNvdmVyYWdlIGZvciB3aGVuIHRoZXNlIGJhY2tlbmRzIGFyZSBlbmFibGVkIGFuZCBlbnN1cmUgdGhleSB3b3JrIHdpdGhcbiAqIHRoZSBlbmdpbmUuXG4gKi9cbi8vIFRPRE8oIzU2MzIpOiBSZS1lbmFibGUgdGhlc2UgdGVzdHNcbi8qXG5kZXNjcmliZVdpdGhGbGFncyhcbiAgICAnU3dpdGNoaW5nIFdlYkdMICsgQ1BVIGJhY2tlbmRzJywge1xuICAgICAgcHJlZGljYXRlOiB0ZXN0RW52ID0+IHRlc3RFbnYuYmFja2VuZE5hbWUgPT09ICd3ZWJnbCcgJiZcbiAgICAgICAgICBFTkdJTkUuYmFja2VuZE5hbWVzKCkuaW5kZXhPZignd2ViZ2wnKSAhPT0gLTEgJiZcbiAgICAgICAgICBFTkdJTkUuYmFja2VuZE5hbWVzKCkuaW5kZXhPZignY3B1JykgIT09IC0xXG4gICAgfSxcbiAgICAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgdGYucmVnaXN0ZXJCYWNrZW5kKCd3ZWJnbDEnLCB0Zi5maW5kQmFja2VuZEZhY3RvcnkoJ3dlYmdsJykpO1xuICAgICAgICB0Zi5yZWdpc3RlckJhY2tlbmQoJ3dlYmdsMicsIHRmLmZpbmRCYWNrZW5kRmFjdG9yeSgnd2ViZ2wnKSk7XG4gICAgICAgIHRmLnJlZ2lzdGVyQmFja2VuZCgnY3B1MScsIHRmLmZpbmRCYWNrZW5kRmFjdG9yeSgnY3B1JykpO1xuICAgICAgfSk7XG5cbiAgICAgIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgICAgIHRmLnJlbW92ZUJhY2tlbmQoJ3dlYmdsMScpO1xuICAgICAgICB0Zi5yZW1vdmVCYWNrZW5kKCd3ZWJnbDInKTtcbiAgICAgICAgdGYucmVtb3ZlQmFja2VuZCgnY3B1MScpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdjYW4gZXhlY3V0ZSBvcCB3aXRoIGRhdGEgZnJvbSBtaXhlZCBiYWNrZW5kcycsIGFzeW5jICgpID0+IHtcbiAgICAgICAgdGYuc2V0QmFja2VuZCgnd2ViZ2wxJyk7XG4gICAgICAgIGNvbnN0IGEgPSB0Zi5zY2FsYXIoNSk7XG5cbiAgICAgICAgdGYuc2V0QmFja2VuZCgnd2ViZ2wyJyk7XG4gICAgICAgIGNvbnN0IGIgPSB0Zi5zY2FsYXIoMyk7XG5cbiAgICAgICAgdGYuc2V0QmFja2VuZCgnY3B1MScpO1xuICAgICAgICBjb25zdCBjID0gdGYuc2NhbGFyKDIpO1xuXG4gICAgICAgIC8vIFZlcmlmeSB0aGF0IG9wcyBjYW4gZXhlY3V0ZSB3aXRoIG1peGVkIGJhY2tlbmQgZGF0YS5cbiAgICAgICAgRU5HSU5FLnN0YXJ0U2NvcGUoKTtcbiAgICAgICAgdGYuc2V0QmFja2VuZCgnd2ViZ2wxJyk7XG4gICAgICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHRmLmFkZE4oW2EsIGIsIGNdKS5kYXRhKCksIFsxMF0pO1xuXG4gICAgICAgIHRmLnNldEJhY2tlbmQoJ3dlYmdsMicpO1xuICAgICAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCB0Zi5hZGROKFthLCBiLCBjXSkuZGF0YSgpLCBbMTBdKTtcblxuICAgICAgICB0Zi5zZXRCYWNrZW5kKCdjcHUxJyk7XG4gICAgICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHRmLmFkZE4oW2EsIGIsIGNdKS5kYXRhKCksIFsxMF0pO1xuICAgICAgICBFTkdJTkUuZW5kU2NvcGUoKTtcblxuICAgICAgICBleHBlY3QodGYubWVtb3J5KCkubnVtVGVuc29ycykudG9CZSgzKTtcbiAgICAgICAgZXhwZWN0KHRmLm1lbW9yeSgpLm51bURhdGFCdWZmZXJzKS50b0JlKDMpO1xuXG4gICAgICAgIHRmLmRpc3Bvc2UoW2EsIGIsIGNdKTtcblxuICAgICAgICBleHBlY3QodGYubWVtb3J5KCkubnVtVGVuc29ycykudG9CZSgwKTtcbiAgICAgICAgZXhwZWN0KHRmLm1lbW9yeSgpLm51bURhdGFCdWZmZXJzKS50b0JlKDApO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdmcm9tUGl4ZWxzIHdpdGggbWl4ZWQgYmFja2VuZHMgd29ya3MnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIHRmLnNldEJhY2tlbmQoJ3dlYmdsMScpO1xuICAgICAgICBjb25zdCBhID0gdGYuYnJvd3Nlci5mcm9tUGl4ZWxzKFxuICAgICAgICAgICAgbmV3IEltYWdlRGF0YShuZXcgVWludDhDbGFtcGVkQXJyYXkoWzEsIDIsIDMsIDRdKSwgMSwgMSkpO1xuXG4gICAgICAgIHRmLnNldEJhY2tlbmQoJ3dlYmdsMicpO1xuICAgICAgICBjb25zdCBiID0gdGYuYnJvd3Nlci5mcm9tUGl4ZWxzKFxuICAgICAgICAgICAgbmV3IEltYWdlRGF0YShuZXcgVWludDhDbGFtcGVkQXJyYXkoWzUsIDYsIDcsIDhdKSwgMSwgMSkpO1xuXG4gICAgICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHRmLmFkZChhLCBiKS5kYXRhKCksIFs2LCA4LCAxMF0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaW5nbGUgdGlkeSBtdWx0aXBsZSBiYWNrZW5kcycsICgpID0+IHtcbiAgICAgICAgY29uc3Qga2VybmVsRnVuYyA9IHRmLmdldEtlcm5lbCgnU3F1YXJlJywgJ3dlYmdsJykua2VybmVsRnVuYztcbiAgICAgICAgdGYucmVnaXN0ZXJLZXJuZWwoXG4gICAgICAgICAgICB7a2VybmVsTmFtZTogJ1NxdWFyZScsIGJhY2tlbmROYW1lOiAnd2ViZ2wxJywga2VybmVsRnVuY30pO1xuICAgICAgICB0Zi5yZWdpc3Rlcktlcm5lbChcbiAgICAgICAgICAgIHtrZXJuZWxOYW1lOiAnU3F1YXJlJywgYmFja2VuZE5hbWU6ICd3ZWJnbDInLCBrZXJuZWxGdW5jfSk7XG5cbiAgICAgICAgZXhwZWN0KHRmLm1lbW9yeSgpLm51bVRlbnNvcnMpLnRvQmUoMCk7XG5cbiAgICAgICAgdGYudGlkeSgoKSA9PiB7XG4gICAgICAgICAgdGYuc2V0QmFja2VuZCgnd2ViZ2wxJyk7XG4gICAgICAgICAgY29uc3QgYSA9IHRmLnNjYWxhcigxKTtcbiAgICAgICAgICBhLnNxdWFyZSgpOyAgLy8gVXBsb2FkcyB0byBHUFUuXG5cbiAgICAgICAgICB0Zi5zZXRCYWNrZW5kKCd3ZWJnbDInKTtcbiAgICAgICAgICBjb25zdCBiID0gdGYuc2NhbGFyKDEpO1xuICAgICAgICAgIGIuc3F1YXJlKCk7ICAvLyBVcGxvYWRzIHRvIEdQVS5cblxuICAgICAgICAgIGV4cGVjdCh0Zi5tZW1vcnkoKS5udW1UZW5zb3JzKS50b0JlKDQpO1xuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRmLm1lbW9yeSgpLm51bVRlbnNvcnMpLnRvQmUoMCk7XG5cbiAgICAgICAgdGYudW5yZWdpc3Rlcktlcm5lbCgnU3F1YXJlJywgJ3dlYmdsMScpO1xuICAgICAgICB0Zi51bnJlZ2lzdGVyS2VybmVsKCdTcXVhcmUnLCAnd2ViZ2wyJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiovXG5pbnRlcmZhY2UgVGVzdFN0b3JhZ2UgZXh0ZW5kcyBLZXJuZWxCYWNrZW5kIHtcbiAgaWQ6IG51bWJlcjtcbn1cblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ0RldGVjdHMgbWVtb3J5IGxlYWtzIGluIGtlcm5lbHMnLCBBTExfRU5WUywgKCkgPT4ge1xuICBjb25zdCBiYWNrZW5kTmFtZSA9ICd0ZXN0LW1lbSc7XG4gIGNvbnN0IGtlcm5lbE5hbWUgPSAnTXlLZXJuZWwnO1xuICBjb25zdCBrZXJuZWxOYW1lQ29tcGxleCA9ICdLZXJuZWwtY29tcGxleCc7XG5cbiAgaXQoJ0RldGVjdHMgbWVtb3J5IGxlYWsgaW4gYSBrZXJuZWwnLCAoKSA9PiB7XG4gICAgbGV0IGRhdGFJZHNDb3VudCA9IDA7XG4gICAgdGYucmVnaXN0ZXJCYWNrZW5kKGJhY2tlbmROYW1lLCAoKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogMSxcbiAgICAgICAgZGlzcG9zZTogKCkgPT4gbnVsbCxcbiAgICAgICAgZGlzcG9zZURhdGE6IChkYXRhSWQ6IHt9KSA9PiBudWxsLFxuICAgICAgICBudW1EYXRhSWRzOiAoKSA9PiBkYXRhSWRzQ291bnRcbiAgICAgIH0gYXMgVGVzdFN0b3JhZ2U7XG4gICAgfSk7XG5cbiAgICBjb25zdCBrZXJuZWxXaXRoTWVtTGVhazogS2VybmVsRnVuYyA9ICgpID0+IHtcbiAgICAgIGRhdGFJZHNDb3VudCArPSAyO1xuICAgICAgcmV0dXJuIHtkYXRhSWQ6IHt9LCBzaGFwZTogW10sIGR0eXBlOiAnZmxvYXQzMid9O1xuICAgIH07XG4gICAgdGYucmVnaXN0ZXJLZXJuZWwoe2tlcm5lbE5hbWUsIGJhY2tlbmROYW1lLCBrZXJuZWxGdW5jOiBrZXJuZWxXaXRoTWVtTGVha30pO1xuXG4gICAgdGYuc2V0QmFja2VuZChiYWNrZW5kTmFtZSk7XG4gICAgZXhwZWN0KCgpID0+IHRmLmVuZ2luZSgpLnJ1bktlcm5lbChrZXJuZWxOYW1lLCB7fSwge30pKVxuICAgICAgICAudG9UaHJvd0Vycm9yKFxuICAgICAgICAgICAgL0JhY2tlbmQgJ3Rlc3QtbWVtJyBoYXMgYW4gaW50ZXJuYWwgbWVtb3J5IGxlYWsgXFwoMSBkYXRhIGlkc1xcKS8pO1xuXG4gICAgdGYucmVtb3ZlQmFja2VuZChiYWNrZW5kTmFtZSk7XG4gICAgdGYudW5yZWdpc3Rlcktlcm5lbChrZXJuZWxOYW1lLCBiYWNrZW5kTmFtZSk7XG4gIH0pO1xuXG4gIGl0KCdObyBtZW0gbGVhayBpbiBhIGtlcm5lbCB3aXRoIG11bHRpcGxlIG91dHB1dHMnLCAoKSA9PiB7XG4gICAgbGV0IGRhdGFJZHNDb3VudCA9IDA7XG4gICAgdGYucmVnaXN0ZXJCYWNrZW5kKGJhY2tlbmROYW1lLCAoKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogMSxcbiAgICAgICAgZGlzcG9zZTogKCkgPT4gbnVsbCxcbiAgICAgICAgZGlzcG9zZURhdGE6IChkYXRhSWQ6IHt9KSA9PiBudWxsLFxuICAgICAgICBudW1EYXRhSWRzOiAoKSA9PiBkYXRhSWRzQ291bnRcbiAgICAgIH0gYXMgVGVzdFN0b3JhZ2U7XG4gICAgfSk7XG4gICAgdGYuc2V0QmFja2VuZChiYWNrZW5kTmFtZSk7XG5cbiAgICBjb25zdCBrZXJuZWxXaXRoM091dHB1dHM6IEtlcm5lbEZ1bmMgPSAoKSA9PiB7XG4gICAgICBkYXRhSWRzQ291bnQgKz0gMztcbiAgICAgIGNvbnN0IHQ6IFRlbnNvckluZm8gPSB7ZGF0YUlkOiB7fSwgc2hhcGU6IFtdLCBkdHlwZTogJ2Zsb2F0MzInfTtcbiAgICAgIHJldHVybiBbdCwgdCwgdF07XG4gICAgfTtcbiAgICB0Zi5yZWdpc3Rlcktlcm5lbChcbiAgICAgICAge2tlcm5lbE5hbWUsIGJhY2tlbmROYW1lLCBrZXJuZWxGdW5jOiBrZXJuZWxXaXRoM091dHB1dHN9KTtcblxuICAgIGNvbnN0IHJlcyA9IHRmLmVuZ2luZSgpLnJ1bktlcm5lbChrZXJuZWxOYW1lLCB7fSwge30pO1xuICAgIGV4cGVjdChBcnJheS5pc0FycmF5KHJlcykpLnRvQmUodHJ1ZSk7XG4gICAgZXhwZWN0KChyZXMgYXMgQXJyYXk8e30+KS5sZW5ndGgpLnRvQmUoMyk7XG5cbiAgICBjb25zdCBrZXJuZWxXaXRoQ29tcGxleE91dHB1dHM6IEtlcm5lbEZ1bmMgPSAoKSA9PiB7XG4gICAgICBkYXRhSWRzQ291bnQgKz0gMztcbiAgICAgIHJldHVybiB7ZGF0YUlkOiB7fSwgc2hhcGU6IFtdLCBkdHlwZTogJ2NvbXBsZXg2NCd9O1xuICAgIH07XG4gICAgdGYucmVnaXN0ZXJLZXJuZWwoe1xuICAgICAga2VybmVsTmFtZToga2VybmVsTmFtZUNvbXBsZXgsXG4gICAgICBiYWNrZW5kTmFtZSxcbiAgICAgIGtlcm5lbEZ1bmM6IGtlcm5lbFdpdGhDb21wbGV4T3V0cHV0c1xuICAgIH0pO1xuXG4gICAgY29uc3QgcmVzMiA9IHRmLmVuZ2luZSgpLnJ1bktlcm5lbChrZXJuZWxOYW1lQ29tcGxleCwge30sIHt9KSBhcyBUZW5zb3JJbmZvO1xuICAgIGV4cGVjdChyZXMyLnNoYXBlKS50b0VxdWFsKFtdKTtcbiAgICBleHBlY3QocmVzMi5kdHlwZSkudG9FcXVhbCgnY29tcGxleDY0Jyk7XG5cbiAgICB0Zi5yZW1vdmVCYWNrZW5kKGJhY2tlbmROYW1lKTtcbiAgICB0Zi51bnJlZ2lzdGVyS2VybmVsKGtlcm5lbE5hbWUsIGJhY2tlbmROYW1lKTtcbiAgICB0Zi51bnJlZ2lzdGVyS2VybmVsKGtlcm5lbE5hbWVDb21wbGV4LCBiYWNrZW5kTmFtZSk7XG4gIH0pO1xufSk7XG5cbi8vIE5PVEU6IFRoaXMgZGVzY3JpYmUgaXMgcHVycG9zZWZ1bGx5IG5vdCBhIGRlc2NyaWJlV2l0aEZsYWdzIHNvIHRoYXQgd2Vcbi8vIHRlc3QgdGVuc29yIGFsbG9jYXRpb24gd2hlcmUgbm8gc2NvcGVzIGhhdmUgYmVlbiBjcmVhdGVkLlxuZGVzY3JpYmUoJ01lbW9yeSBhbGxvY2F0aW9uIG91dHNpZGUgYSB0ZXN0IHNjb3BlJywgKCkgPT4ge1xuICBpdCgnY29uc3RydWN0aW5nIGEgdGVuc29yIHdvcmtzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGJhY2tlbmROYW1lID0gJ3Rlc3QtYmFja2VuZCc7XG4gICAgdGYucmVnaXN0ZXJCYWNrZW5kKGJhY2tlbmROYW1lLCAoKSA9PiB7XG4gICAgICBsZXQgc3RvcmVkVmFsdWVzOiBCYWNrZW5kVmFsdWVzID0gbnVsbDtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiAxLFxuICAgICAgICBmbG9hdFByZWNpc2lvbjogKCkgPT4gMzIsXG4gICAgICAgIHdyaXRlOiAodmFsdWVzOiBCYWNrZW5kVmFsdWVzLCBzaGFwZTogbnVtYmVyW10sIGR0eXBlOiBEYXRhVHlwZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGRhdGFJZCA9IHt9O1xuICAgICAgICAgIHN0b3JlZFZhbHVlcyA9IHZhbHVlcztcbiAgICAgICAgICByZXR1cm4gZGF0YUlkO1xuICAgICAgICB9LFxuICAgICAgICByZWFkOiBhc3luYyAoZGF0YUlkOiBvYmplY3QpID0+IHN0b3JlZFZhbHVlcyxcbiAgICAgICAgZGlzcG9zZTogKCkgPT4gbnVsbCxcbiAgICAgICAgZGlzcG9zZURhdGE6IChkYXRhSWQ6IHt9KSA9PiBudWxsXG4gICAgICB9IGFzIFRlc3RTdG9yYWdlO1xuICAgIH0pO1xuICAgIHRmLnNldEJhY2tlbmQoYmFja2VuZE5hbWUpO1xuXG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYS5kYXRhKCksIFsxLCAyLCAzXSk7XG4gICAgYS5kaXNwb3NlKCk7XG5cbiAgICB0Zi5yZW1vdmVCYWNrZW5kKGJhY2tlbmROYW1lKTtcbiAgfSk7XG59KTtcbiJdfQ==