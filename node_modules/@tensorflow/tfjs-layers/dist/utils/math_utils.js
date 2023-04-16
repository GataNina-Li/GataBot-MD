/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
/**
 * Math utility functions.
 *
 * This file contains some frequently used math function that operates on
 * number[] or Float32Array and return a number. Many of these functions are
 * not-so-thick wrappers around TF.js Core functions. But they offer the
 * convenience of
 * 1) not having to convert the inputs into Tensors,
 * 2) not having to convert the returned Tensors to numbers.
 */
import { ValueError } from '../errors';
/**
 * Determine if a number is an integer.
 */
export function isInteger(x) {
    return x === parseInt(x.toString(), 10);
}
/**
 * Calculate the product of an array of numbers.
 * @param array The array to calculate the product over.
 * @param begin Beginning index, inclusive.
 * @param end Ending index, exclusive.
 * @return The product.
 */
export function arrayProd(array, begin, end) {
    if (begin == null) {
        begin = 0;
    }
    if (end == null) {
        end = array.length;
    }
    let prod = 1;
    for (let i = begin; i < end; ++i) {
        prod *= array[i];
    }
    return prod;
}
/**
 * Compute minimum value.
 * @param array
 * @return minimum value.
 */
export function min(array) {
    // same behavior as tf.min()
    if (array.length === 0) {
        return Number.NaN;
    }
    let min = Number.POSITIVE_INFINITY;
    for (let i = 0; i < array.length; i++) {
        const value = array[i];
        if (value < min) {
            min = value;
        }
    }
    return min;
}
/**
 * Compute maximum value.
 * @param array
 * @return maximum value
 */
export function max(array) {
    // same behavior as tf.max()
    if (array.length === 0) {
        return Number.NaN;
    }
    let max = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < array.length; i++) {
        const value = array[i];
        if (value > max) {
            max = value;
        }
    }
    return max;
}
/**
 * Compute sum of array.
 * @param array
 * @return The sum.
 */
export function sum(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        const value = array[i];
        sum += value;
    }
    return sum;
}
/**
 * Compute mean of array.
 * @param array
 * @return The mean.
 */
export function mean(array) {
    return sum(array) / array.length;
}
/**
 * Compute variance of array.
 * @param array
 * @return The variance.
 */
export function variance(array) {
    const meanValue = mean(array);
    const demeaned = array.map((value) => value - meanValue);
    let sumSquare = 0;
    for (let i = 0; i < demeaned.length; i++) {
        const value = demeaned[i];
        sumSquare += value * value;
    }
    return sumSquare / array.length;
}
/**
 * Compute median of array.
 * @param array
 * @return The median value.
 */
export function median(array) {
    const arraySorted = array.slice().sort((a, b) => a - b);
    const lowIdx = Math.floor((arraySorted.length - 1) / 2);
    const highIdx = Math.ceil((arraySorted.length - 1) / 2);
    if (lowIdx === highIdx) {
        return arraySorted[lowIdx];
    }
    return (arraySorted[lowIdx] + arraySorted[highIdx]) / 2;
}
/**
 * Generate an array of integers in [begin, end).
 * @param begin Beginning integer, inclusive.
 * @param end Ending integer, exclusive.
 * @returns Range array.
 * @throws ValueError, iff `end` < `begin`.
 */
export function range(begin, end) {
    if (end < begin) {
        throw new ValueError(`end (${end}) < begin (${begin}) is forbidden.`);
    }
    const out = [];
    for (let i = begin; i < end; ++i) {
        out.push(i);
    }
    return out;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0aF91dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtbGF5ZXJzL3NyYy91dGlscy9tYXRoX3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztHQVFHO0FBRUg7Ozs7Ozs7OztHQVNHO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUlyQzs7R0FFRztBQUNILE1BQU0sVUFBVSxTQUFTLENBQUMsQ0FBUztJQUNqQyxPQUFPLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLFVBQVUsU0FBUyxDQUNyQixLQUEwQixFQUFFLEtBQWMsRUFBRSxHQUFZO0lBQzFELElBQUksS0FBSyxJQUFJLElBQUksRUFBRTtRQUNqQixLQUFLLEdBQUcsQ0FBQyxDQUFDO0tBQ1g7SUFDRCxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7UUFDZixHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztLQUNwQjtJQUVELElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNiLEtBQUssSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDaEMsSUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsQjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsR0FBRyxDQUFDLEtBQTRCO0lBQzlDLDRCQUE0QjtJQUM1QixJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ3RCLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQztLQUNuQjtJQUNELElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztJQUNu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TyxFQUFFO1FBQ3RCLE9BQU8sV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzVCO0lBQ0QsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDMUQsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILE1BQU0sVUFBVSxLQUFLLENBQUMsS0FBYSxFQUFFLEdBQVc7SUFDOUMsSUFBSSxHQUFHLEdBQUcsS0FBSyxFQUFFO1FBQ2YsTUFBTSxJQUFJLFVBQVUsQ0FBQyxRQUFRLEdBQUcsY0FBYyxLQUFLLGlCQUFpQixDQUFDLENBQUM7S0FDdkU7SUFDRCxNQUFNLEdBQUcsR0FBYSxFQUFFLENBQUM7SUFDekIsS0FBSyxJQUFJLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUNoQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2I7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gKiBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAqIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG4vKipcbiAqIE1hdGggdXRpbGl0eSBmdW5jdGlvbnMuXG4gKlxuICogVGhpcyBmaWxlIGNvbnRhaW5zIHNvbWUgZnJlcXVlbnRseSB1c2VkIG1hdGggZnVuY3Rpb24gdGhhdCBvcGVyYXRlcyBvblxuICogbnVtYmVyW10gb3IgRmxvYXQzMkFycmF5IGFuZCByZXR1cm4gYSBudW1iZXIuIE1hbnkgb2YgdGhlc2UgZnVuY3Rpb25zIGFyZVxuICogbm90LXNvLXRoaWNrIHdyYXBwZXJzIGFyb3VuZCBURi5qcyBDb3JlIGZ1bmN0aW9ucy4gQnV0IHRoZXkgb2ZmZXIgdGhlXG4gKiBjb252ZW5pZW5jZSBvZlxuICogMSkgbm90IGhhdmluZyB0byBjb252ZXJ0IHRoZSBpbnB1dHMgaW50byBUZW5zb3JzLFxuICogMikgbm90IGhhdmluZyB0byBjb252ZXJ0IHRoZSByZXR1cm5lZCBUZW5zb3JzIHRvIG51bWJlcnMuXG4gKi9cblxuaW1wb3J0IHtWYWx1ZUVycm9yfSBmcm9tICcuLi9lcnJvcnMnO1xuXG5leHBvcnQgdHlwZSBBcnJheVR5cGVzID0gVWludDhBcnJheXxJbnQzMkFycmF5fEZsb2F0MzJBcnJheTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSBudW1iZXIgaXMgYW4gaW50ZWdlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSW50ZWdlcih4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIHggPT09IHBhcnNlSW50KHgudG9TdHJpbmcoKSwgMTApO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aGUgcHJvZHVjdCBvZiBhbiBhcnJheSBvZiBudW1iZXJzLlxuICogQHBhcmFtIGFycmF5IFRoZSBhcnJheSB0byBjYWxjdWxhdGUgdGhlIHByb2R1Y3Qgb3Zlci5cbiAqIEBwYXJhbSBiZWdpbiBCZWdpbm5pbmcgaW5kZXgsIGluY2x1c2l2ZS5cbiAqIEBwYXJhbSBlbmQgRW5kaW5nIGluZGV4LCBleGNsdXNpdmUuXG4gKiBAcmV0dXJuIFRoZSBwcm9kdWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlQcm9kKFxuICAgIGFycmF5OiBudW1iZXJbXXxBcnJheVR5cGVzLCBiZWdpbj86IG51bWJlciwgZW5kPzogbnVtYmVyKTogbnVtYmVyIHtcbiAgaWYgKGJlZ2luID09IG51bGwpIHtcbiAgICBiZWdpbiA9IDA7XG4gIH1cbiAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgZW5kID0gYXJyYXkubGVuZ3RoO1xuICB9XG5cbiAgbGV0IHByb2QgPSAxO1xuICBmb3IgKGxldCBpID0gYmVnaW47IGkgPCBlbmQ7ICsraSkge1xuICAgIHByb2QgKj0gYXJyYXlbaV07XG4gIH1cbiAgcmV0dXJuIHByb2Q7XG59XG5cbi8qKlxuICogQ29tcHV0ZSBtaW5pbXVtIHZhbHVlLlxuICogQHBhcmFtIGFycmF5XG4gKiBAcmV0dXJuIG1pbmltdW0gdmFsdWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaW4oYXJyYXk6IG51bWJlcltdfEZsb2F0MzJBcnJheSk6IG51bWJlciB7XG4gIC8vIHNhbWUgYmVoYXZpb3IgYXMgdGYubWluKClcbiAgaWYgKGFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBOdW1iZXIuTmFOO1xuICB9XG4gIGxldCBtaW4gPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCB2YWx1ZSA9IGFycmF5W2ldO1xuICAgIGlmICh2YWx1ZSA8IG1pbikge1xuICAgICAgbWluID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBtaW47XG59XG5cbi8qKlxuICogQ29tcHV0ZSBtYXhpbXVtIHZhbHVlLlxuICogQHBhcmFtIGFycmF5XG4gKiBAcmV0dXJuIG1heGltdW0gdmFsdWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1heChhcnJheTogbnVtYmVyW118RmxvYXQzMkFycmF5KTogbnVtYmVyIHtcbiAgLy8gc2FtZSBiZWhhdmlvciBhcyB0Zi5tYXgoKVxuICBpZiAoYXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIE51bWJlci5OYU47XG4gIH1cbiAgbGV0IG1heCA9IE51bWJlci5ORUdBVElWRV9JTkZJTklUWTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHZhbHVlID0gYXJyYXlbaV07XG4gICAgaWYgKHZhbHVlID4gbWF4KSB7XG4gICAgICBtYXggPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1heDtcbn1cblxuLyoqXG4gKiBDb21wdXRlIHN1bSBvZiBhcnJheS5cbiAqIEBwYXJhbSBhcnJheVxuICogQHJldHVybiBUaGUgc3VtLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3VtKGFycmF5OiBudW1iZXJbXXxGbG9hdDMyQXJyYXkpOiBudW1iZXIge1xuICBsZXQgc3VtID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHZhbHVlID0gYXJyYXlbaV07XG4gICAgc3VtICs9IHZhbHVlO1xuICB9XG4gIHJldHVybiBzdW07XG59XG5cbi8qKlxuICogQ29tcHV0ZSBtZWFuIG9mIGFycmF5LlxuICogQHBhcmFtIGFycmF5XG4gKiBAcmV0dXJuIFRoZSBtZWFuLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVhbihhcnJheTogbnVtYmVyW118RmxvYXQzMkFycmF5KTogbnVtYmVyIHtcbiAgcmV0dXJuIHN1bShhcnJheSkgLyBhcnJheS5sZW5ndGg7XG59XG5cbi8qKlxuICogQ29tcHV0ZSB2YXJpYW5jZSBvZiBhcnJheS5cbiAqIEBwYXJhbSBhcnJheVxuICogQHJldHVybiBUaGUgdmFyaWFuY2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YXJpYW5jZShhcnJheTogbnVtYmVyW118RmxvYXQzMkFycmF5KTogbnVtYmVyIHtcbiAgY29uc3QgbWVhblZhbHVlID0gbWVhbihhcnJheSk7XG4gIGNvbnN0IGRlbWVhbmVkID0gYXJyYXkubWFwKCh2YWx1ZTogbnVtYmVyKSA9PiB2YWx1ZSAtIG1lYW5WYWx1ZSk7XG4gIGxldCBzdW1TcXVhcmUgPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGRlbWVhbmVkLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgdmFsdWUgPSBkZW1lYW5lZFtpXTtcbiAgICBzdW1TcXVhcmUgKz0gdmFsdWUgKiB2YWx1ZTtcbiAgfVxuICByZXR1cm4gc3VtU3F1YXJlIC8gYXJyYXkubGVuZ3RoO1xufVxuXG4vKipcbiAqIENvbXB1dGUgbWVkaWFuIG9mIGFycmF5LlxuICogQHBhcmFtIGFycmF5XG4gKiBAcmV0dXJuIFRoZSBtZWRpYW4gdmFsdWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZWRpYW4oYXJyYXk6IG51bWJlcltdfEZsb2F0MzJBcnJheSk6IG51bWJlciB7XG4gIGNvbnN0IGFycmF5U29ydGVkID0gYXJyYXkuc2xpY2UoKS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG4gIGNvbnN0IGxvd0lkeCA9IE1hdGguZmxvb3IoKGFycmF5U29ydGVkLmxlbmd0aCAtIDEpIC8gMik7XG4gIGNvbnN0IGhpZ2hJZHggPSBNYXRoLmNlaWwoKGFycmF5U29ydGVkLmxlbmd0aCAtIDEpIC8gMik7XG4gIGlmIChsb3dJZHggPT09IGhpZ2hJZHgpIHtcbiAgICByZXR1cm4gYXJyYXlTb3J0ZWRbbG93SWR4XTtcbiAgfVxuICByZXR1cm4gKGFycmF5U29ydGVkW2xvd0lkeF0gKyBhcnJheVNvcnRlZFtoaWdoSWR4XSkgLyAyO1xufVxuXG4vKipcbiAqIEdlbmVyYXRlIGFuIGFycmF5IG9mIGludGVnZXJzIGluIFtiZWdpbiwgZW5kKS5cbiAqIEBwYXJhbSBiZWdpbiBCZWdpbm5pbmcgaW50ZWdlciwgaW5jbHVzaXZlLlxuICogQHBhcmFtIGVuZCBFbmRpbmcgaW50ZWdlciwgZXhjbHVzaXZlLlxuICogQHJldHVybnMgUmFuZ2UgYXJyYXkuXG4gKiBAdGhyb3dzIFZhbHVlRXJyb3IsIGlmZiBgZW5kYCA8IGBiZWdpbmAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYW5nZShiZWdpbjogbnVtYmVyLCBlbmQ6IG51bWJlcik6IG51bWJlcltdIHtcbiAgaWYgKGVuZCA8IGJlZ2luKSB7XG4gICAgdGhyb3cgbmV3IFZhbHVlRXJyb3IoYGVuZCAoJHtlbmR9KSA8IGJlZ2luICgke2JlZ2lufSkgaXMgZm9yYmlkZGVuLmApO1xuICB9XG4gIGNvbnN0IG91dDogbnVtYmVyW10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IGJlZ2luOyBpIDwgZW5kOyArK2kpIHtcbiAgICBvdXQucHVzaChpKTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIl19