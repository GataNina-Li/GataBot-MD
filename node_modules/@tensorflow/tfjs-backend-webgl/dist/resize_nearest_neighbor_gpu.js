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
export class ResizeNearestNeighborProgram {
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
        // When align corners is false, we rounds the value with floor.
        const roundBase = alignCorners ? '0.5' : '0.0';
        let sourceFracIndexRC;
        if (halfPixelCenters) {
            sourceFracIndexRC =
                `max((vec2(yRC) + vec2(0.5)) * effectiveInputOverOutputRatioRC` +
                    `, vec2(0.0))`;
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

        // Compute the coordinators of nearest neighbor point.
        ivec2 sourceNearestRC = ivec2(
          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + ${roundBase})));
        float newValue = getA(b, sourceNearestRC.x, sourceNearestRC.y, d);

        setOutput(newValue);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplX25lYXJlc3RfbmVpZ2hib3JfZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9yZXNpemVfbmVhcmVzdF9uZWlnaGJvcl9ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBSUgsTUFBTSxPQUFPLDRCQUE0QjtJQUt2QyxZQUNJLFVBQTRDLEVBQUUsU0FBaUIsRUFDL0QsUUFBZ0IsRUFBRSxZQUFxQixFQUFFLGdCQUF5QjtRQU50RSxrQkFBYSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEIsZ0JBQVcsR0FBYSxFQUFFLENBQUM7UUFNekIsTUFBTSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUN2RCxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFdkQsTUFBTSxlQUFlLEdBQXFCO1lBQ3hDLENBQUMsWUFBWSxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztZQUMzRCxDQUFDLFlBQVksSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVE7U0FDekQsQ0FBQztRQUVGLE1BQU0sZ0JBQWdCLEdBQXFCO1lBQ3pDLENBQUMsWUFBWSxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztZQUMzRCxDQUFDLFlBQVksSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVE7U0FDekQsQ0FBQztRQUVGLCtEQUErRDtRQUMvRCxNQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBRS9DLElBQUksaUJBQXlCLENBQUM7UUFDOUIsSUFBSSxnQkFBZ0IsRUFBRTtZQUNwQixpQkFBaUI7Z0JBQ2IsK0RBQStEO29CQUMvRCxjQUFjLENBQUM7U0FDcEI7YUFBTTtZQUNMLGlCQUFpQixHQUFHLDZDQUE2QyxDQUFDO1NBQ25FO1FBQ0QsSUFBSSxDQUFDLFFBQVEsR0FBRzs7WUFFUixlQUFlLENBQUMsQ0FBQyxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLGVBQWUsQ0FBQyxDQUFDLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7dUNBQ2IsU0FBUyxPQUFPLFFBQVE7Ozs7Ozs7OzttQ0FTNUIsaUJBQWlCOzs7OzhEQUlVLFNBQVM7Ozs7O0tBS2xFLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuXG5leHBvcnQgY2xhc3MgUmVzaXplTmVhcmVzdE5laWdoYm9yUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ0EnXTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdID0gW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSwgbmV3SGVpZ2h0OiBudW1iZXIsXG4gICAgICBuZXdXaWR0aDogbnVtYmVyLCBhbGlnbkNvcm5lcnM6IGJvb2xlYW4sIGhhbGZQaXhlbENlbnRlcnM6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBbYmF0Y2gsIG9sZEhlaWdodCwgb2xkV2lkdGgsIGRlcHRoXSA9IGlucHV0U2hhcGU7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IFtiYXRjaCwgbmV3SGVpZ2h0LCBuZXdXaWR0aCwgZGVwdGhdO1xuXG4gICAgY29uc3QgZWZmZWN0aXZlSW5TaXplOiBbbnVtYmVyLCBudW1iZXJdID0gW1xuICAgICAgKGFsaWduQ29ybmVycyAmJiBuZXdIZWlnaHQgPiAxKSA/IG9sZEhlaWdodCAtIDEgOiBvbGRIZWlnaHQsXG4gICAgICAoYWxpZ25Db3JuZXJzICYmIG5ld1dpZHRoID4gMSkgPyBvbGRXaWR0aCAtIDEgOiBvbGRXaWR0aFxuICAgIF07XG5cbiAgICBjb25zdCBlZmZlY3RpdmVPdXRTaXplOiBbbnVtYmVyLCBudW1iZXJdID0gW1xuICAgICAgKGFsaWduQ29ybmVycyAmJiBuZXdIZWlnaHQgPiAxKSA/IG5ld0hlaWdodCAtIDEgOiBuZXdIZWlnaHQsXG4gICAgICAoYWxpZ25Db3JuZXJzICYmIG5ld1dpZHRoID4gMSkgPyBuZXdXaWR0aCAtIDEgOiBuZXdXaWR0aFxuICAgIF07XG5cbiAgICAvLyBXaGVuIGFsaWduIGNvcm5lcnMgaXMgZmFsc2UsIHdlIHJvdW5kcyB0aGUgdmFsdWUgd2l0aCBmbG9vci5cbiAgICBjb25zdCByb3VuZEJhc2UgPSBhbGlnbkNvcm5lcnMgPyAnMC41JyA6ICcwLjAnO1xuXG4gICAgbGV0IHNvdXJjZUZyYWNJbmRleFJDOiBzdHJpbmc7XG4gICAgaWYgKGhhbGZQaXhlbENlbnRlcnMpIHtcbiAgICAgIHNvdXJjZUZyYWNJbmRleFJDID1cbiAgICAgICAgICBgbWF4KCh2ZWMyKHlSQykgKyB2ZWMyKDAuNSkpICogZWZmZWN0aXZlSW5wdXRPdmVyT3V0cHV0UmF0aW9SQ2AgK1xuICAgICAgICAgIGAsIHZlYzIoMC4wKSlgO1xuICAgIH0gZWxzZSB7XG4gICAgICBzb3VyY2VGcmFjSW5kZXhSQyA9IGB2ZWMyKHlSQykgKiBlZmZlY3RpdmVJbnB1dE92ZXJPdXRwdXRSYXRpb1JDYDtcbiAgICB9XG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgIGNvbnN0IHZlYzIgZWZmZWN0aXZlSW5wdXRPdmVyT3V0cHV0UmF0aW9SQyA9IHZlYzIoXG4gICAgICAgICAgJHtlZmZlY3RpdmVJblNpemVbMF0gLyBlZmZlY3RpdmVPdXRTaXplWzBdfSxcbiAgICAgICAgICAke2VmZmVjdGl2ZUluU2l6ZVsxXSAvIGVmZmVjdGl2ZU91dFNpemVbMV19KTtcbiAgICAgIGNvbnN0IHZlYzIgaW5wdXRTaGFwZVJDID0gdmVjMigke29sZEhlaWdodH0uMCwgJHtvbGRXaWR0aH0uMCk7XG5cbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgaXZlYzQgY29vcmRzID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gICAgICAgIGludCBiID0gY29vcmRzWzBdO1xuICAgICAgICBpbnQgZCA9IGNvb3Jkc1szXTtcbiAgICAgICAgaXZlYzIgeVJDID0gY29vcmRzLnl6O1xuXG4gICAgICAgIC8vIEZyYWN0aW9uYWwgc291cmNlIGluZGV4LlxuICAgICAgICB2ZWMyIHNvdXJjZUZyYWNJbmRleFJDID0gJHtzb3VyY2VGcmFjSW5kZXhSQ307XG5cbiAgICAgICAgLy8gQ29tcHV0ZSB0aGUgY29vcmRpbmF0b3JzIG9mIG5lYXJlc3QgbmVpZ2hib3IgcG9pbnQuXG4gICAgICAgIGl2ZWMyIHNvdXJjZU5lYXJlc3RSQyA9IGl2ZWMyKFxuICAgICAgICAgIG1pbihpbnB1dFNoYXBlUkMgLSAxLjAsIGZsb29yKHNvdXJjZUZyYWNJbmRleFJDICsgJHtyb3VuZEJhc2V9KSkpO1xuICAgICAgICBmbG9hdCBuZXdWYWx1ZSA9IGdldEEoYiwgc291cmNlTmVhcmVzdFJDLngsIHNvdXJjZU5lYXJlc3RSQy55LCBkKTtcblxuICAgICAgICBzZXRPdXRwdXQobmV3VmFsdWUpO1xuICAgICAgfVxuICAgIGA7XG4gIH1cbn1cbiJdfQ==