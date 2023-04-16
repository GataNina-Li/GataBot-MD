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
        'tfOpName': 'Cast',
        'category': 'transformation',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'SrcT',
                'name': 'sdtype',
                'type': 'dtype',
                'notSupported': true
            },
            {
                'tfName': 'DstT',
                'name': 'dtype',
                'type': 'dtype'
            }
        ]
    },
    {
        'tfOpName': 'ExpandDims',
        'category': 'transformation',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'axis',
                'type': 'number'
            }
        ]
    },
    {
        'tfOpName': 'MirrorPad',
        'category': 'transformation',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'padding',
                'type': 'number[]'
            }
        ],
        'attrs': [
            {
                'tfName': 'mode',
                'name': 'mode',
                'type': 'string'
            }
        ]
    },
    {
        'tfOpName': 'Pad',
        'category': 'transformation',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'padding',
                'type': 'number[]'
            }
        ],
        'attrs': [
            {
                'tfName': 'constant_value',
                'name': 'constantValue',
                'type': 'number',
                'defaultValue': 0
            }
        ]
    },
    {
        'tfOpName': 'PadV2',
        'category': 'transformation',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'padding',
                'type': 'number[]'
            },
            {
                'start': 2,
                'name': 'constantValue',
                'type': 'number',
                'defaultValue': 0
            }
        ]
    },
    {
        'tfOpName': 'Reshape',
        'category': 'transformation',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'shape',
                'type': 'number[]'
            }
        ]
    },
    {
        'tfOpName': 'Squeeze',
        'category': 'transformation',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'axis',
                'tfDeprecatedName': 'squeeze_dims',
                'name': 'axis',
                'type': 'number[]'
            }
        ]
    },
    {
        'tfOpName': 'SpaceToBatchND',
        'category': 'transformation',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'blockShape',
                'type': 'number[]'
            },
            {
                'start': 2,
                'name': 'paddings',
                'type': 'number[]'
            }
        ]
    },
    {
        'tfOpName': 'BatchToSpaceND',
        'category': 'transformation',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'blockShape',
                'type': 'number[]'
            },
            {
                'start': 2,
                'name': 'crops',
                'type': 'number[]'
            }
        ]
    },
    {
        'tfOpName': 'DepthToSpace',
        'category': 'transformation',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'block_size',
                'name': 'blockSize',
                'type': 'number'
            },
            {
                'tfName': 'data_format',
                'name': 'dataFormat',
                'type': 'string'
            }
        ]
    },
    {
        'tfOpName': 'BroadcastTo',
        'category': 'transformation',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'shape',
                'type': 'number[]'
            }
        ],
        'attrs': []
    },
    {
        'tfOpName': 'BroadcastArgs',
        'category': 'transformation',
        'inputs': [
            {
                'start': 0,
                'name': 's0',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 's1',
                'type': 'tensor'
            }
        ],
        'attrs': []
    }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvbnZlcnRlci9zcmMvb3BlcmF0aW9ucy9vcF9saXN0L3RyYW5zZm9ybWF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUlILE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBZTtJQUM5QjtRQUNFLFVBQVUsRUFBRSxNQUFNO1FBQ2xCLFVBQVUsRUFBRSxnQkFBZ0I7UUFDNUIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLEdBQUc7Z0JBQ1gsTUFBTSxFQUFFLFFBQVE7YUFDakI7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQO2dCQUNFLFFBQVEsRUFBRSxNQUFNO2dCQUNoQixNQUFNLEVBQUUsUUFBUTtnQkFDaEIsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsY0FBYyxFQUFFLElBQUk7YUFDckI7WUFDRDtnQkFDRSxRQUFRLEVBQUUsTUFBTTtnQkFDaEIsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsTUFBTSxFQUFFLE9BQU87YUFDaEI7U0FDRjtLQUNGO0lBQ0Q7UUFDRSxVQUFVLEVBQUUsWUFBWTtRQUN4QixVQUFVLEVBQUUsZ0JBQWdCO1FBQzVCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxHQUFHO2dCQUNYLE1BQU0sRUFBRSxRQUFRO2FBQ2pCO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsTUFBTSxFQUFFLFFBQVE7YUFDakI7U0FDRjtLQUNGO0lBQ0Q7UUFDRSxVQUFVLEVBQUUsV0FBVztRQUN2QixVQUFVLEVBQUUsZ0JBQWdCO1FBQzVCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxHQUFHO2dC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QUk7Z0JBQ1osTUFBTSxFQUFFLFFBQVE7YUFDakI7U0FDRjtRQUNELE9BQU8sRUFBRSxFQUFFO0tBQ1o7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7T3BNYXBwZXJ9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IGpzb246IE9wTWFwcGVyW10gPSBbXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnQ2FzdCcsXG4gICAgJ2NhdGVnb3J5JzogJ3RyYW5zZm9ybWF0aW9uJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd4JyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfVxuICAgIF0sXG4gICAgJ2F0dHJzJzogW1xuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ1NyY1QnLFxuICAgICAgICAnbmFtZSc6ICdzZHR5cGUnLFxuICAgICAgICAndHlwZSc6ICdkdHlwZScsXG4gICAgICAgICdub3RTdXBwb3J0ZWQnOiB0cnVlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ0RzdFQnLFxuICAgICAgICAnbmFtZSc6ICdkdHlwZScsXG4gICAgICAgICd0eXBlJzogJ2R0eXBlJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdFeHBhbmREaW1zJyxcbiAgICAnY2F0ZWdvcnknOiAndHJhbnNmb3JtYXRpb24nLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdheGlzJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdNaXJyb3JQYWQnLFxuICAgICdjYXRlZ29yeSc6ICd0cmFuc2Zvcm1hdGlvbicsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAneCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDEsXG4gICAgICAgICduYW1lJzogJ3BhZGRpbmcnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXJbXSdcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdtb2RlJyxcbiAgICAgICAgJ25hbWUnOiAnbW9kZScsXG4gICAgICAgICd0eXBlJzogJ3N0cmluZydcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnUGFkJyxcbiAgICAnY2F0ZWdvcnknOiAndHJhbnNmb3JtYXRpb24nLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdwYWRkaW5nJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyW10nXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnY29uc3RhbnRfdmFsdWUnLFxuICAgICAgICAnbmFtZSc6ICdjb25zdGFudFZhbHVlJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyJyxcbiAgICAgICAgJ2RlZmF1bHRWYWx1ZSc6IDBcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnUGFkVjInLFxuICAgICdjYXRlZ29yeSc6ICd0cmFuc2Zvcm1hdGlvbicsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAneCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDEsXG4gICAgICAgICduYW1lJzogJ3BhZGRpbmcnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXJbXSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDIsXG4gICAgICAgICduYW1lJzogJ2NvbnN0YW50VmFsdWUnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInLFxuICAgICAgICAnZGVmYXVsdFZhbHVlJzogMFxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdSZXNoYXBlJyxcbiAgICAnY2F0ZWdvcnknOiAndHJhbnNmb3JtYXRpb24nLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdzaGFwZScsXG4gICAgICAgICd0eXBlJzogJ251bWJlcltdJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdTcXVlZXplJyxcbiAgICAnY2F0ZWdvcnknOiAndHJhbnNmb3JtYXRpb24nLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnYXhpcycsXG4gICAgICAgICd0ZkRlcHJlY2F0ZWROYW1lJzogJ3NxdWVlemVfZGltcycsXG4gICAgICAgICduYW1lJzogJ2F4aXMnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXJbXSdcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnU3BhY2VUb0JhdGNoTkQnLFxuICAgICdjYXRlZ29yeSc6ICd0cmFuc2Zvcm1hdGlvbicsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAneCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDEsXG4gICAgICAgICduYW1lJzogJ2Jsb2NrU2hhcGUnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXJbXSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDIsXG4gICAgICAgICduYW1lJzogJ3BhZGRpbmdzJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyW10nXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ0JhdGNoVG9TcGFjZU5EJyxcbiAgICAnY2F0ZWdvcnknOiAndHJhbnNmb3JtYXRpb24nLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdibG9ja1NoYXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyW10nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAyLFxuICAgICAgICAnbmFtZSc6ICdjcm9wcycsXG4gICAgICAgICd0eXBlJzogJ251bWJlcltdJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdEZXB0aFRvU3BhY2UnLFxuICAgICdjYXRlZ29yeSc6ICd0cmFuc2Zvcm1hdGlvbicsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAneCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdibG9ja19zaXplJyxcbiAgICAgICAgJ25hbWUnOiAnYmxvY2tTaXplJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdkYXRhX2Zvcm1hdCcsXG4gICAgICAgICduYW1lJzogJ2RhdGFGb3JtYXQnLFxuICAgICAgICAndHlwZSc6ICdzdHJpbmcnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ0Jyb2FkY2FzdFRvJyxcbiAgICAnY2F0ZWdvcnknOiAndHJhbnNmb3JtYXRpb24nLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdzaGFwZScsXG4gICAgICAgICd0eXBlJzogJ251bWJlcltdJ1xuICAgICAgfVxuICAgIF0sXG4gICAgJ2F0dHJzJzogW11cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdCcm9hZGNhc3RBcmdzJyxcbiAgICAnY2F0ZWdvcnknOiAndHJhbnNmb3JtYXRpb24nLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3MwJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnczEnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXVxuICB9XG5dO1xuIl19