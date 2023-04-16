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
        'tfOpName': 'ConcatV2',
        'category': 'slice_join',
        'inputs': [
            {
                'start': 0,
                'end': -1,
                'name': 'tensors',
                'type': 'tensors'
            },
            {
                'start': -1,
                'name': 'axis',
                'type': 'number'
            }
        ],
        'attrs': [
            {
                'tfName': 'N',
                'name': 'n',
                'type': 'number',
                'defaultValue': 2
            }
        ]
    },
    {
        'tfOpName': 'Concat',
        'category': 'slice_join',
        'inputs': [
            {
                'start': 1,
                'end': 0,
                'name': 'tensors',
                'type': 'tensors'
            },
            {
                'start': 0,
                'name': 'axis',
                'type': 'number'
            }
        ],
        'attrs': [
            {
                'tfName': 'N',
                'name': 'n',
                'type': 'number',
                'defaultValue': 2
            }
        ]
    },
    {
        'tfOpName': 'GatherV2',
        'category': 'slice_join',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'indices',
                'type': 'tensor'
            },
            {
                'start': 2,
                'name': 'axis',
                'type': 'number',
                'defaultValue': 0
            }
        ],
        'attrs': [
            {
                'tfName': 'batch_dims',
                'name': 'batchDims',
                'type': 'number',
                'defaultValue': 0
            }
        ]
    },
    {
        'tfOpName': 'Gather',
        'category': 'slice_join',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'indices',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'validate_indices',
                'name': 'validateIndices',
                'type': 'bool',
                'notSupported': true
            }
        ]
    },
    {
        'tfOpName': 'Reverse',
        'category': 'slice_join',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'dims',
                'type': 'bool[]'
            }
        ]
    },
    {
        'tfOpName': 'ReverseV2',
        'category': 'slice_join',
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
        ]
    },
    {
        'tfOpName': 'Slice',
        'category': 'slice_join',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'begin',
                'type': 'number[]'
            },
            {
                'start': 2,
                'name': 'size',
                'type': 'number[]'
            }
        ]
    },
    {
        'tfOpName': 'StridedSlice',
        'category': 'slice_join',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'begin',
                'type': 'number[]'
            },
            {
                'start': 2,
                'name': 'end',
                'type': 'number[]'
            },
            {
                'start': 3,
                'name': 'strides',
                'type': 'number[]'
            }
        ],
        'attrs': [
            {
                'tfName': 'begin_mask',
                'name': 'beginMask',
                'type': 'number',
                'defaultValue': 0
            },
            {
                'tfName': 'end_mask',
                'name': 'endMask',
                'type': 'number',
                'defaultValue': 0
            },
            {
                'tfName': 'new_axis_mask',
                'name': 'newAxisMask',
                'type': 'number',
                'defaultValue': 0
            },
            {
                'tfName': 'ellipsis_mask',
                'name': 'ellipsisMask',
                'type': 'number',
                'defaultValue': 0
            },
            {
                'tfName': 'shrink_axis_mask',
                'name': 'shrinkAxisMask',
                'type': 'number',
                'defaultValue': 0
            }
        ]
    },
    {
        'tfOpName': 'Pack',
        'category': 'slice_join',
        'inputs': [
            {
                'start': 0,
                'end': 0,
                'name': 'tensors',
                'type': 'tensors'
            }
        ],
        'attrs': [
            {
                'tfName': 'axis',
                'name': 'axis',
                'type': 'number',
                'defaultValue': 0
            }
        ]
    },
    {
        'tfOpName': 'Unpack',
        'category': 'slice_join',
        'inputs': [
            {
                'start': 0,
                'name': 'tensor',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'axis',
                'name': 'axis',
                'type': 'number',
                'defaultValue': 0
            },
            {
                'tfName': 'num',
                'name': 'num',
                'type': 'number',
                'defaultValue': 0,
                'notSupported': true
            }
        ]
    },
    {
        'tfOpName': 'Tile',
        'category': 'slice_join',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'reps',
                'type': 'number[]'
            }
        ]
    },
    {
        'tfOpName': 'Split',
        'category': 'slice_join',
        'inputs': [
            {
                'start': 0,
                'name': 'axis',
                'type': 'number',
                'defaultValue': 0
            },
            {
                'start': 1,
                'name': 'x',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'num_split',
                'name': 'numOrSizeSplits',
                'type': 'number',
                'defaultValue': 1
            }
        ]
    },
    {
        'tfOpName': 'SplitV',
        'category': 'slice_join',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'numOrSizeSplits',
                'type': 'number[]'
            },
            {
                'start': 2,
                'name': 'axis',
                'type': 'number',
                'defaultValue': 0
            }
        ]
    },
    {
        'tfOpName': 'ScatterNd',
        'category': 'slice_join',
        'inputs': [
            {
                'start': 0,
                'name': 'indices',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'values',
                'type': 'tensor'
            },
            {
                'start': 2,
                'name': 'shape',
                'type': 'number[]'
            }
        ]
    },
    {
        'tfOpName': 'GatherNd',
        'category': 'slice_join',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'indices',
                'type': 'tensor'
            }
        ]
    },
    {
        'tfOpName': 'SparseToDense',
        'category': 'slice_join',
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
                'defaultValue': false,
                'notSupported': true
            }
        ]
    }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2Vfam9pbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29udmVydGVyL3NyYy9vcGVyYXRpb25zL29wX2xpc3Qvc2xpY2Vfam9pbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFJSCxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQWU7SUFDOUI7UUFDRSxVQUFVLEVBQUUsVUFBVTtRQUN0QixVQUFVLEVBQUUsWUFBWTtRQUN4QixRQUFRLEVBQUU7WUFDUjtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNULE1BQU0sRUFBRSxTQUFTO2dCQUNqQixNQUFNLEVBQUUsU0FBUzthQUNsQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxDQUFDLENBQUM7Z0JBQ1gsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsTUFBTSxFQUFFLFFBQVE7YUFDakI7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQO2dCQUNFLFFBQVEsRUFBRSxHQUFHO2dCQUNiLE1BQU0sRUFBRSxHQUFHO2dCQUNYLE1BQU0sRUFBRSxRQUFRO2dCQUNoQixjQUFjLEVBQUUsQ0FBQzthQUNsQjtTQUNGO0tBQ0Y7SUFDRDtRQUNFLFVBQVUsRUFBRSxRQUFRO1FBQ3BCLFVBQVUsRUFBRSxZQUFZO1FBQ3hCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE9BQU8sRUFBRSxDQUFDO2dCQUNWLEtBQUssRUFBRSxDQUFDO2dCQUNSLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixNQUFNLEVBQUUsU0FBUzthQUNsQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxNQUFNO2dCQUNkLE1BQU0sRUFBRSxRQUFRO2FBQ2pCO1NBQ0Y7UUFDRCxPQUFPLEVBQUU7WUFDUDtnQkFDRSxRQUFRLEVBQUUsR0FBRztnQkFDYixNQUFNLEVBQUUsR0FBRztnQkFDWCxNQUFNLEVBQUUs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LFFBQVE7YUFDakI7U0FDRjtLQUNGO0lBQ0Q7UUFDRSxVQUFVLEVBQUUsZUFBZTtRQUMzQixVQUFVLEVBQUUsWUFBWTtRQUN4QixRQUFRLEVBQUU7WUFDUjtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsZUFBZTtnQkFDdkIsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsYUFBYTtnQkFDckIsTUFBTSxFQUFFLFVBQVU7YUFDbkI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsY0FBYztnQkFDdEIsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsY0FBYztnQkFDdEIsTUFBTSxFQUFFLFFBQVE7YUFDakI7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQO2dCQUNFLFFBQVEsRUFBRSxrQkFBa0I7Z0JBQzVCLE1BQU0sRUFBRSxpQkFBaUI7Z0JBQ3pCLE1BQU0sRUFBRSxNQUFNO2dCQUNkLGNBQWMsRUFBRSxLQUFLO2dCQUNyQixjQUFjLEVBQUUsSUFBSTthQUNyQjtTQUNGO0tBQ0Y7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7T3BNYXBwZXJ9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IGpzb246IE9wTWFwcGVyW10gPSBbXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnQ29uY2F0VjInLFxuICAgICdjYXRlZ29yeSc6ICdzbGljZV9qb2luJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnZW5kJzogLTEsXG4gICAgICAgICduYW1lJzogJ3RlbnNvcnMnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3JzJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogLTEsXG4gICAgICAgICduYW1lJzogJ2F4aXMnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnTicsXG4gICAgICAgICduYW1lJzogJ24nLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInLFxuICAgICAgICAnZGVmYXVsdFZhbHVlJzogMlxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdDb25jYXQnLFxuICAgICdjYXRlZ29yeSc6ICdzbGljZV9qb2luJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnZW5kJzogMCxcbiAgICAgICAgJ25hbWUnOiAndGVuc29ycycsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcnMnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICdheGlzJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyJ1xuICAgICAgfVxuICAgIF0sXG4gICAgJ2F0dHJzJzogW1xuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ04nLFxuICAgICAgICAnbmFtZSc6ICduJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyJyxcbiAgICAgICAgJ2RlZmF1bHRWYWx1ZSc6IDJcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnR2F0aGVyVjInLFxuICAgICdjYXRlZ29yeSc6ICdzbGljZV9qb2luJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd4JyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnaW5kaWNlcycsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDIsXG4gICAgICAgICduYW1lJzogJ2F4aXMnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInLFxuICAgICAgICAnZGVmYXVsdFZhbHVlJzogMFxuICAgICAgfVxuICAgIF0sXG4gICAgJ2F0dHJzJzogW1xuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ2JhdGNoX2RpbXMnLFxuICAgICAgICAnbmFtZSc6ICdiYXRjaERpbXMnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInLFxuICAgICAgICAnZGVmYXVsdFZhbHVlJzogMFxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdHYXRoZXInLFxuICAgICdjYXRlZ29yeSc6ICdzbGljZV9qb2luJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd4JyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnaW5kaWNlcycsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICd2YWxpZGF0ZV9pbmRpY2VzJyxcbiAgICAgICAgJ25hbWUnOiAndmFsaWRhdGVJbmRpY2VzJyxcbiAgICAgICAgJ3R5cGUnOiAnYm9vbCcsXG4gICAgICAgICdub3RTdXBwb3J0ZWQnOiB0cnVlXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ1JldmVyc2UnLFxuICAgICdjYXRlZ29yeSc6ICdzbGljZV9qb2luJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd4JyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnZGltcycsXG4gICAgICAgICd0eXBlJzogJ2Jvb2xbXSdcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnUmV2ZXJzZVYyJyxcbiAgICAnY2F0ZWdvcnknOiAnc2xpY2Vfam9pbicsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAneCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDEsXG4gICAgICAgICduYW1lJzogJ2F4aXMnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXJbXSdcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnU2xpY2UnLFxuICAgICdjYXRlZ29yeSc6ICdzbGljZV9qb2luJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd4JyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnYmVnaW4nLFxuICAgICAgICAndHlwZSc6ICdudW1iZXJbXSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDIsXG4gICAgICAgICduYW1lJzogJ3NpemUnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXJbXSdcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnU3RyaWRlZFNsaWNlJyxcbiAgICAnY2F0ZWdvcnknOiAnc2xpY2Vfam9pbicsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAneCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDEsXG4gICAgICAgICduYW1lJzogJ2JlZ2luJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyW10nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAyLFxuICAgICAgICAnbmFtZSc6ICdlbmQnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXJbXSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDMsXG4gICAgICAgICduYW1lJzogJ3N0cmlkZXMnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXJbXSdcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdiZWdpbl9tYXNrJyxcbiAgICAgICAgJ25hbWUnOiAnYmVnaW5NYXNrJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyJyxcbiAgICAgICAgJ2RlZmF1bHRWYWx1ZSc6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnZW5kX21hc2snLFxuICAgICAgICAnbmFtZSc6ICdlbmRNYXNrJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyJyxcbiAgICAgICAgJ2RlZmF1bHRWYWx1ZSc6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnbmV3X2F4aXNfbWFzaycsXG4gICAgICAgICduYW1lJzogJ25ld0F4aXNNYXNrJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyJyxcbiAgICAgICAgJ2RlZmF1bHRWYWx1ZSc6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnZWxsaXBzaXNfbWFzaycsXG4gICAgICAgICduYW1lJzogJ2VsbGlwc2lzTWFzaycsXG4gICAgICAgICd0eXBlJzogJ251bWJlcicsXG4gICAgICAgICdkZWZhdWx0VmFsdWUnOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ3Nocmlua19heGlzX21hc2snLFxuICAgICAgICAnbmFtZSc6ICdzaHJpbmtBeGlzTWFzaycsXG4gICAgICAgICd0eXBlJzogJ251bWJlcicsXG4gICAgICAgICdkZWZhdWx0VmFsdWUnOiAwXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ1BhY2snLFxuICAgICdjYXRlZ29yeSc6ICdzbGljZV9qb2luJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnZW5kJzogMCxcbiAgICAgICAgJ25hbWUnOiAndGVuc29ycycsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcnMnXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnYXhpcycsXG4gICAgICAgICduYW1lJzogJ2F4aXMnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInLFxuICAgICAgICAnZGVmYXVsdFZhbHVlJzogMFxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdVbnBhY2snLFxuICAgICdjYXRlZ29yeSc6ICdzbGljZV9qb2luJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd0ZW5zb3InLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnYXhpcycsXG4gICAgICAgICduYW1lJzogJ2F4aXMnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInLFxuICAgICAgICAnZGVmYXVsdFZhbHVlJzogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdudW0nLFxuICAgICAgICAnbmFtZSc6ICdudW0nLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInLFxuICAgICAgICAnZGVmYXVsdFZhbHVlJzogMCxcbiAgICAgICAgJ25vdFN1cHBvcnRlZCc6IHRydWVcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnVGlsZScsXG4gICAgJ2NhdGVnb3J5JzogJ3NsaWNlX2pvaW4nLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdyZXBzJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyW10nXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ1NwbGl0JyxcbiAgICAnY2F0ZWdvcnknOiAnc2xpY2Vfam9pbicsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAnYXhpcycsXG4gICAgICAgICd0eXBlJzogJ251bWJlcicsXG4gICAgICAgICdkZWZhdWx0VmFsdWUnOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICd4JyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfVxuICAgIF0sXG4gICAgJ2F0dHJzJzogW1xuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ251bV9zcGxpdCcsXG4gICAgICAgICduYW1lJzogJ251bU9yU2l6ZVNwbGl0cycsXG4gICAgICAgICd0eXBlJzogJ251bWJlcicsXG4gICAgICAgICdkZWZhdWx0VmFsdWUnOiAxXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ1NwbGl0VicsXG4gICAgJ2NhdGVnb3J5JzogJ3NsaWNlX2pvaW4nLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdudW1PclNpemVTcGxpdHMnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXJbXSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDIsXG4gICAgICAgICduYW1lJzogJ2F4aXMnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInLFxuICAgICAgICAnZGVmYXVsdFZhbHVlJzogMFxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdTY2F0dGVyTmQnLFxuICAgICdjYXRlZ29yeSc6ICdzbGljZV9qb2luJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICdpbmRpY2VzJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAndmFsdWVzJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMixcbiAgICAgICAgJ25hbWUnOiAnc2hhcGUnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXJbXSdcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnR2F0aGVyTmQnLFxuICAgICdjYXRlZ29yeSc6ICdzbGljZV9qb2luJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd4JyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnaW5kaWNlcycsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnU3BhcnNlVG9EZW5zZScsXG4gICAgJ2NhdGVnb3J5JzogJ3NsaWNlX2pvaW4nLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3NwYXJzZUluZGljZXMnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdvdXRwdXRTaGFwZScsXG4gICAgICAgICd0eXBlJzogJ251bWJlcltdJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMixcbiAgICAgICAgJ25hbWUnOiAnc3BhcnNlVmFsdWVzJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMyxcbiAgICAgICAgJ25hbWUnOiAnZGVmYXVsdFZhbHVlJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfVxuICAgIF0sXG4gICAgJ2F0dHJzJzogW1xuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ3ZhbGlkYXRlX2luZGljZXMnLFxuICAgICAgICAnbmFtZSc6ICd2YWxpZGF0ZUluZGljZXMnLFxuICAgICAgICAndHlwZSc6ICdib29sJyxcbiAgICAgICAgJ2RlZmF1bHRWYWx1ZSc6IGZhbHNlLFxuICAgICAgICAnbm90U3VwcG9ydGVkJzogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfVxuXTtcbiJdfQ==