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
import { backend_util, Erf } from '@tensorflow/tfjs-core';
import { unaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
const ERF = `
  // Error function is calculated approximately with elementary function.
  // See "Handbook of Mathematical Functions with Formulas,
  // Graphs, and Mathematical Tables", Abramowitz and Stegun.
  float p = ${backend_util.ERF_P};
  float a1 = ${backend_util.ERF_A1};
  float a2 = ${backend_util.ERF_A2};
  float a3 = ${backend_util.ERF_A3};
  float a4 = ${backend_util.ERF_A4};
  float a5 = ${backend_util.ERF_A5};

  float sign = sign(x);
  x = abs(x);
  float t = 1.0 / (1.0 + p * x);
  return sign * (1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*exp(-x*x));
`;
export const erf = unaryKernelFunc({ opSnippet: ERF });
export const erfConfig = {
    kernelName: Erf,
    backendName: 'webgl',
    kernelFunc: erf,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXJmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9rZXJuZWxzL0VyZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFFLEdBQUcsRUFBZSxNQUFNLHVCQUF1QixDQUFDO0FBRXRFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUVuRSxNQUFNLEdBQUcsR0FBRzs7OztjQUlFLFlBQVksQ0FBQyxLQUFLO2VBQ2pCLFlBQVksQ0FBQyxNQUFNO2VBQ25CLFlBQVksQ0FBQyxNQUFNO2VBQ25CLFlBQVksQ0FBQyxNQUFNO2VBQ25CLFlBQVksQ0FBQyxNQUFNO2VBQ25CLFlBQVksQ0FBQyxNQUFNOzs7Ozs7Q0FNakMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxlQUFlLENBQUMsRUFBQyxTQUFTLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztBQUVyRCxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQWlCO0lBQ3JDLFVBQVUsRUFBRSxHQUFHO0lBQ2YsV0FBVyxFQUFFLE9BQU87SUFDcEIsVUFBVSxFQUFFLEdBQUc7Q0FDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtiYWNrZW5kX3V0aWwsIEVyZiwgS2VybmVsQ29uZmlnfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge3VuYXJ5S2VybmVsRnVuY30gZnJvbSAnLi4va2VybmVsX3V0aWxzL2tlcm5lbF9mdW5jc191dGlscyc7XG5cbmNvbnN0IEVSRiA9IGBcbiAgLy8gRXJyb3IgZnVuY3Rpb24gaXMgY2FsY3VsYXRlZCBhcHByb3hpbWF0ZWx5IHdpdGggZWxlbWVudGFyeSBmdW5jdGlvbi5cbiAgLy8gU2VlIFwiSGFuZGJvb2sgb2YgTWF0aGVtYXRpY2FsIEZ1bmN0aW9ucyB3aXRoIEZvcm11bGFzLFxuICAvLyBHcmFwaHMsIGFuZCBNYXRoZW1hdGljYWwgVGFibGVzXCIsIEFicmFtb3dpdHogYW5kIFN0ZWd1bi5cbiAgZmxvYXQgcCA9ICR7YmFja2VuZF91dGlsLkVSRl9QfTtcbiAgZmxvYXQgYTEgPSAke2JhY2tlbmRfdXRpbC5FUkZfQTF9O1xuICBmbG9hdCBhMiA9ICR7YmFja2VuZF91dGlsLkVSRl9BMn07XG4gIGZsb2F0IGEzID0gJHtiYWNrZW5kX3V0aWwuRVJGX0EzfTtcbiAgZmxvYXQgYTQgPSAke2JhY2tlbmRfdXRpbC5FUkZfQTR9O1xuICBmbG9hdCBhNSA9ICR7YmFja2VuZF91dGlsLkVSRl9BNX07XG5cbiAgZmxvYXQgc2lnbiA9IHNpZ24oeCk7XG4gIHggPSBhYnMoeCk7XG4gIGZsb2F0IHQgPSAxLjAgLyAoMS4wICsgcCAqIHgpO1xuICByZXR1cm4gc2lnbiAqICgxLjAgLSAoKCgoKGE1KnQgKyBhNCkqdCkgKyBhMykqdCArIGEyKSp0ICsgYTEpKnQqZXhwKC14KngpKTtcbmA7XG5cbmV4cG9ydCBjb25zdCBlcmYgPSB1bmFyeUtlcm5lbEZ1bmMoe29wU25pcHBldDogRVJGfSk7XG5cbmV4cG9ydCBjb25zdCBlcmZDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogRXJmLFxuICBiYWNrZW5kTmFtZTogJ3dlYmdsJyxcbiAga2VybmVsRnVuYzogZXJmLFxufTtcbiJdfQ==