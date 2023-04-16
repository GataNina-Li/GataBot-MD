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
/// <amd-module name="@tensorflow/tfjs-layers/dist/utils/executor_utils" />
export declare class LruCache<T> {
    private cache;
    private maxEntries;
    constructor(maxEntries?: number);
    /**
     * Get the entry for the key and mark it as used recently.
     */
    get(key: string): T;
    /**
     * Put the entry into the cache. If the key already existed, mark the key as
     * used recently.
     */
    put(key: string, value: T): void;
    /**
     * Get the MaxEntries of the cache.
     */
    getMaxEntries(): number;
    /**
     * Set the MaxEntries of the cache. If the maxEntries is decreased, reduce
     * entries in the cache.
     */
    setMaxEntries(maxEntries: number): void;
}
