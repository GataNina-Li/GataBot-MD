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
export class ResizeNearestNeigborBackpropProgram {
    constructor(dyShape, inputShape, alignCorners) {
        this.variableNames = ['dy'];
        this.outputShape = [];
        this.outputShape = inputShape;
        const [, xHeight, xWidth,] = inputShape;
        const [, yHeight, yWidth] = dyShape;
        // In the backwards pass, we want to find the pixels that were generated for
        // each pixel in the input image the forward pass and add the corresponding
        // coefficient from dy to the gradient (with some interpolation).
        const effectiveXSize = [
            (alignCorners && yHeight > 1) ? xHeight - 1 : xHeight,
            (alignCorners && yWidth > 1) ? xWidth - 1 : xWidth
        ];
        const effectiveYSize = [
            (alignCorners && yHeight > 1) ? yHeight - 1 : yHeight,
            (alignCorners && yWidth > 1) ? yWidth - 1 : yWidth
        ];
        const heightScale = effectiveXSize[0] / effectiveYSize[0];
        const widthScale = effectiveXSize[1] / effectiveYSize[1];
        const invHeightScale = 1 / heightScale;
        const invWidthScale = 1 / widthScale;
        // This defines the size of the window of values around a particular
        // index in dy that we want to search for contributions to dx.
        const winHeight = (Math.ceil(invHeightScale) * 2) + 2;
        const winWidth = (Math.ceil(invWidthScale) * 2) + 2;
        this.userCode = `
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        int r = coords[1];
        int c = coords[2];

        float accumulator = 0.0;

        const float heightScale = float(${heightScale});
        const float widthScale = float(${widthScale});

        const float invHeightScale = float(${invHeightScale});
        const float invWidthScale = float(${invWidthScale});

        const int winHeight = int(${winHeight});
        const int winWidth = int(${winWidth});

        // Compute bounds for where in dy we will look
        float startRLerp = floor(float(r) * invHeightScale);
        int startDyR = int(floor(startRLerp - float(winHeight / 2)));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(floor(startCLerp - float(winWidth / 2)));

        // Loop over dy
        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {
          int dyR = dyROffset + startDyR;

          // Guard against the window exceeding the bounds of dy
          if (dyR < 0 || dyR >= ${yHeight}) {
            continue;
          }

          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {
            int dyC = dyCOffset + startDyC;

            // Guard against the window exceeding the bounds of dy
            if (dyC < 0 || dyC >= ${yWidth}) {
              continue;
            }

            float sourceFracRow =
              float(${effectiveXSize[0]}) *
                (float(dyR) / float(${effectiveYSize[0]}));

            float sourceFracCol =
                float(${effectiveXSize[1]}) *
                  (float(dyC) / float(${effectiveYSize[1]}));

            int sourceNearestRow = int(min(
                float(int(${xHeight}) - 1),
                ${alignCorners} ? float(round(sourceFracRow)) :
                                  float(floor(sourceFracRow))));

            int sourceNearestCol = int(min(
                float(int(${xWidth}) - 1),
                ${alignCorners} ? float(round(sourceFracCol)) :
                                  float(floor(sourceFracCol))));

            if (r == sourceNearestRow && c == sourceNearestCol) {
              accumulator += getDy(b, dyR, dyC, d);
            }
          }
        }
        // End loop over dy

        setOutput(accumulator);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplX25lYXJlc3RfbmVpZ2hib3JfYmFja3Byb3BfZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9yZXNpemVfbmVhcmVzdF9uZWlnaGJvcl9iYWNrcHJvcF9ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBSUgsTUFBTSxPQUFPLG1DQUFtQztJQUs5QyxZQUNJLE9BQXlDLEVBQ3pDLFVBQTRDLEVBQUUsWUFBcUI7UUFOdkUsa0JBQWEsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLGdCQUFXLEdBQWEsRUFBRSxDQUFDO1FBTXpCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUcsR0FBRyxVQUFVLENBQUM7UUFDekMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQztRQUVwQyw0RUFBNEU7UUFDNUUsMkVBQTJFO1FBQzNFLGlFQUFpRTtRQUVqRSxNQUFNLGNBQWMsR0FBcUI7WUFDdkMsQ0FBQyxZQUFZLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPO1lBQ3JELENBQUMsWUFBWSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTTtTQUNuRCxDQUFDO1FBRUYsTUFBTSxjQUFjLEdBQXFCO1lBQ3ZDLENBQUMsWUFBWSxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztZQUNyRCxDQUFDLFlBQVksSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU07U0FDbkQsQ0FBQztRQUVGLE1BQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUQsTUFBTSxVQUFVLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV6RCxNQUFNLGNBQWMsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDO1FBQ3ZDLE1BQU0sYUFBYSxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUM7UUFFckMsb0VBQW9FO1FBQ3BFLDhEQUE4RDtRQUM5RCxNQUFNLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFcEQsSUFBSSxDQUFDLFFBQVEsR0FBRzs7Ozs7Ozs7OzswQ0FVc0IsV0FBVzt5Q0FDWixVQUFVOzs2Q0FFTixjQUFjOzRDQUNmLGFBQWE7O29DQUVyQixTQUFTO21DQUNWLFFBQVE7Ozs7Ozs7Ozs7Ozs7O2tDQWNULE9BQU87Ozs7Ozs7O29DQVFMLE1BQU07Ozs7O3NCQUtwQixjQUFjLENBQUMsQ0FBQyxDQUFDO3NDQUNELGNBQWMsQ0FBQyxDQUFDLENBQUM7Ozt3QkFHL0IsY0FBYyxDQUFDLENBQUMsQ0FBQzt3Q0FDRCxjQUFjLENBQUMsQ0FBQyxDQUFDOzs7NEJBRzdCLE9BQU87a0JBQ2pCLFlBQVk7Ozs7NEJBSUYsTUFBTTtrQkFDaEIsWUFBWTs7Ozs7Ozs7Ozs7O0tBWXpCLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuXG5leHBvcnQgY2xhc3MgUmVzaXplTmVhcmVzdE5laWdib3JCYWNrcHJvcFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWydkeSddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW10gPSBbXTtcbiAgdXNlckNvZGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIGR5U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdLFxuICAgICAgaW5wdXRTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sIGFsaWduQ29ybmVyczogYm9vbGVhbikge1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBpbnB1dFNoYXBlO1xuICAgIGNvbnN0IFssIHhIZWlnaHQsIHhXaWR0aCwgXSA9IGlucHV0U2hhcGU7XG4gICAgY29uc3QgWywgeUhlaWdodCwgeVdpZHRoXSA9IGR5U2hhcGU7XG5cbiAgICAvLyBJbiB0aGUgYmFja3dhcmRzIHBhc3MsIHdlIHdhbnQgdG8gZmluZCB0aGUgcGl4ZWxzIHRoYXQgd2VyZSBnZW5lcmF0ZWQgZm9yXG4gICAgLy8gZWFjaCBwaXhlbCBpbiB0aGUgaW5wdXQgaW1hZ2UgdGhlIGZvcndhcmQgcGFzcyBhbmQgYWRkIHRoZSBjb3JyZXNwb25kaW5nXG4gICAgLy8gY29lZmZpY2llbnQgZnJvbSBkeSB0byB0aGUgZ3JhZGllbnQgKHdpdGggc29tZSBpbnRlcnBvbGF0aW9uKS5cblxuICAgIGNvbnN0IGVmZmVjdGl2ZVhTaXplOiBbbnVtYmVyLCBudW1iZXJdID0gW1xuICAgICAgKGFsaWduQ29ybmVycyAmJiB5SGVpZ2h0ID4gMSkgPyB4SGVpZ2h0IC0gMSA6IHhIZWlnaHQsXG4gICAgICAoYWxpZ25Db3JuZXJzICYmIHlXaWR0aCA+IDEpID8geFdpZHRoIC0gMSA6IHhXaWR0aFxuICAgIF07XG5cbiAgICBjb25zdCBlZmZlY3RpdmVZU2l6ZTogW251bWJlciwgbnVtYmVyXSA9IFtcbiAgICAgIChhbGlnbkNvcm5lcnMgJiYgeUhlaWdodCA+IDEpID8geUhlaWdodCAtIDEgOiB5SGVpZ2h0LFxuICAgICAgKGFsaWduQ29ybmVycyAmJiB5V2lkdGggPiAxKSA/IHlXaWR0aCAtIDEgOiB5V2lkdGhcbiAgICBdO1xuXG4gICAgY29uc3QgaGVpZ2h0U2NhbGUgPSBlZmZlY3RpdmVYU2l6ZVswXSAvIGVmZmVjdGl2ZVlTaXplWzBdO1xuICAgIGNvbnN0IHdpZHRoU2NhbGUgPSBlZmZlY3RpdmVYU2l6ZVsxXSAvIGVmZmVjdGl2ZVlTaXplWzFdO1xuXG4gICAgY29uc3QgaW52SGVpZ2h0U2NhbGUgPSAxIC8gaGVpZ2h0U2NhbGU7XG4gICAgY29uc3QgaW52V2lkdGhTY2FsZSA9IDEgLyB3aWR0aFNjYWxlO1xuXG4gICAgLy8gVGhpcyBkZWZpbmVzIHRoZSBzaXplIG9mIHRoZSB3aW5kb3cgb2YgdmFsdWVzIGFyb3VuZCBhIHBhcnRpY3VsYXJcbiAgICAvLyBpbmRleCBpbiBkeSB0aGF0IHdlIHdhbnQgdG8gc2VhcmNoIGZvciBjb250cmlidXRpb25zIHRvIGR4LlxuICAgIGNvbnN0IHdpbkhlaWdodCA9IChNYXRoLmNlaWwoaW52SGVpZ2h0U2NhbGUpICogMikgKyAyO1xuICAgIGNvbnN0IHdpbldpZHRoID0gKE1hdGguY2VpbChpbnZXaWR0aFNjYWxlKSAqIDIpICsgMjtcblxuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIGl2ZWM0IGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICBpbnQgYiA9IGNvb3Jkc1swXTtcbiAgICAgICAgaW50IGQgPSBjb29yZHNbM107XG4gICAgICAgIGludCByID0gY29vcmRzWzFdO1xuICAgICAgICBpbnQgYyA9IGNvb3Jkc1syXTtcblxuICAgICAgICBmbG9hdCBhY2N1bXVsYXRvciA9IDAuMDtcblxuICAgICAgICBjb25zdCBmbG9hdCBoZWlnaHRTY2FsZSA9IGZsb2F0KCR7aGVpZ2h0U2NhbGV9KTtcbiAgICAgICAgY29uc3QgZmxvYXQgd2lkdGhTY2FsZSA9IGZsb2F0KCR7d2lkdGhTY2FsZX0pO1xuXG4gICAgICAgIGNvbnN0IGZsb2F0IGludkhlaWdodFNjYWxlID0gZmxvYXQoJHtpbnZIZWlnaHRTY2FsZX0pO1xuICAgICAgICBjb25zdCBmbG9hdCBpbnZXaWR0aFNjYWxlID0gZmxvYXQoJHtpbnZXaWR0aFNjYWxlfSk7XG5cbiAgICAgICAgY29uc3QgaW50IHdpbkhlaWdodCA9IGludCgke3dpbkhlaWdodH0pO1xuICAgICAgICBjb25zdCBpbnQgd2luV2lkdGggPSBpbnQoJHt3aW5XaWR0aH0pO1xuXG4gICAgICAgIC8vIENvbXB1dGUgYm91bmRzIGZvciB3aGVyZSBpbiBkeSB3ZSB3aWxsIGxvb2tcbiAgICAgICAgZmxvYXQgc3RhcnRSTGVycCA9IGZsb29yKGZsb2F0KHIpICogaW52SGVpZ2h0U2NhbGUpO1xuICAgICAgICBpbnQgc3RhcnREeVIgPSBpbnQoZmxvb3Ioc3RhcnRSTGVycCAtIGZsb2F0KHdpbkhlaWdodCAvIDIpKSk7XG5cbiAgICAgICAgZmxvYXQgc3RhcnRDTGVycCA9IGZsb29yKGZsb2F0KGMpICogaW52V2lkdGhTY2FsZSk7XG4gICAgICAgIGludCBzdGFydER5QyA9IGludChmbG9vcihzdGFydENMZXJwIC0gZmxvYXQod2luV2lkdGggLyAyKSkpO1xuXG4gICAgICAgIC8vIExvb3Agb3ZlciBkeVxuICAgICAgICBmb3IgKGludCBkeVJPZmZzZXQgPSAwOyBkeVJPZmZzZXQgPCB3aW5IZWlnaHQ7IGR5Uk9mZnNldCsrKSB7XG4gICAgICAgICAgaW50IGR5UiA9IGR5Uk9mZnNldCArIHN0YXJ0RHlSO1xuXG4gICAgICAgICAgLy8gR3VhcmQgYWdhaW5zdCB0aGUgd2luZG93IGV4Y2VlZGluZyB0aGUgYm91bmRzIG9mIGR5XG4gICAgICAgICAgaWYgKGR5UiA8IDAgfHwgZHlSID49ICR7eUhlaWdodH0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAoaW50IGR5Q09mZnNldCA9IDA7IGR5Q09mZnNldCA8IHdpbldpZHRoOyBkeUNPZmZzZXQrKykge1xuICAgICAgICAgICAgaW50IGR5QyA9IGR5Q09mZnNldCArIHN0YXJ0RHlDO1xuXG4gICAgICAgICAgICAvLyBHdWFyZCBhZ2FpbnN0IHRoZSB3aW5kb3cgZXhjZWVkaW5nIHRoZSBib3VuZHMgb2YgZHlcbiAgICAgICAgICAgIGlmIChkeUMgPCAwIHx8IGR5QyA+PSAke3lXaWR0aH0pIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZsb2F0IHNvdXJjZUZyYWNSb3cgPVxuICAgICAgICAgICAgICBmbG9hdCgke2VmZmVjdGl2ZVhTaXplWzBdfSkgKlxuICAgICAgICAgICAgICAgIChmbG9hdChkeVIpIC8gZmxvYXQoJHtlZmZlY3RpdmVZU2l6ZVswXX0pKTtcblxuICAgICAgICAgICAgZmxvYXQgc291cmNlRnJhY0NvbCA9XG4gICAgICAgICAgICAgICAgZmxvYXQoJHtlZmZlY3RpdmVYU2l6ZVsxXX0pICpcbiAgICAgICAgICAgICAgICAgIChmbG9hdChkeUMpIC8gZmxvYXQoJHtlZmZlY3RpdmVZU2l6ZVsxXX0pKTtcblxuICAgICAgICAgICAgaW50IHNvdXJjZU5lYXJlc3RSb3cgPSBpbnQobWluKFxuICAgICAgICAgICAgICAgIGZsb2F0KGludCgke3hIZWlnaHR9KSAtIDEpLFxuICAgICAgICAgICAgICAgICR7YWxpZ25Db3JuZXJzfSA/IGZsb2F0KHJvdW5kKHNvdXJjZUZyYWNSb3cpKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxvYXQoZmxvb3Ioc291cmNlRnJhY1JvdykpKSk7XG5cbiAgICAgICAgICAgIGludCBzb3VyY2VOZWFyZXN0Q29sID0gaW50KG1pbihcbiAgICAgICAgICAgICAgICBmbG9hdChpbnQoJHt4V2lkdGh9KSAtIDEpLFxuICAgICAgICAgICAgICAgICR7YWxpZ25Db3JuZXJzfSA/IGZsb2F0KHJvdW5kKHNvdXJjZUZyYWNDb2wpKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxvYXQoZmxvb3Ioc291cmNlRnJhY0NvbCkpKSk7XG5cbiAgICAgICAgICAgIGlmIChyID09IHNvdXJjZU5lYXJlc3RSb3cgJiYgYyA9PSBzb3VyY2VOZWFyZXN0Q29sKSB7XG4gICAgICAgICAgICAgIGFjY3VtdWxhdG9yICs9IGdldER5KGIsIGR5UiwgZHlDLCBkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRW5kIGxvb3Agb3ZlciBkeVxuXG4gICAgICAgIHNldE91dHB1dChhY2N1bXVsYXRvcik7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuIl19