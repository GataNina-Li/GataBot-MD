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
import { convertToTensor } from '../../tensor_util_env';
import * as util from '../../util';
import { op } from '../operation';
import { tile } from '../tile';
/**
 * Converts images from grayscale to RGB format.
 *
 * @param image A grayscale tensor to convert. The `image`'s last dimension must
 *     be size 1 with at least a two-dimensional shape.
 *
 * @doc {heading: 'Operations', subheading: 'Images', namespace: 'image'}
 */
function grayscaleToRGB_(image) {
    const $image = convertToTensor(image, 'image', 'grayscaleToRGB');
    const lastDimsIdx = $image.rank - 1;
    const lastDims = $image.shape[lastDimsIdx];
    util.assert($image.rank >= 2, () => 'Error in grayscaleToRGB: images must be at least rank 2, ' +
        `but got rank ${$image.rank}.`);
    util.assert(lastDims === 1, () => 'Error in grayscaleToRGB: last dimension of a grayscale image ' +
        `should be size 1, but got size ${lastDims}.`);
    const reps = new Array($image.rank);
    reps.fill(1, 0, lastDimsIdx);
    reps[lastDimsIdx] = 3;
    return tile($image, reps);
}
export const grayscaleToRGB = op({ grayscaleToRGB_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JheXNjYWxlX3RvX3JnYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2ltYWdlL2dyYXlzY2FsZV90b19yZ2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBR0gsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRXRELE9BQU8sS0FBSyxJQUFJLE1BQU0sWUFBWSxDQUFDO0FBRW5DLE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDaEMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUU3Qjs7Ozs7OztHQU9HO0FBQ0gsU0FBUyxlQUFlLENBQ1csS0FBbUI7SUFDcEQsTUFBTSxNQUFNLEdBQUcsZUFBZSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUVqRSxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNwQyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRTNDLElBQUksQ0FBQyxNQUFNLENBQ1AsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLEVBQ2hCLEdBQUcsRUFBRSxDQUFDLDJEQUEyRDtRQUM3RCxnQkFBZ0IsTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7SUFFeEMsSUFBSSxDQUFDLE1BQU0sQ0FDUCxRQUFRLEtBQUssQ0FBQyxFQUNkLEdBQUcsRUFBRSxDQUFDLCtEQUErRDtRQUNqRSxrQ0FBa0MsUUFBUSxHQUFHLENBQUMsQ0FBQztJQUV2RCxNQUFNLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFcEMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzdCLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFdEIsT0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzVCLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDLEVBQUMsZUFBZSxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIxIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtUZW5zb3IyRCwgVGVuc29yM0QsIFRlbnNvcjRELCBUZW5zb3I1RCwgVGVuc29yNkR9IGZyb20gJy4uLy4uL3RlbnNvcic7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi8uLi91dGlsJztcblxuaW1wb3J0IHtvcH0gZnJvbSAnLi4vb3BlcmF0aW9uJztcbmltcG9ydCB7dGlsZX0gZnJvbSAnLi4vdGlsZSc7XG5cbi8qKlxuICogQ29udmVydHMgaW1hZ2VzIGZyb20gZ3JheXNjYWxlIHRvIFJHQiBmb3JtYXQuXG4gKlxuICogQHBhcmFtIGltYWdlIEEgZ3JheXNjYWxlIHRlbnNvciB0byBjb252ZXJ0LiBUaGUgYGltYWdlYCdzIGxhc3QgZGltZW5zaW9uIG11c3RcbiAqICAgICBiZSBzaXplIDEgd2l0aCBhdCBsZWFzdCBhIHR3by1kaW1lbnNpb25hbCBzaGFwZS5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdJbWFnZXMnLCBuYW1lc3BhY2U6ICdpbWFnZSd9XG4gKi9cbmZ1bmN0aW9uIGdyYXlzY2FsZVRvUkdCXzxUIGV4dGVuZHMgVGVuc29yMkR8VGVuc29yM0R8VGVuc29yNER8VGVuc29yNUR8XG4gICAgICAgICAgICAgICAgICAgICAgICAgVGVuc29yNkQ+KGltYWdlOiBUfFRlbnNvckxpa2UpOiBUIHtcbiAgY29uc3QgJGltYWdlID0gY29udmVydFRvVGVuc29yKGltYWdlLCAnaW1hZ2UnLCAnZ3JheXNjYWxlVG9SR0InKTtcblxuICBjb25zdCBsYXN0RGltc0lkeCA9ICRpbWFnZS5yYW5rIC0gMTtcbiAgY29uc3QgbGFzdERpbXMgPSAkaW1hZ2Uuc2hhcGVbbGFzdERpbXNJZHhdO1xuXG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgJGltYWdlLnJhbmsgPj0gMixcbiAgICAgICgpID0+ICdFcnJvciBpbiBncmF5c2NhbGVUb1JHQjogaW1hZ2VzIG11c3QgYmUgYXQgbGVhc3QgcmFuayAyLCAnICtcbiAgICAgICAgICBgYnV0IGdvdCByYW5rICR7JGltYWdlLnJhbmt9LmApO1xuXG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgbGFzdERpbXMgPT09IDEsXG4gICAgICAoKSA9PiAnRXJyb3IgaW4gZ3JheXNjYWxlVG9SR0I6IGxhc3QgZGltZW5zaW9uIG9mIGEgZ3JheXNjYWxlIGltYWdlICcgK1xuICAgICAgICAgIGBzaG91bGQgYmUgc2l6ZSAxLCBidXQgZ290IHNpemUgJHtsYXN0RGltc30uYCk7XG5cbiAgY29uc3QgcmVwcyA9IG5ldyBBcnJheSgkaW1hZ2UucmFuayk7XG5cbiAgcmVwcy5maWxsKDEsIDAsIGxhc3REaW1zSWR4KTtcbiAgcmVwc1tsYXN0RGltc0lkeF0gPSAzO1xuXG4gIHJldHVybiB0aWxlKCRpbWFnZSwgcmVwcyk7XG59XG5cbmV4cG9ydCBjb25zdCBncmF5c2NhbGVUb1JHQiA9IG9wKHtncmF5c2NhbGVUb1JHQl99KTtcbiJdfQ==