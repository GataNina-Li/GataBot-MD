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
import { DataSource } from '../datasource';
import { urlChunkIterator } from '../iterators/url_chunk_iterator';
import { isLocalPath } from '../util/source_util';
import { FileDataSource } from './file_data_source';
/*
 * Represents a URL readable as a stream of binary data chunks.
 */
export class URLDataSource extends DataSource {
    /**
     * Create a `URLDataSource`.
     *
     * @param url A source URL string, or a `Request` object.
     * @param options Options passed to the underlying `FileChunkIterator`s,
     *   such as {chunksize: 1024}.
     */
    constructor(url, fileOptions = {}) {
        super();
        this.url = url;
        this.fileOptions = fileOptions;
    }
    // TODO(soergel): provide appropriate caching options.  Currently this
    // will download the URL anew for each call to iterator().  Since we have
    // to treat the downloaded file as a blob/buffer anyway, we may as well retain
    // it-- but that raises GC issues.  Also we may want a persistent disk cache.
    async iterator() {
        if (isLocalPath(this.url)) {
            return (new FileDataSource(this.url, this.fileOptions))
                .iterator();
        }
        else {
            return urlChunkIterator(this.url, this.fileOptions);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX2RhdGFfc291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1kYXRhL3NyYy9zb3VyY2VzL3VybF9kYXRhX3NvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHekMsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFDakUsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUVsRDs7R0FFRztBQUNILE1BQU0sT0FBTyxhQUFjLFNBQVEsVUFBVTtJQUMzQzs7Ozs7O09BTUc7SUFDSCxZQUN1QixHQUFnQixFQUNoQixjQUF3QyxFQUFFO1FBQy9ELEtBQUssRUFBRSxDQUFDO1FBRmEsUUFBRyxHQUFILEdBQUcsQ0FBYTtRQUNoQixnQkFBVyxHQUFYLFdBQVcsQ0FBK0I7SUFFakUsQ0FBQztJQUVELHNFQUFzRTtJQUN0RSx5RUFBeUU7SUFDekUsOEVBQThFO0lBQzlFLDZFQUE2RTtJQUM3RSxLQUFLLENBQUMsUUFBUTtRQUNaLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN6QixPQUFPLENBQUMsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQzVELFFBQVEsRUFBRSxDQUFDO1NBQ2pCO2FBQU07WUFDTCxPQUFPLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3JEO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtEYXRhU291cmNlfSBmcm9tICcuLi9kYXRhc291cmNlJztcbmltcG9ydCB7Qnl0ZUNodW5rSXRlcmF0b3J9IGZyb20gJy4uL2l0ZXJhdG9ycy9ieXRlX2NodW5rX2l0ZXJhdG9yJztcbmltcG9ydCB7RmlsZUNodW5rSXRlcmF0b3JPcHRpb25zfSBmcm9tICcuLi9pdGVyYXRvcnMvZmlsZV9jaHVua19pdGVyYXRvcic7XG5pbXBvcnQge3VybENodW5rSXRlcmF0b3J9IGZyb20gJy4uL2l0ZXJhdG9ycy91cmxfY2h1bmtfaXRlcmF0b3InO1xuaW1wb3J0IHtpc0xvY2FsUGF0aH0gZnJvbSAnLi4vdXRpbC9zb3VyY2VfdXRpbCc7XG5pbXBvcnQge0ZpbGVEYXRhU291cmNlfSBmcm9tICcuL2ZpbGVfZGF0YV9zb3VyY2UnO1xuXG4vKlxuICogUmVwcmVzZW50cyBhIFVSTCByZWFkYWJsZSBhcyBhIHN0cmVhbSBvZiBiaW5hcnkgZGF0YSBjaHVua3MuXG4gKi9cbmV4cG9ydCBjbGFzcyBVUkxEYXRhU291cmNlIGV4dGVuZHMgRGF0YVNvdXJjZSB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYSBgVVJMRGF0YVNvdXJjZWAuXG4gICAqXG4gICAqIEBwYXJhbSB1cmwgQSBzb3VyY2UgVVJMIHN0cmluZywgb3IgYSBgUmVxdWVzdGAgb2JqZWN0LlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHBhc3NlZCB0byB0aGUgdW5kZXJseWluZyBgRmlsZUNodW5rSXRlcmF0b3JgcyxcbiAgICogICBzdWNoIGFzIHtjaHVua3NpemU6IDEwMjR9LlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdXJsOiBSZXF1ZXN0SW5mbyxcbiAgICAgIHByb3RlY3RlZCByZWFkb25seSBmaWxlT3B0aW9uczogRmlsZUNodW5rSXRlcmF0b3JPcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLy8gVE9ETyhzb2VyZ2VsKTogcHJvdmlkZSBhcHByb3ByaWF0ZSBjYWNoaW5nIG9wdGlvbnMuICBDdXJyZW50bHkgdGhpc1xuICAvLyB3aWxsIGRvd25sb2FkIHRoZSBVUkwgYW5ldyBmb3IgZWFjaCBjYWxsIHRvIGl0ZXJhdG9yKCkuICBTaW5jZSB3ZSBoYXZlXG4gIC8vIHRvIHRyZWF0IHRoZSBkb3dubG9hZGVkIGZpbGUgYXMgYSBibG9iL2J1ZmZlciBhbnl3YXksIHdlIG1heSBhcyB3ZWxsIHJldGFpblxuICAvLyBpdC0tIGJ1dCB0aGF0IHJhaXNlcyBHQyBpc3N1ZXMuICBBbHNvIHdlIG1heSB3YW50IGEgcGVyc2lzdGVudCBkaXNrIGNhY2hlLlxuICBhc3luYyBpdGVyYXRvcigpOiBQcm9taXNlPEJ5dGVDaHVua0l0ZXJhdG9yPiB7XG4gICAgaWYgKGlzTG9jYWxQYXRoKHRoaXMudXJsKSkge1xuICAgICAgcmV0dXJuIChuZXcgRmlsZURhdGFTb3VyY2UodGhpcy51cmwgYXMgc3RyaW5nLCB0aGlzLmZpbGVPcHRpb25zKSlcbiAgICAgICAgICAuaXRlcmF0b3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHVybENodW5rSXRlcmF0b3IodGhpcy51cmwsIHRoaXMuZmlsZU9wdGlvbnMpO1xuICAgIH1cbiAgfVxufVxuIl19