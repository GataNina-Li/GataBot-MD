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
export class DepthToSpaceProgram {
    constructor(outputShape, blockSize, dataFormat) {
        this.variableNames = ['x'];
        this.outputShape = [];
        this.outputShape = outputShape;
        this.blockSize = blockSize;
        this.dataFormat = dataFormat;
        this.userCode = `
    void main() {
      ivec4 coords = getOutputCoords();
      int b = coords[0];
      int h = ${this.getHeightCoordString()};
      int w = ${this.getWidthCoordString()};
      int d = ${this.getDepthCoordString()};

      int in_h = h / ${blockSize};
      int offset_h = imod(h, ${blockSize});
      int in_w = w / ${blockSize};
      int offset_w = imod(w, ${blockSize});
      int offset_d = (offset_h * ${blockSize} + offset_w) *
        ${this.getOutputDepthSize()};
      int in_d = d + offset_d;

      float result = ${this.getInputSamplingString()};
      setOutput(result);
    }
  `;
    }
    getHeightCoordString() {
        if (this.dataFormat === 'NHWC') {
            return `coords[1]`;
        }
        else {
            return `coords[2]`;
        }
    }
    getWidthCoordString() {
        if (this.dataFormat === 'NHWC') {
            return `coords[2]`;
        }
        else {
            return `coords[3]`;
        }
    }
    getDepthCoordString() {
        if (this.dataFormat === 'NHWC') {
            return `coords[3]`;
        }
        else {
            return `coords[1]`;
        }
    }
    getOutputDepthSize() {
        if (this.dataFormat === 'NHWC') {
            return this.outputShape[3];
        }
        else {
            return this.outputShape[1];
        }
    }
    getInputSamplingString() {
        if (this.dataFormat === 'NHWC') {
            return `getX(b, in_h, in_w, in_d)`;
        }
        else {
            return `getX(b, in_d, in_h, in_w)`;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwdGhfdG9fc3BhY2VfZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9kZXB0aF90b19zcGFjZV9ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBSUgsTUFBTSxPQUFPLG1CQUFtQjtJQU85QixZQUNJLFdBQXFCLEVBQUUsU0FBaUIsRUFBRSxVQUF5QjtRQVB2RSxrQkFBYSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEIsZ0JBQVcsR0FBYSxFQUFFLENBQUM7UUFPekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRzs7OztnQkFJSixJQUFJLENBQUMsb0JBQW9CLEVBQUU7Z0JBQzNCLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtnQkFDMUIsSUFBSSxDQUFDLG1CQUFtQixFQUFFOzt1QkFFbkIsU0FBUzsrQkFDRCxTQUFTO3VCQUNqQixTQUFTOytCQUNELFNBQVM7bUNBQ0wsU0FBUztVQUNsQyxJQUFJLENBQUMsa0JBQWtCLEVBQUU7Ozt1QkFHWixJQUFJLENBQUMsc0JBQXNCLEVBQUU7OztHQUdqRCxDQUFDO0lBQ0YsQ0FBQztJQUVPLG9CQUFvQjtRQUMxQixJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssTUFBTSxFQUFFO1lBQzlCLE9BQU8sV0FBVyxDQUFDO1NBQ3BCO2FBQU07WUFDTCxPQUFPLFdBQVcsQ0FBQztTQUNwQjtJQUNILENBQUM7SUFFTyxtQkFBbUI7UUFDekIsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLE1BQU0sRUFBRTtZQUM5QixPQUFPLFdBQVcsQ0FBQztTQUNwQjthQUFNO1lBQ0wsT0FBTyxXQUFXLENBQUM7U0FDcEI7SUFDSCxDQUFDO0lBRU8sbUJBQW1CO1FBQ3pCLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxNQUFNLEVBQUU7WUFDOUIsT0FBTyxXQUFXLENBQUM7U0FDcEI7YUFBTTtZQUNMLE9BQU8sV0FBVyxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQztJQUVPLGtCQUFrQjtRQUN4QixJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssTUFBTSxFQUFFO1lBQzlCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM1QjthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzVCO0lBQ0gsQ0FBQztJQUVPLHNCQUFzQjtRQUM1QixJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssTUFBTSxFQUFFO1lBQzlCLE9BQU8sMkJBQTJCLENBQUM7U0FDcEM7YUFBTTtZQUNMLE9BQU8sMkJBQTJCLENBQUM7U0FDcEM7SUFDSCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuXG5leHBvcnQgY2xhc3MgRGVwdGhUb1NwYWNlUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ3gnXTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdID0gW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG4gIGJsb2NrU2l6ZTogbnVtYmVyO1xuICBkYXRhRm9ybWF0OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBvdXRwdXRTaGFwZTogbnVtYmVyW10sIGJsb2NrU2l6ZTogbnVtYmVyLCBkYXRhRm9ybWF0OiAnTkhXQyd8J05DSFcnKSB7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IG91dHB1dFNoYXBlO1xuICAgIHRoaXMuYmxvY2tTaXplID0gYmxvY2tTaXplO1xuICAgIHRoaXMuZGF0YUZvcm1hdCA9IGRhdGFGb3JtYXQ7XG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICB2b2lkIG1haW4oKSB7XG4gICAgICBpdmVjNCBjb29yZHMgPSBnZXRPdXRwdXRDb29yZHMoKTtcbiAgICAgIGludCBiID0gY29vcmRzWzBdO1xuICAgICAgaW50IGggPSAke3RoaXMuZ2V0SGVpZ2h0Q29vcmRTdHJpbmcoKX07XG4gICAgICBpbnQgdyA9ICR7dGhpcy5nZXRXaWR0aENvb3JkU3RyaW5nKCl9O1xuICAgICAgaW50IGQgPSAke3RoaXMuZ2V0RGVwdGhDb29yZFN0cmluZygpfTtcblxuICAgICAgaW50IGluX2ggPSBoIC8gJHtibG9ja1NpemV9O1xuICAgICAgaW50IG9mZnNldF9oID0gaW1vZChoLCAke2Jsb2NrU2l6ZX0pO1xuICAgICAgaW50IGluX3cgPSB3IC8gJHtibG9ja1NpemV9O1xuICAgICAgaW50IG9mZnNldF93ID0gaW1vZCh3LCAke2Jsb2NrU2l6ZX0pO1xuICAgICAgaW50IG9mZnNldF9kID0gKG9mZnNldF9oICogJHtibG9ja1NpemV9ICsgb2Zmc2V0X3cpICpcbiAgICAgICAgJHt0aGlzLmdldE91dHB1dERlcHRoU2l6ZSgpfTtcbiAgICAgIGludCBpbl9kID0gZCArIG9mZnNldF9kO1xuXG4gICAgICBmbG9hdCByZXN1bHQgPSAke3RoaXMuZ2V0SW5wdXRTYW1wbGluZ1N0cmluZygpfTtcbiAgICAgIHNldE91dHB1dChyZXN1bHQpO1xuICAgIH1cbiAgYDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0SGVpZ2h0Q29vcmRTdHJpbmcoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5kYXRhRm9ybWF0ID09PSAnTkhXQycpIHtcbiAgICAgIHJldHVybiBgY29vcmRzWzFdYDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGBjb29yZHNbMl1gO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0V2lkdGhDb29yZFN0cmluZygpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmRhdGFGb3JtYXQgPT09ICdOSFdDJykge1xuICAgICAgcmV0dXJuIGBjb29yZHNbMl1gO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYGNvb3Jkc1szXWA7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXREZXB0aENvb3JkU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuZGF0YUZvcm1hdCA9PT0gJ05IV0MnKSB7XG4gICAgICByZXR1cm4gYGNvb3Jkc1szXWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgY29vcmRzWzFdYDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldE91dHB1dERlcHRoU2l6ZSgpOiBudW1iZXIge1xuICAgIGlmICh0aGlzLmRhdGFGb3JtYXQgPT09ICdOSFdDJykge1xuICAgICAgcmV0dXJuIHRoaXMub3V0cHV0U2hhcGVbM107XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLm91dHB1dFNoYXBlWzFdO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0SW5wdXRTYW1wbGluZ1N0cmluZygpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmRhdGFGb3JtYXQgPT09ICdOSFdDJykge1xuICAgICAgcmV0dXJuIGBnZXRYKGIsIGluX2gsIGluX3csIGluX2QpYDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGBnZXRYKGIsIGluX2QsIGluX2gsIGluX3cpYDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==