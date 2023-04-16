/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
 * =============================================================================
 */
import { keep, scalar, stack, tidy, unstack, util } from '@tensorflow/tfjs-core';
// tslint:disable-next-line: no-imports-from-dist
import * as tfOps from '@tensorflow/tfjs-core/dist/ops/ops_for_converter';
/**
 * Hashtable contains a set of tensors, which can be accessed by key.
 */
export class HashTable {
    /**
     * Constructor of HashTable. Creates a hash table.
     *
     * @param keyDType `dtype` of the table keys.
     * @param valueDType `dtype` of the table values.
     */
    constructor(keyDType, valueDType) {
        this.keyDType = keyDType;
        this.valueDType = valueDType;
        this.handle = scalar(0);
        // tslint:disable-next-line: no-any
        this.tensorMap = new Map();
        keep(this.handle);
    }
    get id() {
        return this.handle.id;
    }
    /**
     * Dispose the tensors and handle and clear the hashtable.
     */
    clearAndClose() {
        this.tensorMap.forEach(value => value.dispose());
        this.tensorMap.clear();
        this.handle.dispose();
    }
    /**
     * The number of items in the hash table.
     */
    size() {
        return this.tensorMap.size;
    }
    /**
     * The number of items in the hash table as a rank-0 tensor.
     */
    tensorSize() {
        return tfOps.scalar(this.size(), 'int32');
    }
    /**
     * Replaces the contents of the table with the specified keys and values.
     * @param keys Keys to store in the hashtable.
     * @param values Values to store in the hashtable.
     */
    async import(keys, values) {
        this.checkKeyAndValueTensor(keys, values);
        // We only store the primitive values of the keys, this allows lookup
        // to be O(1).
        const $keys = await keys.data();
        // Clear the hashTable before inserting new values.
        this.tensorMap.forEach(value => value.dispose());
        this.tensorMap.clear();
        return tidy(() => {
            const $values = unstack(values);
            const keysLength = $keys.length;
            const valuesLength = $values.length;
            util.assert(keysLength === valuesLength, () => `The number of elements doesn't match, keys has ` +
                `${keysLength} elements, the values has ${valuesLength} ` +
                `elements.`);
            for (let i = 0; i < keysLength; i++) {
                const key = $keys[i];
                const value = $values[i];
                keep(value);
                this.tensorMap.set(key, value);
            }
            return this.handle;
        });
    }
    /**
     * Looks up keys in a hash table, outputs the corresponding values.
     *
     * Performs batch lookups, for every element in the key tensor, `find`
     * stacks the corresponding value into the return tensor.
     *
     * If an element is not present in the table, the given `defaultValue` is
     * used.
     *
     * @param keys Keys to look up. Must have the same type as the keys of the
     *     table.
     * @param defaultValue The scalar `defaultValue` is the value output for keys
     *     not present in the table. It must also be of the same type as the
     *     table values.
     */
    async find(keys, defaultValue) {
        this.checkKeyAndValueTensor(keys, defaultValue);
        const $keys = await keys.data();
        return tidy(() => {
            const result = [];
            for (let i = 0; i < $keys.length; i++) {
                const key = $keys[i];
                const value = this.findWithDefault(key, defaultValue);
                result.push(value);
            }
            return stack(result);
        });
    }
    // tslint:disable-next-line: no-any
    findWithDefault(key, defaultValue) {
        const result = this.tensorMap.get(key);
        return result != null ? result : defaultValue;
    }
    checkKeyAndValueTensor(key, value) {
        if (key.dtype !== this.keyDType) {
            throw new Error(`Expect key dtype ${this.keyDType}, but got ` +
                `${key.dtype}`);
        }
        if (value.dtype !== this.valueDType) {
            throw new Error(`Expect value dtype ${this.valueDType}, but got ` +
                `${value.dtype}`);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaF90YWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29udmVydGVyL3NyYy9leGVjdXRvci9oYXNoX3RhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE9BQU8sRUFBVyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBVSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2pHLGlEQUFpRDtBQUNqRCxPQUFPLEtBQUssS0FBSyxNQUFNLGtEQUFrRCxDQUFDO0FBRTFFOztHQUVHO0FBQ0gsTUFBTSxPQUFPLFNBQVM7SUFVcEI7Ozs7O09BS0c7SUFDSCxZQUFxQixRQUFrQixFQUFXLFVBQW9CO1FBQWpELGFBQVEsR0FBUixRQUFRLENBQVU7UUFBVyxlQUFVLEdBQVYsVUFBVSxDQUFVO1FBQ3BFLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLG1DQUFtQztRQUNuQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFlLENBQUM7UUFFeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBaEJELElBQUksRUFBRTtRQUNKLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQWdCRDs7T0FFRztJQUNILGFBQWE7UUFDWCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFJO1FBQ0YsT0FB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QUM7SUFFTyxzQkFBc0IsQ0FBQyxHQUFXLEVBQUUsS0FBYTtRQUN2RCxJQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUMvQixNQUFNLElBQUksS0FBSyxDQUNYLG9CQUFvQixJQUFJLENBQUMsUUFBUSxZQUFZO2dCQUM3QyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQ3JCO1FBRUQsSUFBSSxLQUFLLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FDWCxzQkFBc0IsSUFBSSxDQUFDLFVBQVUsWUFBWTtnQkFDakQsR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUN2QjtJQUNILENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbmltcG9ydCB7RGF0YVR5cGUsIGtlZXAsIHNjYWxhciwgc3RhY2ssIFRlbnNvciwgdGlkeSwgdW5zdGFjaywgdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8taW1wb3J0cy1mcm9tLWRpc3RcbmltcG9ydCAqIGFzIHRmT3BzIGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZS9kaXN0L29wcy9vcHNfZm9yX2NvbnZlcnRlcic7XG5cbi8qKlxuICogSGFzaHRhYmxlIGNvbnRhaW5zIGEgc2V0IG9mIHRlbnNvcnMsIHdoaWNoIGNhbiBiZSBhY2Nlc3NlZCBieSBrZXkuXG4gKi9cbmV4cG9ydCBjbGFzcyBIYXNoVGFibGUge1xuICByZWFkb25seSBoYW5kbGU6IFRlbnNvcjtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLWFueVxuICBwcml2YXRlIHRlbnNvck1hcDogTWFwPGFueSwgVGVuc29yPjtcblxuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlLmlkO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIG9mIEhhc2hUYWJsZS4gQ3JlYXRlcyBhIGhhc2ggdGFibGUuXG4gICAqXG4gICAqIEBwYXJhbSBrZXlEVHlwZSBgZHR5cGVgIG9mIHRoZSB0YWJsZSBrZXlzLlxuICAgKiBAcGFyYW0gdmFsdWVEVHlwZSBgZHR5cGVgIG9mIHRoZSB0YWJsZSB2YWx1ZXMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihyZWFkb25seSBrZXlEVHlwZTogRGF0YVR5cGUsIHJlYWRvbmx5IHZhbHVlRFR5cGU6IERhdGFUeXBlKSB7XG4gICAgdGhpcy5oYW5kbGUgPSBzY2FsYXIoMCk7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1hbnlcbiAgICB0aGlzLnRlbnNvck1hcCA9IG5ldyBNYXA8YW55LCBUZW5zb3I+KCk7XG5cbiAgICBrZWVwKHRoaXMuaGFuZGxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwb3NlIHRoZSB0ZW5zb3JzIGFuZCBoYW5kbGUgYW5kIGNsZWFyIHRoZSBoYXNodGFibGUuXG4gICAqL1xuICBjbGVhckFuZENsb3NlKCkge1xuICAgIHRoaXMudGVuc29yTWFwLmZvckVhY2godmFsdWUgPT4gdmFsdWUuZGlzcG9zZSgpKTtcbiAgICB0aGlzLnRlbnNvck1hcC5jbGVhcigpO1xuICAgIHRoaXMuaGFuZGxlLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGl0ZW1zIGluIHRoZSBoYXNoIHRhYmxlLlxuICAgKi9cbiAgc2l6ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnRlbnNvck1hcC5zaXplO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgaXRlbXMgaW4gdGhlIGhhc2ggdGFibGUgYXMgYSByYW5rLTAgdGVuc29yLlxuICAgKi9cbiAgdGVuc29yU2l6ZSgpOiBUZW5zb3Ige1xuICAgIHJldHVybiB0Zk9wcy5zY2FsYXIodGhpcy5zaXplKCksICdpbnQzMicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2VzIHRoZSBjb250ZW50cyBvZiB0aGUgdGFibGUgd2l0aCB0aGUgc3BlY2lmaWVkIGtleXMgYW5kIHZhbHVlcy5cbiAgICogQHBhcmFtIGtleXMgS2V5cyB0byBzdG9yZSBpbiB0aGUgaGFzaHRhYmxlLlxuICAgKiBAcGFyYW0gdmFsdWVzIFZhbHVlcyB0byBzdG9yZSBpbiB0aGUgaGFzaHRhYmxlLlxuICAgKi9cbiAgYXN5bmMgaW1wb3J0KGtleXM6IFRlbnNvciwgdmFsdWVzOiBUZW5zb3IpOiBQcm9taXNlPFRlbnNvcj4ge1xuICAgIHRoaXMuY2hlY2tLZXlBbmRWYWx1ZVRlbnNvcihrZXlzLCB2YWx1ZXMpO1xuXG4gICAgLy8gV2Ugb25seSBzdG9yZSB0aGUgcHJpbWl0aXZlIHZhbHVlcyBvZiB0aGUga2V5cywgdGhpcyBhbGxvd3MgbG9va3VwXG4gICAgLy8gdG8gYmUgTygxKS5cbiAgICBjb25zdCAka2V5cyA9IGF3YWl0IGtleXMuZGF0YSgpO1xuXG4gICAgLy8gQ2xlYXIgdGhlIGhhc2hUYWJsZSBiZWZvcmUgaW5zZXJ0aW5nIG5ldyB2YWx1ZXMuXG4gICAgdGhpcy50ZW5zb3JNYXAuZm9yRWFjaCh2YWx1ZSA9PiB2YWx1ZS5kaXNwb3NlKCkpO1xuICAgIHRoaXMudGVuc29yTWFwLmNsZWFyKCk7XG5cbiAgICByZXR1cm4gdGlkeSgoKSA9PiB7XG4gICAgICBjb25zdCAkdmFsdWVzID0gdW5zdGFjayh2YWx1ZXMpO1xuXG4gICAgICBjb25zdCBrZXlzTGVuZ3RoID0gJGtleXMubGVuZ3RoO1xuICAgICAgY29uc3QgdmFsdWVzTGVuZ3RoID0gJHZhbHVlcy5sZW5ndGg7XG5cbiAgICAgIHV0aWwuYXNzZXJ0KFxuICAgICAgICAgIGtleXNMZW5ndGggPT09IHZhbHVlc0xlbmd0aCxcbiAgICAgICAgICAoKSA9PiBgVGhlIG51bWJlciBvZiBlbGVtZW50cyBkb2Vzbid0IG1hdGNoLCBrZXlzIGhhcyBgICtcbiAgICAgICAgICAgICAgYCR7a2V5c0xlbmd0aH0gZWxlbWVudHMsIHRoZSB2YWx1ZXMgaGFzICR7dmFsdWVzTGVuZ3RofSBgICtcbiAgICAgICAgICAgICAgYGVsZW1lbnRzLmApO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXNMZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBrZXkgPSAka2V5c1tpXTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSAkdmFsdWVzW2ldO1xuXG4gICAgICAgIGtlZXAodmFsdWUpO1xuICAgICAgICB0aGlzLnRlbnNvck1hcC5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb29rcyB1cCBrZXlzIGluIGEgaGFzaCB0YWJsZSwgb3V0cHV0cyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gICAqXG4gICAqIFBlcmZvcm1zIGJhdGNoIGxvb2t1cHMsIGZvciBldmVyeSBlbGVtZW50IGluIHRoZSBrZXkgdGVuc29yLCBgZmluZGBcbiAgICogc3RhY2tzIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlIGludG8gdGhlIHJldHVybiB0ZW5zb3IuXG4gICAqXG4gICAqIElmIGFuIGVsZW1lbnQgaXMgbm90IHByZXNlbnQgaW4gdGhlIHRhYmxlLCB0aGUgZ2l2ZW4gYGRlZmF1bHRWYWx1ZWAgaXNcbiAgICogdXNlZC5cbiAgICpcbiAgICogQHBhcmFtIGtleXMgS2V5cyB0byBsb29rIHVwLiBNdXN0IGhhdmUgdGhlIHNhbWUgdHlwZSBhcyB0aGUga2V5cyBvZiB0aGVcbiAgICogICAgIHRhYmxlLlxuICAgKiBAcGFyYW0gZGVmYXVsdFZhbHVlIFRoZSBzY2FsYXIgYGRlZmF1bHRWYWx1ZWAgaXMgdGhlIHZhbHVlIG91dHB1dCBmb3Iga2V5c1xuICAgKiAgICAgbm90IHByZXNlbnQgaW4gdGhlIHRhYmxlLiBJdCBtdXN0IGFsc28gYmUgb2YgdGhlIHNhbWUgdHlwZSBhcyB0aGVcbiAgICogICAgIHRhYmxlIHZhbHVlcy5cbiAgICovXG4gIGFzeW5jIGZpbmQoa2V5czogVGVuc29yLCBkZWZhdWx0VmFsdWU6IFRlbnNvcik6IFByb21pc2U8VGVuc29yPiB7XG4gICAgdGhpcy5jaGVja0tleUFuZFZhbHVlVGVuc29yKGtleXMsIGRlZmF1bHRWYWx1ZSk7XG5cbiAgICBjb25zdCAka2V5cyA9IGF3YWl0IGtleXMuZGF0YSgpO1xuXG4gICAgcmV0dXJuIHRpZHkoKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0OiBUZW5zb3JbXSA9IFtdO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGtleSA9ICRrZXlzW2ldO1xuXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5maW5kV2l0aERlZmF1bHQoa2V5LCBkZWZhdWx0VmFsdWUpO1xuICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdGFjayhyZXN1bHQpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1hbnlcbiAgcHJpdmF0ZSBmaW5kV2l0aERlZmF1bHQoa2V5OiBhbnksIGRlZmF1bHRWYWx1ZTogVGVuc29yKTogVGVuc29yIHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLnRlbnNvck1hcC5nZXQoa2V5KTtcblxuICAgIHJldHVybiByZXN1bHQgIT0gbnVsbCA/IHJlc3VsdCA6IGRlZmF1bHRWYWx1ZTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tLZXlBbmRWYWx1ZVRlbnNvcihrZXk6IFRlbnNvciwgdmFsdWU6IFRlbnNvcikge1xuICAgIGlmIChrZXkuZHR5cGUgIT09IHRoaXMua2V5RFR5cGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgRXhwZWN0IGtleSBkdHlwZSAke3RoaXMua2V5RFR5cGV9LCBidXQgZ290IGAgK1xuICAgICAgICAgIGAke2tleS5kdHlwZX1gKTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUuZHR5cGUgIT09IHRoaXMudmFsdWVEVHlwZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBFeHBlY3QgdmFsdWUgZHR5cGUgJHt0aGlzLnZhbHVlRFR5cGV9LCBidXQgZ290IGAgK1xuICAgICAgICAgIGAke3ZhbHVlLmR0eXBlfWApO1xuICAgIH1cbiAgfVxufVxuIl19