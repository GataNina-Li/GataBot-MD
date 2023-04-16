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
// Required side effectful code for tfjs-core
// Set up Engine and ENV
import { getOrMakeEngine } from './engine';
getOrMakeEngine();
// Register backend-agnostic flags.
import './flags';
// Register platforms
import './platforms/platform_browser';
import './platforms/platform_node';
// Set up OpHandler
import { buffer } from './ops/buffer';
import { cast } from './ops/cast';
import { clone } from './ops/clone';
import { print } from './ops/print';
import { setOpHandler } from './tensor';
const opHandler = {
    buffer,
    cast,
    clone,
    print
};
setOpHandler(opHandler);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZV9zaWRlX2VmZmVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2Jhc2Vfc2lkZV9lZmZlY3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILDZDQUE2QztBQUU3Qyx3QkFBd0I7QUFDeEIsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUN6QyxlQUFlLEVBQUUsQ0FBQztBQUVsQixtQ0FBbUM7QUFDbkMsT0FBTyxTQUFTLENBQUM7QUFDakIscUJBQXFCO0FBQ3JCLE9BQU8sOEJBQThCLENBQUM7QUFDdEMsT0FBTywyQkFBMkIsQ0FBQztBQUVuQyxtQkFBbUI7QUFDbkIsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUNwQyxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ2hDLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDbEMsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUNsQyxPQUFPLEVBQVksWUFBWSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ2pELE1BQU0sU0FBUyxHQUFjO0lBQzNCLE1BQU07SUFDTixJQUFJO0lBQ0osS0FBSztJQUNMLEtBQUs7Q0FDTixDQUFDO0FBQ0YsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG4vLyBSZXF1aXJlZCBzaWRlIGVmZmVjdGZ1bCBjb2RlIGZvciB0ZmpzLWNvcmVcblxuLy8gU2V0IHVwIEVuZ2luZSBhbmQgRU5WXG5pbXBvcnQge2dldE9yTWFrZUVuZ2luZX0gZnJvbSAnLi9lbmdpbmUnO1xuZ2V0T3JNYWtlRW5naW5lKCk7XG5cbi8vIFJlZ2lzdGVyIGJhY2tlbmQtYWdub3N0aWMgZmxhZ3MuXG5pbXBvcnQgJy4vZmxhZ3MnO1xuLy8gUmVnaXN0ZXIgcGxhdGZvcm1zXG5pbXBvcnQgJy4vcGxhdGZvcm1zL3BsYXRmb3JtX2Jyb3dzZXInO1xuaW1wb3J0ICcuL3BsYXRmb3Jtcy9wbGF0Zm9ybV9ub2RlJztcblxuLy8gU2V0IHVwIE9wSGFuZGxlclxuaW1wb3J0IHtidWZmZXJ9IGZyb20gJy4vb3BzL2J1ZmZlcic7XG5pbXBvcnQge2Nhc3R9IGZyb20gJy4vb3BzL2Nhc3QnO1xuaW1wb3J0IHtjbG9uZX0gZnJvbSAnLi9vcHMvY2xvbmUnO1xuaW1wb3J0IHtwcmludH0gZnJvbSAnLi9vcHMvcHJpbnQnO1xuaW1wb3J0IHtPcEhhbmRsZXIsIHNldE9wSGFuZGxlcn0gZnJvbSAnLi90ZW5zb3InO1xuY29uc3Qgb3BIYW5kbGVyOiBPcEhhbmRsZXIgPSB7XG4gIGJ1ZmZlcixcbiAgY2FzdCxcbiAgY2xvbmUsXG4gIHByaW50XG59O1xuc2V0T3BIYW5kbGVyKG9wSGFuZGxlcik7XG4iXX0=