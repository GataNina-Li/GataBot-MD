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
import { ENGINE } from '../engine';
/**
 * Creates a new variable with the provided initial value.
 * ```js
 * const x = tf.variable(tf.tensor([1, 2, 3]));
 * x.assign(tf.tensor([4, 5, 6]));
 *
 * x.print();
 * ```
 *
 * @param initialValue Initial value for the tensor.
 * @param trainable If true, optimizers are allowed to update it.
 * @param name Name of the variable. Defaults to a unique id.
 * @param dtype If set, initialValue will be converted to the given type.
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
export function variable(initialValue, trainable = true, name, dtype) {
    return ENGINE.makeVariable(initialValue, trainable, name, dtype);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy92YXJpYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBSWpDOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE1BQU0sVUFBVSxRQUFRLENBQ3BCLFlBQXVCLEVBQUUsU0FBUyxHQUFHLElBQUksRUFBRSxJQUFhLEVBQ3hELEtBQWdCO0lBQ2xCLE9BQU8sTUFBTSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLENBQ2hELENBQUM7QUFDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge1RlbnNvciwgVmFyaWFibGV9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge0RhdGFUeXBlLCBSYW5rfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyB2YXJpYWJsZSB3aXRoIHRoZSBwcm92aWRlZCBpbml0aWFsIHZhbHVlLlxuICogYGBganNcbiAqIGNvbnN0IHggPSB0Zi52YXJpYWJsZSh0Zi50ZW5zb3IoWzEsIDIsIDNdKSk7XG4gKiB4LmFzc2lnbih0Zi50ZW5zb3IoWzQsIDUsIDZdKSk7XG4gKlxuICogeC5wcmludCgpO1xuICogYGBgXG4gKlxuICogQHBhcmFtIGluaXRpYWxWYWx1ZSBJbml0aWFsIHZhbHVlIGZvciB0aGUgdGVuc29yLlxuICogQHBhcmFtIHRyYWluYWJsZSBJZiB0cnVlLCBvcHRpbWl6ZXJzIGFyZSBhbGxvd2VkIHRvIHVwZGF0ZSBpdC5cbiAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIHZhcmlhYmxlLiBEZWZhdWx0cyB0byBhIHVuaXF1ZSBpZC5cbiAqIEBwYXJhbSBkdHlwZSBJZiBzZXQsIGluaXRpYWxWYWx1ZSB3aWxsIGJlIGNvbnZlcnRlZCB0byB0aGUgZ2l2ZW4gdHlwZS5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnVGVuc29ycycsIHN1YmhlYWRpbmc6ICdDcmVhdGlvbid9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YXJpYWJsZTxSIGV4dGVuZHMgUmFuaz4oXG4gICAgaW5pdGlhbFZhbHVlOiBUZW5zb3I8Uj4sIHRyYWluYWJsZSA9IHRydWUsIG5hbWU/OiBzdHJpbmcsXG4gICAgZHR5cGU/OiBEYXRhVHlwZSk6IFZhcmlhYmxlPFI+IHtcbiAgcmV0dXJuIEVOR0lORS5tYWtlVmFyaWFibGUoaW5pdGlhbFZhbHVlLCB0cmFpbmFibGUsIG5hbWUsIGR0eXBlKSBhc1xuICAgICAgVmFyaWFibGU8Uj47XG59XG4iXX0=