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
export const json = [
    {
        'tfOpName': 'EuclideanNorm',
        'category': 'normalization',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'axis',
                'type': 'number[]'
            }
        ],
        'attrs': [
            {
                'tfName': 'keep_dims',
                'name': 'keepDims',
                'type': 'bool',
                'defaultValue': false
            }
        ]
    },
    {
        'tfOpName': 'FusedBatchNorm',
        'category': 'normalization',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'scale',
                'type': 'tensor'
            },
            {
                'start': 2,
                'name': 'offset',
                'type': 'tensor'
            },
            {
                'start': 3,
                'name': 'mean',
                'type': 'tensor'
            },
            {
                'start': 4,
                'name': 'variance',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'epsilon',
                'name': 'epsilon',
                'type': 'number',
                'defaultValue': 0.001
            },
            {
                'tfName': 'data_format',
                'name': 'dataFormat',
                'type': 'string',
                'notSupported': true
            }
        ]
    },
    {
        'tfOpName': 'FusedBatchNormV2',
        'category': 'normalization',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'scale',
                'type': 'tensor'
            },
            {
                'start': 2,
                'name': 'offset',
                'type': 'tensor'
            },
            {
                'start': 3,
                'name': 'mean',
                'type': 'tensor'
            },
            {
                'start': 4,
                'name': 'variance',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'epsilon',
                'name': 'epsilon',
                'type': 'number',
                'defaultValue': 0.001
            },
            {
                'tfName': 'data_format',
                'name': 'dataFormat',
                'type': 'string',
                'notSupported': true
            }
        ]
    },
    {
        'tfOpName': 'FusedBatchNormV3',
        'category': 'normalization',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'scale',
                'type': 'tensor'
            },
            {
                'start': 2,
                'name': 'offset',
                'type': 'tensor'
            },
            {
                'start': 3,
                'name': 'mean',
                'type': 'tensor'
            },
            {
                'start': 4,
                'name': 'variance',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'epsilon',
                'name': 'epsilon',
                'type': 'number',
                'defaultValue': 0.001
            },
            {
                'tfName': 'data_format',
                'name': 'dataFormat',
                'type': 'string',
                'notSupported': true
            }
        ]
    },
    {
        'tfOpName': 'LRN',
        'category': 'normalization',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'depth_radius',
                'name': 'radius',
                'type': 'number',
                'defaultValue': 5
            },
            {
                'tfName': 'bias',
                'name': 'bias',
                'type': 'number',
                'defaultValue': 1
            },
            {
                'tfName': 'alpha',
                'name': 'alpha',
                'type': 'number',
                'defaultValue': 1
            },
            {
                'tfName': 'beta',
                'name': 'beta',
                'type': 'number',
                'defaultValue': 0.5
            }
        ]
    },
    {
        'tfOpName': 'Softmax',
        'category': 'normalization',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            }
        ]
    },
    {
        'tfOpName': 'LogSoftmax',
        'category': 'normalization',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            }
        ]
    },
    {
        'tfOpName': 'SparseToDense',
        'category': 'normalization',
        'inputs': [
            {
                'start': 0,
                'name': 'sparseIndices',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'outputShape',
                'type': 'number[]'
            },
            {
                'start': 2,
                'name': 'sparseValues',
                'type': 'tensor'
            },
            {
                'start': 3,
                'name': 'defaultValue',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'validate_indices',
                'name': 'validateIndices',
                'type': 'bool',
                'defaultValue': true,
                'notSupported': true
            }
        ]
    }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9ybWFsaXphdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29udmVydGVyL3NyYy9vcGVyYXRpb25zL29wX2xpc3Qvbm9ybWFsaXphdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFJSCxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQWU7SUFDOUI7UUFDRSxVQUFVLEVBQUUsZUFBZTtRQUMzQixVQUFVLEVBQUUsZUFBZTtRQUMzQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsR0FBRztnQkFDWCxNQUFNLEVBQUUsUUFBUTthQUNqQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxNQUFNO2dCQUNkLE1BQU0sRUFBRSxVQUFVO2FBQ25CO1NBQ0Y7UUFDRCxPQUFPLEVBQUU7WUFDUDtnQkFDRSxRQUFRLEVBQUUsV0FBVztnQkFDckIsTUFBTSxFQUFFLFVBQVU7Z0JBQ2xCLE1BQU0sRUFBRSxNQUFNO2dCQUNkLGNBQWMsRUFBRSxLQUFLO2FBQ3RCO1NBQ0Y7S0FDRjtJQUNEO1FBQ0UsVUFBVSxFQUFFLGdCQUFnQjtRQUM1QixVQUFVLEVBQUUsZUFBZTtRQUMzQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsR0FBRztnQkFDWCxNQUFNLEVBQUUsUUFBUTthQUNqQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxPQUFPO2dCQUNmLE1BQU0sRUFBRSxRQUFRO2FBQ2pCO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLFFBQVE7Z0JBQ2hCLE1BQU0sRUFBRSxRQUFRO2FBQ2pCO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLE1BQU07Z0JBQ2Qs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QUNuQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxjQUFjO2dCQUN0QixNQUFNLEVBQUUsUUFBUTthQUNqQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxjQUFjO2dCQUN0QixNQUFNLEVBQUUsUUFBUTthQUNqQjtTQUNGO1FBQ0QsT0FBTyxFQUFFO1lBQ1A7Z0JBQ0UsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsTUFBTSxFQUFFLGlCQUFpQjtnQkFDekIsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsY0FBYyxFQUFFLElBQUk7Z0JBQ3BCLGNBQWMsRUFBRSxJQUFJO2FBQ3JCO1NBQ0Y7S0FDRjtDQUNGLENBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIyIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtPcE1hcHBlcn0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY29uc3QganNvbjogT3BNYXBwZXJbXSA9IFtcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdFdWNsaWRlYW5Ob3JtJyxcbiAgICAnY2F0ZWdvcnknOiAnbm9ybWFsaXphdGlvbicsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAneCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDEsXG4gICAgICAgICduYW1lJzogJ2F4aXMnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXJbXSdcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdrZWVwX2RpbXMnLFxuICAgICAgICAnbmFtZSc6ICdrZWVwRGltcycsXG4gICAgICAgICd0eXBlJzogJ2Jvb2wnLFxuICAgICAgICAnZGVmYXVsdFZhbHVlJzogZmFsc2VcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnRnVzZWRCYXRjaE5vcm0nLFxuICAgICdjYXRlZ29yeSc6ICdub3JtYWxpemF0aW9uJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd4JyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnc2NhbGUnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAyLFxuICAgICAgICAnbmFtZSc6ICdvZmZzZXQnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAzLFxuICAgICAgICAnbmFtZSc6ICdtZWFuJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogNCxcbiAgICAgICAgJ25hbWUnOiAndmFyaWFuY2UnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnZXBzaWxvbicsXG4gICAgICAgICduYW1lJzogJ2Vwc2lsb24nLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInLFxuICAgICAgICAnZGVmYXVsdFZhbHVlJzogMC4wMDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnZGF0YV9mb3JtYXQnLFxuICAgICAgICAnbmFtZSc6ICdkYXRhRm9ybWF0JyxcbiAgICAgICAgJ3R5cGUnOiAnc3RyaW5nJyxcbiAgICAgICAgJ25vdFN1cHBvcnRlZCc6IHRydWVcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnRnVzZWRCYXRjaE5vcm1WMicsXG4gICAgJ2NhdGVnb3J5JzogJ25vcm1hbGl6YXRpb24nLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdzY2FsZScsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDIsXG4gICAgICAgICduYW1lJzogJ29mZnNldCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDMsXG4gICAgICAgICduYW1lJzogJ21lYW4nLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiA0LFxuICAgICAgICAnbmFtZSc6ICd2YXJpYW5jZScsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdlcHNpbG9uJyxcbiAgICAgICAgJ25hbWUnOiAnZXBzaWxvbicsXG4gICAgICAgICd0eXBlJzogJ251bWJlcicsXG4gICAgICAgICdkZWZhdWx0VmFsdWUnOiAwLjAwMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdkYXRhX2Zvcm1hdCcsXG4gICAgICAgICduYW1lJzogJ2RhdGFGb3JtYXQnLFxuICAgICAgICAndHlwZSc6ICdzdHJpbmcnLFxuICAgICAgICAnbm90U3VwcG9ydGVkJzogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdGdXNlZEJhdGNoTm9ybVYzJyxcbiAgICAnY2F0ZWdvcnknOiAnbm9ybWFsaXphdGlvbicsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAneCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDEsXG4gICAgICAgICduYW1lJzogJ3NjYWxlJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMixcbiAgICAgICAgJ25hbWUnOiAnb2Zmc2V0JyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMyxcbiAgICAgICAgJ25hbWUnOiAnbWVhbicsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDQsXG4gICAgICAgICduYW1lJzogJ3ZhcmlhbmNlJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfVxuICAgIF0sXG4gICAgJ2F0dHJzJzogW1xuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ2Vwc2lsb24nLFxuICAgICAgICAnbmFtZSc6ICdlcHNpbG9uJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyJyxcbiAgICAgICAgJ2RlZmF1bHRWYWx1ZSc6IDAuMDAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ2RhdGFfZm9ybWF0JyxcbiAgICAgICAgJ25hbWUnOiAnZGF0YUZvcm1hdCcsXG4gICAgICAgICd0eXBlJzogJ3N0cmluZycsXG4gICAgICAgICdub3RTdXBwb3J0ZWQnOiB0cnVlXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ0xSTicsXG4gICAgJ2NhdGVnb3J5JzogJ25vcm1hbGl6YXRpb24nLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnZGVwdGhfcmFkaXVzJyxcbiAgICAgICAgJ25hbWUnOiAncmFkaXVzJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyJyxcbiAgICAgICAgJ2RlZmF1bHRWYWx1ZSc6IDVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnYmlhcycsXG4gICAgICAgICduYW1lJzogJ2JpYXMnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInLFxuICAgICAgICAnZGVmYXVsdFZhbHVlJzogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdhbHBoYScsXG4gICAgICAgICduYW1lJzogJ2FscGhhJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyJyxcbiAgICAgICAgJ2RlZmF1bHRWYWx1ZSc6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnYmV0YScsXG4gICAgICAgICduYW1lJzogJ2JldGEnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInLFxuICAgICAgICAnZGVmYXVsdFZhbHVlJzogMC41XG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ1NvZnRtYXgnLFxuICAgICdjYXRlZ29yeSc6ICdub3JtYWxpemF0aW9uJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd4JyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdMb2dTb2Z0bWF4JyxcbiAgICAnY2F0ZWdvcnknOiAnbm9ybWFsaXphdGlvbicsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAneCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnU3BhcnNlVG9EZW5zZScsXG4gICAgJ2NhdGVnb3J5JzogJ25vcm1hbGl6YXRpb24nLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3NwYXJzZUluZGljZXMnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdvdXRwdXRTaGFwZScsXG4gICAgICAgICd0eXBlJzogJ251bWJlcltdJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMixcbiAgICAgICAgJ25hbWUnOiAnc3BhcnNlVmFsdWVzJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMyxcbiAgICAgICAgJ25hbWUnOiAnZGVmYXVsdFZhbHVlJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfVxuICAgIF0sXG4gICAgJ2F0dHJzJzogW1xuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ3ZhbGlkYXRlX2luZGljZXMnLFxuICAgICAgICAnbmFtZSc6ICd2YWxpZGF0ZUluZGljZXMnLFxuICAgICAgICAndHlwZSc6ICdib29sJyxcbiAgICAgICAgJ2RlZmF1bHRWYWx1ZSc6IHRydWUsXG4gICAgICAgICdub3RTdXBwb3J0ZWQnOiB0cnVlXG4gICAgICB9XG4gICAgXVxuICB9XG5dXG47XG4iXX0=