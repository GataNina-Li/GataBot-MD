/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
const delayCallback = (() => {
    if (typeof requestAnimationFrame !== 'undefined') {
        return requestAnimationFrame;
    }
    else if (typeof setImmediate !== 'undefined') {
        return setImmediate;
    }
    return (f) => f(); // no delays
})();
/**
 * Returns a promise that resolves when a requestAnimationFrame has completed.
 *
 * On Node.js this uses setImmediate instead of requestAnimationFrame.
 *
 * This is simply a sugar method so that users can do the following:
 * `await tf.nextFrame();`
 *
 * @doc {heading: 'Performance', subheading: 'Timing'}
 */
function nextFrame() {
    return new Promise(resolve => delayCallback(() => resolve()));
}
export { nextFrame };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlcl91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9icm93c2VyX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsTUFBTSxhQUFhLEdBQWEsQ0FBQyxHQUFHLEVBQUU7SUFDcEMsSUFBSSxPQUFPLHFCQUFxQixLQUFLLFdBQVcsRUFBRTtRQUNoRCxPQUFPLHFCQUFxQixDQUFDO0tBQzlCO1NBQU0sSUFBSSxPQUFPLFlBQVksS0FBSyxXQUFXLEVBQUU7UUFDOUMsT0FBTyxZQUFZLENBQUM7S0FDckI7SUFDRCxPQUFPLENBQUMsQ0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFFLFlBQVk7QUFDNUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUVMOzs7Ozs7Ozs7R0FTRztBQUNILFNBQVMsU0FBUztJQUNoQixPQUFPLElBQUksT0FBTyxDQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0RSxDQUFDO0FBRUQsT0FBTyxFQUFDLFNBQVMsRUFBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5jb25zdCBkZWxheUNhbGxiYWNrOiBGdW5jdGlvbiA9ICgoKSA9PiB7XG4gIGlmICh0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiByZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHNldEltbWVkaWF0ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gc2V0SW1tZWRpYXRlO1xuICB9XG4gIHJldHVybiAoZjogRnVuY3Rpb24pID0+IGYoKTsgIC8vIG5vIGRlbGF5c1xufSkoKTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gYSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgaGFzIGNvbXBsZXRlZC5cbiAqXG4gKiBPbiBOb2RlLmpzIHRoaXMgdXNlcyBzZXRJbW1lZGlhdGUgaW5zdGVhZCBvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUuXG4gKlxuICogVGhpcyBpcyBzaW1wbHkgYSBzdWdhciBtZXRob2Qgc28gdGhhdCB1c2VycyBjYW4gZG8gdGhlIGZvbGxvd2luZzpcbiAqIGBhd2FpdCB0Zi5uZXh0RnJhbWUoKTtgXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ1BlcmZvcm1hbmNlJywgc3ViaGVhZGluZzogJ1RpbWluZyd9XG4gKi9cbmZ1bmN0aW9uIG5leHRGcmFtZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KHJlc29sdmUgPT4gZGVsYXlDYWxsYmFjaygoKSA9PiByZXNvbHZlKCkpKTtcbn1cblxuZXhwb3J0IHtuZXh0RnJhbWV9O1xuIl19