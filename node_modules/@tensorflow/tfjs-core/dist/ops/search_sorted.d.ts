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
/// <amd-module name="@tensorflow/tfjs-core/dist/ops/search_sorted" />
import { Tensor } from '../tensor';
import { TensorLike } from '../types';
/**
 * Searches for where a value would go in a sorted sequence.
 *
 * This is not a method for checking containment (like javascript in).
 *
 * The typical use case for this operation is "binning", "bucketing", or
 * "discretizing". The values are assigned to bucket-indices based on the edges
 * listed in 'sortedSequence'. This operation returns the bucket-index for each
 * value.
 *
 * The side argument controls which index is returned if a value lands exactly
 * on an edge.
 *
 * The axis is not settable for this operation. It always operates on the
 * innermost dimension (axis=-1). The operation will accept any number of outer
 * dimensions.
 *
 * Note: This operation assumes that 'sortedSequence' is sorted along the
 * innermost axis, maybe using 'sort(..., axis=-1)'. If the sequence is not
 * sorted no error is raised and the content of the returned tensor is not well
 * defined.
 *
 * ```js
 * const edges = tf.tensor1d([-1, 3.3, 9.1, 10.0]);
 * let values = tf.tensor1d([0.0, 4.1, 12.0]);
 * const result1 = tf.searchSorted(edges, values, 'left');
 * result1.print(); // [1, 2, 4]
 *
 * const seq = tf.tensor1d([0, 3, 9, 10, 10]);
 * values = tf.tensor1d([0, 4, 10]);
 * const result2 = tf.searchSorted(seq, values, 'left');
 * result2.print(); // [0, 2, 3]
 * const result3 = tf.searchSorted(seq, values, 'right');
 * result3.print(); // [1, 2, 5]
 *
 * const sortedSequence = tf.tensor2d([[0., 3., 8., 9., 10.],
 *                                     [1., 2., 3., 4., 5.]]);
 * values = tf.tensor2d([[9.8, 2.1, 4.3],
 *                       [0.1, 6.6, 4.5, ]]);
 * const result4 = tf.searchSorted(sortedSequence, values, 'left');
 * result4.print(); // [[4, 1, 2], [0, 5, 4]]
 * ```
 * @param sortedSequence: N-D. Sorted sequence.
 * @param values: N-D. Search values.
 * @param side: 'left'|'right'. Defaults to 'left'. 'left' corresponds to lower
 *     bound and 'right' to upper bound.
 * @return An N-D int32 tensor the size of values containing the result of
 *     applying either lower bound or upper bound (depending on side) to each
 *     value. The result is not a global index to the entire Tensor, but the
 *     index in the last dimension.
 * @doc {heading: 'Operations', subheading: 'Evaluation'}
 */
declare function searchSorted_(sortedSequence: Tensor | TensorLike, values: Tensor | TensorLike, side?: 'left' | 'right'): Tensor;
export declare const searchSorted: typeof searchSorted_;
export {};
