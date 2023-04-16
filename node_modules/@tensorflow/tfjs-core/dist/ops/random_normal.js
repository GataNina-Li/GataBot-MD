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
 * Creates a `tf.Tensor` with values sampled from a normal distribution.
 *
 * ```js
 * tf.randomNormal([2, 2]).print();
 * ```
 *
 * @param shape An array of integers defining the output tensor shape.
 * @param mean The mean of the normal distribution.
 * @param stdDev The standard deviation of the normal distribution.
 * @param dtype The data type of the output.
 * @param seed The seed for the random number generator.
 *
 * @doc {heading: 'Tensors', subheading: 'Random'}
 */
function randomNormal_(shape, mean = 0, stdDev = 1, dtype, seed) {
    if (dtype != null && dtype === 'bool') {
        throw new Error(`Unsupported data type ${dtype}`);
    }
    const randGauss = new MPRandGauss(mean, stdDev, dtype, false /* truncated */, seed);
    const res = buffer(shape, dtype);
    for (let i = 0; i < res.values.length; i++) {
        res.values[i] = randGauss.nextValue();
    }
    return res.toTensor();
}
export const randomNormal = op({ randomNormal_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZG9tX25vcm1hbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3JhbmRvbV9ub3JtYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBS0gsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNoQyxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFeEM7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxTQUFTLGFBQWEsQ0FDbEIsS0FBa0IsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsS0FBeUIsRUFDbkUsSUFBYTtJQUNmLElBQUksS0FBSyxJQUFJLElBQUksSUFBSyxLQUFrQixLQUFLLE1BQU0sRUFBRTtRQUNuRCxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQ25EO0lBQ0QsTUFBTSxTQUFTLEdBQ1gsSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN0RSxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMxQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUN2QztJQUNELE9BQU8sR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3hCLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLEVBQUMsYUFBYSxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge0RhdGFUeXBlLCBSYW5rLCBTaGFwZU1hcH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQge2J1ZmZlcn0gZnJvbSAnLi9idWZmZXInO1xuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuaW1wb3J0IHtNUFJhbmRHYXVzc30gZnJvbSAnLi9yYW5kX3V0aWwnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgdGYuVGVuc29yYCB3aXRoIHZhbHVlcyBzYW1wbGVkIGZyb20gYSBub3JtYWwgZGlzdHJpYnV0aW9uLlxuICpcbiAqIGBgYGpzXG4gKiB0Zi5yYW5kb21Ob3JtYWwoWzIsIDJdKS5wcmludCgpO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHNoYXBlIEFuIGFycmF5IG9mIGludGVnZXJzIGRlZmluaW5nIHRoZSBvdXRwdXQgdGVuc29yIHNoYXBlLlxuICogQHBhcmFtIG1lYW4gVGhlIG1lYW4gb2YgdGhlIG5vcm1hbCBkaXN0cmlidXRpb24uXG4gKiBAcGFyYW0gc3RkRGV2IFRoZSBzdGFuZGFyZCBkZXZpYXRpb24gb2YgdGhlIG5vcm1hbCBkaXN0cmlidXRpb24uXG4gKiBAcGFyYW0gZHR5cGUgVGhlIGRhdGEgdHlwZSBvZiB0aGUgb3V0cHV0LlxuICogQHBhcmFtIHNlZWQgVGhlIHNlZWQgZm9yIHRoZSByYW5kb20gbnVtYmVyIGdlbmVyYXRvci5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnVGVuc29ycycsIHN1YmhlYWRpbmc6ICdSYW5kb20nfVxuICovXG5mdW5jdGlvbiByYW5kb21Ob3JtYWxfPFIgZXh0ZW5kcyBSYW5rPihcbiAgICBzaGFwZTogU2hhcGVNYXBbUl0sIG1lYW4gPSAwLCBzdGREZXYgPSAxLCBkdHlwZT86ICdmbG9hdDMyJ3wnaW50MzInLFxuICAgIHNlZWQ/OiBudW1iZXIpOiBUZW5zb3I8Uj4ge1xuICBpZiAoZHR5cGUgIT0gbnVsbCAmJiAoZHR5cGUgYXMgRGF0YVR5cGUpID09PSAnYm9vbCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGRhdGEgdHlwZSAke2R0eXBlfWApO1xuICB9XG4gIGNvbnN0IHJhbmRHYXVzcyA9XG4gICAgICBuZXcgTVBSYW5kR2F1c3MobWVhbiwgc3RkRGV2LCBkdHlwZSwgZmFsc2UgLyogdHJ1bmNhdGVkICovLCBzZWVkKTtcbiAgY29uc3QgcmVzID0gYnVmZmVyKHNoYXBlLCBkdHlwZSk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzLnZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgIHJlcy52YWx1ZXNbaV0gPSByYW5kR2F1c3MubmV4dFZhbHVlKCk7XG4gIH1cbiAgcmV0dXJuIHJlcy50b1RlbnNvcigpO1xufVxuXG5leHBvcnQgY29uc3QgcmFuZG9tTm9ybWFsID0gb3Aoe3JhbmRvbU5vcm1hbF99KTtcbiJdfQ==