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
import { whereImpl } from '../backends/where_impl';
import { convertToTensor } from '../tensor_util_env';
/**
 * Returns the coordinates of true elements of condition.
 *
 * The coordinates are returned in a 2-D tensor where the first dimension (rows)
 * represents the number of true elements, and the second dimension (columns)
 * represents the coordinates of the true elements. Keep in mind, the shape of
 * the output tensor can vary depending on how many true values there are in
 * input. Indices are output in row-major order. The resulting tensor has the
 * shape `[numTrueElems, condition.rank]`.
 *
 * This is analogous to calling the python `tf.where(cond)` without an x or y.
 *
 * ```js
 * const cond = tf.tensor1d([false, false, true], 'bool');
 * const result = await tf.whereAsync(cond);
 * result.print();
 * ```
 *
 * @doc {heading: 'Operations', subheading: 'Logical'}
 */
async function whereAsync_(condition) {
    const $condition = convertToTensor(condition, 'condition', 'whereAsync', 'bool');
    const vals = await $condition.data();
    const res = whereImpl($condition.shape, vals);
    if (condition !== $condition) {
        $condition.dispose();
    }
    return res;
}
export const whereAsync = whereAsync_;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2hlcmVfYXN5bmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy93aGVyZV9hc3luYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFFakQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBR25EOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUJHO0FBQ0gsS0FBSyxVQUFVLFdBQVcsQ0FBQyxTQUE0QjtJQUNyRCxNQUFNLFVBQVUsR0FDWixlQUFlLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbEUsTUFBTSxJQUFJLEdBQUcsTUFBTSxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDckMsTUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUMsSUFBSSxTQUFTLEtBQUssVUFBVSxFQUFFO1FBQzVCLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUN0QjtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQge3doZXJlSW1wbH0gZnJvbSAnLi4vYmFja2VuZHMvd2hlcmVfaW1wbCc7XG5pbXBvcnQge1RlbnNvciwgVGVuc29yMkR9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGNvb3JkaW5hdGVzIG9mIHRydWUgZWxlbWVudHMgb2YgY29uZGl0aW9uLlxuICpcbiAqIFRoZSBjb29yZGluYXRlcyBhcmUgcmV0dXJuZWQgaW4gYSAyLUQgdGVuc29yIHdoZXJlIHRoZSBmaXJzdCBkaW1lbnNpb24gKHJvd3MpXG4gKiByZXByZXNlbnRzIHRoZSBudW1iZXIgb2YgdHJ1ZSBlbGVtZW50cywgYW5kIHRoZSBzZWNvbmQgZGltZW5zaW9uIChjb2x1bW5zKVxuICogcmVwcmVzZW50cyB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIHRydWUgZWxlbWVudHMuIEtlZXAgaW4gbWluZCwgdGhlIHNoYXBlIG9mXG4gKiB0aGUgb3V0cHV0IHRlbnNvciBjYW4gdmFyeSBkZXBlbmRpbmcgb24gaG93IG1hbnkgdHJ1ZSB2YWx1ZXMgdGhlcmUgYXJlIGluXG4gKiBpbnB1dC4gSW5kaWNlcyBhcmUgb3V0cHV0IGluIHJvdy1tYWpvciBvcmRlci4gVGhlIHJlc3VsdGluZyB0ZW5zb3IgaGFzIHRoZVxuICogc2hhcGUgYFtudW1UcnVlRWxlbXMsIGNvbmRpdGlvbi5yYW5rXWAuXG4gKlxuICogVGhpcyBpcyBhbmFsb2dvdXMgdG8gY2FsbGluZyB0aGUgcHl0aG9uIGB0Zi53aGVyZShjb25kKWAgd2l0aG91dCBhbiB4IG9yIHkuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGNvbmQgPSB0Zi50ZW5zb3IxZChbZmFsc2UsIGZhbHNlLCB0cnVlXSwgJ2Jvb2wnKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRmLndoZXJlQXN5bmMoY29uZCk7XG4gKiByZXN1bHQucHJpbnQoKTtcbiAqIGBgYFxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdPcGVyYXRpb25zJywgc3ViaGVhZGluZzogJ0xvZ2ljYWwnfVxuICovXG5hc3luYyBmdW5jdGlvbiB3aGVyZUFzeW5jXyhjb25kaXRpb246IFRlbnNvcnxUZW5zb3JMaWtlKTogUHJvbWlzZTxUZW5zb3IyRD4ge1xuICBjb25zdCAkY29uZGl0aW9uID1cbiAgICAgIGNvbnZlcnRUb1RlbnNvcihjb25kaXRpb24sICdjb25kaXRpb24nLCAnd2hlcmVBc3luYycsICdib29sJyk7XG4gIGNvbnN0IHZhbHMgPSBhd2FpdCAkY29uZGl0aW9uLmRhdGEoKTtcbiAgY29uc3QgcmVzID0gd2hlcmVJbXBsKCRjb25kaXRpb24uc2hhcGUsIHZhbHMpO1xuICBpZiAoY29uZGl0aW9uICE9PSAkY29uZGl0aW9uKSB7XG4gICAgJGNvbmRpdGlvbi5kaXNwb3NlKCk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGNvbnN0IHdoZXJlQXN5bmMgPSB3aGVyZUFzeW5jXztcbiJdfQ==