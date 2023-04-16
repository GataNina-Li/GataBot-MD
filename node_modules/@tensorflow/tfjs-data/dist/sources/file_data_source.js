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
import { env } from '@tensorflow/tfjs-core';
import { DataSource } from '../datasource';
import { FileChunkIterator } from '../iterators/file_chunk_iterator';
import { isLocalPath } from '../util/source_util';
/**
 * Represents a file, blob, or Uint8Array readable as a stream of binary data
 * chunks.
 */
export class FileDataSource extends DataSource {
    /**
     * Create a `FileDataSource`.
     *
     * @param input Local file path, or `File`/`Blob`/`Uint8Array` object to
     *     read. Local file only works in node environment.
     * @param options Options passed to the underlying `FileChunkIterator`s,
     *   such as {chunksize: 1024}.
     */
    constructor(input, options = {}) {
        super();
        this.input = input;
        this.options = options;
    }
    async iterator() {
        if (isLocalPath(this.input) && env().get('IS_NODE')) {
            // tslint:disable-next-line:no-require-imports
            const fs = require('fs');
            this.input = fs.readFileSync(this.input.slice(7));
        }
        // TODO(kangyizhang): Add LocalFileChunkIterator to split local streaming
        // with file in browser.
        return new FileChunkIterator(this.input, this.options);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZV9kYXRhX3NvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtZGF0YS9zcmMvc291cmNlcy9maWxlX2RhdGFfc291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBRUgsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLGlCQUFpQixFQUEyQixNQUFNLGtDQUFrQyxDQUFDO0FBRTdGLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUVoRDs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sY0FBZSxTQUFRLFVBQVU7SUFDNUM7Ozs7Ozs7T0FPRztJQUNILFlBQ2MsS0FBeUIsRUFDaEIsVUFBb0MsRUFBRTtRQUMzRCxLQUFLLEVBQUUsQ0FBQztRQUZJLFVBQUssR0FBTCxLQUFLLENBQW9CO1FBQ2hCLFlBQU8sR0FBUCxPQUFPLENBQStCO0lBRTdELENBQUM7SUFFRCxLQUFLLENBQUMsUUFBUTtRQUNaLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDbkQsOENBQThDO1lBQzlDLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUUsSUFBSSxDQUFDLEtBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDL0Q7UUFDRCx5RUFBeUU7UUFDekUsd0JBQXdCO1FBQ3hCLE9BQU8sSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsS0FBb0IsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDeEUsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtlbnZ9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5pbXBvcnQge0RhdGFTb3VyY2V9IGZyb20gJy4uL2RhdGFzb3VyY2UnO1xuaW1wb3J0IHtCeXRlQ2h1bmtJdGVyYXRvcn0gZnJvbSAnLi4vaXRlcmF0b3JzL2J5dGVfY2h1bmtfaXRlcmF0b3InO1xuaW1wb3J0IHtGaWxlQ2h1bmtJdGVyYXRvciwgRmlsZUNodW5rSXRlcmF0b3JPcHRpb25zfSBmcm9tICcuLi9pdGVyYXRvcnMvZmlsZV9jaHVua19pdGVyYXRvcic7XG5pbXBvcnQge0ZpbGVFbGVtZW50fSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge2lzTG9jYWxQYXRofSBmcm9tICcuLi91dGlsL3NvdXJjZV91dGlsJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgZmlsZSwgYmxvYiwgb3IgVWludDhBcnJheSByZWFkYWJsZSBhcyBhIHN0cmVhbSBvZiBiaW5hcnkgZGF0YVxuICogY2h1bmtzLlxuICovXG5leHBvcnQgY2xhc3MgRmlsZURhdGFTb3VyY2UgZXh0ZW5kcyBEYXRhU291cmNlIHtcbiAgLyoqXG4gICAqIENyZWF0ZSBhIGBGaWxlRGF0YVNvdXJjZWAuXG4gICAqXG4gICAqIEBwYXJhbSBpbnB1dCBMb2NhbCBmaWxlIHBhdGgsIG9yIGBGaWxlYC9gQmxvYmAvYFVpbnQ4QXJyYXlgIG9iamVjdCB0b1xuICAgKiAgICAgcmVhZC4gTG9jYWwgZmlsZSBvbmx5IHdvcmtzIGluIG5vZGUgZW52aXJvbm1lbnQuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgcGFzc2VkIHRvIHRoZSB1bmRlcmx5aW5nIGBGaWxlQ2h1bmtJdGVyYXRvcmBzLFxuICAgKiAgIHN1Y2ggYXMge2NodW5rc2l6ZTogMTAyNH0uXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByb3RlY3RlZCBpbnB1dDogRmlsZUVsZW1lbnR8c3RyaW5nLFxuICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IG9wdGlvbnM6IEZpbGVDaHVua0l0ZXJhdG9yT3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIGFzeW5jIGl0ZXJhdG9yKCk6IFByb21pc2U8Qnl0ZUNodW5rSXRlcmF0b3I+IHtcbiAgICBpZiAoaXNMb2NhbFBhdGgodGhpcy5pbnB1dCkgJiYgZW52KCkuZ2V0KCdJU19OT0RFJykpIHtcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1yZXF1aXJlLWltcG9ydHNcbiAgICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgICAgIHRoaXMuaW5wdXQgPSBmcy5yZWFkRmlsZVN5bmMoKHRoaXMuaW5wdXQgYXMgc3RyaW5nKS5zbGljZSg3KSk7XG4gICAgfVxuICAgIC8vIFRPRE8oa2FuZ3lpemhhbmcpOiBBZGQgTG9jYWxGaWxlQ2h1bmtJdGVyYXRvciB0byBzcGxpdCBsb2NhbCBzdHJlYW1pbmdcbiAgICAvLyB3aXRoIGZpbGUgaW4gYnJvd3Nlci5cbiAgICByZXR1cm4gbmV3IEZpbGVDaHVua0l0ZXJhdG9yKHRoaXMuaW5wdXQgYXMgRmlsZUVsZW1lbnQsIHRoaXMub3B0aW9ucyk7XG4gIH1cbn1cbiJdfQ==