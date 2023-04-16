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
import { Conv3D } from '../kernel_names';
import { conv3DBackpropFilter } from '../ops/conv3d_backprop_filter';
import { conv3DBackpropInput } from '../ops/conv3d_backprop_input';
import { tupleValuesAreOne } from '../ops/conv_util';
import * as util from '../util';
export const conv3DGradConfig = {
    kernelName: Conv3D,
    inputsToSave: ['x', 'filter'],
    gradFunc: (dy, saved, attrs) => {
        const { dilations, strides, pad } = attrs;
        util.assert(tupleValuesAreOne(dilations), () => 'Error in gradient of conv3D: dilation rates greater than 1 are ' +
            `not yet supported in gradients. Got dilations '${dilations}'`);
        const [x5D, $filter] = saved;
        return {
            x: () => conv3DBackpropInput(x5D.shape, dy, $filter, strides, pad),
            filter: () => conv3DBackpropFilter(x5D, dy, $filter.shape, strides, pad)
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udjNEX2dyYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2dyYWRpZW50cy9Db252M0RfZ3JhZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxPQUFPLEVBQUMsTUFBTSxFQUFjLE1BQU0saUJBQWlCLENBQUM7QUFFcEQsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDbkUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDakUsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFFbkQsT0FBTyxLQUFLLElBQUksTUFBTSxTQUFTLENBQUM7QUFFaEMsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQWU7SUFDMUMsVUFBVSxFQUFFLE1BQU07SUFDbEIsWUFBWSxFQUFFLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQztJQUM3QixRQUFRLEVBQUUsQ0FBQyxFQUFZLEVBQUUsS0FBZSxFQUFFLEtBQW1CLEVBQUUsRUFBRTtRQUMvRCxNQUFNLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUMsR0FBRyxLQUEwQixDQUFDO1FBQzdELElBQUksQ0FBQyxNQUFNLENBQ1AsaUJBQWlCLENBQUMsU0FBUyxDQUFDLEVBQzVCLEdBQUcsRUFBRSxDQUNELGlFQUFpRTtZQUNqRSxrREFBa0QsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUV4RSxNQUFNLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUU3QixPQUFPO1lBQ0wsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUN2QixHQUFnQixDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsT0FBbUIsRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDO1lBQ25FLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxvQkFBb0IsQ0FDOUIsR0FBZSxFQUFFLEVBQUUsRUFBRyxPQUFvQixDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDO1NBQ3BFLENBQUM7SUFDSixDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbmltcG9ydCB7Q29udjNELCBDb252M0RBdHRyc30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7R3JhZENvbmZpZywgTmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtjb252M0RCYWNrcHJvcEZpbHRlcn0gZnJvbSAnLi4vb3BzL2NvbnYzZF9iYWNrcHJvcF9maWx0ZXInO1xuaW1wb3J0IHtjb252M0RCYWNrcHJvcElucHV0fSBmcm9tICcuLi9vcHMvY29udjNkX2JhY2twcm9wX2lucHV0JztcbmltcG9ydCB7dHVwbGVWYWx1ZXNBcmVPbmV9IGZyb20gJy4uL29wcy9jb252X3V0aWwnO1xuaW1wb3J0IHtUZW5zb3IsIFRlbnNvcjVEfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi91dGlsJztcblxuZXhwb3J0IGNvbnN0IGNvbnYzREdyYWRDb25maWc6IEdyYWRDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IENvbnYzRCxcbiAgaW5wdXRzVG9TYXZlOiBbJ3gnLCAnZmlsdGVyJ10sXG4gIGdyYWRGdW5jOiAoZHk6IFRlbnNvcjVELCBzYXZlZDogVGVuc29yW10sIGF0dHJzOiBOYW1lZEF0dHJNYXApID0+IHtcbiAgICBjb25zdCB7ZGlsYXRpb25zLCBzdHJpZGVzLCBwYWR9ID0gYXR0cnMgYXMge30gYXMgQ29udjNEQXR0cnM7XG4gICAgdXRpbC5hc3NlcnQoXG4gICAgICAgIHR1cGxlVmFsdWVzQXJlT25lKGRpbGF0aW9ucyksXG4gICAgICAgICgpID0+XG4gICAgICAgICAgICAnRXJyb3IgaW4gZ3JhZGllbnQgb2YgY29udjNEOiBkaWxhdGlvbiByYXRlcyBncmVhdGVyIHRoYW4gMSBhcmUgJyArXG4gICAgICAgICAgICBgbm90IHlldCBzdXBwb3J0ZWQgaW4gZ3JhZGllbnRzLiBHb3QgZGlsYXRpb25zICcke2RpbGF0aW9uc30nYCk7XG5cbiAgICBjb25zdCBbeDVELCAkZmlsdGVyXSA9IHNhdmVkO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6ICgpID0+IGNvbnYzREJhY2twcm9wSW5wdXQoXG4gICAgICAgICAgKHg1RCBhcyBUZW5zb3I1RCkuc2hhcGUsIGR5LCAkZmlsdGVyIGFzIFRlbnNvcjVELCBzdHJpZGVzLCBwYWQpLFxuICAgICAgZmlsdGVyOiAoKSA9PiBjb252M0RCYWNrcHJvcEZpbHRlcihcbiAgICAgICAgICB4NUQgYXMgVGVuc29yNUQsIGR5LCAoJGZpbHRlciBhcyBUZW5zb3I1RCkuc2hhcGUsIHN0cmlkZXMsIHBhZClcbiAgICB9O1xuICB9XG59O1xuIl19