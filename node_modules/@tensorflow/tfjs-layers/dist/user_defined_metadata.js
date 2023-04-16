/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
/** Utility functions related to user-defined metadata. */
// Maximum recommended serialized size for user-defined metadata.
// Beyond this limit, a warning message will be printed during model loading and
// saving.
export const MAX_USER_DEFINED_METADATA_SERIALIZED_LENGTH = 1 * 1024 * 1024;
/**
 * Check validity of user-defined metadata.
 *
 * @param userDefinedMetadata
 * @param modelName Name of the model that the user-defined metadata belongs to.
 *   Used during construction of error messages.
 * @param checkSize Whether to check the size of the metadata is under
 *   recommended limit. Default: `false`. If `true`, will try stringify the
 *   JSON object and print a console warning if the serialzied size is above the
 *   limit.
 * @throws Error if `userDefinedMetadata` is not a plain JSON object.
 */
export function checkUserDefinedMetadata(userDefinedMetadata, modelName, checkSize = false) {
    if (userDefinedMetadata == null ||
        typeof userDefinedMetadata !== 'object' ||
        Object.getPrototypeOf(userDefinedMetadata) !== Object.prototype ||
        !plainObjectCheck(userDefinedMetadata)) {
        throw new Error('User-defined metadata is expected to be a JSON object, but is not.');
    }
    if (checkSize) {
        const out = JSON.stringify(userDefinedMetadata);
        if (out.length > MAX_USER_DEFINED_METADATA_SERIALIZED_LENGTH) {
            console.warn(`User-defined metadata of model "${modelName}" is too large in ` +
                `size (length=${out.length} when serialized). It is not ` +
                `recommended to store such large objects in user-defined metadata. ` +
                `Please make sure its serialized length is <= ` +
                `${MAX_USER_DEFINED_METADATA_SERIALIZED_LENGTH}.`);
        }
    }
}
/**
 * Check if an input is plain JSON object or any valid subfield of it.
 *
 * @param x The input to be checked.
 * @param assertObject Whether to assert `x` is a JSON object, i.e., reject
 *   cases of arrays and primitives.
 * @return Returns `true` if and only if `x` is a plain JSON object,
 *   a JSON-valid primitive including string, number, boolean and null,
 *   or an array of the said types.
 */
// tslint:disable-next-line:no-any
export function plainObjectCheck(x) {
    if (x === null) {
        // Note: typeof `null` is 'object', and `null` is valid in JSON.
        return true;
    }
    else if (typeof x === 'object') {
        if (Object.getPrototypeOf(x) === Object.prototype) {
            // `x` is a JavaScript object and its prototype is Object.
            const keys = Object.keys(x);
            for (const key of keys) {
                if (typeof key !== 'string') {
                    // JSON keys must be strings.
                    return false;
                }
                if (!plainObjectCheck(x[key])) { // Recursive call.
                    return false;
                }
            }
            return true;
        }
        else {
            // `x` is a JavaScript object but its prototype is not Object.
            if (Array.isArray(x)) {
                // `x` is a JavaScript array.
                for (const item of x) {
                    if (!plainObjectCheck(item)) { // Recursive call.
                        return false;
                    }
                }
                return true;
            }
            else {
                // `x` is a JavaScript object and its prototype is not Object,
                // and it's not an Array. I.e., it's a complex object such as
                // `Error` and `Date`.
                return false;
            }
        }
    }
    else {
        // `x` is not a JavaScript object or `null`.
        const xType = typeof x;
        return xType === 'string' || xType === 'number' || xType === 'boolean';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcl9kZWZpbmVkX21ldGFkYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1sYXllcnMvc3JjL3VzZXJfZGVmaW5lZF9tZXRhZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7R0FRRztBQUVILDBEQUEwRDtBQUUxRCxpRUFBaUU7QUFDakUsZ0ZBQWdGO0FBQ2hGLFVBQVU7QUFDVixNQUFNLENBQUMsTUFBTSwyQ0FBMkMsR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztBQUUzRTs7Ozs7Ozs7Ozs7R0FXRztBQUNILE1BQU0sVUFBVSx3QkFBd0IsQ0FDcEMsbUJBQXVCLEVBQUUsU0FBaUIsRUFBRSxTQUFTLEdBQUcsS0FBSztJQUMvRCxJQUFJLG1CQUFtQixJQUFJLElBQUk7UUFDM0IsT0FBTyxtQkFBbUIsS0FBSyxRQUFRO1FBQ3ZDLE1BQU0sQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsS0FBSyxNQUFNLENBQUMsU0FBUztRQUMvRCxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLEVBQUU7UUFDMUMsTUFBTSxJQUFJLEtBQUssQ0FDWCxvRUFBb0UsQ0FBQyxDQUFDO0tBQzNFO0lBRUQsSUFBSSxTQUFTLEVBQUU7UUFDYixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDaEQsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLDJDQUEyQyxFQUFFO1lBQzVELE9BQU8sQ0FBQyxJQUFJLENBQ1IsbUNBQW1DLFNBQVMsb0JBQW9CO2dCQUNoRSxnQkFBZ0IsR0FBRyxDQUFDLE1BQU0sK0JBQStCO2dCQUN6RCxvRUFBb0U7Z0JBQ3BFLCtDQUErQztnQkFDL0MsR0FBRywyQ0FBMkMsR0FBRyxDQUFDLENBQUM7U0FDeEQ7S0FDRjtBQUNILENBQUM7QUFFRDs7Ozs7Ozs7O0dBU0c7QUFDSCxrQ0FBa0M7QUFDbEMsTUFBTSxVQUFVLGdCQUFnQixDQUFDLENBQU07SUFDckMsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ2QsZ0VBQWdFO1FBQ2hFLE9BQU8sSUFBSSxDQUFDO0tBQ2I7U0FBTSxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTtRQUNoQyxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUNqRCwwREFBMEQ7WUFDMUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtnQkFDdEIsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7b0JBQzNCLDZCQUE2QjtvQkFDN0IsT0FBTyxLQUFLLENBQUM7aUJBQ2Q7Z0JBQ0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUcsa0JBQWtCO29CQUNsRCxPQUFPLEtBQUssQ0FBQztpQkFDZDthQUNGO1lBQ0QsT0FBTyxJQUFJLENBQUM7U0FDYjthQUFNO1lBQ0wsOERBQThEO1lBQzlELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDcEIsNkJBQTZCO2dCQUM3QixLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUMsRUFBRTtvQkFDcEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUcsa0JBQWtCO3dCQUNoRCxPQUFPLEtBQUssQ0FBQztxQkFDZDtpQkFDRjtnQkFDRCxPQUFPLElBQUksQ0FBQzthQUNiO2lCQUFNO2dCQUNMLDhEQUE4RDtnQkFDOUQsNkRBQTZEO2dCQUM3RCxzQkFBc0I7Z0JBQ3RCLE9BQU8sS0FBSyxDQUFDO2FBQ2Q7U0FDRjtLQUNGO1NBQU07UUFDTCw0Q0FBNEM7UUFDNUMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLENBQUM7UUFDdkIsT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLFNBQVMsQ0FBQztLQUN4RTtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gKiBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAqIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG4vKiogVXRpbGl0eSBmdW5jdGlvbnMgcmVsYXRlZCB0byB1c2VyLWRlZmluZWQgbWV0YWRhdGEuICovXG5cbi8vIE1heGltdW0gcmVjb21tZW5kZWQgc2VyaWFsaXplZCBzaXplIGZvciB1c2VyLWRlZmluZWQgbWV0YWRhdGEuXG4vLyBCZXlvbmQgdGhpcyBsaW1pdCwgYSB3YXJuaW5nIG1lc3NhZ2Ugd2lsbCBiZSBwcmludGVkIGR1cmluZyBtb2RlbCBsb2FkaW5nIGFuZFxuLy8gc2F2aW5nLlxuZXhwb3J0IGNvbnN0IE1BWF9VU0VSX0RFRklORURfTUVUQURBVEFfU0VSSUFMSVpFRF9MRU5HVEggPSAxICogMTAyNCAqIDEwMjQ7XG5cbi8qKlxuICogQ2hlY2sgdmFsaWRpdHkgb2YgdXNlci1kZWZpbmVkIG1ldGFkYXRhLlxuICpcbiAqIEBwYXJhbSB1c2VyRGVmaW5lZE1ldGFkYXRhXG4gKiBAcGFyYW0gbW9kZWxOYW1lIE5hbWUgb2YgdGhlIG1vZGVsIHRoYXQgdGhlIHVzZXItZGVmaW5lZCBtZXRhZGF0YSBiZWxvbmdzIHRvLlxuICogICBVc2VkIGR1cmluZyBjb25zdHJ1Y3Rpb24gb2YgZXJyb3IgbWVzc2FnZXMuXG4gKiBAcGFyYW0gY2hlY2tTaXplIFdoZXRoZXIgdG8gY2hlY2sgdGhlIHNpemUgb2YgdGhlIG1ldGFkYXRhIGlzIHVuZGVyXG4gKiAgIHJlY29tbWVuZGVkIGxpbWl0LiBEZWZhdWx0OiBgZmFsc2VgLiBJZiBgdHJ1ZWAsIHdpbGwgdHJ5IHN0cmluZ2lmeSB0aGVcbiAqICAgSlNPTiBvYmplY3QgYW5kIHByaW50IGEgY29uc29sZSB3YXJuaW5nIGlmIHRoZSBzZXJpYWx6aWVkIHNpemUgaXMgYWJvdmUgdGhlXG4gKiAgIGxpbWl0LlxuICogQHRocm93cyBFcnJvciBpZiBgdXNlckRlZmluZWRNZXRhZGF0YWAgaXMgbm90IGEgcGxhaW4gSlNPTiBvYmplY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1VzZXJEZWZpbmVkTWV0YWRhdGEoXG4gICAgdXNlckRlZmluZWRNZXRhZGF0YToge30sIG1vZGVsTmFtZTogc3RyaW5nLCBjaGVja1NpemUgPSBmYWxzZSk6IHZvaWQge1xuICBpZiAodXNlckRlZmluZWRNZXRhZGF0YSA9PSBudWxsIHx8XG4gICAgICB0eXBlb2YgdXNlckRlZmluZWRNZXRhZGF0YSAhPT0gJ29iamVjdCcgfHxcbiAgICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZih1c2VyRGVmaW5lZE1ldGFkYXRhKSAhPT0gT2JqZWN0LnByb3RvdHlwZSB8fFxuICAgICAgIXBsYWluT2JqZWN0Q2hlY2sodXNlckRlZmluZWRNZXRhZGF0YSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdVc2VyLWRlZmluZWQgbWV0YWRhdGEgaXMgZXhwZWN0ZWQgdG8gYmUgYSBKU09OIG9iamVjdCwgYnV0IGlzIG5vdC4nKTtcbiAgfVxuXG4gIGlmIChjaGVja1NpemUpIHtcbiAgICBjb25zdCBvdXQgPSBKU09OLnN0cmluZ2lmeSh1c2VyRGVmaW5lZE1ldGFkYXRhKTtcbiAgICBpZiAob3V0Lmxlbmd0aCA+IE1BWF9VU0VSX0RFRklORURfTUVUQURBVEFfU0VSSUFMSVpFRF9MRU5HVEgpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICBgVXNlci1kZWZpbmVkIG1ldGFkYXRhIG9mIG1vZGVsIFwiJHttb2RlbE5hbWV9XCIgaXMgdG9vIGxhcmdlIGluIGAgK1xuICAgICAgICAgIGBzaXplIChsZW5ndGg9JHtvdXQubGVuZ3RofSB3aGVuIHNlcmlhbGl6ZWQpLiBJdCBpcyBub3QgYCArXG4gICAgICAgICAgYHJlY29tbWVuZGVkIHRvIHN0b3JlIHN1Y2ggbGFyZ2Ugb2JqZWN0cyBpbiB1c2VyLWRlZmluZWQgbWV0YWRhdGEuIGAgK1xuICAgICAgICAgIGBQbGVhc2UgbWFrZSBzdXJlIGl0cyBzZXJpYWxpemVkIGxlbmd0aCBpcyA8PSBgICtcbiAgICAgICAgICBgJHtNQVhfVVNFUl9ERUZJTkVEX01FVEFEQVRBX1NFUklBTElaRURfTEVOR1RIfS5gKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhbiBpbnB1dCBpcyBwbGFpbiBKU09OIG9iamVjdCBvciBhbnkgdmFsaWQgc3ViZmllbGQgb2YgaXQuXG4gKlxuICogQHBhcmFtIHggVGhlIGlucHV0IHRvIGJlIGNoZWNrZWQuXG4gKiBAcGFyYW0gYXNzZXJ0T2JqZWN0IFdoZXRoZXIgdG8gYXNzZXJ0IGB4YCBpcyBhIEpTT04gb2JqZWN0LCBpLmUuLCByZWplY3RcbiAqICAgY2FzZXMgb2YgYXJyYXlzIGFuZCBwcmltaXRpdmVzLlxuICogQHJldHVybiBSZXR1cm5zIGB0cnVlYCBpZiBhbmQgb25seSBpZiBgeGAgaXMgYSBwbGFpbiBKU09OIG9iamVjdCxcbiAqICAgYSBKU09OLXZhbGlkIHByaW1pdGl2ZSBpbmNsdWRpbmcgc3RyaW5nLCBudW1iZXIsIGJvb2xlYW4gYW5kIG51bGwsXG4gKiAgIG9yIGFuIGFycmF5IG9mIHRoZSBzYWlkIHR5cGVzLlxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG5leHBvcnQgZnVuY3Rpb24gcGxhaW5PYmplY3RDaGVjayh4OiBhbnkpOiBib29sZWFuIHtcbiAgaWYgKHggPT09IG51bGwpIHtcbiAgICAvLyBOb3RlOiB0eXBlb2YgYG51bGxgIGlzICdvYmplY3QnLCBhbmQgYG51bGxgIGlzIHZhbGlkIGluIEpTT04uXG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHggPT09ICdvYmplY3QnKSB7XG4gICAgaWYgKE9iamVjdC5nZXRQcm90b3R5cGVPZih4KSA9PT0gT2JqZWN0LnByb3RvdHlwZSkge1xuICAgICAgLy8gYHhgIGlzIGEgSmF2YVNjcmlwdCBvYmplY3QgYW5kIGl0cyBwcm90b3R5cGUgaXMgT2JqZWN0LlxuICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHgpO1xuICAgICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgICAgICBpZiAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAvLyBKU09OIGtleXMgbXVzdCBiZSBzdHJpbmdzLlxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXBsYWluT2JqZWN0Q2hlY2soeFtrZXldKSkgeyAgLy8gUmVjdXJzaXZlIGNhbGwuXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gYHhgIGlzIGEgSmF2YVNjcmlwdCBvYmplY3QgYnV0IGl0cyBwcm90b3R5cGUgaXMgbm90IE9iamVjdC5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHgpKSB7XG4gICAgICAgIC8vIGB4YCBpcyBhIEphdmFTY3JpcHQgYXJyYXkuXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB4KSB7XG4gICAgICAgICAgaWYgKCFwbGFpbk9iamVjdENoZWNrKGl0ZW0pKSB7ICAvLyBSZWN1cnNpdmUgY2FsbC5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBgeGAgaXMgYSBKYXZhU2NyaXB0IG9iamVjdCBhbmQgaXRzIHByb3RvdHlwZSBpcyBub3QgT2JqZWN0LFxuICAgICAgICAvLyBhbmQgaXQncyBub3QgYW4gQXJyYXkuIEkuZS4sIGl0J3MgYSBjb21wbGV4IG9iamVjdCBzdWNoIGFzXG4gICAgICAgIC8vIGBFcnJvcmAgYW5kIGBEYXRlYC5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBgeGAgaXMgbm90IGEgSmF2YVNjcmlwdCBvYmplY3Qgb3IgYG51bGxgLlxuICAgIGNvbnN0IHhUeXBlID0gdHlwZW9mIHg7XG4gICAgcmV0dXJuIHhUeXBlID09PSAnc3RyaW5nJyB8fCB4VHlwZSA9PT0gJ251bWJlcicgfHwgeFR5cGUgPT09ICdib29sZWFuJztcbiAgfVxufVxuIl19