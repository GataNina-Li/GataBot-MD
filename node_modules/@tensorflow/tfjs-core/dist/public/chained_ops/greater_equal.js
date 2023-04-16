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
import { greaterEqual } from '../../ops/greater_equal';
import { getGlobalTensorClass } from '../../tensor';
getGlobalTensorClass().prototype.greaterEqual = function (b) {
    this.throwIfDisposed();
    return greaterEqual(this, b);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JlYXRlcl9lcXVhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvcHVibGljL2NoYWluZWRfb3BzL2dyZWF0ZXJfZXF1YWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxvQkFBb0IsRUFBUyxNQUFNLGNBQWMsQ0FBQztBQVMxRCxvQkFBb0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsVUFDNUMsQ0FBb0I7SUFDdEIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3ZCLE9BQU8sWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQge2dyZWF0ZXJFcXVhbH0gZnJvbSAnLi4vLi4vb3BzL2dyZWF0ZXJfZXF1YWwnO1xuaW1wb3J0IHtnZXRHbG9iYWxUZW5zb3JDbGFzcywgVGVuc29yfSBmcm9tICcuLi8uLi90ZW5zb3InO1xuaW1wb3J0IHtSYW5rLCBUZW5zb3JMaWtlfSBmcm9tICcuLi8uLi90eXBlcyc7XG5cbmRlY2xhcmUgbW9kdWxlICcuLi8uLi90ZW5zb3InIHtcbiAgaW50ZXJmYWNlIFRlbnNvcjxSIGV4dGVuZHMgUmFuayA9IFJhbms+IHtcbiAgICBncmVhdGVyRXF1YWw8VCBleHRlbmRzIFRlbnNvcj4oYjogVGVuc29yfFRlbnNvckxpa2UpOiBUO1xuICB9XG59XG5cbmdldEdsb2JhbFRlbnNvckNsYXNzKCkucHJvdG90eXBlLmdyZWF0ZXJFcXVhbCA9IGZ1bmN0aW9uPFQgZXh0ZW5kcyBUZW5zb3I+KFxuICAgIGI6IFRlbnNvcnxUZW5zb3JMaWtlKTogVCB7XG4gIHRoaXMudGhyb3dJZkRpc3Bvc2VkKCk7XG4gIHJldHVybiBncmVhdGVyRXF1YWwodGhpcywgYik7XG59O1xuIl19