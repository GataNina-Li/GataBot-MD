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
import { buffer } from './buffer';
import { expandDims } from './expand_dims';
import { op } from './operation';
import { reshape } from './reshape';
import { tile } from './tile';
/**
 * Create an identity matrix.
 *
 * @param numRows Number of rows.
 * @param numColumns Number of columns. Defaults to `numRows`.
 * @param batchShape If provided, will add the batch shape to the beginning
 *   of the shape of the returned `tf.Tensor` by repeating the identity
 *   matrix.
 * @param dtype Data type.
 * @returns Identity matrix of the specified size and data type, possibly
 *   with batch repetition if `batchShape` is specified.
 *
 * @doc {heading: 'Tensors', subheading: 'Creation'}
 */
function eye_(numRows, numColumns, batchShape, dtype = 'float32') {
    if (numColumns == null) {
        numColumns = numRows;
    }
    const buff = buffer([numRows, numColumns], dtype);
    const n = numRows <= numColumns ? numRows : numColumns;
    for (let i = 0; i < n; ++i) {
        buff.set(1, i, i);
    }
    const out = reshape(buff.toTensor(), [numRows, numColumns]);
    if (batchShape == null) {
        return out;
    }
    else {
        if (batchShape.length === 1) {
            return tile(expandDims(out, 0), [batchShape[0], 1, 1]);
        }
        else if (batchShape.length === 2) {
            // tslint:disable-next-line:no-unnecessary-type-assertion
            return tile(expandDims(expandDims(out, 0), 0), [batchShape[0], batchShape[1], 1, 1]);
        }
        else if (batchShape.length === 3) {
            // tslint:disable-next-line:no-unnecessary-type-assertion
            return tile(expandDims(expandDims(expandDims(out, 0), 0), 0), [
                batchShape[0], batchShape[1], batchShape[2], 1, 1
            ]);
        }
        else {
            throw new Error(`eye() currently supports only 1D and 2D ` +
                // tslint:disable-next-line:no-any
                `batchShapes, but received ${batchShape.length}D.`);
        }
    }
}
export const eye = op({ eye_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXllLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvZXllLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUtILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDaEMsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUU1Qjs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsU0FBUyxJQUFJLENBQ1QsT0FBZSxFQUFFLFVBQW1CLEVBQ3BDLFVBSXdFLEVBQ3hFLFFBQWtCLFNBQVM7SUFDN0IsSUFBSSxVQUFVLElBQUksSUFBSSxFQUFFO1FBQ3RCLFVBQVUsR0FBRyxPQUFPLENBQUM7S0FDdEI7SUFDRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbEQsTUFBTSxDQUFDLEdBQUcsT0FBTyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7SUFDdkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUMxQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDbkI7SUFDRCxNQUFNLEdBQUcsR0FBYSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDdEUsSUFBSSxVQUFVLElBQUksSUFBSSxFQUFFO1FBQ3RCLE9BQU8sR0FBRyxDQUFDO0tBQ1o7U0FBTTtRQUNMLElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDM0IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQWEsQ0FBQztTQUNwRTthQUFNLElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDbEMseURBQXlEO1lBQ3pELE9BQU8sSUFBSSxDQUNBLFVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUNqQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFhLENBQUM7U0FDOUQ7YUFBTSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2xDLHlEQUF5RDtZQUN6RCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3JELFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO2FBQ2xELENBQWEsQ0FBQztTQUN2QjthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FDWCwwQ0FBMEM7Z0JBQzFDLGtDQUFrQztnQkFDbEMsNkJBQThCLFVBQWtCLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztTQUNsRTtLQUNGO0FBQ0gsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge1RlbnNvcjJEfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtEYXRhVHlwZX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQge2J1ZmZlcn0gZnJvbSAnLi9idWZmZXInO1xuaW1wb3J0IHtleHBhbmREaW1zfSBmcm9tICcuL2V4cGFuZF9kaW1zJztcbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcbmltcG9ydCB7cmVzaGFwZX0gZnJvbSAnLi9yZXNoYXBlJztcbmltcG9ydCB7dGlsZX0gZnJvbSAnLi90aWxlJztcblxuLyoqXG4gKiBDcmVhdGUgYW4gaWRlbnRpdHkgbWF0cml4LlxuICpcbiAqIEBwYXJhbSBudW1Sb3dzIE51bWJlciBvZiByb3dzLlxuICogQHBhcmFtIG51bUNvbHVtbnMgTnVtYmVyIG9mIGNvbHVtbnMuIERlZmF1bHRzIHRvIGBudW1Sb3dzYC5cbiAqIEBwYXJhbSBiYXRjaFNoYXBlIElmIHByb3ZpZGVkLCB3aWxsIGFkZCB0aGUgYmF0Y2ggc2hhcGUgdG8gdGhlIGJlZ2lubmluZ1xuICogICBvZiB0aGUgc2hhcGUgb2YgdGhlIHJldHVybmVkIGB0Zi5UZW5zb3JgIGJ5IHJlcGVhdGluZyB0aGUgaWRlbnRpdHlcbiAqICAgbWF0cml4LlxuICogQHBhcmFtIGR0eXBlIERhdGEgdHlwZS5cbiAqIEByZXR1cm5zIElkZW50aXR5IG1hdHJpeCBvZiB0aGUgc3BlY2lmaWVkIHNpemUgYW5kIGRhdGEgdHlwZSwgcG9zc2libHlcbiAqICAgd2l0aCBiYXRjaCByZXBldGl0aW9uIGlmIGBiYXRjaFNoYXBlYCBpcyBzcGVjaWZpZWQuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ1RlbnNvcnMnLCBzdWJoZWFkaW5nOiAnQ3JlYXRpb24nfVxuICovXG5mdW5jdGlvbiBleWVfKFxuICAgIG51bVJvd3M6IG51bWJlciwgbnVtQ29sdW1ucz86IG51bWJlcixcbiAgICBiYXRjaFNoYXBlPzpcbiAgICAgICAgW1xuICAgICAgICAgIG51bWJlclxuICAgICAgICBdfFtudW1iZXIsXG4gICAgICAgICAgIG51bWJlcl18W251bWJlciwgbnVtYmVyLCBudW1iZXJdfFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdLFxuICAgIGR0eXBlOiBEYXRhVHlwZSA9ICdmbG9hdDMyJyk6IFRlbnNvcjJEIHtcbiAgaWYgKG51bUNvbHVtbnMgPT0gbnVsbCkge1xuICAgIG51bUNvbHVtbnMgPSBudW1Sb3dzO1xuICB9XG4gIGNvbnN0IGJ1ZmYgPSBidWZmZXIoW251bVJvd3MsIG51bUNvbHVtbnNdLCBkdHlwZSk7XG4gIGNvbnN0IG4gPSBudW1Sb3dzIDw9IG51bUNvbHVtbnMgPyBudW1Sb3dzIDogbnVtQ29sdW1ucztcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICBidWZmLnNldCgxLCBpLCBpKTtcbiAgfVxuICBjb25zdCBvdXQ6IFRlbnNvcjJEID0gcmVzaGFwZShidWZmLnRvVGVuc29yKCksIFtudW1Sb3dzLCBudW1Db2x1bW5zXSk7XG4gIGlmIChiYXRjaFNoYXBlID09IG51bGwpIHtcbiAgICByZXR1cm4gb3V0O1xuICB9IGVsc2Uge1xuICAgIGlmIChiYXRjaFNoYXBlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHRpbGUoZXhwYW5kRGltcyhvdXQsIDApLCBbYmF0Y2hTaGFwZVswXSwgMSwgMV0pIGFzIFRlbnNvcjJEO1xuICAgIH0gZWxzZSBpZiAoYmF0Y2hTaGFwZS5sZW5ndGggPT09IDIpIHtcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bm5lY2Vzc2FyeS10eXBlLWFzc2VydGlvblxuICAgICAgcmV0dXJuIHRpbGUoXG4gICAgICAgICAgICAgICAgIGV4cGFuZERpbXMoZXhwYW5kRGltcyhvdXQsIDApLCAwKSxcbiAgICAgICAgICAgICAgICAgW2JhdGNoU2hhcGVbMF0sIGJhdGNoU2hhcGVbMV0sIDEsIDFdKSBhcyBUZW5zb3IyRDtcbiAgICB9IGVsc2UgaWYgKGJhdGNoU2hhcGUubGVuZ3RoID09PSAzKSB7XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdW5uZWNlc3NhcnktdHlwZS1hc3NlcnRpb25cbiAgICAgIHJldHVybiB0aWxlKGV4cGFuZERpbXMoZXhwYW5kRGltcyhleHBhbmREaW1zKG91dCwgMCksIDApLCAwKSwgW1xuICAgICAgICAgICAgICAgYmF0Y2hTaGFwZVswXSwgYmF0Y2hTaGFwZVsxXSwgYmF0Y2hTaGFwZVsyXSwgMSwgMVxuICAgICAgICAgICAgIF0pIGFzIFRlbnNvcjJEO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYGV5ZSgpIGN1cnJlbnRseSBzdXBwb3J0cyBvbmx5IDFEIGFuZCAyRCBgICtcbiAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgICAgICAgYGJhdGNoU2hhcGVzLCBidXQgcmVjZWl2ZWQgJHsoYmF0Y2hTaGFwZSBhcyBhbnkpLmxlbmd0aH1ELmApO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZXllID0gb3Aoe2V5ZV99KTtcbiJdfQ==