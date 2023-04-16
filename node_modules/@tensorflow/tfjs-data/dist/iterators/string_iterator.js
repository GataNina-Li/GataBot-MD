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
import { LazyIterator, OneToManyIterator } from './lazy_iterator';
export class StringIterator extends LazyIterator {
    /**
     * Splits a string stream on a given separator.
     *
     * It is assumed that the incoming chunk boundaries have no semantic meaning,
     * so conceptually the incoming stream is treated simply as the concatenation
     * of its elements.
     *
     * The outgoing stream provides chunks corresponding to the results of the
     * standard string split() operation (even if such a chunk spanned incoming
     * chunks).  The separators are not included.
     *
     * A typical usage is to split a text file (represented as a stream with
     * arbitrary chunk boundaries) into lines.
     *
     * @param upstream A readable stream of strings that can be treated as
     *   concatenated.
     * @param separator A character to split on.
     */
    split(separator) {
        return new SplitIterator(this, separator);
    }
}
// ============================================================================
// The following private classes serve to implement the chainable methods
// on StringIterator.  Unfortunately they can't be placed in separate files, due
// to resulting trouble with circular imports.
// ============================================================================
// We wanted multiple inheritance, e.g.
//   class SplitIterator extends QueueIterator<string>, StringIterator
// but the TypeScript mixin approach is a bit hacky, so we take this adapter
// approach instead.
class SplitIterator extends StringIterator {
    constructor(upstream, separator) {
        super();
        this.upstream = upstream;
        this.impl = new SplitIteratorImpl(upstream, separator);
    }
    summary() {
        return this.impl.summary();
    }
    async next() {
        return this.impl.next();
    }
}
class SplitIteratorImpl extends OneToManyIterator {
    constructor(upstream, separator) {
        super();
        this.upstream = upstream;
        this.separator = separator;
        // A partial string at the end of an upstream chunk
        this.carryover = '';
    }
    summary() {
        return `${this.upstream.summary()} -> Split('${this.separator}')`;
    }
    async pump() {
        const chunkResult = await this.upstream.next();
        if (chunkResult.done) {
            if (this.carryover === '') {
                return false;
            }
            // Pretend that the pump succeeded in order to emit the small last batch.
            // The next pump() call will actually fail.
            this.outputQueue.push(this.carryover);
            this.carryover = '';
            return true;
        }
        const lines = chunkResult.value.split(this.separator);
        // Note the behavior: " ab ".split(' ') === ['', 'ab', '']
        // Thus the carryover may be '' if the separator falls on a chunk
        // boundary; this produces the correct result.
        lines[0] = this.carryover + lines[0];
        for (const line of lines.slice(0, -1)) {
            this.outputQueue.push(line);
        }
        this.carryover = lines[lines.length - 1];
        return true;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nX2l0ZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1kYXRhL3NyYy9pdGVyYXRvcnMvc3RyaW5nX2l0ZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRWhFLE1BQU0sT0FBZ0IsY0FBZSxTQUFRLFlBQW9CO0lBQy9EOzs7Ozs7Ozs7Ozs7Ozs7OztPQWlCRztJQUNILEtBQUssQ0FBQyxTQUFpQjtRQUNyQixPQUFPLElBQUksYUFBYSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUM1QyxDQUFDO0NBQ0Y7QUFFRCwrRUFBK0U7QUFDL0UseUVBQXlFO0FBQ3pFLGdGQUFnRjtBQUNoRiw4Q0FBOEM7QUFDOUMsK0VBQStFO0FBRS9FLHVDQUF1QztBQUN2QyxzRUFBc0U7QUFDdEUsNEVBQTRFO0FBQzVFLG9CQUFvQjtBQUVwQixNQUFNLGFBQWMsU0FBUSxjQUFjO0lBR3hDLFlBQXNCLFFBQThCLEVBQUUsU0FBaUI7UUFDckUsS0FBSyxFQUFFLENBQUM7UUFEWSxhQUFRLEdBQVIsUUFBUSxDQUFzQjtRQUVsRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksaUJBQWlCLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxPQUFPO1FBQ0wsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSTtRQUNSLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMxQixDQUFDO0NBQ0Y7QUFFRCxNQUFNLGlCQUFrQixTQUFRLGlCQUF5QjtJQUl2RCxZQUNjLFFBQThCLEVBQVksU0FBaUI7UUFDdkUsS0FBSyxFQUFFLENBQUM7UUFESSxhQUFRLEdBQVIsUUFBUSxDQUFzQjtRQUFZLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFKekUsbURBQW1EO1FBQ25ELGNBQVMsR0FBRyxFQUFFLENBQUM7SUFLZixDQUFDO0lBRUQsT0FBTztRQUNMLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxjQUFjLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQztJQUNwRSxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUk7UUFDUixNQUFNLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDL0MsSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFO1lBQ3BCLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxFQUFFLEVBQUU7Z0JBQ3pCLE9BQU8sS0FBSyxDQUFDO2FBQ2Q7WUFFRCx5RUFBeUU7WUFDekUsMkNBQTJDO1lBQzNDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUNwQixPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RELDBEQUEwRDtRQUMxRCxpRUFBaUU7UUFDakUsOENBQThDO1FBRTlDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDckMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDN0I7UUFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRXpDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtMYXp5SXRlcmF0b3IsIE9uZVRvTWFueUl0ZXJhdG9yfSBmcm9tICcuL2xhenlfaXRlcmF0b3InO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3RyaW5nSXRlcmF0b3IgZXh0ZW5kcyBMYXp5SXRlcmF0b3I8c3RyaW5nPiB7XG4gIC8qKlxuICAgKiBTcGxpdHMgYSBzdHJpbmcgc3RyZWFtIG9uIGEgZ2l2ZW4gc2VwYXJhdG9yLlxuICAgKlxuICAgKiBJdCBpcyBhc3N1bWVkIHRoYXQgdGhlIGluY29taW5nIGNodW5rIGJvdW5kYXJpZXMgaGF2ZSBubyBzZW1hbnRpYyBtZWFuaW5nLFxuICAgKiBzbyBjb25jZXB0dWFsbHkgdGhlIGluY29taW5nIHN0cmVhbSBpcyB0cmVhdGVkIHNpbXBseSBhcyB0aGUgY29uY2F0ZW5hdGlvblxuICAgKiBvZiBpdHMgZWxlbWVudHMuXG4gICAqXG4gICAqIFRoZSBvdXRnb2luZyBzdHJlYW0gcHJvdmlkZXMgY2h1bmtzIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHJlc3VsdHMgb2YgdGhlXG4gICAqIHN0YW5kYXJkIHN0cmluZyBzcGxpdCgpIG9wZXJhdGlvbiAoZXZlbiBpZiBzdWNoIGEgY2h1bmsgc3Bhbm5lZCBpbmNvbWluZ1xuICAgKiBjaHVua3MpLiAgVGhlIHNlcGFyYXRvcnMgYXJlIG5vdCBpbmNsdWRlZC5cbiAgICpcbiAgICogQSB0eXBpY2FsIHVzYWdlIGlzIHRvIHNwbGl0IGEgdGV4dCBmaWxlIChyZXByZXNlbnRlZCBhcyBhIHN0cmVhbSB3aXRoXG4gICAqIGFyYml0cmFyeSBjaHVuayBib3VuZGFyaWVzKSBpbnRvIGxpbmVzLlxuICAgKlxuICAgKiBAcGFyYW0gdXBzdHJlYW0gQSByZWFkYWJsZSBzdHJlYW0gb2Ygc3RyaW5ncyB0aGF0IGNhbiBiZSB0cmVhdGVkIGFzXG4gICAqICAgY29uY2F0ZW5hdGVkLlxuICAgKiBAcGFyYW0gc2VwYXJhdG9yIEEgY2hhcmFjdGVyIHRvIHNwbGl0IG9uLlxuICAgKi9cbiAgc3BsaXQoc2VwYXJhdG9yOiBzdHJpbmcpOiBTdHJpbmdJdGVyYXRvciB7XG4gICAgcmV0dXJuIG5ldyBTcGxpdEl0ZXJhdG9yKHRoaXMsIHNlcGFyYXRvcik7XG4gIH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGhlIGZvbGxvd2luZyBwcml2YXRlIGNsYXNzZXMgc2VydmUgdG8gaW1wbGVtZW50IHRoZSBjaGFpbmFibGUgbWV0aG9kc1xuLy8gb24gU3RyaW5nSXRlcmF0b3IuICBVbmZvcnR1bmF0ZWx5IHRoZXkgY2FuJ3QgYmUgcGxhY2VkIGluIHNlcGFyYXRlIGZpbGVzLCBkdWVcbi8vIHRvIHJlc3VsdGluZyB0cm91YmxlIHdpdGggY2lyY3VsYXIgaW1wb3J0cy5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gV2Ugd2FudGVkIG11bHRpcGxlIGluaGVyaXRhbmNlLCBlLmcuXG4vLyAgIGNsYXNzIFNwbGl0SXRlcmF0b3IgZXh0ZW5kcyBRdWV1ZUl0ZXJhdG9yPHN0cmluZz4sIFN0cmluZ0l0ZXJhdG9yXG4vLyBidXQgdGhlIFR5cGVTY3JpcHQgbWl4aW4gYXBwcm9hY2ggaXMgYSBiaXQgaGFja3ksIHNvIHdlIHRha2UgdGhpcyBhZGFwdGVyXG4vLyBhcHByb2FjaCBpbnN0ZWFkLlxuXG5jbGFzcyBTcGxpdEl0ZXJhdG9yIGV4dGVuZHMgU3RyaW5nSXRlcmF0b3Ige1xuICBwcml2YXRlIGltcGw6IFNwbGl0SXRlcmF0b3JJbXBsO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCB1cHN0cmVhbTogTGF6eUl0ZXJhdG9yPHN0cmluZz4sIHNlcGFyYXRvcjogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmltcGwgPSBuZXcgU3BsaXRJdGVyYXRvckltcGwodXBzdHJlYW0sIHNlcGFyYXRvcik7XG4gIH1cblxuICBzdW1tYXJ5KCkge1xuICAgIHJldHVybiB0aGlzLmltcGwuc3VtbWFyeSgpO1xuICB9XG5cbiAgYXN5bmMgbmV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5pbXBsLm5leHQoKTtcbiAgfVxufVxuXG5jbGFzcyBTcGxpdEl0ZXJhdG9ySW1wbCBleHRlbmRzIE9uZVRvTWFueUl0ZXJhdG9yPHN0cmluZz4ge1xuICAvLyBBIHBhcnRpYWwgc3RyaW5nIGF0IHRoZSBlbmQgb2YgYW4gdXBzdHJlYW0gY2h1bmtcbiAgY2FycnlvdmVyID0gJyc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcm90ZWN0ZWQgdXBzdHJlYW06IExhenlJdGVyYXRvcjxzdHJpbmc+LCBwcm90ZWN0ZWQgc2VwYXJhdG9yOiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgc3VtbWFyeSgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy51cHN0cmVhbS5zdW1tYXJ5KCl9IC0+IFNwbGl0KCcke3RoaXMuc2VwYXJhdG9yfScpYDtcbiAgfVxuXG4gIGFzeW5jIHB1bXAoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgY2h1bmtSZXN1bHQgPSBhd2FpdCB0aGlzLnVwc3RyZWFtLm5leHQoKTtcbiAgICBpZiAoY2h1bmtSZXN1bHQuZG9uZSkge1xuICAgICAgaWYgKHRoaXMuY2FycnlvdmVyID09PSAnJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXRlbmQgdGhhdCB0aGUgcHVtcCBzdWNjZWVkZWQgaW4gb3JkZXIgdG8gZW1pdCB0aGUgc21hbGwgbGFzdCBiYXRjaC5cbiAgICAgIC8vIFRoZSBuZXh0IHB1bXAoKSBjYWxsIHdpbGwgYWN0dWFsbHkgZmFpbC5cbiAgICAgIHRoaXMub3V0cHV0UXVldWUucHVzaCh0aGlzLmNhcnJ5b3Zlcik7XG4gICAgICB0aGlzLmNhcnJ5b3ZlciA9ICcnO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNvbnN0IGxpbmVzID0gY2h1bmtSZXN1bHQudmFsdWUuc3BsaXQodGhpcy5zZXBhcmF0b3IpO1xuICAgIC8vIE5vdGUgdGhlIGJlaGF2aW9yOiBcIiBhYiBcIi5zcGxpdCgnICcpID09PSBbJycsICdhYicsICcnXVxuICAgIC8vIFRodXMgdGhlIGNhcnJ5b3ZlciBtYXkgYmUgJycgaWYgdGhlIHNlcGFyYXRvciBmYWxscyBvbiBhIGNodW5rXG4gICAgLy8gYm91bmRhcnk7IHRoaXMgcHJvZHVjZXMgdGhlIGNvcnJlY3QgcmVzdWx0LlxuXG4gICAgbGluZXNbMF0gPSB0aGlzLmNhcnJ5b3ZlciArIGxpbmVzWzBdO1xuICAgIGZvciAoY29uc3QgbGluZSBvZiBsaW5lcy5zbGljZSgwLCAtMSkpIHtcbiAgICAgIHRoaXMub3V0cHV0UXVldWUucHVzaChsaW5lKTtcbiAgICB9XG4gICAgdGhpcy5jYXJyeW92ZXIgPSBsaW5lc1tsaW5lcy5sZW5ndGggLSAxXTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG4iXX0=