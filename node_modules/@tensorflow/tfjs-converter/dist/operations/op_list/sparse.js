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
        'tfOpName': 'SparseFillEmptyRows',
        'category': 'sparse',
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
                'name': 'denseShape',
                'type': 'tensor'
            },
            {
                'start': 3,
                'name': 'defaultValue',
                'type': 'tensor'
            }
        ]
    },
    {
        'tfOpName': 'SparseReshape',
        'category': 'sparse',
        'inputs': [
            {
                'start': 0,
                'name': 'inputIndices',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'inputShape',
                'type': 'tensor'
            },
            {
                'start': 2,
                'name': 'newShape',
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
        'tfOpName': 'SparseSegmentMean',
        'category': 'sparse',
        'inputs': [
            {
                'start': 0,
                'name': 'data',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'indices',
                'type': 'tensor'
            },
            {
                'start': 2,
                'name': 'segmentIds',
                'type': 'tensor'
            }
        ]
    },
    {
        'tfOpName': 'SparseSegmentSum',
        'category': 'sparse',
        'inputs': [
            {
                'start': 0,
                'name': 'data',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'indices',
                'type': 'tensor'
            },
            {
                'start': 2,
                'name': 'segmentIds',
                'type': 'tensor'
            }
        ]
    }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BhcnNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb252ZXJ0ZXIvc3JjL29wZXJhdGlvbnMvb3BfbGlzdC9zcGFyc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBSUgsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFlO0lBQzlCO1FBQ0UsVUFBVSxFQUFFLHFCQUFxQjtRQUNqQyxVQUFVLEVBQUUsUUFBUTtRQUNwQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsU0FBUztnQkFDakIsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsUUFBUTtnQkFDaEIsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsWUFBWTtnQkFDcEIsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsY0FBYztnQkFDdEIsTUFBTSxFQUFFLFFBQVE7YUFDakI7U0FDRjtLQUNGO0lBQ0Q7UUFDRSxVQUFVLEVBQUUsZUFBZTtRQUMzQixVQUFVLEVBQUUsUUFBUTtRQUNwQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsY0FBYztnQkFDdEIsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsWUFBWTtnQkFDcEIsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsVUFBVTtnQkFDbEIsTUFBTSxFQUFFLFFBQVE7YUFDakI7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQO2dCQUNFLFFBQVEsRUFBRSxHQUFHO2dCQUNiLE1BQU0sRUFBRSxPQUFPO2dCQUNmLE1BQU0sRUFBRSxPQUFPO2dCQUNmLGNBQWMsRUFBRSxJQUFJO2FBQ3JCO1NBQ0Y7S0FDRjtJQUNEO1FBQ0UsVUFBVSxFQUFFLG1CQUFtQjtRQUMvQixVQUFVLEVBQUUsUUFBUTtRQUNwQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsTUFBTTtnQkFDZCxNQUFNLEVBQUUsUUFBUTthQUNqQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixNQUFNLEVBQUUsUUFBUTthQUNqQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxZQUFZO2dCQUNwQixNQUFNLEVBQUUsUUFBUTthQUNqQjtTQUNGO0tBQ0Y7SUFDRDtRQUNFLFVBQVUsRUFBRSxrQkFBa0I7UUFDOUIsVUFBVSxFQUFFLFFBQVE7UUFDcEIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsU0FBUztnQkFDakIsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsWUFBWTtnQkFDcEIsTUFBTSxFQUFFLFFBQVE7YUFDakI7U0FDRjtLQUNGO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjIgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge09wTWFwcGVyfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBqc29uOiBPcE1hcHBlcltdID0gW1xuICB7XG4gICAgJ3RmT3BOYW1lJzogJ1NwYXJzZUZpbGxFbXB0eVJvd3MnLFxuICAgICdjYXRlZ29yeSc6ICdzcGFyc2UnLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ2luZGljZXMnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICd2YWx1ZXMnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAyLFxuICAgICAgICAnbmFtZSc6ICdkZW5zZVNoYXBlJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMyxcbiAgICAgICAgJ25hbWUnOiAnZGVmYXVsdFZhbHVlJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdTcGFyc2VSZXNoYXBlJyxcbiAgICAnY2F0ZWdvcnknOiAnc3BhcnNlJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICdpbnB1dEluZGljZXMnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAxLFxuICAgICAgICAnbmFtZSc6ICdpbnB1dFNoYXBlJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMixcbiAgICAgICAgJ25hbWUnOiAnbmV3U2hhcGUnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnVCcsXG4gICAgICAgICduYW1lJzogJ2R0eXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnZHR5cGUnLFxuICAgICAgICAnbm90U3VwcG9ydGVkJzogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdTcGFyc2VTZWdtZW50TWVhbicsXG4gICAgJ2NhdGVnb3J5JzogJ3NwYXJzZScsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAnZGF0YScsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDEsXG4gICAgICAgICduYW1lJzogJ2luZGljZXMnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAyLFxuICAgICAgICAnbmFtZSc6ICdzZWdtZW50SWRzJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdTcGFyc2VTZWdtZW50U3VtJyxcbiAgICAnY2F0ZWdvcnknOiAnc3BhcnNlJyxcbiAgICAnaW5wdXRzJzogW1xuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAwLFxuICAgICAgICAnbmFtZSc6ICdkYXRhJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnaW5kaWNlcycsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDIsXG4gICAgICAgICduYW1lJzogJ3NlZ21lbnRJZHMnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9XG4gICAgXVxuICB9XG5dO1xuIl19