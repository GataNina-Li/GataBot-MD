/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
import { TensorBuffer } from '../tensor';
import * as util from '../util';
/**
 * Creates an empty `tf.TensorBuffer` with the specified `shape` and `dtype`.
 *
 * The values are stored in CPU as `TypedArray`. Fill the buffer using
 * `buffer.set()`, or by modifying directly `buffer.values`.
 *
 * When done, call `buffer.toTensor()` to get an immutable `tf.Tensor` with
 * those values.
 *
 * ```js
 * // Create a buffer and set values at particular indices.
 * const buffer = tf.buffer([2, 2]);
 * buffer.set(3, 0, 0);
 * buffer.set(5, 1, 0);
 *
 * // Convert the buffer back to a tensor.
 * buffer.toTensor().print();
 * ```
 *
 * @param shape An array of integers defining the output tensor shape.
 * @param dtype The dtype of the buffer. Defaults to 'float32'.
 * @param values The values of the buffer as `TypedArray`. Defaults to
 * zeros.
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
export function buffer(shape, dtype = 'float32', values) {
    dtype = dtype || 'float32';
    util.assertNonNegativeIntegerDimensions(shape);
    return new TensorBuffer(shape, dtype, values);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVmZmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvYnVmZmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFdkMsT0FBTyxLQUFLLElBQUksTUFBTSxTQUFTLENBQUM7QUFFaEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F5Qkc7QUFDSCxNQUFNLFVBQVUsTUFBTSxDQUNsQixLQUFrQixFQUFFLFFBQVcsU0FBYyxFQUM3QyxNQUF1QjtJQUN6QixLQUFLLEdBQUcsS0FBSyxJQUFJLFNBQWMsQ0FBQztJQUNoQyxJQUFJLENBQUMsa0NBQWtDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0MsT0FBTyxJQUFJLFlBQVksQ0FBTyxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3RELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7VGVuc29yQnVmZmVyfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtEYXRhVHlwZSwgRGF0YVR5cGVNYXAsIFJhbmssIFNoYXBlTWFwfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gZW1wdHkgYHRmLlRlbnNvckJ1ZmZlcmAgd2l0aCB0aGUgc3BlY2lmaWVkIGBzaGFwZWAgYW5kIGBkdHlwZWAuXG4gKlxuICogVGhlIHZhbHVlcyBhcmUgc3RvcmVkIGluIENQVSBhcyBgVHlwZWRBcnJheWAuIEZpbGwgdGhlIGJ1ZmZlciB1c2luZ1xuICogYGJ1ZmZlci5zZXQoKWAsIG9yIGJ5IG1vZGlmeWluZyBkaXJlY3RseSBgYnVmZmVyLnZhbHVlc2AuXG4gKlxuICogV2hlbiBkb25lLCBjYWxsIGBidWZmZXIudG9UZW5zb3IoKWAgdG8gZ2V0IGFuIGltbXV0YWJsZSBgdGYuVGVuc29yYCB3aXRoXG4gKiB0aG9zZSB2YWx1ZXMuXG4gKlxuICogYGBganNcbiAqIC8vIENyZWF0ZSBhIGJ1ZmZlciBhbmQgc2V0IHZhbHVlcyBhdCBwYXJ0aWN1bGFyIGluZGljZXMuXG4gKiBjb25zdCBidWZmZXIgPSB0Zi5idWZmZXIoWzIsIDJdKTtcbiAqIGJ1ZmZlci5zZXQoMywgMCwgMCk7XG4gKiBidWZmZXIuc2V0KDUsIDEsIDApO1xuICpcbiAqIC8vIENvbnZlcnQgdGhlIGJ1ZmZlciBiYWNrIHRvIGEgdGVuc29yLlxuICogYnVmZmVyLnRvVGVuc29yKCkucHJpbnQoKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBzaGFwZSBBbiBhcnJheSBvZiBpbnRlZ2VycyBkZWZpbmluZyB0aGUgb3V0cHV0IHRlbnNvciBzaGFwZS5cbiAqIEBwYXJhbSBkdHlwZSBUaGUgZHR5cGUgb2YgdGhlIGJ1ZmZlci4gRGVmYXVsdHMgdG8gJ2Zsb2F0MzInLlxuICogQHBhcmFtIHZhbHVlcyBUaGUgdmFsdWVzIG9mIHRoZSBidWZmZXIgYXMgYFR5cGVkQXJyYXlgLiBEZWZhdWx0cyB0b1xuICogemVyb3MuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ1RlbnNvcnMnLCBzdWJoZWFkaW5nOiAnQ3JlYXRpb24nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVmZmVyPFIgZXh0ZW5kcyBSYW5rLCBEIGV4dGVuZHMgRGF0YVR5cGUgPSAnZmxvYXQzMic+KFxuICAgIHNoYXBlOiBTaGFwZU1hcFtSXSwgZHR5cGU6IEQgPSAnZmxvYXQzMicgYXMgRCxcbiAgICB2YWx1ZXM/OiBEYXRhVHlwZU1hcFtEXSk6IFRlbnNvckJ1ZmZlcjxSLCBEPiB7XG4gIGR0eXBlID0gZHR5cGUgfHwgJ2Zsb2F0MzInIGFzIEQ7XG4gIHV0aWwuYXNzZXJ0Tm9uTmVnYXRpdmVJbnRlZ2VyRGltZW5zaW9ucyhzaGFwZSk7XG4gIHJldHVybiBuZXcgVGVuc29yQnVmZmVyPFIsIEQ+KHNoYXBlLCBkdHlwZSwgdmFsdWVzKTtcbn1cbiJdfQ==