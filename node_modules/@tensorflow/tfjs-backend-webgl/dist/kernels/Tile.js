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
import { buffer, Tile, util } from '@tensorflow/tfjs-core';
import { tileImplCPU } from '../kernel_utils/shared';
import { TileProgram } from '../tile_gpu';
export function tile(params) {
    const { inputs, backend, attrs } = params;
    const { x } = inputs;
    const { reps } = attrs;
    // tile gpu program cannot handle rank > 5 case.
    if (x.dtype === 'string' || x.shape.length > 5) {
        // Even thought string tensor is always on CPU, just to be consistent on how
        // to access tensor data.
        const data = backend.readSync(x.dataId);
        const value = x.dtype === 'string' ?
            data.map(d => util.decodeString(d)) :
            data;
        const buf = buffer(x.shape, x.dtype, value);
        const outBuf = tileImplCPU(buf, reps);
        return backend.makeTensorInfo(outBuf.shape, outBuf.dtype, outBuf.values);
    }
    const program = new TileProgram(x.shape, reps);
    const output = backend.runWebGLProgram(program, [x], x.dtype);
    return output;
}
export const tileConfig = {
    kernelName: Tile,
    backendName: 'webgl',
    kernelFunc: tile,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMva2VybmVscy9UaWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQXdDLElBQUksRUFBcUMsSUFBSSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFHbEksT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ25ELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFeEMsTUFBTSxVQUFVLElBQUksQ0FDaEIsTUFBeUU7SUFFM0UsTUFBTSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDLEdBQUcsTUFBTSxDQUFDO0lBQ3hDLE1BQU0sRUFBQyxDQUFDLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFDbkIsTUFBTSxFQUFDLElBQUksRUFBQyxHQUFHLEtBQUssQ0FBQztJQUVyQixnREFBZ0Q7SUFDaEQsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLFFBQVEsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDOUMsNEVBQTRFO1FBQzVFLHlCQUF5QjtRQUN6QixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDO1lBQy9CLElBQXFCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkQsSUFBa0IsQ0FBQztRQUN2QixNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVDLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEMsT0FBTyxPQUFPLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDMUU7SUFFRCxNQUFNLE9BQU8sR0FBRyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQy9DLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTlELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQWlCO0lBQ3RDLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLFVBQVUsRUFBRSxJQUF3QjtDQUNyQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2J1ZmZlciwgS2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jLCBUZW5zb3JJbmZvLCBUaWxlLCBUaWxlQXR0cnMsIFRpbGVJbnB1dHMsIFR5cGVkQXJyYXksIHV0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7TWF0aEJhY2tlbmRXZWJHTH0gZnJvbSAnLi4vYmFja2VuZF93ZWJnbCc7XG5pbXBvcnQge3RpbGVJbXBsQ1BVfSBmcm9tICcuLi9rZXJuZWxfdXRpbHMvc2hhcmVkJztcbmltcG9ydCB7VGlsZVByb2dyYW19IGZyb20gJy4uL3RpbGVfZ3B1JztcblxuZXhwb3J0IGZ1bmN0aW9uIHRpbGUoXG4gICAgcGFyYW1zOiB7aW5wdXRzOiBUaWxlSW5wdXRzLCBiYWNrZW5kOiBNYXRoQmFja2VuZFdlYkdMLCBhdHRyczogVGlsZUF0dHJzfSk6XG4gICAgVGVuc29ySW5mbyB7XG4gIGNvbnN0IHtpbnB1dHMsIGJhY2tlbmQsIGF0dHJzfSA9IHBhcmFtcztcbiAgY29uc3Qge3h9ID0gaW5wdXRzO1xuICBjb25zdCB7cmVwc30gPSBhdHRycztcblxuICAvLyB0aWxlIGdwdSBwcm9ncmFtIGNhbm5vdCBoYW5kbGUgcmFuayA+IDUgY2FzZS5cbiAgaWYgKHguZHR5cGUgPT09ICdzdHJpbmcnIHx8IHguc2hhcGUubGVuZ3RoID4gNSkge1xuICAgIC8vIEV2ZW4gdGhvdWdodCBzdHJpbmcgdGVuc29yIGlzIGFsd2F5cyBvbiBDUFUsIGp1c3QgdG8gYmUgY29uc2lzdGVudCBvbiBob3dcbiAgICAvLyB0byBhY2Nlc3MgdGVuc29yIGRhdGEuXG4gICAgY29uc3QgZGF0YSA9IGJhY2tlbmQucmVhZFN5bmMoeC5kYXRhSWQpO1xuICAgIGNvbnN0IHZhbHVlID0geC5kdHlwZSA9PT0gJ3N0cmluZycgP1xuICAgICAgICAoZGF0YSBhcyBVaW50OEFycmF5W10pLm1hcChkID0+IHV0aWwuZGVjb2RlU3RyaW5nKGQpKSA6XG4gICAgICAgIGRhdGEgYXMgVHlwZWRBcnJheTtcbiAgICBjb25zdCBidWYgPSBidWZmZXIoeC5zaGFwZSwgeC5kdHlwZSwgdmFsdWUpO1xuICAgIGNvbnN0IG91dEJ1ZiA9IHRpbGVJbXBsQ1BVKGJ1ZiwgcmVwcyk7XG4gICAgcmV0dXJuIGJhY2tlbmQubWFrZVRlbnNvckluZm8ob3V0QnVmLnNoYXBlLCBvdXRCdWYuZHR5cGUsIG91dEJ1Zi52YWx1ZXMpO1xuICB9XG5cbiAgY29uc3QgcHJvZ3JhbSA9IG5ldyBUaWxlUHJvZ3JhbSh4LnNoYXBlLCByZXBzKTtcbiAgY29uc3Qgb3V0cHV0ID0gYmFja2VuZC5ydW5XZWJHTFByb2dyYW0ocHJvZ3JhbSwgW3hdLCB4LmR0eXBlKTtcblxuICByZXR1cm4gb3V0cHV0O1xufVxuXG5leHBvcnQgY29uc3QgdGlsZUNvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBUaWxlLFxuICBiYWNrZW5kTmFtZTogJ3dlYmdsJyxcbiAga2VybmVsRnVuYzogdGlsZSBhcyB7fSBhcyBLZXJuZWxGdW5jLFxufTtcbiJdfQ==