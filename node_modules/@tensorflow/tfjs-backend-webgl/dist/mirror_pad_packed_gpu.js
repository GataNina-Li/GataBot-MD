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
import { getChannels } from './packing_util';
import { getCoordsDataType } from './shader_compiler';
/**
 * Example shader code for
 * `mirrorPad(tf.tensor1d([1, 2, 3], 'int32'), [[2, 2]], 'reflect')`
 * ```
 *    const int start = int(2);
 *    const int end = int(5);
 *
 *    void main() {
 *       int outputLoc = getOutputCoords();
 *       vec4 result = vec4(0.);
 *
 *       int rc = outputLoc;
 *
 *       int source = rc;
 *       if (source < start) {
 *         source = start * 2 - source - 0;
 *       } else if (source >= end) {
 *         source = (end - 1) * 2 - source + 0;
 *       }
 *       source -= start;
 *
 *       result[0] = getChannel(getX(source), source);
 *       rc += 1;
 *       if(rc < 6) {
 *          int source = rc;
 *          if (source < start) {
 *            source = start * 2 - source - 0;
 *          } else if (source >= end) {
 *            source = (end - 1) * 2 - source + 0;
 *          }
 *          source -= start;
 *
 *         result[1] = getChannel(getX(source), source);
 *       }
 *
 *       setOutput(result);
 *     }
 * ```
 */
export class MirrorPadPackedProgram {
    constructor(xShape, paddings, mode) {
        this.variableNames = ['x'];
        this.packedInputs = true;
        this.packedOutput = true;
        this.outputShape = paddings.map((p, i) => p[0] /* beforePad */ + xShape[i] + p[1] /* afterPad */);
        const rank = xShape.length;
        const dtype = getCoordsDataType(rank);
        const start = paddings.map(p => p[0]).join(',');
        const end = paddings.map((p, i) => p[0] + xShape[i]).join(',');
        const coords = getChannels('rc', rank);
        const source = getChannels('source', rank);
        const cLimit = `${coords[rank - 1]} < ${this.outputShape[rank - 1]}`;
        const innerDims = rank === 1 ? 'source' : `vec2(${source.slice(-2).join()})`;
        const offset = mode === 'reflect' ? 0 : 1;
        let mainLoop = '';
        if (rank === 1) {
            const padSetup = `
        ${dtype} source = rc;
        if (source < start) {
          source = start * 2 - source - ${offset};
        } else if (source >= end) {
          source = (end - 1) * 2 - source + ${offset};
        }
        source -= start;
      `;
            mainLoop = `
        ${dtype} rc = outputLoc;
        ${padSetup}
        result[0] = getChannel(getX(${source.join()}), ${innerDims});
        ${coords[rank - 1]} += 1;
        if(${cLimit}) {
          ${padSetup}
          result[1] = getChannel(getX(${source.join()}), ${innerDims});
        }
      `;
        }
        else {
            const padSetup = `
        ${dtype} source = rc;
        ${dtype} lt = ${dtype}(lessThan(source, start));
        ${dtype} gte = ${dtype}(greaterThanEqual(source, end));
        ${dtype} orig = 1 - (lt + gte);
        source = orig * source +
                lt * (start * 2 - source - ${offset}) +
                gte * ((end - 1) * 2 - source + ${offset});
        source -= start;
      `;
            mainLoop = `
        ${dtype} rc = outputLoc;
        ${padSetup}
        result[0] = getChannel(getX(${source.join()}), ${innerDims});
        ${coords[rank - 1]} += 1;
        if(${cLimit}) {
          ${padSetup}
          result[1] = getChannel(getX(${source.join()}), ${innerDims});
        }
        rc = outputLoc;
        ${coords[rank - 2]} += 1;
        if(${coords[rank - 2]} < ${this.outputShape[rank - 2]}) {
          ${padSetup}
          result[2] = getChannel(getX(${source.join()}), ${innerDims});
          ${coords[rank - 1]} += 1;
          if(${cLimit}) {
            ${padSetup}
            result[3] = getChannel(getX(${source.join()}), ${innerDims});
          }
        }
      `;
        }
        this.userCode = `
      const ${dtype} start = ${dtype}(${start});
      const ${dtype} end = ${dtype}(${end});

      void main() {
        ${dtype} outputLoc = getOutputCoords();
        vec4 result = vec4(0.);
        ${mainLoop}
        setOutput(result);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlycm9yX3BhZF9wYWNrZWRfZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9taXJyb3JfcGFkX3BhY2tlZF9ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBR0gsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRXBEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNDRztBQUNILE1BQU0sT0FBTyxzQkFBc0I7SUFPakMsWUFDSSxNQUFnQixFQUFFLFFBQWlDLEVBQ25ELElBQTJCO1FBUi9CLGtCQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixpQkFBWSxHQUFHLElBQUksQ0FBQztRQU9sQixJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDM0IsTUFBTSxLQUFLLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdEMsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoRCxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvRCxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0MsTUFBTSxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDckUsTUFBTSxTQUFTLEdBQ1gsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO1FBQy9ELE1BQU0sTUFBTSxHQUFHLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTFDLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNsQixJQUFJLElBQUksS0FBSyxDQUFDLEVBQUU7WUFDZCxNQUFNLFFBQVEsR0FBRztVQUNiLEtBQUs7OzBDQUUyQixNQUFNOzs4Q0FFRixNQUFNOzs7T0FHN0MsQ0FBQztZQUNGLFFBQVEsR0FBRztVQUNQLEtBQUs7VUFDTCxRQUFRO3NDQUNvQixNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sU0FBUztVQUN4RCxNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQzthQUNiLE1BQU07WUFDUCxRQUFRO3dDQUNvQixNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sU0FBUzs7T0FFN0QsQ0FBQztTQUNIO2FBQU07WUFDTCxNQUFNLFFBQVEsR0FBRztVQUNiLEtBQUs7VUFDTCxLQUFLLFNBQVMsS0FBSztVQUNuQixLQUFLLFVBQVUsS0FBSztVQUNwQixLQUFLOzs2Q0FFOEIsTUFBTTtrREFDRCxNQUFNOztPQUVqRCxDQUFDO1lBRUYsUUFBUSxHQUFHO1VBQ1AsS0FBSztVQUNMLFFBQVE7c0NBQ29CLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxTQUFTO1VBQ3hELE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2FBQ2IsTUFBTTtZQUNQLFFBQVE7d0NBQ29CLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxTQUFTOzs7VUFHMUQsTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7YUFDYixNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNqRCxRQUFRO3dDQUNvQixNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sU0FBUztZQUN4RCxNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztlQUNiLE1BQU07Y0FDUCxRQUFROzBDQUNvQixNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sU0FBUzs7O09BRy9ELENBQUM7U0FDSDtRQUVELElBQUksQ0FBQyxRQUFRLEdBQUc7Y0FDTixLQUFLLFlBQVksS0FBSyxJQUFJLEtBQUs7Y0FDL0IsS0FBSyxVQUFVLEtBQUssSUFBSSxHQUFHOzs7VUFHL0IsS0FBSzs7VUFFTCxRQUFROzs7S0FHYixDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0dQR1BVUHJvZ3JhbX0gZnJvbSAnLi9ncGdwdV9tYXRoJztcbmltcG9ydCB7Z2V0Q2hhbm5lbHN9IGZyb20gJy4vcGFja2luZ191dGlsJztcbmltcG9ydCB7Z2V0Q29vcmRzRGF0YVR5cGV9IGZyb20gJy4vc2hhZGVyX2NvbXBpbGVyJztcblxuLyoqXG4gKiBFeGFtcGxlIHNoYWRlciBjb2RlIGZvclxuICogYG1pcnJvclBhZCh0Zi50ZW5zb3IxZChbMSwgMiwgM10sICdpbnQzMicpLCBbWzIsIDJdXSwgJ3JlZmxlY3QnKWBcbiAqIGBgYFxuICogICAgY29uc3QgaW50IHN0YXJ0ID0gaW50KDIpO1xuICogICAgY29uc3QgaW50IGVuZCA9IGludCg1KTtcbiAqXG4gKiAgICB2b2lkIG1haW4oKSB7XG4gKiAgICAgICBpbnQgb3V0cHV0TG9jID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gKiAgICAgICB2ZWM0IHJlc3VsdCA9IHZlYzQoMC4pO1xuICpcbiAqICAgICAgIGludCByYyA9IG91dHB1dExvYztcbiAqXG4gKiAgICAgICBpbnQgc291cmNlID0gcmM7XG4gKiAgICAgICBpZiAoc291cmNlIDwgc3RhcnQpIHtcbiAqICAgICAgICAgc291cmNlID0gc3RhcnQgKiAyIC0gc291cmNlIC0gMDtcbiAqICAgICAgIH0gZWxzZSBpZiAoc291cmNlID49IGVuZCkge1xuICogICAgICAgICBzb3VyY2UgPSAoZW5kIC0gMSkgKiAyIC0gc291cmNlICsgMDtcbiAqICAgICAgIH1cbiAqICAgICAgIHNvdXJjZSAtPSBzdGFydDtcbiAqXG4gKiAgICAgICByZXN1bHRbMF0gPSBnZXRDaGFubmVsKGdldFgoc291cmNlKSwgc291cmNlKTtcbiAqICAgICAgIHJjICs9IDE7XG4gKiAgICAgICBpZihyYyA8IDYpIHtcbiAqICAgICAgICAgIGludCBzb3VyY2UgPSByYztcbiAqICAgICAgICAgIGlmIChzb3VyY2UgPCBzdGFydCkge1xuICogICAgICAgICAgICBzb3VyY2UgPSBzdGFydCAqIDIgLSBzb3VyY2UgLSAwO1xuICogICAgICAgICAgfSBlbHNlIGlmIChzb3VyY2UgPj0gZW5kKSB7XG4gKiAgICAgICAgICAgIHNvdXJjZSA9IChlbmQgLSAxKSAqIDIgLSBzb3VyY2UgKyAwO1xuICogICAgICAgICAgfVxuICogICAgICAgICAgc291cmNlIC09IHN0YXJ0O1xuICpcbiAqICAgICAgICAgcmVzdWx0WzFdID0gZ2V0Q2hhbm5lbChnZXRYKHNvdXJjZSksIHNvdXJjZSk7XG4gKiAgICAgICB9XG4gKlxuICogICAgICAgc2V0T3V0cHV0KHJlc3VsdCk7XG4gKiAgICAgfVxuICogYGBgXG4gKi9cbmV4cG9ydCBjbGFzcyBNaXJyb3JQYWRQYWNrZWRQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsneCddO1xuICBwYWNrZWRJbnB1dHMgPSB0cnVlO1xuICBwYWNrZWRPdXRwdXQgPSB0cnVlO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICB4U2hhcGU6IG51bWJlcltdLCBwYWRkaW5nczogQXJyYXk8W251bWJlciwgbnVtYmVyXT4sXG4gICAgICBtb2RlOiAncmVmbGVjdCd8J3N5bW1ldHJpYycpIHtcbiAgICB0aGlzLm91dHB1dFNoYXBlID0gcGFkZGluZ3MubWFwKFxuICAgICAgICAocCwgaSkgPT4gcFswXSAvKiBiZWZvcmVQYWQgKi8gKyB4U2hhcGVbaV0gKyBwWzFdIC8qIGFmdGVyUGFkICovKTtcbiAgICBjb25zdCByYW5rID0geFNoYXBlLmxlbmd0aDtcbiAgICBjb25zdCBkdHlwZSA9IGdldENvb3Jkc0RhdGFUeXBlKHJhbmspO1xuXG4gICAgY29uc3Qgc3RhcnQgPSBwYWRkaW5ncy5tYXAocCA9PiBwWzBdKS5qb2luKCcsJyk7XG4gICAgY29uc3QgZW5kID0gcGFkZGluZ3MubWFwKChwLCBpKSA9PiBwWzBdICsgeFNoYXBlW2ldKS5qb2luKCcsJyk7XG4gICAgY29uc3QgY29vcmRzID0gZ2V0Q2hhbm5lbHMoJ3JjJywgcmFuayk7XG4gICAgY29uc3Qgc291cmNlID0gZ2V0Q2hhbm5lbHMoJ3NvdXJjZScsIHJhbmspO1xuICAgIGNvbnN0IGNMaW1pdCA9IGAke2Nvb3Jkc1tyYW5rIC0gMV19IDwgJHt0aGlzLm91dHB1dFNoYXBlW3JhbmsgLSAxXX1gO1xuICAgIGNvbnN0IGlubmVyRGltcyA9XG4gICAgICAgIHJhbmsgPT09IDEgPyAnc291cmNlJyA6IGB2ZWMyKCR7c291cmNlLnNsaWNlKC0yKS5qb2luKCl9KWA7XG4gICAgY29uc3Qgb2Zmc2V0ID0gbW9kZSA9PT0gJ3JlZmxlY3QnID8gMCA6IDE7XG5cbiAgICBsZXQgbWFpbkxvb3AgPSAnJztcbiAgICBpZiAocmFuayA9PT0gMSkge1xuICAgICAgY29uc3QgcGFkU2V0dXAgPSBgXG4gICAgICAgICR7ZHR5cGV9IHNvdXJjZSA9IHJjO1xuICAgICAgICBpZiAoc291cmNlIDwgc3RhcnQpIHtcbiAgICAgICAgICBzb3VyY2UgPSBzdGFydCAqIDIgLSBzb3VyY2UgLSAke29mZnNldH07XG4gICAgICAgIH0gZWxzZSBpZiAoc291cmNlID49IGVuZCkge1xuICAgICAgICAgIHNvdXJjZSA9IChlbmQgLSAxKSAqIDIgLSBzb3VyY2UgKyAke29mZnNldH07XG4gICAgICAgIH1cbiAgICAgICAgc291cmNlIC09IHN0YXJ0O1xuICAgICAgYDtcbiAgICAgIG1haW5Mb29wID0gYFxuICAgICAgICAke2R0eXBlfSByYyA9IG91dHB1dExvYztcbiAgICAgICAgJHtwYWRTZXR1cH1cbiAgICAgICAgcmVzdWx0WzBdID0gZ2V0Q2hhbm5lbChnZXRYKCR7c291cmNlLmpvaW4oKX0pLCAke2lubmVyRGltc30pO1xuICAgICAgICAke2Nvb3Jkc1tyYW5rIC0gMV19ICs9IDE7XG4gICAgICAgIGlmKCR7Y0xpbWl0fSkge1xuICAgICAgICAgICR7cGFkU2V0dXB9XG4gICAgICAgICAgcmVzdWx0WzFdID0gZ2V0Q2hhbm5lbChnZXRYKCR7c291cmNlLmpvaW4oKX0pLCAke2lubmVyRGltc30pO1xuICAgICAgICB9XG4gICAgICBgO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwYWRTZXR1cCA9IGBcbiAgICAgICAgJHtkdHlwZX0gc291cmNlID0gcmM7XG4gICAgICAgICR7ZHR5cGV9IGx0ID0gJHtkdHlwZX0obGVzc1RoYW4oc291cmNlLCBzdGFydCkpO1xuICAgICAgICAke2R0eXBlfSBndGUgPSAke2R0eXBlfShncmVhdGVyVGhhbkVxdWFsKHNvdXJjZSwgZW5kKSk7XG4gICAgICAgICR7ZHR5cGV9IG9yaWcgPSAxIC0gKGx0ICsgZ3RlKTtcbiAgICAgICAgc291cmNlID0gb3JpZyAqIHNvdXJjZSArXG4gICAgICAgICAgICAgICAgbHQgKiAoc3RhcnQgKiAyIC0gc291cmNlIC0gJHtvZmZzZXR9KSArXG4gICAgICAgICAgICAgICAgZ3RlICogKChlbmQgLSAxKSAqIDIgLSBzb3VyY2UgKyAke29mZnNldH0pO1xuICAgICAgICBzb3VyY2UgLT0gc3RhcnQ7XG4gICAgICBgO1xuXG4gICAgICBtYWluTG9vcCA9IGBcbiAgICAgICAgJHtkdHlwZX0gcmMgPSBvdXRwdXRMb2M7XG4gICAgICAgICR7cGFkU2V0dXB9XG4gICAgICAgIHJlc3VsdFswXSA9IGdldENoYW5uZWwoZ2V0WCgke3NvdXJjZS5qb2luKCl9KSwgJHtpbm5lckRpbXN9KTtcbiAgICAgICAgJHtjb29yZHNbcmFuayAtIDFdfSArPSAxO1xuICAgICAgICBpZigke2NMaW1pdH0pIHtcbiAgICAgICAgICAke3BhZFNldHVwfVxuICAgICAgICAgIHJlc3VsdFsxXSA9IGdldENoYW5uZWwoZ2V0WCgke3NvdXJjZS5qb2luKCl9KSwgJHtpbm5lckRpbXN9KTtcbiAgICAgICAgfVxuICAgICAgICByYyA9IG91dHB1dExvYztcbiAgICAgICAgJHtjb29yZHNbcmFuayAtIDJdfSArPSAxO1xuICAgICAgICBpZigke2Nvb3Jkc1tyYW5rIC0gMl19IDwgJHt0aGlzLm91dHB1dFNoYXBlW3JhbmsgLSAyXX0pIHtcbiAgICAgICAgICAke3BhZFNldHVwfVxuICAgICAgICAgIHJlc3VsdFsyXSA9IGdldENoYW5uZWwoZ2V0WCgke3NvdXJjZS5qb2luKCl9KSwgJHtpbm5lckRpbXN9KTtcbiAgICAgICAgICAke2Nvb3Jkc1tyYW5rIC0gMV19ICs9IDE7XG4gICAgICAgICAgaWYoJHtjTGltaXR9KSB7XG4gICAgICAgICAgICAke3BhZFNldHVwfVxuICAgICAgICAgICAgcmVzdWx0WzNdID0gZ2V0Q2hhbm5lbChnZXRYKCR7c291cmNlLmpvaW4oKX0pLCAke2lubmVyRGltc30pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgYDtcbiAgICB9XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgY29uc3QgJHtkdHlwZX0gc3RhcnQgPSAke2R0eXBlfSgke3N0YXJ0fSk7XG4gICAgICBjb25zdCAke2R0eXBlfSBlbmQgPSAke2R0eXBlfSgke2VuZH0pO1xuXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgICR7ZHR5cGV9IG91dHB1dExvYyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICB2ZWM0IHJlc3VsdCA9IHZlYzQoMC4pO1xuICAgICAgICAke21haW5Mb29wfVxuICAgICAgICBzZXRPdXRwdXQocmVzdWx0KTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG4iXX0=