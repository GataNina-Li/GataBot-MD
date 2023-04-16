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
import { buffer } from './buffer';
import { op } from './operation';
import { UniformRandom } from './rand_util';
/**
 * Creates a `tf.Tensor` with values sampled from a uniform distribution.
 *
 * The generated values follow a uniform distribution in the range [minval,
 * maxval). The lower bound minval is included in the range, while the upper
 * bound maxval is excluded.
 *
 * ```js
 * tf.randomUniform([2, 2]).print();
 * ```
 *
 * @param shape An array of integers defining the output tensor shape.
 * @param minval The lower bound on the range of random values to generate.
 *   Defaults to 0.
 * @param maxval The upper bound on the range of random values to generate.
 *   Defaults to 1.
 * @param dtype The data type of the output tensor. Defaults to 'float32'.
 *
 * @doc {heading: 'Tensors', subheading: 'Random'}
 */
function randomUniform_(shape, minval = 0, maxval = 1, dtype = 'float32', seed) {
    const res = buffer(shape, dtype);
    const random = new UniformRandom(minval, maxval, null, seed);
    for (let i = 0; i < res.values.length; i++) {
        res.values[i] = random.nextValue();
    }
    return res.toTensor();
}
export const randomUniform = op({ randomUniform_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZG9tX3VuaWZvcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9yYW5kb21fdW5pZm9ybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFLSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ2hDLE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDL0IsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUxQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1CRztBQUNILFNBQVMsY0FBYyxDQUNuQixLQUFrQixFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxRQUFrQixTQUFTLEVBQ3ZFLElBQW9CO0lBQ3RCLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDakMsTUFBTSxNQUFNLEdBQUcsSUFBSSxhQUFhLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDN0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0tBQ3BDO0lBQ0QsT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDeEIsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUMsRUFBQyxjQUFjLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7RGF0YVR5cGUsIFJhbmssIFNoYXBlTWFwfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7YnVmZmVyfSBmcm9tICcuL2J1ZmZlcic7XG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5pbXBvcnQge1VuaWZvcm1SYW5kb219IGZyb20gJy4vcmFuZF91dGlsJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgYHRmLlRlbnNvcmAgd2l0aCB2YWx1ZXMgc2FtcGxlZCBmcm9tIGEgdW5pZm9ybSBkaXN0cmlidXRpb24uXG4gKlxuICogVGhlIGdlbmVyYXRlZCB2YWx1ZXMgZm9sbG93IGEgdW5pZm9ybSBkaXN0cmlidXRpb24gaW4gdGhlIHJhbmdlIFttaW52YWwsXG4gKiBtYXh2YWwpLiBUaGUgbG93ZXIgYm91bmQgbWludmFsIGlzIGluY2x1ZGVkIGluIHRoZSByYW5nZSwgd2hpbGUgdGhlIHVwcGVyXG4gKiBib3VuZCBtYXh2YWwgaXMgZXhjbHVkZWQuXG4gKlxuICogYGBganNcbiAqIHRmLnJhbmRvbVVuaWZvcm0oWzIsIDJdKS5wcmludCgpO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHNoYXBlIEFuIGFycmF5IG9mIGludGVnZXJzIGRlZmluaW5nIHRoZSBvdXRwdXQgdGVuc29yIHNoYXBlLlxuICogQHBhcmFtIG1pbnZhbCBUaGUgbG93ZXIgYm91bmQgb24gdGhlIHJhbmdlIG9mIHJhbmRvbSB2YWx1ZXMgdG8gZ2VuZXJhdGUuXG4gKiAgIERlZmF1bHRzIHRvIDAuXG4gKiBAcGFyYW0gbWF4dmFsIFRoZSB1cHBlciBib3VuZCBvbiB0aGUgcmFuZ2Ugb2YgcmFuZG9tIHZhbHVlcyB0byBnZW5lcmF0ZS5cbiAqICAgRGVmYXVsdHMgdG8gMS5cbiAqIEBwYXJhbSBkdHlwZSBUaGUgZGF0YSB0eXBlIG9mIHRoZSBvdXRwdXQgdGVuc29yLiBEZWZhdWx0cyB0byAnZmxvYXQzMicuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ1RlbnNvcnMnLCBzdWJoZWFkaW5nOiAnUmFuZG9tJ31cbiAqL1xuZnVuY3Rpb24gcmFuZG9tVW5pZm9ybV88UiBleHRlbmRzIFJhbms+KFxuICAgIHNoYXBlOiBTaGFwZU1hcFtSXSwgbWludmFsID0gMCwgbWF4dmFsID0gMSwgZHR5cGU6IERhdGFUeXBlID0gJ2Zsb2F0MzInLFxuICAgIHNlZWQ/OiBudW1iZXJ8c3RyaW5nKTogVGVuc29yPFI+IHtcbiAgY29uc3QgcmVzID0gYnVmZmVyKHNoYXBlLCBkdHlwZSk7XG4gIGNvbnN0IHJhbmRvbSA9IG5ldyBVbmlmb3JtUmFuZG9tKG1pbnZhbCwgbWF4dmFsLCBudWxsLCBzZWVkKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXMudmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgcmVzLnZhbHVlc1tpXSA9IHJhbmRvbS5uZXh0VmFsdWUoKTtcbiAgfVxuICByZXR1cm4gcmVzLnRvVGVuc29yKCk7XG59XG5cbmV4cG9ydCBjb25zdCByYW5kb21Vbmlmb3JtID0gb3Aoe3JhbmRvbVVuaWZvcm1ffSk7XG4iXX0=