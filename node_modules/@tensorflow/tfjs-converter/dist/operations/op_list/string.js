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
        'tfOpName': 'StringNGrams',
        'category': 'string',
        'inputs': [
            {
                'start': 0,
                'name': 'data',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'dataSplits',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'separator',
                'name': 'separator',
                'type': 'string'
            },
            {
                'tfName': 'ngram_widths',
                'name': 'nGramWidths',
                'type': 'number[]'
            },
            {
                'tfName': 'left_pad',
                'name': 'leftPad',
                'type': 'string'
            },
            {
                'tfName': 'right_pad',
                'name': 'rightPad',
                'type': 'string'
            },
            {
                'tfName': 'pad_width',
                'name': 'padWidth',
                'type': 'number'
            },
            {
                'tfName': 'preserve_short_sequences',
                'name': 'preserveShortSequences',
                'type': 'bool'
            }
        ],
        'outputs': [
            'ngrams',
            'ngrams_splits'
        ]
    },
    {
        'tfOpName': 'StringSplit',
        'category': 'string',
        'inputs': [
            {
                'start': 0,
                'name': 'input',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'delimiter',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'skip_empty',
                'name': 'skipEmpty',
                'type': 'bool'
            }
        ],
        'outputs': [
            'indices',
            'values',
            'shape'
        ]
    },
    {
        'tfOpName': 'StringToHashBucketFast',
        'category': 'string',
        'inputs': [
            {
                'start': 0,
                'name': 'input',
                'type': 'tensor'
            }
        ],
        'attrs': [
            {
                'tfName': 'num_buckets',
                'name': 'numBuckets',
                'type': 'number'
            }
        ]
    }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb252ZXJ0ZXIvc3JjL29wZXJhdGlvbnMvb3BfbGlzdC9zdHJpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBSUgsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFlO0lBQzlCO1FBQ0UsVUFBVSxFQUFFLGNBQWM7UUFDMUIsVUFBVSxFQUFFLFFBQVE7UUFDcEIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsWUFBWTtnQkFDcEIsTUFBTSxFQUFFLFFBQVE7YUFDakI7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQO2dCQUNFLFFBQVEsRUFBRSxXQUFXO2dCQUNyQixNQUFNLEVBQUUsV0FBVztnQkFDbkIsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRDtnQkFDRSxRQUFRLEVBQUUsY0FBYztnQkFDeEIsTUFBTSxFQUFFLGFBQWE7Z0JBQ3JCLE1BQU0sRUFBRSxVQUFVO2FBQ25CO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixNQUFNLEVBQUUsUUFBUTthQUNqQjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxXQUFXO2dCQUNyQixNQUFNLEVBQUUsVUFBVTtnQkFDbEIsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRDtnQkFDRSxRQUFRLEVBQUUsV0FBVztnQkFDckIsTUFBTSxFQUFFLFVBQVU7Z0JBQ2xCLE1BQU0sRUFBRSxRQUFRO2FBQ2pCO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLDBCQUEwQjtnQkFDcEMsTUFBTSxFQUFFLHdCQUF3QjtnQkFDaEMsTUFBTSxFQUFFLE1BQU07YUFDZjtTQUNGO1FBQ0QsU0FBUyxFQUFFO1lBQ1QsUUFBUTtZQUNSLGVBQWU7U0FDaEI7S0FDRjtJQUNEO1FBQ0UsVUFBVSxFQUFFLGFBQWE7UUFDekIsVUFBVSxFQUFFLFFBQVE7UUFDcEIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsV0FBVztnQkFDbkIsTUFBTSxFQUFFLFFBQVE7YUFDakI7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQO2dCQUNFLFFBQVEsRUFBRSxZQUFZO2dCQUN0QixNQUFNLEVBQUUsV0FBVztnQkFDbkIsTUFBTSxFQUFFLE1BQU07YUFDZjtTQUNGO1FBQ0QsU0FBUyxFQUFFO1lBQ1QsU0FBUztZQUNULFFBQVE7WUFDUixPQUFPO1NBQ1I7S0FDRjtJQUNEO1FBQ0UsVUFBVSxFQUFFLHdCQUF3QjtRQUNwQyxVQUFVLEVBQUUsUUFBUTtRQUNwQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsT0FBTztnQkFDZixNQUFNLEVBQUUsUUFBUTthQUNqQjtTQUNGO1FBQ0QsT0FBTyxFQUFFO1lBQ1A7Z0JBQ0UsUUFBUSxFQUFFLGFBQWE7Z0JBQ3ZCLE1BQU0sRUFBRSxZQUFZO2dCQUNwQixNQUFNLEVBQUUsUUFBUTthQUNqQjtTQUNGO0tBQ0Y7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7T3BNYXBwZXJ9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IGpzb246IE9wTWFwcGVyW10gPSBbXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnU3RyaW5nTkdyYW1zJyxcbiAgICAnY2F0ZWdvcnknOiAnc3RyaW5nJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICdkYXRhJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnZGF0YVNwbGl0cycsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH1cbiAgICBdLFxuICAgICdhdHRycyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdzZXBhcmF0b3InLFxuICAgICAgICAnbmFtZSc6ICdzZXBhcmF0b3InLFxuICAgICAgICAndHlwZSc6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ25ncmFtX3dpZHRocycsXG4gICAgICAgICduYW1lJzogJ25HcmFtV2lkdGhzJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyW10nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ2xlZnRfcGFkJyxcbiAgICAgICAgJ25hbWUnOiAnbGVmdFBhZCcsXG4gICAgICAgICd0eXBlJzogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAncmlnaHRfcGFkJyxcbiAgICAgICAgJ25hbWUnOiAncmlnaHRQYWQnLFxuICAgICAgICAndHlwZSc6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ3BhZF93aWR0aCcsXG4gICAgICAgICduYW1lJzogJ3BhZFdpZHRoJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdwcmVzZXJ2ZV9zaG9ydF9zZXF1ZW5jZXMnLFxuICAgICAgICAnbmFtZSc6ICdwcmVzZXJ2ZVNob3J0U2VxdWVuY2VzJyxcbiAgICAgICAgJ3R5cGUnOiAnYm9vbCdcbiAgICAgIH1cbiAgICBdLFxuICAgICdvdXRwdXRzJzogW1xuICAgICAgJ25ncmFtcycsXG4gICAgICAnbmdyYW1zX3NwbGl0cydcbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnU3RyaW5nU3BsaXQnLFxuICAgICdjYXRlZ29yeSc6ICdzdHJpbmcnLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ2lucHV0JyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnZGVsaW1pdGVyJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfVxuICAgIF0sXG4gICAgJ2F0dHJzJzogW1xuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ3NraXBfZW1wdHknLFxuICAgICAgICAnbmFtZSc6ICdza2lwRW1wdHknLFxuICAgICAgICAndHlwZSc6ICdib29sJ1xuICAgICAgfVxuICAgIF0sXG4gICAgJ291dHB1dHMnOiBbXG4gICAgICAnaW5kaWNlcycsXG4gICAgICAndmFsdWVzJyxcbiAgICAgICdzaGFwZSdcbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnU3RyaW5nVG9IYXNoQnVja2V0RmFzdCcsXG4gICAgJ2NhdGVnb3J5JzogJ3N0cmluZycsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAnaW5wdXQnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnbnVtX2J1Y2tldHMnLFxuICAgICAgICAnbmFtZSc6ICdudW1CdWNrZXRzJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyJ1xuICAgICAgfVxuICAgIF1cbiAgfVxuXTtcbiJdfQ==