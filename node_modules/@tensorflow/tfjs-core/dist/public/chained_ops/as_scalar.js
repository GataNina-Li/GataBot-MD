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
import { reshape } from '../../ops/reshape';
import { getGlobalTensorClass } from '../../tensor';
import { assert } from '../../util';
/**
 * Converts a size-1 `tf.Tensor` to a `tf.Scalar`.
 * @doc {heading: 'Tensors', subheading: 'Classes'}
 */
getGlobalTensorClass().prototype.asScalar = function () {
    this.throwIfDisposed();
    assert(this.size === 1, () => 'The array must have only 1 element.');
    return reshape(this, []);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNfc2NhbGFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9wdWJsaWMvY2hhaW5lZF9vcHMvYXNfc2NhbGFyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMxQyxPQUFPLEVBQUMsb0JBQW9CLEVBQWlCLE1BQU0sY0FBYyxDQUFDO0FBRWxFLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFRbEM7OztHQUdHO0FBQ0gsb0JBQW9CLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHO0lBRTFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMscUNBQXFDLENBQUMsQ0FBQztJQUNyRSxPQUFPLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDM0IsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge3Jlc2hhcGV9IGZyb20gJy4uLy4uL29wcy9yZXNoYXBlJztcbmltcG9ydCB7Z2V0R2xvYmFsVGVuc29yQ2xhc3MsIFNjYWxhciwgVGVuc29yfSBmcm9tICcuLi8uLi90ZW5zb3InO1xuaW1wb3J0IHtSYW5rfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlY2xhcmUgbW9kdWxlICcuLi8uLi90ZW5zb3InIHtcbiAgaW50ZXJmYWNlIFRlbnNvcjxSIGV4dGVuZHMgUmFuayA9IFJhbms+IHtcbiAgICBhc1NjYWxhcjxUIGV4dGVuZHMgVGVuc29yPigpOiBTY2FsYXI7XG4gIH1cbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhIHNpemUtMSBgdGYuVGVuc29yYCB0byBhIGB0Zi5TY2FsYXJgLlxuICogQGRvYyB7aGVhZGluZzogJ1RlbnNvcnMnLCBzdWJoZWFkaW5nOiAnQ2xhc3Nlcyd9XG4gKi9cbmdldEdsb2JhbFRlbnNvckNsYXNzKCkucHJvdG90eXBlLmFzU2NhbGFyID0gZnVuY3Rpb248VCBleHRlbmRzIFRlbnNvcj4odGhpczogVCk6XG4gICAgU2NhbGFyIHtcbiAgdGhpcy50aHJvd0lmRGlzcG9zZWQoKTtcbiAgYXNzZXJ0KHRoaXMuc2l6ZSA9PT0gMSwgKCkgPT4gJ1RoZSBhcnJheSBtdXN0IGhhdmUgb25seSAxIGVsZW1lbnQuJyk7XG4gIHJldHVybiByZXNoYXBlKHRoaXMsIFtdKTtcbn07XG4iXX0=