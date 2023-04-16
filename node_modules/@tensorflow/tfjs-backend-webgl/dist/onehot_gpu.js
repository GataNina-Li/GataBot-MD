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
export class OneHotProgram {
    constructor(numIndices, depth, onValue, offValue) {
        this.variableNames = ['indices'];
        this.outputShape = [numIndices, depth];
        this.userCode = `
      void main() {
        ivec2 coords = getOutputCoords();
        int index = round(getIndices(coords.x));
        setOutput(mix(float(${offValue}), float(${onValue}),
                      float(index == coords.y)));
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25laG90X2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvb25laG90X2dwdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFJSCxNQUFNLE9BQU8sYUFBYTtJQVF4QixZQUNJLFVBQWtCLEVBQUUsS0FBYSxFQUFFLE9BQWUsRUFBRSxRQUFnQjtRQVJ4RSxrQkFBYSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFTMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV2QyxJQUFJLENBQUMsUUFBUSxHQUFHOzs7OzhCQUlVLFFBQVEsWUFBWSxPQUFPOzs7S0FHcEQsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtHUEdQVVByb2dyYW19IGZyb20gJy4vZ3BncHVfbWF0aCc7XG5cbmV4cG9ydCBjbGFzcyBPbmVIb3RQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsnaW5kaWNlcyddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG5cbiAgLy8gQ2FjaGluZyB1bmlmb3JtIGxvY2F0aW9uIGZvciBzcGVlZC5cbiAgc2VlZExvYzogV2ViR0xVbmlmb3JtTG9jYXRpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBudW1JbmRpY2VzOiBudW1iZXIsIGRlcHRoOiBudW1iZXIsIG9uVmFsdWU6IG51bWJlciwgb2ZmVmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBbbnVtSW5kaWNlcywgZGVwdGhdO1xuXG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgaXZlYzIgY29vcmRzID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gICAgICAgIGludCBpbmRleCA9IHJvdW5kKGdldEluZGljZXMoY29vcmRzLngpKTtcbiAgICAgICAgc2V0T3V0cHV0KG1peChmbG9hdCgke29mZlZhbHVlfSksIGZsb2F0KCR7b25WYWx1ZX0pLFxuICAgICAgICAgICAgICAgICAgICAgIGZsb2F0KGluZGV4ID09IGNvb3Jkcy55KSkpO1xuICAgICAgfVxuICAgIGA7XG4gIH1cbn1cbiJdfQ==