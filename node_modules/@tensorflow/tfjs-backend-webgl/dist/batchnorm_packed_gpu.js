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
import { backend_util } from '@tensorflow/tfjs-core';
export class BatchNormPackedProgram {
    constructor(xShape, meanShape, varianceShape, offsetShape, scaleShape, varianceEpsilon) {
        this.packedInputs = true;
        this.packedOutput = true;
        this.variableNames = ['x', 'mean', 'variance'];
        backend_util.assertAndGetBroadcastShape(xShape, meanShape);
        backend_util.assertAndGetBroadcastShape(xShape, varianceShape);
        let offsetSnippet = 'vec4(0.0)';
        if (offsetShape != null) {
            backend_util.assertAndGetBroadcastShape(xShape, offsetShape);
            this.variableNames.push('offset');
            offsetSnippet = 'getOffsetAtOutCoords()';
        }
        let scaleSnippet = 'vec4(1.0)';
        if (scaleShape != null) {
            backend_util.assertAndGetBroadcastShape(xShape, scaleShape);
            this.variableNames.push('scale');
            scaleSnippet = 'getScaleAtOutCoords()';
        }
        this.outputShape = xShape;
        this.userCode = `
      void main() {
        vec4 offset = ${offsetSnippet};
        vec4 scale = ${scaleSnippet};

        vec4 x = getXAtOutCoords();
        vec4 mean = getMeanAtOutCoords();
        vec4 variance = getVarianceAtOutCoords();

        vec4 inv = scale * inversesqrt(variance + vec4(${varianceEpsilon}));

        setOutput((x - mean) * inv + offset);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmF0Y2hub3JtX3BhY2tlZF9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2JhdGNobm9ybV9wYWNrZWRfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUduRCxNQUFNLE9BQU8sc0JBQXNCO0lBT2pDLFlBQ0ksTUFBZ0IsRUFBRSxTQUFtQixFQUFFLGFBQXVCLEVBQzlELFdBQTBCLEVBQUUsVUFBeUIsRUFDckQsZUFBdUI7UUFOM0IsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFNbEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDL0MsWUFBWSxDQUFDLDBCQUEwQixDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMzRCxZQUFZLENBQUMsMEJBQTBCLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBRS9ELElBQUksYUFBYSxHQUFHLFdBQVcsQ0FBQztRQUNoQyxJQUFJLFdBQVcsSUFBSSxJQUFJLEVBQUU7WUFDdkIsWUFBWSxDQUFDLDBCQUEwQixDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztZQUM3RCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsQyxhQUFhLEdBQUcsd0JBQXdCLENBQUM7U0FDMUM7UUFFRCxJQUFJLFlBQVksR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxVQUFVLElBQUksSUFBSSxFQUFFO1lBQ3RCLFlBQVksQ0FBQywwQkFBMEIsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDNUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDakMsWUFBWSxHQUFHLHVCQUF1QixDQUFDO1NBQ3hDO1FBRUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7UUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRzs7d0JBRUksYUFBYTt1QkFDZCxZQUFZOzs7Ozs7eURBTXNCLGVBQWU7Ozs7S0FJbkUsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtiYWNrZW5kX3V0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5pbXBvcnQge0dQR1BVUHJvZ3JhbX0gZnJvbSAnLi9ncGdwdV9tYXRoJztcblxuZXhwb3J0IGNsYXNzIEJhdGNoTm9ybVBhY2tlZFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzOiBzdHJpbmdbXTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuICBwYWNrZWRJbnB1dHMgPSB0cnVlO1xuICBwYWNrZWRPdXRwdXQgPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgeFNoYXBlOiBudW1iZXJbXSwgbWVhblNoYXBlOiBudW1iZXJbXSwgdmFyaWFuY2VTaGFwZTogbnVtYmVyW10sXG4gICAgICBvZmZzZXRTaGFwZTogbnVtYmVyW118bnVsbCwgc2NhbGVTaGFwZTogbnVtYmVyW118bnVsbCxcbiAgICAgIHZhcmlhbmNlRXBzaWxvbjogbnVtYmVyKSB7XG4gICAgdGhpcy52YXJpYWJsZU5hbWVzID0gWyd4JywgJ21lYW4nLCAndmFyaWFuY2UnXTtcbiAgICBiYWNrZW5kX3V0aWwuYXNzZXJ0QW5kR2V0QnJvYWRjYXN0U2hhcGUoeFNoYXBlLCBtZWFuU2hhcGUpO1xuICAgIGJhY2tlbmRfdXRpbC5hc3NlcnRBbmRHZXRCcm9hZGNhc3RTaGFwZSh4U2hhcGUsIHZhcmlhbmNlU2hhcGUpO1xuXG4gICAgbGV0IG9mZnNldFNuaXBwZXQgPSAndmVjNCgwLjApJztcbiAgICBpZiAob2Zmc2V0U2hhcGUgIT0gbnVsbCkge1xuICAgICAgYmFja2VuZF91dGlsLmFzc2VydEFuZEdldEJyb2FkY2FzdFNoYXBlKHhTaGFwZSwgb2Zmc2V0U2hhcGUpO1xuICAgICAgdGhpcy52YXJpYWJsZU5hbWVzLnB1c2goJ29mZnNldCcpO1xuICAgICAgb2Zmc2V0U25pcHBldCA9ICdnZXRPZmZzZXRBdE91dENvb3JkcygpJztcbiAgICB9XG5cbiAgICBsZXQgc2NhbGVTbmlwcGV0ID0gJ3ZlYzQoMS4wKSc7XG4gICAgaWYgKHNjYWxlU2hhcGUgIT0gbnVsbCkge1xuICAgICAgYmFja2VuZF91dGlsLmFzc2VydEFuZEdldEJyb2FkY2FzdFNoYXBlKHhTaGFwZSwgc2NhbGVTaGFwZSk7XG4gICAgICB0aGlzLnZhcmlhYmxlTmFtZXMucHVzaCgnc2NhbGUnKTtcbiAgICAgIHNjYWxlU25pcHBldCA9ICdnZXRTY2FsZUF0T3V0Q29vcmRzKCknO1xuICAgIH1cblxuICAgIHRoaXMub3V0cHV0U2hhcGUgPSB4U2hhcGU7XG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgdmVjNCBvZmZzZXQgPSAke29mZnNldFNuaXBwZXR9O1xuICAgICAgICB2ZWM0IHNjYWxlID0gJHtzY2FsZVNuaXBwZXR9O1xuXG4gICAgICAgIHZlYzQgeCA9IGdldFhBdE91dENvb3JkcygpO1xuICAgICAgICB2ZWM0IG1lYW4gPSBnZXRNZWFuQXRPdXRDb29yZHMoKTtcbiAgICAgICAgdmVjNCB2YXJpYW5jZSA9IGdldFZhcmlhbmNlQXRPdXRDb29yZHMoKTtcblxuICAgICAgICB2ZWM0IGludiA9IHNjYWxlICogaW52ZXJzZXNxcnQodmFyaWFuY2UgKyB2ZWM0KCR7dmFyaWFuY2VFcHNpbG9ufSkpO1xuXG4gICAgICAgIHNldE91dHB1dCgoeCAtIG1lYW4pICogaW52ICsgb2Zmc2V0KTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG4iXX0=