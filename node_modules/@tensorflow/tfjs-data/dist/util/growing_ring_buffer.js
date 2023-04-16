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
import { RingBuffer } from './ring_buffer';
export class GrowingRingBuffer extends RingBuffer {
    /**
     * Constructs a `GrowingRingBuffer`.
     */
    constructor() {
        super(GrowingRingBuffer.INITIAL_CAPACITY);
    }
    isFull() {
        return false;
    }
    push(value) {
        if (super.isFull()) {
            this.expand();
        }
        super.push(value);
    }
    unshift(value) {
        if (super.isFull()) {
            this.expand();
        }
        super.unshift(value);
    }
    /**
     * Doubles the capacity of the buffer.
     */
    expand() {
        const newCapacity = this.capacity * 2;
        const newData = new Array(newCapacity);
        const len = this.length();
        // Rotate the buffer to start at index 0 again, since we can't just
        // allocate more space at the end.
        for (let i = 0; i < len; i++) {
            newData[i] = this.get(this.wrap(this.begin + i));
        }
        this.data = newData;
        this.capacity = newCapacity;
        this.doubledCapacity = 2 * this.capacity;
        this.begin = 0;
        this.end = len;
    }
}
GrowingRingBuffer.INITIAL_CAPACITY = 32;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3Jvd2luZ19yaW5nX2J1ZmZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtZGF0YS9zcmMvdXRpbC9ncm93aW5nX3JpbmdfYnVmZmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxNQUFNLE9BQU8saUJBQXFCLFNBQVEsVUFBYTtJQUdyRDs7T0FFRztJQUNIO1FBQ0UsS0FBSyxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELE1BQU07UUFDSixPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxJQUFJLENBQUMsS0FBUTtRQUNYLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNmO1FBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRUQsT0FBTyxDQUFDLEtBQVE7UUFDZCxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUNsQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDZjtRQUNELEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVEOztPQUVHO0lBQ0ssTUFBTTtRQUNaLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sT0FBTyxHQUFHLElBQUksS0FBSyxDQUFJLFdBQVcsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUUxQixtRUFBbUU7UUFDbkUsa0NBQWtDO1FBQ2xDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDNUIsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEQ7UUFFRCxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztRQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQztRQUM1QixJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDakIsQ0FBQzs7QUE5Q2Msa0NBQWdCLEdBQUcsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtSaW5nQnVmZmVyfSBmcm9tICcuL3JpbmdfYnVmZmVyJztcblxuZXhwb3J0IGNsYXNzIEdyb3dpbmdSaW5nQnVmZmVyPFQ+IGV4dGVuZHMgUmluZ0J1ZmZlcjxUPiB7XG4gIHByaXZhdGUgc3RhdGljIElOSVRJQUxfQ0FQQUNJVFkgPSAzMjtcblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIGBHcm93aW5nUmluZ0J1ZmZlcmAuXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihHcm93aW5nUmluZ0J1ZmZlci5JTklUSUFMX0NBUEFDSVRZKTtcbiAgfVxuXG4gIGlzRnVsbCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwdXNoKHZhbHVlOiBUKSB7XG4gICAgaWYgKHN1cGVyLmlzRnVsbCgpKSB7XG4gICAgICB0aGlzLmV4cGFuZCgpO1xuICAgIH1cbiAgICBzdXBlci5wdXNoKHZhbHVlKTtcbiAgfVxuXG4gIHVuc2hpZnQodmFsdWU6IFQpIHtcbiAgICBpZiAoc3VwZXIuaXNGdWxsKCkpIHtcbiAgICAgIHRoaXMuZXhwYW5kKCk7XG4gICAgfVxuICAgIHN1cGVyLnVuc2hpZnQodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIERvdWJsZXMgdGhlIGNhcGFjaXR5IG9mIHRoZSBidWZmZXIuXG4gICAqL1xuICBwcml2YXRlIGV4cGFuZCgpIHtcbiAgICBjb25zdCBuZXdDYXBhY2l0eSA9IHRoaXMuY2FwYWNpdHkgKiAyO1xuICAgIGNvbnN0IG5ld0RhdGEgPSBuZXcgQXJyYXk8VD4obmV3Q2FwYWNpdHkpO1xuICAgIGNvbnN0IGxlbiA9IHRoaXMubGVuZ3RoKCk7XG5cbiAgICAvLyBSb3RhdGUgdGhlIGJ1ZmZlciB0byBzdGFydCBhdCBpbmRleCAwIGFnYWluLCBzaW5jZSB3ZSBjYW4ndCBqdXN0XG4gICAgLy8gYWxsb2NhdGUgbW9yZSBzcGFjZSBhdCB0aGUgZW5kLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG5ld0RhdGFbaV0gPSB0aGlzLmdldCh0aGlzLndyYXAodGhpcy5iZWdpbiArIGkpKTtcbiAgICB9XG5cbiAgICB0aGlzLmRhdGEgPSBuZXdEYXRhO1xuICAgIHRoaXMuY2FwYWNpdHkgPSBuZXdDYXBhY2l0eTtcbiAgICB0aGlzLmRvdWJsZWRDYXBhY2l0eSA9IDIgKiB0aGlzLmNhcGFjaXR5O1xuICAgIHRoaXMuYmVnaW4gPSAwO1xuICAgIHRoaXMuZW5kID0gbGVuO1xuICB9XG59XG4iXX0=