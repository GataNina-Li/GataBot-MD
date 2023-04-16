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
// Returns the image center in pixels.
export function getImageCenter(center, imageHeight, imageWidth) {
    const centerX = imageWidth * (typeof center === 'number' ? center : center[0]);
    const centerY = imageHeight * (typeof center === 'number' ? center : center[1]);
    return [centerX, centerY];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm90YXRlX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9yb3RhdGVfdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxzQ0FBc0M7QUFDdEMsTUFBTSxVQUFVLGNBQWMsQ0FDMUIsTUFBK0IsRUFBRSxXQUFtQixFQUNwRCxVQUFrQjtJQUNwQixNQUFNLE9BQU8sR0FDVCxVQUFVLEdBQUcsQ0FBQyxPQUFPLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkUsTUFBTSxPQUFPLEdBQ1QsV0FBVyxHQUFHLENBQUMsT0FBTyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDNUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuLy8gUmV0dXJucyB0aGUgaW1hZ2UgY2VudGVyIGluIHBpeGVscy5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbWFnZUNlbnRlcihcbiAgICBjZW50ZXI6IG51bWJlcnxbbnVtYmVyLCBudW1iZXJdLCBpbWFnZUhlaWdodDogbnVtYmVyLFxuICAgIGltYWdlV2lkdGg6IG51bWJlcik6IFtudW1iZXIsIG51bWJlcl0ge1xuICBjb25zdCBjZW50ZXJYID1cbiAgICAgIGltYWdlV2lkdGggKiAodHlwZW9mIGNlbnRlciA9PT0gJ251bWJlcicgPyBjZW50ZXIgOiBjZW50ZXJbMF0pO1xuICBjb25zdCBjZW50ZXJZID1cbiAgICAgIGltYWdlSGVpZ2h0ICogKHR5cGVvZiBjZW50ZXIgPT09ICdudW1iZXInID8gY2VudGVyIDogY2VudGVyWzFdKTtcbiAgcmV0dXJuIFtjZW50ZXJYLCBjZW50ZXJZXTtcbn1cbiJdfQ==