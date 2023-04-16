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
export class FFTProgram {
    constructor(component, inputShape, inverse) {
        this.variableNames = ['real', 'imag'];
        const innerDim = inputShape[1];
        this.outputShape = inputShape;
        const exponentMultiplierSnippet = inverse ? `2.0 * ${Math.PI}` : `-2.0 * ${Math.PI}`;
        const resultDenominator = inverse ? `${innerDim}.0` : '1.0';
        let opString;
        if (component === 'real') {
            opString = 'return real * expR - imag * expI;';
        }
        else if (component === 'imag') {
            opString = 'return real * expI + imag * expR;';
        }
        else {
            throw new Error(`FFT component must be either "real" or "imag", got ${component}.`);
        }
        this.userCode = `
      const float exponentMultiplier = ${exponentMultiplierSnippet};

      float unaryOpComplex(float real, float expR, float imag, float expI) {
        ${opString}
      }

      float mulMatDFT(int batch, int index) {
        float indexRatio = float(index) / float(${innerDim});
        float exponentMultiplierTimesIndexRatio =
            exponentMultiplier * indexRatio;

        float result = 0.0;

        for (int i = 0; i < ${innerDim}; i++) {
          // x = (-2|2 * PI / N) * index * i;
          float x = exponentMultiplierTimesIndexRatio * float(i);
          float expR = cos(x);
          float expI = sin(x);
          float real = getReal(batch, i);
          float imag = getImag(batch, i);

          result +=
              unaryOpComplex(real, expR, imag, expI) / ${resultDenominator};
        }

        return result;
      }

      void main() {
        ivec2 coords = getOutputCoords();
        setOutput(mulMatDFT(coords[0], coords[1]));
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmZ0X2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvZmZ0X2dwdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFJSCxNQUFNLE9BQU8sVUFBVTtJQUtyQixZQUNJLFNBQXdCLEVBQUUsVUFBNEIsRUFDdEQsT0FBZ0I7UUFOcEIsa0JBQWEsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQU8vQixNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7UUFFOUIsTUFBTSx5QkFBeUIsR0FDM0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDdkQsTUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUU1RCxJQUFJLFFBQWdCLENBQUM7UUFDckIsSUFBSSxTQUFTLEtBQUssTUFBTSxFQUFFO1lBQ3hCLFFBQVEsR0FBRyxtQ0FBbUMsQ0FBQztTQUNoRDthQUFNLElBQUksU0FBUyxLQUFLLE1BQU0sRUFBRTtZQUMvQixRQUFRLEdBQUcsbUNBQW1DLENBQUM7U0FDaEQ7YUFBTTtZQUNMLE1BQU0sSUFBSSxLQUFLLENBQ1gsc0RBQXNELFNBQVMsR0FBRyxDQUFDLENBQUM7U0FDekU7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHO3lDQUNxQix5QkFBeUI7OztVQUd4RCxRQUFROzs7O2tEQUlnQyxRQUFROzs7Ozs7OEJBTTVCLFFBQVE7Ozs7Ozs7Ozt5REFTbUIsaUJBQWlCOzs7Ozs7Ozs7O0tBVXJFLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuXG5leHBvcnQgY2xhc3MgRkZUUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ3JlYWwnLCAnaW1hZyddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBjb21wb25lbnQ6ICdyZWFsJ3wnaW1hZycsIGlucHV0U2hhcGU6IFtudW1iZXIsIG51bWJlcl0sXG4gICAgICBpbnZlcnNlOiBib29sZWFuKSB7XG4gICAgY29uc3QgaW5uZXJEaW0gPSBpbnB1dFNoYXBlWzFdO1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBpbnB1dFNoYXBlO1xuXG4gICAgY29uc3QgZXhwb25lbnRNdWx0aXBsaWVyU25pcHBldCA9XG4gICAgICAgIGludmVyc2UgPyBgMi4wICogJHtNYXRoLlBJfWAgOiBgLTIuMCAqICR7TWF0aC5QSX1gO1xuICAgIGNvbnN0IHJlc3VsdERlbm9taW5hdG9yID0gaW52ZXJzZSA/IGAke2lubmVyRGltfS4wYCA6ICcxLjAnO1xuXG4gICAgbGV0IG9wU3RyaW5nOiBzdHJpbmc7XG4gICAgaWYgKGNvbXBvbmVudCA9PT0gJ3JlYWwnKSB7XG4gICAgICBvcFN0cmluZyA9ICdyZXR1cm4gcmVhbCAqIGV4cFIgLSBpbWFnICogZXhwSTsnO1xuICAgIH0gZWxzZSBpZiAoY29tcG9uZW50ID09PSAnaW1hZycpIHtcbiAgICAgIG9wU3RyaW5nID0gJ3JldHVybiByZWFsICogZXhwSSArIGltYWcgKiBleHBSOyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgRkZUIGNvbXBvbmVudCBtdXN0IGJlIGVpdGhlciBcInJlYWxcIiBvciBcImltYWdcIiwgZ290ICR7Y29tcG9uZW50fS5gKTtcbiAgICB9XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgY29uc3QgZmxvYXQgZXhwb25lbnRNdWx0aXBsaWVyID0gJHtleHBvbmVudE11bHRpcGxpZXJTbmlwcGV0fTtcblxuICAgICAgZmxvYXQgdW5hcnlPcENvbXBsZXgoZmxvYXQgcmVhbCwgZmxvYXQgZXhwUiwgZmxvYXQgaW1hZywgZmxvYXQgZXhwSSkge1xuICAgICAgICAke29wU3RyaW5nfVxuICAgICAgfVxuXG4gICAgICBmbG9hdCBtdWxNYXRERlQoaW50IGJhdGNoLCBpbnQgaW5kZXgpIHtcbiAgICAgICAgZmxvYXQgaW5kZXhSYXRpbyA9IGZsb2F0KGluZGV4KSAvIGZsb2F0KCR7aW5uZXJEaW19KTtcbiAgICAgICAgZmxvYXQgZXhwb25lbnRNdWx0aXBsaWVyVGltZXNJbmRleFJhdGlvID1cbiAgICAgICAgICAgIGV4cG9uZW50TXVsdGlwbGllciAqIGluZGV4UmF0aW87XG5cbiAgICAgICAgZmxvYXQgcmVzdWx0ID0gMC4wO1xuXG4gICAgICAgIGZvciAoaW50IGkgPSAwOyBpIDwgJHtpbm5lckRpbX07IGkrKykge1xuICAgICAgICAgIC8vIHggPSAoLTJ8MiAqIFBJIC8gTikgKiBpbmRleCAqIGk7XG4gICAgICAgICAgZmxvYXQgeCA9IGV4cG9uZW50TXVsdGlwbGllclRpbWVzSW5kZXhSYXRpbyAqIGZsb2F0KGkpO1xuICAgICAgICAgIGZsb2F0IGV4cFIgPSBjb3MoeCk7XG4gICAgICAgICAgZmxvYXQgZXhwSSA9IHNpbih4KTtcbiAgICAgICAgICBmbG9hdCByZWFsID0gZ2V0UmVhbChiYXRjaCwgaSk7XG4gICAgICAgICAgZmxvYXQgaW1hZyA9IGdldEltYWcoYmF0Y2gsIGkpO1xuXG4gICAgICAgICAgcmVzdWx0ICs9XG4gICAgICAgICAgICAgIHVuYXJ5T3BDb21wbGV4KHJlYWwsIGV4cFIsIGltYWcsIGV4cEkpIC8gJHtyZXN1bHREZW5vbWluYXRvcn07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIGl2ZWMyIGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICBzZXRPdXRwdXQobXVsTWF0REZUKGNvb3Jkc1swXSwgY29vcmRzWzFdKSk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuIl19