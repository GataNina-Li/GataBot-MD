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
 *
 * =============================================================================
 */
import { datasetFromIteratorFn } from './dataset';
import { CSVDataset } from './datasets/csv_dataset';
import { iteratorFromFunction } from './iterators/lazy_iterator';
import { MicrophoneIterator } from './iterators/microphone_iterator';
import { WebcamIterator } from './iterators/webcam_iterator';
import { URLDataSource } from './sources/url_data_source';
/**
 * Create a `CSVDataset` by reading and decoding CSV file(s) from provided URL
 * or local path if it's in Node environment.
 *
 * Note: If isLabel in columnConfigs is `true` for at least one column, the
 * element in returned `CSVDataset` will be an object of
 * `{xs:features, ys:labels}`: xs is a dict of features key/value pairs, ys
 * is a dict of labels key/value pairs. If no column is marked as label,
 * returns a dict of features only.
 *
 * ```js
 * const csvUrl =
 * 'https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/boston-housing-train.csv';
 *
 * async function run() {
 *   // We want to predict the column "medv", which represents a median value of
 *   // a home (in $1000s), so we mark it as a label.
 *   const csvDataset = tf.data.csv(
 *     csvUrl, {
 *       columnConfigs: {
 *         medv: {
 *           isLabel: true
 *         }
 *       }
 *     });
 *
 *   // Number of features is the number of column names minus one for the label
 *   // column.
 *   const numOfFeatures = (await csvDataset.columnNames()).length - 1;
 *
 *   // Prepare the Dataset for training.
 *   const flattenedDataset =
 *     csvDataset
 *     .map(({xs, ys}) =>
 *       {
 *         // Convert xs(features) and ys(labels) from object form (keyed by
 *         // column name) to array form.
 *         return {xs:Object.values(xs), ys:Object.values(ys)};
 *       })
 *     .batch(10);
 *
 *   // Define the model.
 *   const model = tf.sequential();
 *   model.add(tf.layers.dense({
 *     inputShape: [numOfFeatures],
 *     units: 1
 *   }));
 *   model.compile({
 *     optimizer: tf.train.sgd(0.000001),
 *     loss: 'meanSquaredError'
 *   });
 *
 *   // Fit the model using the prepared Dataset
 *   return model.fitDataset(flattenedDataset, {
 *     epochs: 10,
 *     callbacks: {
 *       onEpochEnd: async (epoch, logs) => {
 *         console.log(epoch + ':' + logs.loss);
 *       }
 *     }
 *   });
 * }
 *
 * await run();
 * ```
 *
 * @param source URL or local path to get CSV file. If it's a local path, it
 * must have prefix `file://` and it only works in node environment.
 * @param csvConfig (Optional) A CSVConfig object that contains configurations
 *     of reading and decoding from CSV file(s).
 *
 * @doc {
 *   heading: 'Data',
 *   subheading: 'Creation',
 *   namespace: 'data',
 *   configParamIndices: [1]
 *  }
 */
export function csv(source, csvConfig = {}) {
    return new CSVDataset(new URLDataSource(source), csvConfig);
}
/**
 * Create a `Dataset` that produces each element by calling a provided function.
 *
 * Note that repeated iterations over this `Dataset` may produce different
 * results, because the function will be called anew for each element of each
 * iteration.
 *
 * Also, beware that the sequence of calls to this function may be out of order
 * in time with respect to the logical order of the Dataset. This is due to the
 * asynchronous lazy nature of stream processing, and depends on downstream
 * transformations (e.g. .shuffle()). If the provided function is pure, this is
 * no problem, but if it is a closure over a mutable state (e.g., a traversal
 * pointer), then the order of the produced elements may be scrambled.
 *
 * ```js
 * let i = -1;
 * const func = () =>
 *    ++i < 5 ? {value: i, done: false} : {value: null, done: true};
 * const ds = tf.data.func(func);
 * await ds.forEachAsync(e => console.log(e));
 * ```
 *
 * @param f A function that produces one data element on each call.
 */
export function func(f) {
    const iter = iteratorFromFunction(f);
    return datasetFromIteratorFn(async () => iter);
}
/**
 * Create a `Dataset` that produces each element from provided JavaScript
 * generator, which is a function*
 * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Generator_functions),
 * or a function that returns an
 * iterator
 * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Generator_functions).
 *
 * The returned iterator should have `.next()` function that returns element in
 * format of `{value: TensorContainer, done:boolean}`.
 *
 * Example of creating a dataset from an iterator factory:
 * ```js
 * function makeIterator() {
 *   const numElements = 10;
 *   let index = 0;
 *
 *   const iterator = {
 *     next: () => {
 *       let result;
 *       if (index < numElements) {
 *         result = {value: index, done: false};
 *         index++;
 *         return result;
 *       }
 *       return {value: index, done: true};
 *     }
 *   };
 *   return iterator;
 * }
 * const ds = tf.data.generator(makeIterator);
 * await ds.forEachAsync(e => console.log(e));
 * ```
 *
 * Example of creating a dataset from a generator:
 * ```js
 * function* dataGenerator() {
 *   const numElements = 10;
 *   let index = 0;
 *   while (index < numElements) {
 *     const x = index;
 *     index++;
 *     yield x;
 *   }
 * }
 *
 * const ds = tf.data.generator(dataGenerator);
 * await ds.forEachAsync(e => console.log(e));
 * ```
 *
 * @param generator A JavaScript generator function that returns a JavaScript
 *     iterator.
 *
 * @doc {
 *   heading: 'Data',
 *   subheading: 'Creation',
 *   namespace: 'data',
 *   configParamIndices: [1]
 *  }
 */
export function generator(generator) {
    return datasetFromIteratorFn(async () => {
        const gen = await generator();
        return iteratorFromFunction(() => gen.next());
    });
}
/**
 * Create an iterator that generates `Tensor`s from webcam video stream. This
 * API only works in Browser environment when the device has webcam.
 *
 * Note: this code snippet only works when the device has a webcam. It will
 * request permission to open the webcam when running.
 * ```js
 * const videoElement = document.createElement('video');
 * videoElement.width = 100;
 * videoElement.height = 100;
 * const cam = await tf.data.webcam(videoElement);
 * const img = await cam.capture();
 * img.print();
 * cam.stop();
 * ```
 *
 * @param webcamVideoElement A `HTMLVideoElement` used to play video from
 *     webcam. If this element is not provided, a hidden `HTMLVideoElement` will
 *     be created. In that case, `resizeWidth` and `resizeHeight` must be
 *     provided to set the generated tensor shape.
 * @param webcamConfig A `WebcamConfig` object that contains configurations of
 *     reading and manipulating data from webcam video stream.
 *
 * @doc {
 *   heading: 'Data',
 *   subheading: 'Creation',
 *   namespace: 'data',
 *   ignoreCI: true
 *  }
 */
export async function webcam(webcamVideoElement, webcamConfig) {
    return WebcamIterator.create(webcamVideoElement, webcamConfig);
}
/**
 * Create an iterator that generates frequency-domain spectrogram `Tensor`s from
 * microphone audio stream with browser's native FFT. This API only works in
 * browser environment when the device has microphone.
 *
 * Note: this code snippet only works when the device has a microphone. It will
 * request permission to open the microphone when running.
 * ```js
 * const mic = await tf.data.microphone({
 *   fftSize: 1024,
 *   columnTruncateLength: 232,
 *   numFramesPerSpectrogram: 43,
 *   sampleRateHz:44100,
 *   includeSpectrogram: true,
 *   includeWaveform: true
 * });
 * const audioData = await mic.capture();
 * const spectrogramTensor = audioData.spectrogram;
 * spectrogramTensor.print();
 * const waveformTensor = audioData.waveform;
 * waveformTensor.print();
 * mic.stop();
 * ```
 *
 * @param microphoneConfig A `MicrophoneConfig` object that contains
 *     configurations of reading audio data from microphone.
 *
 * @doc {
 *   heading: 'Data',
 *   subheading: 'Creation',
 *   namespace: 'data',
 *   ignoreCI: true
 *  }
 */
export async function microphone(microphoneConfig) {
    return MicrophoneIterator.create(microphoneConfig);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhZGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtZGF0YS9zcmMvcmVhZGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUdILE9BQU8sRUFBVSxxQkFBcUIsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUN6RCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDbEQsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDL0QsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFDbkUsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQzNELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUd4RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2RUc7QUFDSCxNQUFNLFVBQVUsR0FBRyxDQUNmLE1BQW1CLEVBQUUsWUFBdUIsRUFBRTtJQUNoRCxPQUFPLElBQUksVUFBVSxDQUFDLElBQUksYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Qkc7QUFDSCxNQUFNLFVBQVUsSUFBSSxDQUNoQixDQUFzRDtJQUN4RCxNQUFNLElBQUksR0FBRyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxPQUFPLHFCQUFxQixDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakQsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJERztBQUNILE1BQU0sVUFBVSxTQUFTLENBQ3JCLFNBQWtEO0lBQ3BELE9BQU8scUJBQXFCLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDdEMsTUFBTSxHQUFHLEdBQUcsTUFBTSxTQUFTLEVBQUUsQ0FBQztRQUM5QixPQUFPLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTZCRztBQUNILE1BQU0sQ0FBQyxLQUFLLFVBQVUsTUFBTSxDQUN4QixrQkFBcUMsRUFDckMsWUFBMkI7SUFDN0IsT0FBTyxjQUFjLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUNHO0FBQ0gsTUFBTSxDQUFDLEtBQUssVUFBVSxVQUFVLENBQUMsZ0JBQW1DO0lBRWxFLE9BQU8sa0JBQWtCLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDckQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7VGVuc29yQ29udGFpbmVyfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0IHtEYXRhc2V0LCBkYXRhc2V0RnJvbUl0ZXJhdG9yRm59IGZyb20gJy4vZGF0YXNldCc7XG5pbXBvcnQge0NTVkRhdGFzZXR9IGZyb20gJy4vZGF0YXNldHMvY3N2X2RhdGFzZXQnO1xuaW1wb3J0IHtpdGVyYXRvckZyb21GdW5jdGlvbn0gZnJvbSAnLi9pdGVyYXRvcnMvbGF6eV9pdGVyYXRvcic7XG5pbXBvcnQge01pY3JvcGhvbmVJdGVyYXRvcn0gZnJvbSAnLi9pdGVyYXRvcnMvbWljcm9waG9uZV9pdGVyYXRvcic7XG5pbXBvcnQge1dlYmNhbUl0ZXJhdG9yfSBmcm9tICcuL2l0ZXJhdG9ycy93ZWJjYW1faXRlcmF0b3InO1xuaW1wb3J0IHtVUkxEYXRhU291cmNlfSBmcm9tICcuL3NvdXJjZXMvdXJsX2RhdGFfc291cmNlJztcbmltcG9ydCB7Q1NWQ29uZmlnLCBNaWNyb3Bob25lQ29uZmlnLCBXZWJjYW1Db25maWd9IGZyb20gJy4vdHlwZXMnO1xuXG4vKipcbiAqIENyZWF0ZSBhIGBDU1ZEYXRhc2V0YCBieSByZWFkaW5nIGFuZCBkZWNvZGluZyBDU1YgZmlsZShzKSBmcm9tIHByb3ZpZGVkIFVSTFxuICogb3IgbG9jYWwgcGF0aCBpZiBpdCdzIGluIE5vZGUgZW52aXJvbm1lbnQuXG4gKlxuICogTm90ZTogSWYgaXNMYWJlbCBpbiBjb2x1bW5Db25maWdzIGlzIGB0cnVlYCBmb3IgYXQgbGVhc3Qgb25lIGNvbHVtbiwgdGhlXG4gKiBlbGVtZW50IGluIHJldHVybmVkIGBDU1ZEYXRhc2V0YCB3aWxsIGJlIGFuIG9iamVjdCBvZlxuICogYHt4czpmZWF0dXJlcywgeXM6bGFiZWxzfWA6IHhzIGlzIGEgZGljdCBvZiBmZWF0dXJlcyBrZXkvdmFsdWUgcGFpcnMsIHlzXG4gKiBpcyBhIGRpY3Qgb2YgbGFiZWxzIGtleS92YWx1ZSBwYWlycy4gSWYgbm8gY29sdW1uIGlzIG1hcmtlZCBhcyBsYWJlbCxcbiAqIHJldHVybnMgYSBkaWN0IG9mIGZlYXR1cmVzIG9ubHkuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGNzdlVybCA9XG4gKiAnaHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL3RmanMtZXhhbXBsZXMvbXVsdGl2YXJpYXRlLWxpbmVhci1yZWdyZXNzaW9uL2RhdGEvYm9zdG9uLWhvdXNpbmctdHJhaW4uY3N2JztcbiAqXG4gKiBhc3luYyBmdW5jdGlvbiBydW4oKSB7XG4gKiAgIC8vIFdlIHdhbnQgdG8gcHJlZGljdCB0aGUgY29sdW1uIFwibWVkdlwiLCB3aGljaCByZXByZXNlbnRzIGEgbWVkaWFuIHZhbHVlIG9mXG4gKiAgIC8vIGEgaG9tZSAoaW4gJDEwMDBzKSwgc28gd2UgbWFyayBpdCBhcyBhIGxhYmVsLlxuICogICBjb25zdCBjc3ZEYXRhc2V0ID0gdGYuZGF0YS5jc3YoXG4gKiAgICAgY3N2VXJsLCB7XG4gKiAgICAgICBjb2x1bW5Db25maWdzOiB7XG4gKiAgICAgICAgIG1lZHY6IHtcbiAqICAgICAgICAgICBpc0xhYmVsOiB0cnVlXG4gKiAgICAgICAgIH1cbiAqICAgICAgIH1cbiAqICAgICB9KTtcbiAqXG4gKiAgIC8vIE51bWJlciBvZiBmZWF0dXJlcyBpcyB0aGUgbnVtYmVyIG9mIGNvbHVtbiBuYW1lcyBtaW51cyBvbmUgZm9yIHRoZSBsYWJlbFxuICogICAvLyBjb2x1bW4uXG4gKiAgIGNvbnN0IG51bU9mRmVhdHVyZXMgPSAoYXdhaXQgY3N2RGF0YXNldC5jb2x1bW5OYW1lcygpKS5sZW5ndGggLSAxO1xuICpcbiAqICAgLy8gUHJlcGFyZSB0aGUgRGF0YXNldCBmb3IgdHJhaW5pbmcuXG4gKiAgIGNvbnN0IGZsYXR0ZW5lZERhdGFzZXQgPVxuICogICAgIGNzdkRhdGFzZXRcbiAqICAgICAubWFwKCh7eHMsIHlzfSkgPT5cbiAqICAgICAgIHtcbiAqICAgICAgICAgLy8gQ29udmVydCB4cyhmZWF0dXJlcykgYW5kIHlzKGxhYmVscykgZnJvbSBvYmplY3QgZm9ybSAoa2V5ZWQgYnlcbiAqICAgICAgICAgLy8gY29sdW1uIG5hbWUpIHRvIGFycmF5IGZvcm0uXG4gKiAgICAgICAgIHJldHVybiB7eHM6T2JqZWN0LnZhbHVlcyh4cyksIHlzOk9iamVjdC52YWx1ZXMoeXMpfTtcbiAqICAgICAgIH0pXG4gKiAgICAgLmJhdGNoKDEwKTtcbiAqXG4gKiAgIC8vIERlZmluZSB0aGUgbW9kZWwuXG4gKiAgIGNvbnN0IG1vZGVsID0gdGYuc2VxdWVudGlhbCgpO1xuICogICBtb2RlbC5hZGQodGYubGF5ZXJzLmRlbnNlKHtcbiAqICAgICBpbnB1dFNoYXBlOiBbbnVtT2ZGZWF0dXJlc10sXG4gKiAgICAgdW5pdHM6IDFcbiAqICAgfSkpO1xuICogICBtb2RlbC5jb21waWxlKHtcbiAqICAgICBvcHRpbWl6ZXI6IHRmLnRyYWluLnNnZCgwLjAwMDAwMSksXG4gKiAgICAgbG9zczogJ21lYW5TcXVhcmVkRXJyb3InXG4gKiAgIH0pO1xuICpcbiAqICAgLy8gRml0IHRoZSBtb2RlbCB1c2luZyB0aGUgcHJlcGFyZWQgRGF0YXNldFxuICogICByZXR1cm4gbW9kZWwuZml0RGF0YXNldChmbGF0dGVuZWREYXRhc2V0LCB7XG4gKiAgICAgZXBvY2hzOiAxMCxcbiAqICAgICBjYWxsYmFja3M6IHtcbiAqICAgICAgIG9uRXBvY2hFbmQ6IGFzeW5jIChlcG9jaCwgbG9ncykgPT4ge1xuICogICAgICAgICBjb25zb2xlLmxvZyhlcG9jaCArICc6JyArIGxvZ3MubG9zcyk7XG4gKiAgICAgICB9XG4gKiAgICAgfVxuICogICB9KTtcbiAqIH1cbiAqXG4gKiBhd2FpdCBydW4oKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBzb3VyY2UgVVJMIG9yIGxvY2FsIHBhdGggdG8gZ2V0IENTViBmaWxlLiBJZiBpdCdzIGEgbG9jYWwgcGF0aCwgaXRcbiAqIG11c3QgaGF2ZSBwcmVmaXggYGZpbGU6Ly9gIGFuZCBpdCBvbmx5IHdvcmtzIGluIG5vZGUgZW52aXJvbm1lbnQuXG4gKiBAcGFyYW0gY3N2Q29uZmlnIChPcHRpb25hbCkgQSBDU1ZDb25maWcgb2JqZWN0IHRoYXQgY29udGFpbnMgY29uZmlndXJhdGlvbnNcbiAqICAgICBvZiByZWFkaW5nIGFuZCBkZWNvZGluZyBmcm9tIENTViBmaWxlKHMpLlxuICpcbiAqIEBkb2Mge1xuICogICBoZWFkaW5nOiAnRGF0YScsXG4gKiAgIHN1YmhlYWRpbmc6ICdDcmVhdGlvbicsXG4gKiAgIG5hbWVzcGFjZTogJ2RhdGEnLFxuICogICBjb25maWdQYXJhbUluZGljZXM6IFsxXVxuICogIH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNzdihcbiAgICBzb3VyY2U6IFJlcXVlc3RJbmZvLCBjc3ZDb25maWc6IENTVkNvbmZpZyA9IHt9KTogQ1NWRGF0YXNldCB7XG4gIHJldHVybiBuZXcgQ1NWRGF0YXNldChuZXcgVVJMRGF0YVNvdXJjZShzb3VyY2UpLCBjc3ZDb25maWcpO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIGBEYXRhc2V0YCB0aGF0IHByb2R1Y2VzIGVhY2ggZWxlbWVudCBieSBjYWxsaW5nIGEgcHJvdmlkZWQgZnVuY3Rpb24uXG4gKlxuICogTm90ZSB0aGF0IHJlcGVhdGVkIGl0ZXJhdGlvbnMgb3ZlciB0aGlzIGBEYXRhc2V0YCBtYXkgcHJvZHVjZSBkaWZmZXJlbnRcbiAqIHJlc3VsdHMsIGJlY2F1c2UgdGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFuZXcgZm9yIGVhY2ggZWxlbWVudCBvZiBlYWNoXG4gKiBpdGVyYXRpb24uXG4gKlxuICogQWxzbywgYmV3YXJlIHRoYXQgdGhlIHNlcXVlbmNlIG9mIGNhbGxzIHRvIHRoaXMgZnVuY3Rpb24gbWF5IGJlIG91dCBvZiBvcmRlclxuICogaW4gdGltZSB3aXRoIHJlc3BlY3QgdG8gdGhlIGxvZ2ljYWwgb3JkZXIgb2YgdGhlIERhdGFzZXQuIFRoaXMgaXMgZHVlIHRvIHRoZVxuICogYXN5bmNocm9ub3VzIGxhenkgbmF0dXJlIG9mIHN0cmVhbSBwcm9jZXNzaW5nLCBhbmQgZGVwZW5kcyBvbiBkb3duc3RyZWFtXG4gKiB0cmFuc2Zvcm1hdGlvbnMgKGUuZy4gLnNodWZmbGUoKSkuIElmIHRoZSBwcm92aWRlZCBmdW5jdGlvbiBpcyBwdXJlLCB0aGlzIGlzXG4gKiBubyBwcm9ibGVtLCBidXQgaWYgaXQgaXMgYSBjbG9zdXJlIG92ZXIgYSBtdXRhYmxlIHN0YXRlIChlLmcuLCBhIHRyYXZlcnNhbFxuICogcG9pbnRlciksIHRoZW4gdGhlIG9yZGVyIG9mIHRoZSBwcm9kdWNlZCBlbGVtZW50cyBtYXkgYmUgc2NyYW1ibGVkLlxuICpcbiAqIGBgYGpzXG4gKiBsZXQgaSA9IC0xO1xuICogY29uc3QgZnVuYyA9ICgpID0+XG4gKiAgICArK2kgPCA1ID8ge3ZhbHVlOiBpLCBkb25lOiBmYWxzZX0gOiB7dmFsdWU6IG51bGwsIGRvbmU6IHRydWV9O1xuICogY29uc3QgZHMgPSB0Zi5kYXRhLmZ1bmMoZnVuYyk7XG4gKiBhd2FpdCBkcy5mb3JFYWNoQXN5bmMoZSA9PiBjb25zb2xlLmxvZyhlKSk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gZiBBIGZ1bmN0aW9uIHRoYXQgcHJvZHVjZXMgb25lIGRhdGEgZWxlbWVudCBvbiBlYWNoIGNhbGwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmdW5jPFQgZXh0ZW5kcyBUZW5zb3JDb250YWluZXI+KFxuICAgIGY6ICgpID0+IEl0ZXJhdG9yUmVzdWx0PFQ+fCBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PFQ+Pik6IERhdGFzZXQ8VD4ge1xuICBjb25zdCBpdGVyID0gaXRlcmF0b3JGcm9tRnVuY3Rpb24oZik7XG4gIHJldHVybiBkYXRhc2V0RnJvbUl0ZXJhdG9yRm4oYXN5bmMgKCkgPT4gaXRlcik7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgYERhdGFzZXRgIHRoYXQgcHJvZHVjZXMgZWFjaCBlbGVtZW50IGZyb20gcHJvdmlkZWQgSmF2YVNjcmlwdFxuICogZ2VuZXJhdG9yLCB3aGljaCBpcyBhIGZ1bmN0aW9uKlxuICogKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvR3VpZGUvSXRlcmF0b3JzX2FuZF9HZW5lcmF0b3JzI0dlbmVyYXRvcl9mdW5jdGlvbnMpLFxuICogb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW5cbiAqIGl0ZXJhdG9yXG4gKiAoaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9HdWlkZS9JdGVyYXRvcnNfYW5kX0dlbmVyYXRvcnMjR2VuZXJhdG9yX2Z1bmN0aW9ucykuXG4gKlxuICogVGhlIHJldHVybmVkIGl0ZXJhdG9yIHNob3VsZCBoYXZlIGAubmV4dCgpYCBmdW5jdGlvbiB0aGF0IHJldHVybnMgZWxlbWVudCBpblxuICogZm9ybWF0IG9mIGB7dmFsdWU6IFRlbnNvckNvbnRhaW5lciwgZG9uZTpib29sZWFufWAuXG4gKlxuICogRXhhbXBsZSBvZiBjcmVhdGluZyBhIGRhdGFzZXQgZnJvbSBhbiBpdGVyYXRvciBmYWN0b3J5OlxuICogYGBganNcbiAqIGZ1bmN0aW9uIG1ha2VJdGVyYXRvcigpIHtcbiAqICAgY29uc3QgbnVtRWxlbWVudHMgPSAxMDtcbiAqICAgbGV0IGluZGV4ID0gMDtcbiAqXG4gKiAgIGNvbnN0IGl0ZXJhdG9yID0ge1xuICogICAgIG5leHQ6ICgpID0+IHtcbiAqICAgICAgIGxldCByZXN1bHQ7XG4gKiAgICAgICBpZiAoaW5kZXggPCBudW1FbGVtZW50cykge1xuICogICAgICAgICByZXN1bHQgPSB7dmFsdWU6IGluZGV4LCBkb25lOiBmYWxzZX07XG4gKiAgICAgICAgIGluZGV4Kys7XG4gKiAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gKiAgICAgICB9XG4gKiAgICAgICByZXR1cm4ge3ZhbHVlOiBpbmRleCwgZG9uZTogdHJ1ZX07XG4gKiAgICAgfVxuICogICB9O1xuICogICByZXR1cm4gaXRlcmF0b3I7XG4gKiB9XG4gKiBjb25zdCBkcyA9IHRmLmRhdGEuZ2VuZXJhdG9yKG1ha2VJdGVyYXRvcik7XG4gKiBhd2FpdCBkcy5mb3JFYWNoQXN5bmMoZSA9PiBjb25zb2xlLmxvZyhlKSk7XG4gKiBgYGBcbiAqXG4gKiBFeGFtcGxlIG9mIGNyZWF0aW5nIGEgZGF0YXNldCBmcm9tIGEgZ2VuZXJhdG9yOlxuICogYGBganNcbiAqIGZ1bmN0aW9uKiBkYXRhR2VuZXJhdG9yKCkge1xuICogICBjb25zdCBudW1FbGVtZW50cyA9IDEwO1xuICogICBsZXQgaW5kZXggPSAwO1xuICogICB3aGlsZSAoaW5kZXggPCBudW1FbGVtZW50cykge1xuICogICAgIGNvbnN0IHggPSBpbmRleDtcbiAqICAgICBpbmRleCsrO1xuICogICAgIHlpZWxkIHg7XG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBjb25zdCBkcyA9IHRmLmRhdGEuZ2VuZXJhdG9yKGRhdGFHZW5lcmF0b3IpO1xuICogYXdhaXQgZHMuZm9yRWFjaEFzeW5jKGUgPT4gY29uc29sZS5sb2coZSkpO1xuICogYGBgXG4gKlxuICogQHBhcmFtIGdlbmVyYXRvciBBIEphdmFTY3JpcHQgZ2VuZXJhdG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIEphdmFTY3JpcHRcbiAqICAgICBpdGVyYXRvci5cbiAqXG4gKiBAZG9jIHtcbiAqICAgaGVhZGluZzogJ0RhdGEnLFxuICogICBzdWJoZWFkaW5nOiAnQ3JlYXRpb24nLFxuICogICBuYW1lc3BhY2U6ICdkYXRhJyxcbiAqICAgY29uZmlnUGFyYW1JbmRpY2VzOiBbMV1cbiAqICB9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0b3I8VCBleHRlbmRzIFRlbnNvckNvbnRhaW5lcj4oXG4gICAgZ2VuZXJhdG9yOiAoKSA9PiBJdGVyYXRvcjxUPnwgUHJvbWlzZTxJdGVyYXRvcjxUPj4pOiBEYXRhc2V0PFQ+IHtcbiAgcmV0dXJuIGRhdGFzZXRGcm9tSXRlcmF0b3JGbihhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgZ2VuID0gYXdhaXQgZ2VuZXJhdG9yKCk7XG4gICAgcmV0dXJuIGl0ZXJhdG9yRnJvbUZ1bmN0aW9uKCgpID0+IGdlbi5uZXh0KCkpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYW4gaXRlcmF0b3IgdGhhdCBnZW5lcmF0ZXMgYFRlbnNvcmBzIGZyb20gd2ViY2FtIHZpZGVvIHN0cmVhbS4gVGhpc1xuICogQVBJIG9ubHkgd29ya3MgaW4gQnJvd3NlciBlbnZpcm9ubWVudCB3aGVuIHRoZSBkZXZpY2UgaGFzIHdlYmNhbS5cbiAqXG4gKiBOb3RlOiB0aGlzIGNvZGUgc25pcHBldCBvbmx5IHdvcmtzIHdoZW4gdGhlIGRldmljZSBoYXMgYSB3ZWJjYW0uIEl0IHdpbGxcbiAqIHJlcXVlc3QgcGVybWlzc2lvbiB0byBvcGVuIHRoZSB3ZWJjYW0gd2hlbiBydW5uaW5nLlxuICogYGBganNcbiAqIGNvbnN0IHZpZGVvRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG4gKiB2aWRlb0VsZW1lbnQud2lkdGggPSAxMDA7XG4gKiB2aWRlb0VsZW1lbnQuaGVpZ2h0ID0gMTAwO1xuICogY29uc3QgY2FtID0gYXdhaXQgdGYuZGF0YS53ZWJjYW0odmlkZW9FbGVtZW50KTtcbiAqIGNvbnN0IGltZyA9IGF3YWl0IGNhbS5jYXB0dXJlKCk7XG4gKiBpbWcucHJpbnQoKTtcbiAqIGNhbS5zdG9wKCk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gd2ViY2FtVmlkZW9FbGVtZW50IEEgYEhUTUxWaWRlb0VsZW1lbnRgIHVzZWQgdG8gcGxheSB2aWRlbyBmcm9tXG4gKiAgICAgd2ViY2FtLiBJZiB0aGlzIGVsZW1lbnQgaXMgbm90IHByb3ZpZGVkLCBhIGhpZGRlbiBgSFRNTFZpZGVvRWxlbWVudGAgd2lsbFxuICogICAgIGJlIGNyZWF0ZWQuIEluIHRoYXQgY2FzZSwgYHJlc2l6ZVdpZHRoYCBhbmQgYHJlc2l6ZUhlaWdodGAgbXVzdCBiZVxuICogICAgIHByb3ZpZGVkIHRvIHNldCB0aGUgZ2VuZXJhdGVkIHRlbnNvciBzaGFwZS5cbiAqIEBwYXJhbSB3ZWJjYW1Db25maWcgQSBgV2ViY2FtQ29uZmlnYCBvYmplY3QgdGhhdCBjb250YWlucyBjb25maWd1cmF0aW9ucyBvZlxuICogICAgIHJlYWRpbmcgYW5kIG1hbmlwdWxhdGluZyBkYXRhIGZyb20gd2ViY2FtIHZpZGVvIHN0cmVhbS5cbiAqXG4gKiBAZG9jIHtcbiAqICAgaGVhZGluZzogJ0RhdGEnLFxuICogICBzdWJoZWFkaW5nOiAnQ3JlYXRpb24nLFxuICogICBuYW1lc3BhY2U6ICdkYXRhJyxcbiAqICAgaWdub3JlQ0k6IHRydWVcbiAqICB9XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3ZWJjYW0oXG4gICAgd2ViY2FtVmlkZW9FbGVtZW50PzogSFRNTFZpZGVvRWxlbWVudCxcbiAgICB3ZWJjYW1Db25maWc/OiBXZWJjYW1Db25maWcpOiBQcm9taXNlPFdlYmNhbUl0ZXJhdG9yPiB7XG4gIHJldHVybiBXZWJjYW1JdGVyYXRvci5jcmVhdGUod2ViY2FtVmlkZW9FbGVtZW50LCB3ZWJjYW1Db25maWcpO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhbiBpdGVyYXRvciB0aGF0IGdlbmVyYXRlcyBmcmVxdWVuY3ktZG9tYWluIHNwZWN0cm9ncmFtIGBUZW5zb3JgcyBmcm9tXG4gKiBtaWNyb3Bob25lIGF1ZGlvIHN0cmVhbSB3aXRoIGJyb3dzZXIncyBuYXRpdmUgRkZULiBUaGlzIEFQSSBvbmx5IHdvcmtzIGluXG4gKiBicm93c2VyIGVudmlyb25tZW50IHdoZW4gdGhlIGRldmljZSBoYXMgbWljcm9waG9uZS5cbiAqXG4gKiBOb3RlOiB0aGlzIGNvZGUgc25pcHBldCBvbmx5IHdvcmtzIHdoZW4gdGhlIGRldmljZSBoYXMgYSBtaWNyb3Bob25lLiBJdCB3aWxsXG4gKiByZXF1ZXN0IHBlcm1pc3Npb24gdG8gb3BlbiB0aGUgbWljcm9waG9uZSB3aGVuIHJ1bm5pbmcuXG4gKiBgYGBqc1xuICogY29uc3QgbWljID0gYXdhaXQgdGYuZGF0YS5taWNyb3Bob25lKHtcbiAqICAgZmZ0U2l6ZTogMTAyNCxcbiAqICAgY29sdW1uVHJ1bmNhdGVMZW5ndGg6IDIzMixcbiAqICAgbnVtRnJhbWVzUGVyU3BlY3Ryb2dyYW06IDQzLFxuICogICBzYW1wbGVSYXRlSHo6NDQxMDAsXG4gKiAgIGluY2x1ZGVTcGVjdHJvZ3JhbTogdHJ1ZSxcbiAqICAgaW5jbHVkZVdhdmVmb3JtOiB0cnVlXG4gKiB9KTtcbiAqIGNvbnN0IGF1ZGlvRGF0YSA9IGF3YWl0IG1pYy5jYXB0dXJlKCk7XG4gKiBjb25zdCBzcGVjdHJvZ3JhbVRlbnNvciA9IGF1ZGlvRGF0YS5zcGVjdHJvZ3JhbTtcbiAqIHNwZWN0cm9ncmFtVGVuc29yLnByaW50KCk7XG4gKiBjb25zdCB3YXZlZm9ybVRlbnNvciA9IGF1ZGlvRGF0YS53YXZlZm9ybTtcbiAqIHdhdmVmb3JtVGVuc29yLnByaW50KCk7XG4gKiBtaWMuc3RvcCgpO1xuICogYGBgXG4gKlxuICogQHBhcmFtIG1pY3JvcGhvbmVDb25maWcgQSBgTWljcm9waG9uZUNvbmZpZ2Agb2JqZWN0IHRoYXQgY29udGFpbnNcbiAqICAgICBjb25maWd1cmF0aW9ucyBvZiByZWFkaW5nIGF1ZGlvIGRhdGEgZnJvbSBtaWNyb3Bob25lLlxuICpcbiAqIEBkb2Mge1xuICogICBoZWFkaW5nOiAnRGF0YScsXG4gKiAgIHN1YmhlYWRpbmc6ICdDcmVhdGlvbicsXG4gKiAgIG5hbWVzcGFjZTogJ2RhdGEnLFxuICogICBpZ25vcmVDSTogdHJ1ZVxuICogIH1cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1pY3JvcGhvbmUobWljcm9waG9uZUNvbmZpZz86IE1pY3JvcGhvbmVDb25maWcpOlxuICAgIFByb21pc2U8TWljcm9waG9uZUl0ZXJhdG9yPiB7XG4gIHJldHVybiBNaWNyb3Bob25lSXRlcmF0b3IuY3JlYXRlKG1pY3JvcGhvbmVDb25maWcpO1xufVxuIl19