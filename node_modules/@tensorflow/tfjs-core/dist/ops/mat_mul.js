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
import { BatchMatMul } from '../kernel_names';
import { makeTypesMatch } from '../tensor_util';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Computes the dot product of two matrices, A * B. These must be matrices.
 *
 * ```js
 * const a = tf.tensor2d([1, 2], [1, 2]);
 * const b = tf.tensor2d([1, 2, 3, 4], [2, 2]);
 *
 * a.matMul(b).print();  // or tf.matMul(a, b)
 * ```
 * @param a First matrix in dot product operation.
 * @param b Second matrix in dot product operation.
 * @param transposeA If true, `a` is transposed before multiplication.
 * @param transposeB If true, `b` is transposed before multiplication.
 *
 * @doc {heading: 'Operations', subheading: 'Matrices'}
 */
function matMul_(a, b, transposeA = false, transposeB = false) {
    let $a = convertToTensor(a, 'a', 'matMul');
    let $b = convertToTensor(b, 'b', 'matMul');
    [$a, $b] = makeTypesMatch($a, $b);
    const inputs = { a: $a, b: $b };
    const attrs = { transposeA, transposeB };
    return ENGINE.runKernel(BatchMatMul, inputs, attrs);
}
export const matMul = op({ matMul_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0X211bC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL21hdF9tdWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsV0FBVyxFQUFzQyxNQUFNLGlCQUFpQixDQUFDO0FBSWpGLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHbkQsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvQjs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxTQUFTLE9BQU8sQ0FDWixDQUFvQixFQUFFLENBQW9CLEVBQUUsVUFBVSxHQUFHLEtBQUssRUFDOUQsVUFBVSxHQUFHLEtBQUs7SUFDcEIsSUFBSSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDM0MsSUFBSSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDM0MsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUVsQyxNQUFNLE1BQU0sR0FBc0IsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUMsQ0FBQztJQUNqRCxNQUFNLEtBQUssR0FBcUIsRUFBQyxVQUFVLEVBQUUsVUFBVSxFQUFDLENBQUM7SUFFekQsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUNuQixXQUFXLEVBQUUsTUFBOEIsRUFBRSxLQUEyQixDQUFDLENBQUM7QUFDaEYsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge0JhdGNoTWF0TXVsLCBCYXRjaE1hdE11bEF0dHJzLCBCYXRjaE1hdE11bElucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7TmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHttYWtlVHlwZXNNYXRjaH0gZnJvbSAnLi4vdGVuc29yX3V0aWwnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcblxuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuXG4vKipcbiAqIENvbXB1dGVzIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gbWF0cmljZXMsIEEgKiBCLiBUaGVzZSBtdXN0IGJlIG1hdHJpY2VzLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBhID0gdGYudGVuc29yMmQoWzEsIDJdLCBbMSwgMl0pO1xuICogY29uc3QgYiA9IHRmLnRlbnNvcjJkKFsxLCAyLCAzLCA0XSwgWzIsIDJdKTtcbiAqXG4gKiBhLm1hdE11bChiKS5wcmludCgpOyAgLy8gb3IgdGYubWF0TXVsKGEsIGIpXG4gKiBgYGBcbiAqIEBwYXJhbSBhIEZpcnN0IG1hdHJpeCBpbiBkb3QgcHJvZHVjdCBvcGVyYXRpb24uXG4gKiBAcGFyYW0gYiBTZWNvbmQgbWF0cml4IGluIGRvdCBwcm9kdWN0IG9wZXJhdGlvbi5cbiAqIEBwYXJhbSB0cmFuc3Bvc2VBIElmIHRydWUsIGBhYCBpcyB0cmFuc3Bvc2VkIGJlZm9yZSBtdWx0aXBsaWNhdGlvbi5cbiAqIEBwYXJhbSB0cmFuc3Bvc2VCIElmIHRydWUsIGBiYCBpcyB0cmFuc3Bvc2VkIGJlZm9yZSBtdWx0aXBsaWNhdGlvbi5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdNYXRyaWNlcyd9XG4gKi9cbmZ1bmN0aW9uIG1hdE11bF88VCBleHRlbmRzIFRlbnNvcj4oXG4gICAgYTogVGVuc29yfFRlbnNvckxpa2UsIGI6IFRlbnNvcnxUZW5zb3JMaWtlLCB0cmFuc3Bvc2VBID0gZmFsc2UsXG4gICAgdHJhbnNwb3NlQiA9IGZhbHNlKTogVCB7XG4gIGxldCAkYSA9IGNvbnZlcnRUb1RlbnNvcihhLCAnYScsICdtYXRNdWwnKTtcbiAgbGV0ICRiID0gY29udmVydFRvVGVuc29yKGIsICdiJywgJ21hdE11bCcpO1xuICBbJGEsICRiXSA9IG1ha2VUeXBlc01hdGNoKCRhLCAkYik7XG5cbiAgY29uc3QgaW5wdXRzOiBCYXRjaE1hdE11bElucHV0cyA9IHthOiAkYSwgYjogJGJ9O1xuICBjb25zdCBhdHRyczogQmF0Y2hNYXRNdWxBdHRycyA9IHt0cmFuc3Bvc2VBLCB0cmFuc3Bvc2VCfTtcblxuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChcbiAgICAgIEJhdGNoTWF0TXVsLCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXAsIGF0dHJzIGFzIHt9IGFzIE5hbWVkQXR0ck1hcCk7XG59XG5cbmV4cG9ydCBjb25zdCBtYXRNdWwgPSBvcCh7bWF0TXVsX30pO1xuIl19