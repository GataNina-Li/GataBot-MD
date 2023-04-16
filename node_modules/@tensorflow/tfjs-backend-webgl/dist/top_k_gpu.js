// Based on Algorithm 2 of Bitonic Top K, ref:
// https://anilshanbhag.in/static/papers/gputopk_sigmod18.pdf
// The original algorithm is based on computing the top K only, however
// since for TFJS we require the indices of the top K values as well then the
// algorithm found here is a bit modified. Rather than producing the values
// at each step, the indices containing the top K are generated instead.
// The output values are not generated to reduce the number of outputs in the
// GPU, the values can easily be retrieved from the indices using a gather
// op.
export class SwapProgram {
    /**
     * @param shape desired output shape (can be larger than input shape, output
     *                                    will be padded with -Infinity)
     */
    constructor(shape) {
        this.variableNames = ['x', 'indices'];
        // |n| Size of the original input of TopK.
        // |firstPass|indicates if this is the first time swap is being used which
        // means no indices input containing the top K is present yet.
        // |inc| Swaps pairs of indices (0, inc), (1, inc + 1), (2, inc + 2) ...
        this.customUniforms = [
            { name: 'n', type: 'int' },
            { name: 'firstPass', type: 'int' },
            { name: 'negativeInf', type: 'float' },
            { name: 'dir', type: 'int' },
            { name: 'inc', type: 'int' }
        ];
        this.outputShape = shape;
        this.userCode = `
       void main() {
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int elemIdx = coords[1];

         // We compare elements pair-wise within a group of size 2 * inc.
         // The comparing rule for each group alternates between ascending
         // and descending. Within each group, we compare each pair at
         // positions i and i+inc. To decide whether an element at position i
         // is x0 or x1, we mod it by 2 * inc, if the result is smaller than
         // inc, it is in the first half of the group, we denote it as x0,
         // otherwise we denote it as x1.
         // For example, as shown in the Bitonic top K paper referenced above,
         // Figure5(a) shows that element[1] is in the
         // second half of the group when group size is 2, but it is in the
         // first half of the group when group size is 4.

         bool isFirstInPair = imod(elemIdx, 2 * inc) < inc;
         int i = isFirstInPair ? elemIdx : elemIdx - inc;

         int i0 = firstPass == 1 ? i : int(getIndices(batch, i));
         int i1 = firstPass == 1 ? i + inc : int(getIndices(batch, i + inc));
         float x0 = i0 < n ? getX(batch, i0) : negativeInf;
         float x1 = i1 < n ? getX(batch, i1) : negativeInf;

         // Denotes which direction indices are in (ascending or descending).
         bool reverse = imod(elemIdx, 2 * dir) >= dir;
         bool isGreater = x0 > x1 || (x0 == x1 && i1 > i0);
         if (reverse == isGreater) { // Elements in opposite order of direction
           int iTemp = i0;
           i0 = i1;
           i1 = iTemp;
         }
         if (isFirstInPair) {
            setOutput(float(i0));
         } else {
            setOutput(float(i1));
         }
       }
     `;
    }
}
export class MergeProgram {
    /**
     * @param shape desired output shape (must be half of the input size)
     */
    constructor(shape) {
        this.variableNames = ['x', 'indices'];
        // |n| Size of the original input of TopK
        // |firstPass| indicates if this is the first time swap is being used which
        // means no indices input containing the top K is present yet.
        // |k| Top k elements desired
        this.customUniforms = [
            { name: 'n', type: 'int' },
            { name: 'firstPass', type: 'int' },
            { name: 'k', type: 'int' }
        ];
        this.outputShape = shape;
        this.userCode = `
    void main() {
         // Takes max of indices (0, k), (1, k + 1), (2, k + 2) ...
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int elemIdx = coords[1];

         // The output size is half of the previous size.
         // If the previous sequence is | | | | _ _ _ _  | | | |  _ _ _ _ (k=4),
         // we only need to output the indices at positions |, the indices at
         // positions _ can be thrown away, see Figure5(b) After Phase 2
         // (Merge phase) in the Bitonic Top K paper referenced above.
         // For example, the paper shows we only need to output the orange bars.
         // The output sequence should look like this | | | | | | | |.
         // Because the sequence is halved, to map the output index back
         // to the previous sequence to find the corresponding value,
         // we need to double the index. When we double the index,
         // we basically interpolate a position, so 2i looks like
         // | _ | _ | _ | _ | _ | _ | _. We move the | to the first k position
         // of each 2k positions by - elemIdx % k. E.g. for output at
         // index 4,5,6,7, we want to get the corresponding element at
         // original index 8,9,10,11, for output at index 8,9,10,11,
         // we want to get the corresponding element at original index
         // 16,17,18,19, so on and so forth.

         int i = elemIdx < k ? elemIdx : (elemIdx * 2 - imod(elemIdx, k));
         int i0 = firstPass == 1 ? i : int(getIndices(batch, i));
         int i1 = firstPass == 1 ? i + k : int(getIndices(batch, i + k));

         float x0 = getX(batch, i0);
         float x1 = i1 < n ? getX(batch, i1) : x0;

         setOutput(x0 >= x1 ? float(i0) : float(i1));
       }
     `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9wX2tfZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy90b3Bfa19ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBbUJBLDhDQUE4QztBQUM5Qyw2REFBNkQ7QUFDN0QsdUVBQXVFO0FBQ3ZFLDZFQUE2RTtBQUM3RSwyRUFBMkU7QUFDM0Usd0VBQXdFO0FBQ3hFLDZFQUE2RTtBQUM3RSwwRUFBMEU7QUFDMUUsTUFBTTtBQUNOLE1BQU0sT0FBTyxXQUFXO0lBZ0J0Qjs7O09BR0c7SUFDSCxZQUFZLEtBQWU7UUFuQjNCLGtCQUFhLEdBQUcsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFHakMsMENBQTBDO1FBQzFDLDBFQUEwRTtRQUMxRSw4REFBOEQ7UUFDOUQsd0VBQXdFO1FBQ3hFLG1CQUFjLEdBQUc7WUFDZixFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQW9CLEVBQUM7WUFDdkMsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxLQUFvQixFQUFDO1lBQy9DLEVBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsT0FBc0IsRUFBQztZQUNuRCxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQW9CLEVBQUM7WUFDekMsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFvQixFQUFDO1NBQzFDLENBQUM7UUFPQSxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUV6QixJQUFJLENBQUMsUUFBUSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01Bd0NkLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLE9BQU8sWUFBWTtJQWN2Qjs7T0FFRztJQUNILFlBQVksS0FBZTtRQWhCM0Isa0JBQWEsR0FBRyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUdqQyx5Q0FBeUM7UUFDekMsMkVBQTJFO1FBQzNFLDhEQUE4RDtRQUM5RCw2QkFBNkI7UUFDN0IsbUJBQWMsR0FBRztZQUNmLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBb0IsRUFBQztZQUN2QyxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLEtBQW9CLEVBQUM7WUFDL0MsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFvQixFQUFDO1NBQ3hDLENBQUM7UUFNQSxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUV6QixJQUFJLENBQUMsUUFBUSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01Ba0NkLENBQUM7SUFDTCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMSBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQge0dQR1BVUHJvZ3JhbX0gZnJvbSAnLi9ncGdwdV9tYXRoJztcbmltcG9ydCB7VW5pZm9ybVR5cGV9IGZyb20gJy4vc2hhZGVyX2NvbXBpbGVyJztcblxuLy8gQmFzZWQgb24gQWxnb3JpdGhtIDIgb2YgQml0b25pYyBUb3AgSywgcmVmOlxuLy8gaHR0cHM6Ly9hbmlsc2hhbmJoYWcuaW4vc3RhdGljL3BhcGVycy9ncHV0b3BrX3NpZ21vZDE4LnBkZlxuLy8gVGhlIG9yaWdpbmFsIGFsZ29yaXRobSBpcyBiYXNlZCBvbiBjb21wdXRpbmcgdGhlIHRvcCBLIG9ubHksIGhvd2V2ZXJcbi8vIHNpbmNlIGZvciBURkpTIHdlIHJlcXVpcmUgdGhlIGluZGljZXMgb2YgdGhlIHRvcCBLIHZhbHVlcyBhcyB3ZWxsIHRoZW4gdGhlXG4vLyBhbGdvcml0aG0gZm91bmQgaGVyZSBpcyBhIGJpdCBtb2RpZmllZC4gUmF0aGVyIHRoYW4gcHJvZHVjaW5nIHRoZSB2YWx1ZXNcbi8vIGF0IGVhY2ggc3RlcCwgdGhlIGluZGljZXMgY29udGFpbmluZyB0aGUgdG9wIEsgYXJlIGdlbmVyYXRlZCBpbnN0ZWFkLlxuLy8gVGhlIG91dHB1dCB2YWx1ZXMgYXJlIG5vdCBnZW5lcmF0ZWQgdG8gcmVkdWNlIHRoZSBudW1iZXIgb2Ygb3V0cHV0cyBpbiB0aGVcbi8vIEdQVSwgdGhlIHZhbHVlcyBjYW4gZWFzaWx5IGJlIHJldHJpZXZlZCBmcm9tIHRoZSBpbmRpY2VzIHVzaW5nIGEgZ2F0aGVyXG4vLyBvcC5cbmV4cG9ydCBjbGFzcyBTd2FwUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ3gnLCAnaW5kaWNlcyddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG4gIC8vIHxufCBTaXplIG9mIHRoZSBvcmlnaW5hbCBpbnB1dCBvZiBUb3BLLlxuICAvLyB8Zmlyc3RQYXNzfGluZGljYXRlcyBpZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lIHN3YXAgaXMgYmVpbmcgdXNlZCB3aGljaFxuICAvLyBtZWFucyBubyBpbmRpY2VzIGlucHV0IGNvbnRhaW5pbmcgdGhlIHRvcCBLIGlzIHByZXNlbnQgeWV0LlxuICAvLyB8aW5jfCBTd2FwcyBwYWlycyBvZiBpbmRpY2VzICgwLCBpbmMpLCAoMSwgaW5jICsgMSksICgyLCBpbmMgKyAyKSAuLi5cbiAgY3VzdG9tVW5pZm9ybXMgPSBbXG4gICAge25hbWU6ICduJywgdHlwZTogJ2ludCcgYXMgVW5pZm9ybVR5cGV9LFxuICAgIHtuYW1lOiAnZmlyc3RQYXNzJywgdHlwZTogJ2ludCcgYXMgVW5pZm9ybVR5cGV9LFxuICAgIHtuYW1lOiAnbmVnYXRpdmVJbmYnLCB0eXBlOiAnZmxvYXQnIGFzIFVuaWZvcm1UeXBlfSxcbiAgICB7bmFtZTogJ2RpcicsIHR5cGU6ICdpbnQnIGFzIFVuaWZvcm1UeXBlfSxcbiAgICB7bmFtZTogJ2luYycsIHR5cGU6ICdpbnQnIGFzIFVuaWZvcm1UeXBlfVxuICBdO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gc2hhcGUgZGVzaXJlZCBvdXRwdXQgc2hhcGUgKGNhbiBiZSBsYXJnZXIgdGhhbiBpbnB1dCBzaGFwZSwgb3V0cHV0XG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lsbCBiZSBwYWRkZWQgd2l0aCAtSW5maW5pdHkpXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzaGFwZTogbnVtYmVyW10pIHtcbiAgICB0aGlzLm91dHB1dFNoYXBlID0gc2hhcGU7XG5cbiAgICB0aGlzLnVzZXJDb2RlID0gYFxuICAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgIGl2ZWMyIGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICAgaW50IGJhdGNoID0gY29vcmRzWzBdO1xuICAgICAgICAgaW50IGVsZW1JZHggPSBjb29yZHNbMV07XG5cbiAgICAgICAgIC8vIFdlIGNvbXBhcmUgZWxlbWVudHMgcGFpci13aXNlIHdpdGhpbiBhIGdyb3VwIG9mIHNpemUgMiAqIGluYy5cbiAgICAgICAgIC8vIFRoZSBjb21wYXJpbmcgcnVsZSBmb3IgZWFjaCBncm91cCBhbHRlcm5hdGVzIGJldHdlZW4gYXNjZW5kaW5nXG4gICAgICAgICAvLyBhbmQgZGVzY2VuZGluZy4gV2l0aGluIGVhY2ggZ3JvdXAsIHdlIGNvbXBhcmUgZWFjaCBwYWlyIGF0XG4gICAgICAgICAvLyBwb3NpdGlvbnMgaSBhbmQgaStpbmMuIFRvIGRlY2lkZSB3aGV0aGVyIGFuIGVsZW1lbnQgYXQgcG9zaXRpb24gaVxuICAgICAgICAgLy8gaXMgeDAgb3IgeDEsIHdlIG1vZCBpdCBieSAyICogaW5jLCBpZiB0aGUgcmVzdWx0IGlzIHNtYWxsZXIgdGhhblxuICAgICAgICAgLy8gaW5jLCBpdCBpcyBpbiB0aGUgZmlyc3QgaGFsZiBvZiB0aGUgZ3JvdXAsIHdlIGRlbm90ZSBpdCBhcyB4MCxcbiAgICAgICAgIC8vIG90aGVyd2lzZSB3ZSBkZW5vdGUgaXQgYXMgeDEuXG4gICAgICAgICAvLyBGb3IgZXhhbXBsZSwgYXMgc2hvd24gaW4gdGhlIEJpdG9uaWMgdG9wIEsgcGFwZXIgcmVmZXJlbmNlZCBhYm92ZSxcbiAgICAgICAgIC8vIEZpZ3VyZTUoYSkgc2hvd3MgdGhhdCBlbGVtZW50WzFdIGlzIGluIHRoZVxuICAgICAgICAgLy8gc2Vjb25kIGhhbGYgb2YgdGhlIGdyb3VwIHdoZW4gZ3JvdXAgc2l6ZSBpcyAyLCBidXQgaXQgaXMgaW4gdGhlXG4gICAgICAgICAvLyBmaXJzdCBoYWxmIG9mIHRoZSBncm91cCB3aGVuIGdyb3VwIHNpemUgaXMgNC5cblxuICAgICAgICAgYm9vbCBpc0ZpcnN0SW5QYWlyID0gaW1vZChlbGVtSWR4LCAyICogaW5jKSA8IGluYztcbiAgICAgICAgIGludCBpID0gaXNGaXJzdEluUGFpciA/IGVsZW1JZHggOiBlbGVtSWR4IC0gaW5jO1xuXG4gICAgICAgICBpbnQgaTAgPSBmaXJzdFBhc3MgPT0gMSA/IGkgOiBpbnQoZ2V0SW5kaWNlcyhiYXRjaCwgaSkpO1xuICAgICAgICAgaW50IGkxID0gZmlyc3RQYXNzID09IDEgPyBpICsgaW5jIDogaW50KGdldEluZGljZXMoYmF0Y2gsIGkgKyBpbmMpKTtcbiAgICAgICAgIGZsb2F0IHgwID0gaTAgPCBuID8gZ2V0WChiYXRjaCwgaTApIDogbmVnYXRpdmVJbmY7XG4gICAgICAgICBmbG9hdCB4MSA9IGkxIDwgbiA/IGdldFgoYmF0Y2gsIGkxKSA6IG5lZ2F0aXZlSW5mO1xuXG4gICAgICAgICAvLyBEZW5vdGVzIHdoaWNoIGRpcmVjdGlvbiBpbmRpY2VzIGFyZSBpbiAoYXNjZW5kaW5nIG9yIGRlc2NlbmRpbmcpLlxuICAgICAgICAgYm9vbCByZXZlcnNlID0gaW1vZChlbGVtSWR4LCAyICogZGlyKSA+PSBkaXI7XG4gICAgICAgICBib29sIGlzR3JlYXRlciA9IHgwID4geDEgfHwgKHgwID09IHgxICYmIGkxID4gaTApO1xuICAgICAgICAgaWYgKHJldmVyc2UgPT0gaXNHcmVhdGVyKSB7IC8vIEVsZW1lbnRzIGluIG9wcG9zaXRlIG9yZGVyIG9mIGRpcmVjdGlvblxuICAgICAgICAgICBpbnQgaVRlbXAgPSBpMDtcbiAgICAgICAgICAgaTAgPSBpMTtcbiAgICAgICAgICAgaTEgPSBpVGVtcDtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmIChpc0ZpcnN0SW5QYWlyKSB7XG4gICAgICAgICAgICBzZXRPdXRwdXQoZmxvYXQoaTApKTtcbiAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRPdXRwdXQoZmxvYXQoaTEpKTtcbiAgICAgICAgIH1cbiAgICAgICB9XG4gICAgIGA7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE1lcmdlUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ3gnLCAnaW5kaWNlcyddO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG4gIHVzZXJDb2RlOiBzdHJpbmc7XG4gIC8vIHxufCBTaXplIG9mIHRoZSBvcmlnaW5hbCBpbnB1dCBvZiBUb3BLXG4gIC8vIHxmaXJzdFBhc3N8IGluZGljYXRlcyBpZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lIHN3YXAgaXMgYmVpbmcgdXNlZCB3aGljaFxuICAvLyBtZWFucyBubyBpbmRpY2VzIGlucHV0IGNvbnRhaW5pbmcgdGhlIHRvcCBLIGlzIHByZXNlbnQgeWV0LlxuICAvLyB8a3wgVG9wIGsgZWxlbWVudHMgZGVzaXJlZFxuICBjdXN0b21Vbmlmb3JtcyA9IFtcbiAgICB7bmFtZTogJ24nLCB0eXBlOiAnaW50JyBhcyBVbmlmb3JtVHlwZX0sXG4gICAge25hbWU6ICdmaXJzdFBhc3MnLCB0eXBlOiAnaW50JyBhcyBVbmlmb3JtVHlwZX0sXG4gICAge25hbWU6ICdrJywgdHlwZTogJ2ludCcgYXMgVW5pZm9ybVR5cGV9XG4gIF07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBzaGFwZSBkZXNpcmVkIG91dHB1dCBzaGFwZSAobXVzdCBiZSBoYWxmIG9mIHRoZSBpbnB1dCBzaXplKVxuICAgKi9cbiAgY29uc3RydWN0b3Ioc2hhcGU6IG51bWJlcltdKSB7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IHNoYXBlO1xuXG4gICAgdGhpcy51c2VyQ29kZSA9IGBcbiAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgICAvLyBUYWtlcyBtYXggb2YgaW5kaWNlcyAoMCwgayksICgxLCBrICsgMSksICgyLCBrICsgMikgLi4uXG4gICAgICAgICBpdmVjMiBjb29yZHMgPSBnZXRPdXRwdXRDb29yZHMoKTtcbiAgICAgICAgIGludCBiYXRjaCA9IGNvb3Jkc1swXTtcbiAgICAgICAgIGludCBlbGVtSWR4ID0gY29vcmRzWzFdO1xuXG4gICAgICAgICAvLyBUaGUgb3V0cHV0IHNpemUgaXMgaGFsZiBvZiB0aGUgcHJldmlvdXMgc2l6ZS5cbiAgICAgICAgIC8vIElmIHRoZSBwcmV2aW91cyBzZXF1ZW5jZSBpcyB8IHwgfCB8IF8gXyBfIF8gIHwgfCB8IHwgIF8gXyBfIF8gKGs9NCksXG4gICAgICAgICAvLyB3ZSBvbmx5IG5lZWQgdG8gb3V0cHV0IHRoZSBpbmRpY2VzIGF0IHBvc2l0aW9ucyB8LCB0aGUgaW5kaWNlcyBhdFxuICAgICAgICAgLy8gcG9zaXRpb25zIF8gY2FuIGJlIHRocm93biBhd2F5LCBzZWUgRmlndXJlNShiKSBBZnRlciBQaGFzZSAyXG4gICAgICAgICAvLyAoTWVyZ2UgcGhhc2UpIGluIHRoZSBCaXRvbmljIFRvcCBLIHBhcGVyIHJlZmVyZW5jZWQgYWJvdmUuXG4gICAgICAgICAvLyBGb3IgZXhhbXBsZSwgdGhlIHBhcGVyIHNob3dzIHdlIG9ubHkgbmVlZCB0byBvdXRwdXQgdGhlIG9yYW5nZSBiYXJzLlxuICAgICAgICAgLy8gVGhlIG91dHB1dCBzZXF1ZW5jZSBzaG91bGQgbG9vayBsaWtlIHRoaXMgfCB8IHwgfCB8IHwgfCB8LlxuICAgICAgICAgLy8gQmVjYXVzZSB0aGUgc2VxdWVuY2UgaXMgaGFsdmVkLCB0byBtYXAgdGhlIG91dHB1dCBpbmRleCBiYWNrXG4gICAgICAgICAvLyB0byB0aGUgcHJldmlvdXMgc2VxdWVuY2UgdG8gZmluZCB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZSxcbiAgICAgICAgIC8vIHdlIG5lZWQgdG8gZG91YmxlIHRoZSBpbmRleC4gV2hlbiB3ZSBkb3VibGUgdGhlIGluZGV4LFxuICAgICAgICAgLy8gd2UgYmFzaWNhbGx5IGludGVycG9sYXRlIGEgcG9zaXRpb24sIHNvIDJpIGxvb2tzIGxpa2VcbiAgICAgICAgIC8vIHwgXyB8IF8gfCBfIHwgXyB8IF8gfCBfIHwgXy4gV2UgbW92ZSB0aGUgfCB0byB0aGUgZmlyc3QgayBwb3NpdGlvblxuICAgICAgICAgLy8gb2YgZWFjaCAyayBwb3NpdGlvbnMgYnkgLSBlbGVtSWR4ICUgay4gRS5nLiBmb3Igb3V0cHV0IGF0XG4gICAgICAgICAvLyBpbmRleCA0LDUsNiw3LCB3ZSB3YW50IHRvIGdldCB0aGUgY29ycmVzcG9uZGluZyBlbGVtZW50IGF0XG4gICAgICAgICAvLyBvcmlnaW5hbCBpbmRleCA4LDksMTAsMTEsIGZvciBvdXRwdXQgYXQgaW5kZXggOCw5LDEwLDExLFxuICAgICAgICAgLy8gd2Ugd2FudCB0byBnZXQgdGhlIGNvcnJlc3BvbmRpbmcgZWxlbWVudCBhdCBvcmlnaW5hbCBpbmRleFxuICAgICAgICAgLy8gMTYsMTcsMTgsMTksIHNvIG9uIGFuZCBzbyBmb3J0aC5cblxuICAgICAgICAgaW50IGkgPSBlbGVtSWR4IDwgayA/IGVsZW1JZHggOiAoZWxlbUlkeCAqIDIgLSBpbW9kKGVsZW1JZHgsIGspKTtcbiAgICAgICAgIGludCBpMCA9IGZpcnN0UGFzcyA9PSAxID8gaSA6IGludChnZXRJbmRpY2VzKGJhdGNoLCBpKSk7XG4gICAgICAgICBpbnQgaTEgPSBmaXJzdFBhc3MgPT0gMSA/IGkgKyBrIDogaW50KGdldEluZGljZXMoYmF0Y2gsIGkgKyBrKSk7XG5cbiAgICAgICAgIGZsb2F0IHgwID0gZ2V0WChiYXRjaCwgaTApO1xuICAgICAgICAgZmxvYXQgeDEgPSBpMSA8IG4gPyBnZXRYKGJhdGNoLCBpMSkgOiB4MDtcblxuICAgICAgICAgc2V0T3V0cHV0KHgwID49IHgxID8gZmxvYXQoaTApIDogZmxvYXQoaTEpKTtcbiAgICAgICB9XG4gICAgIGA7XG4gIH1cbn1cbiJdfQ==