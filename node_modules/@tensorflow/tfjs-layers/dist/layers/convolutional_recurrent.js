/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as tfc from '@tensorflow/tfjs-core';
import { util } from '@tensorflow/tfjs-core';
import * as K from '../backend/tfjs_backend';
import { checkDataFormat, checkPaddingMode } from '../common';
import { InputSpec } from '../engine/topology';
import { AttributeError, NotImplementedError, ValueError } from '../errors';
import { Initializer } from '../initializers';
import { convOutputLength, normalizeArray } from '../utils/conv_utils';
import { assertPositiveInteger } from '../utils/generic_utils';
import { getExactlyOneShape } from '../utils/types_utils';
import { generateDropoutMask, LSTMCell, RNN, RNNCell } from './recurrent';
class ConvRNN2DCell extends RNNCell {
}
/**
 * Base class for convolutional-recurrent layers.
 */
class ConvRNN2D extends RNN {
    constructor(args) {
        if (args.unroll) {
            throw new NotImplementedError('Unrolling is not possible with convolutional RNNs.');
        }
        if (Array.isArray(args.cell)) {
            throw new NotImplementedError('It is not possible at the moment to stack convolutional cells.');
        }
        super(args);
        this.inputSpec = [new InputSpec({ ndim: 5 })];
    }
    call(inputs, kwargs) {
        return tfc.tidy(() => {
            if (this.cell.dropoutMask != null) {
                tfc.dispose(this.cell.dropoutMask);
                this.cell.dropoutMask = null;
            }
            if (this.cell.recurrentDropoutMask != null) {
                tfc.dispose(this.cell.recurrentDropoutMask);
                this.cell.recurrentDropoutMask = null;
            }
            if (kwargs && kwargs['constants']) {
                throw new ValueError('ConvRNN2D cell does not support constants');
            }
            const mask = kwargs == null ? null : kwargs['mask'];
            const training = kwargs == null ? null : kwargs['training'];
            const initialState = kwargs == null ? null : kwargs['initialState'];
            return super.call(inputs, { mask, training, initialState });
        });
    }
    computeOutputShape(inputShape) {
        let outShape = this.computeSingleOutputShape(inputShape);
        if (!this.returnSequences) {
            outShape = [outShape[0], ...outShape.slice(2)];
        }
        if (this.returnState) {
            outShape =
                [outShape, ...Array(2).fill([inputShape[0], ...outShape.slice(-3)])];
        }
        return outShape;
    }
    getInitialState(inputs) {
        return tfc.tidy(() => {
            const { stateSize } = this.cell;
            const inputShape = inputs.shape;
            const outputShape = this.computeSingleOutputShape(inputShape);
            const stateShape = [outputShape[0], ...outputShape.slice(2)];
            const initialState = tfc.zeros(stateShape);
            if (Array.isArray(stateSize)) {
                return Array(stateSize.length).fill(initialState);
            }
            return [initialState];
        });
    }
    resetStates(states, training = false) {
        tfc.tidy(() => {
            if (!this.stateful) {
                throw new AttributeError('Cannot call resetStates() on an RNN Layer that is not stateful.');
            }
            const inputShape = this.inputSpec[0].shape;
            const outputShape = this.computeSingleOutputShape(inputShape);
            const stateShape = [outputShape[0], ...outputShape.slice(2)];
            const batchSize = inputShape[0];
            if (batchSize == null) {
                throw new ValueError('If an RNN is stateful, it needs to know its batch size. Specify ' +
                    'the batch size of your input tensors: \n' +
                    '- If using a Sequential model, specify the batch size by ' +
                    'passing a `batchInputShape` option to your first layer.\n' +
                    '- If using the functional API, specify the batch size by ' +
                    'passing a `batchShape` option to your Input layer.');
            }
            // Initialize state if null.
            if (this.getStates() == null) {
                if (Array.isArray(this.cell.stateSize)) {
                    this.states_ = this.cell.stateSize.map(() => tfc.zeros(stateShape));
                }
                else {
                    this.states_ = [tfc.zeros(stateShape)];
                }
            }
            else if (states == null) {
                // Dispose old state tensors.
                tfc.dispose(this.states_);
                // For stateful RNNs, fully dispose kept old states.
                if (this.keptStates != null) {
                    tfc.dispose(this.keptStates);
                    this.keptStates = [];
                }
                if (Array.isArray(this.cell.stateSize)) {
                    this.states_ = this.cell.stateSize.map(() => tfc.zeros(stateShape));
                }
                else {
                    this.states_[0] = tfc.zeros(stateShape);
                }
            }
            else {
                if (!Array.isArray(states)) {
                    states = [states];
                }
                if (states.length !== this.states_.length) {
                    throw new ValueError(`Layer ${this.name} expects ${this.states_.length} state(s), ` +
                        `but it received ${states.length} state value(s). Input ` +
                        `received: ${states}`);
                }
                if (training) {
                    // Store old state tensors for complete disposal later, i.e., during
                    // the next no-arg call to this method. We do not dispose the old
                    // states immediately because that BPTT (among other things) require
                    // them.
                    this.keptStates.push(this.states_.slice());
                }
                else {
                    tfc.dispose(this.states_);
                }
                for (let index = 0; index < this.states_.length; ++index) {
                    const value = states[index];
                    const expectedShape = stateShape;
                    if (!util.arraysEqual(value.shape, expectedShape)) {
                        throw new ValueError(`State ${index} is incompatible with layer ${this.name}: ` +
                            `expected shape=${expectedShape}, received shape=${value.shape}`);
                    }
                    this.states_[index] = value;
                }
            }
            this.states_ = this.states_.map(state => tfc.keep(state.clone()));
        });
    }
    computeSingleOutputShape(inputShape) {
        const { dataFormat, filters, kernelSize, padding, strides, dilationRate } = this.cell;
        const isChannelsFirst = dataFormat === 'channelsFirst';
        const h = inputShape[isChannelsFirst ? 3 : 2];
        const w = inputShape[isChannelsFirst ? 4 : 3];
        const hOut = convOutputLength(h, kernelSize[0], padding, strides[0], dilationRate[0]);
        const wOut = convOutputLength(w, kernelSize[1], padding, strides[1], dilationRate[1]);
        const outShape = [
            ...inputShape.slice(0, 2),
            ...(isChannelsFirst ? [filters, hOut, wOut] : [hOut, wOut, filters])
        ];
        return outShape;
    }
}
/** @nocollapse */
ConvRNN2D.className = 'ConvRNN2D';
export class ConvLSTM2DCell extends LSTMCell {
    constructor(args) {
        const { filters, kernelSize, strides, padding, dataFormat, dilationRate, } = args;
        super(Object.assign({}, args, { units: filters }));
        this.filters = filters;
        assertPositiveInteger(this.filters, 'filters');
        this.kernelSize = normalizeArray(kernelSize, 2, 'kernelSize');
        this.kernelSize.forEach(size => assertPositiveInteger(size, 'kernelSize'));
        this.strides = normalizeArray(strides || 1, 2, 'strides');
        this.strides.forEach(stride => assertPositiveInteger(stride, 'strides'));
        this.padding = padding || 'valid';
        checkPaddingMode(this.padding);
        this.dataFormat = dataFormat || 'channelsLast';
        checkDataFormat(this.dataFormat);
        this.dilationRate = normalizeArray(dilationRate || 1, 2, 'dilationRate');
        this.dilationRate.forEach(rate => assertPositiveInteger(rate, 'dilationRate'));
    }
    build(inputShape) {
        var _a;
        inputShape = getExactlyOneShape(inputShape);
        const channelAxis = this.dataFormat === 'channelsFirst' ? 1 : inputShape.length - 1;
        if (inputShape[channelAxis] == null) {
            throw new ValueError(`The channel dimension of the input should be defined. ` +
                `Found ${inputShape[channelAxis]}`);
        }
        const inputDim = inputShape[channelAxis];
        const numOfKernels = 4;
        const kernelShape = this.kernelSize.concat([inputDim, this.filters * numOfKernels]);
        this.kernel = this.addWeight('kernel', kernelShape, null, this.kernelInitializer, this.kernelRegularizer, true, this.kernelConstraint);
        const recurrentKernelShape = this.kernelSize.concat([this.filters, this.filters * numOfKernels]);
        this.recurrentKernel = this.addWeight('recurrent_kernel', recurrentKernelShape, null, this.recurrentInitializer, this.recurrentRegularizer, true, this.recurrentConstraint);
        if (this.useBias) {
            let biasInitializer;
            if (this.unitForgetBias) {
                const init = this.biasInitializer;
                const filters = this.filters;
                biasInitializer = new (_a = class CustomInit extends Initializer {
                        apply(shape, dtype) {
                            const biasI = init.apply([filters]);
                            const biasF = tfc.ones([filters]);
                            const biasCAndO = init.apply([filters * 2]);
                            return K.concatenate([biasI, biasF, biasCAndO]);
                        }
                    },
                    /** @nocollapse */
                    _a.className = 'CustomInit',
                    _a)();
            }
            else {
                biasInitializer = this.biasInitializer;
            }
            this.bias = this.addWeight('bias', [this.filters * numOfKernels], null, biasInitializer, this.biasRegularizer, true, this.biasConstraint);
        }
        this.built = true;
    }
    call(inputs, kwargs) {
        return tfc.tidy(() => {
            if (inputs.length !== 3) {
                throw new ValueError(`ConvLSTM2DCell expects 3 input Tensors (inputs, h, c), got ` +
                    `${inputs.length}.`);
            }
            const training = kwargs['training'] || false;
            const x = inputs[0]; // Current input
            const hTMinus1 = inputs[1]; // Previous memory state.
            const cTMinus1 = inputs[2]; // Previous carry state.
            const numOfKernels = 4;
            if (0 < this.dropout && this.dropout < 1 && this.dropoutMask == null) {
                this.dropoutMask = generateDropoutMask({
                    ones: () => tfc.onesLike(x),
                    rate: this.dropout,
                    training,
                    count: numOfKernels,
                    dropoutFunc: this.dropoutFunc
                });
            }
            const dropoutMask = this.dropoutMask;
            const applyDropout = (x, mask, index) => {
                if (!mask || !mask[index]) {
                    return x;
                }
                return tfc.mul(mask[index], x);
            };
            let xI = applyDropout(x, dropoutMask, 0);
            let xF = applyDropout(x, dropoutMask, 1);
            let xC = applyDropout(x, dropoutMask, 2);
            let xO = applyDropout(x, dropoutMask, 3);
            if (0 < this.recurrentDropout && this.recurrentDropout < 1 &&
                this.recurrentDropoutMask == null) {
                this.recurrentDropoutMask = generateDropoutMask({
                    ones: () => tfc.onesLike(hTMinus1),
                    rate: this.recurrentDropout,
                    training,
                    count: numOfKernels,
                    dropoutFunc: this.dropoutFunc
                });
            }
            const recDropoutMask = this.recurrentDropoutMask;
            let hI = applyDropout(hTMinus1, recDropoutMask, 0);
            let hF = applyDropout(hTMinus1, recDropoutMask, 1);
            let hC = applyDropout(hTMinus1, recDropoutMask, 2);
            let hO = applyDropout(hTMinus1, recDropoutMask, 3);
            const kernelChannelAxis = 3;
            const [kernelI, kernelF, kernelC, kernelO] = tfc.split(this.kernel.read(), numOfKernels, kernelChannelAxis);
            const [biasI, biasF, biasC, biasO] = this.useBias ?
                tfc.split(this.bias.read(), numOfKernels) :
                [null, null, null, null];
            xI = this.inputConv(xI, kernelI, biasI, this.padding);
            xF = this.inputConv(xF, kernelF, biasF, this.padding);
            xC = this.inputConv(xC, kernelC, biasC, this.padding);
            xO = this.inputConv(xO, kernelO, biasO, this.padding);
            const [recKernelI, recKernelF, recKernelC, recKernelO] = tfc.split(this.recurrentKernel.read(), numOfKernels, kernelChannelAxis);
            hI = this.recurrentConv(hI, recKernelI);
            hF = this.recurrentConv(hF, recKernelF);
            hC = this.recurrentConv(hC, recKernelC);
            hO = this.recurrentConv(hO, recKernelO);
            const i = this.recurrentActivation.apply(tfc.add(xI, hI));
            const f = this.recurrentActivation.apply(tfc.add(xF, hF));
            const c = tfc.add(tfc.mul(f, cTMinus1), tfc.mul(i, this.activation.apply(tfc.add(xC, hC))));
            const h = tfc.mul(this.recurrentActivation.apply(tfc.add(xO, hO)), this.activation.apply(c));
            return [h, h, c];
        });
    }
    getConfig() {
        const _a = super.getConfig(), { 'units': _ } = _a, baseConfig = __rest(_a, ['units']);
        const config = {
            filters: this.filters,
            kernelSize: this.kernelSize,
            padding: this.padding,
            dataFormat: this.dataFormat,
            dilationRate: this.dilationRate,
            strides: this.strides,
        };
        return Object.assign({}, baseConfig, config);
    }
    inputConv(x, w, b, padding) {
        const out = tfc.conv2d(x, w, this.strides, (padding || 'valid'), this.dataFormat === 'channelsFirst' ? 'NCHW' : 'NHWC', this.dilationRate);
        if (b) {
            return K.biasAdd(out, b, this.dataFormat);
        }
        return out;
    }
    recurrentConv(x, w) {
        const strides = 1;
        return tfc.conv2d(x, w, strides, 'same', this.dataFormat === 'channelsFirst' ? 'NCHW' : 'NHWC');
    }
}
/** @nocollapse */
ConvLSTM2DCell.className = 'ConvLSTM2DCell';
tfc.serialization.registerClass(ConvLSTM2DCell);
export class ConvLSTM2D extends ConvRNN2D {
    constructor(args) {
        const cell = new ConvLSTM2DCell(args);
        super(Object.assign({}, args, { cell }));
    }
    /** @nocollapse */
    static fromConfig(cls, config) {
        return new cls(config);
    }
}
/** @nocollapse */
ConvLSTM2D.className = 'ConvLSTM2D';
tfc.serialization.registerClass(ConvLSTM2D);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udm9sdXRpb25hbF9yZWN1cnJlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWxheWVycy9zcmMvbGF5ZXJzL2NvbnZvbHV0aW9uYWxfcmVjdXJyZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztHQVFHOzs7Ozs7Ozs7Ozs7QUFFSCxPQUFPLEtBQUssR0FBRyxNQUFNLHVCQUF1QixDQUFDO0FBQzdDLE9BQU8sRUFBUyxJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUduRCxPQUFPLEtBQUssQ0FBQyxNQUFNLHlCQUF5QixDQUFDO0FBQzdDLE9BQU8sRUFBQyxlQUFlLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFNUQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxjQUFjLEVBQUUsbUJBQW1CLEVBQUUsVUFBVSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQzFFLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUk1QyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUUsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDckUsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDN0QsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFeEQsT0FBTyxFQUFtQixtQkFBbUIsRUFBRSxRQUFRLEVBQW9DLEdBQUcsRUFBRSxPQUFPLEVBQXVDLE1BQU0sYUFBYSxDQUFDO0FBc0RsSyxNQUFlLGFBQWMsU0FBUSxPQUFPO0NBeUIzQztBQUtEOztHQUVHO0FBQ0gsTUFBTSxTQUFVLFNBQVEsR0FBRztJQU16QixZQUFZLElBQXdCO1FBQ2xDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNmLE1BQU0sSUFBSSxtQkFBbUIsQ0FDekIsb0RBQW9ELENBQUMsQ0FB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QUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pCLENBQUM7O0FBZEQsa0JBQWtCO0FBQ1gsb0JBQVMsR0FBRyxZQUFZLENBQUM7QUFnQmxDLEdBQUcsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICogbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gKiBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0ICogYXMgdGZjIGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5pbXBvcnQge1RlbnNvciwgdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtBY3RpdmF0aW9ufSBmcm9tICcuLi9hY3RpdmF0aW9ucyc7XG5pbXBvcnQgKiBhcyBLIGZyb20gJy4uL2JhY2tlbmQvdGZqc19iYWNrZW5kJztcbmltcG9ydCB7Y2hlY2tEYXRhRm9ybWF0LCBjaGVja1BhZGRpbmdNb2RlfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtDb25zdHJhaW50fSBmcm9tICcuLi9jb25zdHJhaW50cyc7XG5pbXBvcnQge0lucHV0U3BlY30gZnJvbSAnLi4vZW5naW5lL3RvcG9sb2d5JztcbmltcG9ydCB7QXR0cmlidXRlRXJyb3IsIE5vdEltcGxlbWVudGVkRXJyb3IsIFZhbHVlRXJyb3J9IGZyb20gJy4uL2Vycm9ycyc7XG5pbXBvcnQge0luaXRpYWxpemVyfSBmcm9tICcuLi9pbml0aWFsaXplcnMnO1xuaW1wb3J0IHtEYXRhRm9ybWF0LCBEYXRhVHlwZSwgUGFkZGluZ01vZGUsIFNoYXBlfSBmcm9tICcuLi9rZXJhc19mb3JtYXQvY29tbW9uJztcbmltcG9ydCB7UmVndWxhcml6ZXJ9IGZyb20gJy4uL3JlZ3VsYXJpemVycyc7XG5pbXBvcnQge0t3YXJnc30gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtjb252T3V0cHV0TGVuZ3RoLCBub3JtYWxpemVBcnJheX0gZnJvbSAnLi4vdXRpbHMvY29udl91dGlscyc7XG5pbXBvcnQge2Fzc2VydFBvc2l0aXZlSW50ZWdlcn0gZnJvbSAnLi4vdXRpbHMvZ2VuZXJpY191dGlscyc7XG5pbXBvcnQge2dldEV4YWN0bHlPbmVTaGFwZX0gZnJvbSAnLi4vdXRpbHMvdHlwZXNfdXRpbHMnO1xuXG5pbXBvcnQge0Jhc2VSTk5MYXllckFyZ3MsIGdlbmVyYXRlRHJvcG91dE1hc2ssIExTVE1DZWxsLCBMU1RNQ2VsbExheWVyQXJncywgTFNUTUxheWVyQXJncywgUk5OLCBSTk5DZWxsLCBSTk5MYXllckFyZ3MsIFNpbXBsZVJOTkNlbGxMYXllckFyZ3N9IGZyb20gJy4vcmVjdXJyZW50JztcblxuZGVjbGFyZSBpbnRlcmZhY2UgQ29udlJOTjJEQ2VsbEFyZ3MgZXh0ZW5kc1xuICAgIE9taXQ8U2ltcGxlUk5OQ2VsbExheWVyQXJncywgJ3VuaXRzJz4ge1xuICAvKipcbiAgICogVGhlIGRpbWVuc2lvbmFsaXR5IG9mIHRoZSBvdXRwdXQgc3BhY2UgKGkuZS4gdGhlIG51bWJlciBvZiBmaWx0ZXJzIGluIHRoZVxuICAgKiBjb252b2x1dGlvbikuXG4gICAqL1xuICBmaWx0ZXJzOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBkaW1lbnNpb25zIG9mIHRoZSBjb252b2x1dGlvbiB3aW5kb3cuIElmIGtlcm5lbFNpemUgaXMgYSBudW1iZXIsIHRoZVxuICAgKiBjb252b2x1dGlvbmFsIHdpbmRvdyB3aWxsIGJlIHNxdWFyZS5cbiAgICovXG4gIGtlcm5lbFNpemU6IG51bWJlcnxudW1iZXJbXTtcblxuICAvKipcbiAgICogVGhlIHN0cmlkZXMgb2YgdGhlIGNvbnZvbHV0aW9uIGluIGVhY2ggZGltZW5zaW9uLiBJZiBzdHJpZGVzIGlzIGEgbnVtYmVyLFxuICAgKiBzdHJpZGVzIGluIGJvdGggZGltZW5zaW9ucyBhcmUgZXF1YWwuXG4gICAqXG4gICAqIFNwZWNpZnlpbmcgYW55IHN0cmlkZSB2YWx1ZSAhPSAxIGlzIGluY29tcGF0aWJsZSB3aXRoIHNwZWNpZnlpbmcgYW55XG4gICAqIGBkaWxhdGlvblJhdGVgIHZhbHVlICE9IDEuXG4gICAqL1xuICBzdHJpZGVzPzogbnVtYmVyfG51bWJlcltdO1xuXG4gIC8qKlxuICAgKiBQYWRkaW5nIG1vZGUuXG4gICAqL1xuICBwYWRkaW5nPzogUGFkZGluZ01vZGU7XG5cbiAgLyoqXG4gICAqIEZvcm1hdCBvZiB0aGUgZGF0YSwgd2hpY2ggZGV0ZXJtaW5lcyB0aGUgb3JkZXJpbmcgb2YgdGhlIGRpbWVuc2lvbnMgaW5cbiAgICogdGhlIGlucHV0cy5cbiAgICpcbiAgICogYGNoYW5uZWxzX2xhc3RgIGNvcnJlc3BvbmRzIHRvIGlucHV0cyB3aXRoIHNoYXBlXG4gICAqICAgYChiYXRjaCwgLi4uLCBjaGFubmVscylgXG4gICAqXG4gICAqICBgY2hhbm5lbHNfZmlyc3RgIGNvcnJlc3BvbmRzIHRvIGlucHV0cyB3aXRoIHNoYXBlIGAoYmF0Y2gsIGNoYW5uZWxzLFxuICAgKiAuLi4pYC5cbiAgICpcbiAgICogRGVmYXVsdHMgdG8gYGNoYW5uZWxzX2xhc3RgLlxuICAgKi9cbiAgZGF0YUZvcm1hdD86IERhdGFGb3JtYXQ7XG5cbiAgLyoqXG4gICAqIFRoZSBkaWxhdGlvbiByYXRlIHRvIHVzZSBmb3IgdGhlIGRpbGF0ZWQgY29udm9sdXRpb24gaW4gZWFjaCBkaW1lbnNpb24uXG4gICAqIFNob3VsZCBiZSBhbiBpbnRlZ2VyIG9yIGFycmF5IG9mIHR3byBvciB0aHJlZSBpbnRlZ2Vycy5cbiAgICpcbiAgICogQ3VycmVudGx5LCBzcGVjaWZ5aW5nIGFueSBgZGlsYXRpb25SYXRlYCB2YWx1ZSAhPSAxIGlzIGluY29tcGF0aWJsZSB3aXRoXG4gICAqIHNwZWNpZnlpbmcgYW55IGBzdHJpZGVzYCB2YWx1ZSAhPSAxLlxuICAgKi9cbiAgZGlsYXRpb25SYXRlPzogbnVtYmVyfFtudW1iZXJdfFtudW1iZXIsIG51bWJlcl07XG59XG5cbmFic3RyYWN0IGNsYXNzIENvbnZSTk4yRENlbGwgZXh0ZW5kcyBSTk5DZWxsIHtcbiAgcmVhZG9ubHkgZmlsdGVyczogbnVtYmVyO1xuICByZWFkb25seSBrZXJuZWxTaXplOiBudW1iZXJbXTtcbiAgcmVhZG9ubHkgc3RyaWRlczogbnVtYmVyW107XG4gIHJlYWRvbmx5IHBhZGRpbmc6IFBhZGRpbmdNb2RlO1xuICByZWFkb25seSBkYXRhRm9ybWF0OiBEYXRhRm9ybWF0O1xuICByZWFkb25seSBkaWxhdGlvblJhdGU6IG51bWJlcltdO1xuXG4gIHJlYWRvbmx5IGFjdGl2YXRpb246IEFjdGl2YXRpb247XG4gIHJlYWRvbmx5IHVzZUJpYXM6IGJvb2xlYW47XG5cbiAgcmVhZG9ubHkga2VybmVsSW5pdGlhbGl6ZXI6IEluaXRpYWxpemVyO1xuICByZWFkb25seSByZWN1cnJlbnRJbml0aWFsaXplcjogSW5pdGlhbGl6ZXI7XG4gIHJlYWRvbmx5IGJpYXNJbml0aWFsaXplcjogSW5pdGlhbGl6ZXI7XG5cbiAgcmVhZG9ubHkga2VybmVsQ29uc3RyYWludDogQ29uc3RyYWludDtcbiAgcmVhZG9ubHkgcmVjdXJyZW50Q29uc3RyYWludDogQ29uc3RyYWludDtcbiAgcmVhZG9ubHkgYmlhc0NvbnN0cmFpbnQ6IENvbnN0cmFpbnQ7XG5cbiAgcmVhZG9ubHkga2VybmVsUmVndWxhcml6ZXI6IFJlZ3VsYXJpemVyO1xuICByZWFkb25seSByZWN1cnJlbnRSZWd1bGFyaXplcjogUmVndWxhcml6ZXI7XG4gIHJlYWRvbmx5IGJpYXNSZWd1bGFyaXplcjogUmVndWxhcml6ZXI7XG5cbiAgcmVhZG9ubHkgZHJvcG91dDogbnVtYmVyO1xuICByZWFkb25seSByZWN1cnJlbnREcm9wb3V0OiBudW1iZXI7XG59XG5cbmRlY2xhcmUgaW50ZXJmYWNlIENvbnZSTk4yRExheWVyQXJncyBleHRlbmRzIEJhc2VSTk5MYXllckFyZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb252Uk5OMkRDZWxsQXJncyB7fVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGNvbnZvbHV0aW9uYWwtcmVjdXJyZW50IGxheWVycy5cbiAqL1xuY2xhc3MgQ29udlJOTjJEIGV4dGVuZHMgUk5OIHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBjbGFzc05hbWUgPSAnQ29udlJOTjJEJztcblxuICByZWFkb25seSBjZWxsOiBDb252Uk5OMkRDZWxsO1xuXG4gIGNvbnN0cnVjdG9yKGFyZ3M6IENvbnZSTk4yRExheWVyQXJncykge1xuICAgIGlmIChhcmdzLnVucm9sbCkge1xuICAgICAgdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXJyb3IoXG4gICAgICAgICAgJ1Vucm9sbGluZyBpcyBub3QgcG9zc2libGUgd2l0aCBjb252b2x1dGlvbmFsIFJOTnMuJyk7XG4gICAgfVxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXJncy5jZWxsKSkge1xuICAgICAgdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXJyb3IoXG4gICAgICAgICAgJ0l0IGlzIG5vdCBwb3NzaWJsZSBhdCB0aGUgbW9tZW50IHRvIHN0YWNrIGNvbnZvbHV0aW9uYWwgY2VsbHMuJyk7XG4gICAgfVxuXG4gICAgc3VwZXIoYXJncyBhcyBSTk5MYXllckFyZ3MpO1xuXG4gICAgdGhpcy5pbnB1dFNwZWMgPSBbbmV3IElucHV0U3BlYyh7bmRpbTogNX0pXTtcbiAgfVxuXG4gIGNhbGwoaW5wdXRzOiBUZW5zb3J8VGVuc29yW10sIGt3YXJnczogS3dhcmdzKTogVGVuc29yfFRlbnNvcltdIHtcbiAgICByZXR1cm4gdGZjLnRpZHkoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuY2VsbC5kcm9wb3V0TWFzayAhPSBudWxsKSB7XG4gICAgICAgIHRmYy5kaXNwb3NlKHRoaXMuY2VsbC5kcm9wb3V0TWFzayk7XG5cbiAgICAgICAgdGhpcy5jZWxsLmRyb3BvdXRNYXNrID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY2VsbC5yZWN1cnJlbnREcm9wb3V0TWFzayAhPSBudWxsKSB7XG4gICAgICAgIHRmYy5kaXNwb3NlKHRoaXMuY2VsbC5yZWN1cnJlbnREcm9wb3V0TWFzayk7XG5cbiAgICAgICAgdGhpcy5jZWxsLnJlY3VycmVudERyb3BvdXRNYXNrID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGt3YXJncyAmJiBrd2FyZ3NbJ2NvbnN0YW50cyddKSB7XG4gICAgICAgIHRocm93IG5ldyBWYWx1ZUVycm9yKCdDb252Uk5OMkQgY2VsbCBkb2VzIG5vdCBzdXBwb3J0IGNvbnN0YW50cycpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtYXNrID0ga3dhcmdzID09IG51bGwgPyBudWxsIDoga3dhcmdzWydtYXNrJ107XG5cbiAgICAgIGNvbnN0IHRyYWluaW5nID0ga3dhcmdzID09IG51bGwgPyBudWxsIDoga3dhcmdzWyd0cmFpbmluZyddO1xuXG4gICAgICBjb25zdCBpbml0aWFsU3RhdGU6IFRlbnNvcltdID1cbiAgICAgICAgICBrd2FyZ3MgPT0gbnVsbCA/IG51bGwgOiBrd2FyZ3NbJ2luaXRpYWxTdGF0ZSddO1xuXG4gICAgICByZXR1cm4gc3VwZXIuY2FsbChpbnB1dHMsIHttYXNrLCB0cmFpbmluZywgaW5pdGlhbFN0YXRlfSk7XG4gICAgfSk7XG4gIH1cblxuICBjb21wdXRlT3V0cHV0U2hhcGUoaW5wdXRTaGFwZTogU2hhcGUpOiBTaGFwZXxTaGFwZVtdIHtcbiAgICBsZXQgb3V0U2hhcGU6IFNoYXBlID0gdGhpcy5jb21wdXRlU2luZ2xlT3V0cHV0U2hhcGUoaW5wdXRTaGFwZSk7XG5cbiAgICBpZiAoIXRoaXMucmV0dXJuU2VxdWVuY2VzKSB7XG4gICAgICBvdXRTaGFwZSA9IFtvdXRTaGFwZVswXSwgLi4ub3V0U2hhcGUuc2xpY2UoMildO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJldHVyblN0YXRlKSB7XG4gICAgICBvdXRTaGFwZSA9XG4gICAgICAgICAgW291dFNoYXBlLCAuLi5BcnJheSgyKS5maWxsKFtpbnB1dFNoYXBlWzBdLCAuLi5vdXRTaGFwZS5zbGljZSgtMyldKV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dFNoYXBlO1xuICB9XG5cbiAgZ2V0SW5pdGlhbFN0YXRlKGlucHV0czogdGZjLlRlbnNvcik6IHRmYy5UZW5zb3JbXSB7XG4gICAgcmV0dXJuIHRmYy50aWR5KCgpID0+IHtcbiAgICAgIGNvbnN0IHtzdGF0ZVNpemV9ID0gdGhpcy5jZWxsO1xuXG4gICAgICBjb25zdCBpbnB1dFNoYXBlID0gaW5wdXRzLnNoYXBlO1xuXG4gICAgICBjb25zdCBvdXRwdXRTaGFwZSA9IHRoaXMuY29tcHV0ZVNpbmdsZU91dHB1dFNoYXBlKGlucHV0U2hhcGUpO1xuXG4gICAgICBjb25zdCBzdGF0ZVNoYXBlID0gW291dHB1dFNoYXBlWzBdLCAuLi5vdXRwdXRTaGFwZS5zbGljZSgyKV07XG5cbiAgICAgIGNvbnN0IGluaXRpYWxTdGF0ZSA9IHRmYy56ZXJvcyhzdGF0ZVNoYXBlKTtcblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc3RhdGVTaXplKSkge1xuICAgICAgICByZXR1cm4gQXJyYXkoc3RhdGVTaXplLmxlbmd0aCkuZmlsbChpbml0aWFsU3RhdGUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gW2luaXRpYWxTdGF0ZV07XG4gICAgfSk7XG4gIH1cblxuICByZXNldFN0YXRlcyhzdGF0ZXM/OiBUZW5zb3J8VGVuc29yW10sIHRyYWluaW5nID0gZmFsc2UpOiB2b2lkIHtcbiAgICB0ZmMudGlkeSgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuc3RhdGVmdWwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEF0dHJpYnV0ZUVycm9yKFxuICAgICAgICAgICAgJ0Nhbm5vdCBjYWxsIHJlc2V0U3RhdGVzKCkgb24gYW4gUk5OIExheWVyIHRoYXQgaXMgbm90IHN0YXRlZnVsLicpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpbnB1dFNoYXBlID0gdGhpcy5pbnB1dFNwZWNbMF0uc2hhcGU7XG5cbiAgICAgIGNvbnN0IG91dHB1dFNoYXBlID0gdGhpcy5jb21wdXRlU2luZ2xlT3V0cHV0U2hhcGUoaW5wdXRTaGFwZSk7XG5cbiAgICAgIGNvbnN0IHN0YXRlU2hhcGUgPSBbb3V0cHV0U2hhcGVbMF0sIC4uLm91dHB1dFNoYXBlLnNsaWNlKDIpXTtcblxuICAgICAgY29uc3QgYmF0Y2hTaXplID0gaW5wdXRTaGFwZVswXTtcblxuICAgICAgaWYgKGJhdGNoU2l6ZSA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBWYWx1ZUVycm9yKFxuICAgICAgICAgICAgJ0lmIGFuIFJOTiBpcyBzdGF0ZWZ1bCwgaXQgbmVlZHMgdG8ga25vdyBpdHMgYmF0Y2ggc2l6ZS4gU3BlY2lmeSAnICtcbiAgICAgICAgICAgICd0aGUgYmF0Y2ggc2l6ZSBvZiB5b3VyIGlucHV0IHRlbnNvcnM6IFxcbicgK1xuICAgICAgICAgICAgJy0gSWYgdXNpbmcgYSBTZXF1ZW50aWFsIG1vZGVsLCBzcGVjaWZ5IHRoZSBiYXRjaCBzaXplIGJ5ICcgK1xuICAgICAgICAgICAgJ3Bhc3NpbmcgYSBgYmF0Y2hJbnB1dFNoYXBlYCBvcHRpb24gdG8geW91ciBmaXJzdCBsYXllci5cXG4nICtcbiAgICAgICAgICAgICctIElmIHVzaW5nIHRoZSBmdW5jdGlvbmFsIEFQSSwgc3BlY2lmeSB0aGUgYmF0Y2ggc2l6ZSBieSAnICtcbiAgICAgICAgICAgICdwYXNzaW5nIGEgYGJhdGNoU2hhcGVgIG9wdGlvbiB0byB5b3VyIElucHV0IGxheWVyLicpO1xuICAgICAgfVxuXG4gICAgICAvLyBJbml0aWFsaXplIHN0YXRlIGlmIG51bGwuXG4gICAgICBpZiAodGhpcy5nZXRTdGF0ZXMoKSA9PSBudWxsKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuY2VsbC5zdGF0ZVNpemUpKSB7XG4gICAgICAgICAgdGhpcy5zdGF0ZXNfID0gdGhpcy5jZWxsLnN0YXRlU2l6ZS5tYXAoKCkgPT4gdGZjLnplcm9zKHN0YXRlU2hhcGUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnN0YXRlc18gPSBbdGZjLnplcm9zKHN0YXRlU2hhcGUpXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzdGF0ZXMgPT0gbnVsbCkge1xuICAgICAgICAvLyBEaXNwb3NlIG9sZCBzdGF0ZSB0ZW5zb3JzLlxuICAgICAgICB0ZmMuZGlzcG9zZSh0aGlzLnN0YXRlc18pO1xuXG4gICAgICAgIC8vIEZvciBzdGF0ZWZ1bCBSTk5zLCBmdWxseSBkaXNwb3NlIGtlcHQgb2xkIHN0YXRlcy5cbiAgICAgICAgaWYgKHRoaXMua2VwdFN0YXRlcyAhPSBudWxsKSB7XG4gICAgICAgICAgdGZjLmRpc3Bvc2UodGhpcy5rZXB0U3RhdGVzKTtcbiAgICAgICAgICB0aGlzLmtlcHRTdGF0ZXMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuY2VsbC5zdGF0ZVNpemUpKSB7XG4gICAgICAgICAgdGhpcy5zdGF0ZXNfID0gdGhpcy5jZWxsLnN0YXRlU2l6ZS5tYXAoKCkgPT4gdGZjLnplcm9zKHN0YXRlU2hhcGUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnN0YXRlc19bMF0gPSB0ZmMuemVyb3Moc3RhdGVTaGFwZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShzdGF0ZXMpKSB7XG4gICAgICAgICAgc3RhdGVzID0gW3N0YXRlc107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RhdGVzLmxlbmd0aCAhPT0gdGhpcy5zdGF0ZXNfLmxlbmd0aCkge1xuICAgICAgICAgIHRocm93IG5ldyBWYWx1ZUVycm9yKFxuICAgICAgICAgICAgICBgTGF5ZXIgJHt0aGlzLm5hbWV9IGV4cGVjdHMgJHt0aGlzLnN0YXRlc18ubGVuZ3RofSBzdGF0ZShzKSwgYCArXG4gICAgICAgICAgICAgIGBidXQgaXQgcmVjZWl2ZWQgJHtzdGF0ZXMubGVuZ3RofSBzdGF0ZSB2YWx1ZShzKS4gSW5wdXQgYCArXG4gICAgICAgICAgICAgIGByZWNlaXZlZDogJHtzdGF0ZXN9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHJhaW5pbmcpIHtcbiAgICAgICAgICAvLyBTdG9yZSBvbGQgc3RhdGUgdGVuc29ycyBmb3IgY29tcGxldGUgZGlzcG9zYWwgbGF0ZXIsIGkuZS4sIGR1cmluZ1xuICAgICAgICAgIC8vIHRoZSBuZXh0IG5vLWFyZyBjYWxsIHRvIHRoaXMgbWV0aG9kLiBXZSBkbyBub3QgZGlzcG9zZSB0aGUgb2xkXG4gICAgICAgICAgLy8gc3RhdGVzIGltbWVkaWF0ZWx5IGJlY2F1c2UgdGhhdCBCUFRUIChhbW9uZyBvdGhlciB0aGluZ3MpIHJlcXVpcmVcbiAgICAgICAgICAvLyB0aGVtLlxuICAgICAgICAgIHRoaXMua2VwdFN0YXRlcy5wdXNoKHRoaXMuc3RhdGVzXy5zbGljZSgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ZmMuZGlzcG9zZSh0aGlzLnN0YXRlc18pO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuc3RhdGVzXy5sZW5ndGg7ICsraW5kZXgpIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHN0YXRlc1tpbmRleF07XG5cbiAgICAgICAgICBjb25zdCBleHBlY3RlZFNoYXBlID0gc3RhdGVTaGFwZTtcblxuICAgICAgICAgIGlmICghdXRpbC5hcnJheXNFcXVhbCh2YWx1ZS5zaGFwZSwgZXhwZWN0ZWRTaGFwZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBWYWx1ZUVycm9yKFxuICAgICAgICAgICAgICAgIGBTdGF0ZSAke2luZGV4fSBpcyBpbmNvbXBhdGlibGUgd2l0aCBsYXllciAke3RoaXMubmFtZX06IGAgK1xuICAgICAgICAgICAgICAgIGBleHBlY3RlZCBzaGFwZT0ke2V4cGVjdGVkU2hhcGV9LCByZWNlaXZlZCBzaGFwZT0ke1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zaGFwZX1gKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnN0YXRlc19baW5kZXhdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5zdGF0ZXNfID0gdGhpcy5zdGF0ZXNfLm1hcChzdGF0ZSA9PiB0ZmMua2VlcChzdGF0ZS5jbG9uZSgpKSk7XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29tcHV0ZVNpbmdsZU91dHB1dFNoYXBlKGlucHV0U2hhcGU6IFNoYXBlKTogU2hhcGUge1xuICAgIGNvbnN0IHtkYXRhRm9ybWF0LCBmaWx0ZXJzLCBrZXJuZWxTaXplLCBwYWRkaW5nLCBzdHJpZGVzLCBkaWxhdGlvblJhdGV9ID1cbiAgICAgICAgdGhpcy5jZWxsO1xuXG4gICAgY29uc3QgaXNDaGFubmVsc0ZpcnN0ID0gZGF0YUZvcm1hdCA9PT0gJ2NoYW5uZWxzRmlyc3QnO1xuXG4gICAgY29uc3QgaCA9IGlucHV0U2hhcGVbaXNDaGFubmVsc0ZpcnN0ID8gMyA6IDJdO1xuICAgIGNvbnN0IHcgPSBpbnB1dFNoYXBlW2lzQ2hhbm5lbHNGaXJzdCA/IDQgOiAzXTtcblxuICAgIGNvbnN0IGhPdXQgPSBjb252T3V0cHV0TGVuZ3RoKFxuICAgICAgICBoLCBrZXJuZWxTaXplWzBdLCBwYWRkaW5nLCBzdHJpZGVzWzBdLCBkaWxhdGlvblJhdGVbMF0pO1xuICAgIGNvbnN0IHdPdXQgPSBjb252T3V0cHV0TGVuZ3RoKFxuICAgICAgICB3LCBrZXJuZWxTaXplWzFdLCBwYWRkaW5nLCBzdHJpZGVzWzFdLCBkaWxhdGlvblJhdGVbMV0pO1xuXG4gICAgY29uc3Qgb3V0U2hhcGU6IFNoYXBlID0gW1xuICAgICAgLi4uaW5wdXRTaGFwZS5zbGljZSgwLCAyKSxcbiAgICAgIC4uLihpc0NoYW5uZWxzRmlyc3QgPyBbZmlsdGVycywgaE91dCwgd091dF0gOiBbaE91dCwgd091dCwgZmlsdGVyc10pXG4gICAgXTtcblxuICAgIHJldHVybiBvdXRTaGFwZTtcbiAgfVxufVxuXG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgQ29udkxTVE0yRENlbGxBcmdzIGV4dGVuZHNcbiAgICBPbWl0PExTVE1DZWxsTGF5ZXJBcmdzLCAndW5pdHMnPiwgQ29udlJOTjJEQ2VsbEFyZ3Mge31cblxuZXhwb3J0IGNsYXNzIENvbnZMU1RNMkRDZWxsIGV4dGVuZHMgTFNUTUNlbGwgaW1wbGVtZW50cyBDb252Uk5OMkRDZWxsIHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBjbGFzc05hbWUgPSAnQ29udkxTVE0yRENlbGwnO1xuXG4gIHJlYWRvbmx5IGZpbHRlcnM6IG51bWJlcjtcbiAgcmVhZG9ubHkga2VybmVsU2l6ZTogbnVtYmVyW107XG4gIHJlYWRvbmx5IHN0cmlkZXM6IG51bWJlcltdO1xuICByZWFkb25seSBwYWRkaW5nOiBQYWRkaW5nTW9kZTtcbiAgcmVhZG9ubHkgZGF0YUZvcm1hdDogRGF0YUZvcm1hdDtcbiAgcmVhZG9ubHkgZGlsYXRpb25SYXRlOiBudW1iZXJbXTtcblxuICBjb25zdHJ1Y3RvcihhcmdzOiBDb252TFNUTTJEQ2VsbEFyZ3MpIHtcbiAgICBjb25zdCB7XG4gICAgICBmaWx0ZXJzLFxuICAgICAga2VybmVsU2l6ZSxcbiAgICAgIHN0cmlkZXMsXG4gICAgICBwYWRkaW5nLFxuICAgICAgZGF0YUZvcm1hdCxcbiAgICAgIGRpbGF0aW9uUmF0ZSxcbiAgICB9ID0gYXJncztcblxuICAgIHN1cGVyKHsuLi5hcmdzLCB1bml0czogZmlsdGVyc30pO1xuXG4gICAgdGhpcy5maWx0ZXJzID0gZmlsdGVycztcbiAgICBhc3NlcnRQb3NpdGl2ZUludGVnZXIodGhpcy5maWx0ZXJzLCAnZmlsdGVycycpO1xuXG4gICAgdGhpcy5rZXJuZWxTaXplID0gbm9ybWFsaXplQXJyYXkoa2VybmVsU2l6ZSwgMiwgJ2tlcm5lbFNpemUnKTtcbiAgICB0aGlzLmtlcm5lbFNpemUuZm9yRWFjaChzaXplID0+IGFzc2VydFBvc2l0aXZlSW50ZWdlcihzaXplLCAna2VybmVsU2l6ZScpKTtcblxuICAgIHRoaXMuc3RyaWRlcyA9IG5vcm1hbGl6ZUFycmF5KHN0cmlkZXMgfHwgMSwgMiwgJ3N0cmlkZXMnKTtcbiAgICB0aGlzLnN0cmlkZXMuZm9yRWFjaChzdHJpZGUgPT4gYXNzZXJ0UG9zaXRpdmVJbnRlZ2VyKHN0cmlkZSwgJ3N0cmlkZXMnKSk7XG5cbiAgICB0aGlzLnBhZGRpbmcgPSBwYWRkaW5nIHx8ICd2YWxpZCc7XG4gICAgY2hlY2tQYWRkaW5nTW9kZSh0aGlzLnBhZGRpbmcpO1xuXG4gICAgdGhpcy5kYXRhRm9ybWF0ID0gZGF0YUZvcm1hdCB8fCAnY2hhbm5lbHNMYXN0JztcbiAgICBjaGVja0RhdGFGb3JtYXQodGhpcy5kYXRhRm9ybWF0KTtcblxuICAgIHRoaXMuZGlsYXRpb25SYXRlID0gbm9ybWFsaXplQXJyYXkoZGlsYXRpb25SYXRlIHx8IDEsIDIsICdkaWxhdGlvblJhdGUnKTtcbiAgICB0aGlzLmRpbGF0aW9uUmF0ZS5mb3JFYWNoKFxuICAgICAgICByYXRlID0+IGFzc2VydFBvc2l0aXZlSW50ZWdlcihyYXRlLCAnZGlsYXRpb25SYXRlJykpO1xuICB9XG5cbiAgcHVibGljIGJ1aWxkKGlucHV0U2hhcGU6IFNoYXBlfFNoYXBlW10pOiB2b2lkIHtcbiAgICBpbnB1dFNoYXBlID0gZ2V0RXhhY3RseU9uZVNoYXBlKGlucHV0U2hhcGUpO1xuXG4gICAgY29uc3QgY2hhbm5lbEF4aXMgPVxuICAgICAgICB0aGlzLmRhdGFGb3JtYXQgPT09ICdjaGFubmVsc0ZpcnN0JyA/IDEgOiBpbnB1dFNoYXBlLmxlbmd0aCAtIDE7XG5cbiAgICBpZiAoaW5wdXRTaGFwZVtjaGFubmVsQXhpc10gPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFZhbHVlRXJyb3IoXG4gICAgICAgICAgYFRoZSBjaGFubmVsIGRpbWVuc2lvbiBvZiB0aGUgaW5wdXQgc2hvdWxkIGJlIGRlZmluZWQuIGAgK1xuICAgICAgICAgIGBGb3VuZCAke2lucHV0U2hhcGVbY2hhbm5lbEF4aXNdfWApO1xuICAgIH1cblxuICAgIGNvbnN0IGlucHV0RGltID0gaW5wdXRTaGFwZVtjaGFubmVsQXhpc107XG5cbiAgICBjb25zdCBudW1PZktlcm5lbHMgPSA0O1xuXG4gICAgY29uc3Qga2VybmVsU2hhcGUgPVxuICAgICAgICB0aGlzLmtlcm5lbFNpemUuY29uY2F0KFtpbnB1dERpbSwgdGhpcy5maWx0ZXJzICogbnVtT2ZLZXJuZWxzXSk7XG5cbiAgICB0aGlzLmtlcm5lbCA9IHRoaXMuYWRkV2VpZ2h0KFxuICAgICAgICAna2VybmVsJywga2VybmVsU2hhcGUsIG51bGwsIHRoaXMua2VybmVsSW5pdGlhbGl6ZXIsXG4gICAgICAgIHRoaXMua2VybmVsUmVndWxhcml6ZXIsIHRydWUsIHRoaXMua2VybmVsQ29uc3RyYWludCk7XG5cbiAgICBjb25zdCByZWN1cnJlbnRLZXJuZWxTaGFwZSA9XG4gICAgICAgIHRoaXMua2VybmVsU2l6ZS5jb25jYXQoW3RoaXMuZmlsdGVycywgdGhpcy5maWx0ZXJzICogbnVtT2ZLZXJuZWxzXSk7XG5cbiAgICB0aGlzLnJlY3VycmVudEtlcm5lbCA9IHRoaXMuYWRkV2VpZ2h0KFxuICAgICAgICAncmVjdXJyZW50X2tlcm5lbCcsIHJlY3VycmVudEtlcm5lbFNoYXBlLCBudWxsLFxuICAgICAgICB0aGlzLnJlY3VycmVudEluaXRpYWxpemVyLCB0aGlzLnJlY3VycmVudFJlZ3VsYXJpemVyLCB0cnVlLFxuICAgICAgICB0aGlzLnJlY3VycmVudENvbnN0cmFpbnQpO1xuXG4gICAgaWYgKHRoaXMudXNlQmlhcykge1xuICAgICAgbGV0IGJpYXNJbml0aWFsaXplcjogSW5pdGlhbGl6ZXI7XG5cbiAgICAgIGlmICh0aGlzLnVuaXRGb3JnZXRCaWFzKSB7XG4gICAgICAgIGNvbnN0IGluaXQgPSB0aGlzLmJpYXNJbml0aWFsaXplcjtcblxuICAgICAgICBjb25zdCBmaWx0ZXJzID0gdGhpcy5maWx0ZXJzO1xuXG4gICAgICAgIGJpYXNJbml0aWFsaXplciA9IG5ldyAoY2xhc3MgQ3VzdG9tSW5pdCBleHRlbmRzIEluaXRpYWxpemVyIHtcbiAgICAgICAgICAvKiogQG5vY29sbGFwc2UgKi9cbiAgICAgICAgICBzdGF0aWMgY2xhc3NOYW1lID0gJ0N1c3RvbUluaXQnO1xuXG4gICAgICAgICAgYXBwbHkoc2hhcGU6IFNoYXBlLCBkdHlwZT86IERhdGFUeXBlKTogdGZjLlRlbnNvciB7XG4gICAgICAgICAgICBjb25zdCBiaWFzSSA9IGluaXQuYXBwbHkoW2ZpbHRlcnNdKTtcbiAgICAgICAgICAgIGNvbnN0IGJpYXNGID0gdGZjLm9uZXMoW2ZpbHRlcnNdKTtcbiAgICAgICAgICAgIGNvbnN0IGJpYXNDQW5kTyA9IGluaXQuYXBwbHkoW2ZpbHRlcnMgKiAyXSk7XG4gICAgICAgICAgICByZXR1cm4gSy5jb25jYXRlbmF0ZShbYmlhc0ksIGJpYXNGLCBiaWFzQ0FuZE9dKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiaWFzSW5pdGlhbGl6ZXIgPSB0aGlzLmJpYXNJbml0aWFsaXplcjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5iaWFzID0gdGhpcy5hZGRXZWlnaHQoXG4gICAgICAgICAgJ2JpYXMnLCBbdGhpcy5maWx0ZXJzICogbnVtT2ZLZXJuZWxzXSwgbnVsbCwgYmlhc0luaXRpYWxpemVyLFxuICAgICAgICAgIHRoaXMuYmlhc1JlZ3VsYXJpemVyLCB0cnVlLCB0aGlzLmJpYXNDb25zdHJhaW50KTtcbiAgICB9XG5cbiAgICB0aGlzLmJ1aWx0ID0gdHJ1ZTtcbiAgfVxuXG4gIGNhbGwoaW5wdXRzOiB0ZmMuVGVuc29yW10sIGt3YXJnczogS3dhcmdzKTogdGZjLlRlbnNvcltdIHtcbiAgICByZXR1cm4gdGZjLnRpZHkoKCkgPT4ge1xuICAgICAgaWYgKGlucHV0cy5sZW5ndGggIT09IDMpIHtcbiAgICAgICAgdGhyb3cgbmV3IFZhbHVlRXJyb3IoXG4gICAgICAgICAgICBgQ29udkxTVE0yRENlbGwgZXhwZWN0cyAzIGlucHV0IFRlbnNvcnMgKGlucHV0cywgaCwgYyksIGdvdCBgICtcbiAgICAgICAgICAgIGAke2lucHV0cy5sZW5ndGh9LmApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0cmFpbmluZyA9IGt3YXJnc1sndHJhaW5pbmcnXSB8fCBmYWxzZTtcblxuICAgICAgY29uc3QgeCA9IGlucHV0c1swXTsgICAgICAgICAvLyBDdXJyZW50IGlucHV0XG4gICAgICBjb25zdCBoVE1pbnVzMSA9IGlucHV0c1sxXTsgIC8vIFByZXZpb3VzIG1lbW9yeSBzdGF0ZS5cbiAgICAgIGNvbnN0IGNUTWludXMxID0gaW5wdXRzWzJdOyAgLy8gUHJldmlvdXMgY2Fycnkgc3RhdGUuXG5cbiAgICAgIGNvbnN0IG51bU9mS2VybmVscyA9IDQ7XG5cbiAgICAgIHR5cGUgRHJvcG91dE1hc2tzID0gW3RmYy5UZW5zb3IsIHRmYy5UZW5zb3IsIHRmYy5UZW5zb3IsIHRmYy5UZW5zb3JdO1xuXG4gICAgICBpZiAoMCA8IHRoaXMuZHJvcG91dCAmJiB0aGlzLmRyb3BvdXQgPCAxICYmIHRoaXMuZHJvcG91dE1hc2sgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmRyb3BvdXRNYXNrID0gZ2VuZXJhdGVEcm9wb3V0TWFzayh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uZXM6ICgpID0+IHRmYy5vbmVzTGlrZSh4KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmF0ZTogdGhpcy5kcm9wb3V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFpbmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IG51bU9mS2VybmVscyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHJvcG91dEZ1bmM6IHRoaXMuZHJvcG91dEZ1bmNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pIGFzIHRmYy5UZW5zb3JbXTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZHJvcG91dE1hc2sgPSB0aGlzLmRyb3BvdXRNYXNrIGFzIERyb3BvdXRNYXNrcztcblxuICAgICAgY29uc3QgYXBwbHlEcm9wb3V0ID1cbiAgICAgICAgICAoeDogdGZjLlRlbnNvciwgbWFzazogdGZjLlRlbnNvcltdLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICBpZiAoIW1hc2sgfHwgIW1hc2tbaW5kZXhdKSB7XG4gICAgICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGZjLm11bChtYXNrW2luZGV4XSwgeCk7XG4gICAgICAgICAgfTtcblxuICAgICAgbGV0IHhJID0gYXBwbHlEcm9wb3V0KHgsIGRyb3BvdXRNYXNrLCAwKTtcbiAgICAgIGxldCB4RiA9IGFwcGx5RHJvcG91dCh4LCBkcm9wb3V0TWFzaywgMSk7XG4gICAgICBsZXQgeEMgPSBhcHBseURyb3BvdXQoeCwgZHJvcG91dE1hc2ssIDIpO1xuICAgICAgbGV0IHhPID0gYXBwbHlEcm9wb3V0KHgsIGRyb3BvdXRNYXNrLCAzKTtcblxuICAgICAgaWYgKDAgPCB0aGlzLnJlY3VycmVudERyb3BvdXQgJiYgdGhpcy5yZWN1cnJlbnREcm9wb3V0IDwgMSAmJlxuICAgICAgICAgIHRoaXMucmVjdXJyZW50RHJvcG91dE1hc2sgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlY3VycmVudERyb3BvdXRNYXNrID0gZ2VuZXJhdGVEcm9wb3V0TWFzayh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uZXM6ICgpID0+IHRmYy5vbmVzTGlrZShoVE1pbnVzMSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhdGU6IHRoaXMucmVjdXJyZW50RHJvcG91dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhaW5pbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiBudW1PZktlcm5lbHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRyb3BvdXRGdW5jOiB0aGlzLmRyb3BvdXRGdW5jXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSBhcyB0ZmMuVGVuc29yW107XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlY0Ryb3BvdXRNYXNrID0gdGhpcy5yZWN1cnJlbnREcm9wb3V0TWFzayBhcyBEcm9wb3V0TWFza3M7XG5cbiAgICAgIGxldCBoSSA9IGFwcGx5RHJvcG91dChoVE1pbnVzMSwgcmVjRHJvcG91dE1hc2ssIDApO1xuICAgICAgbGV0IGhGID0gYXBwbHlEcm9wb3V0KGhUTWludXMxLCByZWNEcm9wb3V0TWFzaywgMSk7XG4gICAgICBsZXQgaEMgPSBhcHBseURyb3BvdXQoaFRNaW51czEsIHJlY0Ryb3BvdXRNYXNrLCAyKTtcbiAgICAgIGxldCBoTyA9IGFwcGx5RHJvcG91dChoVE1pbnVzMSwgcmVjRHJvcG91dE1hc2ssIDMpO1xuXG4gICAgICBjb25zdCBrZXJuZWxDaGFubmVsQXhpcyA9IDM7XG5cbiAgICAgIGNvbnN0IFtrZXJuZWxJLCBrZXJuZWxGLCBrZXJuZWxDLCBrZXJuZWxPXTogdGZjLlRlbnNvcltdID1cbiAgICAgICAgICB0ZmMuc3BsaXQodGhpcy5rZXJuZWwucmVhZCgpLCBudW1PZktlcm5lbHMsIGtlcm5lbENoYW5uZWxBeGlzKTtcblxuICAgICAgY29uc3QgW2JpYXNJLCBiaWFzRiwgYmlhc0MsIGJpYXNPXTogdGZjLlRlbnNvcltdID0gdGhpcy51c2VCaWFzID9cbiAgICAgICAgICB0ZmMuc3BsaXQodGhpcy5iaWFzLnJlYWQoKSwgbnVtT2ZLZXJuZWxzKSA6XG4gICAgICAgICAgW251bGwsIG51bGwsIG51bGwsIG51bGxdO1xuXG4gICAgICB4SSA9IHRoaXMuaW5wdXRDb252KHhJLCBrZXJuZWxJLCBiaWFzSSwgdGhpcy5wYWRkaW5nKTtcbiAgICAgIHhGID0gdGhpcy5pbnB1dENvbnYoeEYsIGtlcm5lbEYsIGJpYXNGLCB0aGlzLnBhZGRpbmcpO1xuICAgICAgeEMgPSB0aGlzLmlucHV0Q29udih4Qywga2VybmVsQywgYmlhc0MsIHRoaXMucGFkZGluZyk7XG4gICAgICB4TyA9IHRoaXMuaW5wdXRDb252KHhPLCBrZXJuZWxPLCBiaWFzTywgdGhpcy5wYWRkaW5nKTtcblxuICAgICAgY29uc3QgW3JlY0tlcm5lbEksIHJlY0tlcm5lbEYsIHJlY0tlcm5lbEMsIHJlY0tlcm5lbE9dOiB0ZmMuVGVuc29yW10gPVxuICAgICAgICAgIHRmYy5zcGxpdChcbiAgICAgICAgICAgICAgdGhpcy5yZWN1cnJlbnRLZXJuZWwucmVhZCgpLCBudW1PZktlcm5lbHMsIGtlcm5lbENoYW5uZWxBeGlzKTtcblxuICAgICAgaEkgPSB0aGlzLnJlY3VycmVudENvbnYoaEksIHJlY0tlcm5lbEkpO1xuICAgICAgaEYgPSB0aGlzLnJlY3VycmVudENvbnYoaEYsIHJlY0tlcm5lbEYpO1xuICAgICAgaEMgPSB0aGlzLnJlY3VycmVudENvbnYoaEMsIHJlY0tlcm5lbEMpO1xuICAgICAgaE8gPSB0aGlzLnJlY3VycmVudENvbnYoaE8sIHJlY0tlcm5lbE8pO1xuXG4gICAgICBjb25zdCBpID0gdGhpcy5yZWN1cnJlbnRBY3RpdmF0aW9uLmFwcGx5KHRmYy5hZGQoeEksIGhJKSk7XG4gICAgICBjb25zdCBmID0gdGhpcy5yZWN1cnJlbnRBY3RpdmF0aW9uLmFwcGx5KHRmYy5hZGQoeEYsIGhGKSk7XG4gICAgICBjb25zdCBjID0gdGZjLmFkZChcbiAgICAgICAgICB0ZmMubXVsKGYsIGNUTWludXMxKSxcbiAgICAgICAgICB0ZmMubXVsKGksIHRoaXMuYWN0aXZhdGlvbi5hcHBseSh0ZmMuYWRkKHhDLCBoQykpKSk7XG4gICAgICBjb25zdCBoID0gdGZjLm11bChcbiAgICAgICAgICB0aGlzLnJlY3VycmVudEFjdGl2YXRpb24uYXBwbHkodGZjLmFkZCh4TywgaE8pKSxcbiAgICAgICAgICB0aGlzLmFjdGl2YXRpb24uYXBwbHkoYykpO1xuXG4gICAgICByZXR1cm4gW2gsIGgsIGNdO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0Q29uZmlnKCk6IHRmYy5zZXJpYWxpemF0aW9uLkNvbmZpZ0RpY3Qge1xuICAgIGNvbnN0IHsndW5pdHMnOiBfLCAuLi5iYXNlQ29uZmlnfSA9IHN1cGVyLmdldENvbmZpZygpO1xuXG4gICAgY29uc3QgY29uZmlnOiB0ZmMuc2VyaWFsaXphdGlvbi5Db25maWdEaWN0ID0ge1xuICAgICAgZmlsdGVyczogdGhpcy5maWx0ZXJzLFxuICAgICAga2VybmVsU2l6ZTogdGhpcy5rZXJuZWxTaXplLFxuICAgICAgcGFkZGluZzogdGhpcy5wYWRkaW5nLFxuICAgICAgZGF0YUZvcm1hdDogdGhpcy5kYXRhRm9ybWF0LFxuICAgICAgZGlsYXRpb25SYXRlOiB0aGlzLmRpbGF0aW9uUmF0ZSxcbiAgICAgIHN0cmlkZXM6IHRoaXMuc3RyaWRlcyxcbiAgICB9O1xuXG4gICAgcmV0dXJuIHsuLi5iYXNlQ29uZmlnLCAuLi5jb25maWd9O1xuICB9XG5cbiAgaW5wdXRDb252KHg6IFRlbnNvciwgdzogVGVuc29yLCBiPzogVGVuc29yLCBwYWRkaW5nPzogUGFkZGluZ01vZGUpIHtcbiAgICBjb25zdCBvdXQgPSB0ZmMuY29udjJkKFxuICAgICAgICB4IGFzIHRmYy5UZW5zb3IzRCwgdyBhcyB0ZmMuVGVuc29yNEQsIHRoaXMuc3RyaWRlcyBhcyBbbnVtYmVyLCBudW1iZXJdLFxuICAgICAgICAocGFkZGluZyB8fCAndmFsaWQnKSBhcyAnc2FtZScgfCAndmFsaWQnLFxuICAgICAgICB0aGlzLmRhdGFGb3JtYXQgPT09ICdjaGFubmVsc0ZpcnN0JyA/ICdOQ0hXJyA6ICdOSFdDJyxcbiAgICAgICAgdGhpcy5kaWxhdGlvblJhdGUgYXMgW251bWJlciwgbnVtYmVyXSk7XG5cbiAgICBpZiAoYikge1xuICAgICAgcmV0dXJuIEsuYmlhc0FkZChvdXQsIGIsIHRoaXMuZGF0YUZvcm1hdCkgYXMgdGZjLlRlbnNvcjNEO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICByZWN1cnJlbnRDb252KHg6IFRlbnNvciwgdzogVGVuc29yKSB7XG4gICAgY29uc3Qgc3RyaWRlcyA9IDE7XG5cbiAgICByZXR1cm4gdGZjLmNvbnYyZChcbiAgICAgICAgeCBhcyB0ZmMuVGVuc29yM0QsIHcgYXMgdGZjLlRlbnNvcjRELCBzdHJpZGVzLCAnc2FtZScsXG4gICAgICAgIHRoaXMuZGF0YUZvcm1hdCA9PT0gJ2NoYW5uZWxzRmlyc3QnID8gJ05DSFcnIDogJ05IV0MnKTtcbiAgfVxufVxuXG50ZmMuc2VyaWFsaXphdGlvbi5yZWdpc3RlckNsYXNzKENvbnZMU1RNMkRDZWxsKTtcblxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIENvbnZMU1RNMkRBcmdzIGV4dGVuZHNcbiAgICBPbWl0PExTVE1MYXllckFyZ3MsICd1bml0cyd8J2NlbGwnPiwgQ29udlJOTjJETGF5ZXJBcmdzIHt9XG5cbmV4cG9ydCBjbGFzcyBDb252TFNUTTJEIGV4dGVuZHMgQ29udlJOTjJEIHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBjbGFzc05hbWUgPSAnQ29udkxTVE0yRCc7XG5cbiAgY29uc3RydWN0b3IoYXJnczogQ29udkxTVE0yREFyZ3MpIHtcbiAgICBjb25zdCBjZWxsID0gbmV3IENvbnZMU1RNMkRDZWxsKGFyZ3MpO1xuXG4gICAgc3VwZXIoey4uLmFyZ3MsIGNlbGx9IGFzIENvbnZSTk4yRExheWVyQXJncyk7XG4gIH1cblxuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIGZyb21Db25maWc8VCBleHRlbmRzIHRmYy5zZXJpYWxpemF0aW9uLlNlcmlhbGl6YWJsZT4oXG4gICAgICBjbHM6IHRmYy5zZXJpYWxpemF0aW9uLlNlcmlhbGl6YWJsZUNvbnN0cnVjdG9yPFQ+LFxuICAgICAgY29uZmlnOiB0ZmMuc2VyaWFsaXphdGlvbi5Db25maWdEaWN0KTogVCB7XG4gICAgcmV0dXJuIG5ldyBjbHMoY29uZmlnKTtcbiAgfVxufVxuXG50ZmMuc2VyaWFsaXphdGlvbi5yZWdpc3RlckNsYXNzKENvbnZMU1RNMkQpO1xuIl19