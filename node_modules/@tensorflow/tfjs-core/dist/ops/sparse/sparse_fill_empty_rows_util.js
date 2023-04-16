/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
 * Generates sparse fill empty rows indices, dense shape mismatch error message.
 *
 * @param indicesLength The first dimension of indices.
 */
export function getSparseFillEmptyRowsIndicesDenseShapeMismatch(indicesLength) {
    return `Received SparseTensor with denseShape[0] = 0 but
  indices.shape[0] = ${indicesLength}`;
}
/**
 * Generates sparse fill empty rows negative index error message.
 *
 * @param index The index with a negative value.
 * @param value The negative value.
 */
export function getSparseFillEmptyRowsNegativeIndexErrorMessage(index, value) {
    return `indices(${index}, 0) is invalid: ${value} < 0`;
}
/**
 * Generates sparse fill empty rows out of range index error message.
 *
 * @param index The index with an out of range value.
 * @param value The out of range value.
 * @param limit The upper limit for indices.
 */
export function getSparseFillEmptyRowsOutOfRangeIndexErrorMessage(index, value, limit) {
    return `indices(${index}, 0) is invalid: ${value} >= ${limit}`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BhcnNlX2ZpbGxfZW1wdHlfcm93c191dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvc3BhcnNlL3NwYXJzZV9maWxsX2VtcHR5X3Jvd3NfdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLCtDQUErQyxDQUMzRCxhQUFxQjtJQUN2QixPQUFPO3VCQUNjLGFBQWEsRUFBRSxDQUFDO0FBQ3ZDLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSwrQ0FBK0MsQ0FDM0QsS0FBYSxFQUFFLEtBQWE7SUFDOUIsT0FBTyxXQUFXLEtBQUssb0JBQW9CLEtBQUssTUFBTSxDQUFDO0FBQ3pELENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLFVBQVUsaURBQWlELENBQzdELEtBQWEsRUFBRSxLQUFhLEVBQUUsS0FBYTtJQUM3QyxPQUFPLFdBQVcsS0FBSyxvQkFBb0IsS0FBSyxPQUFPLEtBQUssRUFBRSxDQUFDO0FBQ2pFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMSBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbi8qKlxuICogR2VuZXJhdGVzIHNwYXJzZSBmaWxsIGVtcHR5IHJvd3MgaW5kaWNlcywgZGVuc2Ugc2hhcGUgbWlzbWF0Y2ggZXJyb3IgbWVzc2FnZS5cbiAqXG4gKiBAcGFyYW0gaW5kaWNlc0xlbmd0aCBUaGUgZmlyc3QgZGltZW5zaW9uIG9mIGluZGljZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTcGFyc2VGaWxsRW1wdHlSb3dzSW5kaWNlc0RlbnNlU2hhcGVNaXNtYXRjaChcbiAgICBpbmRpY2VzTGVuZ3RoOiBudW1iZXIpIHtcbiAgcmV0dXJuIGBSZWNlaXZlZCBTcGFyc2VUZW5zb3Igd2l0aCBkZW5zZVNoYXBlWzBdID0gMCBidXRcbiAgaW5kaWNlcy5zaGFwZVswXSA9ICR7aW5kaWNlc0xlbmd0aH1gO1xufVxuXG4vKipcbiAqIEdlbmVyYXRlcyBzcGFyc2UgZmlsbCBlbXB0eSByb3dzIG5lZ2F0aXZlIGluZGV4IGVycm9yIG1lc3NhZ2UuXG4gKlxuICogQHBhcmFtIGluZGV4IFRoZSBpbmRleCB3aXRoIGEgbmVnYXRpdmUgdmFsdWUuXG4gKiBAcGFyYW0gdmFsdWUgVGhlIG5lZ2F0aXZlIHZhbHVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3BhcnNlRmlsbEVtcHR5Um93c05lZ2F0aXZlSW5kZXhFcnJvck1lc3NhZ2UoXG4gICAgaW5kZXg6IG51bWJlciwgdmFsdWU6IG51bWJlcikge1xuICByZXR1cm4gYGluZGljZXMoJHtpbmRleH0sIDApIGlzIGludmFsaWQ6ICR7dmFsdWV9IDwgMGA7XG59XG5cbi8qKlxuICogR2VuZXJhdGVzIHNwYXJzZSBmaWxsIGVtcHR5IHJvd3Mgb3V0IG9mIHJhbmdlIGluZGV4IGVycm9yIG1lc3NhZ2UuXG4gKlxuICogQHBhcmFtIGluZGV4IFRoZSBpbmRleCB3aXRoIGFuIG91dCBvZiByYW5nZSB2YWx1ZS5cbiAqIEBwYXJhbSB2YWx1ZSBUaGUgb3V0IG9mIHJhbmdlIHZhbHVlLlxuICogQHBhcmFtIGxpbWl0IFRoZSB1cHBlciBsaW1pdCBmb3IgaW5kaWNlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNwYXJzZUZpbGxFbXB0eVJvd3NPdXRPZlJhbmdlSW5kZXhFcnJvck1lc3NhZ2UoXG4gICAgaW5kZXg6IG51bWJlciwgdmFsdWU6IG51bWJlciwgbGltaXQ6IG51bWJlcikge1xuICByZXR1cm4gYGluZGljZXMoJHtpbmRleH0sIDApIGlzIGludmFsaWQ6ICR7dmFsdWV9ID49ICR7bGltaXR9YDtcbn1cbiJdfQ==