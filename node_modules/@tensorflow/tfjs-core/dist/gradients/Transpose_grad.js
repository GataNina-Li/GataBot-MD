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
import { Transpose } from '../kernel_names';
import * as axis_util from '../ops/axis_util';
import { transpose } from '../ops/transpose';
export const transposeGradConfig = {
    kernelName: Transpose,
    gradFunc: (dy, saved, attrs) => {
        const transposeAttrs = attrs;
        const { perm } = transposeAttrs;
        const undoPerm = axis_util.getUndoAxesPermutation(perm);
        return { x: () => transpose(dy, undoPerm) };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNwb3NlX2dyYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2dyYWRpZW50cy9UcmFuc3Bvc2VfZ3JhZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFpQixNQUFNLGlCQUFpQixDQUFDO0FBRTFELE9BQU8sS0FBSyxTQUFTLE1BQU0sa0JBQWtCLENBQUM7QUFDOUMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBRzNDLE1BQU0sQ0FBQyxNQUFNLG1CQUFtQixHQUFlO0lBQzdDLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLFFBQVEsRUFBRSxDQUFDLEVBQVUsRUFBRSxLQUFlLEVBQUUsS0FBbUIsRUFBRSxFQUFFO1FBQzdELE1BQU0sY0FBYyxHQUFtQixLQUE2QixDQUFDO1FBQ3JFLE1BQU0sRUFBQyxJQUFJLEVBQUMsR0FBRyxjQUFjLENBQUM7UUFDOUIsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hELE9BQU8sRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsRUFBQyxDQUFDO0lBQzVDLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge1RyYW5zcG9zZSwgVHJhbnNwb3NlQXR0cnN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge0dyYWRDb25maWcsIE5hbWVkQXR0ck1hcH0gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCAqIGFzIGF4aXNfdXRpbCBmcm9tICcuLi9vcHMvYXhpc191dGlsJztcbmltcG9ydCB7dHJhbnNwb3NlfSBmcm9tICcuLi9vcHMvdHJhbnNwb3NlJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuXG5leHBvcnQgY29uc3QgdHJhbnNwb3NlR3JhZENvbmZpZzogR3JhZENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogVHJhbnNwb3NlLFxuICBncmFkRnVuYzogKGR5OiBUZW5zb3IsIHNhdmVkOiBUZW5zb3JbXSwgYXR0cnM6IE5hbWVkQXR0ck1hcCkgPT4ge1xuICAgIGNvbnN0IHRyYW5zcG9zZUF0dHJzOiBUcmFuc3Bvc2VBdHRycyA9IGF0dHJzIGFzIHt9IGFzIFRyYW5zcG9zZUF0dHJzO1xuICAgIGNvbnN0IHtwZXJtfSA9IHRyYW5zcG9zZUF0dHJzO1xuICAgIGNvbnN0IHVuZG9QZXJtID0gYXhpc191dGlsLmdldFVuZG9BeGVzUGVybXV0YXRpb24ocGVybSk7XG4gICAgcmV0dXJuIHt4OiAoKSA9PiB0cmFuc3Bvc2UoZHksIHVuZG9QZXJtKX07XG4gIH1cbn07XG4iXX0=