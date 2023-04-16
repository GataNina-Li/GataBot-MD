/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
import { LRN } from '../kernel_names';
import { localResponseNormalizationBackprop } from '../ops/local_response_normalization_backprop';
export const lrnGradConfig = {
    kernelName: LRN,
    inputsToSave: ['x'],
    outputsToSave: [true],
    gradFunc: (dy, saved, attrs) => {
        const [x, y] = saved;
        const { depthRadius, bias, alpha, beta } = attrs;
        return {
            x: () => localResponseNormalizationBackprop(x, y, dy, depthRadius, bias, alpha, beta)
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTFJOX2dyYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2dyYWRpZW50cy9MUk5fZ3JhZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxPQUFPLEVBQUMsR0FBRyxFQUFXLE1BQU0saUJBQWlCLENBQUM7QUFFOUMsT0FBTyxFQUFDLGtDQUFrQyxFQUFDLE1BQU0sOENBQThDLENBQUM7QUFHaEcsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFlO0lBQ3ZDLFVBQVUsRUFBRSxHQUFHO0lBQ2YsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQ25CLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQztJQUNyQixRQUFRLEVBQUUsQ0FBQyxFQUFZLEVBQUUsS0FBZSxFQUFFLEtBQW1CLEVBQUUsRUFBRTtRQUMvRCxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQTZCLENBQUM7UUFDN0MsTUFBTSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQyxHQUFHLEtBQXVCLENBQUM7UUFFakUsT0FBTztZQUNMLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxrQ0FBa0MsQ0FDdkMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDO1NBQzlDLENBQUM7SUFDSixDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbmltcG9ydCB7TFJOLCBMUk5BdHRyc30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7R3JhZENvbmZpZywgTmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtsb2NhbFJlc3BvbnNlTm9ybWFsaXphdGlvbkJhY2twcm9wfSBmcm9tICcuLi9vcHMvbG9jYWxfcmVzcG9uc2Vfbm9ybWFsaXphdGlvbl9iYWNrcHJvcCc7XG5pbXBvcnQge1RlbnNvciwgVGVuc29yNER9IGZyb20gJy4uL3RlbnNvcic7XG5cbmV4cG9ydCBjb25zdCBscm5HcmFkQ29uZmlnOiBHcmFkQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBMUk4sXG4gIGlucHV0c1RvU2F2ZTogWyd4J10sXG4gIG91dHB1dHNUb1NhdmU6IFt0cnVlXSxcbiAgZ3JhZEZ1bmM6IChkeTogVGVuc29yNEQsIHNhdmVkOiBUZW5zb3JbXSwgYXR0cnM6IE5hbWVkQXR0ck1hcCkgPT4ge1xuICAgIGNvbnN0IFt4LCB5XSA9IHNhdmVkIGFzIFtUZW5zb3I0RCwgVGVuc29yNERdO1xuICAgIGNvbnN0IHtkZXB0aFJhZGl1cywgYmlhcywgYWxwaGEsIGJldGF9ID0gYXR0cnMgYXMge30gYXMgTFJOQXR0cnM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgeDogKCkgPT4gbG9jYWxSZXNwb25zZU5vcm1hbGl6YXRpb25CYWNrcHJvcChcbiAgICAgICAgICB4LCB5LCBkeSwgZGVwdGhSYWRpdXMsIGJpYXMsIGFscGhhLCBiZXRhKVxuICAgIH07XG4gIH1cbn07XG4iXX0=