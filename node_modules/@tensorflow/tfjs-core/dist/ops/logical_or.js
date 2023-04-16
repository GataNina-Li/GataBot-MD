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
import { LogicalOr } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { assertAndGetBroadcastShape } from './broadcast_util';
import { op } from './operation';
/**
 * Returns the truth value of `a OR b` element-wise. Supports broadcasting.
 *
 * ```js
 * const a = tf.tensor1d([false, false, true, true], 'bool');
 * const b = tf.tensor1d([false, true, false, true], 'bool');
 *
 * a.logicalOr(b).print();
 * ```
 * @param a The first input tensor. Must be of dtype bool.
 * @param b The second input tensor. Must be of dtype bool.
 *
 * @doc {heading: 'Operations', subheading: 'Logical'}
 */
function logicalOr_(a, b) {
    const $a = convertToTensor(a, 'a', 'logicalOr', 'bool');
    const $b = convertToTensor(b, 'b', 'logicalOr', 'bool');
    assertAndGetBroadcastShape($a.shape, $b.shape);
    const inputs = { a: $a, b: $b };
    return ENGINE.runKernel(LogicalOr, inputs);
}
export const logicalOr = op({ logicalOr_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naWNhbF9vci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2xvZ2ljYWxfb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsU0FBUyxFQUFrQixNQUFNLGlCQUFpQixDQUFDO0FBRzNELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUVuRCxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUM1RCxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRS9COzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxTQUFTLFVBQVUsQ0FDZixDQUFvQixFQUFFLENBQW9CO0lBQzVDLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN4RCxNQUFNLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDeEQsMEJBQTBCLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFL0MsTUFBTSxNQUFNLEdBQW9CLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFDLENBQUM7SUFDL0MsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxNQUE4QixDQUFDLENBQUM7QUFDckUsQ0FBQztBQUNELE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsRUFBQyxVQUFVLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7TG9naWNhbE9yLCBMb2dpY2FsT3JJbnB1dHN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7TmFtZWRUZW5zb3JNYXB9IGZyb20gJy4uL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHthc3NlcnRBbmRHZXRCcm9hZGNhc3RTaGFwZX0gZnJvbSAnLi9icm9hZGNhc3RfdXRpbCc7XG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdHJ1dGggdmFsdWUgb2YgYGEgT1IgYmAgZWxlbWVudC13aXNlLiBTdXBwb3J0cyBicm9hZGNhc3RpbmcuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbZmFsc2UsIGZhbHNlLCB0cnVlLCB0cnVlXSwgJ2Jvb2wnKTtcbiAqIGNvbnN0IGIgPSB0Zi50ZW5zb3IxZChbZmFsc2UsIHRydWUsIGZhbHNlLCB0cnVlXSwgJ2Jvb2wnKTtcbiAqXG4gKiBhLmxvZ2ljYWxPcihiKS5wcmludCgpO1xuICogYGBgXG4gKiBAcGFyYW0gYSBUaGUgZmlyc3QgaW5wdXQgdGVuc29yLiBNdXN0IGJlIG9mIGR0eXBlIGJvb2wuXG4gKiBAcGFyYW0gYiBUaGUgc2Vjb25kIGlucHV0IHRlbnNvci4gTXVzdCBiZSBvZiBkdHlwZSBib29sLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdPcGVyYXRpb25zJywgc3ViaGVhZGluZzogJ0xvZ2ljYWwnfVxuICovXG5mdW5jdGlvbiBsb2dpY2FsT3JfPFQgZXh0ZW5kcyBUZW5zb3I+KFxuICAgIGE6IFRlbnNvcnxUZW5zb3JMaWtlLCBiOiBUZW5zb3J8VGVuc29yTGlrZSk6IFQge1xuICBjb25zdCAkYSA9IGNvbnZlcnRUb1RlbnNvcihhLCAnYScsICdsb2dpY2FsT3InLCAnYm9vbCcpO1xuICBjb25zdCAkYiA9IGNvbnZlcnRUb1RlbnNvcihiLCAnYicsICdsb2dpY2FsT3InLCAnYm9vbCcpO1xuICBhc3NlcnRBbmRHZXRCcm9hZGNhc3RTaGFwZSgkYS5zaGFwZSwgJGIuc2hhcGUpO1xuXG4gIGNvbnN0IGlucHV0czogTG9naWNhbE9ySW5wdXRzID0ge2E6ICRhLCBiOiAkYn07XG4gIHJldHVybiBFTkdJTkUucnVuS2VybmVsKExvZ2ljYWxPciwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwKTtcbn1cbmV4cG9ydCBjb25zdCBsb2dpY2FsT3IgPSBvcCh7bG9naWNhbE9yX30pO1xuIl19