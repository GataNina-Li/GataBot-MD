/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
import { Softmax } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Computes the softmax normalized vector given the logits.
 *
 * ```js
 * const a = tf.tensor1d([1, 2, 3]);
 *
 * a.softmax().print();  // or tf.softmax(a)
 * ```
 *
 * ```js
 * const a = tf.tensor2d([2, 4, 6, 1, 2, 3], [2, 3]);
 *
 * a.softmax().print();  // or tf.softmax(a)
 * ```
 *
 * @param logits The logits array.
 * @param dim The dimension softmax would be performed on. Defaults to `-1`
 *     which indicates the last dimension.
 *
 * @doc {heading: 'Operations', subheading: 'Normalization'}
 */
function softmax_(logits, dim = -1) {
    const $logits = convertToTensor(logits, 'logits', 'softmax', 'float32');
    if (dim === -1) {
        dim = $logits.rank - 1;
    }
    if (dim !== $logits.rank - 1) {
        throw Error('Softmax along a non-last dimension is not yet supported. ' +
            `Logits was rank ${$logits.rank} and dim was ${dim}`);
    }
    const inputs = { logits: $logits };
    const attrs = { dim };
    return ENGINE.runKernel(Softmax, inputs, attrs);
}
export const softmax = op({ softmax_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29mdG1heC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3NvZnRtYXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsT0FBTyxFQUE4QixNQUFNLGlCQUFpQixDQUFDO0FBSXJFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUduRCxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRS9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9CRztBQUNILFNBQVMsUUFBUSxDQUFtQixNQUFvQixFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDaEUsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRXhFLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFO1FBQ2QsR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0tBQ3hCO0lBQ0QsSUFBSSxHQUFHLEtBQUssT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7UUFDNUIsTUFBTSxLQUFLLENBQ1AsMkRBQTJEO1lBQzNELG1CQUFtQixPQUFPLENBQUMsSUFBSSxnQkFBZ0IsR0FBRyxFQUFFLENBQUMsQ0FBQztLQUMzRDtJQUVELE1BQU0sTUFBTSxHQUFrQixFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsQ0FBQztJQUNoRCxNQUFNLEtBQUssR0FBaUIsRUFBQyxHQUFHLEVBQUMsQ0FBQztJQUVsQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQ25CLE9BQU8sRUFBRSxNQUE4QixFQUFFLEtBQTJCLENBQUMsQ0FBQztBQUM1RSxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxFQUFDLFFBQVEsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtTb2Z0bWF4LCBTb2Z0bWF4QXR0cnMsIFNvZnRtYXhJbnB1dHN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge05hbWVkQXR0ck1hcH0gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgc29mdG1heCBub3JtYWxpemVkIHZlY3RvciBnaXZlbiB0aGUgbG9naXRzLlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBhID0gdGYudGVuc29yMWQoWzEsIDIsIDNdKTtcbiAqXG4gKiBhLnNvZnRtYXgoKS5wcmludCgpOyAgLy8gb3IgdGYuc29mdG1heChhKVxuICogYGBgXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChbMiwgNCwgNiwgMSwgMiwgM10sIFsyLCAzXSk7XG4gKlxuICogYS5zb2Z0bWF4KCkucHJpbnQoKTsgIC8vIG9yIHRmLnNvZnRtYXgoYSlcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBsb2dpdHMgVGhlIGxvZ2l0cyBhcnJheS5cbiAqIEBwYXJhbSBkaW0gVGhlIGRpbWVuc2lvbiBzb2Z0bWF4IHdvdWxkIGJlIHBlcmZvcm1lZCBvbi4gRGVmYXVsdHMgdG8gYC0xYFxuICogICAgIHdoaWNoIGluZGljYXRlcyB0aGUgbGFzdCBkaW1lbnNpb24uXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ09wZXJhdGlvbnMnLCBzdWJoZWFkaW5nOiAnTm9ybWFsaXphdGlvbid9XG4gKi9cbmZ1bmN0aW9uIHNvZnRtYXhfPFQgZXh0ZW5kcyBUZW5zb3I+KGxvZ2l0czogVHxUZW5zb3JMaWtlLCBkaW0gPSAtMSk6IFQge1xuICBjb25zdCAkbG9naXRzID0gY29udmVydFRvVGVuc29yKGxvZ2l0cywgJ2xvZ2l0cycsICdzb2Z0bWF4JywgJ2Zsb2F0MzInKTtcblxuICBpZiAoZGltID09PSAtMSkge1xuICAgIGRpbSA9ICRsb2dpdHMucmFuayAtIDE7XG4gIH1cbiAgaWYgKGRpbSAhPT0gJGxvZ2l0cy5yYW5rIC0gMSkge1xuICAgIHRocm93IEVycm9yKFxuICAgICAgICAnU29mdG1heCBhbG9uZyBhIG5vbi1sYXN0IGRpbWVuc2lvbiBpcyBub3QgeWV0IHN1cHBvcnRlZC4gJyArXG4gICAgICAgIGBMb2dpdHMgd2FzIHJhbmsgJHskbG9naXRzLnJhbmt9IGFuZCBkaW0gd2FzICR7ZGltfWApO1xuICB9XG5cbiAgY29uc3QgaW5wdXRzOiBTb2Z0bWF4SW5wdXRzID0ge2xvZ2l0czogJGxvZ2l0c307XG4gIGNvbnN0IGF0dHJzOiBTb2Z0bWF4QXR0cnMgPSB7ZGltfTtcblxuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChcbiAgICAgIFNvZnRtYXgsIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCwgYXR0cnMgYXMge30gYXMgTmFtZWRBdHRyTWFwKTtcbn1cblxuZXhwb3J0IGNvbnN0IHNvZnRtYXggPSBvcCh7c29mdG1heF99KTtcbiJdfQ==