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
export class DepthwiseConv2DDerFilterProgram {
    constructor(convInfo) {
        this.variableNames = ['x', 'dy'];
        this.outputShape = convInfo.filterShape;
        const strideHeight = convInfo.strideHeight;
        const strideWidth = convInfo.strideWidth;
        const padTop = convInfo.padInfo.top;
        const padLeft = convInfo.padInfo.left;
        const channelMul = convInfo.outChannels / convInfo.inChannels;
        this.userCode = `
      void main() {
        ivec4 coords = getOutputCoords();
        int wR = coords.x;
        int wC = coords.y;
        int d1 = coords.z;
        int dm = coords.w;
        int d2 = d1 * ${channelMul} + dm;

        float dotProd = 0.0;

        // TO DO: Vec4 over the batch size
        for (int b = 0; b < ${convInfo.batchSize}; b++) {
          for (int yR = 0; yR < ${convInfo.outHeight}; yR++) {
            int xR = wR + yR * ${strideHeight} - ${padTop};

            if (xR < 0 || xR >= ${convInfo.inHeight}) {
              continue;
            }

            for (int yC = 0; yC < ${convInfo.outWidth}; yC++) {
              int xC = wC + yC * ${strideWidth} - ${padLeft};

              if (xC < 0 || xC >= ${convInfo.inWidth}) {
                continue;
              }

              float dyValue = getDy(b, yR, yC, d2);
              float xValue = getX(b, xR, xC, d1);
              dotProd += (xValue * dyValue);
            }
          }
        }
        setOutput(dotProd);
      }
    `;
    }
}
export class DepthwiseConv2DDerInputProgram {
    constructor(convInfo) {
        this.variableNames = ['dy', 'W'];
        this.outputShape = convInfo.inShape;
        const filterHeight = convInfo.filterHeight;
        const filterWidth = convInfo.filterWidth;
        const strideHeight = convInfo.strideHeight;
        const strideWidth = convInfo.strideWidth;
        const padTop = filterHeight - 1 - convInfo.padInfo.top;
        const padLeft = filterWidth - 1 - convInfo.padInfo.left;
        const channelMul = convInfo.outChannels / convInfo.inChannels;
        this.userCode = `
      const ivec2 pads = ivec2(${padTop}, ${padLeft});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[3];
        ivec2 dyCorner = coords.yz - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        float dotProd = 0.0;

        for (int wR = 0; wR < ${filterHeight}; wR++) {
          float dyR = float(dyRCorner + wR) / ${strideHeight}.0;

          if (dyR < 0.0 || dyR >= ${convInfo.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          int wRPerm = ${filterHeight} - 1 - wR;

          for (int wC = 0; wC < ${filterWidth}; wC++) {
            float dyC = float(dyCCorner + wC) / ${strideWidth}.0;

            if (dyC < 0.0 || dyC >= ${convInfo.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            int wCPerm = ${filterWidth} - 1 - wC;

            // TO DO: Vec4 over the channelMul
            for (int dm = 0; dm < ${channelMul}; dm++) {
              int d2 = d1 * ${channelMul} + dm;
              float xValue = getDy(batch, idyR, idyC, d2);
              float wValue = getW(wRPerm, wCPerm, d1, dm);
              dotProd += xValue * wValue;
            }
          }
        }
        setOutput(dotProd);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udl9iYWNrcHJvcF9ncHVfZGVwdGh3aXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9jb252X2JhY2twcm9wX2dwdV9kZXB0aHdpc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBS0gsTUFBTSxPQUFPLCtCQUErQjtJQUsxQyxZQUFZLFFBQWlDO1FBSjdDLGtCQUFhLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFLMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO1FBRXhDLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7UUFDM0MsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztRQUN6QyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztRQUNwQyxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUN0QyxNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7UUFFOUQsSUFBSSxDQUFDLFFBQVEsR0FBRzs7Ozs7Ozt3QkFPSSxVQUFVOzs7Ozs4QkFLSixRQUFRLENBQUMsU0FBUztrQ0FDZCxRQUFRLENBQUMsU0FBUztpQ0FDbkIsWUFBWSxNQUFNLE1BQU07O2tDQUV2QixRQUFRLENBQUMsUUFBUTs7OztvQ0FJZixRQUFRLENBQUMsUUFBUTttQ0FDbEIsV0FBVyxNQUFNLE9BQU87O29DQUV2QixRQUFRLENBQUMsT0FBTzs7Ozs7Ozs7Ozs7O0tBWS9DLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFFRCxNQUFNLE9BQU8sOEJBQThCO0lBS3pDLFlBQVksUUFBaUM7UUFKN0Msa0JBQWEsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUsxQixJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFFcEMsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQztRQUMzQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO1FBQ3pDLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7UUFDM0MsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztRQUV6QyxNQUFNLE1BQU0sR0FBRyxZQUFZLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO1FBQ3ZELE1BQU0sT0FBTyxHQUFHLFdBQVcsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDeEQsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDO1FBRTlELElBQUksQ0FBQyxRQUFRLEdBQUc7aUNBQ2EsTUFBTSxLQUFLLE9BQU87Ozs7Ozs7Ozs7OztnQ0FZbkIsWUFBWTtnREFDSSxZQUFZOztvQ0FFeEIsUUFBUSxDQUFDLFNBQVM7Ozs7O3lCQUs3QixZQUFZOztrQ0FFSCxXQUFXO2tEQUNLLFdBQVc7O3NDQUV2QixRQUFRLENBQUMsUUFBUTs7Ozs7OzJCQU01QixXQUFXOzs7b0NBR0YsVUFBVTs4QkFDaEIsVUFBVTs7Ozs7Ozs7O0tBU25DLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7YmFja2VuZF91dGlsfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0IHtHUEdQVVByb2dyYW19IGZyb20gJy4vZ3BncHVfbWF0aCc7XG5cbmV4cG9ydCBjbGFzcyBEZXB0aHdpc2VDb252MkREZXJGaWx0ZXJQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsneCcsICdkeSddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoY29udkluZm86IGJhY2tlbmRfdXRpbC5Db252MkRJbmZvKSB7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IGNvbnZJbmZvLmZpbHRlclNoYXBlO1xuXG4gICAgY29uc3Qgc3RyaWRlSGVpZ2h0ID0gY29udkluZm8uc3RyaWRlSGVpZ2h0O1xuICAgIGNvbnN0IHN0cmlkZVdpZHRoID0gY29udkluZm8uc3RyaWRlV2lkdGg7XG4gICAgY29uc3QgcGFkVG9wID0gY29udkluZm8ucGFkSW5mby50b3A7XG4gICAgY29uc3QgcGFkTGVmdCA9IGNvbnZJbmZvLnBhZEluZm8ubGVmdDtcbiAgICBjb25zdCBjaGFubmVsTXVsID0gY29udkluZm8ub3V0Q2hhbm5lbHMgLyBjb252SW5mby5pbkNoYW5uZWxzO1xuXG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgaXZlYzQgY29vcmRzID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gICAgICAgIGludCB3UiA9IGNvb3Jkcy54O1xuICAgICAgICBpbnQgd0MgPSBjb29yZHMueTtcbiAgICAgICAgaW50IGQxID0gY29vcmRzLno7XG4gICAgICAgIGludCBkbSA9IGNvb3Jkcy53O1xuICAgICAgICBpbnQgZDIgPSBkMSAqICR7Y2hhbm5lbE11bH0gKyBkbTtcblxuICAgICAgICBmbG9hdCBkb3RQcm9kID0gMC4wO1xuXG4gICAgICAgIC8vIFRPIERPOiBWZWM0IG92ZXIgdGhlIGJhdGNoIHNpemVcbiAgICAgICAgZm9yIChpbnQgYiA9IDA7IGIgPCAke2NvbnZJbmZvLmJhdGNoU2l6ZX07IGIrKykge1xuICAgICAgICAgIGZvciAoaW50IHlSID0gMDsgeVIgPCAke2NvbnZJbmZvLm91dEhlaWdodH07IHlSKyspIHtcbiAgICAgICAgICAgIGludCB4UiA9IHdSICsgeVIgKiAke3N0cmlkZUhlaWdodH0gLSAke3BhZFRvcH07XG5cbiAgICAgICAgICAgIGlmICh4UiA8IDAgfHwgeFIgPj0gJHtjb252SW5mby5pbkhlaWdodH0pIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoaW50IHlDID0gMDsgeUMgPCAke2NvbnZJbmZvLm91dFdpZHRofTsgeUMrKykge1xuICAgICAgICAgICAgICBpbnQgeEMgPSB3QyArIHlDICogJHtzdHJpZGVXaWR0aH0gLSAke3BhZExlZnR9O1xuXG4gICAgICAgICAgICAgIGlmICh4QyA8IDAgfHwgeEMgPj0gJHtjb252SW5mby5pbldpZHRofSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgZmxvYXQgZHlWYWx1ZSA9IGdldER5KGIsIHlSLCB5QywgZDIpO1xuICAgICAgICAgICAgICBmbG9hdCB4VmFsdWUgPSBnZXRYKGIsIHhSLCB4QywgZDEpO1xuICAgICAgICAgICAgICBkb3RQcm9kICs9ICh4VmFsdWUgKiBkeVZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2V0T3V0cHV0KGRvdFByb2QpO1xuICAgICAgfVxuICAgIGA7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERlcHRod2lzZUNvbnYyRERlcklucHV0UHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ2R5JywgJ1cnXTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGNvbnZJbmZvOiBiYWNrZW5kX3V0aWwuQ29udjJESW5mbykge1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBjb252SW5mby5pblNoYXBlO1xuXG4gICAgY29uc3QgZmlsdGVySGVpZ2h0ID0gY29udkluZm8uZmlsdGVySGVpZ2h0O1xuICAgIGNvbnN0IGZpbHRlcldpZHRoID0gY29udkluZm8uZmlsdGVyV2lkdGg7XG4gICAgY29uc3Qgc3RyaWRlSGVpZ2h0ID0gY29udkluZm8uc3RyaWRlSGVpZ2h0O1xuICAgIGNvbnN0IHN0cmlkZVdpZHRoID0gY29udkluZm8uc3RyaWRlV2lkdGg7XG5cbiAgICBjb25zdCBwYWRUb3AgPSBmaWx0ZXJIZWlnaHQgLSAxIC0gY29udkluZm8ucGFkSW5mby50b3A7XG4gICAgY29uc3QgcGFkTGVmdCA9IGZpbHRlcldpZHRoIC0gMSAtIGNvbnZJbmZvLnBhZEluZm8ubGVmdDtcbiAgICBjb25zdCBjaGFubmVsTXVsID0gY29udkluZm8ub3V0Q2hhbm5lbHMgLyBjb252SW5mby5pbkNoYW5uZWxzO1xuXG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgIGNvbnN0IGl2ZWMyIHBhZHMgPSBpdmVjMigke3BhZFRvcH0sICR7cGFkTGVmdH0pO1xuXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIGl2ZWM0IGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICBpbnQgYmF0Y2ggPSBjb29yZHNbMF07XG4gICAgICAgIGludCBkMSA9IGNvb3Jkc1szXTtcbiAgICAgICAgaXZlYzIgZHlDb3JuZXIgPSBjb29yZHMueXogLSBwYWRzO1xuICAgICAgICBpbnQgZHlSQ29ybmVyID0gZHlDb3JuZXIueDtcbiAgICAgICAgaW50IGR5Q0Nvcm5lciA9IGR5Q29ybmVyLnk7XG5cbiAgICAgICAgZmxvYXQgZG90UHJvZCA9IDAuMDtcblxuICAgICAgICBmb3IgKGludCB3UiA9IDA7IHdSIDwgJHtmaWx0ZXJIZWlnaHR9OyB3UisrKSB7XG4gICAgICAgICAgZmxvYXQgZHlSID0gZmxvYXQoZHlSQ29ybmVyICsgd1IpIC8gJHtzdHJpZGVIZWlnaHR9LjA7XG5cbiAgICAgICAgICBpZiAoZHlSIDwgMC4wIHx8IGR5UiA+PSAke2NvbnZJbmZvLm91dEhlaWdodH0uMCB8fCBmcmFjdChkeVIpID4gMC4wKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW50IGlkeVIgPSBpbnQoZHlSKTtcblxuICAgICAgICAgIGludCB3UlBlcm0gPSAke2ZpbHRlckhlaWdodH0gLSAxIC0gd1I7XG5cbiAgICAgICAgICBmb3IgKGludCB3QyA9IDA7IHdDIDwgJHtmaWx0ZXJXaWR0aH07IHdDKyspIHtcbiAgICAgICAgICAgIGZsb2F0IGR5QyA9IGZsb2F0KGR5Q0Nvcm5lciArIHdDKSAvICR7c3RyaWRlV2lkdGh9LjA7XG5cbiAgICAgICAgICAgIGlmIChkeUMgPCAwLjAgfHwgZHlDID49ICR7Y29udkluZm8ub3V0V2lkdGh9LjAgfHxcbiAgICAgICAgICAgICAgICBmcmFjdChkeUMpID4gMC4wKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW50IGlkeUMgPSBpbnQoZHlDKTtcblxuICAgICAgICAgICAgaW50IHdDUGVybSA9ICR7ZmlsdGVyV2lkdGh9IC0gMSAtIHdDO1xuXG4gICAgICAgICAgICAvLyBUTyBETzogVmVjNCBvdmVyIHRoZSBjaGFubmVsTXVsXG4gICAgICAgICAgICBmb3IgKGludCBkbSA9IDA7IGRtIDwgJHtjaGFubmVsTXVsfTsgZG0rKykge1xuICAgICAgICAgICAgICBpbnQgZDIgPSBkMSAqICR7Y2hhbm5lbE11bH0gKyBkbTtcbiAgICAgICAgICAgICAgZmxvYXQgeFZhbHVlID0gZ2V0RHkoYmF0Y2gsIGlkeVIsIGlkeUMsIGQyKTtcbiAgICAgICAgICAgICAgZmxvYXQgd1ZhbHVlID0gZ2V0Vyh3UlBlcm0sIHdDUGVybSwgZDEsIGRtKTtcbiAgICAgICAgICAgICAgZG90UHJvZCArPSB4VmFsdWUgKiB3VmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNldE91dHB1dChkb3RQcm9kKTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG4iXX0=