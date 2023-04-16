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
export class FlipLeftRightProgram {
    constructor(imageShape) {
        this.variableNames = ['Image'];
        this.outputShape = [];
        const imageWidth = imageShape[2];
        this.outputShape = imageShape;
        this.userCode = `
        void main() {
          ivec4 coords = getOutputCoords();
          int x = coords[2];

          int coordX = ${imageWidth} - x - 1;
          float outputValue;
          if(coordX >= 0 && coordX < ${imageWidth}) {
            outputValue = getImage(coords[0], coords[1], coordX, coords[3]);
          } else {
            outputValue = getImage(coords[0], coords[1], coords[2], coords[3]);
          }
          setOutput(outputValue);
        }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxpcF9sZWZ0X3JpZ2h0X2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvZmxpcF9sZWZ0X3JpZ2h0X2dwdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFJSCxNQUFNLE9BQU8sb0JBQW9CO0lBSy9CLFlBQVksVUFBNEM7UUFKeEQsa0JBQWEsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFCLGdCQUFXLEdBQWEsRUFBRSxDQUFDO1FBSXpCLE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUU5QixJQUFJLENBQUMsUUFBUSxHQUFHOzs7Ozt5QkFLSyxVQUFVOzt1Q0FFSSxVQUFVOzs7Ozs7O0tBTzVDLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuXG5leHBvcnQgY2xhc3MgRmxpcExlZnRSaWdodFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWydJbWFnZSddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW10gPSBbXTtcbiAgdXNlckNvZGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihpbWFnZVNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xuICAgIGNvbnN0IGltYWdlV2lkdGggPSBpbWFnZVNoYXBlWzJdO1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBpbWFnZVNoYXBlO1xuXG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICAgIGl2ZWM0IGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICAgIGludCB4ID0gY29vcmRzWzJdO1xuXG4gICAgICAgICAgaW50IGNvb3JkWCA9ICR7aW1hZ2VXaWR0aH0gLSB4IC0gMTtcbiAgICAgICAgICBmbG9hdCBvdXRwdXRWYWx1ZTtcbiAgICAgICAgICBpZihjb29yZFggPj0gMCAmJiBjb29yZFggPCAke2ltYWdlV2lkdGh9KSB7XG4gICAgICAgICAgICBvdXRwdXRWYWx1ZSA9IGdldEltYWdlKGNvb3Jkc1swXSwgY29vcmRzWzFdLCBjb29yZFgsIGNvb3Jkc1szXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dHB1dFZhbHVlID0gZ2V0SW1hZ2UoY29vcmRzWzBdLCBjb29yZHNbMV0sIGNvb3Jkc1syXSwgY29vcmRzWzNdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0T3V0cHV0KG91dHB1dFZhbHVlKTtcbiAgICAgICAgfVxuICAgIGA7XG4gIH1cbn1cbiJdfQ==