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
export class Conv2DProgram {
    constructor(convInfo, addBias = false, activation = null, hasPreluActivationWeights = false, hasLeakyreluAlpha = false) {
        this.variableNames = ['x', 'W'];
        this.outputShape = convInfo.outShape;
        const padTop = convInfo.padInfo.top;
        const padLeft = convInfo.padInfo.left;
        const strideHeight = convInfo.strideHeight;
        const strideWidth = convInfo.strideWidth;
        const dilationHeight = convInfo.dilationHeight;
        const dilationWidth = convInfo.dilationWidth;
        const filterHeight = convInfo.filterHeight;
        const filterWidth = convInfo.filterWidth;
        const inputDepthNearestVec4 = Math.floor(convInfo.inChannels / 4) * 4;
        const inputDepthVec4Remainder = convInfo.inChannels % 4;
        const isChannelsLast = convInfo.dataFormat === 'channelsLast';
        const rowDim = isChannelsLast ? 1 : 2;
        const colDim = isChannelsLast ? 2 : 3;
        const channelDim = isChannelsLast ? 3 : 1;
        let activationSnippet = '', applyActivationSnippet = '';
        if (activation) {
            if (hasPreluActivationWeights) {
                activationSnippet = `float activation(float a) {
          float b = getPreluActivationWeightsAtOutCoords();
          ${activation}
        }`;
            }
            else if (hasLeakyreluAlpha) {
                activationSnippet = `float activation(float a) {
          float b = getLeakyreluAlphaAtOutCoords();
          ${activation}
        }`;
            }
            else {
                activationSnippet = `
          float activation(float x) {
            ${activation}
          }
        `;
            }
            applyActivationSnippet = `result = activation(result);`;
        }
        const addBiasSnippet = addBias ? 'result += getBiasAtOutCoords();' : '';
        if (addBias) {
            this.variableNames.push('bias');
        }
        if (hasPreluActivationWeights) {
            this.variableNames.push('preluActivationWeights');
        }
        if (hasLeakyreluAlpha) {
            this.variableNames.push('leakyreluAlpha');
        }
        this.userCode = `
      ${activationSnippet}

      const ivec2 strides = ivec2(${strideHeight}, ${strideWidth});
      const ivec2 pads = ivec2(${padTop}, ${padLeft});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d2 = coords[${channelDim}];

        ivec2 xRCCorner =
            ivec2(coords[${rowDim}], coords[${colDim}]) * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, d2) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${filterHeight}; wR++) {
          int xR = xRCorner + wR * ${dilationHeight};

          if (xR < 0 || xR >= ${convInfo.inHeight}) {
            continue;
          }

          for (int wC = 0; wC < ${filterWidth}; wC++) {
            int xC = xCCorner + wC * ${dilationWidth};

            if (xC < 0 || xC >= ${convInfo.inWidth}) {
              continue;
            }

            for (int d1 = 0; d1 < ${inputDepthNearestVec4}; d1 += 4) {
              vec4 wValues = vec4(
                getW(wR, wC, d1, d2),
                getW(wR, wC, d1 + 1, d2),
                getW(wR, wC, d1 + 2, d2),
                getW(wR, wC, d1 + 3, d2)
              );

              if (${isChannelsLast}) {
                vec4 xValues = vec4(
                  getX(batch, xR, xC, d1),
                  getX(batch, xR, xC, d1 + 1),
                  getX(batch, xR, xC, d1 + 2),
                  getX(batch, xR, xC, d1 + 3)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec4 xValues = vec4(
                  getX(batch, d1, xR, xC),
                  getX(batch, d1 + 1, xR, xC),
                  getX(batch, d1 + 2, xR, xC),
                  getX(batch, d1 + 3, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }
            }

            if (${inputDepthVec4Remainder === 1}) {

              if (${isChannelsLast}) {
                dotProd +=
                    getX(batch, xR, xC, ${inputDepthNearestVec4}) *
                    getW(wR, wC, ${inputDepthNearestVec4}, d2);
              } else {
                dotProd +=
                    getX(batch, ${inputDepthNearestVec4}, xR, xC) *
                    getW(wR, wC, ${inputDepthNearestVec4}, d2);
              }

            } else if (${inputDepthVec4Remainder === 2}) {
              vec2 wValues = vec2(
                getW(wR, wC, ${inputDepthNearestVec4}, d2),
                getW(wR, wC, ${inputDepthNearestVec4} + 1, d2)
              );

              if (${isChannelsLast}) {
                vec2 xValues = vec2(
                  getX(batch, xR, xC, ${inputDepthNearestVec4}),
                  getX(batch, xR, xC, ${inputDepthNearestVec4} + 1)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec2 xValues = vec2(
                  getX(batch, ${inputDepthNearestVec4}, xR, xC),
                  getX(batch, ${inputDepthNearestVec4} + 1, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            } else if (${inputDepthVec4Remainder === 3}) {
              vec3 wValues = vec3(
                getW(wR, wC, ${inputDepthNearestVec4}, d2),
                getW(wR, wC, ${inputDepthNearestVec4} + 1, d2),
                getW(wR, wC, ${inputDepthNearestVec4} + 2, d2)
              );

              if (${isChannelsLast}) {
                vec3 xValues = vec3(
                  getX(batch, xR, xC, ${inputDepthNearestVec4}),
                  getX(batch, xR, xC, ${inputDepthNearestVec4} + 1),
                  getX(batch, xR, xC, ${inputDepthNearestVec4} + 2)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec3 xValues = vec3(
                  getX(batch, ${inputDepthNearestVec4}, xR, xC),
                  getX(batch, ${inputDepthNearestVec4} + 1, xR, xC),
                  getX(batch, ${inputDepthNearestVec4} + 2, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            }
          }
        }

        float result = dotProd;
        ${addBiasSnippet}
        ${applyActivationSnippet}
        setOutput(result);
      }
    `;
    }
}
export class Conv3DProgram {
    constructor(convInfo) {
        this.variableNames = ['x', 'W'];
        this.outputShape = convInfo.outShape;
        const padFront = convInfo.padInfo.front;
        const padTop = convInfo.padInfo.top;
        const padLeft = convInfo.padInfo.left;
        const strideDepth = convInfo.strideDepth;
        const strideHeight = convInfo.strideHeight;
        const strideWidth = convInfo.strideWidth;
        const dilationDepth = convInfo.dilationDepth;
        const dilationHeight = convInfo.dilationHeight;
        const dilationWidth = convInfo.dilationWidth;
        const filterDepth = convInfo.filterDepth;
        const filterHeight = convInfo.filterHeight;
        const filterWidth = convInfo.filterWidth;
        const inputDepthNearestVec4 = Math.floor(convInfo.inChannels / 4) * 4;
        const inputDepthVec4Remainder = convInfo.inChannels % 4;
        this.userCode = `
      const ivec3 strides = ivec3(${strideDepth}, ${strideHeight}, ${strideWidth});
      const ivec3 pads = ivec3(${padFront}, ${padTop}, ${padLeft});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int d2 = coords.u;

        ivec3 xFRCCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xFCorner = xFRCCorner.x;
        int xRCorner = xFRCCorner.y;
        int xCCorner = xFRCCorner.z;

        // Convolve x(?, ?, ?, d1) with w(:, :, :, d1, d2) to get
        // y(yF, yR, yC, d2). ? = to be determined. : = across all
        // values in that axis.
        float dotProd = 0.0;
        for (int wF = 0; wF < ${filterDepth}; wF++) {
          int xF = xFCorner + wF * ${dilationDepth};

          if (xF < 0 || xF >= ${convInfo.inDepth}) {
            continue;
          }

          for (int wR = 0; wR < ${filterHeight}; wR++) {
            int xR = xRCorner + wR * ${dilationHeight};

            if (xR < 0 || xR >= ${convInfo.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${filterWidth}; wC++) {
              int xC = xCCorner + wC * ${dilationWidth};

              if (xC < 0 || xC >= ${convInfo.inWidth}) {
                continue;
              }

              for (int d1 = 0; d1 < ${inputDepthNearestVec4}; d1 += 4) {
                vec4 xValues = vec4(
                  getX(batch, xF, xR, xC, d1),
                  getX(batch, xF, xR, xC, d1 + 1),
                  getX(batch, xF, xR, xC, d1 + 2),
                  getX(batch, xF, xR, xC, d1 + 3)
                );
                vec4 wValues = vec4(
                  getW(wF, wR, wC, d1, d2),
                  getW(wF, wR, wC, d1 + 1, d2),
                  getW(wF, wR, wC, d1 + 2, d2),
                  getW(wF, wR, wC, d1 + 3, d2)
                );

                dotProd += dot(xValues, wValues);
              }

              if (${inputDepthVec4Remainder === 1}) {
                dotProd +=
                  getX(batch, xF, xR, xC, ${inputDepthNearestVec4}) *
                  getW(wF, wR, wC, ${inputDepthNearestVec4}, d2);
              } else if (${inputDepthVec4Remainder === 2}) {
                vec2 xValues = vec2(
                  getX(batch, xF, xR, xC, ${inputDepthNearestVec4}),
                  getX(batch, xF, xR, xC, ${inputDepthNearestVec4} + 1)
                );
                vec2 wValues = vec2(
                  getW(wF, wR, wC, ${inputDepthNearestVec4}, d2),
                  getW(wF, wR, wC, ${inputDepthNearestVec4} + 1, d2)
                );
                dotProd += dot(xValues, wValues);
              } else if (${inputDepthVec4Remainder === 3}) {
                vec3 xValues = vec3(
                  getX(batch, xF, xR, xC, ${inputDepthNearestVec4}),
                  getX(batch, xF, xR, xC, ${inputDepthNearestVec4} + 1),
                  getX(batch, xF, xR, xC, ${inputDepthNearestVec4} + 2)
                );
                vec3 wValues = vec3(
                  getW(wF, wR, wC, ${inputDepthNearestVec4}, d2),
                  getW(wF, wR, wC, ${inputDepthNearestVec4} + 1, d2),
                  getW(wF, wR, wC, ${inputDepthNearestVec4} + 2, d2)
                );
                dotProd += dot(xValues, wValues);
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udl9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2NvbnZfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUtILE1BQU0sT0FBTyxhQUFhO0lBS3hCLFlBQ0ksUUFBaUMsRUFBRSxPQUFPLEdBQUcsS0FBSyxFQUNsRCxhQUFxQixJQUFJLEVBQUUseUJBQXlCLEdBQUcsS0FBSyxFQUM1RCxpQkFBaUIsR0FBRyxLQUFLO1FBUDdCLGtCQUFhLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFRekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO1FBQ3JDLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO1FBQ3BDLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ3RDLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7UUFDM0MsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztRQUN6QyxNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDO1FBQy9DLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUM7UUFDN0MsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQztRQUMzQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO1FBRXpDLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0RSxNQUFNLHVCQUF1QixHQUFHLFFBQVEsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxVQUFVLEtB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dUJBQXVCLEtBQUssQ0FBQzs7NENBRVoscUJBQXFCOzRDQUNyQixxQkFBcUI7OztxQ0FHNUIscUJBQXFCO3FDQUNyQixxQkFBcUI7OzsyQkFHL0IsdUJBQXVCLEtBQUssQ0FBQzs7NENBRVoscUJBQXFCOzRDQUNyQixxQkFBcUI7NENBQ3JCLHFCQUFxQjs7O3FDQUc1QixxQkFBcUI7cUNBQ3JCLHFCQUFxQjtxQ0FDckIscUJBQXFCOzs7Ozs7Ozs7S0FTckQsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtiYWNrZW5kX3V0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5pbXBvcnQge0dQR1BVUHJvZ3JhbX0gZnJvbSAnLi9ncGdwdV9tYXRoJztcblxuZXhwb3J0IGNsYXNzIENvbnYyRFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWyd4JywgJ1cnXTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgY29udkluZm86IGJhY2tlbmRfdXRpbC5Db252MkRJbmZvLCBhZGRCaWFzID0gZmFsc2UsXG4gICAgICBhY3RpdmF0aW9uOiBzdHJpbmcgPSBudWxsLCBoYXNQcmVsdUFjdGl2YXRpb25XZWlnaHRzID0gZmFsc2UsXG4gICAgICBoYXNMZWFreXJlbHVBbHBoYSA9IGZhbHNlKSB7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IGNvbnZJbmZvLm91dFNoYXBlO1xuICAgIGNvbnN0IHBhZFRvcCA9IGNvbnZJbmZvLnBhZEluZm8udG9wO1xuICAgIGNvbnN0IHBhZExlZnQgPSBjb252SW5mby5wYWRJbmZvLmxlZnQ7XG4gICAgY29uc3Qgc3RyaWRlSGVpZ2h0ID0gY29udkluZm8uc3RyaWRlSGVpZ2h0O1xuICAgIGNvbnN0IHN0cmlkZVdpZHRoID0gY29udkluZm8uc3RyaWRlV2lkdGg7XG4gICAgY29uc3QgZGlsYXRpb25IZWlnaHQgPSBjb252SW5mby5kaWxhdGlvbkhlaWdodDtcbiAgICBjb25zdCBkaWxhdGlvbldpZHRoID0gY29udkluZm8uZGlsYXRpb25XaWR0aDtcbiAgICBjb25zdCBmaWx0ZXJIZWlnaHQgPSBjb252SW5mby5maWx0ZXJIZWlnaHQ7XG4gICAgY29uc3QgZmlsdGVyV2lkdGggPSBjb252SW5mby5maWx0ZXJXaWR0aDtcblxuICAgIGNvbnN0IGlucHV0RGVwdGhOZWFyZXN0VmVjNCA9IE1hdGguZmxvb3IoY29udkluZm8uaW5DaGFubmVscyAvIDQpICogNDtcbiAgICBjb25zdCBpbnB1dERlcHRoVmVjNFJlbWFpbmRlciA9IGNvbnZJbmZvLmluQ2hhbm5lbHMgJSA0O1xuICAgIGNvbnN0IGlzQ2hhbm5lbHNMYXN0ID0gY29udkluZm8uZGF0YUZvcm1hdCA9PT0gJ2NoYW5uZWxzTGFzdCc7XG5cbiAgICBjb25zdCByb3dEaW0gPSBpc0NoYW5uZWxzTGFzdCA/IDEgOiAyO1xuICAgIGNvbnN0IGNvbERpbSA9IGlzQ2hhbm5lbHNMYXN0ID8gMiA6IDM7XG4gICAgY29uc3QgY2hhbm5lbERpbSA9IGlzQ2hhbm5lbHNMYXN0ID8gMyA6IDE7XG5cbiAgICBsZXQgYWN0aXZhdGlvblNuaXBwZXQgPSAnJywgYXBwbHlBY3RpdmF0aW9uU25pcHBldCA9ICcnO1xuICAgIGlmIChhY3RpdmF0aW9uKSB7XG4gICAgICBpZiAoaGFzUHJlbHVBY3RpdmF0aW9uV2VpZ2h0cykge1xuICAgICAgICBhY3RpdmF0aW9uU25pcHBldCA9IGBmbG9hdCBhY3RpdmF0aW9uKGZsb2F0IGEpIHtcbiAgICAgICAgICBmbG9hdCBiID0gZ2V0UHJlbHVBY3RpdmF0aW9uV2VpZ2h0c0F0T3V0Q29vcmRzKCk7XG4gICAgICAgICAgJHthY3RpdmF0aW9ufVxuICAgICAgICB9YDtcbiAgICAgIH0gZWxzZSBpZiAoaGFzTGVha3lyZWx1QWxwaGEpIHtcbiAgICAgICAgYWN0aXZhdGlvblNuaXBwZXQgPSBgZmxvYXQgYWN0aXZhdGlvbihmbG9hdCBhKSB7XG4gICAgICAgICAgZmxvYXQgYiA9IGdldExlYWt5cmVsdUFscGhhQXRPdXRDb29yZHMoKTtcbiAgICAgICAgICAke2FjdGl2YXRpb259XG4gICAgICAgIH1gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWN0aXZhdGlvblNuaXBwZXQgPSBgXG4gICAgICAgICAgZmxvYXQgYWN0aXZhdGlvbihmbG9hdCB4KSB7XG4gICAgICAgICAgICAke2FjdGl2YXRpb259XG4gICAgICAgICAgfVxuICAgICAgICBgO1xuICAgICAgfVxuXG4gICAgICBhcHBseUFjdGl2YXRpb25TbmlwcGV0ID0gYHJlc3VsdCA9IGFjdGl2YXRpb24ocmVzdWx0KTtgO1xuICAgIH1cblxuICAgIGNvbnN0IGFkZEJpYXNTbmlwcGV0ID0gYWRkQmlhcyA/ICdyZXN1bHQgKz0gZ2V0Qmlhc0F0T3V0Q29vcmRzKCk7JyA6ICcnO1xuICAgIGlmIChhZGRCaWFzKSB7XG4gICAgICB0aGlzLnZhcmlhYmxlTmFtZXMucHVzaCgnYmlhcycpO1xuICAgIH1cblxuICAgIGlmIChoYXNQcmVsdUFjdGl2YXRpb25XZWlnaHRzKSB7XG4gICAgICB0aGlzLnZhcmlhYmxlTmFtZXMucHVzaCgncHJlbHVBY3RpdmF0aW9uV2VpZ2h0cycpO1xuICAgIH1cblxuICAgIGlmIChoYXNMZWFreXJlbHVBbHBoYSkge1xuICAgICAgdGhpcy52YXJpYWJsZU5hbWVzLnB1c2goJ2xlYWt5cmVsdUFscGhhJyk7XG4gICAgfVxuXG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgICR7YWN0aXZhdGlvblNuaXBwZXR9XG5cbiAgICAgIGNvbnN0IGl2ZWMyIHN0cmlkZXMgPSBpdmVjMigke3N0cmlkZUhlaWdodH0sICR7c3RyaWRlV2lkdGh9KTtcbiAgICAgIGNvbnN0IGl2ZWMyIHBhZHMgPSBpdmVjMigke3BhZFRvcH0sICR7cGFkTGVmdH0pO1xuXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIGl2ZWM0IGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICBpbnQgYmF0Y2ggPSBjb29yZHNbMF07XG4gICAgICAgIGludCBkMiA9IGNvb3Jkc1ske2NoYW5uZWxEaW19XTtcblxuICAgICAgICBpdmVjMiB4UkNDb3JuZXIgPVxuICAgICAgICAgICAgaXZlYzIoY29vcmRzWyR7cm93RGltfV0sIGNvb3Jkc1ske2NvbERpbX1dKSAqIHN0cmlkZXMgLSBwYWRzO1xuICAgICAgICBpbnQgeFJDb3JuZXIgPSB4UkNDb3JuZXIueDtcbiAgICAgICAgaW50IHhDQ29ybmVyID0geFJDQ29ybmVyLnk7XG5cbiAgICAgICAgLy8gQ29udm9sdmUgeCg/LCA/LCBkMSkgd2l0aCB3KDosIDosIGQxLCBkMikgdG8gZ2V0IHkoeVIsIHlDLCBkMikuXG4gICAgICAgIC8vID8gPSB0byBiZSBkZXRlcm1pbmVkLiA6ID0gYWNyb3NzIGFsbCB2YWx1ZXMgaW4gdGhhdCBheGlzLlxuICAgICAgICBmbG9hdCBkb3RQcm9kID0gMC4wO1xuICAgICAgICBmb3IgKGludCB3UiA9IDA7IHdSIDwgJHtmaWx0ZXJIZWlnaHR9OyB3UisrKSB7XG4gICAgICAgICAgaW50IHhSID0geFJDb3JuZXIgKyB3UiAqICR7ZGlsYXRpb25IZWlnaHR9O1xuXG4gICAgICAgICAgaWYgKHhSIDwgMCB8fCB4UiA+PSAke2NvbnZJbmZvLmluSGVpZ2h0fSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm9yIChpbnQgd0MgPSAwOyB3QyA8ICR7ZmlsdGVyV2lkdGh9OyB3QysrKSB7XG4gICAgICAgICAgICBpbnQgeEMgPSB4Q0Nvcm5lciArIHdDICogJHtkaWxhdGlvbldpZHRofTtcblxuICAgICAgICAgICAgaWYgKHhDIDwgMCB8fCB4QyA+PSAke2NvbnZJbmZvLmluV2lkdGh9KSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGludCBkMSA9IDA7IGQxIDwgJHtpbnB1dERlcHRoTmVhcmVzdFZlYzR9OyBkMSArPSA0KSB7XG4gICAgICAgICAgICAgIHZlYzQgd1ZhbHVlcyA9IHZlYzQoXG4gICAgICAgICAgICAgICAgZ2V0Vyh3Uiwgd0MsIGQxLCBkMiksXG4gICAgICAgICAgICAgICAgZ2V0Vyh3Uiwgd0MsIGQxICsgMSwgZDIpLFxuICAgICAgICAgICAgICAgIGdldFcod1IsIHdDLCBkMSArIDIsIGQyKSxcbiAgICAgICAgICAgICAgICBnZXRXKHdSLCB3QywgZDEgKyAzLCBkMilcbiAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICBpZiAoJHtpc0NoYW5uZWxzTGFzdH0pIHtcbiAgICAgICAgICAgICAgICB2ZWM0IHhWYWx1ZXMgPSB2ZWM0KFxuICAgICAgICAgICAgICAgICAgZ2V0WChiYXRjaCwgeFIsIHhDLCBkMSksXG4gICAgICAgICAgICAgICAgICBnZXRYKGJhdGNoLCB4UiwgeEMsIGQxICsgMSksXG4gICAgICAgICAgICAgICAgICBnZXRYKGJhdGNoLCB4UiwgeEMsIGQxICsgMiksXG4gICAgICAgICAgICAgICAgICBnZXRYKGJhdGNoLCB4UiwgeEMsIGQxICsgMylcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGRvdFByb2QgKz0gZG90KHhWYWx1ZXMsIHdWYWx1ZXMpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZlYzQgeFZhbHVlcyA9IHZlYzQoXG4gICAgICAgICAgICAgICAgICBnZXRYKGJhdGNoLCBkMSwgeFIsIHhDKSxcbiAgICAgICAgICAgICAgICAgIGdldFgoYmF0Y2gsIGQxICsgMSwgeFIsIHhDKSxcbiAgICAgICAgICAgICAgICAgIGdldFgoYmF0Y2gsIGQxICsgMiwgeFIsIHhDKSxcbiAgICAgICAgICAgICAgICAgIGdldFgoYmF0Y2gsIGQxICsgMywgeFIsIHhDKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgZG90UHJvZCArPSBkb3QoeFZhbHVlcywgd1ZhbHVlcyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCR7aW5wdXREZXB0aFZlYzRSZW1haW5kZXIgPT09IDF9KSB7XG5cbiAgICAgICAgICAgICAgaWYgKCR7aXNDaGFubmVsc0xhc3R9KSB7XG4gICAgICAgICAgICAgICAgZG90UHJvZCArPVxuICAgICAgICAgICAgICAgICAgICBnZXRYKGJhdGNoLCB4UiwgeEMsICR7aW5wdXREZXB0aE5lYXJlc3RWZWM0fSkgKlxuICAgICAgICAgICAgICAgICAgICBnZXRXKHdSLCB3QywgJHtpbnB1dERlcHRoTmVhcmVzdFZlYzR9LCBkMik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZG90UHJvZCArPVxuICAgICAgICAgICAgICAgICAgICBnZXRYKGJhdGNoLCAke2lucHV0RGVwdGhOZWFyZXN0VmVjNH0sIHhSLCB4QykgKlxuICAgICAgICAgICAgICAgICAgICBnZXRXKHdSLCB3QywgJHtpbnB1dERlcHRoTmVhcmVzdFZlYzR9LCBkMik7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBlbHNlIGlmICgke2lucHV0RGVwdGhWZWM0UmVtYWluZGVyID09PSAyfSkge1xuICAgICAgICAgICAgICB2ZWMyIHdWYWx1ZXMgPSB2ZWMyKFxuICAgICAgICAgICAgICAgIGdldFcod1IsIHdDLCAke2lucHV0RGVwdGhOZWFyZXN0VmVjNH0sIGQyKSxcbiAgICAgICAgICAgICAgICBnZXRXKHdSLCB3QywgJHtpbnB1dERlcHRoTmVhcmVzdFZlYzR9ICsgMSwgZDIpXG4gICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgaWYgKCR7aXNDaGFubmVsc0xhc3R9KSB7XG4gICAgICAgICAgICAgICAgdmVjMiB4VmFsdWVzID0gdmVjMihcbiAgICAgICAgICAgICAgICAgIGdldFgoYmF0Y2gsIHhSLCB4QywgJHtpbnB1dERlcHRoTmVhcmVzdFZlYzR9KSxcbiAgICAgICAgICAgICAgICAgIGdldFgoYmF0Y2gsIHhSLCB4QywgJHtpbnB1dERlcHRoTmVhcmVzdFZlYzR9ICsgMSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGRvdFByb2QgKz0gZG90KHhWYWx1ZXMsIHdWYWx1ZXMpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZlYzIgeFZhbHVlcyA9IHZlYzIoXG4gICAgICAgICAgICAgICAgICBnZXRYKGJhdGNoLCAke2lucHV0RGVwdGhOZWFyZXN0VmVjNH0sIHhSLCB4QyksXG4gICAgICAgICAgICAgICAgICBnZXRYKGJhdGNoLCAke2lucHV0RGVwdGhOZWFyZXN0VmVjNH0gKyAxLCB4UiwgeEMpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBkb3RQcm9kICs9IGRvdCh4VmFsdWVzLCB3VmFsdWVzKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCR7aW5wdXREZXB0aFZlYzRSZW1haW5kZXIgPT09IDN9KSB7XG4gICAgICAgICAgICAgIHZlYzMgd1ZhbHVlcyA9IHZlYzMoXG4gICAgICAgICAgICAgICAgZ2V0Vyh3Uiwgd0MsICR7aW5wdXREZXB0aE5lYXJlc3RWZWM0fSwgZDIpLFxuICAgICAgICAgICAgICAgIGdldFcod1IsIHdDLCAke2lucHV0RGVwdGhOZWFyZXN0VmVjNH0gKyAxLCBkMiksXG4gICAgICAgICAgICAgICAgZ2V0Vyh3Uiwgd0MsICR7aW5wdXREZXB0aE5lYXJlc3RWZWM0fSArIDIsIGQyKVxuICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgIGlmICgke2lzQ2hhbm5lbHNMYXN0fSkge1xuICAgICAgICAgICAgICAgIHZlYzMgeFZhbHVlcyA9IHZlYzMoXG4gICAgICAgICAgICAgICAgICBnZXRYKGJhdGNoLCB4UiwgeEMsICR7aW5wdXREZXB0aE5lYXJlc3RWZWM0fSksXG4gICAgICAgICAgICAgICAgICBnZXRYKGJhdGNoLCB4UiwgeEMsICR7aW5wdXREZXB0aE5lYXJlc3RWZWM0fSArIDEpLFxuICAgICAgICAgICAgICAgICAgZ2V0WChiYXRjaCwgeFIsIHhDLCAke2lucHV0RGVwdGhOZWFyZXN0VmVjNH0gKyAyKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgZG90UHJvZCArPSBkb3QoeFZhbHVlcywgd1ZhbHVlcyk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmVjMyB4VmFsdWVzID0gdmVjMyhcbiAgICAgICAgICAgICAgICAgIGdldFgoYmF0Y2gsICR7aW5wdXREZXB0aE5lYXJlc3RWZWM0fSwgeFIsIHhDKSxcbiAgICAgICAgICAgICAgICAgIGdldFgoYmF0Y2gsICR7aW5wdXREZXB0aE5lYXJlc3RWZWM0fSArIDEsIHhSLCB4QyksXG4gICAgICAgICAgICAgICAgICBnZXRYKGJhdGNoLCAke2lucHV0RGVwdGhOZWFyZXN0VmVjNH0gKyAyLCB4UiwgeEMpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBkb3RQcm9kICs9IGRvdCh4VmFsdWVzLCB3VmFsdWVzKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZmxvYXQgcmVzdWx0ID0gZG90UHJvZDtcbiAgICAgICAgJHthZGRCaWFzU25pcHBldH1cbiAgICAgICAgJHthcHBseUFjdGl2YXRpb25TbmlwcGV0fVxuICAgICAgICBzZXRPdXRwdXQocmVzdWx0KTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb252M0RQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsneCcsICdXJ107XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXTtcbiAgdXNlckNvZGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihjb252SW5mbzogYmFja2VuZF91dGlsLkNvbnYzREluZm8pIHtcbiAgICB0aGlzLm91dHB1dFNoYXBlID0gY29udkluZm8ub3V0U2hhcGU7XG4gICAgY29uc3QgcGFkRnJvbnQgPSBjb252SW5mby5wYWRJbmZvLmZyb250O1xuICAgIGNvbnN0IHBhZFRvcCA9IGNvbnZJbmZvLnBhZEluZm8udG9wO1xuICAgIGNvbnN0IHBhZExlZnQgPSBjb252SW5mby5wYWRJbmZvLmxlZnQ7XG4gICAgY29uc3Qgc3RyaWRlRGVwdGggPSBjb252SW5mby5zdHJpZGVEZXB0aDtcbiAgICBjb25zdCBzdHJpZGVIZWlnaHQgPSBjb252SW5mby5zdHJpZGVIZWlnaHQ7XG4gICAgY29uc3Qgc3RyaWRlV2lkdGggPSBjb252SW5mby5zdHJpZGVXaWR0aDtcbiAgICBjb25zdCBkaWxhdGlvbkRlcHRoID0gY29udkluZm8uZGlsYXRpb25EZXB0aDtcbiAgICBjb25zdCBkaWxhdGlvbkhlaWdodCA9IGNvbnZJbmZvLmRpbGF0aW9uSGVpZ2h0O1xuICAgIGNvbnN0IGRpbGF0aW9uV2lkdGggPSBjb252SW5mby5kaWxhdGlvbldpZHRoO1xuICAgIGNvbnN0IGZpbHRlckRlcHRoID0gY29udkluZm8uZmlsdGVyRGVwdGg7XG4gICAgY29uc3QgZmlsdGVySGVpZ2h0ID0gY29udkluZm8uZmlsdGVySGVpZ2h0O1xuICAgIGNvbnN0IGZpbHRlcldpZHRoID0gY29udkluZm8uZmlsdGVyV2lkdGg7XG5cbiAgICBjb25zdCBpbnB1dERlcHRoTmVhcmVzdFZlYzQgPSBNYXRoLmZsb29yKGNvbnZJbmZvLmluQ2hhbm5lbHMgLyA0KSAqIDQ7XG4gICAgY29uc3QgaW5wdXREZXB0aFZlYzRSZW1haW5kZXIgPSBjb252SW5mby5pbkNoYW5uZWxzICUgNDtcblxuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICBjb25zdCBpdmVjMyBzdHJpZGVzID0gaXZlYzMoJHtzdHJpZGVEZXB0aH0sICR7c3RyaWRlSGVpZ2h0fSwgJHtcbiAgICAgICAgc3RyaWRlV2lkdGh9KTtcbiAgICAgIGNvbnN0IGl2ZWMzIHBhZHMgPSBpdmVjMygke3BhZEZyb250fSwgJHtwYWRUb3B9LCAke3BhZExlZnR9KTtcblxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICBpdmVjNSBjb29yZHMgPSBnZXRPdXRwdXRDb29yZHMoKTtcbiAgICAgICAgaW50IGJhdGNoID0gY29vcmRzLng7XG4gICAgICAgIGludCBkMiA9IGNvb3Jkcy51O1xuXG4gICAgICAgIGl2ZWMzIHhGUkNDb3JuZXIgPSBpdmVjMyhjb29yZHMueSwgY29vcmRzLnosIGNvb3Jkcy53KSAqIHN0cmlkZXMgLSBwYWRzO1xuICAgICAgICBpbnQgeEZDb3JuZXIgPSB4RlJDQ29ybmVyLng7XG4gICAgICAgIGludCB4UkNvcm5lciA9IHhGUkNDb3JuZXIueTtcbiAgICAgICAgaW50IHhDQ29ybmVyID0geEZSQ0Nvcm5lci56O1xuXG4gICAgICAgIC8vIENvbnZvbHZlIHgoPywgPywgPywgZDEpIHdpdGggdyg6LCA6LCA6LCBkMSwgZDIpIHRvIGdldFxuICAgICAgICAvLyB5KHlGLCB5UiwgeUMsIGQyKS4gPyA9IHRvIGJlIGRldGVybWluZWQuIDogPSBhY3Jvc3MgYWxsXG4gICAgICAgIC8vIHZhbHVlcyBpbiB0aGF0IGF4aXMuXG4gICAgICAgIGZsb2F0IGRvdFByb2QgPSAwLjA7XG4gICAgICAgIGZvciAoaW50IHdGID0gMDsgd0YgPCAke2ZpbHRlckRlcHRofTsgd0YrKykge1xuICAgICAgICAgIGludCB4RiA9IHhGQ29ybmVyICsgd0YgKiAke2RpbGF0aW9uRGVwdGh9O1xuXG4gICAgICAgICAgaWYgKHhGIDwgMCB8fCB4RiA+PSAke2NvbnZJbmZvLmluRGVwdGh9KSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGludCB3UiA9IDA7IHdSIDwgJHtmaWx0ZXJIZWlnaHR9OyB3UisrKSB7XG4gICAgICAgICAgICBpbnQgeFIgPSB4UkNvcm5lciArIHdSICogJHtkaWxhdGlvbkhlaWdodH07XG5cbiAgICAgICAgICAgIGlmICh4UiA8IDAgfHwgeFIgPj0gJHtjb252SW5mby5pbkhlaWdodH0pIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoaW50IHdDID0gMDsgd0MgPCAke2ZpbHRlcldpZHRofTsgd0MrKykge1xuICAgICAgICAgICAgICBpbnQgeEMgPSB4Q0Nvcm5lciArIHdDICogJHtkaWxhdGlvbldpZHRofTtcblxuICAgICAgICAgICAgICBpZiAoeEMgPCAwIHx8IHhDID49ICR7Y29udkluZm8uaW5XaWR0aH0pIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGZvciAoaW50IGQxID0gMDsgZDEgPCAke2lucHV0RGVwdGhOZWFyZXN0VmVjNH07IGQxICs9IDQpIHtcbiAgICAgICAgICAgICAgICB2ZWM0IHhWYWx1ZXMgPSB2ZWM0KFxuICAgICAgICAgICAgICAgICAgZ2V0WChiYXRjaCwgeEYsIHhSLCB4QywgZDEpLFxuICAgICAgICAgICAgICAgICAgZ2V0WChiYXRjaCwgeEYsIHhSLCB4QywgZDEgKyAxKSxcbiAgICAgICAgICAgICAgICAgIGdldFgoYmF0Y2gsIHhGLCB4UiwgeEMsIGQxICsgMiksXG4gICAgICAgICAgICAgICAgICBnZXRYKGJhdGNoLCB4RiwgeFIsIHhDLCBkMSArIDMpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB2ZWM0IHdWYWx1ZXMgPSB2ZWM0KFxuICAgICAgICAgICAgICAgICAgZ2V0Vyh3Riwgd1IsIHdDLCBkMSwgZDIpLFxuICAgICAgICAgICAgICAgICAgZ2V0Vyh3Riwgd1IsIHdDLCBkMSArIDEsIGQyKSxcbiAgICAgICAgICAgICAgICAgIGdldFcod0YsIHdSLCB3QywgZDEgKyAyLCBkMiksXG4gICAgICAgICAgICAgICAgICBnZXRXKHdGLCB3Uiwgd0MsIGQxICsgMywgZDIpXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGRvdFByb2QgKz0gZG90KHhWYWx1ZXMsIHdWYWx1ZXMpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKCR7aW5wdXREZXB0aFZlYzRSZW1haW5kZXIgPT09IDF9KSB7XG4gICAgICAgICAgICAgICAgZG90UHJvZCArPVxuICAgICAgICAgICAgICAgICAgZ2V0WChiYXRjaCwgeEYsIHhSLCB4QywgJHtpbnB1dERlcHRoTmVhcmVzdFZlYzR9KSAqXG4gICAgICAgICAgICAgICAgICBnZXRXKHdGLCB3Uiwgd0MsICR7aW5wdXREZXB0aE5lYXJlc3RWZWM0fSwgZDIpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCR7aW5wdXREZXB0aFZlYzRSZW1haW5kZXIgPT09IDJ9KSB7XG4gICAgICAgICAgICAgICAgdmVjMiB4VmFsdWVzID0gdmVjMihcbiAgICAgICAgICAgICAgICAgIGdldFgoYmF0Y2gsIHhGLCB4UiwgeEMsICR7aW5wdXREZXB0aE5lYXJlc3RWZWM0fSksXG4gICAgICAgICAgICAgICAgICBnZXRYKGJhdGNoLCB4RiwgeFIsIHhDLCAke2lucHV0RGVwdGhOZWFyZXN0VmVjNH0gKyAxKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgdmVjMiB3VmFsdWVzID0gdmVjMihcbiAgICAgICAgICAgICAgICAgIGdldFcod0YsIHdSLCB3QywgJHtpbnB1dERlcHRoTmVhcmVzdFZlYzR9LCBkMiksXG4gICAgICAgICAgICAgICAgICBnZXRXKHdGLCB3Uiwgd0MsICR7aW5wdXREZXB0aE5lYXJlc3RWZWM0fSArIDEsIGQyKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgZG90UHJvZCArPSBkb3QoeFZhbHVlcywgd1ZhbHVlcyk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoJHtpbnB1dERlcHRoVmVjNFJlbWFpbmRlciA9PT0gM30pIHtcbiAgICAgICAgICAgICAgICB2ZWMzIHhWYWx1ZXMgPSB2ZWMzKFxuICAgICAgICAgICAgICAgICAgZ2V0WChiYXRjaCwgeEYsIHhSLCB4QywgJHtpbnB1dERlcHRoTmVhcmVzdFZlYzR9KSxcbiAgICAgICAgICAgICAgICAgIGdldFgoYmF0Y2gsIHhGLCB4UiwgeEMsICR7aW5wdXREZXB0aE5lYXJlc3RWZWM0fSArIDEpLFxuICAgICAgICAgICAgICAgICAgZ2V0WChiYXRjaCwgeEYsIHhSLCB4QywgJHtpbnB1dERlcHRoTmVhcmVzdFZlYzR9ICsgMilcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHZlYzMgd1ZhbHVlcyA9IHZlYzMoXG4gICAgICAgICAgICAgICAgICBnZXRXKHdGLCB3Uiwgd0MsICR7aW5wdXREZXB0aE5lYXJlc3RWZWM0fSwgZDIpLFxuICAgICAgICAgICAgICAgICAgZ2V0Vyh3Riwgd1IsIHdDLCAke2lucHV0RGVwdGhOZWFyZXN0VmVjNH0gKyAxLCBkMiksXG4gICAgICAgICAgICAgICAgICBnZXRXKHdGLCB3Uiwgd0MsICR7aW5wdXREZXB0aE5lYXJlc3RWZWM0fSArIDIsIGQyKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgZG90UHJvZCArPSBkb3QoeFZhbHVlcywgd1ZhbHVlcyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2V0T3V0cHV0KGRvdFByb2QpO1xuICAgICAgfVxuICAgIGA7XG4gIH1cbn1cbiJdfQ==