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
import { backend_util } from '@tensorflow/tfjs-core';
import { getChannels } from './packing_util';
import { getCoordsDataType } from './shader_compiler';
export class ConcatPackedProgram {
    constructor(shapes, axis) {
        this.packedInputs = true;
        this.packedOutput = true;
        this.outputShape = [];
        this.outputShape = backend_util.computeOutShape(shapes, axis);
        const shape = this.outputShape;
        const rank = shape.length;
        const dtype = getCoordsDataType(rank);
        const coords = getChannels('coords', rank);
        const channels = ['x', 'y', 'z', 'w', 'u', 'v'].slice(0, rank);
        this.variableNames = shapes.map((_, i) => `T${i}`);
        const offsets = new Array(shapes.length - 1);
        offsets[0] = shapes[0][axis];
        for (let i = 1; i < offsets.length; i++) {
            offsets[i] = offsets[i - 1] + shapes[i][axis];
        }
        const channel = channels[axis];
        const lastChannels = channels.slice(-2);
        const allChannels = channels.join();
        let getValueSnippet = `if (${channel} < ${offsets[0]}) {
        return getChannel(
            getT0(${allChannels}), vec2(${lastChannels.join()}));
        }`;
        for (let i = 1; i < offsets.length; i++) {
            const shift = offsets[i - 1];
            // Note: the >= comparison below may seem unnecessary given the check
            // above but is needed to workaround branch execution issues on some
            // devices. It makes all the conditions exclusive without relying on
            // execution order.
            getValueSnippet += `
        if (${channel} < ${offsets[i]}  && ${channel} >= ${offsets[i - 1]}) {
          return getChannel(
            getT${i}(${shiftedChannels(channels, channel, shift)}),
            vec2(${shiftedChannels(lastChannels, channel, shift)}));
        }`;
        }
        const lastIndex = offsets.length;
        const shift = offsets[offsets.length - 1];
        getValueSnippet += `
        return getChannel(
          getT${lastIndex}(${shiftedChannels(channels, channel, shift)}),
          vec2(${shiftedChannels(lastChannels, channel, shift)}));`;
        this.userCode = `
      float getValue(${channels.map(x => 'int ' + x)}) {
        ${getValueSnippet}
      }

      void main() {
        ${dtype} coords = getOutputCoords();
        vec4 result = vec4(getValue(${coords}), 0., 0., 0.);

        ${coords[rank - 1]} = ${coords[rank - 1]} + 1;
        if (${coords[rank - 1]} < ${shape[rank - 1]}) {
          result.g = getValue(${coords});
        }

        ${coords[rank - 2]} = ${coords[rank - 2]} + 1;
        if (${coords[rank - 2]} < ${shape[rank - 2]}) {
          result.a = getValue(${coords});
        }

        ${coords[rank - 1]} = ${coords[rank - 1]} - 1;
        if (${coords[rank - 2]} < ${shape[rank - 2]} &&
            ${coords[rank - 1]} < ${shape[rank - 1]}) {
          result.b = getValue(${coords});
        }
        setOutput(result);
      }
    `;
    }
}
/**
 * Return an expression for coordinates into a vector where a given channel
 * will be offset by [shift].
 *
 * @param channels the channels to consider
 * @param channel the channel we want shifted
 * @param shift  the amount to subtract from the channel.
 *
 * @returns a string of the form 'x, y-[shift], z' where any one channel can
 * have the shift applied.
 */
function shiftedChannels(channels, channel, shift) {
    const channelIdx = channels.indexOf(channel);
    const res = channels.map((c, idx) => {
        if (idx === channelIdx) {
            return `${c} - ${shift}`;
        }
        else {
            return c;
        }
    });
    return res.join();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY2F0X3BhY2tlZF9ncHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2NvbmNhdF9wYWNrZWRfZ3B1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUduRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFcEQsTUFBTSxPQUFPLG1CQUFtQjtJQU85QixZQUFZLE1BQWtCLEVBQUUsSUFBWTtRQUw1QyxpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixnQkFBVyxHQUFhLEVBQUUsQ0FBQztRQUl6QixJQUFJLENBQUMsV0FBVyxHQUFHLFlBQVksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDL0IsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUMxQixNQUFNLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNDLE1BQU0sUUFBUSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVuRCxNQUFNLE9BQU8sR0FBYSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdkMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQy9DO1FBRUQsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFcEMsSUFBSSxlQUFlLEdBQUcsT0FBTyxPQUFPLE1BQU0sT0FBTyxDQUFDLENBQUMsQ0FBQzs7b0JBRXBDLFdBQVcsV0FBVyxZQUFZLENBQUMsSUFBSSxFQUFFO1VBQ25ELENBQUM7UUFDUCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN2QyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzdCLHFFQUFxRTtZQUNyRSxvRUFBb0U7WUFDcEUsb0VBQW9FO1lBQ3BFLG1CQUFtQjtZQUNuQixlQUFlLElBQUk7Y0FDWCxPQUFPLE1BQU0sT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLE9BQU8sT0FBTyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7a0JBRXZELENBQUMsSUFBSSxlQUFlLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUM7bUJBQzdDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQztVQUN0RCxDQUFDO1NBQ047UUFDRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ2pDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzFDLGVBQWUsSUFBSTs7Z0JBRVAsU0FBUyxJQUFJLGVBQWUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQztpQkFDckQsZUFBZSxDQUFDLFlBQVksRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUVoRSxJQUFJLENBQUMsUUFBUSxHQUFHO3VCQUNHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1VBQzFDLGVBQWU7Ozs7VUFJZixLQUFLO3NDQUN1QixNQUFNOztVQUVsQyxNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2NBQ2xDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7Z0NBQ25CLE1BQU07OztVQUc1QixNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2NBQ2xDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7Z0NBQ25CLE1BQU07OztVQUc1QixNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2NBQ2xDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7Y0FDckMsTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztnQ0FDbkIsTUFBTTs7OztLQUlqQyxDQUFDO0lBQ0osQ0FBQztDQUNGO0FBRUQ7Ozs7Ozs7Ozs7R0FVRztBQUNILFNBQVMsZUFBZSxDQUFDLFFBQWtCLEVBQUUsT0FBZSxFQUFFLEtBQWE7SUFDekUsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM3QyxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQ2xDLElBQUksR0FBRyxLQUFLLFVBQVUsRUFBRTtZQUN0QixPQUFPLEdBQUcsQ0FBQyxNQUFNLEtBQUssRUFBRSxDQUFDO1NBQzFCO2FBQU07WUFDTCxPQUFPLENBQUMsQ0FBQztTQUNWO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNwQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2JhY2tlbmRfdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtHUEdQVVByb2dyYW19IGZyb20gJy4vZ3BncHVfbWF0aCc7XG5pbXBvcnQge2dldENoYW5uZWxzfSBmcm9tICcuL3BhY2tpbmdfdXRpbCc7XG5pbXBvcnQge2dldENvb3Jkc0RhdGFUeXBlfSBmcm9tICcuL3NoYWRlcl9jb21waWxlcic7XG5cbmV4cG9ydCBjbGFzcyBDb25jYXRQYWNrZWRQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lczogc3RyaW5nW107XG4gIHBhY2tlZElucHV0cyA9IHRydWU7XG4gIHBhY2tlZE91dHB1dCA9IHRydWU7XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXSA9IFtdO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNoYXBlczogbnVtYmVyW11bXSwgYXhpczogbnVtYmVyKSB7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IGJhY2tlbmRfdXRpbC5jb21wdXRlT3V0U2hhcGUoc2hhcGVzLCBheGlzKTtcbiAgICBjb25zdCBzaGFwZSA9IHRoaXMub3V0cHV0U2hhcGU7XG4gICAgY29uc3QgcmFuayA9IHNoYXBlLmxlbmd0aDtcbiAgICBjb25zdCBkdHlwZSA9IGdldENvb3Jkc0RhdGFUeXBlKHJhbmspO1xuICAgIGNvbnN0IGNvb3JkcyA9IGdldENoYW5uZWxzKCdjb29yZHMnLCByYW5rKTtcbiAgICBjb25zdCBjaGFubmVscyA9IFsneCcsICd5JywgJ3onLCAndycsICd1JywgJ3YnXS5zbGljZSgwLCByYW5rKTtcbiAgICB0aGlzLnZhcmlhYmxlTmFtZXMgPSBzaGFwZXMubWFwKChfLCBpKSA9PiBgVCR7aX1gKTtcblxuICAgIGNvbnN0IG9mZnNldHM6IG51bWJlcltdID0gbmV3IEFycmF5KHNoYXBlcy5sZW5ndGggLSAxKTtcbiAgICBvZmZzZXRzWzBdID0gc2hhcGVzWzBdW2F4aXNdO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgb2Zmc2V0cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2Zmc2V0c1tpXSA9IG9mZnNldHNbaSAtIDFdICsgc2hhcGVzW2ldW2F4aXNdO1xuICAgIH1cblxuICAgIGNvbnN0IGNoYW5uZWwgPSBjaGFubmVsc1theGlzXTtcbiAgICBjb25zdCBsYXN0Q2hhbm5lbHMgPSBjaGFubmVscy5zbGljZSgtMik7XG4gICAgY29uc3QgYWxsQ2hhbm5lbHMgPSBjaGFubmVscy5qb2luKCk7XG5cbiAgICBsZXQgZ2V0VmFsdWVTbmlwcGV0ID0gYGlmICgke2NoYW5uZWx9IDwgJHtvZmZzZXRzWzBdfSkge1xuICAgICAgICByZXR1cm4gZ2V0Q2hhbm5lbChcbiAgICAgICAgICAgIGdldFQwKCR7YWxsQ2hhbm5lbHN9KSwgdmVjMigke2xhc3RDaGFubmVscy5qb2luKCl9KSk7XG4gICAgICAgIH1gO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgb2Zmc2V0cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgc2hpZnQgPSBvZmZzZXRzW2kgLSAxXTtcbiAgICAgIC8vIE5vdGU6IHRoZSA+PSBjb21wYXJpc29uIGJlbG93IG1heSBzZWVtIHVubmVjZXNzYXJ5IGdpdmVuIHRoZSBjaGVja1xuICAgICAgLy8gYWJvdmUgYnV0IGlzIG5lZWRlZCB0byB3b3JrYXJvdW5kIGJyYW5jaCBleGVjdXRpb24gaXNzdWVzIG9uIHNvbWVcbiAgICAgIC8vIGRldmljZXMuIEl0IG1ha2VzIGFsbCB0aGUgY29uZGl0aW9ucyBleGNsdXNpdmUgd2l0aG91dCByZWx5aW5nIG9uXG4gICAgICAvLyBleGVjdXRpb24gb3JkZXIuXG4gICAgICBnZXRWYWx1ZVNuaXBwZXQgKz0gYFxuICAgICAgICBpZiAoJHtjaGFubmVsfSA8ICR7b2Zmc2V0c1tpXX0gICYmICR7Y2hhbm5lbH0gPj0gJHtvZmZzZXRzW2kgLSAxXX0pIHtcbiAgICAgICAgICByZXR1cm4gZ2V0Q2hhbm5lbChcbiAgICAgICAgICAgIGdldFQke2l9KCR7c2hpZnRlZENoYW5uZWxzKGNoYW5uZWxzLCBjaGFubmVsLCBzaGlmdCl9KSxcbiAgICAgICAgICAgIHZlYzIoJHtzaGlmdGVkQ2hhbm5lbHMobGFzdENoYW5uZWxzLCBjaGFubmVsLCBzaGlmdCl9KSk7XG4gICAgICAgIH1gO1xuICAgIH1cbiAgICBjb25zdCBsYXN0SW5kZXggPSBvZmZzZXRzLmxlbmd0aDtcbiAgICBjb25zdCBzaGlmdCA9IG9mZnNldHNbb2Zmc2V0cy5sZW5ndGggLSAxXTtcbiAgICBnZXRWYWx1ZVNuaXBwZXQgKz0gYFxuICAgICAgICByZXR1cm4gZ2V0Q2hhbm5lbChcbiAgICAgICAgICBnZXRUJHtsYXN0SW5kZXh9KCR7c2hpZnRlZENoYW5uZWxzKGNoYW5uZWxzLCBjaGFubmVsLCBzaGlmdCl9KSxcbiAgICAgICAgICB2ZWMyKCR7c2hpZnRlZENoYW5uZWxzKGxhc3RDaGFubmVscywgY2hhbm5lbCwgc2hpZnQpfSkpO2A7XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgZmxvYXQgZ2V0VmFsdWUoJHtjaGFubmVscy5tYXAoeCA9PiAnaW50ICcgKyB4KX0pIHtcbiAgICAgICAgJHtnZXRWYWx1ZVNuaXBwZXR9XG4gICAgICB9XG5cbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgJHtkdHlwZX0gY29vcmRzID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gICAgICAgIHZlYzQgcmVzdWx0ID0gdmVjNChnZXRWYWx1ZSgke2Nvb3Jkc30pLCAwLiwgMC4sIDAuKTtcblxuICAgICAgICAke2Nvb3Jkc1tyYW5rIC0gMV19ID0gJHtjb29yZHNbcmFuayAtIDFdfSArIDE7XG4gICAgICAgIGlmICgke2Nvb3Jkc1tyYW5rIC0gMV19IDwgJHtzaGFwZVtyYW5rIC0gMV19KSB7XG4gICAgICAgICAgcmVzdWx0LmcgPSBnZXRWYWx1ZSgke2Nvb3Jkc30pO1xuICAgICAgICB9XG5cbiAgICAgICAgJHtjb29yZHNbcmFuayAtIDJdfSA9ICR7Y29vcmRzW3JhbmsgLSAyXX0gKyAxO1xuICAgICAgICBpZiAoJHtjb29yZHNbcmFuayAtIDJdfSA8ICR7c2hhcGVbcmFuayAtIDJdfSkge1xuICAgICAgICAgIHJlc3VsdC5hID0gZ2V0VmFsdWUoJHtjb29yZHN9KTtcbiAgICAgICAgfVxuXG4gICAgICAgICR7Y29vcmRzW3JhbmsgLSAxXX0gPSAke2Nvb3Jkc1tyYW5rIC0gMV19IC0gMTtcbiAgICAgICAgaWYgKCR7Y29vcmRzW3JhbmsgLSAyXX0gPCAke3NoYXBlW3JhbmsgLSAyXX0gJiZcbiAgICAgICAgICAgICR7Y29vcmRzW3JhbmsgLSAxXX0gPCAke3NoYXBlW3JhbmsgLSAxXX0pIHtcbiAgICAgICAgICByZXN1bHQuYiA9IGdldFZhbHVlKCR7Y29vcmRzfSk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0T3V0cHV0KHJlc3VsdCk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybiBhbiBleHByZXNzaW9uIGZvciBjb29yZGluYXRlcyBpbnRvIGEgdmVjdG9yIHdoZXJlIGEgZ2l2ZW4gY2hhbm5lbFxuICogd2lsbCBiZSBvZmZzZXQgYnkgW3NoaWZ0XS5cbiAqXG4gKiBAcGFyYW0gY2hhbm5lbHMgdGhlIGNoYW5uZWxzIHRvIGNvbnNpZGVyXG4gKiBAcGFyYW0gY2hhbm5lbCB0aGUgY2hhbm5lbCB3ZSB3YW50IHNoaWZ0ZWRcbiAqIEBwYXJhbSBzaGlmdCAgdGhlIGFtb3VudCB0byBzdWJ0cmFjdCBmcm9tIHRoZSBjaGFubmVsLlxuICpcbiAqIEByZXR1cm5zIGEgc3RyaW5nIG9mIHRoZSBmb3JtICd4LCB5LVtzaGlmdF0sIHonIHdoZXJlIGFueSBvbmUgY2hhbm5lbCBjYW5cbiAqIGhhdmUgdGhlIHNoaWZ0IGFwcGxpZWQuXG4gKi9cbmZ1bmN0aW9uIHNoaWZ0ZWRDaGFubmVscyhjaGFubmVsczogc3RyaW5nW10sIGNoYW5uZWw6IHN0cmluZywgc2hpZnQ6IG51bWJlcikge1xuICBjb25zdCBjaGFubmVsSWR4ID0gY2hhbm5lbHMuaW5kZXhPZihjaGFubmVsKTtcbiAgY29uc3QgcmVzID0gY2hhbm5lbHMubWFwKChjLCBpZHgpID0+IHtcbiAgICBpZiAoaWR4ID09PSBjaGFubmVsSWR4KSB7XG4gICAgICByZXR1cm4gYCR7Y30gLSAke3NoaWZ0fWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXMuam9pbigpO1xufVxuIl19