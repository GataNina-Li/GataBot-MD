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
export class TileProgram {
    constructor(aShape, reps) {
        this.variableNames = ['A'];
        const outputShape = new Array(aShape.length);
        for (let i = 0; i < outputShape.length; i++) {
            outputShape[i] = aShape[i] * reps[i];
        }
        this.outputShape = outputShape;
        this.rank = outputShape.length;
        const dtype = getCoordsDataType(this.rank);
        const sourceCoords = getSourceCoords(aShape);
        this.userCode = `
      void main() {
        ${dtype} resRC = getOutputCoords();
        setOutput(getA(${sourceCoords}));
      }
    `;
    }
}
function getSourceCoords(aShape) {
    const rank = aShape.length;
    if (rank > 5) {
        throw Error(`Tile for rank ${rank} is not yet supported`);
    }
    if (rank === 1) {
        return `imod(resRC, ${aShape[0]})`;
    }
    const currentCoords = ['resRC.x', 'resRC.y', 'resRC.z', 'resRC.w', 'resRC.u'];
    const sourceCoords = [];
    for (let i = 0; i < aShape.length; i++) {
        sourceCoords.push(`imod(${currentCoords[i]}, ${aShape[i]})`);
    }
    return sourceCoords.join();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlsZV9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL3RpbGVfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUdILE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRXBELE1BQU0sT0FBTyxXQUFXO0lBTXRCLFlBQVksTUFBZ0IsRUFBRSxJQUFjO1FBTDVDLGtCQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQU1wQixNQUFNLFdBQVcsR0FBYSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDM0MsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdEM7UUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFDL0IsTUFBTSxLQUFLLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLE1BQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsUUFBUSxHQUFHOztVQUVWLEtBQUs7eUJBQ1UsWUFBWTs7S0FFaEMsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQUVELFNBQVMsZUFBZSxDQUFDLE1BQWdCO0lBQ3ZDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDM0IsSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFO1FBQ1osTUFBTSxLQUFLLENBQUMsaUJBQWlCLElBQUksdUJBQXVCLENBQUMsQ0FBQztLQUMzRDtJQUNELElBQUksSUFBSSxLQUFLLENBQUMsRUFBRTtRQUNkLE9BQU8sZUFBZSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztLQUNwQztJQUVELE1BQU0sYUFBYSxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRTlFLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztJQUN4QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN0QyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsYUFBYSxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDOUQ7SUFDRCxPQUFPLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM3QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0dQR1BVUHJvZ3JhbX0gZnJvbSAnLi9ncGdwdV9tYXRoJztcbmltcG9ydCB7Z2V0Q29vcmRzRGF0YVR5cGV9IGZyb20gJy4vc2hhZGVyX2NvbXBpbGVyJztcblxuZXhwb3J0IGNsYXNzIFRpbGVQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsnQSddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG4gIHJhbms6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihhU2hhcGU6IG51bWJlcltdLCByZXBzOiBudW1iZXJbXSkge1xuICAgIGNvbnN0IG91dHB1dFNoYXBlOiBudW1iZXJbXSA9IG5ldyBBcnJheShhU2hhcGUubGVuZ3RoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dHB1dFNoYXBlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvdXRwdXRTaGFwZVtpXSA9IGFTaGFwZVtpXSAqIHJlcHNbaV07XG4gICAgfVxuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBvdXRwdXRTaGFwZTtcbiAgICB0aGlzLnJhbmsgPSBvdXRwdXRTaGFwZS5sZW5ndGg7XG4gICAgY29uc3QgZHR5cGUgPSBnZXRDb29yZHNEYXRhVHlwZSh0aGlzLnJhbmspO1xuICAgIGNvbnN0IHNvdXJjZUNvb3JkcyA9IGdldFNvdXJjZUNvb3JkcyhhU2hhcGUpO1xuXG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgJHtkdHlwZX0gcmVzUkMgPSBnZXRPdXRwdXRDb29yZHMoKTtcbiAgICAgICAgc2V0T3V0cHV0KGdldEEoJHtzb3VyY2VDb29yZHN9KSk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRTb3VyY2VDb29yZHMoYVNoYXBlOiBudW1iZXJbXSk6IHN0cmluZyB7XG4gIGNvbnN0IHJhbmsgPSBhU2hhcGUubGVuZ3RoO1xuICBpZiAocmFuayA+IDUpIHtcbiAgICB0aHJvdyBFcnJvcihgVGlsZSBmb3IgcmFuayAke3Jhbmt9IGlzIG5vdCB5ZXQgc3VwcG9ydGVkYCk7XG4gIH1cbiAgaWYgKHJhbmsgPT09IDEpIHtcbiAgICByZXR1cm4gYGltb2QocmVzUkMsICR7YVNoYXBlWzBdfSlgO1xuICB9XG5cbiAgY29uc3QgY3VycmVudENvb3JkcyA9IFsncmVzUkMueCcsICdyZXNSQy55JywgJ3Jlc1JDLnonLCAncmVzUkMudycsICdyZXNSQy51J107XG5cbiAgY29uc3Qgc291cmNlQ29vcmRzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYVNoYXBlLmxlbmd0aDsgaSsrKSB7XG4gICAgc291cmNlQ29vcmRzLnB1c2goYGltb2QoJHtjdXJyZW50Q29vcmRzW2ldfSwgJHthU2hhcGVbaV19KWApO1xuICB9XG4gIHJldHVybiBzb3VyY2VDb29yZHMuam9pbigpO1xufVxuIl19