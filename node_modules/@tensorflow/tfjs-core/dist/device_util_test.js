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
import * as device_util from './device_util';
import { ALL_ENVS, describeWithFlags } from './jasmine_util';
describeWithFlags('isMobile', ALL_ENVS, () => {
    it('should not fail when navigator is set', () => {
        expect(() => device_util.isMobile()).not.toThrow();
    });
    it('identifies react native as a mobile device', () => {
        expect(device_util.isMobile({ product: 'ReactNative' })).toEqual(true);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2aWNlX3V0aWxfdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvZGV2aWNlX3V0aWxfdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEtBQUssV0FBVyxNQUFNLGVBQWUsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0QsaUJBQWlCLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDM0MsRUFBRSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtRQUMvQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3JELENBQUMsQ0FBQyxDQUFDO0lBQ0gsRUFBRSxDQUFDLDRDQUE0QyxFQUFFLEdBQUcsRUFBRTtRQUNwRCxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FDekIsRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFjLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxRCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQgKiBhcyBkZXZpY2VfdXRpbCBmcm9tICcuL2RldmljZV91dGlsJztcbmltcG9ydCB7QUxMX0VOVlMsIGRlc2NyaWJlV2l0aEZsYWdzfSBmcm9tICcuL2phc21pbmVfdXRpbCc7XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCdpc01vYmlsZScsIEFMTF9FTlZTLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgbm90IGZhaWwgd2hlbiBuYXZpZ2F0b3IgaXMgc2V0JywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiBkZXZpY2VfdXRpbC5pc01vYmlsZSgpKS5ub3QudG9UaHJvdygpO1xuICB9KTtcbiAgaXQoJ2lkZW50aWZpZXMgcmVhY3QgbmF0aXZlIGFzIGEgbW9iaWxlIGRldmljZScsICgpID0+IHtcbiAgICBleHBlY3QoZGV2aWNlX3V0aWwuaXNNb2JpbGUoXG4gICAgICB7cHJvZHVjdDogJ1JlYWN0TmF0aXZlJ30gYXMgTmF2aWdhdG9yKSkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG59KTtcbiJdfQ==