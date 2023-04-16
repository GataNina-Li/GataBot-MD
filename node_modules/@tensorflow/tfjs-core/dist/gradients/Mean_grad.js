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
import { Mean } from '../kernel_names';
import { computeOutAndReduceShapes } from '../ops/axis_util';
import { div } from '../ops/div';
import { mul } from '../ops/mul';
import { ones } from '../ops/ones';
import { reshape } from '../ops/reshape';
import * as util from '../util';
export const meanGradConfig = {
    kernelName: Mean,
    inputsToSave: ['x'],
    gradFunc: (dy, saved, attrs) => {
        const [x] = saved;
        const { axis } = attrs;
        const axes = util.parseAxisParam(axis, x.shape);
        const shapes = computeOutAndReduceShapes(x.shape, axes);
        const reduceShape = shapes[1];
        const reduceSize = util.sizeFromShape(reduceShape);
        const derX = () => {
            const expandedDyShape = x.shape.slice();
            axes.forEach(axis => {
                expandedDyShape[axis] = 1;
            });
            const expandedDy = reshape(dy, expandedDyShape);
            const res = div(mul(expandedDy, ones(x.shape, 'float32')), reduceSize);
            return res;
        };
        return { x: derX };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVhbl9ncmFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9ncmFkaWVudHMvTWVhbl9ncmFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxJQUFJLEVBQVksTUFBTSxpQkFBaUIsQ0FBQztBQUVoRCxPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDL0IsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUNqQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFdkMsT0FBTyxLQUFLLElBQUksTUFBTSxTQUFTLENBQUM7QUFFaEMsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFlO0lBQ3hDLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFlBQVksRUFBRSxDQUFDLEdBQUcsQ0FBQztJQUNuQixRQUFRLEVBQUUsQ0FBQyxFQUFVLEVBQUUsS0FBZSxFQUFFLEtBQW1CLEVBQUUsRUFBRTtRQUM3RCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLE1BQU0sRUFBQyxJQUFJLEVBQUMsR0FBRyxLQUF3QixDQUFDO1FBQ3hDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRCxNQUFNLE1BQU0sR0FBRyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRW5ELE1BQU0sSUFBSSxHQUFHLEdBQUcsRUFBRTtZQUNoQixNQUFNLGVBQWUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2xCLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDLENBQUM7WUFDSCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsRUFBRSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQ2hELE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDdkUsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDLENBQUM7UUFFRixPQUFPLEVBQUMsQ0FBQyxFQUFFLElBQUksRUFBQyxDQUFDO0lBQ25CLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge01lYW4sIE1lYW5BdHRyc30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7R3JhZENvbmZpZywgTmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtjb21wdXRlT3V0QW5kUmVkdWNlU2hhcGVzfSBmcm9tICcuLi9vcHMvYXhpc191dGlsJztcbmltcG9ydCB7ZGl2fSBmcm9tICcuLi9vcHMvZGl2JztcbmltcG9ydCB7bXVsfSBmcm9tICcuLi9vcHMvbXVsJztcbmltcG9ydCB7b25lc30gZnJvbSAnLi4vb3BzL29uZXMnO1xuaW1wb3J0IHtyZXNoYXBlfSBmcm9tICcuLi9vcHMvcmVzaGFwZSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5cbmV4cG9ydCBjb25zdCBtZWFuR3JhZENvbmZpZzogR3JhZENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogTWVhbixcbiAgaW5wdXRzVG9TYXZlOiBbJ3gnXSxcbiAgZ3JhZEZ1bmM6IChkeTogVGVuc29yLCBzYXZlZDogVGVuc29yW10sIGF0dHJzOiBOYW1lZEF0dHJNYXApID0+IHtcbiAgICBjb25zdCBbeF0gPSBzYXZlZDtcbiAgICBjb25zdCB7YXhpc30gPSBhdHRycyBhcyB7fSBhcyBNZWFuQXR0cnM7XG4gICAgY29uc3QgYXhlcyA9IHV0aWwucGFyc2VBeGlzUGFyYW0oYXhpcywgeC5zaGFwZSk7XG4gICAgY29uc3Qgc2hhcGVzID0gY29tcHV0ZU91dEFuZFJlZHVjZVNoYXBlcyh4LnNoYXBlLCBheGVzKTtcbiAgICBjb25zdCByZWR1Y2VTaGFwZSA9IHNoYXBlc1sxXTtcbiAgICBjb25zdCByZWR1Y2VTaXplID0gdXRpbC5zaXplRnJvbVNoYXBlKHJlZHVjZVNoYXBlKTtcblxuICAgIGNvbnN0IGRlclggPSAoKSA9PiB7XG4gICAgICBjb25zdCBleHBhbmRlZER5U2hhcGUgPSB4LnNoYXBlLnNsaWNlKCk7XG4gICAgICBheGVzLmZvckVhY2goYXhpcyA9PiB7XG4gICAgICAgIGV4cGFuZGVkRHlTaGFwZVtheGlzXSA9IDE7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGV4cGFuZGVkRHkgPSByZXNoYXBlKGR5LCBleHBhbmRlZER5U2hhcGUpO1xuICAgICAgY29uc3QgcmVzID0gZGl2KG11bChleHBhbmRlZER5LCBvbmVzKHguc2hhcGUsICdmbG9hdDMyJykpLCByZWR1Y2VTaXplKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfTtcblxuICAgIHJldHVybiB7eDogZGVyWH07XG4gIH1cbn07XG4iXX0=