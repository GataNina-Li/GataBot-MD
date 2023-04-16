/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
import { ENGINE } from '../engine';
import { LinSpace } from '../kernel_names';
/**
 * Return an evenly spaced sequence of numbers over the given interval.
 *
 * ```js
 * tf.linspace(0, 9, 10).print();
 * ```
 * @param start The start value of the sequence.
 * @param stop The end value of the sequence.
 * @param num The number of values to generate.
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
export function linspace(start, stop, num) {
    if (num <= 0) {
        throw new Error('The number of values should be positive.');
    }
    const attrs = { start, stop, num };
    return ENGINE.runKernel(LinSpace, {}, attrs);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluc3BhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9saW5zcGFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxRQUFRLEVBQWdCLE1BQU0saUJBQWlCLENBQUM7QUFJeEQ7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFNLFVBQVUsUUFBUSxDQUFDLEtBQWEsRUFBRSxJQUFZLEVBQUUsR0FBVztJQUMvRCxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUU7UUFDWixNQUFNLElBQUksS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7S0FDN0Q7SUFFRCxNQUFNLEtBQUssR0FBa0IsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBQyxDQUFDO0lBQ2hELE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLEtBQTJCLENBQUMsQ0FBQztBQUNyRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7TGluU3BhY2UsIExpblNwYWNlQXR0cnN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge05hbWVkQXR0ck1hcH0gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7VGVuc29yMUR9IGZyb20gJy4uL3RlbnNvcic7XG5cbi8qKlxuICogUmV0dXJuIGFuIGV2ZW5seSBzcGFjZWQgc2VxdWVuY2Ugb2YgbnVtYmVycyBvdmVyIHRoZSBnaXZlbiBpbnRlcnZhbC5cbiAqXG4gKiBgYGBqc1xuICogdGYubGluc3BhY2UoMCwgOSwgMTApLnByaW50KCk7XG4gKiBgYGBcbiAqIEBwYXJhbSBzdGFydCBUaGUgc3RhcnQgdmFsdWUgb2YgdGhlIHNlcXVlbmNlLlxuICogQHBhcmFtIHN0b3AgVGhlIGVuZCB2YWx1ZSBvZiB0aGUgc2VxdWVuY2UuXG4gKiBAcGFyYW0gbnVtIFRoZSBudW1iZXIgb2YgdmFsdWVzIHRvIGdlbmVyYXRlLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdUZW5zb3JzJywgc3ViaGVhZGluZzogJ0NyZWF0aW9uJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpbnNwYWNlKHN0YXJ0OiBudW1iZXIsIHN0b3A6IG51bWJlciwgbnVtOiBudW1iZXIpOiBUZW5zb3IxRCB7XG4gIGlmIChudW0gPD0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIG51bWJlciBvZiB2YWx1ZXMgc2hvdWxkIGJlIHBvc2l0aXZlLicpO1xuICB9XG5cbiAgY29uc3QgYXR0cnM6IExpblNwYWNlQXR0cnMgPSB7c3RhcnQsIHN0b3AsIG51bX07XG4gIHJldHVybiBFTkdJTkUucnVuS2VybmVsKExpblNwYWNlLCB7fSwgYXR0cnMgYXMge30gYXMgTmFtZWRBdHRyTWFwKTtcbn1cbiJdfQ==