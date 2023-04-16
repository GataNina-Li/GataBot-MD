/// <amd-module name="@tensorflow/tfjs-backend-webgl/dist/top_k_gpu" />
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
import { GPGPUProgram } from './gpgpu_math';
import { UniformType } from './shader_compiler';
export declare class SwapProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    customUniforms: {
        name: string;
        type: UniformType;
    }[];
    /**
     * @param shape desired output shape (can be larger than input shape, output
     *                                    will be padded with -Infinity)
     */
    constructor(shape: number[]);
}
export declare class MergeProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    customUniforms: {
        name: string;
        type: UniformType;
    }[];
    /**
     * @param shape desired output shape (must be half of the input size)
     */
    constructor(shape: number[]);
}
