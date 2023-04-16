/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
import { eye, linalg, mul, ones, randomUniform, scalar, serialization, tidy, transpose, truncatedNormal, zeros } from '@tensorflow/tfjs-core';
import * as K from './backend/tfjs_backend';
import { checkDataFormat } from './common';
import { NotImplementedError, ValueError } from './errors';
import { VALID_DISTRIBUTION_VALUES, VALID_FAN_MODE_VALUES } from './keras_format/initializer_config';
import { checkStringTypeUnionValue, deserializeKerasObject, serializeKerasObject } from './utils/generic_utils';
import { arrayProd } from './utils/math_utils';
export function checkFanMode(value) {
    checkStringTypeUnionValue(VALID_FAN_MODE_VALUES, 'FanMode', value);
}
export function checkDistribution(value) {
    checkStringTypeUnionValue(VALID_DISTRIBUTION_VALUES, 'Distribution', value);
}
/**
 * Initializer base class.
 *
 * @doc {
 *   heading: 'Initializers', subheading: 'Classes', namespace: 'initializers'}
 */
export class Initializer extends serialization.Serializable {
    fromConfigUsesCustomObjects() {
        return false;
    }
    getConfig() {
        return {};
    }
}
export class Zeros extends Initializer {
    apply(shape, dtype) {
        return zeros(shape, dtype);
    }
}
/** @nocollapse */
Zeros.className = 'Zeros';
serialization.registerClass(Zeros);
export class Ones extends Initializer {
    apply(shape, dtype) {
        return ones(shape, dtype);
    }
}
/** @nocollapse */
Ones.className = 'Ones';
serialization.registerClass(Ones);
export class Constant extends Initializer {
    constructor(args) {
        super();
        if (typeof args !== 'object') {
            throw new ValueError(`Expected argument of type ConstantConfig but got ${args}`);
        }
        if (args.value === undefined) {
            throw new ValueError(`config must have value set but got ${args}`);
        }
        this.value = args.value;
    }
    apply(shape, dtype) {
        return tidy(() => mul(scalar(this.value), ones(shape, dtype)));
    }
    getConfig() {
        return {
            value: this.value,
        };
    }
}
/** @nocollapse */
Constant.className = 'Constant';
serialization.registerClass(Constant);
export class RandomUniform extends Initializer {
    constructor(args) {
        super();
        this.DEFAULT_MINVAL = -0.05;
        this.DEFAULT_MAXVAL = 0.05;
        this.minval = args.minval || this.DEFAULT_MINVAL;
        this.maxval = args.maxval || this.DEFAULT_MAXVAL;
        this.seed = args.seed;
    }
    apply(shape, dtype) {
        return randomUniform(shape, this.minval, this.maxval, dtype);
    }
    getConfig() {
        return { minval: this.minval, maxval: this.maxval, seed: this.seed };
    }
}
/** @nocollapse */
RandomUniform.className = 'RandomUniform';
serialization.registerClass(RandomUniform);
export class RandomNormal extends Initializer {
    constructor(args) {
        super();
        this.DEFAULT_MEAN = 0.;
        this.DEFAULT_STDDEV = 0.05;
        this.mean = args.mean || this.DEFAULT_MEAN;
        this.stddev = args.stddev || this.DEFAULT_STDDEV;
        this.seed = args.seed;
    }
    apply(shape, dtype) {
        dtype = dtype || 'float32';
        if (dtype !== 'float32' && dtype !== 'int32') {
            throw new NotImplementedError(`randomNormal does not support dType ${dtype}.`);
        }
        return K.randomNormal(shape, this.mean, this.stddev, dtype, this.seed);
    }
    getConfig() {
        return { mean: this.mean, stddev: this.stddev, seed: this.seed };
    }
}
/** @nocollapse */
RandomNormal.className = 'RandomNormal';
serialization.registerClass(RandomNormal);
export class TruncatedNormal extends Initializer {
    constructor(args) {
        super();
        this.DEFAULT_MEAN = 0.;
        this.DEFAULT_STDDEV = 0.05;
        this.mean = args.mean || this.DEFAULT_MEAN;
        this.stddev = args.stddev || this.DEFAULT_STDDEV;
        this.seed = args.seed;
    }
    apply(shape, dtype) {
        dtype = dtype || 'float32';
        if (dtype !== 'float32' && dtype !== 'int32') {
            throw new NotImplementedError(`truncatedNormal does not support dType ${dtype}.`);
        }
        return truncatedNormal(shape, this.mean, this.stddev, dtype, this.seed);
    }
    getConfig() {
        return { mean: this.mean, stddev: this.stddev, seed: this.seed };
    }
}
/** @nocollapse */
TruncatedNormal.className = 'TruncatedNormal';
serialization.registerClass(TruncatedNormal);
export class Identity extends Initializer {
    constructor(args) {
        super();
        this.gain = args.gain != null ? args.gain : 1.0;
    }
    apply(shape, dtype) {
        return tidy(() => {
            if (shape.length !== 2 || shape[0] !== shape[1]) {
                throw new ValueError('Identity matrix initializer can only be used for' +
                    ' 2D square matrices.');
            }
            else {
                return mul(this.gain, eye(shape[0]));
            }
        });
    }
    getConfig() {
        return { gain: this.gain };
    }
}
/** @nocollapse */
Identity.className = 'Identity';
serialization.registerClass(Identity);
/**
 * Computes the number of input and output units for a weight shape.
 * @param shape Shape of weight.
 * @param dataFormat data format to use for convolution kernels.
 *   Note that all kernels in Keras are standardized on the
 *   CHANNEL_LAST ordering (even when inputs are set to CHANNEL_FIRST).
 * @return An length-2 array: fanIn, fanOut.
 */
function computeFans(shape, dataFormat = 'channelsLast') {
    let fanIn;
    let fanOut;
    checkDataFormat(dataFormat);
    if (shape.length === 2) {
        fanIn = shape[0];
        fanOut = shape[1];
    }
    else if ([3, 4, 5].indexOf(shape.length) !== -1) {
        if (dataFormat === 'channelsFirst') {
            const receptiveFieldSize = arrayProd(shape, 2);
            fanIn = shape[1] * receptiveFieldSize;
            fanOut = shape[0] * receptiveFieldSize;
        }
        else if (dataFormat === 'channelsLast') {
            const receptiveFieldSize = arrayProd(shape, 0, shape.length - 2);
            fanIn = shape[shape.length - 2] * receptiveFieldSize;
            fanOut = shape[shape.length - 1] * receptiveFieldSize;
        }
    }
    else {
        const shapeProd = arrayProd(shape);
        fanIn = Math.sqrt(shapeProd);
        fanOut = Math.sqrt(shapeProd);
    }
    return [fanIn, fanOut];
}
export class VarianceScaling extends Initializer {
    /**
     * Constructor of VarianceScaling.
     * @throws ValueError for invalid value in scale.
     */
    constructor(args) {
        super();
        if (args.scale < 0.0) {
            throw new ValueError(`scale must be a positive float. Got: ${args.scale}`);
        }
        this.scale = args.scale == null ? 1.0 : args.scale;
        this.mode = args.mode == null ? 'fanIn' : args.mode;
        checkFanMode(this.mode);
        this.distribution =
            args.distribution == null ? 'normal' : args.distribution;
        checkDistribution(this.distribution);
        this.seed = args.seed;
    }
    apply(shape, dtype) {
        const fans = computeFans(shape);
        const fanIn = fans[0];
        const fanOut = fans[1];
        let scale = this.scale;
        if (this.mode === 'fanIn') {
            scale /= Math.max(1, fanIn);
        }
        else if (this.mode === 'fanOut') {
            scale /= Math.max(1, fanOut);
        }
        else {
            scale /= Math.max(1, (fanIn + fanOut) / 2);
        }
        if (this.distribution === 'normal') {
            const stddev = Math.sqrt(scale);
            dtype = dtype || 'float32';
            if (dtype !== 'float32' && dtype !== 'int32') {
                throw new NotImplementedError(`${this.getClassName()} does not support dType ${dtype}.`);
            }
            return truncatedNormal(shape, 0, stddev, dtype, this.seed);
        }
        else {
            const limit = Math.sqrt(3 * scale);
            return randomUniform(shape, -limit, limit, dtype);
        }
    }
    getConfig() {
        return {
            scale: this.scale,
            mode: this.mode,
            distribution: this.distribution,
            seed: this.seed
        };
    }
}
/** @nocollapse */
VarianceScaling.className = 'VarianceScaling';
serialization.registerClass(VarianceScaling);
export class GlorotUniform extends VarianceScaling {
    /**
     * Constructor of GlorotUniform
     * @param scale
     * @param mode
     * @param distribution
     * @param seed
     */
    constructor(args) {
        super({
            scale: 1.0,
            mode: 'fanAvg',
            distribution: 'uniform',
            seed: args == null ? null : args.seed
        });
    }
    getClassName() {
        // In Python Keras, GlorotUniform is not a class, but a helper method
        // that creates a VarianceScaling object. Use 'VarianceScaling' as
        // class name to be compatible with that.
        return VarianceScaling.className;
    }
}
/** @nocollapse */
GlorotUniform.className = 'GlorotUniform';
serialization.registerClass(GlorotUniform);
export class GlorotNormal extends VarianceScaling {
    /**
     * Constructor of GlorotNormal.
     * @param scale
     * @param mode
     * @param distribution
     * @param seed
     */
    constructor(args) {
        super({
            scale: 1.0,
            mode: 'fanAvg',
            distribution: 'normal',
            seed: args == null ? null : args.seed
        });
    }
    getClassName() {
        // In Python Keras, GlorotNormal is not a class, but a helper method
        // that creates a VarianceScaling object. Use 'VarianceScaling' as
        // class name to be compatible with that.
        return VarianceScaling.className;
    }
}
/** @nocollapse */
GlorotNormal.className = 'GlorotNormal';
serialization.registerClass(GlorotNormal);
export class HeNormal extends VarianceScaling {
    constructor(args) {
        super({
            scale: 2.0,
            mode: 'fanIn',
            distribution: 'normal',
            seed: args == null ? null : args.seed
        });
    }
    getClassName() {
        // In Python Keras, HeNormal is not a class, but a helper method
        // that creates a VarianceScaling object. Use 'VarianceScaling' as
        // class name to be compatible with that.
        return VarianceScaling.className;
    }
}
/** @nocollapse */
HeNormal.className = 'HeNormal';
serialization.registerClass(HeNormal);
export class HeUniform extends VarianceScaling {
    constructor(args) {
        super({
            scale: 2.0,
            mode: 'fanIn',
            distribution: 'uniform',
            seed: args == null ? null : args.seed
        });
    }
    getClassName() {
        // In Python Keras, HeUniform is not a class, but a helper method
        // that creates a VarianceScaling object. Use 'VarianceScaling' as
        // class name to be compatible with that.
        return VarianceScaling.className;
    }
}
/** @nocollapse */
HeUniform.className = 'HeUniform';
serialization.registerClass(HeUniform);
export class LeCunNormal extends VarianceScaling {
    constructor(args) {
        super({
            scale: 1.0,
            mode: 'fanIn',
            distribution: 'normal',
            seed: args == null ? null : args.seed
        });
    }
    getClassName() {
        // In Python Keras, LeCunNormal is not a class, but a helper method
        // that creates a VarianceScaling object. Use 'VarianceScaling' as
        // class name to be compatible with that.
        return VarianceScaling.className;
    }
}
/** @nocollapse */
LeCunNormal.className = 'LeCunNormal';
serialization.registerClass(LeCunNormal);
export class LeCunUniform extends VarianceScaling {
    constructor(args) {
        super({
            scale: 1.0,
            mode: 'fanIn',
            distribution: 'uniform',
            seed: args == null ? null : args.seed
        });
    }
    getClassName() {
        // In Python Keras, LeCunUniform is not a class, but a helper method
        // that creates a VarianceScaling object. Use 'VarianceScaling' as
        // class name to be compatible with that.
        return VarianceScaling.className;
    }
}
/** @nocollapse */
LeCunUniform.className = 'LeCunNormal';
serialization.registerClass(LeCunUniform);
export class Orthogonal extends Initializer {
    constructor(args) {
        super();
        this.DEFAULT_GAIN = 1;
        this.gain = args.gain == null ? this.DEFAULT_GAIN : args.gain;
        this.seed = args.seed;
        if (this.seed != null) {
            throw new NotImplementedError('Random seed is not implemented for Orthogonal Initializer yet.');
        }
    }
    apply(shape, dtype) {
        return tidy(() => {
            if (shape.length < 2) {
                throw new NotImplementedError('Shape must be at least 2D.');
            }
            if (shape[0] * shape[1] > 2000) {
                console.warn(`Orthogonal initializer is being called on a matrix with more ` +
                    `than 2000 (${shape[0] * shape[1]}) elements: ` +
                    `Slowness may result.`);
            }
            // TODO(cais): Add seed support.
            const normalizedShape = shape[0] > shape[1] ? [shape[1], shape[0]] : shape;
            const a = K.randomNormal(normalizedShape, 0, 1, 'float32');
            let q = linalg.gramSchmidt(a);
            if (shape[0] > shape[1]) {
                q = transpose(q);
            }
            return mul(this.gain, q);
        });
    }
    getConfig() {
        return {
            gain: this.gain,
            seed: this.seed,
        };
    }
}
/** @nocollapse */
Orthogonal.className = 'Orthogonal';
serialization.registerClass(Orthogonal);
// Maps the JavaScript-like identifier keys to the corresponding registry
// symbols.
export const INITIALIZER_IDENTIFIER_REGISTRY_SYMBOL_MAP = {
    'constant': 'Constant',
    'glorotNormal': 'GlorotNormal',
    'glorotUniform': 'GlorotUniform',
    'heNormal': 'HeNormal',
    'heUniform': 'HeUniform',
    'identity': 'Identity',
    'leCunNormal': 'LeCunNormal',
    'leCunUniform': 'LeCunUniform',
    'ones': 'Ones',
    'orthogonal': 'Orthogonal',
    'randomNormal': 'RandomNormal',
    'randomUniform': 'RandomUniform',
    'truncatedNormal': 'TruncatedNormal',
    'varianceScaling': 'VarianceScaling',
    'zeros': 'Zeros'
};
function deserializeInitializer(config, customObjects = {}) {
    return deserializeKerasObject(config, serialization.SerializationMap.getMap().classNameMap, customObjects, 'initializer');
}
export function serializeInitializer(initializer) {
    return serializeKerasObject(initializer);
}
export function getInitializer(identifier) {
    if (typeof identifier === 'string') {
        const className = identifier in INITIALIZER_IDENTIFIER_REGISTRY_SYMBOL_MAP ?
            INITIALIZER_IDENTIFIER_REGISTRY_SYMBOL_MAP[identifier] :
            identifier;
        /* We have four 'helper' classes for common initializers that
        all get serialized as 'VarianceScaling' and shouldn't go through
        the deserializeInitializer pathway. */
        if (className === 'GlorotNormal') {
            return new GlorotNormal();
        }
        else if (className === 'GlorotUniform') {
            return new GlorotUniform();
        }
        else if (className === 'HeNormal') {
            return new HeNormal();
        }
        else if (className === 'HeUniform') {
            return new HeUniform();
        }
        else if (className === 'LeCunNormal') {
            return new LeCunNormal();
        }
        else if (className === 'LeCunUniform') {
            return new LeCunUniform();
        }
        else {
            const config = {};
            config['className'] = className;
            config['config'] = {};
            return deserializeInitializer(config);
        }
    }
    else if (identifier instanceof Initializer) {
        return identifier;
    }
    else {
        return deserializeInitializer(identifier);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdGlhbGl6ZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1sYXllcnMvc3JjL2luaXRpYWxpemVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7R0FRRztBQUVILE9BQU8sRUFBVyxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQW9CLElBQUksRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLEtBQUssRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRXhLLE9BQU8sS0FBSyxDQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDNUMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsbUJBQW1CLEVBQUUsVUFBVSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBRXpELE9BQU8sRUFBd0IseUJBQXlCLEVBQUUscUJBQXFCLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUMxSCxPQUFPLEVBQUMseUJBQXlCLEVBQUUsc0JBQXNCLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM5RyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFN0MsTUFBTSxVQUFVLFlBQVksQ0FBQyxLQUFjO0lBQ3pDLHlCQUF5QixDQUFDLHFCQUFxQixFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNyRSxDQUFDO0FBRUQsTUFBTSxVQUFVLGlCQUFpQixDQUFDLEtBQWM7SUFDOUMseUJBQXlCLENBQUMseUJBQXlCLEVBQUUsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzlFLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sT0FBZ0IsV0FBWSxTQUFRLGFBQWEsQ0FBQyxZQUFZO0lBQzNELDJCQUEyQjtRQUNoQyxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFTRCxT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Q3hELFVBQVUsQ0FBQztRQUNmOzs4Q0FFc0M7UUFDdEMsSUFBSSxTQUFTLEtBQUssY0FBYyxFQUFFO1lBQ2hDLE9BQU8sSUFBSSxZQUFZLEVBQUUsQ0FBQztTQUMzQjthQUFNLElBQUksU0FBUyxLQUFLLGVBQWUsRUFBRTtZQUN4QyxPQUFPLElBQUksYUFBYSxFQUFFLENBQUM7U0FDNUI7YUFBTSxJQUFJLFNBQVMsS0FBSyxVQUFVLEVBQUU7WUFDbkMsT0FBTyxJQUFJLFFBQVEsRUFBRSxDQUFDO1NBQ3ZCO2FBQU0sSUFBSSxTQUFTLEtBQUssV0FBVyxFQUFFO1lBQ3BDLE9BQU8sSUFBSSxTQUFTLEVBQUUsQ0FBQztTQUN4QjthQUFNLElBQUksU0FBUyxLQUFLLGFBQWEsRUFBRTtZQUN0QyxPQUFPLElBQUksV0FBVyxFQUFFLENBQUM7U0FDMUI7YUFBTSxJQUFJLFNBQVMsS0FBSyxjQUFjLEVBQUU7WUFDdkMsT0FBTyxJQUFJLFlBQVksRUFBRSxDQUFDO1NBQzNCO2FBQU07WUFDTCxNQUFNLE1BQU0sR0FBNkIsRUFBRSxDQUFDO1lBQzVDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxTQUFTLENBQUM7WUFDaEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN0QixPQUFPLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3ZDO0tBQ0Y7U0FBTSxJQUFJLFVBQVUsWUFBWSxXQUFXLEVBQUU7UUFDNUMsT0FBTyxVQUFVLENBQUM7S0FDbkI7U0FBTTtRQUNMLE9BQU8sc0JBQXNCLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDM0M7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICogbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gKiBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtEYXRhVHlwZSwgZXllLCBsaW5hbGcsIG11bCwgb25lcywgcmFuZG9tVW5pZm9ybSwgc2NhbGFyLCBzZXJpYWxpemF0aW9uLCBUZW5zb3IsIFRlbnNvcjJELCB0aWR5LCB0cmFuc3Bvc2UsIHRydW5jYXRlZE5vcm1hbCwgemVyb3N9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCAqIGFzIEsgZnJvbSAnLi9iYWNrZW5kL3RmanNfYmFja2VuZCc7XG5pbXBvcnQge2NoZWNrRGF0YUZvcm1hdH0gZnJvbSAnLi9jb21tb24nO1xuaW1wb3J0IHtOb3RJbXBsZW1lbnRlZEVycm9yLCBWYWx1ZUVycm9yfSBmcm9tICcuL2Vycm9ycyc7XG5pbXBvcnQge0RhdGFGb3JtYXQsIFNoYXBlfSBmcm9tICcuL2tlcmFzX2Zvcm1hdC9jb21tb24nO1xuaW1wb3J0IHtEaXN0cmlidXRpb24sIEZhbk1vZGUsIFZBTElEX0RJU1RSSUJVVElPTl9WQUxVRVMsIFZBTElEX0ZBTl9NT0RFX1ZBTFVFU30gZnJvbSAnLi9rZXJhc19mb3JtYXQvaW5pdGlhbGl6ZXJfY29uZmlnJztcbmltcG9ydCB7Y2hlY2tTdHJpbmdUeXBlVW5pb25WYWx1ZSwgZGVzZXJpYWxpemVLZXJhc09iamVjdCwgc2VyaWFsaXplS2VyYXNPYmplY3R9IGZyb20gJy4vdXRpbHMvZ2VuZXJpY191dGlscyc7XG5pbXBvcnQge2FycmF5UHJvZH0gZnJvbSAnLi91dGlscy9tYXRoX3V0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrRmFuTW9kZSh2YWx1ZT86IHN0cmluZyk6IHZvaWQge1xuICBjaGVja1N0cmluZ1R5cGVVbmlvblZhbHVlKFZBTElEX0ZBTl9NT0RFX1ZBTFVFUywgJ0Zhbk1vZGUnLCB2YWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0Rpc3RyaWJ1dGlvbih2YWx1ZT86IHN0cmluZyk6IHZvaWQge1xuICBjaGVja1N0cmluZ1R5cGVVbmlvblZhbHVlKFZBTElEX0RJU1RSSUJVVElPTl9WQUxVRVMsICdEaXN0cmlidXRpb24nLCB2YWx1ZSk7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZXIgYmFzZSBjbGFzcy5cbiAqXG4gKiBAZG9jIHtcbiAqICAgaGVhZGluZzogJ0luaXRpYWxpemVycycsIHN1YmhlYWRpbmc6ICdDbGFzc2VzJywgbmFtZXNwYWNlOiAnaW5pdGlhbGl6ZXJzJ31cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEluaXRpYWxpemVyIGV4dGVuZHMgc2VyaWFsaXphdGlvbi5TZXJpYWxpemFibGUge1xuICBwdWJsaWMgZnJvbUNvbmZpZ1VzZXNDdXN0b21PYmplY3RzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvKipcbiAgICogR2VuZXJhdGUgYW4gaW5pdGlhbCB2YWx1ZS5cbiAgICogQHBhcmFtIHNoYXBlXG4gICAqIEBwYXJhbSBkdHlwZVxuICAgKiBAcmV0dXJuIFRoZSBpbml0IHZhbHVlLlxuICAgKi9cbiAgYWJzdHJhY3QgYXBwbHkoc2hhcGU6IFNoYXBlLCBkdHlwZT86IERhdGFUeXBlKTogVGVuc29yO1xuXG4gIGdldENvbmZpZygpOiBzZXJpYWxpemF0aW9uLkNvbmZpZ0RpY3Qge1xuICAgIHJldHVybiB7fTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgWmVyb3MgZXh0ZW5kcyBJbml0aWFsaXplciB7XG4gIC8qKiBAbm9jb2xsYXBzZSAqL1xuICBzdGF0aWMgY2xhc3NOYW1lID0gJ1plcm9zJztcblxuICBhcHBseShzaGFwZTogU2hhcGUsIGR0eXBlPzogRGF0YVR5cGUpOiBUZW5zb3Ige1xuICAgIHJldHVybiB6ZXJvcyhzaGFwZSwgZHR5cGUpO1xuICB9XG59XG5zZXJpYWxpemF0aW9uLnJlZ2lzdGVyQ2xhc3MoWmVyb3MpO1xuXG5leHBvcnQgY2xhc3MgT25lcyBleHRlbmRzIEluaXRpYWxpemVyIHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBjbGFzc05hbWUgPSAnT25lcyc7XG5cbiAgYXBwbHkoc2hhcGU6IFNoYXBlLCBkdHlwZT86IERhdGFUeXBlKTogVGVuc29yIHtcbiAgICByZXR1cm4gb25lcyhzaGFwZSwgZHR5cGUpO1xuICB9XG59XG5zZXJpYWxpemF0aW9uLnJlZ2lzdGVyQ2xhc3MoT25lcyk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29uc3RhbnRBcmdzIHtcbiAgLyoqIFRoZSB2YWx1ZSBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSB2YXJpYWJsZS4gKi9cbiAgdmFsdWU6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIENvbnN0YW50IGV4dGVuZHMgSW5pdGlhbGl6ZXIge1xuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIGNsYXNzTmFtZSA9ICdDb25zdGFudCc7XG4gIHByaXZhdGUgdmFsdWU6IG51bWJlcjtcbiAgY29uc3RydWN0b3IoYXJnczogQ29uc3RhbnRBcmdzKSB7XG4gICAgc3VwZXIoKTtcbiAgICBpZiAodHlwZW9mIGFyZ3MgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgVmFsdWVFcnJvcihcbiAgICAgICAgICBgRXhwZWN0ZWQgYXJndW1lbnQgb2YgdHlwZSBDb25zdGFudENvbmZpZyBidXQgZ290ICR7YXJnc31gKTtcbiAgICB9XG4gICAgaWYgKGFyZ3MudmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IFZhbHVlRXJyb3IoYGNvbmZpZyBtdXN0IGhhdmUgdmFsdWUgc2V0IGJ1dCBnb3QgJHthcmdzfWApO1xuICAgIH1cbiAgICB0aGlzLnZhbHVlID0gYXJncy52YWx1ZTtcbiAgfVxuXG4gIGFwcGx5KHNoYXBlOiBTaGFwZSwgZHR5cGU/OiBEYXRhVHlwZSk6IFRlbnNvciB7XG4gICAgcmV0dXJuIHRpZHkoKCkgPT4gbXVsKHNjYWxhcih0aGlzLnZhbHVlKSwgb25lcyhzaGFwZSwgZHR5cGUpKSk7XG4gIH1cblxuICBnZXRDb25maWcoKTogc2VyaWFsaXphdGlvbi5Db25maWdEaWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXG4gICAgfTtcbiAgfVxufVxuc2VyaWFsaXphdGlvbi5yZWdpc3RlckNsYXNzKENvbnN0YW50KTtcblxuZXhwb3J0IGludGVyZmFjZSBSYW5kb21Vbmlmb3JtQXJncyB7XG4gIC8qKiBMb3dlciBib3VuZCBvZiB0aGUgcmFuZ2Ugb2YgcmFuZG9tIHZhbHVlcyB0byBnZW5lcmF0ZS4gKi9cbiAgbWludmFsPzogbnVtYmVyO1xuICAvKiogVXBwZXIgYm91bmQgb2YgdGhlIHJhbmdlIG9mIHJhbmRvbSB2YWx1ZXMgdG8gZ2VuZXJhdGUuICovXG4gIG1heHZhbD86IG51bWJlcjtcbiAgLyoqIFVzZWQgdG8gc2VlZCB0aGUgcmFuZG9tIGdlbmVyYXRvci4gKi9cbiAgc2VlZD86IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFJhbmRvbVVuaWZvcm0gZXh0ZW5kcyBJbml0aWFsaXplciB7XG4gIC8qKiBAbm9jb2xsYXBzZSAqL1xuICBzdGF0aWMgY2xhc3NOYW1lID0gJ1JhbmRvbVVuaWZvcm0nO1xuICByZWFkb25seSBERUZBVUxUX01JTlZBTCA9IC0wLjA1O1xuICByZWFkb25seSBERUZBVUxUX01BWFZBTCA9IDAuMDU7XG4gIHByaXZhdGUgbWludmFsOiBudW1iZXI7XG4gIHByaXZhdGUgbWF4dmFsOiBudW1iZXI7XG4gIHByaXZhdGUgc2VlZDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGFyZ3M6IFJhbmRvbVVuaWZvcm1BcmdzKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLm1pbnZhbCA9IGFyZ3MubWludmFsIHx8IHRoaXMuREVGQVVMVF9NSU5WQUw7XG4gICAgdGhpcy5tYXh2YWwgPSBhcmdzLm1heHZhbCB8fCB0aGlzLkRFRkFVTFRfTUFYVkFMO1xuICAgIHRoaXMuc2VlZCA9IGFyZ3Muc2VlZDtcbiAgfVxuXG4gIGFwcGx5KHNoYXBlOiBTaGFwZSwgZHR5cGU/OiBEYXRhVHlwZSk6IFRlbnNvciB7XG4gICAgcmV0dXJuIHJhbmRvbVVuaWZvcm0oc2hhcGUsIHRoaXMubWludmFsLCB0aGlzLm1heHZhbCwgZHR5cGUpO1xuICB9XG5cbiAgZ2V0Q29uZmlnKCk6IHNlcmlhbGl6YXRpb24uQ29uZmlnRGljdCB7XG4gICAgcmV0dXJuIHttaW52YWw6IHRoaXMubWludmFsLCBtYXh2YWw6IHRoaXMubWF4dmFsLCBzZWVkOiB0aGlzLnNlZWR9O1xuICB9XG59XG5zZXJpYWxpemF0aW9uLnJlZ2lzdGVyQ2xhc3MoUmFuZG9tVW5pZm9ybSk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmFuZG9tTm9ybWFsQXJncyB7XG4gIC8qKiBNZWFuIG9mIHRoZSByYW5kb20gdmFsdWVzIHRvIGdlbmVyYXRlLiAqL1xuICBtZWFuPzogbnVtYmVyO1xuICAvKiogU3RhbmRhcmQgZGV2aWF0aW9uIG9mIHRoZSByYW5kb20gdmFsdWVzIHRvIGdlbmVyYXRlLiAqL1xuICBzdGRkZXY/OiBudW1iZXI7XG4gIC8qKiBVc2VkIHRvIHNlZWQgdGhlIHJhbmRvbSBnZW5lcmF0b3IuICovXG4gIHNlZWQ/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBSYW5kb21Ob3JtYWwgZXh0ZW5kcyBJbml0aWFsaXplciB7XG4gIC8qKiBAbm9jb2xsYXBzZSAqL1xuICBzdGF0aWMgY2xhc3NOYW1lID0gJ1JhbmRvbU5vcm1hbCc7XG4gIHJlYWRvbmx5IERFRkFVTFRfTUVBTiA9IDAuO1xuICByZWFkb25seSBERUZBVUxUX1NURERFViA9IDAuMDU7XG4gIHByaXZhdGUgbWVhbjogbnVtYmVyO1xuICBwcml2YXRlIHN0ZGRldjogbnVtYmVyO1xuICBwcml2YXRlIHNlZWQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihhcmdzOiBSYW5kb21Ob3JtYWxBcmdzKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLm1lYW4gPSBhcmdzLm1lYW4gfHwgdGhpcy5ERUZBVUxUX01FQU47XG4gICAgdGhpcy5zdGRkZXYgPSBhcmdzLnN0ZGRldiB8fCB0aGlzLkRFRkFVTFRfU1REREVWO1xuICAgIHRoaXMuc2VlZCA9IGFyZ3Muc2VlZDtcbiAgfVxuXG4gIGFwcGx5KHNoYXBlOiBTaGFwZSwgZHR5cGU/OiBEYXRhVHlwZSk6IFRlbnNvciB7XG4gICAgZHR5cGUgPSBkdHlwZSB8fCAnZmxvYXQzMic7XG4gICAgaWYgKGR0eXBlICE9PSAnZmxvYXQzMicgJiYgZHR5cGUgIT09ICdpbnQzMicpIHtcbiAgICAgIHRocm93IG5ldyBOb3RJbXBsZW1lbnRlZEVycm9yKFxuICAgICAgICAgIGByYW5kb21Ob3JtYWwgZG9lcyBub3Qgc3VwcG9ydCBkVHlwZSAke2R0eXBlfS5gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gSy5yYW5kb21Ob3JtYWwoc2hhcGUsIHRoaXMubWVhbiwgdGhpcy5zdGRkZXYsIGR0eXBlLCB0aGlzLnNlZWQpO1xuICB9XG5cbiAgZ2V0Q29uZmlnKCk6IHNlcmlhbGl6YXRpb24uQ29uZmlnRGljdCB7XG4gICAgcmV0dXJuIHttZWFuOiB0aGlzLm1lYW4sIHN0ZGRldjogdGhpcy5zdGRkZXYsIHNlZWQ6IHRoaXMuc2VlZH07XG4gIH1cbn1cbnNlcmlhbGl6YXRpb24ucmVnaXN0ZXJDbGFzcyhSYW5kb21Ob3JtYWwpO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRydW5jYXRlZE5vcm1hbEFyZ3Mge1xuICAvKiogTWVhbiBvZiB0aGUgcmFuZG9tIHZhbHVlcyB0byBnZW5lcmF0ZS4gKi9cbiAgbWVhbj86IG51bWJlcjtcbiAgLyoqIFN0YW5kYXJkIGRldmlhdGlvbiBvZiB0aGUgcmFuZG9tIHZhbHVlcyB0byBnZW5lcmF0ZS4gKi9cbiAgc3RkZGV2PzogbnVtYmVyO1xuICAvKiogVXNlZCB0byBzZWVkIHRoZSByYW5kb20gZ2VuZXJhdG9yLiAqL1xuICBzZWVkPzogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgVHJ1bmNhdGVkTm9ybWFsIGV4dGVuZHMgSW5pdGlhbGl6ZXIge1xuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIGNsYXNzTmFtZSA9ICdUcnVuY2F0ZWROb3JtYWwnO1xuXG4gIHJlYWRvbmx5IERFRkFVTFRfTUVBTiA9IDAuO1xuICByZWFkb25seSBERUZBVUxUX1NURERFViA9IDAuMDU7XG4gIHByaXZhdGUgbWVhbjogbnVtYmVyO1xuICBwcml2YXRlIHN0ZGRldjogbnVtYmVyO1xuICBwcml2YXRlIHNlZWQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihhcmdzOiBUcnVuY2F0ZWROb3JtYWxBcmdzKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLm1lYW4gPSBhcmdzLm1lYW4gfHwgdGhpcy5ERUZBVUxUX01FQU47XG4gICAgdGhpcy5zdGRkZXYgPSBhcmdzLnN0ZGRldiB8fCB0aGlzLkRFRkFVTFRfU1REREVWO1xuICAgIHRoaXMuc2VlZCA9IGFyZ3Muc2VlZDtcbiAgfVxuXG4gIGFwcGx5KHNoYXBlOiBTaGFwZSwgZHR5cGU/OiBEYXRhVHlwZSk6IFRlbnNvciB7XG4gICAgZHR5cGUgPSBkdHlwZSB8fCAnZmxvYXQzMic7XG4gICAgaWYgKGR0eXBlICE9PSAnZmxvYXQzMicgJiYgZHR5cGUgIT09ICdpbnQzMicpIHtcbiAgICAgIHRocm93IG5ldyBOb3RJbXBsZW1lbnRlZEVycm9yKFxuICAgICAgICAgIGB0cnVuY2F0ZWROb3JtYWwgZG9lcyBub3Qgc3VwcG9ydCBkVHlwZSAke2R0eXBlfS5gKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydW5jYXRlZE5vcm1hbChzaGFwZSwgdGhpcy5tZWFuLCB0aGlzLnN0ZGRldiwgZHR5cGUsIHRoaXMuc2VlZCk7XG4gIH1cblxuICBnZXRDb25maWcoKTogc2VyaWFsaXphdGlvbi5Db25maWdEaWN0IHtcbiAgICByZXR1cm4ge21lYW46IHRoaXMubWVhbiwgc3RkZGV2OiB0aGlzLnN0ZGRldiwgc2VlZDogdGhpcy5zZWVkfTtcbiAgfVxufVxuc2VyaWFsaXphdGlvbi5yZWdpc3RlckNsYXNzKFRydW5jYXRlZE5vcm1hbCk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSWRlbnRpdHlBcmdzIHtcbiAgLyoqXG4gICAqIE11bHRpcGxpY2F0aXZlIGZhY3RvciB0byBhcHBseSB0byB0aGUgaWRlbnRpdHkgbWF0cml4LlxuICAgKi9cbiAgZ2Fpbj86IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIElkZW50aXR5IGV4dGVuZHMgSW5pdGlhbGl6ZXIge1xuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIGNsYXNzTmFtZSA9ICdJZGVudGl0eSc7XG4gIHByaXZhdGUgZ2FpbjogbnVtYmVyO1xuICBjb25zdHJ1Y3RvcihhcmdzOiBJZGVudGl0eUFyZ3MpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZ2FpbiA9IGFyZ3MuZ2FpbiAhPSBudWxsID8gYXJncy5nYWluIDogMS4wO1xuICB9XG5cbiAgYXBwbHkoc2hhcGU6IFNoYXBlLCBkdHlwZT86IERhdGFUeXBlKTogVGVuc29yIHtcbiAgICByZXR1cm4gdGlkeSgoKSA9PiB7XG4gICAgICBpZiAoc2hhcGUubGVuZ3RoICE9PSAyIHx8IHNoYXBlWzBdICE9PSBzaGFwZVsxXSkge1xuICAgICAgICB0aHJvdyBuZXcgVmFsdWVFcnJvcihcbiAgICAgICAgICAgICdJZGVudGl0eSBtYXRyaXggaW5pdGlhbGl6ZXIgY2FuIG9ubHkgYmUgdXNlZCBmb3InICtcbiAgICAgICAgICAgICcgMkQgc3F1YXJlIG1hdHJpY2VzLicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG11bCh0aGlzLmdhaW4sIGV5ZShzaGFwZVswXSkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0Q29uZmlnKCk6IHNlcmlhbGl6YXRpb24uQ29uZmlnRGljdCB7XG4gICAgcmV0dXJuIHtnYWluOiB0aGlzLmdhaW59O1xuICB9XG59XG5zZXJpYWxpemF0aW9uLnJlZ2lzdGVyQ2xhc3MoSWRlbnRpdHkpO1xuXG4vKipcbiAqIENvbXB1dGVzIHRoZSBudW1iZXIgb2YgaW5wdXQgYW5kIG91dHB1dCB1bml0cyBmb3IgYSB3ZWlnaHQgc2hhcGUuXG4gKiBAcGFyYW0gc2hhcGUgU2hhcGUgb2Ygd2VpZ2h0LlxuICogQHBhcmFtIGRhdGFGb3JtYXQgZGF0YSBmb3JtYXQgdG8gdXNlIGZvciBjb252b2x1dGlvbiBrZXJuZWxzLlxuICogICBOb3RlIHRoYXQgYWxsIGtlcm5lbHMgaW4gS2VyYXMgYXJlIHN0YW5kYXJkaXplZCBvbiB0aGVcbiAqICAgQ0hBTk5FTF9MQVNUIG9yZGVyaW5nIChldmVuIHdoZW4gaW5wdXRzIGFyZSBzZXQgdG8gQ0hBTk5FTF9GSVJTVCkuXG4gKiBAcmV0dXJuIEFuIGxlbmd0aC0yIGFycmF5OiBmYW5JbiwgZmFuT3V0LlxuICovXG5mdW5jdGlvbiBjb21wdXRlRmFucyhcbiAgICBzaGFwZTogU2hhcGUsIGRhdGFGb3JtYXQ6IERhdGFGb3JtYXQgPSAnY2hhbm5lbHNMYXN0Jyk6IG51bWJlcltdIHtcbiAgbGV0IGZhbkluOiBudW1iZXI7XG4gIGxldCBmYW5PdXQ6IG51bWJlcjtcbiAgY2hlY2tEYXRhRm9ybWF0KGRhdGFGb3JtYXQpO1xuICBpZiAoc2hhcGUubGVuZ3RoID09PSAyKSB7XG4gICAgZmFuSW4gPSBzaGFwZVswXTtcbiAgICBmYW5PdXQgPSBzaGFwZVsxXTtcbiAgfSBlbHNlIGlmIChbMywgNCwgNV0uaW5kZXhPZihzaGFwZS5sZW5ndGgpICE9PSAtMSkge1xuICAgIGlmIChkYXRhRm9ybWF0ID09PSAnY2hhbm5lbHNGaXJzdCcpIHtcbiAgICAgIGNvbnN0IHJlY2VwdGl2ZUZpZWxkU2l6ZSA9IGFycmF5UHJvZChzaGFwZSwgMik7XG4gICAgICBmYW5JbiA9IHNoYXBlWzFdICogcmVjZXB0aXZlRmllbGRTaXplO1xuICAgICAgZmFuT3V0ID0gc2hhcGVbMF0gKiByZWNlcHRpdmVGaWVsZFNpemU7XG4gICAgfSBlbHNlIGlmIChkYXRhRm9ybWF0ID09PSAnY2hhbm5lbHNMYXN0Jykge1xuICAgICAgY29uc3QgcmVjZXB0aXZlRmllbGRTaXplID0gYXJyYXlQcm9kKHNoYXBlLCAwLCBzaGFwZS5sZW5ndGggLSAyKTtcbiAgICAgIGZhbkluID0gc2hhcGVbc2hhcGUubGVuZ3RoIC0gMl0gKiByZWNlcHRpdmVGaWVsZFNpemU7XG4gICAgICBmYW5PdXQgPSBzaGFwZVtzaGFwZS5sZW5ndGggLSAxXSAqIHJlY2VwdGl2ZUZpZWxkU2l6ZTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgc2hhcGVQcm9kID0gYXJyYXlQcm9kKHNoYXBlKTtcbiAgICBmYW5JbiA9IE1hdGguc3FydChzaGFwZVByb2QpO1xuICAgIGZhbk91dCA9IE1hdGguc3FydChzaGFwZVByb2QpO1xuICB9XG5cbiAgcmV0dXJuIFtmYW5JbiwgZmFuT3V0XTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBWYXJpYW5jZVNjYWxpbmdBcmdzIHtcbiAgLyoqIFNjYWxpbmcgZmFjdG9yIChwb3NpdGl2ZSBmbG9hdCkuICovXG4gIHNjYWxlPzogbnVtYmVyO1xuXG4gIC8qKiBGYW5uaW5nIG1vZGUgZm9yIGlucHV0cyBhbmQgb3V0cHV0cy4gKi9cbiAgbW9kZT86IEZhbk1vZGU7XG5cbiAgLyoqIFByb2JhYmlsaXN0aWMgZGlzdHJpYnV0aW9uIG9mIHRoZSB2YWx1ZXMuICovXG4gIGRpc3RyaWJ1dGlvbj86IERpc3RyaWJ1dGlvbjtcblxuICAvKiogUmFuZG9tIG51bWJlciBnZW5lcmF0b3Igc2VlZC4gKi9cbiAgc2VlZD86IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFZhcmlhbmNlU2NhbGluZyBleHRlbmRzIEluaXRpYWxpemVyIHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBjbGFzc05hbWUgPSAnVmFyaWFuY2VTY2FsaW5nJztcbiAgcHJpdmF0ZSBzY2FsZTogbnVtYmVyO1xuICBwcml2YXRlIG1vZGU6IEZhbk1vZGU7XG4gIHByaXZhdGUgZGlzdHJpYnV0aW9uOiBEaXN0cmlidXRpb247XG4gIHByaXZhdGUgc2VlZDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBvZiBWYXJpYW5jZVNjYWxpbmcuXG4gICAqIEB0aHJvd3MgVmFsdWVFcnJvciBmb3IgaW52YWxpZCB2YWx1ZSBpbiBzY2FsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGFyZ3M6IFZhcmlhbmNlU2NhbGluZ0FyZ3MpIHtcbiAgICBzdXBlcigpO1xuICAgIGlmIChhcmdzLnNjYWxlIDwgMC4wKSB7XG4gICAgICB0aHJvdyBuZXcgVmFsdWVFcnJvcihcbiAgICAgICAgICBgc2NhbGUgbXVzdCBiZSBhIHBvc2l0aXZlIGZsb2F0LiBHb3Q6ICR7YXJncy5zY2FsZX1gKTtcbiAgICB9XG4gICAgdGhpcy5zY2FsZSA9IGFyZ3Muc2NhbGUgPT0gbnVsbCA/IDEuMCA6IGFyZ3Muc2NhbGU7XG4gICAgdGhpcy5tb2RlID0gYXJncy5tb2RlID09IG51bGwgPyAnZmFuSW4nIDogYXJncy5tb2RlO1xuICAgIGNoZWNrRmFuTW9kZSh0aGlzLm1vZGUpO1xuICAgIHRoaXMuZGlzdHJpYnV0aW9uID1cbiAgICAgICAgYXJncy5kaXN0cmlidXRpb24gPT0gbnVsbCA/ICdub3JtYWwnIDogYXJncy5kaXN0cmlidXRpb247XG4gICAgY2hlY2tEaXN0cmlidXRpb24odGhpcy5kaXN0cmlidXRpb24pO1xuICAgIHRoaXMuc2VlZCA9IGFyZ3Muc2VlZDtcbiAgfVxuXG4gIGFwcGx5KHNoYXBlOiBTaGFwZSwgZHR5cGU/OiBEYXRhVHlwZSk6IFRlbnNvciB7XG4gICAgY29uc3QgZmFucyA9IGNvbXB1dGVGYW5zKHNoYXBlKTtcbiAgICBjb25zdCBmYW5JbiA9IGZhbnNbMF07XG4gICAgY29uc3QgZmFuT3V0ID0gZmFuc1sxXTtcbiAgICBsZXQgc2NhbGUgPSB0aGlzLnNjYWxlO1xuICAgIGlmICh0aGlzLm1vZGUgPT09ICdmYW5JbicpIHtcbiAgICAgIHNjYWxlIC89IE1hdGgubWF4KDEsIGZhbkluKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubW9kZSA9PT0gJ2Zhbk91dCcpIHtcbiAgICAgIHNjYWxlIC89IE1hdGgubWF4KDEsIGZhbk91dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNjYWxlIC89IE1hdGgubWF4KDEsIChmYW5JbiArIGZhbk91dCkgLyAyKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kaXN0cmlidXRpb24gPT09ICdub3JtYWwnKSB7XG4gICAgICBjb25zdCBzdGRkZXYgPSBNYXRoLnNxcnQoc2NhbGUpO1xuICAgICAgZHR5cGUgPSBkdHlwZSB8fCAnZmxvYXQzMic7XG4gICAgICBpZiAoZHR5cGUgIT09ICdmbG9hdDMyJyAmJiBkdHlwZSAhPT0gJ2ludDMyJykge1xuICAgICAgICB0aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFcnJvcihcbiAgICAgICAgICAgIGAke3RoaXMuZ2V0Q2xhc3NOYW1lKCl9IGRvZXMgbm90IHN1cHBvcnQgZFR5cGUgJHtkdHlwZX0uYCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1bmNhdGVkTm9ybWFsKHNoYXBlLCAwLCBzdGRkZXYsIGR0eXBlLCB0aGlzLnNlZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBsaW1pdCA9IE1hdGguc3FydCgzICogc2NhbGUpO1xuICAgICAgcmV0dXJuIHJhbmRvbVVuaWZvcm0oc2hhcGUsIC1saW1pdCwgbGltaXQsIGR0eXBlKTtcbiAgICB9XG4gIH1cblxuICBnZXRDb25maWcoKTogc2VyaWFsaXphdGlvbi5Db25maWdEaWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgc2NhbGU6IHRoaXMuc2NhbGUsXG4gICAgICBtb2RlOiB0aGlzLm1vZGUsXG4gICAgICBkaXN0cmlidXRpb246IHRoaXMuZGlzdHJpYnV0aW9uLFxuICAgICAgc2VlZDogdGhpcy5zZWVkXG4gICAgfTtcbiAgfVxufVxuc2VyaWFsaXphdGlvbi5yZWdpc3RlckNsYXNzKFZhcmlhbmNlU2NhbGluZyk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VlZE9ubHlJbml0aWFsaXplckFyZ3Mge1xuICAvKiogUmFuZG9tIG51bWJlciBnZW5lcmF0b3Igc2VlZC4gKi9cbiAgc2VlZD86IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIEdsb3JvdFVuaWZvcm0gZXh0ZW5kcyBWYXJpYW5jZVNjYWxpbmcge1xuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIGNsYXNzTmFtZSA9ICdHbG9yb3RVbmlmb3JtJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3Igb2YgR2xvcm90VW5pZm9ybVxuICAgKiBAcGFyYW0gc2NhbGVcbiAgICogQHBhcmFtIG1vZGVcbiAgICogQHBhcmFtIGRpc3RyaWJ1dGlvblxuICAgKiBAcGFyYW0gc2VlZFxuICAgKi9cbiAgY29uc3RydWN0b3IoYXJncz86IFNlZWRPbmx5SW5pdGlhbGl6ZXJBcmdzKSB7XG4gICAgc3VwZXIoe1xuICAgICAgc2NhbGU6IDEuMCxcbiAgICAgIG1vZGU6ICdmYW5BdmcnLFxuICAgICAgZGlzdHJpYnV0aW9uOiAndW5pZm9ybScsXG4gICAgICBzZWVkOiBhcmdzID09IG51bGwgPyBudWxsIDogYXJncy5zZWVkXG4gICAgfSk7XG4gIH1cblxuICBnZXRDbGFzc05hbWUoKTogc3RyaW5nIHtcbiAgICAvLyBJbiBQeXRob24gS2VyYXMsIEdsb3JvdFVuaWZvcm0gaXMgbm90IGEgY2xhc3MsIGJ1dCBhIGhlbHBlciBtZXRob2RcbiAgICAvLyB0aGF0IGNyZWF0ZXMgYSBWYXJpYW5jZVNjYWxpbmcgb2JqZWN0LiBVc2UgJ1ZhcmlhbmNlU2NhbGluZycgYXNcbiAgICAvLyBjbGFzcyBuYW1lIHRvIGJlIGNvbXBhdGlibGUgd2l0aCB0aGF0LlxuICAgIHJldHVybiBWYXJpYW5jZVNjYWxpbmcuY2xhc3NOYW1lO1xuICB9XG59XG5zZXJpYWxpemF0aW9uLnJlZ2lzdGVyQ2xhc3MoR2xvcm90VW5pZm9ybSk7XG5cbmV4cG9ydCBjbGFzcyBHbG9yb3ROb3JtYWwgZXh0ZW5kcyBWYXJpYW5jZVNjYWxpbmcge1xuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIGNsYXNzTmFtZSA9ICdHbG9yb3ROb3JtYWwnO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBvZiBHbG9yb3ROb3JtYWwuXG4gICAqIEBwYXJhbSBzY2FsZVxuICAgKiBAcGFyYW0gbW9kZVxuICAgKiBAcGFyYW0gZGlzdHJpYnV0aW9uXG4gICAqIEBwYXJhbSBzZWVkXG4gICAqL1xuICBjb25zdHJ1Y3RvcihhcmdzPzogU2VlZE9ubHlJbml0aWFsaXplckFyZ3MpIHtcbiAgICBzdXBlcih7XG4gICAgICBzY2FsZTogMS4wLFxuICAgICAgbW9kZTogJ2ZhbkF2ZycsXG4gICAgICBkaXN0cmlidXRpb246ICdub3JtYWwnLFxuICAgICAgc2VlZDogYXJncyA9PSBudWxsID8gbnVsbCA6IGFyZ3Muc2VlZFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0Q2xhc3NOYW1lKCk6IHN0cmluZyB7XG4gICAgLy8gSW4gUHl0aG9uIEtlcmFzLCBHbG9yb3ROb3JtYWwgaXMgbm90IGEgY2xhc3MsIGJ1dCBhIGhlbHBlciBtZXRob2RcbiAgICAvLyB0aGF0IGNyZWF0ZXMgYSBWYXJpYW5jZVNjYWxpbmcgb2JqZWN0LiBVc2UgJ1ZhcmlhbmNlU2NhbGluZycgYXNcbiAgICAvLyBjbGFzcyBuYW1lIHRvIGJlIGNvbXBhdGlibGUgd2l0aCB0aGF0LlxuICAgIHJldHVybiBWYXJpYW5jZVNjYWxpbmcuY2xhc3NOYW1lO1xuICB9XG59XG5zZXJpYWxpemF0aW9uLnJlZ2lzdGVyQ2xhc3MoR2xvcm90Tm9ybWFsKTtcblxuZXhwb3J0IGNsYXNzIEhlTm9ybWFsIGV4dGVuZHMgVmFyaWFuY2VTY2FsaW5nIHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBjbGFzc05hbWUgPSAnSGVOb3JtYWwnO1xuXG4gIGNvbnN0cnVjdG9yKGFyZ3M/OiBTZWVkT25seUluaXRpYWxpemVyQXJncykge1xuICAgIHN1cGVyKHtcbiAgICAgIHNjYWxlOiAyLjAsXG4gICAgICBtb2RlOiAnZmFuSW4nLFxuICAgICAgZGlzdHJpYnV0aW9uOiAnbm9ybWFsJyxcbiAgICAgIHNlZWQ6IGFyZ3MgPT0gbnVsbCA/IG51bGwgOiBhcmdzLnNlZWRcbiAgICB9KTtcbiAgfVxuXG4gIGdldENsYXNzTmFtZSgpOiBzdHJpbmcge1xuICAgIC8vIEluIFB5dGhvbiBLZXJhcywgSGVOb3JtYWwgaXMgbm90IGEgY2xhc3MsIGJ1dCBhIGhlbHBlciBtZXRob2RcbiAgICAvLyB0aGF0IGNyZWF0ZXMgYSBWYXJpYW5jZVNjYWxpbmcgb2JqZWN0LiBVc2UgJ1ZhcmlhbmNlU2NhbGluZycgYXNcbiAgICAvLyBjbGFzcyBuYW1lIHRvIGJlIGNvbXBhdGlibGUgd2l0aCB0aGF0LlxuICAgIHJldHVybiBWYXJpYW5jZVNjYWxpbmcuY2xhc3NOYW1lO1xuICB9XG59XG5zZXJpYWxpemF0aW9uLnJlZ2lzdGVyQ2xhc3MoSGVOb3JtYWwpO1xuXG5leHBvcnQgY2xhc3MgSGVVbmlmb3JtIGV4dGVuZHMgVmFyaWFuY2VTY2FsaW5nIHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBjbGFzc05hbWUgPSAnSGVVbmlmb3JtJztcblxuICBjb25zdHJ1Y3RvcihhcmdzPzogU2VlZE9ubHlJbml0aWFsaXplckFyZ3MpIHtcbiAgICBzdXBlcih7XG4gICAgICBzY2FsZTogMi4wLFxuICAgICAgbW9kZTogJ2ZhbkluJyxcbiAgICAgIGRpc3RyaWJ1dGlvbjogJ3VuaWZvcm0nLFxuICAgICAgc2VlZDogYXJncyA9PSBudWxsID8gbnVsbCA6IGFyZ3Muc2VlZFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0Q2xhc3NOYW1lKCk6IHN0cmluZyB7XG4gICAgLy8gSW4gUHl0aG9uIEtlcmFzLCBIZVVuaWZvcm0gaXMgbm90IGEgY2xhc3MsIGJ1dCBhIGhlbHBlciBtZXRob2RcbiAgICAvLyB0aGF0IGNyZWF0ZXMgYSBWYXJpYW5jZVNjYWxpbmcgb2JqZWN0LiBVc2UgJ1ZhcmlhbmNlU2NhbGluZycgYXNcbiAgICAvLyBjbGFzcyBuYW1lIHRvIGJlIGNvbXBhdGlibGUgd2l0aCB0aGF0LlxuICAgIHJldHVybiBWYXJpYW5jZVNjYWxpbmcuY2xhc3NOYW1lO1xuICB9XG59XG5zZXJpYWxpemF0aW9uLnJlZ2lzdGVyQ2xhc3MoSGVVbmlmb3JtKTtcblxuZXhwb3J0IGNsYXNzIExlQ3VuTm9ybWFsIGV4dGVuZHMgVmFyaWFuY2VTY2FsaW5nIHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBjbGFzc05hbWUgPSAnTGVDdW5Ob3JtYWwnO1xuXG4gIGNvbnN0cnVjdG9yKGFyZ3M/OiBTZWVkT25seUluaXRpYWxpemVyQXJncykge1xuICAgIHN1cGVyKHtcbiAgICAgIHNjYWxlOiAxLjAsXG4gICAgICBtb2RlOiAnZmFuSW4nLFxuICAgICAgZGlzdHJpYnV0aW9uOiAnbm9ybWFsJyxcbiAgICAgIHNlZWQ6IGFyZ3MgPT0gbnVsbCA/IG51bGwgOiBhcmdzLnNlZWRcbiAgICB9KTtcbiAgfVxuXG4gIGdldENsYXNzTmFtZSgpOiBzdHJpbmcge1xuICAgIC8vIEluIFB5dGhvbiBLZXJhcywgTGVDdW5Ob3JtYWwgaXMgbm90IGEgY2xhc3MsIGJ1dCBhIGhlbHBlciBtZXRob2RcbiAgICAvLyB0aGF0IGNyZWF0ZXMgYSBWYXJpYW5jZVNjYWxpbmcgb2JqZWN0LiBVc2UgJ1ZhcmlhbmNlU2NhbGluZycgYXNcbiAgICAvLyBjbGFzcyBuYW1lIHRvIGJlIGNvbXBhdGlibGUgd2l0aCB0aGF0LlxuICAgIHJldHVybiBWYXJpYW5jZVNjYWxpbmcuY2xhc3NOYW1lO1xuICB9XG59XG5zZXJpYWxpemF0aW9uLnJlZ2lzdGVyQ2xhc3MoTGVDdW5Ob3JtYWwpO1xuXG5leHBvcnQgY2xhc3MgTGVDdW5Vbmlmb3JtIGV4dGVuZHMgVmFyaWFuY2VTY2FsaW5nIHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBjbGFzc05hbWUgPSAnTGVDdW5Ob3JtYWwnO1xuXG4gIGNvbnN0cnVjdG9yKGFyZ3M/OiBTZWVkT25seUluaXRpYWxpemVyQXJncykge1xuICAgIHN1cGVyKHtcbiAgICAgIHNjYWxlOiAxLjAsXG4gICAgICBtb2RlOiAnZmFuSW4nLFxuICAgICAgZGlzdHJpYnV0aW9uOiAndW5pZm9ybScsXG4gICAgICBzZWVkOiBhcmdzID09IG51bGwgPyBudWxsIDogYXJncy5zZWVkXG4gICAgfSk7XG4gIH1cblxuICBnZXRDbGFzc05hbWUoKTogc3RyaW5nIHtcbiAgICAvLyBJbiBQeXRob24gS2VyYXMsIExlQ3VuVW5pZm9ybSBpcyBub3QgYSBjbGFzcywgYnV0IGEgaGVscGVyIG1ldGhvZFxuICAgIC8vIHRoYXQgY3JlYXRlcyBhIFZhcmlhbmNlU2NhbGluZyBvYmplY3QuIFVzZSAnVmFyaWFuY2VTY2FsaW5nJyBhc1xuICAgIC8vIGNsYXNzIG5hbWUgdG8gYmUgY29tcGF0aWJsZSB3aXRoIHRoYXQuXG4gICAgcmV0dXJuIFZhcmlhbmNlU2NhbGluZy5jbGFzc05hbWU7XG4gIH1cbn1cbnNlcmlhbGl6YXRpb24ucmVnaXN0ZXJDbGFzcyhMZUN1blVuaWZvcm0pO1xuXG5leHBvcnQgaW50ZXJmYWNlIE9ydGhvZ29uYWxBcmdzIGV4dGVuZHMgU2VlZE9ubHlJbml0aWFsaXplckFyZ3Mge1xuICAvKipcbiAgICogTXVsdGlwbGljYXRpdmUgZmFjdG9yIHRvIGFwcGx5IHRvIHRoZSBvcnRob2dvbmFsIG1hdHJpeC4gRGVmYXVsdHMgdG8gMS5cbiAgICovXG4gIGdhaW4/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBPcnRob2dvbmFsIGV4dGVuZHMgSW5pdGlhbGl6ZXIge1xuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIGNsYXNzTmFtZSA9ICdPcnRob2dvbmFsJztcbiAgcmVhZG9ubHkgREVGQVVMVF9HQUlOID0gMTtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGdhaW46IG51bWJlcjtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHNlZWQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihhcmdzPzogT3J0aG9nb25hbEFyZ3MpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZ2FpbiA9IGFyZ3MuZ2FpbiA9PSBudWxsID8gdGhpcy5ERUZBVUxUX0dBSU4gOiBhcmdzLmdhaW47XG4gICAgdGhpcy5zZWVkID0gYXJncy5zZWVkO1xuXG4gICAgaWYgKHRoaXMuc2VlZCAhPSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFcnJvcihcbiAgICAgICAgICAnUmFuZG9tIHNlZWQgaXMgbm90IGltcGxlbWVudGVkIGZvciBPcnRob2dvbmFsIEluaXRpYWxpemVyIHlldC4nKTtcbiAgICB9XG4gIH1cblxuICBhcHBseShzaGFwZTogU2hhcGUsIGR0eXBlPzogRGF0YVR5cGUpOiBUZW5zb3Ige1xuICAgIHJldHVybiB0aWR5KCgpID0+IHtcbiAgICAgIGlmIChzaGFwZS5sZW5ndGggPCAyKSB7XG4gICAgICAgIHRocm93IG5ldyBOb3RJbXBsZW1lbnRlZEVycm9yKCdTaGFwZSBtdXN0IGJlIGF0IGxlYXN0IDJELicpO1xuICAgICAgfVxuICAgICAgaWYgKHNoYXBlWzBdICogc2hhcGVbMV0gPiAyMDAwKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgIGBPcnRob2dvbmFsIGluaXRpYWxpemVyIGlzIGJlaW5nIGNhbGxlZCBvbiBhIG1hdHJpeCB3aXRoIG1vcmUgYCArXG4gICAgICAgICAgICBgdGhhbiAyMDAwICgke3NoYXBlWzBdICogc2hhcGVbMV19KSBlbGVtZW50czogYCArXG4gICAgICAgICAgICBgU2xvd25lc3MgbWF5IHJlc3VsdC5gKTtcbiAgICAgIH1cblxuICAgICAgLy8gVE9ETyhjYWlzKTogQWRkIHNlZWQgc3VwcG9ydC5cbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRTaGFwZSA9XG4gICAgICAgICAgc2hhcGVbMF0gPiBzaGFwZVsxXSA/IFtzaGFwZVsxXSwgc2hhcGVbMF1dIDogc2hhcGU7XG4gICAgICBjb25zdCBhID0gSy5yYW5kb21Ob3JtYWwobm9ybWFsaXplZFNoYXBlLCAwLCAxLCAnZmxvYXQzMicpIGFzIFRlbnNvcjJEO1xuICAgICAgbGV0IHEgPSBsaW5hbGcuZ3JhbVNjaG1pZHQoYSkgYXMgVGVuc29yMkQ7XG4gICAgICBpZiAoc2hhcGVbMF0gPiBzaGFwZVsxXSkge1xuICAgICAgICBxID0gdHJhbnNwb3NlKHEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG11bCh0aGlzLmdhaW4sIHEpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0Q29uZmlnKCk6IHNlcmlhbGl6YXRpb24uQ29uZmlnRGljdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdhaW46IHRoaXMuZ2FpbixcbiAgICAgIHNlZWQ6IHRoaXMuc2VlZCxcbiAgICB9O1xuICB9XG59XG5zZXJpYWxpemF0aW9uLnJlZ2lzdGVyQ2xhc3MoT3J0aG9nb25hbCk7XG5cbi8qKiBAZG9jaW5saW5lICovXG5leHBvcnQgdHlwZSBJbml0aWFsaXplcklkZW50aWZpZXIgPVxuICAgICdjb25zdGFudCd8J2dsb3JvdE5vcm1hbCd8J2dsb3JvdFVuaWZvcm0nfCdoZU5vcm1hbCd8J2hlVW5pZm9ybSd8J2lkZW50aXR5J3xcbiAgICAnbGVDdW5Ob3JtYWwnfCdsZUN1blVuaWZvcm0nfCdvbmVzJ3wnb3J0aG9nb25hbCd8J3JhbmRvbU5vcm1hbCd8XG4gICAgJ3JhbmRvbVVuaWZvcm0nfCd0cnVuY2F0ZWROb3JtYWwnfCd2YXJpYW5jZVNjYWxpbmcnfCd6ZXJvcyd8c3RyaW5nO1xuXG4vLyBNYXBzIHRoZSBKYXZhU2NyaXB0LWxpa2UgaWRlbnRpZmllciBrZXlzIHRvIHRoZSBjb3JyZXNwb25kaW5nIHJlZ2lzdHJ5XG4vLyBzeW1ib2xzLlxuZXhwb3J0IGNvbnN0IElOSVRJQUxJWkVSX0lERU5USUZJRVJfUkVHSVNUUllfU1lNQk9MX01BUDpcbiAgICB7W2lkZW50aWZpZXIgaW4gSW5pdGlhbGl6ZXJJZGVudGlmaWVyXTogc3RyaW5nfSA9IHtcbiAgICAgICdjb25zdGFudCc6ICdDb25zdGFudCcsXG4gICAgICAnZ2xvcm90Tm9ybWFsJzogJ0dsb3JvdE5vcm1hbCcsXG4gICAgICAnZ2xvcm90VW5pZm9ybSc6ICdHbG9yb3RVbmlmb3JtJyxcbiAgICAgICdoZU5vcm1hbCc6ICdIZU5vcm1hbCcsXG4gICAgICAnaGVVbmlmb3JtJzogJ0hlVW5pZm9ybScsXG4gICAgICAnaWRlbnRpdHknOiAnSWRlbnRpdHknLFxuICAgICAgJ2xlQ3VuTm9ybWFsJzogJ0xlQ3VuTm9ybWFsJyxcbiAgICAgICdsZUN1blVuaWZvcm0nOiAnTGVDdW5Vbmlmb3JtJyxcbiAgICAgICdvbmVzJzogJ09uZXMnLFxuICAgICAgJ29ydGhvZ29uYWwnOiAnT3J0aG9nb25hbCcsXG4gICAgICAncmFuZG9tTm9ybWFsJzogJ1JhbmRvbU5vcm1hbCcsXG4gICAgICAncmFuZG9tVW5pZm9ybSc6ICdSYW5kb21Vbmlmb3JtJyxcbiAgICAgICd0cnVuY2F0ZWROb3JtYWwnOiAnVHJ1bmNhdGVkTm9ybWFsJyxcbiAgICAgICd2YXJpYW5jZVNjYWxpbmcnOiAnVmFyaWFuY2VTY2FsaW5nJyxcbiAgICAgICd6ZXJvcyc6ICdaZXJvcydcbiAgICB9O1xuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZUluaXRpYWxpemVyKFxuICAgIGNvbmZpZzogc2VyaWFsaXphdGlvbi5Db25maWdEaWN0LFxuICAgIGN1c3RvbU9iamVjdHM6IHNlcmlhbGl6YXRpb24uQ29uZmlnRGljdCA9IHt9KTogSW5pdGlhbGl6ZXIge1xuICByZXR1cm4gZGVzZXJpYWxpemVLZXJhc09iamVjdChcbiAgICAgIGNvbmZpZywgc2VyaWFsaXphdGlvbi5TZXJpYWxpemF0aW9uTWFwLmdldE1hcCgpLmNsYXNzTmFtZU1hcCxcbiAgICAgIGN1c3RvbU9iamVjdHMsICdpbml0aWFsaXplcicpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplSW5pdGlhbGl6ZXIoaW5pdGlhbGl6ZXI6IEluaXRpYWxpemVyKTpcbiAgICBzZXJpYWxpemF0aW9uLkNvbmZpZ0RpY3RWYWx1ZSB7XG4gIHJldHVybiBzZXJpYWxpemVLZXJhc09iamVjdChpbml0aWFsaXplcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbml0aWFsaXplcihpZGVudGlmaWVyOiBJbml0aWFsaXplcklkZW50aWZpZXJ8SW5pdGlhbGl6ZXJ8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VyaWFsaXphdGlvbi5Db25maWdEaWN0KTogSW5pdGlhbGl6ZXIge1xuICBpZiAodHlwZW9mIGlkZW50aWZpZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc3QgY2xhc3NOYW1lID0gaWRlbnRpZmllciBpbiBJTklUSUFMSVpFUl9JREVOVElGSUVSX1JFR0lTVFJZX1NZTUJPTF9NQVAgP1xuICAgICAgICBJTklUSUFMSVpFUl9JREVOVElGSUVSX1JFR0lTVFJZX1NZTUJPTF9NQVBbaWRlbnRpZmllcl0gOlxuICAgICAgICBpZGVudGlmaWVyO1xuICAgIC8qIFdlIGhhdmUgZm91ciAnaGVscGVyJyBjbGFzc2VzIGZvciBjb21tb24gaW5pdGlhbGl6ZXJzIHRoYXRcbiAgICBhbGwgZ2V0IHNlcmlhbGl6ZWQgYXMgJ1ZhcmlhbmNlU2NhbGluZycgYW5kIHNob3VsZG4ndCBnbyB0aHJvdWdoXG4gICAgdGhlIGRlc2VyaWFsaXplSW5pdGlhbGl6ZXIgcGF0aHdheS4gKi9cbiAgICBpZiAoY2xhc3NOYW1lID09PSAnR2xvcm90Tm9ybWFsJykge1xuICAgICAgcmV0dXJuIG5ldyBHbG9yb3ROb3JtYWwoKTtcbiAgICB9IGVsc2UgaWYgKGNsYXNzTmFtZSA9PT0gJ0dsb3JvdFVuaWZvcm0nKSB7XG4gICAgICByZXR1cm4gbmV3IEdsb3JvdFVuaWZvcm0oKTtcbiAgICB9IGVsc2UgaWYgKGNsYXNzTmFtZSA9PT0gJ0hlTm9ybWFsJykge1xuICAgICAgcmV0dXJuIG5ldyBIZU5vcm1hbCgpO1xuICAgIH0gZWxzZSBpZiAoY2xhc3NOYW1lID09PSAnSGVVbmlmb3JtJykge1xuICAgICAgcmV0dXJuIG5ldyBIZVVuaWZvcm0oKTtcbiAgICB9IGVsc2UgaWYgKGNsYXNzTmFtZSA9PT0gJ0xlQ3VuTm9ybWFsJykge1xuICAgICAgcmV0dXJuIG5ldyBMZUN1bk5vcm1hbCgpO1xuICAgIH0gZWxzZSBpZiAoY2xhc3NOYW1lID09PSAnTGVDdW5Vbmlmb3JtJykge1xuICAgICAgcmV0dXJuIG5ldyBMZUN1blVuaWZvcm0oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY29uZmlnOiBzZXJpYWxpemF0aW9uLkNvbmZpZ0RpY3QgPSB7fTtcbiAgICAgIGNvbmZpZ1snY2xhc3NOYW1lJ10gPSBjbGFzc05hbWU7XG4gICAgICBjb25maWdbJ2NvbmZpZyddID0ge307XG4gICAgICByZXR1cm4gZGVzZXJpYWxpemVJbml0aWFsaXplcihjb25maWcpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpZGVudGlmaWVyIGluc3RhbmNlb2YgSW5pdGlhbGl6ZXIpIHtcbiAgICByZXR1cm4gaWRlbnRpZmllcjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZGVzZXJpYWxpemVJbml0aWFsaXplcihpZGVudGlmaWVyKTtcbiAgfVxufVxuIl19