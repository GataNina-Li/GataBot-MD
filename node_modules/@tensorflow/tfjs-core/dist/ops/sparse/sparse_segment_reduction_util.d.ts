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
/// <amd-module name="@tensorflow/tfjs-core/dist/ops/sparse/sparse_segment_reduction_util" />
/**
 * Generates sparse segment reduction negative segment ids error message.
 *
 */
export declare function getSparseSegmentReductionNegativeSegmentIdsErrorMessage(): string;
/**
 * Generates sparse segment reduction non increasing segment ids error message.
 *
 */
export declare function getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage(): string;
/**
 * Generates sparse segment reduction segment id out of range error message.
 *
 * @param segmentId The segment id index that is out of range.
 * @param outputRows Upper bound of valid segment id values.
 */
export declare function getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage(segmentId: number, outputRows: number): string;
/**
 * Generates sparse segment reduction input indice out of range error message.
 *
 * @param index The index that holds the out of range value.
 * @param indexValue The value that is out of range.
 * @param inputRows Upper bound of valid index values.
 */
export declare function getSparseSegmentReductionIndicesOutOfRangeErrorMessage(index: number, indexValue: number, inputRows: number): string;
