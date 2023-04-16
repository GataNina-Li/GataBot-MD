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
import { env } from './environment';
import * as base from './util_base';
export * from './util_base';
export * from './hash_util';
/**
 * Create typed array for scalar value. Used for storing in `DataStorage`.
 */
export function createScalarValue(value, dtype) {
    if (dtype === 'string') {
        return encodeString(value);
    }
    return toTypedArray([value], dtype);
}
function noConversionNeeded(a, dtype) {
    return (a instanceof Float32Array && dtype === 'float32') ||
        (a instanceof Int32Array && dtype === 'int32') ||
        (a instanceof Uint8Array && dtype === 'bool');
}
export function toTypedArray(a, dtype) {
    if (dtype === 'string') {
        throw new Error('Cannot convert a string[] to a TypedArray');
    }
    if (Array.isArray(a)) {
        a = base.flatten(a);
    }
    if (env().getBool('DEBUG')) {
        base.checkConversionForErrors(a, dtype);
    }
    if (noConversionNeeded(a, dtype)) {
        return a;
    }
    if (dtype == null || dtype === 'float32' || dtype === 'complex64') {
        return new Float32Array(a);
    }
    else if (dtype === 'int32') {
        return new Int32Array(a);
    }
    else if (dtype === 'bool') {
        const bool = new Uint8Array(a.length);
        for (let i = 0; i < bool.length; ++i) {
            if (Math.round(a[i]) !== 0) {
                bool[i] = 1;
            }
        }
        return bool;
    }
    else {
        throw new Error(`Unknown data type ${dtype}`);
    }
}
/**
 * Returns the current high-resolution time in milliseconds relative to an
 * arbitrary time in the past. It works across different platforms (node.js,
 * browsers).
 *
 * ```js
 * console.log(tf.util.now());
 * ```
 *
 * @doc {heading: 'Util', namespace: 'util'}
 */
export function now() {
    return env().platform.now();
}
/**
 * Returns a platform-specific implementation of
 * [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
 *
 * If `fetch` is defined on the global object (`window`, `process`, etc.),
 * `tf.util.fetch` returns that function.
 *
 * If not, `tf.util.fetch` returns a platform-specific solution.
 *
 * ```js
 * const resource = await tf.util.fetch('https://unpkg.com/@tensorflow/tfjs');
 * // handle response
 * ```
 *
 * @doc {heading: 'Util'}
 */
export function fetch(path, requestInits) {
    return env().platform.fetch(path, requestInits);
}
/**
 * Encodes the provided string into bytes using the provided encoding scheme.
 *
 * @param s The string to encode.
 * @param encoding The encoding scheme. Defaults to utf-8.
 *
 * @doc {heading: 'Util'}
 */
export function encodeString(s, encoding = 'utf-8') {
    encoding = encoding || 'utf-8';
    return env().platform.encode(s, encoding);
}
/**
 * Decodes the provided bytes into a string using the provided encoding scheme.
 * @param bytes The bytes to decode.
 *
 * @param encoding The encoding scheme. Defaults to utf-8.
 *
 * @doc {heading: 'Util'}
 */
export function decodeString(bytes, encoding = 'utf-8') {
    encoding = encoding || 'utf-8';
    return env().platform.decode(bytes, encoding);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRWxDLE9BQU8sS0FBSyxJQUFJLE1BQU0sYUFBYSxDQUFDO0FBQ3BDLGNBQWMsYUFBYSxDQUFDO0FBQzVCLGNBQWMsYUFBYSxDQUFDO0FBRTVCOztHQUVHO0FBQ0gsTUFBTSxVQUFVLGlCQUFpQixDQUM3QixLQUFlLEVBQUUsS0FBZTtJQUNsQyxJQUFJLEtBQUssS0FBSyxRQUFRLEVBQUU7UUFDdEIsT0FBTyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDNUI7SUFFRCxPQUFPLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3RDLENBQUM7QUFFRCxTQUFTLGtCQUFrQixDQUFDLENBQWEsRUFBRSxLQUFlO0lBQ3hELE9BQU8sQ0FBQyxDQUFDLFlBQVksWUFBWSxJQUFJLEtBQUssS0FBSyxTQUFTLENBQUM7UUFDckQsQ0FBQyxDQUFDLFlBQVksVUFBVSxJQUFJLEtBQUssS0FBSyxPQUFPLENBQUM7UUFDOUMsQ0FBQyxDQUFDLFlBQVksVUFBVSxJQUFJLEtBQUssS0FBSyxNQUFNLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBRUQsTUFBTSxVQUFVLFlBQVksQ0FBQyxDQUFhLEVBQUUsS0FBZTtJQUN6RCxJQUFJLEtBQUssS0FBSyxRQUFRLEVBQUU7UUFDdEIsTUFBTSxJQUFJLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0tBQzlEO0lBQ0QsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3BCLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3JCO0lBRUQsSUFBSSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDMUIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNyRDtJQUNELElBQUksa0JBQWtCLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxFQUFFO1FBQ2hDLE9BQU8sQ0FBZSxDQUFDO0tBQ3hCO0lBQ0QsSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLFdBQVcsRUFBRTtRQUNqRSxPQUFPLElBQUksWUFBWSxDQUFDLENBQWEsQ0FBQyxDQUFDO0tBQ3hDO1NBQU0sSUFBSSxLQUFLLEtBQUssT0FBTyxFQUFFO1FBQzVCLE9BQU8sSUFBSSxVQUFVLENBQUMsQ0FBYSxDQUFDLENBQUM7S0FDdEM7U0FBTSxJQUFJLEtBQUssS0FBSyxNQUFNLEVBQUU7UUFDM0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUUsQ0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ3BDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBRSxDQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3hDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDYjtTQUNGO1FBQ0QsT0FBTyxJQUFJLENBQUM7S0FDYjtTQUFNO1FBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUMvQztBQUNILENBQUM7QUFFRDs7Ozs7Ozs7OztHQVVHO0FBQ0gsTUFBTSxVQUFVLEdBQUc7SUFDakIsT0FBTyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDOUIsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE1BQU0sVUFBVSxLQUFLLENBQ2pCLElBQVksRUFBRSxZQUEwQjtJQUMxQyxPQUFPLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ2xELENBQUM7QUFFRDs7Ozs7OztHQU9HO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBQyxDQUFTLEVBQUUsUUFBUSxHQUFHLE9BQU87SUFDeEQsUUFBUSxHQUFHLFFBQVEsSUFBSSxPQUFPLENBQUM7SUFDL0IsT0FBTyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNILE1BQU0sVUFBVSxZQUFZLENBQUMsS0FBaUIsRUFBRSxRQUFRLEdBQUcsT0FBTztJQUNoRSxRQUFRLEdBQUcsUUFBUSxJQUFJLE9BQU8sQ0FBQztJQUMvQixPQUFPLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ2hELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7ZW52fSBmcm9tICcuL2Vudmlyb25tZW50JztcbmltcG9ydCB7QmFja2VuZFZhbHVlcywgRGF0YVR5cGUsIFRlbnNvckxpa2UsIFR5cGVkQXJyYXl9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0ICogYXMgYmFzZSBmcm9tICcuL3V0aWxfYmFzZSc7XG5leHBvcnQgKiBmcm9tICcuL3V0aWxfYmFzZSc7XG5leHBvcnQgKiBmcm9tICcuL2hhc2hfdXRpbCc7XG5cbi8qKlxuICogQ3JlYXRlIHR5cGVkIGFycmF5IGZvciBzY2FsYXIgdmFsdWUuIFVzZWQgZm9yIHN0b3JpbmcgaW4gYERhdGFTdG9yYWdlYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNjYWxhclZhbHVlKFxuICAgIHZhbHVlOiBEYXRhVHlwZSwgZHR5cGU6IERhdGFUeXBlKTogQmFja2VuZFZhbHVlcyB7XG4gIGlmIChkdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZW5jb2RlU3RyaW5nKHZhbHVlKTtcbiAgfVxuXG4gIHJldHVybiB0b1R5cGVkQXJyYXkoW3ZhbHVlXSwgZHR5cGUpO1xufVxuXG5mdW5jdGlvbiBub0NvbnZlcnNpb25OZWVkZWQoYTogVGVuc29yTGlrZSwgZHR5cGU6IERhdGFUeXBlKTogYm9vbGVhbiB7XG4gIHJldHVybiAoYSBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSAmJiBkdHlwZSA9PT0gJ2Zsb2F0MzInKSB8fFxuICAgICAgKGEgaW5zdGFuY2VvZiBJbnQzMkFycmF5ICYmIGR0eXBlID09PSAnaW50MzInKSB8fFxuICAgICAgKGEgaW5zdGFuY2VvZiBVaW50OEFycmF5ICYmIGR0eXBlID09PSAnYm9vbCcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9UeXBlZEFycmF5KGE6IFRlbnNvckxpa2UsIGR0eXBlOiBEYXRhVHlwZSk6IFR5cGVkQXJyYXkge1xuICBpZiAoZHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY29udmVydCBhIHN0cmluZ1tdIHRvIGEgVHlwZWRBcnJheScpO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KGEpKSB7XG4gICAgYSA9IGJhc2UuZmxhdHRlbihhKTtcbiAgfVxuXG4gIGlmIChlbnYoKS5nZXRCb29sKCdERUJVRycpKSB7XG4gICAgYmFzZS5jaGVja0NvbnZlcnNpb25Gb3JFcnJvcnMoYSBhcyBudW1iZXJbXSwgZHR5cGUpO1xuICB9XG4gIGlmIChub0NvbnZlcnNpb25OZWVkZWQoYSwgZHR5cGUpKSB7XG4gICAgcmV0dXJuIGEgYXMgVHlwZWRBcnJheTtcbiAgfVxuICBpZiAoZHR5cGUgPT0gbnVsbCB8fCBkdHlwZSA9PT0gJ2Zsb2F0MzInIHx8IGR0eXBlID09PSAnY29tcGxleDY0Jykge1xuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KGEgYXMgbnVtYmVyW10pO1xuICB9IGVsc2UgaWYgKGR0eXBlID09PSAnaW50MzInKSB7XG4gICAgcmV0dXJuIG5ldyBJbnQzMkFycmF5KGEgYXMgbnVtYmVyW10pO1xuICB9IGVsc2UgaWYgKGR0eXBlID09PSAnYm9vbCcpIHtcbiAgICBjb25zdCBib29sID0gbmV3IFVpbnQ4QXJyYXkoKGEgYXMgbnVtYmVyW10pLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBib29sLmxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoTWF0aC5yb3VuZCgoYSBhcyBudW1iZXJbXSlbaV0pICE9PSAwKSB7XG4gICAgICAgIGJvb2xbaV0gPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYm9vbDtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gZGF0YSB0eXBlICR7ZHR5cGV9YCk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBjdXJyZW50IGhpZ2gtcmVzb2x1dGlvbiB0aW1lIGluIG1pbGxpc2Vjb25kcyByZWxhdGl2ZSB0byBhblxuICogYXJiaXRyYXJ5IHRpbWUgaW4gdGhlIHBhc3QuIEl0IHdvcmtzIGFjcm9zcyBkaWZmZXJlbnQgcGxhdGZvcm1zIChub2RlLmpzLFxuICogYnJvd3NlcnMpLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zb2xlLmxvZyh0Zi51dGlsLm5vdygpKTtcbiAqIGBgYFxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdVdGlsJywgbmFtZXNwYWNlOiAndXRpbCd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3coKTogbnVtYmVyIHtcbiAgcmV0dXJuIGVudigpLnBsYXRmb3JtLm5vdygpO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBwbGF0Zm9ybS1zcGVjaWZpYyBpbXBsZW1lbnRhdGlvbiBvZlxuICogW2BmZXRjaGBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9GZXRjaF9BUEkpLlxuICpcbiAqIElmIGBmZXRjaGAgaXMgZGVmaW5lZCBvbiB0aGUgZ2xvYmFsIG9iamVjdCAoYHdpbmRvd2AsIGBwcm9jZXNzYCwgZXRjLiksXG4gKiBgdGYudXRpbC5mZXRjaGAgcmV0dXJucyB0aGF0IGZ1bmN0aW9uLlxuICpcbiAqIElmIG5vdCwgYHRmLnV0aWwuZmV0Y2hgIHJldHVybnMgYSBwbGF0Zm9ybS1zcGVjaWZpYyBzb2x1dGlvbi5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgcmVzb3VyY2UgPSBhd2FpdCB0Zi51dGlsLmZldGNoKCdodHRwczovL3VucGtnLmNvbS9AdGVuc29yZmxvdy90ZmpzJyk7XG4gKiAvLyBoYW5kbGUgcmVzcG9uc2VcbiAqIGBgYFxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdVdGlsJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZldGNoKFxuICAgIHBhdGg6IHN0cmluZywgcmVxdWVzdEluaXRzPzogUmVxdWVzdEluaXQpOiBQcm9taXNlPFJlc3BvbnNlPiB7XG4gIHJldHVybiBlbnYoKS5wbGF0Zm9ybS5mZXRjaChwYXRoLCByZXF1ZXN0SW5pdHMpO1xufVxuXG4vKipcbiAqIEVuY29kZXMgdGhlIHByb3ZpZGVkIHN0cmluZyBpbnRvIGJ5dGVzIHVzaW5nIHRoZSBwcm92aWRlZCBlbmNvZGluZyBzY2hlbWUuXG4gKlxuICogQHBhcmFtIHMgVGhlIHN0cmluZyB0byBlbmNvZGUuXG4gKiBAcGFyYW0gZW5jb2RpbmcgVGhlIGVuY29kaW5nIHNjaGVtZS4gRGVmYXVsdHMgdG8gdXRmLTguXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ1V0aWwnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZW5jb2RlU3RyaW5nKHM6IHN0cmluZywgZW5jb2RpbmcgPSAndXRmLTgnKTogVWludDhBcnJheSB7XG4gIGVuY29kaW5nID0gZW5jb2RpbmcgfHwgJ3V0Zi04JztcbiAgcmV0dXJuIGVudigpLnBsYXRmb3JtLmVuY29kZShzLCBlbmNvZGluZyk7XG59XG5cbi8qKlxuICogRGVjb2RlcyB0aGUgcHJvdmlkZWQgYnl0ZXMgaW50byBhIHN0cmluZyB1c2luZyB0aGUgcHJvdmlkZWQgZW5jb2Rpbmcgc2NoZW1lLlxuICogQHBhcmFtIGJ5dGVzIFRoZSBieXRlcyB0byBkZWNvZGUuXG4gKlxuICogQHBhcmFtIGVuY29kaW5nIFRoZSBlbmNvZGluZyBzY2hlbWUuIERlZmF1bHRzIHRvIHV0Zi04LlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdVdGlsJ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlY29kZVN0cmluZyhieXRlczogVWludDhBcnJheSwgZW5jb2RpbmcgPSAndXRmLTgnKTogc3RyaW5nIHtcbiAgZW5jb2RpbmcgPSBlbmNvZGluZyB8fCAndXRmLTgnO1xuICByZXR1cm4gZW52KCkucGxhdGZvcm0uZGVjb2RlKGJ5dGVzLCBlbmNvZGluZyk7XG59XG4iXX0=