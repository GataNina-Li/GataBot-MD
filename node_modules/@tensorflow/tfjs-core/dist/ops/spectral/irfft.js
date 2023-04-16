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
import { complex } from '../complex';
import { concat } from '../concat';
import { imag } from '../imag';
import { mul } from '../mul';
import { op } from '../operation';
import { real } from '../real';
import { reshape } from '../reshape';
import { reverse } from '../reverse';
import { scalar } from '../scalar';
import { slice } from '../slice';
import { ifft } from './ifft';
/**
 * Inversed real value input fast Fourier transform.
 *
 * Computes the 1-dimensional inversed discrete Fourier transform over the
 * inner-most dimension of the real input.
 *
 * ```js
 * const real = tf.tensor1d([1, 2, 3]);
 * const imag = tf.tensor1d([0, 0, 0]);
 * const x = tf.complex(real, imag);
 *
 * x.irfft().print();
 * ```
 * @param input The real value input to compute an irfft over.
 *
 * @doc {heading: 'Operations', subheading: 'Spectral', namespace: 'spectral'}
 */
function irfft_(input) {
    const innerDimensionSize = input.shape[input.shape.length - 1];
    const batch = input.size / innerDimensionSize;
    let ret;
    if (innerDimensionSize <= 2) {
        const complexInput = reshape(input, [batch, innerDimensionSize]);
        ret = ifft(complexInput);
    }
    else {
        // The length of unique components of the DFT of a real-valued signal
        // is 2 * (input_len - 1)
        const outputShape = [batch, 2 * (innerDimensionSize - 1)];
        const realInput = reshape(real(input), [batch, innerDimensionSize]);
        const imagInput = reshape(imag(input), [batch, innerDimensionSize]);
        const realConjugate = reverse(slice(realInput, [0, 1], [batch, innerDimensionSize - 2]), 1);
        const imagConjugate = mul(reverse(slice(imagInput, [0, 1], [batch, innerDimensionSize - 2]), 1), scalar(-1));
        const r = concat([realInput, realConjugate], 1);
        const i = concat([imagInput, imagConjugate], 1);
        const complexInput = reshape(complex(r, i), [outputShape[0], outputShape[1]]);
        ret = ifft(complexInput);
    }
    ret = real(ret);
    // reshape the result if the input is 3D tensor.
    if (input.rank === 3 && input.shape[0] !== 0) {
        const temp = ret;
        const batch = input.shape[0];
        ret = reshape(ret, [batch, ret.shape[0] / batch, ret.shape[1]]);
        temp.dispose();
    }
    return ret;
}
export const irfft = op({ irfft_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXJmZnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9zcGVjdHJhbC9pcmZmdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFHSCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUM3QixPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzNCLE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDaEMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUM3QixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDbkMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBRS9CLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFFNUI7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxTQUFTLE1BQU0sQ0FBQyxLQUFhO0lBQzNCLE1BQU0sa0JBQWtCLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMvRCxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxHQUFHLGtCQUFrQixDQUFDO0lBQzlDLElBQUksR0FBVyxDQUFDO0lBQ2hCLElBQUksa0JBQWtCLElBQUksQ0FBQyxFQUFFO1FBQzNCLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDMUI7U0FBTTtRQUNMLHFFQUFxRTtRQUNyRSx5QkFBeUI7UUFDekIsTUFBTSxXQUFXLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLGtCQUFrQixDQUFDLENBQUMsQ0FBQztRQUNwRSxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLGtCQUFrQixDQUFDLENBQUMsQ0FBQztRQUVwRSxNQUFNLGFBQWEsR0FDZixPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxrQkFBa0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFFLE1BQU0sYUFBYSxHQUFhLEdBQUcsQ0FDL0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFDckUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVoQixNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sWUFBWSxHQUNkLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUMxQjtJQUNELEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEIsZ0RBQWdEO0lBQ2hELElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDNUMsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ2hCO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7VGVuc29yLCBUZW5zb3IyRH0gZnJvbSAnLi4vLi4vdGVuc29yJztcbmltcG9ydCB7Y29tcGxleH0gZnJvbSAnLi4vY29tcGxleCc7XG5pbXBvcnQge2NvbmNhdH0gZnJvbSAnLi4vY29uY2F0JztcbmltcG9ydCB7aW1hZ30gZnJvbSAnLi4vaW1hZyc7XG5pbXBvcnQge211bH0gZnJvbSAnLi4vbXVsJztcbmltcG9ydCB7b3B9IGZyb20gJy4uL29wZXJhdGlvbic7XG5pbXBvcnQge3JlYWx9IGZyb20gJy4uL3JlYWwnO1xuaW1wb3J0IHtyZXNoYXBlfSBmcm9tICcuLi9yZXNoYXBlJztcbmltcG9ydCB7cmV2ZXJzZX0gZnJvbSAnLi4vcmV2ZXJzZSc7XG5pbXBvcnQge3NjYWxhcn0gZnJvbSAnLi4vc2NhbGFyJztcbmltcG9ydCB7c2xpY2V9IGZyb20gJy4uL3NsaWNlJztcblxuaW1wb3J0IHtpZmZ0fSBmcm9tICcuL2lmZnQnO1xuXG4vKipcbiAqIEludmVyc2VkIHJlYWwgdmFsdWUgaW5wdXQgZmFzdCBGb3VyaWVyIHRyYW5zZm9ybS5cbiAqXG4gKiBDb21wdXRlcyB0aGUgMS1kaW1lbnNpb25hbCBpbnZlcnNlZCBkaXNjcmV0ZSBGb3VyaWVyIHRyYW5zZm9ybSBvdmVyIHRoZVxuICogaW5uZXItbW9zdCBkaW1lbnNpb24gb2YgdGhlIHJlYWwgaW5wdXQuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHJlYWwgPSB0Zi50ZW5zb3IxZChbMSwgMiwgM10pO1xuICogY29uc3QgaW1hZyA9IHRmLnRlbnNvcjFkKFswLCAwLCAwXSk7XG4gKiBjb25zdCB4ID0gdGYuY29tcGxleChyZWFsLCBpbWFnKTtcbiAqXG4gKiB4LmlyZmZ0KCkucHJpbnQoKTtcbiAqIGBgYFxuICogQHBhcmFtIGlucHV0IFRoZSByZWFsIHZhbHVlIGlucHV0IHRvIGNvbXB1dGUgYW4gaXJmZnQgb3Zlci5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdTcGVjdHJhbCcsIG5hbWVzcGFjZTogJ3NwZWN0cmFsJ31cbiAqL1xuZnVuY3Rpb24gaXJmZnRfKGlucHV0OiBUZW5zb3IpOiBUZW5zb3Ige1xuICBjb25zdCBpbm5lckRpbWVuc2lvblNpemUgPSBpbnB1dC5zaGFwZVtpbnB1dC5zaGFwZS5sZW5ndGggLSAxXTtcbiAgY29uc3QgYmF0Y2ggPSBpbnB1dC5zaXplIC8gaW5uZXJEaW1lbnNpb25TaXplO1xuICBsZXQgcmV0OiBUZW5zb3I7XG4gIGlmIChpbm5lckRpbWVuc2lvblNpemUgPD0gMikge1xuICAgIGNvbnN0IGNvbXBsZXhJbnB1dCA9IHJlc2hhcGUoaW5wdXQsIFtiYXRjaCwgaW5uZXJEaW1lbnNpb25TaXplXSk7XG4gICAgcmV0ID0gaWZmdChjb21wbGV4SW5wdXQpO1xuICB9IGVsc2Uge1xuICAgIC8vIFRoZSBsZW5ndGggb2YgdW5pcXVlIGNvbXBvbmVudHMgb2YgdGhlIERGVCBvZiBhIHJlYWwtdmFsdWVkIHNpZ25hbFxuICAgIC8vIGlzIDIgKiAoaW5wdXRfbGVuIC0gMSlcbiAgICBjb25zdCBvdXRwdXRTaGFwZSA9IFtiYXRjaCwgMiAqIChpbm5lckRpbWVuc2lvblNpemUgLSAxKV07XG4gICAgY29uc3QgcmVhbElucHV0ID0gcmVzaGFwZShyZWFsKGlucHV0KSwgW2JhdGNoLCBpbm5lckRpbWVuc2lvblNpemVdKTtcbiAgICBjb25zdCBpbWFnSW5wdXQgPSByZXNoYXBlKGltYWcoaW5wdXQpLCBbYmF0Y2gsIGlubmVyRGltZW5zaW9uU2l6ZV0pO1xuXG4gICAgY29uc3QgcmVhbENvbmp1Z2F0ZSA9XG4gICAgICAgIHJldmVyc2Uoc2xpY2UocmVhbElucHV0LCBbMCwgMV0sIFtiYXRjaCwgaW5uZXJEaW1lbnNpb25TaXplIC0gMl0pLCAxKTtcbiAgICBjb25zdCBpbWFnQ29uanVnYXRlOiBUZW5zb3IyRCA9IG11bChcbiAgICAgICAgcmV2ZXJzZShzbGljZShpbWFnSW5wdXQsIFswLCAxXSwgW2JhdGNoLCBpbm5lckRpbWVuc2lvblNpemUgLSAyXSksIDEpLFxuICAgICAgICBzY2FsYXIoLTEpKTtcblxuICAgIGNvbnN0IHIgPSBjb25jYXQoW3JlYWxJbnB1dCwgcmVhbENvbmp1Z2F0ZV0sIDEpO1xuICAgIGNvbnN0IGkgPSBjb25jYXQoW2ltYWdJbnB1dCwgaW1hZ0Nvbmp1Z2F0ZV0sIDEpO1xuICAgIGNvbnN0IGNvbXBsZXhJbnB1dCA9XG4gICAgICAgIHJlc2hhcGUoY29tcGxleChyLCBpKSwgW291dHB1dFNoYXBlWzBdLCBvdXRwdXRTaGFwZVsxXV0pO1xuICAgIHJldCA9IGlmZnQoY29tcGxleElucHV0KTtcbiAgfVxuICByZXQgPSByZWFsKHJldCk7XG4gIC8vIHJlc2hhcGUgdGhlIHJlc3VsdCBpZiB0aGUgaW5wdXQgaXMgM0QgdGVuc29yLlxuICBpZiAoaW5wdXQucmFuayA9PT0gMyAmJiBpbnB1dC5zaGFwZVswXSAhPT0gMCkge1xuICAgIGNvbnN0IHRlbXAgPSByZXQ7XG4gICAgY29uc3QgYmF0Y2ggPSBpbnB1dC5zaGFwZVswXTtcbiAgICByZXQgPSByZXNoYXBlKHJldCwgW2JhdGNoLCByZXQuc2hhcGVbMF0gLyBiYXRjaCwgcmV0LnNoYXBlWzFdXSk7XG4gICAgdGVtcC5kaXNwb3NlKCk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IGNvbnN0IGlyZmZ0ID0gb3Aoe2lyZmZ0X30pO1xuIl19