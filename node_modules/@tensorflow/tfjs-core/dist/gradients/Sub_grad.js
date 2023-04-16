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
import { Sub } from '../kernel_names';
import * as broadcast_util from '../ops/broadcast_util';
import { neg } from '../ops/neg';
import { reshape } from '../ops/reshape';
import { sum } from '../ops/sum';
export const subGradConfig = {
    kernelName: Sub,
    inputsToSave: ['a', 'b'],
    gradFunc: (dy, saved) => {
        const [a, b] = saved;
        const outShape = broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        const derA = () => {
            let res = dy;
            const reduceAxes = broadcast_util.getReductionAxes(a.shape, outShape);
            if (reduceAxes.length > 0) {
                res = sum(res, reduceAxes);
            }
            return reshape(res, a.shape);
        };
        const derB = () => {
            let res = dy;
            const reduceAxes = broadcast_util.getReductionAxes(b.shape, outShape);
            if (reduceAxes.length > 0) {
                res = sum(res, reduceAxes);
            }
            return reshape(neg(res), b.shape);
        };
        return { a: derA, b: derB };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3ViX2dyYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2dyYWRpZW50cy9TdWJfZ3JhZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFcEMsT0FBTyxLQUFLLGNBQWMsTUFBTSx1QkFBdUIsQ0FBQztBQUN4RCxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2QyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRy9CLE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBZTtJQUN2QyxVQUFVLEVBQUUsR0FBRztJQUNmLFlBQVksRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDeEIsUUFBUSxFQUFFLENBQUMsRUFBVSxFQUFFLEtBQWUsRUFBRSxFQUFFO1FBQ3hDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLE1BQU0sUUFBUSxHQUNWLGNBQWMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVoRSxNQUFNLElBQUksR0FBRyxHQUFHLEVBQUU7WUFDaEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2IsTUFBTSxVQUFVLEdBQUcsY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDdEUsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDekIsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7YUFDNUI7WUFDRCxPQUFPLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQztRQUNGLE1BQU0sSUFBSSxHQUFHLEdBQUcsRUFBRTtZQUNoQixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDYixNQUFNLFVBQVUsR0FBRyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN0RSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN6QixHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQzthQUM1QjtZQUNELE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDO1FBRUYsT0FBTyxFQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBQyxDQUFDO0lBQzVCLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuaW1wb3J0IHtTdWJ9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge0dyYWRDb25maWd9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQgKiBhcyBicm9hZGNhc3RfdXRpbCBmcm9tICcuLi9vcHMvYnJvYWRjYXN0X3V0aWwnO1xuaW1wb3J0IHtuZWd9IGZyb20gJy4uL29wcy9uZWcnO1xuaW1wb3J0IHtyZXNoYXBlfSBmcm9tICcuLi9vcHMvcmVzaGFwZSc7XG5pbXBvcnQge3N1bX0gZnJvbSAnLi4vb3BzL3N1bSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcblxuZXhwb3J0IGNvbnN0IHN1YkdyYWRDb25maWc6IEdyYWRDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IFN1YixcbiAgaW5wdXRzVG9TYXZlOiBbJ2EnLCAnYiddLFxuICBncmFkRnVuYzogKGR5OiBUZW5zb3IsIHNhdmVkOiBUZW5zb3JbXSkgPT4ge1xuICAgIGNvbnN0IFthLCBiXSA9IHNhdmVkO1xuICAgIGNvbnN0IG91dFNoYXBlID1cbiAgICAgICAgYnJvYWRjYXN0X3V0aWwuYXNzZXJ0QW5kR2V0QnJvYWRjYXN0U2hhcGUoYS5zaGFwZSwgYi5zaGFwZSk7XG5cbiAgICBjb25zdCBkZXJBID0gKCkgPT4ge1xuICAgICAgbGV0IHJlcyA9IGR5O1xuICAgICAgY29uc3QgcmVkdWNlQXhlcyA9IGJyb2FkY2FzdF91dGlsLmdldFJlZHVjdGlvbkF4ZXMoYS5zaGFwZSwgb3V0U2hhcGUpO1xuICAgICAgaWYgKHJlZHVjZUF4ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXMgPSBzdW0ocmVzLCByZWR1Y2VBeGVzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNoYXBlKHJlcywgYS5zaGFwZSk7XG4gICAgfTtcbiAgICBjb25zdCBkZXJCID0gKCkgPT4ge1xuICAgICAgbGV0IHJlcyA9IGR5O1xuICAgICAgY29uc3QgcmVkdWNlQXhlcyA9IGJyb2FkY2FzdF91dGlsLmdldFJlZHVjdGlvbkF4ZXMoYi5zaGFwZSwgb3V0U2hhcGUpO1xuICAgICAgaWYgKHJlZHVjZUF4ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXMgPSBzdW0ocmVzLCByZWR1Y2VBeGVzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNoYXBlKG5lZyhyZXMpLCBiLnNoYXBlKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHthOiBkZXJBLCBiOiBkZXJCfTtcbiAgfVxufTtcbiJdfQ==