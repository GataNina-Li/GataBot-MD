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
/**
 * Represents a data source readable as a stream of binary data chunks.
 *
 * Because `Dataset`s can be read repeatedly (via `Dataset.iterator()`), this
 * provides a means to repeatedly create streams from the underlying data
 * sources.
 */
export class DataSource {
}
// TODO(soergel): consider convenience factory functions here
// in combination with chainable source->dataset above, e.g.:
// tf.data.url(...).asCsvDataset().shuffle().batch()
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtZGF0YS9zcmMvZGF0YXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUlIOzs7Ozs7R0FNRztBQUNILE1BQU0sT0FBZ0IsVUFBVTtDQVUvQjtBQUVELDZEQUE2RDtBQUM3RCw2REFBNkQ7QUFDN0Qsb0RBQW9EIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtCeXRlQ2h1bmtJdGVyYXRvcn0gZnJvbSAnLi9pdGVyYXRvcnMvYnl0ZV9jaHVua19pdGVyYXRvcic7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIGRhdGEgc291cmNlIHJlYWRhYmxlIGFzIGEgc3RyZWFtIG9mIGJpbmFyeSBkYXRhIGNodW5rcy5cbiAqXG4gKiBCZWNhdXNlIGBEYXRhc2V0YHMgY2FuIGJlIHJlYWQgcmVwZWF0ZWRseSAodmlhIGBEYXRhc2V0Lml0ZXJhdG9yKClgKSwgdGhpc1xuICogcHJvdmlkZXMgYSBtZWFucyB0byByZXBlYXRlZGx5IGNyZWF0ZSBzdHJlYW1zIGZyb20gdGhlIHVuZGVybHlpbmcgZGF0YVxuICogc291cmNlcy5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIERhdGFTb3VyY2Uge1xuICAvKipcbiAgICogT2J0YWluIGEgbmV3IHN0cmVhbSBvZiBiaW5hcnkgZGF0YSBjaHVua3MuXG4gICAqXG4gICAqIFN0YXJ0cyB0aGUgbmV3IHN0cmVhbSBmcm9tIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGRhdGEgc291cmNlLCBldmVuIGlmIG90aGVyXG4gICAqIHN0cmVhbXMgaGF2ZSBiZWVuIG9idGFpbmVkIHByZXZpb3VzbHkuXG4gICAqL1xuICBhYnN0cmFjdCBhc3luYyBpdGVyYXRvcigpOiBQcm9taXNlPEJ5dGVDaHVua0l0ZXJhdG9yPjtcblxuICAvLyBUT0RPKHNvZXJnZWwpOiBjb25zaWRlciBjaGFpbmFibGUgRGF0YXNldCBjb25zdHJ1Y3Rpb24gaGVyZVxufVxuXG4vLyBUT0RPKHNvZXJnZWwpOiBjb25zaWRlciBjb252ZW5pZW5jZSBmYWN0b3J5IGZ1bmN0aW9ucyBoZXJlXG4vLyBpbiBjb21iaW5hdGlvbiB3aXRoIGNoYWluYWJsZSBzb3VyY2UtPmRhdGFzZXQgYWJvdmUsIGUuZy46XG4vLyB0Zi5kYXRhLnVybCguLi4pLmFzQ3N2RGF0YXNldCgpLnNodWZmbGUoKS5iYXRjaCgpXG4iXX0=