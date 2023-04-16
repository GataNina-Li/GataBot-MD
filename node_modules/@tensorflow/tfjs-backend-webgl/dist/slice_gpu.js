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
import { getCoordsDataType } from './shader_compiler';
export class SliceProgram {
    constructor(destSize) {
        this.variableNames = ['source'];
        this.outputShape = destSize;
        this.rank = destSize.length;
        const dtype = getCoordsDataType(this.rank);
        this.customUniforms = [{ name: 'start', arrayIndex: this.rank, type: 'int' }];
        const sourceCoords = getCoords(this.rank);
        let body;
        const coordSum = destSize.map((_, i) => {
            return `sourceLoc.${coords[i]} = start[${i}] + coords.${coords[i]};`;
        });
        body = `
        ${dtype} sourceLoc;
        ${dtype} coords = getOutputCoords();
        ${coordSum.join('\n')}
      `;
        this.userCode = `
      void main() {
        ${body}
        setOutput(getSource(${sourceCoords}));
      }
    `;
    }
}
const coords = ['x', 'y', 'z', 'w', 'u', 'v'];
function getCoords(rank) {
    if (rank === 1) {
        return 'sourceLoc';
    }
    else if (rank <= 6) {
        return coords.slice(0, rank).map(x => 'sourceLoc.' + x).join(',');
    }
    else {
        throw Error(`Slicing for rank ${rank} is not yet supported`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2VfZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9zbGljZV9ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBR0gsT0FBTyxFQUFDLGlCQUFpQixFQUFjLE1BQU0sbUJBQW1CLENBQUM7QUFFakUsTUFBTSxPQUFPLFlBQVk7SUFPdkIsWUFBWSxRQUFrQjtRQU45QixrQkFBYSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFPekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7UUFDNUIsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBRTVCLE1BQU0sS0FBSyxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBQzVFLE1BQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFMUMsSUFBSSxJQUFZLENBQUM7UUFDakIsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyQyxPQUFPLGFBQWEsTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsY0FBYyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUN2RSxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksR0FBRztVQUNELEtBQUs7VUFDTCxLQUFLO1VBQ0wsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7T0FDdEIsQ0FBQztRQUNKLElBQUksQ0FBQyxRQUFRLEdBQUc7O1VBRVYsSUFBSTs4QkFDZ0IsWUFBWTs7S0FFckMsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQUVELE1BQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUU5QyxTQUFTLFNBQVMsQ0FBQyxJQUFZO0lBQzdCLElBQUksSUFBSSxLQUFLLENBQUMsRUFBRTtRQUNkLE9BQU8sV0FBVyxDQUFDO0tBQ3BCO1NBQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxFQUFFO1FBQ3BCLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNuRTtTQUFNO1FBQ0wsTUFBTSxLQUFLLENBQUMsb0JBQW9CLElBQUksdUJBQXVCLENBQUMsQ0FBQztLQUM5RDtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuaW1wb3J0IHtnZXRDb29yZHNEYXRhVHlwZSwgVW5pZm9ybVR5cGV9IGZyb20gJy4vc2hhZGVyX2NvbXBpbGVyJztcblxuZXhwb3J0IGNsYXNzIFNsaWNlUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ3NvdXJjZSddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG4gIHJhbms6IG51bWJlcjtcbiAgY3VzdG9tVW5pZm9ybXM6IEFycmF5PHtuYW1lOiBzdHJpbmc7IGFycmF5SW5kZXg6IG51bWJlcjsgdHlwZTogVW5pZm9ybVR5cGU7fT47XG5cbiAgY29uc3RydWN0b3IoZGVzdFNpemU6IG51bWJlcltdKSB7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IGRlc3RTaXplO1xuICAgIHRoaXMucmFuayA9IGRlc3RTaXplLmxlbmd0aDtcblxuICAgIGNvbnN0IGR0eXBlID0gZ2V0Q29vcmRzRGF0YVR5cGUodGhpcy5yYW5rKTtcbiAgICB0aGlzLmN1c3RvbVVuaWZvcm1zID0gW3tuYW1lOiAnc3RhcnQnLCBhcnJheUluZGV4OiB0aGlzLnJhbmssIHR5cGU6ICdpbnQnfV07XG4gICAgY29uc3Qgc291cmNlQ29vcmRzID0gZ2V0Q29vcmRzKHRoaXMucmFuayk7XG5cbiAgICBsZXQgYm9keTogc3RyaW5nO1xuICAgIGNvbnN0IGNvb3JkU3VtID0gZGVzdFNpemUubWFwKChfLCBpKSA9PiB7XG4gICAgICByZXR1cm4gYHNvdXJjZUxvYy4ke2Nvb3Jkc1tpXX0gPSBzdGFydFske2l9XSArIGNvb3Jkcy4ke2Nvb3Jkc1tpXX07YDtcbiAgICB9KTtcbiAgICBib2R5ID0gYFxuICAgICAgICAke2R0eXBlfSBzb3VyY2VMb2M7XG4gICAgICAgICR7ZHR5cGV9IGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICAke2Nvb3JkU3VtLmpvaW4oJ1xcbicpfVxuICAgICAgYDtcbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICAke2JvZHl9XG4gICAgICAgIHNldE91dHB1dChnZXRTb3VyY2UoJHtzb3VyY2VDb29yZHN9KSk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuXG5jb25zdCBjb29yZHMgPSBbJ3gnLCAneScsICd6JywgJ3cnLCAndScsICd2J107XG5cbmZ1bmN0aW9uIGdldENvb3JkcyhyYW5rOiBudW1iZXIpOiBzdHJpbmcge1xuICBpZiAocmFuayA9PT0gMSkge1xuICAgIHJldHVybiAnc291cmNlTG9jJztcbiAgfSBlbHNlIGlmIChyYW5rIDw9IDYpIHtcbiAgICByZXR1cm4gY29vcmRzLnNsaWNlKDAsIHJhbmspLm1hcCh4ID0+ICdzb3VyY2VMb2MuJyArIHgpLmpvaW4oJywnKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBFcnJvcihgU2xpY2luZyBmb3IgcmFuayAke3Jhbmt9IGlzIG5vdCB5ZXQgc3VwcG9ydGVkYCk7XG4gIH1cbn1cbiJdfQ==