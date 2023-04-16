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
import { Ceil } from '../kernel_names';
import { zerosLike } from '../ops/zeros_like';
export const ceilGradConfig = {
    kernelName: Ceil,
    gradFunc: (dy) => {
        // TODO(manrajgrover): Return null for gradients when backprop supports it.
        return { x: () => zerosLike(dy) };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2VpbF9ncmFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9ncmFkaWVudHMvQ2VpbF9ncmFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUVyQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFHNUMsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFlO0lBQ3hDLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFFBQVEsRUFBRSxDQUFDLEVBQVUsRUFBRSxFQUFFO1FBQ3ZCLDJFQUEyRTtRQUMzRSxPQUFPLEVBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDO0lBQ2xDLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0NlaWx9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge0dyYWRDb25maWd9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge3plcm9zTGlrZX0gZnJvbSAnLi4vb3BzL3plcm9zX2xpa2UnO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5cbmV4cG9ydCBjb25zdCBjZWlsR3JhZENvbmZpZzogR3JhZENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogQ2VpbCxcbiAgZ3JhZEZ1bmM6IChkeTogVGVuc29yKSA9PiB7XG4gICAgLy8gVE9ETyhtYW5yYWpncm92ZXIpOiBSZXR1cm4gbnVsbCBmb3IgZ3JhZGllbnRzIHdoZW4gYmFja3Byb3Agc3VwcG9ydHMgaXQuXG4gICAgcmV0dXJuIHt4OiAoKSA9PiB6ZXJvc0xpa2UoZHkpfTtcbiAgfVxufTtcbiJdfQ==