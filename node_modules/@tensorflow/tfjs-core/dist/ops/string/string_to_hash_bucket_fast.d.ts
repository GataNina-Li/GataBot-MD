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
/// <amd-module name="@tensorflow/tfjs-core/dist/ops/string/string_to_hash_bucket_fast" />
import { Tensor } from '../../tensor';
import { TensorLike } from '../../types';
/**
 * Converts each string in the input Tensor to its hash mod by a number of
 * buckets.
 *
 * The hash function is deterministic on the content of the string within the
 * process and will never change. However, it is not suitable for cryptography.
 * This function may be used when CPU time is scarce and inputs are trusted or
 * unimportant. There is a risk of adversaries constructing inputs that all hash
 * to the same bucket.
 *
 * ```js
 * const result = tf.string.stringToHashBucketFast(
 *   ['Hello', 'TensorFlow', '2.x'], 3);
 * result.print(); // [0, 2, 2]
 * ```
 * @param input: The strings to assign a hash bucket.
 * @param numBuckets: The number of buckets.
 * @return A Tensor of the same shape as the input tensor.
 *
 * @doc {heading: 'Operations', subheading: 'String'}
 */
declare function stringToHashBucketFast_(input: Tensor | TensorLike, numBuckets: number): Tensor;
export declare const stringToHashBucketFast: typeof stringToHashBucketFast_;
export {};
