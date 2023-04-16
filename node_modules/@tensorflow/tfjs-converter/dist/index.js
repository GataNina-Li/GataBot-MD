/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
import './flags';
export { GraphModel, loadGraphModel, loadGraphModelSync } from './executor/graph_model';
export { deregisterOp, registerOp } from './operations/custom_op/register';
export { version as version_converter } from './version';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWNvbnZlcnRlci9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsT0FBTyxTQUFTLENBQUM7QUFHakIsT0FBTyxFQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN0RixPQUFPLEVBQUMsWUFBWSxFQUFFLFVBQVUsRUFBQyxNQUFNLGlDQUFpQyxDQUFDO0FBRXpFLE9BQU8sRUFBQyxPQUFPLElBQUksaUJBQWlCLEVBQUMsTUFBTSxXQUFXLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQgJy4vZmxhZ3MnO1xuXG5leHBvcnQge0lBdHRyVmFsdWUsIElOYW1lQXR0ckxpc3QsIElOb2RlRGVmLCBJVGVuc29yLCBJVGVuc29yU2hhcGV9IGZyb20gJy4vZGF0YS9jb21waWxlZF9hcGknO1xuZXhwb3J0IHtHcmFwaE1vZGVsLCBsb2FkR3JhcGhNb2RlbCwgbG9hZEdyYXBoTW9kZWxTeW5jfSBmcm9tICcuL2V4ZWN1dG9yL2dyYXBoX21vZGVsJztcbmV4cG9ydCB7ZGVyZWdpc3Rlck9wLCByZWdpc3Rlck9wfSBmcm9tICcuL29wZXJhdGlvbnMvY3VzdG9tX29wL3JlZ2lzdGVyJztcbmV4cG9ydCB7R3JhcGhOb2RlLCBPcEV4ZWN1dG9yfSBmcm9tICcuL29wZXJhdGlvbnMvdHlwZXMnO1xuZXhwb3J0IHt2ZXJzaW9uIGFzIHZlcnNpb25fY29udmVydGVyfSBmcm9tICcuL3ZlcnNpb24nO1xuIl19