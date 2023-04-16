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
/**
 * A ring buffer, providing O(1) FIFO, LIFO, and related operations.
 */
export class RingBuffer {
    /**
     * Constructs a `RingBuffer`.
     * @param capacity The number of items that the buffer can accomodate.
     */
    constructor(capacity) {
        this.capacity = capacity;
        // Note we store the indices in the range 0 <= index < 2*capacity.
        // This allows us to distinguish the full from the empty case.
        // See https://www.snellman.net/blog/archive/2016-12-13-ring-buffers/
        this.begin = 0; // inclusive
        this.end = 0; // exclusive
        if (capacity == null) {
            throw new RangeError('Can\'t create a ring buffer of unknown capacity.');
        }
        if (capacity < 1) {
            throw new RangeError('Can\'t create ring buffer of capacity < 1.');
        }
        this.data = new Array(capacity);
        this.doubledCapacity = 2 * capacity;
    }
    /**
     * Map any index into the range 0 <= index < 2*capacity.
     */
    wrap(index) {
        // don't trust % on negative numbers
        while (index < 0) {
            index += this.doubledCapacity;
        }
        return index % this.doubledCapacity;
    }
    get(index) {
        if (index < 0) {
            throw new RangeError('Can\'t get item at a negative index.');
        }
        return this.data[index % this.capacity];
    }
    set(index, value) {
        if (index < 0) {
            throw new RangeError('Can\'t set item at a negative index.');
        }
        this.data[index % this.capacity] = value;
    }
    /**
     * Returns the current number of items in the buffer.
     */
    length() {
        let length = this.end - this.begin;
        if (length < 0) {
            length = this.doubledCapacity + length;
        }
        return length;
    }
    /**
     * Reports whether the buffer is full.
     * @returns true if the number of items in the buffer equals its capacity, and
     *   false otherwise.
     */
    isFull() {
        return this.length() === this.capacity;
    }
    /**
     * Reports whether the buffer is empty.
     * @returns true if the number of items in the buffer equals zero, and
     *   false otherwise.
     */
    isEmpty() {
        return this.length() === 0;
    }
    /**
     * Adds an item to the end of the buffer.
     */
    push(value) {
        if (this.isFull()) {
            throw new RangeError('Ring buffer is full.');
        }
        this.set(this.end, value);
        this.end = this.wrap(this.end + 1);
    }
    /**
     * Adds many items to the end of the buffer, in order.
     */
    pushAll(values) {
        for (const value of values) {
            this.push(value);
        }
    }
    /**
     * Removes and returns the last item in the buffer.
     */
    pop() {
        if (this.isEmpty()) {
            throw new RangeError('Ring buffer is empty.');
        }
        this.end = this.wrap(this.end - 1);
        const result = this.get(this.end);
        this.set(this.end, undefined);
        return result;
    }
    /**
     * Adds an item to the beginning of the buffer.
     */
    unshift(value) {
        if (this.isFull()) {
            throw new RangeError('Ring buffer is full.');
        }
        this.begin = this.wrap(this.begin - 1);
        this.set(this.begin, value);
    }
    /**
     * Removes and returns the first item in the buffer.
     */
    shift() {
        if (this.isEmpty()) {
            throw new RangeError('Ring buffer is empty.');
        }
        const result = this.get(this.begin);
        this.set(this.begin, undefined);
        this.begin = this.wrap(this.begin + 1);
        return result;
    }
    /**
     * Removes and returns a specific item in the buffer, and moves the last item
     * to the vacated slot.  This is useful for implementing a shuffling stream.
     * Note that this operation necessarily scrambles the original order.
     *
     * @param relativeIndex: the index of the item to remove, relative to the
     *   first item in the buffer (e.g., hiding the ring nature of the underlying
     *   storage).
     */
    shuffleExcise(relativeIndex) {
        if (this.isEmpty()) {
            throw new RangeError('Ring buffer is empty.');
        }
        const index = this.wrap(this.begin + relativeIndex);
        const result = this.get(index);
        this.set(index, this.pop());
        return result;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmluZ19idWZmZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWRhdGEvc3JjL3V0aWwvcmluZ19idWZmZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFFSDs7R0FFRztBQUNILE1BQU0sT0FBTyxVQUFVO0lBVXJCOzs7T0FHRztJQUNILFlBQW1CLFFBQWdCO1FBQWhCLGFBQVEsR0FBUixRQUFRLENBQVE7UUFibkMsa0VBQWtFO1FBQ2xFLDhEQUE4RDtRQUM5RCxxRUFBcUU7UUFDM0QsVUFBSyxHQUFHLENBQUMsQ0FBQyxDQUFFLFlBQVk7UUFDeEIsUUFBRyxHQUFHLENBQUMsQ0FBQyxDQUFJLFlBQVk7UUFVaEMsSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFO1lBQ3BCLE1BQU0sSUFBSSxVQUFVLENBQUMsa0RBQWtELENBQUMsQ0FBQztTQUMxRTtRQUNELElBQUksUUFBUSxHQUFHLENBQUMsRUFBRTtZQUNoQixNQUFNLElBQUksVUFBVSxDQUFDLDRDQUE0QyxDQUFDLENBQUM7U0FDcEU7UUFDRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksS0FBSyxDQUFJLFFBQVEsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQztJQUN0QyxDQUFDO0lBRUQ7O09BRUc7SUFDTyxJQUFJLENBQUMsS0FBYTtRQUMxQixvQ0FBb0M7UUFDcEMsT0FBTyxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ2hCLEtBQUssSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDO1NBQy9CO1FBQ0QsT0FBTyxLQUFLLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUN0QyxDQUFDO0lBRVMsR0FBRyxDQUFDLEtBQWE7UUFDekIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ2IsTUFBTSxJQUFJLFVBQVUsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1NB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QUFDO1FBQ3BDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2QyxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxhQUFhLENBQUMsYUFBcUI7UUFDakMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDbEIsTUFBTSxJQUFJLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1NBQy9DO1FBQ0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDNUIsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuLyoqXG4gKiBBIHJpbmcgYnVmZmVyLCBwcm92aWRpbmcgTygxKSBGSUZPLCBMSUZPLCBhbmQgcmVsYXRlZCBvcGVyYXRpb25zLlxuICovXG5leHBvcnQgY2xhc3MgUmluZ0J1ZmZlcjxUPiB7XG4gIC8vIE5vdGUgd2Ugc3RvcmUgdGhlIGluZGljZXMgaW4gdGhlIHJhbmdlIDAgPD0gaW5kZXggPCAyKmNhcGFjaXR5LlxuICAvLyBUaGlzIGFsbG93cyB1cyB0byBkaXN0aW5ndWlzaCB0aGUgZnVsbCBmcm9tIHRoZSBlbXB0eSBjYXNlLlxuICAvLyBTZWUgaHR0cHM6Ly93d3cuc25lbGxtYW4ubmV0L2Jsb2cvYXJjaGl2ZS8yMDE2LTEyLTEzLXJpbmctYnVmZmVycy9cbiAgcHJvdGVjdGVkIGJlZ2luID0gMDsgIC8vIGluY2x1c2l2ZVxuICBwcm90ZWN0ZWQgZW5kID0gMDsgICAgLy8gZXhjbHVzaXZlXG4gIHByb3RlY3RlZCBkb3VibGVkQ2FwYWNpdHk6IG51bWJlcjtcblxuICBwcm90ZWN0ZWQgZGF0YTogVFtdO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgYFJpbmdCdWZmZXJgLlxuICAgKiBAcGFyYW0gY2FwYWNpdHkgVGhlIG51bWJlciBvZiBpdGVtcyB0aGF0IHRoZSBidWZmZXIgY2FuIGFjY29tb2RhdGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgY2FwYWNpdHk6IG51bWJlcikge1xuICAgIGlmIChjYXBhY2l0eSA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQ2FuXFwndCBjcmVhdGUgYSByaW5nIGJ1ZmZlciBvZiB1bmtub3duIGNhcGFjaXR5LicpO1xuICAgIH1cbiAgICBpZiAoY2FwYWNpdHkgPCAxKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQ2FuXFwndCBjcmVhdGUgcmluZyBidWZmZXIgb2YgY2FwYWNpdHkgPCAxLicpO1xuICAgIH1cbiAgICB0aGlzLmRhdGEgPSBuZXcgQXJyYXk8VD4oY2FwYWNpdHkpO1xuICAgIHRoaXMuZG91YmxlZENhcGFjaXR5ID0gMiAqIGNhcGFjaXR5O1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcCBhbnkgaW5kZXggaW50byB0aGUgcmFuZ2UgMCA8PSBpbmRleCA8IDIqY2FwYWNpdHkuXG4gICAqL1xuICBwcm90ZWN0ZWQgd3JhcChpbmRleDogbnVtYmVyKSB7XG4gICAgLy8gZG9uJ3QgdHJ1c3QgJSBvbiBuZWdhdGl2ZSBudW1iZXJzXG4gICAgd2hpbGUgKGluZGV4IDwgMCkge1xuICAgICAgaW5kZXggKz0gdGhpcy5kb3VibGVkQ2FwYWNpdHk7XG4gICAgfVxuICAgIHJldHVybiBpbmRleCAlIHRoaXMuZG91YmxlZENhcGFjaXR5O1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldChpbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0NhblxcJ3QgZ2V0IGl0ZW0gYXQgYSBuZWdhdGl2ZSBpbmRleC4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZGF0YVtpbmRleCAlIHRoaXMuY2FwYWNpdHldO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldChpbmRleDogbnVtYmVyLCB2YWx1ZTogVCkge1xuICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdDYW5cXCd0IHNldCBpdGVtIGF0IGEgbmVnYXRpdmUgaW5kZXguJyk7XG4gICAgfVxuICAgIHRoaXMuZGF0YVtpbmRleCAlIHRoaXMuY2FwYWNpdHldID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCBudW1iZXIgb2YgaXRlbXMgaW4gdGhlIGJ1ZmZlci5cbiAgICovXG4gIGxlbmd0aCgpOiBudW1iZXIge1xuICAgIGxldCBsZW5ndGggPSB0aGlzLmVuZCAtIHRoaXMuYmVnaW47XG4gICAgaWYgKGxlbmd0aCA8IDApIHtcbiAgICAgIGxlbmd0aCA9IHRoaXMuZG91YmxlZENhcGFjaXR5ICsgbGVuZ3RoO1xuICAgIH1cbiAgICByZXR1cm4gbGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcG9ydHMgd2hldGhlciB0aGUgYnVmZmVyIGlzIGZ1bGwuXG4gICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIG51bWJlciBvZiBpdGVtcyBpbiB0aGUgYnVmZmVyIGVxdWFscyBpdHMgY2FwYWNpdHksIGFuZFxuICAgKiAgIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGlzRnVsbCgpIHtcbiAgICByZXR1cm4gdGhpcy5sZW5ndGgoKSA9PT0gdGhpcy5jYXBhY2l0eTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBvcnRzIHdoZXRoZXIgdGhlIGJ1ZmZlciBpcyBlbXB0eS5cbiAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgbnVtYmVyIG9mIGl0ZW1zIGluIHRoZSBidWZmZXIgZXF1YWxzIHplcm8sIGFuZFxuICAgKiAgIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMubGVuZ3RoKCkgPT09IDA7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBpdGVtIHRvIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlci5cbiAgICovXG4gIHB1c2godmFsdWU6IFQpIHtcbiAgICBpZiAodGhpcy5pc0Z1bGwoKSkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1JpbmcgYnVmZmVyIGlzIGZ1bGwuJyk7XG4gICAgfVxuICAgIHRoaXMuc2V0KHRoaXMuZW5kLCB2YWx1ZSk7XG4gICAgdGhpcy5lbmQgPSB0aGlzLndyYXAodGhpcy5lbmQgKyAxKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIG1hbnkgaXRlbXMgdG8gdGhlIGVuZCBvZiB0aGUgYnVmZmVyLCBpbiBvcmRlci5cbiAgICovXG4gIHB1c2hBbGwodmFsdWVzOiBUW10pIHtcbiAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgdGhpcy5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyB0aGUgbGFzdCBpdGVtIGluIHRoZSBidWZmZXIuXG4gICAqL1xuICBwb3AoKTogVCB7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignUmluZyBidWZmZXIgaXMgZW1wdHkuJyk7XG4gICAgfVxuICAgIHRoaXMuZW5kID0gdGhpcy53cmFwKHRoaXMuZW5kIC0gMSk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5nZXQodGhpcy5lbmQpO1xuICAgIHRoaXMuc2V0KHRoaXMuZW5kLCB1bmRlZmluZWQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBpdGVtIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGJ1ZmZlci5cbiAgICovXG4gIHVuc2hpZnQodmFsdWU6IFQpIHtcbiAgICBpZiAodGhpcy5pc0Z1bGwoKSkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1JpbmcgYnVmZmVyIGlzIGZ1bGwuJyk7XG4gICAgfVxuICAgIHRoaXMuYmVnaW4gPSB0aGlzLndyYXAodGhpcy5iZWdpbiAtIDEpO1xuICAgIHRoaXMuc2V0KHRoaXMuYmVnaW4sIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuZCByZXR1cm5zIHRoZSBmaXJzdCBpdGVtIGluIHRoZSBidWZmZXIuXG4gICAqL1xuICBzaGlmdCgpOiBUIHtcbiAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdSaW5nIGJ1ZmZlciBpcyBlbXB0eS4nKTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5nZXQodGhpcy5iZWdpbik7XG4gICAgdGhpcy5zZXQodGhpcy5iZWdpbiwgdW5kZWZpbmVkKTtcbiAgICB0aGlzLmJlZ2luID0gdGhpcy53cmFwKHRoaXMuYmVnaW4gKyAxKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW5kIHJldHVybnMgYSBzcGVjaWZpYyBpdGVtIGluIHRoZSBidWZmZXIsIGFuZCBtb3ZlcyB0aGUgbGFzdCBpdGVtXG4gICAqIHRvIHRoZSB2YWNhdGVkIHNsb3QuICBUaGlzIGlzIHVzZWZ1bCBmb3IgaW1wbGVtZW50aW5nIGEgc2h1ZmZsaW5nIHN0cmVhbS5cbiAgICogTm90ZSB0aGF0IHRoaXMgb3BlcmF0aW9uIG5lY2Vzc2FyaWx5IHNjcmFtYmxlcyB0aGUgb3JpZ2luYWwgb3JkZXIuXG4gICAqXG4gICAqIEBwYXJhbSByZWxhdGl2ZUluZGV4OiB0aGUgaW5kZXggb2YgdGhlIGl0ZW0gdG8gcmVtb3ZlLCByZWxhdGl2ZSB0byB0aGVcbiAgICogICBmaXJzdCBpdGVtIGluIHRoZSBidWZmZXIgKGUuZy4sIGhpZGluZyB0aGUgcmluZyBuYXR1cmUgb2YgdGhlIHVuZGVybHlpbmdcbiAgICogICBzdG9yYWdlKS5cbiAgICovXG4gIHNodWZmbGVFeGNpc2UocmVsYXRpdmVJbmRleDogbnVtYmVyKTogVCB7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignUmluZyBidWZmZXIgaXMgZW1wdHkuJyk7XG4gICAgfVxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy53cmFwKHRoaXMuYmVnaW4gKyByZWxhdGl2ZUluZGV4KTtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmdldChpbmRleCk7XG4gICAgdGhpcy5zZXQoaW5kZXgsIHRoaXMucG9wKCkpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==