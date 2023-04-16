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
import { Select } from '../kernel_names';
import { cast } from '../ops/cast';
import { logicalNot } from '../ops/logical_not';
import { mul } from '../ops/mul';
import { zerosLike } from '../ops/zeros_like';
export const selectGradConfig = {
    kernelName: Select,
    inputsToSave: ['condition'],
    gradFunc: (dy, saved) => {
        const [condition] = saved;
        return {
            // TODO(julianoks): Return null for condition gradient
            // when backprop supports it.
            condition: () => cast(zerosLike(condition), 'float32'),
            t: () => mul(dy, cast(condition, dy.dtype)),
            e: () => mul(dy, cast(logicalNot(condition), dy.dtype))
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0X2dyYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2dyYWRpZW50cy9TZWxlY3RfZ3JhZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFdkMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUNqQyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDOUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUMvQixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFHNUMsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQWU7SUFDMUMsVUFBVSxFQUFFLE1BQU07SUFDbEIsWUFBWSxFQUFFLENBQUMsV0FBVyxDQUFDO0lBQzNCLFFBQVEsRUFBRSxDQUFDLEVBQVUsRUFBRSxLQUFlLEVBQUUsRUFBRTtRQUN4QyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQzFCLE9BQU87WUFDTCxzREFBc0Q7WUFDdEQsNkJBQTZCO1lBQzdCLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLFNBQVMsQ0FBQztZQUN0RCxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN4RCxDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7U2VsZWN0fSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtHcmFkQ29uZmlnfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtjYXN0fSBmcm9tICcuLi9vcHMvY2FzdCc7XG5pbXBvcnQge2xvZ2ljYWxOb3R9IGZyb20gJy4uL29wcy9sb2dpY2FsX25vdCc7XG5pbXBvcnQge211bH0gZnJvbSAnLi4vb3BzL211bCc7XG5pbXBvcnQge3plcm9zTGlrZX0gZnJvbSAnLi4vb3BzL3plcm9zX2xpa2UnO1xuaW1wb3J0IHtUZW5zb3J9IGZyb20gJy4uL3RlbnNvcic7XG5cbmV4cG9ydCBjb25zdCBzZWxlY3RHcmFkQ29uZmlnOiBHcmFkQ29uZmlnID0ge1xuICBrZXJuZWxOYW1lOiBTZWxlY3QsXG4gIGlucHV0c1RvU2F2ZTogWydjb25kaXRpb24nXSxcbiAgZ3JhZEZ1bmM6IChkeTogVGVuc29yLCBzYXZlZDogVGVuc29yW10pID0+IHtcbiAgICBjb25zdCBbY29uZGl0aW9uXSA9IHNhdmVkO1xuICAgIHJldHVybiB7XG4gICAgICAvLyBUT0RPKGp1bGlhbm9rcyk6IFJldHVybiBudWxsIGZvciBjb25kaXRpb24gZ3JhZGllbnRcbiAgICAgIC8vIHdoZW4gYmFja3Byb3Agc3VwcG9ydHMgaXQuXG4gICAgICBjb25kaXRpb246ICgpID0+IGNhc3QoemVyb3NMaWtlKGNvbmRpdGlvbiksICdmbG9hdDMyJyksXG4gICAgICB0OiAoKSA9PiBtdWwoZHksIGNhc3QoY29uZGl0aW9uLCBkeS5kdHlwZSkpLFxuICAgICAgZTogKCkgPT4gbXVsKGR5LCBjYXN0KGxvZ2ljYWxOb3QoY29uZGl0aW9uKSwgZHkuZHR5cGUpKVxuICAgIH07XG4gIH1cbn07XG4iXX0=