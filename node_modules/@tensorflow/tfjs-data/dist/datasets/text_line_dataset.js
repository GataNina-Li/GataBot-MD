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
 *
 * =============================================================================
 */
import { Dataset } from '../dataset';
/**
 * Represents a potentially large collection of text lines.
 *
 * The results are not batched.
 */
export class TextLineDataset extends Dataset {
    /**
     * Create a `TextLineDataset`.
     *
     * @param input A `DataSource` providing a chunked, UTF8-encoded byte stream.
     */
    constructor(input) {
        super();
        this.input = input;
    }
    async iterator() {
        const inputIterator = await this.input.iterator();
        const utf8Iterator = inputIterator.decodeUTF8();
        const lineIterator = utf8Iterator.split('\n').map(line => {
            // Windows/DOS format text file has extra line breaker at the end of line.
            if (line.endsWith('\r')) {
                line = line.slice(0, -1);
            }
            return line;
        });
        return lineIterator;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dF9saW5lX2RhdGFzZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWRhdGEvc3JjL2RhdGFzZXRzL3RleHRfbGluZV9kYXRhc2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBRUgsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFlBQVksQ0FBQztBQUluQzs7OztHQUlHO0FBQ0gsTUFBTSxPQUFPLGVBQWdCLFNBQVEsT0FBZTtJQUNsRDs7OztPQUlHO0lBQ0gsWUFBK0IsS0FBaUI7UUFDOUMsS0FBSyxFQUFFLENBQUM7UUFEcUIsVUFBSyxHQUFMLEtBQUssQ0FBWTtJQUVoRCxDQUFDO0lBRUQsS0FBSyxDQUFDLFFBQVE7UUFDWixNQUFNLGFBQWEsR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEQsTUFBTSxZQUFZLEdBQUcsYUFBYSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2hELE1BQU0sWUFBWSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3ZELDBFQUEwRTtZQUMxRSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3ZCLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzFCO1lBQ0QsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RGF0YXNldH0gZnJvbSAnLi4vZGF0YXNldCc7XG5pbXBvcnQge0RhdGFTb3VyY2V9IGZyb20gJy4uL2RhdGFzb3VyY2UnO1xuaW1wb3J0IHtMYXp5SXRlcmF0b3J9IGZyb20gJy4uL2l0ZXJhdG9ycy9sYXp5X2l0ZXJhdG9yJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgcG90ZW50aWFsbHkgbGFyZ2UgY29sbGVjdGlvbiBvZiB0ZXh0IGxpbmVzLlxuICpcbiAqIFRoZSByZXN1bHRzIGFyZSBub3QgYmF0Y2hlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFRleHRMaW5lRGF0YXNldCBleHRlbmRzIERhdGFzZXQ8c3RyaW5nPiB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYSBgVGV4dExpbmVEYXRhc2V0YC5cbiAgICpcbiAgICogQHBhcmFtIGlucHV0IEEgYERhdGFTb3VyY2VgIHByb3ZpZGluZyBhIGNodW5rZWQsIFVURjgtZW5jb2RlZCBieXRlIHN0cmVhbS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCByZWFkb25seSBpbnB1dDogRGF0YVNvdXJjZSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBhc3luYyBpdGVyYXRvcigpOiBQcm9taXNlPExhenlJdGVyYXRvcjxzdHJpbmc+PiB7XG4gICAgY29uc3QgaW5wdXRJdGVyYXRvciA9IGF3YWl0IHRoaXMuaW5wdXQuaXRlcmF0b3IoKTtcbiAgICBjb25zdCB1dGY4SXRlcmF0b3IgPSBpbnB1dEl0ZXJhdG9yLmRlY29kZVVURjgoKTtcbiAgICBjb25zdCBsaW5lSXRlcmF0b3IgPSB1dGY4SXRlcmF0b3Iuc3BsaXQoJ1xcbicpLm1hcChsaW5lID0+IHtcbiAgICAgIC8vIFdpbmRvd3MvRE9TIGZvcm1hdCB0ZXh0IGZpbGUgaGFzIGV4dHJhIGxpbmUgYnJlYWtlciBhdCB0aGUgZW5kIG9mIGxpbmUuXG4gICAgICBpZiAobGluZS5lbmRzV2l0aCgnXFxyJykpIHtcbiAgICAgICAgbGluZSA9IGxpbmUuc2xpY2UoMCwgLTEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxpbmU7XG4gICAgfSk7XG4gICAgcmV0dXJuIGxpbmVJdGVyYXRvcjtcbiAgfVxufVxuIl19