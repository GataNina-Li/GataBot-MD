/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
export class FillProgram {
    constructor(shape, value) {
        this.outputShape = [];
        this.customUniforms = [{ name: 'value', type: 'float' }];
        this.variableNames = ['x'];
        this.outputShape = shape;
        this.userCode = `
      void main() {
        // Input can be obtained from uniform value.
        setOutput(value);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsbF9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2ZpbGxfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUtILE1BQU0sT0FBTyxXQUFXO0lBTXRCLFlBQVksS0FBZSxFQUFFLEtBQWE7UUFKMUMsZ0JBQVcsR0FBYSxFQUFFLENBQUM7UUFFM0IsbUJBQWMsR0FBRyxDQUFDLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBc0IsRUFBQyxDQUFDLENBQUM7UUFHL0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBRXpCLElBQUksQ0FBQyxRQUFRLEdBQUc7Ozs7O0tBS2YsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtHUEdQVVByb2dyYW19IGZyb20gJy4vZ3BncHVfbWF0aCc7XG5pbXBvcnQge1VuaWZvcm1UeXBlfSBmcm9tICcuL3NoYWRlcl9jb21waWxlcic7XG5cbmV4cG9ydCBjbGFzcyBGaWxsUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXM6IHN0cmluZ1tdO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW10gPSBbXTtcbiAgdXNlckNvZGU6IHN0cmluZztcbiAgY3VzdG9tVW5pZm9ybXMgPSBbe25hbWU6ICd2YWx1ZScsIHR5cGU6ICdmbG9hdCcgYXMgVW5pZm9ybVR5cGV9XTtcblxuICBjb25zdHJ1Y3RvcihzaGFwZTogbnVtYmVyW10sIHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLnZhcmlhYmxlTmFtZXMgPSBbJ3gnXTtcbiAgICB0aGlzLm91dHB1dFNoYXBlID0gc2hhcGU7XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICAvLyBJbnB1dCBjYW4gYmUgb2J0YWluZWQgZnJvbSB1bmlmb3JtIHZhbHVlLlxuICAgICAgICBzZXRPdXRwdXQodmFsdWUpO1xuICAgICAgfVxuICAgIGA7XG4gIH1cbn1cbiJdfQ==