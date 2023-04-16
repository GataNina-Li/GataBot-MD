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
export class ReduceProgram {
    constructor(reduceInfo, reduceType) {
        this.variableNames = ['x'];
        const { windowSize, batchSize, inSize, outSize } = reduceInfo;
        this.outputShape = [batchSize, outSize];
        let initializationValue = '0.0';
        let compareOp = ``;
        if (reduceType === 'prod') {
            initializationValue = '1.0';
        }
        else if (reduceType === 'min') {
            // WebGL on Firefox Linux can't compile 1/0 so we do 1/eps.
            initializationValue = '1.0 / 1e-20';
            compareOp = `min`;
        }
        else if (reduceType === 'max') {
            // WebGL on Firefox Linux can't compile 1/0 so we do 1/eps.
            initializationValue = '-1.0 / 1e-20';
            compareOp = `max`;
        }
        let returnValue = `${reduceType}(${reduceType}(${reduceType}(` +
            'minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])';
        if (reduceType === 'sum') {
            returnValue = `sumValue`;
        }
        else if (reduceType === 'prod') {
            returnValue = `prodValue`;
        }
        else if (reduceType === 'all') {
            returnValue = `allValue`;
        }
        else if (reduceType === 'any') {
            returnValue = `anyValue`;
        }
        const windowSizeNearestVec4 = Math.floor(windowSize / 4) * 4;
        const windowSizeVec4Remainder = windowSize % 4;
        let updateSnippet = `
      if (${reduceType === 'sum'}) {
        sumValue += dot(values, ones);
      } else if (${reduceType === 'prod'}) {
        vec2 tmp = vec2(values[0], values[1]) * vec2(values[2], values[3]);
        prodValue *= tmp[0] * tmp[1];
      } else {
        minMaxValue = ${compareOp}(values, minMaxValue);
        if (${reduceType === 'min'} || ${reduceType === 'max'}) {
          minMaxValue = ${compareOp}(values, minMaxValue);
          bvec4 isNaN = isnan(values);
          if (isNaN.r || isNaN.g || isNaN.b || isNaN.a) {
            minMaxValue = vec4(NAN);
          }
        }
      }
    `;
        let vecType = `vec4`;
        if (reduceType === 'all') {
            initializationValue = '1.0';
            updateSnippet = `
        bool reducedAllValue = all(values);
        float floatedReducedAllValue = float(reducedAllValue);
        allValue = float(allValue >= 1.0 && floatedReducedAllValue >= 1.0);
      `;
            vecType = `bvec4`;
        }
        else if (reduceType === 'any') {
            initializationValue = '0.0';
            updateSnippet = `
        bool reducedAnyValue = any(values);
        float floatedReducedAnyValue = float(reducedAnyValue);
        anyValue = float(anyValue >= 1.0 || floatedReducedAnyValue >= 1.0);
      `;
            vecType = `bvec4`;
        }
        let checkOutOfBounds = '';
        if (inSize % windowSize > 0) {
            checkOutOfBounds = `
        if (inIdx < 0 || inIdx >= ${inSize}) {
          return initializationValue;
        }
      `;
        }
        this.userCode = `
      const float initializationValue = ${initializationValue};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float getValue(int batch, int inIdx) {
        ${checkOutOfBounds}
        return getX(batch, inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${windowSize};

        vec4 minMaxValue = vec4(${initializationValue});
        float prodValue = 1.0;
        float sumValue = 0.0;
        float allValue = 1.0;
        float anyValue = 0.0;

        for (int i = 0; i < ${windowSizeNearestVec4}; i += 4) {
          int inIdx = inOffset + i;
          ${vecType} values = ${vecType}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          ${updateSnippet}
        }

        int inIdx = inOffset + ${windowSizeNearestVec4};
        if (${windowSizeVec4Remainder === 1}) {
          ${vecType} values = ${vecType}(
            getValue(batch, inIdx),
            initializationValue,
            initializationValue,
            initializationValue
          );

          ${updateSnippet}
        } else if (${windowSizeVec4Remainder === 2}) {
          ${vecType} values = ${vecType}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            initializationValue,
            initializationValue
          );

          ${updateSnippet}
        } else if (${windowSizeVec4Remainder === 3}) {
          ${vecType} values = ${vecType}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            initializationValue
          );

          ${updateSnippet}
        }
        setOutput(${returnValue});
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkdWNlX2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvcmVkdWNlX2dwdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFLSCxNQUFNLE9BQU8sYUFBYTtJQUt4QixZQUNJLFVBQW1DLEVBQ25DLFVBQWdEO1FBTnBELGtCQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQU9wQixNQUFNLEVBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFDLEdBQUcsVUFBVSxDQUFDO1FBQzVELElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFeEMsSUFBSSxtQkFBbUIsR0FBRyxLQUFLLENBQUM7UUFDaEMsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBRW5CLElBQUksVUFBVSxLQUFLLE1BQU0sRUFBRTtZQUN6QixtQkFBbUIsR0FBRyxLQUFLLENBQUM7U0FDN0I7YUFBTSxJQUFJLFVBQVUsS0FBSyxLQUFLLEVBQUU7WUFDL0IsMkRBQTJEO1lBQzNELG1CQUFtQixHQUFHLGFBQWEsQ0FBQztZQUNwQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1NBQ25CO2FBQU0sSUFBSSxVQUFVLEtBQUssS0FBSyxFQUFFO1lBQy9CLDJEQUEyRDtZQUMzRCxtQkFBbUIsR0FBRyxjQUFjLENBQUM7WUFDckMsU0FBUyxHQUFHLEtBQUssQ0FBQztTQUNuQjtRQUVELElBQUksV0FBVyxHQUFHLEdBQUcsVUFBVSxJQUFJLFVBQVUsSUFBSSxVQUFVLEdBQUc7WUFDMUQsbUVBQW1FLENBQUM7UUFFeEUsSUFBSSxVQUFVLEtBQUssS0FBSyxFQUFFO1lBQ3hCLFdBQVcsR0FBRyxVQUFVLENBQUM7U0FDMUI7YUFBTSxJQUFJLFVBQVUsS0FBSyxNQUFNLEVBQUU7WUFDaEMsV0FBVyxHQUFHLFdBQVcsQ0FBQztTQUMzQjthQUFNLElBQUksVUFBVSxLQUFLLEtBQUssRUFBRTtZQUMvQixXQUFXLEdBQUcsVUFBVSxDQUFDO1NBQzFCO2FBQU0sSUFBSSxVQUFVLEtBQUssS0FBSyxFQUFFO1lBQy9CLFdBQVcsR0FBRyxVQUFVLENBQUM7U0FDMUI7UUFFRCxNQUFNLHFCQUFxQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3RCxNQUFNLHVCQUF1QixHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFFL0MsSUFBSSxhQUFhLEdBQUc7WUFDWixVQUFVLEtBQUssS0FBSzs7bUJBRWIsVUFBVSxLQUFLLE1BQU07Ozs7d0JBSWhCLFNBQVM7Y0FDbkIsVUFBVSxLQUFLLEtBQUssT0FBTyxVQUFVLEtBQUssS0FBSzswQkFDbkMsU0FBUzs7Ozs7OztLQU85QixDQUFDO1FBRUYsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBRXJCLElBQUksVUFBVSxLQUFLLEtBQUssRUFBRTtZQUN4QixtQkFBbUIsR0FBRyxLQUFLLENBQUM7WUFDNUIsYUFBYSxHQUFHOzs7O09BSWYsQ0FBQztZQUNGLE9BQU8sR0FBRyxPQUFPLENBQUM7U0FDbkI7YUFBTSxJQUFJLFVBQVUsS0FBSyxLQUFLLEVBQUU7WUFDL0IsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO1lBQzVCLGFBQWEsR0FBRzs7OztPQUlmLENBQUM7WUFDRixPQUFPLEdBQUcsT0FBTyxDQUFDO1NBQ25CO1FBRUQsSUFBSSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7UUFDMUIsSUFBSSxNQUFNLEdBQUcsVUFBVSxHQUFHLENBQUMsRUFBRTtZQUMzQixnQkFBZ0IsR0FBRztvQ0FDVyxNQUFNOzs7T0FHbkMsQ0FBQztTQUNIO1FBQ0QsSUFBSSxDQUFDLFFBQVEsR0FBRzswQ0FDc0IsbUJBQW1COzs7O1VBSW5ELGdCQUFnQjs7Ozs7Ozs7a0NBUVEsVUFBVTs7a0NBRVYsbUJBQW1COzs7Ozs7OEJBTXZCLHFCQUFxQjs7WUFFdkMsT0FBTyxhQUFhLE9BQU87Ozs7Ozs7WUFPM0IsYUFBYTs7O2lDQUdRLHFCQUFxQjtjQUN4Qyx1QkFBdUIsS0FBSyxDQUFDO1lBQy9CLE9BQU8sYUFBYSxPQUFPOzs7Ozs7O1lBTzNCLGFBQWE7cUJBQ0osdUJBQXVCLEtBQUssQ0FBQztZQUN0QyxPQUFPLGFBQWEsT0FBTzs7Ozs7OztZQU8zQixhQUFhO3FCQUNKLHVCQUF1QixLQUFLLENBQUM7WUFDdEMsT0FBTyxhQUFhLE9BQU87Ozs7Ozs7WUFPM0IsYUFBYTs7b0JBRUwsV0FBVzs7S0FFMUIsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtiYWNrZW5kX3V0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5pbXBvcnQge0dQR1BVUHJvZ3JhbX0gZnJvbSAnLi9ncGdwdV9tYXRoJztcblxuZXhwb3J0IGNsYXNzIFJlZHVjZVByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWyd4J107XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXTtcbiAgdXNlckNvZGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHJlZHVjZUluZm86IGJhY2tlbmRfdXRpbC5SZWR1Y2VJbmZvLFxuICAgICAgcmVkdWNlVHlwZTogJ2FsbCd8J2FueSd8J21heCd8J21pbid8J3N1bSd8J3Byb2QnKSB7XG4gICAgY29uc3Qge3dpbmRvd1NpemUsIGJhdGNoU2l6ZSwgaW5TaXplLCBvdXRTaXplfSA9IHJlZHVjZUluZm87XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IFtiYXRjaFNpemUsIG91dFNpemVdO1xuXG4gICAgbGV0IGluaXRpYWxpemF0aW9uVmFsdWUgPSAnMC4wJztcbiAgICBsZXQgY29tcGFyZU9wID0gYGA7XG5cbiAgICBpZiAocmVkdWNlVHlwZSA9PT0gJ3Byb2QnKSB7XG4gICAgICBpbml0aWFsaXphdGlvblZhbHVlID0gJzEuMCc7XG4gICAgfSBlbHNlIGlmIChyZWR1Y2VUeXBlID09PSAnbWluJykge1xuICAgICAgLy8gV2ViR0wgb24gRmlyZWZveCBMaW51eCBjYW4ndCBjb21waWxlIDEvMCBzbyB3ZSBkbyAxL2Vwcy5cbiAgICAgIGluaXRpYWxpemF0aW9uVmFsdWUgPSAnMS4wIC8gMWUtMjAnO1xuICAgICAgY29tcGFyZU9wID0gYG1pbmA7XG4gICAgfSBlbHNlIGlmIChyZWR1Y2VUeXBlID09PSAnbWF4Jykge1xuICAgICAgLy8gV2ViR0wgb24gRmlyZWZveCBMaW51eCBjYW4ndCBjb21waWxlIDEvMCBzbyB3ZSBkbyAxL2Vwcy5cbiAgICAgIGluaXRpYWxpemF0aW9uVmFsdWUgPSAnLTEuMCAvIDFlLTIwJztcbiAgICAgIGNvbXBhcmVPcCA9IGBtYXhgO1xuICAgIH1cblxuICAgIGxldCByZXR1cm5WYWx1ZSA9IGAke3JlZHVjZVR5cGV9KCR7cmVkdWNlVHlwZX0oJHtyZWR1Y2VUeXBlfShgICtcbiAgICAgICAgJ21pbk1heFZhbHVlWzBdLCBtaW5NYXhWYWx1ZVsxXSksIG1pbk1heFZhbHVlWzJdKSwgbWluTWF4VmFsdWVbM10pJztcblxuICAgIGlmIChyZWR1Y2VUeXBlID09PSAnc3VtJykge1xuICAgICAgcmV0dXJuVmFsdWUgPSBgc3VtVmFsdWVgO1xuICAgIH0gZWxzZSBpZiAocmVkdWNlVHlwZSA9PT0gJ3Byb2QnKSB7XG4gICAgICByZXR1cm5WYWx1ZSA9IGBwcm9kVmFsdWVgO1xuICAgIH0gZWxzZSBpZiAocmVkdWNlVHlwZSA9PT0gJ2FsbCcpIHtcbiAgICAgIHJldHVyblZhbHVlID0gYGFsbFZhbHVlYDtcbiAgICB9IGVsc2UgaWYgKHJlZHVjZVR5cGUgPT09ICdhbnknKSB7XG4gICAgICByZXR1cm5WYWx1ZSA9IGBhbnlWYWx1ZWA7XG4gICAgfVxuXG4gICAgY29uc3Qgd2luZG93U2l6ZU5lYXJlc3RWZWM0ID0gTWF0aC5mbG9vcih3aW5kb3dTaXplIC8gNCkgKiA0O1xuICAgIGNvbnN0IHdpbmRvd1NpemVWZWM0UmVtYWluZGVyID0gd2luZG93U2l6ZSAlIDQ7XG5cbiAgICBsZXQgdXBkYXRlU25pcHBldCA9IGBcbiAgICAgIGlmICgke3JlZHVjZVR5cGUgPT09ICdzdW0nfSkge1xuICAgICAgICBzdW1WYWx1ZSArPSBkb3QodmFsdWVzLCBvbmVzKTtcbiAgICAgIH0gZWxzZSBpZiAoJHtyZWR1Y2VUeXBlID09PSAncHJvZCd9KSB7XG4gICAgICAgIHZlYzIgdG1wID0gdmVjMih2YWx1ZXNbMF0sIHZhbHVlc1sxXSkgKiB2ZWMyKHZhbHVlc1syXSwgdmFsdWVzWzNdKTtcbiAgICAgICAgcHJvZFZhbHVlICo9IHRtcFswXSAqIHRtcFsxXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1pbk1heFZhbHVlID0gJHtjb21wYXJlT3B9KHZhbHVlcywgbWluTWF4VmFsdWUpO1xuICAgICAgICBpZiAoJHtyZWR1Y2VUeXBlID09PSAnbWluJ30gfHwgJHtyZWR1Y2VUeXBlID09PSAnbWF4J30pIHtcbiAgICAgICAgICBtaW5NYXhWYWx1ZSA9ICR7Y29tcGFyZU9wfSh2YWx1ZXMsIG1pbk1heFZhbHVlKTtcbiAgICAgICAgICBidmVjNCBpc05hTiA9IGlzbmFuKHZhbHVlcyk7XG4gICAgICAgICAgaWYgKGlzTmFOLnIgfHwgaXNOYU4uZyB8fCBpc05hTi5iIHx8IGlzTmFOLmEpIHtcbiAgICAgICAgICAgIG1pbk1heFZhbHVlID0gdmVjNChOQU4pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGA7XG5cbiAgICBsZXQgdmVjVHlwZSA9IGB2ZWM0YDtcblxuICAgIGlmIChyZWR1Y2VUeXBlID09PSAnYWxsJykge1xuICAgICAgaW5pdGlhbGl6YXRpb25WYWx1ZSA9ICcxLjAnO1xuICAgICAgdXBkYXRlU25pcHBldCA9IGBcbiAgICAgICAgYm9vbCByZWR1Y2VkQWxsVmFsdWUgPSBhbGwodmFsdWVzKTtcbiAgICAgICAgZmxvYXQgZmxvYXRlZFJlZHVjZWRBbGxWYWx1ZSA9IGZsb2F0KHJlZHVjZWRBbGxWYWx1ZSk7XG4gICAgICAgIGFsbFZhbHVlID0gZmxvYXQoYWxsVmFsdWUgPj0gMS4wICYmIGZsb2F0ZWRSZWR1Y2VkQWxsVmFsdWUgPj0gMS4wKTtcbiAgICAgIGA7XG4gICAgICB2ZWNUeXBlID0gYGJ2ZWM0YDtcbiAgICB9IGVsc2UgaWYgKHJlZHVjZVR5cGUgPT09ICdhbnknKSB7XG4gICAgICBpbml0aWFsaXphdGlvblZhbHVlID0gJzAuMCc7XG4gICAgICB1cGRhdGVTbmlwcGV0ID0gYFxuICAgICAgICBib29sIHJlZHVjZWRBbnlWYWx1ZSA9IGFueSh2YWx1ZXMpO1xuICAgICAgICBmbG9hdCBmbG9hdGVkUmVkdWNlZEFueVZhbHVlID0gZmxvYXQocmVkdWNlZEFueVZhbHVlKTtcbiAgICAgICAgYW55VmFsdWUgPSBmbG9hdChhbnlWYWx1ZSA+PSAxLjAgfHwgZmxvYXRlZFJlZHVjZWRBbnlWYWx1ZSA+PSAxLjApO1xuICAgICAgYDtcbiAgICAgIHZlY1R5cGUgPSBgYnZlYzRgO1xuICAgIH1cblxuICAgIGxldCBjaGVja091dE9mQm91bmRzID0gJyc7XG4gICAgaWYgKGluU2l6ZSAlIHdpbmRvd1NpemUgPiAwKSB7XG4gICAgICBjaGVja091dE9mQm91bmRzID0gYFxuICAgICAgICBpZiAoaW5JZHggPCAwIHx8IGluSWR4ID49ICR7aW5TaXplfSkge1xuICAgICAgICAgIHJldHVybiBpbml0aWFsaXphdGlvblZhbHVlO1xuICAgICAgICB9XG4gICAgICBgO1xuICAgIH1cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgY29uc3QgZmxvYXQgaW5pdGlhbGl6YXRpb25WYWx1ZSA9ICR7aW5pdGlhbGl6YXRpb25WYWx1ZX07XG4gICAgICBjb25zdCB2ZWM0IG9uZXMgPSB2ZWM0KDEuMCwgMS4wLCAxLjAsIDEuMCk7XG5cbiAgICAgIGZsb2F0IGdldFZhbHVlKGludCBiYXRjaCwgaW50IGluSWR4KSB7XG4gICAgICAgICR7Y2hlY2tPdXRPZkJvdW5kc31cbiAgICAgICAgcmV0dXJuIGdldFgoYmF0Y2gsIGluSWR4KTtcbiAgICAgIH1cblxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICBpdmVjMiBjb29yZHMgPSBnZXRPdXRwdXRDb29yZHMoKTtcbiAgICAgICAgaW50IGJhdGNoID0gY29vcmRzWzBdO1xuICAgICAgICBpbnQgb3V0SWR4ID0gY29vcmRzWzFdO1xuICAgICAgICBpbnQgaW5PZmZzZXQgPSBvdXRJZHggKiAke3dpbmRvd1NpemV9O1xuXG4gICAgICAgIHZlYzQgbWluTWF4VmFsdWUgPSB2ZWM0KCR7aW5pdGlhbGl6YXRpb25WYWx1ZX0pO1xuICAgICAgICBmbG9hdCBwcm9kVmFsdWUgPSAxLjA7XG4gICAgICAgIGZsb2F0IHN1bVZhbHVlID0gMC4wO1xuICAgICAgICBmbG9hdCBhbGxWYWx1ZSA9IDEuMDtcbiAgICAgICAgZmxvYXQgYW55VmFsdWUgPSAwLjA7XG5cbiAgICAgICAgZm9yIChpbnQgaSA9IDA7IGkgPCAke3dpbmRvd1NpemVOZWFyZXN0VmVjNH07IGkgKz0gNCkge1xuICAgICAgICAgIGludCBpbklkeCA9IGluT2Zmc2V0ICsgaTtcbiAgICAgICAgICAke3ZlY1R5cGV9IHZhbHVlcyA9ICR7dmVjVHlwZX0oXG4gICAgICAgICAgICBnZXRWYWx1ZShiYXRjaCwgaW5JZHgpLFxuICAgICAgICAgICAgZ2V0VmFsdWUoYmF0Y2gsIGluSWR4ICsgMSksXG4gICAgICAgICAgICBnZXRWYWx1ZShiYXRjaCwgaW5JZHggKyAyKSxcbiAgICAgICAgICAgIGdldFZhbHVlKGJhdGNoLCBpbklkeCArIDMpXG4gICAgICAgICAgKTtcblxuICAgICAgICAgICR7dXBkYXRlU25pcHBldH1cbiAgICAgICAgfVxuXG4gICAgICAgIGludCBpbklkeCA9IGluT2Zmc2V0ICsgJHt3aW5kb3dTaXplTmVhcmVzdFZlYzR9O1xuICAgICAgICBpZiAoJHt3aW5kb3dTaXplVmVjNFJlbWFpbmRlciA9PT0gMX0pIHtcbiAgICAgICAgICAke3ZlY1R5cGV9IHZhbHVlcyA9ICR7dmVjVHlwZX0oXG4gICAgICAgICAgICBnZXRWYWx1ZShiYXRjaCwgaW5JZHgpLFxuICAgICAgICAgICAgaW5pdGlhbGl6YXRpb25WYWx1ZSxcbiAgICAgICAgICAgIGluaXRpYWxpemF0aW9uVmFsdWUsXG4gICAgICAgICAgICBpbml0aWFsaXphdGlvblZhbHVlXG4gICAgICAgICAgKTtcblxuICAgICAgICAgICR7dXBkYXRlU25pcHBldH1cbiAgICAgICAgfSBlbHNlIGlmICgke3dpbmRvd1NpemVWZWM0UmVtYWluZGVyID09PSAyfSkge1xuICAgICAgICAgICR7dmVjVHlwZX0gdmFsdWVzID0gJHt2ZWNUeXBlfShcbiAgICAgICAgICAgIGdldFZhbHVlKGJhdGNoLCBpbklkeCksXG4gICAgICAgICAgICBnZXRWYWx1ZShiYXRjaCwgaW5JZHggKyAxKSxcbiAgICAgICAgICAgIGluaXRpYWxpemF0aW9uVmFsdWUsXG4gICAgICAgICAgICBpbml0aWFsaXphdGlvblZhbHVlXG4gICAgICAgICAgKTtcblxuICAgICAgICAgICR7dXBkYXRlU25pcHBldH1cbiAgICAgICAgfSBlbHNlIGlmICgke3dpbmRvd1NpemVWZWM0UmVtYWluZGVyID09PSAzfSkge1xuICAgICAgICAgICR7dmVjVHlwZX0gdmFsdWVzID0gJHt2ZWNUeXBlfShcbiAgICAgICAgICAgIGdldFZhbHVlKGJhdGNoLCBpbklkeCksXG4gICAgICAgICAgICBnZXRWYWx1ZShiYXRjaCwgaW5JZHggKyAxKSxcbiAgICAgICAgICAgIGdldFZhbHVlKGJhdGNoLCBpbklkeCArIDIpLFxuICAgICAgICAgICAgaW5pdGlhbGl6YXRpb25WYWx1ZVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICAke3VwZGF0ZVNuaXBwZXR9XG4gICAgICAgIH1cbiAgICAgICAgc2V0T3V0cHV0KCR7cmV0dXJuVmFsdWV9KTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG4iXX0=