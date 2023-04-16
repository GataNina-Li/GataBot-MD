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
import { Log } from '@tensorflow/tfjs-core';
import { CHECK_NAN_SNIPPET_UNARY, unaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
import { logImplCPU } from '../kernel_utils/shared';
// Windows chrome return 0 if the input is negative value. We will specifically
// return NaN if the input is 0 to solve compatiblity issue.
const LOG = CHECK_NAN_SNIPPET_UNARY + `
  return x < 0.0 ? 0./0. : log(x);
`;
const LOG_PACKED = `
  vec4 result = log(x);
  bvec4 isNaN = isnan(x);
  result.r = isNaN.r ? x.r : (x.r < 0.0 ? 0./0. : result.r);
  result.g = isNaN.g ? x.g : (x.g < 0.0 ? 0./0. : result.g);
  result.b = isNaN.b ? x.b : (x.b < 0.0 ? 0./0. : result.b);
  result.a = isNaN.a ? x.a : (x.a < 0.0 ? 0./0. : result.a);
  return result;
`;
export const log = unaryKernelFunc({ opSnippet: LOG, packedOpSnippet: LOG_PACKED, cpuKernelImpl: logImplCPU });
export const logConfig = {
    kernelName: Log,
    backendName: 'webgl',
    kernelFunc: log
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9rZXJuZWxzL0xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQTJCLEdBQUcsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRXBFLE9BQU8sRUFBQyx1QkFBdUIsRUFBRSxlQUFlLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUM1RixPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFFbEQsK0VBQStFO0FBQy9FLDREQUE0RDtBQUM1RCxNQUFNLEdBQUcsR0FBRyx1QkFBdUIsR0FBRzs7Q0FFckMsQ0FBQztBQUVGLE1BQU0sVUFBVSxHQUFHOzs7Ozs7OztDQVFsQixDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLGVBQWUsQ0FDOUIsRUFBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUM7QUFFOUUsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFpQjtJQUNyQyxVQUFVLEVBQUUsR0FBRztJQUNmLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLFVBQVUsRUFBRSxHQUF1QjtDQUNwQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0tlcm5lbENvbmZpZywgS2VybmVsRnVuYywgTG9nfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge0NIRUNLX05BTl9TTklQUEVUX1VOQVJZLCB1bmFyeUtlcm5lbEZ1bmN9IGZyb20gJy4uL2tlcm5lbF91dGlscy9rZXJuZWxfZnVuY3NfdXRpbHMnO1xuaW1wb3J0IHtsb2dJbXBsQ1BVfSBmcm9tICcuLi9rZXJuZWxfdXRpbHMvc2hhcmVkJztcblxuLy8gV2luZG93cyBjaHJvbWUgcmV0dXJuIDAgaWYgdGhlIGlucHV0IGlzIG5lZ2F0aXZlIHZhbHVlLiBXZSB3aWxsIHNwZWNpZmljYWxseVxuLy8gcmV0dXJuIE5hTiBpZiB0aGUgaW5wdXQgaXMgMCB0byBzb2x2ZSBjb21wYXRpYmxpdHkgaXNzdWUuXG5jb25zdCBMT0cgPSBDSEVDS19OQU5fU05JUFBFVF9VTkFSWSArIGBcbiAgcmV0dXJuIHggPCAwLjAgPyAwLi8wLiA6IGxvZyh4KTtcbmA7XG5cbmNvbnN0IExPR19QQUNLRUQgPSBgXG4gIHZlYzQgcmVzdWx0ID0gbG9nKHgpO1xuICBidmVjNCBpc05hTiA9IGlzbmFuKHgpO1xuICByZXN1bHQuciA9IGlzTmFOLnIgPyB4LnIgOiAoeC5yIDwgMC4wID8gMC4vMC4gOiByZXN1bHQucik7XG4gIHJlc3VsdC5nID0gaXNOYU4uZyA/IHguZyA6ICh4LmcgPCAwLjAgPyAwLi8wLiA6IHJlc3VsdC5nKTtcbiAgcmVzdWx0LmIgPSBpc05hTi5iID8geC5iIDogKHguYiA8IDAuMCA/IDAuLzAuIDogcmVzdWx0LmIpO1xuICByZXN1bHQuYSA9IGlzTmFOLmEgPyB4LmEgOiAoeC5hIDwgMC4wID8gMC4vMC4gOiByZXN1bHQuYSk7XG4gIHJldHVybiByZXN1bHQ7XG5gO1xuXG5leHBvcnQgY29uc3QgbG9nID0gdW5hcnlLZXJuZWxGdW5jKFxuICAgIHtvcFNuaXBwZXQ6IExPRywgcGFja2VkT3BTbmlwcGV0OiBMT0dfUEFDS0VELCBjcHVLZXJuZWxJbXBsOiBsb2dJbXBsQ1BVfSk7XG5cbmV4cG9ydCBjb25zdCBsb2dDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogTG9nLFxuICBiYWNrZW5kTmFtZTogJ3dlYmdsJyxcbiAga2VybmVsRnVuYzogbG9nIGFzIHt9IGFzIEtlcm5lbEZ1bmNcbn07XG4iXX0=