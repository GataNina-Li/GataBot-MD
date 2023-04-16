/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
// base.ts is the webgl backend without auto kernel registration.
import { device_util, registerBackend } from '@tensorflow/tfjs-core';
import { MathBackendWebGL } from './backend_webgl';
export { version as version_webgl } from './version';
if (device_util.isBrowser()) {
    registerBackend('webgl', () => new MathBackendWebGL(), 2 /* priority */);
}
// Export webgl utilities
export * from './webgl';
// Export forceHalfFlost under webgl namespace for the union bundle.
import { forceHalfFloat } from './webgl';
export const webgl = { forceHalfFloat };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxpRUFBaUU7QUFFakUsT0FBTyxFQUFDLFdBQVcsRUFBRSxlQUFlLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNuRSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsT0FBTyxJQUFJLGFBQWEsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUVuRCxJQUFJLFdBQVcsQ0FBQyxTQUFTLEVBQUUsRUFBRTtJQUMzQixlQUFlLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7Q0FDMUU7QUFFRCx5QkFBeUI7QUFDekIsY0FBYyxTQUFTLENBQUM7QUFFeEIsb0VBQW9FO0FBQ3BFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDdkMsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUMsY0FBYyxFQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbi8vIGJhc2UudHMgaXMgdGhlIHdlYmdsIGJhY2tlbmQgd2l0aG91dCBhdXRvIGtlcm5lbCByZWdpc3RyYXRpb24uXG5cbmltcG9ydCB7ZGV2aWNlX3V0aWwsIHJlZ2lzdGVyQmFja2VuZH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbmltcG9ydCB7TWF0aEJhY2tlbmRXZWJHTH0gZnJvbSAnLi9iYWNrZW5kX3dlYmdsJztcbmV4cG9ydCB7dmVyc2lvbiBhcyB2ZXJzaW9uX3dlYmdsfSBmcm9tICcuL3ZlcnNpb24nO1xuXG5pZiAoZGV2aWNlX3V0aWwuaXNCcm93c2VyKCkpIHtcbiAgcmVnaXN0ZXJCYWNrZW5kKCd3ZWJnbCcsICgpID0+IG5ldyBNYXRoQmFja2VuZFdlYkdMKCksIDIgLyogcHJpb3JpdHkgKi8pO1xufVxuXG4vLyBFeHBvcnQgd2ViZ2wgdXRpbGl0aWVzXG5leHBvcnQgKiBmcm9tICcuL3dlYmdsJztcblxuLy8gRXhwb3J0IGZvcmNlSGFsZkZsb3N0IHVuZGVyIHdlYmdsIG5hbWVzcGFjZSBmb3IgdGhlIHVuaW9uIGJ1bmRsZS5cbmltcG9ydCB7Zm9yY2VIYWxmRmxvYXR9IGZyb20gJy4vd2ViZ2wnO1xuZXhwb3J0IGNvbnN0IHdlYmdsID0ge2ZvcmNlSGFsZkZsb2F0fTtcbiJdfQ==