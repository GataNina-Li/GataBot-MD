/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
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
import { searchSorted } from './search_sorted';
/**
 * Searches for where a value would go in a sorted sequence.
 *
 * This is not a method for checking containment (like javascript in).
 *
 * The typical use case for this operation is "binning", "bucketing", or
 * "discretizing". The values are assigned to bucket-indices based on the edges
 * listed in 'sortedSequence'. This operation returns the bucket-index for each
 * value.
 *
 * The index returned corresponds to the first edge greater than the value.
 *
 * The axis is not settable for this operation. It always operates on the
 * innermost dimension (axis=-1). The operation will accept any number of outer
 * dimensions.
 *
 * Note: This operation assumes that 'upperBound' is sorted along the
 * innermost axis, maybe using 'sort(..., axis=-1)'. If the sequence is not
 * sorted no error is raised and the content of the returned tensor is not well
 * defined.
 *
 * ```js
 * const seq = tf.tensor1d([0, 3, 9, 10, 10]);
 * const values = tf.tensor1d([0, 4, 10]);
 * const result = tf.upperBound(seq, values);
 * result.print(); // [1, 2, 5]
 * ```
 * @param sortedSequence: N-D. Sorted sequence.
 * @param values: N-D. Search values.
 * @return An N-D int32 tensor the size of values containing the result of
 *     applying upper bound to each value. The result is not a global index to
 *     the entire Tensor, but the index in the last dimension.
 * @doc {heading: 'Operations', subheading: 'Evaluation'}
 */
export function upperBound(sortedSequence, values) {
    return searchSorted(sortedSequence, values, 'right');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBwZXJfYm91bmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy91cHBlcl9ib3VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFJSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFN0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWlDRztBQUNILE1BQU0sVUFBVSxVQUFVLENBQ3RCLGNBQWlDLEVBQUUsTUFBeUI7SUFDOUQsT0FBTyxZQUFZLENBQUMsY0FBYyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN2RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjIgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtzZWFyY2hTb3J0ZWR9IGZyb20gJy4vc2VhcmNoX3NvcnRlZCc7XG5cbi8qKlxuICogU2VhcmNoZXMgZm9yIHdoZXJlIGEgdmFsdWUgd291bGQgZ28gaW4gYSBzb3J0ZWQgc2VxdWVuY2UuXG4gKlxuICogVGhpcyBpcyBub3QgYSBtZXRob2QgZm9yIGNoZWNraW5nIGNvbnRhaW5tZW50IChsaWtlIGphdmFzY3JpcHQgaW4pLlxuICpcbiAqIFRoZSB0eXBpY2FsIHVzZSBjYXNlIGZvciB0aGlzIG9wZXJhdGlvbiBpcyBcImJpbm5pbmdcIiwgXCJidWNrZXRpbmdcIiwgb3JcbiAqIFwiZGlzY3JldGl6aW5nXCIuIFRoZSB2YWx1ZXMgYXJlIGFzc2lnbmVkIHRvIGJ1Y2tldC1pbmRpY2VzIGJhc2VkIG9uIHRoZSBlZGdlc1xuICogbGlzdGVkIGluICdzb3J0ZWRTZXF1ZW5jZScuIFRoaXMgb3BlcmF0aW9uIHJldHVybnMgdGhlIGJ1Y2tldC1pbmRleCBmb3IgZWFjaFxuICogdmFsdWUuXG4gKlxuICogVGhlIGluZGV4IHJldHVybmVkIGNvcnJlc3BvbmRzIHRvIHRoZSBmaXJzdCBlZGdlIGdyZWF0ZXIgdGhhbiB0aGUgdmFsdWUuXG4gKlxuICogVGhlIGF4aXMgaXMgbm90IHNldHRhYmxlIGZvciB0aGlzIG9wZXJhdGlvbi4gSXQgYWx3YXlzIG9wZXJhdGVzIG9uIHRoZVxuICogaW5uZXJtb3N0IGRpbWVuc2lvbiAoYXhpcz0tMSkuIFRoZSBvcGVyYXRpb24gd2lsbCBhY2NlcHQgYW55IG51bWJlciBvZiBvdXRlclxuICogZGltZW5zaW9ucy5cbiAqXG4gKiBOb3RlOiBUaGlzIG9wZXJhdGlvbiBhc3N1bWVzIHRoYXQgJ3VwcGVyQm91bmQnIGlzIHNvcnRlZCBhbG9uZyB0aGVcbiAqIGlubmVybW9zdCBheGlzLCBtYXliZSB1c2luZyAnc29ydCguLi4sIGF4aXM9LTEpJy4gSWYgdGhlIHNlcXVlbmNlIGlzIG5vdFxuICogc29ydGVkIG5vIGVycm9yIGlzIHJhaXNlZCBhbmQgdGhlIGNvbnRlbnQgb2YgdGhlIHJldHVybmVkIHRlbnNvciBpcyBub3Qgd2VsbFxuICogZGVmaW5lZC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3Qgc2VxID0gdGYudGVuc29yMWQoWzAsIDMsIDksIDEwLCAxMF0pO1xuICogY29uc3QgdmFsdWVzID0gdGYudGVuc29yMWQoWzAsIDQsIDEwXSk7XG4gKiBjb25zdCByZXN1bHQgPSB0Zi51cHBlckJvdW5kKHNlcSwgdmFsdWVzKTtcbiAqIHJlc3VsdC5wcmludCgpOyAvLyBbMSwgMiwgNV1cbiAqIGBgYFxuICogQHBhcmFtIHNvcnRlZFNlcXVlbmNlOiBOLUQuIFNvcnRlZCBzZXF1ZW5jZS5cbiAqIEBwYXJhbSB2YWx1ZXM6IE4tRC4gU2VhcmNoIHZhbHVlcy5cbiAqIEByZXR1cm4gQW4gTi1EIGludDMyIHRlbnNvciB0aGUgc2l6ZSBvZiB2YWx1ZXMgY29udGFpbmluZyB0aGUgcmVzdWx0IG9mXG4gKiAgICAgYXBwbHlpbmcgdXBwZXIgYm91bmQgdG8gZWFjaCB2YWx1ZS4gVGhlIHJlc3VsdCBpcyBub3QgYSBnbG9iYWwgaW5kZXggdG9cbiAqICAgICB0aGUgZW50aXJlIFRlbnNvciwgYnV0IHRoZSBpbmRleCBpbiB0aGUgbGFzdCBkaW1lbnNpb24uXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdFdmFsdWF0aW9uJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwcGVyQm91bmQoXG4gICAgc29ydGVkU2VxdWVuY2U6IFRlbnNvcnxUZW5zb3JMaWtlLCB2YWx1ZXM6IFRlbnNvcnxUZW5zb3JMaWtlKTogVGVuc29yIHtcbiAgcmV0dXJuIHNlYXJjaFNvcnRlZChzb3J0ZWRTZXF1ZW5jZSwgdmFsdWVzLCAncmlnaHQnKTtcbn1cbiJdfQ==