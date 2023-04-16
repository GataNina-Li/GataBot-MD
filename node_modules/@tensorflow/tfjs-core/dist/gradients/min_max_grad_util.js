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
import * as axis_util from '../ops/axis_util';
import { cast } from '../ops/cast';
import { equal } from '../ops/equal';
import { mul } from '../ops/mul';
import { reshape } from '../ops/reshape';
/**
 * Gradient helper function for the min and max operations.
 */
export function gradForMinAndMax(dy, y, xOrig, origAxes) {
    if (y.rank < xOrig.rank) {
        y = reshape(y, axis_util.expandShapeToKeepDim(y.shape, origAxes));
    }
    if (dy.rank < xOrig.rank) {
        dy = reshape(dy, axis_util.expandShapeToKeepDim(dy.shape, origAxes));
    }
    return {
        x: () => {
            const dx = mul(dy, cast(equal(xOrig, y), dy.dtype));
            return dx;
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWluX21heF9ncmFkX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2dyYWRpZW50cy9taW5fbWF4X2dyYWRfdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEtBQUssU0FBUyxNQUFNLGtCQUFrQixDQUFDO0FBQzlDLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDakMsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUNuQyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUd2Qzs7R0FFRztBQUNILE1BQU0sVUFBVSxnQkFBZ0IsQ0FDNUIsRUFBSyxFQUFFLENBQUksRUFBRSxLQUFhLEVBQUUsUUFBa0I7SUFDaEQsSUFBSSxDQUFDLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUU7UUFDdkIsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQU0sQ0FBQztLQUN4RTtJQUNELElBQUksRUFBRSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFO1FBQ3hCLEVBQUUsR0FBRyxPQUFPLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFNLENBQUM7S0FDM0U7SUFDRCxPQUFPO1FBQ0wsQ0FBQyxFQUFFLEdBQUcsRUFBRTtZQUNOLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDcEQsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAqIGFzIGF4aXNfdXRpbCBmcm9tICcuLi9vcHMvYXhpc191dGlsJztcbmltcG9ydCB7Y2FzdH0gZnJvbSAnLi4vb3BzL2Nhc3QnO1xuaW1wb3J0IHtlcXVhbH0gZnJvbSAnLi4vb3BzL2VxdWFsJztcbmltcG9ydCB7bXVsfSBmcm9tICcuLi9vcHMvbXVsJztcbmltcG9ydCB7cmVzaGFwZX0gZnJvbSAnLi4vb3BzL3Jlc2hhcGUnO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5cbi8qKlxuICogR3JhZGllbnQgaGVscGVyIGZ1bmN0aW9uIGZvciB0aGUgbWluIGFuZCBtYXggb3BlcmF0aW9ucy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdyYWRGb3JNaW5BbmRNYXg8VCBleHRlbmRzIFRlbnNvcj4oXG4gICAgZHk6IFQsIHk6IFQsIHhPcmlnOiBUZW5zb3IsIG9yaWdBeGVzOiBudW1iZXJbXSkge1xuICBpZiAoeS5yYW5rIDwgeE9yaWcucmFuaykge1xuICAgIHkgPSByZXNoYXBlKHksIGF4aXNfdXRpbC5leHBhbmRTaGFwZVRvS2VlcERpbSh5LnNoYXBlLCBvcmlnQXhlcykpIGFzIFQ7XG4gIH1cbiAgaWYgKGR5LnJhbmsgPCB4T3JpZy5yYW5rKSB7XG4gICAgZHkgPSByZXNoYXBlKGR5LCBheGlzX3V0aWwuZXhwYW5kU2hhcGVUb0tlZXBEaW0oZHkuc2hhcGUsIG9yaWdBeGVzKSkgYXMgVDtcbiAgfVxuICByZXR1cm4ge1xuICAgIHg6ICgpID0+IHtcbiAgICAgIGNvbnN0IGR4ID0gbXVsKGR5LCBjYXN0KGVxdWFsKHhPcmlnLCB5KSwgZHkuZHR5cGUpKTtcbiAgICAgIHJldHVybiBkeDtcbiAgICB9XG4gIH07XG59XG4iXX0=