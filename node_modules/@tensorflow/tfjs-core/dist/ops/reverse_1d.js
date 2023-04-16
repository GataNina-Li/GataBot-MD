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
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { op } from './operation';
import { reverse } from './reverse';
/**
 * Reverses a `tf.Tensor1D`.
 *
 * @param x The input tensor.
 */
function reverse1d_(x) {
    const $x = convertToTensor(x, 'x', 'reverse');
    util.assert($x.rank === 1, () => `Error in reverse1D: x must be rank 1 but got rank ${$x.rank}.`);
    return reverse($x, 0);
}
export const reverse1d = op({ reverse1d_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV2ZXJzZV8xZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3JldmVyc2VfMWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBR0gsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE9BQU8sS0FBSyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBQ2hDLE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDL0IsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUVsQzs7OztHQUlHO0FBQ0gsU0FBUyxVQUFVLENBQUMsQ0FBc0I7SUFDeEMsTUFBTSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDOUMsSUFBSSxDQUFDLE1BQU0sQ0FDUCxFQUFFLENBQUMsSUFBSSxLQUFLLENBQUMsRUFDYixHQUFHLEVBQUUsQ0FBQyxxREFBcUQsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7SUFDM0UsT0FBTyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLEVBQUMsVUFBVSxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtUZW5zb3IxRH0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuaW1wb3J0IHtyZXZlcnNlfSBmcm9tICcuL3JldmVyc2UnO1xuXG4vKipcbiAqIFJldmVyc2VzIGEgYHRmLlRlbnNvcjFEYC5cbiAqXG4gKiBAcGFyYW0geCBUaGUgaW5wdXQgdGVuc29yLlxuICovXG5mdW5jdGlvbiByZXZlcnNlMWRfKHg6IFRlbnNvcjFEfFRlbnNvckxpa2UpOiBUZW5zb3IxRCB7XG4gIGNvbnN0ICR4ID0gY29udmVydFRvVGVuc29yKHgsICd4JywgJ3JldmVyc2UnKTtcbiAgdXRpbC5hc3NlcnQoXG4gICAgICAkeC5yYW5rID09PSAxLFxuICAgICAgKCkgPT4gYEVycm9yIGluIHJldmVyc2UxRDogeCBtdXN0IGJlIHJhbmsgMSBidXQgZ290IHJhbmsgJHskeC5yYW5rfS5gKTtcbiAgcmV0dXJuIHJldmVyc2UoJHgsIDApO1xufVxuXG5leHBvcnQgY29uc3QgcmV2ZXJzZTFkID0gb3Aoe3JldmVyc2UxZF99KTtcbiJdfQ==