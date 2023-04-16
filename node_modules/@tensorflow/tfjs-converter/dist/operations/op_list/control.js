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
        'tfOpName': 'EmptyTensorList',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'elementShape',
                'type': 'shape'
            },
            {
                'start': 1,
                'name': 'maxNumElements',
                'type': 'number'
            }
        ],
        'attrs': [
            {
                'tfName': 'element_dtype',
                'name': 'elementDType',
                'type': 'dtype'
            }
        ]
    },
    {
        'tfOpName': 'LoopCond',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'pred',
                'type': 'tensor'
            }
        ]
    },
    {
        'tfOpName': 'Switch',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'data',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'pred',
                'type': 'tensor'
            }
        ]
    },
    {
        'tfOpName': 'Merge',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'end': 0,
                'name': 'tensors',
                'type': 'tensors'
            }
        ]
    },
    {
        'tfOpName': 'Enter',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensor',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'T',
                'name': 'dtype',
                'type': 'dtype',
                'notSupported': true
            },
            {
                'tfName': 'frame_name',
                'name': 'frameName',
                'type': 'string'
            },
            {
                'tfName': 'is_constant',
                'name': 'isConstant',
                'type': 'bool'
            }
        ]
    },
    {
        'tfOpName': 'Exit',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensor',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'T',
                'name': 'dtype',
                'type': 'dtype',
                'notSupported': true
            }
        ]
    },
    {
        'tfOpName': 'NextIteration',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensor',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'T',
                'name': 'dtype',
                'type': 'dtype',
                'notSupported': true
            }
        ]
    },
    {
        'tfOpName': 'TensorArrayV3',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'size',
                'type': 'number'
            }
        ],
        'attrs': [
            {
                'tfName': 'dtype',
                'name': 'dtype',
                'type': 'dtype'
            },
            {
                'tfName': 'element_shape',
                'name': 'elementShape',
                'type': 'shape'
            },
            {
                'tfName': 'dynamic_size',
                'name': 'dynamicSize',
                'type': 'bool'
            },
            {
                'tfName': 'clear_after_read',
                'name': 'clearAfterRead',
                'type': 'bool'
            },
            {
                'tfName': 'identical_element_shapes',
                'name': 'identicalElementShapes',
                'type': 'bool'
            },
            {
                'tfName': 'tensor_array_name',
                'name': 'name',
                'type': 'string'
            }
        ]
    },
    {
        'tfOpName': 'TensorArrayWriteV3',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensorArrayId',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'index',
                'type': 'number'
            },
            {
                'start': 2,
                'name': 'tensor',
                'type': 'tensor'
            },
            {
                'start': 3,
                'name': 'flowIn',
                'type': 'number'
            }
        ],
        'attrs': [
            {
                'tfName': 'T',
                'name': 'dtype',
                'type': 'dtype',
                'notSupported': true
            }
        ]
    },
    {
        'tfOpName': 'TensorArrayReadV3',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensorArrayId',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'index',
                'type': 'number'
            },
            {
                'start': 2,
                'name': 'flowIn',
                'type': 'number'
            }
        ],
        'attrs': [
            {
                'tfName': 'dtype',
                'name': 'dtype',
                'type': 'dtype',
                'notSupported': true
            }
        ]
    },
    {
        'tfOpName': 'TensorArrayGatherV3',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensorArrayId',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'indices',
                'type': 'number[]'
            },
            {
                'start': 2,
                'name': 'flowIn',
                'type': 'number'
            }
        ],
        'attrs': [
            {
                'tfName': 'dtype',
                'name': 'dtype',
                'type': 'dtype'
            },
            {
                'tfName': 'element_shape',
                'name': 'elementShape',
                'type': 'shape'
            }
        ]
    },
    {
        'tfOpName': 'TensorArrayScatterV3',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensorArrayId',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'indices',
                'type': 'number[]'
            },
            {
                'start': 2,
                'name': 'tensor',
                'type': 'tensor'
            },
            {
                'start': 3,
                'name': 'flowIn',
                'type': 'number'
            }
        ],
        'attrs': [
            {
                'tfName': 'T',
                'name': 'dtype',
                'type': 'dtype'
            }
        ]
    },
    {
        'tfOpName': 'TensorArrayConcatV3',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensorArrayId',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'flowIn',
                'type': 'number'
            }
        ],
        'attrs': [
            {
                'tfName': 'dtype',
                'name': 'dtype',
                'type': 'dtype'
            },
            {
                'tfName': 'element_shape_except0',
                'name': 'elementShapeExcept0',
                'type': 'shape',
                'notSupported': true
            }
        ]
    },
    {
        'tfOpName': 'TensorArraySplitV3',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensorArrayId',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'tensor',
                'type': 'tensor'
            },
            {
                'start': 2,
                'name': 'lengths',
                'type': 'number[]'
            },
            {
                'start': 3,
                'name': 'flowIn',
                'type': 'number'
            }
        ],
        'attrs': [
            {
                'tfName': 'T',
                'name': 'dtype',
                'type': 'dtype'
            }
        ]
    },
    {
        'tfOpName': 'TensorArraySizeV3',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensorArrayId',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'flowIn',
                'type': 'number'
            }
        ]
    },
    {
        'tfOpName': 'TensorArrayCloseV3',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensorArrayId',
                'type': 'tensor'
            }
        ]
    },
    {
        'tfOpName': 'StatelessIf',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'cond',
                'type': 'tensor'
            },
            {
                'start': 1,
                'end': 0,
                'name': 'args',
                'type': 'tensors'
            }
        ],
        'attrs': [
            {
                'tfName': 'then_branch',
                'name': 'thenBranch',
                'type': 'func'
            },
            {
                'tfName': 'else_branch',
                'name': 'elseBranch',
                'type': 'func'
            }
        ]
    },
    {
        'tfOpName': 'If',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'cond',
                'type': 'tensor'
            },
            {
                'start': 1,
                'end': 0,
                'name': 'args',
                'type': 'tensors'
            }
        ],
        'attrs': [
            {
                'tfName': 'then_branch',
                'name': 'thenBranch',
                'type': 'func'
            },
            {
                'tfName': 'else_branch',
                'name': 'elseBranch',
                'type': 'func'
            }
        ]
    },
    {
        'tfOpName': 'StatelessWhile',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'end': 0,
                'name': 'args',
                'type': 'tensors'
            }
        ],
        'attrs': [
            {
                'tfName': 'cond',
                'name': 'cond',
                'type': 'func'
            },
            {
                'tfName': 'body',
                'name': 'body',
                'type': 'func'
            }
        ]
    },
    {
        'tfOpName': 'While',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'end': 0,
                'name': 'args',
                'type': 'tensors'
            }
        ],
        'attrs': [
            {
                'tfName': 'cond',
                'name': 'cond',
                'type': 'func'
            },
            {
                'tfName': 'body',
                'name': 'body',
                'type': 'func'
            }
        ]
    },
    {
        'tfOpName': 'TensorListScatter',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensor',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'indices',
                'type': 'number[]'
            },
            {
                'start': 2,
                'name': 'elementShape',
                'type': 'shape'
            }
        ],
        'attrs': [
            {
                'tfName': 'element_dtype',
                'name': 'elementDType',
                'type': 'dtype'
            }
        ]
    },
    {
        'tfOpName': 'TensorListScatterV2',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensor',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'indices',
                'type': 'number[]'
            },
            {
                'start': 2,
                'name': 'elementShape',
                'type': 'shape'
            },
            {
                'start': 3,
                'name': 'numElements',
                'type': 'number'
            }
        ],
        'attrs': [
            {
                'tfName': 'element_dtype',
                'name': 'elementDType',
                'type': 'dtype'
            }
        ]
    },
    {
        'tfOpName': 'TensorListGather',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensorListId',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'indices',
                'type': 'number[]'
            },
            {
                'start': 2,
                'name': 'elementShape',
                'type': 'shape'
            }
        ],
        'attrs': [
            {
                'tfName': 'element_dtype',
                'name': 'elementDType',
                'type': 'dtype'
            }
        ]
    },
    {
        'tfOpName': 'TensorListGetItem',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensorListId',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'index',
                'type': 'number'
            },
            {
                'start': 2,
                'name': 'elementShape',
                'type': 'shape'
            }
        ],
        'attrs': [
            {
                'tfName': 'element_dtype',
                'name': 'elementDType',
                'type': 'dtype'
            }
        ]
    },
    {
        'tfOpName': 'TensorListSetItem',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensorListId',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'index',
                'type': 'number'
            },
            {
                'start': 2,
                'name': 'tensor',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'element_dtype',
                'name': 'elementDType',
                'type': 'dtype'
            }
        ]
    },
    {
        'tfOpName': 'TensorListReserve',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'elementShape',
                'type': 'shape'
            },
            {
                'start': 1,
                'name': 'numElements',
                'type': 'number'
            }
        ],
        'attrs': [
            {
                'tfName': 'element_dtype',
                'name': 'elementDType',
                'type': 'dtype'
            }
        ]
    },
    {
        'tfOpName': 'TensorListFromTensor',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensor',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'elementShape',
                'type': 'shape'
            }
        ],
        'attrs': [
            {
                'tfName': 'element_dtype',
                'name': 'elementDType',
                'type': 'dtype'
            }
        ]
    },
    {
        'tfOpName': 'TensorListStack',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensorListId',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'elementShape',
                'type': 'shape'
            }
        ],
        'attrs': [
            {
                'tfName': 'element_dtype',
                'name': 'elementDType',
                'type': 'dtype'
            },
            {
                'tfName': 'num_elements',
                'name': 'numElements',
                'type': 'dtype'
            }
        ]
    },
    {
        'tfOpName': 'TensorListSplit',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensor',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'elementShape',
                'type': 'shape'
            },
            {
                'start': 2,
                'name': 'lengths',
                'type': 'number[]'
            }
        ],
        'attrs': [
            {
                'tfName': 'element_dtype',
                'name': 'elementDType',
                'type': 'dtype'
            }
        ]
    },
    {
        'tfOpName': 'TensorListConcat',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensorListId',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'element_shape',
                'name': 'elementShape',
                'type': 'shape'
            },
            {
                'tfName': 'element_dtype',
                'name': 'elementDType',
                'type': 'dtype'
            }
        ]
    },
    {
        'tfOpName': 'TensorListConcatV2',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensorListId',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'element_shape',
                'name': 'elementShape',
                'type': 'shape'
            },
            {
                'tfName': 'element_dtype',
                'name': 'elementDType',
                'type': 'dtype'
            }
        ]
    },
    {
        'tfOpName': 'TensorListPopBack',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensorListId',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'elementShape',
                'type': 'shape'
            }
        ],
        'attrs': [
            {
                'tfName': 'element_dtype',
                'name': 'elementDType',
                'type': 'dtype'
            }
        ]
    },
    {
        'tfOpName': 'TensorListPushBack',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensorListId',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'tensor',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'element_dtype',
                'name': 'elementDType',
                'type': 'dtype'
            }
        ]
    },
    {
        'tfOpName': 'TensorListLength',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensorListId',
                'type': 'tensor'
            }
        ]
    },
    {
        'tfOpName': 'TensorListResize',
        'category': 'control',
        'inputs': [
            {
                'start': 0,
                'name': 'tensorListId',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'size',
                'type': 'number'
            }
        ]
    }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29udmVydGVyL3NyYy9vcGVyYXRpb25zL29wX2xpc3QvY29udHJvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFJSCxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQWU7SUFDOUI7UUFDRSxVQUFVLEVBQUUsaUJBQWlCO1FBQzdCLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxjQUFjO2dCQUN0QixNQUFNLEVBQUUsT0FBTzthQUNoQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxnQkFBZ0I7Z0JBQ3hCLE1BQU0sRUFBRSxRQUFRO2FBQ2pCO1NBQ0Y7UUFDRCxPQUFPLEVBQUU7WUFDUDtnQkFDRSxRQUFRLEVBQUUsZUFBZTtnQkFDekIsTUFBTSxFQUFFLGNBQWM7Z0JBQ3RCLE1BQU0sRUFBRSxPQUFPO2FBQ2hCO1NBQ0Y7S0FDRjtJQUNEO1FBQ0UsVUFBVSxFQUFFLFVBQVU7UUFDdEIsVUFBVSxFQUFFLFNBQVM7UUFDckIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsTUFBTSxFQUFFLFFBQVE7YUFDakI7U0FDRjtLQUNGO0lBQ0Q7UUFDRSxVQUFVLEVBQUUsUUFBUTtRQUNwQixVQUFVLEVBQUUsU0FBUztRQUNyQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsTUFBTTtnQkFDZCxNQUFNLEVBQUUsUUFBUTthQUNqQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxNQUFNO2dCQUNkLE1BQU0sRUFBRSxRQUFRO2FBQ2pCO1NBQ0Y7S0FDRjtJ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VUFBVSxFQUFFLFNBQVM7UUFDckIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLGNBQWM7Z0JBQ3RCLE1BQU0sRUFBRSxRQUFRO2FBQ2pCO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLFFBQVE7Z0JBQ2hCLE1BQU0sRUFBRSxRQUFRO2FBQ2pCO1NBQ0Y7UUFDRCxPQUFPLEVBQUU7WUFDUDtnQkFDRSxRQUFRLEVBQUUsZUFBZTtnQkFDekIsTUFBTSxFQUFFLGNBQWM7Z0JBQ3RCLE1BQU0sRUFBRSxPQUFPO2FBQ2hCO1NBQ0Y7S0FDRjtJQUNEO1FBQ0UsVUFBVSxFQUFFLGtCQUFrQjtRQUM5QixVQUFVLEVBQUUsU0FBUztRQUNyQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsY0FBYztnQkFDdEIsTUFBTSxFQUFFLFFBQVE7YUFDakI7U0FDRjtLQUNGO0lBQ0Q7UUFDRSxVQUFVLEVBQUUsa0JBQWtCO1FBQzlCLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxjQUFjO2dCQUN0QixNQUFNLEVBQUUsUUFBUTthQUNqQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxNQUFNO2dCQUNkLE1BQU0sRUFBRSxRQUFRO2FBQ2pCO1NBQ0Y7S0FDRjtDQUNGLENBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIyIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtPcE1hcHBlcn0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY29uc3QganNvbjogT3BNYXBwZXJbXSA9IFtcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdFbXB0eVRlbnNvckxpc3QnLFxuICAgICdjYXRlZ29yeSc6ICdjb250cm9sJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICdlbGVtZW50U2hhcGUnLFxuICAgICAgICAndHlwZSc6ICdzaGFwZSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDEsXG4gICAgICAgICduYW1lJzogJ21heE51bUVsZW1lbnRzJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyJ1xuICAgICAgfVxuICAgIF0sXG4gICAgJ2F0dHJzJzogW1xuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ2VsZW1lbnRfZHR5cGUnLFxuICAgICAgICAnbmFtZSc6ICdlbGVtZW50RFR5cGUnLFxuICAgICAgICAndHlwZSc6ICdkdHlwZSdcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnTG9vcENvbmQnLFxuICAgICdjYXRlZ29yeSc6ICdjb250cm9sJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICdwcmVkJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdTd2l0Y2gnLFxuICAgICdjYXRlZ29yeSc6ICdjb250cm9sJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICdkYXRhJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAncHJlZCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnTWVyZ2UnLFxuICAgICdjYXRlZ29yeSc6ICdjb250cm9sJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnZW5kJzogMCxcbiAgICAgICAgJ25hbWUnOiAndGVuc29ycycsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcnMnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ0VudGVyJyxcbiAgICAnY2F0ZWdvcnknOiAnY29udHJvbCcsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAndGVuc29yJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfVxuICAgIF0sXG4gICAgJ2F0dHJzJzogW1xuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ1QnLFxuICAgICAgICAnbmFtZSc6ICdkdHlwZScsXG4gICAgICAgICd0eXBlJzogJ2R0eXBlJyxcbiAgICAgICAgJ25vdFN1cHBvcnRlZCc6IHRydWVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnZnJhbWVfbmFtZScsXG4gICAgICAgICduYW1lJzogJ2ZyYW1lTmFtZScsXG4gICAgICAgICd0eXBlJzogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnaXNfY29uc3RhbnQnLFxuICAgICAgICAnbmFtZSc6ICdpc0NvbnN0YW50JyxcbiAgICAgICAgJ3R5cGUnOiAnYm9vbCdcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnRXhpdCcsXG4gICAgJ2NhdGVnb3J5JzogJ2NvbnRyb2wnLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3RlbnNvcicsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdUJyxcbiAgICAgICAgJ25hbWUnOiAnZHR5cGUnLFxuICAgICAgICAndHlwZSc6ICdkdHlwZScsXG4gICAgICAgICdub3RTdXBwb3J0ZWQnOiB0cnVlXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ05leHRJdGVyYXRpb24nLFxuICAgICdjYXRlZ29yeSc6ICdjb250cm9sJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd0ZW5zb3InLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnVCcsXG4gICAgICAgICduYW1lJzogJ2R0eXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnZHR5cGUnLFxuICAgICAgICAnbm90U3VwcG9ydGVkJzogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdUZW5zb3JBcnJheVYzJyxcbiAgICAnY2F0ZWdvcnknOiAnY29udHJvbCcsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAnc2l6ZScsXG4gICAgICAgICd0eXBlJzogJ251bWJlcidcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdkdHlwZScsXG4gICAgICAgICduYW1lJzogJ2R0eXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnZHR5cGUnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ2VsZW1lbnRfc2hhcGUnLFxuICAgICAgICAnbmFtZSc6ICdlbGVtZW50U2hhcGUnLFxuICAgICAgICAndHlwZSc6ICdzaGFwZSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnZHluYW1pY19zaXplJyxcbiAgICAgICAgJ25hbWUnOiAnZHluYW1pY1NpemUnLFxuICAgICAgICAndHlwZSc6ICdib29sJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdjbGVhcl9hZnRlcl9yZWFkJyxcbiAgICAgICAgJ25hbWUnOiAnY2xlYXJBZnRlclJlYWQnLFxuICAgICAgICAndHlwZSc6ICdib29sJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdpZGVudGljYWxfZWxlbWVudF9zaGFwZXMnLFxuICAgICAgICAnbmFtZSc6ICdpZGVudGljYWxFbGVtZW50U2hhcGVzJyxcbiAgICAgICAgJ3R5cGUnOiAnYm9vbCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAndGVuc29yX2FycmF5X25hbWUnLFxuICAgICAgICAnbmFtZSc6ICduYW1lJyxcbiAgICAgICAgJ3R5cGUnOiAnc3RyaW5nJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdUZW5zb3JBcnJheVdyaXRlVjMnLFxuICAgICdjYXRlZ29yeSc6ICdjb250cm9sJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd0ZW5zb3JBcnJheUlkJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnaW5kZXgnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAyLFxuICAgICAgICAnbmFtZSc6ICd0ZW5zb3InLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAzLFxuICAgICAgICAnbmFtZSc6ICdmbG93SW4nLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnVCcsXG4gICAgICAgICduYW1lJzogJ2R0eXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnZHR5cGUnLFxuICAgICAgICAnbm90U3VwcG9ydGVkJzogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdUZW5zb3JBcnJheVJlYWRWMycsXG4gICAgJ2NhdGVnb3J5JzogJ2NvbnRyb2wnLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3RlbnNvckFycmF5SWQnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdpbmRleCcsXG4gICAgICAgICd0eXBlJzogJ251bWJlcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDIsXG4gICAgICAgICduYW1lJzogJ2Zsb3dJbicsXG4gICAgICAgICd0eXBlJzogJ251bWJlcidcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdkdHlwZScsXG4gICAgICAgICduYW1lJzogJ2R0eXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnZHR5cGUnLFxuICAgICAgICAnbm90U3VwcG9ydGVkJzogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdUZW5zb3JBcnJheUdhdGhlclYzJyxcbiAgICAnY2F0ZWdvcnknOiAnY29udHJvbCcsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAndGVuc29yQXJyYXlJZCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDEsXG4gICAgICAgICduYW1lJzogJ2luZGljZXMnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXJbXSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDIsXG4gICAgICAgICduYW1lJzogJ2Zsb3dJbicsXG4gICAgICAgICd0eXBlJzogJ251bWJlcidcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdkdHlwZScsXG4gICAgICAgICduYW1lJzogJ2R0eXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnZHR5cGUnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ2VsZW1lbnRfc2hhcGUnLFxuICAgICAgICAnbmFtZSc6ICdlbGVtZW50U2hhcGUnLFxuICAgICAgICAndHlwZSc6ICdzaGFwZSdcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnVGVuc29yQXJyYXlTY2F0dGVyVjMnLFxuICAgICdjYXRlZ29yeSc6ICdjb250cm9sJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd0ZW5zb3JBcnJheUlkJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnaW5kaWNlcycsXG4gICAgICAgICd0eXBlJzogJ251bWJlcltdJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMixcbiAgICAgICAgJ25hbWUnOiAndGVuc29yJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMyxcbiAgICAgICAgJ25hbWUnOiAnZmxvd0luJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyJ1xuICAgICAgfVxuICAgIF0sXG4gICAgJ2F0dHJzJzogW1xuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ1QnLFxuICAgICAgICAnbmFtZSc6ICdkdHlwZScsXG4gICAgICAgICd0eXBlJzogJ2R0eXBlJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdUZW5zb3JBcnJheUNvbmNhdFYzJyxcbiAgICAnY2F0ZWdvcnknOiAnY29udHJvbCcsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAndGVuc29yQXJyYXlJZCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDEsXG4gICAgICAgICduYW1lJzogJ2Zsb3dJbicsXG4gICAgICAgICd0eXBlJzogJ251bWJlcidcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdkdHlwZScsXG4gICAgICAgICduYW1lJzogJ2R0eXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnZHR5cGUnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ2VsZW1lbnRfc2hhcGVfZXhjZXB0MCcsXG4gICAgICAgICduYW1lJzogJ2VsZW1lbnRTaGFwZUV4Y2VwdDAnLFxuICAgICAgICAndHlwZSc6ICdzaGFwZScsXG4gICAgICAgICdub3RTdXBwb3J0ZWQnOiB0cnVlXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ1RlbnNvckFycmF5U3BsaXRWMycsXG4gICAgJ2NhdGVnb3J5JzogJ2NvbnRyb2wnLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3RlbnNvckFycmF5SWQnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICd0ZW5zb3InLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAyLFxuICAgICAgICAnbmFtZSc6ICdsZW5ndGhzJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyW10nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAzLFxuICAgICAgICAnbmFtZSc6ICdmbG93SW4nLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnVCcsXG4gICAgICAgICduYW1lJzogJ2R0eXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnZHR5cGUnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ1RlbnNvckFycmF5U2l6ZVYzJyxcbiAgICAnY2F0ZWdvcnknOiAnY29udHJvbCcsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAndGVuc29yQXJyYXlJZCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDEsXG4gICAgICAgICduYW1lJzogJ2Zsb3dJbicsXG4gICAgICAgICd0eXBlJzogJ251bWJlcidcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnVGVuc29yQXJyYXlDbG9zZVYzJyxcbiAgICAnY2F0ZWdvcnknOiAnY29udHJvbCcsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAndGVuc29yQXJyYXlJZCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnU3RhdGVsZXNzSWYnLFxuICAgICdjYXRlZ29yeSc6ICdjb250cm9sJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICdjb25kJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ2VuZCc6IDAsXG4gICAgICAgICduYW1lJzogJ2FyZ3MnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3JzJ1xuICAgICAgfVxuICAgIF0sXG4gICAgJ2F0dHJzJzogW1xuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ3RoZW5fYnJhbmNoJyxcbiAgICAgICAgJ25hbWUnOiAndGhlbkJyYW5jaCcsXG4gICAgICAgICd0eXBlJzogJ2Z1bmMnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ2Vsc2VfYnJhbmNoJyxcbiAgICAgICAgJ25hbWUnOiAnZWxzZUJyYW5jaCcsXG4gICAgICAgICd0eXBlJzogJ2Z1bmMnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ0lmJyxcbiAgICAnY2F0ZWdvcnknOiAnY29udHJvbCcsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAnY29uZCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDEsXG4gICAgICAgICdlbmQnOiAwLFxuICAgICAgICAnbmFtZSc6ICdhcmdzJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29ycydcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICd0aGVuX2JyYW5jaCcsXG4gICAgICAgICduYW1lJzogJ3RoZW5CcmFuY2gnLFxuICAgICAgICAndHlwZSc6ICdmdW5jJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdlbHNlX2JyYW5jaCcsXG4gICAgICAgICduYW1lJzogJ2Vsc2VCcmFuY2gnLFxuICAgICAgICAndHlwZSc6ICdmdW5jJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdTdGF0ZWxlc3NXaGlsZScsXG4gICAgJ2NhdGVnb3J5JzogJ2NvbnRyb2wnLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICdlbmQnOiAwLFxuICAgICAgICAnbmFtZSc6ICdhcmdzJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29ycydcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdjb25kJyxcbiAgICAgICAgJ25hbWUnOiAnY29uZCcsXG4gICAgICAgICd0eXBlJzogJ2Z1bmMnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ2JvZHknLFxuICAgICAgICAnbmFtZSc6ICdib2R5JyxcbiAgICAgICAgJ3R5cGUnOiAnZnVuYydcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnV2hpbGUnLFxuICAgICdjYXRlZ29yeSc6ICdjb250cm9sJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnZW5kJzogMCxcbiAgICAgICAgJ25hbWUnOiAnYXJncycsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcnMnXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnY29uZCcsXG4gICAgICAgICduYW1lJzogJ2NvbmQnLFxuICAgICAgICAndHlwZSc6ICdmdW5jJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdib2R5JyxcbiAgICAgICAgJ25hbWUnOiAnYm9keScsXG4gICAgICAgICd0eXBlJzogJ2Z1bmMnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ1RlbnNvckxpc3RTY2F0dGVyJyxcbiAgICAnY2F0ZWdvcnknOiAnY29udHJvbCcsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAndGVuc29yJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnaW5kaWNlcycsXG4gICAgICAgICd0eXBlJzogJ251bWJlcltdJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMixcbiAgICAgICAgJ25hbWUnOiAnZWxlbWVudFNoYXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnc2hhcGUnXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnZWxlbWVudF9kdHlwZScsXG4gICAgICAgICduYW1lJzogJ2VsZW1lbnREVHlwZScsXG4gICAgICAgICd0eXBlJzogJ2R0eXBlJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdUZW5zb3JMaXN0U2NhdHRlclYyJyxcbiAgICAnY2F0ZWdvcnknOiAnY29udHJvbCcsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAndGVuc29yJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnaW5kaWNlcycsXG4gICAgICAgICd0eXBlJzogJ251bWJlcltdJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMixcbiAgICAgICAgJ25hbWUnOiAnZWxlbWVudFNoYXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnc2hhcGUnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAzLFxuICAgICAgICAnbmFtZSc6ICdudW1FbGVtZW50cycsXG4gICAgICAgICd0eXBlJzogJ251bWJlcidcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdlbGVtZW50X2R0eXBlJyxcbiAgICAgICAgJ25hbWUnOiAnZWxlbWVudERUeXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnZHR5cGUnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ1RlbnNvckxpc3RHYXRoZXInLFxuICAgICdjYXRlZ29yeSc6ICdjb250cm9sJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd0ZW5zb3JMaXN0SWQnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdpbmRpY2VzJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyW10nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAyLFxuICAgICAgICAnbmFtZSc6ICdlbGVtZW50U2hhcGUnLFxuICAgICAgICAndHlwZSc6ICdzaGFwZSdcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdlbGVtZW50X2R0eXBlJyxcbiAgICAgICAgJ25hbWUnOiAnZWxlbWVudERUeXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnZHR5cGUnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ1RlbnNvckxpc3RHZXRJdGVtJyxcbiAgICAnY2F0ZWdvcnknOiAnY29udHJvbCcsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAndGVuc29yTGlzdElkJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnaW5kZXgnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAyLFxuICAgICAgICAnbmFtZSc6ICdlbGVtZW50U2hhcGUnLFxuICAgICAgICAndHlwZSc6ICdzaGFwZSdcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdlbGVtZW50X2R0eXBlJyxcbiAgICAgICAgJ25hbWUnOiAnZWxlbWVudERUeXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnZHR5cGUnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ1RlbnNvckxpc3RTZXRJdGVtJyxcbiAgICAnY2F0ZWdvcnknOiAnY29udHJvbCcsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAndGVuc29yTGlzdElkJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnaW5kZXgnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAyLFxuICAgICAgICAnbmFtZSc6ICd0ZW5zb3InLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnZWxlbWVudF9kdHlwZScsXG4gICAgICAgICduYW1lJzogJ2VsZW1lbnREVHlwZScsXG4gICAgICAgICd0eXBlJzogJ2R0eXBlJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdUZW5zb3JMaXN0UmVzZXJ2ZScsXG4gICAgJ2NhdGVnb3J5JzogJ2NvbnRyb2wnLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ2VsZW1lbnRTaGFwZScsXG4gICAgICAgICd0eXBlJzogJ3NoYXBlJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnbnVtRWxlbWVudHMnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnZWxlbWVudF9kdHlwZScsXG4gICAgICAgICduYW1lJzogJ2VsZW1lbnREVHlwZScsXG4gICAgICAgICd0eXBlJzogJ2R0eXBlJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdUZW5zb3JMaXN0RnJvbVRlbnNvcicsXG4gICAgJ2NhdGVnb3J5JzogJ2NvbnRyb2wnLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3RlbnNvcicsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDEsXG4gICAgICAgICduYW1lJzogJ2VsZW1lbnRTaGFwZScsXG4gICAgICAgICd0eXBlJzogJ3NoYXBlJ1xuICAgICAgfVxuICAgIF0sXG4gICAgJ2F0dHJzJzogW1xuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ2VsZW1lbnRfZHR5cGUnLFxuICAgICAgICAnbmFtZSc6ICdlbGVtZW50RFR5cGUnLFxuICAgICAgICAndHlwZSc6ICdkdHlwZSdcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnVGVuc29yTGlzdFN0YWNrJyxcbiAgICAnY2F0ZWdvcnknOiAnY29udHJvbCcsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAndGVuc29yTGlzdElkJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnZWxlbWVudFNoYXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnc2hhcGUnXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnZWxlbWVudF9kdHlwZScsXG4gICAgICAgICduYW1lJzogJ2VsZW1lbnREVHlwZScsXG4gICAgICAgICd0eXBlJzogJ2R0eXBlJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdudW1fZWxlbWVudHMnLFxuICAgICAgICAnbmFtZSc6ICdudW1FbGVtZW50cycsXG4gICAgICAgICd0eXBlJzogJ2R0eXBlJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdUZW5zb3JMaXN0U3BsaXQnLFxuICAgICdjYXRlZ29yeSc6ICdjb250cm9sJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd0ZW5zb3InLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdlbGVtZW50U2hhcGUnLFxuICAgICAgICAndHlwZSc6ICdzaGFwZSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDIsXG4gICAgICAgICduYW1lJzogJ2xlbmd0aHMnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXJbXSdcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdlbGVtZW50X2R0eXBlJyxcbiAgICAgICAgJ25hbWUnOiAnZWxlbWVudERUeXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnZHR5cGUnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ1RlbnNvckxpc3RDb25jYXQnLFxuICAgICdjYXRlZ29yeSc6ICdjb250cm9sJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd0ZW5zb3JMaXN0SWQnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnZWxlbWVudF9zaGFwZScsXG4gICAgICAgICduYW1lJzogJ2VsZW1lbnRTaGFwZScsXG4gICAgICAgICd0eXBlJzogJ3NoYXBlJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdlbGVtZW50X2R0eXBlJyxcbiAgICAgICAgJ25hbWUnOiAnZWxlbWVudERUeXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnZHR5cGUnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ1RlbnNvckxpc3RDb25jYXRWMicsXG4gICAgJ2NhdGVnb3J5JzogJ2NvbnRyb2wnLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3RlbnNvckxpc3RJZCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdlbGVtZW50X3NoYXBlJyxcbiAgICAgICAgJ25hbWUnOiAnZWxlbWVudFNoYXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnc2hhcGUnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ2VsZW1lbnRfZHR5cGUnLFxuICAgICAgICAnbmFtZSc6ICdlbGVtZW50RFR5cGUnLFxuICAgICAgICAndHlwZSc6ICdkdHlwZSdcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnVGVuc29yTGlzdFBvcEJhY2snLFxuICAgICdjYXRlZ29yeSc6ICdjb250cm9sJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd0ZW5zb3JMaXN0SWQnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdlbGVtZW50U2hhcGUnLFxuICAgICAgICAndHlwZSc6ICdzaGFwZSdcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdlbGVtZW50X2R0eXBlJyxcbiAgICAgICAgJ25hbWUnOiAnZWxlbWVudERUeXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnZHR5cGUnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ1RlbnNvckxpc3RQdXNoQmFjaycsXG4gICAgJ2NhdGVnb3J5JzogJ2NvbnRyb2wnLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3RlbnNvckxpc3RJZCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDEsXG4gICAgICAgICduYW1lJzogJ3RlbnNvcicsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdlbGVtZW50X2R0eXBlJyxcbiAgICAgICAgJ25hbWUnOiAnZWxlbWVudERUeXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnZHR5cGUnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ1RlbnNvckxpc3RMZW5ndGgnLFxuICAgICdjYXRlZ29yeSc6ICdjb250cm9sJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd0ZW5zb3JMaXN0SWQnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ1RlbnNvckxpc3RSZXNpemUnLFxuICAgICdjYXRlZ29yeSc6ICdjb250cm9sJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd0ZW5zb3JMaXN0SWQnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdzaXplJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyJ1xuICAgICAgfVxuICAgIF1cbiAgfVxuXVxuO1xuIl19