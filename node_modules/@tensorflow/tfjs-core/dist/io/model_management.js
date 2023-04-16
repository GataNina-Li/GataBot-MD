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
 * Classes and functions for model management across multiple storage mediums.
 *
 * Supported client actions:
 * - Listing models on all registered storage mediums.
 * - Remove model by URL from any registered storage mediums, by using URL
 *   string.
 * - Moving or copying model from one path to another in the same medium or from
 *   one medium to another, by using URL strings.
 */
import { assert } from '../util';
import { IORouterRegistry } from './router_registry';
const URL_SCHEME_SUFFIX = '://';
export class ModelStoreManagerRegistry {
    constructor() {
        this.managers = {};
    }
    static getInstance() {
        if (ModelStoreManagerRegistry.instance == null) {
            ModelStoreManagerRegistry.instance = new ModelStoreManagerRegistry();
        }
        return ModelStoreManagerRegistry.instance;
    }
    /**
     * Register a save-handler router.
     *
     * @param saveRouter A function that maps a URL-like string onto an instance
     * of `IOHandler` with the `save` method defined or `null`.
     */
    static registerManager(scheme, manager) {
        assert(scheme != null, () => 'scheme must not be undefined or null.');
        if (scheme.endsWith(URL_SCHEME_SUFFIX)) {
            scheme = scheme.slice(0, scheme.indexOf(URL_SCHEME_SUFFIX));
        }
        assert(scheme.length > 0, () => 'scheme must not be an empty string.');
        const registry = ModelStoreManagerRegistry.getInstance();
        assert(registry.managers[scheme] == null, () => `A model store manager is already registered for scheme '${scheme}'.`);
        registry.managers[scheme] = manager;
    }
    static getManager(scheme) {
        const manager = ModelStoreManagerRegistry.getInstance().managers[scheme];
        if (manager == null) {
            throw new Error(`Cannot find model manager for scheme '${scheme}'`);
        }
        return manager;
    }
    static getSchemes() {
        return Object.keys(ModelStoreManagerRegistry.getInstance().managers);
    }
}
/**
 * Helper method for parsing a URL string into a scheme and a path.
 *
 * @param url E.g., 'localstorage://my-model'
 * @returns A dictionary with two fields: scheme and path.
 *   Scheme: e.g., 'localstorage' in the example above.
 *   Path: e.g., 'my-model' in the example above.
 */
function parseURL(url) {
    if (url.indexOf(URL_SCHEME_SUFFIX) === -1) {
        throw new Error(`The url string provided does not contain a scheme. ` +
            `Supported schemes are: ` +
            `${ModelStoreManagerRegistry.getSchemes().join(',')}`);
    }
    return {
        scheme: url.split(URL_SCHEME_SUFFIX)[0],
        path: url.split(URL_SCHEME_SUFFIX)[1],
    };
}
async function cloneModelInternal(sourceURL, destURL, deleteSource = false) {
    assert(sourceURL !== destURL, () => `Old path and new path are the same: '${sourceURL}'`);
    const loadHandlers = IORouterRegistry.getLoadHandlers(sourceURL);
    assert(loadHandlers.length > 0, () => `Copying failed because no load handler is found for source URL ${sourceURL}.`);
    assert(loadHandlers.length < 2, () => `Copying failed because more than one (${loadHandlers.length}) ` +
        `load handlers for source URL ${sourceURL}.`);
    const loadHandler = loadHandlers[0];
    const saveHandlers = IORouterRegistry.getSaveHandlers(destURL);
    assert(saveHandlers.length > 0, () => `Copying failed because no save handler is found for destination ` +
        `URL ${destURL}.`);
    assert(saveHandlers.length < 2, () => `Copying failed because more than one (${loadHandlers.length}) ` +
        `save handlers for destination URL ${destURL}.`);
    const saveHandler = saveHandlers[0];
    const sourceScheme = parseURL(sourceURL).scheme;
    const sourcePath = parseURL(sourceURL).path;
    const sameMedium = sourceScheme === parseURL(sourceURL).scheme;
    const modelArtifacts = await loadHandler.load();
    // If moving within the same storage medium, remove the old model as soon as
    // the loading is done. Without doing this, it is possible that the combined
    // size of the two models will cause the cloning to fail.
    if (deleteSource && sameMedium) {
        await ModelStoreManagerRegistry.getManager(sourceScheme)
            .removeModel(sourcePath);
    }
    const saveResult = await saveHandler.save(modelArtifacts);
    // If moving between mediums, the deletion is done after the save succeeds.
    // This guards against the case in which saving to the destination medium
    // fails.
    if (deleteSource && !sameMedium) {
        await ModelStoreManagerRegistry.getManager(sourceScheme)
            .removeModel(sourcePath);
    }
    return saveResult.modelArtifactsInfo;
}
/**
 * List all models stored in registered storage mediums.
 *
 * For a web browser environment, the registered mediums are Local Storage and
 * IndexedDB.
 *
 * ```js
 * // First create and save a model.
 * const model = tf.sequential();
 * model.add(tf.layers.dense(
 *     {units: 1, inputShape: [10], activation: 'sigmoid'}));
 * await model.save('localstorage://demo/management/model1');
 *
 * // Then list existing models.
 * console.log(JSON.stringify(await tf.io.listModels()));
 *
 * // Delete the model.
 * await tf.io.removeModel('localstorage://demo/management/model1');
 *
 * // List models again.
 * console.log(JSON.stringify(await tf.io.listModels()));
 * ```
 *
 * @returns A `Promise` of a dictionary mapping URLs of existing models to
 * their model artifacts info. URLs include medium-specific schemes, e.g.,
 *   'indexeddb://my/model/1'. Model artifacts info include type of the
 * model's topology, byte sizes of the topology, weights, etc.
 *
 * @doc {
 *   heading: 'Models',
 *   subheading: 'Management',
 *   namespace: 'io',
 *   ignoreCI: true
 * }
 */
async function listModels() {
    const schemes = ModelStoreManagerRegistry.getSchemes();
    const out = {};
    for (const scheme of schemes) {
        const schemeOut = await ModelStoreManagerRegistry.getManager(scheme).listModels();
        for (const path in schemeOut) {
            const url = scheme + URL_SCHEME_SUFFIX + path;
            out[url] = schemeOut[path];
        }
    }
    return out;
}
/**
 * Remove a model specified by URL from a registered storage medium.
 *
 * ```js
 * // First create and save a model.
 * const model = tf.sequential();
 * model.add(tf.layers.dense(
 *     {units: 1, inputShape: [10], activation: 'sigmoid'}));
 * await model.save('localstorage://demo/management/model1');
 *
 * // Then list existing models.
 * console.log(JSON.stringify(await tf.io.listModels()));
 *
 * // Delete the model.
 * await tf.io.removeModel('localstorage://demo/management/model1');
 *
 * // List models again.
 * console.log(JSON.stringify(await tf.io.listModels()));
 * ```
 *
 * @param url A URL to a stored model, with a scheme prefix, e.g.,
 *   'localstorage://my-model-1', 'indexeddb://my/model/2'.
 * @returns ModelArtifactsInfo of the deleted model (if and only if deletion
 *   is successful).
 * @throws Error if deletion fails, e.g., if no model exists at `path`.
 *
 * @doc {
 *   heading: 'Models',
 *   subheading: 'Management',
 *   namespace: 'io',
 *   ignoreCI: true
 * }
 */
async function removeModel(url) {
    const schemeAndPath = parseURL(url);
    const manager = ModelStoreManagerRegistry.getManager(schemeAndPath.scheme);
    return manager.removeModel(schemeAndPath.path);
}
/**
 * Copy a model from one URL to another.
 *
 * This function supports:
 *
 * 1. Copying within a storage medium, e.g.,
 *    `tf.io.copyModel('localstorage://model-1', 'localstorage://model-2')`
 * 2. Copying between two storage mediums, e.g.,
 *    `tf.io.copyModel('localstorage://model-1', 'indexeddb://model-1')`
 *
 * ```js
 * // First create and save a model.
 * const model = tf.sequential();
 * model.add(tf.layers.dense(
 *     {units: 1, inputShape: [10], activation: 'sigmoid'}));
 * await model.save('localstorage://demo/management/model1');
 *
 * // Then list existing models.
 * console.log(JSON.stringify(await tf.io.listModels()));
 *
 * // Copy the model, from Local Storage to IndexedDB.
 * await tf.io.copyModel(
 *     'localstorage://demo/management/model1',
 *     'indexeddb://demo/management/model1');
 *
 * // List models again.
 * console.log(JSON.stringify(await tf.io.listModels()));
 *
 * // Remove both models.
 * await tf.io.removeModel('localstorage://demo/management/model1');
 * await tf.io.removeModel('indexeddb://demo/management/model1');
 * ```
 *
 * @param sourceURL Source URL of copying.
 * @param destURL Destination URL of copying.
 * @returns ModelArtifactsInfo of the copied model (if and only if copying
 *   is successful).
 * @throws Error if copying fails, e.g., if no model exists at `sourceURL`, or
 *   if `oldPath` and `newPath` are identical.
 *
 * @doc {
 *   heading: 'Models',
 *   subheading: 'Management',
 *   namespace: 'io',
 *   ignoreCI: true
 * }
 */
async function copyModel(sourceURL, destURL) {
    const deleteSource = false;
    return cloneModelInternal(sourceURL, destURL, deleteSource);
}
/**
 * Move a model from one URL to another.
 *
 * This function supports:
 *
 * 1. Moving within a storage medium, e.g.,
 *    `tf.io.moveModel('localstorage://model-1', 'localstorage://model-2')`
 * 2. Moving between two storage mediums, e.g.,
 *    `tf.io.moveModel('localstorage://model-1', 'indexeddb://model-1')`
 *
 * ```js
 * // First create and save a model.
 * const model = tf.sequential();
 * model.add(tf.layers.dense(
 *     {units: 1, inputShape: [10], activation: 'sigmoid'}));
 * await model.save('localstorage://demo/management/model1');
 *
 * // Then list existing models.
 * console.log(JSON.stringify(await tf.io.listModels()));
 *
 * // Move the model, from Local Storage to IndexedDB.
 * await tf.io.moveModel(
 *     'localstorage://demo/management/model1',
 *     'indexeddb://demo/management/model1');
 *
 * // List models again.
 * console.log(JSON.stringify(await tf.io.listModels()));
 *
 * // Remove the moved model.
 * await tf.io.removeModel('indexeddb://demo/management/model1');
 * ```
 *
 * @param sourceURL Source URL of moving.
 * @param destURL Destination URL of moving.
 * @returns ModelArtifactsInfo of the copied model (if and only if copying
 *   is successful).
 * @throws Error if moving fails, e.g., if no model exists at `sourceURL`, or
 *   if `oldPath` and `newPath` are identical.
 *
 * @doc {
 *   heading: 'Models',
 *   subheading: 'Management',
 *   namespace: 'io',
 *   ignoreCI: true
 * }
 */
async function moveModel(sourceURL, destURL) {
    const deleteSource = true;
    return cloneModelInternal(sourceURL, destURL, deleteSource);
}
export { moveModel, copyModel, removeModel, listModels };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWxfbWFuYWdlbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvaW8vbW9kZWxfbWFuYWdlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSDs7Ozs7Ozs7O0dBU0c7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBRS9CLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBR25ELE1BQU0saUJBQWlCLEdBQUcsS0FBSyxDQUFDO0FBRWhDLE1BQU0sT0FBTyx5QkFBeUI7SUFNcEM7UUFDRSxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRU8sTUFBTSxDQUFDLFdBQVc7UUFDeEIsSUFBSSx5QkFBeUIsQ0FBQyxRQUFRLElBQUksSUFBSSxFQUFFO1lBQzlDLHlCQUF5QixDQUFDLFFBQVEsR0FBRyxJQUFJLHlCQUF5QixFQUFFLENBQUM7U0FDdEU7UUFDRCxPQUFPLHlCQUF5QixDQUFDLFFBQVEsQ0FBQztJQUM1QyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQWMsRUFBRSxPQUEwQjtRQUMvRCxNQUFNLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO1lBQ3RDLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztTQUM3RDtRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0s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R0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVCO0tBQ0Y7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQ0c7QUFDSCxLQUFLLFVBQVUsV0FBVyxDQUFDLEdBQVc7SUFDcEMsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLE1BQU0sT0FBTyxHQUFHLHlCQUF5QixDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0UsT0FBTyxPQUFPLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4Q0c7QUFDSCxLQUFLLFVBQVUsU0FBUyxDQUNwQixTQUFpQixFQUFFLE9BQWU7SUFDcEMsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDO0lBQzNCLE9BQU8sa0JBQWtCLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTZDRztBQUNILEtBQUssVUFBVSxTQUFTLENBQ3BCLFNBQWlCLEVBQUUsT0FBZTtJQUNwQyxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDMUIsT0FBTyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFFRCxPQUFPLEVBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbi8qKlxuICogQ2xhc3NlcyBhbmQgZnVuY3Rpb25zIGZvciBtb2RlbCBtYW5hZ2VtZW50IGFjcm9zcyBtdWx0aXBsZSBzdG9yYWdlIG1lZGl1bXMuXG4gKlxuICogU3VwcG9ydGVkIGNsaWVudCBhY3Rpb25zOlxuICogLSBMaXN0aW5nIG1vZGVscyBvbiBhbGwgcmVnaXN0ZXJlZCBzdG9yYWdlIG1lZGl1bXMuXG4gKiAtIFJlbW92ZSBtb2RlbCBieSBVUkwgZnJvbSBhbnkgcmVnaXN0ZXJlZCBzdG9yYWdlIG1lZGl1bXMsIGJ5IHVzaW5nIFVSTFxuICogICBzdHJpbmcuXG4gKiAtIE1vdmluZyBvciBjb3B5aW5nIG1vZGVsIGZyb20gb25lIHBhdGggdG8gYW5vdGhlciBpbiB0aGUgc2FtZSBtZWRpdW0gb3IgZnJvbVxuICogICBvbmUgbWVkaXVtIHRvIGFub3RoZXIsIGJ5IHVzaW5nIFVSTCBzdHJpbmdzLlxuICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICcuLi91dGlsJztcblxuaW1wb3J0IHtJT1JvdXRlclJlZ2lzdHJ5fSBmcm9tICcuL3JvdXRlcl9yZWdpc3RyeSc7XG5pbXBvcnQge01vZGVsQXJ0aWZhY3RzSW5mbywgTW9kZWxTdG9yZU1hbmFnZXJ9IGZyb20gJy4vdHlwZXMnO1xuXG5jb25zdCBVUkxfU0NIRU1FX1NVRkZJWCA9ICc6Ly8nO1xuXG5leHBvcnQgY2xhc3MgTW9kZWxTdG9yZU1hbmFnZXJSZWdpc3RyeSB7XG4gIC8vIFNpbmdsZXRvbiBpbnN0YW5jZS5cbiAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IE1vZGVsU3RvcmVNYW5hZ2VyUmVnaXN0cnk7XG5cbiAgcHJpdmF0ZSBtYW5hZ2Vyczoge1tzY2hlbWU6IHN0cmluZ106IE1vZGVsU3RvcmVNYW5hZ2VyfTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubWFuYWdlcnMgPSB7fTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGdldEluc3RhbmNlKCk6IE1vZGVsU3RvcmVNYW5hZ2VyUmVnaXN0cnkge1xuICAgIGlmIChNb2RlbFN0b3JlTWFuYWdlclJlZ2lzdHJ5Lmluc3RhbmNlID09IG51bGwpIHtcbiAgICAgIE1vZGVsU3RvcmVNYW5hZ2VyUmVnaXN0cnkuaW5zdGFuY2UgPSBuZXcgTW9kZWxTdG9yZU1hbmFnZXJSZWdpc3RyeSgpO1xuICAgIH1cbiAgICByZXR1cm4gTW9kZWxTdG9yZU1hbmFnZXJSZWdpc3RyeS5pbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIHNhdmUtaGFuZGxlciByb3V0ZXIuXG4gICAqXG4gICAqIEBwYXJhbSBzYXZlUm91dGVyIEEgZnVuY3Rpb24gdGhhdCBtYXBzIGEgVVJMLWxpa2Ugc3RyaW5nIG9udG8gYW4gaW5zdGFuY2VcbiAgICogb2YgYElPSGFuZGxlcmAgd2l0aCB0aGUgYHNhdmVgIG1ldGhvZCBkZWZpbmVkIG9yIGBudWxsYC5cbiAgICovXG4gIHN0YXRpYyByZWdpc3Rlck1hbmFnZXIoc2NoZW1lOiBzdHJpbmcsIG1hbmFnZXI6IE1vZGVsU3RvcmVNYW5hZ2VyKSB7XG4gICAgYXNzZXJ0KHNjaGVtZSAhPSBudWxsLCAoKSA9PiAnc2NoZW1lIG11c3Qgbm90IGJlIHVuZGVmaW5lZCBvciBudWxsLicpO1xuICAgIGlmIChzY2hlbWUuZW5kc1dpdGgoVVJMX1NDSEVNRV9TVUZGSVgpKSB7XG4gICAgICBzY2hlbWUgPSBzY2hlbWUuc2xpY2UoMCwgc2NoZW1lLmluZGV4T2YoVVJMX1NDSEVNRV9TVUZGSVgpKTtcbiAgICB9XG4gICAgYXNzZXJ0KHNjaGVtZS5sZW5ndGggPiAwLCAoKSA9PiAnc2NoZW1lIG11c3Qgbm90IGJlIGFuIGVtcHR5IHN0cmluZy4nKTtcbiAgICBjb25zdCByZWdpc3RyeSA9IE1vZGVsU3RvcmVNYW5hZ2VyUmVnaXN0cnkuZ2V0SW5zdGFuY2UoKTtcbiAgICBhc3NlcnQoXG4gICAgICAgIHJlZ2lzdHJ5Lm1hbmFnZXJzW3NjaGVtZV0gPT0gbnVsbCxcbiAgICAgICAgKCkgPT4gYEEgbW9kZWwgc3RvcmUgbWFuYWdlciBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQgZm9yIHNjaGVtZSAnJHtcbiAgICAgICAgICAgIHNjaGVtZX0nLmApO1xuICAgIHJlZ2lzdHJ5Lm1hbmFnZXJzW3NjaGVtZV0gPSBtYW5hZ2VyO1xuICB9XG5cbiAgc3RhdGljIGdldE1hbmFnZXIoc2NoZW1lOiBzdHJpbmcpOiBNb2RlbFN0b3JlTWFuYWdlciB7XG4gICAgY29uc3QgbWFuYWdlciA9IE1vZGVsU3RvcmVNYW5hZ2VyUmVnaXN0cnkuZ2V0SW5zdGFuY2UoKS5tYW5hZ2Vyc1tzY2hlbWVdO1xuICAgIGlmIChtYW5hZ2VyID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgbW9kZWwgbWFuYWdlciBmb3Igc2NoZW1lICcke3NjaGVtZX0nYCk7XG4gICAgfVxuICAgIHJldHVybiBtYW5hZ2VyO1xuICB9XG5cbiAgc3RhdGljIGdldFNjaGVtZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhNb2RlbFN0b3JlTWFuYWdlclJlZ2lzdHJ5LmdldEluc3RhbmNlKCkubWFuYWdlcnMpO1xuICB9XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgcGFyc2luZyBhIFVSTCBzdHJpbmcgaW50byBhIHNjaGVtZSBhbmQgYSBwYXRoLlxuICpcbiAqIEBwYXJhbSB1cmwgRS5nLiwgJ2xvY2Fsc3RvcmFnZTovL215LW1vZGVsJ1xuICogQHJldHVybnMgQSBkaWN0aW9uYXJ5IHdpdGggdHdvIGZpZWxkczogc2NoZW1lIGFuZCBwYXRoLlxuICogICBTY2hlbWU6IGUuZy4sICdsb2NhbHN0b3JhZ2UnIGluIHRoZSBleGFtcGxlIGFib3ZlLlxuICogICBQYXRoOiBlLmcuLCAnbXktbW9kZWwnIGluIHRoZSBleGFtcGxlIGFib3ZlLlxuICovXG5mdW5jdGlvbiBwYXJzZVVSTCh1cmw6IHN0cmluZyk6IHtzY2hlbWU6IHN0cmluZywgcGF0aDogc3RyaW5nfSB7XG4gIGlmICh1cmwuaW5kZXhPZihVUkxfU0NIRU1FX1NVRkZJWCkgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgVGhlIHVybCBzdHJpbmcgcHJvdmlkZWQgZG9lcyBub3QgY29udGFpbiBhIHNjaGVtZS4gYCArXG4gICAgICAgIGBTdXBwb3J0ZWQgc2NoZW1lcyBhcmU6IGAgK1xuICAgICAgICBgJHtNb2RlbFN0b3JlTWFuYWdlclJlZ2lzdHJ5LmdldFNjaGVtZXMoKS5qb2luKCcsJyl9YCk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBzY2hlbWU6IHVybC5zcGxpdChVUkxfU0NIRU1FX1NVRkZJWClbMF0sXG4gICAgcGF0aDogdXJsLnNwbGl0KFVSTF9TQ0hFTUVfU1VGRklYKVsxXSxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY2xvbmVNb2RlbEludGVybmFsKFxuICAgIHNvdXJjZVVSTDogc3RyaW5nLCBkZXN0VVJMOiBzdHJpbmcsXG4gICAgZGVsZXRlU291cmNlID0gZmFsc2UpOiBQcm9taXNlPE1vZGVsQXJ0aWZhY3RzSW5mbz4ge1xuICBhc3NlcnQoXG4gICAgICBzb3VyY2VVUkwgIT09IGRlc3RVUkwsXG4gICAgICAoKSA9PiBgT2xkIHBhdGggYW5kIG5ldyBwYXRoIGFyZSB0aGUgc2FtZTogJyR7c291cmNlVVJMfSdgKTtcblxuICBjb25zdCBsb2FkSGFuZGxlcnMgPSBJT1JvdXRlclJlZ2lzdHJ5LmdldExvYWRIYW5kbGVycyhzb3VyY2VVUkwpO1xuICBhc3NlcnQoXG4gICAgICBsb2FkSGFuZGxlcnMubGVuZ3RoID4gMCxcbiAgICAgICgpID0+IGBDb3B5aW5nIGZhaWxlZCBiZWNhdXNlIG5vIGxvYWQgaGFuZGxlciBpcyBmb3VuZCBmb3Igc291cmNlIFVSTCAke1xuICAgICAgICAgIHNvdXJjZVVSTH0uYCk7XG4gIGFzc2VydChcbiAgICAgIGxvYWRIYW5kbGVycy5sZW5ndGggPCAyLFxuICAgICAgKCkgPT4gYENvcHlpbmcgZmFpbGVkIGJlY2F1c2UgbW9yZSB0aGFuIG9uZSAoJHtsb2FkSGFuZGxlcnMubGVuZ3RofSkgYCArXG4gICAgICAgICAgYGxvYWQgaGFuZGxlcnMgZm9yIHNvdXJjZSBVUkwgJHtzb3VyY2VVUkx9LmApO1xuICBjb25zdCBsb2FkSGFuZGxlciA9IGxvYWRIYW5kbGVyc1swXTtcblxuICBjb25zdCBzYXZlSGFuZGxlcnMgPSBJT1JvdXRlclJlZ2lzdHJ5LmdldFNhdmVIYW5kbGVycyhkZXN0VVJMKTtcbiAgYXNzZXJ0KFxuICAgICAgc2F2ZUhhbmRsZXJzLmxlbmd0aCA+IDAsXG4gICAgICAoKSA9PiBgQ29weWluZyBmYWlsZWQgYmVjYXVzZSBubyBzYXZlIGhhbmRsZXIgaXMgZm91bmQgZm9yIGRlc3RpbmF0aW9uIGAgK1xuICAgICAgICAgIGBVUkwgJHtkZXN0VVJMfS5gKTtcbiAgYXNzZXJ0KFxuICAgICAgc2F2ZUhhbmRsZXJzLmxlbmd0aCA8IDIsXG4gICAgICAoKSA9PiBgQ29weWluZyBmYWlsZWQgYmVjYXVzZSBtb3JlIHRoYW4gb25lICgke2xvYWRIYW5kbGVycy5sZW5ndGh9KSBgICtcbiAgICAgICAgICBgc2F2ZSBoYW5kbGVycyBmb3IgZGVzdGluYXRpb24gVVJMICR7ZGVzdFVSTH0uYCk7XG4gIGNvbnN0IHNhdmVIYW5kbGVyID0gc2F2ZUhhbmRsZXJzWzBdO1xuXG4gIGNvbnN0IHNvdXJjZVNjaGVtZSA9IHBhcnNlVVJMKHNvdXJjZVVSTCkuc2NoZW1lO1xuICBjb25zdCBzb3VyY2VQYXRoID0gcGFyc2VVUkwoc291cmNlVVJMKS5wYXRoO1xuICBjb25zdCBzYW1lTWVkaXVtID0gc291cmNlU2NoZW1lID09PSBwYXJzZVVSTChzb3VyY2VVUkwpLnNjaGVtZTtcblxuICBjb25zdCBtb2RlbEFydGlmYWN0cyA9IGF3YWl0IGxvYWRIYW5kbGVyLmxvYWQoKTtcblxuICAvLyBJZiBtb3Zpbmcgd2l0aGluIHRoZSBzYW1lIHN0b3JhZ2UgbWVkaXVtLCByZW1vdmUgdGhlIG9sZCBtb2RlbCBhcyBzb29uIGFzXG4gIC8vIHRoZSBsb2FkaW5nIGlzIGRvbmUuIFdpdGhvdXQgZG9pbmcgdGhpcywgaXQgaXMgcG9zc2libGUgdGhhdCB0aGUgY29tYmluZWRcbiAgLy8gc2l6ZSBvZiB0aGUgdHdvIG1vZGVscyB3aWxsIGNhdXNlIHRoZSBjbG9uaW5nIHRvIGZhaWwuXG4gIGlmIChkZWxldGVTb3VyY2UgJiYgc2FtZU1lZGl1bSkge1xuICAgIGF3YWl0IE1vZGVsU3RvcmVNYW5hZ2VyUmVnaXN0cnkuZ2V0TWFuYWdlcihzb3VyY2VTY2hlbWUpXG4gICAgICAgIC5yZW1vdmVNb2RlbChzb3VyY2VQYXRoKTtcbiAgfVxuXG4gIGNvbnN0IHNhdmVSZXN1bHQgPSBhd2FpdCBzYXZlSGFuZGxlci5zYXZlKG1vZGVsQXJ0aWZhY3RzKTtcblxuICAvLyBJZiBtb3ZpbmcgYmV0d2VlbiBtZWRpdW1zLCB0aGUgZGVsZXRpb24gaXMgZG9uZSBhZnRlciB0aGUgc2F2ZSBzdWNjZWVkcy5cbiAgLy8gVGhpcyBndWFyZHMgYWdhaW5zdCB0aGUgY2FzZSBpbiB3aGljaCBzYXZpbmcgdG8gdGhlIGRlc3RpbmF0aW9uIG1lZGl1bVxuICAvLyBmYWlscy5cbiAgaWYgKGRlbGV0ZVNvdXJjZSAmJiAhc2FtZU1lZGl1bSkge1xuICAgIGF3YWl0IE1vZGVsU3RvcmVNYW5hZ2VyUmVnaXN0cnkuZ2V0TWFuYWdlcihzb3VyY2VTY2hlbWUpXG4gICAgICAgIC5yZW1vdmVNb2RlbChzb3VyY2VQYXRoKTtcbiAgfVxuXG4gIHJldHVybiBzYXZlUmVzdWx0Lm1vZGVsQXJ0aWZhY3RzSW5mbztcbn1cblxuLyoqXG4gKiBMaXN0IGFsbCBtb2RlbHMgc3RvcmVkIGluIHJlZ2lzdGVyZWQgc3RvcmFnZSBtZWRpdW1zLlxuICpcbiAqIEZvciBhIHdlYiBicm93c2VyIGVudmlyb25tZW50LCB0aGUgcmVnaXN0ZXJlZCBtZWRpdW1zIGFyZSBMb2NhbCBTdG9yYWdlIGFuZFxuICogSW5kZXhlZERCLlxuICpcbiAqIGBgYGpzXG4gKiAvLyBGaXJzdCBjcmVhdGUgYW5kIHNhdmUgYSBtb2RlbC5cbiAqIGNvbnN0IG1vZGVsID0gdGYuc2VxdWVudGlhbCgpO1xuICogbW9kZWwuYWRkKHRmLmxheWVycy5kZW5zZShcbiAqICAgICB7dW5pdHM6IDEsIGlucHV0U2hhcGU6IFsxMF0sIGFjdGl2YXRpb246ICdzaWdtb2lkJ30pKTtcbiAqIGF3YWl0IG1vZGVsLnNhdmUoJ2xvY2Fsc3RvcmFnZTovL2RlbW8vbWFuYWdlbWVudC9tb2RlbDEnKTtcbiAqXG4gKiAvLyBUaGVuIGxpc3QgZXhpc3RpbmcgbW9kZWxzLlxuICogY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoYXdhaXQgdGYuaW8ubGlzdE1vZGVscygpKSk7XG4gKlxuICogLy8gRGVsZXRlIHRoZSBtb2RlbC5cbiAqIGF3YWl0IHRmLmlvLnJlbW92ZU1vZGVsKCdsb2NhbHN0b3JhZ2U6Ly9kZW1vL21hbmFnZW1lbnQvbW9kZWwxJyk7XG4gKlxuICogLy8gTGlzdCBtb2RlbHMgYWdhaW4uXG4gKiBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShhd2FpdCB0Zi5pby5saXN0TW9kZWxzKCkpKTtcbiAqIGBgYFxuICpcbiAqIEByZXR1cm5zIEEgYFByb21pc2VgIG9mIGEgZGljdGlvbmFyeSBtYXBwaW5nIFVSTHMgb2YgZXhpc3RpbmcgbW9kZWxzIHRvXG4gKiB0aGVpciBtb2RlbCBhcnRpZmFjdHMgaW5mby4gVVJMcyBpbmNsdWRlIG1lZGl1bS1zcGVjaWZpYyBzY2hlbWVzLCBlLmcuLFxuICogICAnaW5kZXhlZGRiOi8vbXkvbW9kZWwvMScuIE1vZGVsIGFydGlmYWN0cyBpbmZvIGluY2x1ZGUgdHlwZSBvZiB0aGVcbiAqIG1vZGVsJ3MgdG9wb2xvZ3ksIGJ5dGUgc2l6ZXMgb2YgdGhlIHRvcG9sb2d5LCB3ZWlnaHRzLCBldGMuXG4gKlxuICogQGRvYyB7XG4gKiAgIGhlYWRpbmc6ICdNb2RlbHMnLFxuICogICBzdWJoZWFkaW5nOiAnTWFuYWdlbWVudCcsXG4gKiAgIG5hbWVzcGFjZTogJ2lvJyxcbiAqICAgaWdub3JlQ0k6IHRydWVcbiAqIH1cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbGlzdE1vZGVscygpOiBQcm9taXNlPHtbdXJsOiBzdHJpbmddOiBNb2RlbEFydGlmYWN0c0luZm99PiB7XG4gIGNvbnN0IHNjaGVtZXMgPSBNb2RlbFN0b3JlTWFuYWdlclJlZ2lzdHJ5LmdldFNjaGVtZXMoKTtcbiAgY29uc3Qgb3V0OiB7W3VybDogc3RyaW5nXTogTW9kZWxBcnRpZmFjdHNJbmZvfSA9IHt9O1xuICBmb3IgKGNvbnN0IHNjaGVtZSBvZiBzY2hlbWVzKSB7XG4gICAgY29uc3Qgc2NoZW1lT3V0ID1cbiAgICAgICAgYXdhaXQgTW9kZWxTdG9yZU1hbmFnZXJSZWdpc3RyeS5nZXRNYW5hZ2VyKHNjaGVtZSkubGlzdE1vZGVscygpO1xuICAgIGZvciAoY29uc3QgcGF0aCBpbiBzY2hlbWVPdXQpIHtcbiAgICAgIGNvbnN0IHVybCA9IHNjaGVtZSArIFVSTF9TQ0hFTUVfU1VGRklYICsgcGF0aDtcbiAgICAgIG91dFt1cmxdID0gc2NoZW1lT3V0W3BhdGhdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIFJlbW92ZSBhIG1vZGVsIHNwZWNpZmllZCBieSBVUkwgZnJvbSBhIHJlZ2lzdGVyZWQgc3RvcmFnZSBtZWRpdW0uXG4gKlxuICogYGBganNcbiAqIC8vIEZpcnN0IGNyZWF0ZSBhbmQgc2F2ZSBhIG1vZGVsLlxuICogY29uc3QgbW9kZWwgPSB0Zi5zZXF1ZW50aWFsKCk7XG4gKiBtb2RlbC5hZGQodGYubGF5ZXJzLmRlbnNlKFxuICogICAgIHt1bml0czogMSwgaW5wdXRTaGFwZTogWzEwXSwgYWN0aXZhdGlvbjogJ3NpZ21vaWQnfSkpO1xuICogYXdhaXQgbW9kZWwuc2F2ZSgnbG9jYWxzdG9yYWdlOi8vZGVtby9tYW5hZ2VtZW50L21vZGVsMScpO1xuICpcbiAqIC8vIFRoZW4gbGlzdCBleGlzdGluZyBtb2RlbHMuXG4gKiBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShhd2FpdCB0Zi5pby5saXN0TW9kZWxzKCkpKTtcbiAqXG4gKiAvLyBEZWxldGUgdGhlIG1vZGVsLlxuICogYXdhaXQgdGYuaW8ucmVtb3ZlTW9kZWwoJ2xvY2Fsc3RvcmFnZTovL2RlbW8vbWFuYWdlbWVudC9tb2RlbDEnKTtcbiAqXG4gKiAvLyBMaXN0IG1vZGVscyBhZ2Fpbi5cbiAqIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGF3YWl0IHRmLmlvLmxpc3RNb2RlbHMoKSkpO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHVybCBBIFVSTCB0byBhIHN0b3JlZCBtb2RlbCwgd2l0aCBhIHNjaGVtZSBwcmVmaXgsIGUuZy4sXG4gKiAgICdsb2NhbHN0b3JhZ2U6Ly9teS1tb2RlbC0xJywgJ2luZGV4ZWRkYjovL215L21vZGVsLzInLlxuICogQHJldHVybnMgTW9kZWxBcnRpZmFjdHNJbmZvIG9mIHRoZSBkZWxldGVkIG1vZGVsIChpZiBhbmQgb25seSBpZiBkZWxldGlvblxuICogICBpcyBzdWNjZXNzZnVsKS5cbiAqIEB0aHJvd3MgRXJyb3IgaWYgZGVsZXRpb24gZmFpbHMsIGUuZy4sIGlmIG5vIG1vZGVsIGV4aXN0cyBhdCBgcGF0aGAuXG4gKlxuICogQGRvYyB7XG4gKiAgIGhlYWRpbmc6ICdNb2RlbHMnLFxuICogICBzdWJoZWFkaW5nOiAnTWFuYWdlbWVudCcsXG4gKiAgIG5hbWVzcGFjZTogJ2lvJyxcbiAqICAgaWdub3JlQ0k6IHRydWVcbiAqIH1cbiAqL1xuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlTW9kZWwodXJsOiBzdHJpbmcpOiBQcm9taXNlPE1vZGVsQXJ0aWZhY3RzSW5mbz4ge1xuICBjb25zdCBzY2hlbWVBbmRQYXRoID0gcGFyc2VVUkwodXJsKTtcbiAgY29uc3QgbWFuYWdlciA9IE1vZGVsU3RvcmVNYW5hZ2VyUmVnaXN0cnkuZ2V0TWFuYWdlcihzY2hlbWVBbmRQYXRoLnNjaGVtZSk7XG4gIHJldHVybiBtYW5hZ2VyLnJlbW92ZU1vZGVsKHNjaGVtZUFuZFBhdGgucGF0aCk7XG59XG5cbi8qKlxuICogQ29weSBhIG1vZGVsIGZyb20gb25lIFVSTCB0byBhbm90aGVyLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gc3VwcG9ydHM6XG4gKlxuICogMS4gQ29weWluZyB3aXRoaW4gYSBzdG9yYWdlIG1lZGl1bSwgZS5nLixcbiAqICAgIGB0Zi5pby5jb3B5TW9kZWwoJ2xvY2Fsc3RvcmFnZTovL21vZGVsLTEnLCAnbG9jYWxzdG9yYWdlOi8vbW9kZWwtMicpYFxuICogMi4gQ29weWluZyBiZXR3ZWVuIHR3byBzdG9yYWdlIG1lZGl1bXMsIGUuZy4sXG4gKiAgICBgdGYuaW8uY29weU1vZGVsKCdsb2NhbHN0b3JhZ2U6Ly9tb2RlbC0xJywgJ2luZGV4ZWRkYjovL21vZGVsLTEnKWBcbiAqXG4gKiBgYGBqc1xuICogLy8gRmlyc3QgY3JlYXRlIGFuZCBzYXZlIGEgbW9kZWwuXG4gKiBjb25zdCBtb2RlbCA9IHRmLnNlcXVlbnRpYWwoKTtcbiAqIG1vZGVsLmFkZCh0Zi5sYXllcnMuZGVuc2UoXG4gKiAgICAge3VuaXRzOiAxLCBpbnB1dFNoYXBlOiBbMTBdLCBhY3RpdmF0aW9uOiAnc2lnbW9pZCd9KSk7XG4gKiBhd2FpdCBtb2RlbC5zYXZlKCdsb2NhbHN0b3JhZ2U6Ly9kZW1vL21hbmFnZW1lbnQvbW9kZWwxJyk7XG4gKlxuICogLy8gVGhlbiBsaXN0IGV4aXN0aW5nIG1vZGVscy5cbiAqIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGF3YWl0IHRmLmlvLmxpc3RNb2RlbHMoKSkpO1xuICpcbiAqIC8vIENvcHkgdGhlIG1vZGVsLCBmcm9tIExvY2FsIFN0b3JhZ2UgdG8gSW5kZXhlZERCLlxuICogYXdhaXQgdGYuaW8uY29weU1vZGVsKFxuICogICAgICdsb2NhbHN0b3JhZ2U6Ly9kZW1vL21hbmFnZW1lbnQvbW9kZWwxJyxcbiAqICAgICAnaW5kZXhlZGRiOi8vZGVtby9tYW5hZ2VtZW50L21vZGVsMScpO1xuICpcbiAqIC8vIExpc3QgbW9kZWxzIGFnYWluLlxuICogY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoYXdhaXQgdGYuaW8ubGlzdE1vZGVscygpKSk7XG4gKlxuICogLy8gUmVtb3ZlIGJvdGggbW9kZWxzLlxuICogYXdhaXQgdGYuaW8ucmVtb3ZlTW9kZWwoJ2xvY2Fsc3RvcmFnZTovL2RlbW8vbWFuYWdlbWVudC9tb2RlbDEnKTtcbiAqIGF3YWl0IHRmLmlvLnJlbW92ZU1vZGVsKCdpbmRleGVkZGI6Ly9kZW1vL21hbmFnZW1lbnQvbW9kZWwxJyk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gc291cmNlVVJMIFNvdXJjZSBVUkwgb2YgY29weWluZy5cbiAqIEBwYXJhbSBkZXN0VVJMIERlc3RpbmF0aW9uIFVSTCBvZiBjb3B5aW5nLlxuICogQHJldHVybnMgTW9kZWxBcnRpZmFjdHNJbmZvIG9mIHRoZSBjb3BpZWQgbW9kZWwgKGlmIGFuZCBvbmx5IGlmIGNvcHlpbmdcbiAqICAgaXMgc3VjY2Vzc2Z1bCkuXG4gKiBAdGhyb3dzIEVycm9yIGlmIGNvcHlpbmcgZmFpbHMsIGUuZy4sIGlmIG5vIG1vZGVsIGV4aXN0cyBhdCBgc291cmNlVVJMYCwgb3JcbiAqICAgaWYgYG9sZFBhdGhgIGFuZCBgbmV3UGF0aGAgYXJlIGlkZW50aWNhbC5cbiAqXG4gKiBAZG9jIHtcbiAqICAgaGVhZGluZzogJ01vZGVscycsXG4gKiAgIHN1YmhlYWRpbmc6ICdNYW5hZ2VtZW50JyxcbiAqICAgbmFtZXNwYWNlOiAnaW8nLFxuICogICBpZ25vcmVDSTogdHJ1ZVxuICogfVxuICovXG5hc3luYyBmdW5jdGlvbiBjb3B5TW9kZWwoXG4gICAgc291cmNlVVJMOiBzdHJpbmcsIGRlc3RVUkw6IHN0cmluZyk6IFByb21pc2U8TW9kZWxBcnRpZmFjdHNJbmZvPiB7XG4gIGNvbnN0IGRlbGV0ZVNvdXJjZSA9IGZhbHNlO1xuICByZXR1cm4gY2xvbmVNb2RlbEludGVybmFsKHNvdXJjZVVSTCwgZGVzdFVSTCwgZGVsZXRlU291cmNlKTtcbn1cblxuLyoqXG4gKiBNb3ZlIGEgbW9kZWwgZnJvbSBvbmUgVVJMIHRvIGFub3RoZXIuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBzdXBwb3J0czpcbiAqXG4gKiAxLiBNb3Zpbmcgd2l0aGluIGEgc3RvcmFnZSBtZWRpdW0sIGUuZy4sXG4gKiAgICBgdGYuaW8ubW92ZU1vZGVsKCdsb2NhbHN0b3JhZ2U6Ly9tb2RlbC0xJywgJ2xvY2Fsc3RvcmFnZTovL21vZGVsLTInKWBcbiAqIDIuIE1vdmluZyBiZXR3ZWVuIHR3byBzdG9yYWdlIG1lZGl1bXMsIGUuZy4sXG4gKiAgICBgdGYuaW8ubW92ZU1vZGVsKCdsb2NhbHN0b3JhZ2U6Ly9tb2RlbC0xJywgJ2luZGV4ZWRkYjovL21vZGVsLTEnKWBcbiAqXG4gKiBgYGBqc1xuICogLy8gRmlyc3QgY3JlYXRlIGFuZCBzYXZlIGEgbW9kZWwuXG4gKiBjb25zdCBtb2RlbCA9IHRmLnNlcXVlbnRpYWwoKTtcbiAqIG1vZGVsLmFkZCh0Zi5sYXllcnMuZGVuc2UoXG4gKiAgICAge3VuaXRzOiAxLCBpbnB1dFNoYXBlOiBbMTBdLCBhY3RpdmF0aW9uOiAnc2lnbW9pZCd9KSk7XG4gKiBhd2FpdCBtb2RlbC5zYXZlKCdsb2NhbHN0b3JhZ2U6Ly9kZW1vL21hbmFnZW1lbnQvbW9kZWwxJyk7XG4gKlxuICogLy8gVGhlbiBsaXN0IGV4aXN0aW5nIG1vZGVscy5cbiAqIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGF3YWl0IHRmLmlvLmxpc3RNb2RlbHMoKSkpO1xuICpcbiAqIC8vIE1vdmUgdGhlIG1vZGVsLCBmcm9tIExvY2FsIFN0b3JhZ2UgdG8gSW5kZXhlZERCLlxuICogYXdhaXQgdGYuaW8ubW92ZU1vZGVsKFxuICogICAgICdsb2NhbHN0b3JhZ2U6Ly9kZW1vL21hbmFnZW1lbnQvbW9kZWwxJyxcbiAqICAgICAnaW5kZXhlZGRiOi8vZGVtby9tYW5hZ2VtZW50L21vZGVsMScpO1xuICpcbiAqIC8vIExpc3QgbW9kZWxzIGFnYWluLlxuICogY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoYXdhaXQgdGYuaW8ubGlzdE1vZGVscygpKSk7XG4gKlxuICogLy8gUmVtb3ZlIHRoZSBtb3ZlZCBtb2RlbC5cbiAqIGF3YWl0IHRmLmlvLnJlbW92ZU1vZGVsKCdpbmRleGVkZGI6Ly9kZW1vL21hbmFnZW1lbnQvbW9kZWwxJyk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gc291cmNlVVJMIFNvdXJjZSBVUkwgb2YgbW92aW5nLlxuICogQHBhcmFtIGRlc3RVUkwgRGVzdGluYXRpb24gVVJMIG9mIG1vdmluZy5cbiAqIEByZXR1cm5zIE1vZGVsQXJ0aWZhY3RzSW5mbyBvZiB0aGUgY29waWVkIG1vZGVsIChpZiBhbmQgb25seSBpZiBjb3B5aW5nXG4gKiAgIGlzIHN1Y2Nlc3NmdWwpLlxuICogQHRocm93cyBFcnJvciBpZiBtb3ZpbmcgZmFpbHMsIGUuZy4sIGlmIG5vIG1vZGVsIGV4aXN0cyBhdCBgc291cmNlVVJMYCwgb3JcbiAqICAgaWYgYG9sZFBhdGhgIGFuZCBgbmV3UGF0aGAgYXJlIGlkZW50aWNhbC5cbiAqXG4gKiBAZG9jIHtcbiAqICAgaGVhZGluZzogJ01vZGVscycsXG4gKiAgIHN1YmhlYWRpbmc6ICdNYW5hZ2VtZW50JyxcbiAqICAgbmFtZXNwYWNlOiAnaW8nLFxuICogICBpZ25vcmVDSTogdHJ1ZVxuICogfVxuICovXG5hc3luYyBmdW5jdGlvbiBtb3ZlTW9kZWwoXG4gICAgc291cmNlVVJMOiBzdHJpbmcsIGRlc3RVUkw6IHN0cmluZyk6IFByb21pc2U8TW9kZWxBcnRpZmFjdHNJbmZvPiB7XG4gIGNvbnN0IGRlbGV0ZVNvdXJjZSA9IHRydWU7XG4gIHJldHVybiBjbG9uZU1vZGVsSW50ZXJuYWwoc291cmNlVVJMLCBkZXN0VVJMLCBkZWxldGVTb3VyY2UpO1xufVxuXG5leHBvcnQge21vdmVNb2RlbCwgY29weU1vZGVsLCByZW1vdmVNb2RlbCwgbGlzdE1vZGVsc307XG4iXX0=