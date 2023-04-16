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
 *
 * =============================================================================
 */
import { util } from '@tensorflow/tfjs-core';
import { FileChunkIterator } from './file_chunk_iterator';
/**
 * Provide a stream of chunks from a URL.
 *
 * Note this class first downloads the entire file into memory before providing
 * the first element from the stream.  This is because the Fetch API does not
 * yet reliably provide a reader stream for the response body.
 */
export async function urlChunkIterator(url, options = {}, fetchFunc) {
    let urlString;
    let requestInit;
    if ((typeof url) === 'string') {
        urlString = url;
    }
    else {
        urlString = url.url;
        requestInit = getRequestInitFromRequest(url);
    }
    const response = await (fetchFunc || util.fetch)(urlString, requestInit);
    if (response.ok) {
        const uint8Array = new Uint8Array(await response.arrayBuffer());
        return new FileChunkIterator(uint8Array, options);
    }
    else {
        throw new Error(response.statusText);
    }
}
// Generate RequestInit from Request to match tf.util.fetch signature.
const getRequestInitFromRequest = (request) => {
    const init = {
        method: request.method,
        headers: request.headers,
        body: request.body,
        mode: request.mode,
        credentials: request.credentials,
        cache: request.cache,
        redirect: request.redirect,
        referrer: request.referrer,
        integrity: request.integrity,
    };
    return init;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX2NodW5rX2l0ZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1kYXRhL3NyYy9pdGVyYXRvcnMvdXJsX2NodW5rX2l0ZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBRUgsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzNDLE9BQU8sRUFBQyxpQkFBaUIsRUFBMkIsTUFBTSx1QkFBdUIsQ0FBQztBQUVsRjs7Ozs7O0dBTUc7QUFDSCxNQUFNLENBQUMsS0FBSyxVQUFVLGdCQUFnQixDQUNsQyxHQUFnQixFQUFFLFVBQW9DLEVBQUUsRUFDeEQsU0FBb0I7SUFDdEIsSUFBSSxTQUFTLENBQUM7SUFDZCxJQUFJLFdBQVcsQ0FBQztJQUNoQixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsS0FBSyxRQUFRLEVBQUU7UUFDN0IsU0FBUyxHQUFHLEdBQWEsQ0FBQztLQUMzQjtTQUFNO1FBQ0wsU0FBUyxHQUFJLEdBQWUsQ0FBQyxHQUFHLENBQUM7UUFDakMsV0FBVyxHQUFHLHlCQUF5QixDQUFDLEdBQWMsQ0FBQyxDQUFDO0tBQ3pEO0lBQ0QsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3pFLElBQUksUUFBUSxDQUFDLEVBQUUsRUFBRTtRQUNmLE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDLE1BQU0sUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDaEUsT0FBTyxJQUFJLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUNuRDtTQUFNO1FBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDdEM7QUFDSCxDQUFDO0FBRUQsc0VBQXNFO0FBQ3RFLE1BQU0seUJBQXlCLEdBQUcsQ0FBQyxPQUFnQixFQUFFLEVBQUU7SUFDckQsTUFBTSxJQUFJLEdBQUc7UUFDWCxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07UUFDdEIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPO1FBQ3hCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtRQUNsQixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7UUFDbEIsV0FBVyxFQUFFLE9BQU8sQ0FBQyxXQUFXO1FBQ2hDLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSztRQUNwQixRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVE7UUFDMUIsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRO1FBQzFCLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUztLQUM3QixDQUFDO0lBQ0YsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge3V0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5pbXBvcnQge0ZpbGVDaHVua0l0ZXJhdG9yLCBGaWxlQ2h1bmtJdGVyYXRvck9wdGlvbnN9IGZyb20gJy4vZmlsZV9jaHVua19pdGVyYXRvcic7XG5cbi8qKlxuICogUHJvdmlkZSBhIHN0cmVhbSBvZiBjaHVua3MgZnJvbSBhIFVSTC5cbiAqXG4gKiBOb3RlIHRoaXMgY2xhc3MgZmlyc3QgZG93bmxvYWRzIHRoZSBlbnRpcmUgZmlsZSBpbnRvIG1lbW9yeSBiZWZvcmUgcHJvdmlkaW5nXG4gKiB0aGUgZmlyc3QgZWxlbWVudCBmcm9tIHRoZSBzdHJlYW0uICBUaGlzIGlzIGJlY2F1c2UgdGhlIEZldGNoIEFQSSBkb2VzIG5vdFxuICogeWV0IHJlbGlhYmx5IHByb3ZpZGUgYSByZWFkZXIgc3RyZWFtIGZvciB0aGUgcmVzcG9uc2UgYm9keS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVybENodW5rSXRlcmF0b3IoXG4gICAgdXJsOiBSZXF1ZXN0SW5mbywgb3B0aW9uczogRmlsZUNodW5rSXRlcmF0b3JPcHRpb25zID0ge30sXG4gICAgZmV0Y2hGdW5jPzogRnVuY3Rpb24pIHtcbiAgbGV0IHVybFN0cmluZztcbiAgbGV0IHJlcXVlc3RJbml0O1xuICBpZiAoKHR5cGVvZiB1cmwpID09PSAnc3RyaW5nJykge1xuICAgIHVybFN0cmluZyA9IHVybCBhcyBzdHJpbmc7XG4gIH0gZWxzZSB7XG4gICAgdXJsU3RyaW5nID0gKHVybCBhcyBSZXF1ZXN0KS51cmw7XG4gICAgcmVxdWVzdEluaXQgPSBnZXRSZXF1ZXN0SW5pdEZyb21SZXF1ZXN0KHVybCBhcyBSZXF1ZXN0KTtcbiAgfVxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IChmZXRjaEZ1bmMgfHwgdXRpbC5mZXRjaCkodXJsU3RyaW5nLCByZXF1ZXN0SW5pdCk7XG4gIGlmIChyZXNwb25zZS5vaykge1xuICAgIGNvbnN0IHVpbnQ4QXJyYXkgPSBuZXcgVWludDhBcnJheShhd2FpdCByZXNwb25zZS5hcnJheUJ1ZmZlcigpKTtcbiAgICByZXR1cm4gbmV3IEZpbGVDaHVua0l0ZXJhdG9yKHVpbnQ4QXJyYXksIG9wdGlvbnMpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgfVxufVxuXG4vLyBHZW5lcmF0ZSBSZXF1ZXN0SW5pdCBmcm9tIFJlcXVlc3QgdG8gbWF0Y2ggdGYudXRpbC5mZXRjaCBzaWduYXR1cmUuXG5jb25zdCBnZXRSZXF1ZXN0SW5pdEZyb21SZXF1ZXN0ID0gKHJlcXVlc3Q6IFJlcXVlc3QpID0+IHtcbiAgY29uc3QgaW5pdCA9IHtcbiAgICBtZXRob2Q6IHJlcXVlc3QubWV0aG9kLFxuICAgIGhlYWRlcnM6IHJlcXVlc3QuaGVhZGVycyxcbiAgICBib2R5OiByZXF1ZXN0LmJvZHksXG4gICAgbW9kZTogcmVxdWVzdC5tb2RlLFxuICAgIGNyZWRlbnRpYWxzOiByZXF1ZXN0LmNyZWRlbnRpYWxzLFxuICAgIGNhY2hlOiByZXF1ZXN0LmNhY2hlLFxuICAgIHJlZGlyZWN0OiByZXF1ZXN0LnJlZGlyZWN0LFxuICAgIHJlZmVycmVyOiByZXF1ZXN0LnJlZmVycmVyLFxuICAgIGludGVncml0eTogcmVxdWVzdC5pbnRlZ3JpdHksXG4gIH07XG4gIHJldHVybiBpbml0O1xufTtcbiJdfQ==