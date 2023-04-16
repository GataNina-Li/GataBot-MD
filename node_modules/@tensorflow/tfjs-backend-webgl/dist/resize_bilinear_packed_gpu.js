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
export class ResizeBilinearPackedProgram {
    constructor(inputShape, newHeight, newWidth, alignCorners, halfPixelCenters) {
        this.variableNames = ['A'];
        this.packedInputs = true;
        this.packedOutput = true;
        this.outputShape = [];
        const [batch, oldHeight, oldWidth, depth] = inputShape;
        this.outputShape = [batch, newHeight, newWidth, depth];
        const effectiveInSize = [
            (alignCorners && newHeight > 1) ? oldHeight - 1 : oldHeight,
            (alignCorners && newWidth > 1) ? oldWidth - 1 : oldWidth
        ];
        const effectiveOutSize = [
            (alignCorners && newHeight > 1) ? newHeight - 1 : newHeight,
            (alignCorners && newWidth > 1) ? newWidth - 1 : newWidth
        ];
        let sourceFracIndexRC;
        if (halfPixelCenters) {
            sourceFracIndexRC = `(vec3(yRC) + vec3(0.5)) * ` +
                `effectiveInputOverOutputRatioRC - vec3(0.5)`;
        }
        else {
            sourceFracIndexRC = `vec3(yRC) * effectiveInputOverOutputRatioRC`;
        }
        this.userCode = `
      const vec3 effectiveInputOverOutputRatioRC = vec3(
          ${effectiveInSize[0] / effectiveOutSize[0]},
          ${effectiveInSize[1] / effectiveOutSize[1]},
          ${effectiveInSize[1] / effectiveOutSize[1]});
      const vec3 inputShapeRC = vec3(${oldHeight}.0, ${oldWidth}.0,
                                     ${oldWidth}.0);

      float getAValue(int b, int r, int c, int d) {
        return getChannel(getA(b, r, c, d), vec2(c, d));
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        // Calculate values for next column in yRC.z.
        ivec3 yRC = coords.yzz + ivec3(0, 0, 1);

        // Fractional source index.
        vec3 sourceFracIndexRC = ${sourceFracIndexRC};

        // Compute the four integer indices.
        ivec3 sourceFloorRC = ivec3(max(sourceFracIndexRC, vec3(0.0)));
        ivec3 sourceCeilRC = ivec3(
          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));

        // Should we calculate next column and row elements in 2x2 packed cell.
        bool hasNextCol = d < ${depth - 1};
        bool hasNextRow = coords.z < ${newWidth - 1};

        // In parallel, construct four corners for all four components in
        // packed 2x2 cell.
        vec4 topLeft = vec4(
          getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d),
          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d + 1) : 0.0);

        vec4 bottomLeft = vec4(
          getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d),
          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d + 1) : 0.0);

        vec4 topRight = vec4(
          getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d),
          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d + 1) : 0.0);

        vec4 bottomRight = vec4(
          getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d),
          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d + 1) : 0.0);

        vec3 fracRC = sourceFracIndexRC - vec3(sourceFloorRC);

        vec4 top = mix(topLeft, topRight, fracRC.yyzz);
        vec4 bottom = mix(bottomLeft, bottomRight, fracRC.yyzz);
        vec4 newValue = mix(top, bottom, fracRC.x);

        setOutput(newValue);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplX2JpbGluZWFyX3BhY2tlZF9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL3Jlc2l6ZV9iaWxpbmVhcl9wYWNrZWRfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUlILE1BQU0sT0FBTywyQkFBMkI7SUFPdEMsWUFDSSxVQUE0QyxFQUFFLFNBQWlCLEVBQy9ELFFBQWdCLEVBQUUsWUFBcUIsRUFBRSxnQkFBeUI7UUFSdEUsa0JBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLGdCQUFXLEdBQWEsRUFBRSxDQUFDO1FBTXpCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsR0FBRyxVQUFVLENBQUM7UUFDdkQsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXZELE1BQU0sZUFBZSxHQUFxQjtZQUN4QyxDQUFDLFlBQVksSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDM0QsQ0FBQyxZQUFZLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRO1NBQ3pELENBQUM7UUFFRixNQUFNLGdCQUFnQixHQUFxQjtZQUN6QyxDQUFDLFlBQVksSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDM0QsQ0FBQyxZQUFZLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRO1NBQ3pELENBQUM7UUFFRixJQUFJLGlCQUF5QixDQUFDO1FBQzlCLElBQUksZ0JBQWdCLEVBQUU7WUFDcEIsaUJBQWlCLEdBQUcsNEJBQTRCO2dCQUM1Qyw2Q0FBNkMsQ0FBQztTQUNuRDthQUFNO1lBQ0wsaUJBQWlCLEdBQUcsNkNBQTZDLENBQUM7U0FDbkU7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHOztZQUVSLGVBQWUsQ0FBQyxDQUFDLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDeEMsZUFBZSxDQUFDLENBQUMsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUN4QyxlQUFlLENBQUMsQ0FBQyxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO3VDQUNiLFNBQVMsT0FBTyxRQUFRO3VDQUN4QixRQUFROzs7Ozs7Ozs7Ozs7OzttQ0FjWixpQkFBaUI7Ozs7Ozs7O2dDQVFwQixLQUFLLEdBQUcsQ0FBQzt1Q0FDRixRQUFRLEdBQUcsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBZ0Q5QyxDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0dQR1BVUHJvZ3JhbX0gZnJvbSAnLi9ncGdwdV9tYXRoJztcblxuZXhwb3J0IGNsYXNzIFJlc2l6ZUJpbGluZWFyUGFja2VkUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ0EnXTtcbiAgcGFja2VkSW5wdXRzID0gdHJ1ZTtcbiAgcGFja2VkT3V0cHV0ID0gdHJ1ZTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdID0gW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSwgbmV3SGVpZ2h0OiBudW1iZXIsXG4gICAgICBuZXdXaWR0aDogbnVtYmVyLCBhbGlnbkNvcm5lcnM6IGJvb2xlYW4sIGhhbGZQaXhlbENlbnRlcnM6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBbYmF0Y2gsIG9sZEhlaWdodCwgb2xkV2lkdGgsIGRlcHRoXSA9IGlucHV0U2hhcGU7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IFtiYXRjaCwgbmV3SGVpZ2h0LCBuZXdXaWR0aCwgZGVwdGhdO1xuXG4gICAgY29uc3QgZWZmZWN0aXZlSW5TaXplOiBbbnVtYmVyLCBudW1iZXJdID0gW1xuICAgICAgKGFsaWduQ29ybmVycyAmJiBuZXdIZWlnaHQgPiAxKSA/IG9sZEhlaWdodCAtIDEgOiBvbGRIZWlnaHQsXG4gICAgICAoYWxpZ25Db3JuZXJzICYmIG5ld1dpZHRoID4gMSkgPyBvbGRXaWR0aCAtIDEgOiBvbGRXaWR0aFxuICAgIF07XG5cbiAgICBjb25zdCBlZmZlY3RpdmVPdXRTaXplOiBbbnVtYmVyLCBudW1iZXJdID0gW1xuICAgICAgKGFsaWduQ29ybmVycyAmJiBuZXdIZWlnaHQgPiAxKSA/IG5ld0hlaWdodCAtIDEgOiBuZXdIZWlnaHQsXG4gICAgICAoYWxpZ25Db3JuZXJzICYmIG5ld1dpZHRoID4gMSkgPyBuZXdXaWR0aCAtIDEgOiBuZXdXaWR0aFxuICAgIF07XG5cbiAgICBsZXQgc291cmNlRnJhY0luZGV4UkM6IHN0cmluZztcbiAgICBpZiAoaGFsZlBpeGVsQ2VudGVycykge1xuICAgICAgc291cmNlRnJhY0luZGV4UkMgPSBgKHZlYzMoeVJDKSArIHZlYzMoMC41KSkgKiBgICtcbiAgICAgICAgICBgZWZmZWN0aXZlSW5wdXRPdmVyT3V0cHV0UmF0aW9SQyAtIHZlYzMoMC41KWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNvdXJjZUZyYWNJbmRleFJDID0gYHZlYzMoeVJDKSAqIGVmZmVjdGl2ZUlucHV0T3Zlck91dHB1dFJhdGlvUkNgO1xuICAgIH1cblxuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICBjb25zdCB2ZWMzIGVmZmVjdGl2ZUlucHV0T3Zlck91dHB1dFJhdGlvUkMgPSB2ZWMzKFxuICAgICAgICAgICR7ZWZmZWN0aXZlSW5TaXplWzBdIC8gZWZmZWN0aXZlT3V0U2l6ZVswXX0sXG4gICAgICAgICAgJHtlZmZlY3RpdmVJblNpemVbMV0gLyBlZmZlY3RpdmVPdXRTaXplWzFdfSxcbiAgICAgICAgICAke2VmZmVjdGl2ZUluU2l6ZVsxXSAvIGVmZmVjdGl2ZU91dFNpemVbMV19KTtcbiAgICAgIGNvbnN0IHZlYzMgaW5wdXRTaGFwZVJDID0gdmVjMygke29sZEhlaWdodH0uMCwgJHtvbGRXaWR0aH0uMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke29sZFdpZHRofS4wKTtcblxuICAgICAgZmxvYXQgZ2V0QVZhbHVlKGludCBiLCBpbnQgciwgaW50IGMsIGludCBkKSB7XG4gICAgICAgIHJldHVybiBnZXRDaGFubmVsKGdldEEoYiwgciwgYywgZCksIHZlYzIoYywgZCkpO1xuICAgICAgfVxuXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIGl2ZWM0IGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICBpbnQgYiA9IGNvb3Jkc1swXTtcbiAgICAgICAgaW50IGQgPSBjb29yZHNbM107XG4gICAgICAgIC8vIENhbGN1bGF0ZSB2YWx1ZXMgZm9yIG5leHQgY29sdW1uIGluIHlSQy56LlxuICAgICAgICBpdmVjMyB5UkMgPSBjb29yZHMueXp6ICsgaXZlYzMoMCwgMCwgMSk7XG5cbiAgICAgICAgLy8gRnJhY3Rpb25hbCBzb3VyY2UgaW5kZXguXG4gICAgICAgIHZlYzMgc291cmNlRnJhY0luZGV4UkMgPSAke3NvdXJjZUZyYWNJbmRleFJDfTtcblxuICAgICAgICAvLyBDb21wdXRlIHRoZSBmb3VyIGludGVnZXIgaW5kaWNlcy5cbiAgICAgICAgaXZlYzMgc291cmNlRmxvb3JSQyA9IGl2ZWMzKG1heChzb3VyY2VGcmFjSW5kZXhSQywgdmVjMygwLjApKSk7XG4gICAgICAgIGl2ZWMzIHNvdXJjZUNlaWxSQyA9IGl2ZWMzKFxuICAgICAgICAgIG1pbihpbnB1dFNoYXBlUkMgLSAxLjAsIGNlaWwoc291cmNlRnJhY0luZGV4UkMpKSk7XG5cbiAgICAgICAgLy8gU2hvdWxkIHdlIGNhbGN1bGF0ZSBuZXh0IGNvbHVtbiBhbmQgcm93IGVsZW1lbnRzIGluIDJ4MiBwYWNrZWQgY2VsbC5cbiAgICAgICAgYm9vbCBoYXNOZXh0Q29sID0gZCA8ICR7ZGVwdGggLSAxfTtcbiAgICAgICAgYm9vbCBoYXNOZXh0Um93ID0gY29vcmRzLnogPCAke25ld1dpZHRoIC0gMX07XG5cbiAgICAgICAgLy8gSW4gcGFyYWxsZWwsIGNvbnN0cnVjdCBmb3VyIGNvcm5lcnMgZm9yIGFsbCBmb3VyIGNvbXBvbmVudHMgaW5cbiAgICAgICAgLy8gcGFja2VkIDJ4MiBjZWxsLlxuICAgICAgICB2ZWM0IHRvcExlZnQgPSB2ZWM0KFxuICAgICAgICAgIGdldEFWYWx1ZShiLCBzb3VyY2VGbG9vclJDLngsIHNvdXJjZUZsb29yUkMueSwgZCksXG4gICAgICAgICAgaGFzTmV4dENvbCA/IGdldEFWYWx1ZShiLCBzb3VyY2VGbG9vclJDLngsIHNvdXJjZUZsb29yUkMueSwgZCArIDEpXG4gICAgICAgICAgICAgICAgICAgICA6IDAuMCxcbiAgICAgICAgICBoYXNOZXh0Um93ID8gZ2V0QVZhbHVlKGIsIHNvdXJjZUZsb29yUkMueCwgc291cmNlRmxvb3JSQy56LCBkKVxuICAgICAgICAgICAgICAgICAgICAgOiAwLjAsXG4gICAgICAgICAgKGhhc05leHRSb3cgJiYgaGFzTmV4dENvbCkgP1xuICAgICAgICAgICAgZ2V0QVZhbHVlKGIsIHNvdXJjZUZsb29yUkMueCwgc291cmNlRmxvb3JSQy56LCBkICsgMSkgOiAwLjApO1xuXG4gICAgICAgIHZlYzQgYm90dG9tTGVmdCA9IHZlYzQoXG4gICAgICAgICAgZ2V0QVZhbHVlKGIsIHNvdXJjZUNlaWxSQy54LCBzb3VyY2VGbG9vclJDLnksIGQpLFxuICAgICAgICAgIGhhc05leHRDb2wgPyBnZXRBVmFsdWUoYiwgc291cmNlQ2VpbFJDLngsIHNvdXJjZUZsb29yUkMueSwgZCArIDEpXG4gICAgICAgICAgICAgICAgICAgICA6IDAuMCxcbiAgICAgICAgICBoYXNOZXh0Um93ID8gZ2V0QVZhbHVlKGIsIHNvdXJjZUNlaWxSQy54LCBzb3VyY2VGbG9vclJDLnosIGQpXG4gICAgICAgICAgICAgICAgICAgICA6IDAuMCxcbiAgICAgICAgICAoaGFzTmV4dFJvdyAmJiBoYXNOZXh0Q29sKSA/XG4gICAgICAgICAgICBnZXRBVmFsdWUoYiwgc291cmNlQ2VpbFJDLngsIHNvdXJjZUZsb29yUkMueiwgZCArIDEpIDogMC4wKTtcblxuICAgICAgICB2ZWM0IHRvcFJpZ2h0ID0gdmVjNChcbiAgICAgICAgICBnZXRBVmFsdWUoYiwgc291cmNlRmxvb3JSQy54LCBzb3VyY2VDZWlsUkMueSwgZCksXG4gICAgICAgICAgaGFzTmV4dENvbCA/IGdldEFWYWx1ZShiLCBzb3VyY2VGbG9vclJDLngsIHNvdXJjZUNlaWxSQy55LCBkICsgMSlcbiAgICAgICAgICAgICAgICAgICAgIDogMC4wLFxuICAgICAgICAgIGhhc05leHRSb3cgPyBnZXRBVmFsdWUoYiwgc291cmNlRmxvb3JSQy54LCBzb3VyY2VDZWlsUkMueiwgZClcbiAgICAgICAgICAgICAgICAgICAgIDogMC4wLFxuICAgICAgICAgIChoYXNOZXh0Um93ICYmIGhhc05leHRDb2wpID9cbiAgICAgICAgICAgIGdldEFWYWx1ZShiLCBzb3VyY2VGbG9vclJDLngsIHNvdXJjZUNlaWxSQy56LCBkICsgMSkgOiAwLjApO1xuXG4gICAgICAgIHZlYzQgYm90dG9tUmlnaHQgPSB2ZWM0KFxuICAgICAgICAgIGdldEFWYWx1ZShiLCBzb3VyY2VDZWlsUkMueCwgc291cmNlQ2VpbFJDLnksIGQpLFxuICAgICAgICAgIGhhc05leHRDb2wgPyBnZXRBVmFsdWUoYiwgc291cmNlQ2VpbFJDLngsIHNvdXJjZUNlaWxSQy55LCBkICsgMSlcbiAgICAgICAgICAgICAgICAgICAgIDogMC4wLFxuICAgICAgICAgIGhhc05leHRSb3cgPyBnZXRBVmFsdWUoYiwgc291cmNlQ2VpbFJDLngsIHNvdXJjZUNlaWxSQy56LCBkKVxuICAgICAgICAgICAgICAgICAgICAgOiAwLjAsXG4gICAgICAgICAgKGhhc05leHRSb3cgJiYgaGFzTmV4dENvbCkgP1xuICAgICAgICAgICAgZ2V0QVZhbHVlKGIsIHNvdXJjZUNlaWxSQy54LCBzb3VyY2VDZWlsUkMueiwgZCArIDEpIDogMC4wKTtcblxuICAgICAgICB2ZWMzIGZyYWNSQyA9IHNvdXJjZUZyYWNJbmRleFJDIC0gdmVjMyhzb3VyY2VGbG9vclJDKTtcblxuICAgICAgICB2ZWM0IHRvcCA9IG1peCh0b3BMZWZ0LCB0b3BSaWdodCwgZnJhY1JDLnl5enopO1xuICAgICAgICB2ZWM0IGJvdHRvbSA9IG1peChib3R0b21MZWZ0LCBib3R0b21SaWdodCwgZnJhY1JDLnl5enopO1xuICAgICAgICB2ZWM0IG5ld1ZhbHVlID0gbWl4KHRvcCwgYm90dG9tLCBmcmFjUkMueCk7XG5cbiAgICAgICAgc2V0T3V0cHV0KG5ld1ZhbHVlKTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG4iXX0=