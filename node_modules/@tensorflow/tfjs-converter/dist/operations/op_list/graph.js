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
        'tfOpName': 'PlaceholderWithDefault',
        'category': 'graph',
        'inputs': [
            {
                'start': 0,
                'name': 'default',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'shape',
                'name': 'shape',
                'type': 'shape'
            },
            {
                'tfName': 'dtype',
                'name': 'dtype',
                'type': 'dtype'
            }
        ]
    },
    {
        'tfOpName': 'Placeholder',
        'category': 'graph',
        'attrs': [
            {
                'tfName': 'shape',
                'name': 'shape',
                'type': 'shape'
            },
            {
                'tfName': 'dtype',
                'name': 'dtype',
                'type': 'dtype'
            }
        ]
    },
    {
        'tfOpName': 'Const',
        'category': 'graph'
    },
    {
        'tfOpName': 'Identity',
        'category': 'graph',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            }
        ]
    },
    {
        'tfOpName': 'IdentityN',
        'category': 'graph',
        'inputs': [
            {
                'start': 0,
                'end': 0,
                'name': 'x',
                'type': 'tensors'
            }
        ]
    },
    {
        'tfOpName': 'Snapshot',
        'category': 'graph',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            }
        ]
    },
    {
        'tfOpName': 'Rank',
        'category': 'graph',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            }
        ]
    },
    {
        'tfOpName': 'Size',
        'category': 'graph',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            }
        ]
    },
    {
        'tfOpName': 'Shape',
        'category': 'graph',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            }
        ]
    },
    {
        'tfOpName': 'ShapeN',
        'category': 'graph',
        'inputs': [
            {
                'start': 0,
                'end': 0,
                'name': 'x',
                'type': 'tensors'
            }
        ]
    },
    {
        'tfOpName': 'Print',
        'category': 'graph',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'data',
                'type': 'tensors'
            }
        ],
        'attrs': [
            {
                'tfName': 'message',
                'name': 'message',
                'type': 'string'
            },
            {
                'tfName': 'first_n',
                'name': 'firstN',
                'type': 'number',
                'notSupported': true
            },
            {
                'tfName': 'summarize',
                'name': 'summarize',
                'type': 'number',
                'defaultValue': 3
            }
        ]
    },
    {
        'tfOpName': 'NoOp',
        'category': 'graph',
        'inputs': []
    },
    {
        'tfOpName': 'StopGradient',
        'category': 'graph',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            }
        ]
    },
    {
        'tfOpName': 'FakeQuantWithMinMaxVars',
        'category': 'graph',
        'inputs': [
            {
                'start': 0,
                'name': 'x',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'min',
                'name': 'min',
                'type': 'number'
            },
            {
                'tfName': 'max',
                'name': 'max',
                'type': 'number'
            }
        ]
    }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvbnZlcnRlci9zcmMvb3BlcmF0aW9ucy9vcF9saXN0L2dyYXBoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUlILE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBZTtJQUM5QjtRQUNFLFVBQVUsRUFBRSx3QkFBd0I7UUFDcEMsVUFBVSxFQUFFLE9BQU87UUFDbkIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLFNBQVM7Z0JBQ2pCLE1BQU0sRUFBRSxRQUFRO2FBQ2pCO1NBQ0Y7UUFDRCxPQUFPLEVBQUU7WUFDUDtnQkFDRSxRQUFRLEVBQUUsT0FBTztnQkFDakIsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsTUFBTSxFQUFFLE9BQU87YUFDaEI7WUFDRDtnQkFDRSxRQUFRLEVBQUUsT0FBTztnQkFDakIsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsTUFBTSxFQUFFLE9BQU87YUFDaEI7U0FDRjtLQUNGO0lBQ0Q7UUFDRSxVQUFVLEVBQUUsYUFBYTtRQUN6QixVQUFVLEVBQUUsT0FBTztRQUNuQixPQUFPLEVBQUU7WUFDUDtnQkFDRSxRQUFRLEVBQUUsT0FBTztnQkFDakIsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsTUFBTSxFQUFFLE9BQU87YUFDaEI7WUFDRDtnQkFDRSxRQUFRLEVBQUUsT0FBTztnQkFDakIsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsTUFBTSxFQUFFLE9BQU87YUFDaEI7U0FDRjtLQUNGO0lBQ0Q7UUFDRSxVQUFVLEVBQUUsT0FBTztRQUNuQixVQUFVLEVBQUUsT0FBTztLQUNwQjtJQUNEO1FBQ0UsVUFBVSxFQUFFLFVBQVU7UUFDdEIsVUFBVSxFQUFFLE9BQU87UUFDbkIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxF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R0FBRztnQkFDWCxNQUFNLEVBQUUsUUFBUTthQUNqQjtTQUNGO1FBQ0QsT0FBTyxFQUFFO1lBQ1A7Z0JBQ0UsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRDtnQkFDRSxRQUFRLEVBQUUsS0FBSztnQkFDZixNQUFNLEVBQUUsS0FBSztnQkFDYixNQUFNLEVBQUUsUUFBUTthQUNqQjtTQUNGO0tBQ0Y7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7T3BNYXBwZXJ9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IGpzb246IE9wTWFwcGVyW10gPSBbXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnUGxhY2Vob2xkZXJXaXRoRGVmYXVsdCcsXG4gICAgJ2NhdGVnb3J5JzogJ2dyYXBoJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICdkZWZhdWx0JyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfVxuICAgIF0sXG4gICAgJ2F0dHJzJzogW1xuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ3NoYXBlJyxcbiAgICAgICAgJ25hbWUnOiAnc2hhcGUnLFxuICAgICAgICAndHlwZSc6ICdzaGFwZSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnZHR5cGUnLFxuICAgICAgICAnbmFtZSc6ICdkdHlwZScsXG4gICAgICAgICd0eXBlJzogJ2R0eXBlJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdQbGFjZWhvbGRlcicsXG4gICAgJ2NhdGVnb3J5JzogJ2dyYXBoJyxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnc2hhcGUnLFxuICAgICAgICAnbmFtZSc6ICdzaGFwZScsXG4gICAgICAgICd0eXBlJzogJ3NoYXBlJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdkdHlwZScsXG4gICAgICAgICduYW1lJzogJ2R0eXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnZHR5cGUnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ0NvbnN0JyxcbiAgICAnY2F0ZWdvcnknOiAnZ3JhcGgnXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnSWRlbnRpdHknLFxuICAgICdjYXRlZ29yeSc6ICdncmFwaCcsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAneCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnSWRlbnRpdHlOJyxcbiAgICAnY2F0ZWdvcnknOiAnZ3JhcGgnLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICdlbmQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd4JyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29ycydcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnU25hcHNob3QnLFxuICAgICdjYXRlZ29yeSc6ICdncmFwaCcsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAneCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnUmFuaycsXG4gICAgJ2NhdGVnb3J5JzogJ2dyYXBoJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICd4JyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdTaXplJyxcbiAgICAnY2F0ZWdvcnknOiAnZ3JhcGgnLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ1NoYXBlJyxcbiAgICAnY2F0ZWdvcnknOiAnZ3JhcGgnLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ1NoYXBlTicsXG4gICAgJ2NhdGVnb3J5JzogJ2dyYXBoJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnZW5kJzogMCxcbiAgICAgICAgJ25hbWUnOiAneCcsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcnMnXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ1ByaW50JyxcbiAgICAnY2F0ZWdvcnknOiAnZ3JhcGgnLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdkYXRhJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29ycydcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdtZXNzYWdlJyxcbiAgICAgICAgJ25hbWUnOiAnbWVzc2FnZScsXG4gICAgICAgICd0eXBlJzogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnZmlyc3RfbicsXG4gICAgICAgICduYW1lJzogJ2ZpcnN0TicsXG4gICAgICAgICd0eXBlJzogJ251bWJlcicsXG4gICAgICAgICdub3RTdXBwb3J0ZWQnOiB0cnVlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ3N1bW1hcml6ZScsXG4gICAgICAgICduYW1lJzogJ3N1bW1hcml6ZScsXG4gICAgICAgICd0eXBlJzogJ251bWJlcicsXG4gICAgICAgICdkZWZhdWx0VmFsdWUnOiAzXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ05vT3AnLFxuICAgICdjYXRlZ29yeSc6ICdncmFwaCcsXG4gICAgJ2lucHV0cyc6IFtdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnU3RvcEdyYWRpZW50JyxcbiAgICAnY2F0ZWdvcnknOiAnZ3JhcGgnLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgJ3RmT3BOYW1lJzogJ0Zha2VRdWFudFdpdGhNaW5NYXhWYXJzJyxcbiAgICAnY2F0ZWdvcnknOiAnZ3JhcGgnLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ3gnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnbWluJyxcbiAgICAgICAgJ25hbWUnOiAnbWluJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdtYXgnLFxuICAgICAgICAnbmFtZSc6ICdtYXgnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInXG4gICAgICB9XG4gICAgXVxuICB9XG5dO1xuIl19