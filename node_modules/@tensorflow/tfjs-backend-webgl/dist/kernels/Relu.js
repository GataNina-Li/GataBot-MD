/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
import { Relu } from '@tensorflow/tfjs-core';
import { unaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
import { CHECK_NAN_SNIPPET } from '../unaryop_gpu';
const RELU = CHECK_NAN_SNIPPET + `
  return (x < 0.0) ? 0.0 : x;
`;
const RELU_PACKED = `
  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`;
export const relu = unaryKernelFunc({ opSnippet: RELU, packedOpSnippet: RELU_PACKED });
export const reluConfig = {
    kernelName: Relu,
    backendName: 'webgl',
    kernelFunc: relu
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVsdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMva2VybmVscy9SZWx1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBMkIsSUFBSSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDckUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBQ25FLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRWpELE1BQU0sSUFBSSxHQUFHLGlCQUFpQixHQUFHOztDQUVoQyxDQUFDO0FBRUYsTUFBTSxXQUFXLEdBQUc7Ozs7Ozs7Ozs7Q0FVbkIsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLElBQUksR0FDYixlQUFlLENBQUMsRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO0FBRXJFLE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBaUI7SUFDdEMsVUFBVSxFQUFFLElBQUk7SUFDaEIsV0FBVyxFQUFFLE9BQU87SUFDcEIsVUFBVSxFQUFFLElBQXdCO0NBQ3JDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7S2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jLCBSZWx1fSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0IHt1bmFyeUtlcm5lbEZ1bmN9IGZyb20gJy4uL2tlcm5lbF91dGlscy9rZXJuZWxfZnVuY3NfdXRpbHMnO1xuaW1wb3J0IHtDSEVDS19OQU5fU05JUFBFVH0gZnJvbSAnLi4vdW5hcnlvcF9ncHUnO1xuXG5jb25zdCBSRUxVID0gQ0hFQ0tfTkFOX1NOSVBQRVQgKyBgXG4gIHJldHVybiAoeCA8IDAuMCkgPyAwLjAgOiB4O1xuYDtcblxuY29uc3QgUkVMVV9QQUNLRUQgPSBgXG4gIHZlYzQgcmVzdWx0ID0geCAqIHZlYzQoZ3JlYXRlclRoYW5FcXVhbCh4LCB2ZWM0KDAuMCkpKTtcbiAgYnZlYzQgaXNOYU4gPSBpc25hbih4KTtcblxuICByZXN1bHQuciA9IGlzTmFOLnIgPyB4LnIgOiByZXN1bHQucjtcbiAgcmVzdWx0LmcgPSBpc05hTi5nID8geC5nIDogcmVzdWx0Lmc7XG4gIHJlc3VsdC5iID0gaXNOYU4uYiA/IHguYiA6IHJlc3VsdC5iO1xuICByZXN1bHQuYSA9IGlzTmFOLmEgPyB4LmEgOiByZXN1bHQuYTtcblxuICByZXR1cm4gcmVzdWx0O1xuYDtcblxuZXhwb3J0IGNvbnN0IHJlbHUgPVxuICAgIHVuYXJ5S2VybmVsRnVuYyh7b3BTbmlwcGV0OiBSRUxVLCBwYWNrZWRPcFNuaXBwZXQ6IFJFTFVfUEFDS0VEfSk7XG5cbmV4cG9ydCBjb25zdCByZWx1Q29uZmlnOiBLZXJuZWxDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IFJlbHUsXG4gIGJhY2tlbmROYW1lOiAnd2ViZ2wnLFxuICBrZXJuZWxGdW5jOiByZWx1IGFzIHt9IGFzIEtlcm5lbEZ1bmNcbn07XG4iXX0=