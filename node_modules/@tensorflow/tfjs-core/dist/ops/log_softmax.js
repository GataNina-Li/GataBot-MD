/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
import { customGrad } from '../gradients';
import { convertToTensor } from '../tensor_util_env';
import { cast } from './cast';
import { exp } from './exp';
import { log } from './log';
import { max } from './max';
import { mul } from './mul';
import { op } from './operation';
import { sub } from './sub';
import { sum } from './sum';
/**
 * Computes the log softmax.
 *
 * ```js
 * const a = tf.tensor1d([1, 2, 3]);
 *
 * a.logSoftmax().print();  // or tf.logSoftmax(a)
 * ```
 *
 * ```js
 * const a = tf.tensor2d([2, 4, 6, 1, 2, 3], [2, 3]);
 *
 * a.logSoftmax().print();  // or tf.logSoftmax(a)
 * ```
 *
 * @param logits The logits array.
 * @param axis The dimension softmax would be performed on. Defaults to `-1`
 *     which indicates the last dimension.
 *
 * @doc {heading: 'Operations', subheading: 'Normalization'}
 */
function logSoftmax_(logits, axis = -1) {
    const $logits = convertToTensor(logits, 'logits', 'logSoftmax');
    if (axis === -1) {
        axis = $logits.rank - 1;
    }
    if (axis !== $logits.rank - 1) {
        throw Error('Log Softmax along a non-last dimension is not yet supported. ' +
            `Logits was rank ${$logits.rank} and axis was ${axis}`);
    }
    // const forward: ForwardFunc<Tensor> = (backend, save) => {
    //   const keepDims = true;
    //   const xMax = max(logits, axis, true);
    //   const shifted = sub(logits, xMax);
    //   const value =
    //       sub(cast(shifted, 'float32'), log(sum(exp(shifted), axis,
    //       keepDims)));
    //   save([value]);
    //   return value;
    // };
    // Use a custom gradient for numerical stability.
    const customOp = customGrad((logits, save) => {
        const keepDims = true;
        const xMax = max(logits, axis, true);
        const shifted = sub(logits, xMax);
        const value = sub(cast(shifted, 'float32'), log(sum(exp(shifted), axis, keepDims)));
        save([value]);
        const gradFunc = (dy, saved) => {
            const [value] = saved;
            const keepDims = true;
            const softmax = exp(value);
            return sub(dy, mul(sum(dy, axis, keepDims), softmax));
        };
        return { value, gradFunc };
    });
    return customOp($logits);
    // TODO Use Engine.runKernel when CPU/WebGL/WASM backends implement this.
    // const inputs: LogSoftmaxInputs = {logits: $logits};
    // const attrs: LogSoftmaxAttrs = {axis};
    // return ENGINE.runKernel(
    //            LogSoftmax, inputs as {} as NamedTensorMap,
    //            attrs as {} as NamedAttrMap);
}
export const logSoftmax = op({ logSoftmax_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nX3NvZnRtYXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9sb2dfc29mdG1heC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBSXhDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUduRCxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMvQixPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxPQUFPLENBQUM7QUFFMUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0JHO0FBQ0gsU0FBUyxXQUFXLENBQW1CLE1BQW9CLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNwRSxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUVoRSxJQUFJLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRTtRQUNmLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztLQUN6QjtJQUNELElBQUksSUFBSSxLQUFLLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFO1FBQzdCLE1BQU0sS0FBSyxDQUNQLCtEQUErRDtZQUMvRCxtQkFBbUIsT0FBTyxDQUFDLElBQUksaUJBQWlCLElBQUksRUFBRSxDQUFDLENBQUM7S0FDN0Q7SUFFRCw0REFBNEQ7SUFDNUQsMkJBQTJCO0lBQzNCLDBDQUEwQztJQUMxQyx1Q0FBdUM7SUFDdkMsa0JBQWtCO0lBQ2xCLGtFQUFrRTtJQUNsRSxxQkFBcUI7SUFDckIsbUJBQW1CO0lBQ25CLGtCQUFrQjtJQUNsQixLQUFLO0lBRUwsaURBQWlEO0lBQ2pELE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxDQUFDLE1BQWMsRUFBRSxJQUFrQixFQUFFLEVBQUU7UUFDakUsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEMsTUFBTSxLQUFLLEdBQ1AsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRWQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxFQUFVLEVBQUUsS0FBZSxFQUFFLEVBQUU7WUFDL0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUN0QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDdEIsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNCLE9BQU8sR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUM7UUFDRixPQUFPLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxDQUFDO0lBQzNCLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxRQUFRLENBQUMsT0FBTyxDQUFNLENBQUM7SUFFOUIseUVBQXlFO0lBQ3pFLHNEQUFzRDtJQUN0RCx5Q0FBeUM7SUFDekMsMkJBQTJCO0lBQzNCLHlEQUF5RDtJQUN6RCwyQ0FBMkM7QUFDN0MsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsRUFBQyxXQUFXLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2N1c3RvbUdyYWR9IGZyb20gJy4uL2dyYWRpZW50cyc7XG5cbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtHcmFkU2F2ZUZ1bmN9IGZyb20gJy4uL3RlbnNvcl90eXBlcyc7XG5pbXBvcnQge2NvbnZlcnRUb1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yX3V0aWxfZW52JztcbmltcG9ydCB7VGVuc29yTGlrZX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQge2Nhc3R9IGZyb20gJy4vY2FzdCc7XG5pbXBvcnQge2V4cH0gZnJvbSAnLi9leHAnO1xuaW1wb3J0IHtsb2d9IGZyb20gJy4vbG9nJztcbmltcG9ydCB7bWF4fSBmcm9tICcuL21heCc7XG5pbXBvcnQge211bH0gZnJvbSAnLi9tdWwnO1xuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuaW1wb3J0IHtzdWJ9IGZyb20gJy4vc3ViJztcbmltcG9ydCB7c3VtfSBmcm9tICcuL3N1bSc7XG5cbi8qKlxuICogQ29tcHV0ZXMgdGhlIGxvZyBzb2Z0bWF4LlxuICpcbiAqIGBgYGpzXG4gKiBjb25zdCBhID0gdGYudGVuc29yMWQoWzEsIDIsIDNdKTtcbiAqXG4gKiBhLmxvZ1NvZnRtYXgoKS5wcmludCgpOyAgLy8gb3IgdGYubG9nU29mdG1heChhKVxuICogYGBgXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChbMiwgNCwgNiwgMSwgMiwgM10sIFsyLCAzXSk7XG4gKlxuICogYS5sb2dTb2Z0bWF4KCkucHJpbnQoKTsgIC8vIG9yIHRmLmxvZ1NvZnRtYXgoYSlcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBsb2dpdHMgVGhlIGxvZ2l0cyBhcnJheS5cbiAqIEBwYXJhbSBheGlzIFRoZSBkaW1lbnNpb24gc29mdG1heCB3b3VsZCBiZSBwZXJmb3JtZWQgb24uIERlZmF1bHRzIHRvIGAtMWBcbiAqICAgICB3aGljaCBpbmRpY2F0ZXMgdGhlIGxhc3QgZGltZW5zaW9uLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6ICdPcGVyYXRpb25zJywgc3ViaGVhZGluZzogJ05vcm1hbGl6YXRpb24nfVxuICovXG5mdW5jdGlvbiBsb2dTb2Z0bWF4XzxUIGV4dGVuZHMgVGVuc29yPihsb2dpdHM6IFR8VGVuc29yTGlrZSwgYXhpcyA9IC0xKTogVCB7XG4gIGNvbnN0ICRsb2dpdHMgPSBjb252ZXJ0VG9UZW5zb3IobG9naXRzLCAnbG9naXRzJywgJ2xvZ1NvZnRtYXgnKTtcblxuICBpZiAoYXhpcyA9PT0gLTEpIHtcbiAgICBheGlzID0gJGxvZ2l0cy5yYW5rIC0gMTtcbiAgfVxuICBpZiAoYXhpcyAhPT0gJGxvZ2l0cy5yYW5rIC0gMSkge1xuICAgIHRocm93IEVycm9yKFxuICAgICAgICAnTG9nIFNvZnRtYXggYWxvbmcgYSBub24tbGFzdCBkaW1lbnNpb24gaXMgbm90IHlldCBzdXBwb3J0ZWQuICcgK1xuICAgICAgICBgTG9naXRzIHdhcyByYW5rICR7JGxvZ2l0cy5yYW5rfSBhbmQgYXhpcyB3YXMgJHtheGlzfWApO1xuICB9XG5cbiAgLy8gY29uc3QgZm9yd2FyZDogRm9yd2FyZEZ1bmM8VGVuc29yPiA9IChiYWNrZW5kLCBzYXZlKSA9PiB7XG4gIC8vICAgY29uc3Qga2VlcERpbXMgPSB0cnVlO1xuICAvLyAgIGNvbnN0IHhNYXggPSBtYXgobG9naXRzLCBheGlzLCB0cnVlKTtcbiAgLy8gICBjb25zdCBzaGlmdGVkID0gc3ViKGxvZ2l0cywgeE1heCk7XG4gIC8vICAgY29uc3QgdmFsdWUgPVxuICAvLyAgICAgICBzdWIoY2FzdChzaGlmdGVkLCAnZmxvYXQzMicpLCBsb2coc3VtKGV4cChzaGlmdGVkKSwgYXhpcyxcbiAgLy8gICAgICAga2VlcERpbXMpKSk7XG4gIC8vICAgc2F2ZShbdmFsdWVdKTtcbiAgLy8gICByZXR1cm4gdmFsdWU7XG4gIC8vIH07XG5cbiAgLy8gVXNlIGEgY3VzdG9tIGdyYWRpZW50IGZvciBudW1lcmljYWwgc3RhYmlsaXR5LlxuICBjb25zdCBjdXN0b21PcCA9IGN1c3RvbUdyYWQoKGxvZ2l0czogVGVuc29yLCBzYXZlOiBHcmFkU2F2ZUZ1bmMpID0+IHtcbiAgICBjb25zdCBrZWVwRGltcyA9IHRydWU7XG4gICAgY29uc3QgeE1heCA9IG1heChsb2dpdHMsIGF4aXMsIHRydWUpO1xuICAgIGNvbnN0IHNoaWZ0ZWQgPSBzdWIobG9naXRzLCB4TWF4KTtcbiAgICBjb25zdCB2YWx1ZSA9XG4gICAgICAgIHN1YihjYXN0KHNoaWZ0ZWQsICdmbG9hdDMyJyksIGxvZyhzdW0oZXhwKHNoaWZ0ZWQpLCBheGlzLCBrZWVwRGltcykpKTtcbiAgICBzYXZlKFt2YWx1ZV0pO1xuXG4gICAgY29uc3QgZ3JhZEZ1bmMgPSAoZHk6IFRlbnNvciwgc2F2ZWQ6IFRlbnNvcltdKSA9PiB7XG4gICAgICBjb25zdCBbdmFsdWVdID0gc2F2ZWQ7XG4gICAgICBjb25zdCBrZWVwRGltcyA9IHRydWU7XG4gICAgICBjb25zdCBzb2Z0bWF4ID0gZXhwKHZhbHVlKTtcbiAgICAgIHJldHVybiBzdWIoZHksIG11bChzdW0oZHksIGF4aXMsIGtlZXBEaW1zKSwgc29mdG1heCkpO1xuICAgIH07XG4gICAgcmV0dXJuIHt2YWx1ZSwgZ3JhZEZ1bmN9O1xuICB9KTtcblxuICByZXR1cm4gY3VzdG9tT3AoJGxvZ2l0cykgYXMgVDtcblxuICAvLyBUT0RPIFVzZSBFbmdpbmUucnVuS2VybmVsIHdoZW4gQ1BVL1dlYkdML1dBU00gYmFja2VuZHMgaW1wbGVtZW50IHRoaXMuXG4gIC8vIGNvbnN0IGlucHV0czogTG9nU29mdG1heElucHV0cyA9IHtsb2dpdHM6ICRsb2dpdHN9O1xuICAvLyBjb25zdCBhdHRyczogTG9nU29mdG1heEF0dHJzID0ge2F4aXN9O1xuICAvLyByZXR1cm4gRU5HSU5FLnJ1bktlcm5lbChcbiAgLy8gICAgICAgICAgICBMb2dTb2Z0bWF4LCBpbnB1dHMgYXMge30gYXMgTmFtZWRUZW5zb3JNYXAsXG4gIC8vICAgICAgICAgICAgYXR0cnMgYXMge30gYXMgTmFtZWRBdHRyTWFwKTtcbn1cblxuZXhwb3J0IGNvbnN0IGxvZ1NvZnRtYXggPSBvcCh7bG9nU29mdG1heF99KTtcbiJdfQ==