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
import { getCoordsDataType } from './shader_compiler';
export class MirrorPadProgram {
    constructor(xShape, paddings, mode) {
        this.variableNames = ['x'];
        this.outputShape = paddings.map((p, i) => p[0] /* beforePad */ + xShape[i] + p[1] /* afterPad */);
        const rank = xShape.length;
        const dtype = getCoordsDataType(rank);
        const start = paddings.map(p => p[0]).join(',');
        const end = paddings.map((p, i) => p[0] + xShape[i]).join(',');
        const unpackedCoords = ['coords[0]', 'coords[1]', 'coords[2]', 'coords[3]'].slice(0, rank);
        const offset = mode === 'reflect' ? 0 : 1;
        if (rank === 1) {
            this.userCode = `
        int start = ${start};
        int end = ${end};

        void main() {
          int outC = getOutputCoords();
          if (outC < start) {
            outC = start * 2 - outC - ${offset};
          } else if(outC >= end) {
            outC = (end - 1) * 2 - outC + ${offset};
          }
          setOutput(getX(outC - start));
        }
      `;
            return;
        }
        this.userCode = `
      ${dtype} start = ${dtype}(${start});
      ${dtype} end = ${dtype}(${end});

      void main() {
        ${dtype} outC = getOutputCoords();
        for (int i = 0; i < ${rank}; i++) {
          if (outC[i] < start[i]) {
            outC[i] = start[i] * 2 - outC[i] - ${offset};
          } else if(outC[i] >= end[i]) {
            outC[i] = (end[i] - 1) * 2 - outC[i] + ${offset};
          }
        }
        ${dtype} coords = outC - start;
        setOutput(getX(${unpackedCoords}));
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlycm9yX3BhZF9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL21pcnJvcl9wYWRfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUdILE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRXBELE1BQU0sT0FBTyxnQkFBZ0I7SUFLM0IsWUFDSSxNQUFnQixFQUFFLFFBQWlDLEVBQ25ELElBQTJCO1FBTi9CLGtCQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQU9wQixJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDM0IsTUFBTSxLQUFLLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdEMsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoRCxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvRCxNQUFNLGNBQWMsR0FDaEIsQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sTUFBTSxHQUFHLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTFDLElBQUksSUFBSSxLQUFLLENBQUMsRUFBRTtZQUNkLElBQUksQ0FBQyxRQUFRLEdBQUc7c0JBQ0EsS0FBSztvQkFDUCxHQUFHOzs7Ozt3Q0FLaUIsTUFBTTs7NENBRUYsTUFBTTs7OztPQUkzQyxDQUFDO1lBQ0YsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLFFBQVEsR0FBRztRQUNaLEtBQUssWUFBWSxLQUFLLElBQUksS0FBSztRQUMvQixLQUFLLFVBQVUsS0FBSyxJQUFJLEdBQUc7OztVQUd6QixLQUFLOzhCQUNlLElBQUk7O2lEQUVlLE1BQU07O3FEQUVGLE1BQU07OztVQUdqRCxLQUFLO3lCQUNVLGNBQWM7O0tBRWxDLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuaW1wb3J0IHtnZXRDb29yZHNEYXRhVHlwZX0gZnJvbSAnLi9zaGFkZXJfY29tcGlsZXInO1xuXG5leHBvcnQgY2xhc3MgTWlycm9yUGFkUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ3gnXTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgeFNoYXBlOiBudW1iZXJbXSwgcGFkZGluZ3M6IEFycmF5PFtudW1iZXIsIG51bWJlcl0+LFxuICAgICAgbW9kZTogJ3JlZmxlY3QnfCdzeW1tZXRyaWMnKSB7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IHBhZGRpbmdzLm1hcChcbiAgICAgICAgKHAsIGkpID0+IHBbMF0gLyogYmVmb3JlUGFkICovICsgeFNoYXBlW2ldICsgcFsxXSAvKiBhZnRlclBhZCAqLyk7XG4gICAgY29uc3QgcmFuayA9IHhTaGFwZS5sZW5ndGg7XG4gICAgY29uc3QgZHR5cGUgPSBnZXRDb29yZHNEYXRhVHlwZShyYW5rKTtcblxuICAgIGNvbnN0IHN0YXJ0ID0gcGFkZGluZ3MubWFwKHAgPT4gcFswXSkuam9pbignLCcpO1xuICAgIGNvbnN0IGVuZCA9IHBhZGRpbmdzLm1hcCgocCwgaSkgPT4gcFswXSArIHhTaGFwZVtpXSkuam9pbignLCcpO1xuICAgIGNvbnN0IHVucGFja2VkQ29vcmRzID1cbiAgICAgICAgWydjb29yZHNbMF0nLCAnY29vcmRzWzFdJywgJ2Nvb3Jkc1syXScsICdjb29yZHNbM10nXS5zbGljZSgwLCByYW5rKTtcbiAgICBjb25zdCBvZmZzZXQgPSBtb2RlID09PSAncmVmbGVjdCcgPyAwIDogMTtcblxuICAgIGlmIChyYW5rID09PSAxKSB7XG4gICAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgICBpbnQgc3RhcnQgPSAke3N0YXJ0fTtcbiAgICAgICAgaW50IGVuZCA9ICR7ZW5kfTtcblxuICAgICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgICAgaW50IG91dEMgPSBnZXRPdXRwdXRDb29yZHMoKTtcbiAgICAgICAgICBpZiAob3V0QyA8IHN0YXJ0KSB7XG4gICAgICAgICAgICBvdXRDID0gc3RhcnQgKiAyIC0gb3V0QyAtICR7b2Zmc2V0fTtcbiAgICAgICAgICB9IGVsc2UgaWYob3V0QyA+PSBlbmQpIHtcbiAgICAgICAgICAgIG91dEMgPSAoZW5kIC0gMSkgKiAyIC0gb3V0QyArICR7b2Zmc2V0fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0T3V0cHV0KGdldFgob3V0QyAtIHN0YXJ0KSk7XG4gICAgICAgIH1cbiAgICAgIGA7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICAke2R0eXBlfSBzdGFydCA9ICR7ZHR5cGV9KCR7c3RhcnR9KTtcbiAgICAgICR7ZHR5cGV9IGVuZCA9ICR7ZHR5cGV9KCR7ZW5kfSk7XG5cbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgJHtkdHlwZX0gb3V0QyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICBmb3IgKGludCBpID0gMDsgaSA8ICR7cmFua307IGkrKykge1xuICAgICAgICAgIGlmIChvdXRDW2ldIDwgc3RhcnRbaV0pIHtcbiAgICAgICAgICAgIG91dENbaV0gPSBzdGFydFtpXSAqIDIgLSBvdXRDW2ldIC0gJHtvZmZzZXR9O1xuICAgICAgICAgIH0gZWxzZSBpZihvdXRDW2ldID49IGVuZFtpXSkge1xuICAgICAgICAgICAgb3V0Q1tpXSA9IChlbmRbaV0gLSAxKSAqIDIgLSBvdXRDW2ldICsgJHtvZmZzZXR9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAke2R0eXBlfSBjb29yZHMgPSBvdXRDIC0gc3RhcnQ7XG4gICAgICAgIHNldE91dHB1dChnZXRYKCR7dW5wYWNrZWRDb29yZHN9KSk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuIl19