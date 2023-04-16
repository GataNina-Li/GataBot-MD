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
import { getChannels } from './packing_util';
import { getCoordsDataType } from './shader_compiler';
export class ReversePackedProgram {
    constructor(xShape, axis) {
        this.variableNames = ['x'];
        this.packedInputs = true;
        this.packedOutput = true;
        const rank = xShape.length;
        if (rank > 4) {
            throw new Error(`WebGL backend: Reverse of rank-${rank} tensor is not yet supported`);
        }
        this.outputShape = xShape;
        const channels = getChannels('rc', rank);
        const nextColumn = `${channels[rank - 1]} + 1 < ${this.outputShape[rank - 1]}`;
        const nextRow = `${channels[rank - 2]} + 1 < ${this.outputShape[rank - 2]}`;
        const type = getCoordsDataType(rank);
        if (rank === 1) {
            this.userCode = `
        void main(){
          int rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = getChannel(getX(${xShape[0]} - rc - 1),
            ${xShape[0]} - rc - 1);
          if(${nextColumn}){
              result.g = getChannel(getX(${xShape[0]} - (rc  + 1) - 1),
                ${xShape[0]} - (rc  + 1) - 1);
          }
          setOutput(result);
        }
      `;
        }
        else {
            this.userCode = `
        void main() {
          ${type} rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = ${getR(channels.slice())};
          if(${nextColumn}){
            result.g = ${getG(channels.slice())};
          }
          if(${nextRow}) {
            result.b = ${getB(channels.slice())};
            if(${nextColumn}) {
              result.a = ${getA(channels.slice())};
            }
          }
          setOutput(result);
        }
    `;
        }
        function getR(channels) {
            return getChannel(channels);
        }
        function getG(channels) {
            channels[rank - 1] = '(' + channels[rank - 1] + ` + 1)`;
            return getChannel(channels);
        }
        function getB(channels) {
            channels[rank - 2] = '(' + channels[rank - 2] + ` + 1)`;
            return getChannel(channels);
        }
        function getA(channels) {
            channels[rank - 1] = '(' + channels[rank - 1] + ` + 1)`;
            channels[rank - 2] = '(' + channels[rank - 2] + ` + 1)`;
            return getChannel(channels);
        }
        function getChannel(channels) {
            const inCoordsArray = xShape.map((_, i) => getInCoord(i, channels));
            const inCoords = inCoordsArray.join(',');
            const innerDims = inCoordsArray.slice(-2).join(',');
            return `getChannel(getX(${inCoords}), vec2(${innerDims}))`;
        }
        function getInCoord(i, channels1) {
            if (axis.indexOf(i) !== -1 && xShape[i] !== 1) {
                return `${xShape[i]} - ${channels1[i]} - 1`;
            }
            else {
                return `${channels1[i]}`;
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV2ZXJzZV9wYWNrZWRfZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9yZXZlcnNlX3BhY2tlZF9ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBR0gsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRXBELE1BQU0sT0FBTyxvQkFBb0I7SUFPL0IsWUFBWSxNQUFnQixFQUFFLElBQWM7UUFONUMsa0JBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBR3RCLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBR2xCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFO1lBQ1osTUFBTSxJQUFJLEtBQUssQ0FDWCxrQ0FBa0MsSUFBSSw4QkFBOEIsQ0FBQyxDQUFDO1NBQzNFO1FBQ0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7UUFDMUIsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6QyxNQUFNLFVBQVUsR0FDWixHQUFHLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNoRSxNQUFNLE9BQU8sR0FBRyxHQUFHLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUM1RSxNQUFNLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FB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ZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0dQR1BVUHJvZ3JhbX0gZnJvbSAnLi9ncGdwdV9tYXRoJztcbmltcG9ydCB7Z2V0Q2hhbm5lbHN9IGZyb20gJy4vcGFja2luZ191dGlsJztcbmltcG9ydCB7Z2V0Q29vcmRzRGF0YVR5cGV9IGZyb20gJy4vc2hhZGVyX2NvbXBpbGVyJztcblxuZXhwb3J0IGNsYXNzIFJldmVyc2VQYWNrZWRQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsneCddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG4gIHBhY2tlZElucHV0cyA9IHRydWU7XG4gIHBhY2tlZE91dHB1dCA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IoeFNoYXBlOiBudW1iZXJbXSwgYXhpczogbnVtYmVyW10pIHtcbiAgICBjb25zdCByYW5rID0geFNoYXBlLmxlbmd0aDtcbiAgICBpZiAocmFuayA+IDQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgV2ViR0wgYmFja2VuZDogUmV2ZXJzZSBvZiByYW5rLSR7cmFua30gdGVuc29yIGlzIG5vdCB5ZXQgc3VwcG9ydGVkYCk7XG4gICAgfVxuICAgIHRoaXMub3V0cHV0U2hhcGUgPSB4U2hhcGU7XG4gICAgY29uc3QgY2hhbm5lbHMgPSBnZXRDaGFubmVscygncmMnLCByYW5rKTtcbiAgICBjb25zdCBuZXh0Q29sdW1uID1cbiAgICAgICAgYCR7Y2hhbm5lbHNbcmFuayAtIDFdfSArIDEgPCAke3RoaXMub3V0cHV0U2hhcGVbcmFuayAtIDFdfWA7XG4gICAgY29uc3QgbmV4dFJvdyA9IGAke2NoYW5uZWxzW3JhbmsgLSAyXX0gKyAxIDwgJHt0aGlzLm91dHB1dFNoYXBlW3JhbmsgLSAyXX1gO1xuICAgIGNvbnN0IHR5cGUgPSBnZXRDb29yZHNEYXRhVHlwZShyYW5rKTtcbiAgICBpZiAocmFuayA9PT0gMSkge1xuICAgICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgICAgdm9pZCBtYWluKCl7XG4gICAgICAgICAgaW50IHJjID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gICAgICAgICAgdmVjNCByZXN1bHQgPSB2ZWM0KDAuKTtcbiAgICAgICAgICByZXN1bHQuciA9IGdldENoYW5uZWwoZ2V0WCgke3hTaGFwZVswXX0gLSByYyAtIDEpLFxuICAgICAgICAgICAgJHt4U2hhcGVbMF19IC0gcmMgLSAxKTtcbiAgICAgICAgICBpZigke25leHRDb2x1bW59KXtcbiAgICAgICAgICAgICAgcmVzdWx0LmcgPSBnZXRDaGFubmVsKGdldFgoJHt4U2hhcGVbMF19IC0gKHJjICArIDEpIC0gMSksXG4gICAgICAgICAgICAgICAgJHt4U2hhcGVbMF19IC0gKHJjICArIDEpIC0gMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNldE91dHB1dChyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICBgO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgICAgJHt0eXBlfSByYyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICAgIHZlYzQgcmVzdWx0ID0gdmVjNCgwLik7XG4gICAgICAgICAgcmVzdWx0LnIgPSAke2dldFIoY2hhbm5lbHMuc2xpY2UoKSl9O1xuICAgICAgICAgIGlmKCR7bmV4dENvbHVtbn0pe1xuICAgICAgICAgICAgcmVzdWx0LmcgPSAke2dldEcoY2hhbm5lbHMuc2xpY2UoKSl9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZigke25leHRSb3d9KSB7XG4gICAgICAgICAgICByZXN1bHQuYiA9ICR7Z2V0QihjaGFubmVscy5zbGljZSgpKX07XG4gICAgICAgICAgICBpZigke25leHRDb2x1bW59KSB7XG4gICAgICAgICAgICAgIHJlc3VsdC5hID0gJHtnZXRBKGNoYW5uZWxzLnNsaWNlKCkpfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0T3V0cHV0KHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICBgO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFIoY2hhbm5lbHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiBnZXRDaGFubmVsKGNoYW5uZWxzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRHKGNoYW5uZWxzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgICBjaGFubmVsc1tyYW5rIC0gMV0gPSAnKCcgKyBjaGFubmVsc1tyYW5rIC0gMV0gKyBgICsgMSlgO1xuICAgICAgcmV0dXJuIGdldENoYW5uZWwoY2hhbm5lbHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEIoY2hhbm5lbHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICAgIGNoYW5uZWxzW3JhbmsgLSAyXSA9ICcoJyArIGNoYW5uZWxzW3JhbmsgLSAyXSArIGAgKyAxKWA7XG4gICAgICByZXR1cm4gZ2V0Q2hhbm5lbChjaGFubmVscyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QShjaGFubmVsczogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgICAgY2hhbm5lbHNbcmFuayAtIDFdID0gJygnICsgY2hhbm5lbHNbcmFuayAtIDFdICsgYCArIDEpYDtcbiAgICAgIGNoYW5uZWxzW3JhbmsgLSAyXSA9ICcoJyArIGNoYW5uZWxzW3JhbmsgLSAyXSArIGAgKyAxKWA7XG4gICAgICByZXR1cm4gZ2V0Q2hhbm5lbChjaGFubmVscyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q2hhbm5lbChjaGFubmVsczogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgICAgY29uc3QgaW5Db29yZHNBcnJheSA9IHhTaGFwZS5tYXAoKF8sIGkpID0+IGdldEluQ29vcmQoaSwgY2hhbm5lbHMpKTtcbiAgICAgIGNvbnN0IGluQ29vcmRzID0gaW5Db29yZHNBcnJheS5qb2luKCcsJyk7XG4gICAgICBjb25zdCBpbm5lckRpbXMgPSBpbkNvb3Jkc0FycmF5LnNsaWNlKC0yKS5qb2luKCcsJyk7XG4gICAgICByZXR1cm4gYGdldENoYW5uZWwoZ2V0WCgke2luQ29vcmRzfSksIHZlYzIoJHtpbm5lckRpbXN9KSlgO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEluQ29vcmQoaTogbnVtYmVyLCBjaGFubmVsczE6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICAgIGlmIChheGlzLmluZGV4T2YoaSkgIT09IC0xICYmIHhTaGFwZVtpXSAhPT0gMSkge1xuICAgICAgICByZXR1cm4gYCR7eFNoYXBlW2ldfSAtICR7Y2hhbm5lbHMxW2ldfSAtIDFgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGAke2NoYW5uZWxzMVtpXX1gO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19