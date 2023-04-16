/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
/// <amd-module name="@tensorflow/tfjs-backend-webgl/dist/slice_packed_gpu" />
import { GPGPUProgram } from './gpgpu_math';
import { UniformType } from './shader_compiler';
export declare class SlicePackedProgram implements GPGPUProgram {
    variableNames: string[];
    packedInputs: boolean;
    packedOutput: boolean;
    outputShape: number[];
    userCode: string;
    rank: number;
    customUniforms: Array<{
        name: string;
        arrayIndex: number;
        type: UniformType;
    }>;
    constructor(destSize: number[]);
}
