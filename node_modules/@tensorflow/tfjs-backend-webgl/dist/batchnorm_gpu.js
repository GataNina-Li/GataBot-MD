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
export class BatchNormProgram {
    constructor(xShape, meanShape, varianceShape, offsetShape, scaleShape, varianceEpsilon) {
        this.outputShape = [];
        this.variableNames = ['x', 'mean', 'variance'];
        backend_util.assertAndGetBroadcastShape(xShape, meanShape);
        backend_util.assertAndGetBroadcastShape(xShape, varianceShape);
        let offsetSnippet = '0.0';
        if (offsetShape != null) {
            backend_util.assertAndGetBroadcastShape(xShape, offsetShape);
            this.variableNames.push('offset');
            offsetSnippet = 'getOffsetAtOutCoords()';
        }
        let scaleSnippet = '1.0';
        if (scaleShape != null) {
            backend_util.assertAndGetBroadcastShape(xShape, scaleShape);
            this.variableNames.push('scale');
            scaleSnippet = 'getScaleAtOutCoords()';
        }
        this.outputShape = xShape;
        this.userCode = `
      void main() {
        float x = getXAtOutCoords();
        float mean = getMeanAtOutCoords();
        float variance = getVarianceAtOutCoords();
        float offset = ${offsetSnippet};
        float scale = ${scaleSnippet};
        float inv = scale * inversesqrt(variance + float(${varianceEpsilon}));
        setOutput(dot(vec3(x, -mean, offset), vec3(inv, inv, 1)));
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmF0Y2hub3JtX2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvYmF0Y2hub3JtX2dwdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFHbkQsTUFBTSxPQUFPLGdCQUFnQjtJQUszQixZQUNJLE1BQWdCLEVBQUUsU0FBbUIsRUFBRSxhQUF1QixFQUM5RCxXQUEwQixFQUFFLFVBQXlCLEVBQ3JELGVBQXVCO1FBTjNCLGdCQUFXLEdBQWEsRUFBRSxDQUFDO1FBT3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQy9DLFlBQVksQ0FBQywwQkFBMEIsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDM0QsWUFBWSxDQUFDLDBCQUEwQixDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztRQUUvRCxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDMUIsSUFBSSxXQUFXLElBQUksSUFBSSxFQUFFO1lBQ3ZCLFlBQVksQ0FBQywwQkFBMEIsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDN0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEMsYUFBYSxHQUFHLHdCQUF3QixDQUFDO1NBQzFDO1FBRUQsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLElBQUksVUFBVSxJQUFJLElBQUksRUFBRTtZQUN0QixZQUFZLENBQUMsMEJBQTBCLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2pDLFlBQVksR0FBRyx1QkFBdUIsQ0FBQztTQUN4QztRQUVELElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1FBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUc7Ozs7O3lCQUtLLGFBQWE7d0JBQ2QsWUFBWTsyREFDdUIsZUFBZTs7O0tBR3JFLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7YmFja2VuZF91dGlsfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0IHtHUEdQVVByb2dyYW19IGZyb20gJy4vZ3BncHVfbWF0aCc7XG5cbmV4cG9ydCBjbGFzcyBCYXRjaE5vcm1Qcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lczogc3RyaW5nW107XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXSA9IFtdO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgeFNoYXBlOiBudW1iZXJbXSwgbWVhblNoYXBlOiBudW1iZXJbXSwgdmFyaWFuY2VTaGFwZTogbnVtYmVyW10sXG4gICAgICBvZmZzZXRTaGFwZTogbnVtYmVyW118bnVsbCwgc2NhbGVTaGFwZTogbnVtYmVyW118bnVsbCxcbiAgICAgIHZhcmlhbmNlRXBzaWxvbjogbnVtYmVyKSB7XG4gICAgdGhpcy52YXJpYWJsZU5hbWVzID0gWyd4JywgJ21lYW4nLCAndmFyaWFuY2UnXTtcbiAgICBiYWNrZW5kX3V0aWwuYXNzZXJ0QW5kR2V0QnJvYWRjYXN0U2hhcGUoeFNoYXBlLCBtZWFuU2hhcGUpO1xuICAgIGJhY2tlbmRfdXRpbC5hc3NlcnRBbmRHZXRCcm9hZGNhc3RTaGFwZSh4U2hhcGUsIHZhcmlhbmNlU2hhcGUpO1xuXG4gICAgbGV0IG9mZnNldFNuaXBwZXQgPSAnMC4wJztcbiAgICBpZiAob2Zmc2V0U2hhcGUgIT0gbnVsbCkge1xuICAgICAgYmFja2VuZF91dGlsLmFzc2VydEFuZEdldEJyb2FkY2FzdFNoYXBlKHhTaGFwZSwgb2Zmc2V0U2hhcGUpO1xuICAgICAgdGhpcy52YXJpYWJsZU5hbWVzLnB1c2goJ29mZnNldCcpO1xuICAgICAgb2Zmc2V0U25pcHBldCA9ICdnZXRPZmZzZXRBdE91dENvb3JkcygpJztcbiAgICB9XG5cbiAgICBsZXQgc2NhbGVTbmlwcGV0ID0gJzEuMCc7XG4gICAgaWYgKHNjYWxlU2hhcGUgIT0gbnVsbCkge1xuICAgICAgYmFja2VuZF91dGlsLmFzc2VydEFuZEdldEJyb2FkY2FzdFNoYXBlKHhTaGFwZSwgc2NhbGVTaGFwZSk7XG4gICAgICB0aGlzLnZhcmlhYmxlTmFtZXMucHVzaCgnc2NhbGUnKTtcbiAgICAgIHNjYWxlU25pcHBldCA9ICdnZXRTY2FsZUF0T3V0Q29vcmRzKCknO1xuICAgIH1cblxuICAgIHRoaXMub3V0cHV0U2hhcGUgPSB4U2hhcGU7XG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgZmxvYXQgeCA9IGdldFhBdE91dENvb3JkcygpO1xuICAgICAgICBmbG9hdCBtZWFuID0gZ2V0TWVhbkF0T3V0Q29vcmRzKCk7XG4gICAgICAgIGZsb2F0IHZhcmlhbmNlID0gZ2V0VmFyaWFuY2VBdE91dENvb3JkcygpO1xuICAgICAgICBmbG9hdCBvZmZzZXQgPSAke29mZnNldFNuaXBwZXR9O1xuICAgICAgICBmbG9hdCBzY2FsZSA9ICR7c2NhbGVTbmlwcGV0fTtcbiAgICAgICAgZmxvYXQgaW52ID0gc2NhbGUgKiBpbnZlcnNlc3FydCh2YXJpYW5jZSArIGZsb2F0KCR7dmFyaWFuY2VFcHNpbG9ufSkpO1xuICAgICAgICBzZXRPdXRwdXQoZG90KHZlYzMoeCwgLW1lYW4sIG9mZnNldCksIHZlYzMoaW52LCBpbnYsIDEpKSk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuIl19