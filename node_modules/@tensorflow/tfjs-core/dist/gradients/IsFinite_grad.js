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
import { IsFinite } from '../kernel_names';
import { zerosLike } from '../ops/zeros_like';
export const isFiniteGradConfig = {
    kernelName: IsFinite,
    gradFunc: (dy) => {
        // TODO(nsthorat): Let gradients be null for cases where we want to stop
        // backpropgation.
        return { x: () => zerosLike(dy) };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSXNGaW5pdGVfZ3JhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvZ3JhZGllbnRzL0lzRmluaXRlX2dyYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRXpDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUc1QyxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBZTtJQUM1QyxVQUFVLEVBQUUsUUFBUTtJQUNwQixRQUFRLEVBQUUsQ0FBQyxFQUFVLEVBQUUsRUFBRTtRQUN2Qix3RUFBd0U7UUFDeEUsa0JBQWtCO1FBQ2xCLE9BQU8sRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUM7SUFDbEMsQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7SXNGaW5pdGV9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge0dyYWRDb25maWd9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge3plcm9zTGlrZX0gZnJvbSAnLi4vb3BzL3plcm9zX2xpa2UnO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5cbmV4cG9ydCBjb25zdCBpc0Zpbml0ZUdyYWRDb25maWc6IEdyYWRDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IElzRmluaXRlLFxuICBncmFkRnVuYzogKGR5OiBUZW5zb3IpID0+IHtcbiAgICAvLyBUT0RPKG5zdGhvcmF0KTogTGV0IGdyYWRpZW50cyBiZSBudWxsIGZvciBjYXNlcyB3aGVyZSB3ZSB3YW50IHRvIHN0b3BcbiAgICAvLyBiYWNrcHJvcGdhdGlvbi5cbiAgICByZXR1cm4ge3g6ICgpID0+IHplcm9zTGlrZShkeSl9O1xuICB9XG59O1xuIl19