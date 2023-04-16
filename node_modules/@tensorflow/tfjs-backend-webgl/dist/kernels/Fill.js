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
import { Fill, util } from '@tensorflow/tfjs-core';
import { FillProgram } from '../fill_gpu';
export function fill(args) {
    const { backend, attrs } = args;
    const { shape, value } = attrs;
    let { dtype } = attrs;
    dtype = dtype || util.inferDtype(value);
    if (dtype === 'string') {
        // String type should be handled in CPU memory.
        const values = util.getArrayFromDType(dtype, util.sizeFromShape(shape));
        values.fill(value);
        return backend.makeTensorInfo(shape, dtype, values);
    }
    else {
        const program = new FillProgram(shape, value);
        const customValues = [[value]];
        return backend.runWebGLProgram(program, [], dtype, customValues);
    }
}
export const fillConfig = {
    kernelName: Fill,
    backendName: 'webgl',
    kernelFunc: fill
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMva2VybmVscy9GaWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxJQUFJLEVBQW1ELElBQUksRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBR2xHLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFeEMsTUFBTSxVQUFVLElBQUksQ0FBQyxJQUFtRDtJQUV0RSxNQUFNLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBQyxHQUFHLElBQUksQ0FBQztJQUM5QixNQUFNLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxHQUFHLEtBQUssQ0FBQztJQUM3QixJQUFJLEVBQUMsS0FBSyxFQUFDLEdBQUcsS0FBSyxDQUFDO0lBRXBCLEtBQUssR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUV4QyxJQUFJLEtBQUssS0FBSyxRQUFRLEVBQUU7UUFDdEIsK0NBQStDO1FBQy9DLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBZSxDQUFDLENBQUM7UUFDN0IsT0FBTyxPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDckQ7U0FBTTtRQUNMLE1BQU0sT0FBTyxHQUFHLElBQUksV0FBVyxDQUFDLEtBQUssRUFBRSxLQUFlLENBQUMsQ0FBQztRQUN4RCxNQUFNLFlBQVksR0FBRyxDQUFDLENBQUMsS0FBZSxDQUFDLENBQUMsQ0FBQztRQUN6QyxPQUFPLE9BQU8sQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7S0FDbEU7QUFDSCxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFpQjtJQUN0QyxVQUFVLEVBQUUsSUFBSTtJQUNoQixXQUFXLEVBQUUsT0FBTztJQUNwQixVQUFVLEVBQUUsSUFBd0I7Q0FDckMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtGaWxsLCBGaWxsQXR0cnMsIEtlcm5lbENvbmZpZywgS2VybmVsRnVuYywgVGVuc29ySW5mbywgdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtNYXRoQmFja2VuZFdlYkdMfSBmcm9tICcuLi9iYWNrZW5kX3dlYmdsJztcbmltcG9ydCB7RmlsbFByb2dyYW19IGZyb20gJy4uL2ZpbGxfZ3B1JztcblxuZXhwb3J0IGZ1bmN0aW9uIGZpbGwoYXJnczoge2JhY2tlbmQ6IE1hdGhCYWNrZW5kV2ViR0wsIGF0dHJzOiBGaWxsQXR0cnN9KTpcbiAgICBUZW5zb3JJbmZvIHtcbiAgY29uc3Qge2JhY2tlbmQsIGF0dHJzfSA9IGFyZ3M7XG4gIGNvbnN0IHtzaGFwZSwgdmFsdWV9ID0gYXR0cnM7XG4gIGxldCB7ZHR5cGV9ID0gYXR0cnM7XG5cbiAgZHR5cGUgPSBkdHlwZSB8fCB1dGlsLmluZmVyRHR5cGUodmFsdWUpO1xuXG4gIGlmIChkdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBTdHJpbmcgdHlwZSBzaG91bGQgYmUgaGFuZGxlZCBpbiBDUFUgbWVtb3J5LlxuICAgIGNvbnN0IHZhbHVlcyA9IHV0aWwuZ2V0QXJyYXlGcm9tRFR5cGUoZHR5cGUsIHV0aWwuc2l6ZUZyb21TaGFwZShzaGFwZSkpO1xuICAgIHZhbHVlcy5maWxsKHZhbHVlIGFzIHN0cmluZyk7XG4gICAgcmV0dXJuIGJhY2tlbmQubWFrZVRlbnNvckluZm8oc2hhcGUsIGR0eXBlLCB2YWx1ZXMpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHByb2dyYW0gPSBuZXcgRmlsbFByb2dyYW0oc2hhcGUsIHZhbHVlIGFzIG51bWJlcik7XG4gICAgY29uc3QgY3VzdG9tVmFsdWVzID0gW1t2YWx1ZSBhcyBudW1iZXJdXTtcbiAgICByZXR1cm4gYmFja2VuZC5ydW5XZWJHTFByb2dyYW0ocHJvZ3JhbSwgW10sIGR0eXBlLCBjdXN0b21WYWx1ZXMpO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBmaWxsQ29uZmlnOiBLZXJuZWxDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IEZpbGwsXG4gIGJhY2tlbmROYW1lOiAnd2ViZ2wnLFxuICBrZXJuZWxGdW5jOiBmaWxsIGFzIHt9IGFzIEtlcm5lbEZ1bmNcbn07XG4iXX0=