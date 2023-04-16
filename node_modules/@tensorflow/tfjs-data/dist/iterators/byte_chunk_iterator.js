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
import { LazyIterator, OneToManyIterator } from './lazy_iterator';
import { StringIterator } from './string_iterator';
export class ByteChunkIterator extends LazyIterator {
    /**
     * Decode a stream of UTF8-encoded byte arrays to a stream of strings.
     *
     * The byte arrays producetd from the ByteChunkIterator on which this is
     * called will be interpreted as concatenated.  No assumptions are made about
     * the boundaries of the incoming chunks, so a multi-byte UTF8 encoding of a
     * character may span the boundary between chunks.  This naturally happens,
     * for instance, when reading fixed-size byte arrays from a file.
     */
    decodeUTF8() {
        return new Utf8Iterator(this);
    }
}
// ============================================================================
// The following private classes serve to implement the chainable methods
// on ByteChunkIterator.  Unfortunately they can't be placed in separate files,
// due to resulting trouble with circular imports.
// ============================================================================
// We wanted multiple inheritance, e.g.
//   class Utf8Iterator extends QueueIterator<string>, StringIterator
// but the TypeScript mixin approach is a bit hacky, so we take this adapter
// approach instead.
class Utf8Iterator extends StringIterator {
    constructor(upstream) {
        super();
        this.upstream = upstream;
        this.impl = new Utf8IteratorImpl(upstream);
    }
    summary() {
        return this.impl.summary();
    }
    async next() {
        return this.impl.next();
    }
}
/**
 * Decode a stream of UTF8-encoded byte arrays to a stream of strings.
 *
 * This is tricky because the incoming byte array boundaries may disrupt a
 * multi-byte UTF8 character. Thus any incomplete character data at the end of
 * a chunk must be carried over and prepended to the next chunk before
 * decoding. Luckily with native decoder, TextDecoder in browser and
 * string_decoder in node, byte array boundaries are handled automatically.
 *
 * In the context of an input pipeline for machine learning, UTF8 decoding is
 * needed to parse text files containing training examples or prediction
 * requests (e.g., formatted as CSV or JSON). We cannot use the built-in
 * decoding provided by FileReader.readAsText() because here we are in a
 * streaming context, which FileReader does not support.
 *
 * @param upstream A `LazyIterator` of `Uint8Arrays` containing UTF8-encoded
 *   text, which should be interpreted as concatenated.  No assumptions are
 *   made about the boundaries of the incoming chunks, so a multi-byte UTF8
 *   encoding of a character may span the boundary between chunks.  This
 *   naturally happens, for instance, when reading fixed-size byte arrays from a
 *   file.
 */
class Utf8IteratorImpl extends OneToManyIterator {
    constructor(upstream) {
        super();
        this.upstream = upstream;
        if (env().get('IS_BROWSER')) {
            this.decoder = new TextDecoder('utf-8');
        }
        else {
            // tslint:disable-next-line:no-require-imports
            const { StringDecoder } = require('string_decoder');
            this.decoder = new StringDecoder('utf8');
        }
    }
    summary() {
        return `${this.upstream.summary()} -> Utf8`;
    }
    async pump() {
        const chunkResult = await this.upstream.next();
        let chunk;
        if (chunkResult.done) {
            return false;
        }
        else {
            chunk = chunkResult.value;
        }
        let text;
        if (env().get('IS_BROWSER')) {
            text = this.decoder.decode(chunk, { stream: true });
        }
        else {
            text = this.decoder.write(Buffer.from(chunk.buffer));
        }
        this.outputQueue.push(text);
        return true;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnl0ZV9jaHVua19pdGVyYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtZGF0YS9zcmMvaXRlcmF0b3JzL2J5dGVfY2h1bmtfaXRlcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFFSCxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUMsT0FBTyxFQUFDLFlBQVksRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2hFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUVqRCxNQUFNLE9BQWdCLGlCQUFrQixTQUFRLFlBQXdCO0lBQ3RFOzs7Ozs7OztPQVFHO0lBQ0gsVUFBVTtRQUNSLE9BQU8sSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEMsQ0FBQztDQUNGO0FBRUQsK0VBQStFO0FBQy9FLHlFQUF5RTtBQUN6RSwrRUFBK0U7QUFDL0Usa0RBQWtEO0FBQ2xELCtFQUErRTtBQUUvRSx1Q0FBdUM7QUFDdkMscUVBQXFFO0FBQ3JFLDRFQUE0RTtBQUM1RSxvQkFBb0I7QUFFcEIsTUFBTSxZQUFhLFNBQVEsY0FBYztJQUd2QyxZQUFzQixRQUFrQztRQUN0RCxLQUFLLEVBQUUsQ0FBQztRQURZLGFBQVEsR0FBUixRQUFRLENBQTBCO1FBRXRELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsT0FBTztRQUNMLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUk7UUFDUixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDMUIsQ0FBQztDQUNGO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCRztBQUNILE1BQU0sZ0JBQWlCLFNBQVEsaUJBQXlCO0lBTXRELFlBQStCLFFBQWtDO1FBQy9ELEtBQUssRUFBRSxDQUFDO1FBRHFCLGFBQVEsR0FBUixRQUFRLENBQTBCO1FBRS9ELElBQUksR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDekM7YUFBTTtZQUNMLDhDQUE4QztZQUM5QyxNQUFNLEVBQUMsYUFBYSxFQUFDLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMxQztJQUNILENBQUM7SUFDRCxPQUFPO1FBQ0wsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQztJQUM5QyxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUk7UUFDUixNQUFNLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDL0MsSUFBSSxLQUFLLENBQUM7UUFDVixJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUU7WUFDcEIsT0FBTyxLQUFLLENBQUM7U0FDZDthQUFNO1lBQ0wsS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUM7U0FDM0I7UUFFRCxJQUFJLElBQVksQ0FBQztRQUNqQixJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUMzQixJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7U0FDbkQ7YUFBTTtZQUNMLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ3REO1FBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2Vudn0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbmltcG9ydCB7TGF6eUl0ZXJhdG9yLCBPbmVUb01hbnlJdGVyYXRvcn0gZnJvbSAnLi9sYXp5X2l0ZXJhdG9yJztcbmltcG9ydCB7U3RyaW5nSXRlcmF0b3J9IGZyb20gJy4vc3RyaW5nX2l0ZXJhdG9yJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJ5dGVDaHVua0l0ZXJhdG9yIGV4dGVuZHMgTGF6eUl0ZXJhdG9yPFVpbnQ4QXJyYXk+IHtcbiAgLyoqXG4gICAqIERlY29kZSBhIHN0cmVhbSBvZiBVVEY4LWVuY29kZWQgYnl0ZSBhcnJheXMgdG8gYSBzdHJlYW0gb2Ygc3RyaW5ncy5cbiAgICpcbiAgICogVGhlIGJ5dGUgYXJyYXlzIHByb2R1Y2V0ZCBmcm9tIHRoZSBCeXRlQ2h1bmtJdGVyYXRvciBvbiB3aGljaCB0aGlzIGlzXG4gICAqIGNhbGxlZCB3aWxsIGJlIGludGVycHJldGVkIGFzIGNvbmNhdGVuYXRlZC4gIE5vIGFzc3VtcHRpb25zIGFyZSBtYWRlIGFib3V0XG4gICAqIHRoZSBib3VuZGFyaWVzIG9mIHRoZSBpbmNvbWluZyBjaHVua3MsIHNvIGEgbXVsdGktYnl0ZSBVVEY4IGVuY29kaW5nIG9mIGFcbiAgICogY2hhcmFjdGVyIG1heSBzcGFuIHRoZSBib3VuZGFyeSBiZXR3ZWVuIGNodW5rcy4gIFRoaXMgbmF0dXJhbGx5IGhhcHBlbnMsXG4gICAqIGZvciBpbnN0YW5jZSwgd2hlbiByZWFkaW5nIGZpeGVkLXNpemUgYnl0ZSBhcnJheXMgZnJvbSBhIGZpbGUuXG4gICAqL1xuICBkZWNvZGVVVEY4KCk6IFN0cmluZ0l0ZXJhdG9yIHtcbiAgICByZXR1cm4gbmV3IFV0ZjhJdGVyYXRvcih0aGlzKTtcbiAgfVxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUaGUgZm9sbG93aW5nIHByaXZhdGUgY2xhc3NlcyBzZXJ2ZSB0byBpbXBsZW1lbnQgdGhlIGNoYWluYWJsZSBtZXRob2RzXG4vLyBvbiBCeXRlQ2h1bmtJdGVyYXRvci4gIFVuZm9ydHVuYXRlbHkgdGhleSBjYW4ndCBiZSBwbGFjZWQgaW4gc2VwYXJhdGUgZmlsZXMsXG4vLyBkdWUgdG8gcmVzdWx0aW5nIHRyb3VibGUgd2l0aCBjaXJjdWxhciBpbXBvcnRzLlxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBXZSB3YW50ZWQgbXVsdGlwbGUgaW5oZXJpdGFuY2UsIGUuZy5cbi8vICAgY2xhc3MgVXRmOEl0ZXJhdG9yIGV4dGVuZHMgUXVldWVJdGVyYXRvcjxzdHJpbmc+LCBTdHJpbmdJdGVyYXRvclxuLy8gYnV0IHRoZSBUeXBlU2NyaXB0IG1peGluIGFwcHJvYWNoIGlzIGEgYml0IGhhY2t5LCBzbyB3ZSB0YWtlIHRoaXMgYWRhcHRlclxuLy8gYXBwcm9hY2ggaW5zdGVhZC5cblxuY2xhc3MgVXRmOEl0ZXJhdG9yIGV4dGVuZHMgU3RyaW5nSXRlcmF0b3Ige1xuICBwcml2YXRlIGltcGw6IFV0ZjhJdGVyYXRvckltcGw7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHVwc3RyZWFtOiBMYXp5SXRlcmF0b3I8VWludDhBcnJheT4pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuaW1wbCA9IG5ldyBVdGY4SXRlcmF0b3JJbXBsKHVwc3RyZWFtKTtcbiAgfVxuXG4gIHN1bW1hcnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW1wbC5zdW1tYXJ5KCk7XG4gIH1cblxuICBhc3luYyBuZXh0KCkge1xuICAgIHJldHVybiB0aGlzLmltcGwubmV4dCgpO1xuICB9XG59XG5cbi8qKlxuICogRGVjb2RlIGEgc3RyZWFtIG9mIFVURjgtZW5jb2RlZCBieXRlIGFycmF5cyB0byBhIHN0cmVhbSBvZiBzdHJpbmdzLlxuICpcbiAqIFRoaXMgaXMgdHJpY2t5IGJlY2F1c2UgdGhlIGluY29taW5nIGJ5dGUgYXJyYXkgYm91bmRhcmllcyBtYXkgZGlzcnVwdCBhXG4gKiBtdWx0aS1ieXRlIFVURjggY2hhcmFjdGVyLiBUaHVzIGFueSBpbmNvbXBsZXRlIGNoYXJhY3RlciBkYXRhIGF0IHRoZSBlbmQgb2ZcbiAqIGEgY2h1bmsgbXVzdCBiZSBjYXJyaWVkIG92ZXIgYW5kIHByZXBlbmRlZCB0byB0aGUgbmV4dCBjaHVuayBiZWZvcmVcbiAqIGRlY29kaW5nLiBMdWNraWx5IHdpdGggbmF0aXZlIGRlY29kZXIsIFRleHREZWNvZGVyIGluIGJyb3dzZXIgYW5kXG4gKiBzdHJpbmdfZGVjb2RlciBpbiBub2RlLCBieXRlIGFycmF5IGJvdW5kYXJpZXMgYXJlIGhhbmRsZWQgYXV0b21hdGljYWxseS5cbiAqXG4gKiBJbiB0aGUgY29udGV4dCBvZiBhbiBpbnB1dCBwaXBlbGluZSBmb3IgbWFjaGluZSBsZWFybmluZywgVVRGOCBkZWNvZGluZyBpc1xuICogbmVlZGVkIHRvIHBhcnNlIHRleHQgZmlsZXMgY29udGFpbmluZyB0cmFpbmluZyBleGFtcGxlcyBvciBwcmVkaWN0aW9uXG4gKiByZXF1ZXN0cyAoZS5nLiwgZm9ybWF0dGVkIGFzIENTViBvciBKU09OKS4gV2UgY2Fubm90IHVzZSB0aGUgYnVpbHQtaW5cbiAqIGRlY29kaW5nIHByb3ZpZGVkIGJ5IEZpbGVSZWFkZXIucmVhZEFzVGV4dCgpIGJlY2F1c2UgaGVyZSB3ZSBhcmUgaW4gYVxuICogc3RyZWFtaW5nIGNvbnRleHQsIHdoaWNoIEZpbGVSZWFkZXIgZG9lcyBub3Qgc3VwcG9ydC5cbiAqXG4gKiBAcGFyYW0gdXBzdHJlYW0gQSBgTGF6eUl0ZXJhdG9yYCBvZiBgVWludDhBcnJheXNgIGNvbnRhaW5pbmcgVVRGOC1lbmNvZGVkXG4gKiAgIHRleHQsIHdoaWNoIHNob3VsZCBiZSBpbnRlcnByZXRlZCBhcyBjb25jYXRlbmF0ZWQuICBObyBhc3N1bXB0aW9ucyBhcmVcbiAqICAgbWFkZSBhYm91dCB0aGUgYm91bmRhcmllcyBvZiB0aGUgaW5jb21pbmcgY2h1bmtzLCBzbyBhIG11bHRpLWJ5dGUgVVRGOFxuICogICBlbmNvZGluZyBvZiBhIGNoYXJhY3RlciBtYXkgc3BhbiB0aGUgYm91bmRhcnkgYmV0d2VlbiBjaHVua3MuICBUaGlzXG4gKiAgIG5hdHVyYWxseSBoYXBwZW5zLCBmb3IgaW5zdGFuY2UsIHdoZW4gcmVhZGluZyBmaXhlZC1zaXplIGJ5dGUgYXJyYXlzIGZyb20gYVxuICogICBmaWxlLlxuICovXG5jbGFzcyBVdGY4SXRlcmF0b3JJbXBsIGV4dGVuZHMgT25lVG9NYW55SXRlcmF0b3I8c3RyaW5nPiB7XG4gIC8vIGBkZWNvZGVyYCBhcyBgYW55YCBoZXJlIHRvIGR5bmFtaWNhbGx5IGFzc2lnbiB2YWx1ZSBiYXNlZCBvbiB0aGVcbiAgLy8gZW52aXJvbm1lbnQuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgZGVjb2RlcjogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCByZWFkb25seSB1cHN0cmVhbTogTGF6eUl0ZXJhdG9yPFVpbnQ4QXJyYXk+KSB7XG4gICAgc3VwZXIoKTtcbiAgICBpZiAoZW52KCkuZ2V0KCdJU19CUk9XU0VSJykpIHtcbiAgICAgIHRoaXMuZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigndXRmLTgnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXJlcXVpcmUtaW1wb3J0c1xuICAgICAgY29uc3Qge1N0cmluZ0RlY29kZXJ9ID0gcmVxdWlyZSgnc3RyaW5nX2RlY29kZXInKTtcbiAgICAgIHRoaXMuZGVjb2RlciA9IG5ldyBTdHJpbmdEZWNvZGVyKCd1dGY4Jyk7XG4gICAgfVxuICB9XG4gIHN1bW1hcnkoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMudXBzdHJlYW0uc3VtbWFyeSgpfSAtPiBVdGY4YDtcbiAgfVxuXG4gIGFzeW5jIHB1bXAoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgY2h1bmtSZXN1bHQgPSBhd2FpdCB0aGlzLnVwc3RyZWFtLm5leHQoKTtcbiAgICBsZXQgY2h1bms7XG4gICAgaWYgKGNodW5rUmVzdWx0LmRvbmUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2h1bmsgPSBjaHVua1Jlc3VsdC52YWx1ZTtcbiAgICB9XG5cbiAgICBsZXQgdGV4dDogc3RyaW5nO1xuICAgIGlmIChlbnYoKS5nZXQoJ0lTX0JST1dTRVInKSkge1xuICAgICAgdGV4dCA9IHRoaXMuZGVjb2Rlci5kZWNvZGUoY2h1bmssIHtzdHJlYW06IHRydWV9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dCA9IHRoaXMuZGVjb2Rlci53cml0ZShCdWZmZXIuZnJvbShjaHVuay5idWZmZXIpKTtcbiAgICB9XG4gICAgdGhpcy5vdXRwdXRRdWV1ZS5wdXNoKHRleHQpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG4iXX0=