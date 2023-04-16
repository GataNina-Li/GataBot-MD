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
export class Dilation2DProgram {
    constructor(convInfo) {
        this.variableNames = ['x', 'W'];
        this.outputShape = convInfo.outShape;
        const { inHeight, inWidth, padInfo, strideHeight, strideWidth, filterHeight, filterWidth, dilationHeight, dilationWidth } = convInfo;
        const { top: padTop, left: padLeft } = padInfo;
        this.userCode = `
      const ivec2 strides = ivec2(${strideHeight}, ${strideWidth});
      const ivec2 pads = ivec2(${padTop}, ${padLeft});
      const float neg_infinity = -3.4e38;

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        int d1 = coords.w;
        ivec2 outTopLeftCorner =
            coords.yz * strides - pads;
        int hBeg = outTopLeftCorner.x;
        int wBeg = outTopLeftCorner.y;

        float curVal = neg_infinity;
        for (int h = 0; h < ${filterHeight}; h++) {
          int hIn = hBeg + h * ${dilationHeight};

          if (hIn >= 0 && hIn < ${inHeight}) {
            for (int w = 0; w < ${filterWidth}; w++) {
              int wIn = wBeg + w * ${dilationWidth};

              if (wIn >= 0 && wIn < ${inWidth}) {
                float xVal = getX(batch, hIn, wIn, d1);
                float wVal = getW(h, w, d1);

                float val = xVal + wVal;
                if (val > curVal) {
                  curVal = val;
                }
              }
            }
          }
        }

        float result = curVal;
        setOutput(result);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlsYXRpb25fZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9kaWxhdGlvbl9ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBS0gsTUFBTSxPQUFPLGlCQUFpQjtJQUs1QixZQUFZLFFBQWlDO1FBSjdDLGtCQUFhLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFLekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO1FBRXJDLE1BQU0sRUFDSixRQUFRLEVBQ1IsT0FBTyxFQUNQLE9BQU8sRUFDUCxZQUFZLEVBQ1osV0FBVyxFQUNYLFlBQVksRUFDWixXQUFXLEVBQ1gsY0FBYyxFQUNkLGFBQWEsRUFDZCxHQUFHLFFBQVEsQ0FBQztRQUViLE1BQU0sRUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUMsR0FBRyxPQUFPLENBQUM7UUFFN0MsSUFBSSxDQUFDLFFBQVEsR0FBRztvQ0FDZ0IsWUFBWSxLQUFLLFdBQVc7aUNBQy9CLE1BQU0sS0FBSyxPQUFPOzs7Ozs7Ozs7Ozs7OzhCQWFyQixZQUFZO2lDQUNULGNBQWM7O2tDQUViLFFBQVE7a0NBQ1IsV0FBVztxQ0FDUixhQUFhOztzQ0FFWixPQUFPOzs7Ozs7Ozs7Ozs7Ozs7O0tBZ0J4QyxDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2JhY2tlbmRfdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuXG5leHBvcnQgY2xhc3MgRGlsYXRpb24yRFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWyd4JywgJ1cnXTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGNvbnZJbmZvOiBiYWNrZW5kX3V0aWwuQ29udjJESW5mbykge1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBjb252SW5mby5vdXRTaGFwZTtcblxuICAgIGNvbnN0IHtcbiAgICAgIGluSGVpZ2h0LFxuICAgICAgaW5XaWR0aCxcbiAgICAgIHBhZEluZm8sXG4gICAgICBzdHJpZGVIZWlnaHQsXG4gICAgICBzdHJpZGVXaWR0aCxcbiAgICAgIGZpbHRlckhlaWdodCxcbiAgICAgIGZpbHRlcldpZHRoLFxuICAgICAgZGlsYXRpb25IZWlnaHQsXG4gICAgICBkaWxhdGlvbldpZHRoXG4gICAgfSA9IGNvbnZJbmZvO1xuXG4gICAgY29uc3Qge3RvcDogcGFkVG9wLCBsZWZ0OiBwYWRMZWZ0fSA9IHBhZEluZm87XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgY29uc3QgaXZlYzIgc3RyaWRlcyA9IGl2ZWMyKCR7c3RyaWRlSGVpZ2h0fSwgJHtzdHJpZGVXaWR0aH0pO1xuICAgICAgY29uc3QgaXZlYzIgcGFkcyA9IGl2ZWMyKCR7cGFkVG9wfSwgJHtwYWRMZWZ0fSk7XG4gICAgICBjb25zdCBmbG9hdCBuZWdfaW5maW5pdHkgPSAtMy40ZTM4O1xuXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIGl2ZWM0IGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICBpbnQgYmF0Y2ggPSBjb29yZHMueDtcbiAgICAgICAgaW50IGQxID0gY29vcmRzLnc7XG4gICAgICAgIGl2ZWMyIG91dFRvcExlZnRDb3JuZXIgPVxuICAgICAgICAgICAgY29vcmRzLnl6ICogc3RyaWRlcyAtIHBhZHM7XG4gICAgICAgIGludCBoQmVnID0gb3V0VG9wTGVmdENvcm5lci54O1xuICAgICAgICBpbnQgd0JlZyA9IG91dFRvcExlZnRDb3JuZXIueTtcblxuICAgICAgICBmbG9hdCBjdXJWYWwgPSBuZWdfaW5maW5pdHk7XG4gICAgICAgIGZvciAoaW50IGggPSAwOyBoIDwgJHtmaWx0ZXJIZWlnaHR9OyBoKyspIHtcbiAgICAgICAgICBpbnQgaEluID0gaEJlZyArIGggKiAke2RpbGF0aW9uSGVpZ2h0fTtcblxuICAgICAgICAgIGlmIChoSW4gPj0gMCAmJiBoSW4gPCAke2luSGVpZ2h0fSkge1xuICAgICAgICAgICAgZm9yIChpbnQgdyA9IDA7IHcgPCAke2ZpbHRlcldpZHRofTsgdysrKSB7XG4gICAgICAgICAgICAgIGludCB3SW4gPSB3QmVnICsgdyAqICR7ZGlsYXRpb25XaWR0aH07XG5cbiAgICAgICAgICAgICAgaWYgKHdJbiA+PSAwICYmIHdJbiA8ICR7aW5XaWR0aH0pIHtcbiAgICAgICAgICAgICAgICBmbG9hdCB4VmFsID0gZ2V0WChiYXRjaCwgaEluLCB3SW4sIGQxKTtcbiAgICAgICAgICAgICAgICBmbG9hdCB3VmFsID0gZ2V0VyhoLCB3LCBkMSk7XG5cbiAgICAgICAgICAgICAgICBmbG9hdCB2YWwgPSB4VmFsICsgd1ZhbDtcbiAgICAgICAgICAgICAgICBpZiAodmFsID4gY3VyVmFsKSB7XG4gICAgICAgICAgICAgICAgICBjdXJWYWwgPSB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZmxvYXQgcmVzdWx0ID0gY3VyVmFsO1xuICAgICAgICBzZXRPdXRwdXQocmVzdWx0KTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG4iXX0=