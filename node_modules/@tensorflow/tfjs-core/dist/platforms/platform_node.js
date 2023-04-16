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
import { env } from '../environment';
// We are wrapping this within an object so it can be stubbed by Jasmine.
export const getNodeFetch = {
    // tslint:disable-next-line:no-require-imports
    importFetch: () => require('node-fetch')
};
let systemFetch;
// These getters and setters are for testing so we don't export a mutable
// variable.
export function resetSystemFetch() {
    systemFetch = null;
}
export function setSystemFetch(fetchFn) {
    systemFetch = fetchFn;
}
export function getSystemFetch() {
    return systemFetch;
}
export class PlatformNode {
    constructor() {
        // tslint:disable-next-line:no-require-imports
        this.util = require('util');
        // According to the spec, the built-in encoder can do only UTF-8 encoding.
        // https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder/TextEncoder
        this.textEncoder = new this.util.TextEncoder();
    }
    fetch(path, requestInits) {
        if (env().global.fetch != null) {
            return env().global.fetch(path, requestInits);
        }
        if (systemFetch == null) {
            systemFetch = getNodeFetch.importFetch();
        }
        return systemFetch(path, requestInits);
    }
    now() {
        const time = process.hrtime();
        return time[0] * 1000 + time[1] / 1000000;
    }
    encode(text, encoding) {
        if (encoding !== 'utf-8' && encoding !== 'utf8') {
            throw new Error(`Node built-in encoder only supports utf-8, but got ${encoding}`);
        }
        return this.textEncoder.encode(text);
    }
    decode(bytes, encoding) {
        if (bytes.length === 0) {
            return '';
        }
        return new this.util.TextDecoder(encoding).decode(bytes);
    }
}
if (env().get('IS_NODE') && !env().get('IS_BROWSER')) {
    env().setPlatform('node', new PlatformNode());
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm1fbm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvcGxhdGZvcm1zL3BsYXRmb3JtX25vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBR25DLHlFQUF5RTtBQUN6RSxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUc7SUFDMUIsOENBQThDO0lBQzlDLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO0NBQ3pDLENBQUM7QUFHRixJQUFJLFdBQW9CLENBQUM7QUFDekIseUVBQXlFO0FBQ3pFLFlBQVk7QUFDWixNQUFNLFVBQVUsZ0JBQWdCO0lBQzlCLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDckIsQ0FBQztBQUNELE1BQU0sVUFBVSxjQUFjLENBQUMsT0FBZ0I7SUFDN0MsV0FBVyxHQUFHLE9BQU8sQ0FBQztBQUN4QixDQUFDO0FBQ0QsTUFBTSxVQUFVLGNBQWM7SUFDNUIsT0FBTyxXQUFXLENBQUM7QUFDckIsQ0FBQztBQUVELE1BQU0sT0FBTyxZQUFZO0lBS3ZCO1FBQ0UsOENBQThDO1FBQzlDLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLDBFQUEwRTtRQUMxRSwyRUFBMkU7UUFDM0UsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDakQsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFZLEVBQUUsWUFBMEI7UUFDNUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRTtZQUM5QixPQUFPLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1NBQy9DO1FBRUQsSUFBSSxXQUFXLElBQUksSUFBSSxFQUFFO1lBQ3ZCLFdBQVcsR0FBRyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDMUM7UUFDRCxPQUFPLFdBQVcsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELEdBQUc7UUFDRCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDOUIsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUM7SUFDNUMsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFZLEVBQUUsUUFBZ0I7UUFDbkMsSUFBSSxRQUFRLEtBQUssT0FBTyxJQUFJLFFBQVEsS0FBSyxNQUFNLEVBQUU7WUFDL0MsTUFBTSxJQUFJLEtBQUssQ0FDWCxzREFBc0QsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUN2RTtRQUNELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFpQixFQUFFLFFBQWdCO1FBQ3hDLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDdEIsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0QsQ0FBQztDQUNGO0FBRUQsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUU7SUFDcEQsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLFlBQVksRUFBRSxDQUFDLENBQUM7Q0FDL0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQge2Vudn0gZnJvbSAnLi4vZW52aXJvbm1lbnQnO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnLi9wbGF0Zm9ybSc7XG5cbi8vIFdlIGFyZSB3cmFwcGluZyB0aGlzIHdpdGhpbiBhbiBvYmplY3Qgc28gaXQgY2FuIGJlIHN0dWJiZWQgYnkgSmFzbWluZS5cbmV4cG9ydCBjb25zdCBnZXROb2RlRmV0Y2ggPSB7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1yZXF1aXJlLWltcG9ydHNcbiAgaW1wb3J0RmV0Y2g6ICgpID0+IHJlcXVpcmUoJ25vZGUtZmV0Y2gnKVxufTtcblxudHlwZSBGZXRjaEZuID0gKHVybDogc3RyaW5nLCBpbml0PzogUmVxdWVzdEluaXQpID0+IFByb21pc2U8UmVzcG9uc2U+O1xubGV0IHN5c3RlbUZldGNoOiBGZXRjaEZuO1xuLy8gVGhlc2UgZ2V0dGVycyBhbmQgc2V0dGVycyBhcmUgZm9yIHRlc3Rpbmcgc28gd2UgZG9uJ3QgZXhwb3J0IGEgbXV0YWJsZVxuLy8gdmFyaWFibGUuXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRTeXN0ZW1GZXRjaCgpIHtcbiAgc3lzdGVtRmV0Y2ggPSBudWxsO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNldFN5c3RlbUZldGNoKGZldGNoRm46IEZldGNoRm4pIHtcbiAgc3lzdGVtRmV0Y2ggPSBmZXRjaEZuO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFN5c3RlbUZldGNoKCk6IEZldGNoRm4ge1xuICByZXR1cm4gc3lzdGVtRmV0Y2g7XG59XG5cbmV4cG9ydCBjbGFzcyBQbGF0Zm9ybU5vZGUgaW1wbGVtZW50cyBQbGF0Zm9ybSB7XG4gIHByaXZhdGUgdGV4dEVuY29kZXI6IFRleHRFbmNvZGVyO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gIHV0aWw6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgdGhpcy51dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuICAgIC8vIEFjY29yZGluZyB0byB0aGUgc3BlYywgdGhlIGJ1aWx0LWluIGVuY29kZXIgY2FuIGRvIG9ubHkgVVRGLTggZW5jb2RpbmcuXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1RleHRFbmNvZGVyL1RleHRFbmNvZGVyXG4gICAgdGhpcy50ZXh0RW5jb2RlciA9IG5ldyB0aGlzLnV0aWwuVGV4dEVuY29kZXIoKTtcbiAgfVxuXG4gIGZldGNoKHBhdGg6IHN0cmluZywgcmVxdWVzdEluaXRzPzogUmVxdWVzdEluaXQpOiBQcm9taXNlPFJlc3BvbnNlPiB7XG4gICAgaWYgKGVudigpLmdsb2JhbC5mZXRjaCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gZW52KCkuZ2xvYmFsLmZldGNoKHBhdGgsIHJlcXVlc3RJbml0cyk7XG4gICAgfVxuXG4gICAgaWYgKHN5c3RlbUZldGNoID09IG51bGwpIHtcbiAgICAgIHN5c3RlbUZldGNoID0gZ2V0Tm9kZUZldGNoLmltcG9ydEZldGNoKCk7XG4gICAgfVxuICAgIHJldHVybiBzeXN0ZW1GZXRjaChwYXRoLCByZXF1ZXN0SW5pdHMpO1xuICB9XG5cbiAgbm93KCk6IG51bWJlciB7XG4gICAgY29uc3QgdGltZSA9IHByb2Nlc3MuaHJ0aW1lKCk7XG4gICAgcmV0dXJuIHRpbWVbMF0gKiAxMDAwICsgdGltZVsxXSAvIDEwMDAwMDA7XG4gIH1cblxuICBlbmNvZGUodGV4dDogc3RyaW5nLCBlbmNvZGluZzogc3RyaW5nKTogVWludDhBcnJheSB7XG4gICAgaWYgKGVuY29kaW5nICE9PSAndXRmLTgnICYmIGVuY29kaW5nICE9PSAndXRmOCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgTm9kZSBidWlsdC1pbiBlbmNvZGVyIG9ubHkgc3VwcG9ydHMgdXRmLTgsIGJ1dCBnb3QgJHtlbmNvZGluZ31gKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudGV4dEVuY29kZXIuZW5jb2RlKHRleHQpO1xuICB9XG4gIGRlY29kZShieXRlczogVWludDhBcnJheSwgZW5jb2Rpbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKGJ5dGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IHRoaXMudXRpbC5UZXh0RGVjb2RlcihlbmNvZGluZykuZGVjb2RlKGJ5dGVzKTtcbiAgfVxufVxuXG5pZiAoZW52KCkuZ2V0KCdJU19OT0RFJykgJiYgIWVudigpLmdldCgnSVNfQlJPV1NFUicpKSB7XG4gIGVudigpLnNldFBsYXRmb3JtKCdub2RlJywgbmV3IFBsYXRmb3JtTm9kZSgpKTtcbn1cbiJdfQ==