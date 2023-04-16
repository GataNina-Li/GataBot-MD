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
export class Pool2DProgram {
    constructor(convInfo, poolType, computePositions, flattenPositions = false, includeBatchInIndex = false) {
        this.variableNames = ['x'];
        if (poolType === 'avg' && computePositions) {
            throw new Error('Cannot compute positions for average pool.');
        }
        const filterWidth = convInfo.filterWidth;
        const strideHeight = convInfo.strideHeight;
        const strideWidth = convInfo.strideWidth;
        const dilationHeight = convInfo.dilationHeight;
        const dilationWidth = convInfo.dilationWidth;
        const effectiveFilterHeight = convInfo.effectiveFilterHeight;
        const effectiveFilterWidth = convInfo.effectiveFilterWidth;
        const padTop = convInfo.padInfo.top;
        const padLeft = convInfo.padInfo.left;
        this.outputShape = convInfo.outShape;
        const isAvgPool = poolType === 'avg';
        const batchFlattenPositionStr = `((batch  * ${convInfo.inHeight} + xR) * ${convInfo.inWidth} + xC) * ${convInfo.inChannels} + d`;
        const flattenPositionStr = `(xR * ${convInfo.inWidth} + xC) * ${convInfo.inChannels} + d`;
        let initializationValue = '0.0';
        if (!isAvgPool) {
            // WebGL on Firefox Linux can't compile 1/0 so we do 1/eps.
            initializationValue = '-1.0 / 1e-20';
        }
        if (computePositions) {
            const compareOp = '>=';
            this.userCode = `
        const ivec2 strides = ivec2(${strideHeight}, ${strideWidth});
        const ivec2 pads = ivec2(${padTop}, ${padLeft});

        void main() {
          ivec4 coords = getOutputCoords();
          int batch = coords[0];
          int d = coords[3];

          ivec2 xRCCorner = coords.yz * strides - pads;
          int xRCorner = xRCCorner.x;
          int xCCorner = xRCCorner.y;

          // max/min x(?, ?, d) to get y(yR, yC, d).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;
          float avgValue = 0.0;

          for (int wR = 0; wR < ${effectiveFilterHeight};
              wR += ${dilationHeight}) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= ${convInfo.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${effectiveFilterWidth};
                wC += ${dilationWidth}) {
              int xC = xCCorner + wC;

              if (xC < 0 || xC >= ${convInfo.inWidth}) {
                continue;
              }

              float value = getX(batch, xR, xC, d);

              // If a min / max value has already been found, use it. If not,
              // use the current value.
              float currMinMaxValue = mix(
                  value, minMaxValue, minMaxValueFound);
              if (value ${compareOp} currMinMaxValue) {
                minMaxValue = value;
                minMaxValueFound = 1.0;
                minMaxPosition = ${flattenPositions ? (includeBatchInIndex ? batchFlattenPositionStr :
                flattenPositionStr) :
                `wR * ${effectiveFilterWidth} + wC`};
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;
            return;
        }
        const compareOp = 'max';
        let returnValue = `${poolType}(${poolType}(${poolType}(` +
            'minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])';
        if (poolType === 'avg') {
            returnValue = `avgValue / count`;
        }
        const filterWidthNearestVec4 = Math.floor(filterWidth / 4) * 4;
        const filterWidthVec4Remainder = filterWidth % 4;
        const updateSnippet = `
      if (${isAvgPool}) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = ${compareOp}(values, minMaxValue);
      }
    `;
        this.userCode = `
      const ivec2 strides = ivec2(${strideHeight}, ${strideWidth});
      const ivec2 pads = ivec2(${padTop}, ${padLeft});
      const float initializationValue = ${initializationValue};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xR, int xC, int d) {
        if (xC < 0 || xC >= ${convInfo.inWidth}) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xR, xC, d);
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d = coords[3];

        ivec2 xRCCorner = coords.yz * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // max/min x(?, ?, d) to get y(yR, yC, d).
        // ? = to be determined
        vec4 minMaxValue = vec4(${initializationValue});
        float avgValue = 0.0;
        count = 0.0;

        for (int wR = 0; wR < ${effectiveFilterHeight};
            wR += ${dilationHeight}) {
          int xR = xRCorner + wR;

          if (xR < 0 || xR >= ${convInfo.inHeight}) {
            continue;
          }

          for (int wC = 0; wC < ${filterWidthNearestVec4}; wC += 4) {
            int xC = xCCorner + wC * ${dilationWidth};

            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${dilationWidth}, d),
              getValue(batch, xR, xC + 2 * ${dilationWidth}, d),
              getValue(batch, xR, xC + 3 * ${dilationWidth}, d)
            );

            ${updateSnippet}
          }

          int xC = xCCorner + ${filterWidthNearestVec4};
          if (${filterWidthVec4Remainder === 1}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              initializationValue,
              initializationValue,
              initializationValue
            );

            ${updateSnippet}
          } else if (${filterWidthVec4Remainder === 2}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${dilationWidth}, d),
              initializationValue,
              initializationValue
            );

            ${updateSnippet}
          } else if (${filterWidthVec4Remainder === 3}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${dilationWidth}, d),
              getValue(batch, xR, xC + 2 * ${dilationWidth}, d),
              initializationValue
            );

            ${updateSnippet}
          }
        }
        setOutput(${returnValue});
      }
    `;
    }
}
export class Pool3DProgram {
    constructor(convInfo, poolType, computePositions, flattenPositions = false, includeBatchInIndex = false) {
        this.variableNames = ['x'];
        if (poolType === 'avg' && computePositions) {
            throw new Error('Cannot compute positions for average pool.');
        }
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
        const padFront = convInfo.padInfo.front;
        const padTop = convInfo.padInfo.top;
        const padLeft = convInfo.padInfo.left;
        this.outputShape = convInfo.outShape;
        const isAvgPool = poolType === 'avg';
        let initializationValue = '0.0';
        if (!isAvgPool) {
            // WebGL on Firefox Linux can't compile 1/0 so we do 1/eps.
            initializationValue = '-1.0 / 1e-20';
        }
        if (computePositions) {
            const compareOp = '>=';
            this.userCode = `
        const ivec3 strides =
            ivec3(${strideDepth}, ${strideHeight}, ${strideWidth});
        const ivec3 pads = ivec3(${padFront}, ${padTop}, ${padLeft});

        void main() {
          ivec5 coords = getOutputCoords();
          int batch = coords.x;
          int ch = coords.u;

          ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
          int xDCorner = xCorner.x;
          int xRCorner = xCorner.y;
          int xCCorner = xCorner.z;

          // max/min x(?, ?, ?, ch) to get y(yD, yR, yC, ch).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;

          for (int wD = 0; wD < ${effectiveFilterDepth};
              wD += ${dilationDepth}) {
            int xD = xDCorner + wD;

            if (xD < 0 || xD >= ${convInfo.inDepth}) {
              continue;
            }

            for (int wR = 0; wR < ${effectiveFilterHeight};
                wR += ${dilationHeight}) {
              int xR = xRCorner + wR;

              if (xR < 0 || xR >= ${convInfo.inHeight}) {
                continue;
              }

              for (int wC = 0; wC < ${effectiveFilterWidth};
                  wC += ${dilationWidth}) {
                int xC = xCCorner + wC;

                if (xC < 0 || xC >= ${convInfo.inWidth}) {
                  continue;
                }

                float value = getX(batch, xD, xR, xC, ch);

                // If a min / max value has already been found, use it. If not,
                // use the current value.
                float currMinMaxValue = mix(
                    value, minMaxValue, minMaxValueFound);
                if (value ${compareOp} currMinMaxValue) {
                  minMaxValue = value;
                  minMaxValueFound = 1.0;
                  minMaxPosition = ${flattenPositions ?
                (includeBatchInIndex ?
                    `(((batch * ${convInfo.inDepth} + xD) * ${convInfo.inHeight} + xR) * ${convInfo.inWidth} + xC) * ${convInfo.inChannels} + ch` :
                    `((xD * ${convInfo.inHeight} + xR) * ${convInfo.inWidth} + xC) * ${convInfo.inChannels} + ch`) :
                `wD * ${effectiveFilterHeight} * ${effectiveFilterWidth} +
                      wR * ${effectiveFilterWidth} + wC`};
                }
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;
            return;
        }
        const compareOp = 'max';
        let returnValue = `${poolType}(${poolType}(${poolType}(` +
            'minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])';
        if (poolType === 'avg') {
            returnValue = `avgValue / count`;
        }
        const filterWidthNearestVec4 = Math.floor(filterWidth / 4) * 4;
        const filterWidthVec4Remainder = filterWidth % 4;
        const updateSnippet = `
      if (${isAvgPool}) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = ${compareOp}(values, minMaxValue);
      }
    `;
        this.userCode = `
      const ivec3 strides =
        ivec3(${strideDepth}, ${strideHeight}, ${strideWidth});
      const ivec3 pads = ivec3(${padFront}, ${padTop}, ${padLeft});
      const float initializationValue = ${initializationValue};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xD, int xR, int xC, int ch) {
        if (xC < 0 || xC >= ${convInfo.inWidth}) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xD, xR, xC, ch);
      }

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xDCorner = xCorner.x;
        int xRCorner = xCorner.y;
        int xCCorner = xCorner.z;

        // max/min x(?, ?, ?, d) to get y(yD, yR, yC, ch).
        // ? = to be determined
        vec4 minMaxValue = vec4(${initializationValue});
        float avgValue = 0.0;
        count = 0.0;

        for (int wD = 0; wD < ${effectiveFilterDepth};
            wD += ${dilationDepth}) {
          int xD = xDCorner + wD;

          if (xD < 0 || xD >= ${convInfo.inDepth}) {
            continue;
          }

          for (int wR = 0; wR < ${effectiveFilterHeight};
            wR += ${dilationHeight}) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= ${convInfo.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${filterWidthNearestVec4}; wC += 4) {
              int xC = xCCorner + wC * ${dilationWidth};

              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${dilationWidth}, ch),
                getValue(batch, xD, xR, xC + 2 * ${dilationWidth}, ch),
                getValue(batch, xD, xR, xC + 3 * ${dilationWidth}, ch)
              );

              ${updateSnippet}
            }

            int xC = xCCorner + ${filterWidthNearestVec4};
            if (${filterWidthVec4Remainder === 1}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                initializationValue,
                initializationValue,
                initializationValue
              );

              ${updateSnippet}
            } else if (${filterWidthVec4Remainder === 2}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${dilationWidth}, ch),
                initializationValue,
                initializationValue
              );

              ${updateSnippet}
            } else if (${filterWidthVec4Remainder === 3}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${dilationWidth}, ch),
                getValue(batch, xD, xR, xC + 2 * ${dilationWidth}, ch),
                initializationValue
              );

              ${updateSnippet}
            }
          }
          setOutput(${returnValue});
        }
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9vbF9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL3Bvb2xfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUtILE1BQU0sT0FBTyxhQUFhO0lBS3hCLFlBQ0ksUUFBaUMsRUFBRSxRQUFxQixFQUN4RCxnQkFBeUIsRUFBRSxnQkFBZ0IsR0FBRyxLQUFLLEVBQ25ELG1CQUFtQixHQUFHLEtBQUs7UUFQL0Isa0JBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBUXBCLElBQUksUUFBUSxLQUFLLEtBQUssSUFBSSxnQkFBZ0IsRUFBRTtZQUMxQyxNQUFNLElBQUksS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7U0FDL0Q7UUFFRCxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO1FBQ3pDLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7UUFDM0MsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztRQUN6QyxNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDO1FBQy9DLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUM7UUFDN0MsTUFBTSxxQkFBcUIsR0FBRyxRQUFRLENBQUMscUJBQXFCLENBQUM7UUFDN0QsTUFBTSxvQkFBb0IsR0FBRyxRQUFRLENBQUMsb0JBQW9CLENBQUM7UUFFM0QsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7UUFDcEMsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDdEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO1FBRXJDLE1BQU0sU0FBUyxHQUFHLFFBQVEsS0FBSyxLQUFLLENBQUM7UUFDckMsTUFBTSx1QkFBdUIsR0FB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QkFBbUI7Ozs7Ozs4QkFNL0IsUUFBUSxDQUFDLE9BQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0NBbUJaLG1CQUFtQjs7OztnQ0FJckIsb0JBQW9CO29CQUNoQyxhQUFhOzs7Z0NBR0QsUUFBUSxDQUFDLE9BQU87Ozs7a0NBSWQscUJBQXFCO29CQUNuQyxjQUFjOzs7a0NBR0EsUUFBUSxDQUFDLFFBQVE7Ozs7b0NBSWYsc0JBQXNCO3lDQUNqQixhQUFhOzs7OytDQUlQLGFBQWE7bURBQ1QsYUFBYTttREFDYixhQUFhOzs7Z0JBR2hELGFBQWE7OztrQ0FHSyxzQkFBc0I7a0JBQ3RDLHdCQUF3QixLQUFLLENBQUM7Ozs7Ozs7O2dCQVFoQyxhQUFhO3lCQUNKLHdCQUF3QixLQUFLLENBQUM7OzsrQ0FHUixhQUFhOzs7OztnQkFLNUMsYUFBYTt5QkFDSix3QkFBd0IsS0FBSyxDQUFDOzs7K0NBR1IsYUFBYTttREFDVCxhQUFhOzs7O2dCQUloRCxhQUFhOzs7c0JBR1AsV0FBVzs7O0tBRzVCLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7YmFja2VuZF91dGlsfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0IHtHUEdQVVByb2dyYW19IGZyb20gJy4vZ3BncHVfbWF0aCc7XG5cbmV4cG9ydCBjbGFzcyBQb29sMkRQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsneCddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBjb252SW5mbzogYmFja2VuZF91dGlsLkNvbnYyREluZm8sIHBvb2xUeXBlOiAnbWF4J3wnYXZnJyxcbiAgICAgIGNvbXB1dGVQb3NpdGlvbnM6IGJvb2xlYW4sIGZsYXR0ZW5Qb3NpdGlvbnMgPSBmYWxzZSxcbiAgICAgIGluY2x1ZGVCYXRjaEluSW5kZXggPSBmYWxzZSkge1xuICAgIGlmIChwb29sVHlwZSA9PT0gJ2F2ZycgJiYgY29tcHV0ZVBvc2l0aW9ucykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY29tcHV0ZSBwb3NpdGlvbnMgZm9yIGF2ZXJhZ2UgcG9vbC4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWx0ZXJXaWR0aCA9IGNvbnZJbmZvLmZpbHRlcldpZHRoO1xuICAgIGNvbnN0IHN0cmlkZUhlaWdodCA9IGNvbnZJbmZvLnN0cmlkZUhlaWdodDtcbiAgICBjb25zdCBzdHJpZGVXaWR0aCA9IGNvbnZJbmZvLnN0cmlkZVdpZHRoO1xuICAgIGNvbnN0IGRpbGF0aW9uSGVpZ2h0ID0gY29udkluZm8uZGlsYXRpb25IZWlnaHQ7XG4gICAgY29uc3QgZGlsYXRpb25XaWR0aCA9IGNvbnZJbmZvLmRpbGF0aW9uV2lkdGg7XG4gICAgY29uc3QgZWZmZWN0aXZlRmlsdGVySGVpZ2h0ID0gY29udkluZm8uZWZmZWN0aXZlRmlsdGVySGVpZ2h0O1xuICAgIGNvbnN0IGVmZmVjdGl2ZUZpbHRlcldpZHRoID0gY29udkluZm8uZWZmZWN0aXZlRmlsdGVyV2lkdGg7XG5cbiAgICBjb25zdCBwYWRUb3AgPSBjb252SW5mby5wYWRJbmZvLnRvcDtcbiAgICBjb25zdCBwYWRMZWZ0ID0gY29udkluZm8ucGFkSW5mby5sZWZ0O1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBjb252SW5mby5vdXRTaGFwZTtcblxuICAgIGNvbnN0IGlzQXZnUG9vbCA9IHBvb2xUeXBlID09PSAnYXZnJztcbiAgICBjb25zdCBiYXRjaEZsYXR0ZW5Qb3NpdGlvblN0ciA9IGAoKGJhdGNoICAqICR7Y29udkluZm8uaW5IZWlnaHR9ICsgeFIpICogJHtcbiAgICAgICAgY29udkluZm8uaW5XaWR0aH0gKyB4QykgKiAke2NvbnZJbmZvLmluQ2hhbm5lbHN9ICsgZGA7XG4gICAgY29uc3QgZmxhdHRlblBvc2l0aW9uU3RyID1cbiAgICAgICAgYCh4UiAqICR7Y29udkluZm8uaW5XaWR0aH0gKyB4QykgKiAke2NvbnZJbmZvLmluQ2hhbm5lbHN9ICsgZGA7XG5cbiAgICBsZXQgaW5pdGlhbGl6YXRpb25WYWx1ZSA9ICcwLjAnO1xuICAgIGlmICghaXNBdmdQb29sKSB7XG4gICAgICAvLyBXZWJHTCBvbiBGaXJlZm94IExpbnV4IGNhbid0IGNvbXBpbGUgMS8wIHNvIHdlIGRvIDEvZXBzLlxuICAgICAgaW5pdGlhbGl6YXRpb25WYWx1ZSA9ICctMS4wIC8gMWUtMjAnO1xuICAgIH1cblxuICAgIGlmIChjb21wdXRlUG9zaXRpb25zKSB7XG4gICAgICBjb25zdCBjb21wYXJlT3AgPSAnPj0nO1xuXG4gICAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgICBjb25zdCBpdmVjMiBzdHJpZGVzID0gaXZlYzIoJHtzdHJpZGVIZWlnaHR9LCAke3N0cmlkZVdpZHRofSk7XG4gICAgICAgIGNvbnN0IGl2ZWMyIHBhZHMgPSBpdmVjMigke3BhZFRvcH0sICR7cGFkTGVmdH0pO1xuXG4gICAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgICBpdmVjNCBjb29yZHMgPSBnZXRPdXRwdXRDb29yZHMoKTtcbiAgICAgICAgICBpbnQgYmF0Y2ggPSBjb29yZHNbMF07XG4gICAgICAgICAgaW50IGQgPSBjb29yZHNbM107XG5cbiAgICAgICAgICBpdmVjMiB4UkNDb3JuZXIgPSBjb29yZHMueXogKiBzdHJpZGVzIC0gcGFkcztcbiAgICAgICAgICBpbnQgeFJDb3JuZXIgPSB4UkNDb3JuZXIueDtcbiAgICAgICAgICBpbnQgeENDb3JuZXIgPSB4UkNDb3JuZXIueTtcblxuICAgICAgICAgIC8vIG1heC9taW4geCg/LCA/LCBkKSB0byBnZXQgeSh5UiwgeUMsIGQpLlxuICAgICAgICAgIC8vID8gPSB0byBiZSBkZXRlcm1pbmVkXG4gICAgICAgICAgZmxvYXQgbWluTWF4VmFsdWUgPSAwLjA7XG4gICAgICAgICAgZmxvYXQgbWluTWF4VmFsdWVGb3VuZCA9IDAuMDtcbiAgICAgICAgICBpbnQgbWluTWF4UG9zaXRpb24gPSAwO1xuICAgICAgICAgIGZsb2F0IGF2Z1ZhbHVlID0gMC4wO1xuXG4gICAgICAgICAgZm9yIChpbnQgd1IgPSAwOyB3UiA8ICR7ZWZmZWN0aXZlRmlsdGVySGVpZ2h0fTtcbiAgICAgICAgICAgICAgd1IgKz0gJHtkaWxhdGlvbkhlaWdodH0pIHtcbiAgICAgICAgICAgIGludCB4UiA9IHhSQ29ybmVyICsgd1I7XG5cbiAgICAgICAgICAgIGlmICh4UiA8IDAgfHwgeFIgPj0gJHtjb252SW5mby5pbkhlaWdodH0pIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoaW50IHdDID0gMDsgd0MgPCAke2VmZmVjdGl2ZUZpbHRlcldpZHRofTtcbiAgICAgICAgICAgICAgICB3QyArPSAke2RpbGF0aW9uV2lkdGh9KSB7XG4gICAgICAgICAgICAgIGludCB4QyA9IHhDQ29ybmVyICsgd0M7XG5cbiAgICAgICAgICAgICAgaWYgKHhDIDwgMCB8fCB4QyA+PSAke2NvbnZJbmZvLmluV2lkdGh9KSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBmbG9hdCB2YWx1ZSA9IGdldFgoYmF0Y2gsIHhSLCB4QywgZCk7XG5cbiAgICAgICAgICAgICAgLy8gSWYgYSBtaW4gLyBtYXggdmFsdWUgaGFzIGFscmVhZHkgYmVlbiBmb3VuZCwgdXNlIGl0LiBJZiBub3QsXG4gICAgICAgICAgICAgIC8vIHVzZSB0aGUgY3VycmVudCB2YWx1ZS5cbiAgICAgICAgICAgICAgZmxvYXQgY3Vyck1pbk1heFZhbHVlID0gbWl4KFxuICAgICAgICAgICAgICAgICAgdmFsdWUsIG1pbk1heFZhbHVlLCBtaW5NYXhWYWx1ZUZvdW5kKTtcbiAgICAgICAgICAgICAgaWYgKHZhbHVlICR7Y29tcGFyZU9wfSBjdXJyTWluTWF4VmFsdWUpIHtcbiAgICAgICAgICAgICAgICBtaW5NYXhWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIG1pbk1heFZhbHVlRm91bmQgPSAxLjA7XG4gICAgICAgICAgICAgICAgbWluTWF4UG9zaXRpb24gPSAke1xuICAgICAgICAgIGZsYXR0ZW5Qb3NpdGlvbnMgPyAoaW5jbHVkZUJhdGNoSW5JbmRleCA/IGJhdGNoRmxhdHRlblBvc2l0aW9uU3RyIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGF0dGVuUG9zaXRpb25TdHIpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHdSICogJHtlZmZlY3RpdmVGaWx0ZXJXaWR0aH0gKyB3Q2B9O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHNldE91dHB1dChmbG9hdChtaW5NYXhQb3NpdGlvbikpO1xuICAgICAgICB9XG4gICAgICBgO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbXBhcmVPcCA9ICdtYXgnO1xuXG4gICAgbGV0IHJldHVyblZhbHVlID0gYCR7cG9vbFR5cGV9KCR7cG9vbFR5cGV9KCR7cG9vbFR5cGV9KGAgK1xuICAgICAgICAnbWluTWF4VmFsdWVbMF0sIG1pbk1heFZhbHVlWzFdKSwgbWluTWF4VmFsdWVbMl0pLCBtaW5NYXhWYWx1ZVszXSknO1xuICAgIGlmIChwb29sVHlwZSA9PT0gJ2F2ZycpIHtcbiAgICAgIHJldHVyblZhbHVlID0gYGF2Z1ZhbHVlIC8gY291bnRgO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbHRlcldpZHRoTmVhcmVzdFZlYzQgPSBNYXRoLmZsb29yKGZpbHRlcldpZHRoIC8gNCkgKiA0O1xuICAgIGNvbnN0IGZpbHRlcldpZHRoVmVjNFJlbWFpbmRlciA9IGZpbHRlcldpZHRoICUgNDtcblxuICAgIGNvbnN0IHVwZGF0ZVNuaXBwZXQgPSBgXG4gICAgICBpZiAoJHtpc0F2Z1Bvb2x9KSB7XG4gICAgICAgIGF2Z1ZhbHVlICs9IGRvdCh2YWx1ZXMsIG9uZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWluTWF4VmFsdWUgPSAke2NvbXBhcmVPcH0odmFsdWVzLCBtaW5NYXhWYWx1ZSk7XG4gICAgICB9XG4gICAgYDtcblxuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICBjb25zdCBpdmVjMiBzdHJpZGVzID0gaXZlYzIoJHtzdHJpZGVIZWlnaHR9LCAke3N0cmlkZVdpZHRofSk7XG4gICAgICBjb25zdCBpdmVjMiBwYWRzID0gaXZlYzIoJHtwYWRUb3B9LCAke3BhZExlZnR9KTtcbiAgICAgIGNvbnN0IGZsb2F0IGluaXRpYWxpemF0aW9uVmFsdWUgPSAke2luaXRpYWxpemF0aW9uVmFsdWV9O1xuICAgICAgY29uc3QgdmVjNCBvbmVzID0gdmVjNCgxLjAsIDEuMCwgMS4wLCAxLjApO1xuXG4gICAgICBmbG9hdCBjb3VudCA9IDAuMDtcblxuICAgICAgZmxvYXQgZ2V0VmFsdWUoaW50IGJhdGNoLCBpbnQgeFIsIGludCB4QywgaW50IGQpIHtcbiAgICAgICAgaWYgKHhDIDwgMCB8fCB4QyA+PSAke2NvbnZJbmZvLmluV2lkdGh9KSB7XG4gICAgICAgICAgcmV0dXJuIGluaXRpYWxpemF0aW9uVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY291bnQgKz0gMS4wO1xuICAgICAgICByZXR1cm4gZ2V0WChiYXRjaCwgeFIsIHhDLCBkKTtcbiAgICAgIH1cblxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICBpdmVjNCBjb29yZHMgPSBnZXRPdXRwdXRDb29yZHMoKTtcbiAgICAgICAgaW50IGJhdGNoID0gY29vcmRzWzBdO1xuICAgICAgICBpbnQgZCA9IGNvb3Jkc1szXTtcblxuICAgICAgICBpdmVjMiB4UkNDb3JuZXIgPSBjb29yZHMueXogKiBzdHJpZGVzIC0gcGFkcztcbiAgICAgICAgaW50IHhSQ29ybmVyID0geFJDQ29ybmVyLng7XG4gICAgICAgIGludCB4Q0Nvcm5lciA9IHhSQ0Nvcm5lci55O1xuXG4gICAgICAgIC8vIG1heC9taW4geCg/LCA/LCBkKSB0byBnZXQgeSh5UiwgeUMsIGQpLlxuICAgICAgICAvLyA/ID0gdG8gYmUgZGV0ZXJtaW5lZFxuICAgICAgICB2ZWM0IG1pbk1heFZhbHVlID0gdmVjNCgke2luaXRpYWxpemF0aW9uVmFsdWV9KTtcbiAgICAgICAgZmxvYXQgYXZnVmFsdWUgPSAwLjA7XG4gICAgICAgIGNvdW50ID0gMC4wO1xuXG4gICAgICAgIGZvciAoaW50IHdSID0gMDsgd1IgPCAke2VmZmVjdGl2ZUZpbHRlckhlaWdodH07XG4gICAgICAgICAgICB3UiArPSAke2RpbGF0aW9uSGVpZ2h0fSkge1xuICAgICAgICAgIGludCB4UiA9IHhSQ29ybmVyICsgd1I7XG5cbiAgICAgICAgICBpZiAoeFIgPCAwIHx8IHhSID49ICR7Y29udkluZm8uaW5IZWlnaHR9KSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGludCB3QyA9IDA7IHdDIDwgJHtmaWx0ZXJXaWR0aE5lYXJlc3RWZWM0fTsgd0MgKz0gNCkge1xuICAgICAgICAgICAgaW50IHhDID0geENDb3JuZXIgKyB3QyAqICR7ZGlsYXRpb25XaWR0aH07XG5cbiAgICAgICAgICAgIHZlYzQgdmFsdWVzID0gdmVjNChcbiAgICAgICAgICAgICAgZ2V0VmFsdWUoYmF0Y2gsIHhSLCB4QywgZCksXG4gICAgICAgICAgICAgIGdldFZhbHVlKGJhdGNoLCB4UiwgeEMgKyAke2RpbGF0aW9uV2lkdGh9LCBkKSxcbiAgICAgICAgICAgICAgZ2V0VmFsdWUoYmF0Y2gsIHhSLCB4QyArIDIgKiAke2RpbGF0aW9uV2lkdGh9LCBkKSxcbiAgICAgICAgICAgICAgZ2V0VmFsdWUoYmF0Y2gsIHhSLCB4QyArIDMgKiAke2RpbGF0aW9uV2lkdGh9LCBkKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgJHt1cGRhdGVTbmlwcGV0fVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGludCB4QyA9IHhDQ29ybmVyICsgJHtmaWx0ZXJXaWR0aE5lYXJlc3RWZWM0fTtcbiAgICAgICAgICBpZiAoJHtmaWx0ZXJXaWR0aFZlYzRSZW1haW5kZXIgPT09IDF9KSB7XG4gICAgICAgICAgICB2ZWM0IHZhbHVlcyA9IHZlYzQoXG4gICAgICAgICAgICAgIGdldFZhbHVlKGJhdGNoLCB4UiwgeEMsIGQpLFxuICAgICAgICAgICAgICBpbml0aWFsaXphdGlvblZhbHVlLFxuICAgICAgICAgICAgICBpbml0aWFsaXphdGlvblZhbHVlLFxuICAgICAgICAgICAgICBpbml0aWFsaXphdGlvblZhbHVlXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAke3VwZGF0ZVNuaXBwZXR9XG4gICAgICAgICAgfSBlbHNlIGlmICgke2ZpbHRlcldpZHRoVmVjNFJlbWFpbmRlciA9PT0gMn0pIHtcbiAgICAgICAgICAgIHZlYzQgdmFsdWVzID0gdmVjNChcbiAgICAgICAgICAgICAgZ2V0VmFsdWUoYmF0Y2gsIHhSLCB4QywgZCksXG4gICAgICAgICAgICAgIGdldFZhbHVlKGJhdGNoLCB4UiwgeEMgKyAke2RpbGF0aW9uV2lkdGh9LCBkKSxcbiAgICAgICAgICAgICAgaW5pdGlhbGl6YXRpb25WYWx1ZSxcbiAgICAgICAgICAgICAgaW5pdGlhbGl6YXRpb25WYWx1ZVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgJHt1cGRhdGVTbmlwcGV0fVxuICAgICAgICAgIH0gZWxzZSBpZiAoJHtmaWx0ZXJXaWR0aFZlYzRSZW1haW5kZXIgPT09IDN9KSB7XG4gICAgICAgICAgICB2ZWM0IHZhbHVlcyA9IHZlYzQoXG4gICAgICAgICAgICAgIGdldFZhbHVlKGJhdGNoLCB4UiwgeEMsIGQpLFxuICAgICAgICAgICAgICBnZXRWYWx1ZShiYXRjaCwgeFIsIHhDICsgJHtkaWxhdGlvbldpZHRofSwgZCksXG4gICAgICAgICAgICAgIGdldFZhbHVlKGJhdGNoLCB4UiwgeEMgKyAyICogJHtkaWxhdGlvbldpZHRofSwgZCksXG4gICAgICAgICAgICAgIGluaXRpYWxpemF0aW9uVmFsdWVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICR7dXBkYXRlU25pcHBldH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2V0T3V0cHV0KCR7cmV0dXJuVmFsdWV9KTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQb29sM0RQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsneCddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBjb252SW5mbzogYmFja2VuZF91dGlsLkNvbnYzREluZm8sIHBvb2xUeXBlOiAnbWF4J3wnYXZnJyxcbiAgICAgIGNvbXB1dGVQb3NpdGlvbnM6IGJvb2xlYW4sIGZsYXR0ZW5Qb3NpdGlvbnMgPSBmYWxzZSxcbiAgICAgIGluY2x1ZGVCYXRjaEluSW5kZXggPSBmYWxzZSkge1xuICAgIGlmIChwb29sVHlwZSA9PT0gJ2F2ZycgJiYgY29tcHV0ZVBvc2l0aW9ucykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY29tcHV0ZSBwb3NpdGlvbnMgZm9yIGF2ZXJhZ2UgcG9vbC4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWx0ZXJXaWR0aCA9IGNvbnZJbmZvLmZpbHRlcldpZHRoO1xuICAgIGNvbnN0IHN0cmlkZURlcHRoID0gY29udkluZm8uc3RyaWRlRGVwdGg7XG4gICAgY29uc3Qgc3RyaWRlSGVpZ2h0ID0gY29udkluZm8uc3RyaWRlSGVpZ2h0O1xuICAgIGNvbnN0IHN0cmlkZVdpZHRoID0gY29udkluZm8uc3RyaWRlV2lkdGg7XG4gICAgY29uc3QgZGlsYXRpb25EZXB0aCA9IGNvbnZJbmZvLmRpbGF0aW9uRGVwdGg7XG4gICAgY29uc3QgZGlsYXRpb25IZWlnaHQgPSBjb252SW5mby5kaWxhdGlvbkhlaWdodDtcbiAgICBjb25zdCBkaWxhdGlvbldpZHRoID0gY29udkluZm8uZGlsYXRpb25XaWR0aDtcbiAgICBjb25zdCBlZmZlY3RpdmVGaWx0ZXJEZXB0aCA9IGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlckRlcHRoO1xuICAgIGNvbnN0IGVmZmVjdGl2ZUZpbHRlckhlaWdodCA9IGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlckhlaWdodDtcbiAgICBjb25zdCBlZmZlY3RpdmVGaWx0ZXJXaWR0aCA9IGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlcldpZHRoO1xuXG4gICAgY29uc3QgcGFkRnJvbnQgPSBjb252SW5mby5wYWRJbmZvLmZyb250O1xuICAgIGNvbnN0IHBhZFRvcCA9IGNvbnZJbmZvLnBhZEluZm8udG9wO1xuICAgIGNvbnN0IHBhZExlZnQgPSBjb252SW5mby5wYWRJbmZvLmxlZnQ7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IGNvbnZJbmZvLm91dFNoYXBlO1xuXG4gICAgY29uc3QgaXNBdmdQb29sID0gcG9vbFR5cGUgPT09ICdhdmcnO1xuXG4gICAgbGV0IGluaXRpYWxpemF0aW9uVmFsdWUgPSAnMC4wJztcbiAgICBpZiAoIWlzQXZnUG9vbCkge1xuICAgICAgLy8gV2ViR0wgb24gRmlyZWZveCBMaW51eCBjYW4ndCBjb21waWxlIDEvMCBzbyB3ZSBkbyAxL2Vwcy5cbiAgICAgIGluaXRpYWxpemF0aW9uVmFsdWUgPSAnLTEuMCAvIDFlLTIwJztcbiAgICB9XG5cbiAgICBpZiAoY29tcHV0ZVBvc2l0aW9ucykge1xuICAgICAgY29uc3QgY29tcGFyZU9wID0gJz49JztcblxuICAgICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgICAgY29uc3QgaXZlYzMgc3RyaWRlcyA9XG4gICAgICAgICAgICBpdmVjMygke3N0cmlkZURlcHRofSwgJHtzdHJpZGVIZWlnaHR9LCAke3N0cmlkZVdpZHRofSk7XG4gICAgICAgIGNvbnN0IGl2ZWMzIHBhZHMgPSBpdmVjMygke3BhZEZyb250fSwgJHtwYWRUb3B9LCAke3BhZExlZnR9KTtcblxuICAgICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgICAgaXZlYzUgY29vcmRzID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gICAgICAgICAgaW50IGJhdGNoID0gY29vcmRzLng7XG4gICAgICAgICAgaW50IGNoID0gY29vcmRzLnU7XG5cbiAgICAgICAgICBpdmVjMyB4Q29ybmVyID0gaXZlYzMoY29vcmRzLnksIGNvb3Jkcy56LCBjb29yZHMudykgKiBzdHJpZGVzIC0gcGFkcztcbiAgICAgICAgICBpbnQgeERDb3JuZXIgPSB4Q29ybmVyLng7XG4gICAgICAgICAgaW50IHhSQ29ybmVyID0geENvcm5lci55O1xuICAgICAgICAgIGludCB4Q0Nvcm5lciA9IHhDb3JuZXIuejtcblxuICAgICAgICAgIC8vIG1heC9taW4geCg/LCA/LCA/LCBjaCkgdG8gZ2V0IHkoeUQsIHlSLCB5QywgY2gpLlxuICAgICAgICAgIC8vID8gPSB0byBiZSBkZXRlcm1pbmVkXG4gICAgICAgICAgZmxvYXQgbWluTWF4VmFsdWUgPSAwLjA7XG4gICAgICAgICAgZmxvYXQgbWluTWF4VmFsdWVGb3VuZCA9IDAuMDtcbiAgICAgICAgICBpbnQgbWluTWF4UG9zaXRpb24gPSAwO1xuXG4gICAgICAgICAgZm9yIChpbnQgd0QgPSAwOyB3RCA8ICR7ZWZmZWN0aXZlRmlsdGVyRGVwdGh9O1xuICAgICAgICAgICAgICB3RCArPSAke2RpbGF0aW9uRGVwdGh9KSB7XG4gICAgICAgICAgICBpbnQgeEQgPSB4RENvcm5lciArIHdEO1xuXG4gICAgICAgICAgICBpZiAoeEQgPCAwIHx8IHhEID49ICR7Y29udkluZm8uaW5EZXB0aH0pIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoaW50IHdSID0gMDsgd1IgPCAke2VmZmVjdGl2ZUZpbHRlckhlaWdodH07XG4gICAgICAgICAgICAgICAgd1IgKz0gJHtkaWxhdGlvbkhlaWdodH0pIHtcbiAgICAgICAgICAgICAgaW50IHhSID0geFJDb3JuZXIgKyB3UjtcblxuICAgICAgICAgICAgICBpZiAoeFIgPCAwIHx8IHhSID49ICR7Y29udkluZm8uaW5IZWlnaHR9KSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBmb3IgKGludCB3QyA9IDA7IHdDIDwgJHtlZmZlY3RpdmVGaWx0ZXJXaWR0aH07XG4gICAgICAgICAgICAgICAgICB3QyArPSAke2RpbGF0aW9uV2lkdGh9KSB7XG4gICAgICAgICAgICAgICAgaW50IHhDID0geENDb3JuZXIgKyB3QztcblxuICAgICAgICAgICAgICAgIGlmICh4QyA8IDAgfHwgeEMgPj0gJHtjb252SW5mby5pbldpZHRofSkge1xuICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZmxvYXQgdmFsdWUgPSBnZXRYKGJhdGNoLCB4RCwgeFIsIHhDLCBjaCk7XG5cbiAgICAgICAgICAgICAgICAvLyBJZiBhIG1pbiAvIG1heCB2YWx1ZSBoYXMgYWxyZWFkeSBiZWVuIGZvdW5kLCB1c2UgaXQuIElmIG5vdCxcbiAgICAgICAgICAgICAgICAvLyB1c2UgdGhlIGN1cnJlbnQgdmFsdWUuXG4gICAgICAgICAgICAgICAgZmxvYXQgY3Vyck1pbk1heFZhbHVlID0gbWl4KFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSwgbWluTWF4VmFsdWUsIG1pbk1heFZhbHVlRm91bmQpO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAke2NvbXBhcmVPcH0gY3Vyck1pbk1heFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICBtaW5NYXhWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgbWluTWF4VmFsdWVGb3VuZCA9IDEuMDtcbiAgICAgICAgICAgICAgICAgIG1pbk1heFBvc2l0aW9uID0gJHtcbiAgICAgICAgICBmbGF0dGVuUG9zaXRpb25zID9cbiAgICAgICAgICAgICAgKGluY2x1ZGVCYXRjaEluSW5kZXggP1xuICAgICAgICAgICAgICAgICAgIGAoKChiYXRjaCAqICR7Y29udkluZm8uaW5EZXB0aH0gKyB4RCkgKiAke1xuICAgICAgICAgICAgICAgICAgICAgICBjb252SW5mby5pbkhlaWdodH0gKyB4UikgKiAke2NvbnZJbmZvLmluV2lkdGh9ICsgeEMpICogJHtcbiAgICAgICAgICAgICAgICAgICAgICAgY29udkluZm8uaW5DaGFubmVsc30gKyBjaGAgOlxuICAgICAgICAgICAgICAgICAgIGAoKHhEICogJHtjb252SW5mby5pbkhlaWdodH0gKyB4UikgKiAke1xuICAgICAgICAgICAgICAgICAgICAgICBjb252SW5mby5pbldpZHRofSArIHhDKSAqICR7Y29udkluZm8uaW5DaGFubmVsc30gKyBjaGApIDpcbiAgICAgICAgICAgICAgYHdEICogJHtlZmZlY3RpdmVGaWx0ZXJIZWlnaHR9ICogJHtlZmZlY3RpdmVGaWx0ZXJXaWR0aH0gK1xuICAgICAgICAgICAgICAgICAgICAgIHdSICogJHtlZmZlY3RpdmVGaWx0ZXJXaWR0aH0gKyB3Q2B9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzZXRPdXRwdXQoZmxvYXQobWluTWF4UG9zaXRpb24pKTtcbiAgICAgICAgfVxuICAgICAgYDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb21wYXJlT3AgPSAnbWF4JztcblxuICAgIGxldCByZXR1cm5WYWx1ZSA9IGAke3Bvb2xUeXBlfSgke3Bvb2xUeXBlfSgke3Bvb2xUeXBlfShgICtcbiAgICAgICAgJ21pbk1heFZhbHVlWzBdLCBtaW5NYXhWYWx1ZVsxXSksIG1pbk1heFZhbHVlWzJdKSwgbWluTWF4VmFsdWVbM10pJztcbiAgICBpZiAocG9vbFR5cGUgPT09ICdhdmcnKSB7XG4gICAgICByZXR1cm5WYWx1ZSA9IGBhdmdWYWx1ZSAvIGNvdW50YDtcbiAgICB9XG5cbiAgICBjb25zdCBmaWx0ZXJXaWR0aE5lYXJlc3RWZWM0ID0gTWF0aC5mbG9vcihmaWx0ZXJXaWR0aCAvIDQpICogNDtcbiAgICBjb25zdCBmaWx0ZXJXaWR0aFZlYzRSZW1haW5kZXIgPSBmaWx0ZXJXaWR0aCAlIDQ7XG5cbiAgICBjb25zdCB1cGRhdGVTbmlwcGV0ID0gYFxuICAgICAgaWYgKCR7aXNBdmdQb29sfSkge1xuICAgICAgICBhdmdWYWx1ZSArPSBkb3QodmFsdWVzLCBvbmVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1pbk1heFZhbHVlID0gJHtjb21wYXJlT3B9KHZhbHVlcywgbWluTWF4VmFsdWUpO1xuICAgICAgfVxuICAgIGA7XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgY29uc3QgaXZlYzMgc3RyaWRlcyA9XG4gICAgICAgIGl2ZWMzKCR7c3RyaWRlRGVwdGh9LCAke3N0cmlkZUhlaWdodH0sICR7c3RyaWRlV2lkdGh9KTtcbiAgICAgIGNvbnN0IGl2ZWMzIHBhZHMgPSBpdmVjMygke3BhZEZyb250fSwgJHtwYWRUb3B9LCAke3BhZExlZnR9KTtcbiAgICAgIGNvbnN0IGZsb2F0IGluaXRpYWxpemF0aW9uVmFsdWUgPSAke2luaXRpYWxpemF0aW9uVmFsdWV9O1xuICAgICAgY29uc3QgdmVjNCBvbmVzID0gdmVjNCgxLjAsIDEuMCwgMS4wLCAxLjApO1xuXG4gICAgICBmbG9hdCBjb3VudCA9IDAuMDtcblxuICAgICAgZmxvYXQgZ2V0VmFsdWUoaW50IGJhdGNoLCBpbnQgeEQsIGludCB4UiwgaW50IHhDLCBpbnQgY2gpIHtcbiAgICAgICAgaWYgKHhDIDwgMCB8fCB4QyA+PSAke2NvbnZJbmZvLmluV2lkdGh9KSB7XG4gICAgICAgICAgcmV0dXJuIGluaXRpYWxpemF0aW9uVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY291bnQgKz0gMS4wO1xuICAgICAgICByZXR1cm4gZ2V0WChiYXRjaCwgeEQsIHhSLCB4QywgY2gpO1xuICAgICAgfVxuXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIGl2ZWM1IGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICBpbnQgYmF0Y2ggPSBjb29yZHMueDtcbiAgICAgICAgaW50IGNoID0gY29vcmRzLnU7XG5cbiAgICAgICAgaXZlYzMgeENvcm5lciA9IGl2ZWMzKGNvb3Jkcy55LCBjb29yZHMueiwgY29vcmRzLncpICogc3RyaWRlcyAtIHBhZHM7XG4gICAgICAgIGludCB4RENvcm5lciA9IHhDb3JuZXIueDtcbiAgICAgICAgaW50IHhSQ29ybmVyID0geENvcm5lci55O1xuICAgICAgICBpbnQgeENDb3JuZXIgPSB4Q29ybmVyLno7XG5cbiAgICAgICAgLy8gbWF4L21pbiB4KD8sID8sID8sIGQpIHRvIGdldCB5KHlELCB5UiwgeUMsIGNoKS5cbiAgICAgICAgLy8gPyA9IHRvIGJlIGRldGVybWluZWRcbiAgICAgICAgdmVjNCBtaW5NYXhWYWx1ZSA9IHZlYzQoJHtpbml0aWFsaXphdGlvblZhbHVlfSk7XG4gICAgICAgIGZsb2F0IGF2Z1ZhbHVlID0gMC4wO1xuICAgICAgICBjb3VudCA9IDAuMDtcblxuICAgICAgICBmb3IgKGludCB3RCA9IDA7IHdEIDwgJHtlZmZlY3RpdmVGaWx0ZXJEZXB0aH07XG4gICAgICAgICAgICB3RCArPSAke2RpbGF0aW9uRGVwdGh9KSB7XG4gICAgICAgICAgaW50IHhEID0geERDb3JuZXIgKyB3RDtcblxuICAgICAgICAgIGlmICh4RCA8IDAgfHwgeEQgPj0gJHtjb252SW5mby5pbkRlcHRofSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm9yIChpbnQgd1IgPSAwOyB3UiA8ICR7ZWZmZWN0aXZlRmlsdGVySGVpZ2h0fTtcbiAgICAgICAgICAgIHdSICs9ICR7ZGlsYXRpb25IZWlnaHR9KSB7XG4gICAgICAgICAgICBpbnQgeFIgPSB4UkNvcm5lciArIHdSO1xuXG4gICAgICAgICAgICBpZiAoeFIgPCAwIHx8IHhSID49ICR7Y29udkluZm8uaW5IZWlnaHR9KSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGludCB3QyA9IDA7IHdDIDwgJHtmaWx0ZXJXaWR0aE5lYXJlc3RWZWM0fTsgd0MgKz0gNCkge1xuICAgICAgICAgICAgICBpbnQgeEMgPSB4Q0Nvcm5lciArIHdDICogJHtkaWxhdGlvbldpZHRofTtcblxuICAgICAgICAgICAgICB2ZWM0IHZhbHVlcyA9IHZlYzQoXG4gICAgICAgICAgICAgICAgZ2V0VmFsdWUoYmF0Y2gsIHhELCB4UiwgeEMsIGNoKSxcbiAgICAgICAgICAgICAgICBnZXRWYWx1ZShiYXRjaCwgeEQsIHhSLCB4QyArICR7ZGlsYXRpb25XaWR0aH0sIGNoKSxcbiAgICAgICAgICAgICAgICBnZXRWYWx1ZShiYXRjaCwgeEQsIHhSLCB4QyArIDIgKiAke2RpbGF0aW9uV2lkdGh9LCBjaCksXG4gICAgICAgICAgICAgICAgZ2V0VmFsdWUoYmF0Y2gsIHhELCB4UiwgeEMgKyAzICogJHtkaWxhdGlvbldpZHRofSwgY2gpXG4gICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgJHt1cGRhdGVTbmlwcGV0fVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbnQgeEMgPSB4Q0Nvcm5lciArICR7ZmlsdGVyV2lkdGhOZWFyZXN0VmVjNH07XG4gICAgICAgICAgICBpZiAoJHtmaWx0ZXJXaWR0aFZlYzRSZW1haW5kZXIgPT09IDF9KSB7XG4gICAgICAgICAgICAgIHZlYzQgdmFsdWVzID0gdmVjNChcbiAgICAgICAgICAgICAgICBnZXRWYWx1ZShiYXRjaCwgeEQsIHhSLCB4QywgY2gpLFxuICAgICAgICAgICAgICAgIGluaXRpYWxpemF0aW9uVmFsdWUsXG4gICAgICAgICAgICAgICAgaW5pdGlhbGl6YXRpb25WYWx1ZSxcbiAgICAgICAgICAgICAgICBpbml0aWFsaXphdGlvblZhbHVlXG4gICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgJHt1cGRhdGVTbmlwcGV0fVxuICAgICAgICAgICAgfSBlbHNlIGlmICgke2ZpbHRlcldpZHRoVmVjNFJlbWFpbmRlciA9PT0gMn0pIHtcbiAgICAgICAgICAgICAgdmVjNCB2YWx1ZXMgPSB2ZWM0KFxuICAgICAgICAgICAgICAgIGdldFZhbHVlKGJhdGNoLCB4RCwgeFIsIHhDLCBjaCksXG4gICAgICAgICAgICAgICAgZ2V0VmFsdWUoYmF0Y2gsIHhELCB4UiwgeEMgKyAke2RpbGF0aW9uV2lkdGh9LCBjaCksXG4gICAgICAgICAgICAgICAgaW5pdGlhbGl6YXRpb25WYWx1ZSxcbiAgICAgICAgICAgICAgICBpbml0aWFsaXphdGlvblZhbHVlXG4gICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgJHt1cGRhdGVTbmlwcGV0fVxuICAgICAgICAgICAgfSBlbHNlIGlmICgke2ZpbHRlcldpZHRoVmVjNFJlbWFpbmRlciA9PT0gM30pIHtcbiAgICAgICAgICAgICAgdmVjNCB2YWx1ZXMgPSB2ZWM0KFxuICAgICAgICAgICAgICAgIGdldFZhbHVlKGJhdGNoLCB4RCwgeFIsIHhDLCBjaCksXG4gICAgICAgICAgICAgICAgZ2V0VmFsdWUoYmF0Y2gsIHhELCB4UiwgeEMgKyAke2RpbGF0aW9uV2lkdGh9LCBjaCksXG4gICAgICAgICAgICAgICAgZ2V0VmFsdWUoYmF0Y2gsIHhELCB4UiwgeEMgKyAyICogJHtkaWxhdGlvbldpZHRofSwgY2gpLFxuICAgICAgICAgICAgICAgIGluaXRpYWxpemF0aW9uVmFsdWVcbiAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAke3VwZGF0ZVNuaXBwZXR9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHNldE91dHB1dCgke3JldHVyblZhbHVlfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG4iXX0=