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
export class ClipProgram {
    constructor(aShape) {
        this.variableNames = ['A'];
        this.customUniforms = [
            { name: 'minVal', type: 'float' },
            { name: 'maxVal', type: 'float' }
        ];
        this.outputShape = aShape;
        this.userCode = `

      void main() {
        float value = getAAtOutCoords();
        if (isnan(value)) {
          setOutput(value);
          return;
        }

        setOutput(clamp(value, minVal, maxVal));
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpcF9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2NsaXBfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUtILE1BQU0sT0FBTyxXQUFXO0lBU3RCLFlBQVksTUFBZ0I7UUFSNUIsa0JBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBR3RCLG1CQUFjLEdBQUc7WUFDZixFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQXNCLEVBQUM7WUFDOUMsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFzQixFQUFDO1NBQy9DLENBQUM7UUFHQSxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztRQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHOzs7Ozs7Ozs7OztLQVdmLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuaW1wb3J0IHtVbmlmb3JtVHlwZX0gZnJvbSAnLi9zaGFkZXJfY29tcGlsZXInO1xuXG5leHBvcnQgY2xhc3MgQ2xpcFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWydBJ107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXTtcbiAgY3VzdG9tVW5pZm9ybXMgPSBbXG4gICAge25hbWU6ICdtaW5WYWwnLCB0eXBlOiAnZmxvYXQnIGFzIFVuaWZvcm1UeXBlfSxcbiAgICB7bmFtZTogJ21heFZhbCcsIHR5cGU6ICdmbG9hdCcgYXMgVW5pZm9ybVR5cGV9XG4gIF07XG5cbiAgY29uc3RydWN0b3IoYVNoYXBlOiBudW1iZXJbXSkge1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBhU2hhcGU7XG4gICAgdGhpcy51c2VyQ29kZSA9IGBcblxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICBmbG9hdCB2YWx1ZSA9IGdldEFBdE91dENvb3JkcygpO1xuICAgICAgICBpZiAoaXNuYW4odmFsdWUpKSB7XG4gICAgICAgICAgc2V0T3V0cHV0KHZhbHVlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZXRPdXRwdXQoY2xhbXAodmFsdWUsIG1pblZhbCwgbWF4VmFsKSk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuIl19