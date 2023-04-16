/**
 * @license
 * Copyright 2022 CodeSmith LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
/// <amd-module name="@tensorflow/tfjs-layers/dist/layers/preprocessing/image_preprocessing" />
import { LayerArgs, Layer } from '../../engine/topology';
import { serialization, Tensor } from '@tensorflow/tfjs-core';
import { Kwargs } from '../../types';
export declare interface RescalingArgs extends LayerArgs {
    scale: number;
    offset?: number;
}
/**
 * Preprocessing Rescaling Layer
 *
 * This rescales images by a scaling and offset factor
 */
export declare class Rescaling extends Layer {
    /** @nocollapse */
    static className: string;
    private readonly scale;
    private readonly offset;
    constructor(args: RescalingArgs);
    getConfig(): serialization.ConfigDict;
    call(inputs: Tensor | Tensor[], kwargs: Kwargs): Tensor[] | Tensor;
}
