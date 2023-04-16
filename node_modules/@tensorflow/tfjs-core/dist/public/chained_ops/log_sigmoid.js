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
import { logSigmoid } from '../../ops/ops';
import { getGlobalTensorClass } from '../../tensor';
getGlobalTensorClass().prototype.logSigmoid = function () {
    this.throwIfDisposed();
    return logSigmoid(this);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nX3NpZ21vaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL3B1YmxpYy9jaGFpbmVkX29wcy9sb2dfc2lnbW9pZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxrREFBa0Q7QUFDbEQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsb0JBQW9CLEVBQVMsTUFBTSxjQUFjLENBQUM7QUFTMUQsb0JBQW9CLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHO0lBRTVDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN2QixPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbi8vIFRPRE8gdXBkYXRlIGltcG9ydCBwYXRoIG9uY2Ugb3AgaXMgbW9kdWxhcml6ZWQuXG5pbXBvcnQge2xvZ1NpZ21vaWR9IGZyb20gJy4uLy4uL29wcy9vcHMnO1xuaW1wb3J0IHtnZXRHbG9iYWxUZW5zb3JDbGFzcywgVGVuc29yfSBmcm9tICcuLi8uLi90ZW5zb3InO1xuaW1wb3J0IHtSYW5rfSBmcm9tICcuLi8uLi90eXBlcyc7XG5cbmRlY2xhcmUgbW9kdWxlICcuLi8uLi90ZW5zb3InIHtcbiAgaW50ZXJmYWNlIFRlbnNvcjxSIGV4dGVuZHMgUmFuayA9IFJhbms+IHtcbiAgICBsb2dTaWdtb2lkPFQgZXh0ZW5kcyBUZW5zb3I+KHRoaXM6IFQpOiBUO1xuICB9XG59XG5cbmdldEdsb2JhbFRlbnNvckNsYXNzKCkucHJvdG90eXBlLmxvZ1NpZ21vaWQgPSBmdW5jdGlvbjxUIGV4dGVuZHMgVGVuc29yPihcbiAgICB0aGlzOiBUKTogVCB7XG4gIHRoaXMudGhyb3dJZkRpc3Bvc2VkKCk7XG4gIHJldHVybiBsb2dTaWdtb2lkKHRoaXMpO1xufTtcbiJdfQ==