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
export class StridedSliceProgram {
    constructor(begin, strides, size) {
        this.variableNames = ['x'];
        this.outputShape = size;
        const rank = size.length;
        const inputDtype = getCoordsDataType(size.length);
        const dtype = getCoordsDataType(size.length);
        let newCoords = '';
        if (rank === 1) {
            newCoords = 'coords * strides + begin';
        }
        else {
            let outputAxis = 0;
            newCoords =
                size.map((_, i) => {
                    outputAxis++;
                    return size.length === 1 ?
                        `coords * strides[${i}] + begin[${i}]` :
                        `coords[${outputAxis - 1}] * strides[${i}] + begin[${i}]`;
                })
                    .join(',');
        }
        this.userCode = `
      ${inputDtype} begin = ${inputDtype}(${begin});
      ${inputDtype} strides = ${inputDtype}(${strides});

      void main() {
        ${dtype} coords = getOutputCoords();
        setOutput(getX(${newCoords}));
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaWRlZF9zbGljZV9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL3N0cmlkZWRfc2xpY2VfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUdILE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRXBELE1BQU0sT0FBTyxtQkFBbUI7SUFLOUIsWUFBWSxLQUFlLEVBQUUsT0FBaUIsRUFBRSxJQUFjO1FBSjlELGtCQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUtwQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUN4QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3pCLE1BQU0sVUFBVSxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRCxNQUFNLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFN0MsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksSUFBSSxLQUFLLENBQUMsRUFBRTtZQUNkLFNBQVMsR0FBRywwQkFBMEIsQ0FBQztTQUN4QzthQUFNO1lBQ0wsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1lBQ25CLFNBQVM7Z0JBQ0wsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDWixVQUFVLEVBQUUsQ0FBQztvQkFDYixPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQ3RCLG9CQUFvQixDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDeEMsVUFBVSxVQUFVLEdBQUcsQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQztnQkFDaEUsQ0FBQyxDQUFDO3FCQUNELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNwQjtRQUVELElBQUksQ0FBQyxRQUFRLEdBQUc7UUFDWixVQUFVLFlBQVksVUFBVSxJQUFJLEtBQUs7UUFDekMsVUFBVSxjQUFjLFVBQVUsSUFBSSxPQUFPOzs7VUFHM0MsS0FBSzt5QkFDVSxTQUFTOztLQUU3QixDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0dQR1BVUHJvZ3JhbX0gZnJvbSAnLi9ncGdwdV9tYXRoJztcbmltcG9ydCB7Z2V0Q29vcmRzRGF0YVR5cGV9IGZyb20gJy4vc2hhZGVyX2NvbXBpbGVyJztcblxuZXhwb3J0IGNsYXNzIFN0cmlkZWRTbGljZVByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWyd4J107XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXTtcbiAgdXNlckNvZGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihiZWdpbjogbnVtYmVyW10sIHN0cmlkZXM6IG51bWJlcltdLCBzaXplOiBudW1iZXJbXSkge1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBzaXplO1xuICAgIGNvbnN0IHJhbmsgPSBzaXplLmxlbmd0aDtcbiAgICBjb25zdCBpbnB1dER0eXBlID0gZ2V0Q29vcmRzRGF0YVR5cGUoc2l6ZS5sZW5ndGgpO1xuICAgIGNvbnN0IGR0eXBlID0gZ2V0Q29vcmRzRGF0YVR5cGUoc2l6ZS5sZW5ndGgpO1xuXG4gICAgbGV0IG5ld0Nvb3JkcyA9ICcnO1xuICAgIGlmIChyYW5rID09PSAxKSB7XG4gICAgICBuZXdDb29yZHMgPSAnY29vcmRzICogc3RyaWRlcyArIGJlZ2luJztcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG91dHB1dEF4aXMgPSAwO1xuICAgICAgbmV3Q29vcmRzID1cbiAgICAgICAgICBzaXplLm1hcCgoXywgaSkgPT4ge1xuICAgICAgICAgICAgICAgIG91dHB1dEF4aXMrKztcbiAgICAgICAgICAgICAgICByZXR1cm4gc2l6ZS5sZW5ndGggPT09IDEgP1xuICAgICAgICAgICAgICAgICAgICBgY29vcmRzICogc3RyaWRlc1ske2l9XSArIGJlZ2luWyR7aX1dYCA6XG4gICAgICAgICAgICAgICAgICAgIGBjb29yZHNbJHtvdXRwdXRBeGlzIC0gMX1dICogc3RyaWRlc1ske2l9XSArIGJlZ2luWyR7aX1dYDtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmpvaW4oJywnKTtcbiAgICB9XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgJHtpbnB1dER0eXBlfSBiZWdpbiA9ICR7aW5wdXREdHlwZX0oJHtiZWdpbn0pO1xuICAgICAgJHtpbnB1dER0eXBlfSBzdHJpZGVzID0gJHtpbnB1dER0eXBlfSgke3N0cmlkZXN9KTtcblxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICAke2R0eXBlfSBjb29yZHMgPSBnZXRPdXRwdXRDb29yZHMoKTtcbiAgICAgICAgc2V0T3V0cHV0KGdldFgoJHtuZXdDb29yZHN9KSk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuIl19