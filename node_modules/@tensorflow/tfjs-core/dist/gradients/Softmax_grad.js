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
import { Softmax } from '../kernel_names';
import { mul } from '../ops/mul';
import { sub } from '../ops/sub';
import { sum } from '../ops/sum';
export const softmaxGradConfig = {
    kernelName: Softmax,
    outputsToSave: [true],
    gradFunc: (dy, saved, attrs) => {
        const [y] = saved;
        const { dim } = attrs;
        const keepDims = true;
        const dyTimesY = mul(dy, y);
        return {
            logits: () => sub(dyTimesY, mul(sum(dyTimesY, [dim], keepDims), y))
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU29mdG1heF9ncmFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9ncmFkaWVudHMvU29mdG1heF9ncmFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxPQUFPLEVBQWUsTUFBTSxpQkFBaUIsQ0FBQztBQUV0RCxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDL0IsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUcvQixNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBZTtJQUMzQyxVQUFVLEVBQUUsT0FBTztJQUNuQixhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDckIsUUFBUSxFQUFFLENBQUMsRUFBVSxFQUFFLEtBQWUsRUFBRSxLQUFtQixFQUFFLEVBQUU7UUFDN0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUNsQixNQUFNLEVBQUMsR0FBRyxFQUFDLEdBQUcsS0FBMkIsQ0FBQztRQUMxQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFFdEIsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1QixPQUFPO1lBQ0wsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNwRSxDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7U29mdG1heCwgU29mdG1heEF0dHJzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtHcmFkQ29uZmlnLCBOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge211bH0gZnJvbSAnLi4vb3BzL211bCc7XG5pbXBvcnQge3N1Yn0gZnJvbSAnLi4vb3BzL3N1Yic7XG5pbXBvcnQge3N1bX0gZnJvbSAnLi4vb3BzL3N1bSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcblxuZXhwb3J0IGNvbnN0IHNvZnRtYXhHcmFkQ29uZmlnOiBHcmFkQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBTb2Z0bWF4LFxuICBvdXRwdXRzVG9TYXZlOiBbdHJ1ZV0sXG4gIGdyYWRGdW5jOiAoZHk6IFRlbnNvciwgc2F2ZWQ6IFRlbnNvcltdLCBhdHRyczogTmFtZWRBdHRyTWFwKSA9PiB7XG4gICAgY29uc3QgW3ldID0gc2F2ZWQ7XG4gICAgY29uc3Qge2RpbX0gPSBhdHRycyBhcyB7fSBhcyBTb2Z0bWF4QXR0cnM7XG4gICAgY29uc3Qga2VlcERpbXMgPSB0cnVlO1xuXG4gICAgY29uc3QgZHlUaW1lc1kgPSBtdWwoZHksIHkpO1xuICAgIHJldHVybiB7XG4gICAgICBsb2dpdHM6ICgpID0+IHN1YihkeVRpbWVzWSwgbXVsKHN1bShkeVRpbWVzWSwgW2RpbV0sIGtlZXBEaW1zKSwgeSkpXG4gICAgfTtcbiAgfVxufTtcbiJdfQ==