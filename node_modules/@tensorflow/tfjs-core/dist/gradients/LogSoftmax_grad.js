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
import { LogSoftmax } from '../kernel_names';
import { exp } from '../ops/exp';
import { mul } from '../ops/mul';
import { sub } from '../ops/sub';
import { sum } from '../ops/sum';
export const logSoftmaxGradConfig = {
    kernelName: LogSoftmax,
    inputsToSave: [],
    outputsToSave: [true],
    gradFunc: (dy, saved, attrs) => {
        const [value] = saved;
        const { axis } = attrs;
        return {
            logits: () => {
                const keepDims = true;
                const softmax = exp(value);
                return sub(dy, mul(sum(dy, axis, keepDims), softmax));
            }
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9nU29mdG1heF9ncmFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9ncmFkaWVudHMvTG9nU29mdG1heF9ncmFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQWtCLE1BQU0saUJBQWlCLENBQUM7QUFFNUQsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUMvQixPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDL0IsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUcvQixNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBZTtJQUM5QyxVQUFVLEVBQUUsVUFBVTtJQUN0QixZQUFZLEVBQUUsRUFBRTtJQUNoQixhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDckIsUUFBUSxFQUFFLENBQUMsRUFBVSxFQUFFLEtBQWUsRUFBRSxLQUFtQixFQUFFLEVBQUU7UUFDN0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUN0QixNQUFNLEVBQUMsSUFBSSxFQUFDLEdBQUcsS0FBOEIsQ0FBQztRQUM5QyxPQUFPO1lBQ0wsTUFBTSxFQUFFLEdBQUcsRUFBRTtnQkFDWCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQ3RCLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDM0IsT0FBTyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3hELENBQUM7U0FDRixDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7TG9nU29mdG1heCwgTG9nU29mdG1heEF0dHJzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtHcmFkQ29uZmlnLCBOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge2V4cH0gZnJvbSAnLi4vb3BzL2V4cCc7XG5pbXBvcnQge211bH0gZnJvbSAnLi4vb3BzL211bCc7XG5pbXBvcnQge3N1Yn0gZnJvbSAnLi4vb3BzL3N1Yic7XG5pbXBvcnQge3N1bX0gZnJvbSAnLi4vb3BzL3N1bSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcblxuZXhwb3J0IGNvbnN0IGxvZ1NvZnRtYXhHcmFkQ29uZmlnOiBHcmFkQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBMb2dTb2Z0bWF4LFxuICBpbnB1dHNUb1NhdmU6IFtdLFxuICBvdXRwdXRzVG9TYXZlOiBbdHJ1ZV0sXG4gIGdyYWRGdW5jOiAoZHk6IFRlbnNvciwgc2F2ZWQ6IFRlbnNvcltdLCBhdHRyczogTmFtZWRBdHRyTWFwKSA9PiB7XG4gICAgY29uc3QgW3ZhbHVlXSA9IHNhdmVkO1xuICAgIGNvbnN0IHtheGlzfSA9IGF0dHJzIGFzIHt9IGFzIExvZ1NvZnRtYXhBdHRycztcbiAgICByZXR1cm4ge1xuICAgICAgbG9naXRzOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGtlZXBEaW1zID0gdHJ1ZTtcbiAgICAgICAgY29uc3Qgc29mdG1heCA9IGV4cCh2YWx1ZSk7XG4gICAgICAgIHJldHVybiBzdWIoZHksIG11bChzdW0oZHksIGF4aXMsIGtlZXBEaW1zKSwgc29mdG1heCkpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG4iXX0=