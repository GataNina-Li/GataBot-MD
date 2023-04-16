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
import { deepMap, isIterable } from './deep_map';
export function deepClone(container) {
    return deepMap(container, cloneIfTensor);
}
// tslint:disable-next-line: no-any
function cloneIfTensor(item) {
    if (item instanceof tf.Tensor) {
        return ({ value: item.clone(), recurse: false });
    }
    else if (isIterable(item)) {
        return { value: null, recurse: true };
    }
    else {
        return { value: item, recurse: false };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVlcF9jbG9uZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtZGF0YS9zcmMvdXRpbC9kZWVwX2Nsb25lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBRUgsT0FBTyxLQUFLLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM1QyxPQUFPLEVBQUMsT0FBTyxFQUFpQixVQUFVLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFOUQsTUFBTSxVQUFVLFNBQVMsQ0FBSSxTQUFZO0lBQ3ZDLE9BQU8sT0FBTyxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBRUQsbUNBQW1DO0FBQ25DLFNBQVMsYUFBYSxDQUFDLElBQVM7SUFDOUIsSUFBSSxJQUFJLFlBQVksRUFBRSxDQUFDLE1BQU0sRUFBRTtRQUM3QixPQUFPLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0tBQ2hEO1NBQU0sSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDM0IsT0FBTyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDO0tBQ3JDO1NBQU07UUFDTCxPQUFPLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDLENBQUM7S0FDdEM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0ICogYXMgdGYgZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbmltcG9ydCB7ZGVlcE1hcCwgRGVlcE1hcFJlc3VsdCwgaXNJdGVyYWJsZX0gZnJvbSAnLi9kZWVwX21hcCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWVwQ2xvbmU8VD4oY29udGFpbmVyOiBUKTogVCB7XG4gIHJldHVybiBkZWVwTWFwKGNvbnRhaW5lciwgY2xvbmVJZlRlbnNvcik7XG59XG5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tYW55XG5mdW5jdGlvbiBjbG9uZUlmVGVuc29yKGl0ZW06IGFueSk6IERlZXBNYXBSZXN1bHQge1xuICBpZiAoaXRlbSBpbnN0YW5jZW9mIHRmLlRlbnNvcikge1xuICAgIHJldHVybiAoe3ZhbHVlOiBpdGVtLmNsb25lKCksIHJlY3Vyc2U6IGZhbHNlfSk7XG4gIH0gZWxzZSBpZiAoaXNJdGVyYWJsZShpdGVtKSkge1xuICAgIHJldHVybiB7dmFsdWU6IG51bGwsIHJlY3Vyc2U6IHRydWV9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7dmFsdWU6IGl0ZW0sIHJlY3Vyc2U6IGZhbHNlfTtcbiAgfVxufVxuIl19