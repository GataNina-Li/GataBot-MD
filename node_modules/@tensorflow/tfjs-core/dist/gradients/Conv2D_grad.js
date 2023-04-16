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
import { Conv2D } from '../kernel_names';
import { conv2DBackpropFilter } from '../ops/conv2d_backprop_filter';
import { conv2DBackpropInput } from '../ops/conv2d_backprop_input';
import * as conv_util from '../ops/conv_util';
import * as util from '../util';
export const conv2DGradConfig = {
    kernelName: Conv2D,
    inputsToSave: ['x', 'filter'],
    gradFunc: (dy, saved, attrs) => {
        const [x4D, $filter] = saved;
        const { dilations, strides, pad, dataFormat } = attrs;
        util.assert(conv_util.tupleValuesAreOne(dilations), () => 'Error in gradient of conv2D: dilation rates greater than 1 ' +
            `are not yet supported in gradients. Got dilations '${dilations}'`);
        return {
            x: () => conv2DBackpropInput(x4D.shape, dy, $filter, strides, pad, dataFormat),
            filter: () => conv2DBackpropFilter(x4D, dy, $filter.shape, strides, pad, dataFormat)
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udjJEX2dyYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2dyYWRpZW50cy9Db252MkRfZ3JhZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxPQUFPLEVBQUMsTUFBTSxFQUFjLE1BQU0saUJBQWlCLENBQUM7QUFFcEQsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDbkUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDakUsT0FBTyxLQUFLLFNBQVMsTUFBTSxrQkFBa0IsQ0FBQztBQUU5QyxPQUFPLEtBQUssSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUVoQyxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBZTtJQUMxQyxVQUFVLEVBQUUsTUFBTTtJQUNsQixZQUFZLEVBQUUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDO0lBQzdCLFFBQVEsRUFBRSxDQUFDLEVBQVksRUFBRSxLQUFlLEVBQUUsS0FBbUIsRUFBRSxFQUFFO1FBQy9ELE1BQU0sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsS0FBNkIsQ0FBQztRQUNyRCxNQUFNLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFDLEdBQUcsS0FBMEIsQ0FBQztRQUV6RSxJQUFJLENBQUMsTUFBTSxDQUNQLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsRUFDdEMsR0FBRyxFQUFFLENBQUMsNkRBQTZEO1lBQy9ELHNEQUFzRCxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBRTVFLE9BQU87WUFDTCxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQ0osbUJBQW1CLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDO1lBQ3pFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FDVCxvQkFBb0IsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUM7U0FDM0UsQ0FBQztJQUNKLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuaW1wb3J0IHtDb252MkQsIENvbnYyREF0dHJzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtHcmFkQ29uZmlnLCBOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge2NvbnYyREJhY2twcm9wRmlsdGVyfSBmcm9tICcuLi9vcHMvY29udjJkX2JhY2twcm9wX2ZpbHRlcic7XG5pbXBvcnQge2NvbnYyREJhY2twcm9wSW5wdXR9IGZyb20gJy4uL29wcy9jb252MmRfYmFja3Byb3BfaW5wdXQnO1xuaW1wb3J0ICogYXMgY29udl91dGlsIGZyb20gJy4uL29wcy9jb252X3V0aWwnO1xuaW1wb3J0IHtUZW5zb3IsIFRlbnNvcjREfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi91dGlsJztcblxuZXhwb3J0IGNvbnN0IGNvbnYyREdyYWRDb25maWc6IEdyYWRDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IENvbnYyRCxcbiAgaW5wdXRzVG9TYXZlOiBbJ3gnLCAnZmlsdGVyJ10sXG4gIGdyYWRGdW5jOiAoZHk6IFRlbnNvcjRELCBzYXZlZDogVGVuc29yW10sIGF0dHJzOiBOYW1lZEF0dHJNYXApID0+IHtcbiAgICBjb25zdCBbeDRELCAkZmlsdGVyXSA9IHNhdmVkIGFzIFtUZW5zb3I0RCwgVGVuc29yNERdO1xuICAgIGNvbnN0IHtkaWxhdGlvbnMsIHN0cmlkZXMsIHBhZCwgZGF0YUZvcm1hdH0gPSBhdHRycyBhcyB7fSBhcyBDb252MkRBdHRycztcblxuICAgIHV0aWwuYXNzZXJ0KFxuICAgICAgICBjb252X3V0aWwudHVwbGVWYWx1ZXNBcmVPbmUoZGlsYXRpb25zKSxcbiAgICAgICAgKCkgPT4gJ0Vycm9yIGluIGdyYWRpZW50IG9mIGNvbnYyRDogZGlsYXRpb24gcmF0ZXMgZ3JlYXRlciB0aGFuIDEgJyArXG4gICAgICAgICAgICBgYXJlIG5vdCB5ZXQgc3VwcG9ydGVkIGluIGdyYWRpZW50cy4gR290IGRpbGF0aW9ucyAnJHtkaWxhdGlvbnN9J2ApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6ICgpID0+XG4gICAgICAgICAgY29udjJEQmFja3Byb3BJbnB1dCh4NEQuc2hhcGUsIGR5LCAkZmlsdGVyLCBzdHJpZGVzLCBwYWQsIGRhdGFGb3JtYXQpLFxuICAgICAgZmlsdGVyOiAoKSA9PlxuICAgICAgICAgIGNvbnYyREJhY2twcm9wRmlsdGVyKHg0RCwgZHksICRmaWx0ZXIuc2hhcGUsIHN0cmlkZXMsIHBhZCwgZGF0YUZvcm1hdClcbiAgICB9O1xuICB9XG59O1xuIl19