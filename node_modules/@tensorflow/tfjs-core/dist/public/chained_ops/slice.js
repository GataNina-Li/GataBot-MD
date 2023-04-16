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
// TODO update import path once op is modularized.
import { slice } from '../../ops/ops';
import { getGlobalTensorClass } from '../../tensor';
getGlobalTensorClass().prototype.slice = function (begin, size) {
    this.throwIfDisposed();
    return slice(this, begin, size);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL3B1YmxpYy9jaGFpbmVkX29wcy9zbGljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxrREFBa0Q7QUFDbEQsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNwQyxPQUFPLEVBQUMsb0JBQW9CLEVBQVMsTUFBTSxjQUFjLENBQUM7QUFVMUQsb0JBQW9CLEVBQUUsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFVBQzVCLEtBQXNCLEVBQUUsSUFBc0I7SUFDekQsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3ZCLE9BQU8sS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDbEMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG4vLyBUT0RPIHVwZGF0ZSBpbXBvcnQgcGF0aCBvbmNlIG9wIGlzIG1vZHVsYXJpemVkLlxuaW1wb3J0IHtzbGljZX0gZnJvbSAnLi4vLi4vb3BzL29wcyc7XG5pbXBvcnQge2dldEdsb2JhbFRlbnNvckNsYXNzLCBUZW5zb3J9IGZyb20gJy4uLy4uL3RlbnNvcic7XG5pbXBvcnQge1Jhbmt9IGZyb20gJy4uLy4uL3R5cGVzJztcblxuZGVjbGFyZSBtb2R1bGUgJy4uLy4uL3RlbnNvcicge1xuICBpbnRlcmZhY2UgVGVuc29yPFIgZXh0ZW5kcyBSYW5rID0gUmFuaz4ge1xuICAgIHNsaWNlPFQgZXh0ZW5kcyBUZW5zb3I+KFxuICAgICAgICB0aGlzOiBULCBiZWdpbjogbnVtYmVyfG51bWJlcltdLCBzaXplPzogbnVtYmVyfG51bWJlcltdKTogVDtcbiAgfVxufVxuXG5nZXRHbG9iYWxUZW5zb3JDbGFzcygpLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uPFQgZXh0ZW5kcyBUZW5zb3I+KFxuICAgIHRoaXM6IFQsIGJlZ2luOiBudW1iZXJ8bnVtYmVyW10sIHNpemU/OiBudW1iZXJ8bnVtYmVyW10pOiBUIHtcbiAgdGhpcy50aHJvd0lmRGlzcG9zZWQoKTtcbiAgcmV0dXJuIHNsaWNlKHRoaXMsIGJlZ2luLCBzaXplKTtcbn07XG4iXX0=