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
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { op } from './operation';
import { slice } from './slice';
/**
 * Extracts a 1D slice from 1D array starting at coordinates `begin` and is
 * of length `size`. See `slice` for details.
 */
function slice1d_(x, begin, size) {
    const $x = convertToTensor(x, 'x', 'slice1d');
    util.assert($x.rank === 1, () => `slice1d expects a rank-1 tensor, but got a rank-${$x.rank} tensor`);
    return slice($x, [begin], [size]);
}
export const slice1d = op({ slice1d_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2UxZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3NsaWNlMWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBR0gsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE9BQU8sS0FBSyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBRWhDLE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDL0IsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUU5Qjs7O0dBR0c7QUFDSCxTQUFTLFFBQVEsQ0FDYixDQUFzQixFQUFFLEtBQWEsRUFBRSxJQUFZO0lBQ3JELE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzlDLElBQUksQ0FBQyxNQUFNLENBQ1AsRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQ2IsR0FBRyxFQUFFLENBQ0QsbURBQW1ELEVBQUUsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDO0lBQzdFLE9BQU8sS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBQ0QsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxFQUFDLFFBQVEsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7VGVuc29yMUR9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi91dGlsJztcblxuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuaW1wb3J0IHtzbGljZX0gZnJvbSAnLi9zbGljZSc7XG5cbi8qKlxuICogRXh0cmFjdHMgYSAxRCBzbGljZSBmcm9tIDFEIGFycmF5IHN0YXJ0aW5nIGF0IGNvb3JkaW5hdGVzIGBiZWdpbmAgYW5kIGlzXG4gKiBvZiBsZW5ndGggYHNpemVgLiBTZWUgYHNsaWNlYCBmb3IgZGV0YWlscy5cbiAqL1xuZnVuY3Rpb24gc2xpY2UxZF8oXG4gICAgeDogVGVuc29yMUR8VGVuc29yTGlrZSwgYmVnaW46IG51bWJlciwgc2l6ZTogbnVtYmVyKTogVGVuc29yMUQge1xuICBjb25zdCAkeCA9IGNvbnZlcnRUb1RlbnNvcih4LCAneCcsICdzbGljZTFkJyk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgJHgucmFuayA9PT0gMSxcbiAgICAgICgpID0+XG4gICAgICAgICAgYHNsaWNlMWQgZXhwZWN0cyBhIHJhbmstMSB0ZW5zb3IsIGJ1dCBnb3QgYSByYW5rLSR7JHgucmFua30gdGVuc29yYCk7XG4gIHJldHVybiBzbGljZSgkeCwgW2JlZ2luXSwgW3NpemVdKTtcbn1cbmV4cG9ydCBjb25zdCBzbGljZTFkID0gb3Aoe3NsaWNlMWRffSk7XG4iXX0=