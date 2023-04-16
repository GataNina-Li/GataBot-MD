/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
import { ValueError } from '../errors';
import { pyListRepeat } from './generic_utils';
import { isInteger, max } from './math_utils';
/**
 * Transforms a single number of array of numbers into an array of numbers.
 * @param value
 * @param n: The size of the tuple to be returned.
 * @param name: Name of the parameter, used for generating error messages.
 * @returns An array of numbers.
 */
export function normalizeArray(value, n, name) {
    if (typeof value === 'number') {
        return pyListRepeat(value, n);
    }
    else {
        if (value.length !== n) {
            throw new ValueError(`The ${name} argument must be an integer or tuple of ${n} integers.` +
                ` Received: ${value.length} elements.`);
        }
        for (let i = 0; i < n; ++i) {
            const singleValue = value[i];
            if (!isInteger(singleValue)) {
                throw new ValueError(`The ${name} argument must be an integer or tuple of ${n}` +
                    ` integers. Received: ${JSON.stringify(value)} including a` +
                    ` non-integer number ${singleValue}`);
            }
        }
        return value;
    }
}
/**
 * Determines output length of a convolution given input length.
 * @param inputLength
 * @param filterSize
 * @param padding
 * @param stride
 * @param dilation: dilation rate.
 */
export function convOutputLength(inputLength, filterSize, padding, stride, dilation = 1) {
    if (inputLength == null) {
        return inputLength;
    }
    const dilatedFilterSize = filterSize + (filterSize - 1) * (dilation - 1);
    let outputLength;
    if (padding === 'same') {
        outputLength = inputLength;
    }
    else { // VALID
        outputLength = inputLength - dilatedFilterSize + 1;
    }
    return Math.floor((outputLength + stride - 1) / stride);
}
export function deconvLength(dimSize, strideSize, kernelSize, padding) {
    if (dimSize == null) {
        return null;
    }
    if (padding === 'valid') {
        dimSize = dimSize * strideSize + max([kernelSize - strideSize, 0]);
    }
    else if (padding === 'same') {
        dimSize = dimSize * strideSize;
    }
    else {
        throw new ValueError(`Unsupport padding mode: ${padding}.`);
    }
    return dimSize;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udl91dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtbGF5ZXJzL3NyYy91dGlscy9jb252X3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztHQVFHO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUdyQyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFNUM7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLGNBQWMsQ0FDMUIsS0FBc0IsRUFBRSxDQUFTLEVBQUUsSUFBWTtJQUNqRCxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtRQUM3QixPQUFPLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDL0I7U0FBTTtRQUNMLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDdEIsTUFBTSxJQUFJLFVBQVUsQ0FDaEIsT0FBTyxJQUFJLDRDQUE0QyxDQUFDLFlBQVk7Z0JBQ3BFLGNBQWMsS0FBSyxDQUFDLE1BQU0sWUFBWSxDQUFDLENBQUM7U0FDN0M7UUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQzFCLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxFQUFFO2dCQUMzQixNQUFNLElBQUksVUFBVSxDQUNoQixPQUFPLElBQUksNENBQTRDLENBQUMsRUFBRTtvQkFDMUQsd0JBQXdCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLGNBQWM7b0JBQzNELHVCQUF1QixXQUFXLEVBQUUsQ0FBQyxDQUFDO2FBQzNDO1NBQ0Y7UUFDRCxPQUFPLEtBQUssQ0FBQztLQUNkO0FBQ0gsQ0FBQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCLENBQzVCLFdBQW1CLEVBQUUsVUFBa0IsRUFBRSxPQUFvQixFQUM3RCxNQUFjLEVBQUUsUUFBUSxHQUFHLENBQUM7SUFDOUIsSUFBSSxXQUFXLElBQUksSUFBSSxFQUFFO1FBQ3ZCLE9BQU8sV0FBVyxDQUFDO0tBQ3BCO0lBQ0QsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLEdBQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDekUsSUFBSSxZQUFvQixDQUFDO0lBQ3pCLElBQUksT0FBTyxLQUFLLE1BQU0sRUFBRTtRQUN0QixZQUFZLEdBQUcsV0FBVyxDQUFDO0tBQzVCO1NBQU0sRUFBRyxRQUFRO1FBQ2hCLFlBQVksR0FBRyxXQUFXLEdBQUcsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO0tBQ3BEO0lBQ0QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsWUFBWSxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBRUQsTUFBTSxVQUFVLFlBQVksQ0FDeEIsT0FBZSxFQUFFLFVBQWtCLEVBQUUsVUFBa0IsRUFDdkQsT0FBb0I7SUFDdEIsSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFO1FBQ25CLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRCxJQUFJLE9BQU8sS0FBSyxPQUFPLEVBQUU7UUFDdkIsT0FBTyxHQUFHLE9BQU8sR0FBRyxVQUFVLEdBQUcsR0FBRyxDQUFDLENBQUMsVUFBVSxHQUFHLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3BFO1NBQU0sSUFBSSxPQUFPLEtBQUssTUFBTSxFQUFFO1FBQzdCLE9BQU8sR0FBRyxPQUFPLEdBQUcsVUFBVSxDQUFDO0tBQ2hDO1NBQU07UUFDTCxNQUFNLElBQUksVUFBVSxDQUFDLDJCQUEyQixPQUFPLEdBQUcsQ0FBQyxDQUFDO0tBQzdEO0lBQ0QsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAqIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICogaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7VmFsdWVFcnJvcn0gZnJvbSAnLi4vZXJyb3JzJztcbmltcG9ydCB7UGFkZGluZ01vZGV9IGZyb20gJy4uL2tlcmFzX2Zvcm1hdC9jb21tb24nO1xuXG5pbXBvcnQge3B5TGlzdFJlcGVhdH0gZnJvbSAnLi9nZW5lcmljX3V0aWxzJztcbmltcG9ydCB7aXNJbnRlZ2VyLCBtYXh9IGZyb20gJy4vbWF0aF91dGlscyc7XG5cbi8qKlxuICogVHJhbnNmb3JtcyBhIHNpbmdsZSBudW1iZXIgb2YgYXJyYXkgb2YgbnVtYmVycyBpbnRvIGFuIGFycmF5IG9mIG51bWJlcnMuXG4gKiBAcGFyYW0gdmFsdWVcbiAqIEBwYXJhbSBuOiBUaGUgc2l6ZSBvZiB0aGUgdHVwbGUgdG8gYmUgcmV0dXJuZWQuXG4gKiBAcGFyYW0gbmFtZTogTmFtZSBvZiB0aGUgcGFyYW1ldGVyLCB1c2VkIGZvciBnZW5lcmF0aW5nIGVycm9yIG1lc3NhZ2VzLlxuICogQHJldHVybnMgQW4gYXJyYXkgb2YgbnVtYmVycy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KFxuICAgIHZhbHVlOiBudW1iZXJ8bnVtYmVyW10sIG46IG51bWJlciwgbmFtZTogc3RyaW5nKTogbnVtYmVyW10ge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBweUxpc3RSZXBlYXQodmFsdWUsIG4pO1xuICB9IGVsc2Uge1xuICAgIGlmICh2YWx1ZS5sZW5ndGggIT09IG4pIHtcbiAgICAgIHRocm93IG5ldyBWYWx1ZUVycm9yKFxuICAgICAgICAgIGBUaGUgJHtuYW1lfSBhcmd1bWVudCBtdXN0IGJlIGFuIGludGVnZXIgb3IgdHVwbGUgb2YgJHtufSBpbnRlZ2Vycy5gICtcbiAgICAgICAgICBgIFJlY2VpdmVkOiAke3ZhbHVlLmxlbmd0aH0gZWxlbWVudHMuYCk7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBjb25zdCBzaW5nbGVWYWx1ZSA9IHZhbHVlW2ldO1xuICAgICAgaWYgKCFpc0ludGVnZXIoc2luZ2xlVmFsdWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBWYWx1ZUVycm9yKFxuICAgICAgICAgICAgYFRoZSAke25hbWV9IGFyZ3VtZW50IG11c3QgYmUgYW4gaW50ZWdlciBvciB0dXBsZSBvZiAke259YCArXG4gICAgICAgICAgICBgIGludGVnZXJzLiBSZWNlaXZlZDogJHtKU09OLnN0cmluZ2lmeSh2YWx1ZSl9IGluY2x1ZGluZyBhYCArXG4gICAgICAgICAgICBgIG5vbi1pbnRlZ2VyIG51bWJlciAke3NpbmdsZVZhbHVlfWApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIG91dHB1dCBsZW5ndGggb2YgYSBjb252b2x1dGlvbiBnaXZlbiBpbnB1dCBsZW5ndGguXG4gKiBAcGFyYW0gaW5wdXRMZW5ndGhcbiAqIEBwYXJhbSBmaWx0ZXJTaXplXG4gKiBAcGFyYW0gcGFkZGluZ1xuICogQHBhcmFtIHN0cmlkZVxuICogQHBhcmFtIGRpbGF0aW9uOiBkaWxhdGlvbiByYXRlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udk91dHB1dExlbmd0aChcbiAgICBpbnB1dExlbmd0aDogbnVtYmVyLCBmaWx0ZXJTaXplOiBudW1iZXIsIHBhZGRpbmc6IFBhZGRpbmdNb2RlLFxuICAgIHN0cmlkZTogbnVtYmVyLCBkaWxhdGlvbiA9IDEpOiBudW1iZXIge1xuICBpZiAoaW5wdXRMZW5ndGggPT0gbnVsbCkge1xuICAgIHJldHVybiBpbnB1dExlbmd0aDtcbiAgfVxuICBjb25zdCBkaWxhdGVkRmlsdGVyU2l6ZSA9IGZpbHRlclNpemUgKyAoZmlsdGVyU2l6ZSAtIDEpICogKGRpbGF0aW9uIC0gMSk7XG4gIGxldCBvdXRwdXRMZW5ndGg6IG51bWJlcjtcbiAgaWYgKHBhZGRpbmcgPT09ICdzYW1lJykge1xuICAgIG91dHB1dExlbmd0aCA9IGlucHV0TGVuZ3RoO1xuICB9IGVsc2UgeyAgLy8gVkFMSURcbiAgICBvdXRwdXRMZW5ndGggPSBpbnB1dExlbmd0aCAtIGRpbGF0ZWRGaWx0ZXJTaXplICsgMTtcbiAgfVxuICByZXR1cm4gTWF0aC5mbG9vcigob3V0cHV0TGVuZ3RoICsgc3RyaWRlIC0gMSkgLyBzdHJpZGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVjb252TGVuZ3RoKFxuICAgIGRpbVNpemU6IG51bWJlciwgc3RyaWRlU2l6ZTogbnVtYmVyLCBrZXJuZWxTaXplOiBudW1iZXIsXG4gICAgcGFkZGluZzogUGFkZGluZ01vZGUpOiBudW1iZXIge1xuICBpZiAoZGltU2l6ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAocGFkZGluZyA9PT0gJ3ZhbGlkJykge1xuICAgIGRpbVNpemUgPSBkaW1TaXplICogc3RyaWRlU2l6ZSArIG1heChba2VybmVsU2l6ZSAtIHN0cmlkZVNpemUsIDBdKTtcbiAgfSBlbHNlIGlmIChwYWRkaW5nID09PSAnc2FtZScpIHtcbiAgICBkaW1TaXplID0gZGltU2l6ZSAqIHN0cmlkZVNpemU7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IFZhbHVlRXJyb3IoYFVuc3VwcG9ydCBwYWRkaW5nIG1vZGU6ICR7cGFkZGluZ30uYCk7XG4gIH1cbiAgcmV0dXJuIGRpbVNpemU7XG59XG4iXX0=