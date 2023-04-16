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
/// <amd-module name="@tensorflow/tfjs-core/dist/ops/image/grayscale_to_rgb" />
import { Tensor2D, Tensor3D, Tensor4D, Tensor5D, Tensor6D } from '../../tensor';
import { TensorLike } from '../../types';
/**
 * Converts images from grayscale to RGB format.
 *
 * @param image A grayscale tensor to convert. The `image`'s last dimension must
 *     be size 1 with at least a two-dimensional shape.
 *
 * @doc {heading: 'Operations', subheading: 'Images', namespace: 'image'}
 */
declare function grayscaleToRGB_<T extends Tensor2D | Tensor3D | Tensor4D | Tensor5D | Tensor6D>(image: T | TensorLike): T;
export declare const grayscaleToRGB: typeof grayscaleToRGB_;
export {};
