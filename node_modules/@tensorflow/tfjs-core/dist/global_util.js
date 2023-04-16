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
// Note that the identifier globalNameSpace is scoped to this module, but will
// always resolve to the same global object regardless of how the module is
// resolved.
// tslint:disable-next-line:no-any
let globalNameSpace;
// tslint:disable-next-line:no-any
export function getGlobalNamespace() {
    if (globalNameSpace == null) {
        // tslint:disable-next-line:no-any
        let ns;
        if (typeof (window) !== 'undefined') {
            ns = window;
        }
        else if (typeof (global) !== 'undefined') {
            ns = global;
        }
        else if (typeof (process) !== 'undefined') {
            ns = process;
        }
        else if (typeof (self) !== 'undefined') {
            ns = self;
        }
        else {
            throw new Error('Could not find a global object');
        }
        globalNameSpace = ns;
    }
    return globalNameSpace;
}
// tslint:disable-next-line:no-any
function getGlobalMap() {
    const ns = getGlobalNamespace();
    if (ns._tfGlobals == null) {
        ns._tfGlobals = new Map();
    }
    return ns._tfGlobals;
}
/**
 * Returns a globally accessible 'singleton' object.
 *
 * @param key the name of the object
 * @param init a function to initialize to initialize this object
 *             the first time it is fetched.
 */
export function getGlobal(key, init) {
    const globalMap = getGlobalMap();
    if (globalMap.has(key)) {
        return globalMap.get(key);
    }
    else {
        const singleton = init();
        globalMap.set(key, singleton);
        return globalMap.get(key);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2dsb2JhbF91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILDhFQUE4RTtBQUM5RSwyRUFBMkU7QUFDM0UsWUFBWTtBQUNaLGtDQUFrQztBQUNsQyxJQUFJLGVBQStDLENBQUM7QUFDcEQsa0NBQWtDO0FBQ2xDLE1BQU0sVUFBVSxrQkFBa0I7SUFDaEMsSUFBSSxlQUFlLElBQUksSUFBSSxFQUFFO1FBQzNCLGtDQUFrQztRQUNsQyxJQUFJLEVBQU8sQ0FBQztRQUNaLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLFdBQVcsRUFBRTtZQUNuQyxFQUFFLEdBQUcsTUFBTSxDQUFDO1NBQ2I7YUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxXQUFXLEVBQUU7WUFDMUMsRUFBRSxHQUFHLE1BQU0sQ0FBQztTQUNiO2FBQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssV0FBVyxFQUFFO1lBQzNDLEVBQUUsR0FBRyxPQUFPLENBQUM7U0FDZDthQUFNLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLFdBQVcsRUFBRTtZQUN4QyxFQUFFLEdBQUcsSUFBSSxDQUFDO1NBQ1g7YUFBTTtZQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztTQUNuRDtRQUNELGVBQWUsR0FBRyxFQUFFLENBQUM7S0FDdEI7SUFDRCxPQUFPLGVBQWUsQ0FBQztBQUN6QixDQUFDO0FBRUQsa0NBQWtDO0FBQ2xDLFNBQVMsWUFBWTtJQUNuQixNQUFNLEVBQUUsR0FBRyxrQkFBa0IsRUFBRSxDQUFDO0lBQ2hDLElBQUksRUFBRSxDQUFDLFVBQVUsSUFBSSxJQUFJLEVBQUU7UUFDekIsRUFBRSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0tBQzNCO0lBQ0QsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDO0FBQ3ZCLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLFVBQVUsU0FBUyxDQUFJLEdBQVcsRUFBRSxJQUFhO0lBQ3JELE1BQU0sU0FBUyxHQUFHLFlBQVksRUFBRSxDQUFDO0lBQ2pDLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUN0QixPQUFPLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDM0I7U0FBTTtRQUNMLE1BQU0sU0FBUyxHQUFHLElBQUksRUFBRSxDQUFDO1FBQ3pCLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzlCLE9BQU8sU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMzQjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbi8vIE5vdGUgdGhhdCB0aGUgaWRlbnRpZmllciBnbG9iYWxOYW1lU3BhY2UgaXMgc2NvcGVkIHRvIHRoaXMgbW9kdWxlLCBidXQgd2lsbFxuLy8gYWx3YXlzIHJlc29sdmUgdG8gdGhlIHNhbWUgZ2xvYmFsIG9iamVjdCByZWdhcmRsZXNzIG9mIGhvdyB0aGUgbW9kdWxlIGlzXG4vLyByZXNvbHZlZC5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbmxldCBnbG9iYWxOYW1lU3BhY2U6IHtfdGZHbG9iYWxzOiBNYXA8c3RyaW5nLCBhbnk+fTtcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbmV4cG9ydCBmdW5jdGlvbiBnZXRHbG9iYWxOYW1lc3BhY2UoKToge190Zkdsb2JhbHM6IE1hcDxzdHJpbmcsIGFueT59IHtcbiAgaWYgKGdsb2JhbE5hbWVTcGFjZSA9PSBudWxsKSB7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgIGxldCBuczogYW55O1xuICAgIGlmICh0eXBlb2YgKHdpbmRvdykgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBucyA9IHdpbmRvdztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiAoZ2xvYmFsKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIG5zID0gZ2xvYmFsO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIChwcm9jZXNzKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIG5zID0gcHJvY2VzcztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiAoc2VsZikgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBucyA9IHNlbGY7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGZpbmQgYSBnbG9iYWwgb2JqZWN0Jyk7XG4gICAgfVxuICAgIGdsb2JhbE5hbWVTcGFjZSA9IG5zO1xuICB9XG4gIHJldHVybiBnbG9iYWxOYW1lU3BhY2U7XG59XG5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbmZ1bmN0aW9uIGdldEdsb2JhbE1hcCgpOiBNYXA8c3RyaW5nLCBhbnk+IHtcbiAgY29uc3QgbnMgPSBnZXRHbG9iYWxOYW1lc3BhY2UoKTtcbiAgaWYgKG5zLl90Zkdsb2JhbHMgPT0gbnVsbCkge1xuICAgIG5zLl90Zkdsb2JhbHMgPSBuZXcgTWFwKCk7XG4gIH1cbiAgcmV0dXJuIG5zLl90Zkdsb2JhbHM7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGdsb2JhbGx5IGFjY2Vzc2libGUgJ3NpbmdsZXRvbicgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSBrZXkgdGhlIG5hbWUgb2YgdGhlIG9iamVjdFxuICogQHBhcmFtIGluaXQgYSBmdW5jdGlvbiB0byBpbml0aWFsaXplIHRvIGluaXRpYWxpemUgdGhpcyBvYmplY3RcbiAqICAgICAgICAgICAgIHRoZSBmaXJzdCB0aW1lIGl0IGlzIGZldGNoZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRHbG9iYWw8VD4oa2V5OiBzdHJpbmcsIGluaXQ6ICgpID0+IFQpOiBUIHtcbiAgY29uc3QgZ2xvYmFsTWFwID0gZ2V0R2xvYmFsTWFwKCk7XG4gIGlmIChnbG9iYWxNYXAuaGFzKGtleSkpIHtcbiAgICByZXR1cm4gZ2xvYmFsTWFwLmdldChrZXkpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHNpbmdsZXRvbiA9IGluaXQoKTtcbiAgICBnbG9iYWxNYXAuc2V0KGtleSwgc2luZ2xldG9uKTtcbiAgICByZXR1cm4gZ2xvYmFsTWFwLmdldChrZXkpO1xuICB9XG59XG4iXX0=