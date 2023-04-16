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
import { backend_util, util } from '@tensorflow/tfjs-core';
import { useShapeUniforms } from './gpgpu_math';
import { getChannels } from './packing_util';
import { getCoordsDataType } from './shader_compiler';
export const CHECK_NAN_SNIPPET_PACKED = `
  result.r = isNaN.r ? NAN : result.r;
  result.g = isNaN.g ? NAN : result.g;
  result.b = isNaN.b ? NAN : result.b;
  result.a = isNaN.a ? NAN : result.a;
`;
export const ELU_DER = `
  vec4 bGTEZero = vec4(greaterThanEqual(b, vec4(0.)));
  return (bGTEZero * a) + ((vec4(1.0) - bGTEZero) * (a * (b + vec4(1.0))));
`;
export const NOT_EQUAL = `
  return vec4(notEqual(a, b));
`;
export class BinaryOpPackedProgram {
    constructor(op, aShape, bShape, checkOutOfBounds = false) {
        this.variableNames = ['A', 'B'];
        this.supportsBroadcasting = true;
        this.packedInputs = true;
        this.packedOutput = true;
        this.outputShape = backend_util.assertAndGetBroadcastShape(aShape, bShape);
        const rank = this.outputShape.length;
        this.enableShapeUniforms = useShapeUniforms(rank);
        let checkOutOfBoundsString = '';
        if (checkOutOfBounds) {
            if (rank === 0 || util.sizeFromShape(this.outputShape) === 1) {
                checkOutOfBoundsString = `
          result.y = 0.;
          result.z = 0.;
          result.w = 0.;
        `;
            }
            else {
                const dtype = getCoordsDataType(rank);
                checkOutOfBoundsString = `
          ${dtype} coords = getOutputCoords();
        `;
                if (rank === 1) {
                    if (this.enableShapeUniforms) {
                        checkOutOfBoundsString += `
            result.y = (coords + 1) >= outShape ? 0. : result.y;
            result.z = 0.;
            result.w = 0.;
          `;
                    }
                    else {
                        checkOutOfBoundsString += `
            result.y = (coords + 1) >= ${this.outputShape[0]} ? 0. : result.y;
            result.z = 0.;
            result.w = 0.;
          `;
                    }
                }
                else {
                    const channels = getChannels('coords', rank);
                    if (this.enableShapeUniforms) {
                        checkOutOfBoundsString += `
            bool nextRowOutOfBounds =
              (${channels[rank - 2]} + 1) >= outShape[${rank} - 2];
            bool nextColOutOfBounds =
              (${channels[rank - 1]} + 1) >= outShape[${rank} - 1];
            result.y = nextColOutOfBounds ? 0. : result.y;
            result.z = nextRowOutOfBounds ? 0. : result.z;
            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;
          `;
                    }
                    else {
                        checkOutOfBoundsString += `
            bool nextRowOutOfBounds =
              (${channels[rank - 2]} + 1) >= ${this.outputShape[rank - 2]};
            bool nextColOutOfBounds =
              (${channels[rank - 1]} + 1) >= ${this.outputShape[rank - 1]};
            result.y = nextColOutOfBounds ? 0. : result.y;
            result.z = nextRowOutOfBounds ? 0. : result.z;
            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;
          `;
                    }
                }
            }
        }
        this.userCode = `
      vec4 binaryOperation(vec4 a, vec4 b) {
        ${op}
      }

      void main() {
        vec4 a = getAAtOutCoords();
        vec4 b = getBAtOutCoords();

        vec4 result = binaryOperation(a, b);
        ${checkOutOfBoundsString}

        setOutput(result);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluYXJ5b3BfcGFja2VkX2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvYmluYXJ5b3BfcGFja2VkX2dwdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFFLElBQUksRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRXpELE9BQU8sRUFBZSxnQkFBZ0IsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUM1RCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFcEQsTUFBTSxDQUFDLE1BQU0sd0JBQXdCLEdBQUc7Ozs7O0NBS3ZDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUc7OztDQUd0QixDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFHOztDQUV4QixDQUFDO0FBRUYsTUFBTSxPQUFPLHFCQUFxQjtJQVNoQyxZQUNJLEVBQVUsRUFBRSxNQUFnQixFQUFFLE1BQWdCLEVBQzlDLGdCQUFnQixHQUFHLEtBQUs7UUFWNUIsa0JBQWEsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUczQix5QkFBb0IsR0FBRyxJQUFJLENBQUM7UUFDNUIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFNbEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUMsMEJBQTBCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNFLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsRCxJQUFJLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztRQUNoQyxJQUFJLGdCQUFnQixFQUFFO1lBQ3BCLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzVELHNCQUFzQixHQUFHOzs7O1NBSXhCLENBQUM7YUFDSDtpQkFBTTtnQkFDTCxNQUFNLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEMsc0JBQXNCLEdBQUc7WUFDckIsS0FBSztTQUNSLENBQUM7Z0JBQ0YsSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFO29CQUNkLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO3dCQUM1QixzQkFBc0IsSUFBSTs7OztXQUkzQixDQUFDO3FCQUNEO3lCQUFNO3dCQUNMLHNCQUFzQixJQUFJO3lDQUNHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDOzs7V0FHakQsQ0FBQztxQkFDRDtpQkFDRjtxQkFBTTtvQkFDTCxNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUM3QyxJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRTt3QkFDNUIsc0JBQXNCLElBQUk7O2lCQUVyQixRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsSUFBSTs7aUJBRTNDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixJQUFJOzs7O1dBSWpELENBQUM7cUJBQ0Q7eUJBQU07d0JBQ0wsc0JBQXNCLElBQUk7O2lCQUVyQixRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxZQUFZLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQzs7aUJBRXhELFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFlBQVksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDOzs7O1dBSTlELENBQUM7cUJBQ0Q7aUJBQ0Y7YUFDRjtTQUNGO1FBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRzs7VUFFVixFQUFFOzs7Ozs7OztVQVFGLHNCQUFzQjs7OztLQUkzQixDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2JhY2tlbmRfdXRpbCwgdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtHUEdQVVByb2dyYW0sIHVzZVNoYXBlVW5pZm9ybXN9IGZyb20gJy4vZ3BncHVfbWF0aCc7XG5pbXBvcnQge2dldENoYW5uZWxzfSBmcm9tICcuL3BhY2tpbmdfdXRpbCc7XG5pbXBvcnQge2dldENvb3Jkc0RhdGFUeXBlfSBmcm9tICcuL3NoYWRlcl9jb21waWxlcic7XG5cbmV4cG9ydCBjb25zdCBDSEVDS19OQU5fU05JUFBFVF9QQUNLRUQgPSBgXG4gIHJlc3VsdC5yID0gaXNOYU4uciA/IE5BTiA6IHJlc3VsdC5yO1xuICByZXN1bHQuZyA9IGlzTmFOLmcgPyBOQU4gOiByZXN1bHQuZztcbiAgcmVzdWx0LmIgPSBpc05hTi5iID8gTkFOIDogcmVzdWx0LmI7XG4gIHJlc3VsdC5hID0gaXNOYU4uYSA/IE5BTiA6IHJlc3VsdC5hO1xuYDtcblxuZXhwb3J0IGNvbnN0IEVMVV9ERVIgPSBgXG4gIHZlYzQgYkdURVplcm8gPSB2ZWM0KGdyZWF0ZXJUaGFuRXF1YWwoYiwgdmVjNCgwLikpKTtcbiAgcmV0dXJuIChiR1RFWmVybyAqIGEpICsgKCh2ZWM0KDEuMCkgLSBiR1RFWmVybykgKiAoYSAqIChiICsgdmVjNCgxLjApKSkpO1xuYDtcblxuZXhwb3J0IGNvbnN0IE5PVF9FUVVBTCA9IGBcbiAgcmV0dXJuIHZlYzQobm90RXF1YWwoYSwgYikpO1xuYDtcblxuZXhwb3J0IGNsYXNzIEJpbmFyeU9wUGFja2VkUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ0EnLCAnQiddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG4gIHN1cHBvcnRzQnJvYWRjYXN0aW5nID0gdHJ1ZTtcbiAgcGFja2VkSW5wdXRzID0gdHJ1ZTtcbiAgcGFja2VkT3V0cHV0ID0gdHJ1ZTtcbiAgZW5hYmxlU2hhcGVVbmlmb3JtczogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIG9wOiBzdHJpbmcsIGFTaGFwZTogbnVtYmVyW10sIGJTaGFwZTogbnVtYmVyW10sXG4gICAgICBjaGVja091dE9mQm91bmRzID0gZmFsc2UpIHtcbiAgICB0aGlzLm91dHB1dFNoYXBlID0gYmFja2VuZF91dGlsLmFzc2VydEFuZEdldEJyb2FkY2FzdFNoYXBlKGFTaGFwZSwgYlNoYXBlKTtcbiAgICBjb25zdCByYW5rID0gdGhpcy5vdXRwdXRTaGFwZS5sZW5ndGg7XG4gICAgdGhpcy5lbmFibGVTaGFwZVVuaWZvcm1zID0gdXNlU2hhcGVVbmlmb3JtcyhyYW5rKTtcbiAgICBsZXQgY2hlY2tPdXRPZkJvdW5kc1N0cmluZyA9ICcnO1xuICAgIGlmIChjaGVja091dE9mQm91bmRzKSB7XG4gICAgICBpZiAocmFuayA9PT0gMCB8fCB1dGlsLnNpemVGcm9tU2hhcGUodGhpcy5vdXRwdXRTaGFwZSkgPT09IDEpIHtcbiAgICAgICAgY2hlY2tPdXRPZkJvdW5kc1N0cmluZyA9IGBcbiAgICAgICAgICByZXN1bHQueSA9IDAuO1xuICAgICAgICAgIHJlc3VsdC56ID0gMC47XG4gICAgICAgICAgcmVzdWx0LncgPSAwLjtcbiAgICAgICAgYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGR0eXBlID0gZ2V0Q29vcmRzRGF0YVR5cGUocmFuayk7XG4gICAgICAgIGNoZWNrT3V0T2ZCb3VuZHNTdHJpbmcgPSBgXG4gICAgICAgICAgJHtkdHlwZX0gY29vcmRzID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gICAgICAgIGA7XG4gICAgICAgIGlmIChyYW5rID09PSAxKSB7XG4gICAgICAgICAgaWYgKHRoaXMuZW5hYmxlU2hhcGVVbmlmb3Jtcykge1xuICAgICAgICAgICAgY2hlY2tPdXRPZkJvdW5kc1N0cmluZyArPSBgXG4gICAgICAgICAgICByZXN1bHQueSA9IChjb29yZHMgKyAxKSA+PSBvdXRTaGFwZSA/IDAuIDogcmVzdWx0Lnk7XG4gICAgICAgICAgICByZXN1bHQueiA9IDAuO1xuICAgICAgICAgICAgcmVzdWx0LncgPSAwLjtcbiAgICAgICAgICBgO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGVja091dE9mQm91bmRzU3RyaW5nICs9IGBcbiAgICAgICAgICAgIHJlc3VsdC55ID0gKGNvb3JkcyArIDEpID49ICR7dGhpcy5vdXRwdXRTaGFwZVswXX0gPyAwLiA6IHJlc3VsdC55O1xuICAgICAgICAgICAgcmVzdWx0LnogPSAwLjtcbiAgICAgICAgICAgIHJlc3VsdC53ID0gMC47XG4gICAgICAgICAgYDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgY2hhbm5lbHMgPSBnZXRDaGFubmVscygnY29vcmRzJywgcmFuayk7XG4gICAgICAgICAgaWYgKHRoaXMuZW5hYmxlU2hhcGVVbmlmb3Jtcykge1xuICAgICAgICAgICAgY2hlY2tPdXRPZkJvdW5kc1N0cmluZyArPSBgXG4gICAgICAgICAgICBib29sIG5leHRSb3dPdXRPZkJvdW5kcyA9XG4gICAgICAgICAgICAgICgke2NoYW5uZWxzW3JhbmsgLSAyXX0gKyAxKSA+PSBvdXRTaGFwZVske3Jhbmt9IC0gMl07XG4gICAgICAgICAgICBib29sIG5leHRDb2xPdXRPZkJvdW5kcyA9XG4gICAgICAgICAgICAgICgke2NoYW5uZWxzW3JhbmsgLSAxXX0gKyAxKSA+PSBvdXRTaGFwZVske3Jhbmt9IC0gMV07XG4gICAgICAgICAgICByZXN1bHQueSA9IG5leHRDb2xPdXRPZkJvdW5kcyA/IDAuIDogcmVzdWx0Lnk7XG4gICAgICAgICAgICByZXN1bHQueiA9IG5leHRSb3dPdXRPZkJvdW5kcyA/IDAuIDogcmVzdWx0Lno7XG4gICAgICAgICAgICByZXN1bHQudyA9IG5leHRDb2xPdXRPZkJvdW5kcyB8fCBuZXh0Um93T3V0T2ZCb3VuZHMgPyAwLiA6IHJlc3VsdC53O1xuICAgICAgICAgIGA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoZWNrT3V0T2ZCb3VuZHNTdHJpbmcgKz0gYFxuICAgICAgICAgICAgYm9vbCBuZXh0Um93T3V0T2ZCb3VuZHMgPVxuICAgICAgICAgICAgICAoJHtjaGFubmVsc1tyYW5rIC0gMl19ICsgMSkgPj0gJHt0aGlzLm91dHB1dFNoYXBlW3JhbmsgLSAyXX07XG4gICAgICAgICAgICBib29sIG5leHRDb2xPdXRPZkJvdW5kcyA9XG4gICAgICAgICAgICAgICgke2NoYW5uZWxzW3JhbmsgLSAxXX0gKyAxKSA+PSAke3RoaXMub3V0cHV0U2hhcGVbcmFuayAtIDFdfTtcbiAgICAgICAgICAgIHJlc3VsdC55ID0gbmV4dENvbE91dE9mQm91bmRzID8gMC4gOiByZXN1bHQueTtcbiAgICAgICAgICAgIHJlc3VsdC56ID0gbmV4dFJvd091dE9mQm91bmRzID8gMC4gOiByZXN1bHQuejtcbiAgICAgICAgICAgIHJlc3VsdC53ID0gbmV4dENvbE91dE9mQm91bmRzIHx8IG5leHRSb3dPdXRPZkJvdW5kcyA/IDAuIDogcmVzdWx0Lnc7XG4gICAgICAgICAgYDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgdmVjNCBiaW5hcnlPcGVyYXRpb24odmVjNCBhLCB2ZWM0IGIpIHtcbiAgICAgICAgJHtvcH1cbiAgICAgIH1cblxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICB2ZWM0IGEgPSBnZXRBQXRPdXRDb29yZHMoKTtcbiAgICAgICAgdmVjNCBiID0gZ2V0QkF0T3V0Q29vcmRzKCk7XG5cbiAgICAgICAgdmVjNCByZXN1bHQgPSBiaW5hcnlPcGVyYXRpb24oYSwgYik7XG4gICAgICAgICR7Y2hlY2tPdXRPZkJvdW5kc1N0cmluZ31cblxuICAgICAgICBzZXRPdXRwdXQocmVzdWx0KTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG4iXX0=