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
import { elu } from '../kernels/Elu';
import { identity } from '../kernels/Identity';
import { leakyRelu } from '../kernels/LeakyRelu';
import { prelu } from '../kernels/Prelu';
import { relu } from '../kernels/Relu';
import { relu6 } from '../kernels/Relu6';
import { sigmoid } from '../kernels/Sigmoid';
export function applyActivation(backend, x, activation, preluActivationWeights, leakyreluAlpha) {
    if (activation === 'linear') {
        return identity({ inputs: { x }, backend });
    }
    else if (activation === 'relu') {
        return relu({ inputs: { x }, backend });
    }
    else if (activation === 'elu') {
        return elu({ inputs: { x }, backend });
    }
    else if (activation === 'relu6') {
        return relu6({ inputs: { x }, backend });
    }
    else if (activation === 'prelu') {
        return prelu({ inputs: { x, alpha: preluActivationWeights }, backend });
    }
    else if (activation === 'leakyrelu') {
        return leakyRelu({ inputs: { x }, backend, attrs: { alpha: leakyreluAlpha } });
    }
    else if (activation === 'sigmoid') {
        return sigmoid({ inputs: { x }, backend });
    }
    throw new Error(`Activation ${activation} has not been implemented for the CPU backend.`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVzZWRfdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtY3B1L3NyYy91dGlscy9mdXNlZF91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFLSCxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkMsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUMvQyxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDdkMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3JDLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUN2QyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFM0MsTUFBTSxVQUFVLGVBQWUsQ0FDM0IsT0FBdUIsRUFBRSxDQUFhLEVBQUUsVUFBbUMsRUFDM0Usc0JBQW1DLEVBQUUsY0FBdUI7SUFDOUQsSUFBSSxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQzNCLE9BQU8sUUFBUSxDQUFDLEVBQUMsTUFBTSxFQUFFLEVBQUMsQ0FBQyxFQUFDLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztLQUN6QztTQUFNLElBQUksVUFBVSxLQUFLLE1BQU0sRUFBRTtRQUNoQyxPQUFPLElBQUksQ0FBQyxFQUFDLE1BQU0sRUFBRSxFQUFDLENBQUMsRUFBQyxFQUFFLE9BQU8sRUFBQyxDQUFlLENBQUM7S0FDbkQ7U0FBTSxJQUFJLFVBQVUsS0FBSyxLQUFLLEVBQUU7UUFDL0IsT0FBTyxHQUFHLENBQUMsRUFBQyxNQUFNLEVBQUUsRUFBQyxDQUFDLEVBQUMsRUFBRSxPQUFPLEVBQUMsQ0FBZSxDQUFDO0tBQ2xEO1NBQU0sSUFBSSxVQUFVLEtBQUssT0FBTyxFQUFFO1FBQ2pDLE9BQU8sS0FBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLEVBQUMsQ0FBQyxFQUFDLEVBQUUsT0FBTyxFQUFDLENBQWUsQ0FBQztLQUNwRDtTQUFNLElBQUksVUFBVSxLQUFLLE9BQU8sRUFBRTtRQUNqQyxPQUFPLEtBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxFQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsc0JBQXNCLEVBQUMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO0tBQ3JFO1NBQU0sSUFBSSxVQUFVLEtBQUssV0FBVyxFQUFFO1FBQ3JDLE9BQU8sU0FBUyxDQUFDLEVBQUMsTUFBTSxFQUFFLEVBQUMsQ0FBQyxFQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxjQUFjLEVBQUMsRUFBQyxDQUFDLENBQUM7S0FDMUU7U0FBTSxJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7UUFDbkMsT0FBTyxPQUFPLENBQUMsRUFBQyxNQUFNLEVBQUUsRUFBQyxDQUFDLEVBQUMsRUFBRSxPQUFPLEVBQUMsQ0FBZSxDQUFDO0tBQ3REO0lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FDWCxjQUFjLFVBQVUsZ0RBQWdELENBQUMsQ0FBQztBQUNoRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge19GdXNlZE1hdE11bCwgX0Z1c2VkTWF0TXVsQXR0cnMsIF9GdXNlZE1hdE11bElucHV0cywgYmFja2VuZF91dGlsLCBUZW5zb3JJbmZvfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge01hdGhCYWNrZW5kQ1BVfSBmcm9tICcuLi9iYWNrZW5kX2NwdSc7XG5pbXBvcnQge2VsdX0gZnJvbSAnLi4va2VybmVscy9FbHUnO1xuaW1wb3J0IHtpZGVudGl0eX0gZnJvbSAnLi4va2VybmVscy9JZGVudGl0eSc7XG5pbXBvcnQge2xlYWt5UmVsdX0gZnJvbSAnLi4va2VybmVscy9MZWFreVJlbHUnO1xuaW1wb3J0IHtwcmVsdX0gZnJvbSAnLi4va2VybmVscy9QcmVsdSc7XG5pbXBvcnQge3JlbHV9IGZyb20gJy4uL2tlcm5lbHMvUmVsdSc7XG5pbXBvcnQge3JlbHU2fSBmcm9tICcuLi9rZXJuZWxzL1JlbHU2JztcbmltcG9ydCB7c2lnbW9pZH0gZnJvbSAnLi4va2VybmVscy9TaWdtb2lkJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5QWN0aXZhdGlvbihcbiAgICBiYWNrZW5kOiBNYXRoQmFja2VuZENQVSwgeDogVGVuc29ySW5mbywgYWN0aXZhdGlvbjogYmFja2VuZF91dGlsLkFjdGl2YXRpb24sXG4gICAgcHJlbHVBY3RpdmF0aW9uV2VpZ2h0cz86IFRlbnNvckluZm8sIGxlYWt5cmVsdUFscGhhPzogbnVtYmVyKTogVGVuc29ySW5mbyB7XG4gIGlmIChhY3RpdmF0aW9uID09PSAnbGluZWFyJykge1xuICAgIHJldHVybiBpZGVudGl0eSh7aW5wdXRzOiB7eH0sIGJhY2tlbmR9KTtcbiAgfSBlbHNlIGlmIChhY3RpdmF0aW9uID09PSAncmVsdScpIHtcbiAgICByZXR1cm4gcmVsdSh7aW5wdXRzOiB7eH0sIGJhY2tlbmR9KSBhcyBUZW5zb3JJbmZvO1xuICB9IGVsc2UgaWYgKGFjdGl2YXRpb24gPT09ICdlbHUnKSB7XG4gICAgcmV0dXJuIGVsdSh7aW5wdXRzOiB7eH0sIGJhY2tlbmR9KSBhcyBUZW5zb3JJbmZvO1xuICB9IGVsc2UgaWYgKGFjdGl2YXRpb24gPT09ICdyZWx1NicpIHtcbiAgICByZXR1cm4gcmVsdTYoe2lucHV0czoge3h9LCBiYWNrZW5kfSkgYXMgVGVuc29ySW5mbztcbiAgfSBlbHNlIGlmIChhY3RpdmF0aW9uID09PSAncHJlbHUnKSB7XG4gICAgcmV0dXJuIHByZWx1KHtpbnB1dHM6IHt4LCBhbHBoYTogcHJlbHVBY3RpdmF0aW9uV2VpZ2h0c30sIGJhY2tlbmR9KTtcbiAgfSBlbHNlIGlmIChhY3RpdmF0aW9uID09PSAnbGVha3lyZWx1Jykge1xuICAgIHJldHVybiBsZWFreVJlbHUoe2lucHV0czoge3h9LCBiYWNrZW5kLCBhdHRyczoge2FscGhhOiBsZWFreXJlbHVBbHBoYX19KTtcbiAgfSBlbHNlIGlmIChhY3RpdmF0aW9uID09PSAnc2lnbW9pZCcpIHtcbiAgICByZXR1cm4gc2lnbW9pZCh7aW5wdXRzOiB7eH0sIGJhY2tlbmR9KSBhcyBUZW5zb3JJbmZvO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBBY3RpdmF0aW9uICR7YWN0aXZhdGlvbn0gaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkIGZvciB0aGUgQ1BVIGJhY2tlbmQuYCk7XG59XG4iXX0=