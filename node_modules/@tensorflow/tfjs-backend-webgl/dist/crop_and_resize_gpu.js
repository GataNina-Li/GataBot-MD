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
export class CropAndResizeProgram {
    constructor(imageShape, boxShape, cropSize, method, extrapolationValue) {
        this.variableNames = ['Image', 'Boxes', 'BoxInd'];
        this.outputShape = [];
        const [batch, imageHeight, imageWidth, depth] = imageShape;
        const [numBoxes,] = boxShape;
        const [cropHeight, cropWidth] = cropSize;
        this.outputShape = [numBoxes, cropHeight, cropWidth, depth];
        const methodId = method === 'bilinear' ? 1 : 0;
        const [inputHeightFloat, inputWidthFloat] = [`${imageHeight - 1}.0`, `${imageWidth - 1}.0`];
        const [heightRatio, heightScale, inY] = cropHeight > 1 ?
            [
                `${(imageHeight - 1) / (cropHeight - 1)}`,
                '(y2-y1) * height_ratio',
                `y1*${inputHeightFloat} + float(y)*(height_scale)`,
            ] :
            [
                '0.0',
                '0.0',
                `0.5 * (y1+y2) * ${inputHeightFloat}`,
            ];
        const [widthRatio, widthScale, inX] = cropWidth > 1 ?
            [
                `${(imageWidth - 1) / (cropWidth - 1)}`,
                '(x2-x1) * width_ratio',
                `x1*${inputWidthFloat} + float(x)*(width_scale)`,
            ] :
            [
                '0.0',
                '0.0',
                `0.5 * (x1+x2) * ${inputWidthFloat}`,
            ];
        // Reference implementation
        // tslint:disable-next-line:max-line-length
        // https://github.com/tensorflow/tensorflow/blob/master/tensorflow/core/kernels/crop_and_resize_op_gpu.cu.cc
        this.userCode = `
      const float height_ratio = float(${heightRatio});
      const float width_ratio = float(${widthRatio});
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int y = coords[1];
        int x = coords[2];
        int d = coords[3];

        // get box vals
        float y1 = getBoxes(b,0);
        float x1 = getBoxes(b,1);
        float y2 = getBoxes(b,2);
        float x2 = getBoxes(b,3);

        // get image in batch index
        int bInd = round(getBoxInd(b));
        if(bInd < 0 || bInd >= ${batch}) {
          return;
        }

        float height_scale = ${heightScale};
        float width_scale = ${widthScale};

        float in_y = ${inY};
        if( in_y < 0.0 || in_y > ${inputHeightFloat} ) {
          setOutput(float(${extrapolationValue}));
          return;
        }
        float in_x = ${inX};
        if( in_x < 0.0 || in_x > ${inputWidthFloat} ) {
          setOutput(float(${extrapolationValue}));
          return;
        }

        vec2 sourceFracIndexCR = vec2(in_x,in_y);
        if(${methodId} == 1) {
          // Compute the four integer indices.
          ivec2 sourceFloorCR = ivec2(sourceFracIndexCR);
          ivec2 sourceCeilCR = ivec2(ceil(sourceFracIndexCR));

          float topLeft = getImage(b, sourceFloorCR.y, sourceFloorCR.x, d);
          float bottomLeft = getImage(b, sourceCeilCR.y, sourceFloorCR.x, d);
          float topRight = getImage(b, sourceFloorCR.y, sourceCeilCR.x, d);
          float bottomRight = getImage(b, sourceCeilCR.y, sourceCeilCR.x, d);

          vec2 fracCR = sourceFracIndexCR - vec2(sourceFloorCR);

          float top = topLeft + (topRight - topLeft) * fracCR.x;
          float bottom = bottomLeft + (bottomRight - bottomLeft) * fracCR.x;
          float newValue = top + (bottom - top) * fracCR.y;
          setOutput(newValue);
        } else {
          // Compute the coordinators of nearest neighbor point.
          ivec2 sourceNearestCR = ivec2(floor(
            sourceFracIndexCR + vec2(0.5,0.5)));
          float newValue = getImage(b, sourceNearestCR.y, sourceNearestCR.x, d);
          setOutput(newValue);
        }
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JvcF9hbmRfcmVzaXplX2dwdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvY3JvcF9hbmRfcmVzaXplX2dwdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFJSCxNQUFNLE9BQU8sb0JBQW9CO0lBSy9CLFlBQ0ksVUFBNEMsRUFBRSxRQUEwQixFQUN4RSxRQUEwQixFQUFFLE1BQTRCLEVBQ3hELGtCQUEwQjtRQVA5QixrQkFBYSxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM3QyxnQkFBVyxHQUFhLEVBQUUsQ0FBQztRQU96QixNQUFNLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQzNELE1BQU0sQ0FBQyxRQUFRLEVBQUcsR0FBRyxRQUFRLENBQUM7UUFDOUIsTUFBTSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsR0FBRyxRQUFRLENBQUM7UUFDekMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVELE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRS9DLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsR0FDckMsQ0FBQyxHQUFHLFdBQVcsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXBELE1BQU0sQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLEdBQUcsQ0FBQyxHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNwRDtnQkFDRSxHQUFHLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUN6Qyx3QkFBd0I7Z0JBQ3hCLE1BQU0sZ0JBQWdCLDRCQUE0QjthQUNuRCxDQUFDLENBQUM7WUFDSDtnQkFDRSxLQUFLO2dCQUNMLEtBQUs7Z0JBQ0wsbUJBQW1CLGdCQUFnQixFQUFFO2FBQ3RDLENBQUM7UUFDTixNQUFNLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDakQ7Z0JBQ0UsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDdkMsdUJBQXVCO2dCQUN2QixNQUFNLGVBQWUsMkJBQTJCO2FBQ2pELENBQUMsQ0FBQztZQUNIO2dCQUNFLEtBQUs7Z0JBQ0wsS0FBSztnQkFDTCxtQkFBbUIsZUFBZSxFQUFFO2FBQ3JDLENBQUM7UUFFTiwyQkFBMkI7UUFDM0IsMkNBQTJDO1FBQzNDLDRHQUE0RztRQUM1RyxJQUFJLENBQUMsUUFBUSxHQUFHO3lDQUNxQixXQUFXO3dDQUNaLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7aUNBZ0JqQixLQUFLOzs7OytCQUlQLFdBQVc7OEJBQ1osVUFBVTs7dUJBRWpCLEdBQUc7bUNBQ1MsZ0JBQWdCOzRCQUN2QixrQkFBa0I7Ozt1QkFHdkIsR0FBRzttQ0FDUyxlQUFlOzRCQUN0QixrQkFBa0I7Ozs7O2FBS2pDLFFBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQXdCaEIsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtHUEdQVVByb2dyYW19IGZyb20gJy4vZ3BncHVfbWF0aCc7XG5cbmV4cG9ydCBjbGFzcyBDcm9wQW5kUmVzaXplUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ0ltYWdlJywgJ0JveGVzJywgJ0JveEluZCddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW10gPSBbXTtcbiAgdXNlckNvZGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIGltYWdlU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdLCBib3hTaGFwZTogW251bWJlciwgbnVtYmVyXSxcbiAgICAgIGNyb3BTaXplOiBbbnVtYmVyLCBudW1iZXJdLCBtZXRob2Q6ICdiaWxpbmVhcid8J25lYXJlc3QnLFxuICAgICAgZXh0cmFwb2xhdGlvblZhbHVlOiBudW1iZXIpIHtcbiAgICBjb25zdCBbYmF0Y2gsIGltYWdlSGVpZ2h0LCBpbWFnZVdpZHRoLCBkZXB0aF0gPSBpbWFnZVNoYXBlO1xuICAgIGNvbnN0IFtudW1Cb3hlcywgXSA9IGJveFNoYXBlO1xuICAgIGNvbnN0IFtjcm9wSGVpZ2h0LCBjcm9wV2lkdGhdID0gY3JvcFNpemU7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IFtudW1Cb3hlcywgY3JvcEhlaWdodCwgY3JvcFdpZHRoLCBkZXB0aF07XG4gICAgY29uc3QgbWV0aG9kSWQgPSBtZXRob2QgPT09ICdiaWxpbmVhcicgPyAxIDogMDtcblxuICAgIGNvbnN0IFtpbnB1dEhlaWdodEZsb2F0LCBpbnB1dFdpZHRoRmxvYXRdID1cbiAgICAgICAgW2Ake2ltYWdlSGVpZ2h0IC0gMX0uMGAsIGAke2ltYWdlV2lkdGggLSAxfS4wYF07XG5cbiAgICBjb25zdCBbaGVpZ2h0UmF0aW8sIGhlaWdodFNjYWxlLCBpblldID0gY3JvcEhlaWdodCA+IDEgP1xuICAgICAgICBbXG4gICAgICAgICAgYCR7KGltYWdlSGVpZ2h0IC0gMSkgLyAoY3JvcEhlaWdodCAtIDEpfWAsXG4gICAgICAgICAgJyh5Mi15MSkgKiBoZWlnaHRfcmF0aW8nLFxuICAgICAgICAgIGB5MSoke2lucHV0SGVpZ2h0RmxvYXR9ICsgZmxvYXQoeSkqKGhlaWdodF9zY2FsZSlgLFxuICAgICAgICBdIDpcbiAgICAgICAgW1xuICAgICAgICAgICcwLjAnLFxuICAgICAgICAgICcwLjAnLFxuICAgICAgICAgIGAwLjUgKiAoeTEreTIpICogJHtpbnB1dEhlaWdodEZsb2F0fWAsXG4gICAgICAgIF07XG4gICAgY29uc3QgW3dpZHRoUmF0aW8sIHdpZHRoU2NhbGUsIGluWF0gPSBjcm9wV2lkdGggPiAxID9cbiAgICAgICAgW1xuICAgICAgICAgIGAkeyhpbWFnZVdpZHRoIC0gMSkgLyAoY3JvcFdpZHRoIC0gMSl9YCxcbiAgICAgICAgICAnKHgyLXgxKSAqIHdpZHRoX3JhdGlvJyxcbiAgICAgICAgICBgeDEqJHtpbnB1dFdpZHRoRmxvYXR9ICsgZmxvYXQoeCkqKHdpZHRoX3NjYWxlKWAsXG4gICAgICAgIF0gOlxuICAgICAgICBbXG4gICAgICAgICAgJzAuMCcsXG4gICAgICAgICAgJzAuMCcsXG4gICAgICAgICAgYDAuNSAqICh4MSt4MikgKiAke2lucHV0V2lkdGhGbG9hdH1gLFxuICAgICAgICBdO1xuXG4gICAgLy8gUmVmZXJlbmNlIGltcGxlbWVudGF0aW9uXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90ZW5zb3JmbG93L3RlbnNvcmZsb3cvYmxvYi9tYXN0ZXIvdGVuc29yZmxvdy9jb3JlL2tlcm5lbHMvY3JvcF9hbmRfcmVzaXplX29wX2dwdS5jdS5jY1xuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICBjb25zdCBmbG9hdCBoZWlnaHRfcmF0aW8gPSBmbG9hdCgke2hlaWdodFJhdGlvfSk7XG4gICAgICBjb25zdCBmbG9hdCB3aWR0aF9yYXRpbyA9IGZsb2F0KCR7d2lkdGhSYXRpb30pO1xuICAgICAgdm9pZCBtYWluKCkge1xuICAgICAgICBpdmVjNCBjb29yZHMgPSBnZXRPdXRwdXRDb29yZHMoKTtcbiAgICAgICAgaW50IGIgPSBjb29yZHNbMF07XG4gICAgICAgIGludCB5ID0gY29vcmRzWzFdO1xuICAgICAgICBpbnQgeCA9IGNvb3Jkc1syXTtcbiAgICAgICAgaW50IGQgPSBjb29yZHNbM107XG5cbiAgICAgICAgLy8gZ2V0IGJveCB2YWxzXG4gICAgICAgIGZsb2F0IHkxID0gZ2V0Qm94ZXMoYiwwKTtcbiAgICAgICAgZmxvYXQgeDEgPSBnZXRCb3hlcyhiLDEpO1xuICAgICAgICBmbG9hdCB5MiA9IGdldEJveGVzKGIsMik7XG4gICAgICAgIGZsb2F0IHgyID0gZ2V0Qm94ZXMoYiwzKTtcblxuICAgICAgICAvLyBnZXQgaW1hZ2UgaW4gYmF0Y2ggaW5kZXhcbiAgICAgICAgaW50IGJJbmQgPSByb3VuZChnZXRCb3hJbmQoYikpO1xuICAgICAgICBpZihiSW5kIDwgMCB8fCBiSW5kID49ICR7YmF0Y2h9KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZmxvYXQgaGVpZ2h0X3NjYWxlID0gJHtoZWlnaHRTY2FsZX07XG4gICAgICAgIGZsb2F0IHdpZHRoX3NjYWxlID0gJHt3aWR0aFNjYWxlfTtcblxuICAgICAgICBmbG9hdCBpbl95ID0gJHtpbll9O1xuICAgICAgICBpZiggaW5feSA8IDAuMCB8fCBpbl95ID4gJHtpbnB1dEhlaWdodEZsb2F0fSApIHtcbiAgICAgICAgICBzZXRPdXRwdXQoZmxvYXQoJHtleHRyYXBvbGF0aW9uVmFsdWV9KSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZsb2F0IGluX3ggPSAke2luWH07XG4gICAgICAgIGlmKCBpbl94IDwgMC4wIHx8IGluX3ggPiAke2lucHV0V2lkdGhGbG9hdH0gKSB7XG4gICAgICAgICAgc2V0T3V0cHV0KGZsb2F0KCR7ZXh0cmFwb2xhdGlvblZhbHVlfSkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZlYzIgc291cmNlRnJhY0luZGV4Q1IgPSB2ZWMyKGluX3gsaW5feSk7XG4gICAgICAgIGlmKCR7bWV0aG9kSWR9ID09IDEpIHtcbiAgICAgICAgICAvLyBDb21wdXRlIHRoZSBmb3VyIGludGVnZXIgaW5kaWNlcy5cbiAgICAgICAgICBpdmVjMiBzb3VyY2VGbG9vckNSID0gaXZlYzIoc291cmNlRnJhY0luZGV4Q1IpO1xuICAgICAgICAgIGl2ZWMyIHNvdXJjZUNlaWxDUiA9IGl2ZWMyKGNlaWwoc291cmNlRnJhY0luZGV4Q1IpKTtcblxuICAgICAgICAgIGZsb2F0IHRvcExlZnQgPSBnZXRJbWFnZShiLCBzb3VyY2VGbG9vckNSLnksIHNvdXJjZUZsb29yQ1IueCwgZCk7XG4gICAgICAgICAgZmxvYXQgYm90dG9tTGVmdCA9IGdldEltYWdlKGIsIHNvdXJjZUNlaWxDUi55LCBzb3VyY2VGbG9vckNSLngsIGQpO1xuICAgICAgICAgIGZsb2F0IHRvcFJpZ2h0ID0gZ2V0SW1hZ2UoYiwgc291cmNlRmxvb3JDUi55LCBzb3VyY2VDZWlsQ1IueCwgZCk7XG4gICAgICAgICAgZmxvYXQgYm90dG9tUmlnaHQgPSBnZXRJbWFnZShiLCBzb3VyY2VDZWlsQ1IueSwgc291cmNlQ2VpbENSLngsIGQpO1xuXG4gICAgICAgICAgdmVjMiBmcmFjQ1IgPSBzb3VyY2VGcmFjSW5kZXhDUiAtIHZlYzIoc291cmNlRmxvb3JDUik7XG5cbiAgICAgICAgICBmbG9hdCB0b3AgPSB0b3BMZWZ0ICsgKHRvcFJpZ2h0IC0gdG9wTGVmdCkgKiBmcmFjQ1IueDtcbiAgICAgICAgICBmbG9hdCBib3R0b20gPSBib3R0b21MZWZ0ICsgKGJvdHRvbVJpZ2h0IC0gYm90dG9tTGVmdCkgKiBmcmFjQ1IueDtcbiAgICAgICAgICBmbG9hdCBuZXdWYWx1ZSA9IHRvcCArIChib3R0b20gLSB0b3ApICogZnJhY0NSLnk7XG4gICAgICAgICAgc2V0T3V0cHV0KG5ld1ZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBDb21wdXRlIHRoZSBjb29yZGluYXRvcnMgb2YgbmVhcmVzdCBuZWlnaGJvciBwb2ludC5cbiAgICAgICAgICBpdmVjMiBzb3VyY2VOZWFyZXN0Q1IgPSBpdmVjMihmbG9vcihcbiAgICAgICAgICAgIHNvdXJjZUZyYWNJbmRleENSICsgdmVjMigwLjUsMC41KSkpO1xuICAgICAgICAgIGZsb2F0IG5ld1ZhbHVlID0gZ2V0SW1hZ2UoYiwgc291cmNlTmVhcmVzdENSLnksIHNvdXJjZU5lYXJlc3RDUi54LCBkKTtcbiAgICAgICAgICBzZXRPdXRwdXQobmV3VmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuIl19