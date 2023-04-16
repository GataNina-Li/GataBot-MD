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
import { Identity } from '@tensorflow/tfjs-core';
export function identity(args) {
    const { inputs, backend } = args;
    const { x } = inputs;
    backend.incRef(x.dataId);
    return { dataId: x.dataId, shape: x.shape, dtype: x.dtype };
}
export const identityConfig = {
    kernelName: Identity,
    backendName: 'cpu',
    kernelFunc: identity
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSWRlbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtY3B1L3NyYy9rZXJuZWxzL0lkZW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxRQUFRLEVBQXVELE1BQU0sdUJBQXVCLENBQUM7QUFJckcsTUFBTSxVQUFVLFFBQVEsQ0FDcEIsSUFBdUQ7SUFDekQsTUFBTSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsR0FBRyxJQUFJLENBQUM7SUFDL0IsTUFBTSxFQUFDLENBQUMsRUFBQyxHQUFHLE1BQU0sQ0FBQztJQUVuQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV6QixPQUFPLEVBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUMsQ0FBQztBQUM1RCxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFpQjtJQUMxQyxVQUFVLEVBQUUsUUFBUTtJQUNwQixXQUFXLEVBQUUsS0FBSztJQUNsQixVQUFVLEVBQUUsUUFBNEI7Q0FDekMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtJZGVudGl0eSwgSWRlbnRpdHlJbnB1dHMsIEtlcm5lbENvbmZpZywgS2VybmVsRnVuYywgVGVuc29ySW5mb30gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtNYXRoQmFja2VuZENQVX0gZnJvbSAnLi4vYmFja2VuZF9jcHUnO1xuXG5leHBvcnQgZnVuY3Rpb24gaWRlbnRpdHkoXG4gICAgYXJnczoge2lucHV0czogSWRlbnRpdHlJbnB1dHMsIGJhY2tlbmQ6IE1hdGhCYWNrZW5kQ1BVfSk6IFRlbnNvckluZm8ge1xuICBjb25zdCB7aW5wdXRzLCBiYWNrZW5kfSA9IGFyZ3M7XG4gIGNvbnN0IHt4fSA9IGlucHV0cztcblxuICBiYWNrZW5kLmluY1JlZih4LmRhdGFJZCk7XG5cbiAgcmV0dXJuIHtkYXRhSWQ6IHguZGF0YUlkLCBzaGFwZTogeC5zaGFwZSwgZHR5cGU6IHguZHR5cGV9O1xufVxuXG5leHBvcnQgY29uc3QgaWRlbnRpdHlDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogSWRlbnRpdHksXG4gIGJhY2tlbmROYW1lOiAnY3B1JyxcbiAga2VybmVsRnVuYzogaWRlbnRpdHkgYXMge30gYXMgS2VybmVsRnVuY1xufTtcbiJdfQ==