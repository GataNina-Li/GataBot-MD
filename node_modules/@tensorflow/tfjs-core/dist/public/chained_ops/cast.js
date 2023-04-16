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
import { cast } from '../../ops/ops';
import { getGlobalTensorClass } from '../../tensor';
getGlobalTensorClass().prototype.cast = function (dtype) {
    this.throwIfDisposed();
    return cast(this, dtype);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvcHVibGljL2NoYWluZWRfb3BzL2Nhc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsa0RBQWtEO0FBQ2xELE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbkMsT0FBTyxFQUFDLG9CQUFvQixFQUFTLE1BQU0sY0FBYyxDQUFDO0FBUzFELG9CQUFvQixFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxVQUNwQyxLQUFlO0lBQ2pCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN2QixPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFNLENBQUM7QUFDaEMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG4vLyBUT0RPIHVwZGF0ZSBpbXBvcnQgcGF0aCBvbmNlIG9wIGlzIG1vZHVsYXJpemVkLlxuaW1wb3J0IHtjYXN0fSBmcm9tICcuLi8uLi9vcHMvb3BzJztcbmltcG9ydCB7Z2V0R2xvYmFsVGVuc29yQ2xhc3MsIFRlbnNvcn0gZnJvbSAnLi4vLi4vdGVuc29yJztcbmltcG9ydCB7RGF0YVR5cGUsIFJhbmt9IGZyb20gJy4uLy4uL3R5cGVzJztcblxuZGVjbGFyZSBtb2R1bGUgJy4uLy4uL3RlbnNvcicge1xuICBpbnRlcmZhY2UgVGVuc29yPFIgZXh0ZW5kcyBSYW5rID0gUmFuaz4ge1xuICAgIGNhc3Q8VCBleHRlbmRzIFRlbnNvcj4oZHR5cGU6IERhdGFUeXBlKTogVDtcbiAgfVxufVxuXG5nZXRHbG9iYWxUZW5zb3JDbGFzcygpLnByb3RvdHlwZS5jYXN0ID0gZnVuY3Rpb248VCBleHRlbmRzIFRlbnNvcj4oXG4gICAgZHR5cGU6IERhdGFUeXBlKTogVCB7XG4gIHRoaXMudGhyb3dJZkRpc3Bvc2VkKCk7XG4gIHJldHVybiBjYXN0KHRoaXMsIGR0eXBlKSBhcyBUO1xufTtcbiJdfQ==