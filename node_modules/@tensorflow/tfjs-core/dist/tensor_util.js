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
 * =============================================================================
 */
import { Tensor } from './tensor';
import { upcastType } from './types';
import { assert } from './util';
export function makeTypesMatch(a, b) {
    if (a.dtype === b.dtype) {
        return [a, b];
    }
    const dtype = upcastType(a.dtype, b.dtype);
    return [a.cast(dtype), b.cast(dtype)];
}
export function assertTypesMatch(a, b) {
    assert(a.dtype === b.dtype, () => `The dtypes of the first(${a.dtype}) and` +
        ` second(${b.dtype}) input must match`);
}
export function isTensorInList(tensor, tensorList) {
    return tensorList.some(x => x.id === tensor.id);
}
/**
 * Extracts any `Tensor`s found within the provided object.
 *
 * @param container an object that may be a `Tensor` or may directly contain
 *   `Tensor`s, such as a `Tensor[]` or `{key: Tensor, ...}`. In general it
 *   is safe to pass any object here, except that `Promise`s are not
 *   supported.
 * @returns An array of `Tensors` found within the passed object. If the
 *   argument is simply a `Tensor', a list containing that `Tensor` is
 *   returned. If the object is not a `Tensor` or does not
 *   contain `Tensors`, an empty list is returned.
 */
export function getTensorsInContainer(result) {
    const list = [];
    const seen = new Set();
    walkTensorContainer(result, list, seen);
    return list;
}
function walkTensorContainer(container, list, seen) {
    if (container == null) {
        return;
    }
    if (container instanceof Tensor) {
        list.push(container);
        return;
    }
    if (!isIterable(container)) {
        return;
    }
    // Iteration over keys works also for arrays.
    const iterable = container;
    for (const k in iterable) {
        const val = iterable[k];
        if (!seen.has(val)) {
            seen.add(val);
            walkTensorContainer(val, list, seen);
        }
    }
}
// tslint:disable-next-line:no-any
function isIterable(obj) {
    return Array.isArray(obj) || typeof obj === 'object';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVuc29yX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL3RlbnNvcl91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFFaEMsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUNuQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBRTlCLE1BQU0sVUFBVSxjQUFjLENBQW1CLENBQUksRUFBRSxDQUFJO0lBQ3pELElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFO1FBQ3ZCLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDZjtJQUNELE1BQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUVELE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxDQUFTLEVBQUUsQ0FBUztJQUNuRCxNQUFNLENBQ0YsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsS0FBSyxFQUNuQixHQUFHLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLEtBQUssT0FBTztRQUMzQyxXQUFXLENBQUMsQ0FBQyxLQUFLLG9CQUFvQixDQUFDLENBQUM7QUFDbEQsQ0FBQztBQUVELE1BQU0sVUFBVSxjQUFjLENBQUMsTUFBYyxFQUFFLFVBQW9CO0lBQ2pFLE9BQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xELENBQUM7QUFFRDs7Ozs7Ozs7Ozs7R0FXRztBQUNILE1BQU0sVUFBVSxxQkFBcUIsQ0FBQyxNQUF1QjtJQUMzRCxNQUFNLElBQUksR0FBYSxFQUFFLENBQUM7SUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQVcsQ0FBQztJQUNoQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hDLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELFNBQVMsbUJBQW1CLENBQ3hCLFNBQTBCLEVBQUUsSUFBYyxFQUFFLElBQWtCO0lBQ2hFLElBQUksU0FBUyxJQUFJLElBQUksRUFBRTtRQUNyQixPQUFPO0tBQ1I7SUFDRCxJQUFJLFNBQVMsWUFBWSxNQUFNLEVBQUU7UUFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyQixPQUFPO0tBQ1I7SUFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQzFCLE9BQU87S0FDUjtJQUNELDZDQUE2QztJQUM3QyxNQUFNLFFBQVEsR0FBRyxTQUFpQyxDQUFDO0lBQ25ELEtBQUssTUFBTSxDQUFDLElBQUksUUFBUSxFQUFFO1FBQ3hCLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2QsbUJBQW1CLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUN0QztLQUNGO0FBQ0gsQ0FBQztBQUVELGtDQUFrQztBQUNsQyxTQUFTLFVBQVUsQ0FBQyxHQUFRO0lBQzFCLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLENBQUM7QUFDdkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4vdGVuc29yJztcbmltcG9ydCB7VGVuc29yQ29udGFpbmVyLCBUZW5zb3JDb250YWluZXJBcnJheX0gZnJvbSAnLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHt1cGNhc3RUeXBlfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7YXNzZXJ0fSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gbWFrZVR5cGVzTWF0Y2g8VCBleHRlbmRzIFRlbnNvcj4oYTogVCwgYjogVCk6IFtULCBUXSB7XG4gIGlmIChhLmR0eXBlID09PSBiLmR0eXBlKSB7XG4gICAgcmV0dXJuIFthLCBiXTtcbiAgfVxuICBjb25zdCBkdHlwZSA9IHVwY2FzdFR5cGUoYS5kdHlwZSwgYi5kdHlwZSk7XG4gIHJldHVybiBbYS5jYXN0KGR0eXBlKSwgYi5jYXN0KGR0eXBlKV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRUeXBlc01hdGNoKGE6IFRlbnNvciwgYjogVGVuc29yKTogdm9pZCB7XG4gIGFzc2VydChcbiAgICAgIGEuZHR5cGUgPT09IGIuZHR5cGUsXG4gICAgICAoKSA9PiBgVGhlIGR0eXBlcyBvZiB0aGUgZmlyc3QoJHthLmR0eXBlfSkgYW5kYCArXG4gICAgICAgICAgYCBzZWNvbmQoJHtiLmR0eXBlfSkgaW5wdXQgbXVzdCBtYXRjaGApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUZW5zb3JJbkxpc3QodGVuc29yOiBUZW5zb3IsIHRlbnNvckxpc3Q6IFRlbnNvcltdKTogYm9vbGVhbiB7XG4gIHJldHVybiB0ZW5zb3JMaXN0LnNvbWUoeCA9PiB4LmlkID09PSB0ZW5zb3IuaWQpO1xufVxuXG4vKipcbiAqIEV4dHJhY3RzIGFueSBgVGVuc29yYHMgZm91bmQgd2l0aGluIHRoZSBwcm92aWRlZCBvYmplY3QuXG4gKlxuICogQHBhcmFtIGNvbnRhaW5lciBhbiBvYmplY3QgdGhhdCBtYXkgYmUgYSBgVGVuc29yYCBvciBtYXkgZGlyZWN0bHkgY29udGFpblxuICogICBgVGVuc29yYHMsIHN1Y2ggYXMgYSBgVGVuc29yW11gIG9yIGB7a2V5OiBUZW5zb3IsIC4uLn1gLiBJbiBnZW5lcmFsIGl0XG4gKiAgIGlzIHNhZmUgdG8gcGFzcyBhbnkgb2JqZWN0IGhlcmUsIGV4Y2VwdCB0aGF0IGBQcm9taXNlYHMgYXJlIG5vdFxuICogICBzdXBwb3J0ZWQuXG4gKiBAcmV0dXJucyBBbiBhcnJheSBvZiBgVGVuc29yc2AgZm91bmQgd2l0aGluIHRoZSBwYXNzZWQgb2JqZWN0LiBJZiB0aGVcbiAqICAgYXJndW1lbnQgaXMgc2ltcGx5IGEgYFRlbnNvcicsIGEgbGlzdCBjb250YWluaW5nIHRoYXQgYFRlbnNvcmAgaXNcbiAqICAgcmV0dXJuZWQuIElmIHRoZSBvYmplY3QgaXMgbm90IGEgYFRlbnNvcmAgb3IgZG9lcyBub3RcbiAqICAgY29udGFpbiBgVGVuc29yc2AsIGFuIGVtcHR5IGxpc3QgaXMgcmV0dXJuZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUZW5zb3JzSW5Db250YWluZXIocmVzdWx0OiBUZW5zb3JDb250YWluZXIpOiBUZW5zb3JbXSB7XG4gIGNvbnN0IGxpc3Q6IFRlbnNvcltdID0gW107XG4gIGNvbnN0IHNlZW4gPSBuZXcgU2V0PHt9fHZvaWQ+KCk7XG4gIHdhbGtUZW5zb3JDb250YWluZXIocmVzdWx0LCBsaXN0LCBzZWVuKTtcbiAgcmV0dXJuIGxpc3Q7XG59XG5cbmZ1bmN0aW9uIHdhbGtUZW5zb3JDb250YWluZXIoXG4gICAgY29udGFpbmVyOiBUZW5zb3JDb250YWluZXIsIGxpc3Q6IFRlbnNvcltdLCBzZWVuOiBTZXQ8e318dm9pZD4pOiB2b2lkIHtcbiAgaWYgKGNvbnRhaW5lciA9PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChjb250YWluZXIgaW5zdGFuY2VvZiBUZW5zb3IpIHtcbiAgICBsaXN0LnB1c2goY29udGFpbmVyKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCFpc0l0ZXJhYmxlKGNvbnRhaW5lcikpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gSXRlcmF0aW9uIG92ZXIga2V5cyB3b3JrcyBhbHNvIGZvciBhcnJheXMuXG4gIGNvbnN0IGl0ZXJhYmxlID0gY29udGFpbmVyIGFzIFRlbnNvckNvbnRhaW5lckFycmF5O1xuICBmb3IgKGNvbnN0IGsgaW4gaXRlcmFibGUpIHtcbiAgICBjb25zdCB2YWwgPSBpdGVyYWJsZVtrXTtcbiAgICBpZiAoIXNlZW4uaGFzKHZhbCkpIHtcbiAgICAgIHNlZW4uYWRkKHZhbCk7XG4gICAgICB3YWxrVGVuc29yQ29udGFpbmVyKHZhbCwgbGlzdCwgc2Vlbik7XG4gICAgfVxuICB9XG59XG5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbmZ1bmN0aW9uIGlzSXRlcmFibGUob2JqOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKSB8fCB0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jztcbn1cbiJdfQ==