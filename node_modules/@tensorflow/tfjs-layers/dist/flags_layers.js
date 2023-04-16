/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
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
import { updateCacheMaxEntries } from './engine/executor';
export const ENV = env();
/** The max number of entries for the caches of layers' topological sort. */
ENV.registerFlag('TOPOLOGICAL_SORT_CACHE_MAX_ENTRIES', () => 100, updateCacheMaxEntries);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhZ3NfbGF5ZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1sYXllcnMvc3JjL2ZsYWdzX2xheWVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFMUMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFeEQsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBRXpCLDRFQUE0RTtBQUM1RSxHQUFHLENBQUMsWUFBWSxDQUNaLG9DQUFvQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjIgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2Vudn0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHt1cGRhdGVDYWNoZU1heEVudHJpZXN9IGZyb20gJy4vZW5naW5lL2V4ZWN1dG9yJztcblxuZXhwb3J0IGNvbnN0IEVOViA9IGVudigpO1xuXG4vKiogVGhlIG1heCBudW1iZXIgb2YgZW50cmllcyBmb3IgdGhlIGNhY2hlcyBvZiBsYXllcnMnIHRvcG9sb2dpY2FsIHNvcnQuICovXG5FTlYucmVnaXN0ZXJGbGFnKFxuICAgICdUT1BPTE9HSUNBTF9TT1JUX0NBQ0hFX01BWF9FTlRSSUVTJywgKCkgPT4gMTAwLCB1cGRhdGVDYWNoZU1heEVudHJpZXMpO1xuIl19