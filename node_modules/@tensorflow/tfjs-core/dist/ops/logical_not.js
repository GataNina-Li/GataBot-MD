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
import { LogicalNot } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Returns the truth value of `NOT x` element-wise.
 *
 * ```js
 * const a = tf.tensor1d([false, true], 'bool');
 *
 * a.logicalNot().print();
 * ```
 *
 * @param x The input tensor. Must be of dtype 'bool'.
 *
 * @doc {heading: 'Operations', subheading: 'Logical'}
 */
function logicalNot_(x) {
    const $x = convertToTensor(x, 'x', 'logicalNot', 'bool');
    const inputs = { x: $x };
    return ENGINE.runKernel(LogicalNot, inputs);
}
export const logicalNot = op({ logicalNot_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naWNhbF9ub3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9sb2dpY2FsX25vdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxVQUFVLEVBQW1CLE1BQU0saUJBQWlCLENBQUM7QUFHN0QsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFL0I7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsU0FBUyxXQUFXLENBQW1CLENBQWU7SUFDcEQsTUFBTSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3pELE1BQU0sTUFBTSxHQUFxQixFQUFDLENBQUMsRUFBRSxFQUFFLEVBQUMsQ0FBQztJQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLE1BQThCLENBQUMsQ0FBQztBQUN0RSxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxFQUFDLFdBQVcsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtMb2dpY2FsTm90LCBMb2dpY2FsTm90SW5wdXRzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB0cnV0aCB2YWx1ZSBvZiBgTk9UIHhgIGVsZW1lbnQtd2lzZS5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgYSA9IHRmLnRlbnNvcjFkKFtmYWxzZSwgdHJ1ZV0sICdib29sJyk7XG4gKlxuICogYS5sb2dpY2FsTm90KCkucHJpbnQoKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB4IFRoZSBpbnB1dCB0ZW5zb3IuIE11c3QgYmUgb2YgZHR5cGUgJ2Jvb2wnLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdPcGVyYXRpb25zJywgc3ViaGVhZGluZzogJ0xvZ2ljYWwnfVxuICovXG5mdW5jdGlvbiBsb2dpY2FsTm90XzxUIGV4dGVuZHMgVGVuc29yPih4OiBUfFRlbnNvckxpa2UpOiBUIHtcbiAgY29uc3QgJHggPSBjb252ZXJ0VG9UZW5zb3IoeCwgJ3gnLCAnbG9naWNhbE5vdCcsICdib29sJyk7XG4gIGNvbnN0IGlucHV0czogTG9naWNhbE5vdElucHV0cyA9IHt4OiAkeH07XG4gIHJldHVybiBFTkdJTkUucnVuS2VybmVsKExvZ2ljYWxOb3QsIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCk7XG59XG5cbmV4cG9ydCBjb25zdCBsb2dpY2FsTm90ID0gb3Aoe2xvZ2ljYWxOb3RffSk7XG4iXX0=