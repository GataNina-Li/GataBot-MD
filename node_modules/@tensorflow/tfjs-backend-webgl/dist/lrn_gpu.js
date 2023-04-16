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
export class LRNProgram {
    constructor(xShape, radius, bias, alpha, beta) {
        this.variableNames = ['x'];
        this.outputShape = [];
        const rad = radius;
        const maxD = xShape[3] - 1;
        this.outputShape = xShape;
        // optimize pow(bias + alpha * sum, -beta)
        // src: https://github.com/tensorflow/tensorflow/..
        // blob/26033a1644a9c4a5fbe3170ab2e864b6a4ccd4ca/..
        // tensorflow/core/kernels/mkl_lrn_op.cc#L320
        let powOperator;
        const basis = `float(${bias}) + float(${alpha}) * sum`;
        if (beta === 0.5) {
            powOperator = `inversesqrt(${basis})`;
        }
        else if (beta === 1.0) {
            powOperator = `1.0/(${basis})`;
        }
        else {
            powOperator = `exp(log(${basis}) * float(-${beta}));`;
        }
        this.userCode = `
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int r = coords[1];
        int c = coords[2];
        int d = coords[3];
        float x = getX(b, r, c, d);
        float sum = 0.0;
        for (int j = -${rad}; j <= ${rad}; j++) {
          int idx = d + j;
          if (idx >= 0 && idx <=  ${maxD}) {
            float z = getX(b, r, c, idx);
            sum += z * z;
          }
        }
        float val = x * ${powOperator};
        setOutput(val);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibHJuX2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvbHJuX2dwdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFJSCxNQUFNLE9BQU8sVUFBVTtJQUtyQixZQUNJLE1BQWdCLEVBQUUsTUFBYyxFQUFFLElBQVksRUFBRSxLQUFhLEVBQzdELElBQVk7UUFOaEIsa0JBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLGdCQUFXLEdBQWEsRUFBRSxDQUFDO1FBTXpCLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQztRQUNuQixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1FBRTFCLDBDQUEwQztRQUMxQyxtREFBbUQ7UUFDbkQsbURBQW1EO1FBQ25ELDZDQUE2QztRQUM3QyxJQUFJLFdBQVcsQ0FBQztRQUNoQixNQUFNLEtBQUssR0FBRyxTQUFTLElBQUksYUFBYSxLQUFLLFNBQVMsQ0FBQztRQUN2RCxJQUFJLElBQUksS0FBSyxHQUFHLEVBQUU7WUFDaEIsV0FBVyxHQUFHLGVBQWUsS0FBSyxHQUFHLENBQUM7U0FDdkM7YUFBTSxJQUFJLElBQUksS0FBSyxHQUFHLEVBQUU7WUFDdkIsV0FBVyxHQUFHLFFBQVEsS0FBSyxHQUFHLENBQUM7U0FDaEM7YUFBTTtZQUNMLFdBQVcsR0FBRyxXQUFXLEtBQUssY0FBYyxJQUFJLEtBQUssQ0FBQztTQUN2RDtRQUVELElBQUksQ0FBQyxRQUFRLEdBQUc7Ozs7Ozs7Ozt3QkFTSSxHQUFHLFVBQVUsR0FBRzs7b0NBRUosSUFBSTs7Ozs7MEJBS2QsV0FBVzs7O0tBR2hDLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuXG5leHBvcnQgY2xhc3MgTFJOUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ3gnXTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdID0gW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICB4U2hhcGU6IG51bWJlcltdLCByYWRpdXM6IG51bWJlciwgYmlhczogbnVtYmVyLCBhbHBoYTogbnVtYmVyLFxuICAgICAgYmV0YTogbnVtYmVyKSB7XG4gICAgY29uc3QgcmFkID0gcmFkaXVzO1xuICAgIGNvbnN0IG1heEQgPSB4U2hhcGVbM10gLSAxO1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSB4U2hhcGU7XG5cbiAgICAvLyBvcHRpbWl6ZSBwb3coYmlhcyArIGFscGhhICogc3VtLCAtYmV0YSlcbiAgICAvLyBzcmM6IGh0dHBzOi8vZ2l0aHViLmNvbS90ZW5zb3JmbG93L3RlbnNvcmZsb3cvLi5cbiAgICAvLyBibG9iLzI2MDMzYTE2NDRhOWM0YTVmYmUzMTcwYWIyZTg2NGI2YTRjY2Q0Y2EvLi5cbiAgICAvLyB0ZW5zb3JmbG93L2NvcmUva2VybmVscy9ta2xfbHJuX29wLmNjI0wzMjBcbiAgICBsZXQgcG93T3BlcmF0b3I7XG4gICAgY29uc3QgYmFzaXMgPSBgZmxvYXQoJHtiaWFzfSkgKyBmbG9hdCgke2FscGhhfSkgKiBzdW1gO1xuICAgIGlmIChiZXRhID09PSAwLjUpIHtcbiAgICAgIHBvd09wZXJhdG9yID0gYGludmVyc2VzcXJ0KCR7YmFzaXN9KWA7XG4gICAgfSBlbHNlIGlmIChiZXRhID09PSAxLjApIHtcbiAgICAgIHBvd09wZXJhdG9yID0gYDEuMC8oJHtiYXNpc30pYDtcbiAgICB9IGVsc2Uge1xuICAgICAgcG93T3BlcmF0b3IgPSBgZXhwKGxvZygke2Jhc2lzfSkgKiBmbG9hdCgtJHtiZXRhfSkpO2A7XG4gICAgfVxuXG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgaXZlYzQgY29vcmRzID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gICAgICAgIGludCBiID0gY29vcmRzWzBdO1xuICAgICAgICBpbnQgciA9IGNvb3Jkc1sxXTtcbiAgICAgICAgaW50IGMgPSBjb29yZHNbMl07XG4gICAgICAgIGludCBkID0gY29vcmRzWzNdO1xuICAgICAgICBmbG9hdCB4ID0gZ2V0WChiLCByLCBjLCBkKTtcbiAgICAgICAgZmxvYXQgc3VtID0gMC4wO1xuICAgICAgICBmb3IgKGludCBqID0gLSR7cmFkfTsgaiA8PSAke3JhZH07IGorKykge1xuICAgICAgICAgIGludCBpZHggPSBkICsgajtcbiAgICAgICAgICBpZiAoaWR4ID49IDAgJiYgaWR4IDw9ICAke21heER9KSB7XG4gICAgICAgICAgICBmbG9hdCB6ID0gZ2V0WChiLCByLCBjLCBpZHgpO1xuICAgICAgICAgICAgc3VtICs9IHogKiB6O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmbG9hdCB2YWwgPSB4ICogJHtwb3dPcGVyYXRvcn07XG4gICAgICAgIHNldE91dHB1dCh2YWwpO1xuICAgICAgfVxuICAgIGA7XG4gIH1cbn1cbiJdfQ==