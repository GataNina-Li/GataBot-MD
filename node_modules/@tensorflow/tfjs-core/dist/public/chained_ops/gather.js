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
import { gather } from '../../ops/gather';
import { getGlobalTensorClass } from '../../tensor';
getGlobalTensorClass().prototype.gather = function (indices, axis) {
    this.throwIfDisposed();
    return gather(this, indices, axis);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2F0aGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9wdWJsaWMvY2hhaW5lZF9vcHMvZ2F0aGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUN4QyxPQUFPLEVBQUMsb0JBQW9CLEVBQVMsTUFBTSxjQUFjLENBQUM7QUFVMUQsb0JBQW9CLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFVBQzdCLE9BQTBCLEVBQUUsSUFBYTtJQUNwRCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDdkIsT0FBTyxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNyQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7Z2F0aGVyfSBmcm9tICcuLi8uLi9vcHMvZ2F0aGVyJztcbmltcG9ydCB7Z2V0R2xvYmFsVGVuc29yQ2xhc3MsIFRlbnNvcn0gZnJvbSAnLi4vLi4vdGVuc29yJztcbmltcG9ydCB7UmFuaywgVGVuc29yTGlrZX0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5kZWNsYXJlIG1vZHVsZSAnLi4vLi4vdGVuc29yJyB7XG4gIGludGVyZmFjZSBUZW5zb3I8UiBleHRlbmRzIFJhbmsgPSBSYW5rPiB7XG4gICAgZ2F0aGVyPFQgZXh0ZW5kcyBUZW5zb3I+KFxuICAgICAgICB0aGlzOiBULCBpbmRpY2VzOiBUZW5zb3J8VGVuc29yTGlrZSwgYXhpcz86IG51bWJlcik6IFQ7XG4gIH1cbn1cblxuZ2V0R2xvYmFsVGVuc29yQ2xhc3MoKS5wcm90b3R5cGUuZ2F0aGVyID0gZnVuY3Rpb248VCBleHRlbmRzIFRlbnNvcj4oXG4gICAgdGhpczogVCwgaW5kaWNlczogVGVuc29yfFRlbnNvckxpa2UsIGF4aXM/OiBudW1iZXIpOiBUIHtcbiAgdGhpcy50aHJvd0lmRGlzcG9zZWQoKTtcbiAgcmV0dXJuIGdhdGhlcih0aGlzLCBpbmRpY2VzLCBheGlzKTtcbn07XG4iXX0=