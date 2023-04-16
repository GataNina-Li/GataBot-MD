/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
/**
 * Inserts a value into a sorted array. This method allows duplicate, meaning it
 * allows inserting duplicate value, in which case, the element will be inserted
 * at the lowest index of the value.
 * @param arr The array to modify.
 * @param element The element to insert.
 * @param comparator Optional. If no comparator is specified, elements are
 * compared using array_util.defaultComparator, which is suitable for Strings
 * and Numbers in ascending arrays. If the array contains multiple instances of
 * the target value, the left-most instance will be returned. To provide a
 * comparator, it should take 2 arguments to compare and return a negative,
 * zero, or a positive number.
 */
export function binaryInsert(arr, element, comparator) {
    const index = binarySearch(arr, element, comparator);
    const insertionPoint = index < 0 ? -(index + 1) : index;
    arr.splice(insertionPoint, 0, element);
}
/**
 * Searches the array for the target using binary search, returns the index
 * of the found element, or position to insert if element not found. If no
 * comparator is specified, elements are compared using array_
 * util.defaultComparator, which is suitable for Strings and Numbers in
 * ascending arrays. If the array contains multiple instances of the target
 * value, the left-most instance will be returned.
 * @param arr The array to be searched in.
 * @param target The target to be searched for.
 * @param comparator Should take 2 arguments to compare and return a negative,
 *    zero, or a positive number.
 * @return Lowest index of the target value if found, otherwise the insertion
 *    point where the target should be inserted, in the form of
 *    (-insertionPoint - 1).
 */
export function binarySearch(arr, target, comparator) {
    return binarySearch_(arr, target, comparator || defaultComparator);
}
/**
 * Compares its two arguments for order.
 * @param a The first element to be compared.
 * @param b The second element to be compared.
 * @return A negative number, zero, or a positive number as the first
 *     argument is less than, equal to, or greater than the second.
 */
function defaultComparator(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
}
function binarySearch_(arr, target, comparator) {
    let left = 0;
    let right = arr.length;
    let middle = 0;
    let found = false;
    while (left < right) {
        middle = left + ((right - left) >>> 1);
        const compareResult = comparator(target, arr[middle]);
        if (compareResult > 0) {
            left = middle + 1;
        }
        else {
            right = middle;
            // If compareResult is 0, the value is found. We record it is found,
            // and then keep looking because there may be duplicate.
            found = !compareResult;
        }
    }
    return found ? left : -left - 1;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9uX21heF9zdXBwcmVzc2lvbl91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9iYWNrZW5kcy9ub25fbWF4X3N1cHByZXNzaW9uX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUg7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FDeEIsR0FBUSxFQUFFLE9BQVUsRUFBRSxVQUFtQztJQUMzRCxNQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNyRCxNQUFNLGNBQWMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDeEQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3pDLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNILE1BQU0sVUFBVSxZQUFZLENBQ3hCLEdBQVEsRUFBRSxNQUFTLEVBQUUsVUFBbUM7SUFDMUQsT0FBTyxhQUFhLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxVQUFVLElBQUksaUJBQWlCLENBQUMsQ0FBQztBQUNyRSxDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsU0FBUyxpQkFBaUIsQ0FBSSxDQUFJLEVBQUUsQ0FBSTtJQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBRUQsU0FBUyxhQUFhLENBQ2xCLEdBQVEsRUFBRSxNQUFTLEVBQUUsVUFBa0M7SUFDekQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ2IsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUN2QixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDZixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDbEIsT0FBTyxJQUFJLEdBQUcsS0FBSyxFQUFFO1FBQ25CLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN2QyxNQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3RELElBQUksYUFBYSxHQUFHLENBQUMsRUFBRTtZQUNyQixJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztTQUNuQjthQUFNO1lBQ0wsS0FBSyxHQUFHLE1BQU0sQ0FBQztZQUNmLG9FQUFvRTtZQUNwRSx3REFBd0Q7WUFDeEQsS0FBSyxHQUFHLENBQUMsYUFBYSxDQUFDO1NBQ3hCO0tBQ0Y7SUFFRCxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7QUFDbEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuLyoqXG4gKiBJbnNlcnRzIGEgdmFsdWUgaW50byBhIHNvcnRlZCBhcnJheS4gVGhpcyBtZXRob2QgYWxsb3dzIGR1cGxpY2F0ZSwgbWVhbmluZyBpdFxuICogYWxsb3dzIGluc2VydGluZyBkdXBsaWNhdGUgdmFsdWUsIGluIHdoaWNoIGNhc2UsIHRoZSBlbGVtZW50IHdpbGwgYmUgaW5zZXJ0ZWRcbiAqIGF0IHRoZSBsb3dlc3QgaW5kZXggb2YgdGhlIHZhbHVlLlxuICogQHBhcmFtIGFyciBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gaW5zZXJ0LlxuICogQHBhcmFtIGNvbXBhcmF0b3IgT3B0aW9uYWwuIElmIG5vIGNvbXBhcmF0b3IgaXMgc3BlY2lmaWVkLCBlbGVtZW50cyBhcmVcbiAqIGNvbXBhcmVkIHVzaW5nIGFycmF5X3V0aWwuZGVmYXVsdENvbXBhcmF0b3IsIHdoaWNoIGlzIHN1aXRhYmxlIGZvciBTdHJpbmdzXG4gKiBhbmQgTnVtYmVycyBpbiBhc2NlbmRpbmcgYXJyYXlzLiBJZiB0aGUgYXJyYXkgY29udGFpbnMgbXVsdGlwbGUgaW5zdGFuY2VzIG9mXG4gKiB0aGUgdGFyZ2V0IHZhbHVlLCB0aGUgbGVmdC1tb3N0IGluc3RhbmNlIHdpbGwgYmUgcmV0dXJuZWQuIFRvIHByb3ZpZGUgYVxuICogY29tcGFyYXRvciwgaXQgc2hvdWxkIHRha2UgMiBhcmd1bWVudHMgdG8gY29tcGFyZSBhbmQgcmV0dXJuIGEgbmVnYXRpdmUsXG4gKiB6ZXJvLCBvciBhIHBvc2l0aXZlIG51bWJlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmFyeUluc2VydDxUPihcbiAgICBhcnI6IFRbXSwgZWxlbWVudDogVCwgY29tcGFyYXRvcj86IChhOiBULCBiOiBUKSA9PiBudW1iZXIpIHtcbiAgY29uc3QgaW5kZXggPSBiaW5hcnlTZWFyY2goYXJyLCBlbGVtZW50LCBjb21wYXJhdG9yKTtcbiAgY29uc3QgaW5zZXJ0aW9uUG9pbnQgPSBpbmRleCA8IDAgPyAtKGluZGV4ICsgMSkgOiBpbmRleDtcbiAgYXJyLnNwbGljZShpbnNlcnRpb25Qb2ludCwgMCwgZWxlbWVudCk7XG59XG5cbi8qKlxuICogU2VhcmNoZXMgdGhlIGFycmF5IGZvciB0aGUgdGFyZ2V0IHVzaW5nIGJpbmFyeSBzZWFyY2gsIHJldHVybnMgdGhlIGluZGV4XG4gKiBvZiB0aGUgZm91bmQgZWxlbWVudCwgb3IgcG9zaXRpb24gdG8gaW5zZXJ0IGlmIGVsZW1lbnQgbm90IGZvdW5kLiBJZiBub1xuICogY29tcGFyYXRvciBpcyBzcGVjaWZpZWQsIGVsZW1lbnRzIGFyZSBjb21wYXJlZCB1c2luZyBhcnJheV9cbiAqIHV0aWwuZGVmYXVsdENvbXBhcmF0b3IsIHdoaWNoIGlzIHN1aXRhYmxlIGZvciBTdHJpbmdzIGFuZCBOdW1iZXJzIGluXG4gKiBhc2NlbmRpbmcgYXJyYXlzLiBJZiB0aGUgYXJyYXkgY29udGFpbnMgbXVsdGlwbGUgaW5zdGFuY2VzIG9mIHRoZSB0YXJnZXRcbiAqIHZhbHVlLCB0aGUgbGVmdC1tb3N0IGluc3RhbmNlIHdpbGwgYmUgcmV0dXJuZWQuXG4gKiBAcGFyYW0gYXJyIFRoZSBhcnJheSB0byBiZSBzZWFyY2hlZCBpbi5cbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCB0byBiZSBzZWFyY2hlZCBmb3IuXG4gKiBAcGFyYW0gY29tcGFyYXRvciBTaG91bGQgdGFrZSAyIGFyZ3VtZW50cyB0byBjb21wYXJlIGFuZCByZXR1cm4gYSBuZWdhdGl2ZSxcbiAqICAgIHplcm8sIG9yIGEgcG9zaXRpdmUgbnVtYmVyLlxuICogQHJldHVybiBMb3dlc3QgaW5kZXggb2YgdGhlIHRhcmdldCB2YWx1ZSBpZiBmb3VuZCwgb3RoZXJ3aXNlIHRoZSBpbnNlcnRpb25cbiAqICAgIHBvaW50IHdoZXJlIHRoZSB0YXJnZXQgc2hvdWxkIGJlIGluc2VydGVkLCBpbiB0aGUgZm9ybSBvZlxuICogICAgKC1pbnNlcnRpb25Qb2ludCAtIDEpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYmluYXJ5U2VhcmNoPFQ+KFxuICAgIGFycjogVFtdLCB0YXJnZXQ6IFQsIGNvbXBhcmF0b3I/OiAoYTogVCwgYjogVCkgPT4gbnVtYmVyKSB7XG4gIHJldHVybiBiaW5hcnlTZWFyY2hfKGFyciwgdGFyZ2V0LCBjb21wYXJhdG9yIHx8IGRlZmF1bHRDb21wYXJhdG9yKTtcbn1cblxuLyoqXG4gKiBDb21wYXJlcyBpdHMgdHdvIGFyZ3VtZW50cyBmb3Igb3JkZXIuXG4gKiBAcGFyYW0gYSBUaGUgZmlyc3QgZWxlbWVudCB0byBiZSBjb21wYXJlZC5cbiAqIEBwYXJhbSBiIFRoZSBzZWNvbmQgZWxlbWVudCB0byBiZSBjb21wYXJlZC5cbiAqIEByZXR1cm4gQSBuZWdhdGl2ZSBudW1iZXIsIHplcm8sIG9yIGEgcG9zaXRpdmUgbnVtYmVyIGFzIHRoZSBmaXJzdFxuICogICAgIGFyZ3VtZW50IGlzIGxlc3MgdGhhbiwgZXF1YWwgdG8sIG9yIGdyZWF0ZXIgdGhhbiB0aGUgc2Vjb25kLlxuICovXG5mdW5jdGlvbiBkZWZhdWx0Q29tcGFyYXRvcjxUPihhOiBULCBiOiBUKTogbnVtYmVyIHtcbiAgcmV0dXJuIGEgPiBiID8gMSA6IGEgPCBiID8gLTEgOiAwO1xufVxuXG5mdW5jdGlvbiBiaW5hcnlTZWFyY2hfPFQ+KFxuICAgIGFycjogVFtdLCB0YXJnZXQ6IFQsIGNvbXBhcmF0b3I6IChhOiBULCBiOiBUKSA9PiBudW1iZXIpIHtcbiAgbGV0IGxlZnQgPSAwO1xuICBsZXQgcmlnaHQgPSBhcnIubGVuZ3RoO1xuICBsZXQgbWlkZGxlID0gMDtcbiAgbGV0IGZvdW5kID0gZmFsc2U7XG4gIHdoaWxlIChsZWZ0IDwgcmlnaHQpIHtcbiAgICBtaWRkbGUgPSBsZWZ0ICsgKChyaWdodCAtIGxlZnQpID4+PiAxKTtcbiAgICBjb25zdCBjb21wYXJlUmVzdWx0ID0gY29tcGFyYXRvcih0YXJnZXQsIGFyclttaWRkbGVdKTtcbiAgICBpZiAoY29tcGFyZVJlc3VsdCA+IDApIHtcbiAgICAgIGxlZnQgPSBtaWRkbGUgKyAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByaWdodCA9IG1pZGRsZTtcbiAgICAgIC8vIElmIGNvbXBhcmVSZXN1bHQgaXMgMCwgdGhlIHZhbHVlIGlzIGZvdW5kLiBXZSByZWNvcmQgaXQgaXMgZm91bmQsXG4gICAgICAvLyBhbmQgdGhlbiBrZWVwIGxvb2tpbmcgYmVjYXVzZSB0aGVyZSBtYXkgYmUgZHVwbGljYXRlLlxuICAgICAgZm91bmQgPSAhY29tcGFyZVJlc3VsdDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZm91bmQgPyBsZWZ0IDogLWxlZnQgLSAxO1xufVxuIl19