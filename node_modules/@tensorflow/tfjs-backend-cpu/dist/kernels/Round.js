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
import { Round } from '@tensorflow/tfjs-core';
import { unaryKernelFunc } from '../utils/unary_utils';
export const round = unaryKernelFunc(Round, (xi) => {
    // The algorithm is based on banker's rounding.
    const base = Math.floor(xi);
    if (xi - base < 0.5) {
        return Math.floor(xi);
    }
    else if (xi - base > 0.5) {
        return Math.ceil(xi);
    }
    else {
        if (base % 2.0 === 0.0) {
            return base;
        }
        else {
            return base + 1.0;
        }
    }
});
export const roundConfig = {
    kernelName: Round,
    backendName: 'cpu',
    kernelFunc: round,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm91bmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtY3B1L3NyYy9rZXJuZWxzL1JvdW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBZSxLQUFLLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUUxRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFckQsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUNqRCwrQ0FBK0M7SUFDL0MsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1QixJQUFJLEVBQUUsR0FBRyxJQUFJLEdBQUcsR0FBRyxFQUFFO1FBQ25CLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUN2QjtTQUFNLElBQUksRUFBRSxHQUFHLElBQUksR0FBRyxHQUFHLEVBQUU7UUFDMUIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3RCO1NBQU07UUFDTCxJQUFJLElBQUksR0FBRyxHQUFHLEtBQUssR0FBRyxFQUFFO1lBQ3RCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7YUFBTTtZQUNMLE9BQU8sSUFBSSxHQUFHLEdBQUcsQ0FBQztTQUNuQjtLQUNGO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQWlCO0lBQ3ZDLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLFVBQVUsRUFBRSxLQUFLO0NBQ2xCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIExpY2Vuc2UpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gQVMgSVMgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0tlcm5lbENvbmZpZywgUm91bmR9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7dW5hcnlLZXJuZWxGdW5jfSBmcm9tICcuLi91dGlscy91bmFyeV91dGlscyc7XG5cbmV4cG9ydCBjb25zdCByb3VuZCA9IHVuYXJ5S2VybmVsRnVuYyhSb3VuZCwgKHhpKSA9PiB7XG4gIC8vIFRoZSBhbGdvcml0aG0gaXMgYmFzZWQgb24gYmFua2VyJ3Mgcm91bmRpbmcuXG4gIGNvbnN0IGJhc2UgPSBNYXRoLmZsb29yKHhpKTtcbiAgaWYgKHhpIC0gYmFzZSA8IDAuNSkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKHhpKTtcbiAgfSBlbHNlIGlmICh4aSAtIGJhc2UgPiAwLjUpIHtcbiAgICByZXR1cm4gTWF0aC5jZWlsKHhpKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoYmFzZSAlIDIuMCA9PT0gMC4wKSB7XG4gICAgICByZXR1cm4gYmFzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJhc2UgKyAxLjA7XG4gICAgfVxuICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IHJvdW5kQ29uZmlnOiBLZXJuZWxDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IFJvdW5kLFxuICBiYWNrZW5kTmFtZTogJ2NwdScsXG4gIGtlcm5lbEZ1bmM6IHJvdW5kLFxufTtcbiJdfQ==