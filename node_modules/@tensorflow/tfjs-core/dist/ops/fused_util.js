/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
import * as broadcast_util from './broadcast_util';
import { elu } from './elu';
import { leakyRelu } from './leaky_relu';
import { mul } from './mul';
import { prelu } from './prelu';
import { relu } from './relu';
import { relu6 } from './relu6';
import { reshape } from './reshape';
import { sigmoid } from './sigmoid';
import { step } from './step';
import { sum } from './sum';
// Returns gradient for fused activation.
export function getFusedDyActivation(dy, y, activation) {
    if (activation == null || activation === 'linear') {
        return dy;
    }
    if (activation === 'relu') {
        return mul(dy, step(y));
    }
    throw new Error(`Cannot compute gradient for fused activation ${activation}.`);
}
// Returns gradient for fused bias.
export function getFusedBiasGradient(bias, dyActivation) {
    let res = dyActivation;
    const reduceAxes = broadcast_util.getReductionAxes(bias.shape, dyActivation.shape);
    if (reduceAxes.length > 0) {
        res = sum(res, reduceAxes);
    }
    return reshape(res, bias.shape);
}
export function applyActivation(x, activation, preluActivationWeights, leakyreluAlpha) {
    if (activation === 'linear') {
        return x;
    }
    else if (activation === 'relu') {
        return relu(x);
    }
    else if (activation === 'elu') {
        return elu(x);
    }
    else if (activation === 'relu6') {
        return relu6(x);
    }
    else if (activation === 'prelu') {
        return prelu(x, preluActivationWeights);
    }
    else if (activation === 'leakyrelu') {
        return leakyRelu(x, leakyreluAlpha);
    }
    else if (activation === 'sigmoid') {
        return sigmoid(x);
    }
    throw new Error(`Unknown fused activation ${activation}.`);
}
// Whether we should call fused ops.
export const shouldFuse = (gradientDepth, activation) => {
    const gradientMode = gradientDepth > 0;
    return !gradientMode || activation === 'linear';
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVzZWRfdXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2Z1c2VkX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBSUgsT0FBTyxLQUFLLGNBQWMsTUFBTSxrQkFBa0IsQ0FBQztBQUNuRCxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sT0FBTyxDQUFDO0FBRTFCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDdkMsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQzlCLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUM5QixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sT0FBTyxDQUFDO0FBRTFCLHlDQUF5QztBQUN6QyxNQUFNLFVBQVUsb0JBQW9CLENBQ2hDLEVBQVUsRUFBRSxDQUFTLEVBQUUsVUFBc0I7SUFDL0MsSUFBSSxVQUFVLElBQUksSUFBSSxJQUFJLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDakQsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUNELElBQUksVUFBVSxLQUFLLE1BQU0sRUFBRTtRQUN6QixPQUFPLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDekI7SUFDRCxNQUFNLElBQUksS0FBSyxDQUNYLGdEQUFnRCxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBQ3JFLENBQUM7QUFFRCxtQ0FBbUM7QUFDbkMsTUFBTSxVQUFVLG9CQUFvQixDQUNoQyxJQUFZLEVBQUUsWUFBb0I7SUFDcEMsSUFBSSxHQUFHLEdBQUcsWUFBWSxDQUFDO0lBQ3ZCLE1BQU0sVUFBVSxHQUNaLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwRSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ3pCLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQzVCO0lBQ0QsT0FBTyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBRUQsTUFBTSxVQUFVLGVBQWUsQ0FDM0IsQ0FBUyxFQUFFLFVBQXNCLEVBQUUsc0JBQStCLEVBQ2xFLGNBQXVCO0lBQ3pCLElBQUksVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUMzQixPQUFPLENBQUMsQ0FBQztLQUNWO1NBQU0sSUFBSSxVQUFVLEtBQUssTUFBTSxFQUFFO1FBQ2hDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2hCO1NBQU0sSUFBSSxVQUFVLEtBQUssS0FBSyxFQUFFO1FBQy9CLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2Y7U0FBTSxJQUFJLFVBQVUsS0FBSyxPQUFPLEVBQUU7UUFDakMsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDakI7U0FBTSxJQUFJLFVBQVUsS0FBSyxPQUFPLEVBQUU7UUFDakMsT0FBTyxLQUFLLENBQUMsQ0FBQyxFQUFFLHNCQUFzQixDQUFDLENBQUM7S0FDekM7U0FBTSxJQUFJLFVBQVUsS0FBSyxXQUFXLEVBQUU7UUFDckMsT0FBTyxTQUFTLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0tBQ3JDO1NBQU0sSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO1FBQ25DLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ25CO0lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsVUFBVSxHQUFHLENBQUMsQ0FBQztBQUM3RCxDQUFDO0FBRUQsb0NBQW9DO0FBQ3BDLE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBRyxDQUFDLGFBQXFCLEVBQUUsVUFBc0IsRUFBRSxFQUFFO0lBQzFFLE1BQU0sWUFBWSxHQUFHLGFBQWEsR0FBRyxDQUFDLENBQUM7SUFDdkMsT0FBTyxDQUFDLFlBQVksSUFBSSxVQUFVLEtBQUssUUFBUSxDQUFDO0FBQ2xELENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5cbmltcG9ydCAqIGFzIGJyb2FkY2FzdF91dGlsIGZyb20gJy4vYnJvYWRjYXN0X3V0aWwnO1xuaW1wb3J0IHtlbHV9IGZyb20gJy4vZWx1JztcbmltcG9ydCB7QWN0aXZhdGlvbn0gZnJvbSAnLi9mdXNlZF90eXBlcyc7XG5pbXBvcnQge2xlYWt5UmVsdX0gZnJvbSAnLi9sZWFreV9yZWx1JztcbmltcG9ydCB7bXVsfSBmcm9tICcuL211bCc7XG5pbXBvcnQge3ByZWx1fSBmcm9tICcuL3ByZWx1JztcbmltcG9ydCB7cmVsdX0gZnJvbSAnLi9yZWx1JztcbmltcG9ydCB7cmVsdTZ9IGZyb20gJy4vcmVsdTYnO1xuaW1wb3J0IHtyZXNoYXBlfSBmcm9tICcuL3Jlc2hhcGUnO1xuaW1wb3J0IHtzaWdtb2lkfSBmcm9tICcuL3NpZ21vaWQnO1xuaW1wb3J0IHtzdGVwfSBmcm9tICcuL3N0ZXAnO1xuaW1wb3J0IHtzdW19IGZyb20gJy4vc3VtJztcblxuLy8gUmV0dXJucyBncmFkaWVudCBmb3IgZnVzZWQgYWN0aXZhdGlvbi5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGdXNlZER5QWN0aXZhdGlvbihcbiAgICBkeTogVGVuc29yLCB5OiBUZW5zb3IsIGFjdGl2YXRpb246IEFjdGl2YXRpb24pOiBUZW5zb3Ige1xuICBpZiAoYWN0aXZhdGlvbiA9PSBudWxsIHx8IGFjdGl2YXRpb24gPT09ICdsaW5lYXInKSB7XG4gICAgcmV0dXJuIGR5O1xuICB9XG4gIGlmIChhY3RpdmF0aW9uID09PSAncmVsdScpIHtcbiAgICByZXR1cm4gbXVsKGR5LCBzdGVwKHkpKTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgQ2Fubm90IGNvbXB1dGUgZ3JhZGllbnQgZm9yIGZ1c2VkIGFjdGl2YXRpb24gJHthY3RpdmF0aW9ufS5gKTtcbn1cblxuLy8gUmV0dXJucyBncmFkaWVudCBmb3IgZnVzZWQgYmlhcy5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGdXNlZEJpYXNHcmFkaWVudChcbiAgICBiaWFzOiBUZW5zb3IsIGR5QWN0aXZhdGlvbjogVGVuc29yKTogVGVuc29yIHtcbiAgbGV0IHJlcyA9IGR5QWN0aXZhdGlvbjtcbiAgY29uc3QgcmVkdWNlQXhlcyA9XG4gICAgICBicm9hZGNhc3RfdXRpbC5nZXRSZWR1Y3Rpb25BeGVzKGJpYXMuc2hhcGUsIGR5QWN0aXZhdGlvbi5zaGFwZSk7XG4gIGlmIChyZWR1Y2VBeGVzLmxlbmd0aCA+IDApIHtcbiAgICByZXMgPSBzdW0ocmVzLCByZWR1Y2VBeGVzKTtcbiAgfVxuICByZXR1cm4gcmVzaGFwZShyZXMsIGJpYXMuc2hhcGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlBY3RpdmF0aW9uKFxuICAgIHg6IFRlbnNvciwgYWN0aXZhdGlvbjogQWN0aXZhdGlvbiwgcHJlbHVBY3RpdmF0aW9uV2VpZ2h0cz86IFRlbnNvcixcbiAgICBsZWFreXJlbHVBbHBoYT86IG51bWJlcik6IFRlbnNvciB7XG4gIGlmIChhY3RpdmF0aW9uID09PSAnbGluZWFyJykge1xuICAgIHJldHVybiB4O1xuICB9IGVsc2UgaWYgKGFjdGl2YXRpb24gPT09ICdyZWx1Jykge1xuICAgIHJldHVybiByZWx1KHgpO1xuICB9IGVsc2UgaWYgKGFjdGl2YXRpb24gPT09ICdlbHUnKSB7XG4gICAgcmV0dXJuIGVsdSh4KTtcbiAgfSBlbHNlIGlmIChhY3RpdmF0aW9uID09PSAncmVsdTYnKSB7XG4gICAgcmV0dXJuIHJlbHU2KHgpO1xuICB9IGVsc2UgaWYgKGFjdGl2YXRpb24gPT09ICdwcmVsdScpIHtcbiAgICByZXR1cm4gcHJlbHUoeCwgcHJlbHVBY3RpdmF0aW9uV2VpZ2h0cyk7XG4gIH0gZWxzZSBpZiAoYWN0aXZhdGlvbiA9PT0gJ2xlYWt5cmVsdScpIHtcbiAgICByZXR1cm4gbGVha3lSZWx1KHgsIGxlYWt5cmVsdUFscGhhKTtcbiAgfSBlbHNlIGlmIChhY3RpdmF0aW9uID09PSAnc2lnbW9pZCcpIHtcbiAgICByZXR1cm4gc2lnbW9pZCh4KTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gZnVzZWQgYWN0aXZhdGlvbiAke2FjdGl2YXRpb259LmApO1xufVxuXG4vLyBXaGV0aGVyIHdlIHNob3VsZCBjYWxsIGZ1c2VkIG9wcy5cbmV4cG9ydCBjb25zdCBzaG91bGRGdXNlID0gKGdyYWRpZW50RGVwdGg6IG51bWJlciwgYWN0aXZhdGlvbjogQWN0aXZhdGlvbikgPT4ge1xuICBjb25zdCBncmFkaWVudE1vZGUgPSBncmFkaWVudERlcHRoID4gMDtcbiAgcmV0dXJuICFncmFkaWVudE1vZGUgfHwgYWN0aXZhdGlvbiA9PT0gJ2xpbmVhcic7XG59O1xuIl19