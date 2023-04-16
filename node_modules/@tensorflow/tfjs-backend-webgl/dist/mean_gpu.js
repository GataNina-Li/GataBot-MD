/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
export class MeanProgram {
    constructor(reduceInfo, divisor) {
        this.variableNames = ['x'];
        const { windowSize, batchSize, inSize, outSize } = reduceInfo;
        this.outputShape = [batchSize, outSize];
        const windowSizeNearestVec4 = Math.floor(windowSize / 4) * 4;
        const windowSizeVec4Remainder = windowSize % 4;
        let updateSnippet = `sumValue += dot(values, ones);`;
        if (divisor != null) {
            const denominator = 1 / divisor;
            updateSnippet = `sumValue += dot(values * ${util.isInt(denominator) ? denominator.toPrecision(2) :
                denominator}, ones);`;
        }
        let checkOutOfBounds = '';
        if (inSize % windowSize > 0) {
            checkOutOfBounds = `
        if (inIdx < 0 || inIdx >= ${inSize}) {
          return 0.0;
        }
      `;
        }
        this.userCode = `
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float getValue(int batch, int inIdx) {
        ${checkOutOfBounds}
        return getX(batch, inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${windowSize};

        float sumValue = 0.0;

        for (int i = 0; i < ${windowSizeNearestVec4}; i += 4) {
          int inIdx = inOffset + i;
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          ${updateSnippet}
        }

        int inIdx = inOffset + ${windowSizeNearestVec4};
        if (${windowSizeVec4Remainder === 1}) {
          vec4 values = vec4(getValue(batch, inIdx), 0.0, 0.0, 0.0);

          ${updateSnippet}
        } else if (${windowSizeVec4Remainder === 2}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1), 0.0, 0.0);

          ${updateSnippet}
        } else if (${windowSizeVec4Remainder === 3}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2), 0.0);

          ${updateSnippet}
        }
        setOutput(sumValue);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVhbl9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL21lYW5fZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBZSxJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUd6RCxNQUFNLE9BQU8sV0FBVztJQUt0QixZQUFZLFVBQW1DLEVBQUUsT0FBZ0I7UUFKakUsa0JBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBS3BCLE1BQU0sRUFBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUMsR0FBRyxVQUFVLENBQUM7UUFDNUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUV4QyxNQUFNLHFCQUFxQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3RCxNQUFNLHVCQUF1QixHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFFL0MsSUFBSSxhQUFhLEdBQUcsZ0NBQWdDLENBQUM7UUFDckQsSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFO1lBQ25CLE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUM7WUFDaEMsYUFBYSxHQUFHLDRCQUNaLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsV0FBVyxVQUFVLENBQUM7U0FDckQ7UUFFRCxJQUFJLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUMxQixJQUFJLE1BQU0sR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFO1lBQzNCLGdCQUFnQixHQUFHO29DQUNXLE1BQU07OztPQUduQyxDQUFDO1NBQ0g7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHOzs7O1VBSVYsZ0JBQWdCOzs7Ozs7OztrQ0FRUSxVQUFVOzs7OzhCQUlkLHFCQUFxQjs7Ozs7Ozs7O1lBU3ZDLGFBQWE7OztpQ0FHUSxxQkFBcUI7Y0FDeEMsdUJBQXVCLEtBQUssQ0FBQzs7O1lBRy9CLGFBQWE7cUJBQ0osdUJBQXVCLEtBQUssQ0FBQzs7Ozs7WUFLdEMsYUFBYTtxQkFDSix1QkFBdUIsS0FBSyxDQUFDOzs7Ozs7WUFNdEMsYUFBYTs7OztLQUlwQixDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2JhY2tlbmRfdXRpbCwgdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuXG5leHBvcnQgY2xhc3MgTWVhblByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWyd4J107XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXTtcbiAgdXNlckNvZGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihyZWR1Y2VJbmZvOiBiYWNrZW5kX3V0aWwuUmVkdWNlSW5mbywgZGl2aXNvcj86IG51bWJlcikge1xuICAgIGNvbnN0IHt3aW5kb3dTaXplLCBiYXRjaFNpemUsIGluU2l6ZSwgb3V0U2l6ZX0gPSByZWR1Y2VJbmZvO1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBbYmF0Y2hTaXplLCBvdXRTaXplXTtcblxuICAgIGNvbnN0IHdpbmRvd1NpemVOZWFyZXN0VmVjNCA9IE1hdGguZmxvb3Iod2luZG93U2l6ZSAvIDQpICogNDtcbiAgICBjb25zdCB3aW5kb3dTaXplVmVjNFJlbWFpbmRlciA9IHdpbmRvd1NpemUgJSA0O1xuXG4gICAgbGV0IHVwZGF0ZVNuaXBwZXQgPSBgc3VtVmFsdWUgKz0gZG90KHZhbHVlcywgb25lcyk7YDtcbiAgICBpZiAoZGl2aXNvciAhPSBudWxsKSB7XG4gICAgICBjb25zdCBkZW5vbWluYXRvciA9IDEgLyBkaXZpc29yO1xuICAgICAgdXBkYXRlU25pcHBldCA9IGBzdW1WYWx1ZSArPSBkb3QodmFsdWVzICogJHtcbiAgICAgICAgICB1dGlsLmlzSW50KGRlbm9taW5hdG9yKSA/IGRlbm9taW5hdG9yLnRvUHJlY2lzaW9uKDIpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbm9taW5hdG9yfSwgb25lcyk7YDtcbiAgICB9XG5cbiAgICBsZXQgY2hlY2tPdXRPZkJvdW5kcyA9ICcnO1xuICAgIGlmIChpblNpemUgJSB3aW5kb3dTaXplID4gMCkge1xuICAgICAgY2hlY2tPdXRPZkJvdW5kcyA9IGBcbiAgICAgICAgaWYgKGluSWR4IDwgMCB8fCBpbklkeCA+PSAke2luU2l6ZX0pIHtcbiAgICAgICAgICByZXR1cm4gMC4wO1xuICAgICAgICB9XG4gICAgICBgO1xuICAgIH1cblxuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICBjb25zdCB2ZWM0IG9uZXMgPSB2ZWM0KDEuMCwgMS4wLCAxLjAsIDEuMCk7XG5cbiAgICAgIGZsb2F0IGdldFZhbHVlKGludCBiYXRjaCwgaW50IGluSWR4KSB7XG4gICAgICAgICR7Y2hlY2tPdXRPZkJvdW5kc31cbiAgICAgICAgcmV0dXJuIGdldFgoYmF0Y2gsIGluSWR4KTtcbiAgICAgIH1cblxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICBpdmVjMiBjb29yZHMgPSBnZXRPdXRwdXRDb29yZHMoKTtcbiAgICAgICAgaW50IGJhdGNoID0gY29vcmRzWzBdO1xuICAgICAgICBpbnQgb3V0SWR4ID0gY29vcmRzWzFdO1xuICAgICAgICBpbnQgaW5PZmZzZXQgPSBvdXRJZHggKiAke3dpbmRvd1NpemV9O1xuXG4gICAgICAgIGZsb2F0IHN1bVZhbHVlID0gMC4wO1xuXG4gICAgICAgIGZvciAoaW50IGkgPSAwOyBpIDwgJHt3aW5kb3dTaXplTmVhcmVzdFZlYzR9OyBpICs9IDQpIHtcbiAgICAgICAgICBpbnQgaW5JZHggPSBpbk9mZnNldCArIGk7XG4gICAgICAgICAgdmVjNCB2YWx1ZXMgPSB2ZWM0KFxuICAgICAgICAgICAgZ2V0VmFsdWUoYmF0Y2gsIGluSWR4KSxcbiAgICAgICAgICAgIGdldFZhbHVlKGJhdGNoLCBpbklkeCArIDEpLFxuICAgICAgICAgICAgZ2V0VmFsdWUoYmF0Y2gsIGluSWR4ICsgMiksXG4gICAgICAgICAgICBnZXRWYWx1ZShiYXRjaCwgaW5JZHggKyAzKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICAke3VwZGF0ZVNuaXBwZXR9XG4gICAgICAgIH1cblxuICAgICAgICBpbnQgaW5JZHggPSBpbk9mZnNldCArICR7d2luZG93U2l6ZU5lYXJlc3RWZWM0fTtcbiAgICAgICAgaWYgKCR7d2luZG93U2l6ZVZlYzRSZW1haW5kZXIgPT09IDF9KSB7XG4gICAgICAgICAgdmVjNCB2YWx1ZXMgPSB2ZWM0KGdldFZhbHVlKGJhdGNoLCBpbklkeCksIDAuMCwgMC4wLCAwLjApO1xuXG4gICAgICAgICAgJHt1cGRhdGVTbmlwcGV0fVxuICAgICAgICB9IGVsc2UgaWYgKCR7d2luZG93U2l6ZVZlYzRSZW1haW5kZXIgPT09IDJ9KSB7XG4gICAgICAgICAgdmVjNCB2YWx1ZXMgPSB2ZWM0KFxuICAgICAgICAgICAgZ2V0VmFsdWUoYmF0Y2gsIGluSWR4KSxcbiAgICAgICAgICAgIGdldFZhbHVlKGJhdGNoLCBpbklkeCArIDEpLCAwLjAsIDAuMCk7XG5cbiAgICAgICAgICAke3VwZGF0ZVNuaXBwZXR9XG4gICAgICAgIH0gZWxzZSBpZiAoJHt3aW5kb3dTaXplVmVjNFJlbWFpbmRlciA9PT0gM30pIHtcbiAgICAgICAgICB2ZWM0IHZhbHVlcyA9IHZlYzQoXG4gICAgICAgICAgICBnZXRWYWx1ZShiYXRjaCwgaW5JZHgpLFxuICAgICAgICAgICAgZ2V0VmFsdWUoYmF0Y2gsIGluSWR4ICsgMSksXG4gICAgICAgICAgICBnZXRWYWx1ZShiYXRjaCwgaW5JZHggKyAyKSwgMC4wKTtcblxuICAgICAgICAgICR7dXBkYXRlU25pcHBldH1cbiAgICAgICAgfVxuICAgICAgICBzZXRPdXRwdXQoc3VtVmFsdWUpO1xuICAgICAgfVxuICAgIGA7XG4gIH1cbn1cbiJdfQ==