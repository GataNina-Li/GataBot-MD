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
export class AvgPool2DBackpropProgram {
    constructor(convInfo) {
        this.variableNames = ['dy'];
        this.outputShape = convInfo.inShape;
        const filterHeight = convInfo.filterHeight;
        const filterWidth = convInfo.filterWidth;
        const strideHeight = convInfo.strideHeight;
        const strideWidth = convInfo.strideWidth;
        const dilationHeight = convInfo.dilationHeight;
        const dilationWidth = convInfo.dilationWidth;
        const effectiveFilterHeight = convInfo.effectiveFilterHeight;
        const effectiveFilterWidth = convInfo.effectiveFilterWidth;
        const padTop = effectiveFilterHeight - 1 - convInfo.padInfo.top;
        const padLeft = effectiveFilterWidth - 1 - convInfo.padInfo.left;
        const avgMultiplier = 1 / (filterHeight * filterWidth);
        this.userCode = `
      const ivec2 pads = ivec2(${padTop}, ${padLeft});
      const float avgMultiplier = float(${avgMultiplier});

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

          for (int wC = 0; wC < ${effectiveFilterWidth};
            wC+= ${dilationWidth}) {
            float dyC = float(dyCCorner + wC) / ${strideWidth}.0;

            if (dyC < 0.0 || dyC >= ${convInfo.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(b, idyR, idyC, d);

            dotProd += dyValue * avgMultiplier;
          }
        }
        setOutput(dotProd);
      }
    `;
    }
}
export class AvgPool3DBackpropProgram {
    constructor(convInfo) {
        this.variableNames = ['dy'];
        this.outputShape = convInfo.inShape;
        const filterDepth = convInfo.filterDepth;
        const filterHeight = convInfo.filterHeight;
        const filterWidth = convInfo.filterWidth;
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
        const avgMultiplier = 1 / (filterDepth * filterHeight * filterWidth);
        this.userCode = `
      const ivec3 pads = ivec3(${padFront}, ${padTop}, ${padLeft});
      const float avgMultiplier = float(${avgMultiplier});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyDCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, d) with pos mask(:, :, :, ch) to get
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

              dotProd += dyValue * avgMultiplier;
            }
          }
        }
        setOutput(dotProd);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXZnX3Bvb2xfYmFja3Byb3BfZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9hdmdfcG9vbF9iYWNrcHJvcF9ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBS0gsTUFBTSxPQUFPLHdCQUF3QjtJQUtuQyxZQUFZLFFBQWlDO1FBSjdDLGtCQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUtyQixJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFDcEMsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQztRQUMzQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO1FBQ3pDLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7UUFDM0MsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztRQUN6QyxNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDO1FBQy9DLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUM7UUFDN0MsTUFBTSxxQkFBcUIsR0FBRyxRQUFRLENBQUMscUJBQXFCLENBQUM7UUFDN0QsTUFBTSxvQkFBb0IsR0FBRyxRQUFRLENBQUMsb0JBQW9CLENBQUM7UUFFM0QsTUFBTSxNQUFNLEdBQUcscUJBQXFCLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO1FBQ2hFLE1BQU0sT0FBTyxHQUFHLG9CQUFvQixHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUVqRSxNQUFNLGFBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDLENBQUM7UUFFdkQsSUFBSSxDQUFDLFFBQVEsR0FBRztpQ0FDYSxNQUFNLEtBQUssT0FBTzswQ0FDVCxhQUFhOzs7Ozs7Ozs7Ozs7OztnQ0FjdkIscUJBQXFCO29CQUNqQyxjQUFjO2dEQUNjLFlBQVk7O29DQUV4QixRQUFRLENBQUMsU0FBUzs7Ozs7a0NBS3BCLG9CQUFvQjttQkFDbkMsYUFBYTtrREFDa0IsV0FBVzs7c0NBRXZCLFFBQVEsQ0FBQyxRQUFROzs7Ozs7Ozs7Ozs7O0tBYWxELENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFFRCxNQUFNLE9BQU8sd0JBQXdCO0lBS25DLFlBQVksUUFBaUM7UUFKN0Msa0JBQWEsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBS3JCLElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUNwQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO1FBQ3pDLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7UUFDM0MsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztRQUN6QyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO1FBQ3pDLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7UUFDM0MsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztRQUN6QyxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDO1FBQzdDLE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUM7UUFDL0MsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQztRQUM3QyxNQUFNLG9CQUFvQixHQUFHLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQztRQUMzRCxNQUFNLHFCQUFxQixHQUFHLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQztRQUM3RCxNQUFNLG9CQUFvQixHQUFHLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQztRQUUzRCxNQUFNLFFBQVEsR0FBRyxvQkFBb0IsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDbkUsTUFBTSxNQUFNLEdBQUcscUJBQXFCLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO1FBQ2hFLE1BQU0sT0FBTyxHQUFHLG9CQUFvQixHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUVqRSxNQUFNLGFBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsWUFBWSxHQUFHLFdBQVcsQ0FBQyxDQUFDO1FBRXJFLElBQUksQ0FBQyxRQUFRLEdBQUc7aUNBQ2EsUUFBUSxLQUFLLE1BQU0sS0FBSyxPQUFPOzBDQUN0QixhQUFhOzs7Ozs7Ozs7Ozs7Ozs7OztnQ0FpQnZCLG9CQUFvQjtvQkFDaEMsYUFBYTtnREFDZSxXQUFXOztvQ0FFdkIsUUFBUSxDQUFDLFFBQVE7Ozs7O2tDQUtuQixxQkFBcUI7c0JBQ2pDLGNBQWM7a0RBQ2MsWUFBWTs7c0NBRXhCLFFBQVEsQ0FBQyxTQUFTOzs7Ozs7b0NBTXBCLG9CQUFvQjt3QkFDaEMsYUFBYTtvREFDZSxXQUFXOzt3Q0FFdkIsUUFBUSxDQUFDLFFBQVE7Ozs7Ozs7Ozs7Ozs7O0tBY3BELENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7YmFja2VuZF91dGlsfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0IHtHUEdQVVByb2dyYW19IGZyb20gJy4vZ3BncHVfbWF0aCc7XG5cbmV4cG9ydCBjbGFzcyBBdmdQb29sMkRCYWNrcHJvcFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWydkeSddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoY29udkluZm86IGJhY2tlbmRfdXRpbC5Db252MkRJbmZvKSB7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IGNvbnZJbmZvLmluU2hhcGU7XG4gICAgY29uc3QgZmlsdGVySGVpZ2h0ID0gY29udkluZm8uZmlsdGVySGVpZ2h0O1xuICAgIGNvbnN0IGZpbHRlcldpZHRoID0gY29udkluZm8uZmlsdGVyV2lkdGg7XG4gICAgY29uc3Qgc3RyaWRlSGVpZ2h0ID0gY29udkluZm8uc3RyaWRlSGVpZ2h0O1xuICAgIGNvbnN0IHN0cmlkZVdpZHRoID0gY29udkluZm8uc3RyaWRlV2lkdGg7XG4gICAgY29uc3QgZGlsYXRpb25IZWlnaHQgPSBjb252SW5mby5kaWxhdGlvbkhlaWdodDtcbiAgICBjb25zdCBkaWxhdGlvbldpZHRoID0gY29udkluZm8uZGlsYXRpb25XaWR0aDtcbiAgICBjb25zdCBlZmZlY3RpdmVGaWx0ZXJIZWlnaHQgPSBjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJIZWlnaHQ7XG4gICAgY29uc3QgZWZmZWN0aXZlRmlsdGVyV2lkdGggPSBjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJXaWR0aDtcblxuICAgIGNvbnN0IHBhZFRvcCA9IGVmZmVjdGl2ZUZpbHRlckhlaWdodCAtIDEgLSBjb252SW5mby5wYWRJbmZvLnRvcDtcbiAgICBjb25zdCBwYWRMZWZ0ID0gZWZmZWN0aXZlRmlsdGVyV2lkdGggLSAxIC0gY29udkluZm8ucGFkSW5mby5sZWZ0O1xuXG4gICAgY29uc3QgYXZnTXVsdGlwbGllciA9IDEgLyAoZmlsdGVySGVpZ2h0ICogZmlsdGVyV2lkdGgpO1xuXG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgIGNvbnN0IGl2ZWMyIHBhZHMgPSBpdmVjMigke3BhZFRvcH0sICR7cGFkTGVmdH0pO1xuICAgICAgY29uc3QgZmxvYXQgYXZnTXVsdGlwbGllciA9IGZsb2F0KCR7YXZnTXVsdGlwbGllcn0pO1xuXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIGl2ZWM0IGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICBpbnQgYiA9IGNvb3Jkc1swXTtcbiAgICAgICAgaW50IGQgPSBjb29yZHNbM107XG5cbiAgICAgICAgaXZlYzIgZHlSQ0Nvcm5lciA9IGNvb3Jkcy55eiAtIHBhZHM7XG4gICAgICAgIGludCBkeVJDb3JuZXIgPSBkeVJDQ29ybmVyLng7XG4gICAgICAgIGludCBkeUNDb3JuZXIgPSBkeVJDQ29ybmVyLnk7XG5cbiAgICAgICAgLy8gQ29udm9sdmUgZHkoPywgPywgZCkgd2l0aCBwb3MgbWFzayg6LCA6LCBkKSB0byBnZXQgZHgoeFIsIHhDLCBkKS5cbiAgICAgICAgLy8gPyA9IHRvIGJlIGRldGVybWluZWQuIDogPSBhY3Jvc3MgYWxsIHZhbHVlcyBpbiB0aGF0IGF4aXMuXG4gICAgICAgIGZsb2F0IGRvdFByb2QgPSAwLjA7XG4gICAgICAgIGZvciAoaW50IHdSID0gMDsgd1IgPCAke2VmZmVjdGl2ZUZpbHRlckhlaWdodH07XG4gICAgICAgICAgICB3UiArPSAke2RpbGF0aW9uSGVpZ2h0fSkge1xuICAgICAgICAgIGZsb2F0IGR5UiA9IGZsb2F0KGR5UkNvcm5lciArIHdSKSAvICR7c3RyaWRlSGVpZ2h0fS4wO1xuXG4gICAgICAgICAgaWYgKGR5UiA8IDAuMCB8fCBkeVIgPj0gJHtjb252SW5mby5vdXRIZWlnaHR9LjAgfHwgZnJhY3QoZHlSKSA+IDAuMCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGludCBpZHlSID0gaW50KGR5Uik7XG5cbiAgICAgICAgICBmb3IgKGludCB3QyA9IDA7IHdDIDwgJHtlZmZlY3RpdmVGaWx0ZXJXaWR0aH07XG4gICAgICAgICAgICB3Qys9ICR7ZGlsYXRpb25XaWR0aH0pIHtcbiAgICAgICAgICAgIGZsb2F0IGR5QyA9IGZsb2F0KGR5Q0Nvcm5lciArIHdDKSAvICR7c3RyaWRlV2lkdGh9LjA7XG5cbiAgICAgICAgICAgIGlmIChkeUMgPCAwLjAgfHwgZHlDID49ICR7Y29udkluZm8ub3V0V2lkdGh9LjAgfHxcbiAgICAgICAgICAgICAgICBmcmFjdChkeUMpID4gMC4wKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW50IGlkeUMgPSBpbnQoZHlDKTtcblxuICAgICAgICAgICAgZmxvYXQgZHlWYWx1ZSA9IGdldER5KGIsIGlkeVIsIGlkeUMsIGQpO1xuXG4gICAgICAgICAgICBkb3RQcm9kICs9IGR5VmFsdWUgKiBhdmdNdWx0aXBsaWVyO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZXRPdXRwdXQoZG90UHJvZCk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXZnUG9vbDNEQmFja3Byb3BQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsnZHknXTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGNvbnZJbmZvOiBiYWNrZW5kX3V0aWwuQ29udjNESW5mbykge1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBjb252SW5mby5pblNoYXBlO1xuICAgIGNvbnN0IGZpbHRlckRlcHRoID0gY29udkluZm8uZmlsdGVyRGVwdGg7XG4gICAgY29uc3QgZmlsdGVySGVpZ2h0ID0gY29udkluZm8uZmlsdGVySGVpZ2h0O1xuICAgIGNvbnN0IGZpbHRlcldpZHRoID0gY29udkluZm8uZmlsdGVyV2lkdGg7XG4gICAgY29uc3Qgc3RyaWRlRGVwdGggPSBjb252SW5mby5zdHJpZGVEZXB0aDtcbiAgICBjb25zdCBzdHJpZGVIZWlnaHQgPSBjb252SW5mby5zdHJpZGVIZWlnaHQ7XG4gICAgY29uc3Qgc3RyaWRlV2lkdGggPSBjb252SW5mby5zdHJpZGVXaWR0aDtcbiAgICBjb25zdCBkaWxhdGlvbkRlcHRoID0gY29udkluZm8uZGlsYXRpb25EZXB0aDtcbiAgICBjb25zdCBkaWxhdGlvbkhlaWdodCA9IGNvbnZJbmZvLmRpbGF0aW9uSGVpZ2h0O1xuICAgIGNvbnN0IGRpbGF0aW9uV2lkdGggPSBjb252SW5mby5kaWxhdGlvbldpZHRoO1xuICAgIGNvbnN0IGVmZmVjdGl2ZUZpbHRlckRlcHRoID0gY29udkluZm8uZWZmZWN0aXZlRmlsdGVyRGVwdGg7XG4gICAgY29uc3QgZWZmZWN0aXZlRmlsdGVySGVpZ2h0ID0gY29udkluZm8uZWZmZWN0aXZlRmlsdGVySGVpZ2h0O1xuICAgIGNvbnN0IGVmZmVjdGl2ZUZpbHRlcldpZHRoID0gY29udkluZm8uZWZmZWN0aXZlRmlsdGVyV2lkdGg7XG5cbiAgICBjb25zdCBwYWRGcm9udCA9IGVmZmVjdGl2ZUZpbHRlckRlcHRoIC0gMSAtIGNvbnZJbmZvLnBhZEluZm8uZnJvbnQ7XG4gICAgY29uc3QgcGFkVG9wID0gZWZmZWN0aXZlRmlsdGVySGVpZ2h0IC0gMSAtIGNvbnZJbmZvLnBhZEluZm8udG9wO1xuICAgIGNvbnN0IHBhZExlZnQgPSBlZmZlY3RpdmVGaWx0ZXJXaWR0aCAtIDEgLSBjb252SW5mby5wYWRJbmZvLmxlZnQ7XG5cbiAgICBjb25zdCBhdmdNdWx0aXBsaWVyID0gMSAvIChmaWx0ZXJEZXB0aCAqIGZpbHRlckhlaWdodCAqIGZpbHRlcldpZHRoKTtcblxuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICBjb25zdCBpdmVjMyBwYWRzID0gaXZlYzMoJHtwYWRGcm9udH0sICR7cGFkVG9wfSwgJHtwYWRMZWZ0fSk7XG4gICAgICBjb25zdCBmbG9hdCBhdmdNdWx0aXBsaWVyID0gZmxvYXQoJHthdmdNdWx0aXBsaWVyfSk7XG5cbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgaXZlYzUgY29vcmRzID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gICAgICAgIGludCBiYXRjaCA9IGNvb3Jkcy54O1xuICAgICAgICBpbnQgY2ggPSBjb29yZHMudTtcblxuICAgICAgICBpdmVjMyBkeUNvcm5lciA9IGl2ZWMzKGNvb3Jkcy55LCBjb29yZHMueiwgY29vcmRzLncpIC0gcGFkcztcbiAgICAgICAgaW50IGR5RENvcm5lciA9IGR5Q29ybmVyLng7XG4gICAgICAgIGludCBkeVJDb3JuZXIgPSBkeUNvcm5lci55O1xuICAgICAgICBpbnQgZHlDQ29ybmVyID0gZHlDb3JuZXIuejtcblxuICAgICAgICAvLyBDb252b2x2ZSBkeSg/LCA/LCA/LCBkKSB3aXRoIHBvcyBtYXNrKDosIDosIDosIGNoKSB0byBnZXRcbiAgICAgICAgLy8gZHgoeEQsIHhSLCB4QywgY2gpLlxuICAgICAgICAvLyA/ID0gdG8gYmUgZGV0ZXJtaW5lZC4gOiA9IGFjcm9zcyBhbGwgdmFsdWVzIGluIHRoYXQgYXhpcy5cbiAgICAgICAgZmxvYXQgZG90UHJvZCA9IDAuMDtcblxuICAgICAgICBmb3IgKGludCB3RCA9IDA7IHdEIDwgJHtlZmZlY3RpdmVGaWx0ZXJEZXB0aH07XG4gICAgICAgICAgICB3RCArPSAke2RpbGF0aW9uRGVwdGh9KSB7XG4gICAgICAgICAgZmxvYXQgZHlEID0gZmxvYXQoZHlEQ29ybmVyICsgd0QpIC8gJHtzdHJpZGVEZXB0aH0uMDtcblxuICAgICAgICAgIGlmIChkeUQgPCAwLjAgfHwgZHlEID49ICR7Y29udkluZm8ub3V0RGVwdGh9LjAgfHwgZnJhY3QoZHlEKSA+IDAuMCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGludCBpZHlEID0gaW50KGR5RCk7XG5cbiAgICAgICAgICBmb3IgKGludCB3UiA9IDA7IHdSIDwgJHtlZmZlY3RpdmVGaWx0ZXJIZWlnaHR9O1xuICAgICAgICAgICAgICB3UiArPSAke2RpbGF0aW9uSGVpZ2h0fSkge1xuICAgICAgICAgICAgZmxvYXQgZHlSID0gZmxvYXQoZHlSQ29ybmVyICsgd1IpIC8gJHtzdHJpZGVIZWlnaHR9LjA7XG5cbiAgICAgICAgICAgIGlmIChkeVIgPCAwLjAgfHwgZHlSID49ICR7Y29udkluZm8ub3V0SGVpZ2h0fS4wIHx8XG4gICAgICAgICAgICAgICAgZnJhY3QoZHlSKSA+IDAuMCkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGludCBpZHlSID0gaW50KGR5Uik7XG5cbiAgICAgICAgICAgIGZvciAoaW50IHdDID0gMDsgd0MgPCAke2VmZmVjdGl2ZUZpbHRlcldpZHRofTtcbiAgICAgICAgICAgICAgICB3QyArPSAke2RpbGF0aW9uV2lkdGh9KSB7XG4gICAgICAgICAgICAgIGZsb2F0IGR5QyA9IGZsb2F0KGR5Q0Nvcm5lciArIHdDKSAvICR7c3RyaWRlV2lkdGh9LjA7XG5cbiAgICAgICAgICAgICAgaWYgKGR5QyA8IDAuMCB8fCBkeUMgPj0gJHtjb252SW5mby5vdXRXaWR0aH0uMCB8fFxuICAgICAgICAgICAgICAgICAgZnJhY3QoZHlDKSA+IDAuMCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGludCBpZHlDID0gaW50KGR5Qyk7XG5cbiAgICAgICAgICAgICAgZmxvYXQgZHlWYWx1ZSA9IGdldER5KGJhdGNoLCBpZHlELCBpZHlSLCBpZHlDLCBjaCk7XG5cbiAgICAgICAgICAgICAgZG90UHJvZCArPSBkeVZhbHVlICogYXZnTXVsdGlwbGllcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2V0T3V0cHV0KGRvdFByb2QpO1xuICAgICAgfVxuICAgIGA7XG4gIH1cbn1cbiJdfQ==