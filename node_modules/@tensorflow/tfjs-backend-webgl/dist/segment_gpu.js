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
export class SegmentOpProgram {
    constructor(segOpInfo, segOpType) {
        this.variableNames = ['x', 'segmentIds'];
        const windowSize = segOpInfo.windowSize;
        const batchSize = segOpInfo.batchSize;
        const inSize = segOpInfo.inSize;
        const numSegments = segOpInfo.numSegments;
        const outSize = numSegments * Math.ceil(inSize / windowSize);
        this.outputShape = [batchSize, outSize];
        const initializationValue = '0.0';
        const returnValue = `sumValue`;
        const windowSizeNearestVec4 = Math.floor(windowSize / 4) * 4;
        const windowSizeVec4Remainder = windowSize % 4;
        const updateSnippet = `
        sumValue += dot(values, segFilter);
    `;
        let checkValueOutOfBounds = '';
        if (inSize % windowSize > 0) {
            checkValueOutOfBounds = `
        if (inIdx < 0 || inIdx >= ${inSize}) {
          return initializationValue;
        }
      `;
        }
        let checkSegmentIdOutOfBounds = '';
        if (inSize % windowSize > 0) {
            checkSegmentIdOutOfBounds = `
        if (inIdx < 0 || inIdx >= ${inSize}) {
          return -1.0;
        }
      `;
        }
        this.userCode = `
      const float initializationValue = ${initializationValue};

      float getValue(int batch, int inIdx) {
        ${checkValueOutOfBounds}
        return getX(batch, inIdx);
      }

      float getSegmentIdAtIndex(int inIdx) {
        ${checkSegmentIdOutOfBounds}
        return getSegmentIds(inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = int(floor(float(outIdx) / float(
          ${numSegments})) * float(${windowSize}));
        int currentSeg = int(mod(float(outIdx), float(${numSegments})));

        float sumValue = 0.0;

        for (int i = 0; i < ${windowSizeNearestVec4}; i += 4) {
          int inIdx = inOffset + i;
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 3)) == currentSeg ? 1 : 0
          );

          ${updateSnippet}
        }

        int inIdx = inOffset + ${windowSizeNearestVec4};
        if (${windowSizeVec4Remainder === 1}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            initializationValue,
            initializationValue,
            initializationValue
          );

          int inIdxSeg = int(getSegmentIdAtIndex(inIdx));

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            0,
            0,
            0
          );

          ${updateSnippet}
        } else if (${windowSizeVec4Remainder === 2}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            initializationValue,
            initializationValue
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
              0,
              0
          );

          ${updateSnippet}
        } else if (${windowSizeVec4Remainder === 3}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            initializationValue
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,
            0
          );

          ${updateSnippet}
        }
        setOutput(${returnValue});
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VnbWVudF9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL3NlZ21lbnRfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUtILE1BQU0sT0FBTyxnQkFBZ0I7SUFLM0IsWUFDSSxTQUE4QyxFQUM5QyxTQUErQjtRQU5uQyxrQkFBYSxHQUFHLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBT2xDLE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUM7UUFDeEMsTUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQztRQUN0QyxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO1FBQ2hDLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDMUMsTUFBTSxPQUFPLEdBQUcsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFeEMsTUFBTSxtQkFBbUIsR0FBRyxLQUFLLENBQUM7UUFDbEMsTUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBRS9CLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdELE1BQU0sdUJBQXVCLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUUvQyxNQUFNLGFBQWEsR0FBRzs7S0FFckIsQ0FBQztRQUVGLElBQUkscUJBQXFCLEdBQUcsRUFBRSxDQUFDO1FBQy9CLElBQUksTUFBTSxHQUFHLFVBQVUsR0FBRyxDQUFDLEVBQUU7WUFDM0IscUJBQXFCLEdBQUc7b0NBQ00sTUFBTTs7O09BR25DLENBQUM7U0FDSDtRQUVELElBQUkseUJBQXlCLEdBQUcsRUFBRSxDQUFDO1FBQ25DLElBQUksTUFBTSxHQUFHLFVBQVUsR0FBRyxDQUFDLEVBQUU7WUFDM0IseUJBQXlCLEdBQUc7b0NBQ0UsTUFBTTs7O09BR25DLENBQUM7U0FDSDtRQUVELElBQUksQ0FBQyxRQUFRLEdBQUc7MENBQ3NCLG1CQUFtQjs7O1VBR25ELHFCQUFxQjs7Ozs7VUFLckIseUJBQXlCOzs7Ozs7Ozs7WUFTdkIsV0FBVyxjQUFjLFVBQVU7d0RBQ1MsV0FBVzs7Ozs4QkFJckMscUJBQXFCOzs7Ozs7Ozs7Ozs7Ozs7O1lBZ0J2QyxhQUFhOzs7aUNBR1EscUJBQXFCO2NBQ3hDLHVCQUF1QixLQUFLLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBaUIvQixhQUFhO3FCQUNKLHVCQUF1QixLQUFLLENBQUM7Ozs7Ozs7Ozs7Ozs7OztZQWV0QyxhQUFhO3FCQUNKLHVCQUF1QixLQUFLLENBQUM7Ozs7Ozs7Ozs7Ozs7OztZQWV0QyxhQUFhOztvQkFFTCxXQUFXOztLQUUxQixDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2JhY2tlbmRfdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuXG5leHBvcnQgY2xhc3MgU2VnbWVudE9wUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ3gnLCAnc2VnbWVudElkcyddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBzZWdPcEluZm86IGJhY2tlbmRfdXRpbC5zZWdtZW50X3V0aWwuU2VnT3BJbmZvLFxuICAgICAgc2VnT3BUeXBlOiAndW5zb3J0ZWRTZWdtZW50U3VtJykge1xuICAgIGNvbnN0IHdpbmRvd1NpemUgPSBzZWdPcEluZm8ud2luZG93U2l6ZTtcbiAgICBjb25zdCBiYXRjaFNpemUgPSBzZWdPcEluZm8uYmF0Y2hTaXplO1xuICAgIGNvbnN0IGluU2l6ZSA9IHNlZ09wSW5mby5pblNpemU7XG4gICAgY29uc3QgbnVtU2VnbWVudHMgPSBzZWdPcEluZm8ubnVtU2VnbWVudHM7XG4gICAgY29uc3Qgb3V0U2l6ZSA9IG51bVNlZ21lbnRzICogTWF0aC5jZWlsKGluU2l6ZSAvIHdpbmRvd1NpemUpO1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBbYmF0Y2hTaXplLCBvdXRTaXplXTtcblxuICAgIGNvbnN0IGluaXRpYWxpemF0aW9uVmFsdWUgPSAnMC4wJztcbiAgICBjb25zdCByZXR1cm5WYWx1ZSA9IGBzdW1WYWx1ZWA7XG5cbiAgICBjb25zdCB3aW5kb3dTaXplTmVhcmVzdFZlYzQgPSBNYXRoLmZsb29yKHdpbmRvd1NpemUgLyA0KSAqIDQ7XG4gICAgY29uc3Qgd2luZG93U2l6ZVZlYzRSZW1haW5kZXIgPSB3aW5kb3dTaXplICUgNDtcblxuICAgIGNvbnN0IHVwZGF0ZVNuaXBwZXQgPSBgXG4gICAgICAgIHN1bVZhbHVlICs9IGRvdCh2YWx1ZXMsIHNlZ0ZpbHRlcik7XG4gICAgYDtcblxuICAgIGxldCBjaGVja1ZhbHVlT3V0T2ZCb3VuZHMgPSAnJztcbiAgICBpZiAoaW5TaXplICUgd2luZG93U2l6ZSA+IDApIHtcbiAgICAgIGNoZWNrVmFsdWVPdXRPZkJvdW5kcyA9IGBcbiAgICAgICAgaWYgKGluSWR4IDwgMCB8fCBpbklkeCA+PSAke2luU2l6ZX0pIHtcbiAgICAgICAgICByZXR1cm4gaW5pdGlhbGl6YXRpb25WYWx1ZTtcbiAgICAgICAgfVxuICAgICAgYDtcbiAgICB9XG5cbiAgICBsZXQgY2hlY2tTZWdtZW50SWRPdXRPZkJvdW5kcyA9ICcnO1xuICAgIGlmIChpblNpemUgJSB3aW5kb3dTaXplID4gMCkge1xuICAgICAgY2hlY2tTZWdtZW50SWRPdXRPZkJvdW5kcyA9IGBcbiAgICAgICAgaWYgKGluSWR4IDwgMCB8fCBpbklkeCA+PSAke2luU2l6ZX0pIHtcbiAgICAgICAgICByZXR1cm4gLTEuMDtcbiAgICAgICAgfVxuICAgICAgYDtcbiAgICB9XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgY29uc3QgZmxvYXQgaW5pdGlhbGl6YXRpb25WYWx1ZSA9ICR7aW5pdGlhbGl6YXRpb25WYWx1ZX07XG5cbiAgICAgIGZsb2F0IGdldFZhbHVlKGludCBiYXRjaCwgaW50IGluSWR4KSB7XG4gICAgICAgICR7Y2hlY2tWYWx1ZU91dE9mQm91bmRzfVxuICAgICAgICByZXR1cm4gZ2V0WChiYXRjaCwgaW5JZHgpO1xuICAgICAgfVxuXG4gICAgICBmbG9hdCBnZXRTZWdtZW50SWRBdEluZGV4KGludCBpbklkeCkge1xuICAgICAgICAke2NoZWNrU2VnbWVudElkT3V0T2ZCb3VuZHN9XG4gICAgICAgIHJldHVybiBnZXRTZWdtZW50SWRzKGluSWR4KTtcbiAgICAgIH1cblxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICBpdmVjMiBjb29yZHMgPSBnZXRPdXRwdXRDb29yZHMoKTtcbiAgICAgICAgaW50IGJhdGNoID0gY29vcmRzWzBdO1xuICAgICAgICBpbnQgb3V0SWR4ID0gY29vcmRzWzFdO1xuICAgICAgICBpbnQgaW5PZmZzZXQgPSBpbnQoZmxvb3IoZmxvYXQob3V0SWR4KSAvIGZsb2F0KFxuICAgICAgICAgICR7bnVtU2VnbWVudHN9KSkgKiBmbG9hdCgke3dpbmRvd1NpemV9KSk7XG4gICAgICAgIGludCBjdXJyZW50U2VnID0gaW50KG1vZChmbG9hdChvdXRJZHgpLCBmbG9hdCgke251bVNlZ21lbnRzfSkpKTtcblxuICAgICAgICBmbG9hdCBzdW1WYWx1ZSA9IDAuMDtcblxuICAgICAgICBmb3IgKGludCBpID0gMDsgaSA8ICR7d2luZG93U2l6ZU5lYXJlc3RWZWM0fTsgaSArPSA0KSB7XG4gICAgICAgICAgaW50IGluSWR4ID0gaW5PZmZzZXQgKyBpO1xuICAgICAgICAgIHZlYzQgdmFsdWVzID0gdmVjNChcbiAgICAgICAgICAgIGdldFZhbHVlKGJhdGNoLCBpbklkeCksXG4gICAgICAgICAgICBnZXRWYWx1ZShiYXRjaCwgaW5JZHggKyAxKSxcbiAgICAgICAgICAgIGdldFZhbHVlKGJhdGNoLCBpbklkeCArIDIpLFxuICAgICAgICAgICAgZ2V0VmFsdWUoYmF0Y2gsIGluSWR4ICsgMylcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgdmVjNCBzZWdGaWx0ZXIgPSB2ZWM0KFxuICAgICAgICAgICAgaW50KGdldFNlZ21lbnRJZEF0SW5kZXgoaW5JZHgpKSA9PSBjdXJyZW50U2VnID8gMSA6IDAsXG4gICAgICAgICAgICBpbnQoZ2V0U2VnbWVudElkQXRJbmRleChpbklkeCArIDEpKSA9PSBjdXJyZW50U2VnID8gMSA6IDAsXG4gICAgICAgICAgICBpbnQoZ2V0U2VnbWVudElkQXRJbmRleChpbklkeCArIDIpKSA9PSBjdXJyZW50U2VnID8gMSA6IDAsXG4gICAgICAgICAgICBpbnQoZ2V0U2VnbWVudElkQXRJbmRleChpbklkeCArIDMpKSA9PSBjdXJyZW50U2VnID8gMSA6IDBcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgJHt1cGRhdGVTbmlwcGV0fVxuICAgICAgICB9XG5cbiAgICAgICAgaW50IGluSWR4ID0gaW5PZmZzZXQgKyAke3dpbmRvd1NpemVOZWFyZXN0VmVjNH07XG4gICAgICAgIGlmICgke3dpbmRvd1NpemVWZWM0UmVtYWluZGVyID09PSAxfSkge1xuICAgICAgICAgIHZlYzQgdmFsdWVzID0gdmVjNChcbiAgICAgICAgICAgIGdldFZhbHVlKGJhdGNoLCBpbklkeCksXG4gICAgICAgICAgICBpbml0aWFsaXphdGlvblZhbHVlLFxuICAgICAgICAgICAgaW5pdGlhbGl6YXRpb25WYWx1ZSxcbiAgICAgICAgICAgIGluaXRpYWxpemF0aW9uVmFsdWVcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgaW50IGluSWR4U2VnID0gaW50KGdldFNlZ21lbnRJZEF0SW5kZXgoaW5JZHgpKTtcblxuICAgICAgICAgIHZlYzQgc2VnRmlsdGVyID0gdmVjNChcbiAgICAgICAgICAgIGludChnZXRTZWdtZW50SWRBdEluZGV4KGluSWR4KSkgPT0gY3VycmVudFNlZyA/IDEgOiAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAwXG4gICAgICAgICAgKTtcblxuICAgICAgICAgICR7dXBkYXRlU25pcHBldH1cbiAgICAgICAgfSBlbHNlIGlmICgke3dpbmRvd1NpemVWZWM0UmVtYWluZGVyID09PSAyfSkge1xuICAgICAgICAgIHZlYzQgdmFsdWVzID0gdmVjNChcbiAgICAgICAgICAgIGdldFZhbHVlKGJhdGNoLCBpbklkeCksXG4gICAgICAgICAgICBnZXRWYWx1ZShiYXRjaCwgaW5JZHggKyAxKSxcbiAgICAgICAgICAgIGluaXRpYWxpemF0aW9uVmFsdWUsXG4gICAgICAgICAgICBpbml0aWFsaXphdGlvblZhbHVlXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHZlYzQgc2VnRmlsdGVyID0gdmVjNChcbiAgICAgICAgICAgIGludChnZXRTZWdtZW50SWRBdEluZGV4KGluSWR4KSkgPT0gY3VycmVudFNlZyA/IDEgOiAwLFxuICAgICAgICAgICAgaW50KGdldFNlZ21lbnRJZEF0SW5kZXgoaW5JZHggKyAxKSkgPT0gY3VycmVudFNlZyA/IDEgOiAwLFxuICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAwXG4gICAgICAgICAgKTtcblxuICAgICAgICAgICR7dXBkYXRlU25pcHBldH1cbiAgICAgICAgfSBlbHNlIGlmICgke3dpbmRvd1NpemVWZWM0UmVtYWluZGVyID09PSAzfSkge1xuICAgICAgICAgIHZlYzQgdmFsdWVzID0gdmVjNChcbiAgICAgICAgICAgIGdldFZhbHVlKGJhdGNoLCBpbklkeCksXG4gICAgICAgICAgICBnZXRWYWx1ZShiYXRjaCwgaW5JZHggKyAxKSxcbiAgICAgICAgICAgIGdldFZhbHVlKGJhdGNoLCBpbklkeCArIDIpLFxuICAgICAgICAgICAgaW5pdGlhbGl6YXRpb25WYWx1ZVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICB2ZWM0IHNlZ0ZpbHRlciA9IHZlYzQoXG4gICAgICAgICAgICBpbnQoZ2V0U2VnbWVudElkQXRJbmRleChpbklkeCkpID09IGN1cnJlbnRTZWcgPyAxIDogMCxcbiAgICAgICAgICAgIGludChnZXRTZWdtZW50SWRBdEluZGV4KGluSWR4ICsgMSkpID09IGN1cnJlbnRTZWcgPyAxIDogMCxcbiAgICAgICAgICAgIGludChnZXRTZWdtZW50SWRBdEluZGV4KGluSWR4ICsgMikpID09IGN1cnJlbnRTZWcgPyAxIDogMCxcbiAgICAgICAgICAgIDBcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgJHt1cGRhdGVTbmlwcGV0fVxuICAgICAgICB9XG4gICAgICAgIHNldE91dHB1dCgke3JldHVyblZhbHVlfSk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuIl19