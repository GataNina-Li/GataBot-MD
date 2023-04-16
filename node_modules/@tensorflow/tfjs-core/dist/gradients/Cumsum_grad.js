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
import { Cumsum } from '../kernel_names';
import { getAxesPermutation } from '../ops/axis_util';
import { cumsum } from '../ops/cumsum';
import { transpose } from '../ops/transpose';
export const cumsumGradConfig = {
    kernelName: Cumsum,
    inputsToSave: ['x'],
    gradFunc: (dy, saved, attrs) => {
        const [x] = saved;
        const { axis, exclusive, reverse } = attrs;
        return {
            x: () => {
                const permutation = getAxesPermutation([axis], x.rank);
                let out = cumsum(dy, axis, exclusive, !reverse);
                if (permutation != null) {
                    out = transpose(out, permutation);
                }
                return out;
            }
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3Vtc3VtX2dyYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2dyYWRpZW50cy9DdW1zdW1fZ3JhZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFjLE1BQU0saUJBQWlCLENBQUM7QUFFcEQsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDcEQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNyQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFHM0MsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQWU7SUFDMUMsVUFBVSxFQUFFLE1BQU07SUFDbEIsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQ25CLFFBQVEsRUFBRSxDQUFDLEVBQVUsRUFBRSxLQUFlLEVBQUUsS0FBbUIsRUFBRSxFQUFFO1FBQzdELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDbEIsTUFBTSxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFDLEdBQWdCLEtBQTBCLENBQUM7UUFFM0UsT0FBTztZQUNMLENBQUMsRUFBRSxHQUFHLEVBQUU7Z0JBQ04sTUFBTSxXQUFXLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRXZELElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUVoRCxJQUFJLFdBQVcsSUFBSSxJQUFJLEVBQUU7b0JBQ3ZCLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2lCQUNuQztnQkFFRCxPQUFPLEdBQUcsQ0FBQztZQUNiLENBQUM7U0FDRixDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7Q3Vtc3VtLCBDdW1zdW1BdHRyc30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7R3JhZENvbmZpZywgTmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtnZXRBeGVzUGVybXV0YXRpb259IGZyb20gJy4uL29wcy9heGlzX3V0aWwnO1xuaW1wb3J0IHtjdW1zdW19IGZyb20gJy4uL29wcy9jdW1zdW0nO1xuaW1wb3J0IHt0cmFuc3Bvc2V9IGZyb20gJy4uL29wcy90cmFuc3Bvc2UnO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5cbmV4cG9ydCBjb25zdCBjdW1zdW1HcmFkQ29uZmlnOiBHcmFkQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBDdW1zdW0sXG4gIGlucHV0c1RvU2F2ZTogWyd4J10sXG4gIGdyYWRGdW5jOiAoZHk6IFRlbnNvciwgc2F2ZWQ6IFRlbnNvcltdLCBhdHRyczogTmFtZWRBdHRyTWFwKSA9PiB7XG4gICAgY29uc3QgW3hdID0gc2F2ZWQ7XG4gICAgY29uc3Qge2F4aXMsIGV4Y2x1c2l2ZSwgcmV2ZXJzZX06IEN1bXN1bUF0dHJzID0gYXR0cnMgYXMge30gYXMgQ3Vtc3VtQXR0cnM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgeDogKCkgPT4ge1xuICAgICAgICBjb25zdCBwZXJtdXRhdGlvbiA9IGdldEF4ZXNQZXJtdXRhdGlvbihbYXhpc10sIHgucmFuayk7XG5cbiAgICAgICAgbGV0IG91dCA9IGN1bXN1bShkeSwgYXhpcywgZXhjbHVzaXZlLCAhcmV2ZXJzZSk7XG5cbiAgICAgICAgaWYgKHBlcm11dGF0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICBvdXQgPSB0cmFuc3Bvc2Uob3V0LCBwZXJtdXRhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG4iXX0=