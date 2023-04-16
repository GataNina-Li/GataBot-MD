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
import { FloorDiv } from '@tensorflow/tfjs-core';
import { binaryKernelFunc } from '../kernel_utils/kernel_funcs_utils';
// We use native integer division to deal with floating point imprecision. Since
// we implement floor division and glsl implements truncated division, we
// correct for this by subtracting 1 from result when the result is negative and
// there is a remainder.
const INT_DIV = `
  float s = sign(a) * sign(b);
  int ia = round(a);
  int ib = round(b);
  if (ib != 0) {
    // Windows (D3D) wants guaranteed non-zero int division at compile-time.
    return float(idiv(ia, ib, s));
  } else {
    return NAN;
  }
`;
const INT_DIV_PACKED = `
  ivec4 ia = round(a);
  ivec4 ib = round(b);
  bvec4 cond = notEqual(ib, ivec4(0));
  ivec4 result = ivec4(0);
  vec4 s = sign(a) * sign(b);

  // Windows (D3D) wants guaranteed non-zero int division at compile-time.
  if (cond[0]) {
    result[0] = idiv(ia[0], ib[0], s[0]);
  }
  if (cond[1]) {
    result[1] = idiv(ia[1], ib[1], s[1]);
  }
  if (cond[2]) {
    result[2] = idiv(ia[2], ib[2], s[2]);
  }
  if (cond[3]) {
    result[3] = idiv(ia[3], ib[3], s[3]);
  }
  return vec4(result);
`;
export const floorDiv = binaryKernelFunc({ opSnippet: INT_DIV, packedOpSnippet: INT_DIV_PACKED, dtype: 'int32' });
export const floorDivConfig = {
    kernelName: FloorDiv,
    backendName: 'webgl',
    kernelFunc: floorDiv
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmxvb3JEaXYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2ViZ2wvc3JjL2tlcm5lbHMvRmxvb3JEaXYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBMkIsTUFBTSx1QkFBdUIsQ0FBQztBQUV6RSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUVwRSxnRkFBZ0Y7QUFDaEYseUVBQXlFO0FBQ3pFLGdGQUFnRjtBQUNoRix3QkFBd0I7QUFDeEIsTUFBTSxPQUFPLEdBQUc7Ozs7Ozs7Ozs7Q0FVZixDQUFDO0FBRUYsTUFBTSxjQUFjLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQXFCdEIsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxnQkFBZ0IsQ0FDcEMsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7QUFFM0UsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFpQjtJQUMxQyxVQUFVLEVBQUUsUUFBUTtJQUNwQixXQUFXLEVBQUUsT0FBTztJQUNwQixVQUFVLEVBQUUsUUFBNEI7Q0FDekMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtGbG9vckRpdiwgS2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge2JpbmFyeUtlcm5lbEZ1bmN9IGZyb20gJy4uL2tlcm5lbF91dGlscy9rZXJuZWxfZnVuY3NfdXRpbHMnO1xuXG4vLyBXZSB1c2UgbmF0aXZlIGludGVnZXIgZGl2aXNpb24gdG8gZGVhbCB3aXRoIGZsb2F0aW5nIHBvaW50IGltcHJlY2lzaW9uLiBTaW5jZVxuLy8gd2UgaW1wbGVtZW50IGZsb29yIGRpdmlzaW9uIGFuZCBnbHNsIGltcGxlbWVudHMgdHJ1bmNhdGVkIGRpdmlzaW9uLCB3ZVxuLy8gY29ycmVjdCBmb3IgdGhpcyBieSBzdWJ0cmFjdGluZyAxIGZyb20gcmVzdWx0IHdoZW4gdGhlIHJlc3VsdCBpcyBuZWdhdGl2ZSBhbmRcbi8vIHRoZXJlIGlzIGEgcmVtYWluZGVyLlxuY29uc3QgSU5UX0RJViA9IGBcbiAgZmxvYXQgcyA9IHNpZ24oYSkgKiBzaWduKGIpO1xuICBpbnQgaWEgPSByb3VuZChhKTtcbiAgaW50IGliID0gcm91bmQoYik7XG4gIGlmIChpYiAhPSAwKSB7XG4gICAgLy8gV2luZG93cyAoRDNEKSB3YW50cyBndWFyYW50ZWVkIG5vbi16ZXJvIGludCBkaXZpc2lvbiBhdCBjb21waWxlLXRpbWUuXG4gICAgcmV0dXJuIGZsb2F0KGlkaXYoaWEsIGliLCBzKSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIE5BTjtcbiAgfVxuYDtcblxuY29uc3QgSU5UX0RJVl9QQUNLRUQgPSBgXG4gIGl2ZWM0IGlhID0gcm91bmQoYSk7XG4gIGl2ZWM0IGliID0gcm91bmQoYik7XG4gIGJ2ZWM0IGNvbmQgPSBub3RFcXVhbChpYiwgaXZlYzQoMCkpO1xuICBpdmVjNCByZXN1bHQgPSBpdmVjNCgwKTtcbiAgdmVjNCBzID0gc2lnbihhKSAqIHNpZ24oYik7XG5cbiAgLy8gV2luZG93cyAoRDNEKSB3YW50cyBndWFyYW50ZWVkIG5vbi16ZXJvIGludCBkaXZpc2lvbiBhdCBjb21waWxlLXRpbWUuXG4gIGlmIChjb25kWzBdKSB7XG4gICAgcmVzdWx0WzBdID0gaWRpdihpYVswXSwgaWJbMF0sIHNbMF0pO1xuICB9XG4gIGlmIChjb25kWzFdKSB7XG4gICAgcmVzdWx0WzFdID0gaWRpdihpYVsxXSwgaWJbMV0sIHNbMV0pO1xuICB9XG4gIGlmIChjb25kWzJdKSB7XG4gICAgcmVzdWx0WzJdID0gaWRpdihpYVsyXSwgaWJbMl0sIHNbMl0pO1xuICB9XG4gIGlmIChjb25kWzNdKSB7XG4gICAgcmVzdWx0WzNdID0gaWRpdihpYVszXSwgaWJbM10sIHNbM10pO1xuICB9XG4gIHJldHVybiB2ZWM0KHJlc3VsdCk7XG5gO1xuXG5leHBvcnQgY29uc3QgZmxvb3JEaXYgPSBiaW5hcnlLZXJuZWxGdW5jKFxuICAgIHtvcFNuaXBwZXQ6IElOVF9ESVYsIHBhY2tlZE9wU25pcHBldDogSU5UX0RJVl9QQUNLRUQsIGR0eXBlOiAnaW50MzInfSk7XG5cbmV4cG9ydCBjb25zdCBmbG9vckRpdkNvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBGbG9vckRpdixcbiAgYmFja2VuZE5hbWU6ICd3ZWJnbCcsXG4gIGtlcm5lbEZ1bmM6IGZsb29yRGl2IGFzIHt9IGFzIEtlcm5lbEZ1bmNcbn07XG4iXX0=