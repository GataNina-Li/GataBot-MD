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
import { Concat } from '../kernel_names';
import { split } from '../ops/split';
import { parseAxisParam } from '../util';
export const concatGradConfig = {
    kernelName: Concat,
    saveAllInputs: true,
    gradFunc: (dy, saved, attrs) => {
        const shapes = saved.map(t => t.shape);
        const { axis } = attrs;
        const $axis = parseAxisParam(axis, saved[0].shape)[0];
        const sizeSplits = shapes.map(s => s[$axis]);
        const derTensors = split(dy, sizeSplits, $axis);
        return derTensors.map(t => () => t);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uY2F0X2dyYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2dyYWRpZW50cy9Db25jYXRfZ3JhZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxPQUFPLEVBQUMsTUFBTSxFQUFjLE1BQU0saUJBQWlCLENBQUM7QUFFcEQsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUVuQyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBRXZDLE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFlO0lBQzFDLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLGFBQWEsRUFBRSxJQUFJO0lBQ25CLFFBQVEsRUFBRSxDQUFDLEVBQVUsRUFBRSxLQUFlLEVBQUUsS0FBbUIsRUFBRSxFQUFFO1FBQzdELE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkMsTUFBTSxFQUFDLElBQUksRUFBQyxHQUFHLEtBQTBCLENBQUM7UUFDMUMsTUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2hELE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBTyxDQUFDO0lBQzVDLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuaW1wb3J0IHtDb25jYXQsIENvbmNhdEF0dHJzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtHcmFkQ29uZmlnLCBOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge3NwbGl0fSBmcm9tICcuLi9vcHMvc3BsaXQnO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge3BhcnNlQXhpc1BhcmFtfSBmcm9tICcuLi91dGlsJztcblxuZXhwb3J0IGNvbnN0IGNvbmNhdEdyYWRDb25maWc6IEdyYWRDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IENvbmNhdCxcbiAgc2F2ZUFsbElucHV0czogdHJ1ZSxcbiAgZ3JhZEZ1bmM6IChkeTogVGVuc29yLCBzYXZlZDogVGVuc29yW10sIGF0dHJzOiBOYW1lZEF0dHJNYXApID0+IHtcbiAgICBjb25zdCBzaGFwZXMgPSBzYXZlZC5tYXAodCA9PiB0LnNoYXBlKTtcbiAgICBjb25zdCB7YXhpc30gPSBhdHRycyBhcyB7fSBhcyBDb25jYXRBdHRycztcbiAgICBjb25zdCAkYXhpcyA9IHBhcnNlQXhpc1BhcmFtKGF4aXMsIHNhdmVkWzBdLnNoYXBlKVswXTtcbiAgICBjb25zdCBzaXplU3BsaXRzID0gc2hhcGVzLm1hcChzID0+IHNbJGF4aXNdKTtcbiAgICBjb25zdCBkZXJUZW5zb3JzID0gc3BsaXQoZHksIHNpemVTcGxpdHMsICRheGlzKTtcbiAgICByZXR1cm4gZGVyVGVuc29ycy5tYXAodCA9PiAoKSA9PiB0KSBhcyB7fTtcbiAgfVxufTtcbiJdfQ==