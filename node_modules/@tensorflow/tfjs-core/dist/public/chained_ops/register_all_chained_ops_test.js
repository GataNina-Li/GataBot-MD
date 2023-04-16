/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
import '../../public/chained_ops/register_all_chained_ops';
import * as tf from '../../index';
import { ALL_ENVS, describeWithFlags } from '../../jasmine_util';
// Testing for presence of chained op in this file will allow us to more easily
// customize when we want this test to run. Currently it will run be default
// (And karma will always load the chain augmentor files). But this gives us
// flexibility to change in future.
const CHAINED_OPS = [
    'abs',
    'acos',
    'acosh',
    'add',
    'all',
    'any',
    'argMax',
    'argMin',
    'as1D',
    'as2D',
    'as3D',
    'as4D',
    'as5D',
    'asin',
    'asinh',
    'asScalar',
    'asType',
    'atan',
    'atan2',
    'atanh',
    'avgPool',
    'batchNorm',
    'batchToSpaceND',
    'broadcastTo',
    'cast',
    'ceil',
    'clipByValue',
    'concat',
    'conv1d',
    'conv2d',
    'conv2dTranspose',
    'cos',
    'cosh',
    'cumprod',
    'cumsum',
    'depthToSpace',
    'depthwiseConv2d',
    'dilation2d',
    'div',
    'divNoNan',
    'dot',
    'elu',
    'equal',
    'erf',
    'exp',
    'expandDims',
    'expm1',
    'fft',
    'flatten',
    'floor',
    'floorDiv',
    'gather',
    'greater',
    'greaterEqual',
    'ifft',
    'irfft',
    'isFinite',
    'isInf',
    'isNaN',
    'leakyRelu',
    'less',
    'lessEqual',
    'localResponseNormalization',
    'log',
    'log1p',
    'logicalAnd',
    'logicalNot',
    'logicalOr',
    'logicalXor',
    'logSigmoid',
    'logSoftmax',
    'logSumExp',
    'matMul',
    'max',
    'maximum',
    'maxPool',
    'mean',
    'min',
    'minimum',
    'mirrorPad',
    'mod',
    'mul',
    'neg',
    'norm',
    'notEqual',
    'oneHot',
    'onesLike',
    'pad',
    'pool',
    'pow',
    'prelu',
    'prod',
    'reciprocal',
    'relu',
    'relu6',
    'reshape',
    'reshapeAs',
    'resizeBilinear',
    'resizeNearestNeighbor',
    'reverse',
    'rfft',
    'round',
    'rsqrt',
    'selu',
    'separableConv2d',
    'sigmoid',
    'sign',
    'sin',
    'sinh',
    'slice',
    'softmax',
    'softplus',
    'spaceToBatchND',
    'split',
    'sqrt',
    'square',
    'square',
    'squeeze',
    'stack',
    'step',
    'stridedSlice',
    'sub',
    'sum',
    'tan',
    'tanh',
    'tile',
    'toBool',
    'toFloat',
    'toInt',
    'topk',
    'transpose',
    'unique',
    'unsortedSegmentSum',
    'unstack',
    'where',
    'zerosLike'
];
describeWithFlags('chained ops', ALL_ENVS, () => {
    it('all chained ops should exist on tensor ', async () => {
        const tensor = tf.tensor([1, 2, 3]);
        for (const opName of CHAINED_OPS) {
            //@ts-ignore
            expect(typeof tensor[opName])
                .toBe('function', `${opName} chained op not found`);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXJfYWxsX2NoYWluZWRfb3BzX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL3B1YmxpYy9jaGFpbmVkX29wcy9yZWdpc3Rlcl9hbGxfY2hhaW5lZF9vcHNfdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLG1EQUFtRCxDQUFDO0FBRTNELE9BQU8sS0FBSyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUUvRCwrRUFBK0U7QUFDL0UsNEVBQTRFO0FBQzVFLDRFQUE0RTtBQUM1RSxtQ0FBbUM7QUFFbkMsTUFBTSxXQUFXLEdBQUc7SUFDbEIsS0FBSztJQUNMLE1BQU07SUFDTixPQUFPO0lBQ1AsS0FBSztJQUNMLEtBQUs7SUFDTCxLQUFLO0lBQ0wsUUFBUTtJQUNSLFFBQVE7SUFDUixNQUFNO0lBQ04sTUFBTTtJQUNOLE1BQU07SUFDTixNQUFNO0lBQ04sTUFBTTtJQUNOLE1BQU07SUFDTixPQUFPO0lBQ1AsVUFBVTtJQUNWLFFBQVE7SUFDUixNQUFNO0lBQ04sT0FBTztJQUNQLE9BQU87SUFDUCxTQUFTO0lBQ1QsV0FBVztJQUNYLGdCQUFnQjtJQUNoQixhQUFhO0lBQ2IsTUFBTTtJQUNOLE1BQU07SUFDTixhQUFhO0lBQ2IsUUFBUTtJQUNSLFFBQVE7SUFDUixRQUFRO0lBQ1IsaUJBQWlCO0lBQ2pCLEtBQUs7SUFDTCxNQUFNO0lBQ04sU0FBUztJQUNULFFBQVE7SUFDUixjQUFjO0lBQ2QsaUJBQWlCO0lBQ2pCLFlBQVk7SUFDWixLQUFLO0lBQ0wsVUFBVTtJQUNWLEtBQUs7SUFDTCxLQUFLO0lBQ0wsT0FBTztJQUNQLEtBQUs7SUFDTCxLQUFLO0lBQ0wsWUFBWTtJQUNaLE9BQU87SUFDUCxLQUFLO0lBQ0wsU0FBUztJQUNULE9BQU87SUFDUCxVQUFVO0lBQ1YsUUFBUTtJQUNSLFNBQVM7SUFDVCxjQUFjO0lBQ2QsTUFBTTtJQUNOLE9BQU87SUFDUCxVQUFVO0lBQ1YsT0FBTztJQUNQLE9BQU87SUFDUCxXQUFXO0lBQ1gsTUFBTTtJQUNOLFdBQVc7SUFDWCw0QkFBNEI7SUFDNUIsS0FBSztJQUNMLE9BQU87SUFDUCxZQUFZO0lBQ1osWUFBWTtJQUNaLFdBQVc7SUFDWCxZQUFZO0lBQ1osWUFBWTtJQUNaLFlBQVk7SUFDWixXQUFXO0lBQ1gsUUFBUTtJQUNSLEtBQUs7SUFDTCxTQUFTO0lBQ1QsU0FBUztJQUNULE1BQU07SUFDTixLQUFLO0lBQ0wsU0FBUztJQUNULFdBQVc7SUFDWCxLQUFLO0lBQ0wsS0FBSztJQUNMLEtBQUs7SUFDTCxNQUFNO0lBQ04sVUFBVTtJQUNWLFFBQVE7SUFDUixVQUFVO0lBQ1YsS0FBSztJQUNMLE1BQU07SUFDTixLQUFLO0lBQ0wsT0FBTztJQUNQLE1BQU07SUFDTixZQUFZO0lBQ1osTUFBTTtJQUNOLE9BQU87SUFDUCxTQUFTO0lBQ1QsV0FBVztJQUNYLGdCQUFnQjtJQUNoQix1QkFBdUI7SUFDdkIsU0FBUztJQUNULE1BQU07SUFDTixPQUFPO0lBQ1AsT0FBTztJQUNQLE1BQU07SUFDTixpQkFBaUI7SUFDakIsU0FBUztJQUNULE1BQU07SUFDTixLQUFLO0lBQ0wsTUFBTTtJQUNOLE9BQU87SUFDUCxTQUFTO0lBQ1QsVUFBVTtJQUNWLGdCQUFnQjtJQUNoQixPQUFPO0lBQ1AsTUFBTTtJQUNOLFFBQVE7SUFDUixRQUFRO0lBQ1IsU0FBUztJQUNULE9BQU87SUFDUCxNQUFNO0lBQ04sY0FBYztJQUNkLEtBQUs7SUFDTCxLQUFLO0lBQ0wsS0FBSztJQUNMLE1BQU07SUFDTixNQUFNO0lBQ04sUUFBUTtJQUNSLFNBQVM7SUFDVCxPQUFPO0lBQ1AsTUFBTTtJQUNOLFdBQVc7SUFDWCxRQUFRO0lBQ1Isb0JBQW9CO0lBQ3BCLFNBQVM7SUFDVCxPQUFPO0lBQ1AsV0FBVztDQUNaLENBQUM7QUFFRixpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUM5QyxFQUFFLENBQUMseUNBQXlDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDdkQsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxLQUFLLE1BQU0sTUFBTSxJQUFJLFdBQVcsRUFBRTtZQUNoQyxZQUFZO1lBQ1osTUFBTSxDQUFDLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUN4QixJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsTUFBTSx1QkFBdUIsQ0FBQyxDQUFDO1NBQ3pEO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0ICcuLi8uLi9wdWJsaWMvY2hhaW5lZF9vcHMvcmVnaXN0ZXJfYWxsX2NoYWluZWRfb3BzJztcblxuaW1wb3J0ICogYXMgdGYgZnJvbSAnLi4vLi4vaW5kZXgnO1xuaW1wb3J0IHtBTExfRU5WUywgZGVzY3JpYmVXaXRoRmxhZ3N9IGZyb20gJy4uLy4uL2phc21pbmVfdXRpbCc7XG5cbi8vIFRlc3RpbmcgZm9yIHByZXNlbmNlIG9mIGNoYWluZWQgb3AgaW4gdGhpcyBmaWxlIHdpbGwgYWxsb3cgdXMgdG8gbW9yZSBlYXNpbHlcbi8vIGN1c3RvbWl6ZSB3aGVuIHdlIHdhbnQgdGhpcyB0ZXN0IHRvIHJ1bi4gQ3VycmVudGx5IGl0IHdpbGwgcnVuIGJlIGRlZmF1bHRcbi8vIChBbmQga2FybWEgd2lsbCBhbHdheXMgbG9hZCB0aGUgY2hhaW4gYXVnbWVudG9yIGZpbGVzKS4gQnV0IHRoaXMgZ2l2ZXMgdXNcbi8vIGZsZXhpYmlsaXR5IHRvIGNoYW5nZSBpbiBmdXR1cmUuXG5cbmNvbnN0IENIQUlORURfT1BTID0gW1xuICAnYWJzJyxcbiAgJ2Fjb3MnLFxuICAnYWNvc2gnLFxuICAnYWRkJyxcbiAgJ2FsbCcsXG4gICdhbnknLFxuICAnYXJnTWF4JyxcbiAgJ2FyZ01pbicsXG4gICdhczFEJyxcbiAgJ2FzMkQnLFxuICAnYXMzRCcsXG4gICdhczREJyxcbiAgJ2FzNUQnLFxuICAnYXNpbicsXG4gICdhc2luaCcsXG4gICdhc1NjYWxhcicsXG4gICdhc1R5cGUnLFxuICAnYXRhbicsXG4gICdhdGFuMicsXG4gICdhdGFuaCcsXG4gICdhdmdQb29sJyxcbiAgJ2JhdGNoTm9ybScsXG4gICdiYXRjaFRvU3BhY2VORCcsXG4gICdicm9hZGNhc3RUbycsXG4gICdjYXN0JyxcbiAgJ2NlaWwnLFxuICAnY2xpcEJ5VmFsdWUnLFxuICAnY29uY2F0JyxcbiAgJ2NvbnYxZCcsXG4gICdjb252MmQnLFxuICAnY29udjJkVHJhbnNwb3NlJyxcbiAgJ2NvcycsXG4gICdjb3NoJyxcbiAgJ2N1bXByb2QnLFxuICAnY3Vtc3VtJyxcbiAgJ2RlcHRoVG9TcGFjZScsXG4gICdkZXB0aHdpc2VDb252MmQnLFxuICAnZGlsYXRpb24yZCcsXG4gICdkaXYnLFxuICAnZGl2Tm9OYW4nLFxuICAnZG90JyxcbiAgJ2VsdScsXG4gICdlcXVhbCcsXG4gICdlcmYnLFxuICAnZXhwJyxcbiAgJ2V4cGFuZERpbXMnLFxuICAnZXhwbTEnLFxuICAnZmZ0JyxcbiAgJ2ZsYXR0ZW4nLFxuICAnZmxvb3InLFxuICAnZmxvb3JEaXYnLFxuICAnZ2F0aGVyJyxcbiAgJ2dyZWF0ZXInLFxuICAnZ3JlYXRlckVxdWFsJyxcbiAgJ2lmZnQnLFxuICAnaXJmZnQnLFxuICAnaXNGaW5pdGUnLFxuICAnaXNJbmYnLFxuICAnaXNOYU4nLFxuICAnbGVha3lSZWx1JyxcbiAgJ2xlc3MnLFxuICAnbGVzc0VxdWFsJyxcbiAgJ2xvY2FsUmVzcG9uc2VOb3JtYWxpemF0aW9uJyxcbiAgJ2xvZycsXG4gICdsb2cxcCcsXG4gICdsb2dpY2FsQW5kJyxcbiAgJ2xvZ2ljYWxOb3QnLFxuICAnbG9naWNhbE9yJyxcbiAgJ2xvZ2ljYWxYb3InLFxuICAnbG9nU2lnbW9pZCcsXG4gICdsb2dTb2Z0bWF4JyxcbiAgJ2xvZ1N1bUV4cCcsXG4gICdtYXRNdWwnLFxuICAnbWF4JyxcbiAgJ21heGltdW0nLFxuICAnbWF4UG9vbCcsXG4gICdtZWFuJyxcbiAgJ21pbicsXG4gICdtaW5pbXVtJyxcbiAgJ21pcnJvclBhZCcsXG4gICdtb2QnLFxuICAnbXVsJyxcbiAgJ25lZycsXG4gICdub3JtJyxcbiAgJ25vdEVxdWFsJyxcbiAgJ29uZUhvdCcsXG4gICdvbmVzTGlrZScsXG4gICdwYWQnLFxuICAncG9vbCcsXG4gICdwb3cnLFxuICAncHJlbHUnLFxuICAncHJvZCcsXG4gICdyZWNpcHJvY2FsJyxcbiAgJ3JlbHUnLFxuICAncmVsdTYnLFxuICAncmVzaGFwZScsXG4gICdyZXNoYXBlQXMnLFxuICAncmVzaXplQmlsaW5lYXInLFxuICAncmVzaXplTmVhcmVzdE5laWdoYm9yJyxcbiAgJ3JldmVyc2UnLFxuICAncmZmdCcsXG4gICdyb3VuZCcsXG4gICdyc3FydCcsXG4gICdzZWx1JyxcbiAgJ3NlcGFyYWJsZUNvbnYyZCcsXG4gICdzaWdtb2lkJyxcbiAgJ3NpZ24nLFxuICAnc2luJyxcbiAgJ3NpbmgnLFxuICAnc2xpY2UnLFxuICAnc29mdG1heCcsXG4gICdzb2Z0cGx1cycsXG4gICdzcGFjZVRvQmF0Y2hORCcsXG4gICdzcGxpdCcsXG4gICdzcXJ0JyxcbiAgJ3NxdWFyZScsXG4gICdzcXVhcmUnLFxuICAnc3F1ZWV6ZScsXG4gICdzdGFjaycsXG4gICdzdGVwJyxcbiAgJ3N0cmlkZWRTbGljZScsXG4gICdzdWInLFxuICAnc3VtJyxcbiAgJ3RhbicsXG4gICd0YW5oJyxcbiAgJ3RpbGUnLFxuICAndG9Cb29sJyxcbiAgJ3RvRmxvYXQnLFxuICAndG9JbnQnLFxuICAndG9waycsXG4gICd0cmFuc3Bvc2UnLFxuICAndW5pcXVlJyxcbiAgJ3Vuc29ydGVkU2VnbWVudFN1bScsXG4gICd1bnN0YWNrJyxcbiAgJ3doZXJlJyxcbiAgJ3plcm9zTGlrZSdcbl07XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCdjaGFpbmVkIG9wcycsIEFMTF9FTlZTLCAoKSA9PiB7XG4gIGl0KCdhbGwgY2hhaW5lZCBvcHMgc2hvdWxkIGV4aXN0IG9uIHRlbnNvciAnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdGVuc29yID0gdGYudGVuc29yKFsxLCAyLCAzXSk7XG4gICAgZm9yIChjb25zdCBvcE5hbWUgb2YgQ0hBSU5FRF9PUFMpIHtcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgZXhwZWN0KHR5cGVvZiB0ZW5zb3Jbb3BOYW1lXSlcbiAgICAgICAgICAudG9CZSgnZnVuY3Rpb24nLCBgJHtvcE5hbWV9IGNoYWluZWQgb3Agbm90IGZvdW5kYCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIl19