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
import { sizeFromShape } from '../util';
import { op } from './operation';
/**
 * Creates a `tf.Tensor` with values sampled from a random number generator
 * function defined by the user.
 *
 * @param shape An array of integers defining the output tensor shape.
 * @param randFunction A random number generator function which is called
 * for each element in the output tensor.
 * @param dtype The data type of the output tensor. Defaults to 'float32'.
 *
 * @doc {heading: 'Tensors', subheading: 'Random'}
 */
function rand_(shape, randFunction, dtype) {
    const size = sizeFromShape(shape);
    let values = null;
    if (dtype == null || dtype === 'float32') {
        values = new Float32Array(size);
    }
    else if (dtype === 'int32') {
        values = new Int32Array(size);
    }
    else if (dtype === 'bool') {
        values = new Uint8Array(size);
    }
    else {
        throw new Error(`Unknown data type ${dtype}`);
    }
    for (let i = 0; i < size; i++) {
        values[i] = randFunction();
    }
    return ENGINE.makeTensor(values, shape, dtype);
}
export const rand = op({ rand_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3JhbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUdqQyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBRXRDLE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFL0I7Ozs7Ozs7Ozs7R0FVRztBQUNILFNBQVMsS0FBSyxDQUNWLEtBQWtCLEVBQUUsWUFBMEIsRUFDOUMsS0FBZ0I7SUFDbEIsTUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQztJQUNsQixJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUN4QyxNQUFNLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDakM7U0FBTSxJQUFJLEtBQUssS0FBSyxPQUFPLEVBQUU7UUFDNUIsTUFBTSxHQUFHLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQy9CO1NBQU0sSUFBSSxLQUFLLEtBQUssTUFBTSxFQUFFO1FBQzNCLE1BQU0sR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMvQjtTQUFNO1FBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUMvQztJQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDN0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFlBQVksRUFBRSxDQUFDO0tBQzVCO0lBQ0QsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFjLENBQUM7QUFDOUQsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsRUFBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtEYXRhVHlwZSwgUmFuaywgU2hhcGVNYXB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7c2l6ZUZyb21TaGFwZX0gZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgYHRmLlRlbnNvcmAgd2l0aCB2YWx1ZXMgc2FtcGxlZCBmcm9tIGEgcmFuZG9tIG51bWJlciBnZW5lcmF0b3JcbiAqIGZ1bmN0aW9uIGRlZmluZWQgYnkgdGhlIHVzZXIuXG4gKlxuICogQHBhcmFtIHNoYXBlIEFuIGFycmF5IG9mIGludGVnZXJzIGRlZmluaW5nIHRoZSBvdXRwdXQgdGVuc29yIHNoYXBlLlxuICogQHBhcmFtIHJhbmRGdW5jdGlvbiBBIHJhbmRvbSBudW1iZXIgZ2VuZXJhdG9yIGZ1bmN0aW9uIHdoaWNoIGlzIGNhbGxlZFxuICogZm9yIGVhY2ggZWxlbWVudCBpbiB0aGUgb3V0cHV0IHRlbnNvci5cbiAqIEBwYXJhbSBkdHlwZSBUaGUgZGF0YSB0eXBlIG9mIHRoZSBvdXRwdXQgdGVuc29yLiBEZWZhdWx0cyB0byAnZmxvYXQzMicuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ1RlbnNvcnMnLCBzdWJoZWFkaW5nOiAnUmFuZG9tJ31cbiAqL1xuZnVuY3Rpb24gcmFuZF88UiBleHRlbmRzIFJhbms+KFxuICAgIHNoYXBlOiBTaGFwZU1hcFtSXSwgcmFuZEZ1bmN0aW9uOiAoKSA9PiBudW1iZXIsXG4gICAgZHR5cGU/OiBEYXRhVHlwZSk6IFRlbnNvcjxSPiB7XG4gIGNvbnN0IHNpemUgPSBzaXplRnJvbVNoYXBlKHNoYXBlKTtcbiAgbGV0IHZhbHVlcyA9IG51bGw7XG4gIGlmIChkdHlwZSA9PSBudWxsIHx8IGR0eXBlID09PSAnZmxvYXQzMicpIHtcbiAgICB2YWx1ZXMgPSBuZXcgRmxvYXQzMkFycmF5KHNpemUpO1xuICB9IGVsc2UgaWYgKGR0eXBlID09PSAnaW50MzInKSB7XG4gICAgdmFsdWVzID0gbmV3IEludDMyQXJyYXkoc2l6ZSk7XG4gIH0gZWxzZSBpZiAoZHR5cGUgPT09ICdib29sJykge1xuICAgIHZhbHVlcyA9IG5ldyBVaW50OEFycmF5KHNpemUpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBkYXRhIHR5cGUgJHtkdHlwZX1gKTtcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgIHZhbHVlc1tpXSA9IHJhbmRGdW5jdGlvbigpO1xuICB9XG4gIHJldHVybiBFTkdJTkUubWFrZVRlbnNvcih2YWx1ZXMsIHNoYXBlLCBkdHlwZSkgYXMgVGVuc29yPFI+O1xufVxuXG5leHBvcnQgY29uc3QgcmFuZCA9IG9wKHtyYW5kX30pO1xuIl19