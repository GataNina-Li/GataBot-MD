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
import { backend_util } from '@tensorflow/tfjs-core';
import { useShapeUniforms } from './gpgpu_math';
export const CHECK_NAN_SNIPPET = `
  if (isnan(a)) return a;
  if (isnan(b)) return b;
`;
export const SQUARED_DIFFERENCE = 'return (a - b) * (a - b);';
export class BinaryOpProgram {
    constructor(op, aShape, bShape) {
        this.variableNames = ['A', 'B'];
        this.outputShape = backend_util.assertAndGetBroadcastShape(aShape, bShape);
        this.enableShapeUniforms = useShapeUniforms(this.outputShape.length);
        this.userCode = `
      float binaryOperation(float a, float b) {
        ${op}
      }

      void main() {
        float a = getAAtOutCoords();
        float b = getBAtOutCoords();
        setOutput(binaryOperation(a, b));
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluYXJ5b3BfZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9iaW5hcnlvcF9ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRW5ELE9BQU8sRUFBZSxnQkFBZ0IsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUU1RCxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRzs7O0NBR2hDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRywyQkFBMkIsQ0FBQztBQUM5RCxNQUFNLE9BQU8sZUFBZTtJQU0xQixZQUFZLEVBQVUsRUFBRSxNQUFnQixFQUFFLE1BQWdCO1FBTDFELGtCQUFhLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFNekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUMsMEJBQTBCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxRQUFRLEdBQUc7O1VBRVYsRUFBRTs7Ozs7Ozs7S0FRUCxDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2JhY2tlbmRfdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtHUEdQVVByb2dyYW0sIHVzZVNoYXBlVW5pZm9ybXN9IGZyb20gJy4vZ3BncHVfbWF0aCc7XG5cbmV4cG9ydCBjb25zdCBDSEVDS19OQU5fU05JUFBFVCA9IGBcbiAgaWYgKGlzbmFuKGEpKSByZXR1cm4gYTtcbiAgaWYgKGlzbmFuKGIpKSByZXR1cm4gYjtcbmA7XG5cbmV4cG9ydCBjb25zdCBTUVVBUkVEX0RJRkZFUkVOQ0UgPSAncmV0dXJuIChhIC0gYikgKiAoYSAtIGIpOyc7XG5leHBvcnQgY2xhc3MgQmluYXJ5T3BQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsnQScsICdCJ107XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXTtcbiAgdXNlckNvZGU6IHN0cmluZztcbiAgZW5hYmxlU2hhcGVVbmlmb3JtczogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihvcDogc3RyaW5nLCBhU2hhcGU6IG51bWJlcltdLCBiU2hhcGU6IG51bWJlcltdKSB7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IGJhY2tlbmRfdXRpbC5hc3NlcnRBbmRHZXRCcm9hZGNhc3RTaGFwZShhU2hhcGUsIGJTaGFwZSk7XG4gICAgdGhpcy5lbmFibGVTaGFwZVVuaWZvcm1zID0gdXNlU2hhcGVVbmlmb3Jtcyh0aGlzLm91dHB1dFNoYXBlLmxlbmd0aCk7XG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgIGZsb2F0IGJpbmFyeU9wZXJhdGlvbihmbG9hdCBhLCBmbG9hdCBiKSB7XG4gICAgICAgICR7b3B9XG4gICAgICB9XG5cbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgZmxvYXQgYSA9IGdldEFBdE91dENvb3JkcygpO1xuICAgICAgICBmbG9hdCBiID0gZ2V0QkF0T3V0Q29vcmRzKCk7XG4gICAgICAgIHNldE91dHB1dChiaW5hcnlPcGVyYXRpb24oYSwgYikpO1xuICAgICAgfVxuICAgIGA7XG4gIH1cbn1cbiJdfQ==