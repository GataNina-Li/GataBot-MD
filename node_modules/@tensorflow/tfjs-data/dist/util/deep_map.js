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
import * as tf from '@tensorflow/tfjs-core';
/**
 * Apply a mapping function to a nested structure in a recursive manner.
 *
 * The result of the mapping is an object with the same nested structure (i.e.,
 * of arrays and dicts) as the input, except that some subtrees are replaced,
 * according to the results of the mapping function.
 *
 * Mappings are memoized.  Thus, if the nested structure contains the same
 * object in multiple positions, the output will contain the same mapped object
 * in those positions.  Cycles are not supported, however.
 *
 * @param input: The object to which to apply the mapping function.
 * @param mapFn: A function that expects a single node of the object tree, and
 *   returns a `DeepMapResult`.  The `DeepMapResult` either provides a
 *   replacement value for that node (i.e., replacing the subtree), or indicates
 *   that the node should be processed recursively.
 */
export function deepMap(input, mapFn) {
    return deepMapInternal(input, mapFn);
}
/**
 * @param seen: A Map of known object mappings (i.e., memoized results of
 *   `mapFn()`)
 * @param containedIn: An set containing objects on the reference path currently
 *   being processed (used to detect cycles).
 */
function deepMapInternal(input, mapFn, seen = new Map(), containedIn = new Set()) {
    if (input == null) {
        return null;
    }
    if (typeof Blob === 'function' && input instanceof Blob) {
        return input.slice();
    }
    if (containedIn.has(input)) {
        throw new Error('Circular references are not supported.');
    }
    if (seen.has(input)) {
        return seen.get(input);
    }
    const result = mapFn(input);
    if (result.recurse && result.value !== null) {
        throw new Error('A deep map function may not return both a value and recurse=true.');
    }
    if (!result.recurse) {
        seen.set(input, result.value);
        return result.value;
    }
    else if (isIterable(input)) {
        // tslint:disable-next-line:no-any
        const mappedIterable = Array.isArray(input) ? [] : {};
        containedIn.add(input);
        for (const k in input) {
            const child = input[k];
            const childResult = deepMapInternal(child, mapFn, seen, containedIn);
            mappedIterable[k] = childResult;
        }
        containedIn.delete(input);
        if (input.__proto__) {
            mappedIterable.__proto__ = input.__proto__;
        }
        return mappedIterable;
    }
    else {
        throw new Error(`Can't recurse into non-iterable type: ${input}`);
    }
}
// TODO(soergel, kangyizhang) Reconsider naming of deepZip() to avoid confusion
// with zip()
/**
 * Zip nested structures together in a recursive manner.
 *
 * This has the effect of transposing or pivoting data, e.g. converting it from
 * a row-major representation to a column-major representation.
 *
 * For example, `deepZip([{a: 1, b: 2}, {a: 3, b: 4}])` returns
 * `{a: [1, 3], b: [2, 4]}`.
 *
 * The inputs should all have the same nested structure (i.e., of arrays and
 * dicts).  The result is a single object with the same nested structure, where
 * the leaves are arrays collecting the values of the inputs at that location
 * (or, optionally, the result of a custom function applied to those arrays).
 *
 * @param inputs: An array of the objects to zip together.
 * @param zipFn: (optional) A function that expects an array of elements at a
 *   single node of the object tree, and returns a `DeepMapResult`.  The
 *   `DeepMapResult` either provides a result value for that node (i.e.,
 *   representing the subtree), or indicates that the node should be processed
 *   recursively.  The default zipFn recurses as far as possible and places
 *   arrays at the leaves.
 */
export function deepZip(inputs, zipFn = zipToList) {
    return deepZipInternal(inputs, zipFn);
}
/**
 * @param containedIn: An set containing objects on the reference path currently
 *   being processed (used to detect cycles).
 */
function deepZipInternal(inputs, zipFn, containedIn = new Set()) {
    // The recursion follows the structure of input 0; it's assumed that all the
    // other inputs have the same structure.
    const input = inputs[0];
    if (containedIn.has(input)) {
        throw new Error('Circular references are not supported.');
    }
    const result = zipFn(inputs);
    if (result.recurse && result.value !== null) {
        throw new Error('A deep zip function may not return both a value and recurse=true.');
    }
    if (!result.recurse) {
        return result.value;
    }
    else if (isIterable(input)) {
        // tslint:disable-next-line:no-any
        const mappedIterable = Array.isArray(input) ? [] : {};
        containedIn.add(input);
        for (const k in input) {
            const children = inputs.map(x => x[k]);
            const childResult = deepZipInternal(children, zipFn, containedIn);
            mappedIterable[k] = childResult;
        }
        containedIn.delete(input);
        return mappedIterable;
    }
    else {
        throw new Error(`Can't recurse into non-iterable type: ${input}`);
    }
}
// tslint:disable-next-line:no-any
export function zipToList(x) {
    if (x === null) {
        return null;
    }
    // TODO(soergel): validate array type?
    if (isIterable(x[0])) {
        return { value: null, recurse: true };
    }
    else {
        return { value: x, recurse: false };
    }
}
/**
 * Apply an async mapping function to a nested structure in a recursive manner.
 *
 * This first creates a nested structure of Promises, and then awaits all of
 * those, resulting in a single Promise for a resolved nested structure.
 *
 * The result of the mapping is an object with the same nested structure (i.e.,
 * of arrays and dicts) as the input, except that some subtrees are replaced,
 * according to the results of the mapping function.
 *
 * Mappings are memoized.  Thus, if the nested structure contains the same
 * object in multiple positions, the output will contain the same mapped object
 * in those positions.  Cycles are not supported, however.
 *
 * @param input: The object to which to apply the mapping function.
 * @param mapFn: A function that expects a single node of the object tree, and
 *   returns a `DeepMapAsyncResult`.  The `DeepMapAsyncResult` either provides
 *   a `Promise` for a replacement value for that node (i.e., replacing the
 *   subtree), or indicates that the node should be processed recursively.  Note
 *   that the decision whether or not to recurse must be made immediately; only
 *   the mapped value may be promised.
 */
export async function deepMapAndAwaitAll(input, mapFn) {
    const seen = new Map();
    // First do a normal deepMap, collecting Promises in 'seen' as a side effect.
    deepMapInternal(input, mapFn, seen);
    // Replace the Promises in 'seen' in place.
    // Note TypeScript provides no async map iteration, and regular map iteration
    // is broken too, so sadly we have to do Array.from() to make it work.
    // (There's no advantage to Promise.all(), and that would be tricky anyway.)
    for (const key of Array.from(seen.keys())) {
        const value = seen.get(key);
        if (tf.util.isPromise(value)) {
            const mappedValue = await value;
            seen.set(key, mappedValue);
        }
    }
    // Normal deepMap again, this time filling in the resolved values.
    // It's unfortunate that we have to do two passes.
    // TODO(soergel): test performance and think harder about a fast solution.
    const result = deepMapInternal(input, mapFn, seen);
    return result;
}
/**
 * Determine whether the argument is iterable.
 *
 * @returns true if the argument is an array or any non-Tensor object.
 */
// tslint:disable-next-line:no-any
export function isIterable(obj) {
    let isTextDecoder = false;
    if (tf.env().get('IS_BROWSER')) {
        isTextDecoder = obj instanceof TextDecoder;
    }
    else {
        // tslint:disable-next-line:no-require-imports
        const { StringDecoder } = require('string_decoder');
        isTextDecoder = obj instanceof StringDecoder;
    }
    return obj != null && (!ArrayBuffer.isView(obj)) &&
        (Array.isArray(obj) ||
            (typeof obj === 'object' && !(obj instanceof tf.Tensor) &&
                !(obj instanceof Promise) && !isTextDecoder));
}
/**
 * Determine whether the argument can be converted to Tensor.
 *
 * Tensors, primitives, arrays, and TypedArrays all qualify; anything else does
 * not.
 *
 * @returns true if the argument can be converted to Tensor.
 */
// tslint:disable-next-line:no-any
export function canTensorify(obj) {
    return obj == null || isPrimitive(obj) || Array.isArray(obj) ||
        (typeof obj === 'object' && (obj instanceof tf.Tensor)) ||
        tf.util.isTypedArray(obj);
}
/**
 * Returns true if the given `value` is a primitive type. Otherwise returns
 * false. This is equivalant to node util.isPrimitive
 */
function isPrimitive(value) {
    return (value === null ||
        (typeof value !== 'object' && typeof value !== 'function'));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVlcF9tYXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWRhdGEvc3JjL3V0aWwvZGVlcF9tYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFFSCxPQUFPLEtBQUssRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBZTVDOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsTUFBTSxVQUFVLE9BQU8sQ0FBQyxLQUFVLEVBQUUsS0FBZ0M7SUFFbEUsT0FBTyxlQUFlLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILFNBQVMsZUFBZSxDQUNwQixLQUFVLEVBQUUsS0FBZ0MsRUFDNUMsT0FBc0IsSUFBSSxHQUFHLEVBQUUsRUFBRSxjQUF1QixJQUFJLEdBQUcsRUFBRTtJQUVuRSxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7UUFDakIsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUNELElBQUksT0FBTyxJQUFJLEtBQUssVUFBVSxJQUFJLEtBQUssWUFBWSxJQUFJLEVBQUU7UUFDdkQsT0FBTyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDdEI7SUFFRCxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0tBQzNEO0lBQ0QsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ25CLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN4QjtJQUNELE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUU1QixJQUFJLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssS0FBSyxJQUFJLEVBQUU7UUFDM0MsTUFBTSxJQUFJLEtBQUss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QUksSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7UUFDeEQsQ0FBQyxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksQ0FBQyxHQUFHLFlBQVksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFTLFdBQVcsQ0FBQyxLQUFVO0lBQzdCLE9BQU8sQ0FDSCxLQUFLLEtBQUssSUFBSTtRQUNkLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLE9BQU8sS0FBSyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDbEUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAqIGFzIHRmIGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbi8vIHRzbGludDpkaXNhYmxlOm5vLWFueVxuXG4vKipcbiAqIEEgcmV0dXJuIHZhbHVlIGZvciBhIG1hcHBpbmcgZnVuY3Rpb24gdGhhdCBjYW4gYmUgYXBwbGllZCB2aWEgZGVlcE1hcC5cbiAqXG4gKiBJZiByZWN1cnNlIGlzIHRydWUsIHRoZSB2YWx1ZSBzaG91bGQgYmUgZW1wdHksIGFuZCBpdGVyYXRpb24gd2lsbCBjb250aW51ZVxuICogaW50byB0aGUgb2JqZWN0IG9yIGFycmF5LlxuICovXG5leHBvcnQgdHlwZSBEZWVwTWFwUmVzdWx0ID0ge1xuICB2YWx1ZTogYW55LFxuICByZWN1cnNlOiBib29sZWFuXG59O1xuXG4vKipcbiAqIEFwcGx5IGEgbWFwcGluZyBmdW5jdGlvbiB0byBhIG5lc3RlZCBzdHJ1Y3R1cmUgaW4gYSByZWN1cnNpdmUgbWFubmVyLlxuICpcbiAqIFRoZSByZXN1bHQgb2YgdGhlIG1hcHBpbmcgaXMgYW4gb2JqZWN0IHdpdGggdGhlIHNhbWUgbmVzdGVkIHN0cnVjdHVyZSAoaS5lLixcbiAqIG9mIGFycmF5cyBhbmQgZGljdHMpIGFzIHRoZSBpbnB1dCwgZXhjZXB0IHRoYXQgc29tZSBzdWJ0cmVlcyBhcmUgcmVwbGFjZWQsXG4gKiBhY2NvcmRpbmcgdG8gdGhlIHJlc3VsdHMgb2YgdGhlIG1hcHBpbmcgZnVuY3Rpb24uXG4gKlxuICogTWFwcGluZ3MgYXJlIG1lbW9pemVkLiAgVGh1cywgaWYgdGhlIG5lc3RlZCBzdHJ1Y3R1cmUgY29udGFpbnMgdGhlIHNhbWVcbiAqIG9iamVjdCBpbiBtdWx0aXBsZSBwb3NpdGlvbnMsIHRoZSBvdXRwdXQgd2lsbCBjb250YWluIHRoZSBzYW1lIG1hcHBlZCBvYmplY3RcbiAqIGluIHRob3NlIHBvc2l0aW9ucy4gIEN5Y2xlcyBhcmUgbm90IHN1cHBvcnRlZCwgaG93ZXZlci5cbiAqXG4gKiBAcGFyYW0gaW5wdXQ6IFRoZSBvYmplY3QgdG8gd2hpY2ggdG8gYXBwbHkgdGhlIG1hcHBpbmcgZnVuY3Rpb24uXG4gKiBAcGFyYW0gbWFwRm46IEEgZnVuY3Rpb24gdGhhdCBleHBlY3RzIGEgc2luZ2xlIG5vZGUgb2YgdGhlIG9iamVjdCB0cmVlLCBhbmRcbiAqICAgcmV0dXJucyBhIGBEZWVwTWFwUmVzdWx0YC4gIFRoZSBgRGVlcE1hcFJlc3VsdGAgZWl0aGVyIHByb3ZpZGVzIGFcbiAqICAgcmVwbGFjZW1lbnQgdmFsdWUgZm9yIHRoYXQgbm9kZSAoaS5lLiwgcmVwbGFjaW5nIHRoZSBzdWJ0cmVlKSwgb3IgaW5kaWNhdGVzXG4gKiAgIHRoYXQgdGhlIG5vZGUgc2hvdWxkIGJlIHByb2Nlc3NlZCByZWN1cnNpdmVseS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBNYXAoaW5wdXQ6IGFueSwgbWFwRm46ICh4OiBhbnkpID0+IERlZXBNYXBSZXN1bHQpOiBhbnl8XG4gICAgYW55W10ge1xuICByZXR1cm4gZGVlcE1hcEludGVybmFsKGlucHV0LCBtYXBGbik7XG59XG5cbi8qKlxuICogQHBhcmFtIHNlZW46IEEgTWFwIG9mIGtub3duIG9iamVjdCBtYXBwaW5ncyAoaS5lLiwgbWVtb2l6ZWQgcmVzdWx0cyBvZlxuICogICBgbWFwRm4oKWApXG4gKiBAcGFyYW0gY29udGFpbmVkSW46IEFuIHNldCBjb250YWluaW5nIG9iamVjdHMgb24gdGhlIHJlZmVyZW5jZSBwYXRoIGN1cnJlbnRseVxuICogICBiZWluZyBwcm9jZXNzZWQgKHVzZWQgdG8gZGV0ZWN0IGN5Y2xlcykuXG4gKi9cbmZ1bmN0aW9uIGRlZXBNYXBJbnRlcm5hbChcbiAgICBpbnB1dDogYW55LCBtYXBGbjogKHg6IGFueSkgPT4gRGVlcE1hcFJlc3VsdCxcbiAgICBzZWVuOiBNYXA8YW55LCBhbnk+ID0gbmV3IE1hcCgpLCBjb250YWluZWRJbjogU2V0PHt9PiA9IG5ldyBTZXQoKSk6IGFueXxcbiAgICBhbnlbXSB7XG4gIGlmIChpbnB1dCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKHR5cGVvZiBCbG9iID09PSAnZnVuY3Rpb24nICYmIGlucHV0IGluc3RhbmNlb2YgQmxvYikge1xuICAgIHJldHVybiBpbnB1dC5zbGljZSgpO1xuICB9XG5cbiAgaWYgKGNvbnRhaW5lZEluLmhhcyhpbnB1dCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NpcmN1bGFyIHJlZmVyZW5jZXMgYXJlIG5vdCBzdXBwb3J0ZWQuJyk7XG4gIH1cbiAgaWYgKHNlZW4uaGFzKGlucHV0KSkge1xuICAgIHJldHVybiBzZWVuLmdldChpbnB1dCk7XG4gIH1cbiAgY29uc3QgcmVzdWx0ID0gbWFwRm4oaW5wdXQpO1xuXG4gIGlmIChyZXN1bHQucmVjdXJzZSAmJiByZXN1bHQudmFsdWUgIT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdBIGRlZXAgbWFwIGZ1bmN0aW9uIG1heSBub3QgcmV0dXJuIGJvdGggYSB2YWx1ZSBhbmQgcmVjdXJzZT10cnVlLicpO1xuICB9XG5cbiAgaWYgKCFyZXN1bHQucmVjdXJzZSkge1xuICAgIHNlZW4uc2V0KGlucHV0LCByZXN1bHQudmFsdWUpO1xuICAgIHJldHVybiByZXN1bHQudmFsdWU7XG4gIH0gZWxzZSBpZiAoaXNJdGVyYWJsZShpbnB1dCkpIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgY29uc3QgbWFwcGVkSXRlcmFibGU6IGFueXxhbnlbXSA9IEFycmF5LmlzQXJyYXkoaW5wdXQpID8gW10gOiB7fTtcbiAgICBjb250YWluZWRJbi5hZGQoaW5wdXQpO1xuICAgIGZvciAoY29uc3QgayBpbiBpbnB1dCkge1xuICAgICAgY29uc3QgY2hpbGQgPSBpbnB1dFtrXTtcbiAgICAgIGNvbnN0IGNoaWxkUmVzdWx0ID0gZGVlcE1hcEludGVybmFsKGNoaWxkLCBtYXBGbiwgc2VlbiwgY29udGFpbmVkSW4pO1xuICAgICAgbWFwcGVkSXRlcmFibGVba10gPSBjaGlsZFJlc3VsdDtcbiAgICB9XG4gICAgY29udGFpbmVkSW4uZGVsZXRlKGlucHV0KTtcbiAgICBpZiAoaW5wdXQuX19wcm90b19fKSB7XG4gICAgICBtYXBwZWRJdGVyYWJsZS5fX3Byb3RvX18gPSBpbnB1dC5fX3Byb3RvX187XG4gICAgfVxuICAgIHJldHVybiBtYXBwZWRJdGVyYWJsZTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbid0IHJlY3Vyc2UgaW50byBub24taXRlcmFibGUgdHlwZTogJHtpbnB1dH1gKTtcbiAgfVxufVxuXG4vLyBUT0RPKHNvZXJnZWwsIGthbmd5aXpoYW5nKSBSZWNvbnNpZGVyIG5hbWluZyBvZiBkZWVwWmlwKCkgdG8gYXZvaWQgY29uZnVzaW9uXG4vLyB3aXRoIHppcCgpXG5cbi8qKlxuICogWmlwIG5lc3RlZCBzdHJ1Y3R1cmVzIHRvZ2V0aGVyIGluIGEgcmVjdXJzaXZlIG1hbm5lci5cbiAqXG4gKiBUaGlzIGhhcyB0aGUgZWZmZWN0IG9mIHRyYW5zcG9zaW5nIG9yIHBpdm90aW5nIGRhdGEsIGUuZy4gY29udmVydGluZyBpdCBmcm9tXG4gKiBhIHJvdy1tYWpvciByZXByZXNlbnRhdGlvbiB0byBhIGNvbHVtbi1tYWpvciByZXByZXNlbnRhdGlvbi5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgYGRlZXBaaXAoW3thOiAxLCBiOiAyfSwge2E6IDMsIGI6IDR9XSlgIHJldHVybnNcbiAqIGB7YTogWzEsIDNdLCBiOiBbMiwgNF19YC5cbiAqXG4gKiBUaGUgaW5wdXRzIHNob3VsZCBhbGwgaGF2ZSB0aGUgc2FtZSBuZXN0ZWQgc3RydWN0dXJlIChpLmUuLCBvZiBhcnJheXMgYW5kXG4gKiBkaWN0cykuICBUaGUgcmVzdWx0IGlzIGEgc2luZ2xlIG9iamVjdCB3aXRoIHRoZSBzYW1lIG5lc3RlZCBzdHJ1Y3R1cmUsIHdoZXJlXG4gKiB0aGUgbGVhdmVzIGFyZSBhcnJheXMgY29sbGVjdGluZyB0aGUgdmFsdWVzIG9mIHRoZSBpbnB1dHMgYXQgdGhhdCBsb2NhdGlvblxuICogKG9yLCBvcHRpb25hbGx5LCB0aGUgcmVzdWx0IG9mIGEgY3VzdG9tIGZ1bmN0aW9uIGFwcGxpZWQgdG8gdGhvc2UgYXJyYXlzKS5cbiAqXG4gKiBAcGFyYW0gaW5wdXRzOiBBbiBhcnJheSBvZiB0aGUgb2JqZWN0cyB0byB6aXAgdG9nZXRoZXIuXG4gKiBAcGFyYW0gemlwRm46IChvcHRpb25hbCkgQSBmdW5jdGlvbiB0aGF0IGV4cGVjdHMgYW4gYXJyYXkgb2YgZWxlbWVudHMgYXQgYVxuICogICBzaW5nbGUgbm9kZSBvZiB0aGUgb2JqZWN0IHRyZWUsIGFuZCByZXR1cm5zIGEgYERlZXBNYXBSZXN1bHRgLiAgVGhlXG4gKiAgIGBEZWVwTWFwUmVzdWx0YCBlaXRoZXIgcHJvdmlkZXMgYSByZXN1bHQgdmFsdWUgZm9yIHRoYXQgbm9kZSAoaS5lLixcbiAqICAgcmVwcmVzZW50aW5nIHRoZSBzdWJ0cmVlKSwgb3IgaW5kaWNhdGVzIHRoYXQgdGhlIG5vZGUgc2hvdWxkIGJlIHByb2Nlc3NlZFxuICogICByZWN1cnNpdmVseS4gIFRoZSBkZWZhdWx0IHppcEZuIHJlY3Vyc2VzIGFzIGZhciBhcyBwb3NzaWJsZSBhbmQgcGxhY2VzXG4gKiAgIGFycmF5cyBhdCB0aGUgbGVhdmVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVlcFppcChcbiAgICBpbnB1dHM6IGFueVtdLCB6aXBGbjogKHhzOiBhbnlbXSkgPT4gRGVlcE1hcFJlc3VsdCA9IHppcFRvTGlzdCk6IGFueXxhbnlbXSB7XG4gIHJldHVybiBkZWVwWmlwSW50ZXJuYWwoaW5wdXRzLCB6aXBGbik7XG59XG5cbi8qKlxuICogQHBhcmFtIGNvbnRhaW5lZEluOiBBbiBzZXQgY29udGFpbmluZyBvYmplY3RzIG9uIHRoZSByZWZlcmVuY2UgcGF0aCBjdXJyZW50bHlcbiAqICAgYmVpbmcgcHJvY2Vzc2VkICh1c2VkIHRvIGRldGVjdCBjeWNsZXMpLlxuICovXG5mdW5jdGlvbiBkZWVwWmlwSW50ZXJuYWwoXG4gICAgaW5wdXRzOiBhbnlbXSwgemlwRm46ICh4czogYW55W10pID0+IERlZXBNYXBSZXN1bHQsXG4gICAgY29udGFpbmVkSW46IFNldDx7fT4gPSBuZXcgU2V0KCkpOiBhbnl8YW55W10ge1xuICAvLyBUaGUgcmVjdXJzaW9uIGZvbGxvd3MgdGhlIHN0cnVjdHVyZSBvZiBpbnB1dCAwOyBpdCdzIGFzc3VtZWQgdGhhdCBhbGwgdGhlXG4gIC8vIG90aGVyIGlucHV0cyBoYXZlIHRoZSBzYW1lIHN0cnVjdHVyZS5cbiAgY29uc3QgaW5wdXQgPSBpbnB1dHNbMF07XG4gIGlmIChjb250YWluZWRJbi5oYXMoaW5wdXQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDaXJjdWxhciByZWZlcmVuY2VzIGFyZSBub3Qgc3VwcG9ydGVkLicpO1xuICB9XG4gIGNvbnN0IHJlc3VsdCA9IHppcEZuKGlucHV0cyk7XG5cbiAgaWYgKHJlc3VsdC5yZWN1cnNlICYmIHJlc3VsdC52YWx1ZSAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0EgZGVlcCB6aXAgZnVuY3Rpb24gbWF5IG5vdCByZXR1cm4gYm90aCBhIHZhbHVlIGFuZCByZWN1cnNlPXRydWUuJyk7XG4gIH1cblxuICBpZiAoIXJlc3VsdC5yZWN1cnNlKSB7XG4gICAgcmV0dXJuIHJlc3VsdC52YWx1ZTtcbiAgfSBlbHNlIGlmIChpc0l0ZXJhYmxlKGlucHV0KSkge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICBjb25zdCBtYXBwZWRJdGVyYWJsZTogYW55fGFueVtdID0gQXJyYXkuaXNBcnJheShpbnB1dCkgPyBbXSA6IHt9O1xuICAgIGNvbnRhaW5lZEluLmFkZChpbnB1dCk7XG4gICAgZm9yIChjb25zdCBrIGluIGlucHV0KSB7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IGlucHV0cy5tYXAoeCA9PiB4W2tdKTtcbiAgICAgIGNvbnN0IGNoaWxkUmVzdWx0ID0gZGVlcFppcEludGVybmFsKGNoaWxkcmVuLCB6aXBGbiwgY29udGFpbmVkSW4pO1xuICAgICAgbWFwcGVkSXRlcmFibGVba10gPSBjaGlsZFJlc3VsdDtcbiAgICB9XG4gICAgY29udGFpbmVkSW4uZGVsZXRlKGlucHV0KTtcbiAgICByZXR1cm4gbWFwcGVkSXRlcmFibGU7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBDYW4ndCByZWN1cnNlIGludG8gbm9uLWl0ZXJhYmxlIHR5cGU6ICR7aW5wdXR9YCk7XG4gIH1cbn1cblxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuZXhwb3J0IGZ1bmN0aW9uIHppcFRvTGlzdCh4OiBhbnlbXSk6IERlZXBNYXBSZXN1bHQge1xuICBpZiAoeCA9PT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIC8vIFRPRE8oc29lcmdlbCk6IHZhbGlkYXRlIGFycmF5IHR5cGU/XG5cbiAgaWYgKGlzSXRlcmFibGUoeFswXSkpIHtcbiAgICByZXR1cm4ge3ZhbHVlOiBudWxsLCByZWN1cnNlOiB0cnVlfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge3ZhbHVlOiB4LCByZWN1cnNlOiBmYWxzZX07XG4gIH1cbn1cblxuLyoqXG4gKiBBIHJldHVybiB2YWx1ZSBmb3IgYW4gYXN5bmMgbWFwIGZ1bmN0aW9uIGZvciB1c2Ugd2l0aCBkZWVwTWFwQW5kQXdhaXRBbGwuXG4gKlxuICogSWYgcmVjdXJzZSBpcyB0cnVlLCB0aGUgdmFsdWUgc2hvdWxkIGJlIGVtcHR5LCBhbmQgaXRlcmF0aW9uIHdpbGwgY29udGludWVcbiAqIGludG8gdGhlIG9iamVjdCBvciBhcnJheS5cbiAqL1xuZXhwb3J0IHR5cGUgRGVlcE1hcEFzeW5jUmVzdWx0ID0ge1xuICB2YWx1ZTogUHJvbWlzZTxhbnk+LFxuICByZWN1cnNlOiBib29sZWFuXG59O1xuXG4vKipcbiAqIEFwcGx5IGFuIGFzeW5jIG1hcHBpbmcgZnVuY3Rpb24gdG8gYSBuZXN0ZWQgc3RydWN0dXJlIGluIGEgcmVjdXJzaXZlIG1hbm5lci5cbiAqXG4gKiBUaGlzIGZpcnN0IGNyZWF0ZXMgYSBuZXN0ZWQgc3RydWN0dXJlIG9mIFByb21pc2VzLCBhbmQgdGhlbiBhd2FpdHMgYWxsIG9mXG4gKiB0aG9zZSwgcmVzdWx0aW5nIGluIGEgc2luZ2xlIFByb21pc2UgZm9yIGEgcmVzb2x2ZWQgbmVzdGVkIHN0cnVjdHVyZS5cbiAqXG4gKiBUaGUgcmVzdWx0IG9mIHRoZSBtYXBwaW5nIGlzIGFuIG9iamVjdCB3aXRoIHRoZSBzYW1lIG5lc3RlZCBzdHJ1Y3R1cmUgKGkuZS4sXG4gKiBvZiBhcnJheXMgYW5kIGRpY3RzKSBhcyB0aGUgaW5wdXQsIGV4Y2VwdCB0aGF0IHNvbWUgc3VidHJlZXMgYXJlIHJlcGxhY2VkLFxuICogYWNjb3JkaW5nIHRvIHRoZSByZXN1bHRzIG9mIHRoZSBtYXBwaW5nIGZ1bmN0aW9uLlxuICpcbiAqIE1hcHBpbmdzIGFyZSBtZW1vaXplZC4gIFRodXMsIGlmIHRoZSBuZXN0ZWQgc3RydWN0dXJlIGNvbnRhaW5zIHRoZSBzYW1lXG4gKiBvYmplY3QgaW4gbXVsdGlwbGUgcG9zaXRpb25zLCB0aGUgb3V0cHV0IHdpbGwgY29udGFpbiB0aGUgc2FtZSBtYXBwZWQgb2JqZWN0XG4gKiBpbiB0aG9zZSBwb3NpdGlvbnMuICBDeWNsZXMgYXJlIG5vdCBzdXBwb3J0ZWQsIGhvd2V2ZXIuXG4gKlxuICogQHBhcmFtIGlucHV0OiBUaGUgb2JqZWN0IHRvIHdoaWNoIHRvIGFwcGx5IHRoZSBtYXBwaW5nIGZ1bmN0aW9uLlxuICogQHBhcmFtIG1hcEZuOiBBIGZ1bmN0aW9uIHRoYXQgZXhwZWN0cyBhIHNpbmdsZSBub2RlIG9mIHRoZSBvYmplY3QgdHJlZSwgYW5kXG4gKiAgIHJldHVybnMgYSBgRGVlcE1hcEFzeW5jUmVzdWx0YC4gIFRoZSBgRGVlcE1hcEFzeW5jUmVzdWx0YCBlaXRoZXIgcHJvdmlkZXNcbiAqICAgYSBgUHJvbWlzZWAgZm9yIGEgcmVwbGFjZW1lbnQgdmFsdWUgZm9yIHRoYXQgbm9kZSAoaS5lLiwgcmVwbGFjaW5nIHRoZVxuICogICBzdWJ0cmVlKSwgb3IgaW5kaWNhdGVzIHRoYXQgdGhlIG5vZGUgc2hvdWxkIGJlIHByb2Nlc3NlZCByZWN1cnNpdmVseS4gIE5vdGVcbiAqICAgdGhhdCB0aGUgZGVjaXNpb24gd2hldGhlciBvciBub3QgdG8gcmVjdXJzZSBtdXN0IGJlIG1hZGUgaW1tZWRpYXRlbHk7IG9ubHlcbiAqICAgdGhlIG1hcHBlZCB2YWx1ZSBtYXkgYmUgcHJvbWlzZWQuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWVwTWFwQW5kQXdhaXRBbGwoXG4gICAgaW5wdXQ6IGFueSwgbWFwRm46ICh4OiBhbnkpID0+IERlZXBNYXBBc3luY1Jlc3VsdCk6IFByb21pc2U8YW55fGFueVtdPiB7XG4gIGNvbnN0IHNlZW46IE1hcDxhbnksIGFueT4gPSBuZXcgTWFwKCk7XG5cbiAgLy8gRmlyc3QgZG8gYSBub3JtYWwgZGVlcE1hcCwgY29sbGVjdGluZyBQcm9taXNlcyBpbiAnc2VlbicgYXMgYSBzaWRlIGVmZmVjdC5cbiAgZGVlcE1hcEludGVybmFsKGlucHV0LCBtYXBGbiwgc2Vlbik7XG5cbiAgLy8gUmVwbGFjZSB0aGUgUHJvbWlzZXMgaW4gJ3NlZW4nIGluIHBsYWNlLlxuICAvLyBOb3RlIFR5cGVTY3JpcHQgcHJvdmlkZXMgbm8gYXN5bmMgbWFwIGl0ZXJhdGlvbiwgYW5kIHJlZ3VsYXIgbWFwIGl0ZXJhdGlvblxuICAvLyBpcyBicm9rZW4gdG9vLCBzbyBzYWRseSB3ZSBoYXZlIHRvIGRvIEFycmF5LmZyb20oKSB0byBtYWtlIGl0IHdvcmsuXG4gIC8vIChUaGVyZSdzIG5vIGFkdmFudGFnZSB0byBQcm9taXNlLmFsbCgpLCBhbmQgdGhhdCB3b3VsZCBiZSB0cmlja3kgYW55d2F5LilcbiAgZm9yIChjb25zdCBrZXkgb2YgQXJyYXkuZnJvbShzZWVuLmtleXMoKSkpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHNlZW4uZ2V0KGtleSk7XG4gICAgaWYgKHRmLnV0aWwuaXNQcm9taXNlKHZhbHVlKSkge1xuICAgICAgY29uc3QgbWFwcGVkVmFsdWUgPSBhd2FpdCB2YWx1ZTtcbiAgICAgIHNlZW4uc2V0KGtleSwgbWFwcGVkVmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE5vcm1hbCBkZWVwTWFwIGFnYWluLCB0aGlzIHRpbWUgZmlsbGluZyBpbiB0aGUgcmVzb2x2ZWQgdmFsdWVzLlxuICAvLyBJdCdzIHVuZm9ydHVuYXRlIHRoYXQgd2UgaGF2ZSB0byBkbyB0d28gcGFzc2VzLlxuICAvLyBUT0RPKHNvZXJnZWwpOiB0ZXN0IHBlcmZvcm1hbmNlIGFuZCB0aGluayBoYXJkZXIgYWJvdXQgYSBmYXN0IHNvbHV0aW9uLlxuICBjb25zdCByZXN1bHQgPSBkZWVwTWFwSW50ZXJuYWwoaW5wdXQsIG1hcEZuLCBzZWVuKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgYXJndW1lbnQgaXMgaXRlcmFibGUuXG4gKlxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgYXJndW1lbnQgaXMgYW4gYXJyYXkgb3IgYW55IG5vbi1UZW5zb3Igb2JqZWN0LlxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG5leHBvcnQgZnVuY3Rpb24gaXNJdGVyYWJsZShvYmo6IGFueSk6IGJvb2xlYW4ge1xuICBsZXQgaXNUZXh0RGVjb2RlciA9IGZhbHNlO1xuICBpZiAodGYuZW52KCkuZ2V0KCdJU19CUk9XU0VSJykpIHtcbiAgICBpc1RleHREZWNvZGVyID0gb2JqIGluc3RhbmNlb2YgVGV4dERlY29kZXI7XG4gIH0gZWxzZSB7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXJlcXVpcmUtaW1wb3J0c1xuICAgIGNvbnN0IHtTdHJpbmdEZWNvZGVyfSA9IHJlcXVpcmUoJ3N0cmluZ19kZWNvZGVyJyk7XG4gICAgaXNUZXh0RGVjb2RlciA9IG9iaiBpbnN0YW5jZW9mIFN0cmluZ0RlY29kZXI7XG4gIH1cbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmICghQXJyYXlCdWZmZXIuaXNWaWV3KG9iaikpICYmXG4gICAgICAoQXJyYXkuaXNBcnJheShvYmopIHx8XG4gICAgICAgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmICEob2JqIGluc3RhbmNlb2YgdGYuVGVuc29yKSAmJlxuICAgICAgICAhKG9iaiBpbnN0YW5jZW9mIFByb21pc2UpICYmICFpc1RleHREZWNvZGVyKSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGFyZ3VtZW50IGNhbiBiZSBjb252ZXJ0ZWQgdG8gVGVuc29yLlxuICpcbiAqIFRlbnNvcnMsIHByaW1pdGl2ZXMsIGFycmF5cywgYW5kIFR5cGVkQXJyYXlzIGFsbCBxdWFsaWZ5OyBhbnl0aGluZyBlbHNlIGRvZXNcbiAqIG5vdC5cbiAqXG4gKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBhcmd1bWVudCBjYW4gYmUgY29udmVydGVkIHRvIFRlbnNvci5cbiAqL1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuZXhwb3J0IGZ1bmN0aW9uIGNhblRlbnNvcmlmeShvYmo6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gb2JqID09IG51bGwgfHwgaXNQcmltaXRpdmUob2JqKSB8fCBBcnJheS5pc0FycmF5KG9iaikgfHxcbiAgICAgICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiAob2JqIGluc3RhbmNlb2YgdGYuVGVuc29yKSkgfHxcbiAgICAgIHRmLnV0aWwuaXNUeXBlZEFycmF5KG9iaik7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBgdmFsdWVgIGlzIGEgcHJpbWl0aXZlIHR5cGUuIE90aGVyd2lzZSByZXR1cm5zXG4gKiBmYWxzZS4gVGhpcyBpcyBlcXVpdmFsYW50IHRvIG5vZGUgdXRpbC5pc1ByaW1pdGl2ZVxuICovXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZSh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgICB2YWx1ZSA9PT0gbnVsbCB8fFxuICAgICAgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbHVlICE9PSAnZnVuY3Rpb24nKSk7XG59XG4iXX0=