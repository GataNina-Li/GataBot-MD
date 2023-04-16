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
 * IOHandler implementations based on HTTP requests in the web browser.
 *
 * Uses [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
 */
import { env } from '../environment';
import { assert } from '../util';
import { concatenateArrayBuffers, getModelArtifactsForJSON, getModelArtifactsInfoForJSON, getModelJSONForModelArtifacts, getWeightSpecs } from './io_utils';
import { IORouterRegistry } from './router_registry';
import { loadWeightsAsArrayBuffer } from './weights_loader';
const OCTET_STREAM_MIME_TYPE = 'application/octet-stream';
const JSON_TYPE = 'application/json';
export class HTTPRequest {
    constructor(path, loadOptions) {
        this.DEFAULT_METHOD = 'POST';
        if (loadOptions == null) {
            loadOptions = {};
        }
        this.weightPathPrefix = loadOptions.weightPathPrefix;
        this.onProgress = loadOptions.onProgress;
        this.weightUrlConverter = loadOptions.weightUrlConverter;
        if (loadOptions.fetchFunc != null) {
            assert(typeof loadOptions.fetchFunc === 'function', () => 'Must pass a function that matches the signature of ' +
                '`fetch` (see ' +
                'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)');
            this.fetch = loadOptions.fetchFunc;
        }
        else {
            this.fetch = env().platform.fetch;
        }
        assert(path != null && path.length > 0, () => 'URL path for http must not be null, undefined or ' +
            'empty.');
        if (Array.isArray(path)) {
            assert(path.length === 2, () => 'URL paths for http must have a length of 2, ' +
                `(actual length is ${path.length}).`);
        }
        this.path = path;
        if (loadOptions.requestInit != null &&
            loadOptions.requestInit.body != null) {
            throw new Error('requestInit is expected to have no pre-existing body, but has one.');
        }
        this.requestInit = loadOptions.requestInit || {};
    }
    async save(modelArtifacts) {
        if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
            throw new Error('BrowserHTTPRequest.save() does not support saving model topology ' +
                'in binary formats yet.');
        }
        const init = Object.assign({ method: this.DEFAULT_METHOD }, this.requestInit);
        init.body = new FormData();
        const weightsManifest = [{
                paths: ['./model.weights.bin'],
                weights: modelArtifacts.weightSpecs,
            }];
        const modelTopologyAndWeightManifest = getModelJSONForModelArtifacts(modelArtifacts, weightsManifest);
        init.body.append('model.json', new Blob([JSON.stringify(modelTopologyAndWeightManifest)], { type: JSON_TYPE }), 'model.json');
        if (modelArtifacts.weightData != null) {
            init.body.append('model.weights.bin', new Blob([modelArtifacts.weightData], { type: OCTET_STREAM_MIME_TYPE }), 'model.weights.bin');
        }
        const response = await this.fetch(this.path, init);
        if (response.ok) {
            return {
                modelArtifactsInfo: getModelArtifactsInfoForJSON(modelArtifacts),
                responses: [response],
            };
        }
        else {
            throw new Error(`BrowserHTTPRequest.save() failed due to HTTP response status ` +
                `${response.status}.`);
        }
    }
    /**
     * Load model artifacts via HTTP request(s).
     *
     * See the documentation to `tf.io.http` for details on the saved
     * artifacts.
     *
     * @returns The loaded model artifacts (if loading succeeds).
     */
    async load() {
        const modelConfigRequest = await this.fetch(this.path, this.requestInit);
        if (!modelConfigRequest.ok) {
            throw new Error(`Request to ${this.path} failed with status code ` +
                `${modelConfigRequest.status}. Please verify this URL points to ` +
                `the model JSON of the model to load.`);
        }
        let modelJSON;
        try {
            modelJSON = await modelConfigRequest.json();
        }
        catch (e) {
            let message = `Failed to parse model JSON of response from ${this.path}.`;
            // TODO(nsthorat): Remove this after some time when we're comfortable that
            // .pb files are mostly gone.
            if (this.path.endsWith('.pb')) {
                message += ' Your path contains a .pb file extension. ' +
                    'Support for .pb models have been removed in TensorFlow.js 1.0 ' +
                    'in favor of .json models. You can re-convert your Python ' +
                    'TensorFlow model using the TensorFlow.js 1.0 conversion scripts ' +
                    'or you can convert your.pb models with the \'pb2json\'' +
                    'NPM script in the tensorflow/tfjs-converter repository.';
            }
            else {
                message += ' Please make sure the server is serving valid ' +
                    'JSON for this request.';
            }
            throw new Error(message);
        }
        // We do not allow both modelTopology and weightsManifest to be missing.
        const modelTopology = modelJSON.modelTopology;
        const weightsManifest = modelJSON.weightsManifest;
        if (modelTopology == null && weightsManifest == null) {
            throw new Error(`The JSON from HTTP path ${this.path} contains neither model ` +
                `topology or manifest for weights.`);
        }
        return getModelArtifactsForJSON(modelJSON, (weightsManifest) => this.loadWeights(weightsManifest));
    }
    async loadWeights(weightsManifest) {
        const weightPath = Array.isArray(this.path) ? this.path[1] : this.path;
        const [prefix, suffix] = parseUrl(weightPath);
        const pathPrefix = this.weightPathPrefix || prefix;
        const weightSpecs = getWeightSpecs(weightsManifest);
        const fetchURLs = [];
        const urlPromises = [];
        for (const weightsGroup of weightsManifest) {
            for (const path of weightsGroup.paths) {
                if (this.weightUrlConverter != null) {
                    urlPromises.push(this.weightUrlConverter(path));
                }
                else {
                    fetchURLs.push(pathPrefix + path + suffix);
                }
            }
        }
        if (this.weightUrlConverter) {
            fetchURLs.push(...await Promise.all(urlPromises));
        }
        const buffers = await loadWeightsAsArrayBuffer(fetchURLs, {
            requestInit: this.requestInit,
            fetchFunc: this.fetch,
            onProgress: this.onProgress
        });
        return [weightSpecs, concatenateArrayBuffers(buffers)];
    }
}
HTTPRequest.URL_SCHEME_REGEX = /^https?:\/\//;
/**
 * Extract the prefix and suffix of the url, where the prefix is the path before
 * the last file, and suffix is the search params after the last file.
 * ```
 * const url = 'http://tfhub.dev/model/1/tensorflowjs_model.pb?tfjs-format=file'
 * [prefix, suffix] = parseUrl(url)
 * // prefix = 'http://tfhub.dev/model/1/'
 * // suffix = '?tfjs-format=file'
 * ```
 * @param url the model url to be parsed.
 */
export function parseUrl(url) {
    const lastSlash = url.lastIndexOf('/');
    const lastSearchParam = url.lastIndexOf('?');
    const prefix = url.substring(0, lastSlash);
    const suffix = lastSearchParam > lastSlash ? url.substring(lastSearchParam) : '';
    return [prefix + '/', suffix];
}
export function isHTTPScheme(url) {
    return url.match(HTTPRequest.URL_SCHEME_REGEX) != null;
}
export const httpRouter = (url, loadOptions) => {
    if (typeof fetch === 'undefined' &&
        (loadOptions == null || loadOptions.fetchFunc == null)) {
        // `http` uses `fetch` or `node-fetch`, if one wants to use it in
        // an environment that is not the browser or node they have to setup a
        // global fetch polyfill.
        return null;
    }
    else {
        let isHTTP = true;
        if (Array.isArray(url)) {
            isHTTP = url.every(urlItem => isHTTPScheme(urlItem));
        }
        else {
            isHTTP = isHTTPScheme(url);
        }
        if (isHTTP) {
            return http(url, loadOptions);
        }
    }
    return null;
};
IORouterRegistry.registerSaveRouter(httpRouter);
IORouterRegistry.registerLoadRouter(httpRouter);
/**
 * Creates an IOHandler subtype that sends model artifacts to HTTP server.
 *
 * An HTTP request of the `multipart/form-data` mime type will be sent to the
 * `path` URL. The form data includes artifacts that represent the topology
 * and/or weights of the model. In the case of Keras-style `tf.Model`, two
 * blobs (files) exist in form-data:
 *   - A JSON file consisting of `modelTopology` and `weightsManifest`.
 *   - A binary weights file consisting of the concatenated weight values.
 * These files are in the same format as the one generated by
 * [tfjs_converter](https://js.tensorflow.org/tutorials/import-keras.html).
 *
 * The following code snippet exemplifies the client-side code that uses this
 * function:
 *
 * ```js
 * const model = tf.sequential();
 * model.add(
 *     tf.layers.dense({units: 1, inputShape: [100], activation: 'sigmoid'}));
 *
 * const saveResult = await model.save(tf.io.http(
 *     'http://model-server:5000/upload', {requestInit: {method: 'PUT'}}));
 * console.log(saveResult);
 * ```
 *
 * If the default `POST` method is to be used, without any custom parameters
 * such as headers, you can simply pass an HTTP or HTTPS URL to `model.save`:
 *
 * ```js
 * const saveResult = await model.save('http://model-server:5000/upload');
 * ```
 *
 * The following GitHub Gist
 * https://gist.github.com/dsmilkov/1b6046fd6132d7408d5257b0976f7864
 * implements a server based on [flask](https://github.com/pallets/flask) that
 * can receive the request. Upon receiving the model artifacts via the requst,
 * this particular server reconstitutes instances of [Keras
 * Models](https://keras.io/models/model/) in memory.
 *
 *
 * @param path A URL path to the model.
 *   Can be an absolute HTTP path (e.g.,
 *   'http://localhost:8000/model-upload)') or a relative path (e.g.,
 *   './model-upload').
 * @param requestInit Request configurations to be used when sending
 *    HTTP request to server using `fetch`. It can contain fields such as
 *    `method`, `credentials`, `headers`, `mode`, etc. See
 *    https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
 *    for more information. `requestInit` must not have a body, because the
 * body will be set by TensorFlow.js. File blobs representing the model
 * topology (filename: 'model.json') and the weights of the model (filename:
 * 'model.weights.bin') will be appended to the body. If `requestInit` has a
 * `body`, an Error will be thrown.
 * @param loadOptions Optional configuration for the loading. It includes the
 *   following fields:
 *   - weightPathPrefix Optional, this specifies the path prefix for weight
 *     files, by default this is calculated from the path param.
 *   - fetchFunc Optional, custom `fetch` function. E.g., in Node.js,
 *     the `fetch` from node-fetch can be used here.
 *   - onProgress Optional, progress callback function, fired periodically
 *     before the load is completed.
 * @returns An instance of `IOHandler`.
 *
 * @doc {
 *   heading: 'Models',
 *   subheading: 'Loading',
 *   namespace: 'io',
 *   ignoreCI: true
 * }
 */
export function http(path, loadOptions) {
    return new HTTPRequest(path, loadOptions);
}
/**
 * Deprecated. Use `tf.io.http`.
 * @param path
 * @param loadOptions
 */
export function browserHTTPRequest(path, loadOptions) {
    return http(path, loadOptions);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvaW8vaHR0cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSDs7OztHQUlHO0FBRUgsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRW5DLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDL0IsT0FBTyxFQUFDLHVCQUF1QixFQUFFLHdCQUF3QixFQUFFLDRCQUE0QixFQUFFLDZCQUE2QixFQUFFLGNBQWMsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUMxSixPQUFPLEVBQVcsZ0JBQWdCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUU3RCxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUUxRCxNQUFNLHNCQUFzQixHQUFHLDBCQUEwQixDQUFDO0FBQzFELE1BQU0sU0FBUyxHQUFHLGtCQUFrQixDQUFDO0FBQ3JDLE1BQU0sT0FBTyxXQUFXO0lBY3RCLFlBQVksSUFBWSxFQUFFLFdBQXlCO1FBUDFDLG1CQUFjLEdBQUcsTUFBTSxDQUFDO1FBUS9CLElBQUksV0FBVyxJQUFJLElBQUksRUFBRTtZQUN2QixXQUFXLEdBQUcsRUFBRSxDQUFDO1NBQ2xCO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQztRQUNyRCxJQUFJLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUM7UUFDekMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQztRQUV6RCxJQUFJLFdBQVcsQ0FBQyxTQUFTLElBQUksSUFBSSxFQUFFO1lBQ2pDLE1BQU0sQ0FDRixPQUFPLFdBQVcsQ0FBQyxTQUFTLEtBQUssVUFBVSxFQUMzQyxHQUFHLEVBQUUsQ0FBQyxxREFBcUQ7Z0JBQ3ZELGVB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b2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuLyoqXG4gKiBJT0hhbmRsZXIgaW1wbGVtZW50YXRpb25zIGJhc2VkIG9uIEhUVFAgcmVxdWVzdHMgaW4gdGhlIHdlYiBicm93c2VyLlxuICpcbiAqIFVzZXMgW2BmZXRjaGBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GZXRjaF9BUEkpLlxuICovXG5cbmltcG9ydCB7ZW52fSBmcm9tICcuLi9lbnZpcm9ubWVudCc7XG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7Y29uY2F0ZW5hdGVBcnJheUJ1ZmZlcnMsIGdldE1vZGVsQXJ0aWZhY3RzRm9ySlNPTiwgZ2V0TW9kZWxBcnRpZmFjdHNJbmZvRm9ySlNPTiwgZ2V0TW9kZWxKU09ORm9yTW9kZWxBcnRpZmFjdHMsIGdldFdlaWdodFNwZWNzfSBmcm9tICcuL2lvX3V0aWxzJztcbmltcG9ydCB7SU9Sb3V0ZXIsIElPUm91dGVyUmVnaXN0cnl9IGZyb20gJy4vcm91dGVyX3JlZ2lzdHJ5JztcbmltcG9ydCB7SU9IYW5kbGVyLCBMb2FkT3B0aW9ucywgTW9kZWxBcnRpZmFjdHMsIE1vZGVsSlNPTiwgT25Qcm9ncmVzc0NhbGxiYWNrLCBTYXZlUmVzdWx0LCBXZWlnaHRzTWFuaWZlc3RDb25maWcsIFdlaWdodHNNYW5pZmVzdEVudHJ5fSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7bG9hZFdlaWdodHNBc0FycmF5QnVmZmVyfSBmcm9tICcuL3dlaWdodHNfbG9hZGVyJztcblxuY29uc3QgT0NURVRfU1RSRUFNX01JTUVfVFlQRSA9ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuY29uc3QgSlNPTl9UWVBFID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuZXhwb3J0IGNsYXNzIEhUVFBSZXF1ZXN0IGltcGxlbWVudHMgSU9IYW5kbGVyIHtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHBhdGg6IHN0cmluZztcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHJlcXVlc3RJbml0OiBSZXF1ZXN0SW5pdDtcblxuICBwcml2YXRlIHJlYWRvbmx5IGZldGNoOiBGdW5jdGlvbjtcbiAgcHJpdmF0ZSByZWFkb25seSB3ZWlnaHRVcmxDb252ZXJ0ZXI6ICh3ZWlnaHROYW1lOiBzdHJpbmcpID0+IFByb21pc2U8c3RyaW5nPjtcblxuICByZWFkb25seSBERUZBVUxUX01FVEhPRCA9ICdQT1NUJztcblxuICBzdGF0aWMgcmVhZG9ubHkgVVJMX1NDSEVNRV9SRUdFWCA9IC9eaHR0cHM/OlxcL1xcLy87XG5cbiAgcHJpdmF0ZSByZWFkb25seSB3ZWlnaHRQYXRoUHJlZml4OiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgb25Qcm9ncmVzczogT25Qcm9ncmVzc0NhbGxiYWNrO1xuXG4gIGNvbnN0cnVjdG9yKHBhdGg6IHN0cmluZywgbG9hZE9wdGlvbnM/OiBMb2FkT3B0aW9ucykge1xuICAgIGlmIChsb2FkT3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICBsb2FkT3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICB0aGlzLndlaWdodFBhdGhQcmVmaXggPSBsb2FkT3B0aW9ucy53ZWlnaHRQYXRoUHJlZml4O1xuICAgIHRoaXMub25Qcm9ncmVzcyA9IGxvYWRPcHRpb25zLm9uUHJvZ3Jlc3M7XG4gICAgdGhpcy53ZWlnaHRVcmxDb252ZXJ0ZXIgPSBsb2FkT3B0aW9ucy53ZWlnaHRVcmxDb252ZXJ0ZXI7XG5cbiAgICBpZiAobG9hZE9wdGlvbnMuZmV0Y2hGdW5jICE9IG51bGwpIHtcbiAgICAgIGFzc2VydChcbiAgICAgICAgICB0eXBlb2YgbG9hZE9wdGlvbnMuZmV0Y2hGdW5jID09PSAnZnVuY3Rpb24nLFxuICAgICAgICAgICgpID0+ICdNdXN0IHBhc3MgYSBmdW5jdGlvbiB0aGF0IG1hdGNoZXMgdGhlIHNpZ25hdHVyZSBvZiAnICtcbiAgICAgICAgICAgICAgJ2BmZXRjaGAgKHNlZSAnICtcbiAgICAgICAgICAgICAgJ2h0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GZXRjaF9BUEkpJyk7XG4gICAgICB0aGlzLmZldGNoID0gbG9hZE9wdGlvbnMuZmV0Y2hGdW5jO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZldGNoID0gZW52KCkucGxhdGZvcm0uZmV0Y2g7XG4gICAgfVxuXG4gICAgYXNzZXJ0KFxuICAgICAgICBwYXRoICE9IG51bGwgJiYgcGF0aC5sZW5ndGggPiAwLFxuICAgICAgICAoKSA9PiAnVVJMIHBhdGggZm9yIGh0dHAgbXVzdCBub3QgYmUgbnVsbCwgdW5kZWZpbmVkIG9yICcgK1xuICAgICAgICAgICAgJ2VtcHR5LicpO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGF0aCkpIHtcbiAgICAgIGFzc2VydChcbiAgICAgICAgICBwYXRoLmxlbmd0aCA9PT0gMixcbiAgICAgICAgICAoKSA9PiAnVVJMIHBhdGhzIGZvciBodHRwIG11c3QgaGF2ZSBhIGxlbmd0aCBvZiAyLCAnICtcbiAgICAgICAgICAgICAgYChhY3R1YWwgbGVuZ3RoIGlzICR7cGF0aC5sZW5ndGh9KS5gKTtcbiAgICB9XG4gICAgdGhpcy5wYXRoID0gcGF0aDtcblxuICAgIGlmIChsb2FkT3B0aW9ucy5yZXF1ZXN0SW5pdCAhPSBudWxsICYmXG4gICAgICAgIGxvYWRPcHRpb25zLnJlcXVlc3RJbml0LmJvZHkgIT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdyZXF1ZXN0SW5pdCBpcyBleHBlY3RlZCB0byBoYXZlIG5vIHByZS1leGlzdGluZyBib2R5LCBidXQgaGFzIG9uZS4nKTtcbiAgICB9XG4gICAgdGhpcy5yZXF1ZXN0SW5pdCA9IGxvYWRPcHRpb25zLnJlcXVlc3RJbml0IHx8IHt9O1xuICB9XG5cbiAgYXN5bmMgc2F2ZShtb2RlbEFydGlmYWN0czogTW9kZWxBcnRpZmFjdHMpOiBQcm9taXNlPFNhdmVSZXN1bHQ+IHtcbiAgICBpZiAobW9kZWxBcnRpZmFjdHMubW9kZWxUb3BvbG9neSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ0Jyb3dzZXJIVFRQUmVxdWVzdC5zYXZlKCkgZG9lcyBub3Qgc3VwcG9ydCBzYXZpbmcgbW9kZWwgdG9wb2xvZ3kgJyArXG4gICAgICAgICAgJ2luIGJpbmFyeSBmb3JtYXRzIHlldC4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBpbml0ID0gT2JqZWN0LmFzc2lnbih7bWV0aG9kOiB0aGlzLkRFRkFVTFRfTUVUSE9EfSwgdGhpcy5yZXF1ZXN0SW5pdCk7XG4gICAgaW5pdC5ib2R5ID0gbmV3IEZvcm1EYXRhKCk7XG5cbiAgICBjb25zdCB3ZWlnaHRzTWFuaWZlc3Q6IFdlaWdodHNNYW5pZmVzdENvbmZpZyA9IFt7XG4gICAgICBwYXRoczogWycuL21vZGVsLndlaWdodHMuYmluJ10sXG4gICAgICB3ZWlnaHRzOiBtb2RlbEFydGlmYWN0cy53ZWlnaHRTcGVjcyxcbiAgICB9XTtcbiAgICBjb25zdCBtb2RlbFRvcG9sb2d5QW5kV2VpZ2h0TWFuaWZlc3Q6IE1vZGVsSlNPTiA9XG4gICAgICAgIGdldE1vZGVsSlNPTkZvck1vZGVsQXJ0aWZhY3RzKG1vZGVsQXJ0aWZhY3RzLCB3ZWlnaHRzTWFuaWZlc3QpO1xuXG4gICAgaW5pdC5ib2R5LmFwcGVuZChcbiAgICAgICAgJ21vZGVsLmpzb24nLFxuICAgICAgICBuZXcgQmxvYihcbiAgICAgICAgICAgIFtKU09OLnN0cmluZ2lmeShtb2RlbFRvcG9sb2d5QW5kV2VpZ2h0TWFuaWZlc3QpXSxcbiAgICAgICAgICAgIHt0eXBlOiBKU09OX1RZUEV9KSxcbiAgICAgICAgJ21vZGVsLmpzb24nKTtcblxuICAgIGlmIChtb2RlbEFydGlmYWN0cy53ZWlnaHREYXRhICE9IG51bGwpIHtcbiAgICAgIGluaXQuYm9keS5hcHBlbmQoXG4gICAgICAgICAgJ21vZGVsLndlaWdodHMuYmluJyxcbiAgICAgICAgICBuZXcgQmxvYihbbW9kZWxBcnRpZmFjdHMud2VpZ2h0RGF0YV0sIHt0eXBlOiBPQ1RFVF9TVFJFQU1fTUlNRV9UWVBFfSksXG4gICAgICAgICAgJ21vZGVsLndlaWdodHMuYmluJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmZldGNoKHRoaXMucGF0aCwgaW5pdCk7XG5cbiAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1vZGVsQXJ0aWZhY3RzSW5mbzogZ2V0TW9kZWxBcnRpZmFjdHNJbmZvRm9ySlNPTihtb2RlbEFydGlmYWN0cyksXG4gICAgICAgIHJlc3BvbnNlczogW3Jlc3BvbnNlXSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgQnJvd3NlckhUVFBSZXF1ZXN0LnNhdmUoKSBmYWlsZWQgZHVlIHRvIEhUVFAgcmVzcG9uc2Ugc3RhdHVzIGAgK1xuICAgICAgICAgIGAke3Jlc3BvbnNlLnN0YXR1c30uYCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgbW9kZWwgYXJ0aWZhY3RzIHZpYSBIVFRQIHJlcXVlc3QocykuXG4gICAqXG4gICAqIFNlZSB0aGUgZG9jdW1lbnRhdGlvbiB0byBgdGYuaW8uaHR0cGAgZm9yIGRldGFpbHMgb24gdGhlIHNhdmVkXG4gICAqIGFydGlmYWN0cy5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIGxvYWRlZCBtb2RlbCBhcnRpZmFjdHMgKGlmIGxvYWRpbmcgc3VjY2VlZHMpLlxuICAgKi9cbiAgYXN5bmMgbG9hZCgpOiBQcm9taXNlPE1vZGVsQXJ0aWZhY3RzPiB7XG4gICAgY29uc3QgbW9kZWxDb25maWdSZXF1ZXN0ID0gYXdhaXQgdGhpcy5mZXRjaCh0aGlzLnBhdGgsIHRoaXMucmVxdWVzdEluaXQpO1xuXG4gICAgaWYgKCFtb2RlbENvbmZpZ1JlcXVlc3Qub2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgUmVxdWVzdCB0byAke3RoaXMucGF0aH0gZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgYCArXG4gICAgICAgICAgYCR7bW9kZWxDb25maWdSZXF1ZXN0LnN0YXR1c30uIFBsZWFzZSB2ZXJpZnkgdGhpcyBVUkwgcG9pbnRzIHRvIGAgK1xuICAgICAgICAgIGB0aGUgbW9kZWwgSlNPTiBvZiB0aGUgbW9kZWwgdG8gbG9hZC5gKTtcbiAgICB9XG4gICAgbGV0IG1vZGVsSlNPTjogTW9kZWxKU09OO1xuICAgIHRyeSB7XG4gICAgICBtb2RlbEpTT04gPSBhd2FpdCBtb2RlbENvbmZpZ1JlcXVlc3QuanNvbigpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGxldCBtZXNzYWdlID0gYEZhaWxlZCB0byBwYXJzZSBtb2RlbCBKU09OIG9mIHJlc3BvbnNlIGZyb20gJHt0aGlzLnBhdGh9LmA7XG4gICAgICAvLyBUT0RPKG5zdGhvcmF0KTogUmVtb3ZlIHRoaXMgYWZ0ZXIgc29tZSB0aW1lIHdoZW4gd2UncmUgY29tZm9ydGFibGUgdGhhdFxuICAgICAgLy8gLnBiIGZpbGVzIGFyZSBtb3N0bHkgZ29uZS5cbiAgICAgIGlmICh0aGlzLnBhdGguZW5kc1dpdGgoJy5wYicpKSB7XG4gICAgICAgIG1lc3NhZ2UgKz0gJyBZb3VyIHBhdGggY29udGFpbnMgYSAucGIgZmlsZSBleHRlbnNpb24uICcgK1xuICAgICAgICAgICAgJ1N1cHBvcnQgZm9yIC5wYiBtb2RlbHMgaGF2ZSBiZWVuIHJlbW92ZWQgaW4gVGVuc29yRmxvdy5qcyAxLjAgJyArXG4gICAgICAgICAgICAnaW4gZmF2b3Igb2YgLmpzb24gbW9kZWxzLiBZb3UgY2FuIHJlLWNvbnZlcnQgeW91ciBQeXRob24gJyArXG4gICAgICAgICAgICAnVGVuc29yRmxvdyBtb2RlbCB1c2luZyB0aGUgVGVuc29yRmxvdy5qcyAxLjAgY29udmVyc2lvbiBzY3JpcHRzICcgK1xuICAgICAgICAgICAgJ29yIHlvdSBjYW4gY29udmVydCB5b3VyLnBiIG1vZGVscyB3aXRoIHRoZSBcXCdwYjJqc29uXFwnJyArXG4gICAgICAgICAgICAnTlBNIHNjcmlwdCBpbiB0aGUgdGVuc29yZmxvdy90ZmpzLWNvbnZlcnRlciByZXBvc2l0b3J5Lic7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZXNzYWdlICs9ICcgUGxlYXNlIG1ha2Ugc3VyZSB0aGUgc2VydmVyIGlzIHNlcnZpbmcgdmFsaWQgJyArXG4gICAgICAgICAgICAnSlNPTiBmb3IgdGhpcyByZXF1ZXN0Lic7XG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfVxuXG4gICAgLy8gV2UgZG8gbm90IGFsbG93IGJvdGggbW9kZWxUb3BvbG9neSBhbmQgd2VpZ2h0c01hbmlmZXN0IHRvIGJlIG1pc3NpbmcuXG4gICAgY29uc3QgbW9kZWxUb3BvbG9neSA9IG1vZGVsSlNPTi5tb2RlbFRvcG9sb2d5O1xuICAgIGNvbnN0IHdlaWdodHNNYW5pZmVzdCA9IG1vZGVsSlNPTi53ZWlnaHRzTWFuaWZlc3Q7XG4gICAgaWYgKG1vZGVsVG9wb2xvZ3kgPT0gbnVsbCAmJiB3ZWlnaHRzTWFuaWZlc3QgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBUaGUgSlNPTiBmcm9tIEhUVFAgcGF0aCAke3RoaXMucGF0aH0gY29udGFpbnMgbmVpdGhlciBtb2RlbCBgICtcbiAgICAgICAgICBgdG9wb2xvZ3kgb3IgbWFuaWZlc3QgZm9yIHdlaWdodHMuYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldE1vZGVsQXJ0aWZhY3RzRm9ySlNPTihcbiAgICAgICAgbW9kZWxKU09OLCAod2VpZ2h0c01hbmlmZXN0KSA9PiB0aGlzLmxvYWRXZWlnaHRzKHdlaWdodHNNYW5pZmVzdCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBsb2FkV2VpZ2h0cyh3ZWlnaHRzTWFuaWZlc3Q6IFdlaWdodHNNYW5pZmVzdENvbmZpZyk6XG4gICAgICBQcm9taXNlPFtXZWlnaHRzTWFuaWZlc3RFbnRyeVtdLCBBcnJheUJ1ZmZlcl0+IHtcbiAgICBjb25zdCB3ZWlnaHRQYXRoID0gQXJyYXkuaXNBcnJheSh0aGlzLnBhdGgpID8gdGhpcy5wYXRoWzFdIDogdGhpcy5wYXRoO1xuICAgIGNvbnN0IFtwcmVmaXgsIHN1ZmZpeF0gPSBwYXJzZVVybCh3ZWlnaHRQYXRoKTtcbiAgICBjb25zdCBwYXRoUHJlZml4ID0gdGhpcy53ZWlnaHRQYXRoUHJlZml4IHx8IHByZWZpeDtcblxuICAgIGNvbnN0IHdlaWdodFNwZWNzID0gZ2V0V2VpZ2h0U3BlY3Mod2VpZ2h0c01hbmlmZXN0KTtcblxuICAgIGNvbnN0IGZldGNoVVJMczogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCB1cmxQcm9taXNlczogQXJyYXk8UHJvbWlzZTxzdHJpbmc+PiA9IFtdO1xuICAgIGZvciAoY29uc3Qgd2VpZ2h0c0dyb3VwIG9mIHdlaWdodHNNYW5pZmVzdCkge1xuICAgICAgZm9yIChjb25zdCBwYXRoIG9mIHdlaWdodHNHcm91cC5wYXRocykge1xuICAgICAgICBpZiAodGhpcy53ZWlnaHRVcmxDb252ZXJ0ZXIgIT0gbnVsbCkge1xuICAgICAgICAgIHVybFByb21pc2VzLnB1c2godGhpcy53ZWlnaHRVcmxDb252ZXJ0ZXIocGF0aCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZldGNoVVJMcy5wdXNoKHBhdGhQcmVmaXggKyBwYXRoICsgc3VmZml4KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLndlaWdodFVybENvbnZlcnRlcikge1xuICAgICAgZmV0Y2hVUkxzLnB1c2goLi4uYXdhaXQgUHJvbWlzZS5hbGwodXJsUHJvbWlzZXMpKTtcbiAgICB9XG5cbiAgICBjb25zdCBidWZmZXJzID0gYXdhaXQgbG9hZFdlaWdodHNBc0FycmF5QnVmZmVyKGZldGNoVVJMcywge1xuICAgICAgcmVxdWVzdEluaXQ6IHRoaXMucmVxdWVzdEluaXQsXG4gICAgICBmZXRjaEZ1bmM6IHRoaXMuZmV0Y2gsXG4gICAgICBvblByb2dyZXNzOiB0aGlzLm9uUHJvZ3Jlc3NcbiAgICB9KTtcbiAgICByZXR1cm4gW3dlaWdodFNwZWNzLCBjb25jYXRlbmF0ZUFycmF5QnVmZmVycyhidWZmZXJzKV07XG4gIH1cbn1cblxuLyoqXG4gKiBFeHRyYWN0IHRoZSBwcmVmaXggYW5kIHN1ZmZpeCBvZiB0aGUgdXJsLCB3aGVyZSB0aGUgcHJlZml4IGlzIHRoZSBwYXRoIGJlZm9yZVxuICogdGhlIGxhc3QgZmlsZSwgYW5kIHN1ZmZpeCBpcyB0aGUgc2VhcmNoIHBhcmFtcyBhZnRlciB0aGUgbGFzdCBmaWxlLlxuICogYGBgXG4gKiBjb25zdCB1cmwgPSAnaHR0cDovL3RmaHViLmRldi9tb2RlbC8xL3RlbnNvcmZsb3dqc19tb2RlbC5wYj90ZmpzLWZvcm1hdD1maWxlJ1xuICogW3ByZWZpeCwgc3VmZml4XSA9IHBhcnNlVXJsKHVybClcbiAqIC8vIHByZWZpeCA9ICdodHRwOi8vdGZodWIuZGV2L21vZGVsLzEvJ1xuICogLy8gc3VmZml4ID0gJz90ZmpzLWZvcm1hdD1maWxlJ1xuICogYGBgXG4gKiBAcGFyYW0gdXJsIHRoZSBtb2RlbCB1cmwgdG8gYmUgcGFyc2VkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VVcmwodXJsOiBzdHJpbmcpOiBbc3RyaW5nLCBzdHJpbmddIHtcbiAgY29uc3QgbGFzdFNsYXNoID0gdXJsLmxhc3RJbmRleE9mKCcvJyk7XG4gIGNvbnN0IGxhc3RTZWFyY2hQYXJhbSA9IHVybC5sYXN0SW5kZXhPZignPycpO1xuICBjb25zdCBwcmVmaXggPSB1cmwuc3Vic3RyaW5nKDAsIGxhc3RTbGFzaCk7XG4gIGNvbnN0IHN1ZmZpeCA9XG4gICAgICBsYXN0U2VhcmNoUGFyYW0gPiBsYXN0U2xhc2ggPyB1cmwuc3Vic3RyaW5nKGxhc3RTZWFyY2hQYXJhbSkgOiAnJztcbiAgcmV0dXJuIFtwcmVmaXggKyAnLycsIHN1ZmZpeF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0hUVFBTY2hlbWUodXJsOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIHVybC5tYXRjaChIVFRQUmVxdWVzdC5VUkxfU0NIRU1FX1JFR0VYKSAhPSBudWxsO1xufVxuXG5leHBvcnQgY29uc3QgaHR0cFJvdXRlcjogSU9Sb3V0ZXIgPVxuICAgICh1cmw6IHN0cmluZywgbG9hZE9wdGlvbnM/OiBMb2FkT3B0aW9ucykgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBmZXRjaCA9PT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAobG9hZE9wdGlvbnMgPT0gbnVsbCB8fCBsb2FkT3B0aW9ucy5mZXRjaEZ1bmMgPT0gbnVsbCkpIHtcbiAgICAgICAgLy8gYGh0dHBgIHVzZXMgYGZldGNoYCBvciBgbm9kZS1mZXRjaGAsIGlmIG9uZSB3YW50cyB0byB1c2UgaXQgaW5cbiAgICAgICAgLy8gYW4gZW52aXJvbm1lbnQgdGhhdCBpcyBub3QgdGhlIGJyb3dzZXIgb3Igbm9kZSB0aGV5IGhhdmUgdG8gc2V0dXAgYVxuICAgICAgICAvLyBnbG9iYWwgZmV0Y2ggcG9seWZpbGwuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGlzSFRUUCA9IHRydWU7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHVybCkpIHtcbiAgICAgICAgICBpc0hUVFAgPSB1cmwuZXZlcnkodXJsSXRlbSA9PiBpc0hUVFBTY2hlbWUodXJsSXRlbSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlzSFRUUCA9IGlzSFRUUFNjaGVtZSh1cmwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0hUVFApIHtcbiAgICAgICAgICByZXR1cm4gaHR0cCh1cmwsIGxvYWRPcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbklPUm91dGVyUmVnaXN0cnkucmVnaXN0ZXJTYXZlUm91dGVyKGh0dHBSb3V0ZXIpO1xuSU9Sb3V0ZXJSZWdpc3RyeS5yZWdpc3RlckxvYWRSb3V0ZXIoaHR0cFJvdXRlcik7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBJT0hhbmRsZXIgc3VidHlwZSB0aGF0IHNlbmRzIG1vZGVsIGFydGlmYWN0cyB0byBIVFRQIHNlcnZlci5cbiAqXG4gKiBBbiBIVFRQIHJlcXVlc3Qgb2YgdGhlIGBtdWx0aXBhcnQvZm9ybS1kYXRhYCBtaW1lIHR5cGUgd2lsbCBiZSBzZW50IHRvIHRoZVxuICogYHBhdGhgIFVSTC4gVGhlIGZvcm0gZGF0YSBpbmNsdWRlcyBhcnRpZmFjdHMgdGhhdCByZXByZXNlbnQgdGhlIHRvcG9sb2d5XG4gKiBhbmQvb3Igd2VpZ2h0cyBvZiB0aGUgbW9kZWwuIEluIHRoZSBjYXNlIG9mIEtlcmFzLXN0eWxlIGB0Zi5Nb2RlbGAsIHR3b1xuICogYmxvYnMgKGZpbGVzKSBleGlzdCBpbiBmb3JtLWRhdGE6XG4gKiAgIC0gQSBKU09OIGZpbGUgY29uc2lzdGluZyBvZiBgbW9kZWxUb3BvbG9neWAgYW5kIGB3ZWlnaHRzTWFuaWZlc3RgLlxuICogICAtIEEgYmluYXJ5IHdlaWdodHMgZmlsZSBjb25zaXN0aW5nIG9mIHRoZSBjb25jYXRlbmF0ZWQgd2VpZ2h0IHZhbHVlcy5cbiAqIFRoZXNlIGZpbGVzIGFyZSBpbiB0aGUgc2FtZSBmb3JtYXQgYXMgdGhlIG9uZSBnZW5lcmF0ZWQgYnlcbiAqIFt0ZmpzX2NvbnZlcnRlcl0oaHR0cHM6Ly9qcy50ZW5zb3JmbG93Lm9yZy90dXRvcmlhbHMvaW1wb3J0LWtlcmFzLmh0bWwpLlxuICpcbiAqIFRoZSBmb2xsb3dpbmcgY29kZSBzbmlwcGV0IGV4ZW1wbGlmaWVzIHRoZSBjbGllbnQtc2lkZSBjb2RlIHRoYXQgdXNlcyB0aGlzXG4gKiBmdW5jdGlvbjpcbiAqXG4gKiBgYGBqc1xuICogY29uc3QgbW9kZWwgPSB0Zi5zZXF1ZW50aWFsKCk7XG4gKiBtb2RlbC5hZGQoXG4gKiAgICAgdGYubGF5ZXJzLmRlbnNlKHt1bml0czogMSwgaW5wdXRTaGFwZTogWzEwMF0sIGFjdGl2YXRpb246ICdzaWdtb2lkJ30pKTtcbiAqXG4gKiBjb25zdCBzYXZlUmVzdWx0ID0gYXdhaXQgbW9kZWwuc2F2ZSh0Zi5pby5odHRwKFxuICogICAgICdodHRwOi8vbW9kZWwtc2VydmVyOjUwMDAvdXBsb2FkJywge3JlcXVlc3RJbml0OiB7bWV0aG9kOiAnUFVUJ319KSk7XG4gKiBjb25zb2xlLmxvZyhzYXZlUmVzdWx0KTtcbiAqIGBgYFxuICpcbiAqIElmIHRoZSBkZWZhdWx0IGBQT1NUYCBtZXRob2QgaXMgdG8gYmUgdXNlZCwgd2l0aG91dCBhbnkgY3VzdG9tIHBhcmFtZXRlcnNcbiAqIHN1Y2ggYXMgaGVhZGVycywgeW91IGNhbiBzaW1wbHkgcGFzcyBhbiBIVFRQIG9yIEhUVFBTIFVSTCB0byBgbW9kZWwuc2F2ZWA6XG4gKlxuICogYGBganNcbiAqIGNvbnN0IHNhdmVSZXN1bHQgPSBhd2FpdCBtb2RlbC5zYXZlKCdodHRwOi8vbW9kZWwtc2VydmVyOjUwMDAvdXBsb2FkJyk7XG4gKiBgYGBcbiAqXG4gKiBUaGUgZm9sbG93aW5nIEdpdEh1YiBHaXN0XG4gKiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9kc21pbGtvdi8xYjYwNDZmZDYxMzJkNzQwOGQ1MjU3YjA5NzZmNzg2NFxuICogaW1wbGVtZW50cyBhIHNlcnZlciBiYXNlZCBvbiBbZmxhc2tdKGh0dHBzOi8vZ2l0aHViLmNvbS9wYWxsZXRzL2ZsYXNrKSB0aGF0XG4gKiBjYW4gcmVjZWl2ZSB0aGUgcmVxdWVzdC4gVXBvbiByZWNlaXZpbmcgdGhlIG1vZGVsIGFydGlmYWN0cyB2aWEgdGhlIHJlcXVzdCxcbiAqIHRoaXMgcGFydGljdWxhciBzZXJ2ZXIgcmVjb25zdGl0dXRlcyBpbnN0YW5jZXMgb2YgW0tlcmFzXG4gKiBNb2RlbHNdKGh0dHBzOi8va2VyYXMuaW8vbW9kZWxzL21vZGVsLykgaW4gbWVtb3J5LlxuICpcbiAqXG4gKiBAcGFyYW0gcGF0aCBBIFVSTCBwYXRoIHRvIHRoZSBtb2RlbC5cbiAqICAgQ2FuIGJlIGFuIGFic29sdXRlIEhUVFAgcGF0aCAoZS5nLixcbiAqICAgJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9tb2RlbC11cGxvYWQpJykgb3IgYSByZWxhdGl2ZSBwYXRoIChlLmcuLFxuICogICAnLi9tb2RlbC11cGxvYWQnKS5cbiAqIEBwYXJhbSByZXF1ZXN0SW5pdCBSZXF1ZXN0IGNvbmZpZ3VyYXRpb25zIHRvIGJlIHVzZWQgd2hlbiBzZW5kaW5nXG4gKiAgICBIVFRQIHJlcXVlc3QgdG8gc2VydmVyIHVzaW5nIGBmZXRjaGAuIEl0IGNhbiBjb250YWluIGZpZWxkcyBzdWNoIGFzXG4gKiAgICBgbWV0aG9kYCwgYGNyZWRlbnRpYWxzYCwgYGhlYWRlcnNgLCBgbW9kZWAsIGV0Yy4gU2VlXG4gKiAgICBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvUmVxdWVzdC9SZXF1ZXN0XG4gKiAgICBmb3IgbW9yZSBpbmZvcm1hdGlvbi4gYHJlcXVlc3RJbml0YCBtdXN0IG5vdCBoYXZlIGEgYm9keSwgYmVjYXVzZSB0aGVcbiAqIGJvZHkgd2lsbCBiZSBzZXQgYnkgVGVuc29yRmxvdy5qcy4gRmlsZSBibG9icyByZXByZXNlbnRpbmcgdGhlIG1vZGVsXG4gKiB0b3BvbG9neSAoZmlsZW5hbWU6ICdtb2RlbC5qc29uJykgYW5kIHRoZSB3ZWlnaHRzIG9mIHRoZSBtb2RlbCAoZmlsZW5hbWU6XG4gKiAnbW9kZWwud2VpZ2h0cy5iaW4nKSB3aWxsIGJlIGFwcGVuZGVkIHRvIHRoZSBib2R5LiBJZiBgcmVxdWVzdEluaXRgIGhhcyBhXG4gKiBgYm9keWAsIGFuIEVycm9yIHdpbGwgYmUgdGhyb3duLlxuICogQHBhcmFtIGxvYWRPcHRpb25zIE9wdGlvbmFsIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBsb2FkaW5nLiBJdCBpbmNsdWRlcyB0aGVcbiAqICAgZm9sbG93aW5nIGZpZWxkczpcbiAqICAgLSB3ZWlnaHRQYXRoUHJlZml4IE9wdGlvbmFsLCB0aGlzIHNwZWNpZmllcyB0aGUgcGF0aCBwcmVmaXggZm9yIHdlaWdodFxuICogICAgIGZpbGVzLCBieSBkZWZhdWx0IHRoaXMgaXMgY2FsY3VsYXRlZCBmcm9tIHRoZSBwYXRoIHBhcmFtLlxuICogICAtIGZldGNoRnVuYyBPcHRpb25hbCwgY3VzdG9tIGBmZXRjaGAgZnVuY3Rpb24uIEUuZy4sIGluIE5vZGUuanMsXG4gKiAgICAgdGhlIGBmZXRjaGAgZnJvbSBub2RlLWZldGNoIGNhbiBiZSB1c2VkIGhlcmUuXG4gKiAgIC0gb25Qcm9ncmVzcyBPcHRpb25hbCwgcHJvZ3Jlc3MgY2FsbGJhY2sgZnVuY3Rpb24sIGZpcmVkIHBlcmlvZGljYWxseVxuICogICAgIGJlZm9yZSB0aGUgbG9hZCBpcyBjb21wbGV0ZWQuXG4gKiBAcmV0dXJucyBBbiBpbnN0YW5jZSBvZiBgSU9IYW5kbGVyYC5cbiAqXG4gKiBAZG9jIHtcbiAqICAgaGVhZGluZzogJ01vZGVscycsXG4gKiAgIHN1YmhlYWRpbmc6ICdMb2FkaW5nJyxcbiAqICAgbmFtZXNwYWNlOiAnaW8nLFxuICogICBpZ25vcmVDSTogdHJ1ZVxuICogfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaHR0cChwYXRoOiBzdHJpbmcsIGxvYWRPcHRpb25zPzogTG9hZE9wdGlvbnMpOiBJT0hhbmRsZXIge1xuICByZXR1cm4gbmV3IEhUVFBSZXF1ZXN0KHBhdGgsIGxvYWRPcHRpb25zKTtcbn1cblxuLyoqXG4gKiBEZXByZWNhdGVkLiBVc2UgYHRmLmlvLmh0dHBgLlxuICogQHBhcmFtIHBhdGhcbiAqIEBwYXJhbSBsb2FkT3B0aW9uc1xuICovXG5leHBvcnQgZnVuY3Rpb24gYnJvd3NlckhUVFBSZXF1ZXN0KFxuICAgIHBhdGg6IHN0cmluZywgbG9hZE9wdGlvbnM/OiBMb2FkT3B0aW9ucyk6IElPSGFuZGxlciB7XG4gIHJldHVybiBodHRwKHBhdGgsIGxvYWRPcHRpb25zKTtcbn1cbiJdfQ==