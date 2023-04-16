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
import { ENGINE } from '../../engine';
import { customGrad } from '../../gradients';
import { FusedDepthwiseConv2D } from '../../kernel_names';
import { makeTypesMatch } from '../../tensor_util';
import { convertToTensor } from '../../tensor_util_env';
import * as util from '../../util';
import { add } from '../add';
import * as broadcast_util from '../broadcast_util';
import * as conv_util from '../conv_util';
import { depthwiseConv2d as unfusedDepthwiseConv2d } from '../depthwise_conv2d';
import { depthwiseConv2dNativeBackpropFilter } from '../depthwise_conv2d_native_backprop_filter';
import { depthwiseConv2dNativeBackpropInput } from '../depthwise_conv2d_native_backprop_input';
import { applyActivation, getFusedBiasGradient, getFusedDyActivation, shouldFuse } from '../fused_util';
import { op } from '../operation';
import { reshape } from '../reshape';
/**
 * Computes depthwise 2D convolution, optionally fused with adding a
 * bias and applying an activation.
 *
 * Given a 4D `input` array and a `filter` array of shape
 * `[filterHeight, filterWidth, inChannels, channelMultiplier]` containing
 * `inChannels` convolutional filters of depth 1, this op applies a
 * different filter to each input channel (expanding from 1 channel to
 * `channelMultiplier` channels for each), then concatenates the results
 * together. The output has `inChannels * channelMultiplier` channels.
 *
 * See
 * [https://www.tensorflow.org/api_docs/python/tf/nn/depthwise_conv2d](
 *     https://www.tensorflow.org/api_docs/python/tf/nn/depthwise_conv2d)
 * for more details.
 *
 * @param obj An object with the following properties:
 * @param x The input tensor, of rank 4 or rank 3, of shape
 *     `[batch, height, width, inChannels]`. If rank 3, batch of 1 is
 * assumed.
 * @param filter The filter tensor, rank 4, of shape
 *     `[filterHeight, filterWidth, inChannels, channelMultiplier]`.
 * @param strides The strides of the convolution: `[strideHeight,
 * strideWidth]`. If strides is a single number, then `strideHeight ==
 * strideWidth`.
 * @param pad The type of padding algorithm.
 *   - `same` and stride 1: output will be of same size as input,
 *       regardless of filter size.
 *   - `valid`: output will be smaller than input if filter is larger
 *       than 1x1.
 *   - For more info, see this guide:
 *     [https://www.tensorflow.org/api_docs/python/tf/nn/convolution](
 *          https://www.tensorflow.org/api_docs/python/tf/nn/convolution)
 * @param dilations The dilation rates: `[dilationHeight, dilationWidth]`
 *     in which we sample input values across the height and width dimensions
 *     in atrous convolution. Defaults to `[1, 1]`. If `rate` is a single
 *     number, then `dilationHeight == dilationWidth`. If it is greater than
 *     1, then all values of `strides` must be 1.
 * @param dataFormat: An optional string from: "NHWC", "NCHW". Defaults to
 *     "NHWC". Specify the data format of the input and output data. With the
 *     default format "NHWC", the data is stored in the order of: [batch,
 *     height, width, channels]. Only "NHWC" is currently supported.
 * @param dimRoundingMode A string from: 'ceil', 'round', 'floor'. If none is
 *     provided, it will default to truncate.
 * @param bias Tensor to be added to the result.
 * @param activation Name of activation kernel (defaults to `linear`).
 * @param preluActivationWeights Tensor of prelu weights to be applied as part
 *     of a `prelu` activation, typically the same shape as `x`.
 * @param leakyreluAlpha Optional. Alpha to be applied as part of a `leakyrelu`
 *     activation.
 */
function fusedDepthwiseConv2d_({ x, filter, strides, pad, dataFormat = 'NHWC', dilations = [1, 1], dimRoundingMode, bias, activation = 'linear', preluActivationWeights, leakyreluAlpha }) {
    if (shouldFuse(ENGINE.state.gradientDepth, activation) === false) {
        let result = unfusedDepthwiseConv2d(x, filter, strides, pad, dataFormat, dilations, dimRoundingMode);
        if (bias != null) {
            result = add(result, bias);
        }
        return applyActivation(result, activation, preluActivationWeights, leakyreluAlpha);
    }
    const $x = convertToTensor(x, 'x', 'depthwiseConv2d', 'float32');
    const $filter = convertToTensor(filter, 'filter', 'depthwiseConv2d', 'float32');
    let x4D = $x;
    let reshapedTo4D = false;
    if ($x.rank === 3) {
        reshapedTo4D = true;
        x4D = reshape($x, [1, $x.shape[0], $x.shape[1], $x.shape[2]]);
    }
    util.assert(x4D.rank === 4, () => `Error in fused depthwiseConv2d: input must be rank 4, but got ` +
        `rank ${x4D.rank}.`);
    util.assert($filter.rank === 4, () => `Error in fused depthwiseConv2d: filter must be rank 4, ` +
        `but got rank ${$filter.rank}.`);
    util.assert(x4D.shape[3] === $filter.shape[2], () => `Error in fused depthwiseConv2d: number of input channels ` +
        `(${x4D.shape[3]}) must match the inChannels dimension in ` +
        `filter ${$filter.shape[2]}.`);
    if (dilations == null) {
        dilations = [1, 1];
    }
    util.assert(conv_util.eitherStridesOrDilationsAreOne(strides, dilations), () => 'Error in fused depthwiseConv2d: Either strides or dilations must ' +
        `be 1. Got strides ${strides} and dilations '${dilations}'`);
    conv_util.checkPadOnDimRoundingMode('fused depthwiseConv2d', pad, dimRoundingMode);
    const convInfo = conv_util.computeConv2DInfo(x4D.shape, $filter.shape, strides, dilations, pad, dimRoundingMode, true /* depthwise */);
    let $bias;
    if (bias != null) {
        $bias = convertToTensor(bias, 'bias', 'fused conv2d');
        [$bias] = makeTypesMatch($bias, $x);
        broadcast_util.assertAndGetBroadcastShape(convInfo.outShape, $bias.shape);
    }
    let $preluActivationWeights;
    if (preluActivationWeights != null) {
        $preluActivationWeights = convertToTensor(preluActivationWeights, 'prelu weights', 'fused depthwiseConv2d');
    }
    const grad = (dy, saved) => {
        util.assert(conv_util.tupleValuesAreOne(dilations), () => 'Error in gradient of fused depthwiseConv2d: dilation rates ' +
            `greater than 1 are not yet supported. Got dilations ` +
            `'${dilations}'`);
        const [$filter, x4D, y, bias] = saved;
        const dyActivation = getFusedDyActivation(dy, y, activation);
        const xDer = depthwiseConv2dNativeBackpropInput(x4D.shape, dyActivation, $filter, strides, pad, dilations, dimRoundingMode);
        const filterDer = depthwiseConv2dNativeBackpropFilter(x4D, dyActivation, $filter.shape, strides, pad, dilations, dimRoundingMode);
        if (bias != null) {
            const biasDer = getFusedBiasGradient($bias, dyActivation);
            return [xDer, filterDer, biasDer];
        }
        return [xDer, filterDer];
    };
    const inputs = {
        x: x4D,
        filter: $filter,
        bias: $bias,
        preluActivationWeights: $preluActivationWeights
    };
    const attrs = {
        strides,
        pad,
        dataFormat,
        dilations,
        dimRoundingMode,
        activation,
        leakyreluAlpha
    };
    // Depending on the the params passed in we will have different number of
    // inputs and thus a a different number of elements in the gradient.
    if (bias == null) {
        const customOp = customGrad((x4D, filter, save) => {
            // tslint:disable-next-line: no-unnecessary-type-assertion
            let res = ENGINE.runKernel(FusedDepthwiseConv2D, inputs, attrs);
            save([filter, x4D, res]);
            if (reshapedTo4D) {
                // tslint:disable-next-line: no-unnecessary-type-assertion
                res = reshape(res, [res.shape[1], res.shape[2], res.shape[3]]);
            }
            return { value: res, gradFunc: grad };
        });
        return customOp(x4D, $filter);
    }
    else {
        const customOpWithBias = customGrad((x4D, filter, bias, save) => {
            // tslint:disable-next-line: no-unnecessary-type-assertion
            let res = ENGINE.runKernel(FusedDepthwiseConv2D, inputs, attrs);
            save([filter, x4D, res, bias]);
            if (reshapedTo4D) {
                // tslint:disable-next-line: no-unnecessary-type-assertion
                res = reshape(res, [res.shape[1], res.shape[2], res.shape[3]]);
            }
            return { value: res, gradFunc: grad };
        });
        return customOpWithBias(x4D, $filter, $bias);
    }
}
export const depthwiseConv2d = op({ fusedDepthwiseConv2d_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwdGh3aXNlX2NvbnYyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2Z1c2VkL2RlcHRod2lzZV9jb252MmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUNwQyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFDLG9CQUFvQixFQUF3RCxNQUFNLG9CQUFvQixDQUFDO0FBSS9HLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFdEQsT0FBTyxLQUFLLElBQUksTUFBTSxZQUFZLENBQUM7QUFDbkMsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUMzQixPQUFPLEtBQUssY0FBYyxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8sS0FBSyxTQUFTLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxlQUFlLElBQUksc0JBQXNCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUM5RSxPQUFPLEVBQUMsbUNBQW1DLEVBQUMsTUFBTSw0Q0FBNEMsQ0FBQztBQUMvRixPQUFPLEVBQUMsa0NBQWtDLEVBQUMsTUFBTSwyQ0FBMkMsQ0FBQztBQUU3RixPQUFPLEVBQUMsZUFBZSxFQUFFLG9CQUFvQixFQUFFLG9CQUFvQixFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN0RyxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ2hDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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O0FBQ0QsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQyxFQUFDLHFCQUFxQixFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uLy4uL2VuZ2luZSc7XG5pbXBvcnQge2N1c3RvbUdyYWR9IGZyb20gJy4uLy4uL2dyYWRpZW50cyc7XG5pbXBvcnQge0Z1c2VkRGVwdGh3aXNlQ29udjJELCBGdXNlZERlcHRod2lzZUNvbnYyREF0dHJzLCBGdXNlZERlcHRod2lzZUNvbnYyRElucHV0c30gZnJvbSAnLi4vLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7TmFtZWRBdHRyTWFwfSBmcm9tICcuLi8uLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtUZW5zb3IsIFRlbnNvcjNELCBUZW5zb3I0RH0gZnJvbSAnLi4vLi4vdGVuc29yJztcbmltcG9ydCB7R3JhZFNhdmVGdW5jLCBOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7bWFrZVR5cGVzTWF0Y2h9IGZyb20gJy4uLy4uL3RlbnNvcl91dGlsJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi8uLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHthZGR9IGZyb20gJy4uL2FkZCc7XG5pbXBvcnQgKiBhcyBicm9hZGNhc3RfdXRpbCBmcm9tICcuLi9icm9hZGNhc3RfdXRpbCc7XG5pbXBvcnQgKiBhcyBjb252X3V0aWwgZnJvbSAnLi4vY29udl91dGlsJztcbmltcG9ydCB7ZGVwdGh3aXNlQ29udjJkIGFzIHVuZnVzZWREZXB0aHdpc2VDb252MmR9IGZyb20gJy4uL2RlcHRod2lzZV9jb252MmQnO1xuaW1wb3J0IHtkZXB0aHdpc2VDb252MmROYXRpdmVCYWNrcHJvcEZpbHRlcn0gZnJvbSAnLi4vZGVwdGh3aXNlX2NvbnYyZF9uYXRpdmVfYmFja3Byb3BfZmlsdGVyJztcbmltcG9ydCB7ZGVwdGh3aXNlQ29udjJkTmF0aXZlQmFja3Byb3BJbnB1dH0gZnJvbSAnLi4vZGVwdGh3aXNlX2NvbnYyZF9uYXRpdmVfYmFja3Byb3BfaW5wdXQnO1xuaW1wb3J0IHtBY3RpdmF0aW9ufSBmcm9tICcuLi9mdXNlZF90eXBlcyc7XG5pbXBvcnQge2FwcGx5QWN0aXZhdGlvbiwgZ2V0RnVzZWRCaWFzR3JhZGllbnQsIGdldEZ1c2VkRHlBY3RpdmF0aW9uLCBzaG91bGRGdXNlfSBmcm9tICcuLi9mdXNlZF91dGlsJztcbmltcG9ydCB7b3B9IGZyb20gJy4uL29wZXJhdGlvbic7XG5pbXBvcnQge3Jlc2hhcGV9IGZyb20gJy4uL3Jlc2hhcGUnO1xuXG4vKipcbiAqIENvbXB1dGVzIGRlcHRod2lzZSAyRCBjb252b2x1dGlvbiwgb3B0aW9uYWxseSBmdXNlZCB3aXRoIGFkZGluZyBhXG4gKiBiaWFzIGFuZCBhcHBseWluZyBhbiBhY3RpdmF0aW9uLlxuICpcbiAqIEdpdmVuIGEgNEQgYGlucHV0YCBhcnJheSBhbmQgYSBgZmlsdGVyYCBhcnJheSBvZiBzaGFwZVxuICogYFtmaWx0ZXJIZWlnaHQsIGZpbHRlcldpZHRoLCBpbkNoYW5uZWxzLCBjaGFubmVsTXVsdGlwbGllcl1gIGNvbnRhaW5pbmdcbiAqIGBpbkNoYW5uZWxzYCBjb252b2x1dGlvbmFsIGZpbHRlcnMgb2YgZGVwdGggMSwgdGhpcyBvcCBhcHBsaWVzIGFcbiAqIGRpZmZlcmVudCBmaWx0ZXIgdG8gZWFjaCBpbnB1dCBjaGFubmVsIChleHBhbmRpbmcgZnJvbSAxIGNoYW5uZWwgdG9cbiAqIGBjaGFubmVsTXVsdGlwbGllcmAgY2hhbm5lbHMgZm9yIGVhY2gpLCB0aGVuIGNvbmNhdGVuYXRlcyB0aGUgcmVzdWx0c1xuICogdG9nZXRoZXIuIFRoZSBvdXRwdXQgaGFzIGBpbkNoYW5uZWxzICogY2hhbm5lbE11bHRpcGxpZXJgIGNoYW5uZWxzLlxuICpcbiAqIFNlZVxuICogW2h0dHBzOi8vd3d3LnRlbnNvcmZsb3cub3JnL2FwaV9kb2NzL3B5dGhvbi90Zi9ubi9kZXB0aHdpc2VfY29udjJkXShcbiAqICAgICBodHRwczovL3d3dy50ZW5zb3JmbG93Lm9yZy9hcGlfZG9jcy9weXRob24vdGYvbm4vZGVwdGh3aXNlX2NvbnYyZClcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHBhcmFtIG9iaiBBbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKiBAcGFyYW0geCBUaGUgaW5wdXQgdGVuc29yLCBvZiByYW5rIDQgb3IgcmFuayAzLCBvZiBzaGFwZVxuICogICAgIGBbYmF0Y2gsIGhlaWdodCwgd2lkdGgsIGluQ2hhbm5lbHNdYC4gSWYgcmFuayAzLCBiYXRjaCBvZiAxIGlzXG4gKiBhc3N1bWVkLlxuICogQHBhcmFtIGZpbHRlciBUaGUgZmlsdGVyIHRlbnNvciwgcmFuayA0LCBvZiBzaGFwZVxuICogICAgIGBbZmlsdGVySGVpZ2h0LCBmaWx0ZXJXaWR0aCwgaW5DaGFubmVscywgY2hhbm5lbE11bHRpcGxpZXJdYC5cbiAqIEBwYXJhbSBzdHJpZGVzIFRoZSBzdHJpZGVzIG9mIHRoZSBjb252b2x1dGlvbjogYFtzdHJpZGVIZWlnaHQsXG4gKiBzdHJpZGVXaWR0aF1gLiBJZiBzdHJpZGVzIGlzIGEgc2luZ2xlIG51bWJlciwgdGhlbiBgc3RyaWRlSGVpZ2h0ID09XG4gKiBzdHJpZGVXaWR0aGAuXG4gKiBAcGFyYW0gcGFkIFRoZSB0eXBlIG9mIHBhZGRpbmcgYWxnb3JpdGhtLlxuICogICAtIGBzYW1lYCBhbmQgc3RyaWRlIDE6IG91dHB1dCB3aWxsIGJlIG9mIHNhbWUgc2l6ZSBhcyBpbnB1dCxcbiAqICAgICAgIHJlZ2FyZGxlc3Mgb2YgZmlsdGVyIHNpemUuXG4gKiAgIC0gYHZhbGlkYDogb3V0cHV0IHdpbGwgYmUgc21hbGxlciB0aGFuIGlucHV0IGlmIGZpbHRlciBpcyBsYXJnZXJcbiAqICAgICAgIHRoYW4gMXgxLlxuICogICAtIEZvciBtb3JlIGluZm8sIHNlZSB0aGlzIGd1aWRlOlxuICogICAgIFtodHRwczovL3d3dy50ZW5zb3JmbG93Lm9yZy9hcGlfZG9jcy9weXRob24vdGYvbm4vY29udm9sdXRpb25dKFxuICogICAgICAgICAgaHR0cHM6Ly93d3cudGVuc29yZmxvdy5vcmcvYXBpX2RvY3MvcHl0aG9uL3RmL25uL2NvbnZvbHV0aW9uKVxuICogQHBhcmFtIGRpbGF0aW9ucyBUaGUgZGlsYXRpb24gcmF0ZXM6IGBbZGlsYXRpb25IZWlnaHQsIGRpbGF0aW9uV2lkdGhdYFxuICogICAgIGluIHdoaWNoIHdlIHNhbXBsZSBpbnB1dCB2YWx1ZXMgYWNyb3NzIHRoZSBoZWlnaHQgYW5kIHdpZHRoIGRpbWVuc2lvbnNcbiAqICAgICBpbiBhdHJvdXMgY29udm9sdXRpb24uIERlZmF1bHRzIHRvIGBbMSwgMV1gLiBJZiBgcmF0ZWAgaXMgYSBzaW5nbGVcbiAqICAgICBudW1iZXIsIHRoZW4gYGRpbGF0aW9uSGVpZ2h0ID09IGRpbGF0aW9uV2lkdGhgLiBJZiBpdCBpcyBncmVhdGVyIHRoYW5cbiAqICAgICAxLCB0aGVuIGFsbCB2YWx1ZXMgb2YgYHN0cmlkZXNgIG11c3QgYmUgMS5cbiAqIEBwYXJhbSBkYXRhRm9ybWF0OiBBbiBvcHRpb25hbCBzdHJpbmcgZnJvbTogXCJOSFdDXCIsIFwiTkNIV1wiLiBEZWZhdWx0cyB0b1xuICogICAgIFwiTkhXQ1wiLiBTcGVjaWZ5IHRoZSBkYXRhIGZvcm1hdCBvZiB0aGUgaW5wdXQgYW5kIG91dHB1dCBkYXRhLiBXaXRoIHRoZVxuICogICAgIGRlZmF1bHQgZm9ybWF0IFwiTkhXQ1wiLCB0aGUgZGF0YSBpcyBzdG9yZWQgaW4gdGhlIG9yZGVyIG9mOiBbYmF0Y2gsXG4gKiAgICAgaGVpZ2h0LCB3aWR0aCwgY2hhbm5lbHNdLiBPbmx5IFwiTkhXQ1wiIGlzIGN1cnJlbnRseSBzdXBwb3J0ZWQuXG4gKiBAcGFyYW0gZGltUm91bmRpbmdNb2RlIEEgc3RyaW5nIGZyb206ICdjZWlsJywgJ3JvdW5kJywgJ2Zsb29yJy4gSWYgbm9uZSBpc1xuICogICAgIHByb3ZpZGVkLCBpdCB3aWxsIGRlZmF1bHQgdG8gdHJ1bmNhdGUuXG4gKiBAcGFyYW0gYmlhcyBUZW5zb3IgdG8gYmUgYWRkZWQgdG8gdGhlIHJlc3VsdC5cbiAqIEBwYXJhbSBhY3RpdmF0aW9uIE5hbWUgb2YgYWN0aXZhdGlvbiBrZXJuZWwgKGRlZmF1bHRzIHRvIGBsaW5lYXJgKS5cbiAqIEBwYXJhbSBwcmVsdUFjdGl2YXRpb25XZWlnaHRzIFRlbnNvciBvZiBwcmVsdSB3ZWlnaHRzIHRvIGJlIGFwcGxpZWQgYXMgcGFydFxuICogICAgIG9mIGEgYHByZWx1YCBhY3RpdmF0aW9uLCB0eXBpY2FsbHkgdGhlIHNhbWUgc2hhcGUgYXMgYHhgLlxuICogQHBhcmFtIGxlYWt5cmVsdUFscGhhIE9wdGlvbmFsLiBBbHBoYSB0byBiZSBhcHBsaWVkIGFzIHBhcnQgb2YgYSBgbGVha3lyZWx1YFxuICogICAgIGFjdGl2YXRpb24uXG4gKi9cbmZ1bmN0aW9uIGZ1c2VkRGVwdGh3aXNlQ29udjJkXzxUIGV4dGVuZHMgVGVuc29yM0R8VGVuc29yNEQ+KHtcbiAgeCxcbiAgZmlsdGVyLFxuICBzdHJpZGVzLFxuICBwYWQsXG4gIGRhdGFGb3JtYXQgPSAnTkhXQycsXG4gIGRpbGF0aW9ucyA9IFsxLCAxXSxcbiAgZGltUm91bmRpbmdNb2RlLFxuICBiaWFzLFxuICBhY3RpdmF0aW9uID0gJ2xpbmVhcicsXG4gIHByZWx1QWN0aXZhdGlvbldlaWdodHMsXG4gIGxlYWt5cmVsdUFscGhhXG59OiB7XG4gIHg6IFR8VGVuc29yTGlrZSxcbiAgZmlsdGVyOiBUZW5zb3I0RHxUZW5zb3JMaWtlLFxuICBzdHJpZGVzOiBbbnVtYmVyLCBudW1iZXJdfG51bWJlcixcbiAgcGFkOiAndmFsaWQnfCdzYW1lJ3xudW1iZXIsXG4gIGRhdGFGb3JtYXQ/OiAnTkhXQyd8J05DSFcnLFxuICBkaWxhdGlvbnM/OiBbbnVtYmVyLCBudW1iZXJdfG51bWJlcixcbiAgZGltUm91bmRpbmdNb2RlPzogJ2Zsb29yJ3wncm91bmQnfCdjZWlsJyxcbiAgYmlhcz86IFRlbnNvcnxUZW5zb3JMaWtlLFxuICBhY3RpdmF0aW9uPzogQWN0aXZhdGlvbixcbiAgcHJlbHVBY3RpdmF0aW9uV2VpZ2h0cz86IFRlbnNvcixcbiAgbGVha3lyZWx1QWxwaGE/OiBudW1iZXJcbn0pOiBUIHtcbiAgaWYgKHNob3VsZEZ1c2UoRU5HSU5FLnN0YXRlLmdyYWRpZW50RGVwdGgsIGFjdGl2YXRpb24pID09PSBmYWxzZSkge1xuICAgIGxldCByZXN1bHQgPSB1bmZ1c2VkRGVwdGh3aXNlQ29udjJkKFxuICAgICAgICB4LCBmaWx0ZXIsIHN0cmlkZXMsIHBhZCwgZGF0YUZvcm1hdCwgZGlsYXRpb25zLCBkaW1Sb3VuZGluZ01vZGUpO1xuICAgIGlmIChiaWFzICE9IG51bGwpIHtcbiAgICAgIHJlc3VsdCA9IGFkZChyZXN1bHQsIGJpYXMpO1xuICAgIH1cblxuICAgIHJldHVybiBhcHBseUFjdGl2YXRpb24oXG4gICAgICAgICAgICAgICByZXN1bHQsIGFjdGl2YXRpb24sIHByZWx1QWN0aXZhdGlvbldlaWdodHMsIGxlYWt5cmVsdUFscGhhKSBhcyBUO1xuICB9XG5cbiAgY29uc3QgJHggPSBjb252ZXJ0VG9UZW5zb3IoeCwgJ3gnLCAnZGVwdGh3aXNlQ29udjJkJywgJ2Zsb2F0MzInKTtcbiAgY29uc3QgJGZpbHRlciA9XG4gICAgICBjb252ZXJ0VG9UZW5zb3IoZmlsdGVyLCAnZmlsdGVyJywgJ2RlcHRod2lzZUNvbnYyZCcsICdmbG9hdDMyJyk7XG5cbiAgbGV0IHg0RCA9ICR4IGFzIFRlbnNvcjREO1xuICBsZXQgcmVzaGFwZWRUbzREID0gZmFsc2U7XG4gIGlmICgkeC5yYW5rID09PSAzKSB7XG4gICAgcmVzaGFwZWRUbzREID0gdHJ1ZTtcbiAgICB4NEQgPSByZXNoYXBlKCR4LCBbMSwgJHguc2hhcGVbMF0sICR4LnNoYXBlWzFdLCAkeC5zaGFwZVsyXV0pO1xuICB9XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgeDRELnJhbmsgPT09IDQsXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gZnVzZWQgZGVwdGh3aXNlQ29udjJkOiBpbnB1dCBtdXN0IGJlIHJhbmsgNCwgYnV0IGdvdCBgICtcbiAgICAgICAgICBgcmFuayAke3g0RC5yYW5rfS5gKTtcbiAgdXRpbC5hc3NlcnQoXG4gICAgICAkZmlsdGVyLnJhbmsgPT09IDQsXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gZnVzZWQgZGVwdGh3aXNlQ29udjJkOiBmaWx0ZXIgbXVzdCBiZSByYW5rIDQsIGAgK1xuICAgICAgICAgIGBidXQgZ290IHJhbmsgJHskZmlsdGVyLnJhbmt9LmApO1xuICB1dGlsLmFzc2VydChcbiAgICAgIHg0RC5zaGFwZVszXSA9PT0gJGZpbHRlci5zaGFwZVsyXSxcbiAgICAgICgpID0+IGBFcnJvciBpbiBmdXNlZCBkZXB0aHdpc2VDb252MmQ6IG51bWJlciBvZiBpbnB1dCBjaGFubmVscyBgICtcbiAgICAgICAgICBgKCR7eDRELnNoYXBlWzNdfSkgbXVzdCBtYXRjaCB0aGUgaW5DaGFubmVscyBkaW1lbnNpb24gaW4gYCArXG4gICAgICAgICAgYGZpbHRlciAkeyRmaWx0ZXIuc2hhcGVbMl19LmApO1xuICBpZiAoZGlsYXRpb25zID09IG51bGwpIHtcbiAgICBkaWxhdGlvbnMgPSBbMSwgMV07XG4gIH1cbiAgdXRpbC5hc3NlcnQoXG4gICAgICBjb252X3V0aWwuZWl0aGVyU3RyaWRlc09yRGlsYXRpb25zQXJlT25lKHN0cmlkZXMsIGRpbGF0aW9ucyksXG4gICAgICAoKSA9PlxuICAgICAgICAgICdFcnJvciBpbiBmdXNlZCBkZXB0aHdpc2VDb252MmQ6IEVpdGhlciBzdHJpZGVzIG9yIGRpbGF0aW9ucyBtdXN0ICcgK1xuICAgICAgICAgIGBiZSAxLiBHb3Qgc3RyaWRlcyAke3N0cmlkZXN9IGFuZCBkaWxhdGlvbnMgJyR7ZGlsYXRpb25zfSdgKTtcbiAgY29udl91dGlsLmNoZWNrUGFkT25EaW1Sb3VuZGluZ01vZGUoXG4gICAgICAnZnVzZWQgZGVwdGh3aXNlQ29udjJkJywgcGFkLCBkaW1Sb3VuZGluZ01vZGUpO1xuICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjJESW5mbyhcbiAgICAgIHg0RC5zaGFwZSwgJGZpbHRlci5zaGFwZSwgc3RyaWRlcywgZGlsYXRpb25zLCBwYWQsIGRpbVJvdW5kaW5nTW9kZSxcbiAgICAgIHRydWUgLyogZGVwdGh3aXNlICovKTtcblxuICBsZXQgJGJpYXM6IFRlbnNvcjtcbiAgaWYgKGJpYXMgIT0gbnVsbCkge1xuICAgICRiaWFzID0gY29udmVydFRvVGVuc29yKGJpYXMsICdiaWFzJywgJ2Z1c2VkIGNvbnYyZCcpO1xuICAgIFskYmlhc10gPSBtYWtlVHlwZXNNYXRjaCgkYmlhcywgJHgpO1xuXG4gICAgYnJvYWRjYXN0X3V0aWwuYXNzZXJ0QW5kR2V0QnJvYWRjYXN0U2hhcGUoY29udkluZm8ub3V0U2hhcGUsICRiaWFzLnNoYXBlKTtcbiAgfVxuXG4gIGxldCAkcHJlbHVBY3RpdmF0aW9uV2VpZ2h0czogVGVuc29yO1xuICBpZiAocHJlbHVBY3RpdmF0aW9uV2VpZ2h0cyAhPSBudWxsKSB7XG4gICAgJHByZWx1QWN0aXZhdGlvbldlaWdodHMgPSBjb252ZXJ0VG9UZW5zb3IoXG4gICAgICAgIHByZWx1QWN0aXZhdGlvbldlaWdodHMsICdwcmVsdSB3ZWlnaHRzJywgJ2Z1c2VkIGRlcHRod2lzZUNvbnYyZCcpO1xuICB9XG5cbiAgY29uc3QgZ3JhZCA9IChkeTogVGVuc29yNEQsIHNhdmVkOiBUZW5zb3JbXSkgPT4ge1xuICAgIHV0aWwuYXNzZXJ0KFxuICAgICAgICBjb252X3V0aWwudHVwbGVWYWx1ZXNBcmVPbmUoZGlsYXRpb25zKSxcbiAgICAgICAgKCkgPT4gJ0Vycm9yIGluIGdyYWRpZW50IG9mIGZ1c2VkIGRlcHRod2lzZUNvbnYyZDogZGlsYXRpb24gcmF0ZXMgJyArXG4gICAgICAgICAgICBgZ3JlYXRlciB0aGFuIDEgYXJlIG5vdCB5ZXQgc3VwcG9ydGVkLiBHb3QgZGlsYXRpb25zIGAgK1xuICAgICAgICAgICAgYCcke2RpbGF0aW9uc30nYCk7XG4gICAgY29uc3QgWyRmaWx0ZXIsIHg0RCwgeSwgYmlhc10gPSBzYXZlZDtcblxuICAgIGNvbnN0IGR5QWN0aXZhdGlvbiA9IGdldEZ1c2VkRHlBY3RpdmF0aW9uKGR5LCB5LCBhY3RpdmF0aW9uKSBhcyBUZW5zb3I0RDtcblxuICAgIGNvbnN0IHhEZXIgPSBkZXB0aHdpc2VDb252MmROYXRpdmVCYWNrcHJvcElucHV0KFxuICAgICAgICAoeDREIGFzIFRlbnNvcjREKS5zaGFwZSwgZHlBY3RpdmF0aW9uLCAkZmlsdGVyIGFzIFRlbnNvcjRELCBzdHJpZGVzLFxuICAgICAgICBwYWQsIGRpbGF0aW9ucywgZGltUm91bmRpbmdNb2RlKTtcbiAgICBjb25zdCBmaWx0ZXJEZXIgPSBkZXB0aHdpc2VDb252MmROYXRpdmVCYWNrcHJvcEZpbHRlcihcbiAgICAgICAgeDREIGFzIFRlbnNvcjRELCBkeUFjdGl2YXRpb24sICgkZmlsdGVyIGFzIFRlbnNvcjREKS5zaGFwZSwgc3RyaWRlcyxcbiAgICAgICAgcGFkLCBkaWxhdGlvbnMsIGRpbVJvdW5kaW5nTW9kZSk7XG5cbiAgICBpZiAoYmlhcyAhPSBudWxsKSB7XG4gICAgICBjb25zdCBiaWFzRGVyID0gZ2V0RnVzZWRCaWFzR3JhZGllbnQoJGJpYXMsIGR5QWN0aXZhdGlvbik7XG4gICAgICByZXR1cm4gW3hEZXIsIGZpbHRlckRlciwgYmlhc0Rlcl07XG4gICAgfVxuICAgIHJldHVybiBbeERlciwgZmlsdGVyRGVyXTtcbiAgfTtcblxuICBjb25zdCBpbnB1dHM6IEZ1c2VkRGVwdGh3aXNlQ29udjJESW5wdXRzID0ge1xuICAgIHg6IHg0RCxcbiAgICBmaWx0ZXI6ICRmaWx0ZXIsXG4gICAgYmlhczogJGJpYXMsXG4gICAgcHJlbHVBY3RpdmF0aW9uV2VpZ2h0czogJHByZWx1QWN0aXZhdGlvbldlaWdodHNcbiAgfTtcbiAgY29uc3QgYXR0cnM6IEZ1c2VkRGVwdGh3aXNlQ29udjJEQXR0cnMgPSB7XG4gICAgc3RyaWRlcyxcbiAgICBwYWQsXG4gICAgZGF0YUZvcm1hdCxcbiAgICBkaWxhdGlvbnMsXG4gICAgZGltUm91bmRpbmdNb2RlLFxuICAgIGFjdGl2YXRpb24sXG4gICAgbGVha3lyZWx1QWxwaGFcbiAgfTtcblxuICAvLyBEZXBlbmRpbmcgb24gdGhlIHRoZSBwYXJhbXMgcGFzc2VkIGluIHdlIHdpbGwgaGF2ZSBkaWZmZXJlbnQgbnVtYmVyIG9mXG4gIC8vIGlucHV0cyBhbmQgdGh1cyBhIGEgZGlmZmVyZW50IG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgZ3JhZGllbnQuXG4gIGlmIChiaWFzID09IG51bGwpIHtcbiAgICBjb25zdCBjdXN0b21PcCA9XG4gICAgICAgIGN1c3RvbUdyYWQoKHg0RDogVGVuc29yNEQsIGZpbHRlcjogVGVuc29yNEQsIHNhdmU6IEdyYWRTYXZlRnVuYykgPT4ge1xuICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tdW5uZWNlc3NhcnktdHlwZS1hc3NlcnRpb25cbiAgICAgICAgICBsZXQgcmVzOiBUZW5zb3I0RHxUZW5zb3IzRCA9IEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICAgICAgICAgIEZ1c2VkRGVwdGh3aXNlQ29udjJELCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXAsXG4gICAgICAgICAgICAgIGF0dHJzIGFzIHt9IGFzIE5hbWVkQXR0ck1hcCk7XG5cbiAgICAgICAgICBzYXZlKFtmaWx0ZXIsIHg0RCwgcmVzXSk7XG5cbiAgICAgICAgICBpZiAocmVzaGFwZWRUbzREKSB7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVubmVjZXNzYXJ5LXR5cGUtYXNzZXJ0aW9uXG4gICAgICAgICAgICByZXMgPSByZXNoYXBlKHJlcywgW3Jlcy5zaGFwZVsxXSwgcmVzLnNoYXBlWzJdLCByZXMuc2hhcGVbM11dKSBhc1xuICAgICAgICAgICAgICAgIFRlbnNvcjNEO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7dmFsdWU6IHJlcywgZ3JhZEZ1bmM6IGdyYWR9O1xuICAgICAgICB9KTtcbiAgICByZXR1cm4gY3VzdG9tT3AoeDRELCAkZmlsdGVyKSBhcyBUO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGN1c3RvbU9wV2l0aEJpYXMgPSBjdXN0b21HcmFkKFxuICAgICAgICAoeDREOiBUZW5zb3I0RCwgZmlsdGVyOiBUZW5zb3I0RCwgYmlhczogVGVuc29yLCBzYXZlOiBHcmFkU2F2ZUZ1bmMpID0+IHtcbiAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVubmVjZXNzYXJ5LXR5cGUtYXNzZXJ0aW9uXG4gICAgICAgICAgbGV0IHJlczogVGVuc29yNER8VGVuc29yM0QgPSBFTkdJTkUucnVuS2VybmVsKFxuICAgICAgICAgICAgICBGdXNlZERlcHRod2lzZUNvbnYyRCwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLFxuICAgICAgICAgICAgICBhdHRycyBhcyB7fSBhcyBOYW1lZEF0dHJNYXApO1xuXG4gICAgICAgICAgc2F2ZShbZmlsdGVyLCB4NEQsIHJlcywgYmlhc10pO1xuXG4gICAgICAgICAgaWYgKHJlc2hhcGVkVG80RCkge1xuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby11bm5lY2Vzc2FyeS10eXBlLWFzc2VydGlvblxuICAgICAgICAgICAgcmVzID0gcmVzaGFwZShyZXMsIFtyZXMuc2hhcGVbMV0sIHJlcy5zaGFwZVsyXSwgcmVzLnNoYXBlWzNdXSkgYXNcbiAgICAgICAgICAgICAgICBUZW5zb3IzRDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge3ZhbHVlOiByZXMsIGdyYWRGdW5jOiBncmFkfTtcbiAgICAgICAgfSk7XG5cbiAgICByZXR1cm4gY3VzdG9tT3BXaXRoQmlhcyh4NEQsICRmaWx0ZXIsICRiaWFzKSBhcyBUO1xuICB9XG59XG5leHBvcnQgY29uc3QgZGVwdGh3aXNlQ29udjJkID0gb3Aoe2Z1c2VkRGVwdGh3aXNlQ29udjJkX30pO1xuIl19