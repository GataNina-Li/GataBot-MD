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
// inspired by https://github.com/maxogden/filereader-stream
import { env, util } from '@tensorflow/tfjs-core';
import { ByteChunkIterator } from './byte_chunk_iterator';
/**
 * Provide a stream of chunks from a File, Blob, or Uint8Array.
 * @param file The source File, Blob or Uint8Array.
 * @param options Optional settings controlling file reading.
 * @returns a lazy Iterator of Uint8Arrays containing sequential chunks of the
 *   input File, Blob or Uint8Array.
 */
export class FileChunkIterator extends ByteChunkIterator {
    constructor(file, options = {}) {
        super();
        this.file = file;
        this.options = options;
        util.assert((file instanceof Uint8Array) ||
            (env().get('IS_BROWSER') ?
                (file instanceof File || file instanceof Blob) :
                false), () => 'FileChunkIterator only supports File, Blob and Uint8Array ' +
            'right now.');
        this.offset = options.offset || 0;
        // default 1MB chunk has tolerable perf on large files
        this.chunkSize = options.chunkSize || 1024 * 1024;
    }
    summary() {
        return `FileChunks ${this.file}`;
    }
    async next() {
        if (this.offset >= ((this.file instanceof Uint8Array) ?
            this.file.byteLength :
            this.file.size)) {
            return { value: null, done: true };
        }
        const chunk = new Promise((resolve, reject) => {
            const end = this.offset + this.chunkSize;
            if (this.file instanceof Uint8Array) {
                // Note if end > this.uint8Array.byteLength, we just get a small last
                // chunk.
                resolve(new Uint8Array(this.file.slice(this.offset, end)));
            }
            else {
                // This branch assumes that this.file type is File or Blob, which
                // means it is in the browser environment.
                // TODO(soergel): is this a performance issue?
                const fileReader = new FileReader();
                fileReader.onload = (event) => {
                    let data = fileReader.result;
                    // Not sure we can trust the return type of
                    // FileReader.readAsArrayBuffer See e.g.
                    // https://github.com/node-file-api/FileReader/issues/2
                    if (data instanceof ArrayBuffer) {
                        data = new Uint8Array(data);
                    }
                    if (!(data instanceof Uint8Array)) {
                        return reject(new TypeError('FileReader returned unknown type.'));
                    }
                    resolve(data);
                };
                fileReader.onabort = (event) => {
                    return reject(new Error('Aborted'));
                };
                fileReader.onerror = (event) => {
                    return reject(new Error(event.type));
                };
                // TODO(soergel): better handle onabort, onerror
                // Note if end > this.file.size, we just get a small last chunk.
                const slice = this.file.slice(this.offset, end);
                // We can't use readAsText here (even if we know the file is text)
                // because the slice boundary may fall within a multi-byte character.
                fileReader.readAsArrayBuffer(slice);
            }
            this.offset = end;
        });
        return { value: (await chunk), done: false };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZV9jaHVua19pdGVyYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtZGF0YS9zcmMvaXRlcmF0b3JzL2ZpbGVfY2h1bmtfaXRlcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFFSCw0REFBNEQ7QUFDNUQsT0FBTyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUVoRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQVN4RDs7Ozs7O0dBTUc7QUFDSCxNQUFNLE9BQU8saUJBQWtCLFNBQVEsaUJBQWlCO0lBSXRELFlBQ2MsSUFBaUIsRUFDakIsVUFBb0MsRUFBRTtRQUNsRCxLQUFLLEVBQUUsQ0FBQztRQUZJLFNBQUksR0FBSixJQUFJLENBQWE7UUFDakIsWUFBTyxHQUFQLE9BQU8sQ0FBK0I7UUFFbEQsSUFBSSxDQUFDLE1BQU0sQ0FDUCxDQUFDLElBQUksWUFBWSxVQUFVLENBQUM7WUFDeEIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDckIsQ0FBQyxJQUFJLFlBQVksSUFBSSxJQUFJLElBQUksWUFBWSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxLQUFLLENBQUMsRUFDZixHQUFHLEVBQUUsQ0FBQyw0REFBNEQ7WUFDOUQsWUFBWSxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztRQUNsQyxzREFBc0Q7UUFDdEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7SUFDcEQsQ0FBQztJQUVELE9BQU87UUFDTCxPQUFPLGNBQWMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSTtRQUNSLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksWUFBWSxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN2QyxPQUFPLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUM7U0FDbEM7UUFDRCxNQUFNLEtBQUssR0FBRyxJQUFJLE9BQU8sQ0FBYSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUN4RCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDekMsSUFBSSxJQUFJLENBQUMsSUFBSSxZQUFZLFVBQVUsRUFBRTtnQkFDbkMscUVBQXFFO2dCQUNyRSxTQUFTO2dCQUNULE9BQU8sQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM1RDtpQkFBTTtnQkFDTCxpRUFBaUU7Z0JBQ2pFLDBDQUEwQztnQkFFMUMsOENBQThDO2dCQUM5QyxNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO2dCQUNwQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQzVCLElBQUksSUFBSSxHQUFrQyxVQUFVLENBQUMsTUFBTSxDQUFDO29CQUM1RCwyQ0FBMkM7b0JBQzNDLHdDQUF3QztvQkFDeEMsdURBQXVEO29CQUN2RCxJQUFJLElBQUksWUFBWSxXQUFXLEVBQUU7d0JBQy9CLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDN0I7b0JBQ0QsSUFBSSxDQUFDLENBQUMsSUFBSSxZQUFZLFVBQVUsQ0FBQyxFQUFFO3dCQUNqQyxPQUFPLE1BQU0sQ0FBQyxJQUFJLFNBQVMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLENBQUM7cUJBQ25FO29CQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEIsQ0FBQyxDQUFDO2dCQUNGLFVBQVUsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRTtvQkFDN0IsT0FBTyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsQ0FBQyxDQUFDO2dCQUNGLFVBQVUsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRTtvQkFDN0IsT0FBTyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLENBQUMsQ0FBQztnQkFDRixnREFBZ0Q7Z0JBQ2hELGdFQUFnRTtnQkFDaEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDaEQsa0VBQWtFO2dCQUNsRSxxRUFBcUU7Z0JBQ3JFLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNyQztZQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxFQUFDLEtBQUssRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDO0lBQzdDLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbi8vIGluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9tYXhvZ2Rlbi9maWxlcmVhZGVyLXN0cmVhbVxuaW1wb3J0IHtlbnYsIHV0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5pbXBvcnQge0ZpbGVFbGVtZW50fSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge0J5dGVDaHVua0l0ZXJhdG9yfSBmcm9tICcuL2J5dGVfY2h1bmtfaXRlcmF0b3InO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZpbGVDaHVua0l0ZXJhdG9yT3B0aW9ucyB7XG4gIC8qKiBUaGUgYnl0ZSBvZmZzZXQgYXQgd2hpY2ggdG8gYmVnaW4gcmVhZGluZyB0aGUgRmlsZSBvciBCbG9iLiBEZWZhdWx0IDAuICovXG4gIG9mZnNldD86IG51bWJlcjtcbiAgLyoqIFRoZSBudW1iZXIgb2YgYnl0ZXMgdG8gcmVhZCBhdCBhIHRpbWUuIERlZmF1bHQgMU1CLiAqL1xuICBjaHVua1NpemU/OiBudW1iZXI7XG59XG5cbi8qKlxuICogUHJvdmlkZSBhIHN0cmVhbSBvZiBjaHVua3MgZnJvbSBhIEZpbGUsIEJsb2IsIG9yIFVpbnQ4QXJyYXkuXG4gKiBAcGFyYW0gZmlsZSBUaGUgc291cmNlIEZpbGUsIEJsb2Igb3IgVWludDhBcnJheS5cbiAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbmFsIHNldHRpbmdzIGNvbnRyb2xsaW5nIGZpbGUgcmVhZGluZy5cbiAqIEByZXR1cm5zIGEgbGF6eSBJdGVyYXRvciBvZiBVaW50OEFycmF5cyBjb250YWluaW5nIHNlcXVlbnRpYWwgY2h1bmtzIG9mIHRoZVxuICogICBpbnB1dCBGaWxlLCBCbG9iIG9yIFVpbnQ4QXJyYXkuXG4gKi9cbmV4cG9ydCBjbGFzcyBGaWxlQ2h1bmtJdGVyYXRvciBleHRlbmRzIEJ5dGVDaHVua0l0ZXJhdG9yIHtcbiAgb2Zmc2V0OiBudW1iZXI7XG4gIGNodW5rU2l6ZTogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJvdGVjdGVkIGZpbGU6IEZpbGVFbGVtZW50LFxuICAgICAgcHJvdGVjdGVkIG9wdGlvbnM6IEZpbGVDaHVua0l0ZXJhdG9yT3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB1dGlsLmFzc2VydChcbiAgICAgICAgKGZpbGUgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB8fFxuICAgICAgICAgICAgKGVudigpLmdldCgnSVNfQlJPV1NFUicpID9cbiAgICAgICAgICAgICAgICAgKGZpbGUgaW5zdGFuY2VvZiBGaWxlIHx8IGZpbGUgaW5zdGFuY2VvZiBCbG9iKSA6XG4gICAgICAgICAgICAgICAgIGZhbHNlKSxcbiAgICAgICAgKCkgPT4gJ0ZpbGVDaHVua0l0ZXJhdG9yIG9ubHkgc3VwcG9ydHMgRmlsZSwgQmxvYiBhbmQgVWludDhBcnJheSAnICtcbiAgICAgICAgICAgICdyaWdodCBub3cuJyk7XG4gICAgdGhpcy5vZmZzZXQgPSBvcHRpb25zLm9mZnNldCB8fCAwO1xuICAgIC8vIGRlZmF1bHQgMU1CIGNodW5rIGhhcyB0b2xlcmFibGUgcGVyZiBvbiBsYXJnZSBmaWxlc1xuICAgIHRoaXMuY2h1bmtTaXplID0gb3B0aW9ucy5jaHVua1NpemUgfHwgMTAyNCAqIDEwMjQ7XG4gIH1cblxuICBzdW1tYXJ5KCkge1xuICAgIHJldHVybiBgRmlsZUNodW5rcyAke3RoaXMuZmlsZX1gO1xuICB9XG5cbiAgYXN5bmMgbmV4dCgpOiBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PFVpbnQ4QXJyYXk+PiB7XG4gICAgaWYgKHRoaXMub2Zmc2V0ID49ICgodGhpcy5maWxlIGluc3RhbmNlb2YgVWludDhBcnJheSkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsZS5ieXRlTGVuZ3RoIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbGUuc2l6ZSkpIHtcbiAgICAgIHJldHVybiB7dmFsdWU6IG51bGwsIGRvbmU6IHRydWV9O1xuICAgIH1cbiAgICBjb25zdCBjaHVuayA9IG5ldyBQcm9taXNlPFVpbnQ4QXJyYXk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGVuZCA9IHRoaXMub2Zmc2V0ICsgdGhpcy5jaHVua1NpemU7XG4gICAgICBpZiAodGhpcy5maWxlIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuICAgICAgICAvLyBOb3RlIGlmIGVuZCA+IHRoaXMudWludDhBcnJheS5ieXRlTGVuZ3RoLCB3ZSBqdXN0IGdldCBhIHNtYWxsIGxhc3RcbiAgICAgICAgLy8gY2h1bmsuXG4gICAgICAgIHJlc29sdmUobmV3IFVpbnQ4QXJyYXkodGhpcy5maWxlLnNsaWNlKHRoaXMub2Zmc2V0LCBlbmQpKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGlzIGJyYW5jaCBhc3N1bWVzIHRoYXQgdGhpcy5maWxlIHR5cGUgaXMgRmlsZSBvciBCbG9iLCB3aGljaFxuICAgICAgICAvLyBtZWFucyBpdCBpcyBpbiB0aGUgYnJvd3NlciBlbnZpcm9ubWVudC5cblxuICAgICAgICAvLyBUT0RPKHNvZXJnZWwpOiBpcyB0aGlzIGEgcGVyZm9ybWFuY2UgaXNzdWU/XG4gICAgICAgIGNvbnN0IGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICBmaWxlUmVhZGVyLm9ubG9hZCA9IChldmVudCkgPT4ge1xuICAgICAgICAgIGxldCBkYXRhOiBzdHJpbmd8QXJyYXlCdWZmZXJ8VWludDhBcnJheSA9IGZpbGVSZWFkZXIucmVzdWx0O1xuICAgICAgICAgIC8vIE5vdCBzdXJlIHdlIGNhbiB0cnVzdCB0aGUgcmV0dXJuIHR5cGUgb2ZcbiAgICAgICAgICAvLyBGaWxlUmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyIFNlZSBlLmcuXG4gICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL25vZGUtZmlsZS1hcGkvRmlsZVJlYWRlci9pc3N1ZXMvMlxuICAgICAgICAgIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICAgIGRhdGEgPSBuZXcgVWludDhBcnJheShkYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCEoZGF0YSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0ZpbGVSZWFkZXIgcmV0dXJuZWQgdW5rbm93biB0eXBlLicpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAgICAgfTtcbiAgICAgICAgZmlsZVJlYWRlci5vbmFib3J0ID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoJ0Fib3J0ZWQnKSk7XG4gICAgICAgIH07XG4gICAgICAgIGZpbGVSZWFkZXIub25lcnJvciA9IChldmVudCkgPT4ge1xuICAgICAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKGV2ZW50LnR5cGUpKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gVE9ETyhzb2VyZ2VsKTogYmV0dGVyIGhhbmRsZSBvbmFib3J0LCBvbmVycm9yXG4gICAgICAgIC8vIE5vdGUgaWYgZW5kID4gdGhpcy5maWxlLnNpemUsIHdlIGp1c3QgZ2V0IGEgc21hbGwgbGFzdCBjaHVuay5cbiAgICAgICAgY29uc3Qgc2xpY2UgPSB0aGlzLmZpbGUuc2xpY2UodGhpcy5vZmZzZXQsIGVuZCk7XG4gICAgICAgIC8vIFdlIGNhbid0IHVzZSByZWFkQXNUZXh0IGhlcmUgKGV2ZW4gaWYgd2Uga25vdyB0aGUgZmlsZSBpcyB0ZXh0KVxuICAgICAgICAvLyBiZWNhdXNlIHRoZSBzbGljZSBib3VuZGFyeSBtYXkgZmFsbCB3aXRoaW4gYSBtdWx0aS1ieXRlIGNoYXJhY3Rlci5cbiAgICAgICAgZmlsZVJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihzbGljZSk7XG4gICAgICB9XG4gICAgICB0aGlzLm9mZnNldCA9IGVuZDtcbiAgICB9KTtcbiAgICByZXR1cm4ge3ZhbHVlOiAoYXdhaXQgY2h1bmspLCBkb25lOiBmYWxzZX07XG4gIH1cbn1cbiJdfQ==