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
import { MPRandGauss } from './rand_util';
/**
 * Creates a `tf.Tensor` with values sampled from a truncated normal
 * distribution.
 *
 * ```js
 * tf.truncatedNormal([2, 2]).print();
 * ```
 *
 * The generated values follow a normal distribution with specified mean and
 * standard deviation, except that values whose magnitude is more than 2
 * standard deviations from the mean are dropped and re-picked.
 *
 * @param shape An array of integers defining the output tensor shape.
 * @param mean The mean of the normal distribution.
 * @param stdDev The standard deviation of the normal distribution.
 * @param dtype The data type of the output tensor.
 * @param seed The seed for the random number generator.
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
function truncatedNormal_(shape, mean = 0, stdDev = 1, dtype, seed) {
    if (dtype != null && dtype === 'bool') {
        throw new Error(`Unsupported data type $ { dtype }`);
    }
    const randGauss = new MPRandGauss(mean, stdDev, dtype, true /* truncated */, seed);
    const res = buffer(shape, dtype);
    for (let i = 0; i < res.values.length; i++) {
        res.values[i] = randGauss.nextValue();
    }
    return res.toTensor();
}
export const truncatedNormal = op({ truncatedNormal_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJ1bmNhdGVkX25vcm1hbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3RydW5jYXRlZF9ub3JtYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBS0gsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNoQyxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFeEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQkc7QUFDSCxTQUFTLGdCQUFnQixDQUNyQixLQUFrQixFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxLQUF5QixFQUNuRSxJQUFhO0lBQ2YsSUFBSSxLQUFLLElBQUksSUFBSSxJQUFLLEtBQWtCLEtBQUssTUFBTSxFQUFFO1FBQ25ELE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztLQUN0RDtJQUNELE1BQU0sU0FBUyxHQUNYLElBQUksV0FBVyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDckUsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNqQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDMUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDdkM7SUFDRCxPQUFPLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUN4QixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQyxFQUFDLGdCQUFnQixFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge0RhdGFUeXBlLCBSYW5rLCBTaGFwZU1hcH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQge2J1ZmZlcn0gZnJvbSAnLi9idWZmZXInO1xuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuaW1wb3J0IHtNUFJhbmRHYXVzc30gZnJvbSAnLi9yYW5kX3V0aWwnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgdGYuVGVuc29yYCB3aXRoIHZhbHVlcyBzYW1wbGVkIGZyb20gYSB0cnVuY2F0ZWQgbm9ybWFsXG4gKiBkaXN0cmlidXRpb24uXG4gKlxuICogYGBganNcbiAqIHRmLnRydW5jYXRlZE5vcm1hbChbMiwgMl0pLnByaW50KCk7XG4gKiBgYGBcbiAqXG4gKiBUaGUgZ2VuZXJhdGVkIHZhbHVlcyBmb2xsb3cgYSBub3JtYWwgZGlzdHJpYnV0aW9uIHdpdGggc3BlY2lmaWVkIG1lYW4gYW5kXG4gKiBzdGFuZGFyZCBkZXZpYXRpb24sIGV4Y2VwdCB0aGF0IHZhbHVlcyB3aG9zZSBtYWduaXR1ZGUgaXMgbW9yZSB0aGFuIDJcbiAqIHN0YW5kYXJkIGRldmlhdGlvbnMgZnJvbSB0aGUgbWVhbiBhcmUgZHJvcHBlZCBhbmQgcmUtcGlja2VkLlxuICpcbiAqIEBwYXJhbSBzaGFwZSBBbiBhcnJheSBvZiBpbnRlZ2VycyBkZWZpbmluZyB0aGUgb3V0cHV0IHRlbnNvciBzaGFwZS5cbiAqIEBwYXJhbSBtZWFuIFRoZSBtZWFuIG9mIHRoZSBub3JtYWwgZGlzdHJpYnV0aW9uLlxuICogQHBhcmFtIHN0ZERldiBUaGUgc3RhbmRhcmQgZGV2aWF0aW9uIG9mIHRoZSBub3JtYWwgZGlzdHJpYnV0aW9uLlxuICogQHBhcmFtIGR0eXBlIFRoZSBkYXRhIHR5cGUgb2YgdGhlIG91dHB1dCB0ZW5zb3IuXG4gKiBAcGFyYW0gc2VlZCBUaGUgc2VlZCBmb3IgdGhlIHJhbmRvbSBudW1iZXIgZ2VuZXJhdG9yLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdUZW5zb3JzJywgc3ViaGVhZGluZzogJ0NyZWF0aW9uJ31cbiAqL1xuZnVuY3Rpb24gdHJ1bmNhdGVkTm9ybWFsXzxSIGV4dGVuZHMgUmFuaz4oXG4gICAgc2hhcGU6IFNoYXBlTWFwW1JdLCBtZWFuID0gMCwgc3RkRGV2ID0gMSwgZHR5cGU/OiAnZmxvYXQzMid8J2ludDMyJyxcbiAgICBzZWVkPzogbnVtYmVyKTogVGVuc29yPFI+IHtcbiAgaWYgKGR0eXBlICE9IG51bGwgJiYgKGR0eXBlIGFzIERhdGFUeXBlKSA9PT0gJ2Jvb2wnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBkYXRhIHR5cGUgJCB7IGR0eXBlIH1gKTtcbiAgfVxuICBjb25zdCByYW5kR2F1c3MgPVxuICAgICAgbmV3IE1QUmFuZEdhdXNzKG1lYW4sIHN0ZERldiwgZHR5cGUsIHRydWUgLyogdHJ1bmNhdGVkICovLCBzZWVkKTtcbiAgY29uc3QgcmVzID0gYnVmZmVyKHNoYXBlLCBkdHlwZSk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzLnZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgIHJlcy52YWx1ZXNbaV0gPSByYW5kR2F1c3MubmV4dFZhbHVlKCk7XG4gIH1cbiAgcmV0dXJuIHJlcy50b1RlbnNvcigpO1xufVxuXG5leHBvcnQgY29uc3QgdHJ1bmNhdGVkTm9ybWFsID0gb3Aoe3RydW5jYXRlZE5vcm1hbF99KTtcbiJdfQ==