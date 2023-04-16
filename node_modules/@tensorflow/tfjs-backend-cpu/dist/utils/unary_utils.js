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
import { util } from '@tensorflow/tfjs-core';
import { assertNotComplex } from '../cpu_util';
/**
 * Template that creates a `KernelFunc` for unary ops.
 * @param name Kernel name.
 * @param op A `SimpleUnaryOperation` for the kernel.
 * @param dtype Optional. If set, the result has this dtype. Otherwise, the
 *     result has the same dtype as the input. This is mainly used in certain
 *     kernels that return bool type, such as isFinite, isInf, etc.
 */
export function unaryKernelFunc(name, op, dtype) {
    return ({ inputs, attrs, backend }) => {
        const { x } = inputs;
        assertNotComplex(x, name);
        if (x.dtype === 'string' || dtype === 'string') {
            throw new Error('unaryKernelFunc does not support string input/output');
        }
        const cpuBackend = backend;
        const values = cpuBackend.data.get(x.dataId).values;
        const xSize = util.sizeFromShape(x.shape);
        const $dtype = dtype || x.dtype;
        const newValues = util.getArrayFromDType($dtype, xSize);
        for (let i = 0; i < xSize; ++i) {
            newValues[i] = op(values[i], attrs);
        }
        return cpuBackend.makeTensorInfo(x.shape, $dtype, newValues);
    };
}
/**
 * Template that creates a `KernelFunc` for unary ops from the given
 * `SimpleUnaryImpl`..
 * @param name Kernel name.
 * @param unaryImpl A `SimpleUnaryImpl` that implements the op.
 * @param dtype Optional. If set, the result has this dtype. Otherwise, the
 *     result has the same dtype as the input. This is mainly used in certain
 *     kernels that return bool type, such as isFinite, isInf, etc.
 */
export function unaryKernelFuncFromImpl(name, unaryImpl, dtype) {
    return ({ inputs, attrs, backend }) => {
        const { x } = inputs;
        assertNotComplex(x, name);
        if (x.dtype === 'string' || dtype === 'string') {
            throw new Error('unaryKernelFunc does not support string input/output');
        }
        const cpuBackend = backend;
        const values = cpuBackend.data.get(x.dataId).values;
        const $dtype = dtype || x.dtype;
        const newValues = unaryImpl(values, $dtype, attrs);
        return cpuBackend.makeTensorInfo(x.shape, $dtype, newValues);
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5hcnlfdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtY3B1L3NyYy91dGlscy91bmFyeV91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQWdELElBQUksRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRzFGLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUk3Qzs7Ozs7OztHQU9HO0FBQ0gsTUFBTSxVQUFVLGVBQWUsQ0FDM0IsSUFBWSxFQUFFLEVBQXdCLEVBQUUsS0FBZ0I7SUFDMUQsT0FBTyxDQUFDLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUMsRUFBRSxFQUFFO1FBQ2xDLE1BQU0sRUFBQyxDQUFDLEVBQUMsR0FBRyxNQUFxQixDQUFDO1FBQ2xDLGdCQUFnQixDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDOUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO1NBQ3pFO1FBRUQsTUFBTSxVQUFVLEdBQUcsT0FBeUIsQ0FBQztRQUM3QyxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBb0IsQ0FBQztRQUNsRSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQyxNQUFNLE1BQU0sR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNoQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDOUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDckM7UUFDRCxPQUFPLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDL0QsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxVQUFVLHVCQUF1QixDQUNuQyxJQUFZLEVBQUUsU0FBMEIsRUFBRSxLQUFnQjtJQUM1RCxPQUFPLENBQUMsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBQyxFQUFFLEVBQUU7UUFDbEMsTUFBTSxFQUFDLENBQUMsRUFBQyxHQUFHLE1BQXFCLENBQUM7UUFDbEMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUM5QyxNQUFNLElBQUksS0FBSyxDQUFDLHNEQUFzRCxDQUFDLENBQUM7U0FDekU7UUFFRCxNQUFNLFVBQVUsR0FBRyxPQUF5QixDQUFDO1FBQzdDLE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFvQixDQUFDO1FBQ2xFLE1BQU0sTUFBTSxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ2hDLE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25ELE9BQU8sVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMvRCxDQUFDLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0RhdGFUeXBlLCBLZXJuZWxGdW5jLCBUeXBlZEFycmF5LCBVbmFyeUlucHV0cywgdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtNYXRoQmFja2VuZENQVX0gZnJvbSAnLi4vYmFja2VuZF9jcHUnO1xuaW1wb3J0IHthc3NlcnROb3RDb21wbGV4fSBmcm9tICcuLi9jcHVfdXRpbCc7XG5cbmltcG9ydCB7U2ltcGxlVW5hcnlJbXBsLCBTaW1wbGVVbmFyeU9wZXJhdGlvbn0gZnJvbSAnLi91bmFyeV90eXBlcyc7XG5cbi8qKlxuICogVGVtcGxhdGUgdGhhdCBjcmVhdGVzIGEgYEtlcm5lbEZ1bmNgIGZvciB1bmFyeSBvcHMuXG4gKiBAcGFyYW0gbmFtZSBLZXJuZWwgbmFtZS5cbiAqIEBwYXJhbSBvcCBBIGBTaW1wbGVVbmFyeU9wZXJhdGlvbmAgZm9yIHRoZSBrZXJuZWwuXG4gKiBAcGFyYW0gZHR5cGUgT3B0aW9uYWwuIElmIHNldCwgdGhlIHJlc3VsdCBoYXMgdGhpcyBkdHlwZS4gT3RoZXJ3aXNlLCB0aGVcbiAqICAgICByZXN1bHQgaGFzIHRoZSBzYW1lIGR0eXBlIGFzIHRoZSBpbnB1dC4gVGhpcyBpcyBtYWlubHkgdXNlZCBpbiBjZXJ0YWluXG4gKiAgICAga2VybmVscyB0aGF0IHJldHVybiBib29sIHR5cGUsIHN1Y2ggYXMgaXNGaW5pdGUsIGlzSW5mLCBldGMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmFyeUtlcm5lbEZ1bmMoXG4gICAgbmFtZTogc3RyaW5nLCBvcDogU2ltcGxlVW5hcnlPcGVyYXRpb24sIGR0eXBlPzogRGF0YVR5cGUpOiBLZXJuZWxGdW5jIHtcbiAgcmV0dXJuICh7aW5wdXRzLCBhdHRycywgYmFja2VuZH0pID0+IHtcbiAgICBjb25zdCB7eH0gPSBpbnB1dHMgYXMgVW5hcnlJbnB1dHM7XG4gICAgYXNzZXJ0Tm90Q29tcGxleCh4LCBuYW1lKTtcbiAgICBpZiAoeC5kdHlwZSA9PT0gJ3N0cmluZycgfHwgZHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuYXJ5S2VybmVsRnVuYyBkb2VzIG5vdCBzdXBwb3J0IHN0cmluZyBpbnB1dC9vdXRwdXQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBjcHVCYWNrZW5kID0gYmFja2VuZCBhcyBNYXRoQmFja2VuZENQVTtcbiAgICBjb25zdCB2YWx1ZXMgPSBjcHVCYWNrZW5kLmRhdGEuZ2V0KHguZGF0YUlkKS52YWx1ZXMgYXMgVHlwZWRBcnJheTtcbiAgICBjb25zdCB4U2l6ZSA9IHV0aWwuc2l6ZUZyb21TaGFwZSh4LnNoYXBlKTtcbiAgICBjb25zdCAkZHR5cGUgPSBkdHlwZSB8fCB4LmR0eXBlO1xuICAgIGNvbnN0IG5ld1ZhbHVlcyA9IHV0aWwuZ2V0QXJyYXlGcm9tRFR5cGUoJGR0eXBlLCB4U2l6ZSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB4U2l6ZTsgKytpKSB7XG4gICAgICBuZXdWYWx1ZXNbaV0gPSBvcCh2YWx1ZXNbaV0sIGF0dHJzKTtcbiAgICB9XG4gICAgcmV0dXJuIGNwdUJhY2tlbmQubWFrZVRlbnNvckluZm8oeC5zaGFwZSwgJGR0eXBlLCBuZXdWYWx1ZXMpO1xuICB9O1xufVxuXG4vKipcbiAqIFRlbXBsYXRlIHRoYXQgY3JlYXRlcyBhIGBLZXJuZWxGdW5jYCBmb3IgdW5hcnkgb3BzIGZyb20gdGhlIGdpdmVuXG4gKiBgU2ltcGxlVW5hcnlJbXBsYC4uXG4gKiBAcGFyYW0gbmFtZSBLZXJuZWwgbmFtZS5cbiAqIEBwYXJhbSB1bmFyeUltcGwgQSBgU2ltcGxlVW5hcnlJbXBsYCB0aGF0IGltcGxlbWVudHMgdGhlIG9wLlxuICogQHBhcmFtIGR0eXBlIE9wdGlvbmFsLiBJZiBzZXQsIHRoZSByZXN1bHQgaGFzIHRoaXMgZHR5cGUuIE90aGVyd2lzZSwgdGhlXG4gKiAgICAgcmVzdWx0IGhhcyB0aGUgc2FtZSBkdHlwZSBhcyB0aGUgaW5wdXQuIFRoaXMgaXMgbWFpbmx5IHVzZWQgaW4gY2VydGFpblxuICogICAgIGtlcm5lbHMgdGhhdCByZXR1cm4gYm9vbCB0eXBlLCBzdWNoIGFzIGlzRmluaXRlLCBpc0luZiwgZXRjLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5hcnlLZXJuZWxGdW5jRnJvbUltcGwoXG4gICAgbmFtZTogc3RyaW5nLCB1bmFyeUltcGw6IFNpbXBsZVVuYXJ5SW1wbCwgZHR5cGU/OiBEYXRhVHlwZSk6IEtlcm5lbEZ1bmMge1xuICByZXR1cm4gKHtpbnB1dHMsIGF0dHJzLCBiYWNrZW5kfSkgPT4ge1xuICAgIGNvbnN0IHt4fSA9IGlucHV0cyBhcyBVbmFyeUlucHV0cztcbiAgICBhc3NlcnROb3RDb21wbGV4KHgsIG5hbWUpO1xuICAgIGlmICh4LmR0eXBlID09PSAnc3RyaW5nJyB8fCBkdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndW5hcnlLZXJuZWxGdW5jIGRvZXMgbm90IHN1cHBvcnQgc3RyaW5nIGlucHV0L291dHB1dCcpO1xuICAgIH1cblxuICAgIGNvbnN0IGNwdUJhY2tlbmQgPSBiYWNrZW5kIGFzIE1hdGhCYWNrZW5kQ1BVO1xuICAgIGNvbnN0IHZhbHVlcyA9IGNwdUJhY2tlbmQuZGF0YS5nZXQoeC5kYXRhSWQpLnZhbHVlcyBhcyBUeXBlZEFycmF5O1xuICAgIGNvbnN0ICRkdHlwZSA9IGR0eXBlIHx8IHguZHR5cGU7XG4gICAgY29uc3QgbmV3VmFsdWVzID0gdW5hcnlJbXBsKHZhbHVlcywgJGR0eXBlLCBhdHRycyk7XG4gICAgcmV0dXJuIGNwdUJhY2tlbmQubWFrZVRlbnNvckluZm8oeC5zaGFwZSwgJGR0eXBlLCBuZXdWYWx1ZXMpO1xuICB9O1xufVxuIl19