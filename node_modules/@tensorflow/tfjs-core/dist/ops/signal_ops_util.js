/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
import { tensor1d } from './tensor1d';
export function enclosingPowerOfTwo(value) {
    // Return 2**N for integer N such that 2**N >= value.
    return Math.floor(Math.pow(2, Math.ceil(Math.log(value) / Math.log(2.0))));
}
export function cosineWindow(windowLength, a, b) {
    const even = 1 - windowLength % 2;
    const newValues = new Float32Array(windowLength);
    for (let i = 0; i < windowLength; ++i) {
        const cosArg = (2.0 * Math.PI * i) / (windowLength + even - 1);
        newValues[i] = a - b * Math.cos(cosArg);
    }
    return tensor1d(newValues, 'float32');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsX29wc191dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvc2lnbmFsX29wc191dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUdILE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFcEMsTUFBTSxVQUFVLG1CQUFtQixDQUFDLEtBQWE7SUFDL0MscURBQXFEO0lBQ3JELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3RSxDQUFDO0FBRUQsTUFBTSxVQUFVLFlBQVksQ0FDeEIsWUFBb0IsRUFBRSxDQUFTLEVBQUUsQ0FBUztJQUM1QyxNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQztJQUNsQyxNQUFNLFNBQVMsR0FBRyxJQUFJLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNqRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQ3JDLE1BQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQy9ELFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDekM7SUFDRCxPQUFPLFFBQVEsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDeEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtUZW5zb3IxRH0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7dGVuc29yMWR9IGZyb20gJy4vdGVuc29yMWQnO1xuXG5leHBvcnQgZnVuY3Rpb24gZW5jbG9zaW5nUG93ZXJPZlR3byh2YWx1ZTogbnVtYmVyKSB7XG4gIC8vIFJldHVybiAyKipOIGZvciBpbnRlZ2VyIE4gc3VjaCB0aGF0IDIqKk4gPj0gdmFsdWUuXG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucG93KDIsIE1hdGguY2VpbChNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLmxvZygyLjApKSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29zaW5lV2luZG93KFxuICAgIHdpbmRvd0xlbmd0aDogbnVtYmVyLCBhOiBudW1iZXIsIGI6IG51bWJlcik6IFRlbnNvcjFEIHtcbiAgY29uc3QgZXZlbiA9IDEgLSB3aW5kb3dMZW5ndGggJSAyO1xuICBjb25zdCBuZXdWYWx1ZXMgPSBuZXcgRmxvYXQzMkFycmF5KHdpbmRvd0xlbmd0aCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgd2luZG93TGVuZ3RoOyArK2kpIHtcbiAgICBjb25zdCBjb3NBcmcgPSAoMi4wICogTWF0aC5QSSAqIGkpIC8gKHdpbmRvd0xlbmd0aCArIGV2ZW4gLSAxKTtcbiAgICBuZXdWYWx1ZXNbaV0gPSBhIC0gYiAqIE1hdGguY29zKGNvc0FyZyk7XG4gIH1cbiAgcmV0dXJuIHRlbnNvcjFkKG5ld1ZhbHVlcywgJ2Zsb2F0MzInKTtcbn1cbiJdfQ==