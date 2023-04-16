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
 * TensorFlow.js Layers: Embedding Layer.
 *
 * Original source: keras/constraints.py
 */
import { notEqual, reshape, serialization, tidy, zerosLike } from '@tensorflow/tfjs-core';
import * as K from '../backend/tfjs_backend';
import { getConstraint, serializeConstraint } from '../constraints';
import { Layer } from '../engine/topology';
import { ValueError } from '../errors';
import { getInitializer, serializeInitializer } from '../initializers';
import { getRegularizer, serializeRegularizer } from '../regularizers';
import * as generic_utils from '../utils/generic_utils';
import { getExactlyOneShape, getExactlyOneTensor } from '../utils/types_utils';
export class Embedding extends Layer {
    constructor(args) {
        super(args);
        this.embeddings = null;
        this.DEFAULT_EMBEDDINGS_INITIALIZER = 'randomUniform';
        if (args.batchInputShape == null && args.inputShape == null) {
            // Porting Note: This logic is copied from Layer's constructor, since we
            // can't do exactly what the Python constructor does for Embedding().
            // Specifically, the super constructor can not be called after the
            // mutation of the `config` argument.
            let batchSize = null;
            if (args.batchSize != null) {
                batchSize = args.batchSize;
            }
            if (args.inputLength == null) {
                // Fix super-constructor to what it would have done if
                // 'config.inputShape' were (None, )
                this.batchInputShape = [batchSize, null];
            }
            else {
                // Fix super-constructor to what it would have done if
                // 'config.inputShape' were (config.inputLength, )
                this.batchInputShape =
                    [batchSize].concat(generic_utils.toList(args.inputLength));
            }
        }
        this.inputDim = args.inputDim;
        generic_utils.assertPositiveInteger(this.inputDim, 'inputDim');
        this.outputDim = args.outputDim;
        generic_utils.assertPositiveInteger(this.outputDim, 'outputDim');
        this.embeddingsInitializer = getInitializer(args.embeddingsInitializer || this.DEFAULT_EMBEDDINGS_INITIALIZER);
        this.embeddingsRegularizer = getRegularizer(args.embeddingsRegularizer);
        this.activityRegularizer = getRegularizer(args.activityRegularizer);
        this.embeddingsConstraint = getConstraint(args.embeddingsConstraint);
        this.maskZero = args.maskZero;
        this.supportsMasking = args.maskZero;
        this.inputLength = args.inputLength;
    }
    build(inputShape) {
        this.embeddings = this.addWeight('embeddings', [this.inputDim, this.outputDim], this.dtype, this.embeddingsInitializer, this.embeddingsRegularizer, true, this.embeddingsConstraint);
        this.built = true;
    }
    // Override warnOnIncompatibleInputShape because an embedding layer allows
    // the input to have varying ranks.
    warnOnIncompatibleInputShape(inputShape) { }
    computeMask(inputs, mask) {
        return tidy(() => {
            if (!this.maskZero) {
                return null;
            }
            else {
                inputs = getExactlyOneTensor(inputs);
                return notEqual(inputs, zerosLike(inputs));
            }
        });
    }
    computeOutputShape(inputShape) {
        inputShape = getExactlyOneShape(inputShape);
        if (this.inputLength == null) {
            return [...inputShape, this.outputDim];
        }
        // inputLength can be an array if input is 3D or higher.
        const inLens = generic_utils.toList(this.inputLength);
        if (inLens.length !== inputShape.length - 1) {
            throw new ValueError(`"inputLength" is ${this.inputLength}, but received ` +
                `input shape has shape ${inputShape}`);
        }
        else {
            let i = 0;
            for (let k = 0; k < inLens.length; ++k) {
                const s1 = inLens[k];
                const s2 = inputShape[k + 1];
                if ((s1 != null) && (s2 != null) && (s1 !== s2)) {
                    throw new ValueError(`"inputLength" is ${this.inputLength}, but received ` +
                        `input shape has shape ${inputShape}`);
                }
                else if (s1 == null) {
                    inLens[i] = s2;
                }
                i++;
            }
        }
        return [inputShape[0], ...inLens, this.outputDim];
    }
    call(inputs, kwargs) {
        return tidy(() => {
            this.invokeCallHook(inputs, kwargs);
            // Embedding layer accepts only a single input.
            let input = getExactlyOneTensor(inputs);
            if (input.dtype !== 'int32') {
                input = K.cast(input, 'int32');
            }
            const output = K.gather(this.embeddings.read(), reshape(input, [input.size]));
            return reshape(output, getExactlyOneShape(this.computeOutputShape(input.shape)));
        });
    }
    getConfig() {
        const config = {
            inputDim: this.inputDim,
            outputDim: this.outputDim,
            embeddingsInitializer: serializeInitializer(this.embeddingsInitializer),
            embeddingsRegularizer: serializeRegularizer(this.embeddingsRegularizer),
            activityRegularizer: serializeRegularizer(this.activityRegularizer),
            embeddingsConstraint: serializeConstraint(this.embeddingsConstraint),
            maskZero: this.maskZero,
            inputLength: this.inputLength
        };
        const baseConfig = super.getConfig();
        Object.assign(config, baseConfig);
        return config;
    }
}
/** @nocollapse */
Embedding.className = 'Embedding';
serialization.registerClass(Embedding);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1iZWRkaW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtbGF5ZXJzL3NyYy9sYXllcnMvZW1iZWRkaW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7R0FRRztBQUVIOzs7O0dBSUc7QUFDSCxPQUFPLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQVUsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRWhHLE9BQU8sS0FBSyxDQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDN0MsT0FBTyxFQUFtQyxhQUFhLEVBQUUsbUJBQW1CLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwRyxPQUFPLEVBQUMsS0FBSyxFQUFZLE1BQU0sb0JBQW9CLENBQUM7QUFDcEQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNyQyxPQUFPLEVBQUMsY0FBYyxFQUFzQyxvQkFBb0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRXpHLE9BQU8sRUFBQyxjQUFjLEVBQXNDLG9CQUFvQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFekcsT0FBTyxLQUFLLGFBQWEsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RCxPQUFPLEVBQUMsa0JBQWtCLEVBQUUsbUJBQW1CLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQWlEN0UsTUFBTSxPQUFPLFNBQVUsU0FBUSxLQUFLO0lBZ0JsQyxZQUFZLElBQXdCO1FBQ2xDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQVJOLGVBQVUsR0FBa0IsSUFBSSxDQUFDO1FBRWhDLG1DQUE4QixHQUNuQyxlQUFlLENBQUM7UUFNbEIsSUFBSSxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksRUFBRTtZQUMzRCx3RUFBd0U7WUFDeEUscUVBQXFFO1lBQ3JFLGtFQUFrRTtZQUNsRSxxQ0FBcUM7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QUM7UUFDRixNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDckMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbEMsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQzs7QUFwSUQsa0JBQWtCO0FBQ1gsbUJBQVMsR0FBRyxXQUFXLENBQUM7QUFxSWpDLGFBQWEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gKiBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAqIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG4vKipcbiAqIFRlbnNvckZsb3cuanMgTGF5ZXJzOiBFbWJlZGRpbmcgTGF5ZXIuXG4gKlxuICogT3JpZ2luYWwgc291cmNlOiBrZXJhcy9jb25zdHJhaW50cy5weVxuICovXG5pbXBvcnQge25vdEVxdWFsLCByZXNoYXBlLCBzZXJpYWxpemF0aW9uLCBUZW5zb3IsIHRpZHksIHplcm9zTGlrZX0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0ICogYXMgSyBmcm9tICcuLi9iYWNrZW5kL3RmanNfYmFja2VuZCc7XG5pbXBvcnQge0NvbnN0cmFpbnQsIENvbnN0cmFpbnRJZGVudGlmaWVyLCBnZXRDb25zdHJhaW50LCBzZXJpYWxpemVDb25zdHJhaW50fSBmcm9tICcuLi9jb25zdHJhaW50cyc7XG5pbXBvcnQge0xheWVyLCBMYXllckFyZ3N9IGZyb20gJy4uL2VuZ2luZS90b3BvbG9neSc7XG5pbXBvcnQge1ZhbHVlRXJyb3J9IGZyb20gJy4uL2Vycm9ycyc7XG5pbXBvcnQge2dldEluaXRpYWxpemVyLCBJbml0aWFsaXplciwgSW5pdGlhbGl6ZXJJZGVudGlmaWVyLCBzZXJpYWxpemVJbml0aWFsaXplcn0gZnJvbSAnLi4vaW5pdGlhbGl6ZXJzJztcbmltcG9ydCB7U2hhcGV9IGZyb20gJy4uL2tlcmFzX2Zvcm1hdC9jb21tb24nO1xuaW1wb3J0IHtnZXRSZWd1bGFyaXplciwgUmVndWxhcml6ZXIsIFJlZ3VsYXJpemVySWRlbnRpZmllciwgc2VyaWFsaXplUmVndWxhcml6ZXJ9IGZyb20gJy4uL3JlZ3VsYXJpemVycyc7XG5pbXBvcnQge0t3YXJnc30gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0ICogYXMgZ2VuZXJpY191dGlscyBmcm9tICcuLi91dGlscy9nZW5lcmljX3V0aWxzJztcbmltcG9ydCB7Z2V0RXhhY3RseU9uZVNoYXBlLCBnZXRFeGFjdGx5T25lVGVuc29yfSBmcm9tICcuLi91dGlscy90eXBlc191dGlscyc7XG5pbXBvcnQge0xheWVyVmFyaWFibGV9IGZyb20gJy4uL3ZhcmlhYmxlcyc7XG5cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBFbWJlZGRpbmdMYXllckFyZ3MgZXh0ZW5kcyBMYXllckFyZ3Mge1xuICAvKipcbiAgICogSW50ZWdlciA+IDAuIFNpemUgb2YgdGhlIHZvY2FidWxhcnksIGkuZS4gbWF4aW11bSBpbnRlZ2VyIGluZGV4ICsgMS5cbiAgICovXG4gIGlucHV0RGltOiBudW1iZXI7XG4gIC8qKlxuICAgKiBJbnRlZ2VyID49IDAuIERpbWVuc2lvbiBvZiB0aGUgZGVuc2UgZW1iZWRkaW5nLlxuICAgKi9cbiAgb3V0cHV0RGltOiBudW1iZXI7XG4gIC8qKlxuICAgKiBJbml0aWFsaXplciBmb3IgdGhlIGBlbWJlZGRpbmdzYCBtYXRyaXguXG4gICAqL1xuICBlbWJlZGRpbmdzSW5pdGlhbGl6ZXI/OiBJbml0aWFsaXplcklkZW50aWZpZXJ8SW5pdGlhbGl6ZXI7XG4gIC8qKlxuICAgKiBSZWd1bGFyaXplciBmdW5jdGlvbiBhcHBsaWVkIHRvIHRoZSBgZW1iZWRkaW5nc2AgbWF0cml4LlxuICAgKi9cbiAgZW1iZWRkaW5nc1JlZ3VsYXJpemVyPzogUmVndWxhcml6ZXJJZGVudGlmaWVyfFJlZ3VsYXJpemVyO1xuICAvKipcbiAgICogUmVndWxhcml6ZXIgZnVuY3Rpb24gYXBwbGllZCB0byB0aGUgYWN0aXZhdGlvbi5cbiAgICovXG4gIGFjdGl2aXR5UmVndWxhcml6ZXI/OiBSZWd1bGFyaXplcklkZW50aWZpZXJ8UmVndWxhcml6ZXI7XG4gIC8qKlxuICAgKiBDb25zdHJhaW50IGZ1bmN0aW9uIGFwcGxpZWQgdG8gdGhlIGBlbWJlZGRpbmdzYCBtYXRyaXguXG4gICAqL1xuICBlbWJlZGRpbmdzQ29uc3RyYWludD86IENvbnN0cmFpbnRJZGVudGlmaWVyfENvbnN0cmFpbnQ7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBpbnB1dCB2YWx1ZSAwIGlzIGEgc3BlY2lhbCBcInBhZGRpbmdcIiB2YWx1ZSB0aGF0IHNob3VsZCBiZVxuICAgKiBtYXNrZWQgb3V0LiBUaGlzIGlzIHVzZWZ1bCB3aGVuIHVzaW5nIHJlY3VycmVudCBsYXllcnMgd2hpY2ggbWF5IHRha2VcbiAgICogdmFyaWFibGUgbGVuZ3RoIGlucHV0LlxuICAgKlxuICAgKiBJZiB0aGlzIGlzIGBUcnVlYCB0aGVuIGFsbCBzdWJzZXF1ZW50IGxheWVycyBpbiB0aGUgbW9kZWwgbmVlZCB0byBzdXBwb3J0XG4gICAqIG1hc2tpbmcgb3IgYW4gZXhjZXB0aW9uIHdpbGwgYmUgcmFpc2VkLiBJZiBtYXNrWmVybyBpcyBzZXQgdG8gYFRydWVgLCBhcyBhXG4gICAqIGNvbnNlcXVlbmNlLCBpbmRleCAwIGNhbm5vdCBiZSB1c2VkIGluIHRoZSB2b2NhYnVsYXJ5IChpbnB1dERpbSBzaG91bGRcbiAgICogZXF1YWwgc2l6ZSBvZiB2b2NhYnVsYXJ5ICsgMSkuXG4gICAqL1xuICBtYXNrWmVybz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBMZW5ndGggb2YgaW5wdXQgc2VxdWVuY2VzLCB3aGVuIGl0IGlzIGNvbnN0YW50LlxuICAgKlxuICAgKiBUaGlzIGFyZ3VtZW50IGlzIHJlcXVpcmVkIGlmIHlvdSBhcmUgZ29pbmcgdG8gY29ubmVjdCBgZmxhdHRlbmAgdGhlblxuICAgKiBgZGVuc2VgIGxheWVycyB1cHN0cmVhbSAod2l0aG91dCBpdCwgdGhlIHNoYXBlIG9mIHRoZSBkZW5zZSBvdXRwdXRzIGNhbm5vdFxuICAgKiBiZSBjb21wdXRlZCkuXG4gICAqL1xuICBpbnB1dExlbmd0aD86IG51bWJlcnxudW1iZXJbXTtcbn1cblxuZXhwb3J0IGNsYXNzIEVtYmVkZGluZyBleHRlbmRzIExheWVyIHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBjbGFzc05hbWUgPSAnRW1iZWRkaW5nJztcbiAgcHJpdmF0ZSBpbnB1dERpbTogbnVtYmVyO1xuICBwcml2YXRlIG91dHB1dERpbTogbnVtYmVyO1xuICBwcml2YXRlIGVtYmVkZGluZ3NJbml0aWFsaXplcjogSW5pdGlhbGl6ZXI7XG4gIHByaXZhdGUgbWFza1plcm86IGJvb2xlYW47XG4gIHByaXZhdGUgaW5wdXRMZW5ndGg6IG51bWJlcnxudW1iZXJbXTtcblxuICBwcml2YXRlIGVtYmVkZGluZ3M6IExheWVyVmFyaWFibGUgPSBudWxsO1xuXG4gIHJlYWRvbmx5IERFRkFVTFRfRU1CRURESU5HU19JTklUSUFMSVpFUjogSW5pdGlhbGl6ZXJJZGVudGlmaWVyID1cbiAgICAgICdyYW5kb21Vbmlmb3JtJztcbiAgcHJpdmF0ZSByZWFkb25seSBlbWJlZGRpbmdzUmVndWxhcml6ZXI/OiBSZWd1bGFyaXplcjtcbiAgcHJpdmF0ZSByZWFkb25seSBlbWJlZGRpbmdzQ29uc3RyYWludD86IENvbnN0cmFpbnQ7XG5cbiAgY29uc3RydWN0b3IoYXJnczogRW1iZWRkaW5nTGF5ZXJBcmdzKSB7XG4gICAgc3VwZXIoYXJncyk7XG4gICAgaWYgKGFyZ3MuYmF0Y2hJbnB1dFNoYXBlID09IG51bGwgJiYgYXJncy5pbnB1dFNoYXBlID09IG51bGwpIHtcbiAgICAgIC8vIFBvcnRpbmcgTm90ZTogVGhpcyBsb2dpYyBpcyBjb3BpZWQgZnJvbSBMYXllcidzIGNvbnN0cnVjdG9yLCBzaW5jZSB3ZVxuICAgICAgLy8gY2FuJ3QgZG8gZXhhY3RseSB3aGF0IHRoZSBQeXRob24gY29uc3RydWN0b3IgZG9lcyBmb3IgRW1iZWRkaW5nKCkuXG4gICAgICAvLyBTcGVjaWZpY2FsbHksIHRoZSBzdXBlciBjb25zdHJ1Y3RvciBjYW4gbm90IGJlIGNhbGxlZCBhZnRlciB0aGVcbiAgICAgIC8vIG11dGF0aW9uIG9mIHRoZSBgY29uZmlnYCBhcmd1bWVudC5cbiAgICAgIGxldCBiYXRjaFNpemU6IG51bWJlciA9IG51bGw7XG4gICAgICBpZiAoYXJncy5iYXRjaFNpemUgIT0gbnVsbCkge1xuICAgICAgICBiYXRjaFNpemUgPSBhcmdzLmJhdGNoU2l6ZTtcbiAgICAgIH1cbiAgICAgIGlmIChhcmdzLmlucHV0TGVuZ3RoID09IG51bGwpIHtcbiAgICAgICAgLy8gRml4IHN1cGVyLWNvbnN0cnVjdG9yIHRvIHdoYXQgaXQgd291bGQgaGF2ZSBkb25lIGlmXG4gICAgICAgIC8vICdjb25maWcuaW5wdXRTaGFwZScgd2VyZSAoTm9uZSwgKVxuICAgICAgICB0aGlzLmJhdGNoSW5wdXRTaGFwZSA9IFtiYXRjaFNpemUsIG51bGxdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRml4IHN1cGVyLWNvbnN0cnVjdG9yIHRvIHdoYXQgaXQgd291bGQgaGF2ZSBkb25lIGlmXG4gICAgICAgIC8vICdjb25maWcuaW5wdXRTaGFwZScgd2VyZSAoY29uZmlnLmlucHV0TGVuZ3RoLCApXG4gICAgICAgIHRoaXMuYmF0Y2hJbnB1dFNoYXBlID1cbiAgICAgICAgICAgIFtiYXRjaFNpemVdLmNvbmNhdChnZW5lcmljX3V0aWxzLnRvTGlzdChhcmdzLmlucHV0TGVuZ3RoKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuaW5wdXREaW0gPSBhcmdzLmlucHV0RGltO1xuICAgIGdlbmVyaWNfdXRpbHMuYXNzZXJ0UG9zaXRpdmVJbnRlZ2VyKHRoaXMuaW5wdXREaW0sICdpbnB1dERpbScpO1xuICAgIHRoaXMub3V0cHV0RGltID0gYXJncy5vdXRwdXREaW07XG4gICAgZ2VuZXJpY191dGlscy5hc3NlcnRQb3NpdGl2ZUludGVnZXIodGhpcy5vdXRwdXREaW0sICdvdXRwdXREaW0nKTtcbiAgICB0aGlzLmVtYmVkZGluZ3NJbml0aWFsaXplciA9IGdldEluaXRpYWxpemVyKFxuICAgICAgICBhcmdzLmVtYmVkZGluZ3NJbml0aWFsaXplciB8fCB0aGlzLkRFRkFVTFRfRU1CRURESU5HU19JTklUSUFMSVpFUik7XG4gICAgdGhpcy5lbWJlZGRpbmdzUmVndWxhcml6ZXIgPSBnZXRSZWd1bGFyaXplcihhcmdzLmVtYmVkZGluZ3NSZWd1bGFyaXplcik7XG4gICAgdGhpcy5hY3Rpdml0eVJlZ3VsYXJpemVyID0gZ2V0UmVndWxhcml6ZXIoYXJncy5hY3Rpdml0eVJlZ3VsYXJpemVyKTtcbiAgICB0aGlzLmVtYmVkZGluZ3NDb25zdHJhaW50ID0gZ2V0Q29uc3RyYWludChhcmdzLmVtYmVkZGluZ3NDb25zdHJhaW50KTtcbiAgICB0aGlzLm1hc2taZXJvID0gYXJncy5tYXNrWmVybztcbiAgICB0aGlzLnN1cHBvcnRzTWFza2luZyA9IGFyZ3MubWFza1plcm87XG4gICAgdGhpcy5pbnB1dExlbmd0aCA9IGFyZ3MuaW5wdXRMZW5ndGg7XG4gIH1cblxuICBwdWJsaWMgYnVpbGQoaW5wdXRTaGFwZTogU2hhcGV8U2hhcGVbXSk6IHZvaWQge1xuICAgIHRoaXMuZW1iZWRkaW5ncyA9IHRoaXMuYWRkV2VpZ2h0KFxuICAgICAgICAnZW1iZWRkaW5ncycsIFt0aGlzLmlucHV0RGltLCB0aGlzLm91dHB1dERpbV0sIHRoaXMuZHR5cGUsXG4gICAgICAgIHRoaXMuZW1iZWRkaW5nc0luaXRpYWxpemVyLCB0aGlzLmVtYmVkZGluZ3NSZWd1bGFyaXplciwgdHJ1ZSxcbiAgICAgICAgdGhpcy5lbWJlZGRpbmdzQ29uc3RyYWludCk7XG4gICAgdGhpcy5idWlsdCA9IHRydWU7XG4gIH1cblxuICAvLyBPdmVycmlkZSB3YXJuT25JbmNvbXBhdGlibGVJbnB1dFNoYXBlIGJlY2F1c2UgYW4gZW1iZWRkaW5nIGxheWVyIGFsbG93c1xuICAvLyB0aGUgaW5wdXQgdG8gaGF2ZSB2YXJ5aW5nIHJhbmtzLlxuICBwcm90ZWN0ZWQgd2Fybk9uSW5jb21wYXRpYmxlSW5wdXRTaGFwZShpbnB1dFNoYXBlOiBTaGFwZSkge31cblxuICBjb21wdXRlTWFzayhpbnB1dHM6IFRlbnNvcnxUZW5zb3JbXSwgbWFzaz86IFRlbnNvcnxUZW5zb3JbXSk6IFRlbnNvciB7XG4gICAgcmV0dXJuIHRpZHkoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLm1hc2taZXJvKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXRzID0gZ2V0RXhhY3RseU9uZVRlbnNvcihpbnB1dHMpO1xuICAgICAgICByZXR1cm4gbm90RXF1YWwoaW5wdXRzLCB6ZXJvc0xpa2UoaW5wdXRzKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBjb21wdXRlT3V0cHV0U2hhcGUoaW5wdXRTaGFwZTogU2hhcGV8U2hhcGVbXSk6IFNoYXBlfFNoYXBlW10ge1xuICAgIGlucHV0U2hhcGUgPSBnZXRFeGFjdGx5T25lU2hhcGUoaW5wdXRTaGFwZSk7XG4gICAgaWYgKHRoaXMuaW5wdXRMZW5ndGggPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFsuLi5pbnB1dFNoYXBlLCB0aGlzLm91dHB1dERpbV07XG4gICAgfVxuICAgIC8vIGlucHV0TGVuZ3RoIGNhbiBiZSBhbiBhcnJheSBpZiBpbnB1dCBpcyAzRCBvciBoaWdoZXIuXG4gICAgY29uc3QgaW5MZW5zOiBudW1iZXJbXSA9IGdlbmVyaWNfdXRpbHMudG9MaXN0KHRoaXMuaW5wdXRMZW5ndGgpO1xuICAgIGlmIChpbkxlbnMubGVuZ3RoICE9PSBpbnB1dFNoYXBlLmxlbmd0aCAtIDEpIHtcbiAgICAgIHRocm93IG5ldyBWYWx1ZUVycm9yKFxuICAgICAgICAgIGBcImlucHV0TGVuZ3RoXCIgaXMgJHt0aGlzLmlucHV0TGVuZ3RofSwgYnV0IHJlY2VpdmVkIGAgK1xuICAgICAgICAgIGBpbnB1dCBzaGFwZSBoYXMgc2hhcGUgJHtpbnB1dFNoYXBlfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgaSA9IDA7XG4gICAgICBmb3IgKGxldCBrID0gMDsgayA8IGluTGVucy5sZW5ndGg7ICsraykge1xuICAgICAgICBjb25zdCBzMSA9IGluTGVuc1trXTtcbiAgICAgICAgY29uc3QgczIgPSBpbnB1dFNoYXBlW2sgKyAxXTtcbiAgICAgICAgaWYgKChzMSAhPSBudWxsKSAmJiAoczIgIT0gbnVsbCkgJiYgKHMxICE9PSBzMikpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVmFsdWVFcnJvcihcbiAgICAgICAgICAgICAgYFwiaW5wdXRMZW5ndGhcIiBpcyAke3RoaXMuaW5wdXRMZW5ndGh9LCBidXQgcmVjZWl2ZWQgYCArXG4gICAgICAgICAgICAgIGBpbnB1dCBzaGFwZSBoYXMgc2hhcGUgJHtpbnB1dFNoYXBlfWApO1xuICAgICAgICB9IGVsc2UgaWYgKHMxID09IG51bGwpIHtcbiAgICAgICAgICBpbkxlbnNbaV0gPSBzMjtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbaW5wdXRTaGFwZVswXSwgLi4uaW5MZW5zLCB0aGlzLm91dHB1dERpbV07XG4gIH1cblxuICBjYWxsKGlucHV0czogVGVuc29yfFRlbnNvcltdLCBrd2FyZ3M6IEt3YXJncyk6IFRlbnNvcnxUZW5zb3JbXSB7XG4gICAgcmV0dXJuIHRpZHkoKCkgPT4ge1xuICAgICAgdGhpcy5pbnZva2VDYWxsSG9vayhpbnB1dHMsIGt3YXJncyk7XG4gICAgICAvLyBFbWJlZGRpbmcgbGF5ZXIgYWNjZXB0cyBvbmx5IGEgc2luZ2xlIGlucHV0LlxuICAgICAgbGV0IGlucHV0ID0gZ2V0RXhhY3RseU9uZVRlbnNvcihpbnB1dHMpO1xuICAgICAgaWYgKGlucHV0LmR0eXBlICE9PSAnaW50MzInKSB7XG4gICAgICAgIGlucHV0ID0gSy5jYXN0KGlucHV0LCAnaW50MzInKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG91dHB1dCA9XG4gICAgICAgICAgSy5nYXRoZXIodGhpcy5lbWJlZGRpbmdzLnJlYWQoKSwgcmVzaGFwZShpbnB1dCwgW2lucHV0LnNpemVdKSk7XG4gICAgICByZXR1cm4gcmVzaGFwZShcbiAgICAgICAgICBvdXRwdXQsIGdldEV4YWN0bHlPbmVTaGFwZSh0aGlzLmNvbXB1dGVPdXRwdXRTaGFwZShpbnB1dC5zaGFwZSkpKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldENvbmZpZygpOiBzZXJpYWxpemF0aW9uLkNvbmZpZ0RpY3Qge1xuICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgIGlucHV0RGltOiB0aGlzLmlucHV0RGltLFxuICAgICAgb3V0cHV0RGltOiB0aGlzLm91dHB1dERpbSxcbiAgICAgIGVtYmVkZGluZ3NJbml0aWFsaXplcjogc2VyaWFsaXplSW5pdGlhbGl6ZXIodGhpcy5lbWJlZGRpbmdzSW5pdGlhbGl6ZXIpLFxuICAgICAgZW1iZWRkaW5nc1JlZ3VsYXJpemVyOiBzZXJpYWxpemVSZWd1bGFyaXplcih0aGlzLmVtYmVkZGluZ3NSZWd1bGFyaXplciksXG4gICAgICBhY3Rpdml0eVJlZ3VsYXJpemVyOiBzZXJpYWxpemVSZWd1bGFyaXplcih0aGlzLmFjdGl2aXR5UmVndWxhcml6ZXIpLFxuICAgICAgZW1iZWRkaW5nc0NvbnN0cmFpbnQ6IHNlcmlhbGl6ZUNvbnN0cmFpbnQodGhpcy5lbWJlZGRpbmdzQ29uc3RyYWludCksXG4gICAgICBtYXNrWmVybzogdGhpcy5tYXNrWmVybyxcbiAgICAgIGlucHV0TGVuZ3RoOiB0aGlzLmlucHV0TGVuZ3RoXG4gICAgfTtcbiAgICBjb25zdCBiYXNlQ29uZmlnID0gc3VwZXIuZ2V0Q29uZmlnKCk7XG4gICAgT2JqZWN0LmFzc2lnbihjb25maWcsIGJhc2VDb25maWcpO1xuICAgIHJldHVybiBjb25maWc7XG4gIH1cbn1cbnNlcmlhbGl6YXRpb24ucmVnaXN0ZXJDbGFzcyhFbWJlZGRpbmcpO1xuIl19