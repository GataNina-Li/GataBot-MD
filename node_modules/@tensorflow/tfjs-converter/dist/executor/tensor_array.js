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
import { concat, keep, reshape, scalar, slice, stack, tensor, tidy, unstack } from '@tensorflow/tfjs-core';
import { assertShapesMatchAllowUndefinedSize } from './tensor_utils';
/**
 * The TensorArray object keeps an array of Tensors.  It
 * allows reading from the array and writing to the array.
 */
export class TensorArray {
    constructor(name, dtype, maxSize, elementShape, identicalElementShapes, dynamicSize, clearAfterRead) {
        this.name = name;
        this.dtype = dtype;
        this.maxSize = maxSize;
        this.elementShape = elementShape;
        this.identicalElementShapes = identicalElementShapes;
        this.dynamicSize = dynamicSize;
        this.clearAfterRead = clearAfterRead;
        this.tensors = [];
        this.closed_ = false;
        this.idTensor = scalar(0);
        keep(this.idTensor);
    }
    get id() {
        return this.idTensor.id;
    }
    get closed() {
        return this.closed_;
    }
    /**
     * Dispose the tensors and idTensor and mark the TensoryArray as closed.
     */
    clearAndClose(keepIds) {
        this.tensors.forEach(tensor => {
            if (keepIds == null || !keepIds.has(tensor.tensor.id)) {
                tensor.tensor.dispose();
            }
        });
        this.tensors = [];
        this.closed_ = true;
        this.idTensor.dispose();
    }
    size() {
        return this.tensors.length;
    }
    /**
     * Read the value at location index in the TensorArray.
     * @param index Number the index to read from.
     */
    read(index) {
        if (this.closed_) {
            throw new Error(`TensorArray ${this.name} has already been closed.`);
        }
        if (index < 0 || index >= this.size()) {
            throw new Error(`Tried to read from index ${index}, but array size is: ${this.size()}`);
        }
        const tensorWithState = this.tensors[index];
        if (tensorWithState.cleared) {
            throw new Error(`TensorArray ${this.name}: Could not read index ${index} twice because it was cleared after a previous read ` +
                `(perhaps try setting clear_after_read = false?).`);
        }
        if (this.clearAfterRead) {
            tensorWithState.cleared = true;
        }
        tensorWithState.read = true;
        return tensorWithState.tensor;
    }
    /**
     * Helper method to read multiple tensors from the specified indices.
     */
    readMany(indices) {
        return indices.map(index => this.read(index));
    }
    /**
     * Write value into the index of the TensorArray.
     * @param index number the index to write to.
     * @param tensor
     */
    write(index, tensor) {
        if (this.closed_) {
            throw new Error(`TensorArray ${this.name} has already been closed.`);
        }
        if (index < 0 || !this.dynamicSize && index >= this.maxSize) {
            throw new Error(`Tried to write to index ${index}, but array is not resizeable and size is: ${this.maxSize}`);
        }
        const t = this.tensors[index] || {};
        if (tensor.dtype !== this.dtype) {
            throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${index},
          because the value dtype is ${tensor.dtype}, but TensorArray dtype is ${this.dtype}.`);
        }
        // Set the shape for the first time write to unknow shape tensor array
        if (this.size() === 0 &&
            (this.elementShape == null || this.elementShape.length === 0)) {
            this.elementShape = tensor.shape;
        }
        assertShapesMatchAllowUndefinedSize(this.elementShape, tensor.shape, `TensorArray ${this.name}: Could not write to TensorArray index ${index}.`);
        if (t.read) {
            throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${index}, because it has already been read.`);
        }
        if (t.written) {
            throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${index}, because it has already been written.`);
        }
        t.tensor = tensor;
        keep(tensor);
        t.written = true;
        this.tensors[index] = t;
    }
    /**
     * Helper method to write multiple tensors to the specified indices.
     */
    writeMany(indices, tensors) {
        if (indices.length !== tensors.length) {
            throw new Error(`TensorArray ${this.name}: could not write multiple tensors,` +
                `because the index size: ${indices.length} is not the same as tensors size: ${tensors.length}.`);
        }
        indices.forEach((i, index) => this.write(i, tensors[index]));
    }
    /**
     * Return selected values in the TensorArray as a packed Tensor. All of
     * selected values must have been written and their shapes must all match.
     * @param [indices] number[] Optional. Taking values in [0, max_value). If the
     *    TensorArray is not dynamic, max_value=size(). If not specified returns
     *    all tensors in the original order.
     * @param [dtype]
     */
    gather(indices, dtype) {
        if (!!dtype && dtype !== this.dtype) {
            throw new Error(`TensorArray dtype is ${this.dtype} but gather requested dtype ${dtype}`);
        }
        if (!indices) {
            indices = [];
            for (let i = 0; i < this.size(); i++) {
                indices.push(i);
            }
        }
        else {
            indices = indices.slice(0, this.size());
        }
        if (indices.length === 0) {
            return tensor([], [0].concat(this.elementShape));
        }
        // Read all the PersistentTensors into a vector to keep track of
        // their memory.
        const tensors = this.readMany(indices);
        assertShapesMatchAllowUndefinedSize(this.elementShape, tensors[0].shape, 'TensorArray shape mismatch: ');
        return stack(tensors, 0);
    }
    /**
     * Return the values in the TensorArray as a concatenated Tensor.
     */
    concat(dtype) {
        if (!!dtype && dtype !== this.dtype) {
            throw new Error(`TensorArray dtype is ${this.dtype} but concat requested dtype ${dtype}`);
        }
        if (this.size() === 0) {
            return tensor([], [0].concat(this.elementShape));
        }
        const indices = [];
        for (let i = 0; i < this.size(); i++) {
            indices.push(i);
        }
        // Collect all the tensors from the tensors array.
        const tensors = this.readMany(indices);
        assertShapesMatchAllowUndefinedSize(this.elementShape, tensors[0].shape, `TensorArray shape mismatch: tensor array shape (${this.elementShape}) vs first tensor shape (${tensors[0].shape})`);
        return concat(tensors, 0);
    }
    /**
     * Scatter the values of a Tensor in specific indices of a TensorArray.
     * @param indices nummber[] values in [0, max_value). If the
     *    TensorArray is not dynamic, max_value=size().
     * @param tensor Tensor input tensor.
     */
    scatter(indices, tensor) {
        if (tensor.dtype !== this.dtype) {
            throw new Error(`TensorArray dtype is ${this.dtype} but tensor has dtype ${tensor.dtype}`);
        }
        if (indices.length !== tensor.shape[0]) {
            throw new Error(`Expected len(indices) == tensor.shape[0], but saw: ${indices.length} vs. ${tensor.shape[0]}`);
        }
        const maxIndex = Math.max(...indices);
        if (!this.dynamicSize && maxIndex >= this.maxSize) {
            throw new Error(`Max index must be < array size (${maxIndex}  vs. ${this.maxSize})`);
        }
        this.writeMany(indices, unstack(tensor, 0));
    }
    /**
     * Split the values of a Tensor into the TensorArray.
     * @param length number[] with the lengths to use when splitting value along
     *    its first dimension.
     * @param tensor Tensor, the tensor to split.
     */
    split(length, tensor) {
        if (tensor.dtype !== this.dtype) {
            throw new Error(`TensorArray dtype is ${this.dtype} but tensor has dtype ${tensor.dtype}`);
        }
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
        if (!this.dynamicSize && length.length !== this.maxSize) {
            throw new Error(`TensorArray's size is not equal to the size of lengths (${this.maxSize} vs. ${length.length}), ` +
                'and the TensorArray is not marked as dynamically resizeable');
        }
        const elementPerRow = totalLength === 0 ? 0 : tensor.size / totalLength;
        const tensors = [];
        tidy(() => {
            tensor = reshape(tensor, [1, totalLength, elementPerRow]);
            for (let i = 0; i < length.length; ++i) {
                const previousLength = (i === 0) ? 0 : cumulativeLengths[i - 1];
                const indices = [0, previousLength, 0];
                const sizes = [1, length[i], elementPerRow];
                tensors[i] = reshape(slice(tensor, indices, sizes), this.elementShape);
            }
            return tensors;
        });
        const indices = [];
        for (let i = 0; i < length.length; i++) {
            indices[i] = i;
        }
        this.writeMany(indices, tensors);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVuc29yX2FycmF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb252ZXJ0ZXIvc3JjL2V4ZWN1dG9yL3RlbnNvcl9hcnJheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFZLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUUzSCxPQUFPLEVBQUMsbUNBQW1DLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQVFuRTs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sV0FBVztJQUl0QixZQUNhLElBQVksRUFBVyxLQUFlLEVBQVUsT0FBZSxFQUNoRSxZQUFzQixFQUFXLHNCQUErQixFQUMvRCxXQUFvQixFQUFXLGNBQXVCO1FBRnRELFNBQUksR0FBSixJQUFJLENBQVE7UUFBVyxVQUFLLEdBQUwsS0FBSyxDQUFVO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNoRSxpQkFBWSxHQUFaLFlBQVksQ0FBVTtRQUFXLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBUztRQUMvRCxnQkFBVyxHQUFYLFdBQVcsQ0FBUztRQUFXLG1CQUFjLEdBQWQsY0FBYyxDQUFTO1FBTjNELFlBQU8sR0FBc0IsRUFBRSxDQUFDO1FBQ2hDLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFNdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxFQUFFO1FBQ0osT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENB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RUFBRSxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDeEU7WUFDRCxPQUFPLE9BQU8sQ0FBQztRQUNqQixDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNuQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN0QyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbkMsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2NvbmNhdCwgRGF0YVR5cGUsIGtlZXAsIHJlc2hhcGUsIHNjYWxhciwgc2xpY2UsIHN0YWNrLCBUZW5zb3IsIHRlbnNvciwgdGlkeSwgdW5zdGFja30gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHthc3NlcnRTaGFwZXNNYXRjaEFsbG93VW5kZWZpbmVkU2l6ZX0gZnJvbSAnLi90ZW5zb3JfdXRpbHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRlbnNvcldpdGhTdGF0ZSB7XG4gIHRlbnNvcj86IFRlbnNvcjtcbiAgd3JpdHRlbj86IGJvb2xlYW47XG4gIHJlYWQ/OiBib29sZWFuO1xuICBjbGVhcmVkPzogYm9vbGVhbjtcbn1cbi8qKlxuICogVGhlIFRlbnNvckFycmF5IG9iamVjdCBrZWVwcyBhbiBhcnJheSBvZiBUZW5zb3JzLiAgSXRcbiAqIGFsbG93cyByZWFkaW5nIGZyb20gdGhlIGFycmF5IGFuZCB3cml0aW5nIHRvIHRoZSBhcnJheS5cbiAqL1xuZXhwb3J0IGNsYXNzIFRlbnNvckFycmF5IHtcbiAgcHJpdmF0ZSB0ZW5zb3JzOiBUZW5zb3JXaXRoU3RhdGVbXSA9IFtdO1xuICBwcml2YXRlIGNsb3NlZF8gPSBmYWxzZTtcbiAgcmVhZG9ubHkgaWRUZW5zb3I6IFRlbnNvcjtcbiAgY29uc3RydWN0b3IoXG4gICAgICByZWFkb25seSBuYW1lOiBzdHJpbmcsIHJlYWRvbmx5IGR0eXBlOiBEYXRhVHlwZSwgcHJpdmF0ZSBtYXhTaXplOiBudW1iZXIsXG4gICAgICBwcml2YXRlIGVsZW1lbnRTaGFwZTogbnVtYmVyW10sIHJlYWRvbmx5IGlkZW50aWNhbEVsZW1lbnRTaGFwZXM6IGJvb2xlYW4sXG4gICAgICByZWFkb25seSBkeW5hbWljU2l6ZTogYm9vbGVhbiwgcmVhZG9ubHkgY2xlYXJBZnRlclJlYWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmlkVGVuc29yID0gc2NhbGFyKDApO1xuICAgIGtlZXAodGhpcy5pZFRlbnNvcik7XG4gIH1cblxuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWRUZW5zb3IuaWQ7XG4gIH1cblxuICBnZXQgY2xvc2VkKCkge1xuICAgIHJldHVybiB0aGlzLmNsb3NlZF87XG4gIH1cblxuICAvKipcbiAgICogRGlzcG9zZSB0aGUgdGVuc29ycyBhbmQgaWRUZW5zb3IgYW5kIG1hcmsgdGhlIFRlbnNvcnlBcnJheSBhcyBjbG9zZWQuXG4gICAqL1xuICBjbGVhckFuZENsb3NlKGtlZXBJZHM/OiBTZXQ8bnVtYmVyPikge1xuICAgIHRoaXMudGVuc29ycy5mb3JFYWNoKHRlbnNvciA9PiB7XG4gICAgICBpZiAoa2VlcElkcyA9PSBudWxsIHx8ICFrZWVwSWRzLmhhcyh0ZW5zb3IudGVuc29yLmlkKSkge1xuICAgICAgICB0ZW5zb3IudGVuc29yLmRpc3Bvc2UoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnRlbnNvcnMgPSBbXTtcbiAgICB0aGlzLmNsb3NlZF8gPSB0cnVlO1xuICAgIHRoaXMuaWRUZW5zb3IuZGlzcG9zZSgpO1xuICB9XG5cbiAgc2l6ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnRlbnNvcnMubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlYWQgdGhlIHZhbHVlIGF0IGxvY2F0aW9uIGluZGV4IGluIHRoZSBUZW5zb3JBcnJheS5cbiAgICogQHBhcmFtIGluZGV4IE51bWJlciB0aGUgaW5kZXggdG8gcmVhZCBmcm9tLlxuICAgKi9cbiAgcmVhZChpbmRleDogbnVtYmVyKTogVGVuc29yIHtcbiAgICBpZiAodGhpcy5jbG9zZWRfKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRlbnNvckFycmF5ICR7dGhpcy5uYW1lfSBoYXMgYWxyZWFkeSBiZWVuIGNsb3NlZC5gKTtcbiAgICB9XG5cbiAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuc2l6ZSgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRyaWVkIHRvIHJlYWQgZnJvbSBpbmRleCAke2luZGV4fSwgYnV0IGFycmF5IHNpemUgaXM6ICR7XG4gICAgICAgICAgdGhpcy5zaXplKCl9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgdGVuc29yV2l0aFN0YXRlID0gdGhpcy50ZW5zb3JzW2luZGV4XTtcbiAgICBpZiAodGVuc29yV2l0aFN0YXRlLmNsZWFyZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgVGVuc29yQXJyYXkgJHt0aGlzLm5hbWV9OiBDb3VsZCBub3QgcmVhZCBpbmRleCAke1xuICAgICAgICAgICAgICBpbmRleH0gdHdpY2UgYmVjYXVzZSBpdCB3YXMgY2xlYXJlZCBhZnRlciBhIHByZXZpb3VzIHJlYWQgYCArXG4gICAgICAgICAgYChwZXJoYXBzIHRyeSBzZXR0aW5nIGNsZWFyX2FmdGVyX3JlYWQgPSBmYWxzZT8pLmApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNsZWFyQWZ0ZXJSZWFkKSB7XG4gICAgICB0ZW5zb3JXaXRoU3RhdGUuY2xlYXJlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgdGVuc29yV2l0aFN0YXRlLnJlYWQgPSB0cnVlO1xuICAgIHJldHVybiB0ZW5zb3JXaXRoU3RhdGUudGVuc29yO1xuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciBtZXRob2QgdG8gcmVhZCBtdWx0aXBsZSB0ZW5zb3JzIGZyb20gdGhlIHNwZWNpZmllZCBpbmRpY2VzLlxuICAgKi9cbiAgcmVhZE1hbnkoaW5kaWNlczogbnVtYmVyW10pOiBUZW5zb3JbXSB7XG4gICAgcmV0dXJuIGluZGljZXMubWFwKGluZGV4ID0+IHRoaXMucmVhZChpbmRleCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyaXRlIHZhbHVlIGludG8gdGhlIGluZGV4IG9mIHRoZSBUZW5zb3JBcnJheS5cbiAgICogQHBhcmFtIGluZGV4IG51bWJlciB0aGUgaW5kZXggdG8gd3JpdGUgdG8uXG4gICAqIEBwYXJhbSB0ZW5zb3JcbiAgICovXG4gIHdyaXRlKGluZGV4OiBudW1iZXIsIHRlbnNvcjogVGVuc29yKSB7XG4gICAgaWYgKHRoaXMuY2xvc2VkXykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUZW5zb3JBcnJheSAke3RoaXMubmFtZX0gaGFzIGFscmVhZHkgYmVlbiBjbG9zZWQuYCk7XG4gICAgfVxuXG4gICAgaWYgKGluZGV4IDwgMCB8fCAhdGhpcy5keW5hbWljU2l6ZSAmJiBpbmRleCA+PSB0aGlzLm1heFNpemUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVHJpZWQgdG8gd3JpdGUgdG8gaW5kZXggJHtcbiAgICAgICAgICBpbmRleH0sIGJ1dCBhcnJheSBpcyBub3QgcmVzaXplYWJsZSBhbmQgc2l6ZSBpczogJHt0aGlzLm1heFNpemV9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgdCA9IHRoaXMudGVuc29yc1tpbmRleF0gfHwge307XG5cbiAgICBpZiAodGVuc29yLmR0eXBlICE9PSB0aGlzLmR0eXBlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRlbnNvckFycmF5ICR7XG4gICAgICAgICAgdGhpcy5uYW1lfTogQ291bGQgbm90IHdyaXRlIHRvIFRlbnNvckFycmF5IGluZGV4ICR7aW5kZXh9LFxuICAgICAgICAgIGJlY2F1c2UgdGhlIHZhbHVlIGR0eXBlIGlzICR7XG4gICAgICAgICAgdGVuc29yLmR0eXBlfSwgYnV0IFRlbnNvckFycmF5IGR0eXBlIGlzICR7dGhpcy5kdHlwZX0uYCk7XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBzaGFwZSBmb3IgdGhlIGZpcnN0IHRpbWUgd3JpdGUgdG8gdW5rbm93IHNoYXBlIHRlbnNvciBhcnJheVxuICAgIGlmICh0aGlzLnNpemUoKSA9PT0gMCAmJlxuICAgICAgICAodGhpcy5lbGVtZW50U2hhcGUgPT0gbnVsbCB8fCB0aGlzLmVsZW1lbnRTaGFwZS5sZW5ndGggPT09IDApKSB7XG4gICAgICB0aGlzLmVsZW1lbnRTaGFwZSA9IHRlbnNvci5zaGFwZTtcbiAgICB9XG5cbiAgICBhc3NlcnRTaGFwZXNNYXRjaEFsbG93VW5kZWZpbmVkU2l6ZShcbiAgICAgICAgdGhpcy5lbGVtZW50U2hhcGUsIHRlbnNvci5zaGFwZSxcbiAgICAgICAgYFRlbnNvckFycmF5ICR7dGhpcy5uYW1lfTogQ291bGQgbm90IHdyaXRlIHRvIFRlbnNvckFycmF5IGluZGV4ICR7XG4gICAgICAgICAgICBpbmRleH0uYCk7XG5cbiAgICBpZiAodC5yZWFkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYFRlbnNvckFycmF5ICR7dGhpcy5uYW1lfTogQ291bGQgbm90IHdyaXRlIHRvIFRlbnNvckFycmF5IGluZGV4ICR7XG4gICAgICAgICAgICAgIGluZGV4fSwgYmVjYXVzZSBpdCBoYXMgYWxyZWFkeSBiZWVuIHJlYWQuYCk7XG4gICAgfVxuXG4gICAgaWYgKHQud3JpdHRlbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBUZW5zb3JBcnJheSAke3RoaXMubmFtZX06IENvdWxkIG5vdCB3cml0ZSB0byBUZW5zb3JBcnJheSBpbmRleCAke1xuICAgICAgICAgICAgICBpbmRleH0sIGJlY2F1c2UgaXQgaGFzIGFscmVhZHkgYmVlbiB3cml0dGVuLmApO1xuICAgIH1cblxuICAgIHQudGVuc29yID0gdGVuc29yO1xuICAgIGtlZXAodGVuc29yKTtcbiAgICB0LndyaXR0ZW4gPSB0cnVlO1xuXG4gICAgdGhpcy50ZW5zb3JzW2luZGV4XSA9IHQ7XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIG1ldGhvZCB0byB3cml0ZSBtdWx0aXBsZSB0ZW5zb3JzIHRvIHRoZSBzcGVjaWZpZWQgaW5kaWNlcy5cbiAgICovXG4gIHdyaXRlTWFueShpbmRpY2VzOiBudW1iZXJbXSwgdGVuc29yczogVGVuc29yW10pIHtcbiAgICBpZiAoaW5kaWNlcy5sZW5ndGggIT09IHRlbnNvcnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYFRlbnNvckFycmF5ICR7dGhpcy5uYW1lfTogY291bGQgbm90IHdyaXRlIG11bHRpcGxlIHRlbnNvcnMsYCArXG4gICAgICAgICAgYGJlY2F1c2UgdGhlIGluZGV4IHNpemU6ICR7XG4gICAgICAgICAgICAgIGluZGljZXMubGVuZ3RofSBpcyBub3QgdGhlIHNhbWUgYXMgdGVuc29ycyBzaXplOiAke1xuICAgICAgICAgICAgICB0ZW5zb3JzLmxlbmd0aH0uYCk7XG4gICAgfVxuXG4gICAgaW5kaWNlcy5mb3JFYWNoKChpLCBpbmRleCkgPT4gdGhpcy53cml0ZShpLCB0ZW5zb3JzW2luZGV4XSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBzZWxlY3RlZCB2YWx1ZXMgaW4gdGhlIFRlbnNvckFycmF5IGFzIGEgcGFja2VkIFRlbnNvci4gQWxsIG9mXG4gICAqIHNlbGVjdGVkIHZhbHVlcyBtdXN0IGhhdmUgYmVlbiB3cml0dGVuIGFuZCB0aGVpciBzaGFwZXMgbXVzdCBhbGwgbWF0Y2guXG4gICAqIEBwYXJhbSBbaW5kaWNlc10gbnVtYmVyW10gT3B0aW9uYWwuIFRha2luZyB2YWx1ZXMgaW4gWzAsIG1heF92YWx1ZSkuIElmIHRoZVxuICAgKiAgICBUZW5zb3JBcnJheSBpcyBub3QgZHluYW1pYywgbWF4X3ZhbHVlPXNpemUoKS4gSWYgbm90IHNwZWNpZmllZCByZXR1cm5zXG4gICAqICAgIGFsbCB0ZW5zb3JzIGluIHRoZSBvcmlnaW5hbCBvcmRlci5cbiAgICogQHBhcmFtIFtkdHlwZV1cbiAgICovXG4gIGdhdGhlcihpbmRpY2VzPzogbnVtYmVyW10sIGR0eXBlPzogRGF0YVR5cGUpOiBUZW5zb3Ige1xuICAgIGlmICghIWR0eXBlICYmIGR0eXBlICE9PSB0aGlzLmR0eXBlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRlbnNvckFycmF5IGR0eXBlIGlzICR7XG4gICAgICAgICAgdGhpcy5kdHlwZX0gYnV0IGdhdGhlciByZXF1ZXN0ZWQgZHR5cGUgJHtkdHlwZX1gKTtcbiAgICB9XG5cbiAgICBpZiAoIWluZGljZXMpIHtcbiAgICAgIGluZGljZXMgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaXplKCk7IGkrKykge1xuICAgICAgICBpbmRpY2VzLnB1c2goaSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGluZGljZXMgPSBpbmRpY2VzLnNsaWNlKDAsIHRoaXMuc2l6ZSgpKTtcbiAgICB9XG5cbiAgICBpZiAoaW5kaWNlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0ZW5zb3IoW10sIFswXS5jb25jYXQodGhpcy5lbGVtZW50U2hhcGUpKTtcbiAgICB9XG5cbiAgICAvLyBSZWFkIGFsbCB0aGUgUGVyc2lzdGVudFRlbnNvcnMgaW50byBhIHZlY3RvciB0byBrZWVwIHRyYWNrIG9mXG4gICAgLy8gdGhlaXIgbWVtb3J5LlxuICAgIGNvbnN0IHRlbnNvcnMgPSB0aGlzLnJlYWRNYW55KGluZGljZXMpO1xuXG4gICAgYXNzZXJ0U2hhcGVzTWF0Y2hBbGxvd1VuZGVmaW5lZFNpemUoXG4gICAgICAgIHRoaXMuZWxlbWVudFNoYXBlLCB0ZW5zb3JzWzBdLnNoYXBlLCAnVGVuc29yQXJyYXkgc2hhcGUgbWlzbWF0Y2g6ICcpO1xuXG4gICAgcmV0dXJuIHN0YWNrKHRlbnNvcnMsIDApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdmFsdWVzIGluIHRoZSBUZW5zb3JBcnJheSBhcyBhIGNvbmNhdGVuYXRlZCBUZW5zb3IuXG4gICAqL1xuICBjb25jYXQoZHR5cGU/OiBEYXRhVHlwZSk6IFRlbnNvciB7XG4gICAgaWYgKCEhZHR5cGUgJiYgZHR5cGUgIT09IHRoaXMuZHR5cGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGVuc29yQXJyYXkgZHR5cGUgaXMgJHtcbiAgICAgICAgICB0aGlzLmR0eXBlfSBidXQgY29uY2F0IHJlcXVlc3RlZCBkdHlwZSAke2R0eXBlfWApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNpemUoKSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRlbnNvcihbXSwgWzBdLmNvbmNhdCh0aGlzLmVsZW1lbnRTaGFwZSkpO1xuICAgIH1cblxuICAgIGNvbnN0IGluZGljZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2l6ZSgpOyBpKyspIHtcbiAgICAgIGluZGljZXMucHVzaChpKTtcbiAgICB9XG4gICAgLy8gQ29sbGVjdCBhbGwgdGhlIHRlbnNvcnMgZnJvbSB0aGUgdGVuc29ycyBhcnJheS5cbiAgICBjb25zdCB0ZW5zb3JzID0gdGhpcy5yZWFkTWFueShpbmRpY2VzKTtcblxuICAgIGFzc2VydFNoYXBlc01hdGNoQWxsb3dVbmRlZmluZWRTaXplKFxuICAgICAgICB0aGlzLmVsZW1lbnRTaGFwZSwgdGVuc29yc1swXS5zaGFwZSxcbiAgICAgICAgYFRlbnNvckFycmF5IHNoYXBlIG1pc21hdGNoOiB0ZW5zb3IgYXJyYXkgc2hhcGUgKCR7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRTaGFwZX0pIHZzIGZpcnN0IHRlbnNvciBzaGFwZSAoJHt0ZW5zb3JzWzBdLnNoYXBlfSlgKTtcblxuICAgIHJldHVybiBjb25jYXQodGVuc29ycywgMCk7XG4gIH1cblxuICAvKipcbiAgICogU2NhdHRlciB0aGUgdmFsdWVzIG9mIGEgVGVuc29yIGluIHNwZWNpZmljIGluZGljZXMgb2YgYSBUZW5zb3JBcnJheS5cbiAgICogQHBhcmFtIGluZGljZXMgbnVtbWJlcltdIHZhbHVlcyBpbiBbMCwgbWF4X3ZhbHVlKS4gSWYgdGhlXG4gICAqICAgIFRlbnNvckFycmF5IGlzIG5vdCBkeW5hbWljLCBtYXhfdmFsdWU9c2l6ZSgpLlxuICAgKiBAcGFyYW0gdGVuc29yIFRlbnNvciBpbnB1dCB0ZW5zb3IuXG4gICAqL1xuICBzY2F0dGVyKGluZGljZXM6IG51bWJlcltdLCB0ZW5zb3I6IFRlbnNvcikge1xuICAgIGlmICh0ZW5zb3IuZHR5cGUgIT09IHRoaXMuZHR5cGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGVuc29yQXJyYXkgZHR5cGUgaXMgJHtcbiAgICAgICAgICB0aGlzLmR0eXBlfSBidXQgdGVuc29yIGhhcyBkdHlwZSAke3RlbnNvci5kdHlwZX1gKTtcbiAgICB9XG5cbiAgICBpZiAoaW5kaWNlcy5sZW5ndGggIT09IHRlbnNvci5zaGFwZVswXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBsZW4oaW5kaWNlcykgPT0gdGVuc29yLnNoYXBlWzBdLCBidXQgc2F3OiAke1xuICAgICAgICAgIGluZGljZXMubGVuZ3RofSB2cy4gJHt0ZW5zb3Iuc2hhcGVbMF19YCk7XG4gICAgfVxuXG4gICAgY29uc3QgbWF4SW5kZXggPSBNYXRoLm1heCguLi5pbmRpY2VzKTtcblxuICAgIGlmICghdGhpcy5keW5hbWljU2l6ZSAmJiBtYXhJbmRleCA+PSB0aGlzLm1heFNpemUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgTWF4IGluZGV4IG11c3QgYmUgPCBhcnJheSBzaXplICgke21heEluZGV4fSAgdnMuICR7dGhpcy5tYXhTaXplfSlgKTtcbiAgICB9XG5cbiAgICB0aGlzLndyaXRlTWFueShpbmRpY2VzLCB1bnN0YWNrKHRlbnNvciwgMCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNwbGl0IHRoZSB2YWx1ZXMgb2YgYSBUZW5zb3IgaW50byB0aGUgVGVuc29yQXJyYXkuXG4gICAqIEBwYXJhbSBsZW5ndGggbnVtYmVyW10gd2l0aCB0aGUgbGVuZ3RocyB0byB1c2Ugd2hlbiBzcGxpdHRpbmcgdmFsdWUgYWxvbmdcbiAgICogICAgaXRzIGZpcnN0IGRpbWVuc2lvbi5cbiAgICogQHBhcmFtIHRlbnNvciBUZW5zb3IsIHRoZSB0ZW5zb3IgdG8gc3BsaXQuXG4gICAqL1xuICBzcGxpdChsZW5ndGg6IG51bWJlcltdLCB0ZW5zb3I6IFRlbnNvcikge1xuICAgIGlmICh0ZW5zb3IuZHR5cGUgIT09IHRoaXMuZHR5cGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGVuc29yQXJyYXkgZHR5cGUgaXMgJHtcbiAgICAgICAgICB0aGlzLmR0eXBlfSBidXQgdGVuc29yIGhhcyBkdHlwZSAke3RlbnNvci5kdHlwZX1gKTtcbiAgICB9XG4gICAgbGV0IHRvdGFsTGVuZ3RoID0gMDtcbiAgICBjb25zdCBjdW11bGF0aXZlTGVuZ3RocyA9IGxlbmd0aC5tYXAobGVuID0+IHtcbiAgICAgIHRvdGFsTGVuZ3RoICs9IGxlbjtcbiAgICAgIHJldHVybiB0b3RhbExlbmd0aDtcbiAgICB9KTtcblxuICAgIGlmICh0b3RhbExlbmd0aCAhPT0gdGVuc29yLnNoYXBlWzBdKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIHN1bSBvZiBsZW5ndGhzIHRvIGJlIGVxdWFsIHRvXG4gICAgICAgICAgdGVuc29yLnNoYXBlWzBdLCBidXQgc3VtIG9mIGxlbmd0aHMgaXNcbiAgICAgICAgJHt0b3RhbExlbmd0aH0sIGFuZCB0ZW5zb3IncyBzaGFwZSBpczogJHt0ZW5zb3Iuc2hhcGV9YCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmR5bmFtaWNTaXplICYmIGxlbmd0aC5sZW5ndGggIT09IHRoaXMubWF4U2l6ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBUZW5zb3JBcnJheSdzIHNpemUgaXMgbm90IGVxdWFsIHRvIHRoZSBzaXplIG9mIGxlbmd0aHMgKCR7XG4gICAgICAgICAgICAgIHRoaXMubWF4U2l6ZX0gdnMuICR7bGVuZ3RoLmxlbmd0aH0pLCBgICtcbiAgICAgICAgICAnYW5kIHRoZSBUZW5zb3JBcnJheSBpcyBub3QgbWFya2VkIGFzIGR5bmFtaWNhbGx5IHJlc2l6ZWFibGUnKTtcbiAgICB9XG5cbiAgICBjb25zdCBlbGVtZW50UGVyUm93ID0gdG90YWxMZW5ndGggPT09IDAgPyAwIDogdGVuc29yLnNpemUgLyB0b3RhbExlbmd0aDtcbiAgICBjb25zdCB0ZW5zb3JzOiBUZW5zb3JbXSA9IFtdO1xuICAgIHRpZHkoKCkgPT4ge1xuICAgICAgdGVuc29yID0gcmVzaGFwZSh0ZW5zb3IsIFsxLCB0b3RhbExlbmd0aCwgZWxlbWVudFBlclJvd10pO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGgubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgcHJldmlvdXNMZW5ndGggPSAoaSA9PT0gMCkgPyAwIDogY3VtdWxhdGl2ZUxlbmd0aHNbaSAtIDFdO1xuICAgICAgICBjb25zdCBpbmRpY2VzID0gWzAsIHByZXZpb3VzTGVuZ3RoLCAwXTtcbiAgICAgICAgY29uc3Qgc2l6ZXMgPSBbMSwgbGVuZ3RoW2ldLCBlbGVtZW50UGVyUm93XTtcbiAgICAgICAgdGVuc29yc1tpXSA9IHJlc2hhcGUoc2xpY2UodGVuc29yLCBpbmRpY2VzLCBzaXplcyksIHRoaXMuZWxlbWVudFNoYXBlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0ZW5zb3JzO1xuICAgIH0pO1xuICAgIGNvbnN0IGluZGljZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aC5sZW5ndGg7IGkrKykge1xuICAgICAgaW5kaWNlc1tpXSA9IGk7XG4gICAgfVxuICAgIHRoaXMud3JpdGVNYW55KGluZGljZXMsIHRlbnNvcnMpO1xuICB9XG59XG4iXX0=