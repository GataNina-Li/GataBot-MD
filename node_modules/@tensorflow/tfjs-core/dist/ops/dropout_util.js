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
import * as util from '../util';
/**
 * Normalize noise shape based on provided tensor and noise shape.
 *
 * @param x Tensor.
 * @param noiseShape The shape for the randomly generated keep/drop flags, as
 *   an array of numbers. Optional.
 * @returns Normalized noise shape.
 */
export function getNoiseShape(x, noiseShape) {
    if (noiseShape == null) {
        return x.shape.slice();
    }
    if (util.arraysEqual(x.shape, noiseShape)) {
        return noiseShape;
    }
    if (x.shape.length === noiseShape.length) {
        const newDimension = [];
        for (let i = 0; i < x.shape.length; i++) {
            if (noiseShape[i] == null && x.shape[i] != null) {
                newDimension.push(x.shape[i]);
            }
            else {
                newDimension.push(noiseShape[i]);
            }
        }
        return newDimension;
    }
    return noiseShape;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcG91dF91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvZHJvcG91dF91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUdILE9BQU8sS0FBSyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBRWhDOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLFVBQVUsYUFBYSxDQUFDLENBQVMsRUFBRSxVQUFxQjtJQUM1RCxJQUFJLFVBQVUsSUFBSSxJQUFJLEVBQUU7UUFDdEIsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ3hCO0lBQ0QsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLEVBQUU7UUFDekMsT0FBTyxVQUFVLENBQUM7S0FDbkI7SUFDRCxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLFVBQVUsQ0FBQyxNQUFNLEVBQUU7UUFDeEMsTUFBTSxZQUFZLEdBQWEsRUFBRSxDQUFDO1FBQ2xDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN2QyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUU7Z0JBQy9DLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQy9CO2lCQUFNO2dCQUNMLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbEM7U0FDRjtRQUNELE9BQU8sWUFBWSxDQUFDO0tBQ3JCO0lBRUQsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnO1xuXG4vKipcbiAqIE5vcm1hbGl6ZSBub2lzZSBzaGFwZSBiYXNlZCBvbiBwcm92aWRlZCB0ZW5zb3IgYW5kIG5vaXNlIHNoYXBlLlxuICpcbiAqIEBwYXJhbSB4IFRlbnNvci5cbiAqIEBwYXJhbSBub2lzZVNoYXBlIFRoZSBzaGFwZSBmb3IgdGhlIHJhbmRvbWx5IGdlbmVyYXRlZCBrZWVwL2Ryb3AgZmxhZ3MsIGFzXG4gKiAgIGFuIGFycmF5IG9mIG51bWJlcnMuIE9wdGlvbmFsLlxuICogQHJldHVybnMgTm9ybWFsaXplZCBub2lzZSBzaGFwZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE5vaXNlU2hhcGUoeDogVGVuc29yLCBub2lzZVNoYXBlPzogbnVtYmVyW10pOiBudW1iZXJbXSB7XG4gIGlmIChub2lzZVNoYXBlID09IG51bGwpIHtcbiAgICByZXR1cm4geC5zaGFwZS5zbGljZSgpO1xuICB9XG4gIGlmICh1dGlsLmFycmF5c0VxdWFsKHguc2hhcGUsIG5vaXNlU2hhcGUpKSB7XG4gICAgcmV0dXJuIG5vaXNlU2hhcGU7XG4gIH1cbiAgaWYgKHguc2hhcGUubGVuZ3RoID09PSBub2lzZVNoYXBlLmxlbmd0aCkge1xuICAgIGNvbnN0IG5ld0RpbWVuc2lvbjogbnVtYmVyW10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHguc2hhcGUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChub2lzZVNoYXBlW2ldID09IG51bGwgJiYgeC5zaGFwZVtpXSAhPSBudWxsKSB7XG4gICAgICAgIG5ld0RpbWVuc2lvbi5wdXNoKHguc2hhcGVbaV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3RGltZW5zaW9uLnB1c2gobm9pc2VTaGFwZVtpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdEaW1lbnNpb247XG4gIH1cblxuICByZXR1cm4gbm9pc2VTaGFwZTtcbn1cbiJdfQ==