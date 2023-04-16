/// <amd-module name="@tensorflow/tfjs-backend-cpu/dist/kernels/Scatter_impl" />
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
import { Rank, TensorBuffer } from '@tensorflow/tfjs-core';
interface DefaultValueTypeMap {
    bool: boolean;
    int32: number;
    float32: number;
    string: string;
}
export declare function scatterImpl<R extends Rank, D extends 'float32' | 'int32' | 'bool' | 'string'>(indices: TensorBuffer<R, 'int32'>, updates: TensorBuffer<R, D>, shape: number[], outputSize: number, sliceSize: number, numUpdates: number, sliceRank: number, strides: number[], defaultValue: DefaultValueTypeMap[D], sumDupeIndices: boolean): TensorBuffer<R, D>;
export {};
