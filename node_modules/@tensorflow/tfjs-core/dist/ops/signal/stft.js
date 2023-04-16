/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
import { mul } from '../mul';
import { op } from '../operation';
import { enclosingPowerOfTwo } from '../signal_ops_util';
import { rfft } from '../spectral/rfft';
import { frame } from './frame';
import { hannWindow } from './hann_window';
/**
 * Computes the Short-time Fourier Transform of signals
 * See: https://en.wikipedia.org/wiki/Short-time_Fourier_transform
 *
 * ```js
 * const input = tf.tensor1d([1, 1, 1, 1, 1])
 * tf.signal.stft(input, 3, 1).print();
 * ```
 * @param signal 1-dimensional real value tensor.
 * @param frameLength The window length of samples.
 * @param frameStep The number of samples to step.
 * @param fftLength The size of the FFT to apply.
 * @param windowFn A callable that takes a window length and returns 1-d tensor.
 *
 * @doc {heading: 'Operations', subheading: 'Signal', namespace: 'signal'}
 */
function stft_(signal, frameLength, frameStep, fftLength, windowFn = hannWindow) {
    if (fftLength == null) {
        fftLength = enclosingPowerOfTwo(frameLength);
    }
    const framedSignal = frame(signal, frameLength, frameStep);
    const windowedSignal = mul(framedSignal, windowFn(frameLength));
    return rfft(windowedSignal, fftLength);
}
export const stft = op({ stft_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RmdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3NpZ25hbC9zdGZ0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUdILE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDM0IsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUNoQyxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFFdEMsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUM5QixPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXpDOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILFNBQVMsS0FBSyxDQUNWLE1BQWdCLEVBQUUsV0FBbUIsRUFBRSxTQUFpQixFQUN4RCxTQUFrQixFQUNsQixXQUF5QyxVQUFVO0lBQ3JELElBQUksU0FBUyxJQUFJLElBQUksRUFBRTtRQUNyQixTQUFTLEdBQUcsbUJBQW1CLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDOUM7SUFDRCxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMzRCxNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLE9BQU8sSUFBSSxDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN6QyxDQUFDO0FBQ0QsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxFQUFDLEtBQUssRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7VGVuc29yLCBUZW5zb3IxRH0gZnJvbSAnLi4vLi4vdGVuc29yJztcbmltcG9ydCB7bXVsfSBmcm9tICcuLi9tdWwnO1xuaW1wb3J0IHtvcH0gZnJvbSAnLi4vb3BlcmF0aW9uJztcbmltcG9ydCB7ZW5jbG9zaW5nUG93ZXJPZlR3b30gZnJvbSAnLi4vc2lnbmFsX29wc191dGlsJztcbmltcG9ydCB7cmZmdH0gZnJvbSAnLi4vc3BlY3RyYWwvcmZmdCc7XG5cbmltcG9ydCB7ZnJhbWV9IGZyb20gJy4vZnJhbWUnO1xuaW1wb3J0IHtoYW5uV2luZG93fSBmcm9tICcuL2hhbm5fd2luZG93JztcblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgU2hvcnQtdGltZSBGb3VyaWVyIFRyYW5zZm9ybSBvZiBzaWduYWxzXG4gKiBTZWU6IGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1Nob3J0LXRpbWVfRm91cmllcl90cmFuc2Zvcm1cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgaW5wdXQgPSB0Zi50ZW5zb3IxZChbMSwgMSwgMSwgMSwgMV0pXG4gKiB0Zi5zaWduYWwuc3RmdChpbnB1dCwgMywgMSkucHJpbnQoKTtcbiAqIGBgYFxuICogQHBhcmFtIHNpZ25hbCAxLWRpbWVuc2lvbmFsIHJlYWwgdmFsdWUgdGVuc29yLlxuICogQHBhcmFtIGZyYW1lTGVuZ3RoIFRoZSB3aW5kb3cgbGVuZ3RoIG9mIHNhbXBsZXMuXG4gKiBAcGFyYW0gZnJhbWVTdGVwIFRoZSBudW1iZXIgb2Ygc2FtcGxlcyB0byBzdGVwLlxuICogQHBhcmFtIGZmdExlbmd0aCBUaGUgc2l6ZSBvZiB0aGUgRkZUIHRvIGFwcGx5LlxuICogQHBhcmFtIHdpbmRvd0ZuIEEgY2FsbGFibGUgdGhhdCB0YWtlcyBhIHdpbmRvdyBsZW5ndGggYW5kIHJldHVybnMgMS1kIHRlbnNvci5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnT3BlcmF0aW9ucycsIHN1YmhlYWRpbmc6ICdTaWduYWwnLCBuYW1lc3BhY2U6ICdzaWduYWwnfVxuICovXG5mdW5jdGlvbiBzdGZ0XyhcbiAgICBzaWduYWw6IFRlbnNvcjFELCBmcmFtZUxlbmd0aDogbnVtYmVyLCBmcmFtZVN0ZXA6IG51bWJlcixcbiAgICBmZnRMZW5ndGg/OiBudW1iZXIsXG4gICAgd2luZG93Rm46IChsZW5ndGg6IG51bWJlcikgPT4gVGVuc29yMUQgPSBoYW5uV2luZG93KTogVGVuc29yIHtcbiAgaWYgKGZmdExlbmd0aCA9PSBudWxsKSB7XG4gICAgZmZ0TGVuZ3RoID0gZW5jbG9zaW5nUG93ZXJPZlR3byhmcmFtZUxlbmd0aCk7XG4gIH1cbiAgY29uc3QgZnJhbWVkU2lnbmFsID0gZnJhbWUoc2lnbmFsLCBmcmFtZUxlbmd0aCwgZnJhbWVTdGVwKTtcbiAgY29uc3Qgd2luZG93ZWRTaWduYWwgPSBtdWwoZnJhbWVkU2lnbmFsLCB3aW5kb3dGbihmcmFtZUxlbmd0aCkpO1xuICByZXR1cm4gcmZmdCh3aW5kb3dlZFNpZ25hbCwgZmZ0TGVuZ3RoKTtcbn1cbmV4cG9ydCBjb25zdCBzdGZ0ID0gb3Aoe3N0ZnRffSk7XG4iXX0=