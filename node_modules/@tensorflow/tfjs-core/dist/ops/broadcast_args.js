/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
import { ENGINE } from '../engine';
import { BroadcastArgs } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
/**
 * Return the shape of s0 op s1 with broadcast.
 *
 * compute r0, the broadcasted shape as a tensor.
 * s0, s1 and r0 are all integer vectors.
 *
 * This function returns the shape of the result of an operation between
 * two tensors of size s0 and s1 performed with broadcast.
 *
 * @param s0 A tensor representing a shape
 * @param s1 A tensor representing a shape
 *
 * @doc {heading: 'Tensors', subheading: 'Transformations'}
 */
function broadcastArgs_(s0, s1) {
    const shape1Input = convertToTensor(s0, 's0', 'broadcastArgs', 'int32');
    const shape2Input = convertToTensor(s1, 's1', 'broadcastArgs', 'int32');
    if (shape1Input.rank !== 1) {
        throw new Error('broadcastArgs(): first input must be a vector (rank=1). ' +
            `Has rank ${shape1Input.rank}`);
    }
    if (shape2Input.rank !== 1) {
        throw new Error('broadcastArgs(): second input must be a vector (rank=1). ' +
            `Has rank ${shape2Input.rank}`);
    }
    const inputs = { s0: shape1Input, s1: shape2Input };
    return ENGINE.runKernel(BroadcastArgs, inputs);
}
export const broadcastArgs = op({ broadcastArgs_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvYWRjYXN0X2FyZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9icm9hZGNhc3RfYXJncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFHSCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ25DLE9BQU8sRUFBRSxhQUFhLEVBQXVCLE1BQU0saUJBQWlCLENBQUM7QUFFckUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBR3JELE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFakM7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILFNBQVMsY0FBYyxDQUNyQixFQUF1QixFQUFFLEVBQXVCO0lBQ2hELE1BQU0sV0FBVyxHQUFHLGVBQWUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN4RSxNQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFeEUsSUFBSSxXQUFXLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtRQUMxQixNQUFNLElBQUksS0FBSyxDQUNiLDBEQUEwRDtZQUMxRCxZQUFZLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQ25DO0lBRUQsSUFBSSxXQUFXLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtRQUMxQixNQUFNLElBQUksS0FBSyxDQUNiLDJEQUEyRDtZQUMzRCxZQUFZLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQ25DO0lBRUQsTUFBTSxNQUFNLEdBQXdCLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUM7SUFDekUsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxNQUE4QixDQUFDLENBQUM7QUFDekUsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQgeyBOYW1lZFRlbnNvck1hcCB9IGZyb20gJy4uL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQgeyBFTkdJTkUgfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHsgQnJvYWRjYXN0QXJncywgQnJvYWRjYXN0QXJnc0lucHV0cyB9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQgeyBUZW5zb3IgfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHsgY29udmVydFRvVGVuc29yIH0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7IFJhbmssIFRlbnNvckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7IG9wIH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuXG4vKipcbiAqIFJldHVybiB0aGUgc2hhcGUgb2YgczAgb3AgczEgd2l0aCBicm9hZGNhc3QuXG4gKlxuICogY29tcHV0ZSByMCwgdGhlIGJyb2FkY2FzdGVkIHNoYXBlIGFzIGEgdGVuc29yLlxuICogczAsIHMxIGFuZCByMCBhcmUgYWxsIGludGVnZXIgdmVjdG9ycy5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIHNoYXBlIG9mIHRoZSByZXN1bHQgb2YgYW4gb3BlcmF0aW9uIGJldHdlZW5cbiAqIHR3byB0ZW5zb3JzIG9mIHNpemUgczAgYW5kIHMxIHBlcmZvcm1lZCB3aXRoIGJyb2FkY2FzdC5cbiAqXG4gKiBAcGFyYW0gczAgQSB0ZW5zb3IgcmVwcmVzZW50aW5nIGEgc2hhcGVcbiAqIEBwYXJhbSBzMSBBIHRlbnNvciByZXByZXNlbnRpbmcgYSBzaGFwZVxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdUZW5zb3JzJywgc3ViaGVhZGluZzogJ1RyYW5zZm9ybWF0aW9ucyd9XG4gKi9cbmZ1bmN0aW9uIGJyb2FkY2FzdEFyZ3NfPFIgZXh0ZW5kcyBSYW5rPihcbiAgczA6IFRlbnNvciB8IFRlbnNvckxpa2UsIHMxOiBUZW5zb3IgfCBUZW5zb3JMaWtlKTogVGVuc29yPFI+IHtcbiAgY29uc3Qgc2hhcGUxSW5wdXQgPSBjb252ZXJ0VG9UZW5zb3IoczAsICdzMCcsICdicm9hZGNhc3RBcmdzJywgJ2ludDMyJyk7XG4gIGNvbnN0IHNoYXBlMklucHV0ID0gY29udmVydFRvVGVuc29yKHMxLCAnczEnLCAnYnJvYWRjYXN0QXJncycsICdpbnQzMicpO1xuXG4gIGlmIChzaGFwZTFJbnB1dC5yYW5rICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ2Jyb2FkY2FzdEFyZ3MoKTogZmlyc3QgaW5wdXQgbXVzdCBiZSBhIHZlY3RvciAocmFuaz0xKS4gJyArXG4gICAgICBgSGFzIHJhbmsgJHtzaGFwZTFJbnB1dC5yYW5rfWApO1xuICB9XG5cbiAgaWYgKHNoYXBlMklucHV0LnJhbmsgIT09IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnYnJvYWRjYXN0QXJncygpOiBzZWNvbmQgaW5wdXQgbXVzdCBiZSBhIHZlY3RvciAocmFuaz0xKS4gJyArXG4gICAgICBgSGFzIHJhbmsgJHtzaGFwZTJJbnB1dC5yYW5rfWApO1xuICB9XG5cbiAgY29uc3QgaW5wdXRzOiBCcm9hZGNhc3RBcmdzSW5wdXRzID0geyBzMDogc2hhcGUxSW5wdXQsIHMxOiBzaGFwZTJJbnB1dCB9O1xuICByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChCcm9hZGNhc3RBcmdzLCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXApO1xufVxuXG5leHBvcnQgY29uc3QgYnJvYWRjYXN0QXJncyA9IG9wKHsgYnJvYWRjYXN0QXJnc18gfSk7XG4iXX0=