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
import { StringToHashBucketFast } from '../../kernel_names';
import { convertToTensor } from '../../tensor_util_env';
import { op } from '../operation';
/**
 * Converts each string in the input Tensor to its hash mod by a number of
 * buckets.
 *
 * The hash function is deterministic on the content of the string within the
 * process and will never change. However, it is not suitable for cryptography.
 * This function may be used when CPU time is scarce and inputs are trusted or
 * unimportant. There is a risk of adversaries constructing inputs that all hash
 * to the same bucket.
 *
 * ```js
 * const result = tf.string.stringToHashBucketFast(
 *   ['Hello', 'TensorFlow', '2.x'], 3);
 * result.print(); // [0, 2, 2]
 * ```
 * @param input: The strings to assign a hash bucket.
 * @param numBuckets: The number of buckets.
 * @return A Tensor of the same shape as the input tensor.
 *
 * @doc {heading: 'Operations', subheading: 'String'}
 */
function stringToHashBucketFast_(input, numBuckets) {
    const $input = convertToTensor(input, 'input', 'stringToHashBucketFast', 'string');
    const attrs = { numBuckets };
    if (numBuckets <= 0) {
        throw new Error(`Number of buckets must be at least 1`);
    }
    const inputs = { input: $input };
    return ENGINE.runKernel(StringToHashBucketFast, inputs, attrs);
}
export const stringToHashBucketFast = op({ stringToHashBucketFast_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nX3RvX2hhc2hfYnVja2V0X2Zhc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9zdHJpbmcvc3RyaW5nX3RvX2hhc2hfYnVja2V0X2Zhc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUNwQyxPQUFPLEVBQUMsc0JBQXNCLEVBQTRELE1BQU0sb0JBQW9CLENBQUM7QUFFckgsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRXRELE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFaEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0JHO0FBQ0gsU0FBUyx1QkFBdUIsQ0FDNUIsS0FBd0IsRUFBRSxVQUFrQjtJQUM5QyxNQUFNLE1BQU0sR0FDUixlQUFlLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN4RSxNQUFNLEtBQUssR0FBZ0MsRUFBQyxVQUFVLEVBQUMsQ0FBQztJQUV4RCxJQUFJLFVBQVUsSUFBSSxDQUFDLEVBQUU7UUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0tBQ3pEO0lBRUQsTUFBTSxNQUFNLEdBQWlDLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBQyxDQUFDO0lBQzdELE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsRUFBRSxNQUFZLEVBQUUsS0FBVyxDQUFDLENBQUM7QUFDN0UsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFHLEVBQUUsQ0FBQyxFQUFDLHVCQUF1QixFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIxIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uLy4uL2VuZ2luZSc7XG5pbXBvcnQge1N0cmluZ1RvSGFzaEJ1Y2tldEZhc3QsIFN0cmluZ1RvSGFzaEJ1Y2tldEZhc3RBdHRycywgU3RyaW5nVG9IYXNoQnVja2V0RmFzdElucHV0c30gZnJvbSAnLi4vLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi8uLi90ZW5zb3InO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uLy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uLy4uL3R5cGVzJztcbmltcG9ydCB7b3B9IGZyb20gJy4uL29wZXJhdGlvbic7XG5cbi8qKlxuICogQ29udmVydHMgZWFjaCBzdHJpbmcgaW4gdGhlIGlucHV0IFRlbnNvciB0byBpdHMgaGFzaCBtb2QgYnkgYSBudW1iZXIgb2ZcbiAqIGJ1Y2tldHMuXG4gKlxuICogVGhlIGhhc2ggZnVuY3Rpb24gaXMgZGV0ZXJtaW5pc3RpYyBvbiB0aGUgY29udGVudCBvZiB0aGUgc3RyaW5nIHdpdGhpbiB0aGVcbiAqIHByb2Nlc3MgYW5kIHdpbGwgbmV2ZXIgY2hhbmdlLiBIb3dldmVyLCBpdCBpcyBub3Qgc3VpdGFibGUgZm9yIGNyeXB0b2dyYXBoeS5cbiAqIFRoaXMgZnVuY3Rpb24gbWF5IGJlIHVzZWQgd2hlbiBDUFUgdGltZSBpcyBzY2FyY2UgYW5kIGlucHV0cyBhcmUgdHJ1c3RlZCBvclxuICogdW5pbXBvcnRhbnQuIFRoZXJlIGlzIGEgcmlzayBvZiBhZHZlcnNhcmllcyBjb25zdHJ1Y3RpbmcgaW5wdXRzIHRoYXQgYWxsIGhhc2hcbiAqIHRvIHRoZSBzYW1lIGJ1Y2tldC5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgcmVzdWx0ID0gdGYuc3RyaW5nLnN0cmluZ1RvSGFzaEJ1Y2tldEZhc3QoXG4gKiAgIFsnSGVsbG8nLCAnVGVuc29yRmxvdycsICcyLngnXSwgMyk7XG4gKiByZXN1bHQucHJpbnQoKTsgLy8gWzAsIDIsIDJdXG4gKiBgYGBcbiAqIEBwYXJhbSBpbnB1dDogVGhlIHN0cmluZ3MgdG8gYXNzaWduIGEgaGFzaCBidWNrZXQuXG4gKiBAcGFyYW0gbnVtQnVja2V0czogVGhlIG51bWJlciBvZiBidWNrZXRzLlxuICogQHJldHVybiBBIFRlbnNvciBvZiB0aGUgc2FtZSBzaGFwZSBhcyB0aGUgaW5wdXQgdGVuc29yLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdPcGVyYXRpb25zJywgc3ViaGVhZGluZzogJ1N0cmluZyd9XG4gKi9cbmZ1bmN0aW9uIHN0cmluZ1RvSGFzaEJ1Y2tldEZhc3RfKFxuICAgIGlucHV0OiBUZW5zb3J8VGVuc29yTGlrZSwgbnVtQnVja2V0czogbnVtYmVyKTogVGVuc29yIHtcbiAgY29uc3QgJGlucHV0ID1cbiAgICAgIGNvbnZlcnRUb1RlbnNvcihpbnB1dCwgJ2lucHV0JywgJ3N0cmluZ1RvSGFzaEJ1Y2tldEZhc3QnLCAnc3RyaW5nJyk7XG4gIGNvbnN0IGF0dHJzOiBTdHJpbmdUb0hhc2hCdWNrZXRGYXN0QXR0cnMgPSB7bnVtQnVja2V0c307XG5cbiAgaWYgKG51bUJ1Y2tldHMgPD0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgTnVtYmVyIG9mIGJ1Y2tldHMgbXVzdCBiZSBhdCBsZWFzdCAxYCk7XG4gIH1cblxuICBjb25zdCBpbnB1dHM6IFN0cmluZ1RvSGFzaEJ1Y2tldEZhc3RJbnB1dHMgPSB7aW5wdXQ6ICRpbnB1dH07XG4gIHJldHVybiBFTkdJTkUucnVuS2VybmVsKFN0cmluZ1RvSGFzaEJ1Y2tldEZhc3QsIGlucHV0cyBhcyB7fSwgYXR0cnMgYXMge30pO1xufVxuXG5leHBvcnQgY29uc3Qgc3RyaW5nVG9IYXNoQnVja2V0RmFzdCA9IG9wKHtzdHJpbmdUb0hhc2hCdWNrZXRGYXN0X30pO1xuIl19