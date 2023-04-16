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
import { Imag } from '@tensorflow/tfjs-core';
import { identity } from './Identity';
export function imag(args) {
    const { inputs, backend } = args;
    const { input } = inputs;
    const inputData = backend.texData.get(input.dataId);
    return identity({ inputs: { x: inputData.complexTensorInfos.imag }, backend });
}
export const imagConfig = {
    kernelName: Imag,
    backendName: 'webgl',
    kernelFunc: imag
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW1hZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMva2VybmVscy9JbWFnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxJQUFJLEVBQW1ELE1BQU0sdUJBQXVCLENBQUM7QUFHN0YsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUVwQyxNQUFNLFVBQVUsSUFBSSxDQUFDLElBQXFEO0lBRXhFLE1BQU0sRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFDLEdBQUcsSUFBSSxDQUFDO0lBQy9CLE1BQU0sRUFBQyxLQUFLLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFDdkIsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXBELE9BQU8sUUFBUSxDQUFDLEVBQUMsTUFBTSxFQUFFLEVBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO0FBQzdFLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQWlCO0lBQ3RDLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLFVBQVUsRUFBRSxJQUF3QjtDQUNyQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0ltYWcsIEltYWdJbnB1dHMsIEtlcm5lbENvbmZpZywgS2VybmVsRnVuYywgVGVuc29ySW5mb30gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtNYXRoQmFja2VuZFdlYkdMfSBmcm9tICcuLi9iYWNrZW5kX3dlYmdsJztcbmltcG9ydCB7aWRlbnRpdHl9IGZyb20gJy4vSWRlbnRpdHknO1xuXG5leHBvcnQgZnVuY3Rpb24gaW1hZyhhcmdzOiB7aW5wdXRzOiBJbWFnSW5wdXRzLCBiYWNrZW5kOiBNYXRoQmFja2VuZFdlYkdMfSk6XG4gICAgVGVuc29ySW5mbyB7XG4gIGNvbnN0IHtpbnB1dHMsIGJhY2tlbmR9ID0gYXJncztcbiAgY29uc3Qge2lucHV0fSA9IGlucHV0cztcbiAgY29uc3QgaW5wdXREYXRhID0gYmFja2VuZC50ZXhEYXRhLmdldChpbnB1dC5kYXRhSWQpO1xuXG4gIHJldHVybiBpZGVudGl0eSh7aW5wdXRzOiB7eDogaW5wdXREYXRhLmNvbXBsZXhUZW5zb3JJbmZvcy5pbWFnfSwgYmFja2VuZH0pO1xufVxuXG5leHBvcnQgY29uc3QgaW1hZ0NvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBJbWFnLFxuICBiYWNrZW5kTmFtZTogJ3dlYmdsJyxcbiAga2VybmVsRnVuYzogaW1hZyBhcyB7fSBhcyBLZXJuZWxGdW5jXG59O1xuIl19