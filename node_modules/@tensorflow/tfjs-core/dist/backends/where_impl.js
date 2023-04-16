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
/** An implementation of the Where kernel shared between cpu and webgl */
import { buffer } from '../ops/buffer';
export function whereImpl(condShape, condVals) {
    const indices = [];
    for (let i = 0; i < condVals.length; i++) {
        if (condVals[i]) {
            indices.push(i);
        }
    }
    const inBuffer = buffer(condShape, 'int32');
    const out = buffer([indices.length, condShape.length], 'int32');
    for (let i = 0; i < indices.length; i++) {
        const loc = inBuffer.indexToLoc(indices[i]);
        const offset = i * condShape.length;
        out.values.set(loc, offset);
    }
    return out.toTensor();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2hlcmVfaW1wbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvYmFja2VuZHMvd2hlcmVfaW1wbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCx5RUFBeUU7QUFFekUsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUlyQyxNQUFNLFVBQVUsU0FBUyxDQUFDLFNBQW1CLEVBQUUsUUFBb0I7SUFDakUsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ25CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3hDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2YsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNqQjtLQUNGO0lBRUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUU1QyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNoRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN2QyxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO1FBQ3BDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztLQUM3QjtJQUNELE9BQU8sR0FBRyxDQUFDLFFBQVEsRUFBYyxDQUFDO0FBQ3BDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbi8qKiBBbiBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgV2hlcmUga2VybmVsIHNoYXJlZCBiZXR3ZWVuIGNwdSBhbmQgd2ViZ2wgKi9cblxuaW1wb3J0IHtidWZmZXJ9IGZyb20gJy4uL29wcy9idWZmZXInO1xuaW1wb3J0IHtUZW5zb3IyRH0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7VHlwZWRBcnJheX0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gd2hlcmVJbXBsKGNvbmRTaGFwZTogbnVtYmVyW10sIGNvbmRWYWxzOiBUeXBlZEFycmF5KTogVGVuc29yMkQge1xuICBjb25zdCBpbmRpY2VzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY29uZFZhbHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoY29uZFZhbHNbaV0pIHtcbiAgICAgIGluZGljZXMucHVzaChpKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBpbkJ1ZmZlciA9IGJ1ZmZlcihjb25kU2hhcGUsICdpbnQzMicpO1xuXG4gIGNvbnN0IG91dCA9IGJ1ZmZlcihbaW5kaWNlcy5sZW5ndGgsIGNvbmRTaGFwZS5sZW5ndGhdLCAnaW50MzInKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgbG9jID0gaW5CdWZmZXIuaW5kZXhUb0xvYyhpbmRpY2VzW2ldKTtcbiAgICBjb25zdCBvZmZzZXQgPSBpICogY29uZFNoYXBlLmxlbmd0aDtcbiAgICBvdXQudmFsdWVzLnNldChsb2MsIG9mZnNldCk7XG4gIH1cbiAgcmV0dXJuIG91dC50b1RlbnNvcigpIGFzIFRlbnNvcjJEO1xufVxuIl19