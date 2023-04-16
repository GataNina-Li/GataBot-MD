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
 * Infers a string union type from an array of string literals, and returns
 * the array as an array of that type.
 *
 * For instance:
 *
 * ```
 * const fruits = stringLiteralArray(['apple', 'banana', 'orange']);
 * type Fruit = typeof activationOptions[number];
 * ```
 *
 * now `Fruit` is the union type `'apple'|'banana'|'orange'`.
 *
 * https://stackoverflow.com/questions/52085454/typescript-define-a-union-type-from-an-array-of-strings/52085658
 */
export function stringLiteralArray(a) {
    return a;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWxheWVycy9zcmMva2VyYXNfZm9ybWF0L3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztHQVFHO0FBRUg7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxNQUFNLFVBQVUsa0JBQWtCLENBQW1CLENBQU07SUFDekQsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICogbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gKiBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuLyoqXG4gKiBJbmZlcnMgYSBzdHJpbmcgdW5pb24gdHlwZSBmcm9tIGFuIGFycmF5IG9mIHN0cmluZyBsaXRlcmFscywgYW5kIHJldHVybnNcbiAqIHRoZSBhcnJheSBhcyBhbiBhcnJheSBvZiB0aGF0IHR5cGUuXG4gKlxuICogRm9yIGluc3RhbmNlOlxuICpcbiAqIGBgYFxuICogY29uc3QgZnJ1aXRzID0gc3RyaW5nTGl0ZXJhbEFycmF5KFsnYXBwbGUnLCAnYmFuYW5hJywgJ29yYW5nZSddKTtcbiAqIHR5cGUgRnJ1aXQgPSB0eXBlb2YgYWN0aXZhdGlvbk9wdGlvbnNbbnVtYmVyXTtcbiAqIGBgYFxuICpcbiAqIG5vdyBgRnJ1aXRgIGlzIHRoZSB1bmlvbiB0eXBlIGAnYXBwbGUnfCdiYW5hbmEnfCdvcmFuZ2UnYC5cbiAqXG4gKiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MjA4NTQ1NC90eXBlc2NyaXB0LWRlZmluZS1hLXVuaW9uLXR5cGUtZnJvbS1hbi1hcnJheS1vZi1zdHJpbmdzLzUyMDg1NjU4XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdMaXRlcmFsQXJyYXk8VCBleHRlbmRzIHN0cmluZz4oYTogVFtdKSB7XG4gIHJldHVybiBhO1xufVxuIl19