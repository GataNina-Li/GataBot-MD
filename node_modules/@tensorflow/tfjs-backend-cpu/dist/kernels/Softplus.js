/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import { Softplus } from '@tensorflow/tfjs-core';
import { unaryKernelFunc } from '../utils/unary_utils';
// mirrors the implementation of tf.nn.softplus: https://goo.gl/vkcvwX
// epsilon is the difference between 1.0 and the next representable float.
// For a single precision 32 bit float this should be 2^-23, see:
// https://math.byu.edu/~schow/work/IEEEFloatingPoint.htm
const epsilon = 1.1920928955078125e-7;
const threshold = Math.log(epsilon) + 2.0;
export const softplus = unaryKernelFunc(Softplus, (xi) => {
    // Value above which exp(x) may overflow, but softplus(x) == x
    // is within machine epsilon.
    const tooLarge = xi > -threshold;
    // Value below which exp(x) may underflow, but softplus(x) == exp(x)
    // is within machine epsilon.
    const tooSmall = xi < threshold;
    const expX = Math.exp(xi);
    let result;
    if (tooSmall) {
        result = expX;
    }
    else if (tooLarge) {
        result = xi;
    }
    else {
        result = Math.log(1.0 + expX);
    }
    return result;
});
export const softplusConfig = {
    kernelName: Softplus,
    backendName: 'cpu',
    kernelFunc: softplus,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU29mdHBsdXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtY3B1L3NyYy9rZXJuZWxzL1NvZnRwbHVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBZSxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUU3RCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFckQsc0VBQXNFO0FBRXRFLDBFQUEwRTtBQUMxRSxpRUFBaUU7QUFDakUseURBQXlEO0FBQ3pELE1BQU0sT0FBTyxHQUFHLHFCQUFxQixDQUFDO0FBQ3RDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBRTFDLE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDdkQsOERBQThEO0lBQzlELDZCQUE2QjtJQUM3QixNQUFNLFFBQVEsR0FBRyxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUM7SUFFakMsb0VBQW9FO0lBQ3BFLDZCQUE2QjtJQUM3QixNQUFNLFFBQVEsR0FBRyxFQUFFLEdBQUcsU0FBUyxDQUFDO0lBRWhDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDMUIsSUFBSSxNQUFNLENBQUM7SUFFWCxJQUFJLFFBQVEsRUFBRTtRQUNaLE1BQU0sR0FBRyxJQUFJLENBQUM7S0FDZjtTQUFNLElBQUksUUFBUSxFQUFFO1FBQ25CLE1BQU0sR0FBRyxFQUFFLENBQUM7S0FDYjtTQUFNO1FBQ0wsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDO0tBQy9CO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQWlCO0lBQzFDLFVBQVUsRUFBRSxRQUFRO0lBQ3BCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLFVBQVUsRUFBRSxRQUFRO0NBQ3JCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIExpY2Vuc2UpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gQVMgSVMgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0tlcm5lbENvbmZpZywgU29mdHBsdXN9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7dW5hcnlLZXJuZWxGdW5jfSBmcm9tICcuLi91dGlscy91bmFyeV91dGlscyc7XG5cbi8vIG1pcnJvcnMgdGhlIGltcGxlbWVudGF0aW9uIG9mIHRmLm5uLnNvZnRwbHVzOiBodHRwczovL2dvby5nbC92a2N2d1hcblxuLy8gZXBzaWxvbiBpcyB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIDEuMCBhbmQgdGhlIG5leHQgcmVwcmVzZW50YWJsZSBmbG9hdC5cbi8vIEZvciBhIHNpbmdsZSBwcmVjaXNpb24gMzIgYml0IGZsb2F0IHRoaXMgc2hvdWxkIGJlIDJeLTIzLCBzZWU6XG4vLyBodHRwczovL21hdGguYnl1LmVkdS9+c2Nob3cvd29yay9JRUVFRmxvYXRpbmdQb2ludC5odG1cbmNvbnN0IGVwc2lsb24gPSAxLjE5MjA5Mjg5NTUwNzgxMjVlLTc7XG5jb25zdCB0aHJlc2hvbGQgPSBNYXRoLmxvZyhlcHNpbG9uKSArIDIuMDtcblxuZXhwb3J0IGNvbnN0IHNvZnRwbHVzID0gdW5hcnlLZXJuZWxGdW5jKFNvZnRwbHVzLCAoeGkpID0+IHtcbiAgLy8gVmFsdWUgYWJvdmUgd2hpY2ggZXhwKHgpIG1heSBvdmVyZmxvdywgYnV0IHNvZnRwbHVzKHgpID09IHhcbiAgLy8gaXMgd2l0aGluIG1hY2hpbmUgZXBzaWxvbi5cbiAgY29uc3QgdG9vTGFyZ2UgPSB4aSA+IC10aHJlc2hvbGQ7XG5cbiAgLy8gVmFsdWUgYmVsb3cgd2hpY2ggZXhwKHgpIG1heSB1bmRlcmZsb3csIGJ1dCBzb2Z0cGx1cyh4KSA9PSBleHAoeClcbiAgLy8gaXMgd2l0aGluIG1hY2hpbmUgZXBzaWxvbi5cbiAgY29uc3QgdG9vU21hbGwgPSB4aSA8IHRocmVzaG9sZDtcblxuICBjb25zdCBleHBYID0gTWF0aC5leHAoeGkpO1xuICBsZXQgcmVzdWx0O1xuXG4gIGlmICh0b29TbWFsbCkge1xuICAgIHJlc3VsdCA9IGV4cFg7XG4gIH0gZWxzZSBpZiAodG9vTGFyZ2UpIHtcbiAgICByZXN1bHQgPSB4aTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSBNYXRoLmxvZygxLjAgKyBleHBYKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufSk7XG5cbmV4cG9ydCBjb25zdCBzb2Z0cGx1c0NvbmZpZzogS2VybmVsQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBTb2Z0cGx1cyxcbiAgYmFja2VuZE5hbWU6ICdjcHUnLFxuICBrZXJuZWxGdW5jOiBzb2Z0cGx1cyxcbn07XG4iXX0=