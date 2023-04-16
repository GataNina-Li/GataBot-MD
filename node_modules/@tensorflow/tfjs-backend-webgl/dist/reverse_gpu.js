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
export class ReverseProgram {
    constructor(xShape, axis) {
        this.variableNames = ['x'];
        const rank = xShape.length;
        if (rank > 4) {
            throw new Error(`WebGL backend: Reverse of rank-${rank} tensor is not yet supported`);
        }
        this.outputShape = xShape;
        if (rank === 1) {
            this.userCode = `
        void main() {
          int coord = getOutputCoords();
          setOutput(getX(${xShape[0]} - coord - 1));
        }
      `;
            return;
        }
        const getInCoord = (i) => {
            if (axis.indexOf(i) !== -1 && xShape[i] !== 1) {
                return `${xShape[i]} - coords[${i}] - 1`;
            }
            return `coords[${i}]`;
        };
        const inCoords = xShape.map((_, i) => getInCoord(i)).join(',');
        const type = getCoordsDataType(rank);
        this.userCode = `
      void main() {
        ${type} coords = getOutputCoords();
        setOutput(getX(${inCoords}));
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV2ZXJzZV9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL3JldmVyc2VfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUdILE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRXBELE1BQU0sT0FBTyxjQUFjO0lBS3pCLFlBQVksTUFBZ0IsRUFBRSxJQUFjO1FBSjVDLGtCQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUtwQixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtZQUNaLE1BQU0sSUFBSSxLQUFLLENBQ1gsa0NBQWtDLElBQUksOEJBQThCLENBQUMsQ0FBQztTQUMzRTtRQUNELElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1FBRTFCLElBQUksSUFBSSxLQUFLLENBQUMsRUFBRTtZQUNkLElBQUksQ0FBQyxRQUFRLEdBQUc7OzsyQkFHSyxNQUFNLENBQUMsQ0FBQyxDQUFDOztPQUU3QixDQUFDO1lBQ0YsT0FBTztTQUNSO1FBQ0QsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFTLEVBQUUsRUFBRTtZQUMvQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDN0MsT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQzthQUMxQztZQUNELE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQztRQUN4QixDQUFDLENBQUM7UUFDRixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sSUFBSSxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXJDLElBQUksQ0FBQyxRQUFRLEdBQUc7O1VBRVYsSUFBSTt5QkFDVyxRQUFROztLQUU1QixDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0dQR1BVUHJvZ3JhbX0gZnJvbSAnLi9ncGdwdV9tYXRoJztcbmltcG9ydCB7Z2V0Q29vcmRzRGF0YVR5cGV9IGZyb20gJy4vc2hhZGVyX2NvbXBpbGVyJztcblxuZXhwb3J0IGNsYXNzIFJldmVyc2VQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsneCddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoeFNoYXBlOiBudW1iZXJbXSwgYXhpczogbnVtYmVyW10pIHtcbiAgICBjb25zdCByYW5rID0geFNoYXBlLmxlbmd0aDtcbiAgICBpZiAocmFuayA+IDQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgV2ViR0wgYmFja2VuZDogUmV2ZXJzZSBvZiByYW5rLSR7cmFua30gdGVuc29yIGlzIG5vdCB5ZXQgc3VwcG9ydGVkYCk7XG4gICAgfVxuICAgIHRoaXMub3V0cHV0U2hhcGUgPSB4U2hhcGU7XG5cbiAgICBpZiAocmFuayA9PT0gMSkge1xuICAgICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICAgIGludCBjb29yZCA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICAgIHNldE91dHB1dChnZXRYKCR7eFNoYXBlWzBdfSAtIGNvb3JkIC0gMSkpO1xuICAgICAgICB9XG4gICAgICBgO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBnZXRJbkNvb3JkID0gKGk6IG51bWJlcikgPT4ge1xuICAgICAgaWYgKGF4aXMuaW5kZXhPZihpKSAhPT0gLTEgJiYgeFNoYXBlW2ldICE9PSAxKSB7XG4gICAgICAgIHJldHVybiBgJHt4U2hhcGVbaV19IC0gY29vcmRzWyR7aX1dIC0gMWA7XG4gICAgICB9XG4gICAgICByZXR1cm4gYGNvb3Jkc1ske2l9XWA7XG4gICAgfTtcbiAgICBjb25zdCBpbkNvb3JkcyA9IHhTaGFwZS5tYXAoKF8sIGkpID0+IGdldEluQ29vcmQoaSkpLmpvaW4oJywnKTtcbiAgICBjb25zdCB0eXBlID0gZ2V0Q29vcmRzRGF0YVR5cGUocmFuayk7XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICAke3R5cGV9IGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICBzZXRPdXRwdXQoZ2V0WCgke2luQ29vcmRzfSkpO1xuICAgICAgfVxuICAgIGA7XG4gIH1cbn1cbiJdfQ==