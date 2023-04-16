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
export class ConcatProgram {
    // Concats 2d tensors along axis=1. See comments in MathBackendWebGL.concat().
    constructor(shapes) {
        this.outputShape = [];
        this.outputShape = backend_util.computeOutShape(shapes, 1 /* axis */);
        this.variableNames = shapes.map((_, i) => `T${i}`);
        const offsets = new Array(shapes.length - 1);
        offsets[0] = shapes[0][1];
        for (let i = 1; i < offsets.length; i++) {
            offsets[i] = offsets[i - 1] + shapes[i][1];
        }
        const snippets = [`if (yC < ${offsets[0]}) setOutput(getT0(yR, yC));`];
        for (let i = 1; i < offsets.length; i++) {
            const shift = offsets[i - 1];
            snippets.push(`else if (yC < ${offsets[i]}) ` +
                `setOutput(getT${i}(yR, yC-${shift}));`);
        }
        const lastIndex = offsets.length;
        const lastShift = offsets[offsets.length - 1];
        snippets.push(`else setOutput(getT${lastIndex}(yR, yC-${lastShift}));`);
        this.userCode = `
      void main() {
        ivec2 coords = getOutputCoords();
        int yR = coords.x;
        int yC = coords.y;

        ${snippets.join('\n        ')}
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY2F0X2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvY29uY2F0X2dwdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFHbkQsTUFBTSxPQUFPLGFBQWE7SUFLeEIsOEVBQThFO0lBQzlFLFlBQVksTUFBK0I7UUFKM0MsZ0JBQVcsR0FBYSxFQUFFLENBQUM7UUFLekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRW5ELE1BQU0sT0FBTyxHQUFhLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdkQsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN2QyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDNUM7UUFFRCxNQUFNLFFBQVEsR0FBRyxDQUFDLFlBQVksT0FBTyxDQUFDLENBQUMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBQ3ZFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3ZDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDN0IsUUFBUSxDQUFDLElBQUksQ0FDVCxpQkFBaUIsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJO2dCQUMvQixpQkFBaUIsQ0FBQyxXQUFXLEtBQUssS0FBSyxDQUFDLENBQUM7U0FDOUM7UUFDRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ2pDLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzlDLFFBQVEsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLFNBQVMsV0FBVyxTQUFTLEtBQUssQ0FBQyxDQUFDO1FBRXhFLElBQUksQ0FBQyxRQUFRLEdBQUc7Ozs7OztVQU1WLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDOztLQUVoQyxDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2JhY2tlbmRfdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuXG5leHBvcnQgY2xhc3MgQ29uY2F0UHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXM6IHN0cmluZ1tdO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW10gPSBbXTtcbiAgdXNlckNvZGU6IHN0cmluZztcblxuICAvLyBDb25jYXRzIDJkIHRlbnNvcnMgYWxvbmcgYXhpcz0xLiBTZWUgY29tbWVudHMgaW4gTWF0aEJhY2tlbmRXZWJHTC5jb25jYXQoKS5cbiAgY29uc3RydWN0b3Ioc2hhcGVzOiBBcnJheTxbbnVtYmVyLCBudW1iZXJdPikge1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBiYWNrZW5kX3V0aWwuY29tcHV0ZU91dFNoYXBlKHNoYXBlcywgMSAvKiBheGlzICovKTtcbiAgICB0aGlzLnZhcmlhYmxlTmFtZXMgPSBzaGFwZXMubWFwKChfLCBpKSA9PiBgVCR7aX1gKTtcblxuICAgIGNvbnN0IG9mZnNldHM6IG51bWJlcltdID0gbmV3IEFycmF5KHNoYXBlcy5sZW5ndGggLSAxKTtcbiAgICBvZmZzZXRzWzBdID0gc2hhcGVzWzBdWzFdO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgb2Zmc2V0cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2Zmc2V0c1tpXSA9IG9mZnNldHNbaSAtIDFdICsgc2hhcGVzW2ldWzFdO1xuICAgIH1cblxuICAgIGNvbnN0IHNuaXBwZXRzID0gW2BpZiAoeUMgPCAke29mZnNldHNbMF19KSBzZXRPdXRwdXQoZ2V0VDAoeVIsIHlDKSk7YF07XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBvZmZzZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBzaGlmdCA9IG9mZnNldHNbaSAtIDFdO1xuICAgICAgc25pcHBldHMucHVzaChcbiAgICAgICAgICBgZWxzZSBpZiAoeUMgPCAke29mZnNldHNbaV19KSBgICtcbiAgICAgICAgICBgc2V0T3V0cHV0KGdldFQke2l9KHlSLCB5Qy0ke3NoaWZ0fSkpO2ApO1xuICAgIH1cbiAgICBjb25zdCBsYXN0SW5kZXggPSBvZmZzZXRzLmxlbmd0aDtcbiAgICBjb25zdCBsYXN0U2hpZnQgPSBvZmZzZXRzW29mZnNldHMubGVuZ3RoIC0gMV07XG4gICAgc25pcHBldHMucHVzaChgZWxzZSBzZXRPdXRwdXQoZ2V0VCR7bGFzdEluZGV4fSh5UiwgeUMtJHtsYXN0U2hpZnR9KSk7YCk7XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICBpdmVjMiBjb29yZHMgPSBnZXRPdXRwdXRDb29yZHMoKTtcbiAgICAgICAgaW50IHlSID0gY29vcmRzLng7XG4gICAgICAgIGludCB5QyA9IGNvb3Jkcy55O1xuXG4gICAgICAgICR7c25pcHBldHMuam9pbignXFxuICAgICAgICAnKX1cbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG4iXX0=