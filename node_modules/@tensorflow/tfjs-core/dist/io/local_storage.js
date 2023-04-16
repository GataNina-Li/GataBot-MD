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
import { assert } from '../util';
import { arrayBufferToBase64String, base64StringToArrayBuffer, getModelArtifactsInfoForJSON } from './io_utils';
import { IORouterRegistry } from './router_registry';
const PATH_SEPARATOR = '/';
const PATH_PREFIX = 'tensorflowjs_models';
const INFO_SUFFIX = 'info';
const MODEL_TOPOLOGY_SUFFIX = 'model_topology';
const WEIGHT_SPECS_SUFFIX = 'weight_specs';
const WEIGHT_DATA_SUFFIX = 'weight_data';
const MODEL_METADATA_SUFFIX = 'model_metadata';
/**
 * Purge all tensorflow.js-saved model artifacts from local storage.
 *
 * @returns Paths of the models purged.
 */
export function purgeLocalStorageArtifacts() {
    if (!env().getBool('IS_BROWSER') || typeof window === 'undefined' ||
        typeof window.localStorage === 'undefined') {
        throw new Error('purgeLocalStorageModels() cannot proceed because local storage is ' +
            'unavailable in the current environment.');
    }
    const LS = window.localStorage;
    const purgedModelPaths = [];
    for (let i = 0; i < LS.length; ++i) {
        const key = LS.key(i);
        const prefix = PATH_PREFIX + PATH_SEPARATOR;
        if (key.startsWith(prefix) && key.length > prefix.length) {
            LS.removeItem(key);
            const modelName = getModelPathFromKey(key);
            if (purgedModelPaths.indexOf(modelName) === -1) {
                purgedModelPaths.push(modelName);
            }
        }
    }
    return purgedModelPaths;
}
function getModelKeys(path) {
    return {
        info: [PATH_PREFIX, path, INFO_SUFFIX].join(PATH_SEPARATOR),
        topology: [PATH_PREFIX, path, MODEL_TOPOLOGY_SUFFIX].join(PATH_SEPARATOR),
        weightSpecs: [PATH_PREFIX, path, WEIGHT_SPECS_SUFFIX].join(PATH_SEPARATOR),
        weightData: [PATH_PREFIX, path, WEIGHT_DATA_SUFFIX].join(PATH_SEPARATOR),
        modelMetadata: [PATH_PREFIX, path, MODEL_METADATA_SUFFIX].join(PATH_SEPARATOR)
    };
}
function removeItems(keys) {
    for (const key of Object.values(keys)) {
        window.localStorage.removeItem(key);
    }
}
/**
 * Get model path from a local-storage key.
 *
 * E.g., 'tensorflowjs_models/my/model/1/info' --> 'my/model/1'
 *
 * @param key
 */
function getModelPathFromKey(key) {
    const items = key.split(PATH_SEPARATOR);
    if (items.length < 3) {
        throw new Error(`Invalid key format: ${key}`);
    }
    return items.slice(1, items.length - 1).join(PATH_SEPARATOR);
}
function maybeStripScheme(key) {
    return key.startsWith(BrowserLocalStorage.URL_SCHEME) ?
        key.slice(BrowserLocalStorage.URL_SCHEME.length) :
        key;
}
/**
 * IOHandler subclass: Browser Local Storage.
 *
 * See the doc string to `browserLocalStorage` for more details.
 */
export class BrowserLocalStorage {
    constructor(modelPath) {
        if (!env().getBool('IS_BROWSER') || typeof window === 'undefined' ||
            typeof window.localStorage === 'undefined') {
            // TODO(cais): Add more info about what IOHandler subtypes are
            // available.
            //   Maybe point to a doc page on the web and/or automatically determine
            //   the available IOHandlers and print them in the error message.
            throw new Error('The current environment does not support local storage.');
        }
        this.LS = window.localStorage;
        if (modelPath == null || !modelPath) {
            throw new Error('For local storage, modelPath must not be null, undefined or empty.');
        }
        this.modelPath = modelPath;
        this.keys = getModelKeys(this.modelPath);
    }
    /**
     * Save model artifacts to browser local storage.
     *
     * See the documentation to `browserLocalStorage` for details on the saved
     * artifacts.
     *
     * @param modelArtifacts The model artifacts to be stored.
     * @returns An instance of SaveResult.
     */
    async save(modelArtifacts) {
        if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
            throw new Error('BrowserLocalStorage.save() does not support saving model topology ' +
                'in binary formats yet.');
        }
        else {
            const topology = JSON.stringify(modelArtifacts.modelTopology);
            const weightSpecs = JSON.stringify(modelArtifacts.weightSpecs);
            const modelArtifactsInfo = getModelArtifactsInfoForJSON(modelArtifacts);
            try {
                this.LS.setItem(this.keys.info, JSON.stringify(modelArtifactsInfo));
                this.LS.setItem(this.keys.topology, topology);
                this.LS.setItem(this.keys.weightSpecs, weightSpecs);
                this.LS.setItem(this.keys.weightData, arrayBufferToBase64String(modelArtifacts.weightData));
                // Note that JSON.stringify doesn't write out keys that have undefined
                // values, so for some keys, we set undefined instead of a null-ish
                // value.
                const metadata = {
                    format: modelArtifacts.format,
                    generatedBy: modelArtifacts.generatedBy,
                    convertedBy: modelArtifacts.convertedBy,
                    signature: modelArtifacts.signature != null ?
                        modelArtifacts.signature :
                        undefined,
                    userDefinedMetadata: modelArtifacts.userDefinedMetadata != null ?
                        modelArtifacts.userDefinedMetadata :
                        undefined,
                    modelInitializer: modelArtifacts.modelInitializer != null ?
                        modelArtifacts.modelInitializer :
                        undefined,
                    trainingConfig: modelArtifacts.trainingConfig != null ?
                        modelArtifacts.trainingConfig :
                        undefined
                };
                this.LS.setItem(this.keys.modelMetadata, JSON.stringify(metadata));
                return { modelArtifactsInfo };
            }
            catch (err) {
                // If saving failed, clean up all items saved so far.
                removeItems(this.keys);
                throw new Error(`Failed to save model '${this.modelPath}' to local storage: ` +
                    `size quota being exceeded is a possible cause of this failure: ` +
                    `modelTopologyBytes=${modelArtifactsInfo.modelTopologyBytes}, ` +
                    `weightSpecsBytes=${modelArtifactsInfo.weightSpecsBytes}, ` +
                    `weightDataBytes=${modelArtifactsInfo.weightDataBytes}.`);
            }
        }
    }
    /**
     * Load a model from local storage.
     *
     * See the documentation to `browserLocalStorage` for details on the saved
     * artifacts.
     *
     * @returns The loaded model (if loading succeeds).
     */
    async load() {
        const info = JSON.parse(this.LS.getItem(this.keys.info));
        if (info == null) {
            throw new Error(`In local storage, there is no model with name '${this.modelPath}'`);
        }
        if (info.modelTopologyType !== 'JSON') {
            throw new Error('BrowserLocalStorage does not support loading non-JSON model ' +
                'topology yet.');
        }
        const out = {};
        // Load topology.
        const topology = JSON.parse(this.LS.getItem(this.keys.topology));
        if (topology == null) {
            throw new Error(`In local storage, the topology of model '${this.modelPath}' ` +
                `is missing.`);
        }
        out.modelTopology = topology;
        // Load weight specs.
        const weightSpecs = JSON.parse(this.LS.getItem(this.keys.weightSpecs));
        if (weightSpecs == null) {
            throw new Error(`In local storage, the weight specs of model '${this.modelPath}' ` +
                `are missing.`);
        }
        out.weightSpecs = weightSpecs;
        // Load meta-data fields.
        const metadataString = this.LS.getItem(this.keys.modelMetadata);
        if (metadataString != null) {
            const metadata = JSON.parse(metadataString);
            out.format = metadata.format;
            out.generatedBy = metadata.generatedBy;
            out.convertedBy = metadata.convertedBy;
            if (metadata.signature != null) {
                out.signature = metadata.signature;
            }
            if (metadata.userDefinedMetadata != null) {
                out.userDefinedMetadata = metadata.userDefinedMetadata;
            }
            if (metadata.modelInitializer != null) {
                out.modelInitializer = metadata.modelInitializer;
            }
            if (metadata.trainingConfig != null) {
                out.trainingConfig = metadata.trainingConfig;
            }
        }
        // Load weight data.
        const weightDataBase64 = this.LS.getItem(this.keys.weightData);
        if (weightDataBase64 == null) {
            throw new Error(`In local storage, the binary weight values of model ` +
                `'${this.modelPath}' are missing.`);
        }
        out.weightData = base64StringToArrayBuffer(weightDataBase64);
        return out;
    }
}
BrowserLocalStorage.URL_SCHEME = 'localstorage://';
export const localStorageRouter = (url) => {
    if (!env().getBool('IS_BROWSER')) {
        return null;
    }
    else {
        if (!Array.isArray(url) && url.startsWith(BrowserLocalStorage.URL_SCHEME)) {
            return browserLocalStorage(url.slice(BrowserLocalStorage.URL_SCHEME.length));
        }
        else {
            return null;
        }
    }
};
IORouterRegistry.registerSaveRouter(localStorageRouter);
IORouterRegistry.registerLoadRouter(localStorageRouter);
/**
 * Factory function for local storage IOHandler.
 *
 * This `IOHandler` supports both `save` and `load`.
 *
 * For each model's saved artifacts, four items are saved to local storage.
 *   - `${PATH_SEPARATOR}/${modelPath}/info`: Contains meta-info about the
 *     model, such as date saved, type of the topology, size in bytes, etc.
 *   - `${PATH_SEPARATOR}/${modelPath}/topology`: Model topology. For Keras-
 *     style models, this is a stringized JSON.
 *   - `${PATH_SEPARATOR}/${modelPath}/weight_specs`: Weight specs of the
 *     model, can be used to decode the saved binary weight values (see
 *     item below).
 *   - `${PATH_SEPARATOR}/${modelPath}/weight_data`: Concatenated binary
 *     weight values, stored as a base64-encoded string.
 *
 * Saving may throw an `Error` if the total size of the artifacts exceed the
 * browser-specific quota.
 *
 * @param modelPath A unique identifier for the model to be saved. Must be a
 *   non-empty string.
 * @returns An instance of `IOHandler`, which can be used with, e.g.,
 *   `tf.Model.save`.
 */
export function browserLocalStorage(modelPath) {
    return new BrowserLocalStorage(modelPath);
}
export class BrowserLocalStorageManager {
    constructor() {
        assert(env().getBool('IS_BROWSER'), () => 'Current environment is not a web browser');
        assert(typeof window === 'undefined' ||
            typeof window.localStorage !== 'undefined', () => 'Current browser does not appear to support localStorage');
        this.LS = window.localStorage;
    }
    async listModels() {
        const out = {};
        const prefix = PATH_PREFIX + PATH_SEPARATOR;
        const suffix = PATH_SEPARATOR + INFO_SUFFIX;
        for (let i = 0; i < this.LS.length; ++i) {
            const key = this.LS.key(i);
            if (key.startsWith(prefix) && key.endsWith(suffix)) {
                const modelPath = getModelPathFromKey(key);
                out[modelPath] = JSON.parse(this.LS.getItem(key));
            }
        }
        return out;
    }
    async removeModel(path) {
        path = maybeStripScheme(path);
        const keys = getModelKeys(path);
        if (this.LS.getItem(keys.info) == null) {
            throw new Error(`Cannot find model at path '${path}'`);
        }
        const info = JSON.parse(this.LS.getItem(keys.info));
        removeItems(keys);
        return info;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxfc3RvcmFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvaW8vbG9jYWxfc3RvcmFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLFVBQVUsQ0FBQztBQUNsQixPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUMvQixPQUFPLEVBQUMseUJBQXlCLEVBQUUseUJBQXlCLEVBQUUsNEJBQTRCLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDOUcsT0FBTyxFQUFXLGdCQUFnQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFHN0QsTUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDO0FBQzNCLE1BQU0sV0FBVyxHQUFHLHFCQUFxQixDQUFDO0FBQzFDLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQztBQUMzQixNQUFNLHFCQUFxQixHQUFHLGdCQUFnQixDQUFDO0FBQy9DLE1BQU0sbUJBQW1CLEdBQUcsY0FBYyxDQUFDO0FBQzNDLE1BQU0sa0JBQWtCLEdBQUcsYUFBYSxDQUFDO0FBQ3pDLE1BQU0scUJBQXFCLEdBQUcsZ0JBQWdCLENBQUM7QUFFL0M7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSwwQkFBMEI7SUFDeEMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXO1FBQzdELE9BQU8sTUFBTSxDQUFDLFlBQVksS0FBSyxXQUFXLEVBQUU7UUFDOUMsTUFBTSxJQUFJLEtBQUssQ0FDWCxvRUFBb0U7WUFDcEUseUNBQXlDLENBQUMsQ0FBQztLQUNoRDtJQUNELE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDL0IsTUFBTSxnQkFBZ0IsR0FBYSxFQUFFLENB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Q0FBQyxDQUF1QixDQUFDO2FBQ3pFO1NBQ0Y7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRCxLQUFLLENBQUMsV0FBVyxDQUFDLElBQVk7UUFDNUIsSUFBSSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLE1BQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7WUFDdEMsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsSUFBSSxHQUFHLENBQUMsQ0FBQztTQUN4RDtRQUNELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUF1QixDQUFDO1FBQzFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0ICcuLi9mbGFncyc7XG5pbXBvcnQge2Vudn0gZnJvbSAnLi4vZW52aXJvbm1lbnQnO1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge2FycmF5QnVmZmVyVG9CYXNlNjRTdHJpbmcsIGJhc2U2NFN0cmluZ1RvQXJyYXlCdWZmZXIsIGdldE1vZGVsQXJ0aWZhY3RzSW5mb0ZvckpTT059IGZyb20gJy4vaW9fdXRpbHMnO1xuaW1wb3J0IHtJT1JvdXRlciwgSU9Sb3V0ZXJSZWdpc3RyeX0gZnJvbSAnLi9yb3V0ZXJfcmVnaXN0cnknO1xuaW1wb3J0IHtJT0hhbmRsZXIsIE1vZGVsQXJ0aWZhY3RzLCBNb2RlbEFydGlmYWN0c0luZm8sIE1vZGVsSlNPTiwgTW9kZWxTdG9yZU1hbmFnZXIsIFNhdmVSZXN1bHR9IGZyb20gJy4vdHlwZXMnO1xuXG5jb25zdCBQQVRIX1NFUEFSQVRPUiA9ICcvJztcbmNvbnN0IFBBVEhfUFJFRklYID0gJ3RlbnNvcmZsb3dqc19tb2RlbHMnO1xuY29uc3QgSU5GT19TVUZGSVggPSAnaW5mbyc7XG5jb25zdCBNT0RFTF9UT1BPTE9HWV9TVUZGSVggPSAnbW9kZWxfdG9wb2xvZ3knO1xuY29uc3QgV0VJR0hUX1NQRUNTX1NVRkZJWCA9ICd3ZWlnaHRfc3BlY3MnO1xuY29uc3QgV0VJR0hUX0RBVEFfU1VGRklYID0gJ3dlaWdodF9kYXRhJztcbmNvbnN0IE1PREVMX01FVEFEQVRBX1NVRkZJWCA9ICdtb2RlbF9tZXRhZGF0YSc7XG5cbi8qKlxuICogUHVyZ2UgYWxsIHRlbnNvcmZsb3cuanMtc2F2ZWQgbW9kZWwgYXJ0aWZhY3RzIGZyb20gbG9jYWwgc3RvcmFnZS5cbiAqXG4gKiBAcmV0dXJucyBQYXRocyBvZiB0aGUgbW9kZWxzIHB1cmdlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHB1cmdlTG9jYWxTdG9yYWdlQXJ0aWZhY3RzKCk6IHN0cmluZ1tdIHtcbiAgaWYgKCFlbnYoKS5nZXRCb29sKCdJU19CUk9XU0VSJykgfHwgdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgfHxcbiAgICAgIHR5cGVvZiB3aW5kb3cubG9jYWxTdG9yYWdlID09PSAndW5kZWZpbmVkJykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ3B1cmdlTG9jYWxTdG9yYWdlTW9kZWxzKCkgY2Fubm90IHByb2NlZWQgYmVjYXVzZSBsb2NhbCBzdG9yYWdlIGlzICcgK1xuICAgICAgICAndW5hdmFpbGFibGUgaW4gdGhlIGN1cnJlbnQgZW52aXJvbm1lbnQuJyk7XG4gIH1cbiAgY29uc3QgTFMgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xuICBjb25zdCBwdXJnZWRNb2RlbFBhdGhzOiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IExTLmxlbmd0aDsgKytpKSB7XG4gICAgY29uc3Qga2V5ID0gTFMua2V5KGkpO1xuICAgIGNvbnN0IHByZWZpeCA9IFBBVEhfUFJFRklYICsgUEFUSF9TRVBBUkFUT1I7XG4gICAgaWYgKGtleS5zdGFydHNXaXRoKHByZWZpeCkgJiYga2V5Lmxlbmd0aCA+IHByZWZpeC5sZW5ndGgpIHtcbiAgICAgIExTLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICAgIGNvbnN0IG1vZGVsTmFtZSA9IGdldE1vZGVsUGF0aEZyb21LZXkoa2V5KTtcbiAgICAgIGlmIChwdXJnZWRNb2RlbFBhdGhzLmluZGV4T2YobW9kZWxOYW1lKSA9PT0gLTEpIHtcbiAgICAgICAgcHVyZ2VkTW9kZWxQYXRocy5wdXNoKG1vZGVsTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBwdXJnZWRNb2RlbFBhdGhzO1xufVxuXG50eXBlIExvY2FsU3RvcmFnZUtleXMgPSB7XG4gIC8qKiBLZXkgb2YgdGhlIGxvY2FsU3RvcmFnZSBlbnRyeSBzdG9yaW5nIGBNb2RlbEFydGlmYWN0c0luZm9gLiAqL1xuICBpbmZvOiBzdHJpbmcsXG4gIC8qKlxuICAgKiBLZXkgb2YgdGhlIGxvY2FsU3RvcmFnZSBlbnRyeSBzdG9yaW5nIHRoZSAnbW9kZWxUb3BvbG9neScga2V5IG9mXG4gICAqIGBtb2RlbC5qc29uYFxuICAgKi9cbiAgdG9wb2xvZ3k6IHN0cmluZyxcbiAgLyoqXG4gICAqIEtleSBvZiB0aGUgbG9jYWxTdG9yYWdlIGVudHJ5IHN0b3JpbmcgdGhlIGB3ZWlnaHRzTWFuaWZlc3Qud2VpZ2h0c2AgZW50cmllc1xuICAgKiBvZiBgbW9kZWwuanNvbmBcbiAgICovXG4gIHdlaWdodFNwZWNzOiBzdHJpbmcsXG4gIC8qKiBLZXkgb2YgdGhlIGxvY2FsU3RvcmFnZSBlbnRyeSBzdG9yaW5nIHRoZSB3ZWlnaHQgZGF0YSBpbiBCYXNlNjQgKi9cbiAgd2VpZ2h0RGF0YTogc3RyaW5nLFxuICAvKipcbiAgICogS2V5IG9mIHRoZSBsb2NhbFN0b3JhZ2UgZW50cnkgc3RvcmluZyB0aGUgcmVtYWluaW5nIGZpZWxkcyBvZiBgbW9kZWwuanNvbmBcbiAgICogQHNlZSB7QGxpbmsgTW9kZWxNZXRhZGF0YX1cbiAgICovXG4gIG1vZGVsTWV0YWRhdGE6IHN0cmluZyxcbn07XG5cbnR5cGUgTW9kZWxNZXRhZGF0YSA9IE9taXQ8TW9kZWxKU09OLCAnbW9kZWxUb3BvbG9neSd8J3dlaWdodHNNYW5pZmVzdCc+O1xuXG5mdW5jdGlvbiBnZXRNb2RlbEtleXMocGF0aDogc3RyaW5nKTogTG9jYWxTdG9yYWdlS2V5cyB7XG4gIHJldHVybiB7XG4gICAgaW5mbzogW1BBVEhfUFJFRklYLCBwYXRoLCBJTkZPX1NVRkZJWF0uam9pbihQQVRIX1NFUEFSQVRPUiksXG4gICAgdG9wb2xvZ3k6IFtQQVRIX1BSRUZJWCwgcGF0aCwgTU9ERUxfVE9QT0xPR1lfU1VGRklYXS5qb2luKFBBVEhfU0VQQVJBVE9SKSxcbiAgICB3ZWlnaHRTcGVjczogW1BBVEhfUFJFRklYLCBwYXRoLCBXRUlHSFRfU1BFQ1NfU1VGRklYXS5qb2luKFBBVEhfU0VQQVJBVE9SKSxcbiAgICB3ZWlnaHREYXRhOiBbUEFUSF9QUkVGSVgsIHBhdGgsIFdFSUdIVF9EQVRBX1NVRkZJWF0uam9pbihQQVRIX1NFUEFSQVRPUiksXG4gICAgbW9kZWxNZXRhZGF0YTpcbiAgICAgICAgW1BBVEhfUFJFRklYLCBwYXRoLCBNT0RFTF9NRVRBREFUQV9TVUZGSVhdLmpvaW4oUEFUSF9TRVBBUkFUT1IpXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUl0ZW1zKGtleXM6IExvY2FsU3RvcmFnZUtleXMpOiB2b2lkIHtcbiAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LnZhbHVlcyhrZXlzKSkge1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICB9XG59XG5cbi8qKlxuICogR2V0IG1vZGVsIHBhdGggZnJvbSBhIGxvY2FsLXN0b3JhZ2Uga2V5LlxuICpcbiAqIEUuZy4sICd0ZW5zb3JmbG93anNfbW9kZWxzL215L21vZGVsLzEvaW5mbycgLS0+ICdteS9tb2RlbC8xJ1xuICpcbiAqIEBwYXJhbSBrZXlcbiAqL1xuZnVuY3Rpb24gZ2V0TW9kZWxQYXRoRnJvbUtleShrZXk6IHN0cmluZykge1xuICBjb25zdCBpdGVtcyA9IGtleS5zcGxpdChQQVRIX1NFUEFSQVRPUik7XG4gIGlmIChpdGVtcy5sZW5ndGggPCAzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGtleSBmb3JtYXQ6ICR7a2V5fWApO1xuICB9XG4gIHJldHVybiBpdGVtcy5zbGljZSgxLCBpdGVtcy5sZW5ndGggLSAxKS5qb2luKFBBVEhfU0VQQVJBVE9SKTtcbn1cblxuZnVuY3Rpb24gbWF5YmVTdHJpcFNjaGVtZShrZXk6IHN0cmluZykge1xuICByZXR1cm4ga2V5LnN0YXJ0c1dpdGgoQnJvd3NlckxvY2FsU3RvcmFnZS5VUkxfU0NIRU1FKSA/XG4gICAgICBrZXkuc2xpY2UoQnJvd3NlckxvY2FsU3RvcmFnZS5VUkxfU0NIRU1FLmxlbmd0aCkgOlxuICAgICAga2V5O1xufVxuXG4vKipcbiAqIElPSGFuZGxlciBzdWJjbGFzczogQnJvd3NlciBMb2NhbCBTdG9yYWdlLlxuICpcbiAqIFNlZSB0aGUgZG9jIHN0cmluZyB0byBgYnJvd3NlckxvY2FsU3RvcmFnZWAgZm9yIG1vcmUgZGV0YWlscy5cbiAqL1xuZXhwb3J0IGNsYXNzIEJyb3dzZXJMb2NhbFN0b3JhZ2UgaW1wbGVtZW50cyBJT0hhbmRsZXIge1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgTFM6IFN0b3JhZ2U7XG4gIHByb3RlY3RlZCByZWFkb25seSBtb2RlbFBhdGg6IHN0cmluZztcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGtleXM6IExvY2FsU3RvcmFnZUtleXM7XG5cbiAgc3RhdGljIHJlYWRvbmx5IFVSTF9TQ0hFTUUgPSAnbG9jYWxzdG9yYWdlOi8vJztcblxuICBjb25zdHJ1Y3Rvcihtb2RlbFBhdGg6IHN0cmluZykge1xuICAgIGlmICghZW52KCkuZ2V0Qm9vbCgnSVNfQlJPV1NFUicpIHx8IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAgIHR5cGVvZiB3aW5kb3cubG9jYWxTdG9yYWdlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgLy8gVE9ETyhjYWlzKTogQWRkIG1vcmUgaW5mbyBhYm91dCB3aGF0IElPSGFuZGxlciBzdWJ0eXBlcyBhcmVcbiAgICAgIC8vIGF2YWlsYWJsZS5cbiAgICAgIC8vICAgTWF5YmUgcG9pbnQgdG8gYSBkb2MgcGFnZSBvbiB0aGUgd2ViIGFuZC9vciBhdXRvbWF0aWNhbGx5IGRldGVybWluZVxuICAgICAgLy8gICB0aGUgYXZhaWxhYmxlIElPSGFuZGxlcnMgYW5kIHByaW50IHRoZW0gaW4gdGhlIGVycm9yIG1lc3NhZ2UuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ1RoZSBjdXJyZW50IGVudmlyb25tZW50IGRvZXMgbm90IHN1cHBvcnQgbG9jYWwgc3RvcmFnZS4nKTtcbiAgICB9XG4gICAgdGhpcy5MUyA9IHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG5cbiAgICBpZiAobW9kZWxQYXRoID09IG51bGwgfHwgIW1vZGVsUGF0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdGb3IgbG9jYWwgc3RvcmFnZSwgbW9kZWxQYXRoIG11c3Qgbm90IGJlIG51bGwsIHVuZGVmaW5lZCBvciBlbXB0eS4nKTtcbiAgICB9XG4gICAgdGhpcy5tb2RlbFBhdGggPSBtb2RlbFBhdGg7XG4gICAgdGhpcy5rZXlzID0gZ2V0TW9kZWxLZXlzKHRoaXMubW9kZWxQYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlIG1vZGVsIGFydGlmYWN0cyB0byBicm93c2VyIGxvY2FsIHN0b3JhZ2UuXG4gICAqXG4gICAqIFNlZSB0aGUgZG9jdW1lbnRhdGlvbiB0byBgYnJvd3NlckxvY2FsU3RvcmFnZWAgZm9yIGRldGFpbHMgb24gdGhlIHNhdmVkXG4gICAqIGFydGlmYWN0cy5cbiAgICpcbiAgICogQHBhcmFtIG1vZGVsQXJ0aWZhY3RzIFRoZSBtb2RlbCBhcnRpZmFjdHMgdG8gYmUgc3RvcmVkLlxuICAgKiBAcmV0dXJucyBBbiBpbnN0YW5jZSBvZiBTYXZlUmVzdWx0LlxuICAgKi9cbiAgYXN5bmMgc2F2ZShtb2RlbEFydGlmYWN0czogTW9kZWxBcnRpZmFjdHMpOiBQcm9taXNlPFNhdmVSZXN1bHQ+IHtcbiAgICBpZiAobW9kZWxBcnRpZmFjdHMubW9kZWxUb3BvbG9neSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ0Jyb3dzZXJMb2NhbFN0b3JhZ2Uuc2F2ZSgpIGRvZXMgbm90IHN1cHBvcnQgc2F2aW5nIG1vZGVsIHRvcG9sb2d5ICcgK1xuICAgICAgICAgICdpbiBiaW5hcnkgZm9ybWF0cyB5ZXQuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHRvcG9sb2d5ID0gSlNPTi5zdHJpbmdpZnkobW9kZWxBcnRpZmFjdHMubW9kZWxUb3BvbG9neSk7XG4gICAgICBjb25zdCB3ZWlnaHRTcGVjcyA9IEpTT04uc3RyaW5naWZ5KG1vZGVsQXJ0aWZhY3RzLndlaWdodFNwZWNzKTtcblxuICAgICAgY29uc3QgbW9kZWxBcnRpZmFjdHNJbmZvOiBNb2RlbEFydGlmYWN0c0luZm8gPVxuICAgICAgICAgIGdldE1vZGVsQXJ0aWZhY3RzSW5mb0ZvckpTT04obW9kZWxBcnRpZmFjdHMpO1xuXG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLkxTLnNldEl0ZW0odGhpcy5rZXlzLmluZm8sIEpTT04uc3RyaW5naWZ5KG1vZGVsQXJ0aWZhY3RzSW5mbykpO1xuICAgICAgICB0aGlzLkxTLnNldEl0ZW0odGhpcy5rZXlzLnRvcG9sb2d5LCB0b3BvbG9neSk7XG4gICAgICAgIHRoaXMuTFMuc2V0SXRlbSh0aGlzLmtleXMud2VpZ2h0U3BlY3MsIHdlaWdodFNwZWNzKTtcbiAgICAgICAgdGhpcy5MUy5zZXRJdGVtKFxuICAgICAgICAgICAgdGhpcy5rZXlzLndlaWdodERhdGEsXG4gICAgICAgICAgICBhcnJheUJ1ZmZlclRvQmFzZTY0U3RyaW5nKG1vZGVsQXJ0aWZhY3RzLndlaWdodERhdGEpKTtcblxuICAgICAgICAvLyBOb3RlIHRoYXQgSlNPTi5zdHJpbmdpZnkgZG9lc24ndCB3cml0ZSBvdXQga2V5cyB0aGF0IGhhdmUgdW5kZWZpbmVkXG4gICAgICAgIC8vIHZhbHVlcywgc28gZm9yIHNvbWUga2V5cywgd2Ugc2V0IHVuZGVmaW5lZCBpbnN0ZWFkIG9mIGEgbnVsbC1pc2hcbiAgICAgICAgLy8gdmFsdWUuXG4gICAgICAgIGNvbnN0IG1ldGFkYXRhOiBSZXF1aXJlZDxNb2RlbE1ldGFkYXRhPiA9IHtcbiAgICAgICAgICBmb3JtYXQ6IG1vZGVsQXJ0aWZhY3RzLmZvcm1hdCxcbiAgICAgICAgICBnZW5lcmF0ZWRCeTogbW9kZWxBcnRpZmFjdHMuZ2VuZXJhdGVkQnksXG4gICAgICAgICAgY29udmVydGVkQnk6IG1vZGVsQXJ0aWZhY3RzLmNvbnZlcnRlZEJ5LFxuICAgICAgICAgIHNpZ25hdHVyZTogbW9kZWxBcnRpZmFjdHMuc2lnbmF0dXJlICE9IG51bGwgP1xuICAgICAgICAgICAgICBtb2RlbEFydGlmYWN0cy5zaWduYXR1cmUgOlxuICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgdXNlckRlZmluZWRNZXRhZGF0YTogbW9kZWxBcnRpZmFjdHMudXNlckRlZmluZWRNZXRhZGF0YSAhPSBudWxsID9cbiAgICAgICAgICAgICAgbW9kZWxBcnRpZmFjdHMudXNlckRlZmluZWRNZXRhZGF0YSA6XG4gICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICBtb2RlbEluaXRpYWxpemVyOiBtb2RlbEFydGlmYWN0cy5tb2RlbEluaXRpYWxpemVyICE9IG51bGwgP1xuICAgICAgICAgICAgICBtb2RlbEFydGlmYWN0cy5tb2RlbEluaXRpYWxpemVyIDpcbiAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgIHRyYWluaW5nQ29uZmlnOiBtb2RlbEFydGlmYWN0cy50cmFpbmluZ0NvbmZpZyAhPSBudWxsID9cbiAgICAgICAgICAgICAgbW9kZWxBcnRpZmFjdHMudHJhaW5pbmdDb25maWcgOlxuICAgICAgICAgICAgICB1bmRlZmluZWRcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5MUy5zZXRJdGVtKHRoaXMua2V5cy5tb2RlbE1ldGFkYXRhLCBKU09OLnN0cmluZ2lmeShtZXRhZGF0YSkpO1xuXG4gICAgICAgIHJldHVybiB7bW9kZWxBcnRpZmFjdHNJbmZvfTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAvLyBJZiBzYXZpbmcgZmFpbGVkLCBjbGVhbiB1cCBhbGwgaXRlbXMgc2F2ZWQgc28gZmFyLlxuICAgICAgICByZW1vdmVJdGVtcyh0aGlzLmtleXMpO1xuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBGYWlsZWQgdG8gc2F2ZSBtb2RlbCAnJHt0aGlzLm1vZGVsUGF0aH0nIHRvIGxvY2FsIHN0b3JhZ2U6IGAgK1xuICAgICAgICAgICAgYHNpemUgcXVvdGEgYmVpbmcgZXhjZWVkZWQgaXMgYSBwb3NzaWJsZSBjYXVzZSBvZiB0aGlzIGZhaWx1cmU6IGAgK1xuICAgICAgICAgICAgYG1vZGVsVG9wb2xvZ3lCeXRlcz0ke21vZGVsQXJ0aWZhY3RzSW5mby5tb2RlbFRvcG9sb2d5Qnl0ZXN9LCBgICtcbiAgICAgICAgICAgIGB3ZWlnaHRTcGVjc0J5dGVzPSR7bW9kZWxBcnRpZmFjdHNJbmZvLndlaWdodFNwZWNzQnl0ZXN9LCBgICtcbiAgICAgICAgICAgIGB3ZWlnaHREYXRhQnl0ZXM9JHttb2RlbEFydGlmYWN0c0luZm8ud2VpZ2h0RGF0YUJ5dGVzfS5gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTG9hZCBhIG1vZGVsIGZyb20gbG9jYWwgc3RvcmFnZS5cbiAgICpcbiAgICogU2VlIHRoZSBkb2N1bWVudGF0aW9uIHRvIGBicm93c2VyTG9jYWxTdG9yYWdlYCBmb3IgZGV0YWlscyBvbiB0aGUgc2F2ZWRcbiAgICogYXJ0aWZhY3RzLlxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgbG9hZGVkIG1vZGVsIChpZiBsb2FkaW5nIHN1Y2NlZWRzKS5cbiAgICovXG4gIGFzeW5jIGxvYWQoKTogUHJvbWlzZTxNb2RlbEFydGlmYWN0cz4ge1xuICAgIGNvbnN0IGluZm8gPVxuICAgICAgICBKU09OLnBhcnNlKHRoaXMuTFMuZ2V0SXRlbSh0aGlzLmtleXMuaW5mbykpIGFzIE1vZGVsQXJ0aWZhY3RzSW5mbztcbiAgICBpZiAoaW5mbyA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYEluIGxvY2FsIHN0b3JhZ2UsIHRoZXJlIGlzIG5vIG1vZGVsIHdpdGggbmFtZSAnJHt0aGlzLm1vZGVsUGF0aH0nYCk7XG4gICAgfVxuXG4gICAgaWYgKGluZm8ubW9kZWxUb3BvbG9neVR5cGUgIT09ICdKU09OJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdCcm93c2VyTG9jYWxTdG9yYWdlIGRvZXMgbm90IHN1cHBvcnQgbG9hZGluZyBub24tSlNPTiBtb2RlbCAnICtcbiAgICAgICAgICAndG9wb2xvZ3kgeWV0LicpO1xuICAgIH1cblxuICAgIGNvbnN0IG91dDogTW9kZWxBcnRpZmFjdHMgPSB7fTtcblxuICAgIC8vIExvYWQgdG9wb2xvZ3kuXG4gICAgY29uc3QgdG9wb2xvZ3kgPSBKU09OLnBhcnNlKHRoaXMuTFMuZ2V0SXRlbSh0aGlzLmtleXMudG9wb2xvZ3kpKTtcbiAgICBpZiAodG9wb2xvZ3kgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBJbiBsb2NhbCBzdG9yYWdlLCB0aGUgdG9wb2xvZ3kgb2YgbW9kZWwgJyR7dGhpcy5tb2RlbFBhdGh9JyBgICtcbiAgICAgICAgICBgaXMgbWlzc2luZy5gKTtcbiAgICB9XG4gICAgb3V0Lm1vZGVsVG9wb2xvZ3kgPSB0b3BvbG9neTtcblxuICAgIC8vIExvYWQgd2VpZ2h0IHNwZWNzLlxuICAgIGNvbnN0IHdlaWdodFNwZWNzID0gSlNPTi5wYXJzZSh0aGlzLkxTLmdldEl0ZW0odGhpcy5rZXlzLndlaWdodFNwZWNzKSk7XG4gICAgaWYgKHdlaWdodFNwZWNzID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgSW4gbG9jYWwgc3RvcmFnZSwgdGhlIHdlaWdodCBzcGVjcyBvZiBtb2RlbCAnJHt0aGlzLm1vZGVsUGF0aH0nIGAgK1xuICAgICAgICAgIGBhcmUgbWlzc2luZy5gKTtcbiAgICB9XG4gICAgb3V0LndlaWdodFNwZWNzID0gd2VpZ2h0U3BlY3M7XG5cbiAgICAvLyBMb2FkIG1ldGEtZGF0YSBmaWVsZHMuXG4gICAgY29uc3QgbWV0YWRhdGFTdHJpbmcgPSB0aGlzLkxTLmdldEl0ZW0odGhpcy5rZXlzLm1vZGVsTWV0YWRhdGEpO1xuICAgIGlmIChtZXRhZGF0YVN0cmluZyAhPSBudWxsKSB7XG4gICAgICBjb25zdCBtZXRhZGF0YSA9IEpTT04ucGFyc2UobWV0YWRhdGFTdHJpbmcpIGFzIE1vZGVsTWV0YWRhdGE7XG4gICAgICBvdXQuZm9ybWF0ID0gbWV0YWRhdGEuZm9ybWF0O1xuICAgICAgb3V0LmdlbmVyYXRlZEJ5ID0gbWV0YWRhdGEuZ2VuZXJhdGVkQnk7XG4gICAgICBvdXQuY29udmVydGVkQnkgPSBtZXRhZGF0YS5jb252ZXJ0ZWRCeTtcbiAgICAgIGlmIChtZXRhZGF0YS5zaWduYXR1cmUgIT0gbnVsbCkge1xuICAgICAgICBvdXQuc2lnbmF0dXJlID0gbWV0YWRhdGEuc2lnbmF0dXJlO1xuICAgICAgfVxuICAgICAgaWYgKG1ldGFkYXRhLnVzZXJEZWZpbmVkTWV0YWRhdGEgIT0gbnVsbCkge1xuICAgICAgICBvdXQudXNlckRlZmluZWRNZXRhZGF0YSA9IG1ldGFkYXRhLnVzZXJEZWZpbmVkTWV0YWRhdGE7XG4gICAgICB9XG4gICAgICBpZiAobWV0YWRhdGEubW9kZWxJbml0aWFsaXplciAhPSBudWxsKSB7XG4gICAgICAgIG91dC5tb2RlbEluaXRpYWxpemVyID0gbWV0YWRhdGEubW9kZWxJbml0aWFsaXplcjtcbiAgICAgIH1cbiAgICAgIGlmIChtZXRhZGF0YS50cmFpbmluZ0NvbmZpZyAhPSBudWxsKSB7XG4gICAgICAgIG91dC50cmFpbmluZ0NvbmZpZyA9IG1ldGFkYXRhLnRyYWluaW5nQ29uZmlnO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIExvYWQgd2VpZ2h0IGRhdGEuXG4gICAgY29uc3Qgd2VpZ2h0RGF0YUJhc2U2NCA9IHRoaXMuTFMuZ2V0SXRlbSh0aGlzLmtleXMud2VpZ2h0RGF0YSk7XG4gICAgaWYgKHdlaWdodERhdGFCYXNlNjQgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBJbiBsb2NhbCBzdG9yYWdlLCB0aGUgYmluYXJ5IHdlaWdodCB2YWx1ZXMgb2YgbW9kZWwgYCArXG4gICAgICAgICAgYCcke3RoaXMubW9kZWxQYXRofScgYXJlIG1pc3NpbmcuYCk7XG4gICAgfVxuICAgIG91dC53ZWlnaHREYXRhID0gYmFzZTY0U3RyaW5nVG9BcnJheUJ1ZmZlcih3ZWlnaHREYXRhQmFzZTY0KTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGxvY2FsU3RvcmFnZVJvdXRlcjogSU9Sb3V0ZXIgPSAodXJsOiBzdHJpbmd8c3RyaW5nW10pID0+IHtcbiAgaWYgKCFlbnYoKS5nZXRCb29sKCdJU19CUk9XU0VSJykpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodXJsKSAmJiB1cmwuc3RhcnRzV2l0aChCcm93c2VyTG9jYWxTdG9yYWdlLlVSTF9TQ0hFTUUpKSB7XG4gICAgICByZXR1cm4gYnJvd3NlckxvY2FsU3RvcmFnZShcbiAgICAgICAgICB1cmwuc2xpY2UoQnJvd3NlckxvY2FsU3RvcmFnZS5VUkxfU0NIRU1FLmxlbmd0aCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbn07XG5JT1JvdXRlclJlZ2lzdHJ5LnJlZ2lzdGVyU2F2ZVJvdXRlcihsb2NhbFN0b3JhZ2VSb3V0ZXIpO1xuSU9Sb3V0ZXJSZWdpc3RyeS5yZWdpc3RlckxvYWRSb3V0ZXIobG9jYWxTdG9yYWdlUm91dGVyKTtcblxuLyoqXG4gKiBGYWN0b3J5IGZ1bmN0aW9uIGZvciBsb2NhbCBzdG9yYWdlIElPSGFuZGxlci5cbiAqXG4gKiBUaGlzIGBJT0hhbmRsZXJgIHN1cHBvcnRzIGJvdGggYHNhdmVgIGFuZCBgbG9hZGAuXG4gKlxuICogRm9yIGVhY2ggbW9kZWwncyBzYXZlZCBhcnRpZmFjdHMsIGZvdXIgaXRlbXMgYXJlIHNhdmVkIHRvIGxvY2FsIHN0b3JhZ2UuXG4gKiAgIC0gYCR7UEFUSF9TRVBBUkFUT1J9LyR7bW9kZWxQYXRofS9pbmZvYDogQ29udGFpbnMgbWV0YS1pbmZvIGFib3V0IHRoZVxuICogICAgIG1vZGVsLCBzdWNoIGFzIGRhdGUgc2F2ZWQsIHR5cGUgb2YgdGhlIHRvcG9sb2d5LCBzaXplIGluIGJ5dGVzLCBldGMuXG4gKiAgIC0gYCR7UEFUSF9TRVBBUkFUT1J9LyR7bW9kZWxQYXRofS90b3BvbG9neWA6IE1vZGVsIHRvcG9sb2d5LiBGb3IgS2VyYXMtXG4gKiAgICAgc3R5bGUgbW9kZWxzLCB0aGlzIGlzIGEgc3RyaW5naXplZCBKU09OLlxuICogICAtIGAke1BBVEhfU0VQQVJBVE9SfS8ke21vZGVsUGF0aH0vd2VpZ2h0X3NwZWNzYDogV2VpZ2h0IHNwZWNzIG9mIHRoZVxuICogICAgIG1vZGVsLCBjYW4gYmUgdXNlZCB0byBkZWNvZGUgdGhlIHNhdmVkIGJpbmFyeSB3ZWlnaHQgdmFsdWVzIChzZWVcbiAqICAgICBpdGVtIGJlbG93KS5cbiAqICAgLSBgJHtQQVRIX1NFUEFSQVRPUn0vJHttb2RlbFBhdGh9L3dlaWdodF9kYXRhYDogQ29uY2F0ZW5hdGVkIGJpbmFyeVxuICogICAgIHdlaWdodCB2YWx1ZXMsIHN0b3JlZCBhcyBhIGJhc2U2NC1lbmNvZGVkIHN0cmluZy5cbiAqXG4gKiBTYXZpbmcgbWF5IHRocm93IGFuIGBFcnJvcmAgaWYgdGhlIHRvdGFsIHNpemUgb2YgdGhlIGFydGlmYWN0cyBleGNlZWQgdGhlXG4gKiBicm93c2VyLXNwZWNpZmljIHF1b3RhLlxuICpcbiAqIEBwYXJhbSBtb2RlbFBhdGggQSB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIG1vZGVsIHRvIGJlIHNhdmVkLiBNdXN0IGJlIGFcbiAqICAgbm9uLWVtcHR5IHN0cmluZy5cbiAqIEByZXR1cm5zIEFuIGluc3RhbmNlIG9mIGBJT0hhbmRsZXJgLCB3aGljaCBjYW4gYmUgdXNlZCB3aXRoLCBlLmcuLFxuICogICBgdGYuTW9kZWwuc2F2ZWAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBicm93c2VyTG9jYWxTdG9yYWdlKG1vZGVsUGF0aDogc3RyaW5nKTogSU9IYW5kbGVyIHtcbiAgcmV0dXJuIG5ldyBCcm93c2VyTG9jYWxTdG9yYWdlKG1vZGVsUGF0aCk7XG59XG5cbmV4cG9ydCBjbGFzcyBCcm93c2VyTG9jYWxTdG9yYWdlTWFuYWdlciBpbXBsZW1lbnRzIE1vZGVsU3RvcmVNYW5hZ2VyIHtcbiAgcHJpdmF0ZSByZWFkb25seSBMUzogU3RvcmFnZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBhc3NlcnQoXG4gICAgICAgIGVudigpLmdldEJvb2woJ0lTX0JST1dTRVInKSxcbiAgICAgICAgKCkgPT4gJ0N1cnJlbnQgZW52aXJvbm1lbnQgaXMgbm90IGEgd2ViIGJyb3dzZXInKTtcbiAgICBhc3NlcnQoXG4gICAgICAgIHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAgICAgICB0eXBlb2Ygd2luZG93LmxvY2FsU3RvcmFnZSAhPT0gJ3VuZGVmaW5lZCcsXG4gICAgICAgICgpID0+ICdDdXJyZW50IGJyb3dzZXIgZG9lcyBub3QgYXBwZWFyIHRvIHN1cHBvcnQgbG9jYWxTdG9yYWdlJyk7XG4gICAgdGhpcy5MUyA9IHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG4gIH1cblxuICBhc3luYyBsaXN0TW9kZWxzKCk6IFByb21pc2U8e1twYXRoOiBzdHJpbmddOiBNb2RlbEFydGlmYWN0c0luZm99PiB7XG4gICAgY29uc3Qgb3V0OiB7W3BhdGg6IHN0cmluZ106IE1vZGVsQXJ0aWZhY3RzSW5mb30gPSB7fTtcbiAgICBjb25zdCBwcmVmaXggPSBQQVRIX1BSRUZJWCArIFBBVEhfU0VQQVJBVE9SO1xuICAgIGNvbnN0IHN1ZmZpeCA9IFBBVEhfU0VQQVJBVE9SICsgSU5GT19TVUZGSVg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLkxTLmxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCBrZXkgPSB0aGlzLkxTLmtleShpKTtcbiAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChwcmVmaXgpICYmIGtleS5lbmRzV2l0aChzdWZmaXgpKSB7XG4gICAgICAgIGNvbnN0IG1vZGVsUGF0aCA9IGdldE1vZGVsUGF0aEZyb21LZXkoa2V5KTtcbiAgICAgICAgb3V0W21vZGVsUGF0aF0gPSBKU09OLnBhcnNlKHRoaXMuTFMuZ2V0SXRlbShrZXkpKSBhcyBNb2RlbEFydGlmYWN0c0luZm87XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBhc3luYyByZW1vdmVNb2RlbChwYXRoOiBzdHJpbmcpOiBQcm9taXNlPE1vZGVsQXJ0aWZhY3RzSW5mbz4ge1xuICAgIHBhdGggPSBtYXliZVN0cmlwU2NoZW1lKHBhdGgpO1xuICAgIGNvbnN0IGtleXMgPSBnZXRNb2RlbEtleXMocGF0aCk7XG4gICAgaWYgKHRoaXMuTFMuZ2V0SXRlbShrZXlzLmluZm8pID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgbW9kZWwgYXQgcGF0aCAnJHtwYXRofSdgKTtcbiAgICB9XG4gICAgY29uc3QgaW5mbyA9IEpTT04ucGFyc2UodGhpcy5MUy5nZXRJdGVtKGtleXMuaW5mbykpIGFzIE1vZGVsQXJ0aWZhY3RzSW5mbztcbiAgICByZW1vdmVJdGVtcyhrZXlzKTtcbiAgICByZXR1cm4gaW5mbztcbiAgfVxufVxuIl19