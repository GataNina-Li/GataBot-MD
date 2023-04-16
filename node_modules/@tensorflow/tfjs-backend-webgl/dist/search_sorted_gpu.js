/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
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
import { env } from '@tensorflow/tfjs-core';
export class SearchSortedProgram {
    constructor(batchSize, numInputs, numValues, side) {
        this.variableNames = ['sortedSequence', 'values'];
        this.customUniforms = [{ name: 'numInputs', type: 'int' }];
        this.outputShape = [batchSize, numValues];
        const webGL2LoopHead = 'while (left < right) {';
        // WebGL1 doesn't accept non constant loop conditions, so upper bound loop
        // iterations.
        const webGL1LoopHead = `for (int i = 0; i < ${Math.ceil(Math.log2(numInputs + 1))}; ++i) { if (left >= right) break;`;
        const loopHead = env().getNumber('WEBGL_VERSION') === 2 ? webGL2LoopHead :
            webGL1LoopHead;
        // left corresponds to lower bound and right to upper bound.
        const boundComparator = side === 'left' ? '<' : '<=';
        this.userCode = `
       int findBound(int batch, float value) {
         int left = 0;
         int right = numInputs;
         int mid;
         ${loopHead}
           mid = (left + right) / 2;
           if (getSortedSequence(batch, mid) ${boundComparator} value) {
             left = mid + 1;
           } else {
             right = mid;
           }
         }
         return right;
       }

       void main() {
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int valueIndex = coords[1];

         float value = getValues(batch, valueIndex);

         setOutput(float(findBound(batch, value)));
       }
     `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoX3NvcnRlZF9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL3NlYXJjaF9zb3J0ZWRfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUkxQyxNQUFNLE9BQU8sbUJBQW1CO0lBTTlCLFlBQ0ksU0FBaUIsRUFBRSxTQUFpQixFQUFFLFNBQWlCLEVBQ3ZELElBQW9CO1FBUHhCLGtCQUFhLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUc3QyxtQkFBYyxHQUFHLENBQUMsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxLQUFvQixFQUFDLENBQUMsQ0FBQztRQUtqRSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRTFDLE1BQU0sY0FBYyxHQUFHLHdCQUF3QixDQUFDO1FBQ2hELDBFQUEwRTtRQUMxRSxjQUFjO1FBQ2QsTUFBTSxjQUFjLEdBQUcsdUJBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsb0NBQW9DLENBQUM7UUFDNUUsTUFBTSxRQUFRLEdBQUcsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDaEIsY0FBYyxDQUFDO1FBRXpFLDREQUE0RDtRQUM1RCxNQUFNLGVBQWUsR0FBRyxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNyRCxJQUFJLENBQUMsUUFBUSxHQUFHOzs7OztXQUtULFFBQVE7OytDQUU0QixlQUFlOzs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFrQnhELENBQUM7SUFDTCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7ZW52fSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0IHtHUEdQVVByb2dyYW19IGZyb20gJy4vZ3BncHVfbWF0aCc7XG5pbXBvcnQge1VuaWZvcm1UeXBlfSBmcm9tICcuL3NoYWRlcl9jb21waWxlcic7XG5cbmV4cG9ydCBjbGFzcyBTZWFyY2hTb3J0ZWRQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsnc29ydGVkU2VxdWVuY2UnLCAndmFsdWVzJ107XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXTtcbiAgdXNlckNvZGU6IHN0cmluZztcbiAgY3VzdG9tVW5pZm9ybXMgPSBbe25hbWU6ICdudW1JbnB1dHMnLCB0eXBlOiAnaW50JyBhcyBVbmlmb3JtVHlwZX1dO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgYmF0Y2hTaXplOiBudW1iZXIsIG51bUlucHV0czogbnVtYmVyLCBudW1WYWx1ZXM6IG51bWJlcixcbiAgICAgIHNpZGU6ICdsZWZ0J3wncmlnaHQnKSB7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IFtiYXRjaFNpemUsIG51bVZhbHVlc107XG5cbiAgICBjb25zdCB3ZWJHTDJMb29wSGVhZCA9ICd3aGlsZSAobGVmdCA8IHJpZ2h0KSB7JztcbiAgICAvLyBXZWJHTDEgZG9lc24ndCBhY2NlcHQgbm9uIGNvbnN0YW50IGxvb3AgY29uZGl0aW9ucywgc28gdXBwZXIgYm91bmQgbG9vcFxuICAgIC8vIGl0ZXJhdGlvbnMuXG4gICAgY29uc3Qgd2ViR0wxTG9vcEhlYWQgPSBgZm9yIChpbnQgaSA9IDA7IGkgPCAke1xuICAgICAgICBNYXRoLmNlaWwoTWF0aC5sb2cyKG51bUlucHV0cyArIDEpKX07ICsraSkgeyBpZiAobGVmdCA+PSByaWdodCkgYnJlYWs7YDtcbiAgICBjb25zdCBsb29wSGVhZCA9IGVudigpLmdldE51bWJlcignV0VCR0xfVkVSU0lPTicpID09PSAyID8gd2ViR0wyTG9vcEhlYWQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3ZWJHTDFMb29wSGVhZDtcblxuICAgIC8vIGxlZnQgY29ycmVzcG9uZHMgdG8gbG93ZXIgYm91bmQgYW5kIHJpZ2h0IHRvIHVwcGVyIGJvdW5kLlxuICAgIGNvbnN0IGJvdW5kQ29tcGFyYXRvciA9IHNpZGUgPT09ICdsZWZ0JyA/ICc8JyA6ICc8PSc7XG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgICBpbnQgZmluZEJvdW5kKGludCBiYXRjaCwgZmxvYXQgdmFsdWUpIHtcbiAgICAgICAgIGludCBsZWZ0ID0gMDtcbiAgICAgICAgIGludCByaWdodCA9IG51bUlucHV0cztcbiAgICAgICAgIGludCBtaWQ7XG4gICAgICAgICAke2xvb3BIZWFkfVxuICAgICAgICAgICBtaWQgPSAobGVmdCArIHJpZ2h0KSAvIDI7XG4gICAgICAgICAgIGlmIChnZXRTb3J0ZWRTZXF1ZW5jZShiYXRjaCwgbWlkKSAke2JvdW5kQ29tcGFyYXRvcn0gdmFsdWUpIHtcbiAgICAgICAgICAgICBsZWZ0ID0gbWlkICsgMTtcbiAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICByaWdodCA9IG1pZDtcbiAgICAgICAgICAgfVxuICAgICAgICAgfVxuICAgICAgICAgcmV0dXJuIHJpZ2h0O1xuICAgICAgIH1cblxuICAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgIGl2ZWMyIGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICAgaW50IGJhdGNoID0gY29vcmRzWzBdO1xuICAgICAgICAgaW50IHZhbHVlSW5kZXggPSBjb29yZHNbMV07XG5cbiAgICAgICAgIGZsb2F0IHZhbHVlID0gZ2V0VmFsdWVzKGJhdGNoLCB2YWx1ZUluZGV4KTtcblxuICAgICAgICAgc2V0T3V0cHV0KGZsb2F0KGZpbmRCb3VuZChiYXRjaCwgdmFsdWUpKSk7XG4gICAgICAgfVxuICAgICBgO1xuICB9XG59XG4iXX0=