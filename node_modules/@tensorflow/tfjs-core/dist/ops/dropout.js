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
import { Tensor } from '../tensor';
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { add } from './add';
import { div } from './div';
import { getNoiseShape } from './dropout_util';
import { floor } from './floor';
import { mul } from './mul';
import { op } from './operation';
import { randomUniform } from './random_uniform';
/**
 * Computes dropout.
 *
 * ```js
 * const x = tf.tensor1d([1, 2, 2, 1]);
 * const rate = 0.75;
 * const output = tf.dropout(x, rate);
 * output.print();
 * ```
 *
 * @param x A floating point Tensor or TensorLike.
 * @param rate A float in the range [0, 1). The probability that each element
 *   of x is discarded.
 * @param noiseShape An array of numbers of type int32, representing the
 * shape for randomly generated keep/drop flags. If the noiseShape has null
 * value, it will be automatically replaced with the x's relative dimension
 * size. Optional.
 * @param seed Used to create random seeds. Optional.
 * @returns A Tensor of the same shape of x.
 *
 * @doc {heading: 'Operations', subheading: 'Dropout'}
 */
function dropout_(x, rate, noiseShape, seed) {
    const $x = convertToTensor(x, 'x', 'dropout');
    util.assert($x.dtype === 'float32', () => `x has to be a floating point tensor since it's going to be ` +
        `scaled, but got a ${$x.dtype} tensor instead.`);
    util.assert(rate >= 0 && rate < 1, () => `rate must be a float in the range [0, 1), but got ${rate}.`);
    if (rate === 0) {
        return x instanceof Tensor ? $x.clone() : $x;
    }
    const $noiseShape = getNoiseShape($x, noiseShape);
    const keepProb = 1 - rate;
    const multiplier = div(floor(add(randomUniform($noiseShape, 0, 1, 'float32', seed), keepProb)), keepProb);
    return mul($x, multiplier);
}
export const dropout = op({ dropout_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcG91dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2Ryb3BvdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFbkQsT0FBTyxLQUFLLElBQUksTUFBTSxTQUFTLENBQUM7QUFFaEMsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQzlCLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMvQixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFFL0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCRztBQUNILFNBQVMsUUFBUSxDQUNiLENBQW9CLEVBQUUsSUFBWSxFQUFFLFVBQXFCLEVBQ3pELElBQW9CO0lBQ3RCLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRTlDLElBQUksQ0FBQyxNQUFNLENBQ1AsRUFBRSxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQ3RCLEdBQUcsRUFBRSxDQUFDLDZEQUE2RDtRQUMvRCxxQkFBcUIsRUFBRSxDQUFDLEtBQUssa0JBQWtCLENBQUMsQ0FBQztJQUN6RCxJQUFJLENBQUMsTUFBTSxDQUNQLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsRUFDckIsR0FBRyxFQUFFLENBQUMscURBQXFELElBQUksR0FBRyxDQUFDLENBQUM7SUFFeEUsSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFO1FBQ2QsT0FBTyxDQUFDLFlBQVksTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztLQUM5QztJQUVELE1BQU0sV0FBVyxHQUFHLGFBQWEsQ0FBQyxFQUFFLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDbEQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUMxQixNQUFNLFVBQVUsR0FBRyxHQUFHLENBQ2xCLEtBQUssQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUN2RSxRQUFRLENBQUMsQ0FBQztJQUVkLE9BQU8sR0FBRyxDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM3QixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxFQUFDLFFBQVEsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7YWRkfSBmcm9tICcuL2FkZCc7XG5pbXBvcnQge2Rpdn0gZnJvbSAnLi9kaXYnO1xuaW1wb3J0IHtnZXROb2lzZVNoYXBlfSBmcm9tICcuL2Ryb3BvdXRfdXRpbCc7XG5pbXBvcnQge2Zsb29yfSBmcm9tICcuL2Zsb29yJztcbmltcG9ydCB7bXVsfSBmcm9tICcuL211bCc7XG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5pbXBvcnQge3JhbmRvbVVuaWZvcm19IGZyb20gJy4vcmFuZG9tX3VuaWZvcm0nO1xuXG4vKipcbiAqIENvbXB1dGVzIGRyb3BvdXQuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHggPSB0Zi50ZW5zb3IxZChbMSwgMiwgMiwgMV0pO1xuICogY29uc3QgcmF0ZSA9IDAuNzU7XG4gKiBjb25zdCBvdXRwdXQgPSB0Zi5kcm9wb3V0KHgsIHJhdGUpO1xuICogb3V0cHV0LnByaW50KCk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0geCBBIGZsb2F0aW5nIHBvaW50IFRlbnNvciBvciBUZW5zb3JMaWtlLlxuICogQHBhcmFtIHJhdGUgQSBmbG9hdCBpbiB0aGUgcmFuZ2UgWzAsIDEpLiBUaGUgcHJvYmFiaWxpdHkgdGhhdCBlYWNoIGVsZW1lbnRcbiAqICAgb2YgeCBpcyBkaXNjYXJkZWQuXG4gKiBAcGFyYW0gbm9pc2VTaGFwZSBBbiBhcnJheSBvZiBudW1iZXJzIG9mIHR5cGUgaW50MzIsIHJlcHJlc2VudGluZyB0aGVcbiAqIHNoYXBlIGZvciByYW5kb21seSBnZW5lcmF0ZWQga2VlcC9kcm9wIGZsYWdzLiBJZiB0aGUgbm9pc2VTaGFwZSBoYXMgbnVsbFxuICogdmFsdWUsIGl0IHdpbGwgYmUgYXV0b21hdGljYWxseSByZXBsYWNlZCB3aXRoIHRoZSB4J3MgcmVsYXRpdmUgZGltZW5zaW9uXG4gKiBzaXplLiBPcHRpb25hbC5cbiAqIEBwYXJhbSBzZWVkIFVzZWQgdG8gY3JlYXRlIHJhbmRvbSBzZWVkcy4gT3B0aW9uYWwuXG4gKiBAcmV0dXJucyBBIFRlbnNvciBvZiB0aGUgc2FtZSBzaGFwZSBvZiB4LlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdPcGVyYXRpb25zJywgc3ViaGVhZGluZzogJ0Ryb3BvdXQnfVxuICovXG5mdW5jdGlvbiBkcm9wb3V0XyhcbiAgICB4OiBUZW5zb3J8VGVuc29yTGlrZSwgcmF0ZTogbnVtYmVyLCBub2lzZVNoYXBlPzogbnVtYmVyW10sXG4gICAgc2VlZD86IG51bWJlcnxzdHJpbmcpOiBUZW5zb3Ige1xuICBjb25zdCAkeCA9IGNvbnZlcnRUb1RlbnNvcih4LCAneCcsICdkcm9wb3V0Jyk7XG5cbiAgdXRpbC5hc3NlcnQoXG4gICAgICAkeC5kdHlwZSA9PT0gJ2Zsb2F0MzInLFxuICAgICAgKCkgPT4gYHggaGFzIHRvIGJlIGEgZmxvYXRpbmcgcG9pbnQgdGVuc29yIHNpbmNlIGl0J3MgZ29pbmcgdG8gYmUgYCArXG4gICAgICAgICAgYHNjYWxlZCwgYnV0IGdvdCBhICR7JHguZHR5cGV9IHRlbnNvciBpbnN0ZWFkLmApO1xuICB1dGlsLmFzc2VydChcbiAgICAgIHJhdGUgPj0gMCAmJiByYXRlIDwgMSxcbiAgICAgICgpID0+IGByYXRlIG11c3QgYmUgYSBmbG9hdCBpbiB0aGUgcmFuZ2UgWzAsIDEpLCBidXQgZ290ICR7cmF0ZX0uYCk7XG5cbiAgaWYgKHJhdGUgPT09IDApIHtcbiAgICByZXR1cm4geCBpbnN0YW5jZW9mIFRlbnNvciA/ICR4LmNsb25lKCkgOiAkeDtcbiAgfVxuXG4gIGNvbnN0ICRub2lzZVNoYXBlID0gZ2V0Tm9pc2VTaGFwZSgkeCwgbm9pc2VTaGFwZSk7XG4gIGNvbnN0IGtlZXBQcm9iID0gMSAtIHJhdGU7XG4gIGNvbnN0IG11bHRpcGxpZXIgPSBkaXYoXG4gICAgICBmbG9vcihhZGQocmFuZG9tVW5pZm9ybSgkbm9pc2VTaGFwZSwgMCwgMSwgJ2Zsb2F0MzInLCBzZWVkKSwga2VlcFByb2IpKSxcbiAgICAgIGtlZXBQcm9iKTtcblxuICByZXR1cm4gbXVsKCR4LCBtdWx0aXBsaWVyKTtcbn1cblxuZXhwb3J0IGNvbnN0IGRyb3BvdXQgPSBvcCh7ZHJvcG91dF99KTtcbiJdfQ==