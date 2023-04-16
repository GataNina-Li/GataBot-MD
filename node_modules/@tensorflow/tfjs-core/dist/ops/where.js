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
import { Select } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { broadcastTo } from './broadcast_to';
import { assertAndGetBroadcastShape } from './broadcast_util';
import { op } from './operation';
/**
 * Returns the elements, either `a` or `b` depending on the `condition`.
 *
 * If the condition is true, select from `a`, otherwise select from `b`.
 *
 * ```js
 * const cond = tf.tensor1d([false, false, true], 'bool');
 * const a = tf.tensor1d([1 , 2, 3]);
 * const b = tf.tensor1d([-1, -2, -3]);
 *
 * a.where(cond, b).print();
 * ```
 *
 * @param condition The input condition. Must be of dtype bool.
 * @param a If `condition` is rank 1, `a` may have a higher rank but
 *     its first dimension must match the size of `condition`.
 * @param b A tensor with the same dtype as `a` and with shape that is
 *     compatible with `a`.
 * @return A tensor with same dtype as `a` and `b`, and shape that is
 *     broadcastable from `a` and `b`.
 *
 * @doc {heading: 'Operations', subheading: 'Logical'}
 */
function where_(condition, a, b) {
    const $a = convertToTensor(a, 'a', 'where');
    const $b = convertToTensor(b, 'b', 'where');
    const $condition = convertToTensor(condition, 'condition', 'where', 'bool');
    // TODO: move this logic to forward function when the broadcastTo op is
    // implemented in WASM.
    // Find the broadcastable shape for $condition, $a, and $b.
    const broadcastShape = assertAndGetBroadcastShape(assertAndGetBroadcastShape($condition.shape, $a.shape), $b.shape);
    const $broadcastedCondition = broadcastTo($condition, broadcastShape);
    const $broadcastedA = broadcastTo($a, broadcastShape);
    const $broadcastedB = broadcastTo($b, broadcastShape);
    const inputs = {
        condition: $broadcastedCondition,
        t: $broadcastedA,
        e: $broadcastedB
    };
    return ENGINE.runKernel(Select, inputs);
}
export const where = op({ where_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2hlcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy93aGVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxNQUFNLEVBQWUsTUFBTSxpQkFBaUIsQ0FBQztBQUdyRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHbkQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQzVELE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFL0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FzQkc7QUFDSCxTQUFTLE1BQU0sQ0FDWCxTQUE0QixFQUFFLENBQWUsRUFBRSxDQUFlO0lBQ2hFLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzVDLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzVDLE1BQU0sVUFBVSxHQUFHLGVBQWUsQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM1RSx1RUFBdUU7SUFDdkUsdUJBQXVCO0lBQ3ZCLDJEQUEyRDtJQUMzRCxNQUFNLGNBQWMsR0FBRywwQkFBMEIsQ0FDN0MsMEJBQTBCLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RFLE1BQU0scUJBQXFCLEdBQUcsV0FBVyxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUN0RSxNQUFNLGFBQWEsR0FBRyxXQUFXLENBQUMsRUFBRSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ3RELE1BQU0sYUFBYSxHQUFHLFdBQVcsQ0FBQyxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFFdEQsTUFBTSxNQUFNLEdBQWlCO1FBQzNCLFNBQVMsRUFBRSxxQkFBcUI7UUFDaEMsQ0FBQyxFQUFFLGFBQWE7UUFDaEIsQ0FBQyxFQUFFLGFBQWE7S0FDakIsQ0FBQztJQUNGLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsTUFBOEIsQ0FBQyxDQUFDO0FBQ2xFLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge1NlbGVjdCwgU2VsZWN0SW5wdXRzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcblxuaW1wb3J0IHticm9hZGNhc3RUb30gZnJvbSAnLi9icm9hZGNhc3RfdG8nO1xuaW1wb3J0IHthc3NlcnRBbmRHZXRCcm9hZGNhc3RTaGFwZX0gZnJvbSAnLi9icm9hZGNhc3RfdXRpbCc7XG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZWxlbWVudHMsIGVpdGhlciBgYWAgb3IgYGJgIGRlcGVuZGluZyBvbiB0aGUgYGNvbmRpdGlvbmAuXG4gKlxuICogSWYgdGhlIGNvbmRpdGlvbiBpcyB0cnVlLCBzZWxlY3QgZnJvbSBgYWAsIG90aGVyd2lzZSBzZWxlY3QgZnJvbSBgYmAuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGNvbmQgPSB0Zi50ZW5zb3IxZChbZmFsc2UsIGZhbHNlLCB0cnVlXSwgJ2Jvb2wnKTtcbiAqIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMSAsIDIsIDNdKTtcbiAqIGNvbnN0IGIgPSB0Zi50ZW5zb3IxZChbLTEsIC0yLCAtM10pO1xuICpcbiAqIGEud2hlcmUoY29uZCwgYikucHJpbnQoKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBjb25kaXRpb24gVGhlIGlucHV0IGNvbmRpdGlvbi4gTXVzdCBiZSBvZiBkdHlwZSBib29sLlxuICogQHBhcmFtIGEgSWYgYGNvbmRpdGlvbmAgaXMgcmFuayAxLCBgYWAgbWF5IGhhdmUgYSBoaWdoZXIgcmFuayBidXRcbiAqICAgICBpdHMgZmlyc3QgZGltZW5zaW9uIG11c3QgbWF0Y2ggdGhlIHNpemUgb2YgYGNvbmRpdGlvbmAuXG4gKiBAcGFyYW0gYiBBIHRlbnNvciB3aXRoIHRoZSBzYW1lIGR0eXBlIGFzIGBhYCBhbmQgd2l0aCBzaGFwZSB0aGF0IGlzXG4gKiAgICAgY29tcGF0aWJsZSB3aXRoIGBhYC5cbiAqIEByZXR1cm4gQSB0ZW5zb3Igd2l0aCBzYW1lIGR0eXBlIGFzIGBhYCBhbmQgYGJgLCBhbmQgc2hhcGUgdGhhdCBpc1xuICogICAgIGJyb2FkY2FzdGFibGUgZnJvbSBgYWAgYW5kIGBiYC5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdMb2dpY2FsJ31cbiAqL1xuZnVuY3Rpb24gd2hlcmVfPFQgZXh0ZW5kcyBUZW5zb3I+KFxuICAgIGNvbmRpdGlvbjogVGVuc29yfFRlbnNvckxpa2UsIGE6IFR8VGVuc29yTGlrZSwgYjogVHxUZW5zb3JMaWtlKTogVCB7XG4gIGNvbnN0ICRhID0gY29udmVydFRvVGVuc29yKGEsICdhJywgJ3doZXJlJyk7XG4gIGNvbnN0ICRiID0gY29udmVydFRvVGVuc29yKGIsICdiJywgJ3doZXJlJyk7XG4gIGNvbnN0ICRjb25kaXRpb24gPSBjb252ZXJ0VG9UZW5zb3IoY29uZGl0aW9uLCAnY29uZGl0aW9uJywgJ3doZXJlJywgJ2Jvb2wnKTtcbiAgLy8gVE9ETzogbW92ZSB0aGlzIGxvZ2ljIHRvIGZvcndhcmQgZnVuY3Rpb24gd2hlbiB0aGUgYnJvYWRjYXN0VG8gb3AgaXNcbiAgLy8gaW1wbGVtZW50ZWQgaW4gV0FTTS5cbiAgLy8gRmluZCB0aGUgYnJvYWRjYXN0YWJsZSBzaGFwZSBmb3IgJGNvbmRpdGlvbiwgJGEsIGFuZCAkYi5cbiAgY29uc3QgYnJvYWRjYXN0U2hhcGUgPSBhc3NlcnRBbmRHZXRCcm9hZGNhc3RTaGFwZShcbiAgICAgIGFzc2VydEFuZEdldEJyb2FkY2FzdFNoYXBlKCRjb25kaXRpb24uc2hhcGUsICRhLnNoYXBlKSwgJGIuc2hhcGUpO1xuICBjb25zdCAkYnJvYWRjYXN0ZWRDb25kaXRpb24gPSBicm9hZGNhc3RUbygkY29uZGl0aW9uLCBicm9hZGNhc3RTaGFwZSk7XG4gIGNvbnN0ICRicm9hZGNhc3RlZEEgPSBicm9hZGNhc3RUbygkYSwgYnJvYWRjYXN0U2hhcGUpO1xuICBjb25zdCAkYnJvYWRjYXN0ZWRCID0gYnJvYWRjYXN0VG8oJGIsIGJyb2FkY2FzdFNoYXBlKTtcblxuICBjb25zdCBpbnB1dHM6IFNlbGVjdElucHV0cyA9IHtcbiAgICBjb25kaXRpb246ICRicm9hZGNhc3RlZENvbmRpdGlvbixcbiAgICB0OiAkYnJvYWRjYXN0ZWRBLFxuICAgIGU6ICRicm9hZGNhc3RlZEJcbiAgfTtcbiAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoU2VsZWN0LCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXApO1xufVxuXG5leHBvcnQgY29uc3Qgd2hlcmUgPSBvcCh7d2hlcmVffSk7XG4iXX0=