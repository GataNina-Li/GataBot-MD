/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
export function getGlslDifferences() {
    let version;
    let attribute;
    let varyingVs;
    let varyingFs;
    let texture2D;
    let output;
    let defineOutput;
    let defineSpecialNaN;
    let defineSpecialInf;
    let defineRound;
    if (env().getNumber('WEBGL_VERSION') === 2) {
        version = '#version 300 es';
        attribute = 'in';
        varyingVs = 'out';
        varyingFs = 'in';
        texture2D = 'texture';
        output = 'outputColor';
        defineOutput = 'out vec4 outputColor;';
        // Use custom isnan definition to work across differences between
        // implementations on various platforms. While this should happen in ANGLE
        // we still see differences between android and windows (on chrome) when
        // using isnan directly. Since WebGL2 supports uint type and
        // floatBitsToUinT built-in function, we could implment isnan following
        // IEEE 754 rules.
        // NaN defination in IEEE 754-1985 is :
        //   - sign = either 0 or 1.
        //   - biased exponent = all 1 bits.
        //   - fraction = anything except all 0 bits (since all 0 bits represents
        //   infinity).
        // https://en.wikipedia.org/wiki/IEEE_754-1985#Representation_of_non-numbers
        defineSpecialNaN = env().getBool('WEBGL2_ISNAN_CUSTOM') ? `
      bool isnan_custom(float val) {
        uint floatToUint = floatBitsToUint(val);
        return (floatToUint & 0x7fffffffu) > 0x7f800000u;
      }

      bvec4 isnan_custom(vec4 val) {
        return bvec4(isnan_custom(val.x),
          isnan_custom(val.y), isnan_custom(val.z), isnan_custom(val.w));
      }

      #define isnan(value) isnan_custom(value)
    ` :
            '';
        // In webgl 2 we do not need to specify a custom isinf so there is no
        // need for a special INFINITY constant.
        defineSpecialInf = ``;
        defineRound = `
      #define round(value) newRound(value)
      int newRound(float value) {
        return int(floor(value + 0.5));
      }

      ivec4 newRound(vec4 value) {
        return ivec4(floor(value + vec4(0.5)));
      }
    `;
    }
    else {
        version = '';
        attribute = 'attribute';
        varyingVs = 'varying';
        varyingFs = 'varying';
        texture2D = 'texture2D';
        output = 'gl_FragColor';
        defineOutput = '';
        // WebGL1 has no built in isnan so we define one here.
        defineSpecialNaN = `
      #define isnan(value) isnan_custom(value)
      bool isnan_custom(float val) {
        return (val > 0. || val < 1. || val == 0.) ? false : true;
      }
      bvec4 isnan_custom(vec4 val) {
        return bvec4(isnan(val.x), isnan(val.y), isnan(val.z), isnan(val.w));
      }
    `;
        defineSpecialInf = `
      uniform float INFINITY;

      bool isinf(float val) {
        return abs(val) == INFINITY;
      }
      bvec4 isinf(vec4 val) {
        return equal(abs(val), vec4(INFINITY));
      }
    `;
        defineRound = `
      int round(float value) {
        return int(floor(value + 0.5));
      }

      ivec4 round(vec4 value) {
        return ivec4(floor(value + vec4(0.5)));
      }
    `;
    }
    return {
        version,
        attribute,
        varyingVs,
        varyingFs,
        texture2D,
        output,
        defineOutput,
        defineSpecialNaN,
        defineSpecialInf,
        defineRound
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xzbF92ZXJzaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9nbHNsX3ZlcnNpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBZTFDLE1BQU0sVUFBVSxrQkFBa0I7SUFDaEMsSUFBSSxPQUFlLENBQUM7SUFDcEIsSUFBSSxTQUFpQixDQUFDO0lBQ3RCLElBQUksU0FBaUIsQ0FBQztJQUN0QixJQUFJLFNBQWlCLENBQUM7SUFDdEIsSUFBSSxTQUFpQixDQUFDO0lBQ3RCLElBQUksTUFBYyxDQUFDO0lBQ25CLElBQUksWUFBb0IsQ0FBQztJQUN6QixJQUFJLGdCQUF3QixDQUFDO0lBQzdCLElBQUksZ0JBQXdCLENBQUM7SUFDN0IsSUFBSSxXQUFtQixDQUFDO0lBRXhCLElBQUksR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUMxQyxPQUFPLEdBQUcsaUJBQWlCLENBQUM7UUFDNUIsU0FBUyxHQUFHLElBQUksQ0FBQztRQUNqQixTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDakIsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUN0QixNQUFNLEdBQUcsYUFBYSxDQUFDO1FBQ3ZCLFlBQVksR0FBRyx1QkFBdUIsQ0FBQztRQUV2QyxpRUFBaUU7UUFDakUsMEVBQTBFO1FBQzFFLHdFQUF3RTtRQUN4RSw0REFBNEQ7UUFDNUQsdUVBQXVFO1FBQ3ZFLGtCQUFrQjtRQUNsQix1Q0FBdUM7UUFDdkMsNEJBQTRCO1FBQzVCLG9DQUFvQztRQUNwQyx5RUFBeUU7UUFDekUsZUFBZTtRQUNmLDRFQUE0RTtRQUM1RSxnQkFBZ0IsR0FBRyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7OztLQVl6RCxDQUFDLENBQUM7WUFDdUQsRUFBRSxDQUFDO1FBQzdELHFFQUFxRTtRQUNyRSx3Q0FBd0M7UUFDeEMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLFdBQVcsR0FBRzs7Ozs7Ozs7O0tBU2IsQ0FBQztLQUNIO1NBQU07UUFDTCxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2IsU0FBUyxHQUFHLFdBQVcsQ0FBQztRQUN4QixTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQ3RCLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDdEIsU0FBUyxHQUFHLFdBQVcsQ0FBQztRQUN4QixNQUFNLEdBQUcsY0FBYyxDQUFDO1FBQ3hCLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDbEIsc0RBQXNEO1FBQ3RELGdCQUFnQixHQUFHOzs7Ozs7OztLQVFsQixDQUFDO1FBQ0YsZ0JBQWdCLEdBQUc7Ozs7Ozs7OztLQVNsQixDQUFDO1FBQ0YsV0FBVyxHQUFHOzs7Ozs7OztLQVFiLENBQUM7S0FDSDtJQUVELE9BQU87UUFDTCxPQUFPO1FBQ1AsU0FBUztRQUNULFNBQVM7UUFDVCxTQUFTO1FBQ1QsU0FBUztRQUNULE1BQU07UUFDTixZQUFZO1FBQ1osZ0JBQWdCO1FBQ2hCLGdCQUFnQjtRQUNoQixXQUFXO0tBQ1osQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQge2Vudn0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuZXhwb3J0IHR5cGUgR0xTTCA9IHtcbiAgdmVyc2lvbjogc3RyaW5nLFxuICBhdHRyaWJ1dGU6IHN0cmluZyxcbiAgdmFyeWluZ1ZzOiBzdHJpbmcsXG4gIHZhcnlpbmdGczogc3RyaW5nLFxuICB0ZXh0dXJlMkQ6IHN0cmluZyxcbiAgb3V0cHV0OiBzdHJpbmcsXG4gIGRlZmluZU91dHB1dDogc3RyaW5nLFxuICBkZWZpbmVTcGVjaWFsTmFOOiBzdHJpbmcsXG4gIGRlZmluZVNwZWNpYWxJbmY6IHN0cmluZyxcbiAgZGVmaW5lUm91bmQ6IHN0cmluZ1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEdsc2xEaWZmZXJlbmNlcygpOiBHTFNMIHtcbiAgbGV0IHZlcnNpb246IHN0cmluZztcbiAgbGV0IGF0dHJpYnV0ZTogc3RyaW5nO1xuICBsZXQgdmFyeWluZ1ZzOiBzdHJpbmc7XG4gIGxldCB2YXJ5aW5nRnM6IHN0cmluZztcbiAgbGV0IHRleHR1cmUyRDogc3RyaW5nO1xuICBsZXQgb3V0cHV0OiBzdHJpbmc7XG4gIGxldCBkZWZpbmVPdXRwdXQ6IHN0cmluZztcbiAgbGV0IGRlZmluZVNwZWNpYWxOYU46IHN0cmluZztcbiAgbGV0IGRlZmluZVNwZWNpYWxJbmY6IHN0cmluZztcbiAgbGV0IGRlZmluZVJvdW5kOiBzdHJpbmc7XG5cbiAgaWYgKGVudigpLmdldE51bWJlcignV0VCR0xfVkVSU0lPTicpID09PSAyKSB7XG4gICAgdmVyc2lvbiA9ICcjdmVyc2lvbiAzMDAgZXMnO1xuICAgIGF0dHJpYnV0ZSA9ICdpbic7XG4gICAgdmFyeWluZ1ZzID0gJ291dCc7XG4gICAgdmFyeWluZ0ZzID0gJ2luJztcbiAgICB0ZXh0dXJlMkQgPSAndGV4dHVyZSc7XG4gICAgb3V0cHV0ID0gJ291dHB1dENvbG9yJztcbiAgICBkZWZpbmVPdXRwdXQgPSAnb3V0IHZlYzQgb3V0cHV0Q29sb3I7JztcblxuICAgIC8vIFVzZSBjdXN0b20gaXNuYW4gZGVmaW5pdGlvbiB0byB3b3JrIGFjcm9zcyBkaWZmZXJlbmNlcyBiZXR3ZWVuXG4gICAgLy8gaW1wbGVtZW50YXRpb25zIG9uIHZhcmlvdXMgcGxhdGZvcm1zLiBXaGlsZSB0aGlzIHNob3VsZCBoYXBwZW4gaW4gQU5HTEVcbiAgICAvLyB3ZSBzdGlsbCBzZWUgZGlmZmVyZW5jZXMgYmV0d2VlbiBhbmRyb2lkIGFuZCB3aW5kb3dzIChvbiBjaHJvbWUpIHdoZW5cbiAgICAvLyB1c2luZyBpc25hbiBkaXJlY3RseS4gU2luY2UgV2ViR0wyIHN1cHBvcnRzIHVpbnQgdHlwZSBhbmRcbiAgICAvLyBmbG9hdEJpdHNUb1VpblQgYnVpbHQtaW4gZnVuY3Rpb24sIHdlIGNvdWxkIGltcGxtZW50IGlzbmFuIGZvbGxvd2luZ1xuICAgIC8vIElFRUUgNzU0IHJ1bGVzLlxuICAgIC8vIE5hTiBkZWZpbmF0aW9uIGluIElFRUUgNzU0LTE5ODUgaXMgOlxuICAgIC8vICAgLSBzaWduID0gZWl0aGVyIDAgb3IgMS5cbiAgICAvLyAgIC0gYmlhc2VkIGV4cG9uZW50ID0gYWxsIDEgYml0cy5cbiAgICAvLyAgIC0gZnJhY3Rpb24gPSBhbnl0aGluZyBleGNlcHQgYWxsIDAgYml0cyAoc2luY2UgYWxsIDAgYml0cyByZXByZXNlbnRzXG4gICAgLy8gICBpbmZpbml0eSkuXG4gICAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSUVFRV83NTQtMTk4NSNSZXByZXNlbnRhdGlvbl9vZl9ub24tbnVtYmVyc1xuICAgIGRlZmluZVNwZWNpYWxOYU4gPSBlbnYoKS5nZXRCb29sKCdXRUJHTDJfSVNOQU5fQ1VTVE9NJykgPyBgXG4gICAgICBib29sIGlzbmFuX2N1c3RvbShmbG9hdCB2YWwpIHtcbiAgICAgICAgdWludCBmbG9hdFRvVWludCA9IGZsb2F0Qml0c1RvVWludCh2YWwpO1xuICAgICAgICByZXR1cm4gKGZsb2F0VG9VaW50ICYgMHg3ZmZmZmZmZnUpID4gMHg3ZjgwMDAwMHU7XG4gICAgICB9XG5cbiAgICAgIGJ2ZWM0IGlzbmFuX2N1c3RvbSh2ZWM0IHZhbCkge1xuICAgICAgICByZXR1cm4gYnZlYzQoaXNuYW5fY3VzdG9tKHZhbC54KSxcbiAgICAgICAgICBpc25hbl9jdXN0b20odmFsLnkpLCBpc25hbl9jdXN0b20odmFsLnopLCBpc25hbl9jdXN0b20odmFsLncpKTtcbiAgICAgIH1cblxuICAgICAgI2RlZmluZSBpc25hbih2YWx1ZSkgaXNuYW5fY3VzdG9tKHZhbHVlKVxuICAgIGAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJztcbiAgICAvLyBJbiB3ZWJnbCAyIHdlIGRvIG5vdCBuZWVkIHRvIHNwZWNpZnkgYSBjdXN0b20gaXNpbmYgc28gdGhlcmUgaXMgbm9cbiAgICAvLyBuZWVkIGZvciBhIHNwZWNpYWwgSU5GSU5JVFkgY29uc3RhbnQuXG4gICAgZGVmaW5lU3BlY2lhbEluZiA9IGBgO1xuICAgIGRlZmluZVJvdW5kID0gYFxuICAgICAgI2RlZmluZSByb3VuZCh2YWx1ZSkgbmV3Um91bmQodmFsdWUpXG4gICAgICBpbnQgbmV3Um91bmQoZmxvYXQgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGludChmbG9vcih2YWx1ZSArIDAuNSkpO1xuICAgICAgfVxuXG4gICAgICBpdmVjNCBuZXdSb3VuZCh2ZWM0IHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBpdmVjNChmbG9vcih2YWx1ZSArIHZlYzQoMC41KSkpO1xuICAgICAgfVxuICAgIGA7XG4gIH0gZWxzZSB7XG4gICAgdmVyc2lvbiA9ICcnO1xuICAgIGF0dHJpYnV0ZSA9ICdhdHRyaWJ1dGUnO1xuICAgIHZhcnlpbmdWcyA9ICd2YXJ5aW5nJztcbiAgICB2YXJ5aW5nRnMgPSAndmFyeWluZyc7XG4gICAgdGV4dHVyZTJEID0gJ3RleHR1cmUyRCc7XG4gICAgb3V0cHV0ID0gJ2dsX0ZyYWdDb2xvcic7XG4gICAgZGVmaW5lT3V0cHV0ID0gJyc7XG4gICAgLy8gV2ViR0wxIGhhcyBubyBidWlsdCBpbiBpc25hbiBzbyB3ZSBkZWZpbmUgb25lIGhlcmUuXG4gICAgZGVmaW5lU3BlY2lhbE5hTiA9IGBcbiAgICAgICNkZWZpbmUgaXNuYW4odmFsdWUpIGlzbmFuX2N1c3RvbSh2YWx1ZSlcbiAgICAgIGJvb2wgaXNuYW5fY3VzdG9tKGZsb2F0IHZhbCkge1xuICAgICAgICByZXR1cm4gKHZhbCA+IDAuIHx8IHZhbCA8IDEuIHx8IHZhbCA9PSAwLikgPyBmYWxzZSA6IHRydWU7XG4gICAgICB9XG4gICAgICBidmVjNCBpc25hbl9jdXN0b20odmVjNCB2YWwpIHtcbiAgICAgICAgcmV0dXJuIGJ2ZWM0KGlzbmFuKHZhbC54KSwgaXNuYW4odmFsLnkpLCBpc25hbih2YWwueiksIGlzbmFuKHZhbC53KSk7XG4gICAgICB9XG4gICAgYDtcbiAgICBkZWZpbmVTcGVjaWFsSW5mID0gYFxuICAgICAgdW5pZm9ybSBmbG9hdCBJTkZJTklUWTtcblxuICAgICAgYm9vbCBpc2luZihmbG9hdCB2YWwpIHtcbiAgICAgICAgcmV0dXJuIGFicyh2YWwpID09IElORklOSVRZO1xuICAgICAgfVxuICAgICAgYnZlYzQgaXNpbmYodmVjNCB2YWwpIHtcbiAgICAgICAgcmV0dXJuIGVxdWFsKGFicyh2YWwpLCB2ZWM0KElORklOSVRZKSk7XG4gICAgICB9XG4gICAgYDtcbiAgICBkZWZpbmVSb3VuZCA9IGBcbiAgICAgIGludCByb3VuZChmbG9hdCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gaW50KGZsb29yKHZhbHVlICsgMC41KSk7XG4gICAgICB9XG5cbiAgICAgIGl2ZWM0IHJvdW5kKHZlYzQgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGl2ZWM0KGZsb29yKHZhbHVlICsgdmVjNCgwLjUpKSk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdmVyc2lvbixcbiAgICBhdHRyaWJ1dGUsXG4gICAgdmFyeWluZ1ZzLFxuICAgIHZhcnlpbmdGcyxcbiAgICB0ZXh0dXJlMkQsXG4gICAgb3V0cHV0LFxuICAgIGRlZmluZU91dHB1dCxcbiAgICBkZWZpbmVTcGVjaWFsTmFOLFxuICAgIGRlZmluZVNwZWNpYWxJbmYsXG4gICAgZGVmaW5lUm91bmRcbiAgfTtcbn1cbiJdfQ==