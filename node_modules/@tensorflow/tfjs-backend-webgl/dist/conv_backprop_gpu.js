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
export class Conv2DDerFilterProgram {
    constructor(convInfo) {
        this.variableNames = ['x', 'dy'];
        this.outputShape = convInfo.filterShape;
        const strideHeight = convInfo.strideHeight;
        const strideWidth = convInfo.strideWidth;
        const padTop = convInfo.padInfo.top;
        const padLeft = convInfo.padInfo.left;
        const isChannelsLast = convInfo.dataFormat === 'channelsLast';
        this.userCode = `
      void main() {
        ivec4 coords = getOutputCoords();
        int wR = coords.x;
        int wC = coords.y;
        int d1 = coords.z;
        int d2 = coords.w;

        // Convolve x(?, ?, d1) with dy(:, :, d2) to get dw(wR, wC, d1, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

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

              if (${isChannelsLast}) {
                float dyValue = getDy(b, yR, yC, d2);
                float xValue = getX(b, xR, xC, d1);
                dotProd += (xValue * dyValue);
              } else {
                float dyValue = getDy(b, d2, yR, yC);
                float xValue = getX(b, d1, xR, xC);
                dotProd += (xValue * dyValue);
              }

            }
          }
        }
        setOutput(dotProd);
      }
    `;
    }
}
export class Conv2DDerInputProgram {
    constructor(convInfo) {
        this.variableNames = ['dy', 'W'];
        this.outputShape = convInfo.inShape;
        const filterHeight = convInfo.filterHeight;
        const filterWidth = convInfo.filterWidth;
        const strideHeight = convInfo.strideHeight;
        const strideWidth = convInfo.strideWidth;
        const isChannelsLast = convInfo.dataFormat === 'channelsLast';
        const padTop = filterHeight - 1 - convInfo.padInfo.top;
        const padLeft = filterWidth - 1 - convInfo.padInfo.left;
        const rowDim = isChannelsLast ? 1 : 2;
        const colDim = isChannelsLast ? 2 : 3;
        const channelDim = isChannelsLast ? 3 : 1;
        this.userCode = `
      const ivec2 pads = ivec2(${padTop}, ${padLeft});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[${channelDim}];

        ivec2 dyCorner = ivec2(coords[${rowDim}], coords[${colDim}]) - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
        // ? = to be determined. : = across all values in that axis.
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

            for (int d2 = 0; d2 < ${convInfo.outChannels}; d2++) {

              if (${isChannelsLast}) {
                float xValue = getDy(batch, idyR, idyC, d2);
                float wValue = getW(wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              } else {
                float xValue = getDy(batch, d2, idyR, idyC);
                float wValue = getW(wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }

            }
          }
        }
        setOutput(dotProd);
      }
    `;
    }
}
export class Conv3DDerFilterProgram {
    constructor(convInfo) {
        this.variableNames = ['x', 'dy'];
        this.outputShape = convInfo.filterShape;
        const strideDepth = convInfo.strideDepth;
        const strideHeight = convInfo.strideHeight;
        const strideWidth = convInfo.strideWidth;
        const padFront = convInfo.padInfo.front;
        const padTop = convInfo.padInfo.top;
        const padLeft = convInfo.padInfo.left;
        this.userCode = `
      void main() {
        ivec5 coords = getOutputCoords();
        int wF = coords.x;
        int wR = coords.y;
        int wC = coords.z;
        int d1 = coords.w;
        int d2 = coords.u;

        float dotProd = 0.0;

        for (int b = 0; b < ${convInfo.batchSize}; b++) {
          for (int yF = 0; yF < ${convInfo.outDepth}; yF++) {
            int xF = wF + yF * ${strideDepth} - ${padFront};

            if (xF < 0 || xF >= ${convInfo.inDepth}) {
              continue;
            }

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

                float dyValue = getDy(b, yF, yR, yC, d2);
                float xValue = getX(b, xF, xR, xC, d1);
                dotProd += (xValue * dyValue);
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `;
    }
}
export class Conv3DDerInputProgram {
    constructor(convInfo) {
        this.variableNames = ['dy', 'W'];
        this.outputShape = convInfo.inShape;
        const filterDepth = convInfo.filterDepth;
        const filterHeight = convInfo.filterHeight;
        const filterWidth = convInfo.filterWidth;
        const strideDepth = convInfo.strideDepth;
        const strideHeight = convInfo.strideHeight;
        const strideWidth = convInfo.strideWidth;
        const padFront = filterDepth - 1 - convInfo.padInfo.front;
        const padTop = filterHeight - 1 - convInfo.padInfo.top;
        const padLeft = filterWidth - 1 - convInfo.padInfo.left;
        this.userCode = `
      const ivec3 pads = ivec3(${padFront}, ${padTop}, ${padLeft});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int d1 = coords.u;


        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyFCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        float dotProd = 0.0;
        for (int wF = 0; wF < ${filterDepth}; wF++) {
          float dyF = float(dyFCorner + wF) / ${strideDepth}.0;

          if (dyF < 0.0 || dyF >= ${convInfo.outDepth}.0 || fract(dyF) > 0.0) {
            continue;
          }
          int idyF = int(dyF);

          int wFPerm = ${filterDepth} - 1 - wF;

          for (int wR = 0; wR < ${filterHeight}; wR++) {
            float dyR = float(dyRCorner + wR) / ${strideHeight}.0;

            if (dyR < 0.0 || dyR >= ${convInfo.outHeight}.0 ||
              fract(dyR) > 0.0) {
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

              for (int d2 = 0; d2 < ${convInfo.outChannels}; d2++) {
                float xValue = getDy(batch, idyF, idyR, idyC, d2);
                float wValue = getW(wFPerm, wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udl9iYWNrcHJvcF9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2NvbnZfYmFja3Byb3BfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUtILE1BQU0sT0FBTyxzQkFBc0I7SUFLakMsWUFBWSxRQUFpQztRQUo3QyxrQkFBYSxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBSzFCLElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztRQUV4QyxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDO1FBQzNDLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUM7UUFDekMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7UUFDcEMsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDdEMsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLFVBQVUsS0FBSyxjQUFjLENBQUM7UUFFOUQsSUFBSSxDQUFDLFFBQVEsR0FBRzs7Ozs7Ozs7Ozs7OzhCQVlVLFFBQVEsQ0FBQyxTQUFTO2tDQUNkLFFBQVEsQ0FBQyxTQUFTO2lDQUNuQixZQUFZLE1BQU0sTUFBTTs7a0NBRXZCLFFBQVEsQ0FBQyxRQUFROzs7O29DQUlmLFFBQVEsQ0FBQyxRQUFRO21DQUNsQixXQUFXLE1BQU0sT0FBTzs7b0NBRXZCLFFBQVEsQ0FBQyxPQUFPOzs7O29CQUloQyxjQUFjOzs7Ozs7Ozs7Ozs7Ozs7S0FlN0IsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQUVELE1BQU0sT0FBTyxxQkFBcUI7SUFLaEMsWUFBWSxRQUFpQztRQUo3QyxrQkFBYSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBSzFCLElBQUksQ0FBQyxXQUFX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QVksQ0FBQztRQUMzQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO1FBQ3pDLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUM7UUFDekMsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQztRQUMzQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO1FBRXpDLE1BQU0sUUFBUSxHQUFHLFdBQVcsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDMUQsTUFBTSxNQUFNLEdBQUcsWUFBWSxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztRQUN2RCxNQUFNLE9BQU8sR0FBRyxXQUFXLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBRXhELElBQUksQ0FBQyxRQUFRLEdBQUc7aUNBQ2EsUUFBUSxLQUFLLE1BQU0sS0FBSyxPQUFPOzs7Ozs7Ozs7Ozs7OztnQ0FjaEMsV0FBVztnREFDSyxXQUFXOztvQ0FFdkIsUUFBUSxDQUFDLFFBQVE7Ozs7O3lCQUs1QixXQUFXOztrQ0FFRixZQUFZO2tEQUNJLFlBQVk7O3NDQUV4QixRQUFRLENBQUMsU0FBUzs7Ozs7OzJCQU03QixZQUFZOztvQ0FFSCxXQUFXO29EQUNLLFdBQVc7O3dDQUV2QixRQUFRLENBQUMsUUFBUTs7Ozs7OzZCQU01QixXQUFXOztzQ0FFRixRQUFRLENBQUMsV0FBVzs7Ozs7Ozs7OztLQVVyRCxDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2JhY2tlbmRfdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuXG5leHBvcnQgY2xhc3MgQ29udjJERGVyRmlsdGVyUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ3gnLCAnZHknXTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGNvbnZJbmZvOiBiYWNrZW5kX3V0aWwuQ29udjJESW5mbykge1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBjb252SW5mby5maWx0ZXJTaGFwZTtcblxuICAgIGNvbnN0IHN0cmlkZUhlaWdodCA9IGNvbnZJbmZvLnN0cmlkZUhlaWdodDtcbiAgICBjb25zdCBzdHJpZGVXaWR0aCA9IGNvbnZJbmZvLnN0cmlkZVdpZHRoO1xuICAgIGNvbnN0IHBhZFRvcCA9IGNvbnZJbmZvLnBhZEluZm8udG9wO1xuICAgIGNvbnN0IHBhZExlZnQgPSBjb252SW5mby5wYWRJbmZvLmxlZnQ7XG4gICAgY29uc3QgaXNDaGFubmVsc0xhc3QgPSBjb252SW5mby5kYXRhRm9ybWF0ID09PSAnY2hhbm5lbHNMYXN0JztcblxuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIGl2ZWM0IGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICBpbnQgd1IgPSBjb29yZHMueDtcbiAgICAgICAgaW50IHdDID0gY29vcmRzLnk7XG4gICAgICAgIGludCBkMSA9IGNvb3Jkcy56O1xuICAgICAgICBpbnQgZDIgPSBjb29yZHMudztcblxuICAgICAgICAvLyBDb252b2x2ZSB4KD8sID8sIGQxKSB3aXRoIGR5KDosIDosIGQyKSB0byBnZXQgZHcod1IsIHdDLCBkMSwgZDIpLlxuICAgICAgICAvLyA/ID0gdG8gYmUgZGV0ZXJtaW5lZC4gOiA9IGFjcm9zcyBhbGwgdmFsdWVzIGluIHRoYXQgYXhpcy5cbiAgICAgICAgZmxvYXQgZG90UHJvZCA9IDAuMDtcblxuICAgICAgICBmb3IgKGludCBiID0gMDsgYiA8ICR7Y29udkluZm8uYmF0Y2hTaXplfTsgYisrKSB7XG4gICAgICAgICAgZm9yIChpbnQgeVIgPSAwOyB5UiA8ICR7Y29udkluZm8ub3V0SGVpZ2h0fTsgeVIrKykge1xuICAgICAgICAgICAgaW50IHhSID0gd1IgKyB5UiAqICR7c3RyaWRlSGVpZ2h0fSAtICR7cGFkVG9wfTtcblxuICAgICAgICAgICAgaWYgKHhSIDwgMCB8fCB4UiA+PSAke2NvbnZJbmZvLmluSGVpZ2h0fSkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChpbnQgeUMgPSAwOyB5QyA8ICR7Y29udkluZm8ub3V0V2lkdGh9OyB5QysrKSB7XG4gICAgICAgICAgICAgIGludCB4QyA9IHdDICsgeUMgKiAke3N0cmlkZVdpZHRofSAtICR7cGFkTGVmdH07XG5cbiAgICAgICAgICAgICAgaWYgKHhDIDwgMCB8fCB4QyA+PSAke2NvbnZJbmZvLmluV2lkdGh9KSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoJHtpc0NoYW5uZWxzTGFzdH0pIHtcbiAgICAgICAgICAgICAgICBmbG9hdCBkeVZhbHVlID0gZ2V0RHkoYiwgeVIsIHlDLCBkMik7XG4gICAgICAgICAgICAgICAgZmxvYXQgeFZhbHVlID0gZ2V0WChiLCB4UiwgeEMsIGQxKTtcbiAgICAgICAgICAgICAgICBkb3RQcm9kICs9ICh4VmFsdWUgKiBkeVZhbHVlKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmbG9hdCBkeVZhbHVlID0gZ2V0RHkoYiwgZDIsIHlSLCB5Qyk7XG4gICAgICAgICAgICAgICAgZmxvYXQgeFZhbHVlID0gZ2V0WChiLCBkMSwgeFIsIHhDKTtcbiAgICAgICAgICAgICAgICBkb3RQcm9kICs9ICh4VmFsdWUgKiBkeVZhbHVlKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNldE91dHB1dChkb3RQcm9kKTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb252MkREZXJJbnB1dFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWydkeScsICdXJ107XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXTtcbiAgdXNlckNvZGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihjb252SW5mbzogYmFja2VuZF91dGlsLkNvbnYyREluZm8pIHtcbiAgICB0aGlzLm91dHB1dFNoYXBlID0gY29udkluZm8uaW5TaGFwZTtcblxuICAgIGNvbnN0IGZpbHRlckhlaWdodCA9IGNvbnZJbmZvLmZpbHRlckhlaWdodDtcbiAgICBjb25zdCBmaWx0ZXJXaWR0aCA9IGNvbnZJbmZvLmZpbHRlcldpZHRoO1xuICAgIGNvbnN0IHN0cmlkZUhlaWdodCA9IGNvbnZJbmZvLnN0cmlkZUhlaWdodDtcbiAgICBjb25zdCBzdHJpZGVXaWR0aCA9IGNvbnZJbmZvLnN0cmlkZVdpZHRoO1xuICAgIGNvbnN0IGlzQ2hhbm5lbHNMYXN0ID0gY29udkluZm8uZGF0YUZvcm1hdCA9PT0gJ2NoYW5uZWxzTGFzdCc7XG5cbiAgICBjb25zdCBwYWRUb3AgPSBmaWx0ZXJIZWlnaHQgLSAxIC0gY29udkluZm8ucGFkSW5mby50b3A7XG4gICAgY29uc3QgcGFkTGVmdCA9IGZpbHRlcldpZHRoIC0gMSAtIGNvbnZJbmZvLnBhZEluZm8ubGVmdDtcblxuICAgIGNvbnN0IHJvd0RpbSA9IGlzQ2hhbm5lbHNMYXN0ID8gMSA6IDI7XG4gICAgY29uc3QgY29sRGltID0gaXNDaGFubmVsc0xhc3QgPyAyIDogMztcbiAgICBjb25zdCBjaGFubmVsRGltID0gaXNDaGFubmVsc0xhc3QgPyAzIDogMTtcblxuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICBjb25zdCBpdmVjMiBwYWRzID0gaXZlYzIoJHtwYWRUb3B9LCAke3BhZExlZnR9KTtcblxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICBpdmVjNCBjb29yZHMgPSBnZXRPdXRwdXRDb29yZHMoKTtcbiAgICAgICAgaW50IGJhdGNoID0gY29vcmRzWzBdO1xuICAgICAgICBpbnQgZDEgPSBjb29yZHNbJHtjaGFubmVsRGltfV07XG5cbiAgICAgICAgaXZlYzIgZHlDb3JuZXIgPSBpdmVjMihjb29yZHNbJHtyb3dEaW19XSwgY29vcmRzWyR7Y29sRGltfV0pIC0gcGFkcztcbiAgICAgICAgaW50IGR5UkNvcm5lciA9IGR5Q29ybmVyLng7XG4gICAgICAgIGludCBkeUNDb3JuZXIgPSBkeUNvcm5lci55O1xuXG4gICAgICAgIC8vIENvbnZvbHZlIGR5KD8sID8sIGQyKSB3aXRoIHcoOiwgOiwgZDEsIGQyKSB0byBjb21wdXRlIGR4KHhSLCB4QywgZDEpLlxuICAgICAgICAvLyA/ID0gdG8gYmUgZGV0ZXJtaW5lZC4gOiA9IGFjcm9zcyBhbGwgdmFsdWVzIGluIHRoYXQgYXhpcy5cbiAgICAgICAgZmxvYXQgZG90UHJvZCA9IDAuMDtcbiAgICAgICAgZm9yIChpbnQgd1IgPSAwOyB3UiA8ICR7ZmlsdGVySGVpZ2h0fTsgd1IrKykge1xuICAgICAgICAgIGZsb2F0IGR5UiA9IGZsb2F0KGR5UkNvcm5lciArIHdSKSAvICR7c3RyaWRlSGVpZ2h0fS4wO1xuXG4gICAgICAgICAgaWYgKGR5UiA8IDAuMCB8fCBkeVIgPj0gJHtjb252SW5mby5vdXRIZWlnaHR9LjAgfHwgZnJhY3QoZHlSKSA+IDAuMCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGludCBpZHlSID0gaW50KGR5Uik7XG5cbiAgICAgICAgICBpbnQgd1JQZXJtID0gJHtmaWx0ZXJIZWlnaHR9IC0gMSAtIHdSO1xuXG4gICAgICAgICAgZm9yIChpbnQgd0MgPSAwOyB3QyA8ICR7ZmlsdGVyV2lkdGh9OyB3QysrKSB7XG4gICAgICAgICAgICBmbG9hdCBkeUMgPSBmbG9hdChkeUNDb3JuZXIgKyB3QykgLyAke3N0cmlkZVdpZHRofS4wO1xuXG4gICAgICAgICAgICBpZiAoZHlDIDwgMC4wIHx8IGR5QyA+PSAke2NvbnZJbmZvLm91dFdpZHRofS4wIHx8XG4gICAgICAgICAgICAgICAgZnJhY3QoZHlDKSA+IDAuMCkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGludCBpZHlDID0gaW50KGR5Qyk7XG5cbiAgICAgICAgICAgIGludCB3Q1Blcm0gPSAke2ZpbHRlcldpZHRofSAtIDEgLSB3QztcblxuICAgICAgICAgICAgZm9yIChpbnQgZDIgPSAwOyBkMiA8ICR7Y29udkluZm8ub3V0Q2hhbm5lbHN9OyBkMisrKSB7XG5cbiAgICAgICAgICAgICAgaWYgKCR7aXNDaGFubmVsc0xhc3R9KSB7XG4gICAgICAgICAgICAgICAgZmxvYXQgeFZhbHVlID0gZ2V0RHkoYmF0Y2gsIGlkeVIsIGlkeUMsIGQyKTtcbiAgICAgICAgICAgICAgICBmbG9hdCB3VmFsdWUgPSBnZXRXKHdSUGVybSwgd0NQZXJtLCBkMSwgZDIpO1xuICAgICAgICAgICAgICAgIGRvdFByb2QgKz0geFZhbHVlICogd1ZhbHVlO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZsb2F0IHhWYWx1ZSA9IGdldER5KGJhdGNoLCBkMiwgaWR5UiwgaWR5Qyk7XG4gICAgICAgICAgICAgICAgZmxvYXQgd1ZhbHVlID0gZ2V0Vyh3UlBlcm0sIHdDUGVybSwgZDEsIGQyKTtcbiAgICAgICAgICAgICAgICBkb3RQcm9kICs9IHhWYWx1ZSAqIHdWYWx1ZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNldE91dHB1dChkb3RQcm9kKTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb252M0REZXJGaWx0ZXJQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsneCcsICdkeSddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoY29udkluZm86IGJhY2tlbmRfdXRpbC5Db252M0RJbmZvKSB7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IGNvbnZJbmZvLmZpbHRlclNoYXBlO1xuXG4gICAgY29uc3Qgc3RyaWRlRGVwdGggPSBjb252SW5mby5zdHJpZGVEZXB0aDtcbiAgICBjb25zdCBzdHJpZGVIZWlnaHQgPSBjb252SW5mby5zdHJpZGVIZWlnaHQ7XG4gICAgY29uc3Qgc3RyaWRlV2lkdGggPSBjb252SW5mby5zdHJpZGVXaWR0aDtcbiAgICBjb25zdCBwYWRGcm9udCA9IGNvbnZJbmZvLnBhZEluZm8uZnJvbnQ7XG4gICAgY29uc3QgcGFkVG9wID0gY29udkluZm8ucGFkSW5mby50b3A7XG4gICAgY29uc3QgcGFkTGVmdCA9IGNvbnZJbmZvLnBhZEluZm8ubGVmdDtcblxuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIGl2ZWM1IGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICBpbnQgd0YgPSBjb29yZHMueDtcbiAgICAgICAgaW50IHdSID0gY29vcmRzLnk7XG4gICAgICAgIGludCB3QyA9IGNvb3Jkcy56O1xuICAgICAgICBpbnQgZDEgPSBjb29yZHMudztcbiAgICAgICAgaW50IGQyID0gY29vcmRzLnU7XG5cbiAgICAgICAgZmxvYXQgZG90UHJvZCA9IDAuMDtcblxuICAgICAgICBmb3IgKGludCBiID0gMDsgYiA8ICR7Y29udkluZm8uYmF0Y2hTaXplfTsgYisrKSB7XG4gICAgICAgICAgZm9yIChpbnQgeUYgPSAwOyB5RiA8ICR7Y29udkluZm8ub3V0RGVwdGh9OyB5RisrKSB7XG4gICAgICAgICAgICBpbnQgeEYgPSB3RiArIHlGICogJHtzdHJpZGVEZXB0aH0gLSAke3BhZEZyb250fTtcblxuICAgICAgICAgICAgaWYgKHhGIDwgMCB8fCB4RiA+PSAke2NvbnZJbmZvLmluRGVwdGh9KSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGludCB5UiA9IDA7IHlSIDwgJHtjb252SW5mby5vdXRIZWlnaHR9OyB5UisrKSB7XG4gICAgICAgICAgICAgIGludCB4UiA9IHdSICsgeVIgKiAke3N0cmlkZUhlaWdodH0gLSAke3BhZFRvcH07XG5cbiAgICAgICAgICAgICAgaWYgKHhSIDwgMCB8fCB4UiA+PSAke2NvbnZJbmZvLmluSGVpZ2h0fSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgZm9yIChpbnQgeUMgPSAwOyB5QyA8ICR7Y29udkluZm8ub3V0V2lkdGh9OyB5QysrKSB7XG4gICAgICAgICAgICAgICAgaW50IHhDID0gd0MgKyB5QyAqICR7c3RyaWRlV2lkdGh9IC0gJHtwYWRMZWZ0fTtcblxuICAgICAgICAgICAgICAgIGlmICh4QyA8IDAgfHwgeEMgPj0gJHtjb252SW5mby5pbldpZHRofSkge1xuICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZmxvYXQgZHlWYWx1ZSA9IGdldER5KGIsIHlGLCB5UiwgeUMsIGQyKTtcbiAgICAgICAgICAgICAgICBmbG9hdCB4VmFsdWUgPSBnZXRYKGIsIHhGLCB4UiwgeEMsIGQxKTtcbiAgICAgICAgICAgICAgICBkb3RQcm9kICs9ICh4VmFsdWUgKiBkeVZhbHVlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZXRPdXRwdXQoZG90UHJvZCk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29udjNERGVySW5wdXRQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsnZHknLCAnVyddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoY29udkluZm86IGJhY2tlbmRfdXRpbC5Db252M0RJbmZvKSB7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IGNvbnZJbmZvLmluU2hhcGU7XG5cbiAgICBjb25zdCBmaWx0ZXJEZXB0aCA9IGNvbnZJbmZvLmZpbHRlckRlcHRoO1xuICAgIGNvbnN0IGZpbHRlckhlaWdodCA9IGNvbnZJbmZvLmZpbHRlckhlaWdodDtcbiAgICBjb25zdCBmaWx0ZXJXaWR0aCA9IGNvbnZJbmZvLmZpbHRlcldpZHRoO1xuICAgIGNvbnN0IHN0cmlkZURlcHRoID0gY29udkluZm8uc3RyaWRlRGVwdGg7XG4gICAgY29uc3Qgc3RyaWRlSGVpZ2h0ID0gY29udkluZm8uc3RyaWRlSGVpZ2h0O1xuICAgIGNvbnN0IHN0cmlkZVdpZHRoID0gY29udkluZm8uc3RyaWRlV2lkdGg7XG5cbiAgICBjb25zdCBwYWRGcm9udCA9IGZpbHRlckRlcHRoIC0gMSAtIGNvbnZJbmZvLnBhZEluZm8uZnJvbnQ7XG4gICAgY29uc3QgcGFkVG9wID0gZmlsdGVySGVpZ2h0IC0gMSAtIGNvbnZJbmZvLnBhZEluZm8udG9wO1xuICAgIGNvbnN0IHBhZExlZnQgPSBmaWx0ZXJXaWR0aCAtIDEgLSBjb252SW5mby5wYWRJbmZvLmxlZnQ7XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgY29uc3QgaXZlYzMgcGFkcyA9IGl2ZWMzKCR7cGFkRnJvbnR9LCAke3BhZFRvcH0sICR7cGFkTGVmdH0pO1xuXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIGl2ZWM1IGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICBpbnQgYmF0Y2ggPSBjb29yZHMueDtcbiAgICAgICAgaW50IGQxID0gY29vcmRzLnU7XG5cblxuICAgICAgICBpdmVjMyBkeUNvcm5lciA9IGl2ZWMzKGNvb3Jkcy55LCBjb29yZHMueiwgY29vcmRzLncpIC0gcGFkcztcbiAgICAgICAgaW50IGR5RkNvcm5lciA9IGR5Q29ybmVyLng7XG4gICAgICAgIGludCBkeVJDb3JuZXIgPSBkeUNvcm5lci55O1xuICAgICAgICBpbnQgZHlDQ29ybmVyID0gZHlDb3JuZXIuejtcblxuICAgICAgICBmbG9hdCBkb3RQcm9kID0gMC4wO1xuICAgICAgICBmb3IgKGludCB3RiA9IDA7IHdGIDwgJHtmaWx0ZXJEZXB0aH07IHdGKyspIHtcbiAgICAgICAgICBmbG9hdCBkeUYgPSBmbG9hdChkeUZDb3JuZXIgKyB3RikgLyAke3N0cmlkZURlcHRofS4wO1xuXG4gICAgICAgICAgaWYgKGR5RiA8IDAuMCB8fCBkeUYgPj0gJHtjb252SW5mby5vdXREZXB0aH0uMCB8fCBmcmFjdChkeUYpID4gMC4wKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW50IGlkeUYgPSBpbnQoZHlGKTtcblxuICAgICAgICAgIGludCB3RlBlcm0gPSAke2ZpbHRlckRlcHRofSAtIDEgLSB3RjtcblxuICAgICAgICAgIGZvciAoaW50IHdSID0gMDsgd1IgPCAke2ZpbHRlckhlaWdodH07IHdSKyspIHtcbiAgICAgICAgICAgIGZsb2F0IGR5UiA9IGZsb2F0KGR5UkNvcm5lciArIHdSKSAvICR7c3RyaWRlSGVpZ2h0fS4wO1xuXG4gICAgICAgICAgICBpZiAoZHlSIDwgMC4wIHx8IGR5UiA+PSAke2NvbnZJbmZvLm91dEhlaWdodH0uMCB8fFxuICAgICAgICAgICAgICBmcmFjdChkeVIpID4gMC4wKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW50IGlkeVIgPSBpbnQoZHlSKTtcblxuICAgICAgICAgICAgaW50IHdSUGVybSA9ICR7ZmlsdGVySGVpZ2h0fSAtIDEgLSB3UjtcblxuICAgICAgICAgICAgZm9yIChpbnQgd0MgPSAwOyB3QyA8ICR7ZmlsdGVyV2lkdGh9OyB3QysrKSB7XG4gICAgICAgICAgICAgIGZsb2F0IGR5QyA9IGZsb2F0KGR5Q0Nvcm5lciArIHdDKSAvICR7c3RyaWRlV2lkdGh9LjA7XG5cbiAgICAgICAgICAgICAgaWYgKGR5QyA8IDAuMCB8fCBkeUMgPj0gJHtjb252SW5mby5vdXRXaWR0aH0uMCB8fFxuICAgICAgICAgICAgICAgICAgZnJhY3QoZHlDKSA+IDAuMCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGludCBpZHlDID0gaW50KGR5Qyk7XG5cbiAgICAgICAgICAgICAgaW50IHdDUGVybSA9ICR7ZmlsdGVyV2lkdGh9IC0gMSAtIHdDO1xuXG4gICAgICAgICAgICAgIGZvciAoaW50IGQyID0gMDsgZDIgPCAke2NvbnZJbmZvLm91dENoYW5uZWxzfTsgZDIrKykge1xuICAgICAgICAgICAgICAgIGZsb2F0IHhWYWx1ZSA9IGdldER5KGJhdGNoLCBpZHlGLCBpZHlSLCBpZHlDLCBkMik7XG4gICAgICAgICAgICAgICAgZmxvYXQgd1ZhbHVlID0gZ2V0Vyh3RlBlcm0sIHdSUGVybSwgd0NQZXJtLCBkMSwgZDIpO1xuICAgICAgICAgICAgICAgIGRvdFByb2QgKz0geFZhbHVlICogd1ZhbHVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNldE91dHB1dChkb3RQcm9kKTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG4iXX0=