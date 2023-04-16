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
import { reshape } from '../../ops/reshape';
import { getGlobalTensorClass } from '../../tensor';
/**
 * Converts a `tf.Tensor` to a `tf.Tensor4D`.
 *
 * @param rows Number of rows in `tf.Tensor4D`.
 * @param columns Number of columns in `tf.Tensor4D`.
 * @param depth Depth of `tf.Tensor4D`.
 * @param depth2 4th dimension of `tf.Tensor4D`.
 * @doc {heading: 'Tensors', subheading: 'Classes'}
 */
getGlobalTensorClass().prototype.as4D = function (rows, columns, depth, depth2) {
    this.throwIfDisposed();
    return reshape(this, [rows, columns, depth, depth2]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXM0ZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvcHVibGljL2NoYWluZWRfb3BzL2FzNGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzFDLE9BQU8sRUFBQyxvQkFBb0IsRUFBUyxNQUFNLGNBQWMsQ0FBQztBQVUxRDs7Ozs7Ozs7R0FRRztBQUNILG9CQUFvQixFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxVQUNwQyxJQUFZLEVBQUUsT0FBZSxFQUFFLEtBQWEsRUFBRSxNQUFjO0lBQzlELElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN2QixPQUFPLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBTSxDQUFDO0FBQzVELENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtyZXNoYXBlfSBmcm9tICcuLi8uLi9vcHMvcmVzaGFwZSc7XG5pbXBvcnQge2dldEdsb2JhbFRlbnNvckNsYXNzLCBUZW5zb3J9IGZyb20gJy4uLy4uL3RlbnNvcic7XG5pbXBvcnQge1Jhbmt9IGZyb20gJy4uLy4uL3R5cGVzJztcblxuZGVjbGFyZSBtb2R1bGUgJy4uLy4uL3RlbnNvcicge1xuICBpbnRlcmZhY2UgVGVuc29yPFIgZXh0ZW5kcyBSYW5rID0gUmFuaz4ge1xuICAgIGFzNEQ8VCBleHRlbmRzIFRlbnNvcj4oXG4gICAgICAgIHJvd3M6IG51bWJlciwgY29sdW1uczogbnVtYmVyLCBkZXB0aDogbnVtYmVyLCBkZXB0aDI6IG51bWJlcik6IFRlbnNvcjREO1xuICB9XG59XG5cbi8qKlxuICogQ29udmVydHMgYSBgdGYuVGVuc29yYCB0byBhIGB0Zi5UZW5zb3I0RGAuXG4gKlxuICogQHBhcmFtIHJvd3MgTnVtYmVyIG9mIHJvd3MgaW4gYHRmLlRlbnNvcjREYC5cbiAqIEBwYXJhbSBjb2x1bW5zIE51bWJlciBvZiBjb2x1bW5zIGluIGB0Zi5UZW5zb3I0RGAuXG4gKiBAcGFyYW0gZGVwdGggRGVwdGggb2YgYHRmLlRlbnNvcjREYC5cbiAqIEBwYXJhbSBkZXB0aDIgNHRoIGRpbWVuc2lvbiBvZiBgdGYuVGVuc29yNERgLlxuICogQGRvYyB7aGVhZGluZzogJ1RlbnNvcnMnLCBzdWJoZWFkaW5nOiAnQ2xhc3Nlcyd9XG4gKi9cbmdldEdsb2JhbFRlbnNvckNsYXNzKCkucHJvdG90eXBlLmFzNEQgPSBmdW5jdGlvbjxUIGV4dGVuZHMgVGVuc29yPihcbiAgICByb3dzOiBudW1iZXIsIGNvbHVtbnM6IG51bWJlciwgZGVwdGg6IG51bWJlciwgZGVwdGgyOiBudW1iZXIpOiBUIHtcbiAgdGhpcy50aHJvd0lmRGlzcG9zZWQoKTtcbiAgcmV0dXJuIHJlc2hhcGUodGhpcywgW3Jvd3MsIGNvbHVtbnMsIGRlcHRoLCBkZXB0aDJdKSBhcyBUO1xufTtcbiJdfQ==