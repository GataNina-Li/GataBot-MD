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
import { getVecChannels } from './packing_util';
import { getCoordsDataType } from './shader_compiler';
export class TransposePackedProgram {
    constructor(aShape, newDim) {
        this.variableNames = ['A'];
        this.packedInputs = true;
        this.packedOutput = true;
        const outputShape = new Array(aShape.length);
        for (let i = 0; i < outputShape.length; i++) {
            outputShape[i] = aShape[newDim[i]];
        }
        this.outputShape = outputShape;
        this.rank = outputShape.length;
        if (this.rank > 6) {
            throw Error(`Packed transpose for rank ${this.rank} is not yet supported.`);
        }
        const dtype = getCoordsDataType(this.rank);
        const outputOrder = getVecChannels('rc', this.rank);
        const switchedOrder = new Array(this.rank);
        for (let i = 0; i < newDim.length; i++) {
            switchedOrder[newDim[i]] = outputOrder[i];
        }
        const innerDims = `vec2(${switchedOrder.slice(-2).join()})`;
        const nextColumn = `++${outputOrder[this.rank - 1]} < ${outputShape[this.rank - 1]}`;
        const getc = `getChannel(getA(${switchedOrder.join()}), ${innerDims})`;
        this.userCode = `
    void main() {
      ${dtype} rc = getOutputCoords();
      vec4 result = vec4(0.);
      result[0] = ${getc};
      if(${nextColumn}) {
        result[1] = ${getc};
      }
      --${outputOrder[this.rank - 1]};
      if(++${outputOrder[this.rank - 2]} < ${outputShape[this.rank - 2]}) {
        result[2] = ${getc};
        if(${nextColumn}) {
          result[3] = ${getc};
        }
      }
      setOutput(result);
    }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNwb3NlX3BhY2tlZF9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL3RyYW5zcG9zZV9wYWNrZWRfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUdILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUVwRCxNQUFNLE9BQU8sc0JBQXNCO0lBUWpDLFlBQVksTUFBZ0IsRUFBRSxNQUFnQjtRQVA5QyxrQkFBYSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFJdEIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFHbEIsTUFBTSxXQUFXLEdBQWEsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDcEM7UUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFDL0IsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRTtZQUNqQixNQUFNLEtBQUssQ0FDUCw2QkFBNkIsSUFBSSxDQUFDLElBQUksd0JBQXdCLENBQUMsQ0FBQztTQUNyRTtRQUNELE1BQU0sS0FBSyxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUzQyxNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwRCxNQUFNLGFBQWEsR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdEMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMzQztRQUNELE1BQU0sU0FBUyxHQUFHLFFBQVEsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUM7UUFDNUQsTUFBTSxVQUFVLEdBQ1osS0FBSyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3RFLE1BQU0sSUFBSSxHQUFHLG1CQUFtQixhQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sU0FBUyxHQUFHLENBQUM7UUFFdkUsSUFBSSxDQUFDLFFBQVEsR0FBRzs7UUFFWixLQUFLOztvQkFFTyxJQUFJO1dBQ2IsVUFBVTtzQkFDQyxJQUFJOztVQUVoQixXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7YUFDdkIsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO3NCQUNqRCxJQUFJO2FBQ2IsVUFBVTt3QkFDQyxJQUFJOzs7OztLQUt2QixDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0dQR1BVUHJvZ3JhbX0gZnJvbSAnLi9ncGdwdV9tYXRoJztcbmltcG9ydCB7Z2V0VmVjQ2hhbm5lbHN9IGZyb20gJy4vcGFja2luZ191dGlsJztcbmltcG9ydCB7Z2V0Q29vcmRzRGF0YVR5cGV9IGZyb20gJy4vc2hhZGVyX2NvbXBpbGVyJztcblxuZXhwb3J0IGNsYXNzIFRyYW5zcG9zZVBhY2tlZFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWydBJ107XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXTtcbiAgdXNlckNvZGU6IHN0cmluZztcbiAgcmFuazogbnVtYmVyO1xuICBwYWNrZWRJbnB1dHMgPSB0cnVlO1xuICBwYWNrZWRPdXRwdXQgPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKGFTaGFwZTogbnVtYmVyW10sIG5ld0RpbTogbnVtYmVyW10pIHtcbiAgICBjb25zdCBvdXRwdXRTaGFwZTogbnVtYmVyW10gPSBuZXcgQXJyYXkoYVNoYXBlLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdXRwdXRTaGFwZS5sZW5ndGg7IGkrKykge1xuICAgICAgb3V0cHV0U2hhcGVbaV0gPSBhU2hhcGVbbmV3RGltW2ldXTtcbiAgICB9XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IG91dHB1dFNoYXBlO1xuICAgIHRoaXMucmFuayA9IG91dHB1dFNoYXBlLmxlbmd0aDtcbiAgICBpZiAodGhpcy5yYW5rID4gNikge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgYFBhY2tlZCB0cmFuc3Bvc2UgZm9yIHJhbmsgJHt0aGlzLnJhbmt9IGlzIG5vdCB5ZXQgc3VwcG9ydGVkLmApO1xuICAgIH1cbiAgICBjb25zdCBkdHlwZSA9IGdldENvb3Jkc0RhdGFUeXBlKHRoaXMucmFuayk7XG5cbiAgICBjb25zdCBvdXRwdXRPcmRlciA9IGdldFZlY0NoYW5uZWxzKCdyYycsIHRoaXMucmFuayk7XG4gICAgY29uc3Qgc3dpdGNoZWRPcmRlciA9IG5ldyBBcnJheSh0aGlzLnJhbmspO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3RGltLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzd2l0Y2hlZE9yZGVyW25ld0RpbVtpXV0gPSBvdXRwdXRPcmRlcltpXTtcbiAgICB9XG4gICAgY29uc3QgaW5uZXJEaW1zID0gYHZlYzIoJHtzd2l0Y2hlZE9yZGVyLnNsaWNlKC0yKS5qb2luKCl9KWA7XG4gICAgY29uc3QgbmV4dENvbHVtbiA9XG4gICAgICAgIGArKyR7b3V0cHV0T3JkZXJbdGhpcy5yYW5rIC0gMV19IDwgJHtvdXRwdXRTaGFwZVt0aGlzLnJhbmsgLSAxXX1gO1xuICAgIGNvbnN0IGdldGMgPSBgZ2V0Q2hhbm5lbChnZXRBKCR7c3dpdGNoZWRPcmRlci5qb2luKCl9KSwgJHtpbm5lckRpbXN9KWA7XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICR7ZHR5cGV9IHJjID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gICAgICB2ZWM0IHJlc3VsdCA9IHZlYzQoMC4pO1xuICAgICAgcmVzdWx0WzBdID0gJHtnZXRjfTtcbiAgICAgIGlmKCR7bmV4dENvbHVtbn0pIHtcbiAgICAgICAgcmVzdWx0WzFdID0gJHtnZXRjfTtcbiAgICAgIH1cbiAgICAgIC0tJHtvdXRwdXRPcmRlclt0aGlzLnJhbmsgLSAxXX07XG4gICAgICBpZigrKyR7b3V0cHV0T3JkZXJbdGhpcy5yYW5rIC0gMl19IDwgJHtvdXRwdXRTaGFwZVt0aGlzLnJhbmsgLSAyXX0pIHtcbiAgICAgICAgcmVzdWx0WzJdID0gJHtnZXRjfTtcbiAgICAgICAgaWYoJHtuZXh0Q29sdW1ufSkge1xuICAgICAgICAgIHJlc3VsdFszXSA9ICR7Z2V0Y307XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNldE91dHB1dChyZXN1bHQpO1xuICAgIH1cbiAgICBgO1xuICB9XG59XG4iXX0=