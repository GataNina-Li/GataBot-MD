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
import { max } from '../../ops/max';
import { getGlobalTensorClass } from '../../tensor';
getGlobalTensorClass().prototype.max = function (axis, keepDims) {
    this.throwIfDisposed();
    return max(this, axis, keepDims);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9wdWJsaWMvY2hhaW5lZF9vcHMvbWF4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbEMsT0FBTyxFQUFDLG9CQUFvQixFQUFTLE1BQU0sY0FBYyxDQUFDO0FBUzFELG9CQUFvQixFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxVQUNuQyxJQUFzQixFQUFFLFFBQWtCO0lBQzVDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN2QixPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ25DLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHttYXh9IGZyb20gJy4uLy4uL29wcy9tYXgnO1xuaW1wb3J0IHtnZXRHbG9iYWxUZW5zb3JDbGFzcywgVGVuc29yfSBmcm9tICcuLi8uLi90ZW5zb3InO1xuaW1wb3J0IHtSYW5rfSBmcm9tICcuLi8uLi90eXBlcyc7XG5cbmRlY2xhcmUgbW9kdWxlICcuLi8uLi90ZW5zb3InIHtcbiAgaW50ZXJmYWNlIFRlbnNvcjxSIGV4dGVuZHMgUmFuayA9IFJhbms+IHtcbiAgICBtYXg8VCBleHRlbmRzIFRlbnNvcj4oYXhpcz86IG51bWJlcnxudW1iZXJbXSwga2VlcERpbXM/OiBib29sZWFuKTogVDtcbiAgfVxufVxuXG5nZXRHbG9iYWxUZW5zb3JDbGFzcygpLnByb3RvdHlwZS5tYXggPSBmdW5jdGlvbjxUIGV4dGVuZHMgVGVuc29yPihcbiAgICBheGlzPzogbnVtYmVyfG51bWJlcltdLCBrZWVwRGltcz86IGJvb2xlYW4pOiBUIHtcbiAgdGhpcy50aHJvd0lmRGlzcG9zZWQoKTtcbiAgcmV0dXJuIG1heCh0aGlzLCBheGlzLCBrZWVwRGltcyk7XG59O1xuIl19