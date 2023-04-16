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
import { UnaryOpProgram } from '../unaryop_gpu';
const TO_INT = `return float(int(x));`;
export function int(input, backend) {
    const program = new UnaryOpProgram(input.shape, TO_INT);
    const output = backend.runWebGLProgram(program, [input], 'int32');
    return { dataId: output.dataId, shape: output.shape, dtype: output.dtype };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9rZXJuZWxfdXRpbHMvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUtILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUU5QyxNQUFNLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQztBQUV2QyxNQUFNLFVBQVUsR0FBRyxDQUFDLEtBQWlCLEVBQUUsT0FBeUI7SUFDOUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxjQUFjLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN4RCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2xFLE9BQU8sRUFBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBQyxDQUFDO0FBQzNFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7VGVuc29ySW5mb30gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtNYXRoQmFja2VuZFdlYkdMfSBmcm9tICcuLi9iYWNrZW5kX3dlYmdsJztcbmltcG9ydCB7VW5hcnlPcFByb2dyYW19IGZyb20gJy4uL3VuYXJ5b3BfZ3B1JztcblxuY29uc3QgVE9fSU5UID0gYHJldHVybiBmbG9hdChpbnQoeCkpO2A7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnQoaW5wdXQ6IFRlbnNvckluZm8sIGJhY2tlbmQ6IE1hdGhCYWNrZW5kV2ViR0wpOiBUZW5zb3JJbmZvIHtcbiAgY29uc3QgcHJvZ3JhbSA9IG5ldyBVbmFyeU9wUHJvZ3JhbShpbnB1dC5zaGFwZSwgVE9fSU5UKTtcbiAgY29uc3Qgb3V0cHV0ID0gYmFja2VuZC5ydW5XZWJHTFByb2dyYW0ocHJvZ3JhbSwgW2lucHV0XSwgJ2ludDMyJyk7XG4gIHJldHVybiB7ZGF0YUlkOiBvdXRwdXQuZGF0YUlkLCBzaGFwZTogb3V0cHV0LnNoYXBlLCBkdHlwZTogb3V0cHV0LmR0eXBlfTtcbn1cbiJdfQ==