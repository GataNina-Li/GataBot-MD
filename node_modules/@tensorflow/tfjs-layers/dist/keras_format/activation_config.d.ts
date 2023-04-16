/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
/// <amd-module name="@tensorflow/tfjs-layers/dist/keras_format/activation_config" />
/**
 * List of all known activation names.
 */
export declare const activationOptions: ("linear" | "relu" | "elu" | "relu6" | "sigmoid" | "hard_sigmoid" | "selu" | "softmax" | "softplus" | "softsign" | "tanh" | "swish" | "mish")[];
/**
 * A type representing the strings that are valid loss names.
 */
export declare type ActivationSerialization = typeof activationOptions[number];
/** @docinline */
export declare type ActivationIdentifier = 'elu' | 'hardSigmoid' | 'linear' | 'relu' | 'relu6' | 'selu' | 'sigmoid' | 'softmax' | 'softplus' | 'softsign' | 'tanh' | 'swish' | 'mish';
