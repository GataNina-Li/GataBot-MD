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
import { useShapeUniforms } from './gpgpu_math';
export class DepthwiseConv2DProgram {
    constructor(convInfo, addBias = false, activation = null, hasPreluActivation = false, hasLeakyReluAlpha = false) {
        this.variableNames = ['x', 'W'];
        this.customUniforms = [
            { name: 'pads', type: 'ivec2' },
            { name: 'strides', type: 'ivec2' },
            { name: 'dilations', type: 'ivec2' },
            { name: 'inDims', type: 'ivec2' },
        ];
        this.outputShape = convInfo.outShape;
        this.enableShapeUniforms = useShapeUniforms(this.outputShape.length);
        const filterHeight = convInfo.filterHeight;
        const filterWidth = convInfo.filterWidth;
        const channelMul = convInfo.outChannels / convInfo.inChannels;
        let activationSnippet = '', applyActivationSnippet = '';
        if (activation) {
            if (hasPreluActivation) {
                activationSnippet = `float activation(float a) {
          float b = getPreluActivationWeightsAtOutCoords();
          ${activation}
        }`;
            }
            else if (hasLeakyReluAlpha) {
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

        // Convolve x(?, ?, d1) with w(:, :, d1, q) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        // TO DO(dsmilkov): Flatten the two for loops and vec4 the operations.
        for (int wR = 0; wR < ${filterHeight}; wR++) {
          int xR = xRCorner + wR * dilations[0];

          if (xR < 0 || xR >= inDims[0]) {
            continue;
          }

          for (int wC = 0; wC < ${filterWidth}; wC++) {
            int xC = xCCorner + wC * dilations[1];

            if (xC < 0 || xC >= inDims[1]) {
              continue;
            }

            float xVal = getX(batch, xR, xC, d1);
            float wVal = getW(wR, wC, d1, q);
            dotProd += xVal * wVal;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udl9ncHVfZGVwdGh3aXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9jb252X2dwdV9kZXB0aHdpc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBR0gsT0FBTyxFQUFlLGdCQUFnQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRTVELE1BQU0sT0FBTyxzQkFBc0I7SUFZakMsWUFDSSxRQUFpQyxFQUFFLE9BQU8sR0FBRyxLQUFLLEVBQ2xELGFBQXFCLElBQUksRUFBRSxrQkFBa0IsR0FBRyxLQUFLLEVBQ3JELGlCQUFpQixHQUFHLEtBQUs7UUFkN0Isa0JBQWEsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUkzQixtQkFBYyxHQUFHO1lBQ2YsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFnQixFQUFFO1lBQ3ZDLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsT0FBZ0IsRUFBRTtZQUMxQyxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLE9BQWdCLEVBQUU7WUFDNUMsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFnQixFQUFFO1NBQzFDLENBQUM7UUFNQSxJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7UUFDckMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFckUsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQztRQUMzQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO1FBQ3pDLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQztRQUU5RCxJQUFJLGlCQUFpQixHQUFHLEVBQUUsRUFBRSxzQkFBc0IsR0FBRyxFQUFFLENBQUM7UUFDeEQsSUFBSSxVQUFVLEVBQUU7WUFDZCxJQUFJLGtCQUFrQixFQUFFO2dCQUN0QixpQkFBaUIsR0FBRzs7WUFFaEIsVUFBVTtVQUNaLENBQUM7YUFDSjtpQkFBTSxJQUFJLGlCQUFpQixFQUFFO2dCQUM1QixpQkFBaUIsR0FBRzs7WUFFaEIsVUFBVTtVQUNaLENBQUM7YUFDSjtpQkFBTTtnQkFDTCxpQkFBaUIsR0FBRzs7Y0FFZCxVQUFVOztTQUVmLENBQUM7YUFDSDtZQUVELHNCQUFzQixHQUFHLDhCQUE4QixDQUFDO1NBQ3pEO1FBRUQsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3hFLElBQUksT0FBTyxFQUFFO1lBQ1gsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDakM7UUFFRCxJQUFJLGtCQUFrQixFQUFFO1lBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUM7U0FDbkQ7UUFDRCxJQUFJLGlCQUFpQixFQUFFO1lBQ3JCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDM0M7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHO1FBQ1osaUJBQWlCOzs7Ozs7O3dCQU9ELFVBQVU7NEJBQ04sVUFBVTs7Ozs7Ozs7O2dDQVNOLFlBQVk7Ozs7Ozs7a0NBT1YsV0FBVzs7Ozs7Ozs7Ozs7Ozs7VUFjbkMsY0FBYztVQUNkLHNCQUFzQjs7O0tBRzNCLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7YmFja2VuZF91dGlsfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0IHtHUEdQVVByb2dyYW0sIHVzZVNoYXBlVW5pZm9ybXN9IGZyb20gJy4vZ3BncHVfbWF0aCc7XG5cbmV4cG9ydCBjbGFzcyBEZXB0aHdpc2VDb252MkRQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsneCcsICdXJ107XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXTtcbiAgdXNlckNvZGU6IHN0cmluZztcbiAgZW5hYmxlU2hhcGVVbmlmb3JtczogYm9vbGVhbjtcbiAgY3VzdG9tVW5pZm9ybXMgPSBbXG4gICAge25hbWU6ICdwYWRzJywgdHlwZTogJ2l2ZWMyJyBhcyBjb25zdCB9LFxuICAgIHtuYW1lOiAnc3RyaWRlcycsIHR5cGU6ICdpdmVjMicgYXMgY29uc3QgfSxcbiAgICB7bmFtZTogJ2RpbGF0aW9ucycsIHR5cGU6ICdpdmVjMicgYXMgY29uc3QgfSxcbiAgICB7bmFtZTogJ2luRGltcycsIHR5cGU6ICdpdmVjMicgYXMgY29uc3QgfSxcbiAgXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIGNvbnZJbmZvOiBiYWNrZW5kX3V0aWwuQ29udjJESW5mbywgYWRkQmlhcyA9IGZhbHNlLFxuICAgICAgYWN0aXZhdGlvbjogc3RyaW5nID0gbnVsbCwgaGFzUHJlbHVBY3RpdmF0aW9uID0gZmFsc2UsXG4gICAgICBoYXNMZWFreVJlbHVBbHBoYSA9IGZhbHNlKSB7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IGNvbnZJbmZvLm91dFNoYXBlO1xuICAgIHRoaXMuZW5hYmxlU2hhcGVVbmlmb3JtcyA9IHVzZVNoYXBlVW5pZm9ybXModGhpcy5vdXRwdXRTaGFwZS5sZW5ndGgpO1xuXG4gICAgY29uc3QgZmlsdGVySGVpZ2h0ID0gY29udkluZm8uZmlsdGVySGVpZ2h0O1xuICAgIGNvbnN0IGZpbHRlcldpZHRoID0gY29udkluZm8uZmlsdGVyV2lkdGg7XG4gICAgY29uc3QgY2hhbm5lbE11bCA9IGNvbnZJbmZvLm91dENoYW5uZWxzIC8gY29udkluZm8uaW5DaGFubmVscztcblxuICAgIGxldCBhY3RpdmF0aW9uU25pcHBldCA9ICcnLCBhcHBseUFjdGl2YXRpb25TbmlwcGV0ID0gJyc7XG4gICAgaWYgKGFjdGl2YXRpb24pIHtcbiAgICAgIGlmIChoYXNQcmVsdUFjdGl2YXRpb24pIHtcbiAgICAgICAgYWN0aXZhdGlvblNuaXBwZXQgPSBgZmxvYXQgYWN0aXZhdGlvbihmbG9hdCBhKSB7XG4gICAgICAgICAgZmxvYXQgYiA9IGdldFByZWx1QWN0aXZhdGlvbldlaWdodHNBdE91dENvb3JkcygpO1xuICAgICAgICAgICR7YWN0aXZhdGlvbn1cbiAgICAgICAgfWA7XG4gICAgICB9IGVsc2UgaWYgKGhhc0xlYWt5UmVsdUFscGhhKSB7XG4gICAgICAgIGFjdGl2YXRpb25TbmlwcGV0ID0gYGZsb2F0IGFjdGl2YXRpb24oZmxvYXQgYSkge1xuICAgICAgICAgIGZsb2F0IGIgPSBnZXRMZWFreXJlbHVBbHBoYUF0T3V0Q29vcmRzKCk7XG4gICAgICAgICAgJHthY3RpdmF0aW9ufVxuICAgICAgICB9YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFjdGl2YXRpb25TbmlwcGV0ID0gYFxuICAgICAgICAgIGZsb2F0IGFjdGl2YXRpb24oZmxvYXQgeCkge1xuICAgICAgICAgICAgJHthY3RpdmF0aW9ufVxuICAgICAgICAgIH1cbiAgICAgICAgYDtcbiAgICAgIH1cblxuICAgICAgYXBwbHlBY3RpdmF0aW9uU25pcHBldCA9IGByZXN1bHQgPSBhY3RpdmF0aW9uKHJlc3VsdCk7YDtcbiAgICB9XG5cbiAgICBjb25zdCBhZGRCaWFzU25pcHBldCA9IGFkZEJpYXMgPyAncmVzdWx0ICs9IGdldEJpYXNBdE91dENvb3JkcygpOycgOiAnJztcbiAgICBpZiAoYWRkQmlhcykge1xuICAgICAgdGhpcy52YXJpYWJsZU5hbWVzLnB1c2goJ2JpYXMnKTtcbiAgICB9XG5cbiAgICBpZiAoaGFzUHJlbHVBY3RpdmF0aW9uKSB7XG4gICAgICB0aGlzLnZhcmlhYmxlTmFtZXMucHVzaCgncHJlbHVBY3RpdmF0aW9uV2VpZ2h0cycpO1xuICAgIH1cbiAgICBpZiAoaGFzTGVha3lSZWx1QWxwaGEpIHtcbiAgICAgIHRoaXMudmFyaWFibGVOYW1lcy5wdXNoKCdsZWFreXJlbHVBbHBoYScpO1xuICAgIH1cblxuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICAke2FjdGl2YXRpb25TbmlwcGV0fVxuXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIGl2ZWM0IGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICBpbnQgYmF0Y2ggPSBjb29yZHMueDtcbiAgICAgICAgaXZlYzIgeFJDQ29ybmVyID0gY29vcmRzLnl6ICogc3RyaWRlcyAtIHBhZHM7XG4gICAgICAgIGludCBkMiA9IGNvb3Jkcy53O1xuICAgICAgICBpbnQgZDEgPSBkMiAvICR7Y2hhbm5lbE11bH07XG4gICAgICAgIGludCBxID0gZDIgLSBkMSAqICR7Y2hhbm5lbE11bH07XG5cbiAgICAgICAgaW50IHhSQ29ybmVyID0geFJDQ29ybmVyLng7XG4gICAgICAgIGludCB4Q0Nvcm5lciA9IHhSQ0Nvcm5lci55O1xuXG4gICAgICAgIC8vIENvbnZvbHZlIHgoPywgPywgZDEpIHdpdGggdyg6LCA6LCBkMSwgcSkgdG8gZ2V0IHkoeVIsIHlDLCBkMikuXG4gICAgICAgIC8vID8gPSB0byBiZSBkZXRlcm1pbmVkLiA6ID0gYWNyb3NzIGFsbCB2YWx1ZXMgaW4gdGhhdCBheGlzLlxuICAgICAgICBmbG9hdCBkb3RQcm9kID0gMC4wO1xuICAgICAgICAvLyBUTyBETyhkc21pbGtvdik6IEZsYXR0ZW4gdGhlIHR3byBmb3IgbG9vcHMgYW5kIHZlYzQgdGhlIG9wZXJhdGlvbnMuXG4gICAgICAgIGZvciAoaW50IHdSID0gMDsgd1IgPCAke2ZpbHRlckhlaWdodH07IHdSKyspIHtcbiAgICAgICAgICBpbnQgeFIgPSB4UkNvcm5lciArIHdSICogZGlsYXRpb25zWzBdO1xuXG4gICAgICAgICAgaWYgKHhSIDwgMCB8fCB4UiA+PSBpbkRpbXNbMF0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAoaW50IHdDID0gMDsgd0MgPCAke2ZpbHRlcldpZHRofTsgd0MrKykge1xuICAgICAgICAgICAgaW50IHhDID0geENDb3JuZXIgKyB3QyAqIGRpbGF0aW9uc1sxXTtcblxuICAgICAgICAgICAgaWYgKHhDIDwgMCB8fCB4QyA+PSBpbkRpbXNbMV0pIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZsb2F0IHhWYWwgPSBnZXRYKGJhdGNoLCB4UiwgeEMsIGQxKTtcbiAgICAgICAgICAgIGZsb2F0IHdWYWwgPSBnZXRXKHdSLCB3QywgZDEsIHEpO1xuICAgICAgICAgICAgZG90UHJvZCArPSB4VmFsICogd1ZhbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmbG9hdCByZXN1bHQgPSBkb3RQcm9kO1xuICAgICAgICAke2FkZEJpYXNTbmlwcGV0fVxuICAgICAgICAke2FwcGx5QWN0aXZhdGlvblNuaXBwZXR9XG4gICAgICAgIHNldE91dHB1dChyZXN1bHQpO1xuICAgICAgfVxuICAgIGA7XG4gIH1cbn1cbiJdfQ==