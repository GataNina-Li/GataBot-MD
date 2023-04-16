/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
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
/// <amd-module name="@tensorflow/tfjs-core/dist/ops/ragged_to_dense_util" />
export declare enum RowPartitionType {
    FIRST_DIM_SIZE = 0,
    VALUE_ROWIDS = 1,
    ROW_LENGTHS = 2,
    ROW_SPLITS = 3,
    ROW_LIMITS = 4,
    ROW_STARTS = 5
}
export declare function combineRaggedTensorToTensorShapes(raggedRank: number, shape: number[], valueShape: number[]): number[];
export declare function getRowPartitionTypesHelper(rowPartitionTypeStrings: string[]): RowPartitionType[];
export declare function getRaggedRank(rowPartitionTypes: RowPartitionType[]): number;
export declare function validateDefaultValueShape(defaultValueShape: number[], valueShape: number[]): void;
