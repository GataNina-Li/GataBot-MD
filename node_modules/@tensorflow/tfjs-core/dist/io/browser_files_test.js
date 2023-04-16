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
 * Unit tests for file-related IOHandlers.
 */
import * as tf from '../index';
import { BROWSER_ENVS, describeWithFlags } from '../jasmine_util';
import { browserDownloads, BrowserDownloads, browserDownloadsRouter } from './browser_files';
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
    convertedBy: null,
    modelInitializer: {},
    trainingConfig: trainingConfig1,
};
describeWithFlags('browserDownloads', BROWSER_ENVS, () => {
    class FakeHTMLAnchorElement {
        constructor() {
            this.clicked = 0;
        }
        dispatchEvent() {
            this.clicked++;
        }
    }
    let fakeAnchors = [];
    let fakeAnchorCount = 0;
    beforeEach(() => {
        fakeAnchorCount = 0;
        fakeAnchors = [new FakeHTMLAnchorElement(), new FakeHTMLAnchorElement()];
        spyOn(document, 'createElement').and.callFake((tag) => {
            return fakeAnchors[fakeAnchorCount++];
        });
    });
    it('Explicit file name prefix, with existing anchors', async () => {
        const testStartDate = new Date();
        const downloadTrigger = tf.io.getSaveHandlers('downloads://test-model')[0];
        const saveResult = await downloadTrigger.save(artifacts1);
        expect(saveResult.errors).toEqual(undefined);
        const artifactsInfo = saveResult.modelArtifactsInfo;
        expect(artifactsInfo.dateSaved.getTime())
            .toBeGreaterThanOrEqual(testStartDate.getTime());
        expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
            .toEqual(JSON.stringify(modelTopology1).length);
        expect(saveResult.modelArtifactsInfo.weightSpecsBytes)
            .toEqual(JSON.stringify(weightSpecs1).length);
        expect(saveResult.modelArtifactsInfo.weightDataBytes).toEqual(16);
        const jsonAnchor = fakeAnchors[0];
        const weightDataAnchor = fakeAnchors[1];
        expect(jsonAnchor.download).toEqual('test-model.json');
        expect(weightDataAnchor.download).toEqual('test-model.weights.bin');
        // Verify the content of the JSON file.
        const jsonContent = await fetch(jsonAnchor.href);
        const modelJSON = JSON.parse(await jsonContent.text());
        expect(modelJSON.modelTopology).toEqual(modelTopology1);
        expect(modelJSON.format).toEqual('layers-model');
        expect(modelJSON.generatedBy).toEqual('TensorFlow.js v0.0.0');
        expect(modelJSON.convertedBy).toEqual(null);
        expect(modelJSON.modelInitializer).toEqual({});
        expect(modelJSON.trainingConfig).toEqual(trainingConfig1);
        const weightsManifest = modelJSON.weightsManifest;
        expect(weightsManifest.length).toEqual(1);
        expect(weightsManifest[0].paths).toEqual(['./test-model.weights.bin']);
        expect(weightsManifest[0].weights).toEqual(weightSpecs1);
        // Verify the content of the binary weights file.
        const response = await fetch(weightDataAnchor.href);
        const buffer = await response.arrayBuffer();
        expect(buffer).toEqual(weightData1);
        // Verify that the downloads are triggered through clicks.
        expect(jsonAnchor.clicked).toEqual(1);
        expect(weightDataAnchor.clicked).toEqual(1);
    });
    it('URL scheme in explicit name gets stripped', async () => {
        const testStartDate = new Date();
        const downloadTrigger = browserDownloads('downloads://test-model');
        const saveResult = await downloadTrigger.save(artifacts1);
        expect(saveResult.errors).toEqual(undefined);
        const artifactsInfo = saveResult.modelArtifactsInfo;
        expect(artifactsInfo.dateSaved.getTime())
            .toBeGreaterThanOrEqual(testStartDate.getTime());
        expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
            .toEqual(JSON.stringify(modelTopology1).length);
        expect(saveResult.modelArtifactsInfo.weightSpecsBytes)
            .toEqual(JSON.stringify(weightSpecs1).length);
        expect(saveResult.modelArtifactsInfo.weightDataBytes).toEqual(16);
        const jsonAnchor = fakeAnchors[0];
        const weightDataAnchor = fakeAnchors[1];
        expect(jsonAnchor.download).toEqual('test-model.json');
        expect(weightDataAnchor.download).toEqual('test-model.weights.bin');
        // Verify the content of the JSON file.
        const jsonContent = await fetch(jsonAnchor.href);
        const modelTopologyAndWeightsManifest = JSON.parse(await jsonContent.text());
        expect(modelTopologyAndWeightsManifest.modelTopology)
            .toEqual(modelTopology1);
        const weightsManifest = modelTopologyAndWeightsManifest.weightsManifest;
        expect(weightsManifest.length).toEqual(1);
        expect(weightsManifest[0].paths).toEqual(['./test-model.weights.bin']);
        expect(weightsManifest[0].weights).toEqual(weightSpecs1);
        // Verify the content of the binary weights file.
        const response = await fetch(weightDataAnchor.href);
        const buffer = await response.arrayBuffer();
        expect(buffer).toEqual(weightData1);
        // Verify that the downloads are triggered through clicks.
        expect(jsonAnchor.clicked).toEqual(1);
        expect(weightDataAnchor.clicked).toEqual(1);
    });
    it('No file name provided, with existing anchors', async () => {
        const testStartDate = new Date();
        const downloadTrigger = browserDownloads();
        const saveResult = await downloadTrigger.save(artifacts1);
        expect(saveResult.errors).toEqual(undefined);
        const artifactsInfo = saveResult.modelArtifactsInfo;
        expect(artifactsInfo.dateSaved.getTime())
            .toBeGreaterThanOrEqual(testStartDate.getTime());
        expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
            .toEqual(JSON.stringify(modelTopology1).length);
        expect(saveResult.modelArtifactsInfo.weightSpecsBytes)
            .toEqual(JSON.stringify(weightSpecs1).length);
        expect(saveResult.modelArtifactsInfo.weightDataBytes).toEqual(16);
        const jsonAnchor = fakeAnchors[0];
        const weightDataAnchor = fakeAnchors[1];
        // Verify that the default file names are used.
        expect(jsonAnchor.download).toEqual('model.json');
        expect(weightDataAnchor.download).toEqual('model.weights.bin');
        // Verify the content of the JSON file.
        const jsonContent = await fetch(jsonAnchor.href);
        const modelTopologyAndWeightsManifest = JSON.parse(await jsonContent.text());
        expect(modelTopologyAndWeightsManifest.modelTopology)
            .toEqual(modelTopology1);
        const weightsManifest = modelTopologyAndWeightsManifest.weightsManifest;
        expect(weightsManifest.length).toEqual(1);
        expect(weightsManifest[0].paths).toEqual(['./model.weights.bin']);
        expect(weightsManifest[0].weights).toEqual(weightSpecs1);
        // Verify the content of the binary weights file.
        const response = await fetch(weightDataAnchor.href);
        const buffer = await response.arrayBuffer();
        expect(buffer).toEqual(weightData1);
    });
    it('Download only model topology', async () => {
        const testStartDate = new Date();
        const downloadTrigger = browserDownloads();
        const modelTopologyOnlyArtifacts = {
            modelTopology: modelTopology1,
        };
        const saveResult = await downloadTrigger.save(modelTopologyOnlyArtifacts);
        expect(saveResult.errors).toEqual(undefined);
        const artifactsInfo = saveResult.modelArtifactsInfo;
        expect(artifactsInfo.dateSaved.getTime())
            .toBeGreaterThanOrEqual(testStartDate.getTime());
        expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
            .toEqual(JSON.stringify(modelTopology1).length);
        expect(saveResult.modelArtifactsInfo.weightSpecsBytes).toEqual(0);
        expect(saveResult.modelArtifactsInfo.weightDataBytes).toEqual(0);
        const jsonAnchor = fakeAnchors[0];
        const weightDataAnchor = fakeAnchors[1];
        // Verify that the default file names are used.
        expect(jsonAnchor.download).toEqual('model.json');
        expect(jsonAnchor.clicked).toEqual(1);
        // The weight file should not have been downoaded.
        expect(weightDataAnchor.download).toEqual(undefined);
        expect(weightDataAnchor.clicked).toEqual(0);
        // Verify the content of the JSON file.
        const jsonContent = await fetch(jsonAnchor.href);
        const modelTopologyAndWeightsManifest = JSON.parse(await jsonContent.text());
        expect(modelTopologyAndWeightsManifest.modelTopology)
            .toEqual(modelTopology1);
    });
    it('browserDownloadsRouter', () => {
        expect(browserDownloadsRouter('downloads://foo') instanceof BrowserDownloads)
            .toEqual(true);
        expect(browserDownloadsRouter('invaliddownloads://foo')).toBeNull();
        expect(browserDownloadsRouter('foo')).toBeNull();
    });
});
describeWithFlags('browserFiles', BROWSER_ENVS, () => {
    const weightsFile = new File([weightData1], 'model.weights.bin', { type: 'application/octet-stream' });
    it('One group, one path', async () => {
        const weightsManifest = [{
                paths: ['./model.weights.bin'],
                weights: weightSpecs1,
            }];
        const modelJSON = {
            modelTopology: modelTopology1,
            weightsManifest,
            format: 'layers-model',
            generatedBy: 'TensorFlow.js v0.0.0',
            convertedBy: '1.13.1',
            modelInitializer: {},
            trainingConfig: trainingConfig1,
        };
        const jsonFile = new File([JSON.stringify(modelJSON)], 'model.json', { type: 'application/json' });
        const filesHandler = tf.io.browserFiles([jsonFile, weightsFile]);
        const modelArtifacts = await filesHandler.load();
        expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
        expect(modelArtifacts.weightSpecs).toEqual(weightSpecs1);
        expect(modelArtifacts.format).toEqual('layers-model');
        expect(modelArtifacts.generatedBy).toEqual('TensorFlow.js v0.0.0');
        expect(modelArtifacts.convertedBy).toEqual('1.13.1');
        expect(modelArtifacts.modelInitializer).toEqual({});
        expect(modelArtifacts.trainingConfig).toEqual(trainingConfig1);
        expect(new Uint8Array(modelArtifacts.weightData))
            .toEqual(new Uint8Array(weightData1));
    });
    it(`One group, two paths`, async () => {
        const weightSpecs = [
            {
                name: 'foo',
                shape: [1, 1],
                dtype: 'float32',
            },
            {
                name: 'bar',
                shape: [1, 1],
                dtype: 'float32',
            }
        ];
        const weightsManifest = [{
                paths: ['./dir1/model.weights.1.bin', './dir2/model.weights.2.bin'],
                weights: weightSpecs,
            }];
        const weightsTopologyAndManifest = {
            modelTopology: modelTopology1,
            weightsManifest,
        };
        const weightsFile1 = new File([new Uint8Array([1, 2, 3, 4]).buffer], 'model.weights.1.bin', { type: 'application/octet-stream' });
        const weightsFile2 = new File([new Uint8Array([10, 20, 30, 40]).buffer], 'model.weights.2.bin', { type: 'application/octet-stream' });
        const jsonFile = new File([JSON.stringify(weightsTopologyAndManifest)], 'model.json', { type: 'application/json' });
        const filesHandler = tf.io.browserFiles([jsonFile, weightsFile1, weightsFile2]);
        const modelArtifacts = await filesHandler.load();
        expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
        expect(modelArtifacts.weightSpecs).toEqual(weightSpecs);
        expect(new Uint8Array(modelArtifacts.weightData)).toEqual(new Uint8Array([
            1, 2, 3, 4, 10, 20, 30, 40
        ]));
    });
    it(`Two groups, four paths, reverseOrder=false`, async () => {
        const weightSpecs1 = [
            {
                name: 'foo',
                shape: [1, 1],
                dtype: 'float32',
            },
            {
                name: 'bar',
                shape: [1, 1],
                dtype: 'float32',
            }
        ];
        const weightSpecs2 = [
            {
                name: 'baz',
                shape: [1, 1],
                dtype: 'float32',
            },
            {
                name: 'qux',
                shape: [1, 1],
                dtype: 'float32',
            }
        ];
        const weightsManifest = [
            {
                paths: ['./model.weights.1.bin', './model.weights.2.bin'],
                weights: weightSpecs1,
            },
            {
                paths: ['./model.weights.3.bin', './model.weights.4.bin'],
                weights: weightSpecs2,
            }
        ];
        const weightsTopologyAndManifest = {
            modelTopology: modelTopology1,
            weightsManifest,
        };
        const weightsFile1 = new File([new Uint8Array([1, 3, 5, 7]).buffer], 'model.weights.1.bin', { type: 'application/octet-stream' });
        const weightsFile2 = new File([new Uint8Array([10, 30, 50, 70]).buffer], 'model.weights.2.bin', { type: 'application/octet-stream' });
        const weightsFile3 = new File([new Uint8Array([2, 4, 6, 8]).buffer], 'model.weights.3.bin', { type: 'application/octet-stream' });
        const weightsFile4 = new File([new Uint8Array([20, 40, 60, 80]).buffer], 'model.weights.4.bin', { type: 'application/octet-stream' });
        const jsonFile = new File([JSON.stringify(weightsTopologyAndManifest)], 'model.json', { type: 'application/json' });
        const filesHandler = tf.io.browserFiles([jsonFile, weightsFile1, weightsFile2, weightsFile3, weightsFile4]);
        const modelArtifacts = await filesHandler.load();
        expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
        expect(modelArtifacts.weightSpecs)
            .toEqual(weightSpecs1.concat(weightSpecs2));
        expect(new Uint8Array(modelArtifacts.weightData)).toEqual(new Uint8Array([
            1, 3, 5, 7, 10, 30, 50, 70, 2, 4, 6, 8, 20, 40, 60, 80
        ]));
    });
    it(`Two groups, four paths, reverseOrder=true`, async () => {
        const weightSpecs1 = [
            {
                name: 'foo',
                shape: [1, 1],
                dtype: 'float32',
            },
            {
                name: 'bar',
                shape: [1, 1],
                dtype: 'float32',
            }
        ];
        const weightSpecs2 = [
            {
                name: 'baz',
                shape: [1, 1],
                dtype: 'float32',
            },
            {
                name: 'qux',
                shape: [1, 1],
                dtype: 'float32',
            }
        ];
        const weightsManifest = [
            {
                paths: ['./model.weights.1.bin', './model.weights.2.bin'],
                weights: weightSpecs1,
            },
            {
                paths: ['./model.weights.3.bin', './model.weights.4.bin'],
                weights: weightSpecs2,
            }
        ];
        const weightsTopologyAndManifest = {
            modelTopology: modelTopology1,
            weightsManifest,
        };
        const weightsFile1 = new File([new Uint8Array([1, 3, 5, 7]).buffer], 'model.weights.1.bin', { type: 'application/octet-stream' });
        const weightsFile2 = new File([new Uint8Array([10, 30, 50, 70]).buffer], 'model.weights.2.bin', { type: 'application/octet-stream' });
        const weightsFile3 = new File([new Uint8Array([2, 4, 6, 8]).buffer], 'model.weights.3.bin', { type: 'application/octet-stream' });
        const weightsFile4 = new File([new Uint8Array([20, 40, 60, 80]).buffer], 'model.weights.4.bin', { type: 'application/octet-stream' });
        const jsonFile = new File([JSON.stringify(weightsTopologyAndManifest)], 'model.json', { type: 'application/json' });
        const filesHandler = tf.io.browserFiles([jsonFile, weightsFile4, weightsFile3, weightsFile2, weightsFile1]);
        const modelArtifacts = await filesHandler.load();
        expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
        expect(modelArtifacts.weightSpecs)
            .toEqual(weightSpecs1.concat(weightSpecs2));
        expect(new Uint8Array(modelArtifacts.weightData)).toEqual(new Uint8Array([
            1, 3, 5, 7, 10, 30, 50, 70, 2, 4, 6, 8, 20, 40, 60, 80
        ]));
    });
    it('Upload model topology only', async () => {
        const weightsManifest = [{
                paths: ['./model.weights.bin'],
                weights: weightSpecs1,
            }];
        const weightsTopologyAndManifest = {
            modelTopology: modelTopology1,
            weightsManifest,
        };
        const jsonFile = new File([JSON.stringify(weightsTopologyAndManifest)], 'model.json', { type: 'application/json' });
        // Select only a JSON file.
        const filesHandler = tf.io.browserFiles([jsonFile]);
        const modelArtifacts = await filesHandler.load();
        expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
        expect(modelArtifacts.weightSpecs).toEqual(undefined);
    });
    it('Mismatch in number of paths and number of files', async () => {
        const weightsManifest = [{
                paths: ['./model.weights.1.bin'],
                weights: weightSpecs1,
            }];
        const weightsTopologyAndManifest = {
            modelTopology: weightSpecs1,
            weightsManifest,
        };
        const weightsFile1 = new File([new Uint8Array([1, 2, 3, 4]).buffer], 'model.weights.1.bin', { type: 'application/octet-stream' });
        const weightsFile2 = new File([new Uint8Array([10, 20, 30, 40]).buffer], 'model.weights.2.bin', { type: 'application/octet-stream' });
        const jsonFile = new File([JSON.stringify(weightsTopologyAndManifest)], 'model.json', { type: 'application/json' });
        // Supply two weights files while the manifest has only one path. This is
        // expected to fail.
        const filesHandler = tf.io.browserFiles([jsonFile, weightsFile2, weightsFile1]);
        try {
            await filesHandler.load();
            fail('Loading with mismatch in number of paths and number of files ' +
                'succeeded unexpectedly.');
        }
        catch (err) {
            expect(err.message)
                .toEqual('Mismatch in the number of files in weights manifest (1) ' +
                'and the number of weight files provided (2).');
        }
    });
    it('Mismatch in manifest paths and file names', async () => {
        const weightSpecs = [
            {
                name: 'foo',
                shape: [1, 1],
                dtype: 'float32',
            },
            {
                name: 'bar',
                shape: [1, 1],
                dtype: 'float32',
            }
        ];
        const weightsManifest = [{
                paths: ['./model.weights.1.bin', './model.weights.2.bin'],
                weights: weightSpecs,
            }];
        const weightsTopologyAndManifest = {
            modelTopology: modelTopology1,
            weightsManifest,
        };
        const weightsFile1 = new File([new Uint8Array([1, 2, 3, 4]).buffer], 'model.weights.1.bin', { type: 'application/octet-stream' });
        const weightsFile2 = new File([new Uint8Array([10, 20, 30, 40]).buffer], 'model.weights.3.bin', { type: 'application/octet-stream' });
        // Notice the wrong file name here. It is expected to cause load() to
        // fail.
        const jsonFile = new File([JSON.stringify(weightsTopologyAndManifest)], 'model.json', { type: 'application/json' });
        const filesHandler = tf.io.browserFiles([jsonFile, weightsFile1, weightsFile2]);
        try {
            await filesHandler.load();
            fail('Loading with mismatching paths and file names ' +
                'succeeded unexpectedly.');
        }
        catch (err) {
            expect(err.message)
                .toEqual('Weight file with basename \'model.weights.2.bin\' is not ' +
                'provided.');
        }
    });
    it('Duplicate basenames in paths fails', async () => {
        const weightSpecs = [
            {
                name: 'foo',
                shape: [1, 1],
                dtype: 'float32',
            },
            {
                name: 'bar',
                shape: [1, 1],
                dtype: 'float32',
            }
        ];
        // Notice the duplicate basenames here (albeit distinct full paths). This
        // is expected to cause load() to fail.
        const weightsManifest = [{
                paths: ['./dir1/model.weights.1.bin', './dir2/model.weights.1.bin'],
                weights: weightSpecs,
            }];
        const weightsTopologyAndManifest = {
            modelTopology: modelTopology1,
            weightsManifest,
        };
        const weightsFile1 = new File([new Uint8Array([1, 2, 3, 4]).buffer], 'model.weights.1.bin', { type: 'application/octet-stream' });
        const weightsFile2 = new File([new Uint8Array([10, 20, 30, 40]).buffer], 'model.weights.2.bin', { type: 'application/octet-stream' });
        // Notice the wrong file name here. It is expected to cause load() to
        // fail.
        const jsonFile = new File([JSON.stringify(weightsTopologyAndManifest)], 'model.json', { type: 'application/json' });
        const filesHandler = tf.io.browserFiles([jsonFile, weightsFile1, weightsFile2]);
        try {
            await filesHandler.load();
            fail('Loading with duplicate basenames in paths succeeded unexpectedly.');
        }
        catch (err) {
            expect(err.message)
                .toEqual('Duplicate file basename found in weights manifest: ' +
                '\'model.weights.1.bin\'');
        }
    });
    it('Missing modelTopology from JSON leads to Error', async () => {
        const weightsManifest = [{
                paths: ['./model.weights.bin'],
                weights: weightSpecs1,
            }];
        const weightsTopologyAndManifest = {
            weightsManifest,
        };
        const jsonFile = new File([JSON.stringify(weightsTopologyAndManifest)], 'model.json', { type: 'application/json' });
        const filesHandler = tf.io.browserFiles([jsonFile, weightsFile]);
        try {
            await filesHandler.load();
            fail('Loading with Files IOHandler with missing modelTopology ' +
                'succeeded unexpectedly.');
        }
        catch (err) {
            expect(err.message)
                .toMatch(/modelTopology field is missing from file model\.json/);
        }
    });
    it('Incorrect number of files leads to Error', () => {
        expect(() => tf.io.browserFiles(null)).toThrowError(/at least 1 file/);
        expect(() => tf.io.browserFiles([])).toThrowError(/at least 1 file/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlcl9maWxlc190ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9pby9icm93c2VyX2ZpbGVzX3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUg7O0dBRUc7QUFFSCxPQUFPLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMvQixPQUFPLEVBQUMsWUFBWSxFQUFFLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDaEUsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLHNCQUFzQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFHM0YsTUFBTSxjQUFjLEdBQU87SUFDekIsWUFBWSxFQUFFLFlBQVk7SUFDMUIsZUFBZSxFQUFFLE9BQU87SUFDeEIsUUFBUSxFQUFFLENBQUM7WUFDVCxZQUFZLEVBQUUsT0FBTztZQUNyQixRQUFRLEVBQUU7Z0JBQ1Isb0JBQW9CLEVBQUU7b0JBQ3BCLFlBQVksRUFBRSxpQkFBaUI7b0JBQy9CLFFBQVEsRUFBRTt3QkFDUixjQUFjLEVBQUUsU0FBUzt3QkFDekIsT0FBTyxFQUFFLEdBQUc7d0JBQ1osTUFBTSxFQUFFLElBQUk7d0JBQ1osTUFBTSxFQUFFLFNBQVM7cUJBQ2xCO2lCQUNGO2dCQUNELE1BQU0sRUFBRSxPQUFPO2dCQUNmLG1CQUFtQixFQUFFLElBQUk7Z0JBQ3pCLGtCQUFrQixFQUFFLElBQUk7Z0JBQ3hCLGlCQUFpQixFQUFFLElBQUk7Z0JBQ3ZCLE9BQU8sRUFBRSxTQUFTO2dCQUNsQixZQUFZLEVBQUUsUUFBUTtnQkFDdEIsV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLG9CQUFvQixFQUFFLElBQUk7Z0JBQzFCLGtCQUFrQixFQUFFLEVBQUMsWUFBWSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDO2dCQUN6RCxPQUFPLEVBQUUsQ0FBQztnQkFDVixt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QUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUN2RSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG4vKipcbiAqIFVuaXQgdGVzdHMgZm9yIGZpbGUtcmVsYXRlZCBJT0hhbmRsZXJzLlxuICovXG5cbmltcG9ydCAqIGFzIHRmIGZyb20gJy4uL2luZGV4JztcbmltcG9ydCB7QlJPV1NFUl9FTlZTLCBkZXNjcmliZVdpdGhGbGFnc30gZnJvbSAnLi4vamFzbWluZV91dGlsJztcbmltcG9ydCB7YnJvd3NlckRvd25sb2FkcywgQnJvd3NlckRvd25sb2FkcywgYnJvd3NlckRvd25sb2Fkc1JvdXRlcn0gZnJvbSAnLi9icm93c2VyX2ZpbGVzJztcbmltcG9ydCB7V2VpZ2h0c01hbmlmZXN0Q29uZmlnLCBXZWlnaHRzTWFuaWZlc3RFbnRyeX0gZnJvbSAnLi90eXBlcyc7XG5cbmNvbnN0IG1vZGVsVG9wb2xvZ3kxOiB7fSA9IHtcbiAgJ2NsYXNzX25hbWUnOiAnU2VxdWVudGlhbCcsXG4gICdrZXJhc192ZXJzaW9uJzogJzIuMS40JyxcbiAgJ2NvbmZpZyc6IFt7XG4gICAgJ2NsYXNzX25hbWUnOiAnRGVuc2UnLFxuICAgICdjb25maWcnOiB7XG4gICAgICAna2VybmVsX2luaXRpYWxpemVyJzoge1xuICAgICAgICAnY2xhc3NfbmFtZSc6ICdWYXJpYW5jZVNjYWxpbmcnLFxuICAgICAgICAnY29uZmlnJzoge1xuICAgICAgICAgICdkaXN0cmlidXRpb24nOiAndW5pZm9ybScsXG4gICAgICAgICAgJ3NjYWxlJzogMS4wLFxuICAgICAgICAgICdzZWVkJzogbnVsbCxcbiAgICAgICAgICAnbW9kZSc6ICdmYW5fYXZnJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ25hbWUnOiAnZGVuc2UnLFxuICAgICAgJ2tlcm5lbF9jb25zdHJhaW50JzogbnVsbCxcbiAgICAgICdiaWFzX3JlZ3VsYXJpemVyJzogbnVsbCxcbiAgICAgICdiaWFzX2NvbnN0cmFpbnQnOiBudWxsLFxuICAgICAgJ2R0eXBlJzogJ2Zsb2F0MzInLFxuICAgICAgJ2FjdGl2YXRpb24nOiAnbGluZWFyJyxcbiAgICAgICd0cmFpbmFibGUnOiB0cnVlLFxuICAgICAgJ2tlcm5lbF9yZWd1bGFyaXplcic6IG51bGwsXG4gICAgICAnYmlhc19pbml0aWFsaXplcic6IHsnY2xhc3NfbmFtZSc6ICdaZXJvcycsICdjb25maWcnOiB7fX0sXG4gICAgICAndW5pdHMnOiAxLFxuICAgICAgJ2JhdGNoX2lucHV0X3NoYXBlJzogW251bGwsIDNdLFxuICAgICAgJ3VzZV9iaWFzJzogdHJ1ZSxcbiAgICAgICdhY3Rpdml0eV9yZWd1bGFyaXplcic6IG51bGxcbiAgICB9XG4gIH1dLFxuICAnYmFja2VuZCc6ICd0ZW5zb3JmbG93J1xufTtcbmNvbnN0IHdlaWdodFNwZWNzMTogdGYuaW8uV2VpZ2h0c01hbmlmZXN0RW50cnlbXSA9IFtcbiAge1xuICAgIG5hbWU6ICdkZW5zZS9rZXJuZWwnLFxuICAgIHNoYXBlOiBbMywgMV0sXG4gICAgZHR5cGU6ICdmbG9hdDMyJyxcbiAgfSxcbiAge1xuICAgIG5hbWU6ICdkZW5zZS9iaWFzJyxcbiAgICBzaGFwZTogWzFdLFxuICAgIGR0eXBlOiAnZmxvYXQzMicsXG4gIH1cbl07XG5jb25zdCB3ZWlnaHREYXRhMSA9IG5ldyBBcnJheUJ1ZmZlcigxNik7XG5jb25zdCB0cmFpbmluZ0NvbmZpZzE6IHRmLmlvLlRyYWluaW5nQ29uZmlnID0ge1xuICBsb3NzOiAnY2F0ZWdvcmljYWxfY3Jvc3NlbnRyb3B5JyxcbiAgbWV0cmljczogWydhY2N1cmFjeSddLFxuICBvcHRpbWl6ZXJfY29uZmlnOiB7Y2xhc3NfbmFtZTogJ1NHRCcsIGNvbmZpZzoge2xlYXJuaW5nUmF0ZTogMC4xfX1cbn07XG5cbmNvbnN0IGFydGlmYWN0czE6IHRmLmlvLk1vZGVsQXJ0aWZhY3RzID0ge1xuICBtb2RlbFRvcG9sb2d5OiBtb2RlbFRvcG9sb2d5MSxcbiAgd2VpZ2h0U3BlY3M6IHdlaWdodFNwZWNzMSxcbiAgd2VpZ2h0RGF0YTogd2VpZ2h0RGF0YTEsXG4gIGZvcm1hdDogJ2xheWVycy1tb2RlbCcsXG4gIGdlbmVyYXRlZEJ5OiAnVGVuc29yRmxvdy5qcyB2MC4wLjAnLFxuICBjb252ZXJ0ZWRCeTogbnVsbCxcbiAgbW9kZWxJbml0aWFsaXplcjoge30sXG4gIHRyYWluaW5nQ29uZmlnOiB0cmFpbmluZ0NvbmZpZzEsXG59O1xuXG5kZXNjcmliZVdpdGhGbGFncygnYnJvd3NlckRvd25sb2FkcycsIEJST1dTRVJfRU5WUywgKCkgPT4ge1xuICBjbGFzcyBGYWtlSFRNTEFuY2hvckVsZW1lbnQge1xuICAgIGRvd25sb2FkOiBzdHJpbmc7XG4gICAgaHJlZjogc3RyaW5nO1xuICAgIGNsaWNrZWQ6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgdGhpcy5jbGlja2VkID0gMDtcbiAgICB9XG5cbiAgICBkaXNwYXRjaEV2ZW50KCkge1xuICAgICAgdGhpcy5jbGlja2VkKys7XG4gICAgfVxuICB9XG5cbiAgbGV0IGZha2VBbmNob3JzOiBGYWtlSFRNTEFuY2hvckVsZW1lbnRbXSA9IFtdO1xuICBsZXQgZmFrZUFuY2hvckNvdW50ID0gMDtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBmYWtlQW5jaG9yQ291bnQgPSAwO1xuICAgIGZha2VBbmNob3JzID0gW25ldyBGYWtlSFRNTEFuY2hvckVsZW1lbnQoKSwgbmV3IEZha2VIVE1MQW5jaG9yRWxlbWVudCgpXTtcbiAgICBzcHlPbihkb2N1bWVudCwgJ2NyZWF0ZUVsZW1lbnQnKS5hbmQuY2FsbEZha2UoKHRhZzogc3RyaW5nKSA9PiB7XG4gICAgICByZXR1cm4gZmFrZUFuY2hvcnNbZmFrZUFuY2hvckNvdW50KytdIGFzIHVua25vd24gYXMgSFRNTEVsZW1lbnQ7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdFeHBsaWNpdCBmaWxlIG5hbWUgcHJlZml4LCB3aXRoIGV4aXN0aW5nIGFuY2hvcnMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdGVzdFN0YXJ0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgZG93bmxvYWRUcmlnZ2VyID0gdGYuaW8uZ2V0U2F2ZUhhbmRsZXJzKCdkb3dubG9hZHM6Ly90ZXN0LW1vZGVsJylbMF07XG4gICAgY29uc3Qgc2F2ZVJlc3VsdCA9IGF3YWl0IGRvd25sb2FkVHJpZ2dlci5zYXZlKGFydGlmYWN0czEpO1xuICAgIGV4cGVjdChzYXZlUmVzdWx0LmVycm9ycykudG9FcXVhbCh1bmRlZmluZWQpO1xuICAgIGNvbnN0IGFydGlmYWN0c0luZm8gPSBzYXZlUmVzdWx0Lm1vZGVsQXJ0aWZhY3RzSW5mbztcbiAgICBleHBlY3QoYXJ0aWZhY3RzSW5mby5kYXRlU2F2ZWQuZ2V0VGltZSgpKVxuICAgICAgICAudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCh0ZXN0U3RhcnREYXRlLmdldFRpbWUoKSk7XG4gICAgZXhwZWN0KHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvLm1vZGVsVG9wb2xvZ3lCeXRlcylcbiAgICAgICAgLnRvRXF1YWwoSlNPTi5zdHJpbmdpZnkobW9kZWxUb3BvbG9neTEpLmxlbmd0aCk7XG4gICAgZXhwZWN0KHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvLndlaWdodFNwZWNzQnl0ZXMpXG4gICAgICAgIC50b0VxdWFsKEpTT04uc3RyaW5naWZ5KHdlaWdodFNwZWNzMSkubGVuZ3RoKTtcbiAgICBleHBlY3Qoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8ud2VpZ2h0RGF0YUJ5dGVzKS50b0VxdWFsKDE2KTtcblxuICAgIGNvbnN0IGpzb25BbmNob3IgPSBmYWtlQW5jaG9yc1swXTtcbiAgICBjb25zdCB3ZWlnaHREYXRhQW5jaG9yID0gZmFrZUFuY2hvcnNbMV07XG4gICAgZXhwZWN0KGpzb25BbmNob3IuZG93bmxvYWQpLnRvRXF1YWwoJ3Rlc3QtbW9kZWwuanNvbicpO1xuICAgIGV4cGVjdCh3ZWlnaHREYXRhQW5jaG9yLmRvd25sb2FkKS50b0VxdWFsKCd0ZXN0LW1vZGVsLndlaWdodHMuYmluJyk7XG5cbiAgICAvLyBWZXJpZnkgdGhlIGNvbnRlbnQgb2YgdGhlIEpTT04gZmlsZS5cbiAgICBjb25zdCBqc29uQ29udGVudCA9IGF3YWl0IGZldGNoKGpzb25BbmNob3IuaHJlZik7XG4gICAgY29uc3QgbW9kZWxKU09OID0gSlNPTi5wYXJzZShhd2FpdCBqc29uQ29udGVudC50ZXh0KCkpIGFzIHRmLmlvLk1vZGVsSlNPTjtcbiAgICBleHBlY3QobW9kZWxKU09OLm1vZGVsVG9wb2xvZ3kpLnRvRXF1YWwobW9kZWxUb3BvbG9neTEpO1xuICAgIGV4cGVjdChtb2RlbEpTT04uZm9ybWF0KS50b0VxdWFsKCdsYXllcnMtbW9kZWwnKTtcbiAgICBleHBlY3QobW9kZWxKU09OLmdlbmVyYXRlZEJ5KS50b0VxdWFsKCdUZW5zb3JGbG93LmpzIHYwLjAuMCcpO1xuICAgIGV4cGVjdChtb2RlbEpTT04uY29udmVydGVkQnkpLnRvRXF1YWwobnVsbCk7XG4gICAgZXhwZWN0KG1vZGVsSlNPTi5tb2RlbEluaXRpYWxpemVyKS50b0VxdWFsKHt9KTtcbiAgICBleHBlY3QobW9kZWxKU09OLnRyYWluaW5nQ29uZmlnKS50b0VxdWFsKHRyYWluaW5nQ29uZmlnMSk7XG5cbiAgICBjb25zdCB3ZWlnaHRzTWFuaWZlc3QgPSBtb2RlbEpTT04ud2VpZ2h0c01hbmlmZXN0O1xuICAgIGV4cGVjdCh3ZWlnaHRzTWFuaWZlc3QubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdCh3ZWlnaHRzTWFuaWZlc3RbMF0ucGF0aHMpLnRvRXF1YWwoWycuL3Rlc3QtbW9kZWwud2VpZ2h0cy5iaW4nXSk7XG4gICAgZXhwZWN0KHdlaWdodHNNYW5pZmVzdFswXS53ZWlnaHRzKS50b0VxdWFsKHdlaWdodFNwZWNzMSk7XG5cbiAgICAvLyBWZXJpZnkgdGhlIGNvbnRlbnQgb2YgdGhlIGJpbmFyeSB3ZWlnaHRzIGZpbGUuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh3ZWlnaHREYXRhQW5jaG9yLmhyZWYpO1xuICAgIGNvbnN0IGJ1ZmZlciA9IGF3YWl0IHJlc3BvbnNlLmFycmF5QnVmZmVyKCk7XG4gICAgZXhwZWN0KGJ1ZmZlcikudG9FcXVhbCh3ZWlnaHREYXRhMSk7XG5cbiAgICAvLyBWZXJpZnkgdGhhdCB0aGUgZG93bmxvYWRzIGFyZSB0cmlnZ2VyZWQgdGhyb3VnaCBjbGlja3MuXG4gICAgZXhwZWN0KGpzb25BbmNob3IuY2xpY2tlZCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3Qod2VpZ2h0RGF0YUFuY2hvci5jbGlja2VkKS50b0VxdWFsKDEpO1xuICB9KTtcblxuICBpdCgnVVJMIHNjaGVtZSBpbiBleHBsaWNpdCBuYW1lIGdldHMgc3RyaXBwZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdGVzdFN0YXJ0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgZG93bmxvYWRUcmlnZ2VyID0gYnJvd3NlckRvd25sb2FkcygnZG93bmxvYWRzOi8vdGVzdC1tb2RlbCcpO1xuICAgIGNvbnN0IHNhdmVSZXN1bHQgPSBhd2FpdCBkb3dubG9hZFRyaWdnZXIuc2F2ZShhcnRpZmFjdHMxKTtcbiAgICBleHBlY3Qoc2F2ZVJlc3VsdC5lcnJvcnMpLnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgICBjb25zdCBhcnRpZmFjdHNJbmZvID0gc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm87XG4gICAgZXhwZWN0KGFydGlmYWN0c0luZm8uZGF0ZVNhdmVkLmdldFRpbWUoKSlcbiAgICAgICAgLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwodGVzdFN0YXJ0RGF0ZS5nZXRUaW1lKCkpO1xuICAgIGV4cGVjdChzYXZlUmVzdWx0Lm1vZGVsQXJ0aWZhY3RzSW5mby5tb2RlbFRvcG9sb2d5Qnl0ZXMpXG4gICAgICAgIC50b0VxdWFsKEpTT04uc3RyaW5naWZ5KG1vZGVsVG9wb2xvZ3kxKS5sZW5ndGgpO1xuICAgIGV4cGVjdChzYXZlUmVzdWx0Lm1vZGVsQXJ0aWZhY3RzSW5mby53ZWlnaHRTcGVjc0J5dGVzKVxuICAgICAgICAudG9FcXVhbChKU09OLnN0cmluZ2lmeSh3ZWlnaHRTcGVjczEpLmxlbmd0aCk7XG4gICAgZXhwZWN0KHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvLndlaWdodERhdGFCeXRlcykudG9FcXVhbCgxNik7XG5cbiAgICBjb25zdCBqc29uQW5jaG9yID0gZmFrZUFuY2hvcnNbMF07XG4gICAgY29uc3Qgd2VpZ2h0RGF0YUFuY2hvciA9IGZha2VBbmNob3JzWzFdO1xuICAgIGV4cGVjdChqc29uQW5jaG9yLmRvd25sb2FkKS50b0VxdWFsKCd0ZXN0LW1vZGVsLmpzb24nKTtcbiAgICBleHBlY3Qod2VpZ2h0RGF0YUFuY2hvci5kb3dubG9hZCkudG9FcXVhbCgndGVzdC1tb2RlbC53ZWlnaHRzLmJpbicpO1xuXG4gICAgLy8gVmVyaWZ5IHRoZSBjb250ZW50IG9mIHRoZSBKU09OIGZpbGUuXG4gICAgY29uc3QganNvbkNvbnRlbnQgPSBhd2FpdCBmZXRjaChqc29uQW5jaG9yLmhyZWYpO1xuICAgIGNvbnN0IG1vZGVsVG9wb2xvZ3lBbmRXZWlnaHRzTWFuaWZlc3QgPVxuICAgICAgICBKU09OLnBhcnNlKGF3YWl0IGpzb25Db250ZW50LnRleHQoKSk7XG4gICAgZXhwZWN0KG1vZGVsVG9wb2xvZ3lBbmRXZWlnaHRzTWFuaWZlc3QubW9kZWxUb3BvbG9neSlcbiAgICAgICAgLnRvRXF1YWwobW9kZWxUb3BvbG9neTEpO1xuICAgIGNvbnN0IHdlaWdodHNNYW5pZmVzdCA9IG1vZGVsVG9wb2xvZ3lBbmRXZWlnaHRzTWFuaWZlc3Qud2VpZ2h0c01hbmlmZXN0IGFzXG4gICAgICAgIFdlaWdodHNNYW5pZmVzdENvbmZpZztcbiAgICBleHBlY3Qod2VpZ2h0c01hbmlmZXN0Lmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3Qod2VpZ2h0c01hbmlmZXN0WzBdLnBhdGhzKS50b0VxdWFsKFsnLi90ZXN0LW1vZGVsLndlaWdodHMuYmluJ10pO1xuICAgIGV4cGVjdCh3ZWlnaHRzTWFuaWZlc3RbMF0ud2VpZ2h0cykudG9FcXVhbCh3ZWlnaHRTcGVjczEpO1xuXG4gICAgLy8gVmVyaWZ5IHRoZSBjb250ZW50IG9mIHRoZSBiaW5hcnkgd2VpZ2h0cyBmaWxlLlxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2god2VpZ2h0RGF0YUFuY2hvci5ocmVmKTtcbiAgICBjb25zdCBidWZmZXIgPSBhd2FpdCByZXNwb25zZS5hcnJheUJ1ZmZlcigpO1xuICAgIGV4cGVjdChidWZmZXIpLnRvRXF1YWwod2VpZ2h0RGF0YTEpO1xuXG4gICAgLy8gVmVyaWZ5IHRoYXQgdGhlIGRvd25sb2FkcyBhcmUgdHJpZ2dlcmVkIHRocm91Z2ggY2xpY2tzLlxuICAgIGV4cGVjdChqc29uQW5jaG9yLmNsaWNrZWQpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KHdlaWdodERhdGFBbmNob3IuY2xpY2tlZCkudG9FcXVhbCgxKTtcbiAgfSk7XG5cbiAgaXQoJ05vIGZpbGUgbmFtZSBwcm92aWRlZCwgd2l0aCBleGlzdGluZyBhbmNob3JzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHRlc3RTdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGRvd25sb2FkVHJpZ2dlciA9IGJyb3dzZXJEb3dubG9hZHMoKTtcbiAgICBjb25zdCBzYXZlUmVzdWx0ID0gYXdhaXQgZG93bmxvYWRUcmlnZ2VyLnNhdmUoYXJ0aWZhY3RzMSk7XG4gICAgZXhwZWN0KHNhdmVSZXN1bHQuZXJyb3JzKS50b0VxdWFsKHVuZGVmaW5lZCk7XG4gICAgY29uc3QgYXJ0aWZhY3RzSW5mbyA9IHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvO1xuICAgIGV4cGVjdChhcnRpZmFjdHNJbmZvLmRhdGVTYXZlZC5nZXRUaW1lKCkpXG4gICAgICAgIC50b0JlR3JlYXRlclRoYW5PckVxdWFsKHRlc3RTdGFydERhdGUuZ2V0VGltZSgpKTtcbiAgICBleHBlY3Qoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8ubW9kZWxUb3BvbG9neUJ5dGVzKVxuICAgICAgICAudG9FcXVhbChKU09OLnN0cmluZ2lmeShtb2RlbFRvcG9sb2d5MSkubGVuZ3RoKTtcbiAgICBleHBlY3Qoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8ud2VpZ2h0U3BlY3NCeXRlcylcbiAgICAgICAgLnRvRXF1YWwoSlNPTi5zdHJpbmdpZnkod2VpZ2h0U3BlY3MxKS5sZW5ndGgpO1xuICAgIGV4cGVjdChzYXZlUmVzdWx0Lm1vZGVsQXJ0aWZhY3RzSW5mby53ZWlnaHREYXRhQnl0ZXMpLnRvRXF1YWwoMTYpO1xuXG4gICAgY29uc3QganNvbkFuY2hvciA9IGZha2VBbmNob3JzWzBdO1xuICAgIGNvbnN0IHdlaWdodERhdGFBbmNob3IgPSBmYWtlQW5jaG9yc1sxXTtcblxuICAgIC8vIFZlcmlmeSB0aGF0IHRoZSBkZWZhdWx0IGZpbGUgbmFtZXMgYXJlIHVzZWQuXG4gICAgZXhwZWN0KGpzb25BbmNob3IuZG93bmxvYWQpLnRvRXF1YWwoJ21vZGVsLmpzb24nKTtcbiAgICBleHBlY3Qod2VpZ2h0RGF0YUFuY2hvci5kb3dubG9hZCkudG9FcXVhbCgnbW9kZWwud2VpZ2h0cy5iaW4nKTtcblxuICAgIC8vIFZlcmlmeSB0aGUgY29udGVudCBvZiB0aGUgSlNPTiBmaWxlLlxuICAgIGNvbnN0IGpzb25Db250ZW50ID0gYXdhaXQgZmV0Y2goanNvbkFuY2hvci5ocmVmKTtcbiAgICBjb25zdCBtb2RlbFRvcG9sb2d5QW5kV2VpZ2h0c01hbmlmZXN0ID1cbiAgICAgICAgSlNPTi5wYXJzZShhd2FpdCBqc29uQ29udGVudC50ZXh0KCkpO1xuICAgIGV4cGVjdChtb2RlbFRvcG9sb2d5QW5kV2VpZ2h0c01hbmlmZXN0Lm1vZGVsVG9wb2xvZ3kpXG4gICAgICAgIC50b0VxdWFsKG1vZGVsVG9wb2xvZ3kxKTtcbiAgICBjb25zdCB3ZWlnaHRzTWFuaWZlc3QgPSBtb2RlbFRvcG9sb2d5QW5kV2VpZ2h0c01hbmlmZXN0LndlaWdodHNNYW5pZmVzdCBhc1xuICAgICAgICBXZWlnaHRzTWFuaWZlc3RDb25maWc7XG4gICAgZXhwZWN0KHdlaWdodHNNYW5pZmVzdC5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KHdlaWdodHNNYW5pZmVzdFswXS5wYXRocykudG9FcXVhbChbJy4vbW9kZWwud2VpZ2h0cy5iaW4nXSk7XG4gICAgZXhwZWN0KHdlaWdodHNNYW5pZmVzdFswXS53ZWlnaHRzKS50b0VxdWFsKHdlaWdodFNwZWNzMSk7XG5cbiAgICAvLyBWZXJpZnkgdGhlIGNvbnRlbnQgb2YgdGhlIGJpbmFyeSB3ZWlnaHRzIGZpbGUuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh3ZWlnaHREYXRhQW5jaG9yLmhyZWYpO1xuICAgIGNvbnN0IGJ1ZmZlciA9IGF3YWl0IHJlc3BvbnNlLmFycmF5QnVmZmVyKCk7XG4gICAgZXhwZWN0KGJ1ZmZlcikudG9FcXVhbCh3ZWlnaHREYXRhMSk7XG4gIH0pO1xuXG4gIGl0KCdEb3dubG9hZCBvbmx5IG1vZGVsIHRvcG9sb2d5JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHRlc3RTdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGRvd25sb2FkVHJpZ2dlciA9IGJyb3dzZXJEb3dubG9hZHMoKTtcbiAgICBjb25zdCBtb2RlbFRvcG9sb2d5T25seUFydGlmYWN0czogdGYuaW8uTW9kZWxBcnRpZmFjdHMgPSB7XG4gICAgICBtb2RlbFRvcG9sb2d5OiBtb2RlbFRvcG9sb2d5MSxcbiAgICB9O1xuICAgIGNvbnN0IHNhdmVSZXN1bHQgPSBhd2FpdCBkb3dubG9hZFRyaWdnZXIuc2F2ZShtb2RlbFRvcG9sb2d5T25seUFydGlmYWN0cyk7XG4gICAgZXhwZWN0KHNhdmVSZXN1bHQuZXJyb3JzKS50b0VxdWFsKHVuZGVmaW5lZCk7XG4gICAgY29uc3QgYXJ0aWZhY3RzSW5mbyA9IHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvO1xuICAgIGV4cGVjdChhcnRpZmFjdHNJbmZvLmRhdGVTYXZlZC5nZXRUaW1lKCkpXG4gICAgICAgIC50b0JlR3JlYXRlclRoYW5PckVxdWFsKHRlc3RTdGFydERhdGUuZ2V0VGltZSgpKTtcbiAgICBleHBlY3Qoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8ubW9kZWxUb3BvbG9neUJ5dGVzKVxuICAgICAgICAudG9FcXVhbChKU09OLnN0cmluZ2lmeShtb2RlbFRvcG9sb2d5MSkubGVuZ3RoKTtcbiAgICBleHBlY3Qoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8ud2VpZ2h0U3BlY3NCeXRlcykudG9FcXVhbCgwKTtcbiAgICBleHBlY3Qoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8ud2VpZ2h0RGF0YUJ5dGVzKS50b0VxdWFsKDApO1xuXG4gICAgY29uc3QganNvbkFuY2hvciA9IGZha2VBbmNob3JzWzBdO1xuICAgIGNvbnN0IHdlaWdodERhdGFBbmNob3IgPSBmYWtlQW5jaG9yc1sxXTtcblxuICAgIC8vIFZlcmlmeSB0aGF0IHRoZSBkZWZhdWx0IGZpbGUgbmFtZXMgYXJlIHVzZWQuXG4gICAgZXhwZWN0KGpzb25BbmNob3IuZG93bmxvYWQpLnRvRXF1YWwoJ21vZGVsLmpzb24nKTtcbiAgICBleHBlY3QoanNvbkFuY2hvci5jbGlja2VkKS50b0VxdWFsKDEpO1xuICAgIC8vIFRoZSB3ZWlnaHQgZmlsZSBzaG91bGQgbm90IGhhdmUgYmVlbiBkb3dub2FkZWQuXG4gICAgZXhwZWN0KHdlaWdodERhdGFBbmNob3IuZG93bmxvYWQpLnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgICBleHBlY3Qod2VpZ2h0RGF0YUFuY2hvci5jbGlja2VkKS50b0VxdWFsKDApO1xuXG4gICAgLy8gVmVyaWZ5IHRoZSBjb250ZW50IG9mIHRoZSBKU09OIGZpbGUuXG4gICAgY29uc3QganNvbkNvbnRlbnQgPSBhd2FpdCBmZXRjaChqc29uQW5jaG9yLmhyZWYpO1xuICAgIGNvbnN0IG1vZGVsVG9wb2xvZ3lBbmRXZWlnaHRzTWFuaWZlc3QgPVxuICAgICAgICBKU09OLnBhcnNlKGF3YWl0IGpzb25Db250ZW50LnRleHQoKSk7XG4gICAgZXhwZWN0KG1vZGVsVG9wb2xvZ3lBbmRXZWlnaHRzTWFuaWZlc3QubW9kZWxUb3BvbG9neSlcbiAgICAgICAgLnRvRXF1YWwobW9kZWxUb3BvbG9neTEpO1xuICB9KTtcblxuICBpdCgnYnJvd3NlckRvd25sb2Fkc1JvdXRlcicsICgpID0+IHtcbiAgICBleHBlY3QoXG4gICAgICAgIGJyb3dzZXJEb3dubG9hZHNSb3V0ZXIoJ2Rvd25sb2FkczovL2ZvbycpIGluc3RhbmNlb2YgQnJvd3NlckRvd25sb2FkcylcbiAgICAgICAgLnRvRXF1YWwodHJ1ZSk7XG4gICAgZXhwZWN0KGJyb3dzZXJEb3dubG9hZHNSb3V0ZXIoJ2ludmFsaWRkb3dubG9hZHM6Ly9mb28nKSkudG9CZU51bGwoKTtcbiAgICBleHBlY3QoYnJvd3NlckRvd25sb2Fkc1JvdXRlcignZm9vJykpLnRvQmVOdWxsKCk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCdicm93c2VyRmlsZXMnLCBCUk9XU0VSX0VOVlMsICgpID0+IHtcbiAgY29uc3Qgd2VpZ2h0c0ZpbGUgPSBuZXcgRmlsZShcbiAgICAgIFt3ZWlnaHREYXRhMV0sICdtb2RlbC53ZWlnaHRzLmJpbicsIHt0eXBlOiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ30pO1xuXG4gIGl0KCdPbmUgZ3JvdXAsIG9uZSBwYXRoJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHdlaWdodHNNYW5pZmVzdDogV2VpZ2h0c01hbmlmZXN0Q29uZmlnID0gW3tcbiAgICAgIHBhdGhzOiBbJy4vbW9kZWwud2VpZ2h0cy5iaW4nXSxcbiAgICAgIHdlaWdodHM6IHdlaWdodFNwZWNzMSxcbiAgICB9XTtcbiAgICBjb25zdCBtb2RlbEpTT046IHRmLmlvLk1vZGVsSlNPTiA9IHtcbiAgICAgIG1vZGVsVG9wb2xvZ3k6IG1vZGVsVG9wb2xvZ3kxLFxuICAgICAgd2VpZ2h0c01hbmlmZXN0LFxuICAgICAgZm9ybWF0OiAnbGF5ZXJzLW1vZGVsJyxcbiAgICAgIGdlbmVyYXRlZEJ5OiAnVGVuc29yRmxvdy5qcyB2MC4wLjAnLFxuICAgICAgY29udmVydGVkQnk6ICcxLjEzLjEnLFxuICAgICAgbW9kZWxJbml0aWFsaXplcjoge30sXG4gICAgICB0cmFpbmluZ0NvbmZpZzogdHJhaW5pbmdDb25maWcxLFxuICAgIH07XG4gICAgY29uc3QganNvbkZpbGUgPSBuZXcgRmlsZShcbiAgICAgICAgW0pTT04uc3RyaW5naWZ5KG1vZGVsSlNPTildLCAnbW9kZWwuanNvbicsIHt0eXBlOiAnYXBwbGljYXRpb24vanNvbid9KTtcblxuICAgIGNvbnN0IGZpbGVzSGFuZGxlciA9IHRmLmlvLmJyb3dzZXJGaWxlcyhbanNvbkZpbGUsIHdlaWdodHNGaWxlXSk7XG4gICAgY29uc3QgbW9kZWxBcnRpZmFjdHMgPSBhd2FpdCBmaWxlc0hhbmRsZXIubG9hZCgpO1xuICAgIGV4cGVjdChtb2RlbEFydGlmYWN0cy5tb2RlbFRvcG9sb2d5KS50b0VxdWFsKG1vZGVsVG9wb2xvZ3kxKTtcbiAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMud2VpZ2h0U3BlY3MpLnRvRXF1YWwod2VpZ2h0U3BlY3MxKTtcbiAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMuZm9ybWF0KS50b0VxdWFsKCdsYXllcnMtbW9kZWwnKTtcbiAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMuZ2VuZXJhdGVkQnkpLnRvRXF1YWwoJ1RlbnNvckZsb3cuanMgdjAuMC4wJyk7XG4gICAgZXhwZWN0KG1vZGVsQXJ0aWZhY3RzLmNvbnZlcnRlZEJ5KS50b0VxdWFsKCcxLjEzLjEnKTtcbiAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMubW9kZWxJbml0aWFsaXplcikudG9FcXVhbCh7fSk7XG4gICAgZXhwZWN0KG1vZGVsQXJ0aWZhY3RzLnRyYWluaW5nQ29uZmlnKS50b0VxdWFsKHRyYWluaW5nQ29uZmlnMSk7XG5cbiAgICBleHBlY3QobmV3IFVpbnQ4QXJyYXkobW9kZWxBcnRpZmFjdHMud2VpZ2h0RGF0YSkpXG4gICAgICAgIC50b0VxdWFsKG5ldyBVaW50OEFycmF5KHdlaWdodERhdGExKSk7XG4gIH0pO1xuXG4gIGl0KGBPbmUgZ3JvdXAsIHR3byBwYXRoc2AsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB3ZWlnaHRTcGVjczogV2VpZ2h0c01hbmlmZXN0RW50cnlbXSA9IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2ZvbycsXG4gICAgICAgIHNoYXBlOiBbMSwgMV0sXG4gICAgICAgIGR0eXBlOiAnZmxvYXQzMicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnYmFyJyxcbiAgICAgICAgc2hhcGU6IFsxLCAxXSxcbiAgICAgICAgZHR5cGU6ICdmbG9hdDMyJyxcbiAgICAgIH1cbiAgICBdO1xuICAgIGNvbnN0IHdlaWdodHNNYW5pZmVzdDogV2VpZ2h0c01hbmlmZXN0Q29uZmlnID0gW3tcbiAgICAgIHBhdGhzOiBbJy4vZGlyMS9tb2RlbC53ZWlnaHRzLjEuYmluJywgJy4vZGlyMi9tb2RlbC53ZWlnaHRzLjIuYmluJ10sXG4gICAgICB3ZWlnaHRzOiB3ZWlnaHRTcGVjcyxcbiAgICB9XTtcbiAgICBjb25zdCB3ZWlnaHRzVG9wb2xvZ3lBbmRNYW5pZmVzdCA9IHtcbiAgICAgIG1vZGVsVG9wb2xvZ3k6IG1vZGVsVG9wb2xvZ3kxLFxuICAgICAgd2VpZ2h0c01hbmlmZXN0LFxuICAgIH07XG4gICAgY29uc3Qgd2VpZ2h0c0ZpbGUxID0gbmV3IEZpbGUoXG4gICAgICAgIFtuZXcgVWludDhBcnJheShbMSwgMiwgMywgNF0pLmJ1ZmZlcl0sICdtb2RlbC53ZWlnaHRzLjEuYmluJyxcbiAgICAgICAge3R5cGU6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nfSk7XG4gICAgY29uc3Qgd2VpZ2h0c0ZpbGUyID0gbmV3IEZpbGUoXG4gICAgICAgIFtuZXcgVWludDhBcnJheShbMTAsIDIwLCAzMCwgNDBdKS5idWZmZXJdLCAnbW9kZWwud2VpZ2h0cy4yLmJpbicsXG4gICAgICAgIHt0eXBlOiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ30pO1xuXG4gICAgY29uc3QganNvbkZpbGUgPSBuZXcgRmlsZShcbiAgICAgICAgW0pTT04uc3RyaW5naWZ5KHdlaWdodHNUb3BvbG9neUFuZE1hbmlmZXN0KV0sICdtb2RlbC5qc29uJyxcbiAgICAgICAge3R5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ30pO1xuXG4gICAgY29uc3QgZmlsZXNIYW5kbGVyID1cbiAgICAgICAgdGYuaW8uYnJvd3NlckZpbGVzKFtqc29uRmlsZSwgd2VpZ2h0c0ZpbGUxLCB3ZWlnaHRzRmlsZTJdKTtcbiAgICBjb25zdCBtb2RlbEFydGlmYWN0cyA9IGF3YWl0IGZpbGVzSGFuZGxlci5sb2FkKCk7XG4gICAgZXhwZWN0KG1vZGVsQXJ0aWZhY3RzLm1vZGVsVG9wb2xvZ3kpLnRvRXF1YWwobW9kZWxUb3BvbG9neTEpO1xuICAgIGV4cGVjdChtb2RlbEFydGlmYWN0cy53ZWlnaHRTcGVjcykudG9FcXVhbCh3ZWlnaHRTcGVjcyk7XG4gICAgZXhwZWN0KG5ldyBVaW50OEFycmF5KG1vZGVsQXJ0aWZhY3RzLndlaWdodERhdGEpKS50b0VxdWFsKG5ldyBVaW50OEFycmF5KFtcbiAgICAgIDEsIDIsIDMsIDQsIDEwLCAyMCwgMzAsIDQwXG4gICAgXSkpO1xuICB9KTtcblxuICBpdChgVHdvIGdyb3VwcywgZm91ciBwYXRocywgcmV2ZXJzZU9yZGVyPWZhbHNlYCwgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHdlaWdodFNwZWNzMTogV2VpZ2h0c01hbmlmZXN0RW50cnlbXSA9IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2ZvbycsXG4gICAgICAgIHNoYXBlOiBbMSwgMV0sXG4gICAgICAgIGR0eXBlOiAnZmxvYXQzMicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnYmFyJyxcbiAgICAgICAgc2hhcGU6IFsxLCAxXSxcbiAgICAgICAgZHR5cGU6ICdmbG9hdDMyJyxcbiAgICAgIH1cbiAgICBdO1xuICAgIGNvbnN0IHdlaWdodFNwZWNzMjogV2VpZ2h0c01hbmlmZXN0RW50cnlbXSA9IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2JheicsXG4gICAgICAgIHNoYXBlOiBbMSwgMV0sXG4gICAgICAgIGR0eXBlOiAnZmxvYXQzMicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAncXV4JyxcbiAgICAgICAgc2hhcGU6IFsxLCAxXSxcbiAgICAgICAgZHR5cGU6ICdmbG9hdDMyJyxcbiAgICAgIH1cbiAgICBdO1xuICAgIGNvbnN0IHdlaWdodHNNYW5pZmVzdDogV2VpZ2h0c01hbmlmZXN0Q29uZmlnID0gW1xuICAgICAge1xuICAgICAgICBwYXRoczogWycuL21vZGVsLndlaWdodHMuMS5iaW4nLCAnLi9tb2RlbC53ZWlnaHRzLjIuYmluJ10sXG4gICAgICAgIHdlaWdodHM6IHdlaWdodFNwZWNzMSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGhzOiBbJy4vbW9kZWwud2VpZ2h0cy4zLmJpbicsICcuL21vZGVsLndlaWdodHMuNC5iaW4nXSxcbiAgICAgICAgd2VpZ2h0czogd2VpZ2h0U3BlY3MyLFxuICAgICAgfVxuICAgIF07XG4gICAgY29uc3Qgd2VpZ2h0c1RvcG9sb2d5QW5kTWFuaWZlc3QgPSB7XG4gICAgICBtb2RlbFRvcG9sb2d5OiBtb2RlbFRvcG9sb2d5MSxcbiAgICAgIHdlaWdodHNNYW5pZmVzdCxcbiAgICB9O1xuICAgIGNvbnN0IHdlaWdodHNGaWxlMSA9IG5ldyBGaWxlKFxuICAgICAgICBbbmV3IFVpbnQ4QXJyYXkoWzEsIDMsIDUsIDddKS5idWZmZXJdLCAnbW9kZWwud2VpZ2h0cy4xLmJpbicsXG4gICAgICAgIHt0eXBlOiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ30pO1xuICAgIGNvbnN0IHdlaWdodHNGaWxlMiA9IG5ldyBGaWxlKFxuICAgICAgICBbbmV3IFVpbnQ4QXJyYXkoWzEwLCAzMCwgNTAsIDcwXSkuYnVmZmVyXSwgJ21vZGVsLndlaWdodHMuMi5iaW4nLFxuICAgICAgICB7dHlwZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSd9KTtcbiAgICBjb25zdCB3ZWlnaHRzRmlsZTMgPSBuZXcgRmlsZShcbiAgICAgICAgW25ldyBVaW50OEFycmF5KFsyLCA0LCA2LCA4XSkuYnVmZmVyXSwgJ21vZGVsLndlaWdodHMuMy5iaW4nLFxuICAgICAgICB7dHlwZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSd9KTtcbiAgICBjb25zdCB3ZWlnaHRzRmlsZTQgPSBuZXcgRmlsZShcbiAgICAgICAgW25ldyBVaW50OEFycmF5KFsyMCwgNDAsIDYwLCA4MF0pLmJ1ZmZlcl0sICdtb2RlbC53ZWlnaHRzLjQuYmluJyxcbiAgICAgICAge3R5cGU6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nfSk7XG5cbiAgICBjb25zdCBqc29uRmlsZSA9IG5ldyBGaWxlKFxuICAgICAgICBbSlNPTi5zdHJpbmdpZnkod2VpZ2h0c1RvcG9sb2d5QW5kTWFuaWZlc3QpXSwgJ21vZGVsLmpzb24nLFxuICAgICAgICB7dHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nfSk7XG5cbiAgICBjb25zdCBmaWxlc0hhbmRsZXIgPSB0Zi5pby5icm93c2VyRmlsZXMoXG4gICAgICAgIFtqc29uRmlsZSwgd2VpZ2h0c0ZpbGUxLCB3ZWlnaHRzRmlsZTIsIHdlaWdodHNGaWxlMywgd2VpZ2h0c0ZpbGU0XSk7XG4gICAgY29uc3QgbW9kZWxBcnRpZmFjdHMgPSBhd2FpdCBmaWxlc0hhbmRsZXIubG9hZCgpO1xuICAgIGV4cGVjdChtb2RlbEFydGlmYWN0cy5tb2RlbFRvcG9sb2d5KS50b0VxdWFsKG1vZGVsVG9wb2xvZ3kxKTtcbiAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMud2VpZ2h0U3BlY3MpXG4gICAgICAgIC50b0VxdWFsKHdlaWdodFNwZWNzMS5jb25jYXQod2VpZ2h0U3BlY3MyKSk7XG4gICAgZXhwZWN0KG5ldyBVaW50OEFycmF5KG1vZGVsQXJ0aWZhY3RzLndlaWdodERhdGEpKS50b0VxdWFsKG5ldyBVaW50OEFycmF5KFtcbiAgICAgIDEsIDMsIDUsIDcsIDEwLCAzMCwgNTAsIDcwLCAyLCA0LCA2LCA4LCAyMCwgNDAsIDYwLCA4MFxuICAgIF0pKTtcbiAgfSk7XG5cbiAgaXQoYFR3byBncm91cHMsIGZvdXIgcGF0aHMsIHJldmVyc2VPcmRlcj10cnVlYCwgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHdlaWdodFNwZWNzMTogV2VpZ2h0c01hbmlmZXN0RW50cnlbXSA9IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2ZvbycsXG4gICAgICAgIHNoYXBlOiBbMSwgMV0sXG4gICAgICAgIGR0eXBlOiAnZmxvYXQzMicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnYmFyJyxcbiAgICAgICAgc2hhcGU6IFsxLCAxXSxcbiAgICAgICAgZHR5cGU6ICdmbG9hdDMyJyxcbiAgICAgIH1cbiAgICBdO1xuICAgIGNvbnN0IHdlaWdodFNwZWNzMjogV2VpZ2h0c01hbmlmZXN0RW50cnlbXSA9IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2JheicsXG4gICAgICAgIHNoYXBlOiBbMSwgMV0sXG4gICAgICAgIGR0eXBlOiAnZmxvYXQzMicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAncXV4JyxcbiAgICAgICAgc2hhcGU6IFsxLCAxXSxcbiAgICAgICAgZHR5cGU6ICdmbG9hdDMyJyxcbiAgICAgIH1cbiAgICBdO1xuICAgIGNvbnN0IHdlaWdodHNNYW5pZmVzdDogV2VpZ2h0c01hbmlmZXN0Q29uZmlnID0gW1xuICAgICAge1xuICAgICAgICBwYXRoczogWycuL21vZGVsLndlaWdodHMuMS5iaW4nLCAnLi9tb2RlbC53ZWlnaHRzLjIuYmluJ10sXG4gICAgICAgIHdlaWdodHM6IHdlaWdodFNwZWNzMSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGhzOiBbJy4vbW9kZWwud2VpZ2h0cy4zLmJpbicsICcuL21vZGVsLndlaWdodHMuNC5iaW4nXSxcbiAgICAgICAgd2VpZ2h0czogd2VpZ2h0U3BlY3MyLFxuICAgICAgfVxuICAgIF07XG4gICAgY29uc3Qgd2VpZ2h0c1RvcG9sb2d5QW5kTWFuaWZlc3QgPSB7XG4gICAgICBtb2RlbFRvcG9sb2d5OiBtb2RlbFRvcG9sb2d5MSxcbiAgICAgIHdlaWdodHNNYW5pZmVzdCxcbiAgICB9O1xuICAgIGNvbnN0IHdlaWdodHNGaWxlMSA9IG5ldyBGaWxlKFxuICAgICAgICBbbmV3IFVpbnQ4QXJyYXkoWzEsIDMsIDUsIDddKS5idWZmZXJdLCAnbW9kZWwud2VpZ2h0cy4xLmJpbicsXG4gICAgICAgIHt0eXBlOiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ30pO1xuICAgIGNvbnN0IHdlaWdodHNGaWxlMiA9IG5ldyBGaWxlKFxuICAgICAgICBbbmV3IFVpbnQ4QXJyYXkoWzEwLCAzMCwgNTAsIDcwXSkuYnVmZmVyXSwgJ21vZGVsLndlaWdodHMuMi5iaW4nLFxuICAgICAgICB7dHlwZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSd9KTtcbiAgICBjb25zdCB3ZWlnaHRzRmlsZTMgPSBuZXcgRmlsZShcbiAgICAgICAgW25ldyBVaW50OEFycmF5KFsyLCA0LCA2LCA4XSkuYnVmZmVyXSwgJ21vZGVsLndlaWdodHMuMy5iaW4nLFxuICAgICAgICB7dHlwZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSd9KTtcbiAgICBjb25zdCB3ZWlnaHRzRmlsZTQgPSBuZXcgRmlsZShcbiAgICAgICAgW25ldyBVaW50OEFycmF5KFsyMCwgNDAsIDYwLCA4MF0pLmJ1ZmZlcl0sICdtb2RlbC53ZWlnaHRzLjQuYmluJyxcbiAgICAgICAge3R5cGU6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nfSk7XG5cbiAgICBjb25zdCBqc29uRmlsZSA9IG5ldyBGaWxlKFxuICAgICAgICBbSlNPTi5zdHJpbmdpZnkod2VpZ2h0c1RvcG9sb2d5QW5kTWFuaWZlc3QpXSwgJ21vZGVsLmpzb24nLFxuICAgICAgICB7dHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nfSk7XG5cbiAgICBjb25zdCBmaWxlc0hhbmRsZXIgPSB0Zi5pby5icm93c2VyRmlsZXMoXG4gICAgICAgIFtqc29uRmlsZSwgd2VpZ2h0c0ZpbGU0LCB3ZWlnaHRzRmlsZTMsIHdlaWdodHNGaWxlMiwgd2VpZ2h0c0ZpbGUxXSk7XG4gICAgY29uc3QgbW9kZWxBcnRpZmFjdHMgPSBhd2FpdCBmaWxlc0hhbmRsZXIubG9hZCgpO1xuICAgIGV4cGVjdChtb2RlbEFydGlmYWN0cy5tb2RlbFRvcG9sb2d5KS50b0VxdWFsKG1vZGVsVG9wb2xvZ3kxKTtcbiAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMud2VpZ2h0U3BlY3MpXG4gICAgICAgIC50b0VxdWFsKHdlaWdodFNwZWNzMS5jb25jYXQod2VpZ2h0U3BlY3MyKSk7XG4gICAgZXhwZWN0KG5ldyBVaW50OEFycmF5KG1vZGVsQXJ0aWZhY3RzLndlaWdodERhdGEpKS50b0VxdWFsKG5ldyBVaW50OEFycmF5KFtcbiAgICAgIDEsIDMsIDUsIDcsIDEwLCAzMCwgNTAsIDcwLCAyLCA0LCA2LCA4LCAyMCwgNDAsIDYwLCA4MFxuICAgIF0pKTtcbiAgfSk7XG5cbiAgaXQoJ1VwbG9hZCBtb2RlbCB0b3BvbG9neSBvbmx5JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHdlaWdodHNNYW5pZmVzdDogV2VpZ2h0c01hbmlmZXN0Q29uZmlnID0gW3tcbiAgICAgIHBhdGhzOiBbJy4vbW9kZWwud2VpZ2h0cy5iaW4nXSxcbiAgICAgIHdlaWdodHM6IHdlaWdodFNwZWNzMSxcbiAgICB9XTtcbiAgICBjb25zdCB3ZWlnaHRzVG9wb2xvZ3lBbmRNYW5pZmVzdCA9IHtcbiAgICAgIG1vZGVsVG9wb2xvZ3k6IG1vZGVsVG9wb2xvZ3kxLFxuICAgICAgd2VpZ2h0c01hbmlmZXN0LFxuICAgIH07XG4gICAgY29uc3QganNvbkZpbGUgPSBuZXcgRmlsZShcbiAgICAgICAgW0pTT04uc3RyaW5naWZ5KHdlaWdodHNUb3BvbG9neUFuZE1hbmlmZXN0KV0sICdtb2RlbC5qc29uJyxcbiAgICAgICAge3R5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ30pO1xuXG4gICAgLy8gU2VsZWN0IG9ubHkgYSBKU09OIGZpbGUuXG4gICAgY29uc3QgZmlsZXNIYW5kbGVyID0gdGYuaW8uYnJvd3NlckZpbGVzKFtqc29uRmlsZV0pO1xuICAgIGNvbnN0IG1vZGVsQXJ0aWZhY3RzID0gYXdhaXQgZmlsZXNIYW5kbGVyLmxvYWQoKTtcbiAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMubW9kZWxUb3BvbG9neSkudG9FcXVhbChtb2RlbFRvcG9sb2d5MSk7XG4gICAgZXhwZWN0KG1vZGVsQXJ0aWZhY3RzLndlaWdodFNwZWNzKS50b0VxdWFsKHVuZGVmaW5lZCk7XG4gIH0pO1xuXG4gIGl0KCdNaXNtYXRjaCBpbiBudW1iZXIgb2YgcGF0aHMgYW5kIG51bWJlciBvZiBmaWxlcycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB3ZWlnaHRzTWFuaWZlc3Q6IFdlaWdodHNNYW5pZmVzdENvbmZpZyA9IFt7XG4gICAgICBwYXRoczogWycuL21vZGVsLndlaWdodHMuMS5iaW4nXSxcbiAgICAgIHdlaWdodHM6IHdlaWdodFNwZWNzMSxcbiAgICB9XTtcbiAgICBjb25zdCB3ZWlnaHRzVG9wb2xvZ3lBbmRNYW5pZmVzdCA9IHtcbiAgICAgIG1vZGVsVG9wb2xvZ3k6IHdlaWdodFNwZWNzMSxcbiAgICAgIHdlaWdodHNNYW5pZmVzdCxcbiAgICB9O1xuICAgIGNvbnN0IHdlaWdodHNGaWxlMSA9IG5ldyBGaWxlKFxuICAgICAgICBbbmV3IFVpbnQ4QXJyYXkoWzEsIDIsIDMsIDRdKS5idWZmZXJdLCAnbW9kZWwud2VpZ2h0cy4xLmJpbicsXG4gICAgICAgIHt0eXBlOiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ30pO1xuICAgIGNvbnN0IHdlaWdodHNGaWxlMiA9IG5ldyBGaWxlKFxuICAgICAgICBbbmV3IFVpbnQ4QXJyYXkoWzEwLCAyMCwgMzAsIDQwXSkuYnVmZmVyXSwgJ21vZGVsLndlaWdodHMuMi5iaW4nLFxuICAgICAgICB7dHlwZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSd9KTtcblxuICAgIGNvbnN0IGpzb25GaWxlID0gbmV3IEZpbGUoXG4gICAgICAgIFtKU09OLnN0cmluZ2lmeSh3ZWlnaHRzVG9wb2xvZ3lBbmRNYW5pZmVzdCldLCAnbW9kZWwuanNvbicsXG4gICAgICAgIHt0eXBlOiAnYXBwbGljYXRpb24vanNvbid9KTtcblxuICAgIC8vIFN1cHBseSB0d28gd2VpZ2h0cyBmaWxlcyB3aGlsZSB0aGUgbWFuaWZlc3QgaGFzIG9ubHkgb25lIHBhdGguIFRoaXMgaXNcbiAgICAvLyBleHBlY3RlZCB0byBmYWlsLlxuICAgIGNvbnN0IGZpbGVzSGFuZGxlciA9XG4gICAgICAgIHRmLmlvLmJyb3dzZXJGaWxlcyhbanNvbkZpbGUsIHdlaWdodHNGaWxlMiwgd2VpZ2h0c0ZpbGUxXSk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGZpbGVzSGFuZGxlci5sb2FkKCk7XG4gICAgICBmYWlsKFxuICAgICAgICAgICdMb2FkaW5nIHdpdGggbWlzbWF0Y2ggaW4gbnVtYmVyIG9mIHBhdGhzIGFuZCBudW1iZXIgb2YgZmlsZXMgJyArXG4gICAgICAgICAgJ3N1Y2NlZWRlZCB1bmV4cGVjdGVkbHkuJyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBleHBlY3QoZXJyLm1lc3NhZ2UpXG4gICAgICAgICAgLnRvRXF1YWwoXG4gICAgICAgICAgICAgICdNaXNtYXRjaCBpbiB0aGUgbnVtYmVyIG9mIGZpbGVzIGluIHdlaWdodHMgbWFuaWZlc3QgKDEpICcgK1xuICAgICAgICAgICAgICAnYW5kIHRoZSBudW1iZXIgb2Ygd2VpZ2h0IGZpbGVzIHByb3ZpZGVkICgyKS4nKTtcbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdNaXNtYXRjaCBpbiBtYW5pZmVzdCBwYXRocyBhbmQgZmlsZSBuYW1lcycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB3ZWlnaHRTcGVjczogV2VpZ2h0c01hbmlmZXN0RW50cnlbXSA9IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2ZvbycsXG4gICAgICAgIHNoYXBlOiBbMSwgMV0sXG4gICAgICAgIGR0eXBlOiAnZmxvYXQzMicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnYmFyJyxcbiAgICAgICAgc2hhcGU6IFsxLCAxXSxcbiAgICAgICAgZHR5cGU6ICdmbG9hdDMyJyxcbiAgICAgIH1cbiAgICBdO1xuICAgIGNvbnN0IHdlaWdodHNNYW5pZmVzdDogV2VpZ2h0c01hbmlmZXN0Q29uZmlnID0gW3tcbiAgICAgIHBhdGhzOiBbJy4vbW9kZWwud2VpZ2h0cy4xLmJpbicsICcuL21vZGVsLndlaWdodHMuMi5iaW4nXSxcbiAgICAgIHdlaWdodHM6IHdlaWdodFNwZWNzLFxuICAgIH1dO1xuICAgIGNvbnN0IHdlaWdodHNUb3BvbG9neUFuZE1hbmlmZXN0ID0ge1xuICAgICAgbW9kZWxUb3BvbG9neTogbW9kZWxUb3BvbG9neTEsXG4gICAgICB3ZWlnaHRzTWFuaWZlc3QsXG4gICAgfTtcbiAgICBjb25zdCB3ZWlnaHRzRmlsZTEgPSBuZXcgRmlsZShcbiAgICAgICAgW25ldyBVaW50OEFycmF5KFsxLCAyLCAzLCA0XSkuYnVmZmVyXSwgJ21vZGVsLndlaWdodHMuMS5iaW4nLFxuICAgICAgICB7dHlwZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSd9KTtcbiAgICBjb25zdCB3ZWlnaHRzRmlsZTIgPSBuZXcgRmlsZShcbiAgICAgICAgW25ldyBVaW50OEFycmF5KFsxMCwgMjAsIDMwLCA0MF0pLmJ1ZmZlcl0sICdtb2RlbC53ZWlnaHRzLjMuYmluJyxcbiAgICAgICAge3R5cGU6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nfSk7XG4gICAgLy8gTm90aWNlIHRoZSB3cm9uZyBmaWxlIG5hbWUgaGVyZS4gSXQgaXMgZXhwZWN0ZWQgdG8gY2F1c2UgbG9hZCgpIHRvXG4gICAgLy8gZmFpbC5cblxuICAgIGNvbnN0IGpzb25GaWxlID0gbmV3IEZpbGUoXG4gICAgICAgIFtKU09OLnN0cmluZ2lmeSh3ZWlnaHRzVG9wb2xvZ3lBbmRNYW5pZmVzdCldLCAnbW9kZWwuanNvbicsXG4gICAgICAgIHt0eXBlOiAnYXBwbGljYXRpb24vanNvbid9KTtcblxuICAgIGNvbnN0IGZpbGVzSGFuZGxlciA9XG4gICAgICAgIHRmLmlvLmJyb3dzZXJGaWxlcyhbanNvbkZpbGUsIHdlaWdodHNGaWxlMSwgd2VpZ2h0c0ZpbGUyXSk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGZpbGVzSGFuZGxlci5sb2FkKCk7XG4gICAgICBmYWlsKFxuICAgICAgICAgICdMb2FkaW5nIHdpdGggbWlzbWF0Y2hpbmcgcGF0aHMgYW5kIGZpbGUgbmFtZXMgJyArXG4gICAgICAgICAgJ3N1Y2NlZWRlZCB1bmV4cGVjdGVkbHkuJyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBleHBlY3QoZXJyLm1lc3NhZ2UpXG4gICAgICAgICAgLnRvRXF1YWwoXG4gICAgICAgICAgICAgICdXZWlnaHQgZmlsZSB3aXRoIGJhc2VuYW1lIFxcJ21vZGVsLndlaWdodHMuMi5iaW5cXCcgaXMgbm90ICcgK1xuICAgICAgICAgICAgICAncHJvdmlkZWQuJyk7XG4gICAgfVxuICB9KTtcblxuICBpdCgnRHVwbGljYXRlIGJhc2VuYW1lcyBpbiBwYXRocyBmYWlscycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB3ZWlnaHRTcGVjczogV2VpZ2h0c01hbmlmZXN0RW50cnlbXSA9IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2ZvbycsXG4gICAgICAgIHNoYXBlOiBbMSwgMV0sXG4gICAgICAgIGR0eXBlOiAnZmxvYXQzMicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnYmFyJyxcbiAgICAgICAgc2hhcGU6IFsxLCAxXSxcbiAgICAgICAgZHR5cGU6ICdmbG9hdDMyJyxcbiAgICAgIH1cbiAgICBdO1xuICAgIC8vIE5vdGljZSB0aGUgZHVwbGljYXRlIGJhc2VuYW1lcyBoZXJlIChhbGJlaXQgZGlzdGluY3QgZnVsbCBwYXRocykuIFRoaXNcbiAgICAvLyBpcyBleHBlY3RlZCB0byBjYXVzZSBsb2FkKCkgdG8gZmFpbC5cbiAgICBjb25zdCB3ZWlnaHRzTWFuaWZlc3Q6IFdlaWdodHNNYW5pZmVzdENvbmZpZyA9IFt7XG4gICAgICBwYXRoczogWycuL2RpcjEvbW9kZWwud2VpZ2h0cy4xLmJpbicsICcuL2RpcjIvbW9kZWwud2VpZ2h0cy4xLmJpbiddLFxuICAgICAgd2VpZ2h0czogd2VpZ2h0U3BlY3MsXG4gICAgfV07XG4gICAgY29uc3Qgd2VpZ2h0c1RvcG9sb2d5QW5kTWFuaWZlc3QgPSB7XG4gICAgICBtb2RlbFRvcG9sb2d5OiBtb2RlbFRvcG9sb2d5MSxcbiAgICAgIHdlaWdodHNNYW5pZmVzdCxcbiAgICB9O1xuICAgIGNvbnN0IHdlaWdodHNGaWxlMSA9IG5ldyBGaWxlKFxuICAgICAgICBbbmV3IFVpbnQ4QXJyYXkoWzEsIDIsIDMsIDRdKS5idWZmZXJdLCAnbW9kZWwud2VpZ2h0cy4xLmJpbicsXG4gICAgICAgIHt0eXBlOiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ30pO1xuICAgIGNvbnN0IHdlaWdodHNGaWxlMiA9IG5ldyBGaWxlKFxuICAgICAgICBbbmV3IFVpbnQ4QXJyYXkoWzEwLCAyMCwgMzAsIDQwXSkuYnVmZmVyXSwgJ21vZGVsLndlaWdodHMuMi5iaW4nLFxuICAgICAgICB7dHlwZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSd9KTtcbiAgICAvLyBOb3RpY2UgdGhlIHdyb25nIGZpbGUgbmFtZSBoZXJlLiBJdCBpcyBleHBlY3RlZCB0byBjYXVzZSBsb2FkKCkgdG9cbiAgICAvLyBmYWlsLlxuXG4gICAgY29uc3QganNvbkZpbGUgPSBuZXcgRmlsZShcbiAgICAgICAgW0pTT04uc3RyaW5naWZ5KHdlaWdodHNUb3BvbG9neUFuZE1hbmlmZXN0KV0sICdtb2RlbC5qc29uJyxcbiAgICAgICAge3R5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ30pO1xuXG4gICAgY29uc3QgZmlsZXNIYW5kbGVyID1cbiAgICAgICAgdGYuaW8uYnJvd3NlckZpbGVzKFtqc29uRmlsZSwgd2VpZ2h0c0ZpbGUxLCB3ZWlnaHRzRmlsZTJdKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZmlsZXNIYW5kbGVyLmxvYWQoKTtcbiAgICAgIGZhaWwoJ0xvYWRpbmcgd2l0aCBkdXBsaWNhdGUgYmFzZW5hbWVzIGluIHBhdGhzIHN1Y2NlZWRlZCB1bmV4cGVjdGVkbHkuJyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBleHBlY3QoZXJyLm1lc3NhZ2UpXG4gICAgICAgICAgLnRvRXF1YWwoXG4gICAgICAgICAgICAgICdEdXBsaWNhdGUgZmlsZSBiYXNlbmFtZSBmb3VuZCBpbiB3ZWlnaHRzIG1hbmlmZXN0OiAnICtcbiAgICAgICAgICAgICAgJ1xcJ21vZGVsLndlaWdodHMuMS5iaW5cXCcnKTtcbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdNaXNzaW5nIG1vZGVsVG9wb2xvZ3kgZnJvbSBKU09OIGxlYWRzIHRvIEVycm9yJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHdlaWdodHNNYW5pZmVzdDogV2VpZ2h0c01hbmlmZXN0Q29uZmlnID0gW3tcbiAgICAgIHBhdGhzOiBbJy4vbW9kZWwud2VpZ2h0cy5iaW4nXSxcbiAgICAgIHdlaWdodHM6IHdlaWdodFNwZWNzMSxcbiAgICB9XTtcbiAgICBjb25zdCB3ZWlnaHRzVG9wb2xvZ3lBbmRNYW5pZmVzdCA9IHtcbiAgICAgIHdlaWdodHNNYW5pZmVzdCxcbiAgICB9O1xuICAgIGNvbnN0IGpzb25GaWxlID0gbmV3IEZpbGUoXG4gICAgICAgIFtKU09OLnN0cmluZ2lmeSh3ZWlnaHRzVG9wb2xvZ3lBbmRNYW5pZmVzdCldLCAnbW9kZWwuanNvbicsXG4gICAgICAgIHt0eXBlOiAnYXBwbGljYXRpb24vanNvbid9KTtcblxuICAgIGNvbnN0IGZpbGVzSGFuZGxlciA9IHRmLmlvLmJyb3dzZXJGaWxlcyhbanNvbkZpbGUsIHdlaWdodHNGaWxlXSk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGZpbGVzSGFuZGxlci5sb2FkKCk7XG4gICAgICBmYWlsKFxuICAgICAgICAgICdMb2FkaW5nIHdpdGggRmlsZXMgSU9IYW5kbGVyIHdpdGggbWlzc2luZyBtb2RlbFRvcG9sb2d5ICcgK1xuICAgICAgICAgICdzdWNjZWVkZWQgdW5leHBlY3RlZGx5LicpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgZXhwZWN0KGVyci5tZXNzYWdlKVxuICAgICAgICAgIC50b01hdGNoKC9tb2RlbFRvcG9sb2d5IGZpZWxkIGlzIG1pc3NpbmcgZnJvbSBmaWxlIG1vZGVsXFwuanNvbi8pO1xuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ0luY29ycmVjdCBudW1iZXIgb2YgZmlsZXMgbGVhZHMgdG8gRXJyb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLmlvLmJyb3dzZXJGaWxlcyhudWxsKSkudG9UaHJvd0Vycm9yKC9hdCBsZWFzdCAxIGZpbGUvKTtcbiAgICBleHBlY3QoKCkgPT4gdGYuaW8uYnJvd3NlckZpbGVzKFtdKSkudG9UaHJvd0Vycm9yKC9hdCBsZWFzdCAxIGZpbGUvKTtcbiAgfSk7XG59KTtcbiJdfQ==