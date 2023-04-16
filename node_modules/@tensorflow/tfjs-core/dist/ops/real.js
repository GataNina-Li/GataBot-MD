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
import { Real } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Returns the real part of a complex (or real) tensor.
 *
 * Given a tensor input, this operation returns a tensor of type float that is
 * the real part of each element in input considered as a complex number.
 *
 * If the input is real, it simply makes a clone.
 *
 * ```js
 * const x = tf.complex([-2.25, 3.25], [4.75, 5.75]);
 * tf.real(x).print();
 * ```
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
function real_(input) {
    const $input = convertToTensor(input, 'input', 'real');
    const inputs = { input: $input };
    return ENGINE.runKernel(Real, inputs);
}
export const real = op({ real_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3JlYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsSUFBSSxFQUFhLE1BQU0saUJBQWlCLENBQUM7QUFHakQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFL0I7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxTQUFTLEtBQUssQ0FBbUIsS0FBbUI7SUFDbEQsTUFBTSxNQUFNLEdBQUcsZUFBZSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFFdkQsTUFBTSxNQUFNLEdBQWUsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFDLENBQUM7SUFDM0MsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUE4QixDQUFDLENBQUM7QUFDaEUsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsRUFBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7UmVhbCwgUmVhbElucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgcmVhbCBwYXJ0IG9mIGEgY29tcGxleCAob3IgcmVhbCkgdGVuc29yLlxuICpcbiAqIEdpdmVuIGEgdGVuc29yIGlucHV0LCB0aGlzIG9wZXJhdGlvbiByZXR1cm5zIGEgdGVuc29yIG9mIHR5cGUgZmxvYXQgdGhhdCBpc1xuICogdGhlIHJlYWwgcGFydCBvZiBlYWNoIGVsZW1lbnQgaW4gaW5wdXQgY29uc2lkZXJlZCBhcyBhIGNvbXBsZXggbnVtYmVyLlxuICpcbiAqIElmIHRoZSBpbnB1dCBpcyByZWFsLCBpdCBzaW1wbHkgbWFrZXMgYSBjbG9uZS5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgeCA9IHRmLmNvbXBsZXgoWy0yLjI1LCAzLjI1XSwgWzQuNzUsIDUuNzVdKTtcbiAqIHRmLnJlYWwoeCkucHJpbnQoKTtcbiAqIGBgYFxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdUZW5zb3JzJywgc3ViaGVhZGluZzogJ0NyZWF0aW9uJ31cbiAqL1xuZnVuY3Rpb24gcmVhbF88VCBleHRlbmRzIFRlbnNvcj4oaW5wdXQ6IFR8VGVuc29yTGlrZSk6IFQge1xuICBjb25zdCAkaW5wdXQgPSBjb252ZXJ0VG9UZW5zb3IoaW5wdXQsICdpbnB1dCcsICdyZWFsJyk7XG5cbiAgY29uc3QgaW5wdXRzOiBSZWFsSW5wdXRzID0ge2lucHV0OiAkaW5wdXR9O1xuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChSZWFsLCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXApO1xufVxuXG5leHBvcnQgY29uc3QgcmVhbCA9IG9wKHtyZWFsX30pO1xuIl19