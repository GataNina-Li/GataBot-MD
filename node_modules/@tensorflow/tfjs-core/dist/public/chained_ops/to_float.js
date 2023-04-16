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
// TODO update import path once op is modularized.
import { cast } from '../../ops/ops';
import { getGlobalTensorClass } from '../../tensor';
/**
 * Casts the array to type `float32`
 *
 * @doc {heading: 'Tensors', subheading: 'Classes'}
 */
getGlobalTensorClass().prototype.toFloat = function () {
    this.throwIfDisposed();
    return cast(this, 'float32');
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9fZmxvYXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL3B1YmxpYy9jaGFpbmVkX29wcy90b19mbG9hdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxrREFBa0Q7QUFDbEQsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNuQyxPQUFPLEVBQUMsb0JBQW9CLEVBQVMsTUFBTSxjQUFjLENBQUM7QUFTMUQ7Ozs7R0FJRztBQUNILG9CQUFvQixFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRztJQUV6QyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDdkIsT0FBTyxJQUFJLENBQUksSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ2xDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuLy8gVE9ETyB1cGRhdGUgaW1wb3J0IHBhdGggb25jZSBvcCBpcyBtb2R1bGFyaXplZC5cbmltcG9ydCB7Y2FzdH0gZnJvbSAnLi4vLi4vb3BzL29wcyc7XG5pbXBvcnQge2dldEdsb2JhbFRlbnNvckNsYXNzLCBUZW5zb3J9IGZyb20gJy4uLy4uL3RlbnNvcic7XG5pbXBvcnQge1Jhbmt9IGZyb20gJy4uLy4uL3R5cGVzJztcblxuZGVjbGFyZSBtb2R1bGUgJy4uLy4uL3RlbnNvcicge1xuICBpbnRlcmZhY2UgVGVuc29yPFIgZXh0ZW5kcyBSYW5rID0gUmFuaz4ge1xuICAgIHRvRmxvYXQ8VCBleHRlbmRzIFRlbnNvcj4odGhpczogVCk6IFQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDYXN0cyB0aGUgYXJyYXkgdG8gdHlwZSBgZmxvYXQzMmBcbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnVGVuc29ycycsIHN1YmhlYWRpbmc6ICdDbGFzc2VzJ31cbiAqL1xuZ2V0R2xvYmFsVGVuc29yQ2xhc3MoKS5wcm90b3R5cGUudG9GbG9hdCA9IGZ1bmN0aW9uPFQgZXh0ZW5kcyBUZW5zb3I+KHRoaXM6IFQpOlxuICAgIFQge1xuICB0aGlzLnRocm93SWZEaXNwb3NlZCgpO1xuICByZXR1cm4gY2FzdDxUPih0aGlzLCAnZmxvYXQzMicpO1xufTtcbiJdfQ==