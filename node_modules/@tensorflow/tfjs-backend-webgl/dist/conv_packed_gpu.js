/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
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
export class Conv2DPackedProgram {
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
      for (int d1 = 0; d1 < ${convInfo.inChannels}; d1 += 2) {
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
             wTexel = getW(r, ${colIndex}, d1, d2);
             dotProd += xC${colIndex}.xxzz * vec4(wTexel.xy, wTexel.xy);
             if(d1 + 1 < ${convInfo.inChannels}) {
               dotProd += xC${colIndex}.yyww * vec4(wTexel.zw, wTexel.zw);
             }
           `;
                if (colIndex + 1 < filterWidth) {
                    mainLoop += `
               wTexel = getW(r, ${colIndex + 1}, d1, d2);
               dotProd += xC${colIndex + 1}.xxzz * vec4(wTexel.xy, wTexel.xy);
               if(d1 + 1 < ${convInfo.inChannels}) {
                 dotProd += xC${colIndex + 1}.yyww * vec4(wTexel.zw, wTexel.zw);
               }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udl9wYWNrZWRfZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9jb252X3BhY2tlZF9ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUYsT0FBTyxFQUFlLElBQUksRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRXpELE9BQU8sRUFBZSxnQkFBZ0IsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUU1RCxNQUFNLE9BQU8sbUJBQW1CO0lBYzlCLFlBQ0ksUUFBaUMsRUFBRSxPQUFPLEdBQUcsS0FBSyxFQUNsRCxhQUFxQixJQUFJLEVBQUUsa0JBQWtCLEdBQUcsS0FBSyxFQUNyRCxpQkFBaUIsR0FBRyxLQUFLO1FBaEI3QixrQkFBYSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBSXBCLG1CQUFjLEdBQUc7WUFDZixFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQWdCLEVBQUU7WUFDdkMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxPQUFnQixFQUFFO1lBQzFDLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsT0FBZ0IsRUFBRTtZQUM1QyxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQWdCLEVBQUU7U0FDMUMsQ0FBQztRQU1BLElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUNyQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyRSxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUN0QyxNQUFN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LElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNqQztRQUVELElBQUksa0JBQWtCLEVBQUU7WUFDdEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztTQUNuRDtRQUNELElBQUksaUJBQWlCLEVBQUU7WUFDckIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUMzQztRQUVELElBQUksQ0FBQyxRQUFRLEdBQUc7U0FDWixpQkFBaUI7Ozs7Ozs7Ozs7Ozs7V0FhZixRQUFROzs7V0FHUixjQUFjO1dBQ2Qsc0JBQXNCOzs7TUFHM0IsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIyIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuIGltcG9ydCB7YmFja2VuZF91dGlsLCB1dGlsfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG4gaW1wb3J0IHtHUEdQVVByb2dyYW0sIHVzZVNoYXBlVW5pZm9ybXN9IGZyb20gJy4vZ3BncHVfbWF0aCc7XG5cbiBleHBvcnQgY2xhc3MgQ29udjJEUGFja2VkUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gICB2YXJpYWJsZU5hbWVzID0gWyd4JywgJ1cnXTtcbiAgIHBhY2tlZElucHV0cyA9IHRydWU7XG4gICBwYWNrZWRPdXRwdXQgPSB0cnVlO1xuICAgb3V0cHV0U2hhcGU6IG51bWJlcltdO1xuICAgdXNlckNvZGU6IHN0cmluZztcbiAgIGVuYWJsZVNoYXBlVW5pZm9ybXM6IGJvb2xlYW47XG4gICBjdXN0b21Vbmlmb3JtcyA9IFtcbiAgICAge25hbWU6ICdwYWRzJywgdHlwZTogJ2l2ZWMyJyBhcyBjb25zdCB9LFxuICAgICB7bmFtZTogJ3N0cmlkZXMnLCB0eXBlOiAnaXZlYzInIGFzIGNvbnN0IH0sXG4gICAgIHtuYW1lOiAnZGlsYXRpb25zJywgdHlwZTogJ2l2ZWMyJyBhcyBjb25zdCB9LFxuICAgICB7bmFtZTogJ2luRGltcycsIHR5cGU6ICdpdmVjMicgYXMgY29uc3QgfSxcbiAgIF07XG5cbiAgIGNvbnN0cnVjdG9yKFxuICAgICAgIGNvbnZJbmZvOiBiYWNrZW5kX3V0aWwuQ29udjJESW5mbywgYWRkQmlhcyA9IGZhbHNlLFxuICAgICAgIGFjdGl2YXRpb246IHN0cmluZyA9IG51bGwsIGhhc1ByZWx1QWN0aXZhdGlvbiA9IGZhbHNlLFxuICAgICAgIGhhc0xlYWt5UmVsdUFscGhhID0gZmFsc2UpIHtcbiAgICAgdGhpcy5vdXRwdXRTaGFwZSA9IGNvbnZJbmZvLm91dFNoYXBlO1xuICAgICB0aGlzLmVuYWJsZVNoYXBlVW5pZm9ybXMgPSB1c2VTaGFwZVVuaWZvcm1zKHRoaXMub3V0cHV0U2hhcGUubGVuZ3RoKTtcbiAgICAgY29uc3QgcGFkTGVmdCA9IGNvbnZJbmZvLnBhZEluZm8ubGVmdDtcbiAgICAgY29uc3Qgc3RyaWRlV2lkdGggPSBjb252SW5mby5zdHJpZGVXaWR0aDtcbiAgICAgY29uc3QgZGlsYXRpb25XaWR0aCA9IGNvbnZJbmZvLmRpbGF0aW9uV2lkdGg7XG4gICAgIGNvbnN0IGZpbHRlckhlaWdodCA9IGNvbnZJbmZvLmZpbHRlckhlaWdodDtcbiAgICAgY29uc3QgZmlsdGVyV2lkdGggPSBjb252SW5mby5maWx0ZXJXaWR0aDtcbiAgICAgY29uc3QgdGV4ZWxzQWNyb3NzID0gZmlsdGVyV2lkdGg7XG5cbiAgICAgbGV0IG1haW5Mb29wID0gYFxuICAgICAgIGludCB4UjsgaW50IHhDOyBpbnQgeENPZmZzZXQ7XG4gICAgICAgdmVjNCB3VGV4ZWw7IHZlYzQgcHJldmlvdXM7IHZlYzQgZmluYWw7YDtcblxuICAgICBmb3IgKGxldCBjID0gMDsgYyA8IGZpbHRlcldpZHRoOyBjKyspIHtcbiAgICAgICBtYWluTG9vcCArPSBgXG4gICAgICAgICAgIHZlYzQgeFRleGVsQyR7YyAqIDJ9O1xuICAgICAgICAgICBpbnQgeFRleGVsQyR7YyAqIDJ9UmVhZHk7XG4gICAgICAgICAgIHZlYzQgeFRleGVsQyR7YyAqIDIgKyAxfTtcbiAgICAgICAgICAgaW50IHhUZXhlbEMke2MgKiAyICsgMX1SZWFkeTtcbiAgICAgICAgICAgdmVjNCB4QyR7Y307YDtcbiAgICAgfVxuXG4gICAgIC8qKlxuICAgICAgKiBUaGlzIHZlY3Rvcml6ZWQgaW1wbGVtZW50YXRpb24gd29ya3MgYnkgZ2F0aGVyaW5nIHRoZSB2YWx1ZXMgbmVlZGVkIGZvclxuICAgICAgKiBlYWNoIG91dHB1dCBjaGFubmVsJ3MgZG90IHByb2R1Y3QgaW50byB2ZWM0J3MgYW5kIHRoZW4gbXVsdGlwbHlpbmcgdGhlbVxuICAgICAgKiBhbGwgdG9nZXRoZXIgKHRoaXMgaGFwcGVucyBpbiB0aGUgZmluYWwgZG91YmxlIGZvci1sb29wIGJlbG93KS4gTW9zdCBvZlxuICAgICAgKiB0aGUgbWFpbiBsb29wIGNvbnNpc3RzIG9mIGNvbnN0cnVjdGluZyB0aGVzZSB2ZWM0J3Mgd2l0aCB0aGUgbWluaW11bVxuICAgICAgKiBudW1iZXIgb2YgdGV4dHVyZTJEIGNhbGxzLCB3aGljaCBtZWFucyBtYWtpbmcgdXNlIG9mIGFsbCBmb3VyIHJldHVybmVkXG4gICAgICAqIHZhbHVlcyBmcm9tIGEgdGV4dHVyZTJEIGNhbGwgYXQgb25jZS5cbiAgICAgICovXG4gICAgIG1haW5Mb29wICs9IGBcbiAgICAgZm9yIChpbnQgciA9IDA7IHIgPCAke2ZpbHRlckhlaWdodH07IHIrKykge1xuICAgICAgZm9yIChpbnQgZDEgPSAwOyBkMSA8ICR7Y29udkluZm8uaW5DaGFubmVsc307IGQxICs9IDIpIHtcbiAgICAgICBgO1xuICAgICBmb3IgKGxldCBjID0gMDsgYyA8IGZpbHRlcldpZHRoOyBjKyspIHtcbiAgICAgICBtYWluTG9vcCArPSBgXG4gICAgICAgICAgIHhUZXhlbEMke2MgKiAyfSA9IHZlYzQoMC4wKTtcbiAgICAgICAgICAgeFRleGVsQyR7YyAqIDJ9UmVhZHkgPSAwO1xuICAgICAgICAgICB4VGV4ZWxDJHtjICogMiArIDF9ID0gdmVjNCgwLjApO1xuICAgICAgICAgICB4VGV4ZWxDJHtjICogMiArIDF9UmVhZHkgPSAwO1xuICAgICAgICAgICB4QyR7Y30gPSB2ZWM0KDAuMCk7YDtcbiAgICAgfVxuICAgICBtYWluTG9vcCArPSBgXG4gICAgICAgICB4UiA9IHhSQ29ybmVyICsgciAqIGRpbGF0aW9uc1swXTtcbiAgICAgICAgIGlmICh4UiA+PTAgJiYgeFIgPCBpbkRpbXNbMF0pIHtcbiAgICAgICBgO1xuXG4gICAgIGZvciAobGV0IHRleGVsQyA9IDA7IHRleGVsQyA8ICh0ZXhlbHNBY3Jvc3MgKyAxKSAvIDI7IHRleGVsQysrKSB7XG4gICAgICAgY29uc3QgY29sSW5kZXggPSB0ZXhlbEMgKiAyO1xuXG4gICAgICAgbWFpbkxvb3AgKz0gYFxuICAgICAgICAgICB4QyA9IHhDQ29ybmVyICsgJHtjb2xJbmRleCAqIGRpbGF0aW9uV2lkdGh9O1xuICAgICAgICAgICBgO1xuXG4gICAgICAgaWYgKHN0cmlkZVdpZHRoID09PSAxKSB7XG4gICAgICAgICBpZiAoY29sSW5kZXggPCBmaWx0ZXJXaWR0aCkge1xuICAgICAgICAgICAvLyBJZiBwYWRkaW5nIGlzIG9kZCwgdGhlIG91dGVyIHRleGVscyBoYXZlIHRvIGJlIGNvbXBvc2VkLlxuICAgICAgICAgICBpZiAocGFkTGVmdCAlIDIgPT09IDEpIHtcbiAgICAgICAgICAgICAvLyBUT0RPOiBFbnN1cmUgdmVjNCBwcmV2aW91cyBkb2VzIG5vdCByZXN1bHQgaW4gcmVkdW5kYW50IHNhbXBsZSxcbiAgICAgICAgICAgICAvLyBhbmQgYXZvaWQgc2V0dGluZyB4VGV4ZWxSQydzIHRoYXQgZXhjZWVkIHRoZSBib3VuZGFyeSBpbiB0aGVcbiAgICAgICAgICAgICAvLyBmaXJzdCBwbGFjZSByYXRoZXIgdGhhbiByZXNldHRpbmcgdGhlbSB0byB2ZWM0KDApKS5cblxuICAgICAgICAgICAgIC8vIFRvIGNvbXB1dGUgeENPZmZzZXQ6XG4gICAgICAgICAgICAgLy8gLSBJZiBwYWRkaW5nIGlzIG9kZCwgd2UgbXVzdCBhZGQgMSB0byBlbnN1cmUgd2UgYXNrIGZvciBhblxuICAgICAgICAgICAgIC8vIGV2ZW4tbnVtYmVyZWQgcm93LlxuICAgICAgICAgICAgIC8vIC0gV2Ugc3VidHJhY3QgMiB0byBhY2Nlc3MgdGhlIHByZXZpb3VzIHRleGVsLlxuXG4gICAgICAgICAgICAgbWFpbkxvb3AgKz0gYFxuICAgICAgICAgICAgICAgICB4Q09mZnNldCA9IHhDICsgMTtcbiAgICAgICAgICAgICAgICAgaWYgKHhDT2Zmc2V0ID49IDAgJiYgeENPZmZzZXQgPCBpbkRpbXNbMV0gJiYgeFRleGVsQyR7XG4gICAgICAgICAgICAgICAgIGNvbEluZGV4fVJlYWR5ID09IDApIHtcbiAgICAgICAgICAgICAgICAgICB4VGV4ZWxDJHtjb2xJbmRleH0gPSBnZXRYKGJhdGNoLCB4UiwgeENPZmZzZXQsIGQxKTtcblxuICAgICAgICAgICAgICAgICAgIC8vIE5lZWQgdG8gbWFudWFsbHkgY2xlYXIgdW51c2VkIGNoYW5uZWxzIGluIGNhc2VcbiAgICAgICAgICAgICAgICAgICAvLyB3ZSdyZSByZWFkaW5nIGZyb20gcmVjeWNsZWQgdGV4dHVyZS5cbiAgICAgICAgICAgICAgICAgICBpZiAoeENPZmZzZXQgKyAxID49IGluRGltc1sxXSkge1xuICAgICAgICAgICAgICAgICAgICAgeFRleGVsQyR7Y29sSW5kZXh9Lnp3ID0gdmVjMigwLjApO1xuICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICB4VGV4ZWxDJHtjb2xJbmRleH1SZWFkeSA9IDE7XG4gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIGA7XG4gICAgICAgICAgICAgLy8gVGhpcyB0ZXhlbCBoYXMgYmVlbiByZWFkIGluIHByZXZpb3VzIGl0ZXJhdGlvbiBpZiB0aGUgZGlsYXRpb25cbiAgICAgICAgICAgICAvLyBpcyAxLlxuICAgICAgICAgICAgIGlmIChkaWxhdGlvbldpZHRoID09PSAxICYmIGNvbEluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgbWFpbkxvb3AgKz0gYFxuICAgICAgICAgICAgICAgICB4QyR7Y29sSW5kZXh9ID0gdmVjNCh4VGV4ZWxDJHtjb2xJbmRleCAtIDJ9Lnp3LCB4VGV4ZWxDJHtcbiAgICAgICAgICAgICAgICAgICBjb2xJbmRleH0ueHkpO1xuICAgICAgICAgICAgICAgICBgO1xuICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICBtYWluTG9vcCArPSBgXG4gICAgICAgICAgICAgICAgICAgeENPZmZzZXQgPSB4QyArIDEgLSAyO1xuXG4gICAgICAgICAgICAgICAgICAgaWYgKHhDT2Zmc2V0ID49IDAgJiYgeENPZmZzZXQgPCBpbkRpbXNbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgIHByZXZpb3VzID0gZ2V0WChiYXRjaCwgeFIsIHhDT2Zmc2V0LCBkMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgIC8vIE5lZWQgdG8gbWFudWFsbHkgY2xlYXIgdW51c2VkIGNoYW5uZWxzIGluIGNhc2VcbiAgICAgICAgICAgICAgICAgICAgIC8vIHdlJ3JlIHJlYWRpbmcgZnJvbSByZWN5Y2xlZCB0ZXh0dXJlLlxuICAgICAgICAgICAgICAgICAgICAgaWYgKHhDT2Zmc2V0ICsgMSA+PSBpbkRpbXNbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgcHJldmlvdXMuencgPSB2ZWMyKDAuMCk7XG4gICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgIHhDJHtjb2xJbmRleH0gPSB2ZWM0KHByZXZpb3VzLnp3LCB4VGV4ZWxDJHtjb2xJbmRleH0ueHkpO1xuICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICB4QyR7Y29sSW5kZXh9ID0gdmVjNCgwLjAsIDAuMCwgeFRleGVsQyR7Y29sSW5kZXh9Lnh5KTtcbiAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgYDtcbiAgICAgICAgICAgICB9XG4gICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgLy8gUGFkZGluZyBpcyBldmVuLCBzbyB4UkMgY29ycmVzcG9uZHMgdG8gYSBzaW5nbGUgdGV4ZWwuXG4gICAgICAgICAgICAgbWFpbkxvb3AgKz0gYFxuICAgICAgICAgICAgICAgICBpZiAoeEMgPj0gMCAmJiB4QyA8IGluRGltc1sxXSAmJiB4VGV4ZWxDJHtjb2xJbmRleH1SZWFkeSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgeFRleGVsQyR7Y29sSW5kZXh9ID0gZ2V0WChiYXRjaCwgeFIsIHhDLCBkMSk7XG4gICAgICAgICAgICAgICAgICAgaWYgKHhDICsgMSA+PSBpbkRpbXNbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgIHhUZXhlbEMke2NvbEluZGV4fS56dyA9IHZlYzIoMC4wKTtcbiAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgeFRleGVsQyR7Y29sSW5kZXh9UmVhZHkgPSAxO1xuICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgeEMke2NvbEluZGV4fSA9IHhUZXhlbEMke2NvbEluZGV4fTtcbiAgICAgICAgICAgICAgICAgYDtcbiAgICAgICAgICAgfVxuXG4gICAgICAgICAgIGlmIChjb2xJbmRleCArIDEgPCBmaWx0ZXJXaWR0aCkge1xuICAgICAgICAgICAgIC8vIElmIGRpbGF0aW9uIGlzIGV2ZW4sIHRoZSBzZWNvbmQgZW50cnkgc2hvdWxkIG1hdGNoIHRoZSBmaXJzdFxuICAgICAgICAgICAgIC8vIChlaXRoZXIgYm90aCBhcmUgY29tcG9zZWQgb3IgYm90aCBhcmUgc2luZ2xlIHNhbXBsZXMpLiBCdXQgaWZcbiAgICAgICAgICAgICAvLyBkaWxhdGlvbiBpcyBvZGQsIHRoZW4gdGhlIHNlY29uZCBlbnRyeSBzaG91bGQgYmUgdGhlIG9wcG9zaXRlXG4gICAgICAgICAgICAgLy8gb2YgdGhlIGZpcnN0IChpZiB0aGUgZmlyc3QgaXMgY29tcG9zZWQsIHRoZSBzZWNvbmQgaXMgYSBzaW5nbGVcbiAgICAgICAgICAgICAvLyBzYW1wbGUsIGFuZCB2aWNlIHZlcnNhLilcblxuICAgICAgICAgICAgIGNvbnN0IG5leHRUZXhlbE9mZnNldCA9IHBhZExlZnQgJSAyID09PSAwID9cbiAgICAgICAgICAgICAgICAgdXRpbC5uZWFyZXN0TGFyZ2VyRXZlbihkaWxhdGlvbldpZHRoKSA6XG4gICAgICAgICAgICAgICAgIGRpbGF0aW9uV2lkdGg7XG5cbiAgICAgICAgICAgICBpZiAoKGRpbGF0aW9uV2lkdGggJSAyID09PSAwICYmIHBhZExlZnQgJSAyID09PSAxKSB8fFxuICAgICAgICAgICAgICAgICAoZGlsYXRpb25XaWR0aCAlIDIgIT09IDAgJiYgcGFkTGVmdCAlIDIgIT09IDEpKSB7XG4gICAgICAgICAgICAgICBtYWluTG9vcCArPSBgXG4gICAgICAgICAgICAgICAgICAgeENPZmZzZXQgPSB4QyArIGltb2QocGFkc1sxXSwgMikgKyAke25leHRUZXhlbE9mZnNldH07XG5cbiAgICAgICAgICAgICAgICAgICBpZiAoeENPZmZzZXQgPj0gMCAmJiB4Q09mZnNldCA8IGluRGltc1sxXSAmJiB4VGV4ZWxDJHtcbiAgICAgICAgICAgICAgICAgICBjb2xJbmRleCArIDF9UmVhZHkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgeFRleGVsQyR7Y29sSW5kZXggKyAxfSA9IGdldFgoYmF0Y2gsIHhSLCB4Q09mZnNldCwgZDEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAvLyBOZWVkIHRvIG1hbnVhbGx5IGNsZWFyIHVudXNlZCBjaGFubmVscyBpbiBjYXNlXG4gICAgICAgICAgICAgICAgICAgICAvLyB3ZSdyZSByZWFkaW5nIGZyb20gcmVjeWNsZWQgdGV4dHVyZS5cbiAgICAgICAgICAgICAgICAgICAgIGlmICh4Q09mZnNldCArIDEgPj0gaW5EaW1zWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgIHhUZXhlbEMke2NvbEluZGV4ICsgMX0uencgPSB2ZWMyKDAuMCk7XG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICB4VGV4ZWxDJHtjb2xJbmRleCArIDF9UmVhZHkgPSAxO1xuICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICBgO1xuXG4gICAgICAgICAgICAgICAvLyBJZiBkaWxhdGlvbiA+IDEgdGhlbiB0aGUgeFJDJ3Mgd2lsbCBub3QgYmUgYWJsZSB0byBzaGFyZSBhbnlcbiAgICAgICAgICAgICAgIC8vIHZhbHVlcywgc28gZWFjaCB4UkMgd2lsbCByZXF1aXJlIHR3byB1bmlxdWUgY2FsbHMgdG8gZ2V0WC5cbiAgICAgICAgICAgICAgIGlmIChkaWxhdGlvbldpZHRoID4gMSkge1xuICAgICAgICAgICAgICAgICBtYWluTG9vcCArPSBgXG4gICAgICAgICAgICAgICAgICAgICB4Q09mZnNldCAtPSAyO1xuICAgICAgICAgICAgICAgICAgICAgaWYgKHhDT2Zmc2V0ID49IDAgJiYgeENPZmZzZXQgPCBpbkRpbXNbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICBwcmV2aW91cyA9IGdldFgoYmF0Y2gsIHhSLCB4Q09mZnNldCwgZDEpO1xuICAgICAgICAgICAgICAgICAgICAgIHhDJHtjb2xJbmRleCArIDF9ID0gdmVjNChwcmV2aW91cy56dywgeFRleGVsQyR7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xJbmRleCArIDF9Lnh5KTtcbiAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgeEMke2NvbEluZGV4ICsgMX0gPSB2ZWM0KDAuMCwgMC4wLCB4VGV4ZWxDJHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbEluZGV4ICsgMX0ueHkpO1xuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgYDtcbiAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgIG1haW5Mb29wICs9IGBcbiAgICAgICAgICAgICAgICAgICAgIHhDJHtjb2xJbmRleCArIDF9ID0gdmVjNCh4VGV4ZWxDJHtjb2xJbmRleH0uencsIHhUZXhlbEMke1xuICAgICAgICAgICAgICAgICAgICAgY29sSW5kZXggKyAxfS54eSk7XG4gICAgICAgICAgICAgICAgICAgICBgO1xuICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgIC8vIElmIGRpbGF0aW9uIGlzIDEgYW5kIHBhZGRpbmcgaXMgb2RkLCB3ZSBoYXZlIGFscmVhZHkgcmVhZCB0aGVcbiAgICAgICAgICAgICAgIC8vIHRleGVsIHdoZW4gY29uc3RydWN0aW5nIHRoZSBwcmV2aW91cyB4IHZhbHVlLiBIZXJlIHdlIGNhblxuICAgICAgICAgICAgICAgLy8gc2ltcGx5IHNraXAgdGhlIHRleHR1cmUgcmVhZC5cbiAgICAgICAgICAgICAgIGlmIChuZXh0VGV4ZWxPZmZzZXQgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgbWFpbkxvb3AgKz0gYFxuICAgICAgICAgICAgICAgICAgICAgeEMke2NvbEluZGV4ICsgMX0gPSB4VGV4ZWxDJHtjb2xJbmRleH07XG4gICAgICAgICAgICAgICAgICAgICBgO1xuICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgbWFpbkxvb3AgKz0gYFxuICAgICAgICAgICAgICAgICAgICAgeENPZmZzZXQgPSB4QyArICR7bmV4dFRleGVsT2Zmc2V0fTtcblxuICAgICAgICAgICAgICAgICAgICAgaWYgKHhDT2Zmc2V0ID49IDAgJiYgeENPZmZzZXQgPCBpbkRpbXNbMV0gJiYgeFRleGVsQyR7XG4gICAgICAgICAgICAgICAgICAgICBjb2xJbmRleCArIDF9UmVhZHkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICB4VGV4ZWxDJHtjb2xJbmRleCArIDF9ID0gZ2V0WChiYXRjaCwgeFIsIHhDT2Zmc2V0LCBkMSk7XG4gICAgICAgICAgICAgICAgICAgICAgIGlmICh4Q09mZnNldCArIDEgPj0gaW5EaW1zWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgeFRleGVsQyR7Y29sSW5kZXggKyAxfS56dyA9IHZlYzIoMC4wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICB4VGV4ZWxDJHtjb2xJbmRleCArIDF9UmVhZHkgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICB4QyR7Y29sSW5kZXggKyAxfSA9IHhUZXhlbEMke2NvbEluZGV4ICsgMX07XG4gICAgICAgICAgICAgICAgICAgICBgO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgfVxuICAgICAgICAgfVxuICAgICAgIH0gZWxzZSB7ICAvLyBzdHJpZGUgPT09IDJcbiAgICAgICAgIGlmIChjb2xJbmRleCA8IGZpbHRlcldpZHRoKSB7XG4gICAgICAgICAgIC8vIERlcGVuZGluZyBvbiB3aGV0aGVyIHBhZExlZnQgaXMgZXZlbiBvciBvZGQsIHdlIHdhbnQgZWl0aGVyIHRoZVxuICAgICAgICAgICAvLyB4eSBvciB6dyBjaGFubmVscyBmcm9tIFggdGV4ZWxzIGZvciB4QyR7Y29sSW5kZXh9LiBJZiBwYWRMZWZ0IGlzXG4gICAgICAgICAgIC8vIGV2ZW4sIHhDJHtjb2xJbmRleCArMX0gaXMgc2ltcGx5IHRoZSB6dyBjaGFubmVscyBvZiB0ZXhlbHMgd2UndmVcbiAgICAgICAgICAgLy8gYWxyZWFkeSBzYW1wbGVkLiBCdXQgaWYgcGFkTGVmdCBpcyBvZGQsIHhDeyRjICsgMX0uencgd2lsbFxuICAgICAgICAgICAvLyBuZWVkIHRvIGNvbWUgZnJvbSB0aGUgeHkgY2hhbm5lbHMgb2YgYSBuZXcgdGV4ZWwsIGhlbmNlIHRoZSBgXG4gICAgICAgICAgIC8vIHZlYzRcbiAgICAgICAgICAgLy8gZmluYWxgIGluaXRpYWxpemVkIGJlbG93LlxuICAgICAgICAgICBpZiAocGFkTGVmdCAlIDIgPT09IDEpIHtcbiAgICAgICAgICAgICBtYWluTG9vcCArPSBgXG4gICAgICAgICAgICAgICAgIHhDT2Zmc2V0ID0geEMgKyAxIC0gc3RyaWRlc1sxXTtcbiAgICAgICAgICAgICAgICAgaWYoeENPZmZzZXQgPj0gMCAmJiB4Q09mZnNldCA8IGluRGltc1sxXSAmJiB4VGV4ZWxDJHtcbiAgICAgICAgICAgICAgICAgY29sSW5kZXh9UmVhZHkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgIHhUZXhlbEMke2NvbEluZGV4fSA9IGdldFgoYmF0Y2gsIHhSLCB4Q09mZnNldCwgZDEpO1xuICAgICAgICAgICAgICAgICAgIC8vIE5lZWQgdG8gbWFudWFsbHkgY2xlYXIgdW51c2VkIGNoYW5uZWxzIGluIGNhc2VcbiAgICAgICAgICAgICAgICAgICAvLyB3ZSdyZSByZWFkaW5nIGZyb20gcmVjeWNsZWQgdGV4dHVyZS5cbiAgICAgICAgICAgICAgICAgICBpZiAoeENPZmZzZXQgKyAxID49IGluRGltc1sxXSkge1xuICAgICAgICAgICAgICAgICAgICAgeFRleGVsQyR7Y29sSW5kZXh9Lnp3ID0gdmVjMigwLjApO1xuICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICB4VGV4ZWxDJHtjb2xJbmRleH1SZWFkeSA9IDE7XG4gICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICBpZih4QyArIDEgPj0gMCAmJiB4QyArIDEgPCBpbkRpbXNbMV0gJiYgeFRleGVsQyR7XG4gICAgICAgICAgICAgICAgIGNvbEluZGV4ICsgMX1SZWFkeSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgeFRleGVsQyR7Y29sSW5kZXggKyAxfSA9IGdldFgoYmF0Y2gsIHhSLCB4QyArIDEsIGQxKTtcbiAgICAgICAgICAgICAgICAgICAvLyBOZWVkIHRvIG1hbnVhbGx5IGNsZWFyIHVudXNlZCBjaGFubmVscyBpbiBjYXNlXG4gICAgICAgICAgICAgICAgICAgLy8gd2UncmUgcmVhZGluZyBmcm9tIHJlY3ljbGVkIHRleHR1cmUuXG4gICAgICAgICAgICAgICAgICAgaWYgKHhDICsgMiA+PSBpbkRpbXNbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgIHhUZXhlbEMke2NvbEluZGV4ICsgMX0uencgPSB2ZWMyKDAuMCk7XG4gICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgIHhUZXhlbEMke2NvbEluZGV4ICsgMX1SZWFkeSA9IDE7XG4gICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICB4QyR7Y29sSW5kZXh9ID0gdmVjNCh4VGV4ZWxDJHtjb2xJbmRleH0uencsIHhUZXhlbEMke1xuICAgICAgICAgICAgICAgICBjb2xJbmRleCArIDF9Lnp3KTtcbiAgICAgICAgICAgICAgIGA7XG5cbiAgICAgICAgICAgICBpZiAoY29sSW5kZXggKyAxIDwgZmlsdGVyV2lkdGgpIHtcbiAgICAgICAgICAgICAgIG1haW5Mb29wICs9IGBcbiAgICAgICAgICAgICAgICAgICBmaW5hbCA9IHZlYzQoMC4wKTtcbiAgICAgICAgICAgICAgICAgICB4Q09mZnNldCA9IHhDICsgMSArIHN0cmlkZXNbMV07XG4gICAgICAgICAgICAgICAgICAgaWYoeENPZmZzZXQgPj0gMCAmJiB4Q09mZnNldCA8IGluRGltc1sxXSkge1xuICAgICAgICAgICAgICAgICAgICAgZmluYWwgPSBnZXRYKGJhdGNoLCB4UiwgeENPZmZzZXQsIGQxKTtcbiAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgeEMke2NvbEluZGV4ICsgMX0gPSB2ZWM0KHhUZXhlbEMke2NvbEluZGV4ICsgMX0ueHksIGZpbmFsLnh5KTtcbiAgICAgICAgICAgICAgICAgYDtcbiAgICAgICAgICAgICB9XG4gICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgbWFpbkxvb3AgKz0gYFxuICAgICAgICAgICAgICAgICBpZih4QyA+PSAwICYmIHhDIDwgaW5EaW1zWzFdICYmIHhUZXhlbEMke2NvbEluZGV4fVJlYWR5ID09IDApIHtcbiAgICAgICAgICAgICAgICAgICB4VGV4ZWxDJHtjb2xJbmRleH0gPSBnZXRYKGJhdGNoLCB4UiwgeEMsIGQxKTtcbiAgICAgICAgICAgICAgICAgICBpZiAoeEMgKyAxID49IGluRGltc1sxXSkge1xuICAgICAgICAgICAgICAgICAgICAgeFRleGVsQyR7Y29sSW5kZXh9Lnp3ID0gdmVjMigwLjApO1xuICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICB4VGV4ZWxDJHtjb2xJbmRleH1SZWFkeSA9IDE7XG4gICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICB4Q09mZnNldCA9IHhDICsgc3RyaWRlc1sxXTtcbiAgICAgICAgICAgICAgICAgaWYoeENPZmZzZXQgPj0gMCAmJiB4Q09mZnNldCA8IGluRGltc1sxXSAmJiB4VGV4ZWxDJHtcbiAgICAgICAgICAgICAgICAgY29sSW5kZXggKyAxfVJlYWR5ID09IDApIHtcbiAgICAgICAgICAgICAgICAgICB4VGV4ZWxDJHtjb2xJbmRleCArIDF9ID0gZ2V0WChiYXRjaCwgeFIsIHhDT2Zmc2V0LCBkMSk7XG4gICAgICAgICAgICAgICAgICAgaWYgKHhDT2Zmc2V0ICsgMSA+PSBpbkRpbXNbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgIHhUZXhlbEMke2NvbEluZGV4ICsgMX0uencgPSB2ZWMyKDAuKTtcbiAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgeFRleGVsQyR7Y29sSW5kZXggKyAxfVJlYWR5ID0gMTtcbiAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgIHhDJHtjb2xJbmRleH0gPSB2ZWM0KFxuICAgICAgICAgICAgICAgICAgIHhUZXhlbEMke2NvbEluZGV4fS54eSwgeFRleGVsQyR7Y29sSW5kZXggKyAxfS54eSk7XG4gICAgICAgICAgICAgICBgO1xuXG4gICAgICAgICAgICAgaWYgKGNvbEluZGV4ICsgMSA8IGZpbHRlcldpZHRoKSB7XG4gICAgICAgICAgICAgICBtYWluTG9vcCArPSBgXG4gICAgICAgICAgICAgICAgICAgeEMke2NvbEluZGV4ICsgMX0gPSB2ZWM0KHhUZXhlbEMke2NvbEluZGV4fS56dywgeFRleGVsQyR7XG4gICAgICAgICAgICAgICAgICAgY29sSW5kZXggKyAxfS56dyk7XG4gICAgICAgICAgICAgICAgIGA7XG4gICAgICAgICAgICAgfVxuICAgICAgICAgICB9XG4gICAgICAgICB9XG4gICAgICAgfVxuXG4gICAgICAgLy8gbG9jYWxpemUgdGhlIGRvdFByb2QgYWNjdW11bGF0aW9uIHdpdGhpbiB0aGUgbG9vcCwgdGhlIHRoZW9yeSBpcyBmb3JcbiAgICAgICAvLyBHUFUgd2l0aCBsaW1pdGVkIGNhY2hlLCBhY2N1bXVsYXRlIHN1bSBhY3Jvc3MgbGFyZ2UgYW1vdW50IG9mXG4gICAgICAgLy8gdmVyaWFibGVzIHdpbGwgY2F1c2UgbG90cyBvZiBjYWNoZSBtaXNzZXMuIChpLmUuIDV4NSBmaWx0ZXIgd2lsbCBoYXZlXG4gICAgICAgLy8gNTAgdmFyaWFibGVzKVxuICAgICAgIGlmIChjb2xJbmRleCA8IGZpbHRlcldpZHRoKSB7XG4gICAgICAgICBtYWluTG9vcCArPSBgXG4gICAgICAgICAgICAgd1RleGVsID0gZ2V0VyhyLCAke2NvbEluZGV4fSwgZDEsIGQyKTtcbiAgICAgICAgICAgICBkb3RQcm9kICs9IHhDJHtjb2xJbmRleH0ueHh6eiAqIHZlYzQod1RleGVsLnh5LCB3VGV4ZWwueHkpO1xuICAgICAgICAgICAgIGlmKGQxICsgMSA8ICR7Y29udkluZm8uaW5DaGFubmVsc30pIHtcbiAgICAgICAgICAgICAgIGRvdFByb2QgKz0geEMke2NvbEluZGV4fS55eXd3ICogdmVjNCh3VGV4ZWwuencsIHdUZXhlbC56dyk7XG4gICAgICAgICAgICAgfVxuICAgICAgICAgICBgO1xuXG4gICAgICAgICBpZiAoY29sSW5kZXggKyAxIDwgZmlsdGVyV2lkdGgpIHtcbiAgICAgICAgICAgbWFpbkxvb3AgKz0gYFxuICAgICAgICAgICAgICAgd1RleGVsID0gZ2V0VyhyLCAke2NvbEluZGV4ICsgMX0sIGQxLCBkMik7XG4gICAgICAgICAgICAgICBkb3RQcm9kICs9IHhDJHtjb2xJbmRleCArIDF9Lnh4enogKiB2ZWM0KHdUZXhlbC54eSwgd1RleGVsLnh5KTtcbiAgICAgICAgICAgICAgIGlmKGQxICsgMSA8ICR7Y29udkluZm8uaW5DaGFubmVsc30pIHtcbiAgICAgICAgICAgICAgICAgZG90UHJvZCArPSB4QyR7Y29sSW5kZXggKyAxfS55eXd3ICogdmVjNCh3VGV4ZWwuencsIHdUZXhlbC56dyk7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgYDtcbiAgICAgICAgIH1cbiAgICAgICB9XG4gICAgIH1cbiAgICAgbWFpbkxvb3AgKz0gYFxuICAgICB9XG4gICBgO1xuICAgbWFpbkxvb3AgKz0gYFxuICAgICB9XG4gICBgO1xuICAgbWFpbkxvb3AgKz0gYFxuICAgICB9XG4gICBgO1xuXG4gICAgIGxldCBhY3RpdmF0aW9uU25pcHBldCA9ICcnLCBhcHBseUFjdGl2YXRpb25TbmlwcGV0ID0gJyc7XG4gICAgIGlmIChhY3RpdmF0aW9uKSB7XG4gICAgICAgaWYgKGhhc1ByZWx1QWN0aXZhdGlvbikge1xuICAgICAgICAgYWN0aXZhdGlvblNuaXBwZXQgPSBgdmVjNCBhY3RpdmF0aW9uKHZlYzQgYSkge1xuICAgICAgICAgICB2ZWM0IGIgPSBnZXRQcmVsdUFjdGl2YXRpb25XZWlnaHRzQXRPdXRDb29yZHMoKTtcbiAgICAgICAgICAgJHthY3RpdmF0aW9ufVxuICAgICAgICAgfWA7XG4gICAgICAgfSBlbHNlIGlmIChoYXNMZWFreVJlbHVBbHBoYSkge1xuICAgICAgICAgYWN0aXZhdGlvblNuaXBwZXQgPSBgdmVjNCBhY3RpdmF0aW9uKHZlYzQgYSkge1xuICAgICAgICAgICB2ZWM0IGIgPSBnZXRMZWFreXJlbHVBbHBoYUF0T3V0Q29vcmRzKCk7XG4gICAgICAgICAgICR7YWN0aXZhdGlvbn1cbiAgICAgICAgIH1gO1xuICAgICAgIH0gZWxzZSB7XG4gICAgICAgICBhY3RpdmF0aW9uU25pcHBldCA9IGB2ZWM0IGFjdGl2YXRpb24odmVjNCB4KSB7XG4gICAgICAgICAgICR7YWN0aXZhdGlvbn1cbiAgICAgICAgIH1gO1xuICAgICAgIH1cblxuICAgICAgIGFwcGx5QWN0aXZhdGlvblNuaXBwZXQgPSBgcmVzdWx0ID0gYWN0aXZhdGlvbihyZXN1bHQpO2A7XG4gICAgIH1cblxuICAgICBjb25zdCBhZGRCaWFzU25pcHBldCA9IGFkZEJpYXMgPyAncmVzdWx0ICs9IGdldEJpYXNBdE91dENvb3JkcygpOycgOiAnJztcbiAgICAgaWYgKGFkZEJpYXMpIHtcbiAgICAgICB0aGlzLnZhcmlhYmxlTmFtZXMucHVzaCgnYmlhcycpO1xuICAgICB9XG5cbiAgICAgaWYgKGhhc1ByZWx1QWN0aXZhdGlvbikge1xuICAgICAgIHRoaXMudmFyaWFibGVOYW1lcy5wdXNoKCdwcmVsdUFjdGl2YXRpb25XZWlnaHRzJyk7XG4gICAgIH1cbiAgICAgaWYgKGhhc0xlYWt5UmVsdUFscGhhKSB7XG4gICAgICAgdGhpcy52YXJpYWJsZU5hbWVzLnB1c2goJ2xlYWt5cmVsdUFscGhhJyk7XG4gICAgIH1cblxuICAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgICR7YWN0aXZhdGlvblNuaXBwZXR9XG5cbiAgICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgICBpdmVjNCBjb29yZHMgPSBnZXRPdXRwdXRDb29yZHMoKTtcbiAgICAgICAgIGludCBiYXRjaCA9IGNvb3Jkcy54O1xuICAgICAgICAgaXZlYzIgeFJDQ29ybmVyID0gY29vcmRzLnl6ICogc3RyaWRlcyAtIHBhZHM7XG4gICAgICAgICBpbnQgZDIgPSBjb29yZHMudztcbiAgICAgICAgIGludCB4UkNvcm5lciA9IHhSQ0Nvcm5lci54O1xuICAgICAgICAgaW50IHhDQ29ybmVyID0geFJDQ29ybmVyLnk7XG5cbiAgICAgICAgIC8vaW50aWFsaXplIGRvdFByb2Qgd2l0aCBhIHNtYWxsIGVwc2lsb24gc2VlbXMgdG8gcmVkdWNlIEdQVSBhY2N1cmFjeSBsb3NzLlxuICAgICAgICAgdmVjNCBkb3RQcm9kID0gdmVjNCgwLjAwMDAwMDAwMDAwMDAwMSk7XG5cbiAgICAgICAgICR7bWFpbkxvb3B9XG5cbiAgICAgICAgIHZlYzQgcmVzdWx0ID0gZG90UHJvZCAtIHZlYzQoMC4wMDAwMDAwMDAwMDAwMDEpO1xuICAgICAgICAgJHthZGRCaWFzU25pcHBldH1cbiAgICAgICAgICR7YXBwbHlBY3RpdmF0aW9uU25pcHBldH1cbiAgICAgICAgIHNldE91dHB1dChyZXN1bHQpO1xuICAgICAgIH1cbiAgICAgYDtcbiAgIH1cbiB9XG4iXX0=