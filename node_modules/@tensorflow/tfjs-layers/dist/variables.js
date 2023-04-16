/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
import * as tfc from '@tensorflow/tfjs-core';
import { variableGrads } from '@tensorflow/tfjs-core';
import { getNextUniqueTensorId } from './backend/state';
import { getScopedTensorName, getUniqueTensorName } from './common';
import { NotImplementedError } from './errors';
const DEFAULT_VARIABLE_NAME_PREFIX = 'Variable';
/**
 * A `tf.layers.LayerVariable` is similar to a `tf.Tensor` in that it has a
 * dtype and shape, but its value is mutable.  The value is itself represented
 * as a`tf.Tensor`, and can be read with the `read()` method and updated with
 * the `write()` method.
 */
export class LayerVariable {
    /**
     * Construct Variable from a `tf.Tensor`.
     *
     * If not explicitly named, the Variable will be given a name with the
     * prefix 'Variable'. Variable names are unique. In the case of name
     * collision, suffixies '_<num>' will be added to the name.
     *
     * @param val Initial value of the Variable.
     * @param name Name of the variable. If `null` or `undefined` is provided, it
     *   will default a name with the prefix 'Variable'.
     * @param constraint Optional, projection function to be applied to the
     * variable after optimize updates
     * @throws ValueError if `name` is `null` or `undefined`.
     */
    constructor(val, dtype = 'float32', name = DEFAULT_VARIABLE_NAME_PREFIX, trainable = true, constraint = null) {
        this.dtype = dtype == null ? 'float32' : dtype;
        this.shape = val.shape;
        this.id = getNextUniqueTensorId();
        name = name == null ? DEFAULT_VARIABLE_NAME_PREFIX : name;
        this.originalName = getScopedTensorName(name);
        this.name = getUniqueTensorName(this.originalName);
        this.trainable_ = trainable;
        this.constraint = constraint;
        this.val = tfc.variable(val, this.trainable_, this.name, this.dtype);
    }
    /**
     * Get a snapshot of the Variable's value.
     *
     * The returned value is a snapshot of the Variable's value at the time of
     * the invocation. Future mutations in the value of the tensor will only
     * be reflected by future calls to this method.
     */
    read() {
        this.assertNotDisposed();
        return this.val;
    }
    /**
     * Update the value of the Variable.
     *
     * @param newVal: The new value to update to. Must be consistent with the
     *   dtype and shape of the Variable.
     * @return This Variable.
     */
    write(newVal) {
        // TODO(cais): Once  TF.js Core supports Tensor.dtype, check dtype match.
        this.assertNotDisposed();
        checkShapesMatch(this.val, newVal);
        // Skip updating if this is the exact same tensor.
        if (this.val.id !== newVal.id) {
            this.val.assign(newVal);
            if (this.constraint != null) {
                this.val.assign(this.constraint.apply(this.val));
            }
        }
        return this;
    }
    /**
     * Dispose this LayersVariable instance from memory.
     */
    dispose() {
        this.assertNotDisposed();
        this.val.dispose();
    }
    assertNotDisposed() {
        if (this.val.isDisposed) {
            throw new Error(`LayersVariable ${this.name} is already disposed.`);
        }
    }
    get trainable() {
        return this.trainable_;
    }
    set trainable(trainable) {
        this.trainable_ = trainable;
        this.val.trainable = trainable;
    }
}
function checkShapesMatch(x, y) {
    if (x.shape.toString() !== y.shape.toString()) {
        throw new Error('Shape mismatch: ' + JSON.stringify(x.shape) + ' vs. ' +
            JSON.stringify(y.shape));
    }
}
/**
 * Create a Variable.
 * @param x The initial value of the `Variable`.
 * @param dtype optional, the type of the variable.
 * @param name optional, the name of the variable, default provided by
 * Variable.
 * @param constraint optional, a constraint to be applied after every update.
 * @return The newly instantiated `Variable`.
 */
export function variable(x, dtype, name, constraint) {
    return new LayerVariable(x, dtype, name, true, constraint);
}
/**
 * Instantiates an all-zeros Variable and returns it.
 *
 * @param shape Shape of the tensor.
 * @param dtype DType of the tensor.
 * @param name Name of the tensor.
 * @return An all-zero Variable.
 */
export function zerosVariable(shape, dtype, name) {
    // TODO(cais): Implement logic for dtype.
    return new LayerVariable(tfc.zeros(shape), dtype, name);
}
/**
 * Instantiates an all-zeros tensor of the same shape as another tensor.
 *
 * @param x The other tensor.
 * @param dtype DType of the tensor.
 * @param name Name of the tensor.
 * @return A newly instantiated Variable.
 */
export function zerosLike(x, dtype, name) {
    return new LayerVariable(tfc.zerosLike(x), dtype, name);
}
/**
 * Instantiates an all-ones tensor and returns it.
 *
 * @param shape Shape of the tensor.
 * @param dtype DType of the tensor.
 * @param name Name of the tensor.
 * @return An all-ones Variable.
 */
export function onesVariable(shape, dtype, name) {
    // TODO(cais): Implement logic for dtype.
    const allocated = tfc.ones(shape);
    return new LayerVariable(allocated, dtype, name);
}
/**
 * Instantiates an all-ones tensor of the same shape as another tensor.
 *
 * @param x The other tensor.
 * @param dtype DType of the tensor.
 * @param name Name of the tensor.
 * @return A newly instantiated Variable.
 */
export function onesLike(x, dtype, name) {
    const allocated = tfc.onesLike(x);
    return new LayerVariable(allocated, dtype, name);
}
/**
 * Instantiate an identity matrix and returns it, as a Variable
 *
 * @param size Number of rows/columns.
 * @param dtype Data type of returned Variable.
 * @param name Name of returned Variable.
 * @return A Variable, an identity matrix.
 */
export function eyeVariable(size, dtype, name) {
    return new LayerVariable(tfc.eye(size), dtype, name);
}
/**
 * Get a Variable with uniform distribution of values.
 * @param shape Shape of the tensor.
 * @param minval Lower bound of the uniform distribution.
 * @param maxval Upper bound of the uniform distribution.
 * @param dtype
 * @param seed
 * @param name Optional name.
 * @return The uniform-random Variable.
 */
export function randomUniformVariable(shape, minval, maxval, dtype, seed, name = 'randomUniform') {
    return new LayerVariable(tfc.randomUniform(shape, minval, maxval, dtype), dtype, name);
}
/**
 * Get a Variable with truncated-normal distribution of values.
 * @param shape Shape of the tensor.
 * @param mean mean value of the normal distribution.
 * @param stddev standard deviation of the normal distribution.
 * @param dtype
 * @param seed
 * @param name Optional name.
 * @return The truncated-normal-random Variable.
 */
export function truncatedNormalVariable(shape, mean = 0.0, stddev = 1.0, dtype, seed, name = 'truncatedNormal') {
    // TODO(cais): Implement logic for dtype and seed once they are supported
    // by deeplearn.js.
    dtype = dtype || 'float32';
    if (dtype !== 'float32' && dtype !== 'int32') {
        throw new NotImplementedError(`randomNormal does not support dType ${dtype}.`);
    }
    return new LayerVariable(tfc.truncatedNormal(shape, mean, stddev, dtype, seed), dtype, name);
}
/**
 * Get a Variable with normal distribution of values.
 * @param shape Shape of the tensor.
 * @param mean mean value of the normal distribution.
 * @param stddev standard deviation of the normal distribution.
 * @param dtype
 * @param seed
 * @param name Optional name.
 * @return The truncated-normal-random Variable.
 */
export function randomNormalVariable(shape, mean = 0.0, stddev = 1.0, dtype, seed, name = 'randomNormal') {
    dtype = dtype || 'float32';
    if (dtype !== 'float32' && dtype !== 'int32') {
        throw new NotImplementedError(`randomNormalVariable does not support dType ${dtype}.`);
    }
    return new LayerVariable(tfc.randomNormal(shape, mean, stddev, dtype, seed), dtype, name);
}
/**
 * Update the value of a Variable.
 * @param x The Variable to be updated.
 * @param xNew The new value to update to.
 * @return The Variable updated.
 */
export function update(x, xNew) {
    return x.write(xNew);
}
/**
 * Update the value of a Variable by adding an increment.
 * @param x The Variable to be updated.
 * @param increment The incrment to add to `x`.
 * @return The Variable updated.
 */
export function updateAdd(x, increment) {
    return x.write(tfc.add(x.read(), increment));
}
/**
 * Update the value of a Variable by subtracting a decrement.
 * @param x The Variable to be updated.
 * @param decrement The decrement to subtract from `x`.
 * @return The Variable updated.
 */
export function updateSub(x, decrement) {
    return x.write(tfc.sub(x.read(), decrement));
}
/**
 * Get the values of an array of Variables.
 *
 * @param tensors An `Array` of `Variable`s to get the values of.
 * @return The values of the inputs, as an `Array` of`tf.Tensor`s.
 */
export function batchGetValue(xs) {
    return xs.map(x => x.read());
}
/**
 * Update the value of multiple Variables at once.
 *
 * @param variablesAndValues An `Array`, each element is of type
 *   [Variable, Tensor]. The first item is the
 *   `Variable` of which the value is to be updated. The second item
 *   carries the new value.
 */
export function batchSetValue(variablesAndValues) {
    variablesAndValues.forEach(variableAndValue => {
        const variable = variableAndValue[0];
        variable.write(variableAndValue[1]);
    });
}
/**
 * Returns the gradients of `variables` w.r.t. the return value of `lossFn`.
 * @param lossFn A function which returns a Scalar to be used as the function
 *   value (i.e., numerator) for differentiation.
 * @param variables List of variables to be used as the independent variables
 *   (i.e., denominator) for differentiation.
 * @returns An Array of gradients tensors.
 */
export function gradients(lossFn, variables) {
    // TODO(cais): The return type signature can be simplified if deeplearn makes
    //   the corresponding type public.
    const variableList = variables.map(variable => variable.read());
    const valudAndGrads = variableGrads(lossFn, variableList);
    return variables.map(variable => valudAndGrads.grads[variable.name]);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFibGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1sYXllcnMvc3JjL3ZhcmlhYmxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7R0FRRztBQUVILE9BQU8sS0FBSyxHQUFHLE1BQU0sdUJBQXVCLENBQUM7QUFDN0MsT0FBTyxFQUFtQixhQUFhLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUV0RSxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN0RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFFbEUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBSTdDLE1BQU0sNEJBQTRCLEdBQUcsVUFBVSxDQUFDO0FBRWhEOzs7OztHQUtHO0FBQ0gsTUFBTSxPQUFPLGFBQWE7SUFleEI7Ozs7Ozs7Ozs7Ozs7T0FhRztJQUNILFlBQ0ksR0FBVyxFQUFFLFFBQWtCLFNBQVMsRUFDeEMsSUFBSSxHQUFHLDRCQUE0QixFQUFFLFNBQVMsR0FBRyxJQUFJLEVBQ3JELGFBQXlCLElBQUk7UUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUMvQyxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLEVBQUUsR0FBRyxxQkFBcUIsRUFBRSxDQUFDO1FBRWxDLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQzFELElBQUksQ0FBQyxZQUFZLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxJ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Q3JCLE1BQXdCLEVBQUUsU0FBMEI7SUFDdEQsNkVBQTZFO0lBQzdFLG1DQUFtQztJQUNuQyxNQUFNLFlBQVksR0FDZCxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksRUFBa0IsQ0FBQyxDQUFDO0lBQy9ELE1BQU0sYUFBYSxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDMUQsT0FBTyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN2RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICogbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gKiBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0ICogYXMgdGZjIGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5pbXBvcnQge0RhdGFUeXBlLCBUZW5zb3IsIHZhcmlhYmxlR3JhZHN9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7Z2V0TmV4dFVuaXF1ZVRlbnNvcklkfSBmcm9tICcuL2JhY2tlbmQvc3RhdGUnO1xuaW1wb3J0IHtnZXRTY29wZWRUZW5zb3JOYW1lLCBnZXRVbmlxdWVUZW5zb3JOYW1lfSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQge0NvbnN0cmFpbnR9IGZyb20gJy4vY29uc3RyYWludHMnO1xuaW1wb3J0IHtOb3RJbXBsZW1lbnRlZEVycm9yfSBmcm9tICcuL2Vycm9ycyc7XG5pbXBvcnQge1NoYXBlfSBmcm9tICcuL2tlcmFzX2Zvcm1hdC9jb21tb24nO1xuaW1wb3J0IHtIYXNTaGFwZX0gZnJvbSAnLi90eXBlcyc7XG5cbmNvbnN0IERFRkFVTFRfVkFSSUFCTEVfTkFNRV9QUkVGSVggPSAnVmFyaWFibGUnO1xuXG4vKipcbiAqIEEgYHRmLmxheWVycy5MYXllclZhcmlhYmxlYCBpcyBzaW1pbGFyIHRvIGEgYHRmLlRlbnNvcmAgaW4gdGhhdCBpdCBoYXMgYVxuICogZHR5cGUgYW5kIHNoYXBlLCBidXQgaXRzIHZhbHVlIGlzIG11dGFibGUuICBUaGUgdmFsdWUgaXMgaXRzZWxmIHJlcHJlc2VudGVkXG4gKiBhcyBhYHRmLlRlbnNvcmAsIGFuZCBjYW4gYmUgcmVhZCB3aXRoIHRoZSBgcmVhZCgpYCBtZXRob2QgYW5kIHVwZGF0ZWQgd2l0aFxuICogdGhlIGB3cml0ZSgpYCBtZXRob2QuXG4gKi9cbmV4cG9ydCBjbGFzcyBMYXllclZhcmlhYmxlIHtcbiAgcmVhZG9ubHkgZHR5cGU6IERhdGFUeXBlO1xuICByZWFkb25seSBzaGFwZTogU2hhcGU7XG5cbiAgcmVhZG9ubHkgaWQ6IG51bWJlcjtcbiAgLy8gVGhlIGZ1bGx5IHNjb3BlZCBuYW1lIG9mIHRoaXMgVmFyaWFibGUsIGluY2x1ZGluZyBhIHVuaXF1ZSBzdWZmaXggaWYgbmVlZGVkXG4gIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcbiAgLy8gVGhlIG9yaWdpbmFsbHkgcmVxdWVzdGVkIGZ1bGx5IHNjb3BlZCBuYW1lIG9mIHRoaXMgVmFyaWFibGUsIG5vdCBpbmNsdWRpbmdcbiAgLy8gYW55IHVuaXF1ZSBzdWZmaXguICBUaGlzIG1heSBiZSBuZWVkZWQgd2hlbiByZXN0b3Jpbmcgd2VpZ2h0cyBiZWNhdXNlIHRoaXNcbiAgLy8gb3JpZ2luYWwgbmFtZSBpcyB1c2VkIGFzIGEga2V5LlxuICByZWFkb25seSBvcmlnaW5hbE5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSB0cmFpbmFibGVfOiBib29sZWFuO1xuXG4gIHByb3RlY3RlZCByZWFkb25seSB2YWw6IHRmYy5WYXJpYWJsZTtcbiAgcmVhZG9ubHkgY29uc3RyYWludDogQ29uc3RyYWludDtcbiAgLyoqXG4gICAqIENvbnN0cnVjdCBWYXJpYWJsZSBmcm9tIGEgYHRmLlRlbnNvcmAuXG4gICAqXG4gICAqIElmIG5vdCBleHBsaWNpdGx5IG5hbWVkLCB0aGUgVmFyaWFibGUgd2lsbCBiZSBnaXZlbiBhIG5hbWUgd2l0aCB0aGVcbiAgICogcHJlZml4ICdWYXJpYWJsZScuIFZhcmlhYmxlIG5hbWVzIGFyZSB1bmlxdWUuIEluIHRoZSBjYXNlIG9mIG5hbWVcbiAgICogY29sbGlzaW9uLCBzdWZmaXhpZXMgJ188bnVtPicgd2lsbCBiZSBhZGRlZCB0byB0aGUgbmFtZS5cbiAgICpcbiAgICogQHBhcmFtIHZhbCBJbml0aWFsIHZhbHVlIG9mIHRoZSBWYXJpYWJsZS5cbiAgICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgdmFyaWFibGUuIElmIGBudWxsYCBvciBgdW5kZWZpbmVkYCBpcyBwcm92aWRlZCwgaXRcbiAgICogICB3aWxsIGRlZmF1bHQgYSBuYW1lIHdpdGggdGhlIHByZWZpeCAnVmFyaWFibGUnLlxuICAgKiBAcGFyYW0gY29uc3RyYWludCBPcHRpb25hbCwgcHJvamVjdGlvbiBmdW5jdGlvbiB0byBiZSBhcHBsaWVkIHRvIHRoZVxuICAgKiB2YXJpYWJsZSBhZnRlciBvcHRpbWl6ZSB1cGRhdGVzXG4gICAqIEB0aHJvd3MgVmFsdWVFcnJvciBpZiBgbmFtZWAgaXMgYG51bGxgIG9yIGB1bmRlZmluZWRgLlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICB2YWw6IFRlbnNvciwgZHR5cGU6IERhdGFUeXBlID0gJ2Zsb2F0MzInLFxuICAgICAgbmFtZSA9IERFRkFVTFRfVkFSSUFCTEVfTkFNRV9QUkVGSVgsIHRyYWluYWJsZSA9IHRydWUsXG4gICAgICBjb25zdHJhaW50OiBDb25zdHJhaW50ID0gbnVsbCkge1xuICAgIHRoaXMuZHR5cGUgPSBkdHlwZSA9PSBudWxsID8gJ2Zsb2F0MzInIDogZHR5cGU7XG4gICAgdGhpcy5zaGFwZSA9IHZhbC5zaGFwZTtcbiAgICB0aGlzLmlkID0gZ2V0TmV4dFVuaXF1ZVRlbnNvcklkKCk7XG5cbiAgICBuYW1lID0gbmFtZSA9PSBudWxsID8gREVGQVVMVF9WQVJJQUJMRV9OQU1FX1BSRUZJWCA6IG5hbWU7XG4gICAgdGhpcy5vcmlnaW5hbE5hbWUgPSBnZXRTY29wZWRUZW5zb3JOYW1lKG5hbWUpO1xuICAgIHRoaXMubmFtZSA9IGdldFVuaXF1ZVRlbnNvck5hbWUodGhpcy5vcmlnaW5hbE5hbWUpO1xuXG4gICAgdGhpcy50cmFpbmFibGVfID0gdHJhaW5hYmxlO1xuICAgIHRoaXMuY29uc3RyYWludCA9IGNvbnN0cmFpbnQ7XG5cbiAgICB0aGlzLnZhbCA9IHRmYy52YXJpYWJsZSh2YWwsIHRoaXMudHJhaW5hYmxlXywgdGhpcy5uYW1lLCB0aGlzLmR0eXBlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBzbmFwc2hvdCBvZiB0aGUgVmFyaWFibGUncyB2YWx1ZS5cbiAgICpcbiAgICogVGhlIHJldHVybmVkIHZhbHVlIGlzIGEgc25hcHNob3Qgb2YgdGhlIFZhcmlhYmxlJ3MgdmFsdWUgYXQgdGhlIHRpbWUgb2ZcbiAgICogdGhlIGludm9jYXRpb24uIEZ1dHVyZSBtdXRhdGlvbnMgaW4gdGhlIHZhbHVlIG9mIHRoZSB0ZW5zb3Igd2lsbCBvbmx5XG4gICAqIGJlIHJlZmxlY3RlZCBieSBmdXR1cmUgY2FsbHMgdG8gdGhpcyBtZXRob2QuXG4gICAqL1xuICByZWFkKCk6IFRlbnNvciB7XG4gICAgdGhpcy5hc3NlcnROb3REaXNwb3NlZCgpO1xuICAgIHJldHVybiB0aGlzLnZhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIHZhbHVlIG9mIHRoZSBWYXJpYWJsZS5cbiAgICpcbiAgICogQHBhcmFtIG5ld1ZhbDogVGhlIG5ldyB2YWx1ZSB0byB1cGRhdGUgdG8uIE11c3QgYmUgY29uc2lzdGVudCB3aXRoIHRoZVxuICAgKiAgIGR0eXBlIGFuZCBzaGFwZSBvZiB0aGUgVmFyaWFibGUuXG4gICAqIEByZXR1cm4gVGhpcyBWYXJpYWJsZS5cbiAgICovXG4gIHdyaXRlKG5ld1ZhbDogVGVuc29yKSB7XG4gICAgLy8gVE9ETyhjYWlzKTogT25jZSAgVEYuanMgQ29yZSBzdXBwb3J0cyBUZW5zb3IuZHR5cGUsIGNoZWNrIGR0eXBlIG1hdGNoLlxuICAgIHRoaXMuYXNzZXJ0Tm90RGlzcG9zZWQoKTtcbiAgICBjaGVja1NoYXBlc01hdGNoKHRoaXMudmFsLCBuZXdWYWwpO1xuICAgIC8vIFNraXAgdXBkYXRpbmcgaWYgdGhpcyBpcyB0aGUgZXhhY3Qgc2FtZSB0ZW5zb3IuXG4gICAgaWYgKHRoaXMudmFsLmlkICE9PSBuZXdWYWwuaWQpIHtcbiAgICAgIHRoaXMudmFsLmFzc2lnbihuZXdWYWwpO1xuICAgICAgaWYgKHRoaXMuY29uc3RyYWludCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMudmFsLmFzc2lnbih0aGlzLmNvbnN0cmFpbnQuYXBwbHkodGhpcy52YWwpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogRGlzcG9zZSB0aGlzIExheWVyc1ZhcmlhYmxlIGluc3RhbmNlIGZyb20gbWVtb3J5LlxuICAgKi9cbiAgZGlzcG9zZSgpOiB2b2lkIHtcbiAgICB0aGlzLmFzc2VydE5vdERpc3Bvc2VkKCk7XG4gICAgdGhpcy52YWwuZGlzcG9zZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzc2VydE5vdERpc3Bvc2VkKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnZhbC5pc0Rpc3Bvc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYExheWVyc1ZhcmlhYmxlICR7dGhpcy5uYW1lfSBpcyBhbHJlYWR5IGRpc3Bvc2VkLmApO1xuICAgIH1cbiAgfVxuXG4gIGdldCB0cmFpbmFibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudHJhaW5hYmxlXztcbiAgfVxuXG4gIHNldCB0cmFpbmFibGUodHJhaW5hYmxlOiBib29sZWFuKSB7XG4gICAgdGhpcy50cmFpbmFibGVfID0gdHJhaW5hYmxlO1xuICAgIHRoaXMudmFsLnRyYWluYWJsZSA9IHRyYWluYWJsZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja1NoYXBlc01hdGNoKHg6IEhhc1NoYXBlLCB5OiBIYXNTaGFwZSk6IHZvaWQge1xuICBpZiAoeC5zaGFwZS50b1N0cmluZygpICE9PSB5LnNoYXBlLnRvU3RyaW5nKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdTaGFwZSBtaXNtYXRjaDogJyArIEpTT04uc3RyaW5naWZ5KHguc2hhcGUpICsgJyB2cy4gJyArXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHkuc2hhcGUpKTtcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBhIFZhcmlhYmxlLlxuICogQHBhcmFtIHggVGhlIGluaXRpYWwgdmFsdWUgb2YgdGhlIGBWYXJpYWJsZWAuXG4gKiBAcGFyYW0gZHR5cGUgb3B0aW9uYWwsIHRoZSB0eXBlIG9mIHRoZSB2YXJpYWJsZS5cbiAqIEBwYXJhbSBuYW1lIG9wdGlvbmFsLCB0aGUgbmFtZSBvZiB0aGUgdmFyaWFibGUsIGRlZmF1bHQgcHJvdmlkZWQgYnlcbiAqIFZhcmlhYmxlLlxuICogQHBhcmFtIGNvbnN0cmFpbnQgb3B0aW9uYWwsIGEgY29uc3RyYWludCB0byBiZSBhcHBsaWVkIGFmdGVyIGV2ZXJ5IHVwZGF0ZS5cbiAqIEByZXR1cm4gVGhlIG5ld2x5IGluc3RhbnRpYXRlZCBgVmFyaWFibGVgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFyaWFibGUoXG4gICAgeDogVGVuc29yLCBkdHlwZT86IERhdGFUeXBlLCBuYW1lPzogc3RyaW5nLFxuICAgIGNvbnN0cmFpbnQ/OiBDb25zdHJhaW50KTogTGF5ZXJWYXJpYWJsZSB7XG4gIHJldHVybiBuZXcgTGF5ZXJWYXJpYWJsZSh4LCBkdHlwZSwgbmFtZSwgdHJ1ZSwgY29uc3RyYWludCk7XG59XG5cbi8qKlxuICogSW5zdGFudGlhdGVzIGFuIGFsbC16ZXJvcyBWYXJpYWJsZSBhbmQgcmV0dXJucyBpdC5cbiAqXG4gKiBAcGFyYW0gc2hhcGUgU2hhcGUgb2YgdGhlIHRlbnNvci5cbiAqIEBwYXJhbSBkdHlwZSBEVHlwZSBvZiB0aGUgdGVuc29yLlxuICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgdGVuc29yLlxuICogQHJldHVybiBBbiBhbGwtemVybyBWYXJpYWJsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHplcm9zVmFyaWFibGUoXG4gICAgc2hhcGU6IFNoYXBlLCBkdHlwZT86IERhdGFUeXBlLCBuYW1lPzogc3RyaW5nKTogTGF5ZXJWYXJpYWJsZSB7XG4gIC8vIFRPRE8oY2Fpcyk6IEltcGxlbWVudCBsb2dpYyBmb3IgZHR5cGUuXG4gIHJldHVybiBuZXcgTGF5ZXJWYXJpYWJsZSh0ZmMuemVyb3Moc2hhcGUpLCBkdHlwZSwgbmFtZSk7XG59XG5cbi8qKlxuICogSW5zdGFudGlhdGVzIGFuIGFsbC16ZXJvcyB0ZW5zb3Igb2YgdGhlIHNhbWUgc2hhcGUgYXMgYW5vdGhlciB0ZW5zb3IuXG4gKlxuICogQHBhcmFtIHggVGhlIG90aGVyIHRlbnNvci5cbiAqIEBwYXJhbSBkdHlwZSBEVHlwZSBvZiB0aGUgdGVuc29yLlxuICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgdGVuc29yLlxuICogQHJldHVybiBBIG5ld2x5IGluc3RhbnRpYXRlZCBWYXJpYWJsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHplcm9zTGlrZShcbiAgICB4OiBUZW5zb3IsIGR0eXBlPzogRGF0YVR5cGUsIG5hbWU/OiBzdHJpbmcpOiBMYXllclZhcmlhYmxlIHtcbiAgcmV0dXJuIG5ldyBMYXllclZhcmlhYmxlKHRmYy56ZXJvc0xpa2UoeCksIGR0eXBlLCBuYW1lKTtcbn1cblxuLyoqXG4gKiBJbnN0YW50aWF0ZXMgYW4gYWxsLW9uZXMgdGVuc29yIGFuZCByZXR1cm5zIGl0LlxuICpcbiAqIEBwYXJhbSBzaGFwZSBTaGFwZSBvZiB0aGUgdGVuc29yLlxuICogQHBhcmFtIGR0eXBlIERUeXBlIG9mIHRoZSB0ZW5zb3IuXG4gKiBAcGFyYW0gbmFtZSBOYW1lIG9mIHRoZSB0ZW5zb3IuXG4gKiBAcmV0dXJuIEFuIGFsbC1vbmVzIFZhcmlhYmxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gb25lc1ZhcmlhYmxlKFxuICAgIHNoYXBlOiBTaGFwZSwgZHR5cGU/OiBEYXRhVHlwZSwgbmFtZT86IHN0cmluZyk6IExheWVyVmFyaWFibGUge1xuICAvLyBUT0RPKGNhaXMpOiBJbXBsZW1lbnQgbG9naWMgZm9yIGR0eXBlLlxuICBjb25zdCBhbGxvY2F0ZWQgPSB0ZmMub25lcyhzaGFwZSk7XG4gIHJldHVybiBuZXcgTGF5ZXJWYXJpYWJsZShhbGxvY2F0ZWQsIGR0eXBlLCBuYW1lKTtcbn1cblxuLyoqXG4gKiBJbnN0YW50aWF0ZXMgYW4gYWxsLW9uZXMgdGVuc29yIG9mIHRoZSBzYW1lIHNoYXBlIGFzIGFub3RoZXIgdGVuc29yLlxuICpcbiAqIEBwYXJhbSB4IFRoZSBvdGhlciB0ZW5zb3IuXG4gKiBAcGFyYW0gZHR5cGUgRFR5cGUgb2YgdGhlIHRlbnNvci5cbiAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIHRlbnNvci5cbiAqIEByZXR1cm4gQSBuZXdseSBpbnN0YW50aWF0ZWQgVmFyaWFibGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvbmVzTGlrZShcbiAgICB4OiBUZW5zb3IsIGR0eXBlPzogRGF0YVR5cGUsIG5hbWU/OiBzdHJpbmcpOiBMYXllclZhcmlhYmxlIHtcbiAgY29uc3QgYWxsb2NhdGVkID0gdGZjLm9uZXNMaWtlKHgpO1xuICByZXR1cm4gbmV3IExheWVyVmFyaWFibGUoYWxsb2NhdGVkLCBkdHlwZSwgbmFtZSk7XG59XG5cbi8qKlxuICogSW5zdGFudGlhdGUgYW4gaWRlbnRpdHkgbWF0cml4IGFuZCByZXR1cm5zIGl0LCBhcyBhIFZhcmlhYmxlXG4gKlxuICogQHBhcmFtIHNpemUgTnVtYmVyIG9mIHJvd3MvY29sdW1ucy5cbiAqIEBwYXJhbSBkdHlwZSBEYXRhIHR5cGUgb2YgcmV0dXJuZWQgVmFyaWFibGUuXG4gKiBAcGFyYW0gbmFtZSBOYW1lIG9mIHJldHVybmVkIFZhcmlhYmxlLlxuICogQHJldHVybiBBIFZhcmlhYmxlLCBhbiBpZGVudGl0eSBtYXRyaXguXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleWVWYXJpYWJsZShcbiAgICBzaXplOiBudW1iZXIsIGR0eXBlPzogRGF0YVR5cGUsIG5hbWU/OiBzdHJpbmcpOiBMYXllclZhcmlhYmxlIHtcbiAgcmV0dXJuIG5ldyBMYXllclZhcmlhYmxlKHRmYy5leWUoc2l6ZSksIGR0eXBlLCBuYW1lKTtcbn1cblxuLyoqXG4gKiBHZXQgYSBWYXJpYWJsZSB3aXRoIHVuaWZvcm0gZGlzdHJpYnV0aW9uIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSBzaGFwZSBTaGFwZSBvZiB0aGUgdGVuc29yLlxuICogQHBhcmFtIG1pbnZhbCBMb3dlciBib3VuZCBvZiB0aGUgdW5pZm9ybSBkaXN0cmlidXRpb24uXG4gKiBAcGFyYW0gbWF4dmFsIFVwcGVyIGJvdW5kIG9mIHRoZSB1bmlmb3JtIGRpc3RyaWJ1dGlvbi5cbiAqIEBwYXJhbSBkdHlwZVxuICogQHBhcmFtIHNlZWRcbiAqIEBwYXJhbSBuYW1lIE9wdGlvbmFsIG5hbWUuXG4gKiBAcmV0dXJuIFRoZSB1bmlmb3JtLXJhbmRvbSBWYXJpYWJsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbVVuaWZvcm1WYXJpYWJsZShcbiAgICBzaGFwZTogU2hhcGUsIG1pbnZhbDogbnVtYmVyLCBtYXh2YWw6IG51bWJlciwgZHR5cGU/OiBEYXRhVHlwZSxcbiAgICBzZWVkPzogbnVtYmVyLCBuYW1lID0gJ3JhbmRvbVVuaWZvcm0nKTogTGF5ZXJWYXJpYWJsZSB7XG4gIHJldHVybiBuZXcgTGF5ZXJWYXJpYWJsZShcbiAgICAgIHRmYy5yYW5kb21Vbmlmb3JtKHNoYXBlLCBtaW52YWwsIG1heHZhbCwgZHR5cGUpLCBkdHlwZSwgbmFtZSk7XG59XG5cbi8qKlxuICogR2V0IGEgVmFyaWFibGUgd2l0aCB0cnVuY2F0ZWQtbm9ybWFsIGRpc3RyaWJ1dGlvbiBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0gc2hhcGUgU2hhcGUgb2YgdGhlIHRlbnNvci5cbiAqIEBwYXJhbSBtZWFuIG1lYW4gdmFsdWUgb2YgdGhlIG5vcm1hbCBkaXN0cmlidXRpb24uXG4gKiBAcGFyYW0gc3RkZGV2IHN0YW5kYXJkIGRldmlhdGlvbiBvZiB0aGUgbm9ybWFsIGRpc3RyaWJ1dGlvbi5cbiAqIEBwYXJhbSBkdHlwZVxuICogQHBhcmFtIHNlZWRcbiAqIEBwYXJhbSBuYW1lIE9wdGlvbmFsIG5hbWUuXG4gKiBAcmV0dXJuIFRoZSB0cnVuY2F0ZWQtbm9ybWFsLXJhbmRvbSBWYXJpYWJsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRydW5jYXRlZE5vcm1hbFZhcmlhYmxlKFxuICAgIHNoYXBlOiBTaGFwZSwgbWVhbiA9IDAuMCwgc3RkZGV2ID0gMS4wLCBkdHlwZT86IERhdGFUeXBlLCBzZWVkPzogbnVtYmVyLFxuICAgIG5hbWUgPSAndHJ1bmNhdGVkTm9ybWFsJyk6IExheWVyVmFyaWFibGUge1xuICAvLyBUT0RPKGNhaXMpOiBJbXBsZW1lbnQgbG9naWMgZm9yIGR0eXBlIGFuZCBzZWVkIG9uY2UgdGhleSBhcmUgc3VwcG9ydGVkXG4gIC8vIGJ5IGRlZXBsZWFybi5qcy5cbiAgZHR5cGUgPSBkdHlwZSB8fCAnZmxvYXQzMic7XG4gIGlmIChkdHlwZSAhPT0gJ2Zsb2F0MzInICYmIGR0eXBlICE9PSAnaW50MzInKSB7XG4gICAgdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXJyb3IoXG4gICAgICAgIGByYW5kb21Ob3JtYWwgZG9lcyBub3Qgc3VwcG9ydCBkVHlwZSAke2R0eXBlfS5gKTtcbiAgfVxuICByZXR1cm4gbmV3IExheWVyVmFyaWFibGUoXG4gICAgICB0ZmMudHJ1bmNhdGVkTm9ybWFsKHNoYXBlLCBtZWFuLCBzdGRkZXYsIGR0eXBlLCBzZWVkKSwgZHR5cGUsIG5hbWUpO1xufVxuLyoqXG4gKiBHZXQgYSBWYXJpYWJsZSB3aXRoIG5vcm1hbCBkaXN0cmlidXRpb24gb2YgdmFsdWVzLlxuICogQHBhcmFtIHNoYXBlIFNoYXBlIG9mIHRoZSB0ZW5zb3IuXG4gKiBAcGFyYW0gbWVhbiBtZWFuIHZhbHVlIG9mIHRoZSBub3JtYWwgZGlzdHJpYnV0aW9uLlxuICogQHBhcmFtIHN0ZGRldiBzdGFuZGFyZCBkZXZpYXRpb24gb2YgdGhlIG5vcm1hbCBkaXN0cmlidXRpb24uXG4gKiBAcGFyYW0gZHR5cGVcbiAqIEBwYXJhbSBzZWVkXG4gKiBAcGFyYW0gbmFtZSBPcHRpb25hbCBuYW1lLlxuICogQHJldHVybiBUaGUgdHJ1bmNhdGVkLW5vcm1hbC1yYW5kb20gVmFyaWFibGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21Ob3JtYWxWYXJpYWJsZShcbiAgICBzaGFwZTogU2hhcGUsIG1lYW4gPSAwLjAsIHN0ZGRldiA9IDEuMCwgZHR5cGU/OiBEYXRhVHlwZSwgc2VlZD86IG51bWJlcixcbiAgICBuYW1lID0gJ3JhbmRvbU5vcm1hbCcpOiBMYXllclZhcmlhYmxlIHtcbiAgZHR5cGUgPSBkdHlwZSB8fCAnZmxvYXQzMic7XG4gIGlmIChkdHlwZSAhPT0gJ2Zsb2F0MzInICYmIGR0eXBlICE9PSAnaW50MzInKSB7XG4gICAgdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXJyb3IoXG4gICAgICAgIGByYW5kb21Ob3JtYWxWYXJpYWJsZSBkb2VzIG5vdCBzdXBwb3J0IGRUeXBlICR7ZHR5cGV9LmApO1xuICB9XG4gIHJldHVybiBuZXcgTGF5ZXJWYXJpYWJsZShcbiAgICAgIHRmYy5yYW5kb21Ob3JtYWwoc2hhcGUsIG1lYW4sIHN0ZGRldiwgZHR5cGUsIHNlZWQpLCBkdHlwZSwgbmFtZSk7XG59XG5cbi8qKlxuICogVXBkYXRlIHRoZSB2YWx1ZSBvZiBhIFZhcmlhYmxlLlxuICogQHBhcmFtIHggVGhlIFZhcmlhYmxlIHRvIGJlIHVwZGF0ZWQuXG4gKiBAcGFyYW0geE5ldyBUaGUgbmV3IHZhbHVlIHRvIHVwZGF0ZSB0by5cbiAqIEByZXR1cm4gVGhlIFZhcmlhYmxlIHVwZGF0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGUoeDogTGF5ZXJWYXJpYWJsZSwgeE5ldzogVGVuc29yKTogTGF5ZXJWYXJpYWJsZSB7XG4gIHJldHVybiB4LndyaXRlKHhOZXcpO1xufVxuXG4vKipcbiAqIFVwZGF0ZSB0aGUgdmFsdWUgb2YgYSBWYXJpYWJsZSBieSBhZGRpbmcgYW4gaW5jcmVtZW50LlxuICogQHBhcmFtIHggVGhlIFZhcmlhYmxlIHRvIGJlIHVwZGF0ZWQuXG4gKiBAcGFyYW0gaW5jcmVtZW50IFRoZSBpbmNybWVudCB0byBhZGQgdG8gYHhgLlxuICogQHJldHVybiBUaGUgVmFyaWFibGUgdXBkYXRlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUFkZCh4OiBMYXllclZhcmlhYmxlLCBpbmNyZW1lbnQ6IFRlbnNvcik6IExheWVyVmFyaWFibGUge1xuICByZXR1cm4geC53cml0ZSh0ZmMuYWRkKHgucmVhZCgpLCBpbmNyZW1lbnQpKTtcbn1cblxuLyoqXG4gKiBVcGRhdGUgdGhlIHZhbHVlIG9mIGEgVmFyaWFibGUgYnkgc3VidHJhY3RpbmcgYSBkZWNyZW1lbnQuXG4gKiBAcGFyYW0geCBUaGUgVmFyaWFibGUgdG8gYmUgdXBkYXRlZC5cbiAqIEBwYXJhbSBkZWNyZW1lbnQgVGhlIGRlY3JlbWVudCB0byBzdWJ0cmFjdCBmcm9tIGB4YC5cbiAqIEByZXR1cm4gVGhlIFZhcmlhYmxlIHVwZGF0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVTdWIoeDogTGF5ZXJWYXJpYWJsZSwgZGVjcmVtZW50OiBUZW5zb3IpOiBMYXllclZhcmlhYmxlIHtcbiAgcmV0dXJuIHgud3JpdGUodGZjLnN1Yih4LnJlYWQoKSwgZGVjcmVtZW50KSk7XG59XG5cbi8qKlxuICogR2V0IHRoZSB2YWx1ZXMgb2YgYW4gYXJyYXkgb2YgVmFyaWFibGVzLlxuICpcbiAqIEBwYXJhbSB0ZW5zb3JzIEFuIGBBcnJheWAgb2YgYFZhcmlhYmxlYHMgdG8gZ2V0IHRoZSB2YWx1ZXMgb2YuXG4gKiBAcmV0dXJuIFRoZSB2YWx1ZXMgb2YgdGhlIGlucHV0cywgYXMgYW4gYEFycmF5YCBvZmB0Zi5UZW5zb3Jgcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJhdGNoR2V0VmFsdWUoeHM6IExheWVyVmFyaWFibGVbXSk6IFRlbnNvcltdIHtcbiAgcmV0dXJuIHhzLm1hcCh4ID0+IHgucmVhZCgpKTtcbn1cblxuLyoqXG4gKiBVcGRhdGUgdGhlIHZhbHVlIG9mIG11bHRpcGxlIFZhcmlhYmxlcyBhdCBvbmNlLlxuICpcbiAqIEBwYXJhbSB2YXJpYWJsZXNBbmRWYWx1ZXMgQW4gYEFycmF5YCwgZWFjaCBlbGVtZW50IGlzIG9mIHR5cGVcbiAqICAgW1ZhcmlhYmxlLCBUZW5zb3JdLiBUaGUgZmlyc3QgaXRlbSBpcyB0aGVcbiAqICAgYFZhcmlhYmxlYCBvZiB3aGljaCB0aGUgdmFsdWUgaXMgdG8gYmUgdXBkYXRlZC4gVGhlIHNlY29uZCBpdGVtXG4gKiAgIGNhcnJpZXMgdGhlIG5ldyB2YWx1ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJhdGNoU2V0VmFsdWUoXG4gICAgdmFyaWFibGVzQW5kVmFsdWVzOiBBcnJheTxbTGF5ZXJWYXJpYWJsZSwgVGVuc29yXT4pOiB2b2lkIHtcbiAgdmFyaWFibGVzQW5kVmFsdWVzLmZvckVhY2godmFyaWFibGVBbmRWYWx1ZSA9PiB7XG4gICAgY29uc3QgdmFyaWFibGU6IExheWVyVmFyaWFibGUgPSB2YXJpYWJsZUFuZFZhbHVlWzBdO1xuICAgIHZhcmlhYmxlLndyaXRlKHZhcmlhYmxlQW5kVmFsdWVbMV0pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBncmFkaWVudHMgb2YgYHZhcmlhYmxlc2Agdy5yLnQuIHRoZSByZXR1cm4gdmFsdWUgb2YgYGxvc3NGbmAuXG4gKiBAcGFyYW0gbG9zc0ZuIEEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhIFNjYWxhciB0byBiZSB1c2VkIGFzIHRoZSBmdW5jdGlvblxuICogICB2YWx1ZSAoaS5lLiwgbnVtZXJhdG9yKSBmb3IgZGlmZmVyZW50aWF0aW9uLlxuICogQHBhcmFtIHZhcmlhYmxlcyBMaXN0IG9mIHZhcmlhYmxlcyB0byBiZSB1c2VkIGFzIHRoZSBpbmRlcGVuZGVudCB2YXJpYWJsZXNcbiAqICAgKGkuZS4sIGRlbm9taW5hdG9yKSBmb3IgZGlmZmVyZW50aWF0aW9uLlxuICogQHJldHVybnMgQW4gQXJyYXkgb2YgZ3JhZGllbnRzIHRlbnNvcnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBncmFkaWVudHMoXG4gICAgbG9zc0ZuOiAoKSA9PiB0ZmMuU2NhbGFyLCB2YXJpYWJsZXM6IExheWVyVmFyaWFibGVbXSk6IFRlbnNvcltdIHtcbiAgLy8gVE9ETyhjYWlzKTogVGhlIHJldHVybiB0eXBlIHNpZ25hdHVyZSBjYW4gYmUgc2ltcGxpZmllZCBpZiBkZWVwbGVhcm4gbWFrZXNcbiAgLy8gICB0aGUgY29ycmVzcG9uZGluZyB0eXBlIHB1YmxpYy5cbiAgY29uc3QgdmFyaWFibGVMaXN0ID1cbiAgICAgIHZhcmlhYmxlcy5tYXAodmFyaWFibGUgPT4gdmFyaWFibGUucmVhZCgpIGFzIHRmYy5WYXJpYWJsZSk7XG4gIGNvbnN0IHZhbHVkQW5kR3JhZHMgPSB2YXJpYWJsZUdyYWRzKGxvc3NGbiwgdmFyaWFibGVMaXN0KTtcbiAgcmV0dXJuIHZhcmlhYmxlcy5tYXAodmFyaWFibGUgPT4gdmFsdWRBbmRHcmFkcy5ncmFkc1t2YXJpYWJsZS5uYW1lXSk7XG59XG4iXX0=