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
import { ENGINE } from '../engine';
import { Less } from '../kernel_names';
import { makeTypesMatch } from '../tensor_util';
import { convertToTensor } from '../tensor_util_env';
import { assertAndGetBroadcastShape } from './broadcast_util';
import { op } from './operation';
/**
 * Returns the truth value of (a < b) element-wise. Supports broadcasting.
 *
 * ```js
 * const a = tf.tensor1d([1, 2, 3]);
 * const b = tf.tensor1d([2, 2, 2]);
 *
 * a.less(b).print();
 * ```
 * @param a The first input tensor.
 * @param b The second input tensor. Must have the same dtype as `a`.
 *
 * @doc {heading: 'Operations', subheading: 'Logical'}
 */
function less_(a, b) {
    let $a = convertToTensor(a, 'a', 'less', 'string_or_numeric');
    let $b = convertToTensor(b, 'b', 'less', 'string_or_numeric');
    [$a, $b] = makeTypesMatch($a, $b);
    assertAndGetBroadcastShape($a.shape, $b.shape);
    const inputs = { a: $a, b: $b };
    return ENGINE.runKernel(Less, inputs);
}
export const less = op({ less_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2xlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsSUFBSSxFQUFhLE1BQU0saUJBQWlCLENBQUM7QUFHakQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUduRCxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUM1RCxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRS9COzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxTQUFTLEtBQUssQ0FDVixDQUFvQixFQUFFLENBQW9CO0lBQzVDLElBQUksRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQzlELElBQUksRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQzlELENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFbEMsMEJBQTBCLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFL0MsTUFBTSxNQUFNLEdBQWUsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUMsQ0FBQztJQUUxQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQThCLENBQUMsQ0FBQztBQUNoRSxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxFQUFDLEtBQUssRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7TGVzcywgTGVzc0lucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7bWFrZVR5cGVzTWF0Y2h9IGZyb20gJy4uL3RlbnNvcl91dGlsJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7YXNzZXJ0QW5kR2V0QnJvYWRjYXN0U2hhcGV9IGZyb20gJy4vYnJvYWRjYXN0X3V0aWwnO1xuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHRydXRoIHZhbHVlIG9mIChhIDwgYikgZWxlbWVudC13aXNlLiBTdXBwb3J0cyBicm9hZGNhc3RpbmcuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMSwgMiwgM10pO1xuICogY29uc3QgYiA9IHRmLnRlbnNvcjFkKFsyLCAyLCAyXSk7XG4gKlxuICogYS5sZXNzKGIpLnByaW50KCk7XG4gKiBgYGBcbiAqIEBwYXJhbSBhIFRoZSBmaXJzdCBpbnB1dCB0ZW5zb3IuXG4gKiBAcGFyYW0gYiBUaGUgc2Vjb25kIGlucHV0IHRlbnNvci4gTXVzdCBoYXZlIHRoZSBzYW1lIGR0eXBlIGFzIGBhYC5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdMb2dpY2FsJ31cbiAqL1xuZnVuY3Rpb24gbGVzc188VCBleHRlbmRzIFRlbnNvcj4oXG4gICAgYTogVGVuc29yfFRlbnNvckxpa2UsIGI6IFRlbnNvcnxUZW5zb3JMaWtlKTogVCB7XG4gIGxldCAkYSA9IGNvbnZlcnRUb1RlbnNvcihhLCAnYScsICdsZXNzJywgJ3N0cmluZ19vcl9udW1lcmljJyk7XG4gIGxldCAkYiA9IGNvbnZlcnRUb1RlbnNvcihiLCAnYicsICdsZXNzJywgJ3N0cmluZ19vcl9udW1lcmljJyk7XG4gIFskYSwgJGJdID0gbWFrZVR5cGVzTWF0Y2goJGEsICRiKTtcblxuICBhc3NlcnRBbmRHZXRCcm9hZGNhc3RTaGFwZSgkYS5zaGFwZSwgJGIuc2hhcGUpO1xuXG4gIGNvbnN0IGlucHV0czogTGVzc0lucHV0cyA9IHthOiAkYSwgYjogJGJ9O1xuXG4gIHJldHVybiBFTkdJTkUucnVuS2VybmVsKExlc3MsIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCk7XG59XG5cbmV4cG9ydCBjb25zdCBsZXNzID0gb3Aoe2xlc3NffSk7XG4iXX0=