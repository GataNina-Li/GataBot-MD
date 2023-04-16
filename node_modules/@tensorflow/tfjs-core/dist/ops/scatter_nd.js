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
import { ScatterNd } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
import * as scatter_nd_util from './scatter_nd_util';
/**
 * Creates a new tensor by applying sparse updates to individual
 * values or slices within a zero tensor of the given shape tensor according to
 * indices. This operator is the inverse of the `tf.gatherND` operator which
 * extracts values or slices from a given tensor.
 *
 * ```js
 * const indices = tf.tensor2d([4, 3, 1, 7], [4, 1], 'int32');
 * const updates = tf.tensor1d([9, 10, 11, 12]);
 * const shape = [8];
 * tf.scatterND(indices, updates, shape).print() //[0, 11, 0, 10, 9, 0, 0, 12]
 * ```
 *
 * @param indices The tensor contains the indices into the output tensor.
 * @param updates The tensor contains the value for the indices.
 * @param shape: The shape of the output tensor.
 *
 * @doc {heading: 'Operations', subheading: 'Slicing and Joining'}
 */
function scatterND_(indices, updates, shape) {
    const $indices = convertToTensor(indices, 'indices', 'scatterND', 'int32');
    const $updates = convertToTensor(updates, 'updates', 'scatterND');
    scatter_nd_util.validateInput($updates, $indices, shape);
    const inputs = { indices: $indices, updates: $updates };
    const attrs = { shape };
    // tslint:disable-next-line: no-unnecessary-type-assertion
    return ENGINE.runKernel(ScatterNd, inputs, attrs);
}
export const scatterND = op({ scatterND_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhdHRlcl9uZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3NjYXR0ZXJfbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsU0FBUyxFQUFrQyxNQUFNLGlCQUFpQixDQUFDO0FBSTNFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUduRCxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQy9CLE9BQU8sS0FBSyxlQUFlLE1BQU0sbUJBQW1CLENBQUM7QUFFckQ7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCRztBQUNILFNBQVMsVUFBVSxDQUNmLE9BQTBCLEVBQUUsT0FBMEIsRUFDdEQsS0FBa0I7SUFDcEIsTUFBTSxRQUFRLEdBQUcsZUFBZSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzNFLE1BQU0sUUFBUSxHQUFHLGVBQWUsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ2xFLGVBQWUsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUV6RCxNQUFNLE1BQU0sR0FBb0IsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUMsQ0FBQztJQUN2RSxNQUFNLEtBQUssR0FBbUIsRUFBQyxLQUFLLEVBQUMsQ0FBQztJQUV0QywwREFBMEQ7SUFDMUQsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUNaLFNBQVMsRUFBRSxNQUE4QixFQUN6QyxLQUEyQixDQUFjLENBQUM7QUFDdkQsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsRUFBQyxVQUFVLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7U2NhdHRlck5kLCBTY2F0dGVyTmRBdHRycywgU2NhdHRlck5kSW5wdXRzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7TmFtZWRUZW5zb3JNYXB9IGZyb20gJy4uL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7UmFuaywgU2hhcGVNYXAsIFRlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcblxuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuaW1wb3J0ICogYXMgc2NhdHRlcl9uZF91dGlsIGZyb20gJy4vc2NhdHRlcl9uZF91dGlsJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHRlbnNvciBieSBhcHBseWluZyBzcGFyc2UgdXBkYXRlcyB0byBpbmRpdmlkdWFsXG4gKiB2YWx1ZXMgb3Igc2xpY2VzIHdpdGhpbiBhIHplcm8gdGVuc29yIG9mIHRoZSBnaXZlbiBzaGFwZSB0ZW5zb3IgYWNjb3JkaW5nIHRvXG4gKiBpbmRpY2VzLiBUaGlzIG9wZXJhdG9yIGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBgdGYuZ2F0aGVyTkRgIG9wZXJhdG9yIHdoaWNoXG4gKiBleHRyYWN0cyB2YWx1ZXMgb3Igc2xpY2VzIGZyb20gYSBnaXZlbiB0ZW5zb3IuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGluZGljZXMgPSB0Zi50ZW5zb3IyZChbNCwgMywgMSwgN10sIFs0LCAxXSwgJ2ludDMyJyk7XG4gKiBjb25zdCB1cGRhdGVzID0gdGYudGVuc29yMWQoWzksIDEwLCAxMSwgMTJdKTtcbiAqIGNvbnN0IHNoYXBlID0gWzhdO1xuICogdGYuc2NhdHRlck5EKGluZGljZXMsIHVwZGF0ZXMsIHNoYXBlKS5wcmludCgpIC8vWzAsIDExLCAwLCAxMCwgOSwgMCwgMCwgMTJdXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gaW5kaWNlcyBUaGUgdGVuc29yIGNvbnRhaW5zIHRoZSBpbmRpY2VzIGludG8gdGhlIG91dHB1dCB0ZW5zb3IuXG4gKiBAcGFyYW0gdXBkYXRlcyBUaGUgdGVuc29yIGNvbnRhaW5zIHRoZSB2YWx1ZSBmb3IgdGhlIGluZGljZXMuXG4gKiBAcGFyYW0gc2hhcGU6IFRoZSBzaGFwZSBvZiB0aGUgb3V0cHV0IHRlbnNvci5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdTbGljaW5nIGFuZCBKb2luaW5nJ31cbiAqL1xuZnVuY3Rpb24gc2NhdHRlck5EXzxSIGV4dGVuZHMgUmFuaz4oXG4gICAgaW5kaWNlczogVGVuc29yfFRlbnNvckxpa2UsIHVwZGF0ZXM6IFRlbnNvcnxUZW5zb3JMaWtlLFxuICAgIHNoYXBlOiBTaGFwZU1hcFtSXSk6IFRlbnNvcjxSPiB7XG4gIGNvbnN0ICRpbmRpY2VzID0gY29udmVydFRvVGVuc29yKGluZGljZXMsICdpbmRpY2VzJywgJ3NjYXR0ZXJORCcsICdpbnQzMicpO1xuICBjb25zdCAkdXBkYXRlcyA9IGNvbnZlcnRUb1RlbnNvcih1cGRhdGVzLCAndXBkYXRlcycsICdzY2F0dGVyTkQnKTtcbiAgc2NhdHRlcl9uZF91dGlsLnZhbGlkYXRlSW5wdXQoJHVwZGF0ZXMsICRpbmRpY2VzLCBzaGFwZSk7XG5cbiAgY29uc3QgaW5wdXRzOiBTY2F0dGVyTmRJbnB1dHMgPSB7aW5kaWNlczogJGluZGljZXMsIHVwZGF0ZXM6ICR1cGRhdGVzfTtcbiAgY29uc3QgYXR0cnM6IFNjYXR0ZXJOZEF0dHJzID0ge3NoYXBlfTtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVubmVjZXNzYXJ5LXR5cGUtYXNzZXJ0aW9uXG4gIHJldHVybiBFTkdJTkUucnVuS2VybmVsKFxuICAgICAgICAgICAgIFNjYXR0ZXJOZCwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLFxuICAgICAgICAgICAgIGF0dHJzIGFzIHt9IGFzIE5hbWVkQXR0ck1hcCkgYXMgVGVuc29yPFI+O1xufVxuXG5leHBvcnQgY29uc3Qgc2NhdHRlck5EID0gb3Aoe3NjYXR0ZXJORF99KTtcbiJdfQ==