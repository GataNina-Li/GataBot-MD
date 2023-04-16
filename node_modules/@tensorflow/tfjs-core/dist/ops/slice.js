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
import { ENGINE } from '../engine';
import { Slice } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Extracts a slice from a `tf.Tensor` starting at coordinates `begin`
 * and is of size `size`.
 *
 * Also available are stricter rank-specific methods with the same signature
 * as this method that assert that `x` is of the given rank:
 *   - `tf.slice1d`
 *   - `tf.slice2d`
 *   - `tf.slice3d`
 *   - `tf.slice4d`
 *
 * ```js
 * const x = tf.tensor1d([1, 2, 3, 4]);
 *
 * x.slice([1], [2]).print();
 * ```
 *
 * ```js
 * const x = tf.tensor2d([1, 2, 3, 4], [2, 2]);
 *
 * x.slice([1, 0], [1, 2]).print();
 * ```
 * @param x The input `tf.Tensor` to slice from.
 * @param begin The coordinates to start the slice from. The length can be
 *     less than the rank of x - the rest of the axes will have implicit 0 as
 *     start. Can also be a single number, in which case it specifies the
 *     first axis.
 * @param size The size of the slice. The length can be less than the rank of
 *     x - the rest of the axes will have implicit -1. A value of -1 requests
 *     the rest of the dimensions in the axis. Can also be a single number,
 *     in which case it specifies the size of the first axis.
 *
 * @doc {heading: 'Tensors', subheading: 'Slicing and Joining'}
 */
function slice_(x, begin, size) {
    const $x = convertToTensor(x, 'x', 'slice', 'string_or_numeric');
    if ($x.rank === 0) {
        throw new Error('Slicing scalar is not possible');
    }
    const inputs = { x: $x };
    const attrs = { begin, size };
    return ENGINE.runKernel(Slice, inputs, attrs);
}
export const slice = op({ slice_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9zbGljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxLQUFLLEVBQTBCLE1BQU0saUJBQWlCLENBQUM7QUFJL0QsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBR25ELE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFL0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWlDRztBQUNILFNBQVMsTUFBTSxDQUNYLENBQWUsRUFBRSxLQUFzQixFQUFFLElBQXNCO0lBQ2pFLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBRWpFLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7UUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0tBQ25EO0lBRUQsTUFBTSxNQUFNLEdBQWdCLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBQyxDQUFDO0lBQ3BDLE1BQU0sS0FBSyxHQUFlLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDO0lBRXhDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FDbkIsS0FBSyxFQUFFLE1BQThCLEVBQUUsS0FBMkIsQ0FBQyxDQUFDO0FBQzFFLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge1NsaWNlLCBTbGljZUF0dHJzLCBTbGljZUlucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7TmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1JhbmssIFRlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcblxuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuXG4vKipcbiAqIEV4dHJhY3RzIGEgc2xpY2UgZnJvbSBhIGB0Zi5UZW5zb3JgIHN0YXJ0aW5nIGF0IGNvb3JkaW5hdGVzIGBiZWdpbmBcbiAqIGFuZCBpcyBvZiBzaXplIGBzaXplYC5cbiAqXG4gKiBBbHNvIGF2YWlsYWJsZSBhcmUgc3RyaWN0ZXIgcmFuay1zcGVjaWZpYyBtZXRob2RzIHdpdGggdGhlIHNhbWUgc2lnbmF0dXJlXG4gKiBhcyB0aGlzIG1ldGhvZCB0aGF0IGFzc2VydCB0aGF0IGB4YCBpcyBvZiB0aGUgZ2l2ZW4gcmFuazpcbiAqICAgLSBgdGYuc2xpY2UxZGBcbiAqICAgLSBgdGYuc2xpY2UyZGBcbiAqICAgLSBgdGYuc2xpY2UzZGBcbiAqICAgLSBgdGYuc2xpY2U0ZGBcbiAqXG4gKiBgYGBqc1xuICogY29uc3QgeCA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzLCA0XSk7XG4gKlxuICogeC5zbGljZShbMV0sIFsyXSkucHJpbnQoKTtcbiAqIGBgYFxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCB4ID0gdGYudGVuc29yMmQoWzEsIDIsIDMsIDRdLCBbMiwgMl0pO1xuICpcbiAqIHguc2xpY2UoWzEsIDBdLCBbMSwgMl0pLnByaW50KCk7XG4gKiBgYGBcbiAqIEBwYXJhbSB4IFRoZSBpbnB1dCBgdGYuVGVuc29yYCB0byBzbGljZSBmcm9tLlxuICogQHBhcmFtIGJlZ2luIFRoZSBjb29yZGluYXRlcyB0byBzdGFydCB0aGUgc2xpY2UgZnJvbS4gVGhlIGxlbmd0aCBjYW4gYmVcbiAqICAgICBsZXNzIHRoYW4gdGhlIHJhbmsgb2YgeCAtIHRoZSByZXN0IG9mIHRoZSBheGVzIHdpbGwgaGF2ZSBpbXBsaWNpdCAwIGFzXG4gKiAgICAgc3RhcnQuIENhbiBhbHNvIGJlIGEgc2luZ2xlIG51bWJlciwgaW4gd2hpY2ggY2FzZSBpdCBzcGVjaWZpZXMgdGhlXG4gKiAgICAgZmlyc3QgYXhpcy5cbiAqIEBwYXJhbSBzaXplIFRoZSBzaXplIG9mIHRoZSBzbGljZS4gVGhlIGxlbmd0aCBjYW4gYmUgbGVzcyB0aGFuIHRoZSByYW5rIG9mXG4gKiAgICAgeCAtIHRoZSByZXN0IG9mIHRoZSBheGVzIHdpbGwgaGF2ZSBpbXBsaWNpdCAtMS4gQSB2YWx1ZSBvZiAtMSByZXF1ZXN0c1xuICogICAgIHRoZSByZXN0IG9mIHRoZSBkaW1lbnNpb25zIGluIHRoZSBheGlzLiBDYW4gYWxzbyBiZSBhIHNpbmdsZSBudW1iZXIsXG4gKiAgICAgaW4gd2hpY2ggY2FzZSBpdCBzcGVjaWZpZXMgdGhlIHNpemUgb2YgdGhlIGZpcnN0IGF4aXMuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ1RlbnNvcnMnLCBzdWJoZWFkaW5nOiAnU2xpY2luZyBhbmQgSm9pbmluZyd9XG4gKi9cbmZ1bmN0aW9uIHNsaWNlXzxSIGV4dGVuZHMgUmFuaywgVCBleHRlbmRzIFRlbnNvcjxSPj4oXG4gICAgeDogVHxUZW5zb3JMaWtlLCBiZWdpbjogbnVtYmVyfG51bWJlcltdLCBzaXplPzogbnVtYmVyfG51bWJlcltdKTogVCB7XG4gIGNvbnN0ICR4ID0gY29udmVydFRvVGVuc29yKHgsICd4JywgJ3NsaWNlJywgJ3N0cmluZ19vcl9udW1lcmljJyk7XG5cbiAgaWYgKCR4LnJhbmsgPT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NsaWNpbmcgc2NhbGFyIGlzIG5vdCBwb3NzaWJsZScpO1xuICB9XG5cbiAgY29uc3QgaW5wdXRzOiBTbGljZUlucHV0cyA9IHt4OiAkeH07XG4gIGNvbnN0IGF0dHJzOiBTbGljZUF0dHJzID0ge2JlZ2luLCBzaXplfTtcblxuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChcbiAgICAgIFNsaWNlLCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXAsIGF0dHJzIGFzIHt9IGFzIE5hbWVkQXR0ck1hcCk7XG59XG5cbmV4cG9ydCBjb25zdCBzbGljZSA9IG9wKHtzbGljZV99KTtcbiJdfQ==