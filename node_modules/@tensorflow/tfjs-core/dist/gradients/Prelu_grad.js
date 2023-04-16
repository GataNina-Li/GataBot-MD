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
import { Prelu } from '../kernel_names';
import { getReductionAxes } from '../ops/broadcast_util';
import { greater } from '../ops/greater';
import { mul } from '../ops/mul';
import { reshape } from '../ops/reshape';
import { sum } from '../ops/sum';
import { where } from '../ops/where';
import { zerosLike } from '../ops/zeros_like';
export const preluGradConfig = {
    kernelName: Prelu,
    inputsToSave: ['x', 'alpha'],
    gradFunc: (dy, saved) => {
        const [x, alpha] = saved;
        const mask = greater(x, 0);
        return {
            x: () => where(mask, dy, mul(dy, alpha)),
            alpha: () => {
                let res = where(mask, zerosLike(dy), mul(dy, x));
                const reduceAxes = getReductionAxes(alpha.shape, dy.shape);
                if (reduceAxes.length > 0) {
                    res = sum(res, reduceAxes);
                }
                return reshape(res, alpha.shape);
            }
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJlbHVfZ3JhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvZ3JhZGllbnRzL1ByZWx1X2dyYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRXRDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2QyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2QyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDbkMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRzVDLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBZTtJQUN6QyxVQUFVLEVBQUUsS0FBSztJQUNqQixZQUFZLEVBQUUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDO0lBQzVCLFFBQVEsRUFBRSxDQUFDLEVBQVUsRUFBRSxLQUFlLEVBQUUsRUFBRTtRQUN4QyxNQUFNLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUN6QixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTNCLE9BQU87WUFDTCxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN4QyxLQUFLLEVBQUUsR0FBRyxFQUFFO2dCQUNWLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakQsTUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzNELElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ3pCLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2lCQUM1QjtnQkFDRCxPQUFPLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25DLENBQUM7U0FDRixDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQge1ByZWx1fSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtHcmFkQ29uZmlnfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtnZXRSZWR1Y3Rpb25BeGVzfSBmcm9tICcuLi9vcHMvYnJvYWRjYXN0X3V0aWwnO1xuaW1wb3J0IHtncmVhdGVyfSBmcm9tICcuLi9vcHMvZ3JlYXRlcic7XG5pbXBvcnQge211bH0gZnJvbSAnLi4vb3BzL211bCc7XG5pbXBvcnQge3Jlc2hhcGV9IGZyb20gJy4uL29wcy9yZXNoYXBlJztcbmltcG9ydCB7c3VtfSBmcm9tICcuLi9vcHMvc3VtJztcbmltcG9ydCB7d2hlcmV9IGZyb20gJy4uL29wcy93aGVyZSc7XG5pbXBvcnQge3plcm9zTGlrZX0gZnJvbSAnLi4vb3BzL3plcm9zX2xpa2UnO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5cbmV4cG9ydCBjb25zdCBwcmVsdUdyYWRDb25maWc6IEdyYWRDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IFByZWx1LFxuICBpbnB1dHNUb1NhdmU6IFsneCcsICdhbHBoYSddLFxuICBncmFkRnVuYzogKGR5OiBUZW5zb3IsIHNhdmVkOiBUZW5zb3JbXSkgPT4ge1xuICAgIGNvbnN0IFt4LCBhbHBoYV0gPSBzYXZlZDtcbiAgICBjb25zdCBtYXNrID0gZ3JlYXRlcih4LCAwKTtcblxuICAgIHJldHVybiB7XG4gICAgICB4OiAoKSA9PiB3aGVyZShtYXNrLCBkeSwgbXVsKGR5LCBhbHBoYSkpLFxuICAgICAgYWxwaGE6ICgpID0+IHtcbiAgICAgICAgbGV0IHJlcyA9IHdoZXJlKG1hc2ssIHplcm9zTGlrZShkeSksIG11bChkeSwgeCkpO1xuICAgICAgICBjb25zdCByZWR1Y2VBeGVzID0gZ2V0UmVkdWN0aW9uQXhlcyhhbHBoYS5zaGFwZSwgZHkuc2hhcGUpO1xuICAgICAgICBpZiAocmVkdWNlQXhlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmVzID0gc3VtKHJlcywgcmVkdWNlQXhlcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc2hhcGUocmVzLCBhbHBoYS5zaGFwZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcbiJdfQ==