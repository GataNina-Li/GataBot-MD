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
// tslint:disable-next-line: no-imports-from-dist
import { registerTestEnv } from '@tensorflow/tfjs-core/dist/jasmine_util';
export const WEBGL_ENVS = {
    predicate: testEnv => testEnv.backendName === 'webgl'
};
export const PACKED_ENVS = {
    flags: { 'WEBGL_PACK': true }
};
export function registerTestEnvs() {
    registerTestEnv({
        name: 'webgl1',
        backendName: 'webgl',
        flags: {
            'WEBGL_VERSION': 1,
            'WEBGL_CPU_FORWARD': false,
            'WEBGL_SIZE_UPLOAD_UNIFORM': 0
        },
        isDataSync: true
    });
    registerTestEnv({
        name: 'webgl2',
        backendName: 'webgl',
        flags: {
            'WEBGL_VERSION': 2,
            'WEBGL_CPU_FORWARD': false,
            'WEBGL_SIZE_UPLOAD_UNIFORM': 0
        },
        isDataSync: true
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2VuZF93ZWJnbF90ZXN0X3JlZ2lzdHJ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9iYWNrZW5kX3dlYmdsX3Rlc3RfcmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsaURBQWlEO0FBQ2pELE9BQU8sRUFBYyxlQUFlLEVBQUMsTUFBTSx5Q0FBeUMsQ0FBQztBQUVyRixNQUFNLENBQUMsTUFBTSxVQUFVLEdBQWdCO0lBQ3JDLFNBQVMsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEtBQUssT0FBTztDQUN0RCxDQUFDO0FBQ0YsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFnQjtJQUN0QyxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsSUFBSSxFQUFDO0NBQzVCLENBQUM7QUFFRixNQUFNLFVBQVUsZ0JBQWdCO0lBQzlCLGVBQWUsQ0FBQztRQUNkLElBQUksRUFBRSxRQUFRO1FBQ2QsV0FBVyxFQUFFLE9BQU87UUFDcEIsS0FBSyxFQUFFO1lBQ0wsZUFBZSxFQUFFLENBQUM7WUFDbEIsbUJBQW1CLEVBQUUsS0FBSztZQUMxQiwyQkFBMkIsRUFBRSxDQUFDO1NBQy9CO1FBQ0QsVUFBVSxFQUFFLElBQUk7S0FDakIsQ0FBQyxDQUFDO0lBRUgsZUFBZSxDQUFDO1FBQ2QsSUFBSSxFQUFFLFFBQVE7UUFDZCxXQUFXLEVBQUUsT0FBTztRQUNwQixLQUFLLEVBQUU7WUFDTCxlQUFlLEVBQUUsQ0FBQztZQUNsQixtQkFBbUIsRUFBRSxLQUFLO1lBQzFCLDJCQUEyQixFQUFFLENBQUM7U0FDL0I7UUFDRCxVQUFVLEVBQUUsSUFBSTtLQUNqQixDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLWltcG9ydHMtZnJvbS1kaXN0XG5pbXBvcnQge0NvbnN0cmFpbnRzLCByZWdpc3RlclRlc3RFbnZ9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZS9kaXN0L2phc21pbmVfdXRpbCc7XG5cbmV4cG9ydCBjb25zdCBXRUJHTF9FTlZTOiBDb25zdHJhaW50cyA9IHtcbiAgcHJlZGljYXRlOiB0ZXN0RW52ID0+IHRlc3RFbnYuYmFja2VuZE5hbWUgPT09ICd3ZWJnbCdcbn07XG5leHBvcnQgY29uc3QgUEFDS0VEX0VOVlM6IENvbnN0cmFpbnRzID0ge1xuICBmbGFnczogeydXRUJHTF9QQUNLJzogdHJ1ZX1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlclRlc3RFbnZzKCkge1xuICByZWdpc3RlclRlc3RFbnYoe1xuICAgIG5hbWU6ICd3ZWJnbDEnLFxuICAgIGJhY2tlbmROYW1lOiAnd2ViZ2wnLFxuICAgIGZsYWdzOiB7XG4gICAgICAnV0VCR0xfVkVSU0lPTic6IDEsXG4gICAgICAnV0VCR0xfQ1BVX0ZPUldBUkQnOiBmYWxzZSxcbiAgICAgICdXRUJHTF9TSVpFX1VQTE9BRF9VTklGT1JNJzogMFxuICAgIH0sXG4gICAgaXNEYXRhU3luYzogdHJ1ZVxuICB9KTtcblxuICByZWdpc3RlclRlc3RFbnYoe1xuICAgIG5hbWU6ICd3ZWJnbDInLFxuICAgIGJhY2tlbmROYW1lOiAnd2ViZ2wnLFxuICAgIGZsYWdzOiB7XG4gICAgICAnV0VCR0xfVkVSU0lPTic6IDIsXG4gICAgICAnV0VCR0xfQ1BVX0ZPUldBUkQnOiBmYWxzZSxcbiAgICAgICdXRUJHTF9TSVpFX1VQTE9BRF9VTklGT1JNJzogMFxuICAgIH0sXG4gICAgaXNEYXRhU3luYzogdHJ1ZVxuICB9KTtcbn1cbiJdfQ==