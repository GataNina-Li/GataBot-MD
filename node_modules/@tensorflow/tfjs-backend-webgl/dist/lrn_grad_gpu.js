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
export class LRNGradProgram {
    constructor(inputShape, depthRadius, bias, alpha, beta) {
        this.variableNames = ['inputImage', 'outputImage', 'dy'];
        this.outputShape = [];
        this.outputShape = inputShape;
        this.depth = inputShape[3];
        this.depthRadius = depthRadius;
        this.bias = bias;
        this.alpha = alpha;
        this.beta = beta;
        this.userCode = `
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int r = coords[1];
        int c = coords[2];

        float result = 0.0;
        for (int d = 0; d < ${this.depth}; ++d) {
          int depthBegin = int(max(0.0, float(d - ${depthRadius})));
          int depthEnd = int(min(float(${this.depth}),
              float(d + ${depthRadius} + 1)));

          const int MIN_DEPTH_BEGIN = 0;
          const int MAX_DEPTH_END = ${this.depth};

          float norm = 0.0;
          for (int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k) {
            if (k < depthBegin){
              continue;
            }
            else if (k >= depthBegin && k < depthEnd) {
              norm += getInputImage(b, r, c, k) * getInputImage(b, r, c, k);
            }
            else {
              break;
            }
          }

          norm = float(${alpha}) * norm + float(${bias});

          for(int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k){
            if (k < depthBegin){
              continue;
            }
            else if (k >= depthBegin && k < depthEnd){
              float dyi = -2.0 * float(${alpha})
                * float(${beta})
                * getInputImage(b ,r ,c, k) * getOutputImage(b, r, c, d)
                / norm;
              if (k == d) {
                dyi += pow(norm, -1.0 * ${beta});
              }
              if (k == coords[3]) {
                dyi *= getDy(b, r, c, d);
                result += dyi;
              }
            }
            else {
              break;
            }
          }
      }
      setOutput(result);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibHJuX2dyYWRfZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9scm5fZ3JhZF9ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBSUgsTUFBTSxPQUFPLGNBQWM7SUFVekIsWUFDSSxVQUFvQixFQUFFLFdBQW1CLEVBQUUsSUFBWSxFQUFFLEtBQWEsRUFDdEUsSUFBWTtRQVhoQixrQkFBYSxHQUFHLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwRCxnQkFBVyxHQUFhLEVBQUUsQ0FBQztRQVd6QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHOzs7Ozs7Ozs4QkFRVSxJQUFJLENBQUMsS0FBSztvREFDWSxXQUFXO3lDQUN0QixJQUFJLENBQUMsS0FBSzswQkFDekIsV0FBVzs7O3NDQUdDLElBQUksQ0FBQyxLQUFLOzs7Ozs7Ozs7Ozs7Ozs7eUJBZXZCLEtBQUssb0JBQW9CLElBQUk7Ozs7Ozs7eUNBT2IsS0FBSzswQkFDcEIsSUFBSTs7OzswQ0FJWSxJQUFJOzs7Ozs7Ozs7Ozs7OztLQWN6QyxDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0dQR1BVUHJvZ3JhbX0gZnJvbSAnLi9ncGdwdV9tYXRoJztcblxuZXhwb3J0IGNsYXNzIExSTkdyYWRQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsnaW5wdXRJbWFnZScsICdvdXRwdXRJbWFnZScsICdkeSddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW10gPSBbXTtcbiAgdXNlckNvZGU6IHN0cmluZztcbiAgZGVwdGhSYWRpdXM6IG51bWJlcjtcbiAgYmlhczogbnVtYmVyO1xuICBhbHBoYTogbnVtYmVyO1xuICBiZXRhOiBudW1iZXI7XG4gIGRlcHRoOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBpbnB1dFNoYXBlOiBudW1iZXJbXSwgZGVwdGhSYWRpdXM6IG51bWJlciwgYmlhczogbnVtYmVyLCBhbHBoYTogbnVtYmVyLFxuICAgICAgYmV0YTogbnVtYmVyKSB7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IGlucHV0U2hhcGU7XG4gICAgdGhpcy5kZXB0aCA9IGlucHV0U2hhcGVbM107XG4gICAgdGhpcy5kZXB0aFJhZGl1cyA9IGRlcHRoUmFkaXVzO1xuICAgIHRoaXMuYmlhcyA9IGJpYXM7XG4gICAgdGhpcy5hbHBoYSA9IGFscGhhO1xuICAgIHRoaXMuYmV0YSA9IGJldGE7XG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgaXZlYzQgY29vcmRzID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gICAgICAgIGludCBiID0gY29vcmRzWzBdO1xuICAgICAgICBpbnQgciA9IGNvb3Jkc1sxXTtcbiAgICAgICAgaW50IGMgPSBjb29yZHNbMl07XG5cbiAgICAgICAgZmxvYXQgcmVzdWx0ID0gMC4wO1xuICAgICAgICBmb3IgKGludCBkID0gMDsgZCA8ICR7dGhpcy5kZXB0aH07ICsrZCkge1xuICAgICAgICAgIGludCBkZXB0aEJlZ2luID0gaW50KG1heCgwLjAsIGZsb2F0KGQgLSAke2RlcHRoUmFkaXVzfSkpKTtcbiAgICAgICAgICBpbnQgZGVwdGhFbmQgPSBpbnQobWluKGZsb2F0KCR7dGhpcy5kZXB0aH0pLFxuICAgICAgICAgICAgICBmbG9hdChkICsgJHtkZXB0aFJhZGl1c30gKyAxKSkpO1xuXG4gICAgICAgICAgY29uc3QgaW50IE1JTl9ERVBUSF9CRUdJTiA9IDA7XG4gICAgICAgICAgY29uc3QgaW50IE1BWF9ERVBUSF9FTkQgPSAke3RoaXMuZGVwdGh9O1xuXG4gICAgICAgICAgZmxvYXQgbm9ybSA9IDAuMDtcbiAgICAgICAgICBmb3IgKGludCBrID0gTUlOX0RFUFRIX0JFR0lOOyBrIDwgTUFYX0RFUFRIX0VORDsgKytrKSB7XG4gICAgICAgICAgICBpZiAoayA8IGRlcHRoQmVnaW4pe1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGsgPj0gZGVwdGhCZWdpbiAmJiBrIDwgZGVwdGhFbmQpIHtcbiAgICAgICAgICAgICAgbm9ybSArPSBnZXRJbnB1dEltYWdlKGIsIHIsIGMsIGspICogZ2V0SW5wdXRJbWFnZShiLCByLCBjLCBrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBub3JtID0gZmxvYXQoJHthbHBoYX0pICogbm9ybSArIGZsb2F0KCR7Ymlhc30pO1xuXG4gICAgICAgICAgZm9yKGludCBrID0gTUlOX0RFUFRIX0JFR0lOOyBrIDwgTUFYX0RFUFRIX0VORDsgKytrKXtcbiAgICAgICAgICAgIGlmIChrIDwgZGVwdGhCZWdpbil7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoayA+PSBkZXB0aEJlZ2luICYmIGsgPCBkZXB0aEVuZCl7XG4gICAgICAgICAgICAgIGZsb2F0IGR5aSA9IC0yLjAgKiBmbG9hdCgke2FscGhhfSlcbiAgICAgICAgICAgICAgICAqIGZsb2F0KCR7YmV0YX0pXG4gICAgICAgICAgICAgICAgKiBnZXRJbnB1dEltYWdlKGIgLHIgLGMsIGspICogZ2V0T3V0cHV0SW1hZ2UoYiwgciwgYywgZClcbiAgICAgICAgICAgICAgICAvIG5vcm07XG4gICAgICAgICAgICAgIGlmIChrID09IGQpIHtcbiAgICAgICAgICAgICAgICBkeWkgKz0gcG93KG5vcm0sIC0xLjAgKiAke2JldGF9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoayA9PSBjb29yZHNbM10pIHtcbiAgICAgICAgICAgICAgICBkeWkgKj0gZ2V0RHkoYiwgciwgYywgZCk7XG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IGR5aTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNldE91dHB1dChyZXN1bHQpO1xuICAgICAgfVxuICAgIGA7XG4gIH1cbn1cbiJdfQ==