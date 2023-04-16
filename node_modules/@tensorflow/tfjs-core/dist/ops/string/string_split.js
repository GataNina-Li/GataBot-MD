/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
import { ENGINE } from '../../engine';
import { StringSplit } from '../../kernel_names';
import { convertToTensor } from '../../tensor_util_env';
import { op } from '../operation';
/**
 * Split elements of `input` based on `delimiter` into a SparseTensor .
 *
 * Let N be the size of source (typically N will be the batch size). Split each
 * element of `input` based on `delimiter` and return a SparseTensor containing
 * the splitted tokens. Empty tokens are ignored if `skipEmpty` is set to True.
 *
 * `delimiter` can be empty, or a string of split characters. If `delimiter` is
 * an empty string, each element of `input` is split into individual
 * character strings. Otherwise every character of `delimiter` is a potential
 * split point.
 *
 * ```js
 * const result = tf.string.stringSplit(['hello world',  'a b c'], ' ');
 * result['indices'].print(); // [[0, 0], [0, 1], [1, 0], [1, 1], [1, 2]]
 * result['values'].print(); // ['hello', 'world', 'a', 'b', 'c']
 * result['shape'].print(); // [2, 3]
 * ```
 * @param input: 1-D. Strings to split.
 * @param delimiter: 0-D. Delimiter characters, or empty string.
 * @param skipEmpty: Optional. If true, skip the empty strings from the result.
 *     Defaults to true.
 * @return A map with the following properties:
 *     - indices: A dense matrix of int32 representing the indices of the sparse
 *       tensor.
 *     - values: A vector of strings corresponding to the splited values.
 *     - shape: a length-2 vector of int32 representing the shape of the sparse
 * tensor, where the first value is N and the second value is the maximum number
 * of tokens in a single input entry.
 *
 * @doc {heading: 'Operations', subheading: 'String'}
 */
function stringSplit_(input, delimiter, skipEmpty = true) {
    const $input = convertToTensor(input, 'input', 'stringSplit', 'string');
    const $delimiter = convertToTensor(delimiter, 'delimiter', 'stringSplit', 'string');
    if ($input.rank !== 1) {
        throw new Error(`Input should be Tensor1D but received shape ${$input.shape}`);
    }
    if ($delimiter.rank !== 0) {
        throw new Error(`Delimiter should be a scalar but received shape ${$delimiter.shape}`);
    }
    const attrs = { skipEmpty };
    const inputs = { input: $input, delimiter: $delimiter };
    const result = ENGINE.runKernel(StringSplit, inputs, attrs);
    return { indices: result[0], values: result[1], shape: result[2] };
}
export const stringSplit = op({ stringSplit_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nX3NwbGl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvc3RyaW5nL3N0cmluZ19zcGxpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3BDLE9BQU8sRUFBQyxXQUFXLEVBQXNDLE1BQU0sb0JBQW9CLENBQUM7QUFHcEYsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRXRELE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFaEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErQkc7QUFDSCxTQUFTLFlBQVksQ0FDakIsS0FBMEIsRUFBRSxTQUE0QixFQUN4RCxTQUFTLEdBQUcsSUFBSTtJQUNsQixNQUFNLE1BQU0sR0FBRyxlQUFlLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDeEUsTUFBTSxVQUFVLEdBQ1osZUFBZSxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRXJFLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7UUFDckIsTUFBTSxJQUFJLEtBQUssQ0FDWCwrQ0FBK0MsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7S0FDcEU7SUFDRCxJQUFJLFVBQVUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO1FBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQ1gsbURBQW1ELFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQzVFO0lBRUQsTUFBTSxLQUFLLEdBQXFCLEVBQUMsU0FBUyxFQUFDLENBQUM7SUFDNUMsTUFBTSxNQUFNLEdBQXNCLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFDLENBQUM7SUFDekUsTUFBTSxNQUFNLEdBQ1IsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsTUFBWSxFQUFFLEtBQVcsQ0FBQyxDQUFDO0lBQzdELE9BQU8sRUFBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDO0FBQ25FLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLEVBQUMsWUFBWSxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIxIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uLy4uL2VuZ2luZSc7XG5pbXBvcnQge1N0cmluZ1NwbGl0LCBTdHJpbmdTcGxpdEF0dHJzLCBTdHJpbmdTcGxpdElucHV0c30gZnJvbSAnLi4vLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7U2NhbGFyLCBUZW5zb3IsIFRlbnNvcjFEfSBmcm9tICcuLi8uLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi8uLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtTY2FsYXJMaWtlLCBUZW5zb3JMaWtlfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQge29wfSBmcm9tICcuLi9vcGVyYXRpb24nO1xuXG4vKipcbiAqIFNwbGl0IGVsZW1lbnRzIG9mIGBpbnB1dGAgYmFzZWQgb24gYGRlbGltaXRlcmAgaW50byBhIFNwYXJzZVRlbnNvciAuXG4gKlxuICogTGV0IE4gYmUgdGhlIHNpemUgb2Ygc291cmNlICh0eXBpY2FsbHkgTiB3aWxsIGJlIHRoZSBiYXRjaCBzaXplKS4gU3BsaXQgZWFjaFxuICogZWxlbWVudCBvZiBgaW5wdXRgIGJhc2VkIG9uIGBkZWxpbWl0ZXJgIGFuZCByZXR1cm4gYSBTcGFyc2VUZW5zb3IgY29udGFpbmluZ1xuICogdGhlIHNwbGl0dGVkIHRva2Vucy4gRW1wdHkgdG9rZW5zIGFyZSBpZ25vcmVkIGlmIGBza2lwRW1wdHlgIGlzIHNldCB0byBUcnVlLlxuICpcbiAqIGBkZWxpbWl0ZXJgIGNhbiBiZSBlbXB0eSwgb3IgYSBzdHJpbmcgb2Ygc3BsaXQgY2hhcmFjdGVycy4gSWYgYGRlbGltaXRlcmAgaXNcbiAqIGFuIGVtcHR5IHN0cmluZywgZWFjaCBlbGVtZW50IG9mIGBpbnB1dGAgaXMgc3BsaXQgaW50byBpbmRpdmlkdWFsXG4gKiBjaGFyYWN0ZXIgc3RyaW5ncy4gT3RoZXJ3aXNlIGV2ZXJ5IGNoYXJhY3RlciBvZiBgZGVsaW1pdGVyYCBpcyBhIHBvdGVudGlhbFxuICogc3BsaXQgcG9pbnQuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHJlc3VsdCA9IHRmLnN0cmluZy5zdHJpbmdTcGxpdChbJ2hlbGxvIHdvcmxkJywgICdhIGIgYyddLCAnICcpO1xuICogcmVzdWx0WydpbmRpY2VzJ10ucHJpbnQoKTsgLy8gW1swLCAwXSwgWzAsIDFdLCBbMSwgMF0sIFsxLCAxXSwgWzEsIDJdXVxuICogcmVzdWx0Wyd2YWx1ZXMnXS5wcmludCgpOyAvLyBbJ2hlbGxvJywgJ3dvcmxkJywgJ2EnLCAnYicsICdjJ11cbiAqIHJlc3VsdFsnc2hhcGUnXS5wcmludCgpOyAvLyBbMiwgM11cbiAqIGBgYFxuICogQHBhcmFtIGlucHV0OiAxLUQuIFN0cmluZ3MgdG8gc3BsaXQuXG4gKiBAcGFyYW0gZGVsaW1pdGVyOiAwLUQuIERlbGltaXRlciBjaGFyYWN0ZXJzLCBvciBlbXB0eSBzdHJpbmcuXG4gKiBAcGFyYW0gc2tpcEVtcHR5OiBPcHRpb25hbC4gSWYgdHJ1ZSwgc2tpcCB0aGUgZW1wdHkgc3RyaW5ncyBmcm9tIHRoZSByZXN1bHQuXG4gKiAgICAgRGVmYXVsdHMgdG8gdHJ1ZS5cbiAqIEByZXR1cm4gQSBtYXAgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKiAgICAgLSBpbmRpY2VzOiBBIGRlbnNlIG1hdHJpeCBvZiBpbnQzMiByZXByZXNlbnRpbmcgdGhlIGluZGljZXMgb2YgdGhlIHNwYXJzZVxuICogICAgICAgdGVuc29yLlxuICogICAgIC0gdmFsdWVzOiBBIHZlY3RvciBvZiBzdHJpbmdzIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHNwbGl0ZWQgdmFsdWVzLlxuICogICAgIC0gc2hhcGU6IGEgbGVuZ3RoLTIgdmVjdG9yIG9mIGludDMyIHJlcHJlc2VudGluZyB0aGUgc2hhcGUgb2YgdGhlIHNwYXJzZVxuICogdGVuc29yLCB3aGVyZSB0aGUgZmlyc3QgdmFsdWUgaXMgTiBhbmQgdGhlIHNlY29uZCB2YWx1ZSBpcyB0aGUgbWF4aW11bSBudW1iZXJcbiAqIG9mIHRva2VucyBpbiBhIHNpbmdsZSBpbnB1dCBlbnRyeS5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdTdHJpbmcnfVxuICovXG5mdW5jdGlvbiBzdHJpbmdTcGxpdF8oXG4gICAgaW5wdXQ6IFRlbnNvcjFEfFRlbnNvckxpa2UsIGRlbGltaXRlcjogU2NhbGFyfFNjYWxhckxpa2UsXG4gICAgc2tpcEVtcHR5ID0gdHJ1ZSk6IE5hbWVkVGVuc29yTWFwIHtcbiAgY29uc3QgJGlucHV0ID0gY29udmVydFRvVGVuc29yKGlucHV0LCAnaW5wdXQnLCAnc3RyaW5nU3BsaXQnLCAnc3RyaW5nJyk7XG4gIGNvbnN0ICRkZWxpbWl0ZXIgPVxuICAgICAgY29udmVydFRvVGVuc29yKGRlbGltaXRlciwgJ2RlbGltaXRlcicsICdzdHJpbmdTcGxpdCcsICdzdHJpbmcnKTtcblxuICBpZiAoJGlucHV0LnJhbmsgIT09IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBJbnB1dCBzaG91bGQgYmUgVGVuc29yMUQgYnV0IHJlY2VpdmVkIHNoYXBlICR7JGlucHV0LnNoYXBlfWApO1xuICB9XG4gIGlmICgkZGVsaW1pdGVyLnJhbmsgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBEZWxpbWl0ZXIgc2hvdWxkIGJlIGEgc2NhbGFyIGJ1dCByZWNlaXZlZCBzaGFwZSAkeyRkZWxpbWl0ZXIuc2hhcGV9YCk7XG4gIH1cblxuICBjb25zdCBhdHRyczogU3RyaW5nU3BsaXRBdHRycyA9IHtza2lwRW1wdHl9O1xuICBjb25zdCBpbnB1dHM6IFN0cmluZ1NwbGl0SW5wdXRzID0ge2lucHV0OiAkaW5wdXQsIGRlbGltaXRlcjogJGRlbGltaXRlcn07XG4gIGNvbnN0IHJlc3VsdDogVGVuc29yW10gPVxuICAgICAgRU5HSU5FLnJ1bktlcm5lbChTdHJpbmdTcGxpdCwgaW5wdXRzIGFzIHt9LCBhdHRycyBhcyB7fSk7XG4gIHJldHVybiB7aW5kaWNlczogcmVzdWx0WzBdLCB2YWx1ZXM6IHJlc3VsdFsxXSwgc2hhcGU6IHJlc3VsdFsyXX07XG59XG5cbmV4cG9ydCBjb25zdCBzdHJpbmdTcGxpdCA9IG9wKHtzdHJpbmdTcGxpdF99KTtcbiJdfQ==