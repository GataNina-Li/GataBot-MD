/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
import * as tf from './index';
import { ALL_ENVS, describeWithFlags } from './jasmine_util';
describeWithFlags('nextFrame', ALL_ENVS, () => {
    it('basic usage', async () => {
        const t0 = tf.util.now();
        await tf.nextFrame();
        const t1 = tf.util.now();
        // tf.util.now should give sufficient accuracy on all supported envs.
        expect(t1).toBeGreaterThan(t0);
    });
    it('does not block timers', async () => {
        let flag = false;
        setTimeout(() => {
            flag = true;
        }, 50);
        const t0 = tf.util.now();
        expect(flag).toBe(false);
        while (tf.util.now() - t0 < 1000 && !flag) {
            await tf.nextFrame();
        }
        expect(flag).toBe(true);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlcl91dGlsX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2Jyb3dzZXJfdXRpbF90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sS0FBSyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQzlCLE9BQU8sRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUzRCxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUM1QyxFQUFFLENBQUMsYUFBYSxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzNCLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDekIsTUFBTSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDckIsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN6QixxRUFBcUU7UUFDckUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx1QkFBdUIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNyQyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUM7UUFDakIsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNkLElBQUksR0FBRyxJQUFJLENBQUM7UUFDZCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDUCxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDekMsTUFBTSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDdEI7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAqIGFzIHRmIGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IHtBTExfRU5WUywgZGVzY3JpYmVXaXRoRmxhZ3N9IGZyb20gJy4vamFzbWluZV91dGlsJztcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ25leHRGcmFtZScsIEFMTF9FTlZTLCAoKSA9PiB7XG4gIGl0KCdiYXNpYyB1c2FnZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB0MCA9IHRmLnV0aWwubm93KCk7XG4gICAgYXdhaXQgdGYubmV4dEZyYW1lKCk7XG4gICAgY29uc3QgdDEgPSB0Zi51dGlsLm5vdygpO1xuICAgIC8vIHRmLnV0aWwubm93IHNob3VsZCBnaXZlIHN1ZmZpY2llbnQgYWNjdXJhY3kgb24gYWxsIHN1cHBvcnRlZCBlbnZzLlxuICAgIGV4cGVjdCh0MSkudG9CZUdyZWF0ZXJUaGFuKHQwKTtcbiAgfSk7XG5cbiAgaXQoJ2RvZXMgbm90IGJsb2NrIHRpbWVycycsIGFzeW5jICgpID0+IHtcbiAgICBsZXQgZmxhZyA9IGZhbHNlO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZmxhZyA9IHRydWU7XG4gICAgfSwgNTApO1xuICAgIGNvbnN0IHQwID0gdGYudXRpbC5ub3coKTtcbiAgICBleHBlY3QoZmxhZykudG9CZShmYWxzZSk7XG4gICAgd2hpbGUgKHRmLnV0aWwubm93KCkgLSB0MCA8IDEwMDAgJiYgIWZsYWcpIHtcbiAgICAgIGF3YWl0IHRmLm5leHRGcmFtZSgpO1xuICAgIH1cbiAgICBleHBlY3QoZmxhZykudG9CZSh0cnVlKTtcbiAgfSk7XG59KTtcbiJdfQ==