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
 * Utilities related to persistent state in the backend.
 */
/**
 * An ID to track `tf.SymbolicTensor`s and derived classes.
 * Required in different places in engine/topology.ts to identify unique
 * tensors.
 */
let _nextUniqueTensorId = 0;
export function getNextUniqueTensorId() {
    return _nextUniqueTensorId++;
}
const _uidPrefixes = {};
/**
 * Provides a unique UID given a string prefix.
 *
 * @param prefix
 */
export function getUid(prefix = '') {
    if (!(prefix in _uidPrefixes)) {
        _uidPrefixes[prefix] = 0;
    }
    _uidPrefixes[prefix] += 1;
    return prefix + _uidPrefixes[prefix].toString();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWxheWVycy9zcmMvYmFja2VuZC9zdGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7R0FRRztBQUVIOztHQUVHO0FBRUg7Ozs7R0FJRztBQUNILElBQUksbUJBQW1CLEdBQUcsQ0FBQyxDQUFDO0FBRTVCLE1BQU0sVUFBVSxxQkFBcUI7SUFDbkMsT0FBTyxtQkFBbUIsRUFBRSxDQUFDO0FBQy9CLENBQUM7QUFFRCxNQUFNLFlBQVksR0FBK0IsRUFBRSxDQUFDO0FBRXBEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsTUFBTSxDQUFDLE1BQU0sR0FBRyxFQUFFO0lBQ2hDLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxZQUFZLENBQUMsRUFBRTtRQUM3QixZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzFCO0lBQ0QsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixPQUFPLE1BQU0sR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDbEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAqIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICogaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbi8qKlxuICogVXRpbGl0aWVzIHJlbGF0ZWQgdG8gcGVyc2lzdGVudCBzdGF0ZSBpbiB0aGUgYmFja2VuZC5cbiAqL1xuXG4vKipcbiAqIEFuIElEIHRvIHRyYWNrIGB0Zi5TeW1ib2xpY1RlbnNvcmBzIGFuZCBkZXJpdmVkIGNsYXNzZXMuXG4gKiBSZXF1aXJlZCBpbiBkaWZmZXJlbnQgcGxhY2VzIGluIGVuZ2luZS90b3BvbG9neS50cyB0byBpZGVudGlmeSB1bmlxdWVcbiAqIHRlbnNvcnMuXG4gKi9cbmxldCBfbmV4dFVuaXF1ZVRlbnNvcklkID0gMDtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5leHRVbmlxdWVUZW5zb3JJZCgpOiBudW1iZXIge1xuICByZXR1cm4gX25leHRVbmlxdWVUZW5zb3JJZCsrO1xufVxuXG5jb25zdCBfdWlkUHJlZml4ZXM6IHtbcHJlZml4OiBzdHJpbmddOiBudW1iZXJ9ID0ge307XG5cbi8qKlxuICogUHJvdmlkZXMgYSB1bmlxdWUgVUlEIGdpdmVuIGEgc3RyaW5nIHByZWZpeC5cbiAqXG4gKiBAcGFyYW0gcHJlZml4XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRVaWQocHJlZml4ID0gJycpOiBzdHJpbmcge1xuICBpZiAoIShwcmVmaXggaW4gX3VpZFByZWZpeGVzKSkge1xuICAgIF91aWRQcmVmaXhlc1twcmVmaXhdID0gMDtcbiAgfVxuICBfdWlkUHJlZml4ZXNbcHJlZml4XSArPSAxO1xuICByZXR1cm4gcHJlZml4ICsgX3VpZFByZWZpeGVzW3ByZWZpeF0udG9TdHJpbmcoKTtcbn1cbiJdfQ==