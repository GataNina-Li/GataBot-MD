/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
import { env } from '@tensorflow/tfjs-core';
import * as gpgpu_util from './gpgpu_util';
import * as webgl_util from './webgl_util';
export { MathBackendWebGL } from './backend_webgl';
export { setWebGLContext } from './canvas_util';
export { GPGPUContext } from './gpgpu_context';
// WebGL specific utils.
export { gpgpu_util, webgl_util };
/**
 * Enforce use of half precision textures if available on the platform.
 *
 * @doc {heading: 'Environment', namespace: 'webgl'}
 */
export function forceHalfFloat() {
    env().set('WEBGL_FORCE_F16_TEXTURES', true);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViZ2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL3dlYmdsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUUxQyxPQUFPLEtBQUssVUFBVSxNQUFNLGNBQWMsQ0FBQztBQUMzQyxPQUFPLEtBQUssVUFBVSxNQUFNLGNBQWMsQ0FBQztBQUUzQyxPQUFPLEVBQUMsZ0JBQWdCLEVBQW1DLE1BQU0saUJBQWlCLENBQUM7QUFDbkYsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFN0Msd0JBQXdCO0FBQ3hCLE9BQU8sRUFBQyxVQUFVLEVBQUUsVUFBVSxFQUFDLENBQUM7QUFFaEM7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxjQUFjO0lBQzVCLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM5QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2Vudn0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0ICogYXMgZ3BncHVfdXRpbCBmcm9tICcuL2dwZ3B1X3V0aWwnO1xuaW1wb3J0ICogYXMgd2ViZ2xfdXRpbCBmcm9tICcuL3dlYmdsX3V0aWwnO1xuXG5leHBvcnQge01hdGhCYWNrZW5kV2ViR0wsIFdlYkdMTWVtb3J5SW5mbywgV2ViR0xUaW1pbmdJbmZvfSBmcm9tICcuL2JhY2tlbmRfd2ViZ2wnO1xuZXhwb3J0IHtzZXRXZWJHTENvbnRleHR9IGZyb20gJy4vY2FudmFzX3V0aWwnO1xuZXhwb3J0IHtHUEdQVUNvbnRleHR9IGZyb20gJy4vZ3BncHVfY29udGV4dCc7XG5leHBvcnQge0dQR1BVUHJvZ3JhbX0gZnJvbSAnLi9ncGdwdV9tYXRoJztcbi8vIFdlYkdMIHNwZWNpZmljIHV0aWxzLlxuZXhwb3J0IHtncGdwdV91dGlsLCB3ZWJnbF91dGlsfTtcblxuLyoqXG4gKiBFbmZvcmNlIHVzZSBvZiBoYWxmIHByZWNpc2lvbiB0ZXh0dXJlcyBpZiBhdmFpbGFibGUgb24gdGhlIHBsYXRmb3JtLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdFbnZpcm9ubWVudCcsIG5hbWVzcGFjZTogJ3dlYmdsJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmNlSGFsZkZsb2F0KCk6IHZvaWQge1xuICBlbnYoKS5zZXQoJ1dFQkdMX0ZPUkNFX0YxNl9URVhUVVJFUycsIHRydWUpO1xufVxuIl19