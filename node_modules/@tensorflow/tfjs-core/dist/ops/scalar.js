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
import { isTypedArray } from '../util';
import { makeTensor } from './tensor_ops_util';
/**
 * Creates rank-0 `tf.Tensor` (scalar) with the provided value and dtype.
 *
 * The same functionality can be achieved with `tf.tensor`, but in general
 * we recommend using `tf.scalar` as it makes the code more readable.
 *
 * ```js
 * tf.scalar(3.14).print();
 * ```
 *
 * @param value The value of the scalar.
 * @param dtype The data type.
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
export function scalar(value, dtype) {
    if (((isTypedArray(value) && dtype !== 'string') || Array.isArray(value)) &&
        dtype !== 'complex64') {
        throw new Error('Error creating a new Scalar: value must be a primitive ' +
            '(number|boolean|string)');
    }
    if (dtype === 'string' && isTypedArray(value) &&
        !(value instanceof Uint8Array)) {
        throw new Error('When making a scalar from encoded string, ' +
            'the value must be `Uint8Array`.');
    }
    const shape = [];
    const inferredShape = [];
    return makeTensor(value, shape, inferredShape, dtype);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvc2NhbGFyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUlILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDckMsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRTdDOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0gsTUFBTSxVQUFVLE1BQU0sQ0FDbEIsS0FBdUMsRUFBRSxLQUFnQjtJQUMzRCxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckUsS0FBSyxLQUFLLFdBQVcsRUFBRTtRQUN6QixNQUFNLElBQUksS0FBSyxDQUNYLHlEQUF5RDtZQUN6RCx5QkFBeUIsQ0FBQyxDQUFDO0tBQ2hDO0lBQ0QsSUFBSSxLQUFLLEtBQUssUUFBUSxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUM7UUFDekMsQ0FBQyxDQUFDLEtBQUssWUFBWSxVQUFVLENBQUMsRUFBRTtRQUNsQyxNQUFNLElBQUksS0FBSyxDQUNYLDRDQUE0QztZQUM1QyxpQ0FBaUMsQ0FBQyxDQUFDO0tBQ3hDO0lBQ0QsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO0lBQzNCLE1BQU0sYUFBYSxHQUFhLEVBQUUsQ0FBQztJQUNuQyxPQUFPLFVBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQVcsQ0FBQztBQUNsRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge1NjYWxhcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7RGF0YVR5cGV9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7aXNUeXBlZEFycmF5fSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7bWFrZVRlbnNvcn0gZnJvbSAnLi90ZW5zb3Jfb3BzX3V0aWwnO1xuXG4vKipcbiAqIENyZWF0ZXMgcmFuay0wIGB0Zi5UZW5zb3JgIChzY2FsYXIpIHdpdGggdGhlIHByb3ZpZGVkIHZhbHVlIGFuZCBkdHlwZS5cbiAqXG4gKiBUaGUgc2FtZSBmdW5jdGlvbmFsaXR5IGNhbiBiZSBhY2hpZXZlZCB3aXRoIGB0Zi50ZW5zb3JgLCBidXQgaW4gZ2VuZXJhbFxuICogd2UgcmVjb21tZW5kIHVzaW5nIGB0Zi5zY2FsYXJgIGFzIGl0IG1ha2VzIHRoZSBjb2RlIG1vcmUgcmVhZGFibGUuXG4gKlxuICogYGBganNcbiAqIHRmLnNjYWxhcigzLjE0KS5wcmludCgpO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSBvZiB0aGUgc2NhbGFyLlxuICogQHBhcmFtIGR0eXBlIFRoZSBkYXRhIHR5cGUuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ1RlbnNvcnMnLCBzdWJoZWFkaW5nOiAnQ3JlYXRpb24nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2NhbGFyKFxuICAgIHZhbHVlOiBudW1iZXJ8Ym9vbGVhbnxzdHJpbmd8VWludDhBcnJheSwgZHR5cGU/OiBEYXRhVHlwZSk6IFNjYWxhciB7XG4gIGlmICgoKGlzVHlwZWRBcnJheSh2YWx1ZSkgJiYgZHR5cGUgIT09ICdzdHJpbmcnKSB8fCBBcnJheS5pc0FycmF5KHZhbHVlKSkgJiZcbiAgICAgIGR0eXBlICE9PSAnY29tcGxleDY0Jykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0Vycm9yIGNyZWF0aW5nIGEgbmV3IFNjYWxhcjogdmFsdWUgbXVzdCBiZSBhIHByaW1pdGl2ZSAnICtcbiAgICAgICAgJyhudW1iZXJ8Ym9vbGVhbnxzdHJpbmcpJyk7XG4gIH1cbiAgaWYgKGR0eXBlID09PSAnc3RyaW5nJyAmJiBpc1R5cGVkQXJyYXkodmFsdWUpICYmXG4gICAgICAhKHZhbHVlIGluc3RhbmNlb2YgVWludDhBcnJheSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdXaGVuIG1ha2luZyBhIHNjYWxhciBmcm9tIGVuY29kZWQgc3RyaW5nLCAnICtcbiAgICAgICAgJ3RoZSB2YWx1ZSBtdXN0IGJlIGBVaW50OEFycmF5YC4nKTtcbiAgfVxuICBjb25zdCBzaGFwZTogbnVtYmVyW10gPSBbXTtcbiAgY29uc3QgaW5mZXJyZWRTaGFwZTogbnVtYmVyW10gPSBbXTtcbiAgcmV0dXJuIG1ha2VUZW5zb3IodmFsdWUsIHNoYXBlLCBpbmZlcnJlZFNoYXBlLCBkdHlwZSkgYXMgU2NhbGFyO1xufVxuIl19