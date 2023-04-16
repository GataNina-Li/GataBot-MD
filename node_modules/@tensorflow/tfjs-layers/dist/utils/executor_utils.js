/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
/**
 * LruCache: A mapping from the String to T. If the number of the entries is
 * exceeding the `maxEntries`, the LruCache will delete the least recently
 * used entry.
 */
export class LruCache {
    constructor(maxEntries) {
        this.maxEntries = maxEntries || 100;
        this.cache = new Map();
    }
    /**
     * Get the entry for the key and mark it as used recently.
     */
    get(key) {
        let entry;
        if (this.cache.has(key)) {
            entry = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, entry);
        }
        return entry;
    }
    /**
     * Put the entry into the cache. If the key already existed, mark the key as
     * used recently.
     */
    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        else if (this.cache.size >= this.maxEntries) {
            const keyToDelete = this.cache.keys().next().value;
            this.cache.delete(keyToDelete);
        }
        this.cache.set(key, value);
    }
    /**
     * Get the MaxEntries of the cache.
     */
    getMaxEntries() {
        return this.maxEntries;
    }
    /**
     * Set the MaxEntries of the cache. If the maxEntries is decreased, reduce
     * entries in the cache.
     */
    setMaxEntries(maxEntries) {
        if (maxEntries < 0) {
            throw new Error(`The maxEntries of LRU caches must be at least 0, but got ${maxEntries}.`);
        }
        if (this.maxEntries > maxEntries) {
            for (let i = 0; i < this.maxEntries - maxEntries; i++) {
                const keyToDelete = this.cache.keys().next().value;
                this.cache.delete(keyToDelete);
            }
        }
        this.maxEntries = maxEntries;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlY3V0b3JfdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWxheWVycy9zcmMvdXRpbHMvZXhlY3V0b3JfdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0dBUUc7QUFDSDs7OztHQUlHO0FBRUgsTUFBTSxPQUFPLFFBQVE7SUFJbkIsWUFBWSxVQUFtQjtRQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsSUFBSSxHQUFHLENBQUM7UUFDcEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsRUFBYSxDQUFDO0lBQ3BDLENBQUM7SUFFRDs7T0FFRztJQUNJLEdBQUcsQ0FBQyxHQUFXO1FBQ3BCLElBQUksS0FBUSxDQUFDO1FBQ2IsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN2QixLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzVCO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksR0FBRyxDQUFDLEdBQVcsRUFBRSxLQUFRO1FBQzlCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDeEI7YUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDN0MsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDbkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDaEM7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVEOztPQUVHO0lBQ0ksYUFBYTtRQUNsQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLGFBQWEsQ0FBQyxVQUFrQjtRQUNyQyxJQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUU7WUFDbEIsTUFBTSxJQUFJLEtBQUssQ0FDWCw0REFDSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1NBQ3hCO1FBRUQsSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsRUFBRTtZQUNoQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3JELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDO2dCQUNuRCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUNoQztTQUNGO1FBRUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7SUFDL0IsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjIgR29vZ2xlIExMQ1xuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICogbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gKiBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbi8qKlxuICogTHJ1Q2FjaGU6IEEgbWFwcGluZyBmcm9tIHRoZSBTdHJpbmcgdG8gVC4gSWYgdGhlIG51bWJlciBvZiB0aGUgZW50cmllcyBpc1xuICogZXhjZWVkaW5nIHRoZSBgbWF4RW50cmllc2AsIHRoZSBMcnVDYWNoZSB3aWxsIGRlbGV0ZSB0aGUgbGVhc3QgcmVjZW50bHlcbiAqIHVzZWQgZW50cnkuXG4gKi9cblxuZXhwb3J0IGNsYXNzIExydUNhY2hlPFQ+IHtcbiAgcHJpdmF0ZSBjYWNoZTogTWFwPHN0cmluZywgVD47XG4gIHByaXZhdGUgbWF4RW50cmllczogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKG1heEVudHJpZXM/OiBudW1iZXIpIHtcbiAgICB0aGlzLm1heEVudHJpZXMgPSBtYXhFbnRyaWVzIHx8IDEwMDtcbiAgICB0aGlzLmNhY2hlID0gbmV3IE1hcDxzdHJpbmcsIFQ+KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBlbnRyeSBmb3IgdGhlIGtleSBhbmQgbWFyayBpdCBhcyB1c2VkIHJlY2VudGx5LlxuICAgKi9cbiAgcHVibGljIGdldChrZXk6IHN0cmluZyk6IFQge1xuICAgIGxldCBlbnRyeTogVDtcbiAgICBpZiAodGhpcy5jYWNoZS5oYXMoa2V5KSkge1xuICAgICAgZW50cnkgPSB0aGlzLmNhY2hlLmdldChrZXkpO1xuICAgICAgdGhpcy5jYWNoZS5kZWxldGUoa2V5KTtcbiAgICAgIHRoaXMuY2FjaGUuc2V0KGtleSwgZW50cnkpO1xuICAgIH1cbiAgICByZXR1cm4gZW50cnk7XG4gIH1cblxuICAvKipcbiAgICogUHV0IHRoZSBlbnRyeSBpbnRvIHRoZSBjYWNoZS4gSWYgdGhlIGtleSBhbHJlYWR5IGV4aXN0ZWQsIG1hcmsgdGhlIGtleSBhc1xuICAgKiB1c2VkIHJlY2VudGx5LlxuICAgKi9cbiAgcHVibGljIHB1dChrZXk6IHN0cmluZywgdmFsdWU6IFQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jYWNoZS5oYXMoa2V5KSkge1xuICAgICAgdGhpcy5jYWNoZS5kZWxldGUoa2V5KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY2FjaGUuc2l6ZSA+PSB0aGlzLm1heEVudHJpZXMpIHtcbiAgICAgIGNvbnN0IGtleVRvRGVsZXRlID0gdGhpcy5jYWNoZS5rZXlzKCkubmV4dCgpLnZhbHVlO1xuICAgICAgdGhpcy5jYWNoZS5kZWxldGUoa2V5VG9EZWxldGUpO1xuICAgIH1cbiAgICB0aGlzLmNhY2hlLnNldChrZXksIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIE1heEVudHJpZXMgb2YgdGhlIGNhY2hlLlxuICAgKi9cbiAgcHVibGljIGdldE1heEVudHJpZXMoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5tYXhFbnRyaWVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgTWF4RW50cmllcyBvZiB0aGUgY2FjaGUuIElmIHRoZSBtYXhFbnRyaWVzIGlzIGRlY3JlYXNlZCwgcmVkdWNlXG4gICAqIGVudHJpZXMgaW4gdGhlIGNhY2hlLlxuICAgKi9cbiAgcHVibGljIHNldE1heEVudHJpZXMobWF4RW50cmllczogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKG1heEVudHJpZXMgPCAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYFRoZSBtYXhFbnRyaWVzIG9mIExSVSBjYWNoZXMgbXVzdCBiZSBhdCBsZWFzdCAwLCBidXQgZ290ICR7XG4gICAgICAgICAgICAgIG1heEVudHJpZXN9LmApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1heEVudHJpZXMgPiBtYXhFbnRyaWVzKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWF4RW50cmllcyAtIG1heEVudHJpZXM7IGkrKykge1xuICAgICAgICBjb25zdCBrZXlUb0RlbGV0ZSA9IHRoaXMuY2FjaGUua2V5cygpLm5leHQoKS52YWx1ZTtcbiAgICAgICAgdGhpcy5jYWNoZS5kZWxldGUoa2V5VG9EZWxldGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMubWF4RW50cmllcyA9IG1heEVudHJpZXM7XG4gIH1cbn1cbiJdfQ==