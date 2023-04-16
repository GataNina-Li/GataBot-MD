/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
export class IORouterRegistry {
    constructor() {
        this.saveRouters = [];
        this.loadRouters = [];
    }
    static getInstance() {
        if (IORouterRegistry.instance == null) {
            IORouterRegistry.instance = new IORouterRegistry();
        }
        return IORouterRegistry.instance;
    }
    /**
     * Register a save-handler router.
     *
     * @param saveRouter A function that maps a URL-like string onto an instance
     * of `IOHandler` with the `save` method defined or `null`.
     */
    static registerSaveRouter(saveRouter) {
        IORouterRegistry.getInstance().saveRouters.push(saveRouter);
    }
    /**
     * Register a load-handler router.
     *
     * @param loadRouter A function that maps a URL-like string onto an instance
     * of `IOHandler` with the `load` method defined or `null`.
     */
    static registerLoadRouter(loadRouter) {
        IORouterRegistry.getInstance().loadRouters.push(loadRouter);
    }
    /**
     * Look up IOHandler for saving, given a URL-like string.
     *
     * @param url
     * @returns If only one match is found, an instance of IOHandler with the
     * `save` method defined. If no match is found, `null`.
     * @throws Error, if more than one match is found.
     */
    static getSaveHandlers(url) {
        return IORouterRegistry.getHandlers(url, 'save');
    }
    /**
     * Look up IOHandler for loading, given a URL-like string.
     *
     * @param url
     * @param loadOptions Optional, custom load options.
     * @returns All valid handlers for `url`, given the currently registered
     *   handler routers.
     */
    static getLoadHandlers(url, loadOptions) {
        return IORouterRegistry.getHandlers(url, 'load', loadOptions);
    }
    static getHandlers(url, handlerType, loadOptions) {
        const validHandlers = [];
        const routers = handlerType === 'load' ?
            IORouterRegistry.getInstance().loadRouters :
            IORouterRegistry.getInstance().saveRouters;
        routers.forEach(router => {
            const handler = router(url, loadOptions);
            if (handler !== null) {
                validHandlers.push(handler);
            }
        });
        return validHandlers;
    }
}
export const registerSaveRouter = (loudRouter) => IORouterRegistry.registerSaveRouter(loudRouter);
export const registerLoadRouter = (loudRouter) => IORouterRegistry.registerLoadRouter(loudRouter);
export const getSaveHandlers = (url) => IORouterRegistry.getSaveHandlers(url);
export const getLoadHandlers = (url, loadOptions) => IORouterRegistry.getLoadHandlers(url, loadOptions);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3JlZ2lzdHJ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9pby9yb3V0ZXJfcmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBT0gsTUFBTSxPQUFPLGdCQUFnQjtJQU8zQjtRQUNFLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFTyxNQUFNLENBQUMsV0FBVztRQUN4QixJQUFJLGdCQUFnQixDQUFDLFFBQVEsSUFBSSxJQUFJLEVBQUU7WUFDckMsZ0JBQWdCLENBQUMsUUFBUSxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztTQUNwRDtRQUNELE9BQU8sZ0JBQWdCLENBQUMsUUFBUSxDQUFDO0lBQ25DLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFvQjtRQUM1QyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFvQjtRQUM1QyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsTUFBTSxDQUFDLGVBQWUsQ0FBQyxHQUFvQjtRQUN6QyxPQUFPLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxNQUFNLENBQUMsZUFBZSxDQUFDLEdBQW9CLEVBQUUsV0FBeUI7UUFFcEUsT0FBTyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRU8sTUFBTSxDQUFDLFdBQVcsQ0FDdEIsR0FBb0IsRUFBRSxXQUEwQixFQUNoRCxXQUF5QjtRQUMzQixNQUFNLGFBQWEsR0FBZ0IsRUFBRSxDQUFDO1FBQ3RDLE1BQU0sT0FBTyxHQUFHLFdBQVcsS0FBSyxNQUFNLENBQUMsQ0FBQztZQUNwQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUM1QyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxXQUFXLENBQUM7UUFDL0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUN2QixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3pDLElBQUksT0FBTyxLQUFLLElBQUksRUFBRTtnQkFDcEIsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUM3QjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxhQUFhLENBQUM7SUFDdkIsQ0FBQztDQUNGO0FBRUQsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxVQUFvQixFQUFFLEVBQUUsQ0FDdkQsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEQsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxVQUFvQixFQUFFLEVBQUUsQ0FDdkQsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEQsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFHLENBQUMsR0FBb0IsRUFBRSxFQUFFLENBQ3BELGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMxQyxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQ3hCLENBQUMsR0FBb0IsRUFBRSxXQUF5QixFQUFFLEVBQUUsQ0FDaEQsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtJT0hhbmRsZXIsIExvYWRPcHRpb25zfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IHR5cGUgSU9Sb3V0ZXIgPSAodXJsOiBzdHJpbmd8c3RyaW5nW10sIGxvYWRPcHRpb25zPzogTG9hZE9wdGlvbnMpID0+XG4gICAgSU9IYW5kbGVyO1xuXG5leHBvcnQgY2xhc3MgSU9Sb3V0ZXJSZWdpc3RyeSB7XG4gIC8vIFNpbmdsZXRvbiBpbnN0YW5jZS5cbiAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IElPUm91dGVyUmVnaXN0cnk7XG5cbiAgcHJpdmF0ZSBzYXZlUm91dGVyczogSU9Sb3V0ZXJbXTtcbiAgcHJpdmF0ZSBsb2FkUm91dGVyczogSU9Sb3V0ZXJbXTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2F2ZVJvdXRlcnMgPSBbXTtcbiAgICB0aGlzLmxvYWRSb3V0ZXJzID0gW107XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBJT1JvdXRlclJlZ2lzdHJ5IHtcbiAgICBpZiAoSU9Sb3V0ZXJSZWdpc3RyeS5pbnN0YW5jZSA9PSBudWxsKSB7XG4gICAgICBJT1JvdXRlclJlZ2lzdHJ5Lmluc3RhbmNlID0gbmV3IElPUm91dGVyUmVnaXN0cnkoKTtcbiAgICB9XG4gICAgcmV0dXJuIElPUm91dGVyUmVnaXN0cnkuaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBzYXZlLWhhbmRsZXIgcm91dGVyLlxuICAgKlxuICAgKiBAcGFyYW0gc2F2ZVJvdXRlciBBIGZ1bmN0aW9uIHRoYXQgbWFwcyBhIFVSTC1saWtlIHN0cmluZyBvbnRvIGFuIGluc3RhbmNlXG4gICAqIG9mIGBJT0hhbmRsZXJgIHdpdGggdGhlIGBzYXZlYCBtZXRob2QgZGVmaW5lZCBvciBgbnVsbGAuXG4gICAqL1xuICBzdGF0aWMgcmVnaXN0ZXJTYXZlUm91dGVyKHNhdmVSb3V0ZXI6IElPUm91dGVyKSB7XG4gICAgSU9Sb3V0ZXJSZWdpc3RyeS5nZXRJbnN0YW5jZSgpLnNhdmVSb3V0ZXJzLnB1c2goc2F2ZVJvdXRlcik7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBsb2FkLWhhbmRsZXIgcm91dGVyLlxuICAgKlxuICAgKiBAcGFyYW0gbG9hZFJvdXRlciBBIGZ1bmN0aW9uIHRoYXQgbWFwcyBhIFVSTC1saWtlIHN0cmluZyBvbnRvIGFuIGluc3RhbmNlXG4gICAqIG9mIGBJT0hhbmRsZXJgIHdpdGggdGhlIGBsb2FkYCBtZXRob2QgZGVmaW5lZCBvciBgbnVsbGAuXG4gICAqL1xuICBzdGF0aWMgcmVnaXN0ZXJMb2FkUm91dGVyKGxvYWRSb3V0ZXI6IElPUm91dGVyKSB7XG4gICAgSU9Sb3V0ZXJSZWdpc3RyeS5nZXRJbnN0YW5jZSgpLmxvYWRSb3V0ZXJzLnB1c2gobG9hZFJvdXRlcik7XG4gIH1cblxuICAvKipcbiAgICogTG9vayB1cCBJT0hhbmRsZXIgZm9yIHNhdmluZywgZ2l2ZW4gYSBVUkwtbGlrZSBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHJldHVybnMgSWYgb25seSBvbmUgbWF0Y2ggaXMgZm91bmQsIGFuIGluc3RhbmNlIG9mIElPSGFuZGxlciB3aXRoIHRoZVxuICAgKiBgc2F2ZWAgbWV0aG9kIGRlZmluZWQuIElmIG5vIG1hdGNoIGlzIGZvdW5kLCBgbnVsbGAuXG4gICAqIEB0aHJvd3MgRXJyb3IsIGlmIG1vcmUgdGhhbiBvbmUgbWF0Y2ggaXMgZm91bmQuXG4gICAqL1xuICBzdGF0aWMgZ2V0U2F2ZUhhbmRsZXJzKHVybDogc3RyaW5nfHN0cmluZ1tdKTogSU9IYW5kbGVyW10ge1xuICAgIHJldHVybiBJT1JvdXRlclJlZ2lzdHJ5LmdldEhhbmRsZXJzKHVybCwgJ3NhdmUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb29rIHVwIElPSGFuZGxlciBmb3IgbG9hZGluZywgZ2l2ZW4gYSBVUkwtbGlrZSBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHBhcmFtIGxvYWRPcHRpb25zIE9wdGlvbmFsLCBjdXN0b20gbG9hZCBvcHRpb25zLlxuICAgKiBAcmV0dXJucyBBbGwgdmFsaWQgaGFuZGxlcnMgZm9yIGB1cmxgLCBnaXZlbiB0aGUgY3VycmVudGx5IHJlZ2lzdGVyZWRcbiAgICogICBoYW5kbGVyIHJvdXRlcnMuXG4gICAqL1xuICBzdGF0aWMgZ2V0TG9hZEhhbmRsZXJzKHVybDogc3RyaW5nfHN0cmluZ1tdLCBsb2FkT3B0aW9ucz86IExvYWRPcHRpb25zKTpcbiAgICAgIElPSGFuZGxlcltdIHtcbiAgICByZXR1cm4gSU9Sb3V0ZXJSZWdpc3RyeS5nZXRIYW5kbGVycyh1cmwsICdsb2FkJywgbG9hZE9wdGlvbnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZ2V0SGFuZGxlcnMoXG4gICAgICB1cmw6IHN0cmluZ3xzdHJpbmdbXSwgaGFuZGxlclR5cGU6ICdzYXZlJ3wnbG9hZCcsXG4gICAgICBsb2FkT3B0aW9ucz86IExvYWRPcHRpb25zKTogSU9IYW5kbGVyW10ge1xuICAgIGNvbnN0IHZhbGlkSGFuZGxlcnM6IElPSGFuZGxlcltdID0gW107XG4gICAgY29uc3Qgcm91dGVycyA9IGhhbmRsZXJUeXBlID09PSAnbG9hZCcgP1xuICAgICAgICBJT1JvdXRlclJlZ2lzdHJ5LmdldEluc3RhbmNlKCkubG9hZFJvdXRlcnMgOlxuICAgICAgICBJT1JvdXRlclJlZ2lzdHJ5LmdldEluc3RhbmNlKCkuc2F2ZVJvdXRlcnM7XG4gICAgcm91dGVycy5mb3JFYWNoKHJvdXRlciA9PiB7XG4gICAgICBjb25zdCBoYW5kbGVyID0gcm91dGVyKHVybCwgbG9hZE9wdGlvbnMpO1xuICAgICAgaWYgKGhhbmRsZXIgIT09IG51bGwpIHtcbiAgICAgICAgdmFsaWRIYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB2YWxpZEhhbmRsZXJzO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCByZWdpc3RlclNhdmVSb3V0ZXIgPSAobG91ZFJvdXRlcjogSU9Sb3V0ZXIpID0+XG4gICAgSU9Sb3V0ZXJSZWdpc3RyeS5yZWdpc3RlclNhdmVSb3V0ZXIobG91ZFJvdXRlcik7XG5leHBvcnQgY29uc3QgcmVnaXN0ZXJMb2FkUm91dGVyID0gKGxvdWRSb3V0ZXI6IElPUm91dGVyKSA9PlxuICAgIElPUm91dGVyUmVnaXN0cnkucmVnaXN0ZXJMb2FkUm91dGVyKGxvdWRSb3V0ZXIpO1xuZXhwb3J0IGNvbnN0IGdldFNhdmVIYW5kbGVycyA9ICh1cmw6IHN0cmluZ3xzdHJpbmdbXSkgPT5cbiAgICBJT1JvdXRlclJlZ2lzdHJ5LmdldFNhdmVIYW5kbGVycyh1cmwpO1xuZXhwb3J0IGNvbnN0IGdldExvYWRIYW5kbGVycyA9XG4gICAgKHVybDogc3RyaW5nfHN0cmluZ1tdLCBsb2FkT3B0aW9ucz86IExvYWRPcHRpb25zKSA9PlxuICAgICAgICBJT1JvdXRlclJlZ2lzdHJ5LmdldExvYWRIYW5kbGVycyh1cmwsIGxvYWRPcHRpb25zKTtcbiJdfQ==