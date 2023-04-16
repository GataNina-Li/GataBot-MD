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
import '../flags';
import { env } from '../environment';
import { getModelArtifactsInfoForJSON } from './io_utils';
import { IORouterRegistry } from './router_registry';
const DATABASE_NAME = 'tensorflowjs';
const DATABASE_VERSION = 1;
// Model data and ModelArtifactsInfo (metadata) are stored in two separate
// stores for efficient access of the list of stored models and their metadata.
// 1. The object store for model data: topology, weights and weight manifests.
const MODEL_STORE_NAME = 'models_store';
// 2. The object store for ModelArtifactsInfo, including meta-information such
//    as the type of topology (JSON vs binary), byte size of the topology, byte
//    size of the weights, etc.
const INFO_STORE_NAME = 'model_info_store';
/**
 * Delete the entire database for tensorflow.js, including the models store.
 */
export async function deleteDatabase() {
    const idbFactory = getIndexedDBFactory();
    return new Promise((resolve, reject) => {
        const deleteRequest = idbFactory.deleteDatabase(DATABASE_NAME);
        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = error => reject(error);
    });
}
function getIndexedDBFactory() {
    if (!env().getBool('IS_BROWSER')) {
        // TODO(cais): Add more info about what IOHandler subtypes are available.
        //   Maybe point to a doc page on the web and/or automatically determine
        //   the available IOHandlers and print them in the error message.
        throw new Error('Failed to obtain IndexedDB factory because the current environment' +
            'is not a web browser.');
    }
    // tslint:disable-next-line:no-any
    const theWindow = typeof window === 'undefined' ? self : window;
    const factory = theWindow.indexedDB || theWindow.mozIndexedDB ||
        theWindow.webkitIndexedDB || theWindow.msIndexedDB ||
        theWindow.shimIndexedDB;
    if (factory == null) {
        throw new Error('The current browser does not appear to support IndexedDB.');
    }
    return factory;
}
function setUpDatabase(openRequest) {
    const db = openRequest.result;
    db.createObjectStore(MODEL_STORE_NAME, { keyPath: 'modelPath' });
    db.createObjectStore(INFO_STORE_NAME, { keyPath: 'modelPath' });
}
/**
 * IOHandler subclass: Browser IndexedDB.
 *
 * See the doc string of `browserIndexedDB` for more details.
 */
export class BrowserIndexedDB {
    constructor(modelPath) {
        this.indexedDB = getIndexedDBFactory();
        if (modelPath == null || !modelPath) {
            throw new Error('For IndexedDB, modelPath must not be null, undefined or empty.');
        }
        this.modelPath = modelPath;
    }
    async save(modelArtifacts) {
        // TODO(cais): Support saving GraphDef models.
        if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
            throw new Error('BrowserLocalStorage.save() does not support saving model topology ' +
                'in binary formats yet.');
        }
        return this.databaseAction(this.modelPath, modelArtifacts);
    }
    async load() {
        return this.databaseAction(this.modelPath);
    }
    /**
     * Perform database action to put model artifacts into or read model artifacts
     * from IndexedDB object store.
     *
     * Whether the action is put or get depends on whether `modelArtifacts` is
     * specified. If it is specified, the action will be put; otherwise the action
     * will be get.
     *
     * @param modelPath A unique string path for the model.
     * @param modelArtifacts If specified, it will be the model artifacts to be
     *   stored in IndexedDB.
     * @returns A `Promise` of `SaveResult`, if the action is put, or a `Promise`
     *   of `ModelArtifacts`, if the action is get.
     */
    databaseAction(modelPath, modelArtifacts) {
        return new Promise((resolve, reject) => {
            const openRequest = this.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
            openRequest.onupgradeneeded = () => setUpDatabase(openRequest);
            openRequest.onsuccess = () => {
                const db = openRequest.result;
                if (modelArtifacts == null) {
                    // Read model out from object store.
                    const modelTx = db.transaction(MODEL_STORE_NAME, 'readonly');
                    const modelStore = modelTx.objectStore(MODEL_STORE_NAME);
                    const getRequest = modelStore.get(this.modelPath);
                    getRequest.onsuccess = () => {
                        if (getRequest.result == null) {
                            db.close();
                            return reject(new Error(`Cannot find model with path '${this.modelPath}' ` +
                                `in IndexedDB.`));
                        }
                        else {
                            resolve(getRequest.result.modelArtifacts);
                        }
                    };
                    getRequest.onerror = error => {
                        db.close();
                        return reject(getRequest.error);
                    };
                    modelTx.oncomplete = () => db.close();
                }
                else {
                    // Put model into object store.
                    const modelArtifactsInfo = getModelArtifactsInfoForJSON(modelArtifacts);
                    // First, put ModelArtifactsInfo into info store.
                    const infoTx = db.transaction(INFO_STORE_NAME, 'readwrite');
                    let infoStore = infoTx.objectStore(INFO_STORE_NAME);
                    const putInfoRequest = infoStore.put({ modelPath: this.modelPath, modelArtifactsInfo });
                    let modelTx;
                    putInfoRequest.onsuccess = () => {
                        // Second, put model data into model store.
                        modelTx = db.transaction(MODEL_STORE_NAME, 'readwrite');
                        const modelStore = modelTx.objectStore(MODEL_STORE_NAME);
                        const putModelRequest = modelStore.put({
                            modelPath: this.modelPath,
                            modelArtifacts,
                            modelArtifactsInfo
                        });
                        putModelRequest.onsuccess = () => resolve({ modelArtifactsInfo });
                        putModelRequest.onerror = error => {
                            // If the put-model request fails, roll back the info entry as
                            // well.
                            infoStore = infoTx.objectStore(INFO_STORE_NAME);
                            const deleteInfoRequest = infoStore.delete(this.modelPath);
                            deleteInfoRequest.onsuccess = () => {
                                db.close();
                                return reject(putModelRequest.error);
                            };
                            deleteInfoRequest.onerror = error => {
                                db.close();
                                return reject(putModelRequest.error);
                            };
                        };
                    };
                    putInfoRequest.onerror = error => {
                        db.close();
                        return reject(putInfoRequest.error);
                    };
                    infoTx.oncomplete = () => {
                        if (modelTx == null) {
                            db.close();
                        }
                        else {
                            modelTx.oncomplete = () => db.close();
                        }
                    };
                }
            };
            openRequest.onerror = error => reject(openRequest.error);
        });
    }
}
BrowserIndexedDB.URL_SCHEME = 'indexeddb://';
export const indexedDBRouter = (url) => {
    if (!env().getBool('IS_BROWSER')) {
        return null;
    }
    else {
        if (!Array.isArray(url) && url.startsWith(BrowserIndexedDB.URL_SCHEME)) {
            return browserIndexedDB(url.slice(BrowserIndexedDB.URL_SCHEME.length));
        }
        else {
            return null;
        }
    }
};
IORouterRegistry.registerSaveRouter(indexedDBRouter);
IORouterRegistry.registerLoadRouter(indexedDBRouter);
/**
 * Creates a browser IndexedDB IOHandler for saving and loading models.
 *
 * ```js
 * const model = tf.sequential();
 * model.add(
 *     tf.layers.dense({units: 1, inputShape: [100], activation: 'sigmoid'}));
 *
 * const saveResult = await model.save('indexeddb://MyModel'));
 * console.log(saveResult);
 * ```
 *
 * @param modelPath A unique identifier for the model to be saved. Must be a
 *   non-empty string.
 * @returns An instance of `BrowserIndexedDB` (sublcass of `IOHandler`),
 *   which can be used with, e.g., `tf.Model.save`.
 */
export function browserIndexedDB(modelPath) {
    return new BrowserIndexedDB(modelPath);
}
function maybeStripScheme(key) {
    return key.startsWith(BrowserIndexedDB.URL_SCHEME) ?
        key.slice(BrowserIndexedDB.URL_SCHEME.length) :
        key;
}
export class BrowserIndexedDBManager {
    constructor() {
        this.indexedDB = getIndexedDBFactory();
    }
    async listModels() {
        return new Promise((resolve, reject) => {
            const openRequest = this.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
            openRequest.onupgradeneeded = () => setUpDatabase(openRequest);
            openRequest.onsuccess = () => {
                const db = openRequest.result;
                const tx = db.transaction(INFO_STORE_NAME, 'readonly');
                const store = tx.objectStore(INFO_STORE_NAME);
                // tslint:disable:max-line-length
                // Need to cast `store` as `any` here because TypeScript's DOM
                // library does not have the `getAll()` method even though the
                // method is supported in the latest version of most mainstream
                // browsers:
                // https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/getAll
                // tslint:enable:max-line-length
                // tslint:disable-next-line:no-any
                const getAllInfoRequest = store.getAll();
                getAllInfoRequest.onsuccess = () => {
                    const out = {};
                    for (const item of getAllInfoRequest.result) {
                        out[item.modelPath] = item.modelArtifactsInfo;
                    }
                    resolve(out);
                };
                getAllInfoRequest.onerror = error => {
                    db.close();
                    return reject(getAllInfoRequest.error);
                };
                tx.oncomplete = () => db.close();
            };
            openRequest.onerror = error => reject(openRequest.error);
        });
    }
    async removeModel(path) {
        path = maybeStripScheme(path);
        return new Promise((resolve, reject) => {
            const openRequest = this.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
            openRequest.onupgradeneeded = () => setUpDatabase(openRequest);
            openRequest.onsuccess = () => {
                const db = openRequest.result;
                const infoTx = db.transaction(INFO_STORE_NAME, 'readwrite');
                const infoStore = infoTx.objectStore(INFO_STORE_NAME);
                const getInfoRequest = infoStore.get(path);
                let modelTx;
                getInfoRequest.onsuccess = () => {
                    if (getInfoRequest.result == null) {
                        db.close();
                        return reject(new Error(`Cannot find model with path '${path}' ` +
                            `in IndexedDB.`));
                    }
                    else {
                        // First, delete the entry in the info store.
                        const deleteInfoRequest = infoStore.delete(path);
                        const deleteModelData = () => {
                            // Second, delete the entry in the model store.
                            modelTx = db.transaction(MODEL_STORE_NAME, 'readwrite');
                            const modelStore = modelTx.objectStore(MODEL_STORE_NAME);
                            const deleteModelRequest = modelStore.delete(path);
                            deleteModelRequest.onsuccess = () => resolve(getInfoRequest.result.modelArtifactsInfo);
                            deleteModelRequest.onerror = error => reject(getInfoRequest.error);
                        };
                        // Proceed with deleting model data regardless of whether deletion
                        // of info data succeeds or not.
                        deleteInfoRequest.onsuccess = deleteModelData;
                        deleteInfoRequest.onerror = error => {
                            deleteModelData();
                            db.close();
                            return reject(getInfoRequest.error);
                        };
                    }
                };
                getInfoRequest.onerror = error => {
                    db.close();
                    return reject(getInfoRequest.error);
                };
                infoTx.oncomplete = () => {
                    if (modelTx == null) {
                        db.close();
                    }
                    else {
                        modelTx.oncomplete = () => db.close();
                    }
                };
            };
            openRequest.onerror = error => reject(openRequest.error);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhlZF9kYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvaW8vaW5kZXhlZF9kYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLFVBQVUsQ0FBQztBQUVsQixPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkMsT0FBTyxFQUFDLDRCQUE0QixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3hELE9BQU8sRUFBVyxnQkFBZ0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRzdELE1BQU0sYUFBYSxHQUFHLGNBQWMsQ0FBQztBQUNyQyxNQUFNLGdCQUFnQixHQUFHLENBQUMsQ0FBQztBQUUzQiwwRUFBMEU7QUFDMUUsK0VBQStFO0FBQy9FLDhFQUE4RTtBQUM5RSxNQUFNLGdCQUFnQixHQUFHLGNBQWMsQ0FBQztBQUN4Qyw4RUFBOEU7QUFDOUUsK0VBQStFO0FBQy9FLCtCQUErQjtBQUMvQixNQUFNLGVBQWUsR0FBRyxrQkFBa0IsQ0FBQztBQUUzQzs7R0FFRztBQUNILE1BQU0sQ0FBQyxLQUFLLFVBQVUsY0FBYztJQUNsQyxNQUFNLFVBQVUsR0FBRyxtQkFBbUIsRUFBRSxDQUFDO0lBRXpDLE9BQU8sSUFBSSxPQUFPLENBQU8sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDM0MsTUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMvRCxhQUFhLENBQUMsU0FBUyxHQUFHLEdBQUcsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzFDLGFBQWEsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsU0FBUyxtQkFBbUI7SUFDMUIsSUFBSSxD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QUMsRUFBRSxDQUNqQyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUNuQyxDQUFDLENBQUM7d0JBQ0Ysa0VBQWtFO3dCQUNsRSxnQ0FBZ0M7d0JBQ2hDLGlCQUFpQixDQUFDLFNBQVMsR0FBRyxlQUFlLENBQUM7d0JBQzlDLGlCQUFpQixDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsRUFBRTs0QkFDbEMsZUFBZSxFQUFFLENBQUM7NEJBQ2xCLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQzs0QkFDWCxPQUFPLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ3RDLENBQUMsQ0FBQztxQkFDSDtnQkFDSCxDQUFDLENBQUM7Z0JBQ0YsY0FBYyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsRUFBRTtvQkFDL0IsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUNYLE9BQU8sTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdEMsQ0FBQyxDQUFDO2dCQUVGLE1BQU0sQ0FBQyxVQUFVLEdBQUcsR0FBRyxFQUFFO29CQUN2QixJQUFJLE9BQU8sSUFBSSxJQUFJLEVBQUU7d0JBQ25CLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztxQkFDWjt5QkFBTTt3QkFDTCxPQUFPLENBQUMsVUFBVSxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztxQkFDdkM7Z0JBQ0gsQ0FBQyxDQUFDO1lBQ0osQ0FBQyxDQUFDO1lBQ0YsV0FBVyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAnLi4vZmxhZ3MnO1xuXG5pbXBvcnQge2Vudn0gZnJvbSAnLi4vZW52aXJvbm1lbnQnO1xuXG5pbXBvcnQge2dldE1vZGVsQXJ0aWZhY3RzSW5mb0ZvckpTT059IGZyb20gJy4vaW9fdXRpbHMnO1xuaW1wb3J0IHtJT1JvdXRlciwgSU9Sb3V0ZXJSZWdpc3RyeX0gZnJvbSAnLi9yb3V0ZXJfcmVnaXN0cnknO1xuaW1wb3J0IHtJT0hhbmRsZXIsIE1vZGVsQXJ0aWZhY3RzLCBNb2RlbEFydGlmYWN0c0luZm8sIE1vZGVsU3RvcmVNYW5hZ2VyLCBTYXZlUmVzdWx0fSBmcm9tICcuL3R5cGVzJztcblxuY29uc3QgREFUQUJBU0VfTkFNRSA9ICd0ZW5zb3JmbG93anMnO1xuY29uc3QgREFUQUJBU0VfVkVSU0lPTiA9IDE7XG5cbi8vIE1vZGVsIGRhdGEgYW5kIE1vZGVsQXJ0aWZhY3RzSW5mbyAobWV0YWRhdGEpIGFyZSBzdG9yZWQgaW4gdHdvIHNlcGFyYXRlXG4vLyBzdG9yZXMgZm9yIGVmZmljaWVudCBhY2Nlc3Mgb2YgdGhlIGxpc3Qgb2Ygc3RvcmVkIG1vZGVscyBhbmQgdGhlaXIgbWV0YWRhdGEuXG4vLyAxLiBUaGUgb2JqZWN0IHN0b3JlIGZvciBtb2RlbCBkYXRhOiB0b3BvbG9neSwgd2VpZ2h0cyBhbmQgd2VpZ2h0IG1hbmlmZXN0cy5cbmNvbnN0IE1PREVMX1NUT1JFX05BTUUgPSAnbW9kZWxzX3N0b3JlJztcbi8vIDIuIFRoZSBvYmplY3Qgc3RvcmUgZm9yIE1vZGVsQXJ0aWZhY3RzSW5mbywgaW5jbHVkaW5nIG1ldGEtaW5mb3JtYXRpb24gc3VjaFxuLy8gICAgYXMgdGhlIHR5cGUgb2YgdG9wb2xvZ3kgKEpTT04gdnMgYmluYXJ5KSwgYnl0ZSBzaXplIG9mIHRoZSB0b3BvbG9neSwgYnl0ZVxuLy8gICAgc2l6ZSBvZiB0aGUgd2VpZ2h0cywgZXRjLlxuY29uc3QgSU5GT19TVE9SRV9OQU1FID0gJ21vZGVsX2luZm9fc3RvcmUnO1xuXG4vKipcbiAqIERlbGV0ZSB0aGUgZW50aXJlIGRhdGFiYXNlIGZvciB0ZW5zb3JmbG93LmpzLCBpbmNsdWRpbmcgdGhlIG1vZGVscyBzdG9yZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZURhdGFiYXNlKCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBpZGJGYWN0b3J5ID0gZ2V0SW5kZXhlZERCRmFjdG9yeSgpO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgZGVsZXRlUmVxdWVzdCA9IGlkYkZhY3RvcnkuZGVsZXRlRGF0YWJhc2UoREFUQUJBU0VfTkFNRSk7XG4gICAgZGVsZXRlUmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiByZXNvbHZlKCk7XG4gICAgZGVsZXRlUmVxdWVzdC5vbmVycm9yID0gZXJyb3IgPT4gcmVqZWN0KGVycm9yKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldEluZGV4ZWREQkZhY3RvcnkoKTogSURCRmFjdG9yeSB7XG4gIGlmICghZW52KCkuZ2V0Qm9vbCgnSVNfQlJPV1NFUicpKSB7XG4gICAgLy8gVE9ETyhjYWlzKTogQWRkIG1vcmUgaW5mbyBhYm91dCB3aGF0IElPSGFuZGxlciBzdWJ0eXBlcyBhcmUgYXZhaWxhYmxlLlxuICAgIC8vICAgTWF5YmUgcG9pbnQgdG8gYSBkb2MgcGFnZSBvbiB0aGUgd2ViIGFuZC9vciBhdXRvbWF0aWNhbGx5IGRldGVybWluZVxuICAgIC8vICAgdGhlIGF2YWlsYWJsZSBJT0hhbmRsZXJzIGFuZCBwcmludCB0aGVtIGluIHRoZSBlcnJvciBtZXNzYWdlLlxuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0ZhaWxlZCB0byBvYnRhaW4gSW5kZXhlZERCIGZhY3RvcnkgYmVjYXVzZSB0aGUgY3VycmVudCBlbnZpcm9ubWVudCcgK1xuICAgICAgICAnaXMgbm90IGEgd2ViIGJyb3dzZXIuJyk7XG4gIH1cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICBjb25zdCB0aGVXaW5kb3c6IGFueSA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHdpbmRvdztcbiAgY29uc3QgZmFjdG9yeSA9IHRoZVdpbmRvdy5pbmRleGVkREIgfHwgdGhlV2luZG93Lm1vekluZGV4ZWREQiB8fFxuICAgICAgdGhlV2luZG93LndlYmtpdEluZGV4ZWREQiB8fCB0aGVXaW5kb3cubXNJbmRleGVkREIgfHxcbiAgICAgIHRoZVdpbmRvdy5zaGltSW5kZXhlZERCO1xuICBpZiAoZmFjdG9yeSA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIGN1cnJlbnQgYnJvd3NlciBkb2VzIG5vdCBhcHBlYXIgdG8gc3VwcG9ydCBJbmRleGVkREIuJyk7XG4gIH1cbiAgcmV0dXJuIGZhY3Rvcnk7XG59XG5cbmZ1bmN0aW9uIHNldFVwRGF0YWJhc2Uob3BlblJlcXVlc3Q6IElEQlJlcXVlc3QpIHtcbiAgY29uc3QgZGIgPSBvcGVuUmVxdWVzdC5yZXN1bHQgYXMgSURCRGF0YWJhc2U7XG4gIGRiLmNyZWF0ZU9iamVjdFN0b3JlKE1PREVMX1NUT1JFX05BTUUsIHtrZXlQYXRoOiAnbW9kZWxQYXRoJ30pO1xuICBkYi5jcmVhdGVPYmplY3RTdG9yZShJTkZPX1NUT1JFX05BTUUsIHtrZXlQYXRoOiAnbW9kZWxQYXRoJ30pO1xufVxuXG4vKipcbiAqIElPSGFuZGxlciBzdWJjbGFzczogQnJvd3NlciBJbmRleGVkREIuXG4gKlxuICogU2VlIHRoZSBkb2Mgc3RyaW5nIG9mIGBicm93c2VySW5kZXhlZERCYCBmb3IgbW9yZSBkZXRhaWxzLlxuICovXG5leHBvcnQgY2xhc3MgQnJvd3NlckluZGV4ZWREQiBpbXBsZW1lbnRzIElPSGFuZGxlciB7XG4gIHByb3RlY3RlZCByZWFkb25seSBpbmRleGVkREI6IElEQkZhY3Rvcnk7XG4gIHByb3RlY3RlZCByZWFkb25seSBtb2RlbFBhdGg6IHN0cmluZztcblxuICBzdGF0aWMgcmVhZG9ubHkgVVJMX1NDSEVNRSA9ICdpbmRleGVkZGI6Ly8nO1xuXG4gIGNvbnN0cnVjdG9yKG1vZGVsUGF0aDogc3RyaW5nKSB7XG4gICAgdGhpcy5pbmRleGVkREIgPSBnZXRJbmRleGVkREJGYWN0b3J5KCk7XG5cbiAgICBpZiAobW9kZWxQYXRoID09IG51bGwgfHwgIW1vZGVsUGF0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdGb3IgSW5kZXhlZERCLCBtb2RlbFBhdGggbXVzdCBub3QgYmUgbnVsbCwgdW5kZWZpbmVkIG9yIGVtcHR5LicpO1xuICAgIH1cbiAgICB0aGlzLm1vZGVsUGF0aCA9IG1vZGVsUGF0aDtcbiAgfVxuXG4gIGFzeW5jIHNhdmUobW9kZWxBcnRpZmFjdHM6IE1vZGVsQXJ0aWZhY3RzKTogUHJvbWlzZTxTYXZlUmVzdWx0PiB7XG4gICAgLy8gVE9ETyhjYWlzKTogU3VwcG9ydCBzYXZpbmcgR3JhcGhEZWYgbW9kZWxzLlxuICAgIGlmIChtb2RlbEFydGlmYWN0cy5tb2RlbFRvcG9sb2d5IGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnQnJvd3NlckxvY2FsU3RvcmFnZS5zYXZlKCkgZG9lcyBub3Qgc3VwcG9ydCBzYXZpbmcgbW9kZWwgdG9wb2xvZ3kgJyArXG4gICAgICAgICAgJ2luIGJpbmFyeSBmb3JtYXRzIHlldC4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5kYXRhYmFzZUFjdGlvbih0aGlzLm1vZGVsUGF0aCwgbW9kZWxBcnRpZmFjdHMpIGFzXG4gICAgICAgIFByb21pc2U8U2F2ZVJlc3VsdD47XG4gIH1cblxuICBhc3luYyBsb2FkKCk6IFByb21pc2U8TW9kZWxBcnRpZmFjdHM+IHtcbiAgICByZXR1cm4gdGhpcy5kYXRhYmFzZUFjdGlvbih0aGlzLm1vZGVsUGF0aCkgYXMgUHJvbWlzZTxNb2RlbEFydGlmYWN0cz47XG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybSBkYXRhYmFzZSBhY3Rpb24gdG8gcHV0IG1vZGVsIGFydGlmYWN0cyBpbnRvIG9yIHJlYWQgbW9kZWwgYXJ0aWZhY3RzXG4gICAqIGZyb20gSW5kZXhlZERCIG9iamVjdCBzdG9yZS5cbiAgICpcbiAgICogV2hldGhlciB0aGUgYWN0aW9uIGlzIHB1dCBvciBnZXQgZGVwZW5kcyBvbiB3aGV0aGVyIGBtb2RlbEFydGlmYWN0c2AgaXNcbiAgICogc3BlY2lmaWVkLiBJZiBpdCBpcyBzcGVjaWZpZWQsIHRoZSBhY3Rpb24gd2lsbCBiZSBwdXQ7IG90aGVyd2lzZSB0aGUgYWN0aW9uXG4gICAqIHdpbGwgYmUgZ2V0LlxuICAgKlxuICAgKiBAcGFyYW0gbW9kZWxQYXRoIEEgdW5pcXVlIHN0cmluZyBwYXRoIGZvciB0aGUgbW9kZWwuXG4gICAqIEBwYXJhbSBtb2RlbEFydGlmYWN0cyBJZiBzcGVjaWZpZWQsIGl0IHdpbGwgYmUgdGhlIG1vZGVsIGFydGlmYWN0cyB0byBiZVxuICAgKiAgIHN0b3JlZCBpbiBJbmRleGVkREIuXG4gICAqIEByZXR1cm5zIEEgYFByb21pc2VgIG9mIGBTYXZlUmVzdWx0YCwgaWYgdGhlIGFjdGlvbiBpcyBwdXQsIG9yIGEgYFByb21pc2VgXG4gICAqICAgb2YgYE1vZGVsQXJ0aWZhY3RzYCwgaWYgdGhlIGFjdGlvbiBpcyBnZXQuXG4gICAqL1xuICBwcml2YXRlIGRhdGFiYXNlQWN0aW9uKG1vZGVsUGF0aDogc3RyaW5nLCBtb2RlbEFydGlmYWN0cz86IE1vZGVsQXJ0aWZhY3RzKTpcbiAgICAgIFByb21pc2U8TW9kZWxBcnRpZmFjdHN8U2F2ZVJlc3VsdD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxNb2RlbEFydGlmYWN0c3xTYXZlUmVzdWx0PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBvcGVuUmVxdWVzdCA9IHRoaXMuaW5kZXhlZERCLm9wZW4oREFUQUJBU0VfTkFNRSwgREFUQUJBU0VfVkVSU0lPTik7XG4gICAgICBvcGVuUmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSAoKSA9PiBzZXRVcERhdGFiYXNlKG9wZW5SZXF1ZXN0KTtcblxuICAgICAgb3BlblJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBkYiA9IG9wZW5SZXF1ZXN0LnJlc3VsdDtcblxuICAgICAgICBpZiAobW9kZWxBcnRpZmFjdHMgPT0gbnVsbCkge1xuICAgICAgICAgIC8vIFJlYWQgbW9kZWwgb3V0IGZyb20gb2JqZWN0IHN0b3JlLlxuICAgICAgICAgIGNvbnN0IG1vZGVsVHggPSBkYi50cmFuc2FjdGlvbihNT0RFTF9TVE9SRV9OQU1FLCAncmVhZG9ubHknKTtcbiAgICAgICAgICBjb25zdCBtb2RlbFN0b3JlID0gbW9kZWxUeC5vYmplY3RTdG9yZShNT0RFTF9TVE9SRV9OQU1FKTtcbiAgICAgICAgICBjb25zdCBnZXRSZXF1ZXN0ID0gbW9kZWxTdG9yZS5nZXQodGhpcy5tb2RlbFBhdGgpO1xuICAgICAgICAgIGdldFJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGdldFJlcXVlc3QucmVzdWx0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICBgQ2Fubm90IGZpbmQgbW9kZWwgd2l0aCBwYXRoICcke3RoaXMubW9kZWxQYXRofScgYCArXG4gICAgICAgICAgICAgICAgICBgaW4gSW5kZXhlZERCLmApKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc29sdmUoZ2V0UmVxdWVzdC5yZXN1bHQubW9kZWxBcnRpZmFjdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgZ2V0UmVxdWVzdC5vbmVycm9yID0gZXJyb3IgPT4ge1xuICAgICAgICAgICAgZGIuY2xvc2UoKTtcbiAgICAgICAgICAgIHJldHVybiByZWplY3QoZ2V0UmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgfTtcbiAgICAgICAgICBtb2RlbFR4Lm9uY29tcGxldGUgPSAoKSA9PiBkYi5jbG9zZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFB1dCBtb2RlbCBpbnRvIG9iamVjdCBzdG9yZS5cbiAgICAgICAgICBjb25zdCBtb2RlbEFydGlmYWN0c0luZm86IE1vZGVsQXJ0aWZhY3RzSW5mbyA9XG4gICAgICAgICAgICAgIGdldE1vZGVsQXJ0aWZhY3RzSW5mb0ZvckpTT04obW9kZWxBcnRpZmFjdHMpO1xuICAgICAgICAgIC8vIEZpcnN0LCBwdXQgTW9kZWxBcnRpZmFjdHNJbmZvIGludG8gaW5mbyBzdG9yZS5cbiAgICAgICAgICBjb25zdCBpbmZvVHggPSBkYi50cmFuc2FjdGlvbihJTkZPX1NUT1JFX05BTUUsICdyZWFkd3JpdGUnKTtcbiAgICAgICAgICBsZXQgaW5mb1N0b3JlID0gaW5mb1R4Lm9iamVjdFN0b3JlKElORk9fU1RPUkVfTkFNRSk7XG4gICAgICAgICAgY29uc3QgcHV0SW5mb1JlcXVlc3QgPVxuICAgICAgICAgICAgICBpbmZvU3RvcmUucHV0KHttb2RlbFBhdGg6IHRoaXMubW9kZWxQYXRoLCBtb2RlbEFydGlmYWN0c0luZm99KTtcbiAgICAgICAgICBsZXQgbW9kZWxUeDogSURCVHJhbnNhY3Rpb247XG4gICAgICAgICAgcHV0SW5mb1JlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICAgICAgLy8gU2Vjb25kLCBwdXQgbW9kZWwgZGF0YSBpbnRvIG1vZGVsIHN0b3JlLlxuICAgICAgICAgICAgbW9kZWxUeCA9IGRiLnRyYW5zYWN0aW9uKE1PREVMX1NUT1JFX05BTUUsICdyZWFkd3JpdGUnKTtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsU3RvcmUgPSBtb2RlbFR4Lm9iamVjdFN0b3JlKE1PREVMX1NUT1JFX05BTUUpO1xuICAgICAgICAgICAgY29uc3QgcHV0TW9kZWxSZXF1ZXN0ID0gbW9kZWxTdG9yZS5wdXQoe1xuICAgICAgICAgICAgICBtb2RlbFBhdGg6IHRoaXMubW9kZWxQYXRoLFxuICAgICAgICAgICAgICBtb2RlbEFydGlmYWN0cyxcbiAgICAgICAgICAgICAgbW9kZWxBcnRpZmFjdHNJbmZvXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHB1dE1vZGVsUmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiByZXNvbHZlKHttb2RlbEFydGlmYWN0c0luZm99KTtcbiAgICAgICAgICAgIHB1dE1vZGVsUmVxdWVzdC5vbmVycm9yID0gZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAvLyBJZiB0aGUgcHV0LW1vZGVsIHJlcXVlc3QgZmFpbHMsIHJvbGwgYmFjayB0aGUgaW5mbyBlbnRyeSBhc1xuICAgICAgICAgICAgICAvLyB3ZWxsLlxuICAgICAgICAgICAgICBpbmZvU3RvcmUgPSBpbmZvVHgub2JqZWN0U3RvcmUoSU5GT19TVE9SRV9OQU1FKTtcbiAgICAgICAgICAgICAgY29uc3QgZGVsZXRlSW5mb1JlcXVlc3QgPSBpbmZvU3RvcmUuZGVsZXRlKHRoaXMubW9kZWxQYXRoKTtcbiAgICAgICAgICAgICAgZGVsZXRlSW5mb1JlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRiLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChwdXRNb2RlbFJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBkZWxldGVJbmZvUmVxdWVzdC5vbmVycm9yID0gZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgIGRiLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChwdXRNb2RlbFJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIHB1dEluZm9SZXF1ZXN0Lm9uZXJyb3IgPSBlcnJvciA9PiB7XG4gICAgICAgICAgICBkYi5jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChwdXRJbmZvUmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgfTtcbiAgICAgICAgICBpbmZvVHgub25jb21wbGV0ZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChtb2RlbFR4ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG1vZGVsVHgub25jb21wbGV0ZSA9ICgpID0+IGRiLmNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIG9wZW5SZXF1ZXN0Lm9uZXJyb3IgPSBlcnJvciA9PiByZWplY3Qob3BlblJlcXVlc3QuZXJyb3IpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBpbmRleGVkREJSb3V0ZXI6IElPUm91dGVyID0gKHVybDogc3RyaW5nfHN0cmluZ1tdKSA9PiB7XG4gIGlmICghZW52KCkuZ2V0Qm9vbCgnSVNfQlJPV1NFUicpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHVybCkgJiYgdXJsLnN0YXJ0c1dpdGgoQnJvd3NlckluZGV4ZWREQi5VUkxfU0NIRU1FKSkge1xuICAgICAgcmV0dXJuIGJyb3dzZXJJbmRleGVkREIodXJsLnNsaWNlKEJyb3dzZXJJbmRleGVkREIuVVJMX1NDSEVNRS5sZW5ndGgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG59O1xuSU9Sb3V0ZXJSZWdpc3RyeS5yZWdpc3RlclNhdmVSb3V0ZXIoaW5kZXhlZERCUm91dGVyKTtcbklPUm91dGVyUmVnaXN0cnkucmVnaXN0ZXJMb2FkUm91dGVyKGluZGV4ZWREQlJvdXRlcik7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGJyb3dzZXIgSW5kZXhlZERCIElPSGFuZGxlciBmb3Igc2F2aW5nIGFuZCBsb2FkaW5nIG1vZGVscy5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgbW9kZWwgPSB0Zi5zZXF1ZW50aWFsKCk7XG4gKiBtb2RlbC5hZGQoXG4gKiAgICAgdGYubGF5ZXJzLmRlbnNlKHt1bml0czogMSwgaW5wdXRTaGFwZTogWzEwMF0sIGFjdGl2YXRpb246ICdzaWdtb2lkJ30pKTtcbiAqXG4gKiBjb25zdCBzYXZlUmVzdWx0ID0gYXdhaXQgbW9kZWwuc2F2ZSgnaW5kZXhlZGRiOi8vTXlNb2RlbCcpKTtcbiAqIGNvbnNvbGUubG9nKHNhdmVSZXN1bHQpO1xuICogYGBgXG4gKlxuICogQHBhcmFtIG1vZGVsUGF0aCBBIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgbW9kZWwgdG8gYmUgc2F2ZWQuIE11c3QgYmUgYVxuICogICBub24tZW1wdHkgc3RyaW5nLlxuICogQHJldHVybnMgQW4gaW5zdGFuY2Ugb2YgYEJyb3dzZXJJbmRleGVkREJgIChzdWJsY2FzcyBvZiBgSU9IYW5kbGVyYCksXG4gKiAgIHdoaWNoIGNhbiBiZSB1c2VkIHdpdGgsIGUuZy4sIGB0Zi5Nb2RlbC5zYXZlYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJyb3dzZXJJbmRleGVkREIobW9kZWxQYXRoOiBzdHJpbmcpOiBJT0hhbmRsZXIge1xuICByZXR1cm4gbmV3IEJyb3dzZXJJbmRleGVkREIobW9kZWxQYXRoKTtcbn1cblxuZnVuY3Rpb24gbWF5YmVTdHJpcFNjaGVtZShrZXk6IHN0cmluZykge1xuICByZXR1cm4ga2V5LnN0YXJ0c1dpdGgoQnJvd3NlckluZGV4ZWREQi5VUkxfU0NIRU1FKSA/XG4gICAgICBrZXkuc2xpY2UoQnJvd3NlckluZGV4ZWREQi5VUkxfU0NIRU1FLmxlbmd0aCkgOlxuICAgICAga2V5O1xufVxuXG5leHBvcnQgY2xhc3MgQnJvd3NlckluZGV4ZWREQk1hbmFnZXIgaW1wbGVtZW50cyBNb2RlbFN0b3JlTWFuYWdlciB7XG4gIHByaXZhdGUgaW5kZXhlZERCOiBJREJGYWN0b3J5O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaW5kZXhlZERCID0gZ2V0SW5kZXhlZERCRmFjdG9yeSgpO1xuICB9XG5cbiAgYXN5bmMgbGlzdE1vZGVscygpOiBQcm9taXNlPHtbcGF0aDogc3RyaW5nXTogTW9kZWxBcnRpZmFjdHNJbmZvfT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTx7W3BhdGg6IHN0cmluZ106IE1vZGVsQXJ0aWZhY3RzSW5mb30+KFxuICAgICAgICAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgY29uc3Qgb3BlblJlcXVlc3QgPVxuICAgICAgICAgICAgICB0aGlzLmluZGV4ZWREQi5vcGVuKERBVEFCQVNFX05BTUUsIERBVEFCQVNFX1ZFUlNJT04pO1xuICAgICAgICAgIG9wZW5SZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9ICgpID0+IHNldFVwRGF0YWJhc2Uob3BlblJlcXVlc3QpO1xuXG4gICAgICAgICAgb3BlblJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGIgPSBvcGVuUmVxdWVzdC5yZXN1bHQ7XG4gICAgICAgICAgICBjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKElORk9fU1RPUkVfTkFNRSwgJ3JlYWRvbmx5Jyk7XG4gICAgICAgICAgICBjb25zdCBzdG9yZSA9IHR4Lm9iamVjdFN0b3JlKElORk9fU1RPUkVfTkFNRSk7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgICAgIC8vIE5lZWQgdG8gY2FzdCBgc3RvcmVgIGFzIGBhbnlgIGhlcmUgYmVjYXVzZSBUeXBlU2NyaXB0J3MgRE9NXG4gICAgICAgICAgICAvLyBsaWJyYXJ5IGRvZXMgbm90IGhhdmUgdGhlIGBnZXRBbGwoKWAgbWV0aG9kIGV2ZW4gdGhvdWdoIHRoZVxuICAgICAgICAgICAgLy8gbWV0aG9kIGlzIHN1cHBvcnRlZCBpbiB0aGUgbGF0ZXN0IHZlcnNpb24gb2YgbW9zdCBtYWluc3RyZWFtXG4gICAgICAgICAgICAvLyBicm93c2VyczpcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9JREJPYmplY3RTdG9yZS9nZXRBbGxcbiAgICAgICAgICAgIC8vIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgICAgICAgICBjb25zdCBnZXRBbGxJbmZvUmVxdWVzdCA9IChzdG9yZSBhcyBhbnkpLmdldEFsbCgpIGFzIElEQlJlcXVlc3Q7XG4gICAgICAgICAgICBnZXRBbGxJbmZvUmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IG91dDoge1twYXRoOiBzdHJpbmddOiBNb2RlbEFydGlmYWN0c0luZm99ID0ge307XG4gICAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBnZXRBbGxJbmZvUmVxdWVzdC5yZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBvdXRbaXRlbS5tb2RlbFBhdGhdID0gaXRlbS5tb2RlbEFydGlmYWN0c0luZm87XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVzb2x2ZShvdXQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGdldEFsbEluZm9SZXF1ZXN0Lm9uZXJyb3IgPSBlcnJvciA9PiB7XG4gICAgICAgICAgICAgIGRiLmNsb3NlKCk7XG4gICAgICAgICAgICAgIHJldHVybiByZWplY3QoZ2V0QWxsSW5mb1JlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHR4Lm9uY29tcGxldGUgPSAoKSA9PiBkYi5jbG9zZSgpO1xuICAgICAgICAgIH07XG4gICAgICAgICAgb3BlblJlcXVlc3Qub25lcnJvciA9IGVycm9yID0+IHJlamVjdChvcGVuUmVxdWVzdC5lcnJvcik7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgcmVtb3ZlTW9kZWwocGF0aDogc3RyaW5nKTogUHJvbWlzZTxNb2RlbEFydGlmYWN0c0luZm8+IHtcbiAgICBwYXRoID0gbWF5YmVTdHJpcFNjaGVtZShwYXRoKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8TW9kZWxBcnRpZmFjdHNJbmZvPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBvcGVuUmVxdWVzdCA9IHRoaXMuaW5kZXhlZERCLm9wZW4oREFUQUJBU0VfTkFNRSwgREFUQUJBU0VfVkVSU0lPTik7XG4gICAgICBvcGVuUmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSAoKSA9PiBzZXRVcERhdGFiYXNlKG9wZW5SZXF1ZXN0KTtcblxuICAgICAgb3BlblJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBkYiA9IG9wZW5SZXF1ZXN0LnJlc3VsdDtcbiAgICAgICAgY29uc3QgaW5mb1R4ID0gZGIudHJhbnNhY3Rpb24oSU5GT19TVE9SRV9OQU1FLCAncmVhZHdyaXRlJyk7XG4gICAgICAgIGNvbnN0IGluZm9TdG9yZSA9IGluZm9UeC5vYmplY3RTdG9yZShJTkZPX1NUT1JFX05BTUUpO1xuXG4gICAgICAgIGNvbnN0IGdldEluZm9SZXF1ZXN0ID0gaW5mb1N0b3JlLmdldChwYXRoKTtcbiAgICAgICAgbGV0IG1vZGVsVHg6IElEQlRyYW5zYWN0aW9uO1xuICAgICAgICBnZXRJbmZvUmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgICAgaWYgKGdldEluZm9SZXF1ZXN0LnJlc3VsdCA9PSBudWxsKSB7XG4gICAgICAgICAgICBkYi5jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgYENhbm5vdCBmaW5kIG1vZGVsIHdpdGggcGF0aCAnJHtwYXRofScgYCArXG4gICAgICAgICAgICAgICAgYGluIEluZGV4ZWREQi5gKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEZpcnN0LCBkZWxldGUgdGhlIGVudHJ5IGluIHRoZSBpbmZvIHN0b3JlLlxuICAgICAgICAgICAgY29uc3QgZGVsZXRlSW5mb1JlcXVlc3QgPSBpbmZvU3RvcmUuZGVsZXRlKHBhdGgpO1xuICAgICAgICAgICAgY29uc3QgZGVsZXRlTW9kZWxEYXRhID0gKCkgPT4ge1xuICAgICAgICAgICAgICAvLyBTZWNvbmQsIGRlbGV0ZSB0aGUgZW50cnkgaW4gdGhlIG1vZGVsIHN0b3JlLlxuICAgICAgICAgICAgICBtb2RlbFR4ID0gZGIudHJhbnNhY3Rpb24oTU9ERUxfU1RPUkVfTkFNRSwgJ3JlYWR3cml0ZScpO1xuICAgICAgICAgICAgICBjb25zdCBtb2RlbFN0b3JlID0gbW9kZWxUeC5vYmplY3RTdG9yZShNT0RFTF9TVE9SRV9OQU1FKTtcbiAgICAgICAgICAgICAgY29uc3QgZGVsZXRlTW9kZWxSZXF1ZXN0ID0gbW9kZWxTdG9yZS5kZWxldGUocGF0aCk7XG4gICAgICAgICAgICAgIGRlbGV0ZU1vZGVsUmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PlxuICAgICAgICAgICAgICAgICAgcmVzb2x2ZShnZXRJbmZvUmVxdWVzdC5yZXN1bHQubW9kZWxBcnRpZmFjdHNJbmZvKTtcbiAgICAgICAgICAgICAgZGVsZXRlTW9kZWxSZXF1ZXN0Lm9uZXJyb3IgPSBlcnJvciA9PlxuICAgICAgICAgICAgICAgICAgcmVqZWN0KGdldEluZm9SZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBQcm9jZWVkIHdpdGggZGVsZXRpbmcgbW9kZWwgZGF0YSByZWdhcmRsZXNzIG9mIHdoZXRoZXIgZGVsZXRpb25cbiAgICAgICAgICAgIC8vIG9mIGluZm8gZGF0YSBzdWNjZWVkcyBvciBub3QuXG4gICAgICAgICAgICBkZWxldGVJbmZvUmVxdWVzdC5vbnN1Y2Nlc3MgPSBkZWxldGVNb2RlbERhdGE7XG4gICAgICAgICAgICBkZWxldGVJbmZvUmVxdWVzdC5vbmVycm9yID0gZXJyb3IgPT4ge1xuICAgICAgICAgICAgICBkZWxldGVNb2RlbERhdGEoKTtcbiAgICAgICAgICAgICAgZGIuY2xvc2UoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChnZXRJbmZvUmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgZ2V0SW5mb1JlcXVlc3Qub25lcnJvciA9IGVycm9yID0+IHtcbiAgICAgICAgICBkYi5jbG9zZSgpO1xuICAgICAgICAgIHJldHVybiByZWplY3QoZ2V0SW5mb1JlcXVlc3QuZXJyb3IpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGluZm9UeC5vbmNvbXBsZXRlID0gKCkgPT4ge1xuICAgICAgICAgIGlmIChtb2RlbFR4ID09IG51bGwpIHtcbiAgICAgICAgICAgIGRiLmNsb3NlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1vZGVsVHgub25jb21wbGV0ZSA9ICgpID0+IGRiLmNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfTtcbiAgICAgIG9wZW5SZXF1ZXN0Lm9uZXJyb3IgPSBlcnJvciA9PiByZWplY3Qob3BlblJlcXVlc3QuZXJyb3IpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=