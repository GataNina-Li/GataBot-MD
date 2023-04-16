/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
export class ResizeBilinearProgram {
    constructor(inputShape, newHeight, newWidth, alignCorners, halfPixelCenters) {
        this.variableNames = ['A'];
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
            sourceFracIndexRC =
                `(vec2(yRC) + vec2(0.5)) * effectiveInputOverOutputRatioRC` +
                    ` - vec2(0.5)`;
        }
        else {
            sourceFracIndexRC = `vec2(yRC) * effectiveInputOverOutputRatioRC`;
        }
        this.userCode = `
      const vec2 effectiveInputOverOutputRatioRC = vec2(
          ${effectiveInSize[0] / effectiveOutSize[0]},
          ${effectiveInSize[1] / effectiveOutSize[1]});
      const vec2 inputShapeRC = vec2(${oldHeight}.0, ${oldWidth}.0);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        ivec2 yRC = coords.yz;

        // Fractional source index.
        vec2 sourceFracIndexRC = ${sourceFracIndexRC};

        // Compute the four integer indices.
        ivec2 sourceFloorRC = ivec2(max(sourceFracIndexRC, vec2(0.0)));
        ivec2 sourceCeilRC = ivec2(
          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));

        float topLeft = getA(b, sourceFloorRC.x, sourceFloorRC.y, d);
        float bottomLeft = getA(b, sourceCeilRC.x, sourceFloorRC.y, d);
        float topRight = getA(b, sourceFloorRC.x, sourceCeilRC.y, d);
        float bottomRight = getA(b, sourceCeilRC.x, sourceCeilRC.y, d);

        vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);

        float top = topLeft + (topRight - topLeft) * fracRC.y;
        float bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;
        float newValue = top + (bottom - top) * fracRC.x;

        setOutput(newValue);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplX2JpbGluZWFyX2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvcmVzaXplX2JpbGluZWFyX2dwdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFJSCxNQUFNLE9BQU8scUJBQXFCO0lBS2hDLFlBQ0ksVUFBNEMsRUFBRSxTQUFpQixFQUMvRCxRQUFnQixFQUFFLFlBQXFCLEVBQUUsZ0JBQXlCO1FBTnRFLGtCQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QixnQkFBVyxHQUFhLEVBQUUsQ0FBQztRQU16QixNQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQ3ZELElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV2RCxNQUFNLGVBQWUsR0FBcUI7WUFDeEMsQ0FBQyxZQUFZLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQzNELENBQUMsWUFBWSxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUTtTQUN6RCxDQUFDO1FBRUYsTUFBTSxnQkFBZ0IsR0FBcUI7WUFDekMsQ0FBQyxZQUFZLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQzNELENBQUMsWUFBWSxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUTtTQUN6RCxDQUFDO1FBRUYsSUFBSSxpQkFBeUIsQ0FBQztRQUM5QixJQUFJLGdCQUFnQixFQUFFO1lBQ3BCLGlCQUFpQjtnQkFDYiwyREFBMkQ7b0JBQzNELGNBQWMsQ0FBQztTQUNwQjthQUFNO1lBQ0wsaUJBQWlCLEdBQUcsNkNBQTZDLENBQUM7U0FDbkU7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHOztZQUVSLGVBQWUsQ0FBQyxDQUFDLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDeEMsZUFBZSxDQUFDLENBQUMsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQzt1Q0FDYixTQUFTLE9BQU8sUUFBUTs7Ozs7Ozs7O21DQVM1QixpQkFBaUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBb0IvQyxDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0dQR1BVUHJvZ3JhbX0gZnJvbSAnLi9ncGdwdV9tYXRoJztcblxuZXhwb3J0IGNsYXNzIFJlc2l6ZUJpbGluZWFyUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ0EnXTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdID0gW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSwgbmV3SGVpZ2h0OiBudW1iZXIsXG4gICAgICBuZXdXaWR0aDogbnVtYmVyLCBhbGlnbkNvcm5lcnM6IGJvb2xlYW4sIGhhbGZQaXhlbENlbnRlcnM6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBbYmF0Y2gsIG9sZEhlaWdodCwgb2xkV2lkdGgsIGRlcHRoXSA9IGlucHV0U2hhcGU7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IFtiYXRjaCwgbmV3SGVpZ2h0LCBuZXdXaWR0aCwgZGVwdGhdO1xuXG4gICAgY29uc3QgZWZmZWN0aXZlSW5TaXplOiBbbnVtYmVyLCBudW1iZXJdID0gW1xuICAgICAgKGFsaWduQ29ybmVycyAmJiBuZXdIZWlnaHQgPiAxKSA/IG9sZEhlaWdodCAtIDEgOiBvbGRIZWlnaHQsXG4gICAgICAoYWxpZ25Db3JuZXJzICYmIG5ld1dpZHRoID4gMSkgPyBvbGRXaWR0aCAtIDEgOiBvbGRXaWR0aFxuICAgIF07XG5cbiAgICBjb25zdCBlZmZlY3RpdmVPdXRTaXplOiBbbnVtYmVyLCBudW1iZXJdID0gW1xuICAgICAgKGFsaWduQ29ybmVycyAmJiBuZXdIZWlnaHQgPiAxKSA/IG5ld0hlaWdodCAtIDEgOiBuZXdIZWlnaHQsXG4gICAgICAoYWxpZ25Db3JuZXJzICYmIG5ld1dpZHRoID4gMSkgPyBuZXdXaWR0aCAtIDEgOiBuZXdXaWR0aFxuICAgIF07XG5cbiAgICBsZXQgc291cmNlRnJhY0luZGV4UkM6IHN0cmluZztcbiAgICBpZiAoaGFsZlBpeGVsQ2VudGVycykge1xuICAgICAgc291cmNlRnJhY0luZGV4UkMgPVxuICAgICAgICAgIGAodmVjMih5UkMpICsgdmVjMigwLjUpKSAqIGVmZmVjdGl2ZUlucHV0T3Zlck91dHB1dFJhdGlvUkNgICtcbiAgICAgICAgICBgIC0gdmVjMigwLjUpYDtcbiAgICB9IGVsc2Uge1xuICAgICAgc291cmNlRnJhY0luZGV4UkMgPSBgdmVjMih5UkMpICogZWZmZWN0aXZlSW5wdXRPdmVyT3V0cHV0UmF0aW9SQ2A7XG4gICAgfVxuXG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgIGNvbnN0IHZlYzIgZWZmZWN0aXZlSW5wdXRPdmVyT3V0cHV0UmF0aW9SQyA9IHZlYzIoXG4gICAgICAgICAgJHtlZmZlY3RpdmVJblNpemVbMF0gLyBlZmZlY3RpdmVPdXRTaXplWzBdfSxcbiAgICAgICAgICAke2VmZmVjdGl2ZUluU2l6ZVsxXSAvIGVmZmVjdGl2ZU91dFNpemVbMV19KTtcbiAgICAgIGNvbnN0IHZlYzIgaW5wdXRTaGFwZVJDID0gdmVjMigke29sZEhlaWdodH0uMCwgJHtvbGRXaWR0aH0uMCk7XG5cbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgaXZlYzQgY29vcmRzID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gICAgICAgIGludCBiID0gY29vcmRzWzBdO1xuICAgICAgICBpbnQgZCA9IGNvb3Jkc1szXTtcbiAgICAgICAgaXZlYzIgeVJDID0gY29vcmRzLnl6O1xuXG4gICAgICAgIC8vIEZyYWN0aW9uYWwgc291cmNlIGluZGV4LlxuICAgICAgICB2ZWMyIHNvdXJjZUZyYWNJbmRleFJDID0gJHtzb3VyY2VGcmFjSW5kZXhSQ307XG5cbiAgICAgICAgLy8gQ29tcHV0ZSB0aGUgZm91ciBpbnRlZ2VyIGluZGljZXMuXG4gICAgICAgIGl2ZWMyIHNvdXJjZUZsb29yUkMgPSBpdmVjMihtYXgoc291cmNlRnJhY0luZGV4UkMsIHZlYzIoMC4wKSkpO1xuICAgICAgICBpdmVjMiBzb3VyY2VDZWlsUkMgPSBpdmVjMihcbiAgICAgICAgICBtaW4oaW5wdXRTaGFwZVJDIC0gMS4wLCBjZWlsKHNvdXJjZUZyYWNJbmRleFJDKSkpO1xuXG4gICAgICAgIGZsb2F0IHRvcExlZnQgPSBnZXRBKGIsIHNvdXJjZUZsb29yUkMueCwgc291cmNlRmxvb3JSQy55LCBkKTtcbiAgICAgICAgZmxvYXQgYm90dG9tTGVmdCA9IGdldEEoYiwgc291cmNlQ2VpbFJDLngsIHNvdXJjZUZsb29yUkMueSwgZCk7XG4gICAgICAgIGZsb2F0IHRvcFJpZ2h0ID0gZ2V0QShiLCBzb3VyY2VGbG9vclJDLngsIHNvdXJjZUNlaWxSQy55LCBkKTtcbiAgICAgICAgZmxvYXQgYm90dG9tUmlnaHQgPSBnZXRBKGIsIHNvdXJjZUNlaWxSQy54LCBzb3VyY2VDZWlsUkMueSwgZCk7XG5cbiAgICAgICAgdmVjMiBmcmFjUkMgPSBzb3VyY2VGcmFjSW5kZXhSQyAtIHZlYzIoc291cmNlRmxvb3JSQyk7XG5cbiAgICAgICAgZmxvYXQgdG9wID0gdG9wTGVmdCArICh0b3BSaWdodCAtIHRvcExlZnQpICogZnJhY1JDLnk7XG4gICAgICAgIGZsb2F0IGJvdHRvbSA9IGJvdHRvbUxlZnQgKyAoYm90dG9tUmlnaHQgLSBib3R0b21MZWZ0KSAqIGZyYWNSQy55O1xuICAgICAgICBmbG9hdCBuZXdWYWx1ZSA9IHRvcCArIChib3R0b20gLSB0b3ApICogZnJhY1JDLng7XG5cbiAgICAgICAgc2V0T3V0cHV0KG5ld1ZhbHVlKTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG4iXX0=