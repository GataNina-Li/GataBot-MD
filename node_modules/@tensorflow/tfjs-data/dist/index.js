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
export { array, Dataset, zip } from './dataset';
export { CSVDataset } from './datasets/csv_dataset';
export { TextLineDataset } from './datasets/text_line_dataset';
export { csv, func, generator, microphone, webcam } from './readers';
export { FileDataSource } from './sources/file_data_source';
export { URLDataSource } from './sources/url_data_source';
export { version as version_data } from './version';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWRhdGEvc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUM5QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQzdELE9BQU8sRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ25FLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUMxRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFFeEQsT0FBTyxFQUFDLE9BQU8sSUFBSSxZQUFZLEVBQUMsTUFBTSxXQUFXLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmV4cG9ydCB7YXJyYXksIERhdGFzZXQsIHppcH0gZnJvbSAnLi9kYXRhc2V0JztcbmV4cG9ydCB7Q1NWRGF0YXNldH0gZnJvbSAnLi9kYXRhc2V0cy9jc3ZfZGF0YXNldCc7XG5leHBvcnQge1RleHRMaW5lRGF0YXNldH0gZnJvbSAnLi9kYXRhc2V0cy90ZXh0X2xpbmVfZGF0YXNldCc7XG5leHBvcnQge2NzdiwgZnVuYywgZ2VuZXJhdG9yLCBtaWNyb3Bob25lLCB3ZWJjYW19IGZyb20gJy4vcmVhZGVycyc7XG5leHBvcnQge0ZpbGVEYXRhU291cmNlfSBmcm9tICcuL3NvdXJjZXMvZmlsZV9kYXRhX3NvdXJjZSc7XG5leHBvcnQge1VSTERhdGFTb3VyY2V9IGZyb20gJy4vc291cmNlcy91cmxfZGF0YV9zb3VyY2UnO1xuZXhwb3J0IHtDb2x1bW5Db25maWcsIE1pY3JvcGhvbmVDb25maWcsIFdlYmNhbUNvbmZpZ30gZnJvbSAnLi90eXBlcyc7XG5leHBvcnQge3ZlcnNpb24gYXMgdmVyc2lvbl9kYXRhfSBmcm9tICcuL3ZlcnNpb24nO1xuIl19