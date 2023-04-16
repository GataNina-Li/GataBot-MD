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
import { concat, keep, reshape, scalar, slice, stack, tensor, tidy, unstack } from '@tensorflow/tfjs-core';
import { assertShapesMatchAllowUndefinedSize, inferElementShape, mergeElementShape } from './tensor_utils';
/**
 * TensorList stores a container of `tf.Tensor` objects, which are accessible
 * via tensors field.
 *
 * In order to get a copy of the underlying list, use the copy method:
 * ```
 *    TensorList b = a.copy();
 *    b.tensors().pushBack(t);  // This does not modify a.tensors().
 * ```
 *
 * Note that this is not a deep copy: the memory locations of the underlying
 * tensors will still point to the same locations of the corresponding tensors
 * in the original.
 */
export class TensorList {
    /**
     *
     * @param tensors list of tensors
     * @param elementShape shape of each tensor, this can be a single number (any
     * shape is allowed) or partial shape (dim = -1).
     * @param elementDtype data type of each tensor
     * @param maxNumElements The maximum allowed size of `tensors`. Defaults to -1
     *   meaning that the size of `tensors` is unbounded.
     */
    constructor(tensors, elementShape, elementDtype, maxNumElements = -1) {
        this.tensors = tensors;
        this.elementShape = elementShape;
        this.elementDtype = elementDtype;
        if (tensors != null) {
            tensors.forEach(tensor => {
                if (elementDtype !== tensor.dtype) {
                    throw new Error(`Invalid data types; op elements ${elementDtype}, but list elements ${tensor.dtype}`);
                }
                assertShapesMatchAllowUndefinedSize(elementShape, tensor.shape, 'TensorList shape mismatch: ');
                keep(tensor);
            });
        }
        this.idTensor = scalar(0);
        this.maxNumElements = maxNumElements;
        keep(this.idTensor);
    }
    get id() {
        return this.idTensor.id;
    }
    /**
     * Get a new TensorList containing a copy of the underlying tensor container.
     */
    copy() {
        return new TensorList([...this.tensors], this.elementShape, this.elementDtype);
    }
    /**
     * Dispose the tensors and idTensor and clear the tensor list.
     */
    clearAndClose(keepIds) {
        this.tensors.forEach(tensor => {
            if (keepIds == null || !keepIds.has(tensor.id)) {
                tensor.dispose();
            }
        });
        this.tensors.length = 0;
        this.idTensor.dispose();
    }
    /**
     * The size of the tensors in the tensor list.
     */
    size() {
        return this.tensors.length;
    }
    /**
     * Return a tensor that stacks a list of rank-R tf.Tensors into one rank-(R+1)
     * tf.Tensor.
     * @param elementShape shape of each tensor
     * @param elementDtype data type of each tensor
     * @param numElements the number of elements to stack
     */
    stack(elementShape, elementDtype, numElements = -1) {
        if (elementDtype !== this.elementDtype) {
            throw new Error(`Invalid data types; op elements ${elementDtype}, but list elements ${this.elementDtype}`);
        }
        if (numElements !== -1 && this.tensors.length !== numElements) {
            throw new Error(`Operation expected a list with ${numElements} elements but got a list with ${this.tensors.length} elements.`);
        }
        assertShapesMatchAllowUndefinedSize(elementShape, this.elementShape, 'TensorList shape mismatch: ');
        const outputElementShape = inferElementShape(this.elementShape, this.tensors, elementShape);
        return tidy(() => {
            const reshapedTensors = this.tensors.map(tensor => reshape(tensor, outputElementShape));
            return stack(reshapedTensors, 0);
        });
    }
    /**
     * Pop a tensor from the end of the list.
     * @param elementShape shape of the tensor
     * @param elementDtype data type of the tensor
     */
    popBack(elementShape, elementDtype) {
        if (elementDtype !== this.elementDtype) {
            throw new Error(`Invalid data types; op elements ${elementDtype}, but list elements ${this.elementDtype}`);
        }
        if (this.size() === 0) {
            throw new Error('Trying to pop from an empty list.');
        }
        const outputElementShape = inferElementShape(this.elementShape, this.tensors, elementShape);
        const tensor = this.tensors.pop();
        tensor.kept = false;
        assertShapesMatchAllowUndefinedSize(tensor.shape, elementShape, 'TensorList shape mismatch: ');
        return reshape(tensor, outputElementShape);
    }
    /**
     * Push a tensor to the end of the list.
     * @param tensor Tensor to be pushed.
     */
    pushBack(tensor) {
        if (tensor.dtype !== this.elementDtype) {
            throw new Error(`Invalid data types; op elements ${tensor.dtype}, but list elements ${this.elementDtype}`);
        }
        assertShapesMatchAllowUndefinedSize(tensor.shape, this.elementShape, 'TensorList shape mismatch: ');
        if (this.maxNumElements === this.size()) {
            throw new Error(`Trying to push element into a full list.`);
        }
        keep(tensor);
        this.tensors.push(tensor);
    }
    /**
     * Update the size of the list.
     * @param size the new size of the list.
     */
    resize(size) {
        if (size < 0) {
            throw new Error(`TensorListResize expects size to be non-negative. Got: ${size}`);
        }
        if (this.maxNumElements !== -1 && size > this.maxNumElements) {
            throw new Error(`TensorListResize input size ${size} is greater maxNumElement ${this.maxNumElements}.`);
        }
        const destTensorList = new TensorList([], this.elementShape, this.elementDtype, this.maxNumElements);
        destTensorList.tensors.length = size;
        for (let i = 0; i < Math.min(this.tensors.length, size); ++i) {
            destTensorList.tensors[i] = this.tensors[i];
        }
        return destTensorList;
    }
    /**
     * Retrieve the element at the provided index
     * @param elementShape shape of the tensor
     * @param elementDtype dtype of the tensor
     * @param elementIndex index of the tensor
     */
    getItem(elementIndex, elementShape, elementDtype) {
        if (elementDtype !== this.elementDtype) {
            throw new Error(`Invalid data types; op elements ${elementDtype}, but list elements ${this.elementDtype}`);
        }
        if (elementIndex < 0 || elementIndex > this.tensors.length) {
            throw new Error(`Trying to access element ${elementIndex} in a list with ${this.tensors.length} elements.`);
        }
        if (this.tensors[elementIndex] == null) {
            throw new Error(`element at index ${elementIndex} is null.`);
        }
        assertShapesMatchAllowUndefinedSize(this.tensors[elementIndex].shape, elementShape, 'TensorList shape mismatch: ');
        const outputElementShape = inferElementShape(this.elementShape, this.tensors, elementShape);
        return reshape(this.tensors[elementIndex], outputElementShape);
    }
    /**
     * Set the tensor at the index
     * @param elementIndex index of the tensor
     * @param tensor the tensor to be inserted into the list
     */
    setItem(elementIndex, tensor) {
        if (tensor.dtype !== this.elementDtype) {
            throw new Error(`Invalid data types; op elements ${tensor.dtype}, but list elements ${this.elementDtype}`);
        }
        if (elementIndex < 0 ||
            this.maxNumElements !== -1 && elementIndex >= this.maxNumElements) {
            throw new Error(`Trying to set element ${elementIndex} in a list with max ${this.maxNumElements} elements.`);
        }
        assertShapesMatchAllowUndefinedSize(this.elementShape, tensor.shape, 'TensorList shape mismatch: ');
        keep(tensor);
        // dispose the previous value if it is replacing.
        if (this.tensors[elementIndex] != null) {
            this.tensors[elementIndex].kept = false;
        }
        this.tensors[elementIndex] = tensor;
    }
    /**
     * Return selected values in the TensorList as a stacked Tensor. All of
     * selected values must have been written and their shapes must all match.
     * @param indices indices of tensors to gather
     * @param elementDtype output tensor dtype
     * @param elementShape output tensor element shape
     */
    gather(indices, elementDtype, elementShape) {
        if (elementDtype !== this.elementDtype) {
            throw new Error(`Invalid data types; op elements ${elementDtype}, but list elements ${this.elementDtype}`);
        }
        assertShapesMatchAllowUndefinedSize(this.elementShape, elementShape, 'TensorList shape mismatch: ');
        // When indices is greater than the size of the list, indices beyond the
        // size of the list are ignored.
        indices = indices.slice(0, this.size());
        const outputElementShape = inferElementShape(this.elementShape, this.tensors, elementShape);
        if (indices.length === 0) {
            return tensor([], [0].concat(outputElementShape));
        }
        return tidy(() => {
            const tensors = indices.map(i => reshape(this.tensors[i], outputElementShape));
            return stack(tensors, 0);
        });
    }
    /**
     * Return the values in the TensorList as a concatenated Tensor.
     * @param elementDtype output tensor dtype
     * @param elementShape output tensor element shape
     */
    concat(elementDtype, elementShape) {
        if (!!elementDtype && elementDtype !== this.elementDtype) {
            throw new Error(`TensorList dtype is ${this.elementDtype} but concat requested dtype ${elementDtype}`);
        }
        assertShapesMatchAllowUndefinedSize(this.elementShape, elementShape, 'TensorList shape mismatch: ');
        const outputElementShape = inferElementShape(this.elementShape, this.tensors, elementShape);
        if (this.size() === 0) {
            return tensor([], [0].concat(outputElementShape));
        }
        return tidy(() => {
            const tensors = this.tensors.map(t => reshape(t, outputElementShape));
            return concat(tensors, 0);
        });
    }
}
/**
 * Creates a TensorList which, when stacked, has the value of tensor.
 * @param tensor from tensor
 * @param elementShape output tensor element shape
 */
export function fromTensor(tensor, elementShape, elementDtype) {
    const dtype = tensor.dtype;
    if (tensor.shape.length < 1) {
        throw new Error(`Tensor must be at least a vector, but saw shape: ${tensor.shape}`);
    }
    if (tensor.dtype !== elementDtype) {
        throw new Error(`Invalid data types; op elements ${tensor.dtype}, but list elements ${elementDtype}`);
    }
    const tensorElementShape = tensor.shape.slice(1);
    assertShapesMatchAllowUndefinedSize(tensorElementShape, elementShape, 'TensorList shape mismatch: ');
    const tensorList = unstack(tensor);
    return new TensorList(tensorList, elementShape, dtype);
}
/**
 * Return a TensorList of the given size with empty elements.
 * @param elementShape the shape of the future elements of the list
 * @param elementDtype the desired type of elements in the list
 * @param numElements the number of elements to reserve
 * @param maxNumElements the maximum number of elements in th list
 */
export function reserve(elementShape, elementDtype, numElements, maxNumElements) {
    return new TensorList([], elementShape, elementDtype, maxNumElements);
}
/**
 * Put tensors at specific indices of a stacked tensor into a TensorList.
 * @param indices list of indices on how to scatter the tensor.
 * @param tensor input tensor.
 * @param elementShape the shape of the future elements of the list
 * @param numElements the number of elements to scatter
 */
export function scatter(tensor, indices, elementShape, numElements) {
    if (indices.length !== tensor.shape[0]) {
        throw new Error(`Expected len(indices) == tensor.shape[0], but saw: ${indices.length} vs. ${tensor.shape[0]}`);
    }
    const maxIndex = Math.max(...indices);
    if (numElements != null && numElements !== -1 && maxIndex >= numElements) {
        throw new Error(`Max index must be < array size (${maxIndex}  vs. ${numElements})`);
    }
    const list = new TensorList([], elementShape, tensor.dtype, numElements);
    const tensors = unstack(tensor, 0);
    indices.forEach((value, index) => {
        list.setItem(value, tensors[index]);
    });
    return list;
}
/**
 * Split the values of a Tensor into a TensorList.
 * @param length the lengths to use when splitting value along
 *    its first dimension.
 * @param tensor the tensor to split.
 * @param elementShape the shape of the future elements of the list
 */
export function split(tensor, length, elementShape) {
    let totalLength = 0;
    const cumulativeLengths = length.map(len => {
        totalLength += len;
        return totalLength;
    });
    if (totalLength !== tensor.shape[0]) {
        throw new Error(`Expected sum of lengths to be equal to
          tensor.shape[0], but sum of lengths is
        ${totalLength}, and tensor's shape is: ${tensor.shape}`);
    }
    const shapeWithoutFirstDim = tensor.shape.slice(1);
    const outputElementShape = mergeElementShape(shapeWithoutFirstDim, elementShape);
    const elementPerRow = totalLength === 0 ? 0 : tensor.size / totalLength;
    const tensors = tidy(() => {
        const tensors = [];
        tensor = reshape(tensor, [1, totalLength, elementPerRow]);
        for (let i = 0; i < length.length; ++i) {
            const previousLength = (i === 0) ? 0 : cumulativeLengths[i - 1];
            const indices = [0, previousLength, 0];
            const sizes = [1, length[i], elementPerRow];
            tensors[i] = reshape(slice(tensor, indices, sizes), outputElementShape);
        }
        tensor.dispose();
        return tensors;
    });
    const list = new TensorList([], elementShape, tensor.dtype, length.length);
    for (let i = 0; i < tensors.length; i++) {
        list.setItem(i, tensors[i]);
    }
    return list;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVuc29yX2xpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvbnZlcnRlci9zcmMvZXhlY3V0b3IvdGVuc29yX2xpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBWSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFM0gsT0FBTyxFQUFDLG1DQUFtQyxFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFekc7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUVILE1BQU0sT0FBTyxVQUFVO0lBT3JCOzs7Ozs7OztPQVFHO0lBQ0gsWUFDYSxPQUFpQixFQUFXLFlBQTZCLEVBQ3pELFlBQXNCLEVBQUUsY0FBYyxHQUFHLENBQUMsQ0FBQztRQUQzQyxZQUFPLEdBQVAsT0FBTyxDQUFVO1FBQVcsaUJBQVksR0FBWixZQUFZLENBQWlCO1FBQ3pELGlCQUFZLEdBQVosWUFBWSxDQUFVO1FBQ2pDLElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtZQUNuQixPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN2QixJQUFJLFlBQVksS0FBSyxNQUFNLENBQUMsS0FBSyxFQUFFO29CQUNqQyxNQUFNLElBQUksS0FBSyxDQUFDLG1DQUNaLFlBQVksdUJBQXVCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2lCQUN4RDtnQkFDRCxtQ0FBbUMsQ0FDL0IsWUFBWSxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztnQkFFL0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUNELElBQUks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SUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDN0I7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7Y29uY2F0LCBEYXRhVHlwZSwga2VlcCwgcmVzaGFwZSwgc2NhbGFyLCBzbGljZSwgc3RhY2ssIFRlbnNvciwgdGVuc29yLCB0aWR5LCB1bnN0YWNrfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge2Fzc2VydFNoYXBlc01hdGNoQWxsb3dVbmRlZmluZWRTaXplLCBpbmZlckVsZW1lbnRTaGFwZSwgbWVyZ2VFbGVtZW50U2hhcGV9IGZyb20gJy4vdGVuc29yX3V0aWxzJztcblxuLyoqXG4gKiBUZW5zb3JMaXN0IHN0b3JlcyBhIGNvbnRhaW5lciBvZiBgdGYuVGVuc29yYCBvYmplY3RzLCB3aGljaCBhcmUgYWNjZXNzaWJsZVxuICogdmlhIHRlbnNvcnMgZmllbGQuXG4gKlxuICogSW4gb3JkZXIgdG8gZ2V0IGEgY29weSBvZiB0aGUgdW5kZXJseWluZyBsaXN0LCB1c2UgdGhlIGNvcHkgbWV0aG9kOlxuICogYGBgXG4gKiAgICBUZW5zb3JMaXN0IGIgPSBhLmNvcHkoKTtcbiAqICAgIGIudGVuc29ycygpLnB1c2hCYWNrKHQpOyAgLy8gVGhpcyBkb2VzIG5vdCBtb2RpZnkgYS50ZW5zb3JzKCkuXG4gKiBgYGBcbiAqXG4gKiBOb3RlIHRoYXQgdGhpcyBpcyBub3QgYSBkZWVwIGNvcHk6IHRoZSBtZW1vcnkgbG9jYXRpb25zIG9mIHRoZSB1bmRlcmx5aW5nXG4gKiB0ZW5zb3JzIHdpbGwgc3RpbGwgcG9pbnQgdG8gdGhlIHNhbWUgbG9jYXRpb25zIG9mIHRoZSBjb3JyZXNwb25kaW5nIHRlbnNvcnNcbiAqIGluIHRoZSBvcmlnaW5hbC5cbiAqL1xuXG5leHBvcnQgY2xhc3MgVGVuc29yTGlzdCB7XG4gIHJlYWRvbmx5IGlkVGVuc29yOiBUZW5zb3I7XG4gIG1heE51bUVsZW1lbnRzOiBudW1iZXI7XG5cbiAgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLmlkVGVuc29yLmlkO1xuICB9XG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gdGVuc29ycyBsaXN0IG9mIHRlbnNvcnNcbiAgICogQHBhcmFtIGVsZW1lbnRTaGFwZSBzaGFwZSBvZiBlYWNoIHRlbnNvciwgdGhpcyBjYW4gYmUgYSBzaW5nbGUgbnVtYmVyIChhbnlcbiAgICogc2hhcGUgaXMgYWxsb3dlZCkgb3IgcGFydGlhbCBzaGFwZSAoZGltID0gLTEpLlxuICAgKiBAcGFyYW0gZWxlbWVudER0eXBlIGRhdGEgdHlwZSBvZiBlYWNoIHRlbnNvclxuICAgKiBAcGFyYW0gbWF4TnVtRWxlbWVudHMgVGhlIG1heGltdW0gYWxsb3dlZCBzaXplIG9mIGB0ZW5zb3JzYC4gRGVmYXVsdHMgdG8gLTFcbiAgICogICBtZWFuaW5nIHRoYXQgdGhlIHNpemUgb2YgYHRlbnNvcnNgIGlzIHVuYm91bmRlZC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcmVhZG9ubHkgdGVuc29yczogVGVuc29yW10sIHJlYWRvbmx5IGVsZW1lbnRTaGFwZTogbnVtYmVyfG51bWJlcltdLFxuICAgICAgcmVhZG9ubHkgZWxlbWVudER0eXBlOiBEYXRhVHlwZSwgbWF4TnVtRWxlbWVudHMgPSAtMSkge1xuICAgIGlmICh0ZW5zb3JzICE9IG51bGwpIHtcbiAgICAgIHRlbnNvcnMuZm9yRWFjaCh0ZW5zb3IgPT4ge1xuICAgICAgICBpZiAoZWxlbWVudER0eXBlICE9PSB0ZW5zb3IuZHR5cGUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgZGF0YSB0eXBlczsgb3AgZWxlbWVudHMgJHtcbiAgICAgICAgICAgICAgZWxlbWVudER0eXBlfSwgYnV0IGxpc3QgZWxlbWVudHMgJHt0ZW5zb3IuZHR5cGV9YCk7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0U2hhcGVzTWF0Y2hBbGxvd1VuZGVmaW5lZFNpemUoXG4gICAgICAgICAgICBlbGVtZW50U2hhcGUsIHRlbnNvci5zaGFwZSwgJ1RlbnNvckxpc3Qgc2hhcGUgbWlzbWF0Y2g6ICcpO1xuXG4gICAgICAgIGtlZXAodGVuc29yKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLmlkVGVuc29yID0gc2NhbGFyKDApO1xuICAgIHRoaXMubWF4TnVtRWxlbWVudHMgPSBtYXhOdW1FbGVtZW50cztcbiAgICBrZWVwKHRoaXMuaWRUZW5zb3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIG5ldyBUZW5zb3JMaXN0IGNvbnRhaW5pbmcgYSBjb3B5IG9mIHRoZSB1bmRlcmx5aW5nIHRlbnNvciBjb250YWluZXIuXG4gICAqL1xuICBjb3B5KCk6IFRlbnNvckxpc3Qge1xuICAgIHJldHVybiBuZXcgVGVuc29yTGlzdChcbiAgICAgICAgWy4uLnRoaXMudGVuc29yc10sIHRoaXMuZWxlbWVudFNoYXBlLCB0aGlzLmVsZW1lbnREdHlwZSk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcG9zZSB0aGUgdGVuc29ycyBhbmQgaWRUZW5zb3IgYW5kIGNsZWFyIHRoZSB0ZW5zb3IgbGlzdC5cbiAgICovXG4gIGNsZWFyQW5kQ2xvc2Uoa2VlcElkcz86IFNldDxudW1iZXI+KSB7XG4gICAgdGhpcy50ZW5zb3JzLmZvckVhY2godGVuc29yID0+IHtcbiAgICAgIGlmIChrZWVwSWRzID09IG51bGwgfHwgIWtlZXBJZHMuaGFzKHRlbnNvci5pZCkpIHtcbiAgICAgICAgdGVuc29yLmRpc3Bvc2UoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnRlbnNvcnMubGVuZ3RoID0gMDtcbiAgICB0aGlzLmlkVGVuc29yLmRpc3Bvc2UoKTtcbiAgfVxuICAvKipcbiAgICogVGhlIHNpemUgb2YgdGhlIHRlbnNvcnMgaW4gdGhlIHRlbnNvciBsaXN0LlxuICAgKi9cbiAgc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy50ZW5zb3JzLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSB0ZW5zb3IgdGhhdCBzdGFja3MgYSBsaXN0IG9mIHJhbmstUiB0Zi5UZW5zb3JzIGludG8gb25lIHJhbmstKFIrMSlcbiAgICogdGYuVGVuc29yLlxuICAgKiBAcGFyYW0gZWxlbWVudFNoYXBlIHNoYXBlIG9mIGVhY2ggdGVuc29yXG4gICAqIEBwYXJhbSBlbGVtZW50RHR5cGUgZGF0YSB0eXBlIG9mIGVhY2ggdGVuc29yXG4gICAqIEBwYXJhbSBudW1FbGVtZW50cyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIHN0YWNrXG4gICAqL1xuICBzdGFjayhlbGVtZW50U2hhcGU6IG51bWJlcltdLCBlbGVtZW50RHR5cGU6IERhdGFUeXBlLCBudW1FbGVtZW50cyA9IC0xKTpcbiAgICAgIFRlbnNvciB7XG4gICAgaWYgKGVsZW1lbnREdHlwZSAhPT0gdGhpcy5lbGVtZW50RHR5cGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBkYXRhIHR5cGVzOyBvcCBlbGVtZW50cyAke1xuICAgICAgICAgIGVsZW1lbnREdHlwZX0sIGJ1dCBsaXN0IGVsZW1lbnRzICR7dGhpcy5lbGVtZW50RHR5cGV9YCk7XG4gICAgfVxuICAgIGlmIChudW1FbGVtZW50cyAhPT0gLTEgJiYgdGhpcy50ZW5zb3JzLmxlbmd0aCAhPT0gbnVtRWxlbWVudHMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgT3BlcmF0aW9uIGV4cGVjdGVkIGEgbGlzdCB3aXRoICR7XG4gICAgICAgICAgbnVtRWxlbWVudHN9IGVsZW1lbnRzIGJ1dCBnb3QgYSBsaXN0IHdpdGggJHtcbiAgICAgICAgICB0aGlzLnRlbnNvcnMubGVuZ3RofSBlbGVtZW50cy5gKTtcbiAgICB9XG4gICAgYXNzZXJ0U2hhcGVzTWF0Y2hBbGxvd1VuZGVmaW5lZFNpemUoXG4gICAgICAgIGVsZW1lbnRTaGFwZSwgdGhpcy5lbGVtZW50U2hhcGUsICdUZW5zb3JMaXN0IHNoYXBlIG1pc21hdGNoOiAnKTtcbiAgICBjb25zdCBvdXRwdXRFbGVtZW50U2hhcGUgPVxuICAgICAgICBpbmZlckVsZW1lbnRTaGFwZSh0aGlzLmVsZW1lbnRTaGFwZSwgdGhpcy50ZW5zb3JzLCBlbGVtZW50U2hhcGUpO1xuICAgIHJldHVybiB0aWR5KCgpID0+IHtcbiAgICAgIGNvbnN0IHJlc2hhcGVkVGVuc29ycyA9XG4gICAgICAgICAgdGhpcy50ZW5zb3JzLm1hcCh0ZW5zb3IgPT4gcmVzaGFwZSh0ZW5zb3IsIG91dHB1dEVsZW1lbnRTaGFwZSkpO1xuICAgICAgcmV0dXJuIHN0YWNrKHJlc2hhcGVkVGVuc29ycywgMCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUG9wIGEgdGVuc29yIGZyb20gdGhlIGVuZCBvZiB0aGUgbGlzdC5cbiAgICogQHBhcmFtIGVsZW1lbnRTaGFwZSBzaGFwZSBvZiB0aGUgdGVuc29yXG4gICAqIEBwYXJhbSBlbGVtZW50RHR5cGUgZGF0YSB0eXBlIG9mIHRoZSB0ZW5zb3JcbiAgICovXG4gIHBvcEJhY2soZWxlbWVudFNoYXBlOiBudW1iZXJbXSwgZWxlbWVudER0eXBlOiBEYXRhVHlwZSk6IFRlbnNvciB7XG4gICAgaWYgKGVsZW1lbnREdHlwZSAhPT0gdGhpcy5lbGVtZW50RHR5cGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBkYXRhIHR5cGVzOyBvcCBlbGVtZW50cyAke1xuICAgICAgICAgIGVsZW1lbnREdHlwZX0sIGJ1dCBsaXN0IGVsZW1lbnRzICR7dGhpcy5lbGVtZW50RHR5cGV9YCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2l6ZSgpID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyeWluZyB0byBwb3AgZnJvbSBhbiBlbXB0eSBsaXN0LicpO1xuICAgIH1cbiAgICBjb25zdCBvdXRwdXRFbGVtZW50U2hhcGUgPVxuICAgICAgICBpbmZlckVsZW1lbnRTaGFwZSh0aGlzLmVsZW1lbnRTaGFwZSwgdGhpcy50ZW5zb3JzLCBlbGVtZW50U2hhcGUpO1xuICAgIGNvbnN0IHRlbnNvciA9IHRoaXMudGVuc29ycy5wb3AoKTtcbiAgICB0ZW5zb3Iua2VwdCA9IGZhbHNlO1xuXG4gICAgYXNzZXJ0U2hhcGVzTWF0Y2hBbGxvd1VuZGVmaW5lZFNpemUoXG4gICAgICAgIHRlbnNvci5zaGFwZSwgZWxlbWVudFNoYXBlLCAnVGVuc29yTGlzdCBzaGFwZSBtaXNtYXRjaDogJyk7XG5cbiAgICByZXR1cm4gcmVzaGFwZSh0ZW5zb3IsIG91dHB1dEVsZW1lbnRTaGFwZSk7XG4gIH1cblxuICAvKipcbiAgICogUHVzaCBhIHRlbnNvciB0byB0aGUgZW5kIG9mIHRoZSBsaXN0LlxuICAgKiBAcGFyYW0gdGVuc29yIFRlbnNvciB0byBiZSBwdXNoZWQuXG4gICAqL1xuICBwdXNoQmFjayh0ZW5zb3I6IFRlbnNvcikge1xuICAgIGlmICh0ZW5zb3IuZHR5cGUgIT09IHRoaXMuZWxlbWVudER0eXBlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgZGF0YSB0eXBlczsgb3AgZWxlbWVudHMgJHtcbiAgICAgICAgICB0ZW5zb3IuZHR5cGV9LCBidXQgbGlzdCBlbGVtZW50cyAke3RoaXMuZWxlbWVudER0eXBlfWApO1xuICAgIH1cblxuICAgIGFzc2VydFNoYXBlc01hdGNoQWxsb3dVbmRlZmluZWRTaXplKFxuICAgICAgICB0ZW5zb3Iuc2hhcGUsIHRoaXMuZWxlbWVudFNoYXBlLCAnVGVuc29yTGlzdCBzaGFwZSBtaXNtYXRjaDogJyk7XG5cbiAgICBpZiAodGhpcy5tYXhOdW1FbGVtZW50cyA9PT0gdGhpcy5zaXplKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVHJ5aW5nIHRvIHB1c2ggZWxlbWVudCBpbnRvIGEgZnVsbCBsaXN0LmApO1xuICAgIH1cbiAgICBrZWVwKHRlbnNvcik7XG4gICAgdGhpcy50ZW5zb3JzLnB1c2godGVuc29yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIHNpemUgb2YgdGhlIGxpc3QuXG4gICAqIEBwYXJhbSBzaXplIHRoZSBuZXcgc2l6ZSBvZiB0aGUgbGlzdC5cbiAgICovXG4gIHJlc2l6ZShzaXplOiBudW1iZXIpIHtcbiAgICBpZiAoc2l6ZSA8IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgVGVuc29yTGlzdFJlc2l6ZSBleHBlY3RzIHNpemUgdG8gYmUgbm9uLW5lZ2F0aXZlLiBHb3Q6ICR7c2l6ZX1gKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tYXhOdW1FbGVtZW50cyAhPT0gLTEgJiYgc2l6ZSA+IHRoaXMubWF4TnVtRWxlbWVudHMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGVuc29yTGlzdFJlc2l6ZSBpbnB1dCBzaXplICR7XG4gICAgICAgICAgc2l6ZX0gaXMgZ3JlYXRlciBtYXhOdW1FbGVtZW50ICR7dGhpcy5tYXhOdW1FbGVtZW50c30uYCk7XG4gICAgfVxuXG4gICAgY29uc3QgZGVzdFRlbnNvckxpc3Q6IFRlbnNvckxpc3QgPSBuZXcgVGVuc29yTGlzdChcbiAgICAgICAgW10sIHRoaXMuZWxlbWVudFNoYXBlLCB0aGlzLmVsZW1lbnREdHlwZSwgdGhpcy5tYXhOdW1FbGVtZW50cyk7XG4gICAgZGVzdFRlbnNvckxpc3QudGVuc29ycy5sZW5ndGggPSBzaXplO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5taW4odGhpcy50ZW5zb3JzLmxlbmd0aCwgc2l6ZSk7ICsraSkge1xuICAgICAgZGVzdFRlbnNvckxpc3QudGVuc29yc1tpXSA9IHRoaXMudGVuc29yc1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIGRlc3RUZW5zb3JMaXN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIHRoZSBlbGVtZW50IGF0IHRoZSBwcm92aWRlZCBpbmRleFxuICAgKiBAcGFyYW0gZWxlbWVudFNoYXBlIHNoYXBlIG9mIHRoZSB0ZW5zb3JcbiAgICogQHBhcmFtIGVsZW1lbnREdHlwZSBkdHlwZSBvZiB0aGUgdGVuc29yXG4gICAqIEBwYXJhbSBlbGVtZW50SW5kZXggaW5kZXggb2YgdGhlIHRlbnNvclxuICAgKi9cbiAgZ2V0SXRlbShlbGVtZW50SW5kZXg6IG51bWJlciwgZWxlbWVudFNoYXBlOiBudW1iZXJbXSwgZWxlbWVudER0eXBlOiBEYXRhVHlwZSk6XG4gICAgICBUZW5zb3Ige1xuICAgIGlmIChlbGVtZW50RHR5cGUgIT09IHRoaXMuZWxlbWVudER0eXBlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgZGF0YSB0eXBlczsgb3AgZWxlbWVudHMgJHtcbiAgICAgICAgICBlbGVtZW50RHR5cGV9LCBidXQgbGlzdCBlbGVtZW50cyAke3RoaXMuZWxlbWVudER0eXBlfWApO1xuICAgIH1cbiAgICBpZiAoZWxlbWVudEluZGV4IDwgMCB8fCBlbGVtZW50SW5kZXggPiB0aGlzLnRlbnNvcnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRyeWluZyB0byBhY2Nlc3MgZWxlbWVudCAke1xuICAgICAgICAgIGVsZW1lbnRJbmRleH0gaW4gYSBsaXN0IHdpdGggJHt0aGlzLnRlbnNvcnMubGVuZ3RofSBlbGVtZW50cy5gKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy50ZW5zb3JzW2VsZW1lbnRJbmRleF0gPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBlbGVtZW50IGF0IGluZGV4ICR7ZWxlbWVudEluZGV4fSBpcyBudWxsLmApO1xuICAgIH1cblxuICAgIGFzc2VydFNoYXBlc01hdGNoQWxsb3dVbmRlZmluZWRTaXplKFxuICAgICAgICB0aGlzLnRlbnNvcnNbZWxlbWVudEluZGV4XS5zaGFwZSwgZWxlbWVudFNoYXBlLFxuICAgICAgICAnVGVuc29yTGlzdCBzaGFwZSBtaXNtYXRjaDogJyk7XG4gICAgY29uc3Qgb3V0cHV0RWxlbWVudFNoYXBlID1cbiAgICAgICAgaW5mZXJFbGVtZW50U2hhcGUodGhpcy5lbGVtZW50U2hhcGUsIHRoaXMudGVuc29ycywgZWxlbWVudFNoYXBlKTtcbiAgICByZXR1cm4gcmVzaGFwZSh0aGlzLnRlbnNvcnNbZWxlbWVudEluZGV4XSwgb3V0cHV0RWxlbWVudFNoYXBlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHRlbnNvciBhdCB0aGUgaW5kZXhcbiAgICogQHBhcmFtIGVsZW1lbnRJbmRleCBpbmRleCBvZiB0aGUgdGVuc29yXG4gICAqIEBwYXJhbSB0ZW5zb3IgdGhlIHRlbnNvciB0byBiZSBpbnNlcnRlZCBpbnRvIHRoZSBsaXN0XG4gICAqL1xuICBzZXRJdGVtKGVsZW1lbnRJbmRleDogbnVtYmVyLCB0ZW5zb3I6IFRlbnNvcikge1xuICAgIGlmICh0ZW5zb3IuZHR5cGUgIT09IHRoaXMuZWxlbWVudER0eXBlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgZGF0YSB0eXBlczsgb3AgZWxlbWVudHMgJHtcbiAgICAgICAgICB0ZW5zb3IuZHR5cGV9LCBidXQgbGlzdCBlbGVtZW50cyAke3RoaXMuZWxlbWVudER0eXBlfWApO1xuICAgIH1cblxuICAgIGlmIChlbGVtZW50SW5kZXggPCAwIHx8XG4gICAgICAgIHRoaXMubWF4TnVtRWxlbWVudHMgIT09IC0xICYmIGVsZW1lbnRJbmRleCA+PSB0aGlzLm1heE51bUVsZW1lbnRzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRyeWluZyB0byBzZXQgZWxlbWVudCAke1xuICAgICAgICAgIGVsZW1lbnRJbmRleH0gaW4gYSBsaXN0IHdpdGggbWF4ICR7dGhpcy5tYXhOdW1FbGVtZW50c30gZWxlbWVudHMuYCk7XG4gICAgfVxuXG4gICAgYXNzZXJ0U2hhcGVzTWF0Y2hBbGxvd1VuZGVmaW5lZFNpemUoXG4gICAgICAgIHRoaXMuZWxlbWVudFNoYXBlLCB0ZW5zb3Iuc2hhcGUsICdUZW5zb3JMaXN0IHNoYXBlIG1pc21hdGNoOiAnKTtcbiAgICBrZWVwKHRlbnNvcik7XG5cbiAgICAvLyBkaXNwb3NlIHRoZSBwcmV2aW91cyB2YWx1ZSBpZiBpdCBpcyByZXBsYWNpbmcuXG4gICAgaWYgKHRoaXMudGVuc29yc1tlbGVtZW50SW5kZXhdICE9IG51bGwpIHtcbiAgICAgIHRoaXMudGVuc29yc1tlbGVtZW50SW5kZXhdLmtlcHQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLnRlbnNvcnNbZWxlbWVudEluZGV4XSA9IHRlbnNvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gc2VsZWN0ZWQgdmFsdWVzIGluIHRoZSBUZW5zb3JMaXN0IGFzIGEgc3RhY2tlZCBUZW5zb3IuIEFsbCBvZlxuICAgKiBzZWxlY3RlZCB2YWx1ZXMgbXVzdCBoYXZlIGJlZW4gd3JpdHRlbiBhbmQgdGhlaXIgc2hhcGVzIG11c3QgYWxsIG1hdGNoLlxuICAgKiBAcGFyYW0gaW5kaWNlcyBpbmRpY2VzIG9mIHRlbnNvcnMgdG8gZ2F0aGVyXG4gICAqIEBwYXJhbSBlbGVtZW50RHR5cGUgb3V0cHV0IHRlbnNvciBkdHlwZVxuICAgKiBAcGFyYW0gZWxlbWVudFNoYXBlIG91dHB1dCB0ZW5zb3IgZWxlbWVudCBzaGFwZVxuICAgKi9cbiAgZ2F0aGVyKGluZGljZXM6IG51bWJlcltdLCBlbGVtZW50RHR5cGU6IERhdGFUeXBlLCBlbGVtZW50U2hhcGU6IG51bWJlcltdKTpcbiAgICAgIFRlbnNvciB7XG4gICAgaWYgKGVsZW1lbnREdHlwZSAhPT0gdGhpcy5lbGVtZW50RHR5cGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBkYXRhIHR5cGVzOyBvcCBlbGVtZW50cyAke1xuICAgICAgICAgIGVsZW1lbnREdHlwZX0sIGJ1dCBsaXN0IGVsZW1lbnRzICR7dGhpcy5lbGVtZW50RHR5cGV9YCk7XG4gICAgfVxuXG4gICAgYXNzZXJ0U2hhcGVzTWF0Y2hBbGxvd1VuZGVmaW5lZFNpemUoXG4gICAgICAgIHRoaXMuZWxlbWVudFNoYXBlLCBlbGVtZW50U2hhcGUsICdUZW5zb3JMaXN0IHNoYXBlIG1pc21hdGNoOiAnKTtcblxuICAgIC8vIFdoZW4gaW5kaWNlcyBpcyBncmVhdGVyIHRoYW4gdGhlIHNpemUgb2YgdGhlIGxpc3QsIGluZGljZXMgYmV5b25kIHRoZVxuICAgIC8vIHNpemUgb2YgdGhlIGxpc3QgYXJlIGlnbm9yZWQuXG4gICAgaW5kaWNlcyA9IGluZGljZXMuc2xpY2UoMCwgdGhpcy5zaXplKCkpO1xuICAgIGNvbnN0IG91dHB1dEVsZW1lbnRTaGFwZSA9XG4gICAgICAgIGluZmVyRWxlbWVudFNoYXBlKHRoaXMuZWxlbWVudFNoYXBlLCB0aGlzLnRlbnNvcnMsIGVsZW1lbnRTaGFwZSk7XG4gICAgaWYgKGluZGljZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGVuc29yKFtdLCBbMF0uY29uY2F0KG91dHB1dEVsZW1lbnRTaGFwZSkpO1xuICAgIH1cblxuICAgIHJldHVybiB0aWR5KCgpID0+IHtcbiAgICAgIGNvbnN0IHRlbnNvcnMgPVxuICAgICAgICAgIGluZGljZXMubWFwKGkgPT4gcmVzaGFwZSh0aGlzLnRlbnNvcnNbaV0sIG91dHB1dEVsZW1lbnRTaGFwZSkpO1xuICAgICAgcmV0dXJuIHN0YWNrKHRlbnNvcnMsIDApO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdmFsdWVzIGluIHRoZSBUZW5zb3JMaXN0IGFzIGEgY29uY2F0ZW5hdGVkIFRlbnNvci5cbiAgICogQHBhcmFtIGVsZW1lbnREdHlwZSBvdXRwdXQgdGVuc29yIGR0eXBlXG4gICAqIEBwYXJhbSBlbGVtZW50U2hhcGUgb3V0cHV0IHRlbnNvciBlbGVtZW50IHNoYXBlXG4gICAqL1xuICBjb25jYXQoZWxlbWVudER0eXBlOiBEYXRhVHlwZSwgZWxlbWVudFNoYXBlOiBudW1iZXJbXSk6IFRlbnNvciB7XG4gICAgaWYgKCEhZWxlbWVudER0eXBlICYmIGVsZW1lbnREdHlwZSAhPT0gdGhpcy5lbGVtZW50RHR5cGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGVuc29yTGlzdCBkdHlwZSBpcyAke1xuICAgICAgICAgIHRoaXMuZWxlbWVudER0eXBlfSBidXQgY29uY2F0IHJlcXVlc3RlZCBkdHlwZSAke2VsZW1lbnREdHlwZX1gKTtcbiAgICB9XG5cbiAgICBhc3NlcnRTaGFwZXNNYXRjaEFsbG93VW5kZWZpbmVkU2l6ZShcbiAgICAgICAgdGhpcy5lbGVtZW50U2hhcGUsIGVsZW1lbnRTaGFwZSwgJ1RlbnNvckxpc3Qgc2hhcGUgbWlzbWF0Y2g6ICcpO1xuICAgIGNvbnN0IG91dHB1dEVsZW1lbnRTaGFwZSA9XG4gICAgICAgIGluZmVyRWxlbWVudFNoYXBlKHRoaXMuZWxlbWVudFNoYXBlLCB0aGlzLnRlbnNvcnMsIGVsZW1lbnRTaGFwZSk7XG5cbiAgICBpZiAodGhpcy5zaXplKCkgPT09IDApIHtcbiAgICAgIHJldHVybiB0ZW5zb3IoW10sIFswXS5jb25jYXQob3V0cHV0RWxlbWVudFNoYXBlKSk7XG4gICAgfVxuICAgIHJldHVybiB0aWR5KCgpID0+IHtcbiAgICAgIGNvbnN0IHRlbnNvcnMgPSB0aGlzLnRlbnNvcnMubWFwKHQgPT4gcmVzaGFwZSh0LCBvdXRwdXRFbGVtZW50U2hhcGUpKTtcbiAgICAgIHJldHVybiBjb25jYXQodGVuc29ycywgMCk7XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgVGVuc29yTGlzdCB3aGljaCwgd2hlbiBzdGFja2VkLCBoYXMgdGhlIHZhbHVlIG9mIHRlbnNvci5cbiAqIEBwYXJhbSB0ZW5zb3IgZnJvbSB0ZW5zb3JcbiAqIEBwYXJhbSBlbGVtZW50U2hhcGUgb3V0cHV0IHRlbnNvciBlbGVtZW50IHNoYXBlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tVGVuc29yKFxuICAgIHRlbnNvcjogVGVuc29yLCBlbGVtZW50U2hhcGU6IG51bWJlcltdLCBlbGVtZW50RHR5cGU6IERhdGFUeXBlKSB7XG4gIGNvbnN0IGR0eXBlID0gdGVuc29yLmR0eXBlO1xuICBpZiAodGVuc29yLnNoYXBlLmxlbmd0aCA8IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBUZW5zb3IgbXVzdCBiZSBhdCBsZWFzdCBhIHZlY3RvciwgYnV0IHNhdyBzaGFwZTogJHt0ZW5zb3Iuc2hhcGV9YCk7XG4gIH1cbiAgaWYgKHRlbnNvci5kdHlwZSAhPT0gZWxlbWVudER0eXBlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGRhdGEgdHlwZXM7IG9wIGVsZW1lbnRzICR7XG4gICAgICAgIHRlbnNvci5kdHlwZX0sIGJ1dCBsaXN0IGVsZW1lbnRzICR7ZWxlbWVudER0eXBlfWApO1xuICB9XG4gIGNvbnN0IHRlbnNvckVsZW1lbnRTaGFwZSA9IHRlbnNvci5zaGFwZS5zbGljZSgxKTtcbiAgYXNzZXJ0U2hhcGVzTWF0Y2hBbGxvd1VuZGVmaW5lZFNpemUoXG4gICAgICB0ZW5zb3JFbGVtZW50U2hhcGUsIGVsZW1lbnRTaGFwZSwgJ1RlbnNvckxpc3Qgc2hhcGUgbWlzbWF0Y2g6ICcpO1xuICBjb25zdCB0ZW5zb3JMaXN0OiBUZW5zb3JbXSA9IHVuc3RhY2sodGVuc29yKTtcbiAgcmV0dXJuIG5ldyBUZW5zb3JMaXN0KHRlbnNvckxpc3QsIGVsZW1lbnRTaGFwZSwgZHR5cGUpO1xufVxuXG4vKipcbiAqIFJldHVybiBhIFRlbnNvckxpc3Qgb2YgdGhlIGdpdmVuIHNpemUgd2l0aCBlbXB0eSBlbGVtZW50cy5cbiAqIEBwYXJhbSBlbGVtZW50U2hhcGUgdGhlIHNoYXBlIG9mIHRoZSBmdXR1cmUgZWxlbWVudHMgb2YgdGhlIGxpc3RcbiAqIEBwYXJhbSBlbGVtZW50RHR5cGUgdGhlIGRlc2lyZWQgdHlwZSBvZiBlbGVtZW50cyBpbiB0aGUgbGlzdFxuICogQHBhcmFtIG51bUVsZW1lbnRzIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgdG8gcmVzZXJ2ZVxuICogQHBhcmFtIG1heE51bUVsZW1lbnRzIHRoZSBtYXhpbXVtIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aCBsaXN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNlcnZlKFxuICAgIGVsZW1lbnRTaGFwZTogbnVtYmVyW10sIGVsZW1lbnREdHlwZTogRGF0YVR5cGUsIG51bUVsZW1lbnRzOiBudW1iZXIsXG4gICAgbWF4TnVtRWxlbWVudHM6IG51bWJlcikge1xuICByZXR1cm4gbmV3IFRlbnNvckxpc3QoW10sIGVsZW1lbnRTaGFwZSwgZWxlbWVudER0eXBlLCBtYXhOdW1FbGVtZW50cyk7XG59XG5cbi8qKlxuICogUHV0IHRlbnNvcnMgYXQgc3BlY2lmaWMgaW5kaWNlcyBvZiBhIHN0YWNrZWQgdGVuc29yIGludG8gYSBUZW5zb3JMaXN0LlxuICogQHBhcmFtIGluZGljZXMgbGlzdCBvZiBpbmRpY2VzIG9uIGhvdyB0byBzY2F0dGVyIHRoZSB0ZW5zb3IuXG4gKiBAcGFyYW0gdGVuc29yIGlucHV0IHRlbnNvci5cbiAqIEBwYXJhbSBlbGVtZW50U2hhcGUgdGhlIHNoYXBlIG9mIHRoZSBmdXR1cmUgZWxlbWVudHMgb2YgdGhlIGxpc3RcbiAqIEBwYXJhbSBudW1FbGVtZW50cyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIHNjYXR0ZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjYXR0ZXIoXG4gICAgdGVuc29yOiBUZW5zb3IsIGluZGljZXM6IG51bWJlcltdLCBlbGVtZW50U2hhcGU6IG51bWJlcltdLFxuICAgIG51bUVsZW1lbnRzPzogbnVtYmVyKTogVGVuc29yTGlzdCB7XG4gIGlmIChpbmRpY2VzLmxlbmd0aCAhPT0gdGVuc29yLnNoYXBlWzBdKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBsZW4oaW5kaWNlcykgPT0gdGVuc29yLnNoYXBlWzBdLCBidXQgc2F3OiAke1xuICAgICAgICBpbmRpY2VzLmxlbmd0aH0gdnMuICR7dGVuc29yLnNoYXBlWzBdfWApO1xuICB9XG5cbiAgY29uc3QgbWF4SW5kZXggPSBNYXRoLm1heCguLi5pbmRpY2VzKTtcblxuICBpZiAobnVtRWxlbWVudHMgIT0gbnVsbCAmJiBudW1FbGVtZW50cyAhPT0gLTEgJiYgbWF4SW5kZXggPj0gbnVtRWxlbWVudHMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBNYXggaW5kZXggbXVzdCBiZSA8IGFycmF5IHNpemUgKCR7bWF4SW5kZXh9ICB2cy4gJHtudW1FbGVtZW50c30pYCk7XG4gIH1cblxuICBjb25zdCBsaXN0ID0gbmV3IFRlbnNvckxpc3QoW10sIGVsZW1lbnRTaGFwZSwgdGVuc29yLmR0eXBlLCBudW1FbGVtZW50cyk7XG4gIGNvbnN0IHRlbnNvcnMgPSB1bnN0YWNrKHRlbnNvciwgMCk7XG4gIGluZGljZXMuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgbGlzdC5zZXRJdGVtKHZhbHVlLCB0ZW5zb3JzW2luZGV4XSk7XG4gIH0pO1xuICByZXR1cm4gbGlzdDtcbn1cblxuLyoqXG4gKiBTcGxpdCB0aGUgdmFsdWVzIG9mIGEgVGVuc29yIGludG8gYSBUZW5zb3JMaXN0LlxuICogQHBhcmFtIGxlbmd0aCB0aGUgbGVuZ3RocyB0byB1c2Ugd2hlbiBzcGxpdHRpbmcgdmFsdWUgYWxvbmdcbiAqICAgIGl0cyBmaXJzdCBkaW1lbnNpb24uXG4gKiBAcGFyYW0gdGVuc29yIHRoZSB0ZW5zb3IgdG8gc3BsaXQuXG4gKiBAcGFyYW0gZWxlbWVudFNoYXBlIHRoZSBzaGFwZSBvZiB0aGUgZnV0dXJlIGVsZW1lbnRzIG9mIHRoZSBsaXN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzcGxpdChcbiAgICB0ZW5zb3I6IFRlbnNvciwgbGVuZ3RoOiBudW1iZXJbXSwgZWxlbWVudFNoYXBlOiBudW1iZXJbXSkge1xuICBsZXQgdG90YWxMZW5ndGggPSAwO1xuICBjb25zdCBjdW11bGF0aXZlTGVuZ3RocyA9IGxlbmd0aC5tYXAobGVuID0+IHtcbiAgICB0b3RhbExlbmd0aCArPSBsZW47XG4gICAgcmV0dXJuIHRvdGFsTGVuZ3RoO1xuICB9KTtcblxuICBpZiAodG90YWxMZW5ndGggIT09IHRlbnNvci5zaGFwZVswXSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgc3VtIG9mIGxlbmd0aHMgdG8gYmUgZXF1YWwgdG9cbiAgICAgICAgICB0ZW5zb3Iuc2hhcGVbMF0sIGJ1dCBzdW0gb2YgbGVuZ3RocyBpc1xuICAgICAgICAke3RvdGFsTGVuZ3RofSwgYW5kIHRlbnNvcidzIHNoYXBlIGlzOiAke3RlbnNvci5zaGFwZX1gKTtcbiAgfVxuXG4gIGNvbnN0IHNoYXBlV2l0aG91dEZpcnN0RGltID0gdGVuc29yLnNoYXBlLnNsaWNlKDEpO1xuICBjb25zdCBvdXRwdXRFbGVtZW50U2hhcGUgPVxuICAgICAgbWVyZ2VFbGVtZW50U2hhcGUoc2hhcGVXaXRob3V0Rmlyc3REaW0sIGVsZW1lbnRTaGFwZSk7XG4gIGNvbnN0IGVsZW1lbnRQZXJSb3cgPSB0b3RhbExlbmd0aCA9PT0gMCA/IDAgOiB0ZW5zb3Iuc2l6ZSAvIHRvdGFsTGVuZ3RoO1xuICBjb25zdCB0ZW5zb3JzOiBUZW5zb3JbXSA9IHRpZHkoKCkgPT4ge1xuICAgIGNvbnN0IHRlbnNvcnMgPSBbXTtcbiAgICB0ZW5zb3IgPSByZXNoYXBlKHRlbnNvciwgWzEsIHRvdGFsTGVuZ3RoLCBlbGVtZW50UGVyUm93XSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGgubGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHByZXZpb3VzTGVuZ3RoID0gKGkgPT09IDApID8gMCA6IGN1bXVsYXRpdmVMZW5ndGhzW2kgLSAxXTtcbiAgICAgIGNvbnN0IGluZGljZXMgPSBbMCwgcHJldmlvdXNMZW5ndGgsIDBdO1xuICAgICAgY29uc3Qgc2l6ZXMgPSBbMSwgbGVuZ3RoW2ldLCBlbGVtZW50UGVyUm93XTtcbiAgICAgIHRlbnNvcnNbaV0gPSByZXNoYXBlKFxuICAgICAgICAgIHNsaWNlKHRlbnNvciwgaW5kaWNlcywgc2l6ZXMpLCBvdXRwdXRFbGVtZW50U2hhcGUgYXMgbnVtYmVyW10pO1xuICAgIH1cbiAgICB0ZW5zb3IuZGlzcG9zZSgpO1xuICAgIHJldHVybiB0ZW5zb3JzO1xuICB9KTtcblxuICBjb25zdCBsaXN0ID0gbmV3IFRlbnNvckxpc3QoW10sIGVsZW1lbnRTaGFwZSwgdGVuc29yLmR0eXBlLCBsZW5ndGgubGVuZ3RoKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRlbnNvcnMubGVuZ3RoOyBpKyspIHtcbiAgICBsaXN0LnNldEl0ZW0oaSwgdGVuc29yc1tpXSk7XG4gIH1cbiAgcmV0dXJuIGxpc3Q7XG59XG4iXX0=