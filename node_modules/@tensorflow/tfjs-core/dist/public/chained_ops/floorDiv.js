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
import { floorDiv } from '../../ops/floorDiv';
import { getGlobalTensorClass } from '../../tensor';
getGlobalTensorClass().prototype.floorDiv = function (b) {
    this.throwIfDisposed();
    return floorDiv(this, b);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvb3JEaXYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL3B1YmxpYy9jaGFpbmVkX29wcy9mbG9vckRpdi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDNUMsT0FBTyxFQUFDLG9CQUFvQixFQUFTLE1BQU0sY0FBYyxDQUFDO0FBUzFELG9CQUFvQixFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxVQUN4QyxDQUFvQjtJQUN0QixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDdkIsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzNCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbmltcG9ydCB7Zmxvb3JEaXZ9IGZyb20gJy4uLy4uL29wcy9mbG9vckRpdic7XG5pbXBvcnQge2dldEdsb2JhbFRlbnNvckNsYXNzLCBUZW5zb3J9IGZyb20gJy4uLy4uL3RlbnNvcic7XG5pbXBvcnQge1JhbmssIFRlbnNvckxpa2V9IGZyb20gJy4uLy4uL3R5cGVzJztcblxuZGVjbGFyZSBtb2R1bGUgJy4uLy4uL3RlbnNvcicge1xuICBpbnRlcmZhY2UgVGVuc29yPFIgZXh0ZW5kcyBSYW5rID0gUmFuaz4ge1xuICAgIGZsb29yRGl2PFQgZXh0ZW5kcyBUZW5zb3I+KGI6IFRlbnNvcnxUZW5zb3JMaWtlKTogVDtcbiAgfVxufVxuXG5nZXRHbG9iYWxUZW5zb3JDbGFzcygpLnByb3RvdHlwZS5mbG9vckRpdiA9IGZ1bmN0aW9uPFQgZXh0ZW5kcyBUZW5zb3I+KFxuICAgIGI6IFRlbnNvcnxUZW5zb3JMaWtlKTogVCB7XG4gIHRoaXMudGhyb3dJZkRpc3Bvc2VkKCk7XG4gIHJldHVybiBmbG9vckRpdih0aGlzLCBiKTtcbn07XG4iXX0=