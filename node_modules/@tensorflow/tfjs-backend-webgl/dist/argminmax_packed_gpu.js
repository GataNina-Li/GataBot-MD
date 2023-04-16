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
import { util } from '@tensorflow/tfjs-core';
import { getChannels } from './packing_util';
import { getCoordsDataType } from './shader_compiler';
export class ArgMinMaxPackedProgram {
    constructor(shape, windowSize, op, firstPass) {
        this.variableNames = ['A'];
        this.packedInputs = true;
        this.packedOutput = true;
        util.assert(shape.length > 2, () => `Packed arg${op.charAt(0).toUpperCase() +
            op.slice(1)} supports only inputs with rank above 2.`);
        const inSize = shape[shape.length - 1];
        const outSize = Math.ceil(inSize / windowSize);
        this.outputShape = shape.slice(0, -1);
        if (outSize > 1) {
            this.outputShape.push(outSize);
        }
        if (!firstPass) {
            this.variableNames.push('bestIndicesA');
        }
        const outShape = this.outputShape;
        const rank = outShape.length;
        const dtype = getCoordsDataType(rank);
        const coords = getChannels('coords', rank);
        let sourceLocSetup;
        let sourceRank;
        if (outSize === 1) {
            sourceRank = rank + 1;
            const sourceLocDType = getCoordsDataType(sourceRank);
            sourceLocSetup = `
        ${sourceLocDType} sourceLocR = ${sourceLocDType}(${coords.join()}, 0);
        ++${coords[rank - 1]};
        ${sourceLocDType} sourceLocG = ${sourceLocDType}(${coords.join()}, 0);
        ++${coords[rank - 2]};
        ${sourceLocDType} sourceLocA = ${sourceLocDType}(${coords.join()}, 0);
        --${coords[rank - 1]};
        ${sourceLocDType} sourceLocB = ${sourceLocDType}(${coords.join()}, 0);
        --${coords[rank - 2]};`;
        }
        else {
            sourceRank = rank;
            sourceLocSetup = `
        ${dtype} sourceLocR = coords;
        ++${coords[rank - 1]};
        ${dtype} sourceLocG = coords;
        ++${coords[rank - 2]};
        ${dtype} sourceLocA = coords;
        --${coords[rank - 1]};
        ${dtype} sourceLocB = coords;
        --${coords[rank - 2]};`;
        }
        const channels = ['x', 'y', 'z', 'w', 'u', 'v'].slice(0, sourceRank);
        const inChannel = '.' + channels[sourceRank - 1]; // e.g. ".b" for rank 3.
        const intChannels = channels.map(x => 'int ' + x);
        const srcRCoords = getChannels('sourceLocR', sourceRank - 1).concat('inIdx.r');
        const srcGCoords = getChannels('sourceLocG', sourceRank - 1).concat('inIdx.g');
        const srcBCoords = getChannels('sourceLocB', sourceRank - 1).concat('inIdx.b');
        const srcACoords = getChannels('sourceLocA', sourceRank - 1).concat('inIdx.a');
        const compOp = (op === 'max') ? 'greaterThan' : 'lessThan';
        const fetchCandidateIdx = firstPass ? '' : `
          inIdx = round(vec4(getBestIndicesAChannel(${srcRCoords.join()}),
                             getBestIndicesAChannel(${srcGCoords.join()}),
                             getBestIndicesAChannel(${srcBCoords.join()}),
                             getBestIndicesAChannel(${srcACoords.join()})));`;
        const fetchValue = `vec4(
            getAChannel(${srcRCoords.join()}),
            hasNextCol ? getAChannel(${srcGCoords.join()}) : 0.,
            hasNextRow ? getAChannel(${srcBCoords.join()}) : 0.,
            hasNextRow && hasNextCol ? getAChannel(${srcACoords.join()}) : 0.)`;
        const getBestIndicesAChannelSnippet = firstPass ? '' : `
      float getBestIndicesAChannel(${intChannels.join()}) {
        return getChannel(getBestIndicesA(${channels.join()}),
                                          vec2(${channels.slice(-2).join()}));
      }`;
        this.userCode = `
      float getAChannel(${intChannels.join()}) {
        return getChannel(getA(${channels.join()}),
                               vec2(${channels.slice(-2).join()}));
      }
      ${getBestIndicesAChannelSnippet}
      void main() {
        ${dtype} coords = getOutputCoords();
        bool hasNextCol = ${coords[rank - 1]} < ${outShape[rank - 1] - 1};
        bool hasNextRow = ${coords[rank - 2]} < ${outShape[rank - 2] - 1};
        ${sourceLocSetup}
        ivec4 srcIdx = ivec4(sourceLocR${inChannel}, sourceLocG${inChannel},
          sourceLocB${inChannel}, sourceLocA${inChannel}) * ${windowSize};
        ivec4 inIdx = srcIdx;
        vec4 bestIndex = vec4(inIdx);
        vec4 bestValue = ${fetchValue};

        for (int i = 0; i < ${windowSize}; i++) {
          inIdx = srcIdx;
          ${fetchCandidateIdx}
          vec4 candidate = ${fetchValue};
          bvec4 nan = isnan(candidate);
          bvec4 replace = bvec4(
            vec4(${compOp}(candidate, bestValue)) * (vec4(1.0) - vec4(nan)));

          bestValue = vec4(replace.x  ? candidate.x : bestValue.x,
                           replace.y  ? candidate.y : bestValue.y,
                           replace.z  ? candidate.z : bestValue.z,
                           replace.w  ? candidate.w : bestValue.w);
          bestIndex = mix(bestIndex, vec4(inIdx), vec4(replace));
          srcIdx++;
        }
        setOutput(bestIndex);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJnbWlubWF4X3BhY2tlZF9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2FyZ21pbm1heF9wYWNrZWRfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUczQyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFcEQsTUFBTSxPQUFPLHNCQUFzQjtJQU9qQyxZQUNJLEtBQWUsRUFBRSxVQUFrQixFQUFFLEVBQWUsRUFDcEQsU0FBa0I7UUFSdEIsa0JBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBR3RCLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBS2xCLElBQUksQ0FBQyxNQUFNLENBQ1AsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQ2hCLEdBQUcsRUFBRSxDQUFDLGFBQ0YsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUU7WUFDMUIsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsMENBQTBDLENBQUMsQ0FBQztRQUMvRCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO1lBQ2YsSUFB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UyxPQUFPLFVBQVU7OzsyQkFHN0MsVUFBVTs7OEJBRVAsVUFBVTs7WUFFNUIsaUJBQWlCOzZCQUNBLFVBQVU7OzttQkFHcEIsTUFBTTs7Ozs7Ozs7Ozs7S0FXcEIsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHt1dGlsfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge0dQR1BVUHJvZ3JhbX0gZnJvbSAnLi9ncGdwdV9tYXRoJztcbmltcG9ydCB7Z2V0Q2hhbm5lbHN9IGZyb20gJy4vcGFja2luZ191dGlsJztcbmltcG9ydCB7Z2V0Q29vcmRzRGF0YVR5cGV9IGZyb20gJy4vc2hhZGVyX2NvbXBpbGVyJztcblxuZXhwb3J0IGNsYXNzIEFyZ01pbk1heFBhY2tlZFByb2dyYW0gaW1wbGVtZW50cyBHUEdQVVByb2dyYW0ge1xuICB2YXJpYWJsZU5hbWVzID0gWydBJ107XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXTtcbiAgdXNlckNvZGU6IHN0cmluZztcbiAgcGFja2VkSW5wdXRzID0gdHJ1ZTtcbiAgcGFja2VkT3V0cHV0ID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHNoYXBlOiBudW1iZXJbXSwgd2luZG93U2l6ZTogbnVtYmVyLCBvcDogJ21heCd8J21pbicsXG4gICAgICBmaXJzdFBhc3M6IGJvb2xlYW4pIHtcbiAgICB1dGlsLmFzc2VydChcbiAgICAgICAgc2hhcGUubGVuZ3RoID4gMixcbiAgICAgICAgKCkgPT4gYFBhY2tlZCBhcmcke1xuICAgICAgICAgICAgb3AuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgK1xuICAgICAgICAgICAgb3Auc2xpY2UoMSl9IHN1cHBvcnRzIG9ubHkgaW5wdXRzIHdpdGggcmFuayBhYm92ZSAyLmApO1xuICAgIGNvbnN0IGluU2l6ZSA9IHNoYXBlW3NoYXBlLmxlbmd0aCAtIDFdO1xuICAgIGNvbnN0IG91dFNpemUgPSBNYXRoLmNlaWwoaW5TaXplIC8gd2luZG93U2l6ZSk7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IHNoYXBlLnNsaWNlKDAsIC0xKTtcbiAgICBpZiAob3V0U2l6ZSA+IDEpIHtcbiAgICAgIHRoaXMub3V0cHV0U2hhcGUucHVzaChvdXRTaXplKTtcbiAgICB9XG4gICAgaWYgKCFmaXJzdFBhc3MpIHtcbiAgICAgIHRoaXMudmFyaWFibGVOYW1lcy5wdXNoKCdiZXN0SW5kaWNlc0EnKTtcbiAgICB9XG4gICAgY29uc3Qgb3V0U2hhcGUgPSB0aGlzLm91dHB1dFNoYXBlO1xuICAgIGNvbnN0IHJhbmsgPSBvdXRTaGFwZS5sZW5ndGg7XG4gICAgY29uc3QgZHR5cGUgPSBnZXRDb29yZHNEYXRhVHlwZShyYW5rKTtcbiAgICBjb25zdCBjb29yZHMgPSBnZXRDaGFubmVscygnY29vcmRzJywgcmFuayk7XG5cbiAgICBsZXQgc291cmNlTG9jU2V0dXA7XG4gICAgbGV0IHNvdXJjZVJhbms7XG4gICAgaWYgKG91dFNpemUgPT09IDEpIHtcbiAgICAgIHNvdXJjZVJhbmsgPSByYW5rICsgMTtcbiAgICAgIGNvbnN0IHNvdXJjZUxvY0RUeXBlID0gZ2V0Q29vcmRzRGF0YVR5cGUoc291cmNlUmFuayk7XG4gICAgICBzb3VyY2VMb2NTZXR1cCA9IGBcbiAgICAgICAgJHtzb3VyY2VMb2NEVHlwZX0gc291cmNlTG9jUiA9ICR7c291cmNlTG9jRFR5cGV9KCR7Y29vcmRzLmpvaW4oKX0sIDApO1xuICAgICAgICArKyR7Y29vcmRzW3JhbmsgLSAxXX07XG4gICAgICAgICR7c291cmNlTG9jRFR5cGV9IHNvdXJjZUxvY0cgPSAke3NvdXJjZUxvY0RUeXBlfSgke2Nvb3Jkcy5qb2luKCl9LCAwKTtcbiAgICAgICAgKyske2Nvb3Jkc1tyYW5rIC0gMl19O1xuICAgICAgICAke3NvdXJjZUxvY0RUeXBlfSBzb3VyY2VMb2NBID0gJHtzb3VyY2VMb2NEVHlwZX0oJHtjb29yZHMuam9pbigpfSwgMCk7XG4gICAgICAgIC0tJHtjb29yZHNbcmFuayAtIDFdfTtcbiAgICAgICAgJHtzb3VyY2VMb2NEVHlwZX0gc291cmNlTG9jQiA9ICR7c291cmNlTG9jRFR5cGV9KCR7Y29vcmRzLmpvaW4oKX0sIDApO1xuICAgICAgICAtLSR7Y29vcmRzW3JhbmsgLSAyXX07YDtcbiAgICB9IGVsc2Uge1xuICAgICAgc291cmNlUmFuayA9IHJhbms7XG4gICAgICBzb3VyY2VMb2NTZXR1cCA9IGBcbiAgICAgICAgJHtkdHlwZX0gc291cmNlTG9jUiA9IGNvb3JkcztcbiAgICAgICAgKyske2Nvb3Jkc1tyYW5rIC0gMV19O1xuICAgICAgICAke2R0eXBlfSBzb3VyY2VMb2NHID0gY29vcmRzO1xuICAgICAgICArKyR7Y29vcmRzW3JhbmsgLSAyXX07XG4gICAgICAgICR7ZHR5cGV9IHNvdXJjZUxvY0EgPSBjb29yZHM7XG4gICAgICAgIC0tJHtjb29yZHNbcmFuayAtIDFdfTtcbiAgICAgICAgJHtkdHlwZX0gc291cmNlTG9jQiA9IGNvb3JkcztcbiAgICAgICAgLS0ke2Nvb3Jkc1tyYW5rIC0gMl19O2A7XG4gICAgfVxuICAgIGNvbnN0IGNoYW5uZWxzID0gWyd4JywgJ3knLCAneicsICd3JywgJ3UnLCAndiddLnNsaWNlKDAsIHNvdXJjZVJhbmspO1xuICAgIGNvbnN0IGluQ2hhbm5lbCA9ICcuJyArIGNoYW5uZWxzW3NvdXJjZVJhbmsgLSAxXTsgIC8vIGUuZy4gXCIuYlwiIGZvciByYW5rIDMuXG4gICAgY29uc3QgaW50Q2hhbm5lbHMgPSBjaGFubmVscy5tYXAoeCA9PiAnaW50ICcgKyB4KTtcbiAgICBjb25zdCBzcmNSQ29vcmRzID1cbiAgICAgICAgZ2V0Q2hhbm5lbHMoJ3NvdXJjZUxvY1InLCBzb3VyY2VSYW5rIC0gMSkuY29uY2F0KCdpbklkeC5yJyk7XG4gICAgY29uc3Qgc3JjR0Nvb3JkcyA9XG4gICAgICAgIGdldENoYW5uZWxzKCdzb3VyY2VMb2NHJywgc291cmNlUmFuayAtIDEpLmNvbmNhdCgnaW5JZHguZycpO1xuICAgIGNvbnN0IHNyY0JDb29yZHMgPVxuICAgICAgICBnZXRDaGFubmVscygnc291cmNlTG9jQicsIHNvdXJjZVJhbmsgLSAxKS5jb25jYXQoJ2luSWR4LmInKTtcbiAgICBjb25zdCBzcmNBQ29vcmRzID1cbiAgICAgICAgZ2V0Q2hhbm5lbHMoJ3NvdXJjZUxvY0EnLCBzb3VyY2VSYW5rIC0gMSkuY29uY2F0KCdpbklkeC5hJyk7XG5cbiAgICBjb25zdCBjb21wT3AgPSAob3AgPT09ICdtYXgnKSA/ICdncmVhdGVyVGhhbicgOiAnbGVzc1RoYW4nO1xuICAgIGNvbnN0IGZldGNoQ2FuZGlkYXRlSWR4ID0gZmlyc3RQYXNzID8gJycgOiBgXG4gICAgICAgICAgaW5JZHggPSByb3VuZCh2ZWM0KGdldEJlc3RJbmRpY2VzQUNoYW5uZWwoJHtzcmNSQ29vcmRzLmpvaW4oKX0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRCZXN0SW5kaWNlc0FDaGFubmVsKCR7c3JjR0Nvb3Jkcy5qb2luKCl9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0QmVzdEluZGljZXNBQ2hhbm5lbCgke3NyY0JDb29yZHMuam9pbigpfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEJlc3RJbmRpY2VzQUNoYW5uZWwoJHtzcmNBQ29vcmRzLmpvaW4oKX0pKSk7YDtcblxuICAgIGNvbnN0IGZldGNoVmFsdWUgPSBgdmVjNChcbiAgICAgICAgICAgIGdldEFDaGFubmVsKCR7c3JjUkNvb3Jkcy5qb2luKCl9KSxcbiAgICAgICAgICAgIGhhc05leHRDb2wgPyBnZXRBQ2hhbm5lbCgke3NyY0dDb29yZHMuam9pbigpfSkgOiAwLixcbiAgICAgICAgICAgIGhhc05leHRSb3cgPyBnZXRBQ2hhbm5lbCgke3NyY0JDb29yZHMuam9pbigpfSkgOiAwLixcbiAgICAgICAgICAgIGhhc05leHRSb3cgJiYgaGFzTmV4dENvbCA/IGdldEFDaGFubmVsKCR7c3JjQUNvb3Jkcy5qb2luKCl9KSA6IDAuKWA7XG5cbiAgICBjb25zdCBnZXRCZXN0SW5kaWNlc0FDaGFubmVsU25pcHBldCA9IGZpcnN0UGFzcyA/ICcnIDogYFxuICAgICAgZmxvYXQgZ2V0QmVzdEluZGljZXNBQ2hhbm5lbCgke2ludENoYW5uZWxzLmpvaW4oKX0pIHtcbiAgICAgICAgcmV0dXJuIGdldENoYW5uZWwoZ2V0QmVzdEluZGljZXNBKCR7Y2hhbm5lbHMuam9pbigpfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZWMyKCR7Y2hhbm5lbHMuc2xpY2UoLTIpLmpvaW4oKX0pKTtcbiAgICAgIH1gO1xuXG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgIGZsb2F0IGdldEFDaGFubmVsKCR7aW50Q2hhbm5lbHMuam9pbigpfSkge1xuICAgICAgICByZXR1cm4gZ2V0Q2hhbm5lbChnZXRBKCR7Y2hhbm5lbHMuam9pbigpfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVjMigke2NoYW5uZWxzLnNsaWNlKC0yKS5qb2luKCl9KSk7XG4gICAgICB9XG4gICAgICAke2dldEJlc3RJbmRpY2VzQUNoYW5uZWxTbmlwcGV0fVxuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICAke2R0eXBlfSBjb29yZHMgPSBnZXRPdXRwdXRDb29yZHMoKTtcbiAgICAgICAgYm9vbCBoYXNOZXh0Q29sID0gJHtjb29yZHNbcmFuayAtIDFdfSA8ICR7b3V0U2hhcGVbcmFuayAtIDFdIC0gMX07XG4gICAgICAgIGJvb2wgaGFzTmV4dFJvdyA9ICR7Y29vcmRzW3JhbmsgLSAyXX0gPCAke291dFNoYXBlW3JhbmsgLSAyXSAtIDF9O1xuICAgICAgICAke3NvdXJjZUxvY1NldHVwfVxuICAgICAgICBpdmVjNCBzcmNJZHggPSBpdmVjNChzb3VyY2VMb2NSJHtpbkNoYW5uZWx9LCBzb3VyY2VMb2NHJHtpbkNoYW5uZWx9LFxuICAgICAgICAgIHNvdXJjZUxvY0Ike2luQ2hhbm5lbH0sIHNvdXJjZUxvY0Eke2luQ2hhbm5lbH0pICogJHt3aW5kb3dTaXplfTtcbiAgICAgICAgaXZlYzQgaW5JZHggPSBzcmNJZHg7XG4gICAgICAgIHZlYzQgYmVzdEluZGV4ID0gdmVjNChpbklkeCk7XG4gICAgICAgIHZlYzQgYmVzdFZhbHVlID0gJHtmZXRjaFZhbHVlfTtcblxuICAgICAgICBmb3IgKGludCBpID0gMDsgaSA8ICR7d2luZG93U2l6ZX07IGkrKykge1xuICAgICAgICAgIGluSWR4ID0gc3JjSWR4O1xuICAgICAgICAgICR7ZmV0Y2hDYW5kaWRhdGVJZHh9XG4gICAgICAgICAgdmVjNCBjYW5kaWRhdGUgPSAke2ZldGNoVmFsdWV9O1xuICAgICAgICAgIGJ2ZWM0IG5hbiA9IGlzbmFuKGNhbmRpZGF0ZSk7XG4gICAgICAgICAgYnZlYzQgcmVwbGFjZSA9IGJ2ZWM0KFxuICAgICAgICAgICAgdmVjNCgke2NvbXBPcH0oY2FuZGlkYXRlLCBiZXN0VmFsdWUpKSAqICh2ZWM0KDEuMCkgLSB2ZWM0KG5hbikpKTtcblxuICAgICAgICAgIGJlc3RWYWx1ZSA9IHZlYzQocmVwbGFjZS54ICA/IGNhbmRpZGF0ZS54IDogYmVzdFZhbHVlLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXBsYWNlLnkgID8gY2FuZGlkYXRlLnkgOiBiZXN0VmFsdWUueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGxhY2UueiAgPyBjYW5kaWRhdGUueiA6IGJlc3RWYWx1ZS56LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwbGFjZS53ICA/IGNhbmRpZGF0ZS53IDogYmVzdFZhbHVlLncpO1xuICAgICAgICAgIGJlc3RJbmRleCA9IG1peChiZXN0SW5kZXgsIHZlYzQoaW5JZHgpLCB2ZWM0KHJlcGxhY2UpKTtcbiAgICAgICAgICBzcmNJZHgrKztcbiAgICAgICAgfVxuICAgICAgICBzZXRPdXRwdXQoYmVzdEluZGV4KTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG4iXX0=