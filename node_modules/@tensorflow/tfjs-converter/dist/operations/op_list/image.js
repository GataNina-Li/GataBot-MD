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
        'tfOpName': 'ResizeBilinear',
        'category': 'image',
        'inputs': [
            {
                'start': 0,
                'name': 'images',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'size',
                'type': 'number[]'
            }
        ],
        'attrs': [
            {
                'tfName': 'align_corners',
                'name': 'alignCorners',
                'type': 'bool'
            },
            {
                'tfName': 'half_pixel_centers',
                'name': 'halfPixelCenters',
                'type': 'bool'
            },
            {
                'tfName': 'T',
                'name': 'dtype',
                'type': 'dtype',
                'notSupported': true
            }
        ]
    },
    {
        'tfOpName': 'ResizeNearestNeighbor',
        'category': 'image',
        'inputs': [
            {
                'start': 0,
                'name': 'images',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'size',
                'type': 'number[]'
            }
        ],
        'attrs': [
            {
                'tfName': 'align_corners',
                'name': 'alignCorners',
                'type': 'bool'
            },
            {
                'tfName': 'half_pixel_centers',
                'name': 'halfPixelCenters',
                'type': 'bool'
            },
            {
                'tfName': 'T',
                'name': 'dtype',
                'type': 'dtype',
                'notSupported': true
            }
        ]
    },
    {
        'tfOpName': 'CropAndResize',
        'category': 'image',
        'inputs': [
            {
                'start': 0,
                'name': 'image',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'boxes',
                'type': 'tensor'
            },
            {
                'start': 2,
                'name': 'boxInd',
                'type': 'tensor'
            },
            {
                'start': 3,
                'name': 'cropSize',
                'type': 'number[]'
            }
        ],
        'attrs': [
            {
                'tfName': 'method',
                'name': 'method',
                'type': 'string'
            },
            {
                'tfName': 'extrapolation_value',
                'name': 'extrapolationValue',
                'type': 'number'
            }
        ]
    },
    {
        'tfOpName': 'ImageProjectiveTransformV3',
        'category': 'image',
        'inputs': [
            {
                'start': 0,
                'name': 'images',
                'type': 'tensor'
            },
            {
                'start': 1,
                'name': 'transforms',
                'type': 'tensor'
            },
            {
                'start': 2,
                'name': 'outputShape',
                'type': 'number[]'
            },
            {
                'start': 3,
                'name': 'fillValue',
                'type': 'number'
            }
        ],
        'attrs': [
            {
                'tfName': 'interpolation',
                'name': 'interpolation',
                'type': 'string'
            },
            {
                'tfName': 'fill_mode',
                'name': 'fillMode',
                'type': 'string'
            }
        ]
    }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvbnZlcnRlci9zcmMvb3BlcmF0aW9ucy9vcF9saXN0L2ltYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUlILE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBZTtJQUM5QjtRQUNFLFVBQVUsRUFBRSxnQkFBZ0I7UUFDNUIsVUFBVSxFQUFFLE9BQU87UUFDbkIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLFFBQVE7Z0JBQ2hCLE1BQU0sRUFBRSxRQUFRO2FBQ2pCO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsTUFBTSxFQUFFLFVBQVU7YUFDbkI7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQO2dCQUNFLFFBQVEsRUFBRSxlQUFlO2dCQUN6QixNQUFNLEVBQUUsY0FBYztnQkFDdEIsTUFBTSxFQUFFLE1BQU07YUFDZjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLE1BQU0sRUFBRSxrQkFBa0I7Z0JBQzFCLE1BQU0sRUFBRSxNQUFNO2FBQ2Y7WUFDRDtnQkFDRSxRQUFRLEVBQUUsR0FBRztnQkFDYixNQUFNLEVBQUUsT0FBTztnQkFDZixNQUFNLEVBQUUsT0FBTztnQkFDZixjQUFjLEVBQUUsSUFBSTthQUNyQjtTQUNGO0tBQ0Y7SUFDRDtRQUNFLFVBQVUsRUFBRSx1QkFBdUI7UUFDbkMsVUFBVSxFQUFFLE9BQU87UUFDbkIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLFFBQVE7Z0JBQ2hCLE1BQU0sRUFBRSxRQUFRO2FBQ2pCO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsTUFBTSxFQUFFLFVBQVU7YUFDbkI7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQO2dCQUNFLFFBQVEsRUFBRSxlQUFlO2dCQUN6QixNQUFNLEVBQUUsY0FBYztnQkFDdEIsTUFBTSxFQUFFLE1BQU07YUFDZjtZQUNEO2dCQUNFLFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLE1BQU0sRUFBRSxrQkFBa0I7Z0JBQzFCLE1BQU0sRUFBRSxNQUFNO2FBQ2Y7WUFDRDtnQkFDRSxRQUFRLEVBQUUsR0FBRztnQkFDYixNQUFNLEVBQUUsT0FBTztnQkFDZixNQUFNLEVBQUUsT0FBTztnQkFDZixjQUFjLEVBQUUsSUFBSTthQUNyQjtTQUNGO0tBQ0Y7SUFDRDtRQUNFLFVBQVUsRUFBRSxlQUFlO1FBQzNCLFVBQVUsRUFBRSxPQUFPO1FBQ25CLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxPQUFPO2dCQUNmLE1BQU0sRUFBRSxRQUFRO2FBQ2pCO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsUUFBUTtnQkFDaEIsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsVUFBVTtnQkFDbEIsTUFBTSxFQUFFLFVBQVU7YUFDbkI7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQO2dCQUNFLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixNQUFNLEVBQUUsUUFBUTtnQkFDaEIsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRDtnQkFDRSxRQUFRLEVBQUUscUJBQXFCO2dCQUMvQixNQUFNLEVBQUUsb0JBQW9CO2dCQUM1QixNQUFNLEVBQUUsUUFBUTthQUNqQjtTQUNGO0tBQ0Y7SUFDRDtRQUNFLFVBQVUsRUFBRSw0QkFBNEI7UUFDeEMsVUFBVSxFQUFFLE9BQU87UUFDbkIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLFFBQVE7Z0JBQ2hCLE1BQU0sRUFBRSxRQUFRO2FBQ2pCO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLFlBQVk7Z0JBQ3BCLE1BQU0sRUFBRSxRQUFRO2FBQ2pCO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLGFBQWE7Z0JBQ3JCLE1BQU0sRUFBRSxVQUFVO2FBQ25CO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLFdBQVc7Z0JBQ25CLE1BQU0sRUFBRSxRQUFRO2FBQ2pCO1NBQ0Y7UUFDRCxPQUFPLEVBQUU7WUFDUDtnQkFDRSxRQUFRLEVBQUUsZUFBZTtnQkFDekIsTUFBTSxFQUFFLGVBQWU7Z0JBQ3ZCLE1BQU0sRUFBRSxRQUFRO2FBQ2pCO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLFdBQVc7Z0JBQ3JCLE1BQU0sRUFBRSxVQUFVO2dCQUNsQixNQUFNLEVBQUUsUUFBUTthQUNqQjtTQUNGO0tBQ0Y7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7T3BNYXBwZXJ9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IGpzb246IE9wTWFwcGVyW10gPSBbXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnUmVzaXplQmlsaW5lYXInLFxuICAgICdjYXRlZ29yeSc6ICdpbWFnZScsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAnaW1hZ2VzJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnc2l6ZScsXG4gICAgICAgICd0eXBlJzogJ251bWJlcltdJ1xuICAgICAgfVxuICAgIF0sXG4gICAgJ2F0dHJzJzogW1xuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ2FsaWduX2Nvcm5lcnMnLFxuICAgICAgICAnbmFtZSc6ICdhbGlnbkNvcm5lcnMnLFxuICAgICAgICAndHlwZSc6ICdib29sJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdoYWxmX3BpeGVsX2NlbnRlcnMnLFxuICAgICAgICAnbmFtZSc6ICdoYWxmUGl4ZWxDZW50ZXJzJyxcbiAgICAgICAgJ3R5cGUnOiAnYm9vbCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnVCcsXG4gICAgICAgICduYW1lJzogJ2R0eXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnZHR5cGUnLFxuICAgICAgICAnbm90U3VwcG9ydGVkJzogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdSZXNpemVOZWFyZXN0TmVpZ2hib3InLFxuICAgICdjYXRlZ29yeSc6ICdpbWFnZScsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAnaW1hZ2VzJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnc2l6ZScsXG4gICAgICAgICd0eXBlJzogJ251bWJlcltdJ1xuICAgICAgfVxuICAgIF0sXG4gICAgJ2F0dHJzJzogW1xuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ2FsaWduX2Nvcm5lcnMnLFxuICAgICAgICAnbmFtZSc6ICdhbGlnbkNvcm5lcnMnLFxuICAgICAgICAndHlwZSc6ICdib29sJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3RmTmFtZSc6ICdoYWxmX3BpeGVsX2NlbnRlcnMnLFxuICAgICAgICAnbmFtZSc6ICdoYWxmUGl4ZWxDZW50ZXJzJyxcbiAgICAgICAgJ3R5cGUnOiAnYm9vbCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnVCcsXG4gICAgICAgICduYW1lJzogJ2R0eXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnZHR5cGUnLFxuICAgICAgICAnbm90U3VwcG9ydGVkJzogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgICd0Zk9wTmFtZSc6ICdDcm9wQW5kUmVzaXplJyxcbiAgICAnY2F0ZWdvcnknOiAnaW1hZ2UnLFxuICAgICdpbnB1dHMnOiBbXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDAsXG4gICAgICAgICduYW1lJzogJ2ltYWdlJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAnYm94ZXMnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAyLFxuICAgICAgICAnbmFtZSc6ICdib3hJbmQnLFxuICAgICAgICAndHlwZSc6ICd0ZW5zb3InXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAzLFxuICAgICAgICAnbmFtZSc6ICdjcm9wU2l6ZScsXG4gICAgICAgICd0eXBlJzogJ251bWJlcltdJ1xuICAgICAgfVxuICAgIF0sXG4gICAgJ2F0dHJzJzogW1xuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ21ldGhvZCcsXG4gICAgICAgICduYW1lJzogJ21ldGhvZCcsXG4gICAgICAgICd0eXBlJzogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnZXh0cmFwb2xhdGlvbl92YWx1ZScsXG4gICAgICAgICduYW1lJzogJ2V4dHJhcG9sYXRpb25WYWx1ZScsXG4gICAgICAgICd0eXBlJzogJ251bWJlcidcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICAndGZPcE5hbWUnOiAnSW1hZ2VQcm9qZWN0aXZlVHJhbnNmb3JtVjMnLFxuICAgICdjYXRlZ29yeSc6ICdpbWFnZScsXG4gICAgJ2lucHV0cyc6IFtcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMCxcbiAgICAgICAgJ25hbWUnOiAnaW1hZ2VzJyxcbiAgICAgICAgJ3R5cGUnOiAndGVuc29yJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ3N0YXJ0JzogMSxcbiAgICAgICAgJ25hbWUnOiAndHJhbnNmb3JtcycsXG4gICAgICAgICd0eXBlJzogJ3RlbnNvcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdzdGFydCc6IDIsXG4gICAgICAgICduYW1lJzogJ291dHB1dFNoYXBlJyxcbiAgICAgICAgJ3R5cGUnOiAnbnVtYmVyW10nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnc3RhcnQnOiAzLFxuICAgICAgICAnbmFtZSc6ICdmaWxsVmFsdWUnLFxuICAgICAgICAndHlwZSc6ICdudW1iZXInXG4gICAgICB9XG4gICAgXSxcbiAgICAnYXR0cnMnOiBbXG4gICAgICB7XG4gICAgICAgICd0Zk5hbWUnOiAnaW50ZXJwb2xhdGlvbicsXG4gICAgICAgICduYW1lJzogJ2ludGVycG9sYXRpb24nLFxuICAgICAgICAndHlwZSc6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAndGZOYW1lJzogJ2ZpbGxfbW9kZScsXG4gICAgICAgICduYW1lJzogJ2ZpbGxNb2RlJyxcbiAgICAgICAgJ3R5cGUnOiAnc3RyaW5nJ1xuICAgICAgfVxuICAgIF1cbiAgfVxuXTtcbiJdfQ==