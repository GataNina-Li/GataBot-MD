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
import { topk } from '../../ops/topk';
import { getGlobalTensorClass } from '../../tensor';
getGlobalTensorClass().prototype.topk = function (k, sorted) {
    this.throwIfDisposed();
    return topk(this, k, sorted);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9way5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvcHVibGljL2NoYWluZWRfb3BzL3RvcGsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3BDLE9BQU8sRUFBQyxvQkFBb0IsRUFBUyxNQUFNLGNBQWMsQ0FBQztBQVUxRCxvQkFBb0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsVUFDM0IsQ0FBVSxFQUFFLE1BQWdCO0lBQ3ZDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN2QixPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBNEIsQ0FBQztBQUMxRCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7dG9wa30gZnJvbSAnLi4vLi4vb3BzL3RvcGsnO1xuaW1wb3J0IHtnZXRHbG9iYWxUZW5zb3JDbGFzcywgVGVuc29yfSBmcm9tICcuLi8uLi90ZW5zb3InO1xuaW1wb3J0IHtSYW5rfSBmcm9tICcuLi8uLi90eXBlcyc7XG5cbmRlY2xhcmUgbW9kdWxlICcuLi8uLi90ZW5zb3InIHtcbiAgaW50ZXJmYWNlIFRlbnNvcjxSIGV4dGVuZHMgUmFuayA9IFJhbms+IHtcbiAgICB0b3BrPFQgZXh0ZW5kcyBUZW5zb3I+KHRoaXM6IFQsIGs/OiBudW1iZXIsIHNvcnRlZD86IGJvb2xlYW4pOlxuICAgICAgICB7dmFsdWVzOiBULCBpbmRpY2VzOiBUfTtcbiAgfVxufVxuXG5nZXRHbG9iYWxUZW5zb3JDbGFzcygpLnByb3RvdHlwZS50b3BrID0gZnVuY3Rpb248VCBleHRlbmRzIFRlbnNvcj4oXG4gICAgdGhpczogVCwgaz86IG51bWJlciwgc29ydGVkPzogYm9vbGVhbik6IHt2YWx1ZXM6IFQsIGluZGljZXM6IFR9IHtcbiAgdGhpcy50aHJvd0lmRGlzcG9zZWQoKTtcbiAgcmV0dXJuIHRvcGsodGhpcywgaywgc29ydGVkKSBhcyB7dmFsdWVzOiBULCBpbmRpY2VzOiBUfTtcbn07XG4iXX0=