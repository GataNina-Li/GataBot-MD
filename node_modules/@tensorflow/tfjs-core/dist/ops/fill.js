/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
import { ENGINE } from '../engine';
import { Fill } from '../kernel_names';
/**
 * Creates a `tf.Tensor` filled with a scalar value.
 *
 * ```js
 * tf.fill([2, 2], 4).print();
 * ```
 *
 * @param shape An array of integers defining the output tensor shape.
 * @param value The scalar value to fill the tensor with.
 * @param dtype The type of an element in the resulting tensor. Defaults to
 * 'float'.
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
function fill(shape, value, dtype) {
    const attrs = { shape, value, dtype };
    return ENGINE.runKernel(Fill, {}, attrs);
}
export { fill };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2ZpbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsSUFBSSxFQUFZLE1BQU0saUJBQWlCLENBQUM7QUFLaEQ7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILFNBQVMsSUFBSSxDQUNULEtBQWtCLEVBQUUsS0FBb0IsRUFBRSxLQUFnQjtJQUM1RCxNQUFNLEtBQUssR0FBYyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7SUFFL0MsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBMkIsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFFRCxPQUFPLEVBQUMsSUFBSSxFQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtGaWxsLCBGaWxsQXR0cnN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge05hbWVkQXR0ck1hcH0gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtEYXRhVHlwZSwgUmFuaywgU2hhcGVNYXB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgYHRmLlRlbnNvcmAgZmlsbGVkIHdpdGggYSBzY2FsYXIgdmFsdWUuXG4gKlxuICogYGBganNcbiAqIHRmLmZpbGwoWzIsIDJdLCA0KS5wcmludCgpO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHNoYXBlIEFuIGFycmF5IG9mIGludGVnZXJzIGRlZmluaW5nIHRoZSBvdXRwdXQgdGVuc29yIHNoYXBlLlxuICogQHBhcmFtIHZhbHVlIFRoZSBzY2FsYXIgdmFsdWUgdG8gZmlsbCB0aGUgdGVuc29yIHdpdGguXG4gKiBAcGFyYW0gZHR5cGUgVGhlIHR5cGUgb2YgYW4gZWxlbWVudCBpbiB0aGUgcmVzdWx0aW5nIHRlbnNvci4gRGVmYXVsdHMgdG9cbiAqICdmbG9hdCcuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ1RlbnNvcnMnLCBzdWJoZWFkaW5nOiAnQ3JlYXRpb24nfVxuICovXG5mdW5jdGlvbiBmaWxsPFIgZXh0ZW5kcyBSYW5rPihcbiAgICBzaGFwZTogU2hhcGVNYXBbUl0sIHZhbHVlOiBudW1iZXJ8c3RyaW5nLCBkdHlwZT86IERhdGFUeXBlKTogVGVuc29yPFI+IHtcbiAgY29uc3QgYXR0cnM6IEZpbGxBdHRycyA9IHtzaGFwZSwgdmFsdWUsIGR0eXBlfTtcblxuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChGaWxsLCB7fSwgYXR0cnMgYXMge30gYXMgTmFtZWRBdHRyTWFwKTtcbn1cblxuZXhwb3J0IHtmaWxsfTtcbiJdfQ==