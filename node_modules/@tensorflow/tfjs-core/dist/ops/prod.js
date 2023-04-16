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
import { Prod } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { cast } from './cast';
import { op } from './operation';
/**
 * Computes the product of elements across dimensions of a `tf.Tensor`.
 *
 * Reduces the input along the dimensions given in `axes`. Unless `keepDims`
 * is true, the rank of the `tf.Tensor` is reduced by 1 for each entry in
 * `axes`. If `keepDims` is true, the reduced dimensions are retained with
 * length 1. If `axes` has no entries, all dimensions are reduced, and a
 * `tf.Tensor` with a single element is returned.
 *
 * ```js
 * const x = tf.tensor1d([1, 2, 3]);
 *
 * x.prod().print();  // or tf.prod(x)
 * ```
 *
 * ```js
 * const x = tf.tensor2d([1, 2, 3, 4], [2, 2]);
 *
 * const axis = 1;
 * x.prod(axis).print();  // or tf.prod(x, axis)
 * ```
 *
 * @param x The input tensor to compute the product over. If the dtype is `bool`
 *   it will be converted to `int32` and the output dtype will be `int32`.
 * @param axis The dimension(s) to reduce. By default it reduces
 *     all dimensions.
 * @param keepDims If true, retains reduced dimensions with size 1.
 *
 * @doc {heading: 'Operations', subheading: 'Reduction'}
 */
function prod_(x, axis = null, keepDims = false) {
    let $x = convertToTensor(x, 'x', 'prod');
    if ($x.dtype === 'bool') {
        // bool is not an allowed type for the underlying kernel.
        $x = cast($x, 'int32');
    }
    const inputs = { x: $x };
    const attrs = { axis, keepDims };
    return ENGINE.runKernel(Prod, inputs, attrs);
}
export const prod = op({ prod_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3Byb2QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsSUFBSSxFQUF3QixNQUFNLGlCQUFpQixDQUFDO0FBSTVELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUduRCxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFL0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNkJHO0FBQ0gsU0FBUyxLQUFLLENBQ1YsQ0FBb0IsRUFBRSxPQUF3QixJQUFJLEVBQUUsUUFBUSxHQUFHLEtBQUs7SUFDdEUsSUFBSSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFFekMsSUFBSSxFQUFFLENBQUMsS0FBSyxLQUFLLE1BQU0sRUFBRTtRQUN2Qix5REFBeUQ7UUFDekQsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDeEI7SUFFRCxNQUFNLE1BQU0sR0FBZSxFQUFDLENBQUMsRUFBRSxFQUFFLEVBQUMsQ0FBQztJQUNuQyxNQUFNLEtBQUssR0FBYyxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUMsQ0FBQztJQUUxQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQ25CLElBQUksRUFBRSxNQUE4QixFQUFFLEtBQTJCLENBQUMsQ0FBQztBQUN6RSxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxFQUFDLEtBQUssRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtQcm9kLCBQcm9kQXR0cnMsIFByb2RJbnB1dHN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge05hbWVkQXR0ck1hcH0gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7Y2FzdH0gZnJvbSAnLi9jYXN0JztcbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgcHJvZHVjdCBvZiBlbGVtZW50cyBhY3Jvc3MgZGltZW5zaW9ucyBvZiBhIGB0Zi5UZW5zb3JgLlxuICpcbiAqIFJlZHVjZXMgdGhlIGlucHV0IGFsb25nIHRoZSBkaW1lbnNpb25zIGdpdmVuIGluIGBheGVzYC4gVW5sZXNzIGBrZWVwRGltc2BcbiAqIGlzIHRydWUsIHRoZSByYW5rIG9mIHRoZSBgdGYuVGVuc29yYCBpcyByZWR1Y2VkIGJ5IDEgZm9yIGVhY2ggZW50cnkgaW5cbiAqIGBheGVzYC4gSWYgYGtlZXBEaW1zYCBpcyB0cnVlLCB0aGUgcmVkdWNlZCBkaW1lbnNpb25zIGFyZSByZXRhaW5lZCB3aXRoXG4gKiBsZW5ndGggMS4gSWYgYGF4ZXNgIGhhcyBubyBlbnRyaWVzLCBhbGwgZGltZW5zaW9ucyBhcmUgcmVkdWNlZCwgYW5kIGFcbiAqIGB0Zi5UZW5zb3JgIHdpdGggYSBzaW5nbGUgZWxlbWVudCBpcyByZXR1cm5lZC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgeCA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzXSk7XG4gKlxuICogeC5wcm9kKCkucHJpbnQoKTsgIC8vIG9yIHRmLnByb2QoeClcbiAqIGBgYFxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCB4ID0gdGYudGVuc29yMmQoWzEsIDIsIDMsIDRdLCBbMiwgMl0pO1xuICpcbiAqIGNvbnN0IGF4aXMgPSAxO1xuICogeC5wcm9kKGF4aXMpLnByaW50KCk7ICAvLyBvciB0Zi5wcm9kKHgsIGF4aXMpXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0geCBUaGUgaW5wdXQgdGVuc29yIHRvIGNvbXB1dGUgdGhlIHByb2R1Y3Qgb3Zlci4gSWYgdGhlIGR0eXBlIGlzIGBib29sYFxuICogICBpdCB3aWxsIGJlIGNvbnZlcnRlZCB0byBgaW50MzJgIGFuZCB0aGUgb3V0cHV0IGR0eXBlIHdpbGwgYmUgYGludDMyYC5cbiAqIEBwYXJhbSBheGlzIFRoZSBkaW1lbnNpb24ocykgdG8gcmVkdWNlLiBCeSBkZWZhdWx0IGl0IHJlZHVjZXNcbiAqICAgICBhbGwgZGltZW5zaW9ucy5cbiAqIEBwYXJhbSBrZWVwRGltcyBJZiB0cnVlLCByZXRhaW5zIHJlZHVjZWQgZGltZW5zaW9ucyB3aXRoIHNpemUgMS5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdSZWR1Y3Rpb24nfVxuICovXG5mdW5jdGlvbiBwcm9kXzxUIGV4dGVuZHMgVGVuc29yPihcbiAgICB4OiBUZW5zb3J8VGVuc29yTGlrZSwgYXhpczogbnVtYmVyfG51bWJlcltdID0gbnVsbCwga2VlcERpbXMgPSBmYWxzZSk6IFQge1xuICBsZXQgJHggPSBjb252ZXJ0VG9UZW5zb3IoeCwgJ3gnLCAncHJvZCcpO1xuXG4gIGlmICgkeC5kdHlwZSA9PT0gJ2Jvb2wnKSB7XG4gICAgLy8gYm9vbCBpcyBub3QgYW4gYWxsb3dlZCB0eXBlIGZvciB0aGUgdW5kZXJseWluZyBrZXJuZWwuXG4gICAgJHggPSBjYXN0KCR4LCAnaW50MzInKTtcbiAgfVxuXG4gIGNvbnN0IGlucHV0czogUHJvZElucHV0cyA9IHt4OiAkeH07XG4gIGNvbnN0IGF0dHJzOiBQcm9kQXR0cnMgPSB7YXhpcywga2VlcERpbXN9O1xuXG4gIHJldHVybiBFTkdJTkUucnVuS2VybmVsKFxuICAgICAgUHJvZCwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLCBhdHRycyBhcyB7fSBhcyBOYW1lZEF0dHJNYXApO1xufVxuXG5leHBvcnQgY29uc3QgcHJvZCA9IG9wKHtwcm9kX30pO1xuIl19