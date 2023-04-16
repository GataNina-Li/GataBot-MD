/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
/// <amd-module name="@tensorflow/tfjs-backend-webgl/dist/shader_compiler" />
export declare type ShapeInfo = {
    logicalShape: number[];
    texShape: [number, number];
    isUniform: boolean;
    isPacked: boolean;
    flatOffset: number;
};
export declare type InputInfo = {
    name: string;
    shapeInfo: ShapeInfo;
};
export declare type UniformType = 'float' | 'vec2' | 'vec3' | 'vec4' | 'int' | 'ivec2' | 'ivec3' | 'ivec4';
interface ProgramParams {
    userCode: string;
    enableShapeUniforms?: boolean;
    packedInputs?: boolean;
    customUniforms?: Array<{
        name: string;
        arrayIndex?: number;
        type: UniformType;
    }>;
}
export declare function makeShader(inputsInfo: InputInfo[], outputShape: ShapeInfo, program: ProgramParams): string;
export declare function getCoordsDataType(rank: number): string;
export declare function getUniformInfoFromShape(isPacked: boolean, shape: number[], texShape: number[]): {
    useSqueezeShape: boolean;
    uniformShape: number[];
    keptDims: number[];
};
/** Returns a new input info (a copy) that has a squeezed logical shape. */
export declare function squeezeInputInfo(inInfo: InputInfo, squeezedShape: number[]): InputInfo;
export {};
