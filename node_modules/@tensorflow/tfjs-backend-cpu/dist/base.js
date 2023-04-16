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
/*
 * base.ts contains all the exports from tfjs-backend-cpu
 * without auto-kernel registration
 */
import { registerBackend } from '@tensorflow/tfjs-core';
import { MathBackendCPU } from './backend_cpu';
import * as shared from './shared';
export { MathBackendCPU } from './backend_cpu';
export { version as version_cpu } from './version';
export { shared };
// Side effects for default initialization of MathBackendCPU
registerBackend('cpu', () => new MathBackendCPU(), 1 /* priority */);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC1jcHUvc3JjL2Jhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUg7OztHQUdHO0FBQ0gsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3RELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDN0MsT0FBTyxLQUFLLE1BQU0sTUFBTSxVQUFVLENBQUM7QUFFbkMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM3QyxPQUFPLEVBQUMsT0FBTyxJQUFJLFdBQVcsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqRCxPQUFPLEVBQUMsTUFBTSxFQUFDLENBQUM7QUFFaEIsNERBQTREO0FBQzVELGVBQWUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxjQUFjLEVBQUUsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbi8qXG4gKiBiYXNlLnRzIGNvbnRhaW5zIGFsbCB0aGUgZXhwb3J0cyBmcm9tIHRmanMtYmFja2VuZC1jcHVcbiAqIHdpdGhvdXQgYXV0by1rZXJuZWwgcmVnaXN0cmF0aW9uXG4gKi9cbmltcG9ydCB7cmVnaXN0ZXJCYWNrZW5kfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0IHtNYXRoQmFja2VuZENQVX0gZnJvbSAnLi9iYWNrZW5kX2NwdSc7XG5pbXBvcnQgKiBhcyBzaGFyZWQgZnJvbSAnLi9zaGFyZWQnO1xuXG5leHBvcnQge01hdGhCYWNrZW5kQ1BVfSBmcm9tICcuL2JhY2tlbmRfY3B1JztcbmV4cG9ydCB7dmVyc2lvbiBhcyB2ZXJzaW9uX2NwdX0gZnJvbSAnLi92ZXJzaW9uJztcbmV4cG9ydCB7c2hhcmVkfTtcblxuLy8gU2lkZSBlZmZlY3RzIGZvciBkZWZhdWx0IGluaXRpYWxpemF0aW9uIG9mIE1hdGhCYWNrZW5kQ1BVXG5yZWdpc3RlckJhY2tlbmQoJ2NwdScsICgpID0+IG5ldyBNYXRoQmFja2VuZENQVSgpLCAxIC8qIHByaW9yaXR5ICovKTtcbiJdfQ==