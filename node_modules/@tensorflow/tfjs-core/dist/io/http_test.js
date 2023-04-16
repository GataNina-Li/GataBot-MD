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
import { BROWSER_ENVS, CHROME_ENVS, describeWithFlags, NODE_ENVS } from '../jasmine_util';
import { HTTPRequest, httpRouter, parseUrl } from './http';
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
const trainingConfig1 = {
    loss: 'categorical_crossentropy',
    metrics: ['accuracy'],
    optimizer_config: { class_name: 'SGD', config: { learningRate: 0.1 } }
};
let fetchSpy;
const fakeResponse = (body, contentType, path) => ({
    ok: true,
    json() {
        return Promise.resolve(JSON.parse(body));
    },
    arrayBuffer() {
        const buf = body.buffer ?
            body.buffer :
            body;
        return Promise.resolve(buf);
    },
    headers: { get: (key) => contentType },
    url: path
});
const setupFakeWeightFiles = (fileBufferMap, requestInits) => {
    fetchSpy = spyOn(tf.env().platform, 'fetch')
        .and.callFake((path, init) => {
        if (fileBufferMap[path]) {
            requestInits[path] = init;
            return Promise.resolve(fakeResponse(fileBufferMap[path].data, fileBufferMap[path].contentType, path));
        }
        else {
            return Promise.reject('path not found');
        }
    });
};
describeWithFlags('http-load fetch', NODE_ENVS, () => {
    let requestInits;
    // tslint:disable-next-line:no-any
    let originalFetch;
    // simulate a fetch polyfill, this needs to be non-null for spyOn to work
    beforeEach(() => {
        // tslint:disable-next-line:no-any
        originalFetch = global.fetch;
        // tslint:disable-next-line:no-any
        global.fetch = () => { };
        requestInits = {};
    });
    afterAll(() => {
        // tslint:disable-next-line:no-any
        global.fetch = originalFetch;
    });
    it('1 group, 2 weights, 1 path', async () => {
        const weightManifest1 = [{
                paths: ['weightfile0'],
                weights: [
                    {
                        name: 'dense/kernel',
                        shape: [3, 1],
                        dtype: 'float32',
                    },
                    {
                        name: 'dense/bias',
                        shape: [2],
                        dtype: 'float32',
                    }
                ]
            }];
        const floatData = new Float32Array([1, 3, 3, 7, 4]);
        setupFakeWeightFiles({
            './model.json': {
                data: JSON.stringify({
                    modelTopology: modelTopology1,
                    weightsManifest: weightManifest1,
                    format: 'tfjs-layers',
                    generatedBy: '1.15',
                    convertedBy: '1.3.1',
                    signature: null,
                    userDefinedMetadata: {}
                }),
                contentType: 'application/json'
            },
            './weightfile0': { data: floatData, contentType: 'application/octet-stream' },
        }, requestInits);
        const handler = tf.io.http('./model.json');
        const modelArtifacts = await handler.load();
        expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
        expect(modelArtifacts.weightSpecs).toEqual(weightManifest1[0].weights);
        expect(modelArtifacts.format).toEqual('tfjs-layers');
        expect(modelArtifacts.generatedBy).toEqual('1.15');
        expect(modelArtifacts.convertedBy).toEqual('1.3.1');
        expect(modelArtifacts.userDefinedMetadata).toEqual({});
        expect(new Float32Array(modelArtifacts.weightData)).toEqual(floatData);
    });
    it('throw exception if no fetch polyfill', () => {
        // tslint:disable-next-line:no-any
        delete global.fetch;
        try {
            tf.io.http('./model.json');
        }
        catch (err) {
            expect(err.message).toMatch(/Unable to find fetch polyfill./);
        }
    });
});
// Turned off for other browsers due to:
// https://github.com/tensorflow/tfjs/issues/426
describeWithFlags('http-save', CHROME_ENVS, () => {
    // Test data.
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
        signature: null,
        userDefinedMetadata: {},
        modelInitializer: {},
        trainingConfig: trainingConfig1
    };
    let requestInits = [];
    beforeEach(() => {
        requestInits = [];
        spyOn(tf.env().platform, 'fetch')
            .and.callFake((path, init) => {
            if (path === 'model-upload-test' ||
                path === 'http://model-upload-test') {
                requestInits.push(init);
                return Promise.resolve(new Response(null, { status: 200 }));
            }
            else {
                return Promise.reject(new Response(null, { status: 404 }));
            }
        });
    });
    it('Save topology and weights, default POST method', (done) => {
        const testStartDate = new Date();
        const handler = tf.io.getSaveHandlers('http://model-upload-test')[0];
        handler.save(artifacts1)
            .then(saveResult => {
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
            expect(requestInits.length).toEqual(1);
            const init = requestInits[0];
            expect(init.method).toEqual('POST');
            const body = init.body;
            const jsonFile = body.get('model.json');
            const jsonFileReader = new FileReader();
            jsonFileReader.onload = (event) => {
                const modelJSON = 
                // tslint:disable-next-line:no-any
                JSON.parse(event.target.result);
                expect(modelJSON.modelTopology).toEqual(modelTopology1);
                expect(modelJSON.weightsManifest.length).toEqual(1);
                expect(modelJSON.weightsManifest[0].weights).toEqual(weightSpecs1);
                expect(modelJSON.trainingConfig).toEqual(trainingConfig1);
                const weightsFile = body.get('model.weights.bin');
                const weightsFileReader = new FileReader();
                weightsFileReader.onload = (event) => {
                    // tslint:disable-next-line:no-any
                    const weightData = event.target.result;
                    expect(new Uint8Array(weightData))
                        .toEqual(new Uint8Array(weightData1));
                    done();
                };
                weightsFileReader.onerror = ev => {
                    done.fail(weightsFileReader.error.message);
                };
                weightsFileReader.readAsArrayBuffer(weightsFile);
            };
            jsonFileReader.onerror = ev => {
                done.fail(jsonFileReader.error.message);
            };
            jsonFileReader.readAsText(jsonFile);
        })
            .catch(err => {
            done.fail(err.stack);
        });
    });
    it('Save topology only, default POST method', (done) => {
        const testStartDate = new Date();
        const handler = tf.io.getSaveHandlers('http://model-upload-test')[0];
        const topologyOnlyArtifacts = { modelTopology: modelTopology1 };
        handler.save(topologyOnlyArtifacts)
            .then(saveResult => {
            expect(saveResult.modelArtifactsInfo.dateSaved.getTime())
                .toBeGreaterThanOrEqual(testStartDate.getTime());
            // Note: The following two assertions work only because there is no
            //   non-ASCII characters in `modelTopology1` and `weightSpecs1`.
            expect(saveResult.modelArtifactsInfo.modelTopologyBytes)
                .toEqual(JSON.stringify(modelTopology1).length);
            expect(saveResult.modelArtifactsInfo.weightSpecsBytes).toEqual(0);
            expect(saveResult.modelArtifactsInfo.weightDataBytes).toEqual(0);
            expect(requestInits.length).toEqual(1);
            const init = requestInits[0];
            expect(init.method).toEqual('POST');
            const body = init.body;
            const jsonFile = body.get('model.json');
            const jsonFileReader = new FileReader();
            jsonFileReader.onload = (event) => {
                // tslint:disable-next-line:no-any
                const modelJSON = JSON.parse(event.target.result);
                expect(modelJSON.modelTopology).toEqual(modelTopology1);
                // No weights should have been sent to the server.
                expect(body.get('model.weights.bin')).toEqual(null);
                done();
            };
            jsonFileReader.onerror = event => {
                done.fail(jsonFileReader.error.message);
            };
            jsonFileReader.readAsText(jsonFile);
        })
            .catch(err => {
            done.fail(err.stack);
        });
    });
    it('Save topology and weights, PUT method, extra headers', (done) => {
        const testStartDate = new Date();
        const handler = tf.io.http('model-upload-test', {
            requestInit: {
                method: 'PUT',
                headers: { 'header_key_1': 'header_value_1', 'header_key_2': 'header_value_2' }
            }
        });
        handler.save(artifacts1)
            .then(saveResult => {
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
            expect(requestInits.length).toEqual(1);
            const init = requestInits[0];
            expect(init.method).toEqual('PUT');
            // Check headers.
            expect(init.headers).toEqual({
                'header_key_1': 'header_value_1',
                'header_key_2': 'header_value_2'
            });
            const body = init.body;
            const jsonFile = body.get('model.json');
            const jsonFileReader = new FileReader();
            jsonFileReader.onload = (event) => {
                const modelJSON = 
                // tslint:disable-next-line:no-any
                JSON.parse(event.target.result);
                expect(modelJSON.format).toEqual('layers-model');
                expect(modelJSON.generatedBy).toEqual('TensorFlow.js v0.0.0');
                expect(modelJSON.convertedBy).toEqual(null);
                expect(modelJSON.modelTopology).toEqual(modelTopology1);
                expect(modelJSON.modelInitializer).toEqual({});
                expect(modelJSON.weightsManifest.length).toEqual(1);
                expect(modelJSON.weightsManifest[0].weights).toEqual(weightSpecs1);
                expect(modelJSON.trainingConfig).toEqual(trainingConfig1);
                const weightsFile = body.get('model.weights.bin');
                const weightsFileReader = new FileReader();
                weightsFileReader.onload = (event) => {
                    // tslint:disable-next-line:no-any
                    const weightData = event.target.result;
                    expect(new Uint8Array(weightData))
                        .toEqual(new Uint8Array(weightData1));
                    done();
                };
                weightsFileReader.onerror = event => {
                    done.fail(weightsFileReader.error.message);
                };
                weightsFileReader.readAsArrayBuffer(weightsFile);
            };
            jsonFileReader.onerror = event => {
                done.fail(jsonFileReader.error.message);
            };
            jsonFileReader.readAsText(jsonFile);
        })
            .catch(err => {
            done.fail(err.stack);
        });
    });
    it('404 response causes Error', (done) => {
        const handler = tf.io.getSaveHandlers('http://invalid/path')[0];
        handler.save(artifacts1)
            .then(saveResult => {
            done.fail('Calling http at invalid URL succeeded ' +
                'unexpectedly');
        })
            .catch(err => {
            expect().nothing();
            done();
        });
    });
    it('getLoadHandlers with one URL string', () => {
        const handlers = tf.io.getLoadHandlers('http://foo/model.json');
        expect(handlers.length).toEqual(1);
        expect(handlers[0] instanceof HTTPRequest).toEqual(true);
    });
    it('Existing body leads to Error', () => {
        expect(() => tf.io.http('model-upload-test', {
            requestInit: { body: 'existing body' }
        })).toThrowError(/requestInit is expected to have no pre-existing body/);
    });
    it('Empty, null or undefined URL paths lead to Error', () => {
        expect(() => tf.io.http(null))
            .toThrowError(/must not be null, undefined or empty/);
        expect(() => tf.io.http(undefined))
            .toThrowError(/must not be null, undefined or empty/);
        expect(() => tf.io.http(''))
            .toThrowError(/must not be null, undefined or empty/);
    });
    it('router', () => {
        expect(httpRouter('http://bar/foo') instanceof HTTPRequest).toEqual(true);
        expect(httpRouter('https://localhost:5000/upload') instanceof HTTPRequest)
            .toEqual(true);
        expect(httpRouter('localhost://foo')).toBeNull();
        expect(httpRouter('foo:5000/bar')).toBeNull();
    });
});
describeWithFlags('parseUrl', BROWSER_ENVS, () => {
    it('should parse url with no suffix', () => {
        const url = 'http://google.com/file';
        const [prefix, suffix] = parseUrl(url);
        expect(prefix).toEqual('http://google.com/');
        expect(suffix).toEqual('');
    });
    it('should parse url with suffix', () => {
        const url = 'http://google.com/file?param=1';
        const [prefix, suffix] = parseUrl(url);
        expect(prefix).toEqual('http://google.com/');
        expect(suffix).toEqual('?param=1');
    });
    it('should parse url with multiple serach params', () => {
        const url = 'http://google.com/a?x=1/file?param=1';
        const [prefix, suffix] = parseUrl(url);
        expect(prefix).toEqual('http://google.com/a?x=1/');
        expect(suffix).toEqual('?param=1');
    });
});
describeWithFlags('http-load', BROWSER_ENVS, () => {
    describe('JSON model', () => {
        let requestInits;
        beforeEach(() => {
            requestInits = {};
        });
        it('1 group, 2 weights, 1 path', async () => {
            const weightManifest1 = [{
                    paths: ['weightfile0'],
                    weights: [
                        {
                            name: 'dense/kernel',
                            shape: [3, 1],
                            dtype: 'float32',
                        },
                        {
                            name: 'dense/bias',
                            shape: [2],
                            dtype: 'float32',
                        }
                    ]
                }];
            const floatData = new Float32Array([1, 3, 3, 7, 4]);
            setupFakeWeightFiles({
                './model.json': {
                    data: JSON.stringify({
                        modelTopology: modelTopology1,
                        weightsManifest: weightManifest1,
                        format: 'tfjs-graph-model',
                        generatedBy: '1.15',
                        convertedBy: '1.3.1',
                        signature: null,
                        userDefinedMetadata: {},
                        modelInitializer: {}
                    }),
                    contentType: 'application/json'
                },
                './weightfile0': { data: floatData, contentType: 'application/octet-stream' },
            }, requestInits);
            const handler = tf.io.http('./model.json');
            const modelArtifacts = await handler.load();
            expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
            expect(modelArtifacts.weightSpecs).toEqual(weightManifest1[0].weights);
            expect(modelArtifacts.format).toEqual('tfjs-graph-model');
            expect(modelArtifacts.generatedBy).toEqual('1.15');
            expect(modelArtifacts.convertedBy).toEqual('1.3.1');
            expect(modelArtifacts.userDefinedMetadata).toEqual({});
            expect(modelArtifacts.modelInitializer).toEqual({});
            expect(new Float32Array(modelArtifacts.weightData)).toEqual(floatData);
            expect(Object.keys(requestInits).length).toEqual(2);
            // Assert that fetch is invoked with `window` as the context.
            expect(fetchSpy.calls.mostRecent().object).toEqual(window);
        });
        it('1 group, 2 weights, 1 path, with requestInit', async () => {
            const weightManifest1 = [{
                    paths: ['weightfile0'],
                    weights: [
                        {
                            name: 'dense/kernel',
                            shape: [3, 1],
                            dtype: 'float32',
                        },
                        {
                            name: 'dense/bias',
                            shape: [2],
                            dtype: 'float32',
                        }
                    ]
                }];
            const floatData = new Float32Array([1, 3, 3, 7, 4]);
            setupFakeWeightFiles({
                './model.json': {
                    data: JSON.stringify({
                        modelTopology: modelTopology1,
                        weightsManifest: weightManifest1
                    }),
                    contentType: 'application/json'
                },
                './weightfile0': { data: floatData, contentType: 'application/octet-stream' },
            }, requestInits);
            const handler = tf.io.http('./model.json', { requestInit: { headers: { 'header_key_1': 'header_value_1' } } });
            const modelArtifacts = await handler.load();
            expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
            expect(modelArtifacts.weightSpecs).toEqual(weightManifest1[0].weights);
            expect(new Float32Array(modelArtifacts.weightData)).toEqual(floatData);
            expect(Object.keys(requestInits).length).toEqual(2);
            expect(Object.keys(requestInits).length).toEqual(2);
            expect(requestInits['./model.json'].headers['header_key_1'])
                .toEqual('header_value_1');
            expect(requestInits['./weightfile0'].headers['header_key_1'])
                .toEqual('header_value_1');
            expect(fetchSpy.calls.mostRecent().object).toEqual(window);
        });
        it('1 group, 2 weight, 2 paths', async () => {
            const weightManifest1 = [{
                    paths: ['weightfile0', 'weightfile1'],
                    weights: [
                        {
                            name: 'dense/kernel',
                            shape: [3, 1],
                            dtype: 'float32',
                        },
                        {
                            name: 'dense/bias',
                            shape: [2],
                            dtype: 'float32',
                        }
                    ]
                }];
            const floatData1 = new Float32Array([1, 3, 3]);
            const floatData2 = new Float32Array([7, 4]);
            setupFakeWeightFiles({
                './model.json': {
                    data: JSON.stringify({
                        modelTopology: modelTopology1,
                        weightsManifest: weightManifest1
                    }),
                    contentType: 'application/json'
                },
                './weightfile0': { data: floatData1, contentType: 'application/octet-stream' },
                './weightfile1': { data: floatData2, contentType: 'application/octet-stream' }
            }, requestInits);
            const handler = tf.io.http('./model.json');
            const modelArtifacts = await handler.load();
            expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
            expect(modelArtifacts.weightSpecs).toEqual(weightManifest1[0].weights);
            expect(new Float32Array(modelArtifacts.weightData))
                .toEqual(new Float32Array([1, 3, 3, 7, 4]));
        });
        it('2 groups, 2 weight, 2 paths', async () => {
            const weightsManifest = [
                {
                    paths: ['weightfile0'],
                    weights: [{
                            name: 'dense/kernel',
                            shape: [3, 1],
                            dtype: 'float32',
                        }]
                },
                {
                    paths: ['weightfile1'],
                    weights: [{
                            name: 'dense/bias',
                            shape: [2],
                            dtype: 'float32',
                        }],
                }
            ];
            const floatData1 = new Float32Array([1, 3, 3]);
            const floatData2 = new Float32Array([7, 4]);
            setupFakeWeightFiles({
                './model.json': {
                    data: JSON.stringify({ modelTopology: modelTopology1, weightsManifest }),
                    contentType: 'application/json'
                },
                './weightfile0': { data: floatData1, contentType: 'application/octet-stream' },
                './weightfile1': { data: floatData2, contentType: 'application/octet-stream' }
            }, requestInits);
            const handler = tf.io.http('./model.json');
            const modelArtifacts = await handler.load();
            expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
            expect(modelArtifacts.weightSpecs)
                .toEqual(weightsManifest[0].weights.concat(weightsManifest[1].weights));
            expect(new Float32Array(modelArtifacts.weightData))
                .toEqual(new Float32Array([1, 3, 3, 7, 4]));
        });
        it('2 groups, 2 weight, 2 paths, Int32 and Uint8 Data', async () => {
            const weightsManifest = [
                {
                    paths: ['weightfile0'],
                    weights: [{
                            name: 'fooWeight',
                            shape: [3, 1],
                            dtype: 'int32',
                        }]
                },
                {
                    paths: ['weightfile1'],
                    weights: [{
                            name: 'barWeight',
                            shape: [2],
                            dtype: 'bool',
                        }],
                }
            ];
            const floatData1 = new Int32Array([1, 3, 3]);
            const floatData2 = new Uint8Array([7, 4]);
            setupFakeWeightFiles({
                'path1/model.json': {
                    data: JSON.stringify({ modelTopology: modelTopology1, weightsManifest }),
                    contentType: 'application/json'
                },
                'path1/weightfile0': { data: floatData1, contentType: 'application/octet-stream' },
                'path1/weightfile1': { data: floatData2, contentType: 'application/octet-stream' }
            }, requestInits);
            const handler = tf.io.http('path1/model.json');
            const modelArtifacts = await handler.load();
            expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
            expect(modelArtifacts.weightSpecs)
                .toEqual(weightsManifest[0].weights.concat(weightsManifest[1].weights));
            expect(new Int32Array(modelArtifacts.weightData.slice(0, 12)))
                .toEqual(new Int32Array([1, 3, 3]));
            expect(new Uint8Array(modelArtifacts.weightData.slice(12, 14)))
                .toEqual(new Uint8Array([7, 4]));
        });
        it('topology only', async () => {
            setupFakeWeightFiles({
                './model.json': {
                    data: JSON.stringify({ modelTopology: modelTopology1 }),
                    contentType: 'application/json'
                },
            }, requestInits);
            const handler = tf.io.http('./model.json');
            const modelArtifacts = await handler.load();
            expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
            expect(modelArtifacts.weightSpecs).toBeUndefined();
            expect(modelArtifacts.weightData).toBeUndefined();
        });
        it('weights only', async () => {
            const weightsManifest = [
                {
                    paths: ['weightfile0'],
                    weights: [{
                            name: 'fooWeight',
                            shape: [3, 1],
                            dtype: 'int32',
                        }]
                },
                {
                    paths: ['weightfile1'],
                    weights: [{
                            name: 'barWeight',
                            shape: [2],
                            dtype: 'float32',
                        }],
                }
            ];
            const floatData1 = new Int32Array([1, 3, 3]);
            const floatData2 = new Float32Array([-7, -4]);
            setupFakeWeightFiles({
                'path1/model.json': {
                    data: JSON.stringify({ weightsManifest }),
                    contentType: 'application/json'
                },
                'path1/weightfile0': { data: floatData1, contentType: 'application/octet-stream' },
                'path1/weightfile1': { data: floatData2, contentType: 'application/octet-stream' }
            }, requestInits);
            const handler = tf.io.http('path1/model.json');
            const modelArtifacts = await handler.load();
            expect(modelArtifacts.modelTopology).toBeUndefined();
            expect(modelArtifacts.weightSpecs)
                .toEqual(weightsManifest[0].weights.concat(weightsManifest[1].weights));
            expect(new Int32Array(modelArtifacts.weightData.slice(0, 12)))
                .toEqual(new Int32Array([1, 3, 3]));
            expect(new Float32Array(modelArtifacts.weightData.slice(12, 20)))
                .toEqual(new Float32Array([-7, -4]));
        });
        it('Missing modelTopology and weightsManifest leads to error', async () => {
            setupFakeWeightFiles({
                'path1/model.json': { data: JSON.stringify({}), contentType: 'application/json' }
            }, requestInits);
            const handler = tf.io.http('path1/model.json');
            handler.load()
                .then(modelTopology1 => {
                fail('Loading from missing modelTopology and weightsManifest ' +
                    'succeeded unexpectedly.');
            })
                .catch(err => {
                expect(err.message)
                    .toMatch(/contains neither model topology or manifest/);
            });
            expect().nothing();
        });
        it('with fetch rejection leads to error', async () => {
            setupFakeWeightFiles({
                'path1/model.json': { data: JSON.stringify({}), contentType: 'text/html' }
            }, requestInits);
            const handler = tf.io.http('path2/model.json');
            try {
                const data = await handler.load();
                expect(data).toBeDefined();
                fail('Loading with fetch rejection succeeded unexpectedly.');
            }
            catch (err) {
                // This error is mocked in beforeEach
                expect(err).toEqual('path not found');
            }
        });
        it('Provide WeightFileTranslateFunc', async () => {
            const weightManifest1 = [{
                    paths: ['weightfile0'],
                    weights: [
                        {
                            name: 'dense/kernel',
                            shape: [3, 1],
                            dtype: 'float32',
                        },
                        {
                            name: 'dense/bias',
                            shape: [2],
                            dtype: 'float32',
                        }
                    ]
                }];
            const floatData = new Float32Array([1, 3, 3, 7, 4]);
            setupFakeWeightFiles({
                './model.json': {
                    data: JSON.stringify({
                        modelTopology: modelTopology1,
                        weightsManifest: weightManifest1
                    }),
                    contentType: 'application/json'
                },
                'auth_weightfile0': { data: floatData, contentType: 'application/octet-stream' },
            }, requestInits);
            async function prefixWeightUrlConverter(weightFile) {
                // Add 'auth_' prefix to the weight file url.
                return new Promise(resolve => setTimeout(resolve, 1, 'auth_' + weightFile));
            }
            const handler = tf.io.http('./model.json', {
                requestInit: { headers: { 'header_key_1': 'header_value_1' } },
                weightUrlConverter: prefixWeightUrlConverter
            });
            const modelArtifacts = await handler.load();
            expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
            expect(modelArtifacts.weightSpecs).toEqual(weightManifest1[0].weights);
            expect(new Float32Array(modelArtifacts.weightData)).toEqual(floatData);
            expect(Object.keys(requestInits).length).toEqual(2);
            expect(Object.keys(requestInits).length).toEqual(2);
            expect(requestInits['./model.json'].headers['header_key_1'])
                .toEqual('header_value_1');
            expect(requestInits['auth_weightfile0'].headers['header_key_1'])
                .toEqual('header_value_1');
            expect(fetchSpy.calls.mostRecent().object).toEqual(window);
        });
    });
    it('Overriding BrowserHTTPRequest fetchFunc', async () => {
        const weightManifest1 = [{
                paths: ['weightfile0'],
                weights: [
                    {
                        name: 'dense/kernel',
                        shape: [3, 1],
                        dtype: 'float32',
                    },
                    {
                        name: 'dense/bias',
                        shape: [2],
                        dtype: 'float32',
                    }
                ]
            }];
        const floatData = new Float32Array([1, 3, 3, 7, 4]);
        const fetchInputs = [];
        const fetchInits = [];
        async function customFetch(input, init) {
            fetchInputs.push(input);
            fetchInits.push(init);
            if (input === './model.json') {
                return new Response(JSON.stringify({
                    modelTopology: modelTopology1,
                    weightsManifest: weightManifest1,
                    trainingConfig: trainingConfig1
                }), { status: 200, headers: { 'content-type': 'application/json' } });
            }
            else if (input === './weightfile0') {
                return new Response(floatData, {
                    status: 200,
                    headers: { 'content-type': 'application/octet-stream' }
                });
            }
            else {
                return new Response(null, { status: 404 });
            }
        }
        const handler = tf.io.http('./model.json', { requestInit: { credentials: 'include' }, fetchFunc: customFetch });
        const modelArtifacts = await handler.load();
        expect(modelArtifacts.modelTopology).toEqual(modelTopology1);
        expect(modelArtifacts.trainingConfig).toEqual(trainingConfig1);
        expect(modelArtifacts.weightSpecs).toEqual(weightManifest1[0].weights);
        expect(new Float32Array(modelArtifacts.weightData)).toEqual(floatData);
        expect(fetchInputs).toEqual(['./model.json', './weightfile0']);
        expect(fetchInits.length).toEqual(2);
        expect(fetchInits[0].credentials).toEqual('include');
        expect(fetchInits[1].credentials).toEqual('include');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cF90ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9pby9odHRwX3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxLQUFLLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDL0IsT0FBTyxFQUFDLFlBQVksRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDeEYsT0FBTyxFQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBRXpELGFBQWE7QUFDYixNQUFNLGNBQWMsR0FBTztJQUN6QixZQUFZLEVBQUUsWUFBWTtJQUMxQixlQUFlLEVBQUUsT0FBTztJQUN4QixRQUFRLEVBQUUsQ0FBQztZQUNULFlBQVksRUFBRSxPQUFPO1lBQ3JCLFFBQVEsRUFBRTtnQkFDUixvQkFBb0IsRUFBRTtvQkFDcEIsWUFBWSxFQUFFLGlCQUFpQjtvQkFDL0IsUUFBUSxFQUFFO3dCQUNSLGNBQWMsRUFBRSxTQUFTO3dCQUN6QixPQUFPLEVBQUUsR0FBRzt3QkFDWixNQUFNLEVBQUUsSUFBSTt3QkFDWixNQUFNLEVBQUUsU0FBUztxQkFDbEI7aUJBQ0Y7Z0JBQ0QsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsbUJBQW1CLEVBQUUsSUFBSTtnQkFDekIsa0JBQWtCLEVBQUUsSUFBSTtnQkFDeEIsaUJBQWlCLEVBQUUsSUFBSTtnQkFDdkIsT0FBTyxFQUFFLFNBQVM7Z0JBQ2xCLFlBQVksRUFBRSxRQUFRO2dCQUN0QixXQUFXLEVBQUUsSUFBSTtnQkFDakIsb0JBQW9CLEVBQUUsSUFBSTtnQkFDMUIsa0JBQWtCLEVBQUUsRUFBQyxZQUFZLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUM7Z0JBQ3pELE9BQU8sRUFBRSxDQUFDO2dCQUNWLG1CQUFtQixF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Q0FBQyxjQUFjLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQztRQUMvRCxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyRCxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN2RCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQgKiBhcyB0ZiBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQge0JST1dTRVJfRU5WUywgQ0hST01FX0VOVlMsIGRlc2NyaWJlV2l0aEZsYWdzLCBOT0RFX0VOVlN9IGZyb20gJy4uL2phc21pbmVfdXRpbCc7XG5pbXBvcnQge0hUVFBSZXF1ZXN0LCBodHRwUm91dGVyLCBwYXJzZVVybH0gZnJvbSAnLi9odHRwJztcblxuLy8gVGVzdCBkYXRhLlxuY29uc3QgbW9kZWxUb3BvbG9neTE6IHt9ID0ge1xuICAnY2xhc3NfbmFtZSc6ICdTZXF1ZW50aWFsJyxcbiAgJ2tlcmFzX3ZlcnNpb24nOiAnMi4xLjQnLFxuICAnY29uZmlnJzogW3tcbiAgICAnY2xhc3NfbmFtZSc6ICdEZW5zZScsXG4gICAgJ2NvbmZpZyc6IHtcbiAgICAgICdrZXJuZWxfaW5pdGlhbGl6ZXInOiB7XG4gICAgICAgICdjbGFzc19uYW1lJzogJ1ZhcmlhbmNlU2NhbGluZycsXG4gICAgICAgICdjb25maWcnOiB7XG4gICAgICAgICAgJ2Rpc3RyaWJ1dGlvbic6ICd1bmlmb3JtJyxcbiAgICAgICAgICAnc2NhbGUnOiAxLjAsXG4gICAgICAgICAgJ3NlZWQnOiBudWxsLFxuICAgICAgICAgICdtb2RlJzogJ2Zhbl9hdmcnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnbmFtZSc6ICdkZW5zZScsXG4gICAgICAna2VybmVsX2NvbnN0cmFpbnQnOiBudWxsLFxuICAgICAgJ2JpYXNfcmVndWxhcml6ZXInOiBudWxsLFxuICAgICAgJ2JpYXNfY29uc3RyYWludCc6IG51bGwsXG4gICAgICAnZHR5cGUnOiAnZmxvYXQzMicsXG4gICAgICAnYWN0aXZhdGlvbic6ICdsaW5lYXInLFxuICAgICAgJ3RyYWluYWJsZSc6IHRydWUsXG4gICAgICAna2VybmVsX3JlZ3VsYXJpemVyJzogbnVsbCxcbiAgICAgICdiaWFzX2luaXRpYWxpemVyJzogeydjbGFzc19uYW1lJzogJ1plcm9zJywgJ2NvbmZpZyc6IHt9fSxcbiAgICAgICd1bml0cyc6IDEsXG4gICAgICAnYmF0Y2hfaW5wdXRfc2hhcGUnOiBbbnVsbCwgM10sXG4gICAgICAndXNlX2JpYXMnOiB0cnVlLFxuICAgICAgJ2FjdGl2aXR5X3JlZ3VsYXJpemVyJzogbnVsbFxuICAgIH1cbiAgfV0sXG4gICdiYWNrZW5kJzogJ3RlbnNvcmZsb3cnXG59O1xuY29uc3QgdHJhaW5pbmdDb25maWcxOiB0Zi5pby5UcmFpbmluZ0NvbmZpZyA9IHtcbiAgbG9zczogJ2NhdGVnb3JpY2FsX2Nyb3NzZW50cm9weScsXG4gIG1ldHJpY3M6IFsnYWNjdXJhY3knXSxcbiAgb3B0aW1pemVyX2NvbmZpZzoge2NsYXNzX25hbWU6ICdTR0QnLCBjb25maWc6IHtsZWFybmluZ1JhdGU6IDAuMX19XG59O1xuXG5sZXQgZmV0Y2hTcHk6IGphc21pbmUuU3B5O1xuXG50eXBlIFR5cGVkQXJyYXlzID0gRmxvYXQzMkFycmF5fEludDMyQXJyYXl8VWludDhBcnJheXxVaW50MTZBcnJheTtcbmNvbnN0IGZha2VSZXNwb25zZSA9XG4gICAgKGJvZHk6IHN0cmluZ3xUeXBlZEFycmF5c3xBcnJheUJ1ZmZlciwgY29udGVudFR5cGU6IHN0cmluZywgcGF0aDogc3RyaW5nKSA9PlxuICAgICAgICAoe1xuICAgICAgICAgIG9rOiB0cnVlLFxuICAgICAgICAgIGpzb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKEpTT04ucGFyc2UoYm9keSBhcyBzdHJpbmcpKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFycmF5QnVmZmVyKCkge1xuICAgICAgICAgICAgY29uc3QgYnVmOiBBcnJheUJ1ZmZlciA9IChib2R5IGFzIFR5cGVkQXJyYXlzKS5idWZmZXIgP1xuICAgICAgICAgICAgICAgIChib2R5IGFzIFR5cGVkQXJyYXlzKS5idWZmZXIgOlxuICAgICAgICAgICAgICAgIGJvZHkgYXMgQXJyYXlCdWZmZXI7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGJ1Zik7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBoZWFkZXJzOiB7Z2V0OiAoa2V5OiBzdHJpbmcpID0+IGNvbnRlbnRUeXBlfSxcbiAgICAgICAgICB1cmw6IHBhdGhcbiAgICAgICAgfSkgYXMgdW5rbm93biBhcyBSZXNwb25zZTtcblxuY29uc3Qgc2V0dXBGYWtlV2VpZ2h0RmlsZXMgPVxuICAgIChmaWxlQnVmZmVyTWFwOiB7XG4gICAgICBbZmlsZW5hbWU6IHN0cmluZ106IHtcbiAgICAgICAgZGF0YTogc3RyaW5nfEZsb2F0MzJBcnJheXxJbnQzMkFycmF5fEFycmF5QnVmZmVyfFVpbnQ4QXJyYXl8VWludDE2QXJyYXksXG4gICAgICAgIGNvbnRlbnRUeXBlOiBzdHJpbmdcbiAgICAgIH1cbiAgICB9LFxuICAgICByZXF1ZXN0SW5pdHM6IHtba2V5OiBzdHJpbmddOiBSZXF1ZXN0SW5pdH0pID0+IHtcbiAgICAgIGZldGNoU3B5ID0gc3B5T24odGYuZW52KCkucGxhdGZvcm0sICdmZXRjaCcpXG4gICAgICAgICAgICAgICAgICAgICAuYW5kLmNhbGxGYWtlKChwYXRoOiBzdHJpbmcsIGluaXQ6IFJlcXVlc3RJbml0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWxlQnVmZmVyTWFwW3BhdGhdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEluaXRzW3BhdGhdID0gaW5pdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZha2VSZXNwb25zZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZUJ1ZmZlck1hcFtwYXRoXS5kYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlQnVmZmVyTWFwW3BhdGhdLmNvbnRlbnRUeXBlLCBwYXRoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCdwYXRoIG5vdCBmb3VuZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICB9O1xuXG5kZXNjcmliZVdpdGhGbGFncygnaHR0cC1sb2FkIGZldGNoJywgTk9ERV9FTlZTLCAoKSA9PiB7XG4gIGxldCByZXF1ZXN0SW5pdHM6IHtba2V5OiBzdHJpbmddOiB7aGVhZGVyczoge1trZXk6IHN0cmluZ106IHN0cmluZ319fTtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICBsZXQgb3JpZ2luYWxGZXRjaDogYW55O1xuICAvLyBzaW11bGF0ZSBhIGZldGNoIHBvbHlmaWxsLCB0aGlzIG5lZWRzIHRvIGJlIG5vbi1udWxsIGZvciBzcHlPbiB0byB3b3JrXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICBvcmlnaW5hbEZldGNoID0gKGdsb2JhbCBhcyBhbnkpLmZldGNoO1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICAoZ2xvYmFsIGFzIGFueSkuZmV0Y2ggPSAoKSA9PiB7fTtcbiAgICByZXF1ZXN0SW5pdHMgPSB7fTtcbiAgfSk7XG5cbiAgYWZ0ZXJBbGwoKCkgPT4ge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICAoZ2xvYmFsIGFzIGFueSkuZmV0Y2ggPSBvcmlnaW5hbEZldGNoO1xuICB9KTtcblxuICBpdCgnMSBncm91cCwgMiB3ZWlnaHRzLCAxIHBhdGgnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qgd2VpZ2h0TWFuaWZlc3QxOiB0Zi5pby5XZWlnaHRzTWFuaWZlc3RDb25maWcgPSBbe1xuICAgICAgcGF0aHM6IFsnd2VpZ2h0ZmlsZTAnXSxcbiAgICAgIHdlaWdodHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdkZW5zZS9rZXJuZWwnLFxuICAgICAgICAgIHNoYXBlOiBbMywgMV0sXG4gICAgICAgICAgZHR5cGU6ICdmbG9hdDMyJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdkZW5zZS9iaWFzJyxcbiAgICAgICAgICBzaGFwZTogWzJdLFxuICAgICAgICAgIGR0eXBlOiAnZmxvYXQzMicsXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XTtcbiAgICBjb25zdCBmbG9hdERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KFsxLCAzLCAzLCA3LCA0XSk7XG4gICAgc2V0dXBGYWtlV2VpZ2h0RmlsZXMoXG4gICAgICAgIHtcbiAgICAgICAgICAnLi9tb2RlbC5qc29uJzoge1xuICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICBtb2RlbFRvcG9sb2d5OiBtb2RlbFRvcG9sb2d5MSxcbiAgICAgICAgICAgICAgd2VpZ2h0c01hbmlmZXN0OiB3ZWlnaHRNYW5pZmVzdDEsXG4gICAgICAgICAgICAgIGZvcm1hdDogJ3RmanMtbGF5ZXJzJyxcbiAgICAgICAgICAgICAgZ2VuZXJhdGVkQnk6ICcxLjE1JyxcbiAgICAgICAgICAgICAgY29udmVydGVkQnk6ICcxLjMuMScsXG4gICAgICAgICAgICAgIHNpZ25hdHVyZTogbnVsbCxcbiAgICAgICAgICAgICAgdXNlckRlZmluZWRNZXRhZGF0YToge31cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJy4vd2VpZ2h0ZmlsZTAnOlxuICAgICAgICAgICAgICB7ZGF0YTogZmxvYXREYXRhLCBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSd9LFxuICAgICAgICB9LFxuICAgICAgICByZXF1ZXN0SW5pdHMpO1xuXG4gICAgY29uc3QgaGFuZGxlciA9IHRmLmlvLmh0dHAoJy4vbW9kZWwuanNvbicpO1xuICAgIGNvbnN0IG1vZGVsQXJ0aWZhY3RzID0gYXdhaXQgaGFuZGxlci5sb2FkKCk7XG4gICAgZXhwZWN0KG1vZGVsQXJ0aWZhY3RzLm1vZGVsVG9wb2xvZ3kpLnRvRXF1YWwobW9kZWxUb3BvbG9neTEpO1xuICAgIGV4cGVjdChtb2RlbEFydGlmYWN0cy53ZWlnaHRTcGVjcykudG9FcXVhbCh3ZWlnaHRNYW5pZmVzdDFbMF0ud2VpZ2h0cyk7XG4gICAgZXhwZWN0KG1vZGVsQXJ0aWZhY3RzLmZvcm1hdCkudG9FcXVhbCgndGZqcy1sYXllcnMnKTtcbiAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMuZ2VuZXJhdGVkQnkpLnRvRXF1YWwoJzEuMTUnKTtcbiAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMuY29udmVydGVkQnkpLnRvRXF1YWwoJzEuMy4xJyk7XG4gICAgZXhwZWN0KG1vZGVsQXJ0aWZhY3RzLnVzZXJEZWZpbmVkTWV0YWRhdGEpLnRvRXF1YWwoe30pO1xuICAgIGV4cGVjdChuZXcgRmxvYXQzMkFycmF5KG1vZGVsQXJ0aWZhY3RzLndlaWdodERhdGEpKS50b0VxdWFsKGZsb2F0RGF0YSk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvdyBleGNlcHRpb24gaWYgbm8gZmV0Y2ggcG9seWZpbGwnLCAoKSA9PiB7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgIGRlbGV0ZSAoZ2xvYmFsIGFzIGFueSkuZmV0Y2g7XG4gICAgdHJ5IHtcbiAgICAgIHRmLmlvLmh0dHAoJy4vbW9kZWwuanNvbicpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgZXhwZWN0KGVyci5tZXNzYWdlKS50b01hdGNoKC9VbmFibGUgdG8gZmluZCBmZXRjaCBwb2x5ZmlsbC4vKTtcbiAgICB9XG4gIH0pO1xufSk7XG5cbi8vIFR1cm5lZCBvZmYgZm9yIG90aGVyIGJyb3dzZXJzIGR1ZSB0bzpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90ZW5zb3JmbG93L3RmanMvaXNzdWVzLzQyNlxuZGVzY3JpYmVXaXRoRmxhZ3MoJ2h0dHAtc2F2ZScsIENIUk9NRV9FTlZTLCAoKSA9PiB7XG4gIC8vIFRlc3QgZGF0YS5cbiAgY29uc3Qgd2VpZ2h0U3BlY3MxOiB0Zi5pby5XZWlnaHRzTWFuaWZlc3RFbnRyeVtdID0gW1xuICAgIHtcbiAgICAgIG5hbWU6ICdkZW5zZS9rZXJuZWwnLFxuICAgICAgc2hhcGU6IFszLCAxXSxcbiAgICAgIGR0eXBlOiAnZmxvYXQzMicsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnZGVuc2UvYmlhcycsXG4gICAgICBzaGFwZTogWzFdLFxuICAgICAgZHR5cGU6ICdmbG9hdDMyJyxcbiAgICB9XG4gIF07XG4gIGNvbnN0IHdlaWdodERhdGExID0gbmV3IEFycmF5QnVmZmVyKDE2KTtcbiAgY29uc3QgYXJ0aWZhY3RzMTogdGYuaW8uTW9kZWxBcnRpZmFjdHMgPSB7XG4gICAgbW9kZWxUb3BvbG9neTogbW9kZWxUb3BvbG9neTEsXG4gICAgd2VpZ2h0U3BlY3M6IHdlaWdodFNwZWNzMSxcbiAgICB3ZWlnaHREYXRhOiB3ZWlnaHREYXRhMSxcbiAgICBmb3JtYXQ6ICdsYXllcnMtbW9kZWwnLFxuICAgIGdlbmVyYXRlZEJ5OiAnVGVuc29yRmxvdy5qcyB2MC4wLjAnLFxuICAgIGNvbnZlcnRlZEJ5OiBudWxsLFxuICAgIHNpZ25hdHVyZTogbnVsbCxcbiAgICB1c2VyRGVmaW5lZE1ldGFkYXRhOiB7fSxcbiAgICBtb2RlbEluaXRpYWxpemVyOiB7fSxcbiAgICB0cmFpbmluZ0NvbmZpZzogdHJhaW5pbmdDb25maWcxXG4gIH07XG5cbiAgbGV0IHJlcXVlc3RJbml0czogUmVxdWVzdEluaXRbXSA9IFtdO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHJlcXVlc3RJbml0cyA9IFtdO1xuICAgIHNweU9uKHRmLmVudigpLnBsYXRmb3JtLCAnZmV0Y2gnKVxuICAgICAgICAuYW5kLmNhbGxGYWtlKChwYXRoOiBzdHJpbmcsIGluaXQ6IFJlcXVlc3RJbml0KSA9PiB7XG4gICAgICAgICAgaWYgKHBhdGggPT09ICdtb2RlbC11cGxvYWQtdGVzdCcgfHxcbiAgICAgICAgICAgICAgcGF0aCA9PT0gJ2h0dHA6Ly9tb2RlbC11cGxvYWQtdGVzdCcpIHtcbiAgICAgICAgICAgIHJlcXVlc3RJbml0cy5wdXNoKGluaXQpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogMjAwfSkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IDQwNH0pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICB9KTtcblxuICBpdCgnU2F2ZSB0b3BvbG9neSBhbmQgd2VpZ2h0cywgZGVmYXVsdCBQT1NUIG1ldGhvZCcsIChkb25lKSA9PiB7XG4gICAgY29uc3QgdGVzdFN0YXJ0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgaGFuZGxlciA9IHRmLmlvLmdldFNhdmVIYW5kbGVycygnaHR0cDovL21vZGVsLXVwbG9hZC10ZXN0JylbMF07XG4gICAgaGFuZGxlci5zYXZlKGFydGlmYWN0czEpXG4gICAgICAgIC50aGVuKHNhdmVSZXN1bHQgPT4ge1xuICAgICAgICAgIGV4cGVjdChzYXZlUmVzdWx0Lm1vZGVsQXJ0aWZhY3RzSW5mby5kYXRlU2F2ZWQuZ2V0VGltZSgpKVxuICAgICAgICAgICAgICAudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCh0ZXN0U3RhcnREYXRlLmdldFRpbWUoKSk7XG4gICAgICAgICAgLy8gTm90ZTogVGhlIGZvbGxvd2luZyB0d28gYXNzZXJ0aW9ucyB3b3JrIG9ubHkgYmVjYXVzZSB0aGVyZSBpcyBub1xuICAgICAgICAgIC8vICAgbm9uLUFTQ0lJIGNoYXJhY3RlcnMgaW4gYG1vZGVsVG9wb2xvZ3kxYCBhbmQgYHdlaWdodFNwZWNzMWAuXG4gICAgICAgICAgZXhwZWN0KHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvLm1vZGVsVG9wb2xvZ3lCeXRlcylcbiAgICAgICAgICAgICAgLnRvRXF1YWwoSlNPTi5zdHJpbmdpZnkobW9kZWxUb3BvbG9neTEpLmxlbmd0aCk7XG4gICAgICAgICAgZXhwZWN0KHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvLndlaWdodFNwZWNzQnl0ZXMpXG4gICAgICAgICAgICAgIC50b0VxdWFsKEpTT04uc3RyaW5naWZ5KHdlaWdodFNwZWNzMSkubGVuZ3RoKTtcbiAgICAgICAgICBleHBlY3Qoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8ud2VpZ2h0RGF0YUJ5dGVzKVxuICAgICAgICAgICAgICAudG9FcXVhbCh3ZWlnaHREYXRhMS5ieXRlTGVuZ3RoKTtcblxuICAgICAgICAgIGV4cGVjdChyZXF1ZXN0SW5pdHMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgIGNvbnN0IGluaXQgPSByZXF1ZXN0SW5pdHNbMF07XG4gICAgICAgICAgZXhwZWN0KGluaXQubWV0aG9kKS50b0VxdWFsKCdQT1NUJyk7XG4gICAgICAgICAgY29uc3QgYm9keSA9IGluaXQuYm9keSBhcyBGb3JtRGF0YTtcbiAgICAgICAgICBjb25zdCBqc29uRmlsZSA9IGJvZHkuZ2V0KCdtb2RlbC5qc29uJykgYXMgRmlsZTtcbiAgICAgICAgICBjb25zdCBqc29uRmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgICAganNvbkZpbGVSZWFkZXIub25sb2FkID0gKGV2ZW50OiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZWxKU09OID1cbiAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgICAgICAgICAgICAgSlNPTi5wYXJzZSgoZXZlbnQudGFyZ2V0IGFzIGFueSkucmVzdWx0KSBhcyB0Zi5pby5Nb2RlbEpTT047XG4gICAgICAgICAgICBleHBlY3QobW9kZWxKU09OLm1vZGVsVG9wb2xvZ3kpLnRvRXF1YWwobW9kZWxUb3BvbG9neTEpO1xuICAgICAgICAgICAgZXhwZWN0KG1vZGVsSlNPTi53ZWlnaHRzTWFuaWZlc3QubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgZXhwZWN0KG1vZGVsSlNPTi53ZWlnaHRzTWFuaWZlc3RbMF0ud2VpZ2h0cykudG9FcXVhbCh3ZWlnaHRTcGVjczEpO1xuICAgICAgICAgICAgZXhwZWN0KG1vZGVsSlNPTi50cmFpbmluZ0NvbmZpZykudG9FcXVhbCh0cmFpbmluZ0NvbmZpZzEpO1xuXG4gICAgICAgICAgICBjb25zdCB3ZWlnaHRzRmlsZSA9IGJvZHkuZ2V0KCdtb2RlbC53ZWlnaHRzLmJpbicpIGFzIEZpbGU7XG4gICAgICAgICAgICBjb25zdCB3ZWlnaHRzRmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgICAgICB3ZWlnaHRzRmlsZVJlYWRlci5vbmxvYWQgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICAgICAgICAgICAgY29uc3Qgd2VpZ2h0RGF0YSA9IChldmVudC50YXJnZXQgYXMgYW55KS5yZXN1bHQgYXMgQXJyYXlCdWZmZXI7XG4gICAgICAgICAgICAgIGV4cGVjdChuZXcgVWludDhBcnJheSh3ZWlnaHREYXRhKSlcbiAgICAgICAgICAgICAgICAgIC50b0VxdWFsKG5ldyBVaW50OEFycmF5KHdlaWdodERhdGExKSk7XG4gICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB3ZWlnaHRzRmlsZVJlYWRlci5vbmVycm9yID0gZXYgPT4ge1xuICAgICAgICAgICAgICBkb25lLmZhaWwod2VpZ2h0c0ZpbGVSZWFkZXIuZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgd2VpZ2h0c0ZpbGVSZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIod2VpZ2h0c0ZpbGUpO1xuICAgICAgICAgIH07XG4gICAgICAgICAganNvbkZpbGVSZWFkZXIub25lcnJvciA9IGV2ID0+IHtcbiAgICAgICAgICAgIGRvbmUuZmFpbChqc29uRmlsZVJlYWRlci5lcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIGpzb25GaWxlUmVhZGVyLnJlYWRBc1RleHQoanNvbkZpbGUpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICBkb25lLmZhaWwoZXJyLnN0YWNrKTtcbiAgICAgICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdTYXZlIHRvcG9sb2d5IG9ubHksIGRlZmF1bHQgUE9TVCBtZXRob2QnLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IHRlc3RTdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGhhbmRsZXIgPSB0Zi5pby5nZXRTYXZlSGFuZGxlcnMoJ2h0dHA6Ly9tb2RlbC11cGxvYWQtdGVzdCcpWzBdO1xuICAgIGNvbnN0IHRvcG9sb2d5T25seUFydGlmYWN0cyA9IHttb2RlbFRvcG9sb2d5OiBtb2RlbFRvcG9sb2d5MX07XG4gICAgaGFuZGxlci5zYXZlKHRvcG9sb2d5T25seUFydGlmYWN0cylcbiAgICAgICAgLnRoZW4oc2F2ZVJlc3VsdCA9PiB7XG4gICAgICAgICAgZXhwZWN0KHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvLmRhdGVTYXZlZC5nZXRUaW1lKCkpXG4gICAgICAgICAgICAgIC50b0JlR3JlYXRlclRoYW5PckVxdWFsKHRlc3RTdGFydERhdGUuZ2V0VGltZSgpKTtcbiAgICAgICAgICAvLyBOb3RlOiBUaGUgZm9sbG93aW5nIHR3byBhc3NlcnRpb25zIHdvcmsgb25seSBiZWNhdXNlIHRoZXJlIGlzIG5vXG4gICAgICAgICAgLy8gICBub24tQVNDSUkgY2hhcmFjdGVycyBpbiBgbW9kZWxUb3BvbG9neTFgIGFuZCBgd2VpZ2h0U3BlY3MxYC5cbiAgICAgICAgICBleHBlY3Qoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8ubW9kZWxUb3BvbG9neUJ5dGVzKVxuICAgICAgICAgICAgICAudG9FcXVhbChKU09OLnN0cmluZ2lmeShtb2RlbFRvcG9sb2d5MSkubGVuZ3RoKTtcbiAgICAgICAgICBleHBlY3Qoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8ud2VpZ2h0U3BlY3NCeXRlcykudG9FcXVhbCgwKTtcbiAgICAgICAgICBleHBlY3Qoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8ud2VpZ2h0RGF0YUJ5dGVzKS50b0VxdWFsKDApO1xuXG4gICAgICAgICAgZXhwZWN0KHJlcXVlc3RJbml0cy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgICAgY29uc3QgaW5pdCA9IHJlcXVlc3RJbml0c1swXTtcbiAgICAgICAgICBleHBlY3QoaW5pdC5tZXRob2QpLnRvRXF1YWwoJ1BPU1QnKTtcbiAgICAgICAgICBjb25zdCBib2R5ID0gaW5pdC5ib2R5IGFzIEZvcm1EYXRhO1xuICAgICAgICAgIGNvbnN0IGpzb25GaWxlID0gYm9keS5nZXQoJ21vZGVsLmpzb24nKSBhcyBGaWxlO1xuICAgICAgICAgIGNvbnN0IGpzb25GaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgICBqc29uRmlsZVJlYWRlci5vbmxvYWQgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgICAgICAgICBjb25zdCBtb2RlbEpTT04gPSBKU09OLnBhcnNlKChldmVudC50YXJnZXQgYXMgYW55KS5yZXN1bHQpO1xuICAgICAgICAgICAgZXhwZWN0KG1vZGVsSlNPTi5tb2RlbFRvcG9sb2d5KS50b0VxdWFsKG1vZGVsVG9wb2xvZ3kxKTtcbiAgICAgICAgICAgIC8vIE5vIHdlaWdodHMgc2hvdWxkIGhhdmUgYmVlbiBzZW50IHRvIHRoZSBzZXJ2ZXIuXG4gICAgICAgICAgICBleHBlY3QoYm9keS5nZXQoJ21vZGVsLndlaWdodHMuYmluJykpLnRvRXF1YWwobnVsbCk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgICBqc29uRmlsZVJlYWRlci5vbmVycm9yID0gZXZlbnQgPT4ge1xuICAgICAgICAgICAgZG9uZS5mYWlsKGpzb25GaWxlUmVhZGVyLmVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgIH07XG4gICAgICAgICAganNvbkZpbGVSZWFkZXIucmVhZEFzVGV4dChqc29uRmlsZSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgIGRvbmUuZmFpbChlcnIuc3RhY2spO1xuICAgICAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ1NhdmUgdG9wb2xvZ3kgYW5kIHdlaWdodHMsIFBVVCBtZXRob2QsIGV4dHJhIGhlYWRlcnMnLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IHRlc3RTdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGhhbmRsZXIgPSB0Zi5pby5odHRwKCdtb2RlbC11cGxvYWQtdGVzdCcsIHtcbiAgICAgIHJlcXVlc3RJbml0OiB7XG4gICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgIGhlYWRlcnM6XG4gICAgICAgICAgICB7J2hlYWRlcl9rZXlfMSc6ICdoZWFkZXJfdmFsdWVfMScsICdoZWFkZXJfa2V5XzInOiAnaGVhZGVyX3ZhbHVlXzInfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGhhbmRsZXIuc2F2ZShhcnRpZmFjdHMxKVxuICAgICAgICAudGhlbihzYXZlUmVzdWx0ID0+IHtcbiAgICAgICAgICBleHBlY3Qoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8uZGF0ZVNhdmVkLmdldFRpbWUoKSlcbiAgICAgICAgICAgICAgLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwodGVzdFN0YXJ0RGF0ZS5nZXRUaW1lKCkpO1xuICAgICAgICAgIC8vIE5vdGU6IFRoZSBmb2xsb3dpbmcgdHdvIGFzc2VydGlvbnMgd29yayBvbmx5IGJlY2F1c2UgdGhlcmUgaXMgbm9cbiAgICAgICAgICAvLyAgIG5vbi1BU0NJSSBjaGFyYWN0ZXJzIGluIGBtb2RlbFRvcG9sb2d5MWAgYW5kIGB3ZWlnaHRTcGVjczFgLlxuICAgICAgICAgIGV4cGVjdChzYXZlUmVzdWx0Lm1vZGVsQXJ0aWZhY3RzSW5mby5tb2RlbFRvcG9sb2d5Qnl0ZXMpXG4gICAgICAgICAgICAgIC50b0VxdWFsKEpTT04uc3RyaW5naWZ5KG1vZGVsVG9wb2xvZ3kxKS5sZW5ndGgpO1xuICAgICAgICAgIGV4cGVjdChzYXZlUmVzdWx0Lm1vZGVsQXJ0aWZhY3RzSW5mby53ZWlnaHRTcGVjc0J5dGVzKVxuICAgICAgICAgICAgICAudG9FcXVhbChKU09OLnN0cmluZ2lmeSh3ZWlnaHRTcGVjczEpLmxlbmd0aCk7XG4gICAgICAgICAgZXhwZWN0KHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvLndlaWdodERhdGFCeXRlcylcbiAgICAgICAgICAgICAgLnRvRXF1YWwod2VpZ2h0RGF0YTEuYnl0ZUxlbmd0aCk7XG5cbiAgICAgICAgICBleHBlY3QocmVxdWVzdEluaXRzLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgICBjb25zdCBpbml0ID0gcmVxdWVzdEluaXRzWzBdO1xuICAgICAgICAgIGV4cGVjdChpbml0Lm1ldGhvZCkudG9FcXVhbCgnUFVUJyk7XG5cbiAgICAgICAgICAvLyBDaGVjayBoZWFkZXJzLlxuICAgICAgICAgIGV4cGVjdChpbml0LmhlYWRlcnMpLnRvRXF1YWwoe1xuICAgICAgICAgICAgJ2hlYWRlcl9rZXlfMSc6ICdoZWFkZXJfdmFsdWVfMScsXG4gICAgICAgICAgICAnaGVhZGVyX2tleV8yJzogJ2hlYWRlcl92YWx1ZV8yJ1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY29uc3QgYm9keSA9IGluaXQuYm9keSBhcyBGb3JtRGF0YTtcbiAgICAgICAgICBjb25zdCBqc29uRmlsZSA9IGJvZHkuZ2V0KCdtb2RlbC5qc29uJykgYXMgRmlsZTtcbiAgICAgICAgICBjb25zdCBqc29uRmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgICAganNvbkZpbGVSZWFkZXIub25sb2FkID0gKGV2ZW50OiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZWxKU09OID1cbiAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgICAgICAgICAgICAgSlNPTi5wYXJzZSgoZXZlbnQudGFyZ2V0IGFzIGFueSkucmVzdWx0KSBhcyB0Zi5pby5Nb2RlbEpTT047XG4gICAgICAgICAgICBleHBlY3QobW9kZWxKU09OLmZvcm1hdCkudG9FcXVhbCgnbGF5ZXJzLW1vZGVsJyk7XG4gICAgICAgICAgICBleHBlY3QobW9kZWxKU09OLmdlbmVyYXRlZEJ5KS50b0VxdWFsKCdUZW5zb3JGbG93LmpzIHYwLjAuMCcpO1xuICAgICAgICAgICAgZXhwZWN0KG1vZGVsSlNPTi5jb252ZXJ0ZWRCeSkudG9FcXVhbChudWxsKTtcbiAgICAgICAgICAgIGV4cGVjdChtb2RlbEpTT04ubW9kZWxUb3BvbG9neSkudG9FcXVhbChtb2RlbFRvcG9sb2d5MSk7XG4gICAgICAgICAgICBleHBlY3QobW9kZWxKU09OLm1vZGVsSW5pdGlhbGl6ZXIpLnRvRXF1YWwoe30pO1xuICAgICAgICAgICAgZXhwZWN0KG1vZGVsSlNPTi53ZWlnaHRzTWFuaWZlc3QubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgZXhwZWN0KG1vZGVsSlNPTi53ZWlnaHRzTWFuaWZlc3RbMF0ud2VpZ2h0cykudG9FcXVhbCh3ZWlnaHRTcGVjczEpO1xuICAgICAgICAgICAgZXhwZWN0KG1vZGVsSlNPTi50cmFpbmluZ0NvbmZpZykudG9FcXVhbCh0cmFpbmluZ0NvbmZpZzEpO1xuXG4gICAgICAgICAgICBjb25zdCB3ZWlnaHRzRmlsZSA9IGJvZHkuZ2V0KCdtb2RlbC53ZWlnaHRzLmJpbicpIGFzIEZpbGU7XG4gICAgICAgICAgICBjb25zdCB3ZWlnaHRzRmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgICAgICB3ZWlnaHRzRmlsZVJlYWRlci5vbmxvYWQgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICAgICAgICAgICAgY29uc3Qgd2VpZ2h0RGF0YSA9IChldmVudC50YXJnZXQgYXMgYW55KS5yZXN1bHQgYXMgQXJyYXlCdWZmZXI7XG4gICAgICAgICAgICAgIGV4cGVjdChuZXcgVWludDhBcnJheSh3ZWlnaHREYXRhKSlcbiAgICAgICAgICAgICAgICAgIC50b0VxdWFsKG5ldyBVaW50OEFycmF5KHdlaWdodERhdGExKSk7XG4gICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB3ZWlnaHRzRmlsZVJlYWRlci5vbmVycm9yID0gZXZlbnQgPT4ge1xuICAgICAgICAgICAgICBkb25lLmZhaWwod2VpZ2h0c0ZpbGVSZWFkZXIuZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgd2VpZ2h0c0ZpbGVSZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIod2VpZ2h0c0ZpbGUpO1xuICAgICAgICAgIH07XG4gICAgICAgICAganNvbkZpbGVSZWFkZXIub25lcnJvciA9IGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGRvbmUuZmFpbChqc29uRmlsZVJlYWRlci5lcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIGpzb25GaWxlUmVhZGVyLnJlYWRBc1RleHQoanNvbkZpbGUpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICBkb25lLmZhaWwoZXJyLnN0YWNrKTtcbiAgICAgICAgfSk7XG4gIH0pO1xuXG4gIGl0KCc0MDQgcmVzcG9uc2UgY2F1c2VzIEVycm9yJywgKGRvbmUpID0+IHtcbiAgICBjb25zdCBoYW5kbGVyID0gdGYuaW8uZ2V0U2F2ZUhhbmRsZXJzKCdodHRwOi8vaW52YWxpZC9wYXRoJylbMF07XG4gICAgaGFuZGxlci5zYXZlKGFydGlmYWN0czEpXG4gICAgICAgIC50aGVuKHNhdmVSZXN1bHQgPT4ge1xuICAgICAgICAgIGRvbmUuZmFpbChcbiAgICAgICAgICAgICAgJ0NhbGxpbmcgaHR0cCBhdCBpbnZhbGlkIFVSTCBzdWNjZWVkZWQgJyArXG4gICAgICAgICAgICAgICd1bmV4cGVjdGVkbHknKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgZXhwZWN0KCkubm90aGluZygpO1xuICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdnZXRMb2FkSGFuZGxlcnMgd2l0aCBvbmUgVVJMIHN0cmluZycsICgpID0+IHtcbiAgICBjb25zdCBoYW5kbGVycyA9IHRmLmlvLmdldExvYWRIYW5kbGVycygnaHR0cDovL2Zvby9tb2RlbC5qc29uJyk7XG4gICAgZXhwZWN0KGhhbmRsZXJzLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoaGFuZGxlcnNbMF0gaW5zdGFuY2VvZiBIVFRQUmVxdWVzdCkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgaXQoJ0V4aXN0aW5nIGJvZHkgbGVhZHMgdG8gRXJyb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLmlvLmh0dHAoJ21vZGVsLXVwbG9hZC10ZXN0Jywge1xuICAgICAgcmVxdWVzdEluaXQ6IHtib2R5OiAnZXhpc3RpbmcgYm9keSd9XG4gICAgfSkpLnRvVGhyb3dFcnJvcigvcmVxdWVzdEluaXQgaXMgZXhwZWN0ZWQgdG8gaGF2ZSBubyBwcmUtZXhpc3RpbmcgYm9keS8pO1xuICB9KTtcblxuICBpdCgnRW1wdHksIG51bGwgb3IgdW5kZWZpbmVkIFVSTCBwYXRocyBsZWFkIHRvIEVycm9yJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB0Zi5pby5odHRwKG51bGwpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9tdXN0IG5vdCBiZSBudWxsLCB1bmRlZmluZWQgb3IgZW1wdHkvKTtcbiAgICBleHBlY3QoKCkgPT4gdGYuaW8uaHR0cCh1bmRlZmluZWQpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9tdXN0IG5vdCBiZSBudWxsLCB1bmRlZmluZWQgb3IgZW1wdHkvKTtcbiAgICBleHBlY3QoKCkgPT4gdGYuaW8uaHR0cCgnJykpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL211c3Qgbm90IGJlIG51bGwsIHVuZGVmaW5lZCBvciBlbXB0eS8pO1xuICB9KTtcblxuICBpdCgncm91dGVyJywgKCkgPT4ge1xuICAgIGV4cGVjdChodHRwUm91dGVyKCdodHRwOi8vYmFyL2ZvbycpIGluc3RhbmNlb2YgSFRUUFJlcXVlc3QpLnRvRXF1YWwodHJ1ZSk7XG4gICAgZXhwZWN0KGh0dHBSb3V0ZXIoJ2h0dHBzOi8vbG9jYWxob3N0OjUwMDAvdXBsb2FkJykgaW5zdGFuY2VvZiBIVFRQUmVxdWVzdClcbiAgICAgICAgLnRvRXF1YWwodHJ1ZSk7XG4gICAgZXhwZWN0KGh0dHBSb3V0ZXIoJ2xvY2FsaG9zdDovL2ZvbycpKS50b0JlTnVsbCgpO1xuICAgIGV4cGVjdChodHRwUm91dGVyKCdmb286NTAwMC9iYXInKSkudG9CZU51bGwoKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ3BhcnNlVXJsJywgQlJPV1NFUl9FTlZTLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgcGFyc2UgdXJsIHdpdGggbm8gc3VmZml4JywgKCkgPT4ge1xuICAgIGNvbnN0IHVybCA9ICdodHRwOi8vZ29vZ2xlLmNvbS9maWxlJztcbiAgICBjb25zdCBbcHJlZml4LCBzdWZmaXhdID0gcGFyc2VVcmwodXJsKTtcbiAgICBleHBlY3QocHJlZml4KS50b0VxdWFsKCdodHRwOi8vZ29vZ2xlLmNvbS8nKTtcbiAgICBleHBlY3Qoc3VmZml4KS50b0VxdWFsKCcnKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgcGFyc2UgdXJsIHdpdGggc3VmZml4JywgKCkgPT4ge1xuICAgIGNvbnN0IHVybCA9ICdodHRwOi8vZ29vZ2xlLmNvbS9maWxlP3BhcmFtPTEnO1xuICAgIGNvbnN0IFtwcmVmaXgsIHN1ZmZpeF0gPSBwYXJzZVVybCh1cmwpO1xuICAgIGV4cGVjdChwcmVmaXgpLnRvRXF1YWwoJ2h0dHA6Ly9nb29nbGUuY29tLycpO1xuICAgIGV4cGVjdChzdWZmaXgpLnRvRXF1YWwoJz9wYXJhbT0xJyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHBhcnNlIHVybCB3aXRoIG11bHRpcGxlIHNlcmFjaCBwYXJhbXMnLCAoKSA9PiB7XG4gICAgY29uc3QgdXJsID0gJ2h0dHA6Ly9nb29nbGUuY29tL2E/eD0xL2ZpbGU/cGFyYW09MSc7XG4gICAgY29uc3QgW3ByZWZpeCwgc3VmZml4XSA9IHBhcnNlVXJsKHVybCk7XG4gICAgZXhwZWN0KHByZWZpeCkudG9FcXVhbCgnaHR0cDovL2dvb2dsZS5jb20vYT94PTEvJyk7XG4gICAgZXhwZWN0KHN1ZmZpeCkudG9FcXVhbCgnP3BhcmFtPTEnKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ2h0dHAtbG9hZCcsIEJST1dTRVJfRU5WUywgKCkgPT4ge1xuICBkZXNjcmliZSgnSlNPTiBtb2RlbCcsICgpID0+IHtcbiAgICBsZXQgcmVxdWVzdEluaXRzOiB7W2tleTogc3RyaW5nXToge2hlYWRlcnM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9fX07XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHJlcXVlc3RJbml0cyA9IHt9O1xuICAgIH0pO1xuXG4gICAgaXQoJzEgZ3JvdXAsIDIgd2VpZ2h0cywgMSBwYXRoJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgd2VpZ2h0TWFuaWZlc3QxOiB0Zi5pby5XZWlnaHRzTWFuaWZlc3RDb25maWcgPSBbe1xuICAgICAgICBwYXRoczogWyd3ZWlnaHRmaWxlMCddLFxuICAgICAgICB3ZWlnaHRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2RlbnNlL2tlcm5lbCcsXG4gICAgICAgICAgICBzaGFwZTogWzMsIDFdLFxuICAgICAgICAgICAgZHR5cGU6ICdmbG9hdDMyJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdkZW5zZS9iaWFzJyxcbiAgICAgICAgICAgIHNoYXBlOiBbMl0sXG4gICAgICAgICAgICBkdHlwZTogJ2Zsb2F0MzInLFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfV07XG4gICAgICBjb25zdCBmbG9hdERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KFsxLCAzLCAzLCA3LCA0XSk7XG4gICAgICBzZXR1cEZha2VXZWlnaHRGaWxlcyhcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnLi9tb2RlbC5qc29uJzoge1xuICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgbW9kZWxUb3BvbG9neTogbW9kZWxUb3BvbG9neTEsXG4gICAgICAgICAgICAgICAgd2VpZ2h0c01hbmlmZXN0OiB3ZWlnaHRNYW5pZmVzdDEsXG4gICAgICAgICAgICAgICAgZm9ybWF0OiAndGZqcy1ncmFwaC1tb2RlbCcsXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVkQnk6ICcxLjE1JyxcbiAgICAgICAgICAgICAgICBjb252ZXJ0ZWRCeTogJzEuMy4xJyxcbiAgICAgICAgICAgICAgICBzaWduYXR1cmU6IG51bGwsXG4gICAgICAgICAgICAgICAgdXNlckRlZmluZWRNZXRhZGF0YToge30sXG4gICAgICAgICAgICAgICAgbW9kZWxJbml0aWFsaXplcjoge31cbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnLi93ZWlnaHRmaWxlMCc6XG4gICAgICAgICAgICAgICAge2RhdGE6IGZsb2F0RGF0YSwgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlcXVlc3RJbml0cyk7XG5cbiAgICAgIGNvbnN0IGhhbmRsZXIgPSB0Zi5pby5odHRwKCcuL21vZGVsLmpzb24nKTtcbiAgICAgIGNvbnN0IG1vZGVsQXJ0aWZhY3RzID0gYXdhaXQgaGFuZGxlci5sb2FkKCk7XG4gICAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMubW9kZWxUb3BvbG9neSkudG9FcXVhbChtb2RlbFRvcG9sb2d5MSk7XG4gICAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMud2VpZ2h0U3BlY3MpLnRvRXF1YWwod2VpZ2h0TWFuaWZlc3QxWzBdLndlaWdodHMpO1xuICAgICAgZXhwZWN0KG1vZGVsQXJ0aWZhY3RzLmZvcm1hdCkudG9FcXVhbCgndGZqcy1ncmFwaC1tb2RlbCcpO1xuICAgICAgZXhwZWN0KG1vZGVsQXJ0aWZhY3RzLmdlbmVyYXRlZEJ5KS50b0VxdWFsKCcxLjE1Jyk7XG4gICAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMuY29udmVydGVkQnkpLnRvRXF1YWwoJzEuMy4xJyk7XG4gICAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMudXNlckRlZmluZWRNZXRhZGF0YSkudG9FcXVhbCh7fSk7XG4gICAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMubW9kZWxJbml0aWFsaXplcikudG9FcXVhbCh7fSk7XG5cbiAgICAgIGV4cGVjdChuZXcgRmxvYXQzMkFycmF5KG1vZGVsQXJ0aWZhY3RzLndlaWdodERhdGEpKS50b0VxdWFsKGZsb2F0RGF0YSk7XG4gICAgICBleHBlY3QoT2JqZWN0LmtleXMocmVxdWVzdEluaXRzKS5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICAvLyBBc3NlcnQgdGhhdCBmZXRjaCBpcyBpbnZva2VkIHdpdGggYHdpbmRvd2AgYXMgdGhlIGNvbnRleHQuXG4gICAgICBleHBlY3QoZmV0Y2hTcHkuY2FsbHMubW9zdFJlY2VudCgpLm9iamVjdCkudG9FcXVhbCh3aW5kb3cpO1xuICAgIH0pO1xuXG4gICAgaXQoJzEgZ3JvdXAsIDIgd2VpZ2h0cywgMSBwYXRoLCB3aXRoIHJlcXVlc3RJbml0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgd2VpZ2h0TWFuaWZlc3QxOiB0Zi5pby5XZWlnaHRzTWFuaWZlc3RDb25maWcgPSBbe1xuICAgICAgICBwYXRoczogWyd3ZWlnaHRmaWxlMCddLFxuICAgICAgICB3ZWlnaHRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2RlbnNlL2tlcm5lbCcsXG4gICAgICAgICAgICBzaGFwZTogWzMsIDFdLFxuICAgICAgICAgICAgZHR5cGU6ICdmbG9hdDMyJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdkZW5zZS9iaWFzJyxcbiAgICAgICAgICAgIHNoYXBlOiBbMl0sXG4gICAgICAgICAgICBkdHlwZTogJ2Zsb2F0MzInLFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfV07XG4gICAgICBjb25zdCBmbG9hdERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KFsxLCAzLCAzLCA3LCA0XSk7XG4gICAgICBzZXR1cEZha2VXZWlnaHRGaWxlcyhcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnLi9tb2RlbC5qc29uJzoge1xuICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgbW9kZWxUb3BvbG9neTogbW9kZWxUb3BvbG9neTEsXG4gICAgICAgICAgICAgICAgd2VpZ2h0c01hbmlmZXN0OiB3ZWlnaHRNYW5pZmVzdDFcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnLi93ZWlnaHRmaWxlMCc6XG4gICAgICAgICAgICAgICAge2RhdGE6IGZsb2F0RGF0YSwgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlcXVlc3RJbml0cyk7XG5cbiAgICAgIGNvbnN0IGhhbmRsZXIgPSB0Zi5pby5odHRwKFxuICAgICAgICAgICcuL21vZGVsLmpzb24nLFxuICAgICAgICAgIHtyZXF1ZXN0SW5pdDoge2hlYWRlcnM6IHsnaGVhZGVyX2tleV8xJzogJ2hlYWRlcl92YWx1ZV8xJ319fSk7XG4gICAgICBjb25zdCBtb2RlbEFydGlmYWN0cyA9IGF3YWl0IGhhbmRsZXIubG9hZCgpO1xuICAgICAgZXhwZWN0KG1vZGVsQXJ0aWZhY3RzLm1vZGVsVG9wb2xvZ3kpLnRvRXF1YWwobW9kZWxUb3BvbG9neTEpO1xuICAgICAgZXhwZWN0KG1vZGVsQXJ0aWZhY3RzLndlaWdodFNwZWNzKS50b0VxdWFsKHdlaWdodE1hbmlmZXN0MVswXS53ZWlnaHRzKTtcbiAgICAgIGV4cGVjdChuZXcgRmxvYXQzMkFycmF5KG1vZGVsQXJ0aWZhY3RzLndlaWdodERhdGEpKS50b0VxdWFsKGZsb2F0RGF0YSk7XG4gICAgICBleHBlY3QoT2JqZWN0LmtleXMocmVxdWVzdEluaXRzKS5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICBleHBlY3QoT2JqZWN0LmtleXMocmVxdWVzdEluaXRzKS5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICBleHBlY3QocmVxdWVzdEluaXRzWycuL21vZGVsLmpzb24nXS5oZWFkZXJzWydoZWFkZXJfa2V5XzEnXSlcbiAgICAgICAgICAudG9FcXVhbCgnaGVhZGVyX3ZhbHVlXzEnKTtcbiAgICAgIGV4cGVjdChyZXF1ZXN0SW5pdHNbJy4vd2VpZ2h0ZmlsZTAnXS5oZWFkZXJzWydoZWFkZXJfa2V5XzEnXSlcbiAgICAgICAgICAudG9FcXVhbCgnaGVhZGVyX3ZhbHVlXzEnKTtcblxuICAgICAgZXhwZWN0KGZldGNoU3B5LmNhbGxzLm1vc3RSZWNlbnQoKS5vYmplY3QpLnRvRXF1YWwod2luZG93KTtcbiAgICB9KTtcblxuICAgIGl0KCcxIGdyb3VwLCAyIHdlaWdodCwgMiBwYXRocycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHdlaWdodE1hbmlmZXN0MTogdGYuaW8uV2VpZ2h0c01hbmlmZXN0Q29uZmlnID0gW3tcbiAgICAgICAgcGF0aHM6IFsnd2VpZ2h0ZmlsZTAnLCAnd2VpZ2h0ZmlsZTEnXSxcbiAgICAgICAgd2VpZ2h0czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdkZW5zZS9rZXJuZWwnLFxuICAgICAgICAgICAgc2hhcGU6IFszLCAxXSxcbiAgICAgICAgICAgIGR0eXBlOiAnZmxvYXQzMicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnZGVuc2UvYmlhcycsXG4gICAgICAgICAgICBzaGFwZTogWzJdLFxuICAgICAgICAgICAgZHR5cGU6ICdmbG9hdDMyJyxcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1dO1xuICAgICAgY29uc3QgZmxvYXREYXRhMSA9IG5ldyBGbG9hdDMyQXJyYXkoWzEsIDMsIDNdKTtcbiAgICAgIGNvbnN0IGZsb2F0RGF0YTIgPSBuZXcgRmxvYXQzMkFycmF5KFs3LCA0XSk7XG4gICAgICBzZXR1cEZha2VXZWlnaHRGaWxlcyhcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnLi9tb2RlbC5qc29uJzoge1xuICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgbW9kZWxUb3BvbG9neTogbW9kZWxUb3BvbG9neTEsXG4gICAgICAgICAgICAgICAgd2VpZ2h0c01hbmlmZXN0OiB3ZWlnaHRNYW5pZmVzdDFcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnLi93ZWlnaHRmaWxlMCc6XG4gICAgICAgICAgICAgICAge2RhdGE6IGZsb2F0RGF0YTEsIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ30sXG4gICAgICAgICAgICAnLi93ZWlnaHRmaWxlMSc6XG4gICAgICAgICAgICAgICAge2RhdGE6IGZsb2F0RGF0YTIsIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ31cbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlcXVlc3RJbml0cyk7XG5cbiAgICAgIGNvbnN0IGhhbmRsZXIgPSB0Zi5pby5odHRwKCcuL21vZGVsLmpzb24nKTtcbiAgICAgIGNvbnN0IG1vZGVsQXJ0aWZhY3RzID0gYXdhaXQgaGFuZGxlci5sb2FkKCk7XG4gICAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMubW9kZWxUb3BvbG9neSkudG9FcXVhbChtb2RlbFRvcG9sb2d5MSk7XG4gICAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMud2VpZ2h0U3BlY3MpLnRvRXF1YWwod2VpZ2h0TWFuaWZlc3QxWzBdLndlaWdodHMpO1xuICAgICAgZXhwZWN0KG5ldyBGbG9hdDMyQXJyYXkobW9kZWxBcnRpZmFjdHMud2VpZ2h0RGF0YSkpXG4gICAgICAgICAgLnRvRXF1YWwobmV3IEZsb2F0MzJBcnJheShbMSwgMywgMywgNywgNF0pKTtcbiAgICB9KTtcblxuICAgIGl0KCcyIGdyb3VwcywgMiB3ZWlnaHQsIDIgcGF0aHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB3ZWlnaHRzTWFuaWZlc3Q6IHRmLmlvLldlaWdodHNNYW5pZmVzdENvbmZpZyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHBhdGhzOiBbJ3dlaWdodGZpbGUwJ10sXG4gICAgICAgICAgd2VpZ2h0czogW3tcbiAgICAgICAgICAgIG5hbWU6ICdkZW5zZS9rZXJuZWwnLFxuICAgICAgICAgICAgc2hhcGU6IFszLCAxXSxcbiAgICAgICAgICAgIGR0eXBlOiAnZmxvYXQzMicsXG4gICAgICAgICAgfV1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHBhdGhzOiBbJ3dlaWdodGZpbGUxJ10sXG4gICAgICAgICAgd2VpZ2h0czogW3tcbiAgICAgICAgICAgIG5hbWU6ICdkZW5zZS9iaWFzJyxcbiAgICAgICAgICAgIHNoYXBlOiBbMl0sXG4gICAgICAgICAgICBkdHlwZTogJ2Zsb2F0MzInLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9XG4gICAgICBdO1xuICAgICAgY29uc3QgZmxvYXREYXRhMSA9IG5ldyBGbG9hdDMyQXJyYXkoWzEsIDMsIDNdKTtcbiAgICAgIGNvbnN0IGZsb2F0RGF0YTIgPSBuZXcgRmxvYXQzMkFycmF5KFs3LCA0XSk7XG4gICAgICBzZXR1cEZha2VXZWlnaHRGaWxlcyhcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnLi9tb2RlbC5qc29uJzoge1xuICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgICAgICAgIHttb2RlbFRvcG9sb2d5OiBtb2RlbFRvcG9sb2d5MSwgd2VpZ2h0c01hbmlmZXN0fSksXG4gICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnLi93ZWlnaHRmaWxlMCc6XG4gICAgICAgICAgICAgICAge2RhdGE6IGZsb2F0RGF0YTEsIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ30sXG4gICAgICAgICAgICAnLi93ZWlnaHRmaWxlMSc6XG4gICAgICAgICAgICAgICAge2RhdGE6IGZsb2F0RGF0YTIsIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ31cbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlcXVlc3RJbml0cyk7XG5cbiAgICAgIGNvbnN0IGhhbmRsZXIgPSB0Zi5pby5odHRwKCcuL21vZGVsLmpzb24nKTtcbiAgICAgIGNvbnN0IG1vZGVsQXJ0aWZhY3RzID0gYXdhaXQgaGFuZGxlci5sb2FkKCk7XG4gICAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMubW9kZWxUb3BvbG9neSkudG9FcXVhbChtb2RlbFRvcG9sb2d5MSk7XG4gICAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMud2VpZ2h0U3BlY3MpXG4gICAgICAgICAgLnRvRXF1YWwoXG4gICAgICAgICAgICAgIHdlaWdodHNNYW5pZmVzdFswXS53ZWlnaHRzLmNvbmNhdCh3ZWlnaHRzTWFuaWZlc3RbMV0ud2VpZ2h0cykpO1xuICAgICAgZXhwZWN0KG5ldyBGbG9hdDMyQXJyYXkobW9kZWxBcnRpZmFjdHMud2VpZ2h0RGF0YSkpXG4gICAgICAgICAgLnRvRXF1YWwobmV3IEZsb2F0MzJBcnJheShbMSwgMywgMywgNywgNF0pKTtcbiAgICB9KTtcblxuICAgIGl0KCcyIGdyb3VwcywgMiB3ZWlnaHQsIDIgcGF0aHMsIEludDMyIGFuZCBVaW50OCBEYXRhJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgd2VpZ2h0c01hbmlmZXN0OiB0Zi5pby5XZWlnaHRzTWFuaWZlc3RDb25maWcgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBwYXRoczogWyd3ZWlnaHRmaWxlMCddLFxuICAgICAgICAgIHdlaWdodHM6IFt7XG4gICAgICAgICAgICBuYW1lOiAnZm9vV2VpZ2h0JyxcbiAgICAgICAgICAgIHNoYXBlOiBbMywgMV0sXG4gICAgICAgICAgICBkdHlwZTogJ2ludDMyJyxcbiAgICAgICAgICB9XVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcGF0aHM6IFsnd2VpZ2h0ZmlsZTEnXSxcbiAgICAgICAgICB3ZWlnaHRzOiBbe1xuICAgICAgICAgICAgbmFtZTogJ2JhcldlaWdodCcsXG4gICAgICAgICAgICBzaGFwZTogWzJdLFxuICAgICAgICAgICAgZHR5cGU6ICdib29sJyxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfVxuICAgICAgXTtcbiAgICAgIGNvbnN0IGZsb2F0RGF0YTEgPSBuZXcgSW50MzJBcnJheShbMSwgMywgM10pO1xuICAgICAgY29uc3QgZmxvYXREYXRhMiA9IG5ldyBVaW50OEFycmF5KFs3LCA0XSk7XG4gICAgICBzZXR1cEZha2VXZWlnaHRGaWxlcyhcbiAgICAgICAgICB7XG4gICAgICAgICAgICAncGF0aDEvbW9kZWwuanNvbic6IHtcbiAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoXG4gICAgICAgICAgICAgICAgICB7bW9kZWxUb3BvbG9neTogbW9kZWxUb3BvbG9neTEsIHdlaWdodHNNYW5pZmVzdH0pLFxuICAgICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3BhdGgxL3dlaWdodGZpbGUwJzpcbiAgICAgICAgICAgICAgICB7ZGF0YTogZmxvYXREYXRhMSwgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nfSxcbiAgICAgICAgICAgICdwYXRoMS93ZWlnaHRmaWxlMSc6XG4gICAgICAgICAgICAgICAge2RhdGE6IGZsb2F0RGF0YTIsIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ31cbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlcXVlc3RJbml0cyk7XG5cbiAgICAgIGNvbnN0IGhhbmRsZXIgPSB0Zi5pby5odHRwKCdwYXRoMS9tb2RlbC5qc29uJyk7XG4gICAgICBjb25zdCBtb2RlbEFydGlmYWN0cyA9IGF3YWl0IGhhbmRsZXIubG9hZCgpO1xuICAgICAgZXhwZWN0KG1vZGVsQXJ0aWZhY3RzLm1vZGVsVG9wb2xvZ3kpLnRvRXF1YWwobW9kZWxUb3BvbG9neTEpO1xuICAgICAgZXhwZWN0KG1vZGVsQXJ0aWZhY3RzLndlaWdodFNwZWNzKVxuICAgICAgICAgIC50b0VxdWFsKFxuICAgICAgICAgICAgICB3ZWlnaHRzTWFuaWZlc3RbMF0ud2VpZ2h0cy5jb25jYXQod2VpZ2h0c01hbmlmZXN0WzFdLndlaWdodHMpKTtcbiAgICAgIGV4cGVjdChuZXcgSW50MzJBcnJheShtb2RlbEFydGlmYWN0cy53ZWlnaHREYXRhLnNsaWNlKDAsIDEyKSkpXG4gICAgICAgICAgLnRvRXF1YWwobmV3IEludDMyQXJyYXkoWzEsIDMsIDNdKSk7XG4gICAgICBleHBlY3QobmV3IFVpbnQ4QXJyYXkobW9kZWxBcnRpZmFjdHMud2VpZ2h0RGF0YS5zbGljZSgxMiwgMTQpKSlcbiAgICAgICAgICAudG9FcXVhbChuZXcgVWludDhBcnJheShbNywgNF0pKTtcbiAgICB9KTtcblxuICAgIGl0KCd0b3BvbG9neSBvbmx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgc2V0dXBGYWtlV2VpZ2h0RmlsZXMoXG4gICAgICAgICAge1xuICAgICAgICAgICAgJy4vbW9kZWwuanNvbic6IHtcbiAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoe21vZGVsVG9wb2xvZ3k6IG1vZGVsVG9wb2xvZ3kxfSksXG4gICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICByZXF1ZXN0SW5pdHMpO1xuXG4gICAgICBjb25zdCBoYW5kbGVyID0gdGYuaW8uaHR0cCgnLi9tb2RlbC5qc29uJyk7XG4gICAgICBjb25zdCBtb2RlbEFydGlmYWN0cyA9IGF3YWl0IGhhbmRsZXIubG9hZCgpO1xuICAgICAgZXhwZWN0KG1vZGVsQXJ0aWZhY3RzLm1vZGVsVG9wb2xvZ3kpLnRvRXF1YWwobW9kZWxUb3BvbG9neTEpO1xuICAgICAgZXhwZWN0KG1vZGVsQXJ0aWZhY3RzLndlaWdodFNwZWNzKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMud2VpZ2h0RGF0YSkudG9CZVVuZGVmaW5lZCgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3dlaWdodHMgb25seScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHdlaWdodHNNYW5pZmVzdDogdGYuaW8uV2VpZ2h0c01hbmlmZXN0Q29uZmlnID0gW1xuICAgICAgICB7XG4gICAgICAgICAgcGF0aHM6IFsnd2VpZ2h0ZmlsZTAnXSxcbiAgICAgICAgICB3ZWlnaHRzOiBbe1xuICAgICAgICAgICAgbmFtZTogJ2Zvb1dlaWdodCcsXG4gICAgICAgICAgICBzaGFwZTogWzMsIDFdLFxuICAgICAgICAgICAgZHR5cGU6ICdpbnQzMicsXG4gICAgICAgICAgfV1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHBhdGhzOiBbJ3dlaWdodGZpbGUxJ10sXG4gICAgICAgICAgd2VpZ2h0czogW3tcbiAgICAgICAgICAgIG5hbWU6ICdiYXJXZWlnaHQnLFxuICAgICAgICAgICAgc2hhcGU6IFsyXSxcbiAgICAgICAgICAgIGR0eXBlOiAnZmxvYXQzMicsXG4gICAgICAgICAgfV0sXG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgICBjb25zdCBmbG9hdERhdGExID0gbmV3IEludDMyQXJyYXkoWzEsIDMsIDNdKTtcbiAgICAgIGNvbnN0IGZsb2F0RGF0YTIgPSBuZXcgRmxvYXQzMkFycmF5KFstNywgLTRdKTtcbiAgICAgIHNldHVwRmFrZVdlaWdodEZpbGVzKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdwYXRoMS9tb2RlbC5qc29uJzoge1xuICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7d2VpZ2h0c01hbmlmZXN0fSksXG4gICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAncGF0aDEvd2VpZ2h0ZmlsZTAnOlxuICAgICAgICAgICAgICAgIHtkYXRhOiBmbG9hdERhdGExLCBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSd9LFxuICAgICAgICAgICAgJ3BhdGgxL3dlaWdodGZpbGUxJzpcbiAgICAgICAgICAgICAgICB7ZGF0YTogZmxvYXREYXRhMiwgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVxdWVzdEluaXRzKTtcblxuICAgICAgY29uc3QgaGFuZGxlciA9IHRmLmlvLmh0dHAoJ3BhdGgxL21vZGVsLmpzb24nKTtcbiAgICAgIGNvbnN0IG1vZGVsQXJ0aWZhY3RzID0gYXdhaXQgaGFuZGxlci5sb2FkKCk7XG4gICAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMubW9kZWxUb3BvbG9neSkudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgZXhwZWN0KG1vZGVsQXJ0aWZhY3RzLndlaWdodFNwZWNzKVxuICAgICAgICAgIC50b0VxdWFsKFxuICAgICAgICAgICAgICB3ZWlnaHRzTWFuaWZlc3RbMF0ud2VpZ2h0cy5jb25jYXQod2VpZ2h0c01hbmlmZXN0WzFdLndlaWdodHMpKTtcbiAgICAgIGV4cGVjdChuZXcgSW50MzJBcnJheShtb2RlbEFydGlmYWN0cy53ZWlnaHREYXRhLnNsaWNlKDAsIDEyKSkpXG4gICAgICAgICAgLnRvRXF1YWwobmV3IEludDMyQXJyYXkoWzEsIDMsIDNdKSk7XG4gICAgICBleHBlY3QobmV3IEZsb2F0MzJBcnJheShtb2RlbEFydGlmYWN0cy53ZWlnaHREYXRhLnNsaWNlKDEyLCAyMCkpKVxuICAgICAgICAgIC50b0VxdWFsKG5ldyBGbG9hdDMyQXJyYXkoWy03LCAtNF0pKTtcbiAgICB9KTtcblxuICAgIGl0KCdNaXNzaW5nIG1vZGVsVG9wb2xvZ3kgYW5kIHdlaWdodHNNYW5pZmVzdCBsZWFkcyB0byBlcnJvcicsIGFzeW5jICgpID0+IHtcbiAgICAgIHNldHVwRmFrZVdlaWdodEZpbGVzKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdwYXRoMS9tb2RlbC5qc29uJzpcbiAgICAgICAgICAgICAgICB7ZGF0YTogSlNPTi5zdHJpbmdpZnkoe30pLCBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVxdWVzdEluaXRzKTtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSB0Zi5pby5odHRwKCdwYXRoMS9tb2RlbC5qc29uJyk7XG4gICAgICBoYW5kbGVyLmxvYWQoKVxuICAgICAgICAgIC50aGVuKG1vZGVsVG9wb2xvZ3kxID0+IHtcbiAgICAgICAgICAgIGZhaWwoXG4gICAgICAgICAgICAgICAgJ0xvYWRpbmcgZnJvbSBtaXNzaW5nIG1vZGVsVG9wb2xvZ3kgYW5kIHdlaWdodHNNYW5pZmVzdCAnICtcbiAgICAgICAgICAgICAgICAnc3VjY2VlZGVkIHVuZXhwZWN0ZWRseS4nKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KGVyci5tZXNzYWdlKVxuICAgICAgICAgICAgICAgIC50b01hdGNoKC9jb250YWlucyBuZWl0aGVyIG1vZGVsIHRvcG9sb2d5IG9yIG1hbmlmZXN0Lyk7XG4gICAgICAgICAgfSk7XG4gICAgICBleHBlY3QoKS5ub3RoaW5nKCk7XG4gICAgfSk7XG5cbiAgICBpdCgnd2l0aCBmZXRjaCByZWplY3Rpb24gbGVhZHMgdG8gZXJyb3InLCBhc3luYyAoKSA9PiB7XG4gICAgICBzZXR1cEZha2VXZWlnaHRGaWxlcyhcbiAgICAgICAgICB7XG4gICAgICAgICAgICAncGF0aDEvbW9kZWwuanNvbic6XG4gICAgICAgICAgICAgICAge2RhdGE6IEpTT04uc3RyaW5naWZ5KHt9KSwgY29udGVudFR5cGU6ICd0ZXh0L2h0bWwnfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVxdWVzdEluaXRzKTtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSB0Zi5pby5odHRwKCdwYXRoMi9tb2RlbC5qc29uJyk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgaGFuZGxlci5sb2FkKCk7XG4gICAgICAgIGV4cGVjdChkYXRhKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICBmYWlsKCdMb2FkaW5nIHdpdGggZmV0Y2ggcmVqZWN0aW9uIHN1Y2NlZWRlZCB1bmV4cGVjdGVkbHkuJyk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgLy8gVGhpcyBlcnJvciBpcyBtb2NrZWQgaW4gYmVmb3JlRWFjaFxuICAgICAgICBleHBlY3QoZXJyKS50b0VxdWFsKCdwYXRoIG5vdCBmb3VuZCcpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGl0KCdQcm92aWRlIFdlaWdodEZpbGVUcmFuc2xhdGVGdW5jJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgd2VpZ2h0TWFuaWZlc3QxOiB0Zi5pby5XZWlnaHRzTWFuaWZlc3RDb25maWcgPSBbe1xuICAgICAgICBwYXRoczogWyd3ZWlnaHRmaWxlMCddLFxuICAgICAgICB3ZWlnaHRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2RlbnNlL2tlcm5lbCcsXG4gICAgICAgICAgICBzaGFwZTogWzMsIDFdLFxuICAgICAgICAgICAgZHR5cGU6ICdmbG9hdDMyJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdkZW5zZS9iaWFzJyxcbiAgICAgICAgICAgIHNoYXBlOiBbMl0sXG4gICAgICAgICAgICBkdHlwZTogJ2Zsb2F0MzInLFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfV07XG4gICAgICBjb25zdCBmbG9hdERhdGEgPSBuZXcgRmxvYXQzMkFycmF5KFsxLCAzLCAzLCA3LCA0XSk7XG4gICAgICBzZXR1cEZha2VXZWlnaHRGaWxlcyhcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnLi9tb2RlbC5qc29uJzoge1xuICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgbW9kZWxUb3BvbG9neTogbW9kZWxUb3BvbG9neTEsXG4gICAgICAgICAgICAgICAgd2VpZ2h0c01hbmlmZXN0OiB3ZWlnaHRNYW5pZmVzdDFcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnYXV0aF93ZWlnaHRmaWxlMCc6XG4gICAgICAgICAgICAgICAge2RhdGE6IGZsb2F0RGF0YSwgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlcXVlc3RJbml0cyk7XG4gICAgICBhc3luYyBmdW5jdGlvbiBwcmVmaXhXZWlnaHRVcmxDb252ZXJ0ZXIod2VpZ2h0RmlsZTogc3RyaW5nKTpcbiAgICAgICAgICBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICAvLyBBZGQgJ2F1dGhfJyBwcmVmaXggdG8gdGhlIHdlaWdodCBmaWxlIHVybC5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKFxuICAgICAgICAgICAgcmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEsICdhdXRoXycgKyB3ZWlnaHRGaWxlKSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGhhbmRsZXIgPSB0Zi5pby5odHRwKCcuL21vZGVsLmpzb24nLCB7XG4gICAgICAgIHJlcXVlc3RJbml0OiB7aGVhZGVyczogeydoZWFkZXJfa2V5XzEnOiAnaGVhZGVyX3ZhbHVlXzEnfX0sXG4gICAgICAgIHdlaWdodFVybENvbnZlcnRlcjogcHJlZml4V2VpZ2h0VXJsQ29udmVydGVyXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IG1vZGVsQXJ0aWZhY3RzID0gYXdhaXQgaGFuZGxlci5sb2FkKCk7XG4gICAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMubW9kZWxUb3BvbG9neSkudG9FcXVhbChtb2RlbFRvcG9sb2d5MSk7XG4gICAgICBleHBlY3QobW9kZWxBcnRpZmFjdHMud2VpZ2h0U3BlY3MpLnRvRXF1YWwod2VpZ2h0TWFuaWZlc3QxWzBdLndlaWdodHMpO1xuICAgICAgZXhwZWN0KG5ldyBGbG9hdDMyQXJyYXkobW9kZWxBcnRpZmFjdHMud2VpZ2h0RGF0YSkpLnRvRXF1YWwoZmxvYXREYXRhKTtcbiAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhyZXF1ZXN0SW5pdHMpLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhyZXF1ZXN0SW5pdHMpLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICAgIGV4cGVjdChyZXF1ZXN0SW5pdHNbJy4vbW9kZWwuanNvbiddLmhlYWRlcnNbJ2hlYWRlcl9rZXlfMSddKVxuICAgICAgICAgIC50b0VxdWFsKCdoZWFkZXJfdmFsdWVfMScpO1xuICAgICAgZXhwZWN0KHJlcXVlc3RJbml0c1snYXV0aF93ZWlnaHRmaWxlMCddLmhlYWRlcnNbJ2hlYWRlcl9rZXlfMSddKVxuICAgICAgICAgIC50b0VxdWFsKCdoZWFkZXJfdmFsdWVfMScpO1xuXG4gICAgICBleHBlY3QoZmV0Y2hTcHkuY2FsbHMubW9zdFJlY2VudCgpLm9iamVjdCkudG9FcXVhbCh3aW5kb3cpO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnT3ZlcnJpZGluZyBCcm93c2VySFRUUFJlcXVlc3QgZmV0Y2hGdW5jJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHdlaWdodE1hbmlmZXN0MTogdGYuaW8uV2VpZ2h0c01hbmlmZXN0Q29uZmlnID0gW3tcbiAgICAgIHBhdGhzOiBbJ3dlaWdodGZpbGUwJ10sXG4gICAgICB3ZWlnaHRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnZGVuc2Uva2VybmVsJyxcbiAgICAgICAgICBzaGFwZTogWzMsIDFdLFxuICAgICAgICAgIGR0eXBlOiAnZmxvYXQzMicsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnZGVuc2UvYmlhcycsXG4gICAgICAgICAgc2hhcGU6IFsyXSxcbiAgICAgICAgICBkdHlwZTogJ2Zsb2F0MzInLFxuICAgICAgICB9XG4gICAgICBdXG4gICAgfV07XG4gICAgY29uc3QgZmxvYXREYXRhID0gbmV3IEZsb2F0MzJBcnJheShbMSwgMywgMywgNywgNF0pO1xuXG4gICAgY29uc3QgZmV0Y2hJbnB1dHM6IFJlcXVlc3RJbmZvW10gPSBbXTtcbiAgICBjb25zdCBmZXRjaEluaXRzOiBSZXF1ZXN0SW5pdFtdID0gW107XG4gICAgYXN5bmMgZnVuY3Rpb24gY3VzdG9tRmV0Y2goXG4gICAgICAgIGlucHV0OiBSZXF1ZXN0SW5mbywgaW5pdD86IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZT4ge1xuICAgICAgZmV0Y2hJbnB1dHMucHVzaChpbnB1dCk7XG4gICAgICBmZXRjaEluaXRzLnB1c2goaW5pdCk7XG5cbiAgICAgIGlmIChpbnB1dCA9PT0gJy4vbW9kZWwuanNvbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZShcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgbW9kZWxUb3BvbG9neTogbW9kZWxUb3BvbG9neTEsXG4gICAgICAgICAgICAgIHdlaWdodHNNYW5pZmVzdDogd2VpZ2h0TWFuaWZlc3QxLFxuICAgICAgICAgICAgICB0cmFpbmluZ0NvbmZpZzogdHJhaW5pbmdDb25maWcxXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHtzdGF0dXM6IDIwMCwgaGVhZGVyczogeydjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9fSk7XG4gICAgICB9IGVsc2UgaWYgKGlucHV0ID09PSAnLi93ZWlnaHRmaWxlMCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZShmbG9hdERhdGEsIHtcbiAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICBoZWFkZXJzOiB7J2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogNDA0fSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaGFuZGxlciA9IHRmLmlvLmh0dHAoXG4gICAgICAgICcuL21vZGVsLmpzb24nLFxuICAgICAgICB7cmVxdWVzdEluaXQ6IHtjcmVkZW50aWFsczogJ2luY2x1ZGUnfSwgZmV0Y2hGdW5jOiBjdXN0b21GZXRjaH0pO1xuICAgIGNvbnN0IG1vZGVsQXJ0aWZhY3RzID0gYXdhaXQgaGFuZGxlci5sb2FkKCk7XG4gICAgZXhwZWN0KG1vZGVsQXJ0aWZhY3RzLm1vZGVsVG9wb2xvZ3kpLnRvRXF1YWwobW9kZWxUb3BvbG9neTEpO1xuICAgIGV4cGVjdChtb2RlbEFydGlmYWN0cy50cmFpbmluZ0NvbmZpZykudG9FcXVhbCh0cmFpbmluZ0NvbmZpZzEpO1xuICAgIGV4cGVjdChtb2RlbEFydGlmYWN0cy53ZWlnaHRTcGVjcykudG9FcXVhbCh3ZWlnaHRNYW5pZmVzdDFbMF0ud2VpZ2h0cyk7XG4gICAgZXhwZWN0KG5ldyBGbG9hdDMyQXJyYXkobW9kZWxBcnRpZmFjdHMud2VpZ2h0RGF0YSkpLnRvRXF1YWwoZmxvYXREYXRhKTtcblxuICAgIGV4cGVjdChmZXRjaElucHV0cykudG9FcXVhbChbJy4vbW9kZWwuanNvbicsICcuL3dlaWdodGZpbGUwJ10pO1xuICAgIGV4cGVjdChmZXRjaEluaXRzLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoZmV0Y2hJbml0c1swXS5jcmVkZW50aWFscykudG9FcXVhbCgnaW5jbHVkZScpO1xuICAgIGV4cGVjdChmZXRjaEluaXRzWzFdLmNyZWRlbnRpYWxzKS50b0VxdWFsKCdpbmNsdWRlJyk7XG4gIH0pO1xufSk7XG4iXX0=