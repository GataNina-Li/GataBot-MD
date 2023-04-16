/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
// Layer activation functions
import * as tfc from '@tensorflow/tfjs-core';
import { serialization, tidy } from '@tensorflow/tfjs-core';
import * as K from './backend/tfjs_backend';
import { deserializeKerasObject } from './utils/generic_utils';
/**
 * Base class for Activations.
 *
 * Special note: due to cross-language compatibility reasons, the
 * static readonly className field in this family of classes must be set to
 * the initialLowerCamelCase name of the activation.
 */
export class Activation extends serialization.Serializable {
    getConfig() {
        return {};
    }
}
/**
 * Exponential linear unit (ELU).
 * Reference: https://arxiv.org/abs/1511.07289
 */
export class Elu extends Activation {
    /**
     * Calculate the activation function.
     *
     * @param x: Input.
     * @param alpha: Scaling factor the negative section.
     * @return Output of the ELU activation.
     */
    apply(x, alpha = 1) {
        return K.elu(x, alpha);
    }
}
/** @nocollapse */
Elu.className = 'elu';
serialization.registerClass(Elu);
/**
 * Scaled Exponential Linear Unit. (Klambauer et al., 2017).
 * Reference: Self-Normalizing Neural Networks, https://arxiv.org/abs/1706.02515
 * Notes:
 *   - To be used together with the initialization "lecunNormal".
 *   - To be used together with the dropout variant "AlphaDropout".
 */
export class Selu extends Activation {
    apply(x) {
        return tfc.selu(x);
    }
}
/** @nocollapse */
Selu.className = 'selu';
serialization.registerClass(Selu);
/**
 *  Rectified linear unit
 */
export class Relu extends Activation {
    apply(x) {
        return tfc.relu(x);
    }
}
/** @nocollapse */
Relu.className = 'relu';
serialization.registerClass(Relu);
/**
 * Rectified linear unit activation maxing out at 6.0.
 */
export class Relu6 extends Activation {
    apply(x) {
        return tidy(() => tfc.minimum(6.0, tfc.relu(x)));
    }
}
/** @nocollapse */
Relu6.className = 'relu6';
serialization.registerClass(Relu6);
//* Linear activation (no-op) */
export class Linear extends Activation {
    apply(x) {
        return x;
    }
}
/** @nocollapse */
Linear.className = 'linear';
serialization.registerClass(Linear);
/**
 * Sigmoid activation function.
 */
export class Sigmoid extends Activation {
    apply(x) {
        return tfc.sigmoid(x);
    }
}
/** @nocollapse */
Sigmoid.className = 'sigmoid';
serialization.registerClass(Sigmoid);
/**
 * Segment-wise linear approximation of sigmoid.
 */
export class HardSigmoid extends Activation {
    apply(x) {
        return K.hardSigmoid(x);
    }
}
/** @nocollapse */
HardSigmoid.className = 'hardSigmoid';
serialization.registerClass(HardSigmoid);
/**
 * Softplus activation function.
 */
export class Softplus extends Activation {
    apply(x) {
        return tfc.softplus(x);
    }
}
/** @nocollapse */
Softplus.className = 'softplus';
serialization.registerClass(Softplus);
/**
 * Softsign activation function.
 */
export class Softsign extends Activation {
    apply(x) {
        return K.softsign(x);
    }
}
/** @nocollapse */
Softsign.className = 'softsign';
serialization.registerClass(Softsign);
/**
 * Hyperbolic tangent function.
 */
export class Tanh extends Activation {
    apply(x) {
        return tfc.tanh(x);
    }
}
/** @nocollapse */
Tanh.className = 'tanh';
serialization.registerClass(Tanh);
/**
 * Softmax activation function
 */
export class Softmax extends Activation {
    /**
     * Calculate the activation function.
     *
     * @param x Tensor.
     * @param axis Integer, axis along which the softmax normalization is applied.
     * Invalid if < 2, as softmax across 1 (the batch dimension) is assumed to be
     * an error.
     *
     * @returns a Tensor of the same shape as x
     *
     * @throws ValueError: In case `dim(x) < 2`.
     */
    apply(x, axis = (-1)) {
        return tfc.softmax(x, axis);
    }
}
/** @nocollapse */
Softmax.className = 'softmax';
serialization.registerClass(Softmax);
/**
 * Log softmax activation function
 */
export class LogSoftmax extends Activation {
    /**
     * Calculate the activation function of log softmax:
     * log( exp(x_i) / sum(exp(x)) )
     *
     * @param x Tensor.
     * @param axis Integer, axis along which the softmax normalization is applied.
     * Invalid if < 2, as softmax across 1 (the batch dimension) is assumed to be
     * an error.
     *
     * @returns a Tensor of the same shape as x
     *
     * @throws ValueError: In case `dim(x) < 2`.
     */
    apply(x, axis = (-1)) {
        return tfc.logSoftmax(x, axis);
    }
}
/** @nocollapse */
LogSoftmax.className = 'logSoftmax';
serialization.registerClass(LogSoftmax);
/**
 * Swish activation function
 */
export class Swish extends Activation {
    /**
     * Calculate the activation function.
     *
     * @param x Tensor.
     * @param alpha Scaling factor for the sigmoid function.
     * @returns a Tensor of the same shape as x
     */
    apply(x, alpha = 1) {
        return tidy(() => tfc.mul(tfc.sigmoid(tfc.mul(x, alpha)), x));
    }
}
/** @nocollapse */
Swish.className = 'swish';
serialization.registerClass(Swish);
/**
 * Mish activation function
 */
export class Mish extends Activation {
    /**
     * Calculate the activation function.
     *
     * @param x Tensor.
     * @returns a Tensor of the same shape as x
     */
    apply(x) {
        return tidy(() => tfc.mul(x, tfc.tanh(tfc.softplus(x))));
    }
}
/** @nocollapse */
Mish.className = 'mish';
serialization.registerClass(Mish);
export function serializeActivation(activation) {
    return activation.getClassName();
}
export function deserializeActivation(config, customObjects = {}) {
    return deserializeKerasObject(config, serialization.SerializationMap.getMap().classNameMap, customObjects, 'activation');
}
export function getActivation(identifier) {
    if (identifier == null) {
        const config = {};
        config['className'] = 'linear';
        config['config'] = {};
        return deserializeActivation(config);
    }
    if (typeof identifier === 'string') {
        const config = {};
        config['className'] = identifier;
        config['config'] = {};
        return deserializeActivation(config);
    }
    else if (identifier instanceof Activation) {
        return identifier;
    }
    else {
        return deserializeActivation(identifier);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZhdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWxheWVycy9zcmMvYWN0aXZhdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0dBUUc7QUFFSCw2QkFBNkI7QUFDN0IsT0FBTyxLQUFLLEdBQUcsTUFBTSx1QkFBdUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsYUFBYSxFQUFVLElBQUksRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2xFLE9BQU8sS0FBSyxDQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFFNUMsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFN0Q7Ozs7OztHQU1HO0FBQ0gsTUFBTSxPQUFnQixVQUFXLFNBQVEsYUFBYSxDQUFDLFlBQVk7SUFFakUsU0FBUztRQUNQLE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztDQUNGO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxPQUFPLEdBQUksU0FBUSxVQUFVO0lBR2pDOzs7Ozs7T0FNRztJQUNILEtBQUssQ0FBQyxDQUFTLEVBQUUsS0FBSyxHQUFHLENBQUM7UUFDeEIsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN6QixDQUFDOztBQVhELGtCQUFrQjtBQUNGLGFBQVMsR0FBRyxLQUFLLENBQUM7QUFZcEMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUVqQzs7Ozs7O0dBTUc7QUFDSCxNQUFNLE9BQU8sSUFBSyxTQUFRLFVBQVU7SUFHbEMsS0FBSyxDQUFDLENBQVM7UUFDYixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckIsQ0FBQzs7QUFKRCxrQkFBa0I7QUFDRixjQUFTLEdBQUcsTUFBTSxDQUFDO0FBS3JDLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFbEM7O0dBRUc7QUFDSCxNQUFNLE9BQU8sSUFBSyxTQUFRLFVBQVU7SUFHbEMsS0FBSyxDQUFDLENBQVM7UUFDYixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckIsQ0FBQzs7QUFKRCxrQkFBa0I7QUFDRixjQUFTLEdBQUcsTUFBTSxDQUFDO0FBS3JDLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFbEM7O0dBRUc7QUFDSCxNQUFNLE9BQU8sS0FBTSxTQUFRLFVBQVU7SUFHbkMsS0FBSyxDQUFDLENBQVM7UUFDYixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRCxDQUFDOztBQUpELGtCQUFrQjtBQUNGLGVBQVMsR0FBRyxPQUFPLENBQUM7QUFLdEMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUVuQyxnQ0FBZ0M7QUFDaEMsTUFBTSxPQUFPLE1BQU8sU0FBUSxVQUFVO0lBR3BDLEtBQUssQ0FBQyxDQUFTO1FBQ2IsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDOztBQUpELGtCQUFrQjtBQUNGLGdCQUFTLEdBQUcsUUFBUSxDQUFDO0FBS3ZDLGFBQWEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFcEM7O0dBRUc7QUFDSCxNQUFNLE9BQU8sT0FBUSxTQUFRLFVBQVU7SUFHckMsS0FBSyxDQUFDLENBQVM7UUFDYixPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEIsQ0FBQzs7QUFKRCxrQkFBa0I7QUFDRixpQkFBUyxHQUFHLFNBQVMsQ0FBQztBQUt4QyxhQUFhLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRXJDOztHQUVHO0FBQ0gsTUFBTSxPQUFPLFdBQVksU0FBUSxVQUFVO0lBR3pDLEtBQUssQ0FBQyxDQUFTO1FBQ2IsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLENBQUM7O0FBSkQsa0JBQWtCO0FBQ0YscUJBQVMsR0FBRyxhQUFhLENBQUM7QUFLNUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUV6Qzs7R0FFRztBQUNILE1BQU0sT0FBTyxRQUFTLFNBQVEsVUFBVTtJQUd0QyxLQUFLLENBQUMsQ0FBUztRQUNiLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QixDQUFDOztBQUpELGtCQUFrQjtBQUNGLGtCQUFTLEdBQUcsVUFBVSxDQUFDO0FBS3pDLGFBQWEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFdEM7O0dBRUc7QUFDSCxNQUFNLE9BQU8sUUFBUyxTQUFRLFVBQVU7SUFHdEMsS0FBSyxDQUFDLENBQVM7UUFDYixPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkIsQ0FBQzs7QUFKRCxrQkFBa0I7QUFDRixrQkFBUyxHQUFHLFVBQVUsQ0FBQztBQUt6QyxhQUFhLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRXRDOztHQUVHO0FBQ0gsTUFBTSxPQUFPLElBQUssU0FBUSxVQUFVO0lBR2xDLEtBQUssQ0FBQyxDQUFTO1FBQ2IsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7O0FBSkQsa0JBQWtCO0FBQ0YsY0FBUyxHQUFHLE1BQU0sQ0FBQztBQUtyQyxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRWxDOztHQUVHO0FBQ0gsTUFBTSxPQUFPLE9BQVEsU0FBUSxVQUFVO0lBR3JDOzs7Ozs7Ozs7OztPQVdHO0lBQ0gsS0FBSyxDQUFDLENBQVMsRUFBRSxPQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDOztBQWhCRCxrQkFBa0I7QUFDRixpQkFBUyxHQUFHLFNBQVMsQ0FBQztBQWlCeEMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUVyQzs7R0FFRztBQUNILE1BQU0sT0FBTyxVQUFXLFNBQVEsVUFBVTtJQUd4Qzs7Ozs7Ozs7Ozs7O09BWUc7SUFDSCxLQUFLLENBQUMsQ0FBUyxFQUFFLE9BQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxPQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2pDLENBQUM7O0FBakJELGtCQUFrQjtBQUNGLG9CQUFTLEdBQUcsWUFBWSxDQUFDO0FBa0IzQyxhQUFhLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRXhDOztHQUVHO0FBQ0gsTUFBTSxPQUFPLEtBQU0sU0FBUSxVQUFVO0lBR25DOzs7Ozs7T0FNRztJQUNILEtBQUssQ0FBQyxDQUFTLEVBQUUsS0FBSyxHQUFHLENBQUM7UUFDeEIsT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRSxDQUFDOztBQVhELGtCQUFrQjtBQUNGLGVBQVMsR0FBRyxPQUFPLENBQUM7QUFZdEMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUVuQzs7R0FFRztBQUNILE1BQU0sT0FBTyxJQUFLLFNBQVEsVUFBVTtJQUdsQzs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxDQUFTO1FBQ2IsT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7O0FBVkQsa0JBQWtCO0FBQ0YsY0FBUyxHQUFHLE1BQU0sQ0FBQztBQVdyQyxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRWxDLE1BQU0sVUFBVSxtQkFBbUIsQ0FBQyxVQUFzQjtJQUN4RCxPQUFPLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNuQyxDQUFDO0FBRUQsTUFBTSxVQUFVLHFCQUFxQixDQUNqQyxNQUFnQyxFQUNoQyxnQkFBMEMsRUFBRTtJQUM5QyxPQUFPLHNCQUFzQixDQUN6QixNQUFNLEVBQUUsYUFBYSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDLFlBQVksRUFDNUQsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFFRCxNQUFNLFVBQVUsYUFBYSxDQUFDLFVBQ21DO0lBQy9ELElBQUksVUFBVSxJQUFJLElBQUksRUFBRTtRQUN0QixNQUFNLE1BQU0sR0FBNkIsRUFBRSxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxRQUFRLENBQUM7UUFDL0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN0QixPQUFPLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3RDO0lBQ0QsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDbEMsTUFBTSxNQUFNLEdBQTZCLEVBQUUsQ0FBQztRQUM1QyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDdEIsT0FBTyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN0QztTQUFNLElBQUksVUFBVSxZQUFZLFVBQVUsRUFBRTtRQUMzQyxPQUFPLFVBQVUsQ0FBQztLQUNuQjtTQUFNO1FBQ0wsT0FBTyxxQkFBcUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUMxQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gKiBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAqIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG4vLyBMYXllciBhY3RpdmF0aW9uIGZ1bmN0aW9uc1xuaW1wb3J0ICogYXMgdGZjIGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5pbXBvcnQge3NlcmlhbGl6YXRpb24sIFRlbnNvciwgdGlkeX0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbmltcG9ydCAqIGFzIEsgZnJvbSAnLi9iYWNrZW5kL3RmanNfYmFja2VuZCc7XG5pbXBvcnQge0FjdGl2YXRpb25JZGVudGlmaWVyfSBmcm9tICcuL2tlcmFzX2Zvcm1hdC9hY3RpdmF0aW9uX2NvbmZpZyc7XG5pbXBvcnQge2Rlc2VyaWFsaXplS2VyYXNPYmplY3R9IGZyb20gJy4vdXRpbHMvZ2VuZXJpY191dGlscyc7XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgQWN0aXZhdGlvbnMuXG4gKlxuICogU3BlY2lhbCBub3RlOiBkdWUgdG8gY3Jvc3MtbGFuZ3VhZ2UgY29tcGF0aWJpbGl0eSByZWFzb25zLCB0aGVcbiAqIHN0YXRpYyByZWFkb25seSBjbGFzc05hbWUgZmllbGQgaW4gdGhpcyBmYW1pbHkgb2YgY2xhc3NlcyBtdXN0IGJlIHNldCB0b1xuICogdGhlIGluaXRpYWxMb3dlckNhbWVsQ2FzZSBuYW1lIG9mIHRoZSBhY3RpdmF0aW9uLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQWN0aXZhdGlvbiBleHRlbmRzIHNlcmlhbGl6YXRpb24uU2VyaWFsaXphYmxlIHtcbiAgYWJzdHJhY3QgYXBwbHkodGVuc29yOiBUZW5zb3IsIGF4aXM/OiBudW1iZXIpOiBUZW5zb3I7XG4gIGdldENvbmZpZygpOiBzZXJpYWxpemF0aW9uLkNvbmZpZ0RpY3Qge1xuICAgIHJldHVybiB7fTtcbiAgfVxufVxuXG4vKipcbiAqIEV4cG9uZW50aWFsIGxpbmVhciB1bml0IChFTFUpLlxuICogUmVmZXJlbmNlOiBodHRwczovL2FyeGl2Lm9yZy9hYnMvMTUxMS4wNzI4OVxuICovXG5leHBvcnQgY2xhc3MgRWx1IGV4dGVuZHMgQWN0aXZhdGlvbiB7XG4gIC8qKiBAbm9jb2xsYXBzZSAqL1xuICBzdGF0aWMgcmVhZG9ubHkgY2xhc3NOYW1lID0gJ2VsdSc7XG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgdGhlIGFjdGl2YXRpb24gZnVuY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB4OiBJbnB1dC5cbiAgICogQHBhcmFtIGFscGhhOiBTY2FsaW5nIGZhY3RvciB0aGUgbmVnYXRpdmUgc2VjdGlvbi5cbiAgICogQHJldHVybiBPdXRwdXQgb2YgdGhlIEVMVSBhY3RpdmF0aW9uLlxuICAgKi9cbiAgYXBwbHkoeDogVGVuc29yLCBhbHBoYSA9IDEpOiBUZW5zb3Ige1xuICAgIHJldHVybiBLLmVsdSh4LCBhbHBoYSk7XG4gIH1cbn1cbnNlcmlhbGl6YXRpb24ucmVnaXN0ZXJDbGFzcyhFbHUpO1xuXG4vKipcbiAqIFNjYWxlZCBFeHBvbmVudGlhbCBMaW5lYXIgVW5pdC4gKEtsYW1iYXVlciBldCBhbC4sIDIwMTcpLlxuICogUmVmZXJlbmNlOiBTZWxmLU5vcm1hbGl6aW5nIE5ldXJhbCBOZXR3b3JrcywgaHR0cHM6Ly9hcnhpdi5vcmcvYWJzLzE3MDYuMDI1MTVcbiAqIE5vdGVzOlxuICogICAtIFRvIGJlIHVzZWQgdG9nZXRoZXIgd2l0aCB0aGUgaW5pdGlhbGl6YXRpb24gXCJsZWN1bk5vcm1hbFwiLlxuICogICAtIFRvIGJlIHVzZWQgdG9nZXRoZXIgd2l0aCB0aGUgZHJvcG91dCB2YXJpYW50IFwiQWxwaGFEcm9wb3V0XCIuXG4gKi9cbmV4cG9ydCBjbGFzcyBTZWx1IGV4dGVuZHMgQWN0aXZhdGlvbiB7XG4gIC8qKiBAbm9jb2xsYXBzZSAqL1xuICBzdGF0aWMgcmVhZG9ubHkgY2xhc3NOYW1lID0gJ3NlbHUnO1xuICBhcHBseSh4OiBUZW5zb3IpOiBUZW5zb3Ige1xuICAgIHJldHVybiB0ZmMuc2VsdSh4KTtcbiAgfVxufVxuc2VyaWFsaXphdGlvbi5yZWdpc3RlckNsYXNzKFNlbHUpO1xuXG4vKipcbiAqICBSZWN0aWZpZWQgbGluZWFyIHVuaXRcbiAqL1xuZXhwb3J0IGNsYXNzIFJlbHUgZXh0ZW5kcyBBY3RpdmF0aW9uIHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyByZWFkb25seSBjbGFzc05hbWUgPSAncmVsdSc7XG4gIGFwcGx5KHg6IFRlbnNvcik6IFRlbnNvciB7XG4gICAgcmV0dXJuIHRmYy5yZWx1KHgpO1xuICB9XG59XG5zZXJpYWxpemF0aW9uLnJlZ2lzdGVyQ2xhc3MoUmVsdSk7XG5cbi8qKlxuICogUmVjdGlmaWVkIGxpbmVhciB1bml0IGFjdGl2YXRpb24gbWF4aW5nIG91dCBhdCA2LjAuXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWx1NiBleHRlbmRzIEFjdGl2YXRpb24ge1xuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIHJlYWRvbmx5IGNsYXNzTmFtZSA9ICdyZWx1Nic7XG4gIGFwcGx5KHg6IFRlbnNvcik6IFRlbnNvciB7XG4gICAgcmV0dXJuIHRpZHkoKCkgPT4gdGZjLm1pbmltdW0oNi4wLCB0ZmMucmVsdSh4KSkpO1xuICB9XG59XG5zZXJpYWxpemF0aW9uLnJlZ2lzdGVyQ2xhc3MoUmVsdTYpO1xuXG4vLyogTGluZWFyIGFjdGl2YXRpb24gKG5vLW9wKSAqL1xuZXhwb3J0IGNsYXNzIExpbmVhciBleHRlbmRzIEFjdGl2YXRpb24ge1xuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIHJlYWRvbmx5IGNsYXNzTmFtZSA9ICdsaW5lYXInO1xuICBhcHBseSh4OiBUZW5zb3IpOiBUZW5zb3Ige1xuICAgIHJldHVybiB4O1xuICB9XG59XG5zZXJpYWxpemF0aW9uLnJlZ2lzdGVyQ2xhc3MoTGluZWFyKTtcblxuLyoqXG4gKiBTaWdtb2lkIGFjdGl2YXRpb24gZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBTaWdtb2lkIGV4dGVuZHMgQWN0aXZhdGlvbiB7XG4gIC8qKiBAbm9jb2xsYXBzZSAqL1xuICBzdGF0aWMgcmVhZG9ubHkgY2xhc3NOYW1lID0gJ3NpZ21vaWQnO1xuICBhcHBseSh4OiBUZW5zb3IpOiBUZW5zb3Ige1xuICAgIHJldHVybiB0ZmMuc2lnbW9pZCh4KTtcbiAgfVxufVxuc2VyaWFsaXphdGlvbi5yZWdpc3RlckNsYXNzKFNpZ21vaWQpO1xuXG4vKipcbiAqIFNlZ21lbnQtd2lzZSBsaW5lYXIgYXBwcm94aW1hdGlvbiBvZiBzaWdtb2lkLlxuICovXG5leHBvcnQgY2xhc3MgSGFyZFNpZ21vaWQgZXh0ZW5kcyBBY3RpdmF0aW9uIHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyByZWFkb25seSBjbGFzc05hbWUgPSAnaGFyZFNpZ21vaWQnO1xuICBhcHBseSh4OiBUZW5zb3IpOiBUZW5zb3Ige1xuICAgIHJldHVybiBLLmhhcmRTaWdtb2lkKHgpO1xuICB9XG59XG5zZXJpYWxpemF0aW9uLnJlZ2lzdGVyQ2xhc3MoSGFyZFNpZ21vaWQpO1xuXG4vKipcbiAqIFNvZnRwbHVzIGFjdGl2YXRpb24gZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBTb2Z0cGx1cyBleHRlbmRzIEFjdGl2YXRpb24ge1xuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIHJlYWRvbmx5IGNsYXNzTmFtZSA9ICdzb2Z0cGx1cyc7XG4gIGFwcGx5KHg6IFRlbnNvcik6IFRlbnNvciB7XG4gICAgcmV0dXJuIHRmYy5zb2Z0cGx1cyh4KTtcbiAgfVxufVxuc2VyaWFsaXphdGlvbi5yZWdpc3RlckNsYXNzKFNvZnRwbHVzKTtcblxuLyoqXG4gKiBTb2Z0c2lnbiBhY3RpdmF0aW9uIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgY2xhc3MgU29mdHNpZ24gZXh0ZW5kcyBBY3RpdmF0aW9uIHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyByZWFkb25seSBjbGFzc05hbWUgPSAnc29mdHNpZ24nO1xuICBhcHBseSh4OiBUZW5zb3IpOiBUZW5zb3Ige1xuICAgIHJldHVybiBLLnNvZnRzaWduKHgpO1xuICB9XG59XG5zZXJpYWxpemF0aW9uLnJlZ2lzdGVyQ2xhc3MoU29mdHNpZ24pO1xuXG4vKipcbiAqIEh5cGVyYm9saWMgdGFuZ2VudCBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIFRhbmggZXh0ZW5kcyBBY3RpdmF0aW9uIHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyByZWFkb25seSBjbGFzc05hbWUgPSAndGFuaCc7XG4gIGFwcGx5KHg6IFRlbnNvcik6IFRlbnNvciB7XG4gICAgcmV0dXJuIHRmYy50YW5oKHgpO1xuICB9XG59XG5zZXJpYWxpemF0aW9uLnJlZ2lzdGVyQ2xhc3MoVGFuaCk7XG5cbi8qKlxuICogU29mdG1heCBhY3RpdmF0aW9uIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBTb2Z0bWF4IGV4dGVuZHMgQWN0aXZhdGlvbiB7XG4gIC8qKiBAbm9jb2xsYXBzZSAqL1xuICBzdGF0aWMgcmVhZG9ubHkgY2xhc3NOYW1lID0gJ3NvZnRtYXgnO1xuICAvKipcbiAgICogQ2FsY3VsYXRlIHRoZSBhY3RpdmF0aW9uIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0geCBUZW5zb3IuXG4gICAqIEBwYXJhbSBheGlzIEludGVnZXIsIGF4aXMgYWxvbmcgd2hpY2ggdGhlIHNvZnRtYXggbm9ybWFsaXphdGlvbiBpcyBhcHBsaWVkLlxuICAgKiBJbnZhbGlkIGlmIDwgMiwgYXMgc29mdG1heCBhY3Jvc3MgMSAodGhlIGJhdGNoIGRpbWVuc2lvbikgaXMgYXNzdW1lZCB0byBiZVxuICAgKiBhbiBlcnJvci5cbiAgICpcbiAgICogQHJldHVybnMgYSBUZW5zb3Igb2YgdGhlIHNhbWUgc2hhcGUgYXMgeFxuICAgKlxuICAgKiBAdGhyb3dzIFZhbHVlRXJyb3I6IEluIGNhc2UgYGRpbSh4KSA8IDJgLlxuICAgKi9cbiAgYXBwbHkoeDogVGVuc29yLCBheGlzOiBudW1iZXIgPSAoLTEpKTogVGVuc29yIHtcbiAgICByZXR1cm4gdGZjLnNvZnRtYXgoeCwgYXhpcyk7XG4gIH1cbn1cbnNlcmlhbGl6YXRpb24ucmVnaXN0ZXJDbGFzcyhTb2Z0bWF4KTtcblxuLyoqXG4gKiBMb2cgc29mdG1heCBhY3RpdmF0aW9uIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2dTb2Z0bWF4IGV4dGVuZHMgQWN0aXZhdGlvbiB7XG4gIC8qKiBAbm9jb2xsYXBzZSAqL1xuICBzdGF0aWMgcmVhZG9ubHkgY2xhc3NOYW1lID0gJ2xvZ1NvZnRtYXgnO1xuICAvKipcbiAgICogQ2FsY3VsYXRlIHRoZSBhY3RpdmF0aW9uIGZ1bmN0aW9uIG9mIGxvZyBzb2Z0bWF4OlxuICAgKiBsb2coIGV4cCh4X2kpIC8gc3VtKGV4cCh4KSkgKVxuICAgKlxuICAgKiBAcGFyYW0geCBUZW5zb3IuXG4gICAqIEBwYXJhbSBheGlzIEludGVnZXIsIGF4aXMgYWxvbmcgd2hpY2ggdGhlIHNvZnRtYXggbm9ybWFsaXphdGlvbiBpcyBhcHBsaWVkLlxuICAgKiBJbnZhbGlkIGlmIDwgMiwgYXMgc29mdG1heCBhY3Jvc3MgMSAodGhlIGJhdGNoIGRpbWVuc2lvbikgaXMgYXNzdW1lZCB0byBiZVxuICAgKiBhbiBlcnJvci5cbiAgICpcbiAgICogQHJldHVybnMgYSBUZW5zb3Igb2YgdGhlIHNhbWUgc2hhcGUgYXMgeFxuICAgKlxuICAgKiBAdGhyb3dzIFZhbHVlRXJyb3I6IEluIGNhc2UgYGRpbSh4KSA8IDJgLlxuICAgKi9cbiAgYXBwbHkoeDogVGVuc29yLCBheGlzOiBudW1iZXIgPSAoLTEpKTogVGVuc29yIHtcbiAgICByZXR1cm4gdGZjLmxvZ1NvZnRtYXgoeCwgYXhpcyk7XG4gIH1cbn1cbnNlcmlhbGl6YXRpb24ucmVnaXN0ZXJDbGFzcyhMb2dTb2Z0bWF4KTtcblxuLyoqXG4gKiBTd2lzaCBhY3RpdmF0aW9uIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBTd2lzaCBleHRlbmRzIEFjdGl2YXRpb24ge1xuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIHJlYWRvbmx5IGNsYXNzTmFtZSA9ICdzd2lzaCc7XG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgdGhlIGFjdGl2YXRpb24gZnVuY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB4IFRlbnNvci5cbiAgICogQHBhcmFtIGFscGhhIFNjYWxpbmcgZmFjdG9yIGZvciB0aGUgc2lnbW9pZCBmdW5jdGlvbi5cbiAgICogQHJldHVybnMgYSBUZW5zb3Igb2YgdGhlIHNhbWUgc2hhcGUgYXMgeFxuICAgKi9cbiAgYXBwbHkoeDogVGVuc29yLCBhbHBoYSA9IDEpOiBUZW5zb3Ige1xuICAgIHJldHVybiB0aWR5KCgpID0+IHRmYy5tdWwodGZjLnNpZ21vaWQodGZjLm11bCh4LCBhbHBoYSkpLCB4KSk7XG4gIH1cbn1cbnNlcmlhbGl6YXRpb24ucmVnaXN0ZXJDbGFzcyhTd2lzaCk7XG5cbi8qKlxuICogTWlzaCBhY3RpdmF0aW9uIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBNaXNoIGV4dGVuZHMgQWN0aXZhdGlvbiB7XG4gIC8qKiBAbm9jb2xsYXBzZSAqL1xuICBzdGF0aWMgcmVhZG9ubHkgY2xhc3NOYW1lID0gJ21pc2gnO1xuICAvKipcbiAgICogQ2FsY3VsYXRlIHRoZSBhY3RpdmF0aW9uIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0geCBUZW5zb3IuXG4gICAqIEByZXR1cm5zIGEgVGVuc29yIG9mIHRoZSBzYW1lIHNoYXBlIGFzIHhcbiAgICovXG4gIGFwcGx5KHg6IFRlbnNvcik6IFRlbnNvciB7XG4gICAgcmV0dXJuIHRpZHkoKCkgPT4gdGZjLm11bCh4LCB0ZmMudGFuaCh0ZmMuc29mdHBsdXMoeCkpKSk7XG4gIH1cbn1cbnNlcmlhbGl6YXRpb24ucmVnaXN0ZXJDbGFzcyhNaXNoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZUFjdGl2YXRpb24oYWN0aXZhdGlvbjogQWN0aXZhdGlvbik6IHN0cmluZyB7XG4gIHJldHVybiBhY3RpdmF0aW9uLmdldENsYXNzTmFtZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVzZXJpYWxpemVBY3RpdmF0aW9uKFxuICAgIGNvbmZpZzogc2VyaWFsaXphdGlvbi5Db25maWdEaWN0LFxuICAgIGN1c3RvbU9iamVjdHM6IHNlcmlhbGl6YXRpb24uQ29uZmlnRGljdCA9IHt9KTogQWN0aXZhdGlvbiB7XG4gIHJldHVybiBkZXNlcmlhbGl6ZUtlcmFzT2JqZWN0KFxuICAgICAgY29uZmlnLCBzZXJpYWxpemF0aW9uLlNlcmlhbGl6YXRpb25NYXAuZ2V0TWFwKCkuY2xhc3NOYW1lTWFwLFxuICAgICAgY3VzdG9tT2JqZWN0cywgJ2FjdGl2YXRpb24nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdGl2YXRpb24oaWRlbnRpZmllcjogQWN0aXZhdGlvbklkZW50aWZpZXJ8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpYWxpemF0aW9uLkNvbmZpZ0RpY3R8QWN0aXZhdGlvbik6IEFjdGl2YXRpb24ge1xuICBpZiAoaWRlbnRpZmllciA9PSBudWxsKSB7XG4gICAgY29uc3QgY29uZmlnOiBzZXJpYWxpemF0aW9uLkNvbmZpZ0RpY3QgPSB7fTtcbiAgICBjb25maWdbJ2NsYXNzTmFtZSddID0gJ2xpbmVhcic7XG4gICAgY29uZmlnWydjb25maWcnXSA9IHt9O1xuICAgIHJldHVybiBkZXNlcmlhbGl6ZUFjdGl2YXRpb24oY29uZmlnKTtcbiAgfVxuICBpZiAodHlwZW9mIGlkZW50aWZpZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc3QgY29uZmlnOiBzZXJpYWxpemF0aW9uLkNvbmZpZ0RpY3QgPSB7fTtcbiAgICBjb25maWdbJ2NsYXNzTmFtZSddID0gaWRlbnRpZmllcjtcbiAgICBjb25maWdbJ2NvbmZpZyddID0ge307XG4gICAgcmV0dXJuIGRlc2VyaWFsaXplQWN0aXZhdGlvbihjb25maWcpO1xuICB9IGVsc2UgaWYgKGlkZW50aWZpZXIgaW5zdGFuY2VvZiBBY3RpdmF0aW9uKSB7XG4gICAgcmV0dXJuIGlkZW50aWZpZXI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGRlc2VyaWFsaXplQWN0aXZhdGlvbihpZGVudGlmaWVyKTtcbiAgfVxufVxuIl19