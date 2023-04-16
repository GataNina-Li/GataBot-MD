/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import * as tf from '../index';
import { BROWSER_ENVS, describeWithFlags, runWithLock } from '../jasmine_util';
import { arrayBufferToBase64String, base64StringToArrayBuffer } from './io_utils';
import { browserLocalStorage, BrowserLocalStorage, BrowserLocalStorageManager, localStorageRouter, purgeLocalStorageArtifacts } from './local_storage';
describeWithFlags('LocalStorage', BROWSER_ENVS, () => {
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
    const trainingConfig1 = {
        loss: 'categorical_crossentropy',
        metrics: ['accuracy'],
        optimizer_config: { class_name: 'SGD', config: { learningRate: 0.1 } }
    };
    const artifacts1 = {
        modelTopology: modelTopology1,
        weightSpecs: weightSpecs1,
        weightData: weightData1,
        format: 'layers-model',
        generatedBy: 'TensorFlow.js v0.0.0',
        convertedBy: '1.13.1',
        signature: null,
        userDefinedMetadata: {},
        modelInitializer: {},
        trainingConfig: trainingConfig1,
    };
    const artifactsV0 = {
        modelTopology: modelTopology1,
        weightSpecs: weightSpecs1,
        weightData: weightData1
    };
    function findOverflowingByteSize() {
        const LS = window.localStorage;
        const probeKey = `tfjs_test_probe_values_${new Date().getTime()}_${Math.random()}`;
        const minKilobytes = 200;
        const stepKilobytes = 200;
        const maxKilobytes = 40000;
        for (let kilobytes = minKilobytes; kilobytes < maxKilobytes; kilobytes += stepKilobytes) {
            const bytes = kilobytes * 1024;
            const data = new ArrayBuffer(bytes);
            try {
                const encoded = arrayBufferToBase64String(data);
                LS.setItem(probeKey, encoded);
            }
            catch (err) {
                return bytes;
            }
            LS.removeItem(probeKey);
        }
        throw new Error(`Unable to determined overflowing byte size up to ${maxKilobytes} kB.`);
    }
    beforeEach(() => {
        purgeLocalStorageArtifacts();
    });
    afterEach(() => {
        purgeLocalStorageArtifacts();
    });
    it('Save artifacts succeeds', runWithLock(async () => {
        const testStartDate = new Date();
        const handler = tf.io.getSaveHandlers('localstorage://foo/FooModel')[0];
        const saveResult = await handler.save(artifacts1);
        expect(saveResult.modelArtifactsInfo.dateSaved.getTime())
            .toBeGreaterThanOrEqual(testStartDate.getTime());
        // Note: The following two assertions work only because there is no
        //   non-ASCII characters in `modelTopology1` and `weightSpecs1`.
        expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
            .toEqual(JSON.stringify(modelTopology1).length);
        expect(saveResult.modelArtifactsInfo.weightSpecsBytes)
            .toEqual(JSON.stringify(weightSpecs1).length);
        expect(saveResult.modelArtifactsInfo.weightDataBytes).toEqual(16);
        // Check the content of the saved items in local storage.
        const LS = window.localStorage;
        const info = JSON.parse(LS.getItem('tensorflowjs_models/foo/FooModel/info'));
        expect(Date.parse(info.dateSaved))
            .toEqual(saveResult.modelArtifactsInfo.dateSaved.getTime());
        expect(info.modelTopologyBytes)
            .toEqual(saveResult.modelArtifactsInfo.modelTopologyBytes);
        expect(info.weightSpecsBytes)
            .toEqual(saveResult.modelArtifactsInfo.weightSpecsBytes);
        expect(info.weightDataBytes)
            .toEqual(saveResult.modelArtifactsInfo.weightDataBytes);
        const topologyString = LS.getItem('tensorflowjs_models/foo/FooModel/model_topology');
        expect(JSON.stringify(modelTopology1)).toEqual(topologyString);
        const weightSpecsString = LS.getItem('tensorflowjs_models/foo/FooModel/weight_specs');
        expect(JSON.stringify(weightSpecs1)).toEqual(weightSpecsString);
        const weightDataBase64String = LS.getItem('tensorflowjs_models/foo/FooModel/weight_data');
        expect(base64StringToArrayBuffer(weightDataBase64String))
            .toEqual(weightData1);
    }));
    it('Save-load round trip succeeds', runWithLock(async () => {
        const handler1 = tf.io.getSaveHandlers('localstorage://FooModel')[0];
        await handler1.save(artifacts1);
        const handler2 = tf.io.getLoadHandlers('localstorage://FooModel')[0];
        const loaded = await handler2.load();
        expect(loaded.modelTopology).toEqual(modelTopology1);
        expect(loaded.weightSpecs).toEqual(weightSpecs1);
        expect(loaded.weightData).toEqual(weightData1);
        expect(loaded.format).toEqual('layers-model');
        expect(loaded.generatedBy).toEqual('TensorFlow.js v0.0.0');
        expect(loaded.convertedBy).toEqual('1.13.1');
        expect(loaded.userDefinedMetadata).toEqual({});
        expect(loaded.modelInitializer).toEqual({});
        expect(loaded.trainingConfig).toEqual(trainingConfig1);
    }));
    it('Save-load round trip succeeds: v0 format', runWithLock(async () => {
        const handler1 = tf.io.getSaveHandlers('localstorage://FooModel')[0];
        await handler1.save(artifactsV0);
        const handler2 = tf.io.getLoadHandlers('localstorage://FooModel')[0];
        const loaded = await handler2.load();
        expect(loaded.modelTopology).toEqual(modelTopology1);
        expect(loaded.weightSpecs).toEqual(weightSpecs1);
        expect(loaded.weightData).toEqual(weightData1);
        expect(loaded.format).toBeUndefined();
        expect(loaded.generatedBy).toBeUndefined();
        expect(loaded.convertedBy).toBeUndefined();
        expect(loaded.userDefinedMetadata).toBeUndefined();
        expect(loaded.trainingConfig).toBeUndefined();
    }));
    it('Loading nonexistent model fails.', runWithLock(async () => {
        const handler = tf.io.getSaveHandlers('localstorage://NonexistentModel')[0];
        try {
            await handler.load();
        }
        catch (err) {
            expect(err.message)
                .toEqual('In local storage, there is no model with name ' +
                '\'NonexistentModel\'');
            return; // Success
        }
        fail('Loading nonexistent model succeeded unexpectedly.');
    }));
    it('Loading model with missing topology fails.', runWithLock(async () => {
        const handler1 = tf.io.getSaveHandlers('localstorage://FooModel')[0];
        await handler1.save(artifacts1);
        // Manually remove the topology item from local storage.
        window.localStorage.removeItem('tensorflowjs_models/FooModel/model_topology');
        const handler2 = tf.io.getLoadHandlers('localstorage://FooModel')[0];
        try {
            await handler2.load();
        }
        catch (err) {
            expect(err.message)
                .toEqual('In local storage, the topology of model ' +
                '\'FooModel\' is missing.');
            return; // Success
        }
        fail('Loading of model with missing topology succeeded unexpectedly.');
    }));
    it('Loading model with missing weight specs fails.', runWithLock(async () => {
        const handler1 = tf.io.getSaveHandlers('localstorage://FooModel')[0];
        await handler1.save(artifacts1);
        // Manually remove the weight specs item from local storage.
        window.localStorage.removeItem('tensorflowjs_models/FooModel/weight_specs');
        const handler2 = tf.io.getLoadHandlers('localstorage://FooModel')[0];
        try {
            await handler2.load();
        }
        catch (err) {
            expect(err.message)
                .toEqual('In local storage, the weight specs of model ' +
                '\'FooModel\' are missing.');
            return; // Success
        }
        fail('Loading of model with missing weight specs succeeded unexpectedly.');
    }));
    it('Loading model with missing weight data fails.', runWithLock(async () => {
        const handler1 = tf.io.getSaveHandlers('localstorage://FooModel')[0];
        await handler1.save(artifacts1);
        // Manually remove the weight data item from local storage.
        window.localStorage.removeItem('tensorflowjs_models/FooModel/weight_data');
        const handler2 = tf.io.getLoadHandlers('localstorage://FooModel')[0];
        try {
            await handler2.load();
            fail('Loading of model with missing weight data succeeded unexpectedly.');
        }
        catch (err) {
            expect(err.message)
                .toEqual('In local storage, the binary weight values of model ' +
                '\'FooModel\' are missing.');
        }
    }));
    it('Data size too large leads to error thrown', runWithLock(async () => {
        const overflowByteSize = findOverflowingByteSize();
        const overflowArtifacts = {
            modelTopology: modelTopology1,
            weightSpecs: weightSpecs1,
            weightData: new ArrayBuffer(overflowByteSize),
        };
        const handler1 = tf.io.getSaveHandlers('localstorage://FooModel')[0];
        try {
            await handler1.save(overflowArtifacts);
            fail('Saving of model of overflowing-size weight data succeeded ' +
                'unexpectedly.');
        }
        catch (err) {
            expect(err.message
                .indexOf('Failed to save model \'FooModel\' to local storage'))
                .toEqual(0);
        }
    }));
    it('Null, undefined or empty modelPath throws Error', () => {
        expect(() => browserLocalStorage(null))
            .toThrowError(/local storage, modelPath must not be null, undefined or empty/);
        expect(() => browserLocalStorage(undefined))
            .toThrowError(/local storage, modelPath must not be null, undefined or empty/);
        expect(() => browserLocalStorage(''))
            .toThrowError(/local storage, modelPath must not be null, undefined or empty./);
    });
    it('router', () => {
        expect(localStorageRouter('localstorage://bar') instanceof BrowserLocalStorage)
            .toEqual(true);
        expect(localStorageRouter('indexeddb://bar')).toBeNull();
        expect(localStorageRouter('qux')).toBeNull();
    });
    it('Manager: List models: 0 result', runWithLock(async () => {
        // Before any model is saved, listModels should return empty result.
        const out = await new BrowserLocalStorageManager().listModels();
        expect(out).toEqual({});
    }));
    it('Manager: List models: 1 result', runWithLock(async () => {
        const handler = tf.io.getSaveHandlers('localstorage://baz/QuxModel')[0];
        const saveResult = await handler.save(artifacts1);
        // After successful saving, there should be one model.
        const out = await new BrowserLocalStorageManager().listModels();
        if (Object.keys(out).length !== 1) {
            console.log(JSON.stringify(out, null, 2));
        }
        expect(Object.keys(out).length).toEqual(1);
        expect(out['baz/QuxModel'].modelTopologyType)
            .toEqual(saveResult.modelArtifactsInfo.modelTopologyType);
        expect(out['baz/QuxModel'].modelTopologyBytes)
            .toEqual(saveResult.modelArtifactsInfo.modelTopologyBytes);
        expect(out['baz/QuxModel'].weightSpecsBytes)
            .toEqual(saveResult.modelArtifactsInfo.weightSpecsBytes);
        expect(out['baz/QuxModel'].weightDataBytes)
            .toEqual(saveResult.modelArtifactsInfo.weightDataBytes);
    }));
    it('Manager: List models: 2 results', runWithLock(async () => {
        // First, save a model.
        const handler1 = tf.io.getSaveHandlers('localstorage://QuxModel')[0];
        const saveResult1 = await handler1.save(artifacts1);
        // Then, save the model under another path.
        const handler2 = tf.io.getSaveHandlers('localstorage://repeat/QuxModel')[0];
        const saveResult2 = await handler2.save(artifacts1);
        // After successful saving, there should be two models.
        const out = await new BrowserLocalStorageManager().listModels();
        if (Object.keys(out).length !== 2) {
            console.log(JSON.stringify(out, null, 2));
        }
        expect(Object.keys(out).length).toEqual(2);
        expect(out['QuxModel'].modelTopologyType)
            .toEqual(saveResult1.modelArtifactsInfo.modelTopologyType);
        expect(out['QuxModel'].modelTopologyBytes)
            .toEqual(saveResult1.modelArtifactsInfo
            .modelTopologyBytes);
        expect(out['QuxModel'].weightSpecsBytes)
            .toEqual(saveResult1.modelArtifactsInfo.weightSpecsBytes);
        expect(out['QuxModel'].weightDataBytes)
            .toEqual(saveResult1.modelArtifactsInfo.weightDataBytes);
        expect(out['repeat/QuxModel'].modelTopologyType)
            .toEqual(saveResult2.modelArtifactsInfo.modelTopologyType);
        expect(out['repeat/QuxModel'].modelTopologyBytes)
            .toEqual(saveResult2.modelArtifactsInfo
            .modelTopologyBytes);
        expect(out['repeat/QuxModel'].weightSpecsBytes)
            .toEqual(saveResult2.modelArtifactsInfo.weightSpecsBytes);
        expect(out['repeat/QuxModel'].weightDataBytes)
            .toEqual(saveResult2.modelArtifactsInfo.weightDataBytes);
    }));
    it('Manager: Successful deleteModel', runWithLock(async () => {
        // First, save a model.
        const handler1 = tf.io.getSaveHandlers('localstorage://QuxModel')[0];
        await handler1.save(artifacts1);
        // Then, save the model under another path.
        const handler2 = tf.io.getSaveHandlers('localstorage://repeat/QuxModel')[0];
        await handler2.save(artifacts1);
        // After successful saving, delete the first save, and then
        // `listModel` should give only one result.
        const manager = new BrowserLocalStorageManager();
        await manager.removeModel('QuxModel');
        const out = await manager.listModels();
        expect(Object.keys(out)).toEqual(['repeat/QuxModel']);
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxfc3RvcmFnZV90ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9pby9sb2NhbF9zdG9yYWdlX3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxLQUFLLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDL0IsT0FBTyxFQUFDLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3RSxPQUFPLEVBQUMseUJBQXlCLEVBQUUseUJBQXlCLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDaEYsT0FBTyxFQUFDLG1CQUFtQixFQUFFLG1CQUFtQixFQUFFLDBCQUEwQixFQUFFLGtCQUFrQixFQUFFLDBCQUEwQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFckosaUJBQWlCLENBQUMsY0FBYyxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUU7SUFDbkQsYUFBYTtJQUNiLE1BQU0sY0FBYyxHQUFPO1FBQ3pCLFlBQVksRUFBRSxZQUFZO1FBQzFCLGVBQWUsRUFBRSxPQUFPO1FBQ3hCLFFBQVEsRUFBRSxDQUFDO2dCQUNULFlBQVksRUFBRSxPQUFPO2dCQUNyQixRQUFRLEVBQUU7b0JBQ1Isb0JBQW9CLEVBQUU7d0JBQ3BCLFlBQVksRUFBRSxpQkFBaUI7d0JBQy9CLFFBQVEsRUFBRTs0QkFDUixjQUFjLEVBQUUsU0FBUzs0QkFDekIsT0FBTyxFQUFFLEdBQUc7NEJBQ1osTUFBTSxFQUFFLElBQUk7NEJBQ1osTUFBTSxFQUFFLFNBQVM7eUJBQ2xCO3FCQUNGO29CQUNELE1BQU0sRUFBRSxPQUFPO29CQUNmLG1CQUFtQixFQUFFLElBQUk7b0JBQ3pCLGtCQUFrQixFQUFFLElBQUk7b0JBQ3hCLGlCQUFpQixFQUFFLElBQUk7b0JBQ3ZCLE9BQU8sRUFBRSxTQUFTO29CQUNsQixZQUFZLEVBQUUsUUFBUTtv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LFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0QyxNQUFNLEdBQUcsR0FBRyxNQUFNLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN2QyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlICdMaWNlbnNlJyk7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiAnQVMgSVMnIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0ICogYXMgdGYgZnJvbSAnLi4vaW5kZXgnO1xuaW1wb3J0IHtCUk9XU0VSX0VOVlMsIGRlc2NyaWJlV2l0aEZsYWdzLCBydW5XaXRoTG9ja30gZnJvbSAnLi4vamFzbWluZV91dGlsJztcbmltcG9ydCB7YXJyYXlCdWZmZXJUb0Jhc2U2NFN0cmluZywgYmFzZTY0U3RyaW5nVG9BcnJheUJ1ZmZlcn0gZnJvbSAnLi9pb191dGlscyc7XG5pbXBvcnQge2Jyb3dzZXJMb2NhbFN0b3JhZ2UsIEJyb3dzZXJMb2NhbFN0b3JhZ2UsIEJyb3dzZXJMb2NhbFN0b3JhZ2VNYW5hZ2VyLCBsb2NhbFN0b3JhZ2VSb3V0ZXIsIHB1cmdlTG9jYWxTdG9yYWdlQXJ0aWZhY3RzfSBmcm9tICcuL2xvY2FsX3N0b3JhZ2UnO1xuXG5kZXNjcmliZVdpdGhGbGFncygnTG9jYWxTdG9yYWdlJywgQlJPV1NFUl9FTlZTLCAoKSA9PiB7XG4gIC8vIFRlc3QgZGF0YS5cbiAgY29uc3QgbW9kZWxUb3BvbG9neTE6IHt9ID0ge1xuICAgICdjbGFzc19uYW1lJzogJ1NlcXVlbnRpYWwnLFxuICAgICdrZXJhc192ZXJzaW9uJzogJzIuMS40JyxcbiAgICAnY29uZmlnJzogW3tcbiAgICAgICdjbGFzc19uYW1lJzogJ0RlbnNlJyxcbiAgICAgICdjb25maWcnOiB7XG4gICAgICAgICdrZXJuZWxfaW5pdGlhbGl6ZXInOiB7XG4gICAgICAgICAgJ2NsYXNzX25hbWUnOiAnVmFyaWFuY2VTY2FsaW5nJyxcbiAgICAgICAgICAnY29uZmlnJzoge1xuICAgICAgICAgICAgJ2Rpc3RyaWJ1dGlvbic6ICd1bmlmb3JtJyxcbiAgICAgICAgICAgICdzY2FsZSc6IDEuMCxcbiAgICAgICAgICAgICdzZWVkJzogbnVsbCxcbiAgICAgICAgICAgICdtb2RlJzogJ2Zhbl9hdmcnXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAnbmFtZSc6ICdkZW5zZScsXG4gICAgICAgICdrZXJuZWxfY29uc3RyYWludCc6IG51bGwsXG4gICAgICAgICdiaWFzX3JlZ3VsYXJpemVyJzogbnVsbCxcbiAgICAgICAgJ2JpYXNfY29uc3RyYWludCc6IG51bGwsXG4gICAgICAgICdkdHlwZSc6ICdmbG9hdDMyJyxcbiAgICAgICAgJ2FjdGl2YXRpb24nOiAnbGluZWFyJyxcbiAgICAgICAgJ3RyYWluYWJsZSc6IHRydWUsXG4gICAgICAgICdrZXJuZWxfcmVndWxhcml6ZXInOiBudWxsLFxuICAgICAgICAnYmlhc19pbml0aWFsaXplcic6IHsnY2xhc3NfbmFtZSc6ICdaZXJvcycsICdjb25maWcnOiB7fX0sXG4gICAgICAgICd1bml0cyc6IDEsXG4gICAgICAgICdiYXRjaF9pbnB1dF9zaGFwZSc6IFtudWxsLCAzXSxcbiAgICAgICAgJ3VzZV9iaWFzJzogdHJ1ZSxcbiAgICAgICAgJ2FjdGl2aXR5X3JlZ3VsYXJpemVyJzogbnVsbFxuICAgICAgfVxuICAgIH1dLFxuICAgICdiYWNrZW5kJzogJ3RlbnNvcmZsb3cnXG4gIH07XG4gIGNvbnN0IHdlaWdodFNwZWNzMTogdGYuaW8uV2VpZ2h0c01hbmlmZXN0RW50cnlbXSA9IFtcbiAgICB7XG4gICAgICBuYW1lOiAnZGVuc2Uva2VybmVsJyxcbiAgICAgIHNoYXBlOiBbMywgMV0sXG4gICAgICBkdHlwZTogJ2Zsb2F0MzInLFxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ2RlbnNlL2JpYXMnLFxuICAgICAgc2hhcGU6IFsxXSxcbiAgICAgIGR0eXBlOiAnZmxvYXQzMicsXG4gICAgfVxuICBdO1xuICBjb25zdCB3ZWlnaHREYXRhMSA9IG5ldyBBcnJheUJ1ZmZlcigxNik7XG4gIGNvbnN0IHRyYWluaW5nQ29uZmlnMTogdGYuaW8uVHJhaW5pbmdDb25maWcgPSB7XG4gICAgbG9zczogJ2NhdGVnb3JpY2FsX2Nyb3NzZW50cm9weScsXG4gICAgbWV0cmljczogWydhY2N1cmFjeSddLFxuICAgIG9wdGltaXplcl9jb25maWc6IHtjbGFzc19uYW1lOiAnU0dEJywgY29uZmlnOiB7bGVhcm5pbmdSYXRlOiAwLjF9fVxuICB9O1xuXG4gIGNvbnN0IGFydGlmYWN0czE6IHRmLmlvLk1vZGVsQXJ0aWZhY3RzID0ge1xuICAgIG1vZGVsVG9wb2xvZ3k6IG1vZGVsVG9wb2xvZ3kxLFxuICAgIHdlaWdodFNwZWNzOiB3ZWlnaHRTcGVjczEsXG4gICAgd2VpZ2h0RGF0YTogd2VpZ2h0RGF0YTEsXG4gICAgZm9ybWF0OiAnbGF5ZXJzLW1vZGVsJyxcbiAgICBnZW5lcmF0ZWRCeTogJ1RlbnNvckZsb3cuanMgdjAuMC4wJyxcbiAgICBjb252ZXJ0ZWRCeTogJzEuMTMuMScsXG4gICAgc2lnbmF0dXJlOiBudWxsLFxuICAgIHVzZXJEZWZpbmVkTWV0YWRhdGE6IHt9LFxuICAgIG1vZGVsSW5pdGlhbGl6ZXI6IHt9LFxuICAgIHRyYWluaW5nQ29uZmlnOiB0cmFpbmluZ0NvbmZpZzEsXG4gIH07XG5cbiAgY29uc3QgYXJ0aWZhY3RzVjA6IHRmLmlvLk1vZGVsQXJ0aWZhY3RzID0ge1xuICAgIG1vZGVsVG9wb2xvZ3k6IG1vZGVsVG9wb2xvZ3kxLFxuICAgIHdlaWdodFNwZWNzOiB3ZWlnaHRTcGVjczEsXG4gICAgd2VpZ2h0RGF0YTogd2VpZ2h0RGF0YTFcbiAgfTtcblxuICBmdW5jdGlvbiBmaW5kT3ZlcmZsb3dpbmdCeXRlU2l6ZSgpOiBudW1iZXIge1xuICAgIGNvbnN0IExTID0gd2luZG93LmxvY2FsU3RvcmFnZTtcbiAgICBjb25zdCBwcm9iZUtleSA9XG4gICAgICAgIGB0ZmpzX3Rlc3RfcHJvYmVfdmFsdWVzXyR7bmV3IERhdGUoKS5nZXRUaW1lKCl9XyR7TWF0aC5yYW5kb20oKX1gO1xuICAgIGNvbnN0IG1pbktpbG9ieXRlcyA9IDIwMDtcbiAgICBjb25zdCBzdGVwS2lsb2J5dGVzID0gMjAwO1xuICAgIGNvbnN0IG1heEtpbG9ieXRlcyA9IDQwMDAwO1xuICAgIGZvciAobGV0IGtpbG9ieXRlcyA9IG1pbktpbG9ieXRlczsga2lsb2J5dGVzIDwgbWF4S2lsb2J5dGVzO1xuICAgICAgICAga2lsb2J5dGVzICs9IHN0ZXBLaWxvYnl0ZXMpIHtcbiAgICAgIGNvbnN0IGJ5dGVzID0ga2lsb2J5dGVzICogMTAyNDtcbiAgICAgIGNvbnN0IGRhdGEgPSBuZXcgQXJyYXlCdWZmZXIoYnl0ZXMpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZW5jb2RlZCA9IGFycmF5QnVmZmVyVG9CYXNlNjRTdHJpbmcoZGF0YSk7XG4gICAgICAgIExTLnNldEl0ZW0ocHJvYmVLZXksIGVuY29kZWQpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiBieXRlcztcbiAgICAgIH1cbiAgICAgIExTLnJlbW92ZUl0ZW0ocHJvYmVLZXkpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBVbmFibGUgdG8gZGV0ZXJtaW5lZCBvdmVyZmxvd2luZyBieXRlIHNpemUgdXAgdG8gJHttYXhLaWxvYnl0ZXN9IGtCLmApO1xuICB9XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgcHVyZ2VMb2NhbFN0b3JhZ2VBcnRpZmFjdHMoKTtcbiAgfSk7XG5cbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICBwdXJnZUxvY2FsU3RvcmFnZUFydGlmYWN0cygpO1xuICB9KTtcblxuICBpdCgnU2F2ZSBhcnRpZmFjdHMgc3VjY2VlZHMnLCBydW5XaXRoTG9jayhhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdGVzdFN0YXJ0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgaGFuZGxlciA9IHRmLmlvLmdldFNhdmVIYW5kbGVycygnbG9jYWxzdG9yYWdlOi8vZm9vL0Zvb01vZGVsJylbMF07XG4gICAgY29uc3Qgc2F2ZVJlc3VsdCA9IGF3YWl0IGhhbmRsZXIuc2F2ZShhcnRpZmFjdHMxKTtcblxuICAgIGV4cGVjdChzYXZlUmVzdWx0Lm1vZGVsQXJ0aWZhY3RzSW5mby5kYXRlU2F2ZWQuZ2V0VGltZSgpKVxuICAgICAgLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwodGVzdFN0YXJ0RGF0ZS5nZXRUaW1lKCkpO1xuICAgIC8vIE5vdGU6IFRoZSBmb2xsb3dpbmcgdHdvIGFzc2VydGlvbnMgd29yayBvbmx5IGJlY2F1c2UgdGhlcmUgaXMgbm9cbiAgICAvLyAgIG5vbi1BU0NJSSBjaGFyYWN0ZXJzIGluIGBtb2RlbFRvcG9sb2d5MWAgYW5kIGB3ZWlnaHRTcGVjczFgLlxuICAgIGV4cGVjdChzYXZlUmVzdWx0Lm1vZGVsQXJ0aWZhY3RzSW5mby5tb2RlbFRvcG9sb2d5Qnl0ZXMpXG4gICAgICAudG9FcXVhbChKU09OLnN0cmluZ2lmeShtb2RlbFRvcG9sb2d5MSkubGVuZ3RoKTtcbiAgICBleHBlY3Qoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8ud2VpZ2h0U3BlY3NCeXRlcylcbiAgICAgIC50b0VxdWFsKEpTT04uc3RyaW5naWZ5KHdlaWdodFNwZWNzMSkubGVuZ3RoKTtcbiAgICBleHBlY3Qoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8ud2VpZ2h0RGF0YUJ5dGVzKS50b0VxdWFsKDE2KTtcblxuICAgIC8vIENoZWNrIHRoZSBjb250ZW50IG9mIHRoZSBzYXZlZCBpdGVtcyBpbiBsb2NhbCBzdG9yYWdlLlxuICAgIGNvbnN0IExTID0gd2luZG93LmxvY2FsU3RvcmFnZTtcbiAgICBjb25zdCBpbmZvID1cbiAgICAgIEpTT04ucGFyc2UoTFMuZ2V0SXRlbSgndGVuc29yZmxvd2pzX21vZGVscy9mb28vRm9vTW9kZWwvaW5mbycpKTtcbiAgICBleHBlY3QoRGF0ZS5wYXJzZShpbmZvLmRhdGVTYXZlZCkpXG4gICAgICAudG9FcXVhbChzYXZlUmVzdWx0Lm1vZGVsQXJ0aWZhY3RzSW5mby5kYXRlU2F2ZWQuZ2V0VGltZSgpKTtcbiAgICBleHBlY3QoaW5mby5tb2RlbFRvcG9sb2d5Qnl0ZXMpXG4gICAgICAudG9FcXVhbChzYXZlUmVzdWx0Lm1vZGVsQXJ0aWZhY3RzSW5mby5tb2RlbFRvcG9sb2d5Qnl0ZXMpO1xuICAgIGV4cGVjdChpbmZvLndlaWdodFNwZWNzQnl0ZXMpXG4gICAgICAudG9FcXVhbChzYXZlUmVzdWx0Lm1vZGVsQXJ0aWZhY3RzSW5mby53ZWlnaHRTcGVjc0J5dGVzKTtcbiAgICBleHBlY3QoaW5mby53ZWlnaHREYXRhQnl0ZXMpXG4gICAgICAudG9FcXVhbChzYXZlUmVzdWx0Lm1vZGVsQXJ0aWZhY3RzSW5mby53ZWlnaHREYXRhQnl0ZXMpO1xuXG4gICAgY29uc3QgdG9wb2xvZ3lTdHJpbmcgPVxuICAgICAgTFMuZ2V0SXRlbSgndGVuc29yZmxvd2pzX21vZGVscy9mb28vRm9vTW9kZWwvbW9kZWxfdG9wb2xvZ3knKTtcbiAgICBleHBlY3QoSlNPTi5zdHJpbmdpZnkobW9kZWxUb3BvbG9neTEpKS50b0VxdWFsKHRvcG9sb2d5U3RyaW5nKTtcblxuICAgIGNvbnN0IHdlaWdodFNwZWNzU3RyaW5nID1cbiAgICAgIExTLmdldEl0ZW0oJ3RlbnNvcmZsb3dqc19tb2RlbHMvZm9vL0Zvb01vZGVsL3dlaWdodF9zcGVjcycpO1xuICAgIGV4cGVjdChKU09OLnN0cmluZ2lmeSh3ZWlnaHRTcGVjczEpKS50b0VxdWFsKHdlaWdodFNwZWNzU3RyaW5nKTtcblxuICAgIGNvbnN0IHdlaWdodERhdGFCYXNlNjRTdHJpbmcgPVxuICAgICAgTFMuZ2V0SXRlbSgndGVuc29yZmxvd2pzX21vZGVscy9mb28vRm9vTW9kZWwvd2VpZ2h0X2RhdGEnKTtcbiAgICBleHBlY3QoYmFzZTY0U3RyaW5nVG9BcnJheUJ1ZmZlcih3ZWlnaHREYXRhQmFzZTY0U3RyaW5nKSlcbiAgICAgIC50b0VxdWFsKHdlaWdodERhdGExKTtcbiAgfSkpO1xuXG4gIGl0KCdTYXZlLWxvYWQgcm91bmQgdHJpcCBzdWNjZWVkcycsIHJ1bldpdGhMb2NrKGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBoYW5kbGVyMSA9IHRmLmlvLmdldFNhdmVIYW5kbGVycygnbG9jYWxzdG9yYWdlOi8vRm9vTW9kZWwnKVswXTtcblxuICAgIGF3YWl0IGhhbmRsZXIxLnNhdmUoYXJ0aWZhY3RzMSk7XG4gICAgY29uc3QgaGFuZGxlcjIgPSB0Zi5pby5nZXRMb2FkSGFuZGxlcnMoJ2xvY2Fsc3RvcmFnZTovL0Zvb01vZGVsJylbMF07XG4gICAgY29uc3QgbG9hZGVkID0gYXdhaXQgaGFuZGxlcjIubG9hZCgpO1xuICAgIGV4cGVjdChsb2FkZWQubW9kZWxUb3BvbG9neSkudG9FcXVhbChtb2RlbFRvcG9sb2d5MSk7XG4gICAgZXhwZWN0KGxvYWRlZC53ZWlnaHRTcGVjcykudG9FcXVhbCh3ZWlnaHRTcGVjczEpO1xuICAgIGV4cGVjdChsb2FkZWQud2VpZ2h0RGF0YSkudG9FcXVhbCh3ZWlnaHREYXRhMSk7XG4gICAgZXhwZWN0KGxvYWRlZC5mb3JtYXQpLnRvRXF1YWwoJ2xheWVycy1tb2RlbCcpO1xuICAgIGV4cGVjdChsb2FkZWQuZ2VuZXJhdGVkQnkpLnRvRXF1YWwoJ1RlbnNvckZsb3cuanMgdjAuMC4wJyk7XG4gICAgZXhwZWN0KGxvYWRlZC5jb252ZXJ0ZWRCeSkudG9FcXVhbCgnMS4xMy4xJyk7XG4gICAgZXhwZWN0KGxvYWRlZC51c2VyRGVmaW5lZE1ldGFkYXRhKS50b0VxdWFsKHt9KTtcbiAgICBleHBlY3QobG9hZGVkLm1vZGVsSW5pdGlhbGl6ZXIpLnRvRXF1YWwoe30pO1xuICAgIGV4cGVjdChsb2FkZWQudHJhaW5pbmdDb25maWcpLnRvRXF1YWwodHJhaW5pbmdDb25maWcxKTtcbiAgfSkpO1xuXG4gIGl0KCdTYXZlLWxvYWQgcm91bmQgdHJpcCBzdWNjZWVkczogdjAgZm9ybWF0JywgcnVuV2l0aExvY2soYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGhhbmRsZXIxID0gdGYuaW8uZ2V0U2F2ZUhhbmRsZXJzKCdsb2NhbHN0b3JhZ2U6Ly9Gb29Nb2RlbCcpWzBdO1xuXG4gICAgYXdhaXQgaGFuZGxlcjEuc2F2ZShhcnRpZmFjdHNWMCk7XG4gICAgY29uc3QgaGFuZGxlcjIgPSB0Zi5pby5nZXRMb2FkSGFuZGxlcnMoJ2xvY2Fsc3RvcmFnZTovL0Zvb01vZGVsJylbMF07XG4gICAgY29uc3QgbG9hZGVkID0gYXdhaXQgaGFuZGxlcjIubG9hZCgpO1xuICAgIGV4cGVjdChsb2FkZWQubW9kZWxUb3BvbG9neSkudG9FcXVhbChtb2RlbFRvcG9sb2d5MSk7XG4gICAgZXhwZWN0KGxvYWRlZC53ZWlnaHRTcGVjcykudG9FcXVhbCh3ZWlnaHRTcGVjczEpO1xuICAgIGV4cGVjdChsb2FkZWQud2VpZ2h0RGF0YSkudG9FcXVhbCh3ZWlnaHREYXRhMSk7XG4gICAgZXhwZWN0KGxvYWRlZC5mb3JtYXQpLnRvQmVVbmRlZmluZWQoKTtcbiAgICBleHBlY3QobG9hZGVkLmdlbmVyYXRlZEJ5KS50b0JlVW5kZWZpbmVkKCk7XG4gICAgZXhwZWN0KGxvYWRlZC5jb252ZXJ0ZWRCeSkudG9CZVVuZGVmaW5lZCgpO1xuICAgIGV4cGVjdChsb2FkZWQudXNlckRlZmluZWRNZXRhZGF0YSkudG9CZVVuZGVmaW5lZCgpO1xuICAgIGV4cGVjdChsb2FkZWQudHJhaW5pbmdDb25maWcpLnRvQmVVbmRlZmluZWQoKTtcbiAgfSkpO1xuXG4gIGl0KCdMb2FkaW5nIG5vbmV4aXN0ZW50IG1vZGVsIGZhaWxzLicsIHJ1bldpdGhMb2NrKGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBoYW5kbGVyID0gdGYuaW8uZ2V0U2F2ZUhhbmRsZXJzKCdsb2NhbHN0b3JhZ2U6Ly9Ob25leGlzdGVudE1vZGVsJylbMF07XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGhhbmRsZXIubG9hZCgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgZXhwZWN0KGVyci5tZXNzYWdlKVxuICAgICAgICAudG9FcXVhbChcbiAgICAgICAgICAnSW4gbG9jYWwgc3RvcmFnZSwgdGhlcmUgaXMgbm8gbW9kZWwgd2l0aCBuYW1lICcgK1xuICAgICAgICAgICAgJ1xcJ05vbmV4aXN0ZW50TW9kZWxcXCcnKTtcbiAgICAgIHJldHVybjsgLy8gU3VjY2Vzc1xuICAgIH1cbiAgICBmYWlsKCdMb2FkaW5nIG5vbmV4aXN0ZW50IG1vZGVsIHN1Y2NlZWRlZCB1bmV4cGVjdGVkbHkuJyk7XG4gIH0pKTtcblxuICBpdCgnTG9hZGluZyBtb2RlbCB3aXRoIG1pc3NpbmcgdG9wb2xvZ3kgZmFpbHMuJywgcnVuV2l0aExvY2soYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGhhbmRsZXIxID0gdGYuaW8uZ2V0U2F2ZUhhbmRsZXJzKCdsb2NhbHN0b3JhZ2U6Ly9Gb29Nb2RlbCcpWzBdO1xuICAgIGF3YWl0IGhhbmRsZXIxLnNhdmUoYXJ0aWZhY3RzMSk7XG4gICAgLy8gTWFudWFsbHkgcmVtb3ZlIHRoZSB0b3BvbG9neSBpdGVtIGZyb20gbG9jYWwgc3RvcmFnZS5cbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXG4gICAgICAndGVuc29yZmxvd2pzX21vZGVscy9Gb29Nb2RlbC9tb2RlbF90b3BvbG9neScpO1xuXG4gICAgY29uc3QgaGFuZGxlcjIgPSB0Zi5pby5nZXRMb2FkSGFuZGxlcnMoJ2xvY2Fsc3RvcmFnZTovL0Zvb01vZGVsJylbMF07XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGhhbmRsZXIyLmxvYWQoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGV4cGVjdChlcnIubWVzc2FnZSlcbiAgICAgICAgLnRvRXF1YWwoXG4gICAgICAgICAgJ0luIGxvY2FsIHN0b3JhZ2UsIHRoZSB0b3BvbG9neSBvZiBtb2RlbCAnICtcbiAgICAgICAgICAgICdcXCdGb29Nb2RlbFxcJyBpcyBtaXNzaW5nLicpO1xuICAgICAgcmV0dXJuOyAvLyBTdWNjZXNzXG4gICAgfVxuICAgIGZhaWwoJ0xvYWRpbmcgb2YgbW9kZWwgd2l0aCBtaXNzaW5nIHRvcG9sb2d5IHN1Y2NlZWRlZCB1bmV4cGVjdGVkbHkuJyk7XG4gIH0pKTtcblxuICBpdCgnTG9hZGluZyBtb2RlbCB3aXRoIG1pc3Npbmcgd2VpZ2h0IHNwZWNzIGZhaWxzLicsIHJ1bldpdGhMb2NrKGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBoYW5kbGVyMSA9IHRmLmlvLmdldFNhdmVIYW5kbGVycygnbG9jYWxzdG9yYWdlOi8vRm9vTW9kZWwnKVswXTtcbiAgICBhd2FpdCBoYW5kbGVyMS5zYXZlKGFydGlmYWN0czEpO1xuICAgIC8vIE1hbnVhbGx5IHJlbW92ZSB0aGUgd2VpZ2h0IHNwZWNzIGl0ZW0gZnJvbSBsb2NhbCBzdG9yYWdlLlxuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndGVuc29yZmxvd2pzX21vZGVscy9Gb29Nb2RlbC93ZWlnaHRfc3BlY3MnKTtcblxuICAgIGNvbnN0IGhhbmRsZXIyID0gdGYuaW8uZ2V0TG9hZEhhbmRsZXJzKCdsb2NhbHN0b3JhZ2U6Ly9Gb29Nb2RlbCcpWzBdO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBoYW5kbGVyMi5sb2FkKCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBleHBlY3QoZXJyLm1lc3NhZ2UpXG4gICAgICAgIC50b0VxdWFsKFxuICAgICAgICAgICdJbiBsb2NhbCBzdG9yYWdlLCB0aGUgd2VpZ2h0IHNwZWNzIG9mIG1vZGVsICcgK1xuICAgICAgICAgICAgJ1xcJ0Zvb01vZGVsXFwnIGFyZSBtaXNzaW5nLicpO1xuICAgICAgcmV0dXJuOyAvLyBTdWNjZXNzXG4gICAgfVxuICAgIGZhaWwoJ0xvYWRpbmcgb2YgbW9kZWwgd2l0aCBtaXNzaW5nIHdlaWdodCBzcGVjcyBzdWNjZWVkZWQgdW5leHBlY3RlZGx5LicpO1xuICB9KSk7XG5cbiAgaXQoJ0xvYWRpbmcgbW9kZWwgd2l0aCBtaXNzaW5nIHdlaWdodCBkYXRhIGZhaWxzLicsIHJ1bldpdGhMb2NrKGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBoYW5kbGVyMSA9IHRmLmlvLmdldFNhdmVIYW5kbGVycygnbG9jYWxzdG9yYWdlOi8vRm9vTW9kZWwnKVswXTtcbiAgICBhd2FpdCBoYW5kbGVyMS5zYXZlKGFydGlmYWN0czEpO1xuXG4gICAgLy8gTWFudWFsbHkgcmVtb3ZlIHRoZSB3ZWlnaHQgZGF0YSBpdGVtIGZyb20gbG9jYWwgc3RvcmFnZS5cbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3RlbnNvcmZsb3dqc19tb2RlbHMvRm9vTW9kZWwvd2VpZ2h0X2RhdGEnKTtcblxuICAgIGNvbnN0IGhhbmRsZXIyID0gdGYuaW8uZ2V0TG9hZEhhbmRsZXJzKCdsb2NhbHN0b3JhZ2U6Ly9Gb29Nb2RlbCcpWzBdO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBoYW5kbGVyMi5sb2FkKCk7XG4gICAgICBmYWlsKCdMb2FkaW5nIG9mIG1vZGVsIHdpdGggbWlzc2luZyB3ZWlnaHQgZGF0YSBzdWNjZWVkZWQgdW5leHBlY3RlZGx5LicpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgZXhwZWN0KGVyci5tZXNzYWdlKVxuICAgICAgICAudG9FcXVhbChcbiAgICAgICAgICAnSW4gbG9jYWwgc3RvcmFnZSwgdGhlIGJpbmFyeSB3ZWlnaHQgdmFsdWVzIG9mIG1vZGVsICcgK1xuICAgICAgICAgICAgJ1xcJ0Zvb01vZGVsXFwnIGFyZSBtaXNzaW5nLicpO1xuICAgIH1cbiAgfSkpO1xuXG4gIGl0KCdEYXRhIHNpemUgdG9vIGxhcmdlIGxlYWRzIHRvIGVycm9yIHRocm93bicsIHJ1bldpdGhMb2NrKGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBvdmVyZmxvd0J5dGVTaXplID0gZmluZE92ZXJmbG93aW5nQnl0ZVNpemUoKTtcbiAgICBjb25zdCBvdmVyZmxvd0FydGlmYWN0czogdGYuaW8uTW9kZWxBcnRpZmFjdHMgPSB7XG4gICAgICBtb2RlbFRvcG9sb2d5OiBtb2RlbFRvcG9sb2d5MSxcbiAgICAgIHdlaWdodFNwZWNzOiB3ZWlnaHRTcGVjczEsXG4gICAgICB3ZWlnaHREYXRhOiBuZXcgQXJyYXlCdWZmZXIob3ZlcmZsb3dCeXRlU2l6ZSksXG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVyMSA9IHRmLmlvLmdldFNhdmVIYW5kbGVycygnbG9jYWxzdG9yYWdlOi8vRm9vTW9kZWwnKVswXTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgaGFuZGxlcjEuc2F2ZShvdmVyZmxvd0FydGlmYWN0cyk7XG4gICAgICBmYWlsKCdTYXZpbmcgb2YgbW9kZWwgb2Ygb3ZlcmZsb3dpbmctc2l6ZSB3ZWlnaHQgZGF0YSBzdWNjZWVkZWQgJyArXG4gICAgICAgICd1bmV4cGVjdGVkbHkuJyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBleHBlY3QoKGVyci5tZXNzYWdlIGFzIHN0cmluZylcbiAgICAgICAgICAgICAgIC5pbmRleE9mKFxuICAgICAgICAgICAgICAgICAnRmFpbGVkIHRvIHNhdmUgbW9kZWwgXFwnRm9vTW9kZWxcXCcgdG8gbG9jYWwgc3RvcmFnZScpKVxuICAgICAgICAudG9FcXVhbCgwKTtcbiAgICB9XG4gIH0pKTtcblxuICBpdCgnTnVsbCwgdW5kZWZpbmVkIG9yIGVtcHR5IG1vZGVsUGF0aCB0aHJvd3MgRXJyb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IGJyb3dzZXJMb2NhbFN0b3JhZ2UobnVsbCkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoXG4gICAgICAgICAgICAvbG9jYWwgc3RvcmFnZSwgbW9kZWxQYXRoIG11c3Qgbm90IGJlIG51bGwsIHVuZGVmaW5lZCBvciBlbXB0eS8pO1xuICAgIGV4cGVjdCgoKSA9PiBicm93c2VyTG9jYWxTdG9yYWdlKHVuZGVmaW5lZCkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoXG4gICAgICAgICAgICAvbG9jYWwgc3RvcmFnZSwgbW9kZWxQYXRoIG11c3Qgbm90IGJlIG51bGwsIHVuZGVmaW5lZCBvciBlbXB0eS8pO1xuICAgIGV4cGVjdCgoKSA9PiBicm93c2VyTG9jYWxTdG9yYWdlKCcnKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcihcbiAgICAgICAgICAgIC9sb2NhbCBzdG9yYWdlLCBtb2RlbFBhdGggbXVzdCBub3QgYmUgbnVsbCwgdW5kZWZpbmVkIG9yIGVtcHR5Li8pO1xuICB9KTtcblxuICBpdCgncm91dGVyJywgKCkgPT4ge1xuICAgIGV4cGVjdChcbiAgICAgICAgbG9jYWxTdG9yYWdlUm91dGVyKCdsb2NhbHN0b3JhZ2U6Ly9iYXInKSBpbnN0YW5jZW9mIEJyb3dzZXJMb2NhbFN0b3JhZ2UpXG4gICAgICAgIC50b0VxdWFsKHRydWUpO1xuICAgIGV4cGVjdChsb2NhbFN0b3JhZ2VSb3V0ZXIoJ2luZGV4ZWRkYjovL2JhcicpKS50b0JlTnVsbCgpO1xuICAgIGV4cGVjdChsb2NhbFN0b3JhZ2VSb3V0ZXIoJ3F1eCcpKS50b0JlTnVsbCgpO1xuICB9KTtcblxuICBpdCgnTWFuYWdlcjogTGlzdCBtb2RlbHM6IDAgcmVzdWx0JywgcnVuV2l0aExvY2soYXN5bmMgKCkgPT4ge1xuICAgIC8vIEJlZm9yZSBhbnkgbW9kZWwgaXMgc2F2ZWQsIGxpc3RNb2RlbHMgc2hvdWxkIHJldHVybiBlbXB0eSByZXN1bHQuXG4gICAgY29uc3Qgb3V0ID0gYXdhaXQgbmV3IEJyb3dzZXJMb2NhbFN0b3JhZ2VNYW5hZ2VyKCkubGlzdE1vZGVscygpO1xuICAgIGV4cGVjdChvdXQpLnRvRXF1YWwoe30pO1xuICB9KSk7XG5cbiAgaXQoJ01hbmFnZXI6IExpc3QgbW9kZWxzOiAxIHJlc3VsdCcsIHJ1bldpdGhMb2NrKGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBoYW5kbGVyID0gdGYuaW8uZ2V0U2F2ZUhhbmRsZXJzKCdsb2NhbHN0b3JhZ2U6Ly9iYXovUXV4TW9kZWwnKVswXTtcbiAgICBjb25zdCBzYXZlUmVzdWx0ID0gYXdhaXQgaGFuZGxlci5zYXZlKGFydGlmYWN0czEpO1xuXG4gICAgLy8gQWZ0ZXIgc3VjY2Vzc2Z1bCBzYXZpbmcsIHRoZXJlIHNob3VsZCBiZSBvbmUgbW9kZWwuXG4gICAgY29uc3Qgb3V0ID0gYXdhaXQgbmV3IEJyb3dzZXJMb2NhbFN0b3JhZ2VNYW5hZ2VyKCkubGlzdE1vZGVscygpO1xuICAgIGlmIChPYmplY3Qua2V5cyhvdXQpLmxlbmd0aCAhPT0gMSkge1xuICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkob3V0LCBudWxsLCAyKSk7XG4gICAgfVxuXG4gICAgZXhwZWN0KE9iamVjdC5rZXlzKG91dCkubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChvdXRbJ2Jhei9RdXhNb2RlbCddLm1vZGVsVG9wb2xvZ3lUeXBlKVxuICAgICAgLnRvRXF1YWwoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8ubW9kZWxUb3BvbG9neVR5cGUpO1xuICAgIGV4cGVjdChvdXRbJ2Jhei9RdXhNb2RlbCddLm1vZGVsVG9wb2xvZ3lCeXRlcylcbiAgICAgIC50b0VxdWFsKHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvLm1vZGVsVG9wb2xvZ3lCeXRlcyk7XG4gICAgZXhwZWN0KG91dFsnYmF6L1F1eE1vZGVsJ10ud2VpZ2h0U3BlY3NCeXRlcylcbiAgICAgIC50b0VxdWFsKHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvLndlaWdodFNwZWNzQnl0ZXMpO1xuICAgIGV4cGVjdChvdXRbJ2Jhei9RdXhNb2RlbCddLndlaWdodERhdGFCeXRlcylcbiAgICAgIC50b0VxdWFsKHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvLndlaWdodERhdGFCeXRlcyk7XG4gIH0pKTtcblxuICBpdCgnTWFuYWdlcjogTGlzdCBtb2RlbHM6IDIgcmVzdWx0cycsIHJ1bldpdGhMb2NrKGFzeW5jICgpID0+IHtcbiAgICAvLyBGaXJzdCwgc2F2ZSBhIG1vZGVsLlxuICAgIGNvbnN0IGhhbmRsZXIxID0gdGYuaW8uZ2V0U2F2ZUhhbmRsZXJzKCdsb2NhbHN0b3JhZ2U6Ly9RdXhNb2RlbCcpWzBdO1xuICAgIGNvbnN0IHNhdmVSZXN1bHQxID0gYXdhaXQgaGFuZGxlcjEuc2F2ZShhcnRpZmFjdHMxKTtcblxuICAgIC8vIFRoZW4sIHNhdmUgdGhlIG1vZGVsIHVuZGVyIGFub3RoZXIgcGF0aC5cbiAgICBjb25zdCBoYW5kbGVyMiA9IHRmLmlvLmdldFNhdmVIYW5kbGVycygnbG9jYWxzdG9yYWdlOi8vcmVwZWF0L1F1eE1vZGVsJylbMF07XG4gICAgY29uc3Qgc2F2ZVJlc3VsdDIgPSBhd2FpdCBoYW5kbGVyMi5zYXZlKGFydGlmYWN0czEpO1xuXG4gICAgLy8gQWZ0ZXIgc3VjY2Vzc2Z1bCBzYXZpbmcsIHRoZXJlIHNob3VsZCBiZSB0d28gbW9kZWxzLlxuICAgIGNvbnN0IG91dCA9IGF3YWl0IG5ldyBCcm93c2VyTG9jYWxTdG9yYWdlTWFuYWdlcigpLmxpc3RNb2RlbHMoKTtcbiAgICBpZiAoT2JqZWN0LmtleXMob3V0KS5sZW5ndGggIT09IDIpIHtcbiAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KG91dCwgbnVsbCwgMikpO1xuICAgIH1cbiAgICBleHBlY3QoT2JqZWN0LmtleXMob3V0KS5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KG91dFsnUXV4TW9kZWwnXS5tb2RlbFRvcG9sb2d5VHlwZSlcbiAgICAgIC50b0VxdWFsKFxuICAgICAgICBzYXZlUmVzdWx0MS5tb2RlbEFydGlmYWN0c0luZm8ubW9kZWxUb3BvbG9neVR5cGUpO1xuICAgIGV4cGVjdChvdXRbJ1F1eE1vZGVsJ10ubW9kZWxUb3BvbG9neUJ5dGVzKVxuICAgICAgLnRvRXF1YWwoc2F2ZVJlc3VsdDEubW9kZWxBcnRpZmFjdHNJbmZvXG4gICAgICAubW9kZWxUb3BvbG9neUJ5dGVzKTtcbiAgICBleHBlY3Qob3V0WydRdXhNb2RlbCddLndlaWdodFNwZWNzQnl0ZXMpXG4gICAgICAudG9FcXVhbChcbiAgICAgICAgc2F2ZVJlc3VsdDEubW9kZWxBcnRpZmFjdHNJbmZvLndlaWdodFNwZWNzQnl0ZXMpO1xuICAgIGV4cGVjdChvdXRbJ1F1eE1vZGVsJ10ud2VpZ2h0RGF0YUJ5dGVzKVxuICAgICAgLnRvRXF1YWwoXG4gICAgICAgIHNhdmVSZXN1bHQxLm1vZGVsQXJ0aWZhY3RzSW5mby53ZWlnaHREYXRhQnl0ZXMpO1xuICAgIGV4cGVjdChvdXRbJ3JlcGVhdC9RdXhNb2RlbCddLm1vZGVsVG9wb2xvZ3lUeXBlKVxuICAgICAgLnRvRXF1YWwoXG4gICAgICAgIHNhdmVSZXN1bHQyLm1vZGVsQXJ0aWZhY3RzSW5mby5tb2RlbFRvcG9sb2d5VHlwZSk7XG4gICAgZXhwZWN0KG91dFsncmVwZWF0L1F1eE1vZGVsJ10ubW9kZWxUb3BvbG9neUJ5dGVzKVxuICAgICAgLnRvRXF1YWwoc2F2ZVJlc3VsdDIubW9kZWxBcnRpZmFjdHNJbmZvXG4gICAgICAubW9kZWxUb3BvbG9neUJ5dGVzKTtcbiAgICBleHBlY3Qob3V0WydyZXBlYXQvUXV4TW9kZWwnXS53ZWlnaHRTcGVjc0J5dGVzKVxuICAgICAgLnRvRXF1YWwoXG4gICAgICAgIHNhdmVSZXN1bHQyLm1vZGVsQXJ0aWZhY3RzSW5mby53ZWlnaHRTcGVjc0J5dGVzKTtcbiAgICBleHBlY3Qob3V0WydyZXBlYXQvUXV4TW9kZWwnXS53ZWlnaHREYXRhQnl0ZXMpXG4gICAgICAudG9FcXVhbChcbiAgICAgICAgc2F2ZVJlc3VsdDIubW9kZWxBcnRpZmFjdHNJbmZvLndlaWdodERhdGFCeXRlcyk7XG4gIH0pKTtcblxuICBpdCgnTWFuYWdlcjogU3VjY2Vzc2Z1bCBkZWxldGVNb2RlbCcsIHJ1bldpdGhMb2NrKGFzeW5jICgpID0+IHtcbiAgICAvLyBGaXJzdCwgc2F2ZSBhIG1vZGVsLlxuICAgIGNvbnN0IGhhbmRsZXIxID0gdGYuaW8uZ2V0U2F2ZUhhbmRsZXJzKCdsb2NhbHN0b3JhZ2U6Ly9RdXhNb2RlbCcpWzBdO1xuICAgIGF3YWl0IGhhbmRsZXIxLnNhdmUoYXJ0aWZhY3RzMSk7XG5cbiAgICAvLyBUaGVuLCBzYXZlIHRoZSBtb2RlbCB1bmRlciBhbm90aGVyIHBhdGguXG4gICAgY29uc3QgaGFuZGxlcjIgPSB0Zi5pby5nZXRTYXZlSGFuZGxlcnMoJ2xvY2Fsc3RvcmFnZTovL3JlcGVhdC9RdXhNb2RlbCcpWzBdO1xuICAgIGF3YWl0IGhhbmRsZXIyLnNhdmUoYXJ0aWZhY3RzMSk7XG5cbiAgICAvLyBBZnRlciBzdWNjZXNzZnVsIHNhdmluZywgZGVsZXRlIHRoZSBmaXJzdCBzYXZlLCBhbmQgdGhlblxuICAgIC8vIGBsaXN0TW9kZWxgIHNob3VsZCBnaXZlIG9ubHkgb25lIHJlc3VsdC5cbiAgICBjb25zdCBtYW5hZ2VyID0gbmV3IEJyb3dzZXJMb2NhbFN0b3JhZ2VNYW5hZ2VyKCk7XG4gICAgYXdhaXQgbWFuYWdlci5yZW1vdmVNb2RlbCgnUXV4TW9kZWwnKTtcbiAgICBjb25zdCBvdXQgPSBhd2FpdCBtYW5hZ2VyLmxpc3RNb2RlbHMoKTtcbiAgICBleHBlY3QoT2JqZWN0LmtleXMob3V0KSkudG9FcXVhbChbJ3JlcGVhdC9RdXhNb2RlbCddKTtcbiAgfSkpO1xufSk7XG4iXX0=