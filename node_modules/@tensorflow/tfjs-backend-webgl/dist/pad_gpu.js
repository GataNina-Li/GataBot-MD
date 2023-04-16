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
export class PadProgram {
    constructor(xShape, paddings, constantValue) {
        this.variableNames = ['x'];
        this.customUniforms = [{ name: 'value', type: 'float' }];
        this.outputShape = paddings.map((p, i) => p[0] /* beforePad */ + xShape[i] + p[1] /* afterPad */);
        const rank = xShape.length;
        const type = getCoordsDataType(rank);
        const start = paddings.map(p => p[0]).join(',');
        const end = paddings.map((p, i) => p[0] + xShape[i]).join(',');
        const unpackedCoords = ['coords[0]', 'coords[1]', 'coords[2]', 'coords[3]'].slice(0, rank);
        if (rank === 1) {
            this.userCode = `
        int start = ${start};
        int end = ${end};

        void main() {
          int outC = getOutputCoords();
          if (outC < start || outC >= end) {
            setOutput(value);
          } else {
            setOutput(getX(outC - start));
          }
        }
      `;
            return;
        }
        this.userCode = `
      ${type} start = ${type}(${start});
      ${type} end = ${type}(${end});

      void main() {
        ${type} outC = getOutputCoords();
        if (any(lessThan(outC, start)) || any(greaterThanEqual(outC, end))) {
          setOutput(value);
        } else {
          ${type} coords = outC - start;
          setOutput(getX(${unpackedCoords}));
        }
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFkX2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvcGFkX2dwdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFHSCxPQUFPLEVBQUMsaUJBQWlCLEVBQWMsTUFBTSxtQkFBbUIsQ0FBQztBQUVqRSxNQUFNLE9BQU8sVUFBVTtJQU1yQixZQUNJLE1BQWdCLEVBQUUsUUFBaUMsRUFDbkQsYUFBcUI7UUFQekIsa0JBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBR3RCLG1CQUFjLEdBQUcsQ0FBQyxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQXNCLEVBQUMsQ0FBQyxDQUFDO1FBSy9ELElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdEUsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUMzQixNQUFNLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyQyxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sY0FBYyxHQUNoQixDQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFeEUsSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFO1lBQ2QsSUFBSSxDQUFDLFFBQVEsR0FBRztzQkFDQSxLQUFLO29CQUNQLEdBQUc7Ozs7Ozs7Ozs7T0FVaEIsQ0FBQztZQUNGLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxRQUFRLEdBQUc7UUFDWixJQUFJLFlBQVksSUFBSSxJQUFJLEtBQUs7UUFDN0IsSUFBSSxVQUFVLElBQUksSUFBSSxHQUFHOzs7VUFHdkIsSUFBSTs7OztZQUlGLElBQUk7MkJBQ1csY0FBYzs7O0tBR3BDLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuaW1wb3J0IHtnZXRDb29yZHNEYXRhVHlwZSwgVW5pZm9ybVR5cGV9IGZyb20gJy4vc2hhZGVyX2NvbXBpbGVyJztcblxuZXhwb3J0IGNsYXNzIFBhZFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWyd4J107XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXTtcbiAgdXNlckNvZGU6IHN0cmluZztcbiAgY3VzdG9tVW5pZm9ybXMgPSBbe25hbWU6ICd2YWx1ZScsIHR5cGU6ICdmbG9hdCcgYXMgVW5pZm9ybVR5cGV9XTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHhTaGFwZTogbnVtYmVyW10sIHBhZGRpbmdzOiBBcnJheTxbbnVtYmVyLCBudW1iZXJdPixcbiAgICAgIGNvbnN0YW50VmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBwYWRkaW5ncy5tYXAoXG4gICAgICAgIChwLCBpKSA9PiBwWzBdIC8qIGJlZm9yZVBhZCAqLyArIHhTaGFwZVtpXSArIHBbMV0gLyogYWZ0ZXJQYWQgKi8pO1xuICAgIGNvbnN0IHJhbmsgPSB4U2hhcGUubGVuZ3RoO1xuICAgIGNvbnN0IHR5cGUgPSBnZXRDb29yZHNEYXRhVHlwZShyYW5rKTtcblxuICAgIGNvbnN0IHN0YXJ0ID0gcGFkZGluZ3MubWFwKHAgPT4gcFswXSkuam9pbignLCcpO1xuICAgIGNvbnN0IGVuZCA9IHBhZGRpbmdzLm1hcCgocCwgaSkgPT4gcFswXSArIHhTaGFwZVtpXSkuam9pbignLCcpO1xuICAgIGNvbnN0IHVucGFja2VkQ29vcmRzID1cbiAgICAgICAgWydjb29yZHNbMF0nLCAnY29vcmRzWzFdJywgJ2Nvb3Jkc1syXScsICdjb29yZHNbM10nXS5zbGljZSgwLCByYW5rKTtcblxuICAgIGlmIChyYW5rID09PSAxKSB7XG4gICAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgICBpbnQgc3RhcnQgPSAke3N0YXJ0fTtcbiAgICAgICAgaW50IGVuZCA9ICR7ZW5kfTtcblxuICAgICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgICAgaW50IG91dEMgPSBnZXRPdXRwdXRDb29yZHMoKTtcbiAgICAgICAgICBpZiAob3V0QyA8IHN0YXJ0IHx8IG91dEMgPj0gZW5kKSB7XG4gICAgICAgICAgICBzZXRPdXRwdXQodmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRPdXRwdXQoZ2V0WChvdXRDIC0gc3RhcnQpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIGA7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICAke3R5cGV9IHN0YXJ0ID0gJHt0eXBlfSgke3N0YXJ0fSk7XG4gICAgICAke3R5cGV9IGVuZCA9ICR7dHlwZX0oJHtlbmR9KTtcblxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICAke3R5cGV9IG91dEMgPSBnZXRPdXRwdXRDb29yZHMoKTtcbiAgICAgICAgaWYgKGFueShsZXNzVGhhbihvdXRDLCBzdGFydCkpIHx8IGFueShncmVhdGVyVGhhbkVxdWFsKG91dEMsIGVuZCkpKSB7XG4gICAgICAgICAgc2V0T3V0cHV0KHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAke3R5cGV9IGNvb3JkcyA9IG91dEMgLSBzdGFydDtcbiAgICAgICAgICBzZXRPdXRwdXQoZ2V0WCgke3VucGFja2VkQ29vcmRzfSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuIl19