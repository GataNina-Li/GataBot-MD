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
/**
 * Unit tests for indexed_db.ts.
 */
import * as tf from '../index';
import { BROWSER_ENVS, describeWithFlags, runWithLock } from '../jasmine_util';
import { expectArrayBuffersEqual } from '../test_util';
import { browserIndexedDB, BrowserIndexedDB, BrowserIndexedDBManager, deleteDatabase, indexedDBRouter } from './indexed_db';
describeWithFlags('IndexedDB', BROWSER_ENVS, () => {
    // Test data.
    const modelTopology1 = {
        'class_name': 'Sequential',
        'keras_version': '2.1.4',
        'config': [{
                'class_name': 'Dense',
                'config': {
                    'kernel_initializer': {
                        'class_name': 'VarianceScaling',
                        'config': {
                            'distribution': 'uniform',
                            'scale': 1.0,
                            'seed': null,
                            'mode': 'fan_avg'
                        }
                    },
                    'name': 'dense',
                    'kernel_constraint': null,
                    'bias_regularizer': null,
                    'bias_constraint': null,
                    'dtype': 'float32',
                    'activation': 'linear',
                    'trainable': true,
                    'kernel_regularizer': null,
                    'bias_initializer': { 'class_name': 'Zeros', 'config': {} },
                    'units': 1,
                    'batch_input_shape': [null, 3],
                    'use_bias': true,
                    'activity_regularizer': null
                }
            }],
        'backend': 'tensorflow'
    };
    const weightSpecs1 = [
        {
            name: 'dense/kernel',
            shape: [3, 1],
            dtype: 'float32',
        },
        {
            name: 'dense/bias',
            shape: [1],
            dtype: 'float32',
        }
    ];
    const weightData1 = new ArrayBuffer(16);
    const artifacts1 = {
        modelTopology: modelTopology1,
        weightSpecs: weightSpecs1,
        weightData: weightData1,
        format: 'layers-model',
        generatedBy: 'TensorFlow.js v0.0.0',
        convertedBy: null,
        modelInitializer: {}
    };
    const weightSpecs2 = [
        {
            name: 'dense/new_kernel',
            shape: [5, 1],
            dtype: 'float32',
        },
        {
            name: 'dense/new_bias',
            shape: [1],
            dtype: 'float32',
        }
    ];
    beforeEach(deleteDatabase);
    afterEach(deleteDatabase);
    it('Save-load round trip', runWithLock(async () => {
        const testStartDate = new Date();
        const handler = tf.io.getSaveHandlers('indexeddb://FooModel')[0];
        const saveResult = await handler.save(artifacts1);
        expect(saveResult.modelArtifactsInfo.dateSaved.getTime())
            .toBeGreaterThanOrEqual(testStartDate.getTime());
        // Note: The following two assertions work only because there is no
        //   non-ASCII characters in `modelTopology1` and `weightSpecs1`.
        expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
            .toEqual(JSON.stringify(modelTopology1).length);
        expect(saveResult.modelArtifactsInfo.weightSpecsBytes)
            .toEqual(JSON.stringify(weightSpecs1).length);
        expect(saveResult.modelArtifactsInfo.weightDataBytes)
            .toEqual(weightData1.byteLength);
        const loadedArtifacts = await handler.load();
        expect(loadedArtifacts.modelTopology).toEqual(modelTopology1);
        expect(loadedArtifacts.weightSpecs).toEqual(weightSpecs1);
        expect(loadedArtifacts.format).toEqual('layers-model');
        expect(loadedArtifacts.generatedBy).toEqual('TensorFlow.js v0.0.0');
        expect(loadedArtifacts.convertedBy).toEqual(null);
        expect(loadedArtifacts.modelInitializer).toEqual({});
        expectArrayBuffersEqual(loadedArtifacts.weightData, weightData1);
    }));
    it('Save two models and load one', runWithLock(async () => {
        const weightData2 = new ArrayBuffer(24);
        const artifacts2 = {
            modelTopology: modelTopology1,
            weightSpecs: weightSpecs2,
            weightData: weightData2,
        };
        const handler1 = tf.io.getSaveHandlers('indexeddb://Model/1')[0];
        const saveResult1 = await handler1.save(artifacts1);
        // Note: The following two assertions work only because there is no
        // non-ASCII characters in `modelTopology1` and `weightSpecs1`.
        expect(saveResult1.modelArtifactsInfo.modelTopologyBytes)
            .toEqual(JSON.stringify(modelTopology1).length);
        expect(saveResult1.modelArtifactsInfo.weightSpecsBytes)
            .toEqual(JSON.stringify(weightSpecs1).length);
        expect(saveResult1.modelArtifactsInfo.weightDataBytes)
            .toEqual(weightData1.byteLength);
        const handler2 = tf.io.getSaveHandlers('indexeddb://Model/2')[0];
        const saveResult2 = await handler2.save(artifacts2);
        expect(saveResult2.modelArtifactsInfo.dateSaved.getTime())
            .toBeGreaterThanOrEqual(saveResult1.modelArtifactsInfo.dateSaved.getTime());
        // Note: The following two assertions work only because there is
        // no non-ASCII characters in `modelTopology1` and
        // `weightSpecs1`.
        expect(saveResult2.modelArtifactsInfo.modelTopologyBytes)
            .toEqual(JSON.stringify(modelTopology1).length);
        expect(saveResult2.modelArtifactsInfo.weightSpecsBytes)
            .toEqual(JSON.stringify(weightSpecs2).length);
        expect(saveResult2.modelArtifactsInfo.weightDataBytes)
            .toEqual(weightData2.byteLength);
        const loadedArtifacts = await handler1.load();
        expect(loadedArtifacts.modelTopology).toEqual(modelTopology1);
        expect(loadedArtifacts.weightSpecs).toEqual(weightSpecs1);
        expectArrayBuffersEqual(loadedArtifacts.weightData, weightData1);
    }));
    it('Loading nonexistent model fails', runWithLock(async () => {
        const handler = tf.io.getSaveHandlers('indexeddb://NonexistentModel')[0];
        try {
            await handler.load();
            fail('Loading nonexistent model from IndexedDB succeeded unexpectly');
        }
        catch (err) {
            expect(err.message)
                .toEqual('Cannot find model ' +
                'with path \'NonexistentModel\' in IndexedDB.');
        }
    }));
    it('Null, undefined or empty modelPath throws Error', () => {
        expect(() => browserIndexedDB(null))
            .toThrowError(/IndexedDB, modelPath must not be null, undefined or empty/);
        expect(() => browserIndexedDB(undefined))
            .toThrowError(/IndexedDB, modelPath must not be null, undefined or empty/);
        expect(() => browserIndexedDB(''))
            .toThrowError(/IndexedDB, modelPath must not be null, undefined or empty./);
    });
    it('router', () => {
        expect(indexedDBRouter('indexeddb://bar') instanceof BrowserIndexedDB)
            .toEqual(true);
        expect(indexedDBRouter('localstorage://bar')).toBeNull();
        expect(indexedDBRouter('qux')).toBeNull();
    });
    it('Manager: List models: 0 result', runWithLock(async () => {
        // Before any model is saved, listModels should return empty result.
        const models = await new BrowserIndexedDBManager().listModels();
        expect(models).toEqual({});
    }));
    it('Manager: List models: 1 result', runWithLock(async () => {
        const handler = tf.io.getSaveHandlers('indexeddb://baz/QuxModel')[0];
        const saveResult = await handler.save(artifacts1);
        // After successful saving, there should be one model.
        const models = await new BrowserIndexedDBManager().listModels();
        expect(Object.keys(models).length).toEqual(1);
        expect(models['baz/QuxModel'].modelTopologyType)
            .toEqual(saveResult.modelArtifactsInfo.modelTopologyType);
        expect(models['baz/QuxModel'].modelTopologyBytes)
            .toEqual(saveResult.modelArtifactsInfo.modelTopologyBytes);
        expect(models['baz/QuxModel'].weightSpecsBytes)
            .toEqual(saveResult.modelArtifactsInfo.weightSpecsBytes);
        expect(models['baz/QuxModel'].weightDataBytes)
            .toEqual(saveResult.modelArtifactsInfo.weightDataBytes);
    }));
    it('Manager: List models: 2 results', runWithLock(async () => {
        // First, save a model.
        const handler1 = tf.io.getSaveHandlers('indexeddb://QuxModel')[0];
        const saveResult1 = await handler1.save(artifacts1);
        // Then, save the model under another path.
        const handler2 = tf.io.getSaveHandlers('indexeddb://repeat/QuxModel')[0];
        const saveResult2 = await handler2.save(artifacts1);
        // After successful saving, there should be two models.
        const models = await new BrowserIndexedDBManager().listModels();
        expect(Object.keys(models).length).toEqual(2);
        expect(models['QuxModel'].modelTopologyType)
            .toEqual(saveResult1.modelArtifactsInfo.modelTopologyType);
        expect(models['QuxModel'].modelTopologyBytes)
            .toEqual(saveResult1.modelArtifactsInfo.modelTopologyBytes);
        expect(models['QuxModel'].weightSpecsBytes)
            .toEqual(saveResult1.modelArtifactsInfo.weightSpecsBytes);
        expect(models['QuxModel'].weightDataBytes)
            .toEqual(saveResult1.modelArtifactsInfo.weightDataBytes);
        expect(models['repeat/QuxModel'].modelTopologyType)
            .toEqual(saveResult2.modelArtifactsInfo.modelTopologyType);
        expect(models['repeat/QuxModel'].modelTopologyBytes)
            .toEqual(saveResult2.modelArtifactsInfo.modelTopologyBytes);
        expect(models['repeat/QuxModel'].weightSpecsBytes)
            .toEqual(saveResult2.modelArtifactsInfo.weightSpecsBytes);
        expect(models['repeat/QuxModel'].weightDataBytes)
            .toEqual(saveResult2.modelArtifactsInfo.weightDataBytes);
    }));
    it('Manager: Successful removeModel', runWithLock(async () => {
        // First, save a model.
        const handler1 = tf.io.getSaveHandlers('indexeddb://QuxModel')[0];
        await handler1.save(artifacts1);
        // Then, save the model under another path.
        const handler2 = tf.io.getSaveHandlers('indexeddb://repeat/QuxModel')[0];
        await handler2.save(artifacts1);
        // After successful saving, delete the first save, and then
        // `listModel` should give only one result.
        const manager = new BrowserIndexedDBManager();
        await manager.removeModel('QuxModel');
        const models = await manager.listModels();
        expect(Object.keys(models)).toEqual(['repeat/QuxModel']);
    }));
    it('Manager: Successful removeModel with URL scheme', runWithLock(async () => {
        // First, save a model.
        const handler1 = tf.io.getSaveHandlers('indexeddb://QuxModel')[0];
        await handler1.save(artifacts1);
        // Then, save the model under another path.
        const handler2 = tf.io.getSaveHandlers('indexeddb://repeat/QuxModel')[0];
        await handler2.save(artifacts1);
        // After successful saving, delete the first save, and then
        // `listModel` should give only one result.
        const manager = new BrowserIndexedDBManager();
        // Delete a model specified with a path that includes the
        // indexeddb:// scheme prefix should work.
        manager.removeModel('indexeddb://QuxModel');
        const models = await manager.listModels();
        expect(Object.keys(models)).toEqual(['repeat/QuxModel']);
    }));
    it('Manager: Failed removeModel', runWithLock(async () => {
        try {
            // Attempt to delete a nonexistent model is expected to fail.
            await new BrowserIndexedDBManager().removeModel('nonexistent');
            fail('Deleting nonexistent model succeeded unexpectedly.');
        }
        catch (err) {
            expect(err.message)
                .toEqual('Cannot find model with path \'nonexistent\' in IndexedDB.');
        }
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhlZF9kYl90ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9pby9pbmRleGVkX2RiX3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUg7O0dBRUc7QUFFSCxPQUFPLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMvQixPQUFPLEVBQUMsWUFBWSxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdFLE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUNyRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsdUJBQXVCLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUUxSCxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLEdBQUcsRUFBRTtJQUNoRCxhQUFhO0lBQ2IsTUFBTSxjQUFjLEdBQU87UUFDekIsWUFBWSxFQUFFLFlBQVk7UUFDMUIsZUFBZSxFQUFFLE9BQU87UUFDeEIsUUFBUSxFQUFFLENBQUM7Z0JBQ1QsWUFBWSxFQUFFLE9BQU87Z0JBQ3JCLFFBQVEsRUFBRTtvQkFDUixvQkFBb0IsRUFBRTt3QkFDcEIsWUFBWSxFQUFFLGlCQUFpQjt3QkFDL0IsUUFBUSxFQUFFOzRCQUNSLGNBQWMsRUFBRSxTQUFTOzRCQUN6QixPQUFPLEVBQUUsR0FBRzs0QkFDWixNQUFNLEVBQUUsSUFBSTs0QkFDWixNQUFNLEVBQUUsU0FBUzt5QkFDbEI7cUJBQ0Y7b0JBQ0QsTUFBTSxFQUFFLE9BQU87b0JBQ2YsbUJBQW1CLEVBQUUsSUFBSTtvQkFDekIsa0JBQWtCLEVBQUUsSUFBSTtvQkFDeEIsaUJBQWlCLEVBQUUsSUFBSTtvQkFDdkIsT0FBTyxFQUFFLFNBQVM7b0JBQ2xCLFlBQVksRUFBRSxRQUFRO29CQUN0QixXQUFXLEVB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QUFNLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFaEMsMkRBQTJEO1FBQzNELDJDQUEyQztRQUMzQyxNQUFNLE9BQU8sR0FBRyxJQUFJLHVCQUF1QixFQUFFLENBQUM7UUFFOUMseURBQXlEO1FBQ3pELDBDQUEwQztRQUMxQyxPQUFPLENBQUMsV0FBVyxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFFNUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDMUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7SUFDM0QsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVQLEVBQUUsQ0FBQyw2QkFBNkIsRUFBRSxXQUFXLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDcEQsSUFBSTtZQUNGLDZEQUE2RDtZQUM3RCxNQUFNLElBQUksdUJBQXVCLEVBQUUsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDL0QsSUFBSSxDQUFDLG9EQUFvRCxDQUFDLENBQUM7U0FDNUQ7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO2lCQUNkLE9BQU8sQ0FDSiwyREFBMkQsQ0FBQyxDQUFDO1NBQ3RFO0lBQ0gsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNULENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG4vKipcbiAqIFVuaXQgdGVzdHMgZm9yIGluZGV4ZWRfZGIudHMuXG4gKi9cblxuaW1wb3J0ICogYXMgdGYgZnJvbSAnLi4vaW5kZXgnO1xuaW1wb3J0IHtCUk9XU0VSX0VOVlMsIGRlc2NyaWJlV2l0aEZsYWdzLCBydW5XaXRoTG9ja30gZnJvbSAnLi4vamFzbWluZV91dGlsJztcbmltcG9ydCB7ZXhwZWN0QXJyYXlCdWZmZXJzRXF1YWx9IGZyb20gJy4uL3Rlc3RfdXRpbCc7XG5pbXBvcnQge2Jyb3dzZXJJbmRleGVkREIsIEJyb3dzZXJJbmRleGVkREIsIEJyb3dzZXJJbmRleGVkREJNYW5hZ2VyLCBkZWxldGVEYXRhYmFzZSwgaW5kZXhlZERCUm91dGVyfSBmcm9tICcuL2luZGV4ZWRfZGInO1xuXG5kZXNjcmliZVdpdGhGbGFncygnSW5kZXhlZERCJywgQlJPV1NFUl9FTlZTLCAoKSA9PiB7XG4gIC8vIFRlc3QgZGF0YS5cbiAgY29uc3QgbW9kZWxUb3BvbG9neTE6IHt9ID0ge1xuICAgICdjbGFzc19uYW1lJzogJ1NlcXVlbnRpYWwnLFxuICAgICdrZXJhc192ZXJzaW9uJzogJzIuMS40JyxcbiAgICAnY29uZmlnJzogW3tcbiAgICAgICdjbGFzc19uYW1lJzogJ0RlbnNlJyxcbiAgICAgICdjb25maWcnOiB7XG4gICAgICAgICdrZXJuZWxfaW5pdGlhbGl6ZXInOiB7XG4gICAgICAgICAgJ2NsYXNzX25hbWUnOiAnVmFyaWFuY2VTY2FsaW5nJyxcbiAgICAgICAgICAnY29uZmlnJzoge1xuICAgICAgICAgICAgJ2Rpc3RyaWJ1dGlvbic6ICd1bmlmb3JtJyxcbiAgICAgICAgICAgICdzY2FsZSc6IDEuMCxcbiAgICAgICAgICAgICdzZWVkJzogbnVsbCxcbiAgICAgICAgICAgICdtb2RlJzogJ2Zhbl9hdmcnXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAnbmFtZSc6ICdkZW5zZScsXG4gICAgICAgICdrZXJuZWxfY29uc3RyYWludCc6IG51bGwsXG4gICAgICAgICdiaWFzX3JlZ3VsYXJpemVyJzogbnVsbCxcbiAgICAgICAgJ2JpYXNfY29uc3RyYWludCc6IG51bGwsXG4gICAgICAgICdkdHlwZSc6ICdmbG9hdDMyJyxcbiAgICAgICAgJ2FjdGl2YXRpb24nOiAnbGluZWFyJyxcbiAgICAgICAgJ3RyYWluYWJsZSc6IHRydWUsXG4gICAgICAgICdrZXJuZWxfcmVndWxhcml6ZXInOiBudWxsLFxuICAgICAgICAnYmlhc19pbml0aWFsaXplcic6IHsnY2xhc3NfbmFtZSc6ICdaZXJvcycsICdjb25maWcnOiB7fX0sXG4gICAgICAgICd1bml0cyc6IDEsXG4gICAgICAgICdiYXRjaF9pbnB1dF9zaGFwZSc6IFtudWxsLCAzXSxcbiAgICAgICAgJ3VzZV9iaWFzJzogdHJ1ZSxcbiAgICAgICAgJ2FjdGl2aXR5X3JlZ3VsYXJpemVyJzogbnVsbFxuICAgICAgfVxuICAgIH1dLFxuICAgICdiYWNrZW5kJzogJ3RlbnNvcmZsb3cnXG4gIH07XG4gIGNvbnN0IHdlaWdodFNwZWNzMTogdGYuaW8uV2VpZ2h0c01hbmlmZXN0RW50cnlbXSA9IFtcbiAgICB7XG4gICAgICBuYW1lOiAnZGVuc2Uva2VybmVsJyxcbiAgICAgIHNoYXBlOiBbMywgMV0sXG4gICAgICBkdHlwZTogJ2Zsb2F0MzInLFxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ2RlbnNlL2JpYXMnLFxuICAgICAgc2hhcGU6IFsxXSxcbiAgICAgIGR0eXBlOiAnZmxvYXQzMicsXG4gICAgfVxuICBdO1xuICBjb25zdCB3ZWlnaHREYXRhMSA9IG5ldyBBcnJheUJ1ZmZlcigxNik7XG4gIGNvbnN0IGFydGlmYWN0czE6IHRmLmlvLk1vZGVsQXJ0aWZhY3RzID0ge1xuICAgIG1vZGVsVG9wb2xvZ3k6IG1vZGVsVG9wb2xvZ3kxLFxuICAgIHdlaWdodFNwZWNzOiB3ZWlnaHRTcGVjczEsXG4gICAgd2VpZ2h0RGF0YTogd2VpZ2h0RGF0YTEsXG4gICAgZm9ybWF0OiAnbGF5ZXJzLW1vZGVsJyxcbiAgICBnZW5lcmF0ZWRCeTogJ1RlbnNvckZsb3cuanMgdjAuMC4wJyxcbiAgICBjb252ZXJ0ZWRCeTogbnVsbCxcbiAgICBtb2RlbEluaXRpYWxpemVyOiB7fVxuICB9O1xuXG4gIGNvbnN0IHdlaWdodFNwZWNzMjogdGYuaW8uV2VpZ2h0c01hbmlmZXN0RW50cnlbXSA9IFtcbiAgICB7XG4gICAgICBuYW1lOiAnZGVuc2UvbmV3X2tlcm5lbCcsXG4gICAgICBzaGFwZTogWzUsIDFdLFxuICAgICAgZHR5cGU6ICdmbG9hdDMyJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdkZW5zZS9uZXdfYmlhcycsXG4gICAgICBzaGFwZTogWzFdLFxuICAgICAgZHR5cGU6ICdmbG9hdDMyJyxcbiAgICB9XG4gIF07XG5cbiAgYmVmb3JlRWFjaChkZWxldGVEYXRhYmFzZSk7XG5cbiAgYWZ0ZXJFYWNoKGRlbGV0ZURhdGFiYXNlKTtcblxuICBpdCgnU2F2ZS1sb2FkIHJvdW5kIHRyaXAnLCBydW5XaXRoTG9jayhhc3luYyAoKSA9PiB7XG4gICAgICAgY29uc3QgdGVzdFN0YXJ0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgY29uc3QgaGFuZGxlciA9IHRmLmlvLmdldFNhdmVIYW5kbGVycygnaW5kZXhlZGRiOi8vRm9vTW9kZWwnKVswXTtcblxuICAgICAgIGNvbnN0IHNhdmVSZXN1bHQgPSBhd2FpdCBoYW5kbGVyLnNhdmUoYXJ0aWZhY3RzMSk7XG4gICAgICAgZXhwZWN0KHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvLmRhdGVTYXZlZC5nZXRUaW1lKCkpXG4gICAgICAgICAgIC50b0JlR3JlYXRlclRoYW5PckVxdWFsKHRlc3RTdGFydERhdGUuZ2V0VGltZSgpKTtcbiAgICAgICAvLyBOb3RlOiBUaGUgZm9sbG93aW5nIHR3byBhc3NlcnRpb25zIHdvcmsgb25seSBiZWNhdXNlIHRoZXJlIGlzIG5vXG4gICAgICAgLy8gICBub24tQVNDSUkgY2hhcmFjdGVycyBpbiBgbW9kZWxUb3BvbG9neTFgIGFuZCBgd2VpZ2h0U3BlY3MxYC5cbiAgICAgICBleHBlY3Qoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8ubW9kZWxUb3BvbG9neUJ5dGVzKVxuICAgICAgICAgICAudG9FcXVhbChKU09OLnN0cmluZ2lmeShtb2RlbFRvcG9sb2d5MSkubGVuZ3RoKTtcbiAgICAgICBleHBlY3Qoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8ud2VpZ2h0U3BlY3NCeXRlcylcbiAgICAgICAgICAgLnRvRXF1YWwoSlNPTi5zdHJpbmdpZnkod2VpZ2h0U3BlY3MxKS5sZW5ndGgpO1xuICAgICAgIGV4cGVjdChzYXZlUmVzdWx0Lm1vZGVsQXJ0aWZhY3RzSW5mby53ZWlnaHREYXRhQnl0ZXMpXG4gICAgICAgICAgIC50b0VxdWFsKHdlaWdodERhdGExLmJ5dGVMZW5ndGgpO1xuXG4gICAgICAgY29uc3QgbG9hZGVkQXJ0aWZhY3RzID0gYXdhaXQgaGFuZGxlci5sb2FkKCk7XG4gICAgICAgZXhwZWN0KGxvYWRlZEFydGlmYWN0cy5tb2RlbFRvcG9sb2d5KS50b0VxdWFsKG1vZGVsVG9wb2xvZ3kxKTtcbiAgICAgICBleHBlY3QobG9hZGVkQXJ0aWZhY3RzLndlaWdodFNwZWNzKS50b0VxdWFsKHdlaWdodFNwZWNzMSk7XG4gICAgICAgZXhwZWN0KGxvYWRlZEFydGlmYWN0cy5mb3JtYXQpLnRvRXF1YWwoJ2xheWVycy1tb2RlbCcpO1xuICAgICAgIGV4cGVjdChsb2FkZWRBcnRpZmFjdHMuZ2VuZXJhdGVkQnkpLnRvRXF1YWwoJ1RlbnNvckZsb3cuanMgdjAuMC4wJyk7XG4gICAgICAgZXhwZWN0KGxvYWRlZEFydGlmYWN0cy5jb252ZXJ0ZWRCeSkudG9FcXVhbChudWxsKTtcbiAgICAgICBleHBlY3QobG9hZGVkQXJ0aWZhY3RzLm1vZGVsSW5pdGlhbGl6ZXIpLnRvRXF1YWwoe30pO1xuICAgICAgIGV4cGVjdEFycmF5QnVmZmVyc0VxdWFsKGxvYWRlZEFydGlmYWN0cy53ZWlnaHREYXRhLCB3ZWlnaHREYXRhMSk7XG4gICAgIH0pKTtcblxuICBpdCgnU2F2ZSB0d28gbW9kZWxzIGFuZCBsb2FkIG9uZScsIHJ1bldpdGhMb2NrKGFzeW5jICgpID0+IHtcbiAgICAgICBjb25zdCB3ZWlnaHREYXRhMiA9IG5ldyBBcnJheUJ1ZmZlcigyNCk7XG4gICAgICAgY29uc3QgYXJ0aWZhY3RzMjogdGYuaW8uTW9kZWxBcnRpZmFjdHMgPSB7XG4gICAgICAgICBtb2RlbFRvcG9sb2d5OiBtb2RlbFRvcG9sb2d5MSxcbiAgICAgICAgIHdlaWdodFNwZWNzOiB3ZWlnaHRTcGVjczIsXG4gICAgICAgICB3ZWlnaHREYXRhOiB3ZWlnaHREYXRhMixcbiAgICAgICB9O1xuICAgICAgIGNvbnN0IGhhbmRsZXIxID0gdGYuaW8uZ2V0U2F2ZUhhbmRsZXJzKCdpbmRleGVkZGI6Ly9Nb2RlbC8xJylbMF07XG4gICAgICAgY29uc3Qgc2F2ZVJlc3VsdDEgPSBhd2FpdCBoYW5kbGVyMS5zYXZlKGFydGlmYWN0czEpO1xuICAgICAgIC8vIE5vdGU6IFRoZSBmb2xsb3dpbmcgdHdvIGFzc2VydGlvbnMgd29yayBvbmx5IGJlY2F1c2UgdGhlcmUgaXMgbm9cbiAgICAgICAvLyBub24tQVNDSUkgY2hhcmFjdGVycyBpbiBgbW9kZWxUb3BvbG9neTFgIGFuZCBgd2VpZ2h0U3BlY3MxYC5cbiAgICAgICBleHBlY3Qoc2F2ZVJlc3VsdDEubW9kZWxBcnRpZmFjdHNJbmZvLm1vZGVsVG9wb2xvZ3lCeXRlcylcbiAgICAgICAgICAgLnRvRXF1YWwoSlNPTi5zdHJpbmdpZnkobW9kZWxUb3BvbG9neTEpLmxlbmd0aCk7XG4gICAgICAgZXhwZWN0KHNhdmVSZXN1bHQxLm1vZGVsQXJ0aWZhY3RzSW5mby53ZWlnaHRTcGVjc0J5dGVzKVxuICAgICAgICAgICAudG9FcXVhbChKU09OLnN0cmluZ2lmeSh3ZWlnaHRTcGVjczEpLmxlbmd0aCk7XG4gICAgICAgZXhwZWN0KHNhdmVSZXN1bHQxLm1vZGVsQXJ0aWZhY3RzSW5mby53ZWlnaHREYXRhQnl0ZXMpXG4gICAgICAgICAgIC50b0VxdWFsKHdlaWdodERhdGExLmJ5dGVMZW5ndGgpO1xuXG4gICAgICAgY29uc3QgaGFuZGxlcjIgPSB0Zi5pby5nZXRTYXZlSGFuZGxlcnMoJ2luZGV4ZWRkYjovL01vZGVsLzInKVswXTtcbiAgICAgICBjb25zdCBzYXZlUmVzdWx0MiA9IGF3YWl0IGhhbmRsZXIyLnNhdmUoYXJ0aWZhY3RzMik7XG4gICAgICAgZXhwZWN0KHNhdmVSZXN1bHQyLm1vZGVsQXJ0aWZhY3RzSW5mby5kYXRlU2F2ZWQuZ2V0VGltZSgpKVxuICAgICAgICAgICAudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbChcbiAgICAgICAgICAgICAgIHNhdmVSZXN1bHQxLm1vZGVsQXJ0aWZhY3RzSW5mby5kYXRlU2F2ZWQuZ2V0VGltZSgpKTtcbiAgICAgICAvLyBOb3RlOiBUaGUgZm9sbG93aW5nIHR3byBhc3NlcnRpb25zIHdvcmsgb25seSBiZWNhdXNlIHRoZXJlIGlzXG4gICAgICAgLy8gbm8gbm9uLUFTQ0lJIGNoYXJhY3RlcnMgaW4gYG1vZGVsVG9wb2xvZ3kxYCBhbmRcbiAgICAgICAvLyBgd2VpZ2h0U3BlY3MxYC5cbiAgICAgICBleHBlY3Qoc2F2ZVJlc3VsdDIubW9kZWxBcnRpZmFjdHNJbmZvLm1vZGVsVG9wb2xvZ3lCeXRlcylcbiAgICAgICAgICAgLnRvRXF1YWwoSlNPTi5zdHJpbmdpZnkobW9kZWxUb3BvbG9neTEpLmxlbmd0aCk7XG4gICAgICAgZXhwZWN0KHNhdmVSZXN1bHQyLm1vZGVsQXJ0aWZhY3RzSW5mby53ZWlnaHRTcGVjc0J5dGVzKVxuICAgICAgICAgICAudG9FcXVhbChKU09OLnN0cmluZ2lmeSh3ZWlnaHRTcGVjczIpLmxlbmd0aCk7XG4gICAgICAgZXhwZWN0KHNhdmVSZXN1bHQyLm1vZGVsQXJ0aWZhY3RzSW5mby53ZWlnaHREYXRhQnl0ZXMpXG4gICAgICAgICAgIC50b0VxdWFsKHdlaWdodERhdGEyLmJ5dGVMZW5ndGgpO1xuXG4gICAgICAgY29uc3QgbG9hZGVkQXJ0aWZhY3RzID0gYXdhaXQgaGFuZGxlcjEubG9hZCgpO1xuICAgICAgIGV4cGVjdChsb2FkZWRBcnRpZmFjdHMubW9kZWxUb3BvbG9neSkudG9FcXVhbChtb2RlbFRvcG9sb2d5MSk7XG4gICAgICAgZXhwZWN0KGxvYWRlZEFydGlmYWN0cy53ZWlnaHRTcGVjcykudG9FcXVhbCh3ZWlnaHRTcGVjczEpO1xuICAgICAgIGV4cGVjdEFycmF5QnVmZmVyc0VxdWFsKGxvYWRlZEFydGlmYWN0cy53ZWlnaHREYXRhLCB3ZWlnaHREYXRhMSk7XG4gICAgIH0pKTtcblxuICBpdCgnTG9hZGluZyBub25leGlzdGVudCBtb2RlbCBmYWlscycsIHJ1bldpdGhMb2NrKGFzeW5jICgpID0+IHtcbiAgICAgICBjb25zdCBoYW5kbGVyID0gdGYuaW8uZ2V0U2F2ZUhhbmRsZXJzKCdpbmRleGVkZGI6Ly9Ob25leGlzdGVudE1vZGVsJylbMF07XG5cbiAgICAgICB0cnkge1xuICAgICAgICAgYXdhaXQgaGFuZGxlci5sb2FkKCk7XG4gICAgICAgICBmYWlsKCdMb2FkaW5nIG5vbmV4aXN0ZW50IG1vZGVsIGZyb20gSW5kZXhlZERCIHN1Y2NlZWRlZCB1bmV4cGVjdGx5Jyk7XG4gICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICBleHBlY3QoZXJyLm1lc3NhZ2UpXG4gICAgICAgICAgICAgLnRvRXF1YWwoXG4gICAgICAgICAgICAgICAgICdDYW5ub3QgZmluZCBtb2RlbCAnICtcbiAgICAgICAgICAgICAgICAgJ3dpdGggcGF0aCBcXCdOb25leGlzdGVudE1vZGVsXFwnIGluIEluZGV4ZWREQi4nKTtcbiAgICAgICB9XG4gICAgIH0pKTtcblxuICBpdCgnTnVsbCwgdW5kZWZpbmVkIG9yIGVtcHR5IG1vZGVsUGF0aCB0aHJvd3MgRXJyb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IGJyb3dzZXJJbmRleGVkREIobnVsbCkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoXG4gICAgICAgICAgICAvSW5kZXhlZERCLCBtb2RlbFBhdGggbXVzdCBub3QgYmUgbnVsbCwgdW5kZWZpbmVkIG9yIGVtcHR5Lyk7XG4gICAgZXhwZWN0KCgpID0+IGJyb3dzZXJJbmRleGVkREIodW5kZWZpbmVkKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcihcbiAgICAgICAgICAgIC9JbmRleGVkREIsIG1vZGVsUGF0aCBtdXN0IG5vdCBiZSBudWxsLCB1bmRlZmluZWQgb3IgZW1wdHkvKTtcbiAgICBleHBlY3QoKCkgPT4gYnJvd3NlckluZGV4ZWREQignJykpXG4gICAgICAgIC50b1Rocm93RXJyb3IoXG4gICAgICAgICAgICAvSW5kZXhlZERCLCBtb2RlbFBhdGggbXVzdCBub3QgYmUgbnVsbCwgdW5kZWZpbmVkIG9yIGVtcHR5Li8pO1xuICB9KTtcblxuICBpdCgncm91dGVyJywgKCkgPT4ge1xuICAgIGV4cGVjdChpbmRleGVkREJSb3V0ZXIoJ2luZGV4ZWRkYjovL2JhcicpIGluc3RhbmNlb2YgQnJvd3NlckluZGV4ZWREQilcbiAgICAgICAgLnRvRXF1YWwodHJ1ZSk7XG4gICAgZXhwZWN0KGluZGV4ZWREQlJvdXRlcignbG9jYWxzdG9yYWdlOi8vYmFyJykpLnRvQmVOdWxsKCk7XG4gICAgZXhwZWN0KGluZGV4ZWREQlJvdXRlcigncXV4JykpLnRvQmVOdWxsKCk7XG4gIH0pO1xuXG4gIGl0KCdNYW5hZ2VyOiBMaXN0IG1vZGVsczogMCByZXN1bHQnLCBydW5XaXRoTG9jayhhc3luYyAoKSA9PiB7XG4gICAgICAgLy8gQmVmb3JlIGFueSBtb2RlbCBpcyBzYXZlZCwgbGlzdE1vZGVscyBzaG91bGQgcmV0dXJuIGVtcHR5IHJlc3VsdC5cbiAgICAgICBjb25zdCBtb2RlbHMgPSBhd2FpdCBuZXcgQnJvd3NlckluZGV4ZWREQk1hbmFnZXIoKS5saXN0TW9kZWxzKCk7XG4gICAgICAgZXhwZWN0KG1vZGVscykudG9FcXVhbCh7fSk7XG4gICAgIH0pKTtcblxuICBpdCgnTWFuYWdlcjogTGlzdCBtb2RlbHM6IDEgcmVzdWx0JywgcnVuV2l0aExvY2soYXN5bmMgKCkgPT4ge1xuICAgICAgIGNvbnN0IGhhbmRsZXIgPSB0Zi5pby5nZXRTYXZlSGFuZGxlcnMoJ2luZGV4ZWRkYjovL2Jhei9RdXhNb2RlbCcpWzBdO1xuICAgICAgIGNvbnN0IHNhdmVSZXN1bHQgPSBhd2FpdCBoYW5kbGVyLnNhdmUoYXJ0aWZhY3RzMSk7XG5cbiAgICAgICAvLyBBZnRlciBzdWNjZXNzZnVsIHNhdmluZywgdGhlcmUgc2hvdWxkIGJlIG9uZSBtb2RlbC5cbiAgICAgICBjb25zdCBtb2RlbHMgPSBhd2FpdCBuZXcgQnJvd3NlckluZGV4ZWREQk1hbmFnZXIoKS5saXN0TW9kZWxzKCk7XG4gICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKG1vZGVscykubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgIGV4cGVjdChtb2RlbHNbJ2Jhei9RdXhNb2RlbCddLm1vZGVsVG9wb2xvZ3lUeXBlKVxuICAgICAgICAgICAudG9FcXVhbChzYXZlUmVzdWx0Lm1vZGVsQXJ0aWZhY3RzSW5mby5tb2RlbFRvcG9sb2d5VHlwZSk7XG4gICAgICAgZXhwZWN0KG1vZGVsc1snYmF6L1F1eE1vZGVsJ10ubW9kZWxUb3BvbG9neUJ5dGVzKVxuICAgICAgICAgICAudG9FcXVhbChzYXZlUmVzdWx0Lm1vZGVsQXJ0aWZhY3RzSW5mby5tb2RlbFRvcG9sb2d5Qnl0ZXMpO1xuICAgICAgIGV4cGVjdChtb2RlbHNbJ2Jhei9RdXhNb2RlbCddLndlaWdodFNwZWNzQnl0ZXMpXG4gICAgICAgICAgIC50b0VxdWFsKHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvLndlaWdodFNwZWNzQnl0ZXMpO1xuICAgICAgIGV4cGVjdChtb2RlbHNbJ2Jhei9RdXhNb2RlbCddLndlaWdodERhdGFCeXRlcylcbiAgICAgICAgICAgLnRvRXF1YWwoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8ud2VpZ2h0RGF0YUJ5dGVzKTtcbiAgICAgfSkpO1xuXG4gIGl0KCdNYW5hZ2VyOiBMaXN0IG1vZGVsczogMiByZXN1bHRzJywgcnVuV2l0aExvY2soYXN5bmMgKCkgPT4ge1xuICAgICAgIC8vIEZpcnN0LCBzYXZlIGEgbW9kZWwuXG4gICAgICAgY29uc3QgaGFuZGxlcjEgPSB0Zi5pby5nZXRTYXZlSGFuZGxlcnMoJ2luZGV4ZWRkYjovL1F1eE1vZGVsJylbMF07XG4gICAgICAgY29uc3Qgc2F2ZVJlc3VsdDEgPSBhd2FpdCBoYW5kbGVyMS5zYXZlKGFydGlmYWN0czEpO1xuXG4gICAgICAgLy8gVGhlbiwgc2F2ZSB0aGUgbW9kZWwgdW5kZXIgYW5vdGhlciBwYXRoLlxuICAgICAgIGNvbnN0IGhhbmRsZXIyID0gdGYuaW8uZ2V0U2F2ZUhhbmRsZXJzKCdpbmRleGVkZGI6Ly9yZXBlYXQvUXV4TW9kZWwnKVswXTtcbiAgICAgICBjb25zdCBzYXZlUmVzdWx0MiA9IGF3YWl0IGhhbmRsZXIyLnNhdmUoYXJ0aWZhY3RzMSk7XG5cbiAgICAgICAvLyBBZnRlciBzdWNjZXNzZnVsIHNhdmluZywgdGhlcmUgc2hvdWxkIGJlIHR3byBtb2RlbHMuXG4gICAgICAgY29uc3QgbW9kZWxzID0gYXdhaXQgbmV3IEJyb3dzZXJJbmRleGVkREJNYW5hZ2VyKCkubGlzdE1vZGVscygpO1xuICAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhtb2RlbHMpLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICAgICBleHBlY3QobW9kZWxzWydRdXhNb2RlbCddLm1vZGVsVG9wb2xvZ3lUeXBlKVxuICAgICAgICAgICAudG9FcXVhbChzYXZlUmVzdWx0MS5tb2RlbEFydGlmYWN0c0luZm8ubW9kZWxUb3BvbG9neVR5cGUpO1xuICAgICAgIGV4cGVjdChtb2RlbHNbJ1F1eE1vZGVsJ10ubW9kZWxUb3BvbG9neUJ5dGVzKVxuICAgICAgICAgICAudG9FcXVhbChzYXZlUmVzdWx0MS5tb2RlbEFydGlmYWN0c0luZm8ubW9kZWxUb3BvbG9neUJ5dGVzKTtcbiAgICAgICBleHBlY3QobW9kZWxzWydRdXhNb2RlbCddLndlaWdodFNwZWNzQnl0ZXMpXG4gICAgICAgICAgIC50b0VxdWFsKHNhdmVSZXN1bHQxLm1vZGVsQXJ0aWZhY3RzSW5mby53ZWlnaHRTcGVjc0J5dGVzKTtcbiAgICAgICBleHBlY3QobW9kZWxzWydRdXhNb2RlbCddLndlaWdodERhdGFCeXRlcylcbiAgICAgICAgICAgLnRvRXF1YWwoc2F2ZVJlc3VsdDEubW9kZWxBcnRpZmFjdHNJbmZvLndlaWdodERhdGFCeXRlcyk7XG4gICAgICAgZXhwZWN0KG1vZGVsc1sncmVwZWF0L1F1eE1vZGVsJ10ubW9kZWxUb3BvbG9neVR5cGUpXG4gICAgICAgICAgIC50b0VxdWFsKHNhdmVSZXN1bHQyLm1vZGVsQXJ0aWZhY3RzSW5mby5tb2RlbFRvcG9sb2d5VHlwZSk7XG4gICAgICAgZXhwZWN0KG1vZGVsc1sncmVwZWF0L1F1eE1vZGVsJ10ubW9kZWxUb3BvbG9neUJ5dGVzKVxuICAgICAgICAgICAudG9FcXVhbChzYXZlUmVzdWx0Mi5tb2RlbEFydGlmYWN0c0luZm8ubW9kZWxUb3BvbG9neUJ5dGVzKTtcbiAgICAgICBleHBlY3QobW9kZWxzWydyZXBlYXQvUXV4TW9kZWwnXS53ZWlnaHRTcGVjc0J5dGVzKVxuICAgICAgICAgICAudG9FcXVhbChzYXZlUmVzdWx0Mi5tb2RlbEFydGlmYWN0c0luZm8ud2VpZ2h0U3BlY3NCeXRlcyk7XG4gICAgICAgZXhwZWN0KG1vZGVsc1sncmVwZWF0L1F1eE1vZGVsJ10ud2VpZ2h0RGF0YUJ5dGVzKVxuICAgICAgICAgICAudG9FcXVhbChzYXZlUmVzdWx0Mi5tb2RlbEFydGlmYWN0c0luZm8ud2VpZ2h0RGF0YUJ5dGVzKTtcbiAgICAgfSkpO1xuXG4gIGl0KCdNYW5hZ2VyOiBTdWNjZXNzZnVsIHJlbW92ZU1vZGVsJywgcnVuV2l0aExvY2soYXN5bmMgKCkgPT4ge1xuICAgICAgIC8vIEZpcnN0LCBzYXZlIGEgbW9kZWwuXG4gICAgICAgY29uc3QgaGFuZGxlcjEgPSB0Zi5pby5nZXRTYXZlSGFuZGxlcnMoJ2luZGV4ZWRkYjovL1F1eE1vZGVsJylbMF07XG4gICAgICAgYXdhaXQgaGFuZGxlcjEuc2F2ZShhcnRpZmFjdHMxKTtcblxuICAgICAgIC8vIFRoZW4sIHNhdmUgdGhlIG1vZGVsIHVuZGVyIGFub3RoZXIgcGF0aC5cbiAgICAgICBjb25zdCBoYW5kbGVyMiA9IHRmLmlvLmdldFNhdmVIYW5kbGVycygnaW5kZXhlZGRiOi8vcmVwZWF0L1F1eE1vZGVsJylbMF07XG4gICAgICAgYXdhaXQgaGFuZGxlcjIuc2F2ZShhcnRpZmFjdHMxKTtcblxuICAgICAgIC8vIEFmdGVyIHN1Y2Nlc3NmdWwgc2F2aW5nLCBkZWxldGUgdGhlIGZpcnN0IHNhdmUsIGFuZCB0aGVuXG4gICAgICAgLy8gYGxpc3RNb2RlbGAgc2hvdWxkIGdpdmUgb25seSBvbmUgcmVzdWx0LlxuICAgICAgIGNvbnN0IG1hbmFnZXIgPSBuZXcgQnJvd3NlckluZGV4ZWREQk1hbmFnZXIoKTtcbiAgICAgICBhd2FpdCBtYW5hZ2VyLnJlbW92ZU1vZGVsKCdRdXhNb2RlbCcpO1xuXG4gICAgICAgY29uc3QgbW9kZWxzID0gYXdhaXQgbWFuYWdlci5saXN0TW9kZWxzKCk7XG4gICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKG1vZGVscykpLnRvRXF1YWwoWydyZXBlYXQvUXV4TW9kZWwnXSk7XG4gICAgIH0pKTtcblxuICBpdCgnTWFuYWdlcjogU3VjY2Vzc2Z1bCByZW1vdmVNb2RlbCB3aXRoIFVSTCBzY2hlbWUnLFxuICAgICBydW5XaXRoTG9jayhhc3luYyAoKSA9PiB7XG4gICAgICAgLy8gRmlyc3QsIHNhdmUgYSBtb2RlbC5cbiAgICAgICBjb25zdCBoYW5kbGVyMSA9IHRmLmlvLmdldFNhdmVIYW5kbGVycygnaW5kZXhlZGRiOi8vUXV4TW9kZWwnKVswXTtcbiAgICAgICBhd2FpdCBoYW5kbGVyMS5zYXZlKGFydGlmYWN0czEpO1xuXG4gICAgICAgLy8gVGhlbiwgc2F2ZSB0aGUgbW9kZWwgdW5kZXIgYW5vdGhlciBwYXRoLlxuICAgICAgIGNvbnN0IGhhbmRsZXIyID0gdGYuaW8uZ2V0U2F2ZUhhbmRsZXJzKCdpbmRleGVkZGI6Ly9yZXBlYXQvUXV4TW9kZWwnKVswXTtcbiAgICAgICBhd2FpdCBoYW5kbGVyMi5zYXZlKGFydGlmYWN0czEpO1xuXG4gICAgICAgLy8gQWZ0ZXIgc3VjY2Vzc2Z1bCBzYXZpbmcsIGRlbGV0ZSB0aGUgZmlyc3Qgc2F2ZSwgYW5kIHRoZW5cbiAgICAgICAvLyBgbGlzdE1vZGVsYCBzaG91bGQgZ2l2ZSBvbmx5IG9uZSByZXN1bHQuXG4gICAgICAgY29uc3QgbWFuYWdlciA9IG5ldyBCcm93c2VySW5kZXhlZERCTWFuYWdlcigpO1xuXG4gICAgICAgLy8gRGVsZXRlIGEgbW9kZWwgc3BlY2lmaWVkIHdpdGggYSBwYXRoIHRoYXQgaW5jbHVkZXMgdGhlXG4gICAgICAgLy8gaW5kZXhlZGRiOi8vIHNjaGVtZSBwcmVmaXggc2hvdWxkIHdvcmsuXG4gICAgICAgbWFuYWdlci5yZW1vdmVNb2RlbCgnaW5kZXhlZGRiOi8vUXV4TW9kZWwnKTtcblxuICAgICAgIGNvbnN0IG1vZGVscyA9IGF3YWl0IG1hbmFnZXIubGlzdE1vZGVscygpO1xuICAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhtb2RlbHMpKS50b0VxdWFsKFsncmVwZWF0L1F1eE1vZGVsJ10pO1xuICAgICB9KSk7XG5cbiAgaXQoJ01hbmFnZXI6IEZhaWxlZCByZW1vdmVNb2RlbCcsIHJ1bldpdGhMb2NrKGFzeW5jICgpID0+IHtcbiAgICAgICB0cnkge1xuICAgICAgICAgLy8gQXR0ZW1wdCB0byBkZWxldGUgYSBub25leGlzdGVudCBtb2RlbCBpcyBleHBlY3RlZCB0byBmYWlsLlxuICAgICAgICAgYXdhaXQgbmV3IEJyb3dzZXJJbmRleGVkREJNYW5hZ2VyKCkucmVtb3ZlTW9kZWwoJ25vbmV4aXN0ZW50Jyk7XG4gICAgICAgICBmYWlsKCdEZWxldGluZyBub25leGlzdGVudCBtb2RlbCBzdWNjZWVkZWQgdW5leHBlY3RlZGx5LicpO1xuICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgZXhwZWN0KGVyci5tZXNzYWdlKVxuICAgICAgICAgICAgIC50b0VxdWFsKFxuICAgICAgICAgICAgICAgICAnQ2Fubm90IGZpbmQgbW9kZWwgd2l0aCBwYXRoIFxcJ25vbmV4aXN0ZW50XFwnIGluIEluZGV4ZWREQi4nKTtcbiAgICAgICB9XG4gICAgIH0pKTtcbn0pO1xuIl19