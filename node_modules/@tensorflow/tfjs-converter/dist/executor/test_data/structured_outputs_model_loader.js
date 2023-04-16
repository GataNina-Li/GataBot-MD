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
export const STRUCTURED_OUTPUTS_MODEL = {
    'modelTopology': {
        'node': [
            {
                'name': 'StatefulPartitionedCall/model/concatenate/concat/axis',
                'op': 'Const',
                'attr': {
                    'value': { 'tensor': { 'dtype': 'DT_INT32', 'tensorShape': {} } },
                    'dtype': { 'type': 'DT_INT32' }
                }
            },
            {
                'name': 'StatefulPartitionedCall/model/a/MatMul/ReadVariableOp',
                'op': 'Const',
                'attr': {
                    'dtype': { 'type': 'DT_FLOAT' },
                    'value': {
                        'tensor': {
                            'dtype': 'DT_FLOAT',
                            'tensorShape': { 'dim': [{ 'size': '2' }, { 'size': '1' }] }
                        }
                    }
                }
            },
            {
                'name': 'StatefulPartitionedCall/model/b/MatMul/ReadVariableOp',
                'op': 'Const',
                'attr': {
                    'value': {
                        'tensor': {
                            'dtype': 'DT_FLOAT',
                            'tensorShape': { 'dim': [{ 'size': '1' }, { 'size': '1' }] }
                        }
                    },
                    'dtype': { 'type': 'DT_FLOAT' }
                }
            },
            {
                'name': 'input1',
                'op': 'Placeholder',
                'attr': {
                    'dtype': { 'type': 'DT_FLOAT' },
                    'shape': { 'shape': { 'dim': [{ 'size': '-1' }, { 'size': '1' }] } }
                }
            },
            {
                'name': 'input2',
                'op': 'Placeholder',
                'attr': {
                    'dtype': { 'type': 'DT_FLOAT' },
                    'shape': { 'shape': { 'dim': [{ 'size': '-1' }, { 'size': '1' }] } }
                }
            },
            {
                'name': 'input3',
                'op': 'Placeholder',
                'attr': {
                    'shape': { 'shape': { 'dim': [{ 'size': '-1' }, { 'size': '1' }] } },
                    'dtype': { 'type': 'DT_FLOAT' }
                }
            },
            {
                'name': 'StatefulPartitionedCall/model/b/MatMul',
                'op': 'MatMul',
                'input': ['input2', 'StatefulPartitionedCall/model/b/MatMul/ReadVariableOp'],
                'device': '/device:CPU:0',
                'attr': {
                    'transpose_b': { 'b': false },
                    'transpose_a': { 'b': false },
                    'T': { 'type': 'DT_FLOAT' }
                }
            },
            {
                'name': 'StatefulPartitionedCall/model/concatenate/concat',
                'op': 'ConcatV2',
                'input': [
                    'input1', 'input3',
                    'StatefulPartitionedCall/model/concatenate/concat/axis'
                ],
                'attr': {
                    'Tidx': { 'type': 'DT_INT32' },
                    'T': { 'type': 'DT_FLOAT' },
                    'N': { 'i': '2' }
                }
            },
            {
                'name': 'Identity_1',
                'op': 'Identity',
                'input': ['StatefulPartitionedCall/model/b/MatMul'],
                'attr': { 'T': { 'type': 'DT_FLOAT' } }
            },
            {
                'name': 'StatefulPartitionedCall/model/a/MatMul',
                'op': 'MatMul',
                'input': [
                    'StatefulPartitionedCall/model/concatenate/concat',
                    'StatefulPartitionedCall/model/a/MatMul/ReadVariableOp'
                ],
                'device': '/device:CPU:0',
                'attr': {
                    'T': { 'type': 'DT_FLOAT' },
                    'transpose_b': { 'b': false },
                    'transpose_a': { 'b': false }
                }
            },
            {
                'name': 'Identity',
                'op': 'Identity',
                'input': ['StatefulPartitionedCall/model/a/MatMul'],
                'attr': { 'T': { 'type': 'DT_FLOAT' } }
            },
            {
                'name': 'StatefulPartitionedCall/model/c/mul',
                'op': 'Mul',
                'input': [
                    'StatefulPartitionedCall/model/a/MatMul',
                    'StatefulPartitionedCall/model/b/MatMul'
                ],
                'attr': { 'T': { 'type': 'DT_FLOAT' } }
            },
            {
                'name': 'Identity_2',
                'op': 'Identity',
                'input': ['StatefulPartitionedCall/model/c/mul'],
                'attr': { 'T': { 'type': 'DT_FLOAT' } }
            }
        ],
        'library': {},
        'versions': { 'producer': 898 }
    },
    'format': 'graph-model',
    'generatedBy': '2.7.3',
    'convertedBy': 'TensorFlow.js Converter v1.7.0',
    'weightSpecs': [
        {
            'name': 'StatefulPartitionedCall/model/concatenate/concat/axis',
            'shape': [],
            'dtype': 'int32'
        },
        {
            'name': 'StatefulPartitionedCall/model/a/MatMul/ReadVariableOp',
            'shape': [2, 1],
            'dtype': 'float32'
        },
        {
            'name': 'StatefulPartitionedCall/model/b/MatMul/ReadVariableOp',
            'shape': [1, 1],
            'dtype': 'float32'
        }
    ],
    'weightData': new Uint8Array([
        0x01, 0x00, 0x00, 0x00, 0x70, 0x3d, 0x72, 0x3e, 0x3d, 0xd2,
        0x12, 0xbf, 0x0c, 0xfb, 0x94, 0x3e
    ]).buffer,
    'signature': {
        'inputs': {
            'input1:0': {
                'name': 'input1:0',
                'dtype': 'DT_FLOAT',
                'tensorShape': { 'dim': [{ 'size': '-1' }, { 'size': '1' }] }
            },
            'input3:0': {
                'name': 'input3:0',
                'dtype': 'DT_FLOAT',
                'tensorShape': { 'dim': [{ 'size': '-1' }, { 'size': '1' }] }
            },
            'input2:0': {
                'name': 'input2:0',
                'dtype': 'DT_FLOAT',
                'tensorShape': { 'dim': [{ 'size': '-1' }, { 'size': '1' }] }
            }
        },
        'outputs': {
            'Identity_1:0': {
                'name': 'Identity_1:0',
                'dtype': 'DT_FLOAT',
                'tensorShape': { 'dim': [{ 'size': '-1' }, { 'size': '1' }] }
            },
            'Identity:0': {
                'name': 'Identity:0',
                'dtype': 'DT_FLOAT',
                'tensorShape': { 'dim': [{ 'size': '-1' }, { 'size': '1' }] }
            },
            'Identity_2:0': {
                'name': 'Identity_2:0',
                'dtype': 'DT_FLOAT',
                'tensorShape': { 'dim': [{ 'size': '-1' }, { 'size': '1' }] }
            }
        }
    },
    'userDefinedMetadata': { 'structuredOutputKeys': ['a', 'b', 'c'] }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RydWN0dXJlZF9vdXRwdXRzX21vZGVsX2xvYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29udmVydGVyL3NyYy9leGVjdXRvci90ZXN0X2RhdGEvc3RydWN0dXJlZF9vdXRwdXRzX21vZGVsX2xvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxNQUFNLENBQUMsTUFBTSx3QkFBd0IsR0FBRztJQUN0QyxlQUFlLEVBQUU7UUFDZixNQUFNLEVBQUU7WUFDTjtnQkFDRSxNQUFNLEVBQUUsdURBQXVEO2dCQUMvRCxJQUFJLEVBQUUsT0FBTztnQkFDYixNQUFNLEVBQUU7b0JBQ04sT0FBTyxFQUFFLEVBQUMsUUFBUSxFQUFFLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsRUFBRSxFQUFDLEVBQUM7b0JBQzdELE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUM7aUJBQzlCO2FBQ0Y7WUFDRDtnQkFDRSxNQUFNLEVBQUUsdURBQXVEO2dCQUMvRCxJQUFJLEVBQUUsT0FBTztnQkFDYixNQUFNLEVBQUU7b0JBQ04sT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBQztvQkFDN0IsT0FBTyxFQUFFO3dCQUNQLFFBQVEsRUFBRTs0QkFDUixPQUFPLEVBQUUsVUFBVTs0QkFDbkIsYUFBYSxFQUFFLEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBQyxNQUFNLEVBQUUsR0FBRyxFQUFDLEVBQUUsRUFBQyxNQUFNLEVBQUUsR0FBRyxFQUFDLENBQUMsRUFBQzt5QkFDdkQ7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNEO2dCQUNFLE1BQU0sRUFBRSx1REFBdUQ7Z0JBQy9ELElBQUksRUFBRSxPQUFPO2dCQUNiLE1BQU0sRUFBRTtvQkFDTixPQUFPLEVBQUU7d0JBQ1AsUUFBUSxFQUFFOzRCQUNSLE9BQU8sRUFBRSxVQUFVOzRC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QUksRUFBQyxFQUFFLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBQyxDQUFDLEVBQUM7YUFDeEQ7WUFDRCxZQUFZLEVBQUU7Z0JBQ1osTUFBTSxFQUFFLFlBQVk7Z0JBQ3BCLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixhQUFhLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsRUFBRSxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUMsQ0FBQyxFQUFDO2FBQ3hEO1lBQ0QsY0FBYyxFQUFFO2dCQUNkLE1BQU0sRUFBRSxjQUFjO2dCQUN0QixPQUFPLEVBQUUsVUFBVTtnQkFDbkIsYUFBYSxFQUFFLEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLEVBQUUsRUFBQyxNQUFNLEVBQUUsR0FBRyxFQUFDLENBQUMsRUFBQzthQUN4RDtTQUNGO0tBQ0Y7SUFDRCxxQkFBcUIsRUFBRSxFQUFDLHNCQUFzQixFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBQztDQUNqRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjIgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5leHBvcnQgY29uc3QgU1RSVUNUVVJFRF9PVVRQVVRTX01PREVMID0ge1xuICAnbW9kZWxUb3BvbG9neSc6IHtcbiAgICAnbm9kZSc6IFtcbiAgICAgIHtcbiAgICAgICAgJ25hbWUnOiAnU3RhdGVmdWxQYXJ0aXRpb25lZENhbGwvbW9kZWwvY29uY2F0ZW5hdGUvY29uY2F0L2F4aXMnLFxuICAgICAgICAnb3AnOiAnQ29uc3QnLFxuICAgICAgICAnYXR0cic6IHtcbiAgICAgICAgICAndmFsdWUnOiB7J3RlbnNvcic6IHsnZHR5cGUnOiAnRFRfSU5UMzInLCAndGVuc29yU2hhcGUnOiB7fX19LFxuICAgICAgICAgICdkdHlwZSc6IHsndHlwZSc6ICdEVF9JTlQzMid9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICduYW1lJzogJ1N0YXRlZnVsUGFydGl0aW9uZWRDYWxsL21vZGVsL2EvTWF0TXVsL1JlYWRWYXJpYWJsZU9wJyxcbiAgICAgICAgJ29wJzogJ0NvbnN0JyxcbiAgICAgICAgJ2F0dHInOiB7XG4gICAgICAgICAgJ2R0eXBlJzogeyd0eXBlJzogJ0RUX0ZMT0FUJ30sXG4gICAgICAgICAgJ3ZhbHVlJzoge1xuICAgICAgICAgICAgJ3RlbnNvcic6IHtcbiAgICAgICAgICAgICAgJ2R0eXBlJzogJ0RUX0ZMT0FUJyxcbiAgICAgICAgICAgICAgJ3RlbnNvclNoYXBlJzogeydkaW0nOiBbeydzaXplJzogJzInfSwgeydzaXplJzogJzEnfV19XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnbmFtZSc6ICdTdGF0ZWZ1bFBhcnRpdGlvbmVkQ2FsbC9tb2RlbC9iL01hdE11bC9SZWFkVmFyaWFibGVPcCcsXG4gICAgICAgICdvcCc6ICdDb25zdCcsXG4gICAgICAgICdhdHRyJzoge1xuICAgICAgICAgICd2YWx1ZSc6IHtcbiAgICAgICAgICAgICd0ZW5zb3InOiB7XG4gICAgICAgICAgICAgICdkdHlwZSc6ICdEVF9GTE9BVCcsXG4gICAgICAgICAgICAgICd0ZW5zb3JTaGFwZSc6IHsnZGltJzogW3snc2l6ZSc6ICcxJ30sIHsnc2l6ZSc6ICcxJ31dfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ2R0eXBlJzogeyd0eXBlJzogJ0RUX0ZMT0FUJ31cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ25hbWUnOiAnaW5wdXQxJyxcbiAgICAgICAgJ29wJzogJ1BsYWNlaG9sZGVyJyxcbiAgICAgICAgJ2F0dHInOiB7XG4gICAgICAgICAgJ2R0eXBlJzogeyd0eXBlJzogJ0RUX0ZMT0FUJ30sXG4gICAgICAgICAgJ3NoYXBlJzogeydzaGFwZSc6IHsnZGltJzogW3snc2l6ZSc6ICctMSd9LCB7J3NpemUnOiAnMSd9XX19XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICduYW1lJzogJ2lucHV0MicsXG4gICAgICAgICdvcCc6ICdQbGFjZWhvbGRlcicsXG4gICAgICAgICdhdHRyJzoge1xuICAgICAgICAgICdkdHlwZSc6IHsndHlwZSc6ICdEVF9GTE9BVCd9LFxuICAgICAgICAgICdzaGFwZSc6IHsnc2hhcGUnOiB7J2RpbSc6IFt7J3NpemUnOiAnLTEnfSwgeydzaXplJzogJzEnfV19fVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnbmFtZSc6ICdpbnB1dDMnLFxuICAgICAgICAnb3AnOiAnUGxhY2Vob2xkZXInLFxuICAgICAgICAnYXR0cic6IHtcbiAgICAgICAgICAnc2hhcGUnOiB7J3NoYXBlJzogeydkaW0nOiBbeydzaXplJzogJy0xJ30sIHsnc2l6ZSc6ICcxJ31dfX0sXG4gICAgICAgICAgJ2R0eXBlJzogeyd0eXBlJzogJ0RUX0ZMT0FUJ31cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ25hbWUnOiAnU3RhdGVmdWxQYXJ0aXRpb25lZENhbGwvbW9kZWwvYi9NYXRNdWwnLFxuICAgICAgICAnb3AnOiAnTWF0TXVsJyxcbiAgICAgICAgJ2lucHV0JzpcbiAgICAgICAgICAgIFsnaW5wdXQyJywgJ1N0YXRlZnVsUGFydGl0aW9uZWRDYWxsL21vZGVsL2IvTWF0TXVsL1JlYWRWYXJpYWJsZU9wJ10sXG4gICAgICAgICdkZXZpY2UnOiAnL2RldmljZTpDUFU6MCcsXG4gICAgICAgICdhdHRyJzoge1xuICAgICAgICAgICd0cmFuc3Bvc2VfYic6IHsnYic6IGZhbHNlfSxcbiAgICAgICAgICAndHJhbnNwb3NlX2EnOiB7J2InOiBmYWxzZX0sXG4gICAgICAgICAgJ1QnOiB7J3R5cGUnOiAnRFRfRkxPQVQnfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnbmFtZSc6ICdTdGF0ZWZ1bFBhcnRpdGlvbmVkQ2FsbC9tb2RlbC9jb25jYXRlbmF0ZS9jb25jYXQnLFxuICAgICAgICAnb3AnOiAnQ29uY2F0VjInLFxuICAgICAgICAnaW5wdXQnOiBbXG4gICAgICAgICAgJ2lucHV0MScsICdpbnB1dDMnLFxuICAgICAgICAgICdTdGF0ZWZ1bFBhcnRpdGlvbmVkQ2FsbC9tb2RlbC9jb25jYXRlbmF0ZS9jb25jYXQvYXhpcydcbiAgICAgICAgXSxcbiAgICAgICAgJ2F0dHInOiB7XG4gICAgICAgICAgJ1RpZHgnOiB7J3R5cGUnOiAnRFRfSU5UMzInfSxcbiAgICAgICAgICAnVCc6IHsndHlwZSc6ICdEVF9GTE9BVCd9LFxuICAgICAgICAgICdOJzogeydpJzogJzInfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnbmFtZSc6ICdJZGVudGl0eV8xJyxcbiAgICAgICAgJ29wJzogJ0lkZW50aXR5JyxcbiAgICAgICAgJ2lucHV0JzogWydTdGF0ZWZ1bFBhcnRpdGlvbmVkQ2FsbC9tb2RlbC9iL01hdE11bCddLFxuICAgICAgICAnYXR0cic6IHsnVCc6IHsndHlwZSc6ICdEVF9GTE9BVCd9fVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ25hbWUnOiAnU3RhdGVmdWxQYXJ0aXRpb25lZENhbGwvbW9kZWwvYS9NYXRNdWwnLFxuICAgICAgICAnb3AnOiAnTWF0TXVsJyxcbiAgICAgICAgJ2lucHV0JzogW1xuICAgICAgICAgICdTdGF0ZWZ1bFBhcnRpdGlvbmVkQ2FsbC9tb2RlbC9jb25jYXRlbmF0ZS9jb25jYXQnLFxuICAgICAgICAgICdTdGF0ZWZ1bFBhcnRpdGlvbmVkQ2FsbC9tb2RlbC9hL01hdE11bC9SZWFkVmFyaWFibGVPcCdcbiAgICAgICAgXSxcbiAgICAgICAgJ2RldmljZSc6ICcvZGV2aWNlOkNQVTowJyxcbiAgICAgICAgJ2F0dHInOiB7XG4gICAgICAgICAgJ1QnOiB7J3R5cGUnOiAnRFRfRkxPQVQnfSxcbiAgICAgICAgICAndHJhbnNwb3NlX2InOiB7J2InOiBmYWxzZX0sXG4gICAgICAgICAgJ3RyYW5zcG9zZV9hJzogeydiJzogZmFsc2V9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICduYW1lJzogJ0lkZW50aXR5JyxcbiAgICAgICAgJ29wJzogJ0lkZW50aXR5JyxcbiAgICAgICAgJ2lucHV0JzogWydTdGF0ZWZ1bFBhcnRpdGlvbmVkQ2FsbC9tb2RlbC9hL01hdE11bCddLFxuICAgICAgICAnYXR0cic6IHsnVCc6IHsndHlwZSc6ICdEVF9GTE9BVCd9fVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ25hbWUnOiAnU3RhdGVmdWxQYXJ0aXRpb25lZENhbGwvbW9kZWwvYy9tdWwnLFxuICAgICAgICAnb3AnOiAnTXVsJyxcbiAgICAgICAgJ2lucHV0JzogW1xuICAgICAgICAgICdTdGF0ZWZ1bFBhcnRpdGlvbmVkQ2FsbC9tb2RlbC9hL01hdE11bCcsXG4gICAgICAgICAgJ1N0YXRlZnVsUGFydGl0aW9uZWRDYWxsL21vZGVsL2IvTWF0TXVsJ1xuICAgICAgICBdLFxuICAgICAgICAnYXR0cic6IHsnVCc6IHsndHlwZSc6ICdEVF9GTE9BVCd9fVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ25hbWUnOiAnSWRlbnRpdHlfMicsXG4gICAgICAgICdvcCc6ICdJZGVudGl0eScsXG4gICAgICAgICdpbnB1dCc6IFsnU3RhdGVmdWxQYXJ0aXRpb25lZENhbGwvbW9kZWwvYy9tdWwnXSxcbiAgICAgICAgJ2F0dHInOiB7J1QnOiB7J3R5cGUnOiAnRFRfRkxPQVQnfX1cbiAgICAgIH1cbiAgICBdLFxuICAgICdsaWJyYXJ5Jzoge30sXG4gICAgJ3ZlcnNpb25zJzogeydwcm9kdWNlcic6IDg5OH1cbiAgfSxcbiAgJ2Zvcm1hdCc6ICdncmFwaC1tb2RlbCcsXG4gICdnZW5lcmF0ZWRCeSc6ICcyLjcuMycsXG4gICdjb252ZXJ0ZWRCeSc6ICdUZW5zb3JGbG93LmpzIENvbnZlcnRlciB2MS43LjAnLFxuICAnd2VpZ2h0U3BlY3MnOiBbXG4gICAge1xuICAgICAgJ25hbWUnOiAnU3RhdGVmdWxQYXJ0aXRpb25lZENhbGwvbW9kZWwvY29uY2F0ZW5hdGUvY29uY2F0L2F4aXMnLFxuICAgICAgJ3NoYXBlJzogW10sXG4gICAgICAnZHR5cGUnOiAnaW50MzInXG4gICAgfSxcbiAgICB7XG4gICAgICAnbmFtZSc6ICdTdGF0ZWZ1bFBhcnRpdGlvbmVkQ2FsbC9tb2RlbC9hL01hdE11bC9SZWFkVmFyaWFibGVPcCcsXG4gICAgICAnc2hhcGUnOiBbMiwgMV0sXG4gICAgICAnZHR5cGUnOiAnZmxvYXQzMidcbiAgICB9LFxuICAgIHtcbiAgICAgICduYW1lJzogJ1N0YXRlZnVsUGFydGl0aW9uZWRDYWxsL21vZGVsL2IvTWF0TXVsL1JlYWRWYXJpYWJsZU9wJyxcbiAgICAgICdzaGFwZSc6IFsxLCAxXSxcbiAgICAgICdkdHlwZSc6ICdmbG9hdDMyJ1xuICAgIH1cbiAgXSxcbiAgJ3dlaWdodERhdGEnOiBuZXcgVWludDhBcnJheShbXG4gICAgICAgICAgICAgICAgICAweDAxLCAweDAwLCAweDAwLCAweDAwLCAweDcwLCAweDNkLCAweDcyLCAweDNlLCAweDNkLCAweGQyLFxuICAgICAgICAgICAgICAgICAgMHgxMiwgMHhiZiwgMHgwYywgMHhmYiwgMHg5NCwgMHgzZVxuICAgICAgICAgICAgICAgIF0pLmJ1ZmZlcixcbiAgJ3NpZ25hdHVyZSc6IHtcbiAgICAnaW5wdXRzJzoge1xuICAgICAgJ2lucHV0MTowJzoge1xuICAgICAgICAnbmFtZSc6ICdpbnB1dDE6MCcsXG4gICAgICAgICdkdHlwZSc6ICdEVF9GTE9BVCcsXG4gICAgICAgICd0ZW5zb3JTaGFwZSc6IHsnZGltJzogW3snc2l6ZSc6ICctMSd9LCB7J3NpemUnOiAnMSd9XX1cbiAgICAgIH0sXG4gICAgICAnaW5wdXQzOjAnOiB7XG4gICAgICAgICduYW1lJzogJ2lucHV0MzowJyxcbiAgICAgICAgJ2R0eXBlJzogJ0RUX0ZMT0FUJyxcbiAgICAgICAgJ3RlbnNvclNoYXBlJzogeydkaW0nOiBbeydzaXplJzogJy0xJ30sIHsnc2l6ZSc6ICcxJ31dfVxuICAgICAgfSxcbiAgICAgICdpbnB1dDI6MCc6IHtcbiAgICAgICAgJ25hbWUnOiAnaW5wdXQyOjAnLFxuICAgICAgICAnZHR5cGUnOiAnRFRfRkxPQVQnLFxuICAgICAgICAndGVuc29yU2hhcGUnOiB7J2RpbSc6IFt7J3NpemUnOiAnLTEnfSwgeydzaXplJzogJzEnfV19XG4gICAgICB9XG4gICAgfSxcbiAgICAnb3V0cHV0cyc6IHtcbiAgICAgICdJZGVudGl0eV8xOjAnOiB7XG4gICAgICAgICduYW1lJzogJ0lkZW50aXR5XzE6MCcsXG4gICAgICAgICdkdHlwZSc6ICdEVF9GTE9BVCcsXG4gICAgICAgICd0ZW5zb3JTaGFwZSc6IHsnZGltJzogW3snc2l6ZSc6ICctMSd9LCB7J3NpemUnOiAnMSd9XX1cbiAgICAgIH0sXG4gICAgICAnSWRlbnRpdHk6MCc6IHtcbiAgICAgICAgJ25hbWUnOiAnSWRlbnRpdHk6MCcsXG4gICAgICAgICdkdHlwZSc6ICdEVF9GTE9BVCcsXG4gICAgICAgICd0ZW5zb3JTaGFwZSc6IHsnZGltJzogW3snc2l6ZSc6ICctMSd9LCB7J3NpemUnOiAnMSd9XX1cbiAgICAgIH0sXG4gICAgICAnSWRlbnRpdHlfMjowJzoge1xuICAgICAgICAnbmFtZSc6ICdJZGVudGl0eV8yOjAnLFxuICAgICAgICAnZHR5cGUnOiAnRFRfRkxPQVQnLFxuICAgICAgICAndGVuc29yU2hhcGUnOiB7J2RpbSc6IFt7J3NpemUnOiAnLTEnfSwgeydzaXplJzogJzEnfV19XG4gICAgICB9XG4gICAgfVxuICB9LFxuICAndXNlckRlZmluZWRNZXRhZGF0YSc6IHsnc3RydWN0dXJlZE91dHB1dEtleXMnOiBbJ2EnLCAnYicsICdjJ119XG59O1xuIl19