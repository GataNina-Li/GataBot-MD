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
        'tfOpName': 'Bincount',
        'category': 'reduction',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'size',
                'type': 'number'
            },
            {
                'start': 2,
                'name': 'weights',
                'type': 'tensor'
            }
        ]
    },
    {
        'tfOpName': 'DenseBincount',
        'category': 'reduction',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'size',
                'type': 'number'
            },
            {
                'start': 2,
                'name': 'weights',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'binary_output',
                'name': 'binaryOutput',
                'type': 'bool'
            }
        ]
    },
    {
        'tfOpName': 'Max',
        'category': 'reduction',
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
                'type': 'bool'
            }
        ]
    },
    {
        'tfOpName': 'Mean',
        'category': 'reduction',
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
                'type': 'bool'
            }
        ]
    },
    {
        'tfOpName': 'Min',
        'category': 'reduction',
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
                'type': 'bool'
            }
        ]
    },
    {
        'tfOpName': 'Sum',
        'category': 'reduction',
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
                'type': 'bool'
            }
        ]
    },
    {
        'tfOpName': 'All',
        'category': 'reduction',
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
                'type': 'bool'
            }
        ]
    },
    {
        'tfOpName': 'Any',
        'category': 'reduction',
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
                'type': 'bool'
            }
        ]
    },
    {
        'tfOpName': 'ArgMax',
        'category': 'reduction',
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
        'tfOpName': 'ArgMin',
        'category': 'reduction',
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
        'tfOpName': 'Prod',
        'category': 'reduction',
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
                'type': 'bool'
            }
        ]
    },
    {
        'tfOpName': 'Cumprod',
        'category': 'reduction',
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
        ],
        'attrs': [
            {
                'tfName': 'exclusive',
                'name': 'exclusive',
                'type': 'bool'
            },
            {
                'tfName': 'reverse',
                'name': 'reverse',
                'type': 'bool'
            }
        ]
    },
    {
        'tfOpName': 'Cumsum',
        'category': 'reduction',
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
        ],
        'attrs': [
            {
                'tfName': 'exclusive',
                'name': 'exclusive',
                'type': 'bool'
            },
            {
                'tfName': 'reverse',
                'name': 'reverse',
                'type': 'bool'
            }
        ]
    }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkdWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb252ZXJ0ZXIvc3JjL29wZXJhdGlvbnMvb3BfbGlzdC9yZWR1Y3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBSUgsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFlO0lBQzlCO1FBQ0UsVUFBVSxFQUFFLFVBQVU7UUFDdEIsVUFBVSxFQUFFLFdBQVc7UUFDdkIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLEdBQUc7Z0JBQ1gsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsTUFBTTtnQkFDZCxNQUFNLEVBQUUsUUFBUTthQUNqQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixNQUFNLEVBQUUsUUFBUTthQUNqQjtTQUNGO0tBQ0Y7SUFDRDtRQUNFLFVBQVUsRUFBRSxlQUFlO1FBQzNCLFVBQVUsRUFBRSxXQUFXO1FBQ3ZCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxHQUFHO2dCQUNYLE1BQU0sRUFBRSxRQUFRO2FBQ2pCO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsU0FBUztnQkFDakIsTUFBTSxFQUFFLFFBQVE7YUFDakI7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQO2dCQUNFLFFBQVEsRUFBRSxlQUFlO2dCQUN6QixNQUFNLEVBQUUsY0FBYztnQkFDdEIsTUFBTSxFQUFFLE1BQU07YUFDZjtTQUNGO0tBQ0Y7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USxFQUFFO1lBQ1I7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLEdBQUc7Z0JBQ1gsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsTUFBTTtnQkFDZCxNQUFNLEVBQUUsUUFBUTthQUNqQjtTQUNGO1FBQ0QsT0FBTyxFQUFFO1lBQ1A7Z0JBQ0UsUUFBUSxFQUFFLFdBQVc7Z0JBQ3JCLE1BQU0sRUFBRSxXQUFXO2dCQUNuQixNQUFNLEVBQUUsTUFBTTthQUNmO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixNQUFNLEVBQUUsTUFBTTthQUNmO1NBQ0Y7S0FDRjtJQUNEO1FBQ0UsVUFBVSxFQUFFLFFBQVE7UUFDcEIsVUFBVSxFQUFFLFdBQVc7UUFDdkIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLEdBQUc7Z0JBQ1gsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsTUFBTTtnQkFDZCxNQUFNLEVBQUUsUUFBUTthQUNqQjtTQUNGO1FBQ0QsT0FBTyxFQUFFO1lBQ1A7Z0JBQ0UsUUFBUSxFQUFFLFdBQVc7Z0JBQ3JCLE1BQU0sRUFBRSxXQUFXO2dCQUNuQixNQUFNLEVBQUUsTUFBTTthQUNmO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixNQUFNLEVBQUUsTUFBTTthQUNmO1NBQ0Y7S0FDRjtDQUNGLENBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIyIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtPcE1hcHBlcn0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY29uc3QganNvbjogT3BNYXBwZXJbXSA9IFtcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdCaW5jb3VudCcsXG4gICAgJ2NhdGVnb3J5JzogJ3JlZHVjdGlvbicsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAneCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDEsXG4gICAgICAgICduYW1lJzogJ3NpemUnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAyLFxuICAgICAgICAnbmFtZSc6ICd3ZWlnaHRzJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdEZW5zZUJpbmNvdW50JyxcbiAgICAnY2F0ZWdvcnknOiAncmVkdWN0aW9uJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd4JyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnc2l6ZScsXG4gICAgICAgICd0eXBlJzogJ251bWJlcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDIsXG4gICAgICAgICduYW1lJzogJ3dlaWdodHMnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnYmluYXJ5X291dHB1dCcsXG4gICAgICAgICduYW1lJzogJ2JpbmFyeU91dHB1dCcsXG4gICAgICAgICd0eXBlJzogJ2Jvb2wnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ01heCcsXG4gICAgJ2NhdGVnb3J5JzogJ3JlZHVjdGlvbicsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAneCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDEsXG4gICAgICAgICduYW1lJzogJ2F4aXMnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXJbXSdcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdrZWVwX2RpbXMnLFxuICAgICAgICAnbmFtZSc6ICdrZWVwRGltcycsXG4gICAgICAgICd0eXBlJzogJ2Jvb2wnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ01lYW4nLFxuICAgICdjYXRlZ29yeSc6ICdyZWR1Y3Rpb24nLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdheGlzJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyW10nXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAna2VlcF9kaW1zJyxcbiAgICAgICAgJ25hbWUnOiAna2VlcERpbXMnLFxuICAgICAgICAndHlwZSc6ICdib29sJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdNaW4nLFxuICAgICdjYXRlZ29yeSc6ICdyZWR1Y3Rpb24nLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdheGlzJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyW10nXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAna2VlcF9kaW1zJyxcbiAgICAgICAgJ25hbWUnOiAna2VlcERpbXMnLFxuICAgICAgICAndHlwZSc6ICdib29sJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdTdW0nLFxuICAgICdjYXRlZ29yeSc6ICdyZWR1Y3Rpb24nLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdheGlzJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyW10nXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAna2VlcF9kaW1zJyxcbiAgICAgICAgJ25hbWUnOiAna2VlcERpbXMnLFxuICAgICAgICAndHlwZSc6ICdib29sJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdBbGwnLFxuICAgICdjYXRlZ29yeSc6ICdyZWR1Y3Rpb24nLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdheGlzJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyW10nXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAna2VlcF9kaW1zJyxcbiAgICAgICAgJ25hbWUnOiAna2VlcERpbXMnLFxuICAgICAgICAndHlwZSc6ICdib29sJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdBbnknLFxuICAgICdjYXRlZ29yeSc6ICdyZWR1Y3Rpb24nLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdheGlzJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyW10nXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAna2VlcF9kaW1zJyxcbiAgICAgICAgJ25hbWUnOiAna2VlcERpbXMnLFxuICAgICAgICAndHlwZSc6ICdib29sJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdBcmdNYXgnLFxuICAgICdjYXRlZ29yeSc6ICdyZWR1Y3Rpb24nLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdheGlzJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdBcmdNaW4nLFxuICAgICdjYXRlZ29yeSc6ICdyZWR1Y3Rpb24nLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdheGlzJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdQcm9kJyxcbiAgICAnY2F0ZWdvcnknOiAncmVkdWN0aW9uJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd4JyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnYXhpcycsXG4gICAgICAgICd0eXBlJzogJ251bWJlcltdJ1xuICAgICAgfVxuICAgIF0sXG4gICAgJ2F0dHJzJzogW1xuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ2tlZXBfZGltcycsXG4gICAgICAgICduYW1lJzogJ2tlZXBEaW1zJyxcbiAgICAgICAgJ3R5cGUnOiAnYm9vbCdcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnQ3VtcHJvZCcsXG4gICAgJ2NhdGVnb3J5JzogJ3JlZHVjdGlvbicsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAneCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDEsXG4gICAgICAgICduYW1lJzogJ2F4aXMnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnZXhjbHVzaXZlJyxcbiAgICAgICAgJ25hbWUnOiAnZXhjbHVzaXZlJyxcbiAgICAgICAgJ3R5cGUnOiAnYm9vbCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAncmV2ZXJzZScsXG4gICAgICAgICduYW1lJzogJ3JldmVyc2UnLFxuICAgICAgICAndHlwZSc6ICdib29sJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdDdW1zdW0nLFxuICAgICdjYXRlZ29yeSc6ICdyZWR1Y3Rpb24nLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdheGlzJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyJ1xuICAgICAgfVxuICAgIF0sXG4gICAgJ2F0dHJzJzogW1xuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ2V4Y2x1c2l2ZScsXG4gICAgICAgICduYW1lJzogJ2V4Y2x1c2l2ZScsXG4gICAgICAgICd0eXBlJzogJ2Jvb2wnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ3JldmVyc2UnLFxuICAgICAgICAnbmFtZSc6ICdyZXZlcnNlJyxcbiAgICAgICAgJ3R5cGUnOiAnYm9vbCdcbiAgICAgIH1cbiAgICBdXG4gIH1cbl1cbjtcbiJdfQ==