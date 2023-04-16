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
export function getVecChannels(name, rank) {
    return ['x', 'y', 'z', 'w', 'u', 'v'].slice(0, rank).map(d => `${name}.${d}`);
}
export function getChannels(name, rank) {
    if (rank === 1) {
        return [name];
    }
    return getVecChannels(name, rank);
}
export function getSourceCoords(rank, dims) {
    if (rank === 1) {
        return 'rc';
    }
    let coords = '';
    for (let i = 0; i < rank; i++) {
        coords += dims[i];
        if (i < rank - 1) {
            coords += ',';
        }
    }
    return coords;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2luZ191dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9wYWNraW5nX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsTUFBTSxVQUFVLGNBQWMsQ0FBQyxJQUFZLEVBQUUsSUFBWTtJQUN2RCxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDaEYsQ0FBQztBQUVELE1BQU0sVUFBVSxXQUFXLENBQUMsSUFBWSxFQUFFLElBQVk7SUFDcEQsSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFO1FBQ2QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2Y7SUFDRCxPQUFPLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDcEMsQ0FBQztBQUVELE1BQU0sVUFBVSxlQUFlLENBQUMsSUFBWSxFQUFFLElBQWM7SUFDMUQsSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFO1FBQ2QsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNoQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzdCLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRTtZQUNoQixNQUFNLElBQUksR0FBRyxDQUFDO1NBQ2Y7S0FDRjtJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRWZWNDaGFubmVscyhuYW1lOiBzdHJpbmcsIHJhbms6IG51bWJlcik6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIFsneCcsICd5JywgJ3onLCAndycsICd1JywgJ3YnXS5zbGljZSgwLCByYW5rKS5tYXAoZCA9PiBgJHtuYW1lfS4ke2R9YCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFubmVscyhuYW1lOiBzdHJpbmcsIHJhbms6IG51bWJlcik6IHN0cmluZ1tdIHtcbiAgaWYgKHJhbmsgPT09IDEpIHtcbiAgICByZXR1cm4gW25hbWVdO1xuICB9XG4gIHJldHVybiBnZXRWZWNDaGFubmVscyhuYW1lLCByYW5rKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNvdXJjZUNvb3JkcyhyYW5rOiBudW1iZXIsIGRpbXM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgaWYgKHJhbmsgPT09IDEpIHtcbiAgICByZXR1cm4gJ3JjJztcbiAgfVxuXG4gIGxldCBjb29yZHMgPSAnJztcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByYW5rOyBpKyspIHtcbiAgICBjb29yZHMgKz0gZGltc1tpXTtcbiAgICBpZiAoaSA8IHJhbmsgLSAxKSB7XG4gICAgICBjb29yZHMgKz0gJywnO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY29vcmRzO1xufSJdfQ==