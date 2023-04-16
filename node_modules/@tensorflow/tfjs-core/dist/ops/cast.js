/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
import { Cast } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { op } from './operation';
/**
 * Casts a `tf.Tensor` to a new dtype.
 *
 * ```js
 * const x = tf.tensor1d([1.5, 2.5, 3]);
 * tf.cast(x, 'int32').print();
 * ```
 * @param x The input tensor to be casted.
 * @param dtype The dtype to cast the input tensor to.
 *
 * @doc {heading: 'Tensors', subheading: 'Transformations'}
 */
function cast_(x, dtype) {
    const $x = convertToTensor(x, 'x', 'cast');
    // Sanity checks.
    if (!util.isValidDtype(dtype)) {
        throw new Error(`Failed to cast to unknown dtype ${dtype}`);
    }
    if (dtype === 'string' && $x.dtype !== 'string' ||
        dtype !== 'string' && $x.dtype === 'string') {
        throw new Error('Only strings can be casted to strings');
    }
    const inputs = { x: $x };
    const attrs = { dtype };
    return ENGINE.runKernel(Cast, inputs, attrs);
}
export const cast = op({ cast_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2Nhc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsSUFBSSxFQUF3QixNQUFNLGlCQUFpQixDQUFDO0FBSTVELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUVuRCxPQUFPLEtBQUssSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUVoQyxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRS9COzs7Ozs7Ozs7OztHQVdHO0FBQ0gsU0FBUyxLQUFLLENBQW1CLENBQWUsRUFBRSxLQUFlO0lBQy9ELE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRTNDLGlCQUFpQjtJQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLG1DQUFtQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQzdEO0lBQ0QsSUFBSSxLQUFLLEtBQUssUUFBUSxJQUFJLEVBQUUsQ0FBQyxLQUFLLEtBQUssUUFBUTtRQUMzQyxLQUFLLEtBQUssUUFBUSxJQUFJLEVBQUUsQ0FBQyxLQUFLLEtBQUssUUFBUSxFQUFFO1FBQy9DLE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztLQUMxRDtJQUVELE1BQU0sTUFBTSxHQUFlLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBQyxDQUFDO0lBQ25DLE1BQU0sS0FBSyxHQUFjLEVBQUMsS0FBSyxFQUFDLENBQUM7SUFFakMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUNuQixJQUFJLEVBQUUsTUFBOEIsRUFBRSxLQUEyQixDQUFDLENBQUM7QUFDekUsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsRUFBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge0Nhc3QsIENhc3RBdHRycywgQ2FzdElucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7TmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge0RhdGFUeXBlLCBUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5cbi8qKlxuICogQ2FzdHMgYSBgdGYuVGVuc29yYCB0byBhIG5ldyBkdHlwZS5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgeCA9IHRmLnRlbnNvcjFkKFsxLjUsIDIuNSwgM10pO1xuICogdGYuY2FzdCh4LCAnaW50MzInKS5wcmludCgpO1xuICogYGBgXG4gKiBAcGFyYW0geCBUaGUgaW5wdXQgdGVuc29yIHRvIGJlIGNhc3RlZC5cbiAqIEBwYXJhbSBkdHlwZSBUaGUgZHR5cGUgdG8gY2FzdCB0aGUgaW5wdXQgdGVuc29yIHRvLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdUZW5zb3JzJywgc3ViaGVhZGluZzogJ1RyYW5zZm9ybWF0aW9ucyd9XG4gKi9cbmZ1bmN0aW9uIGNhc3RfPFQgZXh0ZW5kcyBUZW5zb3I+KHg6IFR8VGVuc29yTGlrZSwgZHR5cGU6IERhdGFUeXBlKTogVCB7XG4gIGNvbnN0ICR4ID0gY29udmVydFRvVGVuc29yKHgsICd4JywgJ2Nhc3QnKTtcblxuICAvLyBTYW5pdHkgY2hlY2tzLlxuICBpZiAoIXV0aWwuaXNWYWxpZER0eXBlKGR0eXBlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGNhc3QgdG8gdW5rbm93biBkdHlwZSAke2R0eXBlfWApO1xuICB9XG4gIGlmIChkdHlwZSA9PT0gJ3N0cmluZycgJiYgJHguZHR5cGUgIT09ICdzdHJpbmcnIHx8XG4gICAgICBkdHlwZSAhPT0gJ3N0cmluZycgJiYgJHguZHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IHN0cmluZ3MgY2FuIGJlIGNhc3RlZCB0byBzdHJpbmdzJyk7XG4gIH1cblxuICBjb25zdCBpbnB1dHM6IENhc3RJbnB1dHMgPSB7eDogJHh9O1xuICBjb25zdCBhdHRyczogQ2FzdEF0dHJzID0ge2R0eXBlfTtcblxuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChcbiAgICAgIENhc3QsIGlucHV0cyBhcyB7fSBhcyBOYW1lZFRlbnNvck1hcCwgYXR0cnMgYXMge30gYXMgTmFtZWRBdHRyTWFwKTtcbn1cblxuZXhwb3J0IGNvbnN0IGNhc3QgPSBvcCh7Y2FzdF99KTtcbiJdfQ==