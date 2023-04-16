/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
export class LRNPackedProgram {
    constructor(xShape, radius, bias, alpha, beta) {
        this.variableNames = ['x'];
        this.outputShape = [];
        this.packedInputs = true;
        this.packedOutput = true;
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
        int b = coords.x;
        int r = coords.y;
        int c = coords.z;
        int d = coords.w;

        bool hasNextCol = d < ${this.outputShape[3]};
        bool hasNextRow = c < ${this.outputShape[2]};

        vec4 sum = vec4(0.);
        vec4 xFragAtOutputCoords = getX(b, r, c, d);

        vec4 xAtOutputCoords = vec4(
          getChannel(xFragAtOutputCoords, vec2(c, d)),
          hasNextCol ?
            getChannel(xFragAtOutputCoords, vec2(c, d + 1)) : 0.0,
          hasNextRow ?
            getChannel(xFragAtOutputCoords , vec2(c + 1, d)) : 0.0,
          (hasNextRow && hasNextCol) ?
            getChannel(xFragAtOutputCoords, vec2(c + 1, d + 1)) : 0.0
        );

        int firstChannel = d - ${rad};
        vec2 cache = vec2(0.);
        if(firstChannel >= 0){
          vec4 firstChannelFrag = getX(b, r, c, firstChannel);
          cache.x = getChannel(firstChannelFrag, vec2(c, firstChannel));
            if(hasNextRow){
              cache.y = getChannel(firstChannelFrag, vec2(c + 1, firstChannel));
            }
        }

        ivec2 depth = ivec2(d, d + 1);
        for (int j = - ${rad}; j <= ${rad}; j++) {
          ivec2 idx = depth + j;
          bvec2 aboveLowerBound = greaterThanEqual(idx, ivec2(0));
          bvec2 belowUpperBound = lessThanEqual(idx, ivec2(${maxD}));

          bool depthInRange = aboveLowerBound.x && belowUpperBound.x;
          bool depthPlusOneInRange = aboveLowerBound.y && belowUpperBound.y;

          if(depthInRange || depthPlusOneInRange){
            vec4 z = vec4(0.);
            vec4 xFragAtCurrentDepth;
            z.xz = cache.xy;
            if(depthPlusOneInRange && hasNextCol){
              xFragAtCurrentDepth = idx.y != d ?
                getX(b, r, c, idx.y) : xFragAtOutputCoords;
              z.y = getChannel(xFragAtCurrentDepth, vec2(c, idx.y));
              if(hasNextRow){
                z.w = getChannel(xFragAtCurrentDepth, vec2(c + 1, idx.y));
              }
            }
            cache.xy = z.yw;
            sum += z * z;
          }
        }
        vec4 result = xAtOutputCoords * ${powOperator};
        setOutput(result);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibHJuX3BhY2tlZF9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2xybl9wYWNrZWRfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUlILE1BQU0sT0FBTyxnQkFBZ0I7SUFPM0IsWUFDSSxNQUFnQixFQUFFLE1BQWMsRUFBRSxJQUFZLEVBQUUsS0FBYSxFQUM3RCxJQUFZO1FBUmhCLGtCQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QixnQkFBVyxHQUFhLEVBQUUsQ0FBQztRQUUzQixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUtsQixNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUM7UUFDbkIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztRQUUxQiwwQ0FBMEM7UUFDMUMsbURBQW1EO1FBQ25ELG1EQUFtRDtRQUNuRCw2Q0FBNkM7UUFDN0MsSUFBSSxXQUFXLENBQUM7UUFDaEIsTUFBTSxLQUFLLEdBQUcsU0FBUyxJQUFJLGFBQWEsS0FBSyxTQUFTLENBQUM7UUFDdkQsSUFBSSxJQUFJLEtBQUssR0FBRyxFQUFFO1lBQ2hCLFdBQVcsR0FBRyxlQUFlLEtBQUssR0FBRyxDQUFDO1NBQ3ZDO2FBQU0sSUFBSSxJQUFJLEtBQUssR0FBRyxFQUFFO1lBQ3ZCLFdBQVcsR0FBRyxRQUFRLEtBQUssR0FBRyxDQUFDO1NBQ2hDO2FBQU07WUFDTCxXQUFXLEdBQUcsV0FBVyxLQUFLLGNBQWMsSUFBSSxLQUFLLENBQUM7U0FDdkQ7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHOzs7Ozs7OztnQ0FRWSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQ0FDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7OztpQ0FlbEIsR0FBRzs7Ozs7Ozs7Ozs7eUJBV1gsR0FBRyxVQUFVLEdBQUc7Ozs2REFHb0IsSUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzBDQXFCdkIsV0FBVzs7O0tBR2hELENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuXG5leHBvcnQgY2xhc3MgTFJOUGFja2VkUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ3gnXTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdID0gW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG4gIHBhY2tlZElucHV0cyA9IHRydWU7XG4gIHBhY2tlZE91dHB1dCA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICB4U2hhcGU6IG51bWJlcltdLCByYWRpdXM6IG51bWJlciwgYmlhczogbnVtYmVyLCBhbHBoYTogbnVtYmVyLFxuICAgICAgYmV0YTogbnVtYmVyKSB7XG4gICAgY29uc3QgcmFkID0gcmFkaXVzO1xuICAgIGNvbnN0IG1heEQgPSB4U2hhcGVbM10gLSAxO1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSB4U2hhcGU7XG5cbiAgICAvLyBvcHRpbWl6ZSBwb3coYmlhcyArIGFscGhhICogc3VtLCAtYmV0YSlcbiAgICAvLyBzcmM6IGh0dHBzOi8vZ2l0aHViLmNvbS90ZW5zb3JmbG93L3RlbnNvcmZsb3cvLi5cbiAgICAvLyBibG9iLzI2MDMzYTE2NDRhOWM0YTVmYmUzMTcwYWIyZTg2NGI2YTRjY2Q0Y2EvLi5cbiAgICAvLyB0ZW5zb3JmbG93L2NvcmUva2VybmVscy9ta2xfbHJuX29wLmNjI0wzMjBcbiAgICBsZXQgcG93T3BlcmF0b3I7XG4gICAgY29uc3QgYmFzaXMgPSBgZmxvYXQoJHtiaWFzfSkgKyBmbG9hdCgke2FscGhhfSkgKiBzdW1gO1xuICAgIGlmIChiZXRhID09PSAwLjUpIHtcbiAgICAgIHBvd09wZXJhdG9yID0gYGludmVyc2VzcXJ0KCR7YmFzaXN9KWA7XG4gICAgfSBlbHNlIGlmIChiZXRhID09PSAxLjApIHtcbiAgICAgIHBvd09wZXJhdG9yID0gYDEuMC8oJHtiYXNpc30pYDtcbiAgICB9IGVsc2Uge1xuICAgICAgcG93T3BlcmF0b3IgPSBgZXhwKGxvZygke2Jhc2lzfSkgKiBmbG9hdCgtJHtiZXRhfSkpO2A7XG4gICAgfVxuXG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgaXZlYzQgY29vcmRzID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gICAgICAgIGludCBiID0gY29vcmRzLng7XG4gICAgICAgIGludCByID0gY29vcmRzLnk7XG4gICAgICAgIGludCBjID0gY29vcmRzLno7XG4gICAgICAgIGludCBkID0gY29vcmRzLnc7XG5cbiAgICAgICAgYm9vbCBoYXNOZXh0Q29sID0gZCA8ICR7dGhpcy5vdXRwdXRTaGFwZVszXX07XG4gICAgICAgIGJvb2wgaGFzTmV4dFJvdyA9IGMgPCAke3RoaXMub3V0cHV0U2hhcGVbMl19O1xuXG4gICAgICAgIHZlYzQgc3VtID0gdmVjNCgwLik7XG4gICAgICAgIHZlYzQgeEZyYWdBdE91dHB1dENvb3JkcyA9IGdldFgoYiwgciwgYywgZCk7XG5cbiAgICAgICAgdmVjNCB4QXRPdXRwdXRDb29yZHMgPSB2ZWM0KFxuICAgICAgICAgIGdldENoYW5uZWwoeEZyYWdBdE91dHB1dENvb3JkcywgdmVjMihjLCBkKSksXG4gICAgICAgICAgaGFzTmV4dENvbCA/XG4gICAgICAgICAgICBnZXRDaGFubmVsKHhGcmFnQXRPdXRwdXRDb29yZHMsIHZlYzIoYywgZCArIDEpKSA6IDAuMCxcbiAgICAgICAgICBoYXNOZXh0Um93ID9cbiAgICAgICAgICAgIGdldENoYW5uZWwoeEZyYWdBdE91dHB1dENvb3JkcyAsIHZlYzIoYyArIDEsIGQpKSA6IDAuMCxcbiAgICAgICAgICAoaGFzTmV4dFJvdyAmJiBoYXNOZXh0Q29sKSA/XG4gICAgICAgICAgICBnZXRDaGFubmVsKHhGcmFnQXRPdXRwdXRDb29yZHMsIHZlYzIoYyArIDEsIGQgKyAxKSkgOiAwLjBcbiAgICAgICAgKTtcblxuICAgICAgICBpbnQgZmlyc3RDaGFubmVsID0gZCAtICR7cmFkfTtcbiAgICAgICAgdmVjMiBjYWNoZSA9IHZlYzIoMC4pO1xuICAgICAgICBpZihmaXJzdENoYW5uZWwgPj0gMCl7XG4gICAgICAgICAgdmVjNCBmaXJzdENoYW5uZWxGcmFnID0gZ2V0WChiLCByLCBjLCBmaXJzdENoYW5uZWwpO1xuICAgICAgICAgIGNhY2hlLnggPSBnZXRDaGFubmVsKGZpcnN0Q2hhbm5lbEZyYWcsIHZlYzIoYywgZmlyc3RDaGFubmVsKSk7XG4gICAgICAgICAgICBpZihoYXNOZXh0Um93KXtcbiAgICAgICAgICAgICAgY2FjaGUueSA9IGdldENoYW5uZWwoZmlyc3RDaGFubmVsRnJhZywgdmVjMihjICsgMSwgZmlyc3RDaGFubmVsKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpdmVjMiBkZXB0aCA9IGl2ZWMyKGQsIGQgKyAxKTtcbiAgICAgICAgZm9yIChpbnQgaiA9IC0gJHtyYWR9OyBqIDw9ICR7cmFkfTsgaisrKSB7XG4gICAgICAgICAgaXZlYzIgaWR4ID0gZGVwdGggKyBqO1xuICAgICAgICAgIGJ2ZWMyIGFib3ZlTG93ZXJCb3VuZCA9IGdyZWF0ZXJUaGFuRXF1YWwoaWR4LCBpdmVjMigwKSk7XG4gICAgICAgICAgYnZlYzIgYmVsb3dVcHBlckJvdW5kID0gbGVzc1RoYW5FcXVhbChpZHgsIGl2ZWMyKCR7bWF4RH0pKTtcblxuICAgICAgICAgIGJvb2wgZGVwdGhJblJhbmdlID0gYWJvdmVMb3dlckJvdW5kLnggJiYgYmVsb3dVcHBlckJvdW5kLng7XG4gICAgICAgICAgYm9vbCBkZXB0aFBsdXNPbmVJblJhbmdlID0gYWJvdmVMb3dlckJvdW5kLnkgJiYgYmVsb3dVcHBlckJvdW5kLnk7XG5cbiAgICAgICAgICBpZihkZXB0aEluUmFuZ2UgfHwgZGVwdGhQbHVzT25lSW5SYW5nZSl7XG4gICAgICAgICAgICB2ZWM0IHogPSB2ZWM0KDAuKTtcbiAgICAgICAgICAgIHZlYzQgeEZyYWdBdEN1cnJlbnREZXB0aDtcbiAgICAgICAgICAgIHoueHogPSBjYWNoZS54eTtcbiAgICAgICAgICAgIGlmKGRlcHRoUGx1c09uZUluUmFuZ2UgJiYgaGFzTmV4dENvbCl7XG4gICAgICAgICAgICAgIHhGcmFnQXRDdXJyZW50RGVwdGggPSBpZHgueSAhPSBkID9cbiAgICAgICAgICAgICAgICBnZXRYKGIsIHIsIGMsIGlkeC55KSA6IHhGcmFnQXRPdXRwdXRDb29yZHM7XG4gICAgICAgICAgICAgIHoueSA9IGdldENoYW5uZWwoeEZyYWdBdEN1cnJlbnREZXB0aCwgdmVjMihjLCBpZHgueSkpO1xuICAgICAgICAgICAgICBpZihoYXNOZXh0Um93KXtcbiAgICAgICAgICAgICAgICB6LncgPSBnZXRDaGFubmVsKHhGcmFnQXRDdXJyZW50RGVwdGgsIHZlYzIoYyArIDEsIGlkeC55KSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhY2hlLnh5ID0gei55dztcbiAgICAgICAgICAgIHN1bSArPSB6ICogejtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmVjNCByZXN1bHQgPSB4QXRPdXRwdXRDb29yZHMgKiAke3Bvd09wZXJhdG9yfTtcbiAgICAgICAgc2V0T3V0cHV0KHJlc3VsdCk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuIl19