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
import { op } from '../operation';
import { cosineWindow } from '../signal_ops_util';
/**
 * Generate a Hann window.
 *
 * See: https://en.wikipedia.org/wiki/Window_function#Hann_and_Hamming_windows
 *
 * ```js
 * tf.signal.hannWindow(10).print();
 * ```
 * @param The length of window
 *
 * @doc {heading: 'Operations', subheading: 'Signal', namespace: 'signal'}
 */
function hannWindow_(windowLength) {
    return cosineWindow(windowLength, 0.5, 0.5);
}
export const hannWindow = op({ hannWindow_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFubl93aW5kb3cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9zaWduYWwvaGFubl93aW5kb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBR0gsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUNoQyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFaEQ7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxTQUFTLFdBQVcsQ0FBQyxZQUFvQjtJQUN2QyxPQUFPLFlBQVksQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzlDLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLEVBQUMsV0FBVyxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtUZW5zb3IxRH0gZnJvbSAnLi4vLi4vdGVuc29yJztcbmltcG9ydCB7b3B9IGZyb20gJy4uL29wZXJhdGlvbic7XG5pbXBvcnQge2Nvc2luZVdpbmRvd30gZnJvbSAnLi4vc2lnbmFsX29wc191dGlsJztcblxuLyoqXG4gKiBHZW5lcmF0ZSBhIEhhbm4gd2luZG93LlxuICpcbiAqIFNlZTogaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvV2luZG93X2Z1bmN0aW9uI0hhbm5fYW5kX0hhbW1pbmdfd2luZG93c1xuICpcbiAqIGBgYGpzXG4gKiB0Zi5zaWduYWwuaGFubldpbmRvdygxMCkucHJpbnQoKTtcbiAqIGBgYFxuICogQHBhcmFtIFRoZSBsZW5ndGggb2Ygd2luZG93XG4gKlxuICogQGRvYyB7aGVhZGluZzogJ09wZXJhdGlvbnMnLCBzdWJoZWFkaW5nOiAnU2lnbmFsJywgbmFtZXNwYWNlOiAnc2lnbmFsJ31cbiAqL1xuZnVuY3Rpb24gaGFubldpbmRvd18od2luZG93TGVuZ3RoOiBudW1iZXIpOiBUZW5zb3IxRCB7XG4gIHJldHVybiBjb3NpbmVXaW5kb3cod2luZG93TGVuZ3RoLCAwLjUsIDAuNSk7XG59XG5cbmV4cG9ydCBjb25zdCBoYW5uV2luZG93ID0gb3Aoe2hhbm5XaW5kb3dffSk7XG4iXX0=