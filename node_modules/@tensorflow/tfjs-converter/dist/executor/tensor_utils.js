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
/**
 * This differs from util.assertShapesMatch in that it allows values of
 * negative one, an undefined size of a dimensinon, in a shape to match
 * anything.
 */
import { util } from '@tensorflow/tfjs-core';
/**
 * Used by TensorList and TensorArray to verify if elementShape matches, support
 * negative value as the dim shape.
 * @param shapeA
 * @param shapeB
 * @param errorMessagePrefix
 */
export function assertShapesMatchAllowUndefinedSize(shapeA, shapeB, errorMessagePrefix = '') {
    // constant shape means unknown rank
    if (typeof shapeA === 'number' || typeof shapeB === 'number') {
        return;
    }
    util.assert(shapeA.length === shapeB.length, () => errorMessagePrefix + ` Shapes ${shapeA} and ${shapeB} must match`);
    for (let i = 0; i < shapeA.length; i++) {
        const dim0 = shapeA[i];
        const dim1 = shapeB[i];
        util.assert(dim0 < 0 || dim1 < 0 || dim0 === dim1, () => errorMessagePrefix + ` Shapes ${shapeA} and ${shapeB} must match`);
    }
}
export function fullDefinedShape(elementShape) {
    if (typeof elementShape === 'number' || elementShape.some(dim => dim < 0)) {
        return false;
    }
    return true;
}
/**
 * Generate the output element shape from the list elementShape, list tensors
 * and input param.
 * @param listElementShape
 * @param tensors
 * @param elementShape
 */
export function inferElementShape(listElementShape, tensors, elementShape) {
    let partialShape = mergeElementShape(listElementShape, elementShape);
    const notfullDefinedShape = !fullDefinedShape(partialShape);
    if (notfullDefinedShape && tensors.length === 0) {
        throw new Error(`Tried to calculate elements of an empty list` +
            ` with non-fully-defined elementShape: ${partialShape}`);
    }
    if (notfullDefinedShape) {
        tensors.forEach(tensor => {
            partialShape = mergeElementShape(tensor.shape, partialShape);
        });
    }
    if (!fullDefinedShape(partialShape)) {
        throw new Error(`Non-fully-defined elementShape: ${partialShape}`);
    }
    return partialShape;
}
export function mergeElementShape(elementShapeA, elementShapeB) {
    if (typeof elementShapeA === 'number') {
        return elementShapeB;
    }
    if (typeof elementShapeB === 'number') {
        return elementShapeA;
    }
    if (elementShapeA.length !== elementShapeB.length) {
        throw new Error(`Incompatible ranks during merge: ${elementShapeA} vs. ${elementShapeB}`);
    }
    const result = [];
    for (let i = 0; i < elementShapeA.length; ++i) {
        const dim0 = elementShapeA[i];
        const dim1 = elementShapeB[i];
        if (dim0 >= 0 && dim1 >= 0 && dim0 !== dim1) {
            throw new Error(`Incompatible shape during merge: ${elementShapeA} vs. ${elementShapeB}`);
        }
        result[i] = dim0 >= 0 ? dim0 : dim1;
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVuc29yX3V0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb252ZXJ0ZXIvc3JjL2V4ZWN1dG9yL3RlbnNvcl91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSDs7OztHQUlHO0FBRUgsT0FBTyxFQUFTLElBQUksRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRW5EOzs7Ozs7R0FNRztBQUNILE1BQU0sVUFBVSxtQ0FBbUMsQ0FDL0MsTUFBdUIsRUFBRSxNQUF1QixFQUNoRCxrQkFBa0IsR0FBRyxFQUFFO0lBQ3pCLG9DQUFvQztJQUNwQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7UUFDNUQsT0FBTztLQUNSO0lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FDUCxNQUFNLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxNQUFNLEVBQy9CLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixHQUFHLFdBQVcsTUFBTSxRQUFRLE1BQU0sYUFBYSxDQUFDLENBQUM7SUFDN0UsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdEMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxDQUNQLElBQUksR0FBRyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUNyQyxHQUFHLEVBQUUsQ0FDRCxrQkFBa0IsR0FBRyxXQUFXLE1BQU0sUUFBUSxNQUFNLGFBQWEsQ0FBQyxDQUFDO0tBQzVFO0FBQ0gsQ0FBQztBQUVELE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxZQUE2QjtJQUM1RCxJQUFJLE9BQU8sWUFBWSxLQUFLLFFBQVEsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFO1FBQ3pFLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFDRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLFVBQVUsaUJBQWlCLENBQzdCLGdCQUFpQyxFQUFFLE9BQWlCLEVBQ3BELFlBQTZCO0lBQy9CLElBQUksWUFBWSxHQUFHLGlCQUFpQixDQUFDLGdCQUFnQixFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3JFLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM1RCxJQUFJLG1CQUFtQixJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQy9DLE1BQU0sSUFBSSxLQUFLLENBQ1gsOENBQThDO1lBQzlDLHlDQUF5QyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0tBQzlEO0lBQ0QsSUFBSSxtQkFBbUIsRUFBRTtRQUN2QixPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3ZCLFlBQVksR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDO0tBQ0o7SUFDRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLEVBQUU7UUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQ0FBbUMsWUFBWSxFQUFFLENBQUMsQ0FBQztLQUNwRTtJQUNELE9BQU8sWUFBd0IsQ0FBQztBQUNsQyxDQUFDO0FBRUQsTUFBTSxVQUFVLGlCQUFpQixDQUM3QixhQUE4QixFQUFFLGFBQThCO0lBRWhFLElBQUksT0FBTyxhQUFhLEtBQUssUUFBUSxFQUFFO1FBQ3JDLE9BQU8sYUFBYSxDQUFDO0tBQ3RCO0lBQ0QsSUFBSSxPQUFPLGFBQWEsS0FBSyxRQUFRLEVBQUU7UUFDckMsT0FBTyxhQUFhLENBQUM7S0FDdEI7SUFFRCxJQUFJLGFBQWEsQ0FBQyxNQUFNLEtBQUssYUFBYSxDQUFDLE1BQU0sRUFBRTtRQUNqRCxNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxhQUFhLFFBQzdELGFBQWEsRUFBRSxDQUFDLENBQUM7S0FDdEI7SUFFRCxNQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7SUFDNUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDN0MsTUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixJQUFJLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQzNDLE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLGFBQWEsUUFDN0QsYUFBYSxFQUFFLENBQUMsQ0FBQztTQUN0QjtRQUNELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztLQUNyQztJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbi8qKlxuICogVGhpcyBkaWZmZXJzIGZyb20gdXRpbC5hc3NlcnRTaGFwZXNNYXRjaCBpbiB0aGF0IGl0IGFsbG93cyB2YWx1ZXMgb2ZcbiAqIG5lZ2F0aXZlIG9uZSwgYW4gdW5kZWZpbmVkIHNpemUgb2YgYSBkaW1lbnNpbm9uLCBpbiBhIHNoYXBlIHRvIG1hdGNoXG4gKiBhbnl0aGluZy5cbiAqL1xuXG5pbXBvcnQge1RlbnNvciwgdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuLyoqXG4gKiBVc2VkIGJ5IFRlbnNvckxpc3QgYW5kIFRlbnNvckFycmF5IHRvIHZlcmlmeSBpZiBlbGVtZW50U2hhcGUgbWF0Y2hlcywgc3VwcG9ydFxuICogbmVnYXRpdmUgdmFsdWUgYXMgdGhlIGRpbSBzaGFwZS5cbiAqIEBwYXJhbSBzaGFwZUFcbiAqIEBwYXJhbSBzaGFwZUJcbiAqIEBwYXJhbSBlcnJvck1lc3NhZ2VQcmVmaXhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydFNoYXBlc01hdGNoQWxsb3dVbmRlZmluZWRTaXplKFxuICAgIHNoYXBlQTogbnVtYmVyfG51bWJlcltdLCBzaGFwZUI6IG51bWJlcnxudW1iZXJbXSxcbiAgICBlcnJvck1lc3NhZ2VQcmVmaXggPSAnJyk6IHZvaWQge1xuICAvLyBjb25zdGFudCBzaGFwZSBtZWFucyB1bmtub3duIHJhbmtcbiAgaWYgKHR5cGVvZiBzaGFwZUEgPT09ICdudW1iZXInIHx8IHR5cGVvZiBzaGFwZUIgPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgc2hhcGVBLmxlbmd0aCA9PT0gc2hhcGVCLmxlbmd0aCxcbiAgICAgICgpID0+IGVycm9yTWVzc2FnZVByZWZpeCArIGAgU2hhcGVzICR7c2hhcGVBfSBhbmQgJHtzaGFwZUJ9IG11c3QgbWF0Y2hgKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGFwZUEubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBkaW0wID0gc2hhcGVBW2ldO1xuICAgIGNvbnN0IGRpbTEgPSBzaGFwZUJbaV07XG4gICAgdXRpbC5hc3NlcnQoXG4gICAgICAgIGRpbTAgPCAwIHx8IGRpbTEgPCAwIHx8IGRpbTAgPT09IGRpbTEsXG4gICAgICAgICgpID0+XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2VQcmVmaXggKyBgIFNoYXBlcyAke3NoYXBlQX0gYW5kICR7c2hhcGVCfSBtdXN0IG1hdGNoYCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZ1bGxEZWZpbmVkU2hhcGUoZWxlbWVudFNoYXBlOiBudW1iZXJ8bnVtYmVyW10pOiBib29sZWFuIHtcbiAgaWYgKHR5cGVvZiBlbGVtZW50U2hhcGUgPT09ICdudW1iZXInIHx8IGVsZW1lbnRTaGFwZS5zb21lKGRpbSA9PiBkaW0gPCAwKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cbi8qKlxuICogR2VuZXJhdGUgdGhlIG91dHB1dCBlbGVtZW50IHNoYXBlIGZyb20gdGhlIGxpc3QgZWxlbWVudFNoYXBlLCBsaXN0IHRlbnNvcnNcbiAqIGFuZCBpbnB1dCBwYXJhbS5cbiAqIEBwYXJhbSBsaXN0RWxlbWVudFNoYXBlXG4gKiBAcGFyYW0gdGVuc29yc1xuICogQHBhcmFtIGVsZW1lbnRTaGFwZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5mZXJFbGVtZW50U2hhcGUoXG4gICAgbGlzdEVsZW1lbnRTaGFwZTogbnVtYmVyfG51bWJlcltdLCB0ZW5zb3JzOiBUZW5zb3JbXSxcbiAgICBlbGVtZW50U2hhcGU6IG51bWJlcnxudW1iZXJbXSk6IG51bWJlcltdIHtcbiAgbGV0IHBhcnRpYWxTaGFwZSA9IG1lcmdlRWxlbWVudFNoYXBlKGxpc3RFbGVtZW50U2hhcGUsIGVsZW1lbnRTaGFwZSk7XG4gIGNvbnN0IG5vdGZ1bGxEZWZpbmVkU2hhcGUgPSAhZnVsbERlZmluZWRTaGFwZShwYXJ0aWFsU2hhcGUpO1xuICBpZiAobm90ZnVsbERlZmluZWRTaGFwZSAmJiB0ZW5zb3JzLmxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFRyaWVkIHRvIGNhbGN1bGF0ZSBlbGVtZW50cyBvZiBhbiBlbXB0eSBsaXN0YCArXG4gICAgICAgIGAgd2l0aCBub24tZnVsbHktZGVmaW5lZCBlbGVtZW50U2hhcGU6ICR7cGFydGlhbFNoYXBlfWApO1xuICB9XG4gIGlmIChub3RmdWxsRGVmaW5lZFNoYXBlKSB7XG4gICAgdGVuc29ycy5mb3JFYWNoKHRlbnNvciA9PiB7XG4gICAgICBwYXJ0aWFsU2hhcGUgPSBtZXJnZUVsZW1lbnRTaGFwZSh0ZW5zb3Iuc2hhcGUsIHBhcnRpYWxTaGFwZSk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKCFmdWxsRGVmaW5lZFNoYXBlKHBhcnRpYWxTaGFwZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYE5vbi1mdWxseS1kZWZpbmVkIGVsZW1lbnRTaGFwZTogJHtwYXJ0aWFsU2hhcGV9YCk7XG4gIH1cbiAgcmV0dXJuIHBhcnRpYWxTaGFwZSBhcyBudW1iZXJbXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlRWxlbWVudFNoYXBlKFxuICAgIGVsZW1lbnRTaGFwZUE6IG51bWJlcnxudW1iZXJbXSwgZWxlbWVudFNoYXBlQjogbnVtYmVyfG51bWJlcltdKTogbnVtYmVyfFxuICAgIG51bWJlcltdIHtcbiAgaWYgKHR5cGVvZiBlbGVtZW50U2hhcGVBID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBlbGVtZW50U2hhcGVCO1xuICB9XG4gIGlmICh0eXBlb2YgZWxlbWVudFNoYXBlQiA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gZWxlbWVudFNoYXBlQTtcbiAgfVxuXG4gIGlmIChlbGVtZW50U2hhcGVBLmxlbmd0aCAhPT0gZWxlbWVudFNoYXBlQi5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEluY29tcGF0aWJsZSByYW5rcyBkdXJpbmcgbWVyZ2U6ICR7ZWxlbWVudFNoYXBlQX0gdnMuICR7XG4gICAgICAgIGVsZW1lbnRTaGFwZUJ9YCk7XG4gIH1cblxuICBjb25zdCByZXN1bHQ6IG51bWJlcltdID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudFNoYXBlQS5sZW5ndGg7ICsraSkge1xuICAgIGNvbnN0IGRpbTAgPSBlbGVtZW50U2hhcGVBW2ldO1xuICAgIGNvbnN0IGRpbTEgPSBlbGVtZW50U2hhcGVCW2ldO1xuICAgIGlmIChkaW0wID49IDAgJiYgZGltMSA+PSAwICYmIGRpbTAgIT09IGRpbTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW5jb21wYXRpYmxlIHNoYXBlIGR1cmluZyBtZXJnZTogJHtlbGVtZW50U2hhcGVBfSB2cy4gJHtcbiAgICAgICAgICBlbGVtZW50U2hhcGVCfWApO1xuICAgIH1cbiAgICByZXN1bHRbaV0gPSBkaW0wID49IDAgPyBkaW0wIDogZGltMTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuIl19