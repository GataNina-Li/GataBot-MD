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
import * as tf from '@tensorflow/tfjs-core';
import { div, max, min, sub } from '@tensorflow/tfjs-core';
/**
 * Provides a function that scales numeric values into the [0, 1] interval.
 *
 * @param min the lower bound of the inputs, which should be mapped to 0.
 * @param max the upper bound of the inputs, which should be mapped to 1,
 * @return A function that maps an input ElementArray to a scaled ElementArray.
 */
export function scaleTo01(min, max) {
    const range = max - min;
    const minTensor = tf.scalar(min);
    const rangeTensor = tf.scalar(range);
    return (value) => {
        if (typeof (value) === 'string') {
            throw new Error('Can\'t scale a string.');
        }
        else {
            if (value instanceof tf.Tensor) {
                const result = div(sub(value, minTensor), rangeTensor);
                return result;
            }
            else if (value instanceof Array) {
                return value.map(v => (v - min) / range);
            }
            else {
                return (value - min) / range;
            }
        }
    };
}
/**
 * Provides a function that calculates column level statistics, i.e. min, max,
 * variance, stddev.
 *
 * @param dataset The Dataset object whose statistics will be calculated.
 * @param sampleSize (Optional) If set, statistics will only be calculated
 *     against a subset of the whole data.
 * @param shuffleWindowSize (Optional) If set, shuffle provided dataset before
 *     calculating statistics.
 * @return A DatasetStatistics object that contains NumericColumnStatistics of
 *     each column.
 */
export async function computeDatasetStatistics(dataset, sampleSize, shuffleWindowSize) {
    let sampleDataset = dataset;
    // TODO(soergel): allow for deep shuffle where possible.
    if (shuffleWindowSize != null) {
        sampleDataset = sampleDataset.shuffle(shuffleWindowSize);
    }
    if (sampleSize != null) {
        sampleDataset = sampleDataset.take(sampleSize);
    }
    // TODO(soergel): prepare the column objects based on a schema.
    const result = {};
    await sampleDataset.forEachAsync(e => {
        for (const key of Object.keys(e)) {
            const value = e[key];
            if (typeof (value) === 'string') {
                // No statistics for string element.
            }
            else {
                let previousMean = 0;
                let previousLength = 0;
                let previousVariance = 0;
                let columnStats = result[key];
                if (columnStats == null) {
                    columnStats = {
                        min: Number.POSITIVE_INFINITY,
                        max: Number.NEGATIVE_INFINITY,
                        mean: 0,
                        variance: 0,
                        stddev: 0,
                        length: 0
                    };
                    result[key] = columnStats;
                }
                else {
                    previousMean = columnStats.mean;
                    previousLength = columnStats.length;
                    previousVariance = columnStats.variance;
                }
                let recordMin;
                let recordMax;
                // Calculate accumulated mean and variance following tf.Transform
                // implementation
                let valueLength = 0;
                let valueMean = 0;
                let valueVariance = 0;
                let combinedLength = 0;
                let combinedMean = 0;
                let combinedVariance = 0;
                if (value instanceof tf.Tensor) {
                    recordMin = min(value).dataSync()[0];
                    recordMax = max(value).dataSync()[0];
                    const valueMoment = tf.moments(value);
                    valueMean = valueMoment.mean.dataSync()[0];
                    valueVariance = valueMoment.variance.dataSync()[0];
                    valueLength = value.size;
                }
                else if (value instanceof Array) {
                    recordMin = value.reduce((a, b) => Math.min(a, b));
                    recordMax = value.reduce((a, b) => Math.max(a, b));
                    const valueMoment = tf.moments(value);
                    valueMean = valueMoment.mean.dataSync()[0];
                    valueVariance = valueMoment.variance.dataSync()[0];
                    valueLength = value.length;
                }
                else if (!isNaN(value) && isFinite(value)) {
                    recordMin = value;
                    recordMax = value;
                    valueMean = value;
                    valueVariance = 0;
                    valueLength = 1;
                }
                else {
                    columnStats = null;
                    continue;
                }
                combinedLength = previousLength + valueLength;
                combinedMean = previousMean +
                    (valueLength / combinedLength) * (valueMean - previousMean);
                combinedVariance = previousVariance +
                    (valueLength / combinedLength) *
                        (valueVariance +
                            ((valueMean - combinedMean) * (valueMean - previousMean)) -
                            previousVariance);
                columnStats.min = Math.min(columnStats.min, recordMin);
                columnStats.max = Math.max(columnStats.max, recordMax);
                columnStats.length = combinedLength;
                columnStats.mean = combinedMean;
                columnStats.variance = combinedVariance;
                columnStats.stddev = Math.sqrt(combinedVariance);
            }
        }
    });
    // Variance and stddev should be NaN for the case of a single element.
    for (const key in result) {
        const stat = result[key];
        if (stat.length === 1) {
            stat.variance = NaN;
            stat.stddev = NaN;
        }
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGlzdGljcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtZGF0YS9zcmMvc3RhdGlzdGljcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUVILE9BQU8sS0FBSyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDNUMsT0FBTyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBOEN6RDs7Ozs7O0dBTUc7QUFDSCxNQUFNLFVBQVUsU0FBUyxDQUFDLEdBQVcsRUFBRSxHQUFXO0lBRWhELE1BQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDeEIsTUFBTSxTQUFTLEdBQWMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QyxNQUFNLFdBQVcsR0FBYyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hELE9BQU8sQ0FBQyxLQUFtQixFQUFnQixFQUFFO1FBQzNDLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLFFBQVEsRUFBRTtZQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7U0FDM0M7YUFBTTtZQUNMLElBQUksS0FBSyxZQUFZLEVBQUUsQ0FBQyxNQUFNLEVBQUU7Z0JBQzlCLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUN2RCxPQUFPLE1BQU0sQ0FBQzthQUNmO2lCQUFNLElBQUksS0FBSyxZQUFZLEtBQUssRUFBRTtnQkFDakMsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7YUFDMUM7aUJBQU07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aWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQgKiBhcyB0ZiBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0IHtkaXYsIG1heCwgbWluLCBzdWJ9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7RGF0YXNldH0gZnJvbSAnLi9kYXRhc2V0JztcblxuLy8gVE9ETyhrYW5neWl6aGFuZyk6IGVsaW1pbmF0ZSB0aGUgbmVlZCBmb3IgRWxlbWVudEFycmF5IGFuZCBUYWJ1bGFyUmVjb3JkLCBieVxuLy8gY29tcHV0aW5nIHN0YXRzIG9uIG5lc3RlZCBzdHJ1Y3R1cmVzIHZpYSBkZWVwTWFwL2RlZXBaaXAuXG5cbi8qKlxuICogVGhlIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCBhIGdpdmVuIGtleSBmb3IgYSBzaW5nbGUgZWxlbWVudC5cbiAqXG4gKiBTdWNoIGEgdmFsdWUgbWF5IG5vdCBoYXZlIGEgYmF0Y2ggZGltZW5zaW9uLiAgQSB2YWx1ZSBtYXkgYmUgYSBzY2FsYXIgb3IgYW5cbiAqIG4tZGltZW5zaW9uYWwgYXJyYXkuXG4gKi9cbmV4cG9ydCB0eXBlIEVsZW1lbnRBcnJheSA9IG51bWJlcnxudW1iZXJbXXx0Zi5UZW5zb3J8c3RyaW5nO1xuXG4vKipcbiAqIEEgbWFwIGZyb20gc3RyaW5nIGtleXMgKGFrYSBjb2x1bW4gbmFtZXMpIHRvIHZhbHVlcyBmb3IgYSBzaW5nbGUgZWxlbWVudC5cbiAqL1xuZXhwb3J0IHR5cGUgVGFidWxhclJlY29yZCA9IHtcbiAgW2tleTogc3RyaW5nXTogRWxlbWVudEFycmF5XG59O1xuXG4vLyBUT0RPKGthbmd5aXpoYW5nKTogRmxlc2ggb3V0IGNvbGxlY3RlZCBzdGF0aXN0aWNzLlxuLy8gRm9yIG51bWVyaWMgY29sdW1ucyB3ZSBzaG91bGQgcHJvdmlkZSBtZWFuLCBzdGRkZXYsIGhpc3RvZ3JhbSwgZXRjLlxuLy8gRm9yIHN0cmluZyBjb2x1bW5zIHdlIHNob3VsZCBwcm92aWRlIGEgdm9jYWJ1bGFyeSAoYXQgbGVhc3QsIHRvcC1rKSwgbWF5YmUgYVxuLy8gbGVuZ3RoIGhpc3RvZ3JhbSwgZXRjLlxuLy8gQ29sbGVjdGluZyBvbmx5IG51bWVyaWMgbWluIGFuZCBtYXggaXMganVzdCB0aGUgYmFyZSBtaW5pbXVtIGZvciBub3cuXG5cbi8qKiBBbiBpbnRlcmZhY2UgcmVwcmVzZW50aW5nIG51bWVyaWMgc3RhdGlzdGljcyBvZiBhIGNvbHVtbi4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTnVtZXJpY0NvbHVtblN0YXRpc3RpY3Mge1xuICBtaW46IG51bWJlcjtcbiAgbWF4OiBudW1iZXI7XG4gIG1lYW46IG51bWJlcjtcbiAgdmFyaWFuY2U6IG51bWJlcjtcbiAgc3RkZGV2OiBudW1iZXI7XG4gIGxlbmd0aDogbnVtYmVyO1xufVxuXG4vKipcbiAqIEFuIGludGVyZmFjZSByZXByZXNlbnRpbmcgY29sdW1uIGxldmVsIE51bWVyaWNDb2x1bW5TdGF0aXN0aWNzIGZvciBhXG4gKiBEYXRhc2V0LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIERhdGFzZXRTdGF0aXN0aWNzIHtcbiAgW2tleTogc3RyaW5nXTogTnVtZXJpY0NvbHVtblN0YXRpc3RpY3M7XG59XG5cbi8qKlxuICogUHJvdmlkZXMgYSBmdW5jdGlvbiB0aGF0IHNjYWxlcyBudW1lcmljIHZhbHVlcyBpbnRvIHRoZSBbMCwgMV0gaW50ZXJ2YWwuXG4gKlxuICogQHBhcmFtIG1pbiB0aGUgbG93ZXIgYm91bmQgb2YgdGhlIGlucHV0cywgd2hpY2ggc2hvdWxkIGJlIG1hcHBlZCB0byAwLlxuICogQHBhcmFtIG1heCB0aGUgdXBwZXIgYm91bmQgb2YgdGhlIGlucHV0cywgd2hpY2ggc2hvdWxkIGJlIG1hcHBlZCB0byAxLFxuICogQHJldHVybiBBIGZ1bmN0aW9uIHRoYXQgbWFwcyBhbiBpbnB1dCBFbGVtZW50QXJyYXkgdG8gYSBzY2FsZWQgRWxlbWVudEFycmF5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2NhbGVUbzAxKG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6ICh2YWx1ZTogRWxlbWVudEFycmF5KSA9PlxuICAgIEVsZW1lbnRBcnJheSB7XG4gIGNvbnN0IHJhbmdlID0gbWF4IC0gbWluO1xuICBjb25zdCBtaW5UZW5zb3I6IHRmLlRlbnNvciA9IHRmLnNjYWxhcihtaW4pO1xuICBjb25zdCByYW5nZVRlbnNvcjogdGYuVGVuc29yID0gdGYuc2NhbGFyKHJhbmdlKTtcbiAgcmV0dXJuICh2YWx1ZTogRWxlbWVudEFycmF5KTogRWxlbWVudEFycmF5ID0+IHtcbiAgICBpZiAodHlwZW9mICh2YWx1ZSkgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhblxcJ3Qgc2NhbGUgYSBzdHJpbmcuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIHRmLlRlbnNvcikge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBkaXYoc3ViKHZhbHVlLCBtaW5UZW5zb3IpLCByYW5nZVRlbnNvcik7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLm1hcCh2ID0+ICh2IC0gbWluKSAvIHJhbmdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAodmFsdWUgLSBtaW4pIC8gcmFuZ2U7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIFByb3ZpZGVzIGEgZnVuY3Rpb24gdGhhdCBjYWxjdWxhdGVzIGNvbHVtbiBsZXZlbCBzdGF0aXN0aWNzLCBpLmUuIG1pbiwgbWF4LFxuICogdmFyaWFuY2UsIHN0ZGRldi5cbiAqXG4gKiBAcGFyYW0gZGF0YXNldCBUaGUgRGF0YXNldCBvYmplY3Qgd2hvc2Ugc3RhdGlzdGljcyB3aWxsIGJlIGNhbGN1bGF0ZWQuXG4gKiBAcGFyYW0gc2FtcGxlU2l6ZSAoT3B0aW9uYWwpIElmIHNldCwgc3RhdGlzdGljcyB3aWxsIG9ubHkgYmUgY2FsY3VsYXRlZFxuICogICAgIGFnYWluc3QgYSBzdWJzZXQgb2YgdGhlIHdob2xlIGRhdGEuXG4gKiBAcGFyYW0gc2h1ZmZsZVdpbmRvd1NpemUgKE9wdGlvbmFsKSBJZiBzZXQsIHNodWZmbGUgcHJvdmlkZWQgZGF0YXNldCBiZWZvcmVcbiAqICAgICBjYWxjdWxhdGluZyBzdGF0aXN0aWNzLlxuICogQHJldHVybiBBIERhdGFzZXRTdGF0aXN0aWNzIG9iamVjdCB0aGF0IGNvbnRhaW5zIE51bWVyaWNDb2x1bW5TdGF0aXN0aWNzIG9mXG4gKiAgICAgZWFjaCBjb2x1bW4uXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21wdXRlRGF0YXNldFN0YXRpc3RpY3MoXG4gICAgZGF0YXNldDogRGF0YXNldDxUYWJ1bGFyUmVjb3JkPiwgc2FtcGxlU2l6ZT86IG51bWJlcixcbiAgICBzaHVmZmxlV2luZG93U2l6ZT86IG51bWJlcik6IFByb21pc2U8RGF0YXNldFN0YXRpc3RpY3M+IHtcbiAgbGV0IHNhbXBsZURhdGFzZXQgPSBkYXRhc2V0O1xuICAvLyBUT0RPKHNvZXJnZWwpOiBhbGxvdyBmb3IgZGVlcCBzaHVmZmxlIHdoZXJlIHBvc3NpYmxlLlxuICBpZiAoc2h1ZmZsZVdpbmRvd1NpemUgIT0gbnVsbCkge1xuICAgIHNhbXBsZURhdGFzZXQgPSBzYW1wbGVEYXRhc2V0LnNodWZmbGUoc2h1ZmZsZVdpbmRvd1NpemUpO1xuICB9XG4gIGlmIChzYW1wbGVTaXplICE9IG51bGwpIHtcbiAgICBzYW1wbGVEYXRhc2V0ID0gc2FtcGxlRGF0YXNldC50YWtlKHNhbXBsZVNpemUpO1xuICB9XG5cbiAgLy8gVE9ETyhzb2VyZ2VsKTogcHJlcGFyZSB0aGUgY29sdW1uIG9iamVjdHMgYmFzZWQgb24gYSBzY2hlbWEuXG4gIGNvbnN0IHJlc3VsdDogRGF0YXNldFN0YXRpc3RpY3MgPSB7fTtcblxuICBhd2FpdCBzYW1wbGVEYXRhc2V0LmZvckVhY2hBc3luYyhlID0+IHtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhlKSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBlW2tleV07XG4gICAgICBpZiAodHlwZW9mICh2YWx1ZSkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIE5vIHN0YXRpc3RpY3MgZm9yIHN0cmluZyBlbGVtZW50LlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHByZXZpb3VzTWVhbiA9IDA7XG4gICAgICAgIGxldCBwcmV2aW91c0xlbmd0aCA9IDA7XG4gICAgICAgIGxldCBwcmV2aW91c1ZhcmlhbmNlID0gMDtcbiAgICAgICAgbGV0IGNvbHVtblN0YXRzOiBOdW1lcmljQ29sdW1uU3RhdGlzdGljcyA9IHJlc3VsdFtrZXldO1xuICAgICAgICBpZiAoY29sdW1uU3RhdHMgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbHVtblN0YXRzID0ge1xuICAgICAgICAgICAgbWluOiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXG4gICAgICAgICAgICBtYXg6IE51bWJlci5ORUdBVElWRV9JTkZJTklUWSxcbiAgICAgICAgICAgIG1lYW46IDAsXG4gICAgICAgICAgICB2YXJpYW5jZTogMCxcbiAgICAgICAgICAgIHN0ZGRldjogMCxcbiAgICAgICAgICAgIGxlbmd0aDogMFxuICAgICAgICAgIH07XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSBjb2x1bW5TdGF0cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcmV2aW91c01lYW4gPSBjb2x1bW5TdGF0cy5tZWFuO1xuICAgICAgICAgIHByZXZpb3VzTGVuZ3RoID0gY29sdW1uU3RhdHMubGVuZ3RoO1xuICAgICAgICAgIHByZXZpb3VzVmFyaWFuY2UgPSBjb2x1bW5TdGF0cy52YXJpYW5jZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmVjb3JkTWluOiBudW1iZXI7XG4gICAgICAgIGxldCByZWNvcmRNYXg6IG51bWJlcjtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgYWNjdW11bGF0ZWQgbWVhbiBhbmQgdmFyaWFuY2UgZm9sbG93aW5nIHRmLlRyYW5zZm9ybVxuICAgICAgICAvLyBpbXBsZW1lbnRhdGlvblxuICAgICAgICBsZXQgdmFsdWVMZW5ndGggPSAwO1xuICAgICAgICBsZXQgdmFsdWVNZWFuID0gMDtcbiAgICAgICAgbGV0IHZhbHVlVmFyaWFuY2UgPSAwO1xuICAgICAgICBsZXQgY29tYmluZWRMZW5ndGggPSAwO1xuICAgICAgICBsZXQgY29tYmluZWRNZWFuID0gMDtcbiAgICAgICAgbGV0IGNvbWJpbmVkVmFyaWFuY2UgPSAwO1xuXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIHRmLlRlbnNvcikge1xuICAgICAgICAgIHJlY29yZE1pbiA9IG1pbih2YWx1ZSkuZGF0YVN5bmMoKVswXTtcbiAgICAgICAgICByZWNvcmRNYXggPSBtYXgodmFsdWUpLmRhdGFTeW5jKClbMF07XG4gICAgICAgICAgY29uc3QgdmFsdWVNb21lbnQgPSB0Zi5tb21lbnRzKHZhbHVlKTtcbiAgICAgICAgICB2YWx1ZU1lYW4gPSB2YWx1ZU1vbWVudC5tZWFuLmRhdGFTeW5jKClbMF07XG4gICAgICAgICAgdmFsdWVWYXJpYW5jZSA9IHZhbHVlTW9tZW50LnZhcmlhbmNlLmRhdGFTeW5jKClbMF07XG4gICAgICAgICAgdmFsdWVMZW5ndGggPSB2YWx1ZS5zaXplO1xuXG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgIHJlY29yZE1pbiA9IHZhbHVlLnJlZHVjZSgoYSwgYikgPT4gTWF0aC5taW4oYSwgYikpO1xuICAgICAgICAgIHJlY29yZE1heCA9IHZhbHVlLnJlZHVjZSgoYSwgYikgPT4gTWF0aC5tYXgoYSwgYikpO1xuICAgICAgICAgIGNvbnN0IHZhbHVlTW9tZW50ID0gdGYubW9tZW50cyh2YWx1ZSk7XG4gICAgICAgICAgdmFsdWVNZWFuID0gdmFsdWVNb21lbnQubWVhbi5kYXRhU3luYygpWzBdO1xuICAgICAgICAgIHZhbHVlVmFyaWFuY2UgPSB2YWx1ZU1vbWVudC52YXJpYW5jZS5kYXRhU3luYygpWzBdO1xuICAgICAgICAgIHZhbHVlTGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoIWlzTmFOKHZhbHVlKSAmJiBpc0Zpbml0ZSh2YWx1ZSkpIHtcbiAgICAgICAgICByZWNvcmRNaW4gPSB2YWx1ZTtcbiAgICAgICAgICByZWNvcmRNYXggPSB2YWx1ZTtcbiAgICAgICAgICB2YWx1ZU1lYW4gPSB2YWx1ZTtcbiAgICAgICAgICB2YWx1ZVZhcmlhbmNlID0gMDtcbiAgICAgICAgICB2YWx1ZUxlbmd0aCA9IDE7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb2x1bW5TdGF0cyA9IG51bGw7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29tYmluZWRMZW5ndGggPSBwcmV2aW91c0xlbmd0aCArIHZhbHVlTGVuZ3RoO1xuICAgICAgICBjb21iaW5lZE1lYW4gPSBwcmV2aW91c01lYW4gK1xuICAgICAgICAgICAgKHZhbHVlTGVuZ3RoIC8gY29tYmluZWRMZW5ndGgpICogKHZhbHVlTWVhbiAtIHByZXZpb3VzTWVhbik7XG4gICAgICAgIGNvbWJpbmVkVmFyaWFuY2UgPSBwcmV2aW91c1ZhcmlhbmNlICtcbiAgICAgICAgICAgICh2YWx1ZUxlbmd0aCAvIGNvbWJpbmVkTGVuZ3RoKSAqXG4gICAgICAgICAgICAgICAgKHZhbHVlVmFyaWFuY2UgK1xuICAgICAgICAgICAgICAgICAoKHZhbHVlTWVhbiAtIGNvbWJpbmVkTWVhbikgKiAodmFsdWVNZWFuIC0gcHJldmlvdXNNZWFuKSkgLVxuICAgICAgICAgICAgICAgICBwcmV2aW91c1ZhcmlhbmNlKTtcblxuICAgICAgICBjb2x1bW5TdGF0cy5taW4gPSBNYXRoLm1pbihjb2x1bW5TdGF0cy5taW4sIHJlY29yZE1pbik7XG4gICAgICAgIGNvbHVtblN0YXRzLm1heCA9IE1hdGgubWF4KGNvbHVtblN0YXRzLm1heCwgcmVjb3JkTWF4KTtcbiAgICAgICAgY29sdW1uU3RhdHMubGVuZ3RoID0gY29tYmluZWRMZW5ndGg7XG4gICAgICAgIGNvbHVtblN0YXRzLm1lYW4gPSBjb21iaW5lZE1lYW47XG4gICAgICAgIGNvbHVtblN0YXRzLnZhcmlhbmNlID0gY29tYmluZWRWYXJpYW5jZTtcbiAgICAgICAgY29sdW1uU3RhdHMuc3RkZGV2ID0gTWF0aC5zcXJ0KGNvbWJpbmVkVmFyaWFuY2UpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIC8vIFZhcmlhbmNlIGFuZCBzdGRkZXYgc2hvdWxkIGJlIE5hTiBmb3IgdGhlIGNhc2Ugb2YgYSBzaW5nbGUgZWxlbWVudC5cbiAgZm9yIChjb25zdCBrZXkgaW4gcmVzdWx0KSB7XG4gICAgY29uc3Qgc3RhdDogTnVtZXJpY0NvbHVtblN0YXRpc3RpY3MgPSByZXN1bHRba2V5XTtcbiAgICBpZiAoc3RhdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIHN0YXQudmFyaWFuY2UgPSBOYU47XG4gICAgICBzdGF0LnN0ZGRldiA9IE5hTjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiJdfQ==