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
export class MaxPool2DBackpropProgram {
    constructor(convInfo) {
        this.variableNames = ['dy', 'maxPos'];
        this.outputShape = convInfo.inShape;
        const strideHeight = convInfo.strideHeight;
        const strideWidth = convInfo.strideWidth;
        const dilationHeight = convInfo.dilationHeight;
        const effectiveFilterHeight = convInfo.effectiveFilterHeight;
        const effectiveFilterWidth = convInfo.effectiveFilterWidth;
        const padTop = effectiveFilterHeight - 1 - convInfo.padInfo.top;
        const padLeft = effectiveFilterWidth - 1 - convInfo.padInfo.left;
        const lastIndex = effectiveFilterHeight * effectiveFilterWidth - 1;
        this.userCode = `
      const ivec2 pads = ivec2(${padTop}, ${padLeft});

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];

        ivec2 dyRCCorner = coords.yz - pads;
        int dyRCorner = dyRCCorner.x;
        int dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${effectiveFilterHeight};
          wR += ${dilationHeight}) {
          float dyR = float(dyRCorner + wR) / ${strideHeight}.0;

          if (dyR < 0.0 || dyR >= ${convInfo.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          for (int wC = 0; wC < ${effectiveFilterWidth}; wC++) {
            float dyC = float(dyCCorner + wC) / ${strideWidth}.0;

            if (dyC < 0.0 || dyC >= ${convInfo.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(b, idyR, idyC, d);
            int maxPosValue = ${lastIndex} - int(getMaxPos(b, idyR, idyC, d));

            // Get the current value, check it against the value from the
            // position matrix.
            int curPosValue = wR * ${effectiveFilterWidth} + wC;
            float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);

            dotProd += dyValue * mask;
          }
        }
        setOutput(dotProd);
      }
    `;
    }
}
export class MaxPool3DBackpropProgram {
    constructor(convInfo) {
        this.variableNames = ['dy', 'maxPos'];
        this.outputShape = convInfo.inShape;
        const strideDepth = convInfo.strideDepth;
        const strideHeight = convInfo.strideHeight;
        const strideWidth = convInfo.strideWidth;
        const dilationDepth = convInfo.dilationDepth;
        const dilationHeight = convInfo.dilationHeight;
        const dilationWidth = convInfo.dilationWidth;
        const effectiveFilterDepth = convInfo.effectiveFilterDepth;
        const effectiveFilterHeight = convInfo.effectiveFilterHeight;
        const effectiveFilterWidth = convInfo.effectiveFilterWidth;
        const padFront = effectiveFilterDepth - 1 - convInfo.padInfo.front;
        const padTop = effectiveFilterHeight - 1 - convInfo.padInfo.top;
        const padLeft = effectiveFilterWidth - 1 - convInfo.padInfo.left;
        const lastIndex = effectiveFilterDepth * effectiveFilterHeight * effectiveFilterWidth - 1;
        this.userCode = `
      const ivec3 pads = ivec3(${padFront}, ${padTop}, ${padLeft});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyDCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, ch) with pos mask(:, :, :, d) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int wD = 0; wD < ${effectiveFilterDepth};
           wD += ${dilationDepth}) {
          float dyD = float(dyDCorner + wD) / ${strideDepth}.0;

          if (dyD < 0.0 || dyD >= ${convInfo.outDepth}.0 || fract(dyD) > 0.0) {
            continue;
          }
          int idyD = int(dyD);

          for (int wR = 0; wR < ${effectiveFilterHeight};
              wR += ${dilationHeight}) {
            float dyR = float(dyRCorner + wR) / ${strideHeight}.0;

            if (dyR < 0.0 || dyR >= ${convInfo.outHeight}.0 ||
                fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            for (int wC = 0; wC < ${effectiveFilterWidth};
                wC += ${dilationWidth}) {
              float dyC = float(dyCCorner + wC) / ${strideWidth}.0;

              if (dyC < 0.0 || dyC >= ${convInfo.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              float dyValue = getDy(batch, idyD, idyR, idyC, ch);
              int maxPosValue = ${lastIndex} -
                  int(getMaxPos(batch, idyD, idyR, idyC, ch));

              // Get the current value, check it against the value from the
              // position matrix.
              int curPosValue =
                  wD * ${effectiveFilterHeight} * ${effectiveFilterWidth} +
                  wR * ${effectiveFilterWidth} + wC;
              float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);

              dotProd += dyValue * mask;
            }
          }
        }
        setOutput(dotProd);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4X3Bvb2xfYmFja3Byb3BfZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9tYXhfcG9vbF9iYWNrcHJvcF9ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBS0gsTUFBTSxPQUFPLHdCQUF3QjtJQUtuQyxZQUFZLFFBQWlDO1FBSjdDLGtCQUFhLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFLL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQ3BDLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7UUFDM0MsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztRQUN6QyxNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDO1FBQy9DLE1BQU0scUJBQXFCLEdBQUcsUUFBUSxDQUFDLHFCQUFxQixDQUFDO1FBQzdELE1BQU0sb0JBQW9CLEdBQUcsUUFBUSxDQUFDLG9CQUFvQixDQUFDO1FBRTNELE1BQU0sTUFBTSxHQUFHLHFCQUFxQixHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztRQUNoRSxNQUFNLE9BQU8sR0FBRyxvQkFBb0IsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFFakUsTUFBTSxTQUFTLEdBQUcscUJBQXFCLEdBQUcsb0JBQW9CLEdBQUcsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxRQUFRLEdBQUc7aUNBQ2EsTUFBTSxLQUFLLE9BQU87Ozs7Ozs7Ozs7Ozs7O2dDQWNuQixxQkFBcUI7a0JBQ25DLGNBQWM7Z0RBQ2dCLFlBQVk7O29DQUV4QixRQUFRLENBQUMsU0FBUzs7Ozs7a0NBS3BCLG9CQUFvQjtrREFDSixXQUFXOztzQ0FFdkIsUUFBUSxDQUFDLFFBQVE7Ozs7Ozs7Z0NBT3ZCLFNBQVM7Ozs7cUNBSUosb0JBQW9COzs7Ozs7OztLQVFwRCxDQUFDO0lBQ0osQ0FBQztDQUNGO0FBRUQsTUFBTSxPQUFPLHdCQUF3QjtJQUtuQyxZQUFZLFFBQWlDO1FBSjdDLGtCQUFhLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFLL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQ3BDLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUM7UUFDekMsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQztRQUMzQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO1FBQ3pDLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUM7UUFDN0MsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQztRQUMvQyxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDO1FBQzdDLE1BQU0sb0JBQW9CLEdBQUcsUUFBUSxDQUFDLG9CQUFvQixDQUFDO1FBQzNELE1BQU0scUJBQXFCLEdBQUcsUUFBUSxDQUFDLHFCQUFxQixDQUFDO1FBQzdELE1BQU0sb0JBQW9CLEdBQUcsUUFBUSxDQUFDLG9CQUFvQixDQUFDO1FBRTNELE1BQU0sUUFBUSxHQUFHLG9CQUFvQixHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUNuRSxNQUFNLE1BQU0sR0FBRyxxQkFBcUIsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7UUFDaEUsTUFBTSxPQUFPLEdBQUcsb0JBQW9CLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBRWpFLE1BQU0sU0FBUyxHQUNYLG9CQUFvQixHQUFHLHFCQUFxQixHQUFHLG9CQUFvQixHQUFHLENBQUMsQ0FBQztRQUM1RSxJQUFJLENBQUMsUUFBUSxHQUFHO2lDQUNhLFFBQVEsS0FBSyxNQUFNLEtBQUssT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0NBaUJoQyxvQkFBb0I7bUJBQ2pDLGFBQWE7Z0RBQ2dCLFdBQVc7O29DQUV2QixRQUFRLENBQUMsUUFBUTs7Ozs7a0NBS25CLHFCQUFxQjtzQkFDakMsY0FBYztrREFDYyxZQUFZOztzQ0FFeEIsUUFBUSxDQUFDLFNBQVM7Ozs7OztvQ0FNcEIsb0JBQW9CO3dCQUNoQyxhQUFhO29EQUNlLFdBQVc7O3dDQUV2QixRQUFRLENBQUMsUUFBUTs7Ozs7OztrQ0FPdkIsU0FBUzs7Ozs7O3lCQU1sQixxQkFBcUIsTUFBTSxvQkFBb0I7eUJBQy9DLG9CQUFvQjs7Ozs7Ozs7O0tBU3hDLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7YmFja2VuZF91dGlsfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0IHtHUEdQVVByb2dyYW19IGZyb20gJy4vZ3BncHVfbWF0aCc7XG5cbmV4cG9ydCBjbGFzcyBNYXhQb29sMkRCYWNrcHJvcFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWydkeScsICdtYXhQb3MnXTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGNvbnZJbmZvOiBiYWNrZW5kX3V0aWwuQ29udjJESW5mbykge1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBjb252SW5mby5pblNoYXBlO1xuICAgIGNvbnN0IHN0cmlkZUhlaWdodCA9IGNvbnZJbmZvLnN0cmlkZUhlaWdodDtcbiAgICBjb25zdCBzdHJpZGVXaWR0aCA9IGNvbnZJbmZvLnN0cmlkZVdpZHRoO1xuICAgIGNvbnN0IGRpbGF0aW9uSGVpZ2h0ID0gY29udkluZm8uZGlsYXRpb25IZWlnaHQ7XG4gICAgY29uc3QgZWZmZWN0aXZlRmlsdGVySGVpZ2h0ID0gY29udkluZm8uZWZmZWN0aXZlRmlsdGVySGVpZ2h0O1xuICAgIGNvbnN0IGVmZmVjdGl2ZUZpbHRlcldpZHRoID0gY29udkluZm8uZWZmZWN0aXZlRmlsdGVyV2lkdGg7XG5cbiAgICBjb25zdCBwYWRUb3AgPSBlZmZlY3RpdmVGaWx0ZXJIZWlnaHQgLSAxIC0gY29udkluZm8ucGFkSW5mby50b3A7XG4gICAgY29uc3QgcGFkTGVmdCA9IGVmZmVjdGl2ZUZpbHRlcldpZHRoIC0gMSAtIGNvbnZJbmZvLnBhZEluZm8ubGVmdDtcblxuICAgIGNvbnN0IGxhc3RJbmRleCA9IGVmZmVjdGl2ZUZpbHRlckhlaWdodCAqIGVmZmVjdGl2ZUZpbHRlcldpZHRoIC0gMTtcbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgY29uc3QgaXZlYzIgcGFkcyA9IGl2ZWMyKCR7cGFkVG9wfSwgJHtwYWRMZWZ0fSk7XG5cbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgaXZlYzQgY29vcmRzID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gICAgICAgIGludCBiID0gY29vcmRzWzBdO1xuICAgICAgICBpbnQgZCA9IGNvb3Jkc1szXTtcblxuICAgICAgICBpdmVjMiBkeVJDQ29ybmVyID0gY29vcmRzLnl6IC0gcGFkcztcbiAgICAgICAgaW50IGR5UkNvcm5lciA9IGR5UkNDb3JuZXIueDtcbiAgICAgICAgaW50IGR5Q0Nvcm5lciA9IGR5UkNDb3JuZXIueTtcblxuICAgICAgICAvLyBDb252b2x2ZSBkeSg/LCA/LCBkKSB3aXRoIHBvcyBtYXNrKDosIDosIGQpIHRvIGdldCBkeCh4UiwgeEMsIGQpLlxuICAgICAgICAvLyA/ID0gdG8gYmUgZGV0ZXJtaW5lZC4gOiA9IGFjcm9zcyBhbGwgdmFsdWVzIGluIHRoYXQgYXhpcy5cbiAgICAgICAgZmxvYXQgZG90UHJvZCA9IDAuMDtcbiAgICAgICAgZm9yIChpbnQgd1IgPSAwOyB3UiA8ICR7ZWZmZWN0aXZlRmlsdGVySGVpZ2h0fTtcbiAgICAgICAgICB3UiArPSAke2RpbGF0aW9uSGVpZ2h0fSkge1xuICAgICAgICAgIGZsb2F0IGR5UiA9IGZsb2F0KGR5UkNvcm5lciArIHdSKSAvICR7c3RyaWRlSGVpZ2h0fS4wO1xuXG4gICAgICAgICAgaWYgKGR5UiA8IDAuMCB8fCBkeVIgPj0gJHtjb252SW5mby5vdXRIZWlnaHR9LjAgfHwgZnJhY3QoZHlSKSA+IDAuMCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGludCBpZHlSID0gaW50KGR5Uik7XG5cbiAgICAgICAgICBmb3IgKGludCB3QyA9IDA7IHdDIDwgJHtlZmZlY3RpdmVGaWx0ZXJXaWR0aH07IHdDKyspIHtcbiAgICAgICAgICAgIGZsb2F0IGR5QyA9IGZsb2F0KGR5Q0Nvcm5lciArIHdDKSAvICR7c3RyaWRlV2lkdGh9LjA7XG5cbiAgICAgICAgICAgIGlmIChkeUMgPCAwLjAgfHwgZHlDID49ICR7Y29udkluZm8ub3V0V2lkdGh9LjAgfHxcbiAgICAgICAgICAgICAgICBmcmFjdChkeUMpID4gMC4wKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW50IGlkeUMgPSBpbnQoZHlDKTtcblxuICAgICAgICAgICAgZmxvYXQgZHlWYWx1ZSA9IGdldER5KGIsIGlkeVIsIGlkeUMsIGQpO1xuICAgICAgICAgICAgaW50IG1heFBvc1ZhbHVlID0gJHtsYXN0SW5kZXh9IC0gaW50KGdldE1heFBvcyhiLCBpZHlSLCBpZHlDLCBkKSk7XG5cbiAgICAgICAgICAgIC8vIEdldCB0aGUgY3VycmVudCB2YWx1ZSwgY2hlY2sgaXQgYWdhaW5zdCB0aGUgdmFsdWUgZnJvbSB0aGVcbiAgICAgICAgICAgIC8vIHBvc2l0aW9uIG1hdHJpeC5cbiAgICAgICAgICAgIGludCBjdXJQb3NWYWx1ZSA9IHdSICogJHtlZmZlY3RpdmVGaWx0ZXJXaWR0aH0gKyB3QztcbiAgICAgICAgICAgIGZsb2F0IG1hc2sgPSBmbG9hdChtYXhQb3NWYWx1ZSA9PSBjdXJQb3NWYWx1ZSA/IDEuMCA6IDAuMCk7XG5cbiAgICAgICAgICAgIGRvdFByb2QgKz0gZHlWYWx1ZSAqIG1hc2s7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNldE91dHB1dChkb3RQcm9kKTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNYXhQb29sM0RCYWNrcHJvcFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWydkeScsICdtYXhQb3MnXTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGNvbnZJbmZvOiBiYWNrZW5kX3V0aWwuQ29udjNESW5mbykge1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBjb252SW5mby5pblNoYXBlO1xuICAgIGNvbnN0IHN0cmlkZURlcHRoID0gY29udkluZm8uc3RyaWRlRGVwdGg7XG4gICAgY29uc3Qgc3RyaWRlSGVpZ2h0ID0gY29udkluZm8uc3RyaWRlSGVpZ2h0O1xuICAgIGNvbnN0IHN0cmlkZVdpZHRoID0gY29udkluZm8uc3RyaWRlV2lkdGg7XG4gICAgY29uc3QgZGlsYXRpb25EZXB0aCA9IGNvbnZJbmZvLmRpbGF0aW9uRGVwdGg7XG4gICAgY29uc3QgZGlsYXRpb25IZWlnaHQgPSBjb252SW5mby5kaWxhdGlvbkhlaWdodDtcbiAgICBjb25zdCBkaWxhdGlvbldpZHRoID0gY29udkluZm8uZGlsYXRpb25XaWR0aDtcbiAgICBjb25zdCBlZmZlY3RpdmVGaWx0ZXJEZXB0aCA9IGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlckRlcHRoO1xuICAgIGNvbnN0IGVmZmVjdGl2ZUZpbHRlckhlaWdodCA9IGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlckhlaWdodDtcbiAgICBjb25zdCBlZmZlY3RpdmVGaWx0ZXJXaWR0aCA9IGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlcldpZHRoO1xuXG4gICAgY29uc3QgcGFkRnJvbnQgPSBlZmZlY3RpdmVGaWx0ZXJEZXB0aCAtIDEgLSBjb252SW5mby5wYWRJbmZvLmZyb250O1xuICAgIGNvbnN0IHBhZFRvcCA9IGVmZmVjdGl2ZUZpbHRlckhlaWdodCAtIDEgLSBjb252SW5mby5wYWRJbmZvLnRvcDtcbiAgICBjb25zdCBwYWRMZWZ0ID0gZWZmZWN0aXZlRmlsdGVyV2lkdGggLSAxIC0gY29udkluZm8ucGFkSW5mby5sZWZ0O1xuXG4gICAgY29uc3QgbGFzdEluZGV4ID1cbiAgICAgICAgZWZmZWN0aXZlRmlsdGVyRGVwdGggKiBlZmZlY3RpdmVGaWx0ZXJIZWlnaHQgKiBlZmZlY3RpdmVGaWx0ZXJXaWR0aCAtIDE7XG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgIGNvbnN0IGl2ZWMzIHBhZHMgPSBpdmVjMygke3BhZEZyb250fSwgJHtwYWRUb3B9LCAke3BhZExlZnR9KTtcblxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICBpdmVjNSBjb29yZHMgPSBnZXRPdXRwdXRDb29yZHMoKTtcbiAgICAgICAgaW50IGJhdGNoID0gY29vcmRzLng7XG4gICAgICAgIGludCBjaCA9IGNvb3Jkcy51O1xuXG4gICAgICAgIGl2ZWMzIGR5Q29ybmVyID0gaXZlYzMoY29vcmRzLnksIGNvb3Jkcy56LCBjb29yZHMudykgLSBwYWRzO1xuICAgICAgICBpbnQgZHlEQ29ybmVyID0gZHlDb3JuZXIueDtcbiAgICAgICAgaW50IGR5UkNvcm5lciA9IGR5Q29ybmVyLnk7XG4gICAgICAgIGludCBkeUNDb3JuZXIgPSBkeUNvcm5lci56O1xuXG4gICAgICAgIC8vIENvbnZvbHZlIGR5KD8sID8sID8sIGNoKSB3aXRoIHBvcyBtYXNrKDosIDosIDosIGQpIHRvIGdldFxuICAgICAgICAvLyBkeCh4RCwgeFIsIHhDLCBjaCkuXG4gICAgICAgIC8vID8gPSB0byBiZSBkZXRlcm1pbmVkLiA6ID0gYWNyb3NzIGFsbCB2YWx1ZXMgaW4gdGhhdCBheGlzLlxuICAgICAgICBmbG9hdCBkb3RQcm9kID0gMC4wO1xuXG4gICAgICAgIGZvciAoaW50IHdEID0gMDsgd0QgPCAke2VmZmVjdGl2ZUZpbHRlckRlcHRofTtcbiAgICAgICAgICAgd0QgKz0gJHtkaWxhdGlvbkRlcHRofSkge1xuICAgICAgICAgIGZsb2F0IGR5RCA9IGZsb2F0KGR5RENvcm5lciArIHdEKSAvICR7c3RyaWRlRGVwdGh9LjA7XG5cbiAgICAgICAgICBpZiAoZHlEIDwgMC4wIHx8IGR5RCA+PSAke2NvbnZJbmZvLm91dERlcHRofS4wIHx8IGZyYWN0KGR5RCkgPiAwLjApIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbnQgaWR5RCA9IGludChkeUQpO1xuXG4gICAgICAgICAgZm9yIChpbnQgd1IgPSAwOyB3UiA8ICR7ZWZmZWN0aXZlRmlsdGVySGVpZ2h0fTtcbiAgICAgICAgICAgICAgd1IgKz0gJHtkaWxhdGlvbkhlaWdodH0pIHtcbiAgICAgICAgICAgIGZsb2F0IGR5UiA9IGZsb2F0KGR5UkNvcm5lciArIHdSKSAvICR7c3RyaWRlSGVpZ2h0fS4wO1xuXG4gICAgICAgICAgICBpZiAoZHlSIDwgMC4wIHx8IGR5UiA+PSAke2NvbnZJbmZvLm91dEhlaWdodH0uMCB8fFxuICAgICAgICAgICAgICAgIGZyYWN0KGR5UikgPiAwLjApIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnQgaWR5UiA9IGludChkeVIpO1xuXG4gICAgICAgICAgICBmb3IgKGludCB3QyA9IDA7IHdDIDwgJHtlZmZlY3RpdmVGaWx0ZXJXaWR0aH07XG4gICAgICAgICAgICAgICAgd0MgKz0gJHtkaWxhdGlvbldpZHRofSkge1xuICAgICAgICAgICAgICBmbG9hdCBkeUMgPSBmbG9hdChkeUNDb3JuZXIgKyB3QykgLyAke3N0cmlkZVdpZHRofS4wO1xuXG4gICAgICAgICAgICAgIGlmIChkeUMgPCAwLjAgfHwgZHlDID49ICR7Y29udkluZm8ub3V0V2lkdGh9LjAgfHxcbiAgICAgICAgICAgICAgICAgIGZyYWN0KGR5QykgPiAwLjApIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpbnQgaWR5QyA9IGludChkeUMpO1xuXG4gICAgICAgICAgICAgIGZsb2F0IGR5VmFsdWUgPSBnZXREeShiYXRjaCwgaWR5RCwgaWR5UiwgaWR5QywgY2gpO1xuICAgICAgICAgICAgICBpbnQgbWF4UG9zVmFsdWUgPSAke2xhc3RJbmRleH0gLVxuICAgICAgICAgICAgICAgICAgaW50KGdldE1heFBvcyhiYXRjaCwgaWR5RCwgaWR5UiwgaWR5QywgY2gpKTtcblxuICAgICAgICAgICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgdmFsdWUsIGNoZWNrIGl0IGFnYWluc3QgdGhlIHZhbHVlIGZyb20gdGhlXG4gICAgICAgICAgICAgIC8vIHBvc2l0aW9uIG1hdHJpeC5cbiAgICAgICAgICAgICAgaW50IGN1clBvc1ZhbHVlID1cbiAgICAgICAgICAgICAgICAgIHdEICogJHtlZmZlY3RpdmVGaWx0ZXJIZWlnaHR9ICogJHtlZmZlY3RpdmVGaWx0ZXJXaWR0aH0gK1xuICAgICAgICAgICAgICAgICAgd1IgKiAke2VmZmVjdGl2ZUZpbHRlcldpZHRofSArIHdDO1xuICAgICAgICAgICAgICBmbG9hdCBtYXNrID0gZmxvYXQobWF4UG9zVmFsdWUgPT0gY3VyUG9zVmFsdWUgPyAxLjAgOiAwLjApO1xuXG4gICAgICAgICAgICAgIGRvdFByb2QgKz0gZHlWYWx1ZSAqIG1hc2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNldE91dHB1dChkb3RQcm9kKTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG4iXX0=