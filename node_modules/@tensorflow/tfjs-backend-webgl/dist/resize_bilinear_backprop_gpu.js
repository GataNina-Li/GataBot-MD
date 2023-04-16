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
export class ResizeBilinearBackpropProgram {
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
        int startDyR = int(startRLerp - float(winHeight / 2));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(startCLerp - float(winWidth / 2));

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

            float dxR = float(dyR) * heightScale;
            int topDxRIndex = int(floor(dxR));
            int bottomDxRIndex = int(min(ceil(dxR), ${xHeight - 1}.0));
            float dxRLerp = dxR - float(topDxRIndex);
            float inverseDxRLerp = 1.0 - dxRLerp;

            float dxC = float(dyC) * widthScale;
            int leftDxCIndex = int(floor(dxC));
            int rightDxCIndex = int(min(ceil(dxC), ${xWidth - 1}.0));
            float dxCLerp = dxC - float(leftDxCIndex);
            float inverseDxCLerp = 1.0 - dxCLerp;

            if (r == topDxRIndex && c == leftDxCIndex) {
              // topLeft
              accumulator +=
                getDy(b, dyR, dyC, d) * inverseDxRLerp * inverseDxCLerp;
            }

            if (r == topDxRIndex && c == rightDxCIndex) {
              // topRight
              accumulator += getDy(b, dyR, dyC, d) * inverseDxRLerp * dxCLerp;
            }

            if (r == bottomDxRIndex && c == leftDxCIndex) {
              // bottomLeft
              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * inverseDxCLerp;
            }

            if (r == bottomDxRIndex && c == rightDxCIndex) {
              // bottomRight
              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * dxCLerp;
            }
          }
        }
        // End loop over dy

        setOutput(accumulator);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplX2JpbGluZWFyX2JhY2twcm9wX2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvcmVzaXplX2JpbGluZWFyX2JhY2twcm9wX2dwdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFJSCxNQUFNLE9BQU8sNkJBQTZCO0lBS3hDLFlBQ0ksT0FBeUMsRUFDekMsVUFBNEMsRUFBRSxZQUFxQjtRQU52RSxrQkFBYSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsZ0JBQVcsR0FBYSxFQUFFLENBQUM7UUFNekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7UUFDOUIsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRyxHQUFHLFVBQVUsQ0FBQztRQUN6QyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBRXBDLDRFQUE0RTtRQUM1RSwyRUFBMkU7UUFDM0UsaUVBQWlFO1FBRWpFLE1BQU0sY0FBYyxHQUFxQjtZQUN2QyxDQUFDLFlBQVksSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU87WUFDckQsQ0FBQyxZQUFZLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNO1NBQ25ELENBQUM7UUFFRixNQUFNLGNBQWMsR0FBcUI7WUFDdkMsQ0FBQyxZQUFZLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPO1lBQ3JELENBQUMsWUFBWSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTTtTQUNuRCxDQUFDO1FBRUYsTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRCxNQUFNLFVBQVUsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXpELE1BQU0sY0FBYyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUM7UUFDdkMsTUFBTSxhQUFhLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUVyQyxvRUFBb0U7UUFDcEUsOERBQThEO1FBQzlELE1BQU0sU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVwRCxJQUFJLENBQUMsUUFBUSxHQUFHOzs7Ozs7Ozs7OzBDQVVzQixXQUFXO3lDQUNaLFVBQVU7OzZDQUVOLGNBQWM7NENBQ2YsYUFBYTs7b0NBRXJCLFNBQVM7bUNBQ1YsUUFBUTs7Ozs7Ozs7Ozs7Ozs7a0NBY1QsT0FBTzs7Ozs7Ozs7b0NBUUwsTUFBTTs7Ozs7O3NEQU1ZLE9BQU8sR0FBRyxDQUFDOzs7Ozs7cURBTVosTUFBTSxHQUFHLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQThCMUQsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtHUEdQVVByb2dyYW19IGZyb20gJy4vZ3BncHVfbWF0aCc7XG5cbmV4cG9ydCBjbGFzcyBSZXNpemVCaWxpbmVhckJhY2twcm9wUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ2R5J107XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXSA9IFtdO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgZHlTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sXG4gICAgICBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSwgYWxpZ25Db3JuZXJzOiBib29sZWFuKSB7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IGlucHV0U2hhcGU7XG4gICAgY29uc3QgWywgeEhlaWdodCwgeFdpZHRoLCBdID0gaW5wdXRTaGFwZTtcbiAgICBjb25zdCBbLCB5SGVpZ2h0LCB5V2lkdGhdID0gZHlTaGFwZTtcblxuICAgIC8vIEluIHRoZSBiYWNrd2FyZHMgcGFzcywgd2Ugd2FudCB0byBmaW5kIHRoZSBwaXhlbHMgdGhhdCB3ZXJlIGdlbmVyYXRlZCBmb3JcbiAgICAvLyBlYWNoIHBpeGVsIGluIHRoZSBpbnB1dCBpbWFnZSB0aGUgZm9yd2FyZCBwYXNzIGFuZCBhZGQgdGhlIGNvcnJlc3BvbmRpbmdcbiAgICAvLyBjb2VmZmljaWVudCBmcm9tIGR5IHRvIHRoZSBncmFkaWVudCAod2l0aCBzb21lIGludGVycG9sYXRpb24pLlxuXG4gICAgY29uc3QgZWZmZWN0aXZlWFNpemU6IFtudW1iZXIsIG51bWJlcl0gPSBbXG4gICAgICAoYWxpZ25Db3JuZXJzICYmIHlIZWlnaHQgPiAxKSA/IHhIZWlnaHQgLSAxIDogeEhlaWdodCxcbiAgICAgIChhbGlnbkNvcm5lcnMgJiYgeVdpZHRoID4gMSkgPyB4V2lkdGggLSAxIDogeFdpZHRoXG4gICAgXTtcblxuICAgIGNvbnN0IGVmZmVjdGl2ZVlTaXplOiBbbnVtYmVyLCBudW1iZXJdID0gW1xuICAgICAgKGFsaWduQ29ybmVycyAmJiB5SGVpZ2h0ID4gMSkgPyB5SGVpZ2h0IC0gMSA6IHlIZWlnaHQsXG4gICAgICAoYWxpZ25Db3JuZXJzICYmIHlXaWR0aCA+IDEpID8geVdpZHRoIC0gMSA6IHlXaWR0aFxuICAgIF07XG5cbiAgICBjb25zdCBoZWlnaHRTY2FsZSA9IGVmZmVjdGl2ZVhTaXplWzBdIC8gZWZmZWN0aXZlWVNpemVbMF07XG4gICAgY29uc3Qgd2lkdGhTY2FsZSA9IGVmZmVjdGl2ZVhTaXplWzFdIC8gZWZmZWN0aXZlWVNpemVbMV07XG5cbiAgICBjb25zdCBpbnZIZWlnaHRTY2FsZSA9IDEgLyBoZWlnaHRTY2FsZTtcbiAgICBjb25zdCBpbnZXaWR0aFNjYWxlID0gMSAvIHdpZHRoU2NhbGU7XG5cbiAgICAvLyBUaGlzIGRlZmluZXMgdGhlIHNpemUgb2YgdGhlIHdpbmRvdyBvZiB2YWx1ZXMgYXJvdW5kIGEgcGFydGljdWxhclxuICAgIC8vIGluZGV4IGluIGR5IHRoYXQgd2Ugd2FudCB0byBzZWFyY2ggZm9yIGNvbnRyaWJ1dGlvbnMgdG8gZHguXG4gICAgY29uc3Qgd2luSGVpZ2h0ID0gKE1hdGguY2VpbChpbnZIZWlnaHRTY2FsZSkgKiAyKSArIDI7XG4gICAgY29uc3Qgd2luV2lkdGggPSAoTWF0aC5jZWlsKGludldpZHRoU2NhbGUpICogMikgKyAyO1xuXG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgaXZlYzQgY29vcmRzID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gICAgICAgIGludCBiID0gY29vcmRzWzBdO1xuICAgICAgICBpbnQgZCA9IGNvb3Jkc1szXTtcbiAgICAgICAgaW50IHIgPSBjb29yZHNbMV07XG4gICAgICAgIGludCBjID0gY29vcmRzWzJdO1xuXG4gICAgICAgIGZsb2F0IGFjY3VtdWxhdG9yID0gMC4wO1xuXG4gICAgICAgIGNvbnN0IGZsb2F0IGhlaWdodFNjYWxlID0gZmxvYXQoJHtoZWlnaHRTY2FsZX0pO1xuICAgICAgICBjb25zdCBmbG9hdCB3aWR0aFNjYWxlID0gZmxvYXQoJHt3aWR0aFNjYWxlfSk7XG5cbiAgICAgICAgY29uc3QgZmxvYXQgaW52SGVpZ2h0U2NhbGUgPSBmbG9hdCgke2ludkhlaWdodFNjYWxlfSk7XG4gICAgICAgIGNvbnN0IGZsb2F0IGludldpZHRoU2NhbGUgPSBmbG9hdCgke2ludldpZHRoU2NhbGV9KTtcblxuICAgICAgICBjb25zdCBpbnQgd2luSGVpZ2h0ID0gaW50KCR7d2luSGVpZ2h0fSk7XG4gICAgICAgIGNvbnN0IGludCB3aW5XaWR0aCA9IGludCgke3dpbldpZHRofSk7XG5cbiAgICAgICAgLy8gQ29tcHV0ZSBib3VuZHMgZm9yIHdoZXJlIGluIGR5IHdlIHdpbGwgbG9va1xuICAgICAgICBmbG9hdCBzdGFydFJMZXJwID0gZmxvb3IoZmxvYXQocikgKiBpbnZIZWlnaHRTY2FsZSk7XG4gICAgICAgIGludCBzdGFydER5UiA9IGludChzdGFydFJMZXJwIC0gZmxvYXQod2luSGVpZ2h0IC8gMikpO1xuXG4gICAgICAgIGZsb2F0IHN0YXJ0Q0xlcnAgPSBmbG9vcihmbG9hdChjKSAqIGludldpZHRoU2NhbGUpO1xuICAgICAgICBpbnQgc3RhcnREeUMgPSBpbnQoc3RhcnRDTGVycCAtIGZsb2F0KHdpbldpZHRoIC8gMikpO1xuXG4gICAgICAgIC8vIExvb3Agb3ZlciBkeVxuICAgICAgICBmb3IgKGludCBkeVJPZmZzZXQgPSAwOyBkeVJPZmZzZXQgPCB3aW5IZWlnaHQ7IGR5Uk9mZnNldCsrKSB7XG4gICAgICAgICAgaW50IGR5UiA9IGR5Uk9mZnNldCArIHN0YXJ0RHlSO1xuXG4gICAgICAgICAgLy8gR3VhcmQgYWdhaW5zdCB0aGUgd2luZG93IGV4Y2VlZGluZyB0aGUgYm91bmRzIG9mIGR5XG4gICAgICAgICAgaWYgKGR5UiA8IDAgfHwgZHlSID49ICR7eUhlaWdodH0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAoaW50IGR5Q09mZnNldCA9IDA7IGR5Q09mZnNldCA8IHdpbldpZHRoOyBkeUNPZmZzZXQrKykge1xuICAgICAgICAgICAgaW50IGR5QyA9IGR5Q09mZnNldCArIHN0YXJ0RHlDO1xuXG4gICAgICAgICAgICAvLyBHdWFyZCBhZ2FpbnN0IHRoZSB3aW5kb3cgZXhjZWVkaW5nIHRoZSBib3VuZHMgb2YgZHlcbiAgICAgICAgICAgIGlmIChkeUMgPCAwIHx8IGR5QyA+PSAke3lXaWR0aH0pIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZsb2F0IGR4UiA9IGZsb2F0KGR5UikgKiBoZWlnaHRTY2FsZTtcbiAgICAgICAgICAgIGludCB0b3BEeFJJbmRleCA9IGludChmbG9vcihkeFIpKTtcbiAgICAgICAgICAgIGludCBib3R0b21EeFJJbmRleCA9IGludChtaW4oY2VpbChkeFIpLCAke3hIZWlnaHQgLSAxfS4wKSk7XG4gICAgICAgICAgICBmbG9hdCBkeFJMZXJwID0gZHhSIC0gZmxvYXQodG9wRHhSSW5kZXgpO1xuICAgICAgICAgICAgZmxvYXQgaW52ZXJzZUR4UkxlcnAgPSAxLjAgLSBkeFJMZXJwO1xuXG4gICAgICAgICAgICBmbG9hdCBkeEMgPSBmbG9hdChkeUMpICogd2lkdGhTY2FsZTtcbiAgICAgICAgICAgIGludCBsZWZ0RHhDSW5kZXggPSBpbnQoZmxvb3IoZHhDKSk7XG4gICAgICAgICAgICBpbnQgcmlnaHREeENJbmRleCA9IGludChtaW4oY2VpbChkeEMpLCAke3hXaWR0aCAtIDF9LjApKTtcbiAgICAgICAgICAgIGZsb2F0IGR4Q0xlcnAgPSBkeEMgLSBmbG9hdChsZWZ0RHhDSW5kZXgpO1xuICAgICAgICAgICAgZmxvYXQgaW52ZXJzZUR4Q0xlcnAgPSAxLjAgLSBkeENMZXJwO1xuXG4gICAgICAgICAgICBpZiAociA9PSB0b3BEeFJJbmRleCAmJiBjID09IGxlZnREeENJbmRleCkge1xuICAgICAgICAgICAgICAvLyB0b3BMZWZ0XG4gICAgICAgICAgICAgIGFjY3VtdWxhdG9yICs9XG4gICAgICAgICAgICAgICAgZ2V0RHkoYiwgZHlSLCBkeUMsIGQpICogaW52ZXJzZUR4UkxlcnAgKiBpbnZlcnNlRHhDTGVycDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHIgPT0gdG9wRHhSSW5kZXggJiYgYyA9PSByaWdodER4Q0luZGV4KSB7XG4gICAgICAgICAgICAgIC8vIHRvcFJpZ2h0XG4gICAgICAgICAgICAgIGFjY3VtdWxhdG9yICs9IGdldER5KGIsIGR5UiwgZHlDLCBkKSAqIGludmVyc2VEeFJMZXJwICogZHhDTGVycDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHIgPT0gYm90dG9tRHhSSW5kZXggJiYgYyA9PSBsZWZ0RHhDSW5kZXgpIHtcbiAgICAgICAgICAgICAgLy8gYm90dG9tTGVmdFxuICAgICAgICAgICAgICBhY2N1bXVsYXRvciArPSBnZXREeShiLCBkeVIsIGR5QywgZCkgKiBkeFJMZXJwICogaW52ZXJzZUR4Q0xlcnA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyID09IGJvdHRvbUR4UkluZGV4ICYmIGMgPT0gcmlnaHREeENJbmRleCkge1xuICAgICAgICAgICAgICAvLyBib3R0b21SaWdodFxuICAgICAgICAgICAgICBhY2N1bXVsYXRvciArPSBnZXREeShiLCBkeVIsIGR5QywgZCkgKiBkeFJMZXJwICogZHhDTGVycDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRW5kIGxvb3Agb3ZlciBkeVxuXG4gICAgICAgIHNldE91dHB1dChhY2N1bXVsYXRvcik7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuIl19