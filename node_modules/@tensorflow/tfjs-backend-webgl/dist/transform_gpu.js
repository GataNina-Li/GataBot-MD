/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
export class TransformProgram {
    constructor(imageHeight, imageWidth, interpolation, fillMode, fillValue, outShape) {
        this.variableNames = ['Image', 'Transforms'];
        this.outputShape = outShape;
        const interpolationModeId = interpolation === 'nearest' ? 1 : 2;
        let fillModeId;
        switch (fillMode) {
            case 'constant':
                fillModeId = 1;
                break;
            case 'reflect':
                fillModeId = 2;
                break;
            case 'wrap':
                fillModeId = 3;
                break;
            case 'nearest':
                fillModeId = 4;
                break;
            default:
                fillModeId = 1;
                break;
        }
        this.userCode = `
            float mapCoord(float outCoord, float len) {
              float inCoord = outCoord;
              if(${fillModeId} == 2) {
                if (inCoord < 0.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz2 = 2.0 * len;
                    if (inCoord < sz2) {
                      inCoord = sz2 * float(int(float(-inCoord / sz2))) +
                      inCoord;
                    }
                    inCoord = inCoord < -len ? inCoord + sz2 : -inCoord - 1.0;
                  }
                } else if (inCoord > len - 1.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz2 = 2.0 * len;
                    inCoord -= sz2 * float(int(float(inCoord / sz2)));
                    if (inCoord >= len) {
                      inCoord = sz2 - inCoord - 1.0;
                    }
                  }
                }
                return clamp(inCoord, 0.0, len - 1.0);
              } else if (${fillModeId} == 3) {
                if (inCoord < 0.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz = len - 1.0;
                    inCoord += len * (float(int(float(-inCoord / sz))) + 1.0);
                  }
                } else if (inCoord > len - 1.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz = len - 1.0;
                    inCoord -= len * float(int(float(inCoord / sz)));
                  }
                }
                return clamp(inCoord, 0.0, len - 1.0);
              } else if (${fillModeId} == 4) {
                return clamp(outCoord, 0.0, len - 1.0);
              } else {
                return outCoord;
              }
            }

            float readWithFillValue(int batch, int coordY, int coordX,
              int channel) {
              float outputValue;
              if (0 <= coordY && coordY < ${imageHeight} && 0 <= coordX && coordX < ${imageWidth}) {
                  outputValue = getImage(batch, coordY, coordX, channel);
              } else {
                outputValue = float(${fillValue});
              }
              return outputValue;
            }

            void main() {
              ivec4 coords = getOutputCoords();
              float outputValue;
              int batch = coords[0];
              int x = coords[2];
              int y = coords[1];
              int channel = coords[3];
              float xf = float(x);
              float yf = float(y);
              float a1 = getTransforms(batch, 0);
              float a2 = getTransforms(batch, 1);
              float a3 = getTransforms(batch, 2);
              float b1 = getTransforms(batch, 3);
              float b2 = getTransforms(batch, 4);
              float b3 = getTransforms(batch, 5);
              float c1 = getTransforms(batch, 6);
              float c2 = getTransforms(batch, 7);
              float projection = c1 * xf + c2 * yf + 1.0;
              if (projection == 0.0) {
                outputValue = float(${fillValue});
              } else {
                float inX = (a1 * xf + a2 * yf + a3) / projection;
                float inY = (b1 * xf + b2 * yf + b3) / projection;
                float mapX = mapCoord(inX, float(${imageWidth}));
                float mapY = mapCoord(inY, float(${imageHeight}));

                if (${interpolationModeId} == 1) {
                  int coordY = int(round(mapY));
                  int coordX = int(round(mapX));
                  outputValue = readWithFillValue(batch, coordY, coordX,
                    channel);
                } else {
                  float yFloor = floor(mapY);
                  float xFloor = floor(mapX);
                  float yCeil = yFloor + 1.0;
                  float xCeil = xFloor + 1.0;
                  float valueYFloor = (xCeil - mapX) *
                  readWithFillValue(batch, int(yFloor), int(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, int(yFloor), int(xCeil), channel);
                  float valueYCeil = (xCeil - mapX) *
                  readWithFillValue(batch, int(yCeil), int(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, int(yCeil), int(xCeil), channel);
                  outputValue = (yCeil - mapY) * valueYFloor +
                  (mapY - yFloor) * valueYCeil;
                }
              }
              setOutput(outputValue);
            }
        `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtX2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvdHJhbnNmb3JtX2dwdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFJSCxNQUFNLE9BQU8sZ0JBQWdCO0lBSzNCLFlBQ0ksV0FBbUIsRUFBRSxVQUFrQixFQUN2QyxhQUFtQyxFQUNuQyxRQUErQyxFQUFFLFNBQWlCLEVBQ2xFLFFBQTBDO1FBUjlDLGtCQUFhLEdBQUcsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFTdEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7UUFDNUIsTUFBTSxtQkFBbUIsR0FBRyxhQUFhLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRSxJQUFJLFVBQVUsQ0FBQztRQUNmLFFBQVEsUUFBUSxFQUFFO1lBQ2hCLEtBQUssVUFBVTtnQkFDYixVQUFVLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLE1BQU07WUFDUixLQUFLLFNBQVM7Z0JBQ1osVUFBVSxHQUFHLENBQUMsQ0FBQztnQkFDZixNQUFNO1lBQ1IsS0FBSyxNQUFNO2dCQUNULFVBQVUsR0FBRyxDQUFDLENBQUM7Z0JBQ2YsTUFBTTtZQUNSLEtBQUssU0FBUztnQkFDWixVQUFVLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLE1BQU07WUFDUjtnQkFDRSxVQUFVLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLE1BQU07U0FDVDtRQUNELElBQUksQ0FBQyxRQUFRLEdBQUc7OzttQkFHRCxVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBd0JGLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7OzJCQWlCVixVQUFVOzs7Ozs7Ozs7OzRDQVc3QixXQUFXLCtCQUErQixVQUFVOzs7c0NBR3RCLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQ0F3QlQsU0FBUzs7OzttREFJSSxVQUFVO21EQUNWLFdBQVc7O3NCQUV4QyxtQkFBbUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQXdCaEMsQ0FBQztJQUNSLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIxIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtHUEdQVVByb2dyYW19IGZyb20gJy4vZ3BncHVfbWF0aCc7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm1Qcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsnSW1hZ2UnLCAnVHJhbnNmb3JtcyddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBpbWFnZUhlaWdodDogbnVtYmVyLCBpbWFnZVdpZHRoOiBudW1iZXIsXG4gICAgICBpbnRlcnBvbGF0aW9uOiAnbmVhcmVzdCd8J2JpbGluZWFyJyxcbiAgICAgIGZpbGxNb2RlOiAnY29uc3RhbnQnfCdyZWZsZWN0J3wnd3JhcCd8J25lYXJlc3QnLCBmaWxsVmFsdWU6IG51bWJlcixcbiAgICAgIG91dFNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBvdXRTaGFwZTtcbiAgICBjb25zdCBpbnRlcnBvbGF0aW9uTW9kZUlkID0gaW50ZXJwb2xhdGlvbiA9PT0gJ25lYXJlc3QnID8gMSA6IDI7XG4gICAgbGV0IGZpbGxNb2RlSWQ7XG4gICAgc3dpdGNoIChmaWxsTW9kZSkge1xuICAgICAgY2FzZSAnY29uc3RhbnQnOlxuICAgICAgICBmaWxsTW9kZUlkID0gMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZWZsZWN0JzpcbiAgICAgICAgZmlsbE1vZGVJZCA9IDI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnd3JhcCc6XG4gICAgICAgIGZpbGxNb2RlSWQgPSAzO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ25lYXJlc3QnOlxuICAgICAgICBmaWxsTW9kZUlkID0gNDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBmaWxsTW9kZUlkID0gMTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICAgICAgICBmbG9hdCBtYXBDb29yZChmbG9hdCBvdXRDb29yZCwgZmxvYXQgbGVuKSB7XG4gICAgICAgICAgICAgIGZsb2F0IGluQ29vcmQgPSBvdXRDb29yZDtcbiAgICAgICAgICAgICAgaWYoJHtmaWxsTW9kZUlkfSA9PSAyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluQ29vcmQgPCAwLjApIHtcbiAgICAgICAgICAgICAgICAgIGlmIChsZW4gPD0gMS4wKSB7XG4gICAgICAgICAgICAgICAgICAgIGluQ29vcmQgPSAwLjA7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmbG9hdCBzejIgPSAyLjAgKiBsZW47XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbkNvb3JkIDwgc3oyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgaW5Db29yZCA9IHN6MiAqIGZsb2F0KGludChmbG9hdCgtaW5Db29yZCAvIHN6MikpKSArXG4gICAgICAgICAgICAgICAgICAgICAgaW5Db29yZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpbkNvb3JkID0gaW5Db29yZCA8IC1sZW4gPyBpbkNvb3JkICsgc3oyIDogLWluQ29vcmQgLSAxLjA7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbkNvb3JkID4gbGVuIC0gMS4wKSB7XG4gICAgICAgICAgICAgICAgICBpZiAobGVuIDw9IDEuMCkge1xuICAgICAgICAgICAgICAgICAgICBpbkNvb3JkID0gMC4wO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQgc3oyID0gMi4wICogbGVuO1xuICAgICAgICAgICAgICAgICAgICBpbkNvb3JkIC09IHN6MiAqIGZsb2F0KGludChmbG9hdChpbkNvb3JkIC8gc3oyKSkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5Db29yZCA+PSBsZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICBpbkNvb3JkID0gc3oyIC0gaW5Db29yZCAtIDEuMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhbXAoaW5Db29yZCwgMC4wLCBsZW4gLSAxLjApO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCR7ZmlsbE1vZGVJZH0gPT0gMykge1xuICAgICAgICAgICAgICAgIGlmIChpbkNvb3JkIDwgMC4wKSB7XG4gICAgICAgICAgICAgICAgICBpZiAobGVuIDw9IDEuMCkge1xuICAgICAgICAgICAgICAgICAgICBpbkNvb3JkID0gMC4wO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmxvYXQgc3ogPSBsZW4gLSAxLjA7XG4gICAgICAgICAgICAgICAgICAgIGluQ29vcmQgKz0gbGVuICogKGZsb2F0KGludChmbG9hdCgtaW5Db29yZCAvIHN6KSkpICsgMS4wKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluQ29vcmQgPiBsZW4gLSAxLjApIHtcbiAgICAgICAgICAgICAgICAgIGlmIChsZW4gPD0gMS4wKSB7XG4gICAgICAgICAgICAgICAgICAgIGluQ29vcmQgPSAwLjA7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmbG9hdCBzeiA9IGxlbiAtIDEuMDtcbiAgICAgICAgICAgICAgICAgICAgaW5Db29yZCAtPSBsZW4gKiBmbG9hdChpbnQoZmxvYXQoaW5Db29yZCAvIHN6KSkpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhbXAoaW5Db29yZCwgMC4wLCBsZW4gLSAxLjApO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCR7ZmlsbE1vZGVJZH0gPT0gNCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjbGFtcChvdXRDb29yZCwgMC4wLCBsZW4gLSAxLjApO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBvdXRDb29yZDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmbG9hdCByZWFkV2l0aEZpbGxWYWx1ZShpbnQgYmF0Y2gsIGludCBjb29yZFksIGludCBjb29yZFgsXG4gICAgICAgICAgICAgIGludCBjaGFubmVsKSB7XG4gICAgICAgICAgICAgIGZsb2F0IG91dHB1dFZhbHVlO1xuICAgICAgICAgICAgICBpZiAoMCA8PSBjb29yZFkgJiYgY29vcmRZIDwgJHtcbiAgICAgICAgaW1hZ2VIZWlnaHR9ICYmIDAgPD0gY29vcmRYICYmIGNvb3JkWCA8ICR7aW1hZ2VXaWR0aH0pIHtcbiAgICAgICAgICAgICAgICAgIG91dHB1dFZhbHVlID0gZ2V0SW1hZ2UoYmF0Y2gsIGNvb3JkWSwgY29vcmRYLCBjaGFubmVsKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvdXRwdXRWYWx1ZSA9IGZsb2F0KCR7ZmlsbFZhbHVlfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIG91dHB1dFZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgICAgICAgIGl2ZWM0IGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICAgICAgICBmbG9hdCBvdXRwdXRWYWx1ZTtcbiAgICAgICAgICAgICAgaW50IGJhdGNoID0gY29vcmRzWzBdO1xuICAgICAgICAgICAgICBpbnQgeCA9IGNvb3Jkc1syXTtcbiAgICAgICAgICAgICAgaW50IHkgPSBjb29yZHNbMV07XG4gICAgICAgICAgICAgIGludCBjaGFubmVsID0gY29vcmRzWzNdO1xuICAgICAgICAgICAgICBmbG9hdCB4ZiA9IGZsb2F0KHgpO1xuICAgICAgICAgICAgICBmbG9hdCB5ZiA9IGZsb2F0KHkpO1xuICAgICAgICAgICAgICBmbG9hdCBhMSA9IGdldFRyYW5zZm9ybXMoYmF0Y2gsIDApO1xuICAgICAgICAgICAgICBmbG9hdCBhMiA9IGdldFRyYW5zZm9ybXMoYmF0Y2gsIDEpO1xuICAgICAgICAgICAgICBmbG9hdCBhMyA9IGdldFRyYW5zZm9ybXMoYmF0Y2gsIDIpO1xuICAgICAgICAgICAgICBmbG9hdCBiMSA9IGdldFRyYW5zZm9ybXMoYmF0Y2gsIDMpO1xuICAgICAgICAgICAgICBmbG9hdCBiMiA9IGdldFRyYW5zZm9ybXMoYmF0Y2gsIDQpO1xuICAgICAgICAgICAgICBmbG9hdCBiMyA9IGdldFRyYW5zZm9ybXMoYmF0Y2gsIDUpO1xuICAgICAgICAgICAgICBmbG9hdCBjMSA9IGdldFRyYW5zZm9ybXMoYmF0Y2gsIDYpO1xuICAgICAgICAgICAgICBmbG9hdCBjMiA9IGdldFRyYW5zZm9ybXMoYmF0Y2gsIDcpO1xuICAgICAgICAgICAgICBmbG9hdCBwcm9qZWN0aW9uID0gYzEgKiB4ZiArIGMyICogeWYgKyAxLjA7XG4gICAgICAgICAgICAgIGlmIChwcm9qZWN0aW9uID09IDAuMCkge1xuICAgICAgICAgICAgICAgIG91dHB1dFZhbHVlID0gZmxvYXQoJHtmaWxsVmFsdWV9KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmbG9hdCBpblggPSAoYTEgKiB4ZiArIGEyICogeWYgKyBhMykgLyBwcm9qZWN0aW9uO1xuICAgICAgICAgICAgICAgIGZsb2F0IGluWSA9IChiMSAqIHhmICsgYjIgKiB5ZiArIGIzKSAvIHByb2plY3Rpb247XG4gICAgICAgICAgICAgICAgZmxvYXQgbWFwWCA9IG1hcENvb3JkKGluWCwgZmxvYXQoJHtpbWFnZVdpZHRofSkpO1xuICAgICAgICAgICAgICAgIGZsb2F0IG1hcFkgPSBtYXBDb29yZChpblksIGZsb2F0KCR7aW1hZ2VIZWlnaHR9KSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJHtpbnRlcnBvbGF0aW9uTW9kZUlkfSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICBpbnQgY29vcmRZID0gaW50KHJvdW5kKG1hcFkpKTtcbiAgICAgICAgICAgICAgICAgIGludCBjb29yZFggPSBpbnQocm91bmQobWFwWCkpO1xuICAgICAgICAgICAgICAgICAgb3V0cHV0VmFsdWUgPSByZWFkV2l0aEZpbGxWYWx1ZShiYXRjaCwgY29vcmRZLCBjb29yZFgsXG4gICAgICAgICAgICAgICAgICAgIGNoYW5uZWwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmbG9hdCB5Rmxvb3IgPSBmbG9vcihtYXBZKTtcbiAgICAgICAgICAgICAgICAgIGZsb2F0IHhGbG9vciA9IGZsb29yKG1hcFgpO1xuICAgICAgICAgICAgICAgICAgZmxvYXQgeUNlaWwgPSB5Rmxvb3IgKyAxLjA7XG4gICAgICAgICAgICAgICAgICBmbG9hdCB4Q2VpbCA9IHhGbG9vciArIDEuMDtcbiAgICAgICAgICAgICAgICAgIGZsb2F0IHZhbHVlWUZsb29yID0gKHhDZWlsIC0gbWFwWCkgKlxuICAgICAgICAgICAgICAgICAgcmVhZFdpdGhGaWxsVmFsdWUoYmF0Y2gsIGludCh5Rmxvb3IpLCBpbnQoeEZsb29yKSwgY2hhbm5lbCkgK1xuICAgICAgICAgICAgICAgICAgKG1hcFggLSB4Rmxvb3IpICpcbiAgICAgICAgICAgICAgICAgIHJlYWRXaXRoRmlsbFZhbHVlKGJhdGNoLCBpbnQoeUZsb29yKSwgaW50KHhDZWlsKSwgY2hhbm5lbCk7XG4gICAgICAgICAgICAgICAgICBmbG9hdCB2YWx1ZVlDZWlsID0gKHhDZWlsIC0gbWFwWCkgKlxuICAgICAgICAgICAgICAgICAgcmVhZFdpdGhGaWxsVmFsdWUoYmF0Y2gsIGludCh5Q2VpbCksIGludCh4Rmxvb3IpLCBjaGFubmVsKSArXG4gICAgICAgICAgICAgICAgICAobWFwWCAtIHhGbG9vcikgKlxuICAgICAgICAgICAgICAgICAgcmVhZFdpdGhGaWxsVmFsdWUoYmF0Y2gsIGludCh5Q2VpbCksIGludCh4Q2VpbCksIGNoYW5uZWwpO1xuICAgICAgICAgICAgICAgICAgb3V0cHV0VmFsdWUgPSAoeUNlaWwgLSBtYXBZKSAqIHZhbHVlWUZsb29yICtcbiAgICAgICAgICAgICAgICAgIChtYXBZIC0geUZsb29yKSAqIHZhbHVlWUNlaWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHNldE91dHB1dChvdXRwdXRWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIGA7XG4gIH1cbn1cbiJdfQ==