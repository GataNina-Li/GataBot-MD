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
import { env } from '../environment';
import * as util from '../util';
import { decodeWeights } from './io_utils';
import { monitorPromisesProgress } from './progress';
import { DTYPE_VALUE_SIZE_MAP } from './types';
/**
 * Reads binary weights data from a number of URLs.
 *
 * @param fetchURLs URLs to send the HTTP requests at, using `fetch` calls.
 * @param requestOptions RequestInit (options) for the HTTP requests.
 * @param fetchFunc Optional overriding value for the `window.fetch` function.
 * @param onProgress Optional, progress callback function, fired periodically
 *   before the load is completed.
 * @returns A `Promise` of an Array of `ArrayBuffer`. The Array has the same
 *   length as `fetchURLs`.
 */
export async function loadWeightsAsArrayBuffer(fetchURLs, loadOptions) {
    if (loadOptions == null) {
        loadOptions = {};
    }
    const fetchFunc = loadOptions.fetchFunc == null ? env().platform.fetch :
        loadOptions.fetchFunc;
    // Create the requests for all of the weights in parallel.
    const requests = fetchURLs.map(fetchURL => fetchFunc(fetchURL, loadOptions.requestInit, { isBinary: true }));
    const fetchStartFraction = 0;
    const fetchEndFraction = 0.5;
    const responses = loadOptions.onProgress == null ?
        await Promise.all(requests) :
        await monitorPromisesProgress(requests, loadOptions.onProgress, fetchStartFraction, fetchEndFraction);
    const bufferPromises = responses.map(response => response.arrayBuffer());
    const bufferStartFraction = 0.5;
    const bufferEndFraction = 1;
    const buffers = loadOptions.onProgress == null ?
        await Promise.all(bufferPromises) :
        await monitorPromisesProgress(bufferPromises, loadOptions.onProgress, bufferStartFraction, bufferEndFraction);
    return buffers;
}
/**
 * Reads a weights manifest JSON configuration, fetches the weights and
 * returns them as `Tensor`s.
 *
 * @param manifest The weights manifest JSON.
 * @param filePathPrefix The path prefix for filenames given in the manifest.
 *     Defaults to the empty string.
 * @param weightNames The names of the weights to be fetched.
 */
export async function loadWeights(manifest, filePathPrefix = '', weightNames, requestInit) {
    // TODO(nsthorat): Groups are currently fetched atomically. If you need a
    // single weight from a group, the whole group will be fetched. At a future
    // date, we should support fetching only the individual shards within a
    // group that are needed to reconstruct the requested weight.
    // TODO(cais): Use `decodeWeights` for implementation.
    const fetchWeights = (fetchUrls) => loadWeightsAsArrayBuffer(fetchUrls, { requestInit });
    const loadWeights = weightsLoaderFactory(fetchWeights);
    return loadWeights(manifest, filePathPrefix, weightNames);
}
/**
 * Creates a function, which reads a weights manifest JSON configuration,
 * fetches the weight files using the specified function and returns them as
 * `Tensor`s.
 *
 * ```js
 * // example for creating a nodejs weight loader, which reads the weight files
 * // from disk using fs.readFileSync
 *
 * import * as fs from 'fs'
 *
 * const fetchWeightsFromDisk = (filePaths: string[]) =>
 *   filePaths.map(filePath => fs.readFileSync(filePath).buffer)
 *
 * const loadWeights = tf.io.weightsLoaderFactory(fetchWeightsFromDisk)
 *
 * const manifest = JSON.parse(
 *   fs.readFileSync('./my_model-weights_manifest').toString()
 * )
 * const weightMap = await loadWeights(manifest, './')
 * ```
 * @param fetchWeightsFunction The function used for fetching the weight files.
 * @returns Weight loading function.
 */
export function weightsLoaderFactory(fetchWeightsFunction) {
    return async (manifest, filePathPrefix = '', weightNames) => {
        // Collect all the groups, weights, and their relative offsets to be
        // fetched.
        const groupIndicesToFetchMap = manifest.map(() => false);
        const groupWeightsToFetch = {};
        const weightsFound = weightNames != null ? weightNames.map(() => false) : [];
        const allManifestWeightNames = [];
        manifest.forEach((manifestGroupConfig, groupIndex) => {
            let groupOffset = 0;
            manifestGroupConfig.weights.forEach(weightsEntry => {
                const rawDtype = ('quantization' in weightsEntry) ?
                    weightsEntry.quantization.dtype :
                    weightsEntry.dtype;
                const weightsBytes = DTYPE_VALUE_SIZE_MAP[rawDtype] *
                    util.sizeFromShape(weightsEntry.shape);
                const enqueueWeightsForFetchingFn = () => {
                    groupIndicesToFetchMap[groupIndex] = true;
                    if (groupWeightsToFetch[groupIndex] == null) {
                        groupWeightsToFetch[groupIndex] = [];
                    }
                    groupWeightsToFetch[groupIndex].push({
                        manifestEntry: weightsEntry,
                        groupOffset,
                        sizeBytes: weightsBytes
                    });
                };
                if (weightNames != null) {
                    weightNames.forEach((weightName, weightIndex) => {
                        if (weightName === weightsEntry.name) {
                            enqueueWeightsForFetchingFn();
                            weightsFound[weightIndex] = true;
                        }
                    });
                }
                else {
                    enqueueWeightsForFetchingFn();
                }
                allManifestWeightNames.push(weightsEntry.name);
                groupOffset += weightsBytes;
            });
        });
        if (!weightsFound.every(found => found)) {
            const weightsNotFound = weightNames.filter((_, i) => !weightsFound[i]);
            throw new Error(`Could not find weights in manifest with names: ` +
                `${weightsNotFound.join(', ')}. \n` +
                `Manifest JSON has weights with names: ` +
                `${allManifestWeightNames.join(', ')}.`);
        }
        // Convert the one-hot boolean groupId => shouldFetch map to a list of group
        // IDs.
        const groupIndicesToFetch = groupIndicesToFetchMap.reduce((accumulator, shouldFetch, i) => {
            if (shouldFetch) {
                accumulator.push(i);
            }
            return accumulator;
        }, []);
        const fetchUrls = [];
        groupIndicesToFetch.forEach(i => {
            manifest[i].paths.forEach(filepath => {
                const fetchUrl = filePathPrefix +
                    (!filePathPrefix.endsWith('/') ? '/' : '') + filepath;
                fetchUrls.push(fetchUrl);
            });
        });
        const buffers = await fetchWeightsFunction(fetchUrls);
        const weightsTensorMap = {};
        let bufferIndexOffset = 0;
        groupIndicesToFetch.forEach(i => {
            const numBuffers = manifest[i].paths.length;
            let groupBytes = 0;
            for (let i = 0; i < numBuffers; i++) {
                groupBytes += buffers[bufferIndexOffset + i].byteLength;
            }
            // Create a buffer for the whole group.
            const groupBuffer = new ArrayBuffer(groupBytes);
            const groupByteBuffer = new Uint8Array(groupBuffer);
            let groupBufferOffset = 0;
            for (let i = 0; i < numBuffers; i++) {
                const buffer = new Uint8Array(buffers[bufferIndexOffset + i]);
                groupByteBuffer.set(buffer, groupBufferOffset);
                groupBufferOffset += buffer.byteLength;
            }
            const weightsEntries = groupWeightsToFetch[i];
            weightsEntries.forEach(weightsEntry => {
                const byteBuffer = groupBuffer.slice(weightsEntry.groupOffset, weightsEntry.groupOffset + weightsEntry.sizeBytes);
                const nameToTensorMap = decodeWeights(byteBuffer, [weightsEntry.manifestEntry]);
                for (const name in nameToTensorMap) {
                    weightsTensorMap[name] = nameToTensorMap[name];
                }
            });
            bufferIndexOffset += numBuffers;
        });
        return weightsTensorMap;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VpZ2h0c19sb2FkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2lvL3dlaWdodHNfbG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUduQyxPQUFPLEtBQUssSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUNoQyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNuRCxPQUFPLEVBQUMsb0JBQW9CLEVBQTJELE1BQU0sU0FBUyxDQUFDO0FBRXZHOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFNLENBQUMsS0FBSyxVQUFVLHdCQUF3QixDQUMxQyxTQUFtQixFQUFFLFdBQXlCO0lBQ2hELElBQUksV0FBVyxJQUFJLElBQUksRUFBRTtRQUN2QixXQUFXLEdBQUcsRUFBRSxDQUFDO0tBQ2xCO0lBRUQsTUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QixXQUFXLENBQUMsU0FBUyxDQUFDO0lBRXhFLDBEQUEwRDtJQUMxRCxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUMxQixRQUFRLENBQUMsRUFBRSxDQUNQLFNBQVMsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLFdBQVcsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUM7SUFFeEUsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLENBQUM7SUFDN0IsTUFBTSxnQkFBZ0IsR0FBRyxHQUFHLENBQUM7SUFFN0IsTUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDLFVBQVUsSUFB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QUMsQ0FBQztZQUVILGlCQUFpQixJQUFJLFVBQVUsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sZ0JBQWdCLENBQUM7SUFDMUIsQ0FBQyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtlbnZ9IGZyb20gJy4uL2Vudmlyb25tZW50JztcblxuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge2RlY29kZVdlaWdodHN9IGZyb20gJy4vaW9fdXRpbHMnO1xuaW1wb3J0IHttb25pdG9yUHJvbWlzZXNQcm9ncmVzc30gZnJvbSAnLi9wcm9ncmVzcyc7XG5pbXBvcnQge0RUWVBFX1ZBTFVFX1NJWkVfTUFQLCBMb2FkT3B0aW9ucywgV2VpZ2h0c01hbmlmZXN0Q29uZmlnLCBXZWlnaHRzTWFuaWZlc3RFbnRyeX0gZnJvbSAnLi90eXBlcyc7XG5cbi8qKlxuICogUmVhZHMgYmluYXJ5IHdlaWdodHMgZGF0YSBmcm9tIGEgbnVtYmVyIG9mIFVSTHMuXG4gKlxuICogQHBhcmFtIGZldGNoVVJMcyBVUkxzIHRvIHNlbmQgdGhlIEhUVFAgcmVxdWVzdHMgYXQsIHVzaW5nIGBmZXRjaGAgY2FsbHMuXG4gKiBAcGFyYW0gcmVxdWVzdE9wdGlvbnMgUmVxdWVzdEluaXQgKG9wdGlvbnMpIGZvciB0aGUgSFRUUCByZXF1ZXN0cy5cbiAqIEBwYXJhbSBmZXRjaEZ1bmMgT3B0aW9uYWwgb3ZlcnJpZGluZyB2YWx1ZSBmb3IgdGhlIGB3aW5kb3cuZmV0Y2hgIGZ1bmN0aW9uLlxuICogQHBhcmFtIG9uUHJvZ3Jlc3MgT3B0aW9uYWwsIHByb2dyZXNzIGNhbGxiYWNrIGZ1bmN0aW9uLCBmaXJlZCBwZXJpb2RpY2FsbHlcbiAqICAgYmVmb3JlIHRoZSBsb2FkIGlzIGNvbXBsZXRlZC5cbiAqIEByZXR1cm5zIEEgYFByb21pc2VgIG9mIGFuIEFycmF5IG9mIGBBcnJheUJ1ZmZlcmAuIFRoZSBBcnJheSBoYXMgdGhlIHNhbWVcbiAqICAgbGVuZ3RoIGFzIGBmZXRjaFVSTHNgLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZFdlaWdodHNBc0FycmF5QnVmZmVyKFxuICAgIGZldGNoVVJMczogc3RyaW5nW10sIGxvYWRPcHRpb25zPzogTG9hZE9wdGlvbnMpOiBQcm9taXNlPEFycmF5QnVmZmVyW10+IHtcbiAgaWYgKGxvYWRPcHRpb25zID09IG51bGwpIHtcbiAgICBsb2FkT3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgY29uc3QgZmV0Y2hGdW5jID0gbG9hZE9wdGlvbnMuZmV0Y2hGdW5jID09IG51bGwgPyBlbnYoKS5wbGF0Zm9ybS5mZXRjaCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZE9wdGlvbnMuZmV0Y2hGdW5jO1xuXG4gIC8vIENyZWF0ZSB0aGUgcmVxdWVzdHMgZm9yIGFsbCBvZiB0aGUgd2VpZ2h0cyBpbiBwYXJhbGxlbC5cbiAgY29uc3QgcmVxdWVzdHMgPSBmZXRjaFVSTHMubWFwKFxuICAgICAgZmV0Y2hVUkwgPT5cbiAgICAgICAgICBmZXRjaEZ1bmMoZmV0Y2hVUkwsIGxvYWRPcHRpb25zLnJlcXVlc3RJbml0LCB7aXNCaW5hcnk6IHRydWV9KSk7XG5cbiAgY29uc3QgZmV0Y2hTdGFydEZyYWN0aW9uID0gMDtcbiAgY29uc3QgZmV0Y2hFbmRGcmFjdGlvbiA9IDAuNTtcblxuICBjb25zdCByZXNwb25zZXMgPSBsb2FkT3B0aW9ucy5vblByb2dyZXNzID09IG51bGwgP1xuICAgICAgYXdhaXQgUHJvbWlzZS5hbGwocmVxdWVzdHMpIDpcbiAgICAgIGF3YWl0IG1vbml0b3JQcm9taXNlc1Byb2dyZXNzKFxuICAgICAgICAgIHJlcXVlc3RzLCBsb2FkT3B0aW9ucy5vblByb2dyZXNzLCBmZXRjaFN0YXJ0RnJhY3Rpb24sXG4gICAgICAgICAgZmV0Y2hFbmRGcmFjdGlvbik7XG5cbiAgY29uc3QgYnVmZmVyUHJvbWlzZXMgPSByZXNwb25zZXMubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmFycmF5QnVmZmVyKCkpO1xuXG4gIGNvbnN0IGJ1ZmZlclN0YXJ0RnJhY3Rpb24gPSAwLjU7XG4gIGNvbnN0IGJ1ZmZlckVuZEZyYWN0aW9uID0gMTtcblxuICBjb25zdCBidWZmZXJzID0gbG9hZE9wdGlvbnMub25Qcm9ncmVzcyA9PSBudWxsID9cbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKGJ1ZmZlclByb21pc2VzKSA6XG4gICAgICBhd2FpdCBtb25pdG9yUHJvbWlzZXNQcm9ncmVzcyhcbiAgICAgICAgICBidWZmZXJQcm9taXNlcywgbG9hZE9wdGlvbnMub25Qcm9ncmVzcywgYnVmZmVyU3RhcnRGcmFjdGlvbixcbiAgICAgICAgICBidWZmZXJFbmRGcmFjdGlvbik7XG4gIHJldHVybiBidWZmZXJzO1xufVxuXG4vKipcbiAqIFJlYWRzIGEgd2VpZ2h0cyBtYW5pZmVzdCBKU09OIGNvbmZpZ3VyYXRpb24sIGZldGNoZXMgdGhlIHdlaWdodHMgYW5kXG4gKiByZXR1cm5zIHRoZW0gYXMgYFRlbnNvcmBzLlxuICpcbiAqIEBwYXJhbSBtYW5pZmVzdCBUaGUgd2VpZ2h0cyBtYW5pZmVzdCBKU09OLlxuICogQHBhcmFtIGZpbGVQYXRoUHJlZml4IFRoZSBwYXRoIHByZWZpeCBmb3IgZmlsZW5hbWVzIGdpdmVuIGluIHRoZSBtYW5pZmVzdC5cbiAqICAgICBEZWZhdWx0cyB0byB0aGUgZW1wdHkgc3RyaW5nLlxuICogQHBhcmFtIHdlaWdodE5hbWVzIFRoZSBuYW1lcyBvZiB0aGUgd2VpZ2h0cyB0byBiZSBmZXRjaGVkLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZFdlaWdodHMoXG4gICAgbWFuaWZlc3Q6IFdlaWdodHNNYW5pZmVzdENvbmZpZywgZmlsZVBhdGhQcmVmaXggPSAnJyxcbiAgICB3ZWlnaHROYW1lcz86IHN0cmluZ1tdLFxuICAgIHJlcXVlc3RJbml0PzogUmVxdWVzdEluaXQpOiBQcm9taXNlPE5hbWVkVGVuc29yTWFwPiB7XG4gIC8vIFRPRE8obnN0aG9yYXQpOiBHcm91cHMgYXJlIGN1cnJlbnRseSBmZXRjaGVkIGF0b21pY2FsbHkuIElmIHlvdSBuZWVkIGFcbiAgLy8gc2luZ2xlIHdlaWdodCBmcm9tIGEgZ3JvdXAsIHRoZSB3aG9sZSBncm91cCB3aWxsIGJlIGZldGNoZWQuIEF0IGEgZnV0dXJlXG4gIC8vIGRhdGUsIHdlIHNob3VsZCBzdXBwb3J0IGZldGNoaW5nIG9ubHkgdGhlIGluZGl2aWR1YWwgc2hhcmRzIHdpdGhpbiBhXG4gIC8vIGdyb3VwIHRoYXQgYXJlIG5lZWRlZCB0byByZWNvbnN0cnVjdCB0aGUgcmVxdWVzdGVkIHdlaWdodC5cbiAgLy8gVE9ETyhjYWlzKTogVXNlIGBkZWNvZGVXZWlnaHRzYCBmb3IgaW1wbGVtZW50YXRpb24uXG5cbiAgY29uc3QgZmV0Y2hXZWlnaHRzID0gKGZldGNoVXJsczogc3RyaW5nW10pID0+XG4gICAgICBsb2FkV2VpZ2h0c0FzQXJyYXlCdWZmZXIoZmV0Y2hVcmxzLCB7cmVxdWVzdEluaXR9KTtcbiAgY29uc3QgbG9hZFdlaWdodHMgPSB3ZWlnaHRzTG9hZGVyRmFjdG9yeShmZXRjaFdlaWdodHMpO1xuXG4gIHJldHVybiBsb2FkV2VpZ2h0cyhtYW5pZmVzdCwgZmlsZVBhdGhQcmVmaXgsIHdlaWdodE5hbWVzKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24sIHdoaWNoIHJlYWRzIGEgd2VpZ2h0cyBtYW5pZmVzdCBKU09OIGNvbmZpZ3VyYXRpb24sXG4gKiBmZXRjaGVzIHRoZSB3ZWlnaHQgZmlsZXMgdXNpbmcgdGhlIHNwZWNpZmllZCBmdW5jdGlvbiBhbmQgcmV0dXJucyB0aGVtIGFzXG4gKiBgVGVuc29yYHMuXG4gKlxuICogYGBganNcbiAqIC8vIGV4YW1wbGUgZm9yIGNyZWF0aW5nIGEgbm9kZWpzIHdlaWdodCBsb2FkZXIsIHdoaWNoIHJlYWRzIHRoZSB3ZWlnaHQgZmlsZXNcbiAqIC8vIGZyb20gZGlzayB1c2luZyBmcy5yZWFkRmlsZVN5bmNcbiAqXG4gKiBpbXBvcnQgKiBhcyBmcyBmcm9tICdmcydcbiAqXG4gKiBjb25zdCBmZXRjaFdlaWdodHNGcm9tRGlzayA9IChmaWxlUGF0aHM6IHN0cmluZ1tdKSA9PlxuICogICBmaWxlUGF0aHMubWFwKGZpbGVQYXRoID0+IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCkuYnVmZmVyKVxuICpcbiAqIGNvbnN0IGxvYWRXZWlnaHRzID0gdGYuaW8ud2VpZ2h0c0xvYWRlckZhY3RvcnkoZmV0Y2hXZWlnaHRzRnJvbURpc2spXG4gKlxuICogY29uc3QgbWFuaWZlc3QgPSBKU09OLnBhcnNlKFxuICogICBmcy5yZWFkRmlsZVN5bmMoJy4vbXlfbW9kZWwtd2VpZ2h0c19tYW5pZmVzdCcpLnRvU3RyaW5nKClcbiAqIClcbiAqIGNvbnN0IHdlaWdodE1hcCA9IGF3YWl0IGxvYWRXZWlnaHRzKG1hbmlmZXN0LCAnLi8nKVxuICogYGBgXG4gKiBAcGFyYW0gZmV0Y2hXZWlnaHRzRnVuY3Rpb24gVGhlIGZ1bmN0aW9uIHVzZWQgZm9yIGZldGNoaW5nIHRoZSB3ZWlnaHQgZmlsZXMuXG4gKiBAcmV0dXJucyBXZWlnaHQgbG9hZGluZyBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdlaWdodHNMb2FkZXJGYWN0b3J5KFxuICAgIGZldGNoV2VpZ2h0c0Z1bmN0aW9uOiAoZmV0Y2hVcmxzOiBzdHJpbmdbXSkgPT4gUHJvbWlzZTxBcnJheUJ1ZmZlcltdPik6XG4gICAgKG1hbmlmZXN0OiBXZWlnaHRzTWFuaWZlc3RDb25maWcsIGZpbGVQYXRoUHJlZml4Pzogc3RyaW5nLFxuICAgICB3ZWlnaHROYW1lcz86IHN0cmluZ1tdKSA9PiBQcm9taXNlPE5hbWVkVGVuc29yTWFwPiB7XG4gIHJldHVybiBhc3luYyhcbiAgICAgICAgICAgICBtYW5pZmVzdDogV2VpZ2h0c01hbmlmZXN0Q29uZmlnLCBmaWxlUGF0aFByZWZpeCA9ICcnLFxuICAgICAgICAgICAgIHdlaWdodE5hbWVzPzogc3RyaW5nW10pOiBQcm9taXNlPE5hbWVkVGVuc29yTWFwPiA9PiB7XG4gICAgLy8gQ29sbGVjdCBhbGwgdGhlIGdyb3Vwcywgd2VpZ2h0cywgYW5kIHRoZWlyIHJlbGF0aXZlIG9mZnNldHMgdG8gYmVcbiAgICAvLyBmZXRjaGVkLlxuICAgIGNvbnN0IGdyb3VwSW5kaWNlc1RvRmV0Y2hNYXAgPSBtYW5pZmVzdC5tYXAoKCkgPT4gZmFsc2UpO1xuICAgIGNvbnN0IGdyb3VwV2VpZ2h0c1RvRmV0Y2g6IHtcbiAgICAgIFtncm91cDogbnVtYmVyXTogQXJyYXk8e1xuICAgICAgICBtYW5pZmVzdEVudHJ5OiBXZWlnaHRzTWFuaWZlc3RFbnRyeTsgZ3JvdXBPZmZzZXQ6IG51bWJlcjtcbiAgICAgICAgc2l6ZUJ5dGVzOiBudW1iZXI7XG4gICAgICB9PlxuICAgIH0gPSB7fTtcbiAgICBjb25zdCB3ZWlnaHRzRm91bmQgPVxuICAgICAgICB3ZWlnaHROYW1lcyAhPSBudWxsID8gd2VpZ2h0TmFtZXMubWFwKCgpID0+IGZhbHNlKSA6IFtdO1xuICAgIGNvbnN0IGFsbE1hbmlmZXN0V2VpZ2h0TmFtZXM6IHN0cmluZ1tdID0gW107XG4gICAgbWFuaWZlc3QuZm9yRWFjaCgobWFuaWZlc3RHcm91cENvbmZpZywgZ3JvdXBJbmRleCkgPT4ge1xuICAgICAgbGV0IGdyb3VwT2Zmc2V0ID0gMDtcbiAgICAgIG1hbmlmZXN0R3JvdXBDb25maWcud2VpZ2h0cy5mb3JFYWNoKHdlaWdodHNFbnRyeSA9PiB7XG4gICAgICAgIGNvbnN0IHJhd0R0eXBlID0gKCdxdWFudGl6YXRpb24nIGluIHdlaWdodHNFbnRyeSkgP1xuICAgICAgICAgICAgd2VpZ2h0c0VudHJ5LnF1YW50aXphdGlvbi5kdHlwZSA6XG4gICAgICAgICAgICB3ZWlnaHRzRW50cnkuZHR5cGU7XG5cbiAgICAgICAgY29uc3Qgd2VpZ2h0c0J5dGVzID0gRFRZUEVfVkFMVUVfU0laRV9NQVBbcmF3RHR5cGVdICpcbiAgICAgICAgICAgIHV0aWwuc2l6ZUZyb21TaGFwZSh3ZWlnaHRzRW50cnkuc2hhcGUpO1xuXG4gICAgICAgIGNvbnN0IGVucXVldWVXZWlnaHRzRm9yRmV0Y2hpbmdGbiA9ICgpID0+IHtcbiAgICAgICAgICBncm91cEluZGljZXNUb0ZldGNoTWFwW2dyb3VwSW5kZXhdID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoZ3JvdXBXZWlnaHRzVG9GZXRjaFtncm91cEluZGV4XSA9PSBudWxsKSB7XG4gICAgICAgICAgICBncm91cFdlaWdodHNUb0ZldGNoW2dyb3VwSW5kZXhdID0gW107XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZ3JvdXBXZWlnaHRzVG9GZXRjaFtncm91cEluZGV4XS5wdXNoKHtcbiAgICAgICAgICAgIG1hbmlmZXN0RW50cnk6IHdlaWdodHNFbnRyeSxcbiAgICAgICAgICAgIGdyb3VwT2Zmc2V0LFxuICAgICAgICAgICAgc2l6ZUJ5dGVzOiB3ZWlnaHRzQnl0ZXNcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAod2VpZ2h0TmFtZXMgIT0gbnVsbCkge1xuICAgICAgICAgIHdlaWdodE5hbWVzLmZvckVhY2goKHdlaWdodE5hbWUsIHdlaWdodEluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZiAod2VpZ2h0TmFtZSA9PT0gd2VpZ2h0c0VudHJ5Lm5hbWUpIHtcbiAgICAgICAgICAgICAgZW5xdWV1ZVdlaWdodHNGb3JGZXRjaGluZ0ZuKCk7XG4gICAgICAgICAgICAgIHdlaWdodHNGb3VuZFt3ZWlnaHRJbmRleF0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVucXVldWVXZWlnaHRzRm9yRmV0Y2hpbmdGbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgYWxsTWFuaWZlc3RXZWlnaHROYW1lcy5wdXNoKHdlaWdodHNFbnRyeS5uYW1lKTtcbiAgICAgICAgZ3JvdXBPZmZzZXQgKz0gd2VpZ2h0c0J5dGVzO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpZiAoIXdlaWdodHNGb3VuZC5ldmVyeShmb3VuZCA9PiBmb3VuZCkpIHtcbiAgICAgIGNvbnN0IHdlaWdodHNOb3RGb3VuZCA9IHdlaWdodE5hbWVzLmZpbHRlcigoXywgaSkgPT4gIXdlaWdodHNGb3VuZFtpXSk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYENvdWxkIG5vdCBmaW5kIHdlaWdodHMgaW4gbWFuaWZlc3Qgd2l0aCBuYW1lczogYCArXG4gICAgICAgICAgYCR7d2VpZ2h0c05vdEZvdW5kLmpvaW4oJywgJyl9LiBcXG5gICtcbiAgICAgICAgICBgTWFuaWZlc3QgSlNPTiBoYXMgd2VpZ2h0cyB3aXRoIG5hbWVzOiBgICtcbiAgICAgICAgICBgJHthbGxNYW5pZmVzdFdlaWdodE5hbWVzLmpvaW4oJywgJyl9LmApO1xuICAgIH1cblxuICAgIC8vIENvbnZlcnQgdGhlIG9uZS1ob3QgYm9vbGVhbiBncm91cElkID0+IHNob3VsZEZldGNoIG1hcCB0byBhIGxpc3Qgb2YgZ3JvdXBcbiAgICAvLyBJRHMuXG4gICAgY29uc3QgZ3JvdXBJbmRpY2VzVG9GZXRjaCA9XG4gICAgICAgIGdyb3VwSW5kaWNlc1RvRmV0Y2hNYXAucmVkdWNlKChhY2N1bXVsYXRvciwgc2hvdWxkRmV0Y2gsIGkpID0+IHtcbiAgICAgICAgICBpZiAoc2hvdWxkRmV0Y2gpIHtcbiAgICAgICAgICAgIGFjY3VtdWxhdG9yLnB1c2goaSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICAgICAgfSwgW10pO1xuXG4gICAgY29uc3QgZmV0Y2hVcmxzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGdyb3VwSW5kaWNlc1RvRmV0Y2guZm9yRWFjaChpID0+IHtcbiAgICAgIG1hbmlmZXN0W2ldLnBhdGhzLmZvckVhY2goZmlsZXBhdGggPT4ge1xuICAgICAgICBjb25zdCBmZXRjaFVybCA9IGZpbGVQYXRoUHJlZml4ICtcbiAgICAgICAgICAgICghZmlsZVBhdGhQcmVmaXguZW5kc1dpdGgoJy8nKSA/ICcvJyA6ICcnKSArIGZpbGVwYXRoO1xuICAgICAgICBmZXRjaFVybHMucHVzaChmZXRjaFVybCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBjb25zdCBidWZmZXJzID0gYXdhaXQgZmV0Y2hXZWlnaHRzRnVuY3Rpb24oZmV0Y2hVcmxzKTtcblxuICAgIGNvbnN0IHdlaWdodHNUZW5zb3JNYXA6IE5hbWVkVGVuc29yTWFwID0ge307XG4gICAgbGV0IGJ1ZmZlckluZGV4T2Zmc2V0ID0gMDtcbiAgICBncm91cEluZGljZXNUb0ZldGNoLmZvckVhY2goaSA9PiB7XG4gICAgICBjb25zdCBudW1CdWZmZXJzID0gbWFuaWZlc3RbaV0ucGF0aHMubGVuZ3RoO1xuXG4gICAgICBsZXQgZ3JvdXBCeXRlcyA9IDA7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bUJ1ZmZlcnM7IGkrKykge1xuICAgICAgICBncm91cEJ5dGVzICs9IGJ1ZmZlcnNbYnVmZmVySW5kZXhPZmZzZXQgKyBpXS5ieXRlTGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICAvLyBDcmVhdGUgYSBidWZmZXIgZm9yIHRoZSB3aG9sZSBncm91cC5cbiAgICAgIGNvbnN0IGdyb3VwQnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGdyb3VwQnl0ZXMpO1xuICAgICAgY29uc3QgZ3JvdXBCeXRlQnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoZ3JvdXBCdWZmZXIpO1xuICAgICAgbGV0IGdyb3VwQnVmZmVyT2Zmc2V0ID0gMDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQnVmZmVyczsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlcnNbYnVmZmVySW5kZXhPZmZzZXQgKyBpXSk7XG4gICAgICAgIGdyb3VwQnl0ZUJ1ZmZlci5zZXQoYnVmZmVyLCBncm91cEJ1ZmZlck9mZnNldCk7XG4gICAgICAgIGdyb3VwQnVmZmVyT2Zmc2V0ICs9IGJ1ZmZlci5ieXRlTGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB3ZWlnaHRzRW50cmllcyA9IGdyb3VwV2VpZ2h0c1RvRmV0Y2hbaV07XG4gICAgICB3ZWlnaHRzRW50cmllcy5mb3JFYWNoKHdlaWdodHNFbnRyeSA9PiB7XG4gICAgICAgIGNvbnN0IGJ5dGVCdWZmZXIgPSBncm91cEJ1ZmZlci5zbGljZShcbiAgICAgICAgICAgIHdlaWdodHNFbnRyeS5ncm91cE9mZnNldCxcbiAgICAgICAgICAgIHdlaWdodHNFbnRyeS5ncm91cE9mZnNldCArIHdlaWdodHNFbnRyeS5zaXplQnl0ZXMpO1xuICAgICAgICBjb25zdCBuYW1lVG9UZW5zb3JNYXAgPVxuICAgICAgICAgICAgZGVjb2RlV2VpZ2h0cyhieXRlQnVmZmVyLCBbd2VpZ2h0c0VudHJ5Lm1hbmlmZXN0RW50cnldKTtcbiAgICAgICAgZm9yIChjb25zdCBuYW1lIGluIG5hbWVUb1RlbnNvck1hcCkge1xuICAgICAgICAgIHdlaWdodHNUZW5zb3JNYXBbbmFtZV0gPSBuYW1lVG9UZW5zb3JNYXBbbmFtZV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBidWZmZXJJbmRleE9mZnNldCArPSBudW1CdWZmZXJzO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHdlaWdodHNUZW5zb3JNYXA7XG4gIH07XG59XG4iXX0=