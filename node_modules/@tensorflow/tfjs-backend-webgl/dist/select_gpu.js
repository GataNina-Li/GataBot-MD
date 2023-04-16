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
export class SelectProgram {
    constructor(cRank, shape, rank) {
        this.variableNames = ['c', 'a', 'b'];
        this.outputShape = shape;
        let cCoords;
        let abCoords;
        if (rank > 4) {
            throw Error(`Where for rank ${rank} is not yet supported`);
        }
        if (rank === 1) {
            abCoords = `resRC`;
            cCoords = `resRC`;
        }
        else {
            const currentCoords = ['resRC.x', 'resRC.y', 'resRC.z', 'resRC.w'];
            const cCoordVars = [];
            const abCoordVars = [];
            for (let i = 0; i < shape.length; i++) {
                abCoordVars.push(`${currentCoords[i]}`);
                if (i < cRank) {
                    cCoordVars.push(`${currentCoords[i]}`);
                }
            }
            cCoords = cCoordVars.join();
            abCoords = abCoordVars.join();
        }
        const dtype = getCoordsDataType(rank);
        this.userCode = `
      void main() {
        ${dtype} resRC = getOutputCoords();
        float cVal = getC(${cCoords});
        if (cVal >= 1.0) {
          setOutput(getA(${abCoords}));
        } else {
          setOutput(getB(${abCoords}));
        }
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0X2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvc2VsZWN0X2dwdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFHSCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUVwRCxNQUFNLE9BQU8sYUFBYTtJQUt4QixZQUFZLEtBQWEsRUFBRSxLQUFlLEVBQUUsSUFBWTtRQUp4RCxrQkFBYSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUs5QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUV6QixJQUFJLE9BQU8sQ0FBQztRQUNaLElBQUksUUFBUSxDQUFDO1FBQ2IsSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFO1lBQ1osTUFBTSxLQUFLLENBQUMsa0JBQWtCLElBQUksdUJBQXVCLENBQUMsQ0FBQztTQUM1RDtRQUVELElBQUksSUFBSSxLQUFLLENBQUMsRUFBRTtZQUNkLFFBQVEsR0FBRyxPQUFPLENBQUM7WUFDbkIsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUNuQjthQUFNO1lBQ0wsTUFBTSxhQUFhLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNuRSxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7WUFDdEIsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDO1lBQ3ZCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNyQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDeEMsSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFFO29CQUNiLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2lCQUN4QzthQUNGO1lBQ0QsT0FBTyxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM1QixRQUFRLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQy9CO1FBRUQsTUFBTSxLQUFLLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdEMsSUFBSSxDQUFDLFFBQVEsR0FBRzs7VUFFVixLQUFLOzRCQUNhLE9BQU87OzJCQUVSLFFBQVE7OzJCQUVSLFFBQVE7OztLQUc5QixDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0dQR1BVUHJvZ3JhbX0gZnJvbSAnLi9ncGdwdV9tYXRoJztcbmltcG9ydCB7Z2V0Q29vcmRzRGF0YVR5cGV9IGZyb20gJy4vc2hhZGVyX2NvbXBpbGVyJztcblxuZXhwb3J0IGNsYXNzIFNlbGVjdFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWydjJywgJ2EnLCAnYiddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoY1Jhbms6IG51bWJlciwgc2hhcGU6IG51bWJlcltdLCByYW5rOiBudW1iZXIpIHtcbiAgICB0aGlzLm91dHB1dFNoYXBlID0gc2hhcGU7XG5cbiAgICBsZXQgY0Nvb3JkcztcbiAgICBsZXQgYWJDb29yZHM7XG4gICAgaWYgKHJhbmsgPiA0KSB7XG4gICAgICB0aHJvdyBFcnJvcihgV2hlcmUgZm9yIHJhbmsgJHtyYW5rfSBpcyBub3QgeWV0IHN1cHBvcnRlZGApO1xuICAgIH1cblxuICAgIGlmIChyYW5rID09PSAxKSB7XG4gICAgICBhYkNvb3JkcyA9IGByZXNSQ2A7XG4gICAgICBjQ29vcmRzID0gYHJlc1JDYDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY3VycmVudENvb3JkcyA9IFsncmVzUkMueCcsICdyZXNSQy55JywgJ3Jlc1JDLnonLCAncmVzUkMudyddO1xuICAgICAgY29uc3QgY0Nvb3JkVmFycyA9IFtdO1xuICAgICAgY29uc3QgYWJDb29yZFZhcnMgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hhcGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYWJDb29yZFZhcnMucHVzaChgJHtjdXJyZW50Q29vcmRzW2ldfWApO1xuICAgICAgICBpZiAoaSA8IGNSYW5rKSB7XG4gICAgICAgICAgY0Nvb3JkVmFycy5wdXNoKGAke2N1cnJlbnRDb29yZHNbaV19YCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNDb29yZHMgPSBjQ29vcmRWYXJzLmpvaW4oKTtcbiAgICAgIGFiQ29vcmRzID0gYWJDb29yZFZhcnMuam9pbigpO1xuICAgIH1cblxuICAgIGNvbnN0IGR0eXBlID0gZ2V0Q29vcmRzRGF0YVR5cGUocmFuayk7XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICAke2R0eXBlfSByZXNSQyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICBmbG9hdCBjVmFsID0gZ2V0Qygke2NDb29yZHN9KTtcbiAgICAgICAgaWYgKGNWYWwgPj0gMS4wKSB7XG4gICAgICAgICAgc2V0T3V0cHV0KGdldEEoJHthYkNvb3Jkc30pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXRPdXRwdXQoZ2V0Qigke2FiQ29vcmRzfSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuIl19