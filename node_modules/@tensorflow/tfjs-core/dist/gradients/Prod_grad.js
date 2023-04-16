/**
 * @license
 * Copyright 2022 Google Inc. All Rights Reserved.
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
import { backend_util } from '../base';
import { Prod } from '../kernel_names';
import { cumprod } from '../ops/cumprod';
import { mul } from '../ops/mul';
import { reshape } from '../ops/reshape';
import { transpose } from '../ops/transpose';
// Gradient for product operation on a single axis.
function prodGradFn_(x, dy, axis) {
    // The gradient tensor (dy) has a set of axes removed, so we create re-shaped
    // versions (of size 1) for the removed axis; this supports broadcasting over
    // those dimensions.
    const expandedYShape = x.shape.slice();
    expandedYShape[axis] = 1;
    // The actual gradient computation.
    const expandedDy = reshape(dy, expandedYShape);
    const xCumProd = cumprod(x, axis, true, false);
    const xCumRevProd = cumprod(x, axis, true, true);
    const dx = mul(xCumProd, xCumRevProd);
    return mul(expandedDy, dx);
}
// Support gradients when the product is done on many axes at once.
// This done py pushing all the axes on which the product is applied into a
// single axis.
function prodsGradFn_(x, dy, axis) {
    // Move all axes for doing prod over to the end of the tensor.
    const xRank = x.shape.length;
    const finalProdAxis = xRank - axis.length;
    const xPermutation = backend_util.getAxesPermutation(axis, xRank);
    let permutedX = x;
    if (xPermutation != null) {
        permutedX = transpose(x, xPermutation);
    }
    // Reshape all the prod dimensions into a single one, and do compute prod
    // gradients on that.
    const newShape = permutedX.shape.slice();
    const removedShape = newShape.splice(xRank - axis.length, axis.length);
    const endPartShape = removedShape.reduce((p, c) => p * c, 1);
    newShape.push(endPartShape);
    const reshapedPermutedX = permutedX.reshape(newShape);
    let prodGrad = prodGradFn_(reshapedPermutedX, dy, finalProdAxis);
    // Undo the re-shaping now we have the dx vector, and permute back to
    // original axes order.
    prodGrad = prodGrad.reshape(permutedX.shape);
    if (xPermutation != null) {
        const undoPermutation = backend_util.getUndoAxesPermutation(xPermutation);
        prodGrad = transpose(prodGrad, undoPermutation);
    }
    return prodGrad;
}
// Running example:
// [
//   [
//     [3.0, 4.0],
//     [5.0, 6.0],
//     [7.0, 8.0]
//   ],
//   [
//     [3.0, 5.0],
//     [0.0, 6.0],
//     [5.0, 6.0]
//   ]
// ]
//
export const prodGradConfig = {
    kernelName: Prod,
    inputsToSave: ['x'],
    gradFunc: (dy, saved, attrs) => {
        const [x] = saved;
        const { axis } = attrs;
        let axisArr = [];
        if (axis === undefined || axis === null) {
            axisArr = x.shape.map((_, i) => i);
        }
        else if (typeof axis === 'number') {
            axisArr = [axis];
        }
        else {
            axisArr = axis;
        }
        return { x: () => prodsGradFn_(x, dy, axisArr) };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvZF9ncmFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9ncmFkaWVudHMvUHJvZF9ncmFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDckMsT0FBTyxFQUFDLElBQUksRUFBWSxNQUFNLGlCQUFpQixDQUFDO0FBRWhELE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2QyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFHM0MsbURBQW1EO0FBQ25ELFNBQVMsV0FBVyxDQUFDLENBQVMsRUFBRSxFQUFVLEVBQUUsSUFBWTtJQUN0RCw2RUFBNkU7SUFDN0UsNkVBQTZFO0lBQzdFLG9CQUFvQjtJQUNwQixNQUFNLGNBQWMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3ZDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFekIsbUNBQW1DO0lBQ25DLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDL0MsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9DLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqRCxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3RDLE9B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O1lBQ0wsT0FBTyxHQUFHLElBQUksQ0FBQztTQUNoQjtRQUNELE9BQU8sRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxFQUFZLEVBQUUsT0FBTyxDQUFDLEVBQUMsQ0FBQztJQUMzRCxDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIyIEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtiYWNrZW5kX3V0aWx9IGZyb20gJy4uL2Jhc2UnO1xuaW1wb3J0IHtQcm9kLCBQcm9kQXR0cnN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge0dyYWRDb25maWcsIE5hbWVkQXR0ck1hcH0gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7Y3VtcHJvZH0gZnJvbSAnLi4vb3BzL2N1bXByb2QnO1xuaW1wb3J0IHttdWx9IGZyb20gJy4uL29wcy9tdWwnO1xuaW1wb3J0IHtyZXNoYXBlfSBmcm9tICcuLi9vcHMvcmVzaGFwZSc7XG5pbXBvcnQge3RyYW5zcG9zZX0gZnJvbSAnLi4vb3BzL3RyYW5zcG9zZSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcblxuLy8gR3JhZGllbnQgZm9yIHByb2R1Y3Qgb3BlcmF0aW9uIG9uIGEgc2luZ2xlIGF4aXMuXG5mdW5jdGlvbiBwcm9kR3JhZEZuXyh4OiBUZW5zb3IsIGR5OiBUZW5zb3IsIGF4aXM6IG51bWJlcik6IFRlbnNvciB7XG4gIC8vIFRoZSBncmFkaWVudCB0ZW5zb3IgKGR5KSBoYXMgYSBzZXQgb2YgYXhlcyByZW1vdmVkLCBzbyB3ZSBjcmVhdGUgcmUtc2hhcGVkXG4gIC8vIHZlcnNpb25zIChvZiBzaXplIDEpIGZvciB0aGUgcmVtb3ZlZCBheGlzOyB0aGlzIHN1cHBvcnRzIGJyb2FkY2FzdGluZyBvdmVyXG4gIC8vIHRob3NlIGRpbWVuc2lvbnMuXG4gIGNvbnN0IGV4cGFuZGVkWVNoYXBlID0geC5zaGFwZS5zbGljZSgpO1xuICBleHBhbmRlZFlTaGFwZVtheGlzXSA9IDE7XG5cbiAgLy8gVGhlIGFjdHVhbCBncmFkaWVudCBjb21wdXRhdGlvbi5cbiAgY29uc3QgZXhwYW5kZWREeSA9IHJlc2hhcGUoZHksIGV4cGFuZGVkWVNoYXBlKTtcbiAgY29uc3QgeEN1bVByb2QgPSBjdW1wcm9kKHgsIGF4aXMsIHRydWUsIGZhbHNlKTtcbiAgY29uc3QgeEN1bVJldlByb2QgPSBjdW1wcm9kKHgsIGF4aXMsIHRydWUsIHRydWUpO1xuICBjb25zdCBkeCA9IG11bCh4Q3VtUHJvZCwgeEN1bVJldlByb2QpO1xuICByZXR1cm4gbXVsKGV4cGFuZGVkRHksIGR4KTtcbn1cblxuLy8gU3VwcG9ydCBncmFkaWVudHMgd2hlbiB0aGUgcHJvZHVjdCBpcyBkb25lIG9uIG1hbnkgYXhlcyBhdCBvbmNlLlxuLy8gVGhpcyBkb25lIHB5IHB1c2hpbmcgYWxsIHRoZSBheGVzIG9uIHdoaWNoIHRoZSBwcm9kdWN0IGlzIGFwcGxpZWQgaW50byBhXG4vLyBzaW5nbGUgYXhpcy5cbmZ1bmN0aW9uIHByb2RzR3JhZEZuXyh4OiBUZW5zb3IsIGR5OiBUZW5zb3IsIGF4aXM6IG51bWJlcltdKTogVGVuc29yIHtcbiAgLy8gTW92ZSBhbGwgYXhlcyBmb3IgZG9pbmcgcHJvZCBvdmVyIHRvIHRoZSBlbmQgb2YgdGhlIHRlbnNvci5cbiAgY29uc3QgeFJhbmsgPSB4LnNoYXBlLmxlbmd0aDtcbiAgY29uc3QgZmluYWxQcm9kQXhpcyA9IHhSYW5rIC0gYXhpcy5sZW5ndGg7XG4gIGNvbnN0IHhQZXJtdXRhdGlvbiA9IGJhY2tlbmRfdXRpbC5nZXRBeGVzUGVybXV0YXRpb24oYXhpcywgeFJhbmspO1xuICBsZXQgcGVybXV0ZWRYID0geDtcbiAgaWYgKHhQZXJtdXRhdGlvbiAhPSBudWxsKSB7XG4gICAgcGVybXV0ZWRYID0gdHJhbnNwb3NlKHgsIHhQZXJtdXRhdGlvbik7XG4gIH1cblxuICAvLyBSZXNoYXBlIGFsbCB0aGUgcHJvZCBkaW1lbnNpb25zIGludG8gYSBzaW5nbGUgb25lLCBhbmQgZG8gY29tcHV0ZSBwcm9kXG4gIC8vIGdyYWRpZW50cyBvbiB0aGF0LlxuICBjb25zdCBuZXdTaGFwZSA9IHBlcm11dGVkWC5zaGFwZS5zbGljZSgpO1xuICBjb25zdCByZW1vdmVkU2hhcGUgPSBuZXdTaGFwZS5zcGxpY2UoeFJhbmsgLSBheGlzLmxlbmd0aCwgYXhpcy5sZW5ndGgpO1xuICBjb25zdCBlbmRQYXJ0U2hhcGUgPSByZW1vdmVkU2hhcGUucmVkdWNlKChwLCBjKSA9PiBwICogYywgMSk7XG4gIG5ld1NoYXBlLnB1c2goZW5kUGFydFNoYXBlKTtcbiAgY29uc3QgcmVzaGFwZWRQZXJtdXRlZFggPSBwZXJtdXRlZFgucmVzaGFwZShuZXdTaGFwZSk7XG4gIGxldCBwcm9kR3JhZCA9IHByb2RHcmFkRm5fKHJlc2hhcGVkUGVybXV0ZWRYLCBkeSwgZmluYWxQcm9kQXhpcyk7XG5cbiAgLy8gVW5kbyB0aGUgcmUtc2hhcGluZyBub3cgd2UgaGF2ZSB0aGUgZHggdmVjdG9yLCBhbmQgcGVybXV0ZSBiYWNrIHRvXG4gIC8vIG9yaWdpbmFsIGF4ZXMgb3JkZXIuXG4gIHByb2RHcmFkID0gcHJvZEdyYWQucmVzaGFwZShwZXJtdXRlZFguc2hhcGUpO1xuICBpZiAoeFBlcm11dGF0aW9uICE9IG51bGwpIHtcbiAgICBjb25zdCB1bmRvUGVybXV0YXRpb24gPSBiYWNrZW5kX3V0aWwuZ2V0VW5kb0F4ZXNQZXJtdXRhdGlvbih4UGVybXV0YXRpb24pO1xuICAgIHByb2RHcmFkID0gdHJhbnNwb3NlKHByb2RHcmFkLCB1bmRvUGVybXV0YXRpb24pO1xuICB9XG4gIHJldHVybiBwcm9kR3JhZDtcbn1cblxuLy8gUnVubmluZyBleGFtcGxlOlxuLy8gW1xuLy8gICBbXG4vLyAgICAgWzMuMCwgNC4wXSxcbi8vICAgICBbNS4wLCA2LjBdLFxuLy8gICAgIFs3LjAsIDguMF1cbi8vICAgXSxcbi8vICAgW1xuLy8gICAgIFszLjAsIDUuMF0sXG4vLyAgICAgWzAuMCwgNi4wXSxcbi8vICAgICBbNS4wLCA2LjBdXG4vLyAgIF1cbi8vIF1cbi8vXG5leHBvcnQgY29uc3QgcHJvZEdyYWRDb25maWc6IEdyYWRDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IFByb2QsXG4gIGlucHV0c1RvU2F2ZTogWyd4J10sXG4gIGdyYWRGdW5jOiAoZHk6IFRlbnNvcnxUZW5zb3JbXSwgc2F2ZWQ6IFRlbnNvcltdLCBhdHRyczogTmFtZWRBdHRyTWFwKSA9PiB7XG4gICAgY29uc3QgW3hdID0gc2F2ZWQ7XG4gICAgY29uc3Qge2F4aXN9ID0gKGF0dHJzIGFzIHt9KSBhcyBQcm9kQXR0cnM7XG4gICAgbGV0IGF4aXNBcnIgPSBbXSBhcyBudW1iZXJbXTtcbiAgICBpZiAoYXhpcyA9PT0gdW5kZWZpbmVkIHx8IGF4aXMgPT09IG51bGwpIHtcbiAgICAgIGF4aXNBcnIgPSB4LnNoYXBlLm1hcCgoXywgaSkgPT4gaSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgYXhpcyA9PT0gJ251bWJlcicpIHtcbiAgICAgIGF4aXNBcnIgPSBbYXhpc107XG4gICAgfSBlbHNlIHtcbiAgICAgIGF4aXNBcnIgPSBheGlzO1xuICAgIH1cbiAgICByZXR1cm4ge3g6ICgpID0+IHByb2RzR3JhZEZuXyh4LCBkeSBhcyBUZW5zb3IsIGF4aXNBcnIpfTtcbiAgfVxufTtcbiJdfQ==