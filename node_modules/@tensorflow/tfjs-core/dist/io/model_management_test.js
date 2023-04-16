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
import { CHROME_ENVS, describeWithFlags, runWithLock } from '../jasmine_util';
import { deleteDatabase } from './indexed_db';
import { purgeLocalStorageArtifacts } from './local_storage';
// Disabled for non-Chrome browsers due to:
// https://github.com/tensorflow/tfjs/issues/427
describeWithFlags('ModelManagement', CHROME_ENVS, () => {
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
    };
    beforeEach(done => {
        purgeLocalStorageArtifacts();
        deleteDatabase().then(() => {
            done();
        });
    });
    afterEach(done => {
        purgeLocalStorageArtifacts();
        deleteDatabase().then(() => {
            done();
        });
    });
    // TODO(cais): Reenable this test once we fix
    // https://github.com/tensorflow/tfjs/issues/1198
    // tslint:disable-next-line:ban
    xit('List models: 0 result', done => {
        // Before any model is saved, listModels should return empty result.
        tf.io.listModels()
            .then(out => {
            expect(out).toEqual({});
            done();
        })
            .catch(err => done.fail(err.stack));
    });
    // TODO(cais): Reenable this test once we fix
    // https://github.com/tensorflow/tfjs/issues/1198
    // tslint:disable-next-line:ban
    xit('List models: 1 result', done => {
        const url = 'localstorage://baz/QuxModel';
        const handler = tf.io.getSaveHandlers(url)[0];
        handler.save(artifacts1)
            .then(saveResult => {
            // After successful saving, there should be one model.
            tf.io.listModels()
                .then(out => {
                expect(Object.keys(out).length).toEqual(1);
                expect(out[url].modelTopologyType)
                    .toEqual(saveResult.modelArtifactsInfo.modelTopologyType);
                expect(out[url].modelTopologyBytes)
                    .toEqual(saveResult.modelArtifactsInfo.modelTopologyBytes);
                expect(out[url].weightSpecsBytes)
                    .toEqual(saveResult.modelArtifactsInfo.weightSpecsBytes);
                expect(out[url].weightDataBytes)
                    .toEqual(saveResult.modelArtifactsInfo.weightDataBytes);
                done();
            })
                .catch(err => done.fail(err.stack));
        })
            .catch(err => done.fail(err.stack));
    });
    // TODO(cais): Reenable this test once we fix
    // https://github.com/tensorflow/tfjs/issues/1198
    // tslint:disable-next-line:ban
    xit('Manager: List models: 2 results in 2 mediums', done => {
        const url1 = 'localstorage://QuxModel';
        const url2 = 'indexeddb://QuxModel';
        // First, save a model in Local Storage.
        const handler1 = tf.io.getSaveHandlers(url1)[0];
        handler1.save(artifacts1)
            .then(saveResult1 => {
            // Then, save the model in IndexedDB.
            const handler2 = tf.io.getSaveHandlers(url2)[0];
            handler2.save(artifacts1)
                .then(saveResult2 => {
                // After successful saving, there should be two models.
                tf.io.listModels()
                    .then(out => {
                    expect(Object.keys(out).length).toEqual(2);
                    expect(out[url1].modelTopologyType)
                        .toEqual(saveResult1.modelArtifactsInfo.modelTopologyType);
                    expect(out[url1].modelTopologyBytes)
                        .toEqual(saveResult1.modelArtifactsInfo
                        .modelTopologyBytes);
                    expect(out[url1].weightSpecsBytes)
                        .toEqual(saveResult1.modelArtifactsInfo.weightSpecsBytes);
                    expect(out[url1].weightDataBytes)
                        .toEqual(saveResult1.modelArtifactsInfo.weightDataBytes);
                    expect(out[url2].modelTopologyType)
                        .toEqual(saveResult2.modelArtifactsInfo.modelTopologyType);
                    expect(out[url2].modelTopologyBytes)
                        .toEqual(saveResult2.modelArtifactsInfo
                        .modelTopologyBytes);
                    expect(out[url2].weightSpecsBytes)
                        .toEqual(saveResult2.modelArtifactsInfo.weightSpecsBytes);
                    expect(out[url2].weightDataBytes)
                        .toEqual(saveResult2.modelArtifactsInfo.weightDataBytes);
                    done();
                })
                    .catch(err => done.fail(err.stack));
            })
                .catch(err => done.fail(err.stack));
        })
            .catch(err => done.fail(err.stack));
    });
    // TODO(cais): Reenable this test once we fix
    // https://github.com/tensorflow/tfjs/issues/1198
    // tslint:disable-next-line:ban
    xit('Successful removeModel', done => {
        // First, save a model.
        const handler1 = tf.io.getSaveHandlers('localstorage://QuxModel')[0];
        handler1.save(artifacts1)
            .then(saveResult1 => {
            // Then, save the model under another path.
            const handler2 = tf.io.getSaveHandlers('indexeddb://repeat/QuxModel')[0];
            handler2.save(artifacts1)
                .then(saveResult2 => {
                // After successful saving, delete the first save, and then
                // `listModel` should give only one result.
                // Delete a model specified with a path that includes the
                // indexeddb:// scheme prefix should work.
                tf.io.removeModel('indexeddb://repeat/QuxModel')
                    .then(deletedInfo => {
                    tf.io.listModels()
                        .then(out => {
                        expect(Object.keys(out)).toEqual([
                            'localstorage://QuxModel'
                        ]);
                        tf.io.removeModel('localstorage://QuxModel')
                            .then(out => {
                            // The delete the remaining model.
                            tf.io.listModels()
                                .then(out => {
                                expect(Object.keys(out)).toEqual([]);
                                done();
                            })
                                .catch(err => done.fail(err));
                        })
                            .catch(err => done.fail(err));
                    })
                        .catch(err => done.fail(err));
                })
                    .catch(err => done.fail(err.stack));
            })
                .catch(err => done.fail(err.stack));
        })
            .catch(err => done.fail(err.stack));
    });
    // TODO(cais): Reenable this test once we fix
    // https://github.com/tensorflow/tfjs/issues/1198
    // tslint:disable-next-line:ban
    xit('Successful copyModel between mediums', done => {
        const url1 = 'localstorage://a1/FooModel';
        const url2 = 'indexeddb://a1/FooModel';
        // First, save a model.
        const handler1 = tf.io.getSaveHandlers(url1)[0];
        handler1.save(artifacts1)
            .then(saveResult => {
            // Once model is saved, copy the model to another path.
            tf.io.copyModel(url1, url2)
                .then(modelInfo => {
                tf.io.listModels().then(out => {
                    expect(Object.keys(out).length).toEqual(2);
                    expect(out[url1].modelTopologyType)
                        .toEqual(saveResult.modelArtifactsInfo.modelTopologyType);
                    expect(out[url1].modelTopologyBytes)
                        .toEqual(saveResult.modelArtifactsInfo.modelTopologyBytes);
                    expect(out[url1].weightSpecsBytes)
                        .toEqual(saveResult.modelArtifactsInfo.weightSpecsBytes);
                    expect(out[url1].weightDataBytes)
                        .toEqual(saveResult.modelArtifactsInfo.weightDataBytes);
                    expect(out[url2].modelTopologyType)
                        .toEqual(saveResult.modelArtifactsInfo.modelTopologyType);
                    expect(out[url2].modelTopologyBytes)
                        .toEqual(saveResult.modelArtifactsInfo.modelTopologyBytes);
                    expect(out[url2].weightSpecsBytes)
                        .toEqual(saveResult.modelArtifactsInfo.weightSpecsBytes);
                    expect(out[url2].weightDataBytes)
                        .toEqual(saveResult.modelArtifactsInfo.weightDataBytes);
                    // Load the copy and verify the content.
                    const handler2 = tf.io.getLoadHandlers(url2)[0];
                    handler2.load()
                        .then(loaded => {
                        expect(loaded.modelTopology).toEqual(modelTopology1);
                        expect(loaded.weightSpecs).toEqual(weightSpecs1);
                        expect(new Uint8Array(loaded.weightData))
                            .toEqual(new Uint8Array(weightData1));
                        done();
                    })
                        .catch(err => done.fail(err.stack));
                });
            })
                .catch(err => done.fail(err.stack));
        })
            .catch(err => done.fail(err.stack));
    });
    // TODO(cais): Reenable this test once we fix
    // https://github.com/tensorflow/tfjs/issues/1198
    // tslint:disable-next-line:ban
    xit('Successful moveModel between mediums', done => {
        const url1 = 'localstorage://a1/FooModel';
        const url2 = 'indexeddb://a1/FooModel';
        // First, save a model.
        const handler1 = tf.io.getSaveHandlers(url1)[0];
        handler1.save(artifacts1)
            .then(saveResult => {
            // Once model is saved, move the model to another path.
            tf.io.moveModel(url1, url2)
                .then(modelInfo => {
                tf.io.listModels().then(out => {
                    expect(Object.keys(out)).toEqual([url2]);
                    expect(out[url2].modelTopologyType)
                        .toEqual(saveResult.modelArtifactsInfo.modelTopologyType);
                    expect(out[url2].modelTopologyBytes)
                        .toEqual(saveResult.modelArtifactsInfo.modelTopologyBytes);
                    expect(out[url2].weightSpecsBytes)
                        .toEqual(saveResult.modelArtifactsInfo.weightSpecsBytes);
                    expect(out[url2].weightDataBytes)
                        .toEqual(saveResult.modelArtifactsInfo.weightDataBytes);
                    // Load the copy and verify the content.
                    const handler2 = tf.io.getLoadHandlers(url2)[0];
                    handler2.load()
                        .then(loaded => {
                        expect(loaded.modelTopology).toEqual(modelTopology1);
                        expect(loaded.weightSpecs).toEqual(weightSpecs1);
                        expect(new Uint8Array(loaded.weightData))
                            .toEqual(new Uint8Array(weightData1));
                        done();
                    })
                        .catch(err => {
                        done.fail(err.stack);
                    });
                });
            })
                .catch(err => done.fail(err.stack));
        })
            .catch(err => done.fail(err.stack));
    });
    it('Failed copyModel to invalid source URL', runWithLock(done => {
        const url1 = 'invalidurl';
        const url2 = 'localstorage://a1/FooModel';
        tf.io.copyModel(url1, url2)
            .then(out => {
            done.fail('Copying from invalid URL succeeded unexpectedly.');
        })
            .catch(err => {
            expect(err.message)
                .toEqual('Copying failed because no load handler is found for ' +
                'source URL invalidurl.');
            done();
        });
    }));
    it('Failed copyModel to invalid destination URL', runWithLock(done => {
        const url1 = 'localstorage://a1/FooModel';
        const url2 = 'invalidurl';
        // First, save a model.
        const handler1 = tf.io.getSaveHandlers(url1)[0];
        handler1.save(artifacts1)
            .then(saveResult => {
            // Once model is saved, copy the model to another path.
            tf.io.copyModel(url1, url2)
                .then(out => {
                done.fail('Copying to invalid URL succeeded unexpectedly.');
            })
                .catch(err => {
                expect(err.message)
                    .toEqual('Copying failed because no save handler is found ' +
                    'for destination URL invalidurl.');
                done();
            });
        })
            .catch(err => done.fail(err.stack));
    }));
    it('Failed moveModel to invalid destination URL', runWithLock(done => {
        const url1 = 'localstorage://a1/FooModel';
        const url2 = 'invalidurl';
        // First, save a model.
        const handler1 = tf.io.getSaveHandlers(url1)[0];
        handler1.save(artifacts1)
            .then(saveResult => {
            // Once model is saved, copy the model to an invalid path, which
            // should fail.
            tf.io.moveModel(url1, url2)
                .then(out => {
                done.fail('Copying to invalid URL succeeded unexpectedly.');
            })
                .catch(err => {
                expect(err.message)
                    .toEqual('Copying failed because no save handler is found ' +
                    'for destination URL invalidurl.');
                // Verify that the source has not been removed.
                tf.io.listModels()
                    .then(out => {
                    expect(Object.keys(out)).toEqual([url1]);
                    done();
                })
                    .catch(err => done.fail(err.stack));
            });
        })
            .catch(err => done.fail(err.stack));
    }));
    it('Failed deletedModel: Absent scheme', runWithLock(done => {
        // Attempt to delete a nonexistent model is expected to fail.
        tf.io.removeModel('foo')
            .then(out => {
            done.fail('Removing model with missing scheme succeeded unexpectedly.');
        })
            .catch(err => {
            expect(err.message)
                .toMatch(/The url string provided does not contain a scheme/);
            expect(err.message.indexOf('localstorage')).toBeGreaterThan(0);
            expect(err.message.indexOf('indexeddb')).toBeGreaterThan(0);
            done();
        });
    }));
    it('Failed deletedModel: Invalid scheme', runWithLock(done => {
        // Attempt to delete a nonexistent model is expected to fail.
        tf.io.removeModel('invalidscheme://foo')
            .then(out => {
            done.fail('Removing nonexistent model succeeded unexpectedly.');
        })
            .catch(err => {
            expect(err.message)
                .toEqual('Cannot find model manager for scheme \'invalidscheme\'');
            done();
        });
    }));
    it('Failed deletedModel: Nonexistent model', runWithLock(done => {
        // Attempt to delete a nonexistent model is expected to fail.
        tf.io.removeModel('indexeddb://nonexistent')
            .then(out => {
            done.fail('Removing nonexistent model succeeded unexpectedly.');
        })
            .catch(err => {
            expect(err.message)
                .toEqual('Cannot find model ' +
                'with path \'nonexistent\' in IndexedDB.');
            done();
        });
    }));
    it('Failed copyModel', runWithLock(done => {
        // Attempt to copy a nonexistent model should fail.
        tf.io.copyModel('indexeddb://nonexistent', 'indexeddb://destination')
            .then(out => {
            done.fail('Copying nonexistent model succeeded unexpectedly.');
        })
            .catch(err => {
            expect(err.message)
                .toEqual('Cannot find model ' +
                'with path \'nonexistent\' in IndexedDB.');
            done();
        });
    }));
    it('copyModel: Identical oldPath and newPath leads to Error', runWithLock(done => {
        tf.io.copyModel('a/1', 'a/1')
            .then(out => {
            done.fail('Copying with identical ' +
                'old & new paths succeeded unexpectedly.');
        })
            .catch(err => {
            expect(err.message)
                .toEqual('Old path and new path are the same: \'a/1\'');
            done();
        });
    }));
    it('moveModel: Identical oldPath and newPath leads to Error', runWithLock(done => {
        tf.io.moveModel('a/1', 'a/1')
            .then(out => {
            done.fail('Copying with identical ' +
                'old & new paths succeeded unexpectedly.');
        })
            .catch(err => {
            expect(err.message)
                .toEqual('Old path and new path are the same: \'a/1\'');
            done();
        });
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWxfbWFuYWdlbWVudF90ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9pby9tb2RlbF9tYW5hZ2VtZW50X3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxLQUFLLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDL0IsT0FBTyxFQUFDLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzVDLE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRTNELDJDQUEyQztBQUMzQyxnREFBZ0Q7QUFDaEQsaUJBQWlCLENBQUMsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRTtJQUNyRCxhQUFhO0lBQ2IsTUFBTSxjQUFjLEdBQU87UUFDekIsWUFBWSxFQUFFLFlBQVk7UUFDMUIsZUFBZSxFQUFFLE9BQU87UUFDeEIsUUFBUSxFQUFFLENBQUM7Z0JBQ1QsWUFBWSxFQUFFLE9BQU87Z0JBQ3JCLFFBQVEsRUFBRTtvQkFDUixvQkFBb0IsRUFBRTt3QkFDcEIsWUFBWSxFQUFFLGlCQUFpQjt3QkFDL0IsUUFBUSxFQUFFOzRCQUNSLGNBQWMsRUFBRSxTQUFTOzRCQUN6QixPQUFPLEVBQUUsR0FBRzs0QkFDWixNQUFNLEVBQUUsSUFBSTs0QkFDWixNQUFNLEVBQUUsU0FBUzt5QkFDbEI7cUJBQ0Y7b0JBQ0QsTUFBTSxFQUFFLE9BQU87b0JBQ2YsbUJBQW1CLEVBQUUsSUFBSTtvQkFDekIsa0JBQWtCLEVBQUUsSUFBSTtvQkFDeEIsaUJBQWlCLEVBQUUsSUFBSTtvQkFDdkIsT0FBTyxFQUFFLFNBQVM7b0JBQ2xCLFlBQVksRUFBRSxRQUFRO29CQUN0QixXQUFXLEVBQUUsSUFBSTtvQkFDakIs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QUMsQ0FBQztBQUNULENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQgKiBhcyB0ZiBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQge0NIUk9NRV9FTlZTLCBkZXNjcmliZVdpdGhGbGFncywgcnVuV2l0aExvY2t9IGZyb20gJy4uL2phc21pbmVfdXRpbCc7XG5pbXBvcnQge2RlbGV0ZURhdGFiYXNlfSBmcm9tICcuL2luZGV4ZWRfZGInO1xuaW1wb3J0IHtwdXJnZUxvY2FsU3RvcmFnZUFydGlmYWN0c30gZnJvbSAnLi9sb2NhbF9zdG9yYWdlJztcblxuLy8gRGlzYWJsZWQgZm9yIG5vbi1DaHJvbWUgYnJvd3NlcnMgZHVlIHRvOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3RlbnNvcmZsb3cvdGZqcy9pc3N1ZXMvNDI3XG5kZXNjcmliZVdpdGhGbGFncygnTW9kZWxNYW5hZ2VtZW50JywgQ0hST01FX0VOVlMsICgpID0+IHtcbiAgLy8gVGVzdCBkYXRhLlxuICBjb25zdCBtb2RlbFRvcG9sb2d5MToge30gPSB7XG4gICAgJ2NsYXNzX25hbWUnOiAnU2VxdWVudGlhbCcsXG4gICAgJ2tlcmFzX3ZlcnNpb24nOiAnMi4xLjQnLFxuICAgICdjb25maWcnOiBbe1xuICAgICAgJ2NsYXNzX25hbWUnOiAnRGVuc2UnLFxuICAgICAgJ2NvbmZpZyc6IHtcbiAgICAgICAgJ2tlcm5lbF9pbml0aWFsaXplcic6IHtcbiAgICAgICAgICAnY2xhc3NfbmFtZSc6ICdWYXJpYW5jZVNjYWxpbmcnLFxuICAgICAgICAgICdjb25maWcnOiB7XG4gICAgICAgICAgICAnZGlzdHJpYnV0aW9uJzogJ3VuaWZvcm0nLFxuICAgICAgICAgICAgJ3NjYWxlJzogMS4wLFxuICAgICAgICAgICAgJ3NlZWQnOiBudWxsLFxuICAgICAgICAgICAgJ21vZGUnOiAnZmFuX2F2ZydcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgICduYW1lJzogJ2RlbnNlJyxcbiAgICAgICAgJ2tlcm5lbF9jb25zdHJhaW50JzogbnVsbCxcbiAgICAgICAgJ2JpYXNfcmVndWxhcml6ZXInOiBudWxsLFxuICAgICAgICAnYmlhc19jb25zdHJhaW50JzogbnVsbCxcbiAgICAgICAgJ2R0eXBlJzogJ2Zsb2F0MzInLFxuICAgICAgICAnYWN0aXZhdGlvbic6ICdsaW5lYXInLFxuICAgICAgICAndHJhaW5hYmxlJzogdHJ1ZSxcbiAgICAgICAgJ2tlcm5lbF9yZWd1bGFyaXplcic6IG51bGwsXG4gICAgICAgICdiaWFzX2luaXRpYWxpemVyJzogeydjbGFzc19uYW1lJzogJ1plcm9zJywgJ2NvbmZpZyc6IHt9fSxcbiAgICAgICAgJ3VuaXRzJzogMSxcbiAgICAgICAgJ2JhdGNoX2lucHV0X3NoYXBlJzogW251bGwsIDNdLFxuICAgICAgICAndXNlX2JpYXMnOiB0cnVlLFxuICAgICAgICAnYWN0aXZpdHlfcmVndWxhcml6ZXInOiBudWxsXG4gICAgICB9XG4gICAgfV0sXG4gICAgJ2JhY2tlbmQnOiAndGVuc29yZmxvdydcbiAgfTtcbiAgY29uc3Qgd2VpZ2h0U3BlY3MxOiB0Zi5pby5XZWlnaHRzTWFuaWZlc3RFbnRyeVtdID0gW1xuICAgIHtcbiAgICAgIG5hbWU6ICdkZW5zZS9rZXJuZWwnLFxuICAgICAgc2hhcGU6IFszLCAxXSxcbiAgICAgIGR0eXBlOiAnZmxvYXQzMicsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnZGVuc2UvYmlhcycsXG4gICAgICBzaGFwZTogWzFdLFxuICAgICAgZHR5cGU6ICdmbG9hdDMyJyxcbiAgICB9XG4gIF07XG4gIGNvbnN0IHdlaWdodERhdGExID0gbmV3IEFycmF5QnVmZmVyKDE2KTtcbiAgY29uc3QgYXJ0aWZhY3RzMTogdGYuaW8uTW9kZWxBcnRpZmFjdHMgPSB7XG4gICAgbW9kZWxUb3BvbG9neTogbW9kZWxUb3BvbG9neTEsXG4gICAgd2VpZ2h0U3BlY3M6IHdlaWdodFNwZWNzMSxcbiAgICB3ZWlnaHREYXRhOiB3ZWlnaHREYXRhMSxcbiAgfTtcblxuICBiZWZvcmVFYWNoKGRvbmUgPT4ge1xuICAgIHB1cmdlTG9jYWxTdG9yYWdlQXJ0aWZhY3RzKCk7XG4gICAgZGVsZXRlRGF0YWJhc2UoKS50aGVuKCgpID0+IHtcbiAgICAgIGRvbmUoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgYWZ0ZXJFYWNoKGRvbmUgPT4ge1xuICAgIHB1cmdlTG9jYWxTdG9yYWdlQXJ0aWZhY3RzKCk7XG4gICAgZGVsZXRlRGF0YWJhc2UoKS50aGVuKCgpID0+IHtcbiAgICAgIGRvbmUoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gVE9ETyhjYWlzKTogUmVlbmFibGUgdGhpcyB0ZXN0IG9uY2Ugd2UgZml4XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90ZW5zb3JmbG93L3RmanMvaXNzdWVzLzExOThcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmJhblxuICB4aXQoJ0xpc3QgbW9kZWxzOiAwIHJlc3VsdCcsIGRvbmUgPT4ge1xuICAgIC8vIEJlZm9yZSBhbnkgbW9kZWwgaXMgc2F2ZWQsIGxpc3RNb2RlbHMgc2hvdWxkIHJldHVybiBlbXB0eSByZXN1bHQuXG4gICAgdGYuaW8ubGlzdE1vZGVscygpXG4gICAgICAgIC50aGVuKG91dCA9PiB7XG4gICAgICAgICAgZXhwZWN0KG91dCkudG9FcXVhbCh7fSk7XG4gICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyID0+IGRvbmUuZmFpbChlcnIuc3RhY2spKTtcbiAgfSk7XG5cbiAgLy8gVE9ETyhjYWlzKTogUmVlbmFibGUgdGhpcyB0ZXN0IG9uY2Ugd2UgZml4XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90ZW5zb3JmbG93L3RmanMvaXNzdWVzLzExOThcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmJhblxuICB4aXQoJ0xpc3QgbW9kZWxzOiAxIHJlc3VsdCcsIGRvbmUgPT4ge1xuICAgIGNvbnN0IHVybCA9ICdsb2NhbHN0b3JhZ2U6Ly9iYXovUXV4TW9kZWwnO1xuICAgIGNvbnN0IGhhbmRsZXIgPSB0Zi5pby5nZXRTYXZlSGFuZGxlcnModXJsKVswXTtcbiAgICBoYW5kbGVyLnNhdmUoYXJ0aWZhY3RzMSlcbiAgICAgICAgLnRoZW4oc2F2ZVJlc3VsdCA9PiB7XG4gICAgICAgICAgLy8gQWZ0ZXIgc3VjY2Vzc2Z1bCBzYXZpbmcsIHRoZXJlIHNob3VsZCBiZSBvbmUgbW9kZWwuXG4gICAgICAgICAgdGYuaW8ubGlzdE1vZGVscygpXG4gICAgICAgICAgICAgIC50aGVuKG91dCA9PiB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKG91dCkubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChvdXRbdXJsXS5tb2RlbFRvcG9sb2d5VHlwZSlcbiAgICAgICAgICAgICAgICAgICAgLnRvRXF1YWwoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8ubW9kZWxUb3BvbG9neVR5cGUpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChvdXRbdXJsXS5tb2RlbFRvcG9sb2d5Qnl0ZXMpXG4gICAgICAgICAgICAgICAgICAgIC50b0VxdWFsKHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvLm1vZGVsVG9wb2xvZ3lCeXRlcyk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KG91dFt1cmxdLndlaWdodFNwZWNzQnl0ZXMpXG4gICAgICAgICAgICAgICAgICAgIC50b0VxdWFsKHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvLndlaWdodFNwZWNzQnl0ZXMpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChvdXRbdXJsXS53ZWlnaHREYXRhQnl0ZXMpXG4gICAgICAgICAgICAgICAgICAgIC50b0VxdWFsKHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvLndlaWdodERhdGFCeXRlcyk7XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IGRvbmUuZmFpbChlcnIuc3RhY2spKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiBkb25lLmZhaWwoZXJyLnN0YWNrKSk7XG4gIH0pO1xuXG4gIC8vIFRPRE8oY2Fpcyk6IFJlZW5hYmxlIHRoaXMgdGVzdCBvbmNlIHdlIGZpeFxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdGVuc29yZmxvdy90ZmpzL2lzc3Vlcy8xMTk4XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpiYW5cbiAgeGl0KCdNYW5hZ2VyOiBMaXN0IG1vZGVsczogMiByZXN1bHRzIGluIDIgbWVkaXVtcycsIGRvbmUgPT4ge1xuICAgIGNvbnN0IHVybDEgPSAnbG9jYWxzdG9yYWdlOi8vUXV4TW9kZWwnO1xuICAgIGNvbnN0IHVybDIgPSAnaW5kZXhlZGRiOi8vUXV4TW9kZWwnO1xuXG4gICAgLy8gRmlyc3QsIHNhdmUgYSBtb2RlbCBpbiBMb2NhbCBTdG9yYWdlLlxuICAgIGNvbnN0IGhhbmRsZXIxID0gdGYuaW8uZ2V0U2F2ZUhhbmRsZXJzKHVybDEpWzBdO1xuICAgIGhhbmRsZXIxLnNhdmUoYXJ0aWZhY3RzMSlcbiAgICAgICAgLnRoZW4oc2F2ZVJlc3VsdDEgPT4ge1xuICAgICAgICAgIC8vIFRoZW4sIHNhdmUgdGhlIG1vZGVsIGluIEluZGV4ZWREQi5cbiAgICAgICAgICBjb25zdCBoYW5kbGVyMiA9IHRmLmlvLmdldFNhdmVIYW5kbGVycyh1cmwyKVswXTtcbiAgICAgICAgICBoYW5kbGVyMi5zYXZlKGFydGlmYWN0czEpXG4gICAgICAgICAgICAgIC50aGVuKHNhdmVSZXN1bHQyID0+IHtcbiAgICAgICAgICAgICAgICAvLyBBZnRlciBzdWNjZXNzZnVsIHNhdmluZywgdGhlcmUgc2hvdWxkIGJlIHR3byBtb2RlbHMuXG4gICAgICAgICAgICAgICAgdGYuaW8ubGlzdE1vZGVscygpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKG91dCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKG91dCkubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChvdXRbdXJsMV0ubW9kZWxUb3BvbG9neVR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC50b0VxdWFsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVJlc3VsdDEubW9kZWxBcnRpZmFjdHNJbmZvLm1vZGVsVG9wb2xvZ3lUeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICBleHBlY3Qob3V0W3VybDFdLm1vZGVsVG9wb2xvZ3lCeXRlcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvRXF1YWwoc2F2ZVJlc3VsdDEubW9kZWxBcnRpZmFjdHNJbmZvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubW9kZWxUb3BvbG9neUJ5dGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICBleHBlY3Qob3V0W3VybDFdLndlaWdodFNwZWNzQnl0ZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC50b0VxdWFsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVJlc3VsdDEubW9kZWxBcnRpZmFjdHNJbmZvLndlaWdodFNwZWNzQnl0ZXMpO1xuICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChvdXRbdXJsMV0ud2VpZ2h0RGF0YUJ5dGVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAudG9FcXVhbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVSZXN1bHQxLm1vZGVsQXJ0aWZhY3RzSW5mby53ZWlnaHREYXRhQnl0ZXMpO1xuICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChvdXRbdXJsMl0ubW9kZWxUb3BvbG9neVR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC50b0VxdWFsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVJlc3VsdDIubW9kZWxBcnRpZmFjdHNJbmZvLm1vZGVsVG9wb2xvZ3lUeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICBleHBlY3Qob3V0W3VybDJdLm1vZGVsVG9wb2xvZ3lCeXRlcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvRXF1YWwoc2F2ZVJlc3VsdDIubW9kZWxBcnRpZmFjdHNJbmZvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubW9kZWxUb3BvbG9neUJ5dGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICBleHBlY3Qob3V0W3VybDJdLndlaWdodFNwZWNzQnl0ZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC50b0VxdWFsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVJlc3VsdDIubW9kZWxBcnRpZmFjdHNJbmZvLndlaWdodFNwZWNzQnl0ZXMpO1xuICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChvdXRbdXJsMl0ud2VpZ2h0RGF0YUJ5dGVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAudG9FcXVhbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVSZXN1bHQyLm1vZGVsQXJ0aWZhY3RzSW5mby53ZWlnaHREYXRhQnl0ZXMpO1xuICAgICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiBkb25lLmZhaWwoZXJyLnN0YWNrKSk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gZG9uZS5mYWlsKGVyci5zdGFjaykpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyID0+IGRvbmUuZmFpbChlcnIuc3RhY2spKTtcbiAgfSk7XG5cbiAgLy8gVE9ETyhjYWlzKTogUmVlbmFibGUgdGhpcyB0ZXN0IG9uY2Ugd2UgZml4XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90ZW5zb3JmbG93L3RmanMvaXNzdWVzLzExOThcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmJhblxuICB4aXQoJ1N1Y2Nlc3NmdWwgcmVtb3ZlTW9kZWwnLCBkb25lID0+IHtcbiAgICAvLyBGaXJzdCwgc2F2ZSBhIG1vZGVsLlxuICAgIGNvbnN0IGhhbmRsZXIxID0gdGYuaW8uZ2V0U2F2ZUhhbmRsZXJzKCdsb2NhbHN0b3JhZ2U6Ly9RdXhNb2RlbCcpWzBdO1xuICAgIGhhbmRsZXIxLnNhdmUoYXJ0aWZhY3RzMSlcbiAgICAgICAgLnRoZW4oc2F2ZVJlc3VsdDEgPT4ge1xuICAgICAgICAgIC8vIFRoZW4sIHNhdmUgdGhlIG1vZGVsIHVuZGVyIGFub3RoZXIgcGF0aC5cbiAgICAgICAgICBjb25zdCBoYW5kbGVyMiA9XG4gICAgICAgICAgICAgIHRmLmlvLmdldFNhdmVIYW5kbGVycygnaW5kZXhlZGRiOi8vcmVwZWF0L1F1eE1vZGVsJylbMF07XG4gICAgICAgICAgaGFuZGxlcjIuc2F2ZShhcnRpZmFjdHMxKVxuICAgICAgICAgICAgICAudGhlbihzYXZlUmVzdWx0MiA9PiB7XG4gICAgICAgICAgICAgICAgLy8gQWZ0ZXIgc3VjY2Vzc2Z1bCBzYXZpbmcsIGRlbGV0ZSB0aGUgZmlyc3Qgc2F2ZSwgYW5kIHRoZW5cbiAgICAgICAgICAgICAgICAvLyBgbGlzdE1vZGVsYCBzaG91bGQgZ2l2ZSBvbmx5IG9uZSByZXN1bHQuXG5cbiAgICAgICAgICAgICAgICAvLyBEZWxldGUgYSBtb2RlbCBzcGVjaWZpZWQgd2l0aCBhIHBhdGggdGhhdCBpbmNsdWRlcyB0aGVcbiAgICAgICAgICAgICAgICAvLyBpbmRleGVkZGI6Ly8gc2NoZW1lIHByZWZpeCBzaG91bGQgd29yay5cbiAgICAgICAgICAgICAgICB0Zi5pby5yZW1vdmVNb2RlbCgnaW5kZXhlZGRiOi8vcmVwZWF0L1F1eE1vZGVsJylcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZGVsZXRlZEluZm8gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIHRmLmlvLmxpc3RNb2RlbHMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihvdXQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhvdXQpKS50b0VxdWFsKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdsb2NhbHN0b3JhZ2U6Ly9RdXhNb2RlbCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRmLmlvLnJlbW92ZU1vZGVsKCdsb2NhbHN0b3JhZ2U6Ly9RdXhNb2RlbCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKG91dCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGRlbGV0ZSB0aGUgcmVtYWluaW5nIG1vZGVsLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRmLmlvLmxpc3RNb2RlbHMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihvdXQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhvdXQpKS50b0VxdWFsKFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gZG9uZS5mYWlsKGVycikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IGRvbmUuZmFpbChlcnIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiBkb25lLmZhaWwoZXJyKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gZG9uZS5mYWlsKGVyci5zdGFjaykpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IGRvbmUuZmFpbChlcnIuc3RhY2spKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiBkb25lLmZhaWwoZXJyLnN0YWNrKSk7XG4gIH0pO1xuXG4gIC8vIFRPRE8oY2Fpcyk6IFJlZW5hYmxlIHRoaXMgdGVzdCBvbmNlIHdlIGZpeFxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdGVuc29yZmxvdy90ZmpzL2lzc3Vlcy8xMTk4XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpiYW5cbiAgeGl0KCdTdWNjZXNzZnVsIGNvcHlNb2RlbCBiZXR3ZWVuIG1lZGl1bXMnLCBkb25lID0+IHtcbiAgICBjb25zdCB1cmwxID0gJ2xvY2Fsc3RvcmFnZTovL2ExL0Zvb01vZGVsJztcbiAgICBjb25zdCB1cmwyID0gJ2luZGV4ZWRkYjovL2ExL0Zvb01vZGVsJztcbiAgICAvLyBGaXJzdCwgc2F2ZSBhIG1vZGVsLlxuICAgIGNvbnN0IGhhbmRsZXIxID0gdGYuaW8uZ2V0U2F2ZUhhbmRsZXJzKHVybDEpWzBdO1xuICAgIGhhbmRsZXIxLnNhdmUoYXJ0aWZhY3RzMSlcbiAgICAgICAgLnRoZW4oc2F2ZVJlc3VsdCA9PiB7XG4gICAgICAgICAgLy8gT25jZSBtb2RlbCBpcyBzYXZlZCwgY29weSB0aGUgbW9kZWwgdG8gYW5vdGhlciBwYXRoLlxuICAgICAgICAgIHRmLmlvLmNvcHlNb2RlbCh1cmwxLCB1cmwyKVxuICAgICAgICAgICAgICAudGhlbihtb2RlbEluZm8gPT4ge1xuICAgICAgICAgICAgICAgIHRmLmlvLmxpc3RNb2RlbHMoKS50aGVuKG91dCA9PiB7XG4gICAgICAgICAgICAgICAgICBleHBlY3QoT2JqZWN0LmtleXMob3V0KS5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICAgICAgICAgICAgICBleHBlY3Qob3V0W3VybDFdLm1vZGVsVG9wb2xvZ3lUeXBlKVxuICAgICAgICAgICAgICAgICAgICAgIC50b0VxdWFsKHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvLm1vZGVsVG9wb2xvZ3lUeXBlKTtcbiAgICAgICAgICAgICAgICAgIGV4cGVjdChvdXRbdXJsMV0ubW9kZWxUb3BvbG9neUJ5dGVzKVxuICAgICAgICAgICAgICAgICAgICAgIC50b0VxdWFsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlUmVzdWx0Lm1vZGVsQXJ0aWZhY3RzSW5mby5tb2RlbFRvcG9sb2d5Qnl0ZXMpO1xuICAgICAgICAgICAgICAgICAgZXhwZWN0KG91dFt1cmwxXS53ZWlnaHRTcGVjc0J5dGVzKVxuICAgICAgICAgICAgICAgICAgICAgIC50b0VxdWFsKHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvLndlaWdodFNwZWNzQnl0ZXMpO1xuICAgICAgICAgICAgICAgICAgZXhwZWN0KG91dFt1cmwxXS53ZWlnaHREYXRhQnl0ZXMpXG4gICAgICAgICAgICAgICAgICAgICAgLnRvRXF1YWwoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8ud2VpZ2h0RGF0YUJ5dGVzKTtcbiAgICAgICAgICAgICAgICAgIGV4cGVjdChvdXRbdXJsMl0ubW9kZWxUb3BvbG9neVR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgLnRvRXF1YWwoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8ubW9kZWxUb3BvbG9neVR5cGUpO1xuICAgICAgICAgICAgICAgICAgZXhwZWN0KG91dFt1cmwyXS5tb2RlbFRvcG9sb2d5Qnl0ZXMpXG4gICAgICAgICAgICAgICAgICAgICAgLnRvRXF1YWwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvLm1vZGVsVG9wb2xvZ3lCeXRlcyk7XG4gICAgICAgICAgICAgICAgICBleHBlY3Qob3V0W3VybDJdLndlaWdodFNwZWNzQnl0ZXMpXG4gICAgICAgICAgICAgICAgICAgICAgLnRvRXF1YWwoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8ud2VpZ2h0U3BlY3NCeXRlcyk7XG4gICAgICAgICAgICAgICAgICBleHBlY3Qob3V0W3VybDJdLndlaWdodERhdGFCeXRlcylcbiAgICAgICAgICAgICAgICAgICAgICAudG9FcXVhbChzYXZlUmVzdWx0Lm1vZGVsQXJ0aWZhY3RzSW5mby53ZWlnaHREYXRhQnl0ZXMpO1xuXG4gICAgICAgICAgICAgICAgICAvLyBMb2FkIHRoZSBjb3B5IGFuZCB2ZXJpZnkgdGhlIGNvbnRlbnQuXG4gICAgICAgICAgICAgICAgICBjb25zdCBoYW5kbGVyMiA9IHRmLmlvLmdldExvYWRIYW5kbGVycyh1cmwyKVswXTtcbiAgICAgICAgICAgICAgICAgIGhhbmRsZXIyLmxvYWQoKVxuICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGxvYWRlZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHBlY3QobG9hZGVkLm1vZGVsVG9wb2xvZ3kpLnRvRXF1YWwobW9kZWxUb3BvbG9neTEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGxvYWRlZC53ZWlnaHRTcGVjcykudG9FcXVhbCh3ZWlnaHRTcGVjczEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0KG5ldyBVaW50OEFycmF5KGxvYWRlZC53ZWlnaHREYXRhKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudG9FcXVhbChuZXcgVWludDhBcnJheSh3ZWlnaHREYXRhMSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiBkb25lLmZhaWwoZXJyLnN0YWNrKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gZG9uZS5mYWlsKGVyci5zdGFjaykpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyID0+IGRvbmUuZmFpbChlcnIuc3RhY2spKTtcbiAgfSk7XG5cbiAgLy8gVE9ETyhjYWlzKTogUmVlbmFibGUgdGhpcyB0ZXN0IG9uY2Ugd2UgZml4XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90ZW5zb3JmbG93L3RmanMvaXNzdWVzLzExOThcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmJhblxuICB4aXQoJ1N1Y2Nlc3NmdWwgbW92ZU1vZGVsIGJldHdlZW4gbWVkaXVtcycsIGRvbmUgPT4ge1xuICAgIGNvbnN0IHVybDEgPSAnbG9jYWxzdG9yYWdlOi8vYTEvRm9vTW9kZWwnO1xuICAgIGNvbnN0IHVybDIgPSAnaW5kZXhlZGRiOi8vYTEvRm9vTW9kZWwnO1xuICAgIC8vIEZpcnN0LCBzYXZlIGEgbW9kZWwuXG4gICAgY29uc3QgaGFuZGxlcjEgPSB0Zi5pby5nZXRTYXZlSGFuZGxlcnModXJsMSlbMF07XG4gICAgaGFuZGxlcjEuc2F2ZShhcnRpZmFjdHMxKVxuICAgICAgICAudGhlbihzYXZlUmVzdWx0ID0+IHtcbiAgICAgICAgICAvLyBPbmNlIG1vZGVsIGlzIHNhdmVkLCBtb3ZlIHRoZSBtb2RlbCB0byBhbm90aGVyIHBhdGguXG4gICAgICAgICAgdGYuaW8ubW92ZU1vZGVsKHVybDEsIHVybDIpXG4gICAgICAgICAgICAgIC50aGVuKG1vZGVsSW5mbyA9PiB7XG4gICAgICAgICAgICAgICAgdGYuaW8ubGlzdE1vZGVscygpLnRoZW4ob3V0ID0+IHtcbiAgICAgICAgICAgICAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhvdXQpKS50b0VxdWFsKFt1cmwyXSk7XG4gICAgICAgICAgICAgICAgICBleHBlY3Qob3V0W3VybDJdLm1vZGVsVG9wb2xvZ3lUeXBlKVxuICAgICAgICAgICAgICAgICAgICAgIC50b0VxdWFsKHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvLm1vZGVsVG9wb2xvZ3lUeXBlKTtcbiAgICAgICAgICAgICAgICAgIGV4cGVjdChvdXRbdXJsMl0ubW9kZWxUb3BvbG9neUJ5dGVzKVxuICAgICAgICAgICAgICAgICAgICAgIC50b0VxdWFsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlUmVzdWx0Lm1vZGVsQXJ0aWZhY3RzSW5mby5tb2RlbFRvcG9sb2d5Qnl0ZXMpO1xuICAgICAgICAgICAgICAgICAgZXhwZWN0KG91dFt1cmwyXS53ZWlnaHRTcGVjc0J5dGVzKVxuICAgICAgICAgICAgICAgICAgICAgIC50b0VxdWFsKHNhdmVSZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvLndlaWdodFNwZWNzQnl0ZXMpO1xuICAgICAgICAgICAgICAgICAgZXhwZWN0KG91dFt1cmwyXS53ZWlnaHREYXRhQnl0ZXMpXG4gICAgICAgICAgICAgICAgICAgICAgLnRvRXF1YWwoc2F2ZVJlc3VsdC5tb2RlbEFydGlmYWN0c0luZm8ud2VpZ2h0RGF0YUJ5dGVzKTtcblxuICAgICAgICAgICAgICAgICAgLy8gTG9hZCB0aGUgY29weSBhbmQgdmVyaWZ5IHRoZSBjb250ZW50LlxuICAgICAgICAgICAgICAgICAgY29uc3QgaGFuZGxlcjIgPSB0Zi5pby5nZXRMb2FkSGFuZGxlcnModXJsMilbMF07XG4gICAgICAgICAgICAgICAgICBoYW5kbGVyMi5sb2FkKClcbiAgICAgICAgICAgICAgICAgICAgICAudGhlbihsb2FkZWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0KGxvYWRlZC5tb2RlbFRvcG9sb2d5KS50b0VxdWFsKG1vZGVsVG9wb2xvZ3kxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChsb2FkZWQud2VpZ2h0U3BlY3MpLnRvRXF1YWwod2VpZ2h0U3BlY3MxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChuZXcgVWludDhBcnJheShsb2FkZWQud2VpZ2h0RGF0YSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvRXF1YWwobmV3IFVpbnQ4QXJyYXkod2VpZ2h0RGF0YTEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9uZS5mYWlsKGVyci5zdGFjayk7XG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gZG9uZS5mYWlsKGVyci5zdGFjaykpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyID0+IGRvbmUuZmFpbChlcnIuc3RhY2spKTtcbiAgfSk7XG5cbiAgaXQoJ0ZhaWxlZCBjb3B5TW9kZWwgdG8gaW52YWxpZCBzb3VyY2UgVVJMJywgcnVuV2l0aExvY2soZG9uZSA9PiB7XG4gICAgICAgY29uc3QgdXJsMSA9ICdpbnZhbGlkdXJsJztcbiAgICAgICBjb25zdCB1cmwyID0gJ2xvY2Fsc3RvcmFnZTovL2ExL0Zvb01vZGVsJztcbiAgICAgICB0Zi5pby5jb3B5TW9kZWwodXJsMSwgdXJsMilcbiAgICAgICAgICAgLnRoZW4ob3V0ID0+IHtcbiAgICAgICAgICAgICBkb25lLmZhaWwoJ0NvcHlpbmcgZnJvbSBpbnZhbGlkIFVSTCBzdWNjZWVkZWQgdW5leHBlY3RlZGx5LicpO1xuICAgICAgICAgICB9KVxuICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICBleHBlY3QoZXJyLm1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgIC50b0VxdWFsKFxuICAgICAgICAgICAgICAgICAgICAgJ0NvcHlpbmcgZmFpbGVkIGJlY2F1c2Ugbm8gbG9hZCBoYW5kbGVyIGlzIGZvdW5kIGZvciAnICtcbiAgICAgICAgICAgICAgICAgICAgICdzb3VyY2UgVVJMIGludmFsaWR1cmwuJyk7XG4gICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICB9KTtcbiAgICAgfSkpO1xuXG4gIGl0KCdGYWlsZWQgY29weU1vZGVsIHRvIGludmFsaWQgZGVzdGluYXRpb24gVVJMJywgcnVuV2l0aExvY2soZG9uZSA9PiB7XG4gICAgICAgY29uc3QgdXJsMSA9ICdsb2NhbHN0b3JhZ2U6Ly9hMS9Gb29Nb2RlbCc7XG4gICAgICAgY29uc3QgdXJsMiA9ICdpbnZhbGlkdXJsJztcbiAgICAgICAvLyBGaXJzdCwgc2F2ZSBhIG1vZGVsLlxuICAgICAgIGNvbnN0IGhhbmRsZXIxID0gdGYuaW8uZ2V0U2F2ZUhhbmRsZXJzKHVybDEpWzBdO1xuICAgICAgIGhhbmRsZXIxLnNhdmUoYXJ0aWZhY3RzMSlcbiAgICAgICAgICAgLnRoZW4oc2F2ZVJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgLy8gT25jZSBtb2RlbCBpcyBzYXZlZCwgY29weSB0aGUgbW9kZWwgdG8gYW5vdGhlciBwYXRoLlxuICAgICAgICAgICAgIHRmLmlvLmNvcHlNb2RlbCh1cmwxLCB1cmwyKVxuICAgICAgICAgICAgICAgICAudGhlbihvdXQgPT4ge1xuICAgICAgICAgICAgICAgICAgIGRvbmUuZmFpbCgnQ29weWluZyB0byBpbnZhbGlkIFVSTCBzdWNjZWVkZWQgdW5leHBlY3RlZGx5LicpO1xuICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICBleHBlY3QoZXJyLm1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgIC50b0VxdWFsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0NvcHlpbmcgZmFpbGVkIGJlY2F1c2Ugbm8gc2F2ZSBoYW5kbGVyIGlzIGZvdW5kICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2ZvciBkZXN0aW5hdGlvbiBVUkwgaW52YWxpZHVybC4nKTtcbiAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICB9KVxuICAgICAgICAgICAuY2F0Y2goZXJyID0+IGRvbmUuZmFpbChlcnIuc3RhY2spKTtcbiAgICAgfSkpO1xuXG4gIGl0KCdGYWlsZWQgbW92ZU1vZGVsIHRvIGludmFsaWQgZGVzdGluYXRpb24gVVJMJywgcnVuV2l0aExvY2soZG9uZSA9PiB7XG4gICAgICAgY29uc3QgdXJsMSA9ICdsb2NhbHN0b3JhZ2U6Ly9hMS9Gb29Nb2RlbCc7XG4gICAgICAgY29uc3QgdXJsMiA9ICdpbnZhbGlkdXJsJztcbiAgICAgICAvLyBGaXJzdCwgc2F2ZSBhIG1vZGVsLlxuICAgICAgIGNvbnN0IGhhbmRsZXIxID0gdGYuaW8uZ2V0U2F2ZUhhbmRsZXJzKHVybDEpWzBdO1xuICAgICAgIGhhbmRsZXIxLnNhdmUoYXJ0aWZhY3RzMSlcbiAgICAgICAgICAgLnRoZW4oc2F2ZVJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgLy8gT25jZSBtb2RlbCBpcyBzYXZlZCwgY29weSB0aGUgbW9kZWwgdG8gYW4gaW52YWxpZCBwYXRoLCB3aGljaFxuICAgICAgICAgICAgIC8vIHNob3VsZCBmYWlsLlxuICAgICAgICAgICAgIHRmLmlvLm1vdmVNb2RlbCh1cmwxLCB1cmwyKVxuICAgICAgICAgICAgICAgICAudGhlbihvdXQgPT4ge1xuICAgICAgICAgICAgICAgICAgIGRvbmUuZmFpbCgnQ29weWluZyB0byBpbnZhbGlkIFVSTCBzdWNjZWVkZWQgdW5leHBlY3RlZGx5LicpO1xuICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICBleHBlY3QoZXJyLm1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgIC50b0VxdWFsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0NvcHlpbmcgZmFpbGVkIGJlY2F1c2Ugbm8gc2F2ZSBoYW5kbGVyIGlzIGZvdW5kICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2ZvciBkZXN0aW5hdGlvbiBVUkwgaW52YWxpZHVybC4nKTtcblxuICAgICAgICAgICAgICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSBzb3VyY2UgaGFzIG5vdCBiZWVuIHJlbW92ZWQuXG4gICAgICAgICAgICAgICAgICAgdGYuaW8ubGlzdE1vZGVscygpXG4gICAgICAgICAgICAgICAgICAgICAgIC50aGVuKG91dCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKG91dCkpLnRvRXF1YWwoW3VybDFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gZG9uZS5mYWlsKGVyci5zdGFjaykpO1xuICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgfSlcbiAgICAgICAgICAgLmNhdGNoKGVyciA9PiBkb25lLmZhaWwoZXJyLnN0YWNrKSk7XG4gICAgIH0pKTtcblxuICBpdCgnRmFpbGVkIGRlbGV0ZWRNb2RlbDogQWJzZW50IHNjaGVtZScsIHJ1bldpdGhMb2NrKGRvbmUgPT4ge1xuICAgICAgIC8vIEF0dGVtcHQgdG8gZGVsZXRlIGEgbm9uZXhpc3RlbnQgbW9kZWwgaXMgZXhwZWN0ZWQgdG8gZmFpbC5cbiAgICAgICB0Zi5pby5yZW1vdmVNb2RlbCgnZm9vJylcbiAgICAgICAgICAgLnRoZW4ob3V0ID0+IHtcbiAgICAgICAgICAgICBkb25lLmZhaWwoXG4gICAgICAgICAgICAgICAgICdSZW1vdmluZyBtb2RlbCB3aXRoIG1pc3Npbmcgc2NoZW1lIHN1Y2NlZWRlZCB1bmV4cGVjdGVkbHkuJyk7XG4gICAgICAgICAgIH0pXG4gICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgIGV4cGVjdChlcnIubWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgLnRvTWF0Y2goL1RoZSB1cmwgc3RyaW5nIHByb3ZpZGVkIGRvZXMgbm90IGNvbnRhaW4gYSBzY2hlbWUvKTtcbiAgICAgICAgICAgICBleHBlY3QoZXJyLm1lc3NhZ2UuaW5kZXhPZignbG9jYWxzdG9yYWdlJykpLnRvQmVHcmVhdGVyVGhhbigwKTtcbiAgICAgICAgICAgICBleHBlY3QoZXJyLm1lc3NhZ2UuaW5kZXhPZignaW5kZXhlZGRiJykpLnRvQmVHcmVhdGVyVGhhbigwKTtcbiAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgIH0pO1xuICAgICB9KSk7XG5cbiAgaXQoJ0ZhaWxlZCBkZWxldGVkTW9kZWw6IEludmFsaWQgc2NoZW1lJywgcnVuV2l0aExvY2soZG9uZSA9PiB7XG4gICAgICAgLy8gQXR0ZW1wdCB0byBkZWxldGUgYSBub25leGlzdGVudCBtb2RlbCBpcyBleHBlY3RlZCB0byBmYWlsLlxuICAgICAgIHRmLmlvLnJlbW92ZU1vZGVsKCdpbnZhbGlkc2NoZW1lOi8vZm9vJylcbiAgICAgICAgICAgLnRoZW4ob3V0ID0+IHtcbiAgICAgICAgICAgICBkb25lLmZhaWwoJ1JlbW92aW5nIG5vbmV4aXN0ZW50IG1vZGVsIHN1Y2NlZWRlZCB1bmV4cGVjdGVkbHkuJyk7XG4gICAgICAgICAgIH0pXG4gICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgIGV4cGVjdChlcnIubWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgLnRvRXF1YWwoXG4gICAgICAgICAgICAgICAgICAgICAnQ2Fubm90IGZpbmQgbW9kZWwgbWFuYWdlciBmb3Igc2NoZW1lIFxcJ2ludmFsaWRzY2hlbWVcXCcnKTtcbiAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgIH0pO1xuICAgICB9KSk7XG5cbiAgaXQoJ0ZhaWxlZCBkZWxldGVkTW9kZWw6IE5vbmV4aXN0ZW50IG1vZGVsJywgcnVuV2l0aExvY2soZG9uZSA9PiB7XG4gICAgICAgLy8gQXR0ZW1wdCB0byBkZWxldGUgYSBub25leGlzdGVudCBtb2RlbCBpcyBleHBlY3RlZCB0byBmYWlsLlxuICAgICAgIHRmLmlvLnJlbW92ZU1vZGVsKCdpbmRleGVkZGI6Ly9ub25leGlzdGVudCcpXG4gICAgICAgICAgIC50aGVuKG91dCA9PiB7XG4gICAgICAgICAgICAgZG9uZS5mYWlsKCdSZW1vdmluZyBub25leGlzdGVudCBtb2RlbCBzdWNjZWVkZWQgdW5leHBlY3RlZGx5LicpO1xuICAgICAgICAgICB9KVxuICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICBleHBlY3QoZXJyLm1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgIC50b0VxdWFsKFxuICAgICAgICAgICAgICAgICAgICAgJ0Nhbm5vdCBmaW5kIG1vZGVsICcgK1xuICAgICAgICAgICAgICAgICAgICAgJ3dpdGggcGF0aCBcXCdub25leGlzdGVudFxcJyBpbiBJbmRleGVkREIuJyk7XG4gICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICB9KTtcbiAgICAgfSkpO1xuXG4gIGl0KCdGYWlsZWQgY29weU1vZGVsJywgcnVuV2l0aExvY2soZG9uZSA9PiB7XG4gICAgICAgLy8gQXR0ZW1wdCB0byBjb3B5IGEgbm9uZXhpc3RlbnQgbW9kZWwgc2hvdWxkIGZhaWwuXG4gICAgICAgdGYuaW8uY29weU1vZGVsKCdpbmRleGVkZGI6Ly9ub25leGlzdGVudCcsICdpbmRleGVkZGI6Ly9kZXN0aW5hdGlvbicpXG4gICAgICAgICAgIC50aGVuKG91dCA9PiB7XG4gICAgICAgICAgICAgZG9uZS5mYWlsKCdDb3B5aW5nIG5vbmV4aXN0ZW50IG1vZGVsIHN1Y2NlZWRlZCB1bmV4cGVjdGVkbHkuJyk7XG4gICAgICAgICAgIH0pXG4gICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgIGV4cGVjdChlcnIubWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgLnRvRXF1YWwoXG4gICAgICAgICAgICAgICAgICAgICAnQ2Fubm90IGZpbmQgbW9kZWwgJyArXG4gICAgICAgICAgICAgICAgICAgICAnd2l0aCBwYXRoIFxcJ25vbmV4aXN0ZW50XFwnIGluIEluZGV4ZWREQi4nKTtcbiAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgIH0pO1xuICAgICB9KSk7XG5cbiAgaXQoJ2NvcHlNb2RlbDogSWRlbnRpY2FsIG9sZFBhdGggYW5kIG5ld1BhdGggbGVhZHMgdG8gRXJyb3InLFxuICAgICBydW5XaXRoTG9jayhkb25lID0+IHtcbiAgICAgICB0Zi5pby5jb3B5TW9kZWwoJ2EvMScsICdhLzEnKVxuICAgICAgICAgICAudGhlbihvdXQgPT4ge1xuICAgICAgICAgICAgIGRvbmUuZmFpbChcbiAgICAgICAgICAgICAgICAgJ0NvcHlpbmcgd2l0aCBpZGVudGljYWwgJyArXG4gICAgICAgICAgICAgICAgICdvbGQgJiBuZXcgcGF0aHMgc3VjY2VlZGVkIHVuZXhwZWN0ZWRseS4nKTtcbiAgICAgICAgICAgfSlcbiAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgZXhwZWN0KGVyci5tZXNzYWdlKVxuICAgICAgICAgICAgICAgICAudG9FcXVhbCgnT2xkIHBhdGggYW5kIG5ldyBwYXRoIGFyZSB0aGUgc2FtZTogXFwnYS8xXFwnJyk7XG4gICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICB9KTtcbiAgICAgfSkpO1xuXG4gIGl0KCdtb3ZlTW9kZWw6IElkZW50aWNhbCBvbGRQYXRoIGFuZCBuZXdQYXRoIGxlYWRzIHRvIEVycm9yJyxcbiAgICAgcnVuV2l0aExvY2soZG9uZSA9PiB7XG4gICAgICAgdGYuaW8ubW92ZU1vZGVsKCdhLzEnLCAnYS8xJylcbiAgICAgICAgICAgLnRoZW4ob3V0ID0+IHtcbiAgICAgICAgICAgICBkb25lLmZhaWwoXG4gICAgICAgICAgICAgICAgICdDb3B5aW5nIHdpdGggaWRlbnRpY2FsICcgK1xuICAgICAgICAgICAgICAgICAnb2xkICYgbmV3IHBhdGhzIHN1Y2NlZWRlZCB1bmV4cGVjdGVkbHkuJyk7XG4gICAgICAgICAgIH0pXG4gICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgIGV4cGVjdChlcnIubWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgLnRvRXF1YWwoJ09sZCBwYXRoIGFuZCBuZXcgcGF0aCBhcmUgdGhlIHNhbWU6IFxcJ2EvMVxcJycpO1xuICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgfSk7XG4gICAgIH0pKTtcbn0pO1xuIl19