/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
/**
 * Inputs of size above this threshold will be parallelized by calling multiple
 * shader programs.
 */
import { nearestDivisor } from '../util';
export const PARALLELIZE_THRESHOLD = 30;
export function computeOptimalWindowSize(inSize) {
    if (inSize <= PARALLELIZE_THRESHOLD) {
        return inSize;
    }
    return nearestDivisor(inSize, Math.floor(Math.sqrt(inSize)));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkdWNlX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9yZWR1Y2VfdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSDs7O0dBR0c7QUFDSCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBRXZDLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFHLEVBQUUsQ0FBQztBQVN4QyxNQUFNLFVBQVUsd0JBQXdCLENBQUMsTUFBYztJQUNyRCxJQUFJLE1BQU0sSUFBSSxxQkFBcUIsRUFBRTtRQUNuQyxPQUFPLE1BQU0sQ0FBQztLQUNmO0lBQ0QsT0FBTyxjQUFjLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuLyoqXG4gKiBJbnB1dHMgb2Ygc2l6ZSBhYm92ZSB0aGlzIHRocmVzaG9sZCB3aWxsIGJlIHBhcmFsbGVsaXplZCBieSBjYWxsaW5nIG11bHRpcGxlXG4gKiBzaGFkZXIgcHJvZ3JhbXMuXG4gKi9cbmltcG9ydCB7bmVhcmVzdERpdmlzb3J9IGZyb20gJy4uL3V0aWwnO1xuXG5leHBvcnQgY29uc3QgUEFSQUxMRUxJWkVfVEhSRVNIT0xEID0gMzA7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVkdWNlSW5mbyB7XG4gIHdpbmRvd1NpemU6IG51bWJlcjtcbiAgYmF0Y2hTaXplOiBudW1iZXI7XG4gIGluU2l6ZTogbnVtYmVyO1xuICBvdXRTaXplOiBudW1iZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlT3B0aW1hbFdpbmRvd1NpemUoaW5TaXplOiBudW1iZXIpOiBudW1iZXIge1xuICBpZiAoaW5TaXplIDw9IFBBUkFMTEVMSVpFX1RIUkVTSE9MRCkge1xuICAgIHJldHVybiBpblNpemU7XG4gIH1cbiAgcmV0dXJuIG5lYXJlc3REaXZpc29yKGluU2l6ZSwgTWF0aC5mbG9vcihNYXRoLnNxcnQoaW5TaXplKSkpO1xufVxuIl19