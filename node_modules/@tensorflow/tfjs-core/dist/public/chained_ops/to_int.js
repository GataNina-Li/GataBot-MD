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
// TODO update import path once op is modularized.
import { cast } from '../../ops/ops';
import { getGlobalTensorClass } from '../../tensor';
/**
 * Casts the array to type `int32`
 *
 * @doc {heading: 'Tensors', subheading: 'Classes'}
 */
getGlobalTensorClass().prototype.toInt = function () {
    this.throwIfDisposed();
    return cast(this, 'int32');
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9faW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9wdWJsaWMvY2hhaW5lZF9vcHMvdG9faW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILGtEQUFrRDtBQUNsRCxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxvQkFBb0IsRUFBUyxNQUFNLGNBQWMsQ0FBQztBQVMxRDs7OztHQUlHO0FBQ0gsb0JBQW9CLEVBQUUsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHO0lBRXZDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN2QixPQUFPLElBQUksQ0FBSSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDaEMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG4vLyBUT0RPIHVwZGF0ZSBpbXBvcnQgcGF0aCBvbmNlIG9wIGlzIG1vZHVsYXJpemVkLlxuaW1wb3J0IHtjYXN0fSBmcm9tICcuLi8uLi9vcHMvb3BzJztcbmltcG9ydCB7Z2V0R2xvYmFsVGVuc29yQ2xhc3MsIFRlbnNvcn0gZnJvbSAnLi4vLi4vdGVuc29yJztcbmltcG9ydCB7UmFua30gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5kZWNsYXJlIG1vZHVsZSAnLi4vLi4vdGVuc29yJyB7XG4gIGludGVyZmFjZSBUZW5zb3I8UiBleHRlbmRzIFJhbmsgPSBSYW5rPiB7XG4gICAgdG9JbnQ8VCBleHRlbmRzIFRlbnNvcj4odGhpczogVCk6IFQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDYXN0cyB0aGUgYXJyYXkgdG8gdHlwZSBgaW50MzJgXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ1RlbnNvcnMnLCBzdWJoZWFkaW5nOiAnQ2xhc3Nlcyd9XG4gKi9cbmdldEdsb2JhbFRlbnNvckNsYXNzKCkucHJvdG90eXBlLnRvSW50ID0gZnVuY3Rpb248VCBleHRlbmRzIFRlbnNvcj4odGhpczogVCk6XG4gICAgVCB7XG4gIHRoaXMudGhyb3dJZkRpc3Bvc2VkKCk7XG4gIHJldHVybiBjYXN0PFQ+KHRoaXMsICdpbnQzMicpO1xufTtcbiJdfQ==