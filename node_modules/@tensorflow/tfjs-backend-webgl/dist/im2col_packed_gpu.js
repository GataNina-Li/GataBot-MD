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
import { getGlslDifferences } from './glsl_version';
import { useShapeUniforms } from './gpgpu_math';
export class Im2ColPackedProgram {
    constructor(outputShape, convInfo) {
        this.variableNames = ['A'];
        this.packedInputs = true;
        this.packedOutput = true;
        this.customUniforms = [
            { name: 'inputShape', type: 'ivec4' },
            { name: 'pad', type: 'ivec2' },
            { name: 'stride', type: 'ivec2' },
            { name: 'dilation', type: 'ivec2' },
            { name: 'inChannels', type: 'int' },
            { name: 'itemsPerBlockRow', type: 'int' },
            { name: 'outWidth', type: 'int' },
        ];
        this.outputShape = outputShape;
        this.enableShapeUniforms = useShapeUniforms(this.outputShape.length);
        const { dataFormat } = convInfo;
        const glsl = getGlslDifferences();
        const isChannelsLast = dataFormat === 'channelsLast';
        const rowDim = isChannelsLast ? 1 : 2;
        const colDim = isChannelsLast ? 2 : 3;
        const boundsCheckingSnippet = this.enableShapeUniforms ?
            'if(blockIndex < outShape[2] && pos < outShape[1]) {' :
            `if(blockIndex < ${outputShape[2]} && pos < ${outputShape[1]}) {`;
        let unrolled = ``;
        for (let row = 0; row <= 1; row++) {
            for (let col = 0; col <= 1; col++) {
                unrolled += `
          blockIndex = rc.z + ${col};
          pos = rc.y + ${row};

          ${boundsCheckingSnippet}
            offsetY = int(blockIndex / outWidth) * stride[0] - pad[0];
            d0 = offsetY + dilation[0] * (pos / itemsPerBlockRow);

            if(d0 < inputShape[${rowDim}] && d0 >= 0) {
              // Use custom imod instead mod. On Intel GPU, mod may generate
              // unexpected value.
              // https://github.com/tensorflow/tfjs/issues/5447
              offsetX = imod(blockIndex, outWidth) * stride[1] - pad[1];
              d1 = offsetX + dilation[1] * (imod(pos, itemsPerBlockRow) /
                  inChannels);

              if(d1 < inputShape[${colDim}] && d1 >= 0) {

                ch = imod(pos, inChannels);

                if (${isChannelsLast}) {
                  innerDims = vec2(d1, ch);
                  result[${row * 2 + col}] = getChannel(
                    getA(rc.x, d0, int(innerDims.x),
                    int(innerDims.y)), innerDims);
                } else {
                  innerDims = vec2(d0, d1);
                  result[${row * 2 + col}] = getChannel(
                    getA(rc.x, ch, int(innerDims.x),
                    int(innerDims.y)), innerDims);
                }
              }
            }
          }
        `;
            }
        }
        this.userCode = `
      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0);

        int blockIndex, pos, offsetY, d0, offsetX, d1, ch;
        vec2 innerDims;

        ${unrolled}

        ${glsl.output} = result;
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW0yY29sX3BhY2tlZF9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2ltMmNvbF9wYWNrZWRfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUdILE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2xELE9BQU8sRUFBZSxnQkFBZ0IsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUU1RCxNQUFNLE9BQU8sbUJBQW1CO0lBaUI5QixZQUFZLFdBQXFCLEVBQUUsUUFBaUM7UUFoQnBFLGtCQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUlwQixtQkFBYyxHQUFHO1lBQ2YsRUFBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxPQUFnQixFQUFFO1lBQzdDLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBZ0IsRUFBRTtZQUN0QyxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQWdCLEVBQUU7WUFDekMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFnQixFQUFFO1lBQzNDLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsS0FBYyxFQUFFO1lBQzNDLEVBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRSxLQUFjLEVBQUU7WUFDakQsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxLQUFjLEVBQUU7U0FDMUMsQ0FBQztRQUdBLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sRUFBQyxVQUFVLEVBQUMsR0FBRyxRQUFRLENBQUM7UUFDOUIsTUFBTSxJQUFJLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQztRQUNsQyxNQUFNLGNBQWMsR0FBRyxVQUFVLEtBQUssY0FBYyxDQUFDO1FBQ3JELE1BQU0sTUFBTSxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0QyxNQUFNLHFCQUFxQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3BELHFEQUFxRCxDQUFDLENBQUM7WUFDdkQsbUJBQW1CLFdBQVcsQ0FBQyxDQUFDLENBQUMsYUFBYSxXQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUN0RSxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFFbEIsS0FBSyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUNqQyxLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFO2dCQUNqQyxRQUFRLElBQUk7Z0NBQ1ksR0FBRzt5QkFDVixHQUFHOztZQUVoQixxQkFBcUI7Ozs7aUNBSUEsTUFBTTs7Ozs7Ozs7bUNBUUosTUFBTTs7OztzQkFJbkIsY0FBYzs7MkJBRVQsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHOzs7OzsyQkFLYixHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUc7Ozs7Ozs7U0FPL0IsQ0FBQzthQUNIO1NBQ0Y7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHOzs7Ozs7Ozs7VUFTVixRQUFROztVQUVSLElBQUksQ0FBQyxNQUFNOztLQUVoQixDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2JhY2tlbmRfdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbmltcG9ydCB7Z2V0R2xzbERpZmZlcmVuY2VzfSBmcm9tICcuL2dsc2xfdmVyc2lvbic7XG5pbXBvcnQge0dQR1BVUHJvZ3JhbSwgdXNlU2hhcGVVbmlmb3Jtc30gZnJvbSAnLi9ncGdwdV9tYXRoJztcblxuZXhwb3J0IGNsYXNzIEltMkNvbFBhY2tlZFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWydBJ107XG4gIHBhY2tlZElucHV0cyA9IHRydWU7XG4gIHBhY2tlZE91dHB1dCA9IHRydWU7XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXTtcbiAgdXNlckNvZGU6IHN0cmluZztcbiAgZW5hYmxlU2hhcGVVbmlmb3JtczogYm9vbGVhbjtcbiAgY3VzdG9tVW5pZm9ybXMgPSBbXG4gICAge25hbWU6ICdpbnB1dFNoYXBlJywgdHlwZTogJ2l2ZWM0JyBhcyBjb25zdCB9LFxuICAgIHtuYW1lOiAncGFkJywgdHlwZTogJ2l2ZWMyJyBhcyBjb25zdCB9LFxuICAgIHtuYW1lOiAnc3RyaWRlJywgdHlwZTogJ2l2ZWMyJyBhcyBjb25zdCB9LFxuICAgIHtuYW1lOiAnZGlsYXRpb24nLCB0eXBlOiAnaXZlYzInIGFzIGNvbnN0IH0sXG4gICAge25hbWU6ICdpbkNoYW5uZWxzJywgdHlwZTogJ2ludCcgYXMgY29uc3QgfSxcbiAgICB7bmFtZTogJ2l0ZW1zUGVyQmxvY2tSb3cnLCB0eXBlOiAnaW50JyBhcyBjb25zdCB9LFxuICAgIHtuYW1lOiAnb3V0V2lkdGgnLCB0eXBlOiAnaW50JyBhcyBjb25zdCB9LFxuICBdO1xuXG4gIGNvbnN0cnVjdG9yKG91dHB1dFNoYXBlOiBudW1iZXJbXSwgY29udkluZm86IGJhY2tlbmRfdXRpbC5Db252MkRJbmZvKSB7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IG91dHB1dFNoYXBlO1xuICAgIHRoaXMuZW5hYmxlU2hhcGVVbmlmb3JtcyA9IHVzZVNoYXBlVW5pZm9ybXModGhpcy5vdXRwdXRTaGFwZS5sZW5ndGgpO1xuICAgIGNvbnN0IHtkYXRhRm9ybWF0fSA9IGNvbnZJbmZvO1xuICAgIGNvbnN0IGdsc2wgPSBnZXRHbHNsRGlmZmVyZW5jZXMoKTtcbiAgICBjb25zdCBpc0NoYW5uZWxzTGFzdCA9IGRhdGFGb3JtYXQgPT09ICdjaGFubmVsc0xhc3QnO1xuICAgIGNvbnN0IHJvd0RpbSA9IGlzQ2hhbm5lbHNMYXN0ID8gMSA6IDI7XG4gICAgY29uc3QgY29sRGltID0gaXNDaGFubmVsc0xhc3QgPyAyIDogMztcblxuICAgIGNvbnN0IGJvdW5kc0NoZWNraW5nU25pcHBldCA9IHRoaXMuZW5hYmxlU2hhcGVVbmlmb3JtcyA/XG4gICAgICAgICdpZihibG9ja0luZGV4IDwgb3V0U2hhcGVbMl0gJiYgcG9zIDwgb3V0U2hhcGVbMV0pIHsnIDpcbiAgICAgICAgYGlmKGJsb2NrSW5kZXggPCAke291dHB1dFNoYXBlWzJdfSAmJiBwb3MgPCAke291dHB1dFNoYXBlWzFdfSkge2A7XG4gICAgbGV0IHVucm9sbGVkID0gYGA7XG5cbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPD0gMTsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8PSAxOyBjb2wrKykge1xuICAgICAgICB1bnJvbGxlZCArPSBgXG4gICAgICAgICAgYmxvY2tJbmRleCA9IHJjLnogKyAke2NvbH07XG4gICAgICAgICAgcG9zID0gcmMueSArICR7cm93fTtcblxuICAgICAgICAgICR7Ym91bmRzQ2hlY2tpbmdTbmlwcGV0fVxuICAgICAgICAgICAgb2Zmc2V0WSA9IGludChibG9ja0luZGV4IC8gb3V0V2lkdGgpICogc3RyaWRlWzBdIC0gcGFkWzBdO1xuICAgICAgICAgICAgZDAgPSBvZmZzZXRZICsgZGlsYXRpb25bMF0gKiAocG9zIC8gaXRlbXNQZXJCbG9ja1Jvdyk7XG5cbiAgICAgICAgICAgIGlmKGQwIDwgaW5wdXRTaGFwZVske3Jvd0RpbX1dICYmIGQwID49IDApIHtcbiAgICAgICAgICAgICAgLy8gVXNlIGN1c3RvbSBpbW9kIGluc3RlYWQgbW9kLiBPbiBJbnRlbCBHUFUsIG1vZCBtYXkgZ2VuZXJhdGVcbiAgICAgICAgICAgICAgLy8gdW5leHBlY3RlZCB2YWx1ZS5cbiAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RlbnNvcmZsb3cvdGZqcy9pc3N1ZXMvNTQ0N1xuICAgICAgICAgICAgICBvZmZzZXRYID0gaW1vZChibG9ja0luZGV4LCBvdXRXaWR0aCkgKiBzdHJpZGVbMV0gLSBwYWRbMV07XG4gICAgICAgICAgICAgIGQxID0gb2Zmc2V0WCArIGRpbGF0aW9uWzFdICogKGltb2QocG9zLCBpdGVtc1BlckJsb2NrUm93KSAvXG4gICAgICAgICAgICAgICAgICBpbkNoYW5uZWxzKTtcblxuICAgICAgICAgICAgICBpZihkMSA8IGlucHV0U2hhcGVbJHtjb2xEaW19XSAmJiBkMSA+PSAwKSB7XG5cbiAgICAgICAgICAgICAgICBjaCA9IGltb2QocG9zLCBpbkNoYW5uZWxzKTtcblxuICAgICAgICAgICAgICAgIGlmICgke2lzQ2hhbm5lbHNMYXN0fSkge1xuICAgICAgICAgICAgICAgICAgaW5uZXJEaW1zID0gdmVjMihkMSwgY2gpO1xuICAgICAgICAgICAgICAgICAgcmVzdWx0WyR7cm93ICogMiArIGNvbH1dID0gZ2V0Q2hhbm5lbChcbiAgICAgICAgICAgICAgICAgICAgZ2V0QShyYy54LCBkMCwgaW50KGlubmVyRGltcy54KSxcbiAgICAgICAgICAgICAgICAgICAgaW50KGlubmVyRGltcy55KSksIGlubmVyRGltcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGlubmVyRGltcyA9IHZlYzIoZDAsIGQxKTtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdFske3JvdyAqIDIgKyBjb2x9XSA9IGdldENoYW5uZWwoXG4gICAgICAgICAgICAgICAgICAgIGdldEEocmMueCwgY2gsIGludChpbm5lckRpbXMueCksXG4gICAgICAgICAgICAgICAgICAgIGludChpbm5lckRpbXMueSkpLCBpbm5lckRpbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgYDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICBpdmVjMyByYyA9IGdldE91dHB1dENvb3JkcygpO1xuXG4gICAgICAgIHZlYzQgcmVzdWx0ID0gdmVjNCgwKTtcblxuICAgICAgICBpbnQgYmxvY2tJbmRleCwgcG9zLCBvZmZzZXRZLCBkMCwgb2Zmc2V0WCwgZDEsIGNoO1xuICAgICAgICB2ZWMyIGlubmVyRGltcztcblxuICAgICAgICAke3Vucm9sbGVkfVxuXG4gICAgICAgICR7Z2xzbC5vdXRwdXR9ID0gcmVzdWx0O1xuICAgICAgfVxuICAgIGA7XG4gIH1cbn1cbiJdfQ==