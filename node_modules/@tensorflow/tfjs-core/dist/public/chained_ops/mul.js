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
import { mul } from '../../ops/mul';
import { getGlobalTensorClass } from '../../tensor';
getGlobalTensorClass().prototype.mul = function (b) {
    this.throwIfDisposed();
    return mul(this, b);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9wdWJsaWMvY2hhaW5lZF9vcHMvbXVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbEMsT0FBTyxFQUFDLG9CQUFvQixFQUFTLE1BQU0sY0FBYyxDQUFDO0FBUzFELG9CQUFvQixFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxVQUNuQyxDQUFvQjtJQUN0QixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDdkIsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbmltcG9ydCB7bXVsfSBmcm9tICcuLi8uLi9vcHMvbXVsJztcbmltcG9ydCB7Z2V0R2xvYmFsVGVuc29yQ2xhc3MsIFRlbnNvcn0gZnJvbSAnLi4vLi4vdGVuc29yJztcbmltcG9ydCB7UmFuaywgVGVuc29yTGlrZX0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5kZWNsYXJlIG1vZHVsZSAnLi4vLi4vdGVuc29yJyB7XG4gIGludGVyZmFjZSBUZW5zb3I8UiBleHRlbmRzIFJhbmsgPSBSYW5rPiB7XG4gICAgbXVsPFQgZXh0ZW5kcyBUZW5zb3I+KGI6IFRlbnNvcnxUZW5zb3JMaWtlKTogVDtcbiAgfVxufVxuXG5nZXRHbG9iYWxUZW5zb3JDbGFzcygpLnByb3RvdHlwZS5tdWwgPSBmdW5jdGlvbjxUIGV4dGVuZHMgVGVuc29yPihcbiAgICBiOiBUZW5zb3J8VGVuc29yTGlrZSk6IFQge1xuICB0aGlzLnRocm93SWZEaXNwb3NlZCgpO1xuICByZXR1cm4gbXVsKHRoaXMsIGIpO1xufTtcbiJdfQ==