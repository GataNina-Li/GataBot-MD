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
 * Converts a `tf.Tensor` to a `tf.Tensor2D`.
 *
 * @param rows Number of rows in `tf.Tensor2D`.
 * @param columns Number of columns in `tf.Tensor2D`.
 * @doc {heading: 'Tensors', subheading: 'Classes'}
 */
getGlobalTensorClass().prototype.as2D = function (rows, columns) {
    this.throwIfDisposed();
    return reshape(this, [rows, columns]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXMyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvcHVibGljL2NoYWluZWRfb3BzL2FzMmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzFDLE9BQU8sRUFBQyxvQkFBb0IsRUFBUyxNQUFNLGNBQWMsQ0FBQztBQVMxRDs7Ozs7O0dBTUc7QUFDSCxvQkFBb0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsVUFDcEMsSUFBWSxFQUFFLE9BQWU7SUFDL0IsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3ZCLE9BQU8sT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBTSxDQUFDO0FBQzdDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtyZXNoYXBlfSBmcm9tICcuLi8uLi9vcHMvcmVzaGFwZSc7XG5pbXBvcnQge2dldEdsb2JhbFRlbnNvckNsYXNzLCBUZW5zb3J9IGZyb20gJy4uLy4uL3RlbnNvcic7XG5pbXBvcnQge1Jhbmt9IGZyb20gJy4uLy4uL3R5cGVzJztcblxuZGVjbGFyZSBtb2R1bGUgJy4uLy4uL3RlbnNvcicge1xuICBpbnRlcmZhY2UgVGVuc29yPFIgZXh0ZW5kcyBSYW5rID0gUmFuaz4ge1xuICAgIGFzMkQ8VCBleHRlbmRzIFRlbnNvcj4ocm93czogbnVtYmVyLCBjb2x1bW5zOiBudW1iZXIpOiBUZW5zb3IyRDtcbiAgfVxufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgYHRmLlRlbnNvcmAgdG8gYSBgdGYuVGVuc29yMkRgLlxuICpcbiAqIEBwYXJhbSByb3dzIE51bWJlciBvZiByb3dzIGluIGB0Zi5UZW5zb3IyRGAuXG4gKiBAcGFyYW0gY29sdW1ucyBOdW1iZXIgb2YgY29sdW1ucyBpbiBgdGYuVGVuc29yMkRgLlxuICogQGRvYyB7aGVhZGluZzogJ1RlbnNvcnMnLCBzdWJoZWFkaW5nOiAnQ2xhc3Nlcyd9XG4gKi9cbmdldEdsb2JhbFRlbnNvckNsYXNzKCkucHJvdG90eXBlLmFzMkQgPSBmdW5jdGlvbjxUIGV4dGVuZHMgVGVuc29yPihcbiAgICByb3dzOiBudW1iZXIsIGNvbHVtbnM6IG51bWJlcik6IFQge1xuICB0aGlzLnRocm93SWZEaXNwb3NlZCgpO1xuICByZXR1cm4gcmVzaGFwZSh0aGlzLCBbcm93cywgY29sdW1uc10pIGFzIFQ7XG59O1xuIl19