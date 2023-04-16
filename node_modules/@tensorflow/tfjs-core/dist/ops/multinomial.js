/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
import { ENGINE } from '../engine';
import { Multinomial } from '../kernel_names';
import { convertToTensor } from '../tensor_util_env';
import { op } from './operation';
import { reshape } from './reshape';
/**
 * Creates a `tf.Tensor` with values drawn from a multinomial distribution.
 *
 * ```js
 * const probs = tf.tensor([.75, .25]);
 * tf.multinomial(probs, 3).print();
 * ```
 *
 * @param logits 1D array with unnormalized log-probabilities, or
 *     2D array of shape `[batchSize, numOutcomes]`. See the `normalized`
 *     parameter.
 * @param numSamples Number of samples to draw for each row slice.
 * @param seed The seed number.
 * @param normalized Whether the provided `logits` are normalized true
 *     probabilities (sum to 1). Defaults to false.
 * @return 1D array of shape `[numSamples]`, or 2D array of shape
 *     `[batchSize, numSamples]`, depending on the rank of the input.
 *
 * @doc {heading: 'Tensors', subheading: 'Random'}
 */
function multinomial_(logits, numSamples, seed, normalized = false) {
    const $logits = convertToTensor(logits, 'logits', 'multinomial');
    const numOutcomes = $logits.size;
    const origRank = $logits.rank;
    if (numOutcomes < 2) {
        throw new Error(`Error in multinomial: you need at least 2 outcomes, but got ` +
            `${numOutcomes}.`);
    }
    if (origRank > 2) {
        throw new Error(`Rank of probabilities must be 1 or 2, but is ${origRank}`);
    }
    // TODO(lina128): Investigate correct seed behavior. The code seems not allow
    // setting see to 0.
    seed = seed || Math.random();
    // The kernel only accepts (and returns) rank 2 tensors.
    const logits2D = origRank === 1 ? reshape($logits, [1, -1]) : $logits;
    const inputs = { logits: logits2D };
    const attrs = { numSamples, seed, normalized };
    // tslint:disable-next-line: no-unnecessary-type-assertion
    const res = ENGINE.runKernel(Multinomial, inputs, attrs);
    // tslint:disable-next-line:no-unnecessary-type-assertion
    return origRank === 1 ? reshape(res, [res.size]) : res;
}
export const multinomial = op({ multinomial_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlub21pYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9tdWx0aW5vbWlhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxXQUFXLEVBQXNDLE1BQU0saUJBQWlCLENBQUM7QUFJakYsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBR25ELE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDL0IsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUVsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1CRztBQUNILFNBQVMsWUFBWSxDQUNqQixNQUFvQyxFQUFFLFVBQWtCLEVBQUUsSUFBYSxFQUN2RSxVQUFVLEdBQUcsS0FBSztJQUNwQixNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNqRSxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ2pDLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDOUIsSUFBSSxXQUFXLEdBQUcsQ0FBQyxFQUFFO1FBQ25CLE1BQU0sSUFBSSxLQUFLLENBQ1gsOERBQThEO1lBQzlELEdBQUcsV0FBVyxHQUFHLENBQUMsQ0FBQztLQUN4QjtJQUNELElBQUksUUFBUSxHQUFHLENBQUMsRUFBRTtRQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLGdEQUFnRCxRQUFRLEVBQUUsQ0FBQyxDQUFDO0tBQzdFO0lBQ0QsNkVBQTZFO0lBQzdFLG9CQUFvQjtJQUNwQixJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUU3Qix3REFBd0Q7SUFDeEQsTUFBTSxRQUFRLEdBQ1YsUUFBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQW1CLENBQUM7SUFFckUsTUFBTSxNQUFNLEdBQXNCLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBQyxDQUFDO0lBQ3JELE1BQU0sS0FBSyxHQUFxQixFQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFDLENBQUM7SUFFL0QsMERBQTBEO0lBQzFELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQ1osV0FBVyxFQUFFLE1BQThCLEVBQzNDLEtBQTJCLENBQWEsQ0FBQztJQUV6RCx5REFBeUQ7SUFDekQsT0FBTyxRQUFRLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztBQUNyRSxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyxFQUFDLFlBQVksRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtNdWx0aW5vbWlhbCwgTXVsdGlub21pYWxBdHRycywgTXVsdGlub21pYWxJbnB1dHN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge05hbWVkQXR0ck1hcH0gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7VGVuc29yMUQsIFRlbnNvcjJEfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcbmltcG9ydCB7cmVzaGFwZX0gZnJvbSAnLi9yZXNoYXBlJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgYHRmLlRlbnNvcmAgd2l0aCB2YWx1ZXMgZHJhd24gZnJvbSBhIG11bHRpbm9taWFsIGRpc3RyaWJ1dGlvbi5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgcHJvYnMgPSB0Zi50ZW5zb3IoWy43NSwgLjI1XSk7XG4gKiB0Zi5tdWx0aW5vbWlhbChwcm9icywgMykucHJpbnQoKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBsb2dpdHMgMUQgYXJyYXkgd2l0aCB1bm5vcm1hbGl6ZWQgbG9nLXByb2JhYmlsaXRpZXMsIG9yXG4gKiAgICAgMkQgYXJyYXkgb2Ygc2hhcGUgYFtiYXRjaFNpemUsIG51bU91dGNvbWVzXWAuIFNlZSB0aGUgYG5vcm1hbGl6ZWRgXG4gKiAgICAgcGFyYW1ldGVyLlxuICogQHBhcmFtIG51bVNhbXBsZXMgTnVtYmVyIG9mIHNhbXBsZXMgdG8gZHJhdyBmb3IgZWFjaCByb3cgc2xpY2UuXG4gKiBAcGFyYW0gc2VlZCBUaGUgc2VlZCBudW1iZXIuXG4gKiBAcGFyYW0gbm9ybWFsaXplZCBXaGV0aGVyIHRoZSBwcm92aWRlZCBgbG9naXRzYCBhcmUgbm9ybWFsaXplZCB0cnVlXG4gKiAgICAgcHJvYmFiaWxpdGllcyAoc3VtIHRvIDEpLiBEZWZhdWx0cyB0byBmYWxzZS5cbiAqIEByZXR1cm4gMUQgYXJyYXkgb2Ygc2hhcGUgYFtudW1TYW1wbGVzXWAsIG9yIDJEIGFycmF5IG9mIHNoYXBlXG4gKiAgICAgYFtiYXRjaFNpemUsIG51bVNhbXBsZXNdYCwgZGVwZW5kaW5nIG9uIHRoZSByYW5rIG9mIHRoZSBpbnB1dC5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnVGVuc29ycycsIHN1YmhlYWRpbmc6ICdSYW5kb20nfVxuICovXG5mdW5jdGlvbiBtdWx0aW5vbWlhbF8oXG4gICAgbG9naXRzOiBUZW5zb3IxRHxUZW5zb3IyRHxUZW5zb3JMaWtlLCBudW1TYW1wbGVzOiBudW1iZXIsIHNlZWQ/OiBudW1iZXIsXG4gICAgbm9ybWFsaXplZCA9IGZhbHNlKTogVGVuc29yMUR8VGVuc29yMkQge1xuICBjb25zdCAkbG9naXRzID0gY29udmVydFRvVGVuc29yKGxvZ2l0cywgJ2xvZ2l0cycsICdtdWx0aW5vbWlhbCcpO1xuICBjb25zdCBudW1PdXRjb21lcyA9ICRsb2dpdHMuc2l6ZTtcbiAgY29uc3Qgb3JpZ1JhbmsgPSAkbG9naXRzLnJhbms7XG4gIGlmIChudW1PdXRjb21lcyA8IDIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBFcnJvciBpbiBtdWx0aW5vbWlhbDogeW91IG5lZWQgYXQgbGVhc3QgMiBvdXRjb21lcywgYnV0IGdvdCBgICtcbiAgICAgICAgYCR7bnVtT3V0Y29tZXN9LmApO1xuICB9XG4gIGlmIChvcmlnUmFuayA+IDIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFJhbmsgb2YgcHJvYmFiaWxpdGllcyBtdXN0IGJlIDEgb3IgMiwgYnV0IGlzICR7b3JpZ1Jhbmt9YCk7XG4gIH1cbiAgLy8gVE9ETyhsaW5hMTI4KTogSW52ZXN0aWdhdGUgY29ycmVjdCBzZWVkIGJlaGF2aW9yLiBUaGUgY29kZSBzZWVtcyBub3QgYWxsb3dcbiAgLy8gc2V0dGluZyBzZWUgdG8gMC5cbiAgc2VlZCA9IHNlZWQgfHwgTWF0aC5yYW5kb20oKTtcblxuICAvLyBUaGUga2VybmVsIG9ubHkgYWNjZXB0cyAoYW5kIHJldHVybnMpIHJhbmsgMiB0ZW5zb3JzLlxuICBjb25zdCBsb2dpdHMyRDogVGVuc29yMkQgPVxuICAgICAgb3JpZ1JhbmsgPT09IDEgPyByZXNoYXBlKCRsb2dpdHMsIFsxLCAtMV0pIDogJGxvZ2l0cyBhcyBUZW5zb3IyRDtcblxuICBjb25zdCBpbnB1dHM6IE11bHRpbm9taWFsSW5wdXRzID0ge2xvZ2l0czogbG9naXRzMkR9O1xuICBjb25zdCBhdHRyczogTXVsdGlub21pYWxBdHRycyA9IHtudW1TYW1wbGVzLCBzZWVkLCBub3JtYWxpemVkfTtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVubmVjZXNzYXJ5LXR5cGUtYXNzZXJ0aW9uXG4gIGNvbnN0IHJlcyA9IEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICAgICAgICAgICAgICBNdWx0aW5vbWlhbCwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLFxuICAgICAgICAgICAgICAgICAgYXR0cnMgYXMge30gYXMgTmFtZWRBdHRyTWFwKSBhcyBUZW5zb3IyRDtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdW5uZWNlc3NhcnktdHlwZS1hc3NlcnRpb25cbiAgcmV0dXJuIG9yaWdSYW5rID09PSAxID8gcmVzaGFwZShyZXMsIFtyZXMuc2l6ZV0pIGFzIFRlbnNvcjFEIDogcmVzO1xufVxuXG5leHBvcnQgY29uc3QgbXVsdGlub21pYWwgPSBvcCh7bXVsdGlub21pYWxffSk7XG4iXX0=