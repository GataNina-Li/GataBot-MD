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
import { util } from '@tensorflow/tfjs-core';
import { useShapeUniforms } from './gpgpu_math';
export class DepthwiseConvPacked2DProgram {
    constructor(convInfo, addBias = false, activation = null, hasPreluActivation = false, hasLeakyReluAlpha = false) {
        this.variableNames = ['x', 'W'];
        this.packedInputs = true;
        this.packedOutput = true;
        this.customUniforms = [
            { name: 'pads', type: 'ivec2' },
            { name: 'strides', type: 'ivec2' },
            { name: 'dilations', type: 'ivec2' },
            { name: 'inDims', type: 'ivec2' },
        ];
        this.outputShape = convInfo.outShape;
        this.enableShapeUniforms = useShapeUniforms(this.outputShape.length);
        const channelMul = convInfo.outChannels / convInfo.inChannels;
        const padLeft = convInfo.padInfo.left;
        const strideWidth = convInfo.strideWidth;
        const dilationWidth = convInfo.dilationWidth;
        const filterHeight = convInfo.filterHeight;
        const filterWidth = convInfo.filterWidth;
        const texelsAcross = filterWidth;
        let mainLoop = `
      int xR; int xC; int xCOffset;
      vec4 wTexel; vec4 previous; vec4 final;`;
        for (let c = 0; c < filterWidth; c++) {
            mainLoop += `
          vec4 xTexelC${c * 2};
          int xTexelC${c * 2}Ready;
          vec4 xTexelC${c * 2 + 1};
          int xTexelC${c * 2 + 1}Ready;
          vec4 xC${c};`;
        }
        /**
         * This vectorized implementation works by gathering the values needed for
         * each output channel's dot product into vec4's and then multiplying them
         * all together (this happens in the final double for-loop below). Most of
         * the main loop consists of constructing these vec4's with the minimum
         * number of texture2D calls, which means making use of all four returned
         * values from a texture2D call at once.
         */
        mainLoop += `
    for (int r = 0; r < ${filterHeight}; r++) {
      `;
        for (let c = 0; c < filterWidth; c++) {
            mainLoop += `
          xTexelC${c * 2} = vec4(0.0);
          xTexelC${c * 2}Ready = 0;
          xTexelC${c * 2 + 1} = vec4(0.0);
          xTexelC${c * 2 + 1}Ready = 0;
          xC${c} = vec4(0.0);`;
        }
        mainLoop += `
        xR = xRCorner + r * dilations[0];
        if (xR >=0 && xR < inDims[0]) {
      `;
        for (let texelC = 0; texelC < (texelsAcross + 1) / 2; texelC++) {
            const colIndex = texelC * 2;
            mainLoop += `
          xC = xCCorner + ${colIndex * dilationWidth};
          `;
            if (strideWidth === 1) {
                if (colIndex < filterWidth) {
                    // If padding is odd, the outer texels have to be composed.
                    if (padLeft % 2 === 1) {
                        // TODO: Ensure vec4 previous does not result in redundant sample,
                        // and avoid setting xTexelRC's that exceed the boundary in the
                        // first place rather than resetting them to vec4(0)).
                        // To compute xCOffset:
                        // - If padding is odd, we must add 1 to ensure we ask for an
                        // even-numbered row.
                        // - We subtract 2 to access the previous texel.
                        mainLoop += `
                xCOffset = xC + 1;
                if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${colIndex}Ready == 0) {
                  xTexelC${colIndex} = getX(batch, xR, xCOffset, d1);

                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${colIndex}.zw = vec2(0.0);
                  }
                  xTexelC${colIndex}Ready = 1;
                }
              `;
                        // This texel has been read in previous iteration if the dilation
                        // is 1.
                        if (dilationWidth === 1 && colIndex > 0) {
                            mainLoop += `
                xC${colIndex} = vec4(xTexelC${colIndex - 2}.zw, xTexelC${colIndex}.xy);
                `;
                        }
                        else {
                            mainLoop += `
                  xCOffset = xC + 1 - 2;

                  if (xCOffset >= 0 && xCOffset < inDims[1]) {
                    previous = getX(batch, xR, xCOffset, d1);

                    // Need to manually clear unused channels in case
                    // we're reading from recycled texture.
                    if (xCOffset + 1 >= inDims[1]) {
                      previous.zw = vec2(0.0);
                    }

                    xC${colIndex} = vec4(previous.zw, xTexelC${colIndex}.xy);
                  } else {
                    xC${colIndex} = vec4(0.0, 0.0, xTexelC${colIndex}.xy);
                  }
                  `;
                        }
                    }
                    else {
                        // Padding is even, so xRC corresponds to a single texel.
                        mainLoop += `
                if (xC >= 0 && xC < inDims[1] && xTexelC${colIndex}Ready == 0) {
                  xTexelC${colIndex} = getX(batch, xR, xC, d1);
                  if (xC + 1 >= inDims[1]) {
                    xTexelC${colIndex}.zw = vec2(0.0);
                  }
                  xTexelC${colIndex}Ready = 1;
                }

                xC${colIndex} = xTexelC${colIndex};
                `;
                    }
                    if (colIndex + 1 < filterWidth) {
                        // If dilation is even, the second entry should match the first
                        // (either both are composed or both are single samples). But if
                        // dilation is odd, then the second entry should be the opposite
                        // of the first (if the first is composed, the second is a single
                        // sample, and vice versa.)
                        const nextTexelOffset = padLeft % 2 === 0 ?
                            util.nearestLargerEven(dilationWidth) :
                            dilationWidth;
                        if ((dilationWidth % 2 === 0 && padLeft % 2 === 1) ||
                            (dilationWidth % 2 !== 0 && padLeft % 2 !== 1)) {
                            mainLoop += `
                  xCOffset = xC + imod(pads[1], 2) + ${nextTexelOffset};

                  if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${colIndex + 1}Ready == 0) {
                    xTexelC${colIndex + 1} = getX(batch, xR, xCOffset, d1);

                    // Need to manually clear unused channels in case
                    // we're reading from recycled texture.
                    if (xCOffset + 1 >= inDims[1]) {
                      xTexelC${colIndex + 1}.zw = vec2(0.0);
                    }
                    xTexelC${colIndex + 1}Ready = 1;
                  }
                  `;
                            // If dilation > 1 then the xRC's will not be able to share any
                            // values, so each xRC will require two unique calls to getX.
                            if (dilationWidth > 1) {
                                mainLoop += `
                    xCOffset -= 2;
                    if (xCOffset >= 0 && xCOffset < inDims[1]) {
                     previous = getX(batch, xR, xCOffset, d1);
                     xC${colIndex + 1} = vec4(previous.zw, xTexelC${colIndex + 1}.xy);
                    } else {
                     xC${colIndex + 1} = vec4(0.0, 0.0, xTexelC${colIndex + 1}.xy);
                    }
                    `;
                            }
                            else {
                                mainLoop += `
                    xC${colIndex + 1} = vec4(xTexelC${colIndex}.zw, xTexelC${colIndex + 1}.xy);
                    `;
                            }
                        }
                        else {
                            // If dilation is 1 and padding is odd, we have already read the
                            // texel when constructing the previous x value. Here we can
                            // simply skip the texture read.
                            if (nextTexelOffset === 1) {
                                mainLoop += `
                    xC${colIndex + 1} = xTexelC${colIndex};
                    `;
                            }
                            else {
                                mainLoop += `
                    xCOffset = xC + ${nextTexelOffset};

                    if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${colIndex + 1}Ready == 0) {
                      xTexelC${colIndex + 1} = getX(batch, xR, xCOffset, d1);
                      if (xCOffset + 1 >= inDims[1]) {
                        xTexelC${colIndex + 1}.zw = vec2(0.0);
                      }
                      xTexelC${colIndex + 1}Ready = 1;
                    }

                    xC${colIndex + 1} = xTexelC${colIndex + 1};
                    `;
                            }
                        }
                    }
                }
            }
            else { // stride === 2
                if (colIndex < filterWidth) {
                    // Depending on whether padLeft is even or odd, we want either the
                    // xy or zw channels from X texels for xC${colIndex}. If padLeft is
                    // even, xC${colIndex +1} is simply the zw channels of texels we've
                    // already sampled. But if padLeft is odd, xC{$c + 1}.zw will
                    // need to come from the xy channels of a new texel, hence the `
                    // vec4
                    // final` initialized below.
                    if (padLeft % 2 === 1) {
                        mainLoop += `
                xCOffset = xC + 1 - strides[1];
                if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${colIndex}Ready == 0) {
                  xTexelC${colIndex} = getX(batch, xR, xCOffset, d1);
                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${colIndex}.zw = vec2(0.0);
                  }
                  xTexelC${colIndex}Ready = 1;
                }

                if(xC + 1 >= 0 && xC + 1 < inDims[1] && xTexelC${colIndex + 1}Ready == 0) {
                  xTexelC${colIndex + 1} = getX(batch, xR, xC + 1, d1);
                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xC + 2 >= inDims[1]) {
                    xTexelC${colIndex + 1}.zw = vec2(0.0);
                  }
                  xTexelC${colIndex + 1}Ready = 1;
                }

                xC${colIndex} = vec4(xTexelC${colIndex}.zw, xTexelC${colIndex + 1}.zw);
              `;
                        if (colIndex + 1 < filterWidth) {
                            mainLoop += `
                  final = vec4(0.0);
                  xCOffset = xC + 1 + strides[1];
                  if(xCOffset >= 0 && xCOffset < inDims[1]) {
                    final = getX(batch, xR, xCOffset, d1);
                  }
                  xC${colIndex + 1} = vec4(xTexelC${colIndex + 1}.xy, final.xy);
                `;
                        }
                    }
                    else {
                        mainLoop += `
                if(xC >= 0 && xC < inDims[1] && xTexelC${colIndex}Ready == 0) {
                  xTexelC${colIndex} = getX(batch, xR, xC, d1);
                  if (xC + 1 >= inDims[1]) {
                    xTexelC${colIndex}.zw = vec2(0.0);
                  }
                  xTexelC${colIndex}Ready = 1;
                }

                xCOffset = xC + strides[1];
                if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${colIndex + 1}Ready == 0) {
                  xTexelC${colIndex + 1} = getX(batch, xR, xCOffset, d1);
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${colIndex + 1}.zw = vec2(0.);
                  }
                  xTexelC${colIndex + 1}Ready = 1;
                }

                xC${colIndex} = vec4(
                  xTexelC${colIndex}.xy, xTexelC${colIndex + 1}.xy);
              `;
                        if (colIndex + 1 < filterWidth) {
                            mainLoop += `
                  xC${colIndex + 1} = vec4(xTexelC${colIndex}.zw, xTexelC${colIndex + 1}.zw);
                `;
                        }
                    }
                }
            }
            // localize the dotProd accumulation within the loop, the theory is for
            // GPU with limited cache, accumulate sum across large amount of
            // veriables will cause lots of cache misses. (i.e. 5x5 filter will have
            // 50 variables)
            if (colIndex < filterWidth) {
                mainLoop += `
            wTexel = getW(r, ${colIndex}, d1, q);
            dotProd += xC${colIndex} * vec4(wTexel.xz, wTexel.xz);
          `;
                if (colIndex + 1 < filterWidth) {
                    mainLoop += `
              wTexel = getW(r, ${colIndex + 1}, d1, q);
              dotProd += xC${colIndex + 1} * vec4(wTexel.xz, wTexel.xz);
            `;
                }
            }
        }
        mainLoop += `
    }
  `;
        mainLoop += `
      }
    `;
        let activationSnippet = '', applyActivationSnippet = '';
        if (activation) {
            if (hasPreluActivation) {
                activationSnippet = `vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          ${activation}
        }`;
            }
            else if (hasLeakyReluAlpha) {
                activationSnippet = `vec4 activation(vec4 a) {
          vec4 b = getLeakyreluAlphaAtOutCoords();
          ${activation}
        }`;
            }
            else {
                activationSnippet = `vec4 activation(vec4 x) {
          ${activation}
        }`;
            }
            applyActivationSnippet = `result = activation(result);`;
        }
        const addBiasSnippet = addBias ? 'result += getBiasAtOutCoords();' : '';
        if (addBias) {
            this.variableNames.push('bias');
        }
        if (hasPreluActivation) {
            this.variableNames.push('preluActivationWeights');
        }
        if (hasLeakyReluAlpha) {
            this.variableNames.push('leakyreluAlpha');
        }
        this.userCode = `
      ${activationSnippet}

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        ivec2 xRCCorner = coords.yz * strides - pads;
        int d2 = coords.w;
        int d1 = d2 / ${channelMul};
        int q = d2 - d1 * ${channelMul};
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        //intialize dotProd with a small epsilon seems to reduce GPU accuracy loss.
        vec4 dotProd = vec4(0.000000000000001);

        ${mainLoop}

        vec4 result = dotProd - vec4(0.000000000000001);
        ${addBiasSnippet}
        ${applyActivationSnippet}
        setOutput(result);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udl9wYWNrZWRfZ3B1X2RlcHRod2lzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvY29udl9wYWNrZWRfZ3B1X2RlcHRod2lzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQWUsSUFBSSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFekQsT0FBTyxFQUFlLGdCQUFnQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRTVELE1BQU0sT0FBTyw0QkFBNEI7SUFjdkMsWUFDSSxRQUFpQyxFQUFFLE9BQU8sR0FBRyxLQUFLLEVBQ2xELGFBQXFCLElBQUksRUFBRSxrQkFBa0IsR0FBRyxLQUFLLEVBQ3JELGlCQUFpQixHQUFHLEtBQUs7UUFoQjdCLGtCQUFhLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDM0IsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFJcEIsbUJBQWMsR0FBRztZQUNmLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBZ0IsRUFBRTtZQUN2QyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQWdCLEVBQUU7WUFDMUMsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxPQUFnQixFQUFFO1lBQzVDLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBZ0IsRUFBRTtTQUMxQyxDQUFDO1FBTUEsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxXQUFXLEdBQUcs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QixFQUFFO1lBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUM7U0FDbkQ7UUFDRCxJQUFJLGlCQUFpQixFQUFFO1lBQ3JCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDM0M7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHO1FBQ1osaUJBQWlCOzs7Ozs7O3dCQU9ELFVBQVU7NEJBQ04sVUFBVTs7Ozs7OztVQU81QixRQUFROzs7VUFHUixjQUFjO1VBQ2Qsc0JBQXNCOzs7S0FHM0IsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtiYWNrZW5kX3V0aWwsIHV0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7R1BHUFVQcm9ncmFtLCB1c2VTaGFwZVVuaWZvcm1zfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuXG5leHBvcnQgY2xhc3MgRGVwdGh3aXNlQ29udlBhY2tlZDJEUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ3gnLCAnVyddO1xuICBwYWNrZWRJbnB1dHMgPSB0cnVlO1xuICBwYWNrZWRPdXRwdXQgPSB0cnVlO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG4gIGVuYWJsZVNoYXBlVW5pZm9ybXM6IGJvb2xlYW47XG4gIGN1c3RvbVVuaWZvcm1zID0gW1xuICAgIHtuYW1lOiAncGFkcycsIHR5cGU6ICdpdmVjMicgYXMgY29uc3QgfSxcbiAgICB7bmFtZTogJ3N0cmlkZXMnLCB0eXBlOiAnaXZlYzInIGFzIGNvbnN0IH0sXG4gICAge25hbWU6ICdkaWxhdGlvbnMnLCB0eXBlOiAnaXZlYzInIGFzIGNvbnN0IH0sXG4gICAge25hbWU6ICdpbkRpbXMnLCB0eXBlOiAnaXZlYzInIGFzIGNvbnN0IH0sXG4gIF07XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBjb252SW5mbzogYmFja2VuZF91dGlsLkNvbnYyREluZm8sIGFkZEJpYXMgPSBmYWxzZSxcbiAgICAgIGFjdGl2YXRpb246IHN0cmluZyA9IG51bGwsIGhhc1ByZWx1QWN0aXZhdGlvbiA9IGZhbHNlLFxuICAgICAgaGFzTGVha3lSZWx1QWxwaGEgPSBmYWxzZSkge1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBjb252SW5mby5vdXRTaGFwZTtcbiAgICB0aGlzLmVuYWJsZVNoYXBlVW5pZm9ybXMgPSB1c2VTaGFwZVVuaWZvcm1zKHRoaXMub3V0cHV0U2hhcGUubGVuZ3RoKTtcbiAgICBjb25zdCBjaGFubmVsTXVsID0gY29udkluZm8ub3V0Q2hhbm5lbHMgLyBjb252SW5mby5pbkNoYW5uZWxzO1xuICAgIGNvbnN0IHBhZExlZnQgPSBjb252SW5mby5wYWRJbmZvLmxlZnQ7XG4gICAgY29uc3Qgc3RyaWRlV2lkdGggPSBjb252SW5mby5zdHJpZGVXaWR0aDtcbiAgICBjb25zdCBkaWxhdGlvbldpZHRoID0gY29udkluZm8uZGlsYXRpb25XaWR0aDtcbiAgICBjb25zdCBmaWx0ZXJIZWlnaHQgPSBjb252SW5mby5maWx0ZXJIZWlnaHQ7XG4gICAgY29uc3QgZmlsdGVyV2lkdGggPSBjb252SW5mby5maWx0ZXJXaWR0aDtcbiAgICBjb25zdCB0ZXhlbHNBY3Jvc3MgPSBmaWx0ZXJXaWR0aDtcblxuICAgIGxldCBtYWluTG9vcCA9IGBcbiAgICAgIGludCB4UjsgaW50IHhDOyBpbnQgeENPZmZzZXQ7XG4gICAgICB2ZWM0IHdUZXhlbDsgdmVjNCBwcmV2aW91czsgdmVjNCBmaW5hbDtgO1xuXG4gICAgZm9yIChsZXQgYyA9IDA7IGMgPCBmaWx0ZXJXaWR0aDsgYysrKSB7XG4gICAgICBtYWluTG9vcCArPSBgXG4gICAgICAgICAgdmVjNCB4VGV4ZWxDJHtjICogMn07XG4gICAgICAgICAgaW50IHhUZXhlbEMke2MgKiAyfVJlYWR5O1xuICAgICAgICAgIHZlYzQgeFRleGVsQyR7YyAqIDIgKyAxfTtcbiAgICAgICAgICBpbnQgeFRleGVsQyR7YyAqIDIgKyAxfVJlYWR5O1xuICAgICAgICAgIHZlYzQgeEMke2N9O2A7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyB2ZWN0b3JpemVkIGltcGxlbWVudGF0aW9uIHdvcmtzIGJ5IGdhdGhlcmluZyB0aGUgdmFsdWVzIG5lZWRlZCBmb3JcbiAgICAgKiBlYWNoIG91dHB1dCBjaGFubmVsJ3MgZG90IHByb2R1Y3QgaW50byB2ZWM0J3MgYW5kIHRoZW4gbXVsdGlwbHlpbmcgdGhlbVxuICAgICAqIGFsbCB0b2dldGhlciAodGhpcyBoYXBwZW5zIGluIHRoZSBmaW5hbCBkb3VibGUgZm9yLWxvb3AgYmVsb3cpLiBNb3N0IG9mXG4gICAgICogdGhlIG1haW4gbG9vcCBjb25zaXN0cyBvZiBjb25zdHJ1Y3RpbmcgdGhlc2UgdmVjNCdzIHdpdGggdGhlIG1pbmltdW1cbiAgICAgKiBudW1iZXIgb2YgdGV4dHVyZTJEIGNhbGxzLCB3aGljaCBtZWFucyBtYWtpbmcgdXNlIG9mIGFsbCBmb3VyIHJldHVybmVkXG4gICAgICogdmFsdWVzIGZyb20gYSB0ZXh0dXJlMkQgY2FsbCBhdCBvbmNlLlxuICAgICAqL1xuICAgIG1haW5Mb29wICs9IGBcbiAgICBmb3IgKGludCByID0gMDsgciA8ICR7ZmlsdGVySGVpZ2h0fTsgcisrKSB7XG4gICAgICBgO1xuICAgIGZvciAobGV0IGMgPSAwOyBjIDwgZmlsdGVyV2lkdGg7IGMrKykge1xuICAgICAgbWFpbkxvb3AgKz0gYFxuICAgICAgICAgIHhUZXhlbEMke2MgKiAyfSA9IHZlYzQoMC4wKTtcbiAgICAgICAgICB4VGV4ZWxDJHtjICogMn1SZWFkeSA9IDA7XG4gICAgICAgICAgeFRleGVsQyR7YyAqIDIgKyAxfSA9IHZlYzQoMC4wKTtcbiAgICAgICAgICB4VGV4ZWxDJHtjICogMiArIDF9UmVhZHkgPSAwO1xuICAgICAgICAgIHhDJHtjfSA9IHZlYzQoMC4wKTtgO1xuICAgIH1cbiAgICBtYWluTG9vcCArPSBgXG4gICAgICAgIHhSID0geFJDb3JuZXIgKyByICogZGlsYXRpb25zWzBdO1xuICAgICAgICBpZiAoeFIgPj0wICYmIHhSIDwgaW5EaW1zWzBdKSB7XG4gICAgICBgO1xuXG4gICAgZm9yIChsZXQgdGV4ZWxDID0gMDsgdGV4ZWxDIDwgKHRleGVsc0Fjcm9zcyArIDEpIC8gMjsgdGV4ZWxDKyspIHtcbiAgICAgIGNvbnN0IGNvbEluZGV4ID0gdGV4ZWxDICogMjtcblxuICAgICAgbWFpbkxvb3AgKz0gYFxuICAgICAgICAgIHhDID0geENDb3JuZXIgKyAke2NvbEluZGV4ICogZGlsYXRpb25XaWR0aH07XG4gICAgICAgICAgYDtcblxuICAgICAgaWYgKHN0cmlkZVdpZHRoID09PSAxKSB7XG4gICAgICAgIGlmIChjb2xJbmRleCA8IGZpbHRlcldpZHRoKSB7XG4gICAgICAgICAgLy8gSWYgcGFkZGluZyBpcyBvZGQsIHRoZSBvdXRlciB0ZXhlbHMgaGF2ZSB0byBiZSBjb21wb3NlZC5cbiAgICAgICAgICBpZiAocGFkTGVmdCAlIDIgPT09IDEpIHtcbiAgICAgICAgICAgIC8vIFRPRE86IEVuc3VyZSB2ZWM0IHByZXZpb3VzIGRvZXMgbm90IHJlc3VsdCBpbiByZWR1bmRhbnQgc2FtcGxlLFxuICAgICAgICAgICAgLy8gYW5kIGF2b2lkIHNldHRpbmcgeFRleGVsUkMncyB0aGF0IGV4Y2VlZCB0aGUgYm91bmRhcnkgaW4gdGhlXG4gICAgICAgICAgICAvLyBmaXJzdCBwbGFjZSByYXRoZXIgdGhhbiByZXNldHRpbmcgdGhlbSB0byB2ZWM0KDApKS5cblxuICAgICAgICAgICAgLy8gVG8gY29tcHV0ZSB4Q09mZnNldDpcbiAgICAgICAgICAgIC8vIC0gSWYgcGFkZGluZyBpcyBvZGQsIHdlIG11c3QgYWRkIDEgdG8gZW5zdXJlIHdlIGFzayBmb3IgYW5cbiAgICAgICAgICAgIC8vIGV2ZW4tbnVtYmVyZWQgcm93LlxuICAgICAgICAgICAgLy8gLSBXZSBzdWJ0cmFjdCAyIHRvIGFjY2VzcyB0aGUgcHJldmlvdXMgdGV4ZWwuXG5cbiAgICAgICAgICAgIG1haW5Mb29wICs9IGBcbiAgICAgICAgICAgICAgICB4Q09mZnNldCA9IHhDICsgMTtcbiAgICAgICAgICAgICAgICBpZiAoeENPZmZzZXQgPj0gMCAmJiB4Q09mZnNldCA8IGluRGltc1sxXSAmJiB4VGV4ZWxDJHtcbiAgICAgICAgICAgICAgICBjb2xJbmRleH1SZWFkeSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICB4VGV4ZWxDJHtjb2xJbmRleH0gPSBnZXRYKGJhdGNoLCB4UiwgeENPZmZzZXQsIGQxKTtcblxuICAgICAgICAgICAgICAgICAgLy8gTmVlZCB0byBtYW51YWxseSBjbGVhciB1bnVzZWQgY2hhbm5lbHMgaW4gY2FzZVxuICAgICAgICAgICAgICAgICAgLy8gd2UncmUgcmVhZGluZyBmcm9tIHJlY3ljbGVkIHRleHR1cmUuXG4gICAgICAgICAgICAgICAgICBpZiAoeENPZmZzZXQgKyAxID49IGluRGltc1sxXSkge1xuICAgICAgICAgICAgICAgICAgICB4VGV4ZWxDJHtjb2xJbmRleH0uencgPSB2ZWMyKDAuMCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB4VGV4ZWxDJHtjb2xJbmRleH1SZWFkeSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBgO1xuICAgICAgICAgICAgLy8gVGhpcyB0ZXhlbCBoYXMgYmVlbiByZWFkIGluIHByZXZpb3VzIGl0ZXJhdGlvbiBpZiB0aGUgZGlsYXRpb25cbiAgICAgICAgICAgIC8vIGlzIDEuXG4gICAgICAgICAgICBpZiAoZGlsYXRpb25XaWR0aCA9PT0gMSAmJiBjb2xJbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgbWFpbkxvb3AgKz0gYFxuICAgICAgICAgICAgICAgIHhDJHtjb2xJbmRleH0gPSB2ZWM0KHhUZXhlbEMke2NvbEluZGV4IC0gMn0uencsIHhUZXhlbEMke1xuICAgICAgICAgICAgICAgICAgY29sSW5kZXh9Lnh5KTtcbiAgICAgICAgICAgICAgICBgO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbWFpbkxvb3AgKz0gYFxuICAgICAgICAgICAgICAgICAgeENPZmZzZXQgPSB4QyArIDEgLSAyO1xuXG4gICAgICAgICAgICAgICAgICBpZiAoeENPZmZzZXQgPj0gMCAmJiB4Q09mZnNldCA8IGluRGltc1sxXSkge1xuICAgICAgICAgICAgICAgICAgICBwcmV2aW91cyA9IGdldFgoYmF0Y2gsIHhSLCB4Q09mZnNldCwgZDEpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIE5lZWQgdG8gbWFudWFsbHkgY2xlYXIgdW51c2VkIGNoYW5uZWxzIGluIGNhc2VcbiAgICAgICAgICAgICAgICAgICAgLy8gd2UncmUgcmVhZGluZyBmcm9tIHJlY3ljbGVkIHRleHR1cmUuXG4gICAgICAgICAgICAgICAgICAgIGlmICh4Q09mZnNldCArIDEgPj0gaW5EaW1zWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcHJldmlvdXMuencgPSB2ZWMyKDAuMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB4QyR7Y29sSW5kZXh9ID0gdmVjNChwcmV2aW91cy56dywgeFRleGVsQyR7Y29sSW5kZXh9Lnh5KTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHhDJHtjb2xJbmRleH0gPSB2ZWM0KDAuMCwgMC4wLCB4VGV4ZWxDJHtjb2xJbmRleH0ueHkpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gUGFkZGluZyBpcyBldmVuLCBzbyB4UkMgY29ycmVzcG9uZHMgdG8gYSBzaW5nbGUgdGV4ZWwuXG4gICAgICAgICAgICBtYWluTG9vcCArPSBgXG4gICAgICAgICAgICAgICAgaWYgKHhDID49IDAgJiYgeEMgPCBpbkRpbXNbMV0gJiYgeFRleGVsQyR7Y29sSW5kZXh9UmVhZHkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgeFRleGVsQyR7Y29sSW5kZXh9ID0gZ2V0WChiYXRjaCwgeFIsIHhDLCBkMSk7XG4gICAgICAgICAgICAgICAgICBpZiAoeEMgKyAxID49IGluRGltc1sxXSkge1xuICAgICAgICAgICAgICAgICAgICB4VGV4ZWxDJHtjb2xJbmRleH0uencgPSB2ZWMyKDAuMCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB4VGV4ZWxDJHtjb2xJbmRleH1SZWFkeSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgeEMke2NvbEluZGV4fSA9IHhUZXhlbEMke2NvbEluZGV4fTtcbiAgICAgICAgICAgICAgICBgO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjb2xJbmRleCArIDEgPCBmaWx0ZXJXaWR0aCkge1xuICAgICAgICAgICAgLy8gSWYgZGlsYXRpb24gaXMgZXZlbiwgdGhlIHNlY29uZCBlbnRyeSBzaG91bGQgbWF0Y2ggdGhlIGZpcnN0XG4gICAgICAgICAgICAvLyAoZWl0aGVyIGJvdGggYXJlIGNvbXBvc2VkIG9yIGJvdGggYXJlIHNpbmdsZSBzYW1wbGVzKS4gQnV0IGlmXG4gICAgICAgICAgICAvLyBkaWxhdGlvbiBpcyBvZGQsIHRoZW4gdGhlIHNlY29uZCBlbnRyeSBzaG91bGQgYmUgdGhlIG9wcG9zaXRlXG4gICAgICAgICAgICAvLyBvZiB0aGUgZmlyc3QgKGlmIHRoZSBmaXJzdCBpcyBjb21wb3NlZCwgdGhlIHNlY29uZCBpcyBhIHNpbmdsZVxuICAgICAgICAgICAgLy8gc2FtcGxlLCBhbmQgdmljZSB2ZXJzYS4pXG5cbiAgICAgICAgICAgIGNvbnN0IG5leHRUZXhlbE9mZnNldCA9IHBhZExlZnQgJSAyID09PSAwID9cbiAgICAgICAgICAgICAgICB1dGlsLm5lYXJlc3RMYXJnZXJFdmVuKGRpbGF0aW9uV2lkdGgpIDpcbiAgICAgICAgICAgICAgICBkaWxhdGlvbldpZHRoO1xuXG4gICAgICAgICAgICBpZiAoKGRpbGF0aW9uV2lkdGggJSAyID09PSAwICYmIHBhZExlZnQgJSAyID09PSAxKSB8fFxuICAgICAgICAgICAgICAgIChkaWxhdGlvbldpZHRoICUgMiAhPT0gMCAmJiBwYWRMZWZ0ICUgMiAhPT0gMSkpIHtcbiAgICAgICAgICAgICAgbWFpbkxvb3AgKz0gYFxuICAgICAgICAgICAgICAgICAgeENPZmZzZXQgPSB4QyArIGltb2QocGFkc1sxXSwgMikgKyAke25leHRUZXhlbE9mZnNldH07XG5cbiAgICAgICAgICAgICAgICAgIGlmICh4Q09mZnNldCA+PSAwICYmIHhDT2Zmc2V0IDwgaW5EaW1zWzFdICYmIHhUZXhlbEMke1xuICAgICAgICAgICAgICAgICAgY29sSW5kZXggKyAxfVJlYWR5ID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgeFRleGVsQyR7Y29sSW5kZXggKyAxfSA9IGdldFgoYmF0Y2gsIHhSLCB4Q09mZnNldCwgZDEpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIE5lZWQgdG8gbWFudWFsbHkgY2xlYXIgdW51c2VkIGNoYW5uZWxzIGluIGNhc2VcbiAgICAgICAgICAgICAgICAgICAgLy8gd2UncmUgcmVhZGluZyBmcm9tIHJlY3ljbGVkIHRleHR1cmUuXG4gICAgICAgICAgICAgICAgICAgIGlmICh4Q09mZnNldCArIDEgPj0gaW5EaW1zWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgeFRleGVsQyR7Y29sSW5kZXggKyAxfS56dyA9IHZlYzIoMC4wKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB4VGV4ZWxDJHtjb2xJbmRleCArIDF9UmVhZHkgPSAxO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgYDtcblxuICAgICAgICAgICAgICAvLyBJZiBkaWxhdGlvbiA+IDEgdGhlbiB0aGUgeFJDJ3Mgd2lsbCBub3QgYmUgYWJsZSB0byBzaGFyZSBhbnlcbiAgICAgICAgICAgICAgLy8gdmFsdWVzLCBzbyBlYWNoIHhSQyB3aWxsIHJlcXVpcmUgdHdvIHVuaXF1ZSBjYWxscyB0byBnZXRYLlxuICAgICAgICAgICAgICBpZiAoZGlsYXRpb25XaWR0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICBtYWluTG9vcCArPSBgXG4gICAgICAgICAgICAgICAgICAgIHhDT2Zmc2V0IC09IDI7XG4gICAgICAgICAgICAgICAgICAgIGlmICh4Q09mZnNldCA+PSAwICYmIHhDT2Zmc2V0IDwgaW5EaW1zWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICBwcmV2aW91cyA9IGdldFgoYmF0Y2gsIHhSLCB4Q09mZnNldCwgZDEpO1xuICAgICAgICAgICAgICAgICAgICAgeEMke2NvbEluZGV4ICsgMX0gPSB2ZWM0KHByZXZpb3VzLnp3LCB4VGV4ZWxDJHtcbiAgICAgICAgICAgICAgICAgICAgICAgY29sSW5kZXggKyAxfS54eSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICB4QyR7Y29sSW5kZXggKyAxfSA9IHZlYzQoMC4wLCAwLjAsIHhUZXhlbEMke1xuICAgICAgICAgICAgICAgICAgICAgICBjb2xJbmRleCArIDF9Lnh5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBgO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1haW5Mb29wICs9IGBcbiAgICAgICAgICAgICAgICAgICAgeEMke2NvbEluZGV4ICsgMX0gPSB2ZWM0KHhUZXhlbEMke2NvbEluZGV4fS56dywgeFRleGVsQyR7XG4gICAgICAgICAgICAgICAgICAgIGNvbEluZGV4ICsgMX0ueHkpO1xuICAgICAgICAgICAgICAgICAgICBgO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBJZiBkaWxhdGlvbiBpcyAxIGFuZCBwYWRkaW5nIGlzIG9kZCwgd2UgaGF2ZSBhbHJlYWR5IHJlYWQgdGhlXG4gICAgICAgICAgICAgIC8vIHRleGVsIHdoZW4gY29uc3RydWN0aW5nIHRoZSBwcmV2aW91cyB4IHZhbHVlLiBIZXJlIHdlIGNhblxuICAgICAgICAgICAgICAvLyBzaW1wbHkgc2tpcCB0aGUgdGV4dHVyZSByZWFkLlxuICAgICAgICAgICAgICBpZiAobmV4dFRleGVsT2Zmc2V0ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgbWFpbkxvb3AgKz0gYFxuICAgICAgICAgICAgICAgICAgICB4QyR7Y29sSW5kZXggKyAxfSA9IHhUZXhlbEMke2NvbEluZGV4fTtcbiAgICAgICAgICAgICAgICAgICAgYDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtYWluTG9vcCArPSBgXG4gICAgICAgICAgICAgICAgICAgIHhDT2Zmc2V0ID0geEMgKyAke25leHRUZXhlbE9mZnNldH07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHhDT2Zmc2V0ID49IDAgJiYgeENPZmZzZXQgPCBpbkRpbXNbMV0gJiYgeFRleGVsQyR7XG4gICAgICAgICAgICAgICAgICAgIGNvbEluZGV4ICsgMX1SZWFkeSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgeFRleGVsQyR7Y29sSW5kZXggKyAxfSA9IGdldFgoYmF0Y2gsIHhSLCB4Q09mZnNldCwgZDEpO1xuICAgICAgICAgICAgICAgICAgICAgIGlmICh4Q09mZnNldCArIDEgPj0gaW5EaW1zWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4VGV4ZWxDJHtjb2xJbmRleCArIDF9Lnp3ID0gdmVjMigwLjApO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB4VGV4ZWxDJHtjb2xJbmRleCArIDF9UmVhZHkgPSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgeEMke2NvbEluZGV4ICsgMX0gPSB4VGV4ZWxDJHtjb2xJbmRleCArIDF9O1xuICAgICAgICAgICAgICAgICAgICBgO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgeyAgLy8gc3RyaWRlID09PSAyXG4gICAgICAgIGlmIChjb2xJbmRleCA8IGZpbHRlcldpZHRoKSB7XG4gICAgICAgICAgLy8gRGVwZW5kaW5nIG9uIHdoZXRoZXIgcGFkTGVmdCBpcyBldmVuIG9yIG9kZCwgd2Ugd2FudCBlaXRoZXIgdGhlXG4gICAgICAgICAgLy8geHkgb3IgencgY2hhbm5lbHMgZnJvbSBYIHRleGVscyBmb3IgeEMke2NvbEluZGV4fS4gSWYgcGFkTGVmdCBpc1xuICAgICAgICAgIC8vIGV2ZW4sIHhDJHtjb2xJbmRleCArMX0gaXMgc2ltcGx5IHRoZSB6dyBjaGFubmVscyBvZiB0ZXhlbHMgd2UndmVcbiAgICAgICAgICAvLyBhbHJlYWR5IHNhbXBsZWQuIEJ1dCBpZiBwYWRMZWZ0IGlzIG9kZCwgeEN7JGMgKyAxfS56dyB3aWxsXG4gICAgICAgICAgLy8gbmVlZCB0byBjb21lIGZyb20gdGhlIHh5IGNoYW5uZWxzIG9mIGEgbmV3IHRleGVsLCBoZW5jZSB0aGUgYFxuICAgICAgICAgIC8vIHZlYzRcbiAgICAgICAgICAvLyBmaW5hbGAgaW5pdGlhbGl6ZWQgYmVsb3cuXG4gICAgICAgICAgaWYgKHBhZExlZnQgJSAyID09PSAxKSB7XG4gICAgICAgICAgICBtYWluTG9vcCArPSBgXG4gICAgICAgICAgICAgICAgeENPZmZzZXQgPSB4QyArIDEgLSBzdHJpZGVzWzFdO1xuICAgICAgICAgICAgICAgIGlmKHhDT2Zmc2V0ID49IDAgJiYgeENPZmZzZXQgPCBpbkRpbXNbMV0gJiYgeFRleGVsQyR7XG4gICAgICAgICAgICAgICAgY29sSW5kZXh9UmVhZHkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgeFRleGVsQyR7Y29sSW5kZXh9ID0gZ2V0WChiYXRjaCwgeFIsIHhDT2Zmc2V0LCBkMSk7XG4gICAgICAgICAgICAgICAgICAvLyBOZWVkIHRvIG1hbnVhbGx5IGNsZWFyIHVudXNlZCBjaGFubmVscyBpbiBjYXNlXG4gICAgICAgICAgICAgICAgICAvLyB3ZSdyZSByZWFkaW5nIGZyb20gcmVjeWNsZWQgdGV4dHVyZS5cbiAgICAgICAgICAgICAgICAgIGlmICh4Q09mZnNldCArIDEgPj0gaW5EaW1zWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgIHhUZXhlbEMke2NvbEluZGV4fS56dyA9IHZlYzIoMC4wKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHhUZXhlbEMke2NvbEluZGV4fVJlYWR5ID0gMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZih4QyArIDEgPj0gMCAmJiB4QyArIDEgPCBpbkRpbXNbMV0gJiYgeFRleGVsQyR7XG4gICAgICAgICAgICAgICAgY29sSW5kZXggKyAxfVJlYWR5ID09IDApIHtcbiAgICAgICAgICAgICAgICAgIHhUZXhlbEMke2NvbEluZGV4ICsgMX0gPSBnZXRYKGJhdGNoLCB4UiwgeEMgKyAxLCBkMSk7XG4gICAgICAgICAgICAgICAgICAvLyBOZWVkIHRvIG1hbnVhbGx5IGNsZWFyIHVudXNlZCBjaGFubmVscyBpbiBjYXNlXG4gICAgICAgICAgICAgICAgICAvLyB3ZSdyZSByZWFkaW5nIGZyb20gcmVjeWNsZWQgdGV4dHVyZS5cbiAgICAgICAgICAgICAgICAgIGlmICh4QyArIDIgPj0gaW5EaW1zWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgIHhUZXhlbEMke2NvbEluZGV4ICsgMX0uencgPSB2ZWMyKDAuMCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB4VGV4ZWxDJHtjb2xJbmRleCArIDF9UmVhZHkgPSAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHhDJHtjb2xJbmRleH0gPSB2ZWM0KHhUZXhlbEMke2NvbEluZGV4fS56dywgeFRleGVsQyR7XG4gICAgICAgICAgICAgICAgY29sSW5kZXggKyAxfS56dyk7XG4gICAgICAgICAgICAgIGA7XG5cbiAgICAgICAgICAgIGlmIChjb2xJbmRleCArIDEgPCBmaWx0ZXJXaWR0aCkge1xuICAgICAgICAgICAgICBtYWluTG9vcCArPSBgXG4gICAgICAgICAgICAgICAgICBmaW5hbCA9IHZlYzQoMC4wKTtcbiAgICAgICAgICAgICAgICAgIHhDT2Zmc2V0ID0geEMgKyAxICsgc3RyaWRlc1sxXTtcbiAgICAgICAgICAgICAgICAgIGlmKHhDT2Zmc2V0ID49IDAgJiYgeENPZmZzZXQgPCBpbkRpbXNbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgZmluYWwgPSBnZXRYKGJhdGNoLCB4UiwgeENPZmZzZXQsIGQxKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHhDJHtjb2xJbmRleCArIDF9ID0gdmVjNCh4VGV4ZWxDJHtjb2xJbmRleCArIDF9Lnh5LCBmaW5hbC54eSk7XG4gICAgICAgICAgICAgICAgYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWFpbkxvb3AgKz0gYFxuICAgICAgICAgICAgICAgIGlmKHhDID49IDAgJiYgeEMgPCBpbkRpbXNbMV0gJiYgeFRleGVsQyR7Y29sSW5kZXh9UmVhZHkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgeFRleGVsQyR7Y29sSW5kZXh9ID0gZ2V0WChiYXRjaCwgeFIsIHhDLCBkMSk7XG4gICAgICAgICAgICAgICAgICBpZiAoeEMgKyAxID49IGluRGltc1sxXSkge1xuICAgICAgICAgICAgICAgICAgICB4VGV4ZWxDJHtjb2xJbmRleH0uencgPSB2ZWMyKDAuMCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB4VGV4ZWxDJHtjb2xJbmRleH1SZWFkeSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgeENPZmZzZXQgPSB4QyArIHN0cmlkZXNbMV07XG4gICAgICAgICAgICAgICAgaWYoeENPZmZzZXQgPj0gMCAmJiB4Q09mZnNldCA8IGluRGltc1sxXSAmJiB4VGV4ZWxDJHtcbiAgICAgICAgICAgICAgICBjb2xJbmRleCArIDF9UmVhZHkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgeFRleGVsQyR7Y29sSW5kZXggKyAxfSA9IGdldFgoYmF0Y2gsIHhSLCB4Q09mZnNldCwgZDEpO1xuICAgICAgICAgICAgICAgICAgaWYgKHhDT2Zmc2V0ICsgMSA+PSBpbkRpbXNbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgeFRleGVsQyR7Y29sSW5kZXggKyAxfS56dyA9IHZlYzIoMC4pO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgeFRleGVsQyR7Y29sSW5kZXggKyAxfVJlYWR5ID0gMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB4QyR7Y29sSW5kZXh9ID0gdmVjNChcbiAgICAgICAgICAgICAgICAgIHhUZXhlbEMke2NvbEluZGV4fS54eSwgeFRleGVsQyR7Y29sSW5kZXggKyAxfS54eSk7XG4gICAgICAgICAgICAgIGA7XG5cbiAgICAgICAgICAgIGlmIChjb2xJbmRleCArIDEgPCBmaWx0ZXJXaWR0aCkge1xuICAgICAgICAgICAgICBtYWluTG9vcCArPSBgXG4gICAgICAgICAgICAgICAgICB4QyR7Y29sSW5kZXggKyAxfSA9IHZlYzQoeFRleGVsQyR7Y29sSW5kZXh9Lnp3LCB4VGV4ZWxDJHtcbiAgICAgICAgICAgICAgICAgIGNvbEluZGV4ICsgMX0uencpO1xuICAgICAgICAgICAgICAgIGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGxvY2FsaXplIHRoZSBkb3RQcm9kIGFjY3VtdWxhdGlvbiB3aXRoaW4gdGhlIGxvb3AsIHRoZSB0aGVvcnkgaXMgZm9yXG4gICAgICAvLyBHUFUgd2l0aCBsaW1pdGVkIGNhY2hlLCBhY2N1bXVsYXRlIHN1bSBhY3Jvc3MgbGFyZ2UgYW1vdW50IG9mXG4gICAgICAvLyB2ZXJpYWJsZXMgd2lsbCBjYXVzZSBsb3RzIG9mIGNhY2hlIG1pc3Nlcy4gKGkuZS4gNXg1IGZpbHRlciB3aWxsIGhhdmVcbiAgICAgIC8vIDUwIHZhcmlhYmxlcylcbiAgICAgIGlmIChjb2xJbmRleCA8IGZpbHRlcldpZHRoKSB7XG4gICAgICAgIG1haW5Mb29wICs9IGBcbiAgICAgICAgICAgIHdUZXhlbCA9IGdldFcociwgJHtjb2xJbmRleH0sIGQxLCBxKTtcbiAgICAgICAgICAgIGRvdFByb2QgKz0geEMke2NvbEluZGV4fSAqIHZlYzQod1RleGVsLnh6LCB3VGV4ZWwueHopO1xuICAgICAgICAgIGA7XG5cbiAgICAgICAgaWYgKGNvbEluZGV4ICsgMSA8IGZpbHRlcldpZHRoKSB7XG4gICAgICAgICAgbWFpbkxvb3AgKz0gYFxuICAgICAgICAgICAgICB3VGV4ZWwgPSBnZXRXKHIsICR7Y29sSW5kZXggKyAxfSwgZDEsIHEpO1xuICAgICAgICAgICAgICBkb3RQcm9kICs9IHhDJHtjb2xJbmRleCArIDF9ICogdmVjNCh3VGV4ZWwueHosIHdUZXhlbC54eik7XG4gICAgICAgICAgICBgO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIG1haW5Mb29wICs9IGBcbiAgICB9XG4gIGA7XG4gICAgbWFpbkxvb3AgKz0gYFxuICAgICAgfVxuICAgIGA7XG5cbiAgICBsZXQgYWN0aXZhdGlvblNuaXBwZXQgPSAnJywgYXBwbHlBY3RpdmF0aW9uU25pcHBldCA9ICcnO1xuICAgIGlmIChhY3RpdmF0aW9uKSB7XG4gICAgICBpZiAoaGFzUHJlbHVBY3RpdmF0aW9uKSB7XG4gICAgICAgIGFjdGl2YXRpb25TbmlwcGV0ID0gYHZlYzQgYWN0aXZhdGlvbih2ZWM0IGEpIHtcbiAgICAgICAgICB2ZWM0IGIgPSBnZXRQcmVsdUFjdGl2YXRpb25XZWlnaHRzQXRPdXRDb29yZHMoKTtcbiAgICAgICAgICAke2FjdGl2YXRpb259XG4gICAgICAgIH1gO1xuICAgICAgfSBlbHNlIGlmIChoYXNMZWFreVJlbHVBbHBoYSkge1xuICAgICAgICBhY3RpdmF0aW9uU25pcHBldCA9IGB2ZWM0IGFjdGl2YXRpb24odmVjNCBhKSB7XG4gICAgICAgICAgdmVjNCBiID0gZ2V0TGVha3lyZWx1QWxwaGFBdE91dENvb3JkcygpO1xuICAgICAgICAgICR7YWN0aXZhdGlvbn1cbiAgICAgICAgfWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhY3RpdmF0aW9uU25pcHBldCA9IGB2ZWM0IGFjdGl2YXRpb24odmVjNCB4KSB7XG4gICAgICAgICAgJHthY3RpdmF0aW9ufVxuICAgICAgICB9YDtcbiAgICAgIH1cblxuICAgICAgYXBwbHlBY3RpdmF0aW9uU25pcHBldCA9IGByZXN1bHQgPSBhY3RpdmF0aW9uKHJlc3VsdCk7YDtcbiAgICB9XG5cbiAgICBjb25zdCBhZGRCaWFzU25pcHBldCA9IGFkZEJpYXMgPyAncmVzdWx0ICs9IGdldEJpYXNBdE91dENvb3JkcygpOycgOiAnJztcbiAgICBpZiAoYWRkQmlhcykge1xuICAgICAgdGhpcy52YXJpYWJsZU5hbWVzLnB1c2goJ2JpYXMnKTtcbiAgICB9XG5cbiAgICBpZiAoaGFzUHJlbHVBY3RpdmF0aW9uKSB7XG4gICAgICB0aGlzLnZhcmlhYmxlTmFtZXMucHVzaCgncHJlbHVBY3RpdmF0aW9uV2VpZ2h0cycpO1xuICAgIH1cbiAgICBpZiAoaGFzTGVha3lSZWx1QWxwaGEpIHtcbiAgICAgIHRoaXMudmFyaWFibGVOYW1lcy5wdXNoKCdsZWFreXJlbHVBbHBoYScpO1xuICAgIH1cblxuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICAke2FjdGl2YXRpb25TbmlwcGV0fVxuXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIGl2ZWM0IGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICBpbnQgYmF0Y2ggPSBjb29yZHMueDtcbiAgICAgICAgaXZlYzIgeFJDQ29ybmVyID0gY29vcmRzLnl6ICogc3RyaWRlcyAtIHBhZHM7XG4gICAgICAgIGludCBkMiA9IGNvb3Jkcy53O1xuICAgICAgICBpbnQgZDEgPSBkMiAvICR7Y2hhbm5lbE11bH07XG4gICAgICAgIGludCBxID0gZDIgLSBkMSAqICR7Y2hhbm5lbE11bH07XG4gICAgICAgIGludCB4UkNvcm5lciA9IHhSQ0Nvcm5lci54O1xuICAgICAgICBpbnQgeENDb3JuZXIgPSB4UkNDb3JuZXIueTtcblxuICAgICAgICAvL2ludGlhbGl6ZSBkb3RQcm9kIHdpdGggYSBzbWFsbCBlcHNpbG9uIHNlZW1zIHRvIHJlZHVjZSBHUFUgYWNjdXJhY3kgbG9zcy5cbiAgICAgICAgdmVjNCBkb3RQcm9kID0gdmVjNCgwLjAwMDAwMDAwMDAwMDAwMSk7XG5cbiAgICAgICAgJHttYWluTG9vcH1cblxuICAgICAgICB2ZWM0IHJlc3VsdCA9IGRvdFByb2QgLSB2ZWM0KDAuMDAwMDAwMDAwMDAwMDAxKTtcbiAgICAgICAgJHthZGRCaWFzU25pcHBldH1cbiAgICAgICAgJHthcHBseUFjdGl2YXRpb25TbmlwcGV0fVxuICAgICAgICBzZXRPdXRwdXQocmVzdWx0KTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG4iXX0=