/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
export const json = {
    '$schema': 'http://json-schema.org/draft-07/schema#',
    'definitions': {
        'OpMapper': {
            'type': 'object',
            'properties': {
                'tfOpName': { 'type': 'string' },
                'category': { '$ref': '#/definitions/Category' },
                'inputs': {
                    'type': 'array',
                    'items': { '$ref': '#/definitions/InputParamMapper' }
                },
                'attrs': {
                    'type': 'array',
                    'items': { '$ref': '#/definitions/AttrParamMapper' }
                },
                'customExecutor': { '$ref': '#/definitions/OpExecutor' },
                'outputs': { 'type': 'array' }
            },
            'required': ['tfOpName'],
            'additionalProperties': false
        },
        'Category': {
            'type': 'string',
            'enum': [
                'arithmetic', 'basic_math', 'control', 'convolution', 'custom',
                'dynamic', 'evaluation', 'image', 'creation', 'graph', 'logical',
                'matrices', 'normalization', 'reduction', 'slice_join', 'spectral',
                'transformation', 'sparse', 'string'
            ]
        },
        'InputParamMapper': {
            'type': 'object',
            'properties': {
                'name': { 'type': 'string' },
                'type': { '$ref': '#/definitions/ParamTypes' },
                'defaultValue': {
                    'anyOf': [
                        { 'type': 'string' }, { 'type': 'array', 'items': { 'type': 'string' } },
                        { 'type': 'number' }, { 'type': 'array', 'items': { 'type': 'number' } },
                        { 'type': 'boolean' }, { 'type': 'array', 'items': { 'type': 'boolean' } }
                    ]
                },
                'notSupported': { 'type': 'boolean' },
                'start': { 'type': 'number' },
                'end': { 'type': 'number' }
            },
            'required': ['name', 'start', 'type'],
            'additionalProperties': false
        },
        'ParamTypes': {
            'type': 'string',
            'enum': [
                'number', 'string', 'number[]', 'bool', 'shape', 'tensor', 'tensors',
                'dtype', 'string[]', 'func', 'dtype[]', 'bool[]'
            ]
        },
        'AttrParamMapper': {
            'type': 'object',
            'properties': {
                'name': { 'type': 'string' },
                'type': { '$ref': '#/definitions/ParamTypes' },
                'defaultValue': {
                    'anyOf': [
                        { 'type': 'string' }, { 'type': 'array', 'items': { 'type': 'string' } },
                        { 'type': 'number' }, { 'type': 'array', 'items': { 'type': 'number' } },
                        { 'type': 'boolean' }, { 'type': 'array', 'items': { 'type': 'boolean' } }
                    ]
                },
                'notSupported': { 'type': 'boolean' },
                'tfName': { 'type': 'string' },
                'tfDeprecatedName': { 'type': 'string' }
            },
            'required': ['name', 'tfName', 'type'],
            'additionalProperties': false
        },
        'OpExecutor': { 'type': 'object', 'additionalProperties': false }
    },
    'items': { '$ref': '#/definitions/OpMapper' },
    'type': 'array'
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BfbWFwcGVyX3NjaGVtYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29udmVydGVyL3NyYy9vcGVyYXRpb25zL29wX21hcHBlcl9zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHO0lBQ2xCLFNBQVMsRUFBRSx5Q0FBeUM7SUFDcEQsYUFBYSxFQUFFO1FBQ2IsVUFBVSxFQUFFO1lBQ1YsTUFBTSxFQUFFLFFBQVE7WUFDaEIsWUFBWSxFQUFFO2dCQUNaLFVBQVUsRUFBRSxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUM7Z0JBQzlCLFVBQVUsRUFBRSxFQUFDLE1BQU0sRUFBRSx3QkFBd0IsRUFBQztnQkFDOUMsUUFBUSxFQUFFO29CQUNSLE1BQU0sRUFBRSxPQUFPO29CQUNmLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxnQ0FBZ0MsRUFBQztpQkFDcEQ7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLE1BQU0sRUFBRSxPQUFPO29CQUNmLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSwrQkFBK0IsRUFBQztpQkFDbkQ7Z0JBQ0QsZ0JBQWdCLEVBQUUsRUFBQyxNQUFNLEVBQUUsMEJBQTBCLEVBQUM7Z0JBQ3RELFNBQVMsRUFBRSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUM7YUFDN0I7WUFDRCxVQUFVLEVBQUUsQ0FBQyxVQUFVLENBQUM7WUFDeEIsc0JBQXNCLEVBQUUsS0FBSztTQUM5QjtRQUNELFVBQVUsRUFBRTtZQUNWLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLE1BQU0sRUFBRTtnQkFDTixZQUFZLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsUUFBUTtnQkFDOUQsU0FBUyxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxTQUFTO2dCQUNoRSxVQUFVLEVBQUUs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Q2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmV4cG9ydCBjb25zdCBqc29uID0ge1xuICAnJHNjaGVtYSc6ICdodHRwOi8vanNvbi1zY2hlbWEub3JnL2RyYWZ0LTA3L3NjaGVtYSMnLFxuICAnZGVmaW5pdGlvbnMnOiB7XG4gICAgJ09wTWFwcGVyJzoge1xuICAgICAgJ3R5cGUnOiAnb2JqZWN0JyxcbiAgICAgICdwcm9wZXJ0aWVzJzoge1xuICAgICAgICAndGZPcE5hbWUnOiB7J3R5cGUnOiAnc3RyaW5nJ30sXG4gICAgICAgICdjYXRlZ29yeSc6IHsnJHJlZic6ICcjL2RlZmluaXRpb25zL0NhdGVnb3J5J30sXG4gICAgICAgICdpbnB1dHMnOiB7XG4gICAgICAgICAgJ3R5cGUnOiAnYXJyYXknLFxuICAgICAgICAgICdpdGVtcyc6IHsnJHJlZic6ICcjL2RlZmluaXRpb25zL0lucHV0UGFyYW1NYXBwZXInfVxuICAgICAgICB9LFxuICAgICAgICAnYXR0cnMnOiB7XG4gICAgICAgICAgJ3R5cGUnOiAnYXJyYXknLFxuICAgICAgICAgICdpdGVtcyc6IHsnJHJlZic6ICcjL2RlZmluaXRpb25zL0F0dHJQYXJhbU1hcHBlcid9XG4gICAgICAgIH0sXG4gICAgICAgICdjdXN0b21FeGVjdXRvcic6IHsnJHJlZic6ICcjL2RlZmluaXRpb25zL09wRXhlY3V0b3InfSxcbiAgICAgICAgJ291dHB1dHMnOiB7J3R5cGUnOiAnYXJyYXknfVxuICAgICAgfSxcbiAgICAgICdyZXF1aXJlZCc6IFsndGZPcE5hbWUnXSxcbiAgICAgICdhZGRpdGlvbmFsUHJvcGVydGllcyc6IGZhbHNlXG4gICAgfSxcbiAgICAnQ2F0ZWdvcnknOiB7XG4gICAgICAndHlwZSc6ICdzdHJpbmcnLFxuICAgICAgJ2VudW0nOiBbXG4gICAgICAgICdhcml0aG1ldGljJywgJ2Jhc2ljX21hdGgnLCAnY29udHJvbCcsICdjb252b2x1dGlvbicsICdjdXN0b20nLFxuICAgICAgICAnZHluYW1pYycsICdldmFsdWF0aW9uJywgJ2ltYWdlJywgJ2NyZWF0aW9uJywgJ2dyYXBoJywgJ2xvZ2ljYWwnLFxuICAgICAgICAnbWF0cmljZXMnLCAnbm9ybWFsaXphdGlvbicsICdyZWR1Y3Rpb24nLCAnc2xpY2Vfam9pbicsICdzcGVjdHJhbCcsXG4gICAgICAgICd0cmFuc2Zvcm1hdGlvbicsICdzcGFyc2UnLCAnc3RyaW5nJ1xuICAgICAgXVxuICAgIH0sXG4gICAgJ0lucHV0UGFyYW1NYXBwZXInOiB7XG4gICAgICAndHlwZSc6ICdvYmplY3QnLFxuICAgICAgJ3Byb3BlcnRpZXMnOiB7XG4gICAgICAgICduYW1lJzogeyd0eXBlJzogJ3N0cmluZyd9LFxuICAgICAgICAndHlwZSc6IHsnJHJlZic6ICcjL2RlZmluaXRpb25zL1BhcmFtVHlwZXMnfSxcbiAgICAgICAgJ2RlZmF1bHRWYWx1ZSc6IHtcbiAgICAgICAgICAnYW55T2YnOiBbXG4gICAgICAgICAgICB7J3R5cGUnOiAnc3RyaW5nJ30sIHsndHlwZSc6ICdhcnJheScsICdpdGVtcyc6IHsndHlwZSc6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgICB7J3R5cGUnOiAnbnVtYmVyJ30sIHsndHlwZSc6ICdhcnJheScsICdpdGVtcyc6IHsndHlwZSc6ICdudW1iZXInfX0sXG4gICAgICAgICAgICB7J3R5cGUnOiAnYm9vbGVhbid9LCB7J3R5cGUnOiAnYXJyYXknLCAnaXRlbXMnOiB7J3R5cGUnOiAnYm9vbGVhbid9fVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgJ25vdFN1cHBvcnRlZCc6IHsndHlwZSc6ICdib29sZWFuJ30sXG4gICAgICAgICdzdGFydCc6IHsndHlwZSc6ICdudW1iZXInfSxcbiAgICAgICAgJ2VuZCc6IHsndHlwZSc6ICdudW1iZXInfVxuICAgICAgfSxcbiAgICAgICdyZXF1aXJlZCc6IFsnbmFtZScsICdzdGFydCcsICd0eXBlJ10sXG4gICAgICAnYWRkaXRpb25hbFByb3BlcnRpZXMnOiBmYWxzZVxuICAgIH0sXG4gICAgJ1BhcmFtVHlwZXMnOiB7XG4gICAgICAndHlwZSc6ICdzdHJpbmcnLFxuICAgICAgJ2VudW0nOiBbXG4gICAgICAgICdudW1iZXInLCAnc3RyaW5nJywgJ251bWJlcltdJywgJ2Jvb2wnLCAnc2hhcGUnLCAndGVuc29yJywgJ3RlbnNvcnMnLFxuICAgICAgICAnZHR5cGUnLCAnc3RyaW5nW10nLCAnZnVuYycsICdkdHlwZVtdJywgJ2Jvb2xbXSdcbiAgICAgIF1cbiAgICB9LFxuICAgICdBdHRyUGFyYW1NYXBwZXInOiB7XG4gICAgICAndHlwZSc6ICdvYmplY3QnLFxuICAgICAgJ3Byb3BlcnRpZXMnOiB7XG4gICAgICAgICduYW1lJzogeyd0eXBlJzogJ3N0cmluZyd9LFxuICAgICAgICAndHlwZSc6IHsnJHJlZic6ICcjL2RlZmluaXRpb25zL1BhcmFtVHlwZXMnfSxcbiAgICAgICAgJ2RlZmF1bHRWYWx1ZSc6IHtcbiAgICAgICAgICAnYW55T2YnOiBbXG4gICAgICAgICAgICB7J3R5cGUnOiAnc3RyaW5nJ30sIHsndHlwZSc6ICdhcnJheScsICdpdGVtcyc6IHsndHlwZSc6ICdzdHJpbmcnfX0sXG4gICAgICAgICAgICB7J3R5cGUnOiAnbnVtYmVyJ30sIHsndHlwZSc6ICdhcnJheScsICdpdGVtcyc6IHsndHlwZSc6ICdudW1iZXInfX0sXG4gICAgICAgICAgICB7J3R5cGUnOiAnYm9vbGVhbid9LCB7J3R5cGUnOiAnYXJyYXknLCAnaXRlbXMnOiB7J3R5cGUnOiAnYm9vbGVhbid9fVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgJ25vdFN1cHBvcnRlZCc6IHsndHlwZSc6ICdib29sZWFuJ30sXG4gICAgICAgICd0Zk5hbWUnOiB7J3R5cGUnOiAnc3RyaW5nJ30sXG4gICAgICAgICd0ZkRlcHJlY2F0ZWROYW1lJzogeyd0eXBlJzogJ3N0cmluZyd9XG4gICAgICB9LFxuICAgICAgJ3JlcXVpcmVkJzogWyduYW1lJywgJ3RmTmFtZScsICd0eXBlJ10sXG4gICAgICAnYWRkaXRpb25hbFByb3BlcnRpZXMnOiBmYWxzZVxuICAgIH0sXG4gICAgJ09wRXhlY3V0b3InOiB7J3R5cGUnOiAnb2JqZWN0JywgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJzogZmFsc2V9XG4gIH0sXG4gICdpdGVtcyc6IHsnJHJlZic6ICcjL2RlZmluaXRpb25zL09wTWFwcGVyJ30sXG4gICd0eXBlJzogJ2FycmF5J1xufTtcbiJdfQ==