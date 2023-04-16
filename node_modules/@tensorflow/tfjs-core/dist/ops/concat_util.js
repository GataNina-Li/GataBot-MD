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
import * as util from '../util';
export function assertParamsConsistent(shapes, axis) {
    const rank = shapes[0].length;
    shapes.forEach((shape, i) => {
        util.assert(shape.length === rank, () => `Error in concat${rank}D: rank of tensors[${i}] must be the same ` +
            `as the rank of the rest (${rank})`);
    });
    util.assert(axis >= 0 && axis < rank, () => `Error in concat${rank}D: axis must be between 0 and ${rank - 1}.`);
    const firstShape = shapes[0];
    shapes.forEach((shape, i) => {
        for (let r = 0; r < rank; r++) {
            util.assert((r === axis) || (shape[r] === firstShape[r]), () => `Error in concat${rank}D: Shape of tensors[${i}] (${shape}) ` +
                `does not match the shape of the rest (${firstShape}) ` +
                `along the non-concatenated axis ${i}.`);
        }
    });
}
export function computeOutShape(shapes, axis) {
    const outputShape = shapes[0].slice();
    for (let i = 1; i < shapes.length; i++) {
        outputShape[axis] += shapes[i][axis];
    }
    return outputShape;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY2F0X3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9jb25jYXRfdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEtBQUssSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUVoQyxNQUFNLFVBQVUsc0JBQXNCLENBQUMsTUFBa0IsRUFBRSxJQUFZO0lBQ3JFLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDOUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMxQixJQUFJLENBQUMsTUFBTSxDQUNQLEtBQUssQ0FBQyxNQUFNLEtBQUssSUFBSSxFQUNyQixHQUFHLEVBQUUsQ0FDRCxrQkFBa0IsSUFBSSxzQkFBc0IsQ0FBQyxxQkFBcUI7WUFDbEUsNEJBQTRCLElBQUksR0FBRyxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsTUFBTSxDQUNQLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxHQUFHLElBQUksRUFDeEIsR0FBRyxFQUFFLENBQUMsa0JBQWtCLElBQUksaUNBQWlDLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRTlFLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzFCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FDUCxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDNUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLElBQUksdUJBQXVCLENBQUMsTUFBTSxLQUFLLElBQUk7Z0JBQy9ELHlDQUF5QyxVQUFVLElBQUk7Z0JBQ3ZELG1DQUFtQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xEO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsTUFBTSxVQUFVLGVBQWUsQ0FBQyxNQUFrQixFQUFFLElBQVk7SUFDOUQsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3RDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3RDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDdEM7SUFDRCxPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0UGFyYW1zQ29uc2lzdGVudChzaGFwZXM6IG51bWJlcltdW10sIGF4aXM6IG51bWJlcikge1xuICBjb25zdCByYW5rID0gc2hhcGVzWzBdLmxlbmd0aDtcbiAgc2hhcGVzLmZvckVhY2goKHNoYXBlLCBpKSA9PiB7XG4gICAgdXRpbC5hc3NlcnQoXG4gICAgICAgIHNoYXBlLmxlbmd0aCA9PT0gcmFuayxcbiAgICAgICAgKCkgPT5cbiAgICAgICAgICAgIGBFcnJvciBpbiBjb25jYXQke3Jhbmt9RDogcmFuayBvZiB0ZW5zb3JzWyR7aX1dIG11c3QgYmUgdGhlIHNhbWUgYCArXG4gICAgICAgICAgICBgYXMgdGhlIHJhbmsgb2YgdGhlIHJlc3QgKCR7cmFua30pYCk7XG4gIH0pO1xuXG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgYXhpcyA+PSAwICYmIGF4aXMgPCByYW5rLFxuICAgICAgKCkgPT4gYEVycm9yIGluIGNvbmNhdCR7cmFua31EOiBheGlzIG11c3QgYmUgYmV0d2VlbiAwIGFuZCAke3JhbmsgLSAxfS5gKTtcblxuICBjb25zdCBmaXJzdFNoYXBlID0gc2hhcGVzWzBdO1xuICBzaGFwZXMuZm9yRWFjaCgoc2hhcGUsIGkpID0+IHtcbiAgICBmb3IgKGxldCByID0gMDsgciA8IHJhbms7IHIrKykge1xuICAgICAgdXRpbC5hc3NlcnQoXG4gICAgICAgICAgKHIgPT09IGF4aXMpIHx8IChzaGFwZVtyXSA9PT0gZmlyc3RTaGFwZVtyXSksXG4gICAgICAgICAgKCkgPT4gYEVycm9yIGluIGNvbmNhdCR7cmFua31EOiBTaGFwZSBvZiB0ZW5zb3JzWyR7aX1dICgke3NoYXBlfSkgYCArXG4gICAgICAgICAgICAgIGBkb2VzIG5vdCBtYXRjaCB0aGUgc2hhcGUgb2YgdGhlIHJlc3QgKCR7Zmlyc3RTaGFwZX0pIGAgK1xuICAgICAgICAgICAgICBgYWxvbmcgdGhlIG5vbi1jb25jYXRlbmF0ZWQgYXhpcyAke2l9LmApO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlT3V0U2hhcGUoc2hhcGVzOiBudW1iZXJbXVtdLCBheGlzOiBudW1iZXIpOiBudW1iZXJbXSB7XG4gIGNvbnN0IG91dHB1dFNoYXBlID0gc2hhcGVzWzBdLnNsaWNlKCk7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgc2hhcGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0cHV0U2hhcGVbYXhpc10gKz0gc2hhcGVzW2ldW2F4aXNdO1xuICB9XG4gIHJldHVybiBvdXRwdXRTaGFwZTtcbn1cbiJdfQ==