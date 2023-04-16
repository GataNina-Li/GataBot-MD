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
import { ENGINE } from '../engine';
import { isPromise } from '../util';
export const OP_SCOPE_SUFFIX = '__op';
/**
 * Used for wrapping functions that perform math operations on
 * Tensors. The function will be wrapped in a named scope that cleans all
 * memory usage after the function is done.
 */
export function op(f) {
    const keys = Object.keys(f);
    if (keys.length !== 1) {
        throw new Error(`Please provide an object with a single key ` +
            `(operation name) mapping to a function. Got an object with ` +
            `${keys.length} keys.`);
    }
    let opName = keys[0];
    const fn = f[opName];
    // Strip the underscore from the end of the function name.
    if (opName.endsWith('_')) {
        opName = opName.substring(0, opName.length - 1);
    }
    // add an __op suffix to distinguish ops from kernels in tf.profile
    opName = opName + OP_SCOPE_SUFFIX;
    // tslint:disable-next-line:no-any
    const f2 = (...args) => {
        ENGINE.startScope(opName);
        try {
            const result = fn(...args);
            if (isPromise(result)) {
                console.error('Cannot return a Promise inside of tidy.');
            }
            ENGINE.endScope(result);
            return result;
        }
        catch (ex) {
            ENGINE.endScope(null);
            throw ex;
        }
    };
    Object.defineProperty(f2, 'name', { value: opName, configurable: true });
    // tslint:disable-next-line:no-any
    return f2;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlcmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvb3BlcmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUVsQyxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDO0FBRXRDOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsRUFBRSxDQUFxQixDQUFzQjtJQUMzRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDckIsTUFBTSxJQUFJLEtBQUssQ0FDWCw2Q0FBNkM7WUFDN0MsNkRBQTZEO1lBQzdELEdBQUcsSUFBSSxDQUFDLE1BQU0sUUFBUSxDQUFDLENBQUM7S0FDN0I7SUFFRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXJCLDBEQUEwRDtJQUMxRCxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDeEIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDakQ7SUFFRCxtRUFBbUU7SUFDbkUsTUFBTSxHQUFHLE1BQU0sR0FBRyxlQUFlLENBQUM7SUFFbEMsa0NBQWtDO0lBQ2xDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFXLEVBQUUsRUFBRTtRQUM1QixNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFCLElBQUk7WUFDRixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUMzQixJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDckIsT0FBTyxDQUFDLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO2FBQzFEO1lBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4QixPQUFPLE1BQU0sQ0FBQztTQUNmO1FBQUMsT0FBTyxFQUFFLEVBQUU7WUFDWCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sRUFBRSxDQUFDO1NBQ1Y7SUFDSCxDQUFDLENBQUM7SUFDRixNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBRXZFLGtDQUFrQztJQUNsQyxPQUFPLEVBQWMsQ0FBQztBQUN4QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge2lzUHJvbWlzZX0gZnJvbSAnLi4vdXRpbCc7XG5cbmV4cG9ydCBjb25zdCBPUF9TQ09QRV9TVUZGSVggPSAnX19vcCc7XG5cbi8qKlxuICogVXNlZCBmb3Igd3JhcHBpbmcgZnVuY3Rpb25zIHRoYXQgcGVyZm9ybSBtYXRoIG9wZXJhdGlvbnMgb25cbiAqIFRlbnNvcnMuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIHdyYXBwZWQgaW4gYSBuYW1lZCBzY29wZSB0aGF0IGNsZWFucyBhbGxcbiAqIG1lbW9yeSB1c2FnZSBhZnRlciB0aGUgZnVuY3Rpb24gaXMgZG9uZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9wPFQgZXh0ZW5kcyBGdW5jdGlvbj4oZjoge1tuYW1lOiBzdHJpbmddOiBUfSk6IFQge1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZik7XG4gIGlmIChrZXlzLmxlbmd0aCAhPT0gMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFBsZWFzZSBwcm92aWRlIGFuIG9iamVjdCB3aXRoIGEgc2luZ2xlIGtleSBgICtcbiAgICAgICAgYChvcGVyYXRpb24gbmFtZSkgbWFwcGluZyB0byBhIGZ1bmN0aW9uLiBHb3QgYW4gb2JqZWN0IHdpdGggYCArXG4gICAgICAgIGAke2tleXMubGVuZ3RofSBrZXlzLmApO1xuICB9XG5cbiAgbGV0IG9wTmFtZSA9IGtleXNbMF07XG4gIGNvbnN0IGZuID0gZltvcE5hbWVdO1xuXG4gIC8vIFN0cmlwIHRoZSB1bmRlcnNjb3JlIGZyb20gdGhlIGVuZCBvZiB0aGUgZnVuY3Rpb24gbmFtZS5cbiAgaWYgKG9wTmFtZS5lbmRzV2l0aCgnXycpKSB7XG4gICAgb3BOYW1lID0gb3BOYW1lLnN1YnN0cmluZygwLCBvcE5hbWUubGVuZ3RoIC0gMSk7XG4gIH1cblxuICAvLyBhZGQgYW4gX19vcCBzdWZmaXggdG8gZGlzdGluZ3Vpc2ggb3BzIGZyb20ga2VybmVscyBpbiB0Zi5wcm9maWxlXG4gIG9wTmFtZSA9IG9wTmFtZSArIE9QX1NDT1BFX1NVRkZJWDtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gIGNvbnN0IGYyID0gKC4uLmFyZ3M6IGFueVtdKSA9PiB7XG4gICAgRU5HSU5FLnN0YXJ0U2NvcGUob3BOYW1lKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gZm4oLi4uYXJncyk7XG4gICAgICBpZiAoaXNQcm9taXNlKHJlc3VsdCkpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignQ2Fubm90IHJldHVybiBhIFByb21pc2UgaW5zaWRlIG9mIHRpZHkuJyk7XG4gICAgICB9XG4gICAgICBFTkdJTkUuZW5kU2NvcGUocmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgIEVOR0lORS5lbmRTY29wZShudWxsKTtcbiAgICAgIHRocm93IGV4O1xuICAgIH1cbiAgfTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGYyLCAnbmFtZScsIHt2YWx1ZTogb3BOYW1lLCBjb25maWd1cmFibGU6IHRydWV9KTtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gIHJldHVybiBmMiBhcyBhbnkgYXMgVDtcbn1cbiJdfQ==