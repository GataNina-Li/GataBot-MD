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
class PassthroughLoader {
    constructor(modelArtifacts) {
        this.modelArtifacts = modelArtifacts;
    }
    load() {
        return this.modelArtifacts;
    }
}
class PassthroughSaver {
    constructor(saveHandler) {
        this.saveHandler = saveHandler;
    }
    save(modelArtifacts) {
        return this.saveHandler(modelArtifacts);
    }
}
class PassthroughAsync {
    constructor(handler) {
        if (handler.load) {
            this.load = () => Promise.resolve(handler.load());
        }
        if (handler.save) {
            this.save = (modelArtifacts) => Promise.resolve(handler.save(modelArtifacts));
        }
    }
}
/**
 * Creates an IOHandler that loads model artifacts from memory.
 *
 * When used in conjunction with `tf.loadLayersModel`, an instance of
 * `tf.LayersModel` (Keras-style) can be constructed from the loaded artifacts.
 *
 * ```js
 * const model = await tf.loadLayersModel(tf.io.fromMemory(
 *     modelTopology, weightSpecs, weightData));
 * ```
 *
 * @param modelArtifacts a object containing model topology (i.e., parsed from
 *   the JSON format).
 * @param weightSpecs An array of `WeightsManifestEntry` objects describing the
 *   names, shapes, types, and quantization of the weight data. Optional.
 * @param weightData A single `ArrayBuffer` containing the weight data,
 *   concatenated in the order described by the weightSpecs. Optional.
 * @param trainingConfig Model training configuration. Optional.
 *
 * @returns A passthrough `IOHandler` that simply loads the provided data.
 */
export function fromMemory(modelArtifacts, weightSpecs, weightData, trainingConfig) {
    const args = arguments;
    return new PassthroughAsync(fromMemorySync(...args));
}
/**
 * Creates an IOHandler that loads model artifacts from memory.
 *
 * When used in conjunction with `tf.loadLayersModel`, an instance of
 * `tf.LayersModel` (Keras-style) can be constructed from the loaded artifacts.
 *
 * ```js
 * const model = await tf.loadLayersModel(tf.io.fromMemory(
 *     modelTopology, weightSpecs, weightData));
 * ```
 *
 * @param modelArtifacts a object containing model topology (i.e., parsed from
 *   the JSON format).
 * @param weightSpecs An array of `WeightsManifestEntry` objects describing the
 *   names, shapes, types, and quantization of the weight data. Optional.
 * @param weightData A single `ArrayBuffer` containing the weight data,
 *   concatenated in the order described by the weightSpecs. Optional.
 * @param trainingConfig Model training configuration. Optional.
 *
 * @returns A passthrough `IOHandlerSync` that simply loads the provided data.
 */
export function fromMemorySync(modelArtifacts, weightSpecs, weightData, trainingConfig) {
    if (arguments.length === 1) {
        const isModelArtifacts = modelArtifacts.modelTopology != null ||
            modelArtifacts.weightSpecs != null;
        if (isModelArtifacts) {
            return new PassthroughLoader(modelArtifacts);
        }
        else {
            // Legacy support: with only modelTopology.
            // TODO(cais): Remove this deprecated API.
            console.warn('Please call tf.io.fromMemory() with only one argument. ' +
                'The argument should be of type ModelArtifacts. ' +
                'The multi-argument signature of tf.io.fromMemory() has been ' +
                'deprecated and will be removed in a future release.');
            return new PassthroughLoader({ modelTopology: modelArtifacts });
        }
    }
    else {
        // Legacy support.
        // TODO(cais): Remove this deprecated API.
        console.warn('Please call tf.io.fromMemory() with only one argument. ' +
            'The argument should be of type ModelArtifacts. ' +
            'The multi-argument signature of tf.io.fromMemory() has been ' +
            'deprecated and will be removed in a future release.');
        return new PassthroughLoader({
            modelTopology: modelArtifacts,
            weightSpecs,
            weightData,
            trainingConfig
        });
    }
}
/**
 * Creates an IOHandler that passes saved model artifacts to a callback.
 *
 * ```js
 * function handleSave(artifacts) {
 *   // ... do something with the artifacts ...
 *   return {modelArtifactsInfo: {...}, ...};
 * }
 *
 * const saveResult = model.save(tf.io.withSaveHandler(handleSave));
 * ```
 *
 * @param saveHandler A function that accepts a `ModelArtifacts` and returns a
 *     promise that resolves to a `SaveResult`.
 */
export function withSaveHandler(saveHandler) {
    return new PassthroughSaver(saveHandler);
}
/**
 * Creates an IOHandlerSync that passes saved model artifacts to a callback.
 *
 * ```js
 * function handleSave(artifacts) {
 *   // ... do something with the artifacts ...
 *   return {modelArtifactsInfo: {...}, ...};
 * }
 *
 * const saveResult = model.save(tf.io.withSaveHandler(handleSave));
 * ```
 *
 * @param saveHandler A function that accepts a `ModelArtifacts` and returns a
 *     `SaveResult`.
 */
export function withSaveHandlerSync(saveHandler) {
    return new PassthroughSaver(saveHandler);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc3Rocm91Z2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2lvL3Bhc3N0aHJvdWdoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQVFILE1BQU0saUJBQWlCO0lBQ3JCLFlBQTZCLGNBQStCO1FBQS9CLG1CQUFjLEdBQWQsY0FBYyxDQUFpQjtJQUFHLENBQUM7SUFFaEUsSUFBSTtRQUNGLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUM3QixDQUFDO0NBQ0Y7QUFFRCxNQUFNLGdCQUFnQjtJQUNwQixZQUNtQixXQUE2QztRQUE3QyxnQkFBVyxHQUFYLFdBQVcsQ0FBa0M7SUFBRyxDQUFDO0lBRXBFLElBQUksQ0FBQyxjQUE4QjtRQUNqQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDMUMsQ0FBQztDQUNGO0FBRUQsTUFBTSxnQkFBZ0I7SUFJcEIsWUFBWSxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7WUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQ25EO1FBQ0QsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO1lBQ2hCLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxjQUE4QixFQUFFLEVBQUUsQ0FDN0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7U0FDakQ7SUFDSCxDQUFDO0NBQ0Y7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQkc7QUFDSCxNQUFNLFVBQVUsVUFBVSxDQUN0QixjQUFpQyxFQUFFLFdBQW9DLEVBQ3ZFLFVBQXdCLEVBQUUsY0FBK0I7SUFFM0QsTUFBTSxJQUFJLEdBQUcsU0FBcUQsQ0FBQztJQUNuRSxPQUFPLElBQUksZ0JBQWdCLENBQUMsY0FBYyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0JHO0FBQ0gsTUFBTSxVQUFVLGNBQWMsQ0FDMUIsY0FBaUMsRUFBRSxXQUFvQyxFQUN2RSxVQUF3QixFQUFFLGNBQStCO0lBQzNELElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDMUIsTUFBTSxnQkFBZ0IsR0FDakIsY0FBaUMsQ0FBQyxhQUFhLElBQUksSUFBSTtZQUN2RCxjQUFpQyxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUM7UUFDM0QsSUFBSSxnQkFBZ0IsRUFBRTtZQUNwQixPQUFPLElBQUksaUJBQWlCLENBQUMsY0FBZ0MsQ0FBQyxDQUFDO1NBQ2hFO2FBQU07WUFDTCwyQ0FBMkM7WUFDM0MsMENBQTBDO1lBQzFDLE9BQU8sQ0FBQyxJQUFJLENBQ1IseURBQXlEO2dCQUN6RCxpREFBaUQ7Z0JBQ2pELDhEQUE4RDtnQkFDOUQscURBQXFELENBQUMsQ0FBQztZQUMzRCxPQUFPLElBQUksaUJBQWlCLENBQUMsRUFBQyxhQUFhLEVBQUUsY0FBb0IsRUFBQyxDQUFDLENBQUM7U0FDckU7S0FDRjtTQUFNO1FBQ0wsa0JBQWtCO1FBQ2xCLDBDQUEwQztRQUMxQyxPQUFPLENBQUMsSUFBSSxDQUNSLHlEQUF5RDtZQUN6RCxpREFBaUQ7WUFDakQsOERBQThEO1lBQzlELHFEQUFxRCxDQUFDLENBQUM7UUFDM0QsT0FBTyxJQUFJLGlCQUFpQixDQUFDO1lBQzNCLGFBQWEsRUFBRSxjQUFvQjtZQUNuQyxXQUFXO1lBQ1gsVUFBVTtZQUNWLGNBQWM7U0FDZixDQUFDLENBQUM7S0FDSjtBQUNILENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNILE1BQU0sVUFBVSxlQUFlLENBQzNCLFdBQ3VCO0lBQ3pCLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxNQUFNLFVBQVUsbUJBQW1CLENBQy9CLFdBQXNEO0lBQ3hELE9BQU8sSUFBSSxnQkFBZ0IsQ0FBYSxXQUFXLENBQUMsQ0FBQztBQUN2RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG4vKipcbiAqIElPSGFuZGxlcnMgdGhhdCBwYXNzIHRocm91Z2ggdGhlIGluLW1lbW9yeSBNb2RlbEFydGlmYWN0cyBmb3JtYXQuXG4gKi9cblxuaW1wb3J0IHtJT0hhbmRsZXIsIElPSGFuZGxlclN5bmMsIExvYWRIYW5kbGVyLCBNb2RlbEFydGlmYWN0cywgU2F2ZUhhbmRsZXIsIFNhdmVSZXN1bHQsIFRyYWluaW5nQ29uZmlnLCBXZWlnaHRzTWFuaWZlc3RFbnRyeX0gZnJvbSAnLi90eXBlcyc7XG5cbmNsYXNzIFBhc3N0aHJvdWdoTG9hZGVyIGltcGxlbWVudHMgSU9IYW5kbGVyU3luYyB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbW9kZWxBcnRpZmFjdHM/OiBNb2RlbEFydGlmYWN0cykge31cblxuICBsb2FkKCk6IE1vZGVsQXJ0aWZhY3RzIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbEFydGlmYWN0cztcbiAgfVxufVxuXG5jbGFzcyBQYXNzdGhyb3VnaFNhdmVyPFIgZXh0ZW5kcyBTYXZlUmVzdWx0IHwgUHJvbWlzZTxTYXZlUmVzdWx0Pj4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNhdmVIYW5kbGVyOiAoYXJ0aWZhY3RzOiBNb2RlbEFydGlmYWN0cykgPT4gUikge31cblxuICBzYXZlKG1vZGVsQXJ0aWZhY3RzOiBNb2RlbEFydGlmYWN0cyk6IFIge1xuICAgIHJldHVybiB0aGlzLnNhdmVIYW5kbGVyKG1vZGVsQXJ0aWZhY3RzKTtcbiAgfVxufVxuXG5jbGFzcyBQYXNzdGhyb3VnaEFzeW5jIGltcGxlbWVudHMgSU9IYW5kbGVyIHtcbiAgbG9hZD86IExvYWRIYW5kbGVyO1xuICBzYXZlPzogU2F2ZUhhbmRsZXI7XG5cbiAgY29uc3RydWN0b3IoaGFuZGxlcjogSU9IYW5kbGVyU3luYykge1xuICAgIGlmIChoYW5kbGVyLmxvYWQpIHtcbiAgICAgIHRoaXMubG9hZCA9ICgpID0+IFByb21pc2UucmVzb2x2ZShoYW5kbGVyLmxvYWQoKSk7XG4gICAgfVxuICAgIGlmIChoYW5kbGVyLnNhdmUpIHtcbiAgICAgIHRoaXMuc2F2ZSA9IChtb2RlbEFydGlmYWN0czogTW9kZWxBcnRpZmFjdHMpID0+XG4gICAgICAgIFByb21pc2UucmVzb2x2ZShoYW5kbGVyLnNhdmUobW9kZWxBcnRpZmFjdHMpKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIElPSGFuZGxlciB0aGF0IGxvYWRzIG1vZGVsIGFydGlmYWN0cyBmcm9tIG1lbW9yeS5cbiAqXG4gKiBXaGVuIHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBgdGYubG9hZExheWVyc01vZGVsYCwgYW4gaW5zdGFuY2Ugb2ZcbiAqIGB0Zi5MYXllcnNNb2RlbGAgKEtlcmFzLXN0eWxlKSBjYW4gYmUgY29uc3RydWN0ZWQgZnJvbSB0aGUgbG9hZGVkIGFydGlmYWN0cy5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgbW9kZWwgPSBhd2FpdCB0Zi5sb2FkTGF5ZXJzTW9kZWwodGYuaW8uZnJvbU1lbW9yeShcbiAqICAgICBtb2RlbFRvcG9sb2d5LCB3ZWlnaHRTcGVjcywgd2VpZ2h0RGF0YSkpO1xuICogYGBgXG4gKlxuICogQHBhcmFtIG1vZGVsQXJ0aWZhY3RzIGEgb2JqZWN0IGNvbnRhaW5pbmcgbW9kZWwgdG9wb2xvZ3kgKGkuZS4sIHBhcnNlZCBmcm9tXG4gKiAgIHRoZSBKU09OIGZvcm1hdCkuXG4gKiBAcGFyYW0gd2VpZ2h0U3BlY3MgQW4gYXJyYXkgb2YgYFdlaWdodHNNYW5pZmVzdEVudHJ5YCBvYmplY3RzIGRlc2NyaWJpbmcgdGhlXG4gKiAgIG5hbWVzLCBzaGFwZXMsIHR5cGVzLCBhbmQgcXVhbnRpemF0aW9uIG9mIHRoZSB3ZWlnaHQgZGF0YS4gT3B0aW9uYWwuXG4gKiBAcGFyYW0gd2VpZ2h0RGF0YSBBIHNpbmdsZSBgQXJyYXlCdWZmZXJgIGNvbnRhaW5pbmcgdGhlIHdlaWdodCBkYXRhLFxuICogICBjb25jYXRlbmF0ZWQgaW4gdGhlIG9yZGVyIGRlc2NyaWJlZCBieSB0aGUgd2VpZ2h0U3BlY3MuIE9wdGlvbmFsLlxuICogQHBhcmFtIHRyYWluaW5nQ29uZmlnIE1vZGVsIHRyYWluaW5nIGNvbmZpZ3VyYXRpb24uIE9wdGlvbmFsLlxuICpcbiAqIEByZXR1cm5zIEEgcGFzc3Rocm91Z2ggYElPSGFuZGxlcmAgdGhhdCBzaW1wbHkgbG9hZHMgdGhlIHByb3ZpZGVkIGRhdGEuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tTWVtb3J5KFxuICAgIG1vZGVsQXJ0aWZhY3RzOiB7fXxNb2RlbEFydGlmYWN0cywgd2VpZ2h0U3BlY3M/OiBXZWlnaHRzTWFuaWZlc3RFbnRyeVtdLFxuICAgIHdlaWdodERhdGE/OiBBcnJheUJ1ZmZlciwgdHJhaW5pbmdDb25maWc/OiBUcmFpbmluZ0NvbmZpZyk6IElPSGFuZGxlciB7XG5cbiAgY29uc3QgYXJncyA9IGFyZ3VtZW50cyBhcyB1bmtub3duIGFzIFBhcmFtZXRlcnM8dHlwZW9mIGZyb21NZW1vcnk+O1xuICByZXR1cm4gbmV3IFBhc3N0aHJvdWdoQXN5bmMoZnJvbU1lbW9yeVN5bmMoLi4uYXJncykpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gSU9IYW5kbGVyIHRoYXQgbG9hZHMgbW9kZWwgYXJ0aWZhY3RzIGZyb20gbWVtb3J5LlxuICpcbiAqIFdoZW4gdXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIGB0Zi5sb2FkTGF5ZXJzTW9kZWxgLCBhbiBpbnN0YW5jZSBvZlxuICogYHRmLkxheWVyc01vZGVsYCAoS2VyYXMtc3R5bGUpIGNhbiBiZSBjb25zdHJ1Y3RlZCBmcm9tIHRoZSBsb2FkZWQgYXJ0aWZhY3RzLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBtb2RlbCA9IGF3YWl0IHRmLmxvYWRMYXllcnNNb2RlbCh0Zi5pby5mcm9tTWVtb3J5KFxuICogICAgIG1vZGVsVG9wb2xvZ3ksIHdlaWdodFNwZWNzLCB3ZWlnaHREYXRhKSk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gbW9kZWxBcnRpZmFjdHMgYSBvYmplY3QgY29udGFpbmluZyBtb2RlbCB0b3BvbG9neSAoaS5lLiwgcGFyc2VkIGZyb21cbiAqICAgdGhlIEpTT04gZm9ybWF0KS5cbiAqIEBwYXJhbSB3ZWlnaHRTcGVjcyBBbiBhcnJheSBvZiBgV2VpZ2h0c01hbmlmZXN0RW50cnlgIG9iamVjdHMgZGVzY3JpYmluZyB0aGVcbiAqICAgbmFtZXMsIHNoYXBlcywgdHlwZXMsIGFuZCBxdWFudGl6YXRpb24gb2YgdGhlIHdlaWdodCBkYXRhLiBPcHRpb25hbC5cbiAqIEBwYXJhbSB3ZWlnaHREYXRhIEEgc2luZ2xlIGBBcnJheUJ1ZmZlcmAgY29udGFpbmluZyB0aGUgd2VpZ2h0IGRhdGEsXG4gKiAgIGNvbmNhdGVuYXRlZCBpbiB0aGUgb3JkZXIgZGVzY3JpYmVkIGJ5IHRoZSB3ZWlnaHRTcGVjcy4gT3B0aW9uYWwuXG4gKiBAcGFyYW0gdHJhaW5pbmdDb25maWcgTW9kZWwgdHJhaW5pbmcgY29uZmlndXJhdGlvbi4gT3B0aW9uYWwuXG4gKlxuICogQHJldHVybnMgQSBwYXNzdGhyb3VnaCBgSU9IYW5kbGVyU3luY2AgdGhhdCBzaW1wbHkgbG9hZHMgdGhlIHByb3ZpZGVkIGRhdGEuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tTWVtb3J5U3luYyhcbiAgICBtb2RlbEFydGlmYWN0czoge318TW9kZWxBcnRpZmFjdHMsIHdlaWdodFNwZWNzPzogV2VpZ2h0c01hbmlmZXN0RW50cnlbXSxcbiAgICB3ZWlnaHREYXRhPzogQXJyYXlCdWZmZXIsIHRyYWluaW5nQ29uZmlnPzogVHJhaW5pbmdDb25maWcpOiBJT0hhbmRsZXJTeW5jIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICBjb25zdCBpc01vZGVsQXJ0aWZhY3RzID1cbiAgICAgICAgKG1vZGVsQXJ0aWZhY3RzIGFzIE1vZGVsQXJ0aWZhY3RzKS5tb2RlbFRvcG9sb2d5ICE9IG51bGwgfHxcbiAgICAgICAgKG1vZGVsQXJ0aWZhY3RzIGFzIE1vZGVsQXJ0aWZhY3RzKS53ZWlnaHRTcGVjcyAhPSBudWxsO1xuICAgIGlmIChpc01vZGVsQXJ0aWZhY3RzKSB7XG4gICAgICByZXR1cm4gbmV3IFBhc3N0aHJvdWdoTG9hZGVyKG1vZGVsQXJ0aWZhY3RzIGFzIE1vZGVsQXJ0aWZhY3RzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTGVnYWN5IHN1cHBvcnQ6IHdpdGggb25seSBtb2RlbFRvcG9sb2d5LlxuICAgICAgLy8gVE9ETyhjYWlzKTogUmVtb3ZlIHRoaXMgZGVwcmVjYXRlZCBBUEkuXG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgJ1BsZWFzZSBjYWxsIHRmLmlvLmZyb21NZW1vcnkoKSB3aXRoIG9ubHkgb25lIGFyZ3VtZW50LiAnICtcbiAgICAgICAgICAnVGhlIGFyZ3VtZW50IHNob3VsZCBiZSBvZiB0eXBlIE1vZGVsQXJ0aWZhY3RzLiAnICtcbiAgICAgICAgICAnVGhlIG11bHRpLWFyZ3VtZW50IHNpZ25hdHVyZSBvZiB0Zi5pby5mcm9tTWVtb3J5KCkgaGFzIGJlZW4gJyArXG4gICAgICAgICAgJ2RlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBhIGZ1dHVyZSByZWxlYXNlLicpO1xuICAgICAgcmV0dXJuIG5ldyBQYXNzdGhyb3VnaExvYWRlcih7bW9kZWxUb3BvbG9neTogbW9kZWxBcnRpZmFjdHMgYXMge319KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gTGVnYWN5IHN1cHBvcnQuXG4gICAgLy8gVE9ETyhjYWlzKTogUmVtb3ZlIHRoaXMgZGVwcmVjYXRlZCBBUEkuXG4gICAgY29uc29sZS53YXJuKFxuICAgICAgICAnUGxlYXNlIGNhbGwgdGYuaW8uZnJvbU1lbW9yeSgpIHdpdGggb25seSBvbmUgYXJndW1lbnQuICcgK1xuICAgICAgICAnVGhlIGFyZ3VtZW50IHNob3VsZCBiZSBvZiB0eXBlIE1vZGVsQXJ0aWZhY3RzLiAnICtcbiAgICAgICAgJ1RoZSBtdWx0aS1hcmd1bWVudCBzaWduYXR1cmUgb2YgdGYuaW8uZnJvbU1lbW9yeSgpIGhhcyBiZWVuICcgK1xuICAgICAgICAnZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIGEgZnV0dXJlIHJlbGVhc2UuJyk7XG4gICAgcmV0dXJuIG5ldyBQYXNzdGhyb3VnaExvYWRlcih7XG4gICAgICBtb2RlbFRvcG9sb2d5OiBtb2RlbEFydGlmYWN0cyBhcyB7fSxcbiAgICAgIHdlaWdodFNwZWNzLFxuICAgICAgd2VpZ2h0RGF0YSxcbiAgICAgIHRyYWluaW5nQ29uZmlnXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIElPSGFuZGxlciB0aGF0IHBhc3NlcyBzYXZlZCBtb2RlbCBhcnRpZmFjdHMgdG8gYSBjYWxsYmFjay5cbiAqXG4gKiBgYGBqc1xuICogZnVuY3Rpb24gaGFuZGxlU2F2ZShhcnRpZmFjdHMpIHtcbiAqICAgLy8gLi4uIGRvIHNvbWV0aGluZyB3aXRoIHRoZSBhcnRpZmFjdHMgLi4uXG4gKiAgIHJldHVybiB7bW9kZWxBcnRpZmFjdHNJbmZvOiB7Li4ufSwgLi4ufTtcbiAqIH1cbiAqXG4gKiBjb25zdCBzYXZlUmVzdWx0ID0gbW9kZWwuc2F2ZSh0Zi5pby53aXRoU2F2ZUhhbmRsZXIoaGFuZGxlU2F2ZSkpO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHNhdmVIYW5kbGVyIEEgZnVuY3Rpb24gdGhhdCBhY2NlcHRzIGEgYE1vZGVsQXJ0aWZhY3RzYCBhbmQgcmV0dXJucyBhXG4gKiAgICAgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgYFNhdmVSZXN1bHRgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gd2l0aFNhdmVIYW5kbGVyKFxuICAgIHNhdmVIYW5kbGVyOiAoYXJ0aWZhY3RzOiBNb2RlbEFydGlmYWN0cykgPT5cbiAgICAgICAgUHJvbWlzZTxTYXZlUmVzdWx0Pik6IElPSGFuZGxlciB7XG4gIHJldHVybiBuZXcgUGFzc3Rocm91Z2hTYXZlcihzYXZlSGFuZGxlcik7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBJT0hhbmRsZXJTeW5jIHRoYXQgcGFzc2VzIHNhdmVkIG1vZGVsIGFydGlmYWN0cyB0byBhIGNhbGxiYWNrLlxuICpcbiAqIGBgYGpzXG4gKiBmdW5jdGlvbiBoYW5kbGVTYXZlKGFydGlmYWN0cykge1xuICogICAvLyAuLi4gZG8gc29tZXRoaW5nIHdpdGggdGhlIGFydGlmYWN0cyAuLi5cbiAqICAgcmV0dXJuIHttb2RlbEFydGlmYWN0c0luZm86IHsuLi59LCAuLi59O1xuICogfVxuICpcbiAqIGNvbnN0IHNhdmVSZXN1bHQgPSBtb2RlbC5zYXZlKHRmLmlvLndpdGhTYXZlSGFuZGxlcihoYW5kbGVTYXZlKSk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gc2F2ZUhhbmRsZXIgQSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgYSBgTW9kZWxBcnRpZmFjdHNgIGFuZCByZXR1cm5zIGFcbiAqICAgICBgU2F2ZVJlc3VsdGAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3aXRoU2F2ZUhhbmRsZXJTeW5jKFxuICAgIHNhdmVIYW5kbGVyOiAoYXJ0aWZhY3RzOiBNb2RlbEFydGlmYWN0cykgPT4gU2F2ZVJlc3VsdCk6IElPSGFuZGxlclN5bmMge1xuICByZXR1cm4gbmV3IFBhc3N0aHJvdWdoU2F2ZXI8U2F2ZVJlc3VsdD4oc2F2ZUhhbmRsZXIpO1xufVxuIl19