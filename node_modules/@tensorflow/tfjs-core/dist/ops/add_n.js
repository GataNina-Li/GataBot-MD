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
import { AddN } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { op } from './operation';
/**
 * Adds a list of `tf.Tensor`s element-wise, each with the same shape and dtype.
 *
 * ```js
 * const a = tf.tensor1d([1, 2]);
 * const b = tf.tensor1d([3, 4]);
 * const c = tf.tensor1d([5, 6]);
 *
 * tf.addN([a, b, c]).print();
 * ```
 * @param tensors A list of tensors with the same shape and dtype.
 * @doc {heading: 'Operations', subheading: 'Arithmetic'}
 */
function addN_(tensors) {
    util.assert(Array.isArray(tensors), () => 'The argument passed to tf.addN() must be a list of tensors');
    util.assert(tensors.length >= 1, () => `Must pass at least one tensor to tf.addN(), but got ` +
        `${tensors.length}`);
    const $tensors = tensors.map((t, i) => convertToTensor(t, `tensors${i}`, 'addN'));
    const firstTensor = $tensors[0];
    $tensors.forEach(t => {
        if (t.dtype !== firstTensor.dtype) {
            throw new Error('All tensors passed to tf.addN() must have the same dtype');
        }
    });
    $tensors.forEach(t => {
        if (!util.arraysEqual(t.shape, firstTensor.shape)) {
            throw new Error('All tensors passed to tf.addN() must have the same shape');
        }
    });
    const inputs = $tensors;
    return ENGINE.runKernel(AddN, inputs);
}
export const addN = op({ addN_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkX24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9hZGRfbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxJQUFJLEVBQWEsTUFBTSxpQkFBaUIsQ0FBQztBQUdqRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFbkQsT0FBTyxLQUFLLElBQUksTUFBTSxTQUFTLENBQUM7QUFFaEMsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvQjs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxTQUFTLEtBQUssQ0FBbUIsT0FBNEI7SUFDM0QsSUFBSSxDQUFDLE1BQU0sQ0FDUCxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUN0QixHQUFHLEVBQUUsQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO0lBQ3hFLElBQUksQ0FBQyxNQUFNLENBQ1AsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQ25CLEdBQUcsRUFBRSxDQUFDLHNEQUFzRDtRQUN4RCxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBRTdCLE1BQU0sUUFBUSxHQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUVyRSxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNuQixJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssV0FBVyxDQUFDLEtBQUssRUFBRTtZQUNqQyxNQUFNLElBQUksS0FBSyxDQUNYLDBEQUEwRCxDQUFDLENBQUM7U0FDakU7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDakQsTUFBTSxJQUFJLEtBQUssQ0FDWCwwREFBMEQsQ0FBQyxDQUFDO1NBQ2pFO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLE1BQU0sR0FBZSxRQUFRLENBQUM7SUFFcEMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUE4QixDQUFDLENBQUM7QUFDaEUsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsRUFBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge0FkZE4sIEFkZE5JbnB1dHN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7TmFtZWRUZW5zb3JNYXB9IGZyb20gJy4uL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi91dGlsJztcblxuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuXG4vKipcbiAqIEFkZHMgYSBsaXN0IG9mIGB0Zi5UZW5zb3JgcyBlbGVtZW50LXdpc2UsIGVhY2ggd2l0aCB0aGUgc2FtZSBzaGFwZSBhbmQgZHR5cGUuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMSwgMl0pO1xuICogY29uc3QgYiA9IHRmLnRlbnNvcjFkKFszLCA0XSk7XG4gKiBjb25zdCBjID0gdGYudGVuc29yMWQoWzUsIDZdKTtcbiAqXG4gKiB0Zi5hZGROKFthLCBiLCBjXSkucHJpbnQoKTtcbiAqIGBgYFxuICogQHBhcmFtIHRlbnNvcnMgQSBsaXN0IG9mIHRlbnNvcnMgd2l0aCB0aGUgc2FtZSBzaGFwZSBhbmQgZHR5cGUuXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdBcml0aG1ldGljJ31cbiAqL1xuZnVuY3Rpb24gYWRkTl88VCBleHRlbmRzIFRlbnNvcj4odGVuc29yczogQXJyYXk8VHxUZW5zb3JMaWtlPik6IFQge1xuICB1dGlsLmFzc2VydChcbiAgICAgIEFycmF5LmlzQXJyYXkodGVuc29ycyksXG4gICAgICAoKSA9PiAnVGhlIGFyZ3VtZW50IHBhc3NlZCB0byB0Zi5hZGROKCkgbXVzdCBiZSBhIGxpc3Qgb2YgdGVuc29ycycpO1xuICB1dGlsLmFzc2VydChcbiAgICAgIHRlbnNvcnMubGVuZ3RoID49IDEsXG4gICAgICAoKSA9PiBgTXVzdCBwYXNzIGF0IGxlYXN0IG9uZSB0ZW5zb3IgdG8gdGYuYWRkTigpLCBidXQgZ290IGAgK1xuICAgICAgICAgIGAke3RlbnNvcnMubGVuZ3RofWApO1xuXG4gIGNvbnN0ICR0ZW5zb3JzID1cbiAgICAgIHRlbnNvcnMubWFwKCh0LCBpKSA9PiBjb252ZXJ0VG9UZW5zb3IodCwgYHRlbnNvcnMke2l9YCwgJ2FkZE4nKSk7XG5cbiAgY29uc3QgZmlyc3RUZW5zb3IgPSAkdGVuc29yc1swXTtcbiAgJHRlbnNvcnMuZm9yRWFjaCh0ID0+IHtcbiAgICBpZiAodC5kdHlwZSAhPT0gZmlyc3RUZW5zb3IuZHR5cGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnQWxsIHRlbnNvcnMgcGFzc2VkIHRvIHRmLmFkZE4oKSBtdXN0IGhhdmUgdGhlIHNhbWUgZHR5cGUnKTtcbiAgICB9XG4gIH0pO1xuXG4gICR0ZW5zb3JzLmZvckVhY2godCA9PiB7XG4gICAgaWYgKCF1dGlsLmFycmF5c0VxdWFsKHQuc2hhcGUsIGZpcnN0VGVuc29yLnNoYXBlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdBbGwgdGVuc29ycyBwYXNzZWQgdG8gdGYuYWRkTigpIG11c3QgaGF2ZSB0aGUgc2FtZSBzaGFwZScpO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgaW5wdXRzOiBBZGROSW5wdXRzID0gJHRlbnNvcnM7XG5cbiAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoQWRkTiwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwKTtcbn1cblxuZXhwb3J0IGNvbnN0IGFkZE4gPSBvcCh7YWRkTl99KTtcbiJdfQ==