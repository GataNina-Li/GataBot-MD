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
/// <amd-module name="@tensorflow/tfjs-core/dist/ops/sparse/sparse_segment_mean" />
import { Tensor, Tensor1D } from '../../tensor';
import { TensorLike } from '../../types';
/**
 * Computes the mean along sparse segments of a tensor.
 *
 * ```js
 * const c = tf.tensor2d([[1,2,3,4], [-1,-2,-3,-4], [6,7,8,9]]);
 * // Select two rows, one segment.
 * const result1 = tf.sparse.sparseSegmentMean(c,
 *                                           tf.tensor1d([0, 1], 'int32'),
 *                                           tf.tensor1d([0, 0], 'int32'));
 * result1.print(); // [[0, 0, 0, 0]]
 *
 * // Select two rows, two segments.
 * const result2 = tf.sparse.sparseSegmentMean(c,
 *                                             tf.tensor1d([0, 1], 'int32'),
 *                                             tf.tensor1d([0, 1], 'int32'));
 * result2.print(); // [[1, 2, 3, 4], [-1, -2, -3, -4]]
 *
 * // Select all rows, two segments.
 * const result3 = tf.sparse.sparseSegmentMean(c,
 *                                             tf.tensor1d([0, 1, 2], 'int32'),
 *                                             tf.tensor1d([0, 1, 1], 'int32'));
 * result3.print(); // [[1.0, 2.0, 3.0, 4.0], [2.5, 2.5, 2.5, 2.5]]
 * ```
 * @param data: A Tensor of at least one dimension with data that will be
 *     assembled in the output.
 * @param indices: A 1-D Tensor with indices into data. Has same rank as
 *     segmentIds.
 * @param segmentIds: A 1-D Tensor with indices into the output Tensor. Values
 *     should be sorted and can be repeated.
 * @return Has same shape as data, except for dimension 0 which has equal to
 *         the number of segments.
 *
 * @doc {heading: 'Operations', subheading: 'Sparse'}
 */
declare function sparseSegmentMean_(data: Tensor | TensorLike, indices: Tensor1D | TensorLike, segmentIds: Tensor1D | TensorLike): Tensor;
export declare const sparseSegmentMean: typeof sparseSegmentMean_;
export {};
