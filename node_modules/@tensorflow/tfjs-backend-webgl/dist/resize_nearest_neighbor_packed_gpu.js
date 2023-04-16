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
export class ResizeNearestNeighborPackedProgram {
    constructor(inputShape, newHeight, newWidth, alignCorners, halfPixelCenters) {
        this.variableNames = ['A'];
        this.packedInputs = true;
        this.packedOutput = true;
        this.outputShape = [];
        const [batch, oldHeight, oldWidth, depth] = inputShape;
        this.outputShape = [batch, newHeight, newWidth, depth];
        const effectiveInSize = [
            (alignCorners && newHeight > 1) ? oldHeight - 1 : oldHeight,
            (alignCorners && newWidth > 1) ? oldWidth - 1 : oldWidth
        ];
        const effectiveOutSize = [
            (alignCorners && newHeight > 1) ? newHeight - 1 : newHeight,
            (alignCorners && newWidth > 1) ? newWidth - 1 : newWidth
        ];
        // When align corners is false, we rounds the value with floor.
        const roundBase = alignCorners ? '0.5' : '0.0';
        let sourceFracIndexRC;
        if (halfPixelCenters) {
            sourceFracIndexRC = `max((vec3(yRC) + vec3(0.5)) * ` +
                `effectiveInputOverOutputRatioRC, vec3(0.0))`;
        }
        else {
            sourceFracIndexRC = `vec3(yRC) * effectiveInputOverOutputRatioRC`;
        }
        this.userCode = `
      const vec3 effectiveInputOverOutputRatioRC = vec3(
          ${effectiveInSize[0] / effectiveOutSize[0]},
          ${effectiveInSize[1] / effectiveOutSize[1]},
          ${effectiveInSize[1] / effectiveOutSize[1]});
      const vec3 inputShapeRC = vec3(${oldHeight}.0, ${oldWidth}.0,
                                     ${oldWidth}.0);

      float getAValue(int b, int r, int c, int d) {
        return getChannel(getA(b, r, c, d), vec2(c, d));
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        // Calculate values for next column in yRC.z.
        ivec3 yRC = coords.yzz + ivec3(0, 0, 1);

        // Fractional source index.
        vec3 sourceFracIndexRC = ${sourceFracIndexRC};

        // Compute the coordinators of nearest neighbor point.
        ivec3 sourceNearestRC = ivec3(
          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + ${roundBase})));

        // Should we calculate next column and row elements in 2x2 packed cell.
        bool hasNextCol = d < ${depth - 1};
        bool hasNextRow = coords.z < ${newWidth - 1};

        vec4 newValue = vec4(
          getAValue(b, sourceNearestRC.x, sourceNearestRC.y, d),
          hasNextCol ? getAValue(b, sourceNearestRC.x, sourceNearestRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceNearestRC.x, sourceNearestRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceNearestRC.x, sourceNearestRC.z, d + 1) : 0.0);

        setOutput(newValue);
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplX25lYXJlc3RfbmVpZ2hib3JfcGFja2VkX2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvcmVzaXplX25lYXJlc3RfbmVpZ2hib3JfcGFja2VkX2dwdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFJSCxNQUFNLE9BQU8sa0NBQWtDO0lBTzdDLFlBQ0ksVUFBNEMsRUFBRSxTQUFpQixFQUMvRCxRQUFnQixFQUFFLFlBQXFCLEVBQUUsZ0JBQXlCO1FBUnRFLGtCQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixnQkFBVyxHQUFhLEVBQUUsQ0FBQztRQU16QixNQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQ3ZELElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV2RCxNQUFNLGVBQWUsR0FBcUI7WUFDeEMsQ0FBQyxZQUFZLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQzNELENBQUMsWUFBWSxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUTtTQUN6RCxDQUFDO1FBRUYsTUFBTSxnQkFBZ0IsR0FBcUI7WUFDekMsQ0FBQyxZQUFZLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQzNELENBQUMsWUFBWSxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUTtTQUN6RCxDQUFDO1FBRUYsK0RBQStEO1FBQy9ELE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDL0MsSUFBSSxpQkFBeUIsQ0FBQztRQUM5QixJQUFJLGdCQUFnQixFQUFFO1lBQ3BCLGlCQUFpQixHQUFHLGdDQUFnQztnQkFDaEQsNkNBQTZDLENBQUM7U0FDbkQ7YUFBTTtZQUNMLGlCQUFpQixHQUFHLDZDQUE2QyxDQUFDO1NBQ25FO1FBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRzs7WUFFUixlQUFlLENBQUMsQ0FBQyxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLGVBQWUsQ0FBQyxDQUFDLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDeEMsZUFBZSxDQUFDLENBQUMsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQzt1Q0FDYixTQUFTLE9BQU8sUUFBUTt1Q0FDeEIsUUFBUTs7Ozs7Ozs7Ozs7Ozs7bUNBY1osaUJBQWlCOzs7OzhEQUlVLFNBQVM7OztnQ0FHdkMsS0FBSyxHQUFHLENBQUM7dUNBQ0YsUUFBUSxHQUFHLENBQUM7Ozs7Ozs7Ozs7Ozs7S0FhOUMsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtHUEdQVVByb2dyYW19IGZyb20gJy4vZ3BncHVfbWF0aCc7XG5cbmV4cG9ydCBjbGFzcyBSZXNpemVOZWFyZXN0TmVpZ2hib3JQYWNrZWRQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsnQSddO1xuICBwYWNrZWRJbnB1dHMgPSB0cnVlO1xuICBwYWNrZWRPdXRwdXQgPSB0cnVlO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW10gPSBbXTtcbiAgdXNlckNvZGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIGlucHV0U2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdLCBuZXdIZWlnaHQ6IG51bWJlcixcbiAgICAgIG5ld1dpZHRoOiBudW1iZXIsIGFsaWduQ29ybmVyczogYm9vbGVhbiwgaGFsZlBpeGVsQ2VudGVyczogYm9vbGVhbikge1xuICAgIGNvbnN0IFtiYXRjaCwgb2xkSGVpZ2h0LCBvbGRXaWR0aCwgZGVwdGhdID0gaW5wdXRTaGFwZTtcbiAgICB0aGlzLm91dHB1dFNoYXBlID0gW2JhdGNoLCBuZXdIZWlnaHQsIG5ld1dpZHRoLCBkZXB0aF07XG5cbiAgICBjb25zdCBlZmZlY3RpdmVJblNpemU6IFtudW1iZXIsIG51bWJlcl0gPSBbXG4gICAgICAoYWxpZ25Db3JuZXJzICYmIG5ld0hlaWdodCA+IDEpID8gb2xkSGVpZ2h0IC0gMSA6IG9sZEhlaWdodCxcbiAgICAgIChhbGlnbkNvcm5lcnMgJiYgbmV3V2lkdGggPiAxKSA/IG9sZFdpZHRoIC0gMSA6IG9sZFdpZHRoXG4gICAgXTtcblxuICAgIGNvbnN0IGVmZmVjdGl2ZU91dFNpemU6IFtudW1iZXIsIG51bWJlcl0gPSBbXG4gICAgICAoYWxpZ25Db3JuZXJzICYmIG5ld0hlaWdodCA+IDEpID8gbmV3SGVpZ2h0IC0gMSA6IG5ld0hlaWdodCxcbiAgICAgIChhbGlnbkNvcm5lcnMgJiYgbmV3V2lkdGggPiAxKSA/IG5ld1dpZHRoIC0gMSA6IG5ld1dpZHRoXG4gICAgXTtcblxuICAgIC8vIFdoZW4gYWxpZ24gY29ybmVycyBpcyBmYWxzZSwgd2Ugcm91bmRzIHRoZSB2YWx1ZSB3aXRoIGZsb29yLlxuICAgIGNvbnN0IHJvdW5kQmFzZSA9IGFsaWduQ29ybmVycyA/ICcwLjUnIDogJzAuMCc7XG4gICAgbGV0IHNvdXJjZUZyYWNJbmRleFJDOiBzdHJpbmc7XG4gICAgaWYgKGhhbGZQaXhlbENlbnRlcnMpIHtcbiAgICAgIHNvdXJjZUZyYWNJbmRleFJDID0gYG1heCgodmVjMyh5UkMpICsgdmVjMygwLjUpKSAqIGAgK1xuICAgICAgICAgIGBlZmZlY3RpdmVJbnB1dE92ZXJPdXRwdXRSYXRpb1JDLCB2ZWMzKDAuMCkpYDtcbiAgICB9IGVsc2Uge1xuICAgICAgc291cmNlRnJhY0luZGV4UkMgPSBgdmVjMyh5UkMpICogZWZmZWN0aXZlSW5wdXRPdmVyT3V0cHV0UmF0aW9SQ2A7XG4gICAgfVxuXG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICAgIGNvbnN0IHZlYzMgZWZmZWN0aXZlSW5wdXRPdmVyT3V0cHV0UmF0aW9SQyA9IHZlYzMoXG4gICAgICAgICAgJHtlZmZlY3RpdmVJblNpemVbMF0gLyBlZmZlY3RpdmVPdXRTaXplWzBdfSxcbiAgICAgICAgICAke2VmZmVjdGl2ZUluU2l6ZVsxXSAvIGVmZmVjdGl2ZU91dFNpemVbMV19LFxuICAgICAgICAgICR7ZWZmZWN0aXZlSW5TaXplWzFdIC8gZWZmZWN0aXZlT3V0U2l6ZVsxXX0pO1xuICAgICAgY29uc3QgdmVjMyBpbnB1dFNoYXBlUkMgPSB2ZWMzKCR7b2xkSGVpZ2h0fS4wLCAke29sZFdpZHRofS4wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7b2xkV2lkdGh9LjApO1xuXG4gICAgICBmbG9hdCBnZXRBVmFsdWUoaW50IGIsIGludCByLCBpbnQgYywgaW50IGQpIHtcbiAgICAgICAgcmV0dXJuIGdldENoYW5uZWwoZ2V0QShiLCByLCBjLCBkKSwgdmVjMihjLCBkKSk7XG4gICAgICB9XG5cbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgaXZlYzQgY29vcmRzID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gICAgICAgIGludCBiID0gY29vcmRzWzBdO1xuICAgICAgICBpbnQgZCA9IGNvb3Jkc1szXTtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHZhbHVlcyBmb3IgbmV4dCBjb2x1bW4gaW4geVJDLnouXG4gICAgICAgIGl2ZWMzIHlSQyA9IGNvb3Jkcy55enogKyBpdmVjMygwLCAwLCAxKTtcblxuICAgICAgICAvLyBGcmFjdGlvbmFsIHNvdXJjZSBpbmRleC5cbiAgICAgICAgdmVjMyBzb3VyY2VGcmFjSW5kZXhSQyA9ICR7c291cmNlRnJhY0luZGV4UkN9O1xuXG4gICAgICAgIC8vIENvbXB1dGUgdGhlIGNvb3JkaW5hdG9ycyBvZiBuZWFyZXN0IG5laWdoYm9yIHBvaW50LlxuICAgICAgICBpdmVjMyBzb3VyY2VOZWFyZXN0UkMgPSBpdmVjMyhcbiAgICAgICAgICBtaW4oaW5wdXRTaGFwZVJDIC0gMS4wLCBmbG9vcihzb3VyY2VGcmFjSW5kZXhSQyArICR7cm91bmRCYXNlfSkpKTtcblxuICAgICAgICAvLyBTaG91bGQgd2UgY2FsY3VsYXRlIG5leHQgY29sdW1uIGFuZCByb3cgZWxlbWVudHMgaW4gMngyIHBhY2tlZCBjZWxsLlxuICAgICAgICBib29sIGhhc05leHRDb2wgPSBkIDwgJHtkZXB0aCAtIDF9O1xuICAgICAgICBib29sIGhhc05leHRSb3cgPSBjb29yZHMueiA8ICR7bmV3V2lkdGggLSAxfTtcblxuICAgICAgICB2ZWM0IG5ld1ZhbHVlID0gdmVjNChcbiAgICAgICAgICBnZXRBVmFsdWUoYiwgc291cmNlTmVhcmVzdFJDLngsIHNvdXJjZU5lYXJlc3RSQy55LCBkKSxcbiAgICAgICAgICBoYXNOZXh0Q29sID8gZ2V0QVZhbHVlKGIsIHNvdXJjZU5lYXJlc3RSQy54LCBzb3VyY2VOZWFyZXN0UkMueSwgZCArIDEpXG4gICAgICAgICAgICAgICAgICAgICA6IDAuMCxcbiAgICAgICAgICBoYXNOZXh0Um93ID8gZ2V0QVZhbHVlKGIsIHNvdXJjZU5lYXJlc3RSQy54LCBzb3VyY2VOZWFyZXN0UkMueiwgZClcbiAgICAgICAgICAgICAgICAgICAgIDogMC4wLFxuICAgICAgICAgIChoYXNOZXh0Um93ICYmIGhhc05leHRDb2wpID9cbiAgICAgICAgICAgIGdldEFWYWx1ZShiLCBzb3VyY2VOZWFyZXN0UkMueCwgc291cmNlTmVhcmVzdFJDLnosIGQgKyAxKSA6IDAuMCk7XG5cbiAgICAgICAgc2V0T3V0cHV0KG5ld1ZhbHVlKTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG4iXX0=