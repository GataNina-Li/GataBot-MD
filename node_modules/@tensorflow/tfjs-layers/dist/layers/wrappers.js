/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
/**
 * Layers that augment the functionality of a base layer.
 */
import * as tfc from '@tensorflow/tfjs-core';
import { serialization, tidy } from '@tensorflow/tfjs-core';
import * as K from '../backend/tfjs_backend';
import { nameScope } from '../common';
import { InputSpec, Layer, SymbolicTensor } from '../engine/topology';
import { NotImplementedError, ValueError } from '../errors';
import { VALID_BIDIRECTIONAL_MERGE_MODES } from '../keras_format/common';
import * as generic_utils from '../utils/generic_utils';
import { getExactlyOneShape, getExactlyOneTensor } from '../utils/types_utils';
import { rnn, standardizeArgs } from './recurrent';
import { deserialize } from './serialization';
/**
 * Abstract wrapper base class.
 *
 * Wrappers take another layer and augment it in various ways.
 * Do not use this class as a layer, it is only an abstract base class.
 * Two usable wrappers are the `TimeDistributed` and `Bidirectional` wrappers.
 */
export class Wrapper extends Layer {
    constructor(args) {
        // Porting Note: In PyKeras, `self.layer` is set prior to the calling
        //   `super()`. But we can't do that here due to TypeScript's restriction.
        //   See: https://github.com/Microsoft/TypeScript/issues/8277
        //   As a result, we have to add checks in `get trainable()` and
        //   `set trainable()` below in order to prevent using `this.layer` when
        //   its value is `undefined`. The super constructor does use the getter
        //   and the setter of `this.layer`.
        super(args);
        this.layer = args.layer;
    }
    build(inputShape) {
        this.built = true;
    }
    // TODO(cais): Implement activityRegularizer getter.
    get trainable() {
        // Porting Note: the check of `this.layer` here is necessary due to the
        //   way the `constructor` of this class is written (see Porting Note
        //   above).
        if (this.layer != null) {
            return this.layer.trainable;
        }
        else {
            return false;
        }
    }
    set trainable(value) {
        // Porting Note: the check of `this.layer` here is necessary due to the
        //   way the `constructor` of this class is written (see Porting Note
        //   above).
        if (this.layer != null) {
            this.layer.trainable = value;
        }
    }
    get trainableWeights() {
        return this.layer.trainableWeights;
    }
    // TODO(cais): Implement setter for trainableWeights.
    get nonTrainableWeights() {
        return this.layer.nonTrainableWeights;
    }
    // TODO(cais): Implement setter for nonTrainableWeights.
    get updates() {
        // tslint:disable-next-line:no-any
        return this.layer._updates;
    }
    // TODO(cais): Implement getUpdatesFor().
    get losses() {
        return this.layer.losses;
    }
    // TODO(cais): Implement getLossesFor().
    getWeights() {
        return this.layer.getWeights();
    }
    setWeights(weights) {
        this.layer.setWeights(weights);
    }
    getConfig() {
        const config = {
            'layer': {
                'className': this.layer.getClassName(),
                'config': this.layer.getConfig(),
            }
        };
        const baseConfig = super.getConfig();
        Object.assign(config, baseConfig);
        return config;
    }
    setFastWeightInitDuringBuild(value) {
        super.setFastWeightInitDuringBuild(value);
        if (this.layer != null) {
            this.layer.setFastWeightInitDuringBuild(value);
        }
    }
    /** @nocollapse */
    static fromConfig(cls, config, customObjects = {}) {
        const layerConfig = config['layer'];
        const layer = deserialize(layerConfig, customObjects);
        delete config['layer'];
        const newConfig = { layer };
        Object.assign(newConfig, config);
        return new cls(newConfig);
    }
}
export class TimeDistributed extends Wrapper {
    constructor(args) {
        super(args);
        this.supportsMasking = true;
    }
    build(inputShape) {
        inputShape = getExactlyOneShape(inputShape);
        if (inputShape.length < 3) {
            throw new ValueError(`TimeDistributed layer expects an input shape >= 3D, but received ` +
                `input shape ${JSON.stringify(inputShape)}`);
        }
        this.inputSpec = [{ shape: inputShape }];
        const childInputShape = [inputShape[0]].concat(inputShape.slice(2));
        if (!this.layer.built) {
            this.layer.build(childInputShape);
            this.layer.built = true;
        }
        super.build(inputShape);
    }
    computeOutputShape(inputShape) {
        inputShape = getExactlyOneShape(inputShape);
        const childInputShape = [inputShape[0]].concat(inputShape.slice(2));
        const childOutputShape = this.layer.computeOutputShape(childInputShape);
        const timesteps = inputShape[1];
        return [childOutputShape[0], timesteps].concat(childOutputShape.slice(1));
    }
    call(inputs, kwargs) {
        return tidy(() => {
            // TODO(cais): Add 'training' and 'useLearningPhase' to kwargs.
            inputs = getExactlyOneTensor(inputs);
            // Porting Note: In tfjs-layers, `inputs` are always concrete tensor
            // values. Hence the inputs can't have an undetermined first (batch)
            // dimension, which is why we always use the K.rnn approach here.
            const step = (inputs, states) => {
                // TODO(cais): Add useLearningPhase.
                // NOTE(cais): `layer.call` may return a length-1 array of Tensor in
                //   some cases (e.g., `layer` is a `Sequential` instance), which is
                //   why `getExactlyOneTensor` is used below.
                const output = getExactlyOneTensor(this.layer.call(inputs, kwargs));
                return [output, []];
            };
            const rnnOutputs = rnn(step, inputs, [], false /* goBackwards */, null /* mask */, null /* constants */, false /* unroll */, true /* needPerStepOutputs */);
            const y = rnnOutputs[1];
            // TODO(cais): Add activity regularization.
            // TODO(cais): Add useLearningPhase.
            return y;
        });
    }
}
/** @nocollapse */
TimeDistributed.className = 'TimeDistributed';
serialization.registerClass(TimeDistributed);
export function checkBidirectionalMergeMode(value) {
    generic_utils.checkStringTypeUnionValue(VALID_BIDIRECTIONAL_MERGE_MODES, 'BidirectionalMergeMode', value);
}
const DEFAULT_BIDIRECTIONAL_MERGE_MODE = 'concat';
export class Bidirectional extends Wrapper {
    constructor(args) {
        super(args);
        // Note: When creating `this.forwardLayer`, the original Layer object
        //   (`config.layer`) ought to be cloned. This is why we call
        //   `getConfig()` followed by `deserialize()`. Without this cloning,
        //   the layer names saved during serialization will incorrectly contain
        //   the 'forward_' prefix. In Python Keras, this is done using
        //   `copy.copy` (shallow copy), which does not have a simple equivalent
        //   in JavaScript. JavaScript's `Object.assign()` does not copy
        //   methods.
        const layerConfig = args.layer.getConfig();
        const forwDict = {};
        forwDict['className'] = args.layer.getClassName();
        forwDict['config'] = layerConfig;
        this.forwardLayer = deserialize(forwDict);
        layerConfig['goBackwards'] =
            layerConfig['goBackwards'] === true ? false : true;
        const backDict = {};
        backDict['className'] = args.layer.getClassName();
        backDict['config'] = layerConfig;
        this.backwardLayer = deserialize(backDict);
        this.forwardLayer.name = 'forward_' + this.forwardLayer.name;
        this.backwardLayer.name = 'backward_' + this.backwardLayer.name;
        this.mergeMode = args.mergeMode === undefined ?
            DEFAULT_BIDIRECTIONAL_MERGE_MODE :
            args.mergeMode;
        checkBidirectionalMergeMode(this.mergeMode);
        if (args.weights) {
            throw new NotImplementedError('weights support is not implemented for Bidirectional layer yet.');
        }
        this._stateful = args.layer.stateful;
        this.returnSequences = args.layer.returnSequences;
        this.returnState = args.layer.returnState;
        this.supportsMasking = true;
        this._trainable = true;
        this.inputSpec = args.layer.inputSpec;
        this.numConstants = null;
    }
    get trainable() {
        return this._trainable;
    }
    set trainable(value) {
        // Porting Note: the check of `this.layer` here is necessary due to the
        //   way the `constructor` of this class is written (see Porting Note
        //   above).
        this._trainable = value;
        if (this.forwardLayer != null) {
            this.forwardLayer.trainable = value;
        }
        if (this.backwardLayer != null) {
            this.backwardLayer.trainable = value;
        }
    }
    getWeights() {
        return this.forwardLayer.getWeights().concat(this.backwardLayer.getWeights());
    }
    setWeights(weights) {
        const numWeights = weights.length;
        const numeightsOver2 = Math.floor(numWeights / 2);
        this.forwardLayer.setWeights(weights.slice(0, numeightsOver2));
        this.backwardLayer.setWeights(weights.slice(numeightsOver2));
    }
    computeOutputShape(inputShape) {
        let layerShapes = this.forwardLayer.computeOutputShape(inputShape);
        if (!(Array.isArray(layerShapes) && Array.isArray(layerShapes[0]))) {
            layerShapes = [layerShapes];
        }
        layerShapes = layerShapes;
        let outputShape;
        let outputShapes;
        let stateShape;
        if (this.returnState) {
            stateShape = layerShapes.slice(1);
            outputShape = layerShapes[0];
        }
        else {
            outputShape = layerShapes[0];
        }
        outputShape = outputShape;
        if (this.mergeMode === 'concat') {
            outputShape[outputShape.length - 1] *= 2;
            outputShapes = [outputShape];
        }
        else if (this.mergeMode == null) {
            outputShapes = [outputShape, outputShape.slice()];
        }
        else {
            outputShapes = [outputShape];
        }
        if (this.returnState) {
            if (this.mergeMode == null) {
                return outputShapes.concat(stateShape).concat(stateShape.slice());
            }
            return [outputShape].concat(stateShape).concat(stateShape.slice());
        }
        return generic_utils.singletonOrArray(outputShapes);
    }
    apply(inputs, kwargs) {
        let initialState = kwargs == null ? null : kwargs['initialState'];
        let constants = kwargs == null ? null : kwargs['constants'];
        if (kwargs == null) {
            kwargs = {};
        }
        const standardized = standardizeArgs(inputs, initialState, constants, this.numConstants);
        inputs = standardized.inputs;
        initialState = standardized.initialState;
        constants = standardized.constants;
        if (Array.isArray(inputs)) {
            initialState = inputs.slice(1);
            inputs = inputs[0];
        }
        if ((initialState == null || initialState.length === 0) &&
            constants == null) {
            return super.apply(inputs, kwargs);
        }
        const additionalInputs = [];
        const additionalSpecs = [];
        if (initialState != null) {
            const numStates = initialState.length;
            if (numStates % 2 > 0) {
                throw new ValueError('When passing `initialState` to a Bidrectional RNN, ' +
                    'the state should be an Array containing the states of ' +
                    'the underlying RNNs.');
            }
            kwargs['initialState'] = initialState;
            additionalInputs.push(...initialState);
            const stateSpecs = initialState
                .map(state => new InputSpec({ shape: state.shape }));
            this.forwardLayer.stateSpec = stateSpecs.slice(0, numStates / 2);
            this.backwardLayer.stateSpec = stateSpecs.slice(numStates / 2);
            additionalSpecs.push(...stateSpecs);
        }
        if (constants != null) {
            throw new NotImplementedError('Support for constants in Bidirectional layers is not ' +
                'implemented yet.');
        }
        const isSymbolicTensor = additionalInputs[0] instanceof SymbolicTensor;
        for (const tensor of additionalInputs) {
            if (tensor instanceof SymbolicTensor !== isSymbolicTensor) {
                throw new ValueError('The initial state of a Bidirectional layer cannot be ' +
                    'specified as a mix of symbolic and non-symbolic tensors');
            }
        }
        if (isSymbolicTensor) {
            // Compute the full input and specs, including the states.
            const fullInput = [inputs].concat(additionalInputs);
            const fullInputSpec = this.inputSpec.concat(additionalSpecs);
            // Perform the call temporarily and replace inputSpec.
            // Note: with initial states symbolic calls and non-symbolic calls to
            // this method differ in how the initial states are passed. For
            // symbolic calls, the initial states are passed in the first arg, as
            // an Array of SymbolicTensors; for non-symbolic calls, they are
            // passed in the second arg as a part of the kwargs. Hence the need to
            // temporarily modify inputSpec here.
            // TODO(cais): Make refactoring so that this hacky code below is no
            // longer needed.
            const originalInputSpec = this.inputSpec;
            this.inputSpec = fullInputSpec;
            const output = super.apply(fullInput, kwargs);
            this.inputSpec = originalInputSpec;
            return output;
        }
        else {
            return super.apply(inputs, kwargs);
        }
    }
    call(inputs, kwargs) {
        return tidy(() => {
            const initialState = kwargs['initialState'];
            let y;
            let yRev;
            if (initialState == null) {
                y = this.forwardLayer.call(inputs, kwargs);
                yRev = this.backwardLayer.call(inputs, kwargs);
            }
            else {
                const forwardState = initialState.slice(0, initialState.length / 2);
                const backwardState = initialState.slice(initialState.length / 2);
                y = this.forwardLayer.call(inputs, Object.assign(kwargs, { initialState: forwardState }));
                yRev = this.backwardLayer.call(inputs, Object.assign(kwargs, { initialState: backwardState }));
            }
            let states;
            if (this.returnState) {
                if (Array.isArray(y)) {
                    states = y.slice(1).concat(yRev.slice(1));
                }
                else {
                }
                y = y[0];
                yRev = yRev[0];
            }
            if (this.returnSequences) {
                yRev = tfc.reverse(yRev, 1);
            }
            let output;
            if (this.mergeMode === 'concat') {
                output = K.concatenate([y, yRev]);
            }
            else if (this.mergeMode === 'sum') {
                output = tfc.add(y, yRev);
            }
            else if (this.mergeMode === 'ave') {
                output = tfc.mul(.5, tfc.add(y, yRev));
            }
            else if (this.mergeMode === 'mul') {
                output = tfc.mul(y, yRev);
            }
            else if (this.mergeMode == null) {
                output = [y, yRev];
            }
            // TODO(cais): Properly set learning phase.
            if (this.returnState) {
                if (this.mergeMode == null) {
                    return output.concat(states);
                }
                return [output].concat(states);
            }
            return output;
        });
    }
    resetStates(states) {
        this.forwardLayer.resetStates();
        this.backwardLayer.resetStates();
    }
    build(inputShape) {
        nameScope(this.forwardLayer.name, () => {
            this.forwardLayer.build(inputShape);
        });
        nameScope(this.backwardLayer.name, () => {
            this.backwardLayer.build(inputShape);
        });
        this.built = true;
    }
    computeMask(inputs, mask) {
        if (Array.isArray(mask)) {
            mask = mask[0];
        }
        let outputMask;
        if (this.returnSequences) {
            if (this.mergeMode == null) {
                outputMask = [mask, mask];
            }
            else {
                outputMask = mask;
            }
        }
        else {
            if (this.mergeMode == null) {
                outputMask = [null, null];
            }
            else {
                outputMask = null;
            }
        }
        if (this.returnState) {
            const states = this.forwardLayer.states;
            const stateMask = states.map(state => null);
            if (Array.isArray(outputMask)) {
                return outputMask.concat(stateMask).concat(stateMask);
            }
            else {
                return [outputMask].concat(stateMask).concat(stateMask);
            }
        }
        else {
            return outputMask;
        }
    }
    get trainableWeights() {
        return this.forwardLayer.trainableWeights.concat(this.backwardLayer.trainableWeights);
    }
    get nonTrainableWeights() {
        return this.forwardLayer.nonTrainableWeights.concat(this.backwardLayer.nonTrainableWeights);
    }
    // TODO(cais): Implement constraints().
    setFastWeightInitDuringBuild(value) {
        super.setFastWeightInitDuringBuild(value);
        if (this.forwardLayer != null) {
            this.forwardLayer.setFastWeightInitDuringBuild(value);
        }
        if (this.backwardLayer != null) {
            this.backwardLayer.setFastWeightInitDuringBuild(value);
        }
    }
    getConfig() {
        const config = {
            'mergeMode': this.mergeMode,
        };
        // TODO(cais): Add logic for `numConstants` once the property is added.
        const baseConfig = super.getConfig();
        Object.assign(config, baseConfig);
        return config;
    }
    /** @nocollapse */
    static fromConfig(cls, config) {
        const rnnLayer = deserialize(config['layer']);
        delete config['layer'];
        // TODO(cais): Add logic for `numConstants` once the property is added.
        if (config['numConstants'] != null) {
            throw new NotImplementedError(`Deserialization of a Bidirectional layer with numConstants ` +
                `present is not supported yet.`);
        }
        // tslint:disable-next-line:no-any
        const newConfig = config;
        newConfig['layer'] = rnnLayer;
        return new cls(newConfig);
    }
}
/** @nocollapse */
Bidirectional.className = 'Bidirectional';
serialization.registerClass(Bidirectional);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcHBlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWxheWVycy9zcmMvbGF5ZXJzL3dyYXBwZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztHQVFHO0FBRUg7O0dBRUc7QUFFSCxPQUFPLEtBQUssR0FBRyxNQUFNLHVCQUF1QixDQUFDO0FBQzdDLE9BQU8sRUFBQyxhQUFhLEVBQVUsSUFBSSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDbEUsT0FBTyxLQUFLLENBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ3BDLE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFhLGNBQWMsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQy9FLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxVQUFVLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDMUQsT0FBTyxFQUFnQywrQkFBK0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBR3RHLE9BQU8sS0FBSyxhQUFhLE1BQU0sd0JBQXdCLENBQUM7QUFDeEQsT0FBTyxFQUFDLGtCQUFrQixFQUFFLG1CQUFtQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFHN0UsT0FBTyxFQUFDLEdBQUcsRUFBTyxlQUFlLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDdEQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBUzVDOzs7Ozs7R0FNRztBQUNILE1BQU0sT0FBZ0IsT0FBUSxTQUFRLEtBQUs7SUFHekMsWUFBWSxJQUFzQjtRQUNoQyxxRUFBcUU7UUFDckUsMEVBQTBFO1FBQzFFLDZEQUE2RDtRQUM3RCxnRUFBZ0U7UUFDaEUsd0VBQXdFO1FBQ3hFLHdFQUF3RTtRQUN4RSxvQ0FBb0M7UUFDcEMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1osSUFBSSxDQUFDLEtBQUssR0FBRyxJ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VUFBVSxHQUFHLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNyQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNsQyxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQsa0JBQWtCO0lBQ2xCLE1BQU0sQ0FBQyxVQUFVLENBQ2IsR0FBNkMsRUFDN0MsTUFBZ0M7UUFDbEMsTUFBTSxRQUFRLEdBQ1YsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQTZCLENBQVEsQ0FBQztRQUNwRSxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2Qix1RUFBdUU7UUFDdkUsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksSUFBSSxFQUFFO1lBQ2xDLE1BQU0sSUFBSSxtQkFBbUIsQ0FDekIsNkRBQTZEO2dCQUM3RCwrQkFBK0IsQ0FBQyxDQUFDO1NBQ3RDO1FBQ0Qsa0NBQWtDO1FBQ2xDLE1BQU0sU0FBUyxHQUF5QixNQUFNLENBQUM7UUFDL0MsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLFFBQVEsQ0FBQztRQUM5QixPQUFPLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzVCLENBQUM7O0FBL1ZELGtCQUFrQjtBQUNYLHVCQUFTLEdBQUcsZUFBZSxDQUFDO0FBZ1dyQyxhQUFhLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICogbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gKiBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuLyoqXG4gKiBMYXllcnMgdGhhdCBhdWdtZW50IHRoZSBmdW5jdGlvbmFsaXR5IG9mIGEgYmFzZSBsYXllci5cbiAqL1xuXG5pbXBvcnQgKiBhcyB0ZmMgZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbmltcG9ydCB7c2VyaWFsaXphdGlvbiwgVGVuc29yLCB0aWR5fSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0ICogYXMgSyBmcm9tICcuLi9iYWNrZW5kL3RmanNfYmFja2VuZCc7XG5pbXBvcnQge25hbWVTY29wZX0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7SW5wdXRTcGVjLCBMYXllciwgTGF5ZXJBcmdzLCBTeW1ib2xpY1RlbnNvcn0gZnJvbSAnLi4vZW5naW5lL3RvcG9sb2d5JztcbmltcG9ydCB7Tm90SW1wbGVtZW50ZWRFcnJvciwgVmFsdWVFcnJvcn0gZnJvbSAnLi4vZXJyb3JzJztcbmltcG9ydCB7QmlkaXJlY3Rpb25hbE1lcmdlTW9kZSwgU2hhcGUsIFZBTElEX0JJRElSRUNUSU9OQUxfTUVSR0VfTU9ERVN9IGZyb20gJy4uL2tlcmFzX2Zvcm1hdC9jb21tb24nO1xuaW1wb3J0IHtLd2FyZ3N9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7UmVndWxhcml6ZXJGbiwgUm5uU3RlcEZ1bmN0aW9ufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgKiBhcyBnZW5lcmljX3V0aWxzIGZyb20gJy4uL3V0aWxzL2dlbmVyaWNfdXRpbHMnO1xuaW1wb3J0IHtnZXRFeGFjdGx5T25lU2hhcGUsIGdldEV4YWN0bHlPbmVUZW5zb3J9IGZyb20gJy4uL3V0aWxzL3R5cGVzX3V0aWxzJztcbmltcG9ydCB7TGF5ZXJWYXJpYWJsZX0gZnJvbSAnLi4vdmFyaWFibGVzJztcblxuaW1wb3J0IHtybm4sIFJOTiwgc3RhbmRhcmRpemVBcmdzfSBmcm9tICcuL3JlY3VycmVudCc7XG5pbXBvcnQge2Rlc2VyaWFsaXplfSBmcm9tICcuL3NlcmlhbGl6YXRpb24nO1xuXG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgV3JhcHBlckxheWVyQXJncyBleHRlbmRzIExheWVyQXJncyB7XG4gIC8qKlxuICAgKiBUaGUgbGF5ZXIgdG8gYmUgd3JhcHBlZC5cbiAgICovXG4gIGxheWVyOiBMYXllcjtcbn1cblxuLyoqXG4gKiBBYnN0cmFjdCB3cmFwcGVyIGJhc2UgY2xhc3MuXG4gKlxuICogV3JhcHBlcnMgdGFrZSBhbm90aGVyIGxheWVyIGFuZCBhdWdtZW50IGl0IGluIHZhcmlvdXMgd2F5cy5cbiAqIERvIG5vdCB1c2UgdGhpcyBjbGFzcyBhcyBhIGxheWVyLCBpdCBpcyBvbmx5IGFuIGFic3RyYWN0IGJhc2UgY2xhc3MuXG4gKiBUd28gdXNhYmxlIHdyYXBwZXJzIGFyZSB0aGUgYFRpbWVEaXN0cmlidXRlZGAgYW5kIGBCaWRpcmVjdGlvbmFsYCB3cmFwcGVycy5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFdyYXBwZXIgZXh0ZW5kcyBMYXllciB7XG4gIHJlYWRvbmx5IGxheWVyOiBMYXllcjtcblxuICBjb25zdHJ1Y3RvcihhcmdzOiBXcmFwcGVyTGF5ZXJBcmdzKSB7XG4gICAgLy8gUG9ydGluZyBOb3RlOiBJbiBQeUtlcmFzLCBgc2VsZi5sYXllcmAgaXMgc2V0IHByaW9yIHRvIHRoZSBjYWxsaW5nXG4gICAgLy8gICBgc3VwZXIoKWAuIEJ1dCB3ZSBjYW4ndCBkbyB0aGF0IGhlcmUgZHVlIHRvIFR5cGVTY3JpcHQncyByZXN0cmljdGlvbi5cbiAgICAvLyAgIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy84Mjc3XG4gICAgLy8gICBBcyBhIHJlc3VsdCwgd2UgaGF2ZSB0byBhZGQgY2hlY2tzIGluIGBnZXQgdHJhaW5hYmxlKClgIGFuZFxuICAgIC8vICAgYHNldCB0cmFpbmFibGUoKWAgYmVsb3cgaW4gb3JkZXIgdG8gcHJldmVudCB1c2luZyBgdGhpcy5sYXllcmAgd2hlblxuICAgIC8vICAgaXRzIHZhbHVlIGlzIGB1bmRlZmluZWRgLiBUaGUgc3VwZXIgY29uc3RydWN0b3IgZG9lcyB1c2UgdGhlIGdldHRlclxuICAgIC8vICAgYW5kIHRoZSBzZXR0ZXIgb2YgYHRoaXMubGF5ZXJgLlxuICAgIHN1cGVyKGFyZ3MpO1xuICAgIHRoaXMubGF5ZXIgPSBhcmdzLmxheWVyO1xuICB9XG5cbiAgYnVpbGQoaW5wdXRTaGFwZTogU2hhcGV8U2hhcGVbXSk6IHZvaWQge1xuICAgIHRoaXMuYnVpbHQgPSB0cnVlO1xuICB9XG5cbiAgLy8gVE9ETyhjYWlzKTogSW1wbGVtZW50IGFjdGl2aXR5UmVndWxhcml6ZXIgZ2V0dGVyLlxuXG4gIGdldCB0cmFpbmFibGUoKTogYm9vbGVhbiB7XG4gICAgLy8gUG9ydGluZyBOb3RlOiB0aGUgY2hlY2sgb2YgYHRoaXMubGF5ZXJgIGhlcmUgaXMgbmVjZXNzYXJ5IGR1ZSB0byB0aGVcbiAgICAvLyAgIHdheSB0aGUgYGNvbnN0cnVjdG9yYCBvZiB0aGlzIGNsYXNzIGlzIHdyaXR0ZW4gKHNlZSBQb3J0aW5nIE5vdGVcbiAgICAvLyAgIGFib3ZlKS5cbiAgICBpZiAodGhpcy5sYXllciAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5sYXllci50cmFpbmFibGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBzZXQgdHJhaW5hYmxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgLy8gUG9ydGluZyBOb3RlOiB0aGUgY2hlY2sgb2YgYHRoaXMubGF5ZXJgIGhlcmUgaXMgbmVjZXNzYXJ5IGR1ZSB0byB0aGVcbiAgICAvLyAgIHdheSB0aGUgYGNvbnN0cnVjdG9yYCBvZiB0aGlzIGNsYXNzIGlzIHdyaXR0ZW4gKHNlZSBQb3J0aW5nIE5vdGVcbiAgICAvLyAgIGFib3ZlKS5cbiAgICBpZiAodGhpcy5sYXllciAhPSBudWxsKSB7XG4gICAgICB0aGlzLmxheWVyLnRyYWluYWJsZSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGdldCB0cmFpbmFibGVXZWlnaHRzKCk6IExheWVyVmFyaWFibGVbXSB7XG4gICAgcmV0dXJuIHRoaXMubGF5ZXIudHJhaW5hYmxlV2VpZ2h0cztcbiAgfVxuICAvLyBUT0RPKGNhaXMpOiBJbXBsZW1lbnQgc2V0dGVyIGZvciB0cmFpbmFibGVXZWlnaHRzLlxuXG4gIGdldCBub25UcmFpbmFibGVXZWlnaHRzKCk6IExheWVyVmFyaWFibGVbXSB7XG4gICAgcmV0dXJuIHRoaXMubGF5ZXIubm9uVHJhaW5hYmxlV2VpZ2h0cztcbiAgfVxuICAvLyBUT0RPKGNhaXMpOiBJbXBsZW1lbnQgc2V0dGVyIGZvciBub25UcmFpbmFibGVXZWlnaHRzLlxuXG4gIGdldCB1cGRhdGVzKCk6IFRlbnNvcltdIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgcmV0dXJuICh0aGlzLmxheWVyIGFzIGFueSkuX3VwZGF0ZXM7XG4gIH1cblxuICAvLyBUT0RPKGNhaXMpOiBJbXBsZW1lbnQgZ2V0VXBkYXRlc0ZvcigpLlxuXG4gIGdldCBsb3NzZXMoKTogUmVndWxhcml6ZXJGbltdIHtcbiAgICByZXR1cm4gdGhpcy5sYXllci5sb3NzZXM7XG4gIH1cblxuICAvLyBUT0RPKGNhaXMpOiBJbXBsZW1lbnQgZ2V0TG9zc2VzRm9yKCkuXG5cbiAgZ2V0V2VpZ2h0cygpOiBUZW5zb3JbXSB7XG4gICAgcmV0dXJuIHRoaXMubGF5ZXIuZ2V0V2VpZ2h0cygpO1xuICB9XG5cbiAgc2V0V2VpZ2h0cyh3ZWlnaHRzOiBUZW5zb3JbXSk6IHZvaWQge1xuICAgIHRoaXMubGF5ZXIuc2V0V2VpZ2h0cyh3ZWlnaHRzKTtcbiAgfVxuXG4gIGdldENvbmZpZygpOiBzZXJpYWxpemF0aW9uLkNvbmZpZ0RpY3Qge1xuICAgIGNvbnN0IGNvbmZpZzogc2VyaWFsaXphdGlvbi5Db25maWdEaWN0ID0ge1xuICAgICAgJ2xheWVyJzoge1xuICAgICAgICAnY2xhc3NOYW1lJzogdGhpcy5sYXllci5nZXRDbGFzc05hbWUoKSxcbiAgICAgICAgJ2NvbmZpZyc6IHRoaXMubGF5ZXIuZ2V0Q29uZmlnKCksXG4gICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBiYXNlQ29uZmlnID0gc3VwZXIuZ2V0Q29uZmlnKCk7XG4gICAgT2JqZWN0LmFzc2lnbihjb25maWcsIGJhc2VDb25maWcpO1xuICAgIHJldHVybiBjb25maWc7XG4gIH1cblxuICBzZXRGYXN0V2VpZ2h0SW5pdER1cmluZ0J1aWxkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgc3VwZXIuc2V0RmFzdFdlaWdodEluaXREdXJpbmdCdWlsZCh2YWx1ZSk7XG4gICAgaWYgKHRoaXMubGF5ZXIgIT0gbnVsbCkge1xuICAgICAgdGhpcy5sYXllci5zZXRGYXN0V2VpZ2h0SW5pdER1cmluZ0J1aWxkKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIGZyb21Db25maWc8VCBleHRlbmRzIHNlcmlhbGl6YXRpb24uU2VyaWFsaXphYmxlPihcbiAgICAgIGNsczogc2VyaWFsaXphdGlvbi5TZXJpYWxpemFibGVDb25zdHJ1Y3RvcjxUPixcbiAgICAgIGNvbmZpZzogc2VyaWFsaXphdGlvbi5Db25maWdEaWN0LFxuICAgICAgY3VzdG9tT2JqZWN0cyA9IHt9IGFzIHNlcmlhbGl6YXRpb24uQ29uZmlnRGljdCk6IFQge1xuICAgIGNvbnN0IGxheWVyQ29uZmlnID0gY29uZmlnWydsYXllciddIGFzIHNlcmlhbGl6YXRpb24uQ29uZmlnRGljdDtcbiAgICBjb25zdCBsYXllciA9IGRlc2VyaWFsaXplKGxheWVyQ29uZmlnLCBjdXN0b21PYmplY3RzKSBhcyBMYXllcjtcbiAgICBkZWxldGUgY29uZmlnWydsYXllciddO1xuICAgIGNvbnN0IG5ld0NvbmZpZyA9IHtsYXllcn07XG4gICAgT2JqZWN0LmFzc2lnbihuZXdDb25maWcsIGNvbmZpZyk7XG4gICAgcmV0dXJuIG5ldyBjbHMobmV3Q29uZmlnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGltZURpc3RyaWJ1dGVkIGV4dGVuZHMgV3JhcHBlciB7XG4gIC8qKiBAbm9jb2xsYXBzZSAqL1xuICBzdGF0aWMgY2xhc3NOYW1lID0gJ1RpbWVEaXN0cmlidXRlZCc7XG4gIGNvbnN0cnVjdG9yKGFyZ3M6IFdyYXBwZXJMYXllckFyZ3MpIHtcbiAgICBzdXBlcihhcmdzKTtcbiAgICB0aGlzLnN1cHBvcnRzTWFza2luZyA9IHRydWU7XG4gIH1cblxuICBidWlsZChpbnB1dFNoYXBlOiBTaGFwZXxTaGFwZVtdKTogdm9pZCB7XG4gICAgaW5wdXRTaGFwZSA9IGdldEV4YWN0bHlPbmVTaGFwZShpbnB1dFNoYXBlKTtcbiAgICBpZiAoaW5wdXRTaGFwZS5sZW5ndGggPCAzKSB7XG4gICAgICB0aHJvdyBuZXcgVmFsdWVFcnJvcihcbiAgICAgICAgICBgVGltZURpc3RyaWJ1dGVkIGxheWVyIGV4cGVjdHMgYW4gaW5wdXQgc2hhcGUgPj0gM0QsIGJ1dCByZWNlaXZlZCBgICtcbiAgICAgICAgICBgaW5wdXQgc2hhcGUgJHtKU09OLnN0cmluZ2lmeShpbnB1dFNoYXBlKX1gKTtcbiAgICB9XG4gICAgdGhpcy5pbnB1dFNwZWMgPSBbe3NoYXBlOiBpbnB1dFNoYXBlfV07XG4gICAgY29uc3QgY2hpbGRJbnB1dFNoYXBlID0gW2lucHV0U2hhcGVbMF1dLmNvbmNhdChpbnB1dFNoYXBlLnNsaWNlKDIpKTtcbiAgICBpZiAoIXRoaXMubGF5ZXIuYnVpbHQpIHtcbiAgICAgIHRoaXMubGF5ZXIuYnVpbGQoY2hpbGRJbnB1dFNoYXBlKTtcbiAgICAgIHRoaXMubGF5ZXIuYnVpbHQgPSB0cnVlO1xuICAgIH1cbiAgICBzdXBlci5idWlsZChpbnB1dFNoYXBlKTtcbiAgfVxuXG4gIGNvbXB1dGVPdXRwdXRTaGFwZShpbnB1dFNoYXBlOiBTaGFwZXxTaGFwZVtdKTogU2hhcGV8U2hhcGVbXSB7XG4gICAgaW5wdXRTaGFwZSA9IGdldEV4YWN0bHlPbmVTaGFwZShpbnB1dFNoYXBlKTtcbiAgICBjb25zdCBjaGlsZElucHV0U2hhcGUgPSBbaW5wdXRTaGFwZVswXV0uY29uY2F0KGlucHV0U2hhcGUuc2xpY2UoMikpO1xuICAgIGNvbnN0IGNoaWxkT3V0cHV0U2hhcGUgPVxuICAgICAgICB0aGlzLmxheWVyLmNvbXB1dGVPdXRwdXRTaGFwZShjaGlsZElucHV0U2hhcGUpIGFzIFNoYXBlO1xuICAgIGNvbnN0IHRpbWVzdGVwcyA9IGlucHV0U2hhcGVbMV07XG4gICAgcmV0dXJuIFtjaGlsZE91dHB1dFNoYXBlWzBdLCB0aW1lc3RlcHNdLmNvbmNhdChjaGlsZE91dHB1dFNoYXBlLnNsaWNlKDEpKTtcbiAgfVxuXG4gIGNhbGwoaW5wdXRzOiBUZW5zb3J8VGVuc29yW10sIGt3YXJnczogS3dhcmdzKTogVGVuc29yfFRlbnNvcltdIHtcbiAgICByZXR1cm4gdGlkeSgoKSA9PiB7XG4gICAgICAvLyBUT0RPKGNhaXMpOiBBZGQgJ3RyYWluaW5nJyBhbmQgJ3VzZUxlYXJuaW5nUGhhc2UnIHRvIGt3YXJncy5cbiAgICAgIGlucHV0cyA9IGdldEV4YWN0bHlPbmVUZW5zb3IoaW5wdXRzKTtcbiAgICAgIC8vIFBvcnRpbmcgTm90ZTogSW4gdGZqcy1sYXllcnMsIGBpbnB1dHNgIGFyZSBhbHdheXMgY29uY3JldGUgdGVuc29yXG4gICAgICAvLyB2YWx1ZXMuIEhlbmNlIHRoZSBpbnB1dHMgY2FuJ3QgaGF2ZSBhbiB1bmRldGVybWluZWQgZmlyc3QgKGJhdGNoKVxuICAgICAgLy8gZGltZW5zaW9uLCB3aGljaCBpcyB3aHkgd2UgYWx3YXlzIHVzZSB0aGUgSy5ybm4gYXBwcm9hY2ggaGVyZS5cbiAgICAgIGNvbnN0IHN0ZXA6IFJublN0ZXBGdW5jdGlvbiA9IChpbnB1dHM6IFRlbnNvciwgc3RhdGVzOiBUZW5zb3JbXSkgPT4ge1xuICAgICAgICAvLyBUT0RPKGNhaXMpOiBBZGQgdXNlTGVhcm5pbmdQaGFzZS5cbiAgICAgICAgLy8gTk9URShjYWlzKTogYGxheWVyLmNhbGxgIG1heSByZXR1cm4gYSBsZW5ndGgtMSBhcnJheSBvZiBUZW5zb3IgaW5cbiAgICAgICAgLy8gICBzb21lIGNhc2VzIChlLmcuLCBgbGF5ZXJgIGlzIGEgYFNlcXVlbnRpYWxgIGluc3RhbmNlKSwgd2hpY2ggaXNcbiAgICAgICAgLy8gICB3aHkgYGdldEV4YWN0bHlPbmVUZW5zb3JgIGlzIHVzZWQgYmVsb3cuXG4gICAgICAgIGNvbnN0IG91dHB1dCA9IGdldEV4YWN0bHlPbmVUZW5zb3IodGhpcy5sYXllci5jYWxsKGlucHV0cywga3dhcmdzKSk7XG4gICAgICAgIHJldHVybiBbb3V0cHV0LCBbXV07XG4gICAgICB9O1xuICAgICAgY29uc3Qgcm5uT3V0cHV0cyA9XG4gICAgICAgICAgcm5uKHN0ZXAsIGlucHV0cywgW10sIGZhbHNlIC8qIGdvQmFja3dhcmRzICovLCBudWxsIC8qIG1hc2sgKi8sXG4gICAgICAgICAgICAgIG51bGwgLyogY29uc3RhbnRzICovLCBmYWxzZSAvKiB1bnJvbGwgKi8sXG4gICAgICAgICAgICAgIHRydWUgLyogbmVlZFBlclN0ZXBPdXRwdXRzICovKTtcbiAgICAgIGNvbnN0IHkgPSBybm5PdXRwdXRzWzFdO1xuICAgICAgLy8gVE9ETyhjYWlzKTogQWRkIGFjdGl2aXR5IHJlZ3VsYXJpemF0aW9uLlxuICAgICAgLy8gVE9ETyhjYWlzKTogQWRkIHVzZUxlYXJuaW5nUGhhc2UuXG4gICAgICByZXR1cm4geTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFRPRE8oY2Fpcyk6IEltcGxlbWVudCBkZXRhaWxlZCBjb21wdXRlTWFzaygpIGxvZ2ljLlxufVxuc2VyaWFsaXphdGlvbi5yZWdpc3RlckNsYXNzKFRpbWVEaXN0cmlidXRlZCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0JpZGlyZWN0aW9uYWxNZXJnZU1vZGUodmFsdWU/OiBzdHJpbmcpOiB2b2lkIHtcbiAgZ2VuZXJpY191dGlscy5jaGVja1N0cmluZ1R5cGVVbmlvblZhbHVlKFxuICAgICAgVkFMSURfQklESVJFQ1RJT05BTF9NRVJHRV9NT0RFUywgJ0JpZGlyZWN0aW9uYWxNZXJnZU1vZGUnLCB2YWx1ZSk7XG59XG5cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBCaWRpcmVjdGlvbmFsTGF5ZXJBcmdzIGV4dGVuZHMgV3JhcHBlckxheWVyQXJncyB7XG4gIC8qKlxuICAgKiBUaGUgaW5zdGFuY2Ugb2YgYW4gYFJOTmAgbGF5ZXIgdG8gYmUgd3JhcHBlZC5cbiAgICovXG4gIGxheWVyOiBSTk47XG5cbiAgLyoqXG4gICAqIE1vZGUgYnkgd2hpY2ggb3V0cHV0cyBvZiB0aGUgZm9yd2FyZCBhbmQgYmFja3dhcmQgUk5OcyBhcmVcbiAgICogY29tYmluZWQuIElmIGBudWxsYCBvciBgdW5kZWZpbmVkYCwgdGhlIG91dHB1dCB3aWxsIG5vdCBiZVxuICAgKiBjb21iaW5lZCwgdGhleSB3aWxsIGJlIHJldHVybmVkIGFzIGFuIGBBcnJheWAuXG4gICAqXG4gICAqIElmIGB1bmRlZmluZWRgIChpLmUuLCBub3QgcHJvdmlkZWQpLCBkZWZhdWx0cyB0byBgJ2NvbmNhdCdgLlxuICAgKi9cbiAgbWVyZ2VNb2RlPzogQmlkaXJlY3Rpb25hbE1lcmdlTW9kZTtcbn1cblxuY29uc3QgREVGQVVMVF9CSURJUkVDVElPTkFMX01FUkdFX01PREU6IEJpZGlyZWN0aW9uYWxNZXJnZU1vZGUgPSAnY29uY2F0JztcblxuZXhwb3J0IGNsYXNzIEJpZGlyZWN0aW9uYWwgZXh0ZW5kcyBXcmFwcGVyIHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBjbGFzc05hbWUgPSAnQmlkaXJlY3Rpb25hbCc7XG4gIG1lcmdlTW9kZTogQmlkaXJlY3Rpb25hbE1lcmdlTW9kZTtcbiAgcHJpdmF0ZSBmb3J3YXJkTGF5ZXI6IFJOTjtcbiAgcHJpdmF0ZSBiYWNrd2FyZExheWVyOiBSTk47XG4gIHByaXZhdGUgcmV0dXJuU2VxdWVuY2VzOiBib29sZWFuO1xuICBwcml2YXRlIHJldHVyblN0YXRlOiBib29sZWFuO1xuICBwcml2YXRlIG51bUNvbnN0YW50cz86IG51bWJlcjtcbiAgcHJpdmF0ZSBfdHJhaW5hYmxlOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKGFyZ3M6IEJpZGlyZWN0aW9uYWxMYXllckFyZ3MpIHtcbiAgICBzdXBlcihhcmdzKTtcblxuICAgIC8vIE5vdGU6IFdoZW4gY3JlYXRpbmcgYHRoaXMuZm9yd2FyZExheWVyYCwgdGhlIG9yaWdpbmFsIExheWVyIG9iamVjdFxuICAgIC8vICAgKGBjb25maWcubGF5ZXJgKSBvdWdodCB0byBiZSBjbG9uZWQuIFRoaXMgaXMgd2h5IHdlIGNhbGxcbiAgICAvLyAgIGBnZXRDb25maWcoKWAgZm9sbG93ZWQgYnkgYGRlc2VyaWFsaXplKClgLiBXaXRob3V0IHRoaXMgY2xvbmluZyxcbiAgICAvLyAgIHRoZSBsYXllciBuYW1lcyBzYXZlZCBkdXJpbmcgc2VyaWFsaXphdGlvbiB3aWxsIGluY29ycmVjdGx5IGNvbnRhaW5cbiAgICAvLyAgIHRoZSAnZm9yd2FyZF8nIHByZWZpeC4gSW4gUHl0aG9uIEtlcmFzLCB0aGlzIGlzIGRvbmUgdXNpbmdcbiAgICAvLyAgIGBjb3B5LmNvcHlgIChzaGFsbG93IGNvcHkpLCB3aGljaCBkb2VzIG5vdCBoYXZlIGEgc2ltcGxlIGVxdWl2YWxlbnRcbiAgICAvLyAgIGluIEphdmFTY3JpcHQuIEphdmFTY3JpcHQncyBgT2JqZWN0LmFzc2lnbigpYCBkb2VzIG5vdCBjb3B5XG4gICAgLy8gICBtZXRob2RzLlxuICAgIGNvbnN0IGxheWVyQ29uZmlnID0gYXJncy5sYXllci5nZXRDb25maWcoKTtcbiAgICBjb25zdCBmb3J3RGljdDogc2VyaWFsaXphdGlvbi5Db25maWdEaWN0ID0ge307XG4gICAgZm9yd0RpY3RbJ2NsYXNzTmFtZSddID0gYXJncy5sYXllci5nZXRDbGFzc05hbWUoKTtcbiAgICBmb3J3RGljdFsnY29uZmlnJ10gPSBsYXllckNvbmZpZztcbiAgICB0aGlzLmZvcndhcmRMYXllciA9IGRlc2VyaWFsaXplKGZvcndEaWN0KSBhcyBSTk47XG4gICAgbGF5ZXJDb25maWdbJ2dvQmFja3dhcmRzJ10gPVxuICAgICAgICBsYXllckNvbmZpZ1snZ29CYWNrd2FyZHMnXSA9PT0gdHJ1ZSA/IGZhbHNlIDogdHJ1ZTtcbiAgICBjb25zdCBiYWNrRGljdDogc2VyaWFsaXphdGlvbi5Db25maWdEaWN0ID0ge307XG4gICAgYmFja0RpY3RbJ2NsYXNzTmFtZSddID0gYXJncy5sYXllci5nZXRDbGFzc05hbWUoKTtcbiAgICBiYWNrRGljdFsnY29uZmlnJ10gPSBsYXllckNvbmZpZztcbiAgICB0aGlzLmJhY2t3YXJkTGF5ZXIgPSBkZXNlcmlhbGl6ZShiYWNrRGljdCkgYXMgUk5OO1xuICAgIHRoaXMuZm9yd2FyZExheWVyLm5hbWUgPSAnZm9yd2FyZF8nICsgdGhpcy5mb3J3YXJkTGF5ZXIubmFtZTtcbiAgICB0aGlzLmJhY2t3YXJkTGF5ZXIubmFtZSA9ICdiYWNrd2FyZF8nICsgdGhpcy5iYWNrd2FyZExheWVyLm5hbWU7XG5cbiAgICB0aGlzLm1lcmdlTW9kZSA9IGFyZ3MubWVyZ2VNb2RlID09PSB1bmRlZmluZWQgP1xuICAgICAgICBERUZBVUxUX0JJRElSRUNUSU9OQUxfTUVSR0VfTU9ERSA6XG4gICAgICAgIGFyZ3MubWVyZ2VNb2RlO1xuICAgIGNoZWNrQmlkaXJlY3Rpb25hbE1lcmdlTW9kZSh0aGlzLm1lcmdlTW9kZSk7XG4gICAgaWYgKGFyZ3Mud2VpZ2h0cykge1xuICAgICAgdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXJyb3IoXG4gICAgICAgICAgJ3dlaWdodHMgc3VwcG9ydCBpcyBub3QgaW1wbGVtZW50ZWQgZm9yIEJpZGlyZWN0aW9uYWwgbGF5ZXIgeWV0LicpO1xuICAgIH1cbiAgICB0aGlzLl9zdGF0ZWZ1bCA9IGFyZ3MubGF5ZXIuc3RhdGVmdWw7XG4gICAgdGhpcy5yZXR1cm5TZXF1ZW5jZXMgPSBhcmdzLmxheWVyLnJldHVyblNlcXVlbmNlcztcbiAgICB0aGlzLnJldHVyblN0YXRlID0gYXJncy5sYXllci5yZXR1cm5TdGF0ZTtcbiAgICB0aGlzLnN1cHBvcnRzTWFza2luZyA9IHRydWU7XG4gICAgdGhpcy5fdHJhaW5hYmxlID0gdHJ1ZTtcbiAgICB0aGlzLmlucHV0U3BlYyA9IGFyZ3MubGF5ZXIuaW5wdXRTcGVjO1xuICAgIHRoaXMubnVtQ29uc3RhbnRzID0gbnVsbDtcbiAgfVxuXG4gIGdldCB0cmFpbmFibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYWluYWJsZTtcbiAgfVxuXG4gIHNldCB0cmFpbmFibGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAvLyBQb3J0aW5nIE5vdGU6IHRoZSBjaGVjayBvZiBgdGhpcy5sYXllcmAgaGVyZSBpcyBuZWNlc3NhcnkgZHVlIHRvIHRoZVxuICAgIC8vICAgd2F5IHRoZSBgY29uc3RydWN0b3JgIG9mIHRoaXMgY2xhc3MgaXMgd3JpdHRlbiAoc2VlIFBvcnRpbmcgTm90ZVxuICAgIC8vICAgYWJvdmUpLlxuICAgIHRoaXMuX3RyYWluYWJsZSA9IHZhbHVlO1xuICAgIGlmICh0aGlzLmZvcndhcmRMYXllciAhPSBudWxsKSB7XG4gICAgICB0aGlzLmZvcndhcmRMYXllci50cmFpbmFibGUgPSB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuYmFja3dhcmRMYXllciAhPSBudWxsKSB7XG4gICAgICB0aGlzLmJhY2t3YXJkTGF5ZXIudHJhaW5hYmxlID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgZ2V0V2VpZ2h0cygpOiBUZW5zb3JbXSB7XG4gICAgcmV0dXJuIHRoaXMuZm9yd2FyZExheWVyLmdldFdlaWdodHMoKS5jb25jYXQoXG4gICAgICAgIHRoaXMuYmFja3dhcmRMYXllci5nZXRXZWlnaHRzKCkpO1xuICB9XG5cbiAgc2V0V2VpZ2h0cyh3ZWlnaHRzOiBUZW5zb3JbXSk6IHZvaWQge1xuICAgIGNvbnN0IG51bVdlaWdodHMgPSB3ZWlnaHRzLmxlbmd0aDtcbiAgICBjb25zdCBudW1laWdodHNPdmVyMiA9IE1hdGguZmxvb3IobnVtV2VpZ2h0cyAvIDIpO1xuICAgIHRoaXMuZm9yd2FyZExheWVyLnNldFdlaWdodHMod2VpZ2h0cy5zbGljZSgwLCBudW1laWdodHNPdmVyMikpO1xuICAgIHRoaXMuYmFja3dhcmRMYXllci5zZXRXZWlnaHRzKHdlaWdodHMuc2xpY2UobnVtZWlnaHRzT3ZlcjIpKTtcbiAgfVxuXG4gIGNvbXB1dGVPdXRwdXRTaGFwZShpbnB1dFNoYXBlOiBTaGFwZXxTaGFwZVtdKTogU2hhcGV8U2hhcGVbXSB7XG4gICAgbGV0IGxheWVyU2hhcGVzOiBTaGFwZXxTaGFwZVtdID1cbiAgICAgICAgdGhpcy5mb3J3YXJkTGF5ZXIuY29tcHV0ZU91dHB1dFNoYXBlKGlucHV0U2hhcGUpO1xuICAgIGlmICghKEFycmF5LmlzQXJyYXkobGF5ZXJTaGFwZXMpICYmIEFycmF5LmlzQXJyYXkobGF5ZXJTaGFwZXNbMF0pKSkge1xuICAgICAgbGF5ZXJTaGFwZXMgPSBbbGF5ZXJTaGFwZXMgYXMgU2hhcGVdO1xuICAgIH1cbiAgICBsYXllclNoYXBlcyA9IGxheWVyU2hhcGVzIGFzIFNoYXBlW107XG5cbiAgICBsZXQgb3V0cHV0U2hhcGU6IFNoYXBlO1xuICAgIGxldCBvdXRwdXRTaGFwZXM6IFNoYXBlW107XG4gICAgbGV0IHN0YXRlU2hhcGU6IFNoYXBlW107XG4gICAgaWYgKHRoaXMucmV0dXJuU3RhdGUpIHtcbiAgICAgIHN0YXRlU2hhcGUgPSBsYXllclNoYXBlcy5zbGljZSgxKTtcbiAgICAgIG91dHB1dFNoYXBlID0gbGF5ZXJTaGFwZXNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dFNoYXBlID0gbGF5ZXJTaGFwZXNbMF07XG4gICAgfVxuICAgIG91dHB1dFNoYXBlID0gb3V0cHV0U2hhcGU7XG4gICAgaWYgKHRoaXMubWVyZ2VNb2RlID09PSAnY29uY2F0Jykge1xuICAgICAgb3V0cHV0U2hhcGVbb3V0cHV0U2hhcGUubGVuZ3RoIC0gMV0gKj0gMjtcbiAgICAgIG91dHB1dFNoYXBlcyA9IFtvdXRwdXRTaGFwZV07XG4gICAgfSBlbHNlIGlmICh0aGlzLm1lcmdlTW9kZSA9PSBudWxsKSB7XG4gICAgICBvdXRwdXRTaGFwZXMgPSBbb3V0cHV0U2hhcGUsIG91dHB1dFNoYXBlLnNsaWNlKCldO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXRTaGFwZXMgPSBbb3V0cHV0U2hhcGVdO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJldHVyblN0YXRlKSB7XG4gICAgICBpZiAodGhpcy5tZXJnZU1vZGUgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gb3V0cHV0U2hhcGVzLmNvbmNhdChzdGF0ZVNoYXBlKS5jb25jYXQoc3RhdGVTaGFwZS5zbGljZSgpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbb3V0cHV0U2hhcGVdLmNvbmNhdChzdGF0ZVNoYXBlKS5jb25jYXQoc3RhdGVTaGFwZS5zbGljZSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIGdlbmVyaWNfdXRpbHMuc2luZ2xldG9uT3JBcnJheShvdXRwdXRTaGFwZXMpO1xuICB9XG5cbiAgYXBwbHkoXG4gICAgICBpbnB1dHM6IFRlbnNvcnxUZW5zb3JbXXxTeW1ib2xpY1RlbnNvcnxTeW1ib2xpY1RlbnNvcltdLFxuICAgICAga3dhcmdzPzogS3dhcmdzKTogVGVuc29yfFRlbnNvcltdfFN5bWJvbGljVGVuc29yfFN5bWJvbGljVGVuc29yW10ge1xuICAgIGxldCBpbml0aWFsU3RhdGU6IFRlbnNvcltdfFN5bWJvbGljVGVuc29yW10gPVxuICAgICAgICBrd2FyZ3MgPT0gbnVsbCA/IG51bGwgOiBrd2FyZ3NbJ2luaXRpYWxTdGF0ZSddO1xuICAgIGxldCBjb25zdGFudHM6IFRlbnNvcltdfFN5bWJvbGljVGVuc29yW10gPVxuICAgICAgICBrd2FyZ3MgPT0gbnVsbCA/IG51bGwgOiBrd2FyZ3NbJ2NvbnN0YW50cyddO1xuICAgIGlmIChrd2FyZ3MgPT0gbnVsbCkge1xuICAgICAga3dhcmdzID0ge307XG4gICAgfVxuICAgIGNvbnN0IHN0YW5kYXJkaXplZCA9XG4gICAgICAgIHN0YW5kYXJkaXplQXJncyhpbnB1dHMsIGluaXRpYWxTdGF0ZSwgY29uc3RhbnRzLCB0aGlzLm51bUNvbnN0YW50cyk7XG4gICAgaW5wdXRzID0gc3RhbmRhcmRpemVkLmlucHV0cztcbiAgICBpbml0aWFsU3RhdGUgPSBzdGFuZGFyZGl6ZWQuaW5pdGlhbFN0YXRlO1xuICAgIGNvbnN0YW50cyA9IHN0YW5kYXJkaXplZC5jb25zdGFudHM7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShpbnB1dHMpKSB7XG4gICAgICBpbml0aWFsU3RhdGUgPSAoaW5wdXRzIGFzIFRlbnNvcltdIHwgU3ltYm9saWNUZW5zb3JbXSkuc2xpY2UoMSk7XG4gICAgICBpbnB1dHMgPSAoaW5wdXRzIGFzIFRlbnNvcltdIHwgU3ltYm9saWNUZW5zb3JbXSlbMF07XG4gICAgfVxuXG4gICAgaWYgKChpbml0aWFsU3RhdGUgPT0gbnVsbCB8fCBpbml0aWFsU3RhdGUubGVuZ3RoID09PSAwKSAmJlxuICAgICAgICBjb25zdGFudHMgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHN1cGVyLmFwcGx5KGlucHV0cywga3dhcmdzKTtcbiAgICB9XG4gICAgY29uc3QgYWRkaXRpb25hbElucHV0czogQXJyYXk8VGVuc29yfFN5bWJvbGljVGVuc29yPiA9IFtdO1xuICAgIGNvbnN0IGFkZGl0aW9uYWxTcGVjczogSW5wdXRTcGVjW10gPSBbXTtcbiAgICBpZiAoaW5pdGlhbFN0YXRlICE9IG51bGwpIHtcbiAgICAgIGNvbnN0IG51bVN0YXRlcyA9IGluaXRpYWxTdGF0ZS5sZW5ndGg7XG4gICAgICBpZiAobnVtU3RhdGVzICUgMiA+IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IFZhbHVlRXJyb3IoXG4gICAgICAgICAgICAnV2hlbiBwYXNzaW5nIGBpbml0aWFsU3RhdGVgIHRvIGEgQmlkcmVjdGlvbmFsIFJOTiwgJyArXG4gICAgICAgICAgICAndGhlIHN0YXRlIHNob3VsZCBiZSBhbiBBcnJheSBjb250YWluaW5nIHRoZSBzdGF0ZXMgb2YgJyArXG4gICAgICAgICAgICAndGhlIHVuZGVybHlpbmcgUk5Ocy4nKTtcbiAgICAgIH1cbiAgICAgIGt3YXJnc1snaW5pdGlhbFN0YXRlJ10gPSBpbml0aWFsU3RhdGU7XG4gICAgICBhZGRpdGlvbmFsSW5wdXRzLnB1c2goLi4uaW5pdGlhbFN0YXRlKTtcbiAgICAgIGNvbnN0IHN0YXRlU3BlY3MgPSAoaW5pdGlhbFN0YXRlIGFzIEFycmF5PFRlbnNvcnxTeW1ib2xpY1RlbnNvcj4pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoc3RhdGUgPT4gbmV3IElucHV0U3BlYyh7c2hhcGU6IHN0YXRlLnNoYXBlfSkpO1xuICAgICAgdGhpcy5mb3J3YXJkTGF5ZXIuc3RhdGVTcGVjID0gc3RhdGVTcGVjcy5zbGljZSgwLCBudW1TdGF0ZXMgLyAyKTtcbiAgICAgIHRoaXMuYmFja3dhcmRMYXllci5zdGF0ZVNwZWMgPSBzdGF0ZVNwZWNzLnNsaWNlKG51bVN0YXRlcyAvIDIpO1xuICAgICAgYWRkaXRpb25hbFNwZWNzLnB1c2goLi4uc3RhdGVTcGVjcyk7XG4gICAgfVxuICAgIGlmIChjb25zdGFudHMgIT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXJyb3IoXG4gICAgICAgICAgJ1N1cHBvcnQgZm9yIGNvbnN0YW50cyBpbiBCaWRpcmVjdGlvbmFsIGxheWVycyBpcyBub3QgJyArXG4gICAgICAgICAgJ2ltcGxlbWVudGVkIHlldC4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBpc1N5bWJvbGljVGVuc29yID0gYWRkaXRpb25hbElucHV0c1swXSBpbnN0YW5jZW9mIFN5bWJvbGljVGVuc29yO1xuICAgIGZvciAoY29uc3QgdGVuc29yIG9mIGFkZGl0aW9uYWxJbnB1dHMpIHtcbiAgICAgIGlmICh0ZW5zb3IgaW5zdGFuY2VvZiBTeW1ib2xpY1RlbnNvciAhPT0gaXNTeW1ib2xpY1RlbnNvcikge1xuICAgICAgICB0aHJvdyBuZXcgVmFsdWVFcnJvcihcbiAgICAgICAgICAgICdUaGUgaW5pdGlhbCBzdGF0ZSBvZiBhIEJpZGlyZWN0aW9uYWwgbGF5ZXIgY2Fubm90IGJlICcgK1xuICAgICAgICAgICAgJ3NwZWNpZmllZCBhcyBhIG1peCBvZiBzeW1ib2xpYyBhbmQgbm9uLXN5bWJvbGljIHRlbnNvcnMnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNTeW1ib2xpY1RlbnNvcikge1xuICAgICAgLy8gQ29tcHV0ZSB0aGUgZnVsbCBpbnB1dCBhbmQgc3BlY3MsIGluY2x1ZGluZyB0aGUgc3RhdGVzLlxuICAgICAgY29uc3QgZnVsbElucHV0ID0gW2lucHV0c10uY29uY2F0KGFkZGl0aW9uYWxJbnB1dHMpO1xuICAgICAgY29uc3QgZnVsbElucHV0U3BlYyA9IHRoaXMuaW5wdXRTcGVjLmNvbmNhdChhZGRpdGlvbmFsU3BlY3MpO1xuICAgICAgLy8gUGVyZm9ybSB0aGUgY2FsbCB0ZW1wb3JhcmlseSBhbmQgcmVwbGFjZSBpbnB1dFNwZWMuXG4gICAgICAvLyBOb3RlOiB3aXRoIGluaXRpYWwgc3RhdGVzIHN5bWJvbGljIGNhbGxzIGFuZCBub24tc3ltYm9saWMgY2FsbHMgdG9cbiAgICAgIC8vIHRoaXMgbWV0aG9kIGRpZmZlciBpbiBob3cgdGhlIGluaXRpYWwgc3RhdGVzIGFyZSBwYXNzZWQuIEZvclxuICAgICAgLy8gc3ltYm9saWMgY2FsbHMsIHRoZSBpbml0aWFsIHN0YXRlcyBhcmUgcGFzc2VkIGluIHRoZSBmaXJzdCBhcmcsIGFzXG4gICAgICAvLyBhbiBBcnJheSBvZiBTeW1ib2xpY1RlbnNvcnM7IGZvciBub24tc3ltYm9saWMgY2FsbHMsIHRoZXkgYXJlXG4gICAgICAvLyBwYXNzZWQgaW4gdGhlIHNlY29uZCBhcmcgYXMgYSBwYXJ0IG9mIHRoZSBrd2FyZ3MuIEhlbmNlIHRoZSBuZWVkIHRvXG4gICAgICAvLyB0ZW1wb3JhcmlseSBtb2RpZnkgaW5wdXRTcGVjIGhlcmUuXG4gICAgICAvLyBUT0RPKGNhaXMpOiBNYWtlIHJlZmFjdG9yaW5nIHNvIHRoYXQgdGhpcyBoYWNreSBjb2RlIGJlbG93IGlzIG5vXG4gICAgICAvLyBsb25nZXIgbmVlZGVkLlxuICAgICAgY29uc3Qgb3JpZ2luYWxJbnB1dFNwZWMgPSB0aGlzLmlucHV0U3BlYztcbiAgICAgIHRoaXMuaW5wdXRTcGVjID0gZnVsbElucHV0U3BlYztcbiAgICAgIGNvbnN0IG91dHB1dCA9XG4gICAgICAgICAgc3VwZXIuYXBwbHkoZnVsbElucHV0IGFzIFRlbnNvcltdIHwgU3ltYm9saWNUZW5zb3JbXSwga3dhcmdzKTtcbiAgICAgIHRoaXMuaW5wdXRTcGVjID0gb3JpZ2luYWxJbnB1dFNwZWM7XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc3VwZXIuYXBwbHkoaW5wdXRzLCBrd2FyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIGNhbGwoaW5wdXRzOiBUZW5zb3J8VGVuc29yW10sIGt3YXJnczogS3dhcmdzKTogVGVuc29yfFRlbnNvcltdIHtcbiAgICByZXR1cm4gdGlkeSgoKSA9PiB7XG4gICAgICBjb25zdCBpbml0aWFsU3RhdGUgPSBrd2FyZ3NbJ2luaXRpYWxTdGF0ZSddO1xuXG4gICAgICBsZXQgeTogVGVuc29yfFRlbnNvcltdO1xuICAgICAgbGV0IHlSZXY6IFRlbnNvcnxUZW5zb3JbXTtcbiAgICAgIGlmIChpbml0aWFsU3RhdGUgPT0gbnVsbCkge1xuICAgICAgICB5ID0gdGhpcy5mb3J3YXJkTGF5ZXIuY2FsbChpbnB1dHMsIGt3YXJncyk7XG4gICAgICAgIHlSZXYgPSB0aGlzLmJhY2t3YXJkTGF5ZXIuY2FsbChpbnB1dHMsIGt3YXJncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBmb3J3YXJkU3RhdGUgPSBpbml0aWFsU3RhdGUuc2xpY2UoMCwgaW5pdGlhbFN0YXRlLmxlbmd0aCAvIDIpO1xuICAgICAgICBjb25zdCBiYWNrd2FyZFN0YXRlID0gaW5pdGlhbFN0YXRlLnNsaWNlKGluaXRpYWxTdGF0ZS5sZW5ndGggLyAyKTtcbiAgICAgICAgeSA9IHRoaXMuZm9yd2FyZExheWVyLmNhbGwoXG4gICAgICAgICAgICBpbnB1dHMsIE9iamVjdC5hc3NpZ24oa3dhcmdzLCB7aW5pdGlhbFN0YXRlOiBmb3J3YXJkU3RhdGV9KSk7XG4gICAgICAgIHlSZXYgPSB0aGlzLmJhY2t3YXJkTGF5ZXIuY2FsbChcbiAgICAgICAgICAgIGlucHV0cywgT2JqZWN0LmFzc2lnbihrd2FyZ3MsIHtpbml0aWFsU3RhdGU6IGJhY2t3YXJkU3RhdGV9KSk7XG4gICAgICB9XG5cbiAgICAgIGxldCBzdGF0ZXM6IFRlbnNvcltdO1xuICAgICAgaWYgKHRoaXMucmV0dXJuU3RhdGUpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoeSkpIHtcbiAgICAgICAgICBzdGF0ZXMgPSB5LnNsaWNlKDEpLmNvbmNhdCgoeVJldiBhcyBUZW5zb3JbXSkuc2xpY2UoMSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICB9XG4gICAgICAgIHkgPSAoeSBhcyBUZW5zb3JbXSlbMF07XG4gICAgICAgIHlSZXYgPSAoeVJldiBhcyBUZW5zb3JbXSlbMF07XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnJldHVyblNlcXVlbmNlcykge1xuICAgICAgICB5UmV2ID0gdGZjLnJldmVyc2UoeVJldiBhcyBUZW5zb3IsIDEpO1xuICAgICAgfVxuXG4gICAgICBsZXQgb3V0cHV0OiBUZW5zb3J8VGVuc29yW107XG4gICAgICBpZiAodGhpcy5tZXJnZU1vZGUgPT09ICdjb25jYXQnKSB7XG4gICAgICAgIG91dHB1dCA9IEsuY29uY2F0ZW5hdGUoW3kgYXMgVGVuc29yLCB5UmV2IGFzIFRlbnNvcl0pO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm1lcmdlTW9kZSA9PT0gJ3N1bScpIHtcbiAgICAgICAgb3V0cHV0ID0gdGZjLmFkZCh5IGFzIFRlbnNvciwgeVJldiBhcyBUZW5zb3IpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm1lcmdlTW9kZSA9PT0gJ2F2ZScpIHtcbiAgICAgICAgb3V0cHV0ID0gdGZjLm11bCguNSwgdGZjLmFkZCh5IGFzIFRlbnNvciwgeVJldiBhcyBUZW5zb3IpKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tZXJnZU1vZGUgPT09ICdtdWwnKSB7XG4gICAgICAgIG91dHB1dCA9IHRmYy5tdWwoeSBhcyBUZW5zb3IsIHlSZXYgYXMgVGVuc29yKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tZXJnZU1vZGUgPT0gbnVsbCkge1xuICAgICAgICBvdXRwdXQgPSBbeSBhcyBUZW5zb3IsIHlSZXYgYXMgVGVuc29yXTtcbiAgICAgIH1cblxuICAgICAgLy8gVE9ETyhjYWlzKTogUHJvcGVybHkgc2V0IGxlYXJuaW5nIHBoYXNlLlxuICAgICAgaWYgKHRoaXMucmV0dXJuU3RhdGUpIHtcbiAgICAgICAgaWYgKHRoaXMubWVyZ2VNb2RlID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gKG91dHB1dCBhcyBUZW5zb3JbXSkuY29uY2F0KHN0YXRlcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtvdXRwdXQgYXMgVGVuc29yXS5jb25jYXQoc3RhdGVzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSk7XG4gIH1cblxuICByZXNldFN0YXRlcyhzdGF0ZXM/OiBUZW5zb3J8VGVuc29yW10pOiB2b2lkIHtcbiAgICB0aGlzLmZvcndhcmRMYXllci5yZXNldFN0YXRlcygpO1xuICAgIHRoaXMuYmFja3dhcmRMYXllci5yZXNldFN0YXRlcygpO1xuICB9XG5cbiAgYnVpbGQoaW5wdXRTaGFwZTogU2hhcGV8U2hhcGVbXSk6IHZvaWQge1xuICAgIG5hbWVTY29wZSh0aGlzLmZvcndhcmRMYXllci5uYW1lLCAoKSA9PiB7XG4gICAgICB0aGlzLmZvcndhcmRMYXllci5idWlsZChpbnB1dFNoYXBlKTtcbiAgICB9KTtcbiAgICBuYW1lU2NvcGUodGhpcy5iYWNrd2FyZExheWVyLm5hbWUsICgpID0+IHtcbiAgICAgIHRoaXMuYmFja3dhcmRMYXllci5idWlsZChpbnB1dFNoYXBlKTtcbiAgICB9KTtcbiAgICB0aGlzLmJ1aWx0ID0gdHJ1ZTtcbiAgfVxuXG4gIGNvbXB1dGVNYXNrKGlucHV0czogVGVuc29yfFRlbnNvcltdLCBtYXNrPzogVGVuc29yfFRlbnNvcltdKTogVGVuc29yXG4gICAgICB8VGVuc29yW10ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG1hc2spKSB7XG4gICAgICBtYXNrID0gbWFza1swXTtcbiAgICB9XG4gICAgbGV0IG91dHB1dE1hc2s6IFRlbnNvcnxUZW5zb3JbXTtcbiAgICBpZiAodGhpcy5yZXR1cm5TZXF1ZW5jZXMpIHtcbiAgICAgIGlmICh0aGlzLm1lcmdlTW9kZSA9PSBudWxsKSB7XG4gICAgICAgIG91dHB1dE1hc2sgPSBbbWFzaywgbWFza107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXRNYXNrID0gbWFzaztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMubWVyZ2VNb2RlID09IG51bGwpIHtcbiAgICAgICAgb3V0cHV0TWFzayA9IFtudWxsLCBudWxsXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dE1hc2sgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5yZXR1cm5TdGF0ZSkge1xuICAgICAgY29uc3Qgc3RhdGVzID0gdGhpcy5mb3J3YXJkTGF5ZXIuc3RhdGVzO1xuICAgICAgY29uc3Qgc3RhdGVNYXNrOiBUZW5zb3JbXSA9IHN0YXRlcy5tYXAoc3RhdGUgPT4gbnVsbCk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShvdXRwdXRNYXNrKSkge1xuICAgICAgICByZXR1cm4gb3V0cHV0TWFzay5jb25jYXQoc3RhdGVNYXNrKS5jb25jYXQoc3RhdGVNYXNrKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbb3V0cHV0TWFza10uY29uY2F0KHN0YXRlTWFzaykuY29uY2F0KHN0YXRlTWFzayk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvdXRwdXRNYXNrO1xuICAgIH1cbiAgfVxuXG4gIGdldCB0cmFpbmFibGVXZWlnaHRzKCk6IExheWVyVmFyaWFibGVbXSB7XG4gICAgcmV0dXJuIHRoaXMuZm9yd2FyZExheWVyLnRyYWluYWJsZVdlaWdodHMuY29uY2F0KFxuICAgICAgICB0aGlzLmJhY2t3YXJkTGF5ZXIudHJhaW5hYmxlV2VpZ2h0cyk7XG4gIH1cblxuICBnZXQgbm9uVHJhaW5hYmxlV2VpZ2h0cygpOiBMYXllclZhcmlhYmxlW10ge1xuICAgIHJldHVybiB0aGlzLmZvcndhcmRMYXllci5ub25UcmFpbmFibGVXZWlnaHRzLmNvbmNhdChcbiAgICAgICAgdGhpcy5iYWNrd2FyZExheWVyLm5vblRyYWluYWJsZVdlaWdodHMpO1xuICB9XG5cbiAgLy8gVE9ETyhjYWlzKTogSW1wbGVtZW50IGNvbnN0cmFpbnRzKCkuXG5cbiAgc2V0RmFzdFdlaWdodEluaXREdXJpbmdCdWlsZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHN1cGVyLnNldEZhc3RXZWlnaHRJbml0RHVyaW5nQnVpbGQodmFsdWUpO1xuICAgIGlmICh0aGlzLmZvcndhcmRMYXllciAhPSBudWxsKSB7XG4gICAgICB0aGlzLmZvcndhcmRMYXllci5zZXRGYXN0V2VpZ2h0SW5pdER1cmluZ0J1aWxkKHZhbHVlKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuYmFja3dhcmRMYXllciAhPSBudWxsKSB7XG4gICAgICB0aGlzLmJhY2t3YXJkTGF5ZXIuc2V0RmFzdFdlaWdodEluaXREdXJpbmdCdWlsZCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0Q29uZmlnKCk6IHNlcmlhbGl6YXRpb24uQ29uZmlnRGljdCB7XG4gICAgY29uc3QgY29uZmlnOiBzZXJpYWxpemF0aW9uLkNvbmZpZ0RpY3QgPSB7XG4gICAgICAnbWVyZ2VNb2RlJzogdGhpcy5tZXJnZU1vZGUsXG4gICAgfTtcbiAgICAvLyBUT0RPKGNhaXMpOiBBZGQgbG9naWMgZm9yIGBudW1Db25zdGFudHNgIG9uY2UgdGhlIHByb3BlcnR5IGlzIGFkZGVkLlxuICAgIGNvbnN0IGJhc2VDb25maWcgPSBzdXBlci5nZXRDb25maWcoKTtcbiAgICBPYmplY3QuYXNzaWduKGNvbmZpZywgYmFzZUNvbmZpZyk7XG4gICAgcmV0dXJuIGNvbmZpZztcbiAgfVxuXG4gIC8qKiBAbm9jb2xsYXBzZSAqL1xuICBzdGF0aWMgZnJvbUNvbmZpZzxUIGV4dGVuZHMgc2VyaWFsaXphdGlvbi5TZXJpYWxpemFibGU+KFxuICAgICAgY2xzOiBzZXJpYWxpemF0aW9uLlNlcmlhbGl6YWJsZUNvbnN0cnVjdG9yPFQ+LFxuICAgICAgY29uZmlnOiBzZXJpYWxpemF0aW9uLkNvbmZpZ0RpY3QpOiBUIHtcbiAgICBjb25zdCBybm5MYXllciA9XG4gICAgICAgIGRlc2VyaWFsaXplKGNvbmZpZ1snbGF5ZXInXSBhcyBzZXJpYWxpemF0aW9uLkNvbmZpZ0RpY3QpIGFzIFJOTjtcbiAgICBkZWxldGUgY29uZmlnWydsYXllciddO1xuICAgIC8vIFRPRE8oY2Fpcyk6IEFkZCBsb2dpYyBmb3IgYG51bUNvbnN0YW50c2Agb25jZSB0aGUgcHJvcGVydHkgaXMgYWRkZWQuXG4gICAgaWYgKGNvbmZpZ1snbnVtQ29uc3RhbnRzJ10gIT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXJyb3IoXG4gICAgICAgICAgYERlc2VyaWFsaXphdGlvbiBvZiBhIEJpZGlyZWN0aW9uYWwgbGF5ZXIgd2l0aCBudW1Db25zdGFudHMgYCArXG4gICAgICAgICAgYHByZXNlbnQgaXMgbm90IHN1cHBvcnRlZCB5ZXQuYCk7XG4gICAgfVxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICBjb25zdCBuZXdDb25maWc6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0gY29uZmlnO1xuICAgIG5ld0NvbmZpZ1snbGF5ZXInXSA9IHJubkxheWVyO1xuICAgIHJldHVybiBuZXcgY2xzKG5ld0NvbmZpZyk7XG4gIH1cbn1cbnNlcmlhbGl6YXRpb24ucmVnaXN0ZXJDbGFzcyhCaWRpcmVjdGlvbmFsKTtcbiJdfQ==