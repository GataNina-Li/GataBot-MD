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
export class ArgMinMaxProgram {
    constructor(reduceInfo, op, firstPass) {
        this.variableNames = ['A'];
        const { windowSize, batchSize, outSize } = reduceInfo;
        if (!firstPass) {
            this.variableNames.push('bestIndicesA');
        }
        this.outputShape = [batchSize, outSize];
        const compOp = (op === 'max') ? '>' : '<';
        const indexSnippet = firstPass ?
            'inOffset + i;' :
            'round(getBestIndicesA(batch, inOffset + i));';
        this.userCode = `
      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${windowSize};

        int bestIndex = inOffset;
        float bestValue = getA(batch, bestIndex);

        for (int i = 0; i < ${windowSize}; i++) {
          int inIdx = ${indexSnippet};
          float candidate = getA(batch, inIdx);
          if (candidate ${compOp} bestValue) {
            bestValue = candidate;
            bestIndex = inIdx;
          }
        }
        setOutput(float(bestIndex));
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJnbWlubWF4X2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvYXJnbWlubWF4X2dwdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFLSCxNQUFNLE9BQU8sZ0JBQWdCO0lBSzNCLFlBQ0ksVUFBbUMsRUFBRSxFQUFlLEVBQ3BELFNBQWtCO1FBTnRCLGtCQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQU9wQixNQUFNLEVBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUMsR0FBRyxVQUFVLENBQUM7UUFDcEQsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNkLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1NBQ3pDO1FBQ0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN4QyxNQUFNLE1BQU0sR0FBRyxDQUFDLEVBQUUsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDMUMsTUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLENBQUM7WUFDNUIsZUFBZSxDQUFDLENBQUM7WUFDakIsOENBQThDLENBQUM7UUFFbkQsSUFBSSxDQUFDLFFBQVEsR0FBRzs7Ozs7a0NBS2MsVUFBVTs7Ozs7OEJBS2QsVUFBVTt3QkFDaEIsWUFBWTs7MEJBRVYsTUFBTTs7Ozs7OztLQU8zQixDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2JhY2tlbmRfdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuXG5leHBvcnQgY2xhc3MgQXJnTWluTWF4UHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ0EnXTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcmVkdWNlSW5mbzogYmFja2VuZF91dGlsLlJlZHVjZUluZm8sIG9wOiAnbWF4J3wnbWluJyxcbiAgICAgIGZpcnN0UGFzczogYm9vbGVhbikge1xuICAgIGNvbnN0IHt3aW5kb3dTaXplLCBiYXRjaFNpemUsIG91dFNpemV9ID0gcmVkdWNlSW5mbztcbiAgICBpZiAoIWZpcnN0UGFzcykge1xuICAgICAgdGhpcy52YXJpYWJsZU5hbWVzLnB1c2goJ2Jlc3RJbmRpY2VzQScpO1xuICAgIH1cbiAgICB0aGlzLm91dHB1dFNoYXBlID0gW2JhdGNoU2l6ZSwgb3V0U2l6ZV07XG4gICAgY29uc3QgY29tcE9wID0gKG9wID09PSAnbWF4JykgPyAnPicgOiAnPCc7XG4gICAgY29uc3QgaW5kZXhTbmlwcGV0ID0gZmlyc3RQYXNzID9cbiAgICAgICAgJ2luT2Zmc2V0ICsgaTsnIDpcbiAgICAgICAgJ3JvdW5kKGdldEJlc3RJbmRpY2VzQShiYXRjaCwgaW5PZmZzZXQgKyBpKSk7JztcblxuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIGl2ZWMyIGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICBpbnQgYmF0Y2ggPSBjb29yZHNbMF07XG4gICAgICAgIGludCBvdXRJZHggPSBjb29yZHNbMV07XG4gICAgICAgIGludCBpbk9mZnNldCA9IG91dElkeCAqICR7d2luZG93U2l6ZX07XG5cbiAgICAgICAgaW50IGJlc3RJbmRleCA9IGluT2Zmc2V0O1xuICAgICAgICBmbG9hdCBiZXN0VmFsdWUgPSBnZXRBKGJhdGNoLCBiZXN0SW5kZXgpO1xuXG4gICAgICAgIGZvciAoaW50IGkgPSAwOyBpIDwgJHt3aW5kb3dTaXplfTsgaSsrKSB7XG4gICAgICAgICAgaW50IGluSWR4ID0gJHtpbmRleFNuaXBwZXR9O1xuICAgICAgICAgIGZsb2F0IGNhbmRpZGF0ZSA9IGdldEEoYmF0Y2gsIGluSWR4KTtcbiAgICAgICAgICBpZiAoY2FuZGlkYXRlICR7Y29tcE9wfSBiZXN0VmFsdWUpIHtcbiAgICAgICAgICAgIGJlc3RWYWx1ZSA9IGNhbmRpZGF0ZTtcbiAgICAgICAgICAgIGJlc3RJbmRleCA9IGluSWR4O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZXRPdXRwdXQoZmxvYXQoYmVzdEluZGV4KSk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuIl19